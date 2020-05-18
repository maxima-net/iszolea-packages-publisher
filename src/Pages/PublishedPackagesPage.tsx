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

interface KeyVersionInfo {
  version: PackageVersionInfo;
  text: string;
  color: string;
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

  const { versions, status, lastUpdated } = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const [filter, setFilter] = useState('');
  const onFilterChanged = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(target.value);
  };

  const onSelectedPackageChanged = () => {
    setFilter('');
    focusFilterInput();
  };

  const filterValue = filter.trim();
  const filteredVersions = filterValue !== ''
    ? versions.filter((v) => v.rawVersion.includes(filterValue))
    : versions;

  const progressBar = status === PublishedPackagesLoadStatus.Loading
    ? <><ProgressBar /><p>Loading...</p></>
    : null;

  const publishing = useSelector<AppState, Publishing>((state) => state.publishing);

  const getKeyVersions = (): KeyVersionInfo[] => {
    const result: KeyVersionInfo[] = [];

    let isLatestBetaFound = false;
    let isLatestPatchFound = false;
    let isLocalVersionFound = false;

    const localVersion = publishing.selectedPackageSet && publishing.selectedPackageSet.getLocalPackageVersion();
  
    for (let i = 0; i < versions.length; i++) {
      if(isLatestBetaFound && isLatestPatchFound && isLocalVersionFound) {
        break;
      }

      const version = versions[i];

      if (version.rawVersion === localVersion) {
        result.push({ version, text: 'current local', color: 'blue' });
        isLocalVersionFound = true;
      }

      if (!isLatestBetaFound && version.parsedVersion && version.parsedVersion.betaIndex !== undefined) {
        result.push({ version, text: 'latest beta', color: 'purple' });
        isLatestBetaFound = true;
      }

      if (!isLatestPatchFound && version.parsedVersion && version.parsedVersion.betaIndex === undefined) {
        result.push({ version, text: 'latest release', color: 'green' });
        isLatestPatchFound = true;
      }
    }

    return result;
  };

  const keyVersions = getKeyVersions();
  const getBadge = (p: PackageVersionInfo) => {
    const info = keyVersions.filter((kv) => kv.version === p);
    return info
      ? info.map((i) => <><span key={i.text} className={`new badge ${i.color}`} data-badge-caption={i.text}></span> </>)
      : undefined;
  };

  const versionsList = filteredVersions.length > 0
    ? (
      <table className="striped published-versions-table">
        <tbody>
          {filteredVersions.map((v) => (
            <React.Fragment key={v.rawVersion}>
              <tr>
                <td
                  className={v.isValid ? '' : 'invalid-version'}
                  title={v.isValid ? '' : 'Invalid version format'}>
                  {v.rawVersion} {getBadge(v)}
                </td>
              </tr>
            </React.Fragment>
          ))}
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
          <Button onClick={handleRefreshClick} text="Refresh" color="light-blue" />
          <Button text="Close" color="light-blue" type="button" onClick={handleCloseButtonClick} />

        </div>
        {lastUpdated && <p className="last-updated-info">Last Updated: {lastUpdated.toLocaleTimeString()}</p>}
        {progressBar}
        {versionsList}
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesPage;
