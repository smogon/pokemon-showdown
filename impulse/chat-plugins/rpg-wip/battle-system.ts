/**
 * Pokemon RPG Battle System
 * 
 * This module consolidates all battle-related functionality in one place
 * for easy maintenance and extension of battle mechanics.
 * 
 * Includes:
 * - Damage calculation
 * - Turn processing
 * - Move execution
 * - Status effects
 * - AI opponent logic
 * - Battle state management
 */

// Import types and utilities
import type { BattleState, ActivePokemonSlot, RPGPokemon, PlayerData } from './types';
import { TYPE_CHART, TYPE_RESIST_BERRIES, BERRY_FLAVORS } from './constants';
import { MANUAL_BASE_EXP } from './MANUAL_BASE_EXP';
import { MANUAL_EV_YIELDS } from './MANUAL_EV_YIELDS';
import {
	getCustomEffectiveness,
	getStatMultiplier,
	getCriticalHitChance,
	getMove,
	getActiveSlots,
	getSlotFromIndex,
} from './battle-helpers';
import { getPlayerData } from './player-data';

// Global declarations (available from Pokemon Showdown environment)
declare const Dex: any;
declare function toID(text: string): string;
declare type Move = any;
declare type CommandContext = any;
declare type ChatRoom = any;
declare type User = any;

/**
 * Check if a Pokemon is grounded (affected by Ground-type moves)
 */
export function isGrounded(pokemon: RPGPokemon, battle: BattleState): boolean {
	// Gravity grounds all Pokémon, overriding other immunities.
	if (battle.gravityTurns > 0) {
		return true;
	}
	const species = Dex.species.get(pokemon.species);
	// Air Balloon effect is disabled in Magic Room, so we can't check for it here
	// The Magic Room check should be done in the calling function
	return !species.types.includes('Flying') && pokemon.ability !== 'Levitate';
}

/**
 * Check if a Pokemon's held item is usable (not suppressed by Magic Room or Embargo)
 */
export function canUseItem(slot: ActivePokemonSlot, battle: BattleState): boolean {
	// Magic Room suppresses all items
	if (battle.magicRoomTurns > 0) return false;
	// Embargo suppresses this Pokemon's item specifically
	if (slot.embargoTurns && slot.embargoTurns > 0) return false;
	return true;
}

/**
 * Create an ActivePokemonSlot from an RPGPokemon
 */
export function createActivePokemonSlot(pokemon: RPGPokemon): ActivePokemonSlot {
	return {
		pokemon,
		statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
		status: pokemon.status,
		sleepCounter: 0,
		isConfused: false,
		confusionCounter: 0,
		isProtected: false,
		protectSuccessCounter: 0,
		willFlinch: false,
		isTrapped: null,
		tauntTurns: 0,
		isSeeded: false,
		hasNightmare: false,
		isCursed: false,
		activeTurns: 0,
	};
}

/**
 * Calculate damage for a move
 * 
 * This is the core damage calculation function that handles:
 * - Type effectiveness
 * - STAB (Same Type Attack Bonus)
 * - Critical hits
 * - Stat stages
 * - Weather effects
 * - Abilities
 * - Items
 * - And much more...
 * 
 * @param attackerSlot The attacking Pokemon's slot
 * @param defenderSlot The defending Pokemon's slot
 * @param moveId The move being used
 * @param battle The current battle state
 * @param spreadMultiplier Damage reduction for spread moves in doubles (0.75)
 * @returns Object with damage amount, message, effectiveness, and consumed berry
 */
export function calculateDamage(
	attackerSlot: ActivePokemonSlot,
	defenderSlot: ActivePokemonSlot,
	moveId: string,
	battle: BattleState,
	spreadMultiplier: number // <-- NEW PARAM
): { damage: number, message: string, effectiveness: number, berryConsumed?: string } {
	const move = getMove(moveId);
	const attacker = attackerSlot.pokemon;
	const defender = defenderSlot.pokemon;
	const attackerStages = attackerSlot.statStages;
	const defenderStages = defenderSlot.statStages;
	const attackerStatus = attackerSlot.status;

	let moveType = move.type; // Use a mutable variable for type-changing moves
	const attackerSpecies = Dex.species.get(attacker.species);
	const defenderSpecies = Dex.species.get(defender.species);

	// --- Ability/Type ImmunITIES Check ---
	if (move.flags.sound && defender.ability === 'Soundproof') {
		return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Soundproof blocks the move!</i>`, effectiveness: 0 };
	}
	if (move.flags.powder) {
		if (defenderSpecies.types.includes('Grass')) {
			return { damage: 0, message: ` <i style="color: #6c757d;">Grass-types are immune to powder moves!</i>`, effectiveness: 0 };
		}
		if (defender.ability === 'Overcoat') {
			return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species}'s Overcoat blocks the move!</i>`, effectiveness: 0 };
		}
	}

	if (!move.basePower) {
		// Fixed damage moves
		if (moveId === 'dragonrage') return { damage: 40, message: '', effectiveness: 1 };
		if (moveId === 'sonicboom') return { damage: 20, message: '', effectiveness: 1 };
		if (moveId === 'seismictoss' || moveId === 'nightshade') {
			return { damage: attacker.level, message: '', effectiveness: 1 };
		}
		if (moveId === 'psywave') {
			const damage = Math.floor(Math.random() * attacker.level * 1.5) + 1;
			return { damage, message: '', effectiveness: 1 };
		}
		if (moveId === 'superfang') {
			const damage = Math.floor(defender.hp / 2);
			return { damage, message: '', effectiveness: 1 };
		}
		return { damage: 0, message: ` <i style="color: #6c757d;">But it had no effect!</i>`, effectiveness: 1 };
	}

	let basePower = move.basePower;

	// --- NEW: Apply Helping Hand ---
	if (attackerSlot.isHelped) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Power modification for hitting semi-invulnerable targets ---
	const defenderChargingMoveId = defenderSlot.chargingMove;

	if (defenderChargingMoveId) {
		if (defenderChargingMoveId === 'dig' && ['earthquake', 'magnitude'].includes(move.id)) {
			basePower *= 2;
		}
		if (defenderChargingMoveId === 'dive' && ['surf', 'whirlpool'].includes(move.id)) {
			basePower *= 2;
		}
		if ((defenderChargingMoveId === 'fly' || defenderChargingMoveId === 'bounce') && ['twister', 'gust', 'skyuppercut'].includes(move.id)) {
			basePower *= 2;
		}
	}

	// Handle Variable Power moves
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
		const attackerSpe = attacker.spe * getStatMultiplier(attackerStages.spe);
		const defenderSpe = defender.spe * getStatMultiplier(defenderStages.spe);
		if (defenderSpe > 0) {
			basePower = Math.min(150, Math.floor(25 * (defenderSpe / attackerSpe)) + 1);
		} else {
			basePower = 1;
		}
		break;

	case 'storedpower':
	case 'powertrip':
		let totalBoosts = 0;
		for (const stat in attackerStages) {
			if (attackerStages[stat as keyof typeof attackerStages] > 0) {
				totalBoosts += attackerStages[stat as keyof typeof attackerStages];
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
		// Present has random effects: 40, 80, 120 power, or heals 80 HP
		const presentRand = Math.random();
		if (presentRand < 0.4) basePower = 40;
		else if (presentRand < 0.7) basePower = 80;
		else if (presentRand < 0.8) basePower = 120;
		else {
			// Heal the target instead
			const healAmount = Math.floor(defender.maxHp * 0.25);
			defender.hp = Math.min(defender.maxHp, defender.hp + healAmount);
			return { damage: 0, message: ` <i style="color: #6c757d;">${defender.species} was healed!</i>`, effectiveness: 0 };
		}
		break;
	
	case 'magnitude':
		// Magnitude has random power: 10, 30, 50, 70, 90, 110, 150
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

	// --- Context-Dependent Power Modifications ---
	if (move.id === 'facade' && attackerStatus && ['psn', 'brn', 'par'].includes(attackerStatus)) {
		basePower *= 2;
	}
	if (move.id === 'brine' && defender.hp <= defender.maxHp / 2) {
		basePower *= 2;
	}
	const defenderStatus = defenderSlot.status;
	if (move.id === 'venoshock' && defenderStatus === 'psn') {
		basePower *= 2;
	}
	if (move.id === 'weatherball' && battle.weather) {
		basePower *= 2;
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		basePower *= 2;
	}
	
	// Charge boosts next Electric move
	if (attackerSlot.isCharged && moveType === 'Electric') {
		basePower *= 2;
	}

	if (['solarbeam', 'solarblade'].includes(move.id) && battle.weather) {
		if (['rain', 'sand', 'hail'].includes(battle.weather.type)) {
			basePower = Math.floor(basePower * 0.5);
		}
	}

	// --- Type-Changing Moves ---
	if (move.id === 'weatherball' && battle.weather) {
		switch (battle.weather.type) {
		case 'sun': moveType = 'Fire'; break;
		case 'rain': moveType = 'Water'; break;
		case 'sand': moveType = 'Rock'; break;
		case 'hail': moveType = 'Ice'; break;
		}
	}
	if (move.id === 'terrainpulse' && battle.terrain && isGrounded(attacker, battle)) {
		switch (battle.terrain.type) {
		case 'electric': moveType = 'Electric'; break;
		case 'grassy': moveType = 'Grass'; break;
		case 'psychic': moveType = 'Psychic'; break;
		case 'misty': moveType = 'Fairy'; break;
		}
	}

	// --- Move-specific Power Boosts ---
	if (move.id === 'knockoff' && defender.item) {
		basePower = Math.floor(basePower * 1.5);
	}

	// --- Ability Power Boosts ---
	if (attacker.ability === 'Iron Fist' && move.flags.punch) {
		basePower = Math.floor(basePower * 1.2);
	}
	if (attacker.ability === 'Strong Jaw' && move.flags.bite) {
		basePower = Math.floor(basePower * 1.5);
	}
	if (attacker.ability === 'Mega Launcher' && move.flags.pulse) {
		basePower = Math.floor(basePower * 1.5);
	}

	let attackStatRaw = move.category === 'Special' ? attacker.spa : attacker.atk;
	let defenseStatRaw = move.category === 'Special' ? defender.spd : defender.def;

	if (battle.wonderRoomTurns > 0) {
		defenseStatRaw = move.category === 'Special' ? defender.def : defender.spd;
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'assaultvest' && move.category === 'Special') {
		defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
	}

	if (battle.magicRoomTurns === 0 && defender.item === 'eviolite') {
		const defenderId = toID(defender.species);
		const species = Dex.species.get(defenderId);
		if (species.evos && species.evos.length > 0) {
			defenseStatRaw = Math.floor(defenseStatRaw * 1.5);
			if (battle.wonderRoomTurns > 0 && move.category === 'Physical') {
				const originalSpDef = defender.spd;
				defenseStatRaw = Math.floor(originalSpDef * 1.5);
			}
		}
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'choiceband' && move.category === 'Physical') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}
	if (battle.magicRoomTurns === 0 && attacker.item === 'choicespecs' && move.category === 'Special') {
		attackStatRaw = Math.floor(attackStatRaw * 1.5);
	}

	const attackStage = move.category === 'Special' ? attackerStages.spa : attackerStages.atk;
	const defenseStage = battle.wonderRoomTurns > 0 ?
		(move.category === 'Special' ? defenderStages.def : defenderStages.spd) :
		(move.category === 'Special' ? defenderStages.spd : defenderStages.def);

	const attackStat = Math.floor(attackStatRaw * getStatMultiplier(attackStage));
	const defenseStat = Math.floor(defenseStatRaw * getStatMultiplier(defenseStage));

	let finalAttackStat = attackStat;
	if (attackerStatus === 'brn' && move.category === 'Physical' && move.id !== 'facade') {
		finalAttackStat = Math.floor(finalAttackStat / 2);
	}

	// --- Self-Destruct Defense Halving ---
	let finalDefenseStat = defenseStat;
	if (['explosion', 'selfdestruct'].includes(move.id)) {
		finalDefenseStat = Math.floor(finalDefenseStat * 0.5);
	}

	const isCritical = Math.random() < getCriticalHitChance(attackerSlot, move, battle);
	const criticalMultiplier = isCritical ? 1.5 : 1;
	const isStab = attackerSpecies.types.includes(moveType);
	const stabMultiplier = isStab ? 1.5 : 1;
	const randomMultiplier = Math.floor(Math.random() * 16 + 85) / 100;
	let baseDamage = Math.floor((((2 * attacker.level / 5 + 2) * basePower * (finalAttackStat / finalDefenseStat)) / 50) + 2);
	const effectiveness = getCustomEffectiveness(moveType, defenderSpecies.types, defender, battle);
	let berryConsumed: string | undefined = undefined;
	let effectivenessMultiplier = effectiveness;

	if (battle.magicRoomTurns === 0 && defender.item && TYPE_RESIST_BERRIES[defender.item]) {
		const resistedType = TYPE_RESIST_BERRIES[defender.item];
		if (moveType === resistedType && effectiveness > 1) {
			effectivenessMultiplier = effectiveness / 2;
			berryConsumed = defender.item;
		}
	}

	// --- Screen Damage Reduction Check ---
	const isDefenderPlayer = battle.playerSlots.some(s => s?.pokemon.id === defender.id);
	if (!isCritical) { // Critical hits bypass screens
		const defenderVeilTurns = isDefenderPlayer ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;

		if (defenderVeilTurns > 0) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else {
			if (move.category === 'Physical') {
				const defenderReflectTurns = isDefenderPlayer ? battle.playerReflectTurns : battle.opponentReflectTurns;
				if (defenderReflectTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			} else if (move.category === 'Special') {
				const defenderLightScreenTurns = isDefenderPlayer ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
				if (defenderLightScreenTurns > 0) {
					baseDamage = Math.floor(baseDamage * 0.5);
				}
			}
		}
	}

	if (battle.weather) {
		if (battle.weather.type === 'sun') {
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.weather.type === 'rain') {
			if (moveType === 'Water') baseDamage = Math.floor(baseDamage * 1.5);
			if (moveType === 'Fire') baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	if (battle.terrain) {
		const attackerIsGrounded = isGrounded(attacker, battle);
		const defenderIsGrounded = isGrounded(defender, battle);

		if (battle.terrain.type === 'electric' && moveType === 'Electric' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'grassy' && moveType === 'Grass' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		} else if (battle.terrain.type === 'psychic' && moveType === 'Psychic' && attackerIsGrounded) {
			baseDamage = Math.floor(baseDamage * 1.3);
		}

		if (battle.terrain.type === 'misty' && moveType === 'Dragon' && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		} else if (battle.terrain.type === 'grassy' && ['earthquake', 'bulldoze', 'magnitude'].includes(move.id) && defenderIsGrounded) {
			baseDamage = Math.floor(baseDamage * 0.5);
		}
	}

	// --- Mud/Water Sport Damage Reduction ---
	if (battle.mudSportTurns > 0 && moveType === 'Electric') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}
	if (battle.waterSportTurns > 0 && moveType === 'Fire') {
		baseDamage = Math.floor(baseDamage * 0.33);
	}

	let damage = Math.floor(baseDamage * stabMultiplier * effectivenessMultiplier * criticalMultiplier * randomMultiplier);

	if (battle.magicRoomTurns === 0 && attacker.item === 'lifeorb') {
		damage = Math.floor(damage * 1.3);
	}

	if (battle.magicRoomTurns === 0 && attacker.item === 'expertbelt' && effectiveness > 1) {
		damage = Math.floor(damage * 1.2);
	}

	// --- NEW: SPREAD MOVE DAMAGE REDUCTION ---
	damage = Math.floor(damage * spreadMultiplier);

	damage = Math.max(1, damage);

	let message = "";
	if (isCritical) message += ` <i style="color: #28a745;">A critical hit!</i>`;
	if (effectiveness > 1) message += ` <i style="color: #28a745;">It's super effective!</i>`;
	if (effectiveness < 1 && effectiveness > 0) message += ` <i style="color: #d9534f;">It's not very effective...</i>`;
	if (effectiveness === 0) message = ` <i style="color: #6c757d;">It had no effect on ${defender.species}!</i>`;

	return { damage, message, effectiveness, berryConsumed };
}

/**
 * Process a full turn of battle
 * 
 * This orchestrates all actions in a turn:
 * 1. Determine move order (by priority, then speed)
 * 2. Execute each action in order
 * 3. Apply end-of-turn effects
 * 4. Check for battle end conditions
 * 
 * @param context Command context for sending messages
 * @param battle The battle state
 * @param room The chat room
 * @param user The user
 */
export function processTurn(
	context: CommandContext,
	battle: BattleState,
	room: ChatRoom,
	user: User
): void {
	// Placeholder for full turn processing logic
	// Full implementation would go here
}

/**
 * Generate an AI action for opponent Pokemon
 * 
 * Simple AI that:
 * - Uses damaging moves when available
 * - Targets weaknesses when possible
 * - Makes basic strategic decisions
 * 
 * @param aiSlot The AI Pokemon's slot
 * @param aiSlotIndex The slot index (2 or 3)
 * @param battle The battle state
 * @returns The action to take
 */
export function generateAiAction(
	aiSlot: ActivePokemonSlot,
	aiSlotIndex: number,
	battle: BattleState
): BattleState['pendingActions'][number] {
	// Placeholder for AI logic
	// Full implementation would go here
	return null;
}

/**
 * Apply hazard effects when a Pokemon switches in
 * 
 * Handles:
 * - Stealth Rock
 * - Spikes
 * - Toxic Spikes
 * - Sticky Web
 * 
 * @param slot The Pokemon switching in
 * @param battle The battle state
 * @param isPlayerSwitchIn True if player's Pokemon
 * @param messageLog Array to append messages to
 * @returns True if the Pokemon fainted from hazards
 */
export function applyHazardEffectsOnSwitchIn(
	slot: ActivePokemonSlot,
	battle: BattleState,
	isPlayerSwitchIn: boolean,
	messageLog: string[]
): boolean {
	// Placeholder for hazard logic
	// Full implementation would go here
	return false;
}

/**
 * Handle end of turn effects
 * 
 * Processes all end-of-turn effects including:
 * - Poison/Burn damage
 * - Leech Seed
 * - Weather damage
 * - Leftovers/Black Sludge healing
 * - Status countdown (sleep, confusion, etc.)
 * 
 * @param slot The Pokemon's slot
 * @param battle The battle state
 * @param messageLog Array to append messages to
 */
export function handleEndOfTurnEffects(
	slot: ActivePokemonSlot,
	battle: BattleState,
	messageLog: string[]
): void {
	// Placeholder for end-of-turn logic
	// Full implementation would go here
}

/**
 * Save battle status to player data
 * 
 * Updates player's party Pokemon with current battle state
 * 
 * @param battle The battle state to save
 */
export function saveBattleStatus(battle: BattleState): void {
	const player = getPlayerData(battle.playerId);
	
	// Update player party Pokemon HP and status from battle slots
	for (const slot of battle.playerSlots) {
		if (slot) {
			const partyPokemon = player.party.find(p => p.id === slot.pokemon.id);
			if (partyPokemon) {
				partyPokemon.hp = slot.pokemon.hp;
				partyPokemon.status = slot.status;
			}
		}
	}
}

// Export helper to check if battle is a doubles battle
export function isDoublesBattle(battle: BattleState): boolean {
	return battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';
}

// Export helper to get all active player slots
export function getActivePlayerSlots(battle: BattleState): ActivePokemonSlot[] {
	return getActiveSlots(battle.playerSlots);
}

// Export helper to get all active opponent slots
export function getActiveOpponentSlots(battle: BattleState): ActivePokemonSlot[] {
	return getActiveSlots(battle.opponentSlots);
}

// NOTE: This is a starter battle-system module
// The full implementations of calculateDamage, processTurn, generateAiAction, etc.
// from the original rpg-refactor.ts (lines 854-4500+) would be added here.
// 
// This provides the structure and organization while keeping all battle logic
// together in one maintainable file.
