import React, { PureComponent } from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, Initialization } from '../store/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import { initialize, setInitialized } from '../store/initialization/actions';
import './InitializationView.scss';
import ErrorRow from '../Components/ErrorRow';

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

  async componentDidMount() {
    await this.props.initialize();
  }

  render() {
    const { isNuGetCommandAvailable, isDotNetCommandAvailable, isNpmCommandAvailable, isInitialized } = this.props.initialization;
    const info: CommandInfo[] = [
      { text: getCommandStatusText('NuGet', isNuGetCommandAvailable), result: isNuGetCommandAvailable },
      { text: getCommandStatusText('DotNet', isDotNetCommandAvailable), result: isDotNetCommandAvailable },
      { text: getCommandStatusText('npm', isNpmCommandAvailable), result: isNpmCommandAvailable }
    ];

    const errorText = getErrorText();

    return (
      <div className="view-container">
        <h4>Initialization</h4>
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
            onClick={this.props.initialize}>
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
      </div>
    );
  }
}

function getCommandStatusText(commandName: string, checkResult: boolean | undefined): string {
  const action = checkResult === undefined ? 'being checked' : 'available'; 
  return `The ${commandName} command is${checkResult === false ? ' not' : ''} ${action}`;
}

function getErrorText() {
  const href = 'https://github.com/maxima-net/iszolea-packages-publisher#requirements';
  const link = <a href={href} target='_blank'>requirements section</a>;

  return ['One or more of the required commands are not available. Please visit the ', link];
}


export default connect(mapStateToProps, mapDispatchToProps)(InitializationView);
