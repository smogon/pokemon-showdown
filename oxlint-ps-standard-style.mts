/**
 * Pokemon Showdown standard style
 *
 * This is Showdown's shared Oxlint configuration. Each project overrides
 * at least a little of it here and there, but these are the rules we use
 * unless there's a good reason otherwise.
 */
import { defineConfig, type OxlintConfig } from 'oxlint';
import stylistic from '@stylistic/eslint-plugin';
import eslint from 'eslint/use-at-your-own-risk';

export { default as globals } from 'globals';
export { defineConfig as configure } from 'oxlint';

type Rules = NonNullable<OxlintConfig['rules']>;

export const defaultRules: Rules = {
	...stylistic.configs.customize({
		braceStyle: '1tbs',
		indent: 'tab',
		semi: true,
		jsx: true,
	}).rules,

	// TODO rules to revisit
	// =====================

	// nice to have but we mostly know && || precedence so not urgent to fix
	'@stylistic/no-mixed-operators': 'off',

	// test only (should never be committed, but useful when testing)
	// ==============================================================
	// do we want unused args/destructures to start with _? unsure
	'no-unused-vars': [
		'warn',
		{
			args: 'all',
			argsIgnorePattern: '.',
			caughtErrors: 'all',
			destructuredArrayIgnorePattern: '.',
			ignoreRestSiblings: true,
		},
	],
	'@stylistic/max-len': [
		'warn',
		{
			code: 120,
			tabWidth: 0,
			// DO NOT EDIT DIRECTLY: see bottom of file for source
			ignorePattern: '^\\s*(?:\\/\\/ \\s*)?(?:(?:export )?(?:let |const |readonly )?[a-zA-Z0-9_$.]+(?: \\+?=>? )|[a-zA-Z0-9$]+: \\[?|(?:return |throw )?(?:new )?(?:[a-zA-Z0-9$.]+\\()?)?(?:[A-Za-z0-9.]+|\\$\\()?[\'"`/]',
		},
	],
	'prefer-const': ['warn', { destructuring: 'all' }],

	// PS code (code specific to PS)
	// =============================
	// used for the `new class {...}` pattern
	'@stylistic/new-parens': 'off',
	'no-prototype-builtins': 'off',

	// defaults too strict
	// ===================
	'no-empty': ['error', { allowEmptyCatch: true }],
	'no-case-declarations': 'off',
	'unicorn/no-new-array': 'off',
	// too buggy to enable. revisit later, depending on what happens to these issues I filed:
	// https://github.com/oxc-project/oxc/issues/27707
	// https://github.com/oxc-project/oxc/issues/27708
	'unicorn/no-useless-spread': 'off',

	// probably bugs
	// =============
	'array-callback-return': 'error',
	'no-constructor-return': 'error',
	'no-dupe-class-members': 'error',
	'ps/no-dupe-args': 'error',
	'no-extend-native': 'error',
	'no-extra-bind': 'warn',
	'no-extra-label': 'warn',
	'no-constant-condition': 'warn',
	'no-eval': 'error',
	'no-implied-eval': 'error',
	'no-inner-declarations': ['error', 'functions'],
	'no-iterator': 'error',
	'no-fallthrough': ['error', { allowEmptyCase: true, reportUnusedFallthroughComment: true }],
	'no-promise-executor-return': ['error', { allowVoid: true }],
	// conflicts with no-promise-executor-return allowVoid. see:
	// https://github.com/oxc-project/tsgolint/issues/1290
	'typescript/no-meaningless-void-operator': 'off',
	'no-redeclare': [2, { builtinGlobals: false }],
	'no-regex-spaces': 'error',
	'no-return-assign': 'error',
	'no-self-compare': 'error',
	'no-sequences': 'error',
	'no-shadow': 'warn',
	'no-template-curly-in-string': 'error',
	'no-throw-literal': 'warn',
	'no-undef': 'error',
	'no-unexpected-multiline': 'error',
	'no-unmodified-loop-condition': 'error',

	// best way to read first key of object
	// "no-unreachable-loop": "error",
	// ternary is used to convert callbacks to Promises
	// tagged templates are used for the SQL library
	'no-unused-expressions': ['error', { allowTernary: true, allowTaggedTemplates: true, enforceForJSX: true }],
	'no-useless-call': 'error',

	// "no-useless-assignment": "error",
	'ps/require-atomic-updates': [2, { allowProperties: false }],

	// syntax style (local syntactical, usually autofixable formatting decisions)
	// ===========================================================================
	'@stylistic/member-delimiter-style': [
		'error',
		{
			multiline: { delimiter: 'comma', requireLast: true },
			singleline: { delimiter: 'comma', requireLast: false },
			overrides: {
				interface: {
					multiline: { delimiter: 'semi', requireLast: true },
					singleline: { delimiter: 'semi', requireLast: false },
				},
			},
		},
	],
	'default-case-last': 'error',
	eqeqeq: ['error', 'always', { null: 'ignore' }],
	'no-array-constructor': 'error',
	'no-duplicate-imports': 'error',
	'no-implicit-coercion': ['error', { allow: ['!!', '+'] }],
	'no-multi-str': 'error',
	'no-object-constructor': 'error',
	'ps/no-octal': 'error',
	'no-proto': 'error',
	'no-unneeded-ternary': 'error',
	'no-useless-computed-key': 'error',
	'no-useless-constructor': 'error',
	'no-useless-rename': 'error',
	'no-useless-return': 'error',
	'no-var': 'error',
	'object-shorthand': ['error', 'always'],
	'operator-assignment': ['error', 'always'],
	'prefer-arrow-callback': 'error',
	'prefer-exponentiation-operator': 'error',
	'prefer-numeric-literals': 'error',
	'prefer-object-has-own': 'error',
	'prefer-object-spread': 'error',
	'prefer-promise-reject-errors': 'error',
	'prefer-regex-literals': 'error',
	'prefer-rest-params': 'error',
	'prefer-spread': 'error',
	'ps/radix': [2, 'as-needed'],

	// syntax style, overriding base
	// =============================
	'@stylistic/quotes': 'off',
	'@stylistic/quote-props': 'off',
	'@stylistic/function-call-spacing': 'error',
	'@stylistic/arrow-parens': ['error', 'as-needed'],
	'@stylistic/comma-dangle': [
		'error',
		{
			arrays: 'always-multiline',
			objects: 'always-multiline',
			imports: 'always-multiline',
			exports: 'always-multiline',
			functions: 'never',
			importAttributes: 'always-multiline',
			dynamicImports: 'always-multiline',
			enums: 'always-multiline',
			generics: 'always-multiline',
			tuples: 'always-multiline',
		},
	],
	'@stylistic/jsx-wrap-multilines': 'off',
	'@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],

	// "@stylistic/jsx-closing-tag-location": ["error", "line-aligned"],
	'@stylistic/jsx-closing-tag-location': 'off',
	'@stylistic/jsx-one-expression-per-line': 'off',
	'@stylistic/jsx-max-props-per-line': 'off',
	'@stylistic/jsx-function-call-newline': 'off',
	'@stylistic/jsx-child-element-spacing': 'error',
	'ps/no-restricted-syntax': [
		2,
		{
			selector: "CallExpression[callee.name='Symbol']",
			message: 'Annoying to serialize, just use a string',
		},
	],

	// whitespace
	// ==========
	'@stylistic/block-spacing': 'error',
	'@stylistic/operator-linebreak': ['error', 'after'],
	'@stylistic/max-statements-per-line': ['error', { max: 3, ignoredNodes: ['BreakStatement'] }],
	'@stylistic/lines-between-class-members': 'off',
	'@stylistic/multiline-ternary': 'off',
	'@stylistic/indent': ['error', 'tab', { flatTernaryExpressions: true, SwitchCase: 0 }],
};

export const defaultRulesTS: Rules = {
	...defaultRules,

	// TODO: revisit
	// we should do this someday but it'd have to be a gradual manual process
	// "typescript/explicit-module-boundary-types": "off",
	// like above but slightly harder, so do that one first
	// "typescript/explicit-function-return-type": "off",
	// probably we should settle on a standard someday
	// "typescript/member-ordering": "off",
	// "typescript/no-extraneous-class": "error",
	// maybe we should consider this
	'typescript/consistent-indexed-object-style': 'off',

	// defaults too strict
	// ===================
	'no-empty-function': 'off',
	'typescript/no-explicit-any': 'off',
	'typescript/no-non-null-assertion': 'off',

	// TS already checks these
	// =======================
	'constructor-super': 'off',
	'getter-return': 'off',
	'no-class-assign': 'off',
	'no-const-assign': 'off',
	'ps/no-dupe-args': 'off',
	'no-dupe-keys': 'off',
	'no-func-assign': 'off',
	'no-import-assign': 'off',
	'no-new-native-nonconstructor': 'off',
	'no-obj-calls': 'off',
	'no-redeclare': 'off',
	'no-setter-return': 'off',
	'no-this-before-super': 'off',
	'no-undef': 'off',
	'no-unreachable': 'off',
	'no-unsafe-negation': 'off',
	'no-with': 'off',

	// probably bugs
	// =============
	'typescript/no-empty-object-type': 'error',
	'typescript/no-extra-non-null-assertion': 'error',
	'typescript/no-misused-new': 'error',
	'typescript/no-unnecessary-type-constraint': 'error',

	// no way to get it to be less strict unfortunately
	// "typescript/no-misused-spread": "error",
	'typescript/no-misused-spread': 'off',
	'typescript/no-non-null-asserted-optional-chain': 'error',

	// syntax style (local syntactical, usually autofixable formatting decisions)
	// ===========================================================================
	'typescript/no-namespace': ['error', { allowDeclarations: true }],
	'typescript/prefer-namespace-keyword': 'error',
	'typescript/adjacent-overload-signatures': 'error',
	'typescript/array-type': 'error',
	'typescript/ban-tslint-comment': 'error',
	'typescript/class-literal-property-style': 'error',
	'typescript/consistent-generic-constructors': 'error',
	'typescript/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
	'typescript/consistent-type-definitions': 'off',
	'typescript/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
	'typescript/no-inferrable-types': 'error',
	'typescript/parameter-properties': 'error',

	// `source` and `target` are frequently used as variables that may point to `this`
	// or to another `Pokemon` object, depending on how the given method is invoked
	'typescript/no-this-alias': ['error', { allowedNames: ['source', 'target'] }],

	// unfortunately this has lots of false positives without strict array/object property access
	// "typescript/no-unnecessary-boolean-literal-compare": "error",
	'typescript/prefer-as-const': 'error',
	'typescript/prefer-for-of': 'error',
	'typescript/prefer-function-type': 'error',
	'typescript/prefer-return-this-type': 'error',
	'typescript/triple-slash-reference': 'error',
	'typescript/unified-signatures': 'error',
};

export const defaultRulesTSChecked: Rules = {
	...defaultRulesTS,

	// probably bugs
	// =============
	'typescript/no-misused-promises': 'error',
	'typescript/no-unsafe-enum-comparison': 'error',
	'typescript/only-throw-error': 'error',
	'typescript/require-await': 'error',

	// style
	// =====
	'typescript/no-unnecessary-type-arguments': 'error',
	'typescript/non-nullable-type-assertion-style': 'error',
	'typescript/prefer-find': 'error',
	'typescript/prefer-optional-chain': 'error',
	'typescript/prefer-regexp-exec': 'error',
	'typescript/prefer-string-starts-ends-with': 'error',
	'typescript/restrict-plus-operands': [
		'error',
		{
			allowBoolean: false,
			allowNullish: false,
			allowNumberAndString: false,
			allowRegExp: false,
		},
	],
	'typescript/restrict-template-expressions': [
		'error',
		{
			allow: [{ name: ['Error', 'URL', 'URLSearchParams', 'unknown'], from: 'lib' }],
			allowBoolean: false,
			allowNever: true,
			allowNullish: false,
			allowRegExp: false,
		},
	],

	// we use `any`
	// ============
	'typescript/no-unsafe-assignment': 'off',
	'typescript/no-unsafe-call': 'off',
	'typescript/no-unsafe-member-access': 'off',
	'typescript/no-unsafe-return': 'off',
	'typescript/no-unsafe-argument': 'off',

	// yes-types syntax style, overriding base
	// =======================================
	'typescript/prefer-includes': 'error',
	'typescript/prefer-nullish-coalescing': 'off',
	'typescript/dot-notation': 'off',
	'typescript/no-confusing-non-null-assertion': 'off',
};

export const defaultRulesES3: Rules = {
	...defaultRules,
	// required in ES3
	// ================
	'no-var': 'off',
	'object-shorthand': ['error', 'never'],
	'prefer-arrow-callback': 'off',
	'prefer-exponentiation-operator': 'off',
	'prefer-object-has-own': 'off',
	'prefer-object-spread': 'off',
	'prefer-rest-params': 'off',
	'prefer-spread': 'off',
	'ps/radix': 'off',
	'@stylistic/comma-dangle': 'error',
	'no-unused-vars': ['warn', {
		args: 'all',
		argsIgnorePattern: '.',
		caughtErrors: 'all',
		caughtErrorsIgnorePattern: '^e(rr)?$',
		destructuredArrayIgnorePattern: '.',
		ignoreRestSiblings: true,
	}],
	'ps/no-restricted-syntax': ['error',
		{ selector: 'TaggedTemplateExpression', message: 'Not supported by ES3' },
		{ selector: "CallExpression[callee.name='Symbol']", message: 'Annoying to serialize, just use a string' },
	],

	// with no block scoping, coming up with original variable names is too hard
	'no-redeclare': 'off',

	// treat var as let
	// unfortunately doesn't actually let me redeclare
	// "block-scoped-var": "error",
	'no-caller': 'error',
	'no-new-wrappers': 'error',
	// Map/Set can be polyfilled but it's nontrivial and it's easier just to use bare objects
	// fetch can be polyfilled, but our standard is to use $.get or Net as appropriate.
	'no-restricted-globals': ['error', 'Proxy', 'Reflect', 'Symbol', 'WeakSet', 'WeakMap', 'Set', 'Map', 'fetch'],
	'unicode-bom': 'error',
};

/**
 * Actually very different from defaultRulesES3, because we don't have to
 * worry about syntax that's easy to transpile to ES3 (which is basically
 * all syntax).
 */
export const defaultRulesES3TSChecked: Rules = {
	...defaultRulesTSChecked,
	'ps/radix': 'off',
	// Map/Set can be polyfilled but it's nontrivial and it's easier just to use bare objects
	// fetch can be polyfilled, but our standard is to use $.get or Net as appropriate.
	'no-restricted-globals': ['error', 'Proxy', 'Reflect', 'Symbol', 'WeakSet', 'WeakMap', 'Set', 'Map', 'fetch'],
	'ps/no-restricted-syntax': ['error', 'YieldExpression', 'AwaitExpression', 'Literal[bigint]'],
};

// this is a compatibility plugin that is also this file's default export
export default {
	meta: { name: 'ps' },
	rules: Object.fromEntries([
		'require-atomic-updates',
		'no-restricted-syntax',
		'no-dupe-args',
		'no-octal',
		'radix',
	].map(name => [name, eslint.builtinRules.get(name)])),
};

export const configs = {
	base: defineConfig({
		jsPlugins: ['@stylistic/eslint-plugin', { name: 'ps', specifier: import.meta.filename }],
		options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: 'warn' },
		env: { builtin: true },
		rules: defaultRules,
	}),
	js: { rules: defaultRules },
	ts: { rules: defaultRulesTSChecked },
	es3: { rules: defaultRulesES3 },
	es3ts: { rules: defaultRulesES3TSChecked },
};

/*
SOURCE FOR IGNOREPATTERN (compile with https://regexfree.k55.io/ )

  # indentation
  ^\s*
  # possibly commented out
  (\/\/\ \s*)?

  (
    # define a variable, append to a variable, or define a single-arg arrow function
    (export\ )? (let\ |const\ |readonly\ )? [a-zA-Z0-9_$.]+ (\ \+?=>?\ )
  |
    # define a property (oversize arrays are only allowed in properties)
    [a-zA-Z0-9$]+:\ \[?
  |
    # optionally return or throw
    (return\ |throw\ )?
    # call a function or constructor
    (new\ )?([a-zA-Z0-9$.]+\()?
  )?

  (
    # tagged template
    [A-Za-z0-9\.]+
  |
    \$\(
  )?

  # start of string or regex
  ['"`\/]

*/
