/**
 * Blackjack Game
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This allows users to play the classic blackjack card game.
 * Credits: jd, panpawn
 *
 * @license MIT license
 */
'use strict';

class Blackjack extends Rooms.RoomGame {
	constructor(room, user, target) {
		super(room);
		this.room = room;

		this.turnTimeoutMinutes = 1;
		this.timerTickSeconds = 5;

		this.createdBy = user.name;
		this.startedBy = '';
		this.allowRenames = true;

		this.playerCap = 16;
		this.minimumPlayers = 2;
		this.playerScrollWheel = 4;
		this.cardWidth = 50;
		this.cardHeight = 85;

		this.spectators = Object.create(null);
		this.dealer = new BlackjackDealer();

		this.symbols = {
			'♥': 'Hearts',
			'♦': 'Diamonds',
			'♣': 'Clubs',
			'♠': 'Spades',
		};
		this.deck = new BlackjackDeck().shuffle();

		this.roomid = this.room.roomid;
		this.title = `Blackjack (${room.title})`;
		this.blackjack = true;
		this.state = 'signups';

		this.lastMessage = '';
		this.turnLog = '';
		this.uhtmlChange = '';
		this.curUser = '';
		this.endedBy = '';
		this.infoboxLimited = '';

		this.button = '<button class="button" name="send" value="/joingame" title="Join Blackjack">Join</button> | <button class="button" name="send" value="/leavegame" title="Leave Blackjack">Leave</button>';
		this.spectateButton = '<button class="button" name="send" value="/blackjack spectate" title="Spectate Blackjack">Spectate</button>';
		this.slideButton = '<button class="button" name="send" value="/blackjack slide" title="Slide the game log down in the chat">(<i class="fa fa-arrow-down" aria-hidden="true"></i> slide)</button>';

		this.makeGame(target);
	}

	/**
	 * Game Setup
	 * makeGame - configures required settings for creating a game
	 * makePlayer - adds blackjack-specific properties to player object
	 * sendInvite - called when a game is created, or when a player joins/leaves
	 */
	makeGame(target) {
		if (target) target = parseFloat(target);
		if (isNaN(target) || target <= 0) target = '';
		if (target !== '') {
			this.autostart = setTimeout(() => this.start(), (target * 60000));
		}

		this.sendInvite();
	}
	makePlayer(user) {
		return new BlackjackPlayer(user, this);
	}
	sendInvite() {
		const change = this.uhtmlChange;
		const players = Object.keys(this.playerTable);
		let playerList = [];
		for (let player of players) playerList.push(Chat.escapeHTML(this.playerTable[player].name));
		this.room.send(`|uhtml${change}|blackjack-${this.room.gameNumber}|<div class="infobox${this.infoboxLimited}">${this.createdBy} has created a game of Blackjack. ${this.button}<br /><strong>Players (${players.length}):</strong> ${!players.length ? '(None)' : playerList.join(', ')}</div>`);
		this.uhtmlChange = 'change';
	}

	/**
	 * Joining/Leaving/Viewing
	 * joinGame - joins the game
	 * leaveGame - leaves the game
	 * spectate - spectates the game
	 * unspectate - stops spectating the game
	 */
	joinGame(user) {
		if (!user.named) return this.errorMessage(user, `You must first choose a name to play Blackjack.`);
		if (this.state === 'started') return this.errorMessage(user, `Blackjack has already started.`);
		const joined = this.addPlayer(user);
		if (!joined) {
			this.errorMessage(user, `You are already in this game.`);
			return false;
		}

		this.sendInvite();

		if (Object.keys(this.playerTable).length === this.playerCap) {
			this.start();
		}
		if (this.spectators[user]) delete this.spectators[user]; // prevent player from spectating
		return true;
	}
	leaveGame(user) {
		if (this.state === 'started') return this.errorMessage(user, `You cannot leave this game; it has already started.`);
		if (!this.playerTable[user.id]) return this.errorMessage(user, "You are not in this game to leave.");
		this.removePlayer(user);
		this.sendInvite();
	}
	spectate(user) {
		if (this.spectators[user]) return this.errorMessage(user, `You are already spectating this game.`);
		if (this.playerTable[user]) return this.errorMessage(user, `You don't need to spectate the game; you're playing the game.`);
		this.spectators[user.id] = user.id;
		user.sendTo(this.roomid, `You are now spectating this game.`);
	}
	unspectate(user) {
		if (!this.spectators[user.id]) return this.errorMessage(user, `You are already not spectating this game.`);
		delete this.spectators[user.id];
		user.sendTo(this.roomid, `You are no longer spectating this game.`);
	}

	/**
	 * Utility
	 * errorMessage - sends a user an error message
	 * add - adds/sends text to room
	 * display - displays gameplay to players and spectators
	 * clear - clears a user's gameplay screen
	 * clearAllTimers - clears all possible existing timers pertaining to blackjack
	 * slide - slides the game log down in the chat
	 * onConnect - handles replies to send when a user joins the room, if any
	 * onUpdateConnection - overrides default onUpdateConnection
	 * createTimer - creates a timer with a countdown for a player
	 * generateCard - generates the card for the UI
	 * getWinners - returns an array of the winners and their cards
	 */
	errorMessage(user, message) {
		user.sendTo(this.room, Chat.html`|html|<div class="message-error">${message}</div>`);
	}
	send(message, clean) {
		const change = this.uhtmlChange;
		this.room.send(`|uhtml${change}|blackjack-${this.room.gameNumber}|<div class="infobox${this.infoboxLimited}">${(clean ? message : this.lastMessage + message)}</div>`);
		this.lastMessage += message;
		this.uhtmlChange = 'change';
	}
	display(text, clean, playerName, noChange, end) {
		const force = (end && this.endedBy);
		let change = this.uhtmlChange;
		if (noChange) change = '';
		if (clean) this.lastMessage = '';
		const message = `|uhtml${change}|blackjack-${this.room.gameNumber}|<div class="infobox${this.infoboxLimited}">`;
		this.lastMessage += text;
		if (end) {
			text = `The game of blackjack has ${force ? `been forcibly ended by ${this.endedBy}` : 'ended'}. <details><summary>View turn log</summary>${this.turnLog}</details>${text}`;
			this.lastMessage = '';
		}
		for (let player of Object.keys(this.playerTable)) {
			if (playerName && this.playerTable[player].name === playerName) { // turn highlighting
				this.playerTable[player].gameLog += `<span class="highlighted">${text}</span>`;
				this.playerTable[player].sendRoom(`${message}${end ? text : this.playerTable[player].gameLog}</div>`);
			} else {
				this.playerTable[player].gameLog += text;
				this.playerTable[player].sendRoom(`${message}${end ? text : this.playerTable[player].gameLog}</div>`);
			}
		}
		for (let spectator of Object.keys(this.spectators)) {
			spectator = Users.get(this.spectators[spectator]);
			if (spectator) spectator.sendTo(this.roomid, `${message}${this.lastMessage + text}</div>`);
		}
	}
	clear() {
		const player = this.playerTable[this.curUser];
		if (!player) return; // this should never happen
		player.sendRoom(`|uhtmlchange|user-blackjack-${this.room.gameNumber}|`);
	}
	clearAllTimers() {
		if (this.dqTimer) {
			clearTimeout(this.dqTimer);
			this.dqTimer = null;
		}
		if (this.timerTick) {
			clearInterval(this.timerTick);
			this.timerTick = null;
		}
		if (this.autostart) {
			clearTimeout(this.autostart);
			this.autostart = null;
		}
	}
	slide(user) {
		user.sendTo(this.roomid, `|uhtml|blackjack-${this.room.gameNumber}|`);
		this.display('', null, user.name);
	}
	onConnect(user) {
		const message = `|uhtml|blackjack-${this.room.gameNumber}|<div class="infobox${this.infoboxLimited}">`;
		if (this.state === 'signups') {
			this.sendInvite();
		} else if (this.state === 'started') {
			const player = this.playerTable[user];
			const spectator = this.spectators[user];
			if (player && user.id === toID(this.curUser)) { // their turn; send gamelog and game screen
				player.sendRoom(`${message}${player.gameLog}`);
				player.sendRoom(player.playScreen.replace('|uhtmlchange|', '|uhtml|'));
				return;
			} else if (player) { // a player, but not their turn; just send gamelog
				player.sendRoom(`${message}${player.gameLog}`);
				return;
			} else if (spectator) { // spectator; send gamelog
				user.sendTo(this.roomid, `${message}${this.lastMessage}`);
				return;
			}
		}
	}
	onUpdateConnection() {
		// This happens (runs onConnect) when a connection in the room
		// changes, such as going on a new name. We don't want to do
		// anything for such a situation, so we're overriding this.
	}
	createTimer(player) {
		this.dqTimer = setTimeout(() => {
			let cards = '';
			for (let card of player.cards) cards += `[${card}] `;
			player.status = 'stand';
			this.display(Chat.html`<br /><strong>${player.name}</strong> stands with ${cards} (${player.points}) (Auto-stand: took too long to move)`, null, this.playerTable[this.curUser].name);
			this.clear();
			this.next();
		}, this.turnTimeoutMinutes * 60 * 1000);
		this.timerTick = setInterval(() => {
			let display = player.playScreen.replace('|uhtml|', '|uhtmlchange|');
			if (display !== '') {
				let timeLeft = player.timerTicksLeft - 5;
				let buffer = (String(timeLeft).length === 1 ? '0' : '');
				let half = (timeLeft <= ((this.turnTimeoutMinutes * 60) / 2));
				player.sendRoom(`${display} | <span${half ? ` class="message-error"` : ``}>[<i class="fa fa-hourglass-${half ? 2 : 1}" aria-hidden="true"></i> 0:${buffer}${timeLeft}]</span>`);
				player.timerTicksLeft -= this.timerTickSeconds;
			}
		}, this.timerTickSeconds * 1000);
	}
	generateCard(card) {
		const value = toID(card).toUpperCase();
		const symbol = this.symbols[card.substr(-1)];
		const red = (symbol.charAt(0) === 'H' || symbol.charAt(0) === 'D');
		let cardUI = value;
		if (value === 'K') cardUI = 'King';
		if (value === 'Q') cardUI = 'Queen';
		if (value === 'A') cardUI = 'Ace';
		if (value === 'J') cardUI = 'Joker';
		return `<div title="${cardUI} of ${symbol}" style="color: ${red ? '#992222' : '#000000'}; border-radius: 6px; background-color: #ffffff; position: relative; font-size: 14px; display: inline-block; width: ${this.cardWidth}px; height: ${this.cardHeight}px; border: 1px solid #000000; padding: 2px 4px;">${value}<br /> ${card.substr(-1)}<br /><span style="padding: 2px 4px; position: absolute; bottom: 0; right: 0; transform: rotate(-180deg);">${value}<br />${card.substr(-1)}</span></div> `;
	}
	getWinners(forceend) {
		let winners = [];
		if (forceend) this.giveCard('dealer');
		if (this.dealer.points > 21) {
			for (let player of Object.keys(this.playerTable)) {
				if (this.playerTable[player].status === 'bust') continue;
				winners.push(Chat.html`<strong>${this.playerTable[player].name}</strong> [${this.playerTable[player].cards.join(', ')}]`);
			}
		} else if (this.dealer.points !== 21) {
			for (let player of Object.keys(this.playerTable)) {
				if (this.playerTable[player].status === 'bust' || this.playerTable[player].points <= this.dealer.points) continue;
				winners.push(Chat.html`<strong>${this.playerTable[player].name}</strong> [${this.playerTable[player].cards.join(', ')}]`);
			}
		} else if (this.dealer.points === 21) {
			winners.push(`<strong>${this.dealer.name}</strong> [${this.dealer.cards.join(', ')}]`);
		}
		return winners;
	}

	/**
	 * Game State Changes
	 * start - starts the game
	 * end - ends the game
	 * destroy - destroys the game
	 */
	start(user) {
		const numberOfPlayers = Object.keys(this.playerTable).length;
		if (numberOfPlayers < this.minimumPlayers) {
			if (this.autostart) {
				clearTimeout(this.autostart);
				this.autostart = null;
			}
			this.send("<br />Not enough players to start; game canceled.");
			this.destroy();
			return;
		}
		if (user) this.startedBy = Chat.escapeHTML(user.name);
		this.infoboxLimited = (numberOfPlayers >= this.playerScrollWheel ? ' infobox-limited' : '');
		this.send(`[Blackjack has started. ${this.spectateButton}]`, true, true);

		this.curUser = Object.keys(this.playerTable)[0];

		let header = `The game of blackjack has started${(this.startedBy !== '' ? ` (started by ${this.startedBy})` : ``)}. ${this.slideButton}<br />`;
		this.state = 'started';

		this.giveCard('dealer');
		this.giveCard('dealer');
		this.turnLog += `<strong>${this.dealer.name}</strong>: [${this.dealer.cards[0]}]`;

		for (let player of Object.keys(this.playerTable)) {
			this.giveCard(this.playerTable[player]);
			this.giveCard(this.playerTable[player]);
			this.turnLog += Chat.html`<br /><strong>${this.playerTable[player].name}</strong>: [${this.playerTable[player].cards[0]}] [${this.playerTable[player].cards[1]}] (${this.playerTable[player].points})`;
		}

		this.display(`${header}${this.turnLog}`, true);
		this.next();
	}
	end(user, cmd) {
		const force = (cmd && toID(cmd) === 'forceend');
		if (this.state === 'started' && cmd && !force) return this.errorMessage(user, `Because this game has started, you can only end this game by using /blackjack forceend.`);
		let winners = this.getWinners();
		if (force) {
			winners = this.getWinners(true);
			this.endedBy = Chat.escapeHTML(user.name);
			if (this.curUser) this.playerTable[this.curUser].send(`|uhtmlchange|user-blackjack-${this.room.gameNumber}|`);
			if (winners.length < 1) {
				this.display(`There are no winners this time.`, null, null, null, true);
			} else {
				this.display(`<strong>Winner${Chat.plural(winners.length)}</strong>: ${winners.join(', ')}`, null, null, null, true);
			}
		}

		if (!force && this.state !== 'signups') {
			if (winners.length < 1) {
				this.display(`There are no winners this time.`, null, null, null, true);
			} else {
				this.display(`<strong>Winner${Chat.plural(winners.length)}</strong>: ${winners.join(', ')}`, null, null, null, true);
			}
		} else if (this.state === 'signups') {
			this.send(Chat.html`The game of blackjack has been ended by ${user.name}, and there are no winners because the game never started.`, true);
		}

		this.state = 'ended';

		this.destroy();
		return true;
	}
	destroy() {
		if (Object.keys(this.playerTable).length) {
			for (let player of Object.keys(this.playerTable)) {
				this.playerTable[player].destroy();
			}
		}
		this.clearAllTimers();
		this.room.gameNumber++;
		delete this.room.game;
	}

	/**
	 * Gameplay
	 * hit - player decides to get a new card
	 * stand - player decides to keep current cards
	 * giveCard - gives a player a card from the deck
	 * getCardPoints - returns the point value of a user's cards
	 * next - game goes on to the next turn
	 */
	hit(user) {
		if (this.state !== 'started') return this.errorMessage(user, `Blackjack hasn't started yet.`);
		if (!this.playerTable[user]) return this.errorMessage(user, `You aren't a player in this game.`);
		if (this.curUser !== user.id) return this.errorMessage(user, `It's not your turn.`);
		this.playerTable[user].selfUhtml = 'change';
		this.playerTable[user].resetTimerTicks();

		this.giveCard(user);
	}
	stand(user) {
		const player = this.playerTable[user];
		if (this.state !== 'started') return this.errorMessage(user, `Blackjack hasn't started yet.`);
		if (!player) return this.errorMessage(user, `You aren't a player in this game.`);
		if (this.curUser !== user.id) return this.errorMessage(user, `It's not your turn.`);
		player.status = 'stand';
		let cards = '';
		for (let card of player.cards) cards += `[${card}] `;
		let turnLine = Chat.html`<br /><strong>${player.name}</strong> stands with ${cards} (${player.points}${player.points === 21 ? ' - blackjack!' : ''})`;

		this.turnLog += turnLine;
		this.display(turnLine, null, player.name);
		this.clear();

		this.next();
	}
	giveCard(user) {
		if (this.deck.length < 1) this.deck = new BlackjackDeck().shuffle();
		const player = (user === 'dealer' ? this.dealer : this.playerTable[user]);
		if (!player) return; // this should never happen
		player.cards.push(this.deck[0]);

		this.deck.shift();

		if (this.deck.length === 0) {
			this.display(`<br />${this.dealer.name} has ran out of cards in the deck; shuffling a new deck...`);
			this.deck = new BlackjackDeck().shuffle();
		}

		player.points = this.getCardPoints(player);

		if (player.cards.length < 3) return;

		let turnLine = Chat.html`<br /><strong>${player.name}</strong> hit and received [${player.cards[player.cards.length - 1]}] (${player.points})`;
		this.turnLog += turnLine;
		if (player.cards.length > 2) this.display(turnLine, null, player.name);

		if (player === this.dealer) {
			if (player.points > 21) {
				let cards = '';
				for (let card of player.cards) cards += `[${card}] `;
				let turnLine = Chat.html`<br /><strong>${this.dealer.name}</strong> has busted with ${cards} (${player.points})`;
				this.turnLog += turnLine;
				this.display(turnLine);
				this.end();
				return;
			} else if (player.points === 21) {
				let turnLine = Chat.html`<br /><strong>${this.dealer.name}</strong> has blackjack!`;
				this.turnLog += turnLine;
				this.display(turnLine);
				this.end();
				return;
			}
		} else if (player.points > 21) {
			player.status = 'bust';
			let cards = '';
			for (let card of player.cards) cards += `[${card}] `;
			let turnLine = Chat.html`<br /><strong>${player.name}</strong> has busted with ${cards} (${player.points})`;
			this.turnLog += turnLine;
			this.display(turnLine, null, player.name);
			this.clear();
		} else if (player.points === 21) {
			player.status = 'stand';
			let turnLine = Chat.html`<br /><strong>${player.name}</strong> has blackjack!`;
			this.turnLog += turnLine;
			this.display(turnLine, null, player.name);
			this.clear();
		}
		if (user !== 'dealer') this.playerTable[user].cards = player.cards;
		this.next();
	}
	getCardPoints(player) {
		let points = 0;
		let aceCount = 0;
		for (let card of player.cards) {
			card = toID(card).toUpperCase();
			if (!isNaN(Number(card))) {
				points += Number(card);
			} else if (['K', 'Q', 'J'].includes(card)) {
				points += 10;
			} else if (card === 'A') {
				points += 11;
				aceCount++;
			}
		}

		// At first, we value aces as 11, however, we will change their value
		// to be 1 if having them as 11 would cause an unnecessary bust. We will
		// do this by subtracting 10 for each ace that would otherwise cause a bust.
		while (points > 21 && aceCount > 0) {
			points -= 10;
			aceCount--;
		}

		return points;
	}
	next() {
		this.clearAllTimers();
		if (Object.keys(this.playerTable)[Object.keys(this.playerTable).length - 1] === this.curUser && this.playerTable[this.curUser].status !== 'playing') {
			if (this.dealer.points < 17) {
				this.giveCard('dealer');
			} else if (this.dealer.points >= 17) {
				let cards = '';
				for (let card of this.dealer.cards) cards += `[${card}] `;
				let turnLine = `<br /><strong>${this.dealer.name}</strong> stands with ${cards} (${this.dealer.points})`;
				this.turnLog += turnLine;
				this.display(turnLine);
				this.end();
			}
			return;
		}
		if (this.playerTable[this.curUser].status !== 'playing') {
			let number = 0;
			while (this.playerTable[Object.keys(this.playerTable)[number]].status !== 'playing') number++;
			this.curUser = Object.keys(this.playerTable)[number];
		}
		let output = `|uhtml${this.playerTable[this.curUser].selfUhtml}|user-blackjack-${this.room.gameNumber}|<div class="infobox" style="line-height: 20px;">`;
		output += `It's your turn to move, ${this.playerTable[this.curUser].name}<br />`;
		for (let card of this.playerTable[this.curUser].cards) {
			output += this.generateCard(card);
		}
		output += `<br />Score: ${this.playerTable[this.curUser].points}${(this.playerTable[this.curUser].points === 21 ? ` (you have blackjack!)` : ``)}`;
		output += `<br /><button class="button" name="send" value="/blackjack hit" title="Hit (get another card)">Hit</button> | <button class="button" name="send" value="/blackjack stand" title="Stand (just keep these cards)">Stand</button>`;

		this.playerTable[this.curUser].sendRoom(`|notify|Blackjack (${this.room.title})|It's your turn to play!`);
		this.playerTable[this.curUser].sendRoom(output);
		this.playerTable[this.curUser].playScreen = output;

		this.createTimer(this.playerTable[this.curUser]);
	}
}

class BlackjackPlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);
		this.game = game;

		this.cards = [];
		this.points = 0;
		this.slide = 0;
		this.status = 'playing';

		this.selfUhtml = '';
		this.gameLog = '';
		this.playScreen = '';
		this.timerTicksLeft = this.game.turnTimeoutMinutes * 60; // to get into seconds-format
	}
	resetTimerTicks() {
		this.timerTicksLeft = this.game.turnTimeoutMinutes * 60;
	}
}

class BlackjackDealer {
	constructor() {
		this.cards = [];
		this.points = 0;
		this.name = 'The Dealer';
	}
}

class BlackjackDeck {
	constructor() {
		this.deck = [
			'A♥', 'A♦', 'A♣', 'A♠', '2♥', '2♦', '2♣', '2♠', '3♥', '3♦', '3♣',
			'3♠', '4♥', '4♦', '4♣', '4♠', '5♥', '5♦', '5♣', '5♠', '6♥', '6♦', '6♣', '6♠',
			'7♥', '7♦', '7♣', '7♠', '8♥', '8♦', '8♣', '8♠', '9♥', '9♦', '9♣', '9♠', '10♥',
			'10♦', '10♣', '10♠', 'J♥', 'J♦', 'J♣', 'J♠', 'Q♥', 'Q♦', 'Q♣', 'Q♠', 'K♥', 'K♦',
			'K♣', 'K♠',
		];
	}
	shuffle() {
		return Dex.shuffle(this.deck);
	}
}

exports.commands = {
	blj: 'blackjack',
	blackjack: {
		new: 'create',
		create(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			if (room.game) return this.errorReply("There is already a game running in this room.");
			if (room.blackjackDisabled) return this.errorReply("Blackjack is currently disabled in this room.");

			this.privateModAction(`(A game of blackjack was created by ${user.name}.)`);
			this.modlog(`BLACKJACK CREATE`);
			room.game = new Blackjack(room, user, target);
		},
		start(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");
			if (room.game.state !== 'signups') return this.errorReply("This game of blackjack has already started.");

			this.privateModAction(`(The game of blackjack was started by ${user.name}.)`);
			this.modlog(`BLACKJACK START`);
			room.game.start(user);
		},
		forceend: 'end',
		end(target, room, user, connection, cmd) {
			if (!this.can('minigame', null, room)) return;
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");
			const force = cmd === 'forceend' ? 'forcibly ' : '';

			const end = room.game.end(user, cmd);
			if (end) {
				this.privateModAction(`(The game of blackjack was ${force}ended by ${user.name}.)`);
				this.modlog(`BLACKJACK END`);
			}
		},
		hit(target, room, user) {
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");

			room.game.hit(user);
		},
		stand(target, room, user) {
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");

			room.game.stand(user);
		},
		slide(target, room, user) { // undocumented (used in UI)
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");

			room.game.slide(user);
		},
		j: 'join',
		join(target, room, user) {
			return this.parse('/joingame');
		},
		l: 'leave',
		leave(target, room, user) {
			return this.parse('/leavegame');
		},
		unspectate: 'spectate',
		spectate(target, room, user, connection, cmd) {
			if (!room.game || !room.game.blackjack) return this.errorReply("There is no game of blackjack currently ongoing in this room.");

			if (cmd === 'spectate') {
				room.game.spectate(user);
			} else if (cmd === 'unspectate') {
				room.game.unspectate(user);
			}
		},
		disable(target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (room.blackjackDisabled) return this.errorReply("Blackjack is already disabled in this room.");
			room.blackjackDisabled = true;
			this.privateModAction(`(${user.name} disabled games of blackjack in this room.)`);

			if (room.chatRoomData) {
				room.chatRoomData.blackjackDisabled = room.blackjackDisabled;
				Rooms.global.writeChatRoomData();
			}
		},
		enable(target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (!room.blackjackDisabled) return this.errorReply("Blackjack is already enabled in this room.");
			room.blackjackDisabled = false;
			this.privateModAction(`(${user.name} enabled games of blackjack in this room.)`);

			if (room.chatRoomData) {
				room.chatRoomData.blackjackDisabled = room.blackjackDisabled;
				Rooms.global.writeChatRoomData();
			}
		},
		'': 'help',
		help(target, room, user) {
			return this.parse('/help blackjack');
		},
	},
	blackjackhelp: [
		"/blackjack create - Creates a game of blackjack. Requires: % @ # & ~",
		"/blackjack create [autostart] - Automatically creates a game of blackjack in [autostart] minutes. Requires: % @ # & ~",
		"/blackjack start - Starts a game of blackjack. Requires: % @ # & ~",
		"/blackjack end - Ends a game of blackjack. Requires: % @ # & ~",
		"/blackjack join - Joins a game of blackjack.",
		"/blackjack leave - Leaves a game of blackjack.",
		"/blackjack spectate - Spectates a game of blackjack.",
		"/blackjack unspectate - Stops spectating a game of blackjack.",
		"/blackjack disable - Prevents games of blackjack from being made in the room. Requires: # & ~",
		"/blackjack enable - Allows games of blackjack to be made in the room. Requires: # & ~",
	],
};
exports.roomSettings = room => ({
	label: "Blackjack",
	permission: 'editroom',
	options: [
		[`disabled`, room.blackjackDisabled || 'blackjack disable'],
		[`enabled`, !room.blackjackDisabled || 'blackjack enable'],
	],
});
