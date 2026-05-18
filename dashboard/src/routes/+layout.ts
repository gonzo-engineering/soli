import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$lib/config';
import { cookieOptions } from '../../../shared/utils/cookies';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookieOptions
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies ?? null;
					}
				},
				cookieOptions
			});

	return {
		supabase,
		session: data.session ?? null,
		user: data.user,
		artists: data.artists,
		labels: data.labels
	};
};
