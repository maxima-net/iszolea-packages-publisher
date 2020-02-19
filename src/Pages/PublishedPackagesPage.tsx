import React from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useSelector } from 'react-redux';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';

const PublishedPackagesPage: React.FC = () => {
  const { versions, status, packageName } = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const loadingText = status === PublishedPackagesLoadStatus.Loading
    ? 'Loading...'
    : null;

  const versionsList = versions.length > 0 && (
    <table className="striped">
      <caption>{packageName}</caption>
      <thead>
        <tr><th>Version</th></tr>
      </thead>
      <tbody>
        {versions.map((v) => (
          <React.Fragment key={v}>
            <tr>
              <td >{v}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Header title="Published packages" />
      <ViewContainer>
        {loadingText}
        {versionsList}
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesPage;
