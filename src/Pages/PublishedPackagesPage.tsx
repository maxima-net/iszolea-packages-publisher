import React, { useEffect, useState, useRef } from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';
import PackageSetSelector from '../Components/PackageSetSelector';
import TextBox from '../Components/TextBox';
import './PublishedPackagesPage.scss';
import ProgressBar from '../Components/ProgressBar';
import Button from '../Components/Button';
import { fetchPackageVersions } from '../store/published-packages/actions';
import { togglePublishedPackagesView } from '../store/layout/actions';

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
                  {v.rawVersion}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    )
    : status !== PublishedPackagesLoadStatus.Loading
      ? <p>There is no data by given criteria</p>
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
