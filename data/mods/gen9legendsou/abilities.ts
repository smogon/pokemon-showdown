export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	ange: {
		gen: 9,
		desc: "Gain 1/12 of max HP at the end of every turn. Opposing Megas lose 1/10 max HP every turn.",
		shortDesc: "Gain 1/12 of max HP at the end of every turn. Opposing Megas lose 1/10 max HP every turn.",
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon, target) {
			if (target?.hp && !target.fainted && target.species.isMega) {
				this.damage(target.baseMaxhp / 10, target, pokemon);
				this.heal(pokemon.baseMaxhp / 10);
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
				delete move.multihit;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		desc: "After KOing a Pokemon: +1 Atk/SpA/Spe. Water Shuriken while Mega: 75 power, hits 1x.",
		shortDesc: "After KOing a Pokemon: +1 Atk/SpA/Spe. Water Shuriken while Mega: 75 power, hits 1x.",
	},
	brassbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 3;
			move.multihitType = 'brassbond' as 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		flags: {},
		name: "Brass Bond",
		gen: 9,
		desc: "This Pokemon's damaging moves hit 3x. The second and third hits do 1/10 of the original damage.",
		shortDesc: "This Pokemon's damaging moves hit 3x. The second and third hits do 1/10 of the original damage.",
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
		shortDesc: "This Pokemon can poison a Pokemon regardless of its typing and hit it with Poison moves.",
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
};
