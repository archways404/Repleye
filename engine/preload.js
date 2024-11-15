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
	ensureConfigFile: () => ipcRenderer.invoke('ensure-config-file'),
	selectConfigFile: () => ipcRenderer.invoke('select-config-file'),
	getConfigPath: () => ipcRenderer.invoke('get-config-path'),
});
