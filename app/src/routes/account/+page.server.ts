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
		data: connectedArtistsData,
		error: userError
	}: {
		data: { artist_id: string }[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.artistMembers).select('artist_id').eq('user_id', session.user.id);

	if (userError || !connectedArtistsData) {
		console.error('Error fetching user data:', userError);
		return fail(500, { error: 'Failed to fetch user data' });
	}

	const artistProfiles: ArtistRaw[] = await Promise.all(
		connectedArtistsData.map((artist) => {
			return fetch(`/api/artists/${artist.artist_id}`)
				.then((res) => res.json())
				.catch((error) => {
					console.error(`Error fetching artist ${artist.artist_id}:`, error);
					return null;
				});
		})
	);

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
