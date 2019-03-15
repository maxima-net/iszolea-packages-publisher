import React, { Component } from 'react';
import './PublishForm.css';
import IszoleaPathHelper from '../iszolea-path-helper';

declare const M: any;

interface PublishFormProps {
  baseSlnPath: string;
}

class PublishForm extends Component<PublishFormProps> {
  selectors: any[] | undefined;

  componentDidMount() {
    const elements = document.querySelectorAll('select');
    this.selectors = M.FormSelect.init(elements);
  }

  componentWillUnmount() {
    if(this.selectors) {
      this.selectors.forEach((s) => {
        s.destroy();
      });
    }
  }

  render() {
    const projects = IszoleaPathHelper.getIszoleaProjectNames(this.props.baseSlnPath);
    const options = projects.map((p) => (
      <option key={p} value={p}>{p}</option>
    ));

    return (
      <div className="publish-form-container">
        <h4>Publishing</h4>
        <form className="form">
          <div className="row">
              <div className="input-field">
                <select defaultValue="">
                  <option value="" disabled>Select project</option>
                  {options}
                </select>
                <label>Project</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field blue-text darken-1">
                <input id="newVersion" type="text" className="validate " />
                <label htmlFor="newVersion">New Version</label>
              </div>
            </div>

            <button className="waves-effect waves-light btn  blue darken-1">Publish, please</button>
        </form>
      </div>
    );
  }
}

export default PublishForm;
