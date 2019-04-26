import React, { Component, Fragment } from 'react';
import './PublishView.css';
import { PackageSet } from '../utils/path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import GitHelper from '../utils/git-helper';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView from './PublishExecutingView';
import NpmPackageHelper from '../utils/npm-package-helper';
import { Settings, AppState, PublishingInfo } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';
import { initializePublishing, updateGitStatus, selectProject, selectVersionProvider, applyNewVersion, publishPackage, rejectPublishing } from '../actions';

interface MappedProps {
  settings: Settings;
  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    settings: state.settings,
    availablePackages: state.availablePackages,
    packageSetId: state.packageSetId,
    versionProviderName: state.versionProviderName,
    newVersion: state.newVersion,
    isCustomVersionSelection: state.isCustomVersionSelection,
    isEverythingCommitted: state.isEverythingCommitted,
    publishingInfo: state.publishingInfo
  }
}

interface Dispatchers {
  initializePublishing: () => void;
  updateGitStatus: (isCommitted: boolean) => void;
  selectProject: (packageSetId: number) => void;
  selectVersionProvider: (versionProviderName: string) => void;
  applyNewVersion: (newVersion: string) => void;
  publishPackage: () => void;
  rejectPublishing: () => void;
}

const dispatchers: Dispatchers = {
  initializePublishing,
  updateGitStatus,
  selectProject,
  selectVersionProvider,
  applyNewVersion,
  publishPackage,
  rejectPublishing
}

type PublishViewProps = MappedProps & Dispatchers;

class PublishView extends Component<PublishViewProps> {
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishViewProps>) {
    super(props);

    this.props.initializePublishing();
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
        this.props.updateGitStatus(isEverythingCommitted)
      }
    }
  }

  render() {
    const content = this.props.publishingInfo
      ? (
        <PublishExecutingView
          {...this.props.publishingInfo}
          packages={this.getSelectedPackageSet().projectsInfo.map((i) => i.name)}
          packageVersion={this.props.newVersion}
          handleCloseClick={this.handleClosePublishingViewClick}
          handleRejectClick={this.handleRejectPublishingClick}
        />
      )
      : (
        <PublishSetupForm
          baseSlnPath={this.props.settings.baseSlnPath}
          packageSetId={this.props.packageSetId}
          versionProviderName={this.props.versionProviderName}
          newVersion={this.props.newVersion}
          isCustomVersionSelection={this.props.isCustomVersionSelection}
          isEverythingCommitted={this.props.isEverythingCommitted}
          getVersionProviders={this.getVersionProviders}
          getCurrentVersion={this.getCurrentVersion}
          availablePackages={this.props.availablePackages}
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
    return this.props.availablePackages.filter(p => p.id === this.props.packageSetId)[0];
  }

  handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const packageSetId = +e.target.value;
    if (isNaN(packageSetId)) {
      return;
    }

    this.props.selectProject(packageSetId);
  }

  handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value;
    this.props.selectVersionProvider(versionProviderName);
  }

  handleNewVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = e.target.value;
    this.props.applyNewVersion(newVersion);
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.props.publishPackage();
  }

  handleClosePublishingViewClick = () => {
    this.props.initializePublishing();
  }

  handleRejectPublishingClick = async () => {
    await this.props.rejectPublishing();
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
}

export default connect(mapStateToProps, dispatchers)(PublishView);
