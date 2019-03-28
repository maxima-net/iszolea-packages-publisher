import { BrowserWindow, app, dialog } from 'electron';
import path from 'path';
import url from 'url';

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
    mainWindow = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

import { autoUpdater } from 'electron-updater'

autoUpdater.logger = require("electron-log");
(autoUpdater.logger as any).transports.file.level = "info";

autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded lats quitAndInstall');
  dialog.showMessageBox({
    type: 'info',
    title: 'New version is available',
    message: 'New version is available, do you want to update it now?',
    buttons: ['Yes', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      const isSilent = true;
      const isForceRunAfter = true;
      autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
    }
  })
})

app.on('ready', async () => {
  console.log('Check for updates');
  autoUpdater.checkForUpdates();
  createWindow();
})
