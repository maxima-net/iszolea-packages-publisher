import React, { Component } from 'react';
import './Settings.css'

interface SettingsProps {
  baseSlnFolder: string | undefined;
  applySettings(baseSlnFolder: string): void;
}

interface SettingsState {
  baseSlnFolder: string;
}

declare var M: any; 

class Settings extends Component<SettingsProps, SettingsState> {
    constructor(props: Readonly<SettingsProps>) {
        super(props);

        this.state = {
        baseSlnFolder: props.baseSlnFolder || ''
        }
    }

    componentDidMount() {
        M.updateTextFields();
    }

    render() {
        return (
            <div className="settings-container">
                <h4>Settings</h4>
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field blue-text darken-1">
                            <input
                                id="newVersion"
                                type="text"
                                className="validate"
                                value={this.state.baseSlnFolder}
                                onChange={this.handleValueChange}
                            />
                            <label htmlFor="newVersion">Path to the Iszolea-Base solution folder</label>
                        </div>
                    </div>
                    
                    <button className="waves-effect waves-light btn  blue darken-1">Apply Settings</button>
                </form>
            </div>
        )
    }

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.props.applySettings(this.state.baseSlnFolder);
    }

    handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            baseSlnFolder: e.target.value
        })
    }
}

export default Settings;
