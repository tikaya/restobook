const { app, BrowserWindow } = require('electron');
const { spawn }              = require('child_process');
const path                   = require('path');

let mainWindow;
let serverProcess;

// Lancer le serveur Express en arrière-plan
function startServer() {
    serverProcess = spawn('node', ['server.js'], {
        cwd:   __dirname,
        stdio: 'inherit'
    });

    serverProcess.on('error', (err) => {
        console.error('Erreur serveur Express :', err);
    });
}

// Attendre que le serveur soit pret
function waitForServer(url, retries = 20) {
    return new Promise((resolve, reject) => {
        const http = require('http');
        var attempt = 0;

        var check = function() {
            http.get(url, function(res) {
                resolve();
            }).on('error', function() {
                attempt++;
                if (attempt >= retries) {
                    reject(new Error('Serveur Express non disponible'));
                } else {
                    setTimeout(check, 500);
                }
            });
        };

        check();
    });
}

// Creer la fenetre principale
function createWindow() {
    mainWindow = new BrowserWindow({
        width:  1280,
        height: 860,
        minWidth:  900,
        minHeight: 600,
        title: 'RestoBook Manager',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Charger l'app Express
    mainWindow.loadURL('http://localhost:3000');

    // Masquer le menu natif
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

// Cycle de vie Electron
app.whenReady().then(function() {
    startServer();

    // Attendre que Express soit pret puis ouvrir la fenetre
    waitForServer('http://localhost:3000')
        .then(function() {
            createWindow();
        })
        .catch(function(err) {
            console.error(err);
            app.quit();
        });
});

app.on('window-all-closed', function() {
    // Tuer le serveur Express quand on ferme la fenetre
    if (serverProcess) {
        serverProcess.kill();
    }
    app.quit();
});

app.on('activate', function() {
    if (mainWindow === null) createWindow();
});