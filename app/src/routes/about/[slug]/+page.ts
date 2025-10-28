import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

export const load = async ({ params }) => {
	const page = await import(`../../../lib/static-pages/${params.slug}.md`).catch(() =>
		error(404, 'Page not found')
	);

	if (page.metadata.parentSection !== 'about') error(404, 'Not Found');

	const pageTitle: string = page.metadata.title;
	const pageDescription: string = page.metadata.description;
	const pageContent: Component = page.default;

	return {
		pageTitle,
		pageDescription,
		pageContent
	};
};
