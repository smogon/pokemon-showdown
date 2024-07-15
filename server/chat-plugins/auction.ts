/**
 * Chat plugin to run auctions for team tournaments.
 *
 * Based on the original Scrappie auction system
 * https://github.com/Hidden50/Pokemon-Showdown-Node-Bot/blob/master/commands/base-auctions.js
 * @author Karthik
 */
import {Net, Utils} from '../../lib';

interface Player {
	id: ID;
	name: string;
	team?: Team;
	price: number;
	tiers?: string[];
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
		const managers = [];
		for (const manager of this.auction.managers.values()) {
			if (manager.team !== this) continue;
			const user = Users.getExact(manager.id);
			if (user) {
				managers.push(user.name);
			} else {
				managers.push(manager.id);
			}
		}
		return managers;
	}

	addPlayer(player: Player, price = 0) {
		if (player.team) player.team.removePlayer(player);
		this.players.push(player);
		this.credits -= price;
		player.team = this;
		player.price = price;
	}

	removePlayer(player: Player) {
		this.players.splice(this.players.indexOf(player), 1);
		delete player.team;
		player.price = 0;
	}

	isSuspended() {
		return this.credits < this.auction.minBid || this.suspended;
	}

	maxBid(credits = this.credits) {
		return credits + this.auction.minBid * Math.min(0, this.players.length - this.auction.minPlayers + 1);
	}
}

export class Auction extends Rooms.SimpleRoomGame {
	override readonly gameid = 'auction' as ID;
	owners: Set<ID>;
	teams: Map<string, Team>;
	managers: Map<string, Manager>;
	auctionPlayers: Map<string, Player>;

	startingCredits: number;
	minBid: number;
	minPlayers: number;
	blindMode: boolean;

	lastQueue: Team[] | null;
	queue: Team[];
	currentTeam: Team;
	bidTimer: NodeJS.Timer;
	/** How many seconds have passed since the start of the timer */
	bidTimeElapsed: number;
	/** Measured in seconds */
	bidTimeLimit: number;
	currentNom: Player;
	currentBid: number;
	currentBidder: Team;
	/** Used for blind mode */
	bidsPlaced: Set<Team>;
	state: 'setup' | 'nom' | 'bid' = 'setup';
	constructor(room: Room, startingCredits = 100000) {
		super(room);
		this.title = `Auction (${room.title})`;
		this.owners = new Set();
		this.teams = new Map();
		this.managers = new Map();
		this.auctionPlayers = new Map();

		this.startingCredits = startingCredits;
		this.minBid = 3000;
		this.minPlayers = 10;
		this.blindMode = false;

		this.lastQueue = null;
		this.queue = [];
		this.currentTeam = null!;
		this.bidTimer = null!;
		this.bidTimeElapsed = 0;
		this.bidTimeLimit = 10;
		this.currentNom = null!;
		this.currentBid = 0;
		this.currentBidder = null!;
		this.bidsPlaced = new Set();
	}

	sendMessage(message: string) {
		this.room.add(`|c|&|${message}`).update();
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
		let buf = `<span style="font-size: 90%">`;
		buf += players.slice(0, max).map(p => {
			if (typeof p === 'object') {
				return `<username title="Tiers: ${p.tiers?.length ? `${Utils.escapeHTML(p.tiers.join(', '))}` : 'N/A'}"${clickable ? ' class="username"' : ''} style="font-weight: normal">${Utils.escapeHTML(p.name)}</username>`;
			}
			return `<username${clickable ? ' class="username"' : ''} style="font-weight: normal">${Utils.escapeHTML(p)}</username>`;
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
		for (const team of this.teams.values()) {
			buf += Utils.html`<details><summary>${team.name}</summary><table>`;
			for (const player of players.filter(p => p.team === team)) {
				buf += Utils.html`<tr><td>${player.name}</td><td>${player.price}</td></tr>`;
			}
			buf += `</table></details><br/>`;
		}
		buf += `<details><summary>All</summary><table>`;
		for (const player of players) {
			buf += Utils.html`<tr><td>${player.name}</td><td>${player.price}</td></tr>`;
		}
		buf += `</table></details>`;
		return buf;
	}

	generateAuctionTable() {
		let buf = `<div class="ladder pad"><table style="width: 100%"><tr><th colspan=2>Order</th><th>Teams</th><th>Credits</th><th>Players</th></tr>`;
		const queue = this.queue.filter(team => !team.isSuspended());
		for (const team of this.teams.values()) {
			let i1 = queue.indexOf(team) + 1;
			let i2 = queue.lastIndexOf(team) + 1;
			if (i1 > queue.length / 2) {
				[i1, i2] = [i2, i1];
			}
			buf += `<tr>`;
			buf += `<td align="center" style="width: 15px">${i1 > 0 ? i1 : '-'}</td><td align="center" style="width: 15px">${i2 > 0 ? i2 : '-'}</td>`;
			buf += `<td style="white-space: nowrap"><strong>${Utils.escapeHTML(team.name)}</strong><br/>${this.generateUsernameList(team.getManagers(), 2, true)}</td>`;
			buf += `<td style="white-space: nowrap">${team.credits.toLocaleString()}${team.maxBid() >= this.minBid ? `<br/><span style="font-size: 90%">Max bid: ${team.maxBid().toLocaleString()}</span>` : ''}</td>`;
			buf += `<td><div style="min-height: 32px; height: 32px; overflow: hidden; resize: vertical"><span style="float: right">${team.players.length}</span>${this.generateUsernameList(team.players)}</div></td>`;
			buf += `</tr>`;
		}
		buf += `</table></div>`;

		const players = Utils.sortBy(this.getUndraftedPlayers(), p => p.name);
		const tierArrays = new Map<string, Player[]>();
		for (const player of players) {
			if (!player.tiers) continue;
			for (const tier of player.tiers) {
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
		buf += `- Blind mode: <b>${this.blindMode ? 'On' : 'Off'}</b><br/>`;
		buf += `</details>`;
		return buf;
	}

	sendBidInfo() {
		let buf = `<div class="infobox">`;
		buf += Utils.html`Player: <username>${this.currentNom.name}</username> `;
		buf += `Top bid: <b>${this.currentBid}</b> `;
		buf += Utils.html`Top bidder: <b>${this.currentBidder.name}</b> `;
		buf += Utils.html`Tiers: <b>${this.currentNom.tiers?.length ? `${this.currentNom.tiers.join(', ')}` : 'N/A'}</b>`;
		buf += `</div>`;
		this.room.add(`|uhtml|bid|${buf}`).update();
	}

	setMinBid(amount: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`You cannot change the minimum bid after the auction has started.`);
		}
		if (amount < 500) amount *= 1000;
		if (isNaN(amount) || amount < 500 || amount > 500000 || amount % 500 !== 0) {
			throw new Chat.ErrorMessage(`The minimum bid must be a multiple of 500 between 500 and 500,000.`);
		}
		this.minBid = amount;
	}

	setMinPlayers(amount: number) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`You cannot change the minimum number of players after the auction has started.`);
		}
		if (isNaN(amount) || amount < 1 || amount > 30) {
			throw new Chat.ErrorMessage(`The minimum number of players must be between 1 and 30.`);
		}
		this.minPlayers = amount;
	}

	setBlindMode(blind: boolean) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`You cannot toggle blind mode after the auction has started.`);
		}
		this.blindMode = blind;
		if (blind) {
			this.bidTimeLimit = 30;
		} else {
			this.bidTimeLimit = 10;
		}
	}

	getPlayers(drafted: boolean) {
		const players = [];
		for (const player of this.auctionPlayers.values()) {
			if (drafted === !!player.team) players.push(player);
		}
		return players;
	}

	getUndraftedPlayers() {
		return this.getPlayers(false);
	}

	getDraftedPlayers() {
		return this.getPlayers(true);
	}

	importPlayers(data: string) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`You cannot import a player list after the auction has started.`);
		}
		const rows = data.replace('\r', '').split('\n');
		const tierNames = rows.shift()!.split('\t').slice(1);
		const playerList = new Map<string, Player>();
		for (const row of rows) {
			const tiers = [];
			const [name, ...tierData] = row.split('\t');
			for (let i = 0; i < tierData.length; i++) {
				if (['y', 'Y', '\u2713', '\u2714'].includes(tierData[i].trim())) {
					if (!tierNames[i]) throw new Chat.ErrorMessage(`Invalid tier data found in the pastebin.`);
					if (tierNames[i].length > 30) throw new Chat.ErrorMessage(`Tier names must be 30 characters or less.`);
					tiers.push(tierNames[i]);
				}
			}
			if (name.length > 25) throw new Chat.ErrorMessage(`Player names must be 25 characters or less.`);
			const player: Player = {
				id: toID(name),
				name,
				price: 0,
			};
			if (tiers.length) player.tiers = tiers;
			playerList.set(player.id, player);
		}
		this.auctionPlayers = playerList;
	}

	addAuctionPlayer(name: string, tiers?: string[]) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot add players to the auction right now.`);
		}
		if (name.length > 25) throw new Chat.ErrorMessage(`Player names must be 25 characters or less.`);
		const player: Player = {
			id: toID(name),
			name,
			price: 0,
		};
		if (tiers?.length) {
			if (tiers.some(tier => tier.length > 30)) {
				throw new Chat.ErrorMessage(`Tier names must be 30 characters or less.`);
			}
			player.tiers = tiers;
		}
		this.auctionPlayers.set(player.id, player);
		return player;
	}

	removeAuctionPlayer(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot remove players from the auction right now.`);
		}
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
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot assign players to a team right now.`);
		}
		const player = this.auctionPlayers.get(toID(name));
		if (!player) throw new Chat.ErrorMessage(`Player "${name}" not found.`);
		if (teamName) {
			const team = this.teams.get(toID(teamName));
			if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
			team.addPlayer(player);
			if (!this.getUndraftedPlayers().length) {
				return this.end('The auction has ended because there are no players remaining in the draft pool.');
			}
		} else {
			player.team?.removePlayer(player);
		}
		this.sendHTMLBox(this.generateAuctionTable());
	}

	addTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`You cannot add teams after the auction has started.`);
		if (name.length > 40) throw new Chat.ErrorMessage(`Team names must be 40 characters or less.`);
		const team = new Team(name, this);
		this.teams.set(team.id, team);
		const teams = [...this.teams.values()];
		this.queue = teams.concat(teams.slice().reverse());
		return team;
	}

	removeTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`You cannot remove teams after the auction has started.`);
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		this.queue = this.queue.filter(t => t !== team);
		this.teams.delete(team.id);
		return team;
	}

	suspendTeam(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot suspend teams right now.`);
		}
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (team.suspended) throw new Chat.ErrorMessage(`Team ${name} is already suspended.`);
		if (this.currentTeam === team) throw new Chat.ErrorMessage(`You cannot suspend the current nominating team.`);
		team.suspended = true;
	}

	unsuspendTeam(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot unsuspend teams right now.`);
		}
		const team = this.teams.get(toID(name));
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (!team.suspended) throw new Chat.ErrorMessage(`Team ${name} is not suspended.`);
		team.suspended = false;
	}

	addManagers(teamName: string, users: string[]) {
		const team = this.teams.get(toID(teamName));
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		for (const name of users) {
			const user = Users.getExact(name);
			if (!user) throw new Chat.ErrorMessage(`User "${name}" not found.`);
			const manager = this.managers.get(user.id);
			if (!manager) {
				this.managers.set(user.id, {id: user.id, team});
			} else {
				manager.team = team;
			}
		}
	}

	removeManagers(users: string[]) {
		for (const name of users) {
			if (!this.managers.delete(toID(name))) throw new Chat.ErrorMessage(`User "${name}" is not a manager.`);
		}
	}

	addCreditsToTeam(teamName: string, amount: number) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot add credits to a team right now.`);
		}
		const team = this.teams.get(toID(teamName));
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		if (isNaN(amount) || amount % 500 !== 0) {
			throw new Chat.ErrorMessage(`The amount of credits must be a multiple of 500.`);
		}
		const newCredits = team.credits + amount;
		if (newCredits <= 0 || newCredits > 10000000) {
			throw new Chat.ErrorMessage(`A team must have between 0 and 10,000,000 credits.`);
		}
		if (team.maxBid(newCredits) < this.minBid) {
			throw new Chat.ErrorMessage(`A team must have enough credits to draft the minimum amount of players.`);
		}
		team.credits = newCredits;
	}

	start() {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`The auction has already been started.`);
		if (this.teams.size < 2) throw new Chat.ErrorMessage(`The auction needs at least 2 teams to start.`);
		const problemTeams = [];
		for (const team of this.teams.values()) {
			if (team.maxBid() < this.minBid) problemTeams.push(team.name);
		}
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
		this.clearTimer();
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
			this.currentTeam = this.queue.shift()!;
			this.queue.push(this.currentTeam);
		} while (this.currentTeam.isSuspended());
		this.sendHTMLBox(this.generateAuctionTable());
		this.sendMessage(`/html It is now <b>${Utils.escapeHTML(this.currentTeam.name)}</b>'s turn to nominate a player. Managers: ${this.currentTeam.getManagers().map(m => `<username class="username">${Utils.escapeHTML(m)}</username>`).join(' ')}`);
	}

	nominate(user: User, target: string) {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`You cannot nominate players right now.`);
		const manager = this.managers.get(user.id);
		if (!manager || manager.team !== this.currentTeam) this.checkOwner(user);

		// For undo
		this.lastQueue = this.queue.slice();
		this.lastQueue.unshift(this.lastQueue.pop()!);

		const player = this.auctionPlayers.get(toID(target));
		if (!player) throw new Chat.ErrorMessage(`${target} is not a valid player.`);
		if (player.team) throw new Chat.ErrorMessage(`${player.name} has already been drafted.`);
		this.currentNom = player;
		this.state = 'bid';
		this.currentBid = this.minBid;
		this.currentBidder = this.currentTeam;
		this.sendMessage(Utils.html`/html <username class="username">${user.name}</username> from team <b>${this.currentTeam.name}</b> has nominated <username>${player.name}</username> for auction. Use /bid to place a bid!`);
		if (!this.blindMode) this.sendBidInfo();
		this.bidTimer = setInterval(() => this.pokeBidTimer(), 1000);
	}

	bid(user: User, amount: number) {
		if (this.state !== 'bid') throw new Chat.ErrorMessage(`There are no players up for auction right now.`);
		const team = this.managers.get(user.id)?.team;
		if (!team) throw new Chat.ErrorMessage(`Only managers can bid on players.`);

		if (amount < 500) amount *= 1000;
		if (isNaN(amount) || amount % 500 !== 0) throw new Chat.ErrorMessage(`Your bid must be a multiple of 500.`);
		if (amount > team.maxBid()) throw new Chat.ErrorMessage(`You cannot afford to bid that much.`);

		if (this.blindMode) {
			if (this.bidsPlaced.has(team)) throw new Chat.ErrorMessage(`Your team has already placed a bid.`);
			if (amount <= this.minBid) throw new Chat.ErrorMessage(`Your bid must be higher than the minimum bid.`);
			this.bidsPlaced.add(team);
			for (const manager of this.managers.values()) {
				if (manager.team === team) {
					Users.getExact(manager.id)?.sendTo(this.room, `Your team placed a bid of **${amount}** on **${this.currentNom}**.`);
				}
			}
			if (amount > this.currentBid) {
				this.currentBid = amount;
				this.currentBidder = team;
			}
			if (this.bidsPlaced.size === this.teams.size) {
				this.finishCurrentNom();
			}
		} else {
			if (amount <= this.currentBid) throw new Chat.ErrorMessage(`Your bid must be higher than the current bid.`);
			this.currentBid = amount;
			this.currentBidder = team;
			this.sendMessage(Utils.html`/html <username class="username">${user.name}</username>[${team.name}]: <b>${amount}</b>`);
			this.sendBidInfo();
			this.clearTimer();
			this.bidTimer = setInterval(() => this.pokeBidTimer(), 1000);
		}
	}

	finishCurrentNom() {
		this.sendMessage(Utils.html`/html <b>${this.currentBidder.name}</b> has bought <username>${this.currentNom.name}<username> for <b>${this.currentBid}</b> credits!`);
		this.currentBidder.addPlayer(this.currentNom, this.currentBid);
		this.bidsPlaced.clear();
		this.clearTimer();
		this.next();
	}

	undoLastNom() {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`You cannot undo a nomination right now.`);
		if (!this.lastQueue) throw new Chat.ErrorMessage(`You cannot undo more than one nomination at a time.`);
		this.queue = this.lastQueue;
		this.lastQueue = null;
		this.currentBidder.removePlayer(this.currentNom);
		this.currentBidder.credits += this.currentBid;
		this.next();
	}

	clearTimer() {
		clearInterval(this.bidTimer);
		this.bidTimeElapsed = 0;
	}

	pokeBidTimer() {
		this.bidTimeElapsed++;
		const timeRemaining = this.bidTimeLimit - this.bidTimeElapsed;
		if (timeRemaining === 0) {
			this.finishCurrentNom();
		} else if (timeRemaining % 10 === 0 || timeRemaining === 5) {
			this.sendMessage(`__${this.bidTimeLimit - this.bidTimeElapsed} seconds left!__`);
		}
	}

	end(message?: string) {
		this.sendHTMLBox(this.generateAuctionTable());
		this.sendHTMLBox(this.generatePriceList());
		if (message) this.sendMessage(message);
		this.destroy();
	}

	destroy() {
		clearInterval(this.bidTimer);
		super.destroy();
	}
}

export const commands: Chat.ChatCommands = {
	auction: {
		create(target, room, user) {
			room = this.requireRoom();
			this.checkCan('minigame', null, room);
			if (room.game) return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			if (room.settings.auctionDisabled) return this.errorReply('Auctions are currently disabled in this room.');

			let startingCredits;
			if (target) {
				startingCredits = parseInt(target);
				if (
					isNaN(startingCredits) ||
					startingCredits < 10000 || startingCredits > 10000000 ||
					startingCredits % 500 !== 0
				) {
					return this.errorReply(`Starting credits must be a multiple of 500 between 10,000 and 10,000,000.`);
				}
			}
			const auction = new Auction(room, startingCredits);
			auction.addOwners([user.id]);
			room.game = auction;
			this.addModAction(`An auction was created by ${user.name}.`);
			this.modlog(`AUCTION CREATE`);
		},
		createhelp: [
			`/auction create [startingcredits] - Creates an auction. Requires: % @ # &`,
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
			const amount = parseInt(target);
			auction.setMinBid(amount);
			this.addModAction(`${user.name} set the minimum bid to ${amount}.`);
			this.modlog('AUCTION MINBID', null, `${amount}`);
		},
		minbidhelp: [
			`/auction minbid [amount] - Sets the minimum bid. Requires: # & auction owner`,
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
			`/auction minplayers [amount] - Sets the minimum number of players. Requires: # & auction owner`,
		],
		blindmode(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (this.meansYes(target)) {
				auction.setBlindMode(true);
				this.addModAction(`${user.name} turned on blind mode.`);
			} else if (this.meansNo(target)) {
				auction.setBlindMode(false);
				this.addModAction(`${user.name} turned off blind mode.`);
			} else {
				return this.parse('/help auction blindmode');
			}
		},
		blindmodehelp: [
			`/auction blindmode [on/off] - Enables or disables blind mode. Requires: # & auction owner`,
			`When blind mode is enabled, teams may only place one bid per nomination and only the highest bid is revealed once the timer runs out or after all teams have placed a bid.`,
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
			`/auction addowners [user1], [user2], ... - Adds users as auction owners. Requires: # & auction owner`,
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
			`/auction removeowners [user1], [user2], ... - Removes users as auction owners. Requires: # & auction owner`,
		],
		async importplayers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction importplayers');
			if (!/^https?:\/\/pastebin\.com\/[a-zA-Z0-9]+$/.test(target)) {
				return this.errorReply('Invalid pastebin URL.');
			}
			let data = '';
			try {
				data = await Net(`https://pastebin.com/raw/${target.split('/').pop()}`).get();
			} catch {}
			if (!data) return this.errorReply('Error fetching data from pastebin.');

			auction.importPlayers(data);
			this.addModAction(`${user.name} imported the player list from ${target}.`);
		},
		importplayershelp: [
			`/auction importplayers [pastebin url] - Imports a list of players from a pastebin. Requires: # & auction owner`,
			`The pastebin should be a list of tab-separated values with the first row containing tier names and subsequent rows containing the player names and a Y in the column corresponding to the tier.`,
			`See https://pastebin.com/jPTbJBva for an example.`,
		],
		addplayer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [name, ...tiers] = target.split(',').map(x => x.trim());
			if (!name) return this.parse('/help auction addplayer');
			const player = auction.addAuctionPlayer(name, tiers);
			this.addModAction(`${user.name} added player ${player.name} to the auction.`);
		},
		addplayerhelp: [
			`/auction addplayer [name], [tier1], [tier2], ... - Adds a player to the auction. Requires: # & auction owner`,
		],
		removeplayer(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removeplayer');
			const player = auction.removeAuctionPlayer(target);
			this.addModAction(`${user.name} removed player ${player.name} from the auction.`);
		},
		removeplayerhelp: [
			`/auction removeplayer [name] - Removes a player from the auction. Requires: # & auction owner`,
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
			`/auction assignplayer [player], [team] - Assigns a player to a team. If team is blank, returns player to draft pool. Requires: # & auction owner`,
		],
		addteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [name, ...managers] = target.split(',').map(x => x.trim());
			if (!name) return this.parse('/help auction addteam');
			const team = auction.addTeam(name);
			auction.addManagers(team.name, managers);
			this.addModAction(`${user.name} added team ${team.name} to the auction.`);
		},
		addteamhelp: [
			`/auction addteam [name], [manager1], [manager2], ... - Adds a team to the auction. Requires: # & auction owner`,
		],
		removeteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removeteam');
			const team = auction.removeTeam(target);
			this.addModAction(`${user.name} removed team ${team.name} from the auction.`);
		},
		removeteamhelp: [
			`/auction removeteam [team] - Removes a team from the auction. Requires: # & auction owner`,
		],
		suspendteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction suspendteam');
			auction.suspendTeam(target);
			const team = auction.teams.get(toID(target))!;
			this.addModAction(`${user.name} suspended team ${team.name}.`);
		},
		suspendteamhelp: [
			`/auction suspendteam [team] - Suspends a team from the auction. Requires: # & auction owner`,
		],
		unsuspendteam(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction unsuspendteam');
			auction.unsuspendTeam(target);
			const team = auction.teams.get(toID(target))!;
			this.addModAction(`${user.name} unsuspended team ${team.name}.`);
		},
		unsuspendteamhelp: [
			`/auction unsuspendteam [team] - Unsuspends a team from the auction. Requires: # & auction owner`,
		],
		addmanager: 'addmanagers',
		addmanagers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, ...managers] = target.split(',').map(x => x.trim());
			if (!teamName || !managers.length) return this.parse('/help auction addmanagers');
			auction.addManagers(teamName, managers);
			const team = auction.teams.get(toID(teamName))!;
			this.addModAction(`${user.name} added ${Chat.toListString(managers.map(m => Users.getExact(m)!.name))} as manager${Chat.plural(managers.length)} for team ${team.name}.`);
		},
		addmanagershelp: [
			`/auction addmanagers [team], [user1], [user2], ... - Adds users as managers to a team. Requires: # & auction owner`,
		],
		removemanager: 'removemanagers',
		removemanagers(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const managers = target.split(',').map(x => x.trim());
			if (!managers.length) return this.parse('/help auction removemanagers');
			auction.removeManagers(managers);
			this.addModAction(`${user.name} removed ${Chat.toListString(managers.map(m => Users.getExact(m)?.name || m))} as manager${Chat.plural(managers.length)}.`);
		},
		removemanagershelp: [
			`/auction removemanagers [user1], [user2], ... - Removes users as managers. Requires: # & auction owner`,
		],
		addcredits(target, room, user) {
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, amount] = target.split(',').map(x => x.trim());
			if (!teamName || !amount) return this.parse('/help auction addcredits');
			auction.addCreditsToTeam(teamName, parseInt(amount));
			const team = auction.teams.get(toID(teamName))!;
			this.addModAction(`${user.name} added ${amount} credits to team ${team.name}.`);
		},
		addcreditshelp: [
			`/auction addcredits [team], [amount] - Adds credits to a team. Requires: # & auction owner`,
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
		bid(target, room, user) {
			const auction = this.requireGame(Auction);
			if (!target) return this.parse('/help auction bid');
			auction.bid(user, parseFloat(target));
		},
		bidhelp: [
			`/auction bid OR /bid [amount] - Bids on a player for the specified amount. If the amount is less than 500, it will be multiplied by 1000.`,
		],
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
				return this.errorReply('Auctions are already disabled.');
			}
			room.settings.auctionDisabled = true;
			room.saveSettings();
			this.sendReply('Auctions have been disabled for this room.');
		},
		enable(target, room) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (!room.settings.auctionDisabled) {
				return this.errorReply('Auctions are already enabled.');
			}
			delete room.settings.auctionDisabled;
			room.saveSettings();
			this.sendReply('Auctions have been enabled for this room.');
		},
		ongoing: 'running',
		running() {
			if (!this.runBroadcast()) return;
			const runningAuctions = [];
			for (const auctionRoom of Rooms.rooms.values()) {
				const auction = auctionRoom.getGame(Auction);
				if (!auction) continue;
				runningAuctions.push(auctionRoom.title);
			}
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
			`- bid [amount]: Bids on a player for the specified amount. If the amount is less than 500, it will be multiplied by 1000.<br/>` +
			`You may use /bid and /nom directly without the /auction prefix.<br/><br/>` +
			`<details class="readmore"><summary>Configuration Commands</summary>` +
			`- minbid [amount]: Sets the minimum bid.<br/>` +
			`- minplayers [amount]: Sets the minimum number of players.<br/>` +
			`- blindmode [on/off]: Enables or disables blind mode.<br/>` +
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
			`- undo: Undoes the last nomination.<br/>` +
			`- [enable/disable]: Enables or disables auctions from being started in a room.<br/>` +
			`</details>`
		);
	},
	nom(target) {
		this.parse(`/auction nominate ${target}`);
	},
	bid(target) {
		this.parse(`/auction bid ${target}`);
	},
	overpay() {
		this.requireGame(Auction);
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
