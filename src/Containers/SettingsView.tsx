import React, { PureComponent } from 'react';
import { connect, MapStateToPropsParam } from 'react-redux';
import { applySettings } from '../store/settings/actions';
import { AppState, Settings, SettingsFields } from '../store/types';
import { switchSettingsView } from '../store/layout/actions';
import { checkBaseSlnPath, checkUiPackageJsonPath } from '../utils/path';
import { getSettingsValidationResult, checkNuGetApiKeyIsCorrect, checkNpmLoginIsCorrect, checkNpmPasswordIsCorrect, checkNpmEmailIsCorrect } from '../utils/settings';
import TextBox from '../Components/TextBox';
import CheckBox from '../Components/CheckBox';
import ViewContainer from '../Components/ViewContainer';
import './SettingsView.scss';

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

    const validationResult = getSettingsValidationResult(npmAutoLogin, isBaseSlnPathValid, isNuGetApiKeyValid,
      isUiPackageJsonPathValid, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid);
    const mainError = validationResult.mainError;

    return (
      <ViewContainer title="Settings">
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <TextBox
              id="baseSlnPath"
              type="text"
              value={this.state.baseSlnPath}
              onChange={this.handleBaseSlnPathChange}
              isValid={isBaseSlnPathValid}
              labelText="Path to the Iszolea-Base solution folder"
              helpText="Path to the folder where the ISOZ.sln file is placed"
            />
          </div>
          <div className="row">
            <TextBox
              id="nuGetApiKey"
              type="text"
              value={this.state.nuGetApiKey}
              onChange={this.handleNuGetApiKeyChange}
              isValid={isNuGetApiKeyValid}
              labelText="Iszolea NuGet Api Key"
              helpText="An API key for publishing nuget packages to the Iszolea repository"
            />
          </div>
          <div className="row">
            <TextBox
              id="uiPackageJsonPath"
              type="text"
              value={this.state.uiPackageJsonPath}
              onChange={this.handleUiPackageJsonPathChange}
              isValid={isUiPackageJsonPathValid}
              labelText="Path to the Iszolea UI npm package folder"
              helpText="Path to the folder where the package.json file is placed"
            />
          </div>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={this.state.npmAutoLogin}
              onChange={this.handleAutoLoginChange}
              text="Auto login to npm (if disabled you must be logged in manually before starting publishing)"
            />
          </div>
          <div className="row" style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmLogin"
              type="text"
              value={this.state.npmLogin}
              onChange={this.handleNpmLoginChange}
              isValid={isNpmLoginValid}
              labelText="Npm Login"
            />
          </div>
          <div className="row" style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmPassword"
              type="password"
              value={this.state.npmPassword}
              onChange={this.handleNpmPasswordChange}
              isValid={isNpmPasswordValid}
              labelText="Npm Password"
            />
          </div>
          <div className="row" style={{ display: this.state.npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmEmail"
              type="text"
              value={this.state.npmEmail}
              onChange={this.handleNpmEmailChange}
              isValid={isNpmEmailValid}
              labelText="Npm Email"
            />
          </div>
          <div className="row" style={{ display: mainError ? undefined : 'none' }}>
            <blockquote>
              {mainError}
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
      </ViewContainer>
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
    const isBaseSlnPathValid = checkBaseSlnPath(baseSlnPath);
    this.setState({ baseSlnPath, isBaseSlnPathValid });
  }

  handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuGetApiKey = e.target.value;
    const isNuGetApiKeyValid = checkNuGetApiKeyIsCorrect(nuGetApiKey);
    this.setState({ nuGetApiKey, isNuGetApiKeyValid });
  }

  handleUiPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uiPackageJsonPath = e.target.value;
    const isUiPackageJsonPathValid = checkUiPackageJsonPath(uiPackageJsonPath);
    this.setState({ uiPackageJsonPath, isUiPackageJsonPathValid });
  }

  handleNpmLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmLogin = e.target.value;
    const isNpmLoginValid = checkNpmLoginIsCorrect(npmLogin);
    this.setState({ npmLogin, isNpmLoginValid });
  }

  handleNpmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmPassword = e.target.value;
    const isNpmPasswordValid = checkNpmPasswordIsCorrect(npmPassword);
    this.setState({ npmPassword, isNpmPasswordValid });
  }

  handleNpmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmEmail = e.target.value;
    const isNpmEmailValid = checkNpmEmailIsCorrect(npmEmail);
    this.setState({ npmEmail, isNpmEmailValid });
  }

  handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmAutoLogin: e.target.checked });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
