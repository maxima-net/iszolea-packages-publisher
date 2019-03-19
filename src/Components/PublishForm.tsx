import React, { Component, CSSProperties } from 'react';
import './PublishForm.css';
import IszoleaPathHelper from '../iszolea-path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import ProjectPatcher from '../project-patcher';

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
}

class PublishForm extends Component<PublishFormProps, PublishFormState> {
  selectors: any[] | undefined;

  constructor(props: Readonly<PublishFormProps>) {
    super(props);
    
    this.state = {
      project: '',
      versionProviderName: '',
      newVersion: '',
      newFileAndAssemblyVersion: '',
      isCustomVersionSelection: false
    }
  }

  componentDidMount() {
    const elements = document.querySelectorAll('select');
    this.selectors = M.FormSelect.init(elements);
  }

  componentWillUnmount() {
    if(this.selectors) {
      this.selectors.forEach((s) => {
        s.destroy();
      });
    }
  }

  componentDidUpdate() {
    M.updateTextFields();
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
              <div className="input-field blue-text darken-1">
                <input
                  id="newVersion"
                  type="text"
                  className="validate"
                  value={this.state.newVersion}
                  onChange={this.handleNewVersionChange}
                  />
                <label htmlFor="newVersion">New package version</label>
              </div>
            </div>

            <div className="row" style={assemblyAndFileVersionStyles}>
              <div className="input-field blue-text darken-1">
                <input
                  id="newFileAndAssemblyVersion"
                  type="text"
                  className="validate"
                  value={this.state.newFileAndAssemblyVersion}
                  onChange={this.handleNewFileAndAssemblyVersionChange}
                  />
                <label htmlFor="newFileAndAssemblyVersion">New file and assembly version</label>
              </div>
            </div>
          </div>

          <div className="row" style={secondStepRowStyles}>
            <button
              className="waves-effect waves-light btn blue darken-1">
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
    
    this.setState({ project, newVersion, versionProviderName, isCustomVersionSelection });
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
    
    if(!versionProvider) {
      return;
    }

    const assemblyAndFileVersion = this.state.isCustomVersionSelection 
      ? this.state.newFileAndAssemblyVersion
      : versionProvider.getAssemblyAndFileVersion()

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
