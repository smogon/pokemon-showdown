/**
 * Pokemon RPG UI Generators
 * 
 * This module consolidates all HTML/UI generation functions in one place
 * for easy maintenance and extension of the user interface.
 * 
 * Includes:
 * - Battle UI (single & double battles)
 * - Pokemon information displays
 * - Menu screens (shop, inventory, PC)
 * - Battle menus (move selection, switching)
 * - Victory/defeat screens
 * - Status displays
 */

// Import types and utilities
import type { RPGPokemon, PlayerData, BattleState, ActivePokemonSlot } from './types';
import { ITEMS_DATABASE, ITEM_PRICES, SHOP_INVENTORY } from './constants';
import { getActiveSlots } from './battle-helpers';
import { isDoublesBattle } from './battle-system';

// Global declarations (available from Pokemon Showdown environment)
declare const Dex: any;
declare function toID(text: string): string;

/**
 * Generate welcome screen HTML
 */
export function generateWelcomeHTML(): string {
	return `<div class="infobox"><h2>Welcome to Pokemon RPG!</h2><p>To begin your adventure, use <code>/rpg start</code> to choose your starter Pokemon!</p></div>`;
}

/**
 * Generate starter selection HTML
 */
export function generateStarterSelectionHTML(type: string): string {
	const starters = {
		fire: { name: 'Charmander', type: 'Fire' },
		water: { name: 'Squirtle', type: 'Water' },
		grass: { name: 'Bulbasaur', type: 'Grass' },
	};
	
	let html = `<div class="infobox"><h2>Choose Your Starter Pokemon!</h2><p>Select one of these Pokemon to begin your journey:</p>`;
	for (const [t, data] of Object.entries(starters)) {
		const selected = t === type ? ' style="font-weight: bold; color: #28a745;"' : '';
		html += `<button name="send" value="/rpg selectstarter ${t}"${selected}>${data.name} (${data.type})</button> `;
	}
	html += `</div>`;
	return html;
}

/**
 * Generate Pokemon info HTML (detailed view)
 */
export function generatePokemonInfoHTML(
	pokemon: RPGPokemon,
	showButtons: boolean = true,
	context?: 'party' | 'pc' | 'summary'
): string {
	const species = Dex.species.get(pokemon.species);
	const types = species.types.join('/');
	const expPercent = ((pokemon.experience - pokemon.expToNextLevel + (pokemon.expToNextLevel - pokemon.experience)) / (pokemon.expToNextLevel - pokemon.experience + pokemon.experience)) * 100;
	
	let html = `<div class="infobox" style="max-width: 500px;">`;
	html += `<h3>${pokemon.nickname}${pokemon.shiny ? ' ✨' : ''} (${pokemon.species})</h3>`;
	html += `<p><strong>Level ${pokemon.level}</strong> | ${types} | ${pokemon.gender}</p>`;
	html += `<p><strong>HP:</strong> ${pokemon.hp}/${pokemon.maxHp}</p>`;
	html += `<p><strong>Status:</strong> ${pokemon.status || 'OK'}</p>`;
	html += `<p><strong>Nature:</strong> ${pokemon.nature} | <strong>Ability:</strong> ${pokemon.ability}</p>`;
	
	// Stats
	html += `<p><strong>Stats:</strong> ATK ${pokemon.atk} | DEF ${pokemon.def} | SPA ${pokemon.spa} | SPD ${pokemon.spd} | SPE ${pokemon.spe}</p>`;
	
	// Moves
	html += `<p><strong>Moves:</strong> `;
	for (const move of pokemon.moves) {
		const moveData = Dex.moves.get(move.id);
		html += `${moveData.name} (${move.pp}/${moveData.pp}) | `;
	}
	html += `</p>`;
	
	// Item
	if (pokemon.item) {
		const itemData = ITEMS_DATABASE[pokemon.item];
		html += `<p><strong>Held Item:</strong> ${itemData?.name || pokemon.item}</p>`;
	}
	
	// Experience
	html += `<p><strong>EXP:</strong> ${pokemon.experience} / ${pokemon.expToNextLevel} (${expPercent.toFixed(1)}%)</p>`;
	
	// Friendship
	html += `<p><strong>Friendship:</strong> ${pokemon.friendship}</p>`;
	
	// Buttons
	if (showButtons && context === 'party') {
		html += `<p>`;
		html += `<button name="send" value="/rpg summary ${pokemon.id}">Full Summary</button> `;
		html += `<button name="send" value="/rpg giveitem ${pokemon.id},">Give Item</button> `;
		if (pokemon.item) {
			html += `<button name="send" value="/rpg takeitem ${pokemon.id}">Take Item</button> `;
		}
		html += `</p>`;
	}
	
	html += `</div>`;
	return html;
}

/**
 * Generate Pokemon summary HTML (detailed stats view)
 */
export function generatePokemonSummaryHTML(pokemon: RPGPokemon): string {
	const species = Dex.species.get(pokemon.species);
	const types = species.types.join('/');
	
	let html = `<div class="infobox" style="max-width: 600px;">`;
	html += `<h2>${pokemon.nickname}${pokemon.shiny ? ' ✨' : ''}</h2>`;
	html += `<p><strong>${pokemon.species}</strong> | ${types} | ${pokemon.gender} | Level ${pokemon.level}</p>`;
	
	// Basic Info
	html += `<hr><h3>Basic Info</h3>`;
	html += `<p><strong>HP:</strong> ${pokemon.hp} / ${pokemon.maxHp}</p>`;
	html += `<p><strong>Status:</strong> ${pokemon.status || 'OK'}</p>`;
	html += `<p><strong>Nature:</strong> ${pokemon.nature}</p>`;
	html += `<p><strong>Ability:</strong> ${pokemon.ability}</p>`;
	html += `<p><strong>Weight:</strong> ${pokemon.weightkg} kg | <strong>Height:</strong> ${pokemon.heightm} m</p>`;
	html += `<p><strong>Friendship:</strong> ${pokemon.friendship}</p>`;
	html += `<p><strong>Caught in:</strong> ${pokemon.caughtIn}</p>`;
	
	// Stats
	html += `<hr><h3>Stats</h3>`;
	html += `<table style="width: 100%; text-align: center;">`;
	html += `<tr><th>HP</th><th>ATK</th><th>DEF</th><th>SPA</th><th>SPD</th><th>SPE</th></tr>`;
	html += `<tr><td>${pokemon.maxHp}</td><td>${pokemon.atk}</td><td>${pokemon.def}</td><td>${pokemon.spa}</td><td>${pokemon.spd}</td><td>${pokemon.spe}</td></tr>`;
	html += `</table>`;
	
	// IVs
	html += `<p><strong>IVs:</strong> `;
	html += `HP ${pokemon.ivs.hp} | ATK ${pokemon.ivs.atk} | DEF ${pokemon.ivs.def} | `;
	html += `SPA ${pokemon.ivs.spa} | SPD ${pokemon.ivs.spd} | SPE ${pokemon.ivs.spe}`;
	html += `</p>`;
	
	// EVs
	html += `<p><strong>EVs:</strong> `;
	html += `HP ${pokemon.evs.hp} | ATK ${pokemon.evs.atk} | DEF ${pokemon.evs.def} | `;
	html += `SPA ${pokemon.evs.spa} | SPD ${pokemon.evs.spd} | SPE ${pokemon.evs.spe}`;
	html += `</p>`;
	
	// Moves
	html += `<hr><h3>Moves</h3>`;
	for (const move of pokemon.moves) {
		const moveData = Dex.moves.get(move.id);
		html += `<p><strong>${moveData.name}</strong> (${moveData.type}) | `;
		html += `${moveData.category} | Power: ${moveData.basePower || 'N/A'} | `;
		html += `PP: ${move.pp}/${moveData.pp}</p>`;
	}
	
	// Item
	if (pokemon.item) {
		const itemData = ITEMS_DATABASE[pokemon.item];
		html += `<hr><h3>Held Item</h3>`;
		html += `<p><strong>${itemData?.name || pokemon.item}</strong></p>`;
		html += `<p>${itemData?.description || ''}</p>`;
	}
	
	// Experience
	html += `<hr><h3>Experience</h3>`;
	html += `<p><strong>Current:</strong> ${pokemon.experience}</p>`;
	html += `<p><strong>Next Level:</strong> ${pokemon.expToNextLevel}</p>`;
	html += `<p><strong>Growth Rate:</strong> ${pokemon.growthRate}</p>`;
	
	html += `</div>`;
	return html;
}

/**
 * Generate inventory HTML
 */
export function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Inventory</h2>`;
	html += `<p><strong>Money:</strong> ₽${player.money.toLocaleString()}</p>`;
	
	// Category filters
	html += `<p>`;
	html += `<button name="send" value="/rpg items">All</button> `;
	html += `<button name="send" value="/rpg items pokeball">Pokeballs</button> `;
	html += `<button name="send" value="/rpg items medicine">Medicine</button> `;
	html += `<button name="send" value="/rpg items berry">Berries</button> `;
	html += `<button name="send" value="/rpg items held">Held Items</button> `;
	html += `</p>`;
	
	// Items
	const items = Array.from(player.inventory.values());
	const filtered = category ? items.filter(i => i.category === category) : items;
	
	if (filtered.length === 0) {
		html += `<p>No items in this category.</p>`;
	} else {
		html += `<table style="width: 100%;">`;
		html += `<tr><th>Item</th><th>Quantity</th><th>Description</th></tr>`;
		for (const item of filtered) {
			html += `<tr>`;
			html += `<td>${item.name}</td>`;
			html += `<td>${item.quantity}</td>`;
			html += `<td style="font-size: 0.9em;">${item.description}</td>`;
			html += `</tr>`;
		}
		html += `</table>`;
	}
	
	html += `</div>`;
	return html;
}

/**
 * Generate shop HTML
 */
export function generateShopHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Poke Mart</h2>`;
	html += `<p><strong>Your Money:</strong> ₽${player.money.toLocaleString()}</p>`;
	
	// Category filters
	html += `<p>`;
	html += `<button name="send" value="/rpg shop">All</button> `;
	html += `<button name="send" value="/rpg shop pokeball">Pokeballs</button> `;
	html += `<button name="send" value="/rpg shop medicine">Medicine</button> `;
	html += `<button name="send" value="/rpg shop berry">Berries</button> `;
	html += `<button name="send" value="/rpg shop held">Held Items</button> `;
	html += `</p>`;
	
	// Items
	const items = SHOP_INVENTORY.map(id => ITEMS_DATABASE[id]).filter(item => item);
	const filtered = category ? items.filter(i => i && i.category === category) : items;
	
	html += `<table style="width: 100%;">`;
	html += `<tr><th>Item</th><th>Price</th><th>Description</th><th>Action</th></tr>`;
	for (const item of filtered) {
		if (!item) continue;
		const price = ITEM_PRICES[item.id] || 0;
		const canAfford = player.money >= price;
		html += `<tr>`;
		html += `<td>${item.name}</td>`;
		html += `<td>₽${price.toLocaleString()}</td>`;
		html += `<td style="font-size: 0.9em;">${item.description}</td>`;
		html += `<td>`;
		if (canAfford) {
			html += `<button name="send" value="/rpg buy ${item.id},1">Buy 1</button> `;
			html += `<button name="send" value="/rpg buy ${item.id},5">Buy 5</button>`;
		} else {
			html += `<span style="color: #999;">Can't afford</span>`;
		}
		html += `</td>`;
		html += `</tr>`;
	}
	html += `</table>`;
	
	html += `</div>`;
	return html;
}

/**
 * Generate PC HTML
 */
export function generatePCHTML(player: PlayerData): string {
	let html = `<div class="infobox">`;
	html += `<h2>Pokemon Storage System</h2>`;
	html += `<p><strong>Stored Pokemon:</strong> ${player.pc.size}</p>`;
	
	if (player.pc.size === 0) {
		html += `<p>No Pokemon stored in PC.</p>`;
	} else {
		html += `<table style="width: 100%;">`;
		html += `<tr><th>Pokemon</th><th>Level</th><th>HP</th><th>Action</th></tr>`;
		for (const [id, pokemon] of player.pc.entries()) {
			html += `<tr>`;
			html += `<td>${pokemon.nickname} (${pokemon.species})</td>`;
			html += `<td>${pokemon.level}</td>`;
			html += `<td>${pokemon.hp}/${pokemon.maxHp}</td>`;
			html += `<td>`;
			html += `<button name="send" value="/rpg withdraw ${id}">Withdraw</button> `;
			html += `<button name="send" value="/rpg summary ${id}">View</button>`;
			html += `</td>`;
			html += `</tr>`;
		}
		html += `</table>`;
	}
	
	html += `</div>`;
	return html;
}

/**
 * Generate battle HTML (main dispatcher)
 */
export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[],
	showActions: boolean = true
): string {
	if (isDoublesBattle(battle)) {
		return generateDoubleBattleHTML(battle, messageLog, showActions);
	} else {
		return generateSingleBattleHTML(battle, messageLog, showActions);
	}
}

/**
 * Generate single battle HTML
 */
export function generateSingleBattleHTML(
	battle: BattleState,
	messageLog: string[],
	showActions: boolean = true
): string {
	const playerSlot = battle.playerSlots[0];
	const opponentSlot = battle.opponentSlots[0];
	
	if (!playerSlot || !opponentSlot) {
		return `<div class="infobox">Battle error: Missing Pokemon slots</div>`;
	}
	
	const player = playerSlot.pokemon;
	const opponent = opponentSlot.pokemon;
	
	let html = `<div class="infobox" style="max-width: 700px;">`;
	html += `<h2>Battle - Turn ${battle.turn + 1}</h2>`;
	
	// Opponent Pokemon
	html += `<div style="text-align: right; margin-bottom: 10px;">`;
	html += `<strong>${opponent.species}</strong> Lv.${opponent.level}`;
	html += `<br>HP: ${opponent.hp}/${opponent.maxHp}`;
	if (opponentSlot.status) html += ` [${opponentSlot.status.toUpperCase()}]`;
	html += `</div>`;
	
	// Player Pokemon
	html += `<div style="text-align: left; margin-bottom: 10px;">`;
	html += `<strong>${player.nickname}</strong> Lv.${player.level}`;
	html += `<br>HP: ${player.hp}/${player.maxHp}`;
	if (playerSlot.status) html += ` [${playerSlot.status.toUpperCase()}]`;
	html += `</div>`;
	
	// Message log
	if (messageLog.length > 0) {
		html += `<hr><div style="max-height: 200px; overflow-y: auto;">`;
		for (const msg of messageLog) {
			html += `<p style="margin: 5px 0;">${msg}</p>`;
		}
		html += `</div>`;
	}
	
	// Actions
	if (showActions) {
		html += `<hr><h3>Your Move</h3>`;
		html += `<p>`;
		for (const move of player.moves) {
			const moveData = Dex.moves.get(move.id);
			html += `<button name="send" value="/rpg battleaction move,0,${move.id},0">${moveData.name} (${move.pp})</button> `;
		}
		html += `</p>`;
		
		// Switch/Run options
		html += `<p>`;
		html += `<button name="send" value="/rpg battleaction switch,0">Switch Pokemon</button> `;
		if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
			html += `<button name="send" value="/rpg battleaction catch,0">Catch</button> `;
			html += `<button name="send" value="/rpg battleaction run">Run</button>`;
		}
		html += `</p>`;
	}
	
	html += `</div>`;
	return html;
}

/**
 * Generate double battle HTML
 */
export function generateDoubleBattleHTML(
	battle: BattleState,
	messageLog: string[],
	showActions: boolean = true
): string {
	const playerSlots = battle.playerSlots;
	const opponentSlots = battle.opponentSlots;
	
	let html = `<div class="infobox" style="max-width: 800px;">`;
	html += `<h2>Double Battle - Turn ${battle.turn + 1}</h2>`;
	
	// Opponent Pokemon (2 slots)
	html += `<div style="display: flex; justify-content: space-around; margin-bottom: 10px;">`;
	for (let i = 0; i < 2; i++) {
		const slot = opponentSlots[i];
		if (slot && slot.pokemon.hp > 0) {
			html += `<div style="text-align: center; flex: 1;">`;
			html += `<strong>${slot.pokemon.species}</strong> Lv.${slot.pokemon.level}`;
			html += `<br>HP: ${slot.pokemon.hp}/${slot.pokemon.maxHp}`;
			if (slot.status) html += ` [${slot.status.toUpperCase()}]`;
			html += `</div>`;
		} else {
			html += `<div style="flex: 1; text-align: center; color: #999;">Empty</div>`;
		}
	}
	html += `</div>`;
	
	// Player Pokemon (2 slots)
	html += `<div style="display: flex; justify-content: space-around; margin-bottom: 10px;">`;
	for (let i = 0; i < 2; i++) {
		const slot = playerSlots[i];
		if (slot && slot.pokemon.hp > 0) {
			html += `<div style="text-align: center; flex: 1;">`;
			html += `<strong>${slot.pokemon.nickname}</strong> Lv.${slot.pokemon.level}`;
			html += `<br>HP: ${slot.pokemon.hp}/${slot.pokemon.maxHp}`;
			if (slot.status) html += ` [${slot.status.toUpperCase()}]`;
			html += `</div>`;
		} else {
			html += `<div style="flex: 1; text-align: center; color: #999;">Empty</div>`;
		}
	}
	html += `</div>`;
	
	// Message log
	if (messageLog.length > 0) {
		html += `<hr><div style="max-height: 200px; overflow-y: auto;">`;
		for (const msg of messageLog) {
			html += `<p style="margin: 5px 0;">${msg}</p>`;
		}
		html += `</div>`;
	}
	
	// Actions for each player slot
	if (showActions) {
		html += `<hr><h3>Choose Actions</h3>`;
		
		for (let slotIndex = 0; slotIndex < 2; slotIndex++) {
			const slot = playerSlots[slotIndex];
			if (!slot || slot.pokemon.hp <= 0) continue;
			
			html += `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0;">`;
			html += `<h4>${slot.pokemon.nickname} (Slot ${slotIndex + 1})</h4>`;
			
			// Moves
			html += `<p><strong>Moves:</strong> `;
			for (const move of slot.pokemon.moves) {
				const moveData = Dex.moves.get(move.id);
				html += `<button name="send" value="/rpg battleaction move,${slotIndex},${move.id}">${moveData.name} (${move.pp})</button> `;
			}
			html += `</p>`;
			
			// Switch
			html += `<p>`;
			html += `<button name="send" value="/rpg battleaction switch,${slotIndex}">Switch</button>`;
			html += `</p>`;
			
			html += `</div>`;
		}
		
		// Other actions
		html += `<p>`;
		if (battle.battleType === 'wild_double') {
			html += `<button name="send" value="/rpg battleaction catch,0">Catch</button> `;
			html += `<button name="send" value="/rpg battleaction run">Run</button>`;
		}
		html += `</p>`;
	}
	
	html += `</div>`;
	return html;
}

/**
 * Generate victory HTML
 */
export function generateVictoryHTML(
	defeatedOpponentNames: string,
	expMessages: string[],
	moneyGained: number,
	zoneId: string
): string {
	let html = `<div class="infobox">`;
	html += `<h2 style="color: #28a745;">Victory!</h2>`;
	html += `<p>You defeated ${defeatedOpponentNames}!</p>`;
	
	// Experience messages
	for (const msg of expMessages) {
		html += `<p>${msg}</p>`;
	}
	
	// Money
	if (moneyGained > 0) {
		html += `<p>You gained ₽${moneyGained.toLocaleString()}!</p>`;
	}
	
	// Continue button
	html += `<p><button name="send" value="/rpg explore ${zoneId}">Continue Exploring</button></p>`;
	
	html += `</div>`;
	return html;
}

/**
 * Generate defeat HTML
 */
export function generateDefeatHTML(moneyLost: number, opponentName?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2 style="color: #d9534f;">Defeated!</h2>`;
	
	if (opponentName) {
		html += `<p>You were defeated by ${opponentName}!</p>`;
	} else {
		html += `<p>You were defeated!</p>`;
	}
	
	if (moneyLost > 0) {
		html += `<p>You lost ₽${moneyLost.toLocaleString()}...</p>`;
	}
	
	html += `<p>Your Pokemon have been healed.</p>`;
	html += `<p><button name="send" value="/rpg menu">Return to Menu</button></p>`;
	
	html += `</div>`;
	return html;
}

// NOTE: This is a starter UI module with the most common functions extracted.
// Additional UI functions from the original rpg-refactor.ts (lines 4429-5400+)
// can be added here following the same pattern:
// - generateCatchMenuHTML
// - generateSwitchMenuHTML
// - generateFaintSwitchHTML
// - generateMoveLearnHTML
// - generateFieldEffectHTML
// - etc.
//
// This provides the structure while keeping all UI generation
// together in one maintainable file.
