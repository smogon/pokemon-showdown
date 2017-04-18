/*
*Credis: Lord Haji
*for convinience of users :D
*/

var fs = require('fs');
var moment = require('moment');

var seenData = {};
function loadData() {
	try {
		seenData = JSON.parse(fs.readFileSync('config/seenData.json', 'utf8'));
	} catch (e) {
		seenData = {};
	}
}
loadData();

function saveData() {
	fs.writeFileSync('config/seenData.json', JSON.stringify(seenData));
}

function updateSeen(userid) {
	if (!userid) return false;
	seenData[toId(userid)] = Date.now();
	saveData();
}

exports.commands = {
	lastseen: 'seen',
	seen: function (target, room, user) {
		try {
			switch (target) {
				case 'obj':
					if (!this.canBroadcast()) return;
					this.sendReplyBox("There have been " + Object.size(seenData) + " user names recorded in this database.");
					break;
				default:
					if (!this.canBroadcast()) return;
					var userid = toId(target);
					if (toId(target).length > 18) return this.sendReply("Usernames cannot be over 18 characters.");
					if (userid.length < 1) return this.sendReply("/seen - Please specify a name.");
					if (Users(target) && Users(target).connected) return this.sendReplyBox('<button class="astext" name="parseCommand" value="/user ' + target + '" target="_blank"><b><font color="' + userNameColor + '">' + target + '</b></font></button> is currently <font color="green">online</font>.');
					if (!seenData[userid]) return this.sendReplyBox('<button class="astext" style="background:transparent; border:none;" name="parseCommand" value="/user ' + target + '" target="_blank"><b>' + target + "</b></font></button> has <font color=\"red\">never</font> been seen online on this server.");
					var date = new Date(seenData[userid]);
					var userLastSeen = moment(seenData[userid]).format("MMMM Do YYYY, h:mm:ss a");
					var userLastSeenLabel = userLastSeen.substr(-2).toUpperCase(); //AM or PM
					this.sendReplyBox('<button class="astext" name="parseCommand" value="/user ' + target + '" target="_blank"><b><font color="' + userNameColor + '">' + target + '</b></font></button> was last seen online on ' + userLastSeen.substring(0, userLastSeen.length - 2) + userLastSeenLabel + ' EST. (' + moment(seenData[userid]).fromNow() + ')');
					break;
			}
		} catch (e) {
			return this.sendReply("Something failed: \n" + e.stack);
		}
	}
};
