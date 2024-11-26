import React, { useState, useEffect } from 'react';

function ListEntries() {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');

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

			if (!selectedEntry) {
				const index = parseInt(key, 10) - 1;
				if (index >= 0 && index < entries.length) {
					setSelectedEntry(entries[index]);
					setMessage(
						`Selected ${entries[index][0]}. Press "S" for Swedish or "E" for English.`
					);
				}
			} else {
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
					setSelectedEntry(null);
				}
			}

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
						{index + 1}. {entryName}
					</li>
				))}
			</ul>
			{message && <p className="text-white mt-4">{message}</p>}
		</div>
	);
}

export default ListEntries;
