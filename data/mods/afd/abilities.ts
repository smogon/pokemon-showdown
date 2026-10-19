export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	chaossaliva: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(2, 10)) {
					target.trySetStatus('par', source);
				}
				if (this.randomChance(2, 10)) {
					target.addVolatile('confusion', source);
				}
			}
		},
		flags: {},
		name: "Chaos Saliva",
		gen: 9,
		shortDesc: "Contact moves have a 20% chance to paralyze and a 20% chance to confuse.",
	},
	faststart: {
		onStart(pokemon) {
			this.add('-start', pokemon, 'ability: Fast Start');
			this.effectState.counter = 5;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns && this.effectState.counter) {
				this.effectState.counter--;
				if (!this.effectState.counter) {
					this.add('-end', pokemon, 'Fast Start');
					delete this.effectState.counter;
				}
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.effectState.counter) {
				return this.chainModify(2);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.effectState.counter) {
				return this.chainModify(2);
			}
		},
		onEnd(pokemon) {
			if (pokemon.beingCalledBack) return;
			this.add('-end', pokemon, 'Fast Start', '[silent]');
		},
		flags: {},
		name: "Fast Start",
		rating: -1,
		gen: 9,
	},
	ironfist: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([8192, 4096]);
			}
		},
	},
	supermegalauncher: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(4);
			}
		},
		flags: {},
		name: "Mega Launcher",
		desc: "This Pokemon's pulse moves have their power multiplied by 4. Heal Pulse restores 8/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 4x power. Heal Pulse heals 8/4 target's max HP.",
		rating: 3,
		gen: 9,
	},
	discourage: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Discourage', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spa: -1 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Discourage",
		rating: 3.5,
		num: 999,
		gen: 9,
	},
	adaptability: {
		inherit: true,
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				const types = source.getTypes();
				if (types[0] === move.type) return 2.3;
				if (types[1] && types[1] === move.type) return 1.6;
				if (stab === 2.3) {
					return 2.55;
				}
				return 2.7;
			}
		},
	},
	icebody: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(1, 10)) {
					source.trySetStatus('frz', target);
				}
			}
		},
	},
	noretreat: {
		onStart(target) {
			this.add('-start', target, 'move: No Retreat');
		},
		onFoeBeforeSwitchOut(pokemon) {
			if (!pokemon || pokemon.fainted || pokemon.hp <= 0 || pokemon.hasAbility('noretreat')) return;
			const success = !!this.damage(pokemon.maxhp / 4, pokemon, this.effectState.target);
			if (success) {
				pokemon.tryTrap();
			}
		},
		name: "No Retreat",
		flags: { breakable: 1 },
	},
	itsexcadrillintime: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		name: "It's Excadrillin' Time!",
		flags: {},
	},
	goodasgold: {
		inherit: true,
		onTryHit(target, source, move) {
			if (move.category !== 'Special' && target !== source) {
				this.add('-immune', target, '[from] ability: Good as Gold');
				return null;
			}
		},
	},
	intimidate2: {
		onStart(pokemon) {
			let activated = false;
			let timesActivated = 0;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate 2', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ atk: -1 }, target, pokemon, null, true);
					timesActivated++;
				}
			}
			if (timesActivated > 0) {
				for (let i = 0; i < timesActivated; i++) {
					this.boost({ atk: 1 }, pokemon, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Intimidate 2",
		rating: 3.5,
		num: 22,
	},
	asonemonarch: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "As One (Monarch)",
		rating: 3.5,
		num: 266,
	},
	intimidate: {
		inherit: true,
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ atk: -2 }, target, pokemon, null, true);
				}
			}
		},
	},
};
