"use strict";

const {transform} = require("sucrase");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

let force = false;

function needsSucrase(source, dest, path = "") {
	if (path.endsWith(".ts")) {
		if (path.endsWith(".d.ts")) return false;
		const sourceStat = fs.lstatSync(source + path);
		try {
			const destStat = fs.lstatSync(dest + path.slice(0, -2) + "js");
			return sourceStat.ctimeMs > destStat.ctimeMs;
		} catch (e) {
			// dest doesn't exist
			return true;
		}
	}
	if (!path.includes(".")) {
		// probably dir
		if (source === './config' && path) return false;
		try {
			const sourceFiles = fs.readdirSync(source + path);
			for (const file of sourceFiles) {
				if (needsSucrase(source, dest, path + "/" + file)) {
					return true;
				}
			}
			if (path.endsWith('/chat-plugins') || source === './config' || path.includes('/mods/')) {
				const destFiles = fs.readdirSync(dest + path);
				for (const file of destFiles) {
					if (path.endsWith('/config')) console.log(file);
					if (file.endsWith('.js') && !sourceFiles.includes(file.slice(0, -2) + 'ts') && !sourceFiles.includes(file)) {
						fs.unlinkSync(dest + path + "/" + file);
					}
				}
			}
			if (path.endsWith('/mods')) {
				const destFolders = fs.readdirSync(dest + path);
				for (const destFolder of destFolders) {
					if (!destFolder.includes('.') && !sourceFiles.includes(destFolder)) {
						fs.rmSync(dest + path + "/" + destFolder, {recursive: true});
					}
				}
			}
		} catch (e) {
			// not dir
		}
		return false;
	}
	return false;
}

// https://github.com/alangpierce/sucrase/blob/master/src/cli.ts
function findFiles(options) {
	const outDirPath = options.outDirPath;
	const srcDirPath = options.srcDirPath;
	const pathToSource = options.pathToSource || "..";

	const extensions = options.sucraseOptions.transforms.includes("typescript") ?
		[".ts", ".tsx"] :
		[".js", ".jsx"];

	const outArr = [];
	for (const child of fs.readdirSync(srcDirPath)) {
		if (
			["node_modules", ".git"].includes(child) ||
			options.excludeDirs.includes(child)
		) {
			continue;
		}
		const srcChildPath = path.join(srcDirPath, child);
		const outChildPath = path.join(outDirPath, child);
		const pathToSourceChild = path.join(pathToSource, "..");
		if (fs.statSync(srcChildPath).isDirectory()) {
			const innerOptions = {...options};
			innerOptions.srcDirPath = srcChildPath;
			innerOptions.outDirPath = outChildPath;
			innerOptions.pathToSource = pathToSourceChild;
			const innerFiles = findFiles(innerOptions);
			outArr.push(...innerFiles);
		} else if (extensions.some((ext) => srcChildPath.endsWith(ext))) {
			const outPath = outChildPath.replace(
				/\.\w+$/,
				`.${options.outExtension}`
			);
			outArr.push({
				srcPath: srcChildPath,
				outPath,
				pathToSource: pathToSource,
			});
		}
	}

	if (!outArr.length) {
		return outArr;
	}
	fs.mkdirSync(path.join(outDirPath, "sourceMaps"), {recursive: true});

	return outArr;
}

function sucrase(src, out, opts, excludeDirs = []) {
	try {
		if (!force && !needsSucrase(src, out) && src !== "./config") {
			return false;
		}
	} catch {}
	const sucraseOptions = {
		transforms: ["typescript", "imports", "jsx"],
		enableLegacyTypeScriptModuleInterop: true,

		...opts,
	};
	const files = findFiles({
		outDirPath: out,
		srcDirPath: src,
		sucraseOptions: sucraseOptions,
		excludeDirs: ["sourceMaps", ...excludeDirs],
		outExtension: "js",
	});
	for (const file of files) {
		const sucraseOptionsFile = {
			...sucraseOptions,
			sourceMapOptions: {compiledFilename: file.outPath},
			filePath: path.join(file.pathToSource, file.srcPath),
		};
		const code = fs.readFileSync(file.srcPath, "utf-8");
		const transformed = transform(code, sucraseOptionsFile);
		transformed.code += `\n //# sourceMappingURL=sourceMaps/${path.basename(
			file.outPath
		)}.map`;
		fs.writeFileSync(
			path.join(
				path.dirname(file.outPath),
				"sourceMaps",
				path.basename(`${file.outPath}.map`)
			),
			JSON.stringify(transformed.sourceMap)
		);
		fs.writeFileSync(file.outPath, transformed.code);
	}
	return true;
}

function replace(file, replacements) {
	fs.lstat(file, function (err, stats) {
		if (err) throw err;
		if (stats.isSymbolicLink()) return;
		if (stats.isFile()) {
			if (!file.endsWith('.js') && !file.endsWith('.d.ts')) return;
			fs.readFile(file, "utf-8", function (err, text) {
				if (err) throw err;
				let anyMatch = false;
				for (let i = 0; i < replacements.length; i++) {
					anyMatch = anyMatch || text.match(replacements[i].regex);
					if (anyMatch) text = text.replace(replacements[i].regex, replacements[i].replace);
				}
				if (!anyMatch) return;
				fs.writeFile(file, text, function (err) {
					if (err) throw err;
				});
			});
		} else if (stats.isDirectory()) {
			fs.readdir(file, function (err, files) {
				if (err) throw err;
				for (let i = 0; i < files.length; i++) {
					replace(path.join(file, files[i]), replacements);
				}
			});
		}
	});
}

function copyOverDataJSON(file) {
	const source = './data/' + file;
	const dest = './.data-dist/' + file;
	fs.readFile(source, function (err, text) {
		if (err) throw err;
		fs.writeFile(dest, text, function (err) {
			if (err) throw err;
		});
	});
}

exports.transpile = (doForce, decl) => {
	if (doForce) force = true;
	if (sucrase('./config', './.config-dist')) {
		replace('.config-dist', [
			{regex: /(require\(.*?)(lib|sim)/g, replace: `$1.$2-dist`},
		]);
	}

	if (sucrase('./data', './.data-dist')) {
		replace('.data-dist', [
			{regex: /(require\(.*?)(lib|sim)/g, replace: `$1.$2-dist`},
		]);
	}

	if (sucrase('./sim', './.sim-dist')) {
		replace('.sim-dist', [
			{regex: /(require\(.*?)\/(lib|data|config)/g, replace: `$1/.$2-dist`},
			{regex: /(from '.*?)\/(lib|data|config)/g, replace: `$1/.$2-dist`},
		]);
	}

	sucrase('./lib', './.lib-dist');

	if (sucrase('./server', './.server-dist')) {
		replace('.server-dist', [
			{regex: /(require\(.*?)(data|lib|sim)/g, replace: `$1.$2-dist`},
		]);
	}

	sucrase('./translations', './.translations-dist');

	if (sucrase('./tools', './tools', null, ['.', 'sets', 'simulate'])) {
		replace('tools', [
			{regex: /(require\(.*?)(lib|sim|server)/g, replace: `$1.$2-dist`},
		]);
	}

	if (!fs.existsSync('./.data-dist/README.md')) {
		const text = '**NOTE**: This folder contains the compiled output of the `data/` directory.\n' +
			'You should be editing the `.ts` files there and then running `npm run build` or\n' +
			'`./pokemon-showdown` to force these `.js` files to be recreated.\n';
		fs.writeFile('./.config-dist/README.md', text.replace('data/', 'config/'), function () {});
		fs.writeFile('./.data-dist/README.md', text, function () {});
		fs.writeFile('./.sim-dist/README.md', text.replace('data/', 'sim/'), function () {});
		fs.writeFile('./.server-dist/README.md', text.replace('data/', 'server/'), function () {});
		fs.writeFile('./.translations-dist/README.md', text.replace('data/', 'translations/'), function () {});
		fs.writeFile('./.lib-dist/README.md', text.replace('data/', 'lib/'), function () {});
	}

	// sucrase doesn't copy JSON over, so we'll have to do it ourselves
	copyOverDataJSON('bss-factory-sets.json');
	copyOverDataJSON('cap-1v1-sets.json');
	copyOverDataJSON('mods/gen7/factory-sets.json');
	copyOverDataJSON('mods/gen7/bss-factory-sets.json');
	copyOverDataJSON('mods/gen6/factory-sets.json');

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
