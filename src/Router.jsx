import { useState, useEffect } from 'react';
import SetupSelector from './components/setupSelector';
import ManualConfig from './components/manualConfig';
import ExistingConfig from './components/existingConfig';
import ListEntries from './components/listEntries';

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

	useEffect(() => {
		window.electron.send('resize-window', {
			width: document.documentElement.scrollWidth,
			height: document.documentElement.scrollHeight,
		});
	}, [activeComponent]);

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
						<h1 className="text-center text-white text-2xl mb-4">Welcome</h1>
						<ListEntries />
					</div>
				);
			default:
				return <div>Loading...</div>;
		}
	};

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-gray-900/65 via-gray-700/55 to-gray-900/65">
			{/* Frosted glass effect container */}
			<div className="flex justify-center items-center w-screen h-screen backdrop-blur-3xl bg-white/20 border border-white/50 rounded-xl drop-shadow-lg">
				{/* Render your component inside */}
				<div className="p-8">{renderComponent()}</div>
			</div>
		</div>
	);

}

export default Router;
