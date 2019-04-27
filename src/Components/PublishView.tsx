import React, { Component, Fragment } from 'react';
import './PublishView.css';
import PublishSetupForm from './PublishSetupForm';
import PublishExecutingView from './PublishExecutingView';
import { AppState, PublishingInfo } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';
import { checkGitRepository } from '../actions';

interface MappedProps {
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    publishingInfo: state.publishingInfo
  }
}

interface Dispatchers {
  checkGitRepository: () => void;
}

const dispatchers: Dispatchers = {
  checkGitRepository,
}

type PublishViewProps = MappedProps & Dispatchers;

class PublishView extends Component<PublishViewProps> {
  gitTimer: NodeJS.Timeout | undefined;

  componentDidMount() {
    this.gitTimer = setInterval(this.props.checkGitRepository, 3000);
  }

  componentWillUnmount(): void {
    if (this.gitTimer) {
      clearInterval(this.gitTimer)
    }
  }

  render() {
    return this.props.publishingInfo
      ? (
        <PublishExecutingView />
      )
      : (
        <PublishSetupForm />
      )
  }
}

export default connect(mapStateToProps, dispatchers)(PublishView);
