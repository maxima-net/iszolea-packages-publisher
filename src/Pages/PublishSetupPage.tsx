import React, { CSSProperties, useEffect, useRef } from 'react';
import { VersionProvider, VersionProviderFactory } from '../version/version-providers';
import { useDispatch, useSelector } from 'react-redux';
import { initializePublishing, checkGitRepository, selectVersionProvider, applyNewVersion, publishPackage } from '../store/publishing/actions';
import { AppState, Publishing, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';
import ViewContainer from '../Components/ViewContainer';
import './PublishSetupPage.scss';
import Button from '../Components/Button';
import Header from '../Components/Header';
import PackageSetSelector from '../Components/PackageSetSelector';

const PublishSetupPage: React.FC = () => {
  const newVersionInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializePublishing());
    const gitTimer = setInterval(() => dispatch(checkGitRepository()), 3000);

    return () => {
      clearInterval(gitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    M.updateTextFields();
    M.AutoInit();
  });

  const publishing = useSelector<AppState, Publishing>((state) => state.publishing);
  const {
    selectedPackageSet,
    versionProviderName,
    newVersion,
    newVersionError,
    isEverythingCommitted,
    branchName,
  } = publishing;

  const publishedPackagesInfo = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const getVersionProviders = (currentVersion: string): VersionProvider[] => {
    return new VersionProviderFactory(currentVersion).getProviders();
  };

  const currentVersion = (selectedPackageSet && selectedPackageSet.getLocalPackageVersion()) || '';
  const versionProviders = getVersionProviders(currentVersion);

  useEffect(() => {
    const input = newVersionInputRef.current;
    if (!input) {
      return;
    }

    if (versionProviders.some((p) => p.getName() === versionProviderName && p.isCustom())) {
      input.focus();
      input.select();
    } else if (document.activeElement === input) {
      input.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionProviderName]);


  const handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value;
    dispatch(selectVersionProvider(versionProviderName));
  };

  const handleNewVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = e.target.value;
    dispatch(applyNewVersion(newVersion));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(publishPackage());
  };

  const projectsInfo = selectedPackageSet ? selectedPackageSet.projectsInfo[0] : '';
  const secondStepRowStyles: CSSProperties = projectsInfo ? {} : { display: 'none' };
  const packageVersionErrorClass = newVersionError ? 'invalid' : 'valid';
  const isReadyToPublish = isEverythingCommitted && !newVersionError
    && publishedPackagesInfo.status === PublishedPackagesLoadStatus.Loaded;

  const latestVersionText = publishedPackagesInfo.status === PublishedPackagesLoadStatus.Loading
    ? 'Loading...'
    : publishedPackagesInfo.status === PublishedPackagesLoadStatus.Unloaded
      ? 'Unloaded'
      : publishedPackagesInfo.versions.length > 0
        ? publishedPackagesInfo.versions[0].rawVersion
        : 'N/A';

  const versionSelectors = versionProviders.map((p) => {
    const name = p.getName();

    return (
      <label className="radio-btn-container" key={name}>
        <input
          className="with-gap"
          name="versionUpdateType"
          type="radio"
          value={name}
          disabled={!p.canGenerateNewVersion()}
          checked={name === versionProviderName}
          onChange={handleVersionProviderNameChange}
        />
        <span>{name}</span>
      </label>
    );
  });

  const isEverythingCommittedInputText = isEverythingCommitted === undefined
    ? 'Checking git status...'
    : isEverythingCommitted
      ? 'The git repository is OK'
      : 'Commit or remove unsaved changes';

  return (
    <>
      <Header title="Set-Up Publishing" />
      <ViewContainer>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <PackageSetSelector />
          </div>

          <div className={`row-checks git-info ${isEverythingCommitted === false ? 'invalid' : ''}`} style={secondStepRowStyles}>
            <label className="status-container">
              <input
                id="isEverythingCommitted"
                readOnly
                tabIndex={-1}
                checked={!!isEverythingCommitted}
                type="checkbox"
              />
              <span className="status-container__status">{isEverythingCommittedInputText}</span>
            </label>
            <label className="branch-container" style={{ visibility: branchName ? undefined : 'hidden' }} title="Current branch name">
              <i className="material-icons git-info__icon">call_split</i>
              <span className="branch-container__branch">{branchName}</span>
            </label>
          </div>

          <div className="row version-selectors-row" style={secondStepRowStyles}>
            <div className="version-selectors-container">
              {versionSelectors}
            </div>
          </div>

          <div className="version-inputs-container">
            <div className="row" style={secondStepRowStyles}>
              <div className="current-and-latest-versions-container">
                <div className="input-field blue-text darken-1">
                  <input
                    id="currentVersion"
                    type="text"
                    disabled
                    value={currentVersion}
                  />
                  <label htmlFor="currentVersion">Current local version</label>
                </div>

                <div className="input-field blue-text darken-1">
                  <input
                    id="lastPublishedVersion"
                    type="text"
                    disabled
                    value={latestVersionText}
                  />
                  <label htmlFor="lastPublishedVersion">Latest published version</label>
                </div>
              </div>
            </div>

            <div className="row" style={secondStepRowStyles}>
              <div className={`input-field blue-text darken-1 ${packageVersionErrorClass}`}>
                <input
                  ref={newVersionInputRef}
                  id="newVersion"
                  type="text"
                  className="validate"
                  value={newVersion}
                  onChange={handleNewVersionChange}
                />
                <label htmlFor="newVersion">New package version</label>
                <span className={`helper-text ${packageVersionErrorClass}`}>{newVersionError}</span>
              </div>
            </div>
          </div>

          <div className="row row-button" style={secondStepRowStyles}>
            <Button text="Publish, please" icon="cloud_upload" color="blue" isDisabled={!isReadyToPublish} />
          </div>
        </form>
      </ViewContainer>
    </>
  );
};

export default PublishSetupPage;
