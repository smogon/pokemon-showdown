export const Moves: {[k: string]: ModdedMoveData} = {
	acid: {
		inherit: true,
		secondary: {
			chance: 33, // Stadium Zero didn't nerf this.
			boosts: {
				def: -1,
			},
		},
		target: "normal",
	},
	aurorabeam: {
		inherit: true,
		secondary: {
			chance: 33, // Stadium Zero didn't nerf this.
			boosts: {
				atk: -1,
			},
		},
	},
	bubble: {
		inherit: true,
		secondary: {
			chance: 33, // Not this either.
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
	},
	bubblebeam: {
		inherit: true,
		secondary: {
			chance: 33, // Yep.
			boosts: {
				spe: -1,
			},
		},
	},
	haze: { // Stadium Zero uses RBY Haze.
		inherit: true,
		onHit(target, source) {
			this.add('-activate', target, 'move: Haze');
			this.add('-clearallboost', '[silent]');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();

				if (pokemon !== source) {
					pokemon.cureStatus(true);
				}
				if (pokemon.status === 'tox') {
					pokemon.setStatus('psn');
				}
				for (const id of Object.keys(pokemon.volatiles)) {
					if (id === 'residualdmg') {
						pokemon.volatiles[id].counter = 0;
					} else {
						pokemon.removeVolatile(id);
						this.add('-end', pokemon, id, '[silent]');
					}
				}
			}
		},
		target: "self",
	},
	hyperbeam: {
		inherit: true,
		onMoveFail(target, source, move) {}, // Does not force a recharge on missing; it's RBY Hyper Beam.
	},
	rest: {
		inherit: true,
		onHit(target, source, move) {
			// Fails if the difference between
			// max HP and current HP is 0, 255, or 511
			// Stadium Zero Rest does not remove the major status...things.
			if (target.hp >= target.maxhp) return false;
			if (!target.setStatus('slp', source, move)) return false;
			target.statusState.time = 2;
			target.statusState.startTime = 2;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
	},
	substitute: { // FIXME: Needs to have boomers not die against it. I think it's the recoil part?
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
				let uncappedDamage = move.hit > 1 ? source.lastDamage : this.actions.getDamage(source, target, move);
				if (!uncappedDamage) return null;
				uncappedDamage = this.runEvent('SubDamage', target, source, move, uncappedDamage);
				if (!uncappedDamage) return uncappedDamage;
				source.lastDamage = uncappedDamage;
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
					target.attackedBy.push({source: source, move: move.id, damage: uncappedDamage, thisTurn: true, slot: source.getSlot()});
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
	struggle: {
		inherit: true,
		ignoreImmunity: {'Normal': false}, // Stadium Zero uses RBY Struggle.
	},
	swift: {
		inherit: true,
		accuracy: 100, // Stadium Zero didn't fix Swift, ye.
	},
};
