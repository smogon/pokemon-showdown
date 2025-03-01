export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	magmaticentrance: {
		// implemented in moves.ts
		flags: {},
		shortDesc: "This Pokemon doesn't take damage from hazards.",
		name: "Magmatic Entrance",
		rating: 4,
	},
	entertainer: {
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Entertainer');
			}
		},
		flags: {},
		name: "Entertainer",
		shortDesc: "This Pokemon's type changes to the type of the move it is using.",
		rating: 4,
		num: -168,
	},
	spikedfur: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			const bp = move.basePower;
			if (bp <= 60) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: {},
		name: "Spiked Fur",
		rating: 2.5,
		shortDesc: "Pokemon that use moves with ≤60 BP against this Pokemon lose 1/8 of their max HP.",
	},
	galewings: {
		onModifyPriority(priority, pokemon, target, move) {
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('counteract') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move?.type === 'Flying' && pokemon.hp >= pokemon.maxhp / 4) return priority + 1;
		},
		flags: {},
		name: "Gale Wings",
		shortDesc: "If this Pokemon has 25% of its max HP or more, its Flying-type moves have +1 priority.",
		rating: 3,
		num: 177,
	},
	magicresistance: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Magic Resistance weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Magic Resistance weaken');
				return this.chainModify(0.5);
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || !target || source.switchFlag === true) return;
			if (target !== source && move.category !== 'Status') {
				if (source.item || source.volatiles['gem'] || move.id === 'fling') return;
				const yourItem = target.takeItem(source);
				if (!yourItem) return;
				if (!source.setItem(yourItem)) {
					target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
					return;
				}
				this.add('-item', source, yourItem, '[from] ability: Magic Resistance', `[of] ${target}`);
			}
		},
		flags: { breakable: 1 },
		name: "Magic Resistance",
		rating: 3.5,
		shortDesc: "This Pokemon steals foe's item after hitting them, and takes 50% damage from Fire/Ice.",
	},
	hover: {
		// implemented in moves.ts
		// and also scripts.ts
		flags: {},
		shortDesc: "This Pokemon is immune to Ground moves and Stealth Rock.",
		name: "Hover",
		rating: 4,
	},
	stall: {
		onBeforeMove(target, source, move) {
			if (move.category === 'Status') {
				this.actions.useMove(move, target, { target: source });
			}
		},
		onFractionalPriority: -0.1,
		flags: {},
		shortDesc: "This Pokemon's status moves are used twice, but it usually moves last.",
		name: "Stall",
		rating: 1,
		num: 100,
	},
	gowiththeflow: {
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Go with the Flow');
				}
				return null;
			}
		},
		flags: { breakable: 1 },
		shortDesc: "Effects of Unware and Water Absorb.",
		name: "Go with the Flow",
		rating: 4,
	},
	slidingwhale: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 4, source, target);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(2);
			}
		},
		flags: {},
		shortDesc: "Effects of Slush Rush and Aftermath.",
		name: "Sliding Whale",
		rating: 3,
	},
	fluffycharger: {
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('charge');
		},
		flags: { breakable: 1 },
		shortDesc: "Effects of Fluffy and Electromorphosis.",
		name: "Fluffy Charger",
		rating: 4,
	},
	supremesurvivor: {
		onPrepareHit(source, target, move) {
			if (this.effectState.protean) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.protean = true;
				this.add('-start', source, 'typechange', type, '[from] ability: Supreme Survivor');
			}
		},
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onSwitchIn(pokemon) {
			delete this.effectState.protean;
		},
		flags: {},
		shortDesc: "Effects of Adaptability and Protean.",
		name: "Supreme Survivor",
		rating: 5,
	},
};
