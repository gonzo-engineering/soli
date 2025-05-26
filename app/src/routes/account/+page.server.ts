import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TABLES } from '$lib/global/config';
import type { ArtistRaw } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals: { safeGetSession, supabase } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const {
		data: userData,
		error: userError
	}: {
		data: { artist_id: string }[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.artistMembers).select('artist_id').eq('user_id', session.user.id);

	if (userError || !userData) {
		console.error('Error fetching user data:', userError);
		return fail(500, { error: 'Failed to fetch user data' });
	}

	const artistProfiles: ArtistRaw[] = await fetch('/api/artists')
		.then((res) => res.json())
		.then((data: ArtistRaw[]) => {
			return data.filter((artist) => userData.some((user) => user.artist_id === artist.id));
		})
		.catch((error) => {
			console.error('Error fetching artists:', error);
			return [];
		});

	return { session, artistProfiles };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName') as string;
		const payPerStream = formData.get('payPerStream') as string;

		const { session } = await safeGetSession();

		const { error } = await supabase.from(TABLES.users).upsert({
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
