import React from 'react';

function SetupSelector({ onPageSelect }) {
	return (
		<div className="p-8">
			<h1 className="text-2xl text-gray-100 font-bold mb-6 text-center">
				Setup
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
				<button
					onClick={() => onPageSelect('manual')}
					className="w-full border-2 border-green-500 text-green-500 font-semibold rounded-lg py-3 transition-all hover:bg-green-500 hover:text-white">
					Manual
				</button>
				<button
					onClick={() => onPageSelect('existing')}
					className="w-full border-2 border-green-500 text-green-500 font-semibold rounded-lg py-3 transition-all hover:bg-green-500 hover:text-white">
					Existing
				</button>
				<button
					onClick={() => onPageSelect('standard')}
					className="w-full border-2 border-blue-500 text-blue-500 font-semibold rounded-lg py-3 transition-all hover:bg-blue-500 hover:text-white">
					Standard
				</button>
			</div>
		</div>
	);
}

export default SetupSelector;
