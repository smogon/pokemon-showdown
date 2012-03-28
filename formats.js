exports.BattleFormats = {
	
	// formats
	
	RandomBattle: {
		effectType: 'Format',
		name: "Random Battle",
		team: 'random',
		searchDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'SleepClause']
	},
	UnratedRandomBattle: {
		effectType: 'Format',
		name: "Unrated Random Battle",
		team: 'random',
		searchShow: true,
		ruleset: ['PotD', 'Pokemon', 'SleepClause']
	},
	OU: {
		effectType: 'Format',
		name: "OU",
		challengeDefault: true,
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber', 'Drizzle ++ SwiftSwim']
	},
	CAP: {
		effectType: 'Format',
		name: "CAP",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['CAPPokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber', 'Drizzle ++ SwiftSwim']
	},
	CAPNecturnaPlaytest: {
		effectType: 'Format',
		name: "CAP Necturna Playtest",
		rated: true,
		ruleset: ['CAPPokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber','G4CAP','Tomohawk','ShadowStrike','PaleoWave']
	},
	Ubers: {
		effectType: 'Format',
		name: "Ubers",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: []
	},
	UU: {
		effectType: 'Format',
		name: "UU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber','OU','BL', 'SnowWarning','Drought']
	},
	RU: {
		effectType: 'Format',
		name: "RU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber','OU','BL','UU','BL2', 'SnowWarning','Drought', 'ShellSmash + BatonPass']
	},
	NU: {
		effectType: 'Format',
		name: "NU",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon', 'SleepClause', 'SpeciesClause', 'Standard', 'TeamPreview'],
		banlist: ['Uber','OU','BL','UU','BL2','RU','BL3', 'SnowWarning','Drought', 'ShellSmash + BatonPass']
	},
	Hackmons: {
		effectType: 'Format',
		name: "Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		isTeambuilderFormat: true,
		ruleset: ['Pokemon'],
		banlist: []
	},
	BalancedHackmons: {
		effectType: 'Format',
		name: "Balanced Hackmons",
		rated: true,
		challengeShow: true,
		searchShow: true,
		teambuilderFormat: 'Hackmons',
		ruleset: ['Pokemon'],
		banlist: ['OHKO', 'WonderGuard']
	},
	Haxmons: {
		effectType: 'Format',
		name: "Haxmons",
		ruleset: ['HaxClause', 'TeamPreview']
	},
	DebugMode: {
		effectType: 'Format',
		name: "Debug Mode",
		challengeShow: true,
		canUseRandomTeam: true,
		// no restrictions, for serious
		ruleset: []
	},
	
	// rules
	
	Standard: {
		effectType: 'Banlist',
		banlist: ['Unreleased', 'Illegal', 'OHKO', 'Moody', 'BrightPowder', 'LaxIncense', 'Minimize', 'DoubleTeam', 'Legal'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves)
			{
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++)
				{
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
	Pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) // Arceus
			{
				if (set.ability === 'Multitype' && item.onPlate)
				{
					set.species = 'Arceus-'+item.onPlate;
				}
				else
				{
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) // Giratina
			{
				if (item.id === 'GriseousOrb')
				{
					set.species = 'Giratina-O';
				}
				else
				{
					set.species = 'Giratina';
				}
			}
			if (template.num == 555) // Darmanitan
			{
				set.species = 'Darmanitan';
			}
			if (template.num == 648) // Meloetta
			{
				set.species = 'Meloetta';
			}
			if (template.num == 351) // Castform
			{
				set.species = 'Castform';
			}
			if (template.num == 421) // Cherrim
			{
				set.species = 'Cherrim';
			}
			if (template.isNonstandard)
			{
				problems.push(set.species+' is not a real pokemon.');
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++)
			{
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard)
				{
					problems.push(move.name+' is not a real move.');
				}
			}
			return problems;
		}
	},
	CAPPokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			// don't return
			this.getEffect('Pokemon').validateSet.call(this, set, format);
		}
	},
	Legal: {
		effectType: 'Banlist',
		banlist: ['Crobat+BraveBird+Hypnosis']
	},
	PotD: {
		effectType: 'Rule',
		onPotD: '',
		onStart: function() {
			if (this.effect.onPotD)
			{
				this.add('rule Pokemon of the Day: '+this.effect.onPotD);
			}
		}
	},
	TeamPreview: {
		onStartPriority: -10,
		onStart: function() {
			for (var i=0; i<this.sides[0].pokemon.length; i++)
			{
				this.add('pokemon '+this.sides[0].pokemon[i].tpid);
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++)
			{
				this.add('pokemon '+this.sides[1].pokemon[i].tpid);
			}
		},
		onTeamPreview: function() {
			this.callback('team-preview');
		}
	},
	HaxClause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule Hax Clause');
		},
		onModifyMovePriority: -100,
		onModifyMove: function(move) {
			if (move.secondary)
			{
				move.secondary.chance = 100;
			}
			if (move.accuracy !== true && move.accuracy <= 99)
			{
				move.accuracy = 0;
			}
			move.willCrit = true;
		}
	},
	SpeciesClause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule Species Clause');
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
	SleepClause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule Sleep Clause');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side)
			{
				return;
			}
			if (status.id === 'slp')
			{
				for (var i=0; i<target.side.pokemon.length; i++)
				{
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'slp')
					{
						if (!pokemon.statusData.source ||
						    pokemon.statusData.source.side !== pokemon.side)
						{
							this.add('message Sleep Clause activated.');
							return false;
						}
					}
				}
			}
		}
	},
	FreezeClause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule Freeze Clause');
		}
	}
};