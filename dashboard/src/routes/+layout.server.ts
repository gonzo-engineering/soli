import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import type { StreamLog } from '../../../shared/types/core';
import { sortReleasesByDate } from '../../../shared/utils';
import type { LayoutServerLoad } from './$types';
import type { Track } from '../../../shared/types/core';
import type { ArtistHydrated, ReleaseHydrated } from '../../../shared/types/hydrated';
import { TABLES } from '../../../shared/config';
import { API_BASE, REQUEST_HEADER_BOILERPLATE } from '$lib/config';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session, user } = await safeGetSession();

	if (!session || !user) {
		return {
			session,
			user,
			cookies: cookies.getAll(),
			artists: [],
			releases: [],
			songs: [],
			streams: []
		};
	}

	const userID = session.user.id;

	const connectedArtists: ArtistHydrated[] = await fetch(`${API_BASE}/users/${userID}/artists`, {
		method: 'GET',
		headers: REQUEST_HEADER_BOILERPLATE
	}).then((res) => res.json());

	const {
		data: songs,
		error: songsError
	}: {
		data: Track[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.tracks).select('*');

	const {
		data: releases,
		error: releasesError
	}: {
		data: ReleaseHydrated[] | null; // Adjust type as needed
		error: Error | null;
	} = await supabase.from(TABLES.releasesRich).select('*');

	if (songsError || !songs) {
		console.error('Error fetching songs:', songsError);
		return fail(500, { error: 'Failed to fetch songs' });
	}
	if (releasesError || !releases) {
		console.error('Error fetching releases:', releasesError);
		return fail(500, { error: 'Failed to fetch releases' });
	}

	songs.sort((a, b) => {
		if (a.title < b.title) return -1;
		if (a.title > b.title) return 1;
		return 0;
	});

	connectedArtists.sort((a, b) => {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});

	// Get all streams for the artist
	const {
		data: streams,
		error: streamsError
	}: {
		data: StreamLog[] | null;
		error: Error | null;
	} = await supabase.from(TABLES.streams).select('*');
	if (streamsError || !streams) {
		console.error('Error fetching streams:', streamsError);
		return fail(500, { error: 'Failed to fetch streams' });
	}

	return {
		session,
		user,
		cookies: cookies.getAll(),
		artists: connectedArtists,
		releases: sortReleasesByDate(releases),
		songs,
		streams
	};
};
