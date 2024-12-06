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

	const handleOpenFile = () => {
		if (configPath) {
			window.electron.openFileInEditor(configPath).then((result) => {
				if (!result.success) {
					setStatusMessage(
						result.message || 'Failed to open file in text editor.'
					);
				}
			});
		}
	};

	return (
		<div className="p-8 space-y-6">
			<h1 className="text-3xl text-center font-bold text-gray-100">
				Configuration
			</h1>
			{statusMessage ? (
				<p className="text-gray-300 bg-red-500/20 rounded-lg p-4 shadow-md">
					{statusMessage}
				</p>
			) : (
				<div className="w-full space-y-4">
					<pre className="text-gray-100 bg-gray-800/40 rounded-lg p-4 text-justify shadow-inner">
						{configPath}
					</pre>
					<button
						onClick={handleOpenFile}
						className="w-full border-2 border-gray-700 text-gray-800 font-semibold py-3 rounded-lg transition-all hover:bg-gray-700 hover:text-white">
						Edit Config File
					</button>
				</div>
			)}
			<button
				onClick={() => onPageSelect('home')}
				className="w-full border-2 border-green-500 text-green-500 font-semibold py-3 rounded-lg transition-all hover:bg-green-500 hover:text-white">
				Continue
			</button>
		</div>
	);
}

export default ManualConfig;
