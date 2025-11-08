/*
* Pokemon Showdown
* RPG HTML Generation
*
* This file contains all functions that generate HTML for the RPG UI.
*/

import { Dex, toID } from '../../../sim/dex';
import { getMove, calculateTotalExpForLevel, getActiveSlots } from './utils';
import { ITEMS_DATABASE, ITEM_PRICES } from './items';
import { getShopInventory, getNextShopTier } from './shop';
import { TYPE_CHART } from './data';
import { type ENCOUNTER_ZONES } from './locations';
import { getPlayerData } from './core'; // We will export this from core.ts
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState } from './interface';

// --- UTILITY FUNCTIONS ---

/**
 * Generate bottom navigation buttons for story UI
 * These appear below all story UI screens separated by an HR
 */
export function generateBottomNavigation(): string {
	return `<hr /><p><button name="send" value="/rpg profile" class="button">👤 Profile</button> ` +
		`<button name="send" value="/rpg pokedex" class="button">📖 Pokédex</button> ` +
		`<button name="send" value="/rpg party" class="button">⚡ Party</button> ` +
		`<button name="send" value="/rpg items" class="button">🎒 Items</button></p>`;
}

/**
 * Calculate the experience bar percentage for display.
 * @param expProgress - Current exp progress within the level (experience - expForLastLevel)
 * @param expNeededForLevel - Total exp needed for the level (expForNextLevel - expForLastLevel)
 * @returns A percentage between 0 and 100
 */
function calculateExpBarPercentage(expProgress: number, expNeededForLevel: number): number {
	// Handle edge cases: if expNeededForLevel is 0 or negative, show 100%
	if (expNeededForLevel <= 0) return 100;

	// Calculate percentage and clamp between 0 and 100
	return Math.min(100, Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100)));
}

// --- START INLINE HTML FUNCTIONS (from commands) ---
// These were previously inline in the commands and are now dedicated functions.

export function generateMenuHTML(player: PlayerData): string {
	return `<div class="infobox"><h2>RPG Menu - ${player.name}</h2><p><strong>Location:</strong> ${player.location} | <strong>Money:</strong> ₽${player.money}</p><p>What would you like to do?</p><p><button name="send" value="/rpg profile" class="button">👤 Profile</button><button name="send" value="/rpg party" class="button">⚡ Party</button><button name="send" value="/rpg battle" class="button">⚔️ Battle</button><button name="send" value="/rpg explore" class="button">🗺️ Explore</button></p><p><button name="send" value="/rpg pokedex" class="button">📖 Pokédex</button><button name="send" value="/rpg items" class="button">🎒 Items</button><button name="send" value="/rpg pc" class="button">💻 Pokemon PC</button></p><p><button name="send" value="/rpg save" class="button">💾 Save Game</button><button name="send" value="/rpg load" class="button">📁 Load Game</button></p></div>`;
}

export function generateProfileHTML(player: PlayerData): string {
	return `<div class="infobox"><h2>Player Profile</h2><p><strong>Trainer:</strong> ${player.name}</p><p><strong>Level:</strong> ${player.level}</p><p><strong>Badges:</strong> ${player.badges}</p><p><strong>Pokemon in Party:</strong> ${player.party.length}</p><p><strong>Money:</strong> ₽${player.money}</p>` +
		generateBottomNavigation() + `</div>`;
}

export function generateBuyHTML(player: PlayerData, item: Omit<InventoryItem, 'quantity'>, quantity: number, totalCost: number): string {
	return `<div class="infobox"><h2>Purchase Complete!</h2><p>You bought <strong>${quantity}x ${item.name}</strong> for ₽${totalCost}!</p><p><strong>Money remaining:</strong> ₽${player.money}</p><p><button name="send" value="/rpg shop" class="button">Continue Shopping</button><button name="send" value="/rpg items" class="button">View Inventory</button></p></div>`;
}

export function generateSellMenuHTML(player: PlayerData): string {
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
	return html;
}

export function generateSellConfirmHTML(player: PlayerData, item: InventoryItem, quantity: number, totalGain: number): string {
	return `<div class="infobox"><h2>Item Sold!</h2><p>You sold <strong>${quantity}x ${item.name}</strong> for ₽${totalGain}!</p><p><strong>Money remaining:</strong> ₽${player.money}</p><p><button name="send" value="/rpg sell" class="button">Sell More</button><button name="send" value="/rpg shop" class="button">Back to Shop</Gbutton></p></div>`;
}

export function generateExploreHTML(player: PlayerData, availableZones: string[], zoneData: typeof ENCOUNTER_ZONES): string {
	let exploreButtons = '';
	if (availableZones.length > 0) {
		for (const zoneId of availableZones) {
			const zone = zoneData[zoneId];
			const icon = zone.battleType === 'double' ? '👥' : '🛤️';
			exploreButtons += `<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">${icon} ${zone.name}</button>`;
		}
	} else {
		exploreButtons = `<p>There's nowhere to explore here right now.</p>`;
	}

	// --- EXAMPLE of how to add a trainer ---
	// You would add logic here to check if the trainer should appear
	// For example: if (!player.badges.includes('boulder')) {
	exploreButtons += `<button name="send" value="/rpg challenge gym_brock" class="button">🔥 Challenge Brock</button>`;
	// }

	const exploreHTML = `<div class="infobox">` +
		`<h2>Explore ${player.location}</h2>` +
		`<p>Choose where to go:</p>` +
		`<p>${exploreButtons}</p>` +
		`<hr />` +
		`<p>` +
		`<button name="send" value="/rpg shop" class="button">🏪 Poké Mart</button>` +
		`<button name="send" value="/rpg heal" class="button">🏥 Pokémon Center</button>` +
		`</p>` +
		generateBottomNavigation() +
		`</div>`;
	return exploreHTML;
}

export function generateRunHTML(zoneId: string): string {
	return `<div class="infobox">` +
		`<h2>Got away safely!</h2>` +
		`<p>You ran away from the wild Pokemon.</p>` +
		`<p>` +
		`<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button>` +
		`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
		`</p>` +
		`</div>`;
}

export function generateHealHTML(): string {
	return `<div class="infobox"><h2>Pokemon Healed!</h2><p>Welcome to the Pokémon Center. We've restored your Pokémon to full health.</p><p>We hope to see you again!</p><p><button name="send" value="/rpg party" class="button">View Party</button><button name="send" value="/rpg explore" class="button">Explore</button></p></div>`;
}

export function generateResetHTML(): string {
	return `<div class="infobox"><h2>RPG Progress Reset</h2><p>All of your RPG progress has been reset!</p><p>Your profile, party, PC storage, inventory, and battle state have all been cleared.</p><p>You can start fresh by typing <code>/rpg start</code>.</p></div>`;
}

export function generateUnstuckHTML(): string {
	return `<div class="infobox"><h2>Battle Exited</h2><p>You have been removed from your battle.</p><p>Your Pokémon's status has been saved, and you can now use other RPG commands again.</p>` +
		generateBottomNavigation() + `</div>`;
}

export function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	showActions = false,
	slotInfo?: { index: number, partyLength: number }
): string {
	const pokemon = slot.pokemon;
	const statStages = slot.statStages;

	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';

	let expBarHTML = '';
	if (isPlayerSide) {
		const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
		const expForNextLevel = pokemon.expToNextLevel;
		const expProgress = pokemon.experience - expForLastLevel;
		const expNeededForLevel = expForNextLevel - expForLastLevel;
		const expPercentage = calculateExpBarPercentage(expProgress, expNeededForLevel);
		expBarHTML = `<div style="border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 8px; border-radius: 8px;"></div></div>`;
	}

	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? `<span style="background-color: ${statusColors[displayStatus]}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">${displayStatus}</span>` : '';
	const confusedTag = slot.isConfused ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>` : '';
	const cursedTag = slot.isCursed ? `<span style="background-color: #705898; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Cursed</span>` : '';
	const seededTag = slot.isSeeded ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Seeded</span>` : '';
	const nightmareTag = slot.hasNightmare ? `<span style="background-color: #503870; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Nightmare</span>` : '';
	const trappedTag = slot.isTrapped ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Trapped</span>` : '';
	const tauntTag = slot.tauntTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Taunted</span>` : '';
	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = getMove(slot.chargingMove).name || 'Attack';
		let chargeText = `Preparing ${moveName}!`;
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">${chargeText}</span>`;
	}

	const substituteTag = slot.substitute ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Substitute (${slot.substitute.hp} HP)</span>` : '';
	const yawnTag = slot.yawnCounter ? `<span style="background-color: #9898E8; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Drowsy (${slot.yawnCounter})</span>` : '';
	const disableTag = slot.disabledMove ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Disabled: ${slot.disabledMove.moveId}</span>` : '';
	const encoreTag = slot.encoreMove ? `<span style="background-color: #F85888; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Encored: ${slot.encoreMove.moveId}</span>` : '';
	const tormentTag = slot.tormentActive ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Tormented</span>` : '';
	const focusEnergyTag = slot.focusEnergy ? `<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Focused</span>` : '';
	const ingrainTag = slot.isIngrained ? `<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Ingrained</span>` : '';
	const aquaRingTag = slot.hasAquaRing ? `<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Aqua Ring</span>` : '';
	const magnetRiseTag = slot.magnetRiseTurns > 0 ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Levitating (${slot.magnetRiseTurns})</span>` : '';
	const telekinesisTag = slot.telekinesisCounter > 0 ? `<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Telekinesis (${slot.telekinesisCounter})</span>` : '';
	const smackdownTag = slot.isSmackedDown ? `<span style="background-color: #B8A038; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Grounded</span>` : '';
	const embargoTag = slot.embargoTurns > 0 ? `<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Embargo (${slot.embargoTurns})</span>` : '';
	const healBlockTag = slot.healBlockTurns > 0 ? `<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Heal Block (${slot.healBlockTurns})</span>` : '';
	const chargeTag = slot.isCharged ? `<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Charged</span>` : '';
	const stockpileTag = slot.stockpileCount > 0 ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Stockpile ×${slot.stockpileCount}</span>` : '';
	const lockedMoveTag = slot.lockedMove ? `<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Locked</span>` : '';

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	let statStageTags = '';
	if (statStages) {
		for (const stat in statStages) {
			const stage = statStages[stat as keyof typeof statStages];
			if (stage > 0) {
				statStageTags += ` <span style="color: green; font-size: 11px;">🔼${stat.toUpperCase()}</span>`;
			} else if (stage < 0) {
				statStageTags += ` <span style="color: red; font-size: 11px;">🔽${stat.toUpperCase()}</span>`;
			}
		}
	}

	// Start the main div
	let html = `<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;">`;

	// Add the optional slot/swap button header
	if (slotInfo) {
		html += `<div style="margin-bottom: 5px;"><strong>Slot ${slotInfo.index + 1}:</strong>`;
		if (slotInfo.index > 0) {
			html += ` <button name="send" value="/rpg swapslot ${slotInfo.index} ${slotInfo.index - 1}" class="button" style="font-size: 12px;">↑</button>`;
		}
		if (slotInfo.index < slotInfo.partyLength - 1) {
			html += ` <button name="send" value="/rpg swapslot ${slotInfo.index} ${slotInfo.index + 1}" class="button" style="font-size: 12px;">↓</button>`;
		}
		html += `</div>`;
	}

	// Add the rest of the Pokemon info
	const typeDisplay = slot.terastallized ? `Tera ${slot.terastallized}` : species.types.join('/');

	html += `<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})${statusTag}${confusedTag}${cursedTag}${seededTag}${nightmareTag}${trappedTag}${tauntTag}${chargingTag}${yawnTag}${substituteTag}${disableTag}${encoreTag}${tormentTag}${focusEnergyTag}${ingrainTag}${aquaRingTag}${magnetRiseTag}${telekinesisTag}${smackdownTag}${embargoTag}${healBlockTag}${chargeTag}${stockpileTag}${lockedMoveTag}${statStageTags}<br><small>Type: ${typeDisplay}</small><br><div style="border-radius: 10px; padding: 2px; margin: 5px 0; position: relative;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div><div style="position: absolute; top: 2px; left: 0; right: 0; text-align: center; font-size: 10px; line-height: 10px; color: #000;">HP: ${pokemon.hp}/${pokemon.maxHp}</div></div>`;

	// --- Conditional info for player Pokemon only ---
	if (isPlayerSide) {
		html += `${expBarHTML}`;
		html += `EXP: ${pokemon.experience}/${pokemon.expToNextLevel}<br>`;
		html += `Nature: ${pokemon.nature}<br>`;
		html += `Ability: ${pokemon.ability || 'Unknown'}<br>`;
		if (pokemon.item) {
			html += `Held Item: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item}<br>`;
		}
	}

	if (showActions) {
		const itemButton = pokemon.item ?
			`<button name="send" value="/rpg takeitem ${pokemon.id}" class="button" style="font-size: 12px;">Take Item</button>` :
			`<button name="send" value="/rpg giveitem ${pokemon.id}" class="button" style="font-size: 12px;">Give Item</button>`;
		html += `<br><div style="margin-top: 8px;"><button name="send" value="/rpg summary ${pokemon.id}" class="button" style="font-size: 12px;">Summary</button> ${itemButton} <button name="send" value="/rpg depositpc ${pokemon.id}" class="button" style="font-size: 12px;">Deposit</button></div>`;
	}

	html += '</div>';
	return html;
}

export function generateSharedBattlePokemonInfo(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	isDoubleBattle: boolean,
	ownerName?: string // <-- NEW PARAMETER
): string {
	const pokemon = slot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';

	// --- EXP BAR REMOVED ---

	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? '<span style="background-color: ' + statusColors[displayStatus] + '; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">' + displayStatus + '</span>' : '';

	const volatileTags = [
		slot.isConfused ? '<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>' : '',
		slot.isCursed ? '<span style="background-color: #705898; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Cursed</span>' : '',
		slot.isSeeded ? '<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Seeded</span>' : '',
		slot.hasNightmare ? '<span style="background-color: #503870; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Nightmare</span>' : '',
		slot.isTrapped ? '<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Trapped</span>' : '',
		slot.tauntTurns > 0 ? '<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Taunted</span>' : '',
		slot.substitute ? '<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Substitute' + (isDoubleBattle ? '' : ' (' + String(slot.substitute.hp) + ' HP)') + '</span>' : '',
		slot.yawnCounter ? '<span style="background-color: #9898E8; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Drowsy (' + String(slot.yawnCounter) + ')</span>' : '',
		slot.disabledMove ? '<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Disabled: ' + slot.disabledMove.moveId + '</span>' : '',
		slot.encoreMove ? '<span style="background-color: #F85888; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Encored: ' + slot.encoreMove.moveId + '</span>' : '',
		slot.tormentActive ? '<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Tormented</span>' : '',
		slot.focusEnergy ? '<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Focused</span>' : '',
		slot.isIngrained ? '<span style="background-color: #78C850; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Ingrained</span>' : '',
		slot.hasAquaRing ? '<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Aqua Ring</span>' : '',
		slot.magnetRiseTurns && slot.magnetRiseTurns > 0 ? '<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Levitating (' + String(slot.magnetRiseTurns) + ')</span>' : '',
		slot.telekinesisCounter && slot.telekinesisCounter > 0 ? '<span style="background-color: #A040A0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Telekinesis (' + String(slot.telekinesisCounter) + ')</span>' : '',
		slot.isSmackedDown ? '<span style="background-color: #B8A038; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Grounded</span>' : '',
		slot.embargoTurns && slot.embargoTurns > 0 ? '<span style="background-color: #705848; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Embargo (' + String(slot.embargoTurns) + ')</span>' : '',
		slot.healBlockTurns && slot.healBlockTurns > 0 ? '<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Heal Block (' + String(slot.healBlockTurns) + ')</span>' : '',
		slot.isCharged ? '<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Charged</span>' : '',
		slot.stockpileCount && slot.stockpileCount > 0 ? '<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Stockpile ×' + String(slot.stockpileCount) + '</span>' : '',
		slot.lockedMoveCounter && slot.lockedMoveCounter > 0 ? '<span style="background-color: #C03028; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Rampage' + (isDoubleBattle ? '' : ': ' + (slot.lockedMove || '') + ' (' + String(slot.lockedMoveCounter) + ')') + '</span>' : '',
		slot.uproarTurns && slot.uproarTurns > 0 ? '<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Uproar (' + String(slot.uproarTurns) + ')</span>' : '',
		slot.lockedMove && slot.lockedMoveCounter === 0 && slot.uproarTurns === 0 ? '<span style="background-color: #A8A878; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Locked' + (isDoubleBattle ? '' : ': ' + slot.lockedMove) + '</span>' : '',
		slot.mustRecharge ? '<span style="background-color: #F8D030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Must Recharge</span>' : '',
		slot.isProtected ? '<span style="background-color: #4A90E2; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Protected</span>' : '',
		slot.isRedirecting ? '<span style="background-color: #D0021B; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Center of Attention</span>' : '',
		slot.isHelped ? '<span style="background-color: #417505; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Helped</span>' : '',
	].filter(Boolean).join('');

	const abilityTags = [
		slot.flashFireBoost ? '<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Fire Boost</span>' : '',
		slot.analyticBoost ? '<span style="background-color: #6c757d; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Analytic</span>' : '',
		slot.slowStartTurns !== undefined && slot.slowStartTurns > 0 ? '<span style="background-color: #F08030; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Slow Start (' + String(slot.slowStartTurns) + ')</span>' : '',
		slot.unburdenActive ? '<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Unburden</span>' : '',
	].filter(Boolean).join('');

	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = getMove(slot.chargingMove).name || 'Attack';
		let chargeText = 'Preparing ' + moveName + '!';
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = '<span style="background-color: #6890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">' + chargeText + '</span>';
	}

	let statStageTags = '';
	if (slot.statStages) {
		for (const stat in slot.statStages) {
			const stage = slot.statStages[stat as keyof typeof slot.statStages];
			if (stage > 0) {
				statStageTags += ' <span style="color: green; font-size: 11px;">🔼' + stat.toUpperCase() + '</span>';
			} else if (stage < 0) {
				statStageTags += ' <span style="color: red; font-size: 11px;">🔽' + stat.toUpperCase() + '</span>';
			}
		}
	}

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	// --- NEW: Prepare owner name prefix ---
	const namePrefix = ownerName ? ownerName + "'s " : '';

	// --- HP Bar (12px height) ---
	const hpBarHTML =
		'<div style="max-width: 120px; height: 12px; background: #f0f0f0; border: 1px solid #aaa; border-radius: 8px; position: relative; margin-top: 4px; margin-left: auto; margin-right: auto;">' +
		'<div style="background: ' + hpBarColor + '; width: ' + String(hpPercentage) + '%; height: 100%; border-radius: 7px;"></div>' +
		'<span style="position: absolute; right: 0; top: 0; background: #b0b0b0; color: #fff; font-size: 9px; font-weight: bold; padding: 0 5px; line-height: 12px; height: 100%; border-radius: 0 7px 7px 0;">' +
		String(hpPercentage) + '%' +
		'</span>' +
		'</div>';

	// --- Status tags ---
	const allStatusTags = '' + statusTag + volatileTags + abilityTags + chargingTag + statStageTags;
	const statusDisplay = allStatusTags || '&nbsp;'; // Non-breaking space for height

	if (isDoubleBattle) {
		// --- NEW COMPACT DOUBLE BATTLE UI ---
		let html = ''; // Start with an empty string
		// Add psicon next to name
		html += '<div style="font-weight: bold; font-size: 1.1em;">';
		html += '<psicon pokemon="' + species.id + '" style="vertical-align: -5px;"></psicon> '; // <-- ADD ICON
		html += namePrefix + (pokemon.nickname || pokemon.species) + ' ' + genderSymbol + shinySymbol + ' L' + String(pokemon.level); // <-- MODIFIED LINE
		html += '</div>';
		html += hpBarHTML; // Keep the new HP bar
		// --- 64x64 SPRITE IS REMOVED ---
		html += '<div style="margin-top: 5px; font-size: 10px; line-height: 1.4;">' + statusDisplay + '</div>';
		return html;
	} else {
		// --- SINGLE BATTLE UI (The "perfect" layout) ---

		// --- Pokemon Sprite (ONLY for single battles) ---
		const spriteDir = pokemon.shiny ? 'gen5-shiny' : 'gen5';
		const spriteHTML =
			'<div style="text-align: center; margin-top: 4px;">' + // Centering container
			'<img src="https://play.pokemonshowdown.com/sprites/' + spriteDir + '/' + species.id + '.png" width="64" height="64" />' +
			'</div>';

		let html = '<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;">';
		html += '<div style="font-weight: bold; font-size: 1.1em;">';
		html += namePrefix + (pokemon.nickname || pokemon.species) + ' ' + genderSymbol + shinySymbol + ' L' + String(pokemon.level); // <-- MODIFIED LINE
		html += '</div>';
		html += hpBarHTML;
		html += spriteHTML; // --- ADDED SPRITE (for singles) ---
		html += '<div style="margin-top: 5px; font-size: 10px; line-height: 1.4;">' + statusDisplay + '</div>';
		html += '</div>';
		return html;
	}
}

export const TERA_BUTTON_STYLE = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; color: #FF1493; font-weight: bold; margin-top: 4px; font-size: 0.8em; border: 2px solid #FF1493;';

/**
 * [NEW HELPER]
 * Generates small HTML tags for side-specific field effects (screens, hazards).
 */
function generateSideEffectTags(battle: BattleState, side: 'player' | 'opponent'): string {
	const effects: string[] = [];
	const reflectTurns = (side === 'player') ? battle.playerReflectTurns : battle.opponentReflectTurns;
	const lightScreenTurns = (side === 'player') ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
	const auroraVeilTurns = (side === 'player') ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
	const hazards = (side === 'player') ? battle.playerHazards : battle.opponentHazards;
	const quickGuard = (side === 'player') ? battle.playerQuickGuard : battle.opponentQuickGuard;
	const wideGuard = (side === 'player') ? battle.playerWideGuard : battle.opponentWideGuard;
	const craftyShield = (side === 'player') ? battle.playerCraftyShield : battle.opponentCraftyShield;

	// Style to roughly match the <h3> text size
	const tagStyle = 'font-size: 0.8em; padding: 1px 4px; border-radius: 3px; color: white; margin-left: 4px; vertical-align: middle; text-shadow: 1px 1px 1px #333;';

	if (reflectTurns > 0) effects.push('<span style="background-color: #A890F0; ' + tagStyle + '">Reflect</span>');
	if (lightScreenTurns > 0) effects.push('<span style="background-color: #F8D030; ' + tagStyle + '">Light Screen</span>');
	if (auroraVeilTurns > 0) effects.push('<span style="background-color: #98D8D8; ' + tagStyle + '">Aurora Veil</span>');
	if (quickGuard) effects.push('<span style="background-color: #F08030; ' + tagStyle + '">Quick Guard</span>');
	if (wideGuard) effects.push('<span style="background-color: #6890F0; ' + tagStyle + '">Wide Guard</span>');
	if (craftyShield) effects.push('<span style="background-color: #F85888; ' + tagStyle + '">Crafty Shield</span>');

	if (hazards.includes('stealthrock')) effects.push('<span style="background-color: #B8A038; ' + tagStyle + '">SR</span>');
	const spikes = hazards.filter(h => h === 'spikes').length;
	if (spikes > 0) effects.push('<span style="background-color: #A8A878; ' + tagStyle + '">Spikes ' + String(spikes) + '</span>');
	const toxicSpikes = hazards.filter(h => h === 'toxicspikes').length;
	if (toxicSpikes > 0) effects.push('<span style="background-color: #A040A0; ' + tagStyle + '">TSP ' + String(toxicSpikes) + '</span>');
	if (hazards.includes('stickyweb')) effects.push('<span style="background-color: #705898; ' + tagStyle + '">Web</span>');

	return effects.join(' ');
}

export function generateSingleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }
): string {
	const playerSlot = battle.playerSlots[0];
	const opponentSlot = battle.opponentSlots[0];

	if (!playerSlot || !opponentSlot) {
		return '<div class="infobox"><h2>Battle Error!</h2><p>Active Pokémon slots are missing.</p>' +
			generateBottomNavigation() + '</div>';
	}

	const playerPokemon = playerSlot.pokemon;
	const player = getPlayerData(battle.playerId);

	// --- FIELD EFFECTS HELPER REMOVED ---

	let actionHTML = '';
	let moveButtonsHTML = '';

	const allMovesOutOfPP = playerPokemon.moves.every(m => m.pp === 0);

	if (allMovesOutOfPP) {
		// --- MODIFIED: Button style and content for new size ---
		const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left;';
		const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">Struggle</div>' +
			'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
			'<span>Normal</span>' +
			'<span style="float: right;">-- / --</span>' +
			'</div> ';

		moveButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"><button name="send" value="/rpg battleaction move 0 struggle 2" class="button" style="' + buttonStyle + '">' + buttonContent + '</button></td>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '</table>';
	} else {
		const canTerastallize = !battle.playerTerastallizeUsed && !playerSlot.terastallized;

		const moveButtons = playerPokemon.moves.map(move => {
			const moveData = getMove(move.id);

			// Use the validation function to check if a move is disabled
			// We need to import validateMoveAction, but that's in battle-engine.ts
			// For now, we will do a simple check.
			// const validationError = validateMoveAction(playerSlot, move.id, battle);
			const isDisabled = (playerSlot.disabledMove && playerSlot.disabledMove.moveId === move.id) ||
				(playerSlot.encoreMove && playerSlot.encoreMove.moveId !== move.id) ||
				(playerSlot.tauntTurns > 0 && moveData.category === 'Status') ||
				(playerSlot.lockedMoveCounter > 0 && playerSlot.lockedMove !== move.id) ||
				(playerSlot.uproarTurns > 0 && playerSlot.lockedMove !== move.id) ||
				(playerSlot.lockedMove && playerSlot.lockedMoveCounter === 0 && playerSlot.uproarTurns === 0 && playerSlot.lockedMove !== move.id) ||
				move.pp === 0;

			// --- MODIFIED: Button style and content for new size ---
			const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left;';
			const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">' + moveData.name + '</div>' +
				'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
				'<span>' + moveData.type + '</span>' +
				'<span style="float: right;">' + String(move.pp) + ' / ' + String(moveData.pp) + '</span>' +
				'</div> ';

			const normalButton = '<button name="send" value="/rpg battleaction move 0 ' + move.id + ' 2" class="button" ' + (isDisabled ? 'disabled' : '') + ' style="' + buttonStyle + '">' +
				' ' + buttonContent + '</button>';

			// Add Tera option if can terastallize
			if (canTerastallize && !isDisabled) {
				// --- MODIFIED: Added <br> to force Tera button below ---
				return '<div>' + normalButton + '<br>' + '<button name="send" value="/rpg battleaction move 0 ' + move.id + ' 2 terastallize" class="button" style="' + TERA_BUTTON_STYLE + '">⭐ Tera + ' + moveData.name + '</button></div>';
			}
			return normalButton;
		});

		moveButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[0] || '') + '</td>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[1] || '') + '</td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[2] || '') + '</td>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[3] || '') + '</td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '</table>';
	}

	// --- MODIFIED: Added styles and centered p tag ---
	const bottomButtonStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle;';
	const bottomButtonDisabledStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle; opacity: 0.6; cursor: not-allowed;';

	const switchButton = '<button name="send" value="/rpg battleaction switchmenu" class="button" style="' + bottomButtonStyle + '">🔄 Switch</button>';

	const catchButton = (battle.battleType === 'wild') ?
		'<button name="send" value="/rpg battleaction catchmenu" class="button" style="' + bottomButtonStyle + '">⚽ Catch</button>' :
		'<button class="button" disabled style="' + bottomButtonDisabledStyle + '">⚽ Catch</button>';

	const runButton = (battle.battleType === 'wild' && !playerSlot.isTrapped) ?
		'<button name="send" value="/rpg battleaction run" class="button" style="' + bottomButtonStyle + '">🏃 Run</button>' :
		'<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';

	actionHTML = '<p style="margin-top: 5px; font-weight: bold;">What will ' + (playerPokemon.nickname || playerPokemon.species) + ' do?</p>' +
		moveButtonsHTML +
		'<p style="margin-top: 5px; text-align: center;">' + switchButton + catchButton + runButton + '</p>';
	// --- END MODIFICATION ---

	// --- FIELD EFFECTS TAGS REMOVED ---

	const playerName = player ? player.name : "Your";

	// --- NEW: Determine opponent owner name ---
	let opponentOwnerName: string | undefined = battle.opponentName;
	if (battle.battleType === 'wild') {
		opponentOwnerName = 'Wild';
	}

	// --- REMOVED HEADER ---
	return '<div class="infobox">' +
		'<table style="width: 100%; margin-bottom: 5px;">' +
		'<tr>' +
		'<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">' +
		// --- H3 TAG REMOVED ---
		'' + generateSharedBattlePokemonInfo(playerSlot, true, false, playerName) + '' + // <-- MODIFIED CALL
		'</td>' +
		'<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">' +
		// --- H3 TAG REMOVED ---
		'' + generateSharedBattlePokemonInfo(opponentSlot, false, false, opponentOwnerName) + '' + // <-- MODIFIED CALL
		'</td>' +
		'</tr>' +
		'</table>' +
		'<div style="padding: 8px; margin: 5px 0; border: 1px solid #666; min-height: 50px; max-height: 100px; overflow-y: auto; border-radius: 5px;">' + messageLog.join('<br>') + '</div>' +
		actionHTML +
		'</div>';
}

export function generateDoubleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }
): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;
	const player = getPlayerData(battle.playerId);
	const playerName = player ? player.name : "Your";

	// --- NEW: Determine opponent owner name ---
	let opponentOwnerName: string | undefined = battle.opponentName;
	if (battle.battleType === 'wild_double') {
		opponentOwnerName = 'Wild';
	}

	// Helper to generate HTML for a single slot, handling styling
	const generateSlotHTML = (slot: ActivePokemonSlot | null, slotIndex: number, side: 'player' | 'opponent') => {
		if (!slot) {
			// --- FIX: Removed min-height: 120px; ---
			return '<div style="border: 1px dashed #ccc; padding: 10px; margin: 5px; border-radius: 5px; text-align: center; color: #888;">(Empty)</div>';
		}

		// --- Determine owner name ---
		let ownerName: string | undefined = undefined;
		if (side === 'player') {
			ownerName = playerName;
		} else {
			ownerName = opponentOwnerName; // Use the new logic
		}

		if (slot.pokemon.hp <= 0) {
			return '<div style="opacity: 0.5; padding: 10px; margin: 5px; border-radius: 5px;">' + generateSharedBattlePokemonInfo(slot, side === 'player', true, ownerName) + '</div>'; // <-- MODIFIED CALL
		}

		let borderStyle = "1px solid #ccc";
		if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
			borderStyle = "3px dashed #007bff";
		}
		if (battle.pendingActions[slotIndex]) {
			borderStyle = "3px solid #28a745";
		}

		return '<div style="border: ' + borderStyle + '; padding: 10px; margin: 5px; border-radius: 5px;">' + generateSharedBattlePokemonInfo(slot, side === 'player', true, ownerName) + '</div>'; // <-- MODIFIED CALL
	};

	// --- FIELD EFFECTS HELPER REMOVED ---

	// --- FIELD EFFECTS TAGS REMOVED ---

	// --- REMOVED HEADER ---
	let html = '<div class="infobox">';

	// --- Pokemon Display (4 Pokemon in 2x2 grid) ---
	html += '<table style="width: 100%; margin-bottom: 5px;">';
	// Opponent Side (Top Row)
	html += '<tr>';
	html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
	// --- H3 TAG REMOVED ---
	html += generateSlotHTML(oSlot0, 2, 'opponent');
	html += '</td>';
	html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
	// --- H3 TAG REMOVED ---
	html += generateSlotHTML(oSlot1, 3, 'opponent');
	html += '</td>';
	html += '</tr>';
	// Player Side (Bottom Row)
	html += '<tr>';
	html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
	// --- H3 TAG REMOVED ---
	html += generateSlotHTML(pSlot0, 0, 'player');
	html += '</td>';
	html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
	// --- H3 TAG REMOVED ---
	html += generateSlotHTML(pSlot1, 1, 'player');
	html += '</td>';
	html += '</tr>';
	html += '</table>';

	// --- Message Log ---
	html += '<div style="padding: 8px; margin: 10px 0; border: 1px solid #666; min-height: 50px; max-height: 100px; overflow-y: auto; border-radius: 5px;">' + messageLog.join('<br>') + '</div>';

	// --- Action Area ---
	if (targetSelection) {
		// --- STATE 2: Target Selection ---
		const move = getMove(targetSelection.moveId);
		const teraText = targetSelection.shouldTerastallize ? ' (with Terastallization)' : '';
		html += '<p style="margin-top: 5px; font-weight: bold;">Select a target for <strong>' + move.name + '</strong>' + teraText + ':</p>';

		const targets = [
			{ slot: pSlot0, name: "Ally 1", index: 0 },
			{ slot: pSlot1, name: "Ally 2", index: 1 },
			{ slot: oSlot0, name: "Opponent 1", index: 2 },
			{ slot: oSlot1, name: "Opponent 2", index: 3 },
		];

		// --- FIX: Reduced padding from 12px to 8px and removed max-height ---
		const buttonStyle = 'width: 100%; padding: 8px; border-radius: 8px; box-sizing: border-box; text-align: center; margin: 0;';
		const teraParam = targetSelection.shouldTerastallize ? ' terastallize' : '';
		const targetButtons = targets
			.filter(target => target.slot && target.slot.pokemon.hp > 0 && target.index !== targetSelection.attackerSlotIndex)
			.map(target => {
				return '<button name="send" value="/rpg battleaction move ' + String(targetSelection.attackerSlotIndex) + ' ' + targetSelection.moveId + ' ' + String(target.index) + teraParam + '" class="button" style="' + buttonStyle + '">' + target.name + '</button>';
			});

		let targetButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
		targetButtonsHTML += '<tr>';
		targetButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (targetButtons[0] || '') + '</td>';
		targetButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (targetButtons[1] || '') + '</td>';
		targetButtonsHTML += '</tr>';
		targetButtonsHTML += '<tr>';
		targetButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (targetButtons[2] || '') + '</td>';
		targetButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (targetButtons[3] || '') + '</td>';
		targetButtonsHTML += '</tr>';
		targetButtonsHTML += '</table>';

		html += targetButtonsHTML;
		html += '<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction back" class="button" style="' + buttonStyle + '">Cancel</button></p>';
	} else {
		// --- STATE 1: Action Selection ---
		let activeSlot: ActivePokemonSlot | null = null;
		let activeSlotIndex = -1;

		if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
			activeSlot = pSlot0;
			activeSlotIndex = 0;
		} else if (pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
			activeSlot = pSlot1;
			activeSlotIndex = 1;
		}

		if (activeSlot) {
			const pokemon = activeSlot.pokemon;
			html += '<p style="margin-top: 5px; font-weight: bold;">What will <strong>' + (pokemon.nickname || pokemon.species) + '</strong> do?</p>';

			const allMovesOutOfPP = pokemon.moves.every(m => m.pp === 0);
			let moveButtonsHTML = '';

			if (allMovesOutOfPP) {
				// --- MODIFIED: Button style and content for new size ---
				const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left; margin: 0;';
				const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">Struggle</div>' +
					'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
					'<span>Normal</span>' +
					'<span style="float: right;">-- / --</span>' +
					'</div>';

				const struggleButton = '<button name="send" value="/rpg battleaction selecttarget ' + String(activeSlotIndex) + ' struggle" class="button" style="' + buttonStyle + '">' + buttonContent + '</button>';
				moveButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;"><tr><td style="padding: 0; vertical-align: top;">' + struggleButton + '</td><td style="padding: 0; vertical-align: top;"></td></tr><tr><td style="padding: 0; vertical-align: top;"></td><td style="padding: 0; vertical-align: top;"></td></tr></table>';
			} else {
				const canTerastallizeThisSlot = !battle.playerTerastallizeUsed && !activeSlot.terastallized;

				// --- MODIFIED: Button style and content for new size ---
				const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left; margin: 0;';
				const moveButtons = pokemon.moves.map(move => {
					const moveData = getMove(move.id);

					// Use the validation function to check if a move is disabled
					// We need to import validateMoveAction, but that's in battle-engine.ts
					// For now, we will do a simple check.
					const isDisabled = (activeSlot.disabledMove && activeSlot.disabledMove.moveId === move.id) ||
						(activeSlot.encoreMove && activeSlot.encoreMove.moveId !== move.id) ||
						(activeSlot.tauntTurns > 0 && moveData.category === 'Status') ||
						(activeSlot.lockedMoveCounter > 0 && activeSlot.lockedMove !== move.id) ||
						(activeSlot.uproarTurns > 0 && activeSlot.lockedMove !== move.id) ||
						(activeSlot.lockedMove && activeSlot.lockedMoveCounter === 0 && activeSlot.uproarTurns === 0 && activeSlot.lockedMove !== move.id) ||
						move.pp === 0;

					const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">' + moveData.name + '</div>' +
						'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
						'<span>' + moveData.type + '</span>' +
						'<span style="float: right;">' + String(move.pp) + ' / ' + String(moveData.pp) + '</span>' +
						'</div>';

					const normalButton = '<button name="send" value="/rpg battleaction selecttarget ' + String(activeSlotIndex) + ' ' + move.id + '" class="button" ' + (isDisabled ? 'disabled' : '') + ' style="' + buttonStyle + '">' + buttonContent + '</button>';

					// Add Tera option if can terastallize
					if (canTerastallizeThisSlot && !isDisabled) {
						// --- MODIFIED: Added <br> to force Tera button below ---
						return '<div>' + normalButton + '<br>' + '<button name="send" value="/rpg battleaction selecttarget ' + String(activeSlotIndex) + ' ' + move.id + ' terastallize" class="button" style="' + TERA_BUTTON_STYLE + '">⭐ Tera + ' + moveData.name + '</button></div>';
					}
					return normalButton;
				});

				moveButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
				moveButtonsHTML += '<tr>';
				moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[0] || '') + '</td>';
				moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[1] || '') + '</td>';
				moveButtonsHTML += '</tr>';
				moveButtonsHTML += '<tr>';
				moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[2] || '') + '</td>';
				moveButtonsHTML += '<td style="padding: 0; vertical-align: top;">' + (moveButtons[3] || '') + '</td>';
				moveButtonsHTML += '</tr>';
				moveButtonsHTML += '</table>';
			}
			html += moveButtonsHTML;
		} else {
			html += '<p style="margin-top: 10px; text-align: center; color: #666;">Waiting for opponent...</p>';
		}

		// --- MODIFIED: Added styles and centered p tag ---
		const bottomButtonStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle;';
		const bottomButtonDisabledStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle; opacity: 0.6; cursor: not-allowed;';

		const switchButton = '<button name="send" value="/rpg battleaction switchmenu" class="button" style="' + bottomButtonStyle + '">🔄 Switch</button>';

		// In double battles, catching is only allowed when one opponent remains (matches Gen 8+ Pokemon games)
		const activeOpponents = getActiveSlots(battle.opponentSlots);
		const canCatch = battle.battleType === 'wild_double' && activeOpponents.length === 1;
		const catchButton = canCatch ?
			'<button name="send" value="/rpg battleaction catchmenu" class="button" style="' + bottomButtonStyle + '">⚽ Catch</button>' :
			'<button class="button" disabled style="' + bottomButtonDisabledStyle + '" title="' + (battle.battleType === 'wild_double' ? 'Can only catch when one opponent remains' : 'Cannot catch in trainer battles') + '">⚽ Catch</button>';

		const runButton = (battle.battleType === 'wild_double') ?
			'<button name="send" value="/rpg battleaction run" class="button" style="' + bottomButtonStyle + '">🏃 Run</button>' :
			'<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';

		html += '<p style="margin-top: 15px; text-align: center;">' +
			switchButton + catchButton + runButton + '</p>';
		// --- END MODIFICATION ---
	}

	html += '</div>';
	return html;
}

/**
 * [NEW ROUTER]
 * Detects battle type and calls the correct UI generator.
 */
export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }
): string {
	if (battle.battleType === 'wild' || battle.battleType === 'trainer') {
		// Use single battle UI
		return generateSingleBattleHTML(battle, messageLog, targetSelection);
	} else {
		// Use double battle UI
		return generateDoubleBattleHTML(battle, messageLog, targetSelection);
	}
}

export function generateWelcomeHTML(): string {
	return `<div class="infobox">` +
		`<h2>Developer Note</h2>` +
		`<p>Welcome to the World of Impulse RPG System!</p>` +
		`<p>This is an immersive Pokémon-style adventure where you'll battle trainers, catch Pokémon, explore locations, and become the Champion!</p>` +
		`<p><strong>Features:</strong></p>` +
		`<ul>` +
		`<li>🎮 Story Mode with 8 Gym Leaders and Elite Four</li>` +
		`<li>⚔️ Wild Pokémon battles and trainer challenges</li>` +
		`<li>📦 Item management and PC storage system</li>` +
		`<li>🌍 Multiple locations to explore</li>` +
		`<li>✨ Evolution, moves, and abilities system</li>` +
		`</ul>` +
		`<p>Ready to begin your adventure?</p>` +
		`<p><button name="send" value="/rpg storymode" class="button">Continue</button></p>` +
		`</div>`;
}

export function generateRPGModeSelectionHTML(): string {
	return `<div class="infobox">` +
		`<h2>RPG Menu</h2>` +
		`<p>Select a game mode to begin:</p>` +
		`<p><button name="send" value="/rpg storymode" class="button">📖 Story Mode</button></p>` +
		`<p><em>More modes will be added in future updates!</em></p>` +
		`</div>`;
}

export function generateStoryModeStartHTML(): string {
	return `<div class="infobox">` +
		`<h2>Professor Oak's Laboratory</h2>` +
		`<p><strong>Professor Oak:</strong> "Ah, welcome! I've been expecting you. I'm Professor Oak, and I've dedicated my life to the study of Pokémon."</p>` +
		`<p>"The world of Pokémon is a vast and wonderful place, filled with creatures of all shapes and sizes. Some people train them, others befriend them, but all share a special bond."</p>` +
		`<p>"Before you begin your journey, you'll need a Pokémon partner. I have three Pokémon here that are perfect for beginning trainers."</p>` +
		`<p><strong>Choose your starter type:</strong></p>` +
		`<p>` +
		`<button name="send" value="/rpg choosestarter fire" class="button">🔥 Fire Type</button>` +
		`<button name="send" value="/rpg choosestarter water" class="button">💧 Water Type</button>` +
		`<button name="send" value="/rpg choosestarter grass" class="button">🌱 Grass Type</button>` +
		`</p>` +
		`</div>`;
}

export function generateStarterSelectionHTML(type: string, starters: string[]): string {
	const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
	let typeDescription = '';
	if (type === 'fire') {
		typeDescription = '"Fire-type Pokémon are passionate and strong! They\'re excellent for trainers who like to take the offensive approach."';
	} else if (type === 'water') {
		typeDescription = '"Water-type Pokémon are versatile and adaptable! They can handle many different situations with grace."';
	} else if (type === 'grass') {
		typeDescription = '"Grass-type Pokémon are resilient and strategic! They excel at wearing down opponents over time."';
	}

	let html = `<div class="infobox">` +
		`<h2>Professor Oak's Laboratory</h2>` +
		`<p><strong>Professor Oak:</strong> ${typeDescription}</p>` +
		`<p>"Now, which ${typeTitle}-type Pokémon would you like to choose as your partner?"</p>` +
		`<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;

	for (const starterId of starters) {
		const species = Dex.species.get(starterId);
		if (species.exists) {
			html += `<div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">` +
				`<strong>${species.name}</strong><br>` +
				`<small>Type: ${species.types.join('/')}</small><br>` +
				`<button name="send" value="/rpg selectstarter ${starterId}" class="button" style="margin-top: 5px;">Choose ${species.name}</button>` +
				`</div>`;
		}
	}
	html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg storymode" class="button">← Back to Type Selection</button></p></div>`;
	return html;
}

export function generatePokemonSummaryHTML(pokemon: RPGPokemon): string {
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	const movesSummary = pokemon.moves.map(move => {
		const moveData = getMove(move.id);
		return '<div style="text-align: center; padding: 5px; border-radius: 5px;">' +
			moveData.name +
			'<br><small>PP: ' + String(move.pp) + '/' + String(moveData.pp) + '</small>' +
			'</div>';
	}).join('');

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	return '<div class="infobox">' +
		'<h2>' + pokemon.nickname + '\'s Summary ' + shinySymbol + '</h2>' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<p><strong>Species:</strong> ' + pokemon.species + ' ' + genderSymbol + '</p>' +
		'<p><strong>Level:</strong> ' + String(pokemon.level) + '</p>' +
		'<p><strong>Nature:</strong> ' + pokemon.nature + '</p>' +
		'<p><strong>Ability:</strong> ' + (pokemon.ability || 'Unknown') + '</p>' +
		'<p><strong>Tera Type:</strong> <span style="background-color: #FF1493; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">⭐ ' + pokemon.teraType + '</span></p>' +
		'<p><strong>Held Item:</strong> ' + (pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None') + '</p>' +
		'</div>' +
		'<div style="flex-basis: 48%;">' +
		'<h4>Stats</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + String(pokemon.maxHp) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + String(pokemon.atk) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + String(pokemon.def) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + String(pokemon.spa) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + String(pokemon.spd) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + String(pokemon.spe) + '</td></tr>' +
		'</table>' +
		'</div>' +
		'</div>' +
		'<hr />' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<h4>Trainer Memo</h4>' +
		'<p><strong>ID:</strong> ' + pokemon.id + '</p>' +
		'<p><strong>Caught In:</strong> ' + (ITEMS_DATABASE[pokemon.caughtIn]?.name || 'a Ball') + '</p>' +
		'<p><strong>Height:</strong> ' + String(pokemon.heightm) + ' m</p>' +
		'<p><strong>Weight:</strong> ' + String(pokemon.weightkg) + ' kg</p>' +
		'<p><strong>Friendship:</strong> ' + String(pokemon.friendship) + '/255</p>' +
		'</div>' +
		'<div style="flex-basis: 48%;">' +
		'<h4>IVs</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.hp) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.atk) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.def) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.spa) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.spd) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + String(pokemon.ivs.spe) + '</td></tr>' +
		'</table>' +
		'</div>' +
		'</div>' +
		'<hr />' +
		'<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
		'<div style="flex-basis: 48%;">' +
		'<h4>EVs</h4>' +
		'<table style="width: 100%; border-collapse: collapse;">' +
		'<tr><td style="padding: 2px;">HP</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.hp) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Attack</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.atk) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Defense</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.def) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Atk</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.spa) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Sp. Def</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.spd) + '</td></tr>' +
		'<tr><td style="padding: 2px;">Speed</td><td style="padding: 2px; text-align: right;">' + String(pokemon.evs.spe) + '</td></tr>' +
		'</table>' +
		'<small>Total: ' + String(totalEVs) + ' / 510</small>' +
		'</div>' +
		'<div style="flex-basis: 48%;">' +
		'<h4>Moves</h4>' +
		'<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">' +
		movesSummary +
		'</div>' +
		'</div>' +
		'</div>' +
		'<p style="margin-top: 15px;"><button name="send" value="/rpg party" class="button">← Back to Party</button></p>' +
		'</div>';
}

export function generateEggMoveSelectionHTML(pokemon: RPGPokemon, eggMoves: string[]): string {
	let html = `<div class="infobox"><h2>Teach an Egg Move</h2><p>Choose a move for <strong>${pokemon.species}</strong> to learn:</p>`;
	for (const moveId of eggMoves) {
		const move = getMove(moveId);
		html += `<button name="send" value="/rpg learneggmove ${pokemon.id} ${moveId}" class="button" style="margin: 3px;">${move.name}</button> `;
	}
	html += `<hr /><p><button name="send" value="/rpg items" class="button">Cancel</button></p></div>`;
	return html;
}

export function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Inventory</h2>`;
	html += `<p><strong>Money:</strong> ₽${player.money}</p>`;

	// Category Buttons
	html += `<div style="margin: 10px 0;"><button name="send" value="/rpg items" class="button">All</button> <button name="send" value="/rpg items pokeball" class="button">Poké Balls</button> <button name="send" value="/rpg items medicine" class="button">Medicines</button> <button name="send" value="/rpg items held" class="button">Held Items</button> <button name="send" value="/rpg items berry" class="button">Berries</button> <button name="send" value="/rpg items tm" class="button">TMs</button> <button name="send" value="/rpg items key" class="button">Key Items</button> <button name="send" value="/rpg items misc" class="button">Misc.</button></div>`;

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;

	let itemsFound = false;
	for (const [itemId, item] of player.inventory) {
		if (!category || item.category === category) {
			itemsFound = true;
			html += `<div style="border: 1px solid #ccc; padding: 8px; border-radius: 5px;">`;
			html += `<strong>${item.name}</strong> x${item.quantity}<br>`;
			html += `<small>${item.description}</small><br>`;
			html += `<button name="send" value="/rpg useitem ${itemId}" class="button" style="font-size: 12px; margin-top: 5px;">Use</button>`;
			html += `</div>`;
		}
	}

	if (!itemsFound) {
		html += `<p>You have no items in this category.</p>`;
	}

	html += `</div>`;
	html += generateBottomNavigation();
	html += `</div>`;
	return html;
}

export function generateShopHTML(player: PlayerData, category?: string): string {
	const locationId = toID(player.location);
	const shopInventory = getShopInventory(locationId, player.badges);
	const nextTier = getNextShopTier(locationId, player.badges);

	let html = `<div class="infobox">`;
	html += `<h2>Poké Mart - ${player.location}</h2>`;
	html += `<p>Welcome! What would you like to do?</p>`;
	html += `<p><strong>Your Money:</strong> ₽${player.money} | <strong>Badges:</strong> ${player.badges}/8</p>`;

	// Show next tier info if available
	if (nextTier) {
		html += `<p style="color: #666; font-size: 12px;">🔒 ${nextTier.itemCount} more items will unlock with ${nextTier.requiredBadges} badge${nextTier.requiredBadges === 1 ? '' : 's'}</p>`;
	}

	// --- NEW: Added Sell Button ---
	html += `<p><button name="send" value="/rpg sell" class="button" style="background-color: #28a745; color: white;">Sell Items</button></p>`;

	// Category Buttons
	html += `<h3>Buy Items</h3><div style="margin: 10px 0;">`;
	html += `<button name="send" value="/rpg shop" class="button">All</button> `;
	html += `<button name="send" value="/rpg shop pokeball" class="button">Poké Balls</button> `;
	html += `<button name="send" value="/rpg shop medicine" class="button">Medicines</button> `;
	html += `<button name="send" value="/rpg shop held" class="button">Held Items</button> `;
	html += `<button name="send" value="/rpg shop berry" class="button">Berries</button> `;
	html += `<button name="send" value="/rpg shop misc" class="button">Misc.</button>`;
	html += `</div>`;

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;

	let itemsFound = false;
	for (const itemId of shopInventory) {
		const item = ITEMS_DATABASE[itemId];
		const price = ITEM_PRICES[itemId];
		if (!item || !price) continue;

		if (!category || item.category === category) {
			itemsFound = true;
			html += `<div style="border: 1px solid #ccc; padding: 8px; border-radius: 5px;">`;
			html += `<strong>${item.name}</strong> - ₽${price}<br>`;
			html += `<small>${item.description}</small><br>`;
			html += `<button name="send" value="/rpg buy ${itemId} 1" class="button" style="font-size: 12px; margin-top: 5px;">Buy 1</button>`;
			html += `<button name="send" value="/rpg buy ${itemId} 5" class="button" style="font-size: 12px; margin-top: 5px;">Buy 5</button>`;
			html += `</div>`;
		}
	}

	if (!itemsFound) {
		html += `<p>No items found in this category.</p>`;
	}

	html += `</div>`;
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += `</div>`;
	return html;
}

export function generatePCHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Pokemon PC System</h2><p>Welcome to Bill's PC!</p><p><strong>Pokemon in PC:</strong> ${player.pc.size}</p>`;
	if (player.pc.size === 0) {
		html += `<p>No Pokemon stored in PC.</p>`;
	} else {
		html += `<div style="max-height: 400px; overflow-y: auto;">`;
		for (const [pokemonId, pokemon] of player.pc) {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> (Level ${pokemon.level})<br><small>HP: ${pokemon.hp}/${pokemon.maxHp}</small></div><button name="send" value="/rpg withdrawpc ${pokemonId}" class="button">Withdraw</button></div>`;
		}
		html += `</div>`;
	}
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg party" class="button">View Party</button></p>`;
	html += generateBottomNavigation();
	html += `</div>`;
	return html;
}

export function generateCatchMenuHTML(player: PlayerData, battle: BattleState): string {
	let html = `<div class="infobox"><h2>Select a Poke Ball</h2>`;
	const pokeBalls = [];
	for (const [itemId, item] of player.inventory) {
		if (item.category === 'pokeball' && item.quantity > 0) {
			pokeBalls.push(item);
		}
	}

	const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';

	if (pokeBalls.length === 0) {
		html += `<p>You have no Poke Balls!</p>`;
	} else {
		html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
		for (const ball of pokeBalls) {
			// --- FIX: Change command based on battle type ---
			let command = '';
			if (isDoubleBattle) {
				// Doubles: Go to target selection
				command = `/rpg battleaction selectcatchtarget ${ball.id}`;
			} else {
				// Singles: Hardcode target to slot 2 (the only opponent)
				command = `/rpg battleaction catch ${ball.id} 2`;
			}

			html += `<div style="text-align: center; padding: 8px; border: 1px solid #ccc; border-radius: 5px;"><strong>${ball.name}</strong><br><small>x${ball.quantity}</small><br><button name="send" value="${command}" class="button" style="font-size: 12px; margin-top: 5px;">Use</button></div>`;
		}
		html += `</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateCatchTargetHTML(battle: BattleState, ballId: string): string {
	let html = `<div class="infobox"><h2>Select a Target</h2>`;
	html += `<p>Choose which wild Pokémon to throw the ${ITEMS_DATABASE[ballId]?.name || 'Poke Ball'} at:</p>`;

	// Show all active opponent Pokemon as targets
	let hasTargets = false;
	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (!slot || slot.pokemon.hp <= 0) continue;

		hasTargets = true;
		const slotIndex = i + 2; // Opponent slots are indices 2 and 3
		const hpPercent = Math.floor((slot.pokemon.hp / slot.pokemon.maxHp) * 100);
		const statusText = slot.status ? ` (${slot.status.toUpperCase()})` : '';

		html += `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">` +
			`<strong>${slot.pokemon.species}</strong> (Lvl ${slot.pokemon.level})${statusText}<br>` +
			`HP: ${slot.pokemon.hp}/${slot.pokemon.maxHp} (${hpPercent}%)<br>` +
			`<button name="send" value="/rpg battleaction catch ${ballId} ${slotIndex}" class="button">Throw ${ITEMS_DATABASE[ballId]?.name || 'Ball'}</button>` +
			`</div>`;
	}

	if (!hasTargets) {
		html += `<p>No targets available!</p>`;
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateSwitchMenuHTML(battle: BattleState, target?: string): string {
	let html = `<div class="infobox"><h2>Choose a Pokémon to switch</h2>`;
	const player = getPlayerData(battle.playerId);
	const [pSlot0, pSlot1] = battle.playerSlots;

	const slotToSwitchOut = parseInt(target || '');

	if (isNaN(slotToSwitchOut)) {
		// --- Step 1: Choose which Pokemon to switch out ---
		html += `<p>Select a Pokémon to switch out. This will use its turn.</p>`;
		if (pSlot0 && pSlot0.pokemon.hp > 0) {
			html += `<button name="send" value="/rpg battleaction switchmenu 0" class="button"><strong>${pSlot0.pokemon.species}</strong> (Slot 1)</button> `;
		}
		if (pSlot1 && pSlot1.pokemon.hp > 0) {
			html += `<button name="send" value="/rpg battleaction switchmenu 1" class="button"><strong>${pSlot1.pokemon.species}</strong> (Slot 2)</button> `;
		}
	} else {
		// --- Step 2: Choose which Pokemon to switch in ---
		const outgoingPokemon = battle.playerSlots[slotToSwitchOut]?.pokemon;
		if (!outgoingPokemon) {
			return `<h2>Error: Invalid slot.</h2><p><button name="send" value="/rpg battleaction back" class="button">Back</button></p>`;
		}

		html += `<p>Select a Pokémon to replace <strong>${outgoingPokemon.species}</strong>:</p>`;

		const availableParty = player.party.filter(p =>
			p.hp > 0 &&
			!battle.playerSlots.some(s => s?.pokemon.id === p.id)
		);

		if (availableParty.length === 0) {
			html += `<p>You have no other Pokémon to switch to!</p>`;
		} else {
			for (const pokemon of availableParty) {
				html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px 0; border-radius: 5px; overflow: hidden;">` +
					`<strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}` +
					`<button name="send" value="/rpg battleaction playerswitch ${slotToSwitchOut} ${pokemon.id}" class="button" style="float: right;">Switch In</button>` +
					`</div>`;
			}
		}
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateVictoryHTML(defeatedOpponentNames: string, expMessages: string[], moneyGained: number, zoneId: string): string {
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated the wild <strong>${defeatedOpponentNames}</strong>!</p><div style="padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You gained ₽${moneyGained}!</p>` +
		`<p>` +
		`<button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button> ` +
		`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
		`</p>` +
		generateBottomNavigation() +
		`</div>`;
}

// --- NEW FUNCTION ---
export function generateTrainerVictoryHTML(opponentName: string, expMessages: string[], moneyGained: number): string {
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated <strong>${opponentName}</strong>!</p><div style="padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You received ₽${moneyGained} for winning!</p><p><button name="send" value="/rpg explore" class="button">Continue Exploring</button></p>` +
		generateBottomNavigation() + `</div>`;
}

// --- MODIFIED FUNCTION ---
export function generateDefeatHTML(moneyLost: number, opponentName?: string): string {
	const opponentMessage = opponentName ? `You lost to ${opponentName}!` : "You have no more Pokemon that can fight!";
	return `<div class="infobox"><h2>Defeat!</h2><p>${opponentMessage}</p><p>You blacked out and rushed to the nearest Pokemon Center...</p><p>You lost ₽${moneyLost}!</p>` +
		generateBottomNavigation() + `</div>`;
}

export function generateFaintSwitchHTML(battle: BattleState, message: string): string {
	let html = `<div class="infobox"><h2>A Pokémon fainted!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);

	// --- FIX: Correctly find the empty slot based on battle type ---
	const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';

	let slotToFill = -1;
	if (battle.playerSlots[0] === null) {
		slotToFill = 0;
	} else if (isDoubleBattle && battle.playerSlots[1] === null) {
		slotToFill = 1;
	}
	// --- END FIX ---

	if (slotToFill === -1) {
		// This should not happen if we got here, but it's a safe fallback.
		html += `<p>Error: No empty slot found.</p><button name="send" value="/rpg battleaction back" class="button">Back</button>`;
	} else {
		html += `<p>Choose a Pokémon to send to <strong>Slot ${slotToFill + 1}</strong>:</p>`;

		// Find available party members
		const availableParty = player.party.filter(p =>
			p.hp > 0 &&
			!battle.playerSlots.some(s => s?.pokemon.id === p.id)
		);

		if (availableParty.length === 0) {
			html += `<p>You have no other Pokémon that can fight!</p>`;
		} else {
			for (const pokemon of availableParty) {
				html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px;"><strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}<button name="send" value="/rpg battleaction forceswitch ${slotToFill} ${pokemon.id}" class="button" style="float: right;">Switch In</button></div>`;
			}
		}
	}
	html += `</div>`;
	return html;
}

export function generateMoveLearnHTML(player: PlayerData, additionalMessages?: string[]): string {
	const queue = player.pendingMoveLearnQueue;
	if (!queue || queue.moveIds.length === 0) return `<h2>Error: No pending moves found.</h2>`;
	const pokemon = player.party.find(p => p.id === queue.pokemonId);
	const newMove = getMove(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		delete player.pendingMoveLearnQueue;
		return `<h2>Error: Invalid Pokemon or move data.</h2>` + generateBottomNavigation();
	}
	let html = `<div class="infobox">`;

	// Display additional messages if provided (e.g., badge notifications)
	if (additionalMessages && additionalMessages.length > 0) {
		html += `<div style="padding: 10px; border-radius: 5px; margin-bottom: 10px;">${additionalMessages.join('<br>')}</div>`;
	}

	html += `<h2>Move Learning Result</h2><p><strong>${pokemon.species}</strong> wants to learn the move <strong>${newMove.name}</strong>!</p><p>However, ${pokemon.species} already knows four moves. Which move should be forgotten?</p>`;
	for (const move of pokemon.moves) {
		html += `<button name="send" value="/rpg learnmove ${move.id}" class="button">${getMove(move.id).name}</button>`;
	}
	html += `<hr /><p>...or, give up on learning the move <strong>${newMove.name}</strong>?</p><button name="send" value="/rpg learnmove skip" class="button" style="color: #d9534f;">Give Up</button></div>`;
	return html;
}

export function generateGiveItemPokemonSelectionHTML(player: PlayerData, itemId: string): string {
	const item = ITEMS_DATABASE[itemId];
	if (!item) return `<h2>Item not found.</h2>`;

	let html = `<div class="infobox"><h2>Give ${item.name}</h2><p>Select a Pokémon to give this item to:</p>`;
	for (const pokemon of player.party) {
		html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;">` +
			`<span>${pokemon.species} (Holding: ${pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None'})</span>` +
			`<button name="send" value="/rpg giveitem ${pokemon.id} ${itemId}" class="button" style="float: right;">Give</button>` +
			`</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg items" class="button">Back to Bag</button></p></div>`;
	return html;
}

export function generatePivotSwitchHTML(battle: BattleState, message: string, pivotSlotIndex: number): string {
	let html = `<div class="infobox"><h2>A Pokémon is switching out!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);
	const pivotingPokemon = battle.pendingPivot?.slot.pokemon; // Get pokemon from the pivot request

	html += `<p>Choose a Pokémon to replace <strong>${pivotingPokemon?.species || 'your Pokémon'}</strong> in <strong>Slot ${pivotSlotIndex + 1}</strong>:</p>`;

	const availableParty = player.party.filter(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (availableParty.length === 0) {
		html += `<p>You have no other Pokémon to switch to!</p>`;
		// This is a problem. The battle needs to continue.
		// We'll add a button to just continue the battle.
		html += `<p><button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} cancel" class="button">Continue</button></p>`;
	} else {
		for (const pokemon of availableParty) {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px;"><strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}<button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} ${pokemon.id}" class="button" style="float: right;">Switch In</button></div>`;
		}
	}
	html += `</div>`;
	return html;
}

export function generateFieldEffectHTML(battle: BattleState): string {
	let html = '<div style="border: 1px solid #dee2e6; border-radius: 5px; padding: 8px; margin-bottom: 10px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">';
	const fieldEffects: string[] = [];
	const playerSide: string[] = [];
	const opponentSide: string[] = [];

	// --- Global Field Effects ---
	if (battle.weather) {
		const weatherIcons = { sun: '☀️', rain: '🌧️', sand: '🏜️', hail: '🌨️' };
		fieldEffects.push(`${weatherIcons[battle.weather.type]} <strong>${battle.weather.type.toUpperCase()}</strong> (${battle.weather.turns} turns)`);
	}
	if (battle.terrain) {
		const terrainIcons = { electric: '⚡', grassy: '🌱', misty: '🌫️', psychic: '👁️' };
		fieldEffects.push(`${terrainIcons[battle.terrain.type]} <strong>${battle.terrain.type.toUpperCase()} Terrain</strong> (${battle.terrain.turns} turns)`);
	}
	if (battle.trickRoomTurns > 0) fieldEffects.push(`🕒 <strong>Trick Room</strong> (${battle.trickRoomTurns} turns)`);
	if (battle.magicRoomTurns > 0) fieldEffects.push(`✨ <strong>Magic Room</strong> (${battle.magicRoomTurns} turns)`);
	if (battle.wonderRoomTurns > 0) fieldEffects.push(`❓ <strong>Wonder Room</strong> (${battle.wonderRoomTurns} turns)`);
	if (battle.gravityTurns > 0) fieldEffects.push(`🌍 <strong>Gravity</strong> (${battle.gravityTurns} turns)`);
	if (battle.mudSportTurns > 0) fieldEffects.push(`💩 <strong>Mud Sport</strong> (${battle.mudSportTurns} turns)`);
	if (battle.waterSportTurns > 0) fieldEffects.push(`💧 <strong>Water Sport</strong> (${battle.waterSportTurns} turns)`);

	// --- Player Side Effects ---
	if (battle.playerReflectTurns > 0) playerSide.push(`🛡️ Reflect (${battle.playerReflectTurns})`);
	if (battle.playerLightScreenTurns > 0) playerSide.push(`💡 Light Screen (${battle.playerLightScreenTurns})`);
	if (battle.playerAuroraVeilTurns > 0) playerSide.push(`🌈 Aurora Veil (${battle.playerAuroraVeilTurns})`);
	if (battle.playerQuickGuard) playerSide.push(`💨 Quick Guard`);
	if (battle.playerWideGuard) playerSide.push(`🛡️ Wide Guard`);
	if (battle.playerCraftyShield) playerSide.push(`✨ Crafty Shield`);
	if (battle.playerHazards.includes('stealthrock')) playerSide.push(`💎 Stealth Rock`);
	const spikes = battle.playerHazards.filter(h => h === 'spikes').length;
	if (spikes > 0) playerSide.push(`📌 Spikes (x${spikes})`);
	const toxicSpikes = battle.playerHazards.filter(h => h === 'toxicspikes').length;
	if (toxicSpikes > 0) playerSide.push(`☠️ Toxic Spikes (x${toxicSpikes})`);
	if (battle.playerHazards.includes('stickyweb')) playerSide.push(`🕸️ Sticky Web`);

	// --- Opponent Side Effects ---
	if (battle.opponentReflectTurns > 0) opponentSide.push(`🛡️ Reflect (${battle.opponentReflectTurns})`);
	if (battle.opponentLightScreenTurns > 0) opponentSide.push(`💡 Light Screen (${battle.opponentLightScreenTurns})`);
	if (battle.opponentAuroraVeilTurns > 0) opponentSide.push(`🌈 Aurora Veil (${battle.opponentAuroraVeilTurns})`);
	if (battle.opponentQuickGuard) opponentSide.push(`💨 Quick Guard`);
	if (battle.opponentWideGuard) opponentSide.push(`🛡️ Wide Guard`);
	if (battle.opponentCraftyShield) opponentSide.push(`✨ Crafty Shield`);
	if (battle.opponentHazards.includes('stealthrock')) opponentSide.push(`💎 Stealth Rock`);
	const oppSpikes = battle.opponentHazards.filter(h => h === 'spikes').length;
	if (oppSpikes > 0) opponentSide.push(`📌 Spikes (x${oppSpikes})`); // Corrected variable name
	const oppToxicSpikes = battle.opponentHazards.filter(h => h === 'toxicspikes').length;
	if (oppToxicSpikes > 0) opponentSide.push(`☠️ Toxic Spikes (x${oppToxicSpikes})`);
	if (battle.opponentHazards.includes('stickyweb')) opponentSide.push(`🕸️ Sticky Web`);

	// --- Assemble HTML ---
	html += `<div><strong>Your Side:</strong><br>${playerSide.length > 0 ? playerSide.join('<br>') : '<em>Clear</em>'}</div>`;
	html += `<div><strong>Field:</strong><br>${fieldEffects.length > 0 ? fieldEffects.join('<br>') : '<em>Clear</em>'}</div>`;
	html += `<div><strong>Opponent's Side:</strong><br>${opponentSide.length > 0 ? opponentSide.join('<br>') : '<em>Clear</em>'}</div>`;

	html += '</div>';
	return html;
}

export function generateMoveSelectionHTML(player: PlayerData, pokemonId: string, itemId: string): string {
	const pokemon = player.party.find(p => p.id === pokemonId);
	const item = ITEMS_DATABASE[itemId];
	if (!pokemon || !item) return `<h2>Error: Pokémon or item not found.</h2>`;

	let html = `<div class="infobox"><h2>Use ${item.name}</h2><p>Select a move to restore PP for <strong>${pokemon.species}</strong>:</p>`;

	let canRestoreAny = false;
	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		const maxPP = moveData.pp || 5;
		if (move.pp < maxPP) {
			canRestoreAny = true;
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px 0; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">` +
				`<div><strong>${moveData.name}</strong><br><small>PP: ${move.pp} / ${maxPP}</small></div>` +
				`<button name="send" value="/rpg restorepp ${pokemon.id} ${move.id} ${itemId}" class="button">Restore</button>` +
				`</div>`;
		} else {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px 0; border-radius: 5px; opacity: 0.6;">` +
				`<div><strong>${moveData.name}</strong><br><small>PP: ${move.pp} / ${maxPP} (Full)</small></div>` +
				`<button class="button" disabled>Restore</button>` +
				`</div>`;
		}
	}

	if (!canRestoreAny) {
		html += `<p>All of ${pokemon.species}'s moves are already at full PP!</p>`;
	}

	html += `<hr /><p><button name="send" value="/rpg useitem ${itemId}" class="button">Back to Pokémon</button></p></div>`;
	return html;
}
