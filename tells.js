/**
 * Tells
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Tells are the offline messaging system for PS. They are received when a
 * user successfully connects under a name that has tells waiting, and are
 * sent when a pm is sent to a user who does not exist or is not online.
 *
 * Tells are cleared after they have existed for 7 days or greater, on
 * server restart, in order to remove any inactive messages.
 *
 * @license MIT license
 */

var tells = {};
try {
	tells = JSON.parse(fs.readFileSync('config/tells.json'));
} catch (e) {} // file doesn't exist (yet)

var Tells = {
	"tells": tells,

	writeTells: (function() {
		var writing = false;
		var writePending = false; // whether or not a new write is pending
		var finishWriting = function() {
			writing = false;
			if (writePending) {
				writePending = false;
				Tells.writeTells();
			}
		};
		return function() {
			if (writing) {
				writePending = true;
				return;
			}
			writing = true;
			var data = JSON.stringify(Tells.tells);
			fs.writeFile('config/tells.json.0', data, function() {
				// rename is atomic on POSIX, but will throw an error on Windows
				fs.rename('config/tells.json.0', 'config/tells.json', function(err) {
					if (err) {
						// This should only happen on Windows.
						fs.writeFile('config/tells.json', data, finishWriting);
						return;
					}
					finishWriting();
				});
			});
		};
	})(),

	sendTell: function(userid, user) {
		var buffer = '|tells';
		var tellsToSend = Tells.tells[userid];
		for (var i = 1; i <= Object.size(tellsToSend); i++){
			var timeStr = Tells.getTellTime(tellsToSend[i].time);
			buffer += '|' + tellsToSend[i].sender + '| said ' + timeStr + ' ago: ' + tellsToSend[i].message.replace('|', '&#124;');
		}
		user.send(buffer);
		delete Tells.tells[userid];
	},

	addTell: function(sender, receiver, message) {
		if (!Tells.tells[receiver]) Tells.tells[receiver] = {};
		var tellNum = Object.size(Tells.tells[receiver]) + 1;
		if (tellNum > 5) return false;
		var newTell = {
			"sender": sender,
			"time": Date.now(),
			"message": message
		};
		tells[receiver][tellNum] = Tells.tells[receiver][tellNum] = newTell;
		Tells.writeTells();
		return true;
	},

	getTellTime: function(time) {
		time = Date.now() - time;
		time = Math.round(time/1000); // rounds to nearest second
		var seconds = time%60;
		var times = [];
		if (seconds) times.push(String(seconds) + (seconds === 1?' second':' seconds'));
		var minutes, hours, days;
		if (time >= 60) {
			time = (time - seconds)/60; // converts to minutes
			minutes = time%60;
			if (minutes) times = [String(minutes) + (minutes === 1?' minute':' minutes')].concat(times);
			if (time >= 60) {
				time = (time - minutes)/60; // converts to hours
				hours = time%24;
				if (hours) times = [String(hours) + (hours === 1?' hour':' hours')].concat(times);
				if (time >= 24) {
					days = (time - hours)/24; // you can probably guess this one
					if (days) times = [String(days) + (days === 1?' day':' days')].concat(times);
				}
			}
		}
		if (!times.length) times.push('0 seconds');
		return times.join(', ');
	},

	pruneOld: function(threshold) {
		var now = Date.now();
		for (var i in tells) {
			for (var tell in tells[i]) {
				if ((now - tells[i][tell].time) > threshold) {
					delete tells[i][tell];
				}
			}
			if (Object.size(tells[i]) === 0) delete tells[i];
		}
		Tells.writeTells();
	}
};

exports.tells = tells;
exports.getTellTime = Tells.getTellTime;
exports.addTell = Tells.addTell;
exports.sendTell = Tells.sendTell;
exports.writeTells = Tells.writeTells
exports.pruneOld = Tells.pruneOld;
exports.pruneOldTimer = setInterval(Tells.pruneOld, 1000*60*60*2, config.tellsexpiryage || 1000*60*60*24*7);
