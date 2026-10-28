"use strict";

const fs = require('fs');
const path = require('path');
const { hash } = require('crypto');

const CACHE_FILE = '.build-cache.json';
const CACHE_TEMP_PREFIX = '.build-cache-';
const CACHE_TEMP_PATTERN = /^\.build-cache-\d+-[a-f0-9]+\.tmp$/;
const VERSION = 1;

const isPath = file => typeof file === 'string' && file !== '' && !file.includes('\\') &&
	!file.includes('\0') && !path.posix.isAbsolute(file) && path.posix.normalize(file) === file &&
	file !== '..' && !file.startsWith('../');
const isOutputPath = file => isPath(file) && file !== CACHE_FILE && !CACHE_TEMP_PATTERN.test(file);
const isOwnedPath = file => isOutputPath(file) && (file.endsWith('.js') || file.endsWith('.js.map') ||
	(file.startsWith('data/') && file.endsWith('.json')));
const isHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function hashFile(file, optional = false) {
	try {
		return hash('sha256', fs.readFileSync(file));
	} catch (error) {
		if (optional && error.code === 'ENOENT') return null;
		throw error;
	}
}

function inputSignature(file) {
	const stat = fs.statSync(file, { bigint: true });
	return [String(stat.size), String(stat.mtimeNs), String(stat.ctimeNs)];
}

function statFiles(files) {
	return Object.fromEntries(files.sort().map(file => [file, inputSignature(file)]));
}

function hashFiles(files, previous = {}, previousStats = {}) {
	const hashes = {};
	const stats = {};
	for (const file of files.sort()) {
		stats[file] = inputSignature(file);
		hashes[file] = previous[file] && same(previousStats[file], stats[file]) ? previous[file] : hashFile(file);
	}
	return { hashes, stats };
}

function snapshot(directory = 'dist') {
	try {
		if (fs.lstatSync(directory).isSymbolicLink()) return null;
	} catch (error) {
		if (error.code === 'ENOENT') return {};
		throw error;
	}
	const files = {};
	let symlink = false;
	function visit(folder, prefix) {
		for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
			const name = prefix + entry.name;
			if (!prefix && (name === CACHE_FILE || CACHE_TEMP_PATTERN.test(name))) continue;
			const file = path.join(folder, entry.name);
			const stat = fs.lstatSync(file);
			files[name] = [stat.isDirectory() ? 'd' : stat.isSymbolicLink() ? 'l' : 'f', stat.size, stat.mtimeMs, stat.ctimeMs];
			if (stat.isSymbolicLink()) symlink = true;
			if (stat.isDirectory()) visit(file, `${name}/`);
		}
	}
	visit(directory, '');
	return symlink ? null : files;
}

function read() {
	try {
		const cache = JSON.parse(fs.readFileSync(path.join('dist', CACHE_FILE), 'utf8'));
		if (!isRecord(cache)) return null;
		if (cache.version !== VERSION || !isHash(cache.key)) return null;
		for (const field of ['sources', 'assets']) {
			if (!isRecord(cache[field]) || !Object.entries(cache[field]).every(([file, digest]) => isPath(file) && isHash(digest))) return null;
		}
		if (!isRecord(cache.entries) || !isRecord(cache.outputs) || !isRecord(cache.inputStats)) return null;
		if (!Object.entries(cache.inputStats).every(([file, signature]) => isPath(file) && Array.isArray(signature) &&
			signature.length === 3 && signature.every(value => typeof value === 'string' && /^-?\d+$/.test(value)))) return null;
		if (typeof cache.dirty !== 'boolean') return null;
		if (cache.pending !== undefined && (!Array.isArray(cache.pending) || !cache.pending.every(isOwnedPath))) return null;
		if (!same(Object.keys(cache.sources).sort(), Object.keys(cache.entries).sort())) return null;
		if (!Object.entries(cache.outputs).every(([file, signature]) => isOutputPath(file) && Array.isArray(signature) &&
			['d', 'f', 'l'].includes(signature[0]) && signature.slice(1, 4).length === 3 &&
			signature.slice(1, 4).every(value => typeof value === 'number' && Number.isFinite(value)))) return null;
		if (!Object.entries(cache.entries).every(([source, files]) => Array.isArray(files) &&
			files.includes(source.replace(/\.tsx?$/, '.js')) && files.every(file => isOwnedPath(file) &&
				(file === source.replace(/\.tsx?$/, '.js') || file === source.replace(/\.tsx?$/, '.js.map') || file.startsWith('_virtual/')) &&
				cache.outputs[file]?.[0] === 'f'))) return null;
		return cache;
	} catch (error) {
		if (error instanceof SyntaxError || error.code === 'ENOENT') return null;
		throw error;
	}
}

function writeManifest(record) {
	fs.mkdirSync('dist', { recursive: true });
	const file = path.join('dist', CACHE_FILE);
	const temp = path.join('dist', `${CACHE_TEMP_PREFIX}${process.pid}-${Math.random().toString(16).slice(2)}.tmp`);
	try {
		fs.writeFileSync(temp, JSON.stringify({ version: VERSION, ...record }));
		fs.renameSync(temp, file);
	} finally {
		fs.rmSync(temp, { force: true });
	}
}

function invalidate(previous, sources, assets, key) {
	const record = previous || { key, sources: {}, assets: {}, entries: {}, outputs: {}, inputStats: {} };
	const pending = new Set([...(record.pending || []), ...Object.values(record.entries).flat(), ...Object.keys(record.assets)]);
	for (const file of Object.keys(sources)) {
		const output = file.replace(/\.tsx?$/, '.js');
		pending.add(output);
		pending.add(`${output}.map`);
	}
	for (const file of Object.keys(assets)) pending.add(file);
	const dirty = { ...record, dirty: true, pending: [...pending].sort((a, b) => a.localeCompare(b)) };
	writeManifest(dirty);
	return dirty;
}

function addPending(record, files) {
	record.pending = [...new Set([...record.pending, ...files])].sort((a, b) => a.localeCompare(b));
	writeManifest(record);
}

function save(record) {
	const outputs = snapshot();
	// Symlinked output roots, or entries under symlinked directories, cannot be verified safely.
	if (!outputs || !Object.values(record.entries).every(files => files.every(file => outputs[file]?.[0] === 'f'))) return;
	writeManifest({ ...record, dirty: false, outputs });
}

function prune(previous, entries, assets, helpersOnly = false) {
	const used = new Set([...Object.values(entries).flat(), ...Object.keys(assets)]);
	const old = new Set([...Object.values(previous.entries).flat(), ...Object.keys(previous.assets), ...(previous.pending || [])]);
	for (const file of old) {
		if (file.startsWith('_virtual/') !== helpersOnly) continue;
		if (used.has(file)) continue;
		if (!isOwnedPath(file)) throw new Error(`Invalid cached build output: ${file}`);
		const parts = file.split('/');
		let parent = 'dist';
		let safe = !fs.lstatSync(parent).isSymbolicLink();
		for (const part of parts.slice(0, -1)) {
			parent = path.join(parent, part);
			try {
				if (fs.lstatSync(parent).isSymbolicLink()) safe = false;
			} catch (error) {
				if (error.code !== 'ENOENT') throw error;
				safe = false;
			}
		}
		if (!safe) continue;
		fs.rmSync(path.join('dist', file), { force: true });
		// Remove only empty ancestors of owned outputs, including old casing after directory renames.
		for (let depth = parts.length - 1; depth > 0; depth--) {
			try {
				fs.rmdirSync(path.join('dist', ...parts.slice(0, depth)));
			} catch (error) {
				if (['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(error.code)) break;
				throw error;
			}
		}
	}
}

function key(directories, validate) {
	const config = fs.readFileSync('tsconfig.json', 'utf8');
	// External configs require dependency tracking beyond this build's inputs.
	// Escaped keys/paths are also treated conservatively instead of parsing JSONC ourselves.
	const enabled = !/\b(?:extends|references)\b|\\/.test(config);
	const metadata = ['tsconfig.json', 'package.json', 'package-lock.json', 'build'].map(file => [file, hashFile(file, true)]);
	metadata.push(['cache', hashFile(__filename)], ['compiler', hashFile(require.resolve('rolldown/package.json'))]);
	return {
		enabled,
		key: hash('sha256', JSON.stringify([VERSION, process.cwd(), process.version, process.platform, process.arch,
			metadata, hashFile(require.resolve('./build-utils')), directories.sort(), validate.toString()])),
	};
}

exports.hashFiles = hashFiles;
exports.statFiles = statFiles;
exports.snapshot = snapshot;
exports.same = same;
exports.read = read;
exports.invalidate = invalidate;
exports.save = save;
exports.addPending = addPending;
exports.prune = prune;
exports.key = key;
