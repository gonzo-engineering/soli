import type { Component } from 'svelte';

export const load = async ({ params }) => {
	const page = await import(`../../lib/static-pages/${params.slug}.md`);

	if (!page) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	const pageTitle: string = page.metadata.title;
	const pageDescription: string = page.metadata.description;
	const pageContent: Component = page.default;

	return {
		pageTitle,
		pageDescription,
		pageContent
	};
};
