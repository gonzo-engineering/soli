import { TABLES } from '../../../../../../shared/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { Label } from '../../../../../../shared/types/core';

export async function GET({ params }) {
	const userId = params.slug;

	const { data: relatedLabelData, error } = await supabase
		.from(TABLES.labelMembers)
		.select('label_id')
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching user labels:', error);
		return json({ error: 'Failed to fetch user labels' }, { status: 500 });
	}

	const {
		data: connectedLabels,
		error: labelError
	}: {
		data: Label[] | null;
		error: Error | null;
	} = await supabase
		.from(TABLES.labels)
		.select('*')
		.in(
			'id',
			relatedLabelData.map((u) => u.label_id)
		);
	if (labelError) {
		console.error('Error fetching connected labels:', labelError);
		return json({ error: 'Failed to fetch connected labels' }, { status: 500 });
	}
	return json(connectedLabels);
}
