const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');

function createWindow () {
    const win = new BrowserWindow({
        width: 768,
        height: 560
    });

    win.loadFile('src/index.html');

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

const db = new sqlite3.Database('./diet.db', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});