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

	[...codeWithoutBlockComments.matchAll(/^export\s+default\s+(\w+);?$/gm)].forEach(match => {
		hasDefaultExport = true;
		defaultExportName = match[1];
	});

	[...codeWithoutBlockComments.matchAll(/^export\s+(const|let|var)\s+(\w+)/gm)].forEach(match => {
		exportedNames.add(match[2]);
	});
	[...codeWithoutBlockComments.matchAll(/^export\s+(?:async\s+)?function\s+(\w+)/gm)].forEach(match => {
		exportedNames.add(match[1]);
	});
	[...codeWithoutBlockComments.matchAll(/^export\s+class\s+(\w+)/gm)].forEach(match => {
		exportedNames.add(match[1]);
	});

	const placeholderLines = Array.from(exportedNames)
		.filter(n => n !== 'default')
		.map(n => `exports.${n} = undefined;`).join('\n');
	if (placeholderLines) {
		if (code.startsWith('"use strict"')) {
			code = code.replace(/(^"use strict";?\s*)/, `$1\n${placeholderLines}\n`);
		} else {
			code = `${placeholderLines}\n${code}`;
		}
	}

	code = code
		.replace(/^import\s+type\s+.*$/gm, '')
		.replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
			"const $1 = require('$2').default || require('$2');")
		.replace(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
			"const $1 = require('$2');")
		.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm, (match, imports, module) => {
			const cleanImports = imports.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!cleanImports.trim()) return '';
			const renamedImports = cleanImports.replace(/(\w+)\s+as\s+(\w+)/g, '$1: $2');
			return `const {${renamedImports}} = require('${module}');`;
		})
		.replace(/^import\s+(\w+)\s*,\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\s*$/gm, (match, defaultImport, namedImports, module) => {
			const cleanImports = namedImports.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			const renamedImports = cleanImports.replace(/(\w+)\s+as\s+(\w+)/g, '$1: $2');
			let result = `const ${defaultImport} = require('${module}').default || require('${module}');`;
			if (cleanImports.trim()) {
				result += `\nconst {${renamedImports}} = require('${module}');`;
			}
			return result;
		})
		.replace(/^import\s+['"]([^'"]+)['"];?\s*$/gm,
			"require('$1');");

	code = code
		.replace(/^export\s*\{\s*\}\s*;?\s*$/gm, '')
		.replace(/^export\s+type\s+.*$/gm, '')
		.replace(/^export\s+interface\s+.*?^}/gms, '')
		.replace(/^interface\s+.*?^}/gms, '')
		.replace(/^type\s+.*?=.*$/gm, '')
		.replace(/^declare\s+.*$/gm, '')
		.replace(/^export\s+declare\s+.*$/gm, '');

	code = code.replace(/^export\s+(const|let|var)\s+(\w+)(\s*:\s*[^=;]+)?;/gm, (match, type, name) => {
		exportedNames.delete(name);
		return match.replace('export ', '') + `\nexports.${name} = ${name};`;
	});

	code = code.replace(/^export\s+(const|let|var)\s+(\w+)\s*=\s*(.+)$/gm, (match, type, name, value) => {
		const trimmed = value.trim();

		if (trimmed.match(/^(-?\d+|'[^']*'|"[^"]*"|true|false|null|undefined);?$/)) {
			exportedNames.delete(name);
			return `${type} ${name} = ${value}\nexports.${name} = ${name};`;
		}

		if ((trimmed.match(/^\[[^\]]*\];?$/) || trimmed.match(/^\{[^}]*\};?$/)) &&
			!trimmed.includes('\n')) {
			exportedNames.delete(name);
			return `${type} ${name} = ${value}\nexports.${name} = ${name};`;
		}

		return `${type} ${name} = ${value}`;
	});

	code = code.replace(/^export\s+(async\s+)?function\s+(\w+)/gm, (match, async, name) => {
		return `${async || ''}function ${name}`;
	});

	code = code.replace(/^export\s+class\s+(\w+)/gm, (match, name) => {
		return `class ${name}`;
	});

	code = code
		.replace(/^export\s+default\s+(async\s+)?function\s+(\w+)?/gm,
			'$1function $2')
		.replace(/^export\s+default\s+class\s+(\w+)?/gm,
			'class $1')
		.replace(/^export\s+default\s+(.+)$/gm, (match, expr) => {
			if (hasDefaultExport && exportedNames.size > 0) {
				return '';
			}
			return 'module.exports = ' + expr + ';';
		})
		.replace(/^export\s+\{([^}]+)\}\s*;?$/gm, (match, names) => {
			const cleanNames = names.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!cleanNames.trim()) return '';
			const exports = cleanNames.split(',').map(name => {
				const parts = name.trim().split(/\s+as\s+/);
				const localName = parts[0].trim();
				const exportedName = parts[1] ? parts[1].trim() : localName;
				return `exports.${exportedName} = ${localName};`;
			}).join('\n');
			return exports;
		})
		.replace(/^export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?$/gm, (match, names, module) => {
			const cleanNames = names.replace(/\s*type\s+\w+\s*,?\s*/g, '').replace(/,\s*$/, '').replace(/^\s*,/, '');
			if (!cleanNames.trim()) return '';
			const reExports = cleanNames.split(',').map(name => {
				const parts = name.trim().split(/\s+as\s+/);
				const importName = parts[0].trim();
				const exportName = parts[1] ? parts[1].trim() : importName;
				return `exports.${exportName} = require('${module}').${importName};`;
			}).join('\n');
			return reExports;
		})
		.replace(/^export\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?$/gm,
			"const $1 = require('$2');\nexports.$1 = $1;")
		.replace(/^export\s+\*\s+from\s+['"]([^'"]+)['"]\s*;?$/gm,
			"Object.assign(exports, require('$1'));");

	code += '\n' + Array.from(exportedNames).map(name => `exports.${name} = ${name};`).join('\n');

	if (hasDefaultExport && defaultExportName) {
		code += `\nexports.default = ${defaultExportName};`;
		code += `\nmodule.exports = exports;`;
	}

	return { code };
}

exports.transpile = (force, emitDecl) => {
	fs.mkdirSync('dist', { recursive: true });

	for (const file of sourceFiles()) {
		const src = fs.readFileSync(file, 'utf8');

		let { code, map, errors } = oxc.transform(
			file,
			src,
			{}
		);

		if (errors?.length) {
			console.error(`❌  ${file}`);
			errors.forEach(e => console.error('   ', e));
			if (!force) continue;
		}

		const transformResult = transformImportsExports(code, file);
		code = transformResult.code;

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
