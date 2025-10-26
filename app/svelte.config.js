import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess, mdsvex({ extensions: ['.md'] })],

	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		}
	},
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
