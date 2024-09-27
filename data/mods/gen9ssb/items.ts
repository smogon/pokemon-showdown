export const Items: {[k: string]: ModdedItemData} = {
	// Morax
	hadeansoil: {
		name: "Hadean Soil",
		gen: 9,
		onStart(pokemon) {
			if (pokemon.itemState.soilActivated) return;
			this.add('-activate', pokemon, 'item: Hadean Soil');
			this.add('-message', `${pokemon.name}'s maximum HP increased!`);
			const newHp = Math.ceil(pokemon.hp * 1.31);
			const newMaxHp = Math.ceil(pokemon.maxhp * 1.31);
			pokemon.hp = newHp;
			pokemon.maxhp = newMaxHp;
			pokemon.baseMaxhp = newMaxHp;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			pokemon.itemState.soilActivated = true;
		},
		onTryHit(pokemon, source, move) {
			if (pokemon !== source && move.type === 'Ground' || move.type === 'Rock') {
				this.add('-activate', pokemon, 'item: Hadean Soil', move.name);
				this.heal(pokemon.maxhp / 16, pokemon, 'item: Hadean Soil');
				return null;
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source !== target && move.category !== 'Status' && move.type === 'Ground' || move.type === 'Rock') {
				if (target.side.sideConditions['stealthrock']) return;
				this.add('-activate', source, 'item: Hadean Soil', move.name);
				target.side.addSideCondition('stealthrock', target);
			}
		},
	},
	// Varnava
	varnaviumz: {
		name: "Varnavium Z",
		gen: 9,
		desc: "If held by Varnava with Core Enforcer, it can use Southern Island's Last Defense, and its moves have -1 priority.",
		shortDesc: "-1 Priority. If held by Varnava with Core Enforcer, it can use Southern Island's Last Defense.",
		onTakeItem: false,
		zMove: "Southern Island's Last Defense",
		zMoveFrom: "Core Enforcer",
		itemUser: ["Zygarde-Complete", "Zygarde-10%", "Zygarde"],
		onModifyMove(move, pokemon) {
			if (pokemon.name === 'Varnava' && pokemon.moves.indexOf('coreenforcer')) move.priority = -1;
		},
	},
	// Aevum
	rewindwatch: {
		name: "Rewind Watch",
		shortDesc: "Grass/Steel; If KOd, fully heals. Single use.",
		desc: "Holder becomes Grass/Steel type. If the holder would be knocked out by an attacking move, survives with at least one HP, then restores back to full health. Cannot be taken or removed. Single use.",
		gen: 9,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Calyrex' && pokemon.setType(['Grass', 'Steel'])) {
				this.add('-start', pokemon, 'typechange', 'Grass/Steel', '[from] item: Rewind Watch');
			}
		},
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect && effect.effectType === 'Move') {
				target.itemState.useWatch = true;
				this.add("-activate", target, "item: Rewind Watch");
				return target.hp - 1;
			}
		},
		onAfterMoveSecondary(target, source, move) {
			if (target.itemState.useWatch) {
				target.useItem();
				this.heal(target.maxhp, target, target, 'item: Rewind Watch');
			}
		},
	},
	// Suika Ibuki
	ibukigourd: {
		name: "Ibuki Gourd",
		spritenum: 697,
		desc: "1.5x Attack and +1/16 HP per turn if held by an Ogerpon, otherwise the user loses 1/8 HP instead; only the first move executed can be selected.",
		fling: {
			basePower: 80,
		},
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock: ' + pokemon.volatiles['choicelock']);
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.id === 'ogerpon') {
				return this.chainModify(1.5);
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.species.id === 'ogerpon') {
				this.heal(pokemon.baseMaxhp / 16);
			} else {
				this.damage(pokemon.baseMaxhp / 8);
			}
		},
		isChoice: true,
		gen: 9,
	},
	// Jack
	hagakure: {
		name: "Hagakure",
		gen: 9,
		onStart(pokemon) {
			if (pokemon.hp === pokemon.maxhp) {
				if (!pokemon.abilityState.hagakure) {
					this.add('-anim', pokemon, 'Mist', pokemon);
					this.add('-message', `${pokemon.name}'s Hagakure activated!`);
				}
				pokemon.abilityState.hagakure = true;
			} else {
				pokemon.abilityState.hagakure = false;
			}
		},
		onUpdate(pokemon) {
			if (pokemon.hp === pokemon.maxhp) {
				if (!pokemon.abilityState.hagakure) {
					this.add('-anim', pokemon, 'Mist', pokemon);
					this.add('-message', `${pokemon.name}'s Hagakure activated!`);
				}
				pokemon.abilityState.hagakure = true;
			} else {
				if (pokemon.abilityState.hagakure) {
					this.add('-message', `${pokemon.name}'s Hagakure vanished!`);
				}
				pokemon.abilityState.hagakure = false;
			}
		},
		onModifyAtk(atk, pokemon) {
			if (pokemon.abilityState.hagakure) return this.chainModify(2);
		},
		onModifyDef(def, pokemon) {
			if (pokemon.abilityState.hagakure) return this.chainModify(0.5);
		},
		onModifySpd(spd, pokemon) {
			if (pokemon.abilityState.hagakure) return this.chainModify(0.5);
		},
		onModifyCritRatio(critRatio, user) {
			if (user.abilityState.hagakure) return critRatio + 5;
		},
	},
	// Journeyman
	colossuscarrier: {
		name: "Colossus Carrier",
		gen: 9,
		onTakeItem: false,
		shortDesc: "User can hold 8 items; New item each turn.",
		desc: "The holder can hold up to eight additional items, other than Colossus Carrier, that are unaffected by Knock Off or other means of being taken, disabled, or removed. Colossus Carrier itself also cannot be taken, disabled, or removed. At the end of each turn, the holder picks up a random item that it isn't already holding.",
		onResidual(pokemon) {
			if (!pokemon.abilityState.carrierItems) pokemon.abilityState.carrierItems = [];
			const items = this.dex.items.all().filter(item => (
				pokemon.item !== item &&
				!pokemon.abilityState.carrierItems.includes(item) &&
				!item.name.includes('TR') && !item.itemUser &&
				!item.name.includes('Power') && !item.isPokeball &&
				!item.megaStone && !item.unusable
			));
			const item = this.sample(items);
			if (pokemon.abilityState.carrierItems.length < 8 && pokemon.item === 'colossuscarrier') {
				pokemon.abilityState.carrierItems.push(item);
				this.add('-anim', pokemon, 'Splash', pokemon);
				this.add('-message', `${pokemon.name} found one ${item.name}!`);
			} else if (pokemon.abilityState.carrierItems.length >= 8 || !pokemon.item || pokemon.item !== 'colossuscarrier') {
				this.add('-anim', pokemon, 'Celebrate', pokemon);
				this.add('-message', `${pokemon.name} found one ${item.name}, but has no more capacity for items!`);
			}
		},
		// Ability to carry multiple items handled in ../config/formats.ts
	},
	// Codie
	evileyeoformsbygore: {
		name: "Evil Eye of Orms-by-Gore",
		gen: 9,
		desc: "On switch-in, lowers the Attack of all active Pokemon by 1 stage, and restores HP equal to 50% of the total Attack lost. If holder is a Venomicon, turns Mind Reader into a 60 BP special move while retaining its secondary effects.",
		shortDesc: "Switch-in: Heals, all Pokemon -1ATK; Mind Reader: 60BP.",
		onSwitchIn(pokemon) {
			let health = 0;
			this.add('-anim', pokemon, 'Mean Look', pokemon);
			for (const activePokemon of this.getAllActive()) {
				health += activePokemon.storedStats.atk - (activePokemon.storedStats.atk * 0.67);
				this.boost({atk: -1}, activePokemon);
			}
			this.heal(health, pokemon);
		},
		onModifyMovePriority: 1,
		onModifyMove(move, pokemon) {
			if (move.id === 'mindreader' && pokemon.species.name === 'Venomicon') {
				move.category = 'Special';
				move.basePower = 60;
			}
		},
	},
	// Sakuya Izayoi
	stopwatch: {
		name: "Stopwatch",
		onTakeItem: false,
		zMove: "Misdirection",
		zMoveFrom: "Killing Doll",
		itemUser: ["Magearna"],
		desc: "If held by a Magearna with Killing Doll, it can use Misdirection.",
		gen: 9,
	},
	// Zeeb
	slingshot: {
		name: "Slingshot",
		gen: 9,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[0];
			const move = this.dex.getActiveMove('slingshot');
			const dmg = this.actions.getDamage(pokemon, target, move);
			const hits = this.random(2, 3);
			for (let i = 0; i < hits; i++) {
				if (this.randomChance(1, 10)) {
					this.add('-anim', pokemon, 'Bullet Seed', pokemon);
					this.add('-anim', pokemon, 'Wake-Up Slap', pokemon);
					this.add('-message', `${pokemon.name}! Turn the Slingshot the other way!`);
					this.damage(dmg, pokemon, pokemon);
					continue;
				}
				this.add('-anim', pokemon, 'Bullet Seed', target);
				this.damage(dmg, target, pokemon);
				if (this.randomChance(1, 10)) target.addVolatile('flinch');
			}
			this.add('-message', `${target.name} was pelted by ${pokemon.name}'s Slingshot!`);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source === target || move.category === 'Status') return;
			const base = this.dex.getActiveMove('populationbomb');
			const dmg = this.actions.getDamage(source, target, base);
			const hits = this.random(2, 3);
			for (let i = 0; i < hits; i++) {
				this.add('-anim', source, 'Bullet Seed', target);
				this.damage(dmg, target, source);
				if (this.randomChance(1, 10)) target.addVolatile('flinch');
			}
			this.add('-message', `${target.name} was pelted by ${source.name}'s Slingshot!`);
		},
	},
	// Shifu Robot
	absorptiveshell: {
		name: "Absorptive Shell",
		gen: 9,
		onSwitchIn(pokemon) {
			pokemon.abilityState.newType = '';
			pokemon.abilityState.forcefield = false;
			pokemon.abilityState.forcefieldHp = 0;
			if (pokemon.hp <= pokemon.maxhp / 2) {
				this.add('-anim', pokemon, 'Aqua Ring', pokemon);
				this.add('-message', `${pokemon.name} created a forcefield!`);
				pokemon.abilityState.forcefield = true;
				pokemon.abilityState.forcefieldHp = pokemon.maxhp / 3;
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect?.effectType !== 'Move' || source === target) return;
			if (target.abilityState.forcefield && target.abilityState.forcefieldHp > 0) {
				this.add('-anim', target, 'Aqua Ring', target);
				if (target.abilityState.forcefieldHp >= damage) {
					target.abilityState.forcefieldHp -= damage;
					if (target.abilityState.forcefieldHp <= 0) {
						target.abilityState.forcefield = false;
						target.abilityState.forcefieldHp = 0;
						this.add('-anim', target, 'Cosmic Power', target);
						this.add('-message', `${target.name}'s forcefield shattered!`);
					}
					return 0;
				}
				if (damage > target.abilityState.forcefieldHp) {
					let bleed = damage - target.abilityState.forcefieldHp;
					target.abilityState.forcefield = false;
					target.abilityState.forcefieldHp = 0;
					this.add('-anim', target, 'Cosmic Power', target);
					this.add('-message', `${target.name}'s forcefield shattered!`);
					return bleed;
				}
			}
		},
		onResidual(pokemon) {
			let types = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Water'];
			let newType = this.sample(types);
			pokemon.abilityState.newType = newType;
			pokemon.setType([newType, 'Steel']);
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[from] item: Absorptive Shell');
		},
		onModifyMove(move, pokemon) {
			if (move.id !== 'technoblast') return;
			if (pokemon.abilityState.newType) {
				move.type = pokemon.abilityState.newType;
				this.add('-message', `${pokemon.getItem().name} changed ${move.name} to ${pokemon.abilityState.newType}-type!`);
			} else {
				move.type = 'Steel';
				this.add('-message', `${pokemon.getItem().name} changed ${move.name} to Steel-type!`);
			}
		},
	},
	// PokeKart
	flameflyer: {
		name: "Flame Flyer",
		gen: 9,
		onStart(pokemon) {
			if (pokemon.setType(['Steel', 'Fire'])) this.add('-start', pokemon, 'typechange', 'Steel/Fire', '[from] item: Flame Flyer');
		},
		onModifySpePriority: 1,
		onModifySpe(spe, pokemon) {
			return this.chainModify(1.1);
		},
		onModifyMove(move, pokemon) {
			move.overrideOffensiveStat = 'spe';
		},
	},
	// Luminous
	spectralprism: {
		name: "Spectral Prism",
		gen: 9,
		onTakeItem: false,
		zMove: "Polaris",
		zMoveFrom: "Rainbow Maxifier",
		itemUser: ["Necrozma"],
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' && effect.id !== 'recoil') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onModifySpdPriority: 6,
		onModifySpd(spd, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
	},
	// Fblthp
	bubblewand: {
		name: 'Bubble Wand',
		gen: 9,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			this.add('-anim', pokemon, 'Bubble', target);
			this.add('-anim', target, 'Aqua Ring', target);
			target.addVolatile('bubblewand');
			this.add('-message', `${target.name} was caught in a bubble by ${pokemon.name}'s Bubble Wand!`);
			if (this.randomChance(1, 2)) {
				this.add('-anim', pokemon, 'Aqua Ring', pokemon);
				this.add('-message', `Oh no! ${pokemon.name} trapped themselves in a bubble!`);
				pokemon.addVolatile('bubblewand');
			}
		},
		condition: {
			duration: 4,
			onModifyDamage(damage, source, target, move) {
				if (!move) return;
				if (source.hasType('Water')) {
					return this.chainModify (1.25);
				} else {
					return this.chainModify(0.75);
				}
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.hasType('Water')) {
					return this.chainModify (1.25);
				} else {
					return this.chainModify(0.75);
				}
			},
			onResidual(pokemon) {
				this.add('-anim', pokemon, 'Aqua Ring', pokemon);
				this.add('-message', `${pokemon.name} is encased in the bubble!`);
			},
		},
	},
	// Faust
	crossroadsblues: {
		name: 'Crossroads Blues',
		gen: 9,
		onTakeItem: false,
		zMove: "The House Always Wins",
		zMoveFrom: "Faustian Bargain",
		itemUser: ["Hoopa-Unbound"],
		onAnyFaint() {
			let totalFaintedFoes = 0;
			const pokemon = this.effectState.target;
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			const faintedFoes = target.side.pokemon.filter(foe => foe.fainted);
			if (faintedFoes.length) totalFaintedFoes = faintedFoes.length;
			const totalHeal = ((pokemon.baseMaxhp / 8) + ((pokemon.baseMaxhp / 8) * totalFaintedFoes));
			this.add('-activate', pokemon, 'item: Crossroads Blues');
			this.heal(totalHeal, pokemon);
		},
	},
	// Croupier
	staufensdie: {
		name: 'Staufen\'s Die',
		gen: 9,
		onStart(pokemon) {
			if (!pokemon.abilityState.wagerStacks) pokemon.abilityState.wagerStacks = 0;
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.add("-activate", source, "item: Staufen's Die");
				this.addMove('-anim', source, 'Pay Day', source);
				this.add('-message', `Critical hit! ${source.name} scored six wager stacks!`);
				if (!source.abilityState.wagerStacks) source.abilityState.wagerStacks = 0;
				source.abilityState.wagerStacks += 6;
				return;
			}
		},
		onResidual(pokemon) {
			if (pokemon.abilityState.wagerStacks >= 6) {
				pokemon.abilityState.wagerStacks -= 6;
				this.add("-activate", pokemon, "item: Staufen's Die");
				this.add('-message', `${pokemon.name} wagered six stacks to Roll the Dice!`);
				this.actions.useMove('Roll the Dice', pokemon);
			}
		},
		onModifyCritRatio(critRatio, user) {
			if (user.abilityState.luckySix) return critRatio + 5;
		},
		onTakeItem: false,
		zMove: "All In",
		zMoveFrom: "Roll the Dice",
		itemUser: ["Hoopa"],
	},
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
		onModifyAccuracy(accuracy, pokemon) {
			if (typeof accuracy !== 'number') return;
			if (pokemon.species.name === 'Pikachu-Libre') return this.chainModify([3277, 4096]);
		},
		onUpdate(pokemon) {
			if (pokemon.species.name === 'Pikachu') {
				this.add('-activate', pokemon, 'item: Silly Costume');
				pokemon.formeChange('Pikachu-Libre');
				this.add('-message', `${pokemon.name} put on their Silly Costume!`);
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
			this.add('-activate', target, 'item: Malediction', target);
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
				if (target.hp) this.damage(dmg, target, pokemon);
				pokemon.faint(pokemon);
			}
		},
		shortDesc: "See '/ssb Prince Smurf' for more!",
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
	napalmresonator: {
		name: "Napalm Resonator",
		onTakeItem: false,
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && move.basePower >= 100) {
				this.add('-anim', target, 'Self-Destruct', target);
				this.damage(target.baseMaxhp / 3, target, target);
				this.damage(source.baseMaxhp / 3, source, source);
				this.add('-message', `${target.name}'s Napalm Resonator exploded!`);
				this.field.setWeather('rainoffire');
				this.add('-enditem', target, target.getItem(), '[from] item: Napalm Resonator');
				target.setItem('');
			}
		},
		zMove: "Blasphemous Act",
		zMoveFrom: "Terrorize the Peaks",
		itemUser: ["Smokomodo"],
		shortDesc: "If held by a Smokomodo with Terorrize the Peaks, it can use Blasphemous Act.",
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
		desc: "On switch-in, this Pokemon copies the positive stat changes of the opposing Pokemon, and receives a random positive volatile effect at the end of each full turn on the field.",
		shortDesc: "Switch-in: Copies boosts; Random volatile each turn.",
		gen: 9,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			const boosts: SparseBoostsTable = {};
			let i: BoostID;
			let boosted = false;
			if (!target.boosts) return;
			for (i in target.boosts) {
				if (target.boosts[i] > 0) {
					boosts[i] = target.boosts[i];
					boosted = true;
				}
			}
			if (boosted) {
				this.add("-activate", pokemon, "item: Sketchbook");
				this.boost(boosts, pokemon);
				this.add('-message', `${pokemon.name} copied ${target.name}'s stat changes!`);
			}
		},
		onResidual(pokemon) {
			let effectPool = ['aquaring', 'focusenergy', 'helpinghand', 'ingrain', 'laserfocus', 'magnetrise', 'substitute', 'stockpile', 'charge', 'destinybond', 'dragoncheer', 'lockon'];
			let randomEffect = this.sample(effectPool);
			if (!pokemon.volatiles[randomEffect]) pokemon.addVolatile(randomEffect);
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
				this.actions.useMove('Healing Wish', target);
				target.side.addSideCondition('tailwind', target);
				target.abilityState.faintOnUpdate = true;
				return target.hp - 1;
			}
		},
		onUpdate(pokemon) {
			if (pokemon.abilityState.faintOnUpdate) {
				pokemon.abilityState.faintOnUpdate = false;
				pokemon.faint();
			}
		},
		desc: "On switch-in, starts Misty Terrain. If this Pokemon would faint, starts Tailwind and uses Healing Wish.",
		shortDesc: "Switch-in: Misty Terrain; Faint; Tailwind + Healing Wish.",
		gen: 9,
	},
};
