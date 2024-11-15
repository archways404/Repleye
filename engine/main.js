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

	ipcMain.handle('ensure-config-file', () => {
		try {
			const configPath = ensureConfigFile();
			return { success: true, path: configPath };
		} catch (error) {
			console.error('Error ensuring config file:', error);
			return { success: false, message: 'Failed to ensure config file.' };
		}
	});

	ipcMain.handle('check-config-exists', () => {
		try {
			const configPath = path.join(
				process.cwd(),
				'config',
				'repleye-config.json'
			);
			return fs.existsSync(configPath);
		} catch (error) {
			console.error('Error checking config file existence:', error);
			return false; // Assume the config file doesn't exist if there's an error
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

// Function to ensure config file exists
function ensureConfigFile() {
	const mDrivePath = 'M:/repleye-config.json';
	const localConfigDir = path.join(process.cwd(), 'config'); // Use current working directory
	const localConfigPath = path.join(localConfigDir, 'repleye-config.json');

	try {
		// Check if M:/ exists and is accessible
		if (process.platform === 'win32' && fs.existsSync('M:/')) {
			// Check if file exists in M:/ and create if necessary
			if (!fs.existsSync(mDrivePath)) {
				fs.writeFileSync(mDrivePath, JSON.stringify({}), 'utf-8');
			}
			return mDrivePath;
		} else {
			// Use current working directory if M:/ is unavailable
			// Ensure local config directory exists
			if (!fs.existsSync(localConfigDir)) {
				fs.mkdirSync(localConfigDir, { recursive: true });
			}

			// Create config file if it doesn't exist
			if (!fs.existsSync(localConfigPath)) {
				fs.writeFileSync(localConfigPath, JSON.stringify({}), 'utf-8');
			}
			return localConfigPath;
		}
	} catch (error) {
		console.error('Error ensuring config file:', error);
		throw new Error('Failed to create or locate the configuration file.');
	}
}
/* PRODUCTION
// Function to ensure config file exists
function ensureConfigFile() {
	const mDrivePath = 'M:/repleye-config.json';
	const localConfigDir = path.join(app.getPath('userData'), 'config');
	const localConfigPath = path.join(localConfigDir, 'repleye-config.json');

	try {
		// Check if M:/ exists and is accessible
		if (process.platform === 'win32' && fs.existsSync('M:/')) {
			// Check if file exists in M:/ and create if necessary
			if (!fs.existsSync(mDrivePath)) {
				fs.writeFileSync(mDrivePath, JSON.stringify({}), 'utf-8');
			}
			return mDrivePath;
		} else {
			// Use local directory if M:/ is unavailable
			// Ensure local config directory exists
			if (!fs.existsSync(localConfigDir)) {
				fs.mkdirSync(localConfigDir, { recursive: true });
			}

			// Create config file if it doesn't exist
			if (!fs.existsSync(localConfigPath)) {
				fs.writeFileSync(localConfigPath, JSON.stringify({}), 'utf-8');
			}
			return localConfigPath;
		}
	} catch (error) {
		console.error('Error ensuring config file:', error);
		throw new Error('Failed to create or locate the configuration file.');
	}
}
*/