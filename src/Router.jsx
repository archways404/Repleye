import { useState } from 'react';

function Router() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div className="bg-blue-400">
				<h1>Vite + React</h1>
				<div className="card">
					<button onClick={() => setCount((count) => count + 1)}>
						count is {count}
					</button>
					<p>
						Edit <code>src/App.jsx</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">
					Click on the Vite and React logos to learn more
				</p>
			</div>
		</>
	);
}

export default Router;
