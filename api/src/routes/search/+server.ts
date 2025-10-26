import { supabase } from '$lib/server/supabase';
import type { SearchResult } from '../../../../shared/types/core';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q');
	if (!q) {
		return json({ query: '', results: [] });
	}

	const {
		data
	}: {
		data: SearchResult[] | null;
	} = await supabase.rpc('search_all_entities', {
		query: q
	});

	if (!data) {
		return json({ query: q, results: [], error: 'Search failed' }, { status: 500 });
	}

	return json({ query: q, results: data });
};
