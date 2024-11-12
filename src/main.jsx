import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './Global.css';
import Router from './Router.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Router />
	</StrictMode>
);
