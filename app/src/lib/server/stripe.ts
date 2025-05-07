import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

export const stripe = new Stripe(env.VITE_STRIPE_SECRET_KEY, {
	apiVersion: '2025-04-30.basil'
});
