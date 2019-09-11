'use strict';

// Needed for FS
global.Config = require('../config/config');
Config.nofswriting = false;

const SQL = require('sql-template-strings').SQL;
const sqlite = require('sqlite');

const FS = require('../.lib-dist/fs').FS;

const PUNISHMENT_FILE = 'config/punishments.tsv';
const ROOM_PUNISHMENT_FILE = 'config/room-punishments.tsv';
const SHAREDIPS_FILE = 'config/sharedips.tsv';
const IPBANLIST_FILE = 'config/ipbans.txt';

const USERID_REGEX = /^[a-z0-9]+$/;

const VALID_DATABASES = {
	'punishments': ['tsv', 'sqlite'],
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
	return console.error(`Invalid arguments specified.\nFormat: node tools/database-converter --database <database> --from <database engine> --to <database engine>.`);
}

if (from === to) {
	return console.error(`Cannot convert to the same database.`);
}

if (!VALID_DATABASES[database]) {
	return console.error(`Invalid database specified.\nValid databases: ${Object.keys(VALID_DATABASES).join(', ')}.`);
}

if (!VALID_DATABASES[database].includes(from) || !VALID_DATABASES[database].includes(to)) {
	return console.error(`Invalid database engine specified.\nValid database engines: ${VALID_DATABASES[database].join(', ')}.`);
}

const PunishmentsConverterSqlite = new class {
	constructor() {
		this.databasePromise = sqlite.open('./database/sqlite.db');
	}
	async appendPunishment(entry, id, table) {
		if (id.charAt(0) === '#') return;
		let sqlStatement;
		if (table === 'punishments') {
			sqlStatement = SQL`
				INSERT INTO punishments(punishType, userid, ips, userids, expireTime, reason, rest)
				VALUES(
					${entry.punishType}, ${id}, ${entry.ips.join(',')}, ${entry.userids.join(',')},
					${entry.expireTime}, ${entry.reason}, ${entry.rest}
				)
			`;
		} else if (table === 'room_punishments') {
			sqlStatement = SQL`
				INSERT INTO room_punishments(punishType, id, ips, userids, expireTime, reason, rest)
				VALUES(
					${entry.punishType}, ${id}, ${entry.ips.join(',')}, ${entry.userids.join(',')},
					${entry.expireTime}, ${entry.reason}, ${entry.rest}
				)
			`;
		}
		const database = await this.databasePromise;
		database.run(sqlStatement);
	}
	async appendSharedIp(ip, note) {
		const sqlStatement = SQL`
			INSERT INTO shared_ips(ip, type, note)
			VALUES(${ip}, 'SHARED', ${note})
		`;
		const database = await this.databasePromise;
		database.run(sqlStatement);
	}
	async appendBanlist(ip) {
		const sqlStatement = SQL`
			INSERT INTO ip_banlist(ip)
			VALUES(${ip})
		`;
		const database = await this.databasePromise;
		database.run(sqlStatement);
	}
	async convert() {
		return Promise.all([this.convertPunishments(), this.convertRoomPunishments(), this.convertSharedIps(), this.convertIpBanlist()]);
	}
	async convertPunishments() {
		const data = await FS(PUNISHMENT_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split('\n')) {
			if (!row || row === '\r') continue;
			const [punishType, id, altKeys, expireTimeStr, reason, ...rest] = row.trim().split('\t');
			if (punishType === "Punishment") continue;
			const expireTime = Number(expireTimeStr);
			if (Date.now() >= expireTime) {
				continue;
			}
			const keys = altKeys.split(',').concat(id);
			const ips = keys.filter(key => !USERID_REGEX.test(key));
			const userids = keys.filter(key => !ips.includes(key));
			await this.appendPunishment({
				ips: ips,
				userids: userids,
				punishType: punishType,
				expireTime: expireTime,
				reason: reason || '',
				rest: rest,
			}, id, 'punishments');
		}
	}
	async convertRoomPunishments() {
		const data = await FS(ROOM_PUNISHMENT_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split('\n')) {
			if (!row || row === '\r') continue;
			const [punishType, id, altKeys, expireTimeStr, reason, ...rest] = row.trim().split("\t");
			if (punishType === "Punishment") continue;
			const expireTime = Number(expireTimeStr);
			if (Date.now() >= expireTime) {
				continue;
			}
			const userid = id.split(':')[1];
			const keys = altKeys.split(',').concat(userid);
			const ips = keys.filter(key => !USERID_REGEX.test(key));
			const userids = keys.filter(key => !ips.includes(key));
			await this.appendPunishment({
				ips: ips,
				userids: userids,
				punishType: punishType,
				expireTime: expireTime,
				reason: reason || '',
				rest: rest,
			}, id, 'room_punishments');
		}
	}
	async convertSharedIps() {
		const data = await FS(SHAREDIPS_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split('\n')) {
			if (!row || row === '\r') continue;
			const [ip, type, note] = row.trim().split('\t');
			if (type !== 'SHARED') continue;
			await this.appendSharedIp(ip, note);
		}
	}
	async convertIpBanlist() {
		const data = await FS(IPBANLIST_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split("\n")) {
			const ip = row.split('#')[0].trim();
			if (!ip) continue;
			await this.appendBanlist(ip);
		}
	}
}();

const PunishmentsConverterTsv = new class {
	renderEntry(entry, id) {
		const keys = entry.ips.concat(entry.userids).join(',');
		const row = [entry.punishType, id, keys, entry.expireTime, entry.reason, ...(entry.rest || '')];
		return row.join('\t') + '\r\n';
	}
	async convert() {
		return Promise.all([this.convertPunishments(), this.convertRoomPunishments(), this.convertSharedIps(), this.convertIpBanlist()]);
	}
	async convertPunishments() {
		const sqlStatement = SQL`SELECT punishType, userid, ips, userids, expireTime, reason FROM punishments`;
		const database = await PunishmentsConverterSqlite.databasePromise;
		const response = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {punishType, userid, ips, userids, expireTime, reason, rest} = row;
			const entry = {
				ips: ips.split(',').filter(ip => ip),
				userids: userids.split(',').filter(userid => userid),
				punishType,
				expireTime,
				reason,
				rest,
			};
			buf += this.renderEntry(entry, userid);
		}
		FS(PUNISHMENT_FILE).writeUpdate(() => buf);
	}
	async convertRoomPunishments() {
		const sqlStatement = SQL`SELECT punishType, id, ips, userids, expireTime, reason FROM room_punishments`;
		const database = await PunishmentsConverterSqlite.databasePromise;
		const response = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {punishType, id, ips, userids, expireTime, reason, rest} = row;
			const entry = {
				ips: ips.split(',').filter(ip => ip),
				userids: userids.split(',').filter(userid => userid),
				punishType,
				expireTime,
				reason,
				rest,
			};
			buf += this.renderEntry(entry, id);
		}
		FS(ROOM_PUNISHMENT_FILE).writeUpdate(() => buf);
	}
	async convertSharedIps() {
		const sqlStatement = SQL`SELECT ip, type, note FROM shared_ips`;
		const database = await PunishmentsConverterSqlite.databasePromise;
		const response = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {ip, type, note} = row;
			if (!ip.includes('.')) continue;
			if (type !== 'SHARED') continue;
			buf += `${ip}\tSHARED\t${note}\r\n`;
		}
		FS(SHAREDIPS_FILE).writeUpdate(() => buf);
	}
	async convertIpBanlist() {
		const sqlStatement = SQL`SELECT ip FROM ip_banlist`;
		const database = await PunishmentsConverterSqlite.databasePromise;
		const response = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {ip} = row;
			buf += ip;
		}
		FS(IPBANLIST_FILE).writeUpdate(() => buf);
	}
}();

class PunishmentsConverter {
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}
	async convert() {
		if (this.to === 'sqlite') {
			const database = await PunishmentsConverterSqlite.databasePromise;
			database.exec(`DELETE FROM punishments; DELETE FROM room_punishments; DELETE FROM shared_ips; DELETE FROM ip_banlist`).then(async () => {
				PunishmentsConverterSqlite.convert();
			}).catch((err) => {
				throw err;
			});
		} else if (this.to === 'tsv') {
			PunishmentsConverterTsv.convert();
		}
	}
}

switch (database) {
case 'punishments':
	new PunishmentsConverter(from, to).convert();
	break;
}
