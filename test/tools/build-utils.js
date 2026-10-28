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
		directory = fs.mkdtempSync(path.join(os.tmpdir(), 'showdown-build-'));
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
