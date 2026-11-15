"use strict";

const fs = require("fs");
const path = require('node:path');
const child_process = require("child_process");
const esbuild = require('esbuild');

const copyOverDataJSON = (outdir = 'dist', file = 'data') => {
	const files = fs.readdirSync(file);
	for (const f of files) {
		if (fs.statSync(`${file}/${f}`).isDirectory()) {
			copyOverDataJSON(outdir, `${file}/${f}`);
		} else if (f.endsWith('.json')) {
			const destination = path.resolve(outdir, file, f);
			fs.mkdirSync(path.dirname(destination), { recursive: true });
			fs.copyFileSync(`${file}/${f}`, destination);
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
		if (file === '.engine-dist') continue;
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

exports.transpile = decl => {
	esbuild.buildSync({
		entryPoints: findFilesForPath('./'),
		outdir: './dist',
		outbase: '.',
		format: 'cjs',
		tsconfig: './tsconfig.json',
		sourcemap: true,
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

exports.transpileEngine = () => {
	const root = fs.realpathSync(path.join(__dirname, '..'));
	const outdir = path.join(root, '.engine-dist');
	// Recreate the output so removed files cannot linger in the engine distribution.
	if (fs.existsSync(outdir)) {
		if (fs.realpathSync(outdir) !== outdir) throw new Error(`Unexpected engine output path: ${outdir}`);
		fs.rmSync(outdir, { recursive: true });
	}
	esbuild.buildSync({
		entryPoints: [
			...findFilesForPath('sim').filter(file => !/^sim\/(examples|tools)\//.test(file)),
			...findFilesForPath('data'),
			'config/formats.ts', 'lib/fs.ts', 'lib/streams.ts', 'lib/utils.ts',
		],
		outdir,
		outbase: '.',
		format: 'cjs',
		tsconfig: './tsconfig.json',
	});
	// The simulator and some formats import this entry point.
	fs.copyFileSync('tools/engine-lib.js', path.join(outdir, 'lib/index.js'));
	copyOverDataJSON(outdir);
	fs.copyFileSync('LICENSE', path.join(outdir, 'LICENSE'));
	const dependencyManifest = require.resolve('ts-chacha20/package.json');
	const dependencyRoot = path.dirname(dependencyManifest);
	const dependencyEntry = path.relative(dependencyRoot, require.resolve('ts-chacha20'));
	for (const file of ['package.json', 'LICENSE', dependencyEntry]) {
		const destination = path.join(outdir, 'node_modules/ts-chacha20', file);
		fs.mkdirSync(path.dirname(destination), { recursive: true });
		fs.copyFileSync(path.join(dependencyRoot, file), destination);
	}
	console.log('Engine built in .engine-dist/');
};
