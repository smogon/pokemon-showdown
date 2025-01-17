export const Conditions: import('../../../sim/dex-conditions').ModdedConditionDataTable = {
	choicelock: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			const choiceItem = pokemon.getItem().isChoice ||
				Object.keys(pokemon.volatiles).some(v => (
					v.startsWith('item:') && this.dex.items.get(v.split(':')[1]).isChoice
				));
			if (!choiceItem) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (
				!pokemon.ignoringItem() && !pokemon.volatiles['dynamax'] &&
				move.id !== this.effectState.move && move.id !== 'struggle'
			) {
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice item lock");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			const choiceItem = pokemon.getItem().isChoice ||
				Object.keys(pokemon.volatiles).some(v => (
					v.startsWith('item:') && this.dex.items.get(v.split(':')[1]).isChoice
				));
			if (!choiceItem || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem() || pokemon.volatiles['dynamax']) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
	},
};
