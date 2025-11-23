export const cookieOptions = {
	name: `sb-soli.network-auth-token`,
	domain: 'soli.network',
	path: '/',
	maxAge: 60 * 60 * 24 * 365, // 1 year
	sameSite: 'lax' as const
};
