'use strict';

let child_process = require('child_process');
const fs = require('fs');
const path = require('path');

function missing(dep) {
	try {
		require.resolve(dep);
		return false;
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err;
		return true;
	}
}

function shell(cmd) {
	child_process.execSync(cmd, {stdio: 'inherit', cwd: path.resolve(__dirname, '..')});
}

function sucrase(src, out) {
	shell(`npx sucrase -q ${src} -d ${out} --transforms typescript,imports --enable-legacy-typescript-module-interop`);
}

function replace(file, replacements) {
	fs.lstat(file, (err, stats) => {
		if (err) throw err;
		if (stats.isSymbolicLink()) return;
		if (stats.isFile()) {
			if (!file.endsWith('.js')) return;
			fs.readFile(file, "utf-8", (err, text) => {
				if (err) throw err;
				let anyMatch = false;
				for (const replacement of replacements) {
					anyMatch = anyMatch || text.match(replacement.regex);
					if (anyMatch) text = text.replace(replacement.regex, replacement.replace);
				}
				if (!anyMatch) return;
				fs.writeFile(file, text, err => {
					if (err) throw err;
				});
			});
		} else if (stats.isDirectory()) {
			fs.readdir(file, (err, files) => {
				if (err) throw err;
				for (const f of files) {
					replace(path.join(file, f), replacements);
				}
			});
		}
	});
}

if (missing('sucrase')) {
	console.log('Installing dependencies...');
	shell('npm install --production');
}

module.exports = {missing, shell, sucrase, replace};
