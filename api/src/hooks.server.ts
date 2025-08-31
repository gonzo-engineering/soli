import { dev } from '$app/environment';
import type { HandleFetch } from '@sveltejs/kit';
import { APP_DOMAIN } from '../../shared/config';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	const origin = request.headers.get('origin');

	const allowedDomains = [APP_DOMAIN, 'https://checkout.stripe.com'];

	if ((origin === null || !allowedDomains.includes(origin)) && !dev) {
		return new Response('Unauthorized', { status: 401 });
	}
	return fetch(request);
};
