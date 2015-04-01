// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// XY Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Battle",
		section: "ORAS Singles",

		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Unrated Random Battle",
		section: "ORAS Singles",

		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "OU",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite']
	},
	{
		name: "OU (suspect test)",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Mewtwo', 'Lugia', 'Ho-Oh', 'Blaziken', 'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense',
			'Deoxys-Speed', 'Dialga', 'Palkia', 'Giratina', 'Darkrai', 'Shaymin-Sky', 'Arceus', 'Reshiram', 'Zekrom', 'Kyurem-White',
			'Genesect', 'Greninja', 'Aegislash', 'Xerneas', 'Yveltal',
			'Soul Dew', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite'
		]
	},
	{
		name: "OU (no Mega)",
		section: "ORAS Singles",

		ruleset: ['OU'],
		onBegin: function () {
			for (var i = 0; i < this.p1.pokemon.length; i++) {
				this.p1.pokemon[i].canMegaEvo = false;
			}
			for (var i = 0; i < this.p2.pokemon.length; i++) {
				this.p2.pokemon[i].canMegaEvo = false;
			}
		}
	},
	{
		name: "Ubers",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Standard Ubers', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Ban Mod'],
		banlist: []
	},
	{
		name: "UU",
		section: "ORAS Singles",

		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Alakazite', 'Altarianite', 'Diancite', 'Heracronite', 'Galladite', 'Gardevoirite', 'Lopunnite', 'Medichamite',
			'Metagrossite', 'Pinsirite', 'Drizzle', 'Drought', 'Shadow Tag'
		]
	},
	{
		name: "RU",
		section: "ORAS Singles",

		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Galladite', 'Houndoominite', 'Pidgeotite']
	},
	{
		name: "NU",
		section: "ORAS Singles",

		ruleset: ['RU'],
		banlist: ['RU', 'BL3', 'Glalitite', 'Steelixite']
	},
	{
		name: "LC",
		section: "ORAS Singles",

		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger']
	},
	{
		name: "Anything Goes",
		section: "ORAS Singles",

		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal']
	},
	/*{
		name: "CAP Plasmanta Playtest",
		section: "ORAS Singles",

		ruleset: ['CAP Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Soul Dew',
			'Tomohawk', 'Necturna', 'Mollux', 'Aurumoth', 'Malaconda', 'Cawmodore', 'Volkraken', 'Syclant', 'Revenankh', 'Pyroak', 'Fidgit', 'Stratagem', 'Arghonaut', 'Kitsunoh', 'Cyclohm', 'Colossoil', 'Krilowatt', 'Voodoom'
		]
	},*/
	{
		name: "Battle Spot Singles",
		section: "ORAS Singles",

		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 3) return ['You must bring at least three Pokémon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Custom Game",
		section: "ORAS Singles",

		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Doubles Battle",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Smogon Doubles",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom', 'Salamencite', 'Soul Dew', 'Dark Void'
		]
	},
	{
		name: "Smogon Doubles Ubers",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Pokemon', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void']
	},
	{
		name: "Smogon Doubles UU",
		section: "ORAS Doubles",

		gameType: 'doubles',
		ruleset: ['Smogon Doubles'],
		banlist: ['Aegislash', 'Amoonguss', 'Azumarill', 'Bisharp', 'Breloom', 'Chandelure', 'Charizard', 'Conkeldurr',
		'Cresselia', 'Deoxys-Attack', 'Diancie', 'Dragonite', 'Excadrill', 'Ferrothorn', 'Garchomp', 'Gardevoir',
		'Gengar', 'Greninja', 'Gyarados', 'Heatran', 'Hitmontop', 'Hydreigon', 'Kangaskhan', 'Keldeo',
		'Kyurem-Black', 'Landorus-Therian', 'Latios', 'Ludicolo', 'Mamoswine', 'Mawile', 'Meowstic', 'Metagross',
		'Politoed', 'Porygon2', 'Rotom-Wash', 'Sableye', 'Salamence', 'Scizor', 'Scrafty', 'Shaymin-Sky',
		'Slowbro', 'Suicune', 'Swampert', 'Sylveon', 'Talonflame', 'Terrakion', 'Thundurus', 'Togekiss',
		'Tyranitar', 'Venusaur', 'Volcarona', 'Whimsicott', 'Zapdos'
		]
	},
	{
		name: "Battle Spot Doubles (VGC 2015)",
		section: "ORAS Doubles",

		gameType: 'doubles',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Tornadus + Defiant', 'Thundurus + Defiant', 'Landorus + Sheer Force'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 4) return ['You must bring at least four Pokémon.'];
		},
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Doubles Challenge Cup",
		section: "ORAS Doubles",

		gameType: 'doubles',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Doubles Custom Game",
		section: "ORAS Doubles",

		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// XY Triples
	///////////////////////////////////////////////////////////////////

	{
		name: "Random Triples Battle",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomDoubles',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Smogon Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Perish Song'
		]
	},
	{
		name: "Battle Spot Triples",
		section: "ORAS Triples",

		gameType: 'triples',
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview'],
		requirePentagon: true,
		validateTeam: function (team, format) {
			if (team.length < 6) return ['You must have six Pokémon.'];
		}
	},
	{
		name: "Triples Challenge Cup",
		section: "ORAS Triples",

		gameType: 'triples',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Triples Custom Game",
		section: "ORAS Triples",

		gameType: 'triples',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		name: "Final Destination",
		section: "OM of the Decade",
		column: 2,

		team: 'randomFinalDestination',
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Final Destination Clause'],
	},
	{
		name: "Inheritance",
		section: "OM of the Month",
		column: 2,

		ruleset: ['Pokemon', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause', 'Sleep Clause Mod', 'Cancel Mod'],
		banlist: ['Soul Dew', 'Gengarite', 'Kangaskhanite', 'Blazikenite', 'Mawilite', 'Salamencite',
			'Gengar-Mega', 'Kangaskhan-Mega', 'Mewtwo', 'Lugia', 'Ho-Oh', 'Mawile-Mega', 'Salamence-Mega',
			'Kyogre', 'Groudon', 'Rayquaza', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed',
			'Dialga', 'Palkia', 'Giratina', 'Giratina-Origin', 'Darkrai', 'Shaymin-Sky', 'Arceus', 'Reshiram', 'Zekrom',
			'Kyurem-White', 'Xerneas', 'Yveltal',
			'Slaking', 'Regigigas', 'Shedinja', 'Keldeo', 'Archeops', 'Kyurem-Black'
		],
		validateSet: (function () {
			var pokemonWithAbility;
			var createAbilityMap = function () {
				var abilityMap = Object.create(null);
				for (var speciesid in Tools.data.Pokedex) {
					var pokemon = Tools.data.Pokedex[speciesid];
					for (var key in pokemon.abilities) {
						var abilityId = toId(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId].push(speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				return abilityMap;
			};
			var getPokemonWithAbility = function (ability) {
				if (!pokemonWithAbility) pokemonWithAbility = createAbilityMap();
				return pokemonWithAbility[toId(ability)] || [];
			};
			var restrictedAbilities = {
				'Wonder Guard':1, 'Pure Power':1, 'Huge Power':1,
				'Shadow Tag':1, 'Imposter':1, 'Parental Bond':1
			};
			return function (set, teamHas) {
				var format = this.getFormat('inheritance');
				var problems = [];
				var inheritFailed = [];
				var isIncompatibility;
				var isHidden = false;
				var lsetData = {set:set, format:format};
				var name = set.name || set.species;

				var setHas = {};

				if (format.ruleset) {
					for (var i = 0; i < format.ruleset.length; i++) {
						var subformat = this.getFormat(format.ruleset[i]);
						if (subformat.validateSet) {
							problems = problems.concat(subformat.validateSet.call(this, set, format) || []);
						}
					}
				}
				var originalTemplate = this.getTemplate(set.species);
				var template = originalTemplate;

				var item = this.getItem(set.item);
				var ability = this.getAbility(set.ability);

				if (!ability.name) return [name + " needs to have an ability."];

				var banlistTable = this.getBanlistTable(format);

				var check = template.id;
				var clause = '';
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
					problems.push(set.species + ' is banned' + clause + '.');
				} else if (!this.data.FormatsData[check] || !this.data.FormatsData[check].tier) {
					check = toId(template.baseSpecies);
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(template.baseSpecies + ' is banned' + clause + '.');
					}
				}

				check = toId(set.ability);
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
					problems.push(name + "'s ability " + set.ability + " is banned" + clause + ".");
				}
				check = toId(set.item);
				setHas[check] = true;
				if (banlistTable[check]) {
					clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
					problems.push(name + "'s item " + set.item + " is banned" + clause + ".");
				}
				if (banlistTable['Unreleased'] && item.isUnreleased) {
					problems.push(name + "'s item " + set.item + " is unreleased.");
				}

				for (var i = 0; i < set.moves.length; i++) {
					var move = this.getMove(string(set.moves[i]));
					set.moves[i] = move.name;
					check = move.id;
					setHas[check] = true;
					if (banlistTable[check]) {
						clause = typeof banlistTable[check] === 'string' ? " by " + banlistTable[check] : '';
						problems.push(name + "'s move " + set.moves[i] + " is banned" + clause + ".");
					}

					if (banlistTable['Unreleased']) {
						if (move.isUnreleased) problems.push(name + "'s move " + set.moves[i] + " is unreleased.");
					}
				}

				if (set.level < template.evoLevel) {
					// FIXME: Event pokemon given at a level under what it normally can be attained at gives a false positive
					problems.push(name + " must be at least level " + template.evoLevel + " to be evolved.");
				}

				if (problems.length) return problems;

				var pokemonPool = getPokemonWithAbility(ability);

				for (var it = 0; it < pokemonPool.length; it++) {
					problems = [];
					isIncompatibility = false;
					template = this.getTemplate(pokemonPool[it]);
					if (originalTemplate.species !== template.species) {
						if (template.species === 'Smeargle') {
							problems.push(name + " can't inherit from Smeargle.");
						} else if (ability.name in restrictedAbilities &&
							ability.name !== originalTemplate.abilities['0'] &&
							ability.name !== originalTemplate.abilities['1'] &&
							ability.name !== originalTemplate.abilities['H']) {
							problems.push(name + " can't have " + set.ability + ".");
						}
					}
					var check;
					var clause = '';
					if (banlistTable['Unreleased'] && template.isUnreleased) {
						if (!format.requirePentagon || (template.eggGroups[0] === 'Undiscovered' && !template.evos)) {
							problems.push(name + " (" + template.species + ") is unreleased.");
						}
					}

					if (ability.name === template.abilities['H']) {
						isHidden = true;

						if (template.unreleasedHidden && banlistTable['illegal']) {
							problems.push(name + "'s hidden ability is unreleased.");
						} else if (this.gen === 5 && set.level < 10 && (template.maleOnlyHidden || template.gender === 'N')) {
							problems.push(name + " must be at least level 10 with its hidden ability.");
						}
						if (template.maleOnlyHidden) {
							set.gender = 'M';
							lsetData.sources = ['5D'];
						}
					}

					for (var i = 0; i < set.moves.length; i++) {
						var move = this.getMove(set.moves[i]);

						var problem = format.checkLearnset.call(this, move, template, lsetData);
						if (problem) {
							var problemString = name + " can't learn " + move.name;
							if (problem.type === 'incompatible') {
								if (isHidden) {
									problemString = problemString.concat(" because it's incompatible with its ability or another move.");
								} else {
									problemString = problemString.concat(" because it's incompatible with another move.");
								}
								isIncompatibility = true;
							} else if (problem.type === 'oversketched') {
								problemString = problemString.concat(" because it can only sketch " + problem.maxSketches + " move" + (problem.maxSketches > 1 ? "s" : "") + ".");
								isIncompatibility = true;
							} else if (problem.type === 'pokebank') {
								problemString = problemString.concat(" because it's only obtainable from a previous generation.");
								isIncompatibility = true;
							} else {
								problemString = problemString.concat(".");
							}
							problems.push(problemString);
						}
					}

					if (lsetData.sources && lsetData.sources.length === 1 && !lsetData.sourcesBefore) {
						// we're restricted to a single source
						var source = lsetData.sources[0];
						if (source.substr(1, 1) === 'S') {
							// it's an event
							var eventData = null;
							var splitSource = source.substr(2).split(' ');
							var eventTemplate = this.getTemplate(splitSource[1]);
							if (eventTemplate.eventPokemon) eventData = eventTemplate.eventPokemon[parseInt(splitSource[0], 10)];
							if (eventData) {
								if (eventData.nature && eventData.nature !== set.nature) {
									problems.push(name + " must have a " + eventData.nature + " nature because it has a move only available from a specific event.");
								}
								if (eventData.shiny) {
									set.shiny = true;
								}
								if (eventData.generation < 5) eventData.isHidden = false;
								if (eventData.isHidden !== undefined && eventData.isHidden !== isHidden) {
									problems.push(name + (isHidden ? " can't have" : " must have") + " its hidden ability because it has a move only available from a specific event.");
								}
								if (this.gen <= 5 && eventData.abilities && eventData.abilities.indexOf(ability.id) < 0) {
									problems.push(name + " must have " + eventData.abilities.join(" or ") + " because it has a move only available from a specific event.");
								}
								if (eventData.gender) {
									set.gender = eventData.gender;
								}
								if (eventData.level && set.level < eventData.level) {
									problems.push(name + " must be at least level " + eventData.level + " because it has a move only available from a specific event.");
								}
							}
							isHidden = false;
						}
					}
					if (isHidden && lsetData.sourcesBefore) {
						if (!lsetData.sources && lsetData.sourcesBefore < 5) {
							problems.push(name + " has a hidden ability - it can't have moves only learned before gen 5.");
						} else if (lsetData.sources && template.gender && template.gender !== 'F' && !{'Nidoran-M':1, 'Nidorino':1, 'Nidoking':1, 'Volbeat':1}[template.species]) {
							var compatibleSource = false;
							for (var i = 0, len = lsetData.sources.length; i < len; i++) {
								if (lsetData.sources[i].charAt(1) === 'E' || (lsetData.sources[i].substr(0, 2) === '5D' && set.level >= 10)) {
									compatibleSource = true;
									break;
								}
							}
							if (!compatibleSource) {
								problems.push(name + " has moves incompatible with its hidden ability.");
							}
						}
					}
					if (!lsetData.sources && lsetData.sourcesBefore <= 3 && this.getAbility(set.ability).gen === 4 && !template.prevo && this.gen <= 5) {
						problems.push(name + " has a gen 4 ability and isn't evolved - it can't use anything from gen 3.");
					}
					if (!lsetData.sources && lsetData.sourcesBefore >= 3 && (isHidden || this.gen <= 5) && template.gen <= lsetData.sourcesBefore) {
						var oldAbilities = this.mod('gen' + lsetData.sourcesBefore).getTemplate(template.species).abilities;
						if (ability.name !== oldAbilities['0'] && ability.name !== oldAbilities['1'] && !oldAbilities['H']) {
							problems.push(name + " has moves incompatible with its ability.");
						}
					}

					setHas[toId(template.tier)] = true;
					if (banlistTable[template.tier]) {
						problems.push(name + " is in " + template.tier + ", which is banned.");
					}

					if (teamHas) {
						for (var i in setHas) {
							teamHas[i] = true;
						}
					}
					for (var i = 0; i < format.setBanTable.length; i++) {
						var bannedCombo = true;
						for (var j = 0; j < format.setBanTable[i].length; j++) {
							if (!setHas[format.setBanTable[i][j]]) {
								bannedCombo = false;
								break;
							}
						}
						if (bannedCombo) {
							clause = format.name ? " by " + format.name : '';
							problems.push(name + " has the combination of " + format.setBanTable[i].join(' + ') + ", which is banned" + clause + ".");
						}
					}

					if (!problems.length) {
						if (set.forcedLevel) set.level = set.forcedLevel;
						return false;
					}

					if (isIncompatibility) {
						inheritFailed.push({
							species: template.species,
							problems: problems
						});
					}
				}

				switch (inheritFailed.length) {
				case 0:
					return [name + " has an illegal Inheritance set."];
				case 1:
					return [name + " has an illegal set (incompatibility) inherited from " + inheritFailed[0].species].concat(inheritFailed[0].problems);
				case 2:
					return [name + " has an illegal set (incompatibility) inherited either from " + inheritFailed[0].species + " or " + inheritFailed[1].species];
				default:
					return [name + " has an illegal set due to incompatibility."];
				}
			};
		})(),
		checkLearnset: function (move, template, lsetData) {
			move = toId(move);
			template = this.getTemplate(template);

			lsetData = lsetData || {};
			var set = (lsetData.set || (lsetData.set = {}));
			var format = (lsetData.format || (lsetData.format = {}));
			var alreadyChecked = {};
			var level = set.level || 100;

			var isHidden = false;
			if (set.ability && this.getAbility(set.ability).name === template.abilities['H']) isHidden = true;
			var incompatibleHidden = false;

			var limit1 = true;
			var sketch = false;
			var blockedHM = false;

			var sometimesPossible = false; // is this move in the learnset at all?

			// This is a pretty complicated algorithm

			// Abstractly, what it does is construct the union of sets of all
			// possible ways this pokemon could be obtained, and then intersect
			// it with a the pokemon's existing set of all possible ways it could
			// be obtained. If this intersection is non-empty, the move is legal.

			// We apply several optimizations to this algorithm. The most
			// important is that with, for instance, a TM move, that Pokemon
			// could have been obtained from any gen at or before that TM's gen.
			// Instead of adding every possible source before or during that gen,
			// we keep track of a maximum gen variable, intended to mean "any
			// source at or before this gen is possible."

			// set of possible sources of a pokemon with this move, represented as an array
			var sources = [];
			// the equivalent of adding "every source at or before this gen" to sources
			var sourcesBefore = 0;
			var noPastGen = !!format.requirePentagon;
			// since Gen 3, Pokemon cannot be traded to past generations
			var noFutureGen = this.gen >= 3 ? true : !!(format.banlistTable && format.banlistTable['tradeback']);

			do {
				alreadyChecked[template.speciesid] = true;
				if (lsetData.ignoreMoveType && this.getMove(move).type === lsetData.ignoreMoveType) return false;
				if (template.learnset) {
					if (template.learnset[move] || template.learnset['sketch']) {
						sometimesPossible = true;
						var lset = template.learnset[move];
						if (!lset || template.speciesid === 'smeargle') {
							lset = template.learnset['sketch'];
							sketch = true;
							// Chatter, Struggle and Magikarp's Revenge cannot be sketched
							if (move in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1}) return true;
						}
						if (typeof lset === 'string') lset = [lset];

						for (var i = 0, len = lset.length; i < len; i++) {
							var learned = lset[i];
							if (noPastGen && learned.charAt(0) !== '6') continue;
							if (noFutureGen && parseInt(learned.charAt(0), 10) > this.gen) continue;
							if (learned.charAt(0) !== '6' && isHidden && !this.mod('gen' + learned.charAt(0)).getTemplate(template.species).abilities['H']) {
								// check if the Pokemon's hidden ability was available
								incompatibleHidden = true;
								continue;
							}
							if (!template.isNonstandard) {
								// HMs can't be transferred
								if (this.gen >= 4 && learned.charAt(0) <= 3 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'flash':1, 'rocksmash':1, 'waterfall':1, 'dive':1}) continue;
								if (this.gen >= 5 && learned.charAt(0) <= 4 && move in {'cut':1, 'fly':1, 'surf':1, 'strength':1, 'rocksmash':1, 'waterfall':1, 'rockclimb':1}) continue;
								// Defog and Whirlpool can't be transferred together
								if (this.gen >= 5 && move in {'defog':1, 'whirlpool':1} && learned.charAt(0) <= 4) blockedHM = true;
							}
							if (learned.substr(0, 2) in {'4L':1, '5L':1, '6L':1}) {
								// gen 4-6 level-up moves
								if (level >= parseInt(learned.substr(2), 10)) {
									// we're past the required level to learn it
									return false;
								}
								if (!template.gender || template.gender === 'F') {
									// available as egg move
									learned = learned.charAt(0) + 'Eany';
								} else {
									// this move is unavailable, skip it
									continue;
								}
							}
							if (learned.charAt(1) in {L:1, M:1, T:1}) {
								if (learned.charAt(0) === '6') {
									// current-gen TM or tutor moves:
									// always available
									return false;
								}
								// past-gen level-up, TM, or tutor moves:
								// available as long as the source gen was or was before this gen
								limit1 = false;
								sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
							} else if (learned.charAt(1) in {E:1, S:1, D:1}) {
								// egg, event, or DW moves:
								// only if that was the source
								if (learned.charAt(1) === 'E') {
									// it's an egg move, so we add each pokemon that can be bred with to its sources
									if (learned.charAt(0) === '6') {
										// gen 6 doesn't have egg move incompatibilities except for certain cases with baby Pokemon
										learned = '6E' + (template.prevo ? template.id : '');
										sources.push(learned);
										continue;
									}
									var eggGroups = template.eggGroups;
									if (!eggGroups) continue;
									if (eggGroups[0] === 'Undiscovered') eggGroups = this.getTemplate(template.evos[0]).eggGroups;
									var atLeastOne = false;
									var fromSelf = (learned.substr(1) === 'Eany');
									learned = learned.substr(0, 2);
									for (var templateid in this.data.Pokedex) {
										var dexEntry = this.getTemplate(templateid);
										if (
											// CAP pokemon can't breed
											!dexEntry.isNonstandard &&
											// can't breed mons from future gens
											dexEntry.gen <= parseInt(learned.charAt(0), 10) &&
											// genderless pokemon can't pass egg moves
											(dexEntry.gender !== 'N' || this.gen <= 1 && dexEntry.gen <= 1)) {
											if (
												// chainbreeding
												fromSelf ||
												// otherwise parent must be able to learn the move
												!alreadyChecked[dexEntry.speciesid] && dexEntry.learnset && (dexEntry.learnset[move] || dexEntry.learnset['sketch'])) {
												if (dexEntry.eggGroups.intersect(eggGroups).length) {
													// we can breed with it
													atLeastOne = true;
													sources.push(learned + dexEntry.id);
												}
											}
										}
									}
									// chainbreeding with itself from earlier gen
									if (!atLeastOne) sources.push(learned + template.id);
									// Egg move tradeback for gens 1 and 2.
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else if (learned.charAt(1) === 'S') {
									// Event Pokémon:
									//	Available as long as the past gen can get the Pokémon and then trade it back.
									sources.push(learned + ' ' + template.id);
									if (!noFutureGen) sourcesBefore = Math.max(sourcesBefore, parseInt(learned.charAt(0), 10));
								} else {
									// DW Pokemon are at level 10 or at the evolution level
									var minLevel = (template.evoLevel && template.evoLevel > 10) ? template.evoLevel : 10;
									if (set.level < minLevel) continue;
									sources.push(learned);
								}
							}
						}
					}
					if (format.mimicGlitch && template.gen < 5) {
						// include the Mimic Glitch when checking this mon's learnset
						var glitchMoves = {metronome:1, copycat:1, transform:1, mimic:1, assist:1};
						var getGlitch = false;
						for (var i in glitchMoves) {
							if (template.learnset[i]) {
								if (!(i === 'mimic' && this.getAbility(set.ability).gen === 4 && !template.prevo)) {
									getGlitch = true;
									break;
								}
							}
						}
						if (getGlitch) {
							sourcesBefore = Math.max(sourcesBefore, 4);
							if (this.getMove(move).gen < 5) {
								limit1 = false;
							}
						}
					}
				}
				// also check to see if the mon's prevo or freely switchable formes can learn this move
				if (!template.learnset && template.baseSpecies !== template.species) {
					// forme takes precedence over prevo only if forme has no learnset
					template = this.getTemplate(template.baseSpecies);
				} else if (template.prevo) {
					template = this.getTemplate(template.prevo);
					if (template.gen > Math.max(2, this.gen)) template = null;
					if (template && !template.abilities['H']) isHidden = false;
				} else if (template.baseSpecies !== template.species && template.baseSpecies !== 'Kyurem' && template.baseSpecies !== 'Pikachu') {
					template = this.getTemplate(template.baseSpecies);
				} else {
					template = null;
				}
			} while (template && template.species && !alreadyChecked[template.speciesid]);

			if (limit1 && sketch) {
				// limit 1 sketch move
				if (lsetData.sketchMove) {
					return {type:'oversketched', maxSketches: 1};
				}
				lsetData.sketchMove = move;
			}

			// Now that we have our list of possible sources, intersect it with the current list
			if (!sourcesBefore && !sources.length) {
				if (noPastGen && sometimesPossible) return {type:'pokebank'};
				if (incompatibleHidden) return {type:'incompatible'};
				return true;
			}
			if (!sources.length) sources = null;
			if (sourcesBefore || lsetData.sourcesBefore) {
				// having sourcesBefore is the equivalent of having everything before that gen
				// in sources, so we fill the other array in preparation for intersection
				var learned;
				if (sourcesBefore && lsetData.sources) {
					if (!sources) sources = [];
					for (var i = 0, len = lsetData.sources.length; i < len; i++) {
						learned = lsetData.sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= sourcesBefore) {
							sources.push(learned);
						}
					}
					if (!lsetData.sourcesBefore) sourcesBefore = 0;
				}
				if (lsetData.sourcesBefore && sources) {
					if (!lsetData.sources) lsetData.sources = [];
					for (var i = 0, len = sources.length; i < len; i++) {
						learned = sources[i];
						if (parseInt(learned.substr(0, 1), 10) <= lsetData.sourcesBefore) {
							lsetData.sources.push(learned);
						}
					}
					if (!sourcesBefore) delete lsetData.sourcesBefore;
				}
			}
			if (sources) {
				if (lsetData.sources) {
					var intersectSources = lsetData.sources.intersect(sources);
					if (!intersectSources.length && !(sourcesBefore && lsetData.sourcesBefore)) {
						return {type:'incompatible'};
					}
					lsetData.sources = intersectSources;
				} else {
					lsetData.sources = sources.unique();
				}
			}

			if (sourcesBefore) {
				lsetData.sourcesBefore = Math.min(sourcesBefore, lsetData.sourcesBefore || 6);
			}

			return false;
		}
	},
	{
		name: "[Seasonal] Super Staff Bros.",
		section: "OM of the Month",

		team: 'randomSeasonalStaff',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			// This seasonal gets a bit from Super Smash Bros., that's where the initial message comes from.
			this.add('message', "GET READY FOR THE NEXT BATTLE!");
			// This link leads to a post where all signature moves can be found so the user can use this resource while battling.
			this.add("raw|Seasonal help for moves can be found <a href='https://www.smogon.com/forums/threads/3491902/page-6#post-6093168'>here</a>");
			// Prepare Steamroll's special lead role.
			if (toId(this.p1.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p1.pokemon[0].isLead = true;
			}
			if (toId(this.p2.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p2.pokemon[0].isLead = true;
			}
			// This variable saves the status of a spammy conversation to be played, so it's only played once.
			this.convoPlayed = false;

			// This code here is used for the renaming of moves showing properly on client.
			var globalRenamedMoves = {
				'defog': "Defrog"
			};
			var customRenamedMoves = {
				"cathy": {
					'kingsshield': "Heavy Dosage of Fun",
					'calmmind': "Surplus of Humour",
					'shadowsneak': "Patent Hilarity",
					'shadowball': "Ion Ray of Fun",
					'shadowclaw': "Sword of Fun",
					'flashcannon': "Fun Cannon",
					'dragontail': "/kick",
					'hyperbeam': "/ban"
				}
			};
			var allPokemon = this.p1.pokemon.concat(this.p2.pokemon);

			for (var i = 0, len = allPokemon.length; i < len; i++) {
				var pokemon = allPokemon[i];
				var last = pokemon.moves.length - 1;
				if (pokemon.moves[last]) {
					pokemon.moves[last] = toId(pokemon.set.signatureMove);
					pokemon.moveset[last].move = pokemon.set.signatureMove;
					pokemon.baseMoveset[last].move = pokemon.set.signatureMove;
				}
				for (var j = 0; j < pokemon.moveset.length; j++) {
					var moveData = pokemon.moveset[j];
					if (globalRenamedMoves[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = globalRenamedMoves[moveData.id];
						pokemon.baseMoveset[j].move = globalRenamedMoves[moveData.id];
					}

					var customRenamedSet = customRenamedMoves[toId(pokemon.name)];
					if (customRenamedSet && customRenamedSet[moveData.id]) {
						pokemon.moves[j] = toId(pokemon.set.signatureMove);
						moveData.move = customRenamedSet[moveData.id];
						pokemon.baseMoveset[j].move = customRenamedSet[moveData.id];
					}
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity: function (type, pokemon) {
			// Great Sage is naturally immune to Attract.
			if (type === 'attract' && toId(pokemon.name) === 'greatsage') {
				this.add('-immune', pokemon, '[from] Irrelevant');
				return false;
			}
			// qtrx is immune to Torment or Taunt.
			if ((type === 'torment' || type === 'taunt') && pokemon.volatiles['unownaura']) {
				this.add('-immune', pokemon, '[from] Unown aura');
				return false;
			}
			// Somalia's Ban Spree makes it immune to some move types, since he's too mad to feel pain.
			// Types have been chosen from types you can be immune against with an ability.
			if (toId(pokemon.name) === 'somalia' && type in {'Ground':1, 'Water':1, 'Fire':1, 'Grass':1, 'Poison':1, 'Normal':1, 'Electric':1}) {
				this.add('-message', "You can't stop SOMALIA in middle of his Ban Spree!");
				return false;
			}
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onUpdate: function (pokemon) {
			var name = toId(pokemon.name);

			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'enguarde' && pokemon.getAbility().id === 'innerfocus') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id === 'levitate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn: function (pokemon) {
			var name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// No OP pls. Balance stuff, changing them upon switch in. Wonder Guard gets curse to minimise their turns out.
			if (pokemon.getAbility().id === 'wonderguard') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
			}
			// Weak Pokémon get a boost so they can fight amongst the other monsters.
			// Innovamania is just useless, so the boosts are a prank.
			if (name === 'test2017' && !pokemon.illusion) {
				this.boost({atk:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'okuu' && !pokemon.illusion) {
				this.boost({def:2, spd:1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk:6, def:6, spa:6, spd:6, spe:6, accuracy:6}, pokemon, pokemon, 'divine grace');
			}
			if (name === 'bloobblob' && !pokemon.illusion) {
				this.boost({def:1, spd:1, spe:2}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'timbuktu' && !pokemon.illusion) {
				this.boost({def:-2, spd:-1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'electrolyte') {
				pokemon.lastAttackType = 'None';
			}
			// Deal with kupo's special transformation ability.
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			// Deal with timbuktu's move (read onModifyMove relevant part).
			if (name === 'timbuktu') {
				pokemon.timesGeoblastUsed = 0;
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			var oldAbility = pokemon.ability;
			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id !== 'cloudnine') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'dell' && pokemon.getAbility().id !== 'adaptability') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'enguarde' && pokemon.getAbility().id !== 'superluck') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id !== 'shedskin') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id !== 'levitate') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id !== 'protean') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			} else {
				pokemon.canMegaEvo = this.canMegaEvo(pokemon); // Bypass one mega limit.
			}

			// Add here special typings, done for flavour mainly.
			if (name === 'mikel' && !pokemon.illusion) {
				this.add('-start', pokemon, 'typechange', 'Normal/Ghost');
				pokemon.typesData = [
					{type: 'Normal', suppressed: false,  isAdded: false},
					{type: 'Ghost', suppressed: false,  isAdded: false}
				];
			}
			if (name === 'qtrx') {
				this.add('-message', pokemon.name + " is radiating an Unown aura!"); // Even if only illusion.
				if (!pokemon.illusion) {
					pokemon.addVolatile('unownaura');
					this.add('-start', pokemon, 'typechange', 'Normal/Psychic');
					pokemon.typesData = [
						{type: 'Normal', suppressed: false,  isAdded: false},
						{type: 'Psychic', suppressed: false,  isAdded: false}
					];
				}
				pokemon.addVolatile('focusenergy');
				this.boost({evasion: -1}, pokemon, pokemon, 'Unown aura');
			}
			if (name === 'birkal' && !pokemon.illusion) {
				pokemon.addType('Bird');
				this.add('-start', pokemon, 'typeadd', 'Bird', '[from] ability: Caw');
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			var sentences = [];
			var sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add("c|~Antar|It's my time in the sun.");
			}
			if (name === 'chaos') {
				this.add("c|~chaos|I always win");
			}
			if (name === 'haunter') {
				this.add("c|~Haunter|Dux mea lux");
			}
			if (name === 'jasmine') {
				if (this[((pokemon.side.id === 'p1') ? 'p2' : 'p1')].active[0].name.charAt(0) === '%') {
					sentence = "Back in my day we didn't have Drivers.";
				} else {
					sentences = ["Your mum says hi.", "Sorry I was just enjoying a slice of pineapple pizza, what was I supposed to do again?", "I could go for some Cheesy Chips right about now.", "I'd tap that.", "/me throws coffee at the server"].randomize();
					sentence = sentences[0];
				}
				this.add('c|~Jasmine|' + sentence);
			}
			if (name === 'joim') {
				var dice = this.random(4);
				if (dice === 1) {
					// Fullscreen toucan!
					this.add('-message', '░░░░░░░░▄▄▄▀▀▀▄▄███▄');
					this.add('-message', '░░░░░▄▀▀░░░░░░░▐░▀██▌');
					this.add('-message', '░░░▄▀░░░░▄▄███░▌▀▀░▀█');
					this.add('-message', '░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌');
					this.add('-message', '░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄');
					this.add('-message', '░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄');
					this.add('-message', '░░░░░░░░░░░░░▐░░░░▐███████████▄');
					this.add('-message', '░░blessed by░░░░▐░░░░▐█████████████▄');
					this.add('-message', '░░le toucan░░░░░░▀▄░░░▐██████████████▄');
					this.add('-message', '░░░░░░ of ░░░░░░░░▀▄▄████████████████▄');
					this.add('-message', '░░░░░luck░░░░░░░░░░░░░█▀██████');
				} else if (dice === 2) {
					// Too spammy, sends it to chat only.
					this.add('c|~Joim|░░░░░░░░░░░░▄▐');
					this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
					this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
					this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
					this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
					this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
					this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
					this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
					this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
					this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
					this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
					this.add('c|~Joim|░░░░░░░▀███▀█░▄');
					this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
					this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
					this.add('c|~Joim|░░░░░░█░░░░░░░░█');
					this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
					this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
				} else if (dice === 3) {
					this.add('-message', '░░░░░░░░░░░░▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░░▄▄▄▄▄');
					this.add('-message', '░░░█░░░░▄▀█▀▀▄░░▀▀▀▄░░░░▐█░░░░░░░░░▄▀█▀▀▄░░░▀█▄');
					this.add('-message', '░░█░░░░▀░▐▌░░▐▌░░░░░▀░░░▐█░░░░░░░░▀░▐▌░░▐▌░░░░█▀');
					this.add('-message', '░▐▌░░░░░░░▀▄▄▀░░░░░░░░░░▐█▄▄░░░░░░░░░▀▄▄▀░░░░░▐▌');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░░░░░░▀█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░█▄░░░▄█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░▐▌░░░░░░░░░░░░░░░░░░░░▀███▀░░░░░░░░░░░░░░░░░░▐▌');
					this.add('-message', '░░█░░░░░░░░░░░░░░░░░▀▄░░░░░░░░░░▄▀░░░░░░░░░░░░█');
					this.add('-message', '░░░█░░░░░░░░░░░░░░░░░░▀▄▄▄▄▄▄▄▀▀░░░░░░░░░░░░░█');
				} else {
					sentences = ["Gen 1 OU is a true skill metagame.", "Finally a good reason to punch a teenager in the face!", "So here we are again, it's always such a pleasure.", "( ͝° ͜ʖ͡°)"].randomize();
					sentence = sentences[0];
					this.add('c|~Joim|' + sentence);
				}
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Give me my robe, put on my crown!');
			}
			if (name === 'v4') {
				sentences = ["Oh right. I'm still here...", "WHAT ELSE WERE YOU EXPECTING?!", "Soaring on beautiful buttwings."].randomize();
				this.add('c|~V4|' + sentences[0]);
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|Your mom');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|Kappa');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|Did someone call for some BALK?');
			}
			if (name === 'okuu') {
				sentences = ["Current Discussion Topics: Benefits of Nuclear Energy, green raymoo worst raymoo, ...", "Current Discussion Topics: I ate the Sun - AMA, Card Games inside of Fighting Games, ...", "Current Discussion Topics: Our testing process shouldn't include Klaxons, Please remove Orin from keyboard prior to entering chat, ...", "Current Discussion Topics: Please refrain from eating crow, We'll get out of Beta once we handle all of this Alpha Decay, ...", "Current Discussion Topics: Schroedinger's Chen might still be in that box, I'm So Meta Even This Acronym, ...", "Current Discussion Topics: What kind of idiot throws knives into a thermonuclear explosion?, わからない ハハハ, ..."].randomize();
				this.add("raw|<div class=\"broadcast-blue\"><b>" + sentences[0] + "</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'vacate') {
				this.add('c|&Vacate|sticky situation');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|All in');
			}

			// Mods.
			if (name === 'am') {
				this.add('c|@AM|Lucky and Bad');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|I Am Here To Oppress Users');
			}
			if (name === 'ascriptmaster') {
				this.add("c|@Ascriptmaster|Good luck, I'm behind 7 proxies");
			}
			if (name === 'asgdf') {
				sentences = ["Steel waters run deep, they say!", "I will insteell fear in your heart!", "Man the harpuns!"].randomize();
				this.add('c|@asgdf|' + sentences[0]);
			}
			if (name === 'barton') {
				this.add('c|@barton|free passion');
			}
			if (name === 'bean') {
				sentences = ["Everybody wants to be a cat", "if you KO me i'll ban u on PS", "just simply outplay the coin-toss"].randomize();
				this.add('c|@Bean|' + sentences[0]);
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"].randomize();
				this.add('c|@BiGGiE|' + sentences[0]);
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|' + ["Another day, another smile :)", "Hello this is steve, how may I help you?"][this.random(2)]);
			}
			if (name === 'coolstorybrobat') {
				pokemon.phraseIndex = this.random(5);
				switch (pokemon.phraseIndex) {
					case 1:
						sentence = "Time to GET SLAYED";
						break;
					case 2:
						sentence = "BRUH!";
						break;
					case 3:
						sentence = "Ahem! Gentlemen...";
						break;
					case 4:
						sentence = "I spent 6 months training in the mountains for this day!";
						break;
					default:
						sentence = "Shoutout to all the pear...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|<[~.~]> Next best furry besides Yoshi taking the stand!');
			}
			if (name === 'eeveegeneral') {
				sentences = ['Eevee army assemble!', 'To the ramparts!', 'You and what army?'];
				this.add('c|@Eevee General|' + sentences[this.random(3)]);
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|Eyyy where the middle school azn girls at??');
			}
			if (name === 'eos') {
				this.add('c|@Eos|ᕦ༼ຈل͜ຈ༽ᕤ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|/me enters battle');
			}
			if (name === 'genesect') {
				pokemon.phraseIndex = this.random(6);
				if (pokemon.phraseIndex === 5) {
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
					this.add('-message', '░░ ██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██ ░░');
					this.add('-message', '██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██');
					this.add('-message', '██ ▓▓ ▓▓ ██ ██ ██ ▓▓ ▓▓ ██');
					this.add('-message', '██ ██ ██ ██ ░░ ██ ██ ██ ██');
					this.add('-message', '██ ▒▒ ▒▒ ██ ██ ██ ▒▒ ▒▒ ██');
					this.add('-message', '██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██');
					this.add('-message', '░░ ██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██ ░░');
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|Shitposting?');
				} else if (pokemon.phraseIndex === 3) {
					this.add('-message', '▄ ▄▄░░░░░░░▄▄▄▄░░░░▌▄▄▄▄▄░░░░░▐▌');
					this.add('-message', '▒▀█▌░░░▐▀▀▄▄▐▌▒░░▒▀▒▄▒█▄░░░░▐▌');
					this.add('-message', '░░▀█▒░░▓░░█▐█▌▌░░▒░▐▌█▌▐▌░░▐▌░');
					this.add('-message', '░░░░░░▓▀░░▒▐▀▄▀▀▀▀▒▒▀▀░░▀▌▒▀░░');
					this.add('-message', '░░░░░░▌░░░░░░▀▄▄▄▄▀░░░░░░▌░░░░');
					this.add('-message', '░░░░░▄▌░░░░░░░░░░░░░░░░░░▒░░░░');
				} else if (pokemon.phraseIndex === 2) {
					this.add('c|@Genesect|Born too early to explore the universe');
					this.add('c|@Genesect|Born too late to explore the world');
					this.add('c|@Genesect|Born just in time to explore ＤＡＮＫＭＥＭＥＳ');
				} else if (pokemon.phraseIndex === 1) {
					this.add('-message', '░░░░░░░░░░▄▄▄▄▄▄░░░░░░░░░░');
					this.add('-message', '░░░░░░░░▄▀█▀█▄██████████▄▄');
					this.add('-message', '░░░░░░░▐██████████████████▌');
					this.add('-message', '░░░░░░░███████████████████▌');
					this.add('-message', '░░░░░░▐███████████████████▌');
					this.add('-message', '░░░░░░█████████████████████▄');
					this.add('-message', '░░░▄█▐█▄█▀█████████████▀█▄█▐█▄');
					this.add('-message', '░▄██▌██████▄█▄█▄█▄█▄█▄█████▌██▌');
					this.add('-message', '████▄▀▀▀▀████████████▀▀▀▀▄███');
					this.add('-message', '█████████▄▄▄▄▄▄▄▄▄▄▄▄██████▀');
					this.add('-message', '░░░▀▀████████████████████▀');
					this.add('c|@Genesect|/me tips fedora');
				} else {
					sentences = ["(ง ͠ ͠° ͟ل͜ ͡°)ง sᴏᴜɴᴅs ᴅᴏɴɢᴇʀᴏᴜs... ɪᴍ ɪɴ (ง ͠ ͠° ͟ل͜ ͡°)ง", 'http://pastebin.com/8r0jgDd7 become a mod today!'].randomize();
					this.add('c|@Genesect|' + sentences[0]);
				}
			}
			if (name === 'goddessbriyella') {
				this.add('c|@Goddess Briyella|♥ ^_^ ♥');
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Think about the name first and then the Pokemon. Look beyond the "simple" detail.');
			}
			if (name === 'imanalt') {
				this.add('c|@imanalt|muh bulk');
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				this.add('c|@innovamania|' + sentences[this.random(4)]);
			}
			if (name === 'jac') {
				this.add('c|@Jac|YAAAAAAAAAAAAAAAS');
			}
			if (name === 'jinofthegale') {
				this.add('c|@jin of the gale|' + ['3...2...1... LET IT RIP!', 'My bit-beast is going to eat you alive!'][this.random(2)]);
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|abc!');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Give me all of your virgin maidens.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|Enter stage left');
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``And believe me I am still alive.``');
				this.add('c|@LegitimateUsername|``I\'m doing Science and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``I feel FANTASTIC and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``While you\'re dying I\'ll be still alive.``');
				this.add('c|@LegitimateUsername|``And when you\'re dead I will be still alive.``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|Happiness and rainbows, hurrah!');
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"].randomize();
				this.add('c|@Lyto|' + sentences[0]);
			}
			if (name === 'marty') {
				this.add('c|@Marty|Prepare yourself.');
			}
			if (name === 'mattl') {
				this.add('c|@MattL|The annoyance I will cause is not well-defined.');
			}
			if (name === 'morfent') {
				this.add('c|@Morfent|``──────▀█████▄──────▲``');
				this.add('c|@Morfent|``───▄███████████▄──◀█▶``');
				this.add('c|@Morfent|``─────▄████▀█▄──────█``');
				this.add('c|@Morfent|``───▄█████████████████▄  - I``');
				this.add('c|@Morfent|``─▄█████.▼.▼.▼.▼.▼.▼.▼   - cast``');
				this.add('c|@Morfent|``▄███████▄.▲.▲.▲.▲.▲.▲   - magic``');
				this.add('c|@Morfent|``█████████████████████▀▀ - shitpost``');
			}
			if (name === 'naniman') {
				this.add('c|@Nani Man|rof');
			}
			if (name === 'phil') {
				this.add('c|@phil|GET SLUGGED');
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				this.add('c|@qtrx|omg DONT call me \'' + sentences[this.random(8)] + '\' pls respect my name its very special!!1!');
			}
			if (name === 'queez') {
				this.add('c|@Queez|B-be gentle');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|Get Rekeri\'d :]');
			}
			if (name === 'relados') {
				var italians = {'haunter': 1, 'test2017': 1, 'uselesstrainer': 1};
				if (toId(pokemon.side.foe.active[0].name) in italians) {
					this.add('c|@Relados|lol italians');
				} else {
					sentences = ['lmfao why are you even playing this game', 'and now, to unleash screaming temporal doom', 'rof'];
					this.add('c|@Relados|' + sentences[this.random(3)]);
				}
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|How is this legal?');
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				this.add('c|@RosieTheVenusaur|' + sentences[this.random(3)]);
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'sraclrlamtio got prmotd to driier');
			}
			if (name === 'scotteh') {
				this.add('c|@Scotteh|─────▄▄████▀█▄');
				this.add('c|@Scotteh|───▄██████████████████▄');
				this.add('c|@Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
			}
			if (name === 'shamethat') {
				sentences = ['no guys stop fighting', 'mature people use their words', 'please direct all attacks to user: beowulf'];
				this.add('c|@Shame That|' + sentences[this.random(3)]);
			}
			if (name === 'shaymin') {
				this.add('c|@shaymin|Ready for hax?');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|\\_$-_-$_/');
			}
			if (name === 'spydreigon') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				this.add('c|@Spydreigon|' + sentences[this.random(5)]);
			}
			if (name === 'steamroll') {
				if (!pokemon.isLead) {
					sentences = ['You\'re in for it now!', 'Welcome to a new world of pain!', 'This is going to be **__fun__**...', 'Awesome! Imma deck you in the shnoz!'];
					this.add('c|@Steamroll|' + sentences[this.random(4)]);
				} else {
					pokemon.isLead = false;
				}
			}
			if (name === 'steeledges') {
				sentences = ["In this moment, I am euphoric. Not because of any phony god's blessing. But because, I am enlightened by my own intelligence.", "Potent Potables for $200, Alex."].randomize();
				this.add('c|@SteelEdges|' + sentences[0]);
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(3)]);
			}
			if (name === 'test2017') {
				var quacks = '';
				var count = 0;
				do {
					count++;
					quacks = quacks + 'QUACK!';
				} while (this.random(3) !== 2 && count < 15);
				this.add('c|@Test2017|' + quacks);
			}
			if (name === 'tfc') {
				sentences = ['Here comes the king', ' this chat sucks', 'Coronis smells'];
				this.add('c|@TFC|' + sentences[this.random(3)]);
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|I\'m a dog :]');
			}
			if (name === 'trickster') {
				this.add('c|@Trickster|' + ['I do this for free, you know.', 'Believe in the me that believes in you!'][this.random(2)]);
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|Get off my lawn! *shakes cane*');
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|Wait for it...');
			}
			if (name === 'zebraiken') {
				pokemon.phraseIndex = this.random(3);
				//  Zeb's faint and entry phrases correspond to each other.
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt n_n');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt *_*');
				} else {
					this.add('c|@Zebraiken|bzzt o_o');
				}
			}

			// Drivers.
			if (name === 'acedia') {
				this.add('c|%Acedia|Time for a true display of skill ( ͡° ͜ʖ ͡°)');
			}
			if (name === 'aelita') {
				this.add('c|%Aelita|Transfer: Aelita. Scanner: Aelita. Virtualization!');
			}
			if (name === 'arcticblast') {
				sentences = ['BEAR MY ARCTIC BLAST', 'lmao what kind of team is this', 'guys guys guess what?!?!?!?!', 'Double battles are completely superior to single battles.', 'I miss the days when PS never broke 100 users and all the old auth were still around.'];
				this.add('c|%Arcticblast|' + sentences[this.random(5)]);
			}
			if (name === 'articuno') {
				sentences = ['Don\'t hurt me, I\'m a gril!', '/me quivers **violently**', 'Don\'t make me use my ban whip...'];
				this.add('c|%Articuno|' + sentences[this.random(3)]);
			}
			if (name === 'astara') {
				this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
			}
			if (name === 'astyanax') {
				this.add('c|%Astyanax|:^) Top kek');
			}
			if (name === 'audiosurfer') {
				pokemon.phraseIndex = this.random(3);
				if (pokemon.phraseIndex === 2) {
					var singers = ['Waxahatchee', 'Speedy Ortiz', 'Sufjan Stevens', 'Kendrick Lamar'];
					this.add('c|%Audiosurfer|Have you heard the new ' + singers[this.random(4)] + ' song?');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|%Audiosurfer|If you were worth playing you wouldn\'t be on the ladder.');
				} else {
					this.add('c|%Audiosurfer| Just came back from surfing. Don\'t believe me? Here\'s a pic: http://fc02.deviantart.net/fs70/i/2011/352/d/3/surf_all_the_oceans_by_dawn_shade-d4jga6b.png');
				}
			}
			if (name === 'birkal') {
				this.add('c|%birkal|caw');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|Contract?');
			}
			if (name === 'crestfall') {
				sentences = ['On wings of night.', 'Let us hunt those who have fallen to darkness.'];
				this.add('c|%Crestfall|' + sentences[this.random(2)]);
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|Come on!');
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|~(^.^)~');
			}
			if (name === 'hugendugen') {
				this.add("c|%Hugendugen|4-1-0 let's go for it");
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|Azideias');
			}
			if (name === 'majorbling') {
				sentences = ['(ゞ๑⚈ ˳̫⚈๑) ♡', 'If you can\'t win contests as well as battles, your team is bad~ <3', '♡ Dedenne is too cute to KO ♡'];
				this.add('c|%Majorbling|' + sentences[this.random(3)]);
			}
			if (name === 'raseri') {
				this.add('c|%Raseri|ban prinplup');
			}
			if (name === 'trinitrotoluene') {
				this.add('c|%trinitrotoluene|pls no hax');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment'];
				this.add('c|%useless trainer|' + sentences[this.random(5)]);
			}
			if (name === 'xfix') {
				var hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, stickyweb: 1};
				var hasHazards = false;
				for (var hazard in hazards) {
					if (pokemon.side.getSideCondition(hazard)) {
						hasHazards = true;
						break;
					}
				}
				if (hasHazards) {
					this.add('c|%xfix|(no haz... too late)');
				} else {
					this.add('c|%xfix|(no hazards, attacks only, final destination)');
				}
			}

			// Voices.
			if (name === 'aldaron') {
				this.add('c|+Aldaron|indefatigable workhorse');
			}
			if (name === 'bmelts') {
				this.add('c|+bmelts|zero post hero');
			}
			if (name === 'cathy') {
				var foe = toId(pokemon.side.foe.active[0].name);
				if (foe === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (foe) {
					case 'bmelts':
						sentence = ['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times'][this.random(2)];
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
				}
				if (sentence) {
					this.add('c|HappyFunTimes|/me ' + sentence);
				} else if (!this.convoPlayed){
					this.add('c|+Cathy|Trivial.');
				}
			}
			if (toId(pokemon.side.foe.active[0].name) === 'cathy') {
				if (name === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (name) {
					case 'bmelts':
						sentence = ['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times'][this.random(2)];
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
					if (sentence) this.add('c|HappyFunTimes|/me ' + sentence);
				}
			}
			if (name === 'diatom') {
				this.add('-message', pokemon.side.foe.name + ' was banned by Diatom. (you should be thankful you are banned and not permabanned)');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|stupidest shit ever');
			}
			if (name === 'talktakestime') {
				this.add('c|+TalkTakesTime|Welcome to BoTTT!');
			}
		},
		// Here we deal with some special mechanics due to custom sets and moves.
		onBeforeMove: function (pokemon, target, move) {
			var name = toId(pokemon.name);
			// Special Shaymin forme change.
			if (name === 'shaymin' && !pokemon.illusion) {
				var targetSpecies = (move.category === 'Status') ? 'Shaymin' : 'Shaymin-Sky';

				if (targetSpecies !== pokemon.template.species) {
					this.add('message', pokemon.name + ((move.category === 'Status') ? ' has reverted to Land Forme!' : ' took to the sky once again!'));
					var template = this.getTemplate(targetSpecies);
					pokemon.formeChange(targetSpecies);
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
					this.add('detailschange', pokemon, pokemon.details);
				}
			}

			// Break the secondary of Dell's sig if an attack is attempted.
			if (target.volatiles['parry'] && move.category !== 'Status') {
				target.removeVolatile('parry');
			}

			if (pokemon.volatiles['needles']) {
				var dice = this.random(3);
				pokemon.removeVolatile('needles');
				if (dice === 2) {
					this.boost({atk:1, spe:1, def:-1}, pokemon, pokemon, 'used needles');
				} else if (dice === 1) {
					this.boost({def:1, spd:1, spe:-1}, pokemon, pokemon, 'used needles');
				} else {
					this.boost({atk:1, def:1, spe:-1}, pokemon, pokemon, 'used needles');
				}
			}

			if (move.id === 'judgment' && name === 'shrang' && !pokemon.illusion) {
				this.add('-start', pokemon, 'typechange', 'Dragon/Fairy');
				pokemon.typesData = [
					{type: 'Dragon', suppressed: false,  isAdded: false},
					{type: 'Fairy', suppressed: false,  isAdded: false}
				];
			}
		},
		// Add here salty tears, that is, custom faint phrases.
		onFaint: function (pokemon) {
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			var name = toId(pokemon.name);
			var sentences = [];
			var sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add('c|~Antar|Should\'ve been an Umbreon.');
			}
			if (name === 'chaos') {
				if (name === toId(pokemon.name)) this.add('c|~chaos|//forcewin chaos');
				if (this.random(1000) === 420) {
					// Shouldn't happen much, but if this happens it's hilarious.
					this.add('c|~chaos|actually');
					this.add('c|~chaos|//forcewin ' + pokemon.side.name);
					this.win(pokemon.side);
				}
			}
			if (name === 'haunter') {
				this.add('c|~Haunter|you can\'t compare with my powers');
			}
			if (name === 'jasmine') {
				this.add('c|~Jasmine|' + ['I meant to do that.', 'God, I\'m the worse digimon.'][this.random(2)]);
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				this.add('c|~Joim|' + sentences[this.random(4)]);
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
			}
			if (name === 'v4') {
				this.add('c|~V4|' + ['Back to irrevelance for now n_n', 'Well that was certainly a pleasant fall.'][this.random(2)]);
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|your mom');
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', '~Zarel used your mom!');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|BibleThump');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|;-;7');
			}
			if (name === 'okuu') {
				this.add("raw|<div class=\"broadcast-blue\"><b>...and Smooth Jazz.</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'slayer95') {
				this.add('c|&Slayer95|I may be defeated this time, but that is irrevelant in the grand plot of seasonals!');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'vacate') {
				this.add('c|&Vacate|dam it');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|Crash and Burn');
			}

			// Mods.
			if (name === 'am') {
				this.add('c|@AM|RIP');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|FUCKING CAMPAIGNERS');
			}
			if (name === 'ascriptmaster') {
				this.add('c|@Ascriptmaster|Too overpowered. I\'m nerfing you next patch');
			}
			if (name === 'asgdf') {
				this.add('c|@asgdf|' + ['Looks like I spoke too hasteely', 'You only won because I couldn\'t think of a penguin pun!'][this.random(2)]);
			}
			if (name === 'barton') {
				this.add('c|@Barton|' + ['ok', 'haha?'][this.random(2)]);
			}
			if (name === 'bean') {
				sentences = ['that\'s it ur getting banned', 'meow', '(✖╭╮✖)'];
				this.add('c|@Bean|' + sentences[this.random(3)]);
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|There is no need to be mad');
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				this.add('c|@BiGGiE|' + sentences[this.random(3)]);
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin| The Mirror Can Lie It Doesn\'t Show What\'s Inside! ╰〳~ ✖ Д ✖ ~〵⊃━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|couldn\'t meet my deadline...');
			}
			if (name === 'coolstorybrobat') {
				switch (pokemon.phraseIndex) {
					case 1:
						sentence = "Lol I got slayed";
						break;
					case 2:
						sentence = "BRUH...";
						break;
					case 3:
						sentence = "I tried";
						break;
					case 4:
						sentence = "Going back to those mountains to train brb";
						break;
					default:
						sentence = "I forgot what fruit had... tasted like...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|All because I couldn\'t use Yoshi...');
				this.add('c|@Dell|───────────────████─███────────');
				this.add('c|@Dell|──────────────██▒▒▒█▒▒▒█───────');
				this.add('c|@Dell|─────────────██▒────────█──────');
				this.add('c|@Dell|─────────██████──██─██──█──────');
				this.add('c|@Dell|────────██████───██─██──█──────');
				this.add('c|@Dell|────────██▒▒▒█──────────███────');
				this.add('c|@Dell|────────██▒▒▒▒▒▒───▒──██████───');
				this.add('c|@Dell|───────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███─');
				this.add('c|@Dell|──────██▒▒▒▒─────▒▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|──────██▒▒▒───────▒▒▒▒▒▒▒█▒█▒██');
				this.add('c|@Dell|───────██▒▒───────▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────██▒▒─────█▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────███▒▒───██▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|─────────███▒▒───█▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|────────██▀█▒▒────█▒▒▒▒▒▒▒▒██──');
				this.add('c|@Dell|──────██▀██▒▒▒────█████████────');
				this.add('c|@Dell|────██▀███▒▒▒▒────█▒▒██────────');
				this.add('c|@Dell|█████████▒▒▒▒▒█───██──██───────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────████▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒▒█───███▒▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────█▒▒▒▒▒█──────');
				this.add('c|@Dell|██▒▒▒▒▒█▒▒▒▒▒▒█───█▒▒▒███──────');
				this.add('c|@Dell|─██▒▒▒▒███████───██████────────');
				this.add('c|@Dell|──██▒▒▒▒▒██─────██─────────────');
				this.add('c|@Dell|───██▒▒▒██─────██──────────────');
				this.add('c|@Dell|────█████─────███──────────────');
				this.add('c|@Dell|────█████▄───█████▄────────────');
				this.add('c|@Dell|──▄█▓▓▓▓▓█▄─█▓▓▓▓▓█▄───────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──▀████████▀▀███████▀──────────');
			}
			if (name === 'eeveegeneral') {
				this.add('c|@Eevee General|' + ['Retreat!', 'You may have won the battle, but you haven\'t won the war!'][this.random(2)]);
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|just wait till I hit puberty...');
			}
			if (name === 'enguarde') {
				this.add('c|@Enguarde|I let my guard down...');
			}
			if (name === 'eos') {
				this.add('c|@EoS|؍༼ಥ_ಥ༽ጋ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|This is why we can\'t have nice things.');
			}
			if (name === 'genesect') {
				if (pokemon.phraseIndex === 5 || pokemon.phraseIndex === 3 || pokemon.phraseIndex === 1) {
					this.add('-message', '▄████▄░░░░░░░░░░░░░░░░░░░░');
					this.add('-message', '██████▄░░░░░░▄▄▄░░░░░░░░░░');
					this.add('-message', '░███▀▀▀▄▄▄▀▀▀░░░░░░░░░░░░░');
					this.add('-message', '░░░▄▀▀▀▄░░░█▀▀▄░▄▀▀▄░█▄░█░');
					this.add('-message', '░░░▄▄████░░█▀▀▄░█▄▄█░█▀▄█░');
					this.add('-message', '░░░░██████░█▄▄▀░█░░█░█░▀█░');
					this.add('-message', '░░░░░▀▀▀▀░░░░░░░░░░░░░░░░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|Well, if that\'s what you want');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
				} else {
					sentences = ["The darkside cannot be extinguished, when you fight...", "؍༼ಥ_ಥ༽ጋ lament your dongers ؍༼ಥ_ಥ༽ጋ", "Yᵒᵘ Oᶰˡʸ Lᶤᵛᵉ Oᶰᶜᵉ", "やれやれだぜ", " ୧༼ಠ益ಠ༽୨ MRGLRLRLR ୧༼ಠ益ಠ༽୨"].randomize();
					this.add('c|@Genesect|' + sentences[0]);
				}
			}
			if (name === 'goddessbriyella') {
				this.add('c|@Goddess Briyella|...........');
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Well done, you\'ve gone beyond your limits and have gained my trust. Now go and write your own destiny, don\'t let fate write it for you.');
			}
			if (name === 'imanalt') {
				this.add('c|@imanalt|bshax imo');
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?', 'Pm Nani Man to complain about this set ( ͡° ͜ʖ ͡°)'];
				this.add('c|@innovamania|' + sentences[this.random(3)]);
			}
			if (name === 'jac') {
				this.add('c|@Jac|bruh');
			}
			if (name === 'jinofthegale') {
				sentences = ['ヽ༼ຈل͜ຈ༽ﾉ You\'ve upped your game ヽ༼ຈل͜ຈ༽ﾉ?', 'Please don\'t steal my bit-beast!', 'Should have used Black'];
				this.add('c|@jin of the gale|' + sentences[this.random(3)]);
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|:C');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Fuck off.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|' + ['Alas poor me', 'Goodnight sweet prince'][this.random(2)]);
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|You made me sad. That\'s the opposite of happy.');
			}
			if (name === 'lyto') {
				this.add('c|@Lyto|' + ['Unacceptable!', 'Mrgrgrgrgr...'][this.random(2)]);
			}
			if (name === 'marty') {
				this.add('c|@Marty|Your fate is sealed');
			}
			if (name === 'mattl') {
				this.add('c|@MattL|Finish him! You used "Finals week!" Fatality!');
			}
			if (name === 'morfent') {
				sentences = ['Hacking claims the lives of over 2,000 registered laddering alts every day.', 'Every 60 seconds in Africa, a minute passes. Together we can stop this. Please spread the word.', 'SOOOOOO $TONED FUCK MAN AW $HIT NIGGA HELLA MOTHER FUCKING 666 ODD FUTURE MAN BRO CHECK THIS OUT MY SWAG WITH THE WHAT WHOLE 666 420 $$$$ HOLLA HOLLA GET DOLLA SWED CASH FUCKING MARIJUANA CIGARETTES GANGSTA GANGSTA EAZY-E C;;R;E;A;M; SO BAKED OFF THE BOBMARLEY GANJA 420 SHIT PURE OG KUUSSHHH LEGALIZE CRYSTAL WEED'];
				this.add('c|@Morfent|' + sentences[this.random(3)]);
			}
			if (name === 'naniman') {
				sentences = ['rof', "deck'd", '**praise** TI'];
				this.add('c|@Nani Man|' + sentences[this.random(3)]);
			}
			if (name === 'phil') {
				this.add('c|@phil|The salt is real right now');
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\t asgdf...'];
				this.add('c|@qtrx|' + sentences[this.random(3)]);
			}
			if (name === 'queez') {
				this.add('c|@Queez|(◕‿◕✿)');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|lucky af :[');
			}
			if (name === 'relados') {
				sentences = ['BS HAX', 'rekt', 'rof'];
				this.add('c|@Relados|' + sentences[this.random(3)]);
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|stupid communist dipshit');
			}
			if (name === 'rosiethevenusaur') {
				this.add('c|@RosieTheVenusaur|' + ['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'][this.random(2)]);
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'scalarmotion was banned by Nani Man. (spangj)');
			}
			if (name === 'scotteh') {
				this.add('-message', '▄███████▄.▲.▲.▲.▲.▲.▲');
				this.add('-message', '█████████████████████▀▀');
			}
			if (name === 'shamethat') {
				sentences = ["ok agree to disagree", "rematch, don't attack this time", "i blame beowulf"];
				this.add('c|@Shame That|' + sentences[this.random(3)]);
			}
			if (name === 'shaymin') {
				this.add('c|@shaymin|You\'ve done well, perhaps...too well, even beating the odds!');
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|!learn skitty, roleplay');
				this.add('raw|<div class="infobox">Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
			}
			if (name === 'spydreigon') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				this.add('c|@Spydreigon|' + sentences[this.random(4)]);
			}
			if (name === 'steamroll') {
				if (!pokemon.killedSome) {
					sentence = 'Goddamn I feel useless.';
				} else {
					sentences = ['...And I saw, as it were... Spaghetti.', "Agh, shouldn't of been that easy.", 'Hope that was enough.'];
					sentence = sentences[this.random(3)];
				}
				this.add('c|@Steamroll|' + sentence);
			}
			if (name === 'steeledges') {
				this.add('c|@SteelEdges|' + ['You know, I never really cared for Hot Pockets.', 'Suck it, Trebek. Suck it long, and suck it hard.'][this.random(2)]);
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				this.add('c|@Temporaryanonymous|' + sentences[this.random(6)]);
			}
			if (name === 'test2017') {
				sentences = ['DUCK YOU!', 'GO DUCK YOURSELF!', 'SUCK MY DUCK!'];
				this.add('c|@Test2017|' + sentences[this.random(3)]);
			}
			if (name === 'tfc') {
				this.add('c|@TFC|' + ['brb gotta piss', 'oh thats bs'][this.random(2)]);
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|rip in pepsi');
			}
			if (name === 'trickster') {
				sentences = ['RIP in pepperoni cappuccino pistachio.', 'El psy congroo.', 'W-wow! Hacker!', '“This guy\'s team is CRAZY!” ☑ “My team can\'t win against a team like that” ☑ "He NEEDED precisely those two crits to win" ☑ “He led with the only Pokemon that could beat me” ☑ "He got the perfect hax" ☑ “There was nothing I could do” ☑ “I played that perfectly”', '(⊙﹏⊙✿)'];
				this.add('c|@Trickster|' + sentences[this.random(5)]);
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|brb getting more denture cream');
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|... keep waiting for it ...');
			}
			if (name === 'zebraiken') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt u_u');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt ._.');
				} else {
					// Default faint.
					this.add('c|@Zebraiken|bzzt x_x');
				}
			}

			// Drivers.
			if (name === 'acedia') {
				this.add('c|%Acedia|My dad smoked his whole life. One day my mom told him "If you want to see your children graduate, you have to stop". 3 years later he died of lung cancer. My mom told me "Dont smoke; dont put your family through this". At 24, I have never touched a cigarette. I must say, I feel a sense of regret, because watching you play Pokemon gave me cancer anyway ( ͝° ͜ʖ͡°)');
			}
			if (name === 'aelita') {
				sentences = ['Oh no, the Scyphozoa\'s here!', 'Devirtualized...', 'Stones. Aelita Stones. Like the rock group. I\'m Odd\'s cousin from Canada.'];
				this.add('c|%Aelita|' + sentences[this.random(3)]);
			}
			if (name === 'arcticblast') {
				sentences = ['totally had it but choked, gg', 'I would have won if it weren\'t for HAX', 'oh', 'Double battles are stil superior to single battles.', 'newfag'];
				this.add('c|%Arcticblast|' + sentences[this.random(5)]);
			}
			if (name === 'articuno') {
				sentences = ['This is why you don\'t get any girls.', 'fite me irl', 'Actually, I don\'t have a gender...'];
				this.add('c|%Articuno|' + sentences[this.random(3)]);
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				this.add('c|%Ast☆ara|' + sentences[this.random(3)]);
			}
			if (name === 'astyanax') {
				this.add('c|%Astyanax|:^( Bottom kek');
			}
			if (name === 'audiosurfer') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|%Audiosurfer|No? Well you should check it out.');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|%Audiosurfer|You should consider Battling 101 friend.');
				} else {
					this.add('c|%Audiosurfer|Back to catching waves.');
				}
			}
			if (name === 'birkal') {
				this.add('c|%birkal|//birkal');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|I won\'t die! Even if I\'m killed!');
			}
			if (name === 'crestfall') {
				this.add('c|%Crestfall|Vayne [All Chat]: Outplayed me gg no re');
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|' + ['BHUWUUU!', 'I like shorts! They\'re comfy and easy to wear!'][this.random(2)]);
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|X_X');
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|:<');
			}
			if (name === 'majorbling') {
				this.add('c|%Majorbling|There is literally no way to make this pokemon good...(ゞ๑T  ˳̫T\'๑) ');
			}
			if (name === 'raseri') {
				this.add('c|%Raseri|banned');
			}
			if (name === 'trinitrotoluene') {
				this.add('c|%trinitrotoluene|why hax @_@');
			}
			if (name === 'uselesstrainer') {
				sentences = ['MATTERED', 'CAIO', 'ima repr0t', 'one day i\'ll turn into a beautiful butterfly'];
				this.add('c|%useless trainer|' + sentences[this.random(4)]);
			}
			if (name === 'xfix') {
				var foe = pokemon.side.foe.active[0];
				if (foe.name === '%xfix') {
					this.add('c|%xfix|(annoying Dittos...)');
				} else if (foe.ability === 'magicbounce') {
					this.add('c|%xfix|(why ' + foe.name + ' has Magic Bounce...)');
					this.add('c|%xfix|(gg... why...)');
				} else {
					this.add('c|%xfix|(gg... I guess)');
				}
			}

			// Ex-staff or honorary voice.
			if (name === 'bmelts') {
				this.add('c|+bmelts|retired now');
			}
			if (name === 'cathy') {
				this.add('c|+Cathy|I was being facetious');
			}
			if (name === 'diatom' && !pokemon.hasBeenThanked) {
				this.add('c|★' + pokemon.side.foe.name + '|Thanks Diatom...');
			}
			if (name === 'redew') {
				this.add('c|+Redew|i hope u think ur a good player');
				this.add('c|+Redew|play spl man');
				this.add('c|+Redew|ud win lots');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|tired of this shitass game');
			}
			if (name === 'talktakestime') {
				this.add('-message', '(Automated response: Your battle contained a banned outcome.)');
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut: function (pokemon) {
			if (toId(pokemon.name) === 'hippopotas' && !pokemon.illusion) {
				this.add('-message', 'The sandstorm subsided.');
			}
			// Shaymin forme change.
			if (toId(pokemon.name) === 'shaymin' && !pokemon.illusion) {
				if (pokemon.template.species === 'Shaymin') {
					var template = this.getTemplate('Shaymin-Sky');
					pokemon.formeChange('Shaymin-Sky');
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				}
			}

			// Transform
			if (pokemon.originalName) pokemon.name = pokemon.originalName;
		},
		onDragOut: function (pokemon) {
			// Prevents qtrx from being red carded by chaos while in the middle of using sig move, which causes a visual glitch.
			if (pokemon.isDuringAttack) {
				this.add('-message', "But the Unown Aura absorbed the effect!");
				return null;
			}
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
		},
		onAfterMoveSelf: function (source, target, move) {
			// Make Haunter not immune to Life Orb as a means to balance.
			if (toId(source.name) === 'haunter') {
				this.damage(source.maxhp / 10, source, source, this.getItem('lifeorb'));
			}
		},
		onModifyPokemon: function (pokemon) {
			var name = toId(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway. This isn't implemented for Cathy since her moves are all custom. Don't trick her a Scarf!
			if (name !== 'qtrx' && name !== 'Cathy') {
				var moves = pokemon.moveset;
				if (pokemon.getItem().isChoice && pokemon.lastMove === moves[3].id) {
					for (var i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
							moves[i].disabled = true;
						}
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual: function (battle) {
			for (var s in battle.sides) {
				var thisSide = battle.sides[s];
				if (thisSide.premonTimer > 4) {
					thisSide.premonTimer = 0;
					thisSide.premonEffect = true;
				} else if (thisSide.premonTimer > 0) {
					if (thisSide.premonTimer === 4) thisSide.addSideCondition('safeguard');
					thisSide.premonTimer++;
				}
				for (var p in thisSide.active) {
					var pokemon = thisSide.active[p];
					var name = toId(pokemon.name);

					if (pokemon.side.premonEffect) {
						pokemon.side.premonEffect = false;
						this.add('c|@zdrup|...dary! __**LEGENDARY!**__');
						this.boost({atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1}, pokemon, pokemon, 'legendary premonition');
						pokemon.addVolatile('aquaring');
						pokemon.addVolatile('focusenergy');
					}
					if (pokemon.volatiles['resilience'] && !pokemon.fainted) {
						this.heal(pokemon.maxhp / 16, pokemon, pokemon);
						this.add('-message', pokemon.name + "'s resilience healed itself!");
					}
					if (pokemon.volatiles['unownaura'] && !pokemon.fainted && !pokemon.illusion) {
						this.add('-message', "Your keyboard is reacting to " + pokemon.name + "'s Unown aura!");
						if (this.random(2) === 1) {
							this.useMove('trickroom', pokemon);
						} else {
							this.useMove('wonderroom', pokemon);
						}
					}
					if (name === 'beowulf' && !pokemon.fainted && !pokemon.illusion) {
						this.add('c|@Beowulf|/me buzzes loudly!');
					}
					if (name === 'cathy' && !pokemon.fainted && !pokemon.illusion) {
						var messages = [
							'kicking is hilarious!',
							'flooding the chat log with kicks makes me lol',
							'please don\'t stop me from having fun',
							'having fun is great!',
							'isn\'t this so much fun?',
							'let\'s all have fun by spamming the channel!',
							'FUN FUN FUN',
							'SO MUCH FUN!',
							'^_^ fun times ^_^',
							'/me is having so much fun!',
							'having fun is great!',
							'/me thinks spam is fun!',
							'/me loves spamming this channel, because it\'s completely inconsequential!',
							'this is just the internet -- nothing matters!',
							'let\'s have fun ALL NIGHT LONG!!!!!!!!!!!!!!!!!!!!!!'
						];
						this.add('c|HappyFunTimes|' + messages[this.random(15)]);
					}
					if (pokemon.volatiles['parry']) {
						// Dell hasn't been attacked.
						pokemon.removeVolatile('parry');
						this.add('-message', "Untouched, the Aura Parry grows stronger still!");
						this.boost({def:1, spd:1}, pokemon, pokemon, 'Aura Parry');
					}
				}
			}
		},
		// This is where the signature moves are actually done.
		onModifyMove: function (move, pokemon) {
			// This is to make signature moves work when transformed.
			if (move.id === 'transform') {
				move.onHit = function (target, pokemon) {
					if (!pokemon.transformInto(target, pokemon)) return false;
					pokemon.originalName = pokemon.name;
					pokemon.name = target.name;
				};
			}

			var name = toId(pokemon.illusion && move.sourceEffect === 'allyswitch' ? pokemon.illusion.name : pokemon.name);
			// Prevent visual glitch with Spell Steal.
			move.effectType = 'Move';
			// Just because it's funny.
			if (move.id === 'defog') {
				move.name = 'Defrog';
				this.attrLastMove('[still]');
				this.add('-anim', pokemon, "Defog", pokemon);
			}

			// Admin signature moves.
			if (move.id === 'spikes' && name === 'antar') {
				move.name = 'Firebomb';
				move.isBounceable = false;
				move.category = 'Special';
				move.type = 'Fire';
				move.basePower = 100;
				move.onTryHitSide = function (side, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Overheat", side.active[0]);
				};
			}
			if (move.id === 'embargo' && name === 'chaos') {
				move.name = 'Forcewin';
				move.onHit = function (pokemon) {
					pokemon.addVolatile('taunt');
					pokemon.addVolatile('torment');
					pokemon.addVolatile('confusion');
					pokemon.addVolatile('healblock');
				};
			}
			if (move.id === 'quiverdance' && name === 'haunter') {
				move.name = 'Genius Dance';
				move.boosts = {spd:1, spe:1, accuracy:2, evasion:-1, def:-1};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
					pokemon.addVolatile('haunterino');
				};
			}
			if (move.id === 'bellydrum' && name === 'jasmine') {
				move.name = 'Lockdown';
				move.onHit = function (target, pokemon) {
					this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
				};
				move.self = {boosts: {atk:6}};
			}
			if (move.id === 'milkdrink' && name === 'joim') {
				move.name = 'Red Bull Drink';
				move.boosts = {spa:1, spe:1, accuracy:1, evasion:-1};
				delete move.heal;
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					pokemon.addVolatile('redbull');
				};
			}
			if (move.id === 'sleeptalk' && name === 'theimmortal') {
				move.name = 'Sleep Walk';
				move.pp = 20;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Healing Wish", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.status !== 'slp') {
						if (pokemon.hp >= pokemon.maxhp) return false;
						if (!pokemon.setStatus('slp')) return false;
						pokemon.statusData.time = 3;
						pokemon.statusData.startTime = 3;
						this.heal(pokemon.maxhp);
						this.add('-status', pokemon, 'slp', '[from] move: Rest');
					}
					var moves = [];
					for (var i = 0; i < pokemon.moveset.length; i++) {
						var move = pokemon.moveset[i].id;
						if (move && move !== 'sleeptalk') moves.push(move);
					}
					var move = '';
					if (moves.length) move = moves[this.random(moves.length)];
					if (!move) return false;
					this.useMove(move, pokemon);
					var activate = false;
					var boosts = {};
					for (var i in pokemon.boosts) {
						if (pokemon.boosts[i] < 0) {
							activate = true;
							boosts[i] = 0;
						}
					}
					if (activate) pokemon.setBoost(boosts);
					if (!pokemon.informed) {
						this.add('c|~The Immortal|I don\'t really sleep walk...');
						pokemon.informed = true;
					}
				};
			}
			if (move.id === 'vcreate' && name === 'v4') {
				move.name = 'V-Generate';
				move.self = {boosts: {accuracy: -2}};
				move.accuracy = 85;
				move.secondaries = [{chance: 50, status: 'brn'}];
			}
			if (move.id === 'relicsong' && name === 'zarel') {
				move.name = 'Relic Song Dance';
				move.basePower = 60;
				move.multihit = 2;
				move.category = 'Special';
				move.type = 'Psychic';
				move.negateSecondary = true;
				move.affectedByImmunities = false;
				delete move.secondaries;
				move.onTryHit = function (target, pokemon) {
					this.attrLastMove('[still]');
					var move = pokemon.template.speciesid === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
					this.add('-anim', pokemon, move, target);
				};
				move.onHit = function (target, pokemon, move) {
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					} else if (pokemon.formeChange('Meloetta-Pirouette')) {
						this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
						// Modifying the move outside of the ModifyMove event? BLASPHEMY
						move.category = 'Physical';
						move.type = 'Fighting';
					}
				};
				move.onAfterMove = function (pokemon) {
					// Ensure Meloetta goes back to standard form after using the move
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					}
				};
			}

			// Leader signature moves.
			if (move.id === 'geomancy' && name === 'hollywood') {
				move.name = 'Meme Mime';
				move.isTwoTurnMove = false;
				move.onTry = function () {};
				move.boosts = {atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
			}
			if (move.id === 'dragontail' && name === 'jdarden') {
				move.name = 'Wyvern\'s Wind';
				if (!move.flags) move.flags = {};
				move.flags['sound'] = 1;
				move.type = 'Flying';
				move.category = 'Special';
				move.basePower = 80;
				move.notSubBlocked = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Boomburst", target);
				};
			}
			if (move.id === 'firespin' && name === 'okuu') {
				move.name = 'Blazing Star - Ten Evil Stars';
				move.basePower = 60;
				move.accuracy = true;
				move.type = 'Fire';
				move.priority = 2;
				move.status = 'brn';
				move.self = {boosts: {spa:-1}};
				move.onHit = function (target, source) {
					var oldAbility = target.setAbility('solarpower');
					if (oldAbility) {
						this.add('-ability', target, target.ability, '[from] move: Blazing Star - Ten Evil Stars');
					}
				};
			}
			if (move.id === 'mefirst' && name === 'sirdonovan') {
				move.name = 'Ladies First';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 120;
				move.accuracy = 100;
				move.self = {boosts: {spe:1}};
				move.onHit = function (target, pokemon) {
					var decision = this.willMove(pokemon);
					if (decision && target.gender === 'F') {
						this.cancelMove(pokemon);
						this.queue.unshift(decision);
						this.add('-activate', pokemon, 'move: Ladies First');
					}
				};
			}
			if (move.id === 'allyswitch' && name === 'slayer95') {
				move.name = 'Spell Steal';
				move.target = 'self';
				move.onTryHit = function (target, source) {
					if (!source.illusion) {
						this.add('-fail', source);
						this.add('-hint', "Spell Steal only works behind an Illusion!");
						return null;
					}
				};
				move.onHit = function (target, source) {
					var lastMove = source.illusion.moveset[source.illusion.moves.length - 1];
					this.useMove(lastMove.id, source);
				};
			}
			if (move.id === 'kingsshield' && name === 'sweep') {
				move.name = "Sweep's Shield";
				move.onHit = function (pokemon) {
					pokemon.setAbility('swiftswim');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'superfang' && name === 'vacate') {
				move.name = 'Duper Fang';
				move.basePower = 105;
				delete move.damageCallback;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Super Fang", target);
				};
				move.onHit = function (pokemon) {
					if (this.random(100) < 95) {
						pokemon.trySetStatus('par');
					} else {
						pokemon.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'bravebird' && name === 'verbatim') {
				move.name = 'Glass Cannon';
				move.basePower = 170;
				move.accuracy = 80;
				move.recoil = [1, 4];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "High Jump Kick", target);
				};
				move.onHit = function (pokemon) {
					this.add('c|&verbatim|DEFENESTRATION!');
					if (this.random(20) === 1) pokemon.switchFlag = true;
				};
				move.onMoveFail = function (target, source, move) {
					this.damage(source.maxhp / 2, source, source, 'glasscannon');
				};
			}

			// Mod signature moves.
			if (move.id === 'pursuit' && name === 'am') {
				move.name = 'Predator';
				move.basePowerCallback = function (pokemon, target) {
					if (target.beingCalledBack) return 120;
					return 60;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pursuit", target);
				};
				move.boosts = {atk:-1, spa:-1, accuracy:-2};
			}
			if (move.id === 'triattack' && name === 'ascriptmaster') {
				move.name = 'Spectrum Beam';
				move.affectedByImmunities = false;
				move.basePower = 8;
				move.critRatio = 1;
				move.accuracy = 95;
				move.typechart = Object.keys(Tools.data.TypeChart);
				move.hitcount = 0;
				move.type = move.typechart[0];
				move.multihit = move.typechart.length;
				delete move.secondaries;
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Swift", target);
				};
				move.onHit = function (target, source, move) {
					move.hitcount++;
					move.type = move.typechart[move.hitcount];
				};
			}
			if (move.id === 'drainingkiss' && name === 'antemortem') {
				move.name = 'Postmortem';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.drain;
				// Manually activate the ability again.
				if (pokemon.ability === 'sheerforce') {
					delete move.secondaries;
					move.negateSecondary = true;
					pokemon.addVolatile('sheerforce');
				} else {
					move.secondaries = [{chance: 50, self: {boosts: {spa: 1, spe: 1}}}];
				}
			}
			if (move.id === 'futuresight' && name === 'asgdf') {
				move.name = 'Obscure Pun';
				// It's easier onHit since it's a future move.
				// Otherwise, all of onTryHit must be rewritten here to add the drop chance.
				move.onHit = function (pokemon) {
					this.add('-message', 'I get it now!');
					if (this.random(100) < 70) {
						this.boost({spa:-1, spd:-1}, pokemon, pokemon, move.sourceEffect);
					}
				};
			}
			if (move.id === 'bulkup' && name === 'barton') {
				move.name = 'MDMA Huff';
				move.boosts = {atk:2, spe:1, accuracy:-1};
			}
			if (move.id === 'glare' && name === 'bean') {
				move.name = 'Coin Toss';
				move.accuracy = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pay Day", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('confusion');
				};
				move.affectedByImmunities = false;
				move.type = 'Dark';
			}
			if (move.id === 'bugbuzz' && name === 'beowulf') {
				move.name = 'Buzzing of the Swarm';
				move.category = 'Physical';
				move.basePower = 100;
				move.secondaries = [{chance:10, volatileStatus: 'flinch'}];
			}
			if (move.id === 'dragontail' && name === 'biggie') {
				move.name = 'Food Rush';
				move.basePower = 100;
				move.type = 'Normal';
				move.self = {boosts: {evasion:-1}};
			}
			if (move.id === 'quickattack' && name === 'birkal') {
				move.name = 'Caw';
				move.type = 'Bird';
				move.category = 'Status';
				move.onHit = function (target) {
					if (!target.setType('Bird')) return false;
					this.add('-start', target, 'typechange', 'Bird');
					this.add('c|%Birkal|caw');
				};
			}
			if (move.id === 'oblivionwing' && name === 'blitzamirin') {
				move.name = 'Pneuma Relinquish';
				move.type = 'Ghost';
				move.damageCallback = function (pokemon, target) {
					return target.hp / 2;
				};
				move.onImmunity = function (type) {
					if (type in {'Normal':1, 'Ghost':1}) return false;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Roar of Time", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('gastroacid');
				};
			}
			if (move.id === 'bravebird' && name === 'coolstorybrobat') {
				move.name = 'Brave Bat';
				move.basePower = 130;
				move.critRatio = 2;
				delete move.recoil;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
			}
			if (move.id === 'detect' && name === 'dell') {
				var dmg = Math.ceil(pokemon.maxhp / (pokemon.ability === 'simple' ? 2 : 4));
				move.name = 'Aura Parry';
				move.self = {boosts: {atk:1, spa:1, spe:1}};
				move.onTryHit = function (target, source) {
					if (source.hp <= dmg) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (target) {
					this.directDamage(dmg, target, target);
					pokemon.addVolatile('parry');
					pokemon.addVolatile('stall');
				};
			}
			if (name === 'eeveegeneral') {
				if (move.id === 'shiftgear') {
					move.name = 'Gears of War';
				}
				if (move.id === 'quickattack') {
					move.name = 'War Crimes';
					move.type = 'Normal';
					move.category = 'Status';
					move.basePower = 0;
					move.onHit = function (pokemon, source) {
						this.directDamage(source.maxhp / 4, source, source);
						pokemon.addVolatile('curse');
						pokemon.addVolatile('confusion');
						this.add("c|@Eevee General|What's a Geneva Convention?");
					};
				}
			}
			if (name === 'electrolyte') {
				if (move.id === 'entrainment') {
					move.name = 'Study';
					move.priority = 1;
					move.flags = {protect:1};
					move.notSubBlocked = true;
					move.onTryHit = function (target, source) {
						if (source.lastAttackType === 'None') {
							this.add('-hint', "Study only works when preceded by an attacking move.");
							return false;
						}
					};
					move.onHit = function (target, source) {
						var possibleTypes = [];
						var attackType = source.lastAttackType;
						source.lastAttackType = 'None';
						for (var type in this.data.TypeChart) {
							if (target.hasType(type)) continue;
							var typeCheck = this.data.TypeChart[type].damageTaken[attackType];
							if (typeCheck === 1) {
								possibleTypes.push(type);
							}
						}
						if (!possibleTypes.length) {
							return false;
						}
						var type = possibleTypes[this.random(possibleTypes.length)];
						if (!target.setType(type)) {
							return false;
						}
						this.add('c|@Electrolyte|Ha! I\'ve found your weakness.');
						this.add('-start', target, 'typechange', type);
					};
				} else {
					pokemon.lastAttackType = move.type;
				}
			}
			if (move.id === 'fakeout' && name === 'enguarde') {
				move.name = 'Ready Stance';
				move.type = 'Steel';
				move.secondaries = [{chance:100, boosts:{atk:-1, spa:-1}, volatileStatus: 'flinch'}];
				move.onTryHit = function (target, source) {
					if (source.activeTurns > 1) {
						this.add('-hint', "Ready Stance only works on your first turn out.");
						return false;
					}
				};
				move.onHit = function (target, source) {
					source.addVolatile('focusenergy');
					this.add('c|@Enguarde|En garde!'); // teehee
				};
			}
			if (move.id === 'shadowball' && name === 'eos') {
				move.name = 'Shadow Curse';
				move.power = 60;
				move.priority = 1;
				move.volatileStatus = 'curse';
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp / 2, source, source);
				};
			}
			if (move.id === 'roleplay' && name === 'formerhope') {
				move.volatileStatus = 'taunt';
				move.self = {boosts: {spa:1}};
				move.onTryHit = function (target, source) {
					this.add('c|@Former Hope|/me godmodes');
				};
				move.onHit = function () {};
			}
			if (move.id === 'geargrind' && name === 'genesect') {
				move.name = "Grind you're mum";
				move.basePower = 30;
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) this.boost({atk:2, spa:2, spe:1}, pokemon, pokemon, move);
				};
			}
			if (move.id === 'earthpower' && name === 'goddessbriyella') {
				move.name = 'Earth Drain';
				move.basePower = 80;
				move.drain = [3, 4];
				move.flags = {heal: 1};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Giga Drain", target);
				};
				if (move.type === 'Ground') {
					move.affectedByImmunities = false;
				}
			}
			if (move.id === 'partingshot' && name === 'hippopotas') {
				move.name = 'Hazard Pass';
				delete move.boosts;
				move.onHit = function (pokemon) {
					var hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].randomize();
					pokemon.side.addSideCondition(hazards[0]);
					pokemon.side.addSideCondition(hazards[1]);
				};
			}
			if (move.id === 'hydrocannon' && name === 'hydroimpact') {
				move.name = 'HYDRO IMPACT';
				move.basePower = 150;
				move.accuracy = 90;
				move.category = 'Physical';
				move.status = 'brn';
				delete move.self;
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp * 0.35, source, source);
				};
			}
			if (move.id === 'naturepower' && name === 'imanalt') {
				move.name = 'FREE GENV BH';
				move.onHit = function (target, source) {
					this.useMove('earthquake', source, target);
				};
			}
			if (move.id === 'splash' && name === 'innovamania') {
				move.name = 'Rage Quit';
				delete move.onTryHit;
				move.onHit = function (pokemon) {
					pokemon.faint();
				};
			}
			if (move.id === 'crunch' && name === 'jas61292') {
				move.name = 'Minus One';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.secondary;
				delete move.secondaries;
				move.onHit = function (pokemon, source) {
					var boosts = {};
					var stats = Object.keys(pokemon.stats).slice(1);
					boosts[stats[this.random(4)]] = -1;
					this.boost(boosts, pokemon, source);
				};
			}
			if (move.id === 'rapidspin' && name === 'jinofthegale') {
				move.name = 'Beyblade';
				move.category = 'Special';
				move.type = 'Electric';
				move.basePower = 90;
				// If we use onHit but use source, we don't have to edit self.onHit.
				move.onHit = function (pokemon, source) {
					var side = source.side;
					for (var i = 0; i < side.pokemon.length; i++) {
						side.pokemon[i].status = '';
					}
					this.add('-cureteam', source, '[from] move: Beyblade');
				};
			}
			if (move.id === 'refresh' && name === 'kostitsynkun') {
				move.name = 'Kawaii-desu uguu~';
				move.heal = [1, 2];
				move.flags = {heal: 1};
				move.onHit = function (target, source) {
					this.add('-curestatus', source, source.status);
					source.status = '';
					source.removeVolatile('confusion');
					source.removeVolatile('curse');
					source.removeVolatile('attract');
					if (this.random(7) === 1) {
						pokemon.side.foe.active[0].addVolatile('attract');
					}
				};
			}
			if (move.id === 'transform' && name === 'kupo') {
				move.name = 'Kupo Nuts';
				move.notSubBlocked = true;
				move.priority = 2;
				move.onHit = function (pokemon, user) {
					var template = pokemon.template;
					if (pokemon.fainted || pokemon.illusion) {
						return false;
					}
					if (!template.abilities || (pokemon && pokemon.transformed) || (user && user.transformed)) {
						return false;
					}
					if (!user.formeChange(template, true)) {
						return false;
					}
					user.transformed = true;
					user.typesData = [];
					for (var i = 0, l = pokemon.typesData.length; i < l; i++) {
						user.typesData.push({
							type: pokemon.typesData[i].type,
							suppressed: false,
							isAdded: pokemon.typesData[i].isAdded
						});
					}
					for (var statName in user.stats) {
						user.stats[statName] = pokemon.stats[statName];
					}
					user.moveset = [];
					user.moves = [];
					for (var i = 0; i < pokemon.moveset.length; i++) {
						var move = this.getMove(user.set.moves[i]);
						var moveData = pokemon.moveset[i];
						var moveName = moveData.move;
						if (moveData.id === 'hiddenpower') {
							moveName = 'Hidden Power ' + user.hpType;
						}
						user.moveset.push({
							move: moveName,
							id: moveData.id,
							pp: move.noPPBoosts ? moveData.maxpp : 5,
							maxpp: move.noPPBoosts ? moveData.maxpp : 5,
							target: moveData.target,
							disabled: false
						});
						user.moves.push(toId(moveName));
					}
					for (var j in pokemon.boosts) {
						user.boosts[j] = pokemon.boosts[j];
					}
					this.add('-transform', user, pokemon);
					user.setAbility(pokemon.ability);
					user.originalName = user.name;
					user.name = pokemon.name;
					user.update();
				};
			}
			if (move.id === 'gust' && name === 'lawrenceiii') {
				move.name = 'Shadow Storm';
				move.type = 'Shadow';
				move.accuracy = true;
				move.ignoreScreens = true;
				move.ignoreDefensive = true;
				move.defensiveCategory = 'Physical';
				move.basePowerCallback = function (pokemon, target) {
					if (target.volatiles['partiallytrapped']) return 65;
					return 35;
				};
				move.onEffectiveness = function (typeMod, target, type, move) {
					var eff = 1;
					if (toId(pokemon.side.foe.active[0].name) === 'lawrenceiii') eff = -1;
					return eff; // Shadow moves are SE against all non-Shadow mons.
				};
				move.onHit = function (target, source) {
					if (target.volatiles['partiallytrapped'] && (this.random(100) < 35)) {
						target.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'shellsmash' && name === 'legitimateusername') {
				move.name = 'Shell Fortress';
				move.boosts = {def:2, spd:2, atk:-4, spa:-4, spe:-4};
			}
			if (move.id === 'trumpcard' && name === 'level51') {
				move.name = 'Next Level Strats';
				delete move.basePowerCallback;
				move.target = 'self';
				move.category = 'Status';
				move.onTryHit = function (pokemon) {
					if (pokemon.level >= 200) return false;
				};
				move.onHit = function (pokemon) {
					pokemon.level += 9;
					if (pokemon.level > 200) pokemon.level = 200;
					this.add('-message', 'Level 51 advanced 9 levels! It is now level ' + pokemon.level + '!');
				};
			}
			if (move.id === 'thundershock' && name === 'lyto') {
				move.name = 'Gravity Storm';
				move.basePower = 100;
				move.accuracy = 100;
				delete move.secondary;
				delete move.secondaries;
				move.self = {volatileStatus: 'magnetrise'};
			}
			if (move.id === 'protect' && name === 'layell') {
				move.name = 'Pixel Protection';
				move.self = {boosts: {def:3, spd:2}};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) {
						this.add('-hint', "Pixel Protection only works once per outing.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Moonblast", pokemon);
					return !!this.willAct() && this.runEvent('StallMove', pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) return false;
					pokemon.addVolatile('pixels');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'sacredfire' && name === 'marty') {
				move.name = 'Immolate';
				move.basePower += 20;
				move.category = 'Special';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Flamethrower", target);
				};
			}
			if (move.id === 'toxic' && name === 'mattl') {
				move.name = 'Topology';
				move.self = {status: 'tox'};
			}
			if (move.id === 'spikes' && name === 'morfent') {
				move.name = 'Used Needles';
				move.self = {boosts: {evasion: -1}};
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					source.addVolatile('needles');
				};
			}
			if (name === 'naniman') {
				if (move.id === 'fireblast') {
					move.name = 'Tanned';
					move.accuracy = 100;
					move.secondaries = [{status:'brn', chance:100}];
					move.onTryHit = function (target, source, move) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Eruption", target);
					};
					move.onHit = function (target, source) {
						this.boost({atk:1, spa:1, evasion:-1, accuracy:-1}, source, source);
					};
				} else if (move.id === 'topsyturvy') move.name = 'rof';
			}
			if (move.id === 'inferno' && name === 'nixhex') {
				move.name = 'Beautiful Disaster';
				move.type = 'Normal';
				move.secondaries = [{
					chance:100,
					onHit: function (target, source) {
						var result = this.random(2);
						if (result < 1) {
							target.trySetStatus('brn', source);
						} else {
							target.trySetStatus('par', source);
						}
					}
				}];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'hypnosis' && name === 'osiris') {
				move.name = 'Restless Sleep';
				move.accuracy = 85;
				move.volatileStatus = 'nightmare';
			}
			if (move.id === 'whirlpool' && name === 'phil') {
				move.name = 'Slug Attack';
				move.basePower = 50;
				move.secondaries = [{chance:100, status:'tox'}];
			}
			if (move.id === 'meditate' && name === 'qtrx') {
				move.name = 'KEYBOARD SMASH';
				move.target = 'normal';
				move.boosts = null;
				move.hitcount = [3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7][this.random(11)];
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fairy Lock", target);
					this.add('-anim', pokemon, "Fairy Lock", pokemon); // DRAMATIC FLASHING
				};
				move.onHit = function (target, source) {
					var gibberish = '';
					var hits = 0;
					var hps = ['hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater'];
					this.add('c|@qtrx|/me slams face into keyboard!');
					source.isDuringAttack = true; // Prevents the user from being kicked out in the middle of using Hidden Powers.
					for (var i = 0; i < move.hitcount; i++) {
						if (target.hp !== 0) {
							var len = 16 + this.random(35);
							gibberish = '';
							for (var j = 0; j < len; j++) gibberish += String.fromCharCode(48 + this.random(79));
							this.add('-message', gibberish);
							this.useMove(hps[this.random(16)], source, target);
							hits++;
						}
					}
					this.add('-message', 'Hit ' + hits + ' times!');
					source.isDuringAttack = false;
				};
			}
			if (move.id === 'leer' && name === 'queez') {
				move.name = 'Sneeze';
				delete move.boosts;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Curse", target);
				};
				move.onHit = function (target, source) {
					if (!target.volatiles.curse) {
						this.boost({atk:1, def:1, spa:1, spd:1, spe:1, accuracy:1}, source, source);
						target.addVolatile('curse');
					} else {
						this.boost({atk: 1}, source, source);
						this.boost({def: -1}, target, source);
						this.useMove('explosion', source, target);
					}
				};
			}
			if (move.id === 'stockpile' && name === 'relados') {
				move.name = 'Loyalty';
				move.type = 'Fire';
				move.priority = 1;
				delete move.volatileStatus;
				move.onTryHit = function () {
					return true;
				};
				move.onHit = function (target, source) {
					if (!source.volatiles['stockpile'] || (source.volatiles['stockpile'].layers < 3)) {
						source.addVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-blue\"><b>Relados received a loyalty point!</b></div>");
					} else {
						source.removeVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-red\"><b>Relados was rewarded for his loyalty!</b><br />Relados has advanced one level.</div>");
						source.level++;
						source.formeChange('Terrakion');
						source.details = source.species + (source.level === 99 ? '' : ', L' + source.level + 1);
						this.add('detailschange', source, source.details);
						this.heal(source.maxhp, source, source);
					}
					this.add('-clearallboost');
					for (var i = 0; i < this.sides.length; i++) {
						if (this.sides[i].active[0]) this.sides[i].active[0].clearBoosts();
					}
				};
			}
			if (move.id === 'eggbomb' && name === 'reverb') {
				move.name = 'fat monkey';
				move.accuracy = 95;
				move.flags = {contact: 1, protect: 1};
				move.self = {boosts: {def:-1, spe:-1}};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
				move.onHit = function (target, source) {
					this.heal(120, source, source);
				};
				move.onMoveFail = function (target, source, move) {
					this.directDamage(120, source, source);
				};
			}
			if (move.id === 'frenzyplant' && name === 'rosiethevenusaur') {
				move.name = 'Swag Plant';
				move.volatileStatus = 'confusion';
				move.self = {boosts: {atk:1, def:1}};
			}
			if (move.id === 'icebeam' && name === 'scalarmotion') {
				move.name = 'Eroding Frost';
				move.basePower = 65;
				move.onEffectiveness = function (typeMod, type) {
					if (type in {'Fire':1, 'Water': 1}) return 1;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Blizzard", target);
				};
			}
			if (move.id === 'boomburst' && name === 'scotteh') {
				move.name = 'Geomagnetic Storm';
				move.type = 'Electric';
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Discharge", target);
				};
			}
			if (move.id === 'healingwish' && name === 'shamethat') {
				move.name = 'Extreme Compromise';
			}
			if (move.id === 'detect' && name === 'shaymin') {
				move.name = 'Flower Garden';
				move.type = 'Grass';
				move.self = {boosts: {def:1, spa:1, spd:1}};
				move.onTryHit = function (target, source) {
					if (source.volatiles['flowergarden']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
				};
				move.onHit = function (target, source) {
					source.addVolatile('stall');
					source.addVolatile('flowergarden');
				};
			}
			if (move.id === 'judgment' && name === 'shrang') {
				move.name = 'Pixilate';
			}
			if (move.id === 'storedpower' && name === 'skitty') {
				move.name = 'Ultimate Dismissal';
				move.type = 'Fairy';
				move.onDamage = function (damage, target, source, effect) {
					if (damage > 0) {
						this.heal(Math.ceil((damage * 0.25) * 100 / target.maxhp), source, source);
					}
				};
			}
			if (move.id === 'thousandarrows' && name === 'snowflakes') {
				move.name = 'Azalea Butt Slam';
				move.category = 'Special';
				move.onHit = function (target, source, move) {
					target.addVolatile('trapped', source, move, 'trapper');
				};
			}
			if (move.id === 'waterpulse' && name === 'spydreigon') {
				move.name = 'Mineral Pulse';
				move.basePower = 95;
				move.type = 'Steel';
				move.accuracy = 100;
			}
			if (name === 'steamroll') {
				if (move.id === 'protect') {
					move.name = 'Conflagration';
					move.onTryHit = function (pokemon) {
						if (pokemon.activeTurns > 1) {
							this.add('-hint', "Conflagration only works on your first turn out.");
							return false;
						}
						this.attrLastMove('[still]');
						this.add('-anim', pokemon, "Fire Blast", pokemon);
					};
					move.self = {boosts: {atk:2, def:2, spa:2, spd:2, spe:2}};
				}
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) pokemon.killedSome = 1;
				};
			}
			if (move.id === 'tailglow' && name === 'steeledges') {
				delete move.boosts;
				move.name = 'True Daily Double';
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					if (source.volatiles['truedailydouble']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Nasty Plot", target);
				};
				move.onHit = function (target, source) {
					if (this.random(2)) {
						this.add('-message', '@SteelEdges failed misserably!');
						this.boost({spa: -2}, source, source);
					} else {
						this.add('-message', '@SteelEdges is the winner!');
						this.boost({spa: 4}, source, source);
					}
					source.addVolatile('truedailydouble');
				};
			}
			if (move.id === 'shadowsneak' && name === 'temporaryanonymous') {
				move.name = 'SPOOPY EDGE CUT';
				move.basePower = 90;
				move.accuracy = 100;
				move.self = {boosts: {evasion:-1}};
				move.onTryHit = function (target, source) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Force", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.hp <= 0 || pokemon.fainted) {
						this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *unsheathes glorious cursed nippon steel katana and cuts you in half with it* heh......nothing personnel.........kid......................');
					}
				};
				move.onMoveFail = function (target, source, move) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *misses* Tch......not bad.........kid......................');
				};
			}
			if (name === 'test2017') {
				if (move.id === 'karatechop') {
					move.name = 'Ducktastic';
					move.basePower = 100;
					move.accuracy = 100;
					move.type = 'Normal';
				}
				if (move.id === 'roost') {
					move.onHit = function (pokemon) {
						pokemon.trySetStatus('tox');
					};
				}
			}
			if (move.id === 'drainpunch' && name === 'tfc') {
				move.name = 'Chat Flood';
				move.basePower = 150;
				move.type = 'Water';
				move.category = 'Special';
				move.self = {boosts: {spa:-1, spd:-1, def:-1}};
			}
			if (move.id === 'return' && name === 'tgmd') {
				delete move.basePowerCallback;
				move.name = 'Canine Carnage';
				move.basePower = 120;
				move.secondaries = [{chance:10, volatileStatus:'flinch'}, {chance:100, boosts:{def:-1}}];
				move.accuracy = 90;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Close Combat", target);
				};
			}
			if (move.id === 'naturepower' && name === 'trickster') {
				move.name = 'Cometstorm';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 80;
				move.secondaries = [{chance:30, status:'brn'}, {chance:30, status:'frz'}];
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Ice', type);
				};
				move.self = {boosts: {accuracy:-1}};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
				delete move.onHit;
			}
			if (move.id === 'waterfall' && name === 'waterbomb') {
				move.name = 'Water Bomb';
				move.basePowerCallback = function (pokemon, target) {
					if (this.effectiveWeather() === 'raindance' || this.effectiveWeather() === 'primordialsea') return 93;
					if (this.effectiveWeather() === 'sunnyday' || this.effectiveWeather() === 'desolateland') return 210;
					return 140;
				};
				move.isContact = false;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Seismic Toss", target);
					target.ignore['Ability'] = true;
				};
				move.accuracy = true;
				move.affectedByImmunities = false;
				move.ignoreDefensive = true;
				move.ignoreEvasion = true;
				move.ignoreScreens = true;
			}
			if (move.id === 'detect' && name === 'zebraiken') {
				move.name = 'bzzt';
				move.self = {boosts: {spa:1, atk:1}};
			}
			if (move.id === 'wish' && name === 'zdrup') {
				move.name = 'Premonition';
				move.flags = {};
				move.sideCondition = 'mist';
				move.onTryHit = function (pokemon) {
					if (pokemon.side.premonTimer) {
						this.add ('-hint', 'Premonition\'s effect is already underway!');
						return false;
					}
				};
				move.onHit = function (pokemon) {
					pokemon.side.premonTimer = 1;
				};
			}

			// Driver signature moves.
			if (move.id === 'worryseed' && name === 'acedia') {
				move.name = 'Procrastination';
				move.onHit = function (pokemon, source) {
					var oldAbility = pokemon.setAbility('slowstart');
					if (oldAbility) {
						this.add('-ability', pokemon, 'Slow Start', '[from] move: Procrastination');
						if (this.random(100) < 10) source.faint();
						return;
					}
					return false;
				};
			}
			if (move.id === 'thunder' && name === 'aelita') {
				move.name = 'Energy Field';
				move.accuracy = 100;
				move.basePower = 150;
				move.secondaries = [{chance:40, status:'par'}];
				move.self = {boosts:{spa:-1, spd:-1, spe:-1}};
			}
			if (move.id === 'psychoboost' && name === 'arcticblast') {
				move.name = 'Doubles Purism';
				delete move.self;
				move.onHit = function (target, source) {
					if (source.hp) {
						var hasRemovedHazards = false;
						var sideConditions = {'spikes': 1, 'toxicspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
						for (var i in sideConditions) {
							if (target.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', target.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
							if (source.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
						}
						if (hasRemovedHazards) this.add('c|%Arcticblast|HAZARDS ARE TERRIBLE IN DOUBLES');
					}
				};
			}
			if (move.id === 'whirlwind' && name === 'articuno') {
				move.name = 'True Support';
				move.self = {boosts: {def:1, spd:1}};
				move.onHit = function (target, source) {
					this.useMove('substitute', target, target);
				};
			}
			if (move.id === 'toxic' && name === 'astyanax') {
				move.name = 'Amphibian Toxin';
				move.accuracy = 100;
				move.self = {boosts:{atk:-1, spa:-1}};
				move.boosts = {atk:-1, spa:-1};
				move.onHit = function (target, source) {
					target.side.addSideCondition('toxicspikes');
					target.side.addSideCondition('toxicspikes');
				};
			}
			if (move.id === 'psywave' && name === 'astara') {
				move.name = 'Star Bolt Desperation';
				move.type = ['Bird', 'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'][this.random(19)];
				move.damageCallback = function (pokemon) {
					return pokemon.hp * 7 / 8;
				};
				move.onHit = function (target, source) {
					if (this.random(2) === 1) target.addVolatile('confusion');
					var status = ['par', 'brn', 'frz', 'psn', 'tox', 'slp'][this.random(6)];
					if (this.random(2) === 1) target.trySetStatus(status);
					var boosts = {};
					var increase = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'][this.random(6)];
					var decrease = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy'][this.random(6)];
					boosts[increase] = 1;
					boosts[decrease] = -1;
					this.boost(boosts, source, source);
				};
			}
			if (move.id === 'detect' && name === 'audiosurfer') {
				move.name = 'Audioshield';
				move.secondary = {chance: 50, self: {boosts: {accuracy:-1}}};
				move.onTryHit = function (target) {
					this.add('-anim', target, "Boomburst", target);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (pokemon) {
					var foe = pokemon.side.foe.active[0];
					if (foe.ability !== 'soundproof') {
						this.add('-message', 'The Audioshield is making a deafening noise!');
						this.damage(foe.maxhp / 12, foe, pokemon);
						if (this.random(2) === 1) this.boost({atk:-1, spa:-1}, foe, foe, 'noise damage');
					}
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'spikecannon' && name === 'bloobblob') {
				// I fear that having two moves with id 'bulletseed' would mess with PP.
				move.name = 'Lava Whip';
				move.type = 'Fire';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Tail Slap", target);
				};
			}
			if (move.id === 'protect' && name === 'crestfall') {
				move.name = 'Final Hour';
				move.onTryHit = function (pokemon) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Final Hour only works on your first turn out.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Dark Pulse", pokemon);
				};
				move.onHit = function () {
					this.add('c|%Crestfall|' + ['The die is cast...', 'Time for reckoning.'][this.random(2)]);
				};
				move.self = {boosts: {spe:2, evasion:1, def:-2, spd:-2}};
			}
			if (move.id === 'dragonrush' && name === 'dtc') {
				move.name = 'Dragon Smash';
				move.basePower = 150;
				move.recoil = [1, 2];
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Head Charge", target);
				};
			}
			if (name === 'feliburn') {
				if (move.id === 'firepunch') {
					move.name = 'Falcon Punch';
					move.basePower = 150;
					move.accuracy = 85;
					move.self = {boosts: {atk:-1, def:-1, spd:-1}};
					move.onTryHit = function (target, source) {
						this.add('c|%Feliburn|FAALCOOOOOOON');
						this.attrLastMove('[still]');
						this.add('-anim', source, "Fire Punch", target);
					};
					move.onHit = function () {
						this.add('c|%Feliburn|PUUUUUNCH!!');
					};
				}
				if (move.id === 'taunt') {
					move.onHit = function () {
						this.add('c|%Feliburn|Show me your moves!');
					};
				}
			}
			if (move.id === 'psychup' && name === 'hugendugen') {
				move.name = 'Policy Decision';
				move.onHit = function (target, source) {
					var targetBoosts = {};
					var targetDeboosts = {};
					for (var i in target.boosts) {
						targetBoosts[i] = target.boosts[i];
						targetDeboosts[i] = -target.boosts[i];
					}
					source.setBoost(targetBoosts);
					target.setBoost(targetDeboosts);
					this.add('-copyboost', source, target, '[from] move: Policy Decision');
					this.add('-invertboost', target, '[from] move: Policy Decision');
				};
			}
			if (move.id === 'surf' && name === 'jellicent') {
				move.name = 'Shot For Shot';
				move.basePower = 80;
				move.volatileStatus = 'confusion';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Teeter Dance", target);
				};
			}
			if (move.id === 'blazekick' && name === 'ljdarkrai') {
				move.name = 'Blaze Blade';
				move.accuracy = 100;
				move.basePower = 90;
				move.critRatio = 2;
			}
			if (name === 'majorbling' && move.id === 'bulletpunch') {
				move.name = 'Focus Laser';
				move.type = 'Electric';
				move.category = 'Status';
				move.basePower = 0;
				delete move.isContact;
				move.self = {volatileStatus:'torment'};
				move.onTryHit = function (target, source) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Focus Laser only works on your first turn out.");
						return false;
					}
				};
				move.onPrepareHit = function (source, target, move) {
					if (pokemon.activeTurns > 1) {
						return;
					}
					this.add('-message', "%Majorbling's power level is increasing! It's over nine thousand!");
					target.addVolatile('focuspunch');
					this.boost({spa:2, atk:2, spe:2}, target, target);
				};
				move.onHit = function (target, source) {
					this.useMove('discharge', source, target);
					source.removeVolatile('focuspunch');
				};
			}
			if (move.id === 'scald' && name === 'raseri') {
				move.name = 'Ban Scald';
				move.basePower = 150;
				delete move.secondary;
				delete move.secondaries;
				move.status = 'brn';
			}
			if (move.id === 'headcharge' && name === 'rekeri') {
				move.name = 'Land Before Time';
				move.basePower = 125;
				move.type = 'Rock';
				move.accuracy = 90;
				move.secondaries = [{chance:10, volatileStatus:'flinch'}];
			}
			if (move.id === 'rockthrow' && name === 'timbuktu') {
				move.name = 'Geoblast';
				move.type = 'Fire';	// Not the other way round or STAB would be lost.
				move.category = 'Special';
				move.accuracy = true;
				move.basePowerCallback = function (source, target) {
					return (40 * Math.pow(2, source.timesGeoblastUsed));
				};
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Rock', type);
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fire Blast", source);
					this.add('-anim', source, "Power Gem", target);
				};
				move.onHit = function (target, source) {
					source.timesGeoblastUsed++;
				};
			}
			if (move.id === 'explosion' && name === 'trinitrotoluene') {
				move.name = 'Get Haxed';
				move.basePower = 250;
				move.onTryHit = function (target, source) {
					this.boost({def: -1}, target, source);
				};
				move.onHit = function (pokemon) {
					pokemon.side.addSideCondition('spikes');
					this.add('-message', 'Debris was scattered on ' + pokemon.name + "'s side!");
				};
			}
			if (move.id === 'bulletpunch' && name === 'uselesstrainer') {
				move.name = 'Ranting';
				move.type = 'Bug';
				move.basePower = 40;
				move.multihit = [2, 5];
				move.self = {volatileStatus: 'mustrecharge'};
				move.accuracy = 95;
			}
			if (move.id === 'metronome' && name === 'xfix') {
				if (pokemon.moveset[3] && pokemon.moveset[3].pp) {
					pokemon.moveset[3].pp = Math.round(pokemon.moveset[3].pp * 10 + 6) / 10;
				}
				move.name = '(Super Glitch)';
				move.multihit = [2, 5];
				move.onTryHit = function (target, source) {
					if (!source.isActive) return null;
				};
				move.onModifyMove = function (source) {
					if (this.random(777) !== 42) return;
					var opponent = pokemon.side.foe.active[0];
					opponent.setStatus('brn');
					var possibleStatuses = ['confusion', 'flinch', 'attract', 'focusenergy', 'foresight', 'healblock'];
					for (var i = 0; i < possibleStatuses.length; i++) {
						if (this.random(3) === 1) {
							opponent.addVolatile(possibleStatuses[i]);
						}
					}

					function generateNoise() {
						var noise = '';
						var random = this.random(40, 81);
						for (var i = 0; i < random; i++) {
							if (this.random(4) !== 0) {
								// Non-breaking space
								noise += '\u00A0';
							} else {
								noise += String.fromCharCode(this.random(0xA0, 0x3040));
							}
						}
						return noise;
					}
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is frozen solid?)");
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is hurt by its burn!)");
					this.damage(opponent.maxhp * this.random(42, 96) * 0.01, opponent, opponent);
					var exclamation = source.status === 'brn' ? '!' : '?';
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER %xfix is hurt by its burn" + exclamation + ")");
					this.damage(source.maxhp * this.random(24, 48) * 0.01, source, source);
					return null;
				};
			}

			// Voices signature moves.
			if (move.id === 'superpower' && name === 'aldaron') {
				move.name = 'Admin Decision';
				move.basePower = 80;
				move.self = {boosts: {def:1, spd:1, spe:-2}};
				move.onEffectiveness = function () {
					return 1;
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'partingshot' && name === 'bmelts') {
				move.name = "Aaaannnd... he's gone";
				move.type = 'Ice';
				move.category = 'Special';
				move.basePower = 80;
				delete move.boosts;
			}
			if (name === 'cathy') {
				if (move.id === 'kingsshield') {
					move.name = 'Heavy Dosage of Fun';
				}
				if (move.id === 'calmmind') {
					move.name = 'Surplus of Humour';
					move.self = {boosts: {spa:1, atk:1}};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', target, "Geomancy", target);
					};
				}
				if (move.id === 'shadowsneak') {
					move.name = 'Patent Hilarity';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Shadow Sneak", target);
					};
				}
				if (move.id === 'shadowball') {
					move.name = 'Ion Ray of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Simple Beam", target);
					};
				}
				if (move.id === 'shadowclaw') {
					move.name = 'Sword of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Sacred Sword", target);
					};
				}
				if (move.id === 'flashcannon') {
					move.name = 'Fun Cannon';
					move.secondaries = [{chance:60, boosts:{spd:-1}}];
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Hydro Pump", target);
					};
				}
				if (move.id === 'dragontail') {
					move.name = '/kick';
					move.type = 'Steel';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Karate Chop", target);
					};
				}
				if (move.id === 'hyperbeam') {
					move.name = '/ban';
					move.basePower = 150;
					move.type = 'Ghost';
				}
				if (move.id === 'memento') {
					move.name = 'HP Display Policy';
					move.boosts = {atk: -12, def: -12, spa: -12, spd: -12, spe: -12, accuracy: -12, evasion: -12};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Explosion", target);
					};
					move.onHit = function (target, source) {
						source.faint();
					};
				}
			}
			if (name === 'diatom') {
				if (move.id === 'healingwish') {
					move.name = 'Be Thankful';
					move.sideCondition = 'luckychant';
					move.onHit = function () {
						pokemon.side.addSideCondition('reflect');
						pokemon.side.addSideCondition('lightscreen');
						pokemon.side.addSideCondition('safeguard');
						pokemon.side.addSideCondition('mist');
						for (var i = 0; i < 6; i++) {
							var thanker = pokemon.side.pokemon[i];
							if (toId(thanker.name) !== name && !thanker.fainted) this.add('c|' + thanker.name + '|Thanks Diatom!');
							pokemon.hasBeenThanked = true;
						}
					};
				}
				if (move.id === 'psywave') {
					move.accuracy = 80;
					move.onMoveFail = function () {
						this.add('c|@Diatom|you should be thankful my psywave doesn\'t always hit');
					};
				}
			}
			if (move.id === 'growl' && name === 'limi') {
				move.name = 'Resilience';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Ball", target);
				};
				move.onHit = function (target, source) {
					target.trySetStatus('psn');
					source.trySetStatus('psn');
					source.addVolatile('resilience');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'swagger' && name === 'mikel') {
				move.accuracy = true;
				move.name = 'Trolling Lobby';
				move.onTryHit = function (pokemon, source) {
					if (source.hp <= Math.floor(source.maxhp * 2 / 3)) return false;
					return;
				};
				move.onHit = function (pokemon, source) {
					pokemon.addVolatile('taunt');
					if (!pokemon.hasType('Grass')) pokemon.addVolatile('leechseed');
					pokemon.addVolatile('torment');
					this.directDamage(source.maxhp * 2 / 3, source, source);
				};
			}
			if (move.id === 'judgment' && name === 'greatsage') {
				move.type = 'Rock';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Energy Ball", target);
					this.add('c|+Great Sage|JUDGEMENT ' + target.name);
				};
				move.onHit = function (target, source) {
					source.addVolatile('ingrain');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'recover' && name === 'redew') {
				move.onHit = function (pokemon) {
					if (pokemon.trySetStatus('tox')) {
						this.add('-message', '+Redew lost at SPL and got badly poisoned due to excessive trolling!');
					}
				};
			}
			if (move.id === 'energyball' && name === 'somalia') {
				move.name = 'Ban Everyone';
				move.basePower = 0;
				delete move.secondary;
				move.category = 'Status';
				move.accuracy = 50 + 50 * pokemon.hp / pokemon.maxhp;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					source.faint();
				};
				move.onHit = function (target, source) {
					this.add('-anim', target, "Explosion", source);
					target.faint();
					target.side.addSideCondition('stealthrock');
					target.side.addSideCondition('toxicspikes');
				};
				move.onMoveFail = function (target, source, move) {
					source.faint();
				};
			}
			if (move.id === 'taunt' && name === 'talktakestime') {
				move.name = 'Bot Mute';
				move.onHit = function (target) {
					target.addVolatile('embargo');
					target.addVolatile('torment');
					target.addVolatile('healblock');
				};
			}
		}
	},
	{
		name: "CAP",
		section: "Other Metagames",
		column: 2,

		ruleset: ['OU'],
		banlist: ['Allow CAP']
	},
	{
		name: "Challenge Cup",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Challenge Cup 1-vs-1",
		section: "Other Metagames",

		team: 'randomCC',
		ruleset: ['Pokemon', 'Team Preview 1v1', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin: function () {
			this.debug('Cutting down to 1');
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Balanced Hackmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Ability Clause', '-ate Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter']
	},
	{
		name: "1v1",
		section: 'Other Metagames',

		ruleset: ['Pokemon', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview 1v1'],
		banlist: ['Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky',
			'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Kangaskhanite', 'Soul Dew'
		],
		validateTeam: function (team, format) {
			if (team.length > 3) return ['You may only bring up to three Pokémon.'];
		},
		onBegin: function () {
			this.p1.pokemon = this.p1.pokemon.slice(0, 1);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 1);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		}
	},
	{
		name: "Monotype",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh',
			'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Shaymin-Sky', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "Tier Shift",
		section: "Other Metagames",

		mod: 'tiershift',
		ruleset: ['OU'],
		banlist: ['Chatter']
	},
	{
		name: "PU",
		section: "Other Metagames",

		ruleset: ['NU'],
		banlist: ['NU', 'BL4', 'Altarianite', 'Beedrillite', 'Lopunnite', 'Chatter']
	},
	{
		name: "Inverse Battle",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Diggersby', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Serperior',
			'Shaymin-Sky', 'Snorlax', 'Xerneas', 'Yveltal', 'Zekrom', 'Gengarite', 'Kangaskhanite', 'Salamencite', 'Soul Dew'
		],
		onModifyPokemon: function (pokemon) {
			pokemon.negateImmunity['Type'] = true;
		},
		onEffectiveness: function (typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.getImmunity(move, type)) return 1;
			return -typeMod;
		}
	},
	{
		name: "Almost Any Ability",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore Illegal Abilities', 'Arceus', 'Archeops', 'Bisharp', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mamoswine', 'Mewtwo', 'Palkia',
			'Rayquaza', 'Regigigas', 'Reshiram', 'Shedinja + Sturdy', 'Slaking', 'Smeargle + Prankster', 'Terrakion', 'Weavile', 'Xerneas', 'Yveltal',
			'Zekrom', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Lucarionite', 'Mawilite', 'Salamencite', 'Soul Dew', 'Chatter'
		],
		validateSet: function (set) {
			var bannedAbilities = {'Aerilate': 1, 'Arena Trap': 1, 'Contrary': 1, 'Fur Coat': 1, 'Huge Power': 1, 'Imposter': 1, 'Parental Bond': 1, 'Protean': 1, 'Pure Power': 1, 'Shadow Tag': 1, 'Simple':1, 'Speed Boost': 1, 'Wonder Guard': 1};
			if (set.ability in bannedAbilities) {
				var template = this.getTemplate(set.species || set.name);
				var legalAbility = false;
				for (var i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pokémon that do not naturally have it.'];
			}
		}
	},
	{
		name: "STABmons",
		section: "Other Metagames",

		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Ignore STAB Moves', 'Arceus', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Diggersby', 'Genesect', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Keldeo', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Porygon-Z', 'Rayquaza',
			'Reshiram', 'Shaymin-Sky', 'Sylveon', 'Xerneas', 'Yveltal', 'Zekrom', 'Altarianite', 'Gengarite', 'Kangaskhanite', "King's Rock",
			'Lopunnite', 'Lucarionite', 'Mawilite', 'Metagrossite', 'Razor Fang', 'Salamencite', 'Slowbronite', 'Soul Dew'
		]
	},
	{
		name: "LC UU",
		section: "Other Metagames",

		maxLevel: 5,
		ruleset: ['LC'],
		banlist: ['Abra', 'Aipom', 'Archen', 'Bunnelby', 'Carvanha', 'Chinchou', 'Corphish', 'Cottonee', 'Croagunk', 'Diglett',
			'Drilbur', 'Dwebble', 'Elekid', 'Ferroseed', 'Fletchling', 'Foongus', 'Gastly', 'Larvesta', 'Magnemite', 'Mienfoo',
			'Munchlax', 'Onix', 'Pancham', 'Pawniard', 'Ponyta', 'Porygon', 'Pumpkaboo-Super', 'Scraggy', 'Slowpoke', 'Snivy',
			'Snubbull', 'Spritzee', 'Staryu', 'Surskit', 'Timburr', 'Tirtouga', 'Vullaby', 'Vulpix', 'Zigzagoon', 'Shell Smash'
		]
	},
	{
		name: "350 Cup",
		section: "Other Metagames",

		mod: '350cup',
		searchShow: false,
		ruleset: ['Ubers', 'Evasion Moves Clause'],
		banlist: ['Abra', 'Cranidos', 'Darumaka', 'Gastly', 'Pawniard', 'Smeargle', 'Spritzee', 'DeepSeaScale', 'DeepSeaTooth', 'Light Ball', 'Thick Club'],
		validateSet: function (set) {
			var template = Tools.getTemplate(set.species);
			var item = this.getItem(set.item);
			if (item.name === 'Eviolite' && Object.values(template.baseStats).sum() <= 350) {
				return ['Eviolite is banned on Pokémon with 350 or lower BST.'];
			}
		}
	},
	{
		name: "Averagemons",
		section: "Other Metagames",

		mod: 'averagemons',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause', 'Evasion Abilities Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Gothita', 'Gothorita', 'Gothitelle', 'Sableye', 'Shedinja', 'Smeargle',
			'DeepSeaScale', 'DeepSeaTooth', 'Eviolite', 'Gengarite', 'Kangaskhanite', 'Light Ball', 'Mawilite', 'Medichamite', 'Soul Dew', 'Thick Club',
			'Huge Power', 'Pure Power'
		]
	},
	{
		name: "Classic Hackmons",
		section: "Other Metagames",

		searchShow: false,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		validateSet: function (set) {
			var template = this.getTemplate(set.species);
			var item = this.getItem(set.item);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.isNonstandard) {
				problems.push(set.species + ' is not a real Pokemon.');
			}
			if (item.isNonstandard) {
				problems.push(item.name + ' is not a real item.');
			}
			var ability = {};
			if (set.ability) ability = this.getAbility(set.ability);
			if (ability.isNonstandard) {
				problems.push(ability.name + ' is not a real ability.');
			}
			if (set.moves) {
				for (var i = 0; i < set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					if (move.isNonstandard) {
						problems.push(move.name + ' is not a real move.');
					}
				}
				if (set.moves.length > 4) {
					problems.push((set.name || set.species) + ' has more than four moves.');
				}
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}
			return problems;
		}
	},
	{
		name: "Hidden Type",
		section: "Other Metagames",

		searchShow: false,
		mod: 'hiddentype',
		ruleset: ['OU']
	},
	{
		name: "Middle Cup",
		section: "Other Metagames",

		searchShow: false,
		maxLevel: 50,
		defaultLevel: 50,
		validateSet: function (set) {
			var template = this.getTemplate(set.species || set.name);
			if (!template.evos || template.evos.length === 0 || !template.prevo) {
				return [set.species + " is not the middle Pokémon in an evolution chain."];
			}
		},
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Chansey', 'Frogadier', 'Eviolite']
	},
	{
		name: "OU Theorymon",
		section: "Other Metagames",

		mod: 'theorymon',
		searchShow: false,
		ruleset: ['OU']
	},
	{
		name: "Gen-NEXT OU",
		section: "Other Metagames",

		mod: 'gennext',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber']
	},
	{
		name: "Monotype Random Battle",
		section: "Other Metagames",

		team: 'randomMonotype',
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "Hackmons Challenge Cup",
		section: "Other Metagames",

		team: 'randomHackmonsCC',
		searchShow: false,
		ruleset: ['HP Percentage Mod', 'Cancel Mod']
	},

	// BW2 Singles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] OU",
		section: "BW2 Singles",
		column: 3,

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	{
		name: "[Gen 5] Ubers",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
		banlist: []
	},
	{
		name: "[Gen 5] UU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream', 'Snow Warning']
	},
	{
		name: "[Gen 5] RU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning']
	},
	{
		name: "[Gen 5] NU",
		section: "BW2 Singles",

		mod: 'gen5',
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU', 'BL3', 'Prankster + Assist']
	},
	{
		name: "[Gen 5] LC",
		section: "BW2 Singles",

		mod: 'gen5',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Gligar', 'Scyther', 'Sneasel', 'Tangela']
	},
	{
		name: "[Gen 5] GBU Singles",
		section: "BW2 Singles",

		mod: 'gen5',
		validateSet: function (set) {
			if (!set.level || set.level >= 50) set.forcedLevel = 50;
			return [];
		},
		onBegin: function () {
			this.debug('cutting down to 3');
			this.p1.pokemon = this.p1.pokemon.slice(0, 3);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 3);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview GBU'],
		banlist: ['Sky Drop', 'Dark Void']
	},
	{
		name: "[Gen 5] Custom Game",
		section: "BW2 Singles",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// BW2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 5] Smogon Doubles",
		section: 'BW2 Doubles',
		column: 3,

		mod: 'gen5',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Team Preview'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void', 'Soul Dew', 'Sky Drop',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus',
			'Reshiram',
			'Zekrom',
			'Kyurem-White'
		]
	},
	{
		name: "[Gen 5] GBU Doubles",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		onBegin: function () {
			this.debug('cutting down to 4');
			this.p1.pokemon = this.p1.pokemon.slice(0, 4);
			this.p1.pokemonLeft = this.p1.pokemon.length;
			this.p2.pokemon = this.p2.pokemon.slice(0, 4);
			this.p2.pokemonLeft = this.p2.pokemon.length;
		},
		maxForcedLevel: 50,
		ruleset: ['Pokemon', 'Standard GBU', 'Team Preview VGC'],
		banlist: ['Sky Drop', 'Dark Void']
	},
	{
		name: "[Gen 5] Doubles Custom Game",
		section: 'BW2 Doubles',

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod']
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		name: "[Gen 4] OU",
		section: "Past Generations",
		column: 3,

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 4] Ubers",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus']
	},
	{
		name: "[Gen 4] UU",
		section: "Past Generations",

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL']
	},
	{
		name: "[Gen 4] LC",
		section: "Past Generations",

		mod: 'gen4',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['Berry Juice', 'DeepSeaTooth', 'Dragon Rage', 'Sonic Boom', 'Meditite', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma']
	},
	{
		name: "[Gen 4] Custom Game",
		section: "Past Generations",

		mod: 'gen4',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod']
	},
	{
		name: "[Gen 3] OU",
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain']
	},
	{
		name: "[Gen 3] Ubers",
		section: "Past Generations",

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Wobbuffet + Leftovers']
	},
	{
		name: "[Gen 3] Custom Game",
		section: "Past Generations",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 2] OU",
		section: "Past Generations",

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 2] Random Battle",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Standard']
	},
	{
		name: "[Gen 2] Custom Game",
		section: "Past Generations",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] OU",
		section: "Past Generations",

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber']
	},
	{
		name: "[Gen 1] OU (tradeback)",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Random Battle",
		section: "Past Generations",

		mod: 'gen1',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Challenge Cup",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		team: 'randomCC',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod']
	},
	{
		name: "[Gen 1] Stadium",
		section: "Past Generations",

		mod: 'stadium',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember'
		]
	},
	{
		name: "[Gen 1] Custom Game",
		section: "Past Generations",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod']
	}
];
