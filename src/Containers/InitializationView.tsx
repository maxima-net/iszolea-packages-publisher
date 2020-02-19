import React, { useEffect } from 'react';
import './InitializationView.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, Initialization } from '../store/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import { initialize, setInitialized } from '../store/initialization/actions';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import config from '../config.json';
import { remote}  from 'electron';
import Button from '../Components/Button';
import Header from '../Components/Header';
    
interface CommandInfo {
  text: string;
  result: boolean | undefined;
}

const InitializationView: React.FC = () => {
  const relaunchApp = () => {
    const app = remote.app;
    
    app.relaunch();
    app.exit(0);
  };

  const getCommandStatusText = (commandName: string, checkResult: boolean | undefined): string => {
    const action = checkResult === undefined ? 'being checked' : 'available';
    return `The ${commandName} command is${checkResult === false ? ' not' : ''} ${action}`;
  };
  
  const getErrorText = () => {
    const link = <a href={config.links.requirements} target="_blank" rel="noopener noreferrer">requirements section</a>;
    return <span>One or more of the required commands are not available. Please visit the {link}</span>;
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialize());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialization = useSelector<AppState, Initialization>((state) => state.initialization);
  const { isNuGetCommandAvailable, isDotNetCommandAvailable, 
    isNpmCommandAvailable, isGitCommandAvailable, isInitialized } = initialization;
    
  const info: CommandInfo[] = [
    { text: getCommandStatusText('NuGet', isNuGetCommandAvailable), result: isNuGetCommandAvailable },
    { text: getCommandStatusText('DotNet', isDotNetCommandAvailable), result: isDotNetCommandAvailable },
    { text: getCommandStatusText('npm', isNpmCommandAvailable), result: isNpmCommandAvailable },
    { text: getCommandStatusText('git', isGitCommandAvailable), result: isGitCommandAvailable }
  ];

  const errorText = getErrorText();

  return (
    <>
      <Header title="Initialization" />
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
          <Button text="Re-check" onClick={relaunchApp} icon="refresh" color="blue" />
          <Button text="Continue anyway" onClick={() => dispatch(setInitialized(true))} icon="warning" color="deep-orange" />
        </div>
      </ViewContainer>
    </>
  );
};

export default InitializationView;
