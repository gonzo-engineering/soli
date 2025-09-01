import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { APP_DOMAIN, DASHBOARD_DOMAIN } from '../../shared/config';

const domainsWithAccessToAPI = [APP_DOMAIN, DASHBOARD_DOMAIN, 'https://checkout.stripe.com'];

export const handle: Handle = async ({ resolve, event }) => {
	const origin = event.request.headers.get('origin');

	if ((origin === null || !domainsWithAccessToAPI.includes(origin)) && !dev) {
		console.error(`Unauthorized access attempt from origin: ${origin}`);
		return new Response(`Domain ${origin} is not allowed to access this API`, { status: 401 });
	}

	const response = await resolve(event);
	response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', '*');
	response.headers.append('Access-Control-Allow-Origin', origin ? origin : '*');
	return response;
};
