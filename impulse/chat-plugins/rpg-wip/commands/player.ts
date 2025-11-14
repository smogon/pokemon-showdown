/*
* Pokemon Showdown
* RPG Commands
*
* This is the "Controller" layer. It handles user input and calls
* functions from core, battle-engine, items, and html.
*
*/
import { getPlayerData, savePlayerToDB, loadPlayerFromDB, hasSaveInDB, deletePlayerFromDB } from '../../lib/player';
import {
	generateDBSaveConfirmationHTML,
	generateDBLoadConfirmationHTML,
	generateDBLoadErrorHTML,
	generateDBDeleteConfirmationHTML,
	generateDBDeleteSuccessHTML,
} from '../../html';
import { activeBattles } from '../../core';

export const commands: ChatCommands = {
	rpg: {
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
				`<hr /><h3>Save & Load</h3><p><button name="send" value="/rpg dbsave" class="button">💾 Save to Database</button> ` +
				`<button name="send" value="/rpg dbload" class="button">📁 Load from Database</button> ` +
				`<button name="send" value="/rpg dbdelete" class="button">🗑️ Delete Save</button></p>` +
				`</div>`;
			this.popupReply(`|wide||html|${profileHTML}`);
		},

		save: 'dbsave',
		load: 'dbload',

		async dbsave(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot save during a battle.");
			}
			const player = getPlayerData(user.id);

			try {
				await savePlayerToDB(player);
				this.popupReply(`|wide||html|${generateDBSaveConfirmationHTML(player)}`);
			} catch (error) {
				return this.errorReply("Error saving game to database: " + String(error));
			}
		},

		async dbload(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot load during a battle.");
			}
			try {
				const hasSave = await hasSaveInDB(user.id);

				if (!hasSave) {
					return this.popupReply(`|wide||html|${generateDBLoadErrorHTML()}`);
				}

				const loadedPlayer = await loadPlayerFromDB(user.id);

				if (!loadedPlayer) {
					return this.errorReply("Error loading game from database.");
				}

				this.popupReply(`|wide||html|${generateDBLoadConfirmationHTML(loadedPlayer)}`);
			} catch (error) {
				return this.errorReply("Error loading game from database: " + String(error));
			}
		},

		async dbdelete(target, room, user) {
			if (activeBattles.has(user.id)) {
				return this.errorReply("You cannot delete saves during a battle.");
			}
			try {
				const hasSave = await hasSaveInDB(user.id);

				if (!hasSave) {
					return this.popupReply(`|wide||html|${generateDBLoadErrorHTML()}`);
				}

				// Require confirmation
				if (!target || target !== 'confirm') {
					return this.popupReply(`|wide||html|${generateDBDeleteConfirmationHTML()}`);
				}

				// Perform deletion
				const deleted = await deletePlayerFromDB(user.id);

				if (!deleted) {
					return this.errorReply("Error deleting save from database.");
				}

				this.popupReply(`|wide||html|${generateDBDeleteSuccessHTML()}`);
			} catch (error) {
				return this.errorReply("Error deleting save from database: " + String(error));
			}
		},
	},
};
