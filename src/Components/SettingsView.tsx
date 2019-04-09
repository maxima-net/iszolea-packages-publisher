import React, { Component } from 'react';
import './SettingsView.css';
import SettingsHelper from '../utils/settings-helper';
import PathHelper from '../utils/path-helper';

interface SettingsViewProps {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
  error?: string;
  handleApplySettings(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string,
    npmLogin: string, npmPassword: string, npmEmail: string): void;
  handleCancelClick(): void;
}

interface SettingsViewState {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
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
    const isBaseSlnPathValid = PathHelper.checkBaseSlnPath(this.state.baseSlnPath);
    const baseSlnPathClass = isBaseSlnPathValid ? 'valid' : 'invalid';

    const isNuGetApiKeyValid = SettingsHelper.checkNuGetApiKeyIsCorrect(this.state.nuGetApiKey);
    const nuGetApiKeyClass = isNuGetApiKeyValid ? 'valid' : 'invalid';

    const isUiPackageJsonPathValid = PathHelper.checkUiPackageJsonPath(this.state.uiPackageJsonPath);
    const uiPackageJsonPathClass = isUiPackageJsonPathValid ? 'valid' : 'invalid';

    const isNpmLoginValid = SettingsHelper.checkNpmLoginIsCorrect(this.state.npmLogin);
    const npmLoginClass = isNpmLoginValid ? 'valid' : 'invalid';

    const isNpmPasswordValid = SettingsHelper.checkNpmPasswordIsCorrect(this.state.npmPassword);
    const npmPasswordClass = isNpmPasswordValid ? 'valid' : 'invalid';

    const isNpmEmailValid = SettingsHelper.checkNpmEmailIsCorrect(this.state.npmEmail);
    const npmEmailClass = isNpmEmailValid ? 'valid' : 'invalid';

    return (
      <div className="view-container">
        <h4>Settings</h4>
        <div className="row" style={{ display: this.props.error ? undefined : 'none' }}>
          <blockquote>
            {this.props.error}
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
          <div className="row">
            <div className={`input-field blue-text darken-1 ${npmLoginClass}`}>
              <input
                id="npmLogin"
                type="text"
                value={this.state.npmLogin}
                onChange={this.handleNpmLoginChange}
              />
              <label className="active" htmlFor="npmLogin">Npm Login</label>
            </div>
          </div>
          <div className="row">
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
          <div className="row">
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
            <button onClick={this.props.handleCancelClick} className="waves-effect waves-light btn blue lighten-2">Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.props.handleApplySettings(this.state.baseSlnPath, this.state.nuGetApiKey,
      this.state.uiPackageJsonPath, this.state.npmLogin, this.state.npmPassword, this.state.npmEmail);
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
}

export default SettingsView;
