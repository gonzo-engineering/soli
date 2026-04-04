import { form, getRequestEvent, query } from '$app/server';
import * as z from 'zod';
import { TABLES } from '../../../../shared/config';
import { redirect } from '@sveltejs/kit';

export const sendCode = form(z.object({ email: z.email() }), async ({ email }) => {
	const { locals } = getRequestEvent();
	const supabase = locals.supabase;

	const { error: betaUserError } = await supabase
		.from(TABLES.betaUsers)
		.select('email')
		.eq('email', email)
		.single();

	if (betaUserError) {
		return {
			success: false,
			message: 'Email is not on the beta list.',
			email
		};
	}

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: 'https://soli.network'
		}
	});

	if (error) {
		return {
			success: false,
			message: `There was an issue: ${error.message}`,
			email
		};
	}

	return {
		success: true,
		message: `Login details were sent to ${email}`,
		email
	};
});

export const verifyCode = form(
	z.object({ email: z.email(), code: z.string() }),
	async ({ email, code }) => {
		const { locals } = getRequestEvent();
		const supabase = locals.supabase;

		const { error } = await supabase.auth.verifyOtp({
			email,
			token: code,
			type: 'email'
		});

		if (error) {
			return {
				success: false,
				email,
				message: 'Invalid or expired code'
			};
		}
		throw redirect(303, '/me');
	}
);

export const signOut = query(async () => {
	const { locals } = getRequestEvent();
	if (locals.session) {
		await locals.supabase.auth.signOut();
	}
});
