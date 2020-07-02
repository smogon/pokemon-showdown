/**
 * Administration commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are administration commands, generally only useful for
 * programmers for managing the server.
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT
 */

import * as child_process from 'child_process';
import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';

import * as ProcessManager from '../../lib/process-manager';

export const commands: ChatCommands = {

	/*********************************************************
	 * Bot commands (chat-log manipulation)
	 *********************************************************/

	htmlbox(target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		target = this.canHTML(target)!;
		if (!target) return;
		target = Chat.collapseLineBreaksHTML(target);
		if (!this.canBroadcast(true, '!htmlbox')) return;
		if (this.broadcastMessage && !this.can('declare', null, room)) return false;

		if (!this.runBroadcast(true, '!htmlbox')) return;

		if (this.broadcasting) {
			return `/raw <div class="infobox">${target}</div>`;
		} else {
			this.sendReplyBox(target);
		}
	},
	htmlboxhelp: [
		`/htmlbox [message] - Displays a message, parsing HTML code contained.`,
		`!htmlbox [message] - Shows everyone a message, parsing HTML code contained. Requires: * # &`,
	],
	addhtmlbox(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		if (!this.canTalk()) return;
		target = this.canHTML(target)!;
		if (!target) return;
		if (!this.can('addhtml', null, room)) return;
		target = Chat.collapseLineBreaksHTML(target);
		if (!user.can('addhtml')) {
			target += Utils.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		return `/raw <div class="infobox">${target}</div>`;
	},
	addhtmlboxhelp: [
		`/addhtmlbox [message] - Shows everyone a message, parsing HTML code contained. Requires: * # &`,
	],
	addrankhtmlbox(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		if (!this.canTalk()) return;
		let [rank, html] = this.splitOne(target);
		if (!(rank in Config.groups)) return this.errorReply(`Group '${rank}' does not exist.`);
		html = this.canHTML(html)!;
		if (!html) return;
		if (!this.can('addhtml', null, room)) return;
		html = Chat.collapseLineBreaksHTML(html);
		if (!user.can('addhtml')) {
			html += Utils.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		room.sendRankedUsers(`|html|<div class="infobox">${html}</div>`, rank as GroupSymbol);
	},
	addrankhtmlboxhelp: [
		`/addrankhtmlbox [rank], [message] - Shows everyone with the specified rank or higher a message, parsing HTML code contained. Requires: * # &`,
	],
	changeuhtml: 'adduhtml',
	adduhtml(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		if (!this.canTalk()) return;

		let [name, html] = this.splitOne(target);
		name = toID(name);
		html = this.canHTML(html)!;
		if (!html) return this.parse(`/help ${cmd}`);
		if (!this.can('addhtml', null, room)) return;
		html = Chat.collapseLineBreaksHTML(html);
		if (!user.can('addhtml')) {
			html += Utils.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		if (cmd === 'changeuhtml') {
			room.attributedUhtmlchange(user, name, html);
		} else {
			return `/uhtml ${name},${html}`;
		}
	},
	adduhtmlhelp: [
		`/adduhtml [name], [message] - Shows everyone a message that can change, parsing HTML code contained.  Requires: * # &`,
	],
	changeuhtmlhelp: [
		`/changeuhtml [name], [message] - Changes the message previously shown with /adduhtml [name]. Requires: * # &`,
	],
	changerankuhtml: 'addrankuhtml',
	addrankuhtml(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		if (!this.canTalk()) return;

		const [rank, uhtml] = this.splitOne(target);
		if (!(rank in Config.groups)) return this.errorReply(`Group '${rank}' does not exist.`);
		let [name, html] = this.splitOne(uhtml);
		name = toID(name);
		html = this.canHTML(html)!;
		if (!html) return;
		if (!this.can('addhtml', null, room)) return;
		html = Chat.collapseLineBreaksHTML(html);
		if (!user.can('addhtml')) {
			html += Utils.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		html = `|uhtml${(cmd === 'changerankuhtml' ? 'change' : '')}|${name}|${html}`;
		room.sendRankedUsers(html, rank as GroupSymbol);
	},
	addrankuhtmlhelp: [
		`/addrankuhtml [rank], [name], [message] - Shows everyone with the specified rank or higher a message that can change, parsing HTML code contained.  Requires: * # &`,
	],
	changerankuhtmlhelp: [
		`/changerankuhtml [rank], [name], [message] - Changes the message previously shown with /addrankuhtml [rank], [name]. Requires: * # &`,
	],

	addline(target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	pminfobox(target, room, user, connection) {
		if (!this.canTalk()) return;
		if (!this.can('addhtml', null, room)) return false;
		if (!target) return this.parse("/help pminfobox");

		target = this.canHTML(this.splitTarget(target))!;
		if (!target) return;
		const targetUser = this.targetUser;

		if (!targetUser || !targetUser.connected) {
			return this.errorReply(`User ${this.targetUsername} is not currently online.`);
		}
		if (!(targetUser.id in room.users) && !user.can('addhtml')) {
			return this.errorReply("You do not have permission to use this command to users who are not in this room.");
		}
		if (
			targetUser.blockPMs &&
			(targetUser.blockPMs === true || !user.authAtLeast(targetUser.blockPMs)) && !user.can('lock')
		) {
			Chat.maybeNotifyBlocked('pm', targetUser, user);
			return this.errorReply("This user is currently blocking PMs.");
		}
		if (targetUser.locked && !user.can('lock')) {
			return this.errorReply("This user is currently locked, so you cannot send them a pminfobox.");
		}

		// Apply the infobox to the message
		target = `/raw <div class="infobox">${target}</div>`;
		const message = `|pm|${user.getIdentity()}|${targetUser.getIdentity()}|${target}`;

		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.id;
		user.lastPM = targetUser.id;
	},
	pminfoboxhelp: [`/pminfobox [user], [html]- PMs an [html] infobox to [user]. Requires * # &`],

	pmuhtmlchange: 'pmuhtml',
	pmuhtml(target, room, user, connection, cmd) {
		if (!this.canTalk()) return;
		if (!this.can('addhtml', null, room)) return false;
		if (!target) return this.parse("/help " + cmd);

		target = this.canHTML(this.splitTarget(target))!;
		if (!target) return;
		const targetUser = this.targetUser;

		if (!targetUser || !targetUser.connected) {
			return this.errorReply(`User ${this.targetUsername} is not currently online.`);
		}
		if (!(targetUser.id in room.users) && !user.can('addhtml')) {
			return this.errorReply("You do not have permission to use this command to users who are not in this room.");
		}
		if (targetUser.blockPMs &&
			(targetUser.blockPMs === true || !user.authAtLeast(targetUser.blockPMs)) && !user.can('lock')) {
			Chat.maybeNotifyBlocked('pm', targetUser, user);
			return this.errorReply("This user is currently blocking PMs.");
		}
		if (targetUser.locked && !user.can('lock')) {
			return this.errorReply("This user is currently locked, so you cannot send them UHTML.");
		}

		const message = `|pm|${user.getIdentity()}|${targetUser.getIdentity()}|/uhtml${(cmd === 'pmuhtmlchange' ? 'change' : '')} ${target}`;

		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.id;
		user.lastPM = targetUser.id;
	},
	pmuhtmlhelp: [`/pmuhtml [user], [name], [html] - PMs [html] that can change to [user]. Requires * # &`],
	pmuhtmlchangehelp: [
		`/pmuhtmlchange [user], [name], [html] - Changes html that was previously PMed to [user] to [html]. Requires * # &`,
	],

	nick() {
		this.sendReply(`||New to the Pokémon Showdown protocol? Your client needs to get a signed assertion from the login server and send /trn`);
		this.sendReply(`||https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md#global-messages`);
		this.sendReply(`||Follow the instructions for handling |challstr| in this documentation`);
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	memusage: 'memoryusage',
	memoryusage(target) {
		if (!this.can('lockdown')) return false;
		const memUsage = process.memoryUsage();
		const resultNums = [memUsage.rss, memUsage.heapUsed, memUsage.heapTotal];
		const units = ["B", "KiB", "MiB", "GiB", "TiB"];
		const results = resultNums.map(num => {
			const unitIndex = Math.floor(Math.log2(num) / 10); // 2^10 base log
			return `${(num / Math.pow(2, 10 * unitIndex)).toFixed(2)} ${units[unitIndex]}`;
		});
		this.sendReply(`||[Main process] RSS: ${results[0]}, Heap: ${results[1]} / ${results[2]}`);
	},

	forcehotpatch: 'hotpatch',
	async hotpatch(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.canUseConsole()) return false;

		if (Monitor.updateServerLock) {
			return this.errorReply("Wait for /updateserver to finish before hotpatching.");
		}
		const lock = Monitor.hotpatchLock;
		const hotpatches = ['chat', 'formats', 'loginserver', 'punishments', 'dnsbl'];
		const version = await Monitor.version();
		const requiresForce = (patch: string) =>
			version && cmd !== 'forcehotpatch' &&
			(Monitor.hotpatchVersions[patch] ?
				Monitor.hotpatchVersions[patch] === version :
				(global.__version && version === global.__version.tree));
		const requiresForceMessage = `The git work tree has not changed since the last time ${target} was hotpatched (${version?.slice(0, 8)}), use /forcehotpatch ${target} if you wish to hotpatch anyway.`;

		let patch = target;
		try {
			Utils.clearRequireCache({exclude: ['/.lib-dist/process-manager']});
			if (target === 'all') {
				if (lock['all']) {
					return this.errorReply(`Hot-patching all has been disabled by ${lock['all'].by} (${lock['all'].reason})`);
				}
				if (Config.disablehotpatchall) {
					return this.errorReply("This server does not allow for the use of /hotpatch all");
				}

				for (const hotpatch of hotpatches) {
					this.parse(`/hotpatch ${hotpatch}`);
				}
			} else if (target === 'chat' || target === 'commands') {
				patch = 'chat';
				if (lock['chat']) {
					return this.errorReply(`Hot-patching chat has been disabled by ${lock['chat'].by} (${lock['chat'].reason})`);
				}
				if (lock['tournaments']) {
					return this.errorReply(`Hot-patching tournaments has been disabled by ${lock['tournaments'].by} (${lock['tournaments'].reason})`);
				}
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				Chat.destroy();

				const processManagers = ProcessManager.processManagers;
				for (const manager of processManagers.slice()) {
					if (
						manager.filename.startsWith(FS('server/chat-plugins').path) ||
						manager.filename.startsWith(FS('.server-dist/chat-plugins').path)
					) {
						void manager.destroy();
					}
				}

				global.Chat = require('../chat').Chat;
				global.Tournaments = require('../tournaments').Tournaments;

				this.sendReply("Chat commands have been hot-patched.");
				Chat.loadPlugins();
				this.sendReply("Chat plugins have been loaded.");
			} else if (target === 'tournaments') {
				if (lock['tournaments']) {
					return this.errorReply(`Hot-patching tournaments has been disabled by ${lock['tournaments'].by} (${lock['tournaments'].reason})`);
				}
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				global.Tournaments = require('../tournaments').Tournaments;
				Chat.loadPluginData(Tournaments);
				this.sendReply("Tournaments have been hot-patched.");
			} else if (target === 'formats' || target === 'battles') {
				patch = 'formats';
				if (lock['formats']) {
					return this.errorReply(`Hot-patching formats has been disabled by ${lock['formats'].by} (${lock['formats'].reason})`);
				}
				if (lock['battles']) {
					return this.errorReply(`Hot-patching battles has been disabled by ${lock['battles'].by} (${lock['battles'].reason})`);
				}
				if (lock['validator']) {
					return this.errorReply(`Hot-patching the validator has been disabled by ${lock['validator'].by} (${lock['validator'].reason})`);
				}
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				// reload .sim-dist/dex.js
				global.Dex = require('../../sim/dex').Dex;
				// rebuild the formats list
				delete Rooms.global.formatList;
				// respawn validator processes
				void TeamValidatorAsync.PM.respawn();
				// respawn simulator processes
				void Rooms.PM.respawn();
				// broadcast the new formats list to clients
				Rooms.global.sendAll(Rooms.global.formatListText);

				this.sendReply("Formats have been hot-patched.");
			} else if (target === 'loginserver') {
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);
				FS('config/custom.css').unwatch();
				global.LoginServer = require('../loginserver').LoginServer;
				this.sendReply("The login server has been hot-patched. New login server requests will use the new code.");
			} else if (target === 'learnsets' || target === 'validator') {
				patch = 'validator';
				if (lock['validator']) {
					return this.errorReply(`Hot-patching the validator has been disabled by ${lock['validator'].by} (${lock['validator'].reason})`);
				}
				if (lock['formats']) {
					return this.errorReply(`Hot-patching formats has been disabled by ${lock['formats'].by} (${lock['formats'].reason})`);
				}
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				void TeamValidatorAsync.PM.respawn();
				this.sendReply("The team validator has been hot-patched. Any battles started after now will have teams be validated according to the new code.");
			} else if (target === 'punishments') {
				patch = 'punishments';
				if (lock['punishments']) {
					return this.errorReply(`Hot-patching punishments has been disabled by ${lock['punishments'].by} (${lock['punishments'].reason})`);
				}
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				global.Punishments = require('../punishments').Punishments;
				this.sendReply("Punishments have been hot-patched.");
			} else if (target === 'dnsbl' || target === 'datacenters' || target === 'iptools') {
				patch = 'dnsbl';
				if (requiresForce(patch)) return this.errorReply(requiresForceMessage);

				global.IPTools = require('../ip-tools').IPTools;
				void IPTools.loadDatacenters();
				this.sendReply("IPTools has been hot-patched.");
			} else if (target.startsWith('disable')) {
				this.sendReply("Disabling hot-patch has been moved to its own command:");
				return this.parse('/help nohotpatch');
			} else {
				return this.errorReply("Your hot-patch command was unrecognized.");
			}
		} catch (e) {
			Rooms.global.notifyRooms(
				['development', 'staff', 'upperstaff'] as RoomID[],
				`|c|${user.getIdentity()}|/log ${user.name} used /hotpatch ${patch} - but something failed while trying to hot-patch.`
			);
			return this.errorReply(`Something failed while trying to hot-patch ${patch}: \n${e.stack}`);
		}
		Monitor.hotpatchVersions[patch] = version;
		Rooms.global.notifyRooms(
			['development', 'staff', 'upperstaff'] as RoomID[],
			`|c|${user.getIdentity()}|/log ${user.name} used /hotpatch ${patch}`
		);
	},
	hotpatchhelp: [
		`Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: console access`,
		`Hot-patching has greater memory requirements than restarting`,
		`You can disable various hot-patches with /nohotpatch. For more information on this, see /help nohotpatch`,
		`/hotpatch chat - reload chat-commands.js and the chat-plugins`,
		`/hotpatch validator - spawn new team validator processes`,
		`/hotpatch formats - reload the .sim-dist/dex.js tree, rebuild and rebroad the formats list, and spawn new simulator and team validator processes`,
		`/hotpatch dnsbl - reloads IPTools datacenters`,
		`/hotpatch punishments - reloads new punishments code`,
		`/hotpatch loginserver - reloads new loginserver code`,
		`/hotpatch tournaments - reloads new tournaments code`,
		`/hotpatch all - hot-patches chat, tournaments, formats, login server, punishments, and dnsbl`,
		`/forcehotpatch [target] - as above, but performs the update regardless of whether the history has changed in git`,
	],

	hotpatchlock: 'nohotpatch',
	nohotpatch(target, room, user) {
		if (!this.can('gdeclare')) return;
		if (!target) return this.parse('/help nohotpatch');

		const separator = ' ';

		const hotpatch = toID(target.substr(0, target.indexOf(separator)));
		const reason = target.substr(target.indexOf(separator), target.length).trim();
		if (!reason || !target.includes(separator)) return this.parse('/help nohotpatch');

		const lock = Monitor.hotpatchLock;
		const validDisable = ['chat', 'battles', 'formats', 'validator', 'tournaments', 'punishments', 'all'];

		if (validDisable.includes(hotpatch)) {
			if (lock[hotpatch]) {
				return this.errorReply(`Hot-patching ${hotpatch} has already been disabled by ${lock[hotpatch].by} (${lock[hotpatch].reason})`);
			}
			lock[hotpatch] = {
				by: user.name,
				reason,
			};
			this.sendReply(`You have disabled hot-patching ${hotpatch}.`);
		} else {
			return this.errorReply("This hot-patch is not an option to disable.");
		}
		Rooms.global.notifyRooms(
			['development', 'staff', 'upperstaff'] as RoomID[],
			`|c|${user.getIdentity()}|/log ${user.name} has disabled hot-patching ${hotpatch}. Reason: ${reason}`
		);
	},
	nohotpatchhelp: [
		`/nohotpatch [chat|formats|battles|validator|tournaments|punishments|all] [reason] - Disables hotpatching the specified part of the simulator. Requires: &`,
	],

	'!processes': true,
	processes(target, room, user) {
		if (!this.can('lockdown')) return false;

		let buf = `<strong>${process.pid}</strong> - Main<br />`;
		for (const manager of ProcessManager.processManagers) {
			for (const [i, process] of manager.processes.entries()) {
				buf += `<strong>${process.getProcess().pid}</strong> - ${manager.basename} ${i} (load ${process.load})<br />`;
			}
			for (const [i, process] of manager.releasingProcesses.entries()) {
				buf += `<strong>${process.getProcess().pid}</strong> - PENDING RELEASE ${manager.basename} ${i} (load ${process.load})<br />`;
			}
		}

		this.sendReplyBox(buf);
	},

	async savelearnsets(target, room, user, connection) {
		if (!this.canUseConsole()) return false;
		this.sendReply("saving...");
		await FS('data/learnsets.js').write(`'use strict';\n\nexports.BattleLearnsets = {\n` +
			Object.entries(Dex.data.Learnsets).map(([id, entry]) => (
				`\t${id}: {learnset: {\n` +
				Object.entries(Dex.getLearnsetData(id as ID)).sort(
					(a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
				).map(([moveid, sources]) => (
					`\t\t${moveid}: ["` + sources.join(`", "`) + `"],\n`
				)).join('') +
				`\t}},\n`
			)).join('') +
		`};\n`);
		this.sendReply("learnsets.js saved.");
	},

	widendatacenters: 'adddatacenters',
	async adddatacenters(target, room, user, connection, cmd) {
		if (!this.can('lockdown')) return false;
		if (!target) return this.parse(`/help adddatacenters`);
		// should be in the format: IP, IP, name, URL
		const widen = (cmd === 'widendatacenters');

		const text = await FS('config/datacenters.csv').readIfExists();
		const datacenters = [];
		for (const row of text.split("\n")) {
			if (!row) continue;
			const rowSplit = row.split(',');
			const rowData = [
				IPTools.ipToNumber(rowSplit[0]),
				IPTools.ipToNumber(rowSplit[1]),
				IPTools.urlToHost(rowSplit[3]),
				row,
			];
			datacenters.push(rowData);
		}

		const data = String(target).split("\n");
		let successes = 0;
		let identicals = 0;
		let widenSuccesses = 0;
		for (const row of data) {
			if (!row) continue;
			const rowSplit = row.split(',');
			if (rowSplit.length !== 4) {
				this.errorReply(`Invalid row: ${row}`);
				continue;
			}
			const rowData = [
				IPTools.ipToNumber(rowSplit[0]),
				IPTools.ipToNumber(rowSplit[1]),
				IPTools.urlToHost(rowSplit[3]),
				row,
			];
			if (rowData[1] < rowData[0]) {
				this.errorReply(`Invalid range: ${row}`);
				continue;
			}

			let iMin = 0;
			let iMax = datacenters.length;
			while (iMin < iMax) {
				const i = Math.floor((iMax + iMin) / 2);
				if (rowData[0] > datacenters[i][0]) {
					iMin = i + 1;
				} else {
					iMax = i;
				}
			}
			if (iMin < datacenters.length) {
				const next = datacenters[iMin];
				if (rowData[0] === next[0] && rowData[1] === next[1]) {
					identicals++;
					continue;
				}
				if (rowData[0] <= next[0] && rowData[1] >= next[1]) {
					if (widen === true) {
						widenSuccesses++;
						datacenters.splice(iMin, 1, rowData);
						continue;
					}
					this.errorReply(`Too wide: ${row}`);
					this.errorReply(`Intersects with: ${next[3]}`);
					continue;
				}
				if (rowData[1] >= next[0]) {
					this.errorReply(`Could not insert: ${row}`);
					this.errorReply(`Intersects with: ${next[3]}`);
					continue;
				}
			}
			if (iMin > 0) {
				const prev = datacenters[iMin - 1];
				if (rowData[0] >= prev[0] && rowData[1] <= prev[1]) {
					this.errorReply(`Too narrow: ${row}`);
					this.errorReply(`Intersects with: ${prev[3]}`);
					continue;
				}
				if (rowData[0] <= prev[1]) {
					this.errorReply(`Could not insert: ${row}`);
					this.errorReply(`Intersects with: ${prev[3]}`);
					continue;
				}
			}
			successes++;
			datacenters.splice(iMin, 0, rowData);
		}

		const output = datacenters.map(r => r[3]).join('\n') + '\n';
		await FS('config/datacenters.csv').write(output);
		this.sendReply(`Done: ${successes} successes, ${identicals} unchanged.`);
		if (widenSuccesses) this.sendReply(`${widenSuccesses} widens.`);
	},
	adddatacentershelp: [
		`/adddatacenters [list] - Add datacenters to datacenters.csv`,
		`/widendatacenters [list] - As above, but don't throw errors if a new range completely covers an old range`,
		`[list] is in datacenters.csv format: [low],[high],[name],[url] (can be multiline) - example:`,
		`5.152.192.0,5.152.223.255,Redstation Limited,http://redstation.com/`,
		`Get datacenter info from whois, [low], [high] are the range in the last inetnum`,
	],

	disableladder(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (Ladders.disabled) {
			return this.errorReply(`/disableladder - Ladder is already disabled.`);
		}

		Ladders.disabled = true;

		this.modlog(`DISABLELADDER`);
		Monitor.log(`The ladder was disabled by ${user.name}.`);

		const innerHTML = (
			`<b>Due to technical difficulties, the ladder has been temporarily disabled.</b><br />` +
			`Rated games will no longer update the ladder. It will be back momentarily.`
		);

		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.type === 'battle') curRoom.rated = 0;
			if (curRoom.roomid !== 'global') curRoom.addRaw(`<div class="broadcast-red">${innerHTML}</div>`).update();
		}
		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|&|${u.group}${u.name}|/raw <div class="broadcast-red">${innerHTML}</div>`);
		}
	},

	enableladder(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!Ladders.disabled) {
			return this.errorReply(`/enable - Ladder is already enabled.`);
		}
		Ladders.disabled = false;

		this.modlog('ENABLELADDER');
		Monitor.log(`The ladder was enabled by ${user.name}.`);

		const innerHTML = (
			`<b>The ladder is now back.</b><br />` +
			`Rated games will update the ladder now..`
		);

		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.roomid !== 'global') curRoom.addRaw(`<div class="broadcast-green">${innerHTML}</div>`).update();
		}
		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|&|${u.group}${u.name}|/raw <div class="broadcast-green">${innerHTML}</div>`);
		}
	},

	lockdown(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.startLockdown();

		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /lockdown`);
	},
	lockdownhelp: [
		`/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: &`,
	],

	autolockdown: 'autolockdownkill',
	autolockdownkill(target, room, user) {
		if (!this.can('lockdown')) return false;
		if (Config.autolockdown === undefined) Config.autolockdown = true;

		if (this.meansYes(target)) {
			if (Config.autolockdown) {
				return this.errorReply("The server is already set to automatically kill itself upon the final battle finishing.");
			}
			Config.autolockdown = true;
			this.sendReply("The server is now set to automatically kill itself upon the final battle finishing.");
			const logRoom = Rooms.get('staff') || room;
			logRoom.roomlog(`${user.name} used /autolockdownkill on`);
		} else if (this.meansNo(target)) {
			if (!Config.autolockdown) {
				return this.errorReply("The server is already set to not automatically kill itself upon the final battle finishing.");
			}
			Config.autolockdown = false;
			this.sendReply("The server is now set to not automatically kill itself upon the final battle finishing.");
			const logRoom = Rooms.get('staff') || room;
			logRoom.roomlog(`${user.name} used /autolockdownkill off`);
		} else {
			return this.parse('/help autolockdownkill');
		}
	},
	autolockdownkillhelp: [
		`/autolockdownkill on - Turns on the setting to enable the server to automatically kill itself upon the final battle finishing. Requires &`,
		`/autolockdownkill off - Turns off the setting to enable the server to automatically kill itself upon the final battle finishing. Requires &`,
	],

	prelockdown(target, room, user) {
		if (!this.can('lockdown')) return false;
		Rooms.global.lockdown = 'pre';
		this.sendReply("Tournaments have been disabled in preparation for the server restart.");
		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /prelockdown`);
	},

	slowlockdown(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.startLockdown(undefined, true);

		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /slowlockdown`);
	},

	crashfixed: 'endlockdown',
	endlockdown(target, room, user, connection, cmd) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.errorReply("We're not under lockdown right now.");
		}
		if (Rooms.global.lockdown !== true && cmd === 'crashfixed') {
			return this.errorReply('/crashfixed - There is no active crash.');
		}

		const message = cmd === 'crashfixed' ?
			`<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b></div>` :
			`<div class="broadcast-green"><b>The server restart was canceled.</b></div>`;
		if (Rooms.global.lockdown === true) {
			for (const curRoom of Rooms.rooms.values()) {
				if (curRoom.roomid !== 'global') curRoom.addRaw(message).update();
			}
			for (const curUser of Users.users.values()) {
				curUser.send(`|pm|&|${curUser.group}${curUser.name}|/raw ${message}`);
			}
		} else {
			this.sendReply("Preparation for the server shutdown was canceled.");
		}
		Rooms.global.lockdown = false;

		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /endlockdown`);
	},
	endlockdownhelp: [
		`/endlockdown - Cancels the server restart and takes the server out of lockdown state. Requires: &`,
		`/crashfixed - Ends the active lockdown caused by a crash without the need of a restart. Requires: &`,
	],

	emergency(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Config.emergency) {
			return this.errorReply("We're already in emergency mode.");
		}
		Config.emergency = true;
		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.roomid !== 'global') {
				curRoom.addRaw(`<div class="broadcast-red">The server has entered emergency mode. Some features might be disabled or limited.</div>`).update();
			}
		}

		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /emergency.`);
	},

	endemergency(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Config.emergency) {
			return this.errorReply("We're not in emergency mode.");
		}
		Config.emergency = false;
		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.roomid !== 'global') {
				curRoom.addRaw(`<div class="broadcast-green"><b>The server is no longer in emergency mode.</b></div>`).update();
			}
		}

		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /endemergency.`);
	},

	kill(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Rooms.global.lockdown !== true) {
			return this.errorReply("For safety reasons, /kill can only be used during lockdown.");
		}

		if (Monitor.updateServerLock) {
			return this.errorReply("Wait for /updateserver to finish before using /kill.");
		}

		const logRoom = Rooms.get('staff') || room;
		if (!(logRoom as any).destroyLog) {
			process.exit();
			return;
		}
		logRoom.roomlog(`${user.name} used /kill`);
		(logRoom as any).destroyLog(() => {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(() => {
			process.exit();
		}, 10000);
	},
	killhelp: [`/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: &`],

	loadbanlist(target, room, user, connection) {
		if (!this.can('lockdown')) return false;

		connection.sendTo(room, "Loading ipbans.txt...");
		Punishments.loadBanlist().then(
			() => connection.sendTo(room, "ipbans.txt has been reloaded."),
			error => connection.sendTo(room, `Something went wrong while loading ipbans.txt: ${error}`)
		);
	},
	loadbanlisthelp: [
		`/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: &`,
	],

	refreshpage(target, room, user) {
		if (!this.can('lockdown')) return false;
		Rooms.global.sendAll('|refresh|');
		const logRoom = Rooms.get('staff') || room;
		logRoom.roomlog(`${user.name} used /refreshpage`);
	},

	async updateserver(target, room, user, connection) {
		if (!this.canUseConsole()) return false;

		if (Monitor.updateServerLock) {
			return this.errorReply(`/updateserver - Another update is already in progress (or a previous update crashed).`);
		}

		Monitor.updateServerLock = true;

		const logRoom = Rooms.get('staff') || room;

		function exec(command: string): Promise<[number, string, string]> {
			logRoom.roomlog(`$ ${command}`);
			return new Promise((resolve, reject) => {
				child_process.exec(command, {
					cwd: __dirname,
				}, (error, stdout, stderr) => {
					let log = `[o] ${stdout}[e] ${stderr}`;
					if (error) log = `[c] ${error.code}\n${log}`;
					logRoom.roomlog(log);
					resolve([error?.code || 0, stdout, stderr]);
				});
			});
		}

		this.sendReply(`Fetching newest version...`);
		logRoom.roomlog(`${user.name} used /updateserver`);

		let [code, stdout, stderr] = await exec(`git fetch`);
		if (code) throw new Error(`updateserver: Crash while fetching - make sure this is a Git repository`);
		if (!stdout && !stderr) {
			this.sendReply(`There were no updates.`);
			[code, stdout, stderr] = await exec('node ../../build');
			if (stderr) {
				return this.errorReply(`Crash while rebuilding: ${stderr}`);
			}
			this.sendReply(`Rebuilt.`);
			Monitor.updateServerLock = false;
			return;
		}

		[code, stdout, stderr] = await exec(`git rev-parse HEAD`);
		if (code || stderr) throw new Error(`updateserver: Crash while grabbing hash`);
		const oldHash = String(stdout).trim();

		[code, stdout, stderr] = await exec(`git stash save --include-untracked "PS /updateserver autostash"`);
		let stashedChanges = true;
		if (code) throw new Error(`updateserver: Crash while stashing`);
		if ((stdout + stderr).includes("No local changes")) {
			stashedChanges = false;
		} else if (stderr) {
			throw new Error(`updateserver: Crash while stashing`);
		} else {
			this.sendReply(`Saving changes...`);
		}

		// errors can occur while rebasing or popping the stash; make sure to recover
		try {
			this.sendReply(`Rebasing...`);
			[code] = await exec(`git rebase FETCH_HEAD`);
			if (code) {
				// conflict while rebasing
				await exec(`git rebase --abort`);
				throw new Error(`restore`);
			}

			if (stashedChanges) {
				this.sendReply(`Restoring saved changes...`);
				[code] = await exec(`git stash pop`);
				if (code) {
					// conflict while popping stash
					await exec(`git reset HEAD .`);
					await exec(`git checkout .`);
					throw new Error(`restore`);
				}
			}

			this.sendReply(`SUCCESSFUL, server updated.`);
		} catch (e) {
			// failed while rebasing or popping the stash
			await exec(`git reset --hard ${oldHash}`);
			await exec(`git stash pop`);
			this.sendReply(`FAILED, old changes restored.`);
		}
		[code, stdout, stderr] = await exec('node ../../build');
		if (stderr) {
			return this.errorReply(`Crash while rebuilding: ${stderr}`);
		}
		this.sendReply(`Rebuilt.`);
		Monitor.updateServerLock = false;
	},

	async rebuild(target, room, user, connection) {
		const logRoom = Rooms.get('staff') || room;

		function exec(command: string): Promise<[number, string, string]> {
			logRoom.roomlog(`$ ${command}`);
			return new Promise((resolve, reject) => {
				child_process.exec(command, {
					cwd: __dirname,
				}, (error, stdout, stderr) => {
					let log = `[o] ${stdout}[e] ${stderr}`;
					if (error) log = `[c] ${error.code}\n${log}`;
					logRoom.roomlog(log);
					resolve([error?.code || 0, stdout, stderr]);
				});
			});
		}

		if (!this.canUseConsole()) return false;
		Monitor.updateServerLock = true;
		const [, , stderr] = await exec('node ../../build');
		if (stderr) {
			return this.errorReply(`Crash while rebuilding: ${stderr}`);
		}
		Monitor.updateServerLock = false;
		this.sendReply(`Rebuilt.`);
	},

	/*********************************************************
	 * Low-level administration commands
	 *********************************************************/

	bash(target, room, user, connection) {
		if (!this.canUseConsole()) return false;
		if (!target) return this.parse('/help bash');

		connection.sendTo(room, `$ ${target}`);
		child_process.exec(target, (error, stdout, stderr) => {
			connection.sendTo(room, (`${stdout}${stderr}`));
		});
	},
	bashhelp: [`/bash [command] - Executes a bash command on the server. Requires: & console access`],

	async eval(target, room, user, connection) {
		if (!this.canUseConsole()) return false;
		if (!this.runBroadcast(true)) return;
		const logRoom = Rooms.get('upperstaff') || Rooms.get('staff');

		if (this.message.startsWith('>>') && room) {
			this.broadcasting = true;
			this.broadcastToRoom = true;
		}
		this.sendReply(`|html|<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">&gt;&gt;&nbsp;</td><td>${Chat.getReadmoreCodeBlock(target)}</td></tr><table>`);
		logRoom?.roomlog(`>> ${target}`);
		try {
			/* eslint-disable no-eval, @typescript-eslint/no-unused-vars */
			const battle = room.battle;
			const me = user;
			let result = eval(target);
			/* eslint-enable no-eval, @typescript-eslint/no-unused-vars */

			if (result?.then) {
				result = `Promise -> ${Utils.visualize(await result)}`;
			} else {
				result = Utils.visualize(result);
			}
			this.sendReply(`|html|<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">&lt;&lt;&nbsp;</td><td>${Chat.getReadmoreCodeBlock(result)}</td></tr><table>`);
			logRoom?.roomlog(`<< ${result}`);
		} catch (e) {
			const message = ('' + e.stack).replace(/\n *at CommandContext\.eval [\s\S]*/m, '');
			this.sendReply(`|html|<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">&lt;&lt;&nbsp;</td><td>${Chat.getReadmoreCodeBlock(message)}</td></tr><table>`);
			logRoom?.roomlog(`<< ${message}`);
		}
	},

	evalbattle(target, room, user, connection) {
		if (!this.canUseConsole()) return false;
		if (!this.runBroadcast(true)) return;
		if (!room.battle) {
			return this.errorReply("/evalbattle - This isn't a battle room.");
		}

		void room.battle.stream.write(`>eval ${target.replace(/\n/g, '\f')}`);
	},

	ebat: 'editbattle',
	editbattle(target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help editbattle');
		if (!room.battle) {
			this.errorReply("/editbattle - This is not a battle room.");
			return false;
		}
		const battle = room.battle;
		let cmd;
		const spaceIndex = target.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex).toLowerCase();
			target = target.substr(spaceIndex + 1);
		} else {
			cmd = target.toLowerCase();
			target = '';
		}
		if (cmd.charAt(cmd.length - 1) === ',') cmd = cmd.slice(0, -1);
		const targets = target.split(',');
		function getPlayer(input: string) {
			const player = battle.playerTable[toID(input)];
			if (player) return player.slot;
			if (input.includes('1')) return 'p1';
			if (input.includes('2')) return 'p2';
			return 'p3';
		}
		function getPokemon(input: string) {
			if (/^[0-9]+$/.test(input.trim())) {
				return `.pokemon[${(parseInt(input) - 1)}]`;
			}
			return `.pokemon.find(p => p.baseSpecies.id==='${toID(input)}' || p.species.id==='${toID(input)}')`;
		}
		switch (cmd) {
		case 'hp':
		case 'h':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(
				`>eval let p=${getPlayer(targets[0]) + getPokemon(targets[1])};p.sethp(${parseInt(targets[2])});if (p.isActive)battle.add('-damage',p,p.getHealth);`
			);
			break;
		case 'status':
		case 's':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(
				`>eval let pl=${getPlayer(targets[0])};let p=pl${getPokemon(targets[1])};p.setStatus('${toID(targets[2])}');if (!p.isActive){battle.add('','please ignore the above');battle.add('-status',pl.active[0],pl.active[0].status,'[silent]');}`
			);
			break;
		case 'pp':
			if (targets.length !== 4) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(
				`>eval let pl=${getPlayer(targets[0])};let p=pl${getPokemon(targets[1])};p.getMoveData('${toID(targets[2])}').pp = ${parseInt(targets[3])};`
			);
			break;
		case 'boost':
		case 'b':
			if (targets.length !== 4) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(
				`>eval let p=${getPlayer(targets[0]) + getPokemon(targets[1])};battle.boost({${toID(targets[2])}:${parseInt(targets[3])}},p)`
			);
			break;
		case 'volatile':
		case 'v':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(
				`>eval let p=${getPlayer(targets[0]) + getPokemon(targets[1])};p.addVolatile('${toID(targets[2])}')`
			);
			break;
		case 'sidecondition':
		case 'sc':
			if (targets.length !== 2) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(`>eval let p=${getPlayer(targets[0])}.addSideCondition('${toID(targets[1])}', 'debug')`);
			break;
		case 'fieldcondition': case 'pseudoweather':
		case 'fc':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(`>eval battle.field.addPseudoWeather('${toID(targets[0])}', 'debug')`);
			break;
		case 'weather':
		case 'w':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(`>eval battle.field.setWeather('${toID(targets[0])}', 'debug')`);
			break;
		case 'terrain':
		case 't':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			void battle.stream.write(`>eval battle.field.setTerrain('${toID(targets[0])}', 'debug')`);
			break;
		default:
			this.errorReply(`Unknown editbattle command: ${cmd}`);
			return this.parse('/help editbattle');
		}
	},
	editbattlehelp: [
		`/editbattle hp [player], [pokemon], [hp]`,
		`/editbattle status [player], [pokemon], [status]`,
		`/editbattle pp [player], [pokemon], [move], [pp]`,
		`/editbattle boost [player], [pokemon], [stat], [amount]`,
		`/editbattle volatile [player], [pokemon], [volatile]`,
		`/editbattle sidecondition [player], [sidecondition]`,
		`/editbattle fieldcondition [fieldcondition]`,
		`/editbattle weather [weather]`,
		`/editbattle terrain [terrain]`,
		`Short forms: /ebat h OR s OR pp OR b OR v OR sc OR fc OR w OR t`,
		`[player] must be a username or number, [pokemon] must be species name or party slot number (not nickname), [move] must be move name.`,
	],
};
