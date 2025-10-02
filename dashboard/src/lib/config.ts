import { dev } from "$app/environment";
import { API_DOMAIN, API_LOCAL_PORT } from "../../../shared/config";

export const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const POWER_USER_ID = import.meta.env.VITE_POWER_USER_ID;

export const API_BASE = dev ? `http://localhost:${API_LOCAL_PORT}` : API_DOMAIN;
