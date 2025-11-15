/*
* Pokemon Showdown
* RPG Utility Functions
* @author MusaddikTemkar
*/
import { Dex, toID } from '../../../sim/dex';
import { createPokemon } from './core';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { MANUAL_EVOLUTIONS } from './MANUAL_EVOLUTIONS';
import { isCustomMove, getCustomMove } from './CUSTOM_MOVES';
import type { RPGPokemon, PlayerData, Stats, ActivePokemonSlot, Move } from './interface';

export function getActiveSlots(
	slots: [ActivePokemonSlot | null, ActivePokemonSlot | null] | undefined
): ActivePokemonSlot[] {
	if (!slots) return [];
	return slots.filter(slot => slot && slot.pokemon.hp > 0) as ActivePokemonSlot[];
}

export function calculateTotalExpForLevel(growthRate: string, level: number): number {
	if (level < 0) return 0;
	if (level === 0) return 0;
	if (!Number.isInteger(level)) level = Math.floor(level);

	const n = level;
	let result: number;

	switch (growthRate) {
	case 'Slow':
		result = Math.floor((5 * n ** 3) / 4);
		break;
	case 'Medium Fast':
		result = Math.floor(n ** 3);
		break;
	case 'Fast':
		result = Math.floor((4 * n ** 3) / 5);
		break;
	case 'Medium Slow':
		result = Math.floor(((6 / 5) * n ** 3) - (15 * n ** 2) + (100 * n) - 140);
		break;
	case 'Erratic':
		if (n <= 50) result = Math.floor((n ** 3 * (100 - n)) / 50);
		else if (n <= 68) result = Math.floor((n ** 3 * (150 - n)) / 100);
		else if (n <= 98) result = Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500);
		else result = Math.floor((n ** 3 * (160 - n)) / 100);
		break;
	case 'Fluctuating':
		if (n <= 15) result = Math.floor(n ** 3 * ((Math.floor((n + 1) / 3) + 24) / 50));
		else if (n <= 36) result = Math.floor(n ** 3 * ((n + 14) / 50));
		else result = Math.floor(n ** 3 * ((Math.floor(n / 2) + 32) / 50));
		break;
	default:
		result = Math.floor(n ** 3);
	}

	return Math.max(0, result);
}

export const NATURES: Record<string, { plus: keyof Stats, minus: keyof Stats } | null> = {
	'Adamant': { plus: 'atk', minus: 'spa' },
	'Bashful': null,
	'Brave': { plus: 'atk', minus: 'spe' },
	'Bold': { plus: 'def', minus: 'atk' },
	'Calm': { plus: 'spd', minus: 'atk' },
	'Careful': { plus: 'spd', minus: 'spa' },
	'Docile': null,
	'Gentle': { plus: 'spd', minus: 'def' },
	'Hardy': null,
	'Hasty': { plus: 'spe', minus: 'def' },
	'Impish': { plus: 'def', minus: 'spa' },
	'Jolly': { plus: 'spe', minus: 'spa' },
	'Lax': { plus: 'def', minus: 'spd' },
	'Lonely': { plus: 'atk', minus: 'def' },
	'Mild': { plus: 'spa', minus: 'def' },
	'Modest': { plus: 'spa', minus: 'atk' },
	'Naive': { plus: 'spe', minus: 'spd' },
	'Naughty': { plus: 'atk', minus: 'spd' },
	'Quiet': { plus: 'spa', minus: 'spe' },
	'Quirky': null,
	'Rash': { plus: 'spa', minus: 'spd' },
	'Relaxed': { plus: 'def', minus: 'spe' },
	'Sassy': { plus: 'spd', minus: 'spe' },
	'Serious': null,
	'Timid': { plus: 'spe', minus: 'atk' },
};

export const NATURE_LIST = Object.keys(NATURES);

export function calculateStats(
	species: any,
	level: number,
	nature: string,
	ivs: Record<keyof Stats, number>,
	evs: Record<keyof Stats, number>
): Stats {
	const stats: Stats = { maxHp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	stats.maxHp = Math.floor(((2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;
	stats.atk = Math.floor(((2 * species.baseStats.atk + ivs.atk + Math.floor(evs.atk / 4)) * level) / 100) + 5;
	stats.def = Math.floor(((2 * species.baseStats.def + ivs.def + Math.floor(evs.def / 4)) * level) / 100) + 5;
	stats.spa = Math.floor(((2 * species.baseStats.spa + ivs.spa + Math.floor(evs.spa / 4)) * level) / 100) + 5;
	stats.spd = Math.floor(((2 * species.baseStats.spd + ivs.spd + Math.floor(evs.spd / 4)) * level) / 100) + 5;
	stats.spe = Math.floor(((2 * species.baseStats.spe + ivs.spe + Math.floor(evs.spe / 4)) * level) / 100) + 5;

	const natureEffect = NATURES[nature];
	if (natureEffect) {
		// Use 110/100 and 90/100 instead of 1.1 and 0.9 to match Pokemon Showdown's formula
		stats[natureEffect.plus] = Math.floor(stats[natureEffect.plus] * 110 / 100);
		stats[natureEffect.minus] = Math.floor(stats[natureEffect.minus] * 90 / 100);
	}
	return stats;
}

export function getMove(moveId: string): any {
	if (isCustomMove(moveId)) {
		const customMove = getCustomMove(moveId);
		return { ...customMove, exists: true };
	}

	return Dex.moves.get(moveId);
}

export function levelUp(pokemon: RPGPokemon): string[] {
	const levelUpMessages: string[] = [];
	pokemon.level++;
	levelUpMessages.push(`**${pokemon.species} grew to Level ${pokemon.level}!**`);
	const oldStats = { ...pokemon };
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	const hpPercentage = pokemon.hp / pokemon.maxHp;

	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * hpPercentage));

	pokemon.expToNextLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level + 1);
	return levelUpMessages;
}

export function handleLearningMoves(player: PlayerData, pokemon: RPGPokemon): { messages: string[] } {
	const messages: string[] = [];
	const speciesId = toID(pokemon.species);
	const manualLearnset = MANUAL_LEARNSETS[speciesId];
	if (!manualLearnset?.levelup) return { messages };

	const movesLearnedAtThisLevel = manualLearnset.levelup
		.filter(learnable => learnable.level === pokemon.level)
		.map(learnable => toID(learnable.move))
		.filter(moveId => {
			const moveData = getMove(moveId);
			return moveData.exists && !pokemon.moves.some(m => m.id === moveId);
		});

	if (movesLearnedAtThisLevel.length === 0) return { messages };

	const openMoveSlots = 4 - pokemon.moves.length;
	const movesToQueue: string[] = [];

	if (openMoveSlots > 0) {
		const movesToAutoLearn = movesLearnedAtThisLevel.slice(0, openMoveSlots);
		for (const moveId of movesToAutoLearn) {
			const moveData = getMove(moveId);
			pokemon.moves.push({ id: moveId, pp: moveData.pp || 5 });
			messages.push(`**${pokemon.species} learned ${moveData.name}!**`);
		}
	}

	if (movesLearnedAtThisLevel.length > openMoveSlots) {
		const remainingMoves = movesLearnedAtThisLevel.slice(openMoveSlots);
		movesToQueue.push(...remainingMoves);
	}

	if (movesToQueue.length > 0) {
		if (!player.pendingMoveLearnQueue) {
			player.pendingMoveLearnQueue = [];
		}

		// Find existing queue entry for this Pokemon
		const existingEntry = player.pendingMoveLearnQueue.find(q => q.pokemonId === pokemon.id);
		if (existingEntry) {
			existingEntry.moveIds.push(...movesToQueue);
		} else {
			player.pendingMoveLearnQueue.push({ pokemonId: pokemon.id, moveIds: movesToQueue });
		}
	}

	return { messages };
}

export interface CheckEvolutionContext {
	room: { add: (message: string) => { update: () => void } };
	user: { name: string };
}

export function checkEvolution(
	player: PlayerData,
	pokemon: RPGPokemon,
	context: CheckEvolutionContext,
	itemUsed?: string
): string | null {
	const speciesId = toID(pokemon.species);
	const evolutionList = MANUAL_EVOLUTIONS[speciesId];

	if (!evolutionList) return null;
	if (pokemon.item === 'everstone') return null;

	let foundEvo = null;

	for (const evoData of evolutionList) {
		const isLevelEvo = itemUsed === undefined && pokemon.level >= evoData.evoLevel && !evoData.evoItem;
		const isItemEvo = itemUsed !== undefined && evoData.evoItem === itemUsed;
		const isLevelItemEvo = itemUsed === evoData.evoItem && pokemon.level >= evoData.evoLevel;

		if (itemUsed) {
			if (isItemEvo || isLevelItemEvo) {
				foundEvo = evoData;
				break;
			}
		} else if (isLevelEvo) {
			foundEvo = evoData;
			break;
		}
	}

	if (!foundEvo) return null;

	const evoSpecies = Dex.species.get(foundEvo.evoTo);
	if (!evoSpecies.exists) return null;
	const oldSpeciesName = pokemon.species;
	pokemon.species = evoSpecies.name;

	if (pokemon.nickname === oldSpeciesName) {
		pokemon.nickname = evoSpecies.name;
	}

	const newStats = calculateStats(evoSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	const hpPercentage = pokemon.hp / pokemon.maxHp;

	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * hpPercentage));

	const { messages: evoMoveMessages } = handleLearningMoves(player, pokemon);
	let evoMessage = `**What?! ${oldSpeciesName} is evolving!**<br>...Congratulations! Your ${oldSpeciesName} evolved into **${evoSpecies.name}**!`;
	if (evoMoveMessages.length > 0) evoMessage += `<br>${evoMoveMessages.join('<br>')}`;

	context.room.add(`|c|~RPG Bot|What?! ${context.user.name}'s ${oldSpeciesName} is evolving!`).update();
	return evoMessage;
}

/**
 * Helper function to shuffle an array in place (Fisher-Yates)
 */
function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/**
 * Assigns a random, viable moveset to a Pokémon for Battle Tower mode.
 * This function directly uses MANUAL_LEARNSETS as requested, ignoring Dex.learnset.
 */
export function assignRandomMoveset(pokemon: RPGPokemon): void {
	const speciesId = toID(pokemon.species);
	const learnsetData = MANUAL_LEARNSETS[speciesId];

	if (!learnsetData) {
		// If species has no manual learnset, keep its default moves.
		// If it has no moves, give it Tackle as a fallback.
		if (pokemon.moves.length === 0) {
			const tackle = getMove('tackle');
			pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		}
		return;
	}

	const allMoveIds: string[] = [];

	// 1. Collect all moves from MANUAL_LEARNSETS
	// From levelup:
	if (learnsetData.levelup) {
		for (const entry of learnsetData.levelup) {
			allMoveIds.push(toID(entry.move));
		}
	}
	// From tm:
	if (learnsetData.tm) {
		allMoveIds.push(...learnsetData.tm.map(toID));
	}
	// From tutor:
	if (learnsetData.tutor) {
		allMoveIds.push(...learnsetData.tutor.map(toID));
	}
	// From egg:
	if (learnsetData.egg) {
		allMoveIds.push(...learnsetData.egg.map(toID));
	}

	// 2. Filter for unique, valid moves
	const uniqueMoveIds = [...new Set(allMoveIds)];
	const validMoves: Move[] = [];
	for (const moveId of uniqueMoveIds) {
		const moveData = getMove(moveId) as Move; // Cast to Move from interface
		if (moveData && moveData.exists) {
			// Filter out "do-nothing" moves
			if (moveData.category === 'Status' && moveData.basePower === 0 && !moveData.status && !moveData.boosts && !moveData.volatileStatus && !moveData.sideCondition && !moveData.pseudoWeather && !moveData.weather && !moveData.terrain && !moveData.flags?.heal) {
				continue;
			}
			validMoves.push(moveData);
		}
	}

	if (validMoves.length === 0) {
		// Fallback if no valid moves found
		const tackle = getMove('tackle');
		pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		return;
	}

	// 3. Separate into damaging and status moves
	const damagingMoves = validMoves.filter(m => m.category === 'Physical' || m.category === 'Special');
	const statusMoves = validMoves.filter(m => m.category === 'Status');

	// 4. Shuffle arrays for randomness
	shuffleArray(damagingMoves);
	shuffleArray(statusMoves);

	const newMoveset: Move[] = [];

	// 5. Select 3-4 damaging moves, 0-1 status moves
	// Prioritize 1 status move if available, otherwise go for 4 damaging
	const statusMoveCount = statusMoves.length > 0 ? 1 : 0;
	const damagingMoveCount = 4 - statusMoveCount;

	// Add damaging moves
	newMoveset.push(...damagingMoves.slice(0, damagingMoveCount));
	// Add status move
	newMoveset.push(...statusMoves.slice(0, statusMoveCount));

	// 6. If not enough damaging moves, fill with more status moves
	if (newMoveset.length < 4 && statusMoves.length > statusMoveCount) {
		const needed = 4 - newMoveset.length;
		newMoveset.push(...statusMoves.slice(statusMoveCount, statusMoveCount + needed));
	}
	// 7. If still not enough moves, fill with remaining damaging moves
	if (newMoveset.length < 4 && damagingMoves.length > damagingMoveCount) {
		const needed = 4 - newMoveset.length;
		newMoveset.push(...damagingMoves.slice(damagingMoveCount, damagingMoveCount + needed));
	}

	// 8. If still not 4 moves (e.g., learnset has < 4 total), just use what we have.
	// If we somehow have 0, add Tackle.
	if (newMoveset.length === 0) {
		const tackle = getMove('tackle');
		pokemon.moves = [{ id: 'tackle', pp: tackle.pp || 35 }];
		return;
	}

	// 9. Format for RPGPokemon and assign max PP
	pokemon.moves = newMoveset.map(move => ({
		id: move.id,
		pp: move.pp || 5 // Use the move's max PP
	}));
}

/**
 * A list of viable, competitive held items for the Battle Tower.
 */
const VIABLE_HELD_ITEMS: string[] = [
	// Recovery
	'leftovers', 
	'sitrusberry', 
	'blacksludge', 
	'shellbell',

	// Damage Boosting
	'lifeorb', 
	'choiceband', 
	'choicespecs', 
	'expertbelt',

	// Speed Control
	'choicescarf',
	'quickclaw',

	// Defensive / Utility
	'focussash', 
	'assaultvest', 
	'heavydutyboots', 
	'rockyhelmet', 
	'airballoon',
	'shedshell',
	'clearamulet',

	// One-time Use / Status Cure
	'lumberry', 
	'mentalherb', 
	'whiteherb', 
	'powerherb', 
	'weaknesspolicy',

	// Status Orbs
	'flameorb', 
	'toxicorb', 
	'stickybarb',

	// Stat-Boost Pinch Berries
	'liechiberry', // Atk
	'ganlonberry', // Def
	'salacberry',  // Spe
	'petayaberry', // SpA
	'apicotberry', // SpD
	'starfberry',  // Random

	// Common Type-Resist Berries
	'chopleberry', // Fighting
	'yacheberry',  // Ice
	'shucaberry',  // Ground
	'occaberry',   // Fire
	'passhoberry', // Water
	'wacanberry',  // Electric
	'rindoberry',  // Grass
	'kasibberry',  // Ghost
	'colburberry', // Dark
	'babiriberry', // Steel
];

/**
 * Generates a random team of Pokémon for the Battle Tower.
 * "Hard but balanced" is achieved by filtering for fully-evolved Pokémon
 * from standard tiers (OU, UU, RU, NU, PU) that have manual learnsets.
 *
 * @param count The number of Pokémon in the team.
 * @param level The level for all Pokémon in the team.
 * @returns An array of randomly generated RPGPokemon.
 */
export function generateRandomTeam(count: number, level: number): RPGPokemon[] {
	// 1. Get all species from the Dex
	const allSpecies = Dex.species.all();

	// 2. Filter for viable Pokémon
	const viableTiers = ['OU', 'UU', 'UUBL', 'RU', 'RUBL', 'NU', 'NUBL', 'PU', 'PUBL'];
	const viableSpecies = allSpecies.filter(species => {
		// Must be fully evolved (not NFE and no evos)
		const isFullyEvolved = !species.nfe && (!species.evos || species.evos.length === 0);
		// Must be in a standard, viable tier (excludes Ubers, AG, etc.)
		const isInViableTier = viableTiers.includes(species.tier);
		// Must have a manual learnset defined
		const hasManualLearnset = !!MANUAL_LEARNSETS[species.id];

		return isFullyEvolved && isInViableTier && hasManualLearnset;
	});

	if (viableSpecies.length === 0) {
		// Fallback in case no Pokémon match criteria
		// (e.g., if MANUAL_LEARNSETS is very small)
		const fallback = createPokemon('pikachu', level);
		assignRandomMoveset(fallback);
		fallback.item = 'lightball';
		return [fallback];
	}

	const team: RPGPokemon[] = [];

	// 3. Loop until the team is full
	while (team.length < count) {
		// Pick a random species from the viable list
		const randomSpecies = viableSpecies[Math.floor(Math.random() * viableSpecies.length)];

		// 4. Create the Pokémon. This already assigns random IVs.
		const pokemon = createPokemon(randomSpecies.id, level);

		// 5. Assign random, legal EV spread (252 / 252 / 4)
		const stats: (keyof typeof pokemon.evs)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
		shuffleArray(stats); // Re-use the shuffle helper
		
		pokemon.evs[stats[0]] = 252;
		pokemon.evs[stats[1]] = 252;
		pokemon.evs[stats[2]] = 4;
		
		// 6. Re-calculate stats with new EVs (IVs were already random)
		const speciesData = Dex.species.get(pokemon.species);
		const newStats = calculateStats(speciesData, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);
		
		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp; // Start at full HP
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		// 7. Assign random moveset
		assignRandomMoveset(pokemon);

		// 8. Assign a random viable item
		pokemon.item = VIABLE_HELD_ITEMS[Math.floor(Math.random() * VIABLE_HELD_ITEMS.length)];

		// 9. Add to team
		team.push(pokemon);
	}

	return team;
}


export const RPGUtils = {
	getActiveSlots,
	calculateTotalExpForLevel,
	calculateStats,
	getMove,
	levelUp,
	handleLearningMoves,
	checkEvolution,
	NATURES,
	NATURE_LIST,
};

export default RPGUtils;
