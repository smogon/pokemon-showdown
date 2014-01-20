/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois
 *
 * But to actually define a command, it's a function:
 *   birkal: function(target, room, user) 
 *     this.sendReply("It's not funny anymore.");
 *   },
 *
 * Commands are actually passed five parameters:
 *   function(target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will set it up so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message)
 *   Checks to see if the user can say the message. In addition to
 *   running the checks from this.canTalk(), it also checks to see if
 *   the message has any banned words or is too long. Returns the
 *   filtered message, or a falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *
 * this.splitTarget(target)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	getip: 'whois',
	rooms: 'whois',
	altcheck: 'whois',
	alt: 'whois',
	alts: 'whois',
	getalts: 'whois',
	whois: function(target, room, user) {
		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		this.sendReply('User: '+targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts();
			var output = '';
			for (var i in targetUser.prevNames) {
				if (output) output += ", ";
				output += targetUser.prevNames[i];
			}
			if (output) this.sendReply('Previous names: '+output);

			for (var j=0; j<alts.length; j++) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply('Alt: '+targetAlt.name);
				output = '';
				for (var i in targetAlt.prevNames) {
					if (output) output += ", ";
					output += targetAlt.prevNames[i];
				}
				if (output) this.sendReply('Previous names: '+output);
			}
		}
		if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
			this.sendReply('Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
		}
		if (targetUser.isSysop) {
			this.sendReply('(Pok\xE9mon Showdown System Operator)');
		}
		if (targetUser.frostDev) {
			this.sendReply('(Frost Development Staff)');
		}
		if (targetUser.monoType != '') {
			var type = targetUser.monoType.toLowerCase();
			var hex = '';
			switch (type) {
				case 'normal':
				hex = 'A8A77A';
				break;
				case 'fire':
				hex = 'FF0000';
				break;
				case 'water':
				hex = '6390F0';
				break;
				case 'electric':
				hex = 'F7D02C';
				break;
				case 'grass':
				hex = '7AC74C';
				break;
				case 'ice':
				hex = '96D9D6';
				break;
				case 'fighting':
				hex = 'C22E28';
				break;
				case 'poison':
				hex = 'A33EA1';
				break;
				case 'ground':
				hex = 'E2BF65';
				break;
				case 'flying':
				hex = 'A98FF3';
				break;
				case 'psychic':
				hex = 'F95587';
				break;
				case 'bug':
				hex = 'A6B91A';
				break;
				case 'rock':
				hex = 'B6A136';
				break;
				case 'ghost':
				hex = '735797';
				break;
				case 'dragon':
				hex = '6F35FC';
				break;
				case 'dark':
				hex = '705746';
				break;
				case 'steel':
				hex = 'B7B7CE';
				break;
				case 'fairy':
				hex = 'EE99AC';
				break;
				default:
				hex = '000000';
				break;
			}
			this.sendReply('|raw|<b><font color="#'+hex+'">'+targetUser.monoType+'</font></b> type');
		}
		if (targetUser.customClient) {
			this.sendReply('|raw|' + targetUser.name + ' is using the <a href="http://frost-server.no-ip.org"><i>custom client!</i></a>');
		}
		if (!targetUser.authenticated) {
			this.sendReply('(Unregistered)');
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply('IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
		}
		var output = 'In rooms: ';
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += ' | ';
			first = false;

			output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
		}
		this.sendReply('|raw|'+output);
		if (!targetUser.connected || targetUser.isAway) {
			this.sendReply('|raw|This user is ' + ((!targetUser.connected) ? '<font color = "red">offline</font>.' : '<font color = "orange">away</font>.'));
		}
		if (targetUser.canCustomSymbol || targetUser.canCustomAvatar || targetUser.canAnimatedAvatar || targetUser.canChatRoom || targetUser.canTrainerCard || targetUser.canFixItem || targetUser.canDecAdvertise) {
			var i = '';
			if (targetUser.canCustomSymbol) i += ' Custom Symbol';
			if (targetUser.canCustomAvatar) i += ' Custom Avatar';
			if (targetUser.canAnimatedAvatar) i += ' Animated Avatar';
			if (targetUser.canChatRoom) i += ' Chat Room';
			if (targetUser.canTrainerCard) i += ' Trainer Card';
			if (targetUser.canPOTD) i += ' Alter card/avatar';
			if (targetUser.canDecAdvertise) i += ' Declare Advertise.';
			this.sendReply('Eligible for: ' + i);
		}
	},

	ipsearch: function(target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP "+target+":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected?"+":"-")+" "+user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Additional Commands
	 *********************************************************/

	getrandom: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},

	poke: function(target, room, user){
		if(!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me pokes ' + target);
	},
	
	twerk: function(target, room, user){
		return this.parse('/me twerks');
	},
	

	slap: function(target, room, user){
		if(!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me slaps ' + target + ' in the face with a slipper');
	},
	
	twerkon: function(target, room, user){
		if(!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me twerks on ' + target + '.');
	},
	
	s: function(target, room, user){
		if(!target) return this.sendReply('/spank needs a target.');
		return this.parse('/me spanks ' + target + '!');
	},
	
	tierpoll: 'tiervote',
	tiervote: function(target, room, user){
		return this.parse('/poll Tournament Tier?, OU, UU, Ubers, LC, LC UU, Doubles, Christmas Charade, Sky Battles, CAP, cc, cc1v1, hackmons, inverse battle, OU Monotype, Gen51v1, Gen5OU, Gen5UU, Gen5RU, Gen5NU, Gen5Ubers, Gen5Perseverance, Gen5LC, Gen5RandomBattle');
	},
	
	gurl: function(target, room, user){
		if(!target) return this.sendReply('/sass needs a target.');
		return this.parse('/me sasses ' + target + '!');
	},

	hallowme: function(target, room, user){
		var halloween = false;
		if (user.hasCustomSymbol) return this.sendReply('You currently have a custom symbol, use /resetsymbol if you would like to use this command again.');
		if (!halloween) return this.sendReply('It\s not Halloween anymore!');
		var symbol = '';
		var symbols = ['☢','☠ ','☣'];
		var pick = Math.floor(Math.random()*3);
		symbol = symbols[pick];
		this.sendReply('You have been hallow\'d with a custom symbol!');
		user.getIdentity = function(){
			if(this.muted)	return '!' + this.name;
			if(this.locked) return '‽' + this.name;
			return symbol + this.name;
		};
		user.updateIdentity();
		user.hasCustomSymbol = true;
	},

	resetsymbol: function(target, room, user) {
		if (!user.hasCustomSymbol) return this.sendReply('You don\'t have a custom symbol!');
		user.getIdentity = function() {
			if (this.muted) return '!' + this.name;
			if (this.locked) return '‽' + this.name;
			return this.group + this.name;
		};
		user.hasCustomSymbol = false;
		user.updateIdentity();
		this.sendReply('Your symbol has been reset.');
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function(target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply('Room '+roomid+' not found.');
		}
		return this.parse('/msg '+this.targetUsername+', /invite '+roomid);
	},
	
	
	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var data = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; i++) {
				var template = Tools.getTemplate(newTargets[i].species);
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					data = "No Pokemon, item, move or ability named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				data += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				if (newTargets[i].searchType === 'pokemon') data += 'Tier: ' + template.tier + '\n';
			}
		} else {
			data = "No Pokemon, item, move or ability named '" + target + "' was found. (Check your spelling?)";
		}

		this.sendReply(data);
	},

	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var moves = {}, tiers = {}, colours = {}, ability = {}, gens = {}, types = {};
		var allTiers = {'uber':1,'ou':1,'uu':1,'ru':1,'nu':1,'lc':1,'cap':1,'bl':1,'bl2':1,'nfe':1, 'limbo':1};
		var allColours = {'green':1,'red':1,'blue':1,'white':1,'brown':1,'yellow':1,'purple':1,'pink':1,'gray':1,'black':1};
		var count = 0;
		var showAll = false;
		var output = 10;

		for (var i in targets) {
			target = Tools.getMove(targets[i]);
			if (target.exists) {
				if (!moves.count) {
					count++;
					moves.count = 0;
				}
				if (moves.count === 4) {
					return this.sendReply('Specify a maximum of 4 moves.');
				}
				moves[target] = 1;
				moves.count++;
				continue;
			}

			target = Tools.getAbility(targets[i]);
			if (target.exists) {
				if (!ability.count) {
					count++;
					ability.count = 0;
				}
				if (ability.count === 1) {
					return this.sendReply('Specify only one ability.');
				}
				ability[target] = 1;
				ability.count++;
				continue;
			}

			target = targets[i].trim().toLowerCase();
			if (target in allTiers) {
				if (!tiers.count) {
					count++;
					tiers.count = 0;
				}
				tiers[target] = 1;
				tiers.count++;
				continue;
			}
			if (target in allColours) {
				if (!colours.count) {
					count++;
					colours.count = 0;
				}
				colours[target] = 1;
				colours.count++;
				continue;
			}
			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 6) {
				if (!gens.count) {
					count++;
					gens.count = 0;
				}
				gens[targetInt] = 1;
				gens.count++;
				continue;
			}
			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReply('A search with the parameter "all" cannot be broadcast.')
				}
				showAll = true;
				continue;
			}
			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!types.count) {
						count++;
						types.count = 0;
					}
					if (types.count === 2) {
						return this.sendReply('Specify a maximum of two types.');
					}
					types[target] = 1;
					types.count++;
					continue;
				}
			} else {
				return this.sendReply('"' + targets[i].trim() + '" could not be found in any of the search categories.');
			}
		}

		if (showAll && count === 0) return this.sendReply('No search parameters other than "all" were found.\nTry "/help dexsearch" for more information on this command.');

		while (count > 0) {
			count--;
			var tempResults = [];
			if (!results) {
				for (var pokemon in Tools.data.Pokedex) {
					pokemon = Tools.getTemplate(pokemon);
					if (pokemon.tier !== 'Illegal' && (pokemon.tier !== 'CAP' || 'cap' in tiers)) {
						tempResults.add(pokemon);
					}
				}
			} else {
				for (var mon in results) tempResults.add(results[mon]);
			}
			var results = [];

			if (types.count > 0) {
				for (var mon in tempResults) {
					if (types.count === 1) {
						if (tempResults[mon].types[0] in types || tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					} else {
						if (tempResults[mon].types[0] in types && tempResults[mon].types[1] in types) results.add(tempResults[mon]);
					}
				}
				types.count = 0;
				continue;
			}

			if (tiers.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].tier.toLowerCase() in tiers) results.add(tempResults[mon]);
				}
				tiers.count = 0;
				continue;
			}

			if (ability.count > 0) {
				for (var mon in tempResults) {
					for (var monAbility in tempResults[mon].abilities) {
						if (Tools.getAbility(tempResults[mon].abilities[monAbility]) in ability) results.add(tempResults[mon]);
					}
				}
				ability.count = 0;
				continue;
			}

			if (colours.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].color.toLowerCase() in colours) results.add(tempResults[mon]);
				}
				colours.count = 0;
				continue;
			}

			if (moves.count > 0) {
				var problem;
				var move = {};
				for (var mon in tempResults) {
					var template = Tools.getTemplate(tempResults[mon].id);
					if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
					if (!template.learnset) continue;
					for (var i in moves) {
						move = Tools.getMove(i);
						if (move.id !== 'count') {
							if (!move.exists) return this.sendReplyBox('"' + move + '" is not a known move.');
							if (!template.learnset.sketch && !template.learnset[move.id]) break;
						}
					}
					if (template.learnset[move.id] || template.learnset.sketch) results.add(tempResults[mon]);
				}
				moves.count = 0;
				continue;
			}

			if (gens.count > 0) {
				for (var mon in tempResults) {
					if (tempResults[mon].gen in gens) results.add(tempResults[mon]);
				}
				gens.count = 0;
				continue;
			}
		}

		var resultsStr = '';
		if (results && results.length > 0) {
			for (var i = 0; i < results.length; ++i) results[i] = results[i].species;
			if (showAll || results.length <= output) {
				resultsStr = results.join(', ');
			} else {
				var hidden = string(results.length - output);
				results.sort(function(a,b) {return Math.round(Math.random());});
				var shown = results.slice(0, 10);
				resultsStr = shown.join(', ');
				resultsStr += ', and ' + hidden + ' more. Redo the search with "all" as a search parameter to show all results.';
			}
		} else {
			resultsStr = 'No Pokémon found.';
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply('Pokemon "'+template.id+'" not found.');
		}

		if (targets.length < 2) {
			return this.sendReply('You must specify at least one move.');
		}

		for (var i=1, len=targets.length; i<len; i++) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply('Move "'+move.id+'" not found.');
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = ''+template.name+(problem?" <span class=\"message-learn-cannotlearn\">can't</span> learn ":" <span class=\"message-learn-canlearn\">can</span> learn ")+(targets.length>2?"these moves":move.name);
		if (!problem) {
			var sourceNames = {E:"egg",S:"event",D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": "+source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ', '+source.substr(2);
						else if (prevSourceCount == 3) buffer += ', ...';
						prevSourceCount++;
						continue;
					}
					prevSourceType = source.substr(0,2);
					prevSourceCount = source.substr(2)?0:-1;
					buffer += "<li>gen "+source.substr(0,1)+" "+sourceNames[source.substr(1,1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": "+source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before "+(lsetData.sourcesBefore+1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function(target, room, user){
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox(target + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod == 1) weaknesses.push(type);
				if (typeMod == 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox(target + " has no weaknesses.");
		} else {
			this.sendReplyBox(target + " is weak to: " + weaknesses.join(', ') + " (not counting abilities).");
		}
	},

	matchup: 'effectiveness',
	effectiveness: function(target, room, user) {
		var targets = target.split(/[,/]/);
		var type = Tools.getType(targets[1]);
		var pokemon = Tools.getTemplate(targets[0]);
		var defender;

		if (!pokemon.exists || !type.exists) {
			// try the other way around
			pokemon = Tools.getTemplate(targets[1]);
			type = Tools.getType(targets[0]);
		}
		defender = pokemon.species+' (not counting abilities)';

		if (!pokemon.exists || !type.exists) {
			// try two types
			if (Tools.getType(targets[0]).exists && Tools.getType(targets[1]).exists) {
				// two types
				type = Tools.getType(targets[0]);
				defender = Tools.getType(targets[1]).id;
				pokemon = {types: [defender]};
				if (Tools.getType(targets[2]).exists) {
					defender = Tools.getType(targets[1]).id + '/' + Tools.getType(targets[2]).id;
					pokemon = {types: [Tools.getType(targets[1]).id, Tools.getType(targets[2]).id]};
				}
			} else {
				if (!targets[1]) {
					return this.sendReply("Attacker and defender must be separated with a comma.");
				}
				return this.sendReply("'"+targets[0].trim()+"' and '"+targets[1].trim()+"' aren't a recognized combination.");
			}
		}

		if (!this.canBroadcast()) return;

		var typeMod = Tools.getEffectiveness(type.id, pokemon);
		var notImmune = Tools.getImmunity(type.id, pokemon);
		var factor = 0;
		if (notImmune) {
			factor = Math.pow(2, typeMod);
		}

		this.sendReplyBox(''+type.id+' attacks are '+factor+'x effective against '+defender+'.');
	},

	uptime: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24*60*60) {
			var uptimeDays = Math.floor(uptime/(24*60*60));
			uptimeText = ''+uptimeDays+' '+(uptimeDays == 1 ? 'day' : 'days');
			var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
			if (uptimeHours) uptimeText += ', '+uptimeHours+' '+(uptimeHours == 1 ? 'hour' : 'hours');
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox('Uptime: <b>'+uptimeText+'</b>');
	},

	groups: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />' +
			'% <b>Driver</b> - The above, and they can also mute and lock users and check for alts<br />' +
			'@ <b>Moderator</b> - The above, and they can ban users<br />' +
			'&amp; <b>Leader</b> - The above, and they can promote moderators and force ties<br />' +
			'~ <b>Administrator</b> - They can do anything, like change what this message says<br />' +
			'# <b>Room Owner</b> - They are administrators of the room and can almost totally control it');
	},

	opensource: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown is open source:<br />- Language: JavaScript<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown">Server source code</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown-Client">Client source code</a>');
	},

	avatars: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown.');
	},

	introduction: 'intro',
	intro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/forums/threads/3496279/">Beginner\'s Guide to Pokémon Showdown</a><br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon">An introduction to competitive Pokémon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/bw/banlist/">What are the rules for each format? What is "Sleep Clause"?</a>');
	},

	smogonintro: 'smogintro',
	smogintro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Welcome to Smogon\'s Official Pokémon Showdown server!<br /><br />' + 
			'Here are some useful links to Smogon\'s Mentorship Program to help you get integrated into the community:<br />' +
			'- <a href="http://www.smogon.com/mentorship/primer">Smogon Primer: A brief introduction to Smogon\'s subcommunities</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/introductions">Introduce yourself to Smogon!</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/profiles">Profiles of current Smogon Mentors</a><br />' +
			'- <a href="http://mibbit.com/#mentor@irc.synirc.net">#mentor: the Smogon Mentorship IRC channel</a><br />' +
			'All of these links and more can be found at the <a href="http://www.smogon.com/mentorship/">Smogon Mentorship Program\'s hub</a>.');
	},

	calculator: 'calc',
	calc: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />' +
			'- <a href="http://pokemonshowdown.com/damagecalc/">Damage Calculator</a>');
	},

	cap: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('An introduction to the Create-A-Pokemon project:<br />' +
			'- <a href="http://www.smogon.com/cap/">CAP project website and description</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=48782">What Pokemon have been made?</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3464513">Talk about the metagame here</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3466826">Practice BW CAP teams</a>');
	},

	gennext: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />' +
			'- <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md">README: overview of NEXT</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37815908">roseyraid vs Zarel</a><br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37900768">QwietQwilfish vs pickdenis</a>');
	},

	om: 'othermetas',
	othermetas: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/forums/206/">Information on the Other Metagames</a><br />';
		}
		if (target === 'all' || target === 'hackmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3475624/">Hackmons</a><br />';
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3463764/">Balanced Hackmons</a><br />';
		}
		if (target === 'all' || target === 'glitchmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3467120/">Glitchmons</a><br />';
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3479358/">Tier Shift</a><br />';
		}
		if (target === 'all' || target === 'seasonal') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/sim/seasonal">Seasonal Ladder</a><br />';
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3484106/">STABmons</a>';
		}
		if (target === 'all' || target === 'omotm' || target === 'omofthemonth' || target === 'month') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3481155/">OM of the Month</a>';
		}
		if (!matched) {
			return this.sendReply('The Other Metas entry "'+target+'" was not found. Try /othermetas or /om for general help.');
		}
		if (target === 'all' || target === 'rebalancedmono') {
			matched = true;
			buffer += '- <a href="http://pastebin.com/tqqJT4MG">Rebalanced Monotype</a>';
		}
		this.sendReplyBox(buffer);
	},

	roomhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.');
		this.sendReplyBox('Room drivers (%) can use:<br />' +
			'- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
			'- /mute OR /m <em>username</em>: 7 minute mute<br />' +
			'- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
			'- /unmute <em>username</em>: unmute<br />' +
			'- /announce <em>message</em>: make an announcement<br />' +
			'- /roomlog: view the moderator log in the room<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /rkick <em>username</em>: kicks the user from the room<br />' +
			'- /roomban <em>username</em>: bans user from the room<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
			'- /roomunban <em>username</em>: unbans user from the room<br />' +
			'- /roomvoice <em>username</em>: appoint a room voice<br />' +
			'- /roomdevoice <em>username</em>: remove a room voice<br />' +
			'- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
			'<br />' +
			'Room owners (#) can also use:<br />' +
			'- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
			'- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
			'- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
			'- /declare <em>message</em>: make a declaration in the room<br />' +
			'- /lockroom: locks the room preventing users from joining.<br />' +
			'- /unlockroom: unlocks the room allowing users to join.<br />' +
			'- /setwelcomemessage <em>message</em>: sets the message people will see when they join the room. Can contain html and must be bought from the store first.<br />' +
			'- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
			'<br />' +
			'The room founder can also use:<br />' +
			'- /roomowner <em>username</em><br />' +
			'- /roomdeowner <em>username</em><br />' +
			'</div>');
	},

	restarthelp: function(target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('The server is restarting. Things to know:<br />' +
			'- We wait a few minutes before restarting so people can finish up their battles<br />' +
			'- The restart itself will take around 0.6 seconds<br />' +
			'- Your ladder ranking and teams will not change<br />' +
			'- We are restarting to update Pokémon Showdown to a newer version' +
			'</div>');
	},

	rule: 'rules',
	rules: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Please follow the rules:<br />' +
			'- <a href="http://pokemonshowdown.com/rules">Rules</a><br />' +
			'</div>');
	},

	faq: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq">Frequently Asked Questions</a><br />';
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#deviation">Why did this user gain or lose so many points?</a><br />';
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#doubles">Can I play doubles/triples/rotation battles here?</a><br />';
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#randomcap">What is this fakemon and what is it doing in my random battle?</a><br />';
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#restarts">Why is the server restarting?</a><br />';
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/staff_faq">Staff FAQ</a><br />';
		}
		if (target === 'all' || target === 'autoconfirmed') {
			matched = true;
			buffer += 'A user is autoconfirmed when they have won at least one rated battle and has been registered for a week or longer.<br />';
		}
		if (!matched) {
			return this.sendReply('The FAQ entry "'+target+'" was not found. Try /faq for general help.');
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/tiers/">Smogon Tiers</a><br />';
			buffer += '- <a href="http://www.smogon.com/bw/banlist/">The banlists for each tier</a><br />';
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uber">Uber Pokemon</a><br />';
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ou">Overused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uu">Underused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ru">Rarelyused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/nu">Neverused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/lc">Little Cup Pokemon</a><br />';
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/metagames/doubles">Doubles</a><br />';
		}
		if (!matched) {
			return this.sendReply('The Tiers entry "'+target+'" was not found. Try /tiers for general help.');
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox('<a href="http://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/">Generation 6 Analyses Index</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || "bw").trim().toLowerCase();
		var genNumber = 5;
		var doublesFormats = {'vgc2012':1,'vgc2013':1,'doubles':1};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === "bw" || generation === "bw2" || generation === "5" || generation === "five") {
			generation = "bw";
		} else if (generation === "dp" || generation === "dpp" || generation === "4" || generation === "four") {
			generation = "dp";
			genNumber = 4;
		} else if (generation === "adv" || generation === "rse" || generation === "rs" || generation === "3" || generation === "three") {
			generation = "rs";
			genNumber = 3;
		} else if (generation === "gsc" || generation === "gs" || generation === "2" || generation === "two") {
			generation = "gs";
			genNumber = 2;
		} else if(generation === "rby" || generation === "rb" || generation === "1" || generation === "one") {
			generation = "rb";
			genNumber = 1;
		} else {
			generation = "bw";
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1,'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':'VGC 2012 ','vgc2013':'VGC 2013 ','doubles':'Doubles '}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox(pokemon.name+' did not exist in '+generation.toUpperCase()+'!');
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = "cap";
			}

			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0,8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0,7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0,10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';

			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/pokemon/'+poke+doublesFormat+'">'+generation.toUpperCase()+' '+doublesText+pokemon.name+' analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/items/'+itemName+'">'+generation.toUpperCase()+' '+item.name+' item analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/abilities/'+abilityName+'">'+generation.toUpperCase()+' '+ability.name+' ability analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/moves/'+moveName+'">'+generation.toUpperCase()+' '+move.name+' move analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		if (!atLeastOne) {
			return this.sendReplyBox('Pokemon, item, move, or ability not found for generation ' + generation.toUpperCase() + '.');
		}
	},

	//FORMATS

	pointscore: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Point Score is a custom rule set which uses points to adjust how you make a team:<br />' +
			'- <a href="https://github.com/BrittleWind/Pokemon-Showdown/blob/master/data/README%20-%20Point%20Score.md#the-points">README: overview of Point Score</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/phoenixleague-pointscore-3822">Elite Fou® Cats vs Elite Fou® dvetts</a>');
	},

	perseverance: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Perseverance is a format which encourages smart play, and loser is first to lose a Pokemon:<br />' +
			'- <a href="https://github.com/LynnHikaru/Perseverance-/blob/master/README.md">README: overview of Perseverance</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/phoenixleague-perseverance-3900">Cosy vs Champion® Lynn</a>');
	},

	//TOUR COMMANDS
            
    tourcommands: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Tournaments through /tour can be started by Voice (+) users and higher:<br \>' +
        '/tour [tier], [size] - Starts a tournament<br \>' +
		'/endtour - Ends a currently running tournament<br \>' +
		'/fj [username] - Force someone to join a tournament<br \>' +
		'/fl [username] - Force someone to leave a tournament<br \>' +
		'/toursize [size] - Changes the size of a currently running tournament<br \>' +
		'/replace [username], [username] - Replaces user in a tournament with the second user');
    },

	/***************************************
	* Trainer Cards                        *
	***************************************/

	piscean: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=150 width=150 src="http://i0.kym-cdn.com/photos/images/newsfeed/000/535/926/ff5.gif">' +
			'<img src="http://i.imgur.com/h7D9eju.gif">' +
			'<img height=150 width=150 src="http://fc09.deviantart.net/fs24/f/2008/004/1/2/Pisces_by_Angel_Blaze.jpg"><br />' +
			'<b>Ace:</b> Fish<br />' +
			'<b>Catchphrase:</b> Tempting Piscean will bring about the wrath of the sea. </center>');
	},

	adam: 'adamkillszombies',
	adamkillszombies: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height=100 src="http://pldh.net/media/pokemon/conquest/sprite/212.png">' +
		'<img height=100 src="http://frostserver.net:8000/images/adamkillszombies.png">' +
		'<img height=100 src="http://pldh.net/media/pokemon/gen2/crystal/212.gif"><br />' +
		'<b>Ace:</b> Scizor <br />' +
		'My destination is close, but it\'s very far...');
	},

	wiggly: 'wigglytuff',
	wigglytuff: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/D30ksbl.gif" height="80 width=80"><img width="340" height="80" src="http://i.imgur.com/Iqexc1A.gif"><img src="http://i.imgur.com/8oUvNAt.gif" height="80" width="80"><br /><b>Ace:</b> Chatot<br />Don\'t shirk work! Run away and pay! Smiles go for miles!<br></center>');
	},

	aerys: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="100" src="http://imgur.com/BAKX8Wk.jpg" >' +
			'<img height="100" src="http://i.imgur.com/2NhfpP2.gif">' +
			'<img width="180" height="100" src="http://i.imgur.com/ImtN9kV.jpg"><br />' +
			'<b>Ace: </b>Smeargle<br />' +
			'<b>Catchphrase: </b>I\'m not a monster; I\'m just ahead of the curve</center>');
	},

	dbz: 'dragonballsz',
	dragonballsz: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img width="140" height="100" src="http://i.imgur.com/m9gPc4J.gif">' + // first image
			'<img width="280" height="100"src="http://i.imgur.com/rwzs91Z.gif">' + // name
			'<img width="140" height="100"src="http://i.imgur.com/J4HlhUR.gif"><br />' + // second image
			'<font color=red><blink> Ace: Princess Celestia </blink></font><br />' +
			'*sends out ninjask* Gotta go fast.</center>');
	},

	bigblackhoe: 'lenora',
	oprah: 'lenora',
	sass: 'lenora',
	lenora: function(target, room, user) {
		if (!this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Lenora<br />' +
		'Ace: Lenora<br />' + 
		'Catchphrase: Sass me and see what happens.<br />' +
		'<img src="http://hydra-images.cursecdn.com/pokemon.gamepedia.com/3/3e/LenoraBWsprite.gif">');
	},

    thefrontierbeast: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://www.explodingdog.com/drawing/awesome.jpg">' +
        	'<img height="100" src="http://i.imgur.com/3eN4nV3.gif">' +
        	'<img height="100" src="http://fc09.deviantart.net/fs70/f/2011/089/a/1/hydreigon_the_dark_dragon_poke_by_kingofanime_koa-d3cslir.png"><br />' +
        	'<b>Ace: </b>Hydreigon<br />' +
        	'<b>Catchphrase: </b>You wanna hax with me huh WELL YOU DIE<br /></center>');
    },
    
    elitefourlight : 'light',
    light: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://i.imgur.com/eetjLuv.png">' +
        	'<img height="100" width="450" src="http://i.imgur.com/v4h0TvD.png">' +
        	'<img height="100" src="http://i.imgur.com/21NYnjz.gif"><br />' +
        	'<b>Ace: </b>Mega Lucario<br />' +
        	'<b>Catchphrase: </b>Their is always Light within the darkness</center>');
    },
    
    zezetel: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img height="100" width="130" src="http://i.imgur.com/wpYk97G.png">' +
    	'<img src="http://i.imgur.com/ix6LGcX.png"><img width="130" height="90" src="http://i.imgur.com/WIPr3Jl.jpg">' +
    	'<br /><center><b>Ace: </b>Predictions</center><br /><center><b>Catchphrase: </b>' +
    	'In matters of style, swim with the current, in matters of principle, stand like a rock.</center>');
    },
    
    darkjak : 'jak',
    jak: function(target, room, user) {
    	if (target) return this.sendReply('It\'s not funny anymore.');
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://www.freewebs.com/jak-4/Dark%20Jak%202.jpg">' +
        	'<img height="100" src="http://i.imgur.com/eswH4MI.gif">' +
        	'<img height="100" src="http://fc07.deviantart.net/fs70/i/2013/281/6/b/mega_charizard_x_by_magnastorm-d6ppbi7.jpg"><br />' +
        	'<b>Ace: </b>Mega Charizard-X<br />' +
        	'<b>Catchphrase: </b>The Darkside cannot be extinguished, when you fight</center>')
    },
    
    brittlewind: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://i.imgur.com/3tCl8az.gif>"><br />' +
        	'<img height="100" src="http://i.imgur.com/kxaNPFf.gif">' +
        	'<img height="100" src="http://i.imgur.com/qACUYrg.gif">' +
        	'<img height="100" src="http://i.imgur.com/0otHf5v.gif"><br />' +
        	'Ace: Mr. Kitty<br />' +
        	'Gurl please. I can beat you with mah eyes closed.');
    },
    
    elitefourkaiser : 'kaiser',
    kaiser: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="80" src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/534.gif">' +
        	'<img height="80" width="450" src="http://i.imgur.com/TZgQzzZ.png">' +
        	'<img height="80" src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/475.gif"><br />' +
        	'<b>Ace: </b>Gallade<br />' +
        	'<b>Catchphrase: </b>Fight to the Death, When you give up thats when you really lose</center>');
    },
    
    gemini : 'prfessorgemini',
    prfessorgemini: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://i.imgur.com/UUSMQaL.jpg">' +
        	'<img src="http://i.imgur.com/HrHfI4e.gif">' +
        	'<img height="100" src="http://25.media.tumblr.com/tumblr_lrmuy73LRE1r2ugr3o1_500.gif"><br />' +
        	'<b>Ace: </b>Pinsir<br />' +
        	'<b>Catchphrase: </b>I am Professor Gemini. The best professor there is because I\'m not named after a f**king tree</center>')
    },
    
    sagethesausage: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://i.imgur.com/mc7oWrv.gif">' +
        	'<img src="http://i.imgur.com/vaCeYTQ.gif">' +
        	'<img height="100" src="http://fc00.deviantart.net/fs23/f/2007/320/d/4/COUNTER_by_petheadclipon_by_wobbuffet.png"><br />' +
        	'<b>Ace: </b>Wobbuffet<br />' +
        	'<b>Catchphrase: </b>Woah! Buffet! Wynaut eat when no one is looking?</center>');
    },
    
    moogle : 'kupo',
    kupo: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://192.184.93.156:8000/avatars/kupo.png"><br />' +
        	'<img height="100" src="http://oyster.ignimgs.com/wordpress/write.ign.com/74314/2012/01/Moogle.jpg">' +
        	'<img height="100" src="http://i.imgur.com/6UawAhH.gif">' +
        	'<img height="100" src="http://images2.wikia.nocookie.net/__cb20120910220204/gfaqsff/images/b/bb/Kupo1705.jpg"><br />' +
        	'<b>Ace: </b>Moogle<br />' +
        	'<b>Catchphrase: </b>Kupo!<br /></center>');
    },
    
    creaturephil : 'phil',
    phil: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="150" src="http://fc01.deviantart.net/fs70/f/2013/167/a/7/pancham_by_haychel-d64z92n.jpg">' +
        	'<img src="http://i.imgur.com/3jS3bPY.png">' +
        	'<img src="http://i.imgur.com/DKHdhf0.png" height="150"><br />' +
        	'<b>Ace: </b>Pancham<br />' +
        	'<b>Catchphrase: </b><a href="http://creatureleague.weebly.com">http://creatureleague.weebly.com</a></center>');
    },
    
    themapples : 'mapples',
    mapples: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="80" src="http://images.wikia.com/pokemontowerdefense/images/5/52/Infernape-infernape-23393713-629-354.png">' +
        	'<img src="http://i.imgur.com/xSdk7j6.gif">' +
        	'<img height="80" src="http://i806.photobucket.com/albums/yy343/double_trouble_bmgf/pokemon-dp/snapshot20100813014143.jpg"><br />' +
        	'<b>Ace: </b>Infernape<br />' +
        	'<b>Catchphrase: </b>My goal is to....<s>catch</s> enslave them all</center>');
    },
    
    
   elitefourbalto : 'balto', 
   balto: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="90" src="http://fc08.deviantart.net/fs71/f/2012/035/e/f/snorlax_by_all0412-d4omc96.jpg">' +
        	'<img src="http://i.imgur.com/gcbLD9A.png">' +
        	'<img src="http://fc04.deviantart.net/fs71/f/2013/223/3/b/mega_kangaskhan_by_peegeray-d6hnnmk.png" height="100"><br />' +
        	'<b>Ace: </b>Snorlax<br />' +
        	'<b>Catchphrase: </b>To be a championship player,you need a championship team.</center>');
    },
    
    
    chmpionxman : 'xman',
    championxman : 'xman',
    xman: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="80" src="http://fdzeta.net/imgcache/207158dz.gif">' +
        	'<img src="http://i.imgur.com/9bKjjcM.gif">' +
        	'<img src="http://img.pokemondb.net/sprites/black-white/anim/shiny/infernape.gif"><br />' +
        	'<b>Ace: </b>Infernape<br />' +
        	'<b>Catchphrase: </b>It may be risky, but it may be teh only way to win.</center>');
    },
    
    shira : 'e4shirayuri', 
    e4shirayuri: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://www.okamiworld.com/wiki/images/b/bd/Amaterasu_5_-_Solar_Flare.jpg">' +
        	'<img src="http://i.imgur.com/THEJxYZ.gif">' +
        	'<img height="100" src="http://1-media-cdn.foolz.us/ffuuka/board/vp/image/1366/82/1366827374253.jpg" height="91"><br />' +
        	'<b>Ace: </b>Gliscor<br />' +
        	'<b>Catcphrase: </b>Rub-a-dub-dub, Shira be in your tub.</center>');
    },
    
    pikadagreat : 'pika', 
    pika: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://sprites.pokecheck.org/i/025.gif" height="100">' +
        	'<img height="100" src="http://i.imgur.com/LwD0s9p.gif">' +
        	'<img height="100" src="http://media0.giphy.com/media/DCp4s7Z1FizZe/200.gif"><br />' +
        	'<b>Ace:</b> Pikachu<br />' +
        	'<b>Catchphrase:</b> Its not a party without Pikachu</center>');
    },
    
    kidshiftry: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://fc01.deviantart.net/fs71/f/2011/261/0/c/shiftry_by_rapidashking-d4a9pc4.png">' +
        	'<img height="100" src="http://i.imgur.com/HHlDOu0.gif">' +
        	'<img height="100"src="http://25.media.tumblr.com/tumblr_m1kzfuWYgE1qd4zl8o1_500.png"><br />' +
        	'<b>Ace:</b> Shiftry<br /><b>Catchphrase: </b> Kicking your ass will be my pleasure!</center>');
    },
    
    pikabluswag: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src=http://i.imgur.com/hwiX34o.gif><img src=http://i.imgur.com/6v22j6r.gif height=60 width=310><img src=http://i.imgur.com/QXiZE1a.gif><br><br><b>Ace:</b> Azumarill<br>The important thing is not how long you live. It\'s what you accomplish with your life. </center>');
    },
    
    scizorknight: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img height="100" src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/212.gif">' +
        	'<img src="http://i.imgur.com/RlhvAOI.gif">' +
        	'<img height="100" src="http://img.pokemondb.net/sprites/black-white/anim/shiny/breloom.gif"><br />' +
        	'<b>Ace:</b> Scizor<br />' +
        	'<b>Catchphrase:</b> I Love The Way You lose ♥</center>');
    },
    
    jitlittle: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://24.media.tumblr.com/8183478ad03360a7c1d02650c53b4b35/tumblr_msfcxcMyuV1qdk3r4o1_500.gif" height="100" width="140"><img src="http://i.imgur.com/Vxjzq2x.gif" height="85" width="250"><img src="http://25.media.tumblr.com/b2af3f147263f1ef10252a31f0796184/tumblr_mkvyqqnhh51snwqgwo1_500.gif" height="100" width="140"></center></br><center><b>Ace:</b> Jirachi</center></br><center><b>"</b>Cuteness will always prevail over darkness<b>"</b></center>');
    },

    bibliaskael: 'kael',
    kael: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i1141.photobucket.com/albums/n587/diebenacht/Persona/Arena%20gif/yukiko_hair_flip_final_50_80.gif">' +
        	'<img height="180" src="http://i1141.photobucket.com/albums/n587/diebenacht/teaddy_final_trans-1.gif">' +
        	'<img src="http://i1141.photobucket.com/albums/n587/diebenacht/Persona/Arena%20gif/naoto_left_final_50_80.gif"><br />' +
        	'<b>Ace:</b> Latios' +
        	'<b>Catchphrase:</b> My tofu...</center>');
    },
   


	runzy : 'championrunzy',
	championrunzy: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i.imgur.com/BSqLNeB.gif">' +
        	'<font size="6" color="#FA5882"><i>Champion Runzy</i>' +
        	'<img src="http://i.imgur.com/itnjFmx.gif"></font></color><br />' +
        	'Ace: Whimsicott<br>Want some Leech Seed?</center>');
        },
    
    	glisteringaeon: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center>Trainer: Glistering Aeon<br />' +
		'Ace: Really? Duh.<br />' +
		'Catchphrase: Grab your sombreros and glow sticks and lets rave!<br />' +
        '<img height="150" src="http://www.animeyume.com/ludicolo.jpg"></center>');
    	},

	champwickedweavile: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: ChampWickedWeavile<br \>' +
		'Ace: Scyther<br \>' +
		'Catchphrase: I suck at this game.<br \>' +
        '<img src="http://play.pokemonshowdown.com/sprites/trainers/80.png">');
    },

	championdarkrai: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://pokecharms.com/data/trainercardmaker/characters/custom/Cosplayers/p491-1.png">' +
        	'<img src="http://imgur.com/JmqGNKI.gif">' +
        	'<img src="http://pokecharms.com/data/trainercardmaker/characters/custom/Cosplayers/p491.png"><br />' +
        	'<b>Ace:</b> Darkrai<br />' +
        	'<b>Catchphrase:</b> I got so many ghost hoes I lost count</center>');
    },		
    
    priest: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img width="140" height="100" src="http://images.wikia.com/es.pokemon/images/archive/3/35/20090105180143!Heatran_en_Pok%C3%A9mon_Ranger_2.png"><img src="http://i.imgur.com/BkVihDY.png"><img src="http://192.184.93.156:8000/avatars/priest4.png"><br /><font color="red"><blink>Ace: Heatran</blink></font><br />Are you ready to face holyness itself? Will you open the door to my temple? Let your chakras make the decision for you.</center>');
    },
    
   smoothmoves: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<img src="http://www.sherv.net/cm/emo/funny/2/banana-smiley-emoticon.gif"><img src="http://i.imgur.com/7RTLz6V.gif"><img src="http://www.sherv.net/cm/emo/funny/2/dance.gif" height="60"><br /><center><font size="2"><b>Ace:</b> <font color="red">F</font><font color="orange">l</font><font color="green">u</font><font color="blue">f</font><font color="indigo">f</font><font color="violet">y</font> <font color="red">M</font><font color="orange">a</font><font color="green">r</font><font color="blue">e</font><font color="indigo">e</font><font color="violet">p</font><font color="red">s</font></center><br /><center><font size="2"><b>Catchphrase:</b> My potassium level is over 9000000000!!!!!!!!</center><br />')
    },

	trainerbofish: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Trainer Bofish<br \>' +
		'Ace: Electivire<br \>' +
		'Catchphrase: I love to shock you.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/466.gif">')
    },	

	snooki: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i.imgur.com/1U1MFAg.png"><img src="http://i.imgur.com/R9asfxu.gif"><img src="http://i.imgur.com/vqxQ6zq.png"><font color="red"><blink>Ace: Jynx</blink></font><br>I came in like a wrecking ball')
    },	
    
    teafany: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/lwL5Pce.png"><img src="http://i.imgur.com/D9M6VGi.gif"><img src="http://i.imgur.com/hZ0mB0U.png"><br><b>Ace: <font color="#58ACFA"><blink>Ace: Farfetch\'d</blink><br></font><b><font color="#00BFFF">Where can I find a leek in Pokemon Y?');
    },
    
    kanghirule : 'kanghiman',
    kanghiman: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<img src="http://fc07.deviantart.net/fs23/f/2007/350/e/c/Kyubi_Naruto__Ransengan_by_madrox123.gif"><img src="http://i.imgur.com/QkBsIz5.gif"><img src="http://static4.wikia.nocookie.net/__cb20120628005905/pokemon/images/4/40/Kangaskhan_BW.gif"><br /><center><b>Ace</b>: Kangaskhan</b></center><br /><center><b>Catchphrase:</b> Got milk?</center>')
    },	

	championbrave: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Champion Brave<br \>' +
		'Ace: Vaporeon<br \>' +
		'Catchphrase: :I<br \>' +
        '<img src="http://www.clipular.com/c?12387261=ZIkxKRLvilzvix0USgnMX0YSGjA&f=.png">')
    },

	elite4synth: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Elite4^Synth<br \>' +
		'Ace: Crobat<br \>' +
		'Catchphrase: Only pussies get poisoned.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/169.gif">')
    },	

	elite4quality: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Elite4^Quality<br \>' +
		'Ace: Dragonite<br \>' +
		'Catchphrase: You wanna fly, you got to give up the shit that weighs you down.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/149.gif">')
    },	
    
    quality: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/3pAo1EN.png"><img src="http://i.imgur.com/sLnYpa8.gif"><img src="http://i.imgur.com/tdNg5lE.png"><br>Ace: Pikachu<br>I\'m Quality, you\'re not.');
    },
    
    hotfuzzball: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<center><img src="http://i.imgur.com/rk5tZji.png"><br><img src="http://i.imgur.com/pBBrxgo.gif"><br><font color="red"><blink><b>Ace: Clamperl</blink></font><br><b>How do you like me now, (insert naughty word)!');
    },
    
    /*frostradio : 'radio', 
    radio: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<h1><b>Frost has its very own radio station!</b><h1><hr /><br /><font size="2">Click the image to join with other Frost users on this cool website found by Priest!<a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"><a href="http://plug.dj/frost-ps/"><img src="http://i.imgur.com/QFMHeDO.png"></a>');
    },*/
     
     mastersofthecolorhelp: 'motc', 
     motc: function(target, room, user) {
    	if (!this.canBroadcast()) return;
    	this.sendReplyBox('<h2>Masters of the Colors</h2><hr /><br />In this tournament, you will construct a team based on the color of your name. You are not allowed to <em>choose</em> the color of your name. Follow these steps if you wish to participate:<ol><li>Look at the color of your name and determine if your name color is: <b>Red, Blue, Green, Pink/Purple, Yellow/Brown</b></li><li>Once you have found out your name color, type that color in the main chat to bring up a list of pokemon with that color. Ex]BrittleWind is Blue so I would type /blue in the main chat, Cosy is Red so he would type /red in the main chat. (If your name color is Yellow/Brown you are allowed to use both yellow <em>and</em> brown Pokemon. The same goes for Pink/Purple)</li><li>Now using list of pokemon you see on your screen, make a <b>Gen 6 OU</b> team using only the pokemon on the list. Some pokemon on the list won\'t be in the OU category so ignore them. As long as your able to do a Gen 6 OU battle with only your pokemon, your good to go!</li><li>Now all you have to do is wait for the declare to come up telling you that Masters of the Colors has started! If you happen to come accross any trouble during the event, feel free to PM the room owner for your designated room.</li><li><b>IF</b> you do win, your challenge isn\'t over yet! After winning, construct a team using only <b>Black, White, or Gray</b> Pokemon (you may use /black etc. to see the list). You will go against the other winners of Masters of the Colors and the winner will recieve an extra 10 bucks!</ol>');
    },

	elitefoursalty: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Elite Four Salty<br \>' +
		'Ace: Keldeo<br \>' +
		'Catchphrase: I will wash away your sin.<br \>' +
        '<img src="http://images3.wikia.nocookie.net/__cb20120629095010/pokemon/images/9/98/BrycenBWsprite.gif">')
    },	

	jiraqua: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Jiraqua<br \>' +
		'Ace: Jirachi<br \>' +
		'Catchphrase: Go Jirachi!<br \>' +
        '<img src="http://cdn.bulbagarden.net/upload/4/48/Spr_B2W2_Rich_Boy.png">')
    },
	
	gymldrrhichguy: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Gym Ldr RhichGuy<br \>' +
		'Ace: Thundurus-T<br \>' +
		'Catchphrase: Prepare to discover the true power of the thunder!<br \>' +
    	'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/642-therian.gif">')
    },
            
    murana: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: Murana<br \>' +
		'Ace: Espeon<br \>' +
		'Catchphrase: Clutching victory from the jaws of defeat.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/196.gif">')
    },		
  	
  	ifazeoptical: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: ♫iFaZeOpTiCal♫<br \>' +
		'Ace: Latios<br \>' +
		'Catchphrase: Its All Shits And Giggles Until Someone Giggles And Shits.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/381.gif">')
    },
                 
	superjeenius: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('<center><img src="http://i.imgur.com/vemKgq4.png"><br><img src="http://i.imgur.com/7SmpvXY.gif"><br>Ace: Honchkrow<br>Cya later mashed potato.')
    },
            
    electricapples: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: ElectricApples<br \>' +
		'Ace: Jolteon<br \>' +
		'Catchphrase: You are not you when your zappy.<br \>' +
        '<img src="http://pldh.net/media/pokemon/gen5/blackwhite/135.png">')
    },

    nochansey: function(target, room, user) {
        if (!this.canBroadcast()) return;
        this.sendReplyBox('Trainer: NoChansey<br \>' +
		'Ace: Miltank<br \>' +
		'Catchphrase: Moo, moo muthafuckas.<br \>' +
        '<img src="http://media.pldh.net/pokemon/gen5/blackwhite_animated_front/241.gif">')
    },

    championtinkler: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/ymI1Ncv.png"><br><img src="http://i.imgur.com/ytgnp0k.gif"><br><font color="red"><blink><b>Ace: Volcarona</blink></font><br><b>Aye there be a storm comin\' laddie')
	},
	
	killerjays: function(target, room,user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img height="150" src="http://i.imgur.com/hcfggvP.png"><img src="http://i.imgur.com/uLoVXAs.gif"><img src="http://i.imgur.com/RkpJbD1.png"><br><font size="2"><b>Ace:</b> Articuno</font><br><font size="2"><b>Catchphrase: </b>Birds Sing, Birds Fly, Birds kill people.</font>');
	},
	
	ryuuga: function(target, room,user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7ALXaVt.png"><img src="http://i.imgur.com/6OFRYal.gif"><img src="http://i.imgur.com/gevm8Hh.png"><br>Ace: Jirachi<br>I\'ve never been cool - and I don\'t care.');
		
	},
	
	lavacadicemoo: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('La vaca dice moo<br \>' +
		'The cow says moo!<br \>' + 
		'<img src="http://www.apeconmyth.com/wp-content/uploads/2011/09/moo-cow.gif">')
	},
	
	frostfaq: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('For any questions please check <a href="http://frostserver.weebly.com/faq.html">this</a> out before asking mods.')
	},
	
	frostclient: 'client',
	customclient: 'client',
	client: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('For the best experience, please use our custom client by clicking <a href="http://frost-server.no-ip.org">here</a>.')
	},
	
		kongstunes: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Get ready to go on an adventure!<br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/38_-_mine_menace__donkey_kong_country_returns_soundtrack1.mp3><button>Mine Menace </button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/73_-_crankys_theme__donkey_kong_country_returns_soundtrack.mp3><button>Kranky Kongs Theme</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/blinx_-_the_time_sweeper_-_shop_-_collection_view_music.mp3><button>Welcome to Frost!</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/04_-_london_calling_-_michael_giacchino___star_trek_into_darkness.mp3><button>Khan</button></a><br />');
		},
		
		minor: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Selected by BrittleWind and Pack:<br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/tron_legacy_-_soundtrack_ost_-_03_the_son_of_flynn_-_daft_punk.mp3><button>Tron: The Son of Flynn</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/audiomachine_breath_and_life_extended_version.mp3><button>Breath and Life</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/cloud_atlas_-_sextet_trailer_song_hd.mp3><button>Cloud Atlas Sextet</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/the_dark_knight_rises_official_soundtrack_-_a_fire_will_rise.mp3><button>A Fire Will Rise</button></a><br />');
		},
		
		getbucks: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('You can currently get points by:<br />' +
			'<b>Signing up</b>: Sign up for the forums by clicking <a href="http://frostserver.forumotion.com/">here.</a> Once you have signed up, PM an admin to get 2 bucks.<br />' +
			'<b>Subscribing</b>: Subscribe to the Frost youtube channel by clicking <a href="http://www.youtube.com/channel/UCoIYnKO7buF_N_FRDiSGFJA">here.</a> Once you have subscribed, PM an admin to get 2 bucks.<br />' +
			'<b>Making a video</b>: Make a video on YouTube about anything Frost Server related! It can even be something as simple as a battle. Make sure to have the word Frost incorporated in the Title of description of your video. Once you have made the video, PM an admin to get 10 bucks. If the video is exceptionally good, you will recieve an extra 5 bucks.<br />' +
			'For more ways to get bucks, check the website by clicking <a href="http://frostserver.weebly.com/prizes-and-points.html">here.</a>.');
			},
			
		moviemusic: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Guess the movie based on the song!<br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/inception_soundtrack-dream_is_collapsing_hans_zimmer.mp3><button>Listen!</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/sherlock_holmes__a_game_of_shadows_ost_17_-_the_end__full_hd.mp3><button>Listen!</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/hans_zimmer_-_madagascar_2_-_theme_song.mp3><button>Listen!</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/ratatouille_theme_song__colette_shows_him_le_ropes.mp3><button>Brittles Theme</button></a><br />' +
			'<a href=http://www.weebly.com/uploads/2/1/8/8/21888580/14_-_main_theme_-_michael_giacchino___star_trek_into_darkness.mp3><button>Listen!</button></a><br />');
		},
		
		trivia: function(target, room, user) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('<center><img src="http://i.imgur.com/9IOpaSa.gif"><font size="6" color="#172CAF"><i>Welcome to the Trivia Room!</i><img src="http://i.imgur.com/hSRAGcP.gif"><img src="http://i.imgur.com/JzKmvWD.png">')
		},
		
		coolasian: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Trainer: Cool Asian<br \>' +
		'Ace: Politoed<br \>' + 
		'Catchphrase: I\'m feeling the flow. Prepare for battle!<br \>' +
		'<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/186.gif">')
	},
	
	typhozzz: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="100" width="100" src="http://th08.deviantart.net/fs70/PRE/i/2011/111/e/5/typhlosion_by_sharkjaw-d3ehtqh.jpg"><img src="http://i.imgur.com/eDS32pU.gif"><img src="http://i.imgur.com/UTfUkBW.png"><br><b>Ace: <font color="red"> Typhlosion</font></b><br>If you can\'t handle the heat, get out the kitchen!');
	},
	
	roserade26: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img width="90" height="90" src="http://firechao.com/Images/PokemonGuide/bidoof_sprite.png"><img src="http://i.imgur.com/f7YIx7s.gif"><img width="120" height="110" src="http://2.images.gametrailers.com/image_root/vid_thumbs/2013/06_jun_2013/gt_massive_thumb_AVGN_640x360_07-01-13.jpg"><br /><b>Quote: If you win, I hate you<br />Ace: Roserade</b></center>');
	},
	
	spike: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img width="90" height="150" src="http://th02.deviantart.net/fs71/200H/i/2013/222/d/d/lucario_mega_form_by_tomycase-d6hetwg.png"><img src="http://i.imgur.com/L4M0q0l.gif"><img width="150" height="110" src="http://25.media.tumblr.com/a79cacf7be02d0834800f2b693dd86db/tumblr_mv06m93qkX1qd09iko1_1280.png"><br /><b>Quote: OOOoooOOoo Kill\'em<br />Ace: Goomy</b></center>');
	},
	
	nine:'leadernine', 
	leadernine: function(target, room, user) {
        	if (!this.canBroadcast()) return;
        	this.sendReply('|raw|<center><a href="http://imgur.com/9BjQ1Vc"><img src="http://i.imgur.com/9BjQ1Vc.gif"></a><br><a href="http://imgur.com/fTcILVT"><img src="http://i.imgur.com/fTcILVT.gif"></a><a href="http://imgur.com/D58V1My"><img src="http://i.imgur.com/D58V1My.gif"></a><a href="http://imgur.com/dqJ08as"><img src="http://i.imgur.com/dqJ08as.gif"></a><br>Ace: Fairies!<br><br><a href="http://imgur.com/hNB4ib0"><img src="http://i.imgur.com/hNB4ib0.png"></a><br><a href="http://imgur.com/38evGGC"><img src="http://i.imgur.com/38evGGC.png"></a><br><b>-Grimsley</b>')
    	},
	
	princesshigh: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="125" width="78" src="http://th06.deviantart.net/fs45/PRE/i/2009/066/d/6/Gardevoir_by_Onpu_chan.jpg"><img width="400" height="80" src="http://i.imgur.com/6wcoVZk.gif"><img height="125" width="78" src="http://fc01.deviantart.net/fs71/i/2012/267/9/c/50_pokemon__16_gardevoir_by_megbeth-d5fsg1a.png"><br><b>Ace: <font color="green"><blink>Gardevoir</blink><br></font><b><font color="red">Never</font><font color="#FF7E00"> make</font><font color="orange"> war</font><font color="green"> with</font><font color="blue"> someone</font><font color="#8F00FF">, always</font><font color="red"> make</font><font color="#FF7E00"> peace</font><font color="orange"> and</font><font color="green"> love</font>');
	},
	
	jordanmooo: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img height="150" width="90" src="http://i.imgur.com/iy2hGg1.png"><img src="http://i.imgur.com/0Tz3gUZ.gif"><img height="150" width="90" src="http://fc09.deviantart.net/fs71/f/2010/310/c/9/genosect_by_pokedex_himori-d32apkw.png"><br><b>Ace: <font color="purple"><blink>Genesect</blink><br></font><b><font color="green">TIME FOR TUBBY BYE BYE</font></font></center>');
	},

	alee: 'sweetie',
	sweetie: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7eTzRcI.gif?1"  height="122" width="112"><img src="http://i.imgur.com/ouRmuYO.png?1">&nbsp;&nbsp;&nbsp;&nbsp;<img src="http://i.imgur.com/4SJ47LZ.gif"  height="128" width="100"><br><font color="red"><br><blink>Ace: Shiny Gardevoir-Mega</blink><br></font><font color="purple">Y yo que estoy ciega por el sol, guiada por la luna.... escapándome. ♪</center>');
	},
	
	jesserawr: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/J6AZqhx.png" width="96" height="96"><img src="http://i.imgur.com/3corYWy.png" width="315" height="70"><img src="http://i.imgur.com/J6AZqhx.png" width="96" height="96"><br><font color="lightblue"> Ace: Wynaut </font><br> Wynaut play with me ?');
	},
	
	ryoko: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i150.photobucket.com/albums/s81/HeroDelTiempo/1192080205639.jpg" width="96" height="96"><img src="http://static1.glowtxt.com/data1/3/b/e/3be5213e8807df03753279c0778c0924cbf1eae6da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd807090ea39b870f9d041edef3ecaa488da8d2.png" width="315" height="70"><img src="http://i150.photobucket.com/albums/s81/HeroDelTiempo/1192080205639.jpg" width="96" height="96"><br><font color="red"> Ace: Bidoof </font><br> You done doofed now.');
	},
	
	meatyman: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UjmM3HD.png"><font size="6" color="#298A08"><i>Meaty_Man</i><img src="http://i.imgur.com/jdZVUOT.png"></font></color><br><center>Ace: Reshiram<br>Introducing the leaders of the anti-Fairy upsrising. Get momentum, and follow the buzzards.');
	},
	
	jd: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/9e7GXOD.png"><img src="http://i.imgur.com/mKgt7in.png"><br><center>Ace: Admin<br>I don\'t need a Trainer Card.');
	},
	
	familymantpsn: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/UHptfOM.gif"><font size="6" color="#FF0080"><i>Family Man TPSN</i><img src="http://i.imgur.com/XVhKJ77.gif"></font></color><br><center>Ace: Audino<br>Luck.');
	},
	
	pack: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/YOdiDlB.gif"><font size="7" color="#DF0174"><i>Pack</i><img src="http://i.imgur.com/yydwZav.gif"></font></color><br><center>Ace: Espeon<br>Make it PAUSE');
	},
	
	salemance: 'elite4salemance',
	elite4salemance: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/jrW9zfw.gif"><font size="6" color="#FE2E9A"><i>Elite4Salemance</i><img src="http://i.imgur.com/VYdDj7y.gif"></font></color><br><center>Ace: Haxoceratops<br>Yeah!!!');
	},
	
	colonialmustang: 'mustang',
	mustang: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc07.deviantart.net/fs70/f/2011/138/5/6/fma__comrades_by_silverwind91-d3gn45c.gif"><br><img src="http://fc01.deviantart.net/fs70/f/2011/039/8/1/roy_mustang_firestorm_by_silverwind91-d394lp5.gif"><font size="5" color="#FF0040"><i>Colonial Mustang</i><img src="http://i.imgur.com/VRZ9qY5.gif"></font></color><br><center><br>What am I trying to accomplish, you ask...? I want to change the dress code so that all women in the Frost... ...must wear mini-skirts!!.');
	},
	
	psychological: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="http://i.imgur.com/83aCync.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="http://i.imgur.com/QPmrbiM.png"><br><center><img src="http://i.imgur.com/TSEXdOm.gif"><br><center><font color="red"><blink>Ace: The Brain</blink></font><br><center><b>Catchphrase:</b> If it isn\'t logical, it\'s probably Psychological.');
	},
	
	siem: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/CwhY2Bq.png"><font size="7" color="#01DF01"><i>Siem</i><img src="http://i.imgur.com/lePMJe5.png"></font></color><br><center>Ace: Froslass<br>Keep your head up, nothing lasts forever.');
	},
	
	grumpigthepiggy: 'grumpig',
	grumpig: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/k71ePDv.png"><br><img src="http://i.imgur.com/bydKNe9.gif"><br>Ace: Mamoswine<br>Meh I\'ll Oink you till you rage.');
	},
	
	figufgyu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/n0Avtwh.png"><img src="http://i.imgur.com/0UB0M2x.png"><img src="http://i.imgur.com/fkTouXK.png"><br><center>Ace: Charizard<br>Get ready to be roasted!');
	},
	
	stein: 'frank',
	frankenstein : 'frank',
	frank: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<img src="http://i.imgur.com/9wSqwcb.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><font color="green" size="6">Franken Ştein&nbsp;&nbsp;</font></b><img height="150" src="http://fc03.deviantart.net/fs70/f/2013/120/5/9/thundurus_therian_forme_by_xous54-d4zn05j.png"></font></color><br><center><b>Ace:</b><br /> Thundurus-T<br><b>Catcphrase:</b><br /> Are you ready to fight against fear itself? Will you cross beyond that door? Let your souls make the decision for you.');
	},
	
	shadowninjask: 'ninjask',
	ninjask: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/7DKOZLx.png"><br><img src="http://i.imgur.com/YznYjmS.gif"><br>Ace: Mega Charizard X<br>Finn, being an enormous crotch-kicking foot is a gift. Don\'t scorn a gift.');
	},
	
	prez: 'cosy',
	cosy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img src="http://i.imgur.com/yMNJ2xK.png"></center>');
	},
	
	hulasaur: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img width="110" height="110" src="http://www.gamezombie.tv/wp-content/uploads/2013/10/Bulbasaur-1.png"><img src="http://i.imgur.com/qHnpJfN.png"><img width="125" height="110" src="http://willytpokemon.webs.com/photos/My-Favorite-Pokemon-Pictures/Jolteon.gif"><br /><center><b>Ace: </b>Jolteon</center><br /><center><b>Catchphrase: </b>Hula hoopin\' to the max</center>');
	},
	
	cookies: 'sirecookies',
	sircookies: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/OXSg9bK.gif"><br><img src="http://i.imgur.com/4JGoVHH.gif"><font size="7" color="#B40404"><i>Sir Cookie</i><img src="http://i.imgur.com/KWcACrr.gif"></font></color><br><center>Bandi is mine. MINEMINEMINE');
	},
	
	swedishmafia: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://www.uagna.it/wp-content/uploads/2012/10/Swedish-House-Mafia-Dont-You-Worry-Child-80x80.jpg"><img height="80" width="390" src="http://i.imgur.com/D01llqs.png"><img src="http://blowingupfast.com/wp-content/uploads/2011/05/Machine-Gun-Kelly.jpg"><br>Ace: The Power of Music<br>They say that love is forever... Your forever is all that I need~ Please staaay as long as you need~</center>');
	},
	
	piled: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/fnRdooU.png"><img src="http://i.imgur.com/hbo7FGZ.gif"><img src="http://i.imgur.com/KV9HmIk.png"><br><center>Ace: Ditto<br>PILED&PURPTIMUS PRIME!!! MHM..YEAH!!!');
	},
	
	twistedfate: 'auraburst',
	auraburst: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/vrXy1Hy.png"><br><img src="http://i.imgur.com/FP2uMdp.gif"><br><blink><font color="red">Ace: Heatran</blink><br>You may hate me, but don\'t worry, I hate you too.');
	},
	
	aerodactylol: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvlwchWKE8tbjWjQ2uBaFBDIwE3dGSPuZCocmPYVj0tulhHbAPnw"><font size="7" color="#00733C"><i>Aerodactylol</i><img src="http://pldh.net/media/pokemon/gen3/rusa_action/142.gif"></font></color><br><center>Ace: Aerodactyl<br>I only battle... DANCING!');
	},
	
	robin6539: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://fc09.deviantart.net/fs4/i/2004/196/9/b/Ludidolo.gif"><img src="http://i.imgur.com/CSfl1OU.gif"><img src="http://z5.ifrm.com/30155/88/0/a3555782/avatar-3555782.jpg"></center><br /><center>Ace: Ludicolo<br />TRAINS AND COLOS');
	},
	
	darrelde: 'elite4darrelde',
	championkeldeo: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src ="http://i.imgur.com/UYMcWfo.png">');
	},
	
	killertiger: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://sprites.pokecheck.org/s/500.gif"><br><img src="http://i.imgur.com/diRkf6z.png"><font size="7" color="#0489B1"><i>Killer Tiger</i><img src="http://i.imgur.com/4FMzRl5.png"></font></color><br><center>Ace: Salamence<br>one for all and all for one');
	},
	
	twizzy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/SGcRSab.png"><img src="http://i.imgur.com/dkwp4cu.gif"><img src="http://i.imgur.com/E04MrCc.png"><br><font color="red"><blink>Ace: Keldeo-Resolute</blink></font><br>Have you ever feel scared and there is nothing you can do about it? Challenge me and i will show you what fear is!');
	},
	
	ag: 'arcainiagaming',
	arcainiagaming: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><img src="http://i.imgur.com/tFikucg.png"><br><img src="http://i.imgur.com/wSs98Iy.gif"><br><font color="red"><blink>Ace: Weavile</blink><br></font>I\'m not even on drugs. I\'m just weird.');
	},
	
	prizes: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('A list of prizes can be found <a href="http://frostserver.weebly.com/prizes-and-points.html">here</a>.')
	},

	forum: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can find the official Frost forum <a href="http://frostserver.forumotion.com/">here</a>.')
	}, 
	
	mastersofthecolor: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center><b><h2>These are our current Masters of the <font color="red">C<font color="blue">o<font color="pink">l<font color="purple">o<font color="green">r<font color="brown">!</h2></b></center><hr /><br \>' +
		'<h3><font color="blue"><b>Blue</b></font color>: <img src="http://i.imgur.com/J2D4FSX.gif"><img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/112.gif"></h3><h3><font color="red"><b>Red</b></font color>: <img src="http://i.imgur.com/qvtR5Xf.gif"><img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/272.gif"></h3><br \>' + 
		'<h3><font color="green"><b>Green</b></font color>: <img src="http://i.imgur.com/hS0bpiJ.gif"><img src="http://pldh.net/media/pokemon/conquest/sprite/392.png"></h3><h3><font color="yellow"><b>Yellow</b></font color>/<font color="brown"><b>Brown</b></font color>:<img src="http://i.imgur.com/k29KbfI.gif"> <img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/065.gif"></h3><br \>' +
		'<h3><font color="purple"><b>Purple</b></font color>/<font color="pink"><b>Pink</b></font color>: Fail<img src="http://pldh.net/media/pokemon/gen5/blackwhite_animated_front/385.gif"></h3>')
	},

	'lights': 'scarftini', 
	scarftini: function(target, room, user) {
		if (!this.canBroadcast()) return; 
		this.sendReplyBox('<center><img src="http://i.imgur.com/HbuF0aR.png"><br />' + 
		'<b>Ace:</b> Victini <br />' + 
		'Owner of Trinity and former head of Biblia. Aggression is an art form. I am simply an artist.<br />' +
		'<img src="http://img-cache.cdn.gaiaonline.com/1a962e841da3af2acaced68853cd194d/http://i1070.photobucket.com/albums/u485/nitehawkXD/victini.gif"></center>');
	},
	
	/*Masters of the Colors commands*/
	blue: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/OqoH8a5.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	brown: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/b6edaUk.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	green: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/K2QQUn9.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	pink: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/VIPAdDd.jpg"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	purple: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/BNZhyMP.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	red: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/zia6WOO.jpg"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	yellow: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/OupZ4Cf.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	gray: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/1j0hjwZ.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	black: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/g9IYdib.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	
	white: function(target, room, user) {
		if (room.id === 'lobby' && this.broadcasting) return this.sendReply('This command is too spammy for lobby.')
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://i.imgur.com/3FVavln.png"><br />You are allowed to use these pokemon for Masters of the Color. Shineys are <b>not</b> allowed.');
	},
	/*Ends mastersof the colors commands*/
	
	piiiikachuuu: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<img src = "http://frost-server.no-ip.org:8000/avatars/pika.png"><br />zzzzzzzzzzzzzzzzz');
	},
	hangmanhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 2>A brief introduction to </font><font size = 3>Hangman:</font><br />' +
						'The classic game, the basic idea of hangman is to guess the word that someone is thinking of before the man is "hanged." Players are given 8 guesses before this happens.<br />' + 
						'Games can be started by any of the rank Voice or higher, including Room Voice, Room Mod, and Room Owner.<br />' +
						'The commands are:<br />' +
						'<ul><li>/hangman [word], [description] - Starts the game of hangman, with a specified word and a general category. Requires: + % @ & ~</li>' +
						'<li>/guess [letter] - Guesses a letter.</li>' +
						'<li>/guessword [word] - Guesses a word.</li>' +
						'<li>/viewhangman - Shows the current status of hangman. Can be broadcasted.</li>' +
						'<li>/word - Allows the person running hangman to view the word.</li>' +
						'<li>/category [description] OR /topic [description] - Allows the person running hangman to changed the topic.</li>' +
						'<li>/endhangman - Ends the game of hangman in the room. Requires: + % @ & ~</li></ul>' +
						'Due to some recent changes, hangman can now be played in multiple rooms at once (excluding lobby, it\'s a little spammy).<br />' +
						'Have fun, and feel free to PM me if you find any bugs! - piiiikachuuu');
	},
	
	events: 'currentevents',
	currentevents: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 2>Here is a list of events that will be happening today (Pacific Time):</font><br />' +
						'<ul><li><b>12:30</b>-<i>Regular users Tournament</i>-This Gen 6 Pokebank OU format tournament is held in lobby and has no size limit (there is a 3 minute registration period).First place gets <b>30 Points</b> and second place gets <b>20 Points</b>.</li>' +
						'<li><b>1:30</b>-<i>Masters of the Color</i>-In this tournament, your team must share a color that is based on your name. All names fit under these four categories: red, blue, green, yellow/brown, pink/purple. To see a list of pokemon for your name, type /[color].(ex- /green). Winning for your color will earn you <b>15 Points</b>.(Type /motc for more help) /</li>' +
						'<li><b>2:30</b>-<i>Battle of the Leagues</i>-This tournament is in Gen 6 OU Monotype format and involves the different leagues on Frost. Each league has <b>ONE</b> representitive that will fight against other league\'s representitives. The winning representitive will recieve <b>30 Points</b> and everyone else in the league will recieve <b>15 Points</b>.</li>' +
						'<li><b>3:30</b>-<i>Regular users Tournament</i>-The format for this tournament is voted on in lobby, is held in the lobby, and has no size limit (there is a 3 minute registration period).First place gets <b>30 Points</b> and second place gets <b>20 Points</b>.</li></ul>' +
						'As always, make sure to have a fun time on Frost!');
	},
					
	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	potd: function(target, room, user) {
		if (!this.can('potd')) return false;
		config.potd = target;
		Simulator.SimulatorProcess.eval('config.potd = \''+toId(target)+'\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day is now '+target+'!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was changed to '+target+' by '+user.name+'.');
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>');
			this.logModCommand('The Pokemon of the Day was removed by '+user.name+'.');
		}
	},

	roll: 'dice',
	dice: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0,d));
			faces = NaN;
			if (target.length > d) var faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = new Array();
			var total = 0;
			for (var i=0; i < num; i++) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox('Random number ' + num + 'x(1 - ' + faces + '): ' + rolls.join(', ') + '<br />Total: ' + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply('The max roll must be a number under 21 digits.');
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox('Random number (1 - ' + maxRoll + '): ' + rand);
	},

	register: function() {
		if (!this.canBroadcast()) return;
		this.sendReply("You must win a rated battle to register.");
	},

	br: 'banredirect',
	banredirect: function(){
		this.sendReply('/banredirect - This command is obsolete and has been removed.');
	},

	lobbychat: function(target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply('You are now blocking lobby chat.');
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply('You are now receiving lobby chat.');
		}
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function(target, room, user) {
		target = target.toLowerCase();
		var matched = false;
		if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply('/msg OR /whisper OR /w [username], [message] - Send a private message.');
		}
		if (target === 'all' || target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply('/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
		}
		if (target === 'all' || target === 'getip' || target === 'ip') {
			matched = true;
			this.sendReply('/ip - Get your own IP address.');
			this.sendReply('/ip [username] - Get a user\'s IP address. Requires: @ & ~');
		}
		if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply('/rating - Get your own rating.');
			this.sendReply('/rating [username] - Get user\'s rating.');
		}
		if (target === 'all' || target === 'nick') {
			matched = true;
			this.sendReply('/nick [new username] - Change your username.');
		}
		if (target === 'all' || target === 'avatar') {
			matched = true;
			this.sendReply('/avatar [new avatar number] - Change your trainer sprite.');
		}
		if (target === 'all' || target === 'rooms') {
			matched = true;
			this.sendReply('/rooms [username] - Show what rooms a user is in.');
		}
		if (target === 'all' || target === 'whois') {
			matched = true;
			this.sendReply('/whois [username] - Get details on a username: group, and rooms.');
		}
		if (target === 'all' || target === 'data') {
			matched = true;
			this.sendReply('/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
			this.sendReply('!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~');
		}
		if (target === "all" || target === 'analysis') {
			matched = true;
			this.sendReply('/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.');
			this.sendReply('!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'groups') {
			matched = true;
			this.sendReply('/groups - Explains what the + % @ & next to people\'s names mean.');
			this.sendReply('!groups - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'opensource') {
			matched = true;
			this.sendReply('/opensource - Links to PS\'s source code repository.');
			this.sendReply('!opensource - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'avatars') {
			matched = true;
			this.sendReply('/avatars - Explains how to change avatars.');
			this.sendReply('!avatars - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'intro') {
			matched = true;
			this.sendReply('/intro - Provides an introduction to competitive pokemon.');
			this.sendReply('!intro - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'cap') {
			matched = true;
			this.sendReply('/cap - Provides an introduction to the Create-A-Pokemon project.');
			this.sendReply('!cap - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'om') {
			matched = true;
			this.sendReply('/om - Provides links to information on the Other Metagames.');
			this.sendReply('!om - Show everyone that information. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply('/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.')
			this.sendReply('!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~')
		}
		if (target === 'all' || target === 'calc' || target === 'caclulator') {
			matched = true;
			this.sendReply('/calc - Provides a link to a damage calculator');
			this.sendReply('!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~');
		}
		/*if (target === 'all' || target === 'blockchallenges' || target === 'idle') {
			matched = true;
			this.sendReply('/away - Blocks challenges so no one can challenge you. Deactivate it with /back.');
		}
		if (target === 'all' || target === 'allowchallenges') {
			matched = true;
			this.sendReply('/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.');
		}*/
		if (target === 'all' || target === 'away') {
			matched = true;
			this.sendReply('/away - Set yourself as away which will also change your name.');
		}
		if (target === 'all' || target === 'back') {
			matched = true;
			this.sendReply('/back - Marks yourself as back and reverts name back.');
		}
		if (target === 'all' || target === 'faq') {
			matched = true;
			this.sendReply('/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.');
			this.sendReply('!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~');
		}
		if (target === 'all' || target === 'highlight') {
			matched = true;
			this.sendReply('Set up highlights:');
			this.sendReply('/highlight add, word - add a new word to the highlight list.');
			this.sendReply('/highlight list - list all words that currently highlight you.');
			this.sendReply('/highlight delete, word - delete a word from the highlight list.');
			this.sendReply('/highlight delete - clear the highlight list');
		}
		if (target === 'all' || target === 'timestamps') {
			matched = true;
			this.sendReply('Set your timestamps preference:');
			this.sendReply('/timestamps [all|lobby|pms], [minutes|seconds|off]');
			this.sendReply('all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences');
			this.sendReply('off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]');
		}
		if (target === 'all' || target === 'effectiveness') {
			matched = true;
			this.sendReply('/effectiveness [type1], [type2] - Provides the effectiveness of a [type1] attack to a [type2] Pokémon.');
			this.sendReply('!effectiveness [type1], [type2] - Shows everyone the effectiveness of a [type1] attack to a [type2] Pokémon.');
		}
		if (target === 'all' || target === 'dexsearch') {
			matched = true;
			this.sendReply('/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.');
			this.sendReply('Search categories are: type, tier, color, moves, ability, gen.');
			this.sendReply('Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.');
			this.sendReply('Valid tiers are: Uber/OU/BL/UU/BL2/RU/NU/NFE/LC/CAP.');
			this.sendReply('Types must be followed by " type", e.g., "dragon type".');
			this.sendReply('The order of the parameters does not matter.');
		}
		if (target === 'all' || target === 'settype') {
			matched = true;
			this.sendReply('/settype [type] - Set your type, viewed in /whois and through /findtype command.')
		}
		if (target === 'all' || target === 'findtype') {
			matched = true;
			this.sendReply('/findtype [type], [optional, room or global] - Look for users of a specific type in your current room, or the entire server (global).')
		}
		if (target === 'all' || target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply('/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.');
			this.sendReply('/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.');
		}
		if (target === 'all' || target === 'complaint' || target === 'complain' || target === 'cry') {
			matched = true;
			this.sendReply('/complain OR /complaint [message] - Adds a complaint to the list of complaints which will be reviewed by server staff.');
		}
		if (target === 'all' || target === 'vote') {
			matched = true;
			this.sendReply('/vote [option] - votes for the specified option in the poll');
		}
		if (target === 'all' || target === 'tell') {
			matched = true;
			this.sendReply('/tell [username], [message] - Sends a message to the user which they see when they next speak');
		 }
		if (target === 'all' || target === 'tourstats' || target === 'ts') {
			matched = true;
			this.sendReply('/tourstats [username], [tier] - Shows the target users tournament stats. Tier may be replaced with \"all\" to view the targets ranking in every tier.');
		}
		if (target === 'all' || target === 'buy') {
			matched = true;
			this.sendReply('/buy [item] - buys the specified item, assuming you have enough money.');
			this.sendReply('If the item you are buying is an avatar, you must specify the image. ex: /buy [custom/animated],[image]');
		}
		if (target === 'all' || target === 'friends') {
			matched = true;
			this.sendReply('/friends - Shows all of the users on your friends list. Only works on the custom client.');
		}
		if (target === 'all' || target === 'addfriend') {
			matched = true;
			this.sendReply('/addfriend [user] - adds the specified user to your friends list. Only works on the custom client.');
		}
		if (target === 'all' || target === 'removefriend') {
			matched = true;
			this.sendReply('/removefriend [user] - removes the specified user from your friends list. Only works on the custom client.');
		}
		if (target === 'all' || target === 'join') {
			matched = true;
			this.sendReply('/join [roomname] - Attempts to join the room [roomname].');
		}
		if (target === 'all' || target === 'ignore') {
			matched = true;
			this.sendReply('/ignore [user] - Ignores all messages from the user [user].');
			this.sendReply('Note that staff messages cannot be ignored.');
		}
		if (target === 'all' || target === 'resetsymbol') {
			matched = true;
			this.sendReply('/resetsymbol - Resets your symbol back to default, only works if you have a custom symbol.');
		}
		if (target === 'all' || target === 'atm' || target === 'wallet' || target === 'satchel' || target === 'fannypack' || target === 'purse' || target === 'bag') {
			matched = true;
			this.sendReply('/wallet [username] - Shows you how many bucks and coins [username] has.');
		}
		if (target === 'all' || target === 'stafflist') {
			matched = true;
			this.sendReply('/stafflist - Shows you the list of staff members.');
		}
    	// Driver commands
    	if (target === '%' || target === 'unlink') {
    		matched = true;
    		this.sendReply('/unlink [username] - Prevents users from clicking on any links [username] has posted. Requires: % @ & ~')
    	}
		if (target === '%' || target === 'invite') {
			matched = true;
			this.sendReply('/invite [username], [roomname] - Invites the player [username] to join the room [roomname].');
		}
		if (target === '%' || target === 'roomban') {
			matched = true;
			this.sendReply('/roomban [username] - Bans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'roomunban') {
			matched = true;
			this.sendReply('/roomunban [username] - Unbans the user from the room you are in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply('/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~');
		}
		if (target === '%' || target === 'modnote') {
			matched = true;
			this.sendReply('/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~');
		}
		if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
			matched = true;
			this.sendReply('/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: % @ & ~');
		}
		if (target === '%' || target === 'redir' || target === 'redirect') {
			matched = true;
			this.sendReply('/redirect OR /redir [username], [room] - Forcibly move a user from the current room to [room]. Requires: % @ & ~');
		}
		if (target === '%' || target === 'modlog') {
			matched = true;
			this.sendReply('/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for "n" on room\'s log [roomid]. If you set [all] as [roomid], searches for "n" on all rooms\'s logs. Requires: % @ & ~');
		}
		if (target === "%" || target === 'kickbattle ') {
			matched = true;
			this.sendReply('/kickbattle [username], [reason] - Kicks an user from a battle with reason. Requires: % @ & ~');
		}
		if (target === "%" || target === 'warn') {
			matched = true;
			this.sendReply('/warn [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~');
		}
		if (target === "%" || target === 'kick' || target === 'k') {
			matched = true;
			this.sendReply('/kick OR /k [username] - Kicks a user from the room they are currently in. Requires: % @ & ~');
		}
		if (target === '%' || target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply('/mute OR /m [username], [reason] - Mute user with reason for 7 minutes. Requires: % @ & ~');
		}
		if (target === '%' || target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply('/hourmute OR /hm [username], [reason] - Mute user with reason for an hour. Requires: % @ & ~');
		}
		if (target === '%' || target === 'daymute') {
			matched = true;
			this.sendReply('/daymute [username], [reason] - Mute user with reason for one day / 24 hours. Requires: % @ & ~');
		}
		if (target === '%' || target === 'cmute' || target === 'cm') {
			matched = true;
			this.sendReply('/cmute [username], [time in hours] - Mute a user for the amount of hours. Requires: % @ & ~');
		}
		if (target === '%' || target === 'unmute') {
			matched = true;
			this.sendReply('/unmute [username] - Remove mute from user. Requires: % @ & ~');
		}
		if (target === '%' || target === 'showuserid' || target === 'getid') {
			matched = true;
			this.sendReply('/showuserid [username] - To get the raw id of the user. Requires: % @ & ~');
		}
		if (target === '%' || target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply('/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~');
		}
		// Moderator commands
		if (target === '@' || target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply('/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: @ & ~');
		}
		if (target === '@' || target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply('/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
		}
		if (target === '@' || target === 'unban') {
			matched = true;
			this.sendReply('/unban [username] - Unban a user. Requires: @ & ~');
		}
		if (target === '@' || target === 'unbanall') {
			matched = true;
			this.sendReply('/unbanall - Unban all IP addresses. Requires: @ & ~');
		}
		if (target === '@' || target === 'modchat') {
			matched = true;
			this.sendReply('/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options');
		}
		// Leader commands
		if (target === '&' || target === 'banip') {
			matched = true;
			this.sendReply('/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~');
		}
		if (target === '&' || target === 'permaban' || target === 'permban' || target === 'pban') {
     		matched = true;
      		this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
    	}
		if (target === '&' || target === 'promote') {
			matched = true;
			this.sendReply('/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'demote') {
			matched = true;
			this.sendReply('/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~');
		}
		if (target === '&' || target === 'forcetie') {
			matched = true;
			this.sendReply('/forcetie - Forces the current match to tie. Requires: & ~');
		}
		if (target === '&' || target === 'declare') {
			matched = true;
			this.sendReply('/declare [message] - Anonymously announces a message. Requires: & ~');
		}
		if (target === '&' || target === 'potd' ) {
			matched = true;
			this.sendReply('/potd [pokemon] - Sets the Random Battle Pokemon of the Day. Requires: & ~');
		}
		if (target === '&' || target === 'inactiverooms') {
			matched = true;
			this.sendReply('/inactiverooms - Lists all of the inactive rooms on the server. Requires: & ~');
		}
		if (target === '&' || target === 'roomlist') {
			matched = true;
			this.sendReply('/roomlist - Lists all of the rooms on the server, including inactive and private rooms. Requires: & ~');
		}
		if (target === '&' || target === 'takebucks' || target === 'removebucks' || target === 'tb' || target === 'rb') {
			matched = true;
			this.sendReply('/takebucks [username],[amount],[reason] - Removes bucks from [username]. Reason is optional. Requires: & ~');
		}
		if (target === '&' || target === 'givebucks' || target === 'gb' || target === 'awardbucks') {
			matched = true;
			this.sendReply('/givebucks [username],[amount],[reason] - Gives bucks to [username]. Reason is optional. Requires: & ~');
		}
		if (target === '&' || target === 'gdeclare' ) {
			matched = true;
			this.sendReply('/gdeclare [message] - Anonymously announces a message to all rooms. Requires: & ~');
		}
		if (target === '&' || target === 'gdeclarered') {
			matched = true;
			this.sendReply('/gdeclarered [message] - Anonymously announces a message to all rooms with a red background. Requires: & ~');
		}
		if (target === '&' || target === 'gdeclaregreen') {
			matched = true;
			this.sendReply('/gdeclaregreen [message] - Anonymously announces a message to all rooms with a green background. Requires: & ~');
		}
		if (target === '&' || target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply('/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: & ~');
		}
		if (target === '&' || target === 'customavatar') {
			matched = true;
			this.sendReply('/customavatar [username], [image] - Gives [username] the image as their avatar. Requires: & ~');
		}
		//Admin commands
		if (target === '~' || target === 'sendpopup' || target === 'spop') {
			matched = true;
			this.sendReply('/sendpopup [username], [message] - Sends a popup to [username] displaying [message].')
		}
		if (target === '~' || target === 'forcerenameto' || target === 'frt') {
			matched = true;
			this.sendReply('/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: ~');
		}
		if (target === '~' || target === 'awarditem') {
			matched = true;
			this.sendReply('/awarditem [username], [shop item] - Gives the user the item from the shop, for free! Requires: ~');
		}
		if (target === '~' || target === 'removeitem') {
			matched = true;
			this.sendReply('/removeitem [username], [shop item] - Removes the item from the user. Requires: ~');
		}
		if (target === '~' || target === 'hotpatch') {
			matched = true;
			this.sendReply('Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~');
			this.sendReply('Hot-patching has greater memory requirements than restarting.');
			this.sendReply('/hotpatch chat - reload chat-commands.js');
			this.sendReply('/hotpatch battles - spawn new simulator processes');
			this.sendReply('/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes');
		}
		if (target === '~' || target === 'lockdown') {
			matched = true;
			this.sendReply('/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~');
		}
		if (target === '~' || target === 'kill') {
			matched = true;
			this.sendReply('/kill - kills the server. Can\'t be done unless the server is in lockdown state. Requires: ~');
		}
		if (target === '~' || target === 'loadbanlist') {
			matched = true;
			this.sendReply('/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~');
		}
		if (target === '~' || target === 'makechatroom') {
			matched = true;
			this.sendReply('/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~');
		}
		if (target === '~' || target === 'deregisterchatroom') {
			matched = true;
			this.sendReply('/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~');
		}
		if (target === '~' || target === 'roomowner') {
			matched = true;
			this.sendReply('/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~');
		}
		if (target === '~' || target === 'roomdeowner') {
			matched = true;
			this.sendReply('/roomdeowner [username] - Removes [username]\'s status as a room owner. Requires: ~');
		}
		if (target === '~' || target === 'privateroom') {
			matched = true;
			this.sendReply('/privateroom [on/off] - Makes or unmakes a room private. Requires: ~');
		}
		if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply('/help OR /h OR /? - Gives you help.');
		}
		if (!target) {
			this.sendReply('COMMANDS: /msg, /reply, /ignore, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /highlight');
			this.sendReply('INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))');
			this.sendReply('For details on all room commands, use /roomhelp');
			this.sendReply('For details on all commands, use /help all');
			if (user.group !== config.groupsranking[0]) {
				this.sendReply('DRIVER COMMANDS: /mute, /unmute, /announce, /modlog, /forcerename, /alts')
				this.sendReply('MODERATOR COMMANDS: /ban, /unban, /unbanall, /ip, /modlog, /redirect, /kick');
				this.sendReply('LEADER COMMANDS: /promote, /demote, /forcewin, /forcetie, /declare, /permaban');
				this.sendReply('For details on all moderator commands, use /help @');
			}
			this.sendReply('For details of a specific command, use something like: /help data');
		} else if (!matched) {
			this.sendReply('The command "/'+target+'" was not found. Try /help for general help');
		}
	}, 

};
