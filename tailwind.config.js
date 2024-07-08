import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  theme: {
		colors: {
			light: {
				primary: '#E1F7F5',
				secondary: '#6A899C',
			},
			dark: {
				primary: '#222831',
				secondary: '#83B4FF',
			}
		},
    extend: {},
  },
	plugins: [flowbitePlugin]
}

