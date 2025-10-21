export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	ange: {
		gen: 9,
		desc: "Gain 1/12 of max HP at the end of every turn. Opposing Megas lose 1/10 max HP every turn.",
		shortDesc: "Gain 1/12 of max HP at the end of every turn. Opposing Megas lose 1/10 max HP every turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon, target) {
			if (target?.baseSpecies.isMega && !target.fainted) {
				this.damage(target.baseMaxhp / 10, target, pokemon);
				this.heal(target.baseMaxhp / 10);
			} else {
				this.heal(pokemon.baseMaxhp / 12);
			}
		},
		name: "Ange",
	},
	battlebond: {
		inherit: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (source.bondTriggered) return;
			if (effect?.effectType !== 'Move') return;
			if (source.species.baseSpecies === 'Greninja' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.boost({ atk: 1, spa: 1, spe: 1 }, source, source, this.effect);
				this.add('-activate', source, 'ability: Battle Bond');
				source.bondTriggered = true;
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Mega' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		desc: "After KOing a Pokemon: +1 Atk/SpA/Spe. Water Shuriken while Mega: 20 power, hits 3x.",
		shortDesc: "After KOing a Pokemon: +1 Atk/SpA/Spe. Water Shuriken while Mega: 20 power, hits 3x.",
	},
	brassbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 3;
			move.multihitType = 'brassbond' as 'parentalbond';
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.effectType === 'Move' && effect.multihitType && effect.hit > 1 &&
				source && target === source) {
				let i: keyof BoostsTable;
				for (i in boost) {
					delete boost[i];
				}
			}
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType && move.hit > 1) {
				return [];
			}
		},
		flags: {},
		name: "Brass Bond",
		gen: 9,
		desc: "This Pokemon's damaging moves hit 3x. Successive hits do 15% damage without added effects.",
		shortDesc: "This Pokemon's damaging moves hit 3x. Successive hits do 15% damage without added effects.",
	},
	contrarian: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= -2;
			}
		},
		name: "Contrarian",
		desc: "This Pokemon has its stat changes inverted and doubled.",
		shortDesc: "This Pokemon has its stat changes inverted and doubled.",
		gen: 9,
	},
	corrosion: {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		shortDesc: "This Pokemon can poison a Pokemon regardless of its typing and hit them with Poison moves.",
	},
	ionbattery: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.5);
		},
		flags: { breakable: 1 },
		name: "Ion Battery",
		desc: "This Pokemon floats and has 1.5x Sp. Atk.",
		shortDesc: "This Pokemon floats and has 1.5x Sp. Atk.",
	},
	leaderofthepride: {
		onStart(pokemon) {
			pokemon.updateMaxHp();
			if (this.field.setWeather('sunnyday')) {
				this.add('-activate', pokemon, 'Leader of the Pride', '[source]');
			} else if (this.field.isWeather('sunnyday')) {
				this.add('-activate', pokemon, 'ability: Leader of the Pride');
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('leader of the pride boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
		name: "Leader of the Pride",
		gen: 9,
		desc: "On switch-in, summons Sunny Day. During Sunny Day, Sp. Atk is 1.3333x.",
		shortDesc: "On switch-in, summons Sunny Day. During Sunny Day, Sp. Atk is 1.3333x.",
	},
	luchadorspride: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spe: length }, source);
			}
		},
		flags: {},
		name: "Luchador's Pride",
		desc: "This Pokemon's Speed is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Speed is raised by 1 stage if it attacks and KOes another Pokemon.",
		gen: 9,
	},
	protectivethorns: {
		gen: 9,
		name: "Protective Thorns",
		desc: "Bulletproof + Iron Barbs.",
		shortDesc: "Bulletproof + Iron Barbs.",
		onTryHit(pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[from] ability: Protective Thorns');
				return null;
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: { breakable: 1 },
	},
	minus: {
		inherit: true,
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus', 'ionbattery'])) {
					return this.chainModify(1.5);
				}
			}
		},
	},
	plus: {
		inherit: true,
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus', 'ionbattery'])) {
					return this.chainModify(1.5);
				}
			}
		},
	},
};
