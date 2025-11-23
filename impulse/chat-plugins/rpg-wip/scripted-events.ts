import type { PlayerData, RPGPokemon, ScriptedEvent } from './interface';
import { Dex } from '../../../sim/dex';

function parseTimestampFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const timestamp = parts[parts.length - 1];
	return parseInt(timestamp) || 0;
}

function parseNumberFromFlag(flagStr: string): number {
	const parts = flagStr.split('_');
	const value = parts[parts.length - 1];
	return parseInt(value) || 0;
}

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

export function handleChoice(
	player: PlayerData,
	event: ScriptedEvent,
	choiceIndex: number
): { success: boolean, message: string, resultFlag?: string, resultDialogue?: string } {
	if (!event.choices || choiceIndex >= event.choices.length) {
		return { success: false, message: 'Invalid choice.' };
	}

	const choice = event.choices[choiceIndex];

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

export function handleEarthquake(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The ground shakes violently! An earthquake!',
	};
}

export function handleExplosion(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A massive explosion rocks the area!',
	};
}

export function handleFlood(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Water begins to flood the area!',
	};
}

export function handleMeteor(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A meteor streaks across the sky and crashes nearby!',
	};
}

export function handleEclipse(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The sky darkens as an eclipse begins...',
	};
}

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

	const swarmFlag = `swarm_${event.swarmSpecies}_active`;
	const duration = event.swarmDuration || 24;
	const expiryTime = Date.now() + (duration * 60 * 60 * 1000);
	player.storyFlags.add(`${swarmFlag}_${expiryTime}`);

	return {
		success: true,
		message: `A swarm of ${species.name} has appeared!`,
		swarmSpecies: event.swarmSpecies,
		duration,
	};
}

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

export function handleBranchingPath(
	player: PlayerData,
	event: ScriptedEvent,
	pathChoice: number
): { success: boolean, message: string, selectedPath?: string, pathFlag?: string } {
	if (!event.pathOptions || pathChoice >= event.pathOptions.length) {
		return { success: false, message: 'Invalid path choice.' };
	}

	const path = event.pathOptions[pathChoice];

	if (path.pathFlag) {
		player.storyFlags.add(path.pathFlag);
	}

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

export function handleGauntletBattle(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, currentBattle?: number, totalBattles?: number, opponents?: string[] } {
	if (!event.gauntletOpponents || event.gauntletOpponents.length === 0) {
		return { success: false, message: 'No gauntlet configured.' };
	}

	const gauntletFlag = `gauntlet_event_${eventId}_battle`;
	const battleStr = Array.from(player.storyFlags).find(f => f.startsWith(gauntletFlag));

	let currentBattle = 0;
	if (battleStr) {
		currentBattle = parseInt(battleStr.split('_').pop() || '0');
	}

	if (currentBattle >= event.gauntletOpponents.length) {
		return {
			success: false,
			message: 'Gauntlet complete!',
			currentBattle,
			totalBattles: event.gauntletOpponents.length,
		};
	}

	return {
		success: true,
		message: `Gauntlet Battle ${currentBattle + 1} of ${event.gauntletOpponents.length}`,
		currentBattle,
		totalBattles: event.gauntletOpponents.length,
		opponents: event.gauntletOpponents,
	};
}

export function advanceGauntletEvent(player: PlayerData, eventId: string): void {
	const gauntletFlag = `gauntlet_event_${eventId}_battle`;
	const battleStr = Array.from(player.storyFlags).find(f => f.startsWith(gauntletFlag));

	let currentBattle = 0;
	if (battleStr) {
		currentBattle = parseInt(battleStr.split('_').pop() || '0');
		player.storyFlags.delete(battleStr);
	}

	player.storyFlags.add(`${gauntletFlag}_${currentBattle + 1}`);
}

export function handleChampionDefense(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, challenger?: string, defensesSuccessful?: number } {
	if (!event.challengers || event.challengers.length === 0) {
		return { success: false, message: 'No challengers configured.' };
	}

	const defensesFlag = `champion_defenses_${eventId}`;
	const defensesStr = Array.from(player.storyFlags).find(f => f.startsWith(defensesFlag));

	let defenses = 0;
	if (defensesStr) {
		defenses = parseInt(defensesStr.split('_').pop() || '0');
	}

	const challengerIndex = Math.min(defenses, event.challengers.length - 1);
	const challenger = event.challengers[challengerIndex];

	return {
		success: true,
		message: `Title Defense #${defenses + 1}`,
		challenger,
		defensesSuccessful: defenses,
	};
}

export function recordChampionDefense(player: PlayerData, eventId: string): void {
	const defensesFlag = `champion_defenses_${eventId}`;
	const defensesStr = Array.from(player.storyFlags).find(f => f.startsWith(defensesFlag));

	let defenses = 0;
	if (defensesStr) {
		defenses = parseInt(defensesStr.split('_').pop() || '0');
		player.storyFlags.delete(defensesStr);
	}

	player.storyFlags.add(`${defensesFlag}_${defenses + 1}`);
}
