/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { Dex, toID } from '../../../../sim/dex';
import { getPlayerData } from '../../lib/player';
import {
	generateExploreHTML,
	generateTravelHTML,
	generateArrivalHTML,
	generateBuildingHTML,
	generateNPCListHTML,
	generateNPCDialogueHTML,
	generateNPCActionHTML,
	generateStarterChoiceHTML,
	generateStarterChoiceConfirmationHTML,
} from '../../html';
import { LOCATIONS, ENCOUNTER_ZONES } from '../../locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS } from '../../trainers';
import { NPC_DATABASE } from '../../npcs';
import { ITEMS_DATABASE } from '../../items';
import * as NPCActions from '../../npc-actions';
import * as ScriptedEvents from '../../scripted-events';
import { createPokemon, storePokemonInPC } from '../../lib/pokemon';
import { getMove } from '../../utils';
import { activeBattles } from '../../core';
import { STARTER_POKEMON } from '../../data';
import { getStartingLocation } from '../../locations';
import { createActivePokemonSlot } from '../../battle-engine';

export const commands: ChatCommands = {
	rpg: {
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

			this.popupReply(`|wide||html|${generateExploreHTML(player, availableZones, ENCOUNTER_ZONES)}`);
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
				return this.popupReply(`|wide||html|${generateTravelHTML(currentLocation, player)}`);
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
				return this.popupReply(`|wide||html|${generateArrivalHTML(targetLocation, triggeredEvents, player)}`);
			}
			this.popupReply(`|wide||html|${generateArrivalHTML(targetLocation, [], player)}`);
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
			this.popupReply(`|wide||html|${generateBuildingHTML(building, player, NPC_DATABASE, TRAINER_DATABASE)}`);
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

				const availableNPCs: [string, any][] = [];

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

				return this.popupReply(`|wide||html|${generateNPCListHTML(availableNPCs)}`);
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
			this.popupReply(`|wide||html|${generateNPCDialogueHTML(npc, player)}`);
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
			this.popupReply(`|wide||html|${generateNPCActionHTML(npc, {}, player)}`);
		},

		starterchoice(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot choose a starter during a battle.");
			}

			const player = getPlayerData(user.id);
			const parts = target.split(' ');
			const npcId = toID(parts[0]);
			const selectedPokemon = parts[1]; // pokemon id if selecting, undefined if viewing

			const npc = NPC_DATABASE[npcId];
			if (!npc?.action || npc.action.type !== 'choosestarter') {
				return this.errorReply("Invalid NPC or no starter selection available.");
			}

			const action = npc.action;

			if (!selectedPokemon) {
				this.popupReply(`|wide||html|${generateStarterChoiceHTML(npc)}`);
			} else {
				// Player selected a specific Pokemon
				// Validate the selection is in STARTER_POKEMON
				const allStarters = Object.values(STARTER_POKEMON).flat();
				if (!allStarters.includes(selectedPokemon)) {
					return this.errorReply("Invalid starter Pokémon selection.");
				}

				const result = NPCActions.handleChooseStarter(player, action, selectedPokemon);

				if (!result.success) {
					return this.errorReply(result.message);
				}

				// Mark as completed
				if (action.onceOnly) {
					player.completedNPCActions.add(npcId);
				}

				// Set starting location if not already set
				if (!player.location) {
					const startingLocation = getStartingLocation();
					player.location = startingLocation.name;
				}

				const starter = result.pokemon!;
				const tempSlot = createActivePokemonSlot(starter);

				this.popupReply(`|wide||html|${generateStarterChoiceConfirmationHTML(npc, result, tempSlot)}`);
			}
		},
	},
};
