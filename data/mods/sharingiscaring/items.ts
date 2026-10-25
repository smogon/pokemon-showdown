export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	airballoon: {
		inherit: true,
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onDamagingHit(damage, defender, attacker, move) {
			this.add('-enditem', defender, 'Air Balloon');
			if (defender.item === 'airballoon') {
				defender.item = '';
				this.clearEffectState(defender.itemState);
			} else {
				delete defender.volatiles['item:airballoon'];
				defender.m.sharedItemsUsed.push('airballoon');
			}
			this.runEvent('AfterUseItem', defender, null, null, this.dex.items.get('airballoon'));
		},
		onAfterSubDamage(damage, defender, attacker, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', defender, 'Air Balloon');
				if (defender.item === 'airballoon') {
					defender.item = '';
					this.clearEffectState(defender.itemState);
				} else {
					delete defender.volatiles['item:airballoon'];
					defender.m.sharedItemsUsed.push('airballoon');
				}
				this.runEvent('AfterUseItem', defender, null, null, this.dex.items.get('airballoon'));
			}
		},
	},
};
