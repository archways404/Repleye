window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text;
	};

	for (const dependency of ['chrome', 'node', 'electron']) {
		replaceText(`${dependency}-version`, process.versions[dependency]);
	}
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	checkConfigExists: () => ipcRenderer.invoke('check-config-exists'),
	ensureConfigFile: () => ipcRenderer.invoke('ensure-config-file'),
	selectConfigFile: () => ipcRenderer.invoke('select-config-file'),
	getConfigPath: () => ipcRenderer.invoke('get-config-path'),
	openFileInEditor: (filePath) =>
		ipcRenderer.invoke('open-file-in-editor', filePath),
	readConfig: () => ipcRenderer.invoke('read-config'), // Delegate to main process
	hideWindow: () => ipcRenderer.send('hide-window'), // Expose method to hide the window
	send: (channel, data) => ipcRenderer.send(channel, data),
});