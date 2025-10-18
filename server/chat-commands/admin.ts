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

import * as path from 'path';
import * as child_process from 'child_process';
import { FS, Utils, ProcessManager, SQL } from '../../lib';

interface ProcessData {
	cmd: string;
	cpu?: string;
	time?: string;
	ram?: string;
}

function hasDevAuth(user: User) {
	const devRoom = Rooms.get('development');
	return devRoom && Users.Auth.atLeast(devRoom.auth.getDirect(user.id), '%');
}

function bash(command: string, context: Chat.CommandContext, cwd?: string): Promise<[number, string, string]> {
	context.stafflog(`$ ${command}`);
	if (!cwd) cwd = FS.ROOT_PATH;
	return new Promise(resolve => {
		child_process.exec(command, { cwd }, (error, stdout, stderr) => {
			let log = `[o] ${stdout}[e] ${stderr}`;
			if (error) log = `[c] ${error.code}\n${log}`;
			context.stafflog(log);
			resolve([error?.code || 0, stdout, stderr]);
		});
	});
}

function keysIncludingNonEnumerable(obj: object) {
	const methods = new Set<string>();
	let current = obj;
	do {
		const curProps = Object.getOwnPropertyNames(current);
		for (const prop of curProps) {
			methods.add(prop);
		}
	} while ((current = Object.getPrototypeOf(current)));
	return [...methods];
}

function keysToCopy(obj: object) {
	return keysIncludingNonEnumerable(obj).filter(
		// `__` matches sucrase init methods
		// prop is excluded because it can hit things like hasOwnProperty that are potentially annoying (?) with
		// the kind of prototype patching we want to do here - same for constructor and valueOf
		prop => !(prop.includes('__') || prop.toLowerCase().includes('prop') || ['valueOf', 'constructor'].includes(prop))
	);
}

/**
 * @returns {boolean} Whether or not the rebase failed
 */
async function updateserver(context: Chat.CommandContext, codePath: string) {
	const exec = (command: string) => bash(command, context, codePath);

	context.sendReply(`Fetching newest version of code in the repository ${codePath}...`);

	let [code, stdout, stderr] = await exec(`git fetch`);
	if (code) throw new Error(`updateserver: Crash while fetching - make sure this is a Git repository`);
	if (!stdout && !stderr) {
		context.sendReply(`There were no updates.`);
		Monitor.updateServerLock = false;
		return true;
	}

	[code, stdout, stderr] = await exec(`git rev-parse HEAD`);
	if (code || stderr) throw new Error(`updateserver: Crash while grabbing hash`);
	const oldHash = String(stdout).trim();

	[code, stdout, stderr] = await exec(`git stash save "PS /updateserver autostash"`);
	let stashedChanges = true;
	if (code) throw new Error(`updateserver: Crash while stashing`);
	if ((stdout + stderr).includes("No local changes")) {
		stashedChanges = false;
	} else if (stderr) {
		throw new Error(`updateserver: Crash while stashing`);
	} else {
		context.sendReply(`Saving changes...`);
	}

	// errors can occur while rebasing or popping the stash; make sure to recover
	try {
		context.sendReply(`Rebasing...`);
		[code] = await exec(`git rebase --no-autostash FETCH_HEAD`);
		if (code) {
			// conflict while rebasing
			await exec(`git rebase --abort`);
			throw new Error(`restore`);
		}

		if (stashedChanges) {
			context.sendReply(`Restoring saved changes...`);
			[code] = await exec(`git stash pop`);
			if (code) {
				// conflict while popping stash
				await exec(`git reset HEAD .`);
				await exec(`git checkout .`);
				throw new Error(`restore`);
			}
		}

		return true;
	} catch {
		// failed while rebasing or popping the stash
		await exec(`git reset --hard ${oldHash}`);
		if (stashedChanges) await exec(`git stash pop`);
		return false;
	}
}

export const commands: Chat.ChatCommands = {
	potd(target, room, user) {
		this.canUseConsole();
		const species = Dex.species.get(target);
		if (species.id === Config.potd) {
			throw new Chat.ErrorMessage(`The PotD is already set to ${species.name}`);
		}
		if (!species.exists) throw new Chat.ErrorMessage(`Pokemon "${target}" not found.`);
		if (!Dex.species.getFullLearnset(species.id).length) {
			throw new Chat.ErrorMessage(`That Pokemon has no learnset and cannot be used as the PotD.`);
		}
		Config.potd = species.id;
		for (const process of Rooms.PM.processes) {
			process.getProcess().send(`EVAL\n\nConfig.potd = '${species.id}'`);
		}
		this.addGlobalModAction(`${user.name} set the PotD to ${species.name}.`);
		this.globalModlog(`POTD`, null, species.name);
	},
	potdhelp: [
		`/potd [pokemon] - Set the Pokemon of the Day to the given [pokemon]. Requires: ~`,
	],

	/*********************************************************
	 * Bot commands (chat-log manipulation)
	 *********************************************************/

	htmlbox(target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		room = this.requireRoom();
		this.checkHTML(target);
		target = Chat.collapseLineBreaksHTML(target);
		this.checkBroadcast(true, '!htmlbox');
		if (this.broadcastMessage) this.checkCan('declare', null, room);

		if (!this.runBroadcast(true, '!htmlbox')) return;

		if (this.broadcasting) {
			return `/raw <div class="infobox">${target}</div>`;
		} else {
			this.sendReplyBox(target);
		}
	},
	htmlboxhelp: [
		`/htmlbox [message] - Displays a message, parsing HTML code contained.`,
		`!htmlbox [message] - Shows everyone a message, parsing HTML code contained. Requires: * # ~`,
	],
	addhtmlbox(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		room = this.requireRoom();
		this.checkChat();
		this.checkHTML(target);
		this.checkCan('addhtml', null, room);
		target = Chat.collapseLineBreaksHTML(target);
		if (user.tempGroup !== '*') {
			target += Utils.html`<div class="gray" style="float:right;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		return `/raw <div class="infobox">${target}</div>`;
	},
	addhtmlboxhelp: [
		`/addhtmlbox [message] - Shows everyone a message, parsing HTML code contained. Requires: * # ~`,
	],
	addrankhtmlbox(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help ' + cmd);
		this.checkChat();
		let [rank, html] = this.splitOne(target);
		if (!(rank in Config.groups)) throw new Chat.ErrorMessage(`Group '${rank}' does not exist.`);
		html = this.checkHTML(html);
		this.checkCan('addhtml', null, room);
		html = Chat.collapseLineBreaksHTML(html);
		if (user.tempGroup !== '*') {
			html += Utils.html`<div class="gray" style="float:right;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		room.sendRankedUsers(`|html|<div class="infobox">${html}</div>`, rank as GroupSymbol);
	},
	addrankhtmlboxhelp: [
		`/addrankhtmlbox [rank], [message] - Shows everyone with the specified rank or higher a message, parsing HTML code contained. Requires: * # ~`,
	],
	changeuhtml: 'adduhtml',
	adduhtml(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help ' + cmd);
		this.checkChat();

		let [name, html] = this.splitOne(target);
		name = toID(name);
		html = this.checkHTML(html);
		this.checkCan('addhtml', null, room);
		html = Chat.collapseLineBreaksHTML(html);
		if (user.tempGroup !== '*') {
			html += Utils.html`<div class="gray" style="float:right;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		if (cmd === 'changeuhtml') {
			room.attributedUhtmlchange(user, name, html);
		} else {
			return `/uhtml ${name},${html}`;
		}
	},
	adduhtmlhelp: [
		`/adduhtml [name], [message] - Shows everyone a message that can change, parsing HTML code contained.  Requires: * # ~`,
	],
	changeuhtmlhelp: [
		`/changeuhtml [name], [message] - Changes the message previously shown with /adduhtml [name]. Requires: * # ~`,
	],
	changerankuhtml: 'addrankuhtml',
	addrankuhtml(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help ' + cmd);
		this.checkChat();

		const [rank, uhtml] = this.splitOne(target);
		if (!(rank in Config.groups)) throw new Chat.ErrorMessage(`Group '${rank}' does not exist.`);
		let [name, html] = this.splitOne(uhtml);
		name = toID(name);
		html = this.checkHTML(html);
		this.checkCan('addhtml', null, room);
		html = Chat.collapseLineBreaksHTML(html);
		if (user.tempGroup !== '*') {
			html += Utils.html`<div class="gray" style="float:right;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		html = `|uhtml${(cmd === 'changerankuhtml' ? 'change' : '')}|${name}|${html}`;
		room.sendRankedUsers(html, rank as GroupSymbol);
	},
	addrankuhtmlhelp: [
		`/addrankuhtml [rank], [name], [message] - Shows everyone with the specified rank or higher a message that can change, parsing HTML code contained.  Requires: * # ~`,
	],
	changerankuhtmlhelp: [
		`/changerankuhtml [rank], [name], [message] - Changes the message previously shown with /addrankuhtml [rank], [name]. Requires: * # ~`,
	],

	deletenamecolor: 'setnamecolor',
	snc: 'setnamecolor',
	dnc: 'setnamecolor',
	async setnamecolor(target, room, user, connection, cmd) {
		this.checkCan('rangeban');
		if (!toID(target)) {
			return this.parse(`/help ${cmd}`);
		}
		let [userid, source] = this.splitOne(target).map(toID);
		if (cmd.startsWith('d')) {
			source = '';
		} else if (!source || source.length > 18) {
			throw new Chat.ErrorMessage(
				`Specify a source username to take the color from. Name must be <19 characters.`
			);
		}
		if (!userid || userid.length > 18) {
			throw new Chat.ErrorMessage(`Specify a valid name to set a new color for. Names must be <19 characters.`);
		}
		const [res, error] = await LoginServer.request('updatenamecolor', {
			userid,
			source,
			by: user.id,
		});
		if (error) {
			throw new Chat.ErrorMessage(error.message);
		}
		if (!res || res.actionerror) {
			throw new Chat.ErrorMessage(res?.actionerror || "The loginserver is currently disabled.");
		}
		if (source) {
			return this.sendReply(
				`|html|<username>${userid}</username>'s namecolor was ` +
				`successfully updated to match '<username>${source}</username>'. ` +
				`Refresh your browser for it to take effect.`
			);
		} else {
			return this.sendReply(`${userid}'s namecolor was removed.`);
		}
	},
	setnamecolorhelp: [
		`/setnamecolor OR /snc [username], [source name] - Set [username]'s name color to match the [source name]'s color.`,
		`Requires: ~`,
	],
	deletenamecolorhelp: [
		`/deletenamecolor OR /dnc [username] - Remove [username]'s namecolor.`,
		`Requires: ~`,
	],

	pline(target, room, user) {
		// Secret console admin command
		this.canUseConsole();
		const message = target.length > 30 ? target.slice(0, 30) + '...' : target;
		this.checkBroadcast(true, `!pline ${message}`);
		this.runBroadcast(true);
		this.sendReply(target);
	},
	plinehelp: [
		`/pline [protocol lines] - Adds the given [protocol lines] to the current room. Requires: ~ console access`,
	],

	pminfobox(target, room, user, connection) {
		this.checkChat();
		room = this.requireRoom();
		this.checkCan('addhtml', null, room);
		if (!target) return this.parse("/help pminfobox");

		const { targetUser, rest: html } = this.requireUser(target);
		this.checkHTML(html);
		this.checkPMHTML(targetUser);

		const message = `|pm|${user.getIdentity()}|${targetUser.getIdentity()}|` +
			`/raw <div class="infobox">${html}</div>`;

		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.id;
		user.lastPM = targetUser.id;
	},
	pminfoboxhelp: [`/pminfobox [user], [html]- PMs an [html] infobox to [user]. Requires * # ~`],

	pmuhtmlchange: 'pmuhtml',
	pmuhtml(target, room, user, connection, cmd) {
		this.checkChat();
		room = this.requireRoom();
		this.checkCan('addhtml', null, room);
		if (!target) return this.parse("/help " + cmd);

		const { targetUser, rest: html } = this.requireUser(target);
		this.checkHTML(html);
		this.checkPMHTML(targetUser);

		const message = `|pm|${user.getIdentity()}|${targetUser.getIdentity()}|` +
			`/uhtml${(cmd === 'pmuhtmlchange' ? 'change' : '')} ${html}`;

		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.id;
		user.lastPM = targetUser.id;
	},
	pmuhtmlhelp: [`/pmuhtml [user], [name], [html] - PMs [html] that can change to [user]. Requires * # ~`],
	pmuhtmlchangehelp: [
		`/pmuhtmlchange [user], [name], [html] - Changes html that was previously PMed to [user] to [html]. Requires * # ~`,
	],

	closehtmlpage: 'sendhtmlpage',
	changehtmlpageselector: 'sendhtmlpage',
	sendhtmlpage(target, room, user, connection, cmd) {
		room = this.requireRoom();
		this.checkCan('addhtml', null, room);

		const closeHtmlPage = cmd === 'closehtmlpage';

		const [targetStr, rest] = this.splitOne(target).map(str => str.trim());
		const targets = targetStr.split('|').map(u => u.trim());
		let [pageid, content] = this.splitOne(rest);
		let selector: string | undefined;
		if (cmd === 'changehtmlpageselector') {
			[selector, content] = this.splitOne(content);
			if (!selector) return this.parse(`/help ${cmd}`);
		}
		if (!pageid || (closeHtmlPage ? content : !content)) {
			return this.parse(`/help ${cmd}`);
		}

		pageid = `${user.id}-${toID(pageid)}`;

		const successes: string[] = [], errors: string[] = [];

		content = this.checkHTML(content);

		targets.forEach(targetUsername => {
			const targetUser = Users.get(targetUsername);
			if (!targetUser) return errors.push(`${targetUsername} [offline/misspelled]`);

			if (targetUser.locked && !this.user.can('lock')) {
				return errors.push(`${targetUser.name} [locked]`);
			}

			let targetConnections = [];
			// find if a connection has specifically requested this page
			for (const c of targetUser.connections) {
				if (c.lastRequestedPage === pageid) {
					targetConnections.push(c);
				}
			}
			if (!targetConnections.length) {
				// no connection has requested it - verify that we share a room
				try {
					this.checkPMHTML(targetUser);
				} catch {
					return errors.push(`${targetUser.name} [not in room / blocking PMs]`);
				}
				targetConnections = targetUser.connections;
			}

			for (const targetConnection of targetConnections) {
				const context = new Chat.PageContext({
					user: targetUser,
					connection: targetConnection,
					pageid: `view-bot-${pageid}`,
				});
				if (closeHtmlPage) {
					context.send(`|deinit|`);
				} else if (selector) {
					context.send(`|selectorhtml|${selector}|${content}`);
				} else {
					context.title = `[${user.name}] ${pageid}`;
					context.setHTML(content);
				}
			}
			successes.push(targetUser.name);
		});

		if (closeHtmlPage) {
			if (successes.length) {
				this.sendReply(`Closed the bot page ${pageid} for ${Chat.toListString(successes)}.`);
			}
			if (errors.length) {
				this.errorReply(`Unable to close the bot page for ${Chat.toListString(errors)}.`);
			}
		} else {
			if (successes.length) {
				this.sendReply(`Sent ${Chat.toListString(successes)}${selector ? ` the selector ${selector} on` : ''} the bot page ${pageid}.`);
			}
			if (errors.length) {
				this.errorReply(`Unable to send the bot page ${pageid} to ${Chat.toListString(errors)}.`);
			}
		}

		if (!successes.length) return false;
	},
	sendhtmlpagehelp: [
		`/sendhtmlpage [userid], [pageid], [html] - Sends [userid] the bot page [pageid] with the content [html]. Requires: * # ~`,
	],
	changehtmlpageselectorhelp: [
		`/changehtmlpageselector [userid], [pageid], [selector], [html] - Sends [userid] the content [html] for the selector [selector] on the bot page [pageid]. Requires: * # ~`,
	],
	closehtmlpagehelp: [
		`/closehtmlpage [userid], [pageid], - Closes the bot page [pageid] for [userid]. Requires: * # ~`,
	],

	highlighthtmlpage(target, room, user) {
		const { targetUser, rest } = this.requireUser(target);
		let [pageid, title, highlight] = Utils.splitFirst(rest, ',', 2);

		pageid = `${user.id}-${toID(pageid)}`;
		if (!pageid || !target) return this.parse(`/help highlighthtmlpage`);
		if (targetUser.locked && !this.user.can('lock')) {
			throw new Chat.ErrorMessage("This user is currently locked, so you cannot send them highlights.");
		}

		const buf = `|tempnotify|bot-${pageid}|${title} [from ${user.name}]|${highlight ? highlight : ''}`;
		let targetConnections = [];
		this.checkPMHTML(targetUser);
		// try to locate connections that have requested the page recently
		for (const c of targetUser.connections) {
			if (c.lastRequestedPage === pageid) {
				targetConnections.push(c);
			}
		}
		// there are none, default to the first connection
		if (!targetConnections.length) {
			targetConnections = [targetUser.connections[0]];
		}
		for (const conn of targetConnections) {
			conn.send(`>view-bot-${pageid}\n${buf}`);
		}

		this.sendReply(`Sent a highlight to ${targetUser.name} on the bot page ${pageid}.`);
	},
	highlighthtmlpagehelp: [
		`/highlighthtmlpage [userid], [pageid], [title], [optional highlight] - Sends a highlight to [userid] if they're viewing the bot page [pageid].`,
		`If a [highlight] is specified, only highlights them if they have that term on their highlight list.`,
	],

	changeprivateuhtml: 'sendprivatehtmlbox',
	sendprivateuhtml: 'sendprivatehtmlbox',
	sendprivatehtmlbox(target, room, user, connection, cmd) {
		room = this.requireRoom();
		this.checkCan('addhtml', null, room);

		const [targetStr, rest] = this.splitOne(target).map(str => str.trim());
		const targets = targetStr.split('|').map(u => u.trim());

		let html: string;
		let messageType: string;
		let name: string | undefined;
		const plainHtml = cmd === 'sendprivatehtmlbox';
		if (plainHtml) {
			html = rest;
			messageType = 'html';
		} else {
			[name, html] = this.splitOne(rest);
			if (!name) return this.parse('/help sendprivatehtmlbox');

			messageType = `uhtml${(cmd === 'changeprivateuhtml' ? 'change' : '')}|${name}`;
		}

		html = this.checkHTML(html);
		if (!html) return this.parse('/help sendprivatehtmlbox');
		html = `${Utils.html`<div class="gray" style="font-size:8pt">[Private from ${user.name}]</div>`}${Chat.collapseLineBreaksHTML(html)}`;
		if (plainHtml) html = `<div class="infobox">${html}</div>`;

		const successes: string[] = [], errors: string[] = [];

		targets.forEach(targetUsername => {
			const targetUser = Users.get(targetUsername);

			if (!targetUser) return errors.push(`${targetUsername} [offline/misspelled]`);

			if (targetUser.locked && !this.user.can('lock')) {
				return errors.push(`${targetUser.name} [locked]`);
			}

			if (!(targetUser.id in room.users)) {
				return errors.push(`${targetUser.name} [not in room]`);
			}

			successes.push(targetUser.name);
			targetUser.sendTo(room, `|${messageType}|${html}`);
		});

		if (successes.length) this.sendReply(`Sent private HTML to ${Chat.toListString(successes)}.`);
		if (errors.length) this.errorReply(`Unable to send private HTML to ${Chat.toListString(errors)}.`);

		if (!successes.length) return false;
	},
	sendprivatehtmlboxhelp: [
		`/sendprivatehtmlbox [userid], [html] - Sends [userid] the private [html]. Requires: * # ~`,
		`/sendprivateuhtml [userid], [name], [html] - Sends [userid] the private [html] that can change. Requires: * # ~`,
		`/changeprivateuhtml [userid], [name], [html] - Changes the message previously sent with /sendprivateuhtml [userid], [name], [html]. Requires: * # ~`,
	],

	botmsg(target, room, user, connection) {
		if (!target?.includes(',')) {
			return this.parse('/help botmsg');
		}
		this.checkRecursion();

		let { targetUser, rest: message } = this.requireUser(target);

		const auth = this.room ? this.room.auth : Users.globalAuth;
		if (!['*', '#'].includes(auth.get(targetUser))) {
			return this.popupReply(`The user "${targetUser.name}" is not a bot in this room.`);
		}
		this.room = null; // shouldn't be in a room
		this.pmTarget = targetUser;

		message = this.checkChat(message);
		if (!message) return;
		Chat.PrivateMessages.send(`/botmsg ${message}`, user, targetUser, targetUser);
	},
	botmsghelp: [`/botmsg [username], [message] - Send a private message to a bot without feedback. For room bots, must use in the room the bot is auth in.`],

	nick() {
		this.sendReply(`||New to the Pokémon Showdown protocol? Your client needs to get a signed assertion from the login server and send /trn`);
		this.sendReply(`||https://github.com/smogon/pokemon-showdown/blob/master/PROTOCOL.md#global-messages`);
		this.sendReply(`||Follow the instructions for handling |challstr| in this documentation`);
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	memusage: 'memoryusage',
	memoryusage(target, room, user) {
		if (!hasDevAuth(user)) this.checkCan('lockdown');
		const memUsage = process.memoryUsage();
		const resultNums = [memUsage.rss, memUsage.heapUsed, memUsage.heapTotal];
		const units = ["B", "KiB", "MiB", "GiB", "TiB"];
		const results = resultNums.map(num => {
			const unitIndex = Math.floor(Math.log2(num) / 10); // 2^10 base log
			return `${(num / (2 ** (10 * unitIndex))).toFixed(2)} ${units[unitIndex]}`;
		});
		this.sendReply(`||[Main process] RSS: ${results[0]}, Heap: ${results[1]} / ${results[2]}`);
	},
	memoryusagehelp: [
		`/memoryusage OR /memusage - Get the current memory usage of the server. Requires: ~`,
	],

	forcehotpatch: 'hotpatch',
	async hotpatch(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help hotpatch');
		this.canUseConsole();

		if (Monitor.updateServerLock) {
			throw new Chat.ErrorMessage("Wait for /updateserver to finish before hotpatching.");
		}

		await this.parse(`/rebuild`);
		const lock = Monitor.hotpatchLock;
		const hotpatches = [
			'chat', 'formats', 'loginserver', 'punishments', 'dnsbl', 'modlog',
			'processmanager', 'roomsp', 'usersp',
		];

		target = toID(target);
		try {
			Utils.clearRequireCache({ exclude: ['/lib/process-manager'] });
			if (target === 'all') {
				if (lock['all']) {
					throw new Chat.ErrorMessage(`Hot-patching all has been disabled by ${lock['all'].by} (${lock['all'].reason})`);
				}
				if (Config.disablehotpatchall) {
					throw new Chat.ErrorMessage("This server does not allow for the use of /hotpatch all");
				}

				for (const hotpatch of hotpatches) {
					await this.parse(`/hotpatch ${hotpatch}`);
				}
			} else if (target === 'chat' || target === 'commands') {
				if (lock['tournaments']) {
					throw new Chat.ErrorMessage(`Hot-patching tournaments has been disabled by ${lock['tournaments'].by} (${lock['tournaments'].reason})`);
				}
				if (lock['chat']) {
					throw new Chat.ErrorMessage(`Hot-patching chat has been disabled by ${lock['chat'].by} (${lock['chat'].reason})`);
				}

				this.sendReply("Hotpatching chat commands...");

				const disabledCommands = Chat.allCommands().filter(c => c.disabled).map(c => `/${c.fullCmd}`);
				if (cmd !== 'forcehotpatch' && disabledCommands.length) {
					throw new Chat.ErrorMessage([
						`${Chat.count(disabledCommands.length, "commands")} are disabled right now.`,
						`Hotpatching will enable them. Use /forcehotpatch chat if you're sure.`,
						`Currently disabled: ${disabledCommands.join(', ')}`,
					]);
				}

				const oldPlugins = Chat.plugins;
				Chat.destroy();

				global.Chat = require('../chat').Chat;
				Chat.start(Config.subprocessescache);
				global.Tournaments = require('../tournaments').Tournaments;

				this.sendReply("Reloading chat plugins...");
				Chat.loadPlugins(oldPlugins);
				this.sendReply("DONE");
			} else if (target === 'processmanager') {
				if (lock['processmanager']) {
					throw new Chat.ErrorMessage(
						`Hot-patching formats has been disabled by ${lock['processmanager'].by} ` +
						`(${lock['processmanager'].reason})`
					);
				}
				this.sendReply('Hotpatching processmanager prototypes...');

				// keep references
				const cache = { ...require.cache };
				Utils.clearRequireCache();
				const newPM = require('../../lib/process-manager');
				require.cache = cache;

				const protos = [
					[ProcessManager.QueryProcessManager, newPM.QueryProcessManager],
					[ProcessManager.StreamProcessManager, newPM.StreamProcessManager],
					[ProcessManager.ProcessManager, newPM.ProcessManager],
					[ProcessManager.RawProcessManager, newPM.RawProcessManager],
					[ProcessManager.QueryProcessWrapper, newPM.QueryProcessWrapper],
					[ProcessManager.StreamProcessWrapper, newPM.StreamProcessWrapper],
					[ProcessManager.RawProcessManager, newPM.RawProcessWrapper],
				].map(part => part.map(constructor => constructor.prototype));

				for (const [oldProto, newProto] of protos) {
					const newKeys = keysToCopy(newProto);
					const oldKeys = keysToCopy(oldProto);
					for (const key of oldKeys) {
						if (!newProto[key]) {
							delete oldProto[key];
						}
					}
					for (const key of newKeys) {
						oldProto[key] = newProto[key];
					}
				}
				this.sendReply('DONE');
			} else if (target === 'usersp' || target === 'roomsp') {
				if (lock[target]) {
					throw new Chat.ErrorMessage(`Hot-patching ${target} has been disabled by ${lock[target].by} (${lock[target].reason})`);
				}
				let newProto: any, oldProto: any, message: string;
				switch (target) {
				case 'usersp':
					newProto = require('../users').User.prototype;
					oldProto = Users.User.prototype;
					message = 'user prototypes';
					break;
				case 'roomsp':
					newProto = require('../rooms').BasicRoom.prototype;
					oldProto = Rooms.BasicRoom.prototype;
					message = 'rooms prototypes';
					break;
				}

				this.sendReply(`Hotpatching ${message}...`);
				const newKeys = keysToCopy(newProto);
				const oldKeys = keysToCopy(oldProto);

				const counts = {
					added: 0,
					updated: 0,
					deleted: 0,
				};

				for (const key of oldKeys) {
					if (!newProto[key]) {
						counts.deleted++;
						delete oldProto[key];
					}
				}
				for (const key of newKeys) {
					if (!oldProto[key]) {
						counts.added++;
					} else if (
						// compare source code
						typeof oldProto[key] !== 'function' || oldProto[key].toString() !== newProto[key].toString()
					) {
						counts.updated++;
					}

					oldProto[key] = newProto[key];
				}
				this.sendReply(`DONE`);
				this.sendReply(
					`Updated ${Chat.count(counts.updated, 'methods')}` +
					(counts.added ? `, added ${Chat.count(counts.added, 'new methods')} to ${message}` : '') +
					(counts.deleted ? `, and removed ${Chat.count(counts.deleted, 'methods')}.` : '.')
				);
			} else if (target === 'tournaments') {
				if (lock['tournaments']) {
					throw new Chat.ErrorMessage(`Hot-patching tournaments has been disabled by ${lock['tournaments'].by} (${lock['tournaments'].reason})`);
				}
				this.sendReply("Hotpatching tournaments...");

				global.Tournaments = require('../tournaments').Tournaments;
				Chat.loadPlugin(Tournaments, 'tournaments');
				this.sendReply("DONE");
			} else if (target === 'formats' || target === 'battles') {
				if (lock['formats']) {
					throw new Chat.ErrorMessage(`Hot-patching formats has been disabled by ${lock['formats'].by} (${lock['formats'].reason})`);
				}
				if (lock['battles']) {
					throw new Chat.ErrorMessage(`Hot-patching battles has been disabled by ${lock['battles'].by} (${lock['battles'].reason})`);
				}
				if (lock['validator']) {
					throw new Chat.ErrorMessage(`Hot-patching the validator has been disabled by ${lock['validator'].by} (${lock['validator'].reason})`);
				}
				this.sendReply("Hotpatching formats...");

				// reload .sim-dist/dex.js
				global.Dex = require('../../sim/dex').Dex;
				// rebuild the formats list
				Rooms.global.formatList = '';
				// respawn validator processes
				void TeamValidatorAsync.PM.respawn();
				// respawn simulator processes
				void Rooms.PM.respawn();
				// respawn datasearch processes (crashes otherwise, since the Dex data in the PM can be out of date)
				void Chat.plugins.datasearch?.PM?.respawn();
				// update teams global
				global.Teams = require('../../sim/teams').Teams;
				// broadcast the new formats list to clients
				Rooms.global.sendAll(Rooms.global.formatListText);
				this.sendReply("DONE");
			} else if (target === 'loginserver') {
				this.sendReply("Hotpatching loginserver...");
				FS('config/custom.css').unwatch();
				global.LoginServer = require('../loginserver').LoginServer;
				this.sendReply("DONE. New login server requests will use the new code.");
			} else if (target === 'learnsets' || target === 'validator') {
				if (lock['validator']) {
					throw new Chat.ErrorMessage(`Hot-patching the validator has been disabled by ${lock['validator'].by} (${lock['validator'].reason})`);
				}
				if (lock['formats']) {
					throw new Chat.ErrorMessage(`Hot-patching formats has been disabled by ${lock['formats'].by} (${lock['formats'].reason})`);
				}

				this.sendReply("Hotpatching validator...");
				void TeamValidatorAsync.PM.respawn();
				// update teams global too while we're at it
				global.Teams = require('../../sim/teams').Teams;
				this.sendReply("DONE. Any battles started after now will have teams be validated according to the new code.");
			} else if (target === 'punishments') {
				if (lock['punishments']) {
					throw new Chat.ErrorMessage(`Hot-patching punishments has been disabled by ${lock['punishments'].by} (${lock['punishments'].reason})`);
				}

				this.sendReply("Hotpatching punishments...");
				global.Punishments = require('../punishments').Punishments;
				this.sendReply("DONE");
			} else if (target === 'dnsbl' || target === 'datacenters' || target === 'iptools') {
				this.sendReply("Hotpatching ip-tools...");

				global.IPTools = require('../ip-tools').IPTools;
				void IPTools.loadHostsAndRanges();
				this.sendReply("DONE");
			} else if (target === 'modlog') {
				if (!Config.usesqlite) {
					throw new Chat.ErrorMessage(`The moderator log is not available because SQLite is disabled.`);
				}
				if (!Config.usesqlitemodlog) {
					throw new Chat.ErrorMessage(`The moderator log is not available because of the server configuration.`);
				}
				if (lock['modlog']) {
					throw new Chat.ErrorMessage(`Hot-patching modlogs has been disabled by ${lock['modlog'].by} (${lock['modlog'].reason})`);
				}
				if (Rooms.Modlog.readyPromise) {
					throw new Chat.ErrorMessage(`There is already a hotpatch in progress.`);
				}
				this.sendReply("Hotpatching modlog...");

				void Rooms.Modlog.restart();
				// eslint-disable-next-line @typescript-eslint/await-thenable
				await Rooms.Modlog.readyPromise;
				this.sendReply("DONE");
			} else if (target.startsWith('disable')) {
				this.sendReply("Disabling hot-patch has been moved to its own command:");
				return this.parse('/help nohotpatch');
			} else {
				throw new Chat.ErrorMessage("Your hot-patch command was unrecognized.");
			}
		} catch (e: any) {
			Rooms.global.notifyRooms(
				['development', 'staff'] as RoomID[],
				`|c|${user.getIdentity()}|/log ${user.name} used /hotpatch ${target} - but something failed while trying to hot-patch.`
			);
			throw new Chat.ErrorMessage([`Something failed while trying to hot-patch ${target}:`, e.stack]);
		}
		Rooms.global.notifyRooms(
			['development', 'staff'] as RoomID[],
			`|c|${user.getIdentity()}|/log ${user.name} used /hotpatch ${target}`
		);
	},
	hotpatchhelp: [
		`Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: console access`,
		`Hot-patching has greater memory requirements than restarting`,
		`You can disable various hot-patches with /nohotpatch. For more information on this, see /help nohotpatch`,
		`/hotpatch chat - reloads the chat-commands and chat-plugins directories`,
		`/hotpatch validator - spawn new team validator processes`,
		`/hotpatch formats - reload the sim/dex.ts tree, reload the formats list, and spawn new simulator and team validator processes`,
		`/hotpatch dnsbl - reloads IPTools datacenters`,
		`/hotpatch punishments - reloads new punishments code`,
		`/hotpatch loginserver - reloads new loginserver code`,
		`/hotpatch tournaments - reloads new tournaments code`,
		`/hotpatch modlog - reloads new modlog code`,
		`/hotpatch all - hot-patches chat, tournaments, formats, login server, punishments, modlog, and dnsbl`,
		`/forcehotpatch [target] - as above, but performs the update regardless of whether the history has changed in git`,
	],

	hotpatchlock: 'nohotpatch',
	yeshotpatch: 'nohotpatch',
	allowhotpatch: 'nohotpatch',
	nohotpatch(target, room, user, connection, cmd) {
		this.checkCan('gdeclare');
		if (!target) return this.parse('/help nohotpatch');

		const separator = ' ';

		const hotpatch = toID(target.substr(0, target.indexOf(separator)));
		const reason = target.substr(target.indexOf(separator), target.length).trim();
		if (!reason || !target.includes(separator)) return this.parse('/help nohotpatch');

		const lock = Monitor.hotpatchLock;
		const validDisable = [
			'roomsp', 'usersp', 'chat', 'battles', 'formats', 'validator',
			'tournaments', 'punishments', 'modlog', 'all', 'processmanager',
		];

		if (!validDisable.includes(hotpatch)) {
			throw new Chat.ErrorMessage(`Disabling hotpatching "${hotpatch}" is not supported.`);
		}
		const enable = ['allowhotpatch', 'yeshotpatch'].includes(cmd);

		if (enable) {
			if (!lock[hotpatch]) throw new Chat.ErrorMessage(`Hot-patching ${hotpatch} is not disabled.`);

			delete lock[hotpatch];
			this.sendReply(`You have enabled hot-patching ${hotpatch}.`);
		} else {
			if (lock[hotpatch]) {
				throw new Chat.ErrorMessage(`Hot-patching ${hotpatch} has already been disabled by ${lock[hotpatch].by} (${lock[hotpatch].reason})`);
			}
			lock[hotpatch] = {
				by: user.name,
				reason,
			};
			this.sendReply(`You have disabled hot-patching ${hotpatch}.`);
		}
		Rooms.global.notifyRooms(
			['development', 'staff', 'upperstaff'] as RoomID[],
			`|c|${user.getIdentity()}|/log ${user.name} has ${enable ? 'enabled' : 'disabled'} hot-patching ${hotpatch}. Reason: ${reason}`
		);
	},
	nohotpatchhelp: [
		`/nohotpatch [chat|formats|battles|validator|tournaments|punishments|modlog|all] [reason] - Disables hotpatching the specified part of the simulator. Requires: ~`,
		`/allowhotpatch [chat|formats|battles|validator|tournaments|punishments|modlog|all] [reason] - Enables hotpatching the specified part of the simulator. Requires: ~`,
	],

	async processes(target, room, user) {
		if (!hasDevAuth(user)) this.checkCan('lockdown');

		const processes = new Map<string, ProcessData>();
		const ramUnits = ["KiB", "MiB", "GiB", "TiB"];

		const cwd = FS.ROOT_PATH;
		await new Promise<void>(resolve => {
			const child = child_process.exec('ps -o pid,%cpu,time,rss,command', { cwd }, (err, stdout) => {
				if (err) throw err;
				const rows = stdout.split('\n').slice(1); // first line is the table header
				for (const row of rows) {
					if (!row.trim()) continue;
					const [pid, cpu, time, ram, ...rest] = row.split(' ').filter(Boolean);
					if (pid === `${child.pid}`) continue; // ignore this process
					const entry: ProcessData = { cmd: rest.join(' ') };
					// at the point of 0:00.[num], it's in so few seconds we don't care, so
					// we don't need to clutter the display
					if (time && !time.startsWith('0:00')) {
						entry.time = time;
					}
					if (cpu && cpu !== '0.0') entry.cpu = `${cpu}%`;
					const ramNum = parseInt(ram);
					if (!isNaN(ramNum)) {
						const unitIndex = Math.floor(Math.log2(ramNum) / 10); // 2^10 base log
						entry.ram = `${(ramNum / (2 ** (10 * unitIndex))).toFixed(2)} ${ramUnits[unitIndex]}`;
					}
					processes.set(pid, entry);
				}
				resolve();
			});
		});

		let buf = `<strong>${process.pid}</strong> - Main `;
		const mainDisplay = [];
		const mainProcess = processes.get(`${process.pid}`)!;
		if (mainProcess.cpu) mainDisplay.push(`CPU ${mainProcess.cpu}`);
		if (mainProcess.time) mainDisplay.push(`time: ${mainProcess.time})`);
		if (mainProcess.ram) {
			mainDisplay.push(`RAM: ${mainProcess.ram}`);
		}
		if (mainDisplay.length) buf += ` (${mainDisplay.join(', ')})`;
		buf += `<br /><br /><strong>Process managers:</strong><br />`;
		processes.delete(`${process.pid}`);

		for (const manager of ProcessManager.processManagers) {
			for (const [i, process] of manager.processes.entries()) {
				const pid = process.getProcess().pid;
				let managerName = manager.basename;
				if (managerName.startsWith('index.')) { // doesn't actually tell us anything abt the process
					managerName = manager.filename.split(path.sep).slice(-2).join(path.sep);
				}
				buf += `<strong>${pid}</strong> - ${managerName} ${i} (load ${process.getLoad()}`;
				const info = processes.get(`${pid}`)!;
				const display = [];
				if (info.cpu) display.push(`CPU: ${info.cpu}`);
				if (info.time) display.push(`time: ${info.time}`);
				if (info.ram) display.push(`RAM: ${info.ram}`);
				if (display.length) buf += `, ${display.join(', ')})`;
				buf += `<br />`;
				processes.delete(`${pid}`);
			}
			for (const [i, process] of manager.releasingProcesses.entries()) {
				const pid = process.getProcess().pid;
				buf += `<strong>${pid}</strong> - PENDING RELEASE ${manager.basename} ${i} (load ${process.getLoad()}`;
				const info = processes.get(`${pid}`);
				if (info) {
					const display = [];
					if (info.cpu) display.push(`CPU: ${info.cpu}`);
					if (info.time) display.push(`time: ${info.time}`);
					if (info.ram) display.push(`RAM: ${info.ram}`);
					if (display.length) buf += `, ${display.join(', ')})`;
				}
				buf += `<br />`;
				processes.delete(`${pid}`);
			}
		}
		buf += `<br />`;
		buf += `<details class="readmore"><summary><strong>Other processes:</strong></summary>`;

		for (const [pid, info] of processes) {
			buf += `<strong>${pid}</strong> - <code>${info.cmd}</code>`;
			const display = [];
			if (info.cpu) display.push(`CPU: ${info.cpu}`);
			if (info.time) display.push(`time: ${info.time}`);
			if (info.ram) display.push(`RAM: ${info.ram}`);
			if (display.length) buf += `(${display.join(', ')})`;
			buf += `<br />`;
		}
		buf += `</details>`;
		this.sendReplyBox(buf);
	},
	processeshelp: [
		`/processes - Get information about the running processes on the server. Requires: ~.`,
	],

	async savelearnsets(target, room, user, connection) {
		this.canUseConsole();
		this.sendReply("saving...");
		await FS('data/learnsets.js').write(`'use strict';\n\nexports.Learnsets = {\n` +
			Object.entries(Dex.data.Learnsets).map(([id, entry]) => (
				`\t${id}: {learnset: {\n` +
				Utils.sortBy(
					Object.entries(Dex.species.getLearnsetData(id as ID).learnset!),
					([moveid]) => moveid
				).map(([moveid, sources]) => (
					`\t\t${moveid}: ["` + sources.join(`", "`) + `"],\n`
				)).join('') +
				`\t}},\n`
			)).join('') +
			`};\n`);
		this.sendReply("learnsets.js saved.");
	},
	savelearnsetshelp: [
		`/savelearnsets - Saves the learnset list currently active on the server. Requires: ~`,
	],

	toggleripgrep(target, room, user) {
		this.checkCan('rangeban');
		Config.disableripgrep = !Config.disableripgrep;
		this.addGlobalModAction(`${user.name} ${Config.disableripgrep ? 'disabled' : 'enabled'} Ripgrep-related functionality.`);
	},
	toggleripgrephelp: [`/toggleripgrep - Disable/enable all functionality depending on Ripgrep. Requires: ~`],

	disablecommand(target, room, user) {
		this.checkCan('makeroom');
		if (!toID(target)) {
			return this.parse(`/help disablecommand`);
		}
		if (['!', '/'].some(c => target.startsWith(c))) target = target.slice(1);
		const parsed = Chat.parseCommand(`/${target}`);
		if (!parsed) {
			throw new Chat.ErrorMessage(`Command "/${target}" is in an invalid format.`);
		}
		const { handler, fullCmd } = parsed;
		if (!handler) {
			throw new Chat.ErrorMessage(`Command "/${target}" not found.`);
		}
		if (handler.disabled) {
			throw new Chat.ErrorMessage(`Command "/${target}" is already disabled`);
		}
		handler.disabled = true;
		this.addGlobalModAction(`${user.name} disabled the command /${fullCmd}.`);
		this.globalModlog(`DISABLECOMMAND`, null, target);
	},
	disablecommandhelp: [`/disablecommand [command] - Disables the given [command]. Requires: ~`],

	widendatacenters: 'adddatacenters',
	adddatacenters() {
		this.errorReply("This command has been replaced by /datacenter add");
		return this.parse('/help datacenters');
	},

	disableladder(target, room, user) {
		this.checkCan('disableladder');
		if (Ladders.disabled) {
			throw new Chat.ErrorMessage(`/disableladder - Ladder is already disabled.`);
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
			curRoom.addRaw(`<div class="broadcast-red">${innerHTML}</div>`).update();
		}
		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|~|${u.tempGroup}${u.name}|/raw <div class="broadcast-red">${innerHTML}</div>`);
		}
	},
	disableladderhelp: [`/disableladder - Stops all rated battles from updating the ladder. Requires: ~`],

	enableladder(target, room, user) {
		this.checkCan('disableladder');
		if (!Ladders.disabled) {
			throw new Chat.ErrorMessage(`/enable - Ladder is already enabled.`);
		}
		Ladders.disabled = false;

		this.modlog('ENABLELADDER');
		Monitor.log(`The ladder was enabled by ${user.name}.`);

		const innerHTML = (
			`<b>The ladder is now back.</b><br />` +
			`Rated games will update the ladder now..`
		);

		for (const curRoom of Rooms.rooms.values()) {
			curRoom.addRaw(`<div class="broadcast-green">${innerHTML}</div>`).update();
		}
		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|~|${u.tempGroup}${u.name}|/raw <div class="broadcast-green">${innerHTML}</div>`);
		}
	},
	enableladderhelp: [`/enable - Allows all rated games to update the ladder. Requires: ~`],

	lockdown(target, room, user) {
		this.checkCan('lockdown');

		const disabledCommands = Chat.allCommands().filter(c => c.disabled).map(c => `/${c.fullCmd}`);
		if (disabledCommands.length) {
			this.sendReply(`${Chat.count(disabledCommands.length, "commands")} are disabled right now.`);
			this.sendReply(`Be aware that restarting will re-enable them.`);
			this.sendReply(`Currently disabled: ${disabledCommands.join(', ')}`);
		}
		Rooms.global.startLockdown();

		this.stafflog(`${user.name} used /lockdown`);
	},
	lockdownhelp: [
		`/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~`,
	],

	autolockdown: 'autolockdownkill',
	autolockdownkill(target, room, user) {
		this.checkCan('lockdown');
		if (Config.autolockdown === undefined) Config.autolockdown = true;
		if (this.meansYes(target)) {
			if (Config.autolockdown) {
				throw new Chat.ErrorMessage("The server is already set to automatically kill itself upon the final battle finishing.");
			}
			Config.autolockdown = true;
			this.privateGlobalModAction(`${user.name} used /autolockdownkill on (autokill on final battle finishing)`);
		} else if (this.meansNo(target)) {
			if (!Config.autolockdown) {
				throw new Chat.ErrorMessage("The server is already set to not automatically kill itself upon the final battle finishing.");
			}
			Config.autolockdown = false;
			this.privateGlobalModAction(`${user.name} used /autolockdownkill off (no autokill on final battle finishing)`);
		} else {
			return this.parse('/help autolockdownkill');
		}
	},
	autolockdownkillhelp: [
		`/autolockdownkill on - Turns on the setting to enable the server to automatically kill itself upon the final battle finishing. Requires ~`,
		`/autolockdownkill off - Turns off the setting to enable the server to automatically kill itself upon the final battle finishing. Requires ~`,
	],

	prelockdown(target, room, user) {
		this.checkCan('lockdown');
		Rooms.global.lockdown = 'pre';

		this.privateGlobalModAction(`${user.name} used /prelockdown (disabled tournaments in preparation for server restart)`);
	},
	prelockdownhelp: [`/prelockdown - Prevents new tournaments from starting so that the server can be restarted. Requires: ~`],

	slowlockdown(target, room, user) {
		this.checkCan('lockdown');

		Rooms.global.startLockdown(undefined, true);

		this.privateGlobalModAction(`${user.name} used /slowlockdown (lockdown without auto-restart)`);
	},
	slowlockdownhelp: [
		`/slowlockdown - Locks down the server, but disables the automatic restart after all battles end.`,
		`Requires: ~`,
	],

	crashfixed: 'endlockdown',
	endlockdown(target, room, user, connection, cmd) {
		this.checkCan('lockdown');

		if (!Rooms.global.lockdown) {
			throw new Chat.ErrorMessage("We're not under lockdown right now.");
		}
		if (Rooms.global.lockdown !== true && cmd === 'crashfixed') {
			throw new Chat.ErrorMessage('/crashfixed - There is no active crash.');
		}

		const message = cmd === 'crashfixed' ?
			`<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b></div>` :
			`<div class="broadcast-green"><b>The server restart was canceled.</b></div>`;
		if (Rooms.global.lockdown === true) {
			for (const curRoom of Rooms.rooms.values()) {
				curRoom.addRaw(message).update();
			}
			for (const curUser of Users.users.values()) {
				curUser.send(`|pm|~|${curUser.tempGroup}${curUser.name}|/raw ${message}`);
			}
		} else {
			this.sendReply("Preparation for the server shutdown was canceled.");
		}
		Rooms.global.lockdown = false;

		this.stafflog(`${user.name} used /endlockdown`);
	},
	endlockdownhelp: [
		`/endlockdown - Cancels the server restart and takes the server out of lockdown state. Requires: ~`,
		`/crashfixed - Ends the active lockdown caused by a crash without the need of a restart. Requires: ~`,
	],

	emergency(target, room, user) {
		this.checkCan('lockdown');

		if (Config.emergency) {
			throw new Chat.ErrorMessage("We're already in emergency mode.");
		}
		Config.emergency = true;
		for (const curRoom of Rooms.rooms.values()) {
			curRoom.addRaw(`<div class="broadcast-red">The server has entered emergency mode. Some features might be disabled or limited.</div>`).update();
		}

		this.stafflog(`${user.name} used /emergency.`);
	},
	emergencyhelp: [
		`/emergency - Turns on emergency mode and enables extra logging. Requires: ~`,
	],

	endemergency(target, room, user) {
		this.checkCan('lockdown');

		if (!Config.emergency) {
			throw new Chat.ErrorMessage("We're not in emergency mode.");
		}
		Config.emergency = false;
		for (const curRoom of Rooms.rooms.values()) {
			curRoom.addRaw(`<div class="broadcast-green"><b>The server is no longer in emergency mode.</b></div>`).update();
		}

		this.stafflog(`${user.name} used /endemergency.`);
	},
	endemergencyhelp: [
		`/endemergency - Turns off emergency mode. Requires: ~`,
	],

	remainingbattles() {
		this.checkCan('lockdown');

		if (!Rooms.global.lockdown) {
			throw new Chat.ErrorMessage("The server is not under lockdown right now.");
		}

		const battleRooms = [...Rooms.rooms.values()].filter(x => x.battle?.rated && !x.battle?.ended);
		let buf = `Total remaining rated battles: <b>${battleRooms.length}</b>`;
		if (battleRooms.length > 10) buf += `<details><summary>View all battles</summary>`;
		for (const battle of battleRooms) {
			buf += `<br />`;
			buf += `<a href="${battle.roomid}">${battle.title}</a>`;
			if (battle.settings.isPrivate) buf += ' (Private)';
		}
		if (battleRooms.length > 10) buf += `</details>`;
		this.sendReplyBox(buf);
	},
	remainingbattleshelp: [
		`/remainingbattles - View a list of the remaining battles during lockdown. Requires: ~`,
	],

	async savebattles(target, room, user) {
		this.checkCan('rangeban'); // admins can restart, so they should be able to do this if needed
		this.sendReply(`Saving battles...`);
		const count = await Rooms.global.saveBattles();
		this.sendReply(`DONE.`);
		this.sendReply(`${count} battles saved.`);
		this.addModAction(`${user.name} used /savebattles`);
	},

	async kill(target, room, user) {
		this.checkCan('lockdown');
		let noSave = toID(target) === 'nosave';
		if (!Config.usepostgres) noSave = true;

		if (Rooms.global.lockdown !== true && noSave) {
			throw new Chat.ErrorMessage("For safety reasons, using /kill without saving battles can only be done during lockdown.");
		}

		if (Monitor.updateServerLock) {
			throw new Chat.ErrorMessage("Wait for /updateserver to finish before using /kill.");
		}

		if (!noSave) {
			this.sendReply('Saving battles...');
			Rooms.global.lockdown = true; // we don't want more battles starting while we save
			for (const u of Users.users.values()) {
				u.send(
					`|pm|~|${u.getIdentity()}|/raw <div class="broadcast-red"><b>The server is restarting soon.</b><br />` +
					`While battles are being saved, no more can be started. If you're in a battle, it will be paused during saving.<br />` +
					`After the restart, you will be able to resume your battles from where you left off.`
				);
			}
			const count = await Rooms.global.saveBattles();
			this.sendReply(`DONE.`);
			this.sendReply(`${count} battles saved.`);
		}

		const logRoom = Rooms.get('staff') || Rooms.lobby || room;

		if (!logRoom?.log.roomlogStream) return process.exit();

		logRoom.roomlog(`${user.name} used /kill`);

		void logRoom.log.roomlogStream.writeEnd().then(() => {
			process.exit();
		});

		// In the case the above never terminates
		setTimeout(() => {
			process.exit();
		}, 10000);
	},
	killhelp: [
		`/kill - kills the server. Use the argument \`nosave\` to prevent the saving of battles.`,
		` If this argument is used, the server must be in lockdown. Requires: ~`,
	],

	loadbanlist(target, room, user, connection) {
		this.checkCan('lockdown');

		connection.sendTo(room, "Loading ipbans.txt...");
		Punishments.loadBanlist().then(
			() => connection.sendTo(room, "ipbans.txt has been reloaded."),
			error => connection.sendTo(room, `Something went wrong while loading ipbans.txt: ${error}`)
		);
	},
	loadbanlisthelp: [
		`/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~`,
	],

	refreshpage(target, room, user) {
		this.checkCan('lockdown');
		if (user.lastCommand !== 'refreshpage') {
			user.lastCommand = 'refreshpage';
			throw new Chat.ErrorMessage([`Are you sure you wish to refresh the page for every user online?`,
				`If you are sure, please type /refreshpage again to confirm.`]);
		}
		Rooms.global.sendAll('|refresh|');
		this.stafflog(`${user.name} used /refreshpage`);
	},
	refreshpagehelp: [
		`/refreshpage - refreshes the page for every user online. Requires: ~`,
	],

	async updateserver(target, room, user, connection) {
		this.canUseConsole();
		if (Monitor.updateServerLock) {
			throw new Chat.ErrorMessage(`/updateserver - Another update is already in progress (or a previous update crashed).`);
		}

		const validPrivateCodePath = Config.privatecodepath && path.isAbsolute(Config.privatecodepath);
		target = toID(target);
		Monitor.updateServerLock = true;

		let success = true;
		if (target === 'private') {
			if (!validPrivateCodePath) {
				Monitor.updateServerLock = false;
				throw new Chat.ErrorMessage("`Config.privatecodepath` must be set to an absolute path before using /updateserver private.");
			}
			success = await updateserver(this, Config.privatecodepath);
			this.addGlobalModAction(`${user.name} used /updateserver private`);
		} else {
			if (target !== 'public' && validPrivateCodePath) {
				success = await updateserver(this, Config.privatecodepath);
			}
			success = success && await updateserver(this, FS.ROOT_PATH);
			this.addGlobalModAction(`${user.name} used /updateserver${target === 'public' ? ' public' : ''}`);
		}

		this.sendReply(success ? `DONE` : `FAILED, old changes restored.`);

		Monitor.updateServerLock = false;
	},
	updateserverhelp: [
		`/updateserver - Updates the server's code from its Git repository, including private code if present. Requires: console access`,
		`/updateserver private - Updates only the server's private code. Requires: console access`,
	],

	async updateloginserver(target, room, user) {
		this.canUseConsole();
		this.sendReply('Restarting...');
		const [result, err] = await LoginServer.request('restart');
		if (err) {
			Rooms.global.notifyRooms(
				['staff', 'development'],
				`|c|${user.getIdentity()}|/log ${user.name} used /updateloginserver - but something failed while updating.`
			);
			throw new Chat.ErrorMessage([err.message, err.stack || '']);
		}
		if (!result) throw new Chat.ErrorMessage('No result received.');
		this.stafflog(`[o] ${result.success || ""} [e] ${result.actionerror || ""}`);
		if (result.actionerror) {
			throw new Chat.ErrorMessage(result.actionerror);
		}
		let message = `${user.name} used /updateloginserver`;
		if (result.updated) {
			this.sendReply(`DONE. Server updated and restarted.`);
		} else {
			message += ` - but something failed while updating.`;
			this.errorReply(`FAILED. Conflicts were found while updating - the restart was aborted.`);
		}
		Rooms.global.notifyRooms(
			['staff', 'development'], `|c|${user.getIdentity()}|/log ${message}`
		);
	},
	updateloginserverhelp: [
		`/updateloginserver - Updates and restarts the loginserver. Requires: console access`,
	],

	async updateclient(target, room, user) {
		this.canUseConsole();
		this.sendReply('Restarting...');
		const [result, err] = await LoginServer.request('rebuildclient', {
			full: toID(target) === 'full',
		});
		if (err) {
			Rooms.global.notifyRooms(
				['staff', 'development'],
				`|c|${user.getIdentity()}|/log ${user.name} used /updateclient - but something failed while updating.`
			);
			throw new Chat.ErrorMessage([err.message, err.stack || '']);
		}
		if (!result) throw new Chat.ErrorMessage('No result received.');
		this.stafflog(`[o] ${result.success || ""} [e] ${result.actionerror || ""}`);
		if (result.actionerror) {
			throw new Chat.ErrorMessage(result.actionerror);
		}
		let message = `${user.name} used /updateclient`;
		if (result.updated) {
			this.sendReply(`DONE. Client updated.`);
		} else {
			message += ` - but something failed while updating.`;
			this.errorReply(`FAILED. Conflicts were found while updating.`);
		}
		Rooms.global.notifyRooms(
			['staff', 'development'], `|c|${user.getIdentity()}|/log ${message}`
		);
	},
	updateclienthelp: [
		`/updateclient [full] - Update the client source code. Provide the argument 'full' to make it a full rebuild.`,
		`Requires: ~ console access`,
	],

	async rebuild() {
		this.canUseConsole();
		const [, , stderr] = await bash('node ./build', this);
		if (stderr) {
			throw new Chat.ErrorMessage(`Crash while rebuilding: ${stderr}`);
		}
		this.sendReply('Rebuilt.');
	},

	/*********************************************************
	 * Low-level administration commands
	 *********************************************************/

	async bash(target, room, user, connection) {
		this.canUseConsole();
		if (!target) return this.parse('/help bash');
		this.sendReply(`$ ${target}`);
		const [, stdout, stderr] = await bash(target, this);
		this.runBroadcast();
		this.sendReply(`${stdout}${stderr}`);
	},
	bashhelp: [`/bash [command] - Executes a bash command on the server. Requires: ~ console access`],

	async eval(target, room, user, connection) {
		this.canUseConsole();
		if (!this.runBroadcast(true)) return;
		const logRoom = Rooms.get('upperstaff') || Rooms.get('staff');

		if (this.message.startsWith('>>') && room) {
			this.broadcasting = true;
			this.broadcastToRoom = true;
		}
		const generateHTML = (direction: string, contents: string) => (
			`<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">` +
			Utils.escapeHTML(direction).repeat(2) +
			`&nbsp;</td><td>${Chat.getReadmoreCodeBlock(contents)}</td></tr><table>`
		);
		this.sendReply(`|html|${generateHTML('>', target)}`);
		logRoom?.roomlog(`>> ${target}`);
		let uhtmlId = null;
		try {
			/* eslint-disable no-eval, @typescript-eslint/no-unused-vars */
			const battle = room?.battle;
			const me = user;
			let result = eval(target);
			/* eslint-enable no-eval, @typescript-eslint/no-unused-vars */

			if (result?.then) {
				uhtmlId = `eval-${Date.now().toString().slice(-6)}-${Math.random().toFixed(6).slice(-6)}`;
				this.sendReply(`|uhtml|${uhtmlId}|${generateHTML('<', 'Promise pending')}`);
				this.update();
				result = `Promise -> ${Utils.visualize(await result)}`;
				this.sendReply(`|uhtmlchange|${uhtmlId}|${generateHTML('<', result)}`);
			} else {
				result = Utils.visualize(result);
				this.sendReply(`|html|${generateHTML('<', result)}`);
			}
			logRoom?.roomlog(`<< ${result}`);
		} catch (e: any) {
			const message = `${e.stack}`.replace(/\n *at CommandContext\.eval [\s\S]*/m, '');
			const command = uhtmlId ? `|uhtmlchange|${uhtmlId}|` : '|html|';
			this.sendReply(`${command}${generateHTML('<', message)}`);
			logRoom?.roomlog(`<< ${message}`);
		}
	},
	evalhelp: [
		`/eval [code] - Evaluates the code given and shows results. Requires: ~ console access.`,
	],

	async evalsql(target, room) {
		this.canUseConsole();
		this.runBroadcast(true);
		if (!Config.usesqlite) throw new Chat.ErrorMessage(`SQLite is disabled.`);
		const logRoom = Rooms.get('upperstaff') || Rooms.get('staff');
		if (!target) throw new Chat.ErrorMessage(`Specify a database to access and a query.`);
		const [db, query] = Utils.splitFirst(target, ',').map(item => item.trim());
		if (!FS('./databases').readdirSync().includes(`${db}.db`)) {
			throw new Chat.ErrorMessage(`The database file ${db}.db was not found.`);
		}
		if (room && this.message.startsWith('>>sql')) {
			this.broadcasting = true;
			this.broadcastToRoom = true;
		}
		this.sendReply(
			`|html|<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">SQLite&gt; [${db}.db] &nbsp;</td>` +
			`<td>${Chat.getReadmoreCodeBlock(query)}</td></tr><table>`
		);
		logRoom?.roomlog(`SQLite> ${target}`);
		const database = SQL('evalsql', module, {
			file: `./databases/${db}.db`,
			onError(err) {
				return { err: err.message, stack: err.stack };
			},
		});
		function formatResult(result: any[] | string) {
			if (!Array.isArray(result)) {
				return (
					`<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top">` +
					`SQLite&lt;&nbsp;</td><td>${Chat.getReadmoreCodeBlock(result)}</td></tr><table>`
				);
			}
			let buffer = '<div class="ladder pad" style="overflow-x: auto;"><table><tr><th>';
			// header
			if (!result.length) {
				buffer += `No data in table.</th></tr>`;
				return buffer;
			}
			buffer += Object.keys(result[0]).join('</th><th>');
			buffer += `</th></tr><tr>`;
			buffer += result.map(item => (
				`<td>${Object.values(item).map(val => Utils.escapeHTML(val as string)).join('</td><td>')}</td>`
			)).join('</tr><tr>');
			buffer += `</tr></table></div>`;
			return buffer;
		}

		function parseError(res: any): never {
			const err = new Error(res.err);
			err.stack = res.stack;
			throw err;
		}

		let result;
		try {
			// presume it's attempting to get data first
			result = await database.all(query, []);
			if ((result as any).err) parseError(result as any);
		} catch (err: any) {
			// it's not getting data, but it might still be a valid statement - try to run instead
			if (err.stack?.includes(`Use run() instead`)) {
				try {
					result = await database.run(query, []);
					if ((result as any).err) parseError(result as any);
					result = Utils.visualize(result);
				} catch (e: any) {
					result = `${e.stack}`.replace(/\n *at CommandContext\.evalsql [\s\S]*/m, '');
				}
			} else {
				result = `${err.stack}`.replace(/\n *at CommandContext\.evalsql [\s\S]*/m, '');
			}
		}
		await database.destroy();
		const formattedResult = `|html|${formatResult(result)}`;
		logRoom?.roomlog(formattedResult);
		this.sendReply(formattedResult);
	},
	evalsqlhelp: [
		`/evalsql [database], [query] - Evaluates the given SQL [query] in the given [database].`,
		`Requires: ~ console access`,
	],

	evalbattle(target, room, user, connection) {
		room = this.requireRoom();
		this.canUseConsole();
		if (!this.runBroadcast(true)) return;
		if (!room.battle) {
			throw new Chat.ErrorMessage("/evalbattle - This isn't a battle room.");
		}

		void room.battle.stream.write(`>eval ${target.replace(/\n/g, '\f')}`);
	},
	evalbattlehelp: [
		`/evalbattle [code] - Evaluates the code in the battle stream of the current room. Requires: ~ console access.`,
	],

	ebat: 'editbattle',
	editbattle(target, room, user) {
		room = this.requireRoom();
		this.checkCan('forcewin');
		if (!target) return this.parse('/help editbattle');
		if (!room.battle) {
			throw new Chat.ErrorMessage("/editbattle - This is not a battle room.");
		}
		const battle = room.battle;
		let cmd;
		[cmd, target] = Utils.splitFirst(target, ' ');
		if (cmd.endsWith(',')) cmd = cmd.slice(0, -1);
		const targets = target.split(',');
		if (targets.length === 1 && targets[0] === '') targets.pop();
		let player, pokemon, move, stat, value;
		switch (cmd) {
		case 'hp':
		case 'h':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, pokemon, value] = targets.map(f => f.trim());
			[player, pokemon] = [player, pokemon].map(toID);
			void battle.stream.write(
				`>eval let p=pokemon('${player}', '${pokemon}');p.sethp(${parseInt(value)});` +
				`if (p.isActive)battle.add('-damage',p,p.getHealth);`
			);
			break;
		case 'status':
		case 's':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, pokemon, value] = targets.map(toID);
			void battle.stream.write(
				`>eval let pl=player('${player}');let p=pokemon(pl,'${pokemon}');p.setStatus('${value}');if (!p.isActive){battle.add('','please ignore the above');battle.add('-status',pl.active[0],pl.active[0].status,'[silent]');}`
			);
			break;
		case 'pp':
			if (targets.length !== 4) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, pokemon, move, value] = targets.map(f => f.trim());
			[player, pokemon, move] = [player, pokemon, move].map(toID);
			void battle.stream.write(
				`>eval pokemon('${player}','${pokemon}').getMoveData('${move}').pp = ${parseInt(value)};`
			);
			break;
		case 'boost':
		case 'b':
			if (targets.length !== 4) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, pokemon, stat, value] = targets.map(f => f.trim());
			[player, pokemon, stat] = [player, pokemon, stat].map(toID);
			void battle.stream.write(
				`>eval let p=pokemon('${player}','${pokemon}');battle.boost({${stat}:${parseInt(value)}},p)`
			);
			break;
		case 'volatile':
		case 'v':
			if (targets.length !== 3) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, pokemon, value] = targets.map(toID);
			void battle.stream.write(
				`>eval pokemon('${player}','${pokemon}').addVolatile('${value}')`
			);
			break;
		case 'sidecondition':
		case 'sc':
			if (targets.length !== 2) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[player, value] = targets.map(toID);
			void battle.stream.write(`>eval player('${player}').addSideCondition('${value}', 'debug')`);
			break;
		case 'fieldcondition': case 'pseudoweather':
		case 'fc':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[value] = targets.map(toID);
			void battle.stream.write(`>eval battle.field.addPseudoWeather('${value}', 'debug')`);
			break;
		case 'weather':
		case 'w':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[value] = targets.map(toID);
			void battle.stream.write(`>eval battle.field.setWeather('${value}', 'debug')`);
			break;
		case 'terrain':
		case 't':
			if (targets.length !== 1) {
				this.errorReply("Incorrect command use");
				return this.parse('/help editbattle');
			}
			[value] = targets.map(toID);
			void battle.stream.write(`>eval battle.field.setTerrain('${value}', 'debug')`);
			break;
		case 'reseed':
			if (targets.length !== 0) {
				if (targets.length !== 4) {
					this.errorReply("Seed must have 4 parts");
					return this.parse('/help editbattle');
				}
				// this just tests for a 5-digit number, close enough to uint16
				if (!targets.every(val => /^[0-9]{1,5}$/.test(val))) {
					this.errorReply("Seed parts much be unsigned 16-bit integers");
					return this.parse('/help editbattle');
				}
			}
			void battle.stream.write(`>reseed ${targets.join(',')}`);
			if (targets.length) this.sendReply(`Reseeded to ${targets.join(',')}`);
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
		`/editbattle reseed [optional seed]`,
		`Short forms: /ebat h OR s OR pp OR b OR v OR sc OR fc OR w OR t`,
		`[player] must be a username or number, [pokemon] must be species name or party slot number (not nickname), [move] must be move name.`,
	],
};

export const pages: Chat.PageTable = {
	bot(args, user, connection) {
		const [botid, ...pageArgs] = args;
		const pageid = pageArgs.join('-');
		if (pageid.length > 300) {
			throw new Chat.ErrorMessage(`The page ID specified is too long.`);
		}
		const bot = Users.get(botid);
		if (!bot) {
			return `<div class="pad"><h2>The bot "${bot}" is not available.</h2></div>`;
		}
		let canSend = Users.globalAuth.get(bot) === '*';
		let room;
		for (const curRoom of Rooms.global.chatRooms) {
			if (['*', '#'].includes(curRoom.auth.getDirect(bot.id))) {
				canSend = true;
				room = curRoom;
			}
		}
		if (!canSend) {
			return `<div class="pad"><h2>"${bot}" is not a bot.</h2></div>`;
		}
		connection.lastRequestedPage = `${bot.id}-${pageid}`;
		bot.sendTo(
			room ? room.roomid : 'lobby',
			`|pm|${user.getIdentity()}|${bot.getIdentity()}||requestpage|${user.name}|${pageid}`
		);
	},
};
