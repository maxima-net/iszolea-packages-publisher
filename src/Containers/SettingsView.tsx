import React, { PureComponent } from 'react';
import { connect, MapStateToPropsParam } from 'react-redux';
import { applySettings } from '../store/settings/actions';
import { AppState, Settings, SettingsFields } from '../store/types';
import { switchSettingsView } from '../store/layout/actions';
import { validateSettings } from '../utils/settings';
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

class SettingsView extends PureComponent<SettingsViewProps, Settings> {
  constructor(props: Readonly<SettingsViewProps>) {
    super(props);

    this.state = {
      isIszoleaPackagesIncluded: props.isIszoleaPackagesIncluded,
      baseSlnPath: props.baseSlnPath,
      isBomCommonPackageIncluded: props.isBomCommonPackageIncluded,
      bomCommonPackageSlnPath: props.bomCommonPackageSlnPath,
      isIszoleaUiPackageIncluded: props.isIszoleaUiPackageIncluded,
      uiPackageJsonPath: props.uiPackageJsonPath,
      nuGetApiKey: props.nuGetApiKey,
      npmAutoLogin: props.npmAutoLogin,
      npmLogin: props.npmLogin,
      npmPassword: props.npmPassword,
      npmEmail: props.npmEmail,

      isBaseSlnPathValid: props.isBaseSlnPathValid,
      IsBomCommonPackageSlnPathValid: props.IsBomCommonPackageSlnPathValid,
      isNuGetApiKeyValid: props.isNuGetApiKeyValid,
      isUiPackageJsonPathValid: props.isUiPackageJsonPathValid,
      isNpmLoginValid: props.isNpmLoginValid,
      isNpmPasswordValid: props.isNpmPasswordValid,
      isNpmEmailValid: props.isNpmEmailValid,
      mainError: props.mainError
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
      nuGetApiKey,
      isIszoleaPackagesIncluded, baseSlnPath,
      isBomCommonPackageIncluded, bomCommonPackageSlnPath,
      isIszoleaUiPackageIncluded, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmPassword, npmEmail,

      isBaseSlnPathValid, isNuGetApiKeyValid, isUiPackageJsonPathValid,
      IsBomCommonPackageSlnPathValid,
      isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid, mainError
    } = this.state;

    return (
      <ViewContainer>
        <form className="form" onSubmit={this.handleSubmit}>
          <h5>NuGet</h5>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isIszoleaPackagesIncluded}
              onChange={this.handleIsIszoleaPackagesIncludedChange}
              text="Include Iszolea packages"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaPackagesIncluded ? undefined : 'none' }}>
            <TextBox
              id="baseSlnPath"
              type="text"
              value={baseSlnPath}
              onChange={this.handleBaseSlnPathChange}
              isValid={isBaseSlnPathValid}
              labelText="Path to the Iszolea-Base solution folder"
              helpText="Path to the folder where the ISOZ.sln file is placed"
            />
          </div>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isBomCommonPackageIncluded}
              onChange={this.handleIsBomCommonPackageIncludedChange}
              text="Include Bom Common"
            />
          </div>
          <div className="row indent-left" style={{ display: isBomCommonPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="bomCommonPackageSlnPath"
              type="text"
              value={bomCommonPackageSlnPath}
              onChange={this.handleBomCommonPackageSlnPathChange}
              isValid={IsBomCommonPackageSlnPathValid}
              labelText="Path to the Bom Common solution folder"
              helpText="Path to the folder where the BomCommon.sln file is placed"
            />
          </div>
          <div className="row" style={{ display: isIszoleaPackagesIncluded || isBomCommonPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="nuGetApiKey"
              type="text"
              value={nuGetApiKey}
              onChange={this.handleNuGetApiKeyChange}
              isValid={isNuGetApiKeyValid}
              labelText="Iszolea NuGet Api Key"
              helpText="An API key for publishing nuget packages to the Iszolea repository"
            />
          </div>
          <h5>NPM</h5>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isIszoleaUiPackageIncluded}
              onChange={this.handleIssIszoleaUiPackageIncludedChange}
              text="Include Iszolea UI"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="uiPackageJsonPath"
              type="text"
              value={uiPackageJsonPath}
              onChange={this.handleUiPackageJsonPathChange}
              isValid={isUiPackageJsonPathValid}
              labelText="Path to the Iszolea UI npm package folder"
              helpText="Path to the folder where the package.json file is placed"
            />
          </div>
          <div className="row checkbox-row" style={{ display: isIszoleaUiPackageIncluded ? undefined : 'none' }}>
            <CheckBox
              isChecked={npmAutoLogin}
              onChange={this.handleAutoLoginChange}
              text="Auto login to npm (if disabled you must be logged in manually before starting publishing)"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmLogin"
              type="text"
              value={npmLogin}
              onChange={this.handleNpmLoginChange}
              isValid={isNpmLoginValid}
              labelText="Npm Login"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmPassword"
              type="password"
              value={npmPassword}
              onChange={this.handleNpmPasswordChange}
              isValid={isNpmPasswordValid}
              labelText="Npm Password"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmEmail"
              type="text"
              value={npmEmail}
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

    this.props.applySettings(this.state);
  }

  handleIsIszoleaPackagesIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIszoleaPackagesIncluded = e.target.checked;
    const validationResult = validateSettings({ ...this.state, isIszoleaPackagesIncluded });
    this.setState({ ...validationResult, isIszoleaPackagesIncluded });
  }

  handleBaseSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const baseSlnPath = e.target.value;
    const validationResult = validateSettings({ ...this.state, baseSlnPath });
    this.setState({ ...validationResult, baseSlnPath });
  }

  handleIsBomCommonPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isBomCommonPackageIncluded = e.target.checked;
    const validationResult = validateSettings({ ...this.state, isBomCommonPackageIncluded });
    this.setState({ ...validationResult, isBomCommonPackageIncluded });
  }

  handleBomCommonPackageSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bomCommonPackageSlnPath = e.target.value;
    const validationResult = validateSettings({ ...this.state, bomCommonPackageSlnPath });
    this.setState({ ...validationResult, bomCommonPackageSlnPath });
  }

  handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuGetApiKey = e.target.value;
    const validationResult = validateSettings({ ...this.state, nuGetApiKey });
    this.setState({ ...validationResult, nuGetApiKey });
  }

  handleIssIszoleaUiPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIszoleaUiPackageIncluded = e.target.checked
    const validationResult = validateSettings({ ...this.state, isIszoleaUiPackageIncluded });
    this.setState({ ...validationResult, isIszoleaUiPackageIncluded });
  }

  handleUiPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uiPackageJsonPath = e.target.value;
    const validationResult = validateSettings({ ...this.state, uiPackageJsonPath });
    this.setState({ ...validationResult, uiPackageJsonPath });
  }

  handleNpmLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmLogin = e.target.value;
    const validationResult = validateSettings({ ...this.state, npmLogin });
    this.setState({ ...validationResult, npmLogin });
  }

  handleNpmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmPassword = e.target.value;
    const validationResult = validateSettings({ ...this.state, npmPassword });
    this.setState({ ...validationResult, npmPassword });
  }

  handleNpmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmEmail = e.target.value;
    const validationResult = validateSettings({ ...this.state, npmEmail });
    this.setState({ ...validationResult, npmEmail });
  }

  handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmAutoLogin = e.target.checked;
    const validationResult = validateSettings({ ...this.state, npmAutoLogin });
    this.setState({ ...validationResult, npmAutoLogin });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
