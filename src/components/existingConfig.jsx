import React, { useState } from 'react';

function ExistingConfig({ onPageSelect }) {
	const [statusMessage, setStatusMessage] = useState('');

	const handleFileSelect = async () => {
		const result = await window.electron.selectConfigFile();
		if (result.success) {
			onPageSelect('home');
		} else {
			setStatusMessage(result.message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center p-8 space-y-6">
			<h1 className="text-3xl font-bold text-gray-100">
				Existing Configuration
			</h1>
			<p className="text-gray-300 text-center">
				Select an existing{' '}
				<code className="text-gray-100">repleye-config.json</code> file to use:
			</p>
			<div className="w-full space-y-4">
				{statusMessage && (
					<p
						className={`text-gray-300 rounded-lg p-4 shadow-md ${
							statusMessage.includes('success')
								? 'bg-green-500/20'
								: 'bg-red-500/20'
						}`}>
						{statusMessage}
					</p>
				)}
				<button
					onClick={handleFileSelect}
					className="w-full border-2 border-blue-500 text-blue-500 font-semibold py-3 rounded-lg transition-all hover:bg-blue-500 hover:text-white">
					Select File
				</button>
			</div>
			<button
				onClick={() => onPageSelect('setup')}
				className="w-full border-2 border-green-500 text-green-500 font-semibold py-3 rounded-lg transition-all hover:bg-green-500 hover:text-white">
				Back
			</button>
		</div>
	);
}

export default ExistingConfig;
