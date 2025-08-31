import { TABLES } from '$lib/global/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const userId = params.slug;

	const { data, error } = await supabase
		.from(TABLES.followedArtists)
		.select('artist_id')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching user following data:', error);
		return json({ error: 'Failed to fetch user following data' }, { status: 500 });
	}

	return json(data.map((item) => item.artist_id));
}

export async function POST({ params, request }) {
	const userId = params.slug;

	const { artistId } = await request.json();

	if (!artistId) {
		return json({ error: 'Missing artist ID' }, { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.followedArtists)
		.insert({ user_id: userId, artist_id: artistId });

	if (error) {
		console.error('Error following artist:', error);
		return json({ error: 'Failed to follow artist' }, { status: 500 });
	}

	return json({ success: true });
}

export async function DELETE({ params, request }) {
	const userId = params.slug;

	const { artistId } = await request.json();

	if (!artistId) {
		return json({ error: 'Missing artist ID' }, { status: 400 });
	}

	const { error } = await supabase
		.from(TABLES.followedArtists)
		.delete()
		.eq('user_id', userId)
		.eq('artist_id', artistId);

	if (error) {
		console.error('Error unfollowing artist:', error);
		return json({ error: 'Failed to unfollow artist' }, { status: 500 });
	}

	return json({ success: true });
}
