import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['**/eslint.config.js', '**/svelte.config.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte']
			}
		},
		rules: {
			// Svelte-specific overrides can go here
		}
	},
	{
		files: ['app/**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				svelteConfig: await import('./app/svelte.config.js').then((m) => m.default)
			}
		}
	},
	{
		files: ['api/**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				svelteConfig: await import('./api/svelte.config.js').then((m) => m.default)
			}
		}
	},
	{
		files: ['dashboard/**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				svelteConfig: await import('./dashboard/svelte.config.js').then((m) => m.default)
			}
		}
	}
);
