import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { APP_DOMAIN, DASHBOARD_DOMAIN } from '../../shared/config';

const domainsWithAccessToAPI = [APP_DOMAIN, DASHBOARD_DOMAIN, 'https://checkout.stripe.com'];
const publicEndpoints = ['/', '/checkout/success'];

const appendHeaders = (response: Response, origin: string | null) => {
	response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', '*');
	response.headers.append('Access-Control-Allow-Origin', origin ? origin : '*');
	return response;
};

export const handle: Handle = async ({ resolve, event }) => {
	const origin = event.request.headers.get('origin');

	if (publicEndpoints.includes(event.url.pathname)) {
		const response = await resolve(event);
		appendHeaders(response, origin);
		return response;
	}

	if ((origin === null || !domainsWithAccessToAPI.includes(origin)) && !dev) {
		console.error(`Unauthorized access attempt from origin: ${origin}`);
		return new Response('Unauthorised', { status: 401 });
	}

	const response = await resolve(event);
	appendHeaders(response, origin);
	return response;
};
