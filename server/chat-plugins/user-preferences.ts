/**
 * User preferences chat plugin.
 * Exposes /getpref, /setpref, /deletepref, /exportprefs commands so the
 * client can persist settings server-side instead of in localStorage.
 * @author Pokemon Showdown contributors
 */

import { Utils } from '../../lib/utils';
import { ALLOWED_PREFERENCE_KEYS, MAX_PREFERENCE_VALUE_LENGTH } from '../user-preferences';

export const commands: Chat.ChatCommands = {
	async getpref(target, room, user, connection) {
		this.checkChat();
		if (!user.named) return this.errorReply(`You must be logged in to use preferences.`);
		const key = toID(target);
		if (!key) return this.errorReply(`Specify a preference key.`);
		if (!ALLOWED_PREFERENCE_KEYS.has(key)) {
			return this.errorReply(`Unknown preference key: ${key}`);
		}
		const prefs = await Chat.UserPreferences.load(user.id);
		const value = prefs[key] ?? null;
		connection.send(`|queryresponse|pref|${JSON.stringify({ key, value })}`);
	},
	getprefhelp: [`/getpref [key] - Returns the stored value for a preference key.`],

	async setpref(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply(`You must be logged in to use preferences.`);
		const [rawKey, ...valueParts] = target.split(',');
		const key = toID(rawKey);
		if (!key) return this.errorReply(`Specify a preference key.`);
		const value = valueParts.join(',').trim();
		if (!ALLOWED_PREFERENCE_KEYS.has(key)) {
			return this.errorReply(`Unknown preference key: ${key}`);
		}
		if (value.length > MAX_PREFERENCE_VALUE_LENGTH) {
			return this.errorReply(`Preference value is too long (max ${MAX_PREFERENCE_VALUE_LENGTH} characters).`);
		}
		await Chat.UserPreferences.set(user.id, key, value);
		this.sendReply(`|queryresponse|pref|${JSON.stringify({ key, value, saved: true })}`);
	},
	setprefhelp: [`/setpref [key], [value] - Stores a preference server-side. Overwrites any existing value.`],

	async deletepref(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply(`You must be logged in to use preferences.`);
		const key = toID(target);
		if (!key) return this.errorReply(`Specify a preference key.`);
		if (!ALLOWED_PREFERENCE_KEYS.has(key)) {
			return this.errorReply(`Unknown preference key: ${key}`);
		}
		await Chat.UserPreferences.delete(user.id, key);
		this.sendReply(`Preference '${key}' deleted.`);
	},
	deleteprefhelp: [`/deletepref [key] - Removes a stored preference.`],

	async exportprefs(target, room, user, connection) {
		this.checkChat();
		if (!user.named) return this.errorReply(`You must be logged in to use preferences.`);
		const prefs = await Chat.UserPreferences.load(user.id);
		connection.send(`|queryresponse|prefs|${JSON.stringify(prefs)}`);
	},
	exportprefshelp: [`/exportprefs - Returns all your stored preferences as JSON.`],

	async deleteallprefs(target, room, user) {
		this.checkChat();
		if (!user.named) return this.errorReply(`You must be logged in to use preferences.`);
		// Require a confirmation argument to avoid accidents
		if (toID(target) !== 'confirm') {
			return this.errorReply(`To delete all your stored preferences, use /deleteallprefs confirm`);
		}
		await Chat.UserPreferences.deleteAll(user.id);
		this.sendReply(`All your stored preferences have been deleted.`);
	},
	deleteallprefshelp: [`/deleteallprefs confirm - Removes ALL your stored preferences (GDPR erasure).`],
};

export const loginfilter: Chat.LoginFilter = user => {
	if (!Config.usesqlite || !user.named) return;
	// Send all stored preferences to the client so it can seed itself
	void (async () => {
		try {
			const prefs = await Chat.UserPreferences.load(user.id);
			if (Object.keys(prefs).length) {
				user.send(`|queryresponse|prefs|${JSON.stringify(prefs)}`);
			}
		} catch {}
	})();
};
