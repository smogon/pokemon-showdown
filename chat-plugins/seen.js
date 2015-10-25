/********************
* Seen plugin by jd *
********************/


var db = new sqlite3.Database('config/seen.db', function() {
	db.run("CREATE TABLE if not exists users (userid TEXT, lastonline INTEGER)");
});

function updateSeen (user) {
	var userid = toId(user);
	var now = Date.now();

	db.all("SELECT * FROM users WHERE userid=$userid", {$userid: userid}, function (err,rows) {
    	if (rows.length < 1) {
    		db.run("INSERT INTO users(userid, lastonline) VALUES ($userid, $date)", {$userid: userid, $date: now}, function(err) {
    			if (err) return console.log(err);
    		});
    	} else {
    		db.run("UPDATE users SET lastonline=$date WHERE userid=$userid", {$date: now, $userid: userid}, function(err) {
    			if (err) return console.log(err);
    		});
    	}
    });
}
global.updateSeen = updateSeen;

function lastSeen (user, callback) {
 	var self = this;
	db.all("SELECT * FROM users WHERE userid=$userid", {$userid: toId(user)}, function (err,rows) {
		callback((rows[0] ? rows[0].lastonline : false));
	});
}

exports.commands = {
	seen: function(target, room, user) {
		if (!target) return this.sendReply('Usage: /seen [user]');
		if (toId(target).length > 18) return this.sendReply('/seen - Usernames can\'t be longer than 18 characters.');
		if (!this.canBroadcast()) return;
		if (toId(target) == user.userid) return this.sendReplyBox('Have you looked in a mirror lately?');
		var self = this;
		var targetUser = Users(target);
		var name = target;
		var userid = toId(target);
		if (targetUser && targetUser.connected) return this.sendReplyBox("<b><font color=" + hashColor(Tools.escapeHTML(targetUser.name)) + ">" + Tools.escapeHTML(targetUser.name) + "</font></b> is <font color=green>online</font> right now");
		var output = '';
		
		lastSeen(userid, function(lastOnline) {
			if (!lastOnline) output = "<b><font color=" + hashColor((targetUser ? Tools.escapeHTML(targetUser.name) : Tools.escapeHTML(name))) + ">" +
				(targetUser ? Tools.escapeHTML(targetUser.name) : Tools.escapeHTML(name)) + "</font></b> has never been seen online.";
			var date = new Date(lastOnline);
			if (lastOnline) {
				output = "<b><font color=" + hashColor((targetUser ? Tools.escapeHTML(targetUser.name) : Tools.escapeHTML(name))) + ">" + 
					(targetUser ? Tools.escapeHTML(targetUser.name) : Tools.escapeHTML(name)) + "</font></b> was last seen online at " + date.toUTCString() + ".";
				var seconds = Math.floor(((Date.now() - lastOnline) / 1000));
				var minutes = Math.floor((seconds / 60));
				var hours = Math.floor((minutes / 60));
				var days = Math.floor((hours / 24));

				var secondsWord = (((seconds % 60) > 1 || (seconds % 60) == 0) ? 'seconds' : 'second');
				var minutesWord = (((minutes % 60) > 1 || (minutes % 60) == 0) ? 'minutes' : 'minute');
				var hoursWord = ((hours > 1 || hours == 0) ? 'hours' : 'hour');
				var daysWord = ((days === 1) ? 'day' : 'days');

				if (minutes < 1) {
					output += " (" + seconds + " " + secondsWord + " ago)";
				}
				if (minutes > 0 && minutes < 60) {
					output += " (" + minutes + " " + minutesWord + " ago)";
				}
				if (hours > 0 && days < 1) {
					output += " (" + hours + " " + hoursWord + " " + (minutes % 60) + " " + minutesWord + " ago)";
				}
				if (days > 0) {
					output += " (" + days + " " + daysWord + " ago)";
				}
		
			}
			self.sendReplyBox(output);
			room.update();
		});
	}
}
