import { supabase } from "$lib/server/supabase";
import { json } from "@sveltejs/kit";
import { TABLES } from "../../../../shared/config";

export async function POST({ request }) {
    const { userId, name, description } = await request.json();

    if (!name) {
        console.log('Mixtape name is missing');
        return json({ error: 'Missing mixtape name' }, { status: 400 });
    }

    const { error } = await supabase.from(TABLES.mixtapesHydrated).insert({ user_id: userId, name, description });

    if (error) {
        console.log('Error creating mixtape:', error);
        return json({ error: 'Failed to create mixtape' }, { status: 500 });
    }

    return json({ success: true });
}