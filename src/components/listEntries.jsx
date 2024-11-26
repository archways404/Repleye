import React, { useState, useEffect } from 'react';

function ListEntries() {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

	useEffect(() => {
		// Fetch the entries from the config file
		window.electron
			.readConfig()
			.then((config) => {
				if (config && config.entries) {
					setEntries(Object.entries(config.entries)); // Get entries as [key, value] pairs
				} else {
					setError('No entries found in the config file.');
				}
			})
			.catch(() => setError('Failed to load config file.'));
	}, []);

	useEffect(() => {
		// Handle key presses
		const handleKeyPress = (event) => {
			const { key } = event;

			if (!selectedEntry) {
				// Handle entry selection (1-based index)
				const index = parseInt(key, 10) - 1;
				if (index >= 0 && index < entries.length) {
					setSelectedEntry(entries[index]);
					setMessage(
						`Selected ${entries[index][0]}. Press "S" for Swedish or "E" for English.`
					);
				}
			} else {
				// Handle actions for the selected entry
				if (key === 's' || key === 'e') {
					const content =
						key === 's'
							? selectedEntry[1]['contents-swe']
							: selectedEntry[1]['contents-eng'];

					if (content) {
						// Write HTML content to the clipboard
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
								// Hide the window after 1 second
								setTimeout(() => {
									window.electron.hideWindow();
								}, 1000);
							});
					} else {
						setMessage('No content available for this selection.');
					}
					// Reset selection
					setSelectedEntry(null);
				}
			}

			// Hide the window if Escape is pressed
			if (key === 'Escape') {
				window.electron.hideWindow();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [entries, selectedEntry]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<h2>Entries</h2>
			<ul>
				{entries.map(([entryName], index) => (
					<li
						key={entryName}
						style={{
							padding: '8px',
							cursor: 'pointer',
							backgroundColor:
								selectedEntry && selectedEntry[0] === entryName
									? '#f0c674'
									: 'transparent',
							fontWeight:
								selectedEntry && selectedEntry[0] === entryName
									? 'bold'
									: 'normal',
						}}>
						{index + 1}. {entryName}
					</li>
				))}
			</ul>
			{message && <p>{message}</p>}
		</div>
	);
}

export default ListEntries;
