export const Items: {[k: string]: ModdedItemData} = {
	adrenalineorb: {
		inherit: true,
		onAfterBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'ability:intimidate') {
				target.useItem();
			}
		},
	},
	protectivepads: {
		inherit: true,
		onSetAbility(ability, target, source, effect) {
			if (target !== source && target === this.activePokemon && this.activeMove && this.activeMove.flags['contact']) {
				if (effect && effect.effectType === 'Ability' && !effect.id.endsWith('wanderingspirit')) {
					this.add('-activate', source, effect.fullname);
					this.add('-activate', target, 'item: Protective Pads');
				}
				return false;
			}
		},
	},
};
