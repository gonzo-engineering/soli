// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TABLES } from '$lib/global/config';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	// if the user is already logged in return them to the account page
	if (session) {
		redirect(303, '/account');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	default: async (event) => {
		const {
			// url,
			request,
			locals: { supabase }
		} = event;
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const validEmail = /^[\w-.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, { errors: { email: 'Please enter a valid email address' }, email });
		}

		const { error: betaUserError } = await supabase
			.from(TABLES.betaUsers)
			.select('email')
			.eq('email', email)
			.single();

		if (betaUserError) {
			return fail(400, {
				success: false,
				email,
				message: 'Your email is not on the beta list.'
			});
		}

		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: `There was an issue, Please contact support.`
			});
		}

		return {
			success: true,
			message: 'Please check your email for a magic link to log into the website.'
		};
	}
};
