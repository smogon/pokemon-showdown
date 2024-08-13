import {ssbSets} from "./random-teams";
import {changeSet, getName, enemyStaff, PSEUDO_WEATHERS} from "./scripts";

const STRONG_WEATHERS = ['desolateland', 'primordialsea', 'deltastream', 'deserteddunes', 'millenniumcastle'];

export const Abilities: {[k: string]: ModdedAbilityData} = {
	/*
	// Example
	abilityid: {
		shortDesc: "", // short description, shows up in /dt
		desc: "", // long description
		name: "Ability Name",
		// The bulk of an ability is not easily shown in an example since it varies
		// For more examples, see https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts
	},
	*/
	// Please keep abilites organized alphabetically based on staff member name!
	// Kaiser Dragon
	elementalshift: {
		desc: "This Pokemon becomes Fire/Grass/Water/Electric/Ice/Flying/Poison/Psychic/Fairy/Rock-type and sets the appropriate weather/terrain upon switching in.",
		shortDesc: "Random type and move upon switching in.",
		onStart(pokemon) {
			let r = this.random(10);
			if (r === 0) {
				this.add('-start', pokemon, 'typechange', 'Fire');
				pokemon.setType('Fire');
				this.actions.useMove('Sunny Day', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['willowisp', 'protect', 'magmastorm', 'firelash'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 1) {
				this.add('-start', pokemon, 'typechange', 'Grass');
				pokemon.setType('Grass');
				this.actions.useMove('Grassy Terrain', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['leechseed', 'protect', 'hornleech', 'gigadrain'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 2) {
				this.add('-start', pokemon, 'typechange', 'Water');
				pokemon.setType('Water');
				this.actions.useMove('Rain Dance', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['flipturn', 'hydrovortex', 'waterspout', 'aquatail'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 3) {
				this.add('-start', pokemon, 'typechange', 'Electric');
				pokemon.setType('Electric');
				this.actions.useMove('Electric Terrain', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['thunderwave', 'voltswitch', 'charge', 'doubleshock'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 4) {
				this.add('-start', pokemon, 'typechange', 'Ice');
				pokemon.setType('Ice');
				this.actions.useMove('Snowscape', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['auroraveil', 'freezyfrost', 'icespinner', 'blizzard'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 5) {
				this.add('-start', pokemon, 'typechange', 'Flying');
				pokemon.setType('Flying');
				this.actions.useMove('Tailwind', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['roost', 'defog', 'pluck', 'oblivionwing'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 6) {
				this.add('-start', pokemon, 'typechange', 'Poison');
				pokemon.setType('Poison');
				this.actions.useMove('Haze', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['toxic', 'protect', 'venoshock', 'barbbarrage'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 7) {
				this.add('-start', pokemon, 'typechange', 'Psychic');
				pokemon.setType('Psychic');
				this.actions.useMove('Psychic Terrain', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['lunardance', 'revivalblessing', 'futuresight', 'psychicfangs'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else if (r === 8) {
				this.add('-start', pokemon, 'typechange', 'Fairy');
				pokemon.setType('Fairy');
				this.actions.useMove('Misty Terrain', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['moonlight', 'protect', 'sparklyswirl', 'spiritbreak'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			} else {
				this.add('-start', pokemon, 'typechange', 'Rock');
				pokemon.setType('Rock');
				this.actions.useMove('Sandstorm', pokemon);
				for (let i = 0; i < 3; i++) {
					let moves = ['stealthrock', 'protect', 'saltcure', 'powergem'];
					const move = this.dex.moves.get(moves[i]);
					const newSlot = {
						move: move.name,
						id: move.id,
						pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
						target: move.target,
						disabled: false,
						used: false,
					};
					pokemon.moveSlots[i] = newSlot;
					pokemon.baseMoveSlots[i] = newSlot;
				}
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Elemental Shift",
		gen: 9,
	},
	// Shifu Robot
	autorepair: {
		name: "Auto Repair",
		gen: 9,
		// Handled in ../config/formats.ts
	},
	// Luminous
	blindinglight: {
		name: "Blinding Light",
		gen: 9,
		onSwitchIn(pokemon) {
			const target = pokemon.side.foe.active[0];
			this.add('-anim', pokemon, 'Flash', pokemon);
			target.addVolatile('blindinglight');
		},
		onModifyType(move, pokemon) {
			this.debug(`LOR typechange to Light-type`);
			if (move.id === 'lightofruin' && pokemon.species.id === 'necrozmaultra') move.type = 'Light';
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-message', `${pokemon.name} was struck by a blinding light!`);
				this.boost({accuracy: -6}, pokemon);
			},
			onEnd(pokemon) {
				this.add('-message', `The blinding light faded!`);
				this.boost({accuracy: 6}, pokemon);
			},
		},
	},
	// PokeKart
	chaindrift: {
		name: "Chain Drift",
		gen: 9,
		onDamagingHit(damage, target, source, move) {
			if (move && source !== target) target.abilityState.damagedThisTurn = true;
		},
		onResidual(pokemon) {
			if (!pokemon.abilityState.damagedThisTurn && pokemon.activeTurns) {
				this.add('-activate', pokemon, 'ability: Chain Drift');
				this.boost({spe: 1});
			}
			pokemon.abilityState.damagedThisTurn = false;
		},
		onAfterBoost(boost, target, source, effect) {
			if (boost.spe >= 0 && !source.activeTurns) {
				this.add('-activate', target, 'ability: Chain Drift');
				this.add('-message', `${target.name} is preparing to shift gears!`);
				this.boost({spe: -1}, target);
				target.addVolatile('chaindrift');
			}
		},
		condition: {
			duration: 2,
			onRestart(pokemon) {
				this.effectState.duration = 2;
				this.add('-start', pokemon, 'ability: Chain Drift', '[silent]');
			},
			onModifyCritRatio(critRatio) {
				return 5;
			},
		},
	},
	// Fblthp
	lostandfound: {
		name: "Lost and Found",
		gen: 9,
		onTryHit(target, source, move) {
			if (!target.abilityState.switches) target.abilityState.switches = 0;
			if (target === source || move.category === 'Status') return;
			if (target.abilityState.switches >= 3) return;
			target.abilityState.switches++;
			this.add('-activate', target, 'ability: Lost and Found');
			this.add('-message', `${target.name} scrambled away from danger!`);
			this.add('-anim', target, 'Dive', target);
			target.side.addSideCondition('lostandfound');
			target.forceSwitchFlag = true;
			return null;
		},
		condition: {
			onSwitchIn(pokemon) {
				const target = pokemon.side.foe.active[0];
				const dmg = this.actions.getDamage(target, pokemon, this.activeMove);
				this.add('-anim', target, this.activeMove.name, pokemon);
				this.damage(dmg, pokemon, target);
				pokemon.side.removeSideCondition('lostandfound');
			},
		},
	},
	// Faust
	thedevilisinthedetails: {
		name: "The Devil is in the Details",
		gen: 9,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				this.debug(`tdiitd priority boost`);
				return priority + 6;
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (this.queue.willMove(target)) {
				this.debug('tdiitd halving damage');
				return this.chainModify(0.5);
			}
		},
	},
	// Croupier
	fairplay: {
		name: "Fair Play",
		gen: 9,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				this.debug(`Fair Play priority boost`);
				return priority + 1;
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			const abilityHolder = this.effectState.target;
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			} else if ((source.isAlly(abilityHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', abilityHolder, 'ability: Fair Play', move, '[of] ' + target);
				return false;
			}
		},
	},
	// flufi
	forceofwill: {
		name: "Force of Will",
		gen: 9,
		onResidual(pokemon) {
			if (pokemon.activeTurns) this.add('-message', `${pokemon.name}'s determination is building!`);
		},
		onModifyAtk(atk, pokemon) {
			if (!pokemon.activeTurns) return;
			this.debug('Force of Will Atk Boost');
			return this.chainModify(1 + (0.33 * pokemon.activeTurns));
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect && effect.effectType === 'Move') {
				if (this.randomChance(target.side.totalFainted + 1, 10)) {
					this.add('-ability', target, 'Force of Will');
					return target.hp - this.random(1, 30);
				}
			}
		},
	},
	// Quetzalcoatl
	pealofthunder: {
		desc: "This Pokemon heals 1/3 of its max HP and gets +1 SpAtk/Spe if hit by an Electric-type move; Electric-type immunity. Upon switching in, a random active or inactive Pokemon is damaged (40 BP, Electric-type, Special)",
		shortDesc: "+1/3 HP/+1 SpA/Spe if hit by Electric; Hits random Pokemon on switch-in.",
		onStart(pokemon) {
			let possibleTargets = [];
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			for (const e of pokemon.side.pokemon) {
				if (e.hp) possibleTargets.push(e);
			}
			for (const e of target.side.pokemon) {
				if (e.hp) possibleTargets.push(e);
			}
			if (!possibleTargets) return null;
			this.add('-anim', pokemon, 'Thunderbolt', pokemon);
			this.add('-anim', pokemon, 'Thunderbolt', target);
			const newTarget = this.sample(possibleTargets);
			const move = this.dex.getActiveMove('thundershock');
			const dmg = this.actions.getDamage(pokemon, newTarget, move);
			if (!dmg) {
				this.add('-message', `${newTarget.name} was unaffected by Peal of Thunder!`);
				return;
			}
			this.add('-message', `${newTarget.name} was struck by Peal of Thunder!`);
			if (newTarget === target) {
				this.damage(dmg, target, pokemon);
				return;
			}
			if (newTarget === pokemon) {
	        if (!this.heal(pokemon.baseMaxhp / 3)) {
	            this.add('-immune', pokemon, '[from] ability: Peal of Thunder');
	        }
	        if (!this.boost({spa: 1, spe: 1})) {
	            this.add('-immune', pokemon, '[from] ability: Peal of Thunder');
	        }
	        return;
	    	}
			newTarget.hp -= dmg;
			this.add('-message', `${newTarget.name} lost ${Math.round(dmg/newTarget.baseMaxhp * 100)}% of its health!`);
			if (newTarget.hp <= 0) newTarget.faint();
		},
		onTryHit(target, source, move) {
			if (move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 3)) {
	            this.add('-immune', target, '[from] ability: Peal of Thunder');
	        	}
	        	if (!this.boost({spa: 1, spe: 1})) {
	            this.add('-immune', target, '[from] ability: Peal of Thunder');
	        	}
				return null;
			}
		},
		flags: {breakable: 1},
		name: "Peal of Thunder",
		gen: 9,
	},
	// Yukari Yakumo
	spiritingaway: {
		desc: "After using a move, this Pokemon switches to an ally of the user's choice. Sleep turns still burn while inactive.",
		shortDesc: "User switches after move; sleep turns burn while inactive.",
		onTryMove(pokemon, target, move) {
			if (move.id === 'futuresight') pokemon.abilityState.fsSwitch = true;
		},
		onAfterMoveSecondarySelf(source, target, move) {
			source.switchFlag = true;
		},
		onSwitchOut(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.abilityState.sleepBurn = true;
				pokemon.abilityState.ts = this.turn;
			}
		},
		onUpdate(pokemon) {
			if (pokemon.abilityState.fsSwitch) {
				pokemon.abilityState.fsSwitch = false;
				pokemon.switchFlag = true;
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.abilityState.sleepBurn && pokemon.status === 'slp') {
				const turnsBurned = this.turn - pokemon.abilityState.ts;
				pokemon.statusState.time -= turnsBurned;
				if (!pokemon.statusState.time || pokemon.statusState.time <= 0) pokemon.cureStatus();
				pokemon.abilityState.sleepBurn = false;
				pokemon.abilityState.ts = 0;
			}
		},
		flags: {},
		name: "Spiriting Away",
		gen: 9,
	},
	// Cylcommatic Cell
	batterylife: {
		name: "Battery Life",
		gen: 9,
		shortDesc: "See '/ssb Cyclommatic Cell' for more!",
		desc: "Look at discord pins man idk im not typing this shit",
		onStart(pokemon) {
			if (pokemon.abilityState.gauges === undefined) pokemon.abilityState.gauges = 5;
		},
		onBasePower(basePower, attacker, defender, move) {
			if (!attacker.abilityState.gauges || attacker.abilityState.gauges === undefined) attacker.abilityState.gauges = 0;
			return basePower - (10 * (5 - attacker.abilityState.gauges));
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				this.heal(target.baseMaxhp / 4);
				target.addVolatile('charge');
				if (!target.abilityState.gauges) target.abilityState.gauges = 0;
				target.abilityState.gauges++;
				this.add('-message', `${target.name} was charged up by ${move.name}!`);
				return null;
			}
		},
		onBeforeMove(pokemon, target, move) {
			// Use gauges for electric moves
			if (move.type === 'Electric') {
				if (pokemon.abilityState.gauges < 2) {
					this.debug("Not enough battery");
					this.add('-message', `${pokemon.name} doesn't have enough battery!`);
					return false;
				} else if (pokemon.abilityState.gauges >= 2) {
					pokemon.abilityState.gauges -= 2;
					this.add('-message', `${pokemon.name} used its battery to power up ${move.name}!`);
				}
			}
			// Use gauges for techno blast
			if (move.id === 'technoblast') {
				if (pokemon.abilityState.gauges < 3) {
					this.debug("Not enough battery");
					this.add('-message', `${pokemon.name} doesn't have enough battery!`);
					return false;
				} else if (pokemon.abilityState.gauges >= 3) {
					pokemon.abilityState.gauges -= 3;
					this.add('-message', `${pokemon.name} used its battery to power up ${move.name}!`);
				}
			}	
		},
		onResidual(pokemon) {
			// Recharge if out of battery
			if (pokemon.abilityState.gauges <= 0) {
				this.add(`-anim`, pokemon, "Splash");
				this.add('-activate', pokemon, 'ability: Battery Life');
				this.add('-message', `${pokemon.name} is out of battery!`);
				this.field.setTerrain('electricterrain');
				pokemon.addVolatile('mustrecharge');
			// Charge if at maximum battery
			} else if (pokemon.abilityState.gauges >= 5) {
				this.add(`-anim`, pokemon, "Charge");
				pokemon.addVolatile('charge');
				this.add('-message', `${pokemon.name} is at maximum charge!`);
			// Otherwise state charge amount
			} else {
				this.add(`-anim`, pokemon, "Charge");
				this.add('-message', `${pokemon.name} is at ${(pokemon.abilityState.gauges / 5) * 100}% battery!`);
			}
			// Add charge from sleep or terrain
			let totalCharge = 0;
			if (pokemon.status === 'slp') totalCharge++;
			if (this.field.isTerrain('electricterrain')) totalCharge++;
			if (totalCharge > 0 && pokemon.abilityState.gauges < 5) {
				this.add('-activate', pokemon, 'ability: Battery Life');
				pokemon.abilityState.gauges += totalCharge;
				if (pokemon.abilityState.gauges > 5) pokemon.abilityState.gauges = 5;
				if (totalCharge === 1) {
					this.add('-message', `${pokemon.name} is charging up!`);
				}
				if (totalCharge > 1) {
					this.add('-message', `${pokemon.name} is charging rapidly!`);
				}
			}
		},
	},
	// Morte
	curseddoll: {
		name: "Cursed Doll",
		gen: 9,
		desc: "Field condition for Morte. Not an obtainable ability.",
		sideCondition: 'curseddoll',
		condition: {
			duration: 5,
			onSideStart(side) {
				this.add('-sidestart', side, 'ability: Cursed Doll');
			},
			onModifyDef(def, pokemon) {
				return this.chainModify(0.7);
			},
			onModifySpd(spd, pokemon) {
				return this.chainModify(0.7);
			},
			onSideEnd(side) {
				this.add('-sideend', side, 'ability: Cursed Doll');
			},
		},
	},
	// Morte
	dollkeeper: {
		name: "Dollkeeper",
		gen: 9,
		onStart(pokemon) {
			if (!pokemon.abilityState.duration) return;
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (pokemon.species.id === 'mimikyu' && pokemon.abilityState.duration > 0) {
				pokemon.abilityState.transform = true;
			}
		},
		onUpdate(pokemon) {
			// Function for transforming between doll and regular forme. Just use `pokemon.abilityState.transform = true` to trigger transformation.
			// Automatically transforms once abilityState is set; transform is set back to false after transforming automatically.
			// No need to manually set it back to false each time we set abilityState.transform to true.
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (pokemon.name === 'Morte' && pokemon.species.id === 'mimikyu' && pokemon.abilityState.transform) {
				this.add('-ability', pokemon, 'Dollkeeper');
				pokemon.formeChange('Mimikyu-Busted');
				this.heal(pokemon.baseMaxhp, pokemon);
				if (!pokemon.abilityState.duration) pokemon.abilityState.duration = 5;
				target.side.addSideCondition('curseddoll');
				pokemon.abilityState.transform = false;
				this.add('-message', `${pokemon.abilityState.duration}`);
				return;
			}
			if (pokemon.name === 'Morte' && pokemon.species.id !== 'mimikyu' && pokemon.abilityState.transform) {
				this.add('-ability', pokemon, 'Dollkeeper');
				pokemon.formeChange('Mimikyu');
				target.side.removeSideCondition('curseddoll');
				pokemon.abilityState.transform = false;
				return;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && target.species.id === 'mimikyu') {
				target.abilityState.transform = true;
				return target.hp - 1;
			}
		},
		onBeforeMove(pokemon, target, move) {
			if (pokemon.species.id !== 'mimikyu') {
				this.debug("Disabled by Dollkeeper");
				this.add('-message', `${pokemon.name} can't move!`);
				return false;
			}
		},
		onResidual(pokemon) {
			this.add('-message', `Transform: ${pokemon.abilityState.transform}`);
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			this.add('-message', `${pokemon.abilityState.duration}`);
			if (pokemon.abilityState.duration > -1) pokemon.abilityState.duration -= 1;
			this.add('-message', `${pokemon.abilityState.duration}`);
			if (!pokemon.abilityState.duration || pokemon.abilityState.duration <= -1) {
				this.add('-message', `onResidual detected Mimikyu has 0 or less duration remaining (${pokemon.abilityState.duration})`);
				pokemon.abilityState.transform = true;
			}
		},
		onFoeTryMove(target, source, move) {
			if (target.hp && source.species.id !== 'mimikyu' && source.abilityState.duration > 0) {
				this.add('-activate', source, 'ability: Dollkeeper');
				this.damage(target.baseMaxhp / 6, target);
				target.addVolatile('yawn');
				target.addVolatile('lag');
			}
		},
	},
	// Marisa Kirisame
	ordinarymagician: {
		desc: "This Pokemon is immune to status, and changes its typing to match the typing of the move it's using. On switch-in, user obtains either Assault Vest, Choice Specs, Expert Belt, Flame Orb, Light Ball, Razor Fang, or Toxic Orb. On switch-out, uses Fling.",
		shortDesc: "Immune to status; Protean; Random item/fling on switch-in/out.",
		onStart(pokemon) {
			let i = this.random(7);
			if (i === 0) {
				pokemon.setItem('assaultvest');
				this.add('-message', `${pokemon.name} obtained an Assault Vest!`);
			} else if (i === 1) {
				pokemon.setItem('choicespecs');
				this.add('-message', `${pokemon.name} obtained Choice Specs!`);
			} else if (i === 2) {
				pokemon.setItem('expertbelt');
				this.add('-message', `${pokemon.name} obtained an Expert Belt!`);
			} else if (i === 3) {
				pokemon.setItem('flameorb');
				this.add('-message', `${pokemon.name} obtained a Flame Orb!`);
			} else if (i === 4) {
				pokemon.setItem('lightball');
				this.add('-message', `${pokemon.name} obtained a Light Ball!`);
			} else if (i === 5) {
				pokemon.setItem('razorfang');
				this.add('-message', `${pokemon.name} obtained a Razor Fang!`);
			} else {
				pokemon.setItem('toxicorb');
				this.add('-message', `${pokemon.name} obtained a Toxic Orb!`);
			}
		},
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Ordinary Magician');
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn' || pokemon.status === 'frz' || pokemon.status === 'par' || pokemon.status === 'psn' || pokemon.status === 'tox' || pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Ordinary Magician');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn' || status.id !== 'frz' || status.id !== 'par' || status.id !== 'psn' || status.id !== 'tox' || status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Ordinary Magician');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Ordinary Magician');
				return null;
			}
		},
		onSwitchOut(pokemon) {
			this.actions.useMove('Fling', pokemon);
		},
		flags: {breakable: 1},
		name: "Ordinary Magician",
		gen: 9,
	},
	// Sanae Kochiya
	windpriestess: {
		desc: "This Pokemon summons a random weather upon switching in and gains +1 Defense, Special Attack or Special Defense per turn.",
		shortDesc: "Switch-in: Random weather. +1 Def, Spd, or Spe per turn.",
		onStart(pokemon) {
			const w = this.random(4);
			if (w === 0) {
				this.field.setWeather('sunnyday');
				this.add('-message', `${pokemon.name}'s Wind Priestess summoned harsh sunlight!`);
			} else if (w === 1) {
				this.field.setWeather('raindance');
				this.add('-message', `${pokemon.name}'s Wind Priestess summoned heavy rain!`);
			} else if (w === 2) {
				this.field.setWeather('snowscape');
				this.add('-message', `${pokemon.name}'s Wind Priestess summoned a snowstorm!`);
			} else {
				this.field.setWeather('sandstorm');
				this.add('-message', `${pokemon.name}'s Wind Priestess summoned a sandstorm!`);
			}
		},
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				const s = this.random(3);
				if (s === 0) {
					this.boost({spd: 1});
				} else if (s === 1) {
					this.boost({def: 1});
				} else {
					this.boost({spa: 1});
				}
			}
		},
		flags: {},
		name: "Wind Priestess",
		gen: 9,
	},
	// Prince Smurf
	quickcamo: {
      shortDesc: "Changes type to resist move before hit + Protean. First move slot always stab.",
      name: "Quick Camo",
      onTryHit(target, source, move) {
      	if (target === source) return;
         const possibleTypes = [];
	      const attackType = move.type;
	      for (const type of this.dex.types.names()) {
	            if (target.hasType(type)) continue;
	            const typeCheck = this.dex.types.get(type).damageTaken[attackType];
	            if (typeCheck === 2) {
	            	possibleTypes.push(type);
	           }	
	      }
	      if (!possibleTypes.length) return;
	      const randomType = this.sample(possibleTypes);
	      target.setType(randomType);
	      this.add('-start', target, 'typechange', randomType);
		},
		onPrepareHit(source, target, move) {
	      if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
	      const type = move.type;
	      if (type && type !== '???' && source.getTypes().join() !== type) {
	        	source.setType(type);
	        	this.add('-start', source, 'typechange', type, '[from] ability: Quick Camo');
	      }	
		},
	   onModifyMove(move, pokemon, target) {
	      const types = pokemon.getTypes(true);
	      const noModifyType = [
	        'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
	      ];
	      if (noModifyType.includes(move.id)) return;
	      for (const [i, type] of types.entries()) {
	            if (!this.dex.types.isName(type)) continue;
	            if (pokemon.moveSlots[i] && move.id === pokemon.moveSlots[i].id) move.type = type;
	      }
		},
		flags: {},
	},
	// Kozuchi
	scrapworker: {
		desc: "1.1x Accuracy. Reduces damage from Physical Attacks by 75% and Special Attacks by 30%. Loses 25% for Physical and 10% for Special with each attack received.",
		shortdesc: "1.1x Accuracy. 75% Damage Reduction vs Physical and 30% vs Special. Loses 1/3rd damage reduction when attacked.",
		onStart(pokemon) {
			if (!pokemon.abilityState.armor && !pokemon.abilityState.usedArmor) {
				this.add('-activate', pokemon, 'ability: Scrapworker');
				pokemon.abilityState.armor = 3;
				pokemon.abilityState.usedArmor = true;
				this.add('-message', `${pokemon.name} equipped their armor from Scrapworker!`);
			}
		},
	   onSourceModifyDamage(damage, source, target, move) {
      	if (move.category === 'Physical') {
            if (!target.abilityState.armor) return;
            if (target.abilityState.armor === 3) return this.chainModify(0.25);
				if (target.abilityState.armor === 2) return this.chainModify(0.5);
				if (target.abilityState.armor === 1) return this.chainModify(0.75);
         }
         if (move.category === 'Special') {
         	if (!target.abilityState.armor) return;
            if (target.abilityState.armor === 3) return this.chainModify(0.7);
				if (target.abilityState.armor === 2) return this.chainModify(0.8);
				if (target.abilityState.armor === 1) return this.chainModify(0.9);
         }
		},
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('Scrapworker - enhancing accuracy');
			return accuracy * 1.1;
		},
		onDamagingHit(damage, source, target, move) {
			if (source.abilityState.armor && source.abilityState.armor > 0) {
				source.abilityState.armor -= 1;
				if (source.abilityState.armor > 0) this.add('-message', `${source.name}'s armor was chipped!`);
				if (source.abilityState.armor === 0) this.add('-message', `${source.name}'s armor broke!`);
			}
		},
		onBasePower(basePower, pokemon, move) {
			if (!pokemon.abilityState.enhancement) return;
			if (pokemon.abilityState.enhancement === 1) return this.chainModify(1.3);
			if (pokemon.abilityState.enhancement === 2) return this.chainModify(1.82);
			if (pokemon.abilityState.enhancement === 3) return this.chainModify(2.73);
		},
	},
	// Urabrask
	praetorsgrasp: {
		name: "Praetor's Grasp",
		desc: "While this Pokemon is active, opposing Pokemon must be active for at least 2 turns before switching. This Pokemon's moves of power 80 or greater have 1.2x power and accuracy, and always make contact.",
		shortDesc: "Foes must be active for 2 turns; 80BP+ Moves: Contact, 1.2x Power/Accuracy.",
		gen: 9,
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.activeTurns || pokemon.activeTurns < 2) pokemon.tryTrap(true);
		},
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			if (basePower >= 80) {
				this.debug('Praetor\'s Grasp Boost');
				return this.chainModify(1.2);
			}
		},
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) {
			if (move.basePower >= 80) {
				this.debug('Praetor\'s Grasp Boost');
				return this.chainModify(1.2);
			}
		},
	},
	// Sariel
	angelofdeath: {
		desc: "While this Pokemon is active, opposing Pokemon are prevented from healing and lose HP equal to 1/16 of their max HP per turn.",
		shortDesc: "Opponents cannot heal; Lose 1/16 max HP per turn.",
		onDisableMove(pokemon) {
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						target.disableMove(moveSlot.id);
					}
				}
			}
		},
		onBeforeMovePriority: 6,
		onFoeTryMove(target, source, move) {
			if (move.flags['heal'] && !move.isZ && !move.isMax) {
				this.attrLastMove('[still]');
				this.add('cant', target, 'ability: Angel of Death', move);
				return false;
			}
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				this.damage(target.baseMaxhp / 16, target, pokemon);
			}
		},
		onTryHeal(damage, pokemon, effect) {
			for (const target of pokemon.foes()) {
				if ((effect?.id === 'zpower') || this.effectState.isZ) return damage;
				return false;
			}
		},
		flags: {},
		name: "Angel of Death",
		gen: 9,
	},
	// Mima
	vengefulspirit: {
		desc: "This Pokemon's attacks hit before the target switches. This Pokemon's attacks knock off the target's held item.",
		shortDesc: "Hits before target switches; Attacks knock off item.",
		onBeforeTurn(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('vengefulspirit', pokemon);
				const data = side.getSideConditionData('vengefulspirit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onTryHit(source, target) {
			target.side.removeSideCondition('vengefulspirit');
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || !target || source.switchFlag === true) return;
			if (target !== source && move.category !== 'Status') {
				const item = target.takeItem(source);
				if (item) this.add('-enditem', target, item.name, '[from] ability: Vengeful Spirit', '[of] ' + source);
			}
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				const move = this.queue.willMove(pokemon.foes()[0]);
				const moveName = move && move.moveid ? move.moveid.toString() : "";
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon.foes()[0], 'ability: Vengeful Spirit');
						alreadyAdded = true;
					}
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove(moveName, source, source.getLocOf(pokemon));
				}
			},
		},
		flags: {},
		name: "Vengeful Spirit",
		gen: 9,
	},
	// Gizmo
	headonbattery: {
		name: "Head-On Battery",
		desc: "Allows this Pokemon to use Charge up to three times. Deals (100HP*number of charges) damage to target after reaching three charges. 12.5-25% recoil. Forces user to switch to a random ally. Increases Attack and Speed by 50% for each charge this Pokemon has.",
		shortDesc: "See this entry with '/ssb Gizmo'!",
		onStart(pokemon) {
			if (pokemon.abilityState.recallActive && !pokemon.item) {
				pokemon.setItem('inconspicuouscoin');
				this.add('-item', pokemon, pokemon.getItem(), '[from] item: Inconspicuous Coin');
				pokemon.abilityState.recallActive = false;
			}
		},
		onSwitchOut(pokemon) {
			pokemon.abilityState.firedUp = false;
		},
		onModifyMove(move, pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (move.id === 'charge') {
				if (!pokemon.abilityState.charges) pokemon.abilityState.charges = 0;
				if (pokemon.abilityState.charges >= 3) return;
				pokemon.abilityState.charges += 1;
				if (pokemon.abilityState.charges >= 3) {
					this.add('-message', `${pokemon.name} is overflowing with charge!`);
					this.add('-message', `${pokemon.name} unleashed Head-On Battery on ${target.name}!`);
					this.add(`-anim`, pokemon, "Volt Tackle", target);
					this.damage(100*pokemon.abilityState.charges, target, pokemon);
					pokemon.abilityState.charges = 0;
					this.add('-message', `${pokemon.name} was launched away by the impact!`);
					this.damage(pokemon.maxhp / this.random(4, 8), pokemon, pokemon);
					if (pokemon.hp && pokemon.hp > 0) pokemon.forceSwitchFlag = true;
					return false;
				}
				if (pokemon.abilityState.charges === 1) this.add('-message', `${pokemon.name} is 33% charged!`);
				if (pokemon.abilityState.charges === 2) this.add('-message', `${pokemon.name} is 67% charged!`);
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (!pokemon.abilityState.charges) return;
			// Formula gives 20% (1.2x) boost per charge, 1.2x, 1.4x, 1.6x, etc.
			this.debug('Charge boost');
			return this.chainModify(1+(0.5*pokemon.abilityState.charges));
		},
		onModifySpe(spe, pokemon) {
			if (!pokemon.abilityState.charges) return;
			// Formula gives 20% (1.2x) boost per charge, 1.2x, 1.4x, 1.6x, etc.
			this.debug('Charge boost');
			return this.chainModify(1+(0.5*pokemon.abilityState.charges));
		},
		onModifyCritRatio(critRatio, source, target) {
			if (source.abilityState.firedUp) return critRatio + 2;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number') return;
			if (target.abilityState.firedUp) {
				return this.chainModify([3277, 4096]);
			}
		},
		gen: 9,
	},
	// Aeri
	woventogethercohereforever: {
		name: "Woven Together, Cohere Forever",
		gen: 9,
		onModifyMove(move, pokemon) {
			const target = pokemon.side.foe.active[0];
			if (move.type === 'Flying' && pokemon.abilityState.lastMoveUsedResidual) {
				target.side.addSideCondition('woventogethercohereforever');
				pokemon.abilityState.imprintedMove = move.id;
				pokemon.abilityState.imprintedType = pokemon.abilityState.lastMoveUsedResidual.type;
			}
		},
		// 'lastMoveUsed' immediately updates when a move is used; In other words, clicking
		// Blissful Breeze will instantly change lastMoveUsed to Blissful Breeze
		// This function provides lastMoveUsed tracking that only updates once at the end of every turn
		// in order for Blissful Breeze to read the move used before it
		onResidual(pokemon) {
			pokemon.abilityState.lastMoveUsedResidual = pokemon.lastMoveUsed;
		},
		condition: {
			duration: 3,
			onResidual(pokemon) {
				let sources = pokemon.side.foe.pokemon.filter(ally => ally.ability === 'woventogethercohereforever');
				const source = sources[0];	
				let move = this.dex.getActiveMove(source.abilityState.imprintedMove);
				move.type = source.abilityState.imprintedType;
				const dmg = this.actions.getDamage(source, pokemon, move);
				this.add('-anim', pokemon, 'Geomancy', pokemon);
				this.damage(dmg*1.4, pokemon, source);
				this.add('-message', `${pokemon.name} was buffeted by Woven Together, Cohere Forever!`);
			},
		},
	},
	// Glint
	augmentthegiants: {
		name: "Augment the Giants",
		gen: 9,
		onBeforeMove(pokemon, target, move) {
			if (move.category !== 'Physical') return;
			this.add('-activate', pokemon, 'ability: Augment the Giants');
			changeSet(this, pokemon, ssbSets['Glint-Melmetal']);
		},
		onAfterMove(source, target, move) {
			if (source.species.id === 'meltan') return;
			this.add('-activate', source, 'ability: Augment the Giants');
			changeSet(this, source, ssbSets['Glint']);
		},
	},
	// Finger
	absolutezen: {
		name: "Absolute Zen",
		desc: "Immune to Taunt/Confusion/Attract; Heals 1/6 max HP after being attacked.",
		gen: 9,
		// Damage Recovery
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			this.add('-activate', target, 'ability: Absolute Zen');
			this.heal(target.baseMaxhp / 6);
		},
		onUpdate(pokemon) {
			// Infatuation Immunity
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Absolute Zen');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Absolute Zen');
			}
			// Taunt Immunity
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Absolute Zen');
				pokemon.removeVolatile('taunt');
			}
			// Confusion Immunity
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Absolute Zen');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt' || move?.volatileStatus === 'confusion') {
				this.add('-immune', pokemon, '[from] ability: Absolute Zen');
				return null;
			}
		},
	},
	// Pablo
	artistblock: {
		name: 'Artist Block',
		gen: 9,
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2}, target, target, null, false, true);
				this.boost({spa: 2}, target, target, null, false, true);
				this.boost({spe: 2}, target, target, null, false, true);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Artist Block');
				pokemon.removeVolatile('taunt');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Artist Block');
				return null;
			}
			if (!pokemon.lastMoveUsed) return;
			if (pokemon.lastMoveUsed.id === 'sketch') {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, pokemon, target);
				this.add('-immune', pokemon, '[from] move: Sketch');
				return null;
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move.id === 'sketch') return priority + 1;
		},
		onAfterMove(source, target, move) {
			source.storedStats.atk = target.storedStats.atk;
			source.storedStats.def = target.storedStats.def;
			source.storedStats.spa = target.storedStats.spa;
			source.storedStats.spd = target.storedStats.spd;
			source.storedStats.spe = target.storedStats.spe;
			this.add('-message', `${source.name} sketched ${target.name}'s base stats!`);
		},
	},

	// Trey
	concentration: {
		desc: "Starts Dynamite Arrow on the opposing side upon switching in. This Pokemon has x1.3 speed. This Pokemon's attacks cannot miss. This Pokemon's attacks have 1.5x power and +2 crit ratio after one full turn of not being attacked.",
		shortDesc: "See '/ssb Trey' for more!",
		onStart(pokemon) {
			const target = pokemon.side.foe.active[0];
			target.side.addSideCondition('dynamitearrow');
			pokemon.abilityState.damaged = false;
			pokemon.abilityState.concentrated = false;
		},
		onDamagingHit(damage, target, source, move) {
			if (!target.abilityState.damaged && target.abilityState.concentrated) {
				target.abilityState.damaged = true;
				target.abilityState.concentrated = false;
				this.add('-message', `${target.name} lost their concentration!`);
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('concentration - user will not miss');
			return true;
		},
		onResidual(pokemon, target) {
			if (!pokemon.abilityState.damaged && !pokemon.activeTurns) {
				pokemon.abilityState.concentrated = true;
				this.add('-anim', pokemon, 'Focus Energy', pokemon);
				this.add('-message', `${pokemon.name} is building concentration!`);
				return;
			}
			if (!pokemon.abilityState.damaged && pokemon.activeTurns) {
				pokemon.abilityState.concentrated = true;
				this.add('-anim', pokemon, 'Focus Energy', pokemon);
				this.add('-message', `${pokemon.name} is building concentration!`);
				return;
			}
			pokemon.abilityState.damaged = false;
		},
		onBasePowerPriority: 29,
		onBasePower(basePower, pokemon, target, move) {
			if (pokemon.abilityState.concentrated) {
				return move.basePower * 1.5;
			}
			return move.basePower;
		},
		onModifyCritRatio(critRatio, pokemon, target, move) {
			if (pokemon.abilityState.concentrated) {
				return move.critRatio + 2;
			}
			return move.critRatio;
		},
		onModifySpe(spe) {
			return this.chainModify(1.3);
		},
		flags: {},
		name: "Concentration",
		gen: 9,
	},

	/*
	// Aelita
	fortifiedmetal: {
		shortDesc: "This Pokemon's weight is doubled and Attack is 1.5x when statused.",
		name: "Fortified Metal",
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) {
			return weighthg * 2;
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		flags: {breakable: 1},
		gen: 9,
	},

	// Aethernum
	theeminenceintheshadow: {
		shortDesc: "Unaware + Supreme Overlord with half the boost.",
		name: "The Eminence in the Shadow",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: The Eminence in the Shadow');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [20, 21, 22, 23, 24, 25];
				this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/25`);
				return this.chainModify([powMod[this.effectState.fallen], 20]);
			}
		},
		flags: {breakable: 1},
	},

	// Akir
	takeitslow: {
		shortDesc: "Regenerator + Psychic Surge.",
		name: "Take it Slow",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onStart(source) {
			this.field.setTerrain('psychicterrain');
		},
		flags: {},
		gen: 9,
	},

	// Alex
	pawprints: {
		shortDesc: "Oblivious + status moves ignore abilities.",
		name: "Pawprints",
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Paw Prints');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Paw Prints');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Paw Prints');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Paw Prints');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Paw Prints', '[of] ' + target);
			}
		},
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		flags: {breakable: 1},
	},

	// Alexander489
	confirmedtown: {
		shortDesc: "Technician + Protean.",
		name: "Confirmed Town",
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug('Base Power: ' + basePowerAfterMultiplier);
			if (basePowerAfterMultiplier <= 60) {
				this.debug('Confirmed Town boost');
				return this.chainModify(1.5);
			}
		},
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Confirmed Town');
			}
		},
		flags: {},
	},

	// Appletun a la Mode
	servedcold: {
		shortDesc: "This Pokemon's Defense is raised 2 stages if hit by an Ice move; Ice immunity.",
		name: "Served Cold",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({def: 2})) {
					this.add('-immune', target, '[from] ability: Served Cold');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// aQrator
	neverendingfhunt: {
		shortDesc: "This Pokemon's Status moves have priority raised by 1. Dark types are not immune.",
		name: "Neverending fHunt",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				return priority + 1;
			}
		},
		flags: {},
	},

	// A Quag To The Past
	quagofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.85x Defense. Ignores abilities.",
		desc: "Active Pokemon without this Ability have their Defense multiplied by 0.85x. This Pokemon's moves and their effects ignore certain Abilities of other Pokemon.",
		name: "Quag of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Quag of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			if (!move) return;
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Quag of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Quag of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Quag of Ruin Def drop');
			return this.chainModify(0.85);
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		flags: {},
		gen: 9,
	},
	clodofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.85x Attack. Ignores stat changes.",
		desc: "Active Pokemon without this Ability have their Attack multiplied by 0.85x. This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
		name: "Clod of Ruin",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Clod of Ruin');
		},
		onAnyModifyAtk(atk, target, source, move) {
			if (!move) return;
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Clod of Ruin')) return;
			if (!move.ruinedAtk?.hasAbility('Clod of Ruin')) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Clod of Ruin Atk drop');
			return this.chainModify(0.85);
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		flags: {breakable: 1},
		gen: 9,
	},

	// Archas
	saintlybullet: {
		shortDesc: "Snipe Shot always has STAB and heals the user by 1/8 (or 1/6 on a crit) of its max HP.",
		name: "Saintly Bullet",
		onModifyMove(move) {
			if (move.id === 'snipeshot') {
				move.forceSTAB = true;
			}
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.id === 'snipeshot') {
				const ratio = source.getMoveHitData(move).crit ? 6 : 8;
				this.heal(source.maxhp / ratio, source);
			}
		},
		flags: {},
		gen: 9,
	},

	// Arcueid
	marblephantasm: {
		shortDesc: "Deoxys-Defense is immune to status moves/effects. Deoxys-Attack gains Fairy type.",
		desc: "If this Pokemon is a Deoxys-Defense, it is immune to status moves and cannot be afflicted with any non-volatile status condition. If this Pokemon is a Deoxys-Attack, it gains an additional Fairy typing for as long as this Ability remains active.",
		name: "Marble Phantasm",
		onStart(source) {
			if (source.species.name === "Deoxys-Attack" && source.setType(['Psychic', 'Fairy'])) {
				this.add('-start', source, 'typechange', source.getTypes(true).join('/'), '[from] ability: Marble Phantasm');
			} else if (source.species.name === "Deoxys-Defense" && source.setType('Psychic')) {
				this.add('-start', source, 'typechange', 'Psychic', '[from] ability: Marble Phantasm');
			}
		},
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source && target.species.name === "Deoxys-Defense") {
				this.add('-immune', target, '[from] ability: Marble Phantasm');
				return null;
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.species.name === "Deoxys-Defense") {
				this.add('-immune', target, '[from] ability: Marble Phantasm');
				return false;
			}
		},
		flags: {},
		gen: 9,
	},

	// Arsenal
	absorbphys: {
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Normal moves; Normal immunity.",
		name: "Absorb Phys",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Normal') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Absorb Phys');
				}
				return null;
			}
		},
		flags: {breakable: 1},
		gen: 9,
	},

	// Artemis
	supervisedlearning: {
		shortDesc: "Unaware + Clear Body.",
		name: "Supervised Learning",
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
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
				this.add("-fail", target, "unboost", "[from] ability: Supervised Learning", "[of] " + target);
			}
		},
		flags: {},
		gen: 9,
	},

	// Audiino
	mitosis: {
		shortDesc: "Regenerator + Multiscale.",
		name: "Mitosis",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// ausma
	cascade: {
		shortDesc: "At 25% HP, transforms into a Mismagius. Sigil's Storm becomes Ghost type and doesn't charge.",
		name: "Cascade",
		onUpdate(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Hatterene' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'mismagius' || pokemon.hp > pokemon.maxhp / 4) return;
			this.add(`c:|${getName('ausma')}|that's it, yall mfs are about to face the wrath of Big Stall™`);
			this.add(`c:|${getName('ausma')}|or i guess moreso Big Pult. pick your poison`);
			this.add('-activate', pokemon, 'ability: Cascade');
			changeSet(this, pokemon, ssbSets['ausma-Mismagius'], true);
			pokemon.cureStatus();
			this.heal(pokemon.maxhp / 3);
			if (this.field.pseudoWeather['trickroom']) {
				this.field.removePseudoWeather('trickroom');
				this.boost({spe: 2}, pokemon, pokemon, this.effect);
			}
		},
		flags: {},
	},

	// Bert122
	pesteringassault: {
		shortDesc: "Uses Knock Off, Taunt, Torment, Soak, and Confuse Ray with 40% accuracy at turn end.",
		name: "Pestering Assault",
		onResidual(pokemon, s, effect) {
			const moves = ['knockoff', 'taunt', 'torment', 'soak', 'confuseray'];
			for (const moveid of moves) {
				const move = this.dex.getActiveMove(moveid);
				move.accuracy = 40;
				const target = pokemon.foes()[0];
				if (target && !target.fainted) {
					this.actions.useMove(move, pokemon, target, effect);
				}
			}
		},
		flags: {},
	},

	// blazeofvictory
	prismaticlens: {
		shortDesc: "Pixilate + Tinted Lens.",
		name: "Prismatic Lens",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// Blitz
	blitzofruin: {
		shortDesc: "Active Pokemon without this Ability have 0.75x Speed.",
		desc: "Active Pokemon without this Ability have their Speed multiplied by 0.75x.",
		name: "Blitz of Ruin",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Blitz of Ruin');
			this.add('-message', `${pokemon.name}'s Blitz of Ruin lowered the Speed of all surrounding Pokémon!`);
		},
		onAnyModifySpe(spe, pokemon) {
			if (!pokemon.hasAbility('Blitz of Ruin')) {
				return this.chainModify(0.75);
			}
		},
		flags: {breakable: 1},
	},

	// Breadstycks
	painfulexit: {
		shortDesc: "When this Pokemon switches out, foes lose 25% HP.",
		name: "Painful Exit",
		onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
			if (enemyStaff(pokemon) === "Mad Monty") {
				this.add(`c:|${getName('Breadstycks')}|Welp`);
			} else {
				this.add(`c:|${getName('Breadstycks')}|Just kidding!! Take this KNUCKLE SANDWICH`);
			}
			for (const foe of pokemon.foes()) {
				if (!foe || foe.fainted || !foe.hp) continue;
				this.add(`-anim`, pokemon, "Tackle", foe);
				this.damage(foe.hp / 4, foe, pokemon);
			}
		},
		flags: {},
	},

	// Chloe
	acetosa: {
		shortDesc: "This Pokemon's moves are changed to be Grass type and have 1.2x power.",
		name: "Acetosa",
		onModifyTypePriority: 1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (!(move.isZ && move.category !== 'Status') && !noModifyType.includes(move.id) &&
				!(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Grass';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		flags: {},
	},

	// Clefable
	thatshacked: {
		shortDesc: "Tries to inflict the foe with Torment at the end of each turn.",
		name: "That's Hacked",
		onResidual(target, source, effect) {
			if (!target.foes()?.length) return;
			const abilMessages = [
				"All hacks and hacking methods are banned!",
				"Can't be having that.",
				"Naaah, miss me with that shit.",
				"Bit bullshit that, mate.",
				"Wait, thats illegal!",
				"Nope.",
				"I can't believe you've done this.",
				"No thank you.",
				"Seems a bit suss.",
				"Thats probably hacked, shouldnt use it here.",
				"Hacks will get you banned.",
				"You silly sausage",
				"Can you not?",
				"Yeah, thats a no from me.",
				"Lets not",
				"No fun allowed",
			];
			this.add(`c:|${getName((target.illusion || target).name)}|${this.sample(abilMessages)}`);
			for (const foe of target.foes()) {
				if (foe && !foe.fainted && !foe.volatiles['torment']) {
					foe.addVolatile('torment');
				}
			}
		},
		flags: {},
	},

	// Clementine
	meltingpoint: {
		shortDesc: "+2 Speed. Fire moves change user to Water type. Fire immunity.",
		name: "Melting Point",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (target.setType('Water')) {
					this.add('-start', target, 'typechange', 'Water', '[from] ability: Melting Point');
					this.boost({spe: 2}, target, source, this.dex.abilities.get('meltingpoint'));
				} else {
					this.add('-immune', target, '[from] ability: Melting Point');
				}
				return null;
			}
		},
	},

	// clerica
	masquerade: {
		shortDesc: "(Mimikyu only) The first hit is blocked: instead, takes 1/8 damage and gets +1 Atk/Spe.",
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, its Attack and Speed are boosted by 1 stage, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		name: "Masquerade",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				this.add('-activate', target, 'ability: Masquerade');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id) || target.transformed) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move.type)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
				this.boost({atk: 1, spe: 1});
				this.add(`c:|${getName('clerica')}|oop`);
			}
		},
		flags: {breakable: 1, failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
	},

	// Clouds
	jetstream: {
		shortDesc: "Delta Stream + Stealth Rock immunity.",
		name: "Jet Stream",
		onStart(source) {
			this.field.setWeather('deltastream');
			this.add('message',	`Strong air currents keep Flying-types ahead of the chase!`);
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.isWeather('deltastream') && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility(['deltastream', 'jetstream'])) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Stealth Rock') {
				return false;
			}
		},
		flags: {breakable: 1},
	},

	// Coolcodename
	firewall: {
		shortDesc: "Burns foes that attempt to use status moves on this Pokemon; Status move immunity.",
		name: "Firewall",
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				if (!source.trySetStatus('brn', target)) {
					this.add('-immune', target, '[from] ability: Firewall');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Corthius
	grassyemperor: {
		shortDesc: "On switch-in, summons Grassy Terrain. During Grassy Terrain, Attack is 1.33x.",
		name: "Grassy Emperor",
		onStart(pokemon) {
			if (this.field.setTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'Grassy Emperor', '[source]');
			} else if (this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: Grassy Emperor');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Grassy Emperor boost');
				return this.chainModify([5461, 4096]);
			}
		},
		flags: {},
	},

	// Daki
	astrothunder: {
		shortDesc: "Drizzle + Static.",
		name: "Astrothunder",
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('raindance');
		},
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
	},

	// Dawn of Artemis
	formchange: {
		shortDesc: ">50% HP Necrozma, else Necrozma-Ultra. SpA boosts become Atk boosts and vice versa.",
		desc: "If this Pokemon is a Necrozma, it changes to Necrozma-Ultra and switches its Attack and Special Attack stat stage changes if it has 1/2 or less of its maximum HP at the end of a turn. If Necrozma-Ultra's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Necrozma and switches its Attack and Special Attack stat stage changes.",
		name: "Form Change",
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Necrozma' || pokemon.transformed || !pokemon.hp) return;
			let newSet = 'Dawn of Artemis';
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.id === 'necrozma') return;
				this.add(`c:|${getName('Dawn of Artemis')}|Good, I'm healthy again, time to swap back.`);
			} else {
				if (pokemon.species.id === 'necrozmaultra') return;
				this.add(`c:|${getName('Dawn of Artemis')}|Time for me to transform and you to witness the power of Ares now!`);
				newSet += '-Ultra';
			}
			this.add('-activate', pokemon, 'ability: Form Change');
			changeSet(this, pokemon, ssbSets[newSet]);
			[pokemon.boosts['atk'], pokemon.boosts['spa']] = [pokemon.boosts['spa'], pokemon.boosts['atk']];
			this.add('-setboost', pokemon, 'spa', pokemon.boosts['spa'], '[silent]');
			this.add('-setboost', pokemon, 'atk', pokemon.boosts['atk'], '[silent]');
			this.add('-message', `${pokemon.name} swapped its Attack and Special Attack boosts!`);
		},
		flags: {},
	},

	// DaWoblefet
	shadowartifice: {
		shortDesc: "Traps adjacent foes. If KOed with a move, that move's user loses an equal amount of HP.",
		name: "Shadow Artifice",
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility(['shadowtag', 'shadowartifice']) && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility(['shadowtag', 'shadowartifice'])) {
				pokemon.maybeTrapped = true;
			}
		},
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(target.getUndynamaxedHP(damage), source, target);
			}
		},
		flags: {},
	},

	// dhelmise
	coalescence: {
		shortDesc: "Moves drain 37%. Allies heal 5% HP. <25% HP, moves drain 114%, allies get 10%.",
		desc: "All moves heal 37% of damage dealt. Unfainted allies heal 5% HP at the end of each turn. If this Pokemon's HP is less than 25%, moves heal 114% of damage dealt, and allies restore 10% of their health.",
		name: "Coalescence",
		onModifyMove(move, source, target) {
			if (move.category !== "Status") {
				// move.flags['heal'] = 1; // For Heal Block
				if (source.hp > source.maxhp / 4) {
					move.drain = [37, 100];
				} else {
					move.drain = [114, 100];
				}
			}
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			for (const ally of pokemon.side.pokemon) {
				if (!ally.hp || ally === pokemon) continue;
				if (ally.heal(this.modify(ally.baseMaxhp, pokemon.hp > pokemon.maxhp / 4 ? 0.05 : 0.1))) {
					this.add('-heal', ally, ally.getHealth, '[from] ability: Coalescence', '[of] ' + pokemon);
				}
			}
		},
		flags: {},
	},

	// Elly
	stormsurge: {
		shortDesc: "On switch-in, summons rain that causes wind moves to have perfect accuracy and 1.2x Base Power.",
		desc: "Summons the Storm Surge weather on switch-in. While Storm Surge is active, wind moves used by any Pokemon are perfectly accurate and become 20% stronger. Water moves are 50% stronger, Fire moves are 50% weaker.",
		name: "Storm Surge",
		onStart(source) {
			this.field.setWeather('stormsurge');
		},
	},

	// Emboar02
	hogwash: {
		shortDesc: "Reckless; on STAB moves, also add Rock Head. On non-STAB moves, recoil is recovery.",
		desc: "This Pokemon's attacks that would normally have recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle. STAB recoil attacks used by this Pokemon do not deal recoil damage to the user. Non-STAB recoil attacks used by this Pokemon will heal the user instead of dealing recoil damage.",
		name: "Hogwash",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Hogwash boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') {
					if (!source.hasType(this.activeMove.type)) this.heal(damage);
					return null;
				}
			}
		},
	},

	// Frostyicelad
	almostfrosty: {
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		name: "Almost Frosty",
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
	},

	// Frozoid
	snowballer: {
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by an Ice move; Ice immunity.",
		name: "Snowballer",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ice') {
				if (!this.boost({atk: 1})) {
					this.add('-immune', target, '[from] ability: Snowballer');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Fame
	socialjumpluffwarrior: {
		shortDesc: "Serene Grace + Mold Breaker.",
		name: "Social Jumpluff Warrior",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Social Jumpluff Warrior');
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			move.ignoreAbility = true;
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		flags: {},
	},

	// Ganjafin
	gamblingaddiction: {
		shortDesc: "When under 1/4 max HP: +1 Spe, heal to full HP, and all moves become Final Gambit.",
		name: "Gambling Addiction",
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.gamblingAddiction && pokemon.hp && pokemon.hp < pokemon.maxhp / 4) {
				this.boost({spe: 1});
				this.heal(pokemon.maxhp);
				const move = this.dex.getActiveMove('finalgambit');
				const finalGambit = {
					move: move.name,
					id: move.id,
					pp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
					maxpp: (move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5,
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots.fill(finalGambit);
				pokemon.baseMoveSlots.fill(finalGambit);
				this.effectState.gamblingAddiction = true;
			}
		},
		flags: {},
	},

	// Goro Yagami
	illusionmaster: {
		shortDesc: "This Pokemon has an illusion until it falls below 33% health.",
		name: "Illusion Master",
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
		onDamagingHit(damage, target, source, move) {
			if (target.illusion && target.hp < (target.maxhp / 3)) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
		},
		onEnd(pokemon) {
			if (pokemon.illusion) {
				this.debug('illusion master cleared');
				let disguisedAs = this.toID(pokemon.illusion.name);
				pokemon.illusion = null;
				const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
					(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				this.add('replace', pokemon, details);
				this.add('-end', pokemon, 'Illusion');
				if (this.ruleTable.has('illusionlevelmod')) {
					this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
				}
				// Handle various POKEMON.
				if (this.dex.species.get(disguisedAs).exists || this.dex.getActiveMove(disguisedAs).exists ||
					this.dex.abilities.get(disguisedAs).exists || disguisedAs === 'blitz') {
					disguisedAs += 'user';
				}
				if (pokemon.volatiles[disguisedAs]) {
					pokemon.removeVolatile(disguisedAs);
				}
				if (!pokemon.volatiles[this.toID(pokemon.set.name)]) {
					const status = this.dex.conditions.get(this.toID(pokemon.set.name));
					if (status?.exists) {
						pokemon.addVolatile(this.toID(pokemon.set.name), pokemon);
					}
				}
			}
		},
		onFaint(pokemon) {
			pokemon.illusion = null;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1},
	},

	// havi
	mensiscage: {
		shortDesc: "Immune to status and is considered to be asleep. 30% chance to Disable when hit.",
		name: "Mensis Cage",
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
				}
			}
		},
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Mensis Cage');
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Mensis Cage');
			}
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		flags: {},
	},

	// Hecate
	hacking: {
		name: "Hacking",
		shortDesc: "Hacks into PS and finds out if the enemy has any super effective moves.",
		onStart(pokemon) {
			const name = (pokemon.illusion || pokemon).name;
			this.add(`c:|${getName(name)}|One moment, please. One does not simply go into battle blind.`);
			const side = pokemon.side.id === 'p1' ? 'p2' : 'p1';
			this.add(
				`message`,
				(
					`ssh sim@pokemonshowdown.com && nc -U logs/repl/sim <<< ` +
					`"Users.get('${this.toID(name)}').popup(battle.sides.get('${side}').pokemon.map(m => Teams.exportSet(m)))"`
				)
			);
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getActiveMove(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) {
				this.add(`c:|${getName(name)}|Fascinating. None of your sets have any moves of interest.`);
				return;
			}
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add(
				'message',
				`${name} hacked into PS and looked at ${name === 'Hecate' ? 'her' : 'their'} opponent's sets. ` +
					`${warnTarget.name}'s move ${warnMoveName} drew ${name === 'Hecate' ? 'her' : 'their'} eye.`
			);
			this.add(`c:|${getName(name)}|Interesting. With that in mind, bring it!`);
		},
		flags: {},
	},

	// HoeenHero
	misspelled: {
		shortDesc: "Swift Swim + Special Attack 1.5x, Accuracy 0.8x. Never misses, only misspells.",
		name: "Misspelled",
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.modify(spa, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Special' && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		// Misspelling implemented in scripts.ts#hitStepAccuracy
		flags: {},
	},

	// Hydrostatics
	hydrostaticpositivity: {
		shortDesc: "Sturdy + Storm Drain + Motor Drive + 1.3x accuracy of Water & Electric moves",
		name: "Hydrostatic Positivity",
		onTryHit(target, source, move) {
			// Storm Drain
			if (target !== source && move.type === 'Water') {
				if (!this.boost({spa: 1})) {
					this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				}
				return null;
			}

			// Motor Drive
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({spe: 1})) {
					this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				}
				return null;
			}

			// Sturdy
			if (move.ohko) {
				this.add('-immune', target, '[from] ability: Hydrostatic Positivity');
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			// Storm Drain
			if (move.type !== 'Water' || ['firepledge', 'grasspledge', 'waterpledge'].includes(move.id)) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Hydrostatic Positivity');
				}
				return this.effectState.target;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			// Sturdy
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Hydrostatic Positivity');
				return target.hp - 1;
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number') return;
			if (['Electric', 'Water'].includes(move.type)) {
				this.debug('Hydrostatic Positivity - enhancing accuracy');
				return this.chainModify([5325, 4096]);
			}
		},
	},

	// in the hills
	illiterit: {
		shortDesc: "Immune to moves with 12 or more alphanumeric characters.",
		name: "Illiterit",
		onTryHit(target, source, move) {
			if (target !== source && move.id.length >= 12) {
				this.add('-immune', target, '[from] ability: Illiterit');
				this.add(`c:|${getName('in the hills')}|Gee ${source.name}, maybe I should get a dictionary so I can understand what move you just used.`);
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// Irly
	therollingspheal: {
		shortDesc: "1.5x dmg boost for every repeated move use. Up to 5 uses. +1 Spe when use contact.",
		name: "The Rolling Spheal",
		onStart(pokemon) {
			pokemon.addVolatile('therollingspheal');
		},
		onSourceHit(target, source, move) {
			if (move.flags['contact'] && move.category === 'Physical') {
				this.add('-activate', source, 'ability: The Rolling Spheal');
				this.boost({spe: 1}, source, source, move);
			}
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasAbility('therollingspheal')) {
					pokemon.removeVolatile('therollingspheal');
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
				if (this.effectState.numConsecutive > 0) {
					this.debug(`Current Metronome boost: 6144/4096`);
					return this.chainModify([6144, 4096]);
				}
			},
			onAfterMove(source, target, move) {
				if (this.effectState.numConsecutive > 5) {
					this.effectState.numConsecutive = 0;
				}
			},
		},
		flags: {},
	},

	// Irpachuza
	mimeknowsbest: {
		shortDesc: "When this Pokemon switches in, it uses a random screen or protect move.",
		desc: "When this Pokemon switches in, it will randomly use one of Light Screen, Reflect, Protect, Detect, Barrier, Spiky Shield, Baneful Bunker, Safeguard, Mist, King's Shield, Magic Coat, or Aurora Veil.",
		name: "Mime knows best",
		onStart(target) {
			const randomMove = [
				"Light Screen", "Reflect", "Protect", "Detect", "Barrier", "Spiky Shield", "Baneful Bunker",
				"Safeguard", "Mist", "King's Shield", "Magic Coat", "Aurora Veil",
			];
			const move = this.dex.getActiveMove(this.sample(randomMove));
			// allows use of Aurora Veil without hail
			if (move.name === "Aurora Veil") delete move.onTry;
			this.actions.useMove(move, target);
		},
		flags: {},
	},

	// J0rdy004
	fortifyingfrost: {
		shortDesc: "If Snow is active, this Pokemon's Sp. Atk and Sp. Def are 1.5x.",
		name: "Fortifying Frost",
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
	},

	// kenn
	deserteddunes: {
		shortDesc: "Summons Deserted Dunes until switch-out; Sandstorm + Rock weaknesses removed.",
		desc: "On switch-in, the weather becomes Deserted Dunes, which removes the weaknesses of the Rock type from Rock-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Desolate Land, Primordial Sea or Delta Stream Abilities.",
		name: "Deserted Dunes",
		onStart(source) {
			this.field.setWeather('deserteddunes');
		},
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deserteddunes' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deserteddunes')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		flags: {},
		gen: 9,
	},

	// Kennedy
	anfield: {
		shortDesc: "Clears terrain/hazards/pseudo weathers. Summons Anfield Atmosphere.",
		name: "Anfield",
		onStart(target) {
			let success = false;
			if (this.field.terrain) {
				success = this.field.clearTerrain();
			}
			for (const side of this.sides) {
				const remove = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const sideCondition of remove) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] ability: Anfield', '[of] ' + target);
					}
				}
			}
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				if (this.field.removePseudoWeather(pseudoWeather)) success = true;
			}
			if (success) {
				this.add('-activate', target, 'ability: Anfield');
			}
			this.field.addPseudoWeather('anfieldatmosphere', target, target.getAbility());
		},
		flags: {},
	},
	youllneverwalkalone: {
		shortDesc: "Boosts Atk, Def, SpD, and Spe by 25% under Anfield Atmosphere.",
		name: "You'll Never Walk Alone",
		onStart(pokemon) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.add('-ability', pokemon, 'You\'ll Never Walk Alone');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, source, target, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone atk boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, target, source, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone def boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, target, source, move) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone spd boost');
				return this.chainModify([5120, 4096]);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.field.getPseudoWeather('anfieldatmosphere')) {
				this.debug('You\'ll Never Walk Alone spe boost');
				return this.chainModify([5120, 4096]);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
	},

	// kingbaruk
	peerpressure: {
		shortDesc: "All moves used while this Pokemon is on the field consume 4 PP.",
		name: "Peer Pressure",
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Peer Pressure');
		},
		onAnyDeductPP(target, source) {
			return 3;
		},
		flags: {},
	},

	// Kiwi
	surehitsorcery: {
		shortDesc: "No Guard + Prankster + Grassy Surge.",
		name: "Sure Hit Sorcery",
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onStart(source) {
			this.field.setTerrain('grassyterrain');
		},
		flags: {},
	},

	// Klmondo
	superskilled: {
		shortDesc: "Skill Link + Multiscale.",
		name: "Super Skilled",
		onModifyMove(move) {
			if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// Kry
	flashfreeze: {
		shortDesc: "Heatproof + If attacker's used offensive stat has positive stat changes, take 0.75x damage.",
		name: "Flash Freeze",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (
				(move.category === 'Special' && source.boosts['spa'] > 0) ||
				(move.category === 'Physical' && source.boosts['atk'] > 0)
			) {
				return this.chainModify(0.75);
			}
		},
		flags: {breakable: 1},
	},

	// Lasen
	idealizedworld: {
		shortDesc: "Removes everything on switch-in.",
		desc: "When this Pokemon switches in, all stat boosts, entry hazards, weathers, terrains, persistent weathers (such as Primordial Sea), and any other field effects (such as Aurora Veil) are removed from all sides of the field.",
		name: "Idealized World",
		onStart(pokemon) {
			const target = pokemon.side.foe;
			this.add('-ability', pokemon, 'Idealized World');
			const displayText = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const targetCondition of Object.keys(target.sideConditions)) {
				if (target.removeSideCondition(targetCondition) && displayText.includes(targetCondition)) {
					this.add('-sideend', target, this.dex.conditions.get(targetCondition).name, '[from] ability: Idealized World', '[of] ' + pokemon);
				}
			}
			for (const sideCondition of Object.keys(pokemon.side.sideConditions)) {
				if (pokemon.side.removeSideCondition(sideCondition) && displayText.includes(sideCondition)) {
					this.add('-sideend', pokemon.side, this.dex.conditions.get(sideCondition).name, '[from] ability: Idealized World', '[of] ' + pokemon);
				}
			}
			this.field.clearTerrain();
			this.field.clearWeather();
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				this.field.removePseudoWeather(pseudoWeather);
			}
			this.add('-clearallboost');
			for (const poke of this.getAllActive()) {
				poke.clearBoosts();
			}
		},
		flags: {},
	},

	// Lionyx
	enormoos: {
		shortDesc: "This Pokemon's Defense is used in damage calculation instead of Attack or Sp. Atk.",
		name: "EnorMOOs",
		onModifyMove(move, pokemon, target) {
			if (move.category !== "Status") {
				move.overrideOffensiveStat = 'def';
			}
		},
		flags: {},
	},

	// Lumari
	pyrotechnic: {
		shortDesc: "Critical hits are guaranteed when the foe is burned.",
		name: "Pyrotechnic",
		onModifyCritRatio(critRatio, source, target) {
			if (target?.status === 'brn') return 5;
		},
		flags: {},
	},

	// Lunell
	lowtidehightide: {
		shortDesc: "Switch-in sets Gravity, immune to Water, traps Water-type foes.",
		name: "Low Tide, High Tide",
		onStart(source) {
			this.field.addPseudoWeather('gravity', source);
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				this.add('-immune', target, '[from] ability: Low Tide, High Tide');
				return null;
			}
		},
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Water') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType('Water')) {
				pokemon.maybeTrapped = true;
			}
		},
		flags: {breakable: 1},
	},

	// Lyna
	magicaura: {
		shortDesc: "Magic Guard + Magic Bounce.",
		name: "Magic Aura",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, source);
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable']) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, this.effectState.target, source);
			return null;
		},
		condition: {
			duration: 1,
		},
		flags: {breakable: 1},
	},

	// Mad Monty
	climatechange: {
		shortDesc: "1.5x SpA in sun, 1.5x Def/SpD in snow, heals 50% in rain. Changes forme/weather.",
		desc: "If this Pokemon is a Castform, it changes the active weather and therefore this Pokemon's forme and set at the end of each turn, alternating between sun, rain, and snow in that order. When the weather is sun, this Pokemon's Special Attack is multiplied by 1.5x. When the weather becomes rain, this Pokemon heals for 1/2 of its maximum HP. When the weather is snow, this Pokemon's Defense and Special Defense are multiplied by 1.5x.",
		name: "Climate Change",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
				this.field.setWeather('raindance');
				break;
			case 'raindance':
				this.field.setWeather('snow');
				break;
			default:
				this.field.setWeather('sunnyday');
				break;
			}
		},
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			let relevantMove = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') {
					forme = 'Castform-Sunny';
					relevantMove = 'Solar Beam';
				}
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				if (pokemon.species.id !== 'castformrainy') {
					forme = 'Castform-Rainy';
					relevantMove = 'Thunder';
					this.heal(pokemon.baseMaxhp / 2);
				}
				break;
			case 'hail':
			case 'snow':
				if (pokemon.species.id !== 'castformsnowy') {
					forme = 'Castform-Snowy';
					relevantMove = 'Aurora Veil';
				}
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '[msg]');

				if (!relevantMove) return;
				const move = this.dex.getActiveMove(relevantMove);

				const sketchIndex = Math.max(
					pokemon.moves.indexOf("solarbeam"), pokemon.moves.indexOf("thunder"), pokemon.moves.indexOf("auroraveil")
				);
				if (sketchIndex < 0) return;
				const carryOver = pokemon.moveSlots[sketchIndex].pp / pokemon.moveSlots[sketchIndex].maxpp;
				const sketchedMove = {
					move: move.name,
					id: move.id,
					pp: Math.floor((move.pp * 8 / 5) * carryOver),
					maxpp: (move.pp * 8 / 5),
					target: move.target,
					disabled: false,
					used: false,
				};
				pokemon.moveSlots[sketchIndex] = sketchedMove;
				pokemon.baseMoveSlots[sketchIndex] = sketchedMove;
			}
		},
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifyDef(def, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (['hail', 'snow'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		flags: {cantsuppress: 1},
	},

	// maroon
	builtdifferent: {
		shortDesc: "Stamina + Normal-type moves get +1 priority.",
		name: "Built Different",
		onDamagingHit(damage, target, source, effect) {
			this.boost({def: 1});
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Normal') return priority + 1;
		},
		flags: {},
	},

	// Mathy
	dynamictyping: {
		shortDesc: "Moves used by all Pokemon are ??? type.",
		name: "Dynamic Typing",
		onStart(pokemon) {
			this.add('-ability', pokemon, "Dynamic Typing");
		},
		onModifyTypePriority: 2,
		onAnyModifyType(move, pokemon, target) {
			move.type = "???";
		},
		flags: {},
	},

	// Merritty
	endround: {
		shortDesc: "Clears everything.",
		name: "End Round",
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'End Round');
			this.add('-message', 'A new round is starting! Resetting the field...');
			this.field.clearWeather();
			this.field.clearTerrain();
			for (const pseudoWeather of PSEUDO_WEATHERS) {
				this.field.removePseudoWeather(pseudoWeather);
			}
			for (const side of this.sides) {
				const remove = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
					'bioticorbfoe', 'bioticorbself', 'tailwind', 'luckychant', 'alting',
				];
				for (const sideCondition of remove) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] ability: End Round', '[of] ' + pokemon);
					}
				}
			}
			for (const mon of this.getAllActive()) {
				const volatilesToClear = [
					'substitute', 'aquaring', 'snack', 'attract', 'confusion', 'bide', 'partiallytrapped', 'perfectmimic',
					'mustrecharge', 'defensecurl', 'disable', 'focusenergy', 'dragoncheer', 'embargo', 'endure', 'gastroacid',
					'foresight', 'glaiverush', 'grudge', 'healblock', 'imprison', 'curse', 'leechseed', 'magnetrise', 'minimize',
					'miracleeye', 'nightmare', 'noretreat', 'octolock', 'lockedmove', 'powder', 'powershift', 'powertrick',
					'rage', 'ragepowder', 'roost', 'saltcure', 'smackdown', 'snatch', 'sparklingaria', 'spotlight', 'stockpile',
					'syrupbomb', 'tarshot', 'taunt', 'telekinesis', 'torment', 'uproar', 'yawn', 'flashfire', 'protosynthesis',
					'quarkdrive', 'slowstart', 'truant', 'unburden', 'metronome', 'beakblast', 'charge', 'echoedvoice', 'encore',
					'focuspunch', 'furycutter', 'gmaxcannonade', 'gmaxchistrike', 'gmaxvinelash', 'gmaxvolcalith', 'gmaxwildfire',
					'iceball', 'rollout', 'laserfocus', 'lockon', 'perishsong', 'shelltrap', 'throatchop', 'trapped', 'ultramystik',
					'choicelock', 'stall', 'catstampofapproval', 'beefed', 'boiled', 'flipped', 'therollingspheal', 'treasurebag',
					'torisstori', 'anyonecanbekilled', 'sigilsstorm', 'wonderwing', 'riseabove', 'superrollout', 'meatgrinder',
					'risingsword',
				];
				for (const volatile of volatilesToClear) {
					if (mon.volatiles[volatile]) {
						mon.removeVolatile(volatile);
						if (volatile === 'flipped') {
							changeSet(this, mon, ssbSets['Clementine']);
							this.add(`c:|${getName('Clementine')}|┬──┬◡ﾉ(° -°ﾉ)`);
						}
						this.add('-activate', pokemon, 'ability: End Round');
					}
				}
				mon.clearBoosts();
				this.add('-clearboost', mon, '[from] ability: End Round', '[of] ' + pokemon);
			}
		},
		flags: {cantsuppress: 1},
	},

	// Meteordash
	tatsuglare: {
		shortDesc: "Fur Coat + All moves hit off of Sp. Atk stat.",
		name: "TatsuGlare",
		onModifyMove(move, pokemon, target) {
			if (move.category !== "Status") move.overrideOffensiveStat = 'spa';
		},
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		flags: {breakable: 1},
	},

	// Mex
	timedilation: {
		shortDesc: "+10% BP for every 10 turns passed in battle, max 200%.",
		name: "Time Dilation",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			const turnMultiplier = Math.floor(this.turn / 10);
			let bpMod = 1 + (0.1 * turnMultiplier);
			if (bpMod > 2) bpMod = 2;
			return this.chainModify(bpMod);
		},
		flags: {},
	},

	// Monkey
	harambehit: {
		shortDesc: "Unseen Fist + Punch moves have 1.5x power.",
		name: "Harambe Hit",
		onModifyMove(move) {
			if (move.flags['contact']) delete move.flags['protect'];
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Harambe Hit boost');
				return this.chainModify([6144, 4096]);
			}
		},
		flags: {},
	},

	// MyPearl
	eoncall: {
		shortDesc: "Changes into Latios after status move, Latias after special move.",
		desc: "If this Pokemon is a Latios, it changes into Latias after using a status move. If this Pokemon is a Latias, it changes into Latios after using a special attack.",
		name: "Eon Call",
		onAfterMove(source, target, move) {
			if (move.category === 'Status' && source.species.baseSpecies === 'Latias') {
				changeSet(this, source, ssbSets['MyPearl'], true);
			} else if (move.category === 'Special' && source.species.baseSpecies === 'Latios') {
				changeSet(this, source, ssbSets['MyPearl-Latias'], true);
			}
		},
		flags: {},
	},

	// Neko
	weatherproof: {
		shortDesc: "Water-/Fire-type moves against this Pokemon deal damage with a halved offensive stat.",
		name: "Weatherproof",
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Weatherproof weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Fire') {
				this.debug('Weatherproof weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// Ney
	pranksterplus: {
		shortDesc: "This Pokemon's Status moves have priority raised by 1. Dark types are not immune.",
		name: "Prankster Plus",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				return priority + 1;
			}
		},
		flags: {},
	},

	// Notater517
	ventcrosser: {
		shortDesc: "Uses Baton Pass after every move.",
		name: "Vent Crosser",
		onAfterMove(source, target, move) {
			this.actions.useMove('Baton Pass', source);
		},
		flags: {},
	},

	// nya
	adorablegrace: {
		shortDesc: "This Pokemon's secondary effects and certain items have their activation chance doubled.",
		desc: "This Pokemon's secondary effects of attacks, as well as the effects of chance based items like Focus Band and King's Rock, have their activation chance doubled.",
		name: "Adorable Grace",
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		// Item chances modified in items.js
	},

	// Nyx
	lasthymn: {
		shortDesc: "Weakens incoming attacks by 10% for each Pokemon fainted.",
		name: "Last Hymn",
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Last Hymn');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onFoeBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				return this.chainModify([10, (10 + this.effectState.fallen)]);
			}
		},
	},

	// Opple
	orchardsgift: {
		shortDesc: "Summons Grassy Terrain. 1.5x Sp. Atk and Sp. Def during Grassy Terrain.",
		name: "Orchard's Gift",
		onStart(pokemon) {
			if (this.field.setTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'Orchard\'s Gift', '[source]');
			} else if (this.field.isTerrain('grassyterrain')) {
				this.add('-activate', pokemon, 'ability: Orchard\'s Gift');
			}
		},
		onModifyAtkPriority: 5,
		onModifySpA(spa, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Orchard\'s Gift boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				this.debug('Orchard\'s Gift boost');
				return this.chainModify(1.5);
			}
		},
	},

	// PartMan
	ctiershitposter: {
		shortDesc: "-1 Atk/SpA, +1 Def/SpD. +1 Atk/SpA/Spe, -1 Def/SpD, Mold Breaker if 420+ dmg taken.",
		desc: "When this Pokemon switches in, its Defense and Special Defense are boosted by 1 stage and its Attack and Special Attack are lowered by 1 stage. Once this Pokemon has taken total damage throughout the battle equal to or greater than 420 HP, it instead ignores the Abilities of opposing Pokemon when attacking and its existing stat stage changes are cleared. After this and whenever it gets sent out from this point onwards, this Pokemon boosts its Attack, Special Attack, and Speed by 1 stage, and lowers its Defense and Special Defense by 1 stage.",
		name: "C- Tier Shitposter",
		onDamage(damage, target, source, effect) {
			target.m.damageTaken ??= 0;
			target.m.damageTaken += damage;
			if (target.set && !target.set.shiny) {
				if (target.m.damageTaken >= 420) {
					target.set.shiny = true;
					if (!target.hp) {
						return this.add(`c:|${getName('PartMan')}|MWAHAHA NOW YOU - oh I'm dead`);
					}
					this.add(`c:|${getName('PartMan')}|That's it. Get ready to be rapid-fire hugged.`);
					target.clearBoosts();
					this.add('-clearboost', target);
					this.boost({atk: 1, def: -1, spa: 1, spd: -1, spe: 1});
					const details = target.species.name + (target.level === 100 ? '' : ', L' + target.level) +
						(target.gender === '' ? '' : ', ' + target.gender) + (target.set.shiny ? ', shiny' : '');
					target.details = details;
					this.add('detailschange', target, details);
				}
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.set.shiny) move.ignoreAbility = true;
		},
		onStart(pokemon) {
			if (!pokemon.set.shiny) {
				this.boost({atk: -1, def: 1, spa: -1, spd: 1});
			} else {
				this.boost({atk: 1, def: -1, spa: 1, spd: -1, spe: 1});
			}
		},
	},

	// Pastor Gigas
	godsmercy: {
		shortDesc: "Summons Misty Surge and cures the team's status conditions on switch-in.",
		name: "God's Mercy",
		onStart(source) {
			this.field.setTerrain('mistyterrain');
			const allies = [...source.side.pokemon, ...source.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && ally.hasAbility('sapsipper')) {
					continue;
				}
				ally.cureStatus();
			}
		},
		flags: {},
	},

	// PenQuin
	poleonspyroquirk: {
		shortDesc: "Burned Pokemon also become confused.",
		name: "'Poleon's Pyro Quirk",
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'brn') {
				target.addVolatile('confusion');
			}
		},
		flags: {},
	},

	// phoopes
	ididitagain: {
		shortDesc: "Bypasses Sleep Clause Mod once per battle.",
		name: "I Did It Again",
		flags: {},
		// implemented in rulesets.ts
	},

	// Pulse_kS
	pulseluck: {
		shortDesc: "Mega Launcher + Super Luck.",
		name: "Pulse Luck",
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		flags: {},
	},

	// PYRO
	hardcorehustle: {
		shortDesc: "Moves have 15% more power and -5% Acc for each fainted ally, up to 5 allies.",
		name: "Hardcore Hustle",
		onStart(pokemon) {
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Hardcore Hustle');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [1, 1.15, 1.3, 1.45, 1.6, 1.75];
				this.debug(`Hardcore Hustle boost: ${powMod[this.effectState.fallen]}`);
				return this.chainModify(powMod[this.effectState.fallen]);
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (this.effectState.fallen) {
				const accMod = [1, 0.95, 0.90, 0.85, 0.80, 0.75];
				this.debug(`Hardcore Hustle debuff: ${accMod[this.effectState.fallen]}`);
				return this.chainModify(accMod[this.effectState.fallen]);
			}
		},
		flags: {},
	},

	// Quite Quiet
	fancyscarf: {
		shortDesc: "Shield Dust + Magic Guard",
		name: "Fancy Scarf",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifySecondaries(secondaries) {
			this.debug('Fancy Scarf prevent secondary');
			return secondaries.filter(effect => !!(effect.self || effect.dustproof));
		},
		flags: {},
	},

	// quziel
	highperformancecomputing: {
		shortDesc: "Becomes a random typing at the beginning of each turn.",
		name: "High Performance Computing",
		flags: {},
		onResidual(source) {
			const type = this.sample(this.dex.types.names().filter(i => i !== 'Stellar'));
			if (source.setType(type)) {
				this.add('-start', source, 'typechange', type, '[from] ability: High Performance Computing');
			}
		},
	},

	// R8
	antipelau: {
		shortDesc: "Boosts Sp. Atk by 2 and sets a 25% Wish upon switch-in.",
		name: "Anti-Pelau",
		onStart(target) {
			this.boost({spa: 2}, target);
			const wish = this.dex.getActiveMove('wish');
			wish.condition = {
				duration: 2,
				onStart(pokemon, source) {
					this.effectState.hp = source.maxhp / 4;
				},
				onResidualOrder: 4,
				onEnd(pokemon) {
					if (pokemon && !pokemon.fainted) {
						const damage = this.heal(this.effectState.hp, pokemon, pokemon);
						if (damage) {
							this.add('-heal', pokemon, pokemon.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
						}
					}
				},
			};
			this.actions.useMove(wish, target);
		},
		flags: {},
	},

	// Rainshaft
	rainysaura: {
		shortDesc: "On switch-in, this Pokemon summons rain. Boosts all Psychic-type damage by 33%.",
		name: "Rainy's Aura",
		onStart(source) {
			if (this.suppressingAbility(source)) return;
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'kyogre') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('raindance');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Psychic') return;
			if (!move.auraBooster?.hasAbility('Rainy\'s Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		flags: {},
	},

	// Ransei
	ultramystik: {
		shortDesc: "Stats 1.5x until hit super effectively + Magic Guard + Leftovers.",
		desc: "This Pokemon can only be damaged by direct attacks. At the end of each turn, this Pokemon restores 1/16 of its maximum HP. This Pokemon's Attack, Defense, Special Attack, Special Defense, and Speed are boosted by 1.5x if it has not been hit by a super effective attack during this battle.",
		name: "Ultra Mystik",
		onStart(target) {
			if (!this.effectState.superHit) {
				target.addVolatile('ultramystik');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['ultramystik'];
			this.add('-end', pokemon, 'Ultra Mystik', '[silent]');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.effectState.superHit = true;
				target.removeVolatile('ultramystik');
				target.setAbility('Healer', null, true);
				target.baseAbility = target.ability;
			}
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				this.add('-activate', pokemon, 'ability: Ultra Mystik');
				this.add('-start', pokemon, 'ultramystik');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onModifySpe(spe, pokemon) {
				if (pokemon.ignoringAbility()) return;
				return this.chainModify(1.3);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Ultra Mystik');
			},
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon, pokemon.getAbility());
		},
	},

	// ReturnToMonkey
	monkeseemonkedo: {
		shortDesc: "Boosts Atk or SpA by 1 based on foe's defenses, then copies foe's Ability.",
		name: "Monke See Monke Do",
		onStart(pokemon) {
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({spa: 1});
			} else if (totalspd) {
				this.boost({atk: 1});
			}

			// n.b. only affects Hackmons
			// interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
				this.effectState.gaveUp = true;
			}
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield')) {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.gaveUp = true;
			}
		},
		onUpdate(pokemon) {
			if (!pokemon.isStarted || this.effectState.gaveUp) return;

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Monke See Monke Do', '[of] ' + target);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1},
	},

	// RSB
	hotpursuit: {
		shortDesc: "This Pokemon's damaging moves have the Pursuit effect.",
		name: "Hot Pursuit",
		onBeforeTurn(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('hotpursuit', pokemon);
				const data = side.getSideConditionData('hotpursuit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onBasePower(relayVar, source, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(source, target) {
			target.side.removeSideCondition('hotpursuit');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				const move = this.queue.willMove(pokemon.foes()[0]);
				const moveName = move && move.moveid ? move.moveid.toString() : "";
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon.foes()[0], 'ability: Hot Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source && action.choice === 'megaEvo') {
								this.actions.runMegaEvo(source);
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove(moveName, source, source.getLocOf(pokemon));
				}
			},
		},
		flags: {},
	},

	// Rumia
	youkaiofthedusk: {
		shortDesc: "This Pokemon's Defense is doubled and its status moves gain +1 priority.",
		name: "Youkai of the Dusk",
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		flags: {},
	},

	// SexyMalasada
	ancestryritual: {
		shortDesc: "Recoil heals. While below 50% HP, changes to Typhlosion-Hisui.",
		desc: "Moves that would deal recoil or crash damage, aside from Struggle, heal this Pokemon for the corresponding amount instead. If this Pokemon is a Typhlosion, it changes to Typhlosion-Hisui if it has 1/2 or less of its maximum HP at the end of a turn. If Typhlosion-Hisui's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Typhlosion.",
		name: "Ancestry Ritual",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') {
					this.heal(damage);
					return null;
				}
			}
		},
		onResidualOrder: 20,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Typhlosion' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.species.id !== 'typhlosionhisui') {
				pokemon.formeChange('Typhlosion-Hisui');
			} else if (pokemon.hp > pokemon.maxhp / 2 && pokemon.species.id === 'typhlosionhisui') {
				pokemon.formeChange('Typhlosion');
			}
		},
		flags: {},
	},

	// Siegfried
	magicalmysterycharge: {
		shortDesc: "Summons Electric Terrain upon switch-in, +1 boost to Sp. Def during Electric Terrain.",
		name: "Magical Mystery Charge",
		onStart(source) {
			this.field.setTerrain('electricterrain');
		},
		onModifySpDPriority: 5,
		onModifySpD(spd, pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(1.5);
			}
		},
		flags: {},
	},

	// Sificon
	perfectlyimperfect: {
		shortDesc: "Magic Guard + Thick Fat.",
		name: "Perfectly Imperfect",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Perfectly Imperfect weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Perfectly Imperfect weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// skies
	spikesofwrath: {
		shortDesc: "Cheek Pouch + sets Spikes and Toxic Spikes upon getting KOed.",
		name: "Spikes of Wrath",
		onDamagingHit(damage, target, source, effect) {
			if (!target.hp) {
				const side = source.isAlly(target) ? source.side.foe : source.side;
				const spikes = side.sideConditions['spikes'];
				const toxicSpikes = side.sideConditions['toxicspikes'];
				if (!spikes || spikes.layers < 3) {
					this.add('-activate', target, 'ability: Spikes of Wrath');
					side.addSideCondition('spikes', target);
				}
				if (!toxicSpikes || toxicSpikes.layers < 2) {
					this.add('-activate', target, 'ability: Spikes of Wrath');
					side.addSideCondition('toxicspikes', target);
				}
			}
		},
		onEatItem(item, pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
		},
		flags: {},
	},

	// Soft Flex
	adaptiveengineering: {
		shortDesc: "Every turn, raises a random stat by 1 stage if the foe has more raised stats.",
		name: "Adaptive Engineering",
		onResidual(source) {
			if (source === undefined || source.foes() === undefined || source.foes()[0] === undefined) return;
			if (source.positiveBoosts() < source.foes()[0].positiveBoosts()) {
				const stats: BoostID[] = [];
				let stat: BoostID;
				for (stat in source.boosts) {
					if (stat === 'accuracy' || stat === 'evasion') continue;
					if (source.boosts[stat] < 6) {
						stats.push(stat);
					}
				}
				if (stats.length) {
					const randomStat = this.sample(stats);
					this.boost({[randomStat]: 1}, source, source);
				}
			}
		},
		flags: {},
	},

	// Solaros & Lunaris
	ridethesun: {
		shortDesc: "Drought + Chlorophyll",
		name: "Ride the Sun!",
		onStart(source) {
			for (const action of this.queue) {
				if (action.choice === 'runPrimal' && action.pokemon === source && source.species.id === 'groudon') return;
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.field.setWeather('sunnyday');
		},
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// spoo
	icanheartheheartbeatingasone: {
		shortDesc: "Pixilate + Sharpness. -1 Atk upon KOing an opposing Pokemon.",
		name: "I Can Hear The Heart Beating As One",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
			if (move.flags['slicing']) {
				this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({atk: -length}, source);
			}
		},
		flags: {},
	},

	// Steorra
	ghostlyhallow: {
		shortDesc: "This Pokémon can hit Normal types with Ghost-type moves.",
		name: "Ghostly Hallow",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Ghost'] = true;
			}
		},
	},

	// Struchni
	overaskedclause: {
		shortDesc: "Moves used by opposing Pokemon on the previous turn will always fail.",
		name: "Overasked Clause",
		onFoeBeforeMove(target, source, move) {
			if (target.lastMove && target.lastMove.id !== 'struggle') {
				if (move.id === target.lastMove.id) {
					this.attrLastMove('[still]');
					this.add('cant', target, 'ability: Overasked Clause', move, '[of] ' + source);
					return false;
				}
			}
		},
	},

	// Sulo
	protectionofthegelatin: {
		shortDesc: "Magic Guard + Stamina",
		name: "Protection of the Gelatin",
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onDamagingHit(damage, target, source, effect) {
			this.boost({def: 1});
		},
	},

	// Swiffix
	stinky: {
		desc: "10% chance to either poison or paralyze the target on hit.",
		name: "Stinky",
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stinky psn/par');
				if (!move.secondaries) move.secondaries = [];
				move.secondaries.push({
					chance: 10,
					onHit(target, source) {
						const result = this.random(2);
						if (result === 0) {
							target.trySetStatus('par', source);
						} else {
							target.trySetStatus('psn', source);
						}
					},
				});
			}
		},
		flags: {},
	},

	// Tenshi
	sandsleuth: {
		desc: "Sets Gravity and identifies foes on switch-in. Priority immune from identified foes.",
		name: "Sand Sleuth",
		onStart(target) {
			this.field.addPseudoWeather('gravity', target);
			for (const opponent of target.adjacentFoes()) {
				if (!opponent.volatiles['foresight']) {
					opponent.addVolatile('foresight');
				}
			}
		},
		onFoeTryMove(target, source, move) {
			if (target.volatiles['foresight']) {
				const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
				if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
					return;
				}
				const dazzlingHolder = this.effectState.target;
				if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
					this.attrLastMove('[still]');
					this.add('cant', target, 'ability: Sand Sleuth', move, '[of] ' + source);
					return false;
				}
			}
		},
		flags: {},
	},

	// Theia
	powerabuse: {
		shortDesc: "Drought + 60% damage reduction + 20% burn after physical move.",
		name: "Power Abuse",
		onStart() {
			this.field.setWeather('sunnyday');
		},
		onSourceModifyDamage() {
			return this.chainModify(0.4);
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === "Physical" && this.randomChance(1, 5)) {
				source.trySetStatus('brn', target);
			}
		},
		flags: {breakable: 1},
	},

	// Tico
	eternalgenerator: {
		shortDesc: "Regenerator + Magic Guard + immune to Sticky Web.",
		name: "Eternal Generator",
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: {breakable: 1},
	},

	// TheJesucristoOsAma
	thegraceofjesuschrist: {
		shortDesc: "Changes plates at the end of every turn.",
		name: "The Grace Of Jesus Christ",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const plates = this.dex.items.all().filter(item => item.onPlate && !item.zMove);
			const item = this.sample(plates.filter(plate => this.toID(plate) !== this.toID(pokemon.item)));
			pokemon.item = '';
			this.add('-item', pokemon, item, '[from] ability: The Grace Of Jesus Christ');
			pokemon.setItem(item);
			pokemon.formeChange("Arceus-" + item.onPlate!, this.dex.abilities.get('thegraceofjesuschrist'), true);
		},
		flags: {},
	},

	// trace
	eyesofeternity: {
		shortDesc: "Moves used by/against this Pokemon always hit; only damaged by attacks.",
		name: "Eyes of Eternity",
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		flags: {},
	},

	// Two of Roses
	aswesee: {
		shortDesc: "1x per turn: Stat gets boosted -> 50% chance to copy, 15% to raise another.",
		desc: "Once per turn, when any active Pokemon has a stat boosted, this Pokemon has a 50% chance of copying it and a 15% chance to raise another random stat.",
		name: "As We See",
		onFoeAfterBoost(boost, target, source, effect) { // Opportunist
			if (this.randomChance(1, 2)) {
				if (effect && ['As We See', 'Mirror Herb', 'Opportunist'].includes(effect.name)) return;
				const pokemon = this.effectState.target;
				const positiveBoosts: Partial<BoostsTable> = {};
				let i: BoostID;
				for (i in boost) {
					if (boost[i]! > 0) {
						positiveBoosts[i] = boost[i];
					}
				}
				if (Object.keys(positiveBoosts).length < 1) return;
				this.boost(positiveBoosts, pokemon);
				this.effectState.triggered = true;
			}
		},
		onResidual(target, source, effect) {
			if (this.randomChance(15, 100) && this.effectState.triggered) {
				const stats: BoostID[] = [];
				const boost: SparseBoostsTable = {};
				let statPlus: BoostID;
				for (statPlus in target.boosts) {
					if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
					if (target.boosts[statPlus] < 6) {
						stats.push(statPlus);
					}
				}
				const randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
				if (randomStat) boost[randomStat] = 1;
				this.boost(boost, target, target);
			}
			this.effectState.triggered = false;
		},
		flags: {},
	},

	// UT
	galeguard: {
		shortDesc: "Mountaineer + Fur Coat.",
		name: "Gale Guard",
		onDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Stealth Rock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		onModifyDef(def) {
			return this.chainModify(2);
		},
		flags: {breakable: 1},
	},

	// umuwo
	soulsurfer: {
		name: "Soul Surfer",
		shortDesc: "Drizzle + Surge Surfer.",
		onStart(source) {
			this.field.setWeather('raindance');
		},
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		flags: {},
	},

	// Valerian
	fullbloom: {
		shortDesc: "This Pokémon's priority moves have double power.",
		name: "Full Bloom",
		onBasePowerPriority: 30,
		onBasePower(basePower, pokemon, target, move) {
			if (move.priority > 0) {
				return this.chainModify(2);
			}
		},
	},

	// Venous
	concreteoverwater: {
		shortDesc: "Gains +1 Defense and Sp. Def before getting hit by a super effective move.",
		name: "Concrete Over Water",
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (target.runEffectiveness(move) > 0) {
				this.boost({def: 1, spd: 1}, target);
			}
		},
		flags: {},
	},

	// Violet
	seenoevilhearnoevilspeaknoevil: {
		shortDesc: "Dark immune; Cornerstone: Sound immune. Wellspring: Moves never miss. Hearthflame: 1.3x BP vs male.",
		desc: "This Pokemon is immune to Dark-type attacks. If this Pokemon is Ogerpon-Cornerstone, it is immune to sound moves. If this Pokemon is Ogerpon-Wellspring, its moves will never miss. If this Pokemon is Ogerpon-Hearthflame, its damage against male targets is multiplied by 1.3x.",
		name: "See No Evil, Hear No Evil, Speak No Evil",
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound'] && target.species.id.startsWith('ogerponcornerstone')) {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: See No Evil, Hear No Evil, Speak No Evil');
				}
				return null;
			}

			if (target !== source && move.type === 'Dark') {
				this.add('-immune', target, '[from] ability: See No Evil, Hear No Evil, Speak No Evil');
				return null;
			}
		},
		onSourceAccuracy(accuracy, target, source, move) {
			if (!source.species.id.startsWith('ogerponwellspring')) return;
			if (typeof accuracy !== 'number') return;
			return true;
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (!source.species.id.startsWith('ogerponwellspring')) return;
			if (typeof move.accuracy === 'number' && move.accuracy < 100) {
				this.debug('neutralize');
				return this.chainModify(0.75);
			}
		},
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (!attacker.species.id.startsWith('ogerponhearthflame')) return;
			if (defender.gender === 'M') {
				this.debug('attack boost');
				return this.chainModify(1.3);
			}
		},
		flags: {breakable: 1},
	},

	// Vistar
	virtualidol: {
		shortDesc: "Dancer + Punk Rock.",
		name: "Virtual Idol",
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock weaken');
				return this.chainModify(0.5);
			}
		},
		flags: {breakable: 1},
	},

	// vmnunes
	wildgrowth: {
		shortDesc: "Attacking moves also inflict Leech Seed on the target.",
		name: "Wild Growth",
		onModifyMovePriority: -1,
		onAfterMove(source, target, move) {
			if (target.hasType('Grass') || target.hasAbility('Sap Sipper') || !move.hit || target === source) return null;
			target.addVolatile('leechseed', source);
		},
		flags: {},
	},

	// WarriorGallade
	primevalharvest: {
		shortDesc: "Sun: Heal 1/8 max HP, random berry if no item. Else 50% random berry if no item.",
		desc: "In Sun, the user restores 1/8th of its maximum HP at the end of the turn and has a 100% chance to get a random berry if it has no item. Outside of sun, there is a 50% chance to get a random berry. Berry given will be one of: Cheri, Chesto, Pecha, Lum, Aguav, Liechi, Ganlon, Petaya, Apicot, Salac, Micle, Lansat, Enigma, Custap, Kee or Maranga.",
		name: "Primeval Harvest",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const isSunny = this.field.isWeather(['sunnyday', 'desolateland']);
			if (isSunny) {
				this.heal(pokemon.baseMaxhp / 8, pokemon, pokemon, pokemon.getAbility());
			}
			if (isSunny || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item) {
					const berry = this.sample([
						'cheri', 'chesto', 'pecha', 'lum', 'aguav', 'liechi', 'ganlon', 'petaya',
						'apicot', 'salac', 'micle', 'lansat', 'enigma', 'custap', 'kee', 'maranga',
					]) + 'berry';
					pokemon.setItem(berry);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Primeval Harvest');
				}
			}
		},
		flags: {},
	},

	// WigglyTree
	treestance: {
		shortDesc: "Rock Head + Filter.",
		name: "Tree Stance",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Tree Stance neutralize');
				return this.chainModify(0.75);
			}
		},
		flags: {breakable: 1},
	},

	// xy01
	panic: {
		shortDesc: "Lowers the foe's Atk and Sp. Atk by 1 upon switch-in.",
		name: "Panic",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Panic', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({atk: -1, spa: -1}, target, pokemon, null, true);
				}
			}
		},
		flags: {},
	},

	// Yellow Paint
	yellowmagic: {
		shortDesc: "+25% HP, +1 SpA, +1 Spe, Charge, or paralyzes attacker when hit by an Electric move; Electric immunity.",
		desc: "This Pokemon is immune to Electric type moves. When this Pokemon is hit by one, it either: restores 25% of its maximum HP, boosts its Special Attack by 1 stage, boosts its Speed by 1 stage, gains the Charge effect, or paralyzes the attacker.",
		name: "Yellow Magic",
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				let didSomething = false;
				switch (this.random(5)) {
				case 0:
					didSomething = !!this.heal(target.baseMaxhp / 4);
					break;
				case 1:
					didSomething = !!this.boost({spa: 1}, target, target);
					break;
				case 2:
					didSomething = !!this.boost({spe: 1}, target, target);
					break;
				case 3:
					if (!target.volatiles['charge']) {
						this.add('-ability', target, 'Yellow Magic');
						target.addVolatile('charge', target);
						didSomething = true;
					}
					break;
				case 4:
					didSomething = source.trySetStatus('par', target);
					break;
				}
				if (!didSomething) {
					this.add('-immune', target, '[from] ability: Yellow Magic');
				}
				return null;
			}
		},
		flags: {breakable: 1},
	},

	// yeet dab xd
	treasurebag: {
		shortDesc: "Cycles between Blast Seed, Oran Berry, Petrify Orb, Luminous Orb and Reviver Seed.",
		name: "Treasure Bag",
		onStart(target) {
			this.add('-ability', target, 'Treasure Bag');
			target.addVolatile('treasurebag');
		},
		onResidual(target, source, effect) {
			if (!target.volatiles['treasurebag']) target.addVolatile('treasurebag');
		},
		condition: {
			onStart(pokemon, source, sourceEffect) {
				if (!pokemon.m.bag) {
					pokemon.m.bag = ['Blast Seed', 'Oran Berry', 'Petrify Orb', 'Luminous Orb', 'Reviver Seed'];
				}
			},
			onEnd(target) {
				delete target.volatiles['treasurebag'];
			},
			onResidual(pokemon, source, effect) {
				if (!pokemon.m.bag) {
					pokemon.m.bag = ['Blast Seed', 'Oran Berry', 'Petrify Orb', 'Luminous Orb', 'Reviver Seed'];
				}
				if (!pokemon.m.cycledTreasureBag) {
					const currentItem = pokemon.m.bag.shift();
					const foe = pokemon.foes()[0];
					switch (currentItem) {
					case 'Blast Seed': {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
						if (foe) {
							this.damage(100, foe, pokemon, this.effect);
						} else {
							this.add('-message', `But there was no target!`);
						}
						break;
					}
					case 'Oran Berry': {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found an ${currentItem}!`);
						this.heal(100, pokemon, pokemon, this.dex.items.get('Oran Berry'));
						break;
					}
					case 'Petrify Orb': {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
						if (foe?.trySetStatus('par', pokemon, this.effect)) {
							this.add('-message', `${pokemon.name} petrified ${foe.name}`);
						} else if (!foe) {
							this.add('-message', `But there was no target!`);
						} else {
							this.add('-message', `But it failed!`);
						}
						break;
					}
					case 'Luminous Orb': {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a ${currentItem}!`);
						if (!pokemon.side.addSideCondition('auroraveil', pokemon, this.effect)) {
							this.add('-message', `But it failed!`);
						}
						break;
					}
					// Handled separately
					case 'Reviver Seed': {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a Reviver Seed!`);
						break;
					}
					}
					pokemon.m.bag = [...pokemon.m.bag, currentItem];
				}
				delete pokemon.m.cycledTreasureBag;
			},
			onDamage(damage, pokemon, source, effect) {
				if (damage >= pokemon.hp && pokemon.m.bag?.[0] === 'Reviver Seed') {
					pokemon.m.seedActive = true;
					if (!pokemon.m.reviverSeedTriggered) {
						// Can't set hp to 0 because it causes visual bugs
						pokemon.hp = 1;
						this.add('-damage', pokemon, pokemon.getHealth, '[silent]');
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} dug through its Treasure Bag and found a Reviver Seed!`);
						pokemon.m.reviverSeedTriggered = true;
						pokemon.hp = Math.floor(pokemon.maxhp / 2);
						this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
						this.add('-message', `${pokemon.name} was revived!`);
						return 0;
					} else {
						this.add('-activate', pokemon, 'ability: Treasure Bag');
						this.add('-message', `${pokemon.name} was revived!`);
						this.add('-message', `...thought it was the right one...`);
						this.add('-message', `...looking closer, this is...`);
						this.add('-message', `Not a Reviver Seed, but a Reviser Seed!`);
						this.add(`c:|${getName('yeet dab xd')}|An "s"?`);
						this.add('-message', `that wasn't a "v", but an "s"!`);
						this.add('-message', `yeet dab xd burst into spontaneous laughter and fainted!`);
						return damage;
					}
				}
			},
		},
	},

	// yuki
	partyup: {
		shortDesc: "On switch-in, this Pokemon's ability is replaced with a random teammate's ability.",
		name: "Party Up",
		onStart(target) {
			this.add('-ability', target, 'Party Up');
			const abilities = target.side.pokemon.map(x => x.getAbility()).filter(x => !x.flags['notrace']);
			target.setAbility(this.sample(abilities), target);
			this.add('-ability', target, target.getAbility().name);
		},
		flags: {notrace: 1},
	},

	// YveltalNL
	heightadvantage: {
		shortDesc: "If this Pokemon's height is more than that of the foe, -1 to foe's Attack/Sp. Atk.",
		name: "Height Advantage",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Height Advantage', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					if (this.dex.species.get(pokemon.species).heightm > this.dex.species.get(target.species).heightm) {
						this.boost({atk: -1, spa: -1}, target, pokemon, null, true);
					}
				}
			}
		},
		flags: {},
	},

	// za
	troll: {
		shortDesc: "Using moves that can flinch makes user move first in their priority bracket.",
		name: "Troll",
		onFractionalPriority(priority, pokemon, target, move) {
			if (move?.secondaries?.some(m => m.volatileStatus === 'flinch')) {
				this.add('-activate', pokemon, 'ability: Troll');
				return 0.1;
			}
		},
	},

	// Zarel
	tempochange: {
		shortDesc: "Switches Meloetta's forme between Aria and Pirouette at the end of each turn.",
		name: "Tempo Change",
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Meloetta') return;
			if (pokemon.species.name === 'Meloetta') {
				changeSet(this, pokemon, ssbSets['Zarel-Pirouette'], true);
			} else {
				changeSet(this, pokemon, ssbSets['Zarel'], true);
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1},
	},

	// zoro
	ninelives: {
		shortDesc: "Twice per battle, this Pokemon will survive a lethal hit with 1 HP remaining, regardless of HP.",
		name: "Nine Lives",
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Nine Lives');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect?.effectType === 'Move' && !this.effectState.busted) {
				this.add('-ability', target, 'Nine Lives');
				if (this.effectState.busted === 0) {
					this.effectState.busted = 1;
				} else {
					this.effectState.busted = 0;
				}
				return target.hp - 1;
			}
		},
		// Yes, this looks very patchwork-y. declaring new persistent global variables seems to be a no-go here
		// so i repurposed one which should likely not affect anything else - have tested with clerica/zoro on both sides
		// and their disguise/sturdy state is unaffected by modifying anything here. but let wg know if this breaks stuff.
		flags: {breakable: 1},
	},

	// Modified abilities
	baddreams: {
		inherit: true,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility(['comatose', 'mensiscage'])) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
	},
	deltastream: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'deltastream' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'desolateland' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	dryskin: {
		inherit: true,
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea' || effect.id === 'stormsurge') {
				this.heal(target.baseMaxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
	},
	forecast: {
		inherit: true,
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
			case 'stormsurge':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'snow':
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
	},
	hydration: {
		inherit: true,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea', 'stormsurge'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
	},
	neutralizinggas: {
		inherit: true,
		onPreStart(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (STRONG_WEATHERS.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
			}
		},
	},
	overcoat: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes' || type === 'hail' || type === 'powder') return false;
		},
	},
	primordialsea: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			if (this.field.getWeather().id === 'primordialsea' && !STRONG_WEATHERS.includes(weather.id)) return false;
		},
	},
	raindish: {
		inherit: true,
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea' || effect.id === 'stormsurge') {
				this.heal(target.baseMaxhp / 16);
			}
		},
	},
	sandforce: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
	},
	sandveil: {
		inherit: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'deserteddunes') return false;
		},
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['sandstorm', 'deserteddunes'])) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
	},
	swiftswim: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea', 'stormsurge'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
	},
 */
};
