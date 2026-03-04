import type { PlayerData, RPGPokemon, ScriptedEvent } from './interface';
import { Dex } from '../../../sim/dex';

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
