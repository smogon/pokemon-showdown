"use strict";

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const cache = require('./build-cache');

const shouldBeCompiled = file => {
	if (file.endsWith('.tsx')) return true;
	if (file.endsWith('.ts')) return !(file.endsWith('.d.ts') || file.includes('global'));
	return false;
};

function findInputs() {
	const sources = [];
	const assets = ['config/config-example.js'];
	const directories = [];
	function visit(directory, ancestors) {
		const real = fs.realpathSync(directory);
		if (ancestors.has(real)) return;
		const parents = new Set([...ancestors, real]);
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			const file = path.posix.join(directory, entry.name);
			if (file === '.git' || file === 'dist' || file.includes('node_modules') ||
				`./${file}`.includes('/logs') || `./${file}`.includes('/databases')) continue;
			const directoryEntry = entry.isDirectory() || (entry.isSymbolicLink() && fs.statSync(file).isDirectory());
			if (directoryEntry) {
				directories.push(file);
				visit(file, parents);
			} else if (shouldBeCompiled(file)) {
				sources.push(file);
			} else if (file.startsWith('data/') && file.endsWith('.json')) {
				assets.push(file);
			}
		}
	}
	visit('.', new Set());
	const outputs = new Map();
	for (const source of sources) {
		const output = source.replace(/\.tsx?$/, '.js');
		if (outputs.has(output)) throw new Error(`Build inputs ${outputs.get(output)} and ${source} both emit ${output}`);
		outputs.set(output, source);
	}
	return { sources, assets, directories };
}

function getEntries(result, sources) {
	const outputs = new Map(result.output.map(output => [output.fileName, output]));
	const entries = {};
	for (const source of sources) {
		const filename = source.replace(/\.tsx?$/, '.js');
		if (outputs.get(filename)?.type !== 'chunk') throw new Error(`Missing compiled output for ${source}`);
		const files = new Set();
		function add(file) {
			if (files.has(file)) return;
			files.add(file);
			if (outputs.has(`${file}.map`)) files.add(`${file}.map`);
			for (const imported of outputs.get(file)?.imports || []) {
				if (outputs.has(imported)) add(imported);
			}
		}
		add(filename);
		entries[source] = [...files].sort((a, b) => a.localeCompare(b));
	}
	return entries;
}

/**
 * @param {boolean} [force]
 * @param {boolean} [decl]
 * @param {() => void | Promise<void>} [validate]
 */
exports.transpile = async (force = false, decl = false, validate = () => {}) => {
	const inputs = findInputs();
	const previous = cache.read();
	const sourceState = cache.hashFiles(inputs.sources, previous?.sources, previous?.inputStats);
	const assetState = cache.hashFiles(inputs.assets, previous?.assets, previous?.inputStats);
	const sources = sourceState.hashes;
	const assets = assetState.hashes;
	const inputStats = { ...sourceState.stats, ...assetState.stats };
	const { key, enabled } = cache.key(inputs.directories, validate);
	const outputsMatch = previous && cache.same(previous.outputs, cache.snapshot());
	const reusable = enabled && previous && !previous.dirty && previous.key === key && outputsMatch;
	const full = force || decl || !reusable;
	if (!force && !decl && reusable && cache.same(previous.sources, sources) && cache.same(previous.assets, assets)) {
		if (!cache.same(previous.inputStats, inputStats)) {
			cache.save({ key, sources, assets, entries: previous.entries, inputStats });
		}
		return;
	}

	// A failed compile or validation must never leave a successful cache record behind.
	const pending = cache.invalidate(previous, sources, assets, key);
	const changed = inputs.sources.filter(file => full || previous.sources[file] !== sources[file]);
	let entries = full ? {} : { ...previous.entries };
	for (const file of Object.keys(entries)) {
		if (!(file in sources)) delete entries[file];
	}
	// Prune before writing: on case-insensitive filesystems an old name can alias its replacement.
	const plannedEntries = { ...entries };
	for (const file of changed) {
		const output = file.replace(/\.tsx?$/, '.js');
		plannedEntries[file] = [output, `${output}.map`];
	}
	cache.prune(pending, plannedEntries, assets);
	if (changed.length) {
		// Keep the pinned version's CommonJS interop; load native code only for actual compilation.
		const { build } = require('rolldown');
		const result = await build({
			input: Object.fromEntries(changed.map(file => [file.replace(/\.tsx?$/, ''), `./${file}`])),
			external: /.*/,
			treeshake: false,
			platform: 'node',
			tsconfig: './tsconfig.json',
			checks: { eval: false }, // The REPL deliberately uses direct eval; files are kept separate.
			output: {
				dir: './dist',
				format: 'cjs',
				exports: 'named',
				esModule: true,
				strict: true,
				preserveModules: true,
				preserveModulesRoot: process.cwd(),
				// Changed subsets may need different helpers. Never overwrite helpers used by unchanged entries.
				entryFileNames: chunk => chunk.isEntry ? '[name].js' : '[name]-[hash].js',
				sourcemap: true,
			},
		});
		cache.addPending(pending, result.output.map(output => output.fileName));
		entries = { ...entries, ...getEntries(result, changed) };
	}
	for (const file of inputs.assets) {
		if (!full && previous.assets[file] === assets[file]) continue;
		const output = path.join('dist', file);
		fs.mkdirSync(path.dirname(output), { recursive: true });
		fs.copyFileSync(file, output);
	}
	if (decl) exports.buildDecls();
	await validate();
	if (enabled) {
		// The native compiler reads files itself; do not cache a build whose inputs changed in flight.
		const latest = findInputs();
		const stable = cache.same(Object.keys(sources), latest.sources.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)) &&
			cache.same(Object.keys(assets), latest.assets.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)) && cache.key(latest.directories, validate).key === key &&
			cache.same(inputStats, { ...cache.statFiles(latest.sources), ...cache.statFiles(latest.assets) });
		if (stable) cache.save({ key, sources, assets, entries, inputStats });
	}
};

exports.buildDecls = () => {
	try {
		child_process.execSync(`node ./node_modules/typescript/bin/tsc -p sim`, { stdio: 'inherit' });
	} catch {}
};
