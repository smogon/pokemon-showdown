import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import {
	calculateTotalExpForLevel, calculateStats, getMove, levelUp, handleLearningMoves, checkEvolution,
	getActiveSlots, getActiveParty, TYPE_CHART, INITIAL_STAT_STAGES, applyStatChange, checkStatDropAbilities,
	activateUnburden, applySynchronize, handleHPDropEffects, consumeBerry
} from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, Status, BattleState, Stats, Move, AbilityContext } from './interface';
import { TYPE_RESIST_BERRIES, ITEMS_DATABASE } from './items';
import { getPlayerData } from './core';
import { GameConfig } from './game-config';
import { MANUAL_CATCH_RATES, MANUAL_BASE_EXP, MANUAL_EV_YIELDS } from './data-exp-evs-catch-rates';
import { RPGMoves } from './battle-moves';

// #region Handlers & Dispatch Tables

const DEFENSIVE_ABILITY_HANDLERS: Record<string, (a: ActivePokemonSlot, d: ActivePokemonSlot, m: Move, dmg: number, b: BattleState, log: string[]) => void> = {
	'justified': (a, d, m, dmg, b, log) => { if (m.type === 'Dark') applyStatChange(d, 'atk', 1, b, log, d, "Justified"); },
	'rattled': (a, d, m, dmg, b, log) => { if (['Bug', 'Dark', 'Ghost'].includes(m.type)) applyStatChange(d, 'spe', 1, b, log, d, "Rattled"); },
	'stamina': (a, d, m, dmg, b, log) => applyStatChange(d, 'def', 1, b, log, d, "Stamina"),
	'weakarmor': (a, d, m, dmg, b, log) => {
		if (m.category === 'Physical') {
			if (d.statStages.def > -6) { d.statStages.def--; log.push(`${d.pokemon.species}'s Weak Armor lowered its Defense!`); }
			applyStatChange(d, 'spe', 2, b, log, d, "Weak Armor");
		}
	},
	'angerpoint': (a, d, m, dmg, b, log) => { /* Critical check handled in caller */ },
	'berserk': (a, d, m, dmg, b, log) => {
		if (d.pokemon.hp < d.pokemon.maxHp / 2 && (d.pokemon.hp + dmg) >= d.pokemon.maxHp / 2) applyStatChange(d, 'spa', 1, b, log, d, "Berserk");
	},
	'thermalexchange': (a, d, m, dmg, b, log) => { if (m.type === 'Fire') applyStatChange(d, 'atk', 1, b, log, d, "Thermal Exchange"); },
	'cottondown': (a, d, m, dmg, b, log) => {
		if (m.category !== 'Status') {
			const opponents = b.playerSlots.some(s => s?.pokemon.id === d.pokemon.id) ? b.opponentSlots : b.playerSlots;
			if (opponents.some(s => s && s.pokemon.hp > 0 && applyStatChange(s, 'spe', -1, b, log, d))) {
				log.push(`${d.pokemon.species}'s Cotton Down lowered the Speed of opposing Pokémon!`);
			}
		}
	},
	'seedsower': (a, d, m, dmg, b, log) => { if (b.terrain?.type !== 'grassy') { b.terrain = { type: 'grassy', turns: 5 }; log.push(`${d.pokemon.species}'s Seed Sower created Grassy Terrain!`); } },
	'sandspit': (a, d, m, dmg, b, log) => { if (b.weather?.type !== 'sand') { b.weather = { type: 'sand', turns: 5 }; log.push(`${d.pokemon.species}'s Sand Spit created a sandstorm!`); } },
	'steamengine': (a, d, m, dmg, b, log) => { if (['Fire', 'Water'].includes(m.type)) applyStatChange(d, 'spe', 6, b, log, d, "Steam Engine"); },
	'toxicdebris': (a, d, m, dmg, b, log) => {
		if (m.category === 'Physical') {
			const hazards = b.playerSlots.some(s => s?.pokemon.id === d.pokemon.id) ? b.opponentHazards : b.playerHazards;
			if (hazards.filter(h => h === 'toxicspikes').length < 2) { hazards.push('toxicspikes'); log.push(`${d.pokemon.species}'s Toxic Debris scattered Toxic Spikes!`); }
		}
	},
	'gulpmissile': (a, d, m, dmg, b, log) => {
		const form = (d as any).gulpMissileForm;
		if (form && a.pokemon.hp > 0) {
			const dmgAmt = Math.floor(a.pokemon.maxHp / 4);
			a.pokemon.hp = Math.max(0, a.pokemon.hp - dmgAmt);
			log.push(`${d.pokemon.species} spit out its catch at ${a.pokemon.species}!`);
			if (form === 'gulping') applyStatChange(a, 'def', -1, b, log, d);
			else if (form === 'gorging' && !a.status && !Dex.species.get(a.pokemon.species).types.includes('Electric')) {
				a.status = 'par'; log.push(`${a.pokemon.species} was paralyzed!`);
			}
			if (d.pokemon.species.includes('Gulping') || d.pokemon.species.includes('Gorging')) d.pokemon.species = 'Cramorant';
			(d as any).gulpMissileForm = null;
		}
	},
	'angershell': (a, d, m, dmg, b, log) => {
		if (d.pokemon.hp < d.pokemon.maxHp / 2 && (d.pokemon.hp + dmg) >= d.pokemon.maxHp / 2) {
			['def', 'spd'].forEach(s => applyStatChange(d, s as any, -1, b, log, d));
			['atk', 'spa', 'spe'].forEach(s => applyStatChange(d, s as any, 1, b, log, d));
			log.push(`${d.pokemon.species}'s Anger Shell activated!`);
		}
	}
};

const MOVE_POST_HIT_HANDLERS: Record<string, (a: ActivePokemonSlot, d: ActivePokemonSlot, m: Move, b: BattleState, log: string[], successful: boolean) => void> = {
	'knockoff': (a, d, m, b, log, success) => {
		if (success && d.pokemon.hp > 0 && d.pokemon.item) {
			if (d.substitute) log.push(`But ${d.pokemon.species}'s Substitute blocked the item removal!`);
			else if (RPGAbilities.checkItemRemovalPrevention(d.pokemon)) log.push(`${d.pokemon.species}'s ${d.pokemon.ability} prevents its item from being removed!`);
			else {
				log.push(`${a.pokemon.species} knocked off ${d.pokemon.species}'s ${ITEMS_DATABASE[d.pokemon.item]?.name || d.pokemon.item}!`);
				d.pokemon.item = undefined; activateUnburden(d, log);
			}
		}
	},
	'rapidspin': (a, d, m, b, log, success) => {
		if (success && a.pokemon.hp > 0) {
			const hazards = b.playerSlots.some(s => s?.pokemon.id === a.pokemon.id) ? b.playerHazards : b.opponentHazards;
			if (hazards.length > 0) { hazards.length = 0; log.push(`${a.pokemon.species} blew away the hazards!`); }
			if (a.isSeeded) { a.isSeeded = false; log.push(`${a.pokemon.species} shook off the Leech Seed!`); }
			applyStatChange(a, 'spe', 1, b, log, a);
		}
	},
	'clearsmog': (a, d, m, b, log, success) => {
		if (success && d.pokemon.hp > 0) { d.statStages = { ...INITIAL_STAT_STAGES }; log.push(`${d.pokemon.species}'s stat changes were reset!`); }
	},
	'steelroller': (a, d, m, b, log, success) => {
		if (success && b.terrain) {
			log.push(`The ${b.terrain.type.charAt(0).toUpperCase() + b.terrain.type.slice(1)} Terrain was removed!`); b.terrain = undefined;
		}
	},
	'terablast': (a, d, m, b, log, success) => {
		if (success && a.terastallized === 'Stellar') {
			applyStatChange(a, 'atk', -1, b, log, a); applyStatChange(a, 'spa', -1, b, log, a);
		}
	},
	'dragontail': (a, d, m, b, log) => handleForceSwitch(d, b, log),
	'circlethrow': (a, d, m, b, log) => handleForceSwitch(d, b, log),
	'wakeupslap': (a, d, m, b, log) => { if (d.status === 'slp' && d.pokemon.hp > 0) { d.status = null; d.sleepCounter = 0; log.push(`${d.pokemon.species} woke up!`); } },
	'smellingsalts': (a, d, m, b, log) => { if (d.status === 'par' && d.pokemon.hp > 0) { d.status = null; log.push(`${d.pokemon.species} was cured of paralysis!`); } },
	'jawlock': (a, d, m, b, log) => {
		if (d.pokemon.hp > 0 && a.pokemon.hp > 0 && !Dex.species.get(d.pokemon.species).types.includes('Ghost')) {
			if (!d.isTrapped) { d.isTrapped = { turns: 5 }; log.push(`${d.pokemon.species} can no longer escape!`); }
			if (!a.isTrapped) { a.isTrapped = { turns: 5 }; log.push(`${a.pokemon.species} can no longer escape!`); }
		}
	},
	'anchorshot': (a, d, m, b, log) => handleTrapMove(d, log),
	'spiritshackle': (a, d, m, b, log) => handleTrapMove(d, log),
	'thousandwaves': (a, d, m, b, log) => handleTrapMove(d, log)
};

const BALL_HANDLERS: Record<string, (a: ActivePokemonSlot, d: ActivePokemonSlot, b: BattleState) => number> = {
	'greatball': () => 1.5,
	'ultraball': () => 2,
	'masterball': () => 255,
	'fastball': (a, d) => Dex.species.get(d.pokemon.species).baseStats.spe >= 100 ? 4 : 1,
	'levelball': (a, d) => a.pokemon.level >= d.pokemon.level * 4 ? 8 : a.pokemon.level >= d.pokemon.level * 2 ? 4 : a.pokemon.level > d.pokemon.level ? 2 : 1,
	'nestball': (a, d) => d.pokemon.level <= 30 ? Math.max(1, (41 - d.pokemon.level) / 10) : 1,
	'netball': (a, d) => { const types = Dex.species.get(d.pokemon.species).types; return (types.includes('Bug') || types.includes('Water')) ? 3.5 : 1; },
	'quickball': (a, d, b) => b.turn === 0 ? 5 : 1,
	'timerball': (a, d, b) => Math.min(4, 1 + b.turn * (1229 / 4096)),
	'dreamball': (a, d) => d.status === 'slp' ? 4 : 1
};

// #endregion

// #region Core Processing

export function handleDamagingMove(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState, messageLog: string[], spreadMultiplier: number) {
	if (RPGMoves.handleDamagingMovePreamble(attackerSlot, defenderSlot, move, battle, messageLog)) return;

	const attacker = attackerSlot.pokemon;
	const hitCount = RPGAbilities.getMultiHitCount(attacker, move);
	const hasParentalBond = RPGAbilities.hasParentalBond(attacker);
	const totalHits = hasParentalBond && hitCount === 1 ? 2 : hitCount;
	let moveWasSuccessful = false;

	if (totalHits > 1) messageLog.push(hasParentalBond ? ` <i style="color: #6c757d;">(Parental Bond hit twice!)</i>` : ` <i style="color: #6c757d;">(It hit ${totalHits} times!)</i>`);

	for (let i = 0; i < totalHits; i++) {
		const spread = (hasParentalBond && i === 1) ? spreadMultiplier * 0.25 : spreadMultiplier;
		const result = calculateDamage(attackerSlot, defenderSlot, move.id, battle, spread);
		
		if (result.effectiveness > 0 || move.id === 'spitup') moveWasSuccessful = true;
		if (result.berryConsumed) {
			messageLog.push(`${defenderSlot.pokemon.species}'s ${ITEMS_DATABASE[result.berryConsumed]?.name} weakened the attack!`);
			consumeBerry(defenderSlot, result.berryConsumed, messageLog);
		}

		const context = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
		const damageDealt = applyDamageAndEnduranceEffects(defenderSlot, result.damage, move, battle, messageLog, context);

		if (damageDealt > 0 && move.category !== 'Status') defenderSlot.lastDamageTaken = { amount: damageDealt, category: move.category, from: attacker.id };
		messageLog.push((totalHits > 1 ? `Dealt ${damageDealt} damage!` : `<i style="color: #007bff;">(${damageDealt} damage)</i>`) + result.message);

		if (damageDealt > 0) {
			processPostHit(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, result.effectiveness, result.isCritical, context);
		}
		
		applyRecoilAndSelfEffects(attackerSlot, move, battle, messageLog, damageDealt, moveWasSuccessful);
		
		// Move Specific Post-Hit Logic
		if (MOVE_POST_HIT_HANDLERS[move.id]) MOVE_POST_HIT_HANDLERS[move.id](attackerSlot, defenderSlot, move, battle, messageLog, moveWasSuccessful);

		if (defenderSlot.pokemon.hp <= 0) break;
	}

	if (moveWasSuccessful && defenderSlot.pokemon.hp > 0) {
		applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog });
	}
}

function processPostHit(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, move: Move, battle: BattleState, log: string[], dmg: number, eff: number, crit: boolean, ctx: AbilityContext) {
	const a = aSlot.pokemon; const d = dSlot.pokemon;
	
	// Items & Balloons
	if (battle.magicRoomTurns === 0 && d.hp > 0 && d.item === 'airballoon' && move.category !== 'Status') {
		log.push(`${d.species}'s Air Balloon popped!`); d.item = undefined; activateUnburden(dSlot, log);
	}

	// Drain & Shell Bell
	if (move.drain && a.hp < a.maxHp) {
		if (toID(d.ability || '') === 'liquidooze' && !RPGAbilities.isAbilityIgnored(a, d, 'liquidooze')) {
			if (RPGAbilities.takesIndirectDamage(a)) {
				a.hp = Math.max(0, a.hp - Math.floor(dmg * (move.drain[0] / move.drain[1])));
				log.push(`${a.species} was hurt by Liquid Ooze!`);
			}
		} else if (aSlot.healBlockTurns > 0) log.push(`${a.species} can't restore HP due to Heal Block!`);
		else {
			a.hp = Math.min(a.maxHp, a.hp + Math.floor(dmg * (move.drain[0] / move.drain[1])));
			log.push(`${d.species} had its energy drained!`);
		}
	}
	if (battle.magicRoomTurns === 0 && a.item === 'shellbell' && a.hp < a.maxHp && aSlot.healBlockTurns <= 0) {
		a.hp = Math.min(a.maxHp, a.hp + Math.max(1, Math.floor(dmg / 8))); log.push(`${a.species} restored HP with Shell Bell!`);
	}

	applyPostDamageContactEffects(aSlot, dSlot, move, battle, log, dmg, eff, ctx, crit);

	// Abilities
	const ability = toID(d.ability || '');
	if (DEFENSIVE_ABILITY_HANDLERS[ability]) DEFENSIVE_ABILITY_HANDLERS[ability](aSlot, dSlot, move, dmg, battle, log);
	if (crit && ability === 'angerpoint' && !RPGAbilities.isAbilityIgnored(a, d, ability)) applyStatChange(dSlot, 'atk', 6, battle, log, dSlot, "Anger Point");

	handleHPDropEffects(dSlot, battle, log);
}

export function handleStatusMove(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot | null, move: Move, battle: BattleState, messageLog: string[]) {
	const a = attackerSlot.pokemon; const d = defenderSlot?.pokemon;
	if (toID(a.ability || '') === 'prankster' && d && Dex.species.get(d.species).types.includes('Dark')) {
		messageLog.push(`${d.species} is immune to Prankster!`); return;
	}
	if (d && move.target !== 'self' && !move.flags.heal) {
		if (getCustomEffectiveness(move.type, Dex.species.get(d.species).types, d, battle, a) === 0) {
			messageLog.push(`It doesn't affect ${d.species}...`); return;
		}
	}

	const modules = [
		RPGMoves.handleSpecificStatusMove, RPGMoves.handleGenericBoostMove, RPGMoves.handleGenericStatusInflictMove,
		RPGMoves.handleGenericVolatileMove, RPGMoves.handleGenericFieldMove, RPGMoves.handleGenericSideMove,
		(as: any, ds: any, m: Move, b: any, l: any) => RPGMoves.handleGenericHealMove(as, m, l)
	];

	for (const mod of modules) {
		if (mod(attackerSlot, defenderSlot, move, battle, messageLog)) return;
	}
	if (move.selfSwitch) return;
	messageLog.push('But it failed!');
}

// #endregion

// #region Damage Calculation

export function calculateDamage(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, moveId: string, battle: BattleState, spreadMultiplier: number): { damage: number, message: string, effectiveness: number, berryConsumed?: string, isCritical: boolean } {
	const move = { ...getMove(moveId) };
	const a = attackerSlot.pokemon; const d = defenderSlot.pokemon;
	const ctx: any = { attacker: a, defender: d, attackerSlot, defenderSlot, move, battle, messageLog: [] };

	if (move.flags.powder && Dex.species.get(d.species).types.includes('Grass')) return { damage: 0, message: ' (Immune to powder)', effectiveness: 0, isCritical: false };
	const immunity = RPGAbilities.checkImmunity(ctx);
	if (immunity?.immune) return { damage: 0, message: ` (${immunity.message})`, effectiveness: 0, isCritical: false };

	// Fixed Damage
	if (!move.basePower) {
		const fixed: Record<string, number> = { 'dragonrage': 40, 'sonicboom': 20, 'seismictoss': a.level, 'nightshade': a.level, 'superfang': Math.floor(d.hp / 2) };
		if (fixed[move.id]) return { damage: fixed[move.id], message: '', effectiveness: 1, isCritical: false };
		if (move.id === 'psywave') return { damage: Math.floor(Math.random() * a.level * 1.5) + 1, message: '', effectiveness: 1, isCritical: false };
		return { damage: 0, message: ' (No effect)', effectiveness: 1, isCritical: false };
	}

	if (move.id === 'terablast' && attackerSlot.terastallized) {
		if (a.atk > a.spa) move.category = 'Physical';
		if (attackerSlot.terastallized === 'Stellar') move.basePower = 100;
	}

	let bp = RPGMoves.getDamageBasePower(move, a, d, attackerSlot, defenderSlot, battle);
	if (bp === -1) {
		d.hp = Math.min(d.maxHp, d.hp + Math.floor(d.maxHp * 0.25));
		return { damage: 0, message: ` (${d.species} was healed!)`, effectiveness: 0, isCritical: false };
	}

	const moveType = getMoveType(move, a, attackerSlot, battle, ctx);
	ctx.move.type = moveType;
	bp = RPGAbilities.applyPowerModifier(ctx, bp);

	let atkStat = getDamageOffense(move, a, attackerSlot, battle, ctx);
	let defStat = getDamageDefense(move, d, defenderSlot, battle);
	
	// Unaware
	if (toID(a.ability || '') === 'unaware') defStat = d[move.category === 'Special' ? (battle.wonderRoomTurns ? 'def' : 'spd') : (battle.wonderRoomTurns ? 'spd' : 'def')];
	if (toID(d.ability || '') === 'unaware') atkStat = a[move.category === 'Special' ? 'spa' : 'atk'];

	const getStageMult = (stage: number) => (stage >= 0 ? (2 + stage) / 2 : 2 / (2 + Math.abs(stage)));
	
	let atkStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	if (move.id === 'foulplay') atkStage = defenderSlot.statStages.atk;
	if (move.id === 'bodypress') atkStage = attackerSlot.statStages.def;
	
	let defStage = move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def;
	if (battle.wonderRoomTurns > 0) defStage = move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd;
	if (['psyshock', 'psystrike', 'secretsword'].includes(move.id)) defStage = battle.wonderRoomTurns > 0 ? defenderSlot.statStages.spd : defenderSlot.statStages.def;

	// Unaware logic override (use base stats if unaware triggers)
	if (toID(a.ability || '') === 'unaware' && !RPGAbilities.isAbilityIgnored(a, d, 'unaware')) defStage = 0;
	if (toID(d.ability || '') === 'unaware' && !RPGAbilities.isAbilityIgnored(a, d, 'unaware')) atkStage = 0;

	let finalAtk = Math.max(1, Math.floor(atkStat * getStageMult(atkStage)));
	let finalDef = Math.max(1, Math.floor(defStat * getStageMult(defStage)));

	if (attackerSlot.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && toID(a.ability || '') !== 'guts') finalAtk = Math.floor(finalAtk / 2);
	if (['explosion', 'selfdestruct'].includes(move.id)) finalDef = Math.floor(finalDef * 0.5);

	const critChance = getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const isCrit = Math.random() < critChance;
	const critMult = isCrit ? (toID(a.ability || '') === 'sniper' ? 2.25 : 1.5) : 1;
	const stab = RPGAbilities.getSTABMultiplier(a, moveType, attackerSlot);
	let eff = (moveId === 'struggle') ? 1 : getCustomEffectiveness(moveType, getPokemonTypes(d, defenderSlot), d, battle, a);
	
	let berryConsumed: string | undefined;
	if (battle.magicRoomTurns === 0 && d.item && TYPE_RESIST_BERRIES[d.item] === moveType && eff > 1) {
		eff /= 2; berryConsumed = d.item;
	}

	const baseDmg = Math.floor((((2 * a.level / 5 + 2) * bp * (finalAtk / finalDef)) / 50) + 2);
	let dmg = applyFinalDamageModifiers(baseDmg, move, moveType, a, d, attackerSlot, defenderSlot, battle, eff, isCrit, ctx);
	
	dmg = Math.max(1, Math.floor(dmg * stab * eff * critMult * (Math.floor(Math.random() * 16 + 85) / 100) * spreadMultiplier));

	let msg = "";
	if (isCrit) msg += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (eff > 1) msg += ` <i style="color: #28a745;">It's super effective!</i>`;
	else if (eff < 1 && eff > 0) msg += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	else if (eff === 0) msg = ` <i style="color: #6c757d;">It had no effect on ${d.species}!</i>`;

	return { damage: dmg, message: msg, effectiveness: eff, berryConsumed, isCritical: isCrit };
}

export function getDamageOffense(move: Move, attacker: RPGPokemon, slot: ActivePokemonSlot, battle: BattleState, ctx: AbilityContext): number {
	const isSp = move.category === 'Special';
	let stat: keyof Stats = isSp ? 'spa' : 'atk';
	let raw = attacker[stat];

	if (move.id === 'foulplay') { raw = ctx.defender.atk; stat = 'atk'; }
	if (move.id === 'bodypress') { raw = attacker.def; stat = 'def'; }

	raw = RPGAbilities.applyAbilityStatModifier(attacker, stat, raw, slot, battle);
	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSp) raw = Math.floor(raw * 1.5);
		if (attacker.item === 'choicespecs' && isSp) raw = Math.floor(raw * 1.5);
	}
	if (isSp && battle.weather?.type.includes('sun') && toID(attacker.ability || '') === 'solarpower') raw = Math.floor(raw * 1.5);
	return raw;
}

export function getDamageDefense(move: Move, defender: RPGPokemon, slot: ActivePokemonSlot, battle: BattleState): number {
	const isSp = move.category === 'Special';
	const stat: keyof Stats = (isSp && !['psyshock', 'psystrike', 'secretsword'].includes(move.id)) ? 'spd' : 'def';
	const useStat = battle.wonderRoomTurns > 0 ? (stat === 'def' ? 'spd' : 'def') : stat;
	
	let raw = RPGAbilities.applyAbilityStatModifier(defender, useStat, defender[useStat], slot, battle);

	if (battle.magicRoomTurns === 0) {
		if (defender.item === 'assaultvest' && isSp && battle.wonderRoomTurns === 0) raw = Math.floor(raw * 1.5);
		if (defender.item === 'eviolite' && Dex.species.get(defender.species).evos?.length) raw = Math.floor(raw * 1.5);
	}
	if (battle.weather?.type === 'sand' && isSp && Dex.species.get(defender.species).types.includes('Rock')) raw = Math.floor(raw * 1.5);
	if (battle.weather?.type === 'hail' && !isSp && Dex.species.get(defender.species).types.includes('Ice')) raw = Math.floor(raw * 1.5);
	return raw;
}

export function getMoveType(move: Move, attacker: RPGPokemon, slot: ActivePokemonSlot, battle: BattleState, ctx: AbilityContext): string {
	let type = move.type;
	if (move.id === 'terablast' && slot.terastallized) type = slot.terastallized;
	else if (move.id === 'weatherball' && battle.weather) {
		const map: any = { sun: 'Fire', rain: 'Water', sand: 'Rock', hail: 'Ice' };
		if (map[battle.weather.type]) type = map[battle.weather.type];
	} else if ((move.id === 'terrainpulse' || (move.id === 'weatherball' && !battle.weather)) && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		const map: any = { electric: 'Electric', grassy: 'Grass', psychic: 'Psychic', misty: 'Fairy' };
		if (map[battle.terrain.type]) type = map[battle.terrain.type];
	}
	return RPGAbilities.applyTypeModifier(ctx, type);
}

export function applyFinalDamageModifiers(damage: number, move: Move, type: string, a: RPGPokemon, d: RPGPokemon, aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, b: BattleState, eff: number, crit: boolean, ctx: AbilityContext): number {
	const isPlayerD = b.playerSlots.some(s => s?.pokemon.id === d.id);
	if (toID(a.ability || '') !== 'infiltrator' && !crit) {
		if ((isPlayerD ? b.playerAuroraVeilTurns : b.opponentAuroraVeilTurns) > 0) damage = Math.floor(damage * 0.5);
		else if (move.category === 'Physical' && (isPlayerD ? b.playerReflectTurns : b.opponentReflectTurns) > 0) damage = Math.floor(damage * 0.5);
		else if (move.category === 'Special' && (isPlayerD ? b.playerLightScreenTurns : b.opponentLightScreenTurns) > 0) damage = Math.floor(damage * 0.5);
	}

	if (b.weather?.type.includes('sun')) damage = Math.floor(damage * (type === 'Fire' ? 1.5 : type === 'Water' ? 0.5 : 1));
	if (b.weather?.type.includes('rain')) damage = Math.floor(damage * (type === 'Water' ? 1.5 : type === 'Fire' ? 0.5 : 1));

	if (b.terrain) {
		const gA = RPGAbilities.isGrounded(a, b);
		const gD = RPGAbilities.isGrounded(d, b);
		if (gA && ((b.terrain.type === 'electric' && type === 'Electric') || (b.terrain.type === 'grassy' && type === 'Grass') || (b.terrain.type === 'psychic' && type === 'Psychic'))) damage = Math.floor(damage * 1.3);
		if (gD && b.terrain.type === 'misty' && type === 'Dragon') damage = Math.floor(damage * 0.5);
		if (gD && b.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id)) damage = Math.floor(damage * 0.5);
	}

	if ((b.mudSportTurns > 0 && type === 'Electric') || (b.waterSportTurns > 0 && type === 'Fire')) damage = Math.floor(damage * 0.33);

	damage = RPGAbilities.applyDamageModifier(ctx, damage);
	if (b.magicRoomTurns === 0) {
		if (a.item === 'lifeorb') damage = Math.floor(damage * 1.3);
		if (a.item === 'expertbelt' && eff > 1) damage = Math.floor(damage * 1.2);
	}
	return damage;
}

// #endregion

// #region Helper Functions

export function getCriticalHitChance(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	const dAbil = toID(dSlot.pokemon.ability || '');
	if (!RPGAbilities.isAbilityIgnored(aSlot.pokemon, dSlot.pokemon, dAbil) && ['battlearmor', 'shellarmor'].includes(dAbil)) return 0;
	if (['frostbreath', 'stormthrow', 'zipzapzap', 'surginstrikes'].includes(move.id) || (toID(aSlot.pokemon.ability || '') === 'merciless' && ['psn', 'tox'].includes(dSlot.status || ''))) return 1;

	let stage = 0;
	if (aSlot.focusEnergy) stage += 2;
	if (['slash', 'razorleaf', 'stoneedge', 'nightslash', 'shadowclaw', 'crosschop', 'attackorder'].includes(move.id)) stage++; // Simplified list
	if (battle.magicRoomTurns === 0 && ['scopelens', 'razorclaw'].includes(aSlot.pokemon.item || '')) stage++;
	if (toID(aSlot.pokemon.ability || '') === 'superluck') stage++;
	return [1 / 24, 1 / 8, 1 / 2, 1][Math.min(stage, 3)];
}

export function applyDamageAndEnduranceEffects(slot: ActivePokemonSlot, dmg: number, move: Move, battle: BattleState, log: string[], ctx: AbilityContext): number {
	const p = slot.pokemon;
	if (slot.isDisguised && dmg > 0 && move.category !== 'Status') {
		slot.isDisguised = false;
		if (p.species === 'Mimikyu') p.species = 'Mimikyu-Busted';
		log.push(`<strong>${p.species}'s Disguise was broken!</strong>`);
		slot.lastMoveThatHitMe = move; return 0;
	}
	if (slot.substitute && dmg > 0 && !move.flags.bypasssub && toID(ctx.attacker.ability || '') !== 'infiltrator') {
		if (dmg >= slot.substitute.hp) { slot.substitute = undefined; log.push(`The substitute took the hit and broke!`); }
		else { slot.substitute.hp -= dmg; log.push(`The substitute took the hit!`); }
		slot.lastMoveThatHitMe = move; return 0;
	}

	if (dmg >= p.hp) {
		if (battle.magicRoomTurns === 0 && p.item === 'focussash' && p.hp === p.maxHp) {
			dmg = p.hp - 1; log.push(`${p.species} held on using its Focus Sash!`); p.item = undefined; activateUnburden(slot, log);
		} else if (toID(p.ability || '') === 'sturdy' && p.hp === p.maxHp && !move.ohko && !RPGAbilities.isAbilityIgnored(ctx.attacker, p, 'sturdy')) {
			dmg = p.hp - 1; log.push(`${p.species} held on using its Sturdy!`);
		}
	}
	p.hp = Math.max(0, p.hp - dmg);
	if (dmg > 0) slot.lastMoveThatHitMe = move;
	return dmg;
}

export function applyPostDamageContactEffects(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, move: Move, battle: BattleState, log: string[], dmg: number, eff: number, ctx: AbilityContext, crit: boolean) {
	const a = aSlot.pokemon; const d = dSlot.pokemon;
	if (d.hp <= 0 || dmg <= 0) return;

	if (battle.magicRoomTurns === 0) {
		if (move.category === 'Physical' && d.item === 'keberry' && applyStatChange(dSlot, 'def', 1, battle, log, dSlot, "Kee Berry")) consumeBerry(dSlot, 'keberry', log);
		if (move.category === 'Special' && d.item === 'marangaberry' && applyStatChange(dSlot, 'spd', 1, battle, log, dSlot, "Maranga Berry")) consumeBerry(dSlot, 'marangaberry', log);
		if (d.item === 'weaknesspolicy' && eff > 1) {
			if (applyStatChange(dSlot, 'atk', 2, battle, log, dSlot) || applyStatChange(dSlot, 'spa', 2, battle, log, dSlot)) {
				log.push(`${d.species}'s Weakness Policy was activated!`); d.item = undefined; activateUnburden(dSlot, log);
			}
		}
		if (d.item === 'redcard' && a.hp > 0) handleRedCard(aSlot, dSlot, battle, log);
	}

	const isContact = move.flags.contact && toID(a.ability || '') !== 'longreach';
	if (isContact && a.hp > 0) {
		if (battle.magicRoomTurns === 0) {
			if (d.item === 'rockyhelmet' && RPGAbilities.takesIndirectDamage(a)) { a.hp = Math.max(0, a.hp - Math.floor(a.maxHp / 6)); log.push(`${a.species} was hurt by Rocky Helmet!`); }
			if (d.item === 'jabocaberry' && RPGAbilities.takesIndirectDamage(a)) { a.hp = Math.max(0, a.hp - Math.floor(a.maxHp / 8)); log.push(`${a.species} was hurt by Jaboca Berry!`); consumeBerry(dSlot, 'jabocaberry', log); }
		}
		if (a.hp > 0) RPGAbilities.applyContactAbilityEffects(ctx);
	}

	if (move.category === 'Special' && a.hp > 0 && battle.magicRoomTurns === 0 && d.item === 'rowapberry' && RPGAbilities.takesIndirectDamage(a)) {
		a.hp = Math.max(0, a.hp - Math.floor(a.maxHp / 8)); log.push(`${a.species} was hurt by Rowap Berry!`); consumeBerry(dSlot, 'rowapberry', log);
	}
	if (toID(d.ability || '') === 'cursedbody' && a.hp > 0 && !aSlot.disabledMove && Math.random() < 0.3 && !RPGAbilities.isAbilityIgnored(a, d, 'cursedbody')) {
		aSlot.disabledMove = { moveId: move.id, turns: 4 }; log.push(`${a.species}'s ${move.name} was disabled by Cursed Body!`);
	}
}

export function applyRecoilAndSelfEffects(aSlot: ActivePokemonSlot, move: Move, battle: BattleState, log: string[], dmg: number, success: boolean) {
	const a = aSlot.pokemon;
	if (a.hp <= 0) return;
	let recoil = false;

	if (['mindblown', 'steelbeam'].includes(move.id)) {
		if (!RPGAbilities.preventsRecoil(a)) { a.hp = Math.max(0, a.hp - Math.floor(a.maxHp / 2)); log.push(`${a.species} took recoil!`); recoil = true; }
	} else if (battle.magicRoomTurns === 0 && a.item === 'lifeorb' && toID(a.ability || '') !== 'sheerforce' && RPGAbilities.takesIndirectDamage(a)) {
		a.hp = Math.max(0, a.hp - Math.floor(a.maxHp / 10)); log.push(`${a.species} was hurt by its Life Orb!`); recoil = true;
	} else if (move.id === 'struggle') {
		a.hp = Math.max(0, a.hp - Math.max(1, Math.floor(a.maxHp / 4))); log.push(`${a.species} took recoil!`); recoil = true;
	} else if (move.recoil && !RPGAbilities.preventsRecoil(a)) {
		a.hp = Math.max(0, a.hp - Math.max(1, Math.floor(dmg * (move.recoil[0] / move.recoil[1])))); log.push(`${a.species} took recoil!`); recoil = true;
	}

	if (recoil) handleHPDropEffects(aSlot, battle, log);
	if (a.hp > 0 && move.self?.boosts) Object.entries(move.self.boosts).forEach(([s, v]) => applyStatChange(aSlot, s as any, v as number, battle, log, aSlot));
	if (success && ['selfdestruct', 'explosion', 'mistyexplosion', 'finalgambit'].includes(move.id)) { a.hp = 0; log.push(`**${a.species} fainted!**`); }
}

export function applySecondaryEffects(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, move: Move, battle: BattleState, log: string[], ctx: AbilityContext) {
	if (!move.secondary || !RPGAbilities.shouldApplySecondaryEffects(aSlot.pokemon, move)) return;
	const chance = RPGAbilities.applySereneGrace(ctx, move.secondary.chance || 100);
	
	if (Math.random() * 100 < chance) {
		const d = dSlot.pokemon;
		const dAbil = toID(d.ability || '');
		if (d.hp > 0 && !dSlot.substitute && !(dAbil === 'shielddust' && !RPGAbilities.isAbilityIgnored(aSlot.pokemon, d, 'shielddust'))) {
			
			// Status
			if (move.secondary.status && !dSlot.status) {
				const types = Dex.species.get(d.species).types;
				let blocked = (move.secondary.status === 'par' && types.includes('Electric')) || (move.secondary.status === 'brn' && types.includes('Fire')) || (move.secondary.status === 'psn' && (types.includes('Poison') || types.includes('Steel')));
				if (!blocked && RPGAbilities.preventsStatus(d, move.secondary.status, battle, aSlot.pokemon)) { blocked = true; log.push(`${d.species}'s ${d.ability} prevents ${move.secondary.status}!`); }
				if (!blocked && battle.terrain?.type === 'misty' && RPGAbilities.isGrounded(d, battle)) { blocked = true; log.push('Misty Terrain prevents status!'); }

				if (!blocked) {
					dSlot.status = move.secondary.status as Status;
					if (dSlot.status === 'tox') dSlot.toxicCounter = 1;
					if (dSlot.status === 'slp') dSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
					log.push(`${d.species} was ${dSlot.status === 'par' ? 'paralyzed' : dSlot.status === 'brn' ? 'burned' : dSlot.status === 'psn' ? 'poisoned' : dSlot.status}!`);
					if (toID(aSlot.pokemon.ability || '') === 'poisonpuppeteer' && ['psn', 'tox'].includes(dSlot.status) && !dSlot.isConfused) {
						dSlot.isConfused = true; dSlot.confusionCounter = Math.floor(Math.random() * 4) + 1; log.push(`${d.species} became confused!`);
					}
					if (dAbil === 'synchronize') applySynchronize(dSlot.status, dSlot, aSlot, battle, log);
				}
			}

			// Boosts
			if (move.secondary.boosts) {
				for (const [s, v] of Object.entries(move.secondary.boosts)) {
					applyStatChange(dSlot, s as any, toID(d.ability || '') === 'contrary' ? -v : v, battle, log, aSlot); // applyStatChange handles protections internally
				}
			}

			// Flinch
			if (move.secondary.volatileStatus === 'flinch') {
				if (!RPGAbilities.preventsFlinch(d)) dSlot.willFlinch = true;
				else log.push(`${d.species}'s Inner Focus prevents flinching!`);
			}
		}

		// Self Boosts
		if (move.secondary.self?.boosts) {
			const contrary = toID(aSlot.pokemon.ability || '') === 'contrary';
			Object.entries(move.secondary.self.boosts).forEach(([s, v]) => applyStatChange(aSlot, s as any, contrary ? -v : v, battle, log, aSlot));
		}
	}

	if (toID(aSlot.pokemon.ability || '') === 'stench' && move.category !== 'Status' && dSlot.pokemon.hp > 0 && Math.random() < 0.1 && !RPGAbilities.preventsFlinch(dSlot.pokemon)) {
		dSlot.willFlinch = true;
	}
}

// #endregion

// #region Catch & Exp

export function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	const p = targetSlot.pokemon;
	const bonus = BALL_HANDLERS[ballId] ? BALL_HANDLERS[ballId](getActiveSlots(battle.playerSlots)[0], targetSlot, battle) : 1;
	if (bonus === 255) return { success: true, shakes: 4 };

	const statusBonus = ['slp', 'frz'].includes(targetSlot.status || '') ? 2.5 : ['par', 'psn', 'tox', 'brn'].includes(targetSlot.status || '') ? 1.5 : 1;
	const catchRate = MANUAL_CATCH_RATES[toID(p.species)] || 150;
	
	const a = Math.floor((((3 * p.maxHp - 2 * p.hp) * catchRate * bonus) / (3 * p.maxHp)) * statusBonus);
	if (a >= 255) return { success: true, shakes: 4 };

	const b = Math.floor(65536 / (255 / a) ** 0.1875);
	for (let i = 0; i < 4; i++) {
		if (Math.floor(Math.random() * 65536) >= b) return { success: false, shakes: i };
	}
	return { success: true, shakes: 4 };
}

export function gainExperience(player: PlayerData, participantSlots: ActivePokemonSlot[], defeatedPokemon: RPGPokemon, room: ChatRoom, user: User): { messages: string[], leveledUp: boolean } {
	const baseExp = MANUAL_BASE_EXP[toID(defeatedPokemon.species)] || 150;
	let leveledUp = false;
	const messages: string[] = [];
	const gains = new Map<string, number>();
	const participants = new Set(participantSlots.filter(s => s?.pokemon.hp > 0).map(s => s.pokemon.id));
	const L_opp = defeatedPokemon.level;

	for (const p of player.party) {
		if (p.level >= GameConfig.levelCap) continue;
		const X = 2 * L_opp + 10;
		const Y = L_opp + p.level + 10;
		const exp = Math.floor(((Math.sqrt(X) * X * X) / (Math.sqrt(Y) * Y * Y)) * Math.floor((baseExp * L_opp) / 5)) + 1;
		
		gains.set(p.species, exp);
		p.experience += exp;
		if (participants.has(p.id)) gainEffortValues(p, defeatedPokemon);
	}

	if (gains.size > 0) {
		const vals = Array.from(gains.values());
		const allSame = vals.every(v => v === vals[0]);
		if (allSame) messages.push(`<b>${Array.from(gains.keys()).join(' and ')} gained ${vals[0]} Experience Points!</b>`);
		else messages.push(`<b>${Array.from(gains.entries()).map(([k, v]) => `${k} gained ${v} Experience Points`).join(' and ')}!</b>`);
	}

	for (const p of player.party) {
		if (p.level >= GameConfig.levelCap) continue;
		while (p.experience >= p.expToNextLevel && p.level < GameConfig.levelCap) {
			messages.push(...levelUp(p));
			leveledUp = true;
			const evo = checkEvolution(player, p, { room, user });
			if (evo) { messages.push(evo); break; }
			messages.push(...handleLearningMoves(player, p).messages);
		}
	}
	return { messages, leveledUp };
}

export function gainEffortValues(pokemon: RPGPokemon, defeated: RPGPokemon) {
	const yieldData = MANUAL_EV_YIELDS[toID(defeated.species)] || { atk: 1 };
	let total = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	
	for (const [stat, val] of Object.entries(yieldData)) {
		if (total >= 510) break;
		const key = stat as keyof Stats;
		const add = Math.min(val, 252 - pokemon.evs[key], 510 - total);
		pokemon.evs[key] += add; total += add;
	}
	const newStats = calculateStats(Dex.species.get(pokemon.species), pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	pokemon.hp = Math.max(1, pokemon.hp + (newStats.maxHp - pokemon.maxHp));
	pokemon.maxHp = newStats.maxHp;
	['atk', 'def', 'spa', 'spd', 'spe'].forEach(s => (pokemon as any)[s] = (newStats as any)[s]);
}

export function saveBattleStatus(battle: BattleState) {
	const sync = (slots: (ActivePokemonSlot | null)[], party: RPGPokemon[]) => {
		slots.forEach(s => { if (s) { const p = party.find(m => m.id === s.pokemon.id); if (p) p.status = (s.status === 'slp' || s.status === 'frz') ? null : s.status; } });
	};
	sync(battle.playerSlots, getActiveParty(battle, getPlayerData(battle.playerId)));
	if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') sync(battle.opponentSlots, battle.opponentParty);
}

// #endregion

// #region Private Helpers for specific moves

function handleTrapMove(d: ActivePokemonSlot, log: string[]) {
	if (d.pokemon.hp > 0 && !d.isTrapped && !Dex.species.get(d.pokemon.species).types.includes('Ghost')) {
		d.isTrapped = { turns: 5 }; log.push(`${d.pokemon.species} can no longer escape!`);
	}
}

function handleForceSwitch(d: ActivePokemonSlot, b: BattleState, log: string[]) {
	if (d.pokemon.hp > 0 && toID(d.pokemon.ability || '') !== 'suctioncups' && !d.isIngrained) {
		const isPlayer = b.playerSlots.includes(d);
		const party = isPlayer ? getPlayerData(b.playerId).party : b.opponentParty;
		const slots = isPlayer ? b.playerSlots : b.opponentSlots;
		if (party.some(p => p.hp > 0 && !slots.some(s => s?.pokemon.id === p.id))) {
			log.push(`${d.pokemon.species} was blown away!`); slots[slots.indexOf(d)] = null;
		} else log.push('But it failed!');
	} else log.push(d.isIngrained ? `${d.pokemon.species} is rooted!` : `${d.pokemon.species} anchors itself!`);
}

function handleRedCard(aSlot: ActivePokemonSlot, dSlot: ActivePokemonSlot, b: BattleState, log: string[]) {
	const isPlayerD = b.playerSlots.includes(dSlot);
	const aIdx = (isPlayerD ? b.opponentSlots : b.playerSlots).indexOf(aSlot);
	if (aIdx !== -1) {
		log.push(`${dSlot.pokemon.species}'s Red Card forced ${aSlot.pokemon.species} switch!`);
		dSlot.pokemon.item = undefined; activateUnburden(dSlot, log);
		(isPlayerD ? b.opponentSlots : b.playerSlots)[aIdx] = null;
	}
}

export function getPokemonTypes(pokemon: RPGPokemon, slot?: ActivePokemonSlot): string[] {
	return slot?.terastallized ? [slot.terastallized] : Dex.species.get(pokemon.species).types;
}

export function getCustomEffectiveness(moveType: string, dTypes: string[], d: RPGPokemon, b: BattleState, a?: RPGPokemon): number {
	let eff = 1;
	const chart = TYPE_CHART[moveType];
	if (!chart) return 1;
	const strongWinds = b.weather?.type === 'strong-winds';
	const aAbil = a ? toID(a.ability || '') : '';
	const ignoreGhost = (['Normal', 'Fighting'].includes(moveType) && (aAbil === 'scrappy' || aAbil === 'mindseye'));

	for (const type of dTypes) {
		if (chart.superEffective.includes(type)) eff *= (strongWinds && type === 'Flying' && ['Rock', 'Electric', 'Ice'].includes(moveType)) ? 1 : 2;
		else if (chart.notVeryEffective.includes(type)) eff *= 0.5;
		else if (chart.noEffect.includes(type)) eff *= (ignoreGhost && type === 'Ghost') ? 1 : 0;
	}
	return eff;
}

export function getStatMultiplier(stage: number): number {
	return stage >= 0 ? (2 + stage) / 2 : 2 / (2 + Math.abs(stage));
}
