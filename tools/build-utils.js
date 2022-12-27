"use strict";

const fs = require("fs");
const pathModule = require('path');
const child_process = require("child_process");
const esbuild = require('esbuild');

function shell(cmd, ignoreErrors) {
	try {
		return child_process.execSync(cmd, {
			cwd: pathModule.resolve(__dirname, '..'),
			// don't write to stderr in addition to throwing - just throw
			stdio: [null, null, 'ignore'],
		}).toString();
	} catch (e) {
		if (ignoreErrors) return '';
		throw new Error([e.message, e.stderr, e.stdout].join('\n'));
	}
}

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

const findFilesForPath = path => {
	const out = [];
	const files = fs.readdirSync(path);
	for (const file of files) {
		if (fs.statSync(`${path}/${file}`).isDirectory()) {
			out.push(...findFilesForPath(`${path}/${file}`));
		} else {
			out.push(`${path}/${file}`);
		}
	}
	return out;
};

/** This is for Windows, where grep / etc aren't supported by default. */
const fsTranspile = () => {
	const mainFiles = shell('git ls-files "*.ts" "*.tsx"').split('\n').filter(f => !f.includes('global'));
	for (const file of mainFiles) {
		esbuild.buildSync({
			entryPoints: ['./' + file],
			outdir: './dist',
			outbase: '.',
			format: 'cjs',
			tsconfig: './tsconfig.json',
		});
	}
	const gitignored = ['./server/chat-plugins/private'];
	for (const path of gitignored) {
		if (!fs.existsSync(path)) continue;
		const pathFiles = findFilesForPath(path).filter(
			f => (f.endsWith('.js') || (f.endsWith('.ts') && !f.endsWith('.d.ts'))) && !f.includes('node_modules')
		);
		for (const file of pathFiles) {
			esbuild.buildSync({
				entryPoints: [file],
				outdir: './dist',
				outbase: '.',
				format: 'cjs',
				tsconfig: './tsconfig.json',
			});
		}
	}
};

/**
 * We're retaining support for this because it's more performant (consistently 4sec or less) as opposed to using FS.
 * More speec is desireable, especially on sim3.
*/
const commandTranspile = () => {
	shell(
		`git ls-files "*.ts" "*.tsx" | grep -v global |` +
		'xargs node_modules/.bin/esbuild --log-level=error --outbase=. --outdir=./dist ' +
		`--format=cjs --tsconfig=./tsconfig.json`
	);

	const gitignored = ['./server/chat-plugins/private'];
	for (const path of gitignored) {
		if (fs.existsSync(path)) {
			shell([
				`find ${path}`, `grep "\\.[tj]s\\b"`, `grep -vF ".d.ts"`, `grep -v "node_modules"`, `grep -v global`,
				`xargs node_modules/.bin/esbuild --log-level=error --outbase=${path} --outdir=./dist/${path} ` +
				`--format=cjs --tsconfig=./tsconfig.json`,
			].join(' | '), true);
		}
	}
};

exports.transpile = (decl) => {
	try {
		shell("echo 'test' | grep test");
		commandTranspile();
	} catch {
		fsTranspile();
	}
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
