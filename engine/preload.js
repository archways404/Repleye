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
	createConfig: (filePath) =>
		new Promise((resolve) => {
			ipcRenderer.once('config-created', (event, success) => resolve(success));
			ipcRenderer.send('create-config', filePath);
		}),
	openFileDialog: () =>
		new Promise((resolve) => {
			ipcRenderer.once('file-dialog-path', (event, filePath) =>
				resolve(filePath)
			);
			ipcRenderer.send('open-file-dialog');
		}),
});
