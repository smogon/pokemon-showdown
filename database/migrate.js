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
const sqlite = require('sqlite');

if (missing('./database/sqlite.db')) {
	console.log('No SQLite database found. Creating one...');
	fs.writeFileSync('./database/sqlite.db', '');
}

if (fs.readdirSync('./database/migrations/').length) {
	sqlite.open('./sqlite.db').then(function (database) {
		database.migrate({migrationsPath: './database/migrations'});
	});
}
