export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	absorbbulb: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				target.useItem();
			}
		},
	},
	adamantcrystal: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 483 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	adamantorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 483 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	babiriberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	blackbelt: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	blackglasses: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
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
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	cellbattery: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				target.useItem();
			}
		},
	},
	charcoal: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	chartiberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chilanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (
				move.type === target.teraType &&
				(!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chopleberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cobaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	colburberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	darkgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	dracoplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	dragonfang: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	dragongem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	dreadplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	earthplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	electricgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	fairyfeather: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	fairygem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	fightinggem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	firegem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	fistplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	flameplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	flyinggem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	ghostgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	grassgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	griseouscore: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 487 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	griseousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 487 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	groundgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	habanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	hardstone: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	icegem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	icicleplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	insectplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	ironball: {
		inherit: true,
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Ground' && target.hasType(target.teraType)) return 0;
		},
	},
	ironplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	kasibberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	kebiaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	luminousmoss: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				target.useItem();
			}
		},
	},
	lustrousglobe: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 484 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	lustrousorb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 484 && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	magnet: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	meadowplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	metalcoat: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	mindplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	miracleseed: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	mysticwater: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	nevermeltice: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	normalgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	occaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	oddincense: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	passhoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	payapaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	pixieplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisonbarb: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	poisongem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	psychicgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	rindoberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	rockincense: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	rockgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	roseincense: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	roseliberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	seaincense: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	sharpbeak: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	shucaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	silkscarf: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	silverpowder: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	skyplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	snowball: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.type === target.teraType) {
				target.useItem();
			}
		},
	},
	softsand: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	souldew: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
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
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	splashplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	spookyplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	steelgem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	stoneplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	tangaberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	toxicplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	twistedspoon: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	wacanberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	watergem: {
		inherit: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === source.teraType && source.useItem()) {
				source.addVolatile('gem');
			}
		},
	},
	waveincense: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	yacheberry: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === target.teraType && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	zapplate: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === user.teraType) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
};
