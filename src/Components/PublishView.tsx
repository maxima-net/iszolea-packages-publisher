import React, { Component, Fragment } from 'react';
import './PublishView.css';
import { PackageSet } from '../utils/path-helper';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView from './PublishExecutingView';
import { Settings, AppState, PublishingInfo } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';
import { initializePublishing, selectProject, selectVersionProvider, applyNewVersion, publishPackage, rejectPublishing, checkGitRepository } from '../actions';

interface MappedProps {
  settings: Settings;
  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    settings: state.settings,
    availablePackages: state.availablePackages,
    packageSetId: state.packageSetId,
    versionProviderName: state.versionProviderName,
    newVersion: state.newVersion,
    isCustomVersionSelection: state.isCustomVersionSelection,
    isEverythingCommitted: state.isEverythingCommitted,
    publishingInfo: state.publishingInfo
  }
}

interface Dispatchers {
  initializePublishing: () => void;
  checkGitRepository: () => void;
  selectProject: (packageSetId: number) => void;
  selectVersionProvider: (versionProviderName: string) => void;
  applyNewVersion: (newVersion: string) => void;
  publishPackage: () => void;
  rejectPublishing: () => void;
}

const dispatchers: Dispatchers = {
  initializePublishing,
  checkGitRepository,
  selectProject,
  selectVersionProvider,
  applyNewVersion,
  publishPackage,
  rejectPublishing
}

type PublishViewProps = MappedProps & Dispatchers;

class PublishView extends Component<PublishViewProps> {
  gitTimer: NodeJS.Timeout | undefined;

  constructor(props: Readonly<PublishViewProps>) {
    super(props);

    this.props.initializePublishing();
  }

  componentDidMount() {
    this.gitTimer = setInterval(this.props.checkGitRepository, 3000);
  }

  componentWillUnmount(): void {
    if (this.gitTimer) {
      clearInterval(this.gitTimer)
    }
  }

  render() {
    const content = this.props.publishingInfo
      ? (
        <PublishExecutingView
          {...this.props.publishingInfo}
          packages={this.getSelectedPackageSet().projectsInfo.map((i) => i.name)}
          packageVersion={this.props.newVersion}
          handleCloseClick={this.handleClosePublishingViewClick}
          handleRejectClick={this.handleRejectPublishingClick}
        />
      )
      : (
        <PublishSetupForm />
      )

    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }

  getSelectedPackageSet(): PackageSet {
    return this.props.availablePackages.filter(p => p.id === this.props.packageSetId)[0];
  }

  handleClosePublishingViewClick = () => {
    this.props.initializePublishing();
  }

  handleRejectPublishingClick = async () => {
    await this.props.rejectPublishing();
  }
}

export default connect(mapStateToProps, dispatchers)(PublishView);
