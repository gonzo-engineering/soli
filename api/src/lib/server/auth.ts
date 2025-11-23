import { supabase } from './supabase';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Verifies the Authorization header contains a valid Supabase JWT token
 * and returns the authenticated user ID.
 *
 * Returns null if token is invalid or missing.
 */
export async function getAuthenticatedUserId(event: RequestEvent): Promise<string | null> {
	const authHeader = event.request.headers.get('authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return null;
	}

	const token = authHeader.slice(7);

	try {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser(token);

		if (error || !user?.id) {
			return null;
		}

		return user.id;
	} catch {
		return null;
	}
}

/**
 * Middleware to require authentication on an endpoint.
 * Returns a 401 response if authentication fails.
 * Otherwise returns the authenticated user ID.
 */
export async function requireAuth(event: RequestEvent): Promise<string | { response: Response }> {
	const userId = await getAuthenticatedUserId(event);

	if (!userId) {
		return {
			response: json({ error: 'Unauthorized' }, { status: 401 })
		};
	}

	return userId;
}

/**
 * Middleware to require a specific user ID matches the authenticated user.
 * Useful for preventing users from accessing/modifying other users' data.
 *
 * @param event - SvelteKit RequestEvent
 * @param requiredUserId - The user ID that is required
 * @returns userId if authorized, or { response } with 403 if forbidden
 */
export async function requireUserMatch(
	event: RequestEvent,
	requiredUserId: string
): Promise<string | { response: Response }> {
	const authResult = await requireAuth(event);

	// If it's a response object, it's an error (401 Unauthorized)
	if (typeof authResult === 'object' && 'response' in authResult) {
		return authResult;
	}

	// authResult is the userId
	if (authResult !== requiredUserId) {
		return {
			response: json({ error: 'Forbidden' }, { status: 403 })
		};
	}

	return authResult;
}
