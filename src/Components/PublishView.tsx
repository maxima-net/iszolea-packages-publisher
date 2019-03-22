import React, { Component } from 'react';
import './PublishView.css';
import IszoleaPathHelper from '../iszolea-path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import ProjectPatcher from '../project-patcher';
import GitHelper from '../git-helper';
import DotNetHelper from '../dot-net-helper';
import PublishSetupForm from './PublishSetupForm';

interface PublishViewProps {
  baseSlnPath: string;
}

interface PublishViewState {
  project: string;
  versionProviderName: string;
  newVersion: string;
  newFileAndAssemblyVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
}

class PublishView extends Component<PublishViewProps, PublishViewState> {
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishViewProps>) {
    super(props);
    
    this.state = {
      project: '',
      versionProviderName: '',
      newVersion: '',
      newFileAndAssemblyVersion: '',
      isCustomVersionSelection: false,
      isEverythingCommitted: undefined
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

  componentDidUpdate(): void {
    M.updateTextFields();
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
    return (
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

    if(this.state.isCustomVersionSelection) {
      this.setState({ newVersion });
    }
  }

  handleNewFileAndAssemblyVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFileAndAssemblyVersion = e.target.value;

    if(this.state.isCustomVersionSelection) {
      this.setState({ newFileAndAssemblyVersion });
    }
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentVersion = this.getCurrentVersion(this.state.project);
    const versionProviderName = this.state.versionProviderName;
    const versionProvider = this.getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const isCustomVersion = this.state.isCustomVersionSelection;

    if(!versionProvider) {
      return;
    }

    const assemblyAndFileVersion = isCustomVersion
      ? this.state.newFileAndAssemblyVersion
      : versionProvider.getAssemblyAndFileVersion();

    if(assemblyAndFileVersion === undefined) {
      return;
    }

    ProjectPatcher.applyNewVersion(this.state.newVersion, assemblyAndFileVersion, this.props.baseSlnPath, this.state.project);

    const buildResult = await DotNetHelper.buildProject(IszoleaPathHelper.getProjectFilePath(this.props.baseSlnPath, this.state.project));
  }

  getCurrentVersion = (project: string): string => {
    return project !== '' ? ProjectPatcher.getLocalPackageVersion(this.props.baseSlnPath, project) || '': '';
  }

  getAssemblyVersion = (project: string): string => {
    return project !== '' ? ProjectPatcher.getLocalAssemblyVersion(this.props.baseSlnPath, project) || '': '';
  }

  getVersionProviders = (currentVersion: string): VersionProvider[] => {
    return new VersionProviderFactory(currentVersion).getProviders();
  }
}

export default PublishView;
