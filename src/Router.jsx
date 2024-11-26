import { useState, useEffect } from 'react';
import SetupSelector from './components/setupSelector';
import ManualConfig from './components/manualConfig';
import ExistingConfig from './components/existingConfig';
import ListEntries from './components/listEntries'; // Import ListEntries

function Router() {
	const [activeComponent, setActiveComponent] = useState(null);

	useEffect(() => {
		window.electron.checkConfigExists().then((exists) => {
			if (exists) {
				setActiveComponent('home');
			} else {
				setActiveComponent('setup');
			}
		});
	}, []);

	const renderComponent = () => {
		switch (activeComponent) {
			case 'setup':
				return <SetupSelector onPageSelect={setActiveComponent} />;
			case 'manual':
				return <ManualConfig onPageSelect={setActiveComponent} />;
			case 'standard':
				return null;
			case 'existing':
				return <ExistingConfig onPageSelect={setActiveComponent} />;
			case 'home':
				return (
					<div>
						<h1>Welcome</h1>
						{/* Render ListEntries */}
						<ListEntries />
					</div>
				);
			default:
				return <div>Loading...</div>;
		}
	};

	return (
		<div className="bg-red-400">
			<div>
				<button
					onClick={() => setActiveComponent('home')}
					className="bg-orange-500">
					Home
				</button>
				{renderComponent()}
			</div>
		</div>
	);
}

export default Router;
