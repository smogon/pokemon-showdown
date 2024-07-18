export const Items: {[k: string]: ModdedItemData} = {
	// flufi
	sillycostume: {
		name: "Silly Costume",
		gen: 9,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Pikachu-Libre') return this.chainModify(1.25);
		},
		onModifyDef(def, pokemon) {
			if (pokemon.species.name === 'Pikachu-Libre') return this.chainModify(1.25);
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.species.name === 'Pikachu-Libre') return this.chainModify(1.25);
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (pokemon.species.name === 'Pikachu-Libre') return this.chainModify([3277, 4096]);
		},
		onDamagingHit(damage, target, source, move) {
			if (target.species.name === 'Pikachu-Libre' && target.abilityState.itemhp > 0) target.abilityState.itemhp--;
		},
		onUpdate(pokemon) {
			if (pokemon.activeTurns && pokemon.activeTurns > 1 && pokemon.species.name === 'Pikachu') {
				this.add('-activate', pokemon, 'item: Silly Costume');
				pokemon.formeChange('Pikachu-Libre');
				pokemon.useItem();
				this.add('-message', `${pokemon.name} put on their Silly Costume!`);
				pokemon.abilityState.itemhp = 3;
			}
			if (pokemon.species.name === 'Pikachu-Libre' && pokemon.abilityState.itemhp <= 0) {
				this.add('-message', `Oh no! ${pokemon.name}'s costume ripped!`);
				pokemon.formeChange('Pikachu');
				pokemon.abilityState.itemhp = 0;
			}
		},
	},
	// Cyclommatic Cell
	apparatus: {
		name: "Apparatus",
		gen: 9,
		shortDesc: "See '/ssb Cyclommatic Cell' for more!",
		desc: "On switch-in, starts Ion Deluge and Magnet Rise for holder. Restores one gauge of battery life at end of each turn. Techno Blast: Steel-type, 1.3x power.",
		onStart(pokemon) {
			this.add('-activate', pokemon, 'item: Apparatus');
			pokemon.addVolatile('magnetrise');
			this.field.addPseudoWeather('iondeluge');
		},
		onModifyType(move, pokemon) {
			if (move.id === 'technoblast') {
				move.type = 'Steel';
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.id === 'technoblast') return this.chainModify([5325, 4096]);
		},
		onResidual(pokemon) {
			if (pokemon.species.id !== 'vikavolttotem') return;
			if (pokemon.abilityState.gauges < 5) {
				this.add('-activate', pokemon, 'item: Apparatus');
				this.add('-message', `${pokemon.name} gained charge!`);
				pokemon.abilityState.gauges += 1;
				this.add('-message', `Battery Remaining: ${(pokemon.abilityState.gauges / 5) * 100}%`);
			}
		},
	},
	// Morte
	malediction: {
		name: "Malediction",
		gen: 9,
		desc: "Whenever this Pokemon is damaged by an attacking move, the attacking Pokemon is inflicted with Torment.",
		shortDesc: "If holder is damaged by an attack, uses Torment on attacker.",
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			source.addVolatile('torment');
		},
	},
	// Marisa Kirisame
	minihakkero: {
		name: "Mini-Hakkero",
		spritenum: 249,
		onTakeItem: false,
		zMove: "Master Spark",
		zMoveFrom: "Orb Shield",
		itemUser: ["Hatterene"],
		desc: "If held by a Hatterene with Orb Shield, it can use Master Spark.",
		gen: 9,
	},
	// Prince Smurf
	smurfscrown: {
   	name: "Smurf\'s Crown",
      spritenum: 236,
      onTakeItem: false,
      fling: {
         basePower: 300,
      },
      onTryBoost(boost, target, source, effect) {
         if (source && target === source) return;
         let showMsg = false;
         let i: BoostID;
         for (i in boost) {
            if (boost[i]! < 0) {
                  delete boost[i];
                  showMsg = true;
            }
         }
         if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
             this.add('-fail', target, 'unboost', '[from] item: Smurf\'s Crown', '[of] ' + target);
         }
      },
      onAfterMoveSecondarySelfPriority: -1,
      onAfterMoveSecondarySelf(pokemon, target, move) {
         if (move.totalDamage && !pokemon.forceSwitchFlag) {
            this.heal(move.totalDamage / 4, pokemon);
         }
      },
      onUpdate(pokemon) {
         if (pokemon.hp <= pokemon.maxhp / 4) pokemon.eatItem();
		},
		onEat(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
         const r = this.random(100);
         if (r < 33) {
            pokemon.addVolatile('grudge');
         } else if (r >= 33 && r < 66) {
            this.heal(pokemon.baseMaxhp / 2, pokemon, pokemon);
         } else if (r >= 66) {
				let dmg = this.actions.getDamage(pokemon, target, 'Explosion');
				this.add('-message', `${pokemon.name}'s crown exploded!`);
				this.addMove('-anim', pokemon, 'Explosion', pokemon);
				this.damage(dmg, target, pokemon);
				pokemon.faint(pokemon);
			}
		},
		shortDesc: "Use '/ssb Prince Smurf' to see this entry!",
   	desc: "Prevents other Pokemon from lowering the holder's stats; after an attack, holder recovers 1/4 of the damage dealt to the Target. When the holder is at 1/4 HP or less it will trigger 1 of 3 reactions: Applies Grudge to the holder for a turn, item is then disposed; Heals the holder for 50% HP and cures party of status, item is then disposed; Forces the holder to explode.",
   },
	// Kozuchi
	forgedhammer: {
		name: "forgedhammer",
		onTakeItem: false,
		spritenum: 761,
		onModifyMove(move) {
			delete move.flags['contact'];
		},
		zMove: "Emergency Upgrades",
		zMoveFrom: "Weapon Enhancement",
		itemUser: ["Tinkaton"],
		gen: 9,
		desc: "Protects from contact effects. If held by a Tinkaton with 'Weapon Enhancement', allows the usage of the Z-Move 'Emergency Upgrades'.",
	},
	// Urabrask
	urabrasksforge: {
		name: "Urabrask's Forge",
		onTakeItem: false,
		zMove: "Blasphemous Act",
		zMoveFrom: "Terrorize the Peaks",
		itemUser: ["Smokomodo"],
		desc: "If held by a Smokomodo with Terorrize the Peaks, it can use Blasphemous Act.",
		gen: 9,
	},
	// Mima
	crescentstaff: {
		name: "Crescent Staff",
		spritenum: 698,
		onTakeItem: false,
		zMove: "Reincarnation",
		zMoveFrom: "Complete Darkness",
		itemUser: ["Mismagius"],
		desc: "If held by a Mismagius with Complete Darkness, it can use Reincarnation.",
		gen: 9,
	},
	// Gizmo
	inconspicuouscoin: {
		name: "Inconspicuous Coin",
		desc: "When the holder is hit by a damaging move: ~16% chance to do halved damage. When the holder uses a damaging move: 20% chance to do doubled damage. Chances roughly double for each charge this Pokemon has (~16%, ~33%, ~50% | 20%, 40%, 60%)",
		shortDesc: "See this entry with '/ssb Gizmo'!",
		gen: 9,
		onSourceModifyDamage(damage, source, target, move) {
			if (!target.abilityState.charges) target.abilityState.charges = 0;
			const chance = 6/(1+target.abilityState.charges);
			if (this.randomChance(1, chance)) {
				this.add('-message', `${target.name} defended itself with the Inconspicuous Coin!`);
				return this.chainModify(0.5);
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (!source.abilityState.charges || source.abilityState.charges === 0) return;
			const chance = 5/(1+source.abilityState.charges);
			if (this.randomChance(1, chance) && move.basePower <= 60) {
				this.add('-message', `${source.name} used the Inconspicuous Coin's charge to strengthen ${move.name}'s impact!`);
				return this.chainModify(2);
			}
		},
	},
	// Glint
	slag: {
		name: "Slag",
		spritenum: 34,
		gen: 9,
		desc: "Serves no purpose. Gets slippery sometimes.",
		onTryMove(pokemon, target, move) {
			if (this.randomChance(1, 5)) {
				this.add('-message', `Oops! ${pokemon.name} slipped on the Slag!`);
				this.add('-message', `Why is he carrying slag?`);
				return null;
			}
		},
	},
	// Finger
	mattermirror: {
		name: "Matter Mirror",
		spritenum: 69,
		desc: "This Pokemon's Physical attacks become Special.",
		gen: 9,
		onModifyMove(move, pokemon) {
			if (move.category === 'Physical') {
				move.category = 'Special';
			}
		},
	},
	// Pablo
	sketchbook: {
		name: "Sketchbook",
		spritenum: 200,
		desc: "On switch-in, this Pokemon copies the positive stat changes of the opposing Pokemon.",
		gen: 9,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			const boosts: SparseBoostsTable = {};
			let i: BoostID;
			if (!target.boosts) return;
			for (i in target.boosts) {
				if (target.boosts[i] > 0) boosts[i] = target.boosts[i];
			}
			this.add("-activate", pokemon, "item: Sketchbook");
			this.add('-message', `${pokemon.name} sketched ${target.name}'s stat changes!`);
			this.boost(boosts, pokemon);
		},
	},
	// Trey
	yoichisbow: {
		name: "Yoichi's Bow",
		spritenum: 429,
		onTakeItem: false,
		zMove: "Grand Delta",
		zMoveFrom: "Burst Delta",
		itemUser: ["Decidueye-Hisui"],
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify(1.3);
			}
		},
		desc: "Holder's Flying-type attacks have 1.3x power. If held by Decidueye-Hiseui with Burst Delta, it can use Grand Delta.",
		gen: 9,
	},
	// Aeri
	fleetingwinds: {
		name: "Fleeting Winds",
		onStart(source) {
			this.field.setTerrain('mistyterrain');
		},
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) {
				this.add("-activate", target, "item: Fleeting Winds");
				return target.hp - 1;
				this.actions.useMove('Healing Wish', target);
				target.side.addSideCondition('tailwind', target);
			}
		},
		desc: "On switch-in, starts Misty Terrain. If this Pokemon would faint, starts Tailwind and uses Healing Wish.",
		shortDesc: "Switch-in: Misty Terrain; Faint; Tailwind + Healing Wish.",
		gen: 9,
	},
};
