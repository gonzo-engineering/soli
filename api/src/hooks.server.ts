import { dev } from '$app/environment';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { APP_DOMAIN, DASHBOARD_DOMAIN } from '../../shared/config';

const domainsWithAccessToAPI = [APP_DOMAIN, DASHBOARD_DOMAIN, 'https://checkout.stripe.com'];

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const origin = request.headers.get('origin');

	if ((origin === null || !domainsWithAccessToAPI.includes(origin)) && !dev) {
		return new Response('Unauthorized', { status: 401 });
	}
	return fetch(request);
};

export const handle: Handle = async ({ resolve, event }) => {
	const origin = event.request.headers.get('origin');

	if ((origin === null || !domainsWithAccessToAPI.includes(origin)) && !dev) {
		return new Response('Unauthorized', { status: 401 });
	}

	if (!origin) {
		return new Response('Unauthorized', { status: 401 });
	}

	const response = await resolve(event);
	response.headers.append('Access-Control-Allow-Origin', origin);
	return response;
};
