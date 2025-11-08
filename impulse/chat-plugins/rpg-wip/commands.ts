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
import type { RPGPokemon, ActivePokemonSlot, PlayerData, BattleState } from './interface';
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
} from './html';
import {
	STARTER_POKEMON,
	TYPE_CHART,
} from './data';
import { LOCATIONS, ENCOUNTER_ZONES } from './locations';
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
			if (player.party.length > 0) {
				return this.parse('/rpg menu');
			}
			this.sendReply(`|uhtml|rpg-${user.id}|${generateWelcomeHTML()}`);
		},

		continue(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.parse('/rpg menu');
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateRPGModeSelectionHTML()}`);
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
				const species = Dex.species.get(starterId);

				const tempSlot = createActivePokemonSlot(starterPokemon);

				const confirmHTML = `<div class="infobox"><h2>Congratulations!</h2><p>You have chosen <strong>${species.name}</strong> as your starter!</p>${generatePokemonInfoHTML(tempSlot, true)}<p>Your adventure begins now...</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter Pokémon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokémon: ${error}`);
			}
		},

		menu(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are in a battle!");
			}
			const player = getPlayerData(user.id);
			if (player.party.length === 0) {
				return this.parse('/rpg start');
			}
			const menuHTML = `<div class="infobox"><h2>RPG Menu - ${player.name}</h2><p><strong>Location:</strong> ${player.location} | <strong>Money:</strong> ₽${player.money}</p><p>What would you like to do?</p><p><button name="send" value="/rpg profile" class="button">👤 Profile</button><button name="send" value="/rpg party" class="button">⚡ Party</button><button name="send" value="/rpg battle" class="button">⚔️ Battle</button><button name="send" value="/rpg explore" class="button">🗺️ Explore</button></p><p><button name="send" value="/rpg pokedex" class="button">📖 Pokédex</button><button name="send" value="/rpg items" class="button">🎒 Items</button><button name="send" value="/rpg pc" class="button">💻 Pokemon PC</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${menuHTML}`);
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
				// --- FIX ---
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learning Result</h2><p>${message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
				// --- END FIX ---
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			}
		},

		learneggmove(target, room, user) {
			const player = getPlayerData(user.id);

			// --- FIX: Correctly parse multi-word moves ---
			const parts = target.split(' ');
			if (parts.length < 2) {
				return this.errorReply("Invalid command parameters.");
			}
			const pokemonId = parts[0];
			const rawMoveId = parts.slice(1).join(' '); // This correctly becomes "magical leaf"
			// --- END FIX ---

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
				// --- FIX ---
				const tempSlot = createActivePokemonSlot(pokemon);
				const resultHTML = `<div class="infobox"><h2>Move Learned!</h2><p><strong>${pokemon.species}</strong> learned <strong>${newMoveData.name}</strong>!</p>${generatePokemonInfoHTML(tempSlot)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				// --- END FIX ---
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
				`<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
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
						// --- THIS IS THE FIX ---
						// We pass the slot info directly to the HTML generator
						// and no longer wrap it in an extra <div>
						const tempSlot = createActivePokemonSlot(player.party[i]);
						partyHTML += generatePokemonInfoHTML(tempSlot, true, true, { index: i, partyLength: player.party.length });
						// --- END FIX ---
					} else {
						partyHTML += `<p><strong>Slot ${i + 1}:</strong> Empty</p>`;
					}
				}
			}
			partyHTML += `<p style="margin-top: 15px;"><button name="send" value="/rpg pc" class="button">Pokemon PC</button> <button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
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
						const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
					}
					const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p><p><button name="send" value="/rpg party" class="button">View Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
				}

				// --- All other medicines require a Pokemon target ---
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use ${item.name}</h2><p>Select a Pokemon to use this item on:</p>`;

					// Determine what kind of Pokemon to show (fainted, status, etc.)
					const isRevival = ['revive', 'maxrevive', 'revivalherb'].includes(itemId);
					const isHealing = ['potion', 'superpotion', 'hyperpotion', 'maxpotion', 'fullrestore', 'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'berryjuice'].includes(itemId);
					const isStatusHeal = ['antidote', 'paralyzeheal', 'awakening', 'burnheal', 'iceheal', 'fullheal', 'healpowder'].includes(itemId);
					const isPPRestore = ['ether', 'maxether', 'elixir', 'maxelixir'].includes(itemId);
					const isVitamin = ['hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos'].includes(itemId);

					for (const pokemon of player.party) {
						let show = false;
						let details = `<small>HP: ${pokemon.hp}/${pokemon.maxHp}</small>`;
						if (pokemon.status) details += ` <small style="color: red;">(${pokemon.status.toUpperCase()})</small>`;

						if (isRevival && pokemon.hp <= 0) {
							show = true;
							details = `<small>HP: ${pokemon.hp}/${pokemon.maxHp} (Fainted)</small>`;
						}
						if (isHealing && pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
							show = true;
						}
						if (isStatusHeal && pokemon.hp > 0 && pokemon.status) {
							show = true;
						}
						if (isPPRestore && pokemon.hp > 0) {
							show = true;
						}
						if (isVitamin && pokemon.hp > 0) {
							const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
							if (totalEVs < 510) {
								show = true;
								details += `<br/><small>EVs: ${totalEVs}/510</small>`;
							}
						}

						if (show) {
							html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> (Lvl ${pokemon.level})<br>${details}</div><button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use</button></div>`;
						}
					}
					html += `<p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}

				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

				let result: { success: boolean, message: string } = { success: false, message: "This item cannot be used." };
				let requiresMoveSelection = false;

				switch (itemId) {
				// Revival
				case 'revive':
				case 'maxrevive':
				case 'revivalherb':
					result = useRevivalItem(player, targetPokemon, itemId);
					break;

					// HP Healing
				case 'potion':
				case 'superpotion':
				case 'hyperpotion':
				case 'maxpotion':
				case 'fullrestore':
				case 'berryjuice':
				case 'freshwater':
				case 'sodapop':
				case 'lemonade':
				case 'moomoomilk':
				case 'tea':
				case 'energyroot':
				case 'energypowder':
					result = useHealingItem(player, targetPokemon, itemId);
					break;

					// Specific Status
				case 'antidote':
					if (targetPokemon.status === 'psn') {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species} was cured of poison!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} is not poisoned.` };
					}
					break;
				case 'paralyzeheal':
					if (targetPokemon.status === 'par') {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species} was cured of paralysis!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} is not paralyzed.` };
					}
					break;
				case 'awakening':
					if (targetPokemon.status === 'slp') {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species} woke up!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} is not asleep.` };
					}
					break;
				case 'burnheal':
					if (targetPokemon.status === 'brn') {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species} was cured of its burn!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} is not burned.` };
					}
					break;
				case 'iceheal':
					if (targetPokemon.status === 'frz') {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species} was thawed out!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} is not frozen.` };
					}
					break;

					// Full Status
				case 'fullheal':
				case 'healpowder':
					if (targetPokemon.status) {
						targetPokemon.status = null;
						result = { success: true, message: `${targetPokemon.species}'s status was healed!` };
					} else {
						result = { success: false, message: `${targetPokemon.species} has no status condition.` };
					}
					break;

					// PP Restore (Single Move)
				case 'ether':
				case 'maxether':
					requiresMoveSelection = true;
					break;

					// PP Restore (All Moves)
				case 'elixir':
				case 'maxelixir':
					let totalPPRestored = 0;
					for (const move of targetPokemon.moves) {
						const moveData = getMove(move.id);
						const maxPP = moveData.pp || 5;
						if (move.pp < maxPP) {
							const restoreAmount = (itemId === 'elixir') ? 10 : maxPP;
							const oldPP = move.pp;
							move.pp = Math.min(maxPP, move.pp + restoreAmount);
							totalPPRestored += (move.pp - oldPP);
						}
					}
					if (totalPPRestored > 0) {
						result = { success: true, message: `${targetPokemon.species}'s moves had their PP restored!` };
					} else {
						result = { success: false, message: `${targetPokemon.species}'s moves are already at full PP.` };
					}
					break;

					// Vitamins
				case 'hpup':
				case 'protein':
				case 'iron':
				case 'calcium':
				case 'zinc':
				case 'carbos':
					result = useVitaminItem(player, targetPokemon, itemId);
					break;
				}

				if (requiresMoveSelection) {
					// Show the move selection UI
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveSelectionHTML(player, pokemonId, itemId)}`);
				}

				if (!result.success) {
					const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
				}

				// If successful, remove item and show result
				// (Vitamin function already removes item, so skip for them)
				if (!['hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos'].includes(itemId)) {
					removeItemFromInventory(player, itemId, 1);
				}

				const tempSlot = createActivePokemonSlot(targetPokemon);
				const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			} else if (item.category === 'held' || item.category === 'berry') {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
			} else if (item.category === 'misc') {
				// --- BLOCK TO HANDLE MISC ITEMS ---
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use ${item.name}</h2><p>Select a Pokémon to use this item on:</p>`;
					for (const pokemon of player.party) {
						let canUse = true;
						let details = `(Lvl ${pokemon.level})`;

						if (itemId === 'rarecandy' || itemId.startsWith('expcandy')) {
							if (pokemon.level >= 100) canUse = false;
							details = `(Lvl ${pokemon.level}, ${pokemon.experience}/${pokemon.expToNextLevel} EXP)`;
						}
						if (itemId === 'terashard') {
							details = `(Tera Type: ${pokemon.teraType})`;
						}

						if (canUse) {
							html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> ${details}</div><button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use</button></div>`;
						}
					}
					html += `<p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}

				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

				// Handle specific misc items
				if (itemId === 'rarecandy') {
					const result = useRareCandyItem(player, targetPokemon, room, user);
					if (!result.success) {
						const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg useitem rarecandy" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
					}
					if (player.pendingMoveLearnQueue?.moveIds.length) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
					}
					const updatedPokemon = player.party.find(p => p.id === pokemonId);
					if (!updatedPokemon) return this.errorReply("Pokemon not found in party.");
					const tempSlot = createActivePokemonSlot(updatedPokemon);
					const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
				} else if (itemId.startsWith('expcandy')) {
					const result = useExpCandyItem(player, targetPokemon, itemId, room, user);
					if (!result.success) {
						const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
					}
					if (player.pendingMoveLearnQueue?.moveIds.length) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateMoveLearnHTML(player)}`);
					}
					const updatedPokemon = player.party.find(p => p.id === pokemonId);
					if (!updatedPokemon) return this.errorReply("Pokemon not found in party.");
					const tempSlot = createActivePokemonSlot(updatedPokemon);
					const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
				} else if (itemId === 'terashard') {
					const allTypes = Object.keys(TYPE_CHART);
					if (allTypes.length === 0) return this.errorReply("Error: Could not find type list.");
					const newTeraType = allTypes[Math.floor(Math.random() * allTypes.length)];
					const oldTeraType = targetPokemon.teraType;
					targetPokemon.teraType = newTeraType;
					removeItemFromInventory(player, 'terashard', 1);
					const tempSlot = createActivePokemonSlot(targetPokemon);
					const resultHTML = `<div class="infobox"><h2>Tera Type Changed!</h2><p>You used a <strong>Tera Shard</strong> on <strong>${targetPokemon.species}</strong>!</p><p>Its Tera Type changed from <strong>${oldTeraType}</strong> to <strong>${newTeraType}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
				} else if (itemId === 'eggmovetutor') {
					const speciesId = toID(targetPokemon.species);
					const allEggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
					const learnableEggMoves = allEggMoves.filter(moveId => !targetPokemon.moves.some(m => m.id === toID(moveId)));
					if (learnableEggMoves.length === 0) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>No Moves Available</h2><p><strong>${targetPokemon.species}</strong> either has no Egg Moves or already knows all of them.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
					}
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEggMoveSelectionHTML(targetPokemon, learnableEggMoves)}`);
				} else if (item.id.endsWith('stone')) {
					// --- EVOLUTION STONE LOGIC ---
					const evoMessage = checkEvolution(player, targetPokemon, { room, user }, itemId);

					if (evoMessage) {
						// Evolution was successful
						removeItemFromInventory(player, itemId, 1);
						const updatedPokemon = player.party.find(p => p.id === pokemonId); // Refetch in case of evolution
						const tempSlot = createActivePokemonSlot(updatedPokemon || targetPokemon);
						let resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${evoMessage}</p>${generatePokemonInfoHTML(tempSlot, true)}`;

						// Check if new moves were queued
						if (player.pendingMoveLearnQueue?.moveIds.length) {
							resultHTML += `<hr/><p style="color:red; font-weight:bold;">Your Pokémon wants to learn a new move!</p><p><button name="send" value="/rpg learnmove" class="button">Learn Move</button></p>`;
						} else {
							resultHTML += `<p><button name="send" value="/rpg party" class="button">Back to Party</button></p>`;
						}
						resultHTML += `</div>`;
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
					} else {
						// Evolution failed
						const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">It had no effect... (${targetPokemon.species} is not compatible with this item).</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
					}
				} else {
					return this.errorReply("This item cannot be used right now.");
				}
			} else {
				return this.errorReply("This item category cannot be used from the bag.");
			}
		},

		restorepp(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}

			const [pokemonId, moveId, itemId] = target.split(' ').map(arg => toID(arg));
			if (!pokemonId || !moveId || !itemId) {
				return this.errorReply("Invalid command parameters.");
			}

			const player = getPlayerData(user.id);
			if (!player.inventory.has(itemId)) {
				return this.errorReply("You do not have that item.");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}

			const move = pokemon.moves.find(m => m.id === moveId);
			if (!move) {
				return this.errorReply("Pokemon does not know that move.");
			}

			const moveData = getMove(moveId);
			const maxPP = moveData.pp || 5;

			if (move.pp >= maxPP) {
				return this.errorReply("That move already has full PP.");
			}

			let restoreAmount = 0;
			if (itemId === 'ether') {
				restoreAmount = 10;
			} else if (itemId === 'maxether') {
				restoreAmount = maxPP;
			} else {
				return this.errorReply("That is not a valid PP-restoring item for a single move.");
			}

			const oldPP = move.pp;
			move.pp = Math.min(maxPP, move.pp + restoreAmount);
			const restored = move.pp - oldPP;

			removeItemFromInventory(player, itemId, 1);
			const item = ITEMS_DATABASE[itemId];

			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>You used an <strong>${item.name}</strong> on <strong>${pokemon.species}</strong>!</p><p><strong>${moveData.name}</strong>'s PP was restored by ${restored}.</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		pc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(getPlayerData(user.id))}`);
		},

		depositpc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			if (player.party.length <= 1) {
				return this.errorReply("You must keep at least one Pokemon in your party!");
			}
			const pokemonIndex = player.party.findIndex(p => p.id === pokemonId);
			if (pokemonIndex === -1) {
				return this.errorReply("Pokemon not found in party.");
			}
			const [pokemon] = player.party.splice(pokemonIndex, 1);
			storePokemonInPC(player, pokemon);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Deposited</h2><p><strong>${pokemon.species}</strong> has been deposited into the PC!</p><p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`);
		},

		withdrawpc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			const pokemonId = target.trim();
			const player = getPlayerData(user.id);
			if (player.party.length >= 6) {
				return this.errorReply("Your party is full!");
			}
			const pokemon = withdrawPokemonFromPC(player, pokemonId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in PC.");
			}
			player.party.push(pokemon);
			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Withdrawn</h2><p><strong>${pokemon.species}</strong> has been withdrawn from the PC!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`);
			// --- END FIX ---
		},

		shop(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			// This line has been corrected to include 'medicine' instead of 'potion'
			const validCategories = ['pokeball', 'medicine', 'held', 'berry', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player, filterCategory)}`);
		},

		buy(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot shop during a battle.");
			}
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);
			if (!itemId || !ITEMS_DATABASE[itemId]) {
				return this.errorReply("Invalid item specified.");
			}

			// Check if item is available in current location's shop
			const locationId = toID(player.location);
			const shopInventory = getShopInventory(locationId, player.badges);
			if (!shopInventory.includes(itemId)) {
				return this.errorReply("This item is not available in this shop. You may need more badges to unlock it!");
			}

			const itemPrice = ITEM_PRICES[itemId];
			if (!itemPrice) {
				return this.errorReply("This item is not for sale.");
			}
			const totalCost = itemPrice * quantity;
			if (player.money < totalCost) {
				return this.errorReply(`You don't have enough money! You need ₽${totalCost}.`);
			}
			player.money -= totalCost;
			addItemToInventory(player, itemId, quantity);
			const item = ITEMS_DATABASE[itemId];
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Purchase Complete!</h2><p>You bought <strong>${quantity}x ${item.name}</strong> for ₽${totalCost}!</p><p><strong>Money remaining:</strong> ₽${player.money}</p><p><button name="send" value="/rpg shop" class="button">Continue Shopping</button><button name="send" value="/rpg items" class="button">View Inventory</button></p></div>`);
		},

		sell(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot sell items during a battle.");
			}
			const [itemId, quantityStr] = target.split(' ');
			const quantity = parseInt(quantityStr) || 1;
			const player = getPlayerData(user.id);

			if (!itemId) {
				// If no item specified, show sell menu
				let html = `<div class="infobox"><h2>Sell Items</h2><p>Select an item to sell:</p><p><strong>Your Money:</strong> ₽${player.money}</p>`;
				html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;
				let sellableItems = 0;
				for (const [id, item] of player.inventory) {
					const sellPrice = ITEM_PRICES[id]; // Using ITEM_PRICES as sell price for now
					if (sellPrice && item.category === 'misc') { // Only allow selling 'misc' items
						sellableItems++;
						html += `<div style="border: 1px solid #ccc; padding: 8px; border-radius: 5px;">`;
						html += `<strong>${item.name}</strong> (x${item.quantity})<br>`;
						html += `<small>Sell for: ₽${sellPrice} each</small><br>`;
						html += `<button name="send" value="/rpg sell ${id} 1" class="button" style="font-size: 12px; margin-top: 5px;">Sell 1</button>`;
						if (item.quantity >= 5) {
							html += `<button name="send" value="/rpg sell ${id} 5" class="button" style="font-size: 12px; margin-top: 5px;">Sell 5</button>`;
						}
						html += `</div>`;
					}
				}
				if (sellableItems === 0) {
					html += `<p>You have no valuable items to sell.</p>`;
				}
				html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg shop" class="button">Back to Shop</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const itemInBag = player.inventory.get(itemId);
			if (!itemInBag) {
				return this.errorReply("You don't have that item.");
			}
			if (itemInBag.quantity < quantity) {
				return this.errorReply(`You only have ${itemInBag.quantity} of that item.`);
			}
			if (itemInBag.category !== 'misc') {
				return this.errorReply("You can only sell items from the 'Misc.' category.");
			}

			const sellPrice = ITEM_PRICES[itemId];
			if (!sellPrice) {
				return this.errorReply("This item cannot be sold.");
			}

			const totalGain = sellPrice * quantity;
			removeItemFromInventory(player, itemId, quantity);
			player.money += totalGain;

			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Item Sold!</h2><p>You sold <strong>${quantity}x ${itemInBag.name}</strong> for ₽${totalGain}!</p><p><strong>Money remaining:</strong> ₽${player.money}</p><p><button name="send" value="/rpg sell" class="button">Sell More</button><button name="send" value="/rpg shop" class="button">Back to Shop</Gbutton></p></div>`);
		},

		pokedex(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use the Pokedex during a battle.");
			}
		},

		explore(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot explore during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) {
				return this.errorReply(`Unknown location: ${player.location}`);
			}

			// Get encounter zones from location's encounterZones array
			const availableZones = currentLocation.encounterZones || [];

			let exploreButtons = '';

			// Wild Pokemon zones
			if (availableZones.length > 0) {
				exploreButtons += '<p><strong>Wild Pokemon:</strong></p>';
				for (const zoneId of availableZones) {
					const zone = ENCOUNTER_ZONES[zoneId];
					if (zone) {
						const icon = zone.battleType === 'double' ? '👥' : '🛤️';
						exploreButtons += `<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">${icon} ${zone.name}</button> `;
					}
				}
			}

			// Buildings (for towns/cities)
			if (currentLocation.buildings && currentLocation.buildings.length > 0) {
				exploreButtons += '<p><strong>Buildings:</strong></p>';
				for (const building of currentLocation.buildings) {
					// Check if building is accessible
					if (building.accessible === false) continue;
					if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) continue;

					let icon = '🏠';
					if (building.type === 'pokecenter') icon = '🏥';
					else if (building.type === 'pokemart') icon = '🏪';
					else if (building.type === 'gym') icon = '⚔️';
					else if (building.type === 'lab') icon = '🔬';
					else if (building.type === 'museum') icon = '🏛️';
					else if (building.type === 'department') icon = '🏬';
					else if (building.type === 'gameCorner') icon = '🎰';

					exploreButtons += `<button name="send" value="/rpg building ${building.id}" class="button">${icon} ${building.name}</button> `;
				}
			}

			// Route trainers
			const locationTrainers = TRAINER_LOCATIONS[currentLocationId];
			if (locationTrainers && locationTrainers.length > 0) {
				const availableTrainers = locationTrainers.filter(tid => !player.defeatedTrainers.has(tid));
				if (availableTrainers.length > 0) {
					exploreButtons += `<p><strong>Trainers:</strong></p>`;
					for (const trainerId of availableTrainers) {
						const trainerData = TRAINER_DATABASE[trainerId];
						if (trainerData) {
							exploreButtons += `<button name="send" value="/rpg challenge ${trainerId}" class="button">🥊 ${trainerData.name}</button> `;
						}
					}
				}
			}

			const exploreHTML = `<div class="infobox">` +
				`<h2>${currentLocation.name}</h2>` +
				`<p><em>${currentLocation.description}</em></p>` +
				`${exploreButtons}` +
				`<hr />` +
				`<p><button name="send" value="/rpg travel" class="button">🗺️ Travel</button> ` +
				`<button name="send" value="/rpg npc" class="button">💬 Talk to NPCs</button> ` +
				`<button name="send" value="/rpg menu" class="button">Back to Menu</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${exploreHTML}`);
		},

		travel(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot travel during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);

			// If no target, show travel menu
			if (!target) {
				const currentLocation = LOCATIONS[currentLocationId];
				if (!currentLocation) {
					return this.errorReply(`Unknown location: ${player.location}`);
				}

				let travelHTML = `<div class="infobox"><h2>Travel from ${currentLocation.name}</h2>`;
				travelHTML += `<p>Where would you like to go?</p>`;

				if (currentLocation.connectedLocations.length === 0) {
					travelHTML += `<p>There are no paths from this location yet.</p>`;
				} else {
					for (const connection of currentLocation.connectedLocations) {
						// Check if location is accessible
						let canAccess = true;
						let lockReason = '';

						if (connection.requiredBadge) {
							if (!player.obtainedBadges.includes(connection.requiredBadge)) {
								canAccess = false;
								lockReason = ` 🔒 (Requires ${connection.requiredBadge})`;
							}
						}

						if (connection.requiredFlag) {
							if (!player.storyFlags.has(connection.requiredFlag)) {
								canAccess = false;
								lockReason = ` 🔒 (Not accessible yet)`;
							}
						}

						if (canAccess) {
							travelHTML += `<button name="send" value="/rpg travel ${connection.id}" class="button">➡️ ${connection.name}</button> `;
						} else {
							travelHTML += `<button class="button" disabled style="opacity: 0.5;">${connection.name}${lockReason}</button> `;
						}
					}
				}

				travelHTML += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${travelHTML}`);
			}

			// Travel to target location
			const targetLocationId = toID(target);
			const targetLocation = LOCATIONS[targetLocationId];
			const currentLocation = LOCATIONS[currentLocationId];

			if (!targetLocation) {
				return this.errorReply("That location doesn't exist.");
			}

			if (!currentLocation) {
				return this.errorReply("Your current location is invalid.");
			}

			// Check if the location is connected
			const connection = currentLocation.connectedLocations.find(c => c.id === targetLocationId);
			if (!connection) {
				return this.errorReply(`You can't travel to ${targetLocation.name} from here.`);
			}

			// Check requirements
			if (connection.requiredBadge && !player.obtainedBadges.includes(connection.requiredBadge)) {
				return this.errorReply(`You need the ${connection.requiredBadge} to travel to ${targetLocation.name}.`);
			}

			if (connection.requiredFlag && !player.storyFlags.has(connection.requiredFlag)) {
				return this.errorReply(`You can't access ${targetLocation.name} yet.`);
			}

			// Perform travel
			player.location = targetLocation.name;
			player.visitedLocations.add(targetLocationId);

			// Check for scripted events
			const triggeredEvents = [];
			if (targetLocation.scriptedEvents) {
				for (const event of targetLocation.scriptedEvents) {
					// Check if event should trigger
					const eventFlagId = `scripted_${event.id}`;

					// Skip if already triggered and marked as triggerOnce
					if (event.triggerOnce && player.storyFlags.has(eventFlagId)) continue;

					// Skip if required flag is not present
					if (event.requiredFlag && !player.storyFlags.has(event.requiredFlag)) continue;

					// Skip if player doesn't have enough badges
					if (event.requiredBadgeCount && player.obtainedBadges.length < event.requiredBadgeCount) continue;

					// Skip if player has too many badges (for early-game only events)
					if (event.maxBadgeCount && player.obtainedBadges.length > event.maxBadgeCount) continue;

					// Skip if preventIfFlag is set and player has that flag
					if (event.preventIfFlag && player.storyFlags.has(event.preventIfFlag)) continue;

					triggeredEvents.push(event);

					// Mark as triggered if it's a once-only event
					if (event.triggerOnce) {
						player.storyFlags.add(eventFlagId);
					}

					// Set flag if specified
					if (event.setFlag) {
						player.storyFlags.add(event.setFlag);
					}
				}
			}

			// If there are triggered events, show them
			if (triggeredEvents.length > 0) {
				const firstEvent = triggeredEvents[0];
				let eventHTML = `<div class="infobox"><h2>Arrived at ${targetLocation.name}</h2>`;
				eventHTML += `<p><em>${targetLocation.description}</em></p><hr />`;

				if (firstEvent.type === 'dialogue') {
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue}</p>`;
					eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
				} else if (firstEvent.type === 'item') {
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue || 'You found an item!'}</p>`;
					if (firstEvent.itemId && firstEvent.itemQuantity) {
						addItemToInventory(player, firstEvent.itemId, firstEvent.itemQuantity);
						const itemData = ITEMS_DATABASE[firstEvent.itemId];
						eventHTML += `<p>You received ${firstEvent.itemQuantity}x ${itemData?.name || firstEvent.itemId}!</p>`;
					}
					eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
				} else if (firstEvent.type === 'pokemon') {
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue || 'You received a Pokemon!'}</p>`;
					if (firstEvent.pokemon) {
						const newPokemon = createPokemon(firstEvent.pokemon.species, firstEvent.pokemon.level);
						if (firstEvent.pokemon.moves) {
							newPokemon.moves = firstEvent.pokemon.moves.map(moveId => {
								const moveData = getMove(moveId);
								return { id: moveId, pp: moveData.pp || 5 };
							});
						}
						if (firstEvent.pokemon.shiny) {
							newPokemon.shiny = true;
						}
						if (player.party.length < 6) {
							player.party.push(newPokemon);
							eventHTML += `<p>${newPokemon.species} joined your party!</p>`;
						} else {
							storePokemonInPC(player, newPokemon);
							eventHTML += `<p>${newPokemon.species} was sent to your PC!</p>`;
						}
					}
					eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
				} else if (firstEvent.type === 'wildbattle' && firstEvent.pokemon) {
					// Scripted wild Pokemon encounter
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue || 'A wild Pokemon appeared!'}</p>`;

					// Create the wild Pokemon
					const wildPokemon = createPokemon(firstEvent.pokemon.species, firstEvent.pokemon.level);
					if (firstEvent.pokemon.moves) {
						wildPokemon.moves = firstEvent.pokemon.moves.map(moveId => {
							const moveData = getMove(moveId);
							return { id: moveId, pp: moveData.pp || 5 };
						});
					}
					if (firstEvent.pokemon.shiny) {
						wildPokemon.shiny = true;
					}

					// Store the wild Pokemon temporarily
					const tempWildId = `scripted_wild_${firstEvent.id}`;
					player.pc.set(tempWildId, wildPokemon);

					const species = Dex.species.get(firstEvent.pokemon.species);
					eventHTML += `<p>A wild ${wildPokemon.shiny ? '✨ ' : ''}${species.name} (Lv. ${wildPokemon.level}) appeared!</p>`;
					eventHTML += `<p><button name="send" value="/rpg scriptedbattle ${tempWildId}" class="button">⚔️ Battle!</button></p>`;
					eventHTML += `<p><em>(This is a special encounter!)</em></p>`;
				} else if (firstEvent.type === 'trainer' && firstEvent.trainerId) {
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue || 'A trainer wants to battle!'}</p>`;
					eventHTML += `<p><button name="send" value="/rpg challenge ${firstEvent.trainerId}" class="button">⚔️ Battle!</button></p>`;
					eventHTML += `<p><em>(You can't avoid this battle)</em></p>`;
				} else {
					// NOTE: Additional scripted event types can be integrated here using scripted-events.ts handlers
					// Examples:
					// case 'cutscene': {
					//   const result = ScriptedEvents.handleCutscene(player, firstEvent);
					//   if (result.success && result.script) { ... }
					// }
					// case 'pokemonswarm': {
					//   const result = ScriptedEvents.handlePokemonSwarm(player, firstEvent);
					//   if (result.success) { ... }
					// }
					// See scripted-events.ts for all 42 handler functions
					eventHTML += `<p><strong>${firstEvent.name}</strong></p>`;
					eventHTML += `<p>${firstEvent.dialogue || 'Something happened...'}</p>`;
					eventHTML += `<p style="color: orange;">⚠️ Event type '${firstEvent.type}' handler not yet integrated.</p>`;
					eventHTML += `<p><em>Handler exists in scripted-events.ts but needs to be wired up here.</em></p>`;
					eventHTML += `<p><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
				}

				eventHTML += `</div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${eventHTML}`);
			}

			const arrivalHTML = `<div class="infobox">` +
				`<h2>Arrived at ${targetLocation.name}</h2>` +
				`<p>${targetLocation.description}</p>` +
				`<p><button name="send" value="/rpg explore" class="button">Explore ${targetLocation.name}</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${arrivalHTML}`);
		},

		building(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot enter a building during a battle.");
			}

			const player = getPlayerData(user.id);
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];

			if (!currentLocation) {
				return this.errorReply(`Unknown location: ${player.location}`);
			}

			if (!target) {
				return this.errorReply("Please specify which building to enter.");
			}

			const buildingId = toID(target);
			const building = currentLocation.buildings?.find(b => toID(b.id) === buildingId);

			if (!building) {
				return this.errorReply("That building doesn't exist in this location.");
			}

			// Check accessibility
			if (building.accessible === false) {
				return this.errorReply("This building is currently locked.");
			}
			if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) {
				return this.errorReply("You can't access this building yet.");
			}

			// Handle different building types
			let buildingHTML = `<div class="infobox"><h2>${building.name}</h2><p><em>${building.description}</em></p>`;

			// NPCs in this building
			if (building.npcs && building.npcs.length > 0) {
				buildingHTML += '<p><strong>People here:</strong></p>';
				for (const npcId of building.npcs) {
					const npc = NPC_DATABASE[npcId];
					if (npc) {
						// Check if NPC is accessible based on flags
						if (npc.flags && !npc.flags.every(flag => player.storyFlags.has(flag))) {
							continue;
						}
						buildingHTML += `<button name="send" value="/rpg talknpc ${npcId}" class="button">💬 ${npc.name}</button> `;
					}
				}
			}

			// Building-specific actions
			buildingHTML += '<p><strong>Actions:</strong></p>';

			if (building.type === 'pokecenter') {
				buildingHTML += `<button name="send" value="/rpg heal" class="button">🏥 Heal Pokemon</button> `;
				buildingHTML += `<button name="send" value="/rpg pc" class="button">💻 Access PC</button> `;
			}

			if (building.type === 'pokemart' || building.type === 'department') {
				buildingHTML += `<button name="send" value="/rpg shop" class="button">🏪 Shop</button> `;
			}

			if (building.type === 'gym' && building.gymLeaderId) {
				const gymLeaderId = building.gymLeaderId;
				const gymData = TRAINER_DATABASE[gymLeaderId];
				if (gymData && !player.defeatedTrainers.has(gymLeaderId)) {
					buildingHTML += `<button name="send" value="/rpg challenge ${gymLeaderId}" class="button">⚔️ Challenge ${gymData.name}</button> `;
				} else if (gymData && player.defeatedTrainers.has(gymLeaderId)) {
					buildingHTML += `<p><em>You already defeated ${gymData.name}!</em></p>`;
				}
			}

			buildingHTML += `<hr /><p><button name="send" value="/rpg explore" class="button">← Leave Building</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${buildingHTML}`);
		},

		wildpokemon(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("All your Pokémon have fainted!");
			}

			const zoneId = target.trim();
			const zone = ENCOUNTER_ZONES[zoneId];
			if (!zone) {
				return this.errorReply("This is not a valid area to explore. Use /rpg explore to see available areas.");
			}

			const battleType = zone.battleType || 'single';
			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'wild';

			try {
				// --- Player Pokemon ---
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);

				// --- Wild Pokemon ---
				const wildSpecies1 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
				const [minLevel, maxLevel] = zone.levelRange;
				const wildLevel1 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
				const wildPokemon1 = createPokemon(wildSpecies1, wildLevel1);
				opponentSlots[0] = createActivePokemonSlot(wildPokemon1);

				if (battleType === 'double') {
					finalBattleType = 'wild_double';
					// Add second player Pokemon if available
					if (activeParty[1]) {
						playerSlots[1] = createActivePokemonSlot(activeParty[1]);
					}

					// Add second wild Pokemon
					const wildSpecies2 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
					const wildLevel2 = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
					const wildPokemon2 = createPokemon(wildSpecies2, wildLevel2);
					opponentSlots[1] = createActivePokemonSlot(wildPokemon2);
					battleMessages.push(`A wild ${wildPokemon1.species} and ${wildPokemon2.species} appeared!`);
				} else {
					finalBattleType = 'wild';
					battleMessages.push(`A wild ${wildPokemon1.species} appeared!`);
				}

				const opponentParty = [opponentSlots[0].pokemon];
				if (opponentSlots[1]) opponentParty.push(opponentSlots[1].pokemon);

				const locationWeatherData = getLocationWeatherData(player);
				// Add weather message if there is location weather
				if (locationWeatherData.weather) {
					battleMessages.push(getWeatherStartMessage(locationWeatherData.weather.type));
				}
				activeBattles.set(user.id, {
					// --- Battle Type Fields ---
					battleType: finalBattleType,
					opponentName: `Wild Pokémon`,
					opponentParty,
					opponentMoney: 0,

					// --- New Slot-Based Fields ---
					playerSlots,
					opponentSlots,
					pendingActions: {},

					// --- Core BattleState Fields ---
					playerId: user.id,
					turn: 0,
					zoneId,
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

					// --- Terastallization Fields ---
					playerTerastallizeUsed: false,
					opponentTerastallizeUsed: false,

					// --- Side-Wide Fields ---
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

					// --- Delayed Move Fields ---
					playerFutureMoves: [],
					opponentFutureMoves: [],
				});

				this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id)!, battleMessages)}`);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
			}
		},

		scriptedbattle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}

			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("All your Pokémon have fainted!");
			}

			// Get the temporarily stored wild Pokemon
			const tempWildId = target.trim();
			const wildPokemon = player.pc.get(tempWildId);

			if (!wildPokemon) {
				return this.errorReply("This scripted encounter is no longer available.");
			}

			// Remove from PC (it was only temporarily stored)
			player.pc.delete(tempWildId);

			const battleMessages: string[] = [];
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];

			try {
				// --- Player Pokemon ---
				playerSlots[0] = createActivePokemonSlot(activeParty[0]);

				// --- Scripted Wild Pokemon ---
				opponentSlots[0] = createActivePokemonSlot(wildPokemon);
				battleMessages.push(`A wild ${wildPokemon.shiny ? '✨ ' : ''}${wildPokemon.species} appeared!`);

				const opponentParty = [wildPokemon];

				const locationWeatherData3 = getLocationWeatherData(player);
				// Add weather message if there is location weather
				if (locationWeatherData3.weather) {
					battleMessages.push(getWeatherStartMessage(locationWeatherData3.weather.type));
				}
				activeBattles.set(user.id, {
					// --- Battle Type Fields ---
					battleType: 'wild',
					opponentName: `Wild ${wildPokemon.species}`,
					opponentParty,
					opponentMoney: 0,

					// --- New Slot-Based Fields ---
					playerSlots,
					opponentSlots,
					pendingActions: {},

					// --- Core BattleState Fields ---
					playerId: user.id,
					turn: 0,
					zoneId: 'scripted',
					playerHazards: [],
					opponentHazards: [],
					weather: locationWeatherData3.weather,
					locationWeather: locationWeatherData3.locationWeather,
					terrain: undefined,
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aipPendingPivot: undefined,
					forceEnd: false,
					trickRoomTurns: 0,
					magicRoomTurns: 0,
					wonderRoomTurns: 0,
					gravityTurns: 0,
					mudSportTurns: 0,
					waterSportTurns: 0,
					fairyLockTurns: 0,
					ionDelugeTurns: 0,
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
					playerTerastallizeUsed: false,
					opponentTerastallizeUsed: false,
					playerFutureMoves: [],
					opponentFutureMoves: [],
				});

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id)!, battleMessages)}`);
			} catch (error) {
				activeBattles.delete(user.id);
				return this.errorReply("An error occurred while starting the battle: " + error);
			}
		},

		// --- NEW COMMAND ---
		challenge(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			const activeParty = player.party.filter(p => p.hp > 0);
			if (activeParty.length === 0) {
				return this.errorReply("You must heal your Pokémon before challenging a trainer!");
			}

			const trainerId = toID(target);
			const trainerSpec = TRAINER_DATABASE[trainerId];
			if (!trainerSpec) {
				return this.errorReply("That trainer could not be found.");
			}

			// Create fresh instances of the trainer's Pokémon
			const trainerParty: RPGPokemon[] = [];
			for (const spec of trainerSpec.party) {
				const pokemon = createPokemon(spec.species, spec.level);
				if (spec.moves) {
					pokemon.moves = spec.moves.map(moveId => {
						const moveData = getMove(moveId);
						return { id: moveId, pp: moveData.pp || 5 };
					});
				}
				if (spec.item) {
					pokemon.item = spec.item;
				}
				trainerParty.push(pokemon);
			}

			if (trainerParty.length === 0) {
				return this.errorReply("This trainer has no Pokémon!");
			}

			const battleType = trainerSpec.battleType || 'single';
			const playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			const opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null] = [null, null];
			let finalBattleType: BattleState['battleType'] = 'trainer';

			// --- Player Pokemon ---
			playerSlots[0] = createActivePokemonSlot(activeParty[0]);

			// --- Opponent Pokemon ---
			opponentSlots[0] = createActivePokemonSlot(trainerParty[0]);

			if (battleType === 'double') {
				finalBattleType = 'trainer_double';
				// Add second player Pokemon if available
				if (activeParty[1]) {
					playerSlots[1] = createActivePokemonSlot(activeParty[1]);
				}
				// Add second opponent Pokemon if available
				if (trainerParty[1]) {
					opponentSlots[1] = createActivePokemonSlot(trainerParty[1]);
				}
			} else {
				finalBattleType = 'trainer';
			}

			const locationWeatherData2 = getLocationWeatherData(player);
			activeBattles.set(user.id, {
				// --- Battle Type Fields ---
				battleType: finalBattleType,
				opponentName: trainerSpec.name,
				opponentParty: trainerParty, // The full party
				opponentMoney: trainerSpec.money,
				trainerId, // Add trainer ID for badge tracking

				// --- New Slot-Based Fields ---
				playerSlots,
				opponentSlots,
				pendingActions: {},

				// --- Core BattleState Fields ---
				playerId: user.id,
				turn: 0,
				zoneId: 'trainer_battle', // Or any identifier
				playerHazards: [],
				opponentHazards: [],
				weather: locationWeatherData2.weather,
				locationWeather: locationWeatherData2.locationWeather,
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				terrain: undefined,
				playerShouldSwitch: undefined,
				pendingPivot: undefined,
				aiPendingPivot: undefined,
				forceEnd: false,

				// --- Terastallization Fields ---
				playerTerastallizeUsed: false,
				opponentTerastallizeUsed: false,

				// --- Side-Wide Fields ---
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

				// --- Delayed Move Fields ---
				playerFutureMoves: [],
				opponentFutureMoves: [],
			});

			const startMessage = trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`;
			const challengeMessages = [startMessage];
			// Add weather message if there is location weather
			if (locationWeatherData2.weather) {
				challengeMessages.push(getWeatherStartMessage(locationWeatherData2.weather.type));
			}
			this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id)!, challengeMessages)}`);
		},

		battle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			// Get all available zone IDs from the configuration object
			const availableZoneIds = Object.keys(ENCOUNTER_ZONES);

			if (availableZoneIds.length === 0) {
				return this.errorReply("There are no wild Pokémon zones configured yet.");
			}

			// Select a random zone ID from the list of available zones
			const randomZoneId = availableZoneIds[Math.floor(Math.random() * availableZoneIds.length)];

			// Use this.parse() to execute the wildpokemon command with the random zone
			// This avoids duplicating code and keeps everything streamlined.
			return this.parse(`/rpg wildpokemon ${randomZoneId}`);
		},

		battleaction: {
			move(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const parts = target.split(' ');
				const attackerSlotStr = parts[0];
				const moveIdStr = parts[1];
				const targetSlotStr = parts[2];
				const shouldTerastallize = parts[3] === 'terastallize';

				const attackerSlotIndex = parseInt(attackerSlotStr);
				const targetSlotIndex = parseInt(targetSlotStr);
				const moveId = toID(moveIdStr);

				if (isNaN(attackerSlotIndex) || !moveId || isNaN(targetSlotIndex)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
				}

				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) {
					return this.errorReply("Invalid attacker slot. Must be 0 or 1.");
				}
				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
					return this.errorReply("This Pokémon is not in battle or has fainted.");
				}

				if (battle.pendingActions[attackerSlotIndex]) {
					return this.errorReply(`${attackerSlot.pokemon.species} is already waiting to move.`);
				}

				const moveData = getMove(moveId);
				if (!moveData.exists) return this.errorReply(`Move '${moveId}' not found.`);

				if (moveId !== 'struggle' && !attackerSlot.pokemon.moves.some(m => m.id === moveData.id)) {
					return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
				}

				// --- Terastallization validation ---
				if (shouldTerastallize) {
					if (battle.playerTerastallizeUsed) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
					}
					if (attackerSlot.terastallized) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`])}`);
					}
				}

				// --- REFACTORED VALIDATION ---
				const validationError = validateMoveAction(attackerSlot, moveId, battle);
				if (validationError) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [validationError])}`);
				}
				// --- END REFACTORED VALIDATION ---

				// --- Queue the action ---
				battle.pendingActions[attackerSlotIndex] = {
					actionType: 'move',
					moveId: moveData.id,
					targetSlot: targetSlotIndex,
					pokemonId: attackerSlot.pokemon.id,
					terastallize: shouldTerastallize,
				};

				const messageLog = shouldTerastallize ?
					[`${attackerSlot.pokemon.species} is ready to Terastallize and use ${moveData.name}!`] :
					[`${attackerSlot.pokemon.species} is ready to use ${moveData.name}!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = battle.playerSlots.filter(s => s && s.pokemon.hp > 0).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},
			// --- NEW FUNCTION ---
			selecttarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const parts = target.split(' ');
				const attackerSlotStr = parts[0];
				const moveId = parts[1];
				const shouldTerastallize = parts[2] === 'terastallize';

				const attackerSlotIndex = parseInt(attackerSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId) {
					return this.errorReply("Invalid command.");
				}

				// Validate terastallization if requested
				if (shouldTerastallize) {
					const attackerSlot = battle.playerSlots[attackerSlotIndex];
					if (!attackerSlot) {
						return this.errorReply("Invalid slot.");
					}
					if (battle.playerTerastallizeUsed) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can only Terastallize once per battle!"])}`);
					}
					if (attackerSlot.terastallized) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} has already Terastallized!`])}`);
					}
				}

				// Re-render the UI in "target selection" mode
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [shouldTerastallize ? `Select a target for ${getMove(moveId).name} (with Terastallization).` : `Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId, shouldTerastallize })}`);
			},
			// --- END NEW FUNCTION ---

			forceswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonId] = target.split(' ');
				const slotToFill = parseInt(slotStr);

				if (isNaN(slotToFill) || !pokemonId) {
					return this.errorReply("Invalid switch command.");
				}

				if (pokemonId === 'cancel') {
					// This happens if a player U-turns with no Pokemon to switch to.
					// We must clear the pivot flag.
					if (battle.pendingPivot?.slotIndex === slotToFill) {
						// Put the Pokemon back
						battle.playerSlots[slotToFill as 0 | 1] = battle.pendingPivot.slot;
						battle.pendingPivot = undefined;
					}
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["The battle continues..."])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Find the Pokemon in the party
				const partyIndex = player.party.findIndex(p => p.id === pokemonId && p.hp > 0);
				if (partyIndex === -1) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}

				// Check if this Pokemon is already in battle
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonId)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

				// Check if the slot is actually empty (it should be, if faint or pivot)
				if (battle.playerSlots[slotToFill] !== null && !battle.pendingPivot) {
					return this.errorReply("This slot is not empty.");
				}

				// --- Execute the Switch ---
				const nextPokemon = player.party[partyIndex];
				const newSlot = createActivePokemonSlot(nextPokemon);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span style="color: ${playerColor};">Go, ${nextPokemon.species}!</span>`];

				// **NEW:** Check if this is a pivot switch
				if (battle.pendingPivot?.slotIndex === slotToFill) {
					const pivotingPokemon = battle.pendingPivot.slot.pokemon;

					// Check if the pivoting Pokemon is already in the party to avoid duplicates
					const pivotIndex = player.party.findIndex(p => p.id === pivotingPokemon.id);
					if (pivotIndex === -1) {
						// Only push if not already in party (shouldn't normally happen)
						player.party.push(pivotingPokemon);
					}

					// Handle Baton Pass
					if (battle.pendingPivot.isBatonPass) {
						newSlot.statStages = { ...battle.pendingPivot.slot.statStages };
						newSlot.isConfused = battle.pendingPivot.slot.isConfused;
						newSlot.confusionCounter = battle.pendingPivot.slot.confusionCounter;
						newSlot.isSeeded = battle.pendingPivot.slot.isSeeded;
						// (Copy any other volatiles you want to pass)
						messageLog.push(`${newSlot.pokemon.species} received the Baton Pass!`);
					}
					battle.pendingPivot = undefined; // Clear the pivot flag
				}
				// (If not a pivot, it was a faint switch. The fainted mon is already in the party at 0 HP)

				battle.playerSlots[slotToFill as 0 | 1] = newSlot;

				// --- Apply Hazards ---
				const faintedOnEntry = applyHazardEffectsOnSwitchIn(newSlot, battle, true, messageLog);
				if (faintedOnEntry) {
					messageLog.push(`<span style="color: ${infoColor};"><strong>${newSlot.pokemon.species} fainted upon entry!</strong></span>`);
				} else {
					handleMirrorHerb(newSlot, battle, messageLog);
				}

				// --- Check if more switches are needed ---
				const needsAnotherSwitch = battle.playerSlots.some(s => s === null) &&
					player.party.some(p => p.hp > 0 && !battle.playerSlots.some(s => s?.pokemon.id === p.id));

				if (needsAnotherSwitch) {
					// Another slot is empty, show the switch screen again
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateFaintSwitchHTML(battle, messageLog.join('<br>'))}`);
				} else {
					// All slots are filled, continue the battle
					// Check if this switch *ended* the turn
					const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
					const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

					if (submittedPlayerActions === activePlayerSlots) {
						// All actions for this turn are complete, process it
						processTurn(this, battle, room, user);
					} else {
						// Turn is not over, just update the UI
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
					}
				}
			},

			playerswitch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				const [slotStr, pokemonIdIn] = target.split(' ');
				const slotToSwitchOut = parseInt(slotStr);

				if (isNaN(slotToSwitchOut) || !pokemonIdIn) {
					return this.errorReply("Invalid switch command. Usage: /rpg battleaction playerswitch [slot] [pokemonId]");
				}

				const outgoingSlot = battle.playerSlots[slotToSwitchOut];
				if (!outgoingSlot || outgoingSlot.pokemon.hp <= 0) {
					return this.errorReply("The Pokémon in that slot has fainted or is not there.");
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const trappingPokemon = checkTrappingAbility(outgoingSlot, battle);
				if (trappingPokemon) {
					const trapMessage = `${outgoingSlot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
					this.errorReply(trapMessage);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
				}
				// --- END TRAP CHECK ---

				if (outgoingSlot.isTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				if (outgoingSlot.isIngrained) {
					this.errorReply(`${outgoingSlot.pokemon.species} is rooted in place by Ingrain and cannot switch out!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is rooted in place and cannot switch out!`])}`);
				}

				const player = getPlayerData(battle.playerId);

				// Check if incoming Pokemon is valid
				const incomingPokemon = player.party.find(p => p.id === pokemonIdIn && p.hp > 0);
				if (!incomingPokemon) {
					return this.errorReply("Invalid Pokemon or it has fainted.");
				}
				if (battle.playerSlots.some(s => s?.pokemon.id === pokemonIdIn)) {
					return this.errorReply("This Pokemon is already in battle.");
				}

				outgoingSlot.lockedMove = undefined;
				outgoingSlot.lockedMoveCounter = 0;

				// --- Queue the Switch Action ---
				battle.pendingActions[slotToSwitchOut] = {
					actionType: 'switch',
					switchToPokemonId: pokemonIdIn,
					pokemonId: outgoingSlot.pokemon.id,
				};

				const messageLog = [`${outgoingSlot.pokemon.species} is ready to switch out!`];

				// --- Check if all player actions are submitted ---
				const activePlayerSlots = getActiveSlots(battle.playerSlots).length;
				const submittedPlayerActions = Object.keys(battle.pendingActions).filter(k => parseInt(k) <= 1).length;

				if (submittedPlayerActions === activePlayerSlots) {
					// All players have moved, process the turn
					processTurn(this, battle, room, user);
				} else {
					// Waiting for other player's move
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, messageLog)}`);
				}
			},

			switchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSwitchMenuHTML(battle, target)}`);
			},
			catchmenu(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// In double battles, can only catch when one opponent remains
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						const errorHTML = `<div class="infobox"><h2>Cannot Catch</h2><p>You can't throw a Poké Ball when there are multiple wild Pokémon!</p><p>Defeat one first, then you can catch the remaining one.</p><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
					}
				}

				const player = getPlayerData(battle.playerId);
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(player, battle)}`);
			},

			// --- NEW ---
			selectcatchtarget(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");
				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}
				const ballId = toID(target);
				if (!ballId) return this.errorReply("No ball selected.");

				// If only one target, just catch it.
				const activeOpponents = getActiveSlots(battle.opponentSlots);
				if (activeOpponents.length === 1) {
					const slotIndex = battle.opponentSlots.indexOf(activeOpponents[0]) + 2;
					return this.parse(`/rpg battleaction catch ${ballId} ${slotIndex}`);
				}

				// Show target selection screen
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchTargetHTML(battle, ballId)}`);
			},

			catch(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// --- NEW: Read target ---
				const [ballId, slotIndexStr] = target.split(' ');
				const targetSlotIndex = parseInt(slotIndexStr);

				if (!ballId || isNaN(targetSlotIndex)) {
					return this.errorReply("Invalid catch command. Usage: /rpg battleaction catch [ballId] [slotIndex]");
				}

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't catch a Trainer's Pokémon!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't steal another Trainer's Pokémon!"])}`);
				}

				// In double battles, can only catch when one opponent remains (matches Pokemon games Gen 8+)
				if (battle.battleType === 'wild_double') {
					const activeOpponents = getActiveSlots(battle.opponentSlots);
					if (activeOpponents.length > 1) {
						this.errorReply("You can't throw a Poké Ball when there are multiple opponents!");
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't throw a Poké Ball when there are multiple wild Pokémon! Defeat one first."])}`);
					}
				}

				// --- NEW: Get target slot ---
				const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
				if (!targetSlot || (targetSlotIndex !== 2 && targetSlotIndex !== 3)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["That is not a valid target!"])}`);
				}

				const player = getPlayerData(battle.playerId);
				const ballItem = player.inventory.get(ballId);

				if (ballItem?.category !== 'pokeball' || ballItem.quantity < 1) {
					return this.errorReply(`You don't have any ${ITEMS_DATABASE[ballId]?.name || 'of that item'}!`);
				}

				if (player.party.length >= 6 && player.pc.size >= 100) {
					return this.errorReply("Your party and PC are full!");
				}

				removeItemFromInventory(player, ballId, 1);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const neutralColor = '#6c757d';

				const messageLog: string[] = [];
				messageLog.push(`<span style="color: ${playerColor};">${player.name} used a ${ballItem.name}!</span>`);

				// --- NEW: Pass the target slot to performCatchAttempt ---
				const catchResult = performCatchAttempt(battle, ballId, targetSlot);
				const shakeMessages = [
					"Oh no! The Pokemon broke free!", "Aww! It appeared to be caught!",
					"Aargh! Almost had it!", "Gah! It was so close, too!",
				];

				for (let i = 1; i <= catchResult.shakes; i++) {
					if (i < 4) {
						messageLog.push(`<i style="color: ${neutralColor};">...The ball shook...</i>`);
					}
				}

				if (catchResult.success) {
					const zoneId = battle.zoneId;
					saveBattleStatus(battle);
					activeBattles.delete(user.id);

					const caughtPokemon = targetSlot.pokemon;
					caughtPokemon.caughtIn = ballId; // Set the ball it was caught in!

					if (ballId === 'healball') {
						caughtPokemon.hp = caughtPokemon.maxHp;
						caughtPokemon.status = null;
					}

					const location = player.party.length < 6 ? "your party" : "PC";
					if (player.party.length < 6) { player.party.push(caughtPokemon); } else { storePokemonInPC(player, caughtPokemon); }

					let successMessage = `<h2>Gotcha!</h2><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
					if (ballId === 'healball') successMessage += `<p>${caughtPokemon.species} was fully healed!</p>`;

					// --- FIX: Use createActivePokemonSlot ---
					const tempSlot = createActivePokemonSlot(caughtPokemon);
					const successHTML = `<div class="infobox">` + `${successMessage}` +
						`${generatePokemonInfoHTML(tempSlot, true)}` +
						`<p>${caughtPokemon.species} has been sent to ${location}.</p>` +
						`<p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
						`<button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${successHTML}`);
				} else {
					// --- FAILED CATCH PATH (FIXED) ---
					messageLog.push(`<span style="color: ${infoColor};"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					// The catch attempt failed. In Pokémon games, using an item (including Pokéballs) consumes your turn.
					// The opponent gets to attack, so we need to process the turn.
					processTurn(this, battle, room, user, messageLog);
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				// --- ARENA TRAP / SHADOW TAG CHECK ---
				const playerSlots = getActiveSlots(battle.playerSlots);
				for (const slot of playerSlots) {
					const trappingPokemon = checkTrappingAbility(slot, battle);
					if (trappingPokemon) {
						const trapMessage = `${slot.pokemon.species} can't escape due to ${trappingPokemon.pokemon.species}'s ${trappingPokemon.pokemon.ability}!`;
						this.errorReply(trapMessage);
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [trapMessage])}`);
					}
				}
				// --- END TRAP CHECK ---

				const trappedPokemon = playerSlots.find(slot => slot.isTrapped);

				if (trappedPokemon) {
					this.errorReply(`${trappedPokemon.pokemon.species} is trapped and cannot escape!`);
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`You can't escape!`])}`);
				}
				// END: Trapping check

				const zoneId = battle.zoneId;
				saveBattleStatus(battle);
				activeBattles.delete(user.id);

				const runHTML = `<div class="infobox">` +
					`<h2>Got away safely!</h2>` +
					`<p>You ran away from the wild Pokemon.</p>` +
					`<p>` +
					`<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
					`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
					`</p>` +
					`</div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${runHTML}`);
			},

			back(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					// --- FIX: Call the router function with no targetSelection ---
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You returned to the battle."])}`);
				}
			},

			help() {
				this.sendReply("Battle commands: /rpg battleaction [move|switch|catchmenu|run]");
			},
		},

		heal(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot heal your Pokemon during a battle.");
			}
			const player = getPlayerData(user.id);

			// Update last Pokemon Center visited (check if any building in current location is a pokecenter)
			const currentLocationId = toID(player.location);
			const currentLocationData = LOCATIONS[currentLocationId];
			if (currentLocationData?.buildings) {
				const hasPokeCenter = currentLocationData.buildings.some(b => b.type === 'pokecenter');
				if (hasPokeCenter) {
					player.lastPokemonCenter = currentLocationId;
				}
			}

			for (const pokemon of player.party) {
				pokemon.hp = pokemon.maxHp;
				pokemon.status = null;
				for (const move of pokemon.moves) {
					const moveData = getMove(move.id);
					move.pp = moveData.pp || 5;
				}
			}

			// Reset any active choice locks since PP was restored
			// Note: This won't work, activeBattles is empty.
			// The lock is on the 'ActivePokemonSlot' which is destroyed.
			// This is fine.

			const healHTML = `<div class="infobox"><h2>Pokemon Healed!</h2><p>Welcome to the Pokémon Center. We've restored your Pokémon to full health.</p><p>We hope to see you again!</p><p><button name="send" value="/rpg party" class="button">View Party</button><button name="send" value="/rpg explore" class="button">Explore</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${healHTML}`);
		},

		giveitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const [pokemonId, itemId] = target.split(' ').map(toID);

			if (!pokemonId) {
				let html = `<div class="infobox"><h2>Give Item</h2><p>Select a Pokémon to give an item to:</p>`;
				for (const pokemon of player.party) {
					html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id}" class="button">${pokemon.species}</button> (Currently holding: ${pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None'})</div>`;
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");

			if (!itemId) {
				let html = `<div class="infobox"><h2>Give ${pokemon.species} an Item</h2><p>Select an item from your bag:</p>`;
				let holdableItemsFound = false;
				for (const [id, item] of player.inventory) {
					if (item.category === 'held' || item.category === 'berry') {
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id} ${id}" class="button">${item.name}</button> x${item.quantity}</div>`;
						holdableItemsFound = true;
					}
				}
				if (!holdableItemsFound) {
					html += `<p>You have no holdable items in your bag.</p>`;
				}
				html += `<hr /><p><button name="send" value="/rpg giveitem" class="button">Back to Pokémon</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const item = player.inventory.get(itemId);
			if (!item || (item.category !== 'held' && item.category !== 'berry')) {
				return this.errorReply("You do not have this item or it cannot be held.");
			}

			if (pokemon.item) {
				// --- ADDED: Sticky Hold Check ---
				if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
					return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being swapped!`);
				}
				// --- END ADDED ---
				addItemToInventory(player, pokemon.item, 1);
			}

			pokemon.item = itemId;
			removeItemFromInventory(player, itemId, 1);

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Item Given</h2><p><strong>${pokemon.species}</strong> is now holding the <strong>${item.name}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		takeitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const pokemonId = toID(target);

			if (!pokemonId) {
				let html = `<div class="infobox"><h2>Take Item</h2><p>Select a Pokémon to take its item:</p>`;
				for (const pokemon of player.party) {
					if (pokemon.item) {
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg takeitem ${pokemon.id}" class="button">${pokemon.species}</button> (Holding: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item})</div>`;
					}
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");
			if (!pokemon.item) return this.errorReply(`${pokemon.species} is not holding an item.`);

			// --- ADDED: Sticky Hold Check ---
			if (RPGAbilities.checkItemRemovalPrevention(pokemon)) {
				return this.errorReply(`${pokemon.species}'s ${pokemon.ability} prevents its item from being taken!`);
			}
			// --- END ADDED ---

			const item = ITEMS_DATABASE[pokemon.item];
			addItemToInventory(player, pokemon.item, 1);
			pokemon.item = undefined;

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Item Taken</h2><p>You took the <strong>${item.name}</strong> from <strong>${pokemon.species}</strong>.</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		nickname(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot change nicknames during a battle.");
			}
			const player = getPlayerData(user.id);

			const parts = target.split(',');
			const pokemonId = parts[0]?.trim();
			const newNickname = parts.slice(1).join(',').trim();

			if (!pokemonId || !newNickname) {
				return this.errorReply("Invalid format. Usage: /rpg nickname [pokemonId], [new nickname]");
			}

			const pokemon = player.party.find(p => p.id === pokemonId);

			if (!pokemon) {
				return this.errorReply(`Pokemon with ID "${pokemonId}" not found in your party.`);
			}

			if (newNickname.length > 12) {
				return this.errorReply("Nicknames cannot be longer than 12 characters.");
			}

			const oldNickname = pokemon.nickname;
			pokemon.nickname = newNickname;

			// --- FIX ---
			const tempSlot = createActivePokemonSlot(pokemon);
			const resultHTML = `<div class="infobox"><h2>Nickname Changed!</h2><p>Changed <strong>${oldNickname}</strong>'s name to <strong>${pokemon.nickname}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
			// --- END FIX ---
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		reset(target, room, user) {
			const player = getPlayerData(user.id);

			// Check if user has RPG data to reset
			if (player.party.length === 0 && player.pc.size === 0 && player.inventory.size === 0) {
				return this.errorReply("You don't have any RPG progress to reset.");
			}

			// Remove user from active battles if they're in one
			if (activeBattles.has(user.id)) {
				const battle = activeBattles.get(user.id);
				if (battle) {
					saveBattleStatus(battle);
				}
				activeBattles.delete(user.id);
			}

			// Clear all player data
			playerData.delete(user.id);

			// Send confirmation
			const confirmHTML = `<div class="infobox"><h2>RPG Progress Reset</h2><p>All of your RPG progress has been reset!</p><p>Your profile, party, PC storage, inventory, and battle state have all been cleared.</p><p>You can start fresh by typing <code>/rpg start</code>.</p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
		},

		unstuck(target, room, user) {
			// Check if user is in a battle
			if (!activeBattles.has(user.id)) {
				return this.errorReply("You are not currently in a battle.");
			}

			// Save battle status and remove from active battles
			const battle = activeBattles.get(user.id);
			if (battle) {
				saveBattleStatus(battle);
			}
			activeBattles.delete(user.id);

			// Send confirmation
			const confirmHTML = `<div class="infobox"><h2>Battle Exited</h2><p>You have been removed from your battle.</p><p>Your Pokémon's status has been saved, and you can now use other RPG commands again.</p><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
		},

		npc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot talk to NPCs during a battle.");
			}

			const player = getPlayerData(user.id);
			const npcId = toID(target);

			if (!npcId) {
				// Show available NPCs in current location (including buildings)
				const currentLocationId = toID(player.location);
				const currentLocation = LOCATIONS[currentLocationId];

				const availableNPCs: [string, NPCData][] = [];

				// Find NPCs in the current location
				for (const [id, npc] of Object.entries(NPC_DATABASE)) {
					// Check if NPC is in this location (directly or in a building)
					const npcLocationId = toID(npc.location);
					if (npcLocationId === currentLocationId) {
						// NPC is in the main location
						if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) {
							availableNPCs.push([id, npc]);
						}
					} else if (currentLocation?.buildings) {
						// Check if NPC is in a building in this location
						const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
						if (building?.npcs?.includes(id)) {
							if (!npc.flags || npc.flags.every(f => player.storyFlags.has(f))) {
								availableNPCs.push([id, npc]);
							}
						}
					}
				}

				if (availableNPCs.length === 0) {
					return this.errorReply("There are no NPCs to talk to here.");
				}

				let html = `<div class="infobox"><h2>Talk to NPCs</h2><p>Who would you like to talk to?</p>`;
				for (const [id, npc] of availableNPCs) {
					html += `<button name="send" value="/rpg npc ${id}" class="button">💬 ${npc.name}</button> `;
				}
				html += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const npc = NPC_DATABASE[npcId];
			if (!npc) {
				return this.errorReply("That NPC doesn't exist.");
			}

			// Check location (NPC can be in the location directly or in a building in this location)
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];
			const npcLocationId = toID(npc.location);

			let npcAccessible = false;
			if (npcLocationId === currentLocationId) {
				npcAccessible = true;
			} else if (currentLocation?.buildings) {
				const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
				if (building?.npcs?.includes(npcId)) {
					npcAccessible = true;
				}
			}

			if (!npcAccessible) {
				return this.errorReply("That NPC is not in this location.");
			}

			// Check flags
			if (npc.flags && !npc.flags.every(f => player.storyFlags.has(f))) {
				return this.errorReply("You cannot talk to this NPC yet.");
			}

			// Build base dialogue HTML
			let dialogueHTML = `<div class="infobox">` +
				`<h2>${npc.name}</h2>` +
				`<p>"${npc.dialogue}"</p>`;

			// Handle NPC actions
			if (npc.action) {
				const action = npc.action;
				const actionCompleted = player.completedNPCActions.has(npcId);

				// Check if action is available
				if (!action.onceOnly || !actionCompleted) {
					dialogueHTML += `<hr />`;

					switch (action.type) {
					case 'giveitem':
						if (action.itemId && action.quantity) {
							const item = ITEMS_DATABASE[action.itemId];
							dialogueHTML += `<p><strong>Offer:</strong> ${item?.name || action.itemId} x${action.quantity}</p>`;
							dialogueHTML += `<button name="send" value="/rpg npcaction ${npcId}" class="button">✅ Accept Gift</button> `;
						}
						break;

					case 'givepokemon':
						if (action.pokemon) {
							const species = Dex.species.get(action.pokemon.species);
							if (!species.exists) {
								dialogueHTML += `<p style="color: red;">❌ Invalid Pokemon species.</p>`;
								break;
							}
							dialogueHTML += `<p><strong>Offer:</strong> ${species.name} (Lvl ${action.pokemon.level})</p>`;

							// Check if player has space
							if (player.party.length >= 6 && player.pc.size >= 100) {
								dialogueHTML += `<p style="color: red;">❌ Your party and PC are both full! Free up space first.</p>`;
							} else {
								if (player.party.length >= 6) {
									dialogueHTML += `<p style="color: orange;">⚠️ Your party is full! The Pokémon will go to your PC.</p>`;
								}
								dialogueHTML += `<button name="send" value="/rpg npcaction ${npcId}" class="button">✅ Accept Pokémon</button> `;
							}
						}
						break;

					case 'exchangeitems':
						if (action.requiredItem && action.requiredQuantity && action.itemId && action.quantity) {
							const requiredItem = ITEMS_DATABASE[action.requiredItem];
							const rewardItem = ITEMS_DATABASE[action.itemId];
							const hasRequired = player.inventory.get(action.requiredItem)?.quantity || 0;

							dialogueHTML += `<p><strong>Trade:</strong> ${requiredItem?.name || action.requiredItem} x${action.requiredQuantity} → ${rewardItem?.name || action.itemId} x${action.quantity}</p>`;

							if (hasRequired >= action.requiredQuantity) {
								dialogueHTML += `<p style="color: green;">✅ You have the required items!</p>`;
								dialogueHTML += `<button name="send" value="/rpg npcaction ${npcId}" class="button">🔄 Make Trade</button> `;
							} else {
								dialogueHTML += `<p style="color: red;">❌ You need ${action.requiredQuantity - hasRequired} more ${requiredItem?.name || action.requiredItem}</p>`;
							}
						}
						break;

					case 'takeitem':
						if (action.itemId && action.quantity) {
							const item = ITEMS_DATABASE[action.itemId];
							const hasItem = player.inventory.get(action.itemId)?.quantity || 0;

							dialogueHTML += `<p><strong>Request:</strong> ${item?.name || action.itemId} x${action.quantity}</p>`;

							if (hasItem >= action.quantity) {
								dialogueHTML += `<p style="color: green;">✅ You have the required items!</p>`;
								dialogueHTML += `<button name="send" value="/rpg npcaction ${npcId}" class="button">🎁 Give Items</button> `;
							} else {
								dialogueHTML += `<p style="color: red;">❌ You need ${action.quantity - hasItem} more ${item?.name || action.itemId}</p>`;
							}
						}
						break;
					}
				} else {
					dialogueHTML += `<hr /><p style="color: gray;"><em>You've already completed this NPC's request.</em></p>`;
				}
			}

			dialogueHTML += `<hr />` +
				`<p><button name="send" value="/rpg npc" class="button">Talk to Others</button> ` +
				`<button name="send" value="/rpg explore" class="button">Back to Explore</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${dialogueHTML}`);
		},

		npcaction(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot interact with NPCs during a battle.");
			}

			const player = getPlayerData(user.id);
			const npcId = toID(target);

			const npc = NPC_DATABASE[npcId];
			if (!npc?.action) {
				return this.errorReply("Invalid NPC or no action available.");
			}

			// Check location (NPC can be in the location directly or in a building in this location)
			const currentLocationId = toID(player.location);
			const currentLocation = LOCATIONS[currentLocationId];
			const npcLocationId = toID(npc.location);

			let npcAccessible = false;
			if (npcLocationId === currentLocationId) {
				npcAccessible = true;
			} else if (currentLocation?.buildings) {
				const building = currentLocation.buildings.find(b => toID(b.id) === npcLocationId);
				if (building?.npcs?.includes(npcId)) {
					npcAccessible = true;
				}
			}

			if (!npcAccessible) {
				return this.errorReply("That NPC is not in this location.");
			}

			// Check if already completed
			const actionCompleted = player.completedNPCActions.has(npcId);
			if (npc.action.onceOnly && actionCompleted) {
				return this.errorReply("You've already completed this NPC's request.");
			}

			const action = npc.action;
			let resultHTML = `<div class="infobox"><h2>${npc.name}</h2>`;

			switch (action.type) {
			case 'giveitem':
				if (action.itemId && action.quantity) {
					addItemToInventory(player, action.itemId, action.quantity);
					const item = ITEMS_DATABASE[action.itemId];
					resultHTML += `<p>"Here you go!"</p>`;
					resultHTML += `<p style="color: green;">✅ You received <strong>${item?.name || action.itemId} x${action.quantity}</strong>!</p>`;
					if (action.onceOnly) player.completedNPCActions.add(npcId);
				}
				break;

			case 'givepokemon':
				if (action.pokemon) {
					// Check if player has space
					if (player.party.length >= 6 && player.pc.size >= 100) {
						return this.errorReply("Your party and PC are both full! Free up space first.");
					}

					const pokemon = createPokemon(action.pokemon.species, action.pokemon.level);

					// Apply custom moves if specified
					if (action.pokemon.moves && action.pokemon.moves.length > 0) {
						pokemon.moves = action.pokemon.moves.map(moveId => {
							const moveData = getMove(moveId);
							if (!moveData?.exists) {
								// Fallback to default pp if move data not found
								return { id: moveId, pp: 5 };
							}
							return { id: moveId, pp: moveData.pp || 5 };
						});
					}

					const species = Dex.species.get(action.pokemon.species);
					if (!species.exists) {
						return this.errorReply("Invalid Pokemon species.");
					}

					if (player.party.length < 6) {
						player.party.push(pokemon);
						resultHTML += `<p>"Take good care of this Pokémon!"</p>`;
						resultHTML += `<p style="color: green;">✅ <strong>${species.name}</strong> joined your party!</p>`;
					} else {
						storePokemonInPC(player, pokemon);
						resultHTML += `<p>"Take good care of this Pokémon!"</p>`;
						resultHTML += `<p style="color: green;">✅ <strong>${species.name}</strong> was sent to your PC!</p>`;
					}

					// Show Pokemon info
					const tempSlot = createActivePokemonSlot(pokemon);
					resultHTML += generatePokemonInfoHTML(tempSlot, true);

					if (action.onceOnly) player.completedNPCActions.add(npcId);
				}
				break;

			case 'exchangeitems':
				if (action.requiredItem && action.requiredQuantity && action.itemId && action.quantity) {
					const hasRequired = player.inventory.get(action.requiredItem)?.quantity || 0;

					if (hasRequired < action.requiredQuantity) {
						return this.errorReply("You don't have enough of the required items.");
					}

					removeItemFromInventory(player, action.requiredItem, action.requiredQuantity);
					addItemToInventory(player, action.itemId, action.quantity);

					const requiredItem = ITEMS_DATABASE[action.requiredItem];
					const rewardItem = ITEMS_DATABASE[action.itemId];

					resultHTML += `<p>"Here's your trade!"</p>`;
					resultHTML += `<p style="color: green;">✅ Traded <strong>${requiredItem?.name || action.requiredItem} x${action.requiredQuantity}</strong> for <strong>${rewardItem?.name || action.itemId} x${action.quantity}</strong>!</p>`;

					if (action.onceOnly) player.completedNPCActions.add(npcId);
				}
				break;

			case 'takeitem':
				if (action.itemId && action.quantity) {
					const hasItem = player.inventory.get(action.itemId)?.quantity || 0;

					if (hasItem < action.quantity) {
						return this.errorReply("You don't have enough of the required items.");
					}

					removeItemFromInventory(player, action.itemId, action.quantity);
					const item = ITEMS_DATABASE[action.itemId];

					resultHTML += `<p>"Thank you so much!"</p>`;
					resultHTML += `<p style="color: green;">✅ Gave <strong>${item?.name || action.itemId} x${action.quantity}</strong> to ${npc.name}!</p>`;

					// Give a reward (example: money)
					const reward = action.quantity * 1000; // 1000 per item
					player.money += reward;
					resultHTML += `<p style="color: gold;">💰 Received <strong>₽${reward}</strong> as thanks!</p>`;

					if (action.onceOnly) player.completedNPCActions.add(npcId);
				}
				break;

			// NOTE: Additional NPC action types can be integrated here using npc-actions.ts handlers
			// Examples:
			// case 'fossilrevival': {
			//   const result = NPCActions.handleFossilRevival(player, action, fossilId);
			//   if (result.success && result.pokemon) { ... }
			//   break;
			// }
			// case 'dailyreward': {
			//   const result = NPCActions.handleDailyReward(player, action, npcId);
			//   if (result.success && result.rewards) { ... }
			//   break;
			// }
			// See npc-actions.ts for all 34+ handler functions
			default:
				resultHTML += `<p style="color: orange;">⚠️ This NPC action type (${action.type}) is not yet integrated into the command system.</p>`;
				resultHTML += `<p><em>The handler exists in npc-actions.ts but needs to be wired up here.</em></p>`;
				break;
			}

			resultHTML += `<hr />` +
				`<p><button name="send" value="/rpg npc ${npcId}" class="button">Talk Again</button> ` +
				`<button name="send" value="/rpg npc" class="button">Talk to Others</button> ` +
				`<button name="send" value="/rpg explore" class="button">Back to Explore</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
		},

		save(target, room, user) {
			const player = getPlayerData(user.id);

			try {
				const saveData = savePlayerToString(player);

				const saveHTML = `<div class="infobox">` +
					`<h2>Save Game</h2>` +
					`<p>Your game has been saved! Copy the text below to save your progress:</p>` +
					`<textarea readonly style="width: 100%; height: 150px; font-family: monospace; font-size: 10px;">${saveData}</textarea>` +
					`<p><small>Save this text somewhere safe. Use /rpg load [save data] to restore your progress.</small></p>` +
					`<p><strong>Warning:</strong> This save contains your entire game state. Keep it private!</p>` +
					`<hr />` +
					`<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>` +
					`</div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${saveHTML}`);
			} catch (error) {
				return this.errorReply("Error saving game: " + error);
			}
		},

		load(target, room, user) {
			if (!target) {
				const loadHTML = `<div class="infobox">` +
					`<h2>Load Game</h2>` +
					`<p>To load a saved game, use: <code>/rpg load [save data]</code></p>` +
					`<p><strong>Warning:</strong> Loading will replace your current progress!</p>` +
					`<hr />` +
					`<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>` +
					`</div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${loadHTML}`);
			}

			try {
				const loadedPlayer = loadPlayer(user.id, target);

				const confirmHTML = `<div class="infobox">` +
					`<h2>Game Loaded!</h2>` +
					`<p>Your saved game has been loaded successfully!</p>` +
					`<p><strong>Location:</strong> ${loadedPlayer.location}</p>` +
					`<p><strong>Badges:</strong> ${loadedPlayer.badges}/8</p>` +
					`<p><strong>Party:</strong> ${loadedPlayer.party.length} Pokémon</p>` +
					`<p><strong>Money:</strong> ₽${loadedPlayer.money}</p>` +
					`<hr />` +
					`<p><button name="send" value="/rpg menu" class="button">Continue Adventure</button></p>` +
					`</div>`;
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
			} catch (error) {
				return this.errorReply("Error loading game. Make sure you pasted the complete save data.");
			}
		},

		help() {
			return this.parse('/help rpg');
		},
		'': 'help',

		talknpc: 'npc',
	},
};
