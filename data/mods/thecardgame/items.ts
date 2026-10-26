export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	buggem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Grass' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	chartiberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Fighting' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cobaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Normal' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	earthplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	fairygem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Psychic' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	flyinggem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Normal' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	ghostgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Psychic' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	griseouscore: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 487 && (move.type === 'Psychic' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 487 && (move.type === 'Psychic' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	groundgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Fighting' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	hardstone: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	icegem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Water' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	icicleplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	insectplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	ironball: {
		inherit: true,
		onEffectiveness(typeMod, defender, type, move) {
			if (!defender) return;
			if (defender.volatiles['ingrain'] || defender.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Fighting' && defender.hasType('Normal')) return 0;
		},
	},
	kasibberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Psychic' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	kebiaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Dark' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	nevermeltice: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	pixieplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisonbarb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Dark') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisongem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Dark' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	rockgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === 'Fighting' && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	rockincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	roseliberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Psychic' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	sharpbeak: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === 'Normal') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	shucaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Fighting' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	silverpowder: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	skyplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Normal') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	snowball: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === 'Water') {
				defender.useItem();
			}
		},
	},
	softsand: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	spelltag: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	spookyplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	stoneplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	tangaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Grass' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	toxicplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move.type === 'Dark') {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	yacheberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === 'Water' && defender.getMoveHitData(move).typeMod > 0) {
				const hitSub = defender.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	vilevial: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === -66 && ['Dark', 'Normal'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
};
