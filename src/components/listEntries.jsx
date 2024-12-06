import React, { useState, useEffect, useCallback } from 'react';

function ListEntries() {
	const [entries, setEntries] = useState([]);
	const [selectedEntry, setSelectedEntry] = useState(null);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState('');
	const [resetTimeout, setResetTimeout] = useState(null); // Track timeout for reset
	const [buttonHighlight, setButtonHighlight] = useState(null); // Tracks highlighted button ("s" or "e")

	// Fetch entries on mount
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

	// Stabilize handleKeyPress function
	const handleKeyPress = useCallback(
		(event) => {
			const { key } = event;

			// Clear timeout if the user presses any key
			if (resetTimeout) {
				clearTimeout(resetTimeout);
				setResetTimeout(null);
			}

			if (key === 'Escape') {
				if (!selectedEntry) {
					// Hide window when Escape key is pressed
					window.electron.hideWindow();
				} else {
					setSelectedEntry(null);
				}
				return;
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
					handleCopy(key);
				} else {
					resetSelection();
				}
			}
		},
		[entries, selectedEntry, resetTimeout] // Dependencies
	);

	// Select entry
	const selectEntry = (index) => {
		setSelectedEntry(entries[index]);
		setMessage(
			`Selected ${entries[index][0]}. Press "S" for Swedish or "E" for English.`
		);
		setButtonHighlight(null); // Reset button highlight
		clearTimeout(resetTimeout);
		setResetTimeout(
			setTimeout(() => {
				resetSelection();
			}, 5000)
		);
	};

	// Copy content based on selected language
	const handleCopy = (lang) => {
		if (selectedEntry) {
			const content =
				lang === 's'
					? selectedEntry[1]['contents-swe']
					: selectedEntry[1]['contents-eng'];
			if (content) {
				navigator.clipboard
					.writeText(content)
					.then(() => {
						setButtonHighlight(lang); // Highlight the pressed button
						setMessage(
							`Copied ${lang === 's' ? 'Swedish' : 'English'} content for ${
								selectedEntry[0]
							}.`
						);
					})
					.catch(() => setMessage('Failed to copy content.'));
			} else {
				setMessage('No content available.');
			}
			setResetTimeout(
				setTimeout(() => {
					resetSelection();
				}, 2000)
			);
		}
	};

	// Reset selection
	const resetSelection = () => {
		setSelectedEntry(null);
		setButtonHighlight(null);
		setMessage('');
		clearTimeout(resetTimeout);
	};

	// Add keydown event listener on mount
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-col h-screen">
			{/* Main Content */}
			<div className="p-8 flex-grow overflow-y-auto">
				<h2 className="text-2xl text-gray-100 font-bold mb-6 text-center">
					Available Entries
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
					{entries.map(([entryName, value], index) => (
						<div
							key={entryName}
							className="flex flex-col items-center justify-between w-52 h-26 bg-white/10 rounded-xl shadow-md hover:bg-white/20 transition-all duration-200 p-2">
							{/* Number or S/E Buttons Section */}
							<div className="flex items-center justify-center mb-4">
								{selectedEntry && selectedEntry[0] === entryName ? (
									<div className="flex space-x-3">
										<button
											onClick={() => handleCopy('s')}
											className={`w-10 h-10 border-2 border-gray-700 text-gray-700 font-bold rounded-lg transition-all ${
												buttonHighlight === 's'
													? 'bg-green-500 text-white border-none'
													: 'hover:bg-gray-700 hover:text-white'
											}`}>
											S
										</button>
										<button
											onClick={() => handleCopy('e')}
											className={`w-10 h-10 border-2 border-gray-700 text-gray-700 font-bold rounded-lg transition-all ${
												buttonHighlight === 'e'
													? 'bg-green-500 text-white border-none'
													: 'hover:bg-gray-700 hover:text-white'
											}`}>
											E
										</button>
									</div>
								) : (
									<div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white bg-gray-700">
										{index < 9
											? `${index + 1}`
											: String.fromCharCode('A'.charCodeAt(0) + index - 9)}
									</div>
								)}
							</div>
							{/* Entry Name Section */}
							<div
								className="text-gray-300 text-center overflow-hidden leading-tight"
								style={{
									fontSize: 'clamp(14px, 1vw, 18px)',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									width: '100%',
								}}>
								{entryName}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Footer */}
			<footer className="text-gray-400 text-center py-2 w-full">
				<p className="text-sm">
					&copy; {new Date().getFullYear()} Software404. All rights reserved.
				</p>
			</footer>
		</div>
	);
}

export default ListEntries;
