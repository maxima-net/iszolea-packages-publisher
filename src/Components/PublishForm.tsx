import React, { Component } from 'react';
import './PublishForm.css';
import IszoleaPathHelper from '../iszolea-path-helper';
import { strict } from 'assert';

declare const M: any;

interface PublishFormProps {
  baseSlnPath: string;
}

interface PublishFormState {
  project: string;
}

class PublishForm extends Component<PublishFormProps, PublishFormState> {
  selectors: any[] | undefined;

  constructor(props: Readonly<PublishFormProps>) {
    super(props);
    
    this.state = {
      project: ''
    }
  }

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

  componentDidUpdate() {
    M.updateTextFields();
  }

  render() {
    const baseSlnPath = this.props.baseSlnPath
    const project = this.state.project;

    const projects = IszoleaPathHelper.getIszoleaProjectNames(baseSlnPath);
    const options = projects.map((p) => (
      <option key={p} value={p}>{p}</option>
    ));

    const currentVersion = project !== '' ? IszoleaPathHelper.getLocalPackageVersion(baseSlnPath, project) : '';

    return (
      <div className="publish-form-container">
        <h4>Publishing</h4>
        <form className="form">
          <div className="row">
              <div className="input-field">
                <select 
                  value={this.state.project}
                  onChange={this.handleProjectChange}>
                  <option value="" disabled>Select project</option>
                  {options}
                </select>
                <label>Project</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field blue-text darken-1">
                <input disabled id="currentVersion" type="text" className="validate" defaultValue={currentVersion} />
                <label htmlFor="currentVersion">Current local version</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field blue-text darken-1">
                <input id="newVersion" type="text" className="validate" />
                <label htmlFor="newVersion">New Version</label>
              </div>
            </div>

            <button className="waves-effect waves-light btn  blue darken-1">Publish, please</button>
        </form>
      </div>
    );
  }

  handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      project: event.target.value
    })
  }
}

export default PublishForm;
