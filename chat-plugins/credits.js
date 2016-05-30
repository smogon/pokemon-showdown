'use strict';

const fs = require('fs');
let color = require('../config/color');
let path = require('path');
let rankLadder = require('../rank-ladder');

let creditShop = [
    ['Rose Ticket', 'Can be exchanged for 5 bucks ', 15],
    ['Red Ticket', 'Can be exchanged for one PSGO pack ', 20],
    ['Cyan Ticket', 'Can be exchanged for 15 bucks ', 30],
    ['Blue Ticket', 'Can be exchanged for 2 PSGO packs ', 35],
    ['Orange Ticket', 'Can be exchanged for a recolored avatar and 10 bucks ', 50],
    ['Violet Ticket', 'Can be exchanged for a recolored avatar, 1 PSGO pack and 20 bucks', 75],
    ['Yellow Ticket', 'Can be exchanged for 5 PSGO packs', 80],
    ['White Ticket', 'Can be exchanged for 50 bucks', 90],
    ['Green Ticket', 'Can be exchanged for a recolored avatar, 30 bucks and 2 PSGO packs', 100],
    ['Black Ticket', 'Can be exchanged for 100 bucks', 175],
    ['Silver Ticket', 'Can be exchanged for 1 PSGO pack and 20 bucks', 55],
    ['Crystal Ticket', 'Can be exchanged for 2 cards from the <button name="send" value="/showcase marketplaceatm">Marketplace ATM showcase</button>', 100],
    ['Gold Ticket', 'Can be exchanged for 2 PSGO packs and 50 bucks', 120],
    ['Ruby Ticket', 'Can be exchanged for 5 PSGO packs, 50 bucks and an avatar recolor', 200],
    ['Sapphire Ticket', 'Can be exchanged for 7 PSGO packs and 100 bucks', 280],
    ['Emerald Ticket', 'Can be exchanged for 5 PSGO packs, 100 bucks and Marketplace Partner (Can be taken away if necessary)', 400],
    ['Rainbow Ticket', 'Can be exchanged for 10 PSGO packs and 200 bucks', 515],
];

let creditShopDisplay = getShopDisplay(creditShop);

function getShopDisplay(creditShop) {
	let display = '<center><b><font color="red" size="4">Read the description of the ticket you want to buy if you haven\'t already.<br>When you buy your ticket, PM a & or # to claim your reward.</font></b></center></center><div style="box-shadow: 4px 4px 4px #000 inset, -4px -4px 4px #000 inset, 5px 3px 8px rgba(0, 0, 0, 0.6); max-height: 310px; overflow-y: scroll;"><table style="width: 100%; border-collapse: collapse;"><table style="width: 100%; border-collapse: collapse;"><tr><th colspan="3" class="table-header" style="background: -moz-linear-gradient(right, #09263A, #03121C); background: -webkit-linear-gradient(left, #09263A, #03121C); background: -o-linear-gradient(right, #09263A, #03121C); background: linear-gradient(right, #09263A, #03121C); padding: 8px 20px 16px 8px; box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8) inset; text-shadow: 1px 1px #0A2D43, 2px 2px #0A2D43, 3px 3px #0A2D43, 4px 4px #0A2D43, 5px 5px #0A2D43, 6px 6px #0A2D43, 7px 7px #0A2D43, 8px 8px #0A2D43, 9px 9px #0A2D43, 10px 10px #0A2D43;"><h2>Marketplace Credit Shop</h2></th></tr>' +
		'<tr><th class="table-header" style="background: -moz-linear-gradient(#173C54, #061C2A); background: -webkit-linear-gradient(#173C54, #061C2A); background: -o-linear-gradient(#173C54, #061C2A); background: linear-gradient(#173C54, #061C2A); box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8) inset;">Item</th><th class="table-header" style="background: -moz-linear-gradient(#173C54, #061C2A); background: -webkit-linear-gradient(#173C54, #061C2A); background: -o-linear-gradient(#173C54, #061C2A); background: linear-gradient(#173C54, #061C2A); box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8) inset;">Description</th><th class="table-header" style="background: -moz-linear-gradient(#173C54, #061C2A); background: -webkit-linear-gradient(#173C54, #061C2A); background: -o-linear-gradient(#173C54, #061C2A); background: linear-gradient(#173C54, #061C2A); box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8) inset;">Cost</th></tr>';
	let start = 0;
	while (start < creditShop.length) {
		display += '<tr><td class="table-option"><button class="table-btn" name="send" value="/claim ' + creditShop[start][0] + '">' + creditShop[start][0] + '</button></td>' +
			'<td class="table-option">' + creditShop[start][1] + '</td>' +
			'<td class="table-option">' + creditShop[start][2] + '</td></tr>';
		start++;
	}
	display += '</table></div>';
	return display;
}

function currencyName(amount) {
	let name = " credit";
	return amount === 1 ? name : name + "s";
}

function isCredits(credits) {
	let numCredits = Number(credits);
	if (isNaN(credits)) return "Must be a number.";
	if (String(credits).includes('.')) return "Cannot contain a decimal.";
	if (numCredits < 1) return "Cannot be less than one credit.";
	return numCredits;
}

function logCredits(message) {
	if (!message) return;
	let file = path.join(__dirname, '../logs/credits.txt');
	let date = "[" + new Date().toUTCString() + "] ";
	let msg = message + "\n";
	fs.appendFile(file, date + msg);
}

function findItem(item, credits) {
	let len = creditShop.length;
	let price = 0;
	let amount = 0;
	while (len--) {
		if (item.toLowerCase() !== creditShop[len][0].toLowerCase()) continue;
		price = creditShop[len][2];
		if (price > credits) {
			amount = price - credits;
			this.sendReply("You don't have you enough credits for this. You need " + amount + currencyName(amount) + " more to buy " + item + ".");
			return false;
		}
		return price;
	}
	this.sendReply(item + " not found in creditshop.");
}

function handleBoughtItem(item, user, cost) {
	let msg = '**' + user.name + " has bought " + item + ".**";
	Rooms.rooms.marketplacestaff.add('|c|~Credit Shop Alert|' + msg);
	Rooms.rooms.marketplacestaff.update();
	logMoney(user.name + ' has spent ' + cost + ' credits on a ' + item);
}

exports.commands = {
	catm: 'creditatm',
	creditatm: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) target = user.name;

		const targetId = toId(target);
		if (!targetId) return this.parse('/help creditatm');

		const amount = Db('credits').get(targetId, 0);
		this.sendReplyBox('<b><font color="' + color(targetId) + '">' + Tools.escapeHTML(target) + '</font></b> has ' + amount + currencyName(amount) + '.');
	},
	creditatmhelp: ["/creditatm [user] - Shows the amount of credits a user has."],

	givecredits: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be given out in the Marketplace.");
		if (!this.can('ban', null, room)) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help givecredits');

		let parts = target.split(',');
		let username = parts[0];
		let uid = toId(username);
		let amount = isCredits(parts[1]);

		if (user.userid === username && !this.can('declare', null, room)) return this.errorReply("no");
		if (amount > 1000) return this.sendReply("You cannot give more than 1,000 credits at a time.");
		if (username.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		if (typeof amount === 'string') return this.errorReply(amount);

		let total = Db('credits').set(uid, Db('credits').get(uid, 0) + amount).get(uid);
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " was given " + amount + ". " + username + " now has " + total + ".");
		this.privateModCommand(username + " was given " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users.get(username).popup(user.name + " has given you " + amount + ". You now have " + total + ".");
		logCredits(username + " was given " + amount + " by " + user.name + ".");
	},
	givecreditshelp: ["/givecredits [user], [amount] - Give a user a certain amount of credits."],

	takecredits: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be taken in the Marketplace.");
		if (!this.can('ban', null, room)) return false;
		if (!target || target.indexOf(',') < 0) return this.parse('/help takecredits');

		let parts = target.split(',');
		let username = parts[0];
		let uid = toId(username);
		let amount = isCredits(parts[1]);

		if (amount > Db('credits').get(uid)) return this.sendReply("The user's total credits is less than " + amount + ".");
		if (amount > 1000) return this.sendReply("You cannot remove more than 1,000 credits at a time.");
		if (username.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		if (typeof amount === 'string') return this.sendReply(amount);

		let total = Db('credits').set(uid, Db('credits').get(uid, 0) - amount).get(uid);
		amount = amount + currencyName(amount);
		total = total + currencyName(total);
		this.sendReply(username + " lost " + amount + ". " + username + " now has " + total + ".");
		this.privateModCommand(username + " lost " + amount + ". " + username + " now has " + total + ".");
		if (Users.get(username)) Users.get(username).popup(user.name + " has taken " + amount + " from you. You now have " + total + ".");
		logCredits(username + " had " + amount + " taken away by " + user.name + ".");
	},
	takecreditshelp: ["/takecredits [user], [amount] - Take a certain amount of credits from a user."],

	resetcredits: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be reset in the Marketplace.");
		if (!this.can('declare', null, room)) return false;
		Db('credits').set(toId(target), 0);
		this.sendReply(target + " now has " + 0 + currencyName(0) + ".");
		logCredits(user.name + " reset the credits of " + target + ".");
	},
	resetcreditshelp: ["/resetcredits [user] - Reset user's credits to zero."],

	transfercredits: function (target, room, user, connection, cmd) {
		if (!target || target.indexOf(',') < 0) return this.parse('/help transfercredits');

		let parts = target.split(',');
		let username = parts[0];
		let uid = toId(username);
		let amount = isCredits(parts[1]);

		if (toId(username) === user.userid) return this.sendReply("You cannot transfer to yourself.");
		if (username.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		if (typeof amount === 'string') return this.sendReply(amount);
		if (amount > Db('credits').get(user.userid, 0)) return this.errorReply("You cannot transfer more credits than what you have.");
		if (!Users.get(username) && cmd !== 'transfercredits') return this.errorReply("The target user could not be found");
		Db('credits')
			.set(user.userid, Db('credits').get(user.userid) - amount)
			.set(uid, Db('credits').get(uid, 0) + amount);

		let userTotal = Db('credits').get(user.userid) + currencyName(Db('credits').get(user.userid));
		let targetTotal = Db('credits').get(uid) + currencyName(Db('credits').get(uid));
		amount = amount + currencyName(amount);

		this.sendReply("You have successfully transferred " + amount + ". You now have " + userTotal + ".");
		if (Users.get(username)) Users(username).popup(user.name + " has transferred " + amount + ". You now have " + targetTotal + ".");
		logCredits(user.name + " transferred " + amount + " to " + username + ". " + user.name + " now has " + userTotal + " and " + username + " now has " + targetTotal + ".");
	},
	transfercreditshelp: ["/transfercredits [user], [amount] - Transfer a certain amount of credits to a user."],

	creditslog: function (target, room, user, connection) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credit log can only be used in the Marketplace.");
		if (!this.can('ban', null, room)) return;
		let numLines = 14;
		let matching = true;
		if (target && /\,/i.test(target)) {
			let parts = target.split(",");
			if (!isNaN(parts[parts.length - 1])) {
				numLines = Number(parts[parts.length - 1]) - 1;
				target = parts.slice(0, parts.length - 1).join(",");
			}
		} else if (target.match(/\d/g) && !isNaN(target)) {
			numLines = Number(target) - 1;
			matching = false;
		}
		let topMsg = "Displaying the last " + (numLines + 1) + " lines of transactions:\n";
		let file = path.join(__dirname, '../logs/credits.txt');
		fs.exists(file, function (exists) {
			if (!exists) return connection.popup("No transactions.");
			fs.readFile(file, 'utf8', function (err, data) {
				data = data.split('\n');
				if (target && matching) {
					data = data.filter(function (line) {
						return line.toLowerCase().indexOf(target.toLowerCase()) >= 0;
					});
				}
				connection.popup('|wide|' + topMsg + data.slice(-(numLines + 1)).join('\n'));
			});
		});
	},
	creditsloghelp: ["/creditslog - Displays a log of all transactions in the economy."],

	creditladder: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Creditladder can only be viewed in the Marketplace.");
		if (!this.runBroadcast()) return;
		let keys = Object.keys(Db('credits').object()).map(function (name) {
			return {name: name, credits: Db('credits').get(name)};
		});
		if (!keys.length) return this.sendReplyBox("credits ladder is empty.");
		keys.sort(function (a, b) { return b.credits - a.credits; });
		this.sendReplyBox(rankLadder('Credit Ladder', 'credits', keys.slice(0, 100), 'credits'));
	},
	creditladderhelp: ["/creditladder - Displays users ranked by the amount of Wisp credits they possess."],

	credits: 'creditsstats',
	creditsstats: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credit stats can only be viewed in the Marketplace.");
		if (!this.runBroadcast()) return;
		const users = Object.keys(Db('credits').object());
		const total = users.reduce(function (acc, cur) {
			return acc + Db('credits').get(cur);
		}, 0);
		let average = Math.floor(total / users.length);
		let output = "There is " + total + currencyName(total) + " circulating in the economy. ";
		output += "The average user has " + average + currencyName(average) + ".";
		this.sendReplyBox(output);
	},
	creditsstatshelp: ["/credits - Gives information about the state of the economy."],

	cleancredits: function (target, room, user) {
		if (!~developers.indexOf(user.userid)) return this.errorReply("/cleancredits - Access denied.");
		let creditsObject = Db('credits').object();
		Object.keys(creditsObject)
			.filter(function (name) {
				return Db('credits').get(name) < 1;
			})
			.forEach(function (name) {
				delete creditsObject[name];
			});
		Db.save();
		this.sendReply("All users who has less than 1 credit are now removed from the database.");
	},
	cleancreditshelp: ["/cleancredits - Cleans credit database by removing users with less than one credit."],

	credit: 'creditshop',
	creditshop: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Creditshop can only be viewed in the Marketplace.");
		if (!this.runBroadcast()) return;
		return this.sendReply("|raw|" + creditShopDisplay);
	},

	claim: function (target, room, user) {
		if (!target) return this.parse('/help claim');
		let amount = Db('credits').get(user.userid, 0);
		let cost = findItem.call(this, target, amount);
		if (!cost) return;
		let total = Db('credits').set(user.userid, amount - cost).get(user.userid);
		this.sendReply("You have bought " + target + " for " + cost + currencyName(cost) + ". You now have " + total + currencyName(total) + " left.");
		room.addRaw(user.name + " has bought <b>" + target + "</b> from the shop.");
		logCredits(user.name + " has bought " + target + " from the shop. This user now has " + total + currencyName(total) + ".");
		handleBoughtItem.call(this, target.toLowerCase(), user, cost);
	},
	claimhelp: ["/claim [command] - Buys an item from the creditshop."],
};
