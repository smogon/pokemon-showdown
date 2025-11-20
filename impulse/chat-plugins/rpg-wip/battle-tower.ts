import { Dex, toID } from '../../../sim/dex';
import { FS } from '../../../lib';
import type { RPGPokemon, PlayerData, BattleState, ActivePokemonSlot } from './interface';
import { getMove, calculateStats, generateRandomTeam } from './utils';
import { createPokemon, activeBattles, getPlayerData } from './core';
import { createActivePokemonSlot } from './battle-shared';
import { teraToggleState } from './commands';

export interface BattleTowerFormatConfig {
	id: string;
	name: string;
	description: string;
	level: number;
	teamSize: number;
	teamGeneration: 'bss' | 'random' | 'baby';
}

export const BATTLE_TOWER_FORMATS: Record<string, BattleTowerFormatConfig> = {
	battlefactory: {
		id: 'battlefactory',
		name: 'Battle Factory',
		description: 'Random team of 3 Level 50 Pokémon with competitive sets',
		level: 50,
		teamSize: 3,
		teamGeneration: 'bss',
	},
	littlecup: {
		id: 'littlecup',
		name: 'Little Cup',
		description: 'Random team of LC-viable Pokémon at their specified levels',
		level: 5,
		teamSize: 3,
		teamGeneration: 'baby',
	},
};

interface BSSFactorySet {
	species: string;
	weight: number;
	moves: string[][];
	item: string[];
	nature: string;
	evs: {
		hp?: number,
		atk?: number,
		def?: number,
		spa?: number,
		spd?: number,
		spe?: number,
	};
	teraType: string[];
	ability: string[];
	wantsTera?: boolean;
}

interface BSSFactorySpecies {
	weight: number;
	sets: BSSFactorySet[];
}

interface BSSFactoryData {
	[speciesId: string]: BSSFactorySpecies;
}

let bssFactorySetsCache: BSSFactoryData | null = null;

function loadBSSFactorySets(): BSSFactoryData | null {
	if (bssFactorySetsCache) return bssFactorySetsCache;

	try {
		const json = FS('data/random-battles/gen9/bss-factory-sets.json').readIfExistsSync();
		if (!json) {
			console.error('[RPG Battle Tower] BSS Factory Sets file not found');
			return null;
		}
		bssFactorySetsCache = JSON.parse(json);
		return bssFactorySetsCache;
	} catch (e: any) {
		console.error('[RPG Battle Tower] Error loading BSS Factory Sets:', e);
		return null;
	}
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let random = Math.random() * totalWeight;

	for (const item of items) {
		random -= item.weight;
		if (random <= 0) return item;
	}

	return items[items.length - 1];
}

export function generateRandomTeamFromBSS(count: number, level: number): RPGPokemon[] {
	const bssData = loadBSSFactorySets();

	if (!bssData) {
		console.log('[RPG Battle Tower] BSS Factory Sets not available, falling back to random generation');
		return generateRandomTeam(count, level);
	}

	const team: RPGPokemon[] = [];
	const speciesEntries = Object.entries(bssData);

	if (speciesEntries.length === 0) {
		console.error('[RPG Battle Tower] BSS Factory Sets is empty');
		return generateRandomTeam(count, level);
	}

	const usedSpecies = new Set<string>();

	while (team.length < count) {
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			usedSpecies.clear();
		}

		const speciesWeights = availableSpecies.map(([_, data]) => ({
			entry: _,
			weight: data.weight,
		}));

		const selectedSpecies = weightedRandom(speciesWeights);
		const [speciesId, speciesData] = availableSpecies.find(([id]) => id === selectedSpecies.entry)!;

		const selectedSet = weightedRandom(speciesData.sets);

		const pokemon = createPokemon(speciesId, level);

		pokemon.evs = {
			hp: selectedSet.evs.hp || 0,
			atk: selectedSet.evs.atk || 0,
			def: selectedSet.evs.def || 0,
			spa: selectedSet.evs.spa || 0,
			spd: selectedSet.evs.spd || 0,
			spe: selectedSet.evs.spe || 0,
		};

		pokemon.nature = selectedSet.nature;

		if (selectedSet.ability.length > 0) {
			pokemon.ability = selectedSet.ability[Math.floor(Math.random() * selectedSet.ability.length)];
		}

		if (selectedSet.item.length > 0) {
			const randomItem = selectedSet.item[Math.floor(Math.random() * selectedSet.item.length)];
			pokemon.item = randomItem.toLowerCase().replace(/[^a-z0-9]/g, '');
		}

		const moves: { id: string, pp: number }[] = [];
		for (const moveSlot of selectedSet.moves) {
			if (moveSlot.length > 0) {
				const shuffledMoves = [...moveSlot].sort(() => Math.random() - 0.5);
				let addedMove = false;
				for (const moveOption of shuffledMoves) {
					const moveId = toID(moveOption);
					const moveData = getMove(moveId);
					if (moveData?.exists) {
						moves.push({ id: moveId, pp: moveData.pp || 10 });
						addedMove = true;
						break;
					}
				}

				if (!addedMove) {
					const tackle = getMove('tackle');
					moves.push({ id: 'tackle', pp: tackle.pp || 35 });
				}
			}
		}

		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		if (selectedSet.teraType.length > 0) {
			pokemon.teraType = selectedSet.teraType[Math.floor(Math.random() * selectedSet.teraType.length)];
		}

		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}

interface BabySet {
	role: string;
	movepool: string[];
	abilities: string[];
	teraTypes: string[];
}

interface BabySpecies {
	level: number;
	sets: BabySet[];
}

interface BabyData {
	[speciesId: string]: BabySpecies;
}

let babySetsCache: BabyData | null = null;

function loadBabySets(): BabyData | null {
	if (babySetsCache) return babySetsCache;

	try {
		const json = FS('data/random-battles/gen9baby/sets.json').readIfExistsSync();
		if (!json) {
			console.error('[RPG Battle Tower] Gen9 Baby Sets file not found');
			return null;
		}
		babySetsCache = JSON.parse(json);
		return babySetsCache;
	} catch (e: any) {
		console.error('[RPG Battle Tower] Error loading Gen9 Baby Sets:', e);
		return null;
	}
}

export function generateRandomTeamFromBaby(count: number): RPGPokemon[] {
	const babyData = loadBabySets();

	if (!babyData) {
		console.log('[RPG Battle Tower] Gen9 Baby Sets not available, falling back to random generation');
		return generateRandomTeam(count, 5);
	}

	const team: RPGPokemon[] = [];
	const speciesEntries = Object.entries(babyData);

	if (speciesEntries.length === 0) {
		console.error('[RPG Battle Tower] Gen9 Baby Sets is empty');
		return generateRandomTeam(count, 5);
	}

	const usedSpecies = new Set<string>();

	while (team.length < count) {
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			usedSpecies.clear();
		}

		const [speciesId, speciesData] = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

		const selectedSet = speciesData.sets[Math.floor(Math.random() * speciesData.sets.length)];

		const pokemon = createPokemon(speciesId, speciesData.level);

		if (selectedSet.abilities.length > 0) {
			pokemon.ability = selectedSet.abilities[Math.floor(Math.random() * selectedSet.abilities.length)];
		}

		const moves: { id: string, pp: number }[] = [];
		const movepool = [...selectedSet.movepool];

		while (moves.length < 4 && movepool.length > 0) {
			const randomIndex = Math.floor(Math.random() * movepool.length);
			const selectedMove = movepool.splice(randomIndex, 1)[0];
			const moveId = toID(selectedMove);
			const moveData = getMove(moveId);
			if (moveData?.exists) {
				moves.push({ id: moveId, pp: moveData.pp || 10 });
			}
		}

		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		if (selectedSet.teraTypes.length > 0) {
			pokemon.teraType = selectedSet.teraTypes[Math.floor(Math.random() * selectedSet.teraTypes.length)];
		}

		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}

// Battle Tower floor management and HTML generation
export function getLocationWeatherData(player: PlayerData): {
	weather: BattleState['weather'],
	locationWeather: BattleState['locationWeather'],
} {
// Import LOCATIONS dynamically to avoid circular dependency
const { LOCATIONS } = require('./locations');
const locationId = toID(player.location);
const location = LOCATIONS[locationId];

if (!location?.weather) {
return { weather: undefined, locationWeather: undefined };
}

const weatherMap: Record<string, 'sun' | 'rain' | 'sand' | 'hail'> = {
'sun': 'sun',
'rain': 'rain',
'sandstorm': 'sand',
'hail': 'hail',
};

const battleWeatherType = weatherMap[location.weather];
if (!battleWeatherType) {
return { weather: undefined, locationWeather: undefined };
}

return {
weather: {
type: battleWeatherType,
turns: 9999,
},
locationWeather: {
type: battleWeatherType,
},
};
}

export function getWeatherStartMessage(weatherType: 'sun' | 'rain' | 'sand' | 'hail'): string {
const weatherStartMessages: Record<string, string> = {
'sun': 'The sunlight is strong.',
'rain': 'It started to rain!',
'sand': 'A sandstorm is raging!',
'hail': 'It started to hail!',
};
return weatherStartMessages[weatherType];
}

export function startBattleTowerFloor(
player: PlayerData,
floor: number,
context: CommandContext,
room: ChatRoom,
user: User,
format = 'battlefactory'
) {
// Import dynamically to avoid circular dependency
const { generateBattleHTML } = require('./html');
const { applyHazardEffectsOnSwitchIn } = require('./battle-flow');

const formatConfig = BATTLE_TOWER_FORMATS[format] || BATTLE_TOWER_FORMATS['battlefactory'];
const level = formatConfig.level;
const teamSize = formatConfig.teamSize;

const battleMessages: string[] = [];
const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

try {
let playerTeam: RPGPokemon[];
let aiTeam: RPGPokemon[];

if (formatConfig.teamGeneration === 'bss') {
playerTeam = generateRandomTeamFromBSS(teamSize, level);
aiTeam = generateRandomTeamFromBSS(teamSize, level);
} else if (formatConfig.teamGeneration === 'baby') {
playerTeam = generateRandomTeamFromBaby(teamSize);
aiTeam = generateRandomTeamFromBaby(teamSize);
} else {
playerTeam = generateRandomTeam(teamSize, level);
aiTeam = generateRandomTeam(teamSize, level);
}

playerSlots[0] = createActivePokemonSlot(playerTeam[0]);
opponentSlots[0] = createActivePokemonSlot(aiTeam[0]);

battleMessages.push(`<b>Battle Tower - Floor ${floor}</b>`);
battleMessages.push(`Your random team for this floor is: ${playerTeam.map(p => p.species).join(', ')}.`);

const locationWeatherData = getLocationWeatherData(player);
if (locationWeatherData.weather) {
battleMessages.push(getWeatherStartMessage(locationWeatherData.weather.type));
}

const battle: BattleState = {
battleType: 'battletower',
floor,
overridePlayerParty: playerTeam,
battleTowerFormat: format,
opponentName: `Battle Tower Trainer`,
opponentParty: aiTeam,
opponentMoney: 500 * floor,
playerSlots,
opponentSlots,
pendingActions: {},
playerId: user.id,
turn: 0,
zoneId: 'battletower',
playerHazards: [],
opponentHazards: [],
weather: locationWeatherData.weather,
locationWeather: locationWeatherData.locationWeather,
trickRoomTurns: 0,
magicRoomTurns: 0,
wonderRoomTurns: 0,
terrain: undefined,
playerShouldSwitch: undefined,
pendingPivot: undefined,
aiPendingPivot: undefined,
forceEnd: false,
playerTerastallizeUsed: false,
opponentTerastallizeUsed: false,
playerQuickGuard: false,
opponentQuickGuard: false,
playerWideGuard: false,
opponentWideGuard: false,
playerCraftyShield: false,
opponentCraftyShield: false,
playerReflectTurns: 0,
opponentReflectTurns: 0,
playerLightScreenTurns: 0,
opponentLightScreenTurns: 0,
playerAuroraVeilTurns: 0,
opponentAuroraVeilTurns: 0,
gravityTurns: 0,
mudSportTurns: 0,
waterSportTurns: 0,
fairyLockTurns: 0,
ionDelugeTurns: 0,
playerFutureMoves: [],
opponentFutureMoves: [],
battleLog: [],
};

if (playerSlots[0]) {
applyHazardEffectsOnSwitchIn(playerSlots[0], battle, true, battleMessages);
}
if (opponentSlots[0]) {
applyHazardEffectsOnSwitchIn(opponentSlots[0], battle, false, battleMessages);
}

activeBattles.set(user.id, battle);
battle.battleLog.push(...battleMessages);

context.sendReply(
`|uhtml|rpg-${user.id}|${generateBattleHTML(battle, [], undefined, teraToggleState.get(user.id))}`
);
} catch (error) {
console.error(error);
context.errorReply(`Error starting Battle Tower floor: ${error}`);
}
}

// Battle Tower HTML generation functions
export function generateBattleTowerWelcomeHTML(floor: number): string {
let html = `<div class="rpg-infobox"><h2>🗼 Battle Tower</h2>` +
`<div class="rpg-memo-box" style="margin-bottom:15px;">` +
`<p><strong>Roguelike Challenge</strong></p>` +
`<p>Climb as high as you can. Your team is re-rolled every floor.</p>` +
`</div>` +
`<h3>Select Format</h3>` +
`<div class="rpg-scrollable-grid"><div class="rpg-grid-2col">`;

for (const [formatId, config] of Object.entries(BATTLE_TOWER_FORMATS)) {
html += `<button name="send" value="/rpg battletower selectformat ${toID(formatId)}" ` +
`class="button" style="height:auto; padding:10px; text-align:left;">` +
`<strong>${config.name}</strong><br>` +
`<small class="rpg-text-muted">${config.description}</small>` +
`</button>`;
}

html += `</div></div>` +
`<p style="text-align:center"><button name="send" value="/rpg start" class="button">` +
`Back to Menu</button></p>` +
`</div>`;
return html;
}

export function generateBattleTowerFormatSelectedHTML(floor: number, format: string): string {
const formatConfig = BATTLE_TOWER_FORMATS[format] || BATTLE_TOWER_FORMATS['battlefactory'];
const btnText = floor > 1 ? `Continue Floor ${floor}` : `Start Floor 1`;

return `<div class="rpg-infobox"><h2>🗼 ${formatConfig.name}</h2>` +
`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
`<p>Team Size: <strong>${formatConfig.teamSize}</strong> | Level: <strong>${formatConfig.level}</strong></p>` +
`<p>Current Streak: <strong>${floor - 1} Wins</strong></p>` +
`</div>` +
`<p style="text-align:center">` +
`<button name="send" value="/rpg battletower beginfloor ${toID(format)}" ` +
`class="button rpg-button-large">${btnText}</button>` +
`</p>` +
`<p style="text-align:center"><button name="send" value="/rpg battletower start" ` +
`class="button">Back</button></p>` +
`</div>`;
}

export function generateBattleTowerFloorCompleteHTML(floor: number): string {
return `<div class="rpg-infobox"><h2>🗼 Floor ${floor} Cleared!</h2>` +
`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
`<p class="rpg-text-success"><strong>Victory!</strong></p>` +
`<p>Your team has been healed.</p>` +
`<p>Preparing new team for the next floor...</p>` +
`</div>` +
`<p style="text-align:center">` +
`<button name="send" value="/rpg battletower nextfloor" class="button">` +
`Next Floor (F${floor + 1}) →</button>` +
`</p>` +
`</div>`;
}

export function generateBattleTowerLossHTML(floor: number): string {
return `<div class="rpg-infobox"><h2>�� Challenge Failed</h2>` +
`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
`<p class="rpg-text-error"><strong>You were defeated.</strong></p>` +
`<p>You reached <strong>Floor ${floor}</strong>.</p>` +
`</div>` +
`<p style="text-align:center">` +
`<button name="send" value="/rpg battletower start" class="button">Try Again</button> ` +
`<button name="send" value="/rpg start" class="button">Exit</button>` +
`</p>` +
`</div>`;
}
