import React, { Component, CSSProperties } from 'react';
import './PublishForm.css';
import IszoleaPathHelper from '../iszolea-path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import ProjectPatcher from '../project-patcher';
import { IszoleaVersionValidator } from '../iszolea-version-validator';
import GitHelper from '../git-helper';

declare const M: any;

interface PublishFormProps {
  baseSlnPath: string;
}

interface PublishFormState {
  project: string;
  versionProviderName: string;
  newVersion: string;
  newFileAndAssemblyVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
}

class PublishForm extends Component<PublishFormProps, PublishFormState> {
  selectors: any[] | undefined;
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishFormProps>) {
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
    const elements = document.querySelectorAll('select');
    this.selectors = M.FormSelect.init(elements);

    this.gitTimer = setInterval(this.checkGitRepository, 3000);
  }

  componentWillUnmount(): void {
    if (this.selectors) {
      this.selectors.forEach((s) => {
        s.destroy();
      });
    }
    
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
    const baseSlnPath = this.props.baseSlnPath
    const project = this.state.project;
    const isCustom = this.state.isCustomVersionSelection;

    const projects = IszoleaPathHelper.getIszoleaProjectNames(baseSlnPath);
    const options = projects.map((p) => (
      <option key={p} value={p}>{p}</option>
    ));

    const secondStepRowStyles: CSSProperties = project ? {} : {display: 'none' };  
    const assemblyAndFileVersionStyles: CSSProperties = project && isCustom ? {} : {display: 'none' }; 
    const inputContainerClassName = project && isCustom ? 'grid' : '';  

    const currentVersion = this.getCurrentVersion(project);
    const currentFileAndAssemblyVersion = project ? this.getAssemblyVersion(project) : '';
    const isEverythingCommitted = this.state.isEverythingCommitted;
    
    let packageVersionError = '';
    let packageVersionErrorClass = '';
    let fileAndAssemblyVersionError = '';
    let fileAndAssemblyVersionErrorClass = '';
    let isFormValid = isEverythingCommitted;

    if (isCustom) {
      const validationResult = IszoleaVersionValidator.validateVersion(this.state.newVersion, this.state.newFileAndAssemblyVersion); 

      packageVersionError = currentVersion === this.state.newVersion
        ? 'The version must be different from the current one' 
        : validationResult.packageVersionError
          ? validationResult.packageVersionError
          : '';
      
      packageVersionErrorClass = packageVersionError ? 'invalid' : 'valid';
      
      fileAndAssemblyVersionError = currentFileAndAssemblyVersion === this.state.newFileAndAssemblyVersion
        ? 'The version must be different from the current one'
        : validationResult.fileAndAssemblyVersionError
          ? validationResult.fileAndAssemblyVersionError
          : '';

      fileAndAssemblyVersionErrorClass = fileAndAssemblyVersionError  ? 'invalid' : 'valid';

      isFormValid = isFormValid && !packageVersionError && !fileAndAssemblyVersionError;
    }

    const isEverythingCommittedInputText = isEverythingCommitted === undefined 
      ? 'Checking git status...' 
      : isEverythingCommitted 
        ? 'The git repository does not contain any changes'
        : 'The git repository has unsaved changes. Commit or remove them';

    const versionSelectors = this.getVersionProviders(currentVersion).map((p) => {
      const name = p.getName();

      return (
        <label key={name}>
          <input 
            className="with-gap" 
            name="versionUpdateType" 
            type="radio" 
            value={name}
            disabled={!p.canGenerateNewVersion()}
            checked={name === this.state.versionProviderName}
            onChange={this.handleVersionProviderNameChange}
          />
          <span>{name}</span>
        </label>
      );
    })

    return (
      <div className="publish-form-container">
        <h4>Publishing</h4>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field">
              <select 
                value={this.state.project}
                onChange={this.handleProjectChange}>
                <option value="" disabled>Select project</option>
                {options}
              </select>
              <label>Project</label>
            </div>
          </div>
          
          <div className={`row row-checks ${isEverythingCommitted === false? 'invalid' : ''}`} style={secondStepRowStyles}>
            <label>
              <input
                id="isEverythingCommitted"
                readOnly
                tabIndex={-1}
                checked={!!isEverythingCommitted}
                type="checkbox"
              />
              <span>{isEverythingCommittedInputText}</span>
            </label>
          </div>

          <div className="row version-selectors-row" style={secondStepRowStyles}>
            <div className="version-selectors-container">
              {versionSelectors}
            </div>
          </div>

          <div className={`version-inputs-container ${inputContainerClassName}`}>
            <div className="row" style={secondStepRowStyles}>
              <div className="input-field blue-text darken-1">
                <input 
                  id="currentVersion"
                  type="text"
                  disabled
                  className="validate" 
                  defaultValue={currentVersion} 
                  />
                <label htmlFor="currentVersion">Current package version</label>
              </div>
            </div>

            <div className="row" style={assemblyAndFileVersionStyles}>
              <div className="input-field blue-text darken-1">
                <input
                  id="newFileAndAssemblyVersion"
                  type="text"
                  disabled
                  className="validate"
                  defaultValue={currentFileAndAssemblyVersion}
                  />
                <label htmlFor="newFileAndAssemblyVersion">Current file and assembly version</label>
              </div>
            </div>

            <div className="row" style={secondStepRowStyles}>
              <div className={`input-field blue-text darken-1 ${packageVersionErrorClass}`}>
                <input
                  id="newVersion"
                  type="text"
                  className="validate"
                  value={this.state.newVersion}
                  onChange={this.handleNewVersionChange}
                  />
                <label htmlFor="newVersion">New package version</label>
                <span className={`helper-text ${packageVersionErrorClass}`}>{packageVersionError}</span>
              </div>
            </div>

            <div className="row" style={assemblyAndFileVersionStyles}>
              <div className={`input-field blue-text darken-1 ${fileAndAssemblyVersionErrorClass}`}>
                <input
                  id="newFileAndAssemblyVersion"
                  type="text"
                  className="validate"
                  value={this.state.newFileAndAssemblyVersion}
                  onChange={this.handleNewFileAndAssemblyVersionChange}
                  />
                <label htmlFor="newFileAndAssemblyVersion">New file and assembly version</label>
                <span className={`helper-text ${fileAndAssemblyVersionErrorClass}`}>{fileAndAssemblyVersionError}</span>
              </div>
            </div>
          </div>

          <div className="row row-button" style={secondStepRowStyles}>
            <button
              disabled={!isFormValid}
              className="waves-effect waves-light btn blue darken-1">
              <i className="material-icons left">cloud_upload</i>
              Publish, please
            </button>
          </div>
        </form>
      </div>
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

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
  }

  getCurrentVersion(project: string): string {
    return project !== '' ? ProjectPatcher.getLocalPackageVersion(this.props.baseSlnPath, project) || '': '';
  }

  getAssemblyVersion(project: string): string {
    return project !== '' ? ProjectPatcher.getLocalAssemblyVersion(this.props.baseSlnPath, project) || '': '';
  }

  getVersionProviders(currentVersion: string): VersionProvider[] {
    return new VersionProviderFactory(currentVersion).getProviders();
  }
}

export default PublishForm;
