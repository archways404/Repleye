import { useState } from 'react';

function Setup({ onComplete }) {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [message, setMessage] = useState('');

	// Utility function to capitalize the first letter of a string
	const capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	const handleSubmit = async () => {
		if (!firstName || !lastName) {
			setMessage('All fields are required.');
			return;
		}

		// Format firstName and lastName
		const formattedFirstName = capitalize(firstName);
		const formattedLastName = capitalize(lastName);

		const simplifiedName = `${formattedFirstName} ${formattedLastName[0]}`;

		// Save the config
		const success = await window.electron.saveConfig({
			first_name: formattedFirstName,
			last_name: formattedLastName,
			simplified_name: simplifiedName,
		});

		if (success) {
			// Notify parent component that setup is complete
			onComplete();
		} else {
			setMessage('Failed to save config. Please try again.');
		}
	};

	return (
		<div className="bg-blue-400">
			<h1>Setup</h1>
			<p>Please enter your details to complete the setup:</p>
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
			<button onClick={handleSubmit}>Save</button>
			{message && <p>{message}</p>}
		</div>
	);
}

export default Setup;
