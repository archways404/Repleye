const {
	app,
	BrowserWindow,
	globalShortcut,
	ipcMain,
	dialog,
} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const checkConfigFile = () => {
	let configPath;

	if (process.platform === 'win32') {
		// For Windows, check the M:\repleye-config.json
		configPath = path.join('M:\\', 'repleye-config.json');
	} else {
		// For other platforms, check current directory + /config/repleye-config.json
		configPath = path.join(process.cwd(), 'config', 'repleye-config.json');
	}

	// Log the path being checked for debugging
	console.log(`Checking config file at: ${configPath}`);

	// Return true if the file exists
	return fs.existsSync(configPath);
};

app.whenReady().then(() => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: true, // Start visible
		center: true,
		alwaysOnTop: true,
		frame: false, // Hides the title bar and window controls
		transparent: true, // Optional: Makes the window background transparent
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	const configExists = checkConfigFile();
	mainWindow.webContents.once('did-finish-load', () => {
		mainWindow.webContents.send('config-status', configExists);
	});

	// Load your Vite React app
	const viteURL = 'http://localhost:5173'; // Change this to your Vite dev server or production build URL
	// const viteURL = mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
	mainWindow.loadURL(viteURL);

	// Register a cross-platform global shortcut
	const shortcut =
		process.platform === 'darwin' ? 'Command+Shift+R' : 'Control+Shift+R';
	globalShortcut.register(shortcut, () => {
		if (mainWindow.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow.show();
		}
	});

	// Show the app on focus
	mainWindow.on('blur', () => {
		mainWindow.hide(); // Optional: Hide when the window loses focus
	});
});

// Handle file dialog
ipcMain.on('open-file-dialog', (event) => {
	dialog
		.showOpenDialog(mainWindow, {
			properties: ['openDirectory'], // Change to ['openFile'] if selecting a file
		})
		.then((result) => {
			if (!result.canceled && result.filePaths.length > 0) {
				event.reply('file-dialog-path', result.filePaths[0]);
			} else {
				event.reply('file-dialog-path', '');
			}
		})
		.catch((err) => {
			console.error(err);
			event.reply('file-dialog-path', '');
		});
});

// Handle file creation
ipcMain.on('create-config', (event, filePath) => {
	try {
		// Ensure a valid file path
		const fullPath = path.join(filePath, 'repleye-config.json');

		// Write the config file
		fs.writeFileSync(fullPath, JSON.stringify({ created: true }, null, 2));
		console.log(`Config created at: ${fullPath}`);
		event.reply('config-created', true);
	} catch (error) {
		console.error(`Failed to create config: ${error.message}`);
		event.reply('config-created', false);
	}
});

// Clean up on app quit
app.on('will-quit', () => {
	globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
