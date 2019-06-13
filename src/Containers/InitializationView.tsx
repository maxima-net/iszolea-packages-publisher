import React from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, Initialization } from '../store/types';

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
    { command: 'Is initialized', result: props.initialization.isInitialized }
  ]
  return (
    <div className="view-container">
      <h4>Initialization</h4>
      {info.map((item, index) => (
        <div>
          <span key={index}>{item.command}: {item.result === undefined ? 'Checking...' : item.result ? 'Yes' : 'No'}</span>
        </div>
      ))}
    </div>
  );
}

export default connect(mapStateToProps)(InitializationView);
