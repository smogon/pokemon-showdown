/**
 * Tells
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Tells are the offline messaging system for PS. They are received when a
 * user successfully connects under a name that has tells waiting, and are
 * sent when a pm is sent to a user who does not exist or is not online.
 *
 * Tells are cleared after they have existed for a certain length of time
 * in order to remove any inactive messages. This length of time can be
 * specified in config.js
 *
 * @license MIT license
 */

var fs = require('fs');

var tells = {inbox: {}, outbox: {}};
try {
	tells = JSON.parse(fs.readFileSync('config/tells.json'));
} catch (e) {} // file doesn't exist (yet)

/**
 * Purge expired messages from those stored
 * @param threshold	The age limit of an "old" tell, in ms
 */
exports.pruneOld = pruneOld = function(threshold) {
	var now = Date.now();
	for (var i in Tells.inbox) {
		for (var n = 0; n < Tells.inbox[i].length; n++) {
			console.log(i + ', ' + String(n) + ': ' + String((now - Tells.inbox[i][n].time) >= threshold));
			if ((now - Tells.inbox[i][n].time) >= threshold) {
				for (var ip in Tells.inbox[i][n].ips) {
					if (Tells.outbox[ip]) Tells.outbox[ip]--;
					if (Tells.outbox[ip] <= 0) delete Tells.outbox[ip];
				}
				Tells.inbox[i].splice(n, 1);
				n--;
			}
		}
		if (!Tells.inbox[i].length) delete Tells.inbox[i];
	}
	Tells.writeTells();
};

exports.inbox = tells.inbox || {};
exports.outbox = tells.outbox || {};

/**
 * Write the inbox and outbox to file
 */
exports.writeTells = (function() {
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
		var data = JSON.stringify({inbox: Tells.inbox, outbox: Tells.outbox});
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
})();

/**
 * Format a user's inbox and send it on to the client to be delivered
 * @param userid	The userid whose tells to send
 * @param user		The User object to send the tells to
 */
exports.sendTell = function(userid, user) {
	var buffer = '|tells';
	var tellsToSend = Tells.inbox[userid];
	for (var i = 0; i < tellsToSend.length; i++) {
		for (var ip in tellsToSend[i].ips) {
			if (Tells.outbox[ip]) Tells.outbox[ip]--;
			if (Tells.outbox[ip] <= 0) delete Tells.outbox[ip];
		}
		var timeStr = Tells.getTellTime(tellsToSend[i].time);
		buffer += '|' + tellsToSend[i].sender + '| said ' + timeStr + ' ago: ' + tellsToSend[i].msg.replace(/\|/g, '&#124;');
	}
	user.send(buffer);
	delete Tells.inbox[userid];
	Tells.writeTells();
};

/**
 * Store a tell to be received later
 * @param sender	The User object of the sender
 * @param receiver	The target userid
 * @param msg		The message to be send
 * @return		false if the receiver has a full inbox
 *			null if the sender has a full outbox
 *			otherwise true
 */
exports.addTell = function(sender, receiver, msg) {
	if (Tells.inbox[receiver] && Tells.inbox[receiver].length >= 5) return false;
	for (var ip in sender.ips) {
		if (!Tells.outbox[ip]) {
			Tells.outbox[ip] = 1;
		} else {
			if (Tells.outbox[ip] >= 10) return null;
			Tells.outbox[ip]++;
		}
	}
	if (!Tells.inbox[receiver]) Tells.inbox[receiver] = [];
	var newTell = {
		'sender': sender.name,
		time: Date.now(),
		'msg': msg,
		ips: sender.ips
	};
	Tells.inbox[receiver].push(newTell);
	Tells.writeTells();
	return true;
};
/**
 * Converts a UNIX timestamp into 'x minutes, y seconds ago' form
 * @param time	UNIX timestamp (e.g., 1405460769855)
 * @return 	A human readable time difference between now and the given time
 */
exports.getTellTime = function(time) {
	time = Date.now() - time;
	time = Math.round(time/1000); // rounds to nearest second
	var seconds = time%60;
	var times = [];
	if (seconds) times.push(String(seconds) + (seconds === 1 ? ' second' : ' seconds'));
	var minutes, hours, days;
	if (time >= 60) {
		time = (time - seconds)/60; // converts to minutes
		minutes = time%60;
		if (minutes) times = [String(minutes) + (minutes === 1 ? ' minute' : ' minutes')].concat(times);
		if (time >= 60) {
			time = (time - minutes)/60; // converts to hours
			hours = time%24;
			if (hours) times = [String(hours) + (hours === 1 ? ' hour' : ' hours')].concat(times);
			if (time >= 24) {
				days = (time - hours)/24; // you can probably guess this one
				if (days) times = [String(days) + (days === 1 ? ' day' : ' days')].concat(times);
			}
		}
	}
	if (!times.length) times.push('0 seconds');
	return times.join(', ');
};

// clear old messages every two hours
exports.pruneOldTimer = setInterval(pruneOld, 1000*60*60*2, Config.tellsexpiryage || 1000*60*60*24*7);

