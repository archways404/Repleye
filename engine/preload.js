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
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
	checkConfigExists: () => ipcRenderer.invoke('check-config-exists'),
	ensureConfigFile: () => ipcRenderer.invoke('ensure-config-file'),
	selectConfigFile: () => ipcRenderer.invoke('select-config-file'),
	getConfigPath: () => ipcRenderer.invoke('get-config-path'),
	openFileInEditor: (filePath) =>
		ipcRenderer.invoke('open-file-in-editor', filePath),
	readConfig: async () => {
		const configPath = path.join(
			process.cwd(),
			'config',
			'repleye-config.json'
		);
		try {
			const data = fs.readFileSync(configPath, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			console.error('Error reading config file:', error);
			return null;
		}
	},
});

const configPath = path.join(process.cwd(), 'config', 'repleye-config.json');
console.log('Config Path:', configPath);