import { TABLES } from '@soli/shared/config';
import { supabase } from '$lib/server/supabase';
import { json } from '@sveltejs/kit';
import type { LabelHydrated } from '@soli/shared/types';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
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
		data: LabelHydrated[] | null;
		error: Error | null;
	} = await supabase
		.from(TABLES.labelsRich)
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
};
