/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

module.exports = defineConfig({
	async constraints({ Yarn }) {
		// Enforce consistent versions of shared dependencies across all workspaces
		for (const dependency of Yarn.dependencies()) {
			if (dependency.type === 'peerDependencies') continue;

			for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
				if (otherDependency.type === 'peerDependencies') continue;

				dependency.update(otherDependency.range);
			}
		}
	}
});
