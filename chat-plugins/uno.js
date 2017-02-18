'use strict';

const maxTime = 20; // seconds

function cardHTML(card, fullsize) {
	let surface = card.value.replace(/[^A-Z0-9\+]/g, "");
	return `<button style="height: 140px; padding-bottom: 120px; text-align: left; font-weight: bold; border: 2px solid rgba(33 , 68 , 72 , 0.59); min-width: ${fullsize ? "80" : "30"}px; border-radius: 10px 2px 2px 3px; color: ${card.colour === "Black" ? "yellow" : "black"}; background-color: ${card.colour}" name=send value="/uno play ${card.name}">${surface}</button>`;
}

function createDeck() {
	let colours = ["Red", "Blue", "Green", "Yellow"];
	let values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Reverse", "Skip", "+2"];

	let basic = [];

	for (let i = 0; i < 4; i++) {
		let colour = colours[i];
		basic.push(...values.map(v => {
			return {value: v, colour: colour, name: colour + " " + v};
		}));
	}

	return [...basic, ...basic, // two copies of the basic stuff (total 96)
		...[0, 1, 2, 3].map(v => ({colour: colours[v], value: "0", name: colours[v] + " 0"})), // the 4 0s
		...[0, 1, 2, 3].map(v => ({colour: "Black", value: "Wild", name: "Wild"})), // wild cards
		...[0, 1, 2, 3].map(v => ({colour: "Black", value: "+4", name: "Wild +4"})), // wild +4 cards
	]; // 108 cards
}

class UNOgame extends Rooms.RoomGame {
	constructor(room, cap) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.allowRenames = true;
		this.playerCap = parseInt(cap) || 6;
		this.maxTime = maxTime;

		this.gameid = "uno";
		this.title = "UNO";

		this.state = "signups";

		this.currentPlayer = null;
		this.deck = Tools.shuffle(createDeck());
		this.discards = [];
		this.topCard = null;

		this.direction = 1;
	}

	onStart() {
		if (this.playerCount < 2) return false;
		this.sendToRoom(`|uhtmlchange|uno-${this.room.gameNumber}|<div class="infobox">The game of UNO has started.</div>`);
		this.state = "play";

		this.onNextPlayer();  // determines the first player

		// give cards to the players
		for (let i in this.players) {
			this.players[i].hand.push(...this.drawCard(7));
		}

		// top card of the deck.
		do {
			this.topCard = this.drawCard(1)[0];
			this.discards.unshift(this.topCard);
		} while (this.topCard.colour === "Black");

		this.sendToRoom(`|raw|The top card is <span style="color: ${this.topCard.colour}">${this.topCard.name}</span>.`);

		this.onRunEffect(this.topCard.value, true);
		this.nextTurn(true);
	}

	joinGame(user) {
		if (this.state === "signups" && this.addPlayer(user)) return true;
		return false;
	}

	leaveGame(user) {
		if (this.state === "signups" && this.removePlayer(user)) return true;
		return false;
	}

	// overwrite the default makePlayer so it makes a UNOgamePlayer instead.
	makePlayer(user) {
		return new UNOgamePlayer(user, this);
	}

	onRename(user, oldUserid, isJoining) {
		if (!(oldUserid in this.players) || user.userid === oldUserid) return false;
		this.players[user.userid] = this.players[oldUserid];
		if (user.userid !== oldUserid) delete this.players[oldUserid]; // only run if it's a rename that involves a change of userid

		// update the user's name information
		this.players[user.userid].name = user.name;
		this.players[user.userid].userid = user.userid;
		if (this.awaitUno && this.awaitUno === oldUserid) this.awaitUno = user.userid;

		if (this.currentPlayer && this.currentPlayer === oldUserid) this.currentPlayer = user.userid;
	}

	eliminate(userid) {
		if (!(userid in this.players)) return false;

		let name = this.players[userid].name;

		if (this.playerCount === 2) {
			this.removePlayer({userid: userid});
			this.onWin(this.players[Object.keys(this.players)[0]]);
			return name;
		}

		// handle current player...
		if (userid === this.currentPlayer) {
			clearTimeout(this.timer);
			this.nextTurn();
		}
		this.removePlayer({userid: userid});
		return name;
	}

	sendToRoom(msg) {
		this.room.add(msg).update();
	}

	getPlayers(showCards) {
		let playerList = Object.keys(this.players);
		if (!showCards) {
			return playerList.sort().map(id => Chat.escapeHTML(this.players[id].name));
		}
		if (this.direction === -1) playerList = playerList.reverse();
		return playerList.map(id => `${(this.currentPlayer && this.currentPlayer === id ? "<strong>" : "")}${Chat.escapeHTML(this.players[id].name)} (${this.players[id].hand.length}) ${(this.currentPlayer && this.currentPlayer === id ? "</strong>" : "")}`);
	}

	nextTurn(starting) {
		if (!starting) this.onNextPlayer();

		if (this.awaitUno) {
			this.unoId = Math.floor(Math.random() * 100).toString();
			this.players[this.awaitUno].sendRoom(`|raw|<div style="text-align: center"><button name=send value="/uno uno ${this.unoId}" style="background-color: green; width: 80%; padding: 8px; border: 2px solid rgba(33 , 68 , 72 , 0.59); border-radius: 8px;">UNO!</button></div>`);
		}

		clearTimeout(this.timer);
		let player = this.players[this.currentPlayer];
		this.room.send(`${player.name}'s turn.`);
		if (player.cardLock) delete player.cardLock;
		player.sendDisplay();

		this.timer = setTimeout(() => {
			this.sendToRoom(`${player.name} has been automatically disqualified.`);
			this.eliminate(this.currentPlayer);
		}, this.maxTime * 1000);
	}

	onNextPlayer() {
		// if none is set
		if (!this.currentPlayer) {
			let userList = Object.keys(this.players);
			this.currentPlayer = userList[Math.floor(this.playerCount * Math.random())];
		}

		this.currentPlayer = this.getNextPlayer();
	}

	getNextPlayer() {
		let userList = Object.keys(this.players);

		let player = userList[(userList.indexOf(this.currentPlayer) + this.direction)];

		if (!player) {
			player = this.direction === 1 ? userList[0] : userList[this.playerCount - 1];
		}
		return player;
	}

	onPlay(user, cardName) {
		if (this.currentPlayer !== user.userid || this.state !== "play") return false;
		let player = this.players[user.userid];

		let card = player.hasCard(cardName);
		if (!card) return "You do not have that card";

		// check for legal play
		if (player.cardLock && player.cardLock !== cardName) return `You can only play ${player.cardLock} after drawing.`;
		if (card.colour !== "Black" && card.colour !== this.topCard.colour && card.value !== this.topCard.value) return "You cannot play this card.";
		if (card.value === "+4" && !player.canPlayWildFour()) return "You cannot play Wild +4 when you still have a card with the same colour as the top card.";

		clearTimeout(this.timer); // reset the autodq timer.

		if (this.awaitUno) {
			// if the previous player hasn't hit UNO before the next player plays something, they are forced to draw 2 cards.
			this.sendToRoom(`${this.players[this.awaitUno].name} forgot to say UNO! and is forced to draw 2 cards.`);
			this.onDrawCard({userid: this.awaitUno}, 2);
			delete this.awaitUno;
			delete this.unoId;
		}

		// update the game information.
		this.topCard = card;
		player.removeCard(cardName);
		this.discards.unshift(card);
		this.sendToRoom(`|raw|${Chat.escapeHTML(player.name)} has played a <span style="color: ${card.colour}">${card.name}</span>.`);

		// handle hand size
		if (!player.hand.length) {
			this.onWin(player);
			return;
		}
		if (player.hand.length === 1) this.awaitUno = user.userid;

		// continue with effects and next player
		this.onRunEffect(card.value);
		if (this.state === "play") this.nextTurn();
	}

	onRunEffect(value, initialize) {
		const colourDisplay = `|uhtml|uno-hand|<table style="width: 100%; border: 1px solid black;"><tr><td style="width: 50%"><button style="width: 100%; background-color: red; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px;" name=send value="/uno colour Red">Red</button></td><td style="width: 50%"><button style="width: 100%; background-color: blue; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; color: white; padding: 5px;" name=send value="/uno colour Blue">Blue</button></td></tr><tr><td style="width: 50%"><button style="width: 100%; background-color: green; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px;" name=send value="/uno colour Green">Green</button></td><td style="width: 50%"><button style="width: 100%; background-color: yellow; border: 2px solid rgba(0 , 0 , 0 , 0.59); border-radius: 5px; padding: 5px;" name=send value="/uno colour Yellow">Yellow</button></td></tr></table>`;

		switch (value) {
		case "Reverse":
			this.direction *= -1;
			this.sendToRoom("The direction of the game has changed.");
			if (!initialize && this.playerCount === 2) this.onNextPlayer(); // in 2 player games, reverse sends the turn back to the player.
			break;
		case "Skip":
			this.onNextPlayer();
			this.sendToRoom(this.players[this.currentPlayer].name + "'s turn has been skipped.");
			break;
		case "+2":
			this.onNextPlayer();
			this.sendToRoom(this.players[this.currentPlayer].name + " has been forced to draw 2 cards.");
			this.onDrawCard({userid: this.currentPlayer}, 2);
			break;
		case "+4":
			this.players[this.currentPlayer].sendRoom(colourDisplay);
			this.state = "colour";
			// apply to the next in line, since the current player still has to choose the colour
			let next = this.getNextPlayer();
			this.sendToRoom(this.players[next].name + " has been forced to draw 4 cards.");
			this.onDrawCard({userid: next}, 4);
			this.isPlusFour = true;
			this.timer = setTimeout(() => {
				this.sendToRoom(`${this.players[this.currentPlayer].name} has been automatically disqualified.`);
				this.eliminate(this.currentPlayer);
			}, this.maxTime * 1000);
			break;
		case "Wild":
			this.players[this.currentPlayer].sendRoom(colourDisplay);
			this.state = "colour";
			this.timer = setTimeout(() => {
				this.sendToRoom(`${this.players[this.currentPlayer].name} has been automatically disqualified.`);
				this.eliminate(this.currentPlayer);
			}, this.maxTime * 1000);
			break;
		}
		if (initialize) this.onNextPlayer();
	}

	onSelectColour(user, colour) {
		if (!["Red", "Blue", "Green", "Yellow"].includes(colour) || user.userid !== this.currentPlayer || this.state !== "colour") return false;
		this.topCard.colour = colour; // manually change the top card's colour
		this.sendToRoom(`The colour has been changed to ${colour}.`);
		clearTimeout(this.timer);
		this.state = "play";

		if (this.isPlusFour) {
			this.isPlusFour = false;
			this.onNextPlayer(); // handle the skipping here.
		}

		this.nextTurn();
	}

	onDrawCard(user, count, selfDraw) {
		if (!(user.userid in this.players)) return false;
		let drawnCards = this.drawCard(count);

		let player = this.players[user.userid];
		player.hand.push(...drawnCards);
		player.sendDisplay();
		player.sendRoom(`|raw|You have drawn the following card${drawnCards.length > 1 ? "s" : ""}: ${drawnCards.map(card => `<span style="color: ${card.colour}">${card.name}</span>`).join(", ")}.`);
		if (selfDraw) player.cardLock = drawnCards[0].name;
	}

	drawCard(count) {
		count = parseInt(count);
		if (!count || count < 1) count = 1;
		let drawnCards = [];

		for (let i = 0; i < count; i++) {
			if (!this.deck.length) {
				this.deck = this.discards.length ? Tools.shuffle(this.discards) : Tools.shuffle(createDeck()); // shuffle the cards back into the deck, or if there are no discards, add another deck into the game.
			}
			drawnCards.push(this.deck.pop());
		}
		return drawnCards;
	}

	onUno(user, unoId) {
		// uno id makes spamming /uno uno impossible
		if (this.unoId !== unoId || user.userid !== this.awaitUno) return false;
		this.sendToRoom(`|raw|<strong>UNO!</strong> ${user.name} is down to their last card!`);
		delete this.awaitUno;
		delete this.unoId;
	}

	onSendHand(user) {
		if (!(user.userid in this.players) || this.state === "signups") return false;

		this.players[user.userid].sendDisplay();
	}

	onWin(player) {
		this.sendToRoom(`|raw|<div class="broadcast-green">Congratulations to ${player.name} for winning the game of UNO!</div>`);
		this.destroy();
	}

	destroy() {
		clearTimeout(this.timer);
		this.sendToRoom(`|uhtmlchange|uno-${this.room.gameNumber}|<div class="infobox">The game of UNO has ended.</div>`);

		// deallocate games for each player.
		for (let i in this.players) {
			this.players[i].destroy();
		}
		delete this.room.game;
	}
}

class UNOgamePlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);
		this.hand = [];
	}

	canPlayWildFour() {
		let colour = this.game.topCard.colour;

		if (this.hand.some(c => c.colour === colour)) return false;
		return true;
	}

	hasCard(cardName) {
		let matched = this.hand.filter(c => c.name === cardName);
		if (!matched.length) return false;
		return matched[0]; // returns the first instance of the matched card
	}

	removeCard(cardName) {
		for (let i = 0; i < this.hand.length; i++) {
			if (this.hand[i].name === cardName) {
				this.hand.splice(i, 1);
				break;
			}
		}
	}

	buildHand() {
		return this.hand.sort((a, b) => {
			if (a.colour > b.colour) return 1;
			if (a.colour < b.colour) return -1;
			if (a.value > b.value) return 1;
			return -1;
		})
		.map((c, i) => cardHTML(c, i === this.hand.length - 1));
	}

	sendDisplay() {
		let hand = this.buildHand().join("");
		let players = `<p><strong>Players (${this.game.playerCount}):</strong></p>` + this.game.getPlayers(true).join("<br />");
		let draw = "<button style=\"border: 2px solid rgba(0 , 0 , 0 , 0.59); background-color: skyblue; border-radius: 8px; padding: 5px; font-weight: bold; width: 50%\" name=send value=\"/uno draw\">Draw a card!</button>";
		let pass = "<button style=\"border: 2px solid rgba(0 , 0 , 0 , 0.59); background-color: pink; border-radius: 8px; padding: 5px; font-weight: bold; width: 50%\" name=send value=\"/uno pass\">Pass!</button>";

		let top = `<strong>Top Card</strong>: <span style="color: ${this.game.topCard.colour}">${this.game.topCard.name}</span>`;

		// clear previous display and show new display
		this.sendRoom("|uhtmlchange|uno-hand|");
		this.sendRoom(`|uhtml|uno-hand|<table style="width: 100%; table-layout: fixed;">${this.game.currentPlayer === this.userid ? `<tr><td colspan=2></td><td style="border-radius: 50px 0 0 0; border: 1px solid; padding: 5px; text-align: right;">${top}</td></tr>` : ""}<tr><td colspan=2 style="border: 1px solid; padding: 5px;"><div style="overflow-x: auto; white-space: nowrap; width: 100%;">${hand}</div></td><td style="border: 1px solid; vertical-align: top; padding: 5px;"><div style="overflow-y: scroll;">${players}</div></td></tr>${this.game.currentPlayer === this.userid ? `<tr><td colspan=3 style="border: 1px solid;">${draw}${pass}</td></tr>` : ""}</table>`);
	}
}

exports.commands = {
	uno: {
		// roomowner commands
		disable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (room.unoDisabled) {
				return this.errorReply("UNO is already disabled.");
			}
			room.unoDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.unoDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("UNO has been disabled for this room.");
		},

		enable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (!room.unoDisabled) {
				return this.errorReply("UNO is already enabled.");
			}
			delete room.unoDisabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.unoDisabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("UNO has been enabled for this room.");
		},

		// moderation commands
		create: function (target, room, user) {
			if (!this.can("minigame", null, room)) return;
			if (room.game) return this.errorReply("There is already a game in progress in this room.");

			room.game = new UNOgame(room, target);
			room.add(`|uhtml|uno-${room.gameNumber}|<div class="broadcast-green"><p style="font-size: 14pt; text-align: center;">A new game of <strong>UNO</strong> is starting!</p><p style="font-size: 9pt; text-align: center;">Use <strong>/uno join</strong> to join the game.</p></div>`).update();
			this.privateModCommand(`(A game of UNO was created by ${user.name}.)`);
		},

		start: function (target, room, user) {
			if (!this.can("minigame", null, room)) return;
			if (!room.game || room.game.gameid !== "uno" || room.game.state !== "signups") return this.errorReply("There is no UNO game in signups phase in this room.");
			if (room.game.onStart()) this.privateModCommand(`(The game of UNO was started by ${user.name}.)`);
		},

		end: function (target, room, user) {
			if (!this.can("minigame", null, room)) return;
			if (!room.game || room.game.gameid !== "uno") return this.errorReply("There is no UNO game going on in this room.");
			room.game.destroy();
			room.add("The game of UNO was forcibly ended.").update();
			this.privateModCommand(`(The game of UNO was ended by ${user.name}.)`);
		},

		timer: function (target, room, user) {
			if (!this.can("minigame", null, room)) return;
			if (!room.game || room.game.gameid !== "uno") return this.errorReply("There is no UNO game going on in this room.");
			let amount = parseInt(target);
			if (!amount || amount < 5) return this.errorReply("The amount must be a number greater than 5.");

			room.game.maxTime = amount;
			if (room.game.timer) {
				clearTimeout(room.game.timer);
				room.game.timer = setTimeout(() => {
					room.game.eliminate(room.game.currentPlayer);
				}, amount * 1000);
			}
			this.privateModCommand(`(${user.name} has set the autodisqualification timer to ${amount} seconds.)`);
			room.add(`The autodisqualification timer is set to ${amount} seconds.`).update();
		},

		"dq": "disqualify",
		disqualify: function (target, room, user) {
			if (!this.can("minigame", null, room)) return;
			if (!room.game || room.game.gameid !== "uno") return this.errorReply("There is no UNO game going on in this room.");

			let disqualified = room.game.eliminate(toId(target));
			if (disqualified === false) return this.errorReply(`Unable to disqualify ${target}.`);
			this.privateModCommand(`(${user.name} has disqualified ${disqualified} from the UNO game.)`);
			room.add(`${target} has been disqualified from the UNO game.`).update();
		},

		// player/user commands
		join: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			if (!this.canTalk()) return false;
			if (!room.game.joinGame(user)) return this.errorReply("Unable to join the game.");

			return this.sendReply("You have joined the game of UNO.");
		},

		leave: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			if (!room.game.leaveGame(user)) return this.errorReply("Unable to leave the game.");
			return this.sendReply("You have left the game of UNO.");
		},

		play: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			let error = room.game.onPlay(user, target);
			if (error) this.errorReply(error);
		},

		draw: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			if (room.game.currentPlayer !== user.userid) return false;
			if (room.game.players[user.userid].cardLock) return this.errorReply("You have already drawn a card this turn.");
			room.add(`${user.name} has drawn a card.`).update();

			room.game.onDrawCard(user, 1, true);
		},

		pass: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			if (room.game.currentPlayer !== user.userid) return false;
			if (!room.game.players[user.userid].cardLock) return this.errorReply("You cannot pass until you draw a card.");

			room.add(`${user.name} has passed.`).update();
			room.game.nextTurn();
		},

		colour: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			room.game.onSelectColour(user, target);
		},

		uno: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			room.game.onUno(user, target);
		},

		// information commands
		"": "hand",
		hand: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return this.parse("/help uno");
			room.game.onSendHand(user);
		},

		getusers: function (target, room, user) {
			if (!room.game || room.game.gameid !== "uno") return false;
			if (!this.runBroadcast()) return false;
			this.sendReplyBox(`<strong>Players (${room.game.playerCount})</strong>:<br />${room.game.getPlayers().join(", ")}`);
		},

		help: function (target, room, user) {
			this.parse("/help uno");
		},
	},

	unohelp: [
		"/uno create [player cap] - creates a new UNO game with an optional player cap (default player cap at 6). Requires: % @ * # & ~",
		"/uno timer [amount] - sets an auto disqualification timer for `amount` seconds. Requires: % @ * # & ~",
		"/uno end - ends the current game of UNO. Requires: % @ * # & ~",
		"/uno start - starts the current game of UNO. Requires: % @ * # & ~",
		"/uno disqualify [player] - disqualifies the player from the game. Requires: % @ * # & ~",
		"/uno hand - displays your own hand.",
		"/uno getusers - displays the players still in the game.",
	],
};
