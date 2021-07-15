/**
 * Imports and generates the '@smogon/sets' package.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Run with `node tools/set-import [version]`. If version is not specified,
 * the 'patch' version of the existing package will be bumped. If version is
 * 'minor' or 'monthly', the minor version will be bumped. In general, every
 * month after usage stats are processed this script should be run to update
 * the sets package and bump the minor version. If this script is run in
 * between usage stats updates, the patch version should be bumped. If a
 * breaking change occurs to the output format, the major version must be
 * bumped (with 'major' or 'breaking' as the version argument). The exact
 * version string (eg. '1.2.3') can also be provided. After creating the set
 * import, provided there are no serious errors, the package can be released
 * by running `npm publish` in the `sets/` directory.
 *
 * @license MIT
 */

'use strict';

require('ts-node').register();
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const shell = cmd => child_process.execSync(cmd, {stdio: 'inherit', cwd: path.resolve(__dirname, '../..')});
shell('node build');

function missing(dep) {
	try {
		require.resolve(dep);
		return false;
	} catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') throw err;
		return true;
	}
}

// We depend on smogon as a devDependency in order to get the typing information
if (missing('smogon')) shell(`npm install --no-save smogon`);

// Rather obnoxiously, the TeamValidator used by the importer refers to
// rulesets which rely on Chat.plural to be set up, so we do so here.
global.Chat = {};
Chat.plural = function (num, plural = 's', singular = '') {
	if (num && typeof num.length === 'number') {
		num = num.length;
	} else if (num && typeof num.size === 'number') {
		num = num.size;
	} else {
		num = Number(num);
	}
	return (num !== 1 ? plural : singular);
};

const importer = require('./importer.js');

const SETS = path.resolve(__dirname, 'sets');
(async () => {
	// Clean up old artifacts
	for (const file of fs.readdirSync(SETS)) {
		if (file.startsWith('gen') && file.endsWith('json')) {
			fs.unlinkSync(path.join(SETS, file));
		}
	}
	const imports = [];
	for (const [i, generationData] of (await importer.importAll()).entries()) {
		fs.writeFileSync(path.resolve(SETS, `gen${i + 1}.json`), JSON.stringify(generationData));
		imports.push(`gen${i + 1}`);
		for (const format in generationData) {
			fs.writeFileSync(path.resolve(SETS, `${format}.json`), JSON.stringify(generationData[format]));
			imports.push(format);
		}
	}

	let version = process.argv[2];
	if (!version || version.match(/^[^\d]/)) {
		try {
			const current = require('./sets/package.json').version;
			const [major, minor, patch] = current.split('.');
			if (version === 'major' || version === 'breaking') {
				version = `${Number(major) + 1}.0.0`;
			} else if (version === 'minor' || version === 'monthly') {
				version = `${major}.${Number(minor) + 1}.0`;
			} else {
				version = `${major}.${minor}.${Number(patch) + 1}`;
			}
		} catch (err) {
			console.error("Version required to create '@smogon/sets' package");
			process.exit(1);
		}
	}

	const packagejson = {
		"name": "@smogon/sets",
		"version": version,
		"description": "Set data imported from Smogon.com and used on Pokémon Showdown",
		"main": "build/index.js",
		"unpkg": "build/index.js",
		"types": "build/index.d.ts",
		"repository": "github:smogon/sets",
		"publishConfig": {
			"access": "public",
		},
		"license": "UNLICENSED", // The code/typings are MIT, but not all sources of data fall under MIT
	};
	fs.writeFileSync(path.resolve(SETS, 'package.json'), JSON.stringify(packagejson, null, 2));

	const indexjs = [
		'"use strict";',
		'var JSON;',
		// This hack allows us to require this package in Node and in the browser
		// and have the Node code which uses `require` get stripped on web.
		'if (typeof window === "undefined") {',
		'	JSON = {',
		imports.map(n => `		"${n}": load("./${n}.json")`).join(',\n'),
		'	};',
		'} else {',
		'	JSON = {',
		imports.map(n => `		"${n}": import("./${n}.json")`).join(',\n'),
		'	};',
		'}',
		'function load(path) {',
		'	return Promise.resolve(require(path));',
		'}',
		'function forGen(gen) {',
		// eslint-disable-next-line no-template-curly-in-string
		'	return JSON[`gen${typeof gen === "number" ? gen : gen.num}`];',
		'}',
		'exports.forGen = forGen;',
		'function forFormat(format) {',
		'	return JSON[format];',
		'}',
		'exports.forFormat = forFormat;',
	].join('\n');
	fs.writeFileSync(path.resolve(SETS, 'index.js'), indexjs);
})().catch(err => console.error(err));

