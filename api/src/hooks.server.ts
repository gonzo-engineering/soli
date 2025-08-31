import { dev } from '$app/environment';
import type { HandleFetch } from '@sveltejs/kit';
import { APP_DOMAIN, DASHBOARD_DOMAIN } from '../../shared/config';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const origin = request.headers.get('origin');

	const domainsWithAccessToAPI = [APP_DOMAIN, DASHBOARD_DOMAIN, 'https://checkout.stripe.com'];

	if ((origin === null || !domainsWithAccessToAPI.includes(origin)) && !dev) {
		return new Response('Unauthorized', { status: 401 });
	}
	return fetch(request);
};
