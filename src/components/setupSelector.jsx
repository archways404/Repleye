import React from 'react';

function SetupSelector({ onPageSelect }) {
	return (
		<div>
			<p>Setup</p>
			<button onClick={() => onPageSelect('manual')}>Manual</button>
			<button onClick={() => onPageSelect('standard')}>Standard</button>
			<button onClick={() => onPageSelect('existing')}>Existing</button>
		</div>
	);
}

export default SetupSelector;
