"use strict";

const fs = require("fs");
const child_process = require("child_process");

function shell(cmd, ignoreErrors) {
	try {
		return child_process.execSync(cmd).toString();
	} catch (e) {
		if (ignoreErrors) return '';
		throw new Error([e.message, e.stderr, e.stdout].join('\n'));
	}
}

exports.transpile = (decl) => {
	shell(
		'git ls-files "*.ts" "*.tsx" | grep -v global |' +
		'xargs node_modules/.bin/esbuild --log-level=error --outbase=. --outdir=./dist --format=cjs'
	);

	const gitignored = ['./server/chat-plugins/private'];
	for (const path of gitignored) {
		if (fs.existsSync(path)) {
			shell([
				`find ${path}`, `grep -F ".ts"`, `grep -vF ".d.ts"`, `grep -v global`,
				`xargs node_modules/.bin/esbuild --log-level=error --outbase=${path} --outdir=./dist/${path} --format=cjs`,
			].join(' | '), true);
		}
	}

	// NOTE: replace is asynchronous - add additional replacements for the same path in one call instead of making multiple calls.
	if (decl) {
		exports.buildDecls();
	}
};

exports.buildDecls = () => {
	try {
		child_process.execSync(`node ./node_modules/typescript/bin/tsc -p sim`, {stdio: 'inherit'});
	} catch {}
	for (const file of fs.readdirSync(`./.sim-dist/lib/`)) {
		fs.renameSync(`./.sim-dist/lib/${file}`, `./.lib-dist/${file}`);
	}
	for (const file of fs.readdirSync(`./.sim-dist/sim/`)) {
		fs.renameSync(`./.sim-dist/sim/${file}`, `./.sim-dist/${file}`);
	}
};
