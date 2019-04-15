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
		for (const rank of RANKS) {
			if (rank === Config.groupsranking[0] && !this.room.modchat) {
				modchatOutput.push(this.button('off', true));
			} else if (rank === Config.groupsranking[0]) {
				modchatOutput.push(this.button('off', null, 'modchat off'));
			} else if (rank === this.room.modchat) {
				modchatOutput.push(this.button(rank, true));
			} else if (rank) {
				let rankIndex = RANKS.indexOf(rank);
				let roomAuth = (this.room.auth && this.room.auth[this.user.userid] ? this.room.auth[this.user.userid] : false);
				let roomAuthIndex = (roomAuth ? RANKS.indexOf(roomAuth) : false);
				if (rankIndex > 1 && !this.user.can('modchatall', null, this.room)) continue;
				if (roomAuth && !this.user.can('bypassall')) {
					if (rankIndex > roomAuthIndex) continue;
				}
				modchatOutput.push(this.button(rank, null, `modchat ${rank}`));
			}
		}
		// Since autoconfirmed isn't technically a Config rank...
		let acStatus = this.room.modchat === 'autoconfirmed';
		modchatOutput.splice(1, 0, this.button('AC', acStatus, 'modchat autoconfirmed'));
		return modchatOutput.join(' ');
	}
	modjoin() {
		if (!this.user.can('makeroom') && !this.room.isPersonal ||
			!this.user.can('editroom', null, this.room)) {
			return this.button(this.room.modjoin ? this.room.modjoin : 'off', true);
		}
		let modjoinOutput = [];
		for (const rank of RANKS) {
			if (rank === Config.groupsranking[0] && !this.room.modjoin) {
				modjoinOutput.push(this.button('off', true));
			} else if (rank === Config.groupsranking[0]) {
				modjoinOutput.push(this.button('off', null, 'modjoin off'));
			} else if (rank === this.room.modjoin) {
				modjoinOutput.push(this.button(rank, true));
			} else if (rank) {
				// groupchat hosts can set modjoin, but only to +
				if (this.room.isPersonal && !this.user.can('makeroom') && rank !== '+') continue;

				modjoinOutput.push(this.button(rank, false, `modjoin ${rank}`));
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
	emojis() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.filterEmojis ? 'filter emojis' : 'off', true);
		if (this.room.filterEmojis) {
			return `${this.button('off', null, 'emojifilter off')} ${this.button('filter emojis', true)}`;
		} else {
			return `${this.button('off', true)} ${this.button('filter emojis', null, 'emojifilter on')}`;
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
		if (!this.user.can('gamemanagement', null, this.room)) return this.button(this.room.toursEnabled === true ? '@' : this.room.toursEnabled === '%' ? '%' : '#', true);

		if (this.room.toursEnabled === true) {
			return `${this.button('%', null, 'tournament enable %')} ${this.button('@', true)} ${this.button('#', null, 'tournament disable')}`;
		} else if (this.room.toursEnabled === '%') {
			return `${this.button('%', true)} ${this.button('@', null, 'tournament enable @')} ${this.button('#', null, 'tournament disable')}`;
		} else {
			return `${this.button('%', null, 'tournament enable %')} ${this.button('@', null, 'tournament enable @')} ${this.button('#', true)}`;
		}
	}
	uno() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.unoDisabled ? 'off' : 'UNO enabled', true);
		if (this.room.unoDisabled) {
			return `${this.button('UNO enabled', null, 'uno enable')} ${this.button('off', true)}`;
		} else {
			return `${this.button('UNO enabled', true)} ${this.button('off', null, 'uno disable')}`;
		}
	}
	hangman() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.hangmanDisabled ? 'off' : 'Hangman enabled', true);
		if (this.room.hangmanDisabled) {
			return `${this.button('Hangman enabled', null, 'hangman enable')} ${this.button('off', true)}`;
		} else {
			return `${this.button('Hangman enabled', true)} ${this.button('off', null, 'hangman disable')}`;
		}
	}
	mafia() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.mafiaEnabled ? 'Mafia enabled' : 'off', true);
		if (this.room.mafiaEnabled) {
			return `${this.button('Mafia enabled', true)} ${this.button('off', null, 'mafia disable')}`;
		} else {
			return `${this.button('Mafia enabled', null, 'mafia enable')} ${this.button('off', true)}`;
		}
	}
	language() {
		if (!this.user.can('editroom', null, this.room)) return this.button(this.room.language ? Chat.languages.get(this.room.language) : 'English', true);

		let languageOutput = [];
		languageOutput.push(this.button(`English`, !this.room.language, 'roomlanguage english'));
		for (let [id, text] of Chat.languages) {
			languageOutput.push(this.button(text, this.room.language === id, `roomlanguage ${id}`));
		}
		return languageOutput.join(' ');
	}
	generateDisplay(user, room, connection) {
		let output = Chat.html`<div class="infobox">Room Settings for ${this.room.title}<br />`;
		output += `<strong>Language:</strong> <br />${this.language()}<br />`;
		output += `<strong>Modchat:</strong> <br />${this.modchat()}<br />`;
		output += `<strong>Modjoin:</strong> <br />${this.modjoin()}<br />`;
		output += `<strong>Stretch filter:</strong> <br />${this.stretching()}<br />`;
		output += `<strong>Caps filter:</strong> <br />${this.capitals()}<br />`;
		output += `<strong>Emoji filter:</strong> <br />${this.emojis()}<br />`;
		output += `<strong>Slowchat:</strong> <br />${this.slowchat()}<br />`;
		output += `<strong>Tournaments:</strong> <br />${this.tourStatus()}<br />`;
		output += `<strong>UNO:</strong> <br />${this.uno()}<br />`;
		output += `<strong>Hangman:</strong> <br />${this.hangman()}<br />`;
		output += `<strong>Mafia:</strong> <br />${this.mafia()}<br />`;
		output += '</div>';

		this.user.sendTo(this.room, `|uhtml${(this.sameCommand ? '' : 'change')}|roomsettings|${output}`);
	}
}

exports.commands = {
	roomsetting: 'roomsettings',
	roomsettings(target, room, user, connection) {
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
	roomsettingshelp: [`/roomsettings - Shows current room settings with buttons to change them (if you can).`],

	modchat(target, room, user) {
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
		case 'disable':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case 'trusted':
			room.modchat = 'trusted';
			break;
		case 'player':
			target = Users.PLAYER_SYMBOL;
			/* falls through */
		default:
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
		if (currentModchat === room.modchat) {
			return this.errorReply(`Modchat is already set to ${currentModchat}.`);
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><strong>Moderated chat was disabled!</strong><br />Anyone may talk now.</div>");
		} else {
			const modchatSetting = Chat.escapeHTML(room.modchat);
			this.add(`|raw|<div class="broadcast-red"><strong>Moderated chat was set to ${modchatSetting}!</strong><br />Only users of rank ${modchatSetting} and higher can talk.</div>`);
		}
		if (room.battle && !room.modchat && !user.can('modchat')) room.requestModchat(null);
		this.privateModAction(`(${user.name} set modchat to ${room.modchat})`);
		this.modlog('MODCHAT', null, `to ${room.modchat}`);

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},
	modchathelp: [`/modchat [off/autoconfirmed/+/%/@/*/player/#/&/~] - Set the level of moderated chat. Requires: * @ \u2606 for off/autoconfirmed/+ options, # & ~ for all the options`],

	ioo(target, room, user) {
		return this.parse('/modjoin +');
	},
	'!ionext': true,
	inviteonlynext: 'ionext',
	ionext(target, room, user) {
		const groupConfig = Config.groups[Users.PLAYER_SYMBOL];
		if (!(groupConfig && groupConfig.editprivacy)) return this.errorReply(`/ionext - Access denied.`);
		if (this.meansNo(target)) {
			user.inviteOnlyNextBattle = false;
			user.update('inviteOnlyNextBattle');
			this.sendReply("Your next battle will be publicly visible.");
		} else {
			user.inviteOnlyNextBattle = true;
			user.update('inviteOnlyNextBattle');
			this.sendReply("Your next battle will be invite-only.");
		}
	},
	ionexthelp: [
		`/ionext - Sets your next battle to be invite-only.`,
		`/ionext off - Sets your next battle to be publicly visible.`,
	],

	inviteonly(target, room, user) {
		if (!target) return this.parse('/help inviteonly');
		if (this.meansYes(target)) {
			return this.parse("/modjoin +");
		} else {
			return this.parse(`/modjoin ${target}`);
		}
	},
	inviteonlyhelp: [
		`/inviteonly [on|off] - Sets modjoin +. Users can't join unless invited with /invite. Requires: # & ~`,
		`/ioo - Shortcut for /inviteonly on`,
		`/inviteonlynext OR /ionext - Sets your next battle to be invite-only.`,
		`/ionext off - Sets your next battle to be publicly visible.`,
	],

	modjoin(target, room, user) {
		if (!target) {
			const modjoinSetting = room.modjoin === true ? "SYNC" : room.modjoin || "OFF";
			return this.sendReply(`Modjoin is currently set to: ${modjoinSetting}`);
		}
		if (room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else if (room.battle) {
			if (!this.can('editprivacy', null, room)) return;
		} else {
			if (!this.can('makeroom')) return;
		}
		if (room.tour && !room.tour.modjoin) return this.errorReply(`You can't do this in tournaments where modjoin is prohibited.`);
		if (target === 'player') target = Users.PLAYER_SYMBOL;
		if (this.meansNo(target)) {
			if (!room.modjoin) return this.errorReply(`Modjoin is already turned off in this room.`);
			room.modjoin = null;
			this.add(`|raw|<div class="broadcast-blue"><strong>This room is no longer invite only!</strong><br />Anyone may now join.</div>`);
			this.addModAction(`${user.name} turned off modjoin.`);
			this.modlog('MODJOIN', null, 'OFF');
			if (room.chatRoomData) {
				room.chatRoomData.modjoin = null;
				Rooms.global.writeChatRoomData();
			}
			return;
		} else if (target === 'sync') {
			if (room.modjoin === true) return this.errorReply(`Modjoin is already set to sync modchat in this room.`);
			room.modjoin = true;
			this.add(`|raw|<div class="broadcast-red"><strong>Moderated join is set to sync with modchat!</strong><br />Only users who can speak in modchat can join.</div>`);
			this.addModAction(`${user.name} set modjoin to sync with modchat.`);
			this.modlog('MODJOIN SYNC');
		} else if (target === 'ac' || target === 'autoconfirmed') {
			if (room.modjoin === 'autoconfirmed') return this.errorReply(`Modjoin is already set to autoconfirmed.`);
			room.modjoin = 'autoconfirmed';
			this.add(`|raw|<div class="broadcast-red"><strong>Moderated join is set to autoconfirmed!</strong><br />Users must be rank autoconfirmed or invited with <code>/invite</code> to join</div>`);
			this.addModAction(`${user.name} set modjoin to autoconfirmed.`);
			this.modlog('MODJOIN', null, 'autoconfirmed');
		} else if (target in Config.groups || target === 'trusted') {
			if (room.battle && !user.can('makeroom') && target !== '+') return this.errorReply(`/modjoin - Access denied from setting modjoin past + in battles.`);
			if (room.isPersonal && !user.can('makeroom') && target !== '+') return this.errorReply(`/modjoin - Access denied from setting modjoin past + in group chats.`);
			if (room.modjoin === target) return this.errorReply(`Modjoin is already set to ${target} in this room.`);
			room.modjoin = target;
			this.add(`|raw|<div class="broadcast-red"><strong>This room is now invite only!</strong><br />Users must be rank ${target} or invited with <code>/invite</code> to join</div>`);
			this.addModAction(`${user.name} set modjoin to ${target}.`);
			this.modlog('MODJOIN', null, target);
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
	modjoinhelp: [
		`/modjoin [+|%|@|*|player|&|~|#|off] - Sets modjoin. Users lower than the specified rank can't join this room unless they have a room rank. Requires: \u2606 # & ~`,
		`/modjoin [sync|off] - Sets modjoin. Only users who can speak in modchat can join this room. Requires: \u2606 # & ~`,
	],

	roomlanguage(target, room, user) {
		if (!target) return this.sendReply(`This room's primary language is ${Chat.languages.get(room.language) || 'English'}`);
		if (!this.can('editroom', null, room)) return false;

		let targetLanguage = toId(target);
		if (!Chat.languages.has(targetLanguage)) return this.errorReply(`"${target}" is not a supported language.`);

		room.language = targetLanguage === 'english' ? false : targetLanguage;

		if (room.chatRoomData) {
			room.chatRoomData.language = room.language;
			Rooms.global.writeChatRoomData();
		}
		this.modlog(`LANGUAGE`, null, Chat.languages.get(targetLanguage));
		this.sendReply(`The room's language has been set to ${Chat.languages.get(targetLanguage)}`);
	},
	roomlanguagehelp: [
		`/roomlanguage [language] - Sets the the language for the room, which changes language of a few commands. Requires # & ~`,
		`Supported Languages: English, Spanish, Italian, French, Simplified Chinese, Traditional Chinese, Japanese, Hindi, Turkish, Dutch, German.`,
	],

	slowchat(target, room, user) {
		if (!target) {
			const slowchatSetting = (room.slowchat || "OFF");
			return this.sendReply(`Slow chat is currently set to: ${slowchatSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('modchat', null, room)) return false;

		let targetInt = parseInt(target);
		if (this.meansNo(target)) {
			if (!room.slowchat) return this.errorReply(`Slow chat is already disabled in this room.`);
			room.slowchat = false;
		} else if (targetInt) {
			if (!user.can('bypassall') && room.userCount < SLOWCHAT_USER_REQUIREMENT) return this.errorReply(`This room must have at least ${SLOWCHAT_USER_REQUIREMENT} users to set slowchat; it only has ${room.userCount} right now.`);
			if (room.slowchat === targetInt) return this.errorReply(`Slow chat is already set to ${room.slowchat} seconds in this room.`);
			if (targetInt < SLOWCHAT_MINIMUM) targetInt = SLOWCHAT_MINIMUM;
			if (targetInt > SLOWCHAT_MAXIMUM) targetInt = SLOWCHAT_MAXIMUM;
			room.slowchat = targetInt;
		} else {
			return this.parse("/help slowchat");
		}
		const slowchatSetting = (room.slowchat || "OFF");
		this.privateModAction(`(${user.name} set slowchat to ${slowchatSetting})`);
		this.modlog('SLOWCHAT', null, slowchatSetting);

		if (room.chatRoomData) {
			room.chatRoomData.slowchat = room.slowchat;
			Rooms.global.writeChatRoomData();
		}
	},
	slowchathelp: [
		`/slowchat [number] - Sets a limit on how often users in the room can send messages, between 2 and 60 seconds. Requires @ # & ~`,
		`/slowchat off - Disables slowchat in the room. Requires @ # & ~`,
	],

	stretching: 'stretchfilter',
	stretchingfilter: 'stretchfilter',
	stretchfilter(target, room, user) {
		if (!target) {
			const stretchSetting = (room.filterStretching ? "ON" : "OFF");
			return this.sendReply(`This room's stretch filter is currently: ${stretchSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('editroom', null, room)) return false;

		if (this.meansYes(target)) {
			if (room.filterStretching) return this.errorReply(`This room's stretch filter is already ON`);
			room.filterStretching = true;
		} else if (this.meansNo(target)) {
			if (!room.filterStretching) return this.errorReply(`This room's stretch filter is already OFF`);
			room.filterStretching = false;
		} else {
			return this.parse("/help stretchfilter");
		}
		const stretchSetting = (room.filterStretching ? "ON" : "OFF");
		this.privateModAction(`(${user.name} turned the stretch filter ${stretchSetting})`);
		this.modlog('STRETCH FILTER', null, stretchSetting);

		if (room.chatRoomData) {
			room.chatRoomData.filterStretching = room.filterStretching;
			Rooms.global.writeChatRoomData();
		}
	},
	stretchfilterhelp: [`/stretchfilter [on/off] - Toggles filtering messages in the room for stretchingggggggg. Requires # & ~`],

	capitals: 'capsfilter',
	capitalsfilter: 'capsfilter',
	capsfilter(target, room, user) {
		if (!target) {
			const capsSetting = (room.filterCaps ? "ON" : "OFF");
			return this.sendReply(`This room's caps filter is currently: ${capsSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('editroom', null, room)) return false;

		if (this.meansYes(target)) {
			if (room.filterCaps) return this.errorReply(`This room's caps filter is already ON`);
			room.filterCaps = true;
		} else if (this.meansNo(target)) {
			if (!room.filterCaps) return this.errorReply(`This room's caps filter is already OFF`);
			room.filterCaps = false;
		} else {
			return this.parse("/help capsfilter");
		}
		const capsSetting = (room.filterCaps ? "ON" : "OFF");
		this.privateModAction(`(${user.name} turned the caps filter ${capsSetting})`);
		this.modlog('CAPS FILTER', null, capsSetting);

		if (room.chatRoomData) {
			room.chatRoomData.filterCaps = room.filterCaps;
			Rooms.global.writeChatRoomData();
		}
	},
	capsfilterhelp: [`/capsfilter [on/off] - Toggles filtering messages in the room for EXCESSIVE CAPS. Requires # & ~`],

	emojis: 'emojifilter',
	emoji: 'emojifilter',
	emojifilter(target, room, user) {
		if (!target) {
			const emojiSetting = (room.filterEmojis ? "ON" : "OFF");
			return this.sendReply(`This room's emoji filter is currently: ${emojiSetting}`);
		}
		if (!this.canTalk()) return;
		if (!this.can('editroom', null, room)) return false;

		if (this.meansYes(target)) {
			if (room.filterEmojis) return this.errorReply(`This room's emoji filter is already ON`);
			room.filterEmojis = true;
		} else if (this.meansNo(target)) {
			if (!room.filterEmojis) return this.errorReply(`This room's emoji filter is already OFF`);
			room.filterEmojis = false;
		} else {
			return this.parse("/help emojifilter");
		}
		const emojiSetting = (room.filterEmojis ? "ON" : "OFF");
		this.privateModAction(`(${user.name} turned the emoji filter ${emojiSetting})`);
		this.modlog('EMOJI FILTER', null, emojiSetting);

		if (room.chatRoomData) {
			room.chatRoomData.filterEmojis = room.filterEmojis;
			Rooms.global.writeChatRoomData();
		}
	},
	emojifilterhelp: [`/emojifilter [on/off] - Toggles filtering messages in the room for emojis. Requires # & ~`],

	banwords: 'banword',
	banword: {
		add(target, room, user) {
			if (!target || target === ' ') return this.parse('/help banword');
			if (!this.can('declare', null, room)) return false;

			if (!room.banwords) room.banwords = [];

			// Most of the regex code is copied from the client. TODO: unify them?
			let words = target.match(/[^,]+(,\d*}[^,]*)?/g);
			if (!words) return this.parse('/help banword');

			words = words.map(word => word.replace(/\n/g, '').trim());

			let banwordRegexLen = (room.banwordRegex instanceof RegExp) ? room.banwordRegex.source.length : 30;
			for (let word of words) {
				if (/[\\^$*+?()|{}[\]]/.test(word)) {
					if (!user.can('makeroom')) return this.errorReply("Regex banwords are only allowed for leaders or above.");

					try {
						new RegExp(word); // eslint-disable-line no-new
					} catch (e) {
						return this.errorReply(e.message.startsWith('Invalid regular expression: ') ? e.message : `Invalid regular expression: /${word}/: ${e.message}`);
					}
				}
				if (room.banwords.includes(word)) return this.errorReply(`${word} is already a banned phrase.`);

				banwordRegexLen += (banwordRegexLen === 30) ? word.length : `|${word}`.length;
				// RegExp instances whose source is greater than or equal to
				// v8's RegExpMacroAssembler::kMaxRegister in length will crash
				// the server on compile. In this case, that would happen each
				// time a chat message gets tested for any banned phrases.
				if (banwordRegexLen >= (1 << 16 - 1)) return this.errorReply("This room has too many banned phrases to add the ones given.");
			}

			room.banwords = room.banwords.concat(words);
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModAction(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were added by ${user.name}.)`);
				this.modlog('BANWORD', null, words.map(w => `'${w}'`).join(', '));
				this.sendReply(`Banned phrases succesfully added.`);
			} else {
				this.privateModAction(`(The banword '${words[0]}' was added by ${user.name}.)`);
				this.modlog('BANWORD', null, words[0]);
				this.sendReply(`Banned phrase succesfully added.`);
			}
			this.sendReply(`The list is currently: ${room.banwords.join(', ')}`);

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		delete(target, room, user) {
			if (!target) return this.parse('/help banword');
			if (!this.can('declare', null, room)) return false;

			if (!room.banwords) return this.errorReply("This room has no banned phrases.");

			let words = target.match(/[^,]+(,\d*}[^,]*)?/g);
			if (!words) return this.parse('/help banword');

			words = words.map(word => word.replace(/\n/g, '').trim());

			for (let word of words) {
				if (!room.banwords.includes(word)) return this.errorReply(`${word} is not a banned phrase in this room.`);
			}

			room.banwords = room.banwords.filter(w => !words.includes(w));
			if (!room.banwords.length) room.banwords = null;
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModAction(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were removed by ${user.name}.)`);
				this.modlog('UNBANWORD', null, words.map(w => `'${w}'`).join(', '));
				this.sendReply(`Banned phrases succesfully deleted.`);
			} else {
				this.privateModAction(`(The banword '${words[0]}' was removed by ${user.name}.)`);
				this.modlog('UNBANWORD', null, words[0]);
				this.sendReply(`Banned phrase succesfully deleted.`);
			}
			this.sendReply(room.banwords ? `The list is currently: ${room.banwords.join(', ')}` : `The list is now empty.`);

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				if (!room.banwords) delete room.chatRoomData.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		list(target, room, user) {
			if (!this.can('mute', null, room)) return false;

			if (!room.banwords) return this.sendReply("This room has no banned phrases.");

			return this.sendReply(`Banned phrases in room ${room.id}: ${room.banwords.join(', ')}`);
		},

		""(target, room, user) {
			return this.parse("/help banword");
		},
	},
	banwordhelp: [
		`/banword add [words] - Adds the comma-separated list of phrases (& or ~ can also input regex) to the banword list of the current room. Requires: # & ~`,
		`/banword delete [words] - Removes the comma-separated list of phrases from the banword list. Requires: # & ~`,
		`/banword list - Shows the list of banned words in the current room. Requires: % @ # & ~`,
	],

	hightraffic(target, room, user) {
		if (!target) return this.sendReply(`This room is${!room.highTraffic ? ' not' : ''} currently marked as high traffic.`);
		if (!this.can('makeroom')) return false;

		if (this.meansYes(target)) {
			room.highTraffic = true;
		} else if (this.meansNo(target)) {
			room.highTraffic = false;
		} else {
			return this.parse('/help hightraffic');
		}

		if (room.chatRoomData) {
			room.chatRoomData.highTraffic = room.highTraffic;
			Rooms.global.writeChatRoomData();
		}
		this.modlog(`HIGHTRAFFIC`, null, room.highTraffic);
		this.addModAction(`This room was marked as high traffic by ${user.name}.`);
	},
	hightraffichelp: [
		`/hightraffic [true|false] - (Un)marks a room as a high traffic room. Requires & ~`,
		`When a room is marked as high-traffic, PS requires all messages sent to that room to contain at least 2 letters.`,
	],
};
