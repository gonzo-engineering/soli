import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import crypto from 'crypto';

/**
 * Verifies that a webhook request is actually from Stripe using the signature.
 * This prevents replay attacks and spoofed webhook events.
 *
 * @param signature - The `stripe-signature` header value
 * @param body - The raw request body as a string
 * @returns true if signature is valid, false otherwise
 *
 * @throws Error if STRIPE_WEBHOOK_SECRET is not configured
 */
export function verifyStripeWebhookSignature(signature: string, body: string): boolean {
	if (!STRIPE_WEBHOOK_SECRET) {
		throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
	}

	// Stripe signature format: t=timestamp,v1=signature
	const parts = signature.split(',').reduce<{ t: string; v1: string }>(
		(acc, part) => {
			const [key, value] = part.split('=');
			return { ...acc, [key]: value };
		},
		{ t: '', v1: '' }
	);

	if (!parts.t || !parts.v1) {
		return false;
	}

	// Check timestamp is not too old (5 minutes)
	const timestamp = parseInt(parts.t, 10);
	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - timestamp) > 300) {
		console.warn('Webhook timestamp too old, possible replay attack');
		return false;
	}

	// Recreate the signed content
	const signedContent = `${parts.t}.${body}`;

	// Compute the expected signature
	const expectedSignature = crypto
		.createHmac('sha256', STRIPE_WEBHOOK_SECRET)
		.update(signedContent)
		.digest('hex');

	// Compare signatures using constant-time comparison
	return crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expectedSignature));
}
