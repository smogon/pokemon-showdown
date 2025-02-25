// @ts-check

import { configs, configure, globals } from './eslint-ps-standard.mjs';

export default configure([
	{
		ignores: [
			"logs/",
			"node_modules/",
			"dist/",
			"data/**/learnsets.ts",
			"tools/set-import/importer.js",
			"tools/set-import/sets",
			"tools/modlog/converter.js",
			"server/global-variables.d.ts",
		],
	},
	{
		name: "JavaScript",
		files: [
			'*.mjs', // look mom I'm linting myself!
			'**/*.js',
		],
		extends: [configs.js],
		languageOptions: {
			globals: {
				...globals.builtin,
				...globals.node,
				...globals.mocha,
				// globals in test
				Dex: false, toID: false, Teams: false,
				Config: false,
				Users: false, Rooms: false, Ladders: false, Chat: false, Punishments: false, LoginServer: false,
			},
		},
		rules: {
			"@stylistic/max-len": "off",
			"no-shadow": "off", // mostly just too lazy, someone should fix this sometime
		},
	},
	{
		name: "TypeScript",
		files: [
			"config/*.ts", "data/**/*.ts", "lib/*.ts",
			"server/**/*.ts", "server/**/*.tsx",
			"sim/**/*.ts",
			"tools/set-import/*.ts",
		],
		extends: [configs.ts],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// TEMPORARY
			// "@typescript-eslint/restrict-plus-operands": "off",

			// we use these for grouping
			// "@typescript-eslint/restrict-template-expressions": ["error", {
			// 	allow: [
			// 		{name: ['Error', 'URL', 'URLSearchParams', 'unknown'], from: 'lib'},
			// 		// {name: ['ModifiableValue'], from: 'file'},
			// 	],
			// 	allowBoolean: false, allowNever: false, allowNullish: false, allowRegExp: false,
			// }],
			"@typescript-eslint/restrict-template-expressions": "off",

			// hotpatching, of course
			"@typescript-eslint/no-require-imports": "off",
			// too new, let's give it more time
			"prefer-object-has-own": "off",
			// we do use these for documentation
			"@typescript-eslint/no-redundant-type-constituents": "off",
			// we actually pass around unbound methods a lot (event handlers in Sim, mainly)
			"@typescript-eslint/unbound-method": "off",
			// event handlers frequently don't have known types
			"@typescript-eslint/no-unsafe-function-type": "off",
			// too strict when there's no way to ensure that catch catches an error
			"@typescript-eslint/prefer-promise-reject-errors": "off",
			// we use import() everywhere
			"@typescript-eslint/consistent-type-imports": ["error", { disallowTypeAnnotations: false, fixStyle: "inline-type-imports" }],
			// TS has _way_ too many issues to require comments on all of them
			// most commonly:
			// - closed types https://github.com/microsoft/TypeScript/issues/12936
			// - unknown property access
			"@typescript-eslint/ban-ts-comment": ["error", {
				'ts-check': false,
				'ts-expect-error': false,
				'ts-ignore': true,
				'ts-nocheck': true,
			}],
			// we're inconsistent about comma dangle in functions. TODO: fix later
			"@stylistic/comma-dangle": ["error", {
				"arrays": "always-multiline",
				"objects": "always-multiline",
				"imports": "always-multiline",
				"exports": "always-multiline",
				"functions": "only-multiline",
				"importAttributes": "always-multiline",
				"dynamicImports": "always-multiline",
				"enums": "always-multiline",
				"generics": "always-multiline",
				"tuples": "always-multiline",
			}],
			// there are a few of these that make sense, in scripts
			"no-useless-return": "off",
		},
	},
]);
