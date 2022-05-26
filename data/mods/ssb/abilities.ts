import {SSBSet, ssbSets} from "./random-teams";
import {getName} from './conditions';

/**
 * Assigns a new set to a Pokémon
 * @param pokemon the Pokemon to assign the set to
 * @param newSet the SSBSet to assign
 */
export function changeSet(context: Battle, pokemon: Pokemon, newSet: SSBSet, changeAbility = false) {
	if (pokemon.transformed) return;
	const evs: StatsTable = {
		hp: newSet.evs?.hp || 0,
		atk: newSet.evs?.atk || 0,
		def: newSet.evs?.def || 0,
		spa: newSet.evs?.spa || 0,
		spd: newSet.evs?.spd || 0,
		spe: newSet.evs?.spe || 0,
	};
	const ivs: StatsTable = {
		hp: newSet.ivs?.hp || 31,
		atk: newSet.ivs?.atk || 31,
		def: newSet.ivs?.def || 31,
		spa: newSet.ivs?.spa || 31,
		spd: newSet.ivs?.spd || 31,
		spe: newSet.ivs?.spe || 31,
	};
	pokemon.set.evs = evs;
	pokemon.set.ivs = ivs;
	if (newSet.nature) pokemon.set.nature = Array.isArray(newSet.nature) ? context.sample(newSet.nature) : newSet.nature;
	const oldShiny = pokemon.set.shiny;
	pokemon.set.shiny = (typeof newSet.shiny === 'number') ? context.randomChance(1, newSet.shiny) : !!newSet.shiny;
	let percent = (pokemon.hp / pokemon.baseMaxhp);
	if (newSet.species === 'Shedinja') percent = 1;
	pokemon.formeChange(newSet.species, context.effect, true);
	const details = pokemon.species.name + (pokemon.level === 100 ? '' : ', L' + pokemon.level) +
		(pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
	if (oldShiny !== pokemon.set.shiny) context.add('replace', pokemon, details);
	if (changeAbility) pokemon.setAbility(newSet.ability as string);

	pokemon.baseMaxhp = pokemon.species.name === 'Shedinja' ? 1 : Math.floor(Math.floor(
		2 * pokemon.species.baseStats.hp + pokemon.set.ivs.hp + Math.floor(pokemon.set.evs.hp / 4) + 100
	) * pokemon.level / 100 + 10);
	const newMaxHP = pokemon.baseMaxhp;
	pokemon.hp = Math.round(newMaxHP * percent);
	pokemon.maxhp = newMaxHP;
	context.add('-heal', pokemon, pokemon.getHealth, '[silent]');
	if (pokemon.item) {
		let item = newSet.item;
		if (typeof item !== 'string') item = item[context.random(item.length)];
		if (context.toID(item) !== (pokemon.item || pokemon.lastItem)) pokemon.setItem(item);
	}
	if (!pokemon.m.datacorrupt) {
		const newMoves = changeMoves(context, pokemon, newSet.moves.concat(newSet.signatureMove));
		pokemon.moveSlots = newMoves;
		// @ts-ignore Necessary so pokemon doesn't get 8 moves
		pokemon.baseMoveSlots = newMoves;
	}
	context.add('-ability', pokemon, `${pokemon.getAbility().name}`);
	context.add('message', `${pokemon.name} changed form!`);
}

/**
 * Assigns new moves to a Pokemon
 * @param pokemon The Pokemon whose moveset is to be modified
 * @param newSet The set whose moves should be assigned
 */
export function changeMoves(context: Battle, pokemon: Pokemon, newMoves: (string | string[])[]) {
	const carryOver = pokemon.moveSlots.slice().map(m => m.pp / m.maxpp);
	// In case there are ever less than 4 moves
	while (carryOver.length < 4) {
		carryOver.push(1);
	}
	const result = [];
	let slot = 0;
	for (const newMove of newMoves) {
		const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
		const move = context.dex.moves.get(context.toID(moveName));
		if (!move.id) continue;
		const moveSlot = {
			move: move.name,
			id: move.id,
			// eslint-disable-next-line max-len
			pp: ((move.noPPBoosts || move.isZ) ? Math.floor(move.pp * carryOver[slot]) : Math.floor((move.pp * (8 / 5)) * carryOver[slot])),
			maxpp: ((move.noPPBoosts || move.isZ) ? move.pp : move.pp * 8 / 5),
			target: move.target,
			disabled: false,
			disabledSource: '',
			used: false,
		};
		result.push(moveSlot);
		slot++;
	}
	return result;
}

export const Abilities: {[k: string]: ModdedAbilityData} = {
	// A Resident No-Life
	slowburn: {
		desc: "This Pokemon fully heals if it gets KO'd; gains Focus Energy on switch-in, +1 Speed on turn 1, Magnet Rise on turn 2, +2 Attack on turn 3, and fully heals on turn 4.",
		shortDesc: "Fully heals if KO'd; buffed per turn.",
		onStart(pokemon) {
			pokemon.addVolatile('focusenergy');
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns === 1) this.boost({spe: 1});
			if (pokemon.activeTurns === 2) pokemon.addVolatile('magnetrise');
			if (pokemon.activeTurns === 3) this.boost({atk: 2});
			if (pokemon.activeTurns === 4) this.heal(pokemon.maxhp);
		},
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect && effect.effectType === 'Move' && !this.effectState.slowburn) {
				this.effectState.slowburn = true;
				this.add('-ability', target, 'Slow Burn');
				return target.hp - 1;
			}
			if (this.effectState.slowburn) {
				this.heal(target.maxhp);
				this.effectState.slowburn = false;
			}
		},
		isBreakable: true,
		name: "Slow Burn",
		gen: 8,
	},
	
	// A Resident No-Life
	powerunleashed: {
		desc: "This Pokemon uses Refresh and Misty Terrain on switch-in; ignores protection, screens and substitutes; moves sacrifice secondary effects to deal 1.25x damage.",
		shortDesc: "Refresh and Misty Terrain on switch-in; ignores protection, screens and substitutes; no secondary effects for 1.25x damage.",
		onStart(pokemon) {
			this.actions.useMove('Refresh', pokemon);
			this.actions.useMove('Misty Terrain', pokemon);
		},
		onModifyMove(move, pokemon) {
			move.infiltrates = true;
			delete move.flags['protect'];
			if (move.secondaries) {
				delete move.secondaries;
				delete move.self;
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				move.hasPowerUnleashed = true;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasPowerUnleashed) return this.chainModify(1.25);
		},
		name: "Power Unleashed",
		gen: 8,
	},
	
	// Brookeee
	aggression: {
		desc: "This Pokemon's attack is raised by 1 stage after it is damaged by a move; half damage received at full HP.",
		shortDesc: "+1 Atk whenever hit; 0.5x damage taken at full HP.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Aggression weaken');
				return this.chainModify(0.5);
			}
		},
		onDamagingHit(damage, target, source, effect) {
			this.boost({atk: 1});
		},
		isBreakable: true,
		name: "Aggression",
		gen: 8,
	},

	// El Capitan
	ironwill: {
		desc: "This Pokemon's attacks deal 1.5x damage to a target that is switching in; takes 0.75x damage from attacks on switch-in.",
		shortDesc: "1.5x damage to switch; 0.75x taken on switch-in.",
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Iron Will boost');
				return this.chainModify(1.5);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (!source.activeTurns) {
				this.debug('Iron Will neutralize');
				return this.chainModify(0.75);
			}
		},
		isBreakable: true,
		name: "Iron Will",
		gen: 8,
	},

	// Finger
	dualreceptors: {
		shortDesc: "This Pokemon's attacking stats are boosted by x1.33.",
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			this.debug('Dual Receptors boost');
			return this.chainModify([5448, 4096]);
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			this.debug('Dual Receptors boost');
			return this.chainModify([5448, 4096]);
		},
		isPermanent: true,
		name: "Dual Receptors",
		gen: 8,
	},

	// flufi
	heromorale: {
		desc: "This Pokemon's contact moves deal 1.25x damage; survives an attack that would KO it with 1 HP.",
		shortDesc: "1.25x damage on contact; survives KO.",
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify(1.25);
			}
		},
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect && effect.effectType === 'Move' && !this.effectState.heromorale) {
				this.effectState.heromorale = true;
				this.add('-ability', target, 'Hero Morale');
				return target.hp - 1;
			}
		},
		isBreakable: true,
		name: "Hero Morale",
		gen: 8,
	},

	// Genwunner
	bestgen: {
		desc: "This Pokemon has +1 critical hit ratio; Blizzard has 90% accuracy; no recharge on KO; Special stats are combined.",
		shortDesc: "+1 crit rate; 90% acc Blizzard; no recharge on KO; combined Special.",
		onModifyCritRatio(critRatio) {
			return critRatio + 1
		},
		onModifyMove(move) {
			if (move.id === 'Blizzard') move.accuracy = 90;
		},
		onBoost(boost, target, source, effect) {
			if (boost.spa) {
				boost.spd = boost.spa;
			}
			if (boost.spd) {
				boost.spa = boost.spd;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) {
				if (pokemon.volatiles['mustrecharge']) {
					delete pokemon.volatiles['mustrecharge'];
				}
			}
		},
		isPermanent: true,
		name: "Best Gen",
		gen: 8,
	},

	// Horrific17
	fairfight: {
		desc: "This Pokemon uses Magic Room, Haze and Fairy Lock on switch-in; Extreme Speed is 120 BP.",
		shortDesc: "Magic Room, Haze and Fairy Lock on switch-in; 120 BP Extreme Speed.",
		onStart(pokemon) {
			this.actions.useMove('Magic Room', pokemon);
			this.actions.useMove('Haze', pokemon);
			this.actions.useMove('Fairy Lock', pokemon);
		},
		onModifyMove(move) {
			if (move.id === 'Extreme Speed') move.basePower = 120;
		},
		name: "Fair Fight",
		gen: 8,
	},
	
	// Kaiser Dragon
	elementalshift: {
		desc: "On switch-in and at the end of every turn, this Pokemon changes its type to a random one.",
		shortDesc: "Random type on switch-in and per turn.",
		onStart(pokemon) {
			let r = this.random(17);
			if (r === 1) {
				this.add('-start', pokemon, 'typechange', 'Normal');
				pokemon.types = ['Normal'];
			} else if (r === 2) {
				this.add('-start', pokemon, 'typechange', 'Fighting');
				pokemon.types = ['Fighting'];
			} else if (r === 3) {
				this.add('-start', pokemon, 'typechange', 'Flying');
				pokemon.types = ['Flying'];
			} else if (r === 4) {
				this.add('-start', pokemon, 'typechange', 'Poison');
				pokemon.types = ['Poison'];
			} else if (r === 5) {
				this.add('-start', pokemon, 'typechange', 'Ground');
				pokemon.types = ['Ground'];
			} else if (r === 6) {
				this.add('-start', pokemon, 'typechange', 'Rock');
				pokemon.types = ['Rock'];
			} else if (r === 7) {
				this.add('-start', pokemon, 'typechange', 'Bug');
				pokemon.types = ['Bug'];
			} else if (r === 8) {
				this.add('-start', pokemon, 'typechange', 'Ghost');
				pokemon.types = ['Ghost'];
			} else if (r === 9) {
				this.add('-start', pokemon, 'typechange', 'Steel');
				pokemon.types = ['Steel'];
			} else if (r === 10) {
				this.add('-start', pokemon, 'typechange', 'Fire');
				pokemon.types = ['Fire'];
			} else if (r === 11) {
				this.add('-start', pokemon, 'typechange', 'Water');
				pokemon.types = ['Water'];
			} else if (r === 12) {
				this.add('-start', pokemon, 'typechange', 'Grass');
				pokemon.types = ['Grass'];
			} else if (r === 13) {
				this.add('-start', pokemon, 'typechange', 'Electric');
				pokemon.types = ['Electric'];
			} else if (r === 14) {
				this.add('-start', pokemon, 'typechange', 'Psychic');
				pokemon.types = ['Psychic'];
			} else if (r === 15) {
				this.add('-start', pokemon, 'typechange', 'Ice');
				pokemon.types = ['Ice'];
			} else if (r === 16) {
				this.add('-start', pokemon, 'typechange', 'Dragon');
				pokemon.types = ['Dragon'];
			} else if (r === 17) {
				this.add('-start', pokemon, 'typechange', 'Dark');
				pokemon.types = ['Dark'];
			} else {
				this.add('-start', pokemon, 'typechange', 'Fairy');
				pokemon.types = ['Fairy'];
			}
		},
		onResidualOrder: 26,
		onResidualSubOrder: 1,
		onResidual(pokemon) {
			let r = this.random(17);
			if (r === 1) {
				this.add('-start', pokemon, 'typechange', 'Normal');
				pokemon.types = ['Normal'];
			} else if (r === 2) {
				this.add('-start', pokemon, 'typechange', 'Fighting');
				pokemon.types = ['Fighting'];
			} else if (r === 3) {
				this.add('-start', pokemon, 'typechange', 'Flying');
				pokemon.types = ['Flying'];
			} else if (r === 4) {
				this.add('-start', pokemon, 'typechange', 'Poison');
				pokemon.types = ['Poison'];
			} else if (r === 5) {
				this.add('-start', pokemon, 'typechange', 'Ground');
				pokemon.types = ['Ground'];
			} else if (r === 6) {
				this.add('-start', pokemon, 'typechange', 'Rock');
				pokemon.types = ['Rock'];
			} else if (r === 7) {
				this.add('-start', pokemon, 'typechange', 'Bug');
				pokemon.types = ['Bug'];
			} else if (r === 8) {
				this.add('-start', pokemon, 'typechange', 'Ghost');
				pokemon.types = ['Ghost'];
			} else if (r === 9) {
				this.add('-start', pokemon, 'typechange', 'Steel');
				pokemon.types = ['Steel'];
			} else if (r === 10) {
				this.add('-start', pokemon, 'typechange', 'Fire');
				pokemon.types = ['Fire'];
			} else if (r === 11) {
				this.add('-start', pokemon, 'typechange', 'Water');
				pokemon.types = ['Water'];
			} else if (r === 12) {
				this.add('-start', pokemon, 'typechange', 'Grass');
				pokemon.types = ['Grass'];
			} else if (r === 13) {
				this.add('-start', pokemon, 'typechange', 'Electric');
				pokemon.types = ['Electric'];
			} else if (r === 14) {
				this.add('-start', pokemon, 'typechange', 'Psychic');
				pokemon.types = ['Psychic'];
			} else if (r === 15) {
				this.add('-start', pokemon, 'typechange', 'Ice');
				pokemon.types = ['Ice'];
			} else if (r === 16) {
				this.add('-start', pokemon, 'typechange', 'Dragon');
				pokemon.types = ['Dragon'];
			} else if (r === 17) {
				this.add('-start', pokemon, 'typechange', 'Dark');
				pokemon.types = ['Dark'];
			} else {
				this.add('-start', pokemon, 'typechange', 'Fairy');
				pokemon.types = ['Fairy'];
			}
		},
		isPermanent: true,
		name: "Elemental Shift",
		gen: 8,
	},

	// LandoriumZ
	retaliation: {
		desc: "This Pokemon moves last among Pokemon using the same or greater priority moves; evasiveness is doubled if confused, 1.25x otherwise; damage is doubled if not damaged.",
		shortDesc: "Moves last; 2x evasiveness if confused, 1.25x otherwise; 2x damage if not hit.",
		onFractionalPriority: -0.1,
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Retaliation - decreasing accuracy');
				return this.chainModify(0.4);
			} else {
				return this.chainModify(0.8);
			}
		},
		onBasePowerPriority: 31,
		onBasePower(basePower, pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some(p => p.source === target && p.damage > 0 && p.thisTurn);
			if (!damagedByTarget) {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		isBreakable: true,
		name: "Retaliation",
		gen: 8,
	},

	// Mayie
	finalprayer: {
		desc: "This Pokemon uses Wish when switching in; Safeguard when switching out.",
		shortDesc: "Wish on switch-in; Safeguard on switch-out.",
		onStart(pokemon) {
			this.actions.useMove('Wish', pokemon);
		},
		onSwitchOut(pokemon) {
			this.actions.useMove('Safeguard', pokemon);
		},
		name: "Final Prayer",
		gen: 8,
	},

	// Omega
	burnheal: {
		desc: "This Pokemon heals 1/8 of max HP per turn when burned.",
		shortDesc: "+1/8 HP/turn when burned.",
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		name: "Burn Heal",
		gen: 8,
	},
	
	// Satori
	mindreading: {
		desc: "This Pokemon uses Mind Reader and Torment on switch-in.",
		shortDesc: "Mind Reader and Torment on switch-in.",
		onStart(pokemon) {
			this.actions.useMove('Mind Reader', pokemon);
			this.actions.useMove('Torment', pokemon);
		},
		name: "Mind Reading",
		gen: 8,
	},
	
	// Tonberry
	vindictive: {
		desc: "This Pokemon deals double damage to the target if an ally fainted last turn.",
		shortDesc: "2x damage if an ally fainted last turn.",
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		name: "Vindictive",
		gen: 8,
	},
};
