import React, { Component, CSSProperties } from 'react';
import './PublishForm.css';
import IszoleaPathHelper from '../iszolea-path-helper';
import { VersionProviderFactory, VersionProvider } from '../version-providers';
import { throws } from 'assert';

declare const M: any;

interface PublishFormProps {
  baseSlnPath: string;
}

interface PublishFormState {
  project: string;
  versionProviderName: string;
  newVersion: string;
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

    const projects = IszoleaPathHelper.getIszoleaProjectNames(baseSlnPath);
    const options = projects.map((p) => (
      <option key={p} value={p}>{p}</option>
    ));

    const secondStepRowStyles: CSSProperties = project ? {} : {display: 'none' };  

    const currentVersion = this.getCurrentVersion(project);
    
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
        <form className="form">
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

          <div className="row" style={secondStepRowStyles}>
            <div className="input-field blue-text darken-1">
              <input 
                id="currentVersion"
                type="text"
                disabled
                className="validate" 
                defaultValue={currentVersion} 
              />
              <label htmlFor="currentVersion">Current local version</label>
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
              <label htmlFor="newVersion">New version</label>
            </div>
          </div>

          <div className="row" style={secondStepRowStyles}>
            <button className="waves-effect waves-light btn  blue darken-1">Publish, please</button>
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
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersion() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false; 
    
    this.setState({ project, newVersion, versionProviderName, isCustomVersionSelection });
  }

  handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value; 
    const currentVersion = this.getCurrentVersion(this.state.project);
    const provider = this.getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const newVersion = provider ? provider.getNewVersion() || '' : '';
    const isCustomVersionSelection = provider ? provider.isCustom() : false; 

    this.setState({ versionProviderName, newVersion, isCustomVersionSelection });
  }

  handleNewVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = e.target.value;

    if(this.state.isCustomVersionSelection) {
      this.setState({ newVersion });
    }
  }

  getCurrentVersion(project: string): string {
    return project !== '' ? IszoleaPathHelper.getLocalPackageVersion(this.props.baseSlnPath, project) || '': '';
  }

  getVersionProviders(currentVersion: string): VersionProvider[] {
    return new VersionProviderFactory(currentVersion).getProviders();
  }
}

export default PublishForm;
