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
				const isBMM = defender.volatiles['item:airballoon']?.inSlot;
				if (isBMM) {
					defender.removeVolatile('item:airballoon');
					defender.m.scrambled.items.splice((defender.m.scrambled.items as { thing: string, inSlot: string }[]).findIndex(e =>
						this.toID(e.thing) === 'airballoon' && e.inSlot === isBMM), 1);
					if (isBMM === 'Ability') defender.setAbility('No Ability');
				}
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
					const isBMM = defender.volatiles['item:airballoon']?.inSlot;
					if (isBMM) {
						defender.removeVolatile('item:airballoon');
						defender.m.scrambled.items.splice((defender.m.scrambled.items as { thing: string, inSlot: string }[]).findIndex(e =>
							this.toID(e.thing) === 'airballoon' && e.inSlot === isBMM), 1);
						if (isBMM === 'Ability') defender.setAbility('No Ability');
					}
				}
				this.runEvent('AfterUseItem', defender, null, null, this.dex.items.get('airballoon'));
			}
		},
	},
};
