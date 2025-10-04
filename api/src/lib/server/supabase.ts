import { createClient, PostgrestError } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type PostgrestResponse<T> = {
	data: T | null;
	error: PostgrestError | null;
};

export const handlePostgrestQuery = async <T>(
	queryFunction: () => Promise<PostgrestResponse<T>>,
	{
		errorMessage = 'Request failed',
		transform
	}: {
		errorMessage?: string;
		transform?: (data: T) => T;
	} = {}
) => {
	try {
		const { data, error } = await queryFunction();

		if (error || !data) {
			console.error(errorMessage, error);
			return json({ error: errorMessage }, { status: 500 });
		}
		return json(transform ? transform(data) : data);
	} catch (err) {
		console.error(errorMessage, err);
		return json({ error: errorMessage }, { status: 500 });
	}
};
