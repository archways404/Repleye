import React, { useState, useEffect } from 'react';

function ManualConfig({ onPageSelect }) {
	const [configPath, setConfigPath] = useState('');
	const [statusMessage, setStatusMessage] = useState('');

	useEffect(() => {
		// Ensure the config file only when the page is accessed
		window.electron.ensureConfigFile().then((result) => {
			if (result.success) {
				setConfigPath(result.path);
			} else {
				setStatusMessage(result.message);
			}
		});
	}, []);

	return (
		<div>
			<h1>Configuration</h1>
			{statusMessage ? (
				<p>{statusMessage}</p>
			) : (
				<>
					<p>Config file is located at:</p>
					<pre>{configPath}</pre>
				</>
			)}
			<button onClick={() => onPageSelect('home')}>Home</button>
		</div>
	);
}

export default ManualConfig;
