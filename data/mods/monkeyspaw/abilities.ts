export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	slowstart: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (target.m.revivedByMonkeysPaw) return 0;
				return 5;
			},
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target, source, effect) {
				if (target.m.revivedByMonkeysPaw) this.effectState.duration = 0;
				this.add('-start', target, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
	},
};
