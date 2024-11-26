import React, { useState, useEffect } from 'react';

function ListEntries() {
	const [entries, setEntries] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch the entries from the config file
		window.electron
			.readConfig()
			.then((config) => {
				if (config && config.entries) {
					setEntries(Object.keys(config.entries));
				} else {
					setError('No entries found in the config file.');
				}
			})
			.catch((err) => setError('Failed to load config file.'));
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<h2>Entries</h2>
			<ul>
				{entries.map((entryName) => (
					<li key={entryName}>{entryName}</li>
				))}
			</ul>
		</div>
	);
}

export default ListEntries;
