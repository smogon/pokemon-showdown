// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

'use strict';

exports.BattleFormats = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	standardnext: {
		effectType: 'ValidatorRule',
		name: 'Standard NEXT',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Soul Dew'],
	},
	standardubers: {
		effectType: 'ValidatorRule',
		name: 'Standard Ubers',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	standardgbu: {
		effectType: 'ValidatorRule',
		name: 'Standard GBU',
		ruleset: ['Species Clause', 'Nickname Clause', 'Item Clause', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal', 'Battle Bond',
			'Mewtwo', 'Mew',
			'Lugia', 'Ho-Oh', 'Celebi',
			'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys',
			'Dialga', 'Palkia', 'Giratina', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
			'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect',
			'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion',
			'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow',
		],
		onValidateSet(set, format) {
			if (this.gen < 7 && toId(set.item) === 'souldew') {
				return [`${set.name || set.species} has Soul Dew, which is banned in ${format.name}.`];
			}
		},
	},
	standarddoubles: {
		effectType: 'ValidatorRule',
		name: 'Standard Doubles',
		ruleset: ['Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal'],
	},
	pokemon: {
		effectType: 'ValidatorRule',
		name: 'Pokemon',
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
			let allowCAP = !!(format && format.banlistTable && format.banlistTable['Rule:allowcap']);

			if (set.species === set.name) delete set.name;
			if (template.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			}
			if ((template.num === 25 || template.num === 172) && template.tier === 'Illegal') {
				problems.push(set.species + ' does not exist outside of gen ' + template.gen + '.');
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
			}

			if (!allowCAP && ability.isNonstandard) {
				problems.push(ability.name + ' does not exist.');
			}

			if (item.isNonstandard) {
				if (item.isNonstandard === 'gen2') {
					problems.push(item.name + ' does not exist outside of gen 2.');
				} else if (!allowCAP) {
					problems.push(item.name + ' does not exist.');
				}
			}

			for (let k in set.evs) {
				if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
					set.evs[k] = 0;
				}
				totalEV += set.evs[k];
			}
			// In gen 6, it is impossible to battle other players with pokemon that break the EV limit
			if (totalEV > 510 && this.gen === 6) {
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
				let reason = (format.requirePentagon ? " and this format requires gen " + this.gen + " Pokémon" : " in gen 6");
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
					problems.push("" + template.species + " transforms in-battle with " + template.requiredAbility + "."); // Darmanitan-Zen, Zygarde-Complete
				}
				if (template.requiredItems && !template.requiredItems.includes(item.name)) {
					problems.push("" + template.species + " transforms in-battle with " + Chat.plural(template.requiredItems.length, "either ") + template.requiredItems.join(" or ") + '.'); // Mega or Primal
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + template.species + " transforms in-battle with " + template.requiredMove + "."); // Meloetta-Pirouette, Rayquaza-Mega
				}
				if (!format.noChangeForme) set.species = template.baseSpecies; // Fix forme for Aegislash, Castform, etc.
			} else {
				if (template.requiredAbility && set.ability !== template.requiredAbility) {
					problems.push("" + (set.name || set.species) + " needs the ability " + template.requiredAbility + "."); // No cases currently.
				}
				if (template.requiredItems && !template.requiredItems.includes(item.name)) {
					problems.push("" + (set.name || set.species) + " needs to hold " + Chat.plural(template.requiredItems.length, "either ") + template.requiredItems.join(" or ") + '.'); // Memory/Drive/Griseous Orb/Plate/Z-Crystal - Forme mismatch
				}
				if (template.requiredMove && set.moves.indexOf(toId(template.requiredMove)) < 0) {
					problems.push("" + (set.name || set.species) + " needs to have the move " + template.requiredMove + "."); // Keldeo-Resolute
				}

				// Mismatches between the set forme (if not base) and the item signature forme will have been rejected already.
				// It only remains to assign the right forme to a set with the base species (Arceus/Genesect/Giratina/Silvally).
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

				if (!format.banlistTable['Rule:ignoreillegalabilities'] && !format.noChangeAbility) {
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
		effectType: 'ValidatorRule',
		name: 'Hoenn Pokedex',
		onValidateSet: function (set, format) {
			let hoennDex = {
				"Abra":1, "Absol":1, "Aggron":1, "Alakazam":1, "Altaria":1, "Anorith":1, "Armaldo":1, "Aron":1, "Azumarill":1, "Azurill":1, "Bagon":1, "Baltoy":1, "Banette":1, "Barboach":1, "Beautifly":1, "Beldum":1, "Bellossom":1, "Blaziken":1, "Breloom":1, "Budew":1, "Cacnea":1, "Cacturne":1, "Camerupt":1, "Carvanha":1, "Cascoon":1, "Castform":1, "Chimecho":1, "Chinchou":1, "Chingling":1, "Clamperl":1, "Claydol":1, "Combusken":1, "Corphish":1, "Corsola":1, "Cradily":1, "Crawdaunt":1, "Crobat":1, "Delcatty":1, "Dodrio":1, "Doduo":1, "Donphan":1, "Dusclops":1, "Dusknoir":1, "Duskull":1, "Dustox":1, "Electrike":1, "Electrode":1, "Exploud":1, "Feebas":1, "Flygon":1, "Froslass":1, "Gallade":1, "Gardevoir":1, "Geodude":1, "Girafarig":1, "Glalie":1, "Gloom":1, "Golbat":1, "Goldeen":1, "Golduck":1, "Golem":1, "Gorebyss":1, "Graveler":1, "Grimer":1, "Grovyle":1, "Grumpig":1, "Gulpin":1, "Gyarados":1, "Hariyama":1, "Heracross":1, "Horsea":1, "Huntail":1, "Igglybuff":1, "Illumise":1, "Jigglypuff":1, "Kadabra":1, "Kecleon":1, "Kingdra":1, "Kirlia":1, "Koffing":1, "Lairon":1, "Lanturn":1, "Latias":1, "Latios":1, "Lileep":1, "Linoone":1, "Lombre":1, "Lotad":1, "Loudred":1, "Ludicolo":1, "Lunatone":1, "Luvdisc":1, "Machamp":1, "Machoke":1, "Machop":1, "Magcargo":1, "Magikarp":1, "Magnemite":1, "Magneton":1, "Magnezone":1, "Makuhita":1, "Manectric":1, "Marill":1, "Marshtomp":1, "Masquerain":1, "Mawile":1, "Medicham":1, "Meditite":1, "Metagross":1, "Metang":1, "Mightyena":1, "Milotic":1, "Minun":1, "Mudkip":1, "Muk":1, "Natu":1, "Ninetales":1, "Ninjask":1, "Nosepass":1, "Numel":1, "Nuzleaf":1, "Oddish":1, "Pelipper":1, "Phanpy":1, "Pichu":1, "Pikachu":1, "Pinsir":1, "Plusle":1, "Poochyena":1, "Probopass":1, "Psyduck":1, "Raichu":1, "Ralts":1, "Regice":1, "Regirock":1, "Registeel":1, "Relicanth":1, "Rhydon":1, "Rhyhorn":1, "Rhyperior":1, "Roselia":1, "Roserade":1, "Sableye":1, "Salamence":1, "Sandshrew":1, "Sandslash":1, "Sceptile":1, "Seadra":1, "Seaking":1, "Sealeo":1, "Seedot":1, "Seviper":1, "Sharpedo":1, "Shedinja":1, "Shelgon":1, "Shiftry":1, "Shroomish":1, "Shuppet":1, "Silcoon":1, "Skarmory":1, "Skitty":1, "Slaking":1, "Slakoth":1, "Slugma":1, "Snorunt":1, "Solrock":1, "Spheal":1, "Spinda":1, "Spoink":1, "Starmie":1, "Staryu":1, "Surskit":1, "Swablu":1, "Swalot":1, "Swampert":1, "Swellow":1, "Taillow":1, "Tentacool":1, "Tentacruel":1, "Torchic":1, "Torkoal":1, "Trapinch":1, "Treecko":1, "Tropius":1, "Vibrava":1, "Vigoroth":1, "Vileplume":1, "Volbeat":1, "Voltorb":1, "Vulpix":1, "Wailmer":1, "Wailord":1, "Walrein":1, "Weezing":1, "Whiscash":1, "Whismur":1, "Wigglytuff":1, "Wingull":1, "Wobbuffet":1, "Wurmple":1, "Wynaut":1, "Xatu":1, "Zangoose":1, "Zigzagoon":1, "Zubat":1,
			};
			let template = this.getTemplate(set.species || set.name);
			if (!(template.baseSpecies in hoennDex) && format.banlistTable[template.speciesid] !== false) {
				return [template.baseSpecies + " is not in the Hoenn Pokédex."];
			}
		},
	},
	alolapokedex: {
		effectType: 'ValidatorRule',
		name: 'Alola Pokedex',
		onValidateSet: function (set, format) {
			let alolaDex = {
				"Rowlet":1, "Dartrix":1, "Decidueye":1, "Litten":1, "Torracat":1, "Incineroar":1, "Popplio":1, "Brionne":1, "Primarina":1, "Pikipek":1, "Trumbeak":1, "Toucannon":1, "Yungoos":1, "Gumshoos":1, "Rattata-Alola":1, "Raticate-Alola":1, "Caterpie":1, "Metapod":1, "Butterfree":1, "Ledyba":1, "Ledian":1, "Spinarak":1, "Ariados":1, "Pichu":1, "Pikachu":1, "Raichu-Alola":1, "Grubbin":1, "Charjabug":1, "Vikavolt":1, "Bonsly":1, "Sudowoodo":1, "Happiny":1, "Chansey":1, "Blissey":1, "Munchlax":1, "Snorlax":1, "Slowpoke":1, "Slowbro":1, "Slowking":1, "Wingull":1, "Pelipper":1, "Abra":1, "Kadabra":1, "Alakazam":1, "Meowth-Alola":1, "Persian-Alola":1, "Magnemite":1, "Magneton":1, "Magnezone":1, "Grimer-Alola":1, "Muk-Alola":1, "Growlithe":1, "Arcanine":1, "Drowzee":1, "Hypno":1, "Makuhita":1, "Hariyama":1, "Smeargle":1, "Crabrawler":1, "Crabominable":1, "Gastly":1, "Haunter":1, "Gengar":1, "Drifloon":1, "Drifblim":1, "Misdreavus":1, "Mismagius":1, "Zubat":1, "Golbat":1, "Crobat":1, "Diglett-Alola":1, "Dugtrio-Alola":1, "Spearow":1, "Fearow":1, "Rufflet":1, "Braviary":1, "Vullaby":1, "Mandibuzz":1, "Mankey":1, "Primeape":1, "Delibird":1, "Oricorio":1, "Cutiefly":1, "Ribombee":1, "Petilil":1, "Lilligant":1, "Cottonee":1, "Whimsicott":1, "Psyduck":1, "Golduck":1, "Magikarp":1, "Gyarados":1, "Barboach":1, "Whiscash":1, "Machop":1, "Machoke":1, "Machamp":1, "Roggenrola":1, "Boldore":1, "Gigalith":1, "Carbink":1, "Sableye":1, "Rockruff":1, "Lycanroc":1, "Spinda":1, "Tentacool":1, "Tentacruel":1, "Finneon":1, "Lumineon":1, "Wishiwashi":1, "Luvdisc":1, "Corsola":1, "Mareanie":1, "Toxapex":1, "Shellder":1, "Cloyster":1, "Bagon":1, "Shelgon":1, "Salamence":1, "Lillipup":1, "Herdier":1, "Stoutland":1, "Eevee":1, "Vaporeon":1, "Jolteon":1, "Flareon":1, "Espeon":1, "Umbreon":1, "Leafeon":1, "Glaceon":1, "Sylveon":1, "Mudbray":1, "Mudsdale":1, "Igglybuff":1, "Jigglypuff":1, "Wigglytuff":1, "Tauros":1, "Miltank":1, "Surskit":1, "Masquerain":1, "Dewpider":1, "Araquanid":1, "Fomantis":1, "Lurantis":1, "Morelull":1, "Shiinotic":1, "Paras":1, "Parasect":1, "Poliwag":1, "Poliwhirl":1, "Poliwrath":1, "Politoed":1, "Goldeen":1, "Seaking":1, "Feebas":1, "Milotic":1, "Alomomola":1, "Fletchling":1, "Fletchinder":1, "Talonflame":1, "Salandit":1, "Salazzle":1, "Cubone":1, "Marowak-Alola":1, "Kangaskhan":1, "Magby":1, "Magmar":1, "Magmortar":1, "Stufful":1, "Bewear":1, "Bounsweet":1, "Steenee":1, "Tsareena":1, "Comfey":1, "Pinsir":1, "Oranguru":1, "Passimian":1, "Goomy":1, "Sliggoo":1, "Goodra":1, "Castform":1, "Wimpod":1, "Golisopod":1, "Staryu":1, "Starmie":1, "Sandygast":1, "Palossand":1, "Cranidos":1, "Rampardos":1, "Shieldon":1, "Bastiodon":1, "Archen":1, "Archeops":1, "Tirtouga":1, "Carracosta":1, "Phantump":1, "Trevenant":1, "Nosepass":1, "Probopass":1, "Pyukumuku":1, "Chinchou":1, "Lanturn":1, "Type: Null":1, "Silvally":1, "Zygarde":1, "Trubbish":1, "Garbodor":1, "Skarmory":1, "Ditto":1, "Cleffa":1, "Clefairy":1, "Clefable":1, "Minior":1, "Beldum":1, "Metang":1, "Metagross":1, "Porygon":1, "Porygon2":1, "Porygon-Z":1, "Pancham":1, "Pangoro":1, "Komala":1, "Torkoal":1, "Turtonator":1, "Togedemaru":1, "Elekid":1, "Electabuzz":1, "Electivire":1, "Geodude-Alola":1, "Graveler-Alola":1, "Golem-Alola":1, "Sandile":1, "Krokorok":1, "Krookodile":1, "Trapinch":1, "Vibrava":1, "Flygon":1, "Gible":1, "Gabite":1, "Garchomp":1, "Klefki":1, "Mimikyu":1, "Bruxish":1, "Drampa":1, "Absol":1, "Snorunt":1, "Glalie":1, "Froslass":1, "Sneasel":1, "Weavile":1, "Sandshrew-Alola":1, "Sandslash-Alola":1, "Vulpix-Alola":1, "Ninetales-Alola":1, "Vanillite":1, "Vanillish":1, "Vanilluxe":1, "Snubbull":1, "Granbull":1, "Shellos":1, "Gastrodon":1, "Relicanth":1, "Dhelmise":1, "Carvanha":1, "Sharpedo":1, "Wailmer":1, "Wailord":1, "Lapras":1, "Exeggcute":1, "Exeggutor-Alola":1, "Jangmo-o":1, "Hakamo-o":1, "Kommo-o":1, "Emolga":1, "Scyther":1, "Scizor":1, "Murkrow":1, "Honchkrow":1, "Riolu":1, "Lucario":1, "Dratini":1, "Dragonair":1, "Dragonite":1, "Aerodactyl":1, "Tapu Koko":1, "Tapu Lele":1, "Tapu Bulu":1, "Tapu Fini":1, "Cosmog":1, "Cosmoem":1, "Solgaleo":1, "Lunala":1, "Nihilego":1, "Buzzwole":1, "Pheromosa":1, "Xurkitree":1, "Celesteela":1, "Kartana":1, "Guzzlord":1, "Necrozma":1, "Magearna":1, "Marshadow":1,
			};
			let template = this.getTemplate(set.species || set.name);
			if (!(template.baseSpecies in alolaDex) && !(template.species in alolaDex) && format.banlistTable[template.speciesid] !== false) {
				return [template.baseSpecies + " is not in the Alola Pokédex."];
			}
		},
	},
	potd: {
		effectType: 'Rule',
		name: 'PotD',
		onStart: function () {
			if (Config.potd) {
				this.add('rule', "Pokemon of the Day: " + this.getTemplate(Config.potd).name);
			}
		},
	},
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		onStartPriority: -10,
		onStart: function () {
			this.add('clearpoke');
			for (let i = 0; i < this.sides[0].pokemon.length; i++) {
				let pokemon = this.sides[0].pokemon[i];
				let details = pokemon.details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo|Silvally)(-[a-zA-Z?]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
			for (let i = 0; i < this.sides[1].pokemon.length; i++) {
				let pokemon = this.sides[1].pokemon[i];
				let details = pokemon.details.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo|Silvally)(-[a-zA-Z?]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, pokemon.item ? 'item' : '');
			}
		},
		onTeamPreview: function () {
			this.makeRequest('teampreview');
		},
	},
	littlecup: {
		effectType: 'ValidatorRule',
		name: 'Little Cup',
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
		effectType: 'ValidatorRule',
		name: 'Species Clause',
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
		effectType: 'ValidatorRule',
		name: 'Nickname Clause',
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
		effectType: 'ValidatorRule',
		name: 'Item Clause',
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
		effectType: 'ValidatorRule',
		name: 'Ability Clause',
		onStart: function () {
			this.add('rule', 'Ability Clause: Limit two of each ability');
		},
		onValidateTeam: function (team, format) {
			let abilityTable = {};
			let base = {
				airlock: 'cloudnine',
				battlearmor: 'shellarmor',
				clearbody: 'whitesmoke',
				dazzling: 'queenlymajesty',
				emergencyexit: 'wimpout',
				filter: 'solidrock',
				gooey: 'tanglinghair',
				insomnia: 'vitalspirit',
				ironbarbs: 'roughskin',
				minus: 'plus',
				powerofalchemy: 'receiver',
				teravolt: 'moldbreaker',
				turboblaze: 'moldbreaker',
			};
			for (let i = 0; i < team.length; i++) {
				let ability = toId(team[i].ability);
				if (!ability) continue;
				if (ability in base) ability = base[ability];
				if (ability in abilityTable) {
					if (abilityTable[ability] >= 2) {
						return ["You are limited to two of each ability by the Ability Clause.", `(You have more than two ${this.getAbility(ability).name} variants)`];
					}
					abilityTable[ability]++;
				} else {
					abilityTable[ability] = 1;
				}
			}
		},
	},
	ateclause: {
		effectType: 'ValidatorRule',
		name: '-ate Clause',
		banlist: ['Aerilate + Pixilate + Refrigerate > 1'],
		onStart: function () {
			this.add('rule', '-ate Clause: Limit one of Aerilate/Refrigerate/Pixilate');
		},
	},
	ohkoclause: {
		effectType: 'ValidatorRule',
		name: 'OHKO Clause',
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
		effectType: 'ValidatorRule',
		name: 'Evasion Abilities Clause',
		banlist: ['Sand Veil', 'Snow Cloak'],
		onStart: function () {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		},
	},
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		banlist: ['Minimize', 'Double Team'],
		onStart: function () {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
		onValidateSet: function (set, format, setHas) {
			let item = this.getItem(set.item);
			if (!item.zMove) return;
			let evasionBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.type === item.zMoveType) {
					if (move.zMoveBoost && move.zMoveBoost.evasion > 0) {
						evasionBoosted = true;
						break;
					}
				}
			}
			if (!evasionBoosted) return;
			return [(set.name || set.species) + " can boost Evasion, which is banned by Evasion Clause."];
		},
	},
	endlessbattleclause: {
		effectType: 'Rule',
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
		effectType: 'ValidatorRule',
		name: 'Moody Clause',
		banlist: ['Moody'],
		onStart: function () {
			this.add('rule', 'Moody Clause: Moody is banned');
		},
	},
	swaggerclause: {
		effectType: 'ValidatorRule',
		name: 'Swagger Clause',
		banlist: ['Swagger'],
		onStart: function () {
			this.add('rule', 'Swagger Clause: Swagger is banned');
		},
	},
	batonpassclause: {
		effectType: 'ValidatorRule',
		name: 'Baton Pass Clause',
		banlist: ["Baton Pass > 1"],
		onStart: function () {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateSet: function (set, format, setHas) {
			if (!('batonpass' in setHas)) return;

			// check if Speed is boosted
			let speedBoosted = false;
			let nonSpeedBoosted = false;
			if (toId(set.item) === 'eeviumz') {
				speedBoosted = true;
				nonSpeedBoosted = true;
			}
			let item = this.getItem(set.item);
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && move.boosts.spe > 0) {
					speedBoosted = true;
				}
				if (move.boosts && (move.boosts.atk > 0 || move.boosts.def > 0 || move.boosts.spa > 0 || move.boosts.spd > 0)) {
					nonSpeedBoosted = true;
				}
				if (item.zMove && move.type === item.zMoveType) {
					if (move.zMoveBoost && move.zMoveBoost.spe > 0) {
						if (!speedBoosted) speedBoosted = move.name;
					}
					if (move.zMoveBoost && (move.zMoveBoost.atk > 0 || move.zMoveBoost.def > 0 || move.zMoveBoost.spa > 0 || move.zMoveBoost.spd > 0)) {
						if (!nonSpeedBoosted || move.name === speedBoosted) nonSpeedBoosted = move.name;
					}
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

			// if both boost sources are Z-moves, and they're distinct
			if (speedBoosted !== nonSpeedBoosted && typeof speedBoosted === 'string' && typeof nonSpeedBoosted === 'string') return;

			return [(set.name || set.species) + " can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause."];
		},
	},
	cfzclause: {
		effectType: 'ValidatorRule',
		name: 'CFZ Clause',
		banlist: ['10,000,000 Volt Thunderbolt', 'Acid Downpour', 'All-Out Pummeling', 'Black Hole Eclipse', 'Bloom Doom', 'Breakneck Blitz', 'Catastropika', 'Continental Crush', 'Corkscrew Crash', 'Devastating Drake', 'Extreme Evoboost', 'Genesis Supernova', 'Gigavolt Havoc', 'Guardian of Alola', 'Hydro Vortex', 'Inferno Overdrive', 'Malicious Moonsault', 'Never-Ending Nightmare', 'Oceanic Operetta', 'Pulverizing Pancake', 'Savage Spin-Out', 'Shattered Psyche', 'Sinister Arrow Raid', 'Soul-Stealing 7-Star Strike', 'Stoked Sparksurfer', 'Subzero Slammer', 'Supersonic Skystrike', 'Tectonic Rage', 'Twinkle Tackle'],
		onStart: function () {
			this.add('rule', 'CFZ Clause: Crystal-free Z-Moves are banned');
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
		name: 'Cancel Mod',
		onStart: function () {
			this.supportCancel = true;
		},
	},
	sleepclausemod: {
		effectType: 'Rule',
		name: 'Sleep Clause Mod',
		banlist: ['Hypnosis + Gengarite'],
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
		name: 'Freeze Clause Mod',
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
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		onStart: function () {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam: function (team) {
			let typeTable;
			for (let i = 0; i < team.length; i++) {
				let template = this.getTemplate(team[i].species);
				if (!template.types) return ["Your team must share a type."];
				if (i === 0) {
					typeTable = template.types;
				} else {
					typeTable = typeTable.filter(type => template.types.indexOf(type) >= 0);
				}
				let item = this.getItem(team[i].item);
				if (item.megaStone && template.species === item.megaEvolves) {
					template = this.getTemplate(item.megaStone);
					typeTable = typeTable.filter(type => template.types.indexOf(type) >= 0);
				}
				if (!typeTable.length) return ["Your team must share a type."];
			}
		},
	},
	megarayquazaclause: {
		effectType: 'Rule',
		name: 'Mega Rayquaza Clause',
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
	inversemod: {
		effectType: 'Rule',
		name: 'Inverse Mod',
		onNegateImmunity: false,
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	sketchclause: {
		effectType: 'ValidatorRule',
		name: 'Sketch Clause',
		onValidateTeam: function (team) {
			let sketchedMoves = {};
			for (let i = 0; i < team.length; i++) {
				let move = team[i].sketchmonsMove;
				if (!move) continue;
				if (move in sketchedMoves) {
					return ["You are limited to sketching one of each move by the Sketch Clause.", "(You have sketched " + this.getMove(move).name + " more than once)"];
				}
				sketchedMoves[move] = (team[i].name || team[i].species);
			}
		},
	},
	ignoreillegalabilities: {
		effectType: 'ValidatorRule',
		name: 'Ignore Illegal Abilities',
		// Implemented in the 'pokemon' ruleset and in teamvalidator.js
	},
	allowonesketch: {
		effectType: 'ValidatorRule',
		name: 'Allow One Sketch',
		// Implemented in teamvalidator.js
	},
	allowcap: {
		effectType: 'ValidatorRule',
		name: 'Allow CAP',
		// Implemented in the 'pokemon' ruleset
	},
};
