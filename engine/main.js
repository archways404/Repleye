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
let configPath;

app.whenReady().then(() => {
	// Ensure config file
	const configPath = ensureConfigFile();
	console.log(`Configuration file is located at: ${configPath}`);

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

	const sendConfigStatus = () => {
		const configStatus = checkConfigFile();
		mainWindow.webContents.send('config-status', configStatus);
	};

	mainWindow.webContents.once('did-finish-load', sendConfigStatus);

	// NOTE THIS IS ONLY FOR DEVELOPMENT
	const viteURL = 'http://localhost:5173';

	// NOTE USE BELOW FOR PRODUCTION
	// const viteURL = mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
	mainWindow.loadURL(viteURL);

	// Register a cross-platform global shortcut
	const shortcut =
		process.platform === 'darwin' ? 'Command+Shift+R' : 'Control+Space';
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

	ipcMain.handle('get-config-path', () => configPath);

	// Provide dialog handler for selecting and copying a config file
	ipcMain.handle('select-config-file', async () => {
		const result = await dialog.showOpenDialog(mainWindow, {
			properties: ['openFile'],
			filters: [{ name: 'JSON Files', extensions: ['json'] }],
		});

		if (result.canceled || result.filePaths.length === 0) {
			return { success: false, message: 'No file selected.' };
		}

		const selectedPath = result.filePaths[0];
		const destDir = path.join(process.cwd(), 'config');
		const destPath = path.join(destDir, 'repleye-config.json');

		try {
			// Ensure the destination directory exists
			if (!fs.existsSync(destDir)) {
				fs.mkdirSync(destDir, { recursive: true });
			}

			// Copy the selected file
			fs.copyFileSync(selectedPath, destPath);

			return { success: true, message: `File copied to ${destPath}` };
		} catch (error) {
			console.error('Error copying config file:', error);
			return { success: false, message: 'Failed to copy file.' };
		}
	});
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

const checkConfigFile = () => {
	if (process.platform === 'win32') {
		configPath = path.join('M:\\', 'repleye-config.json');
	} else {
		configPath = path.join(process.cwd(), 'config', 'repleye-config.json');
	}

	// Check if the file exists
	if (!fs.existsSync(configPath)) {
		console.log(`Config file not found at: ${configPath}`);
		return { exists: false, valid: false };
	}

	// Validate the contents of the config file
	try {
		const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const requiredKeys = ['first_name', 'last_name', 'simplified_name'];

		// Check if all required keys exist
		const isValid = requiredKeys.every((key) => key in configData);

		return { exists: true, valid: isValid };
	} catch (error) {
		console.error(`Error reading or parsing config: ${error.message}`);
		return { exists: true, valid: false };
	}
};

// Write to the config file
const saveConfig = (data) => {
	if (process.platform === 'win32') {
		configPath = path.join('M:\\', 'repleye-config.json');
	} else {
		configPath = path.join(process.cwd(), 'config', 'repleye-config.json');
	}

	// Ensure directory exists (for non-Windows)
	if (!fs.existsSync(path.dirname(configPath))) {
		fs.mkdirSync(path.dirname(configPath), { recursive: true });
	}

	fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
	console.log(`Config saved at: ${configPath}`);
	return true;
};
