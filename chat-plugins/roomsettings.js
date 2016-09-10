/**
 * Room settings commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for settings relating to room setting filtering.
 *
 * @license MIT license
 */

'use strict';

const RANKS = Config.groupsranking;
const DISABLED = 'disabled="" style="font-weight:bold;"';

const SLOWCHAT_MINIMUM = 2;
const SLOWCHAT_MAXIMUM = 60;
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
				modchatOutput.push('<button ' + DISABLED + '>off</button>');
			} else if (RANKS[i] === ' ') {
				modchatOutput.push('<button name="send" value="/roomsetting modchat off">off</button>');
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
		return modchatOutput.join(" ");
	}
	modjoin() {
		if (!this.user.can('makeroom') && !this.room.isPersonal) return "<button " + DISABLED + ">" + (this.room.modjoin ? this.room.modjoin : 'off') + "</button>";
		let modjoinOutput = [];
		for (let i = 0; i < RANKS.length; i++) {
			if (RANKS[i] === ' ' && !this.room.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>off</button>');
			} else if (RANKS[i] === ' ') {
				modjoinOutput.push('<button name="send" value="/roomsetting modjoin off">off</button>');
			} else if (RANKS[i] === this.room.modjoin) {
				modjoinOutput.push('<button ' + DISABLED + '>' + RANKS[i] + '</button>');
			} else if (RANKS[i]) {
				// Personal rooms modjoin check
				if (this.room.isPersonal && !this.user.can('makeroom') && RANKS[i] !== '+') continue;

				modjoinOutput.push('<button name="send" value="/roomsetting modjoin ' + RANKS[i] + '">' + RANKS[i] + '</button>');
			}
		}
		return modjoinOutput.join(" ");
	}
	stretching() {
		if (!this.user.can('editroom', null, this.room)) return "<button " + DISABLED + ">" + (this.room.filterStretching ? this.room.filterStretching : 'off') + "</button>";
		if (this.room.filterStretching) {
			return '<button name="send" value="/roomsetting stretchfilter off">off</button> <button ' + DISABLED + '>filter stretching</button>';
		} else {
			return '<button ' + DISABLED + '>off</button> <button name="send" value="/roomsetting stretchfilter on">filter stretching</button>';
		}
	}
	capitals() {
		if (!this.user.can('editroom', null, this.room)) return "<button " + DISABLED + ">" + (this.room.filterCaps ? this.room.filterCaps : false) + "</button>";
		if (this.room.filterCaps) {
			return '<button name="send" value="/roomsetting capsfilter off">off</button> <button ' + DISABLED + '>filter capitals</button>';
		} else {
			return '<button ' + DISABLED + '>off</button> <button name="send" value="/roomsetting capsfilter on">filter capitals</button>';
		}
	}
	slowchat() {
		if (!this.user.can('editroom', null, this.room) || this.room.userCount < SLOWCHAT_USER_REQUIREMENT) return "<button " + DISABLED + ">" + (this.room.slowchat ? this.room.slowchat : 'off') + "</button>";

		let slowchatOutput = [];
		for (let i of [5, 10, 20, 30, 60]) {
			if (this.room.slowchat === i) {
				slowchatOutput.push('<button ' + DISABLED + '>' + i + 's</button>');
			} else {
				slowchatOutput.push('<button name="send" value="/roomsetting slowchat ' + i + '">' + i + 's</button>');
			}
		}
		if (!this.room.slowchat) {
			slowchatOutput.unshift('<button ' + DISABLED + '>off</button>');
		} else {
			slowchatOutput.unshift('<button name="send" value="/roomsettings slowchat false">off</button>');
		}
		return slowchatOutput.join(" ");
	}
	generateDisplay(user, room, connection) {
		let output = '<div class="infobox">Room Settings for ' + Tools.escapeHTML(this.room.title) + '<br />';
		output += "<b>Modchat:</b> <br />" + this.modchat() + "<br />";
		output += "<b>Modjoin:</b> <br />" + this.modjoin() + "<br />";
		output += "<b>Stretch filter:</b> <br />" + this.stretching() + "<br />";
		output += "<b>Caps filter:</b> <br />" + this.capitals() + "<br />";
		output += "<b>Slowchat:</b> <br />" + this.slowchat() + "<br />";
		output += "</div>";

		this.user.sendTo(this.room, '|uhtml' + (this.sameCommand ? '' : 'change') + '|roomsettings|' + output);
	}
}

exports.commands = {
	roomsetting: 'roomsettings',
	roomsettings: function (target, room, user, connection) {
		if (room.battle) return this.errorReply("This command cannot be used in battle rooms.");
		const settings = new RoomSettings(user, room, connection);

		if (!target) {
			room.update();
			settings.generateDisplay(user, room, connection);
		} else {
			settings.updateSetting(target);
		}
	},
	roomsettingshelp: ["/roomsettings - Shows current room settings with buttons to change them (if you can)."],

	modchat: function (target, room, user) {
		if (!target) {
			const modchatSetting = (room.modchat || "OFF");
			return this.sendReply(`Moderated chat is currently set to: ${modchatSetting}`);
		}
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('modchat', null, room)) return false;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.errorReply("/modchat - Access denied for removing a setting higher than " + Config.groupsranking[1] + ".");
		}
		if (room.requestModchat) {
			const error = room.requestModchat(user);
			if (error) return this.errorReply(error);
		}

		target = target.toLowerCase().trim();
		const currentModchat = room.modchat;
		switch (target) {
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case 'player':
			target = '\u2605';
			/* falls through */
		default: {
			if (!Config.groups[target]) {
				this.errorReply("The rank '" + target + '" was unrecognized as a modchat level.');
				return this.parse('/help modchat');
			}
			if (Config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.errorReply("/modchat - Access denied for setting higher than " + Config.groupsranking[1] + ".");
			}
			let roomGroup = (room.auth && room.isPrivate === true ? ' ' : user.group);
			if (room.auth && user.userid in room.auth) roomGroup = room.auth[user.userid];
			if (Config.groupsranking.indexOf(target) > Math.max(1, Config.groupsranking.indexOf(roomGroup)) && !user.can('makeroom')) {
				return this.errorReply("/modchat - Access denied for setting higher than " + roomGroup + ".");
			}
			room.modchat = target;
			break;
		}}
		if (currentModchat === room.modchat) {
			return this.errorReply("Modchat is already set to " + currentModchat + ".");
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>");
		} else {
			const modchatSetting = Tools.escapeHTML(room.modchat);
			this.add("|raw|<div class=\"broadcast-red\"><b>Moderated chat was set to " + modchatSetting + "!</b><br />Only users of rank " + modchatSetting + " and higher can talk.</div>");
		}
		if (room.battle && !room.modchat && !user.can('modchat')) room.requestModchat(null);
		this.privateModCommand("(" + user.name + " set modchat to " + room.modchat + ")");

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},
	modchathelp: ["/modchat [off/autoconfirmed/+/%/@/*/#/&/~] - Set the level of moderated chat. Requires: *, @ for off/autoconfirmed/+ options, # & ~ for all the options"],

	modjoin: function (target, room, user) {
		if (!target) {
			const modjoinSetting = room.modjoin === true ? "SYNC" : room.modjoin || "OFF";
			return this.sendReply(`Modjoin is currently set to: ${modjoinSetting}`);
		}
		if (room.battle || room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else {
			if (!this.can('makeroom')) return;
		}
		if (room.tour && !room.tour.modjoin) return this.errorReply(`You can't do this in tournaments where modjoin is prohibited.`);
		if (target === 'off' || target === 'false') {
			if (!room.modjoin) return this.errorReply(`Modjoin is already turned off in this room.`);
			delete room.modjoin;
			this.addModCommand(`${user.name} turned off modjoin.`);
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
			return;
		} else if (target === 'sync') {
			if (room.modjoin === true) return this.errorReply(`Modjoin is already set to sync modchat in this room.`);
			room.modjoin = true;
			this.addModCommand(`${user.name} set modjoin to sync with modchat.`);
		} else if (target in Config.groups) {
			if (room.battle && !this.can('makeroom')) return;
			if (room.isPersonal && !user.can('makeroom') && target !== '+') return this.errorReply(`/modjoin - Access denied from setting modjoin past + in group chats.`);
			if (room.modjoin === target) return this.errorReply(`Modjoin is already set to ${target} in this room.`);
			room.modjoin = target;
			this.addModCommand(`${user.name} set modjoin to ${target}.`);
		} else {
			this.errorReply(`Unrecognized modjoin setting.`);
			this.parse('/help modjoin');
			return false;
		}
		if (room.chatRoomData) {
			room.chatRoomData.modjoin = room.modjoin;
			Rooms.global.writeChatRoomData();
		}
		if (!room.modchat) this.parse('/modchat ' + Config.groupsranking[1]);
		if (!room.isPrivate) this.parse('/hiddenroom');
	},
	modjoinhelp: ["/modjoin [+|%|@|*|&|~|#|off] - Sets modjoin. Users lower than the specified rank can't join this room. Requires: # & ~",
		"/modjoin [sync|off] - Sets modjoin. Only users who can speak in modchat can join this room. Requires: # & ~"],

	slowchat: function (target, room, user) {
		if (!target) {
			const slowchatSetting = (room.slowchat || "OFF");
			return this.sendReply(`Slow chat is currently set to: ${slowchatSetting}`);
		}
		if (!this.canTalk()) return this.errorReply(`You cannot do this while unable to talk.`);
		if (!this.can('modchat', null, room)) return false;

		let targetInt = parseInt(target);
		if (target === 'off' || target === 'disable' || target === 'false') {
			if (!room.slowchat) return this.errorReply(`Slow chat is already disabled in this room.`);
			room.slowchat = false;
			this.add("|raw|<div class=\"broadcast-blue\"><b>Slow chat was disabled!</b><br />There is no longer a set minimum time between messages.</div>");
		} else if (targetInt) {
			if (room.userCount < SLOWCHAT_USER_REQUIREMENT) return this.errorReply(`This room must have at least ${SLOWCHAT_USER_REQUIREMENT}users to set slowchat; it only has ${room.userCount} right now.`);
			if (room.slowchat === targetInt) return this.errorReply(`Slow chat is already set to ${room.slowchat} seconds in this room.`);
			if (targetInt < SLOWCHAT_MINIMUM) targetInt = SLOWCHAT_MINIMUM;
			if (targetInt > SLOWCHAT_MAXIMUM) targetInt = SLOWCHAT_MAXIMUM;
			room.slowchat = targetInt;
			this.add("|raw|<div class=\"broadcast-red\"><b>Slow chat was enabled!</b><br />Messages must have at least " + room.slowchat + " seconds between them.</div>");
		} else {
			return this.parse("/help slowchat");
		}
		const slowchatSetting = (room.slowchat || "OFF");
		this.privateModCommand(`(${user.name} set slowchat to ${slowchatSetting})`);

		if (room.chatRoomData) {
			room.chatRoomData.slowchat = room.slowchat;
			Rooms.global.writeChatRoomData();
		}
	},
	slowchathelp: ["/slowchat [number] - Sets a limit on how often users in the room can send messages, between 2 and 60 seconds. Requires @ * # & ~",
		"/slowchat off - Disables slowchat in the room. Requires @ * # & ~"],

	stretching: 'stretchfilter',
	stretchingfilter: 'stretchfilter',
	stretchfilter: function (target, room, user) {
		if (!target) {
			const stretchSetting = (room.filterStretching ? "ON" : "OFF");
			return this.sendReply(`This room's stretch filter is currently: ${stretchSetting}`);
		}
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('editroom', null, room)) return false;

		if (target === 'enable' || target === 'on') {
			if (room.filterStretching) return this.errorReply(`This room's stretch filter is already ON`);
			room.filterStretching = true;
		} else if (target === 'disable' || target === 'off') {
			if (!room.filterStretching) return this.errorReply(`This room's stretch filter is already OFF`);
			room.filterStretching = false;
		} else {
			return this.parse("/help stretchfilter");
		}
		const stretchSetting = (room.filterStretching ? "ON" : "OFF");
		this.privateModCommand(`(${user.name} turned the stretch filter ${stretchSetting})`);

		if (room.chatRoomData) {
			room.chatRoomData.filterStretching = room.filterStretching;
			Rooms.global.writeChatRoomData();
		}
	},
	stretchfilterhelp: ["/stretchfilter [on/off] - Toggles filtering messages in the room for stretchingggggggg. Requires # & ~"],

	capitals: 'capsfilter',
	capitalsfilter: 'capsfilter',
	capsfilter: function (target, room, user) {
		if (!target) {
			const capsSetting = (room.filterCaps ? "ON" : "OFF");
			return this.sendReply(`This room's caps filter is currently: ${capsSetting}`);
		}
		if (!this.canTalk()) return this.errorReply(`You cannot do this while unable to talk.`);
		if (!this.can('editroom', null, room)) return false;

		if (target === 'enable' || target === 'on' || target === 'true') {
			if (room.filterCaps) return this.errorReply(`This room's caps filter is already ON`);
			room.filterCaps = true;
		} else if (target === 'disable' || target === 'off' || target === 'false') {
			if (!room.filterCaps) return this.errorReply(`This room's caps filter is already OFF`);
			room.filterCaps = false;
		} else {
			return this.parse("/help capsfilter");
		}
		const capsSetting = (room.filterCaps ? "ON" : "OFF");
		this.privateModCommand(`(${user.name} turned the caps filter ${capsSetting})`);

		if (room.chatRoomData) {
			room.chatRoomData.filterCaps = room.filterCaps;
			Rooms.global.writeChatRoomData();
		}
	},
	capsfilterhelp: ["/capsfilter [on/off] - Toggles filtering messages in the room for EXCESSIVE CAPS. Requires # & ~"],
};
