import React, { CSSProperties, Component } from 'react';
import './PublishSetupForm.css'
import { PackageSet } from '../utils/path-helper';
import { VersionHelper } from '../utils/version-helper';
import { VersionProvider, VersionProviderFactory } from '../version-providers';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import NpmPackageHelper from '../utils/npm-package-helper';
import { MapStateToPropsParam, connect } from 'react-redux';
import { initializePublishing, checkGitRepository, selectProject, selectVersionProvider, applyNewVersion, publishPackage } from '../store/publishing/actions';
import { Settings, AppState } from '../store/types';

interface MappedProps {
  settings: Settings
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  availablePackages: PackageSet[];
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  const publishing = state.publishing;
  
  return {
    settings: state.settings,
    packageSetId: publishing.packageSetId,
    versionProviderName: publishing.versionProviderName,
    newVersion: publishing.newVersion,
    isCustomVersionSelection: publishing.isCustomVersionSelection,
    isEverythingCommitted: publishing.isEverythingCommitted,
    availablePackages: publishing.availablePackages
  }
}

interface Dispatchers {
  initializePublishing: () => void;
  checkGitRepository: () => void;
  selectProject: (packageSetId: number) => void;
  selectVersionProvider: (versionProviderName: string) => void;
  applyNewVersion: (newVersion: string) => void;
  publishPackage: () => void;
}

const dispatchers: Dispatchers = {
  initializePublishing,
  checkGitRepository,
  selectProject,
  selectVersionProvider,
  applyNewVersion,
  publishPackage,
}

type PublishSetupFormProps = MappedProps & Dispatchers;

class PublishSetupForm extends Component<PublishSetupFormProps> {
  gitTimer: NodeJS.Timeout | undefined;

  componentDidMount() {
    this.props.initializePublishing();
    this.gitTimer = setInterval(this.props.checkGitRepository, 3000);
  }

  componentDidUpdate(): void {
    M.updateTextFields();
    M.AutoInit();
  }

  componentWillUnmount() {
    if (this.gitTimer) {
      clearInterval(this.gitTimer)
    }
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

  render() {
    const selectedSet = this.props.availablePackages.filter(p => p.id === this.props.packageSetId)[0];
    const currentVersion = this.getCurrentVersion(selectedSet);

    const packageName = selectedSet ? selectedSet.projectsInfo[0] : '';
    const secondStepRowStyles: CSSProperties = packageName ? {} : { display: 'none' };

    const options = this.props.availablePackages.map((p) => (
      <option key={p.id} value={p.id}>{p.projectsInfo.map((i) => i.name).join(', ')}</option>
    ));

    let packageVersionError = '';
    let packageVersionErrorClass = '';
    let isFormValid = this.props.isEverythingCommitted;

    if (this.props.isCustomVersionSelection) {
      const validationResult = VersionHelper.validateVersion(this.props.newVersion);

      packageVersionError = currentVersion === this.props.newVersion
        ? 'The version must be different from the current one'
        : validationResult.packageVersionError
          ? validationResult.packageVersionError
          : '';

      packageVersionErrorClass = packageVersionError ? 'invalid' : 'valid';

      isFormValid = isFormValid && !packageVersionError;
    }

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
            checked={name === this.props.versionProviderName}
            onChange={this.handleVersionProviderNameChange}
          />
          <span>{name}</span>
        </label>
      );
    });

    const isEverythingCommittedInputText = this.props.isEverythingCommitted === undefined
      ? 'Checking git status...'
      : this.props.isEverythingCommitted
        ? 'The git repository does not contain any changes'
        : 'The git repository has unsaved changes. Commit or remove them';

    return (
      <div className="view-container">
        <h4>Set-Up Publishing</h4>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field">
              <select
                value={this.props.packageSetId ? this.props.packageSetId : ''}
                onChange={this.handleProjectChange}>
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

          <div className="version-inputs-container">
            <div className="row" style={secondStepRowStyles}>
              <div className="input-field blue-text darken-1">
                <input
                  id="currentVersion"
                  type="text"
                  disabled
                  value={currentVersion}
                />
                <label htmlFor="currentVersion">Current package version</label>
              </div>
            </div>

            <div className="row" style={secondStepRowStyles}>
              <div className={`input-field blue-text darken-1 ${packageVersionErrorClass}`}>
                <input
                  id="newVersion"
                  type="text"
                  className="validate"
                  value={this.props.newVersion}
                  onChange={this.handleNewVersionChange}
                />
                <label htmlFor="newVersion">New package version</label>
                <span className={`helper-text ${packageVersionErrorClass}`}>{packageVersionError}</span>
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
}

export default connect(mapStateToProps, dispatchers)(PublishSetupForm);
