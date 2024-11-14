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

	// Load your Vite React app
	const viteURL = 'http://localhost:5173'; // Change this to your Vite dev server or production build URL
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

ipcMain.on('save-config', (event, data) => {
	try {
		saveConfig(data);
		event.reply('save-config-response', true);

		// Send updated config status after saving
		mainWindow.webContents.send('config-status', checkConfigFile());
	} catch (error) {
		console.error(`Failed to save config: ${error.message}`);
		event.reply('save-config-response', false);
	}
});

ipcMain.on('get-config', (event) => {
	try {
		if (fs.existsSync(configPath)) {
			const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			event.reply('get-config-response', { success: true, data: configData });
		} else {
			event.reply('get-config-response', {
				success: false,
				error: 'Config file does not exist.',
			});
		}
	} catch (error) {
		event.reply('get-config-response', {
			success: false,
			error: error.message,
		});
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