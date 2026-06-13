import { dev } from '$app/environment';
import {
	APP_DOMAIN,
	APP_LOCAL_PORT,
	DASHBOARD_DOMAIN,
	DASHBOARD_LOCAL_PORT
} from '@soli/shared/config';

export const APP_BASE = dev ? `http://localhost:${APP_LOCAL_PORT}` : APP_DOMAIN;
export const DASHBOARD_BASE = dev ? `http://localhost:${DASHBOARD_LOCAL_PORT}` : DASHBOARD_DOMAIN;
