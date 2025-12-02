import type { Handle } from '@sveltejs/kit';
import { APP_BASE, DASHBOARD_BASE } from '$lib/server/config';

const domainsWithAccessToAPI = [APP_BASE, DASHBOARD_BASE, 'https://checkout.stripe.com'];
const publicEndpoints = ['/', '/checkout/success'];

const appendHeaders = (response: Response, origin: string | null) => {
	response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', '*');
	if (origin && domainsWithAccessToAPI.includes(origin)) {
		response.headers.append('Access-Control-Allow-Origin', origin);
	}
	return response;
};

export const handle: Handle = async ({ resolve, event }) => {
	const origin = event.request.headers.get('origin');

	if (publicEndpoints.includes(event.url.pathname)) {
		const response = await resolve(event);
		appendHeaders(response, origin);
		return response;
	}

	if (!origin || !domainsWithAccessToAPI.includes(origin)) {
		console.error(`Unauthorized access attempt from origin: ${origin}`);
		return new Response('Unauthorised', { status: 401 });
	}

	const response = await resolve(event);
	appendHeaders(response, origin);
	return response;
};
