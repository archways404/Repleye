import { useState, useEffect } from 'react';
import SetupSelector from './components/setupSelector';
import ManualConfig from './components/manualConfig';
import ExistingConfig from './components/existingConfig';

function Router() {
	const [activeComponent, setActiveComponent] = useState('setup');
	// Render the active component
	const renderComponent = () => {
		switch (activeComponent) {
			case 'setup':
				return <SetupSelector onPageSelect={setActiveComponent} />;
			case 'manual':
				return <ManualConfig onPageSelect={setActiveComponent} />;
			case 'standard':
				return;
			case 'existing':
				return <ExistingConfig onPageSelect={setActiveComponent} />;
			case 'home':
				return (
					<div>
						<h1>Welcome</h1>
					</div>
				);
			default:
				return <div>Page not found</div>;
		}
	};

	return (
		<div className="bg-red-400">
			<div>
				{/* Buttons to switch components */}
				<button onClick={() => setActiveComponent('home')}>Home</button>
			</div>
			{/* Render the active component */}
			{renderComponent()}
		</div>
	);
}

export default Router;
