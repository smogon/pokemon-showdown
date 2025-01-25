export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	aguavberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	airballoon: {
		inherit: true,
		onStart(target) {
			if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
				this.add('-item', target, 'Air Balloon');
				if (target.lastTurnEjected) this.add('-item', target, 'Air Balloon');
			}
		},
	},
	belueberry: {
		inherit: true,
		isNonstandard: null,
	},
	berryjuice: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				if (this.runEvent('TryHeal', pokemon, null, this.effect, 20) && pokemon.useItem()) {
					this.heal(20);
					if (pokemon.lastTurnEjected && !pokemon.newlySwitched) {
						this.heal(20);
						pokemon.lastTurnEjected = null;
					}
				}
			}
		},
	},
	cornnberry: {
		inherit: true,
		isNonstandard: null,
	},
	durinberry: {
		inherit: true,
		isNonstandard: null,
	},
	fastball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	figyberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	heavyball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	iapapaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	leftovers: {
		inherit: true,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
			if (pokemon.lastTurnEjected) this.heal(pokemon.baseMaxhp / 16);
		},
	},
	levelball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !move.ohko) {
				this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
				if (source.lastTurnEjected) this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
			}
		},
	},
	loveball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lureball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	machobrace: {
		inherit: true,
		isNonstandard: null,
	},
	magoberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magostberry: {
		inherit: true,
		isNonstandard: null,
	},
	mentalherb: {
		inherit: true,
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
			for (const firstCondition of conditions) {
				if (pokemon.volatiles[firstCondition]) {
					if (!pokemon.useItem()) return;
					let foundSource;
					for (const secondCondition of conditions) {
						let secondSource;
						if (pokemon.volatiles[secondCondition] && pokemon.volatiles[secondCondition].source) {
							secondSource = pokemon.volatiles[secondCondition].source;
						}
						pokemon.removeVolatile(secondCondition);
						if (firstCondition === 'attract' && secondCondition === 'attract') {
							this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
							if (secondSource.item && secondSource.item === 'destinyknot' && secondSource.lastTurnEjected) {
								foundSource = secondSource;
							}
						}
					}
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + foundSource);
					return;
				}
			}
		},
	},
	moonball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nanabberry: {
		inherit: true,
		isNonstandard: null,
	},
	nomelberry: {
		inherit: true,
		isNonstandard: null,
	},
	oldamber: {
		inherit: true,
		isNonstandard: null,
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: null,
	},
	quickclaw: {
		inherit: true,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && pokemon.hasAbility("myceliummight")) return;
			if (priority <= 0 && this.randomChance(1, 5)) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				if (pokemon.lastTurnEjected) this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
	},
	rabutaberry: {
		inherit: true,
		isNonstandard: null,
	},
	razorclaw: {
		inherit: true,
		onModifyCritRatio(critRatio) {
			if (this.event.target.lastTurnEjected) return critRatio + 2;
			return critRatio + 1;
		},
	},
	razzberry: {
		inherit: true,
		isNonstandard: null,
	},
	rockyhelmet: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 6, source, target, null, true);
				if (target.lastTurnEjected) this.damage(source.baseMaxhp / 6, source, target, null, true);
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	scopelens: {
		inherit: true,
		onModifyCritRatio(critRatio) {
			if (this.event.target.lastTurnEjected) return critRatio + 2;
			return critRatio + 1;
		},
	},
	shellbell: {
		inherit: true,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 8, pokemon);
				if (pokemon.lastTurnEjected) this.heal(move.totalDamage / 8, pokemon);
			}
		},
	},
	spelonberry: {
		inherit: true,
		isNonstandard: null,
	},
	souldew: {
		inherit: true,
		onBasePower() {},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
	},
	watmelberry: {
		inherit: true,
		isNonstandard: null,
	},
	wepearberry: {
		inherit: true,
		isNonstandard: null,
	},
	wikiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
};
