/**
 * The Studio: Artist of the Day plugin
 * This is a daily activity where users nominate the featured artist for the day, which is selected randomly once voting has ended.
 * Only works in a room with the id 'thestudio'
 */

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
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.can('mute', null, room)) return false;
		if (artistOfTheDay.pendingNominations) return this.sendReply('Nominations for the Artist of the Day are already in progress.');

		artistOfTheDay.pendingNominations = true;
		room.addRaw('<div class="broadcast-blue"><strong>Nominations for the Artist of the Day have begun!</strong><br />' +
		            'Use /aotd nom to nominate an artist.</div>');
		this.privateModCommand('(' + user.name + ' began nominations for the Artist of the Day.)');
	},

	end: function (target, room, user) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.can('mute', null, room)) return false;
		if (!artistOfTheDay.pendingNominations) return this.sendReply('Nominations for the Artist of the Day are not in progress.');
		if (!artistOfTheDay.nominations.size) return this.sendReply('No nominations have been submitted yet.');

		var nominations = Array.from(artistOfTheDay.nominations.values());
		var artist = nominations[~~Math.random(nominations.length)];
		artistOfTheDay.pendingNominations = false;
		artistOfTheDay.nominations.clear();
		artistOfTheDay.removedNominators = [];
		room.chatRoomData.artistOfTheDay = artist;
		Rooms.global.writeChatRoomData();
		room.addRaw('<div class="broadcast-blue"><strong>Nominations for the Artist of the Day have ended!</strong><br />' +
		            'Selected artist: ' + Tools.escapeHTML(artist) + '</div>');
		this.privateModCommand('(' + user.name + ' ended nominations for the Artist of the Day.)');
	},

	nom: function (target, room, user) {
		if (room.id !== 'thestudio' || !room.chatRoomData) return false;
		if (!artistOfTheDay.pendingNominations) return this.sendReply('Nominations for the Artist of the Day are not in progress.');

		var removedNominators = artistOfTheDay.removedNominators;
		if (removedNominators.indexOf(user) > -1) return this.sendReply('Since your nomination has been removed, you cannot submit another artist until the next round.');

		var alts = user.getAlts();
		for (var i = removedNominators.length; i--;) {
			if (alts.indexOf(removedNominators[i].name) > -1) return this.sendReply('Since your nomination has been removed, you cannot submit another artist until the next round.');
		}

		var nominationId = toId(target);
		if (!nominationId) return this.sendReply('No valid artist was specified.');
		if (toId(room.chatRoomData.artistOfTheDay) === nominationId) return this.sendReply('' + target + ' was the last Artist of the Day.');

		for (var data, nominationsIterator = artistOfTheDay.nominations.entries(); !!(data = nominationsIterator.next().value);) { // replace with for-of loop once available
			if (alts.indexOf(data[0].name) > -1) return this.sendReply('You have already submitted a nomination for the Artist of the Day.');
			if (nominationId === toId(data[1])) return this.sendReply('' + target + ' has already been nominated.');
		}

		artistOfTheDay.nominations.set(user, target);
		this.sendReply('' + target + ' was nominated for the Artist of the Day.');
	},

	viewnoms: function (target, room, user) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.can('mute', null, room)) return false;
		if (!artistOfTheDay.pendingNominations) return this.sendReply('Nominations for the Artist of the Day are not in progress.');
		if (!artistOfTheDay.nominations.size) return this.sendReplyBox('No nominations have been submitted yet.');

		var nominations = Array.from(artistOfTheDay.nominations.entries()).sort(function (a, b) {
			if (a[1] < b[1]) return 1;
			if (a[1] > b[1]) return -1;
			return 0;
		});
		var i = nominations.length;
		var buffer = 'Current nomination' + (i === 1 ? ':' : 's:');
		while (i--) {
			buffer += '<br />- ' + nominations[i][1] + ' (submitted by ' + Tools.escapeHTML(nominations[i][0].name) + ')';
		}
		this.sendReplyBox(buffer);
	},

	removenom: function (target, room, user) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.can('mute', null, room) || !target) return false;
		if (!artistOfTheDay.pendingNominations) return this.sendReply('Nominations for the Artist of the Day are not in progress.');
		if (!artistOfTheDay.nominations.size) return this.sendReply('No nominations have been submitted yet.');

		var userid = toId(target);
		if (!userid) return this.sendReply('"' + target + '" is not a valid username.');

		for (var nominator, nominatorsIterator = artistOfTheDay.nominations.keys(); !!(nominator = nominatorsIterator.next().value);) { // replace with for-of loop once available
			if (nominator.userid === userid) {
				artistOfTheDay.nominations.delete(nominator);
				artistOfTheDay.removedNominators.push(nominator);
				return this.privateModCommand('(' + user.name + ' removed ' + nominator.name + '\'s nomination for the Artist of the Day.)');
			}
		}

		var targetUser = Users.get(userid);
		this.sendReply('User "' + (targetUser ? targetUser.name : target) + '" has no nomination for the Artist of the Day.');
	},

	set: function (target, room, user) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.can('mute', null, room)) return false;
		if (!toId(target)) return this.sendReply('No valid artist was specified.');
		if (artistOfTheDay.pendingNominations) return this.sendReply('The Artist of the Day cannot be set while nominations are in progress.');

		room.chatRoomData.artistOfTheDay = target;
		Rooms.global.writeChatRoomData();
		this.sendReply('The Artist of the Day was set to ' + target + '.');
		this.privateModCommand('(' + user.name + ' set the Artist of the Day to ' + target + '.)');
	},

	'': function (target, room) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.canBroadcast()) return false;

		var artist = room.chatRoomData.artistOfTheDay;
		if (!artist) return this.sendReply('No Artist of the Day has been set.');

		this.sendReply('The Artist of the Day is ' + artist + '.');
	},

	help: function (target, room) {
		if (room.id !== 'thestudio' || !room.chatRoomData || !this.canBroadcast()) return false;
		this.sendReplyBox('The Studio: Artist of the Day plugin commands:<br />' +
		                  '- /aotd - View the Artist of the Day.<br />' +
				  '- /aotd start - Start nominations for the Artist of the Day. Requires: % @ # & ~<br />' +
				  '- /aotd nom - Nominate an artist for the Artist of the Day.<br />' +
				  '- /aotd viewnoms - View the current nominations for the Artist of the Day. Requires: % @ # & ~<br />' +
				  '- /aotd removenom [username] - Remove a user\'s nomination for the Artist of the Day and prevent them from voting again until the next round. Requires: % @ # & ~<br />' +
				  '- /aotd end - End nominations for the Artist of the Day and set it to a randomly selected artist. Requires: % @ # & ~<br />' +
				  '- /aotd set [artist] - Set the Artist of the Day. Requires: % @ # & ~');
	}
};

exports.commands = {
	aotd: commands
};
