import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { DASHBOARD_LOCAL_PORT } from '@soli/shared/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: DASHBOARD_LOCAL_PORT
	}
});
