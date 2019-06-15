import React from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, Initialization } from '../store/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import { checkRequirements, setInitialized } from '../store/initialization/actions';
import './InitializationView.scss';

interface MappedProps {
  initialization: Initialization;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    initialization: state.initialization
  };
};

interface Dispatchers {
  checkRequirements: () => void;
  setInitialized: (isInitialized: boolean) => void;
}

const mapDispatchToProps: Dispatchers = {
  checkRequirements,
  setInitialized
};

type UpdateViewProps = MappedProps & Dispatchers;

interface CommandInfo {
  text: string;
  result: boolean | undefined;
}

function InitializationView(props: UpdateViewProps) {
  const info: CommandInfo[] = [
    { text: 'Is NuGet command available', result: props.initialization.isNuGetCommandAvailable },
    { text: 'Is DotNet command available', result: props.initialization.isDotNetCommandAvailable },
    { text: 'Is npm command available', result: props.initialization.isNpmCommandAvailable },
  ]
  return (
    <div className="view-container">
      <h4>Initialization</h4>
      <ProgressBar isVisible={props.initialization.isInitialized === undefined} />
      {info.map((item, index) => (
        <CheckRow
          key={index}
          isChecked={item.result}
          isBlinking={item.result === undefined}
          isInvalid={item.result === false}
          text={`${item.text}${item.result === undefined ? '...' : ''}`}
        />)
      )}
      <div className="row row-buttons" style={{ display: props.initialization.isInitialized !== false? 'none' : undefined }}>
        <button
          className="waves-effect waves-light btn blue darken-1"
          onClick={props.checkRequirements}>
          <i className="material-icons left">refresh</i>
          Re-check
        </button>
        <button
          className="waves-effect waves-light btn orange"
          onClick={() => props.setInitialized(true)}>
          <i className="material-icons left">warning</i>
          Continue anyway
        </button>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InitializationView);
