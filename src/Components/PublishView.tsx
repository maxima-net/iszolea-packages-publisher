import React, { Component, Fragment } from 'react';
import './PublishView.css';
import PathHelper, { PackageSet } from '../utils/path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import GitHelper from '../utils/git-helper';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView, { PublishingInfo } from './PublishExecutingView';
import NpmPackageHelper from '../utils/npm-package-helper';
import { PublishingStrategy, PublishingOptions, PublishingStrategyFactory } from '../publishing-strategies';
import { Settings, AppState } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';

interface PublishViewState {
  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
}

interface MappedProps {
  settings: Settings;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    settings: state.settings
  }
}

type PublishViewProps = MappedProps;

class PublishView extends Component<PublishViewProps, PublishViewState> {
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishViewProps>) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): PublishViewState {
    return {
      packageSetId: undefined,
      availablePackages: PathHelper.getPackagesSets(this.props.settings.baseSlnPath, this.props.settings.uiPackageJsonPath),
      versionProviderName: '',
      newVersion: '',
      isCustomVersionSelection: false,
      isEverythingCommitted: undefined,
      publishingInfo: undefined
    }
  }

  componentDidMount() {
    this.gitTimer = setInterval(this.checkGitRepository, 3000);
  }

  componentWillUnmount(): void {
    if (this.gitTimer) {
      clearInterval(this.gitTimer)
    }
  }

  checkGitRepository = async (): Promise<void> => {
    const set = this.getSelectedPackageSet();
    const projectDir = set && set.projectsInfo && set.projectsInfo[0].dir;

    if (projectDir) {
      if (projectDir) {
        const isEverythingCommitted = await GitHelper.isEverythingCommitted(projectDir);
        this.setState({ isEverythingCommitted });
      }
    }
  }

  render() {
    const content = this.state.publishingInfo
      ? (
        <PublishExecutingView
          {...this.state.publishingInfo}
          packages={this.getSelectedPackageSet().projectsInfo.map((i) => i.name)}
          packageVersion={this.state.newVersion}
          handleCloseClick={this.handleClosePublishingViewClick}
          handleRejectClick={this.handleRejectPublishingClick}
        />
      )
      : (
        <PublishSetupForm
          baseSlnPath={this.props.settings.baseSlnPath}
          packageSetId={this.state.packageSetId}
          versionProviderName={this.state.versionProviderName}
          newVersion={this.state.newVersion}
          isCustomVersionSelection={this.state.isCustomVersionSelection}
          isEverythingCommitted={this.state.isEverythingCommitted}
          getVersionProviders={this.getVersionProviders}
          getCurrentVersion={this.getCurrentVersion}
          availablePackages={this.state.availablePackages}
          handleProjectChange={this.handleProjectChange}
          handleVersionProviderNameChange={this.handleVersionProviderNameChange}
          handleNewVersionChange={this.handleNewVersionChange}
          handleSubmit={this.handleSubmit}
        />
      )

    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }

  getSelectedPackageSet(): PackageSet {
    return this.state.availablePackages.filter(p => p.id === this.state.packageSetId)[0]
  }

  handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const packageSetId = +e.target.value;
    if (isNaN(packageSetId)) {
      return;
    }
    const projectSet = this.state.availablePackages.filter(p => p.id === packageSetId)[0];
    const current = this.getCurrentVersion(projectSet);
    const versionProviders = this.getVersionProviders(current).filter(p => p.canGenerateNewVersion());
    const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
    const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;

    this.setState({
      packageSetId,
      newVersion,
      versionProviderName,
      isCustomVersionSelection,
      isEverythingCommitted: undefined
    });
  }

  handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value;
    const packageSet = this.getSelectedPackageSet();
    const currentVersion = this.getCurrentVersion(packageSet);
    const provider = this.getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const newVersion = provider ? provider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = provider ? provider.isCustom() : false;

    this.setState({ versionProviderName, newVersion, isCustomVersionSelection });
  }

  handleNewVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.state.isCustomVersionSelection) {
      const newVersion = e.target.value;
      this.setState({ newVersion });
    }
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let publishingInfo: PublishingInfo = {
      isExecuting: true
    };
    this.setState({ publishingInfo });

    const strategy = this.getPublishingStrategy();

    publishingInfo = await strategy.publish(publishingInfo);

    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = {
      ...publishingInfo,
      isRejectAllowed: true,
      isExecuting: false
    }
    this.setState({ publishingInfo });
  }

  handleClosePublishingViewClick = () => {
    const initialState = this.getInitialState();
    this.setState(initialState);
  }

  handleRejectPublishingClick = async () => {
    if (!this.state.publishingInfo) {
      return;
    }
    await this.getPublishingStrategy().rejectPublishing(this.state.publishingInfo);
  }

  getCurrentVersion = (packageSet: PackageSet): string => {
    if (!packageSet)
      return ''

    if (packageSet.isNuget) {
      const packageName = packageSet.projectsInfo[0].name;
      return packageName !== '' ? DotNetProjectHelper.getLocalPackageVersion(this.props.settings.baseSlnPath, packageName) || '' : '';
    } else {
      return NpmPackageHelper.getLocalPackageVersion(this.props.settings.uiPackageJsonPath) || '';
    }
  }

  getVersionProviders = (currentVersion: string): VersionProvider[] => {
    return new VersionProviderFactory(currentVersion).getProviders();
  }

  getPublishingStrategy(): PublishingStrategy {
    const options: PublishingOptions = {
      newVersion: this.state.newVersion,
      settings: this.props.settings,
      onPublishingInfoChange: (publishingInfo) => this.setState({ publishingInfo }),
      packageSet: this.getSelectedPackageSet()
    }

    return new PublishingStrategyFactory().getStrategy(options);
  }
}

export default connect(mapStateToProps)(PublishView);
