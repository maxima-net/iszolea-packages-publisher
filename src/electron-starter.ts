import { BrowserWindow, app, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import url from 'url';
import { SignalKeys } from './signal-keys';
import logger from 'electron-log';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 610,
    minWidth: 800,
    minHeight: 610,
    autoHideMenuBar: true,
    title: `Iszolea Packages Publisher v${app.getVersion()}`
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.logger = logger;
(autoUpdater.logger as any).transports.file.level = 'info';
autoUpdater.fullChangelog = true;

app.on('ready', () => {
  // Install only once
  // const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS];
  // for (const extension of extensions) {
  //   installExtension(extension)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));
  // }

  createWindow();

  ipcMain.on('check-for-updates', () => {
    autoUpdater.on('update-available', (...args: any) => {
      if (mainWindow) {
        mainWindow.webContents.send(SignalKeys.UpdateIsAvailable, ...args);
      }
    });

    autoUpdater.on('download-progress', (...args: any) => {
      if (mainWindow) {
        mainWindow.webContents.send(SignalKeys.UpdateIsDownloading, ...args);
      }
    });

    autoUpdater.on('update-downloaded', (...args: any[]) => {
      if (mainWindow) {
        mainWindow.webContents.send(SignalKeys.UpdateIsDownloaded, ...args);
      }
    });

    autoUpdater.on('update-not-available', (...args: any[]) => {
      if (mainWindow) {
        mainWindow.webContents.send(SignalKeys.UpdateIsNotAvailable, ...args);
      }
    });

    autoUpdater.on('error', (...args: any[]) => {
      if (mainWindow) {
        mainWindow.webContents.send(SignalKeys.UpdateError, ...args);
      }
    });

    autoUpdater.checkForUpdates();
  });

  ipcMain.on('install-update', () => {
    const isSilent = false;
    const isForceRunAfter = true;
    logger.info('quit and install update');
    autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
  });
});

