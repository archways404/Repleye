import { useState, useRef } from 'react';

function CreateEntry({ onComplete }) {
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const contentsSweRef = useRef(null);
	const contentsEngRef = useRef(null);

	const handleSaveEntry = async () => {
		// Get the innerHTML of the contentEditable divs
		const contentsSwe = contentsSweRef.current.innerHTML;
		const contentsEng = contentsEngRef.current.innerHTML;

		if (!title || !contentsSwe || !contentsEng) {
			setMessage('All fields are required.');
			return;
		}

		try {
			// Fetch the current config
			const configResponse = await window.electron.getConfig();
			if (!configResponse.success) {
				setMessage('Failed to fetch config file.');
				return;
			}

			const configData = configResponse.data;

			// Add or update the entries
			if (!configData.entries) {
				configData.entries = {};
			}

			// Add the new entry
			configData.entries[title] = {
				'contents-swe': contentsSwe,
				'contents-eng': contentsEng,
			};

			// Save the updated config
			const saveSuccess = await window.electron.saveConfig(configData);
			if (saveSuccess) {
				setMessage('Entry saved successfully!');
				// Reset fields
				setTitle('');
				contentsSweRef.current.innerHTML = '';
				contentsEngRef.current.innerHTML = '';
				// Notify parent component (if applicable)
				onComplete();
			} else {
				setMessage('Failed to save entry. Please try again.');
			}
		} catch (error) {
			console.error('Error saving entry:', error);
			setMessage('An error occurred. Please try again.');
		}
	};

	return (
		<div className="bg-blue-400">
			<h1>Create Entry</h1>
			<p>Add a new entry with the details below:</p>
			<div>
				<label>Title:</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter title"
				/>
			</div>
			<div>
				<label>Swedish Contents:</label>
				<div
					ref={contentsSweRef}
					contentEditable
					style={{
						border: '1px solid #ccc',
						padding: '10px',
						minHeight: '100px',
						marginBottom: '20px',
					}}
					placeholder="Enter Swedish contents"></div>
			</div>
			<div>
				<label>English Contents:</label>
				<div
					ref={contentsEngRef}
					contentEditable
					style={{
						border: '1px solid #ccc',
						padding: '10px',
						minHeight: '100px',
						marginBottom: '20px',
					}}
					placeholder="Enter English contents"></div>
			</div>
			<button onClick={handleSaveEntry}>Save Entry</button>
			{message && <p>{message}</p>}
		</div>
	);
}

export default CreateEntry;
