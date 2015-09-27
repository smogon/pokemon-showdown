/**
 * The Studio: Artist of the Day plugin
 * This is a daily activity where users nominate the featured artist for the day, which is selected randomly once voting has ended.
 * Only works in a room with the id 'thestudio'
 */

function toArrayOfArrays(map) {
	var ret = [];
	map.forEach(function (value, key) {
		ret.push([value, key]);
	});
	return ret;
}

function toArtistId(artist) { // toId would return '' for foreign/sadistic artists
	return artist.toLowerCase().replace(/\s/g, '').replace(/\b&\b/g, '');
}

var artistOfTheDay = {
	pendingNominations: false,
	nominations: new Map(),
	removedNominators: []
};

var theStudio = Rooms.get('thestudio');
if (theStudio && !theStudio.plugin) {
	theStudio.plugin = artistOfTheDay;
}

var commands = {
	start: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData || !this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (artistOfTheDay.pendingNominations) return this.sendReply("Nominations for the Artist of the Day are already in progress.");

		var nominations = artistOfTheDay.nominations;
		var prenominations = room.chatRoomData.prenominations;
		if (prenominations && prenominations.length) {
			for (var i = 0; i < prenominations.length; i++) {
				var prenomination = prenominations[i];
				nominations.set(Users.get(prenomination[0].userid) || prenomination[0], prenomination[1]);
			}
		}

		artistOfTheDay.pendingNominations = true;
		room.chatRoomData.prenominations = [];
		Rooms.global.writeChatRoomData();
		room.addRaw(
			"<div class=\"broadcast-blue\"><strong>Nominations for the Artist of the Day have begun!</strong><br />" +
		        "Use /aotd nom to nominate an artist.</div>"
		);
		this.privateModCommand("(" + user.name + " began nominations for the Artist of the Day.)");
	},
	starthelp: ["/aotd start - Start nominations for the Artist of the Day. Requires: % @ # & ~"],

	end: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData || !this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (!artistOfTheDay.pendingNominations) return this.sendReply("Nominations for the Artist of the Day are not in progress.");
		if (!artistOfTheDay.nominations.size) return this.sendReply("No nominations have been submitted yet.");

		var nominations = toArrayOfArrays(artistOfTheDay.nominations);
		var artist = nominations[~~(Math.random() * nominations.length)][0];
		artistOfTheDay.pendingNominations = false;
		artistOfTheDay.nominations.clear();
		artistOfTheDay.removedNominators = [];
		room.chatRoomData.artistOfTheDay = artist;
		Rooms.global.writeChatRoomData();
		room.addRaw(
			"<div class=\"broadcast-blue\"><strong>Nominations for the Artist of the Day have ended!</strong><br />" +
		        "Randomly selected artist: " + Tools.escapeHTML(artist) + "</div>"
		);
		this.privateModCommand("(" + user.name + " ended nominations for the Artist of the Day.)");
	},
	endhelp: ["/aotd end - End nominations for the Artist of the Day and set it to a randomly selected artist. Requires: % @ # & ~"],

	prenom: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!target) this.parse('/help aotd prenom');
		if (!room.chatRoomData || !target) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (artistOfTheDay.pendingNominations) return this.sendReply("Nominations for the Artist of the Day are in progress.");
		if (!room.chatRoomData.prenominations) room.chatRoomData.prenominations = [];

		var userid = user.userid;
		var ips = user.ips;
		var prenominationId = toArtistId(target);
		if (!prenominationId) return this.sendReply("" + target + " is not a valid artist name.");
		if (room.chatRoomData.artistOfTheDay && toArtistId(room.chatRoomData.artistOfTheDay) === prenominationId) return this.sendReply("" + target + " is already the current Artist of the Day.");

		var prenominations = room.chatRoomData.prenominations;
		var prenominationIndex = -1;
		var latestIp = user.latestIp;
		for (var i = 0; i < prenominations.length; i++) {
			if (toArtistId(prenominations[i][1]) === prenominationId) return this.sendReply("" + target + " has already been prenominated.");

			if (prenominationIndex < 0) {
				var prenominator = prenominations[i][0];
				if (prenominator.userid === userid || prenominator.ips[latestIp]) {
					prenominationIndex = i;
					break;
				}
			}
		}

		if (prenominationIndex >= 0) {
			prenominations[prenominationIndex][1] = target;
			Rooms.global.writeChatRoomData();
			return this.sendReply("Your prenomination was changed to " + target + ".");
		}

		prenominations.push([{name: user.name, userid: userid, ips: user.ips}, target]);
		Rooms.global.writeChatRoomData();
		this.sendReply("" + target + " was submitted for the next nomination period for the Artist of the Day.");
	},
	prenomhelp: ["/aotd prenom [artist] - Nominate an artist for the Artist of the Day between nomination periods."],

	nom: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!target) this.parse('/help aotd nom');
		if (!room.chatRoomData || !target) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (!artistOfTheDay.pendingNominations) return this.sendReply("Nominations for the Artist of the Day are not in progress.");

		var removedNominators = artistOfTheDay.removedNominators;
		if (removedNominators.indexOf(user) >= 0) return this.sendReply("Since your nomination has been removed, you cannot submit another artist until the next round.");

		var alts = user.getAlts();
		for (var i = 0; i < removedNominators.length; i++) {
			if (alts.indexOf(removedNominators[i].name) >= 0) return this.sendReply("Since your nomination has been removed, you cannot submit another artist until the next round.");
		}

		var nominationId = toArtistId(target);
		if (room.chatRoomData.artistOfTheDay && toArtistId(room.chatRoomData.artistOfTheDay) === nominationId) return this.sendReply("" + target + " was the last Artist of the Day.");

		var userid = user.userid;
		var latestIp = user.latestIp;
		for (var data, nominationsIterator = artistOfTheDay.nominations.entries(); !!(data = nominationsIterator.next().value);) { // replace with for-of loop once available
			var nominator = data[0];
			if (nominator.ips[latestIp] && nominator.userid !== userid || alts.indexOf(nominator.name) >= 0) return this.sendReply("You have already submitted a nomination for the Artist of the Day under the name " + nominator.name + ".");
			if (toArtistId(data[1]) === nominationId) return this.sendReply("" + target + " has already been nominated.");
		}

		var response = "" + user.name + (artistOfTheDay.nominations.has(user) ? " changed their nomination from " + artistOfTheDay.nominations.get(user) + " to " + target + "." : " nominated " + target + " for the Artist of the Day.");
		artistOfTheDay.nominations.set(user, target);
		room.add(response);
	},
	nomhelp: ["/aotd nom [artist] - Nominate an artist for the Artist of the Day."],

	viewnoms: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData) return false;

		var buffer = "";
		if (!artistOfTheDay.pendingNominations) {
			if (!user.can('mute', null, room)) return false;

			var prenominations = room.chatRoomData.prenominations;
			if (!prenominations || !prenominations.length) return this.sendReplyBox("No prenominations have been submitted yet.");

			prenominations = prenominations.sort(function (a, b) {
				if (a[1] > b[1]) return 1;
				if (a[1] < b[1]) return -1;
				return 0;
			});

			buffer += "Current prenominations:";
			for (var i = 0; i < prenominations.length; i++) {
				buffer += "<br />" +
					"- " + Tools.escapeHTML(prenominations[i][1]) + " (submitted by " + Tools.escapeHTML(prenominations[i][0].name) + ")";
			}
			return this.sendReplyBox(buffer);
		}

		if (!this.canBroadcast()) return false;
		if (!artistOfTheDay.nominations.size) return this.sendReplyBox("No nominations have been submitted yet.");

		var nominations = toArrayOfArrays(artistOfTheDay.nominations).sort(function (a, b) {
			if (a[1] > b[1]) return 1;
			if (a[1] < b[1]) return -1;
			return 0;
		});

		buffer += "Current nominations:";
		for (var i = 0; i < nominations.length; i++) {
			buffer += "<br />" +
				"- " + Tools.escapeHTML(nominations[i][0]) + " (submitted by " + Tools.escapeHTML(nominations[i][1].name) + ")";
		}

		this.sendReplyBox(buffer);
	},
	viewnomshelp: ["/aotd viewnoms - View the current nominations for the Artist of the Day. Requires: % @ # & ~"],

	removenom: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!target) this.parse('/help aotd removenom');
		if (!room.chatRoomData || !target || !this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (!artistOfTheDay.pendingNominations) return this.sendReply("Nominations for the Artist of the Day are not in progress.");
		if (!artistOfTheDay.nominations.size) return this.sendReply("No nominations have been submitted yet.");

		target = this.splitTarget(target);
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid) return this.errorReply("'" + name + "' is not a valid username.");

		for (var nominator, nominatorsIterator = artistOfTheDay.nominations.keys(); !!(nominator = nominatorsIterator.next().value);) { // replace with for-of loop once available
			if (nominator.userid === userid) {
				artistOfTheDay.nominations.delete(nominator);
				artistOfTheDay.removedNominators.push(nominator);
				return this.privateModCommand("(" + user.name + " removed " + nominator.name + "'s nomination for the Artist of the Day.)");
			}
		}

		this.sendReply("User '" + name + "' has no nomination for the Artist of the Day.");
	},
	removenomhelp: ["/aotd removenom [username] - Remove a user\'s nomination for the Artist of the Day and prevent them from voting again until the next round. Requires: % @ # & ~"],

	set: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!target) this.parse('/help aotd set');
		if (!room.chatRoomData || !this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (!toId(target)) return this.errorReply("No valid artist was specified.");
		if (artistOfTheDay.pendingNominations) return this.sendReply("The Artist of the Day cannot be set while nominations are in progress.");

		room.chatRoomData.artistOfTheDay = target;
		Rooms.global.writeChatRoomData();
		this.privateModCommand("(" + user.name + " set the Artist of the Day to " + target + ".)");
	},
	sethelp: ["/aotd set [artist] - Set the Artist of the Day. Requires: % @ # & ~"],

	quote: function (target, room, user) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData) return false;
		if (!target) {
			if (!this.canBroadcast()) return;
			if (!room.chatRoomData.artistQuoteOfTheDay) return this.sendReplyBox("The Artist Quote of the Day has not been set.");
			return this.sendReplyBox(
				"The current <strong>Artist Quote of the Day</strong> is:<br />" +
				"\"" + room.chatRoomData.artistQuoteOfTheDay + "\""
			);
		}
		if (!this.can('declare', null, room)) return false;
		if (target === 'off' || target === 'disable' || target === 'reset') {
			if (!room.chatRoomData.artistQuoteOfTheDay) return this.sendReply("The Artist Quote of the Day has already been reset.");
			delete room.chatRoomData.artistQuoteOfTheDay;
			this.sendReply("The Artist Quote of the Day was reset by " + Tools.escapeHTML(user.name) + ".");
			this.logModCommand(user.name + " reset the Artist Quote of the Day.");
			Rooms.global.writeChatRoomData();
			return;
		}
		room.chatRoomData.artistQuoteOfTheDay = Tools.escapeHTML(target);
		Rooms.global.writeChatRoomData();
		room.addRaw(
			"<div class=\"broadcast-blue\"><strong>The Artist Quote of the Day has been updated by " + Tools.escapeHTML(user.name) + ".</strong><br />" +
			"Quote: " + room.chatRoomData.artistQuoteOfTheDay + "</div>"
		);
		this.logModCommand(Tools.escapeHTML(user.name) + " updated the artist quote of the day to \"" + room.chatRoomData.artistQuoteOfTheDay + "\".");
	},
	quotehelp:  [
		"/aotd quote - View the current Artist Quote of the Day.",
		"/aotd quote [quote] - Set the Artist Quote of the Day. Requires: # & ~"
	],

	'': function (target, room) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData || !this.canBroadcast()) return false;
		this.sendReplyBox("The Artist of the Day " + (room.chatRoomData.artistOfTheDay ? "is " + room.chatRoomData.artistOfTheDay + "." : "has not been set yet."));
	},

	help: function (target, room) {
		if (room.id !== 'thestudio') return this.errorReply('This command can only be used in The Studio.');
		if (!room.chatRoomData || !this.canBroadcast()) return false;
		this.sendReply("Use /help aotd to view help for all commands, or /help aotd [command] for help on a specific command.");
	}
};

exports.commands = {
	aotd: commands,
	aotdhelp: [
		"The Studio: Artist of the Day plugin commands:",
		"- /aotd - View the Artist of the Day.",
		"- /aotd start - Start nominations for the Artist of the Day. Requires: % @ # & ~",
		"- /aotd nom [artist] - Nominate an artist for the Artist of the Day.",
		"- /aotd viewnoms - View the current nominations for the Artist of the Day. Requires: % @ # & ~",
		"- /aotd removenom [username] - Remove a user's nomination for the Artist of the Day and prevent them from voting again until the next round. Requires: % @ # & ~",
		"- /aotd end - End nominations for the Artist of the Day and set it to a randomly selected artist. Requires: % @ # & ~",
		"- /aotd prenom [artist] - Nominate an artist for the Artist of the Day between nomination periods.",
		"- /aotd set [artist] - Set the Artist of the Day. Requires: % @ # & ~",
		"- /aotd quote - View the current Artist Quote of the Day.",
		"- /aotd quote [quote] - Set the Artist Quote of the Day. Requires: # & ~"
	]
};
