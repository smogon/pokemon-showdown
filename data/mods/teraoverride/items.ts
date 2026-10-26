export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	absorbbulb: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === defender.teraType) {
				defender.useItem();
			}
		},
	},
	adamantcrystal: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 483 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	adamantorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 483 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	babiriberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	blackbelt: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	blackglasses: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	blacksludge: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.hasType(pokemon.teraType)) {
				this.heal(pokemon.baseMaxhp / 16);
			} else {
				this.damage(pokemon.baseMaxhp / 8);
			}
		},
	},
	buggem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	cellbattery: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === defender.teraType) {
				defender.useItem();
			}
		},
	},
	charcoal: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	chartiberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	chilanberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (
				move.type === defender.teraType &&
				(!defender.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))
			) {
				if (defender.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', defender, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	colburberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	darkgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	dracoplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	dragonfang: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	dragongem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	dreadplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	earthplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	electricgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	fairyfeather: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	fairygem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	fightinggem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	firegem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	fistplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	flameplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	flyinggem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	ghostgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	grassgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	griseouscore: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 487 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 487 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	groundgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	habanberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	hardstone: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	icegem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	icicleplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	insectplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	ironball: {
		inherit: true,
		onEffectiveness(typeMod, defender, type, move) {
			if (!defender) return;
			if (defender.volatiles['ingrain'] || defender.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Ground' && defender.hasType(defender.teraType)) return 0;
		},
	},
	ironplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	kasibberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	luminousmoss: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === defender.teraType) {
				defender.useItem();
			}
		},
	},
	lustrousglobe: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 484 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	lustrousorb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (user.baseSpecies.num === 484 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	magnet: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	meadowplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	metalcoat: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	mindplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	miracleseed: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	mysticwater: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	nevermeltice: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	normalgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	occaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	oddincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	passhoberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	payapaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	pixieplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisonbarb: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisongem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	psychicgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	rindoberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	rockincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	rockgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	roseincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	roseliberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	seaincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	sharpbeak: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	shucaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	silkscarf: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	silverpowder: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	skyplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	snowball: {
		inherit: true,
		onDamagingHit(damage, defender, attacker, move) {
			if (move.type === defender.teraType) {
				defender.useItem();
			}
		},
	},
	softsand: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	souldew: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (
				move && (user.baseSpecies.num === 380 || user.baseSpecies.num === 381) &&
				move.type === user.teraType
			) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	spelltag: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	splashplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	spookyplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	steelgem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	stoneplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	tangaberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	twistedspoon: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	wacanberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	watergem: {
		inherit: true,
		onSourceTryPrimaryHit(defender, attacker, move) {
			if (defender === attacker || move.category === 'Status') return;
			if (move.type === attacker.teraType && attacker.useItem()) {
				attacker.addVolatile('gem');
			}
		},
	},
	waveincense: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	yacheberry: {
		inherit: true,
		onSourceModifyDamage(damage, attacker, defender, move) {
			if (move.type === defender.teraType && defender.getMoveHitData(move).typeMod > 0) {
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
	zapplate: {
		inherit: true,
		onBasePower(basePower, user, defender, move) {
			if (move?.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
};
