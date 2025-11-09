/*
 * Pokemon Showdown
 * RPG Commands
 *
 * This is the "Controller" layer. It handles user input and calls
 * functions from core, battle-engine, items, and html.
 */
import { Dex, toID } from '../../../sim/dex';
import { RPGAbilities } from './abilities';
import { getMove, checkEvolution, handleLearningMoves, getActiveSlots } from './utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState, NPCData } from './interface';
import {
	addItemToInventory,
	removeItemFromInventory,
	useSacredAsh,
	useRevivalItem,
	useHealingItem,
	useVitaminItem,
	useRareCandyItem,
	useExpCandyItem,
	ITEMS_DATABASE,
	ITEM_PRICES,
} from './items';
import { getShopInventory, getNextShopTier } from './shop';
import {
	getPlayerData,
	createPokemon,
	activeBattles,
	storePokemonInPC,
	withdrawPokemonFromPC,
	playerData,
	getInitialMoves,
	savePlayerToString,
	loadPlayer,
} from './core';
import {
	createActivePokemonSlot,
	validateMoveAction,
	processTurn,
	checkTrappingAbility,
	saveBattleStatus,
	performCatchAttempt,
	getSlotFromIndex,
	applyHazardEffectsOnSwitchIn,
	handleMirrorHerb,
} from './battle-engine';
import {
	generateMenuHTML,
	generateProfileHTML,
	generateBuyHTML,
	generateSellMenuHTML,
	generateSellConfirmHTML,
	generateExploreHTML,
	generateRunHTML,
	generateHealHTML,
	generateResetHTML,
	generateUnstuckHTML,
	generatePokemonInfoHTML,
	generateBattleHTML,
	generateWelcomeHTML,
	generateRPGModeSelectionHTML,
	generateStoryModeStartHTML,
	generateStarterSelectionHTML,
	generatePokemonSummaryHTML,
	generateEggMoveSelectionHTML,
	generateInventoryHTML,
	generateShopHTML,
	generatePCHTML,
	generateCatchMenuHTML,
	generateCatchTargetHTML,
	generateSwitchMenuHTML,
	generateMoveLearnHTML,
	generateGiveItemPokemonSelectionHTML,
	generateFaintSwitchHTML,
	generateBottomNavigation,
} from './html';
import {
	STARTER_POKEMON,
	TYPE_CHART,
} from './data';
import { LOCATIONS, ENCOUNTER_ZONES, getStartingLocation } from './locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS } from './trainers';
import { STORY_EVENTS } from './story-events';
import { NPC_DATABASE } from './npcs';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import * as NPCActions from './npc-actions';
import * as ScriptedEvents from './scripted-events';

/**
 * Get the initial weather for a battle based on the player's location
 * Converts location weather format to battle weather format
 * Returns both the active weather and the location weather type for restoration
 */
function getLocationWeatherData(player: PlayerData): {
	weather: BattleState['weather'],
	locationWeather: BattleState['locationWeather'],
} {
	const locationId = toID(player.location);
	const location = LOCATIONS[locationId];

	if (!location?.weather) {
		return { weather: undefined, locationWeather: undefined };
	}

	// Convert location weather to battle weather format
	// Exclude 'fog' as per requirements
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

	// Return weather with very high turn count (9999) for permanent location weather
	// This effectively makes it permanent since battles rarely last that long
	// Also return locationWeather for restoration after temporary weather expires
	return {
		weather: {
			type: battleWeatherType,
			turns: 9999, // Very high number for permanent location-based weather
		},
		locationWeather: {
			type: battleWeatherType,
		},
	};
}

/**
 * Get the weather message for the start of a battle based on weather type
 */
function getWeatherStartMessage(weatherType: 'sun' | 'rain' | 'sand' | 'hail'): string {
	const weatherStartMessages: Record<string, string> = {
		'sun': 'The sunlight is strong.',
		'rain': 'It started to rain!',
		'sand': 'A sandstorm is raging!',
		'hail': 'It started to hail!',
	};
	return weatherStartMessages[weatherType];
}

export const commands: ChatCommands = {
	rpg: {
		start(target, room, user) {
			const player = getPlayerData(user.id);
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}

			// Returning players: send to their last location
			if (player.party.length > 0) {
				return this.parse('/rpg explore');
			}

			// New players: show welcome screen
			this.sendReply(`|uhtml|rpg-${user.id}|${generateWelcomeHTML()}`);
		},

		continue(target, room, user) {
			// Continue now redirects to start which handles the flow
			return this.parse('/rpg start');
		},

		storymode(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You have already started your adventure!");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStoryModeStartHTML()}`);
		},

		choosestarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const type = target.trim().toLowerCase();
			const starters = STARTER_POKEMON[type as keyof typeof STARTER_POKEMON];
			if (!starters) {
				return this.errorReply("Invalid type. Choose 'fire', 'water', or 'grass'.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterSelectionHTML(type, starters)}`);
		},

		selectstarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const starterId = toID(target);
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You already have a starter Pokémon!");
			}
			if (!Object.values(STARTER_POKEMON).flat().includes(starterId)) {
				return this.errorReply("Invalid starter Pokémon.");
			}
			try {
				const starterPokemon = createPokemon(starterId, 5);
				player.party.push(starterPokemon);
				player.name = user.name;
				const startingLocation = getStartingLocation();
				player.location = startingLocation.name;
				const species = Dex.species.get(starterId);

				const tempSlot = createActivePokemonSlot(starterPokemon);

				const confirmHTML = `<div class="infobox">` +
					`<h2>Congratulations!</h2>` +
					`<p><strong>Professor Oak:</strong> "Excellent choice! <strong>${species.name}</strong> will be a great partner for you."</p>` +
					`${generatePokemonInfoHTML(tempSlot, true)}` +
					`<p>"Your adventure begins now. Remember, the bond between a trainer and their Pokémon is special. Take good care of ${species.name}!"</p>` +
					`<p>"Now, head out into ${startingLocation.name} and begin your journey. Good luck!"</p>` +
					`<hr />` +
					`<p><button name="send" value="/rpg explore" class="button">Begin Your Adventure</button></p>` +
					generateBottomNavigation() +
					`</div>`;

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter Pokémon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokémon: ${error}`);
			}
		},

		menu(target, room, user) {
			// Menu command is removed - redirect to explore which is the new main hub
			return this.parse('/rpg explore');
		},

		learnmove(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}
			const player = getPlayerData(user.id);
			const queue = player.pendingMoveLearnQueue;
			if (!queue || queue.moveIds.length === 0) {
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const pokemon = player.party.find(p => p.id === queue.pokemonId);
			if (!pokemon) {
				delete player.pendingMoveLearnQueue;
				return this.errorReply("Error: Pokemon not found.");
			}
			const newMoveId = queue.moveIds[0];
			const newMoveData = getMove(newMoveId);

			const newMoveName = newMoveData.name;
			const moveToReplace = toID(target);
			let message = "";
			if (moveToReplace === 'skip') {
				message = `<strong>${pokemon.species}</strong> did not learn <strong>${newMoveName}</strong>.`;
			} else {
				const moveIndex = pokemon.moves.findIndex(m => m.id === moveToReplace);
				if (moveIndex === -1) {
					return this.errorReply("That move is not known by your Pokemon.");
				}
				const oldMoveName = getMove(pokemon.moves[moveIndex].id).name;
				pokemon.moves[moveIndex] = { id: newMoveId, pp: newMoveData.pp || 5 };
				message = `1, 2, and... Poof! <strong>${pokemon.species}</strong> forgot <strong>${oldMoveName}</strong> and learned <strong>${newMoveName}</strong>!`;
			}
			queue.moveIds.shift();
			if (queue.moveIds.length > 0) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			} else {
				delete player.pendingMoveLearnQueue;
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learning Result</h2><p>${message}</p>${generatePokemonInfoHTML(tempSlot, true)}${generateBottomNavigation()}</div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			}
		},

		learneggmove(target, room, user) {
			const player = getPlayerData(user.id);

			const parts = target.split(' ');
			if (parts.length < 2) {
				return this.errorReply("Invalid command parameters.");
			}
			const pokemonId = parts[0];
			const rawMoveId = parts.slice(1).join(' '); // This correctly becomes "magical leaf"

			if (!pokemonId || !rawMoveId) {
				return this.errorReply("Invalid command parameters.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			const speciesId = toID(pokemon.species);
			const eggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];

			// This check will now correctly use "magical leaf"
			if (!eggMoves.includes(rawMoveId)) {
				return this.errorReply("This is not a valid Egg Move for this Pokemon.");
			}
			if (!removeItemFromInventory(player, 'eggmovetutor', 1)) {
				// This is a safety check in case the player somehow lost the item after initiating the command
				return this.errorReply("Could not use the Egg Move Tutor. Item not found in inventory.");
			}

			const newMoveId = toID(rawMoveId); // Converts "magical leaf" to "magicalleaf"

			if (pokemon.moves.length < 4) {
				const newMoveData = getMove(newMoveId);
				pokemon.moves.push({ id: newMoveId, pp: newMoveData.pp || 5 });
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learned!</h2><p><strong>${pokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!</p>${generatePokemonInfoHTML(tempSlot)}<p><[...]
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			} else {
				player.pendingMoveLearnQueue = { pokemonId: pokemon.id, moveIds: [newMoveId] };
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
			}
		},

		summary(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view a summary during battle.");
			}
			const player = getPlayerData(user.id);
			const targetId = target.trim();
			if (!targetId) {
				let html = `<div class="infobox"><h2>Select a Pokémon</h2><p>Choose a Pokémon to view its summary:</p>`;
				if (player.party.length === 0) {
					html += '<p>You have no Pokémon.</p>';
				} else {
					player.party.forEach(p => {
						html += `<button name="send" value="/rpg summary ${p.id}" class="button" style="margin: 3px;">${p.species}</button> `;
					});
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">← Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}
			const pokemon = player.party.find(p => p.id === targetId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePokemonSummaryHTML(pokemon)}`);
		},

		profile(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);

			// Badge display
			let badgeHTML = '';
			if (player.obtainedBadges.length > 0) {
				badgeHTML = `<p><strong>Gym Badges:</strong></p><p>`;
				for (const badge of player.obtainedBadges) {
					badgeHTML += `🏆 ${badge} `;
				}
				badgeHTML += `</p>`;
			} else {
				badgeHTML = `<p><strong>Gym Badges:</strong> None yet</p>`;
			}

			// Story progress
			let progressHTML = '<p><strong>Progress:</strong> ';
			if (player.storyFlags.has('champion')) {
				progressHTML += 'Champion! 🏆</p>';
			} else if (player.storyFlags.has('all_badges')) {
				progressHTML += 'Ready for Elite Four</p>';
			} else if (player.badges >= 4) {
				progressHTML += `${player.badges}/8 Badges - Halfway there!</p>`;
			} else if (player.badges > 0) {
				progressHTML += `${player.badges}/8 Badges - On your journey</p>`;
			} else {
				progressHTML += 'Just starting out</p>';
			}

			const profileHTML = `<div class="infobox"><h2>Player Profile</h2>` +
				`<p><strong>Trainer:</strong> ${player.name}</p>` +
				`<p><strong>Level:</strong> ${player.level}</p>` +
				`<p><strong>Location:</strong> ${player.location}</p>` +
				`${badgeHTML}` +
				`${progressHTML}` +
				`<p><strong>Pokemon in Party:</strong> ${player.party.length}/6</p>` +
				`<p><strong>Pokemon in PC:</strong> ${player.pc.size}</p>` +
				`<p><strong>Money:</strong> ₽${player.money}</p>` +
				`<p><strong>Trainers Defeated:</strong> ${player.defeatedTrainers.size}</p>` +
				generateBottomNavigation() +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${profileHTML}`);
		},

		party(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view your party during a battle.");
			}
			const player = getPlayerData(user.id);
			let partyHTML = `<div class="infobox"><h2>Your Party</h2>`;
			if (player.party.length === 0) {
				partyHTML += `<p>No Pokemon in party.</p>`;
			} else {
				for (let i = 0; i < 6; i++) {
					if (player.party[i]) {
						// We pass the slot info directly to the HTML generator
						// and no longer wrap it in an extra <div>
						const tempSlot = createActivePokemonSlot(player.party[i]);
						partyHTML += generatePokemonInfoHTML(tempSlot, true, true, { index: i, partyLength: player.party.length });
					} else {
						partyHTML += `<p><strong>Slot ${i + 1}:</strong> Empty</p>`;
					}
				}
			}
			partyHTML += `${generateBottomNavigation()}`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${partyHTML}`);
		},

		swapslot(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot swap party slots during a battle.");
			}
			const [slot1Str, slot2Str] = target.split(' ');
			const slot1 = parseInt(slot1Str);
			const slot2 = parseInt(slot2Str);

			if (isNaN(slot1) || isNaN(slot2)) {
				return this.errorReply("Invalid slot numbers. Usage: /rpg swapslot <slot1> <slot2>");
			}

			const player = getPlayerData(user.id);

			if (slot1 < 0 || slot1 >= player.party.length || slot2 < 0 || slot2 >= player.party.length) {
				return this.errorReply("Invalid slot numbers. Slots must be within your party.");
			}

			if (slot1 === slot2) {
				return this.errorReply("Cannot swap a slot with itself.");
			}

			// Swap the Pokemon in the party array
			const temp = player.party[slot1];
			player.party[slot1] = player.party[slot2];
			player.party[slot2] = temp;

			// Show updated party
			this.parse('/rpg party');
		},

		items(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access your bag in battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'berry', 'tm', 'key', 'held', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateInventoryHTML(player, filterCategory)}`);
		},

		useitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use items from the menu during a battle.");
			}
			const [itemId, pokemonId] = target.split(' ').map(arg => toID(arg));
			const player = getPlayerData(user.id);

			if (!itemId) return this.errorReply("Please specify an item to use.");
			if (!player.inventory.has(itemId)) return this.errorReply("You don't have that item.");

			const item = player.inventory.get(itemId)!;

			if (item.category === 'medicine') {
				// Special handling for Sacred Ash (affects all Pokemon)
				if (itemId === 'sacredash') {
					const result = useSacredAsh(player);
					if (!result.success) {
						const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></d[...]