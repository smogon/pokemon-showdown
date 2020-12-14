"use strict";

const {transform} = require("sucrase");
const fs = require("fs");
const path = require("path");

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
		try {
			const files = fs.readdirSync(source + path);
			for (const file of files) {
				if (needsSucrase(source, dest, path + "/" + file)) {
					return true;
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

	if (!fs.existsSync(outDirPath)) {
		fs.mkdirSync(outDirPath);
	}

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

	if (!fs.existsSync(path.join(outDirPath, "sourceMaps"))) {
		fs.mkdirSync(path.join(outDirPath, "sourceMaps"));
	}

	return outArr;
}

exports.sucrase = (force) => (src, out, opts, excludeDirs = []) => {
	try {
		if (!force && src !== "./config" && !needsSucrase(src, out)) {
			return false;
		}
	} catch (e) {}
	const sucraseOptions = {
		transforms: ["typescript", "imports"],
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
};
