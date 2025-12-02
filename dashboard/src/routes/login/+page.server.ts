import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/');
	}

	return { url: url.origin };
};
