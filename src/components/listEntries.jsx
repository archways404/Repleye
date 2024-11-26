import React, { useState, useEffect } from 'react';

function ListEntries() {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');
	const [resetTimeout, setResetTimeout] = useState(null); // Track timeout for reset

	useEffect(() => {
		window.electron
			.readConfig()
			.then((config) => {
				if (config && config.entries) {
					setEntries(Object.entries(config.entries));
				} else {
					setError('No entries found in the config file.');
				}
			})
			.catch(() => setError('Failed to load config file.'));
	}, []);

	useEffect(() => {
		const handleKeyPress = (event) => {
			const { key } = event;

			// Clear timeout if the user presses any key
			if (resetTimeout) {
				clearTimeout(resetTimeout);
				setResetTimeout(null);
			}

			if (!selectedEntry) {
				// Handle numeric (1-9) and alphabetic (A-Z) keys for entry selection
				if (/^\d$/.test(key)) {
					const index = parseInt(key, 10) - 1;
					if (index >= 0 && index < entries.length) {
						selectEntry(index);
					}
				} else if (/^[a-zA-Z]$/.test(key)) {
					const index = key.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 9;
					if (index >= 0 && index < entries.length) {
						selectEntry(index);
					}
				}
			} else {
				// Handle actions for the selected entry
				if (key === 's' || key === 'e') {
					const content =
						key === 's'
							? selectedEntry[1]['contents-swe']
							: selectedEntry[1]['contents-eng'];

					if (content) {
						navigator.clipboard
							.write([
								new ClipboardItem({
									'text/html': new Blob([content], { type: 'text/html' }),
								}),
							])
							.then(() => {
								setMessage(
									`Copied ${key === 's' ? 'Swedish' : 'English'} content for ${
										selectedEntry[0]
									}.`
								);
								setTimeout(() => {
									window.electron.hideWindow();
								}, 1000);
							});
					} else {
						setMessage('No content available for this selection.');
					}
					setSelectedEntry(null); // Reset selection
				} else {
					// Reset selection if no valid action key is pressed
					resetSelection();
				}
			}

			// Hide the window if Escape is pressed
			if (key === 'Escape') {
				window.electron.hideWindow();
			}
		};

		// Helper function to select an entry
		const selectEntry = (index) => {
			setSelectedEntry(entries[index]);
			setMessage(
				`Selected ${entries[index][0]}. Press "S" for Swedish or "E" for English.`
			);
			// Reset to default state if no key is pressed after 5 seconds
			setResetTimeout(
				setTimeout(() => {
					resetSelection();
				}, 5000)
			);
		};

		// Helper function to reset selection
		const resetSelection = () => {
			setSelectedEntry(null);
			setMessage('');
			setResetTimeout(null);
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [entries, selectedEntry, resetTimeout]);

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="p-6">
			<h2 className="text-lg text-white mb-4">Entries</h2>
			<ul className="space-y-2 max-w-fit">
				{entries.map(([entryName], index) => (
					<li
						key={entryName}
						className={`p-2 rounded-lg cursor-pointer ${
							selectedEntry && selectedEntry[0] === entryName
								? 'bg-blue-500 text-white font-bold'
								: 'bg-white/10 hover:bg-white/20'
						}`}>
						{index < 9
							? `${index + 1}`
							: String.fromCharCode('A'.charCodeAt(0) + index - 9)}
						. {entryName}
					</li>
				))}
			</ul>
			{message && <p className="text-white mt-4">{message}</p>}
		</div>
	);
}

export default ListEntries;
