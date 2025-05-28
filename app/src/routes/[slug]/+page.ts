export const load = async ({ params }) => {
	const page = await import(`../../lib/static-pages/${params.slug}.md`);

	if (!page) {
		return {
			status: 404,
			error: new Error('Not Found')
		};
	}

	return {
		pageTitle: page.metadata.title,
		pageDescription: page.metadata.description,
		pageContent: page.default
	};
};
