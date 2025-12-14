#!/usr/bin/env node
"use strict";

try {
	// fetch was introduced in Node 18, which is EOL,
	// so we'll ask for the most recent "Active LTS" with it to be safe
	// https://nodejs.org/en/about/previous-releases
	fetch;
} catch (e) {
	console.error("We require Node.js version 22 or later; you're using " + process.version);
	process.exit(1);
}

var child_process = require('child_process');
var fs = require('fs');
var decl = ['--decl', 'decl'].includes(process.argv[2]);
var force = decl || ['--force', 'force', '--full', 'full'].includes(process.argv[2]);

process.chdir(__dirname);

function shell(cmd) {
	child_process.execSync(cmd, {stdio: 'inherit'});
}

// Check to make sure the most recently added or updated dependency is installed at the correct version
try {
	require.resolve('ts-chacha20');
} catch (e) {
	console.log('Installing dependencies...');
	shell('npm ci');
}

// Make sure config.js exists. If not, copy it over synchronously from
// config-example.js, since it's needed before we can start the server
try {
	require.resolve('./config/config');
} catch (err) {
	if (err.code !== 'MODULE_NOT_FOUND') throw err; // should never happen

	console.log('config.js does not exist. Creating one with default settings...');
	fs.writeFileSync(
		'config/config.js',
		fs.readFileSync('config/config-example.js')
	);
}

// for some reason, esbuild won't be requirable until a tick has passed
// see https://stackoverflow.com/questions/53270058/node-cant-find-certain-modules-after-synchronous-install
setImmediate(() => {
	require('./tools/build-utils').transpile(force, decl);
});
