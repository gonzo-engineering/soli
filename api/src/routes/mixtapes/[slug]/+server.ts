import { supabase } from "$lib/server/supabase";
import { json } from "@sveltejs/kit";
import { TABLES } from "../../../../../shared/config";

export async function PATCH({ request, params }) {
    const mixtapeId = params.slug;
    const { trackId } = await request.json();

    if (!trackId) {
        return json({ error: 'Missing track ID' }, { status: 400 });
    }

    const { error } = await supabase
        .from(TABLES.mixtapeTracks)
        .insert({ mixtape_id: mixtapeId, track_id: trackId });

    if (error) {
        return json({ error: 'Failed to add track to mixtape' }, { status: 500 });
    }

    return json({ success: true });
}