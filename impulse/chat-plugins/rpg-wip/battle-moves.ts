/*
* Pokemon Showdown
* RPG Battle Moves
*
* This file contains all specific logic for move effects,
* such as variable base power, charging, and status effects.
*/

import { Dex, toID } from '../../../sim/dex';
import type { RPGPokemon, ActivePokemonSlot, BattleState, Move, Stats } from './interface';
import { getMove, getActiveSlots } from './utils';
import { ITEMS_DATABASE } from './items';
import { RPGAbilities } from './abilities';
import {
	checkStatDropAbilities,
	checkMentalHerb,
	activateUnburden,
	applySynchronize,
	INITIAL_STAT_STAGES,
} from './battle-shared';
import { getStatMultiplier } from './battle-core';

export function getDamageBasePower(
	move: Move,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	let basePower = move.basePower;
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	if (attackerSlot.isHelped) {
		basePower = Math.floor(basePower * 1.5);
	}

	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) {
			basePower *= 2;
		}
		if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) {
			basePower *= 2;
		}
		if (
			(defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') &&
			['twister', 'gust', 'skyuppercut'].includes(move.id)
		) {
			basePower *= 2;
		}
	}

	switch (move.id) {
	case 'reversal':
	case 'flail':
		const hpRatio = attacker.hp / attacker.maxHp;
		if (hpRatio < 0.0417) basePower = 200;
		else if (hpRatio < 0.1042) basePower = 150;
		else if (hpRatio < 0.2083) basePower = 100;
		else if (hpRatio < 0.3542) basePower = 80;
		else if (hpRatio < 0.6875) basePower = 40;
		else basePower = 20;
		break;
	case 'eruption':
	case 'waterspout':
		basePower = Math.max(1, Math.floor(150 * (attacker.hp / attacker.maxHp)));
		break;
	case 'grassknot':
	case 'lowkick':
		const defenderWeight = defenderSpecies.weightkg;
		if (defenderWeight < 10) basePower = 20;
		else if (defenderWeight < 25) basePower = 40;
		else if (defenderWeight < 50) basePower = 60;
		else if (defenderWeight < 100) basePower = 80;
		else if (defenderWeight < 200) basePower = 100;
		else basePower = 120;
		break;
	case 'heavyslam':
	case 'heatcrash':
		const attackerWeight = attackerSpecies.weightkg;
		const defenderWeightSlam = defenderSpecies.weightkg;
		const weightRatio = attackerWeight / defenderWeightSlam;
		if (weightRatio >= 5) basePower = 120;
		else if (weightRatio >= 4) basePower = 100;
		else if (weightRatio >= 3) basePower = 80;
		else if (weightRatio >= 2) basePower = 60;
		else basePower = 40;
		break;
	case 'gyroball':
		const attackerSpe = attacker.spe * getStatMultiplier(attackerSlot.statStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderSlot.statStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;
	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerSlot.statStages) {
			if (attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages] > 0) {
				totalBoosts += attackerSlot.statStages[stat as keyof typeof attackerSlot.statStages];
			}
		}
		basePower = 20 + (20 * totalBoosts);
		break;
	case 'acrobatics':
		if (!attacker.item || battle.magicRoomTurns > 0) {
			basePower *= 2;
		}
		break;
	case 'present':
		const presentRand = Math.random();
		if (presentRand < 0.4) basePower = 40;
		else if (presentRand < 0.7) basePower = 80;
		else if (presentRand < 0.8) basePower = 120;
		else basePower = -1;
		break;
	case 'magnitude':
		const magnitudeRoll = Math.random();
		if (magnitudeRoll < 0.05) basePower = 10;
		else if (magnitudeRoll < 0.15) basePower = 30;
		else if (magnitudeRoll < 0.35) basePower = 50;
		else if (magnitudeRoll < 0.65) basePower = 70;
		else if (magnitudeRoll < 0.85) basePower = 90;
		else if (magnitudeRoll < 0.95) basePower = 110;
		else basePower = 150;
		break;
	}

	if (move.id === 'facade' && attackerSlot.status && ['psn', 'brn', 'par'].includes(attackerSlot.status)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	if (move.id === 'venoshock' && defenderSlot.status === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && RPGAbilities.isWeatherActive(battle)) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		basePower *= 2;
	}
	if (attackerSlot.isCharged && move.type === 'Electric') {
		basePower *= 2;
	}
	if (['solarbeam', 'solarblade'].includes(move.id) && RPGAbilities.isWeatherActive(battle)) {
		if (['rain', 'sand', 'hail'].includes(battle.weather!.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	// Punishment: Power increases with target's positive stat boosts (60 + 20 per boost, max 200)
	if (move.id === 'punishment') {
		let totalBoosts = 0;
		for (const stat in defenderSlot.statStages) {
			const stage = defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages];
			if (stage > 0) totalBoosts += stage;
		}
		basePower = Math.min(200, 60 + (20 * totalBoosts));
	}

	// Trump Card: Power increases as PP decreases
	if (move.id === 'trumpcard') {
		const moveData = attacker.moves.find(m => m.id === move.id);
		if (moveData) {
			if (moveData.pp === 0) basePower = 200;
			else if (moveData.pp === 1) basePower = 80;
			else if (moveData.pp === 2) basePower = 60;
			else if (moveData.pp === 3) basePower = 50;
			else basePower = 40;
		}
	}

	// Wring Out / Crush Grip: Power based on target's current HP% (1-121)
	if (move.id === 'wringout' || move.id === 'crushgrip') {
		const hpPercent = defender.hp / defender.maxHp;
		basePower = Math.floor(120 * hpPercent) + 1;
	}

	// Assurance: Power doubles if target took damage this turn
	if (move.id === 'assurance' && defenderSlot.lastDamageTaken) {
		basePower *= 2;
	}

	// Avalanche / Revenge: Power doubles if user took damage this turn
	if ((move.id === 'avalanche' || move.id === 'revenge') && attackerSlot.lastDamageTaken) {
		basePower *= 2;
	}

	// Payback: Power doubles if user moves after target
	// This would need turn order tracking, for now we'll check speed
	if (move.id === 'payback') {
		const attackerSpe = attacker.spe * getStatMultiplier(attackerSlot.statStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderSlot.statStages.spe);
		if (attackerSpe < defenderSpe) {
			basePower *= 2;
		}
	}

	return basePower;
}

export function handleDamagingMovePreamble(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	const defenderChargingMoveId = defenderSlot.chargingMove;
	if (defenderChargingMoveId) {
		let isImmune = true;
		const semiInvulnerableStates = ['fly', 'dig', 'dive', 'bounce', 'shadowforce', 'phantomforce'];

		if (semiInvulnerableStates.includes(defenderChargingMoveId)) {
			if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) {
				isImmune = false;
			}
			if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) {
				isImmune = false;
			}
			if (
				(defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') &&
				['thunder', 'hurricane', 'twister', 'gust', 'skyuppercut', 'smackdown'].includes(move.id)
			) {
				isImmune = false;
			}
		}
		if (isImmune) {
			messageLog.push(`But it failed! ${defender.species} avoided the attack!`);
			return true;
		}
	}

	// Explosion/Self-Destruct: Halve defender's Defense for damage calculation
	if (move.id === 'explosion' || move.id === 'selfdestruct') {
		// This is handled in damage calculation by temporarily modifying defense
		// The actual fainting happens in handleSpecificStatusMove
	}

	// Foul Play: Uses target's Attack stat instead of user's
	if (move.id === 'foulplay') {
		// This needs to be handled in damage calculation
		// For now, we note it here
	}

	// Psyshock/Psystrike/Secret Sword: Special attacks that target Defense
	if (['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		// These are Special category but use target's Defense instead of Sp. Def
		// This needs to be handled in damage calculation
	}

	if (move.id === 'counter' || move.id === 'mirrorcoat') {
		const targetCategory = move.id === 'counter' ? 'Physical' : 'Special';
		if (attackerSlot.lastDamageTaken?.category !== targetCategory) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const counterDamage = attackerSlot.lastDamageTaken.amount * 2;
		defender.hp = Math.max(0, defender.hp - counterDamage);
		messageLog.push(`${defender.species} took ${counterDamage} damage from the counter!`);
		return true;
	}

	if (move.id === 'fling') {
		if (battle.magicRoomTurns > 0 || !attacker.item) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const flingPowers: Record<string, number> = {
			'leftovers': 10, 'oranberry': 10, 'berryjuice': 10, 'sitrusberry': 10, 'lumberry': 10, 'focussash': 10,
			'choiceband': 10, 'choicescarf': 10, 'choicespecs': 10, 'lifeorb': 30, 'rockyhelmet': 60, 'assaultvest': 80, 'ironball': 130,
		};
		const damage = flingPowers[attacker.item] || 30;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} flung its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.id === 'naturalgift') {
		if (!attacker.item?.includes('berry')) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const damage = 80;
		defender.hp = Math.max(0, defender.hp - damage);
		messageLog.push(`${attacker.species} used its ${ITEMS_DATABASE[attacker.item]?.name || attacker.item} and dealt ${damage} damage!`);
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		return true;
	}

	if (move.ohko) {
		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'sturdy') {
			messageLog.push(`But it failed! (${defender.species}'s Sturdy)`);
			return true;
		}
		if (defender.level > attacker.level) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (move.ohko === 'Normal' && defenderSpecies.types.includes('Ghost')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return true;
		}
		if (move.ohko === 'Ice' && defenderSpecies.types.includes('Ice')) {
			messageLog.push(`But it failed!`);
			return true;
		}

		const accuracy = 30 + attacker.level - defender.level;
		if (Math.random() * 100 < accuracy) {
			defender.hp = 0;
			messageLog.push(`<i style="color: #dc3545;">It's a one-hit KO!</i>`);
		} else {
			messageLog.push(`${attacker.species}'s attack missed!`);
		}
		return true;
	}

	return false;
}

export function handleGenericBoostMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.boosts) return false;

	let targetSlot: ActivePokemonSlot | null;
	let targetName: string;
	const isSelf = move.target === 'self';

	if (isSelf) {
		targetSlot = attackerSlot;
		targetName = attackerSlot.pokemon.species;
	} else {
		if (!defenderSlot) {
			messageLog.push(`But it failed! (No target)`);
			return true;
		}
		targetSlot = defenderSlot;
		targetName = defenderSlot.pokemon.species;
	}

	const targetStages = targetSlot.statStages;
	let hadEffect = false;
	let triggeredDefiant = false;

	for (const stat in move.boosts) {
		let boostValue = move.boosts[stat as keyof typeof move.boosts]!;

		if (toID(targetSlot.pokemon.ability || '') === 'contrary') {
			boostValue *= -1;
		}

		const stage = targetStages[stat as keyof typeof targetStages];

		if (boostValue > 0) {
			if (stage < 6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
				hadEffect = true;
			}
		} else if (boostValue < 0) {
			if (!isSelf) {
				if (battle.magicRoomTurns === 0 && targetSlot.pokemon.item === 'clearamulet') {
					messageLog.push(`${targetName}'s Clear Amulet prevents its stats from being lowered!`);
					continue;
				}
				const targetAbility = toID(targetSlot.pokemon.ability || '');
				const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
				if (blockAbilities.includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its stats from being lowered!`);
					continue;
				}
				if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
					messageLog.push(`${targetName}'s ${targetSlot.pokemon.ability} prevents its Attack from being lowered!`);
					continue;
				}
			}

			if (stage > -6) {
				targetStages[stat as keyof typeof targetStages] = Math.max(-6, Math.min(6, stage + boostValue));
				messageLog.push(`${targetName}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
				hadEffect = true;

				if (!isSelf) triggeredDefiant = true;
			}
		}
	}

	if (!hadEffect) messageLog.push('But it failed!');

	if (triggeredDefiant) {
		checkStatDropAbilities(targetSlot, attackerSlot, battle, messageLog);
	}

	return true;
}

export function handleGenericStatusInflictMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.status || !defenderSlot) return false;

	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);
	let canBeAfflicted = !defenderSlot.status;
	const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

	if (battle.terrain?.type === 'misty' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Misty Terrain prevents status conditions!');
	}
	if (battle.terrain?.type === 'electric' && move.status === 'slp' && defenderIsGrounded) {
		canBeAfflicted = false;
		messageLog.push('The Electric Terrain prevents sleep!');
	}
	const anyUproar = [...battle.playerSlots, ...battle.opponentSlots].some(s => s?.uproarTurns && s.uproarTurns > 0);
	if (move.status === 'slp' && anyUproar) {
		canBeAfflicted = false;
		messageLog.push('But the uproar kept it awake!');
	}
	if (canBeAfflicted && RPGAbilities.preventsStatus(defender, move.status)) {
		canBeAfflicted = false;
		messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.status}!`);
	}
	if (canBeAfflicted) {
		if ((move.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
			(move.status === 'par' && defenderSpecies.types.includes('Electric')) ||
			(move.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel'))) ||
			(move.status === 'frz' && defenderSpecies.types.includes('Ice'))) {
			canBeAfflicted = false;
		}
	}

	if (canBeAfflicted) {
		const newStatus = move.status as 'psn' | 'brn' | 'par' | 'slp' | 'frz';
		defenderSlot.status = newStatus;
		if (newStatus === 'slp') {
			defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
		}
		messageLog.push(`${defender.species} was afflicted with ${newStatus}!`);

		const defenderAbility = toID(defender.ability || '');
		if (defenderAbility === 'synchronize') {
			applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
		}
	} else {
		messageLog.push(`But it failed!`);
	}

	return true;
}

export function handleGenericVolatileMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	if (!move.volatileStatus) return false;

	const targetSlot = move.target === 'self' ? attackerSlot : defenderSlot;
	if (!targetSlot) {
		messageLog.push(`But it failed!`);
		return true;
	}
	const target = targetSlot.pokemon;
	let hadEffect = false;

	switch (move.volatileStatus) {
	case 'confusion':
		if (!targetSlot.isConfused) {
			targetSlot.isConfused = true;
			targetSlot.confusionCounter = Math.floor(Math.random() * 3) + 2;
			messageLog.push(`${target.species} became confused!`);
			hadEffect = true;
		}
		break;
	case 'taunt':
		if (targetSlot.tauntTurns <= 0) {
			targetSlot.tauntTurns = 3;
			messageLog.push(`${target.species} fell for the taunt!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'trap':
		if (!targetSlot.isTrapped) {
			targetSlot.isTrapped = { turns: 5 };
			messageLog.push(`${target.species} can no longer escape!`);
			hadEffect = true;
		}
		break;
	case 'yawn':
		if (!targetSlot.status && !targetSlot.yawnCounter) {
			const isTerrainImmune = battle.terrain?.type === 'electric' && RPGAbilities.isGrounded(target, battle);
			const sleepPreventingAbilities = ['insomnia', 'vitalspirit', 'comatose', 'sweetveil'];
			const isAbilityImmune = sleepPreventingAbilities.includes(toID(target.ability || ''));
			if (!isTerrainImmune && !isAbilityImmune) {
				targetSlot.yawnCounter = 2;
				messageLog.push(`${target.species} grew drowsy!`);
				hadEffect = true;
			}
		}
		break;
	case 'disable':
		if (targetSlot.lastMoveUsed && !targetSlot.disabledMove) {
			targetSlot.disabledMove = { moveId: targetSlot.lastMoveUsed, turns: 4 };
			messageLog.push(`${target.species}'s ${targetSlot.lastMoveUsed} was disabled!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'encore':
		if (targetSlot.lastMoveUsed && !targetSlot.encoreMove) {
			targetSlot.encoreMove = { moveId: targetSlot.lastMoveUsed, turns: 3 };
			messageLog.push(`${target.species} received an encore!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'ingrain':
		if (!targetSlot.isIngrained) {
			targetSlot.isIngrained = true;
			messageLog.push(`${target.species} planted its roots!`);
			hadEffect = true;
		}
		break;
	case 'aquaring':
		if (!targetSlot.hasAquaRing) {
			targetSlot.hasAquaRing = true;
			messageLog.push(`${target.species} surrounded itself with a veil of water!`);
			hadEffect = true;
		}
		break;
	case 'focusenergy':
		if (!targetSlot.focusEnergy) {
			targetSlot.focusEnergy = true;
			messageLog.push(`${target.species} is getting pumped!`);
			hadEffect = true;
		}
		break;
	case 'magnetrise':
		if (targetSlot.magnetRiseTurns === 0) {
			targetSlot.magnetRiseTurns = 5;
			messageLog.push(`${target.species} levitated with electromagnetism!`);
			hadEffect = true;
		}
		break;
	case 'telekinesis':
		if (targetSlot.telekinesisCounter === 0) {
			targetSlot.telekinesisCounter = 3;
			messageLog.push(`${target.species} was hurled into the air!`);
			hadEffect = true;
		}
		break;
	case 'smackdown':
		if (!targetSlot.isSmackedDown) {
			targetSlot.isSmackedDown = true;
			messageLog.push(`${target.species} fell straight down!`);
			hadEffect = true;
		}
		break;
	case 'torment':
		if (!targetSlot.tormentActive) {
			targetSlot.tormentActive = true;
			messageLog.push(`${target.species} was subjected to torment!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'embargo':
		if (targetSlot.embargoTurns === 0) {
			targetSlot.embargoTurns = 5;
			messageLog.push(`${target.species} can't use items anymore!`);
			hadEffect = true;
		}
		break;
	case 'healblock':
		if (targetSlot.healBlockTurns === 0) {
			targetSlot.healBlockTurns = 5;
			messageLog.push(`${target.species} was prevented from healing!`);
			hadEffect = true;
			checkMentalHerb(targetSlot, battle, messageLog);
		}
		break;
	case 'partiallytrapped':
		if (!targetSlot.partiallyTrapped) {
			const attacker = attackerSlot.pokemon;
			// Duration: 4-6 turns normally, 7 turns with Grip Claw
			const hasGripClaw = attacker.item === 'gripclaw';
			const turns = hasGripClaw ? 7 : Math.floor(Math.random() * 3) + 4; // 4-6 turns
			// Damage divisor: 1/8 normally, 1/6 with Binding Band
			const hasBindingBand = attacker.item === 'bindingband';
			const damage = hasBindingBand ? 6 : 8;
			targetSlot.partiallyTrapped = { turns, moveId: move.id, damage };
			messageLog.push(`${target.species} was trapped by ${move.name}!`);
			hadEffect = true;
		}
		break;
	}

	if (!hadEffect) messageLog.push('But it failed!');
	return true;
}

export function handleGenericHealMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	messageLog: string[]
): boolean {
	if (!move.flags.heal) return false;

	const attacker = attackerSlot.pokemon;
	if (attacker.hp >= attacker.maxHp) {
		messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
	} else {
		const healAmount = Math.floor(attacker.maxHp * (move.heal?.[0] || 1) / (move.heal?.[1] || 2));
		const oldHp = attacker.hp;
		attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
		messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
	}
	return true;
}

export function handleGenericFieldMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const FIELD_EFFECT_DURATION = 5;
	const EXTENDED_FIELD_EFFECT_DURATION = 8;

	// Handle weather moves
	if (move.weather) {
		// Normalize weather values from Dex format to internal format
		// Dex returns: 'RainDance', 'sunnyday', 'Sandstorm', 'hail'
		// Internal format: 'rain', 'sun', 'sand', 'hail'
		const weatherMap: Record<string, 'sun' | 'rain' | 'sand' | 'hail'> = {
			'raindance': 'rain',
			'sunnyday': 'sun',
			'sandstorm': 'sand',
			'hail': 'hail',
		};
		const weatherId = toID(move.weather);
		const normalizedWeather = weatherMap[weatherId];

		// Validate that we have a recognized weather type
		if (!normalizedWeather) {
			messageLog.push(`But it failed! (Unknown weather type)`);
			return true;
		}

		if (battle.weather?.type === normalizedWeather) {
			messageLog.push(`But it failed!`);
		} else {
			const weatherItems: Record<string, string> = {
				'damprock': 'rain', 'heatrock': 'sun', 'smoothrock': 'sand', 'icyrock': 'hail',
			};
			const turns = (battle.magicRoomTurns === 0 && attacker.item &&
				weatherItems[attacker.item] === normalizedWeather) ?
				EXTENDED_FIELD_EFFECT_DURATION : FIELD_EFFECT_DURATION;
			battle.weather = { type: normalizedWeather, turns };
			const weatherStartMessages = {
				'sun': 'The sunlight turned harsh!',
				'rain': 'It started to rain!',
				'sand': 'A sandstorm kicked up!',
				'hail': 'It started to hail!',
			};
			messageLog.push(weatherStartMessages[normalizedWeather]);
		}
		return true;
	}

	// Handle terrain moves (check move.terrain property from Dex)
	if (move.terrain) {
		const terrainId = toID(move.terrain);
		const terrainMap: Record<string, 'electric' | 'grassy' | 'misty' | 'psychic'> = {
			'electricterrain': 'electric',
			'grassyterrain': 'grassy',
			'mistyterrain': 'misty',
			'psychicterrain': 'psychic',
		};
		const terrainType = terrainMap[terrainId];

		if (terrainType) {
			if (battle.terrain) {
				messageLog.push('But it failed! (A terrain is already active)');
			} else {
				battle.terrain = { type: terrainType, turns: FIELD_EFFECT_DURATION };
				messageLog.push(`${attacker.species} turned the battlefield into ${terrainType} terrain!`);
			}
			return true;
		}
	}

	// Handle pseudo-weather moves (rooms, gravity, etc.)
	// Check both move.pseudoWeather (for custom moves) and move.id (for Dex moves)
	const pseudoWeather = move.pseudoWeather || move.id;
	switch (pseudoWeather) {
	case 'trickroom':
		if (battle.trickRoomTurns > 0) {
			battle.trickRoomTurns = 0;
			messageLog.push('The twisted dimensions returned to normal.');
		} else {
			battle.trickRoomTurns = FIELD_EFFECT_DURATION;
			messageLog.push(`${attacker.species} twisted the dimensions!`);
		}
		return true;
	case 'magicroom':
		if (battle.magicRoomTurns > 0) {
			battle.magicRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.magicRoomTurns = FIELD_EFFECT_DURATION;
			messageLog.push('It created a bizarre area where held items lose their effects!');
		}
		return true;
	case 'wonderroom':
		if (battle.wonderRoomTurns > 0) {
			battle.wonderRoomTurns = 0;
			messageLog.push('The bizarre dimensions disappeared.');
		} else {
			battle.wonderRoomTurns = FIELD_EFFECT_DURATION;
			messageLog.push('It created a bizarre area where Defense and Sp. Def stats are swapped!');
		}
		return true;
	case 'electricterrain':
	case 'grassyterrain':
	case 'mistyterrain':
	case 'psychicterrain':
		// This case handles custom moves with pseudoWeather property
		const terrainType = pseudoWeather.replace('terrain', '') as 'electric' | 'grassy' | 'misty' | 'psychic';
		if (battle.terrain) {
			messageLog.push('But it failed! (A terrain is already active)');
		} else {
			battle.terrain = { type: terrainType, turns: FIELD_EFFECT_DURATION };
			messageLog.push(`${attacker.species} turned the battlefield into ${terrainType} terrain!`);
		}
		return true;
	case 'gravity':
		if (battle.gravityTurns > 0) messageLog.push('But it failed!');
		else {
			battle.gravityTurns = FIELD_EFFECT_DURATION;
			messageLog.push('Gravity intensified!');
		}
		return true;
	case 'mudsport':
		if (battle.mudSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.mudSportTurns = FIELD_EFFECT_DURATION;
			messageLog.push('Electricity\'s power was weakened!');
		}
		return true;
	case 'watersport':
		if (battle.waterSportTurns > 0) messageLog.push('But it failed!');
		else {
			battle.waterSportTurns = FIELD_EFFECT_DURATION;
			messageLog.push('Fire\'s power was weakened!');
		}
		return true;
	case 'fairylock':
		if (battle.fairyLockTurns > 0) messageLog.push('But it failed!');
		else {
			battle.fairyLockTurns = 1; // Fairy Lock only lasts 1 turn (prevents switching next turn)
			messageLog.push('No one will be able to run away during the next turn!');
		}
		return true;
	case 'iondeluge':
		if (battle.ionDelugeTurns > 0) messageLog.push('But it failed!');
		else {
			battle.ionDelugeTurns = 1; // Ion Deluge only affects the current turn
			messageLog.push('A deluge of ions showers the battlefield!');
		}
		return true;
	}

	return false;
}

export function handleGenericSideMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attackerSlot.pokemon.id);
	let hadEffect = false;

	if (['reflect', 'lightscreen', 'auroraveil'].includes(move.id)) {
		const duration = (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'lightclay') ? 8 : 5;
		if (isPlayerAttacker) {
			if (move.id === 'reflect' && battle.playerReflectTurns === 0) {
				battle.playerReflectTurns = duration;
				messageLog.push(`Reflect raised your team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.playerLightScreenTurns === 0) {
				battle.playerLightScreenTurns = duration;
				messageLog.push(`Light Screen raised your team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.playerAuroraVeilTurns === 0) {
				battle.playerAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised your team's defenses!`);
				hadEffect = true;
			}
		} else {
			if (move.id === 'reflect' && battle.opponentReflectTurns === 0) {
				battle.opponentReflectTurns = duration;
				messageLog.push(`Reflect raised the opposing team's Defense!`);
				hadEffect = true;
			} else if (move.id === 'lightscreen' && battle.opponentLightScreenTurns === 0) {
				battle.opponentLightScreenTurns = duration;
				messageLog.push(`Light Screen raised the opposing team's Special Defense!`);
				hadEffect = true;
			} else if (move.id === 'auroraveil' && RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'hail' && battle.opponentAuroraVeilTurns === 0) {
				battle.opponentAuroraVeilTurns = duration;
				messageLog.push(`Aurora Veil raised the opposing team's defenses!`);
				hadEffect = true;
			}
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true;
	}

	if (move.sideCondition) {
		const targetHazards = isPlayerAttacker ? battle.opponentHazards : battle.playerHazards;
		const hazardId = toID(move.sideCondition);

		switch (hazardId) {
		case 'spikes':
			if (targetHazards.filter(h => h === 'spikes').length < 3) {
				targetHazards.push('spikes');
				messageLog.push(`Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'toxicspikes':
			if (targetHazards.filter(h => h === 'toxicspikes').length < 2) {
				targetHazards.push('toxicspikes');
				messageLog.push(`Toxic Spikes were scattered all around the opposing team's feet!`);
				hadEffect = true;
			}
			break;
		case 'stickyweb':
			if (!targetHazards.includes('stickyweb')) {
				targetHazards.push('stickyweb');
				messageLog.push(`A sticky web has been laid out on the ground around the opposing team!`);
				hadEffect = true;
			}
			break;
		case 'stealthrock':
			if (!targetHazards.includes('stealthrock')) {
				targetHazards.push('stealthrock');
				messageLog.push(`Pointed stones float in the air around the opposing team!`);
				hadEffect = true;
			}
			break;
		}
		if (!hadEffect) messageLog.push('But it failed!');
		return true;
	}

	if (['quickguard', 'wideguard', 'craftyshield'].includes(move.id)) {
		if (isPlayerAttacker) {
			if (move.id === 'quickguard') battle.playerQuickGuard = true;
			if (move.id === 'wideguard') battle.playerWideGuard = true;
			if (move.id === 'craftyshield') battle.playerCraftyShield = true;
		} else {
			if (move.id === 'quickguard') battle.opponentQuickGuard = true;
			if (move.id === 'wideguard') battle.opponentWideGuard = true;
			if (move.id === 'craftyshield') battle.opponentCraftyShield = true;
		}
		messageLog.push(`${attackerSlot.pokemon.species} is protecting its side!`);
		return true;
	}

	return false;
}

export function handleSpecificStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
): boolean {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const isPlayerAttacker = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);

	switch (move.id) {
	case 'roar':
	case 'whirlwind':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
			messageLog.push(`The wild ${defender.species} was blown away!`);
			const oppSlotIndex = battle.opponentSlots.indexOf(defenderSlot);
			if (oppSlotIndex !== -1) {
				battle.opponentSlots[oppSlotIndex as 0 | 1] = null;
			}
		} else {
			messageLog.push(`But it failed!`);
		}
		return true;

	case 'defog':
		if (battle.playerHazards.length > 0 || battle.opponentHazards.length > 0) {
			battle.playerHazards = [];
			battle.opponentHazards = [];
			messageLog.push('The entry hazards were removed from the field!');
		}
		if (isPlayerAttacker) {
			if (battle.opponentReflectTurns > 0) { battle.opponentReflectTurns = 0; messageLog.push(`The opposing team's Reflect wore off!`); }
			if (battle.opponentLightScreenTurns > 0) { battle.opponentLightScreenTurns = 0; messageLog.push(`The opposing team's Light Screen wore off!`); }
			if (battle.opponentAuroraVeilTurns > 0) { battle.opponentAuroraVeilTurns = 0; messageLog.push(`The opposing team's Aurora Veil wore off!`); }
		} else {
			if (battle.playerReflectTurns > 0) { battle.playerReflectTurns = 0; messageLog.push(`Your team's Reflect wore off!`); }
			if (battle.playerLightScreenTurns > 0) { battle.playerLightScreenTurns = 0; messageLog.push(`Your team's Light Screen wore off!`); }
			if (battle.playerAuroraVeilTurns > 0) { battle.playerAuroraVeilTurns = 0; messageLog.push(`Your team's Aurora Veil wore off!`); }
		}
		if (defenderSlot && defenderSlot.statStages.evasion > -6) {
			defenderSlot.statStages.evasion--;
			messageLog.push(`${defender!.species}'s evasion fell!`);
		}
		return true;

	case 'leechseed':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const defenderSpecies = Dex.species.get(defender.species);
		if (defenderSpecies.types.includes('Grass')) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
		} else if (defenderSlot.isSeeded) {
			messageLog.push(`${defender.species} is already seeded!`);
		} else {
			defenderSlot.isSeeded = true;
			messageLog.push(`${defender.species} was seeded!`);
		}
		return true;

	case 'curse':
		const attackerSpecies = Dex.species.get(attacker.species);
		if (attackerSpecies.types.includes('Ghost')) {
			if (!defenderSlot || defenderSlot.isCursed) {
				messageLog.push(`But it failed!`);
			} else {
				attacker.hp = Math.max(1, Math.floor(attacker.hp / 2));
				messageLog.push(`${attacker.species} cut its own HP to lay a curse!`);
				defenderSlot.isCursed = true;
				messageLog.push(`${defenderSlot.pokemon.species} was cursed!`);
			}
		} else {
			handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog);
		}
		return true;

	case 'psychup':
		if (!defenderSlot) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${attacker.species} copied ${defender.species}'s stat changes!`);
		return true;

	case 'trick':
	case 'switcheroo':
		if (!defenderSlot || battle.magicRoomTurns > 0) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender) || RPGAbilities.checkItemRemovalPrevention(attacker)) {
			messageLog.push('But it failed!');
			return true;
		}
		if (!attacker.item && !defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		const attackerItem = attacker.item;
		const defenderItem = defender.item;
		attacker.item = defenderItem;
		defender.item = attackerItem;
		messageLog.push(`${attacker.species} swapped items with ${defender.species}!`);
		if (attacker.item) messageLog.push(`${attacker.species} obtained a ${ITEMS_DATABASE[attacker.item]?.name || attacker.item}!`);
		if (defender.item) messageLog.push(`${defender.species} obtained a ${ITEMS_DATABASE[defender.item]?.name || defender.item}!`);

		if (attackerItem !== attacker.item) activateUnburden(attackerSlot, messageLog);
		if (defenderItem !== defender.item) activateUnburden(defenderSlot, messageLog);
		return true;

	case 'nightmare':
		if (!defenderSlot || defenderSlot.status !== 'slp' || defenderSlot.hasNightmare) {
			messageLog.push(`But it failed!`);
		} else {
			defenderSlot.hasNightmare = true;
			messageLog.push(`${defender.species} began having a nightmare!`);
		}
		return true;

	case 'bestow':
		if (!defenderSlot || battle.magicRoomTurns > 0 || !attacker.item || defender.item) {
			messageLog.push('But it failed!');
			return true;
		}
		if (RPGAbilities.checkItemRemovalPrevention(defender)) {
			messageLog.push('But it failed!');
			return true;
		}
		const givenItem = attacker.item;
		defender.item = givenItem;
		attacker.item = undefined;
		activateUnburden(attackerSlot, messageLog);
		messageLog.push(`${attacker.species} gave ${ITEMS_DATABASE[givenItem]?.name || givenItem} to ${defender.species}!`);
		return true;

	case 'transform':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		attacker.atk = defender.atk;
		attacker.def = defender.def;
		attacker.spa = defender.spa;
		attacker.spd = defender.spd;
		attacker.spe = defender.spe;
		attacker.moves = defender.moves.map(m => ({ id: m.id, pp: 5 }));
		const originalSpecies = attacker.species;
		attacker.species = defender.species;
		if (defender.ability) attacker.ability = defender.ability;
		attackerSlot.statStages = { ...defenderSlot.statStages };
		messageLog.push(`${originalSpecies} transformed into ${defender.species}!`);
		return true;

	case 'helpinghand':
		if (!defenderSlot) {
			messageLog.push('But it failed!');
			return true;
		}
		defenderSlot.isHelped = true;
		messageLog.push(`${attacker.species} is ready to help ${defender.species}!`);
		return true;

	case 'substitute':
		if (attackerSlot.substitute) {
			messageLog.push(`${attacker.species} already has a substitute!`);
		} else {
			const subHP = Math.floor(attacker.maxHp / 4);
			if (attacker.hp <= subHP) {
				messageLog.push(`But it does not have enough HP left to make a substitute!`);
			} else {
				attacker.hp -= subHP;
				attackerSlot.substitute = { hp: subHP };
				messageLog.push(`${attacker.species} made a substitute!`);
			}
		}
		return true;

	case 'charge':
		attackerSlot.isCharged = true;
		messageLog.push(`${attacker.species} began charging power!`);
		return false; // Return false to indicate it's not a "full" move yet

	case 'stockpile':
		if (attackerSlot.stockpileCount < 3) {
			attackerSlot.stockpileCount++;
			messageLog.push(`${attacker.species} stockpiled ${attackerSlot.stockpileCount}!`);

			let boostValue = 1;
			if (toID(attacker.ability || '') === 'contrary') {
				boostValue = -1;
			}

			if (boostValue > 0) {
				if (attackerSlot.statStages.def < 6) {
					attackerSlot.statStages.def++;
					messageLog.push(`${attacker.species}'s Defense rose!`);
				}
				if (attackerSlot.statStages.spd < 6) {
					attackerSlot.statStages.spd++;
					messageLog.push(`${attacker.species}'s Sp. Def rose!`);
				}
			} else {
				if (attackerSlot.statStages.def > -6) {
					attackerSlot.statStages.def--;
					messageLog.push(`${attacker.species}'s Defense fell!`);
				}
				if (attackerSlot.statStages.spd > -6) {
					attackerSlot.statStages.spd--;
					messageLog.push(`${attacker.species}'s Sp. Def fell!`);
				}
			}
			return true;
		} else {
			messageLog.push(`${attacker.species} can't stockpile any more!`);
			return true;
		}

	case 'bellydrum':
		const contraryActive = toID(attacker.ability || '') === 'contrary';
		if (contraryActive) {
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk <= -6) {
				messageLog.push(`But it failed! (Attack is already minimized)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = -6;
				messageLog.push(`${attacker.species} cut its own HP and minimized its Attack!`);
			}
		} else {
			if (attacker.hp <= attacker.maxHp / 2) {
				messageLog.push(`But it failed! (Not enough HP)`);
			} else if (attackerSlot.statStages.atk >= 6) {
				messageLog.push(`But it failed! (Attack is already maxed out)`);
			} else {
				attacker.hp = Math.floor(attacker.hp - attacker.maxHp / 2);
				attackerSlot.statStages.atk = 6;
				messageLog.push(`${attacker.species} cut its own HP and maximized its Attack!`);
			}
		}
		return true;

	case 'futuresight':
	case 'doomdesire': {
		const futureMoveArray = isPlayerAttacker ? battle.opponentFutureMoves : battle.playerFutureMoves;
		const targetSlotLocalIndex = (isPlayerAttacker ? battle.opponentSlots : battle.playerSlots).indexOf(defenderSlot);
		if (targetSlotLocalIndex === -1) {
			messageLog.push('But it failed!');
			return true;
		}
		const existingFutureMove = futureMoveArray.find(fm => fm.slotIndex === targetSlotLocalIndex);
		if (existingFutureMove) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const futureAttackerSlotIndex = (isPlayerAttacker ? battle.playerSlots : battle.opponentSlots).indexOf(attackerSlot);
		futureMoveArray.push({
			slotIndex: targetSlotLocalIndex,
			moveId: move.id,
			turnsLeft: 2,
			attackerSlotIndex: futureAttackerSlotIndex,
			attackerStats: {
				atk: attacker.atk * RPGAbilities.getStatMultiplier(attackerSlot.statStages.atk),
				spa: attacker.spa * RPGAbilities.getStatMultiplier(attackerSlot.statStages.spa),
			},
		});
		messageLog.push(`${attacker.species} foresaw an attack!`);
		return true;
	}

	case 'protect':
	case 'detect':
		const successCounter = attackerSlot.protectSuccessCounter;
		const successChance = 1 / 3 ** successCounter;
		if (Math.random() < successChance) {
			attackerSlot.isProtected = true;
			attackerSlot.protectSuccessCounter++;
			messageLog.push(`${attacker.species} protected itself!`);
		} else {
			messageLog.push(`But it failed!`);
		}
		return true;

	case 'followme':
	case 'ragepowder':
		attackerSlot.isRedirecting = true;
		messageLog.push(`${attacker.species} became the center of attention!`);
		return true;

	case 'haze':
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			slot.statStages = { ...INITIAL_STAT_STAGES };
		});
		messageLog.push('All stat changes were eliminated!');
		return true;

	case 'perishsong':
		let affectedCount = 0;
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			const slotAbility = toID(slot.pokemon.ability || '');
			if (slotAbility !== 'soundproof' && !slot.perishSongCounter) {
				slot.perishSongCounter = 3;
				affectedCount++;
			}
		});
		if (affectedCount > 0) {
			messageLog.push('All Pokémon that heard the song will faint in three turns!');
		} else {
			messageLog.push('But it failed!');
		}
		return true;

	case 'courtchange':
		// Swap hazards and screens between both sides
		const tempHazards = [...battle.playerHazards];
		battle.playerHazards = [...battle.opponentHazards];
		battle.opponentHazards = tempHazards;

		const tempReflect = battle.playerReflectTurns;
		battle.playerReflectTurns = battle.opponentReflectTurns;
		battle.opponentReflectTurns = tempReflect;

		const tempLightScreen = battle.playerLightScreenTurns;
		battle.playerLightScreenTurns = battle.opponentLightScreenTurns;
		battle.opponentLightScreenTurns = tempLightScreen;

		const tempAuroraVeil = battle.playerAuroraVeilTurns;
		battle.playerAuroraVeilTurns = battle.opponentAuroraVeilTurns;
		battle.opponentAuroraVeilTurns = tempAuroraVeil;

		messageLog.push(`${attacker.species} swapped the battle effects on both sides of the field!`);
		return true;

	case 'flowershield':
		let flowershieldAffected = 0;
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			const slotSpecies = Dex.species.get(slot.pokemon.species);
			if (slotSpecies.types.includes('Grass') && slot.statStages.def < 6) {
				slot.statStages.def++;
				messageLog.push(`${slot.pokemon.species}'s Defense rose!`);
				flowershieldAffected++;
			}
		});
		if (flowershieldAffected === 0) {
			messageLog.push('But it failed!');
		}
		return true;

	case 'rototiller':
		let rototillerAffected = 0;
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			const slotSpecies = Dex.species.get(slot.pokemon.species);
			if (slotSpecies.types.includes('Grass') && RPGAbilities.isGrounded(slot.pokemon, battle)) {
				let boosted = false;
				if (slot.statStages.atk < 6) {
					slot.statStages.atk++;
					boosted = true;
				}
				if (slot.statStages.spa < 6) {
					slot.statStages.spa++;
					boosted = true;
				}
				if (boosted) {
					messageLog.push(`${slot.pokemon.species}'s Attack and Sp. Atk rose!`);
					rototillerAffected++;
				}
			}
		});
		if (rototillerAffected === 0) {
			messageLog.push('But it failed!');
		}
		return true;

	case 'teatime':
		let teatimeAffected = 0;
		getActiveSlots([...battle.playerSlots, ...battle.opponentSlots]).forEach(slot => {
			// Check if item exists and is a berry (items ending with 'berry' suffix)
			if (slot.pokemon.item) {
				const itemData = ITEMS_DATABASE[slot.pokemon.item];
				// Berry items have category 'berry' or their ID ends with 'berry'
				if (itemData?.category === 'berry' || slot.pokemon.item?.endsWith('berry')) {
					messageLog.push(`${slot.pokemon.species} consumed its ${itemData?.name || slot.pokemon.item}!`);
					// TODO: Implement actual berry effects (healing, stat boosts, status cure, etc.)
					// For now, berries are just consumed without applying their effects
					slot.pokemon.item = undefined;
					activateUnburden(slot, messageLog);
					teatimeAffected++;
				}
			}
		});
		if (teatimeAffected === 0) {
			messageLog.push('But it failed!');
		}
		return true;

	case 'healbell':
	case 'aromatherapy': {
		const isPlayerHealingUser = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
		const teamSlots = isPlayerHealingUser ? battle.playerSlots : battle.opponentSlots;
		let healedCount = 0;
		teamSlots.forEach(slot => {
			if (slot?.status) {
				slot.status = null;
				slot.sleepCounter = 0;
				healedCount++;
			}
		});
		if (healedCount > 0) {
			const message = move.id === 'aromatherapy' ?
				'A soothing aroma wafted through the area! The team\'s status conditions were healed!' :
				'A bell chimed! The team\'s status conditions were healed!';
			messageLog.push(message);
		} else {
			messageLog.push('But it failed!');
		}
		return true;
	}

	case 'rest':
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else if (attackerSlot.status === 'slp') {
			messageLog.push(`But it failed! (${attacker.species} is already asleep!)`);
		} else {
			const oldHp = attacker.hp;
			attacker.hp = attacker.maxHp;
			attackerSlot.status = 'slp';
			attackerSlot.sleepCounter = 2;
			messageLog.push(`${attacker.species} went to sleep and restored ${attacker.hp - oldHp} HP!`);
		}
		return true;

	case 'roost':
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else {
			const healAmount = Math.floor(attacker.maxHp / 2);
			const oldHp = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
			messageLog.push(`${attacker.species} landed and restored ${attacker.hp - oldHp} HP!`);
		}
		return true;

	case 'synthesis':
	case 'moonlight':
	case 'morningsun':
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else {
			let healRatio = 0.5;
			if (RPGAbilities.isWeatherActive(battle)) {
				if (battle.weather?.type === 'sun') healRatio = 0.667;
				else if (['rain', 'sand', 'hail'].includes(battle.weather!.type)) healRatio = 0.25;
			}
			const healAmount = Math.floor(attacker.maxHp * healRatio);
			const oldHp = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
			messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
		}
		return true;

	case 'shoreup':
		if (attacker.hp >= attacker.maxHp) {
			messageLog.push(`But it failed! (${attacker.species}'s HP is already full!)`);
		} else {
			let healRatio = 0.5;
			if (RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sand') {
				healRatio = 0.667;
			}
			const healAmount = Math.floor(attacker.maxHp * healRatio);
			const oldHp = attacker.hp;
			attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
			messageLog.push(`${attacker.species} restored ${attacker.hp - oldHp} HP!`);
		}
		return true;

	case 'painsplit':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const averageHP = Math.floor((attacker.hp + defender.hp) / 2);
		const attackerChange = averageHP - attacker.hp;
		const defenderChange = averageHP - defender.hp;
		attacker.hp = averageHP;
		defender.hp = averageHP;
		messageLog.push(`The battlers shared their pain!`);
		if (attackerChange > 0) messageLog.push(`${attacker.species} gained ${attackerChange} HP!`);
		else if (attackerChange < 0) messageLog.push(`${attacker.species} lost ${-attackerChange} HP!`);
		if (defenderChange > 0) messageLog.push(`${defender.species} gained ${defenderChange} HP!`);
		else if (defenderChange < 0) messageLog.push(`${defender.species} lost ${-defenderChange} HP!`);
		return true;

	case 'rapidspin':
		if (!defenderSlot) {
			messageLog.push(`But it failed!`);
			return true;
		}
		// Rapid Spin deals damage (handled separately), then removes hazards and raises Speed
		const playerIsUser = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
		const userHazards = playerIsUser ? battle.playerHazards : battle.opponentHazards;
		if (userHazards.length > 0) {
			userHazards.length = 0;
			messageLog.push(`${attacker.species} blew away the hazards!`);
		}
		if (attackerSlot.statStages.spe < 6) {
			attackerSlot.statStages.spe++;
			messageLog.push(`${attacker.species}'s Speed rose!`);
		}
		return false; // Return false so damage is still calculated

	case 'memento':
		if (!defenderSlot) {
			messageLog.push(`But it failed!`);
			return true;
		}
		let mementoWorked = false;
		if (defenderSlot.statStages.atk > -6) {
			defenderSlot.statStages.atk = Math.max(-6, defenderSlot.statStages.atk - 2);
			mementoWorked = true;
		}
		if (defenderSlot.statStages.spa > -6) {
			defenderSlot.statStages.spa = Math.max(-6, defenderSlot.statStages.spa - 2);
			mementoWorked = true;
		}
		if (mementoWorked) {
			messageLog.push(`${defender.species}'s Attack and Sp. Atk harshly fell!`);
			attacker.hp = 0;
			messageLog.push(`${attacker.species} fainted!`);
		} else {
			messageLog.push('But it failed!');
		}
		return true;

	case 'endeavor':
		if (!defender) {
			messageLog.push(`But it failed!`);
			return true;
		}
		if (attacker.hp >= defender.hp) {
			messageLog.push(`But it failed!`);
			return true;
		}
		const endeavorDamage = defender.hp - attacker.hp;
		defender.hp = attacker.hp;
		messageLog.push(`${defender.species} took ${endeavorDamage} damage!`);
		return true;

	case 'block':
	case 'meanlook':
	case 'spiderweb':
		if (!defenderSlot) {
			messageLog.push('But it failed!');
			return true;
		}
		if (defenderSlot.isTrapped) {
			messageLog.push(`${defender.species} is already trapped!`);
		} else {
			defenderSlot.isTrapped = { turns: 5 };
			messageLog.push(`${defender.species} can no longer escape!`);
		}
		return true;

	case 'fakeout':
		if (attackerSlot.activeTurns !== 1) {
			messageLog.push(`But it failed! (Fake Out only works on first turn)`);
			return true;
		}
		if (defenderSlot) {
			defenderSlot.willFlinch = true;
		}
		return false; // Return false so damage is still calculated
	}

	return false;
}

export function handleChargingMove(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	moveObject: { id: string, pp: number },
	battle: BattleState,
	messageLog: string[],
	ppDeduction: number
): boolean {
	if (move.flags.charge && !attackerSlot.chargingMove) {
		attackerSlot.chargingMove = move.id;
		let chargeMessage = `${attackerSlot.pokemon.species} is charging up!`;

		if (move.id === 'fly') chargeMessage = `${attackerSlot.pokemon.species} flew up high!`;
		else if (move.id === 'dig') chargeMessage = `${attackerSlot.pokemon.species} burrowed underground!`;
		else if (move.id === 'dive') chargeMessage = `${attackerSlot.pokemon.species} hid underwater!`;
		else if (move.id === 'bounce') chargeMessage = `${attackerSlot.pokemon.species} sprang up!`;
		else if (move.id === 'shadowforce' || move.id === 'phantomforce') chargeMessage = `${attackerSlot.pokemon.species} vanished instantly!`;
		else if (move.id === 'solarbeam' || move.id === 'solarblade') {
			if (RPGAbilities.isWeatherActive(battle) && battle.weather?.type === 'sun') {
				attackerSlot.chargingMove = undefined;
				chargeMessage = '';
			} else {
				chargeMessage = `${attackerSlot.pokemon.species} absorbed light!`;
			}
		} else if (move.id === 'skyattack') chargeMessage = `${attackerSlot.pokemon.species} became cloaked in a harsh light!`;
		else if (move.id === 'geomancy') chargeMessage = `${attackerSlot.pokemon.species} is absorbing power!`;

		if (chargeMessage) messageLog.push(chargeMessage);

		if (attackerSlot.chargingMove) {
			if (moveObject.id !== 'struggle' && moveObject.pp > 0) {
				moveObject.pp = Math.max(0, moveObject.pp - ppDeduction);
			}
			return true;
		}
	} else if (attackerSlot.chargingMove === move.id) {
		attackerSlot.chargingMove = undefined;
	}

	return false;
}

export const RPGMoves = {
	getDamageBasePower,
	handleDamagingMovePreamble,
	handleSpecificStatusMove,
	handleGenericBoostMove,
	handleGenericStatusInflictMove,
	handleGenericVolatileMove,
	handleGenericHealMove,
	handleGenericFieldMove,
	handleGenericSideMove,
	handleChargingMove,
};

export default RPGMoves;
