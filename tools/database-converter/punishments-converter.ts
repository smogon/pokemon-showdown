// Needed for FS
global.Config = {nofswriting: false};

import SQL from 'sql-template-strings';
import * as sqlite from 'sqlite';
import {FS} from '../../lib/fs';

type SQLStatement = import('sql-template-strings').SQLStatement;
type PunishmentEntry = import('../../server/punishments').PunishmentEntry;
type PunishmentsDatabaseResponse = import('../../server/punishments').PunishmentsDatabaseResponse;
type RoomPunishmentsDatabaseResponse = import('../../server/punishments').RoomPunishmentsDatabaseResponse;
type SharedIpsDatabaseResponse = import('../../server/punishments').SharedIpsDatabaseResponse;
type IpBanlistDatabaseResponse = import('../../server/punishments').IpBanlistDatabaseResponse;

const PUNISHMENT_FILE = 'config/punishments.tsv';
const ROOM_PUNISHMENT_FILE = 'config/room-punishments.tsv';
const SHAREDIPS_FILE = 'config/sharedips.tsv';
const IPBANLIST_FILE = 'config/ipbans.txt';

const USERID_REGEX = /^[a-z0-9]+$/;

export class PunishmentsConverter {
	from: string;
	to: string;
	constructor(from: string, to: string) {
		this.from = from;
		this.to = to;
	}
	async convert() {
		if (this.to === 'sqlite') {
			const database = await PunishmentsConverterSqlite.databasePromise;
			database.exec(`DELETE FROM punishments; DELETE FROM room_punishments; DELETE FROM shared_ips; DELETE FROM ip_banlist`).then(async () => {
				// tslint:disable-next-line: no-floating-promises
				PunishmentsConverterSqlite.convert();
			}).catch(err => {
				throw err;
			});
		} else if (this.to === 'tsv') {
			PunishmentsConverterTsv.convert().catch(err => {
				throw err;
			});
		}
	}
}

const PunishmentsConverterSqlite = new class {
	databasePromise: Promise<sqlite.Database>;
	constructor() {
		this.databasePromise = sqlite.open('./database/sqlite.db');
	}
	async appendPunishment(entry: PunishmentEntry, id: string, table: 'punishments' | 'room_punishments') {
		if (id.charAt(0) === '#') return;
		let sqlStatement: SQLStatement;
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
		// tslint:disable-next-line: no-floating-promises
		database.run(sqlStatement!);
	}
	async appendSharedIp(ip: string, note: string) {
		const sqlStatement = SQL`
			INSERT INTO shared_ips(ip, type, note)
			VALUES(${ip}, 'SHARED', ${note})
		`;
		const database = await this.databasePromise;
		// tslint:disable-next-line: no-floating-promises
		database.run(sqlStatement);
	}
	async appendBanlist(ip: string) {
		const sqlStatement = SQL`
			INSERT INTO ip_banlist(ip)
			VALUES(${ip})
		`;
		const database = await this.databasePromise;
		// tslint:disable-next-line: no-floating-promises
		database.run(sqlStatement);
	}
	async convert() {
		return Promise.all([
			this.convertPunishments(), this.convertRoomPunishments(), this.convertSharedIps(), this.convertIpBanlist()]
		);
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
			const userids = keys.filter(key => !ips.includes(key)) as ID[];
			await this.appendPunishment({
				ips,
				userids,
				punishType,
				expireTime,
				reason: reason || '',
				rest,
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
			const userids = keys.filter(key => !ips.includes(key)) as ID[];
			await this.appendPunishment({
				ips,
				userids,
				punishType,
				expireTime,
				reason: reason || '',
				rest,
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
	renderEntry(entry: PunishmentEntry, id: string) {
		const keys = entry.ips.concat(entry.userids).join(',');
		const row = [entry.punishType, id, keys, entry.expireTime, entry.reason, ...(entry.rest || '')];
		return row.join('\t') + '\r\n';
	}
	async convert() {
		return Promise.all([
			this.convertPunishments(), this.convertRoomPunishments(), this.convertSharedIps(), this.convertIpBanlist(),
		]);
	}
	async convertPunishments() {
		const sqlStatement = SQL`SELECT punishType, userid, ips, userids, expireTime, reason FROM punishments`;
		const database = await PunishmentsConverterSqlite.databasePromise;
		const response: PunishmentsDatabaseResponse = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {punishType, userid, ips, userids, expireTime, reason, rest} = row;
			const entry = {
				ips: ips.split(',').filter(ip => ip),
				userids: userids.split(',').filter(uid => uid) as ID[],
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
		const response: RoomPunishmentsDatabaseResponse = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {punishType, id, ips, userids, expireTime, reason, rest} = row;
			const entry = {
				ips: ips.split(',').filter(ip => ip),
				userids: userids.split(',').filter(userid => userid) as ID[],
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
		const response: SharedIpsDatabaseResponse = await database.all(sqlStatement);
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
		const response: IpBanlistDatabaseResponse = await database.all(sqlStatement);
		let buf = '';
		for (const row of response) {
			const {ip} = row;
			buf += ip;
		}
		FS(IPBANLIST_FILE).writeUpdate(() => buf);
	}
}();
