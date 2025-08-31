import { dev } from '$app/environment';
import { API_DOMAIN, API_LOCAL_PORT } from '../../../../shared/config';

export const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const PUBLIC_PATH_ROOTS = ['/login', '/auth', '/about', '/contact', '/privacy', '/terms'];

export const API_BASE = dev ? `http://localhost:${API_LOCAL_PORT}` : API_DOMAIN;
