/**
 * This script can be used to convert databases from one format to another
 * Format:
 * `node tools/database-converter --database <database> --from <database format> --to <database format>`
 * Usage example:
 * `node tools/database-converter --database punishments --from tsv --to sqlite`
 */

'use strict';

const child_process = require('child_process');
child_process.execSync('node build');

const PunishmentsConverter = require('./punishments-converter').PunishmentsConverter;

/** @type {{[k: string]: string[]}} */
const DATABASES = {
	punishments: ['tsv', 'sqlite'],
};

function parseFlags() {
	const args = process.argv.slice(2);
	const flags = Object.create(null);
	for (const [idx, arg] of args.entries()) {
		if (idx % 2 === 0) {
			flags[arg] = args[idx + 1];
		}
	}
	return flags;
}

const flags = parseFlags();

const database = flags['--database'];
const from = flags['--from'];
const to = flags['--to'];

if (!(database && from && to)) {
	throw new Error(`Invalid arguments specified.\nFormat: node tools/database-converter --database <database> --from <database engine> --to <database engine>.`);
}

if (from === to) {
	throw new Error(`Cannot convert to the same database.`);
}

if (!DATABASES[database]) {
	throw new Error(`Invalid database specified.\nValid databases: ${Object.keys(DATABASES).join(', ')}.`);
}

if (!DATABASES[database].includes(from) || !DATABASES[database].includes(to)) {
	throw new Error(`Invalid database format specified.\nValid database formats: ${DATABASES[database].join(', ')}.`);
}

switch (database) {
case 'punishments':
	new PunishmentsConverter(from, to).convert().catch(err => {
		throw err;
	});
	break;
}
