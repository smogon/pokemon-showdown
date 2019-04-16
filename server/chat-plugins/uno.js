/**
 * UNO
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin allows rooms to run games of scripted UNO
 *
 * @license MIT license
 */

'use strict';

const maxTime = 60; // seconds

const rgbGradients = {
	'Green': "rgba(0, 122, 0, 1), rgba(0, 185, 0, 0.9)",
	'Yellow': "rgba(255, 225, 0, 1), rgba(255, 255, 85, 0.9)",
	'Blue': "rgba(40, 40, 255, 1), rgba(125, 125, 255, 0.9)",
	'Red': "rgba(255, 0, 0, 1), rgba(255, 125, 125, 0.9)",
	'Black': "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.55)",
};

const textColors = {
	'Green': "rgb(0, 128, 0)",
	'Yellow': "rgb(175, 165, 40)",
	'Blue': "rgb(75, 75, 255)",
	'Red': "rgb(255, 0, 0)",
	'Black': 'inherit',
};

const textShadow = 'text-shadow: 1px 0px black, -1px 0px black, 0px -1px black, 0px 1px black, 2px -2px black;';

/** @typedef {'Green' | 'Yellow' | 'Red' | 'Blue' | 'Black'} Color */
/** @typedef {{value: string, color: Color, changedColor?: Color, name: string}} Card */

/**
 * @param {Card} card
 * @param {boolean} fullsize
 * @return {string}
 */
function cardHTML(card, fullsize) {
	let surface = card.value.replace(/[^A-Z0-9+]/g, "");
	let background = rgbGradients[card.color];
	if (surface === 'R') surface = '<i class="fa fa-refresh" aria-hidden="true"></i>';

	return `<button class="button" style="font-size: 14px; font-weight: bold; color: white; ${textShadow} padding-bottom: 117px; text-align: left; height: 135px; width: ${fullsize ? '72' : '37'}px; border-radius: 10px 2px 2px 3px; color: white; background: ${card.color}; background: -webkit-linear-gradient(${background}); background: -o-linear-gradient(${background}); background: -moz-linear-gradient(${background}); background: linear-gradient(${background})" name=send value="/uno play ${card.name}" aria-label="${card.name}">${surface}</button>`;
}

/**
 * @return {Card[]}
 */
function createDeck() {
	/** @type {Color[]} */
	const colors = ['Red', 'Blue', 'Green', 'Yellow'];
	const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Reverse', 'Skip', '+2'];

	let basic = /** @type {Card[]} */ ([]);

	for (const color of colors) {
		basic.push(...values.map(v => {
			/** @type {Card} */
			let c = {value: v, color: color, name: color + " " + v};
			return c;
		}));
	}

	return [
		// two copies of the basic stuff (total 96)
		...basic,
		...basic,
		// The four 0s
		...[0, 1, 2, 3].map(v => {
			/** @type {Card} */
			let c = {color: colors[v], value: '0', name: colors[v] + ' 0'};
			return c;
		}),
		 // Wild cards
		...[0, 1, 2, 3].map(v => {
			/** @type {Card} */
			let c = {color: 'Black', value: 'Wild', name: 'Wild'};
			return c;
		}),
		// Wild +4 cards
		...[0, 1, 2, 3].map(v => {
			/** @type {Card} */
			let c = {color: 'Black', value: '+4', name: 'Wild +4'};
			return c;
		}),
	]; // 108 cards
}

class UnoGame extends Rooms.RoomGame {
	/**
	 * @param {ChatRoom | GameRoom} room
	 * @param {number} cap
	 * @param {boolean} suppressMessages
	 */
	constructor(room, cap, suppressMessages) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		/** @type {number} */
		this.playerCap = cap;
		this.allowRenames = true;
		/** @type {number} */
		this.maxTime = maxTime;
		/** @type {NodeJS.Timer?} */
		this.timer = null;
		/** @type {NodeJS.Timer?} */
		this.autostartTimer = null;

		/** @type {string} */
		this.gameid = 'uno';
		this.title = 'UNO';

		/** @type {string} */
		this.state = 'signups';

		/** @type {string} */
		this.currentPlayerid = '';
		/** @type {Card[]} */
		this.deck = Dex.shuffle(createDeck());
		/** @type {Card[]} */
		this.discards = [];
		/** @type {Card?} */
		this.topCard = null;
		/** @type {string?} */
		this.awaitUno = null;
		/** @type {string?} */
		this.unoId = null;

		this.direction = 1;

		this.suppressMessages = suppressMessages || false;
		this.spectators = Object.create(null);

		this.sendToRoom(`|uhtml|uno-${this.room.gameNumber}|<div class="broadcast-green"><p style="font-size: 14pt; text-align: center">A new game of <strong>UNO</strong> is starting!</p><p style="font-size: 9pt; text-align: center"><button name="send" value="/uno join">Join</button><br />Or use <strong>/uno join</strong> to join the game.</p>${(this.suppressMessages ? `<p style="font-size: 6pt; text-align: center">Game messages will be shown to only players.  If you would like to spectate the game, use <strong>/uno spectate</strong></p>` : '')}</div>`, true);
	}

	onUpdateConnection() {}

	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onConnect(user, connection) {
		if (this.state === 'signups') {
			connection.sendTo(this.room, `|uhtml|uno-${this.room.gameNumber}|<div class="broadcast-green"><p style="font-size: 14pt; text-align: center">A new game of <strong>UNO</strong> is starting!</p><p style="font-size: 9pt; text-align: center"><button name="send" value="/uno join">Join</button><br />Or use <strong>/uno join</strong> to join the game.</p>${(this.suppressMessages ? `<p style="font-size: 6pt; text-align: center">Game messages will be shown to only players.  If you would like to spectate the game, use <strong>/uno spectate</strong></p>` : '')}</div>`);
		} else if (this.onSendHand(user) === false) {
			connection.sendTo(this.room, `|uhtml|uno-${this.room.gameNumber}|<div class="infobox"><p>A UNO game is currently in progress.</p>${(this.suppressMessages ? `<p style="font-size: 6pt">Game messages will be shown to only players.  If you would like to spectate the game, use <strong>/uno spectate</strong></p>` : '')}</div>`);
		}
	}

	/**
	 * @return {false | void}
	 */
	onStart() {
		if (this.playerCount < 2) return false;
		if (this.autostartTimer) clearTimeout(this.autostartTimer);
		this.sendToRoom(`|uhtmlchange|uno-${this.room.gameNumber}|<div class="infobox"><p>The game of UNO has started.</p>${(this.suppressMessages ? `<p style="font-size: 6pt">Game messages will be shown to only players.  If you would like to spectate the game, use <strong>/uno spectate</strong></p>` : '')}</div>`, true);
		this.state = 'play';

		this.onNextPlayer(); // determines the first player

		// give cards to the players
		for (let i in this.players) {
			this.players[i].hand.push(...this.drawCard(7));
		}

		// top card of the deck.
		do {
			this.topCard = this.drawCard(1)[0];
			this.discards.unshift(this.topCard);
		} while (this.topCard.color === 'Black');

		this.sendToRoom(`|raw|The top card is <span style="color: ${textColors[this.topCard.color]}">${this.topCard.name}</span>.`);

		this.onRunEffect(this.topCard.value, true);
		this.nextTurn(true);
	}

	/**
	 * @param {User} user
	 * @return {boolean}
	 */
	joinGame(user) {
		if (this.state === 'signups' && this.addPlayer(user)) {
			this.sendToRoom(`${user.name} has joined the game of UNO.`);
			return true;
		}
		return false;
	}

	/**
	 * @param {User} user
	 * @return {boolean}
	 */
	leaveGame(user) {
		if (this.state === 'signups' && this.removePlayer(user)) {
			this.sendToRoom(`${user.name} has left the game of UNO.`);
			return true;
		}
		return false;
	}

	/**
	 * Overwrite the default makePlayer so it makes an UnoGamePlayer instead.
	 * @param {User} user
	 * @return {UnoGamePlayer}
	 */
	makePlayer(user) {
		return new UnoGamePlayer(user, this);
	}

	/**
	 * @param {User} user
	 * @param {string} oldUserid
	 * @param {boolean} isJoining
	 * @param {boolean} isForceRenamed
	 * @return {false | void}
	 */
	onRename(user, oldUserid, isJoining, isForceRenamed) {
		if (!(oldUserid in this.players) || user.userid === oldUserid) return false;
		if (!user.named && !isForceRenamed) {
			user.games.delete(this.id);
			user.updateSearch();
			return; // dont set users to their guest accounts.
		}
		this.players[user.userid] = this.players[oldUserid];
		if (user.userid !== oldUserid) delete this.players[oldUserid]; // only run if it's a rename that involves a change of userid

		// update the user's name information
		this.players[user.userid].name = user.name;
		this.players[user.userid].userid = user.userid;
		if (this.awaitUno && this.awaitUno === oldUserid) this.awaitUno = user.userid;

		if (this.currentPlayerid === oldUserid) this.currentPlayerid = user.userid;
	}

	/**
	 * @param {string} userid
	 * @return {string | false}
	 */
	eliminate(userid) {
		if (!(userid in this.players)) return false;

		let name = this.players[userid].name;

		if (this.playerCount === 2) {
			this.removePlayer(this.players[userid]);
			this.onWin(this.players[Object.keys(this.players)[0]]);
			return name;
		}

		// handle current player...
		if (userid === this.currentPlayerid) {
			if (this.state === 'color') {
				if (!this.topCard) {
					// should never happen
					throw new Error(`No top card in the discard pile.`);
				}
				this.topCard.changedColor = this.discards[1].changedColor || this.discards[1].color;
				this.sendToRoom(`|raw|${Chat.escapeHTML(name)} has not picked a color, the color will stay as <span style="color: ${textColors[this.topCard.changedColor]}">${this.topCard.changedColor}</span>.`);
			}

			if (this.timer) clearTimeout(this.timer);
			this.nextTurn();
		}
		if (this.awaitUno === userid) this.awaitUno = null;

		// put that player's cards into the discard pile to prevent cards from being permanently lost
		this.discards.push(...this.players[userid].hand);

		this.removePlayer(this.players[userid]);
		return name;
	}

	/**
	 * @param {string} msg
	 * @param {boolean} [overrideSuppress]
	 */
	sendToRoom(msg, overrideSuppress = false) {
		if (!this.suppressMessages || overrideSuppress) {
			this.room.add(msg).update();
		} else {
			// send to the players first
			for (let i in this.players) {
				this.players[i].sendRoom(msg);
			}

			// send to spectators
			for (let i in this.spectators) {
				if (i in this.players) continue; // don't double send to users already in the game.
				let user = Users.getExact(i);
				if (user) user.sendTo(this.id, msg);
			}
		}
	}

	/**
	 * @param {boolean} [showCards]
	 * @return {string[]}
	 */
	getPlayers(showCards) {
		let playerList = Object.keys(this.players);
		if (!showCards) {
			return playerList.sort().map(id => Chat.escapeHTML(this.players[id].name));
		}
		if (this.direction === -1) playerList = playerList.reverse();
		return playerList.map(id => `${(this.currentPlayerid === id ? '<strong>' : '')}${Chat.escapeHTML(this.players[id].name)} (${this.players[id].hand.length}) ${(this.currentPlayerid === id ? '</strong>' : "")}`);
	}

	/**
	 * @return {Promise}
	 */
	onAwaitUno() {
		return new Promise((resolve, reject) => {
			if (!this.awaitUno) return resolve();

			this.state = "uno";
			// the throttle for sending messages is at 600ms for non-authed users,
			// wait 750ms before sending the next person's turn.
			// this allows games to be fairer, so the next player would not spam the pass command blindly
			// to force the player to draw 2 cards.
			// this also makes games with uno bots not always turn in the bot's favour.
			// without a delayed turn, 3 bots playing will always result in a endless game
			setTimeout(() => resolve(), 750);
		});
	}

	/**
	 * @param {boolean} [starting]
	 */
	nextTurn(starting) {
		this.onAwaitUno()
			.then(() => {
				if (!starting) this.onNextPlayer();

				if (this.timer) clearTimeout(this.timer);
				let player = this.players[this.currentPlayerid];

				this.sendToRoom(`|c:|${(Math.floor(Date.now() / 1000))}|~|${player.name}'s turn.`);
				this.state = 'play';
				if (player.cardLock) player.cardLock = null;
				player.sendDisplay();

				this.timer = setTimeout(() => {
					this.sendToRoom(`${player.name} has been automatically disqualified.`);
					this.eliminate(this.currentPlayerid);
				}, this.maxTime * 1000);
			});
	}

	onNextPlayer() {
		// if none is set
		if (!this.currentPlayerid) {
			let userList = Object.keys(this.players);
			this.currentPlayerid = userList[Math.floor(this.playerCount * Math.random())];
		}

		this.currentPlayerid = this.getNextPlayer();
	}

	/**
	 * @return {string}
	 */
	getNextPlayer() {
		let userList = Object.keys(this.players);

		let player = userList[(userList.indexOf(this.currentPlayerid) + this.direction)];

		if (!player) {
			player = this.direction === 1 ? userList[0] : userList[this.playerCount - 1];
		}
		return player;
	}

	/**
	 * @param {UnoGamePlayer} player
	 * @return {boolean | void}
	 */
	onDraw(player) {
		if (this.currentPlayerid !== player.userid || this.state !== 'play') return false;
		if (player.cardLock) return true;

		this.onCheckUno();

		this.sendToRoom(`${player.name} has drawn a card.`);

		let card = this.onDrawCard(player, 1);
		player.sendDisplay();
		player.cardLock = card[0].name;
	}

	/**
	 * @param {UnoGamePlayer} player
	 * @param {string} cardName
	 * @return {false | string | void}
	 */
	onPlay(player, cardName) {
		if (this.currentPlayerid !== player.userid || this.state !== 'play') return false;

		let card = player.hasCard(cardName);
		if (!card) return "You do not have that card.";

		// check for legal play
		if (!this.topCard) {
			// should never happen
			throw new Error(`No top card in the discard pile.`);
		}
		if (player.cardLock && player.cardLock !== cardName) return `You can only play ${player.cardLock} after drawing.`;
		if (card.color !== 'Black' && card.color !== (this.topCard.changedColor || this.topCard.color) && card.value !== this.topCard.value) return `You cannot play this card - you can only play: Wild cards, ${(this.topCard.changedColor ? 'and' : '')} ${(this.topCard.changedColor || this.topCard.color)} cards${this.topCard.changedColor ? "" : ` and ${this.topCard.value}'s`}.`;
		if (card.value === '+4' && !player.canPlayWildFour()) return "You cannot play Wild +4 when you still have a card with the same color as the top card.";

		if (this.timer) clearTimeout(this.timer); // reset the autodq timer.

		this.onCheckUno();

		// update the game information.
		this.topCard = card;
		player.removeCard(cardName);
		this.discards.unshift(card);

		// update the unoId here, so when the display is sent to the player when the play is made
		if (player.hand.length === 1) {
			this.awaitUno = player.userid;
			this.unoId = Math.floor(Math.random() * 100).toString();
		}

		player.sendDisplay(); // update display without the card in it for purposes such as choosing colors

		this.sendToRoom(`|raw|${Chat.escapeHTML(player.name)} has played a <span style="color: ${textColors[card.color]}">${card.name}</span>.`);

		// handle hand size
		if (!player.hand.length) {
			this.onWin(player);
			return;
		}

		// continue with effects and next player
		this.onRunEffect(card.value);
		if (this.state === 'play') this.nextTurn();
	}

	/**
	 * @param {string} value
	 * @param {boolean} [initialize]
	 */
	onRunEffect(value, initialize) {
		const colorDisplay = `|uhtml|uno-hand|<table style="width: 100%; border: 1px solid black"><tr><td style="width: 50%"><button style="width: 100%; background-color: red; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px" name=send value="/uno color Red">Red</button></td><td style="width: 50%"><button style="width: 100%; background-color: blue; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; color: white; padding: 5px" name=send value="/uno color Blue">Blue</button></td></tr><tr><td style="width: 50%"><button style="width: 100%; background-color: green; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px" name=send value="/uno color Green">Green</button></td><td style="width: 50%"><button style="width: 100%; background-color: yellow; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px" name=send value="/uno color Yellow">Yellow</button></td></tr></table>`;

		switch (value) {
		case 'Reverse':
			this.direction *= -1;
			this.sendToRoom("The direction of the game has changed.");
			if (!initialize && this.playerCount === 2) this.onNextPlayer(); // in 2 player games, reverse sends the turn back to the player.
			break;
		case 'Skip':
			this.onNextPlayer();
			this.sendToRoom(this.players[this.currentPlayerid].name + "'s turn has been skipped.");
			break;
		case '+2':
			this.onNextPlayer();
			this.sendToRoom(this.players[this.currentPlayerid].name + " has been forced to draw 2 cards.");
			this.onDrawCard(this.players[this.currentPlayerid], 2);
			break;
		case '+4':
			this.players[this.currentPlayerid].sendRoom(colorDisplay);
			this.state = 'color';
			// apply to the next in line, since the current player still has to choose the color
			let next = this.getNextPlayer();
			this.sendToRoom(this.players[next].name + " has been forced to draw 4 cards.");
			this.onDrawCard(this.players[next], 4);
			this.isPlusFour = true;
			this.timer = setTimeout(() => {
				this.sendToRoom(`${this.players[this.currentPlayerid].name} has been automatically disqualified.`);
				this.eliminate(this.currentPlayerid);
			}, this.maxTime * 1000);
			break;
		case 'Wild':
			this.players[this.currentPlayerid].sendRoom(colorDisplay);
			this.state = 'color';
			this.timer = setTimeout(() => {
				this.sendToRoom(`${this.players[this.currentPlayerid].name} has been automatically disqualified.`);
				this.eliminate(this.currentPlayerid);
			}, this.maxTime * 1000);
			break;
		}
		if (initialize) this.onNextPlayer();
	}

	/**
	 * @param {UnoGamePlayer} player
	 * @param {Color} color
	 * @return {false | void}
	 */
	onSelectColor(player, color) {
		if (!['Red', 'Blue', 'Green', 'Yellow'].includes(color) || player.userid !== this.currentPlayerid || this.state !== 'color') return false;
		if (!this.topCard) {
			// should never happen
			throw new Error(`No top card in the discard pile.`);
		}
		this.topCard.changedColor = color;
		this.sendToRoom(`The color has been changed to ${color}.`);
		if (this.timer) clearTimeout(this.timer);

		// send the display of their cards again
		player.sendDisplay();

		if (this.isPlusFour) {
			this.isPlusFour = false;
			this.onNextPlayer(); // handle the skipping here.
		}

		this.nextTurn();
	}

	/**
	 * @param {UnoGamePlayer} player
	 * @param {number} count
	 * @return {Card[]}
	 */
	onDrawCard(player, count) {
		if (typeof count === 'string') count = parseInt(count);
		if (!count || isNaN(count) || count < 1) count = 1;
		let drawnCards = /** @type {Card[]} */ (this.drawCard(count));

		player.hand.push(...drawnCards);
		player.sendRoom(`|raw|You have drawn the following card${Chat.plural(drawnCards)}: ${drawnCards.map(card => `<span style="color: ${textColors[card.color]}">${card.name}</span>`).join(', ')}.`);
		return drawnCards;
	}

	/**
	 * @param {number} count
	 * @return {Card[]}
	 */
	drawCard(count) {
		if (typeof count === 'string') count = parseInt(count);
		if (!count || isNaN(count) || count < 1) count = 1;
		let drawnCards = /** @type {Card[]} */ ([]);

		for (let i = 0; i < count; i++) {
			if (!this.deck.length) {
				this.deck = this.discards.length ? Dex.shuffle(this.discards) : Dex.shuffle(createDeck()); // shuffle the cards back into the deck, or if there are no discards, add another deck into the game.
				this.discards = []; // clear discard pile
			}
			drawnCards.push(this.deck[this.deck.length - 1]);
			this.deck.pop();
		}
		return drawnCards;
	}

	/**
	 * @param {UnoGamePlayer} player
	 * @param {string} unoId
	 * @return {false | void}
	 */
	onUno(player, unoId) {
		// uno id makes spamming /uno uno impossible
		if (this.unoId !== unoId || player.userid !== this.awaitUno) return false;
		this.sendToRoom(Chat.html`|raw|<strong>UNO!</strong> ${player.name} is down to their last card!`);
		this.awaitUno = null;
		this.unoId = null;
	}

	onCheckUno() {
		if (this.awaitUno) {
			// if the previous player hasn't hit UNO before the next player plays something, they are forced to draw 2 cards;
			if (this.awaitUno !== this.currentPlayerid) {
				this.sendToRoom(`${this.players[this.awaitUno].name} forgot to say UNO! and is forced to draw 2 cards.`);
				this.onDrawCard(this.players[this.awaitUno], 2);
			}
			this.awaitUno = null;
			this.unoId = null;
		}
	}

	/**
	 * @param {User} user
	 * @return {false | void}
	 */
	onSendHand(user) {
		if (!(user.userid in this.players) || this.state === 'signups') return false;

		this.players[user.userid].sendDisplay();
	}

	/**
	 * @param {UnoGamePlayer} player
	 */
	onWin(player) {
		this.sendToRoom(Chat.html`|raw|<div class="broadcast-green">Congratulations to ${player.name} for winning the game of UNO!</div>`, true);
		this.destroy();
	}

	destroy() {
		if (this.timer) clearTimeout(this.timer);
		if (this.autostartTimer) clearTimeout(this.autostartTimer);
		this.sendToRoom(`|uhtmlchange|uno-${this.room.gameNumber}|<div class="infobox">The game of UNO has ended.</div>`, true);

		// deallocate games for each player.
		for (let i in this.players) {
			this.players[i].destroy();
		}
		delete this.room.game;
	}
}

class UnoGamePlayer extends Rooms.RoomGamePlayer {
	/**
	 * @param {User} user
	 * @param {UnoGame} game
	 */
	constructor(user, game) {
		super(user, game);
		this.hand = /** @type {Card[]} */ ([]);
		this.game = game;
		/** @type {string?} */
		this.cardLock = null;
	}

	/**
	 * @return {boolean}
	 */
	canPlayWildFour() {
		if (!this.game.topCard) {
			// should never happen
			throw new Error(`No top card in the discard pile.`);
		}
		let color = (this.game.topCard.changedColor || this.game.topCard.color);

		if (this.hand.some(c => c.color === color)) return false;
		return true;
	}

	/**
	 * @param {string} cardName
	 */
	hasCard(cardName) {
		return this.hand.find(card => card.name === cardName);
	}

	/**
	 * @param {string} cardName
	 */
	removeCard(cardName) {
		for (const [i, card] of this.hand.entries()) {
			if (card.name === cardName) {
				this.hand.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * @return {string[]}
	 */
	buildHand() {
		return this.hand.sort((a, b) => a.color.localeCompare(b.color) || a.value.localeCompare(b.value))
			.map((c, i) => cardHTML(c, i === this.hand.length - 1));
	}

	sendDisplay() {
		let hand = this.buildHand().join('');
		let players = `<p><strong>Players (${this.game.playerCount}):</strong></p>${this.game.getPlayers(true).join('<br />')}`;
		let draw = '<button class="button" style="width: 45%; background: rgba(0, 0, 255, 0.05)" name=send value="/uno draw">Draw a card!</button>';
		let pass = '<button class="button" style=" width: 45%; background: rgba(255, 0, 0, 0.05)" name=send value="/uno pass">Pass!</button>';
		let uno = `<button class="button" style=" width: 90%; background: rgba(0, 255, 0, 0.05); height: 30px; margin-top: 2px;" name=send value="/uno uno ${this.game.unoId || '0'}">UNO!</button>`;

		if (!this.game.topCard) {
			// should never happen
			throw new Error(`No top card in the discard pile.`);
		}
		let top = `<strong>Top Card: <span style="color: ${textColors[this.game.topCard.changedColor || this.game.topCard.color]}">${this.game.topCard.name}</span></strong>`;

		// clear previous display and show new display
		this.sendRoom("|uhtmlchange|uno-hand|");
		this.sendRoom(
			`|uhtml|uno-hand|<div style="border: 1px solid skyblue; padding: 0 0 5px 0"><table style="width: 100%; table-layout: fixed; border-radius: 3px"><tr><td colspan=4 rowspan=2 style="padding: 5px"><div style="overflow-x: auto; white-space: nowrap; width: 100%">${hand}</div></td>${this.game.currentPlayerid === this.userid ? `<td colspan=2 style="padding: 5px 5px 0 5px">${top}</td></tr>` : ""}` +
			`<tr><td colspan=2 style="vertical-align: top; padding: 0px 5px 5px 5px"><div style="overflow-y: scroll">${players}</div></td></tr></table>` +
			`${this.game.currentPlayerid === this.userid ? `<div style="text-align: center">${draw}${pass}<br />${uno}</div>` : ""}</div>`
		);
	}
}

/** @type {ChatCommands} */
const commands = {
	uno: {
		// roomowner commands
		off: 'disable',
		disable(target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (room.unoDisabled) {
				return this.errorReply("UNO is already disabled in this room.");
			}
			room.unoDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.unoDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("UNO has been disabled for this room.");
		},

		on: 'enable',
		enable(target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (!room.unoDisabled) {
				return this.errorReply("UNO is already enabled in this room.");
			}
			delete room.unoDisabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.unoDisabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("UNO has been enabled for this room.");
		},

		// moderation commands
		new: 'create',
		make: 'create',
		createpublic: 'create',
		makepublic: 'create',
		createprivate: 'create',
		makeprivate: 'create',
		create(target, room, user, connection, cmd) {
			if (!this.can('minigame', null, room)) return;
			if (room.unoDisabled) return this.errorReply("UNO is currently disabled for this room.");
			if (room.game) return this.errorReply("There is already a game in progress in this room.");

			let suppressMessages = cmd.includes('private') || !(cmd.includes('public') || room.id === 'gamecorner');

			let cap = parseInt(target);
			if (isNaN(cap)) cap = 6;
			if (cap < 2) cap = 2;
			room.game = new UnoGame(room, cap, suppressMessages);
			this.privateModAction(`(A game of UNO was created by ${user.name}.)`);
			this.modlog('UNO CREATE');
		},

		start(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno' || game.state !== 'signups') return this.errorReply("There is no UNO game in signups phase in this room.");
			if (game.onStart()) {
				this.privateModAction(`(The game of UNO was started by ${user.name}.)`);
				this.modlog('UNO START');
			}
		},

		stop: 'end',
		end(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room.");
			room.game.destroy();
			room.add("The game of UNO was forcibly ended.").update();
			this.privateModAction(`(The game of UNO was ended by ${user.name}.)`);
			this.modlog('UNO END');
		},

		timer(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room.");
			let amount = parseInt(target);
			if (!amount || amount < 5 || amount > 300) return this.errorReply("The amount must be a number between 5 and 300.");

			game.maxTime = amount;
			if (game.timer) clearTimeout(game.timer);
			game.timer = setTimeout(() => {
				game.eliminate(game.currentPlayerid);
			}, amount * 1000);
			this.addModAction(`${user.name} has set the UNO automatic disqualification timer to ${amount} seconds.`);
			this.modlog('UNO TIMER', null, `${amount} seconds`);
		},

		autostart(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (toId(target) === 'off') {
				if (!game.autostartTimer) return this.errorReply("There is no autostart timer running on.");
				this.addModAction(`${user.name} has turned off the UNO autostart timer.`);
				clearTimeout(game.autostartTimer);
				return;
			}
			const amount = parseInt(target);
			if (!amount || amount < 30 || amount > 600) return this.errorReply("The amount must be a number between 30 and 600 seconds.");
			if (game.state !== 'signups') return this.errorReply("The game of UNO has already started.");
			if (game.autostartTimer) clearTimeout(game.autostartTimer);
			game.autostartTimer = setTimeout(() => {
				game.onStart();
			}, amount * 1000);
			this.addModAction(`${user.name} has set the UNO autostart timer to ${amount} seconds.`);
		},

		dq: 'disqualify',
		disqualify(target, room, user) {
			if (!this.can('minigame', null, room)) return;
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");

			let disqualified = game.eliminate(toId(target));
			if (disqualified === false) return this.errorReply(`Unable to disqualify ${target}.`);
			this.privateModAction(`(${user.name} has disqualified ${disqualified} from the UNO game.)`);
			this.modlog('UNO DQ', toId(target));
			room.add(`${target} has been disqualified from the UNO game.`).update();
		},

		// player/user commands
		j: 'unojoin',
		// TypeScript doesn't like 'join' being defined as a function
		join: 'unojoin',
		unojoin(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (!this.canTalk()) return false;
			if (!game.joinGame(user)) return this.errorReply("Unable to join the game.");

			return this.sendReply("You have joined the game of UNO.");
		},

		l: 'leave',
		leave(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (!game.leaveGame(user)) return this.errorReply("Unable to leave the game.");
			return this.sendReply("You have left the game of UNO.");
		},

		play(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			/** @type {UnoGamePlayer | undefined} */
			let player = game.players[user.userid];
			if (!player) return this.errorReply(`You are not in the game of UNO.`);
			let error = game.onPlay(player, target);
			if (error) this.errorReply(error);
		},

		draw(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			/** @type {UnoGamePlayer | undefined} */
			let player = game.players[user.userid];
			if (!player) return this.errorReply(`You are not in the game of UNO.`);
			let error = game.onDraw(player);
			if (error) return this.errorReply("You have already drawn a card this turn.");
		},

		pass(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (game.currentPlayerid !== user.userid) return this.errorReply("It is currently not your turn.");
			/** @type {UnoGamePlayer | undefined} */
			let player = game.players[user.userid];
			if (!player) return this.errorReply(`You are not in the game of UNO.`);
			if (!player.cardLock) return this.errorReply("You cannot pass until you draw a card.");
			if (game.state === 'color') return this.errorReply("You cannot pass until you choose a color.");

			game.sendToRoom(`${user.name} has passed.`);
			game.nextTurn();
		},

		color(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return false;
			/** @type {UnoGamePlayer | undefined} */
			let player = game.players[user.userid];
			if (!player) return this.errorReply(`You are not in the game of UNO.`);
			/** @type {Color} */
			let color;
			if (target === 'Red' || target === 'Green' || target === 'Blue' || target === 'Yellow' || target === 'Black') {
				color = target;
			} else {
				return this.errorReply(`"${target}" is not a valid color.`);
			}
			game.onSelectColor(player, color);
		},

		uno(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return false;
			/** @type {UnoGamePlayer | undefined} */
			let player = game.players[user.userid];
			if (!player) return this.errorReply(`You are not in the game of UNO.`);
			game.onUno(player, target);
		},

		// information commands
		'': 'hand',
		hand(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.parse("/help uno");
			game.onSendHand(user);
		},

		players: 'getusers',
		users: 'getusers',
		getplayers: 'getusers',
		getusers(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (!this.runBroadcast()) return false;
			this.sendReplyBox(`<strong>Players (${game.playerCount})</strong>:<br />${game.getPlayers().join(', ')}`);
		},

		help(target, room, user) {
			this.parse('/help uno');
		},

		// suppression commands
		suppress(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");
			if (!this.can('minigame', null, room)) return;

			target = toId(target);
			let state = target === 'on' ? true : target === 'off' ? false : undefined;

			if (state === undefined) return this.sendReply(`Suppression of UNO game messages is currently ${(game.suppressMessages ? 'on' : 'off')}.`);
			if (state === game.suppressMessages) return this.errorReply(`Suppression of UNO game messages is already ${(game.suppressMessages ? 'on' : 'off')}.`);

			game.suppressMessages = state;

			this.addModAction(`${user.name} has turned ${(state ? 'on' : 'off')} suppression of UNO game messages.`);
			this.modlog('UNO SUPRESS', null, (state ? 'ON' : 'OFF'));
		},

		spectate(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");

			if (!game.suppressMessages) return this.errorReply("The current UNO game is not suppressing messages.");
			if (user.userid in game.spectators) return this.errorReply("You are already spectating this game.");

			game.spectators[user.userid] = 1;
			this.sendReply("You are now spectating this private UNO game.");
		},

		unspectate(target, room, user) {
			const game = /** @type {UnoGame} */ (room.game);
			if (!game || game.gameid !== 'uno') return this.errorReply("There is no UNO game going on in this room right now.");

			if (!game.suppressMessages) return this.errorReply("The current UNO game is not suppressing messages.");
			if (!(user.userid in game.spectators)) return this.errorReply("You are currently not spectating this game.");

			delete game.spectators[user.userid];
			this.sendReply("You are no longer spectating this private UNO game.");
		},
	},

	unohelp: [
		`/uno create [player cap] - creates a new UNO game with an optional player cap (default player cap at 6). Use the command [createpublic] to force a public game or [createprivate] to force a private game. Requires: % @ # & ~`,
		`/uno timer [amount] - sets an auto disqualification timer for [amount] seconds. Requires: % @ # & ~`,
		`/uno autostart [amount] - sets an auto starting timer for [amount] seconds. Requires: % @ # & ~`,
		`/uno end - ends the current game of UNO. Requires: % @ # & ~`,
		`/uno start - starts the current game of UNO. Requires: % @ # & ~`,
		`/uno disqualify [player] - disqualifies the player from the game. Requires: % @ # & ~`,
		`/uno hand - displays your own hand.`,
		`/uno getusers - displays the players still in the game.`,
		`/uno [spectate|unspectate] - spectate / unspectate the current private UNO game.`,
		`/uno suppress [on|off] - Toggles suppression of game messages.`,
	],
};

exports.commands = commands;
