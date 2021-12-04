/**
 * Neural net chat'filters'.
 * These are in a separate file so that they don't crash the other filters.
 * (issues with globals, etc)
 * We use Google's Perspective API to classify messages.
 * @see https://perspectiveapi.com/
 * by Mia.
 * @author mia-pi-git
 */

import {FS, Utils, Net, ProcessManager, Repl} from '../../lib';
import {Config} from '../config-loader';
import {toID} from '../../sim/dex-data';

const WHITELIST = ["mia"];
// 20m. this is mostly here so we can use Monitor.slow()
const PM_TIMEOUT = 20 * 60 * 1000;
const ATTRIBUTES = {
	"SEVERE_TOXICITY": {},
	"TOXICITY": {},
	"IDENTITY_ATTACK": {},
	"INSULT": {},
	"PROFANITY": {},
	"THREAT": {},
};

export const cache: {
	[roomid: string]: {[userid: string]: number} & {
		staffNotified?: boolean,
		claimed?: ID,
	},
} = global.Chat?.oldPlugins['abuse-monitor']?.cache || {};

for (const k in cache) {
	const entry = cache[k] as any;
	if (entry.flags) delete entry.flags;
	if (entry.users) {
		cache[k] = {...entry.users, staffNotified: entry.notified};
	}
}

const defaults: FilterSettings = {
	threshold: 4,
	minScore: 0.65,
	specials: {
		THREAT: {0.96: 'MAXIMUM'},
		IDENTITY_ATTACK: {0.8: 2},
		SEVERE_TOXICITY: {0.8: 2},
	},
};

export const settings: FilterSettings = (() => {
	try {
		// accounting for data changes -
		// make sure we do have the default data in case it's not in the stored data
		return {...defaults, ...JSON.parse(FS('config/chat-plugins/nf.json').readSync())};
	} catch (e: any) {
		if (e.code !== "ENOENT") throw e;
		return defaults;
	}
})();

interface FilterSettings {
	disabled?: boolean;
	threshold: number;
	minScore: number;
	specials: {[k: string]: {[k: number]: number | "MAXIMUM"}};
}

export interface PerspectiveRequest {
	languages: string[];
	requestedAttributes: AnyObject;
	comment: {text: string};
}

export interface PMResult {
	score: number;
	flags: string[];
}

export async function classify(text: string) {
	const request: PerspectiveRequest = {
		// todo - support 'es', 'it', 'pt', 'fr' - use user.language? room.settings.language...?
		languages: ['en'],
		requestedAttributes: ATTRIBUTES,
		comment: {text},
	};
	try {
		const raw = await Net(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`).post({
			query: {
				key: Config.perspectiveKey,
			},
			body: JSON.stringify(request),
			headers: {
				'Content-Type': "application/json",
			},
			timeout: 10 * 1000, // 10s
		});
		const data = JSON.parse(raw);
		if (data.error) throw new Error(data.message);
		const result: {[k: string]: number} = {};
		for (const k in data.attributeScores) {
			const score = data.attributeScores[k];
			result[k] = score.summaryScore.value;
		}
		return result;
	} catch (e) {
		Monitor.crashlog(e, 'A Perspective API request', {request: JSON.stringify(request)});
		return null;
	}
}

export const PM = new ProcessManager.QueryProcessManager<{comment: string}, PMResult>(module, async ({comment}) => {
	const now = Date.now();
	const result = await classify(comment);
	if (!result) return {score: 0, flags: []}; // crash. logged already.
	const delta = Date.now() - now;
	if (delta > 1000) {
		Monitor.slow(`[Abuse Monitor] ${delta}ms - ${JSON.stringify({comment})}`);
	}
	let score = 0;
	const flags = new Set<string>();
	for (const type in result) {
		const data = result[type];
		if (settings.minScore && data < settings.minScore) continue;
		const curScore = score;
		if (settings.specials[type]) {
			for (const k in settings.specials[type]) {
				if (data < Number(k)) continue;
				const num = settings.specials[type][k];
				if (num === 'MAXIMUM') {
					score = settings.threshold;
				} else {
					if (num > score) score = num;
				}
			}
		}
		if (settings.minScore) {
			// min score ensures that if a category is above that minimum score, they will get
			// at least a point.
			// we previously ensured that this was above minScore if set, so this is fine
			if (score < 1) score = 1;
		}
		if (score !== curScore) flags.add(type);
	}
	return {score, flags: [...flags]};
}, PM_TIMEOUT, message => {
	if (message.startsWith('SLOW\n')) {
		Monitor.slow(message.slice(5));
	}
});

if (!PM.isParentProcess) {
	// This is a child process!
	global.Config = Config;
	global.Monitor = {
		crashlog(error: Error, source = 'An abuse monitor child process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(text: string) {
			process.send!(`CALLBACK\nSLOW\n${text}`);
		},
	};
	global.toID = toID;
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A netfilter child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start(`abusemonitor-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(Config.netfilterprocesses || 1);
}

export const chatfilter: Chat.ChatFilter = function (message, user, room) {
	if (!room?.battle?.rated || settings.disabled || cache[room.roomid]?.staffNotified) return;
	// startsWith('!') - broadcasting command, ignore it.
	if (!Config.perspectiveKey || message.startsWith('!')) return;

	const roomid = room.roomid;
	void (async () => {
		const {score, flags} = await PM.query({comment: message});
		if (score) {
			if (!cache[roomid]) cache[roomid] = {};
			if (!cache[roomid][user.id]) cache[roomid][user.id] = 0;
			cache[roomid][user.id] += score;
			let hitThreshold = 0;
			if (cache[roomid][user.id] >= settings.threshold) {
				cache[roomid].staffNotified = true;
				notifyStaff();
				hitThreshold = 1;
				void room?.uploadReplay?.(user, this.connection, "forpunishment");
			}
			await Chat.database.run(
				'INSERT INTO perspective_logs (userid, message, score, flags, roomid, time, hit_threshold) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[user.id, message, score, Utils.sortBy(flags).join(','), roomid, Date.now(), hitThreshold]
			);
		}
	})();
};
// to avoid conflicts with other filters
chatfilter.priority = -100;


export const handlers: Chat.Handlers = {
	onRoomDestroy(roomid) {
		if (cache[roomid]) delete cache[roomid];
	},
	onRoomClose(roomid) {
		if (!roomid.startsWith('view-abusemonitor-view')) return;
		const targetId = roomid.slice('view-abusemonitor-view-'.length);
		if (cache[targetId]) {
			delete cache[targetId].claimed;
			notifyStaff();
		}
	},
};

function getFlaggedRooms() {
	return Object.keys(cache).filter(roomid => cache[roomid].staffNotified);
}

function saveSettings() {
	FS('config/chat-plugins/nf.json').writeUpdate(() => JSON.stringify(settings));
}

export function notifyStaff() {
	const staffRoom = Rooms.get('staff');
	if (staffRoom) {
		// staffRoom.add(`|uhtml|abusemonitor|${buf}`).update();
		Chat.refreshPageFor('abusemonitor-flagged', staffRoom);
	}
}

function checkAccess(context: Chat.CommandContext | Chat.PageContext) {
	if (!WHITELIST.includes(context.user.id)) context.checkCan('bypassall');
}

export const commands: Chat.ChatCommands = {
	am: 'abusemonitor',
	abusemonitor: {
		''() {
			return this.parse('/join view-abusemonitor-flagged');
		},
		async test(target, room, user) {
			checkAccess(this);
			const text = target.trim();
			if (!text) return this.parse(`/help abusemonitor`);
			this.runBroadcast();
			const {score, flags} = await PM.query({comment: text});
			this.sendReplyBox(
				`Score for "${text}": ${score}<br />` +
				`Flags: ${flags.join(', ')}`
			);
		},
		toggle(target) {
			checkAccess(this);
			if (this.meansYes(target)) {
				if (!settings.disabled) return this.errorReply(`The abuse monitor is already enabled.`);
				settings.disabled = false;
			} else if (this.meansNo(target)) {
				if (settings.disabled) return this.errorReply(`The abuse monitor is already disabled.`);
				settings.disabled = true;
			} else {
				return this.errorReply(`Invalid setting. Must be 'on' or 'off'.`);
			}
			saveSettings();
			this.privateGlobalModAction(`${this.user.name} ${!settings.disabled ? 'enabled' : 'disabled'} the abuse monitor.`);
			this.globalModlog('ABUSEMONITOR', null, !settings.disabled ? 'enable' : 'disable');
		},
		threshold(target) {
			checkAccess(this);
			if (!target) {
				return this.sendReply(`The current abuse monitor threshold is ${settings.threshold}.`);
			}
			const num = parseInt(target);
			if (isNaN(num)) {
				this.errorReply(`Invalid number: ${target}`);
				return this.parse(`/help abusemonitor`);
			}
			if (settings.threshold === num) {
				return this.errorReply(`The abuse monitor threshold is already ${num}.`);
			}
			settings.threshold = num;
			saveSettings();
			this.privateGlobalModAction(`${this.user.name} set the abuse monitor trigger threshold to ${num}.`);
			this.globalModlog('ABUSEMONITOR THRESHOLD', null, `${num}`);
			this.sendReply(
				`|html|Remember to use <code>/am respawn</code> to deploy the settings to the child process.`
			);
		},
		resolve(target) {
			this.checkCan('lock');
			target = target.toLowerCase().trim().replace(/ /ig, '');
			if (!target) return this.parse(`/help abusemonitor`);
			if (!cache[target]?.staffNotified) {
				return this.popupReply(`That room has not been flagged by the abuse monitor.`);
			}
			// we delete the cache because if more stuff happens in it
			// post punishment, we want to know about it
			delete cache[target];
			notifyStaff();
			Chat.refreshPageFor(`abusemonitor-view-${target}`, 'staff');
		},
		view(target, room, user) {
			return this.parse(`/j view-abusemonitor-view-${target.toLowerCase().trim()}`);
		},
		logs(target) {
			checkAccess(this);
			const [count, userid] = Utils.splitFirst(target, ',').map(toID);
			this.parse(`/join view-abusemonitor-logs-${count || '200'}${userid ? `-${userid}` : ""}`);
		},
		async respawn(target, room, user) {
			checkAccess(this);
			this.sendReply(`Respawning...`);
			const unspawned = await PM.respawn();
			this.sendReply(`DONE. ${Chat.count(unspawned, 'processes', 'process')} unspawned.`);
			this.addGlobalModAction(`${user.name} used /abusemonitor respawn`);
		},
		async userclear(target, room, user) {
			checkAccess(this);
			const {targetUsername, rest} = this.splitUser(target);
			const targetId = toID(targetUsername);
			if (!targetId) return this.parse(`/help abusemonitor`);
			if (user.lastCommand !== `am userclear ${targetId}`) {
				user.lastCommand = `am userclear ${targetId}`;
				this.errorReply(`Are you sure you want to clear abuse monitor database records for ${targetId}?`);
				this.errorReply(`Retype the command if you're sure.`);
				return;
			}
			user.lastCommand = '';
			const results = await Chat.database.run(
				'DELETE FROM perspective_logs WHERE userid = ?', [targetId]
			);
			if (!results.changes) {
				return this.errorReply(`No logs for ${targetUsername} found.`);
			}
			this.sendReply(`${results.changes} log(s) cleared for ${targetId}.`);
			this.privateGlobalModAction(`${user.name} cleared abuse monitor logs for ${targetUsername}${rest ? ` (${rest})` : ""}.`);
			this.globalModlog('ABUSEMONITOR CLEAR', targetId, rest);
		},
		async deletelog(target, room, user) {
			checkAccess(this);
			target = toID(target);
			if (!target) return this.parse(`/help abusemonitor`);
			const num = parseInt(target);
			if (isNaN(num)) {
				return this.errorReply(`Invalid log number: ${target}`);
			}
			const row = await Chat.database.get(
				'SELECT * FROM perspective_logs WHERE rowid = ?', [num]
			);
			if (!row) {
				return this.errorReply(`No log with ID ${num} found.`);
			}
			await Chat.database.run( // my kingdom for RETURNING * in sqlite :(
				'DELETE FROM perspective_logs WHERE rowid = ?', [num]
			);
			this.sendReply(`Log ${num} deleted.`);
			this.privateGlobalModAction(`${user.name} deleted an abuse monitor log for the user ${row.userid}.`);
			this.stafflog(
				`Message: "${row.message}", room: ${row.roomid}, time: ${Chat.toTimestamp(new Date(row.time))}`
			);
			this.globalModlog("ABUSEMONITOR DELETELOG", row.userid, `${num}`);
			Chat.refreshPageFor('abusemonitor-logs', 'staff', true);
		},
		es: 'editspecial',
		editspecial(target, room, user) {
			checkAccess(this);
			if (!toID(target)) return this.parse(`/help abusemonitor`);
			let [rawType, rawPercent, rawScore] = target.split(',');
			const type = rawType.toUpperCase().replace(/\s/g, '_');
			rawScore = toID(rawScore);
			const types = {...ATTRIBUTES, "ALL": {}};
			if (!(type in types)) {
				return this.errorReply(`Invalid type: ${type}. Valid types: ${Object.keys(types).join(', ')}.`);
			}
			const percent = parseFloat(rawPercent);
			if (isNaN(percent) || percent > 1 || percent < 0) {
				return this.errorReply(`Invalid percent: ${percent}. Must be between 0 and 1.`);
			}
			const score = parseInt(rawScore);
			if ((isNaN(score) && rawScore !== 'MAXIMUM') || score < 0) {
				return this.errorReply(`Invalid score: ${score}. Must be a positive integer or "MAXIMUM".`);
			}
			if (settings.specials[type]?.[percent] && !this.cmd.includes('f')) {
				return this.errorReply(`That special case already exists. Use /am forceeditspecial to change it.`);
			}
			if (!settings.specials[type]) settings.specials[type] = {};
			settings.specials[type][percent] = score;
			saveSettings();
			this.privateGlobalModAction(`${user.name} set the abuse monitor special case for ${type} at ${percent}% to ${score}.`);
			this.globalModlog("ABUSEMONITOR SPECIAL", type, `${percent}% to ${score}`);
			this.sendReply(`|html|Remember to use <code>/am respawn</code> to deploy the settings to the child processes.`);
		},
		ds: 'deletespecial',
		deletespecial(target, room, user) {
			checkAccess(this);
			const [rawType, rawPercent] = target.split(',');
			const type = rawType.toUpperCase().replace(/\s/g, '_');
			const types = {...ATTRIBUTES, "ALL": {}};
			if (!(type in types)) {
				return this.errorReply(`Invalid type: ${type}. Valid types: ${Object.keys(types).join(', ')}.`);
			}
			const percent = parseFloat(rawPercent);
			if (isNaN(percent) || percent > 1 || percent < 0) {
				return this.errorReply(`Invalid percent: ${percent}. Must be between 0 and 1.`);
			}
			if (!settings.specials[type]?.[percent]) {
				return this.errorReply(`That special case does not exist.`);
			}
			delete settings.specials[type][percent];
			if (!Object.keys(settings.specials[type]).length) {
				delete settings.specials[type];
			}
			saveSettings();
			this.privateGlobalModAction(`${user.name} deleted the abuse monitor special case for ${type} at ${percent}%.`);
			this.globalModlog("ABUSEMONITOR DELETESPECIAL", type, `${percent}%`);
			this.sendReply(`|html|Remember to use <code>/am respawn</code> to deploy the settings to the child processes.`);
		},
		em: 'editmin',
		editmin(target, room, user) {
			checkAccess(this);
			const num = parseFloat(target);
			if (isNaN(num) || num < 0 || num > 1) {
				return this.errorReply(`Invalid minimum score: ${num}. Must be a positive integer.`);
			}
			settings.minScore = num;
			saveSettings();
			this.privateGlobalModAction(`${user.name} set the abuse monitor minimum score to ${num}.`);
			this.globalModlog("ABUSEMONITOR MIN", null, "" + num);
			this.sendReply(`|html|Remember to use <code>/am respawn</code> to deploy the settings to the child processes.`);
		},
		vs: 'viewsettings',
		settings: 'viewsettings',
		viewsettings() {
			checkAccess(this);
			let buf = `<strong>Abuse Monitor Settings</strong><hr />`;
			const specials = Object.keys(settings.specials);
			if (specials.length) {
				buf += `<strong>Special cases:</strong><br />`;
				for (const type of specials) {
					buf += `&bull; ${type}: `;
					const special = settings.specials[type];
					const specialKeys = Object.keys(special);
					for (const percent of specialKeys) {
						buf += `${percent}%: ${special[percent as any]}, `;
					}
					buf = buf.slice(0, -2);
					buf += `<br />`;
				}
			}
			buf += `<br /><strong>Minimum percent to process:</strong> ${settings.minScore}`;
			buf += `<br /><strong>Score threshold:</strong> ${settings.threshold}`;
			this.sendReplyBox(buf);
		},
	},
	abusemonitorhelp: [
		`/am toggle - Toggle the abuse monitor on and off. Requires: whitelist &`,
		`/am threshold [number] - Set the abuse monitor trigger threshold. Requires: whitelist &`,
		`/am resolve [room] - Mark a abuse monitor flagged room as handled by staff. Requires: % @ &`,
		`/am respawn - Respawns abuse monitor processes. Requires: whitelist &`,
		`/am logs [count][, userid] - View logs of recent matches by the abuse monitor. `,
		`If a userid is given, searches only logs from that userid. Requires: whitelist &`,
		`/am userclear [user] - Clear all logged abuse monitor hits for a user. Requires: whitelist &`,
		`/am deletelog [number] - Deletes a abuse monitor log matching the row ID [number] given. Requires: whitelist &`,
		`/am editspecial [type], [percent], [score] - Sets a special case for the abuse monitor. Requires: whitelist &`,
		`[score] can be either a number or MAXIMUM, which will set it to the maximum score possible (that will trigger an action)`,
		`/am deletespecial [type], [percent] - Deletes a special case for the abuse monitor. Requires: whitelist &`,
		`/am editmin [number] - Sets the minimum percent needed to process for all flags. Requires: whitelist &`,
		`/am viewsettings - View the current settings for the abuse monitor. Requires: whitelist &`,
	],
};

export const pages: Chat.PageTable = {
	abusemonitor: {
		flagged(query, user) {
			checkAccess(this);
			const ids = getFlaggedRooms();
			this.title = '[Abuse Monitor] Flagged rooms';
			let buf = `<div class="pad">`;
			buf += `<h2>Flagged rooms</h2>`;
			if (!ids.length) {
				buf += `<p class="error">No rooms have been flagged recently.</p>`;
				return buf;
			}
			buf += `<p>Currently flagged rooms: ${ids.length}</p>`;
			buf += `<div class="ladder pad">`;
			buf += `<table><tr><th>Status</th><th>Room</th><th>Claimed by</th><th>Action</th></tr>`;
			for (const roomid of ids) {
				const entry = cache[roomid];
				buf += `<tr>`;
				if (entry.claimed) {
					buf += `<td><span style="color:green">`;
					buf += `<i class="fa fa-circle-o"></i> <strong>Claimed</strong></span></td>`;
				} else {
					buf += `<td><span style="color:orange">`;
					buf += `<i class="fa fa-circle-o"></i> <strong>Unclaimed</strong></span></td>`;
				}
				// should never happen, fallback just in case
				buf += `<td><a href="/${roomid}">${Rooms.get(roomid)?.title || roomid}</a></td>`;
				buf += `<td>${entry.claimed ? entry.claimed : '-'}</td>`;
				buf += `<td><button class="button" name="send" value="/am view ${roomid}">`;
				buf += `${entry.claimed ? 'Join' : 'Claim'}</button></td>`;
				buf += `</tr>`;
			}
			buf += `</table></div>`;
			return buf;
		},
		view(query, user) {
			this.checkCan('lock');
			const roomid = query.join('-');
			this.title = `[Abuse Monitor] ${roomid}`;
			let buf = `<div class="pad">`;
			buf += `<button style="float:right;" class="button" name="send" value="/join ${this.pageid}">`;
			buf += `<i class="fa fa-refresh"></i> Refresh</button>`;
			buf += Utils.html`<h2>Abuse Monitor - <a href="/${roomid}">${roomid}</a></h2>`;
			const room = Rooms.get(roomid);
			if (!room) {
				if (cache[roomid]) delete cache[roomid];
				buf += `<hr /><p class="error">No such room.</p>`;
				return buf;
			}
			if (!cache[roomid]) {
				buf += `<hr /><p class="error">The abuse monitor has not flagged the given room.</p>`;
				return buf;
			}
			buf += `<hr />`;
			if (!cache[roomid].claimed) {
				cache[roomid].claimed = user.id;
				notifyStaff();
			} else {
				buf += `<p><strong>Claimed:</strong> ${cache[roomid].claimed}</p>`;
			}

			buf += `<details class="readmore"><summary><strong>Chat:</strong></summary><div class="infobox">`;
			// we parse users specifically from the log so we can see it after they leave the room
			const users = new Utils.Multiset<string>();
			// assume logs exist - why else would the filter activate?
			for (const line of room.log.log) {
				const data = room.log.parseChatLine(line);
				if (!data) continue; // not chat
				users.add(toID(data.user));
				buf += `<div class="chat"><span class="username">`;
				buf += Utils.html`<username>${data.user}:</username></span> ${data.message}</div>`;
			}
			buf += `</div></details>`;
			buf += `<p><strong>Users:</strong><small> (click a name to punish)</small></p>`;
			for (const [id] of Utils.sortBy([...users], ([, num]) => -num)) {
				const curUser = Users.get(id);
				buf += Utils.html`<details class="readmore"><summary>${curUser?.name || id}</summary><div class="infobox">`;
				const punishments = ['Warn', 'Lock', 'Weeklock', 'Namelock', 'Weeknamelock'];
				for (const name of punishments) {
					let cmdParts = [Utils.html`/msgroom ${roomid},/${toID(name)} ${id},{reason}`];
					if (!user.inRooms.has(room.roomid)) {
						cmdParts = [
							// we want the punishment to be shown in the room
							// so that the users are aware
							Utils.html`/join ${roomid}`,
							'', // needed to give time to join
							...cmdParts,
							Utils.html`/msgroom ${roomid},/part`,
						];
					}
					buf += `<form data-submitsend="${cmdParts.join('&#10;')}">`;
					buf += `<button class="button notifying" type="submit">${name}</button><br />`;
					buf += `Optional reason: <input name="reason" />`;
					buf += `</form><br />`;
				}
				buf += `</div></details><br />`;
			}
			buf += `<button class="button" name="send" value="/msgroom staff, /am resolve ${room.roomid}">Mark resolved</button>`;
			return buf;
		},
		async logs(query, user) {
			checkAccess(this);
			this.title = '[Abuse Monitor] Logs';
			let buf = `<div class="pad">`;
			buf += `<h2>Abuse Monitor Logs</h2><hr />`;
			const rawCount = query.shift() || "";
			let count = 200;
			if (rawCount) {
				count = parseInt(rawCount);
				if (isNaN(count)) {
					buf += `<p class="message-error">Invalid limit specified: ${rawCount}</p>`;
					return buf;
				}
			}
			const userid = toID(query.shift());
			let logQuery = `SELECT rowid, * FROM perspective_logs `;
			const args = [];
			if (userid) {
				logQuery += `WHERE userid = ? `;
				args.push(userid);
			}
			logQuery += `ORDER BY rowid DESC LIMIT ?`;
			args.push(count);

			const logs = await Chat.database.all(logQuery, args);
			if (!logs.length) {
				buf += `<p class="message-error">No logs found${userid ? ` for the user ${userid}` : ""}.</p>`;
				return buf;
			}
			Utils.sortBy(logs, log => [-log.time, log.roomid, log.userid]);
			buf += `<p>${logs.length} log(s) found.</p>`;
			buf += `<div class="ladder pad">`;
			buf += `<table><tr><th>Room</th>`;
			if (!userid) {
				buf += `<th>User</th>`;
			}
			buf += `<th>Message</th>`;
			buf += `<th>Time</th><th>Score / Flags</th><th>Other data</th><th>Manage</th></tr>`;
			const prettifyFlag = (flag: string) => flag.toLowerCase().replace(/_/g, ' ');
			for (const log of logs) {
				const {roomid} = log;
				buf += `<tr>`;
				buf += `<td><a href="https://${Config.routes.replays}/${roomid.slice(7)}">${roomid}</a></td>`;
				if (!userid) buf += `<td>${log.userid}</td>`;
				buf += Utils.html`<td>${log.message}</td>`;
				buf += `<td>${Chat.toTimestamp(new Date(log.time))}</td>`;
				buf += `<td>${log.score} (${log.flags.split(',').map(prettifyFlag).join(', ')})</td>`;
				buf += `<td>Hit threshold: ${log.hit_threshold ? 'Yes' : 'No'}</td><td>`;
				buf += `<button class="button" name="send" value="/msgroom staff,/abusemonitor deletelog ${log.rowid}">Delete</button>`;
				buf += `</td>`;
				buf += `</tr>`;
			}
			buf += `</table></div>`;
			// assume this probably means there are more.
			// if there's less than the count we requested, that's as far as it goes.
			if (count === logs.length) {
				buf += `<center>`;
				buf += `<button class="button" name="send" value="/msgroom staff, /am logs ${count + 100}">Show 100 more</button>`;
				buf += `</center>`;
			}
			return buf;
		},
	},
};
