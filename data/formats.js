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
		ruleset: ['Random Battle']
	},
	challengecup: {
		effectType: 'Format',
		name: "Challenge Cup",
		team: 'cc',
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['Pokemon']
	},
	unratedchallengecup: {
		effectType: 'Format',
		name: "Unrated Challenge Cup",
		team: 'cc',
		searchShow: true,
		ruleset: ['Challenge Cup']
	},
	ou: {
		effectType: 'Format',
		name: "OU",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	oususpecttest: {
		effectType: 'Format',
		name: "OU Suspect Test",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		teambuilderFormat: 'ou',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: [
			'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Normal', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-A', 'Deoxys-S', 'Dialga', 'Excadrill', 'Giratina', 'Giratina-O', 'Groudon', 'Ho-Oh', 'Kyogre', 'Lugia', 'Manaphy', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-S', 'Thundurus', 'Zekrom', 'Drizzle ++ Swift Swim', 'Soul Dew', 'Sand Veil'
		]
	},
	cap: {
		effectType: 'Format',
		name: "CAP",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAP Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Soul Dew']
	},
	capnecturnaplaytest: {
		effectType: 'Format',
		name: "CAP Necturna Playtest",
		rated: true,
		ruleset: ['CAP Pokemon', 'Sleep Clause', 'Species Clause', 'OHKO Clause', 'Evasion Clause', 'Standard', 'Team Preview'],
		banlist: ['Uber','G4CAP','Tomohawk','ShadowStrike','Paleo Wave','Soul Dew']
	},
	capmolluxplaytest: {
		mod: 'gen5bw',
		effectType: 'Format',
		name: "CAP Mollux Playtest",
		rated: true,
		ruleset: ['CAP'],
		banlist: ['G4CAP','Tomohawk','Necturna','ShadowStrike','Paleo Wave']
	},
	ubers: {
		effectType: 'Format',
		name: "Ubers",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: []
	},
	uu: {
		effectType: 'Format',
		name: "UU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['OU'],
		banlist: ['OU', 'BL', 'Snow Warning', 'Drought', 'Sand Stream']
	},
	ru: {
		effectType: 'Format',
		name: "RU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass']
	},
	nu: {
		effectType: 'Format',
		name: "NU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['RU'],
		banlist: ['RU','BL3']
	},
	lc: {
		effectType: 'Format',
		name: "LC",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Sonicboom', 'Dragon Rage', 'Berry Juice', 'Carvanha', 'Meditite', 'Gligar', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix', 'Yanma', 'Soul Dew']
	},
	dwubers: {
		effectType: 'Format',
		name: "DW Ubers",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		isDWtier: true,
		ruleset: ['Pokemon', 'Standard DW', 'Team Preview'],
		banlist: []
	},
	dwou: {
		effectType: 'Format',
		name: "DW OU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'Standard DW', 'Team Preview'],
		banlist: ['Drizzle ++ Swift Swim', 'Soul Dew', 'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water', 'Blaziken', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Zekrom']
	},
	dwuu: {
		effectType: 'Format',
		name: "DW UU",
		challengeShow: true,
		ruleset: ['DW OU'],
		banlist: ['Chandelure', 'Genesect', 'Tyranitar', 'Dragonite', 'Breloom', 'Ferrothorn', 'Politoed', 'Gliscor', 'Ninetales', 'Scizor', 'Excadrill', 'Keldeo', 'Infernape', 'Venusaur', 'Heatran', 'Rotom-Wash', 'Garchomp', 'Serperior', 'Gengar', 'Volcarona', 'Forretress', 'Conkeldurr', 'Espeon', 'Cloyster', 'Skarmory', 'Starmie', 'Salamence', 'Gyarados', 'Zapdos', 'Jirachi', 'Latios', 'Tentacruel', 'Haxorus', 'Landorus', 'Mamoswine', 'Charizard', 'Lucario', 'Jellicent', 'Blissey', 'Terrakion', 'Heracross', 'Metagross', 'Ditto', 'Hydreigon', 'Thundurus', 'Alakazam', 'Deoxys-Speed', 'Latias', 'Gastrodon', 'Togekiss', 'Donphan', 'Bronzong', 'Manaphy']
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
		ruleset: ['Pokemon', 'OHKO Clause'],
		banlist: ['Wonder Guard', 'Pure Power', 'Huge Power', 'Freeze Shock', 'Ice Burn']
	},
	pu: {
		effectType: 'Format',
		name: "PU",
		challengeShow: true,
		ruleset: ['NU'],
		banlist: ["Charizard", "Wartortle", "Vileplume", "Kadabra", "Golem", "Haunter", "Exeggutor", "Marowak", "Weezing", "Tangela", "Kangaskhan", "Electabuzz", "Pinsir", "Tauros", "Lapras", "Flareon", "Ampharos", "Jumpluff", "Misdreavus", "Ursaring", "Piloswine", "Miltank", "Linoone", "Ludicolo", "Swellow", "Gardevoir", "Ninjask", "Camerupt", "Torkoal", "Cacturne", "Altaria", "Armaldo", "Absol", "Gorebyss", "Regirock", "Regice", "Torterra", "Rampardos", "Bastiodon", "Floatzel", "Drifblim", "Skuntank", "Lickilicky", "Probopass", "Rotom-Fan", "Serperior", "Emboar", "Samurott", "Musharna", "Zebstrika", "Gigalith", "Gurdurr", "Sawk", "Carracosta", "Garbodor", "Cinccino", "Sawsbuck", "Amoonguss", "Alomomola", "Golurk", "Braviary"]
	},
	haxmons: {
		effectType: 'Format',
		name: "Haxmons",
		challengeShow: true,
		canUseRandomTeam: true,
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
		debug: true,
		// no restrictions, for serious
		ruleset: []
	},
	gen4hackmons: {
		mod: 'gen4',
		effectType: 'Format',
		name: "[Gen 4] Hackmons",
		challengeShow: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	gen4debugmode: {
		mod: 'gen4',
		effectType: 'Format',
		name: "[Gen 4] Debug Mode",
		challengeShow: true,
		canUseRandomTeam: true,
		debug: true,
		// no restrictions, for serious
		ruleset: []
	},
	gennextnextou: {
		mod: 'gennext',
		effectType: 'Format',
		name: "[Gen NEXT] NEXT-OU",
		challengeShow: true,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Soul Dew', 'Kyurem']
	},

	// rules

	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Evasion Clause'],
		banlist: ['Unreleased', 'Illegal', 'Moody'],
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
	standarddw: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Evasion Clause'],
		banlist: ['Illegal', 'Moody'],
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
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Pressure';
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
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolution' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
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
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.callback('team-preview');
		}
	},
	littlecup: {
		effectType: 'Rule',
		validateSet: function(set) {
			var template = this.getTemplate(set.species || set.name);
			
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
			if (move.secondaries) {
				for (var s = 0; s < move.secondaries.length; ++s) {
					move.secondaries[s].chance = 100;
				}
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
	ohkoclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'OHKO Clause');
		},
		validateSet: function(set) {
			var problems = [];
			if (set.moves) {
				for (var i in set.moves) {
					var move = this.getMove(set.moves[i]);
					if (move.ohko) problems.push(move.name+' is banned by OHKO Clause.');
				}
			}
			return problems;
		}
	},
	evasionclause: {
		effectType: 'Banlist',
		name: 'Evasion Clause',
		banlist: ['BrightPowder', 'Lax Incense', 'Minimize', 'Double Team'],
		onStart: function() {
			this.add('rule', 'Evasion Clause');
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
							this.add('-message', 'Sleep Clause activated.');
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
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		}
	}
};
