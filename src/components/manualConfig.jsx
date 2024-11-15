import React, { useState, useEffect } from 'react';

function ManualConfig({ onPageSelect }) {
	const [configPath, setConfigPath] = useState('');

	useEffect(() => {
		// Fetch the config path from the main process
		window.electron.getConfigPath().then((path) => {
			setConfigPath(path);
		});
	}, []);

	return (
		<div>
			<h1>Configuration</h1>
			<p>Config file is located at:</p>
			<pre>{configPath}</pre>
			<button onClick={() => onPageSelect('home')}>Home</button>
		</div>
	);
}

export default ManualConfig;
