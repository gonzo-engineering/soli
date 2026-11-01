import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { APP_LOCAL_PORT } from '@soli/shared/config';

export default defineConfig({
	plugins: [
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations
			// for more information about preprocessors
			preprocess: [vitePreprocess, mdsvex({ extensions: ['.md'] })],
			extensions: ['.svelte', '.md'],
			compilerOptions: { experimental: { async: true } },
			adapter: adapter(),
			experimental: { remoteFunctions: true }
		})
	],
	server: { port: APP_LOCAL_PORT }
});
