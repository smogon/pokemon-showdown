export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	nicknameclause: {
		effectType: 'ValidatorRule',
		name: 'Nickname Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same nickname",
		onValidateTeam(team, format) {
			const nameTable = new Set<string>();
			for (const set of team) {
				var name = set.name;
				if (name) {
					if (name === this.dex.species.get(set.species).baseSpecies || name === 'shadow') continue;
					if (nameTable.has(name)) {
						return [`Your Pokémon must have different nicknames.`, `(You have more than one ${name})`];
					}
					nameTable.add(name);
				}
			}
			// Illegality of impersonation of other species is
			// hardcoded in team-validator.js, so we are done.
		},
	},
	shadowmechanic: {
		effectType: 'Rule',
		name: 'Shadow Mechanic',
		desc: "Turns any Pokemon with a Shadow move into a Shadow Pokemon.",
		onBegin() {
			this.add('rule', 'Shadow Mechanic: Turns any Pokemon with a Shadow move into a Shadow Pokemon');
			const shadowMoves = [
				'shadowrush', 'shadowblitz', 'shadowwave', 'shadowbreak', 'shadowrave', 'shadowsky', 'shadowend', 'shadowstorm',
				'shadowpanic', 'shadowmist', 'shadowdown', 'shadowhold', 'shadowshed', 'shadowhalf', 'shadowsights', 'shadowbolt',
				'shadowchill', 'shadowfire', 'shadowblast', 'shadowguard', 'shadowarmor', 'shadowsiphon',
			];
			for (const moveid of shadowMoves) {
				const move = this.dex.moves.get(moveid);
				for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
					for (const {learnset} of this.dex.species.getFullLearnset(pokemon.species.id)) {
						if (moveid in learnset && pokemon?.pokeball === 'shadow') {
							pokemon.baseMoveSlots.push({
								move: move.name,
								id: move.id,
								pp: move.pp * 8 / 5,
								maxpp: move.pp * 8 / 5,
								target: move.target,
								disabled: false,
								disabledSource: '',
								used: false,
							});
							pokemon.moveSlots = pokemon.baseMoveSlots.slice();
							break;
						}
					}
				}
			}
		},
		onValidateSet(set) {
			var shadowCount = 0;
			const shadowMoves = [
				'shadowrush', 'shadowblitz', 'shadowwave', 'shadowbreak', 'shadowrave', 'shadowsky', 'shadowend', 'shadowstorm',
				'shadowpanic', 'shadowmist', 'shadowdown', 'shadowhold', 'shadowshed', 'shadowhalf', 'shadowsights', 'shadowbolt',
				'shadowchill', 'shadowfire', 'shadowblast', 'shadowguard', 'shadowarmor', 'shadowsiphon',
			];
			if (set.name === 'shadow') {
				set.pokeball = 'shadow';
				set.name = set.species;
				for (const moveid of shadowMoves) {
					for (const {learnset} of this.dex.species.getFullLearnset(this.toID(set.species))) {
						if (moveid in learnset) {
							shadowCount++;
							break;
						}
					}
				}
				if (shadowCount === 1) {
					if (set.moves.length === 4) return [`${set.name || set.species} has one Shadow move, meaning it can only run 3 normal moves.`];
				} else if (shadowCount === 2) {
					if (set.moves.length >= 3) return [`${set.name || set.species} has two Shadow moves, meaning it can only run 2 normal moves.`];
				} else if (shadowCount === 3) {
					if (set.moves.length >= 2) return [`${set.name || set.species} has three Shadow moves, meaning it can only run 1 normal move.`];
				} else if (shadowCount === 4) {
					if (set.moves.length >= 1) return [`${set.name || set.species} has four Shadow moves, meaning it can't run any normal moves.`];
				}
			}
		},
		/* onModifySpecies(species, target, source, effect) {
			const shadowMoves = [
				'shadowrush', 'shadowblitz', 'shadowwave', 'shadowbreak', 'shadowrave', 'shadowsky', 'shadowend', 'shadowstorm',
				'shadowpanic', 'shadowmist', 'shadowdown', 'shadowhold', 'shadowshed', 'shadowhalf', 'shadowsights', 'shadowbolt',
				'shadowchill', 'shadowfire', 'shadowblast', 'shadowguard', 'shadowarmor', 'shadowsiphon',
			];
			for (const moveid of shadowMoves) {
				const move = this.dex.moves.get(moveid);
				for (const {learnset} of this.dex.species.getFullLearnset(species.id)) {
					if (moveid in learnset && target?.pokeball === 'shadow') {
						target.baseMoveSlots.push({
							move: move.name,
							id: move.id,
							pp: move.pp * 8 / 5,
							maxpp: move.pp * 8 / 5,
							target: move.target,
							disabled: false,
							disabledSource: '',
							used: false,
						});
						target.moveSlots = target.baseMoveSlots.slice();
						break;
					}
				}
			}
		}, */
		onSwitchIn(pokemon) {
			const shadowMoves = [
				'shadowrush', 'shadowblitz', 'shadowwave', 'shadowbreak', 'shadowrave', 'shadowsky', 'shadowend', 'shadowstorm',
				'shadowpanic', 'shadowmist', 'shadowdown', 'shadowhold', 'shadowshed', 'shadowhalf', 'shadowsights', 'shadowbolt',
				'shadowchill', 'shadowfire', 'shadowblast', 'shadowguard', 'shadowarmor', 'shadowsiphon',
			];
			let shadowCount = 0;
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				const move = this.dex.moves.get(moveid);
				if (move.type === 'Shadow' || pokemon.hasMove(shadowMoves)) {
					shadowCount++;
					// pokemon.addVolatile('shadow');
				}
				if (shadowCount > 0) {
					pokemon.addVolatile('shadow');
				}
			}
		},
		onBasePowerPriority: 1,
		onBasePower(basePower, source, target, move) {
			if (move.type === 'Shadow') {
				if (target.volatiles['shadow']) {
					return this.chainModify(0.5);
				} else {
					return this.chainModify(2);
				}
			}
		},
	},
};
