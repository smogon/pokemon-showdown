/**
 * Monitor
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Various utility functions to make sure PS is running healthily.
 *
 * @license MIT
 */

import { exec, type ExecException, type ExecOptions } from 'child_process';
import { crashlogger, FS } from "../lib";
import * as pathModule from 'path';

const MONITOR_CLEAN_TIMEOUT = 2 * 60 * 60 * 1000;

/**
 * This counts the number of times an action has been committed, and tracks the
 * delta of time since the last time it was committed. Actions include
 * connecting to the server, starting a battle, validating a team, and
 * sending/receiving data over a connection's socket.
 */
export class TimedCounter extends Map<string, [number, number]> {
	/**
	 * Increments the number of times an action has been committed by one, and
	 * updates the delta of time since it was last committed.
	 *
	 * @returns [action count, time delta]
	 */
	increment(key: string, timeLimit: number): [number, number] {
		const val = this.get(key);
		const now = Date.now();
		if (!val || now > val[1] + timeLimit) {
			this.set(key, [1, Date.now()]);
			return [1, 0];
		} else {
			val[0]++;
			return [val[0], now - val[1]];
		}
	}
}

// Config.loglevel is:
// 0 = everything
// 1 = debug (same as 0 for now)
// 2 = notice (default)
// 3 = warning
// (4 is currently unused)
// 5 = supposedly completely silent, but for now a lot of PS output doesn't respect loglevel
if (('Config' in global) &&
	(typeof Config.loglevel !== 'number' || Config.loglevel < 0 || Config.loglevel > 5)) {
	Config.loglevel = 2;
}

export const Monitor = new class {
	connections = new TimedCounter();
	netRequests = new TimedCounter();
	battles = new TimedCounter();
	battlePreps = new TimedCounter();
	groupChats = new TimedCounter();
	tickets = new TimedCounter();

	activeIp: string | null = null;
	networkUse: { [k: string]: number } = {};
	networkCount: { [k: string]: number } = {};
	hotpatchLock: { [k: string]: { by: string, reason: string } } = {};

	TimedCounter = TimedCounter;

	updateServerLock = false;
	cleanInterval: NodeJS.Timeout | null = null;
	/**
	 * Inappropriate userid : has the user logged in since the FR
	 */
	readonly forceRenames = new Map<ID, boolean>();

	/*********************************************************
	 * Logging
	 *********************************************************/
	crashlog(err: any, source = 'The main process', details: AnyObject | null = null) {
		const error = (err || {}) as Error;
		if ((error.stack || '').startsWith('@!!@')) {
			try {
				const stack = (error.stack || '');
				const nlIndex = stack.indexOf('\n');
				[error.name, error.message, source, details] = JSON.parse(stack.slice(4, nlIndex));
				error.stack = stack.slice(nlIndex + 1);
			} catch {}
		}
		const crashType = crashlogger(error, source, details);
		Rooms.global.reportCrash(error, source);
		if (crashType === 'lockdown') {
			Config.autolockdown = false;
			Rooms.global.startLockdown(error);
		}
	}

	logPath(path: string) {
		if (Config.logsdir) {
			return FS(pathModule.join(Config.logsdir, path));
		}
		return FS(pathModule.join('logs', path));
	}

	log(text: string) {
		this.notice(text);
		const staffRoom = Rooms.get('staff');
		if (staffRoom) {
			staffRoom.add(`|c|~|${text}`).update();
		}
	}

	adminlog(text: string) {
		this.notice(text);
		const upperstaffRoom = Rooms.get('upperstaff');
		if (upperstaffRoom) {
			upperstaffRoom.add(`|c|~|${text}`).update();
		}
	}

	logHTML(text: string) {
		this.notice(text);
		const staffRoom = Rooms.get('staff');
		if (staffRoom) {
			staffRoom.add(`|html|${text}`).update();
		}
	}

	error(text: string) {
		(Rooms.get('development') || Rooms.get('staff') || Rooms.get('lobby'))?.add(`|error|${text}`).update();
		if (Config.loglevel <= 3) console.error(text);
	}

	debug(text: string) {
		if (Config.loglevel <= 1) console.log(text);
	}

	warn(text: string) {
		if (Config.loglevel <= 3) console.log(text);
	}

	notice(text: string) {
		if (Config.loglevel <= 2) console.log(text);
	}

	slow(text: string) {
		const logRoom = Rooms.get('slowlog');
		if (logRoom) {
			logRoom.add(`|c|~|/log ${text}`).update();
		} else {
			this.warn(text);
		}
	}

	/*********************************************************
	 * Resource Monitor
	 *********************************************************/

	clean() {
		this.clearNetworkUse();
		this.battlePreps.clear();
		this.battles.clear();
		this.connections.clear();
		IPTools.dnsblCache.clear();
	}

	/**
	 * Counts a connection. Returns true if the connection should be terminated for abuse.
	 */
	countConnection(ip: string, name = '') {
		if (Config.noipchecks || Config.nothrottle) return false;
		const [count, duration] = this.connections.increment(ip, 30 * 60 * 1000);
		if (count === 500) {
			this.adminlog(`[ResourceMonitor] IP ${ip} banned for cflooding (${count} times in ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
			return true;
		}

		if (count > 500) {
			if (count % 500 === 0) {
				const c = count / 500;
				if (c === 2 || c === 4 || c === 10 || c === 20 || c % 40 === 0) {
					this.adminlog(`[ResourceMonitor] IP ${ip} still cflooding (${count} times in ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
				}
			}
			return true;
		}

		return false;
	}

	/**
	 * Counts battles created. Returns true if the connection should be
	 * terminated for abuse.
	 */
	countBattle(ip: string, name = '') {
		if (Config.noipchecks || Config.nothrottle) return false;
		const [count, duration] = this.battles.increment(ip, 30 * 60 * 1000);
		if (duration < 5 * 60 * 1000 && count % 30 === 0) {
			this.adminlog(`[ResourceMonitor] IP ${ip} has battled ${count} times in the last ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
			return true;
		}

		if (count % 150 === 0) {
			this.adminlog(`[ResourceMonitor] IP ${ip} has battled ${count} times in the last ${Chat.toDurationString(duration)}${name ? ': ' + name : ''}`);
			return true;
		}

		return false;
	}

	/**
	 * Counts team validations. Returns true if too many.
	 */
	countPrepBattle(ip: string, connection: Connection) {
		if (Config.noipchecks || Config.nothrottle) return false;
		const count = this.battlePreps.increment(ip, 3 * 60 * 1000)[0];
		if (count <= 12) return false;
		if (count < 120 && Punishments.isSharedIp(ip)) return false;
		connection.popup('Due to high load, you are limited to 12 battles and team validations every 3 minutes.');
		return true;
	}

	/**
	 * Counts concurrent battles. Returns true if too many.
	 */
	countConcurrentBattle(count: number, connection: Connection) {
		if (Config.noipchecks || Config.nothrottle) return false;
		if (count <= 5) return false;
		connection.popup(`Due to high load, you are limited to 5 games at the same time.`);
		return true;
	}
	/**
	 * Counts group chat creation. Returns true if too much.
	 */
	countGroupChat(ip: string) {
		if (Config.noipchecks) return false;
		const count = this.groupChats.increment(ip, 60 * 60 * 1000)[0];
		return count > 4;
	}

	/**
	 * Counts commands that use HTTPs requests. Returns true if too many.
	 */
	countNetRequests(ip: string) {
		if (Config.noipchecks || Config.nothrottle) return false;
		const [count] = this.netRequests.increment(ip, 1 * 60 * 1000);
		if (count <= 10) return false;
		if (count < 120 && Punishments.isSharedIp(ip)) return false;
		return true;
	}

	/**
	 * Counts ticket creation. Returns true if too much.
	 */
	countTickets(ip: string) {
		if (Config.noipchecks || Config.nothrottle) return false;
		const count = this.tickets.increment(ip, 60 * 60 * 1000)[0];
		if (Punishments.isSharedIp(ip)) {
			return count >= 20;
		} else {
			return count >= 5;
		}
	}

	/**
	 * Counts the data length received by the last connection to send a
	 * message, as well as the data length in the server's response.
	 */
	countNetworkUse(size: number) {
		if (
			!Config.emergency || typeof this.activeIp !== 'string' ||
			Config.noipchecks || Config.nothrottle
		) {
			return;
		}
		if (this.activeIp in this.networkUse) {
			this.networkUse[this.activeIp] += size;
			this.networkCount[this.activeIp]++;
		} else {
			this.networkUse[this.activeIp] = size;
			this.networkCount[this.activeIp] = 1;
		}
	}

	writeNetworkUse() {
		let buf = '';
		for (const i in this.networkUse) {
			buf += `${this.networkUse[i]}\t${this.networkCount[i]}\t${i}\n`;
		}
		void Monitor.logPath('networkuse.tsv').write(buf);
	}

	clearNetworkUse() {
		if (Config.emergency) {
			this.networkUse = {};
			this.networkCount = {};
		}
	}

	/**
	 * Counts roughly the size of an object to have an idea of the server load.
	 */
	sizeOfObject(object: AnyObject) {
		const objectCache = new Set<[] | object>();
		const stack: any[] = [object];
		let bytes = 0;

		while (stack.length) {
			const value = stack.pop();
			switch (typeof value) {
			case 'boolean':
				bytes += 4;
				break;
			case 'string':
				bytes += value.length * 2;
				break;
			case 'number':
				bytes += 8;
				break;
			case 'object':
				if (!objectCache.has(value)) objectCache.add(value);
				if (Array.isArray(value)) {
					for (const el of value) stack.push(el);
				} else {
					for (const i in value) stack.push(value[i]);
				}
				break;
			}
		}

		return bytes;
	}

	sh(command: string, options: ExecOptions = {}): Promise<[number, string, string]> {
		return new Promise((resolve, reject) => {
			exec(command, options, (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => {
				resolve([error?.code || 0, `${stdout}`, `${stderr}`]);
			});
		});
	}

	async version() {
		let hash;
		try {
			await FS('.git/index').copyFile(Monitor.logPath('.gitindex').path);
			const index = Monitor.logPath('.gitindex');
			const options = {
				cwd: __dirname,
				env: { GIT_INDEX_FILE: index.path },
			};

			let [code, stdout, stderr] = await this.sh(`git add -A`, options);
			if (code || stderr) return;
			[code, stdout, stderr] = await this.sh(`git write-tree`, options);

			if (code || stderr) return;
			hash = stdout.trim();

			await this.sh(`git reset`, options);
			await index.unlinkIfExists();
		} catch {}
		return hash;
	}
};

Monitor.cleanInterval = setInterval(() => Monitor.clean(), MONITOR_CLEAN_TIMEOUT);
