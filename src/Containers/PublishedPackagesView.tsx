import React from 'react';
import Header from '../Components/Header';
import ViewContainer from '../Components/ViewContainer';

const PublishedPackagesView: React.FC = () => {
  return (
    <>
      <Header title="Published packages" />
      <ViewContainer>
        <h1>Content</h1>
      </ViewContainer>
    </>
  );
};

export default PublishedPackagesView;
