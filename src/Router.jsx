import { useState, useEffect } from 'react';
import Setup from './components/setup';

function Router() {
	const [configStatus, setConfigStatus] = useState(null);
	const [configData, setConfigData] = useState(null);

	// Function to fetch config status and data
	const fetchConfig = async () => {
		// Get config status
		const response = await new Promise((resolve) => {
			window.electron.getConfigStatus((_, status) => resolve(status));
		});

		setConfigStatus(response);

		// If the config is valid, fetch the config data
		if (response.exists && response.valid) {
			try {
				const configResponse = await window.electron.getConfig();
				if (configResponse.success) {
					setConfigData(configResponse.data);
				} else {
					console.error('Error fetching config:', configResponse.error);
				}
			} catch (error) {
				console.error('Error fetching config:', error.message);
			}
		}
	};

	// Fetch config on component mount
	useEffect(() => {
		fetchConfig();
	}, []);

	if (configStatus === null) {
		return <div>Loading...</div>;
	}

	if (!configStatus.exists || !configStatus.valid) {
		// Pass the fetchConfig function as the onComplete callback
		return <Setup onComplete={fetchConfig} />;
	}

	return (
		<div className="bg-green-400">
			<h1>Welcome</h1>
			<p>Your app is ready to use!</p>
			{configData && (
				<div>
					<h2>Config Contents:</h2>
					<ul>
						<li>First Name: {configData.first_name}</li>
						<li>Last Name: {configData.last_name}</li>
						<li>Simplified Name: {configData.simplified_name}</li>
					</ul>
				</div>
			)}
		</div>
	);
}

export default Router;
