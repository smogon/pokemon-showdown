export const Items: {[k: string]: ModdedItemData} = {
	chilanberry: {
		inherit: true,
		desc: "Blocks damage taken from a Normal-type attack. Single use.",
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (
				move.type === 'Normal' &&
				(!target.volatiles['substitute'] || move.flags['authentic'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
					this.debug('no damage');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	enigmaberry: {
		inherit: true,
		desc: "Restores 100% max HP after holder is hit by a supereffective move. Single use.",
		onHit(target, source, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				if (target.eatItem()) {
					this.heal(target.baseMaxhp);
				}
			}
		},
	},
	lansatberry: {
		inherit: true,
		desc: "Holder gains +4 Critical Hit ratio when at 1/4 max HP or less. Single use.",
		onEat(pokemon) {
			pokemon.addVolatile('lansatberry');
		},
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') {
					this.add('-start', target, 'move: Lansat Berry', '[zeffect]');
				} else if (effect && (['imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Lansat Berry', '[silent]');
				} else {
					this.add('-start', target, 'move: Lansat Berry');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 4;
			},
		},
	},
	leppaberry: {
		inherit: true,
		desc: "Restores the first of the holder's moves to reach 0 PP to maximum PP. Single use.",
		onEat(pokemon) {
			const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
				pokemon.moveSlots.find(move => move.pp < move.maxpp);
			if (!moveSlot) return;
			moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
		},
	},
	micleberry: {
		inherit: true,
		desc: "Holder's next move can't miss when at 1/4 max HP or less. Single use.",
		condition: {
			duration: 2,
			onSourceAccuracy(accuracy, target, source, move) {
				if (!move.ohko) {
					this.add('-enditem', source, 'Micle Berry');
					source.removeVolatile('micleberry');
					if (typeof accuracy === 'number') {
						return true;
					}
				}
			},
		},
	},
	starfberry: {
		inherit: true,
		desc: "Raises a random stat by 12 when at 1/4 max HP or less (not acc/eva). Single use.",
		onEat(pokemon) {
			const stats: BoostName[] = [];
			let stat: BoostName;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 12;
				this.boost(boost);
			}
		},
	},
	occaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Fire-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	passhoberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Water-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	wacanberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Electric-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	rindoberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Grass-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	yacheberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Ice-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	chopleberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Fighting-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	kebiaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Poison-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	shucaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Ground-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	cobaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Flying-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	payapaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Psychic-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	tangaberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Bug-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	chartiberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Rock-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	kasibberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Ghost-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	habanberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Dragon-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	colburberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Dark-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	babiriberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Steel-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	roseliberry: {
		inherit: true,
		desc: `Blocks damage taken from a supereffective Fairy-type attack. Single use.`,
		onSourceModifyDamage(damage, source, target, move) {},
		onDamage(damage, target, source, effect) {
			const move = effect;
			if (!move || move.effectType !== 'Move') return;
			if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-100% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return 0;
				}
			}
		},
	},
	oranberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
		},
		desc: `Restores 100% max HP when at 1/2 max HP or less. Single use.`,
	},
	sitrusberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
		},
		desc: `Restores 100% max HP when at 1/2 max HP or less. Single use.`,
	},
	figyberry: {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -Atk Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	iapapaberry: {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -Def Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	wikiberry: {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -SpA Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	aguavberry: {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -SpD Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magoberry: {
		inherit: true,
		desc: `Restores 100% max HP at 1/4 max HP or less; confuses if -Spe Nature. Single use.`,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	liechiberry: {
		inherit: true,
		desc: `Raises holder's Attack by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({atk: 12});
		},
	},
	ganlonberry: {
		inherit: true,
		desc: `Raises holder's Defense by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({def: 12});
		},
	},
	petayaberry: {
		inherit: true,
		desc: `Raises holder's Sp. Atk by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({spa: 12});
		},
	},
	apicotberry: {
		inherit: true,
		desc: `Raises holder's Sp. Def by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({spd: 12});
		},
	},
	salacberry: {
		inherit: true,
		desc: `Raises holder's Speed by 12 stages when at 1/4 max HP or less. Single use.`,
		onEat(pokemon) {
			this.boost({spe: 12});
		},
	},
	keeberry: {
		inherit: true,
		desc: `Raises holder's Defense by 12 stages after it is hit by a Physical attack. Single use.`,
		onEat(pokemon) {
			this.boost({def: 12});
		},
	},
	marangaberry: {
		inherit: true,
		desc: `Raises holder's Sp. Def by 12 stages after it is hit by a Special attack. Single use.`,
		onEat(pokemon) {
			this.boost({spd: 12});
		},
	},
	jabocaberry: {
		inherit: true,
		desc: `If holder is hit by a physical move, attacker loses 100% of its HP. Single use.`,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp, source, target);
				}
			}
		},
	},
	rowapberry: {
		inherit: true,
		desc: `If holder is hit by a special move, attacker loses 100% of its HP. Single use.`,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special') {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp, source, target);
				}
			}
		},
	},
};
