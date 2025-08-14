import {
  createBrowserClient,
  createServerClient,
  isBrowser,
} from "@supabase/ssr";
import type { LayoutLoad } from "./$types";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$lib/config";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies ?? null;
          },
        },
      });

  return {
    supabase,
    session: data.session ?? null,
    user: data.user,
    artists: data.artists,
    releasesRaw: data.releasesRaw,
    releasesHydrated: data.releasesHydrated,
    songs: data.songs,
    streams: data.streams,
  };
};
