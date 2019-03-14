import React from 'react';
import './Settings.css'

function Settings() {
    return (
        <div className="settings-container">
            <h4>Settings</h4>
            <form className="form">
                <div className="row">
                    <div className="input-field blue-text darken-1">
                        <input id="newVersion" type="text" className="validate " />
                        <label htmlFor="newVersion">Path to the Iszolea-Base solution folder</label>
                    </div>
                </div>
                
                <button className="waves-effect waves-light btn  blue darken-1">Apply Settings</button>
            </form>
        </div>
    )
}

export default Settings;
