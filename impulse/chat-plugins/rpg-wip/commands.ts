/**
 * RPG Command Handlers
 *
 * All /rpg command handlers that tie together the RPG system.
 * These are the user-facing commands that interact with the modules.
 */

// Import all the modules we need
import {
	getPlayerData,
	activeBattles,
	saveBattleStatus,
} from './player-data';

import {
	createPokemon,
	addItemToInventory,
	removeItemFromInventory,
	storePokemonInPC,
	withdrawPokemonFromPC,
	createActivePokemonSlot,
} from './utils';

import {
	STARTER_POKEMON,
	ENCOUNTER_ZONES,
	TRAINERS,
	ITEMS_DATABASE,
	SHOP_INVENTORY,
	ITEM_PRICES,
} from './constants';

import {
	getMove,
	performCatchAttempt,
	getBallBonus,
} from './battle-helpers';

import {
	createActivePokemonSlot,
	processTurn,
	checkBattleEndCondition,
	gainExperience,
	checkEvolution,
	useHealingItem,
} from './battle-system';

import {
	generateWelcomeHTML,
	generateStarterSelectionHTML,
	generatePokemonInfoHTML,
	generatePokemonSummaryHTML,
	generateInventoryHTML,
	generateShopHTML,
	generatePCHTML,
	generateBattleHTML,
	generateVictoryHTML,
	generateDefeatHTML,
	generateCatchMenuHTML,
	generateCatchTargetHTML,
	generateSwitchMenuHTML,
	generateFaintSwitchHTML,
	generateMoveLearnHTML,
	generatePivotSwitchHTML,
	generateGiveItemPokemonSelectionHTML,
	generateEggMoveSelectionHTML,
	generateFieldEffectHTML,
	generateTrainerVictoryHTML,
} from './ui-generators';

// Re-export for backward compatibility
export { activeBattles } from './player-data';

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

		choosetype(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const type = target.trim().toLowerCase();
			if (!['fire', 'water', 'grass'].includes(type)) {
				return this.errorReply("Invalid type.");
			}
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateStarterSelectionHTML(type)}`);
		},

		choosestarter(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const starterId = toID(target);
			const player = getPlayerData(user.id);
			if (player.party.length > 0) {
				return this.errorReply("You already have a starter Pokemon!");
			}
			if (!Object.values(STARTER_POKEMON).flat().includes(starterId)) {
				return this.errorReply("Invalid starter Pokemon.");
			}
			try {
				const starterPokemon = createPokemon(starterId, 5);
				player.party.push(starterPokemon);
				player.name = user.name;
				const species = Dex.species.get(starterId);

				// --- FIX ---
				// Create a temporary slot object to pass to the updated function.
				// This provides the default volatile statuses that generatePokemonInfoHTML expects.
				const tempSlot = createActivePokemonSlot(starterPokemon);

				const confirmHTML = `<div class="infobox"><h2>Congratulations!</h2><p>You have chosen <strong>${species.name}</strong> as your starter!</p>${generatePokemonInfoHTML(tempSlot, true)}<p>Your adventure begins now...</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
				// --- END FIX ---

				this.sendReply(`|uhtmlchange|rpg-${user.id}|${confirmHTML}`);
				if (room?.roomid !== 'lobby') {
					room.add(`|c|~RPG Bot|${user.name} has chosen ${species.name} as their starter pokemon!`).update();
				}
			} catch (error) {
				this.errorReply(`Error creating starter Pokemon: ${error}`);
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

		party(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (player.party.length === 0) {
				return this.errorReply("You have no Pokemon in your party.");
			}
			let html = `<div class="infobox"><h2>Your Party</h2>`;
			for (const p of player.party) {
				const tempSlot = createActivePokemonSlot(p);
				html += generatePokemonSummaryHTML(tempSlot);
			}
			html += `<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
		},

		items(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateInventoryHTML(player)}`);
		},

		useitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot use items while in a battle. Use items from the battle menu.");
			}
			const player = getPlayerData(user.id);
			const [itemId, ...rest] = target.split(',').map(s => s.trim());
			const targetIndex = parseInt(rest[0]);

			if (!itemId) {
				return this.errorReply("Please specify an item to use.");
			}

			const itemData = ITEMS_DATABASE[toID(itemId)];
			if (!itemData) {
				return this.errorReply("That item does not exist.");
			}

			const invItem = player.inventory.find(it => it.id === toID(itemId));
			if (!invItem || invItem.quantity <= 0) {
				return this.errorReply("You do not have that item.");
			}

			if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= player.party.length) {
				return this.errorReply("Invalid Pokemon index.");
			}

			const pokemon = player.party[targetIndex];
			if (!pokemon) {
				return this.errorReply("You don't have a Pokemon at that position.");
			}

			if (itemData.type === 'healing') {
				const result = useHealingItem(pokemon, itemData);
				if (!result.success) {
					return this.errorReply(result.message || "Cannot use this item right now.");
				}
				removeItemFromInventory(player, toID(itemId), 1);
				this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Item Used</h2><p>${result.message}</p><p><button name="send" value="/rpg party" class="button">View Party</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
			} else {
				return this.errorReply("This item cannot be used outside of battle in this way.");
			}
		},

		giveitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			if (!target) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player)}`);
				return;
			}

			const [pokemonIndexStr, itemId] = target.split(',').map(s => s.trim());
			const pokemonIndex = parseInt(pokemonIndexStr);

			if (isNaN(pokemonIndex) || pokemonIndex < 0 || pokemonIndex >= player.party.length) {
				return this.errorReply("Invalid Pokemon selected.");
			}

			if (!itemId) {
				return this.errorReply("Please specify an item to give.");
			}

			const itemData = ITEMS_DATABASE[toID(itemId)];
			if (!itemData) {
				return this.errorReply("That item does not exist.");
			}

			const pokemon = player.party[pokemonIndex];
			const invItem = player.inventory.find(it => it.id === toID(itemId));
			if (!invItem || invItem.quantity <= 0) {
				return this.errorReply("You do not have that item.");
			}

			if (pokemon.heldItem) {
				addItemToInventory(player, pokemon.heldItem, 1);
			}

			pokemon.heldItem = toID(itemId);
			removeItemFromInventory(player, toID(itemId), 1);

			const species = Dex.species.get(pokemon.speciesId);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Item Given</h2><p><strong>${species.name}</strong> is now holding <strong>${itemData.name}</strong>.</p><p><button name="send" value="/rpg party" class="button">View Party</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
		},

		takeitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			const pokemonIndex = parseInt(target);

			if (isNaN(pokemonIndex) || pokemonIndex < 0 || pokemonIndex >= player.party.length) {
				return this.errorReply("Invalid Pokemon index.");
			}

			const pokemon = player.party[pokemonIndex];
			if (!pokemon.heldItem) {
				return this.errorReply("This Pokemon is not holding an item.");
			}

			const itemId = pokemon.heldItem;
			addItemToInventory(player, itemId, 1);
			pokemon.heldItem = undefined;

			const species = Dex.species.get(pokemon.speciesId);
			const itemData = ITEMS_DATABASE[itemId];
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Item Taken</h2><p>You took <strong>${itemData?.name || itemId}</strong> from <strong>${species.name}</strong>.</p><p><button name="send" value="/rpg party" class="button">View Party</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
		},

		shop(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateShopHTML(player)}`);
		},

		buyitem(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			const [itemId, quantityStr] = target.split(',').map(s => s.trim());
			const quantity = parseInt(quantityStr) || 1;

			if (!itemId) {
				return this.errorReply("Please specify an item to buy.");
			}

			const itemData = ITEMS_DATABASE[toID(itemId)];
			if (!itemData) {
				return this.errorReply("That item does not exist.");
			}

			if (!SHOP_INVENTORY.includes(toID(itemId))) {
				return this.errorReply("That item is not available in the shop.");
			}

			const price = ITEM_PRICES[toID(itemId)] || 0;
			const totalCost = price * quantity;

			if (player.money < totalCost) {
				return this.errorReply(`You don't have enough money. You need ₽${totalCost} but only have ₽${player.money}.`);
			}

			player.money -= totalCost;
			addItemToInventory(player, toID(itemId), quantity);

			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Purchase Complete</h2><p>You bought <strong>${quantity}x ${itemData.name}</strong> for <strong>₽${totalCost}</strong>.</p><p><button name="send" value="/rpg shop" class="button">Continue Shopping</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
		},

		pc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generatePCHTML(player)}`);
		},

		pcstore(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			const partyIndex = parseInt(target);

			if (isNaN(partyIndex) || partyIndex < 0 || partyIndex >= player.party.length) {
				return this.errorReply("Invalid Pokemon index.");
			}

			if (player.party.length <= 1) {
				return this.errorReply("You must have at least one Pokemon in your party.");
			}

			const pokemon = player.party[partyIndex];
			storePokemonInPC(player, partyIndex);

			const species = Dex.species.get(pokemon.speciesId);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Stored</h2><p><strong>${species.name}</strong> has been stored in the PC.</p><p><button name="send" value="/rpg pc" class="button">View PC</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
		},

		pcwithdraw(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}
			const player = getPlayerData(user.id);
			const pcIndex = parseInt(target);

			if (isNaN(pcIndex) || pcIndex < 0 || pcIndex >= player.pc.length) {
				return this.errorReply("Invalid PC box index.");
			}

			if (player.party.length >= 6) {
				return this.errorReply("Your party is full. Store a Pokemon first.");
			}

			const pokemon = player.pc[pcIndex];
			withdrawPokemonFromPC(player, pcIndex);

			const species = Dex.species.get(pokemon.speciesId);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Pokemon Withdrawn</h2><p><strong>${species.name}</strong> has been withdrawn from the PC.</p><p><button name="send" value="/rpg pc" class="button">View PC</button> <button name="send" value="/rpg menu" class="button">Main Menu</button></p></div>`);
		},

		battle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			if (player.party.length === 0 || player.party.every(p => p.status === 'fnt')) {
				return this.errorReply("You have no healthy Pokemon to battle with!");
			}

			// Simple list of zones for user to choose from
			const zoneOptions = Object.keys(ENCOUNTER_ZONES).map(zoneId => {
				const zone = ENCOUNTER_ZONES[zoneId];
				const typeLabel = zone.battleType === 'double' ? '[Doubles]' : '[Singles]';
				return `<button name="send" value="/rpg startbattle ${zoneId}" class="button">${zone.name} ${typeLabel}</button>`;
			}).join(' ');

			const html = `<div class="infobox"><h2>Choose a Battle Zone</h2><p>${zoneOptions}</p><p><button name="send" value="/rpg menu" class="button">Cancel</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
		},

		startbattle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			const zoneId = toID(target);
			const zone = ENCOUNTER_ZONES[zoneId];

			if (!zone) {
				return this.errorReply("Invalid battle zone.");
			}

			if (player.party.every(p => p.status === 'fnt')) {
				return this.errorReply("All your Pokemon have fainted!");
			}

			// Pick a random wild Pokemon from the zone
			const randomSpeciesId = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
			const level = zone.levelRange[0] + Math.floor(Math.random() * (zone.levelRange[1] - zone.levelRange[0] + 1));
			const wildPokemon = createPokemon(randomSpeciesId, level);

			const battleType = zone.battleType || 'single';
			const opponentTeam = [wildPokemon];

			if (battleType === 'double') {
				const randomSpeciesId2 = zone.pokemon[Math.floor(Math.random() * zone.pokemon.length)];
				const level2 = zone.levelRange[0] + Math.floor(Math.random() * (zone.levelRange[1] - zone.levelRange[0] + 1));
				const wildPokemon2 = createPokemon(randomSpeciesId2, level2);
				opponentTeam.push(wildPokemon2);
			}

			const battleState = {
				type: 'wild' as const,
				battleType,
				player1: {
					id: user.id,
					party: player.party,
					activeSlots: battleType === 'double' ?
						[createActivePokemonSlot(player.party.find(p => p.status !== 'fnt')!), createActivePokemonSlot(player.party.find((p, i) => p.status !== 'fnt' && i !== player.party.findIndex(p2 => p2.status !== 'fnt'))!)] :
						[createActivePokemonSlot(player.party.find(p => p.status !== 'fnt')!)],
				},
				opponent: {
					party: opponentTeam,
					activeSlots: battleType === 'double' ?
						[createActivePokemonSlot(opponentTeam[0]), createActivePokemonSlot(opponentTeam[1])] :
						[createActivePokemonSlot(opponentTeam[0])],
				},
				turn: 0,
				weather: null,
				terrain: null,
				fieldEffects: {
					player1: {},
					opponent: {},
				},
				canEscape: true,
			};

			activeBattles.set(user.id, battleState);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battleState)}`);
		},

		trainerbattle(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You are already in a battle!");
			}
			const player = getPlayerData(user.id);
			const trainerId = toID(target);
			const trainer = TRAINERS[trainerId];

			if (!trainer) {
				return this.errorReply("Invalid trainer.");
			}

			if (player.party.every(p => p.status === 'fnt')) {
				return this.errorReply("All your Pokemon have fainted!");
			}

			const trainerTeam = trainer.team.map(t => createPokemon(t.speciesId, t.level));

			const battleType = trainer.battleType || 'single';

			const battleState = {
				type: 'trainer' as const,
				battleType,
				trainerId,
				trainerName: trainer.name,
				player1: {
					id: user.id,
					party: player.party,
					activeSlots: battleType === 'double' ?
						[createActivePokemonSlot(player.party.find(p => p.status !== 'fnt')!), createActivePokemonSlot(player.party.find((p, i) => p.status !== 'fnt' && i !== player.party.findIndex(p2 => p2.status !== 'fnt'))!)] :
						[createActivePokemonSlot(player.party.find(p => p.status !== 'fnt')!)],
				},
				opponent: {
					party: trainerTeam,
					activeSlots: battleType === 'double' ?
						[createActivePokemonSlot(trainerTeam[0]), createActivePokemonSlot(trainerTeam[1] || trainerTeam[0])] :
						[createActivePokemonSlot(trainerTeam[0])],
				},
				turn: 0,
				weather: null,
				terrain: null,
				fieldEffects: {
					player1: {},
					opponent: {},
				},
				canEscape: false,
			};

			activeBattles.set(user.id, battleState);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battleState)}`);
		},

		move(target, room, user) {
			const battle = activeBattles.get(user.id);
			if (!battle) {
				return this.errorReply("You are not in a battle.");
			}

			const [slotIndexStr, moveId] = target.split(',').map(s => s.trim());
			const slotIndex = parseInt(slotIndexStr);

			if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= battle.player1.activeSlots.length) {
				return this.errorReply("Invalid slot index.");
			}

			const slot = battle.player1.activeSlots[slotIndex];
			if (!slot?.pokemon) {
				return this.errorReply("No Pokemon in that slot.");
			}

			const move = slot.pokemon.moves.find(m => m.id === toID(moveId));
			if (!move) {
				return this.errorReply("Your Pokemon doesn't know that move.");
			}

			if (move.pp <= 0) {
				return this.errorReply("That move is out of PP!");
			}

			if (!slot.chosenAction) {
				slot.chosenAction = { type: 'move', moveId: toID(moveId) };
			}

			// Check if all player slots have chosen actions
			const allChosen = battle.player1.activeSlots.every(s => !s?.pokemon || s.chosenAction);

			if (allChosen) {
				processTurn(battle, user.id, this);
				const endCondition = checkBattleEndCondition(battle);
				if (endCondition) {
					if (endCondition.winner === 'player1') {
						if (battle.type === 'wild') {
							const totalExp = gainExperience(battle, user.id);
							this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateVictoryHTML(battle, totalExp)}`);
						} else if (battle.type === 'trainer') {
							const trainer = TRAINERS[battle.trainerId!];
							this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTrainerVictoryHTML(battle, trainer)}`);
						}
					} else {
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDefeatHTML()}`);
					}
					activeBattles.delete(user.id);
					const player = getPlayerData(user.id);
					checkEvolution(player, this, user.id);
				} else {
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle)}`);
				}
			} else {
				this.sendReply(`Waiting for other Pokemon to choose actions...`);
			}
		},

		catch(target, room, user) {
			const battle = activeBattles.get(user.id);
			if (!battle) {
				return this.errorReply("You are not in a battle.");
			}

			if (battle.type !== 'wild') {
				return this.errorReply("You cannot catch Pokemon in trainer battles!");
			}

			if (!target) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateCatchMenuHTML(battle)}`);
				return;
			}

			const [ballId, slotIndexStr] = target.split(',').map(s => s.trim());
			const slotIndex = parseInt(slotIndexStr);

			if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= battle.opponent.activeSlots.length) {
				return this.errorReply("Invalid target slot.");
			}

			const targetSlot = battle.opponent.activeSlots[slotIndex];
			if (!targetSlot?.pokemon) {
				return this.errorReply("No Pokemon in that slot.");
			}

			const player = getPlayerData(user.id);
			const invItem = player.inventory.find(it => it.id === toID(ballId));
			if (!invItem || invItem.quantity <= 0) {
				return this.errorReply("You don't have that Pokeball.");
			}

			const catchResult = performCatchAttempt(targetSlot.pokemon, toID(ballId));
			removeItemFromInventory(player, toID(ballId), 1);

			if (catchResult.caught) {
				const caughtPokemon = targetSlot.pokemon;
				if (player.party.length < 6) {
					player.party.push(caughtPokemon);
				} else {
					player.pc.push(caughtPokemon);
				}

				const species = Dex.species.get(caughtPokemon.speciesId);
				this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Gotcha!</h2><p><strong>${species.name}</strong> was caught!</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`);
				activeBattles.delete(user.id);
			} else {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Oh no!</h2><p>The Pokemon broke free!</p><p><button name="send" value="/rpg catch" class="button">Try Again</button> <button name="send" value="/rpg move 0,${targetSlot.pokemon.moves[0]?.id}" class="button">Attack</button></p></div>`);
			}
		},

		switch(target, room, user) {
			const battle = activeBattles.get(user.id);
			if (!battle) {
				return this.errorReply("You are not in a battle.");
			}

			if (!target) {
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateSwitchMenuHTML(battle)}`);
				return;
			}

			const [slotIndexStr, partyIndexStr] = target.split(',').map(s => s.trim());
			const slotIndex = parseInt(slotIndexStr);
			const partyIndex = parseInt(partyIndexStr);

			if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= battle.player1.activeSlots.length) {
				return this.errorReply("Invalid slot index.");
			}

			if (isNaN(partyIndex) || partyIndex < 0 || partyIndex >= battle.player1.party.length) {
				return this.errorReply("Invalid party index.");
			}

			const newPokemon = battle.player1.party[partyIndex];
			if (newPokemon.status === 'fnt') {
				return this.errorReply("That Pokemon has fainted!");
			}

			const currentSlot = battle.player1.activeSlots[slotIndex];
			if (currentSlot.pokemon?.id === newPokemon.id) {
				return this.errorReply("That Pokemon is already in battle!");
			}

			currentSlot.chosenAction = { type: 'switch', switchToIndex: partyIndex };

			// Check if all player slots have chosen actions
			const allChosen = battle.player1.activeSlots.every(s => !s?.pokemon || s.chosenAction);

			if (allChosen) {
				processTurn(battle, user.id, this);
				const endCondition = checkBattleEndCondition(battle);
				if (endCondition) {
					if (endCondition.winner === 'player1') {
						if (battle.type === 'wild') {
							const totalExp = gainExperience(battle, user.id);
							this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateVictoryHTML(battle, totalExp)}`);
						} else if (battle.type === 'trainer') {
							const trainer = TRAINERS[battle.trainerId!];
							this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateTrainerVictoryHTML(battle, trainer)}`);
						}
					} else {
						this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateDefeatHTML()}`);
					}
					activeBattles.delete(user.id);
					const player = getPlayerData(user.id);
					checkEvolution(player, this, user.id);
				} else {
					this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle)}`);
				}
			} else {
				this.sendReply(`Waiting for other Pokemon to choose actions...`);
			}
		},

		run(target, room, user) {
			const battle = activeBattles.get(user.id);
			if (!battle) {
				return this.errorReply("You are not in a battle.");
			}

			if (!battle.canEscape) {
				return this.errorReply("You cannot run from this battle!");
			}

			activeBattles.delete(user.id);
			this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>Escaped!</h2><p>You ran away from the battle.</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`);
		},

		profile(target, room, user) {
			const player = getPlayerData(user.id);
			const pokedexCount = player.pokedexSeen?.size || 0;
			const badgeCount = player.badges?.length || 0;

			let html = `<div class="infobox"><h2>Profile - ${player.name || user.name}</h2>`;
			html += `<p><strong>Location:</strong> ${player.location}</p>`;
			html += `<p><strong>Money:</strong> ₽${player.money}</p>`;
			html += `<p><strong>Pokédex:</strong> ${pokedexCount} seen</p>`;
			html += `<p><strong>Badges:</strong> ${badgeCount}</p>`;
			html += `<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
			html += `</div>`;

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
		},

		pokedex(target, room, user) {
			const player = getPlayerData(user.id);
			const seen = player.pokedexSeen || new Set<string>();

			let html = `<div class="infobox"><h2>Pokédex</h2>`;
			html += `<p>You have seen <strong>${seen.size}</strong> Pokémon.</p>`;

			if (seen.size > 0) {
				html += `<p>`;
				for (const speciesId of Array.from(seen).slice(0, 20)) {
					const species = Dex.species.get(speciesId);
					html += `${species.name}, `;
				}
				if (seen.size > 20) {
					html += `... and ${seen.size - 20} more`;
				}
				html += `</p>`;
			}

			html += `<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
			html += `</div>`;

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
		},

		explore(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this while in a battle.");
			}

			const html = `<div class="infobox"><h2>Explore</h2><p>Choose a trainer to challenge:</p>`;
			let trainerButtons = '';
			for (const [trainerId, trainer] of Object.entries(TRAINERS)) {
				trainerButtons += `<button name="send" value="/rpg trainerbattle ${trainerId}" class="button">${trainer.name}</button> `;
			}

			this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}${trainerButtons}<p><button name="send" value="/rpg menu" class="button">Back</button></p></div>`);
		},

		'': 'start',
		help(target, room, user) {
			return this.parse('/help rpg');
		},
	},
	rpghelp: [
		`/rpg - Start your Pokemon RPG adventure!`,
		`Commands: start, menu, party, battle, items, shop, pc, profile, pokedex`,
	],
};
