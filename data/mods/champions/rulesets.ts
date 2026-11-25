export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	standardag: {
		inherit: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Cancel Mod', 'Endless Battle Clause',
			'Adjust Level = 50', 'Species Clause', 'Item Clause = 1', 'Min Team Size = 6',
		],
	},
	standard: {
		inherit: true,
		ruleset: [
			'Standard AG',
			'Sleep Moves Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Clause',
		],
	},
	standarddoubles: {
		inherit: true,
		ruleset: [
			'Standard AG',
			'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Gravity Sleep Clause',
		],
	},
	standardnatdex: {
		inherit: true,
		ruleset: [
			'Obtainable', 'NatDex Mod', 'Team Preview', 'Cancel Mod', 'Endless Battle Clause',
			'Species Clause', 'Level Clause Mod', 'Sleep Moves Clause', 'Nickname Clause',
			'OHKO Clause', 'Evasion Clause', 'Z-Move Clause', 'Terastal Clause',
		],
	},
	standarddraft: {
		inherit: true,
		ruleset: [
			'Standard AG',
			'Nickname Clause', 'Sleep Clause Mod', 'OHKO Clause', 'Evasion Clause',
			'!Item Clause',
		],
		onBegin() {
			this.reportPercentages = true;
		},
		// timer: {starting: 60 * 60, grace: 0, addPerTurn: 10, maxPerTurn: 100, timeoutAutoChoose: true},
	},
	flatrules: {
		inherit: true,
		desc: "The in-game Flat Rules: Adjust Level 50, Species Clause, Item Clause = 1, -Mythical, -Restricted Legendary, Bring 6 Pick 3-6 depending on game type.",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause = 1', 'Adjust Level = 50', 'Picked Team Size = Auto', 'Min Team Size = 6', 'Cancel Mod'],
		banlist: ['Mythical', 'Restricted Legendary'],
	},
	teampreview: {
		inherit: true,
		onTeamPreview() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(/(Xerneas|Zacian|Zamazenta)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, '');
			}
			if (this.ruleTable.has(`teratypepreview`)) {
				for (const side of this.sides) {
					let buf = ``;
					for (const pokemon of side.pokemon) {
						buf += buf ? ` / ` : `raw|${side.name}'s Tera Types:<br />`;
						buf += `<psicon pokemon="${pokemon.species.id}" /><psicon type="${pokemon.teraType}" />`;
					}
					this.add(`${buf}`);
				}
			}
			this.makeRequest('teampreview');
		},
	},
	levelclausemod: {
		effectType: 'Rule',
		name: 'Level Clause Mod',
		desc: "Changes stat calculation to depend on the Pok&eacute;mon's level, which need not be 50.",
		onBegin() {
			this.add('rule', "Level Clause Mod: Pokémon levels are not fixed at 50, with stats calculated accordingly.");
		},
		// Implemented in mods/champions/scripts.ts
	},
	natdexmod: {
		inherit: true,
		onChangeSet() {
			const TeamValidator = this.constructor as typeof import('../../../sim/team-validator').TeamValidator;
			// Validate historical sources with NatDex data while retaining this format's rules
			const sourceValidator = Object.assign(Object.create(this), { dex: this.dex.mod(`gen${this.gen}`) });
			this.validateSource = TeamValidator.prototype.validateSource.bind(sourceValidator);
		},
		checkCanLearn(move, species, setSources, set) {
			if (!this.ruleTable.has('natdexmod')) return this.checkCanLearn(move, species, setSources, set);
			if (!species.isNonstandard) {
				// Prefer current Champions sources over more restrictive historical sources
				const championsSources = this.dex.deepClone(setSources);
				const championsProblem = this.checkCanLearn(move, species, championsSources, set);
				if (!championsProblem) {
					Object.assign(setSources, championsSources);
					return null;
				}
				// Pokemon unavailable in regular NatDex only get their Champions movepool
				if (this.dex.mod(`gen${this.gen}`).species.get(species.id).natDexTier === 'Illegal') {
					return championsProblem;
				}
			}
			const TeamValidator = this.constructor as typeof import('../../../sim/team-validator').TeamValidator;
			return TeamValidator.get(`gen${this.gen}nationaldexag`)
				.checkCanLearn(move, species, setSources, set);
		},
		onValidateSet(set) {
			if (!this.ruleTable.has('natdexmod')) return;
			const species = this.dex.species.get(set.species);
			let tier = species.tier;
			if (tier === 'Illegal') tier = this.dex.mod('gen9').species.get(species.name).natDexTier;
			if (tier === 'Illegal') {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			const requireObtainable = this.ruleTable.has('obtainable');
			if (requireObtainable) {
				if (species.natDexTier === "Unreleased") {
					const basePokemon = this.toID(species.baseSpecies);
					if (this.ruleTable.has(`+pokemon:${species.id}`) || this.ruleTable.has(`+basepokemon:${basePokemon}`) ||
						this.ruleTable.has('+pokemontag:unobtainable')) {
						return;
					}
					return [`${set.name || set.species} does not exist in the National Dex.`];
				}
				for (const moveid of set.moves) {
					const move = this.dex.moves.get(moveid);
					if (move.isNonstandard === 'Unobtainable' && move.gen === this.dex.gen) {
						if (this.ruleTable.has(`+move:${move.id}`)) continue;
						const problem = `${set.name}'s move ${move.name} does not exist in the National Dex.`;
						if (this.ruleTable.has('omunobtainablemoves')) {
							const { outOfBattleSpecies } = this.getValidationSpecies(set);
							if (!this.omCheckCanLearn(move, outOfBattleSpecies, this.allSources(outOfBattleSpecies), set, problem)) continue;
						}
						return [problem];
					}
				}
			}
			// Any item that was legal in Gen 7 (Normal Gem for example) should be usable
			if (!set.item) return;
			let item = this.dex.items.get(set.item);
			let gen = this.dex.gen;
			while (item.isNonstandard && gen >= 7) {
				item = this.dex.forGen(gen).items.get(item.id);
				gen--;
			}
			if (requireObtainable && item.isNonstandard) {
				if (this.ruleTable.has(`+item:${item.id}`)) return;
				return [`${set.name}'s item ${item.name} does not exist in Gen ${this.dex.gen}.`];
			}
		},
	},
};
