export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	airballoon: {
		inherit: true,
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onDamagingHit(damage, target, source, move) {
			this.add('-enditem', target, 'Air Balloon');
			if (target.item === 'airballoon') {
				target.item = '';
				this.clearEffectState(target.itemState);
			} else {
				delete target.volatiles['item:airballoon'];
				target.m.sharedItemsUsed.push('airballoon');
			}
			this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
		},
		onAfterSubDamage(damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Air Balloon');
				if (target.item === 'airballoon') {
					target.item = '';
					this.clearEffectState(target.itemState);
				} else {
					delete target.volatiles['item:airballoon'];
					target.m.sharedItemsUsed.push('airballoon');
				}
				this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
			}
		},
	},
};
