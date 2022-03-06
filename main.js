const electron = require('electron');
const path = require('path');
const url = require('url');

process.env.NODE_ENV = 'development';

const { app, BrowserWindow, Menu, ipcMain } = electron;

const isMac = process.platform === 'darwin';

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  mainWindow.on('closed', () => {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: 'Add new task',
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  addWindow.on('close', () => (addWindow = null));
}

ipcMain.on('item:add', (e, item) => {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

const mainMenuTemplate = [
  {
    label: 'Add Item',
    click() {
      createAddWindow();
    },
  },
  {
    label: 'Clear Items',
    click() {
      mainWindow.webContents.send('item:clear');
    },
  },
  {
    label: 'Quit',
    accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    },
  },
];

if (isMac) mainMenuTemplate.unshift({});

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Reload',
        role: 'reload',
      },
      {
        label: 'Toggle DevTools',
        accelerator: isMac ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
