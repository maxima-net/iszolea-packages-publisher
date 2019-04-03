import React, { Component, Fragment } from 'react';
import './PublishView.css';
import PathHelper, { PackageSet } from '../utils/path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import ProjectPatcher from '../utils/project-patcher';
import GitHelper from '../utils/git-helper';
import DotNetHelper from '../utils/dotnet-helper';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView, { PublishingInfo } from './PublishExecutingView';
import NuGetHelper from '../utils/nuget-helper';
import { VersionHelper } from '../utils/version-helper';

interface PublishViewProps {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
}

interface PublishViewState {
  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
}

class PublishView extends Component<PublishViewProps, PublishViewState> {
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishViewProps>) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState(): PublishViewState {
    return {
      packageSetId: undefined,
      availablePackages: PathHelper.getPackagesSets(this.props.baseSlnPath, this.props.uiPackageJsonPath),
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
    const project = set && set.names[0];

    if (project) {
      let projectDir: string | undefined = undefined;

      if (set.isNuget && this.props.baseSlnPath) {
        projectDir = PathHelper.getProjectDir(this.props.baseSlnPath, project);
      } else if (!set.isNuget && this.props.uiPackageJsonPath) {
        projectDir = PathHelper.getUiPackageDir(this.props.uiPackageJsonPath);
      }

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
          packages={this.getSelectedPackageSet().names}
          packageVersion={this.state.newVersion}
          handleCloseClick={this.handleClosePublishingViewClick}
          handleRejectClick={this.handleRejectPublishingClick}
        />
      )
      : (
        <PublishSetupForm
          baseSlnPath={this.props.baseSlnPath}
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

    publishingInfo = await this.checkIsEverythingCommitted(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = await this.applyNewVersion(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = await this.buildProject(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = await this.pushPackage(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
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
    await this.rejectPublishing();
  }

  getCurrentVersion = (packageSet: PackageSet): string => {
    if (!packageSet)
      return ''

    if (packageSet.isNuget) {
      const packageName = packageSet.names[0];
      return packageName !== '' ? ProjectPatcher.getLocalPackageVersion(this.props.baseSlnPath, packageName) || '' : '';
    }

    return 'N/A';
  }

  getVersionProviders = (currentVersion: string): VersionProvider[] => {
    return new VersionProviderFactory(currentVersion).getProviders();
  }

  async checkIsEverythingCommitted(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const projectDirPath = PathHelper.getProjectDir(this.props.baseSlnPath, this.getSelectedPackageSet().names[0]);
    const isEverythingCommitted = await GitHelper.isEverythingCommitted(projectDirPath)
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isEverythingCommitted
    };
    this.setState({ publishingInfo });

    if (!isEverythingCommitted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The git repository has unsaved changes. Commit or remove them');
    }

    return publishingInfo;
  }

  async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;
    const packageSet = this.getSelectedPackageSet();

    for (const project of packageSet.names) {
      const currentVersion = this.getCurrentVersion(packageSet);
      const versionProvider = this.getVersionProviders(currentVersion).find((p) => p.getName() === this.state.versionProviderName);

      if (!versionProvider) {
        return await this.rejectLocalChanges(prevPublishingInfo, 'VersionProvider has not been found');
      }

      const assemblyAndFileVersion = VersionHelper.getFileAndAssemblyVersion(this.state.newVersion);

      if (!assemblyAndFileVersion) {
        return await this.rejectLocalChanges(prevPublishingInfo, 'AssemblyAndFileVersion has not been found');
      }

      isVersionApplied = isVersionApplied && ProjectPatcher.applyNewVersion(this.state.newVersion, assemblyAndFileVersion, this.props.baseSlnPath, project);
    }

    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isVersionApplied
    }
    this.setState({ publishingInfo });

    if (!isVersionApplied) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }

  async buildProject(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isBuildCompleted = true;
    for (const project of this.getSelectedPackageSet().names) {
      isBuildCompleted = isBuildCompleted && await DotNetHelper.buildProject(PathHelper.getProjectFilePath(this.props.baseSlnPath, project));
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isBuildCompleted
    }
    this.setState({ publishingInfo });

    if (!isBuildCompleted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The project is not built. See a log file for details');
    }

    return publishingInfo;
  }

  async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isPackagePublished = true;
    for (const project of this.getSelectedPackageSet().names) {
      const nupkgFilePath = PathHelper.getNupkgFilePath(this.props.baseSlnPath, project, this.state.newVersion);
      isPackagePublished = isPackagePublished && await NuGetHelper.pushPackage(nupkgFilePath, this.props.nuGetApiKey);
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isPackagePublished
    }
    this.setState({ publishingInfo });

    if (!isPackagePublished) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The package is not published. Check an API key and connection. See a log file for details');
    }

    return publishingInfo;
  }

  async createCommitWithTags(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const packages = this.getSelectedPackageSet().names;
    for (const project of packages) {
      const projectDirPath = PathHelper.getProjectDir(this.props.baseSlnPath, project)
      await GitHelper.stageFiles(projectDirPath);
    }
    const projectDirPath = PathHelper.getProjectDir(this.props.baseSlnPath, packages[0]);
    const tags = this.getVersionTags();
    const isCommitMade = await GitHelper.createCommitWithTags(projectDirPath, tags);
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isCommitMade
    }
    this.setState({ publishingInfo });

    if (!isCommitMade) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The result commit is not created');
    }

    return publishingInfo;
  }

  async rejectLocalChanges(prevPublishingInfo: PublishingInfo, error: string): Promise<PublishingInfo> {
    const projectDirPath = PathHelper.getProjectDir(this.props.baseSlnPath, this.getSelectedPackageSet().names[0]);
    await GitHelper.resetChanges(projectDirPath)
    const publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      error,
      isRejected: true,
      isRejectAllowed: false,
      isExecuting: false
    };
    this.setState({ publishingInfo });

    return publishingInfo;
  }

  async rejectPublishing(): Promise<void> {
    let publishingInfo: PublishingInfo = {
      ...this.state.publishingInfo,
      isExecuting: true
    }
    this.setState({ publishingInfo });

    for (const project of this.getSelectedPackageSet().names) {
      await NuGetHelper.deletePackage(project, this.state.newVersion, this.props.nuGetApiKey);
    }

    const projectDirPath = PathHelper.getProjectDir(this.props.baseSlnPath, this.getSelectedPackageSet().names[0]);
    await GitHelper.removeLastCommitAndTags(projectDirPath, this.getVersionTags());
    publishingInfo = {
      ...this.state.publishingInfo,
      isRejected: true,
      isRejectAllowed: false,
      isExecuting: false
    };
    this.setState({ publishingInfo });
  }

  getVersionTags(): string[] {
    const packages = this.getSelectedPackageSet().names;
    return packages.map(p => {
      return `${p}.${this.state.newVersion}`
    });
  }
}

export default PublishView;
