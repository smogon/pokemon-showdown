"use strict";

const fs = require("fs");
const pathModule = require('path');
const child_process = require("child_process");

function shell(cmd, ignoreErrors) {
	try {
		return child_process.execSync(cmd, {cwd: pathModule.resolve(__dirname, '..')}).toString();
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

const getGrepExecutable = () => {
	try {
		shell('echo "test" | grep test');
	} catch {
		return './tools/grep';
	}
	return 'grep';
};

exports.transpile = (decl) => {
	const grep = getGrepExecutable();
	shell(
		`git ls-files "*.ts" "*.tsx" | ${grep} -v global |` +
		'xargs node_modules/.bin/esbuild --log-level=error --outbase=. --outdir=./dist ' +
		`--format=cjs --tsconfig=./tsconfig.json`
	);

	const gitignored = ['./server/chat-plugins/private'];
	for (const path of gitignored) {
		if (fs.existsSync(path)) {
			shell([
				`find ${path}`, `${grep} "\\.[tj]s\\b"`, `${grep} -vF ".d.ts"`, `${grep} -v "node_modules"`, `${grep} -v global`,
				`xargs node_modules/.bin/esbuild --log-level=error --outbase=${path} --outdir=./dist/${path} ` +
				`--format=cjs --tsconfig=./tsconfig.json`,
			].join(' | '), true);
		}
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
