import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useSelector } from 'react-redux';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';
import PackageSetSelector from '../Components/PackageSetSelector';
import TextBox from '../Components/TextBox';
import './PublishedPackagesPage.scss';

const PublishedPackagesPage: React.FC = () => {
  useEffect(() => {
    M.updateTextFields();
    M.AutoInit();
  });

  const { versions, status } = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const [filter, setFilter] = useState('');
  const onFilterChanged = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(target.value);
  };

  const onSelectedPackageChanged = () => setFilter('');

  const filteredVersions = filter !== ''
    ? versions.filter((v) => v.rawVersion.includes(filter))
    : versions;

  const loadingText = status === PublishedPackagesLoadStatus.Loading
    ? 'Loading...'
    : null;

  const versionsList = filteredVersions.length > 0 && (
    <table className="striped">
      <tbody>
        {filteredVersions.map((v) => (
          <React.Fragment key={v.rawVersion}>
            <tr>
              <td>{v.rawVersion}</td>
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
          <PackageSetSelector
            onSelectionChanged={onSelectedPackageChanged}
          />
          <TextBox
            id="Search"
            type="text"
            labelText="Filter"
            value={filter}
            onChange={onFilterChanged}
          />
        </div>
        {loadingText}
        {versionsList}
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesPage;
