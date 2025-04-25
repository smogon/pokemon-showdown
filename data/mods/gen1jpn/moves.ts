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
			onStart(target) {
				this.add('-start', target, 'Substitute');
				this.effectState.hp = Math.floor(target.maxhp / 4) + 1;
				delete target.volatiles['partiallytrapped'];
			},
			onTryHitPriority: -1,
			onTryHit(target, source, move) {
				if (move.drain) {
					this.add('-miss', source);
					this.hint("In the Japanese versions of Gen 1, draining moves always miss against substitutes.");
					return null;
				}
				if (move.category === 'Status') {
					// In gen 1 it only blocks:
					// poison, confusion, secondary effect confusion, stat reducing moves and Leech Seed.
					const subBlocked = ['lockon', 'meanlook', 'mindreader', 'nightmare'];
					if ((move.status && ['psn', 'tox'].includes(move.status)) || (move.boosts && target !== source) ||
						move.volatileStatus === 'confusion' || subBlocked.includes(move.id)) {
						return false;
					}
					return;
				}
				if (move.volatileStatus && target === source) return;
				// NOTE: In future generations the damage is capped to the remaining HP of the
				// Substitute, here we deliberately use the uncapped damage when tracking lastDamage etc.
				// Also, multi-hit moves must always deal the same damage as the first hit for any subsequent hits
				let uncappedDamage = move.hit > 1 ? this.lastDamage : this.actions.getDamage(source, target, move);
				if (!uncappedDamage && uncappedDamage !== 0) return null;
				uncappedDamage = this.runEvent('SubDamage', target, source, move, uncappedDamage);
				if (!uncappedDamage && uncappedDamage !== 0) return uncappedDamage;
				this.lastDamage = uncappedDamage;
				target.volatiles['substitute'].hp -= uncappedDamage > target.volatiles['substitute'].hp ?
					target.volatiles['substitute'].hp : uncappedDamage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
					target.subFainted = true;
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				// Drain/recoil does not happen if the substitute breaks
				if (target.volatiles['substitute']) {
					if (move.recoil) {
						this.damage(Math.round(uncappedDamage * move.recoil[0] / move.recoil[1]), source, target, 'recoil');
					}
					if (move.drain) {
						this.heal(Math.ceil(uncappedDamage * move.drain[0] / move.drain[1]), source, target, 'drain');
					}
				}
				this.runEvent('AfterSubDamage', target, source, move, uncappedDamage);
				// Add here counter damage
				const lastAttackedBy = target.getLastAttackedBy();
				if (!lastAttackedBy) {
					target.attackedBy.push({ source, move: move.id, damage: uncappedDamage, thisTurn: true, slot: source.getSlot() });
				} else {
					lastAttackedBy.move = move.id;
					lastAttackedBy.damage = uncappedDamage;
				}
				return 0;
			},
			onAccuracy(accuracy, target, source, move) {
				if (move.id === 'swift') {
					return true;
				}
				return accuracy;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	swift: {
		inherit: true,
		accuracy: 100,
	},
};
