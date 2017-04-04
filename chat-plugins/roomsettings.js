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
		this.sameCommand = false;
		this.generateDisplay();
	}
	button(setting, disable, command) {
		if (disable) {
			return Chat.html`<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">${setting}</button> `;
		}
		return Chat.html`<button class="button" name="send" value="/roomsetting ${command}">${setting}</button> `;
	}
	modchat() {
		if (!this.user.can('modchat', null, this.room)) return this.button(this.room.modchat ? this.room.modchat : 'off', true);
		let modchatOutput = [];
		for (let i = 0; i <= RANKS.length; i++) {
			if (RANKS[i] === Config.groupsranking[0] && !this.room.modchat) {
				modchatOutput.push(this.button('off', true));
			} else if (RANKS[i] === Config.groupsranking[0]) {
				modchatOutput.push(this.button('off', null, 'modchat off'));
			} else if (RANKS[i] === this.room.modchat) {
				modchatOutput.push(this.button(RANKS[i], true));
			} else if (RANKS[i]) {
				let rankIndex = RANKS.indexOf(RANKS[i]);
				let roomAuth = (this.room.auth && this.room.auth[this.user.userid] ? this.room.auth[this.user.userid] : false);
				let roomAuthIndex = (roomAuth ? RANKS.indexOf(roomAuth) : false);
				if (rankIndex > 1 && !this.user.can('modchatall', null, this.room)) continue;
				if (roomAuth && !this.user.can('bypassall')) {
					if (rankIndex > roomAuthIndex) continue;
				}
				modchatOutput.push(this.button(RANKS[i], null, `modchat ${RANKS[i]}`));
			}
		}
		// Since autoconfirmed isn't technically a Config rank...
		let acStatus = this.room.modchat === 'autoconfirmed';
		modchatOutput.splice(1, 0, this.button('AC', acStatus, 'modchat autoconfirmed'));
		return modchatOutput.join(' ');
	}
	modjoin() {
		if (!this.user.can('makeroom') && !this.room.isPersonal) return this.button(this.room.modjoin ? this.room.modjoin : 'off', true);
		let modjoinOutput = [];
		for (let i = 0; i < RANKS.length; i++) {
			if (RANKS[i] === Config.groupsranking[0] && !this.room.modjoin) {
				modjoinOutput.push(this.button('off', true));
			} else if (RANKS[i] === Config.groupsranking[0]) {
				modjoinOutput.push(this.button('off', null, 'modjoin off'));
			} else if (RANKS[i] === this.room.modjoin) {
				modjoinOutput.push(this.button(RANKS[i], true));
			} else if (RANKS[i]) {
				// Personal rooms modjoin check
				if (this.room.isPersonal && !this.user.can('makeroom') && RANKS[i] !== '+') continue;

				modjoinOutput.push(this.button(RANKS[i], false, `modjoin ${RANKS[i]}`));
			}
		}
		return modjoinOutput.join(' ');
	}
	stretching() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.filterStretching ? 'filter stretching' : 'off', true);
		if (this.room.filterStretching) {
			return `${this.button('off', null, 'stretchfilter off')} ${this.button('filter stretching', true)}`;
		} else {
			return `${this.button('off', true)} ${this.button('filter stretching', null, 'stretchfilter on')}`;
		}
	}
	capitals() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.filterCaps ? 'filter capitals' : 'off', true);
		if (this.room.filterCaps) {
			return `${this.button('off', null, 'capsfilter off')} ${this.button('filter capitals', true)}`;
		} else {
			return `${this.button('off', true)} ${this.button('filter capitals', null, 'capsfilter on')}`;
		}
	}
	slowchat() {
		if (!this.user.can('editroom', null, this.room) || (!this.user.can('bypassall') && this.room.userCount < SLOWCHAT_USER_REQUIREMENT)) return this.button(this.room.slowchat ? this.room.slowchat : 'off', true);

		let slowchatOutput = [];
		for (let i of [5, 10, 20, 30, 60]) {
			if (this.room.slowchat === i) {
				slowchatOutput.push(this.button(`${i}s`, true));
			} else {
				slowchatOutput.push(this.button(`${i}s`, null, `slowchat ${i}`));
			}
		}
		if (!this.room.slowchat) {
			slowchatOutput.unshift(this.button('off', true));
		} else {
			slowchatOutput.unshift(this.button('off', null, 'slowchat false'));
		}
		return slowchatOutput.join(' ');
	}
	tourStatus() {
		if (!this.user.can('tournamentsmanagement', null, this.room)) return this.button(this.room.toursEnabled === true ? '@' : this.room.toursEnabled === '%' ? '%' : '#', true);

		if (this.room.toursEnabled === true) {
			return `${this.button('%', null, 'tournament enable %')} ${this.button('@', true)} ${this.button('#', null, 'tournament disable')}`;
		} else if (this.room.toursEnabled === '%') {
			return `${this.button('%', true)} ${this.button('@', null, 'tournament enable @')} ${this.button('#', null, 'tournament disable')}`;
		} else {
			return `${this.button('%', null, 'tournament enable %')} ${this.button('@', null, 'tournament enable @')} ${this.button('#', true)}`;
		}
	}
	uno() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.unoDisabled ? 'UNO disabled' : 'UNO enabled', true);
		if (this.room.unoDisabled) {
			return `${this.button('UNO enable', null, 'uno enable')} ${this.button('UNO disable', true)}`;
		} else {
			return `${this.button('UNO enable', true)} ${this.button('UNO disable', null, 'uno disable')}`;
		}
	}
	hangman() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.hangmanDisabled ? 'Disabled' : 'Enabled', true);
		if (this.room.hangmanDisabled) {
			return `${this.button('Hangman enable', null, 'hangman enable')} ${this.button('Hangman disable', true)}`;
		} else {
			return `${this.button('Hangman enable', true)} ${this.button('Hangman disable', null, 'hangman disable')}`;
		}
	}
	generateDisplay(user, room, connection) {
		let output = `<div class="infobox">Room Settings for ${Chat.escapeHTML(this.room.title)}<br />`;
		output += `<strong>Modchat:</strong> <br />${this.modchat()}<br />`;
		output += `<strong>Modjoin:</strong> <br />${this.modjoin()}<br />`;
		output += `<strong>Stretch filter:</strong> <br />${this.stretching()}<br />`;
		output += `<strong>Caps filter:</strong> <br />${this.capitals()}<br />`;
		output += `<strong>Slowchat:</strong> <br />${this.slowchat()}<br />`;
		output += `<strong>Tournaments:</strong> <br />${this.tourStatus()}<br />`;
		output += `<strong>UNO:</strong> <br />${this.uno()}<br />`;
		output += `<strong>Hangman:</strong> <br />${this.hangman()}<br />`;
		output += '</div>';

		this.user.sendTo(this.room, `|uhtml${(this.sameCommand ? '' : 'change')}|roomsettings|${output}`);
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
			this.parse(`/${target}`);
			settings.updateSetting(target);
		}
	},
	roomsettingshelp: ["/roomsettings - Shows current room settings with buttons to change them (if you can)."],

	modchat: function (target, room, user) {
		if (!target) {
			const modchatSetting = (room.modchat || "OFF");
			return this.sendReply(`Moderated chat is currently set to: ${modchatSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('modchat', null, room)) return false;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.errorReply(`/modchat - Access denied for removing a setting higher than ${Config.groupsranking[1]}.`);
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
			target = '\u2606';
			/* falls through */
		default: {
			if (!Config.groups[target]) {
				this.errorReply(`The rank '${target}' was unrecognized as a modchat level.`);
				return this.parse('/help modchat');
			}
			if (Config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.errorReply(`/modchat - Access denied for setting higher than ${Config.groupsranking[1]}.`);
			}
			let roomGroup = (room.auth && room.isPrivate === true ? ' ' : user.group);
			if (room.auth && user.userid in room.auth) roomGroup = room.auth[user.userid];
			if (Config.groupsranking.indexOf(target) > Math.max(1, Config.groupsranking.indexOf(roomGroup)) && !user.can('makeroom')) {
				return this.errorReply(`/modchat - Access denied for setting higher than ${roomGroup}.`);
			}
			room.modchat = target;
			break;
		}
		}
		if (currentModchat === room.modchat) {
			return this.errorReply(`Modchat is already set to ${currentModchat}.`);
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><strong>Moderated chat was disabled!</strong><br />Anyone may talk now.</div>");
		} else {
			const modchatSetting = Chat.escapeHTML(room.modchat);
			this.add(`|raw|<div class=\"broadcast-red\"><strong>Moderated chat was set to ${modchatSetting}!</strong><br />Only users of rank ${modchatSetting} and higher can talk.</div>`);
		}
		if (room.battle && !room.modchat && !user.can('modchat')) room.requestModchat(null);
		this.privateModCommand(`(${user.name} set modchat to ${room.modchat})`);

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},
	modchathelp: ["/modchat [off/autoconfirmed/+/%/@/*/#/&/~] - Set the level of moderated chat. Requires: *, @ for off/autoconfirmed/+ options, # & ~ for all the options"],

	ioo: function (target, room, user) {
		return this.parse('/modjoin +');
	},

	inviteonly: function (target, room, user) {
		if (!target) return this.parse('/help inviteonly');
		if (target === 'on' || target === 'true' || target === 'yes') {
			return this.parse("/modjoin +");
		} else {
			return this.parse(`/modjoin ${target}`);
		}
	},
	inviteonlyhelp: ["/inviteonly [on|off] - Sets modjoin +. Users can't join unless invited with /invite. Requires: # & ~",
		"/ioo - Shortcut for /inviteonly on"],

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
			this.add(`|raw|<div class="broadcast-blue"><strong>This room is no longer invite only!</strong><br />Anyone may now join.</div>`);
			this.addModCommand(`${user.name} turned off modjoin.`);
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
			return;
		} else if (target === 'sync') {
			if (room.modjoin === true) return this.errorReply(`Modjoin is already set to sync modchat in this room.`);
			room.modjoin = true;
			this.add(`|raw|<div class="broadcast-red"><strong>Moderated join is set to sync with modchat!</strong><br />Only users who can speak in modchat can join.</div>`);
			this.addModCommand(`${user.name} set modjoin to sync with modchat.`);
		} else if (target in Config.groups) {
			if (room.battle && !user.can('makeroom') && target !== '+') return this.errorReply(`/modjoin - Access denied from setting modjoin past + in battles.`);
			if (room.isPersonal && !user.can('makeroom') && target !== '+') return this.errorReply(`/modjoin - Access denied from setting modjoin past + in group chats.`);
			if (room.modjoin === target) return this.errorReply(`Modjoin is already set to ${target} in this room.`);
			room.modjoin = target;
			if (target === '+') {
				this.add(`|raw|<div class="broadcast-red"><strong>This room is now invite only!</strong><br />Users must be rank + or invited with <code>/invite</code> to join</div>`);
			} else {
				this.add(`|raw|<div class="broadcast-red"><strong>Moderated join was set to ${target}!</strong><br />Only users of rank ${target} and higher can join.</div>`);
			}
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
		if (target === 'sync' && !room.modchat) this.parse(`/modchat ${Config.groupsranking[1]}`);
		if (!room.isPrivate) this.parse('/hiddenroom');
	},
	modjoinhelp: ["/modjoin [+|%|@|*|&|~|#|off] - Sets modjoin. Users lower than the specified rank can't join this room. Requires: # & ~",
		"/modjoin [sync|off] - Sets modjoin. Only users who can speak in modchat can join this room. Requires: # & ~"],

	slowchat: function (target, room, user) {
		if (!target) {
			const slowchatSetting = (room.slowchat || "OFF");
			return this.sendReply(`Slow chat is currently set to: ${slowchatSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('modchat', null, room)) return false;

		let targetInt = parseInt(target);
		if (target === 'off' || target === 'disable' || target === 'false') {
			if (!room.slowchat) return this.errorReply(`Slow chat is already disabled in this room.`);
			room.slowchat = false;
			this.add("|raw|<div class=\"broadcast-blue\"><strong>Slow chat was disabled!</strong><br />There is no longer a set minimum time between messages.</div>");
		} else if (targetInt) {
			if (!user.can('bypassall') && room.userCount < SLOWCHAT_USER_REQUIREMENT) return this.errorReply(`This room must have at least ${SLOWCHAT_USER_REQUIREMENT} users to set slowchat; it only has ${room.userCount} right now.`);
			if (room.slowchat === targetInt) return this.errorReply(`Slow chat is already set to ${room.slowchat} seconds in this room.`);
			if (targetInt < SLOWCHAT_MINIMUM) targetInt = SLOWCHAT_MINIMUM;
			if (targetInt > SLOWCHAT_MAXIMUM) targetInt = SLOWCHAT_MAXIMUM;
			room.slowchat = targetInt;
			this.add(`|raw|<div class=\"broadcast-red\"><strong>Slow chat was enabled!</strong><br />Messages must have at least ${room.slowchat} seconds between them.</div>`);
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
		if (!this.canTalk()) return;
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
		if (!this.canTalk()) return;
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

	banwords: 'banword',
	banword: {
		add: function (target, room, user) {
			if (!target || target === ' ') return this.parse('/help banword');
			if (!this.can('declare', null, room)) return false;

			if (!room.banwords) room.banwords = [];

			// Most of the regex code is copied from the client. TODO: unify them?
			let words = target.match(/[^,]+(,\d*}[^,]*)?/g);
			if (!words) return this.parse('/help banword');

			words = words.map(word => word.replace(/\n/g, '').trim());

			for (let i = 0; i < words.length; i++) {
				if (/[\\^$*+?()|{}[\]]/.test(words[i])) {
					if (!user.can('makeroom')) return this.errorReply("Regex banwords are only allowed for leaders or above.");

					try {
						let test = new RegExp(words[i]); // eslint-disable-line no-unused-vars
					} catch (e) {
						return this.errorReply(e.message.substr(0, 28) === 'Invalid regular expression: ' ? e.message : `Invalid regular expression: /${words[i]}/: ${e.message}`);
					}
				}
				if (room.banwords.indexOf(words[i]) > -1) {
					return this.errorReply(`${words[i]} is already a banned phrase.`);
				}
			}

			room.banwords = room.banwords.concat(words);
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModCommand(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were added by ${user.name}.)`);
				this.sendReply(`Banned phrases succesfully added. The list is currently: ${room.banwords.join(', ')}`);
			} else {
				this.privateModCommand(`(The banword '${words[0]}' was added by ${user.name}.)`);
				this.sendReply(`Banned phrase succesfully added. The list is currently: ${room.banwords.join(', ')}`);
			}

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		delete: function (target, room, user) {
			if (!target) return this.parse('/help banword');
			if (!this.can('declare', null, room)) return false;

			if (!room.banwords) return this.errorReply("This room has no banned phrases.");

			let words = target.match(/[^,]+(,\d*}[^,]*)?/g);
			if (!words) return this.parse('/help banword');

			words = words.map(word => word.replace(/\n/g, '').trim());

			for (let i = 0; i < words.length; i++) {
				let index = room.banwords.indexOf(words[i]);

				if (index < 0) return this.errorReply(`${words[i]} is not a banned phrase in this room.`);
			}

			room.banwords = room.banwords.filter(w => !words.includes(w));
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModCommand(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were removed by ${user.name}.)`);
				this.sendReply(`Banned phrases succesfully deleted. The list is currently: ${room.banwords.join(', ')}`);
			} else {
				this.privateModCommand(`(The banword '${words[0]}' was removed by ${user.name}.)`);
				this.sendReply(`Banned phrase succesfully deleted. The list is currently: ${room.banwords.join(', ')}`);
			}

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		list: function (target, room, user) {
			if (!this.can('mute', null, room)) return false;

			if (!room.banwords) return this.sendReply("This room has no banned phrases.");

			return this.sendReply(`Banned phrases in room ${room.id}: ${room.banwords.join(', ')}`);
		},

		"": function (target, room, user) {
			return this.parse("/help banword");
		},
	},
	banwordhelp: [
		"/banword add [words] - Adds the comma-separated list of phrases (& or ~ can also input regex) to the banword list of the current room. Requires: # & ~",
		"/banword delete [words] - Removes the comma-separated list of phrases from the banword list. Requires: # & ~",
		"/banword list - Shows the list of banned words in the current room. Requires: % @ * # & ~",
	],
};
