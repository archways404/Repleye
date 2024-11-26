import React, { useState } from 'react';

function ExistingConfig({ onPageSelect }) {
	const [statusMessage, setStatusMessage] = useState('');

	const handleFileSelect = async () => {
		const result = await window.electron.selectConfigFile();
		if (result.success) {
			setStatusMessage(result.message);
		} else {
			setStatusMessage(result.message);
		}
	};

	return (
		<div>
			<h1>Existing Configuration</h1>
			<p>Select an existing `repleye-config.json` file to use:</p>
			<button
				onClick={handleFileSelect}
				className="bg-blue-500">
				Select File
			</button>
			<p>{statusMessage}</p>
			<button
				onClick={() => onPageSelect('home')}
				className="bg-blue-500">
				Home
			</button>
		</div>
	);
}

export default ExistingConfig;
