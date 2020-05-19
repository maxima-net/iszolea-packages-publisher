import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, PublishedPackagesLoadStatus, Publishing } from '../store/types';
import { selectVersionProvider } from '../store/publishing/actions';

const VersionsSelector: React.FC = () => {
  const status = useSelector<AppState, PublishedPackagesLoadStatus>((s) => s.publishedPackages.status);
  const publishing = useSelector<AppState, Publishing>((s) => s.publishing);
 
  const {versionProviders, versionProviderName} = publishing;
  const isPublishedPackagesListLoading = status === PublishedPackagesLoadStatus.Loading;

  const dispatch = useDispatch();

  const handleVersionProviderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const versionProviderName = e.target.value;
    dispatch(selectVersionProvider(versionProviderName));
  };
  
  const versionSelectors = Array.from(versionProviders.values()).map((p) => {
    const name = p.getName();

    return (
      <label className="radio-btn-container" key={name}>
        <input
          className="with-gap"
          name="versionUpdateType"
          type="radio"
          value={name}
          disabled={!p.canGenerateNewVersion() || isPublishedPackagesListLoading}
          checked={name === versionProviderName}
          onChange={handleVersionProviderNameChange}
        />
        <span>{name}</span>
      </label>
    );
  });

  return (
    <div className="version-selectors-container">
      {versionSelectors}
    </div>
  );
};

export default VersionsSelector;
