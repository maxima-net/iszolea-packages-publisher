import React, { Component } from 'react';
import './SettingsView.css'
import SettingsHelper from '../utils/settings-helper';

interface SettingsViewProps {
  baseSlnPath: string;
  nuGetApiKey: string;
  error?: string;
  handleApplySettings(baseSlnPath: string, nuGetApiKey: string): void;
  handleCancelClick(): void;
}

interface SettingsViewState {
  baseSlnPath: string;
  nuGetApiKey: string;
}

class SettingsView extends Component<SettingsViewProps, SettingsViewState> {
  constructor(props: Readonly<SettingsViewProps>) {
    super(props);

    this.state = {
      baseSlnPath: props.baseSlnPath,
      nuGetApiKey: props.nuGetApiKey
    }
  }

  componentDidUpdate(): void {
    M.updateTextFields();
  }

  render() {
    const isBaseSlnPathValid = SettingsHelper.checkBaseSlnPathIsCorrect(this.state.baseSlnPath);
    const baseSlnPathClass = ` ${isBaseSlnPathValid ? 'valid' : 'invalid'}`;

    const isNuGetApiKeyValid = SettingsHelper.checkNuGetApiKeyIsCorrect(this.state.nuGetApiKey);
    const nuGetApiKeyClass = ` ${isNuGetApiKeyValid ? 'valid' : 'invalid'}`;

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
              <span className="helper-text">Path to the folder where 'ISOZ.sln' file is placed</span>
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

    this.props.handleApplySettings(this.state.baseSlnPath, this.state.nuGetApiKey);
  }

  handleBaseSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      baseSlnPath: e.target.value
    })
  }

  handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      nuGetApiKey: e.target.value
    })
  }
}

export default SettingsView;
