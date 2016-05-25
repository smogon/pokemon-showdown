'use strict';

Wisp.database = new sqlite3.Database('config/users.db', function () {
	Wisp.database.run("CREATE TABLE if not exists users (userid TEXT, name TEXT, bucks INTEGER, lastSeen INTEGER, onlineTime INTEGER)");
});

const fs = require('fs');
const moment = require('moment');

let shopTitle = 'Wisp Shop';
let serverIp = '158.69.196.64';

let prices = {
	"customsymbol": 5,
	"leagueroom": 5,
	"fix": 10,
	"declare": 15,
	"poof": 20,
	"customavatar": 25,
	"animatedavatar": 35,
	"infobox": 40,
	"leagueshop": 55,
	"chatroom": 70,
};

let Economy = global.Economy = {
	readMoney: function (userid, callback) {
		if (!callback) return false;
		userid = toId(userid);
		Wisp.database.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function (err, rows) {
			if (err) return console.log(err);
			callback((rows[0] ? rows[0].bucks : 0));
		});
	},
	writeMoney: function (userid, amount, callback) {
		userid = toId(userid);
		Wisp.database.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function (err, rows) {
			if (rows.length < 1) {
				Wisp.database.run("INSERT INTO users(userid, bucks) VALUES ($userid, $amount)", {$userid: userid, $amount: amount}, function (err) {
					if (err) return console.log(err);
					if (callback) return callback();
				});
			} else {
				amount += rows[0].bucks;
				Wisp.database.run("UPDATE users SET bucks=$amount WHERE userid=$userid", {$amount: amount, $userid: userid}, function (err) {
					if (err) return console.log(err);
					if (callback) return callback();
				});
			}
		});
	},
	logTransaction: function (message) {
		if (!message) return false;
		fs.appendFile('logs/transactions.log', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},

	logDice: function (message) {
		if (!message) return false;
		fs.appendFile('logs/dice.log', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
};

exports.commands = {
	moneylog: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /moneylog [number] to view the last x lines OR /moneylog [text] to search for text.");
		let word = false;
		if (isNaN(Number(target))) word = true;
		let lines = fs.readFileSync('logs/transactions.log', 'utf8').split('\n').reverse();
		let output = '';
		let count = 0;
		let regex = new RegExp(target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");

		if (word) {
			output += 'Displaying last 50 lines containing "' + target + '":\n';
			for (let line in lines) {
				if (count >= 50) break;
				if (!~lines[line].search(regex)) continue;
				output += lines[line] + '\n';
				count++;
			}
		} else {
			if (target > 100) target = 100;
			output = lines.slice(0, (lines.length > target ? target : lines.length));
			output.unshift("Displaying the last " + (lines.length > target ? target : lines.length) + " lines:");
			output = output.join('\n');
		}
		user.popup(output);
	},

	atm: 'wallet',
	wallet: function (target, room, user) {
		if (!target) target = user.name;
		if (!this.runBroadcast()) return;
		let userid = toId(target);
		if (userid.length < 1) return this.sendReply("/wallet - Please specify a user.");
		if (userid.length > 19) return this.sendReply("/wallet - [user] can't be longer than 19 characters.");

		Economy.readMoney(userid, money => {
			this.sendReplyBox(Tools.escapeHTML(target) + " has " + money + ((money === 1) ? " buck." : " bucks."));
			if (this.broadcasting) room.update();
		});
	},

	gb: 'givebucks',
	givebucks: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /givebucks [user], [amount]");
		let splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /givebucks [user], [amount]");
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/givebucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/givebucks - [user] can't be longer than 19 characters");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/givebucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/givebucks - You can't give more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/givebucks - You can't give less than one buck.");

		Economy.writeMoney(targetUser, amount);
		this.sendReply(Tools.escapeHTML(targetUser) + " has received " + amount + ((amount === 1) ? " buck." : " bucks."));
		Economy.logTransaction(user.name + " has given " + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
	},

	takebucks: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /takebucks [user], [amount]");
		let splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /takebucks [user], [amount]");
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/takebucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/takebucks - [user] can't be longer than 19 characters");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/takebucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/takebucks - You can't take more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/takebucks - You can't take less than one buck.");

		Economy.writeMoney(targetUser, -amount);
		this.sendReply("You removed " + amount + ((amount === 1) ? " buck " : " bucks ") + " from " + Tools.escapeHTML(targetUser));
		Economy.logTransaction(user.name + " has taken " + amount + ((amount === 1) ? " buck " : " bucks ") + " from " + targetUser);
	},

	transferbucks: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /transferbucks [user], [amount]");
		let splitTarget = target.split(',');
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();
		if (!splitTarget[1]) return this.sendReply("Usage: /transferbucks [user], [amount]");

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/transferbucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/transferbucks - [user] can't be longer than 19 characters.");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/transferbucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/transferbucks - You can't transfer more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/transferbucks - You can't transfer less than one buck.");

		Economy.readMoney(user.userid, money => {
			if (money < amount) return this.sendReply("/transferbucks - You can't transfer more bucks than you have.");
			Economy.writeMoney(user.userid, -amount, () => {
				Economy.writeMoney(targetUser, amount, () => {
					this.sendReply("You've sent " + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
					Economy.logTransaction(user.name + " has transfered " + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
					if (Users.getExact(targetUser) && Users.getExact(targetUser)) Users.getExact(targetUser).popup(user.name + " has sent you " + amount + ((amount === 1) ? " buck." : " bucks."));
				});
			});
		});
	},

	buy: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /buy [item]");
		let targetSplit = target.split(',');
		for (let u in targetSplit) targetSplit[u] = targetSplit[u].trim();
		let item = targetSplit[0];
		let itemid = toId(item);
		let matched = false;

		if (!prices[itemid]) return this.sendReply("/buy " + item + " - Item not found.");

		Economy.readMoney(user.userid, userMoney => {
			switch (itemid) {
			case 'customsymbol':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom symbol.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a custom symbol for " + prices[itemid] + " bucks.");
				user.canCustomSymbol = true;
				this.sendReplyBox("You have purchased a custom symbol. You may now use /customsymbol [symbol] to change your symbol.");
				matched = true;
				break;
			case 'customavatar':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom avatar.");
				if (!targetSplit[1]) return this.sendReply("Please specify the image you would like as your avatar with /buy customavatar, image url.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a custom avatar for " + prices[itemid] + " bucks. Image: " + targetSplit[1]);
				Wisp.messageSeniorStaff(user.name + " has purchased a custom avatar. Image: " + targetSplit[1]);
				this.sendReply("You have purchased a custom avatar. It will be added shortly.");
				matched = true;
				break;
			case 'animatedavatar':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom avatar.");
				if (!targetSplit[1]) return this.sendReply("Please specify the image you would like as your avatar with /buy animatedavatar, image url.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased an animated avatar for " + prices[itemid] + " bucks. Image: " + targetSplit[1]);
				Wisp.messageSeniorStaff(user.name + " has purchased an animated avatar. Image: " + targetSplit[1]);
				this.sendReply("You have purchased an animated avatar. It will be added shortly");
				matched = true;
				break;
			case 'chatroom':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a chat room.");
				if (!targetSplit[1]) return this.sendReply("Please specify a name for the chat room with /buy chatroom, name.");
				if (Rooms.rooms[toId(targetSplit[1])]) return this.sendReply("You can't purchase a room that already exists.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a chat room for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased a chat room. Name: " + targetSplit[1]);
				this.sendReply("You've purchased a chat room. You will be notified when it has been created.");
				matched = true;
				break;
			case 'leagueroom':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a league room.");
				if (!targetSplit[1]) return this.sendReply("Please specify your league name with /buy leagueroom, name.");
				if (Rooms.rooms[toId(targetSplit[1])]) return this.sendReply("You can't purchase a league that already exists.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a league room for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased a league room. Name: " + targetSplit[1]);
				this.sendReply("You've purchased a league room. You will be notified when it has been created.");
				matched = true;
				break;
			case 'poof':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a poof.");
				if (!targetSplit[1]) return this.sendReply("Please specify the poof message you would like to buy with /buy poof, poof message.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a poof message for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased a poof message. Message: " + targetSplit[1]);
				this.sendReply("You've purchased a poof message. It will be added shortly.");
				matched = true;
				break;
			case 'infobox':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase an infobox.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased an infobox for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased an infobox.");
				this.sendReply("You have purchased an infobox. Please put everything you want on it in a pastebin including the command then send it to an Administrator, if you have any questions about what you can add pm an Admin. Please note that it will not be made instantly.");
				matched = true;
				break;
			case 'declare':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a declare.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a declare for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased a declare.");
				this.sendReply("You have purchased a declare. Please message an Administrator with the message you would like to declare.");
				matched = true;
				break;
			case 'fix':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a fix.");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a fix for " + prices[itemid] + " bucks.");
				Wisp.messageSeniorStaff(user.name + " has purchased a fix.");
				this.sendReply("You have purchased a fix. Please message an Administrator with what needs fixed.");
				matched = true;
				break;
			case 'leagueshop':
				if (userMoney < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a fix.");
				if (!targetSplit[1]) return this.sendReply("Please specify the room you would like to buy a league shop for with /buy leagueshop, room.");
				if (!Rooms(toId(targetSplit[1]))) return this.sendReply("That room doesn't exist.");
				let targetRoom = Rooms(targetSplit[1]);
				if (!targetRoom.isLeague) return this.sendReply(targetRoom.title + " isn't a league!");
				if (targetRoom.shop) return this.sendReply(targetRoom.title + " already has a league shop!");
				Economy.writeMoney(user.userid, prices[itemid] * -1);
				Economy.logTransaction(user.name + " has purchased a league shop for " + prices[itemid] + " bucks. Room: " + targetRoom.title);
				matched = true;
				this.sendReply(targetRoom.title + " has received a league shop. The room owners of that room should view /leagueshop help to view the league shop commands.");
				targetRoom.add('|raw|<div class="broadcast-green"><b>' + user.name + ' has just purchased a league shop for this room.</b></div>');
				targetRoom.update();
				targetRoom.shop = {};
				targetRoom.shopList = [];
				targetRoom.chatRoomData.shop = targetRoom.shop;
				targetRoom.chatRoomData.shopList = targetRoom.shopList;
				Rooms.global.writeChatRoomData();
				break;
			}

			if (matched) return this.sendReply("You now have " + (userMoney - prices[itemid]) + " bucks left.");
		});
	},

	shop: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<center><h4><b><u>' + shopTitle + '</u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Item</th><th>Description</th><th>Price</th></tr>' +
			'<tr><td>Custom Symbol</td><td>Buys a custom symbol to go in front of your name. (Temporary until restart)</td><td>5</td></tr>' +
			'<tr><td>League Room</td><td>Purchases a room for your league. May be deleted if league becomes inactive.</td><td>5</td></tr>' +
			'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or infobox (don\'t buy if you have neither)!</td><td>10</td></tr>' +
			'<tr><td>Declare</td><td>You get the ability to have a message declared in the lobby. This can be used for league advertisement (not server)</td><td>15</td></tr>' +
			'<tr><td>Poof</td><td>Buy a poof message to be added into the pool of possible poofs</td><td>20</td></tr>' +
			'<tr><td>Custom Avatar</td><td>Buys a custom avatar to be applied to your name (You supply, must be .png format. Images larger than 80x80 may not show correctly.)</td><td>25</td></tr>' +
			'<tr><td>Animated Avatar</td><td>Buys an animated avatar to be applied to your name (You supply, must be .gif format. Images larger than 80x80 may not show correctly.)</td><td>35</td></tr>' +
			'<tr><td>Infobox</td><td>Buys an infobox that will be viewable with a command such as /tailz.</td><td>40</td></tr>' +
			'<tr><td>League Shop</td><td>Buys a fully customizable shop for your league room. The bucks earned from purchases go to the room founder or room bank.</td><td>55</td></tr>' +
			'<tr><td>Chat Room</td><td>Buys a chatroom for you to own (comes with a free welcome message)</td><td>70</td></tr>' +
			'</table><br />To buy an item from the shop, use /buy [item].<br />All sales final, no refunds will be provided.</center>'
		);
	},

	roomshop: 'leagueshop',
	leagueshop: function (target, room, user) {
		if (!room.isLeague) return this.sendReply('/leagueshop - This room is not a league.');
		if (!room.shop) return this.sendReply('/leagueshop - This room does not have a shop, purchase one with /buy leagueshop, ' + room.title);
		if (!room.founder) return this.sendReply('/leagueshop - league shops require a room founder.');
		if (!room.shopList) room.shopList = [];
		if (!target) target = '';

		let cmdParts = target.split(' ');
		let cmd = cmdParts.shift().trim().toLowerCase();
		let params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });

		switch (cmd) {
		case 'list':
		case 'view':
		default:
			if (!this.runBroadcast()) return;
			if (room.shopList.length < 1) return this.sendReplyBox('<center><b><u>This shop has no items!</u></b></center>');
			let output = '<center><h4><b><u><font color="#24678d">' + Tools.escapeHTML(room.title) + '\'s Shop</font></u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Item</th><th>Description</th><th>Price</th></tr>';
			for (let u in room.shopList) {
				if (!room.shop[room.shopList[u]] || !room.shop[room.shopList[u]].name || !room.shop[room.shopList[u]].description || !room.shop[room.shopList[u]].price) continue;
				output += '<tr><td><button name="send" value="/leagueshop buy ' + Tools.escapeHTML(room.shopList[u]) + '" >' + Tools.escapeHTML(room.shop[room.shopList[u]].name) +
				'</button></td><td>' + Tools.escapeHTML(room.shop[room.shopList[u]].description.toString()) + '</td><td>' + room.shop[room.shopList[u]].price + '</td></tr>';
			}
			output += '</center><br />';
			this.sendReplyBox(output);
			break;
		case 'add':
			if (!user.can('roommod', null, room)) return this.sendReply('/leagueshop - Access denied.');
			if (params.length < 3) return this.sendReply('Usage: /leagueshop add [item name], [description], [price]');
			if (!room.shopList) room.shopList = [];
			let name = params.shift();
			let description = params.shift();
			let price = Number(params.shift());
			if (isNaN(price)) return this.sendReply('Usage: /leagueshop add [item name], [description], [price]');
			room.shop[toId(name)] = {};
			room.shop[toId(name)].name = name;
			room.shop[toId(name)].description = description;
			room.shop[toId(name)].price = price;
			room.shopList.push(toId(name));
			room.chatRoomData.shop = room.shop;
			room.chatRoomData.shopList = room.shopList;
			Rooms.global.writeChatRoomData();
			this.sendReply('Added "' + name + '" to the league shop for ' + price + ' ' + ((price === 1) ? " buck." : " bucks.") + '.');
			break;
		case 'remove':
		case 'rem':
		case 'del':
		case 'delete':
			if (!user.can('roommod', null, room)) return this.sendReply('/leagueshop - Access denied.');
			if (params.length < 1) return this.sendReply('Usage: /leagueshop delete [item name]');
			let item = params.shift();
			if (!room.shop[toId(item)]) return this.sendReply('/leagueshop - Item "' + item + '" not found.');
			delete room.shop[toId(item)];
			let index = room.shopList.indexOf(toId(item));
			if (index > -1) {
				room.shopList.splice(index, 1);
			}
			this.sendReply('Removed "' + item + '" from the league shop.');
			break;
		case 'buy':
			if (params.length < 1) return this.sendReply('Usage: /leagueshop buy [item name]');
			item = params.shift();
			if (!room.shop[toId(item)]) return this.sendReply('/leagueshop - Item "' + item + '" not found.');
			Economy.readMoney(user.userid, money => {
				if (money < room.shop[toId(item)].price) return this.sendReply('You don\'t have enough bucks to purchase a ' + item + '. You need ' + ((money - room.shop[toId(item)].price) * -1) + ' more bucks.');
				if (!room.shopBank) room.shopBank = room.founder;
				this.parse('/transferbucks ' + room.shopBank + ',' + room.shop[toId(item)].price);
				fs.appendFile('logs/leagueshop_' + room.id + '.txt', '[' + new Date().toJSON() + '] ' + user.name + ' has purchased a ' +
					room.shop[toId(item)].price + ' for ' + room.shop[toId(item)].price + ' ' + ((price === 1) ? " buck." : " bucks.") + '.\n'
				);
				room.add(user.name + ' has purchased a ' + room.shop[toId(item)].name + ' for ' + room.shop[toId(item)].price + ' ' + ((price === 1) ? " buck." : " bucks.") + '.');
			});
			break;
		case 'help':
			if (!this.runBroadcast()) return;
			this.sendReplyBox('The following is a list of league shop commands: <br />' +
				'/leagueshop view/list - Shows a complete list of shop items.`<br />' +
				'/leagueshop add [item name], [description], [price] - Adds an item to the shop.<br />' +
				'/leagueshop delete/remove [item name] - Removes an item from the shop.<br />' +
				'/leagueshop buy [item name] - Purchases an item from the shop.<br />' +
				'/leagueshop viewlog [number of lines OR word to search for] - Views the last 15 lines in the shop log.<br />' +
				'/leagueshop bank [username] - Sets the room bank to [username]. The room bank receives all funds from purchases in the shop.'
			);
			break;
		case 'setbank':
		case 'bank':
			if (user.userid !== room.founder && !user.can('seniorstaff')) return this.sendReply('/leagueshop - Access denied.');
			if (params.length < 1) return this.sendReply('Usage: /leagueshop bank [username]');
			let bank = params.shift();
			room.shopBank = toId(bank);
			room.chatRoomData.shopBank = room.shopBank;
			Rooms.global.writeChatRoomData();
			this.sendReply('The room bank is now set to ' + room.shopBank);
			break;
		case 'log':
		case 'viewlog':
			if (!user.can('roommod', null, room)) return this.sendReply('/leagueshop - Access denied.');
			target = params.shift();
			let lines = 0;
			if (!target.match('[^0-9]')) {
				lines = parseInt(target || 15);
				if (lines > 100) lines = 100;
			}
			let filename = 'logs/leagueshop_' + room.id + '.txt';
			let command = 'tail -' + lines + ' ' + filename;
			let grepLimit = 100;
			if (!lines || lines < 0) { // searching for a word instead
				if (target.match(/^["'].+["']$/)) target = target.substring(1, target.length - 1);
				command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m" + grepLimit +
					" -i '" + target.replace(/\\/g, '\\\\\\\\').replace(/["'`]/g, '\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g, '[$&]') + "'";
			}

			require('child_process').exec(command, function (error, stdout, stderr) {
				if (error && stderr) {
					user.popup('/leagueshop viewlog erred - the shop log does not support Windows');
					console.log('/leagueshop viewlog error: ' + error);
					return false;
				}
				if (lines) {
					if (!stdout) {
						user.popup('The log is empty.');
					} else {
						user.popup('Displaying the last ' + lines + ' lines of shop purchases:\n\n' + stdout);
					}
				} else {
					if (!stdout) {
						user.popup('No purchases containing "' + target + '" were found.');
					} else {
						user.popup('Displaying the last ' + grepLimit + ' logged purchases containing "' + target + '":\n\n' + stdout);
					}
				}
			});
			break;
		}
	},

	bucks: function (target, room, user) {
		if (!this.runBroadcast()) return;

		Wisp.database.all("SELECT SUM(bucks) FROM users;", (err, rows) => {
			if (err) return console.log("bucks1: " + err);
			let totalBucks = rows[0]['SUM(bucks)'];
			Wisp.database.all("SELECT userid, SUM(bucks) AS total FROM users GROUP BY bucks HAVING TOTAL > 0;", (err, rows) => {
				if (err) return console.log("bucks2: " + err);
				let userCount = rows.length;
				Wisp.database.all("SELECT * FROM users ORDER BY bucks DESC LIMIT 1;", (err, rows) => {
					if (err) return console.log("bucks3: " + err);
					let richestUser = rows[0].userid;
					let richestUserMoney = rows[0].bucks;
					if (Users.getExact(richestUser)) richestUser = Users.getExact(richestUser).name;
					Wisp.database.all("SELECT AVG(bucks) FROM users WHERE bucks > 0;", (err, rows) => {
						if (err) return console.log("bucks4: " + err);
						let averageBucks = rows[0]['AVG(bucks)'];

						this.sendReplyBox("The richest user is currently <b><font color=#24678d>" + Tools.escapeHTML(richestUser) + "</font></b> with <b><font color=#24678d>" +
							richestUserMoney + "</font></b> bucks.</font></b><br />There is a total of <b><font color=#24678d>" +
							userCount + "</font></b> users with at least one buck.<br /> The average user has " +
							"<b><font color=#24678d>" + Math.round(averageBucks) + "</font></b> bucks.<br /> There is a total of <b><font color=#24678d>" +
							totalBucks + "</font></b> bucks in the economy."
						);
						room.update();
					});
				});
			});
		});
	},

	richestusers: 'richestuser',
	richestuser: function (target, room, user) {
		if (!target) target = 10;
		target = Number(target);
		if (isNaN(target)) target = 10;
		if (!this.runBroadcast()) return;
		if (this.broadcasting && target > 10) target = 10; // limit to 10 while broadcasting
		if (target > 500) target = 500;

		let self = this;

		function showResults(rows) {
			let output = '<table border="1" cellspacing ="0" cellpadding="3"><tr><th>Rank</th><th>Name</th><th>Bucks</th></tr>';
			let count = 1;
			for (let u in rows) {
				if (!rows[u].bucks || rows[u].bucks < 1) continue;
				let username;
				if (rows[u].name !== null) {
					username = rows[u].name;
				} else {
					username = rows[u].userid;
				}
				output += '<tr><td>' + count + '</td><td>' + Tools.escapeHTML(username) + '</td><td>' + rows[u].bucks + '</td></tr>';
				count++;
			}
			self.sendReplyBox(output);
			room.update();
		}

		Wisp.database.all("SELECT userid, bucks, name FROM users ORDER BY bucks DESC LIMIT $target;", {$target: target}, function (err, rows) {
			if (err) return console.log("richestuser: " + err);
			showResults(rows);
		});
	},

	customsymbol: function (target, room, user) {
		let bannedSymbols = ['!', '|', '‽', '\u2030', '\u534D', '\u5350', '\u223C'];
		for (let u in Config.groups) if (Config.groups[u].symbol) bannedSymbols.push(Config.groups[u].symbol);
		if (!user.canCustomSymbol && !user.can('vip')) return this.sendReply('You need to buy this item from the shop to use.');
		if (!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
		if (target.match(/([a-zA-Z ^0-9])/g) || bannedSymbols.indexOf(target) >= 0) {
			return this.sendReply('This symbol is banned.');
		}
		user.customSymbol = target;
		user.updateIdentity();
		user.canCustomSymbol = false;
		this.sendReply('Your symbol is now ' + target + '. It will be saved until you log off for more than an hour, or the server restarts. You can remove it with /resetsymbol');
	},

	removesymbol: 'resetsymbol',
	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply("You don't have a custom symbol!");
		delete user.customSymbol;
		user.updateIdentity();
		this.sendReply('Your symbol has been removed.');
	},

	profile: function (target, room, user) {
		if (!target) target = user.name;
		if (toId(target).length > 19) return this.sendReply("Usernames may not be more than 19 characters long.");
		if (toId(target).length < 1) return this.sendReply(target + " is not a valid username.");
		if (!this.runBroadcast()) return;
		let targetUser = Users.get(target);
		let username = (targetUser ? targetUser.name : target);
		let userid = toId(username);
		let avatar = (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/167.png");
		if (targetUser) {
			avatar = (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png");
		}

		let userSymbol = (Users.usergroups[userid] ? Users.usergroups[userid].substr(0, 1) : "Regular User");
		let userGroup = (Config.groups[userSymbol] ? Config.groups[userSymbol].name : "Regular User");
		let regdate = "(Unregistered)";

		Economy.readMoney(userid, bucks => {
			Wisp.regdate(userid, date => {
				if (date) regdate = regdate = moment(date).format("MMMM DD, YYYY");
				Wisp.lastSeen(userid, online => {
					showProfile(bucks, regdate, online);
				});
			});
			let self = this;
			function showProfile(bucks, regdate, lastOnline) {
				lastOnline = (lastOnline ? moment(lastOnline).format("MMMM Do YYYY, h:mm:ss A") + ' EST. (' + moment(lastOnline).fromNow() + ')' : "Never");
				if (targetUser && targetUser.connected) lastOnline = '<font color=green>Currently Online</font>';
				let profile = '';
				profile += '<img src="' + avatar + '" height=80 width=80 align=left>';
				profile += '&nbsp;<font color=#b30000><b>Name: </font><b><font color="' + Wisp.hashColor(toId(username)) + '">' + Tools.escapeHTML(username) + '</font></b><br />';
				profile += '&nbsp;<font color=#b30000><b>Registered: </font></b>' + regdate + '<br />';
				profile += '&nbsp;<font color=#b30000><b>Rank: </font></b>' + userGroup + (Users.vips[userid] ? ' (<font color=#6390F0><b>VIP User</b></font>)' : '') + '<br />';
				if (bucks) profile += '&nbsp;<font color=#b30000><b>Bucks: </font></b>' + bucks + '<br />';
				profile += '&nbsp;<font color=#b30000><b>Last Online: </font></b>' + lastOnline;
				profile += '<br clear="all">';
				self.sendReplyBox(profile);
				room.update();
			}
		});
	},

	economycode: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox("Economy code by: <a href=\"https://gist.github.com/jd4564/d6e8f4140b7abc9295e1\">jd</a>");
	},
};
