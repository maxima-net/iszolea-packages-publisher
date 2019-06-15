import React from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, Initialization } from '../store/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';

interface UpdateViewProps {
  initialization: Initialization;
}

const mapStateToProps: MapStateToPropsParam<UpdateViewProps, any, AppState> = (state) => {
  return {
    initialization: state.initialization
  };
};

interface CommandInfo {
  command: string;
  result: boolean | undefined;
}

function InitializationView(props: UpdateViewProps) {
  const info: CommandInfo[] = [
    { command: 'Is NuGet command available', result: props.initialization.isNuGetCommandAvailable },
    { command: 'Is DotNet command available', result: props.initialization.isDotNetCommandAvailable },
    { command: 'Is npm command available', result: props.initialization.isNpmCommandAvailable },
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
          text={`${item.command}${item.result === undefined ? '...' : ''}`}
        />)
      )}
    </div>
  );
}

export default connect(mapStateToProps)(InitializationView);
