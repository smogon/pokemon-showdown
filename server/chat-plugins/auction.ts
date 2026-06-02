/**
 * Chat plugin to run auctions for team tournaments.
 *
 * Based on the original Scrappie auction system
 * https://github.com/Hidden50/Pokemon-Showdown-Node-Bot/blob/master/commands/base-auctions.js
 * @author Karthik
 */
import { Net, Utils } from '../../lib';

interface Player {
	id: ID;
	name: string;
	team?: Team;
	price: number;
	tiersPlayed: string[];
	tiersNotPlayed: string[];
}

interface Manager {
	id: ID;
	team: Team;
}

class Team {
	id: ID;
	name: string;
	players: Player[];
	credits: number;
	suspended: boolean;
	private auction: Auction;
	constructor(name: string, auction: Auction) {
		this.id = toID(name);
		this.name = name;
		this.players = [];
		this.credits = auction.startingCredits;
		this.suspended = false;
		this.auction = auction;
	}

	getManagers() {
		return [...this.auction.managers.values()]
			.filter(m => m.team === this)
			.map(m => Users.getExact(m.id)?.name || m.id);
	}

	addPlayer(player: Player, price = 0) {
		player.team?.removePlayer(player);
		this.players.push(player);
		this.credits -= price;
		player.team = this;
		player.price = price;
	}

	removePlayer(player: Player) {
		const pIndex = this.players.indexOf(player);
		if (pIndex === -1) return;
		this.players.splice(pIndex, 1);
		delete player.team;
		player.price = 0;
	}

	isSuspended() {
		return this.suspended || (
			this.auction.type === 'snake' ?
				this.players.length >= this.auction.minPlayers :
				(
					this.credits < this.auction.minBid ||
					(this.auction.maxPlayers && this.players.length >= this.auction.maxPlayers)
				)
		);
	}

	maxBid(credits = this.credits) {
		return credits + this.auction.minBid * Math.min(0, this.players.length - this.auction.minPlayers + 1);
	}
}

function parseCredits(amount: string) {
	let credits = Number(amount.replace(',', '.'));
	if (Math.abs(credits) < 500) credits *= 1000;
	if (!credits || credits % 500 !== 0) {
		throw new Chat.ErrorMessage(`The amount of credits must be a multiple of 500.`);
	}
	return credits;
}

export class Auction extends Rooms.SimpleRoomGame {
	override readonly gameid = 'auction' as ID;
	owners = new Set<ID>();
	teams = new Map<string, Team>();
	managers = new Map<string, Manager>();
	auctionPlayers = new Map<string, Player>();

	startingCredits: number;
	minBid = 3000;
	minPlayers = 10;
	maxPlayers = 0;
	type: 'auction' | 'blind' | 'snake' = 'auction';

	lastQueue: Team[] | null = null;
	queue: Team[] = [];
	nomTimer: NodeJS.Timeout = null!;
	nomTimeLimit = 0;
	nomTimeRemaining = 0;
	bidTimer: NodeJS.Timeout = null!;
	bidTimeLimit = 10;
	bidTimeRemaining = 10;
	nominatingTeam: Team = null!;
	nominatedPlayer: Player = null!;
	highestBidder: Team = null!;
	highestBid = 0;
	/** Used for blind mode */
	bidsPlaced = new Map<Team, number>();
	state: 'setup' | 'nom' | 'bid' = 'setup';
	constructor(room: Room, startingCredits = 100000) {
		super(room);
		this.title = 'Auction';
		this.startingCredits = startingCredits;
	}

	sendMessage(message: string) {
		this.room.add(`|c|~|${message}`).update();
	}

	sendHTMLBox(htmlContent: string) {
		this.room.add(`|html|<div class="infobox">${htmlContent}</div>`).update();
	}

	checkOwner(user: User) {
		if (!this.owners.has(user.id) && !Users.Auth.hasPermission(user, 'declare', null, this.room)) {
			throw new Chat.ErrorMessage(`You must be an auction owner to use this command.`);
		}
	}

	addOwners(users: string[]) {
		for (const name of users) {
			const user = Users.getExact(name);
			if (!user) throw new Chat.ErrorMessage(`User "${name}" not found.`);
			if (this.owners.has(user.id)) throw new Chat.ErrorMessage(`${user.name} is already an auction owner.`);
			this.owners.add(user.id);
		}
	}

	removeOwners(users: string[]) {
		for (const name of users) {
			const id = toID(name);
			if (!this.owners.has(id)) throw new Chat.ErrorMessage(`User "${name}" is not an auction owner.`);
			this.owners.delete(id);
		}
	}

	generateUsernameList(players: (string | Player)[], max = players.length, clickable = false) {
		let buf = `<span style="font-size: 85%">`;
		buf += players.slice(0, max).map(p => {
			if (typeof p === 'object') {
				return `<username ${clickable ? ' class="username"' : ''}>${Utils.escapeHTML(p.name)}</username>`;
			}
			return `<username${clickable ? ' class="username"' : ''}>${Utils.escapeHTML(p)}</username>`;
		}).join(', ');
		if (players.length > max) {
			buf += ` <span title="${players.slice(max).map(p => Utils.escapeHTML(typeof p === 'object' ? p.name : p)).join(', ')}">(+${players.length - max})</span>`;
		}
		buf += `</span>`;
		return buf;
	}

	generatePriceList() {
		const players = Utils.sortBy(this.getDraftedPlayers(), p => -p.price);
		let buf = '';
		let smogonExport = '';

		for (const team of this.teams.values()) {
			let table = `<table>`;
			let smogonTable = `[TABLE]`;
			for (const player of players.filter(p => p.team === team)) {
				table += Utils.html`<tr><td>${player.name}</td><td>${player.price}</td></tr>`;
				smogonTable += `[TR][TD]${player.name}[/TD][TD]${player.price}[/TD][/TR]`;
			}
			table += `</table>`;
			smogonTable += `[/TABLE]`;

			buf += `<details><summary>${Utils.escapeHTML(team.name)}</summary>${table}</details><br/>`;
			if (this.ended) smogonExport += `[SPOILER="${team.name}"]${smogonTable}[/SPOILER]`;
		}

		let table = `<table>`;
		let smogonTable = `[TABLE]`;
		for (const player of players) {
			table += Utils.html`<tr><td>${player.name}</td><td>${player.price}</td><td>${player.team!.name}</td></tr>`;
			smogonTable += `[TR][TD]${player.name}[/TD][TD]${player.price}[/TD][TD]${player.team!.name}[/TD][/TR]`;
		}
		table += `</table>`;
		smogonTable += `[/TABLE]`;

		buf += `<details><summary>All</summary>${table}</details><br/>`;
		if (this.ended) {
			smogonExport += `[SPOILER="All"]${smogonTable}[/SPOILER]`;
			buf += Utils.html`<copytext value="${smogonExport}">Copy Smogon Export</copytext>`;
		}

		return buf;
	}

	generateAuctionTable() {
		const queue = this.queue.filter(team => !team.isSuspended());
		const lastIndexOfNomTeam = queue.lastIndexOf(queue[0]) + 1;
		let buf = `<div class="ladder pad"><table style="width: 100%"><tr>${!this.ended ? `<th colspan=2>Order</th>` : ''}<th>Team</th>${this.type !== 'snake' ? `<th>Credits</th>` : ''}<th style="width: 100%">Players</th></tr>`;
		for (const team of this.teams.values()) {
			buf += `<tr>`;
			if (!this.ended) {
				let i1 = queue.indexOf(team) + 1;
				let i2 = queue.lastIndexOf(team) + 1;
				if (i1 > lastIndexOfNomTeam) {
					[i1, i2] = [i2, i1];
				}
				buf += `<td align="center" style="width: 15px">${i1 || '-'}</td><td align="center" style="width: 15px">${i2 || '-'}</td>`;
			}
			buf += `<td style="white-space: nowrap"><strong>${Utils.escapeHTML(team.name)}</strong><br/>${this.generateUsernameList(team.getManagers(), 2, true)}</td>`;
			if (this.type !== 'snake') {
				buf += `<td style="white-space: nowrap">${team.credits.toLocaleString()}${team.maxBid() >= this.minBid ? `<br/><span style="font-size: 90%">Max bid: ${team.maxBid().toLocaleString()}</span>` : ''}</td>`;
			}
			buf += `<td title="${team.players.map(p => Utils.escapeHTML(p.name)).join(', ')}"><div style="min-height: 32px${!this.ended ? `; height: 32px; overflow: hidden; resize: vertical` : ''}"><span style="float: right">${team.players.length}</span>${this.generateUsernameList(team.players)}</div></td>`;
			buf += `</tr>`;
		}
		buf += `</table></div>`;

		const players = Utils.sortBy(this.getUndraftedPlayers(), p => p.name);
		const tierArrays = new Map<string, Player[]>();
		for (const player of players) {
			for (const tier of player.tiersPlayed) {
				if (!tierArrays.has(tier)) tierArrays.set(tier, []);
				tierArrays.get(tier)!.push(player);
			}
		}
		const sortedTiers = [...tierArrays.keys()].sort();
		if (sortedTiers.length) {
			buf += `<details><summary>Remaining Players (${players.length})</summary>`;
			buf += `<details><summary>All</summary>${this.generateUsernameList(players)}</details>`;
			buf += `<details><summary>Tiers</summary><ul style="list-style-type: none">`;
			for (const tier of sortedTiers) {
				const tierPlayers = tierArrays.get(tier)!;
				buf += `<li><details><summary>${Utils.escapeHTML(tier)} (${tierPlayers.length})</summary>${this.generateUsernameList(tierPlayers)}</details></li>`;
			}
			buf += `</ul></details></details>`;
		} else {
			buf += `<details><summary>Remaining Players (${players.length})</summary>${this.generateUsernameList(players)}</details>`;
		}
		buf += `<details><summary>Auction Settings</summary>`;
		buf += `- Minimum bid: <b>${this.minBid.toLocaleString()}</b><br/>`;
		buf += `- Minimum players per team: <b>${this.minPlayers}</b><br/>`;
		if (this.type !== 'snake') buf += `- Maximum players per team: <b>${this.maxPlayers || 'N/A'}</b><br/>`;
		buf += `- Nom timer: <b>${this.nomTimeLimit ? `${this.nomTimeLimit}s` : 'Off'}</b><br/>`;
		if (this.type !== 'snake') buf += `- Bid timer: <b>${this.bidTimeLimit}s</b><br/>`;
		buf += `- Auction type: <b>${this.type}</b><br/>`;
		buf += `</details>`;
		return buf;
	}

	sendBidInfo() {
		let buf = `<div class="infobox">`;
		buf += Utils.html`Player: <username>${this.nominatedPlayer.name}</username> `;
		if (this.type === 'auction') {
			buf += `Top bid: <b>${this.highestBid}</b> `;
			buf += Utils.html`Top bidder: <b>${this.highestBidder.name}</b> `;
			buf += `Managers: ${this.highestBidder.getManagers().map(m => `<username class="username">${Utils.escapeHTML(m)}</username>`).join(' ')}<br/>`;
		}
		buf += Utils.html`Tiers Played: <b>${this.nominatedPlayer.tiersPlayed.length ? `${this.nominatedPlayer.tiersPlayed.join(', ')}` : 'N/A'}</b><br/>`;
		buf += Utils.html`Tiers Not Played: <b>${this.nominatedPlayer.tiersNotPlayed.length ? `${this.nominatedPlayer.tiersNotPlayed.join(', ')}` : 'N/A'}</b>`;
		buf += `</div>`;
		this.room.add(`|uhtml|bid-${this.nominatedPlayer.id}|${buf}`).update();
	}

	sendTimer(change = false, nom = false) {
		let buf = `<div class="infobox message-error">`;
		buf += `<i class="fa fa-hourglass-start"></i> ${Chat.toDurationString((nom ? this.nomTimeRemaining : this.bidTimeRemaining) * 1000, { hhmmss: true }).slice(1)}`;
		buf += `</div>`;
		this.room.add(`|uhtml${change ? 'change' : ''}|timer|${buf}`).update();
	}

	setMinBid(amount: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The minimum bid cannot be changed after the auction has started.`);
		}
		if (amount > 500000) throw new Chat.ErrorMessage(`The minimum bid must not exceed 500,000.`);
		this.minBid = amount;
	}

	setMinPlayers(amount: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The minimum number of players cannot be changed after the auction has started.`);
		}
		if (!amount || amount > 30) {
			throw new Chat.ErrorMessage(`The minimum number of players must be between 1 and 30.`);
		}
		this.minPlayers = amount;
	}

	setMaxPlayers(amount: number) {
		if (this.type === 'snake') throw new Chat.ErrorMessage(`You only need to set minplayers for snake drafts.`);
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The maximum number of players cannot be changed after the auction has started.`);
		}
		this.maxPlayers = amount;
	}

	setNomTimeLimit(seconds: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The nomination time limit cannot be changed after the auction has started.`);
		}
		if (isNaN(seconds) || (seconds && (seconds < 7 || seconds > 300))) {
			throw new Chat.ErrorMessage(`The nomination time limit must be between 7 and 300 seconds.`);
		}
		this.nomTimeLimit = this.nomTimeRemaining = seconds;
	}

	setBidTimeLimit(seconds: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The bid time limit cannot be changed after the auction has started.`);
		}
		if (!seconds || seconds < 7 || seconds > 120) {
			throw new Chat.ErrorMessage(`The bid time limit must be between 7 and 120 seconds.`);
		}
		this.bidTimeLimit = this.bidTimeRemaining = seconds;
	}

	setType(auctionType: string) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`The auction type cannot be changed after the auction has started.`);
		}
		if (!['auction', 'blind', 'snake'].includes(toID(auctionType))) {
			throw new Chat.ErrorMessage(`Invalid auction type "${auctionType}". Valid types are "auction", "blind", and "snake".`);
		}
		this.type = toID(auctionType) as 'auction' | 'blind' | 'snake';
		this.nomTimeLimit = this.nomTimeRemaining = this.type === 'snake' ? 60 : 0;
		this.bidTimeLimit = this.bidTimeRemaining = this.type === 'blind' ? 30 : 10;
	}

	getUndraftedPlayers() {
		return [...this.auctionPlayers.values()].filter(p => !p.team);
	}

	getDraftedPlayers() {
		return [...this.auctionPlayers.values()].filter(p => p.team);
	}

	importPlayers(data: string) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`Player lists cannot be imported after the auction has started.`);
		}
		const rows = data.replace('\r', '').split('\n');
		const tierNames = rows.shift()!.split('\t').slice(1);
		if (tierNames.some(tier => tier.length > 30)) {
			throw new Chat.ErrorMessage(`Tier names must be 30 characters or less.`);
		}

		const playerList = new Map<string, Player>();
		for (const row of rows) {
			const tiersPlayed = [];
			const tiersNotPlayed = [];
			const [name, ...tierData] = row.split('\t');
			for (let i = 0; i < tierData.length; i++) {
				switch (tierData[i].trim().toLowerCase()) {
				case 'y':
					if (!tierNames[i]) throw new Chat.ErrorMessage(`Invalid tier data found in the pastebin.`);
					tiersPlayed.push(tierNames[i]);
					break;
				case 'n':
					if (!tierNames[i]) throw new Chat.ErrorMessage(`Invalid tier data found in the pastebin.`);
					tiersNotPlayed.push(tierNames[i]);
					break;
				}
			}
			if (name.length > 25) throw new Chat.ErrorMessage(`Player names must be 25 characters or less.`);
			const player: Player = {
				id: toID(name),
				name: name.trim(),
				price: 0,
				tiersPlayed,
				tiersNotPlayed,
			};
			playerList.set(player.id, player);
		}
		this.auctionPlayers = playerList;
	}

	addAuctionPlayer(name: string, tiersPlayed: string[] = [], tiersNotPlayed: string[] = []) {
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Players cannot be added during a nomination.`);
		if (name.length > 25) throw new Chat.ErrorMessage(`Player names must be 25 characters or less.`);
		if (tiersPlayed.some(tier => tier.length > 30) || tiersNotPlayed.some(tier => tier.length > 30)) {
			throw new Chat.ErrorMessage(`Tier names must be 30 characters or less.`);
		}
		const player: Player = {
			id: toID(name),
			name,
			price: 0,
			tiersPlayed,
			tiersNotPlayed,
		};
		this.auctionPlayers.set(player.id, player);
		return player;
	}

	removeAuctionPlayer(name: string) {
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Players cannot be removed during a nomination.`);
		const player = this.auctionPlayers.get(toID(name));
		if (!player) throw new Chat.ErrorMessage(`Player "${name}" not found.`);
		player.team?.removePlayer(player);
		this.auctionPlayers.delete(player.id);
		if (this.state !== 'setup' && !this.getUndraftedPlayers().length) {
			this.end('The auction has ended because there are no players remaining in the draft pool.');
		}
		return player;
	}

	assignPlayer(name: string, teamName?: string) {
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Players cannot be assigned during a nomination.`);
		const player = this.auctionPlayers.get(toID(name)) || this.addAuctionPlayer(name);
		if (teamName) {
			const team = this.teams.get(toID(teamName));
			if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
			team.addPlayer(player);
			if (this.state !== 'setup' && !this.getUndraftedPlayers().length) {
				return this.end('The auction has ended because there are no players remaining in the draft pool.');
			}
		} else {
			player.team?.removePlayer(player);
		}
	}

	addTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`Teams cannot be added after the auction has started.`);
		if (name.length > 40) throw new Chat.ErrorMessage(`Team names must be 40 characters or less.`);
		const team = new Team(name, this);
		this.teams.set(team.id, team);
		const teams = [...this.teams.values()];
		this.queue = teams.concat(teams.slice().reverse());
		return team;
	}

	removeTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`Teams cannot be removed after the auction has started.`);
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		this.queue = this.queue.filter(t => t !== team);
		this.teams.delete(team.id);
		return team;
	}

	suspendTeam(name: string) {
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Teams cannot be suspended during a nomination.`);
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (team.suspended) throw new Chat.ErrorMessage(`Team ${name} is already suspended.`);
		if (this.nominatingTeam === team) throw new Chat.ErrorMessage(`The nominating team cannot be suspended.`);
		team.suspended = true;
		return team;
	}

	unsuspendTeam(name: string) {
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Teams cannot be unsuspended during a nomination.`);
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (!team.suspended) throw new Chat.ErrorMessage(`Team ${name} is not suspended.`);
		team.suspended = false;
		return team;
	}

	addManagers(teamName: string, users: string[]) {
		const team = this.teams.get(toID(teamName));
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		const problemUsers = users.filter(user => !toID(user) || toID(user).length > 18);
		if (problemUsers.length) {
			throw new Chat.ErrorMessage(`Invalid usernames: ${problemUsers.join(', ')}`);
		}
		for (const id of users.map(toID)) {
			const manager = this.managers.get(id);
			if (!manager) {
				this.managers.set(id, { id, team });
			} else {
				manager.team = team;
			}
		}
		return team;
	}

	removeManagers(users: string[]) {
		const problemUsers = users.filter(user => !this.managers.has(toID(user)));
		if (problemUsers.length) {
			throw new Chat.ErrorMessage(`Invalid managers: ${problemUsers.join(', ')}`);
		}
		for (const id of users.map(toID)) {
			this.managers.delete(id);
		}
	}

	addCreditsToTeam(teamName: string, amount: number) {
		if (this.type === 'snake') throw new Chat.ErrorMessage(`Snake draft does not support credits.`);
		if (this.state === 'bid') throw new Chat.ErrorMessage(`Credits cannot be changed during a nomination.`);
		const team = this.teams.get(toID(teamName));
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		const newCredits = team.credits + amount;
		if (newCredits <= 0 || newCredits > 10000000) {
			throw new Chat.ErrorMessage(`A team must have between 0 and 10,000,000 credits.`);
		}
		if (team.maxBid(newCredits) < this.minBid) {
			throw new Chat.ErrorMessage(`A team must have enough credits to draft the minimum amount of players.`);
		}
		team.credits = newCredits;
		return team;
	}

	start() {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`The auction has already started.`);
		if (this.teams.size < 2) throw new Chat.ErrorMessage(`The auction needs at least 2 teams to start.`);
		const problemTeams = [...this.teams.values()].filter(t => t.maxBid() < this.minBid).map(t => t.name);
		if (problemTeams.length) {
			throw new Chat.ErrorMessage(`The following teams do not have enough credits to draft the minimum amount of players: ${problemTeams.join(', ')}`);
		}
		this.next();
	}

	reset() {
		const teams = [...this.teams.values()];
		for (const team of teams) {
			team.credits = this.startingCredits;
			team.suspended = false;
			for (const player of team.players) {
				delete player.team;
				player.price = 0;
			}
			team.players = [];
		}
		this.lastQueue = null;
		this.queue = teams.concat(teams.slice().reverse());
		this.clearNomTimer();
		this.clearBidTimer();
		this.state = 'setup';
		this.sendHTMLBox(this.generateAuctionTable());
	}

	next() {
		this.state = 'nom';
		if (!this.queue.filter(team => !team.isSuspended()).length) {
			return this.end('The auction has ended because there are no teams remaining that can draft players.');
		}
		if (!this.getUndraftedPlayers().length) {
			return this.end('The auction has ended because there are no players remaining in the draft pool.');
		}
		do {
			this.nominatingTeam = this.queue.shift()!;
			this.queue.push(this.nominatingTeam);
		} while (this.nominatingTeam.isSuspended());
		this.sendHTMLBox(this.generateAuctionTable());
		this.sendMessage(`/html It is now <b>${Utils.escapeHTML(this.nominatingTeam.name)}</b>'s turn to nominate a player. Managers: ${this.nominatingTeam.getManagers().map(m => `<username class="username">${Utils.escapeHTML(m)}</username>`).join(' ')}`);
		this.startNomTimer();
	}

	nominate(user: User, target: string) {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`You cannot nominate players right now.`);
		const manager = this.managers.get(user.id);
		if (!manager || manager.team !== this.nominatingTeam) this.checkOwner(user);

		// For undo
		this.lastQueue = this.queue.slice();
		this.lastQueue.unshift(this.lastQueue.pop()!);

		const player = this.auctionPlayers.get(toID(target));
		if (!player) throw new Chat.ErrorMessage(`${target} is not a valid player.`);
		if (player.team) throw new Chat.ErrorMessage(`${player.name} has already been drafted.`);
		this.clearNomTimer();
		this.nominatedPlayer = player;
		if (this.type === 'snake') {
			this.sendMessage(Utils.html`/html <b>${this.nominatingTeam.name}</b> drafted <username>${this.nominatedPlayer.name}</username>!`);
			this.nominatingTeam.addPlayer(this.nominatedPlayer);
			this.next();
		} else {
			this.state = 'bid';
			this.highestBid = this.minBid;
			this.highestBidder = this.nominatingTeam;
			this.sendMessage(Utils.html`/html <username class="username">${user.name}</username> from team <b>${this.nominatingTeam.name}</b> has nominated <username>${player.name}</username> for auction!`);
			const notifyMsg = Utils.html`|notify|${this.room.title} Auction|${player.name} has been nominated!`;
			for (const currManager of this.managers.values()) {
				if (currManager.team === this.nominatingTeam) continue;
				const curUser = Users.getExact(currManager.id);
				curUser?.sendTo(this.room, notifyMsg);
				curUser?.sendTo(this.room,
					`|raw|Send a message with the amount you want to bid (e.g. <code>.5</code> or <code>5</code> will place a bid of 5000)!`);
			}
			this.sendBidInfo();
			this.startBidTimer();
		}
	}

	bid(user: User, bid: number) {
		if (this.state !== 'bid') throw new Chat.ErrorMessage(`There are no players up for auction right now.`);
		const team = this.managers.get(user.id)?.team;
		if (!team) throw new Chat.ErrorMessage(`Only managers can bid on players.`);
		if (team.isSuspended()) throw new Chat.ErrorMessage(`Your team is suspended and cannot place bids.`);

		if (bid > team.maxBid()) throw new Chat.ErrorMessage(`Your team cannot afford to bid that much.`);

		if (this.type === 'blind') {
			if (this.bidsPlaced.has(team)) throw new Chat.ErrorMessage(`Your team has already placed a bid.`);
			if (bid <= this.minBid) throw new Chat.ErrorMessage(`Your bid must be higher than the minimum bid.`);

			const msg = `|c:|${Math.floor(Date.now() / 1000)}|&|/html Your team placed a bid of <b>${bid}</b> on <username>${Utils.escapeHTML(this.nominatedPlayer.name)}</username>.`;
			for (const manager of this.managers.values()) {
				if (manager.team !== team) continue;
				Users.getExact(manager.id)?.sendTo(this.room, msg);
			}

			if (bid > this.highestBid) {
				this.highestBid = bid;
				this.highestBidder = team;
			}
			this.bidsPlaced.set(team, bid);
			if (this.bidsPlaced.size === this.teams.size) {
				this.finishCurrentNom();
			}
		} else {
			if (bid <= this.highestBid) throw new Chat.ErrorMessage(`Your bid must be higher than the current bid.`);
			this.highestBid = bid;
			this.highestBidder = team;
			this.sendBidInfo();
			this.startBidTimer();
		}
	}

	override onChatMessage(message: string, user: User) {
		if (this.state !== 'bid' || this.type !== 'blind') return;
		if (message.startsWith('.')) message = message.slice(1);
		if (Number(message.replace(',', '.'))) {
			this.bid(user, parseCredits(message));
			return '';
		}
	}

	override onLogMessage(message: string, user: User) {
		if (this.state !== 'bid' || this.type === 'blind') return;
		if (message.startsWith('.')) message = message.slice(1);
		if (Number(message.replace(',', '.'))) {
			this.room.update();
			try {
				this.bid(user, parseCredits(message));
			} catch (e: any) {
				if (e.name?.endsWith('ErrorMessage')) {
					user.sendTo(this.room, Utils.html`|raw|<span class="message-error">${e.message}</span>`);
				} else {
					user.sendTo(this.room, `|raw|<span class="message-error">An unexpected error occurred while placing your bid.</span>`);
				}
			}
		}
	}

	skipNom() {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`Nominations cannot be skipped right now.`);
		this.nominatedPlayer = null!;
		this.sendMessage(`**${this.nominatingTeam.name}**'s nomination turn has been skipped!`);
		this.clearNomTimer();
		this.next();
	}

	finishCurrentNom() {
		if (this.type === 'blind') {
			let buf = `<div class="ladder pad"><table><tr><th>Team</th><th>Bid</th></tr>`;
			if (!this.bidsPlaced.has(this.nominatingTeam)) {
				buf += Utils.html`<tr><td>${this.nominatingTeam.name}</td><td>${this.minBid}</td></tr>`;
			}
			for (const [team, bid] of this.bidsPlaced) {
				buf += Utils.html`<tr><td>${team.name}</td><td>${bid}</td></tr>`;
			}
			buf += `</table></div>`;
			this.sendHTMLBox(buf);
			this.bidsPlaced.clear();
		}
		this.sendMessage(Utils.html`/html <b>${this.highestBidder.name}</b> bought <username>${this.nominatedPlayer.name}</username> for <b>${this.highestBid}</b> credits!`);
		this.highestBidder.addPlayer(this.nominatedPlayer, this.highestBid);
		this.clearBidTimer();
		this.next();
	}

	undoLastNom() {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`Nominations cannot be undone right now.`);
		if (!this.lastQueue) throw new Chat.ErrorMessage(`Only one nomination can be undone at a time.`);
		this.queue = this.lastQueue;
		this.lastQueue = null;
		if (this.nominatedPlayer) {
			this.highestBidder.removePlayer(this.nominatedPlayer);
			this.highestBidder.credits += this.highestBid;
		}
		this.next();
	}

	clearNomTimer() {
		clearInterval(this.nomTimer);
		this.nomTimeRemaining = this.nomTimeLimit;
		this.room.add('|uhtmlchange|timer|');
	}

	startNomTimer() {
		if (!this.nomTimeLimit) return;
		this.clearNomTimer();
		this.sendTimer(false, true);
		this.nomTimer = setInterval(() => this.pokeNomTimer(), 1000);
	}

	clearBidTimer() {
		clearInterval(this.bidTimer);
		this.bidTimeRemaining = this.bidTimeLimit;
		this.room.add('|uhtmlchange|timer|');
	}

	startBidTimer() {
		if (!this.bidTimeLimit) return;
		this.clearBidTimer();
		this.sendTimer();
		this.bidTimer = setInterval(() => this.pokeBidTimer(), 1000);
	}

	pokeNomTimer() {
		this.nomTimeRemaining--;
		if (!this.nomTimeRemaining) {
			this.skipNom();
		} else {
			this.sendTimer(true, true);
			if (this.nomTimeRemaining % 30 === 0 || [20, 10, 5].includes(this.nomTimeRemaining)) {
				this.sendMessage(`/html <span class="message-error">${this.nomTimeRemaining} seconds left!</span>`);
			}
		}
	}

	pokeBidTimer() {
		this.bidTimeRemaining--;
		if (!this.bidTimeRemaining) {
			this.finishCurrentNom();
		} else {
			this.sendTimer(true);
			if (this.bidTimeRemaining % 30 === 0 || [20, 10, 5].includes(this.bidTimeRemaining)) {
				this.sendMessage(`/html <span class="message-error">${this.bidTimeRemaining} seconds left!</span>`);
			}
		}
	}

	end(message?: string) {
		this.setEnded();
		this.sendHTMLBox(this.generateAuctionTable());
		this.sendHTMLBox(this.generatePriceList());
		if (message) this.sendMessage(message);
		this.destroy();
	}

	override destroy() {
		this.clearNomTimer();
		this.clearBidTimer();
		super.destroy();
	}
}

export const commands: Chat.ChatCommands = {
	auction: {
		create(target, room, user) {
			room = this.requireRoom();
			this.checkCan('minigame', null, room);
			if (room.game) throw new Chat.ErrorMessage(`There is already a game of ${room.game.title} in progress in this room.`);
			if (room.settings.auctionDisabled) throw new Chat.ErrorMessage('Auctions are currently disabled in this room.');

			let startingCredits;
			if (target) {
				startingCredits = parseCredits(target);
				if (startingCredits < 10000 || startingCredits > 10000000) {
					throw new Chat.ErrorMessage(`Starting credits must be between 10,000 and 10,000,000.`);
				}
			}
			const auction = new Auction(room, startingCredits);
			auction.addOwners([user.id]);
			room.game = auction;
			this.addModAction(`An auction was created by ${user.name}.`);
			this.modlog(`AUCTION CREATE`);
		},
		createhelp: [
			`/auction create [startingcredits] - Creates an auction. Requires: % @ # ~`,
		],
		start(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.start();
			this.addModAction(`The auction was started by ${user.name}.`);
			this.modlog(`AUCTION START`);
		},
		reset(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.reset();
			this.addModAction(`The auction was reset by ${user.name}.`);
			this.modlog(`AUCTION RESET`);
		},
		delete: 'end',
		stop: 'end',
		end(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.end();
			this.addModAction(`The auction was ended by ${user.name}.`);
			this.modlog('AUCTION END');
		},
		info: 'display',
		display(target, room, user) {
			this.runBroadcast();
			const auction = this.requireGame(Auction);
			this.sendReplyBox(auction.generateAuctionTable());
		},
		pricelist(target, room, user) {
			this.runBroadcast();
			const auction = this.requireGame(Auction);
			this.sendReplyBox(auction.generatePriceList());
		},
		minbid(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction minbid');
			const amount = parseCredits(target);
			auction.setMinBid(amount);
			this.addModAction(`${user.name} set the minimum bid to ${amount}.`);
			this.modlog('AUCTION MINBID', null, `${amount}`);
		},
		minbidhelp: [
			`/auction minbid [amount] - Sets the minimum bid. Requires: # ~ auction owner`,
		],
		minplayers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction minplayers');
			const amount = parseInt(target);
			auction.setMinPlayers(amount);
			this.addModAction(`${user.name} set the minimum number of players to ${amount}.`);
		},
		minplayershelp: [
			`/auction minplayers [amount] - Sets the minimum number of players. Requires: # ~ auction owner`,
		],
		maxplayers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction maxplayers');
			const amount = parseInt(target);
			auction.setMaxPlayers(amount);
			this.addModAction(`${user.name} set the maximum number of players to ${amount}.`);
		},
		maxplayershelp: [
			`/auction maxplayers [amount] - Sets the maximum number of players. Requires: # ~ auction owner`,
		],
		nomtimer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction nomtimer');
			const seconds = this.meansNo(target) ? 0 : parseInt(target);
			auction.setNomTimeLimit(seconds);
			this.addModAction(`${user.name} set the nomination timer to ${seconds} seconds.`);
		},
		nomtimerhelp: [
			`/auction nomtimer [seconds/off] - Sets the nomination timer to [seconds] seconds or disables it. Requires: # ~ auction owner`,
		],
		bidtimer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction settimer');
			const seconds = parseInt(target);
			auction.setBidTimeLimit(seconds);
			this.addModAction(`${user.name} set the bid timer to ${seconds} seconds.`);
		},
		bidtimerhelp: [
			`/auction timer [seconds] - Sets the bid timer to [seconds] seconds. Requires: # ~ auction owner`,
		],
		settype(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction settype');
			auction.setType(target);
			this.addModAction(`${user.name} set the auction type to ${toID(target)}.`);
		},
		settypehelp: [
			`/auction settype [auction|blind|snake] - Sets the auction type. Requires: # ~ auction owner`,
			`- auction: Standard auction with credits and bidding.`,
			`- blind: Same as auction, but bids are hidden until the end of the nomination.`,
			`- snake: Standard snake draft with no credits or bidding.`,
		],
		addowner: 'addowners',
		addowners(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const owners = target.split(',').map(x => x.trim());
			if (!owners.length) return this.parse('/help auction addowners');
			auction.addOwners(owners);
			this.addModAction(`${user.name} added ${Chat.toListString(owners.map(o => Users.getExact(o)!.name))} as auction owner${Chat.plural(owners.length)}.`);
		},
		addownershelp: [
			`/auction addowners [user1], [user2], ... - Adds users as auction owners. Requires: # ~ auction owner`,
		],
		removeowner: 'removeowners',
		removeowners(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const owners = target.split(',').map(x => x.trim());
			if (!owners.length) return this.parse('/help auction removeowners');
			auction.removeOwners(owners);
			this.addModAction(`${user.name} removed ${Chat.toListString(owners.map(o => Users.getExact(o)?.name || o))} as auction owner${Chat.plural(owners.length)}.`);
		},
		removeownershelp: [
			`/auction removeowners [user1], [user2], ... - Removes users as auction owners. Requires: # ~ auction owner`,
		],
		async importplayers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction importplayers');
			if (!/^https?:\/\/pastebin\.com\/[a-zA-Z0-9]+$/.test(target)) {
				throw new Chat.ErrorMessage('Invalid pastebin URL.');
			}
			let data = '';
			try {
				data = await Net(`https://pastebin.com/raw/${target.split('/').pop()}`).get();
			} catch {}
			if (!data) throw new Chat.ErrorMessage('Error fetching data from pastebin.');

			auction.importPlayers(data);
			this.addModAction(`${user.name} imported the player list from ${target}.`);
		},
		importplayershelp: [
			`/auction importplayers [pastebin url] - Imports a list of players from a pastebin. Requires: # ~ auction owner`,
			`The pastebin should be a list of tab-separated values with the first row containing tier names and subsequent rows containing the player names and either a 'y' or an 'n' in the column corresponding to the tier they prefer or do not play respectively.`,
			`See https://pastebin.com/jPTbJBva for an example.`,
		],
		addplayer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [playedPart, notPlayedPart] = target.split(";");
			const tiersPlayed = playedPart.split(",").map(item => item.trim());
			const tiersNotPlayed = notPlayedPart ? notPlayedPart.split(",").map(item => item.trim()) : [];
			const name = tiersPlayed.shift();

			if (!name) return this.parse('/help auction addplayer');
			const player = auction.addAuctionPlayer(name, tiersPlayed, tiersNotPlayed);
			this.addModAction(`${user.name} added player ${player.name} to the auction.`);
		},
		addplayerhelp: [
			`/auction addplayer [name], [tierPlayed1], [tierPlayed2], ... ; [tierNotPlayed1], [tierNotPlayed2], ... - Adds a player to the auction. Requires: # ~ auction owner`,
		],
		removeplayer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removeplayer');
			const player = auction.removeAuctionPlayer(target);
			this.addModAction(`${user.name} removed player ${player.name} from the auction.`);
		},
		removeplayerhelp: [
			`/auction removeplayer [name] - Removes a player from the auction. Requires: # ~ auction owner`,
		],
		assignplayer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [player, team] = target.split(',').map(x => x.trim());
			if (!player) return this.parse('/help auction assignplayer');
			if (team) {
				auction.assignPlayer(player, team);
				this.addModAction(`${user.name} assigned player ${player} to team ${team}.`);
			} else {
				auction.assignPlayer(player);
				this.sendReply(`${user.name} returned player ${player} to the draft pool.`);
			}
		},
		assignplayerhelp: [
			`/auction assignplayer [player], [team] - Assigns a player to a team. If team is blank, returns player to draft pool. Requires: # ~ auction owner`,
		],
		addteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [name, ...managerNames] = target.split(',').map(x => x.trim());
			if (!name) return this.parse('/help auction addteam');
			const team = auction.addTeam(name);
			this.addModAction(`${user.name} added team ${team.name} to the auction.`);
			auction.addManagers(team.name, managerNames);
		},
		addteamhelp: [
			`/auction addteam [name], [manager1], [manager2], ... - Adds a team to the auction. Requires: # ~ auction owner`,
		],
		removeteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removeteam');
			const team = auction.removeTeam(target);
			this.addModAction(`${user.name} removed team ${team.name} from the auction.`);
		},
		removeteamhelp: [
			`/auction removeteam [team] - Removes a team from the auction. Requires: # ~ auction owner`,
		],
		suspendteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction suspendteam');
			const team = auction.suspendTeam(target);
			this.addModAction(`${user.name} suspended team ${team.name}.`);
		},
		suspendteamhelp: [
			`/auction suspendteam [team] - Suspends a team from the auction. Requires: # ~ auction owner`,
			`Suspended teams have their nomination turns skipped and are not allowed to place bids.`,
		],
		unsuspendteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction unsuspendteam');
			const team = auction.unsuspendTeam(target);
			this.addModAction(`${user.name} unsuspended team ${team.name}.`);
		},
		unsuspendteamhelp: [
			`/auction unsuspendteam [team] - Unsuspends a team from the auction. Requires: # ~ auction owner`,
		],
		addmanager: 'addmanagers',
		addmanagers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, ...managerNames] = target.split(',').map(x => x.trim());
			if (!teamName || !managerNames.length) return this.parse('/help auction addmanagers');
			const team = auction.addManagers(teamName, managerNames);
			const managers = managerNames.map(m => Users.getExact(m)?.name || toID(m));
			this.addModAction(`${user.name} added ${Chat.toListString(managers)} as manager${Chat.plural(managers.length)} for team ${team.name}.`);
		},
		addmanagershelp: [
			`/auction addmanagers [team], [user1], [user2], ... - Adds users as managers to a team. Requires: # ~ auction owner`,
		],
		removemanager: 'removemanagers',
		removemanagers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removemanagers');
			const managerNames = target.split(',').map(x => x.trim());
			auction.removeManagers(managerNames);
			const managers = managerNames.map(m => Users.getExact(m)?.name || toID(m));
			this.addModAction(`${user.name} removed ${Chat.toListString(managers)} as manager${Chat.plural(managers.length)}.`);
		},
		removemanagershelp: [
			`/auction removemanagers [user1], [user2], ... - Removes users as managers. Requires: # ~ auction owner`,
		],
		addcredits(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, amount] = target.split(',').map(x => x.trim());
			if (!teamName || !amount) return this.parse('/help auction addcredits');
			const credits = parseCredits(amount);
			const team = auction.addCreditsToTeam(teamName, credits);
			this.addModAction(`${user.name} ${credits < 0 ? 'removed' : 'added'} ${Math.abs(credits)} credits ${credits < 0 ? 'from' : 'to'} team ${team.name}.`);
		},
		addcreditshelp: [
			`/auction addcredits [team], [amount] - Adds credits to a team. Requires: # ~ auction owner`,
		],
		nom: 'nominate',
		nominate(target, room, user) {
			const auction = this.requireGame(Auction);
			if (!target) return this.parse('/help auction nominate');
			auction.nominate(user, target);
		},
		nominatehelp: [
			`/auction nominate OR /nom [player] - Nominates a player for auction.`,
		],
		skip: 'skipnom',
		skipnom(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.skipNom();
			this.addModAction(`${user.name} skipped the previous nomination.`);
		},
		undo(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.undoLastNom();
			this.addModAction(`${user.name} undid the last nomination.`);
		},
		disable(target, room) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (room.settings.auctionDisabled) {
				throw new Chat.ErrorMessage('Auctions are already disabled.');
			}
			room.settings.auctionDisabled = true;
			room.saveSettings();
			this.sendReply('Auctions have been disabled for this room.');
		},
		enable(target, room) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (!room.settings.auctionDisabled) {
				throw new Chat.ErrorMessage('Auctions are already enabled.');
			}
			delete room.settings.auctionDisabled;
			room.saveSettings();
			this.sendReply('Auctions have been enabled for this room.');
		},
		ongoing: 'running',
		running() {
			if (!this.runBroadcast()) return;
			const runningAuctions = [...Rooms.rooms.values()].filter(r => r.getGame(Auction)).map(r => r.title);
			this.sendReply(`Running auctions: ${runningAuctions.join(', ') || 'None'}`);
		},
		'': 'help',
		help() {
			this.parse('/help auction');
		},
	},
	auctionhelp() {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`Auction commands<br/>` +
			`- create [startingcredits]: Creates an auction.<br/>` +
			`- start: Starts the auction.<br/>` +
			`- reset: Resets the auction.<br/>` +
			`- end: Ends the auction.<br/>` +
			`- running: Shows a list of rooms with running auctions.<br/>` +
			`- display: Displays the current state of the auction.<br/>` +
			`- pricelist: Displays the current prices of players by team.<br/>` +
			`- nom [player]: Nominates a player for auction.<br/>` +
			`You may use /nom directly without the /auction prefix.<br/>` +
			`During the bidding phase, all numbers that are sent in the chat will be treated as bids.<br/><br/>` +
			`<details class="readmore"><summary>Configuration Commands</summary>` +
			`- minbid [amount]: Sets the minimum bid.<br/>` +
			`- minplayers [amount]: Sets the minimum number of players.<br/>` +
			`- nomtimer [seconds]: Sets the nomination timer to [seconds] seconds.<br/>` +
			`- bidtimer [seconds]: Sets the bid timer to [seconds] seconds.<br/>` +
			`- settype [auction|blind|snake]: Sets the auction type.<br/>` +
			`- addowners [user1], [user2], ...: Adds users as auction owners.<br/>` +
			`- removeowners [user1], [user2], ...: Removes users as auction owners.<br/>` +
			`- importplayers [pastebin url]: Imports a list of players from a pastebin.<br/>` +
			`- addplayer [name], [tier1], [tier2], ...: Adds a player to the auction.<br/>` +
			`- removeplayer [name]: Removes a player from the auction.<br/>` +
			`- assignplayer [player], [team]: Assigns a player to a team. If team is blank, returns player to draft pool.<br/>` +
			`- addteam [name], [manager1], [manager2], ...: Adds a team to the auction.<br/>` +
			`- removeteam [name]: Removes the given team from the auction.<br/>` +
			`- suspendteam [name]: Suspends the given team from the auction.<br/>` +
			`- unsuspendteam [name]: Unsuspends the given team from the auction.<br/>` +
			`- addmanagers [team], [user1], [user2], ...: Adds users as managers to a team.<br/>` +
			`- removemanagers [user1], [user2], ...: Removes users as managers..<br/>` +
			`- addcredits [team], [amount]: Adds credits to a team.<br/>` +
			`- skipnom: Skips the current nomination.<br/>` +
			`- undo: Undoes the last nomination.<br/>` +
			`- [enable/disable]: Enables or disables auctions from being started in a room.<br/>` +
			`</details>`
		);
	},
	nom(target) {
		this.parse(`/auction nominate ${target}`);
	},
	bid() {
		throw new Chat.ErrorMessage(`/bid is no longer supported. Send the amount by itself in the chat to place your bid.`);
	},
	overpay() {
		this.requireGame(Auction);
		this.checkChat();
		return '/announce OVERPAY!';
	},
};

export const roomSettings: Chat.SettingsHandler = room => ({
	label: "Auction",
	permission: 'editroom',
	options: [
		[`disabled`, room.settings.auctionDisabled || 'auction disable'],
		[`enabled`, !room.settings.auctionDisabled || 'auction enable'],
	],
});
