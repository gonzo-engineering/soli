import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { APP_LOCAL_PORT } from '../shared/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: APP_LOCAL_PORT
	}
});
