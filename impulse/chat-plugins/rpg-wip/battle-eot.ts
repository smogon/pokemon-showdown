import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getMove, getActiveSlots, activateUnburden, applyStatChange, consumeBerry } from './utils';
import type { ActivePokemonSlot, BattleState, Move } from './interface';

import {
	getCustomEffectiveness,
	getStatMultiplier,
} from './battle-core';

// #region Constants & Config

const WEATHER_CONFIG = {
	'sun': { tick: 'The sunlight is harsh.', end: 'The sunlight faded.', restore: 'The harsh sunlight returned!' },
	'rain': { tick: 'Rain continues to fall.', end: 'The rain stopped.', restore: 'The rain resumed!' },
	'sand': { tick: 'The sandstorm rages.', end: 'The sandstorm subsided.', restore: 'The sandstorm picked up again!' },
	'hail': { tick: 'The snow is falling.', end: 'The snow stopped.', restore: 'The snow started falling again!' },
	'harsh-sun': { tick: 'The sunlight is extremely harsh!', end: 'The extremely harsh sunlight faded.', restore: 'The extremely harsh sunlight returned!' },
	'heavy-rain': { tick: 'The downpour continues!', end: 'The heavy rain stopped.', restore: 'The heavy rain resumed!' },
	'strong-winds': { tick: 'Strong winds continue to blow!', end: 'The strong winds subsided.', restore: 'The strong winds picked up again!' },
};

const FIELD_END_MESSAGES: Record<string, string> = {
	trickRoomTurns: 'The twisted dimensions returned to normal.',
	magicRoomTurns: 'The bizarre dimensions disappeared. Held items are effective again.',
	wonderRoomTurns: 'The bizarre dimensions disappeared. Defense and Sp. Def stats returned to normal.',
	gravityTurns: 'The gravity returned to normal.',
	mudSportTurns: 'The effects of Mud Sport wore off.',
	waterSportTurns: 'The effects of Water Sport wore off.',
	fairyLockTurns: 'The Fairy Lock wore off!',
};

// #endregion

// #region Helper Functions

function updateTurnCounter(battle: BattleState, key: keyof BattleState, messageLog: string[], endMessage?: string) {
	const val = (battle as any)[key];
	if (typeof val === 'number' && val > 0) {
		(battle as any)[key] = val - 1;
		if ((battle as any)[key] === 0 && endMessage) {
			messageLog.push(endMessage);
		}
	}
}

function resolveFutureMoves(moves: { slotIndex: number, moveId: string, turnsLeft: number, attackerStats: any }[], targetSlots: (ActivePokemonSlot | null)[], battle: BattleState, log: string[]) {
	return moves.filter(fm => {
		fm.turnsLeft--;
		if (fm.turnsLeft > 0) return true;

		const targetSlot = targetSlots[fm.slotIndex];
		const moveName = fm.moveId === 'futuresight' ? 'Future Sight' : 'Doom Desire';

		if (targetSlot && targetSlot.pokemon.hp > 0) {
			log.push(`<strong>${moveName}</strong> took effect!`);
			const move = getMove(fm.moveId);
			const basePower = move.basePower || 120;
			const defender = targetSlot.pokemon;
			const def = defender.spd * getStatMultiplier(targetSlot.statStages.spd);
			const effectiveness = getCustomEffectiveness(move.type, Dex.species.get(defender.species).types, defender, battle);
			
			// Damage Formula
			const baseDmg = Math.floor((2 * 50 / 5 + 2) * basePower * (fm.attackerStats.spa / def) / 50) + 2;
			const damage = Math.floor(baseDmg * effectiveness);
			
			targetSlot.pokemon.hp = Math.max(0, targetSlot.pokemon.hp - damage);
			log.push(`${defender.species} took ${damage} damage!`);
			if (effectiveness > 1) log.push(`It's super effective!`);
			else if (effectiveness < 1 && effectiveness > 0) log.push(`It's not very effective...`);
		} else {
			log.push(`<strong>${moveName}</strong> failed to find its target!`);
		}
		return false;
	});
}

// #endregion

// #region Main Processor

export function processEndOfTurn(battle: BattleState, messageLog: string[]) {
	const allSlots = getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]);

	// 1. Perish Song
	allSlots.forEach(slot => {
		if (slot.perishSongCounter !== undefined && slot.perishSongCounter > 0) {
			slot.perishSongCounter--;
			messageLog.push(`${slot.pokemon.species}'s perish count fell to ${slot.perishSongCounter}!`);
			if (slot.perishSongCounter === 0) {
				slot.pokemon.hp = 0;
				messageLog.push(`${slot.pokemon.species} fainted from Perish Song!`);
			}
		}
	});

	// 2. Future Sight / Doom Desire
	battle.playerFutureMoves = resolveFutureMoves(battle.playerFutureMoves, battle.opponentSlots, battle, messageLog);
	battle.opponentFutureMoves = resolveFutureMoves(battle.opponentFutureMoves, battle.playerSlots, battle, messageLog);

	// 3. Reset Turn Flags
	for (const slot of allSlots) {
		slot.willFlinch = false;
		slot.isProtected = false;
	}

	// 4. Weather & Field
	handleEndOfTurnWeather(battle, messageLog, allSlots);

	// 5. Items & Status & Effects (Order Matters)
	const lumCuredStatus = new Map<string, boolean>();
	
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) applyEOTHealingItemEffects(slot, battle, messageLog);
	}
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) applyEOTHealingEffects(slot, battle, messageLog);
	}
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) {
			const cured = applyEOTNonHealingItemEffects(slot, battle, messageLog);
			lumCuredStatus.set(slot.pokemon.id, cured);
		}
	}
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0 && !lumCuredStatus.get(slot.pokemon.id)) applyEOTStatusDamage(slot, battle, messageLog);
	}
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) applyEOTLeechSeedDamage(slot, battle, messageLog);
	}
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) applyEOTVolatileStatusDamage(slot, battle, messageLog);
	}

	// 6. Decrement Volatile Counters
	for (const slot of allSlots) {
		if (slot.pokemon.hp > 0) {
			decrementEOTVolatileCounters(slot, battle, messageLog);
			slot.isCharged = false;
		}
	}

	// 7. Global Field Effects (Turns)
	handleEndOfTurnFieldEffects(battle, messageLog, allSlots);
}

// #endregion

// #region Sub-Processors

export function handleEndOfTurnWeather(battle: BattleState, messageLog: string[], allSlots: ActivePokemonSlot[]) {
	if (!RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather) {
			battle.weather.turns--;
			if (battle.weather.turns <= 0) battle.weather = undefined;
		}
		return;
	}

	battle.weather!.turns--;
	const wType = battle.weather!.type;
	const config = WEATHER_CONFIG[wType];
	if (config?.tick) messageLog.push(config.tick);

	for (const slot of allSlots) {
		const pokemon = slot.pokemon;
		if (pokemon.hp <= 0) continue;
		
		const species = Dex.species.get(pokemon.species);
		const ability = toID(pokemon.ability || '');
		
		// Weather Healing
		let healDivisor = 0;
		if (['rain', 'heavy-rain'].includes(wType)) {
			if (ability === 'raindish') healDivisor = 16;
			else if (ability === 'dryskin') healDivisor = 8;
		} else if (wType === 'hail' && ability === 'icebody') {
			healDivisor = 16;
		}

		if (healDivisor > 0 && pokemon.hp < pokemon.maxHp) {
			const heal = Math.max(1, Math.floor(pokemon.maxHp / healDivisor));
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + heal);
			const healName = ability === 'raindish' ? "Rain Dish" : ability === 'dryskin' ? "Dry Skin" : "Ice Body";
			messageLog.push(`${pokemon.species}'s ${healName} restored its HP!`);
		}

		RPGAbilities.handleHydration(slot, battle, messageLog);

		// Weather Damage
		let dmgDivisor = 0;
		if (wType === 'sand') {
			const isImmuneType = ['Rock', 'Ground', 'Steel'].some(t => species.types.includes(t));
			const isImmuneAbility = ['sandforce', 'sandrush', 'sandveil', 'magicguard', 'overcoat'].includes(ability);
			const hasGoggles = pokemon.item?.includes('goggles');
			if (!isImmuneType && !isImmuneAbility && !hasGoggles) dmgDivisor = 16;
		} else if (['sun', 'harsh-sun'].includes(wType)) {
			if (ability === 'dryskin' || ability === 'solarpower') dmgDivisor = 8;
		}

		if (dmgDivisor > 0 && RPGAbilities.takesIndirectDamage(pokemon)) {
			pokemon.hp = Math.max(0, pokemon.hp - Math.max(1, Math.floor(pokemon.maxHp / dmgDivisor)));
			if (['sun', 'harsh-sun'].includes(wType)) {
				messageLog.push(`${pokemon.species} was hurt by ${ability === 'dryskin' ? 'its Dry Skin' : 'Solar Power'}!`);
			} else {
				messageLog.push(`${pokemon.species} is buffeted by the weather!`);
			}
		}
	}

	if (battle.weather!.turns <= 0) {
		if (config?.end) messageLog.push(config.end);

		if (battle.locationWeather) {
			battle.weather = { type: battle.locationWeather.type, turns: 9999 };
			const newConfig = WEATHER_CONFIG[battle.locationWeather.type];
			if (newConfig?.restore) messageLog.push(newConfig.restore);
		} else {
			battle.weather = undefined;
		}
	}
}

export function handleEndOfTurnFieldEffects(battle: BattleState, messageLog: string[], allSlots: ActivePokemonSlot[]) {
	// Grassy Terrain Healing
	if (battle.terrain?.type === 'grassy') {
		for (const slot of allSlots) {
			const p = slot.pokemon;
			if (p.hp > 0 && p.hp < p.maxHp && RPGAbilities.isGrounded(p, battle)) {
				p.hp = Math.min(p.maxHp, p.hp + Math.max(1, Math.floor(p.maxHp / 16)));
				messageLog.push(`${p.species} restored a little HP due to the Grassy Terrain!`);
			}
		}
		updateTurnCounter(battle, 'terrain', messageLog); // Special handling for message below
		if (battle.terrain && battle.terrain.turns <= 0) {
			messageLog.push(`The ${battle.terrain.type} terrain returned to normal.`);
			battle.terrain = undefined;
		}
	} else if (battle.terrain) {
		// Non-Grassy Terrain decrement
		battle.terrain.turns--;
		if (battle.terrain.turns <= 0) {
			messageLog.push(`The ${battle.terrain.type} terrain returned to normal.`);
			battle.terrain = undefined;
		}
	}

	// Screens & Mist
	const sides = [
		{ prefix: 'Your team', ref: 'player' },
		{ prefix: 'The opposing team', ref: 'opponent' }
	];
	sides.forEach(side => {
		updateTurnCounter(battle, `${side.ref}ReflectTurns` as any, messageLog, `${side.prefix}'s Reflect wore off!`);
		updateTurnCounter(battle, `${side.ref}LightScreenTurns` as any, messageLog, `${side.prefix}'s Light Screen wore off!`);
		updateTurnCounter(battle, `${side.ref}AuroraVeilTurns` as any, messageLog, `${side.prefix}'s Aurora Veil wore off!`);
		updateTurnCounter(battle, `${side.ref}MistTurns` as any, messageLog, `${side.prefix}'s Mist wore off!`);
	});

	// Global Effects
	for (const [key, msg] of Object.entries(FIELD_END_MESSAGES)) {
		updateTurnCounter(battle, key as keyof BattleState, messageLog, msg);
	}

	if (battle.ionDelugeTurns > 0) battle.ionDelugeTurns--;
}

export function applyEOTStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const p = slot.pokemon;
	const ability = toID(p.ability || '');
	if (ability === 'magicguard') return;

	if (slot.status === 'brn' && ability !== 'heatproof') {
		p.hp = Math.max(0, p.hp - Math.max(1, Math.floor(p.maxHp / 16)));
		messageLog.push(`<span style="color: #F08030;"><strong>${p.species}</strong> was hurt by its burn!</span>`);
	} else if (['psn', 'tox'].includes(slot.status || '') && !RPGAbilities.handlePoisonHeal(slot, messageLog)) {
		let div = 8;
		if (slot.status === 'tox') {
			if (!slot.toxicCounter) slot.toxicCounter = 1;
			div = 16 / slot.toxicCounter; // Logic inversion: maxHp * counter / 16 is same as maxHp / (16/counter)
		}
		const dmg = Math.max(1, Math.floor(p.maxHp * (slot.status === 'tox' ? slot.toxicCounter! : 1) / (slot.status === 'tox' ? 16 : 8)));
		p.hp = Math.max(0, p.hp - dmg);
		messageLog.push(`<span style="color: #A040A0;"><strong>${p.species}</strong> was hurt by its poison!</span>`);
		if (slot.status === 'tox') slot.toxicCounter!++;
	}
}

export function applyEOTHealingItemEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0 || battle.magicRoomTurns > 0) return;
	const p = slot.pokemon;
	if (p.hp >= p.maxHp) return;

	if (p.item === 'leftovers') {
		p.hp = Math.min(p.maxHp, p.hp + Math.max(1, Math.floor(p.maxHp / 16)));
		messageLog.push(`<span style="color: #28a745;"><strong>${p.species}</strong> restored a little HP using its <strong>Leftovers</strong>!</span>`);
	} else if (p.item === 'blacksludge' && Dex.species.get(p.species).types.includes('Poison')) {
		p.hp = Math.min(p.maxHp, p.hp + Math.max(1, Math.floor(p.maxHp / 16)));
		messageLog.push(`<span style="color: #28a745;"><strong>${p.species}</strong> restored a little HP using its <strong>Black Sludge</strong>!</span>`);
	}
}

export function applyEOTNonHealingItemEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]): boolean {
	if (slot.pokemon.hp <= 0 || battle.magicRoomTurns > 0) return false;
	const p = slot.pokemon;
	const types = Dex.species.get(p.species).types;

	// Status Orbs
	if (!slot.status) {
		if (p.item === 'flameorb' && !types.includes('Fire')) {
			slot.status = 'brn';
			messageLog.push(`<span style="color: #F08030;"><strong>${p.species}</strong> was burned by its Flame Orb!</span>`);
		} else if (p.item === 'toxicorb' && !types.includes('Poison') && !types.includes('Steel')) {
			slot.status = 'tox'; slot.toxicCounter = 1;
			messageLog.push(`<span style="color: #A040A0;"><strong>${p.species}</strong> was badly poisoned by its Toxic Orb!</span>`);
		}
	}

	// Lum Berry
	if (slot.status && p.item === 'lumberry') {
		slot.status = null;
		messageLog.push(`<span style="color: #28a745;"><strong>${p.species}</strong> ate its <strong>Lum Berry</strong> and cured its status condition!</span>`);
		consumeBerry(slot, 'lumberry', messageLog);
		return true;
	}

	// Bad Items
	if ((p.item === 'blacksludge' && !types.includes('Poison')) || p.item === 'stickybarb') {
		if (RPGAbilities.takesIndirectDamage(p)) {
			p.hp = Math.max(0, p.hp - Math.max(1, Math.floor(p.maxHp / 8)));
			const item = p.item === 'blacksludge' ? 'Black Sludge' : 'Sticky Barb';
			messageLog.push(`<span style="color: #d9534f;"><strong>${p.species}</strong> was hurt by its <strong>${item}</strong>!</span>`);
		}
	}
	return false;
}

export function applyEOTVolatileStatusDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const p = slot.pokemon;
	const indirect = RPGAbilities.takesIndirectDamage(p);

	if (slot.isCursed && indirect) {
		p.hp = Math.max(0, p.hp - Math.max(1, Math.floor(p.maxHp / 4)));
		messageLog.push(`${p.species} is afflicted by the curse!`);
	}
	if (p.hp > 0 && slot.hasNightmare && slot.status === 'slp' && indirect) {
		p.hp = Math.max(0, p.hp - Math.max(1, Math.floor(p.maxHp / 4)));
		messageLog.push(`${p.species} is locked in a nightmare!`);
	} else if (slot.hasNightmare && slot.status !== 'slp') {
		slot.hasNightmare = false;
	}
	if (p.hp > 0 && slot.partiallyTrapped && indirect) {
		p.hp = Math.max(0, p.hp - Math.max(1, Math.floor(p.maxHp / slot.partiallyTrapped.damage)));
		messageLog.push(`${p.species} is hurt by ${getMove(slot.partiallyTrapped.moveId)?.name || 'the trap'}!`);
	}
}

export function applyEOTHealingEffects(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0 || (slot.healBlockTurns || 0) > 0) return;
	const p = slot.pokemon;

	const tryHeal = (condition: boolean, divisor: number, msg: string) => {
		if (condition && p.hp < p.maxHp) {
			p.hp = Math.min(p.maxHp, p.hp + Math.max(1, Math.floor(p.maxHp / divisor)));
			messageLog.push(msg);
		}
	};

	tryHeal(!!slot.hasAquaRing, 16, `${p.species} was healed by Aqua Ring!`);
	tryHeal(!!slot.isIngrained, 16, `${p.species} absorbed nutrients with its roots!`);

	if (slot.wishTurns && slot.wishTurns > 0) {
		slot.wishTurns--;
		if (slot.wishTurns === 0 && p.hp < p.maxHp) {
			const amt = Math.floor(p.maxHp / 2);
			const old = p.hp;
			p.hp = Math.min(p.maxHp, p.hp + amt);
			messageLog.push(`${p.species}'s wish came true! It restored ${p.hp - old} HP!`);
		}
	}
}

export function applyEOTLeechSeedDamage(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0 || !slot.isSeeded) return;
	const p = slot.pokemon;

	if (RPGAbilities.takesIndirectDamage(p)) {
		const amt = Math.max(1, Math.floor(p.maxHp / 8));
		p.hp = Math.max(0, p.hp - amt);
		messageLog.push(`${p.species}'s health was sapped by Leech Seed!`);

		const isPlayer = battle.playerSlots.includes(slot);
		const target = getActiveSlots(isPlayer ? battle.opponentSlots : battle.playerSlots)[0];
		if (target && target.pokemon.hp > 0 && (target.healBlockTurns || 0) <= 0) {
			const old = target.pokemon.hp;
			target.pokemon.hp = Math.min(target.pokemon.maxHp, target.pokemon.hp + amt);
			messageLog.push(`${target.pokemon.species} restored ${target.pokemon.hp - old} HP!`);
		}
	}
}

export function decrementEOTVolatileCounters(slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) {
	if (slot.pokemon.hp <= 0) return;
	const p = slot.pokemon;

	// Yawn
	if (slot.yawnCounter !== undefined && slot.yawnCounter > 0) {
		slot.yawnCounter--;
		if (slot.yawnCounter === 0) {
			const immune = (battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(p, battle)) ||
				['insomnia', 'vitalspirit', 'comatose', 'sweetveil'].includes(toID(p.ability || '')) ||
				RPGAbilities.preventsStatus(p, 'slp', battle, undefined);
			
			if (!slot.status && !immune) {
				slot.status = 'slp'; slot.sleepCounter = Math.floor(Math.random() * 3) + 1;
				messageLog.push(`<strong>${p.species}</strong> fell asleep!`);
			} else {
				messageLog.push(`${p.species} stayed awake!`);
			}
			slot.yawnCounter = undefined;
		}
	}

	// Simple Counters
	if (slot.isTrapped) {
		slot.isTrapped.turns--;
		if (slot.isTrapped.turns <= 0) { slot.isTrapped = null; messageLog.push(`${p.species} was freed from the trap.`); }
	}
	if (slot.partiallyTrapped) {
		slot.partiallyTrapped.turns--;
		if (slot.partiallyTrapped.turns <= 0) {
			messageLog.push(`${p.species} was freed from ${getMove(slot.partiallyTrapped.moveId)?.name || 'the trap'}!`);
			slot.partiallyTrapped = null;
		}
	}
	if (slot.tauntTurns > 0 && --slot.tauntTurns <= 0) messageLog.push(`${p.species}'s taunt wore off.`);
	if (slot.magnetRiseTurns > 0 && --slot.magnetRiseTurns === 0) messageLog.push(`${p.species}'s electromagnetism wore off!`);
	if (slot.telekinesisCounter > 0 && --slot.telekinesisCounter === 0) messageLog.push(`${p.species} was freed from telekinesis!`);
	if (slot.embargoTurns > 0 && --slot.embargoTurns === 0) messageLog.push(`${p.species} can use items again!`);
	if (slot.healBlockTurns > 0 && --slot.healBlockTurns === 0) messageLog.push(`${p.species}'s Heal Block wore off!`);
	if (slot.slowStartTurns !== undefined && slot.slowStartTurns > 0 && --slot.slowStartTurns === 0) messageLog.push(`${p.species} got its act together!`);

	// Move Locks & PP Checks
	const checkPP = (id: string | undefined) => { const m = p.moves.find(mv => mv.id === id); return !m || m.pp === 0; };

	if (slot.chargingMove && checkPP(slot.chargingMove)) {
		messageLog.push(`${p.species} stopped charging due to lack of PP!`); slot.chargingMove = undefined;
	}
	if (slot.disabledMove) {
		if (--slot.disabledMove.turns <= 0) { messageLog.push(`${p.species}'s ${slot.disabledMove.moveId} is no longer disabled!`); slot.disabledMove = undefined; }
	}
	if (slot.encoreMove) {
		if (checkPP(slot.encoreMove.moveId)) {
			messageLog.push(`${p.species}'s encore ended due to lack of PP!`); slot.encoreMove = undefined;
		} else if (--slot.encoreMove.turns <= 0) {
			messageLog.push(`${p.species}'s encore ended!`); slot.encoreMove = undefined;
		}
	}
	if (slot.lockedMoveCounter > 0) {
		const noPP = checkPP(slot.lockedMove);
		if (slot.status === 'slp' || noPP) {
			slot.lockedMove = undefined; slot.lockedMoveCounter = 0;
			if (noPP) messageLog.push(`${p.species}'s rampage ended due to lack of PP!`);
		} else if (--slot.lockedMoveCounter === 0) {
			slot.lockedMove = undefined;
			if (!slot.isConfused && toID(p.ability || '') !== 'owntempo') {
				slot.isConfused = true; slot.confusionCounter = Math.floor(Math.random() * 4) + 1;
				messageLog.push(`${p.species} became confused due to fatigue!`);
			}
		}
	}
	if (slot.uproarTurns > 0) {
		if (checkPP(slot.lockedMove)) {
			slot.lockedMove = undefined; slot.uproarTurns = 0; messageLog.push(`${p.species} calmed down due to lack of PP!`);
		} else if (--slot.uproarTurns === 0) {
			slot.lockedMove = undefined; messageLog.push(`${p.species} calmed down.`);
		}
	}

	if (slot.harvestUsedThisTurn) slot.harvestUsedThisTurn = false;
	RPGAbilities.applyEndOfTurnAbilities(slot, battle, messageLog);
}
