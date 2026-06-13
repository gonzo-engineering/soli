import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { STRIPE_API_VERSION } from '@soli/shared/config';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: STRIPE_API_VERSION
});
