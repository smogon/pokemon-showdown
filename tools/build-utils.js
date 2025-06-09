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

function transformImportsExports(code, filename = '') {
	const exportedNames = new Set();
	let hasDefaultExport = false;
	let defaultExportName = '';

	const codeWithoutBlockComments = code.replace(/\/\*[\s\S]*?\*\//g, '');

	for (const m of codeWithoutBlockComments.matchAll(/^export\s+default\s+(\w+);?$/gm)) {
		hasDefaultExport = true;
		defaultExportName = m[1];
	}
	for (const m of codeWithoutBlockComments.matchAll(/^export\s+(?:const|let|var)\s+(\w+)/gm)) {
		exportedNames.add(m[1]);
	}
	for (const m of codeWithoutBlockComments.matchAll(/^export\s+(?:async\s+)?function\s+(\w+)/gm)) {
		exportedNames.add(m[1]);
	}
	for (const m of codeWithoutBlockComments.matchAll(/^export\s+class\s+(\w+)/gm)) {
		exportedNames.add(m[1]);
	}

	const placeholder = Array.from(exportedNames)
		.filter(n => n !== 'default')
		.map(n => `exports.${n} = undefined;`).join('\n');
	if (placeholder) {
		if (code.startsWith('"use strict"')) {
			code = code.replace(/(^"use strict";?\s*)/, `$1\n${placeholder}\n`);
		} else {
			code = `${placeholder}\n${code}`;
		}
	}

	code = code
		.replace(/^import\s+type\s+.*$/gm, '')
		.replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
			"const $1 = require('$2').default || require('$2');")
		.replace(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
			"const $1 = require('$2');")
		.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm, (m, imports, mod) => {
			const clean = imports.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!clean.trim()) return '';
			const renamed = clean.replace(/(\w+)\s+as\s+(\w+)/g, '$1: $2');
			return `let {${renamed}} = require('${mod}');\nprocess.nextTick(() => { ({${renamed}} = require('${mod}')); });`;
		})
		.replace(/^import\s+(\w+)\s*,\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm, (m, def, named, mod) => {
			const clean = named.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			const renamed = clean.replace(/(\w+)\s+as\s+(\w+)/g, '$1: $2');
			let out = `const ${def} = require('${mod}').default || require('${mod}');`;
			if (clean.trim()) {
				out += `\nlet {${renamed}} = require('${mod}');\nprocess.nextTick(() => { ({${renamed}} = require('${mod}')); });`;
			}
			return out;
		})
		.replace(/^import\s+['"]([^'"]+)['"];?\s*$/gm, "require('$1');");

	code = code
		.replace(/^export\s*\{\s*\}\s*;?\s*$/gm, '')
		.replace(/^export\s+type\s+.*$/gm, '')
		.replace(/^export\s+interface\s+.*?^}/gms, '')
		.replace(/^interface\s+.*?^}/gms, '')
		.replace(/^type\s+.*?=.*$/gm, '')
		.replace(/^declare\s+.*$/gm, '')
		.replace(/^export\s+declare\s+.*$/gm, '');

	code = code.replace(/^export\s+(const|let|var)\s+(\w+)(\s*:[^=;]+)?;/gm, (m, t, n) => {
		exportedNames.delete(n);
		return m.replace('export ', '') + `\nexports.${n} = ${n};`;
	});

	code = code.replace(/^export\s+(const|let|var)\s+(\w+)\s*=\s*(.+)$/gm, (m, t, n, v) => {
		const trim = v.trim();
		if (trim.match(/^(-?\d+|'[^']*'|"[^"]*"|true|false|null|undefined);?$/) ||
			((trim.match(/^\[[^\]]*\];?$/) || trim.match(/^\{[^}]*\};?$/)) && !trim.includes('\n'))) {
			exportedNames.delete(n);
			return `${t} ${n} = ${v}\nexports.${n} = ${n};`;
		}
		return `${t} ${n} = ${v}`;
	});

	code = code.replace(/^export\s+(async\s+)?function\s+(\w+)/gm, (m, a, n) => `${a || ''}function ${n}`);
	code = code.replace(/^export\s+class\s+(\w+)/gm, (m, n) => `class ${n}`);

	code = code
		.replace(/^export\s+default\s+(async\s+)?function\s+(\w+)?/gm, '$1function $2')
		.replace(/^export\s+default\s+class\s+(\w+)?/gm, 'class $1')
		.replace(/^export\s+default\s+(.+)$/gm, (m, expr) => {
			if (hasDefaultExport && exportedNames.size > 0) return '';
			return 'module.exports = ' + expr + ';';
		})
		// named re-exports
		.replace(/^export\s+\{([^}]+)\}\s*;?$/gm, (m, names) => {
			const clean = names.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!clean.trim()) return '';
			return clean.split(',').map(p => {
				const [local, ex = local] = p.trim().split(/\s+as\s+/);
				return `exports.${ex} = ${local};`;
			}).join('\n');
		})
		.replace(/^export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?$/gm, (m, names, mod) => {
			const clean = names.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!clean.trim()) return '';
			return clean.split(',').map(p => {
				const [im, ex = im] = p.trim().split(/\s+as\s+/);
				return `exports.${ex} = require('${mod}').${im};`;
			}).join('\n');
		})
		.replace(/^export\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?$/gm,
			"const $1 = require('$2');\nexports.$1 = $1;")
		.replace(/^export\s+\*\s+from\s+['"]([^'"]+)['"]\s*;?$/gm,
			"Object.assign(exports, require('$1'));");

	code += '\n' + Array.from(exportedNames).map(n => `exports.${n} = ${n};`).join('\n');

	if (hasDefaultExport && defaultExportName) {
		code += `\nexports.default = ${defaultExportName};`;
		code += `\nmodule.exports = exports;`;
	}

	return { code };
}

function finalizeExports(code) {
	const mods = [...code.matchAll(/module\.exports\s*=\s*[^;]+;/g)];
	if (mods.length > 1) {
		const last = mods[mods.length - 1].index;
		code = code.replace(/module\.exports\s*=\s*[^;]+;/g, (m, i) => (i === last ? m : ''));
	}

	if (!/exports\.default\s*=/.test(code)) {
		code += '\nexports.default = module.exports;';
	}

	return code;
}

exports.transpile = (force, emitDecl) => {
	fs.mkdirSync('dist', { recursive: true });

	for (const file of sourceFiles()) {
		const src = fs.readFileSync(file, 'utf8');

		let { code, map, errors } = oxc.transform(file, src, {});
		if (errors?.length) {
			console.error(`❌  ${file}`);
			errors.forEach(e => console.error('   ', e));
			if (!force) continue;
		}

		const { code: cjs } = transformImportsExports(code, file);
		code = finalizeExports(cjs);

		const rel = file.replace(/\.[cm]?[jt]sx?$/, '');
		const outJS = path.join('dist', `${rel}.js`);
		fs.mkdirSync(path.dirname(outJS), { recursive: true });
		fs.writeFileSync(outJS, code);
		if (map) fs.writeFileSync(`${outJS}.map`, JSON.stringify(map));
	}

	fs.copyFileSync('config/config-example.js', 'dist/config/config-example.js');
	copyJSON();

	if (emitDecl) exports.buildDecls();
};

exports.buildDecls = () => {
	try {
		execSync('npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist', { stdio: 'inherit' });
	} catch {}
};
