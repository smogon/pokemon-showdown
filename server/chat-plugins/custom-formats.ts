/**
 * Custom formats chat plugin.
 * Allows admins and drivers to create server-wide custom formats stored in
 * SQLite. Rules are frozen at creation time; further tweaks go through
 * explicit add/remove commands that rebuild the live format list immediately.
 * @author Pokemon Showdown contributors
 */

import { Utils } from '../../lib/utils';
import {
	CUSTOM_FORMAT_PREFIX, MAX_NAME_LENGTH, MIN_NAME_LENGTH, DEFAULT_SECTION,
} from '../custom-formats';

/** Validate the user-supplied portion of the name (without [Custom] prefix). */
function validateDisplayName(name: string): string {
	name = name.trim();
	if (!name) throw new Chat.ErrorMessage(`You must provide a format name.`);
	if (name.startsWith('[Custom]') || name.startsWith('[custom]')) {
		throw new Chat.ErrorMessage(`Do not include "[Custom]" in the name — it is added automatically.`);
	}
	if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
		throw new Chat.ErrorMessage(
			`Format name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`
		);
	}
	if (!/^[a-zA-Z0-9 \-']+$/.test(name)) {
		throw new Chat.ErrorMessage(`Format name may only contain letters, numbers, spaces, hyphens, and apostrophes.`);
	}
	return name;
}

/** Resolve a format ID from user input and verify it is a known custom format. */
async function resolveCustomFormat(target: string) {
	const id = toID(target.startsWith(CUSTOM_FORMAT_PREFIX) ? target : CUSTOM_FORMAT_PREFIX + target);
	const data = await Chat.CustomFormats.get(id);
	if (!data || !data.format.is_active) {
		throw new Chat.ErrorMessage(`Custom format '${id}' not found or has been deleted.`);
	}
	return { id, data };
}

function canManageFormat(user: User, owner: string): boolean {
	return user.id === toID(owner) || user.can('rangeban');
}

export const commands: Chat.ChatCommands = {
	async createformat(target, room, user) {
		this.checkChat();
		if (!user.can('promote')) {
			return this.errorReply(`/createformat - Access denied. Requires % (Driver) or higher.`);
		}
		const [rawName, rawBase] = target.split(',').map(s => s.trim());
		const displayName = validateDisplayName(rawName);
		if (!rawBase) return this.errorReply(`Specify a base format. Usage: /createformat [name], [base format]`);

		const baseFormat = Dex.formats.get(rawBase);
		if (!baseFormat.exists || baseFormat.effectType !== 'Format') {
			return this.errorReply(`Unrecognized base format: '${rawBase}'`);
		}

		const fullName = CUSTOM_FORMAT_PREFIX + displayName;
		const proposedId = toID(fullName);
		// Check collision with existing static formats
		if (Dex.formats.get(proposedId).exists) {
			return this.errorReply(`A format with the ID '${proposedId}' already exists.`);
		}

		const snapshot = {
			ruleset: baseFormat.ruleset.slice(),
			banlist: baseFormat.banlist.slice(),
			unbanlist: baseFormat.unbanlist.slice(),
			restricted: baseFormat.restricted.slice(),
		};

		const id = await Chat.CustomFormats.create(displayName, baseFormat.id, user.id, snapshot);
		// Intentionally synchronous reload: changes must be live immediately (plan requirement #4).
		// Format creation is rare (admin/driver only) so the rebuild cost is acceptable.
		Dex.formats.reload();
		this.globalModlog('CREATEFORMAT', null, `${fullName} (base: ${baseFormat.name}) by ${user.name}`);
		return this.sendReply(`Custom format '${fullName}' created (id: ${id}).`);
	},
	createformathelp: [`/createformat [name], [base format] - Creates a new server-wide custom format. Requires % or higher.`],

	async formatban(target, room, user) {
		this.checkChat();
		const [rawId, rawThing] = target.split(',').map(s => s.trim());
		if (!rawId || !rawThing) {
			return this.errorReply(`Usage: /formatban [format id], [thing to ban]`);
		}
		const { id, data } = await resolveCustomFormat(rawId);
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/formatban - Only the format owner or admins can modify this format.`);
		}
		await Chat.CustomFormats.addRule(id, rawThing, 'ban');
		Dex.formats.reload(); // immediate live update
		this.globalModlog('FORMATBAN', null, `${rawThing} in ${id} by ${user.name}`);
		return this.sendReply(`'${rawThing}' has been banned in '${data.format.display_name}'.`);
	},
	formatbanhelp: [`/formatban [format id], [thing] - Bans a Pokémon, item, move, or ability in a custom format.`],

	async formatunban(target, room, user) {
		this.checkChat();
		const [rawId, rawThing] = target.split(',').map(s => s.trim());
		if (!rawId || !rawThing) {
			return this.errorReply(`Usage: /formatunban [format id], [thing to unban]`);
		}
		const { id, data } = await resolveCustomFormat(rawId);
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/formatunban - Only the format owner or admins can modify this format.`);
		}
		await Chat.CustomFormats.addRule(id, rawThing, 'unban');
		Dex.formats.reload(); // immediate live update
		this.globalModlog('FORMATUNBAN', null, `${rawThing} in ${id} by ${user.name}`);
		return this.sendReply(`'${rawThing}' has been unbanned in '${data.format.display_name}'.`);
	},
	formatunbanhelp: [`/formatunban [format id], [thing] - Unbans something from the base snapshot in a custom format.`],

	async formatrestrict(target, room, user) {
		this.checkChat();
		const [rawId, rawThing] = target.split(',').map(s => s.trim());
		if (!rawId || !rawThing) {
			return this.errorReply(`Usage: /formatrestrict [format id], [thing to restrict]`);
		}
		const { id, data } = await resolveCustomFormat(rawId);
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/formatrestrict - Only the format owner or admins can modify this format.`);
		}
		await Chat.CustomFormats.addRule(id, rawThing, 'restrict');
		Dex.formats.reload(); // immediate live update
		this.globalModlog('FORMATRESTRICT', null, `${rawThing} in ${id} by ${user.name}`);
		return this.sendReply(`'${rawThing}' has been restricted in '${data.format.display_name}'.`);
	},
	formatrestricthelp: [`/formatrestrict [format id], [thing] - Restricts (soft-bans) something in a custom format.`],

	async formataddrule(target, room, user) {
		this.checkChat();
		const [rawId, rawRule] = target.split(',').map(s => s.trim());
		if (!rawId || !rawRule) {
			return this.errorReply(`Usage: /formataddrule [format id], [rule]`);
		}
		const { id, data } = await resolveCustomFormat(rawId);
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/formataddrule - Only the format owner or admins can modify this format.`);
		}
		// Validate the rule using the existing dex validator
		try {
			Dex.formats.validateRule(rawRule);
		} catch (e: any) {
			return this.errorReply(`Invalid rule: ${e.message}`);
		}
		await Chat.CustomFormats.addRule(id, rawRule, 'ruleset');
		Dex.formats.reload(); // immediate live update
		this.globalModlog('FORMATADDRULE', null, `${rawRule} in ${id} by ${user.name}`);
		return this.sendReply(`Rule '${rawRule}' added to '${data.format.display_name}'.`);
	},
	formataddrulehelp: [`/formataddrule [format id], [rule] - Adds a ruleset entry (e.g. Sleep Clause Mod) to a custom format.`],

	async formatremoverule(target, room, user) {
		this.checkChat();
		const [rawId, rawRule] = target.split(',').map(s => s.trim());
		if (!rawId || !rawRule) {
			return this.errorReply(`Usage: /formatremoverule [format id], [rule]`);
		}
		const { id, data } = await resolveCustomFormat(rawId);
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/formatremoverule - Only the format owner or admins can modify this format.`);
		}
		await Chat.CustomFormats.removeRule(id, rawRule);
		Dex.formats.reload(); // immediate live update
		this.globalModlog('FORMATREMOVERULE', null, `${rawRule} in ${id} by ${user.name}`);
		return this.sendReply(`Rule '${rawRule}' removed from '${data.format.display_name}'.`);
	},
	formatremoverulehelp: [`/formatremoverule [format id], [rule] - Removes any rule from a custom format.`],

	async deleteformat(target, room, user) {
		this.checkChat();
		const { id, data } = await resolveCustomFormat(target.trim());
		if (!canManageFormat(user, data.format.owner)) {
			return this.errorReply(`/deleteformat - Only the format owner or admins can delete this format.`);
		}
		await Chat.CustomFormats.deactivate(id);
		Dex.formats.reload(); // immediate live update
		this.globalModlog('DELETEFORMAT', null, `${id} by ${user.name}`);
		return this.sendReply(`Custom format '${data.format.display_name}' has been deactivated.`);
	},
	deleteformathelp: [`/deleteformat [format id] - Deactivates a custom format. Requires ownership or admin.`],

	async viewformat(target, room, user, connection) {
		this.checkChat();
		const id = toID(target.startsWith(CUSTOM_FORMAT_PREFIX) ? target : CUSTOM_FORMAT_PREFIX + target);
		const data = await Chat.CustomFormats.get(id);
		if (!data) return this.errorReply(`Custom format '${id}' not found.`);
		const { format, rules, snapshot } = data;

		const bans = rules.filter(r => r.rule_type === 'ban');
		const unbans = rules.filter(r => r.rule_type === 'unban');
		const restricts = rules.filter(r => r.rule_type === 'restrict');
		const rulesetRules = rules.filter(r => r.rule_type === 'ruleset');

		let buf = `<div class="pad">`;
		buf += `<h2>${Utils.escapeHTML(format.display_name)}</h2>`;
		buf += `<p><b>Base format:</b> ${Utils.escapeHTML(format.base_format)}</p>`;
		buf += `<p><b>Owner:</b> ${Utils.escapeHTML(format.owner)}</p>`;
		buf += `<p><b>Status:</b> ${format.is_active ? '<span style="color:green">Active</span>' : '<span style="color:red">Inactive</span>'}</p>`;
		buf += `<hr/>`;
		buf += `<h3>Inherited Ruleset (frozen at creation)</h3>`;
		if (snapshot.ruleset.length) {
			buf += `<ul>${snapshot.ruleset.map(r => `<li>${Utils.escapeHTML(r)}</li>`).join('')}</ul>`;
		} else {
			buf += `<p><em>None</em></p>`;
		}
		if (snapshot.banlist.length) {
			buf += `<h3>Inherited Bans</h3><ul>${snapshot.banlist.map(r => `<li>- ${Utils.escapeHTML(r)}</li>`).join('')}</ul>`;
		}
		if (snapshot.unbanlist.length) {
			buf += `<h3>Inherited Unbans</h3><ul>${snapshot.unbanlist.map(r => `<li>+ ${Utils.escapeHTML(r)}</li>`).join('')}</ul>`;
		}
		if (snapshot.restricted.length) {
			buf += `<h3>Inherited Restrictions</h3><ul>${snapshot.restricted.map(r => `<li>* ${Utils.escapeHTML(r)}</li>`).join('')}</ul>`;
		}
		buf += `<hr/><h3>Custom Additions</h3>`;
		if (!rules.length) {
			buf += `<p><em>No custom rules have been added yet.</em></p>`;
		} else {
			if (bans.length) buf += `<p><b>Added bans:</b> ${bans.map(r => `- ${Utils.escapeHTML(r.rule)}`).join(', ')}</p>`;
			if (unbans.length) buf += `<p><b>Added unbans:</b> ${unbans.map(r => `+ ${Utils.escapeHTML(r.rule)}`).join(', ')}</p>`;
			if (restricts.length) buf += `<p><b>Added restrictions:</b> ${restricts.map(r => `* ${Utils.escapeHTML(r.rule)}`).join(', ')}</p>`;
			if (rulesetRules.length) buf += `<p><b>Added ruleset rules:</b> ${rulesetRules.map(r => Utils.escapeHTML(r.rule)).join(', ')}</p>`;
		}
		buf += `</div>`;
		return this.sendReplyBox(buf);
	},
	viewformathelp: [`/viewformat [format id] - Shows an overview of a custom format and its differences from the base.`],

	async listcustomformats(target, room, user) {
		this.checkChat();
		const sections = await Chat.CustomFormats.getAll();
		if (!sections.length) return this.sendReply(`There are no active custom formats.`);
		let buf = `<div class="pad"><h2>Custom Formats</h2>`;
		for (const { section, formats } of sections) {
			buf += `<h3>${Utils.escapeHTML(section)}</h3><ul>`;
			for (const fmt of formats) {
				const id = toID(fmt.name);
				buf += `<li><b>${Utils.escapeHTML(fmt.name)}</b> `;
				buf += `<button class="button" name="send" value="/viewformat ${id}">View</button></li>`;
			}
			buf += `</ul>`;
		}
		buf += `</div>`;
		return this.sendReplyBox(buf);
	},
	listcustomformatshelp: [`/listcustomformats - Lists all active custom formats.`],
};
