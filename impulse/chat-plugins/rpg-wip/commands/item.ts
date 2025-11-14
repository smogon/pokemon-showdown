/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { Dex, toID } from '../../../../sim/dex';
import { RPGAbilities } from '../../abilities';
import { getMove, checkEvolution, handleLearningMoves } from '../../utils';
import type { RPGPokemon, PlayerData } from '../../interface';
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
} from '../../items';
import {
	createActivePokemonSlot,
} from '../../battle-engine';
import {
	getPlayerData,
} from '../../lib/player';
import {
	generateInventoryHTML,
	generateMoveSelectionHTML,
	generateItemUseErrorHTML,
	generateSacredAshResultHTML,
	generateItemUseSuccessHTML,
	generateMiscItemPokemonSelectionHTML,
	generateNoLearnableEggMovesHTML,
	generateEvolutionHTML,
	generateEvolutionErrorHTML,
	generateRestorePPResultHTML,
	generateGiveItemPokemonSelectionHTMLWrapper,
	generateGiveItemSelectionHTML,
	generateGiveItemConfirmationHTML,
	generateTakeItemSelectionHTML,
	generateTakeItemConfirmationHTML,
	generateMoveLearnHTML,
	generateEggMoveSelectionHTML,
} from '../../html';
import { MANUAL_LEARNSETS } from '../../MANUAL_LEARNSETS';
import { TYPE_CHART } from '../../data';
import { activeBattles } from '../../core';

export const commands: ChatCommands = {
	rpg: {
		items(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access your bag in battle.");
			}
			const player = getPlayerData(user.id);
			const category = toID(target);
			const validCategories = ['pokeball', 'medicine', 'berry', 'tm', 'key', 'held', 'misc'];
			const filterCategory = validCategories.includes(category) ? category : undefined;
			this.popupReply(`|wide||html|${generateInventoryHTML(player, filterCategory)}`);
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
						return this.popupReply(`|wide||html|${generateItemUseErrorHTML(result.message, 'sacredash')}`);
					}
					return this.popupReply(`|wide||html|${generateSacredAshResultHTML(result.message)}`);
				}

				if (!pokemonId) {
					return this.popupReply(`|wide||html|${generateUseItemPokemonSelectionHTML(player, item)}`);
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
					return this.popupReply(`|wide||html|${generateMoveSelectionHTML(player, pokemonId, itemId)}`);
				}

				if (!result.success) {
					return this.popupReply(`|wide||html|${generateItemUseErrorHTML(result.message, itemId)}`);
				}

				// If successful, remove item and show result
				// (Vitamin function already removes item, so skip for them)
				if (!['hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos'].includes(itemId)) {
					removeItemFromInventory(player, itemId, 1);
				}

				const tempSlot = createActivePokemonSlot(targetPokemon);
				this.popupReply(`|wide||html|${generateItemUseSuccessHTML(result.message, tempSlot)}`);
			} else if (item.category === 'held' || item.category === 'berry') {
				return this.popupReply(`|wide||html|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
			} else if (item.category === 'misc') {
				if (!pokemonId) {
					return this.popupReply(`|wide||html|${generateMiscItemPokemonSelectionHTML(player, item)}`);
				}

				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

				// Handle specific misc items
				if (itemId === 'rarecandy') {
					const result = useRareCandyItem(player, targetPokemon, room, user);
					if (!result.success) {
						return this.popupReply(`|wide||html|${generateItemUseErrorHTML(result.message, 'rarecandy')}`);
					}
					if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
						return this.popupReply(`|wide||html|${generateMoveLearnHTML(player)}`);
					}
					const updatedPokemon = player.party.find(p => p.id === pokemonId);
					if (!updatedPokemon) return this.errorReply("Pokemon not found in party.");
					const tempSlot = createActivePokemonSlot(updatedPokemon);
					this.popupReply(`|wide||html|${generateItemUseSuccessHTML(result.message, tempSlot)}`);
				} else if (itemId.startsWith('expcandy')) {
					const result = useExpCandyItem(player, targetPokemon, itemId, room, user);
					if (!result.success) {
						return this.popupReply(`|wide||html|${generateItemUseErrorHTML(result.message, itemId)}`);
					}
					if (player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0) {
						return this.popupReply(`|wide||html|${generateMoveLearnHTML(player)}`);
					}
					const updatedPokemon = player.party.find(p => p.id === pokemonId);
					if (!updatedPokemon) return this.errorReply("Pokemon not found in party.");
					const tempSlot = createActivePokemonSlot(updatedPokemon);
					this.popupReply(`|wide||html|${generateItemUseSuccessHTML(result.message, tempSlot)}`);
				} else if (itemId === 'terashard') {
					const allTypes = Object.keys(TYPE_CHART);
					if (allTypes.length === 0) return this.errorReply("Error: Could not find type list.");
					const newTeraType = allTypes[Math.floor(Math.random() * allTypes.length)];
					const oldTeraType = targetPokemon.teraType;
					targetPokemon.teraType = newTeraType;
					removeItemFromInventory(player, 'terashard', 1);
					const tempSlot = createActivePokemonSlot(targetPokemon);
					const resultHTML = `<div class="infobox"><h2>Tera Type Changed!</h2><p>You used a <strong>Tera Shard</strong> on <strong>${targetPokemon.species}</strong>!</p><p>Its Tera Type changed from <strong>${oldTeraType}</strong> to <strong>${newTeraType}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					this.popupReply(`|wide||html|${resultHTML}`);
				} else if (itemId === 'eggmovetutor') {
					const speciesId = toID(targetPokemon.species);
					const allEggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
					const learnableEggMoves = allEggMoves.filter(moveId => !targetPokemon.moves.some(m => m.id === toID(moveId)));
					if (learnableEggMoves.length === 0) {
						return this.popupReply(`|wide||html|${generateNoLearnableEggMovesHTML(targetPokemon)}`);
					}
					this.popupReply(`|wide||html|${generateEggMoveSelectionHTML(targetPokemon, learnableEggMoves)}`);
				} else if (item.id.endsWith('stone')) {
					const evoMessage = checkEvolution(player, targetPokemon, { room, user }, itemId);

					if (evoMessage) {
						// Evolution was successful
						removeItemFromInventory(player, itemId, 1);
						const updatedPokemon = player.party.find(p => p.id === pokemonId); // Refetch in case of evolution
						const tempSlot = createActivePokemonSlot(updatedPokemon || targetPokemon);
						const hasPendingMoves = player.pendingMoveLearnQueue && player.pendingMoveLearnQueue.length > 0;
						this.popupReply(`|wide||html|${generateEvolutionHTML(evoMessage, tempSlot, hasPendingMoves)}`);
					} else {
						// Evolution failed
						return this.popupReply(`|wide||html|${generateEvolutionErrorHTML(targetPokemon, itemId)}`);
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
			this.popupReply(`|wide||html|${generateRestorePPResultHTML(pokemon, item, moveData, restored, tempSlot)}`);
		},

		giveitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const [pokemonId, itemId] = target.split(' ').map(toID);

			if (!pokemonId) {
				return this.popupReply(`|wide||html|${generateGiveItemPokemonSelectionHTMLWrapper(player)}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");

			if (!itemId) {
				return this.popupReply(`|wide||html|${generateGiveItemSelectionHTML(player, pokemon)}`);
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

			const tempSlot = createActivePokemonSlot(pokemon);
			this.popupReply(`|wide||html|${generateGiveItemConfirmationHTML(pokemon, item, tempSlot)}`);
		},

		takeitem(target, room, user) {
			if (activeBattles.has(user.id)) return this.errorReply("You cannot manage items during a battle.");
			const player = getPlayerData(user.id);
			const pokemonId = toID(target);

			if (!pokemonId) {
				return this.popupReply(`|wide||html|${generateTakeItemSelectionHTML(player)}`);
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

			const tempSlot = createActivePokemonSlot(pokemon);
			this.popupReply(`|wide||html|${generateTakeItemConfirmationHTML(pokemon, item, tempSlot)}`);
		},
	},
};
