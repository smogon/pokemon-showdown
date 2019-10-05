'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	"anticipation": {
		inherit: true,
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective on this Pokemon, or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, while Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category !== 'Status' && (this.dex.getImmunity(move.type, pokemon) && this.dex.getEffectiveness(move.type, pokemon) > 0 || move.ohko)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
	},
	"frisk": {
		inherit: true,
		shortDesc: "On switch-in, this Pokemon identifies a random foe's held item.",
		onStart(pokemon) {
			let target = pokemon.side.foe.randomActive();
			if (target && target.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon);
			}
		},
	},
	"infiltrator": {
		inherit: true,
		desc: "This Pokemon's moves ignore the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
		shortDesc: "This Pokemon's moves ignore the foe's Reflect, Light Screen, Safeguard, and Mist.",
		rating: 1.5,
	},
	"keeneye": {
		inherit: true,
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
		onModifyMove() {},
	},
	"oblivious": {
		inherit: true,
		desc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return null;
			}
		},
		rating: 0.5,
	},
	"overcoat": {
		inherit: true,
		shortDesc: "This Pokemon is immune to damage from Sandstorm or Hail.",
		onTryHit() {},
		rating: 0.5,
	},
	"sapsipper": {
		inherit: true,
		onAllyTryHitSide() {},
	},
	"serenegrace": {
		inherit: true,
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
	},
	"soundproof": {
		inherit: true,
		shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell.",
		onAllyTryHitSide() {},
	},
};

exports.BattleAbilities = BattleAbilities;
