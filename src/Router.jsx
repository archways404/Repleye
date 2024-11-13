import { useState, useEffect } from 'react';
import Setup from './components/setup';
import CreateEntry from './components/createEntry'; // Import your CreateEntry component

function Router() {
	const [configStatus, setConfigStatus] = useState(null);
	const [configData, setConfigData] = useState(null);
	const [activeComponent, setActiveComponent] = useState('home'); // State for active component

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

	// Render the active component
	const renderComponent = () => {
		switch (activeComponent) {
			case 'home':
				return (
					<div>
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
								{configData.entries && (
									<div>
										<h2>Entries:</h2>
										<ul>
											{Object.entries(configData.entries).map(
												([entryTitle, entryContent], index) => (
													<li
														key={index}
														style={{
															marginBottom: '20px',
															borderBottom: '1px solid #ddd',
															paddingBottom: '10px',
														}}>
														<h3>{entryTitle}</h3>
														<div style={{ marginBottom: '10px' }}>
															<strong>Swedish:</strong>
															<div
																style={{
																	border: '1px solid #ccc',
																	padding: '10px',
																	marginTop: '5px',
																	backgroundColor: '#f9f9f9',
																	whiteSpace: 'pre-wrap',
																}}
																dangerouslySetInnerHTML={{
																	__html: entryContent['contents-swe'],
																}}></div>
															<button
																onClick={async () => {
																	try {
																		// Use Clipboard API with HTML type
																		await navigator.clipboard.write([
																			new ClipboardItem({
																				'text/html': new Blob(
																					[entryContent['contents-swe']],
																					{ type: 'text/html' }
																				),
																			}),
																		]);
																		alert(
																			'Swedish content copied to clipboard!'
																		);
																	} catch (err) {
																		console.error('Failed to copy:', err);
																		alert('Failed to copy Swedish content.');
																	}
																}}
																style={{
																	marginTop: '5px',
																	padding: '5px 10px',
																	backgroundColor: '#007BFF',
																	color: 'white',
																	border: 'none',
																	cursor: 'pointer',
																}}>
																Copy Swedish
															</button>
														</div>
														<div>
															<strong>English:</strong>
															<div
																style={{
																	border: '1px solid #ccc',
																	padding: '10px',
																	marginTop: '5px',
																	backgroundColor: '#f9f9f9',
																	whiteSpace: 'pre-wrap',
																}}
																dangerouslySetInnerHTML={{
																	__html: entryContent['contents-eng'],
																}}></div>
															<button
																onClick={async () => {
																	try {
																		// Use Clipboard API with HTML type
																		await navigator.clipboard.write([
																			new ClipboardItem({
																				'text/html': new Blob(
																					[entryContent['contents-eng']],
																					{ type: 'text/html' }
																				),
																			}),
																		]);
																		alert(
																			'English content copied to clipboard!'
																		);
																	} catch (err) {
																		console.error('Failed to copy:', err);
																		alert('Failed to copy English content.');
																	}
																}}
																style={{
																	marginTop: '5px',
																	padding: '5px 10px',
																	backgroundColor: '#007BFF',
																	color: 'white',
																	border: 'none',
																	cursor: 'pointer',
																}}>
																Copy English
															</button>
														</div>
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				);
			case 'createEntry':
				return <CreateEntry onComplete={fetchConfig} />;
			default:
				return <div>Page not found</div>;
		}
	};

	return (
		<div className="bg-green-400">
			<div>
				{/* Buttons to switch components */}
				<button onClick={() => setActiveComponent('home')}>Home</button>
				<button onClick={() => setActiveComponent('createEntry')}>
					Create Entry
				</button>
			</div>
			{/* Render the active component */}
			{renderComponent()}
		</div>
	);
}

export default Router;
