"use strict";

const fs = require("fs");
const child_process = require("child_process");
const esbuild = require('esbuild');

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
		if (fs.statSync(`${path}/${file}`).isDirectory()) {
			out.push(...findFilesForPath(`${path}/${file}`));
		} else if (shouldBeCompiled(`${path}/${file}`)) {
			out.push(`${path}/${file}`);
		}
	}
	return out;
};

exports.transpile = (decl) => {
	const directories = ['server', 'lib', 'sim', 'data', 'config', 'tools', 'translations'];
	const out = [];
	for (const dir of directories) {
		out.push(...findFilesForPath(dir));
	}
	esbuild.buildSync({
		entryPoints: out,
		outdir: './dist',
		outbase: '.',
		format: 'cjs',
		tsconfig: './tsconfig.json',
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
		child_process.execSync(`node ./node_modules/typescript/bin/tsc -p sim`, {stdio: 'inherit'});
	} catch {}
};
