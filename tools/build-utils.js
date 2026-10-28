"use strict";

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
// Keep the pinned version's CommonJS interop; upgrades must pass the build compatibility tests.
const { build } = require('rolldown');

const copyOverDataJSON = (file = 'data') => {
	const files = fs.readdirSync(file);
	for (const f of files) {
		if (fs.statSync(`${file}/${f}`).isDirectory()) {
			copyOverDataJSON(`${file}/${f}`);
		} else if (f.endsWith('.json')) {
			fs.copyFileSync(`${file}/${f}`, require('path').resolve('dist', `${file}/${f}`));
		}
	}
};

const shouldBeCompiled = file => {
	if (file.includes('node_modules/')) return false;
	if (file.endsWith('.tsx')) return true;
	if (file.endsWith('.ts')) return !(file.endsWith('.d.ts') || file.includes('global'));
	return false;
};

const findFilesForPath = path => {
	const out = [];
	const files = fs.readdirSync(path);
	for (const file of files) {
		const cur = `${path}/${file}`;
		// HACK: Logs and databases exclusions are a hack. Logs is too big to
		// traverse, databases adds/removes files which can lead to a filesystem
		// race between readdirSync and statSync. Please, at some point someone
		// fix this function to be more robust.
		if (cur.includes('node_modules') || cur.includes("/logs") || cur.includes("/databases")) continue;
		if (fs.statSync(cur).isDirectory()) {
			out.push(...findFilesForPath(cur));
		} else if (shouldBeCompiled(cur)) {
			out.push(cur);
		}
	}
	return out;
};

exports.transpile = async decl => {
	await build({
		input: Object.fromEntries(findFilesForPath('./').map(file => [
			path.relative('.', file).replace(/\.tsx?$/, '').split(path.sep).join('/'), file,
		])),
		// Keep runtime imports and every export intact for require() and hotpatching.
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
			entryFileNames: '[name].js',
			sourcemap: true,
		},
	});
	fs.copyFileSync('./config/config-example.js', './dist/config/config-example.js');
	copyOverDataJSON();

	// NOTE: replace is asynchronous - add additional replacements for the same path in one call instead of making multiple calls.
	if (decl) {
		exports.buildDecls();
	}
};

exports.buildDecls = () => {
	try {
		child_process.execSync(`node ./node_modules/typescript/bin/tsc -p sim`, { stdio: 'inherit' });
	} catch {}
};
