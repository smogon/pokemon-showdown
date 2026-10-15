'use strict';

const assert = require('../assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { createRequire } = require('module');

const root = path.resolve(__dirname, '../..');
const rootRequire = createRequire(path.join(root, 'package.json'));
const { default: config } = require('../../oxlint.config.mts');
const { configs } = require('../../oxlint-ps-standard-style.mts');

describe('Oxlint integration', function () {
	this.timeout(15000);
	let directory;
	let configPath;

	before(() => {
		directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-oxlint-test-'));
		configPath = path.join(directory, '.oxlintrc.json');
		fs.writeFileSync(path.join(directory, 'tsconfig.json'), JSON.stringify({
			compilerOptions: { strict: true, target: 'ES2020', module: 'commonjs', moduleResolution: 'bundler' },
			include: ['*.ts'],
		}));
		fs.writeFileSync(configPath, JSON.stringify({
			...config,
			ignorePatterns: [],
			options: { typeAware: false },
			jsPlugins: config.jsPlugins.map(plugin => typeof plugin === 'string' ?
				rootRequire.resolve(plugin) : { ...plugin, specifier: rootRequire.resolve(plugin.specifier) }
			),
		}));
	});
	after(() => fs.rmSync(directory, { recursive: true, force: true }));

	function lint(file, fix = false, typeAware = false, preset = '') {
		let lintConfigPath = configPath;
		if (preset) {
			const base = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			lintConfigPath = path.join(directory, `${preset}.json`);
			fs.writeFileSync(lintConfigPath, JSON.stringify({
				...base,
				env: { ...base.env, browser: true },
				overrides: [],
				rules: { ...configs.base.rules, ...configs[preset].rules },
			}));
		}
		const result = spawnSync(process.execPath, [
			path.join(root, 'node_modules/oxlint/bin/oxlint'), '--config', lintConfigPath, '--format', 'json',
			...(fix ? ['--fix'] : []), ...(typeAware ? ['--type-aware'] : []), file,
		], { cwd: root, encoding: 'utf8' });
		assert.ifError(result.error);
		assert(result.status === 0 || result.status === 1, result.stderr);
		return JSON.parse(result.stdout).diagnostics;
	}

	it('runs compatibility rules and honors their suppression comments', () => {
		const file = path.join(directory, 'rules.ts');
		const source = [
			'export let total = 0;',
			'export async function update() {',
			'\ttotal += await Promise.resolve(1);',
			'}',
			'export const token = Symbol("x");',
			'export const result = parseInt("10", 10);',
			'',
		].join('\n');
		fs.writeFileSync(file, source);
		const codes = lint(file).map(diagnostic => diagnostic.code);
		for (const rule of ['require-atomic-updates', 'no-restricted-syntax', 'radix']) {
			assert(codes.includes(`ps(${rule})`), `Missing ${rule}`);
		}
		fs.writeFileSync(file, source.replace('\ttotal +=',
			'\t// oxlint-disable-next-line ps/require-atomic-updates\n\ttotal +='
		));
		assert(!lint(file).some(diagnostic => diagnostic.code === 'ps(require-atomic-updates)'));
	});

	it('allows imported JavaScript names to shadow configured globals', () => {
		const file = path.join(directory, 'globals.js');
		fs.writeFileSync(file, 'const { Dex } = require("./dex");\nmodule.exports = Dex;\n');
		assert.deepEqual(lint(file), []);
	});

	it('preserves ES3 JavaScript conventions', () => {
		const file = path.join(directory, 'legacy.js');
		fs.writeFileSync(file, [
			"'use strict';",
			'var count = 0;',
			"var count = parseInt('10', 10);",
			'var object = { count: count };',
			'var callback = function (value) { return value; };',
			'window.result = callback(object.count);',
			'try { window.update(); } catch (err) {}',
			'window.template = window.tag`value`;',
			"window.token = Symbol('x');",
			'window.map = new Map();',
			"window.request = fetch('/');",
			"window.wrapper = new String('x');",
			'function legacy() { return arguments.callee; }',
			'window.legacy = legacy;',
			'',
		].join('\n'));
		const diagnostics = lint(file, false, false, 'es3');
		assert.deepEqual(diagnostics.map(diagnostic => diagnostic.code).sort(), [
			'eslint(no-caller)', 'eslint(no-new-wrappers)',
			'eslint(no-restricted-globals)', 'eslint(no-restricted-globals)', 'eslint(no-restricted-globals)',
			'ps(no-restricted-syntax)', 'ps(no-restricted-syntax)',
		].sort());
	});

	it('allows transpiled syntax in the ES3 TypeScript preset but rejects unsupported features', () => {
		const file = path.join(directory, 'legacy.ts');
		fs.writeFileSync(file, [
			'export function shorthand(count: number) { return { count }; }',
			'export const callback = (value: number) => value;',
			'export const template = String.raw`value`;',
			"export const result = parseInt('10', 10);",
			'export const map = new Map<string, number>();',
			'export async function load() { return await Promise.resolve(1); }',
			'export function* sequence() { yield 1; }',
			'export const large = 1n;',
			'',
		].join('\n'));
		assert.deepEqual(lint(file, false, false, 'es3ts').map(diagnostic => diagnostic.code).sort(), [
			'eslint(no-restricted-globals)',
			'ps(no-restricted-syntax)', 'ps(no-restricted-syntax)', 'ps(no-restricted-syntax)',
		].sort());
	});

	it('checks floating promises through tsgolint', () => {
		const file = path.join(directory, 'typed.ts');
		fs.writeFileSync(file, 'Promise.resolve(1);\n');
		assert(lint(file, false, true).some(diagnostic => diagnostic.code === 'typescript(no-floating-promises)'));
		fs.writeFileSync(file, 'void Promise.resolve(1);\n');
		assert.deepEqual(lint(file, false, true), []);
	});

	it('preserves our TypeScript and JSX formatting through Stylistic', () => {
		const file = path.join(directory, 'view.tsx');
		fs.writeFileSync(file, 'export const view=(name:string)=>{\n  return <div class="box">\n    <span>{ name }</span>\n    <input disabled={ true } />\n  </div>\n}\n');
		assert(lint(file).some(diagnostic => diagnostic.code === '@stylistic(indent)'));
		// Oxlint can need another pass when multiple fixes touch the same tokens.
		let diagnostics;
		for (let pass = 0; pass < 5; pass++) {
			diagnostics = lint(file, true);
			if (!diagnostics.length) break;
		}
		assert.deepEqual(diagnostics, []);
		assert.equal(fs.readFileSync(file, 'utf8'), [
			'export const view = (name: string) => {',
			'\treturn <div class="box">',
			'\t\t<span>{ name }</span>',
			'\t\t<input disabled={true} />',
			'\t</div>;',
			'};',
			'',
		].join('\n'));
	});
});
