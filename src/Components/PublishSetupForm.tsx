import React, { CSSProperties, Component } from 'react';
import './PublishSetupForm.css'
import { PackageSet } from '../utils/iszolea-path-helper';
import { IszoleaVersionValidator } from '../utils/iszolea-version-validator';
import { VersionProvider } from '../version-providers';

interface PublishSetupFormProps {
  baseSlnPath: string;
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  newFileAndAssemblyVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  availablePackages: PackageSet[];
  getVersionProviders(currentVersion: string): VersionProvider[];
  getCurrentVersion(project: string): string;
  getAssemblyVersion(project: string): string;
  handleProjectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleVersionProviderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewVersionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewFileAndAssemblyVersionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

class PublishSetupForm extends Component<PublishSetupFormProps> {
  private selectors: any[] | undefined;

  componentDidMount() {
    const elements = document.querySelectorAll('select');
    this.selectors = M.FormSelect.init(elements);
  }

  componentDidUpdate(): void {
    M.updateTextFields();
  }

  componentWillUnmount(): void {
    if (this.selectors) {
      this.selectors.forEach((s) => {
        s.destroy();
      });
    }
  }

  render() {
    const selectedSet = this.props.availablePackages.filter(p => p.id === this.props.packageSetId)[0];
    const packageName = selectedSet ? selectedSet.names[0] : '';
    const currentVersion = this.props.getCurrentVersion(packageName);
    const currentFileAndAssemblyVersion = packageName ? this.props.getAssemblyVersion(packageName) : '';

    const secondStepRowStyles: CSSProperties = packageName ? {} : { display: 'none' };
    const assemblyAndFileVersionStyles: CSSProperties = packageName && this.props.isCustomVersionSelection ? {} : { display: 'none' };
    const inputContainerClassName = packageName && this.props.isCustomVersionSelection ? 'grid' : '';

    const options = this.props.availablePackages.map((p) => (
      <option key={p.id} value={p.id}>{p.names.join(', ')}</option>
    ));

    let packageVersionError = '';
    let packageVersionErrorClass = '';
    let fileAndAssemblyVersionError = '';
    let fileAndAssemblyVersionErrorClass = '';
    let isFormValid = this.props.isEverythingCommitted;

    if (this.props.isCustomVersionSelection) {
      const validationResult = IszoleaVersionValidator.validateVersion(this.props.newVersion, this.props.newFileAndAssemblyVersion);

      packageVersionError = currentVersion === this.props.newVersion
        ? 'The version must be different from the current one'
        : validationResult.packageVersionError
          ? validationResult.packageVersionError
          : '';

      packageVersionErrorClass = packageVersionError ? 'invalid' : 'valid';

      fileAndAssemblyVersionError = currentFileAndAssemblyVersion === this.props.newFileAndAssemblyVersion
        ? 'The version must be different from the current one'
        : validationResult.fileAndAssemblyVersionError
          ? validationResult.fileAndAssemblyVersionError
          : '';

      fileAndAssemblyVersionErrorClass = fileAndAssemblyVersionError ? 'invalid' : 'valid';

      isFormValid = isFormValid && !packageVersionError && !fileAndAssemblyVersionError;
    }

    const versionSelectors = this.props.getVersionProviders(currentVersion).map((p) => {
      const name = p.getName();

      return (
        <label key={name}>
          <input
            className="with-gap"
            name="versionUpdateType"
            type="radio"
            value={name}
            disabled={!p.canGenerateNewVersion()}
            checked={name === this.props.versionProviderName}
            onChange={this.props.handleVersionProviderNameChange}
          />
          <span>{name}</span>
        </label>
      );
    })

    const isEverythingCommittedInputText = this.props.isEverythingCommitted === undefined
      ? 'Checking git status...'
      : this.props.isEverythingCommitted
        ? 'The git repository does not contain any changes'
        : 'The git repository has unsaved changes. Commit or remove them';

    return (
      <div className="view-container">
        <h4>Set-Up Publishing</h4>
        <form className="form" onSubmit={this.props.handleSubmit}>
          <div className="row">
            <div className="input-field">
              <select
                value={this.props.packageSetId ? this.props.packageSetId : ''}
                onChange={this.props.handleProjectChange}>
                <option value="" disabled>Select project</option>
                {options}
              </select>
              <label>Project</label>
            </div>
          </div>

          <div className={`row row-checks ${this.props.isEverythingCommitted === false ? 'invalid' : ''}`} style={secondStepRowStyles}>
            <label>
              <input
                id="isEverythingCommitted"
                readOnly
                tabIndex={-1}
                checked={!!this.props.isEverythingCommitted}
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
                  value={this.props.newVersion}
                  onChange={this.props.handleNewVersionChange}
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
                  value={this.props.newFileAndAssemblyVersion}
                  onChange={this.props.handleNewFileAndAssemblyVersionChange}
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
    )
  }
}

export default PublishSetupForm