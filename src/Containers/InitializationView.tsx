import React, { PureComponent } from 'react';
import './InitializationView.scss';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, Initialization } from '../store/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import { initialize, setInitialized } from '../store/initialization/actions';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import config from '../config.json';
import { remote}  from 'electron';
    
interface MappedProps {
  initialization: Initialization;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    initialization: state.initialization
  };
};

interface Dispatchers {
  initialize: () => void;
  setInitialized: (isInitialized: boolean) => void;
}

const mapDispatchToProps: Dispatchers = {
  initialize,
  setInitialized
};

type UpdateViewProps = MappedProps & Dispatchers;

interface CommandInfo {
  text: string;
  result: boolean | undefined;
}

class InitializationView extends PureComponent<UpdateViewProps> {
  constructor(props: Readonly<UpdateViewProps>) {
    super(props);
  }

  componentDidMount() {
    this.props.initialize();
  }

  render() {
    const { isNuGetCommandAvailable, isDotNetCommandAvailable, 
      isNpmCommandAvailable, isGitCommandAvailable, isInitialized } = this.props.initialization;
      
    const info: CommandInfo[] = [
      { text: getCommandStatusText('NuGet', isNuGetCommandAvailable), result: isNuGetCommandAvailable },
      { text: getCommandStatusText('DotNet', isDotNetCommandAvailable), result: isDotNetCommandAvailable },
      { text: getCommandStatusText('npm', isNpmCommandAvailable), result: isNpmCommandAvailable },
      { text: getCommandStatusText('git', isGitCommandAvailable), result: isGitCommandAvailable }
    ];

    const errorText = getErrorText();

    return (
      <ViewContainer>
        <ErrorRow text={errorText} isVisible={isInitialized === false} />
        <ProgressBar isVisible={isInitialized === undefined} />
        {info.map((item, index) => (
          <CheckRow
            key={index}
            isChecked={item.result}
            isBlinking={item.result === undefined}
            isInvalid={item.result === false}
            text={`${item.text}${item.result === undefined ? '...' : ''}`}
          />)
        )}
        <div className="row row-initialization-buttons" style={{ display: isInitialized !== false ? 'none' : undefined }}>
          <button
            className="waves-effect waves-light btn blue darken-1"
            onClick={() => this.relaunchApp()}>
            <i className="material-icons left">refresh</i>
            Re-check
          </button>
          <button
            className="waves-effect waves-light btn orange"
            onClick={() => this.props.setInitialized(true)}>
            <i className="material-icons left">warning</i>
            Continue anyway
          </button>
        </div>
      </ViewContainer>
    );
  }

  private relaunchApp() {
    const app = remote.app;
    
    app.relaunch();
    app.exit(0);
  }
}

function getCommandStatusText(commandName: string, checkResult: boolean | undefined): string {
  const action = checkResult === undefined ? 'being checked' : 'available';
  return `The ${commandName} command is${checkResult === false ? ' not' : ''} ${action}`;
}

function getErrorText() {
  const link = <a href={config.links.requirements} target="_blank">requirements section</a>;

  return <span>One or more of the required commands are not available. Please visit the {link}</span>;
}


export default connect(mapStateToProps, mapDispatchToProps)(InitializationView);
