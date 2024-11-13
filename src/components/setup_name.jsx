import { useState } from 'react';

function SetupName({ onSetupComplete }) {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [simplifiedName, setSimplifiedName] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = async () => {
		if (!firstName || !lastName || !simplifiedName) {
			setMessage('All fields are required!');
			return;
		}

		// Save the config (you can send it to the main process if needed)
		try {
			const success = await window.electron.createConfig({
				first_name: firstName,
				last_name: lastName,
				simplified_name: simplifiedName,
			});
			if (success) {
				onSetupComplete();
			} else {
				setMessage('Failed to save the config. Try again.');
			}
		} catch (error) {
			setMessage('An error occurred. Try again.');
		}
	};

	return (
		<div className="setup-name">
			<h1>Setup Your Name</h1>
			<div>
				<label>First Name:</label>
				<input
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
			</div>
			<div>
				<label>Last Name:</label>
				<input
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
			</div>
			<div>
				<label>Simplified Name:</label>
				<input
					type="text"
					value={simplifiedName}
					onChange={(e) => setSimplifiedName(e.target.value)}
				/>
			</div>
			<button onClick={handleSubmit}>Save</button>
			{message && <p>{message}</p>}
		</div>
	);
}

export default SetupName;
