'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { transpile } = require('../../tools/build-utils');

describe('Build transpilation', () => {
	let directory;

	function write(file, source) {
		const destination = path.join(directory, file);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, source);
	}

	async function build() {
		const previousDirectory = process.cwd();
		try {
			process.chdir(directory);
			await transpile(false);
		} finally {
			process.chdir(previousDirectory);
		}
	}

	before(async () => {
		directory = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'showdown-build-')));
		write('tsconfig.json', JSON.stringify({ compilerOptions: {
			jsx: 'react', jsxFactory: 'UI.createElement', jsxFragmentFactory: 'UI.Fragment',
			target: 'es2020', module: 'CommonJS', useDefineForClassFields: false,
		} }));
		write('config/config-example.js', 'module.exports = { fixture: true };');
		write('config/fixture.ts', 'export const value: number = 1;');
		write('data/nested/fixture.ts', 'export const value: number = 2;');
		write('data/nested/fixture.json', '{"copied":true}');
		write('data/fixture.d.ts', 'declare const ignored: number;');
		write('node_modules/ignored/index.ts', 'this is deliberately invalid TypeScript');
		write('counter.ts', `
			import { read } from './reader';
			export let count: number = 0;
			export function increment() { count++; }
			export function readThroughCycle() { return read(); }
		`);
		write('reader.ts', `
			import { count } from './counter';
			export function read() { return count; }
		`);
		write('exports.ts', `
			export * from './counter';
			export * as reader from './reader';
		`);
		write('commonjs.ts', `
			module.exports = Object.assign(() => 'commonjs', { named: 'named' });
		`);
		write('interop.ts', `
			import callable, { named } from './commonjs';
			export const result = [callable(), named];
		`);
		write('default.ts', 'export default 42;');
		write('namespace.ts', `
			import * as counter from './counter';
			import answer from './default';
			export const hasDefault = Object.hasOwn(counter, 'default');
			export const value = answer;
		`);
		write('strict.ts', 'export function receiver() { return this; }');
		write('jsx.tsx', `
			const UI = {
				Fragment: 'fragment',
				createElement: (tag: string, props: object | null, ...children: unknown[]) => ({ tag, props, children }),
			};
			export const view = <><span title="fixture">Hello</span></>;
		`);
		write('fields.ts', `
			class Parent {
				retained = 11;
				result: number;
				set assigned(value: number) { this.result = value; }
			}
			class Child extends Parent {
				retained: number;
				assigned = 7;
			}
			export const instance = new Child();
		`);
		write('mapped.ts', 'export function crash(): never {\n\tthrow new Error("source map fixture");\n}\n');
		await build();
	});

	after(() => {
		if (!directory) return;
		for (const file of Object.keys(require.cache)) {
			if (file.startsWith(`${directory}${path.sep}`)) delete require.cache[file];
		}
		fs.rmSync(directory, { recursive: true, force: true });
	});

	it('preserves live exports, reexports, and circular imports', () => {
		const counter = require(path.join(directory, 'dist/exports.js'));
		assert.equal(counter.__esModule, true);
		assert.equal(counter.count, 0);
		counter.increment();
		assert.equal(counter.count, 1);
		assert.equal(counter.reader.read(), 1);
		assert.equal(counter.readThroughCycle(), 1);
	});

	it('supports default and named imports from CommonJS modules', () => {
		assert.deepEqual(require(path.join(directory, 'dist/interop.js')).result, ['commonjs', 'named']);
		assert.equal(require(path.join(directory, 'dist/default.js')).default, 42);
		assert.equal(require(path.join(directory, 'dist/namespace.js')).hasDefault, false);
		assert.equal(require(path.join(directory, 'dist/namespace.js')).value, 42);
	});

	it('preserves strict execution of ES modules', () => {
		const { receiver } = require(path.join(directory, 'dist/strict.js'));
		assert.equal(Reflect.apply(receiver, undefined, []), undefined);
	});

	it('uses the configured JSX factory and fragment', () => {
		assert.deepEqual(require(path.join(directory, 'dist/jsx.js')).view, {
			tag: 'fragment', props: null,
			children: [{ tag: 'span', props: { title: 'fixture' }, children: ['Hello'] }],
		});
	});

	it('assigns initialized class fields and removes uninitialized type declarations', () => {
		const { instance } = require(path.join(directory, 'dist/fields.js'));
		assert.equal(instance.retained, 11);
		assert.equal(instance.result, 7);
		assert.equal(Object.hasOwn(instance, 'assigned'), false);
	});

	it('copies runtime assets and excludes declarations and dependencies', () => {
		assert.deepEqual(require(path.join(directory, 'dist/config/config-example.js')), { fixture: true });
		assert.deepEqual(require(path.join(directory, 'dist/data/nested/fixture.json')), { copied: true });
		assert.equal(fs.existsSync(path.join(directory, 'dist/data/fixture.d.js')), false);
		assert.equal(fs.existsSync(path.join(directory, 'dist/node_modules')), false);
	});

	it('maps runtime errors back to the original TypeScript source', () => {
		const result = spawnSync(process.execPath, ['--enable-source-maps', '-e',
			'require("./dist/mapped.js").crash();',
		], { cwd: directory, encoding: 'utf8' });
		assert.equal(result.status, 1);
		assert.equal(/mapped\.ts:2:\d+/.test(result.stderr), true, result.stderr);
	});

	it('rejects invalid TypeScript with the source filename', async () => {
		write('invalid.ts', 'export const value: = ;');
		await assert.rejects(build, /invalid\.ts/);
	});

	it('exits unsuccessfully when asynchronous compilation fails', () => {
		const compiler = JSON.stringify(require.resolve('../../tools/build-utils'));
		const entry = JSON.stringify(path.resolve(__dirname, '../../build'));
		const result = spawnSync(process.execPath, ['--unhandled-rejections=warn', '-e',
			`require(${compiler}).transpile = async () => { throw new Error('build failure fixture'); }; require(${entry});`,
		], { encoding: 'utf8' });
		assert.equal(result.status, 1, result.stderr);
		assert.equal(result.stderr.includes('build failure fixture'), true, result.stderr);
	});
});

describe('Incremental build cache', () => {
	let directory;
	let validations;

	function write(file, source) {
		const destination = path.join(directory, file);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.writeFileSync(destination, source);
	}

	function read(file) {
		return fs.readFileSync(path.join(directory, file), 'utf8');
	}

	function stamp(file) {
		const stat = fs.statSync(path.join(directory, file), { bigint: true });
		return { mtime: stat.mtimeNs, ctime: stat.ctimeNs, size: stat.size };
	}

	function load(file) {
		for (const cached of Object.keys(require.cache)) {
			if (cached.startsWith(`${directory}${path.sep}`)) delete require.cache[cached];
		}
		return require(path.join(directory, 'dist', file));
	}

	async function build(force = false, decl = false, validate = () => { validations++; }) {
		const previousDirectory = process.cwd();
		try {
			process.chdir(directory);
			await transpile(force, decl, validate);
		} finally {
			process.chdir(previousDirectory);
		}
	}

	beforeEach(() => {
		directory = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'showdown-build-cache-')));
		validations = 0;
		write('tsconfig.json', JSON.stringify({ compilerOptions: {
			jsx: 'react', jsxFactory: 'UI.one', jsxFragmentFactory: 'UI.Fragment',
			target: 'es2020', module: 'CommonJS', useDefineForClassFields: false,
		} }));
		write('config/config-example.js', 'module.exports = { value: 1 };');
		write('data/value.json', '{"value":1}');
		write('data/fixture.ts', 'export const fixture: number = 1;');
		write('config/fixture.ts', 'export const fixture: number = 1;');
		write('first.ts', `
			import path from 'path';
			export const value: string = path.basename('/fixture') + '1';
		`);
		write('second.ts', `
			export * from './first';
			export const stable: number = 7;
		`);
		write('view.tsx', `
			const UI = { one: () => 1, two: () => 2, Fragment: 'fragment' };
			export const view = <span />;
		`);
	});

	afterEach(() => {
		for (const cached of Object.keys(require.cache)) {
			if (cached.startsWith(`${directory}${path.sep}`)) delete require.cache[cached];
		}
		fs.rmSync(directory, { recursive: true, force: true });
	});

	it('keeps emitted JavaScript and maps untouched and skips validation on a cache hit', async () => {
		await build();
		const js = stamp('dist/first.js');
		const map = stamp('dist/first.js.map');
		await build();
		assert.equal(validations, 1);
		assert.deepEqual(stamp('dist/first.js'), js);
		assert.deepEqual(stamp('dist/first.js.map'), map);
	});

	it('repairs a malformed cache record instead of failing the build', async () => {
		await build();
		write('dist/.build-cache.json', 'null');
		await build();
		assert.equal(validations, 2);
		assert.equal(load('first.js').value, 'fixture1');
		await build();
		assert.equal(validations, 2);
	});

	it('runs a new validator even when the previous build cached a no-op validator', async () => {
		await build(false, false, () => {});
		let checks = 0;
		const validate = () => { checks++; };
		await build(false, false, validate);
		assert.equal(checks, 1);
		await build(false, false, validate);
		assert.equal(checks, 1);
	});

	it('rebuilds one edited entry while preserving unchanged entries and their runtime helpers', async () => {
		await build();
		const unchanged = stamp('dist/second.js');
		write('first.ts', read('first.ts').replace("+ '1'", "+ '2'"));
		await build();
		assert.equal(validations, 2);
		assert.deepEqual(stamp('dist/second.js'), unchanged);
		assert.equal(load('first.js').value, 'fixture2');
		assert.equal(load('second.js').value, 'fixture2');
		assert.equal(load('second.js').stable, 7);
	});

	it('detects same-length source edits even when the modification time is restored', async () => {
		await build();
		const file = path.join(directory, 'first.ts');
		const before = fs.statSync(file);
		write('first.ts', read('first.ts').replace("+ '1'", "+ '3'"));
		fs.utimesSync(file, before.atime, before.mtime);
		await build();
		assert.equal(validations, 2);
		assert.equal(load('first.js').value, 'fixture3');
	});

	it('adds new files and removes stale owned outputs without deleting unrelated output files', async () => {
		await build();
		write('extra.ts', 'export const extra: number = 3;');
		write('data/extra.json', '{"extra":true}');
		write('dist/user-kept.txt', 'keep me');
		fs.unlinkSync(path.join(directory, 'second.ts'));
		fs.unlinkSync(path.join(directory, 'data/value.json'));
		await build();
		assert.equal(load('extra.js').extra, 3);
		assert.deepEqual(JSON.parse(read('dist/data/extra.json')), { extra: true });
		for (const file of ['second.js', 'second.js.map', 'data/value.json']) {
			assert.equal(fs.existsSync(path.join(directory, 'dist', file)), false, file);
		}
		assert.equal(read('dist/user-kept.txt'), 'keep me');
	});

	it('rejects TypeScript and TSX inputs that would overwrite the same emitted file', async () => {
		await build();
		const original = stamp('dist/first.js');
		write('first.tsx', 'export const value = "collision";');
		await assert.rejects(build, error => /\bfirst\.ts\b/.test(error.message) &&
			error.message.includes('first.tsx') && error.message.includes('first.js'));
		assert.deepEqual(stamp('dist/first.js'), original);
	});

	it('keeps replacement outputs when a source is renamed from TypeScript to TSX', async () => {
		await build();
		fs.renameSync(path.join(directory, 'first.ts'), path.join(directory, 'first.tsx'));
		await build();
		assert.equal(validations, 2);
		assert.equal(load('second.js').value, 'fixture1');
		assert.equal(fs.existsSync(path.join(directory, 'dist/first.js.map')), true);
	});

	it('preserves emitted files and cache hits after a case-only source rename', async () => {
		write('extra.ts', 'export const value: number = 11;');
		await build();
		fs.renameSync(path.join(directory, 'extra.ts'), path.join(directory, 'Extra.ts'));
		await build();
		assert.equal(validations, 2);
		assert.equal(load('Extra.js').value, 11);
		assert.equal(fs.existsSync(path.join(directory, 'dist/Extra.js.map')), true);
		const files = fs.readdirSync(path.join(directory, 'dist'));
		assert.equal(files.includes('Extra.js'), true);
		assert.equal(files.includes('extra.js'), false);
		const output = stamp('dist/Extra.js');
		await build();
		assert.equal(validations, 2);
		assert.deepEqual(stamp('dist/Extra.js'), output);
	});

	it('preserves emitted files and cache hits after a case-only parent-directory rename', async () => {
		write('folder/extra.ts', 'export const value: number = 12;');
		await build();
		fs.renameSync(path.join(directory, 'folder'), path.join(directory, 'Folder'));
		await build();
		assert.equal(validations, 2);
		assert.equal(load('Folder/extra.js').value, 12);
		assert.equal(fs.existsSync(path.join(directory, 'dist/Folder/extra.js.map')), true);
		const files = fs.readdirSync(path.join(directory, 'dist'));
		assert.equal(files.includes('Folder'), true);
		assert.equal(files.includes('folder'), false);
		const output = stamp('dist/Folder/extra.js');
		await build();
		assert.equal(validations, 2);
		assert.deepEqual(stamp('dist/Folder/extra.js'), output);
	});

	it('invalidates validation when a new output file appears without a source change', async () => {
		await build();
		write('dist/config/custom-formats.js', 'exports.Formats = [];');
		await build();
		assert.equal(validations, 2);
		assert.equal(read('dist/config/custom-formats.js'), 'exports.Formats = [];');
		await build();
		assert.equal(validations, 2);
	});

	it('revalidates symlinked output targets instead of caching their link metadata', async () => {
		await build();
		write('external-runtime.js', 'module.exports = { value: 1 };');
		fs.symlinkSync(
			path.join(directory, 'external-runtime.js'),
			path.join(directory, 'dist/config/external.js')
		);
		await build();
		assert.equal(validations, 2);
		write('external-runtime.js', 'module.exports = { value: 2 };');
		await build();
		assert.equal(validations, 3);
		assert.equal(load('config/external.js').value, 2);
		await build();
		assert.equal(validations, 4);
	});

	it('rebuilds after a source changes during compilation and is restored during validation', async () => {
		const cache = require('../../tools/build-cache');
		const invalidate = cache.invalidate;
		const original = read('first.ts');
		let restore = true;
		const validate = () => {
			validations++;
			if (restore) {
				write('first.ts', original);
				restore = false;
			}
		};
		cache.invalidate = (...args) => {
			const pending = invalidate(...args);
			write('first.ts', original.replace("+ '1'", "+ '2'"));
			return pending;
		};
		try {
			await build(false, false, validate);
		} finally {
			cache.invalidate = invalidate;
		}
		assert.equal(load('first.js').value, 'fixture2');
		await build(false, false, validate);
		assert.equal(validations, 2);
		assert.equal(load('first.js').value, 'fixture1');
		await build(false, false, validate);
		assert.equal(validations, 2);
	});

	it('repairs output tampering even when size and modification time are restored', async () => {
		await build();
		const original = read('dist/first.js');
		const file = path.join(directory, 'dist/first.js');
		const before = fs.statSync(file);
		write('dist/first.js', original.replace('fixture', 'altered'));
		fs.utimesSync(file, before.atime, before.mtime);
		await build();
		assert.equal(validations, 2);
		assert.equal(read('dist/first.js'), original);
		assert.equal(load('first.js').value, 'fixture1');
	});

	it('repairs missing source maps and runtime helpers', async () => {
		await build();
		fs.unlinkSync(path.join(directory, 'dist/second.js.map'));
		await build();
		assert.equal(validations, 2);
		assert.equal(fs.existsSync(path.join(directory, 'dist/second.js.map')), true);
		const helpers = fs.readdirSync(path.join(directory, 'dist'), { recursive: true })
			.filter(name => name.split(path.sep)[0] === '_virtual' && name.endsWith('.js'));
		assert.equal(helpers.length > 0, true);
		for (const helper of helpers) fs.unlinkSync(path.join(directory, 'dist', helper));
		await build();
		assert.equal(validations, 3);
		assert.equal(fs.existsSync(path.join(directory, 'dist/second.js.map')), true);
		assert.equal(load('second.js').value, 'fixture1');
	});

	it('refreshes copied assets and recompiles after TypeScript configuration changes', async () => {
		await build();
		write('data/value.json', '{"value":2}');
		write('config/config-example.js', 'module.exports = { value: 2 };');
		await build();
		assert.equal(validations, 2);
		assert.equal(JSON.parse(read('dist/data/value.json')).value, 2);
		assert.equal(load('config/config-example.js').value, 2);
		const config = JSON.parse(read('tsconfig.json'));
		config.compilerOptions.jsxFactory = 'UI.two';
		write('tsconfig.json', JSON.stringify(config));
		await build();
		assert.equal(validations, 3);
		assert.equal(load('view.js').view, 2);
	});

	it('forces compilation separately from declaration emission', async () => {
		const compiler = require('../../tools/build-utils');
		const previous = compiler.buildDecls;
		let declarations = 0;
		compiler.buildDecls = () => { declarations++; };
		try {
			await build();
			const original = stamp('dist/first.js');
			await build(true);
			assert.notDeepEqual(stamp('dist/first.js'), original);
			assert.equal(validations, 2);
			assert.equal(declarations, 0);
			await build(false, true);
			assert.equal(declarations, 1);
		} finally {
			compiler.buildDecls = previous;
		}
	});

	it('does not reuse a successful cache after validation fails and the source is restored', async () => {
		await build();
		const original = read('first.ts');
		write('first.ts', original.replace("+ '1'", "+ '2'"));
		await assert.rejects(() => build(false, false, () => {
			throw new Error('validation fixture');
		}), /validation fixture/);
		write('first.ts', original);
		await build();
		assert.equal(validations, 2);
		assert.equal(load('first.js').value, 'fixture1');
	});

	it('prunes a removed source after an intervening compilation failure', async () => {
		await build();
		fs.unlinkSync(path.join(directory, 'second.ts'));
		write('invalid.ts', 'export const value: = ;');
		await assert.rejects(build, /invalid\.ts/);
		fs.unlinkSync(path.join(directory, 'invalid.ts'));
		await build();
		assert.equal(validations, 2);
		assert.equal(fs.existsSync(path.join(directory, 'dist/second.js')), false);
		assert.equal(fs.existsSync(path.join(directory, 'dist/second.js.map')), false);
		assert.equal(load('first.js').value, 'fixture1');
	});

	it('never caches a compilation failure and repairs outputs before accepting a restored source', async () => {
		await build();
		write('invalid.ts', 'export const value: = ;');
		await assert.rejects(build, /invalid\.ts/);
		await assert.rejects(build, /invalid\.ts/);
		assert.equal(validations, 1);
		fs.unlinkSync(path.join(directory, 'invalid.ts'));
		write('dist/first.js', 'module.exports = { value: "stale" };');
		await build();
		assert.equal(validations, 2);
		assert.equal(load('first.js').value, 'fixture1');
	});
});
