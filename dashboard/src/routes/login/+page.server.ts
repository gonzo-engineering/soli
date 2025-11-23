import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TABLES } from '../../../../shared/config';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		redirect(303, '/');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	sendCode: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const validEmail = /^[\w-.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);

		if (!validEmail) {
			return fail(400, {
				errors: { email: 'Please enter a valid email address' },
				email
			});
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

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: 'https://dashboard.soli.network'
			}
		});

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: `There was an issue. ${error.message}.`
			});
		}

		return {
			success: true,
			message: `A 6-digit code was sent to ${email}`,
			email
		};
	},
	verifyCode: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const code = formData.get('code') as string;

		if (!email || !code) {
			return fail(400, {
				errors: { email: 'Please enter a valid email and code' },
				email
			});
		}

		const { error } = await supabase.auth.verifyOtp({
			email,
			token: code,
			type: 'email'
		});

		if (error) {
			return fail(400, {
				success: false,
				email,
				message: 'Invalid or expired code'
			});
		}

		throw redirect(303, '/');
	}
};
