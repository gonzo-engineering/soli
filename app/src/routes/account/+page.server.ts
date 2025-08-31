import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { API_BASE } from '$lib/global/config';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	return { session };
};

export const actions: Actions = {
	update: async ({ request, fetch, locals: { safeGetSession } }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const payPerStream = formData.get('payPerStream') as string;

		const { session } = await safeGetSession();

		const { error } = await fetch(`${API_BASE}/users/${session?.user.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				updateProfileInfo: {
					first_name: firstName,
					pay_per_stream: parseInt(payPerStream)
				}
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());

		if (error) {
			return fail(500, {
				firstName,
				payPerStream
			});
		}

		return {
			firstName,
			payPerStream
		};
	},
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	}
};
