import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PINATA_JWT: { static: true },
	PUBLIC_GATEWAY_URL: { public: true, static: true },
	STRIPE_SECRET_KEY: { static: true },
	SUPABASE_URL: { static: true },
	SUPABASE_SERVICE_ROLE_KEY: { static: true }
});
