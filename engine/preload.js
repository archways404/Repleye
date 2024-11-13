window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text;
	};

	for (const dependency of ['chrome', 'node', 'electron']) {
		replaceText(`${dependency}-version`, process.versions[dependency]);
	}
});

const { contextBridge } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
	// Add any Electron-specific functions here if needed
});
