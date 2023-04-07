/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f4fcf6',
					100: '#e8f8ee',
					200: '#c7eed4',
					300: '#a5e3bb',
					400: '#61ce87',
					500: '#1db954',
					600: '#1aa74c',
					700: '#168b3f',
					800: '#116f32',
					900: '#0e5b29',
					DEFAULT: '#1db954'
				},
				dark: {
					50: '#f4f3f3',
					100: '#e8e8e8',
					200: '#c6c4c4',
					300: '#a3a1a1',
					400: '#464242',
					500: '#191414',
					600: '#171212',
					700: '#130f0f',
					800: '#0f0c0c',
					900: '#0c0a0a',
					DEFAULT: '#191414'
				}
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'class'
};
