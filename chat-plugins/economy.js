var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('config/users.db', function() {
	db.run("CREATE TABLE if not exists users (userid TEXT, name TEXT, bucks INTEGER)");
});

var fs = require('fs');
var http = require('http');
var MD5 = require('MD5');
var shopTitle = 'Shop';
var serverIp = '127.0.0.1';

var prices = {
	"customsymbol": 5,
	"leagueroom": 5,
	"fix": 10,
	"declare": 15,
	"poof": 20,
	"customavatar": 35,
	"animatedavatar": 40,
	"rainercard": 40,
	"leagueshop": 55,
	"chatroom": 70,
	"roomintro": 30,
	"trainercarddesign": 20,
	"globalvoice": 1000,
	"userlisticon": 750,
};

function readMoney(userid, callback) {
	if (!callback) return false;
	userid = toId(userid);
	db.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function(err,rows) {
		if (err) return console.log(err);
		callback((rows[0] ? rows[0].bucks : 0));
	});
}
global.readMoney = readMoney;

function writeMoney(userid, amount, callback) {
	userid = toId(userid);
	db.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function(err,rows) {
		if (rows.length < 1) {
			db.run("INSERT INTO users(userid, bucks) VALUES ($userid, $amount)", {$userid: userid, $amount: amount}, function(err) {
				if (err) return console.log(err);
				if (callback) callback();
			});
		} else {
			amount += rows[0].bucks;
			db.run("UPDATE users SET bucks=$amount WHERE userid=$userid", {$amount: amount, $userid: userid}, function(err) {
				if (err) return console.log(err);
				if (callback) callback();
			});
		}
	});
}
global.writeMoney = writeMoney;

function logTransaction (message) {
	if (!message) return false;
	fs.appendFile('logs/transactions.log','['+new Date().toUTCString()+'] '+message+'\n');
}
global.logTransaction = logTransaction;
function logDice (message) {
	if (!message) return false;
	fs.appendFile('logs/dice.log','['+new Date().toUTCString()+'] '+message+'\n');
}

function messageSeniorStaff (message) {
	for (var u in Users.users) {
		if (!Users.users[u].connected || !Users.users[u].can('declare')) continue;
		Users.users[u].send('|pm|~Server|'+Users.users[u].getIdentity()+'|'+message);
	}
}

exports.commands = {

	moneylog: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /moneylog [number] to view the last x lines OR /moneylog [text] to search for text.");
		if (isNaN(Number(target))) var word = true;
		var lines = fs.readFileSync('logs/transactions.log', 'utf8').split('\n').reverse();
		var output = '';
		var count = 0;
		var regex = new RegExp(target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi");

		if (word) {
			output += 'Displaying last 50 lines containing "' + target + '":\n';
			for (var line in lines) {
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
		if (!this.canBroadcast()) return;
		var userid = toId(target);
		if (userid.length < 1) return this.sendReply("/wallet - Please specify a user.");
		if (userid.length > 19) return this.sendReply("/wallet - [user] can't be longer than 19 characters.");

		var self = this;
		readMoney(userid, function(money) {
			self.sendReplyBox(Tools.escapeHTML(target) + " has " + money + ((money === 1) ? " buck." : " bucks."));
			if (self.broadcasting) room.update();
		});
	},

	givebucks: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /givebucks [user], [amount]");
		var splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /givebucks [user], [amount]");
		for (var u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		var targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/givebucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/givebucks - [user] can't be longer than 19 characters");

		var amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/givebucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/givebucks - You can't give more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/givebucks - You can't give less than one buck.");

		writeMoney(targetUser, amount);
		this.sendReply(Tools.escapeHTML(targetUser) + " has received " + amount + ((amount === 1) ? " buck." : " bucks."));
		logTransaction(user.name + " has given " + + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
	},

	takebucks: function (target, room, user) {
		if (!this.can('bucks')) return false;
		if (!target) return this.sendReply("Usage: /takebucks [user], [amount]");
		var splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /takebucks [user], [amount]");
		for (var u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		var targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/takebucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/takebucks - [user] can't be longer than 19 characters");

		var amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/takebucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/takebucks - You can't take more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/takebucks - You can't take less than one buck.");

		writeMoney(targetUser, -amount);
		this.sendReply("You removed "  + amount + ((amount === 1) ? " buck " : " bucks ") + " from " + Tools.escapeHTML(targetUser));
		logTransaction(user.name + " has taken " + + amount + ((amount === 1) ? " buck " : " bucks ") + " from " + targetUser);
	},

	transferbucks: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /transferbucks [user], [amount]");
		var splitTarget = target.split(',');
		for (var u in splitTarget) splitTarget[u] = splitTarget[u].trim();
		if (!splitTarget[1]) return this.sendReply("Usage: /transferbucks [user], [amount]");

		var targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/transferbucks - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/transferbucks - [user] can't be longer than 19 characters.");

		var amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/transferbucks - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/transferbucks - You can't transfer more than 1000 bucks at a time.");
		if (amount < 1) return this.sendReply("/transferbucks - You can't transfer less than one buck.");

		var self = this;
		readMoney(user.userid, function (money) {
			if (money < amount) return self.sendReply("/transferbucks - You can't transfer more bucks than you have.");
			writeMoney(user.userid, -amount, function() {
				writeMoney(targetUser, amount, function() {
					self.sendReply("You've sent " + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
					logTransaction(user.name + " has transfered " + amount + ((amount === 1) ? " buck " : " bucks ") + " to " + targetUser);
					if (Users.getExact(targetUser) && Users.getExact(targetUser)) Users.getExact(targetUser).popup(user.name + " has sent you " + amount + ((amount === 1) ? " buck." : " bucks.")) 
				});
			});
		});
	},

	buy: function (target, room, user) {
	 	if (!target) return this.sendReply("Usage: /buy [item]");
	 	var targetSplit = target.split(',');
	 	for (var u in targetSplit) targetSplit[u] = targetSplit[u].trim();
	 	var item = targetSplit[0];
	 	var itemid = toId(item);
	 	var self = this;
	 	var matched = false;

	 	if (!prices[itemid]) return this.sendReply("/buy " + item + " - Item not found.");

	 	readMoney(user.userid, function(userMoney) {
	 		switch (itemid) {
	 			case 'customsymbol':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom symbol.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a custom symbol for " + prices[itemid] + " bucks.");
	 				user.canCustomSymbol = true;
	 				self.sendReplyBox("You have purchased a custom symbol. You may now use /customsymbol [symbol] to change your symbol.");
	 				matched = true;
	 				break;
	 			case 'customavatar':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom avatar.");
	 				if (!targetSplit[1]) return self.sendReply("Please specify the image you would like as your avatar with /buy customavatar, image url.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a custom avatar for " + prices[itemid] + " bucks. Image: " + targetSplit[1]);
	 				messageSeniorStaff(user.name + " has purchased a custom avatar. Image: " + targetSplit[1]);
	 				self.sendReply("You have purchased a custom avatar. It will be added shortly.");
	 				matched = true;
	 				break;
	 			case 'animatedavatar':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a custom avatar.");
	 				if (!targetSplit[1]) return self.sendReply("Please specify the image you would like as your avatar with /buy animatedavatar, image url.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased an animated avatar for " + prices[itemid] + " bucks. Image: " + targetSplit[1]);
	 				messageSeniorStaff(user.name + " has purchased an animated avatar. Image: " + targetSplit[1]);
	 				self.sendReply("You have purchased an animated avatar. It will be added shortly");
	 				matched = true;
	 				break;
	 			case 'chatroom':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a chat room.");
	 				if (!targetSplit[1]) return self.sendReply("Please specify a name for the chat room with /buy chatroom, name.");
	 				if (Rooms.rooms[toId(targetSplit[1])]) return self.sendReply("You can't purchase a room that already exists.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a chat room for " + prices[itemid] + " bucks.");
	 				messageSeniorStaff(user.name + " has purchased a chat room. Name: " + targetSplit[1]);
	 				self.sendReply("You've purchased a chat room. You will be notified when it has been created.");
	 				matched = true;
	 				break;
	 			case 'leagueroom':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a league room.");
	 				if (!targetSplit[1]) return self.sendReply("Please specify your league name with /buy leagueroom, name.");
	 				if (Rooms.rooms[toId(targetSplit[1])]) return this.sendReply("You can't purchase a league that already exists.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a league room for " + prices[itemid] + " bucks.");
	 				messageSeniorStaff(user.name + " has purchased a league room. Name: " + targetSplit[1]);
	 				self.sendReply("You've purchased a league room. You will be notified when it has been created.");
	 				matched = true;
	 				break;
	 			case 'poof':
	 				if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a poof.");
	 				if (!targetSplit[1]) return self.sendReply("Please specify the poof message you would like to buy with /buy poof, poof message.");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a poof message for " + prices[itemid] + " bucks.");
	 				messageSeniorStaff(user.name + " has purchased a poof message. Message: " + targetSplit[1]);
	 				self.sendReply("You've purchased a poof message. It will be added shortly.");
	 				matched = true;
	 				break;
				case 'trainercard':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase an infobox.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased an infobox for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased an infobox.");
					self.sendReply("You have purchased an infobox. Please put everything you want on it in a pastebin including the command then send it to an Administrator, if you have any questions about what you can add pm an Admin. Please note that it will not be made instantly.");
					matched = true;
					break;
				case 'declare':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a declare.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased a declare for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased a declare.");
					self.sendReply("You have purchased a declare. Please message an Administrator with the message you would like to declare.");
					matched = true;
					break;
				case 'fix':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a fix.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased a fix for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased a fix.");
					self.sendReply("You have purchased a fix. Please message an Administrator with what needs fixed.");
					matched = true;
					break;
				case 'leagueshop':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a league shop");
					if (!targetSplit[1]) return self.sendReply("Please specify the room you would like to buy a league shop for with /buy leagueshop, room.");
					if (!Rooms(toId(targetSplit[1]))) return self.sendReply("That room doesn't exist.");
	 				var targetRoom = Rooms(targetSplit[1]);
	 				if (!targetRoom.isLeague) return self.sendReply(targetRoom.title + " isn't a league!");
	 				if (targetRoom.shop) return self.sendReply(targetRoom.title + " already has a league shop!");
	 				writeMoney(user.userid, prices[itemid] * -1);
	 				logTransaction(user.name + " has purchased a league shop for " + prices[itemid] + " bucks. Room: " + targetRoom.title);
					matched = true;
	 				self.sendReply(targetRoom.title + " has received a league shop. The room owners of that room should view /leagueshop help to view the league shop commands.");
	 				targetRoom.add('|raw|<div class="broadcast-green"><b>'+user.name+' has just purchased a league shop for this room.</b></div>');
	 				targetRoom.update();
	 				targetRoom.shop = new Object();
	 				targetRoom.shopList = new Array();
					targetRoom.chatRoomData.shop = targetRoom.shop;
					targetRoom.chatRoomData.shopList = targetRoom.shopList;
					Rooms.global.writeChatRoomData();
					break;
				case 'roomintro':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a room intro.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased a room intro for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased a room intro.");
					self.sendReply("You have purchased a roomintro. Please put everything you want on it in a pastebin including the command then send it to an Administrator, if you have any questions about what you can add pm an Admin. Please note that it will not be made instantly.");
					matched = true;
					break;
				case 'trainercarddesign':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a trainer card design.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased a trainer card design for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased a trainer card design.");
					self.sendReply("You have purchased a trainer card design. Please put everything you want on it in a pastebin including the command then send it to an Administrator, if you have any questions about what you can add pm an Admin. Please note that it will not be made instantly.");
					matched = true;
					break;
				case 'globalvoice':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase global voice.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased global voice for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased global voice.");
					matched = true;
					break;
				case 'userlisticon':
					if (userMoney < prices[itemid]) return self.sendReply("You need " + (prices[itemid] - userMoney) + " more bucks to purchase a userlist icon.");
					writeMoney(user.userid, prices[itemid] * -1);
					logTransaction(user.name + " has purchased a userlist icon for " + prices[itemid] + " bucks.");
					messageSeniorStaff(user.name + " has purchased a userlist icon design.");
					self.sendReply("You have purchased a userlist icon design. Please get a 32x32 link of this icon and send it to an Administrator, if you have any questions about what you can add pm an Admin. Please note that it will not be made instantly.");
					matched = true;
					break;
	 		}

	 		if (matched) return self.sendReply("You now have " + (userMoney - prices[itemid]) + " bucks left.");
	 	});
	},

	shop: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	this.sendReplyBox('<center><h4><b><u>' + shopTitle + '</u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Item</th><th>Description</th><th>Price</th></tr>' +
	 		'<tr><td>Custom Symbol</td><td>Buys a custom symbol to go in front of your name. (Temporary until restart)</td><td>5</td></tr>' +
	 		'<tr><td>League Room</td><td>Purchases a room for your league. May be deleted if league becomes inactive.</td><td>5</td></tr>' +
	 		'<tr><td>Fix</td><td>Buys the ability to alter your current custom avatar or infobox (don\'t buy if you have neither)</td><td>10</td></tr>' +
	 		'<tr><td>Declare</td><td>You get the ability to have a message declared in the lobby. This can be used for league advertisement (not server)</td><td>15</td></tr>' +
			'<tr><td>Poof</td><td>Buy a poof message to be added into the pool of possible poofs</td><td>20</td></tr>' +
			'<tr><td>Trainer Card Design</td><td>Buys a Trainer Card design from The Laboratory</td><td>20</td></tr>' +
			'<tr><td>Room intro</td><td>Buys a roomintro design from The Laboratory</td><td>30</td></tr>' +
	 		'<tr><td>Custom Avatar</td><td>Buys a custom avatar to be applied to your name (You supply, must be .png format. Images larger than 80x80 may not show correctly.)</td><td>35</td></tr>' +
	 		'<tr><td>Animated Avatar</td><td>Buys an animated avatar to be applied to your name (You supply, must be .gif format. Images larger than 80x80 may not show correctly.)</td><td>40</td></tr>' +
	 		'<tr><td>Trainer Card</td><td>Buys an infobox that will be viewable with a command such as /tailz.</td><td>40</td></tr>' +
	 		'<tr><td>League Shop</td><td>Buys a fully customizable shop for your league room. The bucks earned from purchases go to the room founder or room bank.</td><td>55</td></tr>' +
	 		'<tr><td>Chat Room</td><td>Buys a chatroom for you to own (comes with a free welcome message)</td><td>70</td></tr>' +
	 		'<tr><td>Userlist Icon</td><td>Buys a userlist icon next to your name in 3 different rooms</td><td>750</td></tr>' +
	 		'<tr><td>Chat Room</td><td>Buys global voice (+)</td><td>1000</td></tr>' +
	 		
	 		
	 		'</table><br />To buy an item from the shop, use /buy [item]. <br />Use /currencyhelp to view money-based commands.<br />All sales final, no refunds will be provided.</center>'
	 	);
	},

	roomshop: 'leagueshop',
	leagueshop: function(target, room, user) {
	 	if (!room.shop) return this.sendReply('/leagueshop - This room does not have a shop, purchase one with /buy leagueshop, ' + room.title);
	 	if (!room.founder) return this.sendReply('/leagueshop - league shops require a room founder.');
	 	if (!room.shopList) room.shopList = [];
	 	if (!target) var target = '';
	 	var self = this;

		var cmdParts = target.split(' ');
		var cmd = cmdParts.shift().trim().toLowerCase();
		var params = cmdParts.join(' ').split(',').map(function (param) { return param.trim(); });

	 	switch (cmd) {
	 		case 'list':
	 		case 'view':
	 		default:
	 			if (!this.canBroadcast()) return;
	 			if (room.shopList.length < 1) return this.sendReplyBox('<center><b><u>This shop has no items!</u></b></center>');
	 			var output = '<center><h4><b><u><font color="#24678d">' + Tools.escapeHTML(room.title) + '\'s Shop</font></u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Item</th><th>Description</th><th>Price</th></tr>';
	 			for (var u in room.shopList) {
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
	 			var name = params.shift();
	 			var description = params.shift();
	 			var price = Number(params.shift());
	 			if (isNaN(price)) return this.sendReply('Usage: /leagueshop add [item name], [description], [price]');
	 			var bucks = 'bucks';
	 			if (Number(price) < 2) bucks = 'buck';
	 			room.shop[toId(name)] = new Object();
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
	 			var item = params.shift();
	 			if (!room.shop[toId(item)]) return this.sendReply('/leagueshop - Item "'+item+'" not found.');
	 			delete room.shop[toId(item)];
	 			var index = room.shopList.indexOf(toId(item));
				if (index > -1) {
				    room.shopList.splice(index, 1);
				}
				this.sendReply('Removed "' + item + '" from the league shop.');
				break;
			case 'buy':
				if (params.length < 1) return this.sendReply('Usage: /leagueshop buy [item name]');
				var item = params.shift();
				if (!room.shop[toId(item)]) return this.sendReply('/leagueshop - Item "'+item+'" not found.');
				readMoney(user.userid, function(money) {
					if (money < room.shop[toId(item)].price) return self.sendReply('You don\'t have enough bucks to purchase a '+item+'. You need '+ ((money - room.shop[toId(item)].price) * -1) + ' more bucks.');
					var buck = 'buck';
					if (room.shop[toId(item)].price > 1) buck = 'bucks';
					if (!room.shopBank) room.shopBank = room.founder;
					self.parse('/transferbucks '+room.shopBank+','+room.shop[toId(item)].price);
					fs.appendFile('logs/leagueshop_'+room.id+'.txt', '['+new Date().toJSON()+'] '+user.name+' has purchased a '+room.shop[toId(item)].price+' for '+room.shop[toId(item)].price+' '+buck+'.\n');
					room.add(user.name + ' has purchased a ' + room.shop[toId(item)].name + ' for ' + room.shop[toId(item)].price + ' ' + ((price === 1) ? " buck." : " bucks.") + '.');
				});
				break;
			case 'help':
				if (!this.canBroadcast()) return;
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
				var bank = params.shift();
				room.shopBank = toId(bank);
				room.chatRoomData.shopBank = room.shopBank;
				Rooms.global.writeChatRoomData();
				this.sendReply('The room bank is now set to '+room.shopBank);
				break;
			case 'log':
			case 'viewlog':
				if (!user.can('roommod', null, room)) return this.sendReply('/leagueshop - Access denied.');
				var target = params.shift();
				var lines = 0;
				if (!target.match('[^0-9]')) {
					lines = parseInt(target || 15, 10);
					if (lines > 100) lines = 100;
				}
				var filename = 'logs/leagueshop_'+room.id+'.txt';
				var command = 'tail -'+lines+' '+filename;
				var grepLimit = 100;
				if (!lines || lines < 0) { // searching for a word instead
					if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
					command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
				}

				require('child_process').exec(command, function(error, stdout, stderr) {
					if (error && stderr) {
						user.popup('/leagueshop viewlog erred - the shop log does not support Windows');
						console.log('/leagueshop viewlog error: '+error);
						return false;
					}
					if (lines) {
						if (!stdout) {
							user.popup('The log is empty.');
						} else {
							user.popup('Displaying the last '+lines+' lines of shop purchases:\n\n'+stdout);
						}
					} else {
						if (!stdout) {
							user.popup('No purchases containing "'+target+'" were found.');
						} else {
							user.popup('Displaying the last '+grepLimit+' logged purchases containing "'+target+'":\n\n'+stdout);
						}
					}
				});
			break;
	 	}
	},

	bucks: function (target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	var self = this;
	 	var queryString = "SELECT SUM(bucks) FROM users;"
	 	"SELECT COUNT(bucks) AS userCount FROM (SELECT bucks FROM users WHERE bucks <>0 ORDER BY userid DESC) AS u HAVING COUNT(*) >1;"
		"SELECT * FROM users ORDER BY bucks DESC LIMIT 1;"
		"SELECT AVG(bucks) AS averageBucks FROM (SELECT bucks FROM users WHERE bucks <> 0 ORDER BY userid DESC) AS u HAVING COUNT(*) > 1;";

		db.all("SELECT SUM(bucks) FROM users;", function(err,rows) {
			if (err) return console.log("bucks1: " + err);
			var totalBucks = rows[0]['SUM(bucks)'];
			db.all("SELECT userid, SUM(bucks) AS total FROM users GROUP BY bucks HAVING TOTAL > 0;", function (err, rows) {
				if (err) return console.log("bucks2: " + err);
				var userCount = rows.length;
				db.all("SELECT * FROM users ORDER BY bucks DESC LIMIT 1;", function (err, rows) {
					if (err) return console.log("bucks3: " + err);
					var richestUser = rows[0].userid;
					var richestUserMoney = rows[0].bucks;
					if (Users.getExact(richestUser)) richestUser = Users.getExact(richestUser).name;
					db.all("SELECT AVG(bucks) FROM users WHERE bucks > 0;", function (err, rows) {
						if (err) return console.log("bucks4: " + err);
						var averageBucks = rows[0]['AVG(bucks)'];

						self.sendReplyBox("The richest user is currently <b><font color=#24678d>" + Tools.escapeHTML(richestUser) + "</font></b> with <b><font color=#24678d>" +
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
	richestuser: function(target, room, user) {
	 	if (!target) var target = 10;
	 	target = Number(target);
	 	if (isNaN(target)) target = 10;
	 	if (!this.canBroadcast()) return;
	 	if (this.broadcasting && target > 10) target = 10; // limit to 10 while broadcasting
	 	if (target > 500) target = 500;
	 	var self = this;

	 	function showResults(rows) {
			var output = '<table border="1" cellspacing ="0" cellpadding="3"><tr><th>Rank</th><th>Name</th><th>Bucks</th></tr>';
			var count = 1;
			for (var u in rows) {
				if (rows[u].name !== null) {
					var username = rows[u].name;
				} else {
					var username = rows[u].userid;
				}
				output += '<tr><td>' + count + '</td><td>' + Tools.escapeHTML(username) + '</td><td>' + rows[u].bucks + '</td></tr>';
				count++;
			}
			self.sendReplyBox(output);
			room.update();
		}

		db.all("SELECT userid, bucks, name FROM users ORDER BY bucks DESC LIMIT $target;", {$target: target}, function (err, rows) {
			if (err) return console.log("richestuser: " + err);
			showResults(rows);
		});
	},

	customsymbol: function(target, room, user) {
	 	var bannedSymbols = ['!', '|', '‽', '\u2030', '\u534D', '\u5350', '\u223C'];
	 	for (var u in Config.groups) if (Config.groups[u].symbol) bannedSymbols.push(Config.groups[u].symbol);
	 	if(!user.canCustomSymbol && !user.can('vip')) return this.sendReply('You need to buy this item from the shop to use.');
	 	if(!target || target.length > 1) return this.sendReply('/customsymbol [symbol] - changes your symbol (usergroup) to the specified symbol. The symbol can only be one character');
	 	if (target.match(/([a-zA-Z ^0-9])/g) || bannedSymbols.indexOf(target) >= 0) {
	 		return this.sendReply('This symbol is banned.');
	 	}
	 	user.getIdentity = function (roomid) {
			if (!roomid) roomid = 'lobby';
			if (this.locked) {
				return '‽'+this.name;
			}
			if (roomid) {
				var room = Rooms.rooms[roomid];
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
			}
		return target + this.name;
		}
	 	user.updateIdentity();
	 	user.canCustomSymbol = false;
	 	user.hasCustomSymbol = true;
	 	this.sendReply('Your symbol is now ' + target + '. It will be saved until you log off for more than an hour, or the server restarts. You can remove it with /resetsymbol');
	},

	resetsymbol: function (target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		delete user.getIdentity;
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},

	dicestart: 'startdice',
	startdice: function(target, room, user) {
	 	if (!this.canTalk()) return this.sendReply("You can not start dice games while unable to speak.");
	 	if (!user.can('broadcast',null,room)) return this.sendReply('/startdice - Access denied.');
	 	if (!target) return this.sendReply('Usage: /startdice <bet>');
	 	if (isNaN(Number(target))) return this.sendReply('/startdice - <bet> must be a number greater than 0');
	 	target = Math.round(Number(target));
	 	if (target < 1) return this.sendReply('/startdice - You can not bet less than one buck.');
	 	if (target > 500) return this.sendReply('/startdice - You can\'t bet more than 500 bucks.');
	 	var self = this;

	 	readMoney(user.userid, function(userMoney) {
	 		if (!room.dice) room.dice = {};
	 		if (!room.dice.status) room.dice.status = 0;
	 		if (room.dice.status > 0) return self.sendReply('/startdice - There is already a game started in here!');
	 		room.dice.status = 1;
	 		room.dice.bet = target;
	 		room.dice.startTime = Date.now();
	 		room.addRaw('<div class="infobox"><h2><center><font color=#24678d>' + Tools.escapeHTML(user.name) + ' has started a dice game for </font><font color=red>' + target + 
	 			' </font><font color=#24678d>' + ((target === 1) ? " buck." : " bucks.") + '.</font><br /> <button name="send" value="/joindice">Click to join.</button></center></h2></div>');
	 		room.update();
	 	});
	},

	joindice: function(target, room, user) {
		if (!this.canTalk()) return this.sendReply("You may not join dice games while unable to speak.");
	 	if (!room.dice) return this.sendReply('There is no dice game in it\'s signup phase in this room.');
	 	if (room.dice.status !== 1) return this.sendReply('There is no dice game in it\'s signup phase in this room.');
	 	var self = this;
	 	room.dice.status = 2;
	 	readMoney(user.userid, function(userMoney) {
	 		if (userMoney < room.dice.bet) {
	 			self.sendReply('You don\'t have enough bucks to join this game.');
	 			return room.dice.status = 1;
	 		}
	 		if (!room.dice.player1) {
	 			room.dice.player1 = user.userid;
	 			room.dice.status = 1;
	 			room.addRaw('<b>' + Tools.escapeHTML(user.name) + ' has joined the dice game.</b>');
	 			return room.update();
	 		}
	 		if (room.dice.player1 === user.userid) return room.dice.status = 1;
	 		if (room.dice.player1 !== user.userid) {
	 			room.dice.player2 = user.userid;
	 			if (!Users.get(room.dice.player1).userid) {
	 				room.addRaw("<b>Player 1 seems to be missing... game ending.</b>");
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			if (!Users.get(room.dice.player2).userid) {
	 				room.addRaw("<b>Player 2 seems to be missing... game ending.</b>");
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			if (room.dice.player1 !== Users.get(room.dice.player1).userid) {
	 				room.addRaw('<b>Player 1 has changed names, game ending.</b>');
	 				room.dice.status = 0;
	 				delete room.dice.player1;
	 				delete room.dice.player2;
	 				delete room.dice.bet;
	 				delete room.dice.startTime;
	 				room.update();
	 				return false;
	 			}
	 			room.addRaw('<b>' + Tools.escapeHTML(user.name) + ' has joined the dice game.</b>');
	 			room.update();
	 			var firstNumber = Math.floor(6 * Math.random()) + 1;
	 			var secondNumber = Math.floor(6 * Math.random()) + 1;
	 			var firstName = Users.get(room.dice.player1).name;
	 			var secondName = Users.get(room.dice.player2).name;
	 			readMoney(toId(firstName), function(firstMoney) {
		 			readMoney(toId(secondName), function(secondMoney) {
	 					if (firstMoney < room.dice.bet) {
							room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 						room.addRaw('<b>' + Tools.escapeHTML(firstName) + ' no longer has enough bucks to play, game ending.');
	 						return room.update();
	 					}
	 					if (secondMoney < room.dice.bet) {
							room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 						room.addRaw('<b>' + Tools.escapeHTML(secondName) + ' no longer has enough bucks to play, game ending.');
	 						return room.update();
	 					}
	 					var output = '<div class="infobox">Game has two players, starting now.<br />';
	 					output += 'Rolling the dice.<br />';
	 					output += Tools.escapeHTML(firstName) + ' has rolled a ' + firstNumber + '.<br />';
	 					output += Tools.escapeHTML(secondName) + ' has rolled a ' + secondNumber + '.<br />';
						while (firstNumber === secondNumber) {
							output += 'Tie... rolling again.<br />';
	 						firstNumber = Math.floor(6 * Math.random()) + 1;
	 						secondNumber = Math.floor(6 * Math.random()) + 1;
			 				output += Tools.escapeHTML(firstName) + ' has rolled a ' + firstNumber + '.<br />';
	 						output += Tools.escapeHTML(secondName) + ' has rolled a ' + secondNumber + '.<br />';
						}
						var betMoney = room.dice.bet;
	 					if (firstNumber > secondNumber) {
	 						output += '<font color=#24678d><b>' + Tools.escapeHTML(firstName) + '</b></font> has won <font color=#24678d><b>' + betMoney + '</b></font> ' + ((betMoney === 1) ? " buck." : " bucks.") + '.<br />'
	 						output += 'Better luck next time ' + Tools.escapeHTML(secondName) + '!';
	 						writeMoney(Users.get(firstName).userid, betMoney, function() {
	 							writeMoney(Users.get(secondName).userid,-betMoney,function() {
	 								readMoney(Users.get(firstName).userid, function(firstMoney){
	 									readMoney(Users.get(secondName).userid, function(secondMoney) {
	 										logDice(firstName + ' has won ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + secondName + '. They now have ' + firstMoney);
	 										logDice(secondName + ' has lost ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + firstName + '. They now have ' + secondMoney);
	 									});
	 								});
	 							});
	 						});
	 						room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 					}
	 					if (secondNumber > firstNumber) {
	 						output += '<font color=#24678d><b>' + Tools.escapeHTML(secondName) + '</b></font> has won <font color=#24678d><b>' + betMoney + '</b></font> ' + ((betMoney === 1) ? " buck." : " bucks.") + '.<br />';
	 						output += 'Better luck next time ' + Tools.escapeHTML(firstName) + '!';
	 						writeMoney(Users.get(secondName).userid, betMoney, function() {
	 							writeMoney(Users.get(firstName).userid,-betMoney,function() {
	 								readMoney(Users.get(firstName).userid, function(firstMoney){
		 								readMoney(Users.get(secondName).userid, function(secondMoney){
	 										logDice(secondName + ' has won ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + firstName + '. They now have ' + secondMoney);
	 										logDice(firstName + ' has lost ' + betMoney + ' ' + ((betMoney === 1) ? " buck." : " bucks.") + ' from a dice game with ' + secondName + '. They now have ' + firstMoney);
		 								});
	 								});
	 							});
	 						});
	 						room.dice.status = 0;
	 						delete room.dice.player1;
	 						delete room.dice.player2;
	 						delete room.dice.bet;
	 						delete room.dice.startTime;
	 					}
	 					output += '</div>';
	 					room.addRaw(output);
	 					room.update();
	 				});
	 			});
	 		}
		});
	},

	enddice: function (target, room, user) {
		if (!user.can('broadcast',null,room)) return this.sendReply('/enddice - Access denied.');
		if (!room.dice) return this.sendReply('/enddice - There is no dice game in this room.');
		if (room.dice.status === 0) return this.sendReply('/enddice - There is no dice game in this room.');
		if ((Date.now() - room.dice.startTime) < 60000 && !user.can('broadcast', null, room)) return this.sendReply('Regular users may not end a dice game within the first minute of it starting.');
		room.dice = {};
		room.dice.status = 0;
		return room.addRaw('<b>' + Tools.escapeHTML(user.name) + ' ended the dice game.');
	},

	dicehelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			'Dice game commands: <br />' +
			'/startdice <bet> - Starts a game.<br />' +
			'/joindice - Joins the game.<br />' +
			'/enddice - Forcibly ends the game.'
			);
	},

	profile: function(target, room, user) {
		if (!target) target = user.name;
		if (toId(target).length > 19) return this.sendReply("Usernames may not be more than 19 characters long.");
		if (toId(target).length < 1) return this.sendReply(target + " is not a valid username.");
		if (!this.canBroadcast()) return;
		var targetUser = Users.get(target);
		if (!targetUser) {
			var username = target;
			var userid = toId(target);
			var avatar = (Config.customavatars[userid] ? "http://" + serverIp + ":" + Config.port + "/avatars/" + Config.customavatars[userid] : "http://play.pokemonshowdown.com/sprites/trainers/167.png");
		} else {
			var username = targetUser.name;
			var userid = targetUser.userid;
			var avatar = (isNaN(targetUser.avatar) ? "http://" + serverIp + ":" + Config.port + "/avatars/" + targetUser.avatar : "http://play.pokemonshowdown.com/sprites/trainers/" + targetUser.avatar + ".png");
		}

    	if (Users.usergroups[userid]) {
			var userGroup = Users.usergroups[userid].substr(0,1);
			for (var u in Config.grouplist) {
				if (Config.grouplist[u].symbol && Config.grouplist[u].symbol === userGroup) userGroup = Config.grouplist[u].name;
			}
		} else {
			var userGroup = 'Regular User';
		}

		var self = this;
		readMoney(userid, function(bucks) {
			var options = {
				host: "pokemonshowdown.com",
				port: 80,
				path: "/users/" + userid
			};

			var content = "";
			var req = http.request(options, function(res) {

				res.setEncoding("utf8");
				res.on("data", function (chunk) {
					content += chunk;
				});
				res.on("end", function () {
					content = content.split("<em");
					if (content[1]) {
						content = content[1].split("</p>");
						if (content[0]) {
							content = content[0].split("</em>");
							if (content[1]) {
								regdate = content[1].trim();
								showProfile();
							}
						}
					} else {
						regdate = '(Unregistered)';
						showProfile();
					}
				});
			});
			req.end();

			function showProfile() {
				//if (!lastOnline) lastOnline = "Never";
				var profile = '';
				profile += '<img src="' + avatar + '" height=80 width=80 align=left>';
				profile += '&nbsp;<font color=#24678d><b>Name: </font><b><font color="' + hashColor(toId(username)) + '">' + Tools.escapeHTML(username) + '</font></b><br />';
				profile += '&nbsp;<font color=#24678d><b>Registered: </font></b>' + regdate + '<br />';
				if (!Users.vips[userid]) profile += '&nbsp;<font color=#24678d><b>Rank: </font></b>' + userGroup + '<br />';
				if (Users.vips[userid]) profile += '&nbsp;<font color=#24568d><b>Rank: </font></b>' + userGroup + ' (<font color=#6390F0><b>VIP User</b></font>)<br />';
				if (bucks) profile += '&nbsp;<font color=#24678d><b>Bucks: </font></b>' + bucks + '<br />';
				//if (online) profile += '&nbsp;<font color=#24678d><b>Last Online: </font></b><font color=green>Currently Online</font><br />';
				//if (!online) profile += '&nbsp;<font color=#24678d><b>Last Online: </font></b>' + lastOnline + '<br />';
				profile += '<br clear="all">';
				self.sendReplyBox(profile);
				room.update();
			}
		});
	},

	economycode: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Economy code by: <a href=\"https://gist.github.com/jd4564/d6e8f4140b7abc9295e1\">jd</a>");
	}
};

var colorCache = {};
hashColor = function (name) {
	name = toId(name);
    if (colorCache[name]) return colorCache[name];

    var hash = MD5(name);
    var H = parseInt(hash.substr(4, 4), 16) % 360;
    var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
    var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

    var rgb = hslToRgb(H, S, L);
    colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
    return colorCache[name];
}
global.hashColor = hashColor;
function hslToRgb(h, s, l) {
    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return {
        r: r,
        g: g,
        b: b
    }
}

function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
}

function toHex(N) {
    if (N == null) return "00";
    N = parseInt(N);
    if (N == 0 || isNaN(N)) return "00";
    N = Math.max(0, N);
    N = Math.min(N, 255);
    N = Math.round(N);
    return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
    }

