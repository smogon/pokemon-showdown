/**
 * Many parts borrowed from POSHO-9000.
 * Refactored at length by @author mia-pi-git
 */
import { FS, Utils, Net } from '../../lib';
import { prefixManager } from './username-prefixes';

const MINUTE = 60000;
const INTERVAL = MINUTE;
const FACTOR = 1.5;

interface TrackerConfig {
	format: string;
	prefix: string;
	rating: number;
	deadline?: string;
	cutoff?: number;
	users?: ID[];
	showdiffs?: boolean;
}

interface Leaderboard {
	current?: LeaderboardEntry[];
	last?: LeaderboardEntry[];
	lookup: Map<string, LeaderboardEntry>;
}

interface LeaderboardEntry {
	name: string;
	rank?: number;
	elo: number;
	gxe: number;
	glicko: number;
	glickodev: number;
}

export class LadderTracker {
	readonly config: TrackerConfig;

	format: ID;
	prefix: ID;
	private deadline?: Date;
	rating: number;
	users: Set<ID>;

	private lastid?: string;
	showdiffs?: boolean;
	private started?: NodeJS.Timeout;
	private final?: NodeJS.Timeout;

	leaderboard: Leaderboard;

	cooldown?: Date;
	private changed?: boolean;
	lines: { them: number, total: number };
	room: Room;

	constructor(room: Room, config: TrackerConfig) {
		this.config = config;
		this.room = room;

		this.format = toID(config.format);
		this.prefix = toID(config.prefix);
		this.rating = config.rating || 0;
		if (config.deadline) this.setDeadline(config.deadline, false);

		this.users = new Set(config.users);
		this.leaderboard = { lookup: new Map() };
		this.showdiffs = config.showdiffs || false;

		this.lines = { them: 0, total: 0 };
	}

	static get(room: Room | string) {
		room = toID(room);
		return trackers[room];
	}

	addHTML(msg: string, box = false) {
		if (box) msg = `<div class="infobox">${msg}</div>`;
		this.room.add(`|html|${msg}`).update();
	}

	setDeadline(argument: string, save = true) {
		const date = new Date(argument);
		if (!+date) throw new Chat.ErrorMessage(`Invalid date: ${argument}`);

		this.deadline = date;
		if (this.final) clearTimeout(this.final);
		// We set the timer to fire slightly before the deadline and then
		// repeatedly do process.nextTick checks for accuracy
		this.final = setTimeout(() => {
			this.stop();
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			this.captureFinalLeaderboard();
		}, (+this.deadline - Date.now()) - 500);

		if (save) LadderTracker.save();
	}

	async captureFinalLeaderboard() {
		const now = new Date();
		if (now < this.deadline!) {
			process.nextTick(this.captureFinalLeaderboard.bind(this));
			return;
		}
		const leaderboard = await this.getLeaderboard();
		this.addHTML(this.styleLeaderboard(leaderboard, +now), true);
		this.deadline = undefined;
	}

	handleBattleEnd(battle: Rooms.RoomBattle) {
		const skipid = this.lastid;
		const roomid = battle.roomid;

		const [rating, rmsg] = this.getRating(battle);
		if (!this.tracking(battle, rating) || (skipid && skipid >= roomid)) return;

		const style = (p: string) => this.stylePlayer(p);
		const msg = `Battle started between ${style(battle.p1.name)} and ${style(battle.p2.name)}`;
		this.addHTML(`<a href="/${roomid}" class="ilink">${msg}. ${rmsg}</a></div>`, true);
		if (!this.lastid || this.lastid < roomid) this.lastid = roomid;
	}
	formatTimeRemaining(ms: number, round?: boolean): string {
		let s = ms / 1000;
		let h = Math.floor(s / 3600);
		let m = Math.floor((s - h * 3600) / 60);
		s = s - h * 3600 - m * 60;

		if (round) {
			s = Math.round(s);
			if (s === 60) {
				s = 0;
				m++;
			}
			if (m === 60) {
				m = 0;
				h++;
			}
		}

		const time = [];
		if (h > 0) time.push(`${h} hour${h === 1 ? '' : 's'}`);
		if (m > 0) time.push(`${m} minute${m === 1 ? '' : 's'}`);
		if (s > 0) time.push(`${s} second${s === 1 ? '' : 's'}`);
		return time.join(' ');
	}

	getRating(battle: Rooms.RoomBattle): [number, string] {
		const p1 = this.leaderboard.lookup.get(toID(battle.p1.name));
		const p2 = this.leaderboard.lookup.get(toID(battle.p2.name));
		if (p1 && p2) return this.averageRating(p1.elo, p2.elo);
		const minElo = Math.floor(battle.rated);
		if (p1 && p1.elo > minElo) return this.averageRating(p1.elo, minElo);
		if (p2 && p2.elo > minElo) return this.averageRating(p2.elo, minElo);
		return [minElo, `(min rating: ${minElo})`];
	}

	averageRating(a: number, b: number): [number, string] {
		const rating = Math.round((a + b) / 2);
		return [rating, `(avg rating: ${rating})`];
	}

	stylePlayer(player: string) {
		return `<username>${player}</username>`;
	}

	tracking(battle: Rooms.RoomBattle, rating: number) {
		const minElo = Math.floor(Number(battle.rated) || 0);
		if (battle.format !== this.config.format) return false;
		if (!minElo || minElo < 1000) {
			return false;
		}
		const p1 = toID(battle.p1.name);
		const p2 = toID(battle.p2.name);

		// If we are tracking users and a player in the game is one of them, report the battle
		if (this.users.size && (this.users.has(p1) || this.users.has(p2))) {
			return true;
		}

		// If a player has an our prefix, report if the battle is above the required rating
		if (p1.startsWith(this.prefix) || p2.startsWith(this.prefix)) {
			return rating >= this.rating;
		}

		// Report if a cutoff has been set and both prefixed players are within a factor of the cutoff
		if (this.config.cutoff && p1.startsWith(this.prefix) && p2.startsWith(this.prefix)) {
			const a = this.leaderboard.lookup.get(p1);
			const b = this.leaderboard.lookup.get(p2);
			const rank = this.config.cutoff * FACTOR;
			return a?.rank && a.rank <= rank && b?.rank && b.rank <= rank;
		}
		return false;
	}

	leaderboardCooldown(now: Date) {
		if (!this.cooldown) return true;
		const wait = Math.floor((+now - +this.cooldown) / MINUTE);
		const lines = this.changed ? this.lines.them : this.lines.total;
		if (lines < 5 && wait < 3) return false;
		const factor = this.changed ? 6 : 1;
		return factor * (wait + lines) >= 60;
	}

	getDeadline(now: Date) {
		if (!this.deadline) {
			return ('No deadline has been set.');
		} else {
			return (`**Time Remaining:** ${this.formatTimeRemaining(+this.deadline - +now, true)}`);
		}
	}

	tracked() {
		if (!this.users.size) {
			return ('Not currently tracking any users.');
		} else {
			const users = Array.from(this.users.values()).join(', ');
			const plural = this.users.size === 1 ? 'user' : 'users';
			return (`Currently tracking <b>${this.users.size}</b> ${plural}: ${users}`);
		}
	}

	async getLeaderboard(display?: boolean) {
		const url = `https://pokemonshowdown.com/ladder/${this.format}.json?prefix=${this.prefix}`;
		const leaderboard: LeaderboardEntry[] = [];
		let response;
		try {
			response = await Net(url).get().then(JSON.parse);
		} catch (e: any) {
			if (e.name === 'SyntaxError') { // sometimes the page 404s, meaning invalid json. skip!
				response = { toplist: [] };
			} else {
				if (display) throw new Chat.ErrorMessage('Failed to fetch leaderboard. Try again later.');
				return leaderboard;
			}
		}

		this.leaderboard.lookup = new Map();
		for (const data of response.toplist) {
			// TODO: move the rounding until later
			const entry: LeaderboardEntry = {
				name: data.username,
				elo: Math.round(data.elo),
				gxe: data.gxe,
				glicko: Math.round(data.rpr),
				glickodev: Math.round(data.rprd),
			};
			this.leaderboard.lookup.set(data.userid, entry);
			if (!data.userid.startsWith(this.prefix)) continue;
			entry.rank = leaderboard.length + 1;
			leaderboard.push(entry);
		}
		if (display) {
			this.leaderboard.last = leaderboard;
			this.changed = false;
			this.lines = { them: 0, total: 0 };
		}
		return leaderboard;
	}

	static getTracker(context: Chat.CommandContext) {
		const room = context.requireRoom();
		const t = this.get(room);
		if (!t) throw new Chat.ErrorMessage(`There is no active ladder tracker in this room.`);
		return t;
	}

	static save() {
		FS('config/chat-plugins/laddertrackers.json').writeUpdate(() => {
			const out: Record<string, TrackerConfig> = {};
			for (const roomid in trackers) {
				trackers[roomid].restoreConfig();
				out[roomid] = trackers[roomid].config;
			}
			return JSON.stringify(out);
		});
	}

	restoreConfig() {
		this.config.users = [...this.users];
		this.config.showdiffs = this.showdiffs;
		this.config.rating = this.rating;
		this.config.prefix = this.prefix;
		this.config.deadline = this.deadline?.toString();
	}

	styleLeaderboard(leaderboard: LeaderboardEntry[], final?: number) {
		const diffs = this.leaderboard.last && !final ?
			this.getDiffs(this.leaderboard.last, leaderboard) :
			new Map();
		let buf = '<center>';
		if (final) {
			buf +=
            `<h1 style="margin-bottom: 0.2em">Final Leaderboard - ${this.prefix}</h1>` +
            `<div style="margin-bottom: 1em"><small><em>${final}</em></small></div>`;
		}
		buf +=
            '<div class="ladder" style="max-height: 250px; overflow-y: auto"><table>' +
            '<tr><th></th><th>Name</th><th><abbr title="Elo rating">Elo</abbr></th>' +
            '<th><abbr title="user\'s percentage chance of winning a random battle (aka GLIXARE)">GXE</abbr></th>' +
            '<th><abbr title="Glicko-1 rating system: rating±deviation (provisional if deviation>100)">Glicko-1</abbr></th></tr>';
		for (const [i, p] of leaderboard.entries()) {
			const id = toID(p.name);
			const link = `https://www.smogon.com/forums/search/1/?q="${encodeURIComponent(p.name)}"`;
			const diff = diffs.get(id);
			let rank = `${i + 1}`;
			if (diff) {
				const symbol = diff[2] < diff[3] ?
					'<span style="color: #F00">▼</span>' :
					'<span style="color: #008000">▲</span>';
				rank = `${symbol}${rank}`;
			}
			buf +=
                `<tr><td style="text-align: right"><a href='${link}' class="subtle">${rank}</a></td>` +
                Utils.html`<td><username class="username">${p.name}</username></td>` +
                `<td><strong>${p.elo}</strong></td><td>${p.gxe.toFixed(1)}%</td>` +
                `<td>${p.glicko} ± ${p.glickodev}</td></tr>`;
		}
		buf += '</table></div></center>';
		return buf;
	}

	getDiffs(last: LeaderboardEntry[], current: LeaderboardEntry[], num?: number) {
		const diffs = new Map<string, [string, number, number, number]>();

		const lastN = num ? last.slice(0, num) : last;
		for (const [i, player] of lastN.entries()) {
			const id = toID(player.name);
			const oldrank = i + 1;
			let newrank = current.findIndex(e => toID(e.name) === id) + 1;
			let elo: number;
			if (!newrank) {
				newrank = Infinity;
				elo = 0;
			} else {
				elo = current[newrank - 1].elo;
			}
			if (oldrank !== newrank) diffs.set(id, [player.name, elo, oldrank, newrank]);
		}

		const currentN = num ? current.slice(0, num) : current;
		for (const [i, player] of currentN.entries()) {
			const id = toID(player.name);
			const newrank = i + 1;
			let oldrank = last.findIndex(e => toID(e.name) === id) + 1;
			if (!oldrank) oldrank = Infinity;
			if (oldrank !== newrank) diffs.set(id, [player.name, player.elo, oldrank, newrank]);
		}

		return diffs;
	}

	trackChanges(leaderboard: LeaderboardEntry[], display?: boolean) {
		if (!this.leaderboard.current || !this.config.cutoff) return;
		const n = this.config.cutoff;
		const diffs = this.getDiffs(this.leaderboard.current, leaderboard, n * FACTOR);
		if (!diffs.size) return;

		const sorted = Array.from(diffs.values()).sort((a, b) => a[3] - b[3]);
		const messages = [];
		for (const [name, elo, oldrank, newrank] of sorted) {
			if (!((oldrank > n && newrank <= n) || (oldrank <= n && newrank > n))) {
				this.changed = true;
			}

			if (display) {
				const symbol = oldrank < newrank ? '▼' : '▲';
				const rank = newrank === Infinity ? '?' : newrank;
				const rating = elo || '?';
				const message = newrank > n ? `<i>${name} (${rating})</i>` : `${name} (${rating})`;
				messages.push(`${symbol}<b>${rank}.</b> ${message}`);
			}
		}

		if (display) this.addHTML(messages.join(' '));
	}

	setPrefix(prefix: string, save = true) {
		const oldPrefix = this.prefix;
		this.prefix = toID(prefix);
		if (oldPrefix !== prefix) {
			if (save) LadderTracker.save();
			this.togglePrefix(oldPrefix);
		}
	}

	togglePrefix(oldPrefix?: ID) {
		if (!this.room.settings.isPrivate) {
			try {
				if (oldPrefix) prefixManager.removePrefix(oldPrefix, 'privacy');
			} catch {} // suppress errorMessages in case it's the first start and it hasn't been made priv yet
			try {
				prefixManager.addPrefix(this.prefix, 'privacy');
			} catch {} // same as above
		}
	}

	start() {
		if (this.started) return;

		this.togglePrefix();
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.started = setInterval(async () => {
			// Leaderboard
			const leaderboard = await this.getLeaderboard();
			if (!leaderboard.length) return;
			if (this.leaderboard) this.trackChanges(leaderboard, this.showdiffs);
			this.leaderboard.current = leaderboard;
		}, INTERVAL);
	}

	stop() {
		if (this.started) {
			clearInterval(this.started);
			this.started = undefined;
			this.leaderboard.current = undefined;
			this.leaderboard.last = undefined;
		}
	}
}

export const trackers: Record<string, LadderTracker> = {};
try {
	const data = JSON.parse(FS("config/chat-plugins/laddertrackers.json").readIfExistsSync() || "{}");
	for (const roomid in data) {
		const room = Rooms.search(roomid);
		if (!room) {
			Monitor.adminlog(`Missing room ${roomid} for ladder tracker.`);
			continue;
		}
		trackers[roomid] = new LadderTracker(room, data[roomid]);
		trackers[roomid].start();
	}
} catch {}

export const commands: Chat.ChatCommands = {
	ld: 'laddertrack',
	laddertrack: {
		override: '',
		''(target, room, user, connection, cmd) {
			room = this.requireRoom();
			this.checkCan('declare', null, room);
			if (!toID(target)) {
				return this.parse(`/j view-laddertrack-${room.roomid}`);
			}
			if (trackers[room.roomid] && !cmd.includes('override')) {
				return this.errorReply(
					`There is already a tracker for this room. Use /laddertrack override if you want to set a new one.`
				);
			}
			const config: Partial<TrackerConfig> = {};
			/* cutoff?: number; */
			const rating = Number(/rating=([0-9]+)/.exec(target)?.[1]);
			if (!rating || rating < 1000) {
				return this.errorReply("Invalid rating. Must be a number above 1000.");
			}
			config.rating = rating;
			const rawCutoff = /cutoff=([0-9]+)/.exec(target)?.[1];
			const cutoff = Number(rawCutoff);
			if (rawCutoff && (!cutoff || cutoff < 1000)) {
				return this.errorReply("Invalid cutoff. Must be a number above 1000.");
			}
			if (cutoff) {
				config.cutoff = cutoff;
			}
			const deadline = /deadline=([^,]+)/i.exec(target)?.[1];
			if (deadline) {
				const date = new Date(deadline);
				if (!+date) {
					return this.errorReply("Invalid date.");
				}
				config.deadline = date.toString();
			}
			const format = toID(/format=([a-zA-Z0-9]+)/i.exec(target)?.[1]);
			if (!format) {
				return this.errorReply("You must specify a format.");
			}
			config.format = format;
			const prefix = toID(/prefix=([a-zA-Z0-9]+)/i.exec(target)?.[1]);
			if (!prefix) {
				return this.errorReply("You must specify a prefix.");
			}
			config.prefix = prefix;

			trackers[room.roomid] = new LadderTracker(room, config as TrackerConfig);
			trackers[room.roomid].start();
			LadderTracker.save();

			this.sendReply("Ladder tracking started.");
			this.modlog('LADDERTRACK', null, Object.entries(config).map(([k, v]) => `${k}=${v}`).join(', '));
		},
		top: 'leaderboard',
		async leaderboard(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.runBroadcast();
			const leaderboard = await tracker.getLeaderboard(this.broadcasting);
			this.sendReplyBox(tracker.styleLeaderboard(leaderboard));
		},
		prefix(target, room, user, sf) {
			const tracker = LadderTracker.getTracker(this);
			target = toID(target);
			if (target) {
				this.checkCan('mute', null, tracker.room);
				tracker.setPrefix(target);
				LadderTracker.save();
				this.modlog(`TRACKER PREFIX`, null, target);
				this.addModAction(`${user.name} updated the ladder tracker prefix to ${target}`);
			} else {
				this.runBroadcast();
			}
			this.sendReply(`Current prefix: ${tracker.prefix}`);
		},
		remaining: 'deadline',
		deadline(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			if (!tracker) return;
			if (target) {
				this.checkCan('mute', null, tracker.room);
				const date = new Date(target);
				if (!+date) {
					return this.errorReply("Invalid date.");
				}
				tracker.setDeadline(target);
				LadderTracker.save();
			} else {
				this.runBroadcast();
			}
			this.sendReplyBox(tracker.getDeadline(new Date()));
		},
		elo: 'rating',
		rating(target, room, user, sf, cmd) {
			room = this.requireRoom();
			const tracker = LadderTracker.get(room);
			this.runBroadcast();
			if (!tracker) return this.errorReply(`There is no active ladder tracker for this room.`);
			const rating = Number(target);
			if (target) {
				if (!rating) return this.errorReply("Invalid rating.");
				this.checkCan('mute', null, room);
				if (rating < 1000) return this.errorReply("Invalid rating. Must be a number above 1000.");
				tracker.rating = rating;
				tracker.config.rating = rating;
				LadderTracker.save();
				this.addModAction(`${user.name} updated the ladder tracker rating to ${rating}.`);
				this.modlog(`LADDERTRACK RATING`, null, target);
			} else {
				this.runBroadcast();
			}
			this.sendReplyBox(`<b>Rating:</b> ${tracker.rating}`);
		},
		cutoff(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			if (!tracker) return;
			const rating = Number(target);
			if (target) {
				if (!rating) return this.errorReply("Invalid cutoff.");
				this.checkCan('mute', null, tracker.room);
				tracker.config.cutoff = rating;
				LadderTracker.save();
				this.modlog(`TRACKER CUTOFF`, null, `${rating}`);
			}
			this.sendReplyBox(`<b>Cutoff:</b> ${tracker.config.cutoff || 0}`);
		},
		add: 'watch',
		track: 'watch',
		follow: 'watch',
		watch(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			for (const userid of target.split(',').map(toID)) {
				if (userid) {
					tracker.users.add(userid);
				}
			}
			this.modlog(`LADDER ADDTRACKUSER`, null, target);
			this.sendReplyBox(tracker.tracked());
			LadderTracker.save();
		},
		untrack: 'unwatch',
		unfollow: 'unwatch',
		remove: 'unwatch',
		unwatch(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			for (const userid of target.split(',').map(toID)) {
				if (userid) {
					tracker.users.delete(userid);
				}
			}
			this.modlog(`LADDER UNTRACKUSER`, null, target);
			this.sendReplyBox(tracker.tracked());
			LadderTracker.save();
		},
		tracked: 'tracking',
		watched: 'tracking',
		followed: 'tracking',
		watching: 'tracking',
		tracking(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			this.runBroadcast();
			this.sendReplyBox(tracker.tracked());
		},
		start(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			tracker.start();
			LadderTracker.save();
		},
		pause(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			tracker.stop();
			LadderTracker.save();
		},
		end: 'endtrack',
		endtrack(target, room, user, nike, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			tracker.stop();
			delete trackers[tracker.room.roomid];
			LadderTracker.save();
			this.modlog(`LADDER ENDTRACK`, null);
			this.addModAction(`${user.name} ended the active ladder tracker.`);
		},
		hidediffs: 'showdiffs',
		showdiffs(target, room, user, sf, cmd) {
			const tracker = LadderTracker.getTracker(this);
			this.checkCan('mute', null, tracker.room);
			const setting = !cmd.includes('hide');
			if (tracker.showdiffs === setting) {
				return this.sendReply(`Differences are already ${setting ? 'shown' : 'hidden'}.`);
			}
			tracker.showdiffs = setting;
			this.addModAction(`${user.name} set ladder tracker showdiffs ${setting ? 'on' : 'off'}.`);
			LadderTracker.save();
		},
	},
	laddertrackhelp() {
		this.runBroadcast();
		this.sendReplyBox([
			`- /laddertrack OR /ld displays a page to start a tracker (requires # in the room to do so).`,
			// ` (can also be used with key=value formatted args to start it directly - requires keys: rating, prefix, format, deadline, cutoff)`,
			` - /laddertrack [leaderboard/top] - updates and displays the current leaderboard`,
			` - /laddertrack deadline [optional date] - displays the current deadline, or sets the deadline to the given deadline if one is given (requires % to do so)`,
			` - /laddertrack rating [optional rating] - displays the current rating, or sets the rating to the given rating if one is given (requires % to do so)`,
			` - /laddertrack watch [optional list,of,users] - tracks the given user's battles (requires % to do so)`,
			` - /laddertrack unwatch [list,of,users] - stops tracking the given user's battles (requires % to do so)`,
			` - /laddertrack tracking - displays the current users being tracked`,
			` - /laddertrack start - starts the tracker`,
			` - /laddertrack pause - temporarily pauses the tracker`,
			` - /laddertrack endtrack - ends the tracker entirely`,
			` - /laddertrack showdiffs - shows or hides differences between the current leaderboard and the previous leaderboard`,
			`All commands require % to be used to edit settings, and can be used by anyone to view settings.`,
		].join('<br />'));
	},
};

export const pages: Chat.PageTable = {
	laddertrack(query, user) {
		const room = this.requireRoom();
		let buf = ``;
		this.title = '[Ladder Tracker] Setup';
		buf += `<div class="pad"><h2>Ladder tracker setup</h2><hr />`;
		buf += `<div class="infobox">`;
		let cmd = `/msgroom ${room},/laddertrack `;
		const keys = ['rating', 'prefix', 'format', 'deadline', 'cutoff'];
		const required = ['rating', 'prefix', 'format'];
		cmd += keys.map(k => `${k}={${k}}`).join(', ');
		buf += `<form data-submitsend="${cmd}">`;
		for (const key of keys) {
			buf += `<label>${key.charAt(0).toUpperCase()}${key.slice(1)}`;
			if (required.includes(key)) {
				buf += ` (required)`;
			}
			buf += `:</label>`;
			buf += ` <input name="${key}" />`;
			buf += `<br />`;
		}
		buf += `<button class="button notifying" type="submit">Create</button>`;
		buf += `</form></div></div>`;
		return buf;
	},
};

export const handlers: Chat.Handlers = {
	onBattleCreate(battle, players) {
		for (const tracker of Object.values(trackers)) {
			tracker.handleBattleEnd(battle);
		}
	},
};
