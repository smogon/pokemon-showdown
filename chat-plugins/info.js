/**
 * Informational Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are informational commands. For instance, you can define the command
 * 'whois' here, then use it by typing /whois into Pokemon Showdown.
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT license
 */

'use strict';

/** @typedef {(this: CommandContext, target: string, room: BasicChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {{[k: string]: ChatHandler | string | true | string[]}} ChatCommands */

/** @type {ChatCommands} */
const commands = {

	'!whois': true,
	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whoare: 'whois',
	whois: function (target, room, user, connection, cmd) {
		if (room && room.id === 'staff' && !this.runBroadcast()) return;
		if (!room) room = Rooms.global;
		let targetUser = this.targetUserOrSelf(target, user.group === ' ');
		let showAll = (cmd === 'ip' || cmd === 'whoare' || cmd === 'alt' || cmd === 'alts');
		if (!targetUser) {
			if (showAll) return this.parse('/offlinewhois ' + target);
			return this.errorReply("User " + this.targetUsername + " not found.");
		}
		if (showAll && !user.trusted && targetUser !== user) {
			return this.errorReply(`/${cmd} - Access denied.`);
		}

		let buf = Chat.html`<strong class="username"><small style="display:none">${targetUser.group}</small>${targetUser.name}</strong> `;
		const ac = targetUser.autoconfirmed;
		if (ac && showAll) buf += ` <small style="color:gray">(ac${targetUser.userid === ac ? `` : `: ${ac}`})</small>`;
		if (!targetUser.connected) buf += ` <em style="color:gray">(offline)</em>`;
		let roomauth = '';
		if (room.auth && targetUser.userid in room.auth) roomauth = room.auth[targetUser.userid];
		if (Config.groups[roomauth] && Config.groups[roomauth].name) {
			buf += `<br />${Config.groups[roomauth].name} (${roomauth})`;
		}
		if (Config.groups[targetUser.group] && Config.groups[targetUser.group].name) {
			buf += `<br />Global ${Config.groups[targetUser.group].name} (${targetUser.group})`;
		}
		if (targetUser.isSysop) {
			buf += `<br />(Pok&eacute;mon Showdown System Operator)`;
		}
		if (!targetUser.registered) {
			buf += `<br />(Unregistered)`;
		}
		let publicrooms = "";
		let hiddenrooms = "";
		let privaterooms = "";
		for (const roomid of targetUser.inRooms) {
			if (roomid === 'global') continue;
			let targetRoom = Rooms.get(roomid);

			let authSymbol = (targetRoom.auth && targetRoom.auth[targetUser.userid] ? targetRoom.auth[targetUser.userid] : '');
			let battleTitle = (roomid.battle ? ` title="${roomid.title}"` : '');
			let output = `${authSymbol}<a href="/${roomid}"${battleTitle}>${roomid}</a>`;
			if (targetRoom.isPrivate === true) {
				if (targetRoom.modjoin === '~') continue;
				if (privaterooms) privaterooms += " | ";
				privaterooms += output;
			} else if (targetRoom.isPrivate) {
				if (hiddenrooms) hiddenrooms += " | ";
				hiddenrooms += output;
			} else {
				if (publicrooms) publicrooms += " | ";
				publicrooms += output;
			}
		}
		buf += '<br />Rooms: ' + (publicrooms || '<em>(no public rooms)</em>');

		if (!showAll) {
			return this.sendReplyBox(buf);
		}
		buf += '<br />';
		if (user.can('alts', targetUser) || user.can('alts') && user === targetUser) {
			let prevNames = Object.keys(targetUser.prevNames).join(", ");
			if (prevNames) buf += Chat.html`<br />Previous names: ${prevNames}`;

			for (const targetAlt of targetUser.getAltUsers(true)) {
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				buf += Chat.html`<br />Alt: <span class="username">${targetAlt.name}</span>`;
				if (!targetAlt.connected) buf += ` <em style="color:gray">(offline)</em>`;
				prevNames = Object.keys(targetAlt.prevNames).join(", ");
				if (prevNames) buf += `<br />Previous names: ${prevNames}`;
			}
			if (targetUser.namelocked) {
				buf += `<br />NAMELOCKED: ${targetUser.namelocked}`;
				let punishment = Punishments.userids.get(targetUser.locked);
				if (punishment) {
					let expiresIn = Punishments.checkLockExpiration(targetUser.locked);
					if (expiresIn) buf += expiresIn;
					if (punishment[3]) buf += Chat.html` (reason: ${punishment[3]})`;
				}
			} else if (targetUser.locked) {
				buf += `<br />LOCKED: ${targetUser.locked}`;
				switch (targetUser.locked) {
				case '#dnsbl':
					buf += ` - IP is in a DNS-based blacklist`;
					break;
				case '#range':
					buf += ` - IP or host is in a temporary range-lock`;
					break;
				case '#hostfilter':
					buf += ` - host is permanently locked for being a proxy`;
					break;
				}
				let punishment = Punishments.userids.get(targetUser.locked);
				if (punishment) {
					let expiresIn = Punishments.checkLockExpiration(targetUser.locked);
					if (expiresIn) buf += expiresIn;
					if (punishment[3]) buf += Chat.html` (reason: ${punishment[3]})`;
				}
			}
			let battlebanned = Punishments.isBattleBanned(targetUser);
			if (battlebanned) {
				buf += `<br />BATTLEBANNED: ${battlebanned[1]}`;
				let expiresIn = new Date(battlebanned[2]).getTime() - Date.now();
				let expiresDays = Math.round(expiresIn / 1000 / 60 / 60 / 24);
				let expiresText = '';
				if (expiresDays >= 1) {
					expiresText = `in around ${Chat.count(expiresDays, "days")}`;
				} else {
					expiresText = `soon`;
				}
				if (expiresIn > 1) buf += ` (expires ${expiresText})`;
				if (battlebanned[3]) buf += Chat.html` (reason: ${battlebanned[3]})`;
			}
			if (targetUser.semilocked) {
				buf += `<br />Semilocked: ${targetUser.semilocked}`;
			}
		}
		if ((user.can('ip', targetUser) || user === targetUser)) {
			let ips = Object.keys(targetUser.ips);
			ips = ips.map(ip => {
				let status = [];
				let punishment = Punishments.ips.get(ip);
				if (user.can('ip') && punishment) {
					let [punishType, userid] = punishment;
					let punishMsg = Punishments.punishmentTypes.get(punishType) || 'punished';
					if (userid !== targetUser.userid) punishMsg += ` as ${userid}`;
					status.push(punishMsg);
				}
				if (Punishments.sharedIps.has(ip)) {
					let sharedStr = 'shared';
					if (Punishments.sharedIps.get(ip)) {
						sharedStr += `: ${Punishments.sharedIps.get(ip)}`;
					}
					status.push(sharedStr);
				}
				return ip + (status.length ? ` (${status.join('; ')})` : '');
			});
			buf += `<br /> IP${Chat.plural(ips)}: ${ips.join(", ")}`;
			if (user.group !== ' ' && targetUser.latestHost) {
				buf += Chat.html`<br />Host: ${targetUser.latestHost}`;
			}
		}
		if ((user === targetUser || user.can('alts', targetUser)) && hiddenrooms) {
			buf += `<br />Hidden rooms: ${hiddenrooms}`;
		}
		const staffViewingLocked = user.can('alts', targetUser) && targetUser.locked;
		if ((user === targetUser || user.can('makeroom') || staffViewingLocked) && privaterooms) {
			buf += `<br />Private rooms: ${privaterooms}`;
		}

		if (user.can('alts', targetUser) || (room.isPrivate !== true && user.can('mute', targetUser, room) && targetUser.userid in room.users)) {
			let punishments = Punishments.getRoomPunishments(targetUser, {checkIps: true});

			if (punishments.length) {
				buf += `<br />Room punishments: `;

				buf += punishments.map(([room, punishment]) => {
					const [punishType, punishUserid, expireTime, reason] = punishment;
					let punishDesc = Punishments.roomPunishmentTypes.get(punishType);
					if (!punishDesc) punishDesc = `punished`;
					if (punishUserid !== targetUser.userid) punishDesc += ` as ${punishUserid}`;
					let expiresIn = new Date(expireTime).getTime() - Date.now();
					let expireString = Chat.toDurationString(expiresIn, {precision: 1});
					punishDesc += ` for ${expireString}`;

					if (reason) punishDesc += `: ${reason}`;
					return `<a href="/${room}">${room}</a> (${punishDesc})`;
				}).join(', ');
			}
		}
		this.sendReplyBox(buf);
	},
	whoishelp: [
		`/whois - Get details on yourself: alts, group, IP address, and rooms.`,
		`/whois [username] - Get details on a username: alts (Requires: % @ * & ~), group, IP address (Requires: @ * & ~), and rooms.`,
	],

	'!offlinewhois': true,
	checkpunishment: 'offlinewhois',
	offlinewhois: function (target, room, user) {
		if (!user.trusted) {
			return this.errorReply("/offlinewhois - Access denied.");
		}
		let userid = toId(target);
		if (!userid) return this.errorReply("Please enter a valid username.");
		let targetUser = Users(userid);
		let buf = Chat.html`<strong class="username">${target}</strong>`;
		if (!targetUser || !targetUser.connected) buf += ` <em style="color:gray">(offline)</em>`;

		let roomauth = '';
		if (room && room.auth && userid in room.auth) roomauth = room.auth[userid];
		if (Config.groups[roomauth] && Config.groups[roomauth].name) {
			buf += `<br />${Config.groups[roomauth].name} (${roomauth})`;
		}
		let group = (Users.usergroups[userid] || '').charAt(0);
		if (Config.groups[group] && Config.groups[group].name) {
			buf += `<br />Global ${Config.groups[group].name} (${group})`;
		}

		buf += `<br /><br />`;
		let atLeastOne = false;

		let punishment = Punishments.userids.get(userid);
		if (punishment) {
			const [punishType, punishUserid, , reason] = punishment;
			const punishName = (Punishments.punishmentTypes.get(punishType) || punishType).toUpperCase();
			buf += `${punishName}: ${punishUserid}`;
			let expiresIn = Punishments.checkLockExpiration(userid);
			if (expiresIn) buf += expiresIn;
			if (reason) buf += Chat.html` (reason: ${reason})`;
			buf += '<br />';
			atLeastOne = true;
		}

		if (!user.can('alts') && !atLeastOne) {
			let hasJurisdiction = room && user.can('mute', null, room) && Punishments.roomUserids.nestedHas(room.id, userid);
			if (!hasJurisdiction) {
				return this.errorReply("/checkpunishment - User not found.");
			}
		}

		let punishments = Punishments.getRoomPunishments(targetUser || {userid});

		if (punishments && punishments.length) {
			buf += `<br />Room punishments: `;

			buf += punishments.map(([room, punishment]) => {
				const [punishType, punishUserid, expireTime, reason] = punishment;
				let punishDesc = Punishments.roomPunishmentTypes.get(punishType);
				if (!punishDesc) punishDesc = `punished`;
				if (punishUserid !== userid) punishDesc += ` as ${punishUserid}`;
				let expiresIn = new Date(expireTime).getTime() - Date.now();
				let expireString = Chat.toDurationString(expiresIn, {precision: 1});
				punishDesc += ` for ${expireString}`;

				if (reason) punishDesc += `: ${reason}`;
				return `<a href="/${room}">${room}</a> (${punishDesc})`;
			}).join(', ');
			atLeastOne = true;
		}
		if (!atLeastOne) {
			buf += `This username has no punishments associated with it.`;
		}
		this.sendReplyBox(buf);
	},

	'!host': true,
	host: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help host');
		if (!this.can('rangeban')) return;
		target = target.trim();
		if (!/^[0-9.]+$/.test(target)) return this.errorReply('You must pass a valid IPv4 IP to /host.');
		Dnsbl.reverse(target).then(host => {
			this.sendReply('IP ' + target + ': ' + (host || "ERROR"));
		});
	},
	hosthelp: [`/host [ip] - Gets the host for a given IP. Requires: & ~`],

	'!ipsearch': true,
	searchip: 'ipsearch',
	ipsearchall: 'ipsearch',
	hostsearch: 'ipsearch',
	ipsearch: function (target, room, user, connection, cmd) {
		if (!target.trim()) return this.parse(`/help ipsearch`);
		if (!this.can('rangeban')) return;

		let [ip, roomid] = this.splitOne(target);
		let targetRoom = roomid ? Rooms(roomid) : null;
		if (!targetRoom && targetRoom !== null) return this.errorReply(`The room "${roomid}" does not exist.`);
		let results = /** @type {string[]} */ ([]);
		let isAll = (cmd === 'ipsearchall');

		if (/[a-z]/.test(ip)) {
			// host
			this.sendReply(`Users with host ${ip}${targetRoom ? ` in the room ${targetRoom.title}` : ``}:`);
			Users.users.forEach(curUser => {
				if (results.length > 100 && !isAll) return;
				if (!curUser.latestHost || !curUser.latestHost.endsWith(ip)) return;
				if (targetRoom && !curUser.inRooms.has(targetRoom.id)) return;
				results.push((curUser.connected ? " \u25C9 " : " \u25CC ") + " " + curUser.name);
			});
			if (results.length > 100 && !isAll) {
				return this.sendReply(`More than 100 users match the specified IP range. Use /ipsearchall to retrieve the full list.`);
			}
		} else if (ip.slice(-1) === '*') {
			// IP range
			this.sendReply(`Users in IP range ${ip}${targetRoom ? ` in the room ${targetRoom.title}` : ``}:`);
			ip = ip.slice(0, -1);
			Users.users.forEach(curUser => {
				if (results.length > 100 && !isAll) return;
				if (!curUser.latestIp.startsWith(ip)) return;
				if (targetRoom && !curUser.inRooms.has(targetRoom.id)) return;
				results.push((curUser.connected ? " \u25C9 " : " \u25CC ") + " " + curUser.name);
			});
			if (results.length > 100 && !isAll) {
				return this.sendReply(`More than 100 users match the specified IP range. Use /ipsearchall to retrieve the full list.`);
			}
		} else {
			this.sendReply(`Users with IP ${ip}${targetRoom ? ` in the room ${targetRoom.title}` : ``}:`);
			Users.users.forEach(curUser => {
				if (curUser.latestIp !== ip) return;
				if (targetRoom && !curUser.inRooms.has(targetRoom.id)) return;
				results.push((curUser.connected ? " \u25C9 " : " \u25CC ") + " " + curUser.name);
			});
		}
		if (!results.length) {
			if (!ip.includes('.')) return this.errorReply(`${ip} is not a valid IP or host.`);
			return this.sendReply(`No results found.`);
		}
		return this.sendReply(results.join('; '));
	},
	ipsearchhelp: [`/ipsearch [ip|range|host], (room) - Find all users with specified IP, IP range, or host. If a room is provided only users in the room will be shown. Requires: & ~`],

	checkchallenges: function (target, room, user) {
		if (!this.can('ban', null, room)) return false;
		if (!this.runBroadcast(true)) return;
		if (!this.broadcasting) {
			this.errorReply(`This command must be broadcast:`);
			return this.parse(`/help checkchallenges`);
		}
		target = this.splitTarget(target);
		const user1 = this.targetUser;
		const user2 = Users.get(target);
		if (!user1 || !user2 || user1 === user2) return this.parse(`/help checkchallenges`);
		if (!(user1 in room.users) || !(user2 in room.users)) {
			return this.errorReply(`Both users must be in this room.`);
		}
		let challenges = [];
		const user1Challs = Ladders.challenges.get(user1.userid);
		if (user1Challs) {
			for (const chall of user1Challs) {
				if (chall.from === user1.userid && Users.get(chall.to) === user2) {
					challenges.push(Chat.html`${user1.name} is challenging ${user2.name} in ${Dex.getFormat(chall.formatid).name}.`);
					break;
				}
			}
		}
		const user2Challs = Ladders.challenges.get(user2.userid);
		if (user2Challs) {
			for (const chall of user2Challs) {
				if (chall.from === user2.userid && Users.get(chall.to) === user1) {
					challenges.push(Chat.html`${user2.name} is challenging ${user1.name} in ${Dex.getFormat(chall.formatid).name}.`);
					break;
				}
			}
		}
		if (!challenges.length) {
			return this.sendReplyBox(Chat.html`${user1.name} and ${user2.name} are not challenging each other.`);
		}
		this.sendReplyBox(challenges.join(`<br />`));
	},
	checkchallengeshelp: [`!checkchallenges [user1], [user2] - Check if the specified users are challenging each other. Requires: @ * # & ~`],

	/*********************************************************
	 * Client fallback
	 *********************************************************/

	unignore: 'ignore',
	ignore: function (target, room, user) {
		if (!room) this.errorReply(`In PMs, this command can only be used by itself to ignore the person you're talking to: "/${this.cmd}", not "/${this.cmd} ${target}"`);
		this.errorReply(`You're using a custom client that doesn't support the ignore command.`);
	},

	/*********************************************************
	 * Data Search Dex
	 *********************************************************/

	'!data': true,
	pstats: 'data',
	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;

		let buffer = '';
		let sep = target.split(',');
		if (sep.length !== 2) sep = [target];
		target = sep[0].trim();
		let targetId = toId(target);
		if (!targetId) return this.parse('/help data');
		let targetNum = parseInt(targetId);
		if (!isNaN(targetNum) && '' + targetNum === target) {
			for (let p in Dex.data.Pokedex) {
				let pokemon = Dex.getTemplate(p);
				if (pokemon.num === targetNum) {
					target = pokemon.species;
					targetId = pokemon.id;
					break;
				}
			}
		}
		let mod = Dex;
		if (sep[1] && toId(sep[1]) in Dex.dexes) {
			mod = Dex.mod(toId(sep[1]));
		} else if (sep[1] && Dex.getFormat(sep[1]).mod) {
			mod = Dex.mod(Dex.getFormat(sep[1]).mod);
		} else if (room && room.battle) {
			mod = Dex.forFormat(room.battle.format);
		}
		let newTargets = mod.dataSearch(target);
		let showDetails = (cmd === 'dt' || cmd === 'details');
		if (!newTargets || !newTargets.length) {
			return this.errorReply(`No Pok\u00e9mon, item, move, ability or nature named '${target}' was found${Dex.gen > mod.gen ? ` in Gen ${mod.gen}` : ""}. (Check your spelling?)`);
		}

		for (const [i, newTarget] of newTargets.entries()) {
			if (newTarget.isInexact && !i) {
				buffer = `No Pok\u00e9mon, item, move, ability or nature named '${target}' was found${Dex.gen > mod.gen ? ` in Gen ${mod.gen}` : ""}. Showing the data of '${newTargets[0].name}' instead.\n`;
			}
			/** @type {AnyObject} */
			let details = null;
			switch (newTarget.searchType) {
			case 'nature':
				let nature = Dex.getNature(newTarget.name);
				buffer += "" + nature.name + " nature: ";
				if (nature.plus) {
					let statNames = {'atk': "Attack", 'def': "Defense", 'spa': "Special Attack", 'spd': "Special Defense", 'spe': "Speed"};
					buffer += "+10% " + statNames[nature.plus] + ", -10% " + statNames[nature.minus] + ".";
				} else {
					buffer += "No effect.";
				}
				return this.sendReply(buffer);
			case 'pokemon':
				let pokemon = mod.getTemplate(newTarget.name);
				let tier = pokemon.tier;
				if (room && (room.id === 'smogondoubles' ||
					['gen7doublesou', 'gen7doublesubers', 'gen7doublesuu'].includes(room.battle && room.battle.format))) {
					tier = pokemon.doublesTier;
				}
				buffer += `|raw|${Chat.getDataPokemonHTML(pokemon, mod.gen, tier)}\n`;
				if (showDetails) {
					let weighthit = 20;
					if (pokemon.weightkg >= 200) {
						weighthit = 120;
					} else if (pokemon.weightkg >= 100) {
						weighthit = 100;
					} else if (pokemon.weightkg >= 50) {
						weighthit = 80;
					} else if (pokemon.weightkg >= 25) {
						weighthit = 60;
					} else if (pokemon.weightkg >= 10) {
						weighthit = 40;
					}
					details = {
						"Dex#": pokemon.num,
						"Gen": pokemon.gen || 'CAP',
						"Height": pokemon.heightm + " m",
						"Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
					};
					if (pokemon.color && mod.gen >= 5) details["Dex Colour"] = pokemon.color;
					if (pokemon.eggGroups && mod.gen >= 2) details["Egg Group(s)"] = pokemon.eggGroups.join(", ");
					let evos = /** @type {string[]} */ ([]);
					pokemon.evos.forEach(evoName => {
						const evo = mod.getTemplate(evoName);
						if (evo.gen <= mod.gen) {
							evos.push(evo.name + " (" + evo.evoLevel + ")");
						}
					});
					if (!evos.length) {
						details['<font color="#686868">Does Not Evolve</font>'] = "";
					} else {
						details["Evolution"] = evos.join(", ");
					}
				}
				break;
			case 'item':
				let item = mod.getItem(newTarget.name);
				buffer += `|raw|${Chat.getDataItemHTML(item)}\n`;
				if (showDetails) {
					details = {
						"Gen": item.gen,
					};

					if (mod.gen >= 4) {
						if (item.fling) {
							details["Fling Base Power"] = item.fling.basePower;
							if (item.fling.status) details["Fling Effect"] = item.fling.status;
							if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
							if (item.isBerry) details["Fling Effect"] = "Activates the Berry's effect on the target.";
							if (item.id === 'whiteherb') details["Fling Effect"] = "Restores the target's negative stat stages to 0.";
							if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of Attract, Disable, Encore, Heal Block, Taunt, and Torment from the target.";
						} else {
							details["Fling"] = "This item cannot be used with Fling.";
						}
					}
					if (item.naturalGift && mod.gen >= 3) {
						details["Natural Gift Type"] = item.naturalGift.type;
						details["Natural Gift Base Power"] = item.naturalGift.basePower;
					}
					if (item.isUnreleased) {
						details["Unreleased in Gen " + mod.gen] = "";
					}
				}
				break;
			case 'move':
				let move = mod.getMove(newTarget.name);
				buffer += `|raw|${Chat.getDataMoveHTML(move)}\n`;
				if (showDetails) {
					details = {
						"Priority": move.priority,
						"Gen": move.gen || 'CAP',
					};

					if (move.secondary || move.secondaries) details["&#10003; Secondary effect"] = "";
					if (move.flags['contact']) details["&#10003; Contact"] = "";
					if (move.flags['sound']) details["&#10003; Sound"] = "";
					if (move.flags['bullet']) details["&#10003; Bullet"] = "";
					if (move.flags['pulse']) details["&#10003; Pulse"] = "";
					if (!move.flags['protect'] && !/(ally|self)/i.test(move.target)) details["&#10003; Bypasses Protect"] = "";
					if (move.flags['authentic']) details["&#10003; Bypasses Substitutes"] = "";
					if (move.flags['defrost']) details["&#10003; Thaws user"] = "";
					if (move.flags['bite']) details["&#10003; Bite"] = "";
					if (move.flags['punch']) details["&#10003; Punch"] = "";
					if (move.flags['powder']) details["&#10003; Powder"] = "";
					if (move.flags['reflectable']) details["&#10003; Bounceable"] = "";
					if (move.flags['gravity'] && mod.gen >= 4) details["&#10007; Suppressed by Gravity"] = "";

					if (mod.gen >= 7) {
						if (move.zMovePower) {
							details["Z-Power"] = move.zMovePower;
						} else if (move.zMoveEffect) {
							details["Z-Effect"] = {
								'clearnegativeboost': "Restores negative stat stages to 0",
								'crit2': "Crit ratio +2",
								'heal': "Restores HP 100%",
								'curse': "Restores HP 100% if user is Ghost type, otherwise Attack +1",
								'redirect': "Redirects opposing attacks to user",
								'healreplacement': "Restores replacement's HP 100%",
							}[move.zMoveEffect];
						} else if (move.zMoveBoost) {
							details["Z-Effect"] = "";
							let boost = move.zMoveBoost;
							let stats = {atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', accuracy: 'Accuracy', evasion: 'Evasiveness'};
							for (let i in boost) {
								details["Z-Effect"] += " " + stats[i] + " +" + boost[i];
							}
						} else if (move.isZ) {
							details["&#10003; Z-Move"] = "";
							details["Z-Crystal"] = mod.getItem(move.isZ).name;
							if (move.basePower !== 1) {
								details["User"] = mod.getItem(move.isZ).zMoveUser.join(", ");
								details["Required Move"] = mod.getItem(move.isZ).zMoveFrom;
							}
						} else {
							details["Z-Effect"] = "None";
						}
					}

					details["Target"] = {
						'normal': "One Adjacent Pok\u00e9mon",
						'self': "User",
						'adjacentAlly': "One Ally",
						'adjacentAllyOrSelf': "User or Ally",
						'adjacentFoe': "One Adjacent Opposing Pok\u00e9mon",
						'allAdjacentFoes': "All Adjacent Opponents",
						'foeSide': "Opposing Side",
						'allySide': "User's Side",
						'allyTeam': "User's Side",
						'allAdjacent': "All Adjacent Pok\u00e9mon",
						'any': "Any Pok\u00e9mon",
						'all': "All Pok\u00e9mon",
					}[move.target] || "Unknown";

					if (move.id === 'snatch' && mod.gen >= 3) {
						details['<a href="https://pokemonshowdown.com/dex/moves/snatch">Snatchable Moves</a>'] = '';
					}
					if (move.id === 'mirrormove') {
						details['<a href="https://pokemonshowdown.com/dex/moves/mirrormove">Mirrorable Moves</a>'] = '';
					}
					if (move.isUnreleased) {
						details["Unreleased in Gen " + mod.gen] = "";
					}
				}
				break;
			case 'ability':
				let ability = mod.getAbility(newTarget.name);
				buffer += `|raw|${Chat.getDataAbilityHTML(ability)}\n`;
				break;
			default:
				throw new Error(`Unrecognized searchType`);
			}

			if (details) {
				buffer += '|raw|<font size="1">' + Object.keys(details).map(detail => {
					if (details[detail] === '') return detail;
					return '<font color="#686868">' + detail + ':</font> ' + details[detail];
				}).join("&nbsp;|&ThickSpace;") + '</font>\n';
			}
		}
		this.sendReply(buffer);
	},
	datahelp: [
		`/data [pokemon/item/move/ability/nature] - Get details on this pokemon/item/move/ability/nature.`,
		`/data [pokemon/item/move/ability/nature], Gen [generation number/format name] - Get details on this pokemon/item/move/ability/nature for that generation/format.`,
		`!data [pokemon/item/move/ability/nature] - Show everyone these details. Requires: + % @ * # & ~`,
	],

	'!details': true,
	dt: 'details',
	details: function (target) {
		if (!target) return this.parse('/help details');
		this.run('data');
	},
	detailshelp: [
		`/details [pokemon/item/move/ability/nature] - Get additional details on this pokemon/item/move/ability/nature.`,
		`/details [pokemon/item/move/ability/nature], Gen [generation number/format name] - Get details on this pokemon/item/move/ability/nature for that generation/format.`,
		`!details [pokemon/item/move/ability/nature] - Show everyone these details. Requires: + % @ * # & ~`,
	],

	'!weakness': true,
	weaknesses: 'weakness',
	weak: 'weakness',
	resist: 'weakness',
	weakness: function (target, room, user) {
		if (!target) return this.parse('/help weakness');
		if (!this.runBroadcast()) return;
		target = target.trim();
		let modName = target.split(',');
		let mod = Dex.mod(toId(modName[modName.length - 1])) || Dex;
		let targets = target.split(/ ?[,/] ?/);
		/** @type {{types: string[], [k: string]: any}} */
		let pokemon = mod.getTemplate(targets[0]);
		let type1 = mod.getType(targets[0]);
		let type2 = mod.getType(targets[1]);
		let type3 = mod.getType(targets[2]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else {
			let types = [];
			if (type1.exists) {
				types.push(type1.id);
				if (type2.exists && type2 !== type1) {
					types.push(type2.id);
				}
				if (type3.exists && type3 !== type1 && type3 !== type2) {
					types.push(type3.id);
				}
			}

			if (types.length === 0) {
				return this.sendReplyBox(`${Chat.escapeHTML(target)} isn't a recognized type or pokemon${Dex.gen > mod.gen ? ` in Gen ${mod.gen}` : ""}.`);
			}
			pokemon = {types: types};
			target = types.join("/");
		}

		let weaknesses = [];
		let resistances = [];
		let immunities = [];
		for (let type in mod.data.TypeChart) {
			let notImmune = mod.getImmunity(type, pokemon);
			if (notImmune) {
				let typeMod = mod.getEffectiveness(type, pokemon);
				switch (typeMod) {
				case 1:
					weaknesses.push(type);
					break;
				case 2:
					weaknesses.push("<b>" + type + "</b>");
					break;
				case 3:
					weaknesses.push("<b><i>" + type + "</i></b>");
					break;
				case -1:
					resistances.push(type);
					break;
				case -2:
					resistances.push("<b>" + type + "</b>");
					break;
				case -3:
					resistances.push("<b><i>" + type + "</i></b>");
					break;
				}
			} else {
				immunities.push(type);
			}
		}

		let buffer = [];
		buffer.push(pokemon.exists ? "" + target + ' (ignoring abilities):' : '' + target + ':');
		buffer.push('<span class="message-effect-weak">Weaknesses</span>: ' + (weaknesses.join(', ') || '<font color=#999999>None</font>'));
		buffer.push('<span class="message-effect-resist">Resistances</span>: ' + (resistances.join(', ') || '<font color=#999999>None</font>'));
		buffer.push('<span class="message-effect-immune">Immunities</span>: ' + (immunities.join(', ') || '<font color=#999999>None</font>'));
		this.sendReplyBox(buffer.join('<br />'));
	},
	weaknesshelp: [
		`/weakness [pokemon] - Provides a Pok\u00e9mon's resistances, weaknesses, and immunities, ignoring abilities.`,
		`/weakness [type 1]/[type 2] - Provides a type or type combination's resistances, weaknesses, and immunities, ignoring abilities.`,
		`!weakness [pokemon] - Shows everyone a Pok\u00e9mon's resistances, weaknesses, and immunities, ignoring abilities. Requires: + % @ * # & ~`,
		`!weakness [type 1]/[type 2] - Shows everyone a type or type combination's resistances, weaknesses, and immunities, ignoring abilities. Requires: + % @ * # & ~`,
	],

	'!effectiveness': true,
	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		let targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.errorReply("Attacker and defender must be separated with a comma.");

		let searchMethods = ['getType', 'getMove', 'getTemplate'];
		let sourceMethods = ['getType', 'getMove'];
		let targetMethods = ['getType', 'getTemplate'];
		let source, defender, foundData, atkName, defName;

		for (let i = 0; i < 2; ++i) {
			let method;
			for (method of searchMethods) {
				foundData = Dex[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && sourceMethods.includes(method)) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && targetMethods.includes(method)) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.runBroadcast()) return;

		let factor = 0;
		if (Dex.getImmunity(source, defender) || source.ignoreImmunity && (source.ignoreImmunity === true || source.ignoreImmunity[source.type])) {
			let totalTypeMod = 0;
			if (source.effectType !== 'Move' || source.category !== 'Status' && (source.basePower || source.basePowerCallback)) {
				for (const type of defender.types) {
					let baseMod = Dex.getEffectiveness(source, type);
					let moveMod = source.onEffectiveness && source.onEffectiveness.call(Dex, baseMod, type, source);
					totalTypeMod += typeof moveMod === 'number' ? moveMod : baseMod;
				}
			}
			factor = Math.pow(2, totalTypeMod);
		}

		let hasThousandArrows = source.id === 'thousandarrows' && defender.types.includes('Flying');
		let additionalInfo = hasThousandArrows ? "<br />However, Thousand Arrows will be 1x effective on the first hit." : "";

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + "." + additionalInfo);
	},
	effectivenesshelp: [
		`/effectiveness [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pok\u00e9mon.`,
		`!effectiveness [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pok\u00e9mon.`,
	],

	'!coverage': true,
	cover: 'coverage',
	coverage: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse("/help coverage");

		let targets = target.split(/[,+]/);
		let sources = [];
		let mod = Dex.mod(toId(targets[targets.length - 1])) || Dex;

		let dispTable = false;
		let bestCoverage = {};
		let hasThousandArrows = false;

		for (let type in mod.data.TypeChart) {
			// This command uses -5 to designate immunity
			bestCoverage[type] = -5;
		}

		for (const arg of targets) {
			let move = arg.trim();
			if (toId(move) === mod.currentMod) continue;
			move = move.charAt(0).toUpperCase() + move.slice(1).toLowerCase();
			if (move === 'Table' || move === 'All') {
				if (this.broadcasting) return this.sendReplyBox("The full table cannot be broadcast.");
				dispTable = true;
				continue;
			}

			let eff;
			if (move in mod.data.TypeChart) {
				sources.push(move);
				for (let type in bestCoverage) {
					if (!mod.getImmunity(move, type) && !move.ignoreImmunity) continue;
					eff = mod.getEffectiveness(move, type);
					if (eff > bestCoverage[type]) bestCoverage[type] = eff;
				}
				continue;
			}
			move = mod.getMove(move);
			if (move.exists && move.gen <= mod.gen) {
				if (!move.basePower && !move.basePowerCallback) continue;
				if (move.id === 'thousandarrows') hasThousandArrows = true;
				sources.push(move);
				for (let type in bestCoverage) {
					if (move.id === "struggle") {
						eff = 0;
					} else {
						if (!mod.getImmunity(move.type, type) && !move.ignoreImmunity) continue;
						let baseMod = mod.getEffectiveness(move, type);
						let moveMod = move.onEffectiveness && move.onEffectiveness.call(mod, baseMod, type, move);
						eff = typeof moveMod === 'number' ? moveMod : baseMod;
					}
					if (eff > bestCoverage[type]) bestCoverage[type] = eff;
				}
				continue;
			}

			return this.errorReply(`No type or move '${arg}' found${Dex.gen > mod.gen ? ` in Gen ${mod.gen}` : ""}.`);
		}
		if (sources.length === 0) return this.errorReply("No moves using a type table for determining damage were specified.");
		if (sources.length > 4) return this.errorReply("Specify a maximum of 4 moves or types.");

		// converts to fractional effectiveness, 0 for immune
		for (let type in bestCoverage) {
			if (bestCoverage[type] === -5) {
				bestCoverage[type] = 0;
				continue;
			}
			bestCoverage[type] = Math.pow(2, bestCoverage[type]);
		}

		if (!dispTable) {
			let buffer = [];
			let superEff = [];
			let neutral = [];
			let resists = [];
			let immune = [];

			for (let type in bestCoverage) {
				switch (bestCoverage[type]) {
				case 0:
					immune.push(type);
					break;
				case 0.25:
				case 0.5:
					resists.push(type);
					break;
				case 1:
					neutral.push(type);
					break;
				case 2:
				case 4:
					superEff.push(type);
					break;
				default:
					throw new Error("/coverage effectiveness of " + bestCoverage[type] + " from parameters: " + target);
				}
			}
			buffer.push('Coverage for ' + sources.join(' + ') + ':');
			buffer.push('<b><font color=#559955>Super Effective</font></b>: ' + (superEff.join(', ') || '<font color=#999999>None</font>'));
			buffer.push('<span class="message-effect-resist">Neutral</span>: ' + (neutral.join(', ') || '<font color=#999999>None</font>'));
			buffer.push('<span class="message-effect-weak">Resists</span>: ' + (resists.join(', ') || '<font color=#999999>None</font>'));
			buffer.push('<span class="message-effect-immune">Immunities</span>: ' + (immune.join(', ') || '<font color=#999999>None</font>'));
			return this.sendReplyBox(buffer.join('<br />'));
		} else {
			let buffer = '<div class="scrollable"><table cellpadding="1" width="100%"><tr><th></th>';
			let icon = {};
			for (let type in mod.data.TypeChart) {
				icon[type] = '<img src="https://play.pokemonshowdown.com/sprites/types/' + type + '.png" width="32" height="14">';
				// row of icons at top
				buffer += '<th>' + icon[type] + '</th>';
			}
			buffer += '</tr>';
			for (let type1 in mod.data.TypeChart) {
				// assembles the rest of the rows
				buffer += '<tr><th>' + icon[type1] + '</th>';
				for (let type2 in mod.data.TypeChart) {
					let typing;
					let cell = '<th ';
					let bestEff = -5;
					if (type1 === type2) {
						// when types are the same it's considered pure type
						typing = type1;
						bestEff = bestCoverage[type1];
					} else {
						typing = type1 + "/" + type2;
						for (const move of sources) {
							let curEff = 0;
							if ((!mod.getImmunity((move.type || move), type1) || !mod.getImmunity((move.type || move), type2)) && !move.ignoreImmunity) continue;
							let baseMod = mod.getEffectiveness(move, type1);
							let moveMod = move.onEffectiveness && move.onEffectiveness.call(Dex, baseMod, type1, move);
							curEff += typeof moveMod === 'number' ? moveMod : baseMod;
							baseMod = mod.getEffectiveness(move, type2);
							moveMod = move.onEffectiveness && move.onEffectiveness.call(Dex, baseMod, type2, move);
							curEff += typeof moveMod === 'number' ? moveMod : baseMod;

							if (curEff > bestEff) bestEff = curEff;
						}
						if (bestEff === -5) {
							bestEff = 0;
						} else {
							bestEff = Math.pow(2, bestEff);
						}
					}
					switch (bestEff) {
					case 0:
						cell += 'bgcolor=#666666 title="' + typing + '"><font color=#000000>' + bestEff + '</font>';
						break;
					case 0.25:
					case 0.5:
						cell += 'bgcolor=#AA5544 title="' + typing + '"><font color=#660000>' + bestEff + '</font>';
						break;
					case 1:
						cell += 'bgcolor=#6688AA title="' + typing + '"><font color=#000066>' + bestEff + '</font>';
						break;
					case 2:
					case 4:
						cell += 'bgcolor=#559955 title="' + typing + '"><font color=#003300>' + bestEff + '</font>';
						break;
					default:
						throw new Error("/coverage effectiveness of " + bestEff + " from parameters: " + target);
					}
					cell += '</th>';
					buffer += cell;
				}
			}
			buffer += '</table></div>';

			if (hasThousandArrows) {
				buffer += "<br /><b>Thousand Arrows has neutral type effectiveness on Flying-type Pok\u00e9mon if not already smacked down.";
			}

			this.sendReplyBox('Coverage for ' + sources.join(' + ') + ':<br />' + buffer);
		}
	},
	coveragehelp: [
		`/coverage [move 1], [move 2] ... - Provides the best effectiveness match-up against all defending types for given moves or attacking types`,
		`!coverage [move 1], [move 2] ... - Shows this information to everyone.`,
		`Adding the parameter 'all' or 'table' will display the information with a table of all type combinations.`,
	],

	'!statcalc': true,
	statcalc: function (target, room, user) {
		if (!target) return this.parse("/help statcalc");
		if (!this.runBroadcast()) return;

		let targets = target.split(' ');

		let lvlSet, natureSet, ivSet, evSet, baseSet, modSet, realSet = false;

		let pokemon;
		let useStat = '';

		let level = 100;
		let calcHP = false;
		let nature = 1.0;
		let iv = 31;
		let ev = 252;
		let baseStat = -1;
		let modifier = 0;
		let positiveMod = true;
		let realStat;

		for (const arg of targets) {
			let lowercase = arg.toLowerCase();

			if (!lvlSet) {
				if (lowercase === 'lc') {
					level = 5;
					lvlSet = true;
					continue;
				} else if (lowercase === 'vgc') {
					level = 50;
					lvlSet = true;
					continue;
				} else if (lowercase.startsWith('lv') || lowercase.startsWith('level')) {
					level = parseInt(arg.replace(/\D/g, ''));
					lvlSet = true;
					if (level < 1 || level > 9999) {
						return this.sendReplyBox('Invalid value for level: ' + level);
					}
					continue;
				}
			}

			if (!useStat) {
				switch (lowercase) {
				case 'hp':
				case 'hitpoints':
					calcHP = true;
					useStat = 'hp';
					continue;
				case 'atk':
				case 'attack':
					useStat = 'atk';
					continue;
				case 'def':
				case 'defense':
					useStat = 'def';
					continue;
				case 'spa':
					useStat = 'spa';
					continue;
				case 'spd':
				case 'sdef':
					useStat = 'spd';
					continue;
				case 'spe':
				case 'speed':
					useStat = 'spe';
					continue;
				}
			}

			if (!natureSet) {
				if (lowercase === 'boosting' || lowercase === 'positive') {
					nature = 1.1;
					natureSet = true;
					continue;
				} else if (lowercase === 'negative' || lowercase === 'inhibiting') {
					nature = 0.9;
					natureSet = true;
					continue;
				} else if (lowercase === 'neutral') {
					continue;
				}
			}

			if (!ivSet) {
				if (lowercase.endsWith('iv') || lowercase.endsWith('ivs')) {
					iv = parseInt(arg);
					ivSet = true;

					if (isNaN(iv)) {
						return this.sendReplyBox('Invalid value for IVs: ' + Chat.escapeHTML(arg));
					}

					continue;
				}
			}

			if (!evSet) {
				if (lowercase === 'invested' || lowercase === 'max') {
					evSet = true;
					if (lowercase === 'max' && !natureSet) {
						nature = 1.1;
						natureSet = true;
					}
				} else if (lowercase === 'uninvested') {
					ev = 0;
					evSet = true;
				} else if (lowercase.endsWith('ev') || lowercase.endsWith('evs') || lowercase.endsWith('+') || lowercase.endsWith('-')) {
					ev = parseInt(arg);
					evSet = true;

					if (isNaN(ev)) {
						return this.sendReplyBox('Invalid value for EVs: ' + Chat.escapeHTML(arg));
					}
					if (ev > 255 || ev < 0) {
						return this.sendReplyBox('The amount of EVs should be between 0 and 255.');
					}

					if (!natureSet) {
						if (arg.includes('+')) {
							nature = 1.1;
							natureSet = true;
						} else if (arg.includes('-')) {
							nature = 0.9;
							natureSet = true;
						}
					}

					continue;
				}
			}

			if (!modSet) {
				if (['band', 'scarf', 'specs'].includes(arg)) {
					modifier = 1;
					modSet = true;
				} else if (arg.charAt(0) === '+') {
					modifier = parseInt(arg.charAt(1));
					modSet = true;
				} else if (arg.charAt(0) === '-') {
					positiveMod = false;
					modifier = parseInt(arg.charAt(1));
					modSet = true;
				}
				if (isNaN(modifier)) {
					return this.sendReplyBox('Invalid value for modifier: ' + Chat.escapeHTML(modifier));
				}
				if (modifier > 6) {
					return this.sendReplyBox('Modifier should be a number between -6 and +6');
				}
				if (modSet) continue;
			}

			if (!pokemon) {
				let testPoke = Dex.getTemplate(arg);
				if (testPoke.baseStats) {
					pokemon = testPoke.baseStats;
					baseSet = true;
					continue;
				}
			}

			let tempStat = parseInt(arg);

			if (!realSet) {
				if (lowercase.endsWith('real')) {
					realStat = tempStat;
					realSet = true;

					if (isNaN(realStat)) {
						return this.sendReplyBox('Invalid value for target real stat: ' + Chat.escapeHTML(arg));
					}
					if (realStat < 0) {
						return this.sendReplyBox('The target real stat must be greater than 0.');
					}
					continue;
				}
			}

			if (!isNaN(tempStat) && !baseSet && tempStat > 0 && tempStat < 256) {
				baseStat = tempStat;
				baseSet = true;
			}
		}

		if (pokemon) {
			if (useStat) {
				baseStat = pokemon[useStat];
			} else {
				return this.sendReplyBox('No stat found.');
			}
		}

		if (realSet) {
			if (!baseSet) {
				if (calcHP) {
					baseStat = Math.ceil((100 * realStat - 10 - level * (ev / 4 + iv + 100)) / (2 * level));
				} else {
					if (!positiveMod) {
						realStat *= (2 + modifier) / 2;
					} else {
						realStat *= 2 / (2 + modifier);
					}

					baseStat = Math.ceil((100 * Math.ceil(realStat) - nature * (level * (ev / 4 + iv) + 500)) / (2 * level * nature));
				}
				if (baseStat < 0) {
					return this.sendReplyBox('No valid value for base stat possible with given parameters.');
				}
			} else if (!evSet) {
				if (calcHP) {
					ev = Math.ceil(100 * (realStat - 10) / level - 2 * (baseStat + 50));
				} else {
					if (!positiveMod) {
						realStat *= (2 + modifier) / 2;
					} else {
						realStat *= 2 / (2 + modifier);
					}

					ev = Math.ceil(-1 * (2 * (nature * (baseStat * level + 250) - 50 * Math.ceil(realStat))) / (level * nature));
				}
				ev -= 31;
				if (ev < 0) iv += ev;
				ev *= 4;
				if (iv < 0 || ev > 255) {
					return this.sendReplyBox('No valid EV/IV combination possible with given parameters. Maybe try a different nature?' + ev);
				}
			} else {
				return this.sendReplyBox('Too many parameters given; nothing to calculate.');
			}
		} else if (baseStat < 0) {
			return this.sendReplyBox('No valid value for base stat found.');
		}

		let output;

		if (calcHP) {
			output = (((iv + (2 * baseStat) + (ev / 4) + 100) * level) / 100) + 10;
		} else {
			output = Math.floor(nature * Math.floor((((iv + (2 * baseStat) + (ev / 4)) * level) / 100) + 5));
			if (positiveMod) {
				output *= (2 + modifier) / 2;
			} else {
				output *= 2 / (2 + modifier);
			}
		}
		return this.sendReplyBox('Base ' + baseStat + (calcHP ? ' HP ' : ' ') + 'at level ' + level + ' with ' + iv + ' IVs, ' + ev + (nature === 1.1 ? '+' : (nature === 0.9 ? '-' : '')) + ' EVs' + (modifier > 0 && !calcHP ? ' at ' + (positiveMod ? '+' : '-') + modifier : '') + ': <b>' + Math.floor(output) + '</b>.');
	},
	statcalchelp: [
		`/statcalc [level] [base stat] [IVs] [nature] [EVs] [modifier] (only base stat is required) - Calculates what the actual stat of a Pokémon is with the given parameters. For example, '/statcalc lv50 100 30iv positive 252ev scarf' calculates the speed of a base 100 scarfer with HP Ice in Battle Spot, and '/statcalc uninvested 90 neutral' calculates the attack of an uninvested Crobat.`,
		`!statcalc [level] [base stat] [IVs] [nature] [EVs] [modifier] (only base stat is required) - Shows this information to everyone.`,
		`Inputing 'hp' as an argument makes it use the formula for HP. Instead of giving nature, '+' and '-' can be appended to the EV amount (e.g. 252+ev) to signify a boosting or inhibiting nature.`,
		`An actual stat can be given in place of a base stat or EVs. In this case, the minumum base stat or EVs necessary to have that real stat with the given parameters will be determined. For example, '/statcalc 502real 252+ +1' calculates the minimum base speed necessary for a positive natured fully invested scarfer to outspeed`,
	],

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	'!uptime': true,
	uptime: function (target, room, user) {
		if (!this.can('broadcast')) return false;
		if (!this.runBroadcast()) return;
		let uptime = process.uptime();
		let uptimeText;
		if (uptime > 24 * 60 * 60) {
			let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			let uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = Chat.toDurationString(uptime * 1000);
		}
		this.sendReplyBox("Uptime: <b>" + uptimeText + "</b>");
	},

	'!servertime': true,
	servertime: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let servertime = new Date();
		this.sendReplyBox(`Server time: <b>${servertime.toLocaleString()}</b>`);
	},

	'!groups': true,
	groups: function (target, room, user) {
		if (!this.runBroadcast()) return;
		const showRoom = (target !== 'global');
		const showGlobal = (target !== 'room' && target !== 'rooms');
		this.sendReplyBox(
			(showRoom ? `<strong>Room ranks</strong><br />` +
			`+ <strong>Voice</strong> - They can use ! commands like !groups, and talk during moderated chat<br />` +
			`% <strong>Driver</strong> - The above, and they can mute and warn<br />` +
			`@ <strong>Moderator</strong> - The above, and they can room ban users<br />` +
			`* <strong>Bot</strong> - Like Moderator, but makes it clear that this user is a bot<br />` +
			`# <strong>Room Owner</strong> - They are leaders of the room and can almost totally control it<br />` : ``) +
			(showRoom && showGlobal ? `<br />` : ``) +
			(showGlobal ? `<strong>Global ranks</strong><br />` +
			`+ <strong>Global Voice</strong> - They can use ! commands like !groups, and talk during moderated chat<br />` +
			`% <strong>Global Driver</strong> - The above, and they can also lock users and check for alts<br />` +
			`@ <strong>Global Moderator</strong> - The above, and they can globally ban users<br />` +
			`* <strong>Global Bot</strong> - Like Moderator, but makes it clear that this user is a bot<br />` +
			`&amp; <strong>Global Leader</strong> - The above, and they can promote to global moderator and force ties<br />` +
			`~ <strong>Global Administrator</strong> -  They can do anything, like change what this message says` : ``)
		);
	},
	groupshelp: [
		`/groups - Explains what the symbols (like % and @) before people's names mean.`,
		`/groups [global|room] - Explains only global or room symbols.`,
		`!groups - Shows everyone that information. Requires: + % @ * # & ~`,
	],

	'!punishments': true,
	punishments: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`<strong>Room punishments</strong>:<br />` +
			`<strong>warn</strong> - Displays a popup with the rules.<br />` +
			`<strong>mute</strong> - Mutes a user (makes them unable to talk) for 7 minutes.<br />` +
			`<strong>hourmute</strong> - Mutes a user for 60 minutes.<br />` +
			`<strong>ban</strong> - Bans a user (makes them unable to join the room) for 2 days.<br />` +
			`<strong>blacklist</strong> - Bans a user for a year.<br />` +
			`<br />` +
			`<strong>Global punishments</strong>:<br />` +
			`<strong>lock</strong> - Locks a user (makes them unable to talk in any rooms or PM non-staff) for 2 days.<br />` +
			`<strong>weeklock</strong> - Locks a user for a week.<br />` +
			`<strong>namelock</strong> - Locks a user and prevents them from having a username for 2 days.<br />` +
			`<strong>globalban</strong> - Globally bans (makes them unable to connect and play games) for a week.`
		);
	},
	punishmentshelp: [
		`/punishments - Explains punishments.`,
		`!punishments - Show everyone that information. Requires: + % @ * # & ~`,
	],

	'!opensource': true,
	repo: 'opensource',
	repository: 'opensource',
	git: 'opensource',
	opensource: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`Pok&eacute;mon Showdown is open source:<br />` +
			`- Language: JavaScript (Node.js)<br />` +
			`- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master">What's new?</a><br />` +
			`- <a href="https://github.com/Zarel/Pokemon-Showdown">Server source code</a><br />` +
			`- <a href="https://github.com/Zarel/Pokemon-Showdown-Client">Client source code</a><br />` +
			`- <a href="https://github.com/Zarel/Pokemon-Showdown-Dex">Dex source code</a>`
		);
	},
	opensourcehelp: [
		`/opensource - Links to PS's source code repository.`,
		`!opensource - Show everyone that information. Requires: + % @ * # & ~`,
	],

	'!staff': true,
	staff: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<a href="https://www.smogon.com/sim/staff_list">Pok&eacute;mon Showdown Staff List</a>`);
	},

	'!forums': true,
	forums: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<a href="https://www.smogon.com/forums/forums/209/">Pok&eacute;mon Showdown Forums</a>`);
	},

	'!privacypolicy': true,
	privacypolicy: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`- We log PMs so you can report them - staff can't look at them without permission unless there's a law enforcement reason.<br />` +
			`- We log IPs to enforce bans and mutes.<br />` +
			`- We use cookies to save your login info and teams, and for Google Analytics and AdSense.<br />` +
			`- For more information, you can read our <a href="https://pokemonshowdown.com/privacy">full privacy policy.</a>`
		);
	},

	'!suggestions': true,
	suggestions: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<a href="https://www.smogon.com/forums/threads/3534365/">Make a suggestion for Pok&eacute;mon Showdown</a>`);
	},

	'!bugs': true,
	bugreport: 'bugs',
	bugs: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (room && room.battle) {
			this.sendReplyBox(`<center><button name="saveReplay"><i class="fa fa-upload"></i> Save Replay</button> &mdash; <a href="https://www.smogon.com/forums/threads/3520646/">Questions</a> &mdash; <a href="https://www.smogon.com/forums/threads/3634749/">Bug Reports</a></center>`);
		} else {
			this.sendReplyBox(
				`Have a replay showcasing a bug on Pok&eacute;mon Showdown?<br />` +
				`- <a href="https://www.smogon.com/forums/threads/3520646/">Questions</a><br />` +
				`- <a href="https://www.smogon.com/forums/threads/3634749/">Bug Reports</a> (ask in <a href="/help">Help</a> before posting in the thread if you're unsure)`
			);
		}
	},

	'!avatars': true,
	avatars: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`You can <button name="avatars">change your avatar</button> by clicking on it in the <button name="openOptions"><i class="fa fa-cog"></i> Options</button> menu in the upper right. Custom avatars are only obtainable by staff.`);
	},
	avatarshelp: [
		`/avatars - Explains how to change avatars.`,
		`!avatars - Show everyone that information. Requires: + % @ * # & ~`,
	],

	'!optionsbutton': true,
	optionbutton: 'optionsbutton',
	optionsbutton: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<button name="openOptions" class="button"><i style="font-size: 16px; vertical-align: -1px" class="fa fa-cog"></i> Options</button> (The Sound and Options buttons are at the top right, next to your username)`);
	},
	'!soundbutton': true,
	soundsbutton: 'soundbutton',
	volumebutton: 'soundbutton',
	soundbutton: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`<button name="openSounds" class="button"><i style="font-size: 16px; vertical-align: -1px" class="fa fa-volume-up"></i> Sound</button> (The Sound and Options buttons are at the top right, next to your username)`);
	},

	'!intro': true,
	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`New to competitive Pok&eacute;mon?<br />` +
			`- <a href="https://www.smogon.com/forums/threads/3496279/">Beginner's Guide to Pok&eacute;mon Showdown</a><br />` +
			`- <a href="https://www.smogon.com/dp/articles/intro_comp_pokemon">An introduction to competitive Pok&eacute;mon</a><br />` +
			`- <a href="https://www.smogon.com/bw/articles/bw_tiers">What do 'OU', 'UU', etc mean?</a><br />` +
			`- <a href="https://www.smogon.com/xyhub/tiers">What are the rules for each format? What is 'Sleep Clause'?</a>`
		);
	},
	introhelp: [
		`/intro - Provides an introduction to competitive Pok\u00e9mon.`,
		`!intro - Show everyone that information. Requires: + % @ * # & ~`,
	],

	'!smogintro': true,
	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`Welcome to Smogon's official simulator! The <a href="https://www.smogon.com/forums/forums/264">Smogon Info / Intro Hub</a> can help you get integrated into the community.<br />` +
			`- <a href="https://www.smogon.com/forums/threads/3526346">Useful Smogon Info</a><br />` +
			`- <a href="https://www.smogon.com/forums/threads/3498332">Tiering FAQ</a><br />`
		);
	},

	'!calc': true,
	calculator: 'calc',
	damagecalculator: 'calc',
	damagecalc: 'calc',
	calc: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`Pok&eacute;mon Showdown! damage calculator. (Courtesy of Honko)<br />` +
			`- <a href="https://pokemonshowdown.com/damagecalc/">Damage Calculator</a>`
		);
	},
	calchelp: [
		`/calc - Provides a link to a damage calculator`,
		`!calc - Shows everyone a link to a damage calculator. Requires: + % @ * # & ~`,
	],

	'!cap': true,
	capintro: 'cap',
	cap: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`An introduction to the Create-A-Pok&eacute;mon project:<br />` +
			`- <a href="https://www.smogon.com/cap/">CAP project website and description</a><br />` +
			`- <a href="https://www.smogon.com/forums/threads/48782/">What Pok&eacute;mon have been made?</a><br />` +
			`- <a href="https://www.smogon.com/forums/forums/311">Talk about the metagame here</a><br />` +
			`- <a href="https://www.smogon.com/forums/threads/3593752/">Sample SM CAP teams</a>`
		);
	},
	caphelp: [
		`/cap - Provides an introduction to the Create-A-Pok\u00e9mon project.`,
		`!cap - Show everyone that information. Requires: + % @ * # & ~`,
	],

	'!gennext': true,
	gennext: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			`- <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md">README: overview of NEXT</a><br />` +
			"Example replays:<br />" +
			`- <a href="https://replay.pokemonshowdown.com/gennextou-120689854">Zergo vs Mr Weegle Snarf</a><br />` +
			`- <a href="https://replay.pokemonshowdown.com/gennextou-130756055">NickMP vs Khalogie</a>`
		);
	},

	'!formathelp': true,
	banlists: 'formathelp',
	tier: 'formathelp',
	tiers: 'formathelp',
	formats: 'formathelp',
	tiershelp: 'formathelp',
	formatshelp: 'formathelp',
	viewbanlist: 'formathelp',
	formathelp: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!target) {
			return this.sendReplyBox(
				`- <a href="https://www.smogon.com/tiers/">Smogon Tiers</a><br />` +
				`- <a href="https://www.smogon.com/forums/threads/3498332/">Tiering FAQ</a><br />` +
				`- <a href="https://www.smogon.com/xyhub/tiers">The banlists for each tier</a><br />` +
				"<br /><em>Type /formatshelp <strong>[format|section]</strong> to get details about an available format or group of formats.</em>"
			);
		}

		const isOMSearch = (cmd === 'om' || cmd === 'othermetas');

		let targetId = toId(target);
		if (targetId === 'ladder') targetId = 'search';
		if (targetId === 'all') targetId = '';

		let formatList;
		let format = Dex.getFormat(targetId);
		if (format.effectType === 'Format' || format.effectType === 'ValidatorRule' || format.effectType === 'Rule') formatList = [targetId];
		if (!formatList) {
			formatList = Object.keys(Dex.formats);
		}

		// Filter formats and group by section
		let exactMatch = '';
		let sections = {};
		let totalMatches = 0;
		for (const mode of formatList) {
			let format = Dex.getFormat(mode);
			let sectionId = toId(format.section);
			let formatId = format.id;
			if (!/^gen\d+/.test(targetId)) formatId = formatId.replace(/^gen\d+/, ''); // skip generation prefix if it wasn't provided
			if (targetId && !format[targetId + 'Show'] && sectionId !== targetId && format.id === mode && !formatId.startsWith(targetId)) continue;
			if (isOMSearch && format.id.startsWith('gen') && ['ou', 'uu', 'ru', 'ubers', 'lc', 'customgame', 'doublescustomgame', 'gbusingles', 'gbudoubles'].includes(format.id.slice(4))) continue;
			if (isOMSearch && (format.id === 'gen5nu')) continue;
			totalMatches++;
			if (!sections[sectionId]) sections[sectionId] = {name: format.section, formats: []};
			sections[sectionId].formats.push(format.id);
			if (format.id !== targetId) continue;
			exactMatch = sectionId;
			break;
		}

		if (!totalMatches) return this.errorReply("No " + (target ? "matched " : "") + "formats found.");
		if (totalMatches === 1) {
			let rules = [];
			let rulesetHtml = '';
			let format = Dex.getFormat(Object.values(sections)[0].formats[0]);
			if (format.effectType === 'ValidatorRule' || format.effectType === 'Rule' || format.effectType === 'Format') {
				if (format.ruleset && format.ruleset.length) rules.push("<b>Ruleset</b> - " + Chat.escapeHTML(format.ruleset.join(", ")));
				if (format.removedRules && format.removedRules.length) rules.push("<b>Removed rules</b> - " + Chat.escapeHTML(format.removedRules.join(", ")));
				if (format.banlist && format.banlist.length) rules.push("<b>Bans</b> - " + Chat.escapeHTML(format.banlist.join(", ")));
				if (format.unbanlist && format.unbanlist.length) rules.push("<b>Unbans</b> - " + Chat.escapeHTML(format.unbanlist.join(", ")));
				if (format.restrictedStones && format.restrictedStones.length) rules.push("<b>Restricted Mega Stones</b> - " + Chat.escapeHTML(format.restrictedStones.join(", ")));
				if (format.cannotMega && format.cannotMega.length) rules.push("<b>Can't Mega Evolve non-natively</b> - " + Chat.escapeHTML(format.cannotMega.join(", ")));
				if (format.restrictedAbilities && format.restrictedAbilities.length) rules.push("<b>Restricted abilities</b> - " + Chat.escapeHTML(format.restrictedAbilities.join(", ")));
				if (format.restrictedMoves && format.restrictedMoves.length) rules.push("<b>Restricted moves</b> - " + Chat.escapeHTML(format.restrictedMoves.join(", ")));
				if (rules.length > 0) {
					rulesetHtml = `<details><summary>Banlist/Ruleset</summary>${rules.join("<br />")}</details>`;
				} else {
					rulesetHtml = "No ruleset found for " + format.name;
				}
			}
			let formatType = (format.gameType || "singles");
			formatType = formatType.charAt(0).toUpperCase() + formatType.slice(1).toLowerCase();
			if (!format.desc && !format.threads) {
				if (format.effectType === 'Format') {
					return this.sendReplyBox("No description found for this " + formatType + " " + format.section + " format." + "<br />" + rulesetHtml);
				} else {
					return this.sendReplyBox("No description found for this rule." + "<br />" + rulesetHtml);
				}
			}
			let descHtml = format.desc ? [format.desc] : [];
			if (format.threads) descHtml = descHtml.concat(format.threads);
			return this.sendReplyBox(descHtml.join("<br />") + "<br />" + rulesetHtml);
		}

		let tableStyle = `border:1px solid gray; border-collapse:collapse`;

		if (this.broadcasting) {
			tableStyle += `; display:inline-block; max-height:240px;" class="scrollable`;
		}

		// Build tables
		let buf = [`<table style="${tableStyle}" cellspacing="0" cellpadding="5">`];
		for (let sectionId in sections) {
			if (exactMatch && sectionId !== exactMatch) continue;
			buf.push(Chat.html`<th style="border:1px solid gray" colspan="2">${sections[sectionId].name}</th>`);
			for (const section of sections[sectionId].formats) {
				let format = Dex.getFormat(section);
				let nameHTML = Chat.escapeHTML(format.name);
				let desc = format.desc ? [format.desc] : [];
				if (format.threads) desc = desc.concat(format.threads);
				let descHTML = desc.length ? desc.join("<br />") : "&mdash;";
				buf.push(`<tr><td style="border:1px solid gray">${nameHTML}</td><td style="border: 1px solid gray; margin-left:10px">${descHTML}</td></tr>`);
			}
		}
		buf.push(`</table>`);
		return this.sendReply("|raw|" + buf.join("") + "");
	},

	'!roomhelp': true,
	roomhelp: function (target, room, user) {
		if (!this.canBroadcast(false, '!htmlbox')) return;
		if (this.broadcastMessage && !this.can('declare', null, room)) return false;

		if (!this.runBroadcast(false, '!htmlbox')) return;
		this.sendReplyBox(
			`<strong>Room drivers (%)</strong> can use:<br />` +
			`- /warn OR /k <em>username</em>: warn a user and show the Pok&eacute;mon Showdown rules<br />` +
			`- /mute OR /m <em>username</em>: 7 minute mute<br />` +
			`- /hourmute OR /hm <em>username</em>: 60 minute mute<br />` +
			`- /unmute <em>username</em>: unmute<br />` +
			`- /announce OR /wall <em>message</em>: make an announcement<br />` +
			`- /modlog <em>username</em>: search the moderator log of the room<br />` +
			`- /modnote <em>note</em>: add a moderator note that can be read through modlog<br />` +
			`<br />` +
			`<strong>Room moderators (@)</strong> can also use:<br />` +
			`- /roomban OR /rb <em>username</em>: ban user from the room<br />` +
			`- /roomunban <em>username</em>: unban user from the room<br />` +
			`- /roomvoice <em>username</em>: appoint a room voice<br />` +
			`- /roomdevoice <em>username</em>: remove a room voice<br />` +
			`- /staffintro <em>intro</em>: set the staff introduction that will be displayed for all staff joining the room<br />` +
			`- /roomsettings: change a variety of room settings, namely modchat<br />` +
			`<br />` +
			`<strong>Room owners (#)</strong> can also use:<br />` +
			`- /roomintro <em>intro</em>: set the room introduction that will be displayed for all users joining the room<br />` +
			`- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />` +
			`- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />` +
			`- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />` +
			`- /roomdeauth <em>username</em>: remove all room auth from a user<br />` +
			`- /declare <em>message</em>: make a large blue declaration to the room<br />` +
			`- !htmlbox <em>HTML code</em>: broadcast a box of HTML code to the room<br />` +
			`- !showimage <em>[url], [width], [height]</em>: show an image to the room<br />` +
			`- /roomsettings: change a variety of room settings, including modchat, capsfilter, etc<br />` +
			`<br />` +
			`More detailed help can be found in the <a href="https://www.smogon.com/forums/posts/6774654/">roomauth guide</a><br />` +
			`<br />` +
			`Tournament Help:<br />` +
			`- /tour create <em>format</em>, elimination: create a new single elimination tournament in the current room.<br />` +
			`- /tour create <em>format</em>, roundrobin: create a new round robin tournament in the current room.<br />` +
			`- /tour end: forcibly end the tournament in the current room<br />` +
			`- /tour start: start the tournament in the current room<br />` +
			`- /tour banlist [pokemon], [talent], [...]: ban moves, abilities, Pokémon or items from being used in a tournament (it must be created first)<br />` +
			`<br />` +
			`More detailed help can be found in the <a href="https://www.smogon.com/forums/posts/6777489/">tournaments guide</a><br />` +
			`</div>`
		);
	},

	'!restarthelp': true,
	restarthelp: function (target, room, user) {
		if (!Rooms.global.lockdown && !this.can('lockdown')) return false;
		if (!this.runBroadcast()) return;
		this.sendReplyBox(
			`The server is restarting. Things to know:<br />` +
			`- We wait a few minutes before restarting so people can finish up their battles<br />` +
			`- The restart itself will take around 0.6 seconds<br />` +
			`- Your ladder ranking and teams will not change<br />` +
			`- We are restarting to update Pok&eacute;mon Showdown to a newer version`
		);
	},

	'!processes': true,
	processes: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		let buf = `<strong>${process.pid}</strong> - Main<br />`;
		for (const worker of Sockets.workers.values()) {
			buf += `<strong>${worker.pid || worker.process.pid}</strong> - Sockets ${worker.id}<br />`;
		}

		const processManagers = require('../lib/process-manager').processManagers;
		for (const manager of processManagers) {
			for (const [i, process] of manager.processes.entries()) {
				buf += `<strong>${process.process.pid}</strong> - ${manager.basename} ${i} (load ${process.load})<br />`;
			}
			for (const [i, process] of manager.releasingProcesses.entries()) {
				buf += `<strong>${process.process.pid}</strong> - PENDING RELEASE ${manager.basename} ${i} (load ${process.load})<br />`;
			}
		}

		this.sendReplyBox(buf);
	},

	'!rules': true,
	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`Please follow the rules:<br />` +
				(room && room.rulesLink ? Chat.html`- <a href="${room.rulesLink}">${room.title} room rules</a><br />` : ``) +
				`- <a href="https://pokemonshowdown.com/rules">${room && room.rulesLink ? "Global rules" : "Rules"}</a>`
			);
			return;
		}
		if (!room) {
			return this.errorReply(`This is not a room you can set the rules of.`);
		}
		if (!this.can('editroom', null, room)) return;
		if (target.length > 150) {
			return this.errorReply(`Error: Room rules link is too long (must be under 150 characters). You can use a URL shortener to shorten the link.`);
		}

		target = target.trim();

		if (target === 'delete' || target === 'remove') {
			if (!room.rulesLink) return this.errorReply(`This room does not have rules set to remove.`);
			delete room.rulesLink;
			this.privateModAction(`(${user.name} has removed the room rules link.)`);
			this.modlog('RULES', null, `removed room rules link`);
		} else {
			room.rulesLink = target;
			this.privateModAction(`(${user.name} changed the room rules link to: ${target})`);
			this.modlog('RULES', null, `changed link to: ${target}`);
		}

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},
	ruleshelp: [
		`/rules - Show links to room rules and global rules.`,
		`!rules - Show everyone links to room rules and global rules. Requires: + % @ * # & ~`,
		`/rules [url] - Change the room rules URL. Requires: # & ~`,
		`/rules remove - Removes a room rules URL. Requires: # & ~`,
	],

	'!faq': true,
	faq: function (target, room, user) {
		if (!this.runBroadcast()) return;
		target = target.toLowerCase();
		let showAll = target === 'all';
		if (showAll && this.broadcasting) {
			return this.sendReplyBox("You cannot broadcast all FAQs at once.");
		}

		let buffer = [];
		if (showAll || target === 'staff') {
			buffer.push(`<a href="https://www.smogon.com/forums/posts/6774482/">Staff FAQ</a>`);
		}
		if (showAll || target === 'autoconfirmed' || target === 'ac') {
			buffer.push(`A user is autoconfirmed when they have won at least one rated battle and have been registered for one week or longer.`);
		}
		if (showAll || target === 'coil') {
			buffer.push(`<a href="https://www.smogon.com/forums/threads/3508013/">What is COIL?</a>`);
		}
		if (showAll || target === 'tiering' || target === 'tiers' || target === 'tier') {
			buffer.push(`<a href="https://www.smogon.com/ingame/battle/tiering-faq">Tiering FAQ</a>`);
		}
		if (showAll || target === 'badge' || target === 'badges') {
			buffer.push(`<a href="https://www.smogon.com/badge_faq">Badge FAQ</a>`);
		}
		if (showAll || !buffer.length) {
			buffer.unshift(`<a href="https://www.smogon.com/forums/posts/6774128/">Frequently Asked Questions</a>`);
		}
		this.sendReplyBox(buffer.join(`<br />`));
	},
	faqhelp: [
		`/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.`,
		`!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ * # & ~`,
	],

	'!smogdex': true,
	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!target) return this.parse('/help smogdex');
		if (!this.runBroadcast()) return;

		let targets = target.split(',');
		let pokemon = Dex.getTemplate(targets[0]);
		let item = Dex.getItem(targets[0]);
		let move = Dex.getMove(targets[0]);
		let ability = Dex.getAbility(targets[0]);
		let format = Dex.getFormat(targets[0]);
		let atLeastOne = false;
		let generation = (targets[1] || 'sm').trim().toLowerCase();
		let genNumber = 7;
		let extraFormat = Dex.getFormat(targets[2]);

		if (['7', 'gen7', 'seven', 'sm', 'sumo', 'usm', 'usum'].includes(generation)) {
			generation = 'sm';
		} else if (['6', 'gen6', 'oras', 'six', 'xy'].includes(generation)) {
			generation = 'xy';
			genNumber = 6;
		} else if (['5', 'b2w2', 'bw', 'bw2', 'five', 'gen5'].includes(generation)) {
			generation = 'bw';
			genNumber = 5;
		} else if (['4', 'dp', 'dpp', 'four', 'gen4', 'hgss'].includes(generation)) {
			generation = 'dp';
			genNumber = 4;
		} else if (['3', 'adv', 'frlg', 'gen3', 'rs', 'rse', 'three'].includes(generation)) {
			generation = 'rs';
			genNumber = 3;
		} else if (['2', 'gen2', 'gs', 'gsc', 'two'].includes(generation)) {
			generation = 'gs';
			genNumber = 2;
		} else if (['1', 'gen1', 'one', 'rb', 'rby', 'rgy'].includes(generation)) {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'sm';
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox(`${pokemon.name} did not exist in ${generation.toUpperCase()}!`);
			}
			if (pokemon.tier === 'CAP') {
				generation = 'cap';
				this.errorReply(`CAP is not currently supported by Smogon Strategic Pokedex.`);
			}

			if ((pokemon.battleOnly && pokemon.baseSpecies !== 'Greninja') || pokemon.baseSpecies === 'Keldeo' || pokemon.baseSpecies === 'Genesect') {
				pokemon = Dex.getTemplate(pokemon.baseSpecies);
			}

			let formatName = extraFormat.name;
			let formatId = extraFormat.id;
			if (formatName.startsWith('[Gen ')) {
				formatName = formatName.replace('[Gen ' + formatName[formatName.indexOf('[') + 5] + '] ', '');
				formatId = toId(formatName);
			}
			if (formatId === 'battlespotdoubles') {
				formatId = 'battle_spot_doubles';
			} else if (formatId === 'battlespottriples') {
				formatId = 'battle_spot_triples';
				if (genNumber > 6) {
					return this.sendReplyBox(`Triples formats are not an available format in Pok&eacute;mon generation ${generation.toUpperCase()}.`);
				}
			} else if (formatId === 'doublesou') {
				formatId = 'doubles';
			} else if (formatId === 'balancedhackmons') {
				formatId = 'bh';
			} else if (formatId === 'battlespotsingles') {
				formatId = 'battle_spot_singles';
			} else if (formatId === 'ubers') {
				formatId = 'uber';
			} else if (formatId.includes('vgc')) {
				formatId = 'vgc' + formatId.slice(-2);
				formatName = 'VGC20' + formatId.slice(-2);
			} else if (extraFormat.effectType !== 'Format') {
				formatName = formatId = '';
			}
			let speciesid = pokemon.speciesid;
			// Special case for Meowstic-M
			if (speciesid === 'meowstic') speciesid = 'meowsticm';
			if (pokemon.tier === 'CAP') {
				this.sendReplyBox(`<a href="https://www.smogon.com/cap/pokemon/strategies/${speciesid}">${generation.toUpperCase()} ${Chat.escapeHTML(formatName)} ${pokemon.name} analysis preview</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a> <a href="http://smogon.com/cap/">CAP Project</a>`);
			} else {
				this.sendReplyBox(`<a href="https://www.smogon.com/dex/${generation}/pokemon/${speciesid}${(formatId ? '/' + formatId : '')}">${generation.toUpperCase()} ${Chat.escapeHTML(formatName)} ${pokemon.name} analysis</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a>`);
			}
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			this.sendReplyBox(`<a href="https://www.smogon.com/dex/${generation}/items/${item.id}">${generation.toUpperCase()} ${item.name} item analysis</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a>`);
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			this.sendReplyBox(`<a href="https://www.smogon.com/dex/${generation}/abilities/${ability.id}">${generation.toUpperCase()} ${ability.name} ability analysis</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a>`);
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			this.sendReplyBox(`<a href="https://www.smogon.com/dex/${generation}/moves/${toId(move.name)}">${generation.toUpperCase()} ${move.name} move analysis</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a>`);
		}

		// Format
		if (format.id) {
			let formatName = format.name;
			let formatId = format.id;
			if (formatId === 'battlespotdoubles') {
				formatId = 'battle_spot_doubles';
			} else if (formatId === 'battlespottriples') {
				formatId = 'battle_spot_triples';
				if (genNumber > 6) {
					return this.sendReplyBox(`Triples formats are not an available format in Pok&eacute;mon generation ${generation.toUpperCase()}.`);
				}
			} else if (formatId === 'doublesou') {
				formatId = 'doubles';
			} else if (formatId === 'balancedhackmons') {
				formatId = 'bh';
			} else if (formatId === 'battlespotsingles') {
				formatId = 'battle_spot_singles';
			} else if (formatId === 'ubers') {
				formatId = 'uber';
			} else if (formatId.includes('vgc')) {
				formatId = 'vgc' + formatId.slice(-2);
				formatName = 'VGC20' + formatId.slice(-2);
			} else if (format.effectType !== 'Format') {
				formatName = formatId = '';
			}
			if (formatName) {
				atLeastOne = true;
				this.sendReplyBox(`<a href="https://www.smogon.com/dex/${generation}/formats/${formatId}">${generation.toUpperCase()} ${Chat.escapeHTML(formatName)} format analysis</a>, brought to you by <a href="https://www.smogon.com">Smogon University</a>`);
			}
		}

		if (!atLeastOne) {
			return this.sendReplyBox(`Pok&eacute;mon, item, move, ability, or format not found for generation ${generation.toUpperCase()}.`);
		}
	},
	smogdexhelp: [
		`/analysis [pokemon], [generation], [format] - Links to the Smogon University analysis for this Pok\u00e9mon in the given generation.`,
		`!analysis [pokemon], [generation], [format] - Shows everyone this link. Requires: + % @ * # & ~`,
	],

	'!veekun': true,
	veekun: function (target, broadcast, user) {
		if (!target) return this.parse('/help veekun');
		if (!this.runBroadcast()) return;

		let baseLink = 'http://veekun.com/dex/';

		let pokemon = Dex.getTemplate(target);
		let item = Dex.getItem(target);
		let move = Dex.getMove(target);
		let ability = Dex.getAbility(target);
		let nature = Dex.getNature(target);
		let atLeastOne = false;

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (pokemon.isNonstandard) return this.errorReply(`${pokemon.species} is not a real Pok\u00e9mon.`);

			let baseSpecies = pokemon.baseSpecies || pokemon.species;
			let forme = pokemon.forme;

			// Showdown and Veekun have different names for various formes
			if (baseSpecies === 'Meowstic' && forme === 'F') forme = 'Female';
			if (baseSpecies === 'Zygarde' && forme === '10%') forme = '10';
			if (baseSpecies === 'Necrozma' && !Dex.getTemplate(baseSpecies + forme).battleOnly) forme = forme.substr(0, 4);
			if (baseSpecies === 'Pikachu' && Dex.getTemplate(baseSpecies + forme).gen === 7) forme += '-Cap';
			if (forme.endsWith('Totem')) {
				if (baseSpecies === 'Raticate') forme = 'Totem-Alola';
				if (baseSpecies === 'Marowak') forme = 'Totem';
				if (baseSpecies === 'Mimikyu') forme += forme === 'Busted-Totem' ? '-Busted' : '-Disguised';
			}

			let link = baseLink + 'pokemon/' + baseSpecies.toLowerCase();
			if (forme) {
				if (baseSpecies === 'Arceus' || baseSpecies === 'Silvally') link += '/flavor';
				link += '?form=' + forme.toLowerCase();
			}

			this.sendReplyBox(`<a href="${link}">${pokemon.species} description</a> by Veekun`);
		}

		// Item
		if (item.exists) {
			atLeastOne = true;
			if (item.isNonstandard) return this.errorReply(`${item.name} is not a real item.`);
			let link = baseLink + 'items/' + item.name.toLowerCase();
			this.sendReplyBox(`<a href="${link}">${item.name} item description</a> by Veekun`);
		}

		// Ability
		if (ability.exists) {
			atLeastOne = true;
			if (ability.isNonstandard) return this.errorReply(`${ability.name} is not a real ability.`);
			let link = baseLink + 'abilities/' + ability.name.toLowerCase();
			this.sendReplyBox(`<a href="${link}">${ability.name} ability description</a> by Veekun`);
		}

		// Move
		if (move.exists) {
			atLeastOne = true;
			if (move.isNonstandard) return this.errorReply(`${move.name} is not a real move.`);
			let link = baseLink + 'moves/' + move.name.toLowerCase();
			this.sendReplyBox(`<a href="${link}">${move.name} move description</a> by Veekun`);
		}

		// Nature
		if (nature.exists) {
			atLeastOne = true;
			let link = baseLink + 'natures/' + nature.name.toLowerCase();
			this.sendReplyBox(`<a href="${link}">${nature.name} nature description</a> by Veekun`);
		}

		if (!atLeastOne) {
			return this.sendReplyBox(`Pok&eacute;mon, item, move, ability, or nature not found.`);
		}
	},
	veekunhelp: [
		`/veekun [pokemon] - Links to Veekun website for this pokemon/item/move/ability/nature.`,
		`!veekun [pokemon] - Shows everyone this link. Requires: + % @ * # & ~`,
	],

	'!register': true,
	register: function () {
		if (!this.runBroadcast()) return;
		this.sendReplyBox(`You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="fa fa-cog"></i> Options</button> menu in the upper right.`);
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	potd: function (target, room, user) {
		if (!this.can('potd')) return false;

		Config.potd = target;
		// TODO: support eval in new PM
		Rooms.PM.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw(`<div class="broadcast-blue"><b>The Pok&eacute;mon of the Day is now ${target}!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>`);
			this.modlog('POTD', null, target);
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw(`<div class="broadcast-blue"><b>The Pok&eacute;mon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>`);
			this.modlog('POTD', null, 'removed');
		}
	},

	'!dice': true,
	roll: 'dice',
	dice: function (target, room, user) {
		if (!target || target.match(/[^\d\sdHL+-]/i)) return this.parse('/help dice');
		if (!this.runBroadcast(true)) return;

		// ~30 is widely regarded as the sample size required for sum to be a Gaussian distribution.
		// This also sets a computation time constraint for safety.
		let maxDice = 40;

		let diceQuantity = 1;
		let diceDataStart = target.indexOf('d');
		if (diceDataStart >= 0) {
			if (diceDataStart) diceQuantity = Number(target.slice(0, diceDataStart));
			target = target.slice(diceDataStart + 1);
			if (!Number.isInteger(diceQuantity) || diceQuantity <= 0 || diceQuantity > maxDice) return this.sendReply(`The amount of dice rolled should be a natural number up to ${maxDice}.`);
		}
		let offset = 0;
		let removeOutlier = 0;

		let modifierData = target.match(/[+-]/);
		if (modifierData) {
			switch (target.slice(modifierData.index).trim().toLowerCase()) {
			case '-l':
				removeOutlier = -1;
				break;
			case '-h':
				removeOutlier = +1;
				break;
			default:
				offset = Number(target.slice(modifierData.index));
				if (isNaN(offset)) return this.parse('/help dice');
				if (!Number.isSafeInteger(offset)) return this.errorReply(`The specified offset must be an integer up to ${Number.MAX_SAFE_INTEGER}.`);
			}
			if (removeOutlier && diceQuantity <= 1) return this.errorReply(`More than one dice should be rolled before removing outliers.`);
			target = target.slice(0, modifierData.index);
		}

		let diceFaces = 6;
		if (target.length) {
			diceFaces = Number(target);
			if (!Number.isSafeInteger(diceFaces) || diceFaces <= 0) {
				return this.errorReply(`Rolled dice must have a natural amount of faces up to ${Number.MAX_SAFE_INTEGER}.`);
			}
		}

		if (diceQuantity > 1) {
			// Make sure that we can deal with high rolls
			if (!Number.isSafeInteger(offset < 0 ? diceQuantity * diceFaces : diceQuantity * diceFaces + offset)) {
				return this.errorReply(`The maximum sum of rolled dice must be lower or equal than ${Number.MAX_SAFE_INTEGER}.`);
			}
		}

		let maxRoll = 0;
		let minRoll = Number.MAX_SAFE_INTEGER;

		let trackRolls = diceQuantity * (('' + diceFaces).length + 1) <= 60;
		let rolls = [];
		let rollSum = 0;

		for (let i = 0; i < diceQuantity; ++i) {
			let curRoll = Math.floor(Math.random() * diceFaces) + 1;
			rollSum += curRoll;
			if (curRoll > maxRoll) maxRoll = curRoll;
			if (curRoll < minRoll) minRoll = curRoll;
			if (trackRolls) rolls.push(curRoll);
		}

		// Apply modifiers

		if (removeOutlier > 0) {
			rollSum -= maxRoll;
		} else if (removeOutlier < 0) {
			rollSum -= minRoll;
		}
		if (offset) rollSum += offset;

		// Reply with relevant information

		let offsetFragment = "";
		if (offset) offsetFragment += (offset > 0 ? " + " + offset : offset);

		if (diceQuantity === 1) return this.sendReplyBox(`Rolling (1 to ${diceFaces})${offsetFragment}: ${rollSum}`);

		const outlierFragment = removeOutlier ? ` except ${removeOutlier > 0 ? "highest" : "lowest"}` : ``;
		const rollsFragment = trackRolls ? ": " + rolls.join(", ") : "";
		return this.sendReplyBox(
			`${diceQuantity} rolls (1 to ${diceFaces})${rollsFragment}<br />` +
			`Sum${offsetFragment}${outlierFragment}: ${rollSum}`
		);
	},
	dicehelp: [
		`/dice [max number] - Randomly picks a number between 1 and the number you choose.`,
		`/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.`,
		`/dice [number of dice]d[number of sides][+/-][offset] - Simulates rolling a number of dice and adding an offset to the sum, e.g., /dice 2d6+10: two standard dice are rolled; the result lies between 12 and 22.`,
		`/dice [number of dice]d[number of sides]-[H/L] - Simulates rolling a number of dice with removal of extreme values, e.g., /dice 3d8-L: rolls three 8-sided dice; the result ignores the lowest value.`,
	],

	'!pickrandom': true,
	pr: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return false;
		target = this.message.slice(this.message.indexOf(cmd) + cmd.length + 1); // Not very elegant, but stops filter evasion using !pick.
		let options = target.split(',');
		if (options.length < 2) return this.parse('/help pick');
		if (!this.runBroadcast(true)) return false;
		const pickedOption = options[Math.floor(Math.random() * options.length)].trim();
		return this.sendReplyBox(Chat.html`<em>We randomly picked:</em> ${pickedOption}`);
	},
	pickrandomhelp: [`/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.`],

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('declare', null, room)) return false;
		if (!this.runBroadcast()) return;
		if (this.room.isPersonal && !this.user.can('announce')) {
			return this.errorReply(`Images are not allowed in personal rooms.`);
		}

		let targets = target.split(',');
		if (targets.length !== 3) {
			// Width and height are required because most browsers insert the
			// <img> element before width and height are known, and when the
			// image is loaded, this changes the height of the chat area, which
			// messes up autoscrolling.
			return this.parse('/help showimage');
		}

		let image = targets[0].trim();
		if (!image) return this.errorReply(`No image URL was provided!`);
		image = this.canEmbedURI(image);

		if (!image) return false;

		let width = targets[1].trim();
		if (!width) return this.errorReply(`No width for the image was provided!`);
		if (!isNaN(width)) width += `px`;

		let height = targets[2].trim();
		if (!height) return this.errorReply(`No height for the image was provided!`);
		if (!isNaN(height)) height += `px`;

		let unitRegex = /^\d+(?:p[xtc]|%|[ecm]m|ex|in)$/;
		if (!unitRegex.test(width)) {
			return this.errorReply(`"${width}" is not a valid width value!`);
		}
		if (!unitRegex.test(height)) {
			return this.errorReply(`"${height}" is not a valid height value!`);
		}

		this.sendReply(Chat.html`|raw|<img src="${image}" style="width: ${width}; height: ${height}" />`);
	},
	showimagehelp: [`/showimage [url], [width], [height] - Show an image. Any CSS units may be used for the width or height (default: px). Requires: # & ~`],

	htmlbox: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help htmlbox');
		target = this.canHTML(target);
		if (!target) return;

		if (!this.canBroadcast(true, '!htmlbox')) return;
		if (this.broadcastMessage && !this.can('declare', null, room)) return false;

		if (!this.runBroadcast(true, '!htmlbox')) return;

		this.sendReplyBox(target);
	},
	addhtmlbox: function (target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help htmlbox');
		if (!this.canTalk()) return;
		target = this.canHTML(target);
		if (!target) return;
		if (!this.can('addhtml', null, room)) return;

		if (!user.can('addhtml')) {
			target += Chat.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		this.addBox(target);
	},
	htmlboxhelp: [
		`/htmlbox [message] - Displays a message, parsing HTML code contained.`,
		`!htmlbox [message] - Shows everyone a message, parsing HTML code contained. Requires: ~ & #`,
	],
	changeuhtml: 'adduhtml',
	adduhtml: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ' + cmd);
		if (!this.canTalk()) return;

		let [name, html] = this.splitOne(target);
		name = toId(name);
		html = this.canHTML(html);
		if (!html) return;
		if (!this.can('addhtml', null, room)) return;

		if (!user.can('addhtml')) {
			html += Chat.html`<div style="float:right;color:#888;font-size:8pt">[${user.name}]</div><div style="clear:both"></div>`;
		}

		this.add(`|uhtml${(cmd === 'changeuhtml' ? 'change' : '')}|${name}|${html}`);
	},
	adduhtmlhelp: [
		`/adduhtml [name], [message] - Shows everyone a message that can change, parsing HTML code contained.`,
	],
	changeuhtmlhelp: [
		`/changeuhtml [name], [message] - Changes a message previously shown with /adduhtml`,
	],
};

exports.commands = commands;

process.nextTick(() => {
	Dex.includeData();
});
