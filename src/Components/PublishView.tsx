import React, { Component, Fragment } from 'react';
import './PublishView.css';
import IszoleaPathHelper from '../utils/iszolea-path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import ProjectPatcher from '../utils/project-patcher';
import GitHelper from '../utils/git-helper';
import DotNetHelper from '../utils/dotnet-helper';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView, { PublishingInfo } from './PublishExecutingView';
import NuGetHelper from '../utils/nuget-helper';

interface PublishViewProps {
  baseSlnPath: string;
  nuGetApiKey: string;
}

interface PublishViewState {
  project: string;
  versionProviderName: string;
  newVersion: string;
  newFileAndAssemblyVersion: string;
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
      project: '',
      versionProviderName: '',
      newVersion: '',
      newFileAndAssemblyVersion: '',
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
    const baseSlnPath = this.props.baseSlnPath
    const project = this.state.project;

    if (baseSlnPath && project) {
      const path = IszoleaPathHelper.getProjectDirPath(baseSlnPath, project);
      const isEverythingCommitted = await GitHelper.isEverythingCommitted(path);
      this.setState({ isEverythingCommitted });
    }
  }

  render() {
    const content = this.state.publishingInfo
      ? (
        <PublishExecutingView
          {...this.state.publishingInfo}
          packageName={this.state.project}
          packageVersion={this.state.newVersion}
          handleCloseClick={this.handleClosePublishingViewClick}
        />
      )
      : (
        <PublishSetupForm
          baseSlnPath={this.props.baseSlnPath}
          project={this.state.project}
          versionProviderName={this.state.versionProviderName}
          newVersion={this.state.newVersion}
          newFileAndAssemblyVersion={this.state.newFileAndAssemblyVersion}
          isCustomVersionSelection={this.state.isCustomVersionSelection}
          isEverythingCommitted={this.state.isEverythingCommitted}
          getVersionProviders={this.getVersionProviders}
          getCurrentVersion={this.getCurrentVersion}
          getAssemblyVersion={this.getAssemblyVersion}
          handleProjectChange={this.handleProjectChange}
          handleVersionProviderNameChange={this.handleVersionProviderNameChange}
          handleNewVersionChange={this.handleNewVersionChange}
          handleNewFileAndAssemblyVersionChange={this.handleNewFileAndAssemblyVersionChange}
          handleSubmit={this.handleSubmit}
        />
      )

    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }

  handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const project = e.target.value;
    const current = this.getCurrentVersion(project);
    const versionProviders = this.getVersionProviders(current).filter(p => p.canGenerateNewVersion());
    const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
    const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;

    this.setState({
      project,
      newVersion,
      versionProviderName,
      isCustomVersionSelection,
      isEverythingCommitted: undefined
    });
  }

  handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value;
    const project = this.state.project;
    const currentVersion = this.getCurrentVersion(project);
    const provider = this.getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const newVersion = provider ? provider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = provider ? provider.isCustom() : false;
    const newFileAndAssemblyVersion = isCustomVersionSelection ? this.getAssemblyVersion(project) : '';

    this.setState({ versionProviderName, newVersion, isCustomVersionSelection, newFileAndAssemblyVersion });
  }

  handleNewVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = e.target.value;

    if (this.state.isCustomVersionSelection) {
      this.setState({ newVersion });
    }
  }

  handleNewFileAndAssemblyVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFileAndAssemblyVersion = e.target.value;

    if (this.state.isCustomVersionSelection) {
      this.setState({ newFileAndAssemblyVersion });
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
      isExecuting: false
    }
    this.setState({ publishingInfo });
  }

  handleClosePublishingViewClick = () => {
    const initialState = this.getInitialState();
    this.setState(initialState);
  }

  getCurrentVersion = (project: string): string => {
    return project !== '' ? ProjectPatcher.getLocalPackageVersion(this.props.baseSlnPath, project) || '' : '';
  }

  getAssemblyVersion = (project: string): string => {
    return project !== '' ? ProjectPatcher.getLocalAssemblyVersion(this.props.baseSlnPath, project) || '' : '';
  }

  getVersionProviders = (currentVersion: string): VersionProvider[] => {
    return new VersionProviderFactory(currentVersion).getProviders();
  }

  async checkIsEverythingCommitted(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const projectDirPath = IszoleaPathHelper.getProjectDirPath(this.props.baseSlnPath, this.state.project);
    const isEverythingCommitted = await GitHelper.isEverythingCommitted(projectDirPath)
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isEverythingCommitted
    };
    this.setState({ publishingInfo });

    if (!isEverythingCommitted) {
      publishingInfo = await this.rejectPublishing(publishingInfo, 'The git repository has unsaved changes. Commit or remove them');
    }

    return publishingInfo;
  }

  async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const currentVersion = this.getCurrentVersion(this.state.project);
    const versionProvider = this.getVersionProviders(currentVersion).find((p) => p.getName() === this.state.versionProviderName);

    if (!versionProvider) {
      return await this.rejectPublishing(prevPublishingInfo, 'VersionProvider has not been found');
    }

    const assemblyAndFileVersion = this.state.isCustomVersionSelection
      ? this.state.newFileAndAssemblyVersion
      : versionProvider.getAssemblyAndFileVersion();

    if (!assemblyAndFileVersion) {
      return await this.rejectPublishing(prevPublishingInfo, 'AssemblyAndFileVersion has not been found');
    }

    const isVersionApplied = ProjectPatcher.applyNewVersion(this.state.newVersion, assemblyAndFileVersion, this.props.baseSlnPath, this.state.project);
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isVersionApplied
    }
    this.setState({ publishingInfo });

    if (!isVersionApplied) {
      publishingInfo = await this.rejectPublishing(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }

  async buildProject(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const isBuildCompleted = await DotNetHelper.buildProject(IszoleaPathHelper.getProjectFilePath(this.props.baseSlnPath, this.state.project));
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isBuildCompleted
    }
    this.setState({ publishingInfo });

    if (!isBuildCompleted) {
      publishingInfo = await this.rejectPublishing(publishingInfo, 'The project is not built');
    }

    return publishingInfo;
  }

  async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const nupkgFilePath = IszoleaPathHelper.getNupkgFilePath(this.props.baseSlnPath, this.state.project, this.state.newVersion);
    const isPackagePublished = await NuGetHelper.pushPackage(nupkgFilePath, this.props.nuGetApiKey);
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isPackagePublished
    }
    this.setState({ publishingInfo });

    if (!isPackagePublished) {
      publishingInfo = await this.rejectPublishing(publishingInfo, 'The package is not published. Check API key and connection');
    }

    return publishingInfo;
  }

  async createCommitWithTags(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const projectDirPath = IszoleaPathHelper.getProjectDirPath(this.props.baseSlnPath, this.state.project);
    const isCommitMade = await GitHelper.createCommitWithTags(projectDirPath, [`${this.state.project}.${this.state.newVersion}`]);
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isCommitMade
    }
    this.setState({ publishingInfo });

    if (!isCommitMade) {
      publishingInfo = await this.rejectPublishing(publishingInfo, 'The result commit is not created');
    }

    return publishingInfo;
  }

  async rejectPublishing(prevPublishingInfo: PublishingInfo, error: string): Promise<PublishingInfo> {
    const projectDirPath = IszoleaPathHelper.getProjectDirPath(this.props.baseSlnPath, this.state.project);
    await GitHelper.rejectChanges(projectDirPath)
    const publishingInfo = {
      ...prevPublishingInfo,
      error,
      isExecuting: false
    };
    this.setState({ publishingInfo });

    return publishingInfo;
  }
}

export default PublishView;
