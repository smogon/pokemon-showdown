export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	slowstart: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(defender, attacker, effect) {
				if (defender.m.revivedByMonkeysPaw) return 0;
				return 5;
			},
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(defender, attacker, effect) {
				if (defender.m.revivedByMonkeysPaw) this.effectState.duration = 0;
				this.add('-start', defender, 'ability: Slow Start');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(defender) {
				this.add('-end', defender, 'Slow Start');
			},
		},
	},
};
