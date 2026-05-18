import { dev } from '$app/environment';
import {
	API_DOMAIN,
	API_LOCAL_PORT,
	APP_DOMAIN,
	APP_LOCAL_PORT,
	DASHBOARD_DOMAIN,
	DASHBOARD_LOCAL_PORT
} from '../../../shared/config';

export const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const API_BASE = dev ? `http://localhost:${API_LOCAL_PORT}` : API_DOMAIN;
export const APP_BASE = dev ? `http://localhost:${APP_LOCAL_PORT}` : APP_DOMAIN;
export const DASHBOARD_BASE = dev ? `http://localhost:${DASHBOARD_LOCAL_PORT}` : DASHBOARD_DOMAIN;

export const REQUEST_HEADER_BOILERPLATE = {
	'Content-Type': 'application/json',
	origin: DASHBOARD_BASE
};
