export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	airlock: {
		inherit: true,
		onSwitchInPriority: 4,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
	},
	cloudnine: {
		inherit: true,
		onSwitchInPriority: 4,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
	},
	cutecharm: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attacker.addVolatile('attract', defender);
				}
			}
		},
	},
	drizzle: {
		inherit: true,
		onSwitchInPriority: 3,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
	},
	drought: {
		inherit: true,
		onSwitchInPriority: 3,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
	},
	effectspore: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact'] && this.randomChance(1, 10)) {
				const status = this.sample(['slp', 'par', 'psn']);
				attacker.trySetStatus(status, defender);
			}
		},
	},
	flamebody: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attacker.trySetStatus('brn', defender);
				}
			}
		},
	},
	flashfire: {
		inherit: true,
		onTryHit(defender, attacker, move) {
			if (defender !== attacker && move.type === 'Fire') {
				if (move.id === 'willowisp' && (defender.hasType('Fire') || defender.status || defender.volatiles['substitute'])) {
					return;
				}
				if (defender.status === 'frz') {
					return;
				}
				if (!defender.addVolatile('flashfire')) {
					this.add('-immune', defender, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
	},
	forecast: {
		inherit: true,
		onSwitchInPriority: 3,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
		flags: {},
	},
	hustle: {
		inherit: true,
		onSourceModifyAccuracy(accuracy, defender, attacker, move) {
			const physicalTypes = ['Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel'];
			if (physicalTypes.includes(move.type) && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
	},
	intimidate: {
		inherit: true,
		onSwitchInPriority: 2, // before Trace
		onStart(pokemon) {
			let activated = false;
			for (const defender of pokemon.adjacentFoes()) {
				if (!defender.volatiles['substitute']) {
					activated = true;
					break;
				}
			}

			if (!activated) {
				this.hint("In Gen 3, Intimidate does not activate if every defender has a Substitute.", false, pokemon.side);
				return;
			}
			this.add('-ability', pokemon, 'Intimidate', 'boost');

			for (const defender of pokemon.adjacentFoes()) {
				if (defender.volatiles['substitute']) {
					this.add('-immune', defender);
				} else {
					this.boost({ atk: -1 }, defender, pokemon, null, true);
				}
			}
		},
	},
	lightningrod: {
		inherit: true,
		onAnyRedirectTarget: undefined, // no inherit
		onFoeRedirectTarget(defender, attacker, source2, move) {
			// don't count Hidden Power as Electric-type
			if (this.dex.moves.get(move.id).type !== 'Electric') return;
			if (this.validTarget(this.effectState.defender, attacker, move.defender)) {
				return this.effectState.defender;
			}
		},
	},
	magnetpull: {
		inherit: true,
		onFoeTrapPokemon: undefined, // no inherit
		onFoeMaybeTrapPokemon: undefined, // no inherit
		onAnyTrapPokemon(pokemon) {
			if (pokemon.hasType('Steel') && pokemon.isAdjacent(this.effectState.defender)) {
				pokemon.tryTrap(true);
			}
		},
		onAnyMaybeTrapPokemon(pokemon, attacker) {
			if (!attacker) attacker = this.effectState.defender;
			if (!attacker || !pokemon.isAdjacent(attacker)) return;
			if (!pokemon.knownType || pokemon.hasType('Steel')) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	minus: {
		inherit: true,
		onModifySpA(spa, pokemon) {
			for (const active of this.getAllActive()) {
				if (!active.fainted && active.hasAbility('plus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	plus: {
		inherit: true,
		onModifySpA(spa, pokemon) {
			for (const active of this.getAllActive()) {
				if (!active.fainted && active.hasAbility('minus')) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	poisonpoint: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attacker.trySetStatus('psn', defender);
				}
			}
		},
	},
	pressure: {
		inherit: true,
		onStart(pokemon) {
			this.addSplit(pokemon.side.id, ['-ability', pokemon, 'Pressure', '[silent]']);
		},
	},
	raindish: {
		inherit: true,
		onWeather: undefined, // no inherit
		onResidualOrder: 10,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.heal(pokemon.baseMaxhp / 16);
			}
		},
	},
	roughskin: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				this.damage(attacker.baseMaxhp / 16, attacker, defender);
			}
		},
	},
	sandstream: {
		inherit: true,
		onSwitchInPriority: 3,
		onAfterEntryHazard(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onSwitchIn: undefined, // no inherit
	},
	shadowtag: {
		inherit: true,
		onFoeTrapPokemon(pokemon) {
			pokemon.trapped = true;
		},
	},
	static: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (damage && move.flags['contact']) {
				if (this.randomChance(1, 3)) {
					attacker.trySetStatus('par', defender);
				}
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate: undefined, // no inherit
		onSwitchInPriority: 1, // after Intimidate, before items
		onStart(pokemon) {
			const defender = pokemon.side.randomFoe();
			if (!defender || defender.fainted) return;
			const ability = defender.getAbility();
			pokemon.setAbility(ability, defender);
		},
		flags: {},
	},
	truant: {
		inherit: true,
		onStart: undefined, // no inherit
		onSwitchIn(pokemon) {
			pokemon.truantTurn = this.turn !== 0;
			// it is unnecessary to keep a volatile, but it helps with cross-gen implementation
			if (pokemon.truantTurn) {
				pokemon.addVolatile('truant');
			} else {
				pokemon.removeVolatile('truant');
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			pokemon.truantTurn = !pokemon.truantTurn;
			if (pokemon.truantTurn) {
				pokemon.addVolatile('truant');
			} else {
				pokemon.removeVolatile('truant');
			}
		},
	},
	voltabsorb: {
		inherit: true,
		onTryHit(defender, attacker, move) {
			if (defender !== attacker && move.type === 'Electric' && move.id !== 'thunderwave') {
				if (!this.heal(defender.baseMaxhp / 4)) {
					this.add('-immune', defender, '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
	},
};
