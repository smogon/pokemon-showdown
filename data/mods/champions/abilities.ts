export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	angershell: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			this.effectState.checkedAngerShell = !(effect.effectType === "Move" && !effect.multihit);
		},
	},
	berserk: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			this.effectState.checkedBerserk = !(effect.effectType === "Move" && !effect.multihit);
		},
	},
	disguise: {
		inherit: true,
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;

			if (move.hit === 1) delete this.effectState.neutral;
			if (this.effectState.neutral) return 0;

			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			this.effectState.neutral = true;
			return 0;
		},
	},
	dragonize: {
		inherit: true,
		isNonstandard: null,
	},
	healer: {
		inherit: true,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.status && this.randomChance(1, 2)) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive.cureStatus();
				}
			}
		},
		desc: "50% chance this Pokemon's ally has its non-volatile status condition cured at the end of each turn.",
		shortDesc: "50% chance this Pokemon's ally has its status cured at the end of each turn.",
	},
	megasol: {
		inherit: true,
		isNonstandard: null,
	},
	piercingdrill: {
		inherit: true,
		isNonstandard: null,
	},
	regenerator: {
		inherit: true,
		onSwitchOut(pokemon) {
			if (pokemon.heal(pokemon.baseMaxhp / 3)) {
				this.add('-heal', pokemon, pokemon.getHealth, '[from] ability: Regenerator', '[silent]');
			}
		},
	},
	spicyspray: {
		inherit: true,
		isNonstandard: null,
	},
	unseenfist: {
		onModifyMove: undefined, // no inherit
		onHitProtect(source, target, move) {
			if (move.flags['contact']) {
				target.getMoveHitData(move).bypassProtect = this.effect;
				return false;
			}
		},
		inherit: true,
		shortDesc: "This Pokemon's contact moves ignore a target's protection and deal 1/4 the usual damage.",
	},
};
