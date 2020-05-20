import React, { CSSProperties, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkGitRepository, applyNewVersion, publishPackage } from '../store/publishing/actions';
import { AppState, Publishing, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';
import ViewContainer from '../Components/ViewContainer';
import './PublishSetupPage.scss';
import Button from '../Components/Button';
import Header from '../Components/Header';
import PackageSetSelector from '../Components/PackageSetSelector';
import { togglePublishedPackagesView } from '../store/layout/actions';
import VersionsSelector from '../Components/VersionsSelector';
import ProjectsStatus from '../Components/ProjectStatus';

const PublishSetupPage: React.FC = () => {
  const newVersionInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
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
    versionProviders,
    versionProviderName,
    newVersion,
    newVersionError,
    isEverythingCommitted,
  } = publishing;

  const publishedPackagesInfo = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const currentVersion = (selectedPackageSet && selectedPackageSet.getLocalPackageVersion()) || '';

  useEffect(() => {
    const input = newVersionInputRef.current;
    if (!input) {
      return;
    }

    const selectedVersionProvider = versionProviders.get(versionProviderName);
    if (selectedVersionProvider && selectedVersionProvider.isCustom()) {
      input.focus();
      input.select();
    } else if (document.activeElement === input) {
      input.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionProviderName]);

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

  const selectedVersionProvider = versionProviders.get(versionProviderName);
  const targetVersionText = selectedVersionProvider
    ? selectedVersionProvider.getTargetVersionString()
    : 'N/A';

  const isPublishedPackagesListLoading = publishedPackagesInfo.status === PublishedPackagesLoadStatus.Loading;

  const newVersionText = isPublishedPackagesListLoading
    ? 'Loading published package versions...'
    : newVersion;

  const handlePublishedVersionsButtonClick = () => {
    dispatch(togglePublishedPackagesView());
  };

  return (
    <>
      <Header title="Set-Up Publishing" />
      <ViewContainer>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="package-selector-container">
              <PackageSetSelector />
              <Button
                icon="storage"
                text="Published versions"
                color="blue"
                type="button"
                isDisabled={!selectedPackageSet || isPublishedPackagesListLoading}
                onClick={handlePublishedVersionsButtonClick} />
            </div>
          </div>

          <div className={`project-status-container ${isEverythingCommitted === false ? 'invalid' : ''}`} style={selectedPackageSet ? {} : { display: 'none' }}>
            <ProjectsStatus />
          </div>
          
          <div className="row version-selector-row" style={secondStepRowStyles}>
            <VersionsSelector />
          </div>

          <div className="version-inputs-container" >
            <div className="row" style={secondStepRowStyles}>
              <div className={`${targetVersionText ? 'current-and-latest-versions-container' : ''}`}>
                <div className="input-field blue-text darken-1">
                  <input
                    id="currentVersion"
                    type="text"
                    disabled
                    value={currentVersion}
                  />
                  <label htmlFor="currentVersion">Current local version</label>
                </div>

                <div className="input-field blue-text darken-1" style={{ display: targetVersionText ? undefined : 'none' }}>
                  <input
                    id="targetVersion"
                    type="text"
                    disabled
                    value={targetVersionText}
                  />
                  <label htmlFor="targetVersion">Taking into account that</label>
                </div>
              </div>
            </div>

            <div className="row" style={secondStepRowStyles}>
              <div className={`input-field blue-text darken-1 ${packageVersionErrorClass}`}>
                <input
                  ref={newVersionInputRef}
                  id="newVersion"
                  type="text"
                    className={`validate ${isPublishedPackagesListLoading ? 'blinking' : ''}`}
                  value={newVersionText}
                  onChange={handleNewVersionChange}
                />
                <label htmlFor="newVersion">New package version</label>
                <span className={`helper-text ${packageVersionErrorClass}`}>{newVersionError}</span>
              </div>
            </div>
          </div>

          <div className="row row-button" style={secondStepRowStyles}>
            <div className="row-button-container">
              <Button text="Publish, please" icon="cloud_upload" color="blue" isDisabled={!isReadyToPublish} />
            </div>
          </div>
        </form>
      </ViewContainer>
    </>
  );
};

export default PublishSetupPage;
