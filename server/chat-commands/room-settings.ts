/**
 * Room settings commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for settings relating to room setting filtering.
 *
 * @license MIT
 */

'use strict';

const RANKS: string[] = Config.groupsranking;

const SLOWCHAT_MINIMUM = 2;
const SLOWCHAT_MAXIMUM = 60;
const SLOWCHAT_USER_REQUIREMENT = 10;

const MAX_CHATROOM_ID_LENGTH = 225;

export const commands: ChatCommands = {
	roomsetting: 'roomsettings',
	roomsettings(target, room, user, connection) {
		if (room.battle) return this.errorReply("This command cannot be used in battle rooms.");
		let uhtml = 'uhtml';

		if (!target) {
			room.update();
		} else {
			this.parse(`/${target}`);
			uhtml = 'uhtmlchange';
		}

		let output = Chat.html`<div class="infobox">Room Settings for ${room.title}<br />`;
		for (const handler of Chat.roomSettings) {
			const setting = handler(room, user, connection);
			if (typeof setting.permission === 'string') setting.permission = user.can(setting.permission, null, room);

			output += `<strong>${setting.label}:</strong> <br />`;

			for (const option of setting.options) {
				// disabled button
				if (option[1] === true) {
					output += Chat.html`<button class="button disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;">${option[0]}</button> `;
				} else {
					// only show proper buttons if we have the permissions to use them
					if (!setting.permission) continue;

					output += Chat.html`<button class="button" name="send" value="/roomsetting ${option[1]}">${option[0]}</button> `;
				}
			}
			output += `<br />`;
		}
		output += '</div>';
		user.sendTo(room, `|${uhtml}|roomsettings|${output}`);
	},
	roomsettingshelp: [`/roomsettings - Shows current room settings with buttons to change them (if you can).`],

	modchat(target, room, user) {
		if (!target) {
			const modchatSetting = (room.modchat || "OFF");
			return this.sendReply(`Moderated chat is currently set to: ${modchatSetting}`);
		}
		if (!this.can('modchat', null, room)) return false;

		// 'modchat' lets you set up to 1 (ac/trusted also allowed)
		// 'modchatall' lets you set up to your current rank
		// 'makeroom' lets you set any rank, no limit
		const threshold = user.can('makeroom') ? Infinity :
			user.can('modchatall', null, room) ? Config.groupsranking.indexOf(room.getAuth(user)) :
			1;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > threshold) {
			return this.errorReply(`/modchat - Access denied for changing a setting higher than ${Config.groupsranking[threshold]}.`);
		}
		if (!!(room as GameRoom).requestModchat) {
			const error = (room as GameRoom).requestModchat(user);
			if (error) return this.errorReply(error);
		}

		target = target.toLowerCase().trim();
		const currentModchat = room.modchat;
		switch (target) {
		case 'off':
		case 'false':
		case 'no':
		case 'disable':
			room.modchat = null;
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
			if (Config.groupsranking.indexOf(target) > threshold) {
				return this.errorReply(`/modchat - Access denied for setting higher than ${Config.groupsranking[threshold]}.`);
			}
			room.modchat = target;
			break;
		}
		if (currentModchat === room.modchat) {
			return this.errorReply(`Modchat is already set to ${currentModchat || 'off'}.`);
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><strong>Moderated chat was disabled!</strong><br />Anyone may talk now.</div>");
		} else {
			const modchatSetting = Chat.escapeHTML(room.modchat);
			this.add(`|raw|<div class="broadcast-red"><strong>Moderated chat was set to ${modchatSetting}!</strong><br />Only users of rank ${modchatSetting} and higher can talk.</div>`);
		}
		if ((room as GameRoom).requestModchat && !room.modchat) (room as GameRoom).requestModchat(null);
		this.privateModAction(`(${user.name} set modchat to ${room.modchat || "off"})`);
		this.modlog('MODCHAT', null, `to ${room.modchat || "false"}`);

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},
	modchathelp: [`/modchat [off/autoconfirmed/trusted/+/%/@/*/player/#/&/~] - Set the level of moderated chat. Requires: % \u2606 for off/autoconfirmed/+ options, * @ # & ~ for all the options`],

	ioo(target, room, user) {
		return this.parse('/modjoin %');
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
			if (user.forcedPublic) return this.errorReply(`Your next battle will be invite-only provided it is not rated, otherwise your '${user.forcedPublic}' prefix will force the battle to be public.`);
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
			return this.parse("/modjoin %");
		} else {
			return this.parse(`/modjoin ${target}`);
		}
	},
	inviteonlyhelp: [
		`/inviteonly [on|off] - Sets modjoin %. Users can't join unless invited with /invite. Requires: # & ~`,
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
			const prefix = room.battle.forcedPublic();
			if (prefix && !user.can('editprivacy')) return this.errorReply(`This battle is required to be public due to a player having a name prefixed by '${prefix}'.`);
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
			if (room.battle && !user.can('makeroom') && !'+%'.includes(target)) {
				return this.errorReply(`/modjoin - Access denied from setting modjoin past % in battles.`);
			}
			if (room.isPersonal && !user.can('makeroom') && !'+%'.includes(target)) {
				return this.errorReply(`/modjoin - Access denied from setting modjoin past % in group chats.`);
			}
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
		if (!target) {
			return this.sendReply(`This room's primary language is ${Chat.languages.get(room.language || '') || 'English'}`);
		}
		if (!this.can('editroom', null, room)) return false;

		const targetLanguage = toID(target);
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
		this.modlog('SLOWCHAT', null, '' + slowchatSetting);

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
		regexadd: 'add',
		addregex: 'add',
		add(target, room, user, connection, cmd) {
			if (!target || target === ' ') return this.parse('/help banword');
			if (!this.can('declare', null, room)) return false;

			const regex = cmd.includes('regex');
			if (regex && !user.can('makeroom')) return this.errorReply("Regex banwords are only allowed for leaders or above.");

			// Most of the regex code is copied from the client. TODO: unify them?
			// Regex banwords can have commas in the {1,5} pattern
			let words = (regex ? target.match(/[^,]+(,\d*}[^,]*)?/g)! : target.split(','))
				.map(word => word.replace(/\n/g, '').trim());
			if (!words) return this.parse('/help banword');

			// Escape any character with a special meaning in regex
			if (!regex) {
				words = words.map(word => {
					if (/[\\^$*+?()|{}[\]]/.test(word)) this.errorReply(`"${word}" might be a regular expression, did you mean "/banword addregex"?`);
					return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				});
			}
			// PS adds a preamble to the banword regex that's 32 chars long
			let banwordRegexLen = (room.banwordRegex instanceof RegExp) ? room.banwordRegex.source.length : 32;
			for (const word of words) {
				try {
					// tslint:disable-next-line: no-unused-expression
					new RegExp(word);
				} catch (e) {
					return this.errorReply(e.message.startsWith('Invalid regular expression: ') ? e.message : `Invalid regular expression: /${word}/: ${e.message}`);
				}
				if (room.banwords.includes(word)) return this.errorReply(`${word} is already a banned phrase.`);

				// Banword strings are joined, so account for the first string not having the prefix
				banwordRegexLen += (banwordRegexLen === 32) ? word.length : `|${word}`.length;
				// RegExp instances whose source is greater than or equal to
				// v8's RegExpMacroAssembler::kMaxRegister in length will crash
				// the server on compile. In this case, that would happen each
				// time a chat message gets tested for any banned phrases.
				if (banwordRegexLen >= (1 << 16 - 1)) return this.errorReply("This room has too many banned phrases to add the ones given.");
			}

			for (const word of words) {
				room.banwords.push(word);
			}
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModAction(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were added by ${user.name}.)`);
				this.modlog('BANWORD', null, words.map(w => `'${w}'`).join(', '));
				this.sendReply(`Banned phrases successfully added.`);
			} else {
				this.privateModAction(`(The banword '${words[0]}' was added by ${user.name}.)`);
				this.modlog('BANWORD', null, words[0]);
				this.sendReply(`Banned phrase successfully added.`);
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

			if (!room.banwords.length) return this.errorReply("This room has no banned phrases.");

			let words = target.match(/[^,]+(,\d*}[^,]*)?/g);
			if (!words) return this.parse('/help banword');

			words = words.map(word => word.replace(/\n/g, '').trim());

			for (const word of words) {
				if (!room.banwords.includes(word)) return this.errorReply(`${word} is not a banned phrase in this room.`);
			}

			// ts bug? `words` guaranteed non-null by above falsey check
			room.banwords = room.banwords.filter(w => !words!.includes(w));
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModAction(`(The banwords ${words.map(w => `'${w}'`).join(', ')} were removed by ${user.name}.)`);
				this.modlog('UNBANWORD', null, words.map(w => `'${w}'`).join(', '));
				this.sendReply(`Banned phrases successfully deleted.`);
			} else {
				this.privateModAction(`(The banword '${words[0]}' was removed by ${user.name}.)`);
				this.modlog('UNBANWORD', null, words[0]);
				this.sendReply(`Banned phrase successfully deleted.`);
			}
			this.sendReply(room.banwords && room.banwords.length ? `The list is currently: ${room.banwords.join(', ')}` : `The list is now empty.`);

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				if (!room.banwords) delete room.chatRoomData.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		list(target, room, user) {
			if (!this.can('mute', null, room)) return false;

			if (!room.banwords || !room.banwords.length) return this.sendReply("This room has no banned phrases.");

			return this.sendReply(`Banned phrases in room ${room.roomid}: ${room.banwords.join(', ')}`);
		},

		""(target, room, user) {
			return this.parse("/help banword");
		},
	},
	banwordhelp: [
		`/banword add [words] - Adds the comma-separated list of phrases to the banword list of the current room. Requires: # & ~`,
		`/banword addregex [words] - Adds the comma-separated list of regular expressions to the banword list of the current room. Requires & ~`,
		`/banword delete [words] - Removes the comma-separated list of phrases from the banword list. Requires: # & ~`,
		`/banword list - Shows the list of banned words in the current room. Requires: % @ # & ~`,
	],

	hightraffic(target, room, user) {
		if (!target) {
			return this.sendReply(`This room is${!room.highTraffic ? ' not' : ''} currently marked as high traffic.`);
		}
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
		this.modlog(`HIGHTRAFFIC`, null, '' + room.highTraffic);
		this.addModAction(`This room was marked as high traffic by ${user.name}.`);
	},
	hightraffichelp: [
		`/hightraffic [true|false] - (Un)marks a room as a high traffic room. Requires & ~`,
		`When a room is marked as high-traffic, PS requires all messages sent to that room to contain at least 2 letters.`,
	],

	/*********************************************************
	 * Room management
	 *********************************************************/

	makeprivatechatroom: 'makechatroom',
	makechatroom(target, room, user, connection, cmd) {
		if (!this.can('makeroom')) return;

		// `,` is a delimiter used by a lot of /commands
		// `|` and `[` are delimiters used by the protocol
		// `-` has special meaning in roomids
		if (target.includes(',') || target.includes('|') || target.includes('[') || target.includes('-')) {
			return this.errorReply("Room titles can't contain any of: ,|[-");
		}

		const id = toID(target);
		if (!id) return this.parse('/help makechatroom');
		if (id.length > MAX_CHATROOM_ID_LENGTH) return this.errorReply("The given room title is too long.");
		// Check if the name already exists as a room or alias
		if (Rooms.search(id)) return this.errorReply(`The room '${target}' already exists.`);
		if (!Rooms.global.addChatRoom(target)) return this.errorReply(`An error occurred while trying to create the room '${target}'.`);

		const targetRoom = Rooms.search(target);
		if (!targetRoom) throw new Error(`Error in room creation.`);
		if (cmd === 'makeprivatechatroom') {
			targetRoom.isPrivate = true;
			if (!targetRoom.chatRoomData) throw new Error(`Private chat room created without chatRoomData.`);
			targetRoom.chatRoomData.isPrivate = true;
			Rooms.global.writeChatRoomData();
			const upperStaffRoom = Rooms.get('upperstaff');
			if (upperStaffRoom) {
				upperStaffRoom.add(`|raw|<div class="broadcast-green">Private chat room created: <b>${Chat.escapeHTML(target)}</b></div>`).update();
			}
			this.sendReply(`The private chat room '${target}' was created.`);
		} else {
			const staffRoom = Rooms.get('staff');
			if (staffRoom) {
				staffRoom.add(`|raw|<div class="broadcast-green">Public chat room created: <b>${Chat.escapeHTML(target)}</b></div>`).update();
			}
			const upperStaffRoom = Rooms.get('upperstaff');
			if (upperStaffRoom) {
				upperStaffRoom.add(`|raw|<div class="broadcast-green">Public chat room created: <b>${Chat.escapeHTML(target)}</b></div>`).update();
			}
			this.sendReply(`The chat room '${target}' was created.`);
		}
	},
	makechatroomhelp: [`/makechatroom [roomname] - Creates a new room named [roomname]. Requires: & ~`],

	subroomgroupchat: 'makegroupchat',
	makegroupchat(target, room, user, connection, cmd) {
		if (!this.canTalk()) return;
		if (!user.autoconfirmed) {
			return this.errorReply("You must be autoconfirmed to make a groupchat.");
		}
		if (cmd === 'subroomgroupchat') {
			if (!user.can('mute', null, room)) return this.errorReply("You can only create subroom groupchats for rooms you're staff in.");
			if (room.battle) return this.errorReply("You cannot create a subroom of a battle.");
			if (room.isPersonal) return this.errorReply("You cannot create a subroom of a groupchat.");
		}
		const parent = cmd === 'subroomgroupchat' ? room.roomid : null;
		// if (!this.can('makegroupchat')) return false;

		// Title defaults to a random 8-digit number.
		let title = target.trim();
		if (title.length >= 32) {
			return this.errorReply("Title must be under 32 characters long.");
		} else if (!title) {
			title = (`${Math.floor(Math.random() * 100000000)}`);
		} else if (Config.chatfilter) {
			const filterResult = Config.chatfilter.call(this, title, user, null, connection);
			if (!filterResult) return;
			if (title !== filterResult) {
				return this.errorReply("Invalid title.");
			}
		}
		// `,` is a delimiter used by a lot of /commands
		// `|` and `[` are delimiters used by the protocol
		// `-` has special meaning in roomids
		if (title.includes(',') || title.includes('|') || title.includes('[') || title.includes('-')) {
			return this.errorReply("Room titles can't contain any of: ,|[-");
		}

		// Even though they're different namespaces, to cut down on confusion, you
		// can't share names with registered chatrooms.
		const existingRoom = Rooms.search(toID(title));
		if (existingRoom && !existingRoom.modjoin) return this.errorReply(`The room '${title}' already exists.`);
		// Room IDs for groupchats are groupchat-TITLEID
		let titleid = toID(title);
		if (!titleid) {
			titleid = `${Math.floor(Math.random() * 100000000)}` as ID;
		}
		const roomid = `groupchat-${parent || user.id}-${titleid}` as RoomID;
		// Titles must be unique.
		if (Rooms.search(roomid)) return this.errorReply(`A group chat named '${title}' already exists.`);
		// Tab title is prefixed with '[G]' to distinguish groupchats from
		// registered chatrooms

		if (Monitor.countGroupChat(connection.ip)) {
			this.errorReply("Due to high load, you are limited to creating 4 group chats every hour.");
			return;
		}

		const titleMsg = Chat.html `Welcome to ${parent ? room.title : user.name}'s${!/^[0-9]+$/.test(title) ? ` ${title}` : ''}${parent ? ' subroom' : ''} groupchat!`;
		const targetRoom = Rooms.createChatRoom(roomid, `[G] ${title}`, {
			isPersonal: true,
			isPrivate: 'hidden',
			creationTime: parent ? null : Date.now(),
			modjoin: parent ? null : '+',
			parentid: parent,
			auth: {},
			introMessage: `<div style="text-align: center"><table style="margin:auto;"><tr><td><img src="//${Config.routes.client}/fx/groupchat.png" width=120 height=100></td><td><h2>${titleMsg}</h2><p>Follow the <a href="/rules">Pokémon Showdown Global Rules</a>!<br>Don't be disruptive to the rest of the site.</p></td></tr></table></div>`,
			staffMessage: `<p>Groupchats are temporary rooms, and will expire if there hasn't been any activity in 40 minutes.</p><p>You can invite new users using <code>/invite</code>. Be careful with who you invite!</p><p>Commands: <button class="button" name="send" value="/roomhelp">Room Management</button> | <button class="button" name="send" value="/roomsettings">Room Settings</button> | <button class="button" name="send" value="/tournaments help">Tournaments</button></p><p>As creator of this groupchat, <u>you are entirely responsible for what occurs in this chatroom</u>. Global rules apply at all times.</p><p>If this room is used to break global rules or disrupt other areas of the server, <strong>you as the creator will be held accountable and punished</strong>.</p>`,
		});
		if (targetRoom) {
			// The creator is a Room Owner in subroom groupchats and a Host otherwise..
			targetRoom.auth![user.id] = parent ? '#' : Users.HOST_SYMBOL;
			// Join after creating room. No other response is given.
			user.joinRoom(targetRoom.roomid);
			user.popup(`You've just made a groupchat; it is now your responsibility, regardless of whether or not you actively partake in the room. For more info, read your groupchat's staff intro.`);
			if (parent) this.modlog('SUBROOMGROUPCHAT', null, title);
			return;
		}
		return this.errorReply(`An unknown error occurred while trying to create the room '${title}'.`);
	},
	makegroupchathelp: [
		`/makegroupchat [roomname] - Creates an invite-only group chat named [roomname].`,
		`/subroomgroupchat [roomname] - Creates a subroom groupchat of the current room. Can only be used in a public room you have staff in.`,
	],

	'!groupchatuptime': true,
	groupchatuptime(target, room, user) {
		if (!room || !room.creationTime) return this.errorReply("Can only be used in a groupchat.");
		if (!this.runBroadcast()) return;
		const uptime = Chat.toDurationString(Date.now() - room.creationTime);
		this.sendReplyBox(`Groupchat uptime: <b>${uptime}</b>`);
	},
	groupchatuptimehelp: [`/groupchatuptime - Displays the uptime if the current room is a groupchat.`],

	deregisterchatroom(target, room, user) {
		if (!this.can('makeroom')) return;
		this.errorReply("NOTE: You probably want to use `/deleteroom` now that it exists.");
		const id = toID(target);
		if (!id) return this.parse('/help deregisterchatroom');
		const targetRoom = Rooms.search(id);
		if (!targetRoom) return this.errorReply(`The room '${target}' doesn't exist.`);
		target = targetRoom.title || targetRoom.roomid;
		const isPrivate = targetRoom.isPrivate;
		const staffRoom = Rooms.get('staff');
		const upperStaffRoom = Rooms.get('upperstaff');
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply(`The room '${target}' was deregistered.`);
			this.sendReply("It will be deleted as of the next server restart.");
			target = Chat.escapeHTML(target);
			if (isPrivate) {
				if (upperStaffRoom) upperStaffRoom.add(`|raw|<div class="broadcast-red">Private chat room deregistered by ${user.id}: <b>${target}</b></div>`).update();
			} else {
				if (staffRoom) {
					staffRoom.add(`|raw|<div class="broadcast-red">Public chat room deregistered: <b>${target}</b></div>`).update();
				}
				if (upperStaffRoom) {
					upperStaffRoom.add(`|raw|<div class="broadcast-red">Public chat room deregistered by ${user.id}: <b>${target}</b></div>`).update();
				}
			}
			return;
		}
		return this.errorReply(`The room "${target}" isn't registered.`);
	},
	deregisterchatroomhelp: [`/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: & ~`],

	deletechatroom: 'deleteroom',
	deletegroupchat: 'deleteroom',
	deleteroom(target, room, user, connection, cmd) {
		const roomid = target.trim();
		if (!roomid) {
			// allow deleting personal rooms without typing out the room name
			if (!room.isPersonal || cmd !== "deletegroupchat") {
				return this.parse(`/help deleteroom`);
			}
		} else {
			const targetRoom = Rooms.search(roomid);
			if (targetRoom !== room) {
				return this.parse(`/help deleteroom`);
			}
		}

		if (room.isPersonal) {
			if (!this.can('gamemanagement', null, room)) return;
		} else {
			if (!this.can('makeroom')) return;
		}

		const title = room.title || room.roomid;

		if (room.roomid === 'global') {
			return this.errorReply(`This room can't be deleted.`);
		}

		if (room.chatRoomData) {
			if (room.isPrivate) {
				const upperStaffRoom = Rooms.get('upperstaff');
				if (upperStaffRoom) {
					upperStaffRoom.add(Chat.html`|raw|<div class="broadcast-red">Private chat room deleted by ${user.id}: <b>${title}</b></div>`).update();
				}
			} else {
				const staffRoom = Rooms.get('staff');
				if (staffRoom) {
					staffRoom.add(Chat.html`|raw|<div class="broadcast-red">Public chat room deleted: <b>${title}</b></div>`).update();
				}
				const upperStaffRoom = Rooms.get('upperstaff');
				if (upperStaffRoom) {
					upperStaffRoom.add(Chat.html`|raw|<div class="broadcast-red">Public chat room deleted by ${user.id}: <b>${title}</b></div>`).update();
				}
			}
		}

		if (room.subRooms) {
			for (const subRoom of room.subRooms.values()) subRoom.parent = null;
		}

		room.add(`|raw|<div class="broadcast-red"><b>This room has been deleted.</b></div>`);
		room.update(); // |expire| needs to be its own message
		room.add(`|expire|This room has been deleted.`);
		this.sendReply(`The room "${title}" was deleted.`);
		room.update();
		room.destroy();
	},
	deleteroomhelp: [
		`/deleteroom [roomname] - Deletes room [roomname]. Must be typed in the room to delete. Requires: & ~`,
		`/deletegroupchat - Deletes the current room, if it's a groupchat. Requires: ★ # & ~`,
	],

	hideroom: 'privateroom',
	hiddenroom: 'privateroom',
	secretroom: 'privateroom',
	publicroom: 'privateroom',
	privateroom(target, room, user, connection, cmd) {
		if (room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else if (room.battle) {
			if (!this.can('editprivacy', null, room)) return;
			const prefix = room.battle.forcedPublic();
			if (prefix && !user.can('editprivacy')) return this.errorReply(`This battle is required to be public due to a player having a name prefixed by '${prefix}'.`);
		} else {
			// registered chatrooms show up on the room list and so require
			// higher permissions to modify privacy settings
			if (!this.can('makeroom')) return;
		}
		let setting: boolean | 'hidden';
		switch (cmd) {
		case 'privateroom':
			return this.parse('/help privateroom');
		case 'publicroom':
			setting = false;
			break;
		case 'secretroom':
			setting = true;
			break;
		default:
			if (room.isPrivate === true && target !== 'force') {
				return this.sendReply(`This room is a secret room. Use "/publicroom" to make it public, or "/hiddenroom force" to force it hidden.`);
			}
			setting = 'hidden';
			break;
		}

		if ((setting === true || room.isPrivate === true) && !room.isPersonal) {
			if (!this.can('makeroom')) return;
		}

		if (this.meansNo(target) || !setting) {
			if (!room.isPrivate) {
				return this.errorReply(`This room is already public.`);
			}
			if (room.parent && room.parent.isPrivate) {
				return this.errorReply(`This room's parent ${room.parent.title} must be public for this room to be public.`);
			}
			if (room.isPersonal) return this.errorReply(`This room can't be made public.`);
			if (room.privacySetter && user.can('nooverride', null, room) && !user.can('makeroom')) {
				if (!room.privacySetter.has(user.id)) {
					const privacySetters = [...room.privacySetter].join(', ');
					return this.errorReply(`You can't make the room public since you didn't make it private - only ${privacySetters} can.`);
				}
				room.privacySetter.delete(user.id);
				if (room.privacySetter.size) {
					const privacySetters = [...room.privacySetter].join(', ');
					return this.sendReply(`You are no longer forcing the room to stay private, but ${privacySetters} also need${Chat.plural(room.privacySetter, "", "s")} to use /publicroom to make the room public.`);
				}
			}
			delete room.isPrivate;
			room.privacySetter = null;
			this.addModAction(`${user.name} made this room public.`);
			this.modlog('PUBLICROOM');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			const settingName = (setting === true ? 'secret' : setting);
			if (room.subRooms) {
				if (settingName === 'secret') return this.errorReply("Secret rooms cannot have subrooms.");
				for (const subRoom of room.subRooms.values()) {
					if (!subRoom.isPrivate) return this.errorReply(`Subroom ${subRoom.title} must be private to make this room private.`);
				}
			}
			if (room.isPrivate === setting) {
				if (room.privacySetter && !room.privacySetter.has(user.id)) {
					room.privacySetter.add(user.id);
					return this.sendReply(`This room is already ${settingName}, but is now forced to stay that way until you use /publicroom.`);
				}
				return this.errorReply(`This room is already ${settingName}.`);
			}
			room.isPrivate = setting;
			this.addModAction(`${user.name} made this room ${settingName}.`);
			this.modlog(`${settingName.toUpperCase()}ROOM`);
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = setting;
				Rooms.global.writeChatRoomData();
			}
			room.privacySetter = new Set([user.id]);
		}
	},
	privateroomhelp: [
		`/secretroom - Makes a room secret. Secret rooms are visible to & and up. Requires: & ~`,
		`/hiddenroom [on/off] - Makes a room hidden. Hidden rooms are visible to % and up, and inherit global ranks. Requires: \u2606 & ~`,
		`/publicroom - Makes a room public. Requires: \u2606 & ~`,
	],

	officialchatroom: 'officialroom',
	officialroom(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.errorReply(`/officialroom - This room can't be made official`);
		}
		if (this.meansNo(target)) {
			if (!room.isOfficial) return this.errorReply(`This chat room is already unofficial.`);
			delete room.isOfficial;
			this.addModAction(`${user.name} made this chat room unofficial.`);
			this.modlog('UNOFFICIALROOM');
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			if (room.isOfficial) return this.errorReply(`This chat room is already official.`);
			room.isOfficial = true;
			this.addModAction(`${user.name} made this chat room official.`);
			this.modlog('OFFICIALROOM');
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	psplwinnerroom(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.errorReply(`/psplwinnerroom - This room can't be marked as a PSPL Winner room`);
		}
		if (this.meansNo(target)) {
			// @ts-ignore
			if (!room.pspl) return this.errorReply(`This chat room is already not a PSPL Winner room.`);
			// @ts-ignore
			delete room.pspl;
			this.addModAction(`${user.name} made this chat room no longer a PSPL Winner room.`);
			this.modlog('PSPLROOM');
			delete room.chatRoomData.pspl;
			Rooms.global.writeChatRoomData();
		} else {
			// @ts-ignore
			if (room.pspl) return this.errorReply("This chat room is already a PSPL Winner room.");
			// @ts-ignore
			room.pspl = true;
			this.addModAction(`${user.name} made this chat room a PSPL Winner room.`);
			this.modlog('UNPSPLROOM');
			room.chatRoomData.pspl = true;
			Rooms.global.writeChatRoomData();
		}
	},

	setsubroom: 'subroom',
	subroom(target, room, user) {
		if (!user.can('makeroom')) return this.errorReply(`/subroom - Access denied. Did you mean /subrooms?`);
		if (!target) return this.parse('/help subroom');

		if (!room.chatRoomData) return this.errorReply(`Temporary rooms cannot be subrooms.`);
		if (room.parent) return this.errorReply(`This room is already a subroom. To change which room this subroom belongs to, remove the subroom first.`);
		if (room.subRooms) return this.errorReply(`This room is already a parent room, and a parent room cannot be made as a subroom.`);

		const main = Rooms.search(target);

		if (!main) return this.errorReply(`The room '${target}' does not exist.`);
		if (main.parent) return this.errorReply(`Subrooms cannot have subrooms.`);
		if (main.isPrivate === true) return this.errorReply(`Only public and hidden rooms can have subrooms.`);
		if (main.isPrivate && !room.isPrivate) return this.errorReply(`Private rooms cannot have public subrooms.`);
		if (!main.chatRoomData) return this.errorReply(`Temporary rooms cannot be parent rooms.`);
		if (room === main) return this.errorReply(`You cannot set a room to be a subroom of itself.`);

		room.parent = main;
		if (!main.subRooms) main.subRooms = new Map();
		main.subRooms.set(room.roomid, room as ChatRoom);

		const mainIdx = Rooms.global.chatRoomDataList.findIndex(r => r.title === main.title);
		const subIdx = Rooms.global.chatRoomDataList.findIndex(r => r.title === room.title);

		// This is needed to ensure that the main room gets loaded before the subroom.
		if (mainIdx > subIdx) {
			const tmp = Rooms.global.chatRoomDataList[mainIdx];
			Rooms.global.chatRoomDataList[mainIdx] = Rooms.global.chatRoomDataList[subIdx];
			Rooms.global.chatRoomDataList[subIdx] = tmp;
		}

		room.chatRoomData.parentid = main.roomid;
		Rooms.global.writeChatRoomData();

		for (const userid in room.users) {
			room.users[userid].updateIdentity(room.roomid);
		}

		this.modlog('SUBROOM', null, `of ${main.title}`);
		return this.addModAction(`This room was set as a subroom of ${main.title} by ${user.name}.`);
	},

	removesubroom: 'unsubroom',
	desubroom: 'unsubroom',
	unsubroom(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.parent || !room.chatRoomData) return this.errorReply(`This room is not currently a subroom of a public room.`);

		const parent = room.parent;
		if (parent && parent.subRooms) {
			parent.subRooms.delete(room.roomid);
			if (!parent.subRooms.size) parent.subRooms = null;
		}

		room.parent = null;

		delete room.chatRoomData.parentid;
		Rooms.global.writeChatRoomData();

		for (const userid in room.users) {
			room.users[userid].updateIdentity(room.roomid);
		}

		this.modlog('UNSUBROOM');
		return this.addModAction(`This room was unset as a subroom by ${user.name}.`);
	},

	parentroom: 'subrooms',
	subrooms(target, room, user, connection, cmd) {
		if (cmd === 'parentroom') {
			if (!room.parent) return this.errorReply(`This room is not a subroom.`);
			return this.sendReply(`This is a subroom of ${room.parent.title}.`);
		}
		if (!room.chatRoomData) return this.errorReply(`Temporary rooms cannot have subrooms.`);

		if (!this.runBroadcast()) return;

		const showSecret = !this.broadcasting && user.can('mute', null, room);

		const subRooms = room.getSubRooms(showSecret);

		if (!subRooms.length) return this.sendReply(`This room doesn't have any subrooms.`);

		const subRoomText = subRooms.map(subRoom => Chat.html`<a href="/${subRoom.roomid}">${subRoom.title}</a><br/><small>${subRoom.desc}</small>`);

		return this.sendReplyBox(`<p style="font-weight:bold;">${Chat.escapeHTML(room.title)}'s subroom${Chat.plural(subRooms)}:</p><ul><li>${subRoomText.join('</li><br/><li>')}</li></ul></strong>`);
	},

	subroomhelp: [
		`/subroom [room] - Marks the current room as a subroom of [room]. Requires: & ~`,
		`/unsubroom - Unmarks the current room as a subroom. Requires: & ~`,
		`/subrooms - Displays the current room's subrooms.`,
		`/parentroom - Displays the current room's parent room.`,
	],

	roomdesc(target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.desc) return this.sendReply(`This room does not have a description set.`);
			this.sendReplyBox(Chat.html`The room description is: ${room.desc}`);
			return;
		}
		if (!this.can('declare')) return false;
		if (target.length > 80) {
			return this.errorReply(`Error: Room description is too long (must be at most 80 characters).`);
		}
		const normalizedTarget = ' ' + target.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' ';

		if (normalizedTarget.includes(' welcome ')) {
			return this.errorReply(`Error: Room description must not contain the word "welcome".`);
		}
		if (normalizedTarget.slice(0, 9) === ' discuss ') {
			return this.errorReply(`Error: Room description must not start with the word "discuss".`);
		}
		if (normalizedTarget.slice(0, 12) === ' talk about ' || normalizedTarget.slice(0, 17) === ' talk here about ') {
			return this.errorReply(`Error: Room description must not start with the phrase "talk about".`);
		}

		room.desc = target;
		this.sendReply(`(The room description is now: ${target})`);

		this.privateModAction(`(${user.name} changed the roomdesc to: "${target}".)`);
		this.modlog('ROOMDESC', null, `to "${target}"`);

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	topic: 'roomintro',
	roomintro(target, room, user, connection, cmd) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.introMessage) return this.sendReply("This room does not have an introduction set.");
			this.sendReply('|raw|<div class="infobox infobox-limited">' + room.introMessage.replace(/\n/g, '') + '</div>');
			if (!this.broadcasting && user.can('declare', null, room) && cmd !== 'topic') {
				this.sendReply('Source:');
				const code = Chat.escapeHTML(room.introMessage).replace(/\n/g, '<br />');
				this.sendReplyBox(`<code style="white-space: pre-wrap">/roomintro ${code}</code>`);
			}
			return;
		}
		if (!this.can('editroom', null, room)) return false;
		if (this.meansNo(target) || target === 'delete') return this.errorReply('Did you mean "/deleteroomintro"?');
		target = this.canHTML(target)!;
		if (!target) return; // canHTML sends its own errors
		if (!/</.test(target)) {
			// not HTML, do some simple URL linking
			const re = /(https?:\/\/(([\w.-]+)+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?))/g;
			target = target.replace(re, '<a href="$1">$1</a>');
		}
		if (target.substr(0, 11) === '/roomintro ') target = target.substr(11);

		room.introMessage = target.replace(/\r/g, '');
		this.sendReply("(The room introduction has been changed to:)");
		this.sendReply(`|raw|<div class="infobox infobox-limited">${room.introMessage.replace(/\n/g, '')}</div>`);

		this.privateModAction(`(${user.name} changed the roomintro.)`);
		this.modlog('ROOMINTRO');
		this.roomlog(room.introMessage.replace(/\n/g, ''));

		if (room.chatRoomData) {
			room.chatRoomData.introMessage = room.introMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	deletetopic: 'deleteroomintro',
	deleteroomintro(target, room, user) {
		if (!this.can('declare', null, room)) return false;
		if (!room.introMessage) return this.errorReply("This room does not have a introduction set.");

		this.privateModAction(`(${user.name} deleted the roomintro.)`);
		this.modlog('DELETEROOMINTRO');
		this.roomlog(target);

		delete room.introMessage;
		if (room.chatRoomData) {
			delete room.chatRoomData.introMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	stafftopic: 'staffintro',
	staffintro(target, room, user, connection, cmd) {
		if (!target) {
			if (!this.can('mute', null, room)) return false;
			if (!room.staffMessage) return this.sendReply("This room does not have a staff introduction set.");
			this.sendReply(`|raw|<div class="infobox">${room.staffMessage.replace(/\n/g, ``)}</div>`);
			if (user.can('ban', null, room) && cmd !== 'stafftopic') {
				this.sendReply('Source:');
				const code = Chat.escapeHTML(room.staffMessage).replace(/\n/g, '<br />');
				this.sendReplyBox(`<code style="white-space: pre-wrap">/staffintro ${code}</code>`);
			}
			return;
		}
		if (!this.can('ban', null, room)) return false;
		if (!this.canTalk()) return;
		if (this.meansNo(target) || target === 'delete') return this.errorReply('Did you mean "/deletestaffintro"?');
		target = this.canHTML(target)!;
		if (!target) return;
		if (!/</.test(target)) {
			// not HTML, do some simple URL linking
			const re = /(https?:\/\/(([\w.-]+)+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?))/g;
			target = target.replace(re, '<a href="$1">$1</a>');
		}
		if (target.substr(0, 12) === '/staffintro ') target = target.substr(12);

		room.staffMessage = target.replace(/\r/g, '');
		this.sendReply("(The staff introduction has been changed to:)");
		this.sendReply(`|raw|<div class="infobox">${target.replace(/\n/g, ``)}</div>`);

		this.privateModAction(`(${user.name} changed the staffintro.)`);
		this.modlog('STAFFINTRO');
		this.roomlog(room.staffMessage.replace(/\n/g, ``));

		if (room.chatRoomData) {
			room.chatRoomData.staffMessage = room.staffMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	deletestafftopic: 'deletestaffintro',
	deletestaffintro(target, room, user) {
		if (!this.can('ban', null, room)) return false;
		if (!room.staffMessage) return this.errorReply("This room does not have a staff introduction set.");

		this.privateModAction(`(${user.name} deleted the staffintro.)`);
		this.modlog('DELETESTAFFINTRO');
		this.roomlog(target);

		delete room.staffMessage;
		if (room.chatRoomData) {
			delete room.chatRoomData.staffMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	roomalias(target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.aliases || !room.aliases.length) return this.sendReplyBox("This room does not have any aliases.");
			return this.sendReplyBox(`This room has the following aliases: ${room.aliases.join(", ")}`);
		}
		if (!this.can('makeroom')) return false;
		if (target.includes(',')) {
			this.errorReply(`Invalid room alias: ${target.trim()}`);
			return this.parse('/help roomalias');
		}

		const alias = toID(target);
		if (!alias.length) return this.errorReply("Only alphanumeric characters are valid in an alias.");
		if (Rooms.get(alias) || Rooms.aliases.has(alias)) return this.errorReply("You cannot set an alias to an existing room or alias.");
		if (room.isPersonal) return this.errorReply("Personal rooms can't have aliases.");

		Rooms.aliases.set(alias, room.roomid);
		this.privateModAction(`(${user.name} added the room alias '${alias}'.)`);
		this.modlog('ROOMALIAS', null, alias);

		if (!room.aliases) room.aliases = [];
		room.aliases.push(alias);
		if (room.chatRoomData) {
			room.chatRoomData.aliases = room.aliases;
			Rooms.global.writeChatRoomData();
		}
	},
	roomaliashelp: [
		`/roomalias - displays a list of all room aliases of the room the command was entered in.`,
		`/roomalias [alias] - adds the given room alias to the room the command was entered in. Requires: & ~`,
		`/removeroomalias [alias] - removes the given room alias of the room the command was entered in. Requires: & ~`,
	],

	deleteroomalias: 'removeroomalias',
	deroomalias: 'removeroomalias',
	unroomalias: 'removeroomalias',
	removeroomalias(target, room, user) {
		if (!room.aliases) return this.errorReply("This room does not have any aliases.");
		if (!this.can('makeroom')) return false;
		if (target.includes(',')) {
			this.errorReply(`Invalid room alias: ${target.trim()}`);
			return this.parse('/help removeroomalias');
		}

		const alias = toID(target);
		if (!alias || !Rooms.aliases.has(alias)) return this.errorReply("Please specify an existing alias.");
		if (Rooms.aliases.get(alias) !== room.roomid) return this.errorReply("You may only remove an alias from the current room.");

		this.privateModAction(`(${user.name} removed the room alias '${alias}'.)`);
		this.modlog('REMOVEALIAS', null, alias);

		const aliasIndex = room.aliases.indexOf(alias);
		if (aliasIndex >= 0) {
			room.aliases.splice(aliasIndex, 1);
			Rooms.aliases.delete(alias);
			Rooms.global.writeChatRoomData();
		}
	},
	removeroomaliashelp: [`/removeroomalias [alias] - removes the given room alias of the room the command was entered in. Requires: & ~`],
};

export const roomSettings: SettingsHandler[] = [
	// modchat
	(room, user) => {
		const threshold = user.can('makeroom') ? Infinity :
			user.can('modchatall', null, room) ? Config.groupsranking.indexOf(room.getAuth(user)) :
			user.can('modchat', null, room) ? 1 :
			null;

		const permission = !!threshold;

		// typescript seems to think that [prop, true] is of type [prop, boolean] unless we tell it explicitly
		const options: [string, string | true][] = !permission ? [[room.modchat || 'off', true]] :
			[
				'off',
				'autoconfirmed',
				'trusted',
				...RANKS.slice(1, threshold + 1),
			].map(rank => [rank, (rank === 'off' ? !room.modchat : rank === room.modchat) || `modchat ${rank || 'off'}`]);

		return {
			label: "Modchat",
			permission,
			options,
		};
	},
	(room, user) => ({
		label: "Modjoin",
		permission: room.isPersonal ? user.can('editroom', null, room) : user.can('makeroom'),
		options: [
			'off',
			'autoconfirmed',
			// groupchat ROs can set modjoin, but only to +
			// first rank is for modjoin off
			...RANKS.slice(1, room.isPersonal && !user.can('makeroom') ? 2 : undefined),
		].map(rank =>
			[rank, (rank === 'off' ? !room.modjoin : rank === room.modjoin) || `modjoin ${rank || 'off'}`]
		),
	}),
	room => ({
		label: "Language",
		permission: 'editroom',
		options: [...Chat.languages].map(([id, name]) =>
			[name, (id === 'english' ? !room.language : id === room.language) || `roomlanguage ${id}`]
		),
	}),
	room => ({
		label: "Stretch filter",
		permission: 'editroom',
		options: [
			[`off`, !room.filterStretching || 'stretchfilter off'],
			[`on`, room.filterStretching || 'stretchfilter on'],
		],
	}),
	room => ({
		label: "Caps filter",
		permission: 'editroom',
		options: [
			[`off`, !room.filterCaps || 'capsfilter off'],
			[`on`, room.filterCaps || 'capsfilter on'],
		],
	}),
	room => ({
		label: "Emoji filter",
		permission: 'editroom',
		options: [
			[`off`, !room.filterEmojis || 'emojifilter off'],
			[`on`, room.filterEmojis || 'emojifilter on'],
		],
	}),
	room => ({
		label: "Slowchat",
		permission: room.userCount < SLOWCHAT_USER_REQUIREMENT ? 'bypassall' : 'editroom',
		options: ['off', 5, 10, 20, 30, 60].map(time =>
			[`${time}`, (time === 'off' ? !room.slowchat : time === room.slowchat) || `slowchat ${time || 'false'}`]
		),
	}),
];
