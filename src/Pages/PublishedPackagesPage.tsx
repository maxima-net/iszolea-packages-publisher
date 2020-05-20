import React, { useEffect, useState, useRef } from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus, Publishing } from '../store/types';
import PackageSetSelector from '../Components/PackageSetSelector';
import TextBox from '../Components/TextBox';
import './PublishedPackagesPage.scss';
import ProgressBar from '../Components/ProgressBar';
import Button from '../Components/Button';
import { fetchPackageVersions } from '../store/published-packages/actions';
import { togglePublishedPackagesView } from '../store/layout/actions';
import { PackageVersionInfo } from '../version/nuget-versions-parser';
import { parseIszoleaVersion } from '../version/version-parser';
import { publishPackage } from '../store/publishing/actions';
import VersionsSelector from '../Components/VersionsSelector';
import ProjectsStatus from '../Components/ProjectStatus';

interface KeyVersionInfo {
  version: PackageVersionInfo;
  text: string;
  color?: string;
}

const PublishedPackagesPage: React.FC = () => {
  const dispatch = useDispatch();

  const filterInputRef = useRef<HTMLInputElement>(null);

  const focusFilterInput = () => {
    filterInputRef.current && filterInputRef.current.focus();
  };

  useEffect(() => {
    focusFilterInput();
    dispatch(fetchPackageVersions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    M.updateTextFields();
    M.AutoInit();
  });
  const publishedPackages = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const { status, lastUpdated } = publishedPackages;
  const versions = [...publishedPackages.versions];

  const [filter, setFilter] = useState('');
  const onFilterChanged = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(target.value);
  };

  const onSelectedPackageChanged = () => {
    setFilter('');
    focusFilterInput();
  };

  const progressBar = status === PublishedPackagesLoadStatus.Loading
    ? <><ProgressBar /><p>Loading...</p></>
    : null;

  const publishing = useSelector<AppState, Publishing>((state) => state.publishing);
  const newVersionString = publishing.newVersionError ? undefined : publishing.newVersion;
  const newVersionParsed = newVersionString ? parseIszoleaVersion(newVersionString) : undefined;
  const newVersionInfo = newVersionString && newVersionParsed ? { isValid: true, rawVersion: newVersionString, parsedVersion: newVersionParsed } : null;
  const versionProviderName = publishing.versionProviderName;

  const getKeyVersions = (): KeyVersionInfo[] => {
    const result: KeyVersionInfo[] = [];

    let isLatestBetaFound = false;
    let isLatestPatchFound = false;
    let isLocalVersionFound = false;

    if (newVersionInfo) {
      result.push({
        version: newVersionInfo,
        text: `new ${versionProviderName.toLowerCase()}`,
      });
    }

    const localVersion = publishing.selectedPackageSet && publishing.selectedPackageSet.getLocalPackageVersion();

    for (let i = 0; i < versions.length; i++) {
      if (isLatestBetaFound && isLatestPatchFound && isLocalVersionFound) {
        break;
      }

      const version = versions[i];

      if (version.rawVersion === localVersion) {
        result.push({ version, text: 'current local', color: 'light-blue' });
        isLocalVersionFound = true;
      }

      if (!isLatestBetaFound && version.isValid && version.parsedVersion && version.parsedVersion.betaIndex !== undefined) {
        result.push({ version, text: 'latest beta', color: 'purple' });
        isLatestBetaFound = true;
      }

      if (!isLatestPatchFound && version.isValid && version.parsedVersion && version.parsedVersion.betaIndex === undefined) {
        result.push({ version, text: 'latest release', color: 'green' });
        isLatestPatchFound = true;
      }
    }

    return result;
  };

  const keyVersions = getKeyVersions();

  if (newVersionInfo) {
    const n = newVersionInfo.parsedVersion;
    for (let i = 0; 0 < versions.length; i++) {
      const c = versions[i].parsedVersion;
      if (c && n && ((c.major < n.major)
        || (c.major === n.major && c.minor < n.minor)
        || (c.major === n.major && c.minor === n.minor && c.patch < n.patch)
        || (c.major === n.major && c.minor === n.minor && c.patch === n.patch && c.betaIndex && n.betaIndex === undefined)
        || (c.major === n.major && c.minor === n.minor && c.patch === n.patch && c.betaIndex && n.betaIndex && c.betaIndex < n.betaIndex))) {

        versions.splice(i, 0, newVersionInfo);
        break;
      }
    }
  }

  const filterValue = filter.trim();
  const filteredVersions = filterValue !== ''
    ? versions.filter((v) => v.rawVersion.includes(filterValue))
    : versions;

  const getBadge = (v: PackageVersionInfo) => {
    const info = keyVersions.filter((kv) => kv.version === v);
    const isNewVersion = newVersionInfo && v === newVersionInfo;

    return info
      ? info.map((i) => <><span key={i.text} className={`new badge ${i.color ? i.color : ''} ${isNewVersion ? 'blinking-badge' : ''}`} data-badge-caption={i.text}></span> </>)
      : undefined;
  };

  const handlePublishButtonClick = () => {
    dispatch(publishPackage());
  };

  const versionsList = filteredVersions.length > 0
    ? (
      <table className="striped published-versions-table">
        <tbody>
          {filteredVersions.map((v) => {
            const isNewVersion = newVersionInfo && v === newVersionInfo;

            return (
              <React.Fragment key={v.rawVersion}>
                <tr>
                  <td
                    className={`${v.isValid ? '' : 'invalid-version'} ${isNewVersion ? 'new-version' : ''}`}
                    title={v.isValid ? '' : 'Invalid version format'}>
                    {v.rawVersion} {getBadge(v)} 
                  </td>
                  <td className="command-column">
                    {isNewVersion && <Button 
                      text="Publish, please"
                      icon="cloud_upload"
                      color="blue"
                      className="publish-button"
                      title="This version will be published"
                      onClick={handlePublishButtonClick} />}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    )
    : status !== PublishedPackagesLoadStatus.Loading
      ? <p>{publishing.selectedPackageSet ? 'There is no data by given criteria' : 'Select a project'}</p>
      : null;

  const handleRefreshClick = () => {
    dispatch(fetchPackageVersions(true));
  };

  const handleCloseButtonClick = () => {
    dispatch(togglePublishedPackagesView());
  };

  return (
    <>
      <Header title="Published Versions" />
      <ViewContainer>
        <div className="published-packages-options">
          <PackageSetSelector onSelectionChanged={onSelectedPackageChanged} />
          <TextBox
            inputRef={filterInputRef}
            id="Filter"
            type="text"
            labelText="Filter"
            placeholder="Enter filter value"
            value={filter}
            onChange={onFilterChanged}
          />
          <Button onClick={handleRefreshClick} text="Refresh" color="blue" />
          <Button text="Back" color="blue" type="button" onClick={handleCloseButtonClick} />
        </div>
        <div className="project-status-container__published-versions">
          <ProjectsStatus />
        </div>
        <div className="versions-selector-container">
          <VersionsSelector />
        </div>
        {lastUpdated && <p className="last-updated-info">Last Updated: {lastUpdated.toLocaleTimeString()}</p>}
        {progressBar}
        {versionsList}
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesPage;
