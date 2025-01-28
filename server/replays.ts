/**
 * Code for uploading and managing replays.
 *
 * Ported to TypeScript by Annika and Mia.
 */
import {SQL, PGDatabase} from '../lib/database';
import * as crypto from 'crypto';

export const replaysDB = Config.replaysdb ? new PGDatabase(Config.replaysdb) : null!;

export const replays = replaysDB?.getTable<
ReplayRow
>('replays', 'id');

export const replayPlayers = replaysDB?.getTable<{
	playerid: string,
	formatid: string,
	id: string,
	rating: number | null,
	uploadtime: number,
	private: ReplayRow['private'],
	password: string | null,
	format: string,
	/** comma-delimited player names */
	players: string,
}>('replayplayers');

// must be a type and not an interface to qualify as an SQLRow
// eslint-disable-next-line
export type ReplayRow = {
	id: string,
	format: string,
	/** player names delimited by `,`; starting with `!` denotes that player wants the replay private */
	players: string,
	log: string,
	inputlog: string | null,
	uploadtime: number,
	views: number,
	formatid: string,
	rating: number | null,
	/**
	 * 0 = public
	 * 1 = private (with or without password)
	 * 2 = NOT USED; ONLY USED IN PREPREPLAY
	 * 3 = deleted
	 * 10 = autosaved
	 */
	private: 0 | 1 | 2 | 3 | 10,
	password: string | null,
};
type Replay = Omit<ReplayRow, 'formatid' | 'players' | 'password' | 'views'> & {
	players: string[],
	views?: number,
	password?: string | null,
};

export const Replays = new class {
	db = replaysDB as unknown;
	replaysTable = replays as unknown;
	replayPlayersTable = replayPlayers as unknown;
	readonly passwordCharacters = '0123456789abcdefghijklmnopqrstuvwxyz';

	toReplay(this: void, row: ReplayRow) {
		const replay: Replay = {
			...row,
			players: row.players.split(',').map(player => player.startsWith('!') ? player.slice(1) : player),
		};
		if (!replay.password && replay.private === 1) replay.private = 2;
		return replay;
	}
	toReplays(this: void, rows: ReplayRow[]) {
		return rows.map(row => Replays.toReplay(row));
	}

	toReplayRow(this: void, replay: Replay) {
		const formatid = toID(replay.format);
		const replayData: ReplayRow = {
			password: null,
			views: 0,
			...replay,
			players: replay.players.join(','),
			formatid,
		};
		if (replayData.private === 1 && !replayData.password) {
			replayData.password = Replays.generatePassword();
		} else {
			if (replayData.private === 2) {
				replayData.private = 1;
				replayData.password = null;
			}
		}
		return replayData;
	}

	async add(replay: Replay) {
		// obviously upsert exists but this is the easiest way when multiple things need to be changed
		const replayData = this.toReplayRow(replay);
		try {
			await replays.insert(replayData);
			for (const playerName of replay.players) {
				await replayPlayers.insert({
					playerid: toID(playerName),
					formatid: replayData.formatid,
					id: replayData.id,
					rating: replayData.rating,
					uploadtime: replayData.uploadtime,
					private: replayData.private,
					password: replayData.password,
					format: replayData.format,
					players: replayData.players,
				});
			}
		} catch (e: any) {
			if (e?.routine !== 'NewUniquenessConstraintViolationError') throw e;
			await replays.update(replay.id, {
				log: replayData.log,
				inputlog: replayData.inputlog,
				rating: replayData.rating,
				private: replayData.private,
				password: replayData.password,
			});
			await replayPlayers.updateAll({
				rating: replayData.rating,
				private: replayData.private,
				password: replayData.password,
			})`WHERE id = ${replay.id}`;
		}
		return replayData.id + (replayData.password ? `-${replayData.password}pw` : '');
	}

	async get(id: string): Promise<Replay | null> {
		const replayData = await replays.get(id);
		if (!replayData) return null;

		await replays.update(replayData.id, {views: SQL`views + 1`});

		return this.toReplay(replayData);
	}

	async edit(replay: Replay) {
		const replayData = this.toReplayRow(replay);
		await replays.update(replay.id, {private: replayData.private, password: replayData.password});
	}

	generatePassword(length = 31) {
		let password = '';
		for (let i = 0; i < length; i++) {
			password += this.passwordCharacters[crypto.randomInt(0, this.passwordCharacters.length - 1)];
		}

		return password;
	}

	search(args: {
		page?: number, isPrivate?: boolean, byRating?: boolean,
		format?: string, username?: string, username2?: string,
	}): Promise<Replay[]> {
		const page = args.page || 0;
		if (page > 100) return Promise.resolve([]);

		let limit1 = 50 * (page - 1);
		if (limit1 < 0) limit1 = 0;

		const isPrivate = args.isPrivate ? 1 : 0;

		const format = args.format ? toID(args.format) : null;

		if (args.username) {
			const order = args.byRating ? SQL`ORDER BY rating DESC` : SQL`ORDER BY uploadtime DESC`;
			const userid = toID(args.username);
			if (args.username2) {
				const userid2 = toID(args.username2);
				if (format) {
					return replays.query()`SELECT 
							p1.uploadtime AS uploadtime, p1.id AS id, p1.format AS format, p1.players AS players, 
							p1.rating AS rating, p1.password AS password, p1.private AS private 
						FROM replayplayers p1 INNER JOIN replayplayers p2 ON p2.id = p1.id 
						WHERE p1.playerid = ${userid} AND p1.formatid = ${format} AND p1.private = ${isPrivate}
							AND p2.playerid = ${userid2} 
						${order} LIMIT ${limit1}, 51;`.then(this.toReplays);
				} else {
					return replays.query()`SELECT 
							p1.uploadtime AS uploadtime, p1.id AS id, p1.format AS format, p1.players AS players, 
							p1.rating AS rating, p1.password AS password, p1.private AS private 
						FROM replayplayers p1 INNER JOIN replayplayers p2 ON p2.id = p1.id 
						WHERE p1.playerid = ${userid} AND p1.private = ${isPrivate}
							AND p2.playerid = ${userid2} 
						${order} LIMIT ${limit1}, 51;`.then(this.toReplays);
				}
			} else {
				if (format) {
					return replays.query()`SELECT uploadtime, id, format, players, rating, password FROM replayplayers 
						WHERE playerid = ${userid} AND formatid = ${format} AND private = ${isPrivate} 
						${order} LIMIT ${limit1}, 51;`.then(this.toReplays);
				} else {
					return replays.query()`SELECT uploadtime, id, format, players, rating, password FROM replayplayers 
						WHERE playerid = ${userid} private = ${isPrivate} 
						${order} LIMIT ${limit1}, 51;`.then(this.toReplays);
				}
			}
		}

		if (args.byRating) {
			return replays.query()`SELECT uploadtime, id, format, players, rating, password 
				FROM replays 
				WHERE private = ${isPrivate} AND formatid = ${format} ORDER BY rating DESC LIMIT ${limit1}, 51`
				.then(this.toReplays);
		} else {
			return replays.query()`SELECT uploadtime, id, format, players, rating, password 
				FROM replays 
				WHERE private = ${isPrivate} AND formatid = ${format} ORDER BY uploadtime DESC LIMIT ${limit1}, 51`
				.then(this.toReplays);
		}
	}

	fullSearch(term: string, page = 0): Promise<Replay[]> {
		if (page > 0) return Promise.resolve([]);

		const patterns = term.split(',').map(subterm => {
			const escaped = subterm.replace(/%/g, '\\%').replace(/_/g, '\\_');
			return `%${escaped}%`;
		});
		if (patterns.length !== 1 && patterns.length !== 2) return Promise.resolve([]);

		const secondPattern = patterns.length >= 2 ? SQL`AND log LIKE ${patterns[1]} ` : undefined;

		return replays.query()`SELECT /*+ MAX_EXECUTION_TIME(10000) */ 
			uploadtime, id, format, players, rating FROM ps_replays 
			WHERE private = 0 AND log LIKE ${patterns[0]} ${secondPattern}
			ORDER BY uploadtime DESC LIMIT 10;`.then(this.toReplays);
	}

	recent() {
		return replays.selectAll(
			SQL`uploadtime, id, format, players, rating`
		)`WHERE private = 0 ORDER BY uploadtime DESC LIMIT 50`.then(this.toReplays);
	}
};

export default Replays;
