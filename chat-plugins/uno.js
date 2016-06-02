'use strict';
/******************************************
 * UNO chat-plugin cretaed by Sparkychild *
 ******************************************/

//for each room
const deck = ["R1",
	"R2",
	"R3",
	"R4",
	"R5",
	"R6",
	"R7",
	"R8",
	"R9",
	"RS",
	"RR",
	"R+2",
	"W+4",
	"Y1",
	"Y2",
	"Y3",
	"Y4",
	"Y5",
	"Y6",
	"Y7",
	"Y8",
	"Y9",
	"YS",
	"YR",
	"Y+2",
	"W+4",
	"G1",
	"G2",
	"G3",
	"G4",
	"G5",
	"G6",
	"G7",
	"G8",
	"G9",
	"GS",
	"GR",
	"G+2",
	"W+4",
	"B1",
	"B2",
	"B3",
	"B4",
	"B5",
	"B6",
	"B7",
	"B8",
	"B9",
	"BS",
	"BR",
	"B+2",
	"W+4",
	"R1",
	"R2",
	"R3",
	"R4",
	"R5",
	"R6",
	"R7",
	"R8",
	"R9",
	"RS",
	"RR",
	"R+2",
	"WW",
	"R0",
	"Y1",
	"Y2",
	"Y3",
	"Y4",
	"Y5",
	"Y6",
	"Y7",
	"Y8",
	"Y9",
	"YS",
	"YR",
	"Y+2",
	"WW",
	"Y0",
	"G1",
	"G2",
	"G3",
	"G4",
	"G5",
	"G6",
	"G7",
	"G8",
	"G9",
	"GS",
	"GR",
	"G+2",
	"WW",
	"G0",
	"B1",
	"B2",
	"B3",
	"B4",
	"B5",
	"B6",
	"B7",
	"B8",
	"B9",
	"BS",
	"BR",
	"B+2",
	"WW",
	"B0",
];
const drawButton = '<center><button style="background: black; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 56px ; border-radius: 5px , auto" name="send" value="/uno draw"><font color="white">Draw</font></button></center>';
const passButton = '<center><button style="background: red; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 56px ; border-radius: 5px , auto" name="send" value="/uno pass"><font color="white">PASS</font></button></center>';

function buildCard(id) {
	let colourTable = {
		"R": "red",
		"Y": "yellow",
		"B": "blue",
		"G": "green",
		"W": "black",
	};
	let colour = colourTable[id.charAt(0)];
	let value = id.slice(1);
	let fontColour = colour === "yellow" ? "black" : "white";
	let command = "/uno play " + id;
	let buttonFace = value === "W" ? '<font color="red" size=4>W</font><font color="yellow" size=4>i</font><font color="blue" size=4><b>l</b></font><font color="green" size=4><b>d</b></font>' : '<font color="' + fontColour + "\" size=6>" + value + "</font>";
	let button = "<button style=\"background: " + colour + "; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; height: 80px ; width: 56px ; border-radius: 5px , auto\" name=\"send\" value=\"" + command + "\">" + buttonFace + "</button>";
	return button;
}

function getCard(id) {
	let colourTable = {
		"R": "red",
		"Y": "yellow",
		"B": "blue",
		"G": "green",
		"W": "black",
	};
	let colour = colourTable[id.charAt(0)];
	let value = id.slice(1);
	let fontColour = colour === "yellow" ? "black" : "white";
	let buttonFace = value === "W" ? '<font color="red" size=4>W</font><font color="yellow" size=4>i</font><font color="blue" size=4><b>l</b></font><font color="green" size=4><b>d</b></font>' : '<font color="' + fontColour + "\" size=6>" + value + "</font>";
	let button = "<button style=\"background: " + colour + "; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; height: 80px ; width: 56px ; border-radius: 5px , auto\">" + buttonFace + "</button>";
	return button;
}

function buildHand(array) {
	let hand = [];
	array.sort(function (a, b) {
		if (a.replace("W", "Z").replace("R", "A").replace("Y", "C").replace("B", "D") > b.replace("W", "Z").replace("R", "A").replace("Y", "C").replace("B", "D")) return 1;
		return -1;
	}).forEach(function (c) {
		hand.push(buildCard(c));
	});
	return hand.join("&nbsp;");
}

function getCardArray(array) {
	let hand = [];
	array.sort(function (a, b) {
		if (a.replace("W", "Z").replace("R", "A").replace("Y", "C").replace("B", "D") > b.replace("W", "Z").replace("R", "A").replace("Y", "C").replace("B", "D")) return 1;
		return -1;
	}).forEach(function (c) {
		hand.push(getCard(c));
	});
	return hand.join("&nbsp;");
}

function getTopCard(roomid) {
	if (!Rooms.rooms[roomid].uno || !Rooms.rooms[roomid].uno.top) return "UH OH!";
	let colourTable = {
		"R": "red",
		"Y": "yellow",
		"B": "blue",
		"G": "green",
	};
	return getCard(Rooms.rooms[roomid].uno.top) + (Rooms.rooms[roomid].uno.change ? "<br>Change to: <font color=\"" + colourTable[Rooms.rooms[roomid].uno.change] + "\">" + colourTable[Rooms.rooms[roomid].uno.change].toUpperCase() + "</font>" : "");
}

function buildGameScreen(user, roomid, hand, uhtmlid, message, pass) {
	let html = (message ? "|uhtmlchange|" + uhtmlid : "|uhtml|" + uhtmlid) + "|";
	let topCard = "<center>" + getTopCard(roomid) + "</center>";
	let yourHand = buildHand(hand);
	message = message ? "<font color=\"red\"><b>" + message + "</b></font>" : "";
	return html + "<table border=1 style=\"border-collapse: collapse;\"><tr><td>&nbsp;<b>Top Card</b>&nbsp;</td><td>&nbsp;<b>Your Hand</b>&nbsp;</td></tr>" + "<tr><td>" + topCard + "</td><td>" + yourHand + "</td></tr><tr><td>" + (pass ? passButton : drawButton) + "</td><td>" + message + "</td></tr></table>";
}

function getColourChange(buffer, hand, id) {
	return "|uhtmlchange|" + id + "|<table border=1 style=\"border-collapse: collapse;\"><tr><td>Choose which colour to change to:<br>" + '<button style="background: red; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + buffer + ' R"><font color="white" size=4>Red</font></button></center>' + '<button style="background: yellow; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + buffer + ' Y"><font color="black" size=4>Yellow</font></button></center>' + '<button style="background: blue; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + buffer + ' B"><font color="white" size=4>Blue</font></button></center>' + '<button style="background: green; border: 2px solid rgba(33 , 68 , 72 , 0.59) ; width: 80px ; border-radius: 5px , auto" name="send" value="' + buffer + ' G"><font color="white" size=4>Green</font></button></td></tr>' + '<tr><td>Your Cards: <br>' + getCardArray(hand) + '</td></tr></table>';
}

function getCardName(id) {
	let colourTable = {
		"R": "red",
		"Y": "orange",
		"B": "blue",
		"G": "green",
		"W": "black",
	};
	let colour = colourTable[id.charAt(0)];
	let cardName = id.replace(/^R/i, "Red ").replace(/^B/i, "Blue ").replace(/^Y/i, "Yellow ").replace(/^G/i, "Green ").replace("W+4", "Wild Draw Four").replace("WW", "Wildcard");
	return "<font color=\"" + colour + "\">" + cardName + "</font>";
}

function invertArray(array) {
	let buffer = [];
	for (let i = array.length - 1; i >= 0; i--) {
		buffer.push(array[i]);
	}
	return buffer;
}

function initTopCard(roomid) {
	Rooms.rooms[roomid].uno.top = Rooms.rooms[roomid].uno.deck.shift();
	Rooms.rooms[roomid].uno.discard.push(Rooms.rooms[roomid].uno.top);
}

function playVerifier(topCard, card, hand, change, special) {
	//this function returns false if there is nothing wrong;
	if (special) {
		if (card !== special) return "You have to play the card you drew last! (" + special.replace(/^R/i, "Red ").replace(/^B/i, "Blue ").replace(/^Y/i, "Yellow ").replace(/^G/i, "Green ").replace("W+4", "Wild Draw Four").replace("WW", "Wildcard") + ")";
	}
	let currentColour = change || topCard.charAt(0);
	let currentValue = topCard.slice(1);
	if (hand.indexOf(card) === -1) return "You do not have that card!";
	if (card === "W+4") {
		for (let i = 0; i < hand.length; i++) {
			if (hand[i].charAt(0) === currentColour) return "You cannot play this when you still have a card with the same colour as the top card.";
		}
		return false;
	}
	if (card === "WW") return false;
	if (card.charAt(0) === currentColour || card.slice(1) === currentValue) return false;
	return "The card has to either match the top card's colour or face value.";
}

function destroy(roomid) {
	delete Rooms.rooms[roomid].uno;
}

function verifyAlts(id, users) {
	let user = Users(id);
	for (let i = 0; i < users.length; i++) {
		if (Users(users[i]).latestIp === user.latestIp) {
			return false;
		}
	}
	return true;
}

function initDeck(playerCount) {
	playerCount = Math.ceil(playerCount / 7);
	let tDeck = [];
	for (let i = 0; i < playerCount; i++) {
		tDeck = tDeck.concat(deck);
	}
	return tDeck;
}

function shuffleDeck(dArray) {
	let tDeck = [];
	let reiterations = dArray.length;
	for (let i = 0; i < reiterations; i++) {
		let rand = ~~(dArray.length * Math.random());
		tDeck.push(dArray[rand]);
		dArray.splice(rand, 1);
	}
	return tDeck;
}

function receiveCard(userid, roomid, times, display) {
	if (!times) times = 1;
	let newCards = [];
	for (let i = 0; i < times; i++) {
		let newCard = Rooms.rooms[roomid].uno.deck.shift();
		Rooms.rooms[roomid].uno.data[userid].push(newCard);
		newCards.push(newCard);
		if (Rooms.rooms[roomid].uno.deck.length === 0) {
			if (Rooms.rooms[roomid].uno.discard.length === 0) Rooms.rooms[roomid].uno.discard = initDeck(1);
			Rooms.rooms[roomid].uno.deck = shuffleDeck(Rooms.rooms[roomid].uno.discard);
			Rooms.rooms[roomid].uno.discard = [];
		}
	}
	if (display) Users(userid).sendTo(roomid, "|raw|You received the following card(s): " + getCardArray(newCards));
	return newCards;
}

function getNextPlayer(roomid, number) {
	//number is number to go; 2 is skipping the next one;
	if (!number) number = 1;
	let list = Rooms.rooms[roomid].uno.list;
	let playerList = list.concat(list);
	let current = Rooms.rooms[roomid].uno.player;
	let index = playerList.indexOf(current);
	Rooms.rooms[roomid].uno.player = playerList[index + number];
}

function applyEffects(context, roomid, userid, card, init) {
	let effect = card.slice(1);
	switch (effect) {
	case "R":
		Rooms.rooms[roomid].uno.list = invertArray(Rooms.rooms[roomid].uno.list);
		if (init) {
			context.add("The direction has been switched!");
			break;
		} else if (Rooms.rooms[roomid].uno.list.length === 2) {
			getNextPlayer(roomid);
		} else {
			getNextPlayer(roomid, 2);
		}
		context.add("The direction has been switched!");
		break;
	case "S":
		getNextPlayer(roomid);
		context.add((Users(userid) ? Users(userid).name : userid) + "'s turn has been skipped!");
		break;
	case "+2":
		receiveCard(userid, roomid, 2, true);
		context.add((Users(userid) ? Users(userid).name : userid) + "'s turn has been skipped, and is forced to draw 2 cards!");
		getNextPlayer(roomid);
		break;
	case "+4":
		receiveCard(userid, roomid, 4, true);
		context.add((Users(userid) ? Users(userid).name : userid) + "'s turn has been skipped, and is forced to draw 4 cards!");
		getNextPlayer(roomid);
		break;
	}
}

function runDQ(context, roomid) {
	Rooms.rooms[roomid].uno.timer = setTimeout(function () {
		let currentPlayer = Rooms.rooms[roomid].uno.player;
		getNextPlayer(roomid);
		Rooms.rooms[roomid].uno.list.splice(Rooms.rooms[roomid].uno.list.indexOf(currentPlayer), 1);
		Users(currentPlayer).sendTo(roomid, "|uhtmlchange|" + Rooms.rooms[roomid].uno.rand.toString() + Rooms.rooms[roomid].uno.id + "|");
		delete Rooms.rooms[roomid].uno.data[currentPlayer];
		Rooms.rooms[roomid].uno.lastDraw = null;
		if (Rooms.rooms[roomid].uno.list.length === 1) {
			let finalPlayer = Users(Rooms.rooms[roomid].uno.player) ? Users(Rooms.rooms[roomid].uno.player).name : Rooms.rooms[roomid].uno.player;
			context.add(Rooms.rooms[roomid].uno.lastplay);
			context.add("|raw|<b>" + finalPlayer + "</b> has won the game!");
			if (Rooms.rooms[roomid].uno.pot) {
				let winnings = Rooms.rooms[roomid].uno.start * Rooms.rooms[roomid].uno.pot;
				Economy.writeMoney(toId(finalPlayer), winnings);
				Economy.logTransaction(finalPlayer + " has won " + winnings + " " + (winnings === 1 ? " buck " : " bucks ") + " from a game of UNO in " + roomid);
				this.add(finalPlayer + " has won " + winnings + " bucks!");
			}
			Rooms(roomid).update();
			clearDQ(roomid);
			destroy(roomid);
			return false;
		} else {
			initTurn(context, roomid);
		}
	}, 90000);
}

function clearDQ(roomid) {
	clearTimeout(Rooms.rooms[roomid].uno.timer);
}

function initTurn(context, roomid, repost, room) {
	let currentPlayer = Rooms.rooms[roomid].uno.player;
	Rooms.rooms[roomid].uno.id++;
	let playerName = Users(currentPlayer) ? Users(currentPlayer).name : currentPlayer;
	//announce the turn
	if (!repost) {
		Users(currentPlayer).sendTo(context.room, "|c:|" + ~~(Date.now() / 1000) + "|~UNOManager|" + playerName + ", it's your turn!");
		Rooms.rooms[roomid].uno.lastDraw = null;
		runDQ(context, roomid);
	}
	Rooms(roomid).update();
	//show the card control center
	let CCC = buildGameScreen(currentPlayer, roomid, Rooms.rooms[roomid].uno.data[currentPlayer], Rooms.rooms[roomid].uno.rand.toString() + Rooms.rooms[roomid].uno.id);
	Users(currentPlayer).sendTo(roomid, CCC);
}
/*
- top (top card);
- data (playerdata);
- list (playerlist);
- player (current player)
- change (what it's changed to);
- id (for checking the id for uhtml and uhtmlchange)
- deck (list of cards still to be drawn)
- discard (discard pile, for the purpose of shuffling)
- pot (gaming for bucks)
- timer (autodq)
*/

exports.commands = {
	uno: function (target, room, user) {
		if (!target) target = " ";
		let parts = target.split(" ");
		let action = parts.shift();
		let userid = user.userid;
		let roomid = room.id;
		let self = this;
		switch (action) {
		case 'new':
			if (!this.can('mute', null, room)) return false;
			if (room.uno) return this.errorReply("There is already a game of UNO being played in this room.");
			let pot = null;
			//if (parseInt(parts[0])) pot = parseInt(parts[0]);
			Economy.readMoney(user.userid, amount => {
				if (pot && room.id !== 'marketplace') return this.errorReply("You cannot start a game with bets in rooms besides marketplace");
				if (amount < pot) return this.errorReply("You cannot start a game with a pot that has more bucks than you.");
				room.uno = {
					top: null,
					data: {},
					list: [],
					player: null,
					start: false,
					change: null,
					id: 0,
					deck: null,
					discard: [],
					"pot": pot && pot > 0 ? pot : null,
					timer: null,
					rand: ~~(Math.random() * 1000000),
					lastDraw: null,
					passed: false,
					postuhtml: 0,
					lastplay: null,
				};
				this.add("|raw|<center><img src=\"http://www.theboardgamefamily.com/wp-content/uploads/2010/12/uno-mobile-game1.jpg\" height=300 width=320><br><br><b>A new game of UNO is starting!</b><br><br><button style=\"height: 30px ; width: 60px ;\" name=\"send\" value=\"/uno join\">Join</button></center>");
				if (pot) this.add("|raw|<br><center><font color=\"red\"><b>You will need " + pot + " bucks to join this game.</b></font></center>");
				this.privateModCommand(user.name + " has created a game of UNO");
				room.update();
			});
			break;
		case 'join':
			if (!room.uno || room.uno.start) return false;
			if (!verifyAlts(userid, room.uno.list) || room.uno.list.indexOf(userid) > -1) return this.errorReply("You already have an alt joined.");
			if (room.uno.list.length >= 30) return this.errorReply("There cannot be more than 30 players in a game of UNO.");
			if (room.uno.pot) {
				Economy.readMoney(userid, amount => {
					if (amount < room.uno.pot) return this.errorReply("You do not have enough bucks to join.");
					Economy.writeMoney(userid, room.uno.pot * -1);
					room.uno.list.push(userid);
					room.uno.data[userid] = [];
					this.add(user.name + " has joined the game!");
					room.update();
				});
			} else {
				room.uno.list.push(userid);
				room.uno.data[userid] = [];
				this.add(user.name + " has joined the game!");
			}
			break;
		case 'leave':
			if (!room.uno || room.uno.start) return false;
			if (!room.uno.data[userid]) return false;
			if (room.uno.pot) return this.errorReply("You cannot leave a game with bucks involved.");
			room.uno.list.splice(room.uno.list.indexOf(userid), 1);
			delete room.uno.data[userid];
			break;
		case 'dq':
			if (!room.uno || !room.uno.start) return false;
			let targetUser = toId(parts.join(" ") || " ");
			if (!targetUser) return false;
			if (!(targetUser in room.uno.data) || !this.can('mute', null, room)) return;
			if (room.uno.pot) return this.errorReply("You cannot disqualify players in a game with bucks involved.");
			if (room.uno.list.length !== 2 && targetUser === room.uno.player) {
				clearDQ(roomid);
				getNextPlayer(roomid);
				initTurn(this, roomid);
			}
			room.uno.list.splice(room.uno.list.indexOf(targetUser), 1);
			delete room.uno.data[targetUser];
			this.add(targetUser + " has been disqualified!");
			if (room.uno.list.length === 1) {
				this.add(room.uno.list[0] + " has won!");
				clearDQ(roomid);
				destroy(roomid);
			}
			break;
		case 'start':
			if (!room.uno || room.uno.start) return this.errorReply("No game of UNO in this room to start.");
			if (!this.can('mute', null, room)) return this.errorReply("You must be % or higher to start a game of UNO.");
			if (room.uno.list.length < 2) return this.errorReply("There aren't enough players to start!");
			this.privateModCommand(user.name + " has started the game");
			//start the game!
			room.uno.start = room.uno.list.length;
			//create deck
			room.uno.deck = shuffleDeck(initDeck(room.uno.list.length));
			//deal the cards
			room.uno.list.forEach(function (u) {
				receiveCard(u, room.id, 7);
			}); //get first player;
			room.uno.player = room.uno.list[~~(Math.random() * room.uno.list)];
			let playerName = Users(room.uno.player) ? Users(room.uno.player).name : room.uno.player;
			this.add("The first player is: " + playerName);
			Users(toId(playerName)).sendTo(room, "|c:|" + ~~(Date.now() / 1000) + "|~UNOManager| " + playerName + ", it's your turn!");
			//get top card
			initTopCard(roomid);
			while (room.uno.top === "WW" || room.uno.top === "W+4") {
				initTopCard(roomid);
			}
			//announce top card
			this.add("|uhtml|post" + room.uno.postuhtml + "|<b>The top card is:</b> " + getCard(room.uno.top));
			room.uno.lastplay = "|uhtmlchange|post" + room.uno.postuhtml + "|The top card is <b>" + getCardName(room.uno.top) + "</b>";
			room.update();
			//add top card to discard pile
			//apply the effects if applicable;
			applyEffects(this, roomid, room.uno.player, room.uno.top);
			if (/R$/i.test(room.uno.top)) getNextPlayer(roomid);
			//start the first turn!
			setTimeout(function () {
				initTurn(self, roomid);
			}, 200);
			break;
		case 'play':
			if (!room.uno || !room.uno.start || userid !== room.uno.player) return false;
			let issues = playVerifier(room.uno.top, parts[0], room.uno.data[userid], room.uno.change, room.uno.lastDraw);
			if (issues) return user.sendTo(room, buildGameScreen(userid, roomid, room.uno.data[userid], room.uno.rand.toString() + room.uno.id, issues, room.uno.lastDraw));
			if (parts[0].charAt(0) === "W" && (!parts[1] || ["Y", "B", "G", "R"].indexOf(parts[1]) === -1)) return user.sendTo(roomid, getColourChange("/uno play " + parts[0], room.uno.data[userid], room.uno.rand.toString() + room.uno.id));
			room.uno.change = null;
			//apply colour change
			let colourChanged = false;
			let colourTable = {
				"R": "RED",
				"Y": "YELLOW",
				"B": "BLUE",
				"G": "GREEN",
				"W": "BLACK",
			};
			if (parts[0].charAt(0) === "W") {
				room.uno.change = parts[1];
				colourChanged = true;
			}
			//make last card less spammy
			this.add(room.uno.lastplay); //set current card and add to discard pile
			room.uno.top = parts[0];
			room.uno.discard.push(parts[0]);
			//remove card from ahnd
			room.uno.data[userid].splice(room.uno.data[userid].indexOf(parts[0]), 1);
			//set next player
			getNextPlayer(roomid);
			//apply the effects of the card
			applyEffects(this, roomid, room.uno.player, parts[0]);
			//clear the previous timer
			clearDQ(roomid);
			user.sendTo(roomid, "|uhtmlchange|" + room.uno.rand.toString() + room.uno.id + "|");
			room.uno.postuhtml++;
			this.add("|uhtml|post" + room.uno.postuhtml + "|<b>" + user.name + " played </b> " + getCard(room.uno.top));
			room.uno.lastplay = "|uhtmlchange|post" + room.uno.postuhtml + "|" + user.name + " played <b>" + getCardName(room.uno.top) + "</b>";
			room.update();
			//check for a winner or UNO
			if (room.uno.data[userid].length === 0) {
				//clear out last card
				this.add(room.uno.lastplay);
				//announce winner
				this.add("|raw|<b>Congratulations to " + user.name + " for winning!</b>");
				//give pot
				/*if (room.uno.pot) {
					let winnings = room.unoroom.start * room.uno.pot;
					Economy.writeMoney(userid, winnings);
					this.add(user.name + " has won " + winnings + " bucks!");
				}*/
				room.update();
				//end game
				destroy(roomid);
				return;
			}
			if (room.uno.data[userid].length === 1) this.add("|raw|<font size=6><b>UNO!</b></font>");
			if (colourChanged) this.add("|raw|<font color=\"" + colourTable[parts[1]].toLowerCase().replace("yellow", "orange") + "\">The colour has been changed to <b>" + colourTable[parts[1]] + "</b></font>.");
			setTimeout(function () {
				initTurn(self, roomid);
			}, 200);
			break;
		case 'draw':
			if (!room.uno || !room.uno.start || userid !== room.uno.player) return false;
			if (room.uno.lastDraw) return false;
			let receivedCards = receiveCard(userid, roomid);
			let CCC = buildGameScreen(userid, roomid, room.uno.data[userid], room.uno.rand.toString() + room.uno.id, "You have drawn a " + receivedCards.join(" ").replace(/^R/i, "Red ").replace(/^B/i, "Blue ").replace(/^Y/i, "Yellow ").replace(/^G/i, "Green ").replace("W+4", "Wild Draw Four").replace("WW", "Wildcard") + " card", true);
			room.uno.lastDraw = receivedCards.join("");
			Users(userid).sendTo(roomid, CCC);
			this.add("|raw|</b>" + user.name + "</b> has drawn a card!");
			room.update();
			break;
		case 'display':
		case 'repost':
			if (!room.uno || !room.uno.start || userid !== room.uno.player) return false;
			user.sendTo(roomid, "|uhtmlchange|" + room.uno.rand.toString() + room.uno.id + "|");
			initTurn(this, roomid, true);
			break;
		case 'pass':
			if (!room.uno || !room.uno.start || userid !== room.uno.player) return false;
			if (!room.uno.lastDraw) return false;
			this.add("|raw|</b>" + user.name + "</b> has passed!");
			user.sendTo(roomid, "|uhtmlchange|" + room.uno.rand.toString() + room.uno.id + "|");
			if (room.uno.lastplay) this.add(room.uno.lastplay);
			clearDQ(roomid);
			getNextPlayer(roomid);
			initTurn(this, roomid);
			room.update();
			break;
		case 'end':
			if (!room.uno) return this.errorReply("No game of UNO in this room to end.");
			if (!this.can('mute', null, room)) return this.errorReply("You must be % or higher to end a game of UNO.");
			if (room.uno.pot && !this.can('ban')) return this.errorReply("You cannot end a game that is for bucks!");
			if (room.uno.lastplay) this.add(room.uno.lastplay);
			clearDQ(roomid);
			destroy(roomid);
			this.privateModCommand(user.name + " has ended the game");
			this.add("The game was forcibly ended.");
			room.update();
			break;
		case 'getusers':
			if (!room.uno) return false;
			if (!this.runBroadcast()) return;
			this.sendReplyBox("Players: (" + room.uno.list.length + ")<br />" + room.uno.list.join(", "));
			break;
		default:
			if (room.uno && room.uno.start && userid === room.uno.player) return this.parse('/uno display');
			this.parse('/help uno');
			break;
		}
	},
	unohelp: ["/uno new - starts a new game",
		"/uno start - starts the game",
		"/uno end - ends the game",
		"/uno dq [player] - disqualifies the player from the game",
	],
};
