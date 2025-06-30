export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	zerotohero: {
		onSourceAfterFaint(length, target, source, effect) {
			if (this.effectState.heroTriggered) return;
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'palafin' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Zero to Hero');
				source.formeChange('Palafin-Hero', this.effect, true);
				source.formeRegression = true;
				this.effectState.heroTriggered = true;
			}
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Zero to Hero",
		shortDesc: "If this Pokemon is a Palafin in Zero Form, KOing a foe has it change to Hero Form.",
		rating: 5,
		num: 278,
	},
	overcoat: {
		inherit: true,
		shortDesc: "This Pokemon is immune to sandstorm damage, hazards, and powder moves.",
		name: "Overcoat",
	},
	cutecharm: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (defender.types.includes(move.type)) {
				this.debug('Cute Charm weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (defender.types.includes(move.type)) {
				this.debug('Cute Charm weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Cute Charm",
		shortDesc: "This Pokemon takes 50% damage from moves of its own type.",
		rating: 3,
		num: 56,
	},
	healer: {
		name: "Healer",
		onFaint(pokemon) {
			pokemon.side.addSlotCondition(pokemon, 'healer');
		},
		condition: {
			onSwitchIn(target) {
				this.singleEvent('Swap', this.effect, this.effectState, target);
			},
			onSwap(target) {
				if (!target.fainted) {
					const source = this.effectState.source;
					const damage = this.heal(target.baseMaxhp / 2, target, target);
					if (damage) this.add('-heal', target, target.getHealth, '[from] ability: Healer', `[of] ${source}`);
					target.side.removeSlotCondition(target, 'healer');
				}
			},
		},
		flags: {},
		rating: 3,
		shortDesc: "On faint, the next Pokemon sent out heals 50% of its max HP.",
		num: 131,
	},
	galewings: {
		onModifyPriority(priority, pokemon, target, move) {
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('counteract') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move?.type === 'Flying' && pokemon.hp >= pokemon.maxhp / 2) return priority + 1;
		},
		flags: {},
		name: "Gale Wings",
		shortDesc: "If this Pokemon has 50% of its max HP or more, its Flying-type moves have their priority increased by 1.",
		rating: 3,
		num: 177,
	},
	grasspelt: {
		onStart(pokemon) {
			if (!this.field.setTerrain('grassyterrain') && this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: Grass Pelt');
			}
		},
		onModifyDefPriority: 5,
		onModifyDef(def) {
			for (const target of this.getAllActive()) {
				if (target.hasAbility('cloudnine')) {
					this.debug('Cloud Nine prevents Defense increase');
					return;
				}
			}
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Grass Pelt boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: { breakable: 1 },
		name: "Grass Pelt",
		shortDesc: "On switch-in, summons Grassy Terrain. During Grassy Terrain, Def is 1.3333x.",
		rating: 4.5,
		num: 179,
	},
	musclememory: {
		onStart(pokemon) {
			pokemon.addVolatile('musclememory');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('musclememory')) {
					pokemon.removeVolatile('musclememory');
					return;
				}
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					if (this.effectState.lastMove !== move.id) {
						this.effectState.numConsecutive = 1;
					} else {
						this.effectState.numConsecutive++;
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
				const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
				this.debug(`Current musclememory boost: ${dmgMod[numConsecutive]}/4096`);
				return this.chainModify([dmgMod[numConsecutive], 4096]);
			},
		},
		flags: {},
		name: "Muscle Memory",
		shortDesc: "Damage of moves used on consecutive turns is increased. Max 2x after 5 turns.",
		rating: 4,
	},
	deathaura: {
		name: "Death Aura",
		shortDesc: "While this Pokemon is active, no Pokemon can heal or use draining moves.",
		onStart(pokemon) {
			let activated = false;
			for (const target of [...new Set([...pokemon.alliesAndSelf(), ...pokemon.adjacentFoes()])]) {
				if (!activated) {
					this.add('-ability', pokemon, 'Death Aura');
					activated = true;
				}
				if (!target.volatiles['healblock']) target.addVolatile('healblock');
			}
		},
		onAnySwitchIn(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onEnd(pokemon) {
			for (const target of pokemon.foes()) {
				if (!target.hasAbility('deathaura')) {
					target.removeVolatile('healblock');
				}
			}
		},
		flags: {},
		rating: 4,
	},
	seedsower: {
		onDamagingHit(damage, target, source, move) {
			if (!source.hasType('Grass')) {
				this.add('-activate', target, 'ability: Seed Sower');
				source.addVolatile('leechseed', this.effectState.target);
			}
		},
		flags: {},
		name: "Seed Sower",
		shortDesc: "When this Pokemon is hit by an attack, the effect of Leech Seed begins.",
		rating: 3,
		num: 269,
	},
	sandspit: {
		onDamagingHit(damage, target, source, move) {
			this.add('-activate', target, 'ability: Sand Spit');
			source.addVolatile('sandspit', this.effectState.target);
		},
		condition: {
			duration: 5,
			durationCallback(target, source) {
				if (source?.hasItem('gripclaw')) return 8;
				return this.random(5, 7);
			},
			onStart(pokemon, source) {
				this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
				this.effectState.boundDivisor = 8;
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				const source = this.effectState.source;
				// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
				const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
				if (source && (!source.isActive || source.hp <= 0) && !gmaxEffect) {
					delete pokemon.volatiles['sandspit'];
					this.add('-end', pokemon, this.effectState.sourceEffect, '[sandspit]', '[silent]');
					return;
				}
				this.add('-anim', pokemon, "Sand Tomb", pokemon);
				this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, this.effectState.sourceEffect, '[sandspit]');
			},
			onTrapPokemon(pokemon) {
				const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
				if (this.effectState.source?.isActive || gmaxEffect) pokemon.tryTrap();
			},
		},
		flags: {},
		name: "Sand Spit",
		shortDesc: "When this Pokemon is hit by an attack, the effect of Sand Tomb begins.",
		rating: 4,
		num: 245,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Force boost');
				return this.chainModify([0x14CD, 0x1000]);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		flags: {},
		name: "Sand Force",
		rating: 2,
		shortDesc: "This Pokemon's moves deal 1.3x damage in a sandstorm; Sand immunity.",
		num: 159,
	},
	cloudnine: {
		onSwitchIn(pokemon) {
			// Cloud Nine does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Cloud Nine');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			// Cloud Nine does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
			if (this.field.terrain) {
				this.add('-message', `${pokemon.name} suppresses the effects of the terrain!`);
				let activated = false;
				for (const other of pokemon.foes()) {
					if (!activated) {
						this.add('-ability', pokemon, 'Cloud Nine');
					}
					activated = true;
					if (!other.volatiles['cloudnine']) {
						other.addVolatile('cloudnine');
					}
				}
			}
		},
		onTerrainChange() {
			const pokemon = this.effectState.target;
			this.add('-ability', pokemon, 'Cloud Nine');
			this.add('-message', `${pokemon.name} suppresses the effects of the terrain!`);
			if (this.field.terrain) {
				let activated = false;
				for (const other of pokemon.foes()) {
					if (!activated) {
						this.add('-ability', pokemon, 'Cloud Nine');
					}
					activated = true;
					if (!other.volatiles['cloudnine']) {
						other.addVolatile('cloudnine');
					}
				}
			}
		},
		onAnySwitchIn(pokemon) {
			const source = this.effectState.target;
			if (pokemon === source) return;
			for (const target of source.foes()) {
				if (!target.volatiles['cloudnine']) {
					target.addVolatile('cloudnine');
				}
			}
		},
		onEnd(source) {
			if (this.field.terrain) {
				const cnsource = this.effectState.target;
				for (const target of cnsource.foes()) {
					target.removeVolatile('cloudnine');
				}
			}
			source.abilityState.ending = true;
			for (const pokemon of this.getAllActive()) {
				if (pokemon.ignoringItem()) continue;
				if (
					(pokemon.hasItem('psychicseed') && this.field.isTerrain('psychicterrain')) ||
					(pokemon.hasItem('electricseed') && this.field.isTerrain('electricterrain')) ||
					(pokemon.hasItem('grassyseed') && this.field.isTerrain('grassyterrain')) ||
					(pokemon.hasItem('mistyseed') && this.field.isTerrain('mistyterrain'))
				) {
					for (const target of this.getAllActive()) {
						if (target.hasAbility('cloudnine') && target !== source) {
							this.debug('Cloud Nine prevents Seed use');
							return;
						}
					}
					pokemon.useItem();
				}
			}
		},
		condition: {},
		suppressWeather: true,
		flags: {},
		name: "Cloud Nine",
		shortDesc: "While this Pokemon is active, the effects of weathers and terrains are disabled.",
		rating: 2,
		num: 13,
	},
	runedrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('mistyterrain')) {
				pokemon.addVolatile('runedrive');
			} else if (!pokemon.volatiles['runedrive']?.fromBooster) {
				pokemon.removeVolatile('runedrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['runedrive'];
			this.add('-end', pokemon, 'Rune Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Rune Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Rune Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Rune Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Rune Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Rune Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Rune Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Rune Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Rune Drive');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Rune Drive",
		rating: 3,
		shortDesc: "Misty Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	photondrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				pokemon.addVolatile('photondrive');
			} else if (!pokemon.volatiles['photondrive']?.fromBooster) {
				pokemon.removeVolatile('photondrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['photondrive'];
			this.add('-end', pokemon, 'Photon Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Photon Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Photon Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Photon Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Photon Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Photon Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Photon Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Photon Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Photon Drive');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Photon Drive",
		rating: 3,
		shortDesc: "Grassy Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	neurondrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('psychicterrain')) {
				pokemon.addVolatile('neurondrive');
			} else if (!pokemon.volatiles['neurondrive']?.fromBooster) {
				pokemon.removeVolatile('neurondrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['neurondrive'];
			this.add('-end', pokemon, 'Neuron Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Neuron Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Neuron Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Neuron Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Neuron Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Neuron Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Neuron Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Neuron Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Neuron Drive');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Neuron Drive",
		rating: 3,
		shortDesc: "Psychic Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	protosmosis: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protosmosis is not affected by Utility Umbrella
			if (this.field.isWeather('raindance')) {
				pokemon.addVolatile('protosmosis');
			} else if (!pokemon.volatiles['protosmosis']?.fromBooster && !this.field.isWeather('raindance')) {
				pokemon.removeVolatile('protosmosis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protosmosis'];
			this.add('-end', pokemon, 'Protosmosis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protosmosis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protosmosis');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protosmosis atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protosmosis def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protosmosis spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protosmosis spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protosmosis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protosmosis');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protosmosis",
		rating: 3,
		shortDesc: "Rain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	protocrysalis: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protocrysalis is not affected by Utility Umbrella
			if (this.field.isWeather('sandstorm')) {
				pokemon.addVolatile('protocrysalis');
			} else if (!pokemon.volatiles['protocrysalis']?.fromBooster && !this.field.isWeather('sandstorm')) {
				pokemon.removeVolatile('protocrysalis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protocrysalis'];
			this.add('-end', pokemon, 'Protocrysalis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protocrysalis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protocrysalis');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protocrysalis atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protocrysalis def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protocrysalis spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protocrysalis spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protocrysalis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protocrysalis');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protocrysalis",
		rating: 3,
		shortDesc: "Sand active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	protostasis: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protostasis is not affected by Utility Umbrella
			if (this.field.isWeather('snowscape')) {
				pokemon.addVolatile('protostasis');
			} else if (!pokemon.volatiles['protostasis']?.fromBooster && !this.field.isWeather('snowscape')) {
				pokemon.removeVolatile('protostasis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protostasis'];
			this.add('-end', pokemon, 'Protostasis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protostasis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protostasis');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protostasis atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protostasis def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protostasis spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protostasis spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protostasis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protostasis');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protostasis",
		rating: 3,
		shortDesc: "Snow active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",
	},
	counteract: {
		name: "Counteract",
		// new Ability suppression implemented in scripts.ts
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Counteract');
			this.add('-message', `${pokemon.name}'s is thinking of how to counter the opponent's strategy!`);
		},
		// onModifyPriority implemented in relevant abilities
		onFoeBeforeMovePriority: 13,
		onFoeBeforeMove(attacker, defender, move) {
			attacker.addVolatile('counteract');
		},
		condition: {
			onAfterMove(pokemon) {
				pokemon.removeVolatile('counteract');
			},
			onFlinch(pokemon) {
				pokemon.removeVolatile('counteract');
			},
		},
		flags: {},
		desc: "While this Pokemon is active, opposing Pokemon's moves and their effects ignore its own Ability. Does not affect the As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode Abilities.",
		shortDesc: "While this Pokemon is active, opposing Pokemon's Ability has no effect when it uses moves.",
		rating: 4,
		gen: 8,
	},
	sunblock: {
		name: "Sunblock",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' && this.field.isWeather('sunnyday')) {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			if (this.field.isWeather('sunnyday')) {
				this.debug('Sunblock prevent secondary');
				return secondaries.filter(effect => !!effect.self);
			}
		},
		flags: { breakable: 1 },
		shortDesc: "In Sun: Immune to indirect damage and secondary effects.",
		gen: 8,
	},
	sandveil: { // add sand clock effect here later
		name: "Sand Veil",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' && this.field.isWeather('sandstorm')) {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil prevent secondary');
				return secondaries.filter(effect => !!effect.self);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		flags: { breakable: 1 },
		shortDesc: "In Sandstorm: Immune to indirect damage and secondary effects.",
		rating: 3,
		num: 8,
	},
	snowcloak: { // add snow globe effect here later
		name: "Snow Cloak",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move' && this.field.isWeather(['hail', 'snowscape'])) {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				this.debug('Snow Cloak prevent secondary');
				return secondaries.filter(effect => !!effect.self);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		flags: { breakable: 1 },
		shortDesc: "In Snow: Immune to indirect damage and secondary effects.",
		rating: 3,
		num: 81,
	},
	outclass: {
		onSourceHit(target, source, move) {
			if (!move || !target || source.types[1] || source.volatiles['outclass'] || target.hasItem('terashard')) return;
			const targetType = target.types[0];
			if (target !== source && move.category !== 'Status' &&
				!source.hasType(targetType) && source.addType(targetType) && targetType !== '???') {
				target.setType(target.getTypes(true).map(type => type === targetType ? "???" : type));
				this.add('-start', target, 'typechange', target.types.join('/'));
				this.add('-start', source, 'typeadd', targetType, '[from] ability: Outclass');
				source.addVolatile('outclass');
			}
		},
		condition: {},
		flags: {},
		name: "Outclass",
		shortDesc: "If this Pokemon has one type, it steals the primary typing off a Pokemon it hits with an attack.",
		rating: 4,
	},
	steelyspirit: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steely Spirit boost');
				return this.chainModify(2);
			}
		},
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				return this.chainModify(0.5);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Steely Spirit');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Steely Spirit');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Steely Spirit",
		rating: 3.5,
		shortDesc: "This Pokemon's Steel power is 2x; it can't be paralyzed; Electric power against it is halved.",
		num: 252,
	},
	sheerheart: {
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.category === 'Special') return this.chainModify([5325, 4096]);
		},
		onTryBoost(boost, target, source, effect) {
			if (boost.spa) {
				delete boost.spa;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Special Attack", "[from] ability: Sheer Heart", `[of] ${target}`);
				}
			}
		},
		flags: { breakable: 1 },
		name: "Sheer Heart",
		rating: 4,
		shortDesc: "Special attacks have 1.3x power; stat changes to the Special Attack stat have no effect.",
	},
	battlespines: {
		onAfterMove(target, source, move) {
			if (target !== source && move.category !== 'Status' && move.totalDamage) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		flags: {},
		name: "Battle Spines",
		rating: 4.5,
		shortDesc: "This Pokemon’s attacks do an additional 1/8 of the target’s max HP in damage.",
	},
	smelt: {
		name: "Smelt",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Smelt');
			this.add('-message', `${pokemon.name}'s heat turns rocks into magma!`);
		},
		onFoeBeforeMovePriority: 13,
		onFoeBeforeMove(attacker, defender, move) {
			attacker.addVolatile('smelt');
		},
		condition: {
			onModifyTypePriority: -1,
			onModifyType(move, pokemon) {
				if (move.type === 'Rock') {
					move.type = 'Fire';
				}
			},
			onAfterMove(pokemon) {
				pokemon.removeVolatile('smelt');
			},
		},
		flags: { breakable: 1 },
		shortDesc: "Rock moves used against this Pokemon become Fire-type (includes Stealth Rock).",
		rating: 4,
	},
	colorchange: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && target !== source &&
				type !== '???' && !target.hasItem('terashard')
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		flags: {},
		name: "Color Change",
		shortDesc: "This Pokemon's type changes to the type of a move it's about to be hit by, unless it has the type.",
		rating: 2.5,
		num: 16,
	},
	greeneyed: {
		name: "Green-Eyed",
		onStart(source) {
			this.add('-ability', source, 'Green-Eyed');
			source.addVolatile('snatch');
		},
		flags: {},
		shortDesc: "On switch-in, if the foe uses a Snatchable move, this Pokemon uses it instead.",
		rating: 3,
	},
	mudwash: {
		name: "Mud Wash",
		onStart(source) {
			this.add('-ability', source, 'Mud Wash');
			this.field.addPseudoWeather('mudsport');
			this.field.addPseudoWeather('watersport');
			this.add('-message', `${source.name}'s splashed around in the mud!`);
		},
		onModifyMove(move, pokemon) {
			if (['Muddy Water', 'Mud Shot', 'Mud Bomb', 'Mud-Slap'].includes(move.name) && move.secondaries) {
				delete move.secondaries;
				delete move.self;
			}
		},
		onBasePower(basePower, attacker, defender, move) {
			if (['Muddy Water', 'Mud Shot', 'Mud Bomb', 'Mud-Slap'].includes(move.name)) {
				return this.chainModify(2);
			}
		},
		flags: {},
		shortDesc: "On switch-in, sets Mud Sport and Water Sport. This Pokemon's mud moves deal double damage but lose their secondary effects.",
		rating: 5,
	},
	exoskeleton: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Exoskeleton');
			this.add('-message', `${pokemon.name} sports a tough exoskeleton!`);
		},
		onEffectiveness(typeMod, target, type, move) {
			if (type === 'Bug' && typeMod > 0) return 0;
		},
		// Bug resistances for non-Bugs implemented in scripts.ts/pokemon
		flags: { breakable: 1 },
		name: "Exoskeleton",
		rating: 4,
		shortDesc: "Removes Bug-type weaknesses if Bug, else adds Bug resistances.",
	},
	bluntforce: {
		// This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(1.5);
		},
		onBeforeMovePriority: 5,
		onBeforeMove(attacker, defender, move) {
			if (move.category === 'Physical') {
				defender.addVolatile('bluntforce');
			}
		},
		condition: {
		// Effectiveness implemented in scripts.ts/pokemon, stuff here is meant to get rid of it after the move is used
			onAfterMoveSecondary(pokemon) {
				pokemon.removeVolatile('bluntforce');
			},
			// onBeforeMove and onResidual are meant to catch the event where the attack misses
			onBeforeMove(attacker, defender, move) {
				attacker.removeVolatile('bluntforce');
			},
			onResidual(pokemon) {
				pokemon.removeVolatile('bluntforce');
			},
		},
		flags: {},
		name: "Blunt Force",
		rating: 3.5,
		shortDesc: "This Pokemon's physical moves have 1.5x power but can't be super effective.",
	},
	waterveil: {
		onStart(source) {
			this.add('-ability', source, 'Water Veil');
			source.addVolatile('aquaring');
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Veil');
			}
			return false;
		},
		flags: { breakable: 1 },
		name: "Water Veil",
		rating: 2,
		num: 41,
		shortDesc: "This Pokemon uses Aqua Ring on switch-in. This Pokemon can't be burned.",
	},
	shielddust: {
		onModifySecondaries(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.secondaries) {
				this.debug('Shield Dust neutralize');
				return this.chainModify([2731, 4096]);
			}
		},
		flags: { breakable: 1 },
		name: "Shield Dust",
		rating: 4,
		num: 19,
		shortDesc: "Moves with secondary effects against user: 0.67x power, secondary effects cannot activate.",
	},
	blaze: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Fire') {
				this.debug('Blaze boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		flags: {},
		name: "Blaze",
		rating: 2,
		num: 66,
		shortDesc: "1.2x Power on Fire attacks. At 1/3 or less HP, all of this Pokemon's moves deal 1.5x damage.",
	},
	torrent: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Water') {
				this.debug('Torrent boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Water') {
				this.debug('Torrent boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		flags: {},
		name: "Torrent",
		rating: 2,
		num: 67,
		shortDesc: "1.2x Power on Water attacks. At 1/3 or less HP, all of this Pokemon's moves deal 1.5x damage.",
	},
	overgrow: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Grass') {
				this.debug('Overgrow boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Grass') {
				this.debug('Overgrow boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		flags: {},
		name: "Overgrow",
		rating: 2,
		num: 65,
		shortDesc: "1.2x Power on Grass attacks. At 1/3 or less HP, all of this Pokemon's moves deal 1.5x damage.",
	},
	swarm: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Bug') {
				this.debug('Swarm boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm low HP boost');
				return this.chainModify(1.5);
			} else if (move.type === 'Bug') {
				this.debug('Swarm boost');
				return this.chainModify([0x1333, 0x1000]);
			}
		},
		flags: {},
		name: "Swarm",
		rating: 2,
		num: 68,
		shortDesc: "1.2x Power on Bug attacks. At 1/3 or less HP, all of this Pokemon's moves deal 1.5x damage.",
	},
	fairyringer: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fairy') {
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Fairy Ringer');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Fairy' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Fairy Ringer');
				}
				return this.effectState.target;
			}
		},
		flags: { breakable: 1 },
		name: "Fairy Ringer",
		rating: 3,
		shortDesc: "This Pokemon draws Fairy moves to itself to raise Atk by 1; Fairy immunity.",
	},
	justified: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark') {
				this.boost({ atk: 1 });
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Dark') {
				this.debug('Justified weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Dark') {
				this.debug('Justified weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Justified",
		rating: 3,
		num: 154,
		shortDesc: "Dark-type moves deal 50% damage to this Pokemon and raise its Attack by 1 stage.",
	},
	momentum: {
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (['rapidspin', 'icespinner', 'spinout', 'blazingtorque', 'combattorque', 'noxioustorque',
				'wickedtorque', 'drillrun', 'gyroball', 'rollout', 'iceball', 'flipturn', 'uturn', 'electrodrift',
				'darkestlariat', 'flamewheel', 'aurawheel', 'shiftgear', 'mortalspin', 'geargrind', 'steelroller',
				'rototiller', 'steamroller', 'tripleaxel', 'triplekick', 'firespin', 'leaftornado', 'hurricane',
				'bleakwindstorm', 'sandsearstorm', 'wildboltstorm', 'springtimestorm', 'whirlpool'].includes(move.id)) {
				this.heal(pokemon.baseMaxhp / 8);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (['rapidspin', 'icespinner', 'spinout', 'blazingtorque', 'combattorque', 'noxioustorque',
				'wickedtorque', 'drillrun', 'gyroball', 'rollout', 'iceball', 'flipturn', 'uturn', 'electrodrift',
				'darkestlariat', 'flamewheel', 'aurawheel', 'shiftgear', 'mortalspin', 'geargrind', 'steelroller',
				'rototiller', 'steamroller', 'tripleaxel', 'triplekick', 'firespin', 'leaftornado', 'hurricane',
				'bleakwindstorm', 'sandsearstorm', 'wildboltstorm', 'springtimestorm', 'whirlpool'].includes(move.id)) {
				this.heal(target.baseMaxhp / 8);
			}
		},
		flags: {},
		name: "Momentum",
		shortDesc: "The user heals 1/8 of its HP if it uses or gets hit by a spinning move.",
	},
	cudchew: {
		onStart(pokemon) {
			if (pokemon.getItem().isBerry) {
				pokemon.eatItem(true);
				this.add('-message', `${pokemon.name}'s ate its berry!`);
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Cud Chew');
				this.add('-message', `${pokemon.name}'s regenerated its berry!`);
			}
		},
		flags: {},
		name: "Cud Chew",
		rating: 4,
		num: 291,
		shortDesc: "Eats berry on switch-in, recycles berry on switch-out.",
	},
	permafrost: {
		name: "Permafrost",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Permafrost');
			this.add('-message', `${pokemon.name}'s freezing aura turns water into ice!`);
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Ice') {
				this.boost({ def: 1, spd: 1 });
			}
		},
		onFoeBeforeMovePriority: 13,
		onFoeBeforeMove(attacker, defender, move) {
			attacker.addVolatile('permafrost');
		},
		condition: {
			onModifyTypePriority: -2,
			onModifyType(move, pokemon) {
				if (move.type === 'Water') {
					move.type = 'Ice';
				}
			},
			onAfterMove(pokemon) {
				pokemon.removeVolatile('permafrost');
			},
		},
		flags: {},
		shortDesc: "Water moves used against this Pokemon become Ice-type. +1 Def/SpD when hit by Ice.",
		rating: 4,
	},
	prehistoricmight: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!target.positiveBoosts()) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Prehistoric Might', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spe: -2 }, target, pokemon, null, true);
				}
			}
		},
		flags: {},
		name: "Prehistoric Might",
		rating: 2.5,
		shortDesc: "On switch-in, the foe's Speed is lowered by 2 stages if it has a positive stat boost.",
	},
	synchronize: {
		onDamage(damage, target, source, effect) {
			if (effect && effect.effectType !== 'Move' && effect.id !== 'synchronize') {
				for (const foes of target.adjacentFoes()) {
					this.damage(damage, foes, target);
				}
			}
		},
		flags: {},
		name: "Synchronize",
		rating: 2,
		num: 28,
		shortDesc: "If this Pokemon takes indirect damage, the opponent takes the same amount of damage.",
	},
	illusion: {
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			// yes, you can Illusion an active pokemon but only if it's to your right
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) {
					// If Ogerpon is in the last slot while the Illusion Pokemon is Terastallized
					// Illusion will not disguise as anything
					if (!pokemon.terastallized || possibleTarget.species.baseSpecies !== 'Ogerpon') {
						pokemon.illusion = possibleTarget;
					}
					break;
				}
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.illusion) {
				this.debug('Illusion weaken');
				return this.chainModify(0.5);
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (target.illusion) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion cleared');
				pokemon.illusion = null;
				const details = pokemon.getUpdatedDetails();
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				if (this.ruleTable.has('illusionlevelmod')) {
					this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
				}
			}
		},
		onFaint(pokemon) {
			pokemon.illusion = null;
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, breakable: 1 },
		name: "Illusion",
		rating: 4.5,
		num: 149,
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage, which is halved while disguised.",
	},
	steadfast: {
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.baseSpecies.bst < source.baseSpecies.bst) {
				this.debug('Steadfast weaken');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Steadfast",
		rating: 4,
		num: 80,
		shortDesc: "This Pokemon takes 0.5x damage from higher BST foes and can't flinch.",
	},
	fairfight: {
		name: "Fair Fight",
		onStart(pokemon) {
			let activated = false;
			for (const target of [...new Set([...pokemon.alliesAndSelf(), ...pokemon.adjacentFoes()])]) {
				if (!activated) {
					this.add('-ability', pokemon, 'Fair Fight');
					this.add('-message', `${pokemon.name} wants to have a fair fight!`);
					activated = true;
				}
				if (!target.volatiles['fairfight']) target.addVolatile('fairfight');
			}
		},
		onAnySwitchIn(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onEnd(pokemon) {
			for (const target of pokemon.foes()) {
				if (!target.hasAbility('fairfight')) {
					target.removeVolatile('fairfight');
				}
			}
		},
		condition: {
			onTryBoost(boost, target, source, effect) {
				let showMsg = false;
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! < 0 || boost[i]! > 0) {
						delete boost[i];
						showMsg = true;
					}
				}
				if (showMsg && !(effect as ActiveMove).secondaries) {
					this.add('-activate', target, 'ability: Fair Fight');
					this.add('-message', `${target.name} can't change its stats!`);
				}
			},
		},
		flags: {},
		shortDesc: "While this Pokemon is active, no stat changes can occur.",
	},
	// unchanged abilities
	damp: {
		onAnyTryMove(target, source, effect) {
			if (['explosion', 'mindblown', 'mistyexplosion', 'selfdestruct', 'shrapnelshot'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectState.target, 'ability: Damp', effect, `[of] ${target}`);
				return false;
			}
		},
		onAnyDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Aftermath') {
				return false;
			}
		},
		flags: { breakable: 1 },
		name: "Damp",
		rating: 0.5,
		num: 6,
	},
	regenerator: {
		onSwitchOut(pokemon) {
			if (!pokemon.volatiles['healblock']) {
				pokemon.heal(pokemon.baseMaxhp / 3);
			}
		},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	surgesurfer: {
		shortDesc: "If Electric Terrain is active, this Pokémon's Speed is doubled.",
		onModifySpe(spe, pokemon) {
			if (pokemon.volatiles['cloudnine']) {
				this.debug('Cloud Nine prevents Speed increase (check 1)');
				return;
			}
			for (const target of this.getAllActive()) {
				if (target.hasAbility('cloudnine')) {
					this.debug('Cloud Nine prevents Speed increase (check 2)');
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
	quarkdrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				pokemon.addVolatile('quarkdrive');
			} else if (!pokemon.volatiles['quarkdrive']?.fromBooster) {
				pokemon.removeVolatile('quarkdrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['quarkdrive'];
			this.add('-end', pokemon, 'Quark Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Quark Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Quark Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Quark Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Quark Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Quark Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility() || pokemon.volatiles['cloudnine']) return;
				this.debug('Quark Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Quark Drive');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Quark Drive",
		rating: 3,
		num: 282,
	},
	prankster: {
		// for ngas
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('counteract') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
	},
	triage: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			// for ngas
			for (const poke of this.getAllActive()) {
				if (poke.hasAbility('counteract') && poke.side.id !== pokemon.side.id && !poke.abilityState.ending) {
					return;
				}
			}
			if (move?.flags['heal']) return priority + 1;
		},
		shortDesc: "This Pokemon's healing moves have their priority increased by 1.",
	},
	icebody: {
		onWeather(target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'snowscape') {
				this.heal(target.baseMaxhp / 32);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	libero: {
		onPrepareHit(source, target, move) {
			if (this.effectState.libero === source.previouslySwitchedIn) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			if (source.hasItem('terashard')) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.libero = source.previouslySwitchedIn;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		flags: {},
		name: "Libero",
		rating: 4,
		num: 236,
	},
	protean: {
		onPrepareHit(source, target, move) {
			if (this.effectState.protean === source.previouslySwitchedIn) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			if (source.hasItem('terashard')) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.protean = source.previouslySwitchedIn;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		flags: {},
		name: "Protean",
		rating: 4,
		num: 168,
	},
	adaptability: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (move.type === source.teraType && source.baseSpecies.types.includes(source.teraType) &&
					source.hasItem('terashard')) {
					return 2.25;
				}
				return 2;
			}
		},
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
};
