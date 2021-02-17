export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	gravitation: {
		shortDesc: "On switch-in, this Pokémon summons Gravity.",
		onStart(source) {
			this.field.addPseudoWeather('gravity');
		},
		name: "Gravitation",
		rating: 4,
		num: -1001,
	},
	ignite: {
		desc: "This Pokémon's Normal-type moves become Fire-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokémon's Normal-type moves become Fire-type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fire';
				(move as any).igniteBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if ((move as any).igniteBoosted) return this.chainModify([4915, 4096]);
		},
		name: "Ignite",
		rating: 4,
		num: -1002,
	},
	downtoearth: {
		shortDesc: "While this Pokémon is active, the effects of terrains are disabled.",
		onStart(source) {
			if (this.field.terrain) {
				this.add('-ability', source, 'Down-to-Earth');
				this.add('-message', `${source.name} suppresses the effects of the terrain!`);
			}
		},
		onAnyTerrainStart(target, source, terrain) {
			const pokemon = this.effectData.target;
			this.add('-ability', pokemon, 'Down-to-Earth');
			this.add('-message', `${pokemon.name} suppresses the effects of the terrain!`);
		},
		onEnd(source) {
			if (this.field.terrain) {
				this.add('-message', `${source.name} is no longer suppressing the effects of the terrain!`);
			}
			source.abilityData.ending = true;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasAbility('mimicry')) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('downtoearth') && target !== source) {
							this.debug('Down-to-Earth prevents type change');
							return;
						}
					}
					if (this.field.terrain) {
						pokemon.addVolatile('mimicry');
					} else {
						const types = pokemon.baseSpecies.types;
						if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
						this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
						this.hint("Transform Mimicry changes you to your original un-transformed types.");
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('electricseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('psychicseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('grassyseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('mistyseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
			for (const pokemon of this.getAllActive()) {
				if (pokemon.hasItem('acidicseed')) {
					if (!pokemon.ignoringItem() && this.field.isTerrain('acidicterrain')) {
						for (const target of this.getAllActive()) {
							if (target.hasAbility('downtoearth')) {
								if (target === source) continue;
								this.debug('Down-to-Earth prevents Seed use');
								return;
							}
						}
						pokemon.useItem();
					}
				}
			}
		},
		name: "Down-to-Earth",
		rating: 2,
		num: -1003,
	},
	grasspelt: {
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.",
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents Defense increase');
					return;
				}
			}
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	mimicry: {
		shortDesc: "This Pokemon's type changes to match the Terrain. Type reverts when Terrain ends.",
		onStart(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents type change');
					return;
				}
			}
			if (this.field.terrain) {
				pokemon.addVolatile('mimicry');
			} else {
				const types = pokemon.baseSpecies.types;
				if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				this.hint("Transform Mimicry changes you to your original un-transformed types.");
			}
		},
		onAnyTerrainStart() {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents type change');
					return;
				}
			}
			const pokemon = this.effectData.target;
			delete pokemon.volatiles['mimicry'];
			pokemon.addVolatile('mimicry');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['mimicry'];
		},
		condition: {
			onStart(pokemon) {
				let newType;
				switch (this.field.terrain) {
				case 'electricterrain':
					newType = 'Electric';
					break;
				case 'grassyterrain':
					newType = 'Grass';
					break;
				case 'mistyterrain':
					newType = 'Fairy';
					break;
				case 'psychicterrain':
					newType = 'Psychic';
					break;
				case 'acidicterrain':
					newType = 'Poison';
					break;
				}
				if (!newType || pokemon.getTypes().join() === newType || !pokemon.setType(newType)) return;
				this.add('-start', pokemon, 'typechange', newType, '[from] ability: Mimicry');
			},
			onUpdate(pokemon) {
				for (const target of this.getAllActive()) {
					if (target.hasAbility('downtoearth')) {
						this.debug('Down-to-Earth prevents type change');
						const types = pokemon.species.types;
						if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
						this.add('-activate', pokemon, 'ability: Mimicry');
						this.add('-end', pokemon, 'typechange', '[silent]');
						pokemon.removeVolatile('mimicry');
					}
				}
				if (!this.field.terrain) {
					const types = pokemon.species.types;
					if (pokemon.getTypes().join() === types.join() || !pokemon.setType(types)) return;
					this.add('-activate', pokemon, 'ability: Mimicry');
					this.add('-end', pokemon, 'typechange', '[silent]');
					pokemon.removeVolatile('mimicry');
				}
			},
		},
		name: "Mimicry",
		rating: 0.5,
		num: 250,
	},
	surgesurfer: {
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is doubled.",
		onModifySpe(spe) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('downtoearth')) {
					this.debug('Down-to-Earth prevents Speed increase');
					return;
				}
			}
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		name: "Surge Surfer",
		rating: 2.5,
		num: 207,
	},
	arenarock: {
		desc: "On switch-in, the field becomes Grassy Terrain. This terrain remains in effect until this Ability is no longer active for any Pokémon.",
		shortDesc: "On switch-in, Grassy Terrain begins until this Ability is not active in battle.",
		onStart(source) {
			this.field.clearTerrain();
			this.field.setTerrain('grassyterrain');
		},
		onAnyTerrainStart(target, source, terrain) {
			if (!source.hasAbility('arenarock')) {
				this.field.setTerrain('grassyterrain');
			}
		},
		onEnd(pokemon) {
			if (this.field.terrainData.source !== pokemon || !this.field.isTerrain('grassyterrain')) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('arenarock')) {
					this.field.terrainData.source = target;
					return;
				}
			}
			this.field.clearTerrain();
		},
		name: "Arena Rock",
		rating: 4.5,
		num: -1004,
	},
	sharpstriker: {
		desc: "This Pokémon's ballistic moves have their power multiplied by 1.5. Ballistic moves include Bullet Seed, Octazooka, Barrage, Rock Wrecker, Zap Cannon, Acid Spray, Aura Sphere, Focus Blast, and all moves with Ball or Bomb in their name.",
		shortDesc: "This Pokémon's ballistic moves have 1.5x power (Shadow Ball, Sludge Bomb, Focus Blast, etc).",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bullet']) {
				return this.chainModify(1.5);
			}
		},
		name: "Sharp Striker",
		rating: 3,
		num: -1005,
	},
	coldsweat: {
		desc: "On switch-in, this Pokémon summons hail. It changes the current weather to rain whenever any opposing Pokémon has an attack that is super effective on this Pokémon or an OHKO move. Counter, Metal Burst, and Mirror Coat count as attacking moves of their respective types, Hidden Power counts as its determined type, and Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "Summons hail on switch-in. Changes weather to rain if the foe has a supereffective or OHKO move.",
		onStart(source) {
			this.field.setWeather('hail');
			for (const target of source.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, source) && this.dex.getEffectiveness(moveType, source) > 0 ||
						move.ohko
					) {
						this.field.setWeather('raindance');
						return;
					}
				}
			}
		},
		onAnySwitchIn(pokemon) {
			const source = this.effectData.target;
			if (pokemon === source) return;
			for (const target of source.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, source) && this.dex.getEffectiveness(moveType, source) > 0 ||
						move.ohko
					) {
						this.field.setWeather('raindance', source);
						return;
					}
				}
			}
		},
		name: "Cold Sweat",
		rating: 4,
		num: -1006,
	},
	trashcompactor: {
		desc: "This Pokémon is immune to all entry hazards. If it lands on any type of entry hazard, it clears the hazard and Stockpiles 1.",
		shortDesc: "Hazard immunity. Clears hazards, Stockpiles 1 if switched in on them.",
		onAfterMega(pokemon) {
			let activated = false;
			for (const sideCondition of ['gmaxsteelsurge', 'spikes', 'stealthrock', 'stickyweb', 'toxicspikes']) {
				if (pokemon.side.getSideCondition(sideCondition) && !this.field.getPseudoWeather('stickyresidues')) {
					if (!activated) {
						this.add('-activate', pokemon, 'ability: Trash Compactor');
						activated = true;
						this.useMove('stockpile', pokemon);
					}
					pokemon.side.removeSideCondition(sideCondition);
					this.add('-sideend', pokemon.side, this.dex.getEffect(sideCondition).name, '[from] Ability: Trash Compactor', '[of] ' + pokemon);
				}
			}
		},
		name: "Trash Compactor",
		rating: 5,
		num: -1007,
	},
	tempestuous: {
		desc: "When replacing a fainted party member, this Pokémon's Special Defense is boosted, and it charges power to double the power of its Electric-type move on its first turn.",
		shortDesc: "Gains the effect of Charge when replacing a fainted ally.",
		onAfterMega(pokemon) {
			if (!pokemon.side.faintedLastTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		onStart(pokemon) {
			if (!pokemon.side.faintedThisTurn) return;
			this.boost({spd: 1}, pokemon);
			this.add('-activate', pokemon, 'move: Charge');
			pokemon.addVolatile('charge');
		},
		name: "Tempestuous",
		rating: 3,
		num: -1008,
	},
	sootguard: {
		shortDesc: "This Pokémon receives 3/4 damage from neutrally effective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod === 0) {
				this.debug('Soot Guard neutralize');
				return this.chainModify(0.75);
			}
		},
		name: "Soot Guard",
		rating: 3,
		num: -1009,
	},
	dustscatter: {
		shortDesc: "This Pokémon bypasses immunuties to its spore and powder moves.",
		onModifyMove(move) {
			delete move.flags['powder'];
		},
		name: "Dust Scatter",
		rating: 2,
		num: -1010,
	},
	counterclockwisespiral: {
		desc: "On switch-in, the field becomes Trick Room. This room remains in effect until this Ability is no longer active for any Pokémon.",
		shortDesc: "On switch-in, Trick Room begins until this Ability is not active in battle.",
		onStart(source) {
			this.field.removePseudoWeather('trickroom');
			this.field.addPseudoWeather('trickroom');
		},
		onAnyTryMove(target, source, effect) {
			if (['trickroom'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectData.target, 'ability: Counter-Clockwise Spiral', effect, '[of] ' + target);
				return false;
			}
		},
		onEnd(pokemon) {
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('counterclockwisespiral')) {
					return;
				}
			}
			this.field.removePseudoWeather('trickroom');
		},
		name: "Counter-Clockwise Spiral",
		rating: 4.5,
		num: -1011,
	},
	nightmareheart: {
		desc: "When this Pokémon faints, the Pokémon that knocked it out is cursed, losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. In addition, the Pokémon that knocked it out permanently receives this Ability, which persists even through switching, until it is knocked out and the Ability is passed along again.",
		shortDesc: "If this Pokémon is KOed, the attacker is cursed, then permanently receives this Ability.",
		onFaint(target, source, effect) {
			if (!source || !effect || target.side === source.side) return;
			if (effect.effectType === 'Move' && !effect.isFutureMove) {
				this.add('-ability', target, 'Nightmare Heart');
				source.addVolatile('curse');
				const bannedAbilities = [
					'battlebond', 'comatose', 'disguise', 'insomnia', 'multitype', 'powerconstruct', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'truant', 'zenmode',
				];
				if (bannedAbilities.includes(source.ability)) {
					return;
				} else {
					source.setAbility('nightmareheart');
					source.baseAbility = 'nightmareheart' as ID;
					source.ability = 'nightmareheart' as ID;
					this.add('-ability', source, 'Nightmare Heart', '[from] Ability: Nightmare Heart');
				}
			}
		},
		name: "Nightmare Heart",
		rating: 3,
		num: -1012,
	},
	executioner: {
		desc: "When this Pokémon's target has 1/2 or less of its maximum HP, rounded down, its attacking stat is multiplied by 1.5 while using an attack.",
		shortDesc: "This Pokémon's attacking stat is 1.5x when its target has 1/2 or less HP.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (defender.hp <= defender.maxhp / 2) {
				this.debug('Executioner boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (defender.hp <= defender.maxhp / 2) {
				this.debug('Executioner boost');
				return this.chainModify(1.5);
			}
		},
		name: "Executioner",
		rating: 4,
		num: -1013,
	},
	solarcore: {
		shortDesc: "During intense sunlight, this Pokémon can skip the charging turn of its moves.",
		onChargeMove(pokemon, target, move) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Solar Core - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		name: "Solar Core",
		rating: 2,
		num: -1014,
	},
	twominded: {
		desc: "When this Pokémon's Attack is modified, its Special Attack is modified in the opposite way, and vice versa. The same is true for its Defense and Special Defense.",
		shortDesc: "Applies the opposite of every stat change to the opposite stat (Attack to Special Attack, Defense to Special Defense).",
		onAfterBoost(boost, target, source, effect) {
			if (!boost || effect.id === 'twominded') return;
			let activated = false;
			const twoMindedBoost: SparseBoostsTable = {};
			if (boost.spa) {
				twoMindedBoost.atk = -1 * boost.spa;
				activated = true;
			}
			if (boost.spd) {
				twoMindedBoost.def = -1 * boost.spd;
				activated = true;
			}
			if (boost.atk) {
				twoMindedBoost.spa = -1 * boost.atk;
				activated = true;
			}
			if (boost.def) {
				twoMindedBoost.spd = -1 * boost.def;
				activated = true;
			}
			if (activated === true) {
				this.add('-ability', target, 'Two-Minded');
				this.boost(twoMindedBoost, target, target, null, true);
			}
		},
		name: "Two-Minded",
		rating: 4,
		num: -1015,
	},
	adrenaline: {
		desc: "This Pokémon's next move is guaranteed to be a critical hit after it attacks and knocks out another Pokémon.",
		shortDesc: "This Pokémon's next move is guaranteed to be a critical hit after it attacks and KOs another Pokémon.",
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				source.addVolatile('laserfocus');
			}
		},
		name: "Adrenaline",
		rating: 3,
		num: -1016,
	},
	ambush: {
		shortDesc: "This Pokémon's attacks are critical hits if the user moves before the target.",
		onModifyCritRatio(critRatio, source, target) {
			if (target.newlySwitched || this.queue.willMove(target)) return 5;
		},
		name: "Ambush",
		rating: 4,
		num: -1017,
	},
	secondwind: {
		desc: "While this Pokémon has more than 1/2 of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokémon has more than 1/2 of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp > pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		name: "Second Wind",
		rating: -1,
		num: -1018,
	},
	birdofprey: {
		desc: "Prevents adjacent opposing Flying-type Pokémon from choosing to switch out unless they are immune to trapping.",
		shortDesc: "Prevents adjacent Flying-type foes from choosing to switch.",
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Flying') && this.isAdjacent(pokemon, this.effectData.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectData.target;
			if (!source || !this.isAdjacent(pokemon, source)) return;
			if (!pokemon.knownType || pokemon.hasType('Flying')) {
				pokemon.maybeTrapped = true;
			}
		},
		name: "Bird of Prey",
		rating: 4.5,
		num: -1019,
	},
	showdown: {
		desc: "While this Pokémon is present, all Pokémon are prevented from restoring any HP. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. Regenerator is also suppressed.",
		shortDesc: "While present, all Pokémon are prevented from healing and Regenerator is suppressed.",
		onStart(source) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (!activated) {
					this.add('-ability', source, 'Showdown');
				}
				activated = true;
				if (!pokemon.volatiles['healblock']) {
					pokemon.addVolatile('healblock');
				}
			}
		},
		onAnySwitchIn(pokemon) {
			if (!pokemon.volatiles['healblock']) {
				pokemon.addVolatile('healblock');
			}
		},
		onEnd(pokemon) {
			for (const target of this.getAllActive()) {
				target.removeVolatile('healblock');
			}
		},
		name: "Showdown",
		rating: 3.5,
		num: -1020,
	},
	regenerator: {
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
		onSwitchOut(pokemon) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('showdown')) {
					return;
				}
			}
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	hardworker: {
		shortDesc: "This Pokémon's HM moves have 1.5x power.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (['cut', 'fly', 'surf', 'strength', 'whirlpool', 'waterfall', 'rocksmash', 'dive', 'rockclimb'].includes(move.id)) {
				this.debug('Hard Worker boost');
				return this.chainModify([1.5]);
			}
		},
		name: "Hard Worker",
		rating: 3,
		num: -1021,
	},
	alchemist: {
		desc: "After attacking a poisoned target with a Poison-type move, this Pokémon has an equal chance to cause one of various random effects. Possible effects include: replacing the poison status with paralysis, burn or toxic poison; afflicting the target with confusion, Torment or Encore; choosing two random stats and either boosting or lowering each one; causing the target to use Explosion if its current HP is 25% or less or afflicting it with a Curse if not; or transforming the target into Seismitoad, Ariados or Butterfree until it switches out.",
		shortDesc: "Poison-type move on poisoned target: random chance of 11 different effects.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && target.hp && move.type === 'Poison' && ['psn', 'tox'].includes(target.status)) {
				const r = this.random(11);
				if (r < 1) {
					target.setStatus('par', source);
				} else if (r < 2) {
					target.setStatus('brn', source);
				} else if (r < 3) {
					if (target.status === 'psn') {
						this.add('-message', `${target.name}'s poison became more severe!`);
						target.setStatus('tox', source);
					}
				} else if (r < 4) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('confusion')) {
						this.add('-message', `${target.name} could not be confused!`);
					}
				} else if (r < 5) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('encore')) {
						this.add('-message', `${target.name} could not be affected by Encore!`);
					}
				} else if (r < 6) {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('torment')) {
						this.add('-message', `${target.name} could not be affected by Torment!`);
					}
				} else if (r < 7) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 8) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = -1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = -1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = -1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = -1;
					} else {
						alchemistBoost.spe = -1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 9) {
					this.add('-ability', source, 'Alchemist');
					const randStat1 = this.random(5);
					let randStat2 = this.random(4);
					if (randStat2 === randStat1) {
						randStat2 = 4;
					}
					const alchemistBoost: SparseBoostsTable = {};
					if (randStat1 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat1 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat1 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat1 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					if (randStat2 < 1) {
						alchemistBoost.atk = 1;
					} else if (randStat2 < 2) {
						alchemistBoost.def = 1;
					} else if (randStat2 < 3) {
						alchemistBoost.spa = 1;
					} else if (randStat2 < 4) {
						alchemistBoost.spd = 1;
					} else {
						alchemistBoost.spe = 1;
					}
					this.boost(alchemistBoost, target, source, null, true);
				} else if (r < 10) {
					this.add('-ability', source, 'Alchemist');
					if (target.hp >= target.maxhp / 4) {
						if (!target.addVolatile('curse')) {
							this.add('-message', `${target.name} could not be cursed!`);
						}
					} else {
						this.add('-message', `${target.name} suddenly exploded!`);
						this.useMove('explosion', target, source, this.dex.getAbility('alchemist'));
					}
				} else {
					this.add('-ability', source, 'Alchemist');
					if (!target.addVolatile('alchemist')) {
						this.add('-message', `${target.name} has already transformed!`);
					}
				}
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-message', `${pokemon.name} is being transformed...!?`);
				const randForm = this.random(3);
				if (randForm < 1) {
					this.add('-message', `It became a Seismitoad!`);
					pokemon.formeChange('Seismitoad');
					pokemon.setAbility('poisontouch');
				} else if (randForm < 2) {
					this.add('-message', `It became an Ariados!`);
					pokemon.formeChange('Ariados');
					pokemon.setAbility('insomnia');
				} else {
					this.add('-message', `It became a Butterfree!`);
					pokemon.formeChange('Butterfree');
					pokemon.setAbility('compoundeyes');
				}
			},
			onEnd(pokemon) {
				if (['Seismitoad', 'Ariados', 'Butterfree'].includes(pokemon.species.forme)) {
					pokemon.formeChange(pokemon.species.battleOnly as string);
				}
			},
		},
		name: "Alchemist",
		rating: 3,
		num: -1022,
	},
	blackmail: {
		desc: "After using a physical Dark-type move, this Pokémon permanently replaces its target's Ability with Orderly Target. The Pokémon with Orderly Target cannot knock out Mega Honchkrow - all of its moves will leave Mega Honchkrow with at least 1 HP. Blackmail is permanently replaced with Keen Eye after activating, so it can only affect one target per battle.",
		shortDesc: "Physical Dark moves: permanently replace target's Ability, preventing it from KOing this Pokémon. Permanently becomes Keen Eye after activating once.",
		onSourceHit(target, source, move) {
			if (!move || !target || target.side === source.side || !target.hp) return;
			if (target !== source && move.type === 'Dark' && move.category === 'Physical') {
				target.setAbility('orderlytarget');
				target.baseAbility = 'orderlytarget' as ID;
				target.ability = 'orderlytarget' as ID;
				this.add('-ability', target, 'Orderly Target', '[from] Ability: Blackmail');
				source.setAbility('keeneye');
				source.baseAbility = 'keeneye' as ID;
				source.ability = 'keeneye' as ID;
				this.add('-ability', source, 'Keen Eye', '[from] Ability: Blackmail');
			}
		},
		name: "Blackmail",
		rating: 3,
		num: -1023,
	},
	orderlytarget: {
		desc: "If the target of this Pokémon's move is Mega Honchkrow, it survives every hit with at least 1 HP.",
		shortDesc: "If this Pokémon's target is Mega Honchkrow, it survives every hit with at least 1 HP.",
		onDamagePriority: -100,
		onAnyDamage(damage, target, source, effect) {
			if (source === this.effectData.target && target.species.id === 'honchkrowmega' &&
				damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', source, 'Orderly Target');
				return target.hp - 1;
			}
		},
		name: "Orderly Target",
		rating: -1,
		num: -1024,
	},
	disguise: {
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		shortDesc: "(Mimikyu only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['authentic'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectData.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.getSpecies(speciesid));
			}
			if (pokemon.canMegaEvo && this.effectData.busted) {
				pokemon.canMegaEvo = 'mimikyubustedmega';
			}
		},
		name: "Disguise",
		rating: 4,
		num: 209,
	},
	spectralanger: {
		shortDesc: "This Pokémon's Attack rises after it uses an attack that is super effective on the target.",
		onSourceHit(target, source, move) {
			if (!move || !target) return;
			if (target !== source && move.category !== 'Status' && target.getMoveHitData(move).typeMod > 0) {
				this.boost({atk: 1}, source);
			}
		},
		name: "Spectral Anger",
		rating: 3,
		num: -1026,
	},
	diamonddust: {
		desc: "On switch-in, this Pokémon summons Diamond Dust for 5 turns. During the effect, Pokémon are immune to all Rock-type attacks and Stealth Rock; Weather Ball becomes an Ice-type move, and its base power is 100; and other weather-related moves and Abilities behave as they do in Hail.",
		shortDesc: "5 turns: all Pokémon are immune to Rock; counts as hail.",
		onStart(source) {
			this.field.setWeather('diamonddust');
		},
		name: "Diamond Dust",
		rating: 3,
		num: -1027,
	},
	forecast: {
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'diamonddust':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');
			}
		},
		name: "Forecast",
		rating: 2,
		num: 59,
	},
	icebody: {
		desc: "If Hail or Diamond Dust is active, this Pokémon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokémon takes no damage from Hail.",
		shortDesc: "If Hail or Diamond Dust is active, heals 1/16 of its max HP each turn; immunity to Hail.",
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	iceface: {
		desc: "If this Pokémon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail or Diamond Dust begins or when Eiscue switches in while Hail or Diamond Dust is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, the first physical hit it takes deals 0 damage. Effect restored in Hail, Diamond Dust.",
		onStart(pokemon) {
			if (
				(this.field.isWeather('hail') || this.field.isWeather('diamonddust')) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed
			) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' && effect.category === 'Physical' &&
				target.species.id === 'eiscue' && !target.transformed
			) {
				this.add('-activate', target, 'ability: Ice Face');
				this.effectData.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed) return;
			if (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates)) return;
			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue' || target.transformed) return;
			if (target.volatiles['substitute'] && !(move.flags['authentic'] || move.infiltrates)) return;
			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.species.id === 'eiscue' && this.effectData.busted) {
				pokemon.formeChange('Eiscue-Noice', this.effect, true);
			}
		},
		onAnyWeatherStart() {
			const pokemon = this.effectData.target;
			if (
				(this.field.isWeather('hail') || this.field.isWeather('diamonddust')) &&
				pokemon.species.id === 'eiscuenoice' && !pokemon.transformed
			) {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectData.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		isPermanent: true,
		name: "Ice Face",
		rating: 3,
		num: 248,
	},
	slushrush: {
		shortDesc: "If Hail or Diamond Dust is active, this Pokémon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('hail') || this.field.isWeather('diamonddust')) {
				return this.chainModify(2);
			}
		},
		name: "Slush Rush",
		rating: 3,
		num: 202,
	},
	snowcloak: {
		desc: "If Hail or Diamond Dust is active, this Pokémon's evasiveness is multiplied by 1.25. This Pokémon takes no damage from Hail.",
		shortDesc: "If Hail or Diamond Dust is active, evasiveness is 1.25x; immunity to Hail.",
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('hail') || this.field.isWeather('diamonddust')) {
				this.debug('Snow Cloak - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	prehistoricrage: {
		shortDesc: "This Pokémon can hit Fairy-types with Dragon-type moves.",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Dragon'] = true;
			}
		},
		name: "Prehistoric Rage",
		rating: 3,
		num: -1028,
	},
	lusterswap: {
		shortDesc: "On entry, this Pokémon's type changes to match its first move that's super effective against an adjacent opponent.",
		onStart(pokemon) {
			const possibleTargets = pokemon.side.foe.active.filter(foeActive => foeActive && this.isAdjacent(pokemon, foeActive));
			while (possibleTargets.length) {
				let rand = 0;
				if (possibleTargets.length > 1) rand = this.random(possibleTargets.length);
				const target = possibleTargets[rand];
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, target) > 0
					) {
						this.add('-ability', pokemon, 'Luster Swap');
						if (!pokemon.setType(moveType)) return false;
						this.add('-message', `${pokemon.name} changed its type to match its ${move.name}!`);
						this.add('-start', pokemon, 'typechange', moveType);
						return;
					}
				}
				this.add('-ability', pokemon, 'Luster Swap');
				this.add('-message', `${pokemon.name} can't hit ${target.name} super effectively!`);
				return;
			}
		},
		name: "Luster Swap",
		rating: 3,
		num: -1029,
	},
	acidicsurge: {
		desc: "On switch-in, this Pokémon summons Acidic Terrain for 5 turns. During the effect, the power of Poison-type attacks made by grounded Pokémon is multiplied by 1.3, and grounded Steel-types are not immune to Poison-type damage. Steel-type Pokémon are still immune to being poisoned and badly poisoned, except by Pokémon with Corrosion. Camouflage transforms the user into a Poison-type, Nature Power becomes Sludge Bomb, and Secret Power has a 30% chance to cause poison. Lasts for 8 turns if the user is holding a Terrain Extender (such as through Skill Swap).",
		shortDesc: "5 turns. Grounded: +Poison power, Steel not immune to Poison type.",
		onStart(source) {
			this.field.setTerrain('acidicterrain');
		},
		name: "Acidic Surge",
		rating: 4,
		num: -1030,
	},
	flowergift: {
		desc: "If this Pokémon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5. If this Pokémon is a Mega Meganium and Sunny Day is active, the Attack and Special Defense of it and its allies are multiplied by 1.5. If this Pokémon is a Cherrim or a Mega Meganium and it is holding Utility Umbrella, it remains in its regular form and the Attack and Special Defense stats of it and its allies are not boosted. If this Pokémon is a Cherrim in its Sunshine form and is given Utility Umbrella, it will immediately switch back to its regular form. If this Pokémon is a Cherrim holding Utility Umbrella and its item is removed while Sunny Day is active, it will transform into its Sunshine Form. If an ally is holding Utility Umbrella while Cherrim is in its Sunshine Form or Meganium is Mega Evolved, they will not receive the Attack and Special Defense boosts.",
		shortDesc: "If user is Cherrim or Mega Meganium and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		onStart(pokemon) {
			delete this.effectData.forme;
		},
		onUpdate(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '[msg]');
				}
			}
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim' &&
				this.effectData.target.species.name !== 'Meganium-Mega') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim' &&
				this.effectData.target.species.name !== 'Meganium-Mega') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		name: "Flower Gift",
		rating: 1,
		num: 122,
	},
	savage: {
		desc: "This Pokémon's biting moves become multi-hit moves that hit two to five times. Has a 1/3 chance to hit two or three times, and a 1/6 chance to hit four or five times. Each hit's damage is cut to one third.",
		shortDesc: "This Pokémon's biting moves hit two to five times. Each hit's damage is cut to one third.",
		onPrepareHit(source, target, move) {
			if (move.multihit) return;
			if (move.flags['bite'] && !move.isZ && !move.isMax) {
				move.multihit = [2, 5];
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['bite']) return this.chainModify([1365, 4096]);
		},
		name: "Savage",
		rating: 3.5,
		num: -1031,
	},
	volcanicsinge: {
		desc: "After any of this Pokémon's stats is reduced, making contact with a Pokémon on its team burns the attacker. The duration is one turn for each stat stage that was reduced, and the duration is extended if stats are reduced again while it is already in effect.",
		shortDesc: "After this Pokémon's stats are reduced, contact with its team burns the attacker. Duration depends on the stat reduction.",
		name: "Volcanic Singe",
		onBoost(boost, target, source, effect) {
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					let num = boost[i]!;
					while (num !== 0) {
						target.side.addSideCondition('volcanicsinge');
						num++;
					}
				}
			}
		},
		condition: {
			duration: 2,
			onStart(side) {
				this.add('-ability', this.effectData.source, 'Volcanic Singe');
				this.add('-message', `The air around ${this.effectData.source.name}'s team was superheated!`);
				this.hint(`During Volcanic Singe, making contact with a Pokémon on ${this.effectData.source.name}'s team will result in a burn!`);
				this.hint(`The effect is extended each time ${this.effectData.source.name}'s stats are lowered!`);
				this.effectData.duration = 2;
			},
			onRestart(side) {
				this.effectData.duration++;
			},
			onHit(target, source, move) {
				if (target.side === this.effectData.target && move.flags['contact']) {
					source.trySetStatus('brn', target);
				}
			},
			onResidualOrder: 10,
			onResidual(side) {
				if (this.effectData.duration > 1) {
					this.add('-message', `There are ${this.effectData.duration} turns left of Volcanic Singe!`);
				} else if (this.effectData.duration === 1) {
					this.add('-message', `There is one turn left of Volcanic Singe!`);
				}
			},
			onEnd(side) {
				this.add('-message', `The air around ${this.effectData.source.name}'s team cooled down!`);
			},
		},
		rating: 3.5,
		num: -1032,
	},
	settle: {
		desc: "When using a given special move for the first time in at least three turns, this Pokémon uses its Attack stat, and the power is increased by 100%. Has no effect if the same special move has been used in the last three turns.",
		shortDesc: "When using a special move, this Pokémon uses its Attack stat, and the power is increased by 100%.",
		name: "Settle",
		onModifyMove(move, pokemon) {
			let num = 0;
			for (const moveSlot of pokemon.moveSlots) {
				num++;
				const checkSlot = this.dex.getMove(moveSlot.move);
				if (move.id === checkSlot.id) {
					if (num === 1 && !pokemon.volatiles['settle1']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle1');
						move.category = 'Physical';
						move.defensiveCategory = 'Special';
						move.hasSheerForce = true;
					} else if (num === 2 && !pokemon.volatiles['settle2']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle2');
						move.category = 'Physical';
						move.defensiveCategory = 'Special';
						move.hasSheerForce = true;
					} else if (num === 3 && !pokemon.volatiles['settle3']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle3');
						move.category = 'Physical';
						move.defensiveCategory = 'Special';
						move.hasSheerForce = true;
					} else if (num === 4 && !pokemon.volatiles['settle4']) {
						if (move.category !== 'Special') return;
						pokemon.addVolatile('settle4');
						move.category = 'Physical';
						move.defensiveCategory = 'Special';
						move.hasSheerForce = true;
					}
				}
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasSheerForce) {
				this.hint(`${move.name} was boosted by Settle!`);
				return this.chainModify(2);
			}
		},
		rating: 3,
		num: -1033,
	},
	heavenlytechniques: {
		desc: "If this Pokémon is at full HP, its blade-based and slashing moves have their priority increased by 1. When its HP is in between full and 1/3, this Pokémon's Defense is raised by 1 stage after it uses a blade-based or slashing move. When it has 1/3 or less of its maximum HP, rounded down, this Pokémon's blade-based and slashing moves are critical hits.",
		shortDesc: "Slashing moves: +1 priority at full HP, always crit at 1/3 HP or less, +1 Defense otherwise.",
		onModifyPriority(priority, pokemon, target, move) {
			const bladeMoves = [
				'aerialace', 'airslash', 'behemothblade', 'cut', 'furycutter', 'leafblade', 'nightslash', 'psychocut', 'razorshell', 'razorwind', 'sacredsword', 'secretsword', 'slash', 'smartstrike', 'solarblade',
			];
			if (bladeMoves.includes(move.id) && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		onSourceHit(target, source, move) {
			const bladeMoves = [
				'aerialace', 'airslash', 'behemothblade', 'cut', 'furycutter', 'leafblade', 'nightslash', 'psychocut', 'razorshell', 'razorwind', 'sacredsword', 'secretsword', 'slash', 'smartstrike', 'solarblade',
			];
			if (!move || !target) return;
			if (source.hp === source.maxhp || source.hp <= source.maxhp / 3) return;
			if (bladeMoves.includes(move.id)) {
				this.boost({def: 1}, source);
			}
		},
		onModifyCritRatio(critRatio, source, target, move) {
			const bladeMoves = [
				'aerialace', 'airslash', 'behemothblade', 'cut', 'furycutter', 'leafblade', 'nightslash', 'psychocut', 'razorshell', 'razorwind', 'sacredsword', 'secretsword', 'slash', 'smartstrike', 'solarblade',
			];
			if (bladeMoves.includes(move.id) && source.hp <= source.maxhp / 3) return 5;
		},
		name: "Heavenly Techniques",
		rating: 3,
		num: -1034,
	},
	rotation: {
		desc: "On switch-in, this Pokémon's Defense or Special Defense is raised by 1 stage based on the weaker combined attacking stat of all opposing Pokémon. Special Defense is raised if their Special Attack is higher, and Defense is raised if their Attack is the same or higher.",
		shortDesc: "On switch-in, Defense or Sp. Def is raised 1 stage based on the foes' weaker Attack.",
		onStart(pokemon) {
			let totalatk = 0;
			let totalspa = 0;
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				totalatk += target.getStat('atk', false, true);
				totalspa += target.getStat('spa', false, true);
			}
			if (totalatk && totalatk >= totalspa) {
				this.boost({def: 1});
			} else if (totalspa) {
				this.boost({spd: 1});
			}
		},
		name: "Rotation",
		rating: 4,
		num: -1035,
	},
	pickup: {
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			if (pokemon.item) return;
			const pickupTargets = [];
			for (const target of this.getAllActive()) {
				if (target.lastItem && target.usedItemThisTurn && this.isAdjacent(pokemon, target)) {
					pickupTargets.push(target);
				}
			}
			if (!pickupTargets.length) return;
			const randomTarget = this.sample(pickupTargets);
			const item = randomTarget.lastItem;
			randomTarget.lastItem = '';
			(randomTarget as any).lostItemForDelibird = item;
			this.add('-item', pokemon, this.dex.getItem(item), '[from] ability: Pickup');
			pokemon.setItem(item);
		},
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	spiritofgiving: {
		desc: "On switch-in, every Pokémon in this Pokémon's party regains the item it last held, even if the item was a popped Air Balloon, if the item was picked up by a Pokémon with the Pickup Ability, or the item was lost to Bug Bite, Covet, Incinerate, Knock Off, Pluck, or Thief.",
		shortDesc: "Restores the party's used or removed items on switch-in.",
		name: "Spirit of Giving",
		onStart(pokemon) {
			const side = pokemon.side;
			let activated = false;
			for (const ally of side.pokemon) {
				if (ally.item) {
					continue;
				}
				if (ally.lastItem) {
					const item = ally.lastItem;
					if (ally.setItem(item)) {
						if (!activated) {
							this.add('-ability', pokemon, 'Spirit of Giving');
						}
						activated = true;
						this.add('-item', ally, this.dex.getItem(item), '[from] Ability: Spirit of Giving');
						ally.lastItem = '';
					}
				} else if ((ally as any).lostItemForDelibird) {
					const item = (ally as any).lostItemForDelibird;
					if (ally.setItem(item)) {
						if (!activated) {
							this.add('-ability', pokemon, 'Spirit of Giving');
						}
						activated = true;
						this.add('-item', ally, this.dex.getItem(item), '[from] Ability: Spirit of Giving');
						(ally as any).lostItemForDelibird = '';
					}
				}
			}
		},
		rating: 4,
		num: -1036,
	},
	asonesawsbuck: {
		desc: "The combination of Hustle and A Winter's Tale. This Pokémon's Attack is multiplied by 1.5 and the accuracy of its physical attacks is multiplied by 0.8. The damage of this Pokémon's Ice-type moves used on consecutive turns is increased, up to a maximum of 1.5x after 5 turns. If Hail is active, the effect is doubled for a maximum of 2x after 5 turns.",
		shortDesc: "The combination of Hustle and A Winter's Tale.",
		name: "As One (Sawsbuck)",
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'As One');
		},
		onStart(pokemon) {
			pokemon.addVolatile('awinterstale');
		},
		// This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: 7,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return accuracy * 0.8;
			}
		},
		rating: 4,
		num: -1037,
	},
	springfever: {
		desc: "While this Pokémon is active, if any Pokémon uses a Fire-type move, it is prevented from executing and the attacker loses 1/4 of its maximum HP, rounded half up. This effect does not happen if the Fire-type move is prevented by Primordial Sea.​",
		shortDesc: "While active, any Pokémon using a Fire move loses 1/4 max HP.",
		onStart(pokemon) {
			this.add('-message', `${pokemon.name} fills the air with explosive powder!`);
		},
		onAnyTryMove(target, source, move) {
			if (move.type === 'Fire') {
				this.add('-activate', source, 'move: Powder');
				this.damage(this.clampIntRange(Math.round(source.maxhp / 4), 1));
				return false;
			}
		},
		name: "Spring Fever",
		rating: 4,
		num: -1038,
	},
	summerdays: {
		desc: "If its Special Attack is greater than its Speed, including stat stage changes, this Pokémon's Ability is Solar Power. If its Speed is greater than or equal to its Special Attack, including stat stage changes, this Pokémon's Ability is Chlorophyll.",
		shortDesc: "Solar Power if user's Sp. Atk > Spe. Chlorophyll if user's Spe >= Sp. Atk.",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if ((pokemon.getStat('spa', false, true) > pokemon.getStat('spe', false, true)) &&
				['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (target.getStat('spa', false, true) > target.getStat('spe', false, true)) {
				if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
					this.damage(target.baseMaxhp / 8, target, target);
				}
			}
		},
		onModifySpe(spe, pokemon) {
			if ((pokemon.getStat('spe', false, true) >= pokemon.getStat('spa', false, true)) &&
				['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		name: "Summer Days",
		rating: 4,
		num: -1039,
	},
	autumnleaves: {
		desc: "This Pokémon's Grass-type attacks cause the Ghost type to be added to the target, effectively making it have two or three types. Has no effect if the target is already a Ghost type. If Forest's Curse adds a type to the target, it replaces the type added by this Ability and vice versa.",
		shortDesc: "This Pokémon's Grass attacks add Ghost to the targets' type(s).",
		onSourceHit(target, source, move) {
			if (move.category !== 'Status' && move.type === 'Grass') {
				if (target.hasType('Ghost')) return;
				if (!target.addType('Ghost')) return;
				this.add('-start', target, 'typeadd', 'Ghost', '[from] Ability: Autumn Leaves');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		name: "Autumn Leaves",
		rating: 4,
		num: -1040,
	},
	awinterstale: {
		desc: "The damage of this Pokémon's Ice-type moves used on consecutive turns is increased, up to a maximum of 1.5x after 5 turns. If Hail is active, the effect is doubled for a maximum of 2x after 5 turns.",
		shortDesc: "Damage of Ice moves used on consecutive turns is increased. Effect doubles in Hail; max 1.5x (2x in Hail) after 5 turns.",
		onStart(pokemon) {
			pokemon.addVolatile('awinterstale');
		},
		condition: {
			onStart(pokemon) {
				this.effectData.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('awinterstale') && !pokemon.hasAbility('asonesawsbuck')) {
					pokemon.removeVolatile('awinterstale');
					return;
				}
				if (move.type === 'Ice' && pokemon.moveLastTurnResult) {
					this.effectData.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					this.effectData.numConsecutive = 1;
				} else {
					this.effectData.numConsecutive = 0;
				}
				this.effectData.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
				const numConsecutive = this.effectData.numConsecutive > 5 ? 5 : this.effectData.numConsecutive;
				if (['hail'].includes(source.effectiveWeather())) {
					return this.chainModify([dmgMod[numConsecutive], 4096]);
				} else {
					return damage * (1 + (this.effectData.numConsecutive / 10));
				}
			},
		},
		name: "A Winter's Tale",
		rating: 4,
		num: -1041,
	},
	desertgales: {
		desc: "On switch-in, this Pokémon summons Desert Gales for 5 turns. During the effect, Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.2; Normal-type moves become Ground-type moves; Weather Ball becomes a Ground-type move, and its base power is 100; and other weather-related moves and Abilities behave as they do in Sandstorm.",
		shortDesc: "5 turns. +Ground/Rock/Steel power, Normal moves become Ground-type.",
		onStart(source) {
			this.field.setWeather('desertgales');
		},
		name: "Desert Gales",
		rating: 4,
		num: -1042,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "This Pokémon's Ground/Rock/Steel attacks do 1.3x in Sandstorm and Desert Gales; immunity to it.",
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	sandrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's Speed is doubled. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm or Desert Gales is active, this Pokémon's Speed is doubled; immunity to Sandstorm.",
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	sandveil: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracyPriority: 8,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm') || this.field.isWeather('desertgales')) {
				this.debug('Sand Veil - decreasing accuracy');
				return accuracy * 0.8;
			}
		},
		desc: "If Sandstorm or Desert Gales is active, this Pokémon's evasiveness is multiplied by 1.25. This Pokémon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm or Desert Gales is active, this Pokémon's evasiveness is 1.25x; immunity to Sandstorm.",
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	steelbreaker: {
		shortDesc: "This Pokémon's attacks are critical hits if the target is a Steel-type Pokémon.",
		onModifyCritRatio(critRatio, source, target) {
			if (target && target.hasType('Steel')) return 5;
		},
		name: "Steelbreaker",
		rating: 3,
		num: -1043,
	},
	seismicscream: {
		desc: "This Pokémon uses Earthquake at 60 base power after using a sound-based move. If the sound-based move is a special attack, the Earthquake that is used is also a special attack.",
		shortDesc: "Follows up sound moves with an Earthquake of 60 BP.",
		onSourceHit(target, source, move) {
			if (!move || !target || !target.hp) return;
			if (target !== source && target.hp && move.flags['sound']) {
				source.addVolatile('seismicscream');
				if (move.category === 'Special') {
					source.addVolatile('specialsound');
				}
				this.useMove('earthquake', source);
			}
		},
		name: "Seismic Scream",
		rating: 3,
		num: -1044,
	},
	acidrock: {
		shortDesc: "On switch-in, this Pokémon poisons every Pokémon on the field.",
		onStart(pokemon) {
			for (const target of this.getAllActive()) {
				if (!target || !this.isAdjacent(target, pokemon) || target.status) continue;
				if (target.hasAbility('soundproof')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target, "[from] ability: Soundproof", "[of] " + target);
				} else if (!target.runStatusImmunity('psn')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target);
				} else {
					target.setStatus('psn', pokemon);
				}
			}
		},
		name: "Acid Rock",
		rating: 4,
		num: -1045,
	},
	coupdegrass: {
		desc: "This Pokémon moves first in its priority bracket when its target has 1/2 or less of its maximum HP, rounded down. Does not affect moves that have multiple targets.",
		shortDesc: "This Pokémon moves first in its priority bracket when its target has 1/2 or less HP.",
		onUpdate(pokemon) {
			const action = this.queue.willMove(pokemon);
			if (!action) return;
			const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
			if (!target) return;
			if (target.hp <= target.maxhp / 2) {
				pokemon.addVolatile('coupdegrass');
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				const action = this.queue.willMove(pokemon);
				if (action) {
					this.add('-ability', pokemon, 'Coup de Grass');
					this.add('-message', `${pokemon.name} prepared to move immediately!`);
				}
			},
			onModifyPriority(priority) {
				return priority + 0.1;
			},
		},
		name: "Coup de Grass",
		rating: 3,
		num: -1046,
	},
	masquerade: {
		desc: "This Pokémon inherits the Ability of the last unfainted Pokemon in its party until it takes direct damage from another Pokémon's attack. Abilities that cannot be copied are \"No Ability\", As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		shortDesc: "Inherits the Ability of the last party member. Wears off when attacked.",
		// the same thing happens manually onAfterMega and onSwitchIn, but it should not happen every time the Ability starts
		onAfterMega(pokemon) {
			pokemon.addVolatile('masquerade');
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				const additionalBannedAbilities = [
					'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard',
				];
				if (
					pokemon.side.pokemon[i].fainted ||
					pokemon.side.pokemon[i].getAbility().isPermanent || additionalBannedAbilities.includes(pokemon.side.pokemon[i].ability)
				) {
					continue;
				} else {
					break;
				}
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			const masquerade = pokemon.side.pokemon[i];
			this.add('-ability', pokemon, 'Masquerade');
			pokemon.setAbility(masquerade.ability);
			this.add('-message', `${pokemon.name} inherited ${this.dex.getAbility(pokemon.ability).name} from ${masquerade.name}!`);
			this.add('-ability', pokemon, this.dex.getAbility(pokemon.ability).name, '[silent]');
		},
		onSwitchIn(pokemon) {
			pokemon.addVolatile('masquerade');
			let i;
			for (i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				if (!pokemon.side.pokemon[i]) continue;
				const additionalBannedAbilities = [
					'noability', 'flowergift', 'forecast', 'hungerswitch', 'illusion', 'imposter', 'neutralizinggas', 'powerofalchemy', 'receiver', 'trace', 'wonderguard',
				];
				if (
					pokemon.side.pokemon[i].fainted ||
					pokemon.side.pokemon[i].getAbility().isPermanent || additionalBannedAbilities.includes(pokemon.side.pokemon[i].ability)
				) {
					continue;
				} else {
					break;
				}
			}
			if (!pokemon.side.pokemon[i]) return;
			if (pokemon === pokemon.side.pokemon[i]) return;
			const masquerade = pokemon.side.pokemon[i];
			this.add('-ability', pokemon, 'Masquerade');
			pokemon.setAbility(masquerade.ability);
			this.add('-message', `${pokemon.name} inherited ${this.dex.getAbility(pokemon.ability).name} from ${masquerade.name}!`);
			this.add('-ability', pokemon, this.dex.getAbility(pokemon.ability).name, '[silent]');
		},
		condition: {
			onDamagingHit(damage, target, source, move) {
				target.removeVolatile('masquerade');
			},
			onFaint(pokemon) {
				pokemon.removeVolatile('masquerade');
			},
			onEnd(pokemon) {
				this.add('-ability', pokemon, 'Masquerade');
				this.add('-message', `${pokemon.name}'s Masquerade wore off!`);
				pokemon.setAbility('masquerade');
			},
		},
		name: "Masquerade",
		rating: 3,
		num: -1047,
	},
	bodyofwater: {
		desc: "When this Pokémon uses a Water-type attack, damage is calculated using the user's Defense stat as its Attack or its Special Defense as its Special Attack, including stat stage changes. Other effects that modify the Attack and Special Attack stats are used as normal.",
		shortDesc: "Water-type attacks use Def as Atk and Sp. Def as Sp. Atk in damage calculation.",
		name: "Body of Water",
		onModifyMove(move, attacker) {
			if (move.type === 'Water') {
				move.useSourceDefensiveAsOffensive = true;
			}
		},
		rating: 3.5,
		num: -1048,
	},
	stickyresidues: {
		desc: "On switch-in, this Pokémon summons sticky residues that prevent hazards from being cleared or moved by Court Change for five turns. Lasts for 8 turns if the user is holding Light Clay. Fails if the effect is already active on the user's side.",
		shortDesc: "On switch-in, this Pokémon summons sticky residues that prevent hazards from being cleared or moved by Court Change for five turns.",
		onStart(source) {
			if (this.field.addPseudoWeather('stickyresidues')) {
				this.add('-message', `${source.name} set up sticky residues on the battlefield!`);
			}
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onEnd() {
				this.add('-message', `The sticky residues disappeared from the battlefield!`);
			},
		},
		name: "Sticky Residues",
		rating: 3,
		num: -1025,
	},
	elegance: {
		desc: "This Pokémon's moves have their secondary effect chance guaranteed, unless it has a non-volatile status condition, is confused, or is affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "This Pokémon's moves have their secondary effect chance guaranteed unless it has a status or a mental affliction.",
		onModifyMovePriority: -2,
		onModifyMove(move, attacker) {
			if (attacker.status) return;
			if (attacker.volatiles['attract'] || attacker.volatiles['confusion'] ||
				attacker.volatiles['disable'] || attacker.volatiles['encore'] || attacker.volatiles['healblock'] ||
				attacker.volatiles['taunt'] || attacker.volatiles['torment']) return;
			if (move.secondaries) {
				this.debug('maximizing secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance = 100;
				}
			}
			if (move.self?.chance) move.self.chance = 100;
		},
		name: "Elegance",
		rating: 5,
		num: -1044,
	},
};
