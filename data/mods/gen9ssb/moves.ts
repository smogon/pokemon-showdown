import {ssbSets} from "./random-teams";
import {PSEUDO_WEATHERS, changeSet, getName} from "./scripts";
import {Teams} from '../../../sim/teams';

export const Moves: {[k: string]: ModdedMoveData} = {
	/*
	// Example
	moveid: {
		accuracy: 100, // a number or true for always hits
		basePower: 100, // Not used for Status moves, base power of the move, number
		category: "Physical", // "Physical", "Special", or "Status"
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Move Name",
		gen: 8,
		pp: 10, // unboosted PP count
		priority: 0, // move priority, -6 -> 6
		flags: {}, // Move flags https://github.com/smogon/pokemon-showdown/blob/master/data/moves.js#L1-L27
		onTryMove() {
			this.attrLastMove('[still]'); // For custom animations
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Move Name 1', source);
			this.add('-anim', source, 'Move Name 2', source);
		}, // For custom animations
		secondary: {
			status: "tox",
			chance: 20,
		}, // secondary, set to null to not use one. Exact usage varies, check data/moves.js for examples
		target: "normal", // What does this move hit?
		// normal = the targeted foe, self = the user, allySide = your side (eg light screen), foeSide = the foe's side (eg spikes), all = the field (eg raindance). More can be found in data/moves.js
		type: "Water", // The move's type
		// Other useful things
		noPPBoosts: true, // add this to not boost the PP of a move, not needed for Z moves, dont include it otherwise
		isZ: "crystalname", // marks a move as a z move, list the crystal name inside
		zMove: {effect: ''}, // for status moves, what happens when this is used as a Z move? check data/moves.js for examples
		zMove: {boost: {atk: 2}}, // for status moves, stat boost given when used as a z move
		critRatio: 2, // The higher the number (above 1) the higher the ratio, lowering it lowers the crit ratio
		drain: [1, 2], // recover first num / second num % of the damage dealt
		heal: [1, 2], // recover first num / second num % of the target's HP
	},
	*/
	// Tao
	taiji: {
		name: "Taiji",
		shortDesc: "User focuses, then hits last at varying power.",
		desc: "User focuses, then moves last. If the user is not damaged by an attacking move while focusing, this move always results in a critical hit and forces the target to recharge. If the user is targeted by an attacking move while focusing, this move will hit first at halved power.",
		basePower: 80,
		category: "Physical",
		accuracy: true,
		gen: 9,
		priority: -8,
		flags: {contact: 1, protect: 1, punch: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
		pp: 5,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Detect', source);
			this.add('-anim', source, 'Force Palm', target);
		},
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('taiji');
		},
		onModifyMove(move, pokemon) {
			if (!pokemon.volatiles['taiji']?.damaged) {
				move.willCrit = true;
				move.onHit = function (foe) {
					foe.addVolatile('mustrecharge');
				};
			} 
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['taiji']?.damaged) return true;
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Taiji', '[silent]');
				this.add('-anim', pokemon, 'Laser Focus', pokemon);
				this.add('-message', `${pokemon.name} tightened their focus!`);
			},
			onFoeBeforeMovePriority: 6,
			onFoeBeforeMove(attacker, defender, move) {
				if (
					attacker !== defender &&
					move.category !== 'Status' &&
					this.actions.getDamage(attacker, defender, move)
				) {
					const moveTemp = this.dex.moves.get('taiji');
					const moveMod = {
						move: moveTemp.name,
						id: moveTemp.id,
						basePower: moveTemp.basePower / 2,
						pp: moveTemp.pp,
						maxpp: moveTemp.pp,
						target: moveTemp.target,
						disabled: false,
						used: false,
					};
					this.queue.prioritizeAction(this.queue.resolveAction({
						choice: 'move',
						pokemon: defender,
						move: moveMod,
						targetLoc: defender.getLocOf(attacker),
					})[0] as MoveAction);
					this.effectState.damaged = true;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Taiji', '[silent]');
			},
		},
		secondary: null,
		type: "Fighting",
		target: "normal",
	},
	wuji: {
		name: "Wuji",
		basePower: 80,
		category: "Physical",
		accuracy: true,
		gen: 9,
		priority: -8,
		flags: {contact: 1, protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
		pp: 5,
		secondary: null,
		type: "Fighting",
		target: "normal",
	},
	// Mink
	toxicdeluge: {
		name: "Toxic Deluge",
		basePower: 40,
		category: "Special",
		gen: 9,
		priority: 0,
		flags: {},
		accuracy: true,
		pp: 1,
		desc: "Combines Dark in its type effectiveness. Hits one additional time for each teammate inflicted with poison or toxic. Each hit has a 100% chance to poison regardless of typing. If the target is already poisoned, the target is inflicted with toxic instead.",
		shortDesc: "Hits for each poisoned ally. 100%: Poisons targets.",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Barb Barrage', source);
			this.add('-anim', source, 'Acid Downpour', target);
		},
		onModifyMove(move, pokemon) {
			let c = 0;
			for (const target of pokemon.side.pokemon) {
				if (target.status === 'psn' || target.status === 'tox') {
					c++;
				}
			}
			if (c <= 0) return;
			move.multihit = c;
		},
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Dark', type);
		},
		onHit(target, source, move) {
			if (!target.status || !['psn', 'tox'].includes(target.status)) {
				target.setStatus('psn');
			} else if (target.status === 'psn') {
				target.setStatus('tox');
			}
		},
		secondary: null,
		type: "Poison",
		target: "allAdjacent",
	},
	// Mink
	transfusetoxin: {
		name: "Transfuse Toxin",
		basePower: 0,
		category: "Status",
		gen: 9,
		priority: 0,
		flags: {},
		accuracy: 95,
		pp: 5,
		desc: "Badly poisons the foe, always starting at the third stage, regardless of its typing. Replaces existing status conditions. The user is then inflicted with Curse if the attack is successful.",
		shortDesc: "Very badly poisons the target. User becomes cursed.",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Sludge Wave', target);
			this.add('-anim', source, 'Strength Sap', target);
		},
		onHit(target, source, move) {
			target.setStatus('tox', source, move);
		},
		onAfterMove(pokemon) {
			this.add('-anim', pokemon, 'Night Shade', pokemon);
			pokemon.addVolatile('curse');
		},
		// Stage advancement handled in ../../../conditions.ts
		secondary: null,
		type: "Dark",
		target: "normal",
	},
	// Genus
	starpull: {
		name: "Star Pull",
		basePower: 0,
		category: "Status",
		gen: 9,
		priority: 6,
		flags: {},
		accuracy: true,
		pp: 64,
		noPPBoosts: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Confuse Ray', source);
		},
		onHit(pokemon) {
			let starPool = [
				1, 1, 1, 1, 1, // 33.3%
				2, 2, 2, 2, // 26.6%
				3, 3, 3, // 20.0%
				4, 4, // 13.3%
				5 // 6.6%
			];
			let pullPool = [];
			let highRoll = 0;
			for (let i = 0; i < 10; i++) {
				switch (this.sample(starPool)) {
					case 1:
						pullPool.push(this.sample(Dex.species.all().filter(p => !pullPool.includes(p) && !p.isNonstandard && p.bst <= 200)));
						if (highRoll < 1) highRoll = 1;
						break;
					case 2:
						pullPool.push(this.sample(Dex.species.all().filter(p => !pullPool.includes(p) && !p.isNonstandard && p.bst <= 300 && p.bst >= 201)));
						if (highRoll < 2) highRoll = 2;
						break;
					case 3:
						pullPool.push(this.sample(Dex.species.all().filter(p => !pullPool.includes(p) && !p.isNonstandard && p.bst <= 400 && p.bst >= 301)));
						if (highRoll < 3) highRoll = 3;
						break;
					case 4:
						pullPool.push(this.sample(Dex.species.all().filter(p => !pullPool.includes(p) && !p.isNonstandard && p.bst <= 500 && p.bst >= 401)));
						if (highRoll < 4) highRoll = 4;
						break;
					case 5:
						pullPool.push(this.sample(Dex.species.all().filter(p => !pullPool.includes(p) && !p.isNonstandard && p.bst <= 600 && p.bst >= 501)));
						if (highRoll < 5) highRoll = 5;
						break;
				}
			}
			if (!pullPool || !pullPool.length) return false;
			pullPool.sort((a, b) => a.bst - b.bst);
			for (const pulledPokemon of pullPool) {
				pokemon.formeChange(pulledPokemon);
			}
			this.add('-message', `${highRoll} Star Pull!`);
			this.add('-message', `${pokemon.name} transformed into ${pokemon.species.name}!`);
		},
		secondary: null,
		type: "???",
		target: "self",
	},
	// Morax
	planetbefall: {
		accuracy: true,
		basePower: 250,
		category: "Physical",
		name: "Planet Befall",
		gen: 9,
		pp: 1,
		isZ: 'hadeansoil',
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Draco Meteor', target);
			this.add('-anim', source, 'Continental Crush', target);
		},
		volatileStatus: 'planetbefall',
		onHit(target, source, move) {
			const sourceSide = source.side;
			sourceSide.addSideCondition('jadeshield');
		},
		condition: {
			onStart(pokemon) {
				pokemon.volatiles['planetbefall'].turns = 0;
				this.add('-start', pokemon, 'Planet Befall', '[silent]');
				this.add('-message', `${pokemon.name} was petrified!`);
				if (!pokemon.hasType('Rock') && pokemon.addType('Rock')) this.add('-start', pokemon, 'typeadd', 'Rock', '[from] move: Planet Befall');
			},
			onResidual(pokemon) {
				this.add('-message', `${pokemon.name} is petrified!`);
				pokemon.volatiles['planetbefall'].turns++;
			},
			onTryMove(attacker, defender, move) {
				if (attacker.volatiles['planetbefall'].turns <= 0) {
					this.add('-message', `${attacker.name} couldn't move!`);
					return false;
				}
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap(true);
			},
			onDamagingHit(damage, target, source, move) {
				if (target === source || !move || target.volatiles['planetbefall'].turns <= 0) return;
				target.removeVolatile('planetbefall');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Planet Befall', '[silent]');
				this.add('-message', `${pokemon.name} snapped out of it!`);
			},
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	dominuslapidis: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dominus Lapidis",
		shortDesc: "Summons Jade Shield. Always goes last.",
		desc: "User focuses, then summons Jade Shield for 5 turns after the opponent moves.",
		gen: 9,
		pp: 5,
		priority: -8,
		flags: {},
		sideCondition: 'jadeshield',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Work Up', source);
			this.add('-anim', source, 'Aqua Ring', source);
		},
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('dominuslapidis');
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Dominus Lapidis', '[silent]');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Ground",
	},
	// Morax
	// Visuals Only
	jadeshield: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Jade Shield",
		shortDesc: "Summons Jade Shield. Always goes last.",
		desc: "User focuses, then summons Jade Shield for 5 turns after the opponent moves.",
		gen: 9,
		pp: 5,
		priority: -8,
		flags: {},
		sideCondition: 'jadeshield',
		condition: {
			onSideStart(side, source) {
				this.add('-sidestart', side, 'Jade Shield', source);
				this.effectState.hp = Math.floor(source.maxhp * 0.33);
			},
			onResidual(pokemon) {
				this.add('-anim', pokemon, 'Aqua Ring', pokemon);
			},
			onTryPrimaryHit(target, source, move) {
				let originalDamage = this.actions.getDamage(source, target, move);
				if (target === source || move.infiltrates) return;
				if (!this.dex.getImmunity(move.type, 'Ground')) {
					this.add('-immune', target);
					return null;
				} else {
					move.onEffectiveness = function () {
						return this.dex.getEffectiveness(move.type, 'Ground');
					};
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) return damage;
				if (damage > target.side.sideConditions['jadeshield'].hp) {
					originalDamage -= target.side.sideConditions['jadeshield'].hp as number;
					target.side.sideConditions['jadeshield'].hp = 0;
					this.damage(originalDamage, target, source, move);
				} else {
					target.side.sideConditions['jadeshield'].hp -= damage;
				}
				source.lastDamage = damage;
				if (target.side.sideConditions['jadeshield'].hp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.side.removeSideCondition('jadeshield');
				} else {
					this.add('-activate', target, 'move: Jade Shield', '[damage]');
				}
				if (move.recoil || move.id === 'chloroblast') this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				if (move.drain) this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				let resSource = target.side.pokemon.filter(ally => ally.name === 'Morax')[0];
				if (resSource) {
					const resWave = {
						move: 'Mud-Slap',
						id: 'mudslap',
						basePower: 40,
						pp: 10,
						maxpp: 25,
						target: 'normal',
						disabled: false,
						used: false,
					};
					let resDamage = this.actions.getDamage(resSource, source, resWave);
					if (resDamage) {
						this.add('-anim', target, 'Power Gem', source);
						this.damage(resDamage, source, resSource, this.effect);
					}
				}
				return this.HIT_SUBSTITUTE;
			},
			onSideEnd(side) {
				this.add('-sideend', side, 'Jade Shield');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Ground",
	},
	// Varnava
	ecosystemdrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ecosystem Drain",
		shortDesc: "Heals; Boosts power next turn; Grassy Terrain.",
		desc: "Heals the user, and boosts the power of the user's attacks next turn, by an amount dependent on the current Zygarde form. Complete: 25% Heal/Boost; 50%: 50% Heal/Boost; 10%: 25% Heal/Boost. Clears any active weather conditions, if present, and sets Grassy Terrain.",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {reflectable: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Rototiller', source);
			this.add('-anim', source, 'Geomancy', source);
		},
		onHit(pokemon) {
			switch (pokemon.species.id) {
				case 'zygardecomplete':
					this.heal(pokemon.maxhp / 4);
					pokemon.abilityState.boostMod = 1.25;
					break;
				case 'zygarde':
					this.heal(pokemon.maxhp / 2);
					pokemon.abilityState.boostMod = 1.5;
					break;
				case 'zygarde10':
					this.heal(pokemon.maxhp / 1.33);
					pokemon.abilityState.boostMod = 1.75;
					break;
			}
			this.field.clearWeather();
			this.field.setTerrain('grassyterrain');
		},
		volatileStatus: 'ecosystemdrain',
		condition: {
			duration: 2,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Ecosystem Drain', '[silent]');
			},
			onBasePower(basePower, source, target, move) {
				if (source.abilityState.boostMod) {
					this.add('-anim', source, 'Absorb', source);
					return this.chainModify(boostMod);
				}
			},
			onAfterMove(pokemon) {
				pokemon.abilityState.boostMod = false;
			},
			onEnd(pokemon) {
				if (pokemon.abilityState.boostMod) pokemon.abilityState.boostMod = false;
				this.add('-end', pokemon, 'Ecosystem Drain', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Grass",
	},
	southernislandslastdefense: {
		accuracy: true,
		basePower: 300,
		category: "Physical",
		name: "Southern Island's Last Defense",
		shortDesc: "See '/ssb Varnava' for more!",
		desc: "Fails if user has any remaining healthy allies, or if user has more than 1/4 of its max HP remaining. Transforms into Zygarde-Complete before attacking. Ignores weaknesses and resistances. Damage is calculated using the lower of the opposing Pokemon's two defense stats. If the opposing Pokemon is not knocked out by this attack, the user faints after damage is dealt. If the opposing Pokemon is knocked out by this attack, starts Endure lasting until the end of next turn.",
		gen: 9,
		pp: 1,
		priority: 6,
		flags: {bypasssub: 1},
		ignoreImmunity: true,
		breaksProtect: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			const remainingPokemon = source.side.pokemon.filter(pokemon => !pokemon.fainted);
			if (remainingPokemon.length > 1 || source.hp > source.maxhp / 4) return false;
			source.formeChange('Zygarde-Complete');
			this.add('-anim', source, 'Core Enforcer', target);
			this.add('-anim', source, 'Supersonic Skystrike', target);
		},
		onEffectiveness(typeMod, target, type) {
			return 0;
		},
		onAfterMove(pokemon, target, move) {
			if (!target.side.faintedThisTurn) {
				pokemon.faint();
				return;
			} else if (target.side.faintedThisTurn) {
				if (!pokemon.volatiles['endure']) pokemon.addVolatile('endure');
				pokemon.volatiles['endure'].duration = 2;
			}
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	// Aevum
	genesisray: {
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Genesis Ray",
		desc: "Traps the target in Genesis Ray, dealing a second hit with double damage if the target uses a contact move or switches, then ending.",
		shortDesc: "Traps the target in Genesis Ray.",
		gen: 9,
		pp: 10,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Terrain Pulse', target);
		},
		onHit(target, source, move) {
			this.add('-message', `${target.name} was encased by Genesis Ray!`);
		},
		onDamage(damage, target, source, effect) {
			target.abilityState.grDamage = damage * 2;
		},
		volatileStatus: 'genesisray',
		condition: {
			duration: 2,
			onTryMove(pokemon, target, move) {
				if (move.flags['contact']) {
					this.add('-anim', pokemon, 'Terrain Pulse', pokemon);
					this.damage(pokemon.abilityState.grDamage, pokemon);
					this.add('-message', `${pokemon.name} was assaulted by Genesis Ray!`);
					pokemon.removeVolatile('genesisray');
				}
			},
			onSwitchOut(pokemon) {
				this.add('-anim', pokemon, 'Terrain Pulse', pokemon);
				this.damage(pokemon.abilityState.grDamage, pokemon);
				this.add('-message', `${pokemon.name} was assaulted by Genesis Ray!`);
				pokemon.removeVolatile('genesisray');
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	// Aevum
	temporalterrain: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Temporal Terrain",
		desc: "Traps all Pokemon. Forces all Pokemon to switch upon ending. If a Pokemon uses Freezing Glare during Temporal Terrain, it becomes Roar of Time and hits 2 turns later.",
		shortDesc: "Traps; Forces Pokemon to switch. Freezing Glare -> Roar of Time.",
		pp: 10,
		priority: 0,
		flags: {nonsky: 1, metronome: 1},
		terrain: 'temporalterrain',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Temporal Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Temporal Terrain');
				}
			},
			onTryMove(source, target, move) {
				if (move.id === 'freezingglare') {
					if (!target.side.addSlotCondition(target, 'futuremove')) return false;
					Object.assign(target.side.slotConditions[target.position]['futuremove'], {
						move: 'roaroftime',
						source: source,
						moveData: {
							id: 'roaroftime',
							name: "Roar of Time",
							accuracy: 90,
							basePower: 150,
							category: "Special",
							priority: 0,
							flags: {recharge: 1, metronome: 1, futuremove: 1},
							ignoreImmunity: false,
							effectType: 'Move',
							type: 'Dragon',
						},
					});
					this.add('-anim', target, 'Cosmic Power', target)
					this.add('-message', `Freezing Glare was consumed by the Temporal Terrain!`);
					this.add('-start', source, 'move: Roar of Time', '[silent]');
					return this.NOT_FAIL;
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'roaroftime' && move.flags['futuremove']) {
					this.add('-anim', pokemon, 'Cosmic Power', pokemon);
					this.add('-anim', pokemon, 'Roar of Time', target);
					this.add('-message', `Freezing Glare was unleashed from Temporal Terrain as Roar of Time!`);
				}
			},
			onHit(target, source, move) {
				if (move.id === 'roaroftime' && move.flags['futuremove']) {
					this.add('-fieldend', 'move: Temporal Terrain', '[silent]');
					for (const pokemon of this.getAllActive()) {
						pokemon.forceSwitchFlag = true;
					}
				}
			},
			onTrapPokemon() {
				for (const pokemon of this.getAllActive()) {
					pokemon.tryTrap();
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Temporal Terrain', '[silent]');
				for (const pokemon of this.getAllActive()) {
					pokemon.forceSwitchFlag = true;
				}
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
	},
	// Ace - Attack Card
	attack: {
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Attack",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// Suika Ibuki
	demi: {
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		desc: "Infiltrates and forces foe to use Substitue.",
		shortDesc: "Infiltrates and substitutes foe.",
		name: "Demi",
		gen: 9,
		pp: 5,
		priority: 0,
		flags: {bypasssub: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Shadow Ball', target);
		},
		onHit(target, source, move) {
			if (!target.volatiles['substitute'] && target.hp > target.maxhp / 4) {
				this.directDamage(target.maxhp / 4, target);
				target.addVolatile('substitute');
			}
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	// Jack
	transientcrimsonblizzard: {
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		name: "Transient Crimson Blizzard",
		pp: 1,
		noPPBoosts: true,
		priority: 1,
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Torch Song', source);
			this.add('-anim', source, 'Inferno', source);
			this.add('-anim', source, 'Sacred Sword', target);
		},
		onModifyMove(move, pokemon) {
			if (move.hit === 1) move.type = 'Fire';
			if (move.hit === 2) move.type = 'Ice';
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			for (const ally of pokemon.side.pokemon) {
				if (ally === pokemon || ally.fainted) continue;
				ally.abilityState.tcbCritBoost = true;
			}
			pokemon.faint();
			this.add('-message', `${pokemon.name}'s allies are now more likely to land critical hits!`);
		},
		flags: {reflectable: 1, protect: 1, mirror: 1},
		secondary: null,
		multihit: 2,
		type: "Fire",
		target: "normal",
	},
	// Jack
	piercinggleam: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Piercing Gleam",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Pyro Ball', target);
		},
		onHit(target, source, move) {
			if (target.newlySwitched) {
				this.boost({def: -2}, target, source, move);
			} else {
				this.boost({def: -1}, target, source, move);
			}
			source.abilityState.gleamBoost = true;
		},
		flags: {reflectable: 1, protect: 1, mirror: 1},
		secondary: null,
		type: "Fire",
		target: "normal",
	},
	// Jack
	reflexiveslash: {
		accuracy: true,
		basePower: 60,
		category: "Physical",
		name: "Reflexive Slash",
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Fire Lash', target);
		},
		flags: {slicing: 1, protect: 1},
		secondary: null,
		type: "Fire",
		target: "normal",
	},
	// Journeyman
	newbeginnings: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User fully restores HP, status conditions, and the PP of it's moves, loses all moves and items obtained through Love of the Journey, and switches to an ally of choice. 30% chance to fail. Usually goes last.",
		shortDesc: "Restores HP/Status/PP, loses moves/items, switches.",
		name: "New Beginnings",
		pp: 1,
		noPPBoosts: true,
		priority: -1,
		flags: {},
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Synthesis', source);
			this.add('-anim', source, 'Celebrate', source);
		},
		onHit(target, source, move) {
			if (this.randomChance(7, 10)) {
				this.add(`raw|It is never too late for <b>New Beginnings</b>!<br>Good luck, ${source.name}!`);
				this.heal(source.maxhp, source);
				source.cureStatus();
				for (const moveSlot of source.moveSlots) {
					let moveid = moveSlot.id;
					if (source.moves.indexOf(moveid) > 3) {
						this.add('-message', `${source.name} forgot ${moveSlot.move}!`);
						delete source.moveSlots[source.moves.indexOf(moveid)];
						delete source.baseMoveSlots[source.moves.indexOf(moveid)];
						delete source.moves[moveid];
					} else {
						moveSlot.pp = moveSlot.maxpp;
					}
				}
				if (source.item === 'colossuscarrier') source.abilityState.carrierItems = [];
			} else {
				this.add('-anim', source, 'Wake-Up Slap', source);
				const ally = this.sample(source.side.pokemon);
				if (ally === source) {
					this.add('-message', `${source.name} found the motivation to keep going!`);
				} else {
					this.add('-message', `Wait! ${ally.name} encouraged ${source.name} to keep fighting!`);
				}
				this.add('-anim', source, 'Work Up', source);
				source.hp += source.hp / 3;
				this.boost({spe: 1}, source);
				this.add('-message', `That's the spirit, ${source.name}!`);
				move.selfSwitch = false;
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Grass",
	},
	// Codie
	Cascade: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Randomly selects and uses a supereffective Special move learned by an ally, if present. Otherwise, uses a random Special move learned by an ally. Fails if the user has no allies with Special attacking moves. 30% chance to change the target's typing to match the type of the move selected. Can only be used once per switch-in.",
		shortDesc: "Uses supereffective move learned by ally. Breaks protection. Once per switch.",
		name: "Cascade",
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Aurora Beam', source);
			this.add('-anim', source, 'Geomancy', source);
			let SEMoves = [];
			let otherMoves = [];
			for (const ally of source.side.pokemon) {
				if (ally === source) continue;
				for (const moveSlot of ally.moveSlots) {
					const moveid = moveSlot.id;
					const movedata = this.dex.moves.get(moveid);
					if (movedata.category === 'Special' && target.runEffectiveness(movedata) > 0) {
						SEMoves.push(moveid);
					} else {
						if (movedata.category === 'Special') otherMoves.push(moveid);
					}
				}
			}
			if (!SEMoves.length && !otherMoves.length) return null;
			let randomMove;
			if (SEMoves.length) {
				randomMove = this.sample(SEMoves);
			} else {
				randomMove = this.sample(otherMoves);
			}
			this.actions.useMove(randomMove, source, target);
			if (this.randomChance(3, 10)) {
				target.setType(this.dex.moves.get(randomMove).type);
				this.add('-start', target, 'typechange', this.dex.moves.get(randomMove).type);
			}
		},
		onHit(target, source, move) {
			source.abilityState.cascaded = true;
		},
		secondary: null,
		target: "normal",
		type: "???",
	},
	// Sakuya Izayoi
	misdirection: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Existing future moves are redirected towards foe and land immediately. User switches afterwards.",
		shortDesc: "Redirects future moves to foe. User switches.",
		name: "Misdirection",
		pp: 1,
		priority: -5,
		flags: {},
		onTryHit() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Floral Healing', source);
			this.add('-anim', source, 'Future Sight', source);
		},
		onHit(pokemon) {
			let success = false;
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			for (const activePokemon of this.getAllActive()) {
				if (!activePokemon.side.slotConditions[activePokemon.position]['futuremove']) continue;
				const move = this.dex.getActiveMove(activePokemon.side.slotConditions[activePokemon.position]['futuremove'].move);
				const dmg = this.actions.getDamage(pokemon, activePokemon, move);
				delete activePokemon.side.slotConditions[activePokemon.position]['futuremove'];
				if (move === 'doomdesire') {
					this.add('-anim', activePokemon, 'Steel Beam', target);
				} else {
					this.add('-anim', activePokemon, move.name, target);
				}
				this.damage(dmg, target, pokemon, move);
				success = true;
			}
			if (success) this.add('-message', `${target.name} was assaulted with all active future moves!`);
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	// Sakuya Izayoi
	killingdoll: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User creates a substitute. Any damage it takes is dealt to foe.",
		shortDesc: "Creates a substitute that damages the foe.",
		name: "Killing Doll",
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hex', target);
		},
		onHit(target, source, move) {
			this.directDamage(target.maxhp / 4, target);
		},
		onTryHit(source) {
			if (source.volatiles['killingdoll']) {
				this.add('-fail', source, 'move: Killing Doll');
				return this.NOT_FAIL;
			}
			if (source.hp <= source.maxhp / 4 || source.maxhp === 1) {
				this.add('-fail', source, 'move: Killing Doll', '[weak]');
				return this.NOT_FAIL;
			}
		},
		volatileStatus: 'killingdoll',
		condition: {
			onStart(pokemon) {
				pokemon.abilityState.dollhp = Math.floor(pokemon.maxhp / 4);
				this.add('-message', `${pokemon.name} summoned a Killing Doll!`);
				if (pokemon.volatiles['partiallytrapped']) {
					this.add('-end', pokemon, pokemon.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete pokemon.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub'] || move.infiltrates) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				this.add('-anim', target, 'Spectral Thief', source);
				this.damage(damage, source, target, 'move: Killing Doll');
				if (damage > target.abilityState.dollhp) {
					damage = target.abilityState.dollhp as number;
				}
				target.abilityState.dollhp -= damage;
				source.lastDamage = damage;
				if (target.abilityState.dollhp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.removeVolatile('killingdoll');
					target.abilityState.dollhp = 0;
				} else {
					this.add('-activate', target, 'move: Killing Doll', '[damage]');
				}
				if (move.recoil || move.id === 'chloroblast') {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(0, source, target, 'drain');
				}
				return this.HIT_SUBSTITUTE;
			},
			onResidual(pokemon) {
				if (pokemon.abilityState.dollhp > 0) {
					this.add('-anim', pokemon, 'Hex', pokemon);
					this.add('-message', `Killing Doll haunts the battlefield!`);
				} else if (!pokemon.abilityState.dollhp || pokemon.abilityState.dollhp <= 0) {
					this.add('-end', pokemon, 'Killing Doll', '[silent]');
					pokemon.removeVolatile('killingdoll');
					this.add('-anim', pokemon, 'Confuse Ray', pokemon);
					this.add('-message', `The Killing Doll vanished!`);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Killing Doll', '[silent]');
				this.add('-anim', target, 'Confuse Ray', target);
				this.add('-message', `The Killing Doll vanished!`);
			},
		},
		secondary: null,
		target: "self",
		type: "Dark",
	},
	// Emerl
	awakenedmode: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User fully restores HP and status conditions, starts Ingrain, and raises all stats by 1 stage (except acc/eva). User's item is replaced with Leftovers. This move is replaced with Gigaton Hammer. If this Pokemon learns U-turn, it is replaced with Bug Buzz.",
		shortDesc: "100% HP; Ingrain; +1 Stats; Leftovers/Gigaton Hammer/Bug Buzz.",
		name: "Awakened Mode",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {heal: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Extreme Evoboost', target);
		},
		onHit(pokemon) {
			this.heal(pokemon.maxhp);
			pokemon.cureStatus();
			pokemon.setItem('Leftovers');
			const AMIndex = pokemon.moves.indexOf('awakenedmode');
			const UTIndex = pokemon.moves.indexOf('uturn');
			const GT = this.dex.moves.get('gigatonhammer');
			const GTF = {
				move: GT.name,
				id: GT.id,
				pp: GT.pp,
				maxpp: GT.pp,
				target: GT.target,
				disabled: false,
				used: false,
			};
			const BB = this.dex.moves.get('bugbuzz');
			const BBF = {
				move: BB.name,
				id: BB.id,
				pp: BB.pp,
				maxpp: BB.pp,
				target: BB.target,
				disabled: false,
				used: false,
			};
			pokemon.moveSlots[AMIndex] = GTF;
			pokemon.moveSlots[UTIndex] = BBF;
		},
		volatileStatus: 'ingrain',
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	// Zeeb
	slingshot: {
		accuracy: true,
		basePower: 20,
		category: "Physical",
		name: "Slingshot",
		pp: 24,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		secondary: null,
		type: "Normal",
		target: "normal",
	},
	// Zeeb
	superknuckleshuffle: {
		accuracy: 90,
		basePower: 10,
		category: "Physical",
		name: "Super-Knuckle Shuffle",
		pp: 24,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, contact: 1},
		secondary: null,
		multihit: [3, 4],
		target: "normal",
		type: "Normal",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Celebrate', source);
			this.add('-anim', source, 'Geomancy', source);
		},
		basePowerCallback(pokemon, target, move) {
			let power;
			switch (move.hit) {
				case 1:
					power = 10;
					this.add('-anim', pokemon, 'Headbutt', target);
					break;
				case 2:
					power = 20;
					this.add('-anim', pokemon, 'Rock Tomb', pokemon);
					this.add('-anim', pokemon, 'Headbutt', target);
					break;
				case 3:
					power = 40;
					this.add('-anim', pokemon, 'Shift Gear', pokemon);
					this.add('-anim', pokemon, 'Headbutt', target);
					break;
				case 4:
					power = 80;
					this.add('-anim', pokemon, 'Eruption', pokemon);
					this.add('-anim', pokemon, 'Headbutt', target);
					break;
			}
			return power;
		},
		onHit(target, source, move) {
			if (this.randomChance(1, 10)) source.addVolatile('confusion');
		},
		onEffectiveness(typeMod, target, type, move) {
			let typing;
			switch (move.hit) {
				case 1:
					typing = 'Normal';
					break;
				case 2:
					typing = 'Rock';
					break;
				case 3:
					typing = 'Steel';
					break;
				case 4:
					typing = 'Fire';
					break;
			}
			if (typing && typing !== 'Normal') return typeMod + this.dex.getEffectiveness(typing, type);
		},
	},
	// Shifu Robot
	turbocharge: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Turbocharge",
		pp: 1,
		noPPBoosts: true,
		priority: 6,
		flags: {},
		secondary: null,
		target: "self",
		type: "Electric",
		volatileStatus: 'turbocharge',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Thunder', source);
			this.add('-anim', source, 'Agility', source);
		},
		onHit(pokemon) {
			pokemon.abilityState.stacks = Math.floor((pokemon.hp - 1) / (pokemon.maxhp / 10));
			this.damage(pokemon.hp - 1, pokemon, pokemon, this.effect);
			pokemon.addVolatile('turbocharge');
			pokemon.addVolatile('protect');
			this.add('-message', `Level ${pokemon.abilityState.stacks} Turbocharge!`);
			pokemon.abilityState.permdis = true;
		},
		condition: {
			duration: 9,
			onModifySpa(spa, pokemon) {
				if (pokemon.abilityState.stacks <= 0) return;
				this.debug(`turbocharge boosting spa by ${1 + (0.1 * pokemon.abilityState.stacks)}`);
				this.add('-message', `SPA BOOST: ${1+(0.1*pokemon.abilityState.stacks)}`);
				return this.chainModify(1+(0.1*pokemon.abilityState.stacks));
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.abilityState.stacks <= 0) return;
				this.debug(`turbocharge boosting spe by ${1 + (0.1 * pokemon.abilityState.stacks)}`);
				this.add('-message', `SPA BOOST: ${1+(0.1*pokemon.abilityState.stacks)}`);
				return this.chainModify(1+(0.1*pokemon.abilityState.stacks));
			},
			onTryHeal(damage, target, source, effect) {
				if ((effect?.id === 'zpower') || this.effectState.isZ) return damage;
				return false;
			},
			onResidual(pokemon) {
				pokemon.abilityState.stacks--;
				if (pokemon.abilityState.stacks <= 0) {
					pokemon.abilityState.stacks = 0;
					this.add('-message', `${pokemon.name}'s turbocharge wore off!`);
					pokemon.removeVolatile('turbocharge');
					return;
				}
				this.add('-anim', pokemon, 'Discharge', pokemon);
				this.add('-message', `${pokemon.name} is turbocharged!`);
			},
			onSwitchOut(pokemon) {
				pokemon.abilityState.stacks = 0;
				pokemon.removeVolatile('turbocharge');
			},
		},
	},
	// Luminous
	rainbowmaxifier: {
		accuracy: 85,
		basePower: 80,
		category: "Special",
		name: "Rainbow Maxifier",
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		drain: [1, 2],
		secondaries: [
			{
				chance: 30,
				status: 'brn',
			}, {
				chance: 30,
				boosts: {
					atk: -1,
					spa: -1,
				},
			},
		],
		target: "normal",
		type: "Water",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Tri Attack', target);
			this.add('-anim', source, 'Aurora Beam', target);
		},
		onModifyType(move, pokemon) {
			if (pokemon.species.id === 'necrozmaultra') {
				move.type = 'Light';
			} else {
				move.type = 'Water';
			}
		},
		onEffectiveness(typeMod, target, type, move) {
			if (move.type === 'Water') return typeMod + this.dex.getEffectiveness('Fire', type);
		},
		onHit(target, source, move) {
			source.side.addSideCondition('waterpledge');
		},
	},
	// Luminous
	polaris: {
		accuracy: 100,
		basePower: 170,
		category: "Special",
		name: "Polaris",
		pp: 1,
		isZ: "spectralprism",
		priority: 0,
		flags: {protect: 1, bypasssub: 1},
		status: 'brn',
		target: "normal",
		type: "Light",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Light That Burns the Sky', target);
			this.add('-anim', source, 'Flash', target);
		},
		onAfterMove(pokemon, target, move) {
			if (pokemon.species.id === 'necrozma') changeSet(this, pokemon, ssbSets['Luminous-N'], true);
		},
	},
	// Fblthp
	bouncybubble: {
		inherit: true,
		basePower: 90,
	},
	// Fblthp
	blowandgo: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Blow and Go",
		desc: "Lowers target's Atk, Sp. Atk by 1, starts Aqua Ring on the target, changes the target's type to Water, then user switches to an ally of choice.",
		shortDesc: "Parting Shot + Soak; Starts Aqua Ring on target.",
		pp: 5,
		priority: 1,
		flags: {reflectable: 1, mirror: 1, protect: 1},
		selfSwitch: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Bubble Beam', target);
			this.add('-anim', source, 'Dive', source);
		},
		onHit(target, source, move) {
			this.boost({atk: -1, spa: -1}, target, source, this.effect);
			if (target.setType('Water')) this.add('-start', target, 'typechange', 'Water');
			target.addVolatile('aquaring');
		},
		secondary: null,
		target: "normal",
		type: "Water",
	},
	// Faust
	thehousealwayswins: {
		name: "The House Always Wins",
		category: "Physical",
		basePower: 60,
		accuracy: 100,
		pp: 1,
		priority: 1,
		flags: {bypasssub: 1},
		target: "normal",
		type: "Dark",
		isZ: "crossroadsblues",
		stealsBoosts: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', source);
      },
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + (20 * pokemon.positiveBoosts());
			this.debug('BP: ' + bp);
			return bp;
		},
		onHit(target, source, move) {
			source.clearBoosts();
			source.abilityState.wagerStacks = 0;
			this.heal(source.baseMaxhp, source);
			changeSet(this, source, ssbSets['Croupier'], true);
		},
	},
	// Faust
	faustianbargain: {
		name: "Faustian Bargain",
		category: "Status",
		accuracy: 100,
		basePower: 0,
		pp: 8,
		noPPBoosts: true,
		priority: 1,
		flags: {protect: 1, reflectable: 1, mirror: 1},
		target: "normal",
		type: "Dark",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hex', source);
			this.add('-anim', source, 'Coaching', source);
      },
		onHit(target, source, move) {

			let stat: BoostID;
			const myRoll = this.random(3, 18);
			const yourRoll = this.random(2, 12);
			this.add('-message', `${source.name} rolled a ${myRoll}!`);
			this.add('-message', `${target.name} rolled a ${yourRoll}!`);

			for (stat in source.boosts) {
				if (stat === 'accuracy' || stat === 'evasion') continue;
				if (source.boosts[stat] <= 0) {
					let boost: SparseBoostsTable = {};
					boost[stat] = 1 - source.boosts[stat];
					this.boost(boost, source);
				}
			}

			if (myRoll > yourRoll) {
				for (stat in source.boosts) {
					if (source.boosts[stat] > 0) {
						let boost: SparseBoostsTable = {};
						boost[stat] = source.boosts[stat];
						this.boost(boost, source);
					}
				}
				this.damage(target.hp / 2, target);

			} else {
				for (stat in source.boosts) {
					if (source.boosts[stat] > 0) {
						let boost: SparseBoostsTable = {};
						boost[stat] = source.boosts[stat];
						this.boost(boost, target);
					}
				}
				source.clearBoosts();
				this.add('-copyboost', target, source, '[from] move: Faustian Bargain');
			}
		},
	},
	// Faust
	kniffel: {
		name: "Kniffel",
		category: "Physical",
		accuracy: 100,
		basePower: 40,
		pp: 64,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1},
		target: "normal",
		type: "Dark",
		ignoreImmunity: true,
		ignoreDefensive: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Coaching', source);
      },
		onModifyMove(move, pokemon) {
			let rollCount = 0;
			for (let total = 0; total < 6; total++) {
				total--;
				let roll = this.random(1, 6);
				this.add('-anim', pokemon, 'Wish', pokemon);
				this.add('-message', `${source.name} rolled a ${roll}!`);
				total += roll;
				rollCount++;
			}
			move.multihit = rollCount;
		},
		onEffectiveness() {
			return 0;
		},
	},
	// Croupier
	allin: {
		name: "All In",
		category: "Special",
		accuracy: 100,
		basePower: 1,
		pp: 1,
		priority: 0,
		flags: {},
		target: "normal",
		type: "Ghost",
		isZ: "staufensdie",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		basePowerCallback(pokemon, target, move) {
			this.add('-anim', pokemon, 'Celebrate', pokemon);
			this.add('-anim', pokemon, 'Pay Day', pokemon);
			this.add('-anim', target, 'Pay Day', target);

			const myRoll = this.random(3, 18);
			const yourRoll = this.random(3, 18);

			this.add('-message', `${pokemon.name} rolled a ${myRoll}!`);
			this.add('-message', `${target.name} rolled a ${yourRoll}!`);

			if (myRoll >= yourRoll) {
				this.add('-message', `Better luck next time!`);
				pokemon.abilityState.wagerStacks *= 3;
				if (pokemon.abilityState.wagerStacks > 18) pokemon.abilityState.wagerStacks = 18;
				this.add('-anim', pokemon, 'Celebrate', pokemon);
				this.add('-anim', pokemon, 'Shadow Ball', target);
				this.effectState.forcingSwitch = true;
				return 120;
			} else {
				this.add('-message', `Can't win 'em all!`);
				this.add('-anim', pokemon, 'Splash', pokemon);
				for (let i = 0; i < pokemon.abilityState.wagerStacks; i++) {
					const stats: BoostID[] = [];
					let stat: BoostID;
					for (stat in target.boosts) {
						if (target.boosts[stat] < 6) {
							stats.push(stat);
						}
					}
					if (stats.length) {
						const randomStat = this.sample(stats);
						const boost: SparseBoostsTable = {};
						boost[randomStat] = 2;
						this.boost(boost, target);
					}
				}
				this.add('-message', `${target.name} received ${pokemon.abilityState.wagerStacks} boosts for each of ${pokemon.name}'s ${pokemon.abilityState.wagerStacks} wager stacks!`);
				this.add('-message', `${pokemon.name} lost their wager!`);
				pokemon.abilityState.wagerStacks = 0;
				return 0;
			}
		},
		onHit(target, source, move) {
			if (this.effectState.forcingSwitch) target.forceSwitchFlag = true;
		},
	},
	// Croupier
	rollthedice: {
		name: "Roll the Dice",
		category: "Special",
		accuracy: 100,
		basePower: 1,
		pp: 64,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		target: "normal",
		type: "Ghost",
		ignoreImmunity: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Wish', source);
			this.add('-anim', source, 'Celebrate', source);
      },
		basePowerCallback(pokemon, target, move) {
			const roll = this.random(1, 6);
			this.add('-message', `${pokemon.name} rolled a ${roll}!`);
			this.add('-message', `${pokemon.name} scored ${roll} wager stacks!`);
			pokemon.abilityState.wagerStacks += roll;
			switch (roll) {
				case 1:
					const stats: BoostID[] = [];
					let stat: BoostID;
					for (stat in target.boosts) {
						if (target.boosts[stat] < 6) {
							stats.push(stat);
						}
					}
					if (stats.length) {
						const randomStat = this.sample(stats);
						const boost: SparseBoostsTable = {};
						boost[randomStat] = 1;
						this.boost(boost, target);
					}
					return 1;
				case 2:
					return 40;
				case 3:
					return 60;
				case 4:
					return 80;
				case 5:
					return 100;
				case 6:
					pokemon.abilityState.wagerStacks = 0;
					this.heal(pokemon.baseMaxhp, pokemon);
					this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, pokemon);
					pokemon.abilityState.luckySix = true;
					changeSet(this, pokemon, ssbSets['Faust'], true);
					return 80;
			}
		},
		onEffectiveness() {
			return 0;
		},
	},
	// Croupier
	tapout: {
		name: "Tap Out",
		category: "Status",
		accuracy: 100,
		basePower: 0,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {reflectable: 1, protect: 1},
		target: "normal",
		type: "Ghost",
		selfSwitch: true,
		ignoreImmunity: true,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Belly Drum', source);
      },
		onHit(target, source, move) {
			source.abilityState.wagerStacks++;
			this.add('-message', `${source.name} saved a wager stack!`);
			target.addVolatile('taunt');
			target.addVolatile('torment');
		},
	},
	// Flufi
	shocktherapy: {
      name: "Shock Therapy",
      category: "Special",
		desc: "Heals a selected ally for 1/10 of their max HP after damage is dealt. 30% chance to flinch. 30% chance to paralyze the target. Fails if the user has no healthy teammates remaining.",
		shortDesc: "Heals chosen ally; 30% chance to paralyze/flinch.",
      basePower: 70,
      accuracy: 95,
      pp: 15,
      priority: 0,
		selfSwitch: true,
      flags: {protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Splash', source);
			this.add('-anim', source, 'Zing Zap', target);
      },
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		self: {
			slotCondition: 'shocktherapy',
		},
		condition: {
			duration: 1,
			// Implemented in ../scripts.ts
		},
		secondaries: [
			{
				chance: 30,
				volatileStatus: 'flinch',
			}, {
				chance: 30,
				status: 'par',
			},
		],
      target: "normal",
      type: "Electric",
   },
	// Quetzalcoatl
	bigthunder: {
		accuracy: true,
		basePower: 0,
		category: "Special",
		desc: "Hits once for each healthy Pokemon in the battle, both allies and foes. Each hit hits a random active or inactive Pokemon on either side.",
		shortDesc: "Hits a random active/inactive Pokemon with each hit.",
		name: "Big Thunder",
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onTryHit(target, source, move) {
			this.add('-anim', source, 'Hurricane', source);
			this.add('-anim', source, 'Thunder', target);
		},
		onHit(target, source, move) {
			let allPokemon = [];
			// Gather all possible targets into an array
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.hasType('Ground') || ['lightningrod', 'voltabsorb'].includes(pokemon.ability)) continue;
				if (pokemon.fainted || pokemon.hp <= 0) continue;
				pokemon.abilityState.btDmg = 0;
				allPokemon.push(pokemon);
			}
			if (!allPokemon.length) return null;
			// Randomly assign the damage amongst all possible targets
			for (let i = 0; i <= this.getAllPokemon().length; i++) {
				this.sample(allPokemon).abilityState.btDmg += 20;
			}
			// Execute damage
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.abilityState.btDmg) {
					// If the target is Quetzalcoatl (Peal of Thunder) immune + heal
					if (pokemon.ability === 'pealofthunder') {
						if (pokemon.isActive) {
							this.heal(pokemon.maxhp / 3, pokemon, pokemon, this.effect);
						} else {
							pokemon.hp += pokemon.maxhp / 3;
							this.add('-heal', pokemon, pokemon.getHealth, this.effect);
						}
						continue;
					}
					const nMove = {
						move: move.name,
						id: move.id,
						basePower: pokemon.abilityState.btDmg,
						pp: move.pp,
						maxpp: move.pp,
						target: move.target,
						disabled: false,
						used: false,
					};
					const dmg = this.actions.getDamage(source, pokemon, nMove);
					if (!dmg) {
						this.add('-immune', pokemon);
						continue;
					}
					if (pokemon.isActive) {
						this.damage(dmg, pokemon, source, this.effect);
						continue;
					} else {
						pokemon.hp -= dmg;
						if (pokemon.hp < 0) pokemon.hp = 0;
						this.add('-message', `${pokemon.name} took ${Math.round(dmg/pokemon.baseMaxhp * 100)}% from ${nMove.move}!`);
						continue;
					}
				}
			}
		},
		onAfterMoveSecondarySelf() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.abilityState.btDmg = 0;
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	// Cyclommatic Cell
	galvanicweb: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Galvanic Web",
		desc: "Sets Galvanic Web on the opposing side of the field. On switch-in, Pokemon get -1 Speed and are damaged based on their weakness/resistance vs Electric. Lasts 3 turns, then paralyzes the opposing active Pokemon upon ending.",
		shortDesc: "Damages/Lowers Speed; Lasts 3 turns, then paralyzes.",
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {protect: 1, reflectable: 1, mirror: 1, metronome: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Ion Deluge', source);
			this.add('-anim', source, 'Electroweb', target);
		},
		sideCondition: 'galvanicweb',
		condition: {
			duration: 3,
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Galvanic Web');
			},
			onEntryHazard(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Galvanic Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position], this.dex.getActiveMove('galvanicweb'));
				switch (this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('galvanicweb')), -6, 6)) {
					case 2:
						this.damage(pokemon.baseMaxhp / 2, pokemon);
						break;
					case 1:
						this.damage(pokemon.baseMaxhp / 4, pokemon);
						break;
					case 0:
						this.damage(pokemon.baseMaxhp / 8, pokemon);
						break;
					case -1:
						this.damage(pokemon.baseMaxhp / 16, pokemon);
						break;
					case -2:
						this.damage(pokemon.baseMaxhp / 32, pokemon);
						break;
				}
			},
			onResidual(pokemon) {
				this.add('-anim', pokemon, 'Thunder Cage', pokemon);
				this.add('-message', `Galvanic Web electrifies the battlefield!`);
			},
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Galvanic Web');
				for (const pokemon of side.active) {
					pokemon.trySetStatus('par');
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Electric",
	},
	// Morte
	omenofdefeat: {
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		name: "Omen of Defeat",
		shortDesc: "Endures, then hits after opponent. Mimikyu: Transforms.",
		pp: 16,
		noPPBoosts: true,
		priority: -8,
		flags: {contact: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hex', source);
			this.add('-anim', source, 'Spectral Thief', target);
		},
		priorityChargeCallback(pokemon) {
			if (pokemon.species.id !== 'mimikyubusted') pokemon.addVolatile('omenofdefeat');
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Omen of Defeat');
				this.add('-anim', pokemon, 'Confuse Ray', pokemon);
				this.add('-message', `${pokemon.name} prepared for defeat!`);
			},
			onDamage(damage, target, source, effect) {
				if (effect?.effectType === 'Move' && damage >= target.hp) {
					this.add('-activate', target, 'move: Omen of Defeat');
					return target.hp - 1;
				}
			},
			onEnd(pokemon) {
				if (pokemon.species.id === 'mimikyu') {
					const targetSide = pokemon.side.foe.active[0].side;
					pokemon.formeChange('Mimikyu-Busted');
					pokemon.abilityState.dollDur = 3;
					pokemon.hp = pokemon.baseMaxhp;
					this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
					targetSide.addSideCondition('Cursed Doll', pokemon);
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// Marisa Kirisame
	orbshield: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Creates a substitute without sacrificing HP. At the end of the same turn it is used, the substitute vanishes and deals damage equal to its current HP. Cannot be used twice in a row.",
		shortDesc: "Creates a substitute that damages end of turn; no twice in a row.",
		name: "Orb Shield",
		pp: 5,
		priority: 4,
		flags: {cantusetwice: 1, snatch: 1},
		volatileStatus: 'orbshield',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Defense Curl', source);
			this.add('-anim', source, 'Protect', source);
		},
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-start', target, 'Orb Shield');
				target.abilityState.orbHp = Math.floor(target.maxhp / 4);
				if (target.volatiles['partiallytrapped']) {
					this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete target.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub'] || move.infiltrates || !target.abilityState.orbHp) return;
				const damage = this.actions.getDamage(source, target, move);
				if (!damage) {
					this.add('-message', `${target.name} was protected by Orb Shield!`);
					return null;
				}
				if (damage < target.abilityState.orbHp) {
					target.abilityState.orbHp -= damage;
					this.add('-activate', target, 'move: Orb Shield', '[damage]');
				} else if (damage >= target.abilityState.orbHp) {
					target.abilityState.orbHp = 0;
					target.removeVolatile('orbshield');
					this.add('-message', `${target.name}'s Orb Shield broke!`);
				}
				if (move.recoil || move.id === 'chloroblast') this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				if (move.drain) this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				return null;
			},
			onEnd(pokemon) {
				const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
				if (pokemon.abilityState.orbHp) this.damage(pokemon.abilityState.orbHp, target, pokemon);
				this.add('-end', pokemon, 'Orb Shield');
				pokemon.abilityState.orbHp = 0;
			},
		},
		secondary: null,
		target: "self",
		type: "Fairy",
	},
	// Sanae Kochiya
	miracle: {
		accuracy: true,
		basePower: 80,
		category: "Special",
		desc: "Summons a random weather condition, uses either Wish, Assist, Baton Pass, Aqua Ring, Reflect, Light Screen, Assist, Recycle, Laser Focus or Safeguard. Changes type to match weather condition.",
		shortDesc: "Summons random weather/status move. Typing matches weather.",
		name: "Miracle",
		gen: 9,
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Core Enforcer', target);
		},
		onHit(target, source, move) {
			// Random Weather
			let w = this.random(5);
			if (w === 0) this.field.setWeather('sunnyday');
			if (w === 1) this.field.setWeather('raindance');
			if (w === 2) this.field.setWeather('sandstorm');
			if (w === 3) this.field.setWeather('snowscape');

			// Random Status Move
			let r = this.random(9);
			if (r === 0) source.addVolatile('laserfocus', source);
			if (r === 1) source.side.addSlotCondition(source, 'Wish');
			if (r === 2) {
				// Assist
				const moves = [];
				for (const pokemon of source.side.pokemon) {
					if (pokemon === source) continue;
					for (const moveSlot of pokemon.moveSlots) {
						const moveid = moveSlot.id;
						const move = this.dex.moves.get(moveid);
						if (move.flags['noassist'] || move.isZ || move.isMax) {
							continue;
						}
						moves.push(moveid);
					}
				}
				let randomMove = '';
				if (moves.length) randomMove = this.sample(moves);
				if (!randomMove) {
					return false;
				}
				this.actions.useMove(randomMove, source);
			}
			if (r === 3) this.actions.useMove('Baton Pass', source);
			if (r === 4) source.addVolatile('aquaring', source);
			if (r === 5) source.side.addSideCondition('reflect', source);
			if (r === 6) source.side.addSideCondition('lightscreen', source);
			if (r === 7) {
				// Recycle
				if (source.item || !source.lastItem) return false;
				const item = source.lastItem;
				source.lastItem = '';
				this.add('-item', source, this.dex.items.get(item), '[from] move: Recycle');
				source.setItem(item);
			}
			if (r === 8) source.side.addSideCondition('safeguard', source);
			if (r === 9) source.side.addSideCondition('tailwind', source);
		},
		onModifyType(move, pokemon) {
			// Type Changing
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snow':
				move.type = 'Ice';
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	// Prince Smurf
	youfilthypeasant: {
      accuracy: 100,
      basePower: 0,
      category: "Status",
      shortDesc: "Target becomes Normal-type/Gains Normalize; Torments target.",
      desc: "Ignores Abilities; Makes the target Normal type and changes their ability to Normalize. Torments them. Cannot be used two turns in a row.",
      name: "You Filthy Peasant",
      pp: 15,
		noPPBoosts: true,
      priority: 0,
      flags: {protect: 1, mirror: 1, metronome: 1, cantusetwice: 1},
      ignoreAbility: true,
      volatileStatus: 'torment',
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
         this.add('-anim', source, "Hyper Voice", target);
			this.add('-anim', source, "Taunt", target);
      },
      onTryHit(target) {
         if (target.getAbility().flags['cantsuppress'] || target.ability === 'normalize' || target.ability === 'truant') return false;
      },
      onHit(target, pokemon) {
         if (target.getTypes().join() === 'Normal' || !target.setType('Normal')) {
            this.add('-fail', target);
            return null;
         }
         const oldAbility = target.setAbility('normalize');
         if (oldAbility) {
            this.add('-ability', target, 'Normalize', '[from] move: You Filthy Peasant');
         }
         this.add('-start', target, 'typechange', 'Normal');
			pokemon.abilityState.turnLastUsed = this.turn;
         return oldAbility as false | null;
      },
		onDisableMove(pokemon) {
			if (this.turn - pokemon.abilityState.turnLastUsed < 5) pokemon.disableMove('youfilthypeasant');
		},
		secondary: null,
   	target: "normal",
      type: "Normal",
   },
	// Kozuchi
	emergencyupgrades: {
      name: "Emergency Upgrades",
      category: "Status",
      basePower: 0,
      accuracy: true,
      pp: 1,
      priority: 0,
      flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Rock Polish', source);
			this.add('-anim', source, 'Swords Dance', source);
		},
      volatileStatus: 'emergencyupgrades',
      condition: {
         duration: 5,
         onStart(pokemon) {
            this.add('-start', pokemon, 'Move: Emergency Upgrades');
				this.add('-message', `${pokemon.name} made emergency upgrades!`);
         },
			onResidual(pokemon) {
				if (this.effectState.duration === 2) this.add('-message', `${pokemon.name}'s emergency upgrades wore off!`);
			},
         onBasePower(basePower, pokemon, target) {
            if (this.effectState.duration >= 3) return this.chainModify(2);
            if (this.effectState.duration < 3) return this.chainModify(0.5);
         },
      },
      isZ: "forgedhammer",
      target: "self",
      type: "Steel",
   },
	// Kozuchi
	weaponenhancement: {
		accuracy: true,
		basepower: 0,
		category: "Status",
		name: "Weapon Enhancement",
		pp: 3,
		noPPBoosts: true,
		priority: 0,
		flags: {snatch: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Hone Claws', source);
			this.add('-anim', source, 'Splash', source);
		},
		onHit(pokemon) {
			if (!pokemon.abilityState.enhancement) pokemon.abilityState.enhancement = 0;
			if (pokemon.abilityState.enhancement >= 3) {
				this.add('-message', `${pokemon.name}'s weapon is already at maximum enhancement!`);
				return;
			}
			if (pokemon.abilityState.enhancement < 3) {
				pokemon.abilityState.enhancement +=1;
				this.add('-message', `${pokemon.name} is strengthening their weapon!`);
			}
		},
		secondary: null,
		target: "self",
		type: "Steel",	
	},
	// Urabrask
	terrorizethepeaks: {
		accuracy: 80,
		basePower: 100,
		category: "Special",
		desc: "Hits the opposing Pokemon and one random inactive Pokemon on the opposing side.",
		shortDesc: "Hits a random inactive opposing Pokemon.",
		name: "Terrorize the Peaks",
		gen: 9,
		pp: 8,
		noPPBoosts: true,
		priority: 0,
		flags: {},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Roar', target);
			this.add('-anim', source, 'Eruption', target);
		},
		onHit(target, source, move) {
			let possibleTargets = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				if (pokemon.hp) possibleTargets.push(pokemon);
			}
			if (!possibleTargets || !possibleTargets.length) return null;
			const newTarget = this.sample(possibleTargets);
			let dmg = this.actions.getDamage(source, newTarget, move);
			if (!dmg) {
				this.add('-message', `${newTarget.name} was unaffected by Terrorize the Peaks!`);
				return;
			}
			if (dmg > newTarget.hp) dmg = newTarget.hp;
			newTarget.hp -= dmg;
			this.add('-message', `${newTarget.name} took ${Math.round(dmg/newTarget.baseMaxhp * 100)}% from Terrorize the Peaks!`);
			if (newTarget.hp <= 0) {
				newTarget.faint();
				return;
			}
			if (this.randomChance(1, 5)) {
				newTarget.status === 'brn';
				newTarget.setStatus('brn', source);
				this.add('-message', `${newTarget.name} was burned!`);
			}
			return;
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Urabrask
	blasphemousact: {
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		desc: "Steals 1/10-to-1/3 max HP from all allies with at least 1/3 max HP remaining. This Pokemon recovers HP equal to the stolen HP. This move's power is equal to (HP Stolen / 1.5). 30% chance to burn each Pokemon hit, replacing existing status conditions.",
		shortDesc: "All foes: 30% burn. Steals allies' HP to determine power.",
		name: "Blasphemous Act",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {contact: 1},
		breaksProtect: true,
		isZ: "braidoffire",
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Inferno', source);
			this.add('-anim', source, 'G-Max Fireball', target);
		},
		basePowerCallback(pokemon, target, move) {
			this.effectState.totaldrain = 0;
			for (const ally of pokemon.side.pokemon) {
				if (ally === pokemon) continue;
				if (ally.hp <= ally.baseMaxhp / 3) continue;
				let dmg = ally.baseMaxhp / this.random(3, 10);
				ally.hp -= dmg;
				this.effectState.totaldrain += dmg;
			}
			if (!this.effectState.totaldrain) return false;
			this.heal(this.effectState.totaldrain, pokemon, pokemon, move);
			return this.effectState.totaldrain / 1.5;
		},
		onAfterHit(target, source) {
			for (const pokemon of target.side.pokemon) {
				if (pokemon.fainted || pokemon.hp <= 0) continue;
				if (this.randomChance(3, 10)) pokemon.setStatus('brn', source);
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Sariel
	civilizationofmagic: {
		accuracy: 100,
		basePower: 95,
		category: "Special",
		desc: "Target's Special Attack is used in damage calculation.",
		shortDesc: "Uses foe's SpA.",
		name: "Civilization of Magic",
		gen: 9,
		pp: 24,
		noPPBoosts: true,
		priority: 0,
		flags: {mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Dazzling Gleam', target);
		},
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	// Mima
	reincarnation: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "User fully restores HP and status condition and resets boosts before permanently transforming into foe.",
		shortDesc: "Full restore & boost reset; transformation.",
		name: "Reincarnation",
		gen: 9,
		pp: 1,
		priority: 0,
		flags: {defrost: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Revival Blessing', source);
		},
		onHit(target, pokemon) {
			pokemon.clearBoosts();
			pokemon.cureStatus();
			let move: Move | ActiveMove | null = pokemon.lastMove;
			changeSet(this, pokemon, ssbSets[target.name]);
			this.heal(pokemon.baseMaxhp, pokemon, pokemon, move);
		},
		isZ: "crescentstaff",
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	// Mima
	completedarkness: {
		accuracy: 100,
		basePower: 90,
		category: "Special",
		desc: "The target's positive stat changes are stolen and applied to the user before dealing damage.",
		shortDesc: "Steals target's boosts before dealing damage.",
		name: "Complete Darkness",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {bypasssub: 1, mirror: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Spectral Thief', target);
		},
		stealsBoosts: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	// Gizmo
	coinclash: {
		accuracy: 80,
		basePower: 30,
		category: "Physical",
		name: "Coin Clash",
		desc: "Hits 4-5 times. Flings coin at target after use. 50% chance to gain +2 crit ratio and 1.25x evasion until switch/faint. Fails if not holding Inconspicuous Coin.",
		shortDesc: "See '/ssb Gizmo' for more!",
		pp: 5,
		flags: {contact: 1},
		onTryMove(pokemon, target, move) {
			this.attrLastMove('[still]');
			if (!pokemon.item) {
				this.add('-anim', pokemon, 'Splash', pokemon);
				this.add('-message', `${pokemon.name} couldn't find their coin!`);
				return false;
			}
		},
		onPrepareHit(target, source) {
			if (!source.item) return;
			this.add('-anim', source, 'Magnetic Flux', source);
			this.add('-anim', source, 'Pay Day', target);
		},
		onAfterMove(source, target, move) {
			if (!source.item) return;
			this.add('-message', `${source.name} hurled the Inconspicuous Coin at ${target.name}!`);
			this.damage(target.maxhp / this.random(6, 10), target, source);
			source.addVolatile('coinclash');
			source.abilityState.recallActive = true;
			if (this.randomChance(1, 2)) {
				this.add('-message', `Hey! The coin landed on heads!`);
				this.add('-message', `${source.name} is fired up!`);
				this.heal(source.maxhp / this.random(4, 8));
				source.abilityState.firedUp = true;
			}
		},
		condition: {
			duration: 2,
			onStart(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Coin Clash');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
			},
			onEnd(pokemon) {
				if (pokemon.item || pokemon.name !== 'Gizmo') return;
				pokemon.setItem('inconspicuouscoin');
				this.add('-item', pokemon, pokemon.getItem(), '[from] item: Inconspicuous Coin');
				pokemon.abilityState.recallActive = false;
			},
		},
		multihit: [3, 5],
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	// Glint
	gigameld: {
		accuracy: true,
		basePower: 65,
		category: "Physical",
		name: "GigaMeld",
		pp: 5,
		noPPBoosts: true,
		flags: {contact: 1, protect: 1},
		ignoreImmunity: true,
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('gigameld');
		},
		onPrepareHit(target, source) {
			this.add('-anim', pokemon, 'Swagger', target);
			this.add('-anim', pokemon, 'Flame Charge', target);
		},
		onHit(target, source, move) {
			const lstats = ['atk', 'def', 'spa', 'spd', 'spe'];
			const rstats = ['atk', 'def', 'spd', 'spe'];
			const loweredStat = this.sample(lstats);
			const raisedStat = this.sample(rstats);
			
			if (!source.addType(target.getTypes()[0])) return false;
			if (!target.addType('Steel')) return false;
			this.add('-start', target, 'typeadd', 'Steel', '[from] move: GigaMeld');
			this.add('-start', source, 'typeadd', target.getTypes()[0], '[from] move: GigaMeld');
			target.storedStats[loweredStat] -= 50;
			source.storedStats[raisedStat] += 50;
			this.add('-message', `${target.name}'s ${loweredStat.toUpperCase()} was decreased to ${target.storedStats[loweredStat]} by ${move.name}!`);
			this.add('-message', `${source.name}'s ${raisedStat.toUpperCase()} was increased to ${source.storedStats[raisedStat]} by ${move.name}!`);
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: GigaMeld');
				this.add('-anim', pokemon, 'Work Up', pokemon);
				this.add('-message', `${pokemon.name} is preparing to meld!`);
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	megametronome: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mega Metronome",
		desc: "Uses two-to-five randomly selected moves.",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Geomancy', target);
			this.add('-anim', target, 'Metronome', target);
		},
		onHit(target, source, effect) {
			// Metronome
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			source.side.lastSelectedMove = this.toID(randomMove);
			this.actions.useMove(randomMove, target);

			// Check if metronome count exists, add 1 to it, then exit the function
			// unless mCount is more than or equal to 5
			if (!target.mCount) target.mCount = 0;
			target.mCount++;
			if (!target.mCount || target.mCount < 5) return;
			if (target.ftfActivated) return;

			// Replaces Mega Metronome with Fear the Finger if mCount >= 5
			const mmIndex = target.moves.indexOf('megametronome');
			if (mmIndex < 0) return;
			const ftf = {
				move: 'Fear the Finger',
				id: 'fearthefinger',
				pp: 1,
				maxpp: 1,
				target: 'normal',
				disabled: false,
				used: false,
			};
			target.moveSlots[mmIndex] = ftf;
			target.baseMoveSlots[mmIndex] = ftf;
			target.ftfActivated = true;
			this.add('-activate', target, 'move: Mega Metronome', 'Fear the Finger');
		},
		secondary: null,
		multihit: [2, 5],
		target: "self",
		type: "Normal",
	},
	// Finger
	fearthefinger: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fear the Finger",
		shortDesc: "Uses ten randomly selected moves. Breaks protection.",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', target, 'Springtide Storm', target);
		},
		onHit(target, source, effect) {
			// Metronome
			const moves = this.dex.moves.all().filter(move => (
				(![2, 4].includes(this.gen) || !source.moves.includes(move.id)) &&
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			for (let i = 0; i < 10; i++) {
				let randomMove = '';
				if (moves.length) {
					moves.sort((a, b) => a.num - b.num);
					randomMove = this.sample(moves).id;
				}
				if (!randomMove) return false;
				source.side.lastSelectedMove = this.toID(randomMove);
				this.actions.useMove(randomMove, target);
			}

			// Turns Fear the Finger back into Mega Metronome after use
			const ftfIndex = target.moves.indexOf('fearthefinger');
			if (ftfIndex < 0) return;
			const mm = {
				move: 'Mega Metronome',
				id: 'megametronome',
				pp: 8,
				maxpp: 8,
				target: 'self',
				disabled: false,
				used: false,
			};
			target.moveSlots[ftfIndex] = mm;
			target.baseMoveSlots[ftfIndex] = mm;
			this.add('-activate', target, 'move: Fear the Finger', 'Mega Metronome');
		},
		flags: {},
		breaksProtect: true,
		secondary: null,
		target: "self",
		type: "Dark",
	},
	// Pablo
	plagiarize: {
		accuracy: 100,
		basePower: 0,
		category: "Status",
		desc: "Replaces this move with target's last move. Lowers that move's PP to 0.",
		name: "Plagiarize",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		// Plagiarize
		onHit(target, source) {
			const move = target.lastMove;
			if (!move || source.moves.includes(move.id)) return false;
			if (move.isZ || move.isMax) return false;
			const plgIndex = source.moves.indexOf('plagiarize');
			if (plgIndex < 0) return false;

			source.moveSlots[plgIndex] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Plagiarize', move.name, '[silent]');
			this.add('-message', `${source.name} plagiarized ${target.name}'s ${move.name}!`);
		},
		// PP Nullification
		onTryHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			const ppDeducted = target.deductPP(move.id, 64);
			if (!ppDeducted) return false;
			this.add('-activate', target, 'move: Plagiarize', move.name, ppDeducted, '[silent]');
			this.add('-message', `${move.name}'s PP was nullified!`);
		},
		flags: {},
		target: "normal",
		type: "Normal",
	},
	// Pablo
	sketch: {
		num: 166,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sketch",
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {
			bypasssub: 1, allyanim: 1, failencore: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		}, 
		onHit(target, source, move) {
			const lmove = target.lastMove;
			source.addVolatile('sketch');
			if (source.transformed || !lmove || source.moves.includes(lmove.id)) return;
			if (lmove.flags['nosketch'] || lmove.isZ || lmove.isMax) return;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return;
			const sketchedMove = {
				move: lmove.name,
				id: lmove.id,
				pp: lmove.pp,
				maxpp: lmove.pp,
				target: lmove.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Sketch', lmove.name);
		},
		onAfterMove(pokemon, target, move) {
			pokemon.storedStats.atk = target.storedStats.atk;
			pokemon.storedStats.def = target.storedStats.def;
			pokemon.storedStats.spa = target.storedStats.spa;
			pokemon.storedStats.spd = target.storedStats.spd;
			pokemon.storedStats.spe = target.storedStats.spe;
			this.add('-message', `${pokemon.name} sketched ${target.name}'s base stats!`);
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Sketch', '[silent]');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Sketch', '[silent]');
			},
			onTryHit(pokemon, target, move) {
				if (['sketch', 'plagiarize'].includes(move.id)) return;
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, pokemon, target);
				this.add('-immune', pokemon, '[from] move: Sketch');
				return null;
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: {boost: {atk: 1, def: 1, spa: 1, spd: 1, spe: 1}},
		contestType: "Clever",
	},
	// Trey
	burstdelta: {
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "User heals equal to 1/3 of damage dealt and lowers target's Defense by 1 stage but this move cannot be used twice in a row.",
		shortDesc: "Heal 1/3 damage and lower Defense by 1 stage but can't use twice in a row.",
		name: "Burst Delta",
		gen: 9,
		pp: 5,
		noPPBoosts: true,
		priority: 1,
		flags: {mirror: 1, protect: 1, cantusetwice: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Aeroblast', target);
		},
		onDamagePriority: 22,
		onDamage(damage, target, source, effect) {
			if (target.volatiles['substitute'] || target.volatiles['killingdoll'] || target.volatiles['orbshield']) {
				this.damage(damage, target, source, effect); 
			}
		},
		drain: [1, 3],
		critRatio: 2,
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
				atk: -1,
				spa: -1,
			},
		},
		target: "normal",
		type: "Flying",
	},
	// Trey
	granddelta: {
		accuracy: true,
		basePower: 120,
		category: "Physical",
		desc: "Charges, then hits turn 2. If the user is targeted by an attacking move while charging, Grand Delta's base power is halved; If not attacked, always results in a critical hit. User recoves 100% of the damage dealt.",
		shortDesc: "Charges, then hits turn 2. Halved power if hit during charge; Guaranteed crit if not.",
		name: "Grand Delta",
		gen: 9,
		pp: 1,
		noPPBoosts: true,
		priority: -10,
		isZ: "yoichisbow",
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			// @ts-ignore
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			// @ts-ignore
			attacker.addVolatile('twoturnmove', defender);
			attacker.addVolatile('deltacharge');
			return null;
		},
		onPrepareHit(target, source, move) {
			this.add('-anim', source, 'Thousand Arrows', target);
			this.add('-anim', source, 'Heal Pulse', target);
		},
		onDamage(damage, target, source, effect) {
			if (target.volatiles['substitute'] || target.volatiles['killingdoll'] || target.volatiles['orbshield']) {
				this.damage(damage, target, source, effect); 
			}
			source.removeVolatile('deltacharge');
			target.side.addSideCondition('deltadrop');
		},
		drain: [1, 1],
		flags: {charge: 1},
		target: "normal",
		type: "Flying",
	},
	// Trey
	dynamitearrow: {
		accuracy: true,
		basePower: 50,
		category: "Physical",
		desc: "This move will connect one turn later.",
		shortDesc: "Lands 1 turn after.",
		name: "Dynamite Arrow",
		gen: 9,
		pp: 40,
		noPPBoosts: true,
		priority: 0,
		sideCondition: 'dynamitearrow',
		flags: {mirror: 1, protect: 1, futuremove: 1},
		condition: {
			duration: 2,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Dynamite Arrow', '[silent]');
			},
			onSideEnd(targetSide) {
				const pokemon = targetSide.active[0];
				if (pokemon.fainted || !pokemon.hp) {
					this.add('-sideend', targetSide, 'Dynamite Arrow', '[silent]');
					return;
				}
				this.add('-anim', pokemon, 'Thousand Arrows', pokemon);
				this.add('-anim', pokemon, 'Self-Destruct', pokemon);
				let sources = pokemon.side.foe.pokemon.filter(ally => ally.name === 'Trey');
				const source = sources[0];
				const move = this.dex.getActiveMove('dynamitearrow');
				const dmg = this.actions.getDamage(source, pokemon, move);
				this.damage(dmg, pokemon);
				this.boost({def: -1, spe: -1}, pokemon);
				this.add('-sideend', targetSide, 'Dynamite Arrow', '[silent]');
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	// Yukari Yakumo
	ranyakumo: {
		accuracy: true,
		basePower: 40,
		category: "Special",
		name: "Ran Yakumo",
		pp: 64,
		priority: 0,
		flags: {},
		overrideDefensiveStat: 'def',
		target: "normal",
		type: "???",
	},
	// Yukari Yakumo
	shikigamiran: {
		accuracy: true,
		basePower: 0,
		category: "Status",
		shortDdesc: "Damages foe every turn until switch/faint.",
		desc: "Damages the foe using Defense stat in calculation at the end of every turn until that Pokemon faints or another Pokemon is affected by this move.",
		name: "Shikigami Ran",
		pp: 40,
		noPPBoosts: true,
		priority: 0,
		flags: {bypasssub: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Glare', target);
		},
		onHit(target, source, move) {
			for (const foe of target.side.pokemon) {
				if (foe.abilityState.ran) foe.abilityState.ran = false;
			}
			target.addVolatile('shikigamiran');
			target.abilityState.ran = true;
		},
		condition: {
			onResidual(pokemon) {
				let sources = pokemon.side.foe.pokemon.filter(ally => ally.name === 'Yukari Yakumo');
				const source = sources[0];
				const move = this.dex.getActiveMove('ranyakumo');
				const dmg = this.actions.getDamage(source, pokemon, move);
				this.add('-anim', pokemon, 'Hex', pokemon);
				this.damage(dmg, pokemon, source, this.dex.conditions.get('Ran Yakumo'));
				this.add('-message', `${pokemon.name} was buffeted by Ran Yakumo!`);
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
	},
	// Aeri
	blissfulbreeze: {
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Blissful Breeze",
		gen: 9,
		pp: 16,
		noPPBoosts: true,
		priority: 0,
		flags: {futuremove: 1, protect: 1},
		onTryMove() {
			this.attrLastMove('[still]');
		},
		onPrepareHit(target, source) {
			this.add('-anim', source, 'Petal Dance', target);
		},
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Blissful Breeze');
			let success = false;
			const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		sideCondition: 'blissfulbreeze',
		condition: {
			duration: 3,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Blissful Breeze');
			},
			onResidual(pokemon) {
				let target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
				let source =  pokemon.side.foe.pokemon.filter(ally => ally.name === 'Aeri')[0];
				if (!source) source = target;
				const move = this.dex.getActiveMove('blissfulbreeze');
				const dmg = this.actions.getDamage(source, pokemon, move);
				this.add('-anim', pokemon, 'Gust', pokemon);
				this.damage(dmg, pokemon, source, this.dex.conditions.get('Blissful Breeze'));
				this.add('-message', `${pokemon.name} was buffeted by Blissful Breeze!`);
			},
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Blissful Breeze');
			},
		},
		secondary: null,
		target: "normal",
		type: "Flying",
	},
};
