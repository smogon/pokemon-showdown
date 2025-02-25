// @ts-check

import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @typedef {import('typescript-eslint').Config} ConfigFile */
/** @typedef {Awaited<ConfigFile>[number]} Config */
/** @typedef {NonNullable<Config['rules']>} Rules */

export {eslint, globals, tseslint, stylistic};

/** @type {Config} */
export const plugin = {
	plugins: {
		'@stylistic': stylistic,
		'@typescript-eslint': tseslint.plugin,
	},
};

/** @type {typeof tseslint.config} */
export const configure = (...args) => [
	plugin,
	...tseslint.config(...args),
];

/** @type {NonNullable<Config['rules']>} */
export const defaultRules = {
	...stylistic.configs.customize({
		braceStyle: '1tbs',
		indent: 'tab',
		semi: true,
		jsx: true,
		// ...
	}).rules,

	// TODO rules to revisit
	// =====================

	// we're used to spacing blocks but not TS object types, which is no longer supported
	// we'll probably just space all curlies since that's Prettier standard anyway
	"@stylistic/block-spacing": "off",
	// "@stylistic/object-curly-spacing": ["error", 'always'],
	// nice to have but we mostly know && || precedence so not urgent to fix
	"@stylistic/no-mixed-operators": "off",

	// test only (should never be committed, but useful when testing)
	// ==============================================================
	// do we want unused args/destructures to start with _? unsure
	"no-unused-vars": ["warn", {
		args: "all",
		argsIgnorePattern: ".",
		caughtErrors: "all",
		destructuredArrayIgnorePattern: ".",
		ignoreRestSiblings: true,
	}],
	// "no-unused-vars": ["warn", {
	// 	args: "all",
	// 	argsIgnorePattern: "^_",
	// 	caughtErrors: "all",
	// 	destructuredArrayIgnorePattern: "^_",
	// 	ignoreRestSiblings: true
	// }],
	"@stylistic/max-len": ["warn", {
		"code": 120, "tabWidth": 0,
		// see bottom of file for source
		"ignorePattern": "^\\s*(?:\\/\\/ \\s*)?(?:(?:export )?(?:let |const |readonly )?[a-zA-Z0-9_$.]+(?: \\+?=>? )|[a-zA-Z0-9$]+: \\[?|(?:return |throw )?(?:new )?(?:[a-zA-Z0-9$.]+\\()?)?(?:Utils\\.html|(?:this\\.)?(?:room\\.)?tr|\\$\\()?['\"`/]",
	}],
	"prefer-const": ["warn", {"destructuring": "all"}],

	// PS code (code specific to PS)
	// =============================
	"@stylistic/new-parens": "off", // used for the `new class {...}` pattern
	"no-prototype-builtins": "off",

	// defaults too strict
	// ===================
	"no-empty": ["error", {"allowEmptyCatch": true}],
	"no-case-declarations": "off",

	// probably bugs
	// =============
	"array-callback-return": "error",
	"no-constructor-return": "error",
	"no-dupe-class-members": "error",
	"no-extend-native": "error",
	"no-extra-bind": "warn",
	"no-extra-label": "warn",
	"no-eval": "error",
	"no-implied-eval": "error",
	"no-inner-declarations": ["error", "functions"],
	"no-iterator": "error",
	"no-fallthrough": ["error", {allowEmptyCase: true, reportUnusedFallthroughComment: true}],
	"no-promise-executor-return": ["error", {allowVoid: true}],
	"no-return-assign": "error",
	"no-self-compare": "error",
	"no-sequences": "error",
	"no-shadow": "error",
	"no-template-curly-in-string": "error",
	"no-throw-literal": "warn",
	"no-unmodified-loop-condition": "error",
	// best way to read first key of object
	// "no-unreachable-loop": "error",
	// ternary is used to convert callbacks to Promises
	// tagged templates are used for the SQL library
	"no-unused-expressions": ["error", {allowTernary: true, allowTaggedTemplates: true, enforceForJSX: true}],
	"no-useless-call": "error",
	// "no-useless-assignment": "error",
	"require-atomic-updates": "error",

	// syntax style (local syntactical, usually autofixable formatting decisions)
	// ===========================================================================
	"@stylistic/member-delimiter-style": ["error", {
		multiline: {delimiter: "comma", requireLast: true},
		singleline: {delimiter: "comma", requireLast: false},
		overrides: {interface: {
			multiline: {delimiter: "semi", requireLast: true},
			singleline: {delimiter: "semi", requireLast: false},
		}},
	}],
	"default-case-last": "error",
	"eqeqeq": ["error", "always", {null: "ignore"}],
	"no-array-constructor": "error",
	"no-duplicate-imports": "error",
	"no-implicit-coercion": ["error", {allow: ["!!", "+"]}],
	"no-multi-str": "error",
	"no-object-constructor": "error",
	"no-proto": "error",
	"no-unneeded-ternary": "error",
	"no-useless-computed-key": "error",
	"no-useless-constructor": "error",
	"no-useless-rename": "error",
	"no-useless-return": "error",
	"no-var": "error",
	"object-shorthand": ["error", "always"],
	"operator-assignment": ["error", "always"],
	"prefer-arrow-callback": "error",
	"prefer-exponentiation-operator": "error",
	"prefer-numeric-literals": "error",
	"prefer-object-has-own": "error",
	"prefer-object-spread": "error",
	"prefer-promise-reject-errors": "error",
	"prefer-regex-literals": "error",
	"prefer-rest-params": "error",
	"prefer-spread": "error",
	"radix": ["error", "as-needed"],

	// syntax style, overriding base
	// =============================
	"@stylistic/quotes": "off",
	"@stylistic/quote-props": "off",
	"@stylistic/function-call-spacing": "error",
	"@stylistic/arrow-parens": ["error", "as-needed"],
	"@stylistic/comma-dangle": ["error", {
		"arrays": "always-multiline",
		"objects": "always-multiline",
		"imports": "always-multiline",
		"exports": "always-multiline",
		"functions": "never",
		"importAttributes": "always-multiline",
		"dynamicImports": "always-multiline",
		"enums": "always-multiline",
		"generics": "always-multiline",
		"tuples": "always-multiline",
	}],
	"@stylistic/jsx-wrap-multilines": "off",
	"@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"],
	// "@stylistic/jsx-closing-tag-location": ["error", "line-aligned"],
	"@stylistic/jsx-closing-tag-location": "off",
	"@stylistic/jsx-one-expression-per-line": "off",
	"@stylistic/jsx-max-props-per-line": "off",
	"@stylistic/jsx-function-call-newline": "off",
	"no-restricted-syntax": ["error",
		{selector: "CallExpression[callee.name='Symbol']", message: "Annoying to serialize, just use a string"},
	],

	// whitespace
	// ==========
	"@stylistic/operator-linebreak": ["error", "after"],
	"@stylistic/max-statements-per-line": ["error", {max: 3, ignoredNodes: ['BreakStatement']}],
	"@stylistic/lines-between-class-members": "off",
	"@stylistic/multiline-ternary": "off",
	"@stylistic/object-curly-spacing": "error",
	"@stylistic/indent": ["error", "tab", {"flatTernaryExpressions": true}],
};

/** @type {NonNullable<Config['rules']>} */
export const defaultRulesTS = {
	...defaultRules,

	// TODO: revisit
	// we should do this someday but it'd have to be a gradual manual process
	// "@typescript-eslint/explicit-module-boundary-types": "off",
	// like above but slightly harder, so do that one first
	// "@typescript-eslint/explicit-function-return-type": "off",
	// probably we should settle on a standard someday
	// "@typescript-eslint/member-ordering": "off",
	// "@typescript-eslint/no-extraneous-class": "error",
	// maybe we should consider this
	"@typescript-eslint/consistent-indexed-object-style": "off",

	// typescript-eslint specific
	// ==========================
	"no-unused-vars": "off",
	"@typescript-eslint/no-unused-vars": defaultRules["no-unused-vars"],
	"no-shadow": "off",
	"@typescript-eslint/no-shadow": defaultRules["no-shadow"],
	"no-dupe-class-members": "off",
	"@typescript-eslint/no-dupe-class-members": defaultRules["no-dupe-class-members"],
	"no-unused-expressions": "off",
	"@typescript-eslint/no-unused-expressions": defaultRules["no-unused-expressions"],

	// defaults too strict
	// ===================
	"@typescript-eslint/no-empty-function": "off",
	"@typescript-eslint/no-explicit-any": "off",
	"@typescript-eslint/no-non-null-assertion": "off",

	// probably bugs
	// =============
	"@typescript-eslint/no-empty-object-type": "error",
	"@typescript-eslint/no-extra-non-null-assertion": "error",
	"@typescript-eslint/no-misused-new": "error",
	// no way to get it to be less strict unfortunately
	// "@typescript-eslint/no-misused-spread": "error",
	"@typescript-eslint/no-non-null-asserted-optional-chain": "error",

	// naming style
	// ============
	"@typescript-eslint/naming-convention": ["error", {
		"selector": ["class", "interface", "typeAlias"],
		"format": ["PascalCase"],
	}],

	// syntax style (local syntactical, usually autofixable formatting decisions)
	// ===========================================================================
	"@typescript-eslint/no-namespace": ["error", {allowDeclarations: true}],
	"@typescript-eslint/prefer-namespace-keyword": "error",
	"@typescript-eslint/adjacent-overload-signatures": "error",
	"@typescript-eslint/array-type": "error",
	"@typescript-eslint/consistent-type-assertions": ["error", {"assertionStyle": "as"}],
	"@typescript-eslint/consistent-type-definitions": "off",
	"@typescript-eslint/consistent-type-imports": ["error", {fixStyle: "inline-type-imports"}],
	"@typescript-eslint/explicit-member-accessibility": ["error", {"accessibility": "no-public"}],
	"@typescript-eslint/parameter-properties": "error",
	// `source` and `target` are frequently used as variables that may point to `this`
	// or to another `Pokemon` object, depending on how the given method is invoked
	"@typescript-eslint/no-this-alias": ["error", {"allowedNames": ["source", "target"]}],
	// unfortunately this has lots of false positives without strict array/object property access
	// "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
	"@typescript-eslint/prefer-as-const": "error",
	"@typescript-eslint/prefer-for-of": "error",
	"@typescript-eslint/prefer-function-type": "error",
	"@typescript-eslint/prefer-return-this-type": "error",
	"@typescript-eslint/triple-slash-reference": "error",
	"@typescript-eslint/unified-signatures": "error",
};

/** @type {NonNullable<Config['rules']>} */
export const defaultRulesTSChecked = {
	...defaultRulesTS,

	// style
	// =====
	"@typescript-eslint/no-unnecessary-type-arguments": "error",
	"@typescript-eslint/restrict-plus-operands": ["error", {
		allowBoolean: false, allowNullish: false, allowNumberAndString: false, allowRegExp: false,
	}],
	"@typescript-eslint/restrict-template-expressions": ["error", {
		allow: [{name: ['Error', 'URL', 'URLSearchParams'], from: 'lib'}],
		allowBoolean: false, allowNever: false, allowNullish: false, allowRegExp: false,
	}],

	// we use `any`
	// ============
	"@typescript-eslint/no-unsafe-assignment": "off",
	"@typescript-eslint/no-unsafe-call": "off",
	"@typescript-eslint/no-unsafe-member-access": "off",
	"@typescript-eslint/no-unsafe-return": "off",
	"@typescript-eslint/no-unsafe-argument": "off",

	// yes-types syntax style, overriding base
	// =======================================
	"@typescript-eslint/prefer-includes": "error",
	"@typescript-eslint/prefer-nullish-coalescing": "off",
	"@typescript-eslint/dot-notation": "off",
	"@typescript-eslint/no-confusing-non-null-assertion": "off",
};

/** @type {NonNullable<Config['rules']>} */
export const defaultRulesES3 = {
	...defaultRules,
	// required in ES3
	// ================
	"no-var": "off",
	"object-shorthand": ["error", "never"],
	"prefer-arrow-callback": "off",
	"prefer-exponentiation-operator": "off",
	"prefer-object-has-own": "off",
	"prefer-object-spread": "off",
	"prefer-rest-params": "off",
	"prefer-spread": "off",
	"radix": "off",
	"@stylistic/comma-dangle": "error",
	"no-unused-vars": ["warn", {
		args: "all",
		argsIgnorePattern: ".",
		caughtErrors: "all",
		caughtErrorsIgnorePattern: "^e(rr)?$",
		destructuredArrayIgnorePattern: ".",
		ignoreRestSiblings: true,
	}],
	"no-restricted-syntax": ["error",
		{selector: "TaggedTemplateExpression", message: "Hard to compile down to ES3"},
		{selector: "CallExpression[callee.name='Symbol']", message: "Annoying to serialize, just use a string"},
	],

	// with no block scoping, coming up with original variable names is too hard
	"no-redeclare": "off",

	// treat var as let
	// unfortunately doesn't actually let me redeclare
	// "block-scoped-var": "error",
	"no-caller": "error",
	"no-invalid-this": "error",
	"no-new-wrappers": "error",
	"no-restricted-globals": ["error", "Proxy", "Reflect", "Symbol", "WeakSet", "WeakMap"],
	"unicode-bom": "error",
};

/**
 * Actually very different from defaultRulesES3, because we don't have to
 * worry about syntax that's easy to transpile to ES3 (which is basically
 * all syntax).
 * @type {NonNullable<Config['rules']>}
 */
export const defaultRulesES3TSChecked = {
	...defaultRulesTSChecked,
	"radix": "off",
	"no-restricted-globals": ["error", "Proxy", "Reflect", "Symbol", "WeakSet", "WeakMap"],
	"no-restricted-syntax": ["error", "TaggedTemplateExpression", "YieldExpression", "AwaitExpression", "BigIntLiteral"],
};

/**
 * @param {Config[]} configs
 * @returns {Config}
 */
function extractPlugin(configs) {
	return configs.find(config => !config.rules) ||
		(() => { throw new Error('No plugin found'); })();
}
/**
 * @param {Config[]} configs
 * @returns {Rules}
 */
function extractRules(configs) {
	const rules = {};
	for (const config of configs.filter(c => c.rules)) {
		Object.assign(rules, config.rules);
	}
	return rules;
}
const tseslintPlugin = extractPlugin(tseslint.configs.stylisticTypeChecked);

/** @type {{[k: string]: Config[]}} */
export const configs = {
	js: [{
		rules: {
			...eslint.configs.recommended.rules,
			...defaultRules,
		},
	}],
	ts: [tseslintPlugin, {
		rules: {
			...eslint.configs.recommended.rules,
			...extractRules(tseslint.configs.recommendedTypeChecked),
			...extractRules(tseslint.configs.stylisticTypeChecked),
			...defaultRulesTSChecked,
		},
	}],
	es3: [{
		rules: {
			...eslint.configs.recommended.rules,
			...defaultRulesES3,
		},
	}],
	es3ts: [tseslintPlugin, {
		rules: {
			...eslint.configs.recommended.rules,
			...extractRules(tseslint.configs.recommendedTypeChecked),
			...extractRules(tseslint.configs.stylisticTypeChecked),
			...defaultRulesES3TSChecked,
		},
	}],
};
