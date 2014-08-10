/**
* The Studio: Artist of the Day Plugin
* This is a daily activity where users get to nominate an artist to be Artist of the day, and it's randomly selected
* Only works in a room with the id "thestudio"
*/

exports.commands = {
	startaotd: function () {
		return this.parse('/toggleaotd on');
	},

	endaotd: function () {
		return this.parse('/toggleaotd off');
	},

	taotd: 'toggleaotd',
	toggleaotd: function (target, room, user) {
		if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
		if (!this.canTalk()) return;
		if (!this.can('mute', null, room)) return;
		if (!target) {
			return this.sendReply("/toggleaotd [on / off] - If on, this will start AOTD, if off, this will no longer allow people to use /naotd.");
		}
		if (target === 'on') {
			if (room.aotdOn) return this.sendReply("The Artist of the Day has already started.");
			room.addRaw(
				'<div class="broadcast-blue"><center>' +
					'<h3>Artist of the Day has started!</h3>' +
					"<p>(Started by " + Tools.escapeHTML(user.name) + ")</p>" +
					"<p>Use <strong>/naotd</strong> [artist] to nominate an artist!</p>" +
				'</center></div>'
			);
			room.aotdOn = true;
			this.logModCommand("Artist of the Day was started by " + Tools.escapeHTML(user.name) + ".");
		}
		if (target === 'off') {
			if (!room.aotdOn) return this.sendReply("The Artist of the Day has already ended.");
			room.addRaw("<b>Nominations are over!</b> (Turned off by " + Tools.escapeHTML(user.name) + ")");
			room.aotdOn = false;
		}
	},

	aotdfaq: 'aotdhelp',
	aotdhelp: function (target, room) {
		if (!this.canBroadcast()) return;
		if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
		this.sendReplyBox(
			"<h3>Artist of the Day:</h3>" +
			"<p>This is a room activity for The Studio where users nominate artists for the title of 'Artist of the Day'.</p>" +
			'<p>' +
				"Command List:" +
				'<ul>' +
					"<li>/naotd (artist) - This will nominate your artist of the day; only do this once, please.</li>" +
					"<li>/aotd - This allows you to see who the current Artist of the Day is.</li>" +
					"<li>/aotd (artist) - Sets an artist of the day. (requires %, @, #)</li>" +
					"<li>/startaotd - Will start AOTD (requires %, @, #)</li>" +
					"<li>/endaotd - Will turn off the use of /naotd, ending AOTD (requires %, @, #)</li>" +
				'</ul>' +
			'</p>' +
			"<p>More information on <a href=\"http://thepsstudioroom.weebly.com/artist-of-the-day.html\">Artist of the Day</a> and <a href=\"http://thepsstudioroom.weebly.com/commands.html\">these commands</a>.</p>"
		);
	},

	nominateartistoftheday: 'naotd',
	naotd: function (target, room, user) {
		if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
		if (!room.aotdOn) return this.sendReply("The Artist of the Day has already been chosen.");
		if (!target) return this.sendReply("/naotd [artist] - Nominates an artist for Artist of the Day.");
		if (target.length > 25) return this.sendReply("This Artist's name is too long; it cannot exceed 25 characters.");
		if (!this.canTalk()) return;
		room.addRaw(Tools.escapeHTML(user.name) + "'s nomination for Artist of the Day is: <strong><em>" + Tools.escapeHTML(target) + "</em></strong>");
	},

	artistoftheday: 'aotd',
	aotd: function (target, room, user) {
		if (room.id !== 'thestudio') return this.sendReply("This command can only be used in The Studio.");
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("The current Artist of the Day is: <b>" + Tools.escapeHTML(room.aotd) + "</b>");
			return;
		}
		if (!this.canTalk()) return;
		if (target.length > 25) return this.sendReply("This Artist\'s name is too long; it cannot exceed 25 characters.");
		if (!this.can('mute', null, room)) return;
		room.aotd = target;
		room.addRaw(
			'<div class="broadcast-green">' +
				"<h3>The Artist of the Day is now <font color=\"black\">" + Tools.escapeHTML(target) + "</font></h3>" +
				"<p>(Set by " + Tools.escapeHTML(user.name) + ".)</p>" +
				"<p>This Artist will be posted on our <a href=\"http://thepsstudioroom.weebly.com/artist-of-the-day.html\">Artist of the Day page</a>.</p>" +
			'</div>'
		);
		room.aotdOn = false;
		this.logModCommand("The Artist of the Day was changed to " + Tools.escapeHTML(target) + " by " + Tools.escapeHTML(user.name) + ".");
	}
};
