/*
* Pokemon Showdown
* RPG Battle Engine
*
* This file contains all the core logic for running a battle,
* including damage calculation, move execution, turn processing,
* and end-of-turn effects.
*/

import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getActiveSlots, getActiveParty, calculateTotalExpForLevel, calculateStats, getMove, levelUp, handleLearningMoves, checkEvolution, NATURES, type CheckEvolutionContext } from './utils';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState, Stats, Move, AbilityContext } from './interface';
import { ITEMS_DATABASE, ITEM_PRICES } from './items';
import { BERRY_FLAVORS, NATURE_FLAVOR_PREFERENCES, TYPE_RESIST_BERRIES, TYPE_CHART } from './data';
import { getPlayerData, activeBattles, playerData } from './core';
import {
	generateBattleHTML,
	generateMoveLearnHTML,
	generatePivotSwitchHTML,
	generateFaintSwitchHTML,
} from './html';
import { MANUAL_CATCH_RATES } from './MANUAL_CATCH_RATES';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';
import { RPGMoves } from './battle-moves';
import {
	INITIAL_STAT_STAGES,
	applyStatChange,
	checkStatDropAbilities,
	activateUnburden,
	applySynchronize,
	handleHPDropEffects,
	consumeBerry,
} from './battle-shared';

/**
 * Get the current types of a Pokemon, accounting for terastallization.
 */
export function getPokemonTypes(pokemon: RPGPokemon, slot?: ActivePokemonSlot): string[] {
	if (slot?.terastallized) {
		return [slot.terastallized];
	}
	const species = Dex.species.get(pokemon.species);
	return species.types;
}

export function getCustomEffectiveness(moveType: string, defenderTypes: string[], defender: RPGPokemon, battle: BattleState, attacker?: RPGPokemon): number {
	let effectiveness = 1;
	const chartEntry = TYPE_CHART[moveType];
	if (!chartEntry) return 1;

	// Phase 4: Delta Stream - Strong winds negate Flying-type weaknesses
	const hasStrongWinds = battle.weather?.type === 'strong-winds';
	const isFlyingType = defenderTypes.includes('Flying');

	// Phase 2: Mind's Eye - Hits Ghost types with Normal/Fighting moves
	const attackerAbility = attacker ? toID(attacker.ability || '') : '';
	const hasMindEye = attackerAbility === 'mindseye';
	// Scrappy - Allows Normal/Fighting moves to hit Ghost types
	const hasScrappy = attackerAbility === 'scrappy';

	for (const defenderType of defenderTypes) {
		if (chartEntry.superEffective.includes(defenderType)) {
			// Delta Stream negates super effective hits on Flying types from Rock, Electric, Ice
			if (hasStrongWinds && isFlyingType && defenderType === 'Flying' &&
				['Rock', 'Electric', 'Ice'].includes(moveType)) {
				effectiveness *= 1; // Neutral instead of super effective
			} else {
				effectiveness *= 2;
			}
		} else if (chartEntry.notVeryEffective.includes(defenderType)) {
			effectiveness *= 0.5;
		} else if (chartEntry.noEffect.includes(defenderType)) {
			// Mind's Eye bypasses Ghost immunity to Normal/Fighting
			if (hasMindEye && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				// Don't multiply by 0, treat as neutral
				effectiveness *= 1;
			} else if (hasScrappy && defenderType === 'Ghost' && ['Normal', 'Fighting'].includes(moveType)) {
				// Scrappy bypasses Ghost immunity to Normal/Fighting
				effectiveness *= 1;
			} else {
				effectiveness *= 0;
			}
		}
	}
	return effectiveness;
}

export function getBallBonus(ballId: string, battle: BattleState, targetSlot: ActivePokemonSlot): number {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;
	const playerSlot = getActiveSlots(battle.playerSlots)[0];
	if (!playerSlot) return 1;
	const activePokemon = playerSlot.pokemon;
	const turn = battle.turn;

	const opponentSpecies = Dex.species.get(opponentActivePokemon.species);

	switch (ballId) {
	case 'greatball': return 1.5;
	case 'ultraball': return 2;
	case 'masterball': return 255;
	case 'fastball':
		return opponentSpecies.baseStats.spe >= 100 ? 4 : 1;
	case 'levelball':
		if (activePokemon.level >= opponentActivePokemon.level * 4) return 8;
		if (activePokemon.level >= opponentActivePokemon.level * 2) return 4;
		if (activePokemon.level > opponentActivePokemon.level) return 2;
		return 1;
	case 'nestball':
		return opponentActivePokemon.level <= 30 ? Math.max(1, (41 - opponentActivePokemon.level) / 10) : 1;
	case 'netball':
		return opponentSpecies.types.includes('Bug') || opponentSpecies.types.includes('Water') ? 3.5 : 1;
	case 'quickball':
		return turn === 0 ? 5 : 1;
	case 'timerball':
		return Math.min(4, 1 + turn * (1229 / 4096));
	case 'dreamball':
		return opponentStatus === 'slp' ? 4 : 1;
	default:
		return 1;
	}
}

export function performCatchAttempt(battle: BattleState, ballId: string, targetSlot: ActivePokemonSlot): { success: boolean, shakes: number } {
	const opponentActivePokemon = targetSlot.pokemon;
	const opponentStatus = targetSlot.status;

	const speciesId = toID(opponentActivePokemon.species);
	const catchRate = MANUAL_CATCH_RATES[speciesId] || 150;

	const ballBonus = getBallBonus(ballId, battle, targetSlot);
	if (ballBonus === 255) return { success: true, shakes: 4 };

	let statusBonus = 1;
	if (opponentStatus === 'slp' || opponentStatus === 'frz') {
		statusBonus = 2.5;
	} else if (opponentStatus === 'par' || opponentStatus === 'psn' || opponentStatus === 'brn') {
		statusBonus = 1.5;
	}

	const { maxHp, hp } = opponentActivePokemon;
	const modifiedCatchRate = catchRate;

	const a = Math.floor(
		(((3 * maxHp - 2 * hp) * modifiedCatchRate * ballBonus) / (3 * maxHp)) * statusBonus
	);

	if (a >= 255) return { success: true, shakes: 4 };

	const b = Math.floor(65536 / (255 / a) ** 0.1875);

	let shakes = 0;
	for (let i = 0; i < 4; i++) {
		const rand = Math.floor(Math.random() * 65536);
		if (rand >= b) {
			return { success: false, shakes };
		}
		shakes++;
	}

	return { success: true, shakes: 4 };
}

export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 + Math.abs(stage));
	}
}

export function getCriticalHitChance(attackerSlot: ActivePokemonSlot, defenderSlot: ActivePokemonSlot, move: Move, battle: BattleState): number {
	const defenderAbility = toID(defenderSlot.pokemon.ability || '');
	if (RPGAbilities.isAbilityIgnored(attackerSlot.pokemon, defenderSlot.pokemon, defenderAbility)) {
		// Continue if ability is ignored
	} else if (defenderAbility === 'battlearmor' || defenderAbility === 'shellarmor') {
		return 0;
	}

	if (['frostbreath', 'stormthrow', 'zipzapzap', 'surginstrikes'].includes(move.id)) {
		return 1;
	}

	let critStage = 0;
	const attacker = attackerSlot.pokemon;

	// Phase 2: Merciless - always crit against poisoned targets
	const abilityId = toID(attacker.ability || '');
	if (abilityId === 'merciless' && (defenderSlot.status === 'psn' || defenderSlot.status === 'tox')) {
		return 1;
	}

	if (attackerSlot.focusEnergy) {
		critStage += 2;
	}

	if (['slash', 'razorleaf', 'crabhammer', 'karatechop', 'attackorder', 'blazekick', 'crosschop', 'crosspoison', 'nightslash', 'poisontail', 'psychocut', 'shadowclaw', 'spacialrend', 'stoneedge'].includes(move.id)) {
		critStage += 1;
	}

	if (battle.magicRoomTurns === 0 && (attacker.item === 'scopelens' || attacker.item === 'razorclaw')) {
		critStage += 1;
	}

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'superluck') {
		critStage += 1;
	}

	const critChances = [1 / 24, 1 / 8, 1 / 2, 1 / 1];
	return critChances[Math.min(critStage, 3)];
}

export function gainEffortValues(pokemon: RPGPokemon, defeatedPokemon: RPGPokemon) {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	const evYield = MANUAL_EV_YIELDS[defeatedSpeciesId] || { atk: 1 };

	let totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	for (const stat in evYield) {
		if (totalEVs >= 510) break;
		const statKey = stat as keyof Stats;
		const evGained = evYield[statKey]!;
		const currentEV = pokemon.evs[statKey];
		if (currentEV >= 252) continue;
		const canAdd = Math.min(evGained, 252 - currentEV, 510 - totalEVs);
		pokemon.evs[statKey] += canAdd;
		totalEVs += canAdd;
	}
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
	const hpDiff = newStats.maxHp - pokemon.maxHp;
	pokemon.hp = Math.max(1, pokemon.hp + hpDiff);
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;
}

export function gainExperience(
	player: PlayerData,
	participantSlots: ActivePokemonSlot[],
	defeatedPokemon: RPGPokemon,
	room: ChatRoom,
	user: User
): { messages: string[], leveledUp: boolean } {
	const defeatedSpeciesId = toID(defeatedPokemon.species);
	const baseExp = MANUAL_BASE_EXP[defeatedSpeciesId] || 150;

	let leveledUp = false;
	const messages: string[] = [];
	const participantExpGains = new Map<string, number>();

	// Gen 5-9 Scaled Experience Formula
	// Formula: ExpGained = floor((X^1.5 * Z) / (Y^1.5)) + 1
	// Where: X = 2 * OpponentLevel + 10
	//        Y = OpponentLevel + ParticipantLevel + 10
	//        Z = floor((BaseExp * OpponentLevel) / 5)
	//        X^1.5 = sqrt(X) * X * X (same for Y^1.5)
	const opponentLevel = defeatedPokemon.level;
	const X = 2 * opponentLevel + 10;
	const Z = Math.floor((baseExp * opponentLevel) / 5);

	// Get IDs of active participants (for EV distribution)
	const activeParticipantIds = new Set<string>();
	for (const slot of participantSlots) {
		if (slot?.pokemon && slot.pokemon.hp > 0) {
			activeParticipantIds.add(slot.pokemon.id);
		}
	}

	// Gen 6-9: Exp Share is always on - ALL Pokemon in party gain experience
	for (const pokemon of player.party) {
		if (pokemon.level >= 100) continue;

		// Calculate level-scaled experience for this Pokemon
		const participantLevel = pokemon.level;
		const Y = opponentLevel + participantLevel + 10;

		// Calculate scaling factor: (X^1.5) / (Y^1.5)
		const scalingFactor = (Math.sqrt(X) * X * X) / (Math.sqrt(Y) * Y * Y);
		const expGained = Math.floor(scalingFactor * Z) + 1;

		participantExpGains.set(pokemon.species, expGained);

		// Only active participants gain EVs
		if (activeParticipantIds.has(pokemon.id)) {
			gainEffortValues(pokemon, defeatedPokemon);
		}

		pokemon.experience += expGained;
	}

	if (participantExpGains.size === 0) return { messages: [], leveledUp: false };

	// Create exp gain message
	if (participantExpGains.size === 1) {
		const [species, exp] = Array.from(participantExpGains.entries())[0];
		messages.push(`<b>${species} gained ${exp} Experience Points!</b>`);
	} else {
		// Check if all Pokemon gained the same exp
		const expValues = Array.from(participantExpGains.values());
		const allSame = expValues.every(v => v === expValues[0]);

		if (allSame) {
			const participantNames = Array.from(participantExpGains.keys());
			messages.push(`<b>${participantNames.join(' and ')} gained ${expValues[0]} Experience Points!</b>`);
		} else {
			// Different exp amounts - show individual gains
			const expStrings = Array.from(participantExpGains.entries()).map(([name, exp]) =>
				`${name} gained ${exp} Experience Points`
			);
			messages.push(`<b>${expStrings.join(' and ')}!</b>`);
		}
	}

	// Check for level ups, evolutions, and move learning for ALL Pokemon in party
	for (const pokemon of player.party) {
		if (pokemon.level >= 100) continue;

		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;
			const evolveMessage = checkEvolution(player, pokemon, { room, user });
			if (evolveMessage) {
				messages.push(evolveMessage);
				break;
			}
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}
	}

	return { messages, leveledUp };
}

export function saveBattleStatus(battle: BattleState) {
	const player = getPlayerData(battle.playerId);
	const playerParty = getActiveParty(battle, player);

	for (const slot of battle.playerSlots) {
		if (slot) {
			const pokemonInParty = playerParty.find(p => p.id === slot.pokemon.id);
			if (pokemonInParty) {
				if (slot.status === 'slp' || slot.status === 'frz') {
					pokemonInParty.status = null;
				} else {
					pokemonInParty.status = slot.status;
				}
			}
		}
	}

	if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
		for (const slot of battle.opponentSlots) {
			if (slot) {
				const opponentPokemonInParty = battle.opponentParty.find(p => p.id === slot.pokemon.id);
				if (opponentPokemonInParty) {
					opponentPokemonInParty.status = slot.status;
				}
			}
		}
	}
}

export function getDamageOffense(
	move: Move,
	attacker: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	battle: BattleState,
	abilityContext: AbilityContext // Added for Foul Play
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spa' : 'atk';
	let attackStatRaw: number;

	if (move.id === 'foulplay') {
		// Foul Play uses the defender's Attack stat
		const defender = abilityContext.defender; // We need to get the defender context
		attackStatRaw = defender.atk;
		statName = 'atk'; // Ensure it uses 'atk' stat stages
	} else {
		// Standard moves use the attacker's stats
		attackStatRaw = attacker[statName];
	}

	attackStatRaw = RPGAbilities.applyAbilityStatModifier(attacker, statName, attackStatRaw, attackerSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'choiceband' && !isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
		if (attacker.item === 'choicespecs' && isSpecial) {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	if (isSpecial && RPGAbilities.isWeatherActive(battle) && (battle.weather?.type === 'sun' || battle.weather?.type === 'harsh-sun')) {
		if (toID(attacker.ability || '') === 'solarpower') {
			attackStatRaw = Math.floor(attackStatRaw * 1.5);
		}
	}

	return attackStatRaw;
}

export function getDamageDefense(
	move: Move,
	defender: RPGPokemon,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState
): number {
	const isSpecial = move.category === 'Special';
	let statName = isSpecial ? 'spd' : 'def';

	// Handle Psyshock, Psystrike, Secret Sword (Special moves that target Defense)
	if (isSpecial && ['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		statName = 'def';
	}

	if (battle.wonderRoomTurns > 0) {
		statName = isSpecial ? 'def' : 'spd';
	}

	let defenseStatRaw = defender[statName];

	defenseStatRaw = RPGAbilities.applyAbilityStatModifier(defender, statName, defenseStatRaw, defenderSlot, battle);

	if (battle.magicRoomTurns === 0) {
		if (defender.item === 'assaultvest' && isSpecial && battle.wonderRoomTurns === 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
		}

		if (defender.item === 'eviolite') {
			const species = Dex.species.get(defender.species);
			if (species.evos && species.evos.length > 0) {
				const defWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'def', defender.def, defenderSlot, battle);
				const spdWithAbility = RPGAbilities.applyAbilityStatModifier(defender, 'spd', defender.spd, defenderSlot, battle);

				if (statName === 'def') {
					defenseStatRaw = Math.floor(defWithAbility * 1.5);
				} else {
					defenseStatRaw = Math.floor(spdWithAbility * 1.5);
				}
			}
		}
	}

	return defenseStatRaw;
}

export function getMoveType(
	move: Move,
	attacker: RPGPokemon,
	battle: BattleState,
	abilityContext: AbilityContext
): string {
	let moveType = move.type;

	if (move.id === 'weatherball') {
		if (RPGAbilities.isWeatherActive(battle)) {
			// Weather takes priority
			switch (battle.weather!.type) {
			case 'sun': moveType = 'Fire'; break;
			case 'rain': moveType = 'Water'; break;
			case 'sand': moveType = 'Rock'; break;
			case 'hail': moveType = 'Ice'; break;
			}
		} else if (battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
			// Terrain is checked if no weather is active
			switch (battle.terrain.type) {
			case 'electric': moveType = 'Electric'; break;
			case 'grassy': moveType = 'Grass'; break;
			case 'psychic': moveType = 'Psychic'; break;
			case 'misty': moveType = 'Fairy'; break;
			}
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && RPGAbilities.isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	moveType = RPGAbilities.applyTypeModifier(abilityContext, moveType);
	return moveType;
}

export function applyFinalDamageModifiers(
	baseDamage: number,
	move: Move,
	moveType: string,
	attacker: RPGPokemon,
	defender: RPGPokemon,
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	battle: BattleState,
	effectiveness: number,
	isCritical: boolean,
	abilityContext: AbilityContext
): number {
	let damage = baseDamage;

	const attackerAbility = toID(attacker.ability || '');
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);

	// Check for screens only if the attacker does not have Infiltrator
	if (attackerAbility !== 'infiltrator' && !isCritical) {
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
		if (defenderVeilTurns > 0) {
			damage = Math.floor(damage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) damage = Math.floor(damage * 0.5);
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) damage = Math.floor(damage * 0.5);
			}
		}
	}

	if (RPGAbilities.isWeatherActive(battle)) {
		if (battle.weather!.type === 'sun' || battle.weather!.type === 'harsh-sun') {
			if (moveType === 'Fire') damage = Math.floor(damage * 1.5);
			if (moveType === 'Water') damage = Math.floor(damage * 0.5);
		} else if (battle.weather!.type === 'rain' || battle.weather!.type === 'heavy-rain') {
			if (moveType === 'Water') damage = Math.floor(damage * 1.5);
			if (moveType === 'Fire') damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = RPGAbilities.isGrounded(attacker, battle);
		const defenderIsGrounded = RPGAbilities.isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			damage = Math.floor(damage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			damage = Math.floor(damage * 0.5);
		}
	}

	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		damage = Math.floor(damage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		damage = Math.floor(damage * 0.33);
	}

	damage = RPGAbilities.applyDamageModifier(abilityContext, damage);

	if (battle.magicRoomTurns === 0) {
		if (attacker.item === 'lifeorb') {
			damage = Math.floor(damage * 1.3);
		}
		if (attacker.item === 'expertbelt' && effectiveness > 1) {
			damage = Math.floor(damage * 1.2);
		}
	}

	return damage;
}

export function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number
): { damage: number, message: string, effectiveness: number, berryConsumed?: string, isCritical: boolean } {
	const move = getMove(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const defenderSpecies = Dex.species.get(defender.species);

	const abilityContext: any = {
		attacker,
		defender,
		attackerSlot,
		defenderSlot,
		move: { ...move },
		battle,
		messageLog: [],
	};

	if (move.flags.powder && defenderSpecies.types.includes('Grass')) {
		return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0, isCritical: false };
	}
	const immunityCheck = RPGAbilities.checkImmunity(abilityContext);
	if (immunityCheck?.immune) {
		return { damage: 0, message: ` <i style="color: #6c757d;">${immunityCheck.message}</i>`, effectiveness: 0, isCritical: false };
	}

	if (!move.basePower) {
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1, isCritical: false };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'psywave') {
			return { damage: Math.floor(Math.random() * attacker.level * 1.5) + 1, message: '', effectiveness: 1, isCritical: false };
		}
		if (moveId === 'superfang') {
			return { damage: Math.floor(defender.hp / 2), message: '', effectiveness: 1, isCritical: false };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1, isCritical: false };
	}

	let basePower = RPGMoves.getDamageBasePower(move, attacker, defender, attackerSlot, defenderSlot, battle);
	if (basePower === -1) {
		const healAmount = Math.floor(defender.maxHp * 0.25);
		defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0, isCritical: false };
	}

	const moveType = getMoveType(move, attacker, battle, abilityContext);
	abilityContext.move.type = moveType;

	basePower = RPGAbilities.applyPowerModifier(abilityContext, basePower);

	const attackStatRaw = getDamageOffense(move, attacker, attackerSlot, battle, abilityContext);
	const defenseStatRaw = getDamageDefense(move, defender, defenderSlot, battle);

	let attackStage: number;
	if (move.id === 'foulplay') {
		attackStage = defenderSlot.statStages.atk;
	} else {
		attackStage = move.category === 'Special' ? attackerSlot.statStages.spa : attackerSlot.statStages.atk;
	}

	let defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderSlot.statStages.def : defenderSlot.statStages.spd) :
		(move.category === 'Special' ? defenderSlot.statStages.spd : defenderSlot.statStages.def);

	// Handle Psyshock / Psystrike / Secret Sword
	if (['psyshock', 'psystrike', 'secretsword'].includes(move.id)) {
		defenseStage = battle.wonderRoomTurns > 0 ? defenderSlot.statStages.spd : defenderSlot.statStages.def;
	}

	const defenderAbility = toID(defender.ability || '');
	const attackerAbility = toID(attacker.ability || '');

	// Attacker's Unaware: Ignores defender's positive defensive stat stages
	// (But Mold Breaker bypasses this)
	if (attackerAbility === 'unaware' && !RPGAbilities.isAbilityIgnored(attacker, defender, attackerAbility)) {
		if (defenseStage > 0) {
			defenseStage = 0;
		}
	}

	// Defender's Unaware: Ignores attacker's positive offensive stat stages
	// (But Mold Breaker bypasses this)
	if (defenderAbility === 'unaware' && !RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
		if (attackStage > 0) {
			attackStage = 0;
		}
	}

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	let defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerSlot.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && attackerAbility !== 'guts') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		defenseStat = Math.floor(defenseStat * 0.5);
	}

	// Safety check: Ensure defenseStat is always at least 1 to prevent division issues
	defenseStat = Math.max(1, defenseStat);
	finalAttackStat = Math.max(1, finalAttackStat);

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, defenderSlot, move, battle);
	const criticalMultiplier = isCritical ? (attackerAbility === 'sniper' ? 2.25 : 1.5) : 1;
	const stabMultiplier = RPGAbilities.getSTABMultiplier(attacker, moveType, attackerSlot);
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	const defenderTypes = getPokemonTypes(defender, defenderSlot);

	let effectiveness: number;
	if (moveId === 'struggle') {
		// Struggle is typeless and always hits neutrally
		effectiveness = 1;
	} else {
		// All other moves calculate effectiveness normally
		effectiveness = getCustomEffectiveness(moveType, defenderTypes, defender, battle, attacker);
	}

	abilityContext.effectiveness = effectiveness;

	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;
	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	const baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / defenseStat)) / 50) + 2);

	let damage = applyFinalDamageModifiers(
		baseDamage, move, moveType, attacker, defender,
		attackerSlot, defenderSlot, battle, effectiveness, isCritical, abilityContext
	);

	damage = Math.floor(damage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);
	damage = Math.floor(damage * spreadMultiplier);

	// Safety check: Handle any invalid damage values (Infinity, NaN, or negative)
	if (!isFinite(damage) || isNaN(damage) || damage < 0) {
		damage = 1;
	}
	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed, isCritical };
}

export function applyDamageAndEnduranceEffects(
	defenderSlot: ActivePokemonSlot,
	damageDealt: number,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext // Added for Infiltrator
): number {
	const defender = defenderSlot.pokemon;
	const defenderAbility = toID(defender.ability || '');
	const attackerAbility = toID(abilityContext.attacker.ability || ''); // Get attacker's ability

	if (defenderSlot.isDisguised && damageDealt > 0 && move.category !== 'Status') {
		defenderSlot.isDisguised = false;
		if (defender.species === 'Mimikyu') {
			defender.species = 'Mimikyu-Busted';
		}
		messageLog.push(`<strong>${defender.species}'s Disguise was broken!</strong>`);
		// Mimikyu no longer takes damage from its disguise breaking (Gen 8+)
		defenderSlot.lastMoveThatHitMe = move;
		return 0;
	}

	if (defenderSlot.substitute && damageDealt > 0 && !move.flags.bypasssub && attackerAbility !== 'infiltrator') {
		const subHP = defenderSlot.substitute.hp;
		if (damageDealt >= subHP) {
			defenderSlot.substitute = undefined;
			messageLog.push(`The substitute took the hit and broke!`);
		} else {
			defenderSlot.substitute.hp -= damageDealt;
			messageLog.push(`The substitute took the hit!`);
		}
		defenderSlot.lastMoveThatHitMe = move;
		return 0;
	}

	const isFullHP = defender.hp === defender.maxHp;

	if (damageDealt >= defender.hp) {
		if (battle.magicRoomTurns === 0 && defender.item === 'focussash' && isFullHP) {
			damageDealt = defender.hp - 1;
			messageLog.push(`${defender.species} held on using its Focus Sash!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		} else if (defenderAbility === 'sturdy' && isFullHP && move.ohko !== true) {
			if (!RPGAbilities.isAbilityIgnored(abilityContext.attacker, defender, defenderAbility)) {
				damageDealt = defender.hp - 1;
				messageLog.push(`${defender.species} held on using its Sturdy!`);
			}
		}
	}

	defender.hp = Math.max(0, defender.hp - damageDealt);

	if (damageDealt > 0) {
		defenderSlot.lastMoveThatHitMe = move;
	}

	return damageDealt;
}

export function applyPostDamageContactEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	effectiveness: number,
	abilityContext: AbilityContext,
	isCritical: boolean
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;

	if (defender.hp <= 0 || damageDealt <= 0) return;

	const defenderAbility = toID(defender.ability || ''); // Get defender ability ID once
	if (isCritical && defenderAbility === 'angerpoint') {
		if (!RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
			applyStatChange(defenderSlot, 'atk', 6, battle, messageLog, defenderSlot);
		}
	}

	if (battle.magicRoomTurns === 0) {
		if (move.category === 'Physical' && defender.item === 'keberry') {
			if (applyStatChange(defenderSlot, 'def', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Kee Berry)!`;
				consumeBerry(defenderSlot, 'keberry', messageLog);
			}
		} else if (move.category === 'Special' && defender.item === 'marangaberry') {
			if (applyStatChange(defenderSlot, 'spd', 1, battle, messageLog, defenderSlot)) {
				messageLog[messageLog.length - 1] += ` (from Maranga Berry)!`;
				consumeBerry(defenderSlot, 'marangaberry', messageLog);
			}
		}
	}

	// Long Reach prevents contact effects
	const attackerAbility = toID(attacker.ability || '');
	const isContact = move.flags.contact && attackerAbility !== 'longreach';

	if (isContact && attacker.hp > 0) {
		if (battle.magicRoomTurns === 0) {
			if (defender.item === 'rockyhelmet' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 6));
				messageLog.push(`${attacker.species} was hurt by the Rocky Helmet!`);
			}
			if (defender.item === 'jabocaberry' && RPGAbilities.takesIndirectDamage(attacker)) {
				attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
				messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Jaboca Berry!`);
				consumeBerry(defenderSlot, 'jabocaberry', messageLog);
			}
		}
		if (attacker.hp > 0) {
			RPGAbilities.applyContactAbilityEffects(abilityContext);
		}
	}

	if (move.category === 'Special' && attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'rowapberry') {
		if (RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 8));
			messageLog.push(`${attacker.species} was hurt by the ${defender.species}'s Rowap Berry!`);
			consumeBerry(defenderSlot, 'rowapberry', messageLog);
		}
	}

	if (defenderAbility === 'cursedbody' && attacker.hp > 0 && !attackerSlot.disabledMove && Math.random() < 0.3) {
		if (!RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
			attackerSlot.disabledMove = { moveId: move.id, turns: 4 };
			messageLog.push(`${attacker.species}'s ${move.name} was disabled by ${defender.species}'s Cursed Body!`);
		}
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'weaknesspolicy' && effectiveness > 1) {
		let activated = false;
		if (applyStatChange(defenderSlot, 'atk', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}
		if (applyStatChange(defenderSlot, 'spa', 2, battle, messageLog, defenderSlot)) {
			activated = true;
		}

		if (activated) {
			messageLog.push(`${defender.species}'s Weakness Policy was activated!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}
	}

	if (attacker.hp > 0 && battle.magicRoomTurns === 0 && defender.item === 'redcard') {
		const isPlayerDefending = battle.playerSlots.includes(defenderSlot);
		const attackerSlotIndex = (isPlayerDefending ? battle.opponentSlots : battle.playerSlots).indexOf(attackerSlot);

		if (attackerSlotIndex !== -1) {
			messageLog.push(`${defender.species}'s Red Card forced ${attacker.species} to switch out!`);
			defender.item = undefined;
			activateUnburden(defenderSlot, messageLog);

			if (isPlayerDefending) {
				battle.opponentSlots[attackerSlotIndex as 0 | 1] = null;
			} else {
				battle.playerSlots[attackerSlotIndex as 0 | 1] = null;
			}
		}
	}
}

// Phase 2: Handle abilities that trigger when a Pokemon is hit
export function handleOnHitAbilityResponses(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	isCritical: boolean
) {
	const defender = defenderSlot.pokemon;
	const defenderAbility = toID(defender.ability || '');
	const attacker = attackerSlot.pokemon;

	// Justified - Boosts Attack when hit by Dark move
	if (defenderAbility === 'justified' && move.type === 'Dark' && damageDealt > 0) {
		if (defenderSlot.statStages.atk < 6) {
			defenderSlot.statStages.atk++;
			messageLog.push(`${defender.species}'s Justified raised its Attack!`);
		}
	}

	// Rattled - Boosts Speed when hit by Bug/Dark/Ghost move
	if (defenderAbility === 'rattled' && ['Bug', 'Dark', 'Ghost'].includes(move.type) && damageDealt > 0) {
		if (defenderSlot.statStages.spe < 6) {
			defenderSlot.statStages.spe++;
			messageLog.push(`${defender.species}'s Rattled raised its Speed!`);
		}
	}

	// Stamina - Boosts Defense when hit
	if (defenderAbility === 'stamina' && damageDealt > 0) {
		if (defenderSlot.statStages.def < 6) {
			defenderSlot.statStages.def++;
			messageLog.push(`${defender.species}'s Stamina raised its Defense!`);
		}
	}

	// Weak Armor - Defense down, Speed up when hit by physical move
	if (defenderAbility === 'weakarmor' && move.category === 'Physical' && damageDealt > 0) {
		let changed = false;
		if (defenderSlot.statStages.def > -6) {
			defenderSlot.statStages.def--;
			messageLog.push(`${defender.species}'s Weak Armor lowered its Defense!`);
			changed = true;
		}
		if (defenderSlot.statStages.spe < 6) {
			defenderSlot.statStages.spe = Math.min(6, defenderSlot.statStages.spe + 2);
			messageLog.push(`${defender.species}'s Weak Armor sharply raised its Speed!`);
			changed = true;
		}
	}

	// Anger Point - Maxes Attack on critical hit received
	if (defenderAbility === 'angerpoint' && isCritical && damageDealt > 0) {
		if (defenderSlot.statStages.atk < 6) {
			defenderSlot.statStages.atk = 6;
			messageLog.push(`${defender.species}'s Anger Point maxed its Attack!`);
		}
	}

	// Berserk - Boosts Sp. Atk when HP drops below 50%
	if (defenderAbility === 'berserk' && damageDealt > 0) {
		const hpBefore = defender.hp + damageDealt;
		const halfHP = defender.maxHp / 2;
		// Trigger if HP dropped below 50% from this hit
		if (hpBefore >= halfHP && defender.hp < halfHP) {
			if (defenderSlot.statStages.spa < 6) {
				defenderSlot.statStages.spa++;
				messageLog.push(`${defender.species}'s Berserk raised its Sp. Atk!`);
			}
		}
	}

	// Thermal Exchange - Boosts Attack when hit by Fire move
	if (defenderAbility === 'thermalexchange' && move.type === 'Fire' && damageDealt > 0) {
		if (!RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
			if (defenderSlot.statStages.atk < 6) {
				defenderSlot.statStages.atk++;
				messageLog.push(`${defender.species}'s Thermal Exchange raised its Attack!`);
			}
		}
	}

	// Cotton Down - Lowers Speed of all opponents when hit by an attack
	if (defenderAbility === 'cottondown' && damageDealt > 0 && move.category !== 'Status') {
		if (!RPGAbilities.isAbilityIgnored(attacker, defender, defenderAbility)) {
			const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
			const opponentSlots = isDefenderPlayer ? battle.opponentSlots : battle.playerSlots;

			let affectedAny = false;
			for (const oppSlot of opponentSlots) {
				if (oppSlot && oppSlot.pokemon.hp > 0) {
					if (applyStatChange(oppSlot, 'spe', -1, battle, messageLog, defenderSlot)) {
						affectedAny = true;
					}
				}
			}
			if (affectedAny) {
				messageLog.push(`${defender.species}'s Cotton Down lowered the Speed of opposing Pokémon!`);
			}
		}
	}

	// Phase 3: Anger Shell - When HP drops below 50%, lowers Def and Sp. Def, raises Atk, Sp. Atk, and Speed
	if (defenderAbility === 'angershell' && damageDealt > 0) {
		const hpBefore = defender.hp + damageDealt;
		const halfHP = defender.maxHp / 2;
		// Trigger if HP dropped below 50% from this hit
		if (hpBefore >= halfHP && defender.hp < halfHP) {
			const messages: string[] = [];
			if (defenderSlot.statStages.def > -6) {
				defenderSlot.statStages.def--;
				messages.push('Defense fell');
			}
			if (defenderSlot.statStages.spd > -6) {
				defenderSlot.statStages.spd--;
				messages.push('Sp. Def fell');
			}
			if (defenderSlot.statStages.atk < 6) {
				defenderSlot.statStages.atk++;
				messages.push('Attack rose');
			}
			if (defenderSlot.statStages.spa < 6) {
				defenderSlot.statStages.spa++;
				messages.push('Sp. Atk rose');
			}
			if (defenderSlot.statStages.spe < 6) {
				defenderSlot.statStages.spe++;
				messages.push('Speed rose');
			}
			if (messages.length > 0) {
				messageLog.push(`${defender.species}'s Anger Shell: ${messages.join(', ')}!`);
			}
		}
	}

	// Phase 4: Seed Sower - Creates Grassy Terrain when hit
	if (defenderAbility === 'seedsower' && damageDealt > 0 && battle.terrain?.type !== 'grassy') {
		battle.terrain = { type: 'grassy', turns: 5 };
		messageLog.push(`${defender.species}'s Seed Sower created Grassy Terrain!`);
	}

	// Phase 4: Sand Spit - Creates sandstorm when hit
	if (defenderAbility === 'sandspit' && damageDealt > 0 && battle.weather?.type !== 'sand') {
		battle.weather = { type: 'sand', turns: 5 };
		messageLog.push(`${defender.species}'s Sand Spit created a sandstorm!`);
	}

	// Phase 1: Steam Engine - Raises Speed by 6 stages when hit by Fire or Water move
	if (defenderAbility === 'steamengine' && ['Fire', 'Water'].includes(move.type) && damageDealt > 0) {
		const stages = Math.min(6, 6 - defenderSlot.statStages.spe);
		if (stages > 0) {
			defenderSlot.statStages.spe = Math.min(6, defenderSlot.statStages.spe + stages);
			const message = stages >= 2 ? 'sharply raised' : 'raised';
			messageLog.push(`${defender.species}'s Steam Engine ${message} its Speed!`);
		}
	}

	// Phase 2: Toxic Debris - Scatters Toxic Spikes when hit by physical move
	if (defenderAbility === 'toxicdebris' && move.category === 'Physical' && damageDealt > 0) {
		const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
		const opponentHazards = isDefenderPlayer ? battle.opponentHazards : battle.playerHazards;

		// Can only set up to 2 layers of Toxic Spikes
		const toxicSpikesCount = opponentHazards.filter(h => h === 'toxicspikes').length;
		if (toxicSpikesCount < 2) {
			opponentHazards.push('toxicspikes');
			messageLog.push(`${defender.species}'s Toxic Debris scattered Toxic Spikes!`);
		}
	}

	// Phase 6: Gulp Missile - Cramorant spits out catch when hit
	if (defenderAbility === 'gulpmissile' && damageDealt > 0 && attacker.hp > 0) {
		const gulpForm = (defenderSlot as any).gulpMissileForm;

		if (gulpForm === 'gulping') {
			// Arrokuda form - deals 1/4 max HP damage and lowers Defense
			const damageAmount = Math.floor(attacker.maxHp / 4);
			attacker.hp = Math.max(0, attacker.hp - damageAmount);
			messageLog.push(`${defender.species} spit out its catch at ${attacker.species}!`);

			if (attacker.hp > 0 && attackerSlot.statStages.def > -6) {
				attackerSlot.statStages.def--;
				messageLog.push(`${attacker.species}'s Defense fell!`);
			}

			// Revert form
			if (defender.species.includes('Gulping')) {
				defender.species = 'Cramorant';
			}
			(defenderSlot as any).gulpMissileForm = null;
		} else if (gulpForm === 'gorging') {
			// Pikachu form - deals 1/4 max HP damage and causes paralysis
			const damageAmount = Math.floor(attacker.maxHp / 4);
			attacker.hp = Math.max(0, attacker.hp - damageAmount);
			messageLog.push(`${defender.species} spit out its catch at ${attacker.species}!`);

			if (attacker.hp > 0 && !attackerSlot.status) {
				const attackerSpecies = Dex.species.get(attacker.species);
				if (!attackerSpecies.types.includes('Electric')) {
					attackerSlot.status = 'par';
					messageLog.push(`${attacker.species} was paralyzed!`);
				}
			}

			// Revert form
			if (defender.species.includes('Gorging')) {
				defender.species = 'Cramorant';
			}
			(defenderSlot as any).gulpMissileForm = null;
		}
	}
}

export function applyRecoilAndSelfEffects(
	attackerSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	damageDealt: number,
	moveWasSuccessful: boolean
) {
	if (attackerSlot.pokemon.hp <= 0) return;
	const attacker = attackerSlot.pokemon;

	let tookRecoil = false;

	if (['mindblown', 'steelbeam'].includes(move.id)) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 2));
			messageLog.push(`${attacker.species} was damaged by the move's recoil!`);
			tookRecoil = true;
		} else {
			messageLog.push(`${attacker.species}'s ${attacker.ability} prevents recoil!`);
		}
	} else if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		const attackerAbility = toID(attacker.ability || '');
		const sheerForceActive = attackerAbility === 'sheerforce' && (move.secondary || move.secondaries);
		if (!sheerForceActive && RPGAbilities.takesIndirectDamage(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.floor(attacker.maxHp / 10));
			messageLog.push(`${attacker.species} was hurt by its Life Orb!`);
			tookRecoil = true;
		}
	} else if (move.id === 'struggle') {
		attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(attacker.maxHp / 4)));
		messageLog.push(`${attacker.species} was damaged by recoil!`);
		tookRecoil = true;
	} else if (move.recoil) {
		if (!RPGAbilities.preventsRecoil(attacker)) {
			attacker.hp = Math.max(0, attacker.hp - Math.max(1, Math.floor(damageDealt * (move.recoil[0] / move.recoil[1]))));
			messageLog.push(`${attacker.species} was damaged by recoil!`);
			tookRecoil = true;
		}
	}

	if (tookRecoil) {
		handleHPDropEffects(attackerSlot, battle, messageLog);
	}

	if (attacker.hp > 0 && move.self?.boosts) {
		const boosts = move.self.boosts;
		for (const stat in boosts) {
			const statKey = stat as keyof ActivePokemonSlot['statStages'];
			const boostValue = boosts[statKey]!;
			// Use the central applyStatChange function to handle all abilities (Clear Body, Simple, Contrary)
			applyStatChange(attackerSlot, statKey, boostValue, battle, messageLog, attackerSlot);
		}
	}

	if (moveWasSuccessful && ['selfdestruct', 'explosion', 'mistyexplosion', 'finalgambit'].includes(move.id)) {
		attacker.hp = 0;
		messageLog.push(`**${attacker.species} fainted from using ${move.name}!**`);
	}
}

export function applySecondaryEffects(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	abilityContext: AbilityContext
) {
	if (defenderSlot.pokemon.hp <= 0) return;
	if (defenderSlot.substitute) {
		return;
	}
	// Shield Dust blocks secondary effects
	const defenderAbility = toID(defenderSlot.pokemon.ability || '');
	if (defenderAbility === 'shielddust' && !RPGAbilities.isAbilityIgnored(attackerSlot.pokemon, defenderSlot.pokemon, defenderAbility)) {
		return;
	}
	if (!move.secondary || !RPGAbilities.shouldApplySecondaryEffects(attackerSlot.pokemon, move)) return;

	let chance = move.secondary.chance || 100;
	chance = RPGAbilities.applySereneGrace(abilityContext, chance);

	if (Math.random() * 100 < chance) {
		if (move.secondary.status && !defenderSlot.status) {
			const defender = defenderSlot.pokemon;
			const defenderSpecies = Dex.species.get(defender.species);
			let canInflict = true;

			if ((move.secondary.status === 'par' && defenderSpecies.types.includes('Electric')) ||
				(move.secondary.status === 'brn' && defenderSpecies.types.includes('Fire')) ||
				(move.secondary.status === 'psn' && (defenderSpecies.types.includes('Poison') || defenderSpecies.types.includes('Steel')))) {
				canInflict = false;
			}
			if (canInflict && RPGAbilities.preventsStatus(defender, move.secondary.status, battle, attackerSlot.pokemon)) {
				canInflict = false;
				messageLog.push(`${defender.species}'s ${defender.ability} prevents ${move.secondary.status}!`);
			}
			if (canInflict && battle.terrain?.type === 'misty' && RPGAbilities.isGrounded(defender, battle)) {
				canInflict = false;
				messageLog.push('The Misty Terrain prevents status conditions!');
			}

			if (canInflict) {
				const newStatus = move.secondary.status as Status;
				defenderSlot.status = newStatus;
				if (newStatus === 'tox') {
					defenderSlot.toxicCounter = 1;
				}
				if (newStatus === 'slp') {
					defenderSlot.sleepCounter = Math.floor(Math.random() * 3) + 2;
				}
				messageLog.push(`${defender.species} was ${newStatus === 'par' ? 'paralyzed' : newStatus === 'brn' ? 'burned' : newStatus === 'psn' ? 'poisoned' : newStatus}!`);

				// Phase 2: Poison Puppeteer - Poisoned foes also become confused
				const attackerAbilityId = toID(attackerSlot.pokemon.ability || '');
				if (attackerAbilityId === 'poisonpuppeteer' && (newStatus === 'psn' || newStatus === 'tox')) {
					if (!defenderSlot.isConfused) {
						defenderSlot.isConfused = true;
						defenderSlot.confusionCounter = Math.floor(Math.random() * 4) + 1; // 1-4 turns
						messageLog.push(`${defender.species} became confused from Poison Puppeteer!`);
					}
				}

				const defenderAbility = toID(defender.ability || '');
				if (defenderAbility === 'synchronize') {
					applySynchronize(newStatus, defenderSlot, attackerSlot, battle, messageLog);
				}
			}
		}

		if (move.secondary.boosts) {
			let hadEffect = false;
			let triggeredDefiant = false;

			for (const stat in move.secondary.boosts) {
				let boostValue = move.secondary.boosts[stat as keyof typeof move.secondary.boosts]!;

				if (toID(defenderSlot.pokemon.ability || '') === 'contrary') {
					boostValue *= -1;
				}

				const currentStage = defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages];

				if (boostValue < 0) {
					if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.item === 'clearamulet') {
						messageLog.push(`${defenderSlot.pokemon.species}'s Clear Amulet prevents its stats from being lowered!`);
						continue;
					}
					const targetAbility = toID(defenderSlot.pokemon.ability || '');
					const blockAbilities = ['clearbody', 'whitesmoke', 'fullmetalbody'];
					if (blockAbilities.includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its stats from being lowered!`);
						continue;
					}
					if (stat === 'atk' && ['hypercutter', 'flowerveil'].includes(targetAbility)) {
						messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} prevents its Attack from being lowered!`);
						continue;
					}

					if (currentStage > -6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue < -1 ? 'sharply ' : ''}fell!`);
						hadEffect = true;
						triggeredDefiant = true;
					}
				} else if (boostValue > 0) {
					if (currentStage < 6) {
						const newStage = Math.max(-6, Math.min(6, currentStage + boostValue));
						defenderSlot.statStages[stat as keyof typeof defenderSlot.statStages] = newStage as any;
						messageLog.push(`${defenderSlot.pokemon.species}'s ${stat.toUpperCase()} ${boostValue > 1 ? 'sharply ' : ''}rose!`);
						hadEffect = true;
					}
				}
			}

			if (triggeredDefiant) {
				checkStatDropAbilities(defenderSlot, attackerSlot, battle, messageLog);
			}
		}

		if (move.secondary.volatileStatus === 'flinch') {
			if (!RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
				defenderSlot.willFlinch = true;
			} else {
				messageLog.push(`${defenderSlot.pokemon.species}'s Inner Focus prevents flinching!`);
			}
		}
	}

	// Phase 1: Stench - 10% chance to flinch when dealing damage
	const attackerAbility = toID(attackerSlot.pokemon.ability || '');
	if (attackerAbility === 'stench' && move.category !== 'Status' && defenderSlot.pokemon.hp > 0) {
		if (Math.random() < 0.1 && !RPGAbilities.preventsFlinch(defenderSlot.pokemon)) {
			defenderSlot.willFlinch = true;
		}
	}
}

export function handleDamagingMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	move: Move,
	battle: BattleState,
	messageLog: string[],
	spreadMultiplier: number
) {
	if (RPGMoves.handleDamagingMovePreamble(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	const attacker = attackerSlot.pokemon;
	let moveWasSuccessful = false;
	const hitCount = RPGAbilities.getMultiHitCount(attacker, move);
	const hasParentalBond = RPGAbilities.hasParentalBond(attacker);
	const totalHits = hasParentalBond && hitCount === 1 ? 2 : hitCount;

	if (totalHits > 1) {
		const hitMessage = hasParentalBond ?
			` <i style="color: #6c757d;">(Parental Bond hit twice!)</i>` :
			` <i style="color: #6c757d;">(It hit ${totalHits} times!)</i>`;
		if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += hitMessage;
		} else {
			messageLog.push(hitMessage);
		}
	}

	for (let i = 0; i < totalHits; i++) {
		let parentalBondSpreadMultiplier = spreadMultiplier;
		if (hasParentalBond && i === 1) {
			parentalBondSpreadMultiplier *= 0.25;
		}

		const attackResult = calculateDamage(attackerSlot, defenderSlot, move.id, battle, parentalBondSpreadMultiplier);
		if (attackResult.effectiveness > 0) {
			moveWasSuccessful = true;
		}
		// Allow Spit Up to run its logic even if it fails
		if (move.id === 'spitup') {
			moveWasSuccessful = true;
		}

		if (attackResult.berryConsumed) {
			const itemName = ITEMS_DATABASE[attackResult.berryConsumed]?.name;
			if (TYPE_RESIST_BERRIES[attackResult.berryConsumed]) {
				messageLog.push(`${defenderSlot.pokemon.species}'s ${itemName} weakened the attack!`);
			}
			consumeBerry(defenderSlot, attackResult.berryConsumed, messageLog);
		}

		// We need the ability context here for Infiltrator
		const abilityContext = { attacker, defender: defenderSlot.pokemon, attackerSlot, defenderSlot, move, battle, messageLog };
		const damageDealt = applyDamageAndEnduranceEffects(defenderSlot, attackResult.damage, move, battle, messageLog, abilityContext);

		if (damageDealt > 0 && move.category !== 'Status') {
			defenderSlot.lastDamageTaken = {
				amount: damageDealt,
				category: move.category,
				from: attacker.id,
			};
		}

		if (totalHits > 1) {
			messageLog.push(`Dealt ${damageDealt} damage!` + attackResult.message);
		} else if (messageLog.length > 0) {
			messageLog[messageLog.length - 1] += ` <i style="color: #007bff;">(${damageDealt} damage)</i>` + attackResult.message;
		} else {
			messageLog.push(`<i style="color: #007bff;">(${damageDealt} damage)</i>` + attackResult.message);
		}

		if (battle.magicRoomTurns === 0 && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item === 'airballoon' &&
			damageDealt > 0 && move.category !== 'Status') {
			messageLog.push(`${defenderSlot.pokemon.species}'s Air Balloon popped!`);
			defenderSlot.pokemon.item = undefined;
			activateUnburden(defenderSlot, messageLog);
		}

		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			if (move.drain && attacker.hp < attacker.maxHp) {
				// Phase 2: Liquid Ooze - damages attacker instead of healing them
				const defenderAbility = toID(defenderSlot.pokemon.ability || '');
				if (defenderAbility === 'liquidooze' && !RPGAbilities.isAbilityIgnored(attacker, defenderSlot.pokemon, defenderAbility)) {
					const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
					if (RPGAbilities.takesIndirectDamage(attacker)) {
						attacker.hp = Math.max(0, attacker.hp - drainAmount);
						messageLog.push(`${attacker.species} was hurt by ${defenderSlot.pokemon.species}'s Liquid Ooze!`);
					}
				} else if (attackerSlot.healBlockTurns > 0) {
					messageLog.push(`${attacker.species} can't restore HP due to Heal Block!`);
				} else {
					const drainAmount = Math.max(1, Math.floor(damageDealt * (move.drain[0] / move.drain[1])));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmount);
					messageLog.push(`${defenderSlot.pokemon.species} had its energy drained!`);
				}
			}
			if (battle.magicRoomTurns === 0 && attacker.item === 'shellbell' && attacker.hp < attacker.maxHp) {
				if (attackerSlot.healBlockTurns <= 0) {
					const healAmount = Math.max(1, Math.floor(damageDealt / 8));
					attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
					messageLog.push(`${attacker.species} restored some HP using its Shell Bell!`);
				}
			}

			applyPostDamageContactEffects(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.effectiveness, abilityContext, attackResult.isCritical);

			// Phase 2: Handle on-hit ability responses
			handleOnHitAbilityResponses(attackerSlot, defenderSlot, move, battle, messageLog, damageDealt, attackResult.isCritical);

			handleHPDropEffects(defenderSlot, battle, messageLog);
		}

		// Moved all post-hit effects that don't depend on effectiveness > 0
		// This ensures they run even on 0 damage hits (like a failed Spit Up)
		applyRecoilAndSelfEffects(attackerSlot, move, battle, messageLog, damageDealt, moveWasSuccessful);

		// Handle Knock Off item removal
		if (move.id === 'knockoff' && defenderSlot.pokemon.hp > 0 && defenderSlot.pokemon.item && moveWasSuccessful) {
			const defender = defenderSlot.pokemon;
			if (defenderSlot.substitute) {
				// Substitute blocks item removal
				messageLog.push(`But ${defender.species}'s Substitute blocked the item removal!`);
			} else if (RPGAbilities.checkItemRemovalPrevention(defender)) {
				// Abilities like Sticky Hold block item removal
				messageLog.push(`${defender.species}'s ${defender.ability} prevents its item from being removed!`);
			} else {
				// Remove the item
				const itemName = ITEMS_DATABASE[defender.item]?.name || defender.item;
				messageLog.push(`${attacker.species} knocked off ${defender.species}'s ${itemName}!`);
				defender.item = undefined;

				// Activate Unburden if the defender had it
				activateUnburden(defenderSlot, messageLog);
			}
		}

		// Handle Rapid Spin effects (clearing hazards and raising speed)
		if (move.id === 'rapidspin' && attackerSlot.pokemon.hp > 0 && moveWasSuccessful) {
			const playerIsUser = battle.playerSlots.some(s => s?.pokemon.id === attacker.id);
			const userHazards = playerIsUser ? battle.playerHazards : battle.opponentHazards;
			if (userHazards.length > 0) {
				userHazards.length = 0; // Clear the array
				messageLog.push(`${attacker.species} blew away the hazards!`);
			}
			// Also remove Leech Seed
			if (attackerSlot.isSeeded) {
				attackerSlot.isSeeded = false;
				messageLog.push(`${attacker.species} shook off the Leech Seed!`);
			}
			// Raise Speed
			// applyStatChange already adds its own message
			applyStatChange(attackerSlot, 'spe', 1, battle, messageLog, attackerSlot);
		}

		// Handle Clear Smog stat reset effect
		if (move.id === 'clearsmog' && defenderSlot.pokemon.hp > 0 && moveWasSuccessful) {
			// This effect bypasses abilities like Clear Body and Substitute in official games
			defenderSlot.statStages = { ...INITIAL_STAT_STAGES };
			messageLog.push(`${defenderSlot.pokemon.species}'s stat changes were reset!`);
		}

		applySecondaryEffects(attackerSlot, defenderSlot, move, battle, messageLog, abilityContext);

		// Special trap moves (Anchor Shot, Spirit Shackle, Jaw Lock, Thousand Waves)
		if (attackResult.effectiveness > 0 && damageDealt > 0) {
			const defenderSpecies = Dex.species.get(defenderSlot.pokemon.species);
			const isGhost = defenderSpecies.types.includes('Ghost');

			// Special trap moves (Anchor Shot, Spirit Shackle, Thousand Waves)
			if (['anchorshot', 'spiritshackle', 'thousandwaves'].includes(move.id) && defenderSlot?.pokemon.hp > 0) {
				// Spirit Shackle can trap Ghosts, other moves cannot
				if (!defenderSlot.isTrapped && (move.id === 'spiritshackle' || !isGhost)) {
					defenderSlot.isTrapped = { turns: 5 };
					messageLog.push(`${defenderSlot.pokemon.species} can no longer escape!`);
				}
			}
			if (move.id === 'jawlock' && defenderSlot?.pokemon.hp > 0 && attackerSlot?.pokemon.hp > 0) {
				// Jaw Lock cannot trap Ghost-types
				if (!defenderSlot.isTrapped && !isGhost) {
					defenderSlot.isTrapped = { turns: 5 };
					messageLog.push(`${defenderSlot.pokemon.species} can no longer escape!`);
				}
				if (!attackerSlot.isTrapped) {
					attackerSlot.isTrapped = { turns: 5 };
					messageLog.push(`${attackerSlot.pokemon.species} can no longer escape!`);
				}
			}

			// Force switch moves (Dragon Tail, Circle Throw)
			if (['dragontail', 'circlethrow'].includes(move.id) && defenderSlot?.pokemon.hp > 0) {
				const defenderAbility = toID(defenderSlot.pokemon.ability || '');
				// Suction Cups and similar abilities prevent forced switches
				if (defenderAbility === 'suctioncups') {
					messageLog.push(`${defenderSlot.pokemon.species}'s ${defenderSlot.pokemon.ability} anchors it in place!`);
				} else if (defenderSlot.isIngrained) {
					messageLog.push(`${defenderSlot.pokemon.species} is rooted in place!`);
				} else {
					const isDefenderPlayer = battle.playerSlots.includes(defenderSlot);
					const defenderSlotIndex = (isDefenderPlayer ? battle.playerSlots : battle.opponentSlots).indexOf(defenderSlot);
					const party = isDefenderPlayer ? getPlayerData(battle.playerId).party : battle.opponentParty;

					const availableReplacements = party.filter(p =>
						p.hp > 0 &&
						!battle.playerSlots.some(s => s?.pokemon.id === p.id) &&
						!battle.opponentSlots.some(s => s?.pokemon.id === p.id)
					);

					if (availableReplacements.length === 0) {
						messageLog.push(`But it failed! (No Pokémon to switch to!)`);
					} else {
						messageLog.push(`${defenderSlot.pokemon.species} was blown away!`);
						if (defenderSlotIndex !== -1) {
							// Set the slot to null to trigger forced switch logic in battle-flow
							if (isDefenderPlayer) {
								battle.playerSlots[defenderSlotIndex as 0 | 1] = null;
							} else {
								battle.opponentSlots[defenderSlotIndex as 0 | 1] = null;
							}
						}
					}
				}
			}
		}

		if (defenderSlot.pokemon.hp <= 0) break;
	}
}

export function handleStatusMove(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot | null,
	move: Move,
	battle: BattleState,
	messageLog: string[]
) {
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot?.pokemon;
	const defenderSpecies = defender ? Dex.species.get(defender.species) : null;

	const attackerAbility = toID(attacker.ability || '');
	if (attackerAbility === 'prankster' && defenderSpecies?.types.includes('Dark')) {
		messageLog.push(`${defender!.species} is immune to Prankster-boosted moves!`);
		return;
	}

	if (defender && defenderSpecies && move.target !== 'self' && !move.flags.heal) {
		const effectiveness = getCustomEffectiveness(move.type, defenderSpecies.types, defender, battle, attackerSlot.pokemon);
		if (effectiveness === 0) {
			messageLog.push(`It doesn't affect ${defender.species}...`);
			return;
		}
	}

	if (RPGMoves.handleSpecificStatusMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericBoostMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericStatusInflictMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericVolatileMove(attackerSlot, defenderSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericFieldMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericSideMove(attackerSlot, move, battle, messageLog)) {
		return;
	}

	if (RPGMoves.handleGenericHealMove(attackerSlot, move, messageLog)) {
		return;
	}

	if (move.selfSwitch) {
		return;
	}

	messageLog.push(`But it failed!`);
}
