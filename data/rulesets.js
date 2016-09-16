// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

'use strict';

exports.BattleFormats = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	standardnext: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Soul Dew'],
	},
	standardubers: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	standardgbu: {
		effectType: 'Banlist',
		ruleset: ['Species Clause', 'Nickname Clause', 'Item Clause', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal', 'Soul Dew',
			'Mewtwo',
			'Mew',
			'Lugia',
			'Ho-Oh',
			'Celebi',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Jirachi',
			'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Phione',
			'Manaphy',
			'Darkrai',
			'Shaymin', 'Shaymin-Sky',
			'Arceus',
			'Victini',
			'Reshiram',
			'Zekrom',
			'Kyurem', 'Kyurem-Black', 'Kyurem-White',
			'Keldeo',
			'Meloetta',
			'Genesect',
			'Xerneas',
			'Yveltal',
			'Zygarde',
			'Diancie',
			'Hoopa', 'Hoopa-Unbound',
			'Volcanion',
		],
	},
	standarddoubles: {
		effectType: 'Banlist',
		ruleset: ['Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	pokemon: {
		effectType: 'Banlist',
		onValidateTeam: function (team, format) {
			let problems = [];
			// ----------- legality line ------------------------------------------
			if (!format || !format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement
			let kyurems = 0;
			for (let i = 0; i < team.length; i++) {
				if (team[i].species === 'Kyurem-White' || team[i].species === 'Kyurem-Black') {
					if (kyurems > 0) {
						problems.push('You cannot have more than one Kyurem-Black/Kyurem-White.');
						break;
					}
					kyurems++;
				}
			}
			return problems;
		},
		onChangeSet: function (set, format) {
			let item = this.getItem(set.item);
			let template = this.getTemplate(set.species);
			let problems = [];
			let totalEV = 0;
			let allowCAP = !!(format && format.banlistTable && format.banlistTable['allowcap']);

			if (set.species === set.name) delete set.name;
			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			}
			let ability = {};
			if (set.ability) {
				ability = this.getAbility(set.ability);
				if (ability.gen > this.gen) {
					problems.push(ability.name + ' does not exist in gen ' + this.gen + '.');
				}
			}
			if (set.moves) {
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (!allowCAP && move.isNonstandard) {
						problems.push(move.name + ' does not exist.');
					}
				}
			}
			if (item.gen > this.gen) {
				problems.push(item.name + ' does not exist in gen ' + this.gen + '.');
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}

			if (!allowCAP || template.tier !== 'CAP') {
				if (template.isNonstandard) {
					problems.push(set.species + ' does not exist.');
				}
				if (ability.isNonstandard) {
					problems.push(ability.name + ' does not exist.');
				}
				if (item.isNonstandard) {
					if (item.isNonstandard === 'gen2') {
						problems.push(item.name + ' does not exist outside of gen 2.');
					} else {
						problems.push(item.name + ' does not exist.');
					}
				}
			}
			for (let k in set.evs) {
				if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
					set.evs[k] = 0;
				}
				totalEV += set.evs[k];
			}
			// In gen 6, it is impossible to battle other players with pokemon that break the EV limit
			if (totalEV > 510 && this.gen >= 6) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			// ----------- legality line ------------------------------------------
			if (!format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// only in gen 1 and 2 it was legal to max out all EVs
			if (this.gen >= 3 && totalEV > 510) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			if (template.gender) {
				if (set.gender !== template.gender) {
					set.gender = template.gender;
				}
			} else {
				if (set.gender !== 'M' && set.gender !== 'F') {
					set.gender = undefined;
				}
			}

			// Legendary Pokemon must have at least 3 perfect IVs in gen 6
			let baseTemplate = this.getTemplate(template.baseSpecies);
			if (set.ivs && this.gen >= 6 && (baseTemplate.gen >= 6 || format.requirePentagon) && (template.eggGroups[0] === 'Undiscovered' || template.species === 'Manaphy') && !template.prevo && !template.nfe &&
				// exceptions
				template.species !== 'Unown' && template.baseSpecies !== 'Pikachu' && (template.baseSpecies !== 'Diancie' || !set.shiny)) {
				let perfectIVs = 0;
				for (let i in set.ivs) {
					if (set.ivs[i] >= 31) perfectIVs++;
				}
				let reason = (format.requirePentagon ? " and this format requires gen 6 Pokémon" : " in gen 6");
				if (perfectIVs < 3) problems.push((set.name || set.species) + " must have at least three perfect IVs because it's a legendary" + reason + ".");
			}

			// limit one of each move
			let moves = [];
			if (set.moves) {
				let hasMove = {};
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;

			let battleForme = template.battleOnly && template.species;
			if (battleForme) {
				if (template.requiredAbility && set.ability !== template.requiredAbility) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredAbility + "."); // Darmanitan-Zen
				}
				if (template.requiredItem && item.name !== template.requiredItem) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredItem + '.'); // Mega or Primal
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredMove + "."); // Meloetta-Pirouette, Rayquaza-Mega
				}
				if (!format.noChangeForme) set.species = template.baseSpecies; // Fix forme for Aegislash, Castform, etc.
			} else {
				if (template.requiredAbility && set.ability !== template.requiredAbility) {
					problems.push("" + (set.name || set.species) + " needs the ability " + template.requiredAbility + "."); // No cases currently.
				}
				if (template.requiredItem && item.name !== template.requiredItem) {
					problems.push("" + (set.name || set.species) + " needs to hold " + template.requiredItem + '.'); // Plate/Drive/Griseous Orb - Forme mismatch
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + (set.name || set.species) + " needs to have the move " + template.requiredMove + "."); // Keldeo-Resolute
				}

				// Mismatches between the set forme (if not base) and the item signature forme will have been rejected already.
				// It only remains to assign the right forme to a set with the base species (Arceus/Genesect/Giratina).
				if (item.forcedForme && template.species === this.getTemplate(item.forcedForme).baseSpecies && !format.noChangeForme) {
					set.species = item.forcedForme;
				}
			}

			if (template.species === 'Pikachu-Cosplay') {
				let cosplay = {meteormash:'Pikachu-Rock-Star', iciclecrash:'Pikachu-Belle', drainingkiss:'Pikachu-Pop-Star', electricterrain:'Pikachu-PhD', flyingpress:'Pikachu-Libre'};
				for (let i = 0; i < set.moves.length; i++) {
					if (set.moves[i] in cosplay) {
						set.species = cosplay[set.moves[i]];
						break;
					}
				}
			}

			if (set.species !== template.species) {
				// Autofixed forme.
				template = this.getTemplate(set.species);

				if (!format.banlistTable['ignoreillegalabilities'] && !format.noChangeAbility) {
					// Ensure that the ability is (still) legal.
					let legalAbility = false;
					for (let i in template.abilities) {
						if (template.abilities[i] !== set.ability) continue;
						legalAbility = true;
						break;
					}
					if (!legalAbility) { // Default to first ability.
						set.ability = template.abilities['0'];
					}
				}
			}

			return problems;
		},
	},
	hoennpokedex: {
		effectType: 'Rule',
		onValidateSet: function (set) {
			let hoennDex = {
				"Abra":1, "Absol":1, "Aggron":1, "Alakazam":1, "Altaria":1, "Anorith":1, "Armaldo":1, "Aron":1, "Azumarill":1, "Azurill":1, "Bagon":1, "Baltoy":1, "Banette":1, "Barboach":1, "Beautifly":1, "Beldum":1, "Bellossom":1, "Blaziken":1, "Breloom":1, "Budew":1, "Cacnea":1, "Cacturne":1, "Camerupt":1, "Carvanha":1, "Cascoon":1, "Castform":1, "Chimecho":1, "Chinchou":1, "Chingling":1, "Clamperl":1, "Claydol":1, "Combusken":1, "Corphish":1, "Corsola":1, "Cradily":1, "Crawdaunt":1, "Crobat":1, "Delcatty":1, "Dodrio":1, "Doduo":1, "Donphan":1, "Dusclops":1, "Dusknoir":1, "Duskull":1, "Dustox":1, "Electrike":1, "Electrode":1, "Exploud":1, "Feebas":1, "Flygon":1, "Froslass":1, "Gallade":1, "Gardevoir":1, "Geodude":1, "Girafarig":1, "Glalie":1, "Gloom":1, "Golbat":1, "Goldeen":1, "Golduck":1, "Golem":1, "Gorebyss":1, "Graveler":1, "Grimer":1, "Grovyle":1, "Grumpig":1, "Gulpin":1, "Gyarados":1, "Hariyama":1, "Heracross":1, "Horsea":1, "Huntail":1, "Igglybuff":1, "Illumise":1, "Jigglypuff":1, "Kadabra":1, "Kecleon":1, "Kingdra":1, "Kirlia":1, "Koffing":1, "Lairon":1, "Lanturn":1, "Latias":1, "Latios":1, "Lileep":1, "Linoone":1, "Lombre":1, "Lotad":1, "Loudred":1, "Ludicolo":1, "Lunatone":1, "Luvdisc":1, "Machamp":1, "Machoke":1, "Machop":1, "Magcargo":1, "Magikarp":1, "Magnemite":1, "Magneton":1, "Magnezone":1, "Makuhita":1, "Manectric":1, "Marill":1, "Marshtomp":1, "Masquerain":1, "Mawile":1, "Medicham":1, "Meditite":1, "Metagross":1, "Metang":1, "Mightyena":1, "Milotic":1, "Minun":1, "Mudkip":1, "Muk":1, "Natu":1, "Ninetales":1, "Ninjask":1, "Nosepass":1, "Numel":1, "Nuzleaf":1, "Oddish":1, "Pelipper":1, "Phanpy":1, "Pichu":1, "Pikachu":1, "Pinsir":1, "Plusle":1, "Poochyena":1, "Probopass":1, "Psyduck":1, "Raichu":1, "Ralts":1, "Regice":1, "Regirock":1, "Registeel":1, "Relicanth":1, "Rhydon":1, "Rhyhorn":1, "Rhyperior":1, "Roselia":1, "Roserade":1, "Sableye":1, "Salamence":1, "Sandshrew":1, "Sandslash":1, "Sceptile":1, "Seadra":1, "Seaking":1, "Sealeo":1, "Seedot":1, "Seviper":1, "Sharpedo":1, "Shedinja":1, "Shelgon":1, "Shiftry":1, "Shroomish":1, "Shuppet":1, "Silcoon":1, "Skarmory":1, "Skitty":1, "Slaking":1, "Slakoth":1, "Slugma":1, "Snorunt":1, "Solrock":1, "Spheal":1, "Spinda":1, "Spoink":1, "Starmie":1, "Staryu":1, "Surskit":1, "Swablu":1, "Swalot":1, "Swampert":1, "Swellow":1, "Taillow":1, "Tentacool":1, "Tentacruel":1, "Torchic":1, "Torkoal":1, "Trapinch":1, "Treecko":1, "Tropius":1, "Vibrava":1, "Vigoroth":1, "Vileplume":1, "Volbeat":1, "Voltorb":1, "Vulpix":1, "Wailmer":1, "Wailord":1, "Walrein":1, "Weezing":1, "Whiscash":1, "Whismur":1, "Wigglytuff":1, "Wingull":1, "Wobbuffet":1, "Wurmple":1, "Wynaut":1, "Xatu":1, "Zangoose":1, "Zigzagoon":1, "Zubat":1,
			};
			let template = this.getTemplate(set.species || set.name);
			if (!(template.baseSpecies in hoennDex)) {
				return [template.baseSpecies + " is not in the Hoenn Pokédex."];
			}
		},
	},
	potd: {
		effectType: 'Rule',
		onStart: function () {
			if (Config.potd) {
				this.add('rule', "Pokemon of the Day: " + this.getTemplate(Config.potd).name);
			}
		},
	},
	teampreview: {
		effectType: 'Rule',
		onStartPriority: -10,
		onStart: function () {
			this.add('clearpoke');
			for (let i = 0; i < this.sides[0].pokemon.length; i++) {
				let pokemon = this.sides[0].pokemon[i];
				let details = pokemon.details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)(-[a-zA-Z?]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
			for (let i = 0; i < this.sides[1].pokemon.length; i++) {
				let pokemon = this.sides[1].pokemon[i];
				let details = pokemon.details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo)(-[a-zA-Z?]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
		},
		onTeamPreview: function () {
			let lengthData = this.getFormat().teamLength;
			this.makeRequest('teampreview', lengthData && lengthData.battle || '');
		},
	},
	littlecup: {
		effectType: 'Rule',
		onValidateSet: function (set) {
			let template = this.getTemplate(set.species || set.name);
			if (template.prevo) {
				return [set.species + " isn't the first in its evolution family."];
			}
			if (!template.nfe) {
				return [set.species + " doesn't have an evolution family."];
			}
		},
	},
	speciesclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Species Clause: Limit one of each Pokémon');
		},
		onValidateTeam: function (team, format) {
			let speciesTable = {};
			for (let i = 0; i < team.length; i++) {
				let template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return ["You are limited to one of each Pokémon by Species Clause.", "(You have more than one " + template.baseSpecies + ")"];
				}
				speciesTable[template.num] = true;
			}
		},
	},
	nicknameclause: {
		effectType: 'Rule',
		onValidateTeam: function (team, format) {
			let nameTable = {};
			for (let i = 0; i < team.length; i++) {
				let name = team[i].name;
				if (name) {
					if (name === team[i].species) continue;
					if (nameTable[name]) {
						return ["Your Pokémon must have different nicknames.", "(You have more than one " + name + ")"];
					}
					nameTable[name] = true;
				}
			}
			// Illegality of impersonation of other species is
			// hardcoded in team-validator.js, so we are done.
		},
	},
	itemclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Item Clause: Limit one of each item');
		},
		onValidateTeam: function (team, format) {
			let itemTable = {};
			for (let i = 0; i < team.length; i++) {
				let item = toId(team[i].item);
				if (!item) continue;
				if (itemTable[item]) {
					return ["You are limited to one of each item by Item Clause.", "(You have more than one " + this.getItem(item).name + ")"];
				}
				itemTable[item] = true;
			}
		},
	},
	abilityclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Ability Clause: Limit two of each ability');
		},
		onValidateTeam: function (team, format) {
			let abilityTable = {};
			for (let i = 0; i < team.length; i++) {
				let ability = toId(team[i].ability);
				if (!ability) continue;
				if (ability in abilityTable) {
					if (abilityTable[ability] >= 2) {
						return ["You are limited to two of each ability by the Ability Clause.", "(You have more than two " + this.getAbility(ability).name + ")"];
					}
					abilityTable[ability]++;
				} else {
					abilityTable[ability] = 1;
				}
			}
		},
	},
	ateclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', '-ate Clause: Limit one of Aerilate/Refrigerate/Pixilate');
		},
		onValidateTeam: function (team, format) {
			let ateAbility = false;
			for (let i = 0; i < team.length; i++) {
				let ability = toId(team[i].ability);
				if (ability === 'refrigerate' || ability === 'pixilate' || ability === 'aerilate') {
					if (ateAbility) return [team[i].name + " has more than one of Aerilate/Refrigerate/Pixilate, which is banned by -ate Clause."];
					ateAbility = true;
				}
			}
		},
	},
	ohkoclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'OHKO Clause: OHKO moves are banned');
		},
		onValidateSet: function (set) {
			let problems = [];
			if (set.moves) {
				for (let i = 0; i < set.moves.length; i++) {
					let move = this.getMove(set.moves[i]);
					if (move.ohko) problems.push(move.name + ' is banned by OHKO Clause.');
				}
			}
			return problems;
		},
	},
	evasionabilitiesclause: {
		effectType: 'Banlist',
		name: 'Evasion Abilities Clause',
		banlist: ['Sand Veil', 'Snow Cloak'],
		onStart: function () {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		},
	},
	evasionmovesclause: {
		effectType: 'Banlist',
		name: 'Evasion Moves Clause',
		banlist: ['Minimize', 'Double Team'],
		onStart: function () {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
	},
	endlessbattleclause: {
		effectType: 'Banlist',
		name: 'Endless Battle Clause',
		// implemented in battle-engine.js

		// A Pokémon has a confinement counter, which starts at 0:
		// +1 confinement whenever:
		// - it has no available moves other than Struggle
		// - it was forced to switch by a stale opponent before it could do its
		//   action for the turn
		// - it intentionally switched out the turn after it switched in against
		//   a stale Pokémon
		// - it shifts in Triples against a stale Pokémon
		// - it has gone 5 turns without losing PP (mimiced/transformed moves
		//   count only if no foe is stale)
		// confinement reset to 0 whenever:
		// - it uses PP while not Transformed/Impostered
		// - if it has at least 2 confinement, and begins a turn without losing
		//   at least 1% of its max HP from the last time its confinement counter
		//   was 0 - user also becomes half-stale if not already half-stale, or
		//   stale if already half-stale

		// A Pokémon is also considered stale if:
		// - it has gained a Leppa berry through any means besides starting
		//   with one
		// - OR it has eaten a Leppa berry it isn't holding

		onStart: function () {
			this.add('rule', 'Endless Battle Clause: Forcing endless battles is banned');
		},
	},
	moodyclause: {
		effectType: 'Banlist',
		name: 'Moody Clause',
		banlist: ['Moody'],
		onStart: function () {
			this.add('rule', 'Moody Clause: Moody is banned');
		},
	},
	swaggerclause: {
		effectType: 'Banlist',
		name: 'Swagger Clause',
		banlist: ['Swagger'],
		onStart: function () {
			this.add('rule', 'Swagger Clause: Swagger is banned');
		},
	},
	batonpassclause: {
		effectType: 'Banlist',
		name: 'Baton Pass Clause',
		onStart: function () {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateTeam: function (team, format) {
			let BPcount = 0;
			for (let i = 0; i < team.length; i++) {
				if (team[i].moves.indexOf('Baton Pass') >= 0) {
					BPcount++;
				}
				if (BPcount > 1) {
					return [(team[i].name || team[i].species) + " has Baton Pass, but you are limited to one Baton Pass user by Baton Pass Clause."];
				}
			}
		},
		onValidateSet: function (set, format, setHas) {
			if (!('batonpass' in setHas)) return;

			// check if Speed is boosted
			let speedBoosted = false;
			let nonSpeedBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && move.boosts.spe > 0) {
					speedBoosted = true;
				}
				if (move.boosts && (move.boosts.atk > 0 || move.boosts.def > 0 || move.boosts.spa > 0 || move.boosts.spd > 0)) {
					nonSpeedBoosted = true;
				}
			}

			let boostSpeed = ['flamecharge', 'geomancy', 'motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor', 'blazikenite', 'salacberry'];
			if (!speedBoosted) {
				for (let i = 0; i < boostSpeed.length; i++) {
					if (boostSpeed[i] in setHas) {
						speedBoosted = true;
						break;
					}
				}
			}
			if (!speedBoosted) {
				return;
			}

			// check if non-Speed boosted
			let boostNonSpeed = ['acupressure', 'starfberry', 'curse', 'poweruppunch', 'rage', 'rototiller', 'fellstinger', 'bellydrum', 'download', 'justified', 'moxie', 'sapsipper', 'defiant', 'angerpoint', 'cellbattery', 'liechiberry', 'snowball', 'weaknesspolicy', 'diamondstorm', 'flowershield', 'skullbash', 'stockpile', 'cottonguard', 'ganlonberry', 'keeberry', 'chargebeam', 'fierydance', 'geomancy', 'lightningrod', 'stormdrain', 'competitive', 'absorbbulb', 'petayaberry', 'charge', 'apicotberry', 'luminousmoss', 'marangaberry'];
			if (!nonSpeedBoosted) {
				for (let i = 0; i < boostNonSpeed.length; i++) {
					if (boostNonSpeed[i] in setHas) {
						nonSpeedBoosted = true;
						break;
					}
				}
			}
			if (!nonSpeedBoosted) return;

			return [(set.name || set.species) + " can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause."];
		},
	},
	batonpassspeedclause: {
		effectType: 'Banlist',
		name: 'Baton Pass Speed Clause',
		onStart: function () {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Speed');
		},
		onValidateTeam: function (team, format) {
			let BPcount = 0;
			for (let i = 0; i < team.length; i++) {
				if (team[i].moves.indexOf('Baton Pass') >= 0) {
					BPcount++;
				}
				if (BPcount > 1) {
					return [(team[i].name || team[i].species) + " has Baton Pass, but you are limited to one Baton Pass user by Baton Pass Clause."];
				}
			}
		},
		onValidateSet: function (set, format, setHas) {
			if (!('batonpass' in setHas)) return;

			// check if Speed is boosted
			let speedBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && move.boosts.spe > 0) {
					speedBoosted = true;
				}
			}

			let boostSpeed = ['flamecharge', 'geomancy', 'motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor', 'blazikenite', 'salacberry'];
			if (!speedBoosted) {
				for (let i = 0; i < boostSpeed.length; i++) {
					if (boostSpeed[i] in setHas) {
						speedBoosted = true;
						break;
					}
				}
			}
			if (!speedBoosted) {
				return;
			}
			return [(set.name || set.species) + " can Baton Pass Speed boosts, which is banned by Baton Pass Speed Clause."];
		},
	},
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		onStart: function () {
			this.add('rule', 'HP Percentage Mod: HP is shown in percentages');
			this.reportPercentages = true;
		},
	},
	exacthpmod: {
		effectType: 'Rule',
		name: 'Exact HP Mod',
		onStart: function () {
			this.add('rule', 'Exact HP Mod: Exact HP is shown');
			this.reportExactHP = true;
		},
	},
	cancelmod: {
		effectType: 'Rule',
		onStart: function () {
			this.supportCancel = true;
		},
	},
	sleepclausemod: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Sleep Clause Mod: Limit one foe put to sleep');
		},
		onSetStatus: function (status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (let i = 0; i < target.side.pokemon.length; i++) {
					let pokemon = target.side.pokemon[i];
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusData.source || pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause Mod activated.');
							return false;
						}
					}
				}
			}
		},
	},
	freezeclausemod: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Freeze Clause Mod: Limit one foe frozen');
		},
		onSetStatus: function (status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (let i = 0; i < target.side.pokemon.length; i++) {
					let pokemon = target.side.pokemon[i];
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		},
	},
	sametypeclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam: function (team, format, teamHas) {
			if (!team[0]) return;
			let template = this.getTemplate(team[0].species);
			let typeTable = template.types;
			if (!typeTable) return ["Your team must share a type."];
			for (let i = 1; i < team.length; i++) {
				template = this.getTemplate(team[i].species);
				if (!template.types) return ["Your team must share a type."];

				typeTable = typeTable.filter(type => template.types.indexOf(type) >= 0);
				if (!typeTable.length) return ["Your team must share a type."];
			}
			if (format.id === 'monotype') {
				// Very complex bans
				if (typeTable.length > 1) return;
				switch (typeTable[0]) {
				case 'Steel':
					if (teamHas['aegislash']) return ["Aegislash is banned from Steel monotype teams."];
					break;
				}
			}
		},
	},
	megarayquazaclause: {
		effectType: 'Rule',
		onStart: function () {
			this.add('rule', 'Mega Rayquaza Clause: You cannot mega evolve Rayquaza');
			for (let i = 0; i < this.sides[0].pokemon.length; i++) {
				if (this.sides[0].pokemon[i].speciesid === 'rayquaza') this.sides[0].pokemon[i].canMegaEvo = false;
			}
			for (let i = 0; i < this.sides[1].pokemon.length; i++) {
				if (this.sides[1].pokemon[i].speciesid === 'rayquaza') this.sides[1].pokemon[i].canMegaEvo = false;
			}
		},
	},
};
