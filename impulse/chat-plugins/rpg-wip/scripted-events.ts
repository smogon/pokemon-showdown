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

export function handleMinigame(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Minigame started! (Implementation specific to minigame type)',
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

export function handleTimeWarp(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Time itself seems to distort around you...',
	};
}

export function handleDimensionRift(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A rift in reality tears open before you!',
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

export function handleContest(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string, score?: number } {
	if (!event.contestType) {
		return { success: false, message: 'No contest type specified.' };
	}

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

	score = Math.floor(score / 10);

	return {
		success: true,
		message: `${pokemon.nickname} performed in the ${contestType} contest!`,
		score,
	};
}

export function handleRace(
	player: PlayerData,
	event: ScriptedEvent,
	pokemon: RPGPokemon
): { success: boolean, message: string, time?: number, won?: boolean } {
	const time = Math.max(10, 100 - pokemon.spe);
	const won = time < 50;

	return {
		success: true,
		message: won ?
			`${pokemon.nickname} finished the race in ${time} seconds! Victory!` :
			`${pokemon.nickname} finished the race in ${time} seconds. Not quite fast enough...`,
		time,
		won,
	};
}

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

export function markScavengerItemFound(player: PlayerData, eventId: string, itemIndex: number): void {
	const huntFlag = `scavengerhunt_${eventId}_found_${itemIndex}`;
	player.storyFlags.add(huntFlag);
}

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

export function markClueFound(player: PlayerData, eventId: string, clueIndex: number): void {
	const invFlag = `investigation_${eventId}_clue_${clueIndex}`;
	player.storyFlags.add(invFlag);
}

export function handleStealth(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Stealth mission started! Stay hidden...',
	};
}

export function handleEscape(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Quick! You must escape!',
	};
}

export function handleRescue(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A rescue mission! Someone needs help!',
	};
}

export function handleDefense(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Defend this location from attackers!',
	};
}

export function handleAmbush(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'You\'ve been ambushed!',
	};
}

export function handleBetrayal(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A shocking betrayal!',
	};
}

export function handleAlliance(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An alliance has been formed!',
	};
}

export function handleNegotiation(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'Begin negotiations...',
	};
}

export function handleDiscovery(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'You\'ve made an important discovery!',
	};
}

export function handleRevelation(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A shocking revelation!',
	};
}

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

export function handleAncientSeal(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An ancient seal begins to glow with power!',
	};
}

export function handlePortalOpening(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'A mysterious portal opens before you!',
	};
}

export function handleDimensionMerge(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'The fabric of reality begins to merge with another dimension!',
	};
}

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

export function handleProphecy(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string } {
	return {
		success: true,
		message: 'An ancient prophecy speaks of events to come...',
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

export function handleMoralChoice(
	player: PlayerData,
	event: ScriptedEvent,
	choiceIndex: number
): { success: boolean, message: string, karmaChange?: number, alignment?: string } {
	if (!event.moralChoices || choiceIndex >= event.moralChoices.length) {
		return { success: false, message: 'Invalid moral choice.' };
	}

	const choice = event.moralChoices[choiceIndex];

	const karmaFlag = 'player_karma_points';
	const karmaStr = Array.from(player.storyFlags).find(f => f.startsWith(karmaFlag));

	let currentKarma = 0;
	if (karmaStr) {
		currentKarma = parseInt(karmaStr.split('_').pop() || '0');
		player.storyFlags.delete(karmaStr);
	}

	currentKarma += choice.karmaChange || 0;
	player.storyFlags.add(`${karmaFlag}_${currentKarma}`);

	let alignment = 'Neutral';
	if (currentKarma >= 50) alignment = 'Hero';
	else if (currentKarma >= 20) alignment = 'Good';
	else if (currentKarma <= -50) alignment = 'Villain';
	else if (currentKarma <= -20) alignment = 'Evil';

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

export function handleHordeBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, hordeSpecies?: string[], hordeSize?: number } {
	if (!event.hordeSpecies || event.hordeSpecies.length === 0) {
		return { success: false, message: 'No horde configured.' };
	}

	const hordeSize = event.hordeSize || event.hordeSpecies.length;

	return {
		success: true,
		message: `A horde of ${hordeSize} Pokemon appears!`,
		hordeSpecies: event.hordeSpecies,
		hordeSize,
	};
}

export function handleInverseBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, trainerId?: string } {
	if (!event.trainerId) {
		return { success: false, message: 'No inverse battle configured.' };
	}

	return {
		success: true,
		message: 'The battlefield distorts! Type effectiveness is reversed!',
		trainerId: event.trainerId,
	};
}

export function handleRotationBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, trainerId?: string, rotationSlots?: number } {
	if (!event.trainerId) {
		return { success: false, message: 'No rotation battle configured.' };
	}

	return {
		success: true,
		message: 'A rotation battle begins!',
		trainerId: event.trainerId,
		rotationSlots: event.rotationSlots || 3,
	};
}

export function handleBattleRoyale(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, opponentIds?: string[] } {
	if (!event.opponentIds || event.opponentIds.length < 2) {
		return { success: false, message: 'Not enough opponents for battle royale.' };
	}

	return {
		success: true,
		message: 'A battle royale begins! Last one standing wins!',
		opponentIds: event.opponentIds,
	};
}

export function handleTripleBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, trainerId?: string } {
	if (!event.trainerId) {
		return { success: false, message: 'No triple battle configured.' };
	}

	return {
		success: true,
		message: 'A triple battle begins! Three Pokemon battle at once!',
		trainerId: event.trainerId,
	};
}

export function handleSkyBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, trainerId?: string } {
	if (!event.trainerId) {
		return { success: false, message: 'No sky battle configured.' };
	}

	return {
		success: true,
		message: 'A sky battle! Only Flying-type Pokemon or those with Levitate can participate!',
		trainerId: event.trainerId,
	};
}

export function handleUnderwaterBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, trainerId?: string } {
	if (!event.trainerId) {
		return { success: false, message: 'No underwater battle configured.' };
	}

	return {
		success: true,
		message: 'An underwater battle! Only Water-type Pokemon can participate!',
		trainerId: event.trainerId,
	};
}

export function handleRaidBattle(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, raidBoss?: any, raidLevel?: number } {
	if (!event.raidBoss) {
		return { success: false, message: 'No boss Pokemon configured.' };
	}

	return {
		success: true,
		message: `A powerful ${event.raidLevel || 5}-star boss appears!`,
		raidBoss: event.raidBoss,
		raidLevel: event.raidLevel,
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

export function handleBattleTest(
	player: PlayerData,
	event: ScriptedEvent
): { success: boolean, message: string, testType?: string, requirements?: string[] } {
	if (!event.testType) {
		return { success: false, message: 'No battle test configured.' };
	}

	const testDescriptions: Record<string, string> = {
		'survival': 'Survive for 10 turns',
		'damage': 'Deal 500+ damage in one turn',
		'speed': 'Win in under 5 turns',
		'type_advantage': 'Win using type advantage only',
		'no_damage': 'Win without taking damage',
		'status_only': 'Win using status moves only',
	};

	return {
		success: true,
		message: `Battle Test: ${testDescriptions[event.testType] || event.testType}`,
		testType: event.testType,
		requirements: event.testRequirements,
	};
}

export function handleWarBattle(
	player: PlayerData,
	event: ScriptedEvent,
	eventId: string
): { success: boolean, message: string, currentWave?: number, totalWaves?: number } {
	if (!event.warWaves || event.warWaves.length === 0) {
		return { success: false, message: 'No war battle configured.' };
	}

	const waveFlag = `war_${eventId}_wave`;
	const waveStr = Array.from(player.storyFlags).find(f => f.startsWith(waveFlag));

	let currentWave = 0;
	if (waveStr) {
		currentWave = parseInt(waveStr.split('_').pop() || '0');
	}

	if (currentWave >= event.warWaves.length) {
		return {
			success: false,
			message: 'War battle complete! Victory achieved!',
			currentWave,
			totalWaves: event.warWaves.length,
		};
	}

	return {
		success: true,
		message: `Wave ${currentWave + 1} of ${event.warWaves.length}`,
		currentWave,
		totalWaves: event.warWaves.length,
	};
}

export function advanceWarWave(player: PlayerData, eventId: string): void {
	const waveFlag = `war_${eventId}_wave`;
	const waveStr = Array.from(player.storyFlags).find(f => f.startsWith(waveFlag));

	let currentWave = 0;
	if (waveStr) {
		currentWave = parseInt(waveStr.split('_').pop() || '0');
		player.storyFlags.delete(waveStr);
	}

	player.storyFlags.add(`${waveFlag}_${currentWave + 1}`);
}
