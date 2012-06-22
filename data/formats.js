exports.BattleFormats = {

	// formats

	randombattle: {
		effectType: 'Format',
		name: "Random Battle",
		team: 'random',
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	unratedrandombattle: {
		effectType: 'Format',
		name: "Unrated Random Battle",
		team: 'random',
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause']
	},
	ou: {
		effectType: 'Format',
		name: "OU",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim']
	},
	cap: {
		effectType: 'Format',
		name: "CAP",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAP Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim']
	},
	capnecturnaplaytest: {
		effectType: 'Format',
		name: "CAP Necturna Playtest",
		rated: true,
		ruleset: ['CAP Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','G4CAP','Tomohawk','ShadowStrike','Paleo Wave']
	},
	ubers: {
		effectType: 'Format',
		name: "Ubers",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: []
	},
	uu: {
		effectType: 'Format',
		name: "UU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL', 'Snow Warning','Drought']
	},
	ru: {
		effectType: 'Format',
		name: "RU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL','UU','BL2', 'Snow Warning','Drought', 'Shell Smash + Baton Pass']
	},
	nu: {
		effectType: 'Format',
		name: "NU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL','UU','BL2','RU','BL3', 'Snow Warning','Drought', 'Shell Smash + Baton Pass']
	},
	lc: {
		effectType: 'Format',
		name: "LC",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma']
	},
	hackmons: {
		effectType: 'Format',
		name: "Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	balancedhackmons: {
		effectType: 'Format',
		name: "Balanced Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: ['OHKO', 'Wonder Guard', 'Pure Power', 'Huge Power']
	},
	pu: {
		effectType: 'Format',
		name: "PU",
		challengeShow: true,
		ruleset: ['Pokemon', 'Sleep Clause', 'Species Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','OU','BL','UU','BL2','RU','BL3', 'Snow Warning','Drought', 'Shell Smash + Baton Pass',
			"Charizard", "Wartortle", "Raichu", "Vileplume", "Kadabra", "Golem", "Haunter", "Exeggutor", "Marowak", "Weezing", "Tangela", "Jynx", "Pinsir", "Tauros", "Flareon", "Quagsire", "Misdreavus", "Miltank", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Camerupt", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Absol", "Gorebyss", "Regirock", "Torterra", "Luxray", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Magmortar", "Leafeon", "Probopass", "Rotom-S", "Serperior", "Emboar", "Samurott", "Musharna", "Gurdurr", "Sawk", "Garbodor", "Cinccino", "Duosion", "Sawsbuck", "Amoonguss", "Alomomola", "Eelektross", "Cryogonal", "Braviary"]
	},
	haxmons: {
		effectType: 'Format',
		name: "Haxmons",
		ruleset: ['Hax Clause', 'Team Preview']
	},
	glitchmons: {
		effectType: 'Format',
		name: "Glitchmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased'],
		mimicGlitch: true
	},
	debugmode: {
		effectType: 'Format',
		name: "Debug Mode",
		challengeShow: true,
		canUseRandomTeam: true,
		// no restrictions, for serious
		ruleset: []
	},
	hackmonsgen4: {
		mod: 'gen4',
		effectType: 'Format',
		name: "Hackmons (Gen 4)",
		challengeShow: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	debugmodegen4: {
		mod: 'gen4',
		effectType: 'Format',
		name: "Debug Mode (Gen 4)",
		challengeShow: true,
		canUseRandomTeam: true,
		// no restrictions, for serious
		ruleset: []
	},

	// rules

	standard: {
		effectType: 'Banlist',
		banlist: ['Unreleased', 'Illegal', 'OHKO', 'Moody', 'BrightPowder', 'Lax Incense', 'Minimize', 'Double Team'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
				} else {
					set.species = 'Giratina';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real pokemon.');
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			return problems;
		}
	},
	cappokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			// don't return
			this.getEffect('Pokemon').validateSet.call(this, set, format);
		}
	},
	legal: {
		effectType: 'Banlist',
		banlist: ['Crobat+BraveBird+Hypnosis']
	},
	potd: {
		effectType: 'Rule',
		onPotD: '',
		onStart: function() {
			if (this.effect.onPotD) {
				this.add('rule', 'Pokemon of the Day: '+this.effect.onPotD);
			}
		}
	},
	teampreview: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus\-[a-zA-Z\?]+/, 'Arceus'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus\-[a-zA-Z\?]+/, 'Arceus'));
			}
		},
		onTeamPreview: function() {
			this.callback('team-preview');
		}
	},
	littlecup: {
		effectType: 'Rule',
		validateSet: function(set) {
			var template = this.getTemplate(set.species || set.name)
			
			if (template.prevo) {
				return [set.species+" isn't the first in its evolution family."];
			}
			if (!template.nfe) {
				return [set.species+" doesn't have an evolution family."];
			}
			if (!set.level || set.level > 5) {
				set.level = 5;
			}
		}
	},
	haxclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Hax Clause');
		},
		onModifyMovePriority: -100,
		onModifyMove: function(move) {
			if (move.secondary) {
				move.secondary.chance = 100;
			}
			if (move.accuracy !== true && move.accuracy <= 99) {
				move.accuracy = 0;
			}
			move.willCrit = true;
		}
	},
	speciesclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Species Clause');
		},
		validateTeam: function(team, format) {
			var speciesTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return [template.name+" is banned by Species Clause."];
				}
				speciesTable[template.num] = true;
			}
		}
	},
	sleepclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'slp') {
						if (!pokemon.statusData.source ||
							pokemon.statusData.source.side !== pokemon.side) {
							this.add('message', 'Sleep Clause activated.');
							return false;
						}
					}
				}
			}
		}
	},
	freezeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Freeze Clause');
		}
	}
};
