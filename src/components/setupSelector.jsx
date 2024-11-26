import React from 'react';

function SetupSelector({ onPageSelect }) {
	return (
		<div className="flex flex-col items-center justify-center backdrop-blur-lg bg-white/10 p-6 rounded-xl shadow-lg max-w-xs mx-auto">
			<h1 className="text-2xl font-semibold text-white mb-4">Setup</h1>
			<div className="flex flex-col space-y-4 w-full">
				<button
					onClick={() => onPageSelect('manual')}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all">
					Manual
				</button>
				<button
					onClick={() => onPageSelect('standard')}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all">
					Standard
				</button>
				<button
					onClick={() => onPageSelect('existing')}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all">
					Existing
				</button>
			</div>
		</div>
	);
}

export default SetupSelector;
