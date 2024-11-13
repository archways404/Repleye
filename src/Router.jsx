import { useState, useEffect } from 'react';

function Router() {
	const [configExists, setConfigExists] = useState(null);
	const [filePath, setFilePath] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		window.electron.getConfigStatus((_, exists) => setConfigExists(exists));
	}, []);

	const handleFilePathSubmit = async () => {
		if (!filePath) {
			setMessage('Please select a valid folder.');
			return;
		}

		const success = await window.electron.createConfig(filePath);
		if (success) {
			setConfigExists(true);
			setMessage('Config file created successfully!');
		} else {
			setMessage('Failed to create config file. Please try again.');
		}
	};

	const handleBrowseFiles = async () => {
		const selectedPath = await window.electron.openFileDialog();
		if (selectedPath) {
			setFilePath(selectedPath);
			setMessage(`Selected path: ${selectedPath}/repleye-config.json`);
		}
	};

	if (configExists === null) {
		return <div>Loading...</div>;
	}

	return (
		<>
			{!configExists ? (
				<div className="bg-blue-400">
					<h1>Setup Config</h1>
					<p>Specify a location to create your config file:</p>
					<div>
						<button onClick={handleBrowseFiles}>Browse</button>
						{filePath && <p>Selected Folder: {filePath}</p>}
					</div>
					<button onClick={handleFilePathSubmit}>Create Config</button>
					{message && <p>{message}</p>}
				</div>
			) : (
				<div className="bg-green-400">
					<h1>Vite + React</h1>
					<p>Your app is ready to use!</p>
				</div>
			)}
		</>
	);
}

export default Router;
