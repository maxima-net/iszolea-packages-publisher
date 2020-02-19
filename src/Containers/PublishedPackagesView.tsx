import React, { useEffect } from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getPackageVersions } from '../store/published-packages/actions';
import { AppState, PublishedPackages, PublishedPackagesLoadStatus } from '../store/types';

const PublishedPackagesView: React.FC = () => {
  const { versions, status } = useSelector<AppState, PublishedPackages>((state) => state.publishedPackages);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPackageVersions('ISOZ.Claims'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadingText = status === PublishedPackagesLoadStatus.Loading
    ? 'Loading...'
    : null;

  const versionsList = versions.length > 0 && (
    <table className="striped">
      <thead>
        <tr><th>Version</th></tr>
      </thead>
      <tbody>
        {versions.map((v) => (
          <>
            <tr>
              <td key={v}>{v}</td>
            </tr>
          </>
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

export default PublishedPackagesView;
