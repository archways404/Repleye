const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false, // Start hidden
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
