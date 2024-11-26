import React from 'react';

function SetupSelector({ onPageSelect }) {
	return (
		<div>
			<p>Setup</p>
			<button
				onClick={() => onPageSelect('manual')}
				className="bg-blue-500">
				Manual
			</button>
			<button
				onClick={() => onPageSelect('standard')}
				className="bg-blue-500">
				Standard
			</button>
			<button
				onClick={() => onPageSelect('existing')}
				className="bg-blue-500">
				Existing
			</button>
		</div>
	);
}

export default SetupSelector;
