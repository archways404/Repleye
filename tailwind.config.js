/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'glass-bg': 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for frosted glass
			},
		},
	},
	plugins: [],
};
