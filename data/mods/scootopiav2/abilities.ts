export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	mythicalpresence: {
		name: "Mythical Presence",
		shortDesc: "Lowers opposing Pokemon Special Attack by 1 stage when switching in.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Mythical Presence', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spa: -1 }, target, pokemon, null, true);
				}
			}
		},
	},
	powerconstruct: {
		onResidualOrder: 27,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Flocura' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'flocuranexus' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			pokemon.formeChange('Flocura-Nexus', this.effect, true);
			pokemon.baseMaxhp = Math.floor(Math.floor(
				2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
			) * pokemon.level / 100 + 10);
			const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
			pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newMaxHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Power Construct",
		rating: 5,
		num: 211,
	},
	battlebond: {
		shortDesc: "Change to a stronger forme after getting a KO.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'soleron' && source.hp && !source.transformed && source.side.foe.pokemonLeft) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Soleron-Awakened', this.effect, true);
			}
		},
		onModifyMovePriority: -1,
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		rating: 4,
		num: 210,
	},
	crystalheart: {
		shortDesc: "User becomes Crystal type. While Crystal type, 33% boost to Def and SpD",
		onStart(pokemon) {
			if (pokemon.hasType('Crystal')) return false;
			if (!pokemon.addType('Crystal')) return false;
			pokemon.setType(["Crystal"]);
			this.add('-start', pokemon, 'typechange', 'Crystal', '[from] ability: Crystal Heart');
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Crystal')) return this.chainModify(1 + (1 / 3));
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Crystal')) return this.chainModify(1 + (1 / 3));
		},
		name: "Crystal Heart",
	},
	wildheart: {
		onStart(pokemon) {
			if (pokemon.hasType('Feral')) return false;
			if (!pokemon.addType('Feral')) return false;
			pokemon.setType(["Feral"]);
			this.add('-start', pokemon, 'typechange', "Feral", '[from] ability: Wild Heart');
		},
		onModifyAtkPriority: 6,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hasType('Feral')) return this.chainModify(1 + (1 / 3));
		},
		onModifySpAPriority: 6,
		onModifySpA(spa, pokemon) {
			if (pokemon.hasType('Feral')) return this.chainModify(1 + (1 / 3));
		},
		name: "Wild Heart",
		shortDesc: "User becomes Feral type. While Feral type, 33% boost to Atk and SpA",
	},
	schooling: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Jaegorm' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'jaegorm') {
					pokemon.formeChange('Jaegorm-Collective');
				}
			} else {
				if (pokemon.species.id === 'jaegormcollective') {
					pokemon.formeChange('Jaegorm');
				}
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Jaegorm' || pokemon.transformed || !pokemon.hp
			) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'jaegorm') {
					pokemon.formeChange('Jaegorm-Collective');
				}
			} else {
				if (pokemon.species.id === 'jaegormcollective') {
					pokemon.formeChange('Jaegorm');
				}
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Schooling",
		shortDesc: "If user is Jaegorm, changes to Collective Form if it has > 1/4 max HP, else Solo Form.",
		rating: 3,
		num: 208,
	},
	shellbunker: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' || !target.hurtThisTurn) return damage;
			return damage / 2;
		},
		name: "Shell Bunker",
		shortDesc: "After taking damage, Def and SpD are doubled for the rest of the turn.",
	},
};
