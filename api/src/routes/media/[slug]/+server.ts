import { supabase } from '$lib/server/supabase';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { data, error } = await supabase.storage
		.from('tracks')
		.createSignedUrl(`${params.slug}.mp3`, 30); // URL valid for 30 seconds

	if (error) {
		console.error('Supabase signed URL generation failed:', error);
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
	return text(data.signedUrl);
};
