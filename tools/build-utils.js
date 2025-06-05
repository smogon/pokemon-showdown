"use strict";

const fs = require("fs");
const path = require("path");
const oxc = require("oxc-transform");
const fg = require("fast-glob");
const { execSync } = require("child_process");

function copyJSON(dir = 'data') {
	for (const src of fg.sync(`${dir}/**/*.json`)) {
		const dst = path.join('dist', src);
		fs.mkdirSync(path.dirname(dst), { recursive: true });
		fs.copyFileSync(src, dst);
	}
}

function sourceFiles() {
	return fg.sync([
		'**/*.{ts,tsx,js,jsx}',
		'!dist/**',
		'!node_modules/**',
		'!logs/**',
		'!databases/**',
	]);
}

exports.transpile = (force, emitDecl) => {
	fs.mkdirSync('dist', { recursive: true });

	for (const file of sourceFiles()) {
		const src = fs.readFileSync(file, 'utf8');

		const { code, map, errors } = oxc.transform(
			file,
			src,
			{}
		);

		if (errors?.length) {
			console.error(`❌  ${file}`);
			errors.forEach(e => console.error('   ', e));
			if (!force) continue;
		}

		const rel = file.replace(/\.[cm]?[jt]sx?$/, '');
		const outJS = path.join('dist', `${rel}.js`);
		fs.mkdirSync(path.dirname(outJS), { recursive: true });
		fs.writeFileSync(outJS, code);
		if (map) fs.writeFileSync(`${outJS}.map`, JSON.stringify(map));
	}

	fs.copyFileSync('config/config-example.js', 'dist/config/config-example.js');
	copyJSON();

	// NOTE: replace is asynchronous - add additional replacements for the same path in one call instead of making multiple calls.
	if (emitDecl) exports.buildDecls();
};

exports.buildDecls = () => {
	try {
		execSync(
			'npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist',
			{ stdio: 'inherit' }
		);
	} catch {}
};
