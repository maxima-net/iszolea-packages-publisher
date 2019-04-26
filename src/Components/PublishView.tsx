import React, { Component, Fragment } from 'react';
import './PublishView.css';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView from './PublishExecutingView';
import { AppState, PublishingInfo } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';
import { initializePublishing, checkGitRepository } from '../actions';

interface MappedProps {
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    publishingInfo: state.publishingInfo
  }
}

interface Dispatchers {
  initializePublishing: () => void;
  checkGitRepository: () => void;
}

const dispatchers: Dispatchers = {
  initializePublishing,
  checkGitRepository,
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
        <PublishExecutingView />
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
}

export default connect(mapStateToProps, dispatchers)(PublishView);
