import { getRequestEvent } from '$app/server';
import type { User } from '@supabase/supabase-js';

export const requireAuth = () => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		throw new Error('User is not authenticated');
	}

	return locals.user as User;
};
