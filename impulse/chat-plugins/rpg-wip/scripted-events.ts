/*
* Pokemon Showdown
* RPG Scripted Events Handler
*
* This file implements logic for all scripted event types.
*
* All handlers are exported and can be imported individually or as a namespace:
*   import * as ScriptedEvents from './scripted-events';
*   import { handleCutscene, handlePokemonSwarm } from './scripted-events';
*
* Available Scripted Event Handlers (60+ handlers):
*  - handleCutscene: Display cinematic cutscenes
*  - handleChoice: Player makes a choice that affects story
*  - handleQuiz: Answer quiz questions
*  - handlePuzzle: Solve puzzles
*  - handleRiddle: Answer riddles
*  - handleMinigame: Play minigames
*  - handleWeatherChange: Change weather in location
*  - handleEarthquake: Earthquake event
*  - handleExplosion: Explosion event
*  - handleFlood: Flood event
*  - handleMeteor: Meteor fall event
*  - handleEclipse: Eclipse event
*  - handleTimeWarp: Time manipulation
*  - handleDimensionRift: Dimension rift opening
*  - handlePokemonSwarm: Pokemon swarms appear
*  - checkActiveSwarm: Check if swarm is active
*  - handleBossBattle: Multi-phase boss battles
*  - handleTournament: Tournament against AI trainers
*  - advanceTournamentRound: Progress tournament
*  - handleContest: Pokemon contests
*  - handleRace: Racing events
*  - handleScavengerHunt: Find hidden items
*  - markScavengerItemFound: Mark item as found
*  - handleInvestigation: Investigate mysteries
*  - markClueFound: Mark clue as found
*  - handleStealth: Stealth missions
*  - handleEscape: Escape sequences
*  - handleRescue: Rescue missions
*  - handleDefense: Defend location
*  - handleAmbush: Player ambushed
*  - handleBetrayal: Betrayal occurs
*  - handleAlliance: Form alliances
*  - handleNegotiation: Negotiate with NPCs
*  - handleDiscovery: Discover something new
*  - handleRevelation: Story revelations
*  - handleTransformation: Pokemon transformations
*  - handleEvolutionCeremony: Special evolution
*  - handleLegendaryAwakening: Legendary Pokemon awakens
*  - handleAncientSeal: Ancient seal activated
*  - handlePortalOpening: Portal opens
*  - handleDimensionMerge: Dimensions merge
*  - handleTimeLoop: Time loop event
*  - handleProphecy: Prophecy revealed
*  - handleFishingEvent: Fishing encounter
*  - handleSurfingEvent: Surfing encounter
*  - handleDivingEvent: Diving encounter
*  - handleItemBall: Find items in pokeballs
*  - handleHiddenItemEvent: Hidden item pickup
*  - handleRoamingEvent: Roaming Pokemon
*  - handleMultiBattle: Tag team battles
*  - handleFestivalEvent: Festival/celebration
*  - handleSecretArea: Unlock secret areas
*  - handleWarpEvent: Teleportation/warp
*  - handleGymChallengeEvent: Gym challenge start
*  - handleEliteFourChallengeEvent: Elite Four gauntlet
*  - handleHallOfFameEvent: Hall of Fame induction
*  - handleSafariZoneEvent: Safari Zone special
*  - handleBugCatchingContestEvent: Bug Catching Contest
*  - handleBattleFrontierEvent: Battle Frontier
*  - handleFlashback: Show flashback scenes
*  - handleDreamSequence: Dream sequences and nightmares
*  - handleReputationChange: Change faction reputation
*  - handleCompanionJoin: NPC joins as companion
*  - handleCompanionLeave: Companion leaves party
*  - handleMoralChoice: Moral choices affecting karma
*  - handleLoreDiscovery: Discover world lore/history
*  - handleBranchingPath: Story branches based on choices
*  - handleChapterTransition: Transition between chapters
*  - handleEpilogue: Show epilogue after main story
*  - handleCollectibleItem: Find special collectibles
*  - handleVoiceFromAbove: Mysterious voice guidance
*  - handleMemoryRestoration: Regain lost memories
*
* Usage in locations.ts:
*   Define scriptedEvents in location objects with types that match
*   these handlers. The handler will be automatically called by
*   commands.ts when the event is triggered.
*/

import type { PlayerData, RPGPokemon, ScriptedEvent } from './interface';
import { Dex } from '../../../sim/dex';

/**
 * Utility: Parse timestamp from flag string
 * Flags follow format: prefix_suffix_timestamp
 */
function parseTimestampFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const timestamp = parts[parts.length - 1];
	return parseInt(timestamp) || 0;
}

/**
 * Utility: Parse numeric value from flag string
 * Flags follow format: prefix_suffix_number
 */
function parseNumberFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const value = parts[parts.length - 1];
	return parseInt(value) || 0;
}

/**
 * Cutscene Event
 * Display a cinematic cutscene
 */
export function handleCutscene(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, script?: string[] } {
	if (!event.cutsceneScript || event.cutsceneScript.length === 0) {
		return { success: false, message: 'No cutscene script configured.' };
	}

	return {
		success: true,
		message: 'Cutscene playing...',
		script: event.cutsceneScript,
	};
}

/**
 * Choice Event
 * Player makes a choice that affects the story
 */
export function handleChoice(
	player: PlayerData,
	event: ScriptedEvent,
	choiceIndex: number
): { success: boolean, message: string, resultFlag?: string, resultDialogue?: string } {
	if (!event.choices || choiceIndex >= event.choices.length) {
		return { success: false, message: 'Invalid choice.' };
	}

	const choice = event.choices[choiceIndex];

	// Set result flag if specified
	if (choice.resultFlag) {
		player.storyFlags.add(choice.resultFlag);
	}

	return {
		success: true,
		message: choice.text,
		resultFlag: choice.resultFlag,
		resultDialogue: choice.resultDialogue,
	};
}

/**
 * Quiz Event
 * Answer quiz questions
 */
export function handleQuiz(
	player: PlayerData,
	event: ScriptedEvent,
	answerIndex: number
): { success: boolean, message: string, correct: boolean } {
	if (!event.question || !event.answers || !event.correctAnswer) {
		return { success: false, message: 'Quiz not configured.', correct: false };
	}

	const correct = answerIndex === event.correctAnswer;

	return {
		success: true,
		message: correct ? 'Correct answer!' : 'Incorrect answer!',
		correct,
	};
}

/**
 * Puzzle Event
 * Solve a puzzle
 */
export function handlePuzzle(
	player: PlayerData,
	event: ScriptedEvent,
	solution: string
): { success: boolean, message: string, solved: boolean } {
	if (!event.answers || event.answers.length === 0 || event.correctAnswer === undefined) {
		return { success: false, message: 'Puzzle not configured.', solved: false };
	}

	if (event.correctAnswer < 0 || event.correctAnswer >= event.answers.length) {
		return { success: false, message: 'Puzzle configuration error.', solved: false };
	}

	const solved = solution.toLowerCase() === event.answers[event.correctAnswer].toLowerCase();

	return {
		success: true,
		message: solved ? 'Puzzle solved!' : 'That\'s not quite right...',
		solved,
	};
}

/**
 * Riddle Event
 * Answer a riddle
 */
export function handleRiddle(
	player: PlayerData,
	event: ScriptedEvent,
	answer: string
): { success: boolean, message: string, solved: boolean } {
	if (!event.answers || event.answers.length === 0) {
		return { success: false, message: 'Riddle not configured.', solved: false };
	}

	const solved = event.answers.some(a => a.toLowerCase() === answer.toLowerCase());

	return {
		success: true,
		message: solved ? 'Correct! The riddle is solved!' : 'That\'s not the answer...',
		solved,
	};
}

/**
 * Minigame Event
 * Play a minigame (framework for future implementation)
 */
export function handleMinigame(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Minigame started! (Implementation specific to minigame type)',
	};
}

/**
 * Weather Change Event
 * Change the weather in the current location
 */
export function handleWeatherChange(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, newWeather?: string, duration?: number } {
	if (!event.newWeather) {
		return { success: false, message: 'No weather specified.' };
	}

	const weatherMessages: Record<string, string> = {
		'sun': 'The sun begins to shine brightly!',
		'rain': 'It starts to rain heavily!',
		'sandstorm': 'A fierce sandstorm kicks up!',
		'hail': 'Hail begins to fall from the sky!',
		'fog': 'A thick fog rolls in...',
		'clear': 'The weather clears up.',
	};

	return {
		success: true,
		message: weatherMessages[event.newWeather] || 'The weather changes!',
		newWeather: event.newWeather,
		duration: event.weatherDuration,
	};
}

/**
 * Earthquake Event
 * An earthquake occurs
 */
export function handleEarthquake(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The ground shakes violently! An earthquake!',
	};
}

/**
 * Explosion Event
 * An explosion occurs
 */
export function handleExplosion(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A massive explosion rocks the area!',
	};
}

/**
 * Flood Event
 * A flood occurs
 */
export function handleFlood(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Water begins to flood the area!',
	};
}

/**
 * Meteor Event
 * A meteor falls
 */
export function handleMeteor(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A meteor streaks across the sky and crashes nearby!',
	};
}

/**
 * Eclipse Event
 * An eclipse occurs
 */
export function handleEclipse(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The sky darkens as an eclipse begins...',
	};
}

/**
 * Time Warp Event
 * Time manipulation event
 */
export function handleTimeWarp(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Time itself seems to distort around you...',
	};
}

/**
 * Dimension Rift Event
 * A rift to another dimension opens
 */
export function handleDimensionRift(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A rift in reality tears open before you!',
	};
}

/**
 * Pokemon Swarm Event
 * A swarm of Pokemon appears
 */
export function handlePokemonSwarm(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, swarmSpecies?: string, duration?: number } {
	if (!event.swarmSpecies) {
		return { success: false, message: 'No swarm species specified.' };
	}

	const species = Dex.species.get(event.swarmSpecies);
	if (!species.exists) {
		return { success: false, message: 'Invalid Pokemon species.' };
	}

	// Set swarm flag
	const swarmFlag = `swarm_${event.swarmSpecies}_active`;
	const duration = event.swarmDuration || 24; // hours
	const expiryTime = Date.now() + (duration * 60 * 60 * 1000);
	player.storyFlags.add(`${swarmFlag}_${expiryTime}`);

	return {
		success: true,
		message: `A swarm of ${species.name} has appeared!`,
		swarmSpecies: event.swarmSpecies,
		duration,
	};
}

/**
 * Check if a swarm is active
 */
export function checkActiveSwarm(player: PlayerData, species: string): boolean {
	const swarmFlag = `swarm_${species}_active`;
	const swarmStr = Array.from(player.storyFlags).find(f => f.startsWith(swarmFlag));

	if (!swarmStr) return false;

	const expiryTime = parseTimestampFromFlag(swarmStr);
	const now = Date.now();

	if (now >= expiryTime) {
		player.storyFlags.delete(swarmStr);
		return false;
	}

	return true;
}

/**
 * Boss Battle Event
 * Special multi-phase boss battle
 */
export function handleBossBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, bossTrainerId?: string, phases?: number } {
	if (!event.bossTrainerId) {
		return { success: false, message: 'No boss trainer configured.' };
	}

	return {
		success: true,
		message: 'A powerful boss appears!',
		bossTrainerId: event.bossTrainerId,
		phases: event.bossPhases || 1,
	};
}

/**
 * Tournament Event
 * Single-player tournament against AI trainers
 */
export function handleTournament(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, currentRound?: number, opponent?: string } {
	if (!event.tournamentOpponents || event.tournamentOpponents.length === 0) {
		return { success: false, message: 'No tournament opponents configured.' };
	}

	const tournamentFlag = `tournament_${eventId}_round`;
	const roundStr = Array.from(player.storyFlags).find(f => f.startsWith(tournamentFlag));

	let currentRound = 0;
	if (roundStr) {
		currentRound = parseNumberFromFlag(roundStr);
	}

	if (currentRound >= event.tournamentOpponents.length) {
		return {
			success: false,
			message: 'You have completed the tournament!',
		};
	}

	const opponent = event.tournamentOpponents[currentRound];

	return {
		success: true,
		message: `Tournament Round ${currentRound + 1}`,
		currentRound,
		opponent,
	};
}

/**
 * Advance to next tournament round
 */
export function advanceTournamentRound(player: PlayerData, eventId: string): void {
	const tournamentFlag = `tournament_${eventId}_round`;
	const roundStr = Array.from(player.storyFlags).find(f => f.startsWith(tournamentFlag));

	let currentRound = 0;
	if (roundStr) {
		currentRound = parseNumberFromFlag(roundStr);
		player.storyFlags.delete(roundStr);
	}

	player.storyFlags.add(`${tournamentFlag}_${currentRound + 1}`);
}

/**
 * Contest Event
 * Pokemon contest (simplified)
 */
export function handleContest(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string, score?: number } {
	if (!event.contestType) {
		return { success: false, message: 'No contest type specified.' };
	}

	// Simple scoring based on Pokemon stats and type
	let score = 0;
	const contestType = event.contestType;

	switch (contestType) {
	case 'cool':
		score = pokemon.atk + pokemon.spe;
		break;
	case 'beauty':
		score = pokemon.spa + pokemon.spd;
		break;
	case 'cute':
		score = pokemon.maxHp + pokemon.friendship;
		break;
	case 'smart':
		score = pokemon.spa + pokemon.spd;
		break;
	case 'tough':
		score = pokemon.def + pokemon.maxHp;
		break;
	}

	score = Math.floor(score / 10); // Scale down

	return {
		success: true,
		message: `${pokemon.nickname} performed in the ${contestType} contest!`,
		score,
	};
}

/**
 * Race Event
 * Racing event
 */
export function handleRace(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string, time?: number, won?: boolean } {
	// Simple race based on speed stat
	const time = Math.max(10, 100 - pokemon.spe);
	const won = time < 50; // Win if time is under 50

	return {
		success: true,
		message: won ?
			`${pokemon.nickname} finished the race in ${time} seconds! Victory!` :
			`${pokemon.nickname} finished the race in ${time} seconds. Not quite fast enough...`,
		time,
		won,
	};
}

/**
 * Scavenger Hunt Event
 * Find hidden items
 */
export function handleScavengerHunt(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, found?: number, total?: number } {
	if (!event.clues || event.clues.length === 0) {
		return { success: false, message: 'No items to find.' };
	}

	const huntFlag = `scavengerhunt_${eventId}_found`;
	const foundFlags = Array.from(player.storyFlags).filter(f => f.startsWith(huntFlag));

	return {
		success: true,
		message: 'Scavenger hunt in progress!',
		found: foundFlags.length,
		total: event.clues.length,
	};
}

/**
 * Mark item as found in scavenger hunt
 */
export function markScavengerItemFound(player: PlayerData, eventId: string, itemIndex: number): void {
	const huntFlag = `scavengerhunt_${eventId}_found_${itemIndex}`;
	player.storyFlags.add(huntFlag);
}

/**
 * Investigation Event
 * Investigate a mystery
 */
export function handleInvestigation(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, cluesFound?: number, totalClues?: number, solved?: boolean } {
	if (!event.clues || event.clues.length === 0) {
		return { success: false, message: 'No investigation configured.' };
	}

	const invFlag = `investigation_${eventId}_clue`;
	const foundClues = Array.from(player.storyFlags).filter(f => f.startsWith(invFlag));
	const solved = foundClues.length >= event.clues.length;

	return {
		success: true,
		message: solved ? 'Investigation complete!' : 'Investigation ongoing...',
		cluesFound: foundClues.length,
		totalClues: event.clues.length,
		solved,
	};
}

/**
 * Mark clue as found
 */
export function markClueFound(player: PlayerData, eventId: string, clueIndex: number): void {
	const invFlag = `investigation_${eventId}_clue_${clueIndex}`;
	player.storyFlags.add(invFlag);
}

/**
 * Stealth Event
 * Stealth mission
 */
export function handleStealth(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Stealth mission started! Stay hidden...',
	};
}

/**
 * Escape Event
 * Escape sequence
 */
export function handleEscape(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Quick! You must escape!',
	};
}

/**
 * Rescue Event
 * Rescue mission
 */
export function handleRescue(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A rescue mission! Someone needs help!',
	};
}

/**
 * Defense Event
 * Defend a location
 */
export function handleDefense(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Defend this location from attackers!',
	};
}

/**
 * Ambush Event
 * Player is ambushed
 */
export function handleAmbush(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'You\'ve been ambushed!',
	};
}

/**
 * Betrayal Event
 * A betrayal occurs
 */
export function handleBetrayal(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A shocking betrayal!',
	};
}

/**
 * Alliance Event
 * Form an alliance
 */
export function handleAlliance(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An alliance has been formed!',
	};
}

/**
 * Negotiation Event
 * Negotiate with NPCs
 */
export function handleNegotiation(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Begin negotiations...',
	};
}

/**
 * Discovery Event
 * Discover something new
 */
export function handleDiscovery(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'You\'ve made an important discovery!',
	};
}

/**
 * Revelation Event
 * A story revelation
 */
export function handleRevelation(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A shocking revelation!',
	};
}

/**
 * Transformation Event
 * Pokemon transformation
 */
export function handleTransformation(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string, transformationType?: string } {
	if (!event.transformationType) {
		return { success: false, message: 'No transformation type specified.' };
	}

	const transformations: Record<string, string> = {
		'mega': `${pokemon.nickname} is Mega Evolving!`,
		'dynamax': `${pokemon.nickname} is Dynamaxing!`,
		'zmove': `${pokemon.nickname} is powering up a Z-Move!`,
		'terastal': `${pokemon.nickname} is Terastallizing!`,
		'fusion': `${pokemon.nickname} is fusing with another Pokemon!`,
	};

	return {
		success: true,
		message: transformations[event.transformationType] || 'Transformation occurring!',
		transformationType: event.transformationType,
	};
}

/**
 * Evolution Ceremony Event
 * Special evolution event
 */
export function handleEvolutionCeremony(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string } {
	return {
		success: true,
		message: `A special evolution ceremony for ${pokemon.nickname}!`,
	};
}

/**
 * Legendary Awakening Event
 * A legendary Pokemon awakens
 */
export function handleLegendaryAwakening(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, legendarySpecies?: string } {
	if (!event.pokemon) {
		return { success: false, message: 'No legendary Pokemon specified.' };
	}

	const species = Dex.species.get(event.pokemon.species);
	if (!species.exists) {
		return { success: false, message: 'Invalid Pokemon species.' };
	}

	return {
		success: true,
		message: `The legendary ${species.name} awakens from its slumber!`,
		legendarySpecies: event.pokemon.species,
	};
}

/**
 * Ancient Seal Event
 * An ancient seal is broken or activated
 */
export function handleAncientSeal(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An ancient seal begins to glow with power!',
	};
}

/**
 * Portal Opening Event
 * A portal opens
 */
export function handlePortalOpening(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A mysterious portal opens before you!',
	};
}

/**
 * Dimension Merge Event
 * Dimensions begin to merge
 */
export function handleDimensionMerge(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The fabric of reality begins to merge with another dimension!',
	};
}

/**
 * Time Loop Event
 * Player enters a time loop
 */
export function handleTimeLoop(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, loopCount?: number } {
	const loopFlag = `timeloop_${eventId}_count`;
	const loopStr = Array.from(player.storyFlags).find(f => f.startsWith(loopFlag));

	let loopCount = 1;
	if (loopStr) {
		loopCount = parseNumberFromFlag(loopStr) + 1;
		player.storyFlags.delete(loopStr);
	}

	player.storyFlags.add(`${loopFlag}_${loopCount}`);

	return {
		success: true,
		message: `Time repeats itself... (Loop #${loopCount})`,
		loopCount,
	};
}

/**
 * Prophecy Event
 * A prophecy is revealed
 */
export function handleProphecy(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An ancient prophecy speaks of events to come...',
	};
}

/**
 * Fishing Event
 * Fishing encounter
 */
export function handleFishingEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, encounters?: any[] } {
	const rodRequired = event.fishingRodRequired || 'old';
	return {
		success: true,
		message: `You cast your ${rodRequired} Rod...`,
		encounters: event.fishingEncounters,
	};
}

/**
 * Surfing Event
 * Surfing encounter
 */
export function handleSurfingEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, encounters?: any[] } {
	return {
		success: true,
		message: 'You surf across the water...',
		encounters: event.surfingEncounters,
	};
}

/**
 * Diving Event
 * Diving encounter
 */
export function handleDivingEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, encounters?: any[], depth?: number } {
	return {
		success: true,
		message: `You dive to depth ${event.divingDepth || 1}...`,
		encounters: event.divingEncounters,
		depth: event.divingDepth,
	};
}

/**
 * Item Ball Event
 * Finding items in pokeballs
 */
export function handleItemBall(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, item?: { itemId: string, quantity: number } } {
	return {
		success: true,
		message: 'You found an item ball!',
		item: event.itemBallContents,
	};
}

/**
 * Hidden Item Event
 * Hidden item pickup
 */
export function handleHiddenItemEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, location?: string } {
	return {
		success: true,
		message: `You found a hidden item at ${event.hiddenItemLocation || 'this location'}!`,
		location: event.hiddenItemLocation,
	};
}

/**
 * Roaming Event
 * Roaming Pokemon encounter
 */
export function handleRoamingEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, pokemon?: any, locations?: string[] } {
	return {
		success: true,
		message: `A roaming ${event.roamingPokemon?.species || 'Pokemon'} appeared!`,
		pokemon: event.roamingPokemon,
		locations: event.roamingLocations,
	};
}

/**
 * Multi Battle Event
 * Tag team battle event
 */
export function handleMultiBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, partnerId?: string, opponentIds?: string[] } {
	return {
		success: true,
		message: 'A multi battle is starting!',
		partnerId: event.partnerTrainerId,
		opponentIds: event.opponentTrainerIds,
	};
}



/**
 * Festival Event
 * Festival/celebration event
 */
export function handleFestivalEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, festivalName?: string, activities?: string[] } {
	return {
		success: true,
		message: `Welcome to the ${event.festivalName || 'Festival'}!`,
		festivalName: event.festivalName,
		activities: event.festivalActivities,
	};
}

/**
 * Secret Area Event
 * Unlocking secret areas
 */
export function handleSecretArea(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, areaId?: string } {
	return {
		success: true,
		message: `You discovered a secret area!`,
		areaId: event.secretAreaId,
	};
}

/**
 * Warp Event
 * Teleportation/warp events
 */
export function handleWarpEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, destination?: string, warpType?: string } {
	const warpType = event.warpType || 'teleport';
	return {
		success: true,
		message: `You ${warpType} to ${event.warpDestination || 'another location'}!`,
		destination: event.warpDestination,
		warpType: event.warpType,
	};
}

/**
 * Gym Challenge Event
 * Formal gym challenge start
 */
export function handleGymChallengeEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, gymLeaderId?: string, trainers?: string[] } {
	return {
		success: true,
		message: 'The gym challenge begins!',
		gymLeaderId: event.gymLeaderId,
		trainers: event.gymTrainers,
	};
}

/**
 * Elite Four Challenge Event
 * Elite Four gauntlet
 */
export function handleEliteFourChallengeEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, eliteFour?: string[], championId?: string } {
	return {
		success: true,
		message: 'You challenge the Elite Four!',
		eliteFour: event.eliteFourOrder,
		championId: event.championId,
	};
}

/**
 * Hall of Fame Event
 * Hall of Fame induction
 */
export function handleHallOfFameEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	if (event.hallOfFameEntry) {
		player.storyFlags.add('hall_of_fame_inducted');
	}

	return {
		success: true,
		message: 'Congratulations! You are now in the Hall of Fame!',
	};
}

/**
 * Safari Zone Event
 * Safari Zone special event
 */
export function handleSafariZoneEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, steps?: number, balls?: number, encounters?: any[] } {
	return {
		success: true,
		message: `Welcome to the Safari Zone! You have ${event.safariSteps || 500} steps.`,
		steps: event.safariSteps,
		balls: event.safariBallCount,
		encounters: event.safariEncounters,
	};
}

/**
 * Bug Catching Contest Event
 * Bug Catching Contest
 */
export function handleBugCatchingContestEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, duration?: number, prizes?: any[] } {
	return {
		success: true,
		message: `The Bug Catching Contest begins! You have ${event.contestDuration || 20} minutes.`,
		duration: event.contestDuration,
		prizes: event.contestPrizes,
	};
}

/**
 * Battle Frontier Event
 * Battle Frontier event
 */
export function handleBattleFrontierEvent(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, facility?: string, rules?: string[] } {
	return {
		success: true,
		message: `Welcome to the Battle ${event.frontierFacility || 'Tower'}!`,
		facility: event.frontierFacility,
		rules: event.frontierRules,
	};
}

/**
 * Flashback Event
 * Show a flashback scene revealing backstory
 */
export function handleFlashback(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, flashbackText?: string, characters?: string[] } {
	if (!event.flashbackText) {
		return { success: false, message: 'No flashback configured.' };
	}

	return {
		success: true,
		message: 'A memory from the past...',
		flashbackText: event.flashbackText,
		characters: event.flashbackCharacters,
	};
}

/**
 * Dream Sequence Event
 * Dream sequence for foreshadowing or story
 */
export function handleDreamSequence(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, dreamText?: string, isNightmare?: boolean } {
	if (!event.dreamText) {
		return { success: false, message: 'No dream configured.' };
	}

	return {
		success: true,
		message: event.isNightmare ? 'A terrifying nightmare...' : 'You drift into a dream...',
		dreamText: event.dreamText,
		isNightmare: event.isNightmare,
	};
}

/**
 * Reputation Change Event
 * Change reputation with factions based on actions
 */
export function handleReputationChange(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, factionId?: string, change?: number } {
	if (!event.factionId || event.reputationChange === undefined) {
		return { success: false, message: 'No reputation change configured.' };
	}

	const repFlag = `reputation_${event.factionId}_points`;
	const repStr = Array.from(player.storyFlags).find(f => f.startsWith(repFlag));

	let currentPoints = 0;
	if (repStr) {
		currentPoints = parseInt(repStr.split('_').pop() || '0');
		player.storyFlags.delete(repStr);
	}

	currentPoints += event.reputationChange;
	player.storyFlags.add(`${repFlag}_${currentPoints}`);

	const changeText = event.reputationChange > 0 ? 'increased' : 'decreased';

	return {
		success: true,
		message: `Your reputation with ${event.factionId} has ${changeText}!`,
		factionId: event.factionId,
		change: event.reputationChange,
	};
}

/**
 * Companion Join Event
 * NPC joins player as companion
 */
export function handleCompanionJoin(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, companionId?: string } {
	if (!event.companionId) {
		return { success: false, message: 'No companion configured.' };
	}

	const companionFlag = `companion_${event.companionId}_joined`;
	if (player.storyFlags.has(companionFlag)) {
		return { success: false, message: 'This companion has already joined you!' };
	}

	player.storyFlags.add(companionFlag);

	return {
		success: true,
		message: `${event.companionId} has joined your party as a companion!`,
		companionId: event.companionId,
	};
}

/**
 * Companion Leave Event
 * Companion leaves the party
 */
export function handleCompanionLeave(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, companionId?: string } {
	if (!event.companionId) {
		return { success: false, message: 'No companion configured.' };
	}

	const companionFlag = `companion_${event.companionId}_joined`;
	if (!player.storyFlags.has(companionFlag)) {
		return { success: false, message: 'This companion is not with you!' };
	}

	player.storyFlags.delete(companionFlag);

	return {
		success: true,
		message: `${event.companionId} has left your party.`,
		companionId: event.companionId,
	};
}

/**
 * Moral Choice Event
 * Player makes a moral choice affecting karma/alignment
 */
export function handleMoralChoice(
	player: PlayerData,
	event: ScriptedEvent,
	choiceIndex: number
): { success: boolean, message: string, karmaChange?: number, alignment?: string } {
	if (!event.moralChoices || choiceIndex >= event.moralChoices.length) {
		return { success: false, message: 'Invalid moral choice.' };
	}

	const choice = event.moralChoices[choiceIndex];

	// Update karma
	const karmaFlag = 'player_karma_points';
	const karmaStr = Array.from(player.storyFlags).find(f => f.startsWith(karmaFlag));

	let currentKarma = 0;
	if (karmaStr) {
		currentKarma = parseInt(karmaStr.split('_').pop() || '0');
		player.storyFlags.delete(karmaStr);
	}

	currentKarma += choice.karmaChange || 0;
	player.storyFlags.add(`${karmaFlag}_${currentKarma}`);

	// Determine alignment
	let alignment = 'Neutral';
	if (currentKarma >= 50) alignment = 'Hero';
	else if (currentKarma >= 20) alignment = 'Good';
	else if (currentKarma <= -50) alignment = 'Villain';
	else if (currentKarma <= -20) alignment = 'Evil';

	// Set result flag if specified
	if (choice.resultFlag) {
		player.storyFlags.add(choice.resultFlag);
	}

	return {
		success: true,
		message: choice.resultText || 'Choice made.',
		karmaChange: choice.karmaChange,
		alignment,
	};
}

/**
 * Lore Discovery Event
 * Discover lore/history about the world
 */
export function handleLoreDiscovery(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, loreTitle?: string, loreText?: string } {
	if (!event.loreTitle || !event.loreText) {
		return { success: false, message: 'No lore configured.' };
	}

	const loreFlag = `lore_${eventId}_discovered`;
	if (player.storyFlags.has(loreFlag)) {
		return {
			success: true,
			message: 'You review the lore you discovered earlier.',
			loreTitle: event.loreTitle,
			loreText: event.loreText,
		};
	}

	player.storyFlags.add(loreFlag);

	return {
		success: true,
		message: 'You discovered ancient lore!',
		loreTitle: event.loreTitle,
		loreText: event.loreText,
	};
}

/**
 * Branching Path Event
 * Story branches based on player choices
 */
export function handleBranchingPath(
	player: PlayerData,
	event: ScriptedEvent,
	pathChoice: number
): { success: boolean, message: string, selectedPath?: string, pathFlag?: string } {
	if (!event.pathOptions || pathChoice >= event.pathOptions.length) {
		return { success: false, message: 'Invalid path choice.' };
	}

	const path = event.pathOptions[pathChoice];

	// Set the path flag
	if (path.pathFlag) {
		player.storyFlags.add(path.pathFlag);
	}

	// Clear other path flags if exclusive
	if (event.exclusivePaths) {
		for (const otherPath of event.pathOptions) {
			if (otherPath.pathFlag && otherPath.pathFlag !== path.pathFlag) {
				player.storyFlags.delete(otherPath.pathFlag);
			}
		}
	}

	return {
		success: true,
		message: path.description || 'Path chosen.',
		selectedPath: path.name,
		pathFlag: path.pathFlag,
	};
}

/**
 * Chapter Transition Event
 * Transition between story chapters
 */
export function handleChapterTransition(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, chapterNumber?: number, chapterTitle?: string } {
	if (!event.chapterNumber || !event.chapterTitle) {
		return { success: false, message: 'No chapter configured.' };
	}

	const chapterFlag = `chapter_${event.chapterNumber}_completed`;
	player.storyFlags.add(chapterFlag);

	return {
		success: true,
		message: `Chapter ${event.chapterNumber}: ${event.chapterTitle}`,
		chapterNumber: event.chapterNumber,
		chapterTitle: event.chapterTitle,
	};
}

/**
 * Epilogue Event
 * Show epilogue after main story
 */
export function handleEpilogue(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, epilogueText?: string, characters?: string[] } {
	if (!event.epilogueText) {
		return { success: false, message: 'No epilogue configured.' };
	}

	player.storyFlags.add('epilogue_viewed');

	return {
		success: true,
		message: 'The story concludes...',
		epilogueText: event.epilogueText,
		characters: event.epilogueCharacters,
	};
}

/**
 * Collectible Item Event
 * Find special collectible items (badges, medals, etc.)
 */
export function handleCollectibleItem(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, collectibleId?: string, category?: string } {
	if (!event.collectibleId || !event.collectibleCategory) {
		return { success: false, message: 'No collectible configured.' };
	}

	const collectibleFlag = `collectible_${event.collectibleCategory}_${event.collectibleId}`;
	if (player.storyFlags.has(collectibleFlag)) {
		return { success: false, message: 'You already have this collectible!' };
	}

	player.storyFlags.add(collectibleFlag);

	return {
		success: true,
		message: `You found a ${event.collectibleCategory}: ${event.collectibleId}!`,
		collectibleId: event.collectibleId,
		category: event.collectibleCategory,
	};
}

/**
 * Voice From Above Event
 * Mysterious voice gives guidance
 */
export function handleVoiceFromAbove(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, voiceText?: string } {
	if (!event.voiceText) {
		return { success: false, message: 'No voice configured.' };
	}

	return {
		success: true,
		message: 'A mysterious voice speaks...',
		voiceText: event.voiceText,
	};
}

/**
 * Memory Restoration Event
 * Player regains lost memories
 */
export function handleMemoryRestoration(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, memoryText?: string } {
	if (!event.memoryText) {
		return { success: false, message: 'No memory configured.' };
	}

	const memoryFlag = `memory_${eventId}_restored`;
	if (player.storyFlags.has(memoryFlag)) {
		return { success: false, message: 'You have already regained this memory!' };
	}

	player.storyFlags.add(memoryFlag);

	return {
		success: true,
		message: 'A forgotten memory returns to you...',
		memoryText: event.memoryText,
	};
}
