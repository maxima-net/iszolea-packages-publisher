import React from 'react';
import './PublishForm.css';

function PublishForm() {
    return (
        <div className="publish-form-container">
            <h4>Publishing</h4>
            <form className="form">
                <div className="row">
                    <div className="input-field blue-text darken-1">
                        <input id="newVersion" type="text" className="validate " />
                        <label htmlFor="newVersion">New Version</label>
                    </div>
                </div>
                <div className="input-field">
                    <select>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label>Materialize Select</label>
                </div>
                <button className="waves-effect waves-light btn  blue darken-1">Publish, please</button>
            </form>
        </div>
    );
}

export default PublishForm;
