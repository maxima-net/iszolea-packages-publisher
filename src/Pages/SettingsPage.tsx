import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applySettings } from '../store/settings/actions';
import { AppState, Settings, SettingsValidationResult } from '../store/types';
import { switchSettingsView } from '../store/layout/actions';
import { validateSettings } from '../utils/settings';
import TextBox from '../Components/TextBox';
import CheckBox from '../Components/CheckBox';
import ViewContainer from '../Components/ViewContainer';
import './SettingsPage.scss';
import Button from '../Components/Button';
import Header from '../Components/Header';
import { config } from '../config';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    M.updateTextFields();
  });

  const settings = useSelector<AppState, Settings>((state) => state.settings);

  const [nuGetApiKey, setNugetApiKey] = useState(settings.nuGetApiKey);

  const [solutions, setSolutions] = useState(settings.solutions);
  const [npm, setNpm] = useState(settings.npm);

  const [npmAutoLogin, setNpmAutoLogin] = useState(settings.npmAutoLogin);
  const [npmLogin, setNpmLogin] = useState(settings.npmLogin);
  const [npmPassword, setNpmPassword] = useState(settings.npmPassword);
  const [npmEmail, setNpmEmail] = useState(settings.npmEmail);

  const [solutionValidationResults, setSolutionValidationResults] = useState(settings.solutionValidationResults);
  const [npmValidationResults, setNpmValidationResults] = useState(settings.npmValidationResults);
  const [isNuGetApiKeyValid, setIsNuGetApiKeyValid] = useState(settings.isNuGetApiKeyValid);
  const [isNpmLoginValid, setIsNpmLoginValid] = useState(settings.isNpmLoginValid);
  const [isNpmPasswordValid, setIsNpmPasswordValid] = useState(settings.isNpmPasswordValid);
  const [isNpmEmailValid, setIsNpmEmailValid] = useState(settings.isNpmEmailValid);
  const [mainError, setMainError] = useState(settings.mainError);

  const getSettings = (): Settings => ({
    nuGetApiKey,
    solutions,
    npm,
    npmAutoLogin,
    npmLogin,
    npmPassword,
    npmEmail,
    solutionValidationResults,
    npmValidationResults,
    isNuGetApiKeyValid,
    isNpmLoginValid,
    isNpmPasswordValid,
    isNpmEmailValid,
    mainError
  });

  const setValidationResult = (validationResult: SettingsValidationResult) => {
    const {
      solutionValidationResults,
      npmValidationResults,
      isNpmEmailValid,
      isNpmLoginValid,
      isNpmPasswordValid,
      isNuGetApiKeyValid,
      mainError
    } = validationResult;

    setSolutionValidationResults(solutionValidationResults);
    setNpmValidationResults(npmValidationResults);
    setIsNpmEmailValid(isNpmEmailValid);
    setIsNpmLoginValid(isNpmLoginValid);
    setIsNpmPasswordValid(isNpmPasswordValid);
    setIsNuGetApiKeyValid(isNuGetApiKeyValid);
    setMainError(mainError);
  };

  const handleCancelClick = () => {
    dispatch(switchSettingsView(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(applySettings(getSettings()));
  };

  const handleIsNugetPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIncluded = e.target.checked;
    const settings = getSettings();
    const solutions = { ...settings.solutions };
    solutions[e.target.name].isIncluded = isIncluded;

    const validationResult = validateSettings({ ...settings, solutions });
    setSolutions(solutions);
    setValidationResult(validationResult);
  };

  const handleSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slnPath = e.target.value;
    const settings = getSettings();
    const solutions = { ...settings.solutions };
    solutions[e.target.name].slnPath = slnPath;

    const validationResult = validateSettings({ ...settings, solutions });
    setSolutions(solutions);
    setValidationResult(validationResult);
  };

  const handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuGetApiKey = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), nuGetApiKey });
    setNugetApiKey(nuGetApiKey);
    setValidationResult(validationResult);
  };

  const handleIsNpmPackageIncluded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIncluded = e.target.checked;
    const settings = getSettings();
    const npm = { ...settings.npm };
    npm[e.target.name].isIncluded = isIncluded;

    const validationResult = validateSettings({ ...settings, npm });
    setNpm(npm);
    setValidationResult(validationResult);
  };

  const handleNpmPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const packageJsonPath = e.target.value;
    const settings = getSettings();
    const npm = { ...settings.npm };
    npm[e.target.name].packageJsonPath = packageJsonPath;

    const validationResult = validateSettings({ ...settings, npm });
    setNpm(npm);
    setValidationResult(validationResult);
  };

  const handleNpmLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmLogin = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), npmLogin });
    setNpmLogin(npmLogin);
    setValidationResult(validationResult);
  };

  const handleNpmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmPassword = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), npmPassword });
    setNpmPassword(npmPassword);
    setValidationResult(validationResult);
  };

  const handleNpmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmEmail = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), npmEmail });
    setNpmEmail(npmEmail);
    setValidationResult(validationResult);
  };

  const handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const npmAutoLogin = e.target.checked;
    const validationResult = validateSettings({ ...getSettings(), npmAutoLogin });
    setNpmAutoLogin(npmAutoLogin);
    setValidationResult(validationResult);
  };

  const areDotNetPackagesIncluded = Object.values(solutions).some((s) => s.isIncluded);
  const areNpmPackagesIncluded = Object.values(npm).some((s) => s.isIncluded);

  return (
    <>
      <Header title="Settings" />
      <ViewContainer>
        <form className="form" onSubmit={handleSubmit}>
          <h5>NuGet</h5>
          {
            Object.entries(solutions).map((e) => (
              <React.Fragment key={e[0]}>
                <div className="row checkbox-row">
                  <CheckBox
                    name={e[0]}
                    isChecked={e[1].isIncluded}
                    onChange={handleIsNugetPackageIncludedChange}
                    text={`Include ${config.nuget.solutions[e[0]].displayedName} packages`}
                  />
                </div>
                <div className="row indent-left" style={{ display: e[1].isIncluded ? undefined : 'none' }}>
                  <TextBox
                    name={e[0]}
                    type="text"
                    value={e[1].slnPath}
                    onChange={handleSlnPathChange}
                    isValid={solutionValidationResults[e[0]].isSlnPathValid}
                    labelText="Path to the solution folder"
                    helpText={`Path to the folder where the ${config.nuget.solutions[e[0]].slnFileName} file is placed`}
                  />
                </div>
              </React.Fragment>
            ))
          }
          <div
            className="row"
            style={{ display: areDotNetPackagesIncluded ? undefined : 'none' }}>
            <TextBox
              id="nuGetApiKey"
              type="text"
              value={nuGetApiKey}
              onChange={handleNuGetApiKeyChange}
              isValid={isNuGetApiKeyValid}
              labelText="Iszolea NuGet Api Key"
              helpText="An API key for publishing nuget packages to the Iszolea repository"
            />
          </div>
          <h5>NPM</h5>
          {
            Object.entries(npm).map((e) => (
              <React.Fragment key={e[0]}>
                <div className="row checkbox-row">
                  <CheckBox
                    name={e[0]}
                    isChecked={e[1].isIncluded}
                    onChange={handleIsNpmPackageIncluded}
                    text={`Include ${config.npm.packages[e[0]].packageName} package`}
                  />
                </div>
                <div className="row indent-left" style={{ display: e[1].isIncluded ? undefined : 'none' }}>
                  <TextBox
                    name={e[0]}
                    type="text"
                    value={e[1].packageJsonPath}
                    onChange={handleNpmPackageJsonPathChange}
                    isValid={npmValidationResults[e[0]].isPackageJsonPathValid}
                    labelText="Path to the root npm package folder"
                    helpText="Path to the folder where the package.json file is placed"
                  />
                </div>
              </React.Fragment>
            ))
          }
          <div className="row checkbox-row" style={{ display: areNpmPackagesIncluded ? undefined : 'none' }}>
            <CheckBox
              isChecked={npmAutoLogin}
              onChange={handleAutoLoginChange}
              text="Auto login to npm (if disabled you must be logged in manually before starting publishing)"
            />
          </div>
          <div className="row indent-left" style={{ display: areNpmPackagesIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmLogin"
              type="text"
              value={npmLogin}
              onChange={handleNpmLoginChange}
              isValid={isNpmLoginValid}
              labelText="Npm Login"
            />
          </div>
          <div className="row indent-left" style={{ display: areNpmPackagesIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmPassword"
              type="password"
              value={npmPassword}
              onChange={handleNpmPasswordChange}
              isValid={isNpmPasswordValid}
              labelText="Npm Password"
            />
          </div>
          <div className="row indent-left" style={{ display: areNpmPackagesIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmEmail"
              type="text"
              value={npmEmail}
              onChange={handleNpmEmailChange}
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
            <Button text="Apply Settings" color="blue" isDisabled={!!mainError} icon="done" />
            <Button text="Cancel" onClick={handleCancelClick} color="blue" icon="clear" />
          </div>
        </form>
      </ViewContainer>
    </>
  );
};

export default SettingsPage;
