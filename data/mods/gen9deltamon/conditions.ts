export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	futuremove: {
		inherit: true,
		onStart(target, source) {
			this.effectState.targetSlot = target.getSlot();
			this.effectState.endingTurn = (this.turn - 1) + (source.baseSpecies.id !== 'blue' ? 5 : 2);
			if (this.effectState.endingTurn >= 254) {
				this.hint(`In Gen 8+, Future attacks will never resolve when used on the 255th turn or later.`);
			}
		},
	},
}
