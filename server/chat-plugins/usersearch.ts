import {Utils} from '../../lib';

const ONLINE_SYMBOL = ` \u25C9 `;
const OFFLINE_SYMBOL = ` \u25CC `;

function searchUsernames(target: string, page = false) {
	const results: {offline: string[], online: string[]} = {
		offline: [],
		online: [],
	};
	for (const curUser of Users.users.values()) {
		if (!curUser.id.includes(target) || curUser.id.startsWith('guest')) continue;
		const escapedName = Utils.escapeHTML(curUser.name);
		const buttonHTML = `<button class="button" name="send" value="/msgroom staff,/fr ${escapedName}&#10;/j view-usersearch-${target}">Forcerename</button>`;
		if (curUser.connected) {
			results.online.push(`${ONLINE_SYMBOL} ${page ? `<username>` : ``}${escapedName}${page ? `</username> ${buttonHTML}` : ``}`);
		} else {
			results.offline.push(`${OFFLINE_SYMBOL} ${page ? `<username>` : ``}${escapedName}${page ? `</username> ${buttonHTML}` : ``}`);
		}
	}
	for (const k in results) {
		Utils.sortBy(results[k as keyof typeof results], result => toID(result));
	}
	let buf = ``;
	if (!page) {
		buf = `Users with a name matching '${target}':<br />`;
		if (!results.offline.length && !results.online.length) {
			buf += `No users found.`;
		} else {
			buf += results.online.join('; ');
			if (results.offline.length) {
				buf += `<br /><br />`;
				buf += results.offline.join('; ');
			}
		}
	} else {
		buf += `<div class="pad"><h1>Usernames containing "${target}"</h1>`;
		if (!results.offline.length && !results.online.length) {
			buf += `<p>No results found.</p>`;
		} else {
			if (results.online.length) {
				buf += `<h2>Online</h2>`;
				for (const [i, result] of results.online.entries()) {
					buf += `${i !== 0 ? '<br />' : ''}${result}`;
				}
			}
			if (results.online.length && results.offline.length) {
				buf += `<hr />`;
			}
			if (results.offline.length) {
				buf += `<h2>Offline</h2>`;
				for (const [i, result] of results.offline.entries()) {
					buf += `${i !== 0 ? '<br />' : ''}${result}`;
				}
			}
		}
		buf += `</div>`;
	}
	return buf;
}

export const commands: ChatCommands = {
	us: 'usersearch',
	uspage: 'usersearch',
	usersearchpage: 'usersearch',
	usersearch(target, room, user, connection, cmd) {
		this.checkCan('lock');
		target = toID(target);
		if (!target) {
			return this.parse(`/help usersearch`);
		}
		if (target.length < 3) {
			throw new Chat.ErrorMessage(`That's too short of a term to search for.`);
		}
		const showPage = cmd.includes('page');
		if (showPage) {
			this.parse(`/j view-usersearch-${target}`);
			return;
		}
		return this.sendReplyBox(searchUsernames(target));
	},
	usersearchhelp: [
		`/usersearch [pattern]: Looks for all names matching the [pattern]. Requires: % @ &`,
		`Adding "page" to the end of the command, i.e. /usersearchpage OR /uspage will bring up a page.`,
	],
};

export const pages: PageTable = {
	usersearch(query, user) {
		this.checkCan('lock');
		if (!query.length) return this.close();
		this.title = `[Usersearch] ${query[0]}`;
		const target = toID(query[0]);
		return searchUsernames(target, true);
	},
};
