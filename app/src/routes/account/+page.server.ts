import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TABLES } from '$lib/global/config';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	return { session };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const payPerStream = formData.get('payPerStream') as string;

		const { session } = await safeGetSession();

		const { error } = await supabase.from(TABLES.listeners).upsert({
			id: session?.user.id,
			first_name: firstName,
			updated_at: new Date(),
			pay_per_stream: parseInt(payPerStream)
		});

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
