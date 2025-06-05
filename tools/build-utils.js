"use strict";

const fs = require('fs');
const path = require('path');
const oxc = require('oxc-transform');
const fg = require('fast-glob');
const {execSync} = require('child_process');

/* -------------------------------------------------- helpers */
function copyJSON(dir = 'data') {
	for (const src of fg.sync(`${dir}/**/*.json`)) {
		const dst = path.join('dist', src);
		fs.mkdirSync(path.dirname(dst), {recursive: true});
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

/* -------------------------------------------------- main build */
exports.transpile = (force, emitDecl) => {
	fs.mkdirSync('dist', {recursive: true});

	for (const file of sourceFiles()) {
		const src = fs.readFileSync(file, 'utf8');

		/* --- JS/JSX/TSX → CJS ----------------------------------- */
		const {code, map, errors} = oxc.transform(
			file,
			src,
			{ /* leave declaration generation to tsc */}
		);

		if (errors?.length) {
			console.error(`❌  ${file}`);
			errors.forEach(e => console.error('   ', e));
			if (!force) continue;            // skip emitting JS unless --force set
		}

		const rel = file.replace(/\.[cm]?[jt]sx?$/, '');
		const outJS = path.join('dist', `${rel}.js`);
		fs.mkdirSync(path.dirname(outJS), {recursive: true});
		fs.writeFileSync(outJS, code);
		if (map) fs.writeFileSync(`${outJS}.map`, JSON.stringify(map));
	}

	/* static assets */
	fs.copyFileSync('config/config-example.js', 'dist/config/config-example.js');
	copyJSON();

	/* --- .d.ts passthrough via tsc ----------------------------- */
	if (emitDecl) exports.buildDecls();
};

/* -------------------------------------------------- declaration step */
exports.buildDecls = () => {
	try {
		execSync(
			'npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist',
			{stdio: 'inherit'}
		);
	} catch {
		console.error('Declaration emit failed (JS output is still available).');
	}
};

