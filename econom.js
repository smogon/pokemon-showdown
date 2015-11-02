var fs = require('fs');

function splint(target) {
	//splittyDiddles
	var cmdArr = target.split(",");
	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
	return cmdArr;
}

function readMoney(user) {
	try {
		var data = fs.readFileSync('config/money.csv', 'utf8');
	} catch (e) {
		return 0;
	}
	var rows = data.split("\n");
	var matched = false;
	for (var i = 0; i < rows.length; i++) {
		if (!rows[i]) continue;
		var parts = rows[i].split(",");
		var userid = toId(parts[0]);
		if (user === userid) {
			var matched = true;
			var amount = Number(parts[1]);
			break;
		}
	}
	if (matched === true) {
		return amount;
	} else {
		return 0;
	}
}
exports.readMoney = readMoney;

function writeMoney(filename, user, amount, callback) {
	if (!filename || !user || !amount) return false;
	fs.readFile('config/' + filename + '.csv', 'utf8', function(err, data) {
		if (err) return false;
		if (!data || data == '') return console.log('DEBUG: (' + Date() + ') ' + filename + '.csv appears to be empty...');
		var row = data.split('\n');
		var matched = false;
		var line = '';
		var userMoney = 0;
		for (var i = 0; i < row.length; i++) {
			if (!row[i]) continue;
			var parts = row[i].split(',');
			var userid = toId(parts[0]);
			if (toId(user) == userid) {
				matched = true;
				userMoney = Number(parts[1]);
				line = row[i];
				break;
			}
		}
		userMoney += amount;
		if (matched == true) {
			var re = new RegExp(line, "g");
			var result = data.replace(re, toId(user) + ',' + userMoney);
			fs.writeFile('config/' + filename + '.csv', result, 'utf8', function(err) {
				if (err) return false;
				if (callback) callback(true);
				return;
			});
		} else {
			fs.appendFile('config/' + filename + '.csv', '\n' + toId(user) + ',' + userMoney);
			if (callback) callback(true);
			return;
		}
	});
}
exports.writeMoney = writeMoney;

function readMoneyAsync (user, callback) {
	fs.readFile('config/money.csv', 'utf8', function (err, data) {
		var rows = data.split("\n");
		var matched = false;
		for (var i = 0; i < rows.length; i++) {
			if (!rows[i]) continue;
			var parts = rows[i].split(",");
			var userid = toId(parts[0]);
			if (user === userid) {
				var matched = true;
				var amount = Number(parts[1]);
				break;
			}
		}
		callback((matched ? amount : 0));
	});
}
exports.readMoneyAsync = readMoneyAsync;

var cmds = {
	disqualify: 'dq',
	dq: function(target, room, user, connection, cmd) {
		if (!target) return this.sendReply('Usage: /' + cmd + ' [user]');
		this.parse('/tour disqualify ' + target);
	},
	endtour: function(target, room, user) {
		this.parse('/tour delete');
	},
	jt: 'j',
	jointour: 'j',
	j: function(target, room, user) {
		this.parse('/tour join');
	},
	lt: 'l',
	leavetour: 'l',
	l: function(target, room, user) {
		this.parse('/tour leave');
	},
};
for (var i in cmds) CommandParser.commands[i] = cmds[i];
