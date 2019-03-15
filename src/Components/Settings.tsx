import React, { Component } from 'react';
import './Settings.css'
import IszoleaPathHelper from '../iszolea-path-helper';

interface SettingsProps {
  baseSlnPath: string;
  handleApplySettings(baseSlnPath: string): void;
  handleCancelClick(): void;
}

interface SettingsState {
  errorText: string | undefined;
  baseSlnPath: string;
}

class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: Readonly<SettingsProps>) {
    super(props);

    this.state = {
      errorText: '',
      baseSlnPath: props.baseSlnPath
    }
  }

  render() {
    const isBaseSlnPathValid = IszoleaPathHelper.checkBaseSlnPath(this.state.baseSlnPath);
    const baseSlnPathClass = ` ${isBaseSlnPathValid ? 'valid' : 'invalid'}`;

    return (
      <div className="settings-container">
        <h4>Settings</h4>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={`input-field blue-text darken-1 ${baseSlnPathClass}`}>
              <input
                id="baseSlnPath"
                type="text"
                value={this.state.baseSlnPath}
                onChange={this.handleValueChange}
              />
              <label className="active" htmlFor="baseSlnPath">Path to the Iszolea-Base solution folder</label>
              <span className="helper-text">Path to the folder where 'ISOZ.sln' file is placed</span>
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

    this.props.handleApplySettings(this.state.baseSlnPath);
  }

  handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      baseSlnPath: e.target.value
    })
  }
}

export default Settings;
