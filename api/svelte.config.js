import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins: [
				'https://soli.network',
				'https://dashboard.soli.network',
				'https://checkout.stripe.com'
			]
		}
	}
};

export default config;
