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

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch(); 
  useEffect(() => {
    M.updateTextFields();
  });

  const settings = useSelector<AppState, Settings>((state) => state.settings);

  const [nuGetApiKey, setNugetApiKey] = useState(settings.nuGetApiKey);
  const [isIszoleaPackagesIncluded, setIsIszoleaPackagesIncluded] = useState(settings.isIszoleaPackagesIncluded);
  const [baseSlnPath, setBaseSlnPath] = useState(settings.baseSlnPath);
  const [isBomCommonPackageIncluded, setIsBomCommonPackageIncluded] = useState(settings.isBomCommonPackageIncluded);
  const [bomCommonPackageSlnPath, setBomCommonPackageSlnPath] = useState(settings.bomCommonPackageSlnPath);
  const [isSmpCommonPackageIncluded, setIsSmpCommonPackageIncluded] = useState(settings.isSmpCommonPackageIncluded);
  const [smpCommonPackageSlnPath, setSmpCommonPackageSlnPath] = useState(settings.smpCommonPackageSlnPath);
  const [isIszoleaUiPackageIncluded, setIsIszoleaUiPackageIncluded] = useState(settings.isIszoleaUiPackageIncluded);
  const [uiPackageJsonPath, setUiPackageJsonPath] = useState(settings.uiPackageJsonPath);
  const [npmAutoLogin, setNpmAutoLogin] = useState(settings.npmAutoLogin);
  const [npmLogin, setNpmLogin] = useState(settings.npmLogin);
  const [npmPassword, setNpmPassword] = useState(settings.npmPassword);
  const [npmEmail, setNpmEmail] = useState(settings.npmEmail);
  const [isBaseSlnPathValid, setIsBaseSlnPathValid] = useState(settings.isBaseSlnPathValid);
  const [isNuGetApiKeyValid, setIsNuGetApiKeyValid] = useState(settings.isNuGetApiKeyValid);
  const [isUiPackageJsonPathValid, setIsUiPackageJsonPathValid] = useState(settings.isUiPackageJsonPathValid);
  const [isBomCommonPackageSlnPathValid, setIsBomCommonPackageSlnPathValid] = useState(settings.isBomCommonPackageSlnPathValid);
  const [isSmpCommonPackageSlnPathValid, setIsSmpCommonPackageSlnPathValid] = useState(settings.isSmpCommonPackageSlnPathValid);
  const [isNpmLoginValid, setIsNpmLoginValid] = useState(settings.isNpmLoginValid);
  const [isNpmPasswordValid, setIsNpmPasswordValid] = useState(settings.isNpmPasswordValid);
  const [isNpmEmailValid, setIsNpmEmailValid] = useState(settings.isNpmEmailValid);
  const [mainError, setMainError] = useState(settings.mainError);

  const getSettings = (): Settings => ({
    nuGetApiKey,
    isIszoleaPackagesIncluded,
    baseSlnPath,
    isBomCommonPackageIncluded,
    bomCommonPackageSlnPath,
    isSmpCommonPackageIncluded,
    smpCommonPackageSlnPath,
    isIszoleaUiPackageIncluded,
    uiPackageJsonPath,
    npmAutoLogin,
    npmLogin,
    npmPassword,
    npmEmail,
    isBaseSlnPathValid,
    isNuGetApiKeyValid,
    isUiPackageJsonPathValid,
    isBomCommonPackageSlnPathValid,
    isSmpCommonPackageSlnPathValid,
    isNpmLoginValid,
    isNpmPasswordValid,
    isNpmEmailValid,
    mainError
  });

  const setValidationResult = (validationResult: SettingsValidationResult) => {
    const {
      isBomCommonPackageSlnPathValid,
      isSmpCommonPackageSlnPathValid,
      isBaseSlnPathValid,
      isNpmEmailValid,
      isNpmLoginValid,
      isNpmPasswordValid,
      isNuGetApiKeyValid,
      isUiPackageJsonPathValid,
      mainError
    } = validationResult;

    setIsBomCommonPackageSlnPathValid(isBomCommonPackageSlnPathValid);
    setIsSmpCommonPackageSlnPathValid(isSmpCommonPackageSlnPathValid);
    setIsBaseSlnPathValid(isBaseSlnPathValid);
    setIsNpmEmailValid(isNpmEmailValid);
    setIsNpmLoginValid(isNpmLoginValid);
    setIsNpmPasswordValid(isNpmPasswordValid);
    setIsNuGetApiKeyValid(isNuGetApiKeyValid);
    setIsUiPackageJsonPathValid(isUiPackageJsonPathValid);
    setMainError(mainError);
  };

  const handleCancelClick = () => {
    dispatch(switchSettingsView(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(applySettings(getSettings()));
  };

  const handleIsIszoleaPackagesIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIszoleaPackagesIncluded = e.target.checked;
    const validationResult = validateSettings({ ...getSettings(), isIszoleaPackagesIncluded });
    setIsIszoleaPackagesIncluded(isIszoleaPackagesIncluded);
    setValidationResult(validationResult);
  };

  const handleBaseSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const baseSlnPath = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), baseSlnPath });
    setBaseSlnPath(baseSlnPath);
    setValidationResult(validationResult);
  };

  const handleIsBomCommonPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isBomCommonPackageIncluded = e.target.checked;
    const validationResult = validateSettings({ ...getSettings(), isBomCommonPackageIncluded });
    setIsBomCommonPackageIncluded(isBomCommonPackageIncluded);
    setValidationResult(validationResult);
  };

  const handleBomCommonPackageSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bomCommonPackageSlnPath = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), bomCommonPackageSlnPath });
    setBomCommonPackageSlnPath(bomCommonPackageSlnPath);
    setValidationResult(validationResult);
  };

  const handleIsSmpCommonPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSmpCommonPackageIncluded = e.target.checked;
    const validationResult = validateSettings({ ...getSettings(), isSmpCommonPackageIncluded });
    setIsSmpCommonPackageIncluded(isSmpCommonPackageIncluded);
    setValidationResult(validationResult);
  };

  const handleSmpCommonPackageSlnPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const smpCommonPackageSlnPath = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), smpCommonPackageSlnPath });
    setSmpCommonPackageSlnPath(smpCommonPackageSlnPath);
    setValidationResult(validationResult);
  };

  const handleNuGetApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuGetApiKey = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), nuGetApiKey });
    setNugetApiKey(nuGetApiKey);
    setValidationResult(validationResult);
  };

  const handleIssIszoleaUiPackageIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isIszoleaUiPackageIncluded = e.target.checked;
    const validationResult = validateSettings({ ...getSettings(), isIszoleaUiPackageIncluded });
    setIsIszoleaUiPackageIncluded(isIszoleaUiPackageIncluded);
    setValidationResult(validationResult);
  };

  const handleUiPackageJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uiPackageJsonPath = e.target.value;
    const validationResult = validateSettings({ ...getSettings(), uiPackageJsonPath });
    setUiPackageJsonPath(uiPackageJsonPath);
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

  return (
    <>
      <Header title="Settings" />
      <ViewContainer>
        <form className="form" onSubmit={handleSubmit}>
          <h5>NuGet</h5>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isIszoleaPackagesIncluded}
              onChange={handleIsIszoleaPackagesIncludedChange}
              text="Include Iszolea packages"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaPackagesIncluded ? undefined : 'none' }}>
            <TextBox
              id="baseSlnPath"
              type="text"
              value={baseSlnPath}
              onChange={handleBaseSlnPathChange}
              isValid={isBaseSlnPathValid}
              labelText="Path to the Iszolea-Base solution folder"
              helpText="Path to the folder where the ISOZ.sln file is placed"
            />
          </div>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isBomCommonPackageIncluded}
              onChange={handleIsBomCommonPackageIncludedChange}
              text="Include BOM Common"
            />
          </div>
          <div className="row indent-left" style={{ display: isBomCommonPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="bomCommonPackageSlnPath"
              type="text"
              value={bomCommonPackageSlnPath}
              onChange={handleBomCommonPackageSlnPathChange}
              isValid={isBomCommonPackageSlnPathValid}
              labelText="Path to the BOM Common solution folder"
              helpText="Path to the folder where the BomCommon.sln file is placed"
            />
          </div>
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isSmpCommonPackageIncluded}
              onChange={handleIsSmpCommonPackageIncludedChange}
              text="Include SMP Packages"
            />
          </div>
          <div className="row indent-left" style={{ display: isSmpCommonPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="smpCommonPackageSlnPath"
              type="text"
              value={smpCommonPackageSlnPath}
              onChange={handleSmpCommonPackageSlnPathChange}
              isValid={isSmpCommonPackageSlnPathValid}
              labelText="Path to the SMP solution folder"
              helpText="Path to the folder where the SMP.sln file is placed"
            />
          </div>
          <div className="row" style={{ display: isIszoleaPackagesIncluded || isBomCommonPackageIncluded || isSmpCommonPackageIncluded ? undefined : 'none' }}>
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
          <div className="row checkbox-row">
            <CheckBox
              isChecked={isIszoleaUiPackageIncluded}
              onChange={handleIssIszoleaUiPackageIncludedChange}
              text="Include Iszolea UI"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded ? undefined : 'none' }}>
            <TextBox
              id="uiPackageJsonPath"
              type="text"
              value={uiPackageJsonPath}
              onChange={handleUiPackageJsonPathChange}
              isValid={isUiPackageJsonPathValid}
              labelText="Path to the Iszolea UI npm package folder"
              helpText="Path to the folder where the package.json file is placed"
            />
          </div>
          <div className="row checkbox-row" style={{ display: isIszoleaUiPackageIncluded ? undefined : 'none' }}>
            <CheckBox
              isChecked={npmAutoLogin}
              onChange={handleAutoLoginChange}
              text="Auto login to npm (if disabled you must be logged in manually before starting publishing)"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmLogin"
              type="text"
              value={npmLogin}
              onChange={handleNpmLoginChange}
              isValid={isNpmLoginValid}
              labelText="Npm Login"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
            <TextBox
              id="npmPassword"
              type="password"
              value={npmPassword}
              onChange={handleNpmPasswordChange}
              isValid={isNpmPasswordValid}
              labelText="Npm Password"
            />
          </div>
          <div className="row indent-left" style={{ display: isIszoleaUiPackageIncluded && npmAutoLogin ? undefined : 'none' }}>
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
