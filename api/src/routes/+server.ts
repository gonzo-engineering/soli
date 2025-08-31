import { json } from '@sveltejs/kit';

export async function GET() {
	const apiVersion = '1.0.0';
	return json({ version: apiVersion });
}
