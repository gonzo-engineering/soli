import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { API_LOCAL_PORT } from '@soli/shared/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: API_LOCAL_PORT
	}
});
