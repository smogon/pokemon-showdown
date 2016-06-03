'use strict';

const fs = require('fs');

let shopTitle = 'Wisp Credit Shop';

let prices = {
	"roseticket": 15,
	"redticket": 20,
	"cyanticket": 30,
	"blueticket": 35,
	"orangeticket": 50,
	"violetticket": 75,
	"yellowticket": 80,
	"whiteticket": 90,
	"greenticket": 100,
	"blackticket": 175,
	"silverticket": 55,
	"crystalticket": 100,
	"goldticket": 120,
	"rubyticket": 200,
	"sapphireticket": 280,
	"rainbowticket": 450,
	"emeraldticket": 600,
};

function readMoney(userid, callback) {
	if (!callback) return false;
	userid = toId(userid);
	Wisp.database.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function (err, rows) {
		if (err) return console.log(err);
		callback(((rows[0] && rows[0].credits) ? rows[0].credits : 0));
	});
}
function writeMoney(userid, amount, callback) {
	userid = toId(userid);
	Wisp.database.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function (err, rows) {
		if (rows.length < 1) {
			Wisp.database.run("INSERT INTO users(userid, credits) VALUES ($userid, $amount)", {$userid: userid, $amount: amount}, function (err) {
				if (err) return console.log(err);
				if (callback) return callback();
			});
		} else {
			amount += rows[0].credits;
			Wisp.database.run("UPDATE users SET credits=$amount WHERE userid=$userid", {$amount: amount, $userid: userid}, function (err) {
				if (err) return console.log(err);
				if (callback) return callback();
			});
		}
	});
}
function logTransaction(message) {
	if (!message) return false;
	fs.appendFile('logs/transactions.log', '[' + new Date().toUTCString() + '] ' + message + '\n');
}

exports.commands = {
	creditlog: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be given out in the Marketplace.");
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.sendReply("Usage: /creditlog [number] to view the last x lines OR /creditlog [text] to search for text.");
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

	creditatm: function (target, room, user) {
		if (!target) target = user.name;
		if (!this.runBroadcast()) return;
		let userid = toId(target);
		if (userid.length < 1) return this.sendReply("/creditatm - Please specify a user.");
		if (userid.length > 19) return this.sendReply("/creditatm - [user] can't be longer than 19 characters.");

		readMoney(userid, cred => {
			this.sendReplyBox(Tools.escapeHTML(target) + " has " + cred + ((cred === 1) ? " credits." : " credits."));
			if (this.broadcasting) room.update();
		});
	},

	gcr: 'givecredits',
	givecredits: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be given out in the Marketplace.");
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.sendReply("Usage: /givecredits [user], [amount]");
		let splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /givecredits [user], [amount]");
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/givecredits - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/givecredits - [user] can't be longer than 19 characters");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/givecredits - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/givecredits - You can't give more than 1000 credits at a time.");
		if (amount < 1) return this.sendReply("/givecredits - You can't give less than one credits.");

		writeMoney(targetUser, amount);
		this.sendReply(Tools.escapeHTML(targetUser) + " has received " + amount + ((amount === 1) ? " credits." : " credits."));
		logTransaction(user.name + " has given " + amount + ((amount === 1) ? " credit " : " credits ") + " to " + targetUser);
		Rooms.get('marketplace').add('|raw|' + (user.name + " has given " + amount + ((amount === 1) ? " credit " : " credits ") + " to " + targetUser);
	},

	takecredits: function (target, room, user) {
		if (room.id !== 'marketplace' && room.id !== 'marketplacestaff') return this.errorReply("Credits can only be given out in the Marketplace.");
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.sendReply("Usage: /takecredits [user], [amount]");
		let splitTarget = target.split(',');
		if (!splitTarget[1]) return this.sendReply("Usage: /takecredits [user], [amount]");
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/takecredits - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/takecredits - [user] can't be longer than 19 characters");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/takecredits - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/takecredits - You can't take more than 1000 credits at a time.");
		if (amount < 1) return this.sendReply("/takecredits - You can't take less than one credit.");

		writeMoney(targetUser, -amount);
		this.sendReply("You removed " + amount + ((amount === 1) ? " credit " : " credits ") + " from " + Tools.escapeHTML(targetUser));
		logTransaction(user.name + " has taken " + amount + ((amount === 1) ? " credit " : " credits ") + " from " + targetUser);
		Rooms.get('marketplace').add('|raw|' + user.name + " has given " + amount + ((amount === 1) ? " credit " : " credits ") + " to " + targetUser);
	},

	transfercredits: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /transfercredits [user], [amount]");
		let splitTarget = target.split(',');
		for (let u in splitTarget) splitTarget[u] = splitTarget[u].trim();
		if (!splitTarget[1]) return this.sendReply("Usage: /transfercredits [user], [amount]");

		let targetUser = splitTarget[0];
		if (toId(targetUser).length < 1) return this.sendReply("/transfercredits - [user] may not be blank.");
		if (toId(targetUser).length > 19) return this.sendReply("/transfercredits - [user] can't be longer than 19 characters.");

		let amount = Math.round(Number(splitTarget[1]));
		if (isNaN(amount)) return this.sendReply("/transfercredits - [amount] must be a number.");
		if (amount > 1000) return this.sendReply("/transfercredits - You can't transfer more than 1000 credits at a time.");
		if (amount < 1) return this.sendReply("/transfercredits - You can't transfer less than one credit.");

		readMoney(user.userid, cred => {
			if (cred < amount) return this.sendReply("/transfercredits - You can't transfer more credits than you have.");
			writeMoney(user.userid, -amount, () => {
				writeMoney(targetUser, amount, () => {
					this.sendReply("You've sent " + amount + ((amount === 1) ? " credit " : " credits ") + " to " + targetUser);
					logTransaction(user.name + " has transfered " + amount + ((amount === 1) ? " credit " : " credits ") + " to " + targetUser);
					if (Users.getExact(targetUser) && Users.getExact(targetUser)) Users.getExact(targetUser).popup(user.name + " has sent you " + amount + ((amount === 1) ? " credit." : " credits."));
				});
			});
		});
	},

	claim: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /claim [item]");
		let targetSplit = target.split(',');
		for (let u in targetSplit) targetSplit[u] = targetSplit[u].trim();
		let item = targetSplit[0];
		let itemid = toId(item);
		let matched = false;

		if (!prices[itemid]) return this.sendReply("/claim " + item + " - Item not found.");

		readMoney(user.userid, userCred => {
			switch (itemid) {
			case 'roseticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Rose Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Rose Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Rose Ticket.");
				this.sendReply("You have purchased a Rose Ticket.");
				matched = true;
				break;
			case 'redticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Red Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Red Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Red Ticket.");
				this.sendReply("You have purchased a Red Ticket.");
				matched = true;
				break;
			case 'cyanticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Cyan Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Cyan Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Cyan Ticket.");
				this.sendReply("You have purchased a Cyan Ticket.");
				matched = true;
				break;
			case 'blueticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Blue Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Blue Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Blue Ticket.");
				this.sendReply("You have purchased a Blue Ticket.");
				matched = true;
				break;
			case 'orangeticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Orange Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Orange Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Orange Ticket.");
				this.sendReply("You have purchased a Orange Ticket.");
				matched = true;
				break;
			case 'violetticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Violet Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Violet Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Violet Ticket.");
				this.sendReply("You have purchased a Violet Ticket.");
				matched = true;
				break;
			case 'yellowticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Yellow Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Yellow Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Yellow Ticket.");
				this.sendReply("You have purchased a Yellow Ticket.");
				matched = true;
				break;
			case 'whiteticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a White Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a White Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a White Ticket.");
				this.sendReply("You have purchased a White Ticket.");
				matched = true;
				break;
			case 'greenticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Green Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Green Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Green Ticket.");
				this.sendReply("You have purchased a Green Ticket.");
				matched = true;
				break;
			case 'blackticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Black Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Black Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Black Ticket.");
				this.sendReply("You have purchased a Black Ticket.");
				matched = true;
				break;
			case 'silverticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Silver Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Silver Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Silver Ticket.");
				this.sendReply("You have purchased a Silver Ticket.");
				matched = true;
				break;
			case 'crystalticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Crystal Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Crystal Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Crystal Ticket.");
				this.sendReply("You have purchased a Crystal Ticket.");
				matched = true;
				break;
			case 'goldticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Gold Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Gold Ticket for " + prices[itemid] + " credits.");
				Wisp.messageSeniorStaff(user.name + " has purchased a Gold Ticket.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Gold Ticket.");
				matched = true;
				break;
			case 'rubyticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Ruby Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Ruby Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Ruby Ticket.");
				this.sendReply("You have purchased a Ruby Ticket.");
				matched = true;
				break;
			case 'sapphireticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Sapphire Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Sapphire Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Sapphire Ticket.");
				this.sendReply("You have purchased a Sapphire Ticket.");
				matched = true;
				break;
			case 'emeraldticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Emerald Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Emerald Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Emerald Ticket.");
				this.sendReply("You have purchased a Emerald Ticket.");
				matched = true;
				break;
			case 'rainbowticket':
				if (userCred < prices[itemid]) return this.sendReply("You need " + (prices[itemid] - userCred) + " more credits to purchase a Rainbow Ticket.");
				writeMoney(user.userid, prices[itemid] * -1);
				logTransaction(user.name + " has purchased a Rainbow Ticket for " + prices[itemid] + " credits.");
				Rooms.get('marketplacestaff').add('|raw|' + user.name + " has purchased a Rainbow Ticket.");
				this.sendReply("You have purchased a Rainbow Ticket.");
				matched = true;
				break;

			}

			if (matched) return this.sendReply("You now have " + (userCred - prices[itemid]) + " credits left.");
		});
	},

	creditshop: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<center><h4><b><u>' + shopTitle + '</u></b></h4><table border="1" cellspacing ="0" cellpadding="3"><tr><th>Item</th><th>Description</th><th>Price</th></tr>' +
			'<tr><td><button name="send" value="/claim roseticket">Rose Ticket</button></td><td>Can be exchanged for 5 bucks</td><td>' + prices['roseticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim redticket">Red TIcket</button></td><td>Can be exchanged for one PSGO pack</td><td>' + prices['redticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim cyanticket">Cyan Ticket</button></td><td>Can be exchanged for 15 bucks</td><td>' + prices['cyanticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim blueticket">Blue Ticket</button></td><td>Can be exchanged for 2 PSGO packs</td><td>' + prices['blueticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim orangeticket">Orange Ticket</button></td><td>Can be exchanged for a recolored avatar and 10 bucks</td><td>' + prices['orangeticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim violeticket">Violet Ticket</button></td><td>Can be exchanged for a recolored avatar, 1 PSGO pack and 20 bucks</td><td>' + prices['violetticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim roseticket">Yellow Ticket</button></td><td>Can be exchanged for 5 PSGO packs</td><td>' + prices['yellowticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim whiteticket">White Ticket</button></td><td>Can be exchanged for 50 bucks</td><td>' + prices['whiteticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim greenticket">Green Ticket</button></td><td>Can be exchanged for a recolored avatar, 30 bucks and 2 PSGO packs</td><td>' + prices['greenticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim blackticket">Black Ticket</button></td><td>Can be exchanged for 100 bucks</td><td>' + prices['blackticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim silverticket">Silver Ticket</button></td><td>Can be exchanged for 1 PSGO pack and 20 bucks</td><td>' + prices['silverticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim crystalticket">Crystal Ticket</button></td><td>Can be exchanged for 3 cards from the <button name="send" value="/showcase marketplaceatm">Marketplace ATM showcase</button></td><td>' + prices['crystalticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim goldticket">Gold Ticket</button></td><td>Can be exchanged for 2 PSGO packs and 50 bucks</td><td>' + prices['goldticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim rubyticket">Ruby ticket</button></td><td>Can be exchanged for 5 PSGO packs, 50 bucks and an avatar recolor</td><td>' + prices['rubyticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim sapphireticket">Sapphire Ticket</button></td><td>Can be exchanged for 7 PSGO packs and 100 bucks</td><td>' + prices['sapphireticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim rainbowticket">Rainbow Ticket</button></td><td>Can be exchanged for 10 PSGO packs and 200 bucks</td><td>' + prices['rainbowticket'] + '</td></tr>' +
			'<tr><td><button name="send" value="/claim emeraldticket">Emerald Ticket</button></td><td>Can be exchanged for 5 PSGO packs, 100 bucks, Marketplace Partner, Custom Title and Partner Badge</td><td>' + prices['emeraldticket'] + '</td></tr>' +
			'</table><br />To buy an item from the shop, use /claim [item].<br />All sales final, no refunds will be provided.</center>'
		);
	},

	credits: function (target, room, user) {
		if (!this.runBroadcast()) return;

		Wisp.database.all("SELECT SUM(credits) FROM users;", (err, rows) => {
			if (err) return console.log("credits1: " + err);
			let totalCredits = rows[0]['SUM(credits)'];
			Wisp.database.all("SELECT userid, SUM(credits) AS total FROM users GROUP BY credits HAVING TOTAL > 0;", (err, rows) => {
				if (err) return console.log("credits2: " + err);
				let userCount = rows.length;
				Wisp.database.all("SELECT * FROM users ORDER BY credits DESC LIMIT 1;", (err, rows) => {
					if (err) return console.log("credits3: " + err);
					let richestUser = rows[0].userid;
					let richestUserCred = rows[0].credits;
					if (Users.getExact(richestUser)) richestUser = Users.getExact(richestUser).name;
					Wisp.database.all("SELECT AVG(credits) FROM users WHERE credits > 0;", (err, rows) => {
						if (err) return console.log("credits4: " + err);
						let averageCredits = rows[0]['AVG(credits)'];

						this.sendReplyBox("The richest user is currently <b><font color=#24678d>" + Tools.escapeHTML(richestUser) + "</font></b> with <b><font color=#24678d>" +
							richestUserCred + "</font></b> credits.</font></b><br />There is a total of <b><font color=#24678d>" +
							userCount + "</font></b> users with at least one credits.<br /> The average user has " +
							"<b><font color=#24678d>" + Math.round(averageCredits) + "</font></b> credits.<br /> There is a total of <b><font color=#24678d>" +
							totalCredits + "</font></b> credits in the economy."
						);
						room.update();
					});
				});
			});
		});
	},

	luckiestusers: function (target, room, user) {
		if (!target) target = 10;
		target = Number(target);
		if (isNaN(target)) target = 10;
		if (!this.runBroadcast()) return;
		if (this.broadcasting && target > 10) target = 10; // limit to 10 while broadcasting
		if (target > 500) target = 500;

		let self = this;

		function showResults(rows) {
			let output = '<table border="1" cellspacing ="0" cellpadding="3"><tr><th>Rank</th><th>Name</th><th>Credits</th></tr>';
			let count = 1;
			for (let u in rows) {
				if (!rows[u].credits || rows[u].credits < 1) continue;
				let username;
				if (rows[u].name !== null) {
					username = rows[u].name;
				} else {
					username = rows[u].userid;
				}
				output += '<tr><td>' + count + '</td><td>' + Tools.escapeHTML(username) + '</td><td>' + rows[u].credits + '</td></tr>';
				count++;
			}
			self.sendReplyBox(output);
			room.update();
		}

		Wisp.database.all("SELECT userid, credits, name FROM users ORDER BY credits DESC LIMIT $target;", {$target: target}, function (err, rows) {
			if (err) return console.log("richestuser: " + err);
			showResults(rows);
		});
	},

};
