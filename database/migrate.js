'use strict';

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
	child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});
}

if (missing('sqlite')) {
	shell('npm install sqlite');
}

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');

if (!fs.existsSync(path.resolve(__dirname, './sqlite.db'))) {
	console.log('No SQLite database found. Creating one...');
	fs.writeFileSync(path.resolve(__dirname, './sqlite.db'), '');
}

if (fs.readdirSync(path.resolve(__dirname, './migrations/')).length) {
	sqlite.open(path.resolve(__dirname, './sqlite.db')).then(function (database) {
		database.migrate({migrationsPath: path.resolve(__dirname, './migrations')});
	});
}
