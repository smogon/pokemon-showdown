/**
 * The japanese version of Blizzard in Gen 1 had a 30% chance to freeze
 */

export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	blizzard: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'frz',
		},
	},
	substitute: {
		inherit: true,
		condition: {
			inherit: true,
			onTryHit(defender, attacker, move) {
				if (move.drain) {
					this.add('-miss', attacker);
					this.hint("In the Japanese versions of Gen 1, draining moves always miss against substitutes.");
					return null;
				}
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					const subBlocked = ['lockon', 'meanlook', 'mindreader', 'nightmare'];
					if ((move.status && ['psn', 'tox'].includes(move.status)) || (move.boosts && defender !== attacker) ||
						move.volatileStatus === 'confusion' || subBlocked.includes(move.id)) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && defender === attacker) return;
				// NOTE: In future generations the damage is capped to the remaining HP of the
				// Substitute, here we deliberately use the uncapped damage when tracking lastDamage etc.
				// Also, multi-hit moves must always deal the same damage as the first hit for any subsequent hits
				const uncappedDamage = move.hit > 1 ? this.lastDamage : this.actions.getDamage(attacker, defender, move);
				if (!uncappedDamage && uncappedDamage !== 0) return null;
				this.lastDamage = uncappedDamage;
				defender.volatiles['substitute'].hp -= uncappedDamage > defender.volatiles['substitute'].hp ?
					defender.volatiles['substitute'].hp : uncappedDamage;
				if (defender.volatiles['substitute'].hp <= 0) {
					defender.removeVolatile('substitute');
					defender.subFainted = true;
				} else {
					this.add('-activate', defender, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (defender.volatiles['substitute']) {
					if (uncappedDamage) {
						this.actions.applyRecoilDamage(uncappedDamage, move, attacker);
					}
					if (move.drain) {
						this.heal(Math.ceil(uncappedDamage * move.drain[0] / move.drain[1]), attacker, defender, 'drain');
					}
				}
				this.runEvent('AfterSubDamage', defender, attacker, move, uncappedDamage);
				// Add here counter damage
				const lastAttackedBy = defender.getLastAttackedBy();
				if (!lastAttackedBy) {
					defender.attackedBy.push({ attacker, move: move.id, damage: uncappedDamage, thisTurn: true, slot: attacker.getSlot() });
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = uncappedDamage;
				}
				return 0;
			},
			onAccuracy(accuracy, defender, attacker, move) {
				if (move.id === 'swift') {
					return true;
				}
				return accuracy;
			},
		},
	},
	swift: {
		inherit: true,
		accuracy: 100,
	},
};
