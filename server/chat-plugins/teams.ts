/**
 * Plugin for sharing / storing teams in a database.
 * By Mia.
 * @author mia-pi-git
 */

import {PostgresDatabase, FS, Utils} from '../../lib';
import * as crypto from 'crypto';

/** Maximum amount of teams a user can have stored at once. */
const MAX_TEAMS = 200;
/** Max teams that can be viewed in a search */
const MAX_SEARCH = 3000;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

export interface StoredTeam {
	teamid: string;
	team: string;
	ownerid: ID;
	format: ID;
	title: string | null;
	date: Date;
	/** password */
	private: string | null;
	views: number;
}

interface TeamSearch {
	format?: string;
	owner?: string;
	pokemon?: string[];
	moves?: string[];
	abilities?: string[];
	gen?: number;
}

function refresh(context: Chat.PageContext) {
	return (
		`<button class="button" name="send" value="/j ${context.pageid}" style="float: right">` +
		` <i class="fa fa-refresh"></i> ${context.tr('Refresh')}</button>`
	);
}

export const TeamsHandler = new class {
	database = new PostgresDatabase();
	readyPromise: Promise<void> | null = Config.usepostgres ? (async () => {
		try {
			await this.database.query('SELECT * FROM teams LIMIT 1');
		} catch {
			await this.database.query(FS(`databases/schemas/teams.sql`).readSync());
		}
	})() : null;
	destroy() {
		void this.database.destroy();
	}

	async search(search: TeamSearch, user: User, count = 10, includePrivate = false) {
		const args = [];
		const where = [];
		if (count > 500) {
			throw new Chat.ErrorMessage("Cannot search more than 500 teams.");
		}
		if (search.format) {
			where.push(`format = $${args.length + 1}`);
			args.push(toID(search.format));
		}
		if (search.owner) {
			where.push(`ownerid = $${args.length + 1}`);
			args.push(toID(search.owner));
		}
		if (search.gen) {
			where.push(`format LIKE 'gen${search.gen}%'`);
		}
		if (!includePrivate) where.push('private IS NULL');

		const result = await this.query<StoredTeam>(
			`SELECT * FROM teams${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY date DESC LIMIT ${count}`,
			args,
		);
		return result.filter(row => {
			const team = Teams.unpack(row.team)!;
			if (row.private && row.ownerid !== user.id) {
				return false;
			}
			let match = true;
			if (search.pokemon?.length) {
				match = search.pokemon.some(
					pokemon => team.some(set => toID(set.species) === toID(pokemon))
				);
			}
			if (!match) return false;
			if (search.moves?.length) {
				match = search.moves.some(
					move => team.some(set => set.moves.some(m => toID(m) === toID(move)))
				);
			}
			if (!match) return false;
			if (search.abilities?.length) {
				match = search.abilities.some(
					ability => team.some(set => toID(set.ability) === toID(ability))
				);
			}
			return match;
		});
	}

	async query<T = any>(statement: string, values: any[] = []) {
		if (this.readyPromise) await this.readyPromise;
		return this.database.query(statement, values) as Promise<T[]>;
	}

	async save(
		context: Chat.CommandContext,
		formatName: string,
		rawTeam: string,
		teamName: string | null = null,
		isPrivate?: string | null,
		isUpdate?: number
	) {
		const connection = context.connection;
		this.validateAccess(connection, true);

		if (Monitor.countPrepBattle(connection.ip, connection)) {
			return null;
		}
		const user = connection.user;
		const format = Dex.formats.get(toID(formatName));
		if (format.effectType !== 'Format' || format.team) {
			connection.popup("Invalid format:\n\n" + formatName);
			return null;
		}
		let existing = null;
		if (isUpdate) {
			existing = await this.get(isUpdate);
			if (!existing) {
				connection.popup("You're trying to edit a team that doesn't exist.");
				return null;
			}
			if (context.user.id !== existing.ownerid) {
				connection.popup("This is not your team.");
				return null;
			}
		}

		const team = Teams.import(rawTeam, true);
		if (!team) {
			connection.popup('Invalid team:\n\n' + rawTeam);
			return null;
		}
		if (team.length > 24) {
			connection.popup("Your team has too many Pokemon.");
		}
		let unownWord = '';
		// now, we purge invalid nicknames and make sure it's an actual team
		// gotta use the validated team so that nicknames are removed
		for (const set of team) {
			const namedSpecies = Dex.species.get(set.name);
			// allow nicknames named after other mons - to support those OMs
			if (!namedSpecies.exists) {
				set.name = set.species;
			}
			if (!Dex.species.get(set.species).exists) {
				connection.popup(`Invalid Pokemon ${set.species} in team.`);
				return null;
			}
			const speciesid = toID(set.species);
			if (speciesid.length <= 6 && speciesid.startsWith('unown')) {
				unownWord += speciesid.charAt(5) || 'a';
			}
			if (set.moves.length > 24) {
				connection.popup("Only 24 moves are allowed per set.");
				return null;
			}
			for (const m of set.moves) {
				if (!Dex.moves.get(m).exists) {
					connection.popup(`Invalid move ${m} on ${set.species}.`);
					return null;
				}
			}
			// i have no idea how people are getting this, but we got enough reports that
			// i guess it's worth handling
			if (toID(set.ability) === 'none') {
				set.ability = 'No Ability';
			}
			if (set.ability && !Dex.abilities.get(set.ability).exists) {
				connection.popup(`Invalid ability ${set.ability} on ${set.species}.`);
				return null;
			}
			if (set.item && !Dex.items.get(set.item).exists) {
				connection.popup(`Invalid item ${set.item} on ${set.species}.`);
				return null;
			}
			if (set.nature && !Dex.natures.get(set.nature).exists) {
				connection.popup(`Invalid nature ${set.nature} on ${set.species}.`);
				return null;
			}
			if (set.teraType && !Dex.types.get(set.teraType).exists) {
				connection.popup(`Invalid Tera Type ${set.nature} on ${set.species}.`);
				return null;
			}
		}
		if (unownWord) {
			const filtered = Chat.nicknamefilter(unownWord, user);
			if (!filtered || filtered !== unownWord) {
				connection.popup(
					`Your team was rejected for the following reason:\n\n` +
					`- Your Unowns spell out a banned word: ${unownWord.toUpperCase()}`
				);
				return null;
			}
		}
		if (teamName) {
			if (teamName.length > 100) {
				connection.popup("Your team's name is too long.");
				return null;
			}
			const filtered = context.filter(teamName);
			if (!filtered || filtered?.trim() !== teamName.trim()) {
				connection.popup(`Your team's name has a filtered word.`);
				return null;
			}
		}
		const count = await this.count(user);
		if (count >= MAX_TEAMS) {
			connection.popup(`You have too many teams stored. If you wish to upload this team, delete some first.`);
			return null;
		}
		rawTeam = Teams.pack(team);
		if (!rawTeam.trim()) { // extra sanity check
			connection.popup("Invalid team provided.");
			return null;
		}
		// the && existing doesn't really matter because we've verified it above, this is just for TS
		if (isUpdate && existing) {
			const differenceExists = (
				existing.team !== rawTeam ||
				(teamName && teamName !== existing.title) ||
				format.id !== existing.format ||
				existing.private !== isPrivate
			);
			if (!differenceExists) {
				connection.popup("Your team was not saved as no changes were made.");
				return null;
			}
			await this.query(
				'UPDATE teams SET team = $1, title = $2, private = $3, format = $4 WHERE teamid = $5',
				[rawTeam, teamName, isPrivate, format.id, isUpdate]
			);
			return isUpdate;
		} else {
			const exists = await this.query('SELECT * FROM teams WHERE ownerid = $1 AND team = $2', [user.id, rawTeam]);
			if (exists.length) {
				connection.popup("You've already uploaded that team.");
				return null;
			}
			const loaded = await this.query(
				`INSERT INTO teams (ownerid, team, date, format, views, title, private) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING teamid`,
				[user.id, rawTeam, new Date(), format.id, 0, teamName, isPrivate]
			);
			return loaded?.[0].teamid;
		}
	}
	generatePassword(len = 20) {
		let pw = '';
		for (let i = 0; i < len; i++) pw += ALPHABET[crypto.randomInt(0, ALPHABET.length - 1)];
		return pw;
	}
	updateViews(teamid: string) {
		return this.query(`UPDATE teams SET views = views + 1 WHERE teamid = $1`, [teamid]);
	}
	list(userid: ID, count: number, publicOnly = false) {
		let query = `SELECT * FROM teams WHERE ownerid = $1 `;
		if (publicOnly) {
			query += `AND private IS NULL `;
		}
		query += `ORDER BY date DESC LIMIT $2`;
		return this.query<StoredTeam>(
			query, [userid, count]
		);
	}
	preview(teamData: StoredTeam, user?: User | null, isFull = false) {
		let buf = Utils.html`<strong>${teamData.title || `Untitled ${teamData.teamid}`}`;
		if (teamData.private) buf += ` (Private)`;
		buf += `</strong><br />`;
		buf += `<small>Uploaded by: <strong>${teamData.ownerid}</strong></small><br />`;
		buf += `<small>Uploaded on: ${Chat.toTimestamp(teamData.date, {human: true})}</small><br />`;
		buf += `<small>Format: ${Dex.formats.get(teamData.format).name}</small><br />`;
		buf += `<small>Views: ${teamData.views === -1 ? 0 : teamData.views}</small>`;
		const team = Teams.import(teamData.team);
		if (!team) {
			Monitor.crashlog(new Error(`Malformed team drawn from database`), 'A teams chat page', teamData);
			throw new Chat.ErrorMessage("Oops! Something went wrong. Try again later.");
		}
		let link = `view-team-${teamData.teamid}`;
		if (teamData.private) {
			link += `-${teamData.private}`;
		}
		buf += `<br /><a class="subtle" href="/${link}">`;
		buf += team.map(set => `<psicon pokemon="${set.species}" />`).join(' ');
		buf += `</a><br />${isFull ? 'View full team' : 'Shareable link to team'}</a>`;
		buf += ` <small>(or copy/paste <code>&lt;&lt;${link}&gt;&gt;</code> in chat to share!)</small>`;

		if (user && (teamData.ownerid === user.id || user.can('rangeban'))) {
			buf += `<br />`;
			buf += `<details class="readmore"><summary>Manage (edit/delete/etc)</summary>`;
			buf += `<button class="button" name="send" value="/teams setprivacy ${teamData.teamid},${teamData.private ? 'no' : 'yes'}">`;
			buf += teamData.private ? `Make public` : `Make private`;
			buf += `</button><br />`;
			buf += `<button class="button" name="send" value="/teams delete ${teamData.teamid}">Delete team</button><br />`;
			buf += `<button class="button" name="send" value="/j view-teams-edit-${teamData.teamid}">Edit team</button>`;
			buf += `</details>`;
		}
		return buf;
	}
	renderTeam(teamData: StoredTeam, user?: User) {
		let buf = this.preview(teamData, user, true);
		buf += `<hr />`;
		const team = Teams.unpack(teamData.team);
		if (!team) {
			Monitor.crashlog(new Error("Invalid team retrieved from database"), "A teams database request", teamData);
			throw new Chat.ErrorMessage("An error occurred with retrieving the team. Please try again later.");
		}
		buf += team.map(set => {
			let teamBuf = Teams.exportSet(set).replace(/\n/g, '<br />');
			if (set.name && set.name !== set.species) {
				teamBuf = teamBuf.replace(set.name, Utils.html`<psicon pokemon="${set.species}" /> <br />${set.name}`);
			} else {
				teamBuf = teamBuf.replace(set.species, `<psicon pokemon="${set.species}" /> <br />${set.species}`);
			}
			if (set.item) {
				const tester = new RegExp(`${Utils.escapeRegex(set.item)}\\b`);
				teamBuf = teamBuf.replace(tester, `${set.item} <psicon item="${set.item}" />`);
			}
			return teamBuf;
		}).join('<hr />');
		return buf;
	}
	validateAccess(conn: Connection, popup = false) {
		const user = conn.user;
		// if there's no user, they've disconnected, so it's safe to just interrupt here
		if (!user) throw new Chat.Interruption();
		const err = (message: string): never => {
			if (popup) {
				conn.popup(message);
				throw new Chat.Interruption();
			}
			throw new Chat.ErrorMessage(message);
		};

		if (!Config.usepostgres || !Config.usepostgresteams) {
			err(`The teams database is currently disabled.`);
		}
		if (!Users.globalAuth.atLeast(user, Config.usepostgresteams)) {
			err("You cannot currently use the teams database.");
		}
		if (user.locked || user.semilocked) err("You cannot use the teams database while locked.");
		if (!user.autoconfirmed) err("You must be autoconfirmed to use the teams database.");
	}
	async count(user: string | User) {
		const id = toID(user);
		const result = await this.query<{count: number}>(`SELECT count(*) AS count FROM teams WHERE ownerid = $1`, [id]);
		return result?.[0]?.count || 0;
	}
	async get(teamid: number | string): Promise<StoredTeam | null> {
		teamid = Number(teamid);
		if (isNaN(teamid)) {
			throw new Chat.ErrorMessage(`Invalid team ID.`);
		}
		const rows = await this.query(
			`SELECT * FROM teams WHERE teamid = $1`, [teamid],
		);
		if (!rows.length) return null;
		return rows[0] as StoredTeam;
	}
	async delete(id: string | number) {
		id = Number(id);
		if (isNaN(id)) {
			throw new Chat.ErrorMessage("Invalid team ID");
		}
		await this.query(
			`DELETE FROM teams WHERE teamid = $1`, [id],
		);
	}
};

export const destroy = () => TeamsHandler.destroy();

export const commands: Chat.ChatCommands = {
	teams: {
		upload() {
			return this.parse('/j view-teams-upload');
		},
		update: 'save',
		async save(target, room, user, connection, cmd) {
			TeamsHandler.validateAccess(connection, true);
			const targets = Utils.splitFirst(target, ',', 5);
			const isEdit = cmd === 'update';
			const rawTeamID = isEdit ? targets.shift() : undefined;
			let [teamName, formatid, rawPrivacy, rawTeam] = targets;
			const teamID = Number(rawTeamID);
			if (isEdit && (!rawTeamID?.length || isNaN(teamID))) {
				connection.popup("Invalid team ID provided.");
				return null;
			}
			if (rawTeam.includes('\n')) {
				rawTeam = Teams.pack(Teams.import(rawTeam, true));
			}
			if (!rawTeam) {
				connection.popup("Invalid team.");
				return null;
			}
			formatid = toID(formatid);
			teamName = toID(teamName) ? teamName : null!;
			const privacy = toID(rawPrivacy) === '1' ? TeamsHandler.generatePassword() : null;
			const id = await TeamsHandler.save(
				this, formatid, rawTeam, teamName, privacy, isEdit ? teamID : undefined
			);

			const page = isEdit ? 'edit' : 'upload';
			if (id) {
				connection.send(`|queryresponse|teamupload|` + JSON.stringify({teamid: id, teamName}));
				connection.send(`>view-teams-${page}\n|deinit`);
				this.parse(`/join view-teams-view-${id}-${id}`);
			} else {
				this.parse(`/join view-teams-${page}`);
				return;
			}
		},
		''(target) {
			return this.parse('/teams user ' + toID(target) || this.user.id);
		},
		latest() {
			return this.parse(`/j view-teams-filtered-latest`);
		},
		views: 'mostviews',
		mostviews() {
			return this.parse(`/j view-teams-filtered-views`);
		},
		user: 'view',
		for: 'view',
		view(target) {
			const [name, rawNum] = target.split(',').map(toID);
			const num = parseInt(rawNum);
			if (rawNum && isNaN(num)) {
				return this.popupReply(`Invalid count.`);
			}
			let page = 'view';
			switch (this.cmd) {
			case 'for': case 'user':
				page = 'all';
				break;
			}
			return this.parse(`/j view-teams-${page}-${toID(name)}${num ? `-${num}` : ''}`);
		},
		async delete(target, room, user, connection) {
			TeamsHandler.validateAccess(connection, true);
			const teamid = Number(toID(target));
			if (isNaN(teamid)) return this.popupReply(`Invalid team ID.`);
			const teamData = await TeamsHandler.get(teamid);
			if (!teamData) return this.popupReply(`Team not found.`);
			if (teamData.ownerid !== user.id && !user.can('rangeban')) {
				return this.errorReply("You cannot delete teams you do not own.");
			}
			await TeamsHandler.delete(teamid);
			this.popupReply(`Team ${teamid} deleted.`);
			for (const page of connection.openPages || new Set()) {
				if (page.startsWith('teams-')) this.refreshPage(page);
			}
		},
		async setprivacy(target, room, user, connection) {
			TeamsHandler.validateAccess(connection, true);
			const [teamId, rawPrivacy] = target.split(',').map(toID);
			let privacy: string | null;
			if (!teamId.length) {
				return this.popupReply('Invalid team ID.');
			}
			// these if checks may seem bit redundant but we want to ensure the user is certain about this
			// if it might be invalid, we want them to know that
			if (this.meansYes(rawPrivacy)) {
				privacy = TeamsHandler.generatePassword();
			} else if (this.meansNo(rawPrivacy)) {
				privacy = null;
			} else {
				return this.popupReply(`Invalid privacy setting.`);
			}
			const team = await TeamsHandler.get(teamId);
			if (!team) return this.popupReply(`Team not found.`);
			if (team.ownerid !== user.id && !user.can('rangeban')) {
				return this.popupReply(`You cannot change privacy for a team you don't own.`);
			}
			await TeamsHandler.query(`UPDATE teams SET private = $1 WHERE teamid = $2`, [privacy, teamId]);
			for (const pageid of this.connection.openPages || new Set()) {
				if (pageid.startsWith('teams-')) {
					this.refreshPage(pageid);
				}
			}
			return this.popupReply(privacy ? `Team set to private. Password: ${privacy}` : `Team set to public.`);
		},
		search(target, room, user) {
			return this.parse(`/j view-teams-searchpersonal`);
		},
		browse(target, room, user) {
			return this.parse(`/j view-teams-browse${target ? `-${target}` : ''}`);
		},
		help() {
			return this.parse('/help teams');
		},
	},
	teamshelp: [
		`/teams OR /teams for [user]- View the (public) teams of the given [user].`,
		`/teams upload - Open the page to upload a team.`,
		`/teams setprivacy [team id], [privacy] - Set the privacy of the team matching the [teamid].`,
		`/teams delete [team id] - Delete the team matching the [teamid].`,
		`/teams search - Opens the page to search your teams`,
		`/teams mostviews - Views public teams, sorted by most views.`,
		`/teams view [team ID] - View the team matching the given [team ID]`,
		`/teams browse - Opens a list of public teams uploaded by other users.`,
	],
};

export const pages: Chat.PageTable = {
	// support view-team-${teamid}
	team(query, user, connection) {
		return ((pages.teams as Chat.PageTable).view as Chat.PageHandler).call(this, query, user, connection);
	},
	teams: {
		async all(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection);
			const targetUserid = toID(query.shift()) || user.id;
			let count = Number(query.shift()) || 10;
			if (count > MAX_TEAMS) count = MAX_TEAMS;
			this.title = `[Teams] ${targetUserid}`;
			const teams = await TeamsHandler.list(targetUserid, count, user.id !== targetUserid);
			let buf = `<div class="ladder pad"><h2>${targetUserid}'s last ${Chat.count(count, "teams")}</h2>`;
			buf += refresh(this);
			buf += `<br /><a class="button" href="/view-teams-searchpersonal">Search your teams</a> `;
			buf += `<a class="button" href="/view-teams-searchpublic">Browse public teams</a><br />`;
			if (targetUserid === user.id) {
				buf += `<a class="button" href="/view-teams-upload">Upload new</a>`;
			}
			buf += `<hr />`;
			for (const team of teams) {
				buf += TeamsHandler.preview(team, user);
				buf += `<hr />`;
			}
			const total = await TeamsHandler.count(user.id);
			if (total > count) {
				buf += `<button class="button" name="send" value="/j view-teams-all-${targetUserid}-${count + 20}">View more</button>`;
			}
			return buf;
		},
		async filtered(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			const type = query.shift() || "";
			TeamsHandler.validateAccess(connection);
			let count = Number(query.shift()) || 50;
			if (count > MAX_TEAMS) count = MAX_TEAMS;
			let teams: StoredTeam[] = [], title = '';
			const buttons: {[k: string]: string} = {
				views: `<button class="button" name="send" value="/teams mostviews">Sort by most views</button>`,
				latest: `<button class="button" name="send" value="/teams latest">Sort by most recent upload</button>`,
			};
			switch (type) {
			case 'views':
				this.title = `[Most Viewed Teams]`;
				teams = await TeamsHandler.query(
					`SELECT * FROM teams WHERE private IS NULL ORDER BY views DESC LIMIT $1`, [count]
				);
				title = `Most viewed teams:`;
				delete buttons.views;
				break;
			default:
				this.title = `[Latest Teams]`;
				teams = await TeamsHandler.query(
					`SELECT * FROM teams WHERE private IS NULL ORDER BY date DESC LIMIT $1`, [count]
				);
				title = `Recently uploaded teams:`;
				delete buttons.latest;
				break;
			}
			let buf = `<div class="ladder pad"><h2>${title}</h2>${refresh(this)}`;
			buf += Object.values(buttons).join('<br />');
			buf += `<hr />`;
			buf += teams.map(team => TeamsHandler.preview(team, user)).join('<hr />');
			buf += `</div>`;
			return buf;
		},
		async view(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection);
			const rawTeamid = toID(query.shift() || "");
			const password = toID(query.shift());
			this.title = `[View Team]`;
			const teamid = Number(rawTeamid);
			if (isNaN(teamid)) {
				throw new Chat.ErrorMessage(`Invalid team ID.`);
			}
			const team = await TeamsHandler.get(teamid);
			if (!team) {
				this.title = `[Invalid Team]`;
				return this.errorReply(`No team with the ID ${teamid} was found.`);
			}
			if (team?.private && user.id !== team.ownerid && password !== team.private) {
				this.title = `[Private Team]`;
				return this.errorReply(`That team is private.`);
			}
			this.title = `[Team] ${team.teamid}`;
			if (user.id !== team.ownerid && team.views >= 0) {
				void TeamsHandler.updateViews(team.teamid);
			}
			return `<div class="ladder pad">` + TeamsHandler.renderTeam(team, user) + "</div>";
		},
		upload(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection);
			this.title = `[Upload Team]`;
			let buf = `<div class="ladder pad"><h2>Upload a team</h2>${refresh(this)}<hr />`;
			// let [teamName, formatid, rawPrivacy, rawTeam] = Utils.splitFirst(target, ',', 4);
			buf += `<form data-submitsend="/teams save {name},{format},{privacy},{team}">`;

			buf += `<strong>What's the name of the team?</strong><br />`;
			buf += `<input name="name" /><br />`;

			buf += `<strong>What's the team's format?</strong><br />`;
			buf += `<formatselect name="format" format="gen${Dex.gen}ou">[Gen ${Dex.gen} OU]</formatselect><br />`;

			buf += `<strong>Should the team be private? (yes/no)</strong><br />`;
			buf += `<select name="privacy" /><option value="1">Yes</option><option value="0">No</option></select><br />`;

			buf += `<strong>Provide the team:</strong><br />`;
			buf += `<textarea style="width: 100%; height: 400px" name="team"></textarea><br />`;

			buf += `<button class="button notifying" type="submit">Upload team</button>`;
			buf += `</form></div>`;
			return buf;
		},
		async edit(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection);
			const teamID = toID(query.shift() || "");
			if (!teamID.length) {
				return this.errorReply(`Invalid team ID.`);
			}
			this.title = `[Edit Team] ${teamID}`;
			const data = await TeamsHandler.get(teamID);
			if (!data) {
				return this.errorReply(`Team ${teamID} not found.`);
			}
			let buf = `<div class="ladder pad"><h2>Edit team ${teamID}</h2>${refresh(this)}<hr />`;
			// let [teamName, formatid, rawPrivacy, rawTeam] = Utils.splitFirst(target, ',', 4);
			buf += `<form data-submitsend="/teams update ${teamID},{name},{format},{privacy},{team}">`;

			buf += `<strong>Team name</strong><br />`;
			buf += `<input name="name" value="${data.title || `Untitled ${teamID}`}" /><br />`;

			buf += `<strong>Team format</strong><br />`;
			buf += `<formatselect name="format" format="${data.format}">`;
			buf += `${Dex.formats.get(data.format).name}</formatselect><br />`;

			buf += `<strong>Team privacy</strong><br />`;
			const privacy = ['1', '0'];
			if (!data.private) {
				privacy.reverse(); // first option is the one shown by default so we gotta match it
			}
			buf += `<select name="privacy" />`;
			buf += `${privacy.map(v => `<option value="${v}">${Number(v) ? 'Yes' : 'No'}</option>`)}`;
			buf += `</select><br />`;

			buf += `<strong>Team:</strong><br />`;
			const teamStr = Teams.export(Teams.import(data.team)!).replace(/\n/g, '&#13;');
			buf += `<textarea style="width: 100%; height: 400px" name="team">${teamStr}</textarea><br />`;

			buf += `<button class="button notifying" type="submit">Upload team</button>`;
			buf += `</form></div>`;
			return buf;
		},
		async searchpublic(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection, true);
			this.title = '[Teams] Search';
			let buf = '<div class="pad">';
			buf += refresh(this);
			buf += '<h2 />Search all teams</h2>';
			const type = this.pageid.split('-')[2];
			const isPersonal = type === 'searchpersonal';
			query = query.join('-').split('--');
			if (!query.map(toID).filter(Boolean).length || (isPersonal && query.length === 1)) {
				buf += `<hr />`;
				buf += `<form data-submitsend="/join view-teams-${type}-{owner}--{tier}--{pokemon}--{moves}--{ability}--{gen}">`;
				buf += `<strong>Search metadata:</strong><br />`;
				buf += `<span style="display: ${isPersonal ? 'none' : ""}">`;
				buf += `<Team owner: <input name="owner" /></span><br />`;
				buf += `Team format: <formatselect name="tier" format="gen${Dex.gen}ou">[Gen ${Dex.gen}] OU</formatselect><br /><br />`;
				buf += `<strong>Search in team:</strong> (separate different searches with commas)<br />`;
				buf += `Generation: <input name="gen" /><br />`;
				buf += `Pokemon: <input name="pokemon" /><br />`;
				buf += `Abilities: <input name="ability" /><br />`;
				buf += `Moves: <input name="moves" /><br /><br />`;
				buf += `<button class="button notifying" type="submit">Search!</button>`;
				return buf;
			}
			const [rawOwner, rawFormat, rawPokemon, rawMoves, rawAbilities, rawGen] = query;
			const owner = toID(rawOwner);
			if (owner.length > 18) {
				return this.errorReply(`Invalid owner name. Names must be under 18 characters long.`);
			}
			const format = toID(rawFormat);
			if (format && !Dex.formats.get(format).exists) {
				return this.errorReply(`Format ${format} not found.`);
			}
			const gen = Number(rawGen);
			if (rawGen && (isNaN(gen) || (gen < 1 || gen > Dex.gen))) {
				return this.errorReply(`Invalid generation: '${rawGen}'`);
			}

			const pokemon = rawPokemon?.split(',').map(toID).filter(Boolean);
			const moves = rawMoves?.split(',').map(toID).filter(Boolean);
			const abilities = rawAbilities?.split(',').map(toID).filter(Boolean);

			const search = {
				pokemon, moves, format, owner, abilities, gen: gen || undefined,
			} as TeamSearch;
			const results = await TeamsHandler.search(search, user, 50, isPersonal);

			// empty arrays will be falsy strings so this saves space
			buf += `Search: ` + Object.entries(search)
				.filter(([, v]) => !!(v?.toString()))
				.map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
				.join(', ');

			buf += `<hr />`;
			if (!results.length) {
				buf += `<div class="message-error">No results found.</div>`;
				return buf;
			}

			buf += results.map(t => TeamsHandler.preview(t, user)).join('<hr />');
			return buf;
		},
		async searchpersonal(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.pageid = 'view-teams-searchpersonal';

			return ((pages.teams as Chat.PageTable).searchpublic as import('../chat').PageHandler).call(
				this, `${user.id}${query.join('-')}`.split('-'), user, connection
			);
		},
		async browse(query, user, connection) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			TeamsHandler.validateAccess(connection, true);
			const sorter = toID(query.shift()) || 'latest';
			let count = Number(toID(query.shift())) || 50;
			if (count > MAX_SEARCH) {
				count = MAX_SEARCH;
			}
			let queryStr = 'SELECT * FROM teams WHERE private IS NULL';
			let name = sorter;
			switch (sorter) {
			case 'views':
				queryStr += ` ORDER BY views DESC `;
				name = 'most viewed';
				break;
			case 'latest':
				queryStr += ` ORDER BY date DESC`;
				break;
			default:
				return this.errorReply(`Invalid sort term '${sorter}'. Must be either 'views' or 'latest'.`);
			}
			queryStr += ` LIMIT ${count}`;
			let buf = `<div class="pad"><h2>Browse ${name} teams</h2>`;
			buf += refresh(this);
			buf += `<br /><a class="button" href="/view-teams-searchpublic">Search</a>`;
			const opposite = sorter === 'views' ? 'latest' : 'views';
			buf += `<button class="button" name="send" value="/j view-teams-browse-${opposite}-${count}">Sort by ${opposite}</button>`;
			buf += `<hr />`;

			const results = await TeamsHandler.query<StoredTeam>(queryStr, []);
			if (!results.length) {
				buf += `<div class="message-error">None found.</div>`;
				return buf;
			}
			for (const team of results) {
				buf += TeamsHandler.preview(team, user);
				buf += `<hr />`;
			}
			if (count < MAX_SEARCH) {
				buf += `<button class="button" name="send" value="/j view-teams-browse-${sorter}-${count + 20}">View more</button>`;
			}
			return buf;
		},
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/teams save ', '/teams update ');
});
