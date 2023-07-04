export const Abilities: {[k: string]: ModdedAbilityData} = {
	asoneglastrier: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	asonespectrier: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	chillingneigh: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	curiousmedicine: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	disguise: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				if (["rollout", "iceball"].includes(effect.id)) {
					source.volatiles[effect.id].contactHitCount--;
				}

				this.add("-activate", target, "ability: Disguise");
				this.effectState.busted = true;
				return 0;
			}
		},
	},
	dragonsmaw: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grimneigh: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	iceface: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' && effect.category === 'Physical' &&
				target.species.id === 'eiscue' && !target.transformed
			) {
				if (["rollout", "iceball"].includes(effect.id)) {
					source.volatiles[effect.id].contactHitCount--;
				}

				this.add("-activate", target, "ability: Disguise");
				this.effectState.busted = true;
				return 0;
			}
		},
	},
	transistor: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
};
