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
	getConfigStatus: (callback) => ipcRenderer.on('config-status', callback),
	saveConfig: (data) =>
		new Promise((resolve) => {
			ipcRenderer.once('save-config-response', (event, success) =>
				resolve(success)
			);
			ipcRenderer.send('save-config', data);
		}),
	getConfig: () =>
		new Promise((resolve) => {
			ipcRenderer.once('get-config-response', (event, response) =>
				resolve(response)
			);
			ipcRenderer.send('get-config');
		}),
	openFileDialog: () =>
		new Promise((resolve) => {
			ipcRenderer.once('file-dialog-path', (event, filePath) =>
				resolve(filePath)
			);
			ipcRenderer.send('open-file-dialog');
		}),
});
