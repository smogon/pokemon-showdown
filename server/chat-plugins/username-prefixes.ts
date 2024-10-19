/**
 * Code to manage username prefixes that force battles to be public or disable modchat.
 * @author Annika
 */

import {FS} from '../../lib';

const PREFIXES_FILE = 'config/chat-plugins/username-prefixes.json';
const PREFIX_DURATION = 10 * 24 * 60 * 60 * 1000;

export class PrefixManager {
	constructor() {
		// after a restart/newly using the plugin, load prefixes from config.js
		if (!Chat.oldPlugins['username-prefixes']) this.refreshConfig(true);
	}

	save() {
		FS(PREFIXES_FILE).writeUpdate(() => JSON.stringify(Config.forcedprefixes || []));
	}

	refreshConfig(configJustLoaded = false) {
		if (!Config.forcedprefixes) Config.forcedprefixes = [];
		// ensure everything is in the right format
		if (!Array.isArray(Config.forcedprefixes)) {
			const convertedPrefixes = [];
			for (const type in Config.forcedprefixes) {
				for (const prefix of Config.forcedprefixes[type].map(toID)) {
					convertedPrefixes.push({type, prefix, expireAt: Date.now() + PREFIX_DURATION});
				}
			}
			Config.forcedprefixes = convertedPrefixes;
		}
		if (configJustLoaded) {
			for (const entry of Config.forcedprefixes) {
				entry.prefix = toID(entry.prefix);
			}
		}

		let data: AnyObject[];
		try {
			data = JSON.parse(FS(PREFIXES_FILE).readSync());
		} catch (e: any) {
			if (e.code !== 'ENOENT') throw e;
			return;
		}
		if (data.length) {
			for (const entry of data) {
				if (Config.forcedprefixes.includes(entry)) continue;
				Config.forcedprefixes.push(entry);
			}
		}
	}

	addPrefix(prefix: ID, type: 'privacy' | 'modchat') {
		if (!Config.forcedprefixes) Config.forcedprefixes = [];
		const entry = Config.forcedprefixes.find((x: AnyObject) => x.prefix === prefix && x.type === type);
		if (entry) {
			throw new Chat.ErrorMessage(`Username prefix '${prefix}' is already configured to force ${type}.`);
		}

		Config.forcedprefixes.push({type, prefix, expireAt: Date.now() + PREFIX_DURATION});
		this.save();
	}

	removePrefix(prefix: ID, type: 'privacy' | 'modchat') {
		const entry = Config.forcedprefixes.findIndex((x: AnyObject) => x.prefix === prefix && x.type === type);
		if (entry < 0) {
			throw new Chat.ErrorMessage(`Username prefix '${prefix}' is not configured to force ${type}!`);
		}

		Config.forcedprefixes.splice(entry, 1);
		this.save();
	}

	validateType(type: string) {
		if (type !== 'privacy' && type !== 'modchat') {
			throw new Chat.ErrorMessage(`'${type}' is not a valid type of forced prefix. Valid types are 'privacy' and 'modchat'.`);
		}
		return type;
	}
}

export const prefixManager = new PrefixManager();

export const commands: Chat.ChatCommands = {
	forceprefix: 'usernameprefix',
	forcedprefix: 'usernameprefix',
	forcedprefixes: 'usernameprefix',
	usernameprefixes: 'usernameprefix',
	usernameprefix: {
		help: '',
		''() {
			this.parse(`/help forcedprefix`);
		},

		delete: 'add',
		remove: 'add',
		add(target, room, user, connection, cmd) {
			this.checkCan('addhtml');

			const isAdding = cmd.includes('add');

			const [prefix, type] = target.split(',').map(toID);
			if (!prefix || !type) return this.parse(`/help usernameprefix`);
			if (prefix.length > 18) {
				throw new Chat.ErrorMessage(`Specified prefix '${prefix}' is longer than the maximum user ID length.`);
			}

			if (isAdding) {
				prefixManager.addPrefix(prefix, prefixManager.validateType(type));
			} else {
				prefixManager.removePrefix(prefix, prefixManager.validateType(type));
			}

			this.globalModlog(`FORCEDPREFIX ${isAdding ? 'ADD' : 'REMOVE'}`, null, `'${prefix}' ${isAdding ? 'to' : 'from'} ${type}`);
			this.addGlobalModAction(`${user.name} set the username prefix ${prefix} to${isAdding ? '' : ' no longer'} disable ${type}.`);
		},

		view(target) {
			this.checkCan('addhtml');

			const types = target ? [prefixManager.validateType(toID(target))] : ['privacy', 'modchat'];

			const entries = Config.forcedprefixes.filter((x: any) => types.includes(x.type));

			return this.sendReplyBox(types.map(type => {
				const prefixes = entries.filter((x: any) => x.type === type).map((x: any) => x.prefix);
				const info = prefixes.length ?
					`<code>${prefixes.join('</code>, <code>')}</code>` : `none`;
				return `Username prefixes that disable <strong>${type}</strong>: ${info}.`;
			}).join(`<br />`));
		},
	},
	usernameprefixhelp() {
		return this.sendReplyBox(
			`<code>/usernameprefix add [prefix], [type]</code>: Sets the username prefix [prefix] to disable privacy or modchat on battles where at least one player has the prefix.<br />` +
			`<code>/usernameprefix remove [prefix], [type]</code>: Removes a prefix configuration.<br />` +
			`<code>/usernameprefix view [optional type]</code>: Displays the currently configured username prefixes.<br />` +
			`Valid types are <code>privacy</code> (which forces battles to take place in public rooms) and <code>modchat</code> (which prevents players from setting moderated chat).<br />` +
			`Requires: * ~`
		);
	},
};
