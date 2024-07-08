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

class Team {
	id: ID;
	name: string;
	credits: number;
	managers: string[];
	suspended: boolean;
	private auction: Auction;
	constructor(name: string, auction: Auction) {
		this.id = toID(name);
		this.name = name;
		this.credits = auction.startingCredits;
		this.managers = [];
		this.suspended = false;
		this.auction = auction;
	}

	getPlayers() {
		const players = [];
		for (const id in this.auction.playerList) {
			const player = this.auction.playerList[id];
			if (player.team === this) players.push(player);
		}
		return players;
	}

	isSuspended() {
		return this.credits < this.auction.minBid || this.suspended;
	}

	maxBid(credits = this.credits) {
		return credits + this.auction.minBid * Math.min(0, this.getPlayers().length - this.auction.minPlayers + 1);
	}
}

function getUsername(id: string) {
	const user = Users.get(id);
	return user?.connected ? user.name : id;
}

export class Auction extends Rooms.SimpleRoomGame {
	override readonly gameid = 'auction' as ID;
	teams: {[k: string]: Team};
	playerList: {[k: string]: Player};
	owners: {[k: string]: string};

	startingCredits: number;
	minBid: number;
	minPlayers: number;
	blindMode: boolean;

	lastQueue: string[] | null = null;
	queue: string[] = [];
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
	bidsPlaced: {[k: string]: number};
	state: 'setup' | 'nom' | 'bid' = 'setup';
	constructor(room: Room, startingCredits = 100000) {
		super(room);
		this.title = `Auction (${room.title})`;
		this.teams = {};
		this.playerList = {};
		this.owners = {};

		this.startingCredits = startingCredits;
		this.minBid = 3000;
		this.minPlayers = 10;
		this.blindMode = false;

		this.currentTeam = null!;
		this.bidTimer = null!;
		this.bidTimeElapsed = 0;
		this.bidTimeLimit = 10;
		this.currentNom = null!;
		this.currentBid = 0;
		this.currentBidder = null!;
		this.bidsPlaced = {};
	}

	sendMessage(message: string) {
		this.room.add(`|c|&|${message}`).update();
	}

	sendHTMLBox(htmlContent: string, uhtml?: string) {
		this.room.add(`|${uhtml ? `uhtml|${uhtml}` : 'html'}|<div class="infobox">${htmlContent}</div>`).update();
	}

	checkOwner(user: User) {
		if (!this.owners[user.id] && !Users.Auth.hasPermission(user, 'declare', null, this.room)) {
			throw new Chat.ErrorMessage(`You must be an auction owner to use this command.`);
		}
	}

	addOwner(user: User) {
		if (this.owners[user.id]) throw new Chat.ErrorMessage(`${user.name} is already an auction owner.`);
		this.owners[user.id] = user.id;
	}

	removeOwner(user: User) {
		if (!this.owners[user.id]) throw new Chat.ErrorMessage(`${user.name} is not an auction owner.`);
		delete this.owners[user.id];
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
		const draftedPlayers = Utils.sortBy(Object.values(this.playerList).filter(p => p.team), p => -p.price);
		let buf = '';
		for (const id in this.teams) {
			const team = this.teams[id];
			buf += `<details><summary>${Utils.escapeHTML(team.name)}</summary><table>`;
			for (const player of draftedPlayers.filter(p => p.team === team)) {
				buf += `<tr><td>${Utils.escapeHTML(player.name)}</td><td>${player.price}</td></tr>`;
			}
			buf += `</table></details><br/>`;
		}
		buf += `<details><summary>All</summary><table>`;
		for (const player of draftedPlayers) {
			buf += `<tr><td>${Utils.escapeHTML(player.name)}</td><td>${player.price}</td></tr>`;
		}
		buf += `</table></details>`;
		return buf;
	}

	generateAuctionTable() {
		let buf = `<div class="ladder pad"><table style="width: 100%"><tr><th colspan=2>Order</th><th>Teams</th><th>Credits</th><th>Players</th></tr>`;
		const queue = this.queue.filter(id => !this.teams[id].isSuspended());
		buf += Object.values(this.teams).map(team => {
			const players = team.getPlayers();
			let i1 = queue.indexOf(team.id) + 1;
			let i2 = queue.lastIndexOf(team.id) + 1;
			if (i1 > queue.length / 2) {
				[i1, i2] = [i2, i1];
			}
			let row = `<tr>`;
			row += `<td align="center" style="width: 15px">${i1 > 0 ? i1 : '-'}</td><td align="center" style="width: 15px">${i2 > 0 ? i2 : '-'}</td>`;
			row += `<td style="white-space: nowrap"><strong>${Utils.escapeHTML(team.name)}</strong><br/>${this.generateUsernameList(team.managers.map(getUsername), 2, true)}</td>`;
			row += `<td style="white-space: nowrap">${team.credits.toLocaleString()}${team.maxBid() >= this.minBid ? `<br/><span style="font-size: 90%">Max bid: ${team.maxBid().toLocaleString()}</span>` : ''}</td>`;
			row += `<td><div style="min-height: 32px; height: 32px; overflow: hidden; resize: vertical"><span style="float: right">${players.length}</span>${this.generateUsernameList(players)}</div></td>`;
			row += `</tr>`;
			return row;
		}).join('');
		buf += `</table></div>`;

		const remainingPlayers = Utils.sortBy(Object.values(this.playerList).filter(p => !p.team), p => p.name);
		const tierArrays: {[k: string]: Player[]} = {};
		for (const player of remainingPlayers) {
			if (!player.tiers?.length) continue;
			for (const tier of player.tiers) {
				if (!tierArrays[tier]) tierArrays[tier] = [];
				tierArrays[tier].push(player);
			}
		}
		const sortedTiers = Object.keys(tierArrays).sort();
		if (sortedTiers.length) {
			buf += `<details><summary>Remaining Players (${remainingPlayers.length})</summary>`;
			buf += `<details><summary>All</summary>${this.generateUsernameList(remainingPlayers)}</details>`;
			buf += `<details><summary>Tiers</summary><ul style="list-style-type: none">`;
			for (const tier of sortedTiers) {
				buf += `<li><details><summary>${Utils.escapeHTML(tier)} (${tierArrays[tier].length})</summary>${this.generateUsernameList(tierArrays[tier])}</details></li>`;
			}
			buf += `</ul></details></details>`;
		} else {
			buf += `<details><summary>Remaining Players (${remainingPlayers.length})</summary>${this.generateUsernameList(remainingPlayers)}</details>`;
		}
		buf += `<details><summary>Auction Settings</summary>`;
		buf += `- Minimum bid: <b>${this.minBid.toLocaleString()}</b><br/>`;
		buf += `- Minimum players per team: <b>${this.minPlayers}</b><br/>`;
		buf += `- Blind mode: <b>${this.blindMode ? 'On' : 'Off'}</b><br/>`;
		buf += `</details>`;
		return buf;
	}

	generateBidInfo() {
		let buf = `Player: <b>${Utils.escapeHTML(this.currentNom.name)}</b> `;
		buf += `Top bid: <b>${this.currentBid}</b> `;
		buf += `Top bidder: <b>${Utils.escapeHTML(this.currentBidder.name)}</b> `;
		buf += `Tiers: <b>${this.currentNom.tiers?.length ? `${Utils.escapeHTML(this.currentNom.tiers.join(', '))}` : 'N/A'}</b>`;
		return buf;
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

	importPlayers(data: string) {
		if (this.state !== 'setup') {
			throw new Chat.ErrorMessage(`You cannot import a player list after the auction has started.`);
		}
		const rows = data.replace('\r', '').split('\n');
		const tierNames = rows.shift()!.split('\t').slice(1);
		const playerList: {[k: string]: Player} = {};
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
			playerList[player.id] = player;
		}
		this.playerList = playerList;
	}

	addPlayerToAuction(name: string, tiers?: string[]) {
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
		this.playerList[player.id] = player;
		return player;
	}

	removePlayerFromAuction(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot remove players from the auction right now.`);
		}
		const player = this.playerList[toID(name)];
		if (!player) throw new Chat.ErrorMessage(`Player "${name}" not found.`);
		delete this.playerList[player.id];
		if (this.state !== 'setup' && !Object.values(this.playerList).filter(p => !p.team).length) {
			this.end('The auction has ended because there are no players remaining in the draft pool.');
		}
		return player;
	}

	assignPlayer(name: string, teamName?: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot assign players to a team right now.`);
		}
		const player = this.playerList[toID(name)];
		if (!player) throw new Chat.ErrorMessage(`Player "${name}" not found.`);
		if (teamName) {
			const team = this.teams[toID(teamName)];
			if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
			player.team = team;
			if (!Object.values(this.playerList).filter(p => !p.team).length) {
				return this.end('There are no players remaining in the draft pool, so the auction has ended.');
			}
		} else {
			delete player.team;
		}
		this.sendHTMLBox(this.generateAuctionTable());
	}

	addTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`You cannot add teams after the auction has started.`);
		if (name.length > 40) throw new Chat.ErrorMessage(`Team names must be 40 characters or less.`);
		const team = new Team(name, this);
		this.teams[team.id] = team;
		this.queue = Object.values(this.teams).map(toID).concat(Object.values(this.teams).map(toID).reverse());
		return team;
	}

	removeTeam(name: string) {
		if (this.state !== 'setup') throw new Chat.ErrorMessage(`You cannot remove teams after the auction has started.`);
		const team = this.teams[toID(name)];
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		this.queue = this.queue.filter(id => id !== team.id);
		delete this.teams[team.id];
		return team;
	}

	suspendTeam(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot suspend teams right now.`);
		}
		const team = this.teams[toID(name)];
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (team.suspended) throw new Chat.ErrorMessage(`Team ${name} is already suspended.`);
		if (this.currentTeam === team) throw new Chat.ErrorMessage(`You cannot suspend the current nominating team.`);
		team.suspended = true;
	}

	unsuspendTeam(name: string) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot unsuspend teams right now.`);
		}
		const team = this.teams[toID(name)];
		if (!team) throw new Chat.ErrorMessage(`Team "${name}" not found.`);
		if (!team.suspended) throw new Chat.ErrorMessage(`Team ${name} is not suspended.`);
		team.suspended = false;
	}

	addManagers(teamName: string, managers: string[]) {
		const team = this.teams[toID(teamName)];
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		for (const manager of managers) {
			const user = Users.get(manager);
			if (!user) throw new Chat.ErrorMessage(`User "${manager}" not found.`);
			team.managers.push(user.id);
		}
	}

	removeManagers(teamName: string, managers: string[]) {
		const team = this.teams[toID(teamName)];
		if (!team) throw new Chat.ErrorMessage(`Team "${teamName}" not found.`);
		for (const manager of managers) {
			const managerIndex = team.managers.indexOf(toID(manager));
			if (managerIndex < 0) {
				throw new Chat.ErrorMessage(`"${manager}" is not a manager of team ${team.name}.`);
			}
			team.managers.splice(managerIndex, 1);
		}
	}

	addCreditsToTeam(teamName: string, amount: number) {
		if (this.state !== 'setup' && this.state !== 'nom') {
			throw new Chat.ErrorMessage(`You cannot add credits to a team right now.`);
		}
		const team = this.teams[toID(teamName)];
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
		if (Object.keys(this.teams).length < 2) throw new Chat.ErrorMessage(`The auction needs at least 2 teams to start.`);
		const problemTeams = [];
		for (const id in this.teams) {
			const team = this.teams[id];
			if (team.maxBid() < this.minBid) problemTeams.push(team.name);
		}
		if (problemTeams.length) {
			throw new Chat.ErrorMessage(`The following teams do not have enough credits to draft the minimum amount of players: ${problemTeams.join(', ')}`);
		}
		this.next();
	}

	reset() {
		for (const id in this.teams) {
			const team = this.teams[id];
			team.credits = this.startingCredits;
			team.suspended = false;
			for (const player of team.getPlayers()) {
				delete player.team;
				player.price = 0;
			}
		}
		this.lastQueue = null;
		this.queue = Object.values(this.teams).map(toID).concat(Object.values(this.teams).map(toID).reverse());
		this.clearTimer();
		this.state = 'setup';
		this.sendHTMLBox(this.generateAuctionTable());
	}

	next() {
		this.state = 'nom';
		if (!this.queue.filter(id => !this.teams[id].isSuspended()).length) {
			return this.end('The auction has ended because there are no teams remaining that can draft players.');
		}
		if (!Object.values(this.playerList).filter(p => !p.team).length) {
			return this.end('The auction has ended because there are no players remaining in the draft pool.');
		}
		do {
			this.currentTeam = this.teams[this.queue.shift()!];
			this.queue.push(this.currentTeam.id);
		} while (this.currentTeam.isSuspended());
		this.sendHTMLBox(this.generateAuctionTable());
		this.sendMessage(`It is now **${this.currentTeam.name}**'s turn to nominate a player. Managers: ${Chat.toListString(this.currentTeam.managers.map(getUsername))}`);
	}

	nominate(user: User, target: string) {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`You cannot nominate players right now.`);
		if (!this.currentTeam.managers.includes(user.id)) this.checkOwner(user);

		// For undo
		this.lastQueue = this.queue.slice();
		this.lastQueue.unshift(this.lastQueue.pop()!);

		const player = this.playerList[toID(target)];
		if (!player) throw new Chat.ErrorMessage(`${target} is not a valid player.`);
		if (player.team) throw new Chat.ErrorMessage(`${player.name} has already been drafted.`);
		this.currentNom = player;
		this.state = 'bid';
		this.currentBid = this.minBid;
		this.currentBidder = this.currentTeam;
		this.sendMessage(`${user.name} from **${this.currentTeam.name}** has nominated **${player.name}** for auction. Use /bid to place a bid!`);
		this.sendHTMLBox(this.generateBidInfo(), 'bid');
		this.bidTimer = setInterval(() => this.pokeBidTimer(), 1000);
	}

	bid(user: User, amount: number) {
		if (this.state !== 'bid') throw new Chat.ErrorMessage(`There are no players up for auction right now.`);
		const team = Object.values(this.teams).find(t => t.managers.includes(user.id));
		if (!team) throw new Chat.ErrorMessage(`Only managers can bid on players.`);

		if (amount < 500) amount *= 1000;
		if (isNaN(amount) || amount % 500 !== 0) throw new Chat.ErrorMessage(`Your bid must be a multiple of 500.`);
		if (amount > team.maxBid()) throw new Chat.ErrorMessage(`You cannot afford to bid that much.`);

		if (this.blindMode) {
			if (this.bidsPlaced[team.id]) throw new Chat.ErrorMessage(`Your team has already placed a bid.`);
			if (amount <= this.minBid) throw new Chat.ErrorMessage(`Your bid must be higher than the minimum bid.`);
			this.bidsPlaced[team.id] = amount;
			for (const manager of team.managers) {
				Users.get(manager)?.sendTo(this.room, `Your team placed a bid of **${amount}** on **${this.currentNom}**.`);
			}
			if (amount > this.currentBid) {
				this.currentBid = amount;
				this.currentBidder = team;
			}
			if (Object.keys(this.bidsPlaced).length === Object.keys(this.teams).length) {
				this.finishCurrentNom();
			}
		} else {
			if (amount <= this.currentBid) throw new Chat.ErrorMessage(`Your bid must be higher than the current bid.`);
			this.currentBid = amount;
			this.currentBidder = team;
			this.sendMessage(`${user.name}[${team.name}]: **${amount}**`);
			this.sendHTMLBox(this.generateBidInfo(), 'bid');
			this.clearTimer();
			this.bidTimer = setInterval(() => this.pokeBidTimer(), 1000);
		}
	}

	finishCurrentNom() {
		this.sendMessage(`**${this.currentBidder.name}** has bought **${this.currentNom.name}** for **${this.currentBid}** credits!`);
		this.currentBidder.credits -= this.currentBid;
		this.currentNom.team = this.currentBidder;
		this.currentNom.price = this.currentBid;
		this.clearTimer();
		this.next();
	}

	undoLastNom() {
		if (this.state !== 'nom') throw new Chat.ErrorMessage(`You cannot undo a nomination right now.`);
		if (!this.lastQueue) throw new Chat.ErrorMessage(`You cannot undo more than one nomination at a time.`);
		this.queue = this.lastQueue;
		this.lastQueue = null;
		this.currentBidder.credits += this.currentBid;
		delete this.currentNom.team;
		this.currentNom.price = 0;
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
				if (startingCredits < 500) startingCredits *= 1000;
				if (
					isNaN(startingCredits) ||
					startingCredits < 10000 || startingCredits > 10000000 ||
					startingCredits % 500 !== 0
				) {
					return this.errorReply(`Starting credits must be a multiple of 500 between 10,000 and 10,000,000.`);
				}
			}
			this.addModAction(`An auction was created by ${user.name}.`);
			this.modlog(`AUCTION CREATE`);
			const auction = new Auction(room, startingCredits);
			room.game = auction;
			auction.addOwner(user);
		},
		createhelp: [
			`/auction create [startingcredits] - Creates an auction. Requires: % @ # &`,
		],
		start(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.start();
			this.addModAction(`The auction was started by ${user.name}.`);
			this.modlog(`AUCTION START`);
		},
		reset(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.reset();
			this.addModAction(`The auction was reset by ${user.name}.`);
			this.modlog(`AUCTION RESET`);
		},
		delete: 'end',
		stop: 'end',
		end(target, room, user) {
			room = this.requireRoom();
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
			room = this.requireRoom();
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
			room = this.requireRoom();
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
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction blindmode');
			if (this.meansYes(target)) {
				auction.setBlindMode(true);
				this.addModAction(`${user.name} turned on blind mode.`);
			} else if (this.meansNo(target)) {
				auction.setBlindMode(false);
				this.addModAction(`${user.name} turned off blind mode.`);
			}
		},
		blindmodehelp: [
			`/auction blindmode [on/off] - Enables or disables blind mode. Requires: # & auction owner`,
			`When blind mode is enabled, teams may only place one bid per nomination and only the highest bid is revealed once the timer runs out or after all teams have placed a bid.`,
		],
		async importplayers(target, room, user) {
			room = this.requireRoom();
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
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction addplayer');
			const [name, ...tiers] = target.split(',').map(x => x.trim());
			const player = auction.addPlayerToAuction(name, tiers);
			this.addModAction(`${user.name} added player ${player.name} to the auction.`);
		},
		addplayerhelp: [
			`/auction addplayer [name], [tier1], [tier2], ... - Adds a player to the auction. Requires: # & auction owner`,
		],
		removeplayer(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction removeplayer');
			const player = auction.removePlayerFromAuction(target);
			this.addModAction(`${user.name} removed player ${player.name} from the auction.`);
		},
		removeplayerhelp: [
			`/auction removeplayer [name] - Removes a player from the auction. Requires: # & auction owner`,
		],
		assignplayer(target, room, user) {
			if (!target) return this.parse('/help auction assignplayer');
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [player, team] = target.split(',').map(x => x.trim());
			if (team) {
				auction.assignPlayer(player, team);
				this.addModAction(`${user.name} assigned player ${player} to team ${team}.`);
			} else {
				auction.assignPlayer(player);
				this.sendReply(`${user.name} returned player ${player} to draft pool.`);
			}
		},
		assignplayerhelp: [
			`/auction assignplayer [player], [team] - Assigns a player to a team. If team is blank, returns player to draft pool. Requires: # & auction owner`,
		],
		addteam(target, room, user) {
			room = this.requireRoom();
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
			room = this.requireRoom();
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
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction suspendteam');
			auction.suspendTeam(target);
			const team = auction.teams[toID(target)];
			this.addModAction(`${user.name} suspended team ${team.name}.`);
		},
		suspendteamhelp: [
			`/auction suspendteam [team] - Suspends a team from the auction. Requires: # & auction owner`,
		],
		unsuspendteam(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			if (!target) return this.parse('/help auction unsuspendteam');
			auction.unsuspendTeam(target);
			const team = auction.teams[toID(target)];
			this.addModAction(`${user.name} unsuspended team ${team.name}.`);
		},
		unsuspendteamhelp: [
			`/auction unsuspendteam [team] - Unsuspends a team from the auction. Requires: # & auction owner`,
		],
		addmanager: 'addmanagers',
		addmanagers(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, ...managers] = target.split(',').map(x => x.trim());
			if (!teamName || !managers.length) return this.parse('/help auction addmanagers');
			auction.addManagers(teamName, managers);
			const team = auction.teams[toID(teamName)];
			this.addModAction(`${user.name} added ${Chat.toListString(managers.map(getUsername))} as manager${Chat.plural(managers.length)} for team ${team.name}.`);
		},
		addmanagershelp: [
			`/auction addmanagers [team], [manager1], [manager2], ... - Adds managers to a team. Requires: # & auction owner`,
		],
		removemanager: 'removemanagers',
		removemanagers(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, ...managers] = target.split(',').map(x => x.trim());
			if (!teamName || !managers.length) return this.parse('/help auction removemanagers');
			auction.removeManagers(teamName, managers);
			const team = auction.teams[toID(teamName)];
			this.addModAction(`${user.name} removed ${Chat.toListString(managers.map(getUsername))} as manager${Chat.plural(managers.length)} for team ${team.name}.`);
		},
		removemanagershelp: [
			`/auction removemanagers [team], [manager1], [manager2], ... - Removes managers from a team. Requires: # & auction owner`,
		],
		addcredits(target, room, user) {
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			const [teamName, amount] = target.split(',').map(x => x.trim());
			if (!teamName || !amount) return this.parse('/help auction addcredits');
			auction.addCreditsToTeam(teamName, parseInt(amount));
			const team = auction.teams[toID(teamName)];
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
			room = this.requireRoom();
			const auction = this.requireGame(Auction);
			auction.checkOwner(user);

			auction.undoLastNom();
			this.addModAction(`${user.name} undid the last nomination.`);
		},
		disable(target, room, user) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (room.settings.auctionDisabled) {
				return this.errorReply('Auctions are already disabled.');
			}
			room.settings.auctionDisabled = true;
			room.saveSettings();
			this.sendReply('Auctions have been disabled for this room.');
		},
		enable(target, room, user) {
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
		running(target, room, user) {
			room = this.requireRoom();
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
		help(target, room, user) {
			this.parse('/help auction');
		},
	},
	auctionhelp(target, room, user) {
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
			`- importplayers [pastebin url]: Imports a list of players from a pastebin.<br/>` +
			`- addplayer [name], [tier1], [tier2], ...: Adds a player to the auction.<br/>` +
			`- removeplayer [name]: Removes a player from the auction.<br/>` +
			`- assignplayer [player], [team]: Assigns a player to a team. If team is blank, returns player to draft pool.<br/>` +
			`- addteam [name], [manager1], [manager2], ...: Adds a team to the auction.<br/>` +
			`- removeteam [name]: Removes the given team from the auction.<br/>` +
			`- suspendteam [name]: Suspends the given team from the auction.<br/>` +
			`- unsuspendteam [name]: Unsuspends the given team from the auction.<br/>` +
			`- addmanagers [team], [manager1], [manager2], ...: Adds managers to a team.<br/>` +
			`- removemanagers [team], [manager1], [manager2], ...: Removes managers from a team.<br/>` +
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
