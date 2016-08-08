/*
 * Room Settings plugin
 * By: panpawn
 * Special thanks: sirDonovan, Slayer95, Zarel
 */

'use strict';

const RANKS = Config.groupsranking;
const DISABLED = 'disabled="" style="font-weight:bold;"';

const SLOWCHAT_USER_REQUIREMENT = 10;

class RoomSettings {
	constructor(user, room, connection) {
		this.room = room;
		this.user = user;
		this.connection = connection;
		this.sameCommand = true;
	}
	updateSetting(command) {
		CommandParser.parse('/' + command, this.room, this.user, this.connection);
		this.sameCommand = false;
		this.generateDisplay();
	}
	modchat() {
		if (!this.user.can('modchat', null, this.room)) return "<button " + DISABLED + ">" + (this.room.modchat ? this.room.modchat : false) + "</button>";
		let modchatOutput = [];
		for (let i = 0; i <= RANKS.length; i++) {
			if (RANKS[i] === ' ' && !this.room.modchat) {
				modchatOutput.push('<button ' + DISABLED + '>false</button>');
			} else if (RANKS[i] === ' ') {
				modchatOutput.push('<button name="send" value="/roomsetting modchat false">false</button>');
			} else if (RANKS[i] === this.room.modchat) {
				modchatOutput.push('<button ' + DISABLED + '>' + RANKS[i] + '</button>');
			} else if (RANKS[i]) {
				let rankIndex = RANKS.indexOf(RANKS[i]);
				let roomAuth = (this.room.auth && this.room.auth[this.user.userid] ? this.room.auth[this.user.userid] : false);
				let roomAtuhIndex = (roomAuth ? RANKS.indexOf(roomAuth) : false);
				if (rankIndex > 1 && !this.user.can('modchatall', null, this.room)) continue;
				if (roomAuth && !this.user.can('bypassall')) {
					if (rankIndex > roomAtuhIndex) continue;
				}
				modchatOutput.push('<button name="send" value="/roomsetting modchat ' + RANKS[i] + '">' + RANKS[i] + '</button>');
			}
		}
		// Since autoconfirmed isn't technically a Config rank...
		modchatOutput.splice(1, 0, '<button ' + (this.room.modchat !== 'autoconfirmed' ? 'name="send" value="/roomsetting modchat autoconfirmed"' : DISABLED) + '>AC</button>');
		return modchatOutput.join(" | ");
	}
	modjoin() {
		if (!this.user.can('makeroom') && !this.room.isPersonal) return "<button " + DISABLED + ">" + (this.room.modjoin ? this.room.modjoin : false) + "</button>";
		let modjoinOutput = [];
		for (let i = 0; i < RANKS.length; i++) {
			if (RANKS[i] === ' ' && !this.room.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>false</button>');
			} else if (RANKS[i] === ' ') {
				modjoinOutput.push('<button name="send" value="/roomsetting modjoin false">false</button>');
			} else if (RANKS[i] === this.room.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>' + RANKS[i] + '</button>');
			} else if (RANKS[i]) {
				// Personal rooms modjoin check
				if (this.room.isPersonal && !this.user.can('makeroom') && RANKS[i] !== '+') continue;

				modjoinOutput.push('<button name="send" value="/roomsetting modjoin ' + RANKS[i] + '">' + RANKS[i] + '</button>');
			}
		}
		return modjoinOutput.join(" | ");
	}
	stretching() {
		if (!this.user.can('editroom', null, this.room)) return "<button " + DISABLED + ">" + (this.room.stretching ? this.room.stretching : false) + "</button>";
		if (this.room.filterStretching) {
			return '<button name="send" value="/roomsetting stretching disable">false</button> | <button ' + DISABLED + '>true</button>';
		} else {
			return '<button ' + DISABLED + '>false</button> | <button name="send" value="/roomsetting stretching enable">true</button>';
		}
	}
	capitals() {
		if (!this.user.can('editroom', null, this.room)) return "<button " + DISABLED + ">" + (this.room.capitals ? this.room.capitals : false) + "</button>";
		if (this.room.filterCaps) {
			return '<button name="send" value="/roomsetting capitals disable">false</button> | <button ' + DISABLED + '>true</button>';
		} else {
			return '<button ' + DISABLED + '>false</button> | <button name="send" value="/roomsetting capitals enable">true</button>';
		}
	}
	slowchat() {
		if (!this.user.can('editroom', null, this.room) || this.room.userCount < SLOWCHAT_USER_REQUIREMENT) return "<button " + DISABLED + ">" + (this.room.slowchat ? this.room.slowchat : false) + "</button>";

		let slowchatOutput = [];
		for (let i = 10; i <= 60; i += 10) {
			if (this.room.slowchat === i) {
				slowchatOutput.push('<button ' + DISABLED + '>' + i + '</button>');
			} else {
				slowchatOutput.push('<button name="send" value="/roomsetting slowchat ' + i + '">' + i + '</button>');
			}
		}
		if (!this.room.slowchat) {
			slowchatOutput.unshift('<button ' + DISABLED + '>false</button>');
		} else {
			slowchatOutput.unshift('<button name="send" value="/roomsettings slowchat false">false</button>');
		}
		return slowchatOutput.join(" | ");
	}
	generateDisplay(user, room, connection) {
		let output = '<div class="infobox">Room Settings for ' + Tools.escapeHTML(this.room.title) + '<br />';
		output += "<u>Modchat:</u> " + this.modchat() + "<br />";
		output += "<u>Modjoin:</u> " + this.modjoin() + "<br />";
		output += "<u>Stretching:</u> " + this.stretching() + "<br />";
		output += "<u>Capitals:</u> " + this.capitals() + "<br />";
		output += "<u>Slowchat:</u> " + this.slowchat() + "<br />";
		output += "</div>";

		this.user.sendTo(this.room, '|uhtml' + (this.sameCommand ? '' : 'change') + '|roomsettings|' + output);
	}
}

exports.commands = {
	roomsetting: 'roomsettings',
	roomsettings: function (target, room, user, connection) {
		if (room.battle) return this.errorReply("This command cannot be used in battle rooms.");
		let settings = new RoomSettings(user, room, connection);

		if (!target) {
			room.update();
			settings.generateDisplay(user, room, connection);
		} else {
			settings.updateSetting(target);
		}
	},
	roomsettingshelp: ["/roomsettings - Shows current room settings with buttons to change them (if you can)."],
};
