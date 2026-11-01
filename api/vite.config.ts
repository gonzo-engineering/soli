import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { API_LOCAL_PORT } from '@soli/shared/config';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter(),
			csrf: {
				trustedOrigins: [
					'https://soli.network',
					'https://dashboard.soli.network',
					'https://checkout.stripe.com'
				]
			}
		})
	],
	server: { port: API_LOCAL_PORT }
});
