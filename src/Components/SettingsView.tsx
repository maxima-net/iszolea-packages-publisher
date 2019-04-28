import React, { Component } from 'react';
import './SettingsView.css';
import { connect, MapStateToPropsParam } from 'react-redux';
import { applySettings } from '../store/settings/actions';
import { AppState, Settings, SettingsFields } from '../store/types';
import { switchSettingsView } from '../store/layout/actions';

const mapStateToProps: MapStateToPropsParam<Settings, any, AppState> = (state) => {
  return { ...state.settings };
};

interface Dispatchers {
  applySettings: (settingsFields: SettingsFields) => void;
  switchSettingsView:  (display: boolean) => void;
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
}

class SettingsView extends Component<SettingsViewProps, SettingsViewState> {
  constructor(props: Readonly<SettingsViewProps>) {
    super(props);

    this.state = {
      baseSlnPath: props.baseSlnPath,
      uiPackageJsonPath: props.uiPackageJsonPath,
      nuGetApiKey: props.nuGetApiKey,
      npmAutoLogin: props.npmAutoLogin,
      npmLogin: props.npmLogin,
      npmPassword: props.npmPassword,
      npmEmail: props.npmEmail
    }
  }

  componentDidMount(): void {
    M.updateTextFields();
  }

  componentDidUpdate(): void {
    M.updateTextFields();
  }

  render() {
    const baseSlnPathClass = this.props.isBaseSlnPathValid ? 'valid' : 'invalid';
    const nuGetApiKeyClass = this.props.isNuGetApiKeyValid ? 'valid' : 'invalid';
    const uiPackageJsonPathClass = this.props.isUiPackageJsonPathValid ? 'valid' : 'invalid';
    const npmLoginClass = this.props.isNpmLoginValid ? 'valid' : 'invalid';
    const npmPasswordClass = this.props.isNpmPasswordValid ? 'valid' : 'invalid';
    const npmEmailClass = this.props.isNpmEmailValid ? 'valid' : 'invalid';

    return (
      <div className="view-container">
        <h4>Settings</h4>
        <div className="row" style={{ display: this.props.mainError ? undefined : 'none' }}>
          <blockquote>
            {this.props.mainError}
          </blockquote>
        </div>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={`input-field blue-text darken-1 ${baseSlnPathClass}`}>
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
            <div className={`input-field blue-text darken-1 ${nuGetApiKeyClass}`}>
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
            <div className={`input-field blue-text darken-1 ${uiPackageJsonPathClass}`}>
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
              className={`input-field blue-text darken-1 ${npmLoginClass}`}>
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
            <div className={`input-field blue-text darken-1 ${npmPasswordClass}`}>
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
            <div className={`input-field blue-text darken-1 ${npmEmailClass}`}>
              <input
                id="npmEmail"
                type="text"
                value={this.state.npmEmail}
                onChange={this.handleNpmEmailChange}
              />
              <label className="active" htmlFor="npmEmail">Npm Email</label>
            </div>
          </div>
          <div className="button-container">
            <button className="waves-effect waves-light btn blue darken-1">Apply Settings</button>
            <button onClick={this.handleCancelClick} className="waves-effect waves-light btn blue lighten-2">Cancel</button>
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
    const {baseSlnPath, nuGetApiKey, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmEmail, npmPassword } = this.state;
    
    this.props.applySettings({
      baseSlnPath, nuGetApiKey, uiPackageJsonPath, 
      npmAutoLogin, npmLogin, npmPassword, npmEmail
    });
  }

  handleBaseSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ baseSlnPath: e.target.value });
  }

  handleUiPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ uiPackageJsonPath: e.target.value });
  }

  handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ nuGetApiKey: e.target.value });
  }

  handleNpmLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmLogin: e.target.value });
  }

  handleNpmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmPassword: e.target.value });
  }

  handleNpmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmEmail: e.target.value });
  }

  handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ npmAutoLogin: e.target.checked });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
