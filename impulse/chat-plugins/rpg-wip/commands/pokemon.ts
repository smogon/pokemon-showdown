/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { Dex, toID } from '../../../../sim/dex';
import { getMove, checkEvolution, handleLearningMoves } from '../utils';
import type { RPGPokemon, ActivePokemonSlot, PlayerData } from '../interface';
import { ITEMS_DATABASE, removeItemFromInventory } from '../items';
import {
	createActivePokemonSlot,
} from '../battle-engine';
import {
	getPlayerData,
} from '../lib/player';
import {
	storePokemonInPC,
	withdrawPokemonFromPC,
} from '../lib/pokemon';
import {
	generateLearnMoveResultHTML,
	generateLearnEggMoveResultHTML,
	generateSummarySelectionHTML,
	generatePokemonSummaryHTML,
	generatePartyHTML,
	generateMoveLearnHTML,
	generateEggMoveSelectionHTML,
	generateDepositPokemonConfirmationHTML,
	generateWithdrawPokemonConfirmationHTML,
	generateNicknameConfirmationHTML,
} from '../html';
import { MANUAL_LEARNSETS } from '../MANUAL_LEARNSETS';
import { activeBattles } from '../core';

export const commands: ChatCommands = {
	rpg: {
		learnmove(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot do this during a battle.");
			}
			const player = getPlayerData(user.id);
			const queueArray = player.pendingMoveLearnQueue;
			if (!queueArray || queueArray.length === 0) {
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const queue = queueArray[0]; // Process first Pokemon in queue
			if (!queue || queue.moveIds.length === 0) {
				player.pendingMoveLearnQueue?.shift();
				return this.errorReply("Your Pokemon is not trying to learn a new move.");
			}
			const pokemon = player.party.find(p => p.id === queue.pokemonId);
			if (!pokemon) {
				player.pendingMoveLearnQueue?.shift();
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
				this.popupReply(`|wide||html|${generateMoveLearnHTML(player)}`);
			} else {
				// Remove this Pokemon's entry from queue
				queueArray.shift();
				// Check if there are more Pokemon waiting to learn moves
				if (queueArray.length > 0) {
					this.popupReply(`|wide||html|${generateMoveLearnHTML(player)}`);
				} else {
					const tempSlot = createActivePokemonSlot(pokemon);
					this.popupReply(`|wide||html|${generateLearnMoveResultHTML(message, tempSlot)}`);
				}
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
				this.popupReply(`|wide||html|${generateLearnEggMoveResultHTML(pokemon, newMoveData, tempSlot)}`);
			} else {
				if (!player.pendingMoveLearnQueue) {
					player.pendingMoveLearnQueue = [];
				}
				player.pendingMoveLearnQueue.push({ pokemonId: pokemon.id, moveIds: [newMoveId] });
				this.popupReply(`|wide||html|${generateMoveLearnHTML(player)}`);
			}
		},

		summary(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view a summary during battle.");
			}
			const player = getPlayerData(user.id);
			const targetId = target.trim();
			if (!targetId) {
				return this.popupReply(`|wide||html|${generateSummarySelectionHTML(player)}`);
			}
			const pokemon = player.party.find(p => p.id === targetId);
			if (!pokemon) {
				return this.errorReply("Pokemon not found in your party.");
			}
			this.popupReply(`|wide||html|${generatePokemonSummaryHTML(pokemon)}`);
		},

		party(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot view your party during a battle.");
			}
			const player = getPlayerData(user.id);
			this.popupReply(`|wide||html|${generatePartyHTML(player, createActivePokemonSlot)}`);
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

		pc(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot access the PC during a battle.");
			}
			this.popupReply(`|wide||html|${generatePCHTML(getPlayerData(user.id))}`);
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
			this.popupReply(`|wide||html|${generateDepositPokemonConfirmationHTML(pokemon)}`);
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
			const tempSlot = createActivePokemonSlot(pokemon);
			this.popupReply(`|wide||html|${generateWithdrawPokemonConfirmationHTML(pokemon, tempSlot)}`);
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

			const tempSlot = createActivePokemonSlot(pokemon);
			this.popupReply(`|wide||html|${generateNicknameConfirmationHTML(oldNickname, pokemon, tempSlot)}`);
		},
	},
};
