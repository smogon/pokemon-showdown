/**
 * Wrapper to facilitate posting / interacting with Smogon.
 * By Mia.
 * @author mia-pi-git
 */
import {Net, FS, Utils} from '../../lib';

export interface Nomination {
	by: ID;
	ips: string[];
	info: string;
	date: number;
	standing: string;
	alts: string[];
	primaryID: ID;
	claimed?: ID;
	post?: string;
}

interface IPData {
	country: string;
	isp: string;
	city: string;
	regionName: string;
	lat: number;
	lon: number;
}

export function getIPData(ip: string) {
	try {
		return Net("https://miapi.dev/api/ip/" + ip).get().then(JSON.parse) as Promise<IPData>;
	} catch {
		return null;
	}
}

export const Smogon = new class {
	async post(threadNum: string, postText: string) {
		if (!Config.smogon) return null;
		try {
			const raw = await Net(`https://www.smogon.com/forums/api/posts`).get({
				method: 'POST',
				body: new URLSearchParams({
					thread_id: threadNum,
					message: postText,
				}).toString(),
				headers: {
					'XF-Api-Key': Config.smogon,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			// todo return URL of post
			const data = JSON.parse(raw);
			if (data.errors?.length) {
				const errData = data.errors.pop();
				throw new Error(errData.message);
			}
			return data;
		} catch (e: any) {
			if (e.message.includes('Not Found')) {
				// special case to be loud
				throw new Error("WHO DELETED THE PERMA THREAD");
			}
			return {error: e.message};
		}
	}
};

export const Nominations = new class {
	noms: Nomination[] = [];
	icons: Record<string, string> = {};
	constructor() {
		this.load();
	}
	load() {
		try {
			let data = JSON.parse(FS('config/chat-plugins/permas.json').readSync());
			if (Array.isArray(data)) {
				data = {noms: data, icons: {}};
				FS('config/chat-plugins/permas.json').writeSync(JSON.stringify(data));
			}
			this.noms = data.noms;
			this.icons = data.icons;
		} catch {}
	}
	fetchModlog(id: string) {
		return Rooms.Modlog.search('global', {
			user: [{search: id, isExact: true}],
			note: [],
			ip: [],
			action: [],
			actionTaker: [],
		}, undefined, true);
	}
	save() {
		FS('config/chat-plugins/permas.json').writeUpdate(() => JSON.stringify({noms: this.noms, icons: this.icons}));
	}
	notifyStaff() {
		const usRoom = Rooms.get('upperstaff');
		if (!usRoom) return;
		usRoom.send(`|uhtml|permanoms|${this.getDisplayButton()}`);
		Chat.refreshPageFor('permalocks', usRoom);
	}
	async add(target: string, connection: Connection) {
		const user = connection.user;
		const [primary, rawAlts, rawIps, type, details] = Utils.splitFirst(target, '|', 4).map(f => f.trim());
		const primaryID = toID(primary);
		const alts = rawAlts.split(',').map(toID).filter(Boolean);
		const ips = rawIps.split(',').map(f => f.trim()).filter(Boolean);
		for (const ip of ips) {
			if (!IPTools.ipRegex.test(ip)) this.error(`Invalid IP: ${ip}`, connection);
		}
		const standings = this.getStandings();
		if (!standings[type]) {
			this.error(`Invalid standing: ${type}.`, connection);
		}
		if (!details) {
			this.error("Details must be provided. Explain why this user should be permalocked.", connection);
		}
		if (!primaryID) {
			this.error("A primary username must be provided. Use one of their alts if necessary.", connection);
		}
		for (const nom of this.noms) {
			if (nom.primaryID === primaryID) {
				this.error(`'${primaryID}' was already nominated for permalock by ${nom.by}.`, connection);
			}
		}
		const ipTable = new Set<string>(ips);
		const altTable = new Set<string>([...alts]);
		for (const alt of [primaryID, ...alts]) {
			const modlog = await this.fetchModlog(alt);
			if (!modlog || !modlog.results.length) continue;
			for (const entry of modlog.results) {
				if (entry.ip) ipTable.add(entry.ip);
				if (entry.autoconfirmedID) altTable.add(entry.autoconfirmedID);
				if (entry.alts) {
					for (const id of entry.alts) altTable.add(id);
				}
			}
		}
		altTable.delete(primaryID);
		this.noms.push({
			by: user.id,
			alts: [...altTable],
			ips: Utils.sortBy([...ipTable], z => -(IPTools.ipToNumber(z) || Infinity)),
			info: details,
			primaryID,
			standing: type,
			date: Date.now(),
		});
		Utils.sortBy(this.noms, nom => -nom.date);
		this.save();
		this.notifyStaff();
		Rooms.get('staff')?.addByUser(user, `${user.name} submitted a perma nomination for ${primaryID}`);
	}
	find(id: string) {
		return this.noms.find(f => f.primaryID === id);
	}
	error(message: string, conn: Connection): never {
		conn.popup(message);
		throw new Chat.Interruption();
	}
	close(target: string, context: Chat.CommandContext) {
		const entry = this.find(target);
		if (!entry) {
			this.error(`There is no nomination pending for '${toID(target)}'.`, context.connection);
		}
		this.noms.splice(this.noms.findIndex(f => f.primaryID === entry.primaryID), 1);
		this.save();
		this.notifyStaff();
		// todo fix when on good comp
		return context.closePage(`permalocks-view-${entry.primaryID}`);
	}
	display(nom: Nomination, canEdit?: boolean) {
		let buf = `<div class="infobox">`;
		let title = nom.primaryID as string;
		if (canEdit) {
			title = `<a href="/view-permalocks-view-${nom.primaryID}" target="_replace">${nom.primaryID}</a>`;
		}
		buf += `<strong>${title}</strong> (submitted by ${nom.by})<br />`;
		buf += `Submitted ${Chat.toTimestamp(new Date(nom.date), {human: true})}<br />`;
		buf += `${Chat.count(nom.alts, 'alts')}, ${Chat.count(nom.ips, 'IPs')}`;
		buf += `</div>`;
		return buf;
	}
	displayModlog(results: import('../modlog').ModlogEntry[] | null) {
		if (!results) return '';
		let curDate = '';
		return results.map(result => {
			const date = new Date(result.time || Date.now());
			const entryRoom = result.visualRoomID || result.roomID || 'global';
			let [dateString, timestamp] = Chat.toTimestamp(date, {human: true}).split(' ');
			let line = `<small>[${timestamp}] (${entryRoom})</small> ${result.action}`;
			if (result.userid) {
				line += `: [${result.userid}]`;
				if (result.autoconfirmedID) line += ` ac: [${result.autoconfirmedID}]`;
				if (result.alts.length) line += ` alts: [${result.alts.join('], [')}]`;
				if (result.ip) line += ` [<a href="https://whatismyipaddress.com/ip/${result.ip}" target="_blank">${result.ip}</a>]`;
			}

			if (result.loggedBy) line += `: by ${result.loggedBy}`;
			if (result.note) line += Utils.html`: ${result.note}`;

			if (dateString !== curDate) {
				curDate = dateString;
				dateString = `</p><p>[${dateString}]<br />`;
			} else {
				dateString = ``;
			}
			const thisRoomID = entryRoom?.split(' ')[0];
			if (thisRoomID.startsWith('battle-')) {
				timestamp = `<a href="/${thisRoomID}">${timestamp}</a>`;
			} else {
				const [day, time] = Chat.toTimestamp(date).split(' ');
				timestamp = `<a href="/view-chatlog-${thisRoomID}--${day}--time-${toID(time)}">${timestamp}</a>`;
			}
			return `${dateString}${line}`;
		}).join(`<br />`);
	}
	async displayActionPage(nom: Nomination) {
		let buf = `<div class="pad">`;
		const standings = this.getStandings();
		buf += `<button class="button" name="send" value="/perma viewnom ${nom.primaryID}" style="float:right">`;
		buf += `<i class="fa fa-refresh"></i> Refresh</button>`;
		buf += `<h3>Nomination: ${nom.primaryID}</h3><hr />`;
		buf += `<strong>By:</strong> ${nom.by} (on ${Chat.toTimestamp(new Date(nom.date))})<br />`;
		buf += `<strong>Recommended punishment:</strong> ${standings[nom.standing]}<br />`;
		buf += `<details class="readmore"><summary><strong>Modlog</strong></summary>`;
		buf += `<div class="infobox limited">`;
		const modlog = await this.fetchModlog(nom.primaryID);
		if (!modlog) {
			buf += `None found.`;
		} else {
			buf += this.displayModlog(modlog.results);
		}
		buf += `</div></details>`;
		if (nom.alts.length) {
			buf += `<details class="readmore"><summary><strong>Listed alts</strong></summary>`;
			for (const [i, alt] of nom.alts.entries()) {
				buf += `- ${alt}: `;
				buf += `<form data-submitsend="/perma standing ${alt},{standing},{reason}">`;
				buf += this.standingDropdown("standing");
				buf += ` <button class="button notifying" type="submit">Change standing</button>`;
				buf += ` <input name="reason" placeholder="Reason" />`;
				buf += `</form>`;
				if (nom.alts[i + 1]) buf += `<br />`;
			}
			buf += `</details>`;
		}
		if (nom.ips.length) {
			buf += `<details class="readmore"><summary><strong>Listed IPs</strong></summary>`;
			for (const [i, ip] of nom.ips.entries()) {
				const ipData = await getIPData(ip);
				buf += `- <a href="https://whatismyipaddress.com/ip/${ip}">${ip}</a>`;
				if (ipData) {
					buf += `(ISP: ${ipData.isp}, loc: ${ipData.city}, ${ipData.regionName} in ${ipData.country})`;
				}
				buf += `: `;
				buf += `<form data-submitsend="/perma ipstanding ${ip},{standing},{reason}">`;
				buf += this.standingDropdown("standing");
				buf += ` <button class="button notifying" type="submit">Change standing for all users on IP</button>`;
				buf += ` <input name="reason" placeholder="Reason" />`;
				buf += `</form>`;
				if (nom.ips[i + 1]) buf += `<br />`;
			}
			buf += `</details>`;
		}
		const [matches] = await LoginServer.request('ipmatches', {
			id: nom.primaryID,
		});
		if (matches?.results?.length) {
			buf += `<details class="readmore"><summary><strong>Registration IP matches</strong></summary>`;
			for (const [i, {userid, banstate}] of matches.results.entries()) {
				buf += `- ${userid}: `;
				buf += `<form data-submitsend="/perma standing ${userid},{standing}">`;
				buf += this.standingDropdown("standing", banstate + "");
				buf += ` <button class="button notifying" type="submit">Change standing</button></form>`;
				if (matches.results[i + 1]) buf += `<br />`;
			}
			buf += `</details>`;
		}
		buf += `<p><strong>Staff notes:</strong></p>`;
		buf += `<p><div class="infobox">${Chat.formatText(nom.info).replace(/\n/ig, '<br />')}</div></p>`;
		buf += `<details class="readmore"><summary><strong>Act on primary:</strong></summary>`;
		buf += `<form data-submitsend="/perma actmain ${nom.primaryID},{standing},{note}">`;
		buf += `Standing: ${this.standingDropdown('standing')}`;
		buf += `<br />Notes:<br />`;
		buf += `<textarea name="note" style="width: 100%" cols="50" rows="10"></textarea><br />`;
		buf += `<button class="button notifying" type="submit">Change standing and make post</button>`;
		buf += `</form></details><br />`;
		buf += `<button class="button notifying" name="send" value="/perma resolve ${nom.primaryID}">Mark resolved</button>`;
		return buf;
	}
	standingDropdown(elemName: string, curStanding: string | null = null) {
		let buf = `<select name="${elemName}">`;
		const standings = this.getStandings();
		for (const k in standings) {
			buf += `<option ${curStanding === k ? "disabled" : ""} value="${k}">${standings[k]}</option>`;
		}
		buf += `</select>`;
		return buf;
	}
	getStandings() {
		if (Config.standings) return Config.standings;
		Config.standings = {
			'-20': "Confirmed",
			'-10': "Autoconfirmed",
			'0': "New",
			"20": "Permalock",
			"30": "Permaban",
			"100": "Disabled",
		};
		return Config.standings;
	}
	displayAll(canEdit: boolean) {
		let buf = `<div class="pad">`;
		buf += `<button class="button" name="send" value="/perma noms" style="float:right"><i class="fa fa-refresh"></i> Refresh</button>`;
		buf += `<h3>Pending perma nominations</h3><hr />`;
		if (!this.noms.length) {
			buf += `None found.`;
			return buf;
		}
		for (const nom of this.noms) {
			buf += this.display(nom, canEdit);
			buf += `<br />`;
		}
		return buf;
	}
	displayNomPage() {
		let buf = `<div class="pad"><h3>Make a nomination for a permanent punishment.</h3><hr />`;
		// const [primary, rawAlts, rawIps, details] = Utils.splitFirst(target, '|', 3).map(f => f.trim());
		buf += `<form data-submitsend="/perma submit {primary}|{alts}|{ips}|{type}|{details}">`;
		buf += `<div class="infobox">`;
		buf += `<strong>Primary userid:</strong> <input name="primary" /><br />`;
		buf += `<strong>Alts:</strong><br /><textarea name="alts"></textarea><br /><small>(Separated by commas)</small><br />`;
		buf += `<strong>Static IPs:</strong><br /><textarea name="ips"></textarea><br /><small>(Separated by commas)</small></div><br />`;
		buf += `<strong>Punishment:</strong> `;
		buf += `<select name="type"><option value="20">Permalock</option><option value="30">Permaban</option></select>`;
		buf += `<div class="infobox">`;
		buf += `<strong>Please explain why this user deserves a permanent punishment</strong><br />`;
		buf += `<small>Note: Modlogs are automatically included in review and do not need to be added here.</small><br />`;
		buf += `<textarea style="width: 100%" name="details" cols="50" rows="10"></textarea></div>`;
		buf += `<button class="button notifying" type="submit">Submit nomination</button>`;
		return buf;
	}
	getDisplayButton() {
		const unclaimed = this.noms.filter(f => !f.claimed);
		let buf = `<div class="infobox">`;
		if (!this.noms.length) {
			buf += `No permalock nominations active.`;
		} else {
			let className = 'button';
			if (unclaimed.length) className += ' notifying';
			buf += `<button class="${className}" name="send" value="/j view-permalocks-list">`;
			buf += `${Chat.count(this.noms.length, 'nominations')}`;
			if (unclaimed.length !== this.noms.length) {
				buf += ` (${unclaimed.length} unclaimed)`;
			}
			buf += `</button>`;
		}
		buf += `</div>`;
		return buf;
	}
};

export const commands: Chat.ChatCommands = {
	perma: {
		''(target, room, user) {
			this.checkCan('lock');
			if (!user.can('rangeban')) {
				return this.parse(`/j view-permalocks-submit`);
			} else {
				return this.parse(`/j view-permalocks-list`);
			}
		},
		viewnom(target) {
			this.checkCan('rangeban');
			return this.parse(`/j view-permalocks-view-${toID(target)}`);
		},
		submit(target, room, user) {
			this.checkCan('lock');
			return Nominations.add(target, this.connection);
		},
		list() {
			this.checkCan('lock');
			return this.parse(`/j view-permalocks-list`);
		},
		nom() {
			this.checkCan('lock');
			return this.parse(`/j view-permalocks-submit`);
		},
		async actmain(target, room, user) {
			this.checkCan('rangeban');
			const [primaryName, standingName, postReason] = Utils.splitFirst(target, ',', 2).map(f => f.trim());
			const primary = toID(primaryName);
			if (!primary) return this.popupReply(`Invalid primary username.`);
			const nom = Nominations.find(primary);
			if (!nom) return this.popupReply(`No permalock nomination found for ${primary}.`);
			const standing = parseInt(standingName);
			const standings = Nominations.getStandings();
			if (!standings[standing]) return this.popupReply(`Invalid standing.`);
			if (!toID(postReason)) return this.popupReply(`A reason must be given.`);
			// todo thread num
			const threadNum = Config.permathread;
			if (!threadNum) {
				throw new Chat.ErrorMessage("The link to the perma has not been set - the post could not be made.");
			}
			let postBuf = `[b][url="https://${Config.routes.root}/users/${primary}"]${primary}[/url][/b]`;
			const icon = Nominations.icons[user.id] ? `:${Nominations.icons[user.id]}: - ` : ``;
			postBuf += ` was added to ${standings[standing]} by ${user.name} (${icon}${postReason}).\n`;
			postBuf += `Nominated by ${nom.by}.\n[spoiler=Nomination notes]${nom.info}[/spoiler]\n`;
			postBuf += `${nom.alts.length ? `[spoiler=Alts]${nom.alts.join(', ')}[/spoiler]` : ""}\n`;
			if (nom.ips.length) {
				postBuf += `[spoiler=IPs]`;
				for (const ip of nom.ips) {
					const ipData = await getIPData(ip);
					postBuf += `- [url=https://whatismyipaddress.com/ip/${ip}]${ip}[/url]`;
					if (ipData) {
						postBuf += ` (ISP: ${ipData.isp}, loc: ${ipData.city}, ${ipData.regionName} in ${ipData.country})`;
					}
					postBuf += '\n';
				}
				postBuf += `[/spoiler]`;
			}

			const modlog = await Nominations.fetchModlog(nom.primaryID);
			if (modlog?.results.length) {
				let rawHTML = Nominations.displayModlog(modlog.results);
				rawHTML = rawHTML.replace(/<br \/>/g, '\n');
				rawHTML = Utils.stripHTML(rawHTML);
				rawHTML = rawHTML.replace(/&#x2f;/g, '/');
				postBuf += `\n[spoiler=Modlog]${rawHTML}[/spoiler]`;
			}

			const res = await Smogon.post(
				threadNum,
				postBuf,
			);
			if (!res || res.error) {
				return this.popupReply(`Error making post: ${res?.error}`);
			}
			const url = `https://smogon.com/forums/threads/${threadNum}/post-${res.post.post_id}`;
			const result = await LoginServer.request('setstanding', {
				user: primary,
				standing,
				reason: url,
				actor: user.id,
			});
			if (result[1]) {
				return this.popupReply(`Error changing standing: ${result[1].message}`);
			}
			nom.post = url;
			this.popupReply(`|html|Standing successfully changed. Smogon post can be found <a href="${url}">at this link</a>.`);
		},
		async standing(target) {
			this.checkCan('rangeban');
			const [name, rawStanding, reason] = Utils.splitFirst(target, ',', 2).map(f => f.trim());
			const id = toID(name);
			if (!id || id.length > 18) {
				return this.popupReply('Invalid username: ' + name);
			}
			const standingNum = parseInt(rawStanding);
			if (!standingNum) {
				return this.popupReply(`Invalid standing: ` + rawStanding);
			}
			if (!reason.length) {
				return this.popupReply(`A reason must be given.`);
			}
			const res = await LoginServer.request('setstanding', {
				user: id,
				standing: standingNum,
				reason,
				actor: this.user.id,
			});
			if (res[1]) {
				return this.popupReply(`Error in standing change: ` + res[1].message);
			}
			this.popupReply(`Standing successfully changed to ${standingNum} for ${id}.`);
			// no need to modlog, is in usermodlog already
		},
		async ipstanding(target) {
			this.checkCan('rangeban');
			const [ip, standingName, reason] = Utils.splitFirst(target, ',', 2).map(f => f.trim());
			if (!IPTools.ipToNumber(ip)) {
				return this.popupReply(`Invalid IP: ${ip}`);
			}
			const standingNum = parseInt(standingName);
			if (!Config.standings[`${standingNum}`]) {
				return this.popupReply(`Invalid standing: ${standingName}.`);
			}
			if (!reason.length) {
				return this.popupReply('Specify a reason.');
			}
			const res = await LoginServer.request('ipstanding', {
				reason,
				standing: standingNum,
				ip,
				actor: this.user.id,
			});
			if (res[1]) {
				return this.popupReply(`Error changing standing: ${res[1].message}`);
			}
			this.popupReply(`All standings on the IP ${ip} changed successfully to ${standingNum}.`);
			this.globalModlog(`IPSTANDING`, null, `${standingNum}${reason ? ` (${reason})` : ""}`, ip);
		},
		resolve(target) {
			this.checkCan('rangeban');
			Nominations.close(target, this);
		},
		seticon(target, room, user) {
			this.checkCan('rangeban');
			let [monName, targetId] = target.split(',');
			if (!targetId) targetId = user.id;
			const mon = Dex.species.get(monName);
			if (!mon.exists) {
				return this.errorReply(`Species ${monName} does not exist.`);
			}
			Nominations.icons[targetId] = mon.name.toLowerCase();
			Nominations.save();
			this.sendReply(
				`|html|Updated ${targetId === user.id ? 'your' : `${targetId}'s`} permalock post icon to ` +
				`<psicon pokemon='${mon.name.toLowerCase()}' />`
			);
		},
		deleteicon(target, room, user) {
			this.checkCan('rangeban');
			const targetID = toID(target);
			if (!Nominations.icons[targetID]) {
				return this.errorReply(`${targetID} does not have an icon set.`);
			}
			delete Nominations.icons[targetID];
			Nominations.save();
			this.sendReply(`Removed ${targetID}'s permalock post icon.`);
		},
		help: [
			'/perma nom OR /perma - Open the page to make a nomination for a permanent punishment. Requires: % @ ~',
			'/perma list - View open nominations. Requires: % @ ~',
			'/perma viewnom [userid] - View a nomination for the given [userid]. Requires: ~',
		],
	},
};

export const pages: Chat.PageTable = {
	permalocks: {
		list(query, user, conn) {
			this.checkCan('lock');
			this.title = '[Permalock Nominations]';
			return Nominations.displayAll(user.can('rangeban'));
		},
		view(query, user) {
			this.checkCan('rangeban');
			const id = toID(query.shift());
			if (!id) return this.errorReply(`Invalid userid.`);
			const nom = Nominations.find(id);
			if (!nom) return this.errorReply(`No nomination found for '${id}'.`);
			this.title = `[Perma Nom] ${nom.primaryID}`;
			return Nominations.displayActionPage(nom);
		},
		submit() {
			this.checkCan('lock');
			this.title = '[Perma Nom] Create';
			return Nominations.displayNomPage();
		},
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/perma(noms?)? ');
});
