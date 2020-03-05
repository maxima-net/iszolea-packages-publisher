import React, { useEffect, useState, useRef } from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useSelector } from 'react-redux';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';
import PackageSetSelector from '../Components/PackageSetSelector';
import TextBox from '../Components/TextBox';
import './PublishedPackagesPage.scss';
import ProgressBar from '../Components/ProgressBar';

const PublishedPackagesPage: React.FC = () => {
  const filterInputRef = useRef<HTMLInputElement>(null);

  const focusFilterInput = () => {
    filterInputRef.current && filterInputRef.current.focus();
  };

  useEffect(focusFilterInput, []);

  useEffect(() => {
    M.updateTextFields();
    M.AutoInit();
  });

  const { versions, status } = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const [filter, setFilter] = useState('');
  const onFilterChanged = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(target.value);
  };

  const onSelectedPackageChanged = () => {
    setFilter('');
    focusFilterInput();
  };

  const filteredVersions = filter !== ''
    ? versions.filter((v) => v.rawVersion.includes(filter))
    : versions;

  const progressBar = status === PublishedPackagesLoadStatus.Loading
    ? <ProgressBar />
    : null;

  const versionsList = filteredVersions.length > 0 && (
    <table className="striped">
      <tbody>
        {filteredVersions.map((v) => (
          <React.Fragment key={v.rawVersion}>
            <tr>
              <td 
                className={v.isValid ? '' : 'invalid-version'}
                title={v.isValid ? '' : 'Invalid version format'}>
                {v.rawVersion}
              </td>
              <td>{JSON.stringify(v.parsedVersion)}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Header title="Published Versions" />
      <ViewContainer>
        <div className="published-packages-options">
          <PackageSetSelector onSelectionChanged={onSelectedPackageChanged} />
          <TextBox
            inputRef={filterInputRef}
            id="Search"
            type="text"
            labelText="Filter"
            value={filter}
            onChange={onFilterChanged}
          />
        </div>
        {progressBar}
        {versionsList}
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesPage;
