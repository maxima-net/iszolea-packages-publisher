import React, { PureComponent } from 'react';
import './SettingsView.scss';
import { connect, MapStateToPropsParam } from 'react-redux';
import { applySettings } from '../store/settings/actions';
import { AppState, Settings, SettingsFields } from '../store/types';
import { switchSettingsView } from '../store/layout/actions';
import PathHelper from '../utils/path-helper';
import SettingsHelper from '../utils/settings-helper';

const mapStateToProps: MapStateToPropsParam<Settings, any, AppState> = (state) => {
  return { ...state.settings };
};

interface Dispatchers {
  applySettings: (settingsFields: SettingsFields) => void;
  switchSettingsView: (display: boolean) => void;
}

const mapDispatchToProps: Dispatchers = {
  applySettings,
  switchSettingsView
};

type SettingsViewProps = Settings & Dispatchers;

interface SettingsViewState {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;

  isBaseSlnPathValid: boolean;
  isNuGetApiKeyValid: boolean;
  isUiPackageJsonPathValid: boolean;
  isNpmLoginValid: boolean;
  isNpmPasswordValid: boolean;
  isNpmEmailValid: boolean;
}

class SettingsView extends PureComponent<SettingsViewProps, SettingsViewState> {
  constructor(props: Readonly<SettingsViewProps>) {
    super(props);

    this.state = {
      baseSlnPath: props.baseSlnPath,
      uiPackageJsonPath: props.uiPackageJsonPath,
      nuGetApiKey: props.nuGetApiKey,
      npmAutoLogin: props.npmAutoLogin,
      npmLogin: props.npmLogin,
      npmPassword: props.npmPassword,
      npmEmail: props.npmEmail,

      isBaseSlnPathValid: props.isBaseSlnPathValid,
      isNuGetApiKeyValid: props.isNuGetApiKeyValid,
      isUiPackageJsonPathValid: props.isUiPackageJsonPathValid,
      isNpmLoginValid: props.isNpmLoginValid,
      isNpmPasswordValid: props.isNpmPasswordValid,
      isNpmEmailValid: props.isNpmEmailValid
    };
  }

  componentDidMount(): void {
    M.updateTextFields();
  }

  componentDidUpdate(): void {
    M.updateTextFields();
  }

  render() {
    const {
      isBaseSlnPathValid, isNuGetApiKeyValid, isUiPackageJsonPathValid,
      npmAutoLogin, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid
    } = this.state;

    const validationResult = SettingsHelper.getValidationResult(npmAutoLogin, isBaseSlnPathValid, isNuGetApiKeyValid,
      isUiPackageJsonPathValid, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid);
    const mainError = validationResult.mainError;

    return (
      <div className="view-container">
        <h4>Settings</h4>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={`input-field blue-text darken-1 ${isBaseSlnPathValid ? 'valid' : 'invalid'}`}>
              <input
                id="baseSlnPath"
                type="text"
                value={this.state.baseSlnPath}
                onChange={this.handleBaseSlnPathChange}
              />
              <label className="active" htmlFor="baseSlnPath">Path to the Iszolea-Base solution folder</label>
              <span className="helper-text">Path to the folder where the ISOZ.sln file is placed</span>
            </div>
          </div>
          <div className="row">
            <div className={`input-field blue-text darken-1 ${isNuGetApiKeyValid ? 'valid' : 'invalid'}`}>
              <input
                id="nuGetApiKey"
                type="text"
                value={this.state.nuGetApiKey}
                onChange={this.handleNuGetApiKeyChange}
              />
              <label className="active" htmlFor="baseSlnPath">Iszolea NuGet Api Key</label>
              <span className="helper-text">An API key for publishing nuget packages to the Iszolea repository</span>
            </div>
          </div>
          <div className="row">
            <div className={`input-field blue-text darken-1 ${isUiPackageJsonPathValid ? 'valid' : 'invalid'}`}>
              <input
                id="uiPackageJsonPath"
                type="text"
                value={this.state.uiPackageJsonPath}
                onChange={this.handleUiPackageJsonPathChange}
              />
              <label className="active" htmlFor="uiPackageJsonPath">Path to the Iszolea UI npm package folder</label>
              <span className="helper-text">Path to the folder where the package.json file is placed</span>
            </div>
          </div>
          <div className="row checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={this.state.npmAutoLogin}
                onChange={this.handleAutoLoginChange}
              />
              <span>Auto login to npm (if disabled you must be logged in manually before starting publishing)</span>
            </label>
          </div>
          <div
            className="row"
            style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <div
              className={`input-field blue-text darken-1 ${isNpmLoginValid ? 'valid' : 'invalid'}`}>
              <input
                id="npmLogin"
                type="text"
                value={this.state.npmLogin}
                onChange={this.handleNpmLoginChange}
              />
              <label className="active" htmlFor="npmLogin">Npm Login</label>
            </div>
          </div>
          <div
            className="row"
            style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <div className={`input-field blue-text darken-1 ${isNpmPasswordValid ? 'valid' : 'invalid'}`}>
              <input
                id="npmPassword"
                type="password"
                value={this.state.npmPassword}
                onChange={this.handleNpmPasswordChange}
              />
              <label className="active" htmlFor="npmPassword">Npm Password</label>
            </div>
          </div>
          <div
            className="row"
            style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <div className={`input-field blue-text darken-1 ${isNpmEmailValid ? 'valid' : 'invalid'}`}>
              <input
                id="npmEmail"
                type="text"
                value={this.state.npmEmail}
                onChange={this.handleNpmEmailChange}
              />
              <label className="active" htmlFor="npmEmail">Npm Email</label>
            </div>
          </div>
          <div className="row" style={{ display: mainError ? undefined : 'none' }}>
            <blockquote>
              {mainError || 'Nope'}
            </blockquote>
          </div>
          <div className="button-container">
            <button
              disabled={!!mainError}
              className="waves-effect waves-light btn blue darken-1">
              Apply Settings
            </button>
            <button
              onClick={this.handleCancelClick}
              className="waves-effect waves-light btn blue lighten-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  handleCancelClick = () => {
    this.props.switchSettingsView(false);
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { baseSlnPath, nuGetApiKey, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmEmail, npmPassword } = this.state;

    this.props.applySettings({
      baseSlnPath, nuGetApiKey, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmPassword, npmEmail
    });
  }

  handleBaseSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const baseSlnPath = e.target.value;
    const isBaseSlnPathValid = PathHelper.checkBaseSlnPath(baseSlnPath);
    this.setState({ baseSlnPath, isBaseSlnPathValid });
  }

  handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuGetApiKey = e.target.value;
    const isNuGetApiKeyValid = SettingsHelper.checkNuGetApiKeyIsCorrect(nuGetApiKey);
    this.setState({ nuGetApiKey, isNuGetApiKeyValid });
  }

  handleUiPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uiPackageJsonPath = e.target.value;
    const isUiPackageJsonPathValid = PathHelper.checkUiPackageJsonPath(uiPackageJsonPath);
    this.setState({ uiPackageJsonPath, isUiPackageJsonPathValid });
  }

  handleNpmLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmLogin = e.target.value;
    const isNpmLoginValid = SettingsHelper.checkNpmLoginIsCorrect(npmLogin);
    this.setState({ npmLogin, isNpmLoginValid });
  }

  handleNpmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmPassword = e.target.value;
    const isNpmPasswordValid = SettingsHelper.checkNpmPasswordIsCorrect(npmPassword);
    this.setState({ npmPassword, isNpmPasswordValid });
  }

  handleNpmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmEmail = e.target.value;
    const isNpmEmailValid = SettingsHelper.checkNpmEmailIsCorrect(npmEmail);
    this.setState({ npmEmail, isNpmEmailValid });
  }

  handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmAutoLogin: e.target.checked });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
