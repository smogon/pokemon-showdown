import { configs, configure, globals } from './oxlint-ps-standard-style.mts';

const jsGlobals = Object.fromEntries(Object.entries({
	...globals.builtin,
	...globals.node,
	...globals.mocha,
}).map(([name, writable]) => [name, writable ? 'writable' : 'readonly']));

export default configure({
	...configs.base,
	ignorePatterns: [
		'logs/',
		'node_modules/',
		'dist/',
		'tools/set-import/importer.js',
		'tools/set-import/sets',
		'tools/modlog/converter.js',
		'server/global-variables.d.ts',
	],
	overrides: [
		{
			// JavaScript
			...configs.js,
			files: ['*.mjs', '**/*.js'],
			globals: {
				...jsGlobals,
				// globals in test
				Dex: 'readonly',
				toID: 'readonly',
				Teams: 'readonly',
				Config: 'readonly',
				Users: 'readonly',
				Rooms: 'readonly',
				Ladders: 'readonly',
				Chat: 'readonly',
				Punishments: 'readonly',
				LoginServer: 'readonly',
			},
			rules: {
				...configs.js.rules,
				'@stylistic/max-len': 'off',
				'no-shadow': 'off', // mostly just too lazy, someone should fix this sometime
			},
		},
		{
			files: ['test/**/*.js'],
			rules: {
				'typescript/restrict-template-expressions': 'off',
			},
		},
		{
			// TypeScript
			...configs.ts,
			files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
			rules: {
				...configs.ts.rules,

				// TEMPORARY
				// "typescript/restrict-plus-operands": "off",

				'typescript/restrict-template-expressions': [
					'error',
					{
						allow: [
							{ name: ['Error', 'URL', 'URLSearchParams', 'Date', 'unknown'], from: 'lib' },
							{
								name: [
									'BasicEffect', 'Move', 'TypeInfo', 'Pokemon', 'Side', 'Battle',
									'BasicRoom', 'RoomGamePlayer', 'User', 'Connection', 'Statement',
								],
								from: 'file',
							},
							{ name: ['Buffer', 'NonSharedBuffer'], from: 'package', package: 'node' },
						],
						allowBoolean: false,
						allowNever: true,
						allowNullish: false,
						allowRegExp: false,
					},
				],

				// used in translations
				'no-template-curly-in-string': 'off',

				// hotpatching, of course
				'typescript/no-require-imports': 'off',

				// too new, let's give it more time
				'prefer-object-has-own': 'off',

				// we do use these for documentation
				'typescript/no-redundant-type-constituents': 'off',

				// we actually pass around unbound methods a lot (event handlers in Sim, mainly)
				'typescript/unbound-method': 'off',

				// event handlers frequently don't have known types
				'typescript/no-unsafe-function-type': 'off',

				// too strict when there's no way to ensure that catch catches an error
				'typescript/prefer-promise-reject-errors': 'off',

				// we use import() everywhere
				'typescript/consistent-type-imports': ['error', { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports' }],

				// TS has _way_ too many issues to require comments on all of them
				// most commonly:
				// - closed types https://github.com/microsoft/TypeScript/issues/12936
				// - unknown property access
				'typescript/ban-ts-comment': [
					'error',
					{ 'ts-check': false, 'ts-expect-error': false, 'ts-ignore': true, 'ts-nocheck': true },
				],

				// we're inconsistent about comma dangle in functions. TODO: fix later
				'@stylistic/comma-dangle': [
					'error',
					{
						arrays: 'always-multiline',
						objects: 'always-multiline',
						imports: 'always-multiline',
						exports: 'always-multiline',
						functions: 'only-multiline',
						importAttributes: 'always-multiline',
						dynamicImports: 'always-multiline',
						enums: 'always-multiline',
						generics: 'always-multiline',
						tuples: 'always-multiline',
					},
				],

				// there are a few of these that make sense, in scripts
				'no-useless-return': 'off',

				// too buggy to enable at the moment
				// - https://github.com/oxc-project/tsgolint/issues/1253
				'typescript/no-unnecessary-type-assertion': 'off',
			},
		},
		{
			files: ['sim/**', 'data/**', 'lib/**'],
			rules: {
				// we do still allow `global.Config?.` but DON'T forget the `?.`
				'no-restricted-globals': ['error',
					...[
						'Config', 'Chat', 'Dex', 'Teams', 'IPTools', 'Ladders', 'LoginServer', 'Monitor',
						'nodeOomHeapdump', 'Punishments', 'Rooms', 'Sockets', 'TeamValidatorAsync',
						'TeamValidator', 'Tournaments', 'Users', 'Verifier', 'toID', '__version',
					].map(name => ({
						name,
						message: `sim/ and data/ must not use globals; import what you need instead of using the ${name} global.`,
					})),
				],
			},
		},
		{
			files: ['data/**/learnsets.ts'],
			// Don't run Stylistic on learnsets
			rules: Object.fromEntries(Object.keys(configs.ts.rules)
				.filter(rule => rule.startsWith('@stylistic/')).map(rule => [rule, 'off'])),
		},
		{
			files: ['server/chat-commands/core.ts', 'server/chat-commands/moderation.ts'],
			rules: { 'no-else-return': 'error' },
		},
	],
});
