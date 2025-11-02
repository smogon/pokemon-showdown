/**
 * Pokemon RPG UI Generators
 *
 * This module consolidates all HTML/UI generation functions in one place
 * for easy maintenance and extension of the user interface.
 */

// Import types and utilities
import type { RPGPokemon, PlayerData, BattleState, ActivePokemonSlot } from './types';
import { ITEMS_DATABASE, ITEM_PRICES, SHOP_INVENTORY, STARTER_POKEMON } from './constants';
import { getActiveSlots } from './battle-helpers';
import { isDoublesBattle, generateFieldEffectHTML as generateFieldEffectHTMLHelper } from './battle-system';
import { getPlayerData, activeBattles } from './player-data';
import { createPokemon } from './utils';

export function generateSingleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string } // This parameter is no longer used here, but kept for signature compatibility
): string {
	const playerSlot = battle.playerSlots[0];
	const opponentSlot = battle.opponentSlots[0];

	if (!playerSlot || !opponentSlot) {
		// This should not happen in a single battle
		return `<div class="infobox"><h2>Battle Error!</h2><p>Active Pokémon slots are missing.</p><p><button name="send" value="/rpg menu" class="button">Flee</button></p></div>`;
	}

	const playerPokemon = playerSlot.pokemon;

	let actionHTML = '';

	// --- STATE 1: Action Selection (Target selection is now skipped) ---
	const moveButtons = playerPokemon.moves.map(move => {
		const moveData = getMove(move.id);

		const isAssaultVestBlocked = battle.magicRoomTurns === 0 &&
			playerPokemon.item === 'assaultvest' &&
			moveData.category === 'Status';

		const isTauntBlocked = playerSlot.tauntTurns > 0 &&
			moveData.category === 'Status';

		// --- FIX: Check Choice Item Lock ---
		const isLocked = playerSlot.lockedMove &&
			playerSlot.lockedMove !== move.id &&
			battle.magicRoomTurns === 0 &&
			// Check if the locked move still has PP
			playerPokemon.moves.some(m => m.id === playerSlot.lockedMove && m.pp > 0);

		const isDisabled = move.pp === 0 || isAssaultVestBlocked || isTauntBlocked || isLocked;

		// --- MODIFICATION ---
		// Command format: /rpg battleaction move [attackerSlot] [moveId] [targetSlot]
		// We now send the full move command directly, hardcoding attacker=0 and target=2.
		return `<button name="send" value="/rpg battleaction move 0 ${move.id} 2" class="button" ${isDisabled ? 'disabled style="background-color:#888;"' : ''}>${moveData.name}<br><small>PP: ${move.pp} / ${moveData.pp}</small></button>`;
	}).join('');

	const catchButton = (battle.battleType === 'wild') ?
		`<button name="send" value="/rpg battleaction catchmenu" class="button">⚽ Catch</button>` :
		`<button class="button" disabled style="background-color:#888;">⚽ Catch</button>`;

	const runButton = (battle.battleType === 'wild' && !playerSlot.isTrapped) ?
		`<button name="send" value="/rpg battleaction run" class="button">🏃 Run</button>` :
		`<button class="button" disabled style="background-color:#888;">🏃 Run</button>`;

	actionHTML = `<p>What will ${playerPokemon.species} do?</p>` +
		`<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">${moveButtons}</div>` +
		`<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction switchmenu" class="button">🔄 Switch</button>${catchButton}${runButton}</p>`;
	// --- END MODIFICATION ---

	return `<div class="infobox"><h2>Battle!</h2>` +
		`${generateFieldEffectHTML(battle)}` +
		`<div style="display: flex; justify-content: space-around;">` +
	// Player Pokemon
		`<div style="flex-basis: 48%;"><h3>Your Pokemon</h3><psicon pokemon="${playerPokemon.species}" style="vertical-align: middle;"></psicon> ${generatePokemonInfoHTML(playerSlot, true)}</div>` +
	// Opponent Pokemon
		`<div style="flex-basis: 48%;"><h3>${battle.opponentName}</h3><psicon pokemon="${opponentSlot.pokemon.species}" style="vertical-align: middle;"></psicon> ${generatePokemonInfoHTML(opponentSlot, false)}</div>` +
		`</div><hr />` +
	// Message Log
		`<div style="padding: 5px; margin: 10px 0; border: 1px solid #666; background: #f0f0f0; min-height: 50px;">${messageLog.join('<br>')}</div>` +
	// Action Area
		actionHTML +
		`</div>`;
}

export function generateWelcomeHTML(): string {
	return `<div class="infobox"><h2>Welcome to World of Impulse</h2><p>You must choose your starter pokemon before starting your adventure.</p><h3>Choose Type:</h3><p><button name="send" value="/rpg choosetype fire" class="button">🔥 Fire</button><button name="send" value="/rpg choosetype water" class="button">💧 Water</button><button name="send" value="/rpg choosetype grass" class="button">🌱 Grass</button></p></div>`;
}

export function generateStarterSelectionHTML(type: string): string {
	const starters = STARTER_POKEMON[type as keyof typeof STARTER_POKEMON];
	if (!starters) return '';
	const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
	let html = `<div class="infobox"><h2>${typeTitle} Type Starters</h2><p>Choose your starter pokemon:</p><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
	for (const starterId of starters) {
		const species = Dex.species.get(starterId);
		if (species.exists) {
			html += `<div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"><strong>${species.name}</strong><br><small>Type: ${species.types.join('/')}</small><br><button name="send" value="/rpg choosestarter ${starterId}" class="button" style="margin-top: 5px;">Choose</button></div>`;
		}
	}
	html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg start" class="button">← Back to Type Selection</button></p></div>`;
	return html;
}

export function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	showActions = false
): string {
	const pokemon = slot.pokemon;
	const statStages = slot.statStages;

	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'orange' : 'red';

	// --- MODIFICATION: Only show EXP bar for player ---
	let expBarHTML = '';
	if (isPlayerSide) {
		const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
		const expForNextLevel = pokemon.expToNextLevel;
		const expProgress = pokemon.experience - expForLastLevel;
		const expNeededForLevel = expForNextLevel - expForLastLevel;
		const expPercentage = Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100));
		expBarHTML = `<div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 8px; border-radius: 8px;"></div></div>`;
	}
	// --- END MODIFICATION ---

	const displayStatus = slot.status || pokemon.status;
	const statusColors: Record<Status, string> = { 'brn': '#F08030', 'par': '#F8D030', 'psn': '#A040A0', 'slp': '#9898E8', 'frz': '#98D8D8' };
	const statusTag = displayStatus ? `<span style="background-color: ${statusColors[displayStatus]}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; text-transform: uppercase; vertical-align: middle; margin-left: 5px;">${displayStatus}</span>` : '';
	const confusedTag = slot.isConfused ? `<span style="background-color: #A890F0; color: white; padding: 1px 4px; border-radius: 3px; font-size: 10px; vertical-align: middle; margin-left: 5px;">Confused</span>` : '';
	// --- EXISTING TAGS ---
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

	// --- NEW VOLATILE STATUS TAGS ---
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
	// --- END NEW TAGS ---

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

	// --- MODIFICATION: Conditional display ---
	let movesDisplay = '';
	let natureDisplay = '';
	let abilityDisplay = '';
	let itemDisplay = '';
	let expDisplay = '';

	if (isPlayerSide) {
		movesDisplay = `Moves: ${pokemon.moves.map(m => {
			const moveData = getMove(m.id);
			return `${moveData.name} (${m.pp}/${moveData.pp})`;
		}).slice(0, 4).join(', ') || 'None'}`;
		natureDisplay = `Nature: ${pokemon.nature}<br>`;
		abilityDisplay = `Ability: ${pokemon.ability || 'Unknown'}<br>`;
		if (pokemon.item) {
			itemDisplay = `<br>Held Item: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item}`;
		}
		expDisplay = `EXP: ${pokemon.experience}/${pokemon.expToNextLevel}<br>`;
	}
	// --- END MODIFICATION ---

	// --- UPDATE RENDER LINE ---
	let html = `<div style="border: 1px solid #ccc; padding: 10px; margin: 5px; border-radius: 5px;"><psicon pokemon="${pokemon.species}" style="vertical-align: middle;"></psicon> <strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})${statusTag}${confusedTag}${cursedTag}${seededTag}${nightmareTag}${trappedTag}${tauntTag}${chargingTag}${yawnTag}${substituteTag}${disableTag}${encoreTag}${tormentTag}${focusEnergyTag}${ingrainTag}${aquaRingTag}${magnetRiseTag}${telekinesisTag}${smackdownTag}${embargoTag}${healBlockTag}${chargeTag}${stockpileTag}${statStageTags}<br><small>Type: ${species.types.join('/')}</small><br><div style="background: #f0f0f0; border-radius: 10px; padding: 2px; margin: 5px 0;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div></div>HP: ${pokemon.hp}/${pokemon.maxHp}<br>`;

	// --- MODIFICATION: Add conditional elements ---
	if (isPlayerSide) {
		html += `${expBarHTML}${expDisplay}${natureDisplay}${abilityDisplay}${movesDisplay}`;
	}

	html += itemDisplay; // This is already conditional
	// --- END MODIFICATION ---

	if (showActions) {
		const itemButton = pokemon.item ?
			`<button name="send" value="/rpg takeitem ${pokemon.id}" class="button" style="font-size: 12px;">Take Item</button>` :
			`<button name="send" value="/rpg giveitem ${pokemon.id}" class="button" style="font-size: 12px;">Give Item</button>`;
		html += `<br><div style="margin-top: 10px;"><button name="send" value="/rpg summary ${pokemon.id}" class="button" style="font-size: 12px;">Summary</button> ${itemButton} <button name="send" value="/rpg depositpc ${pokemon.id}" class="button" style="font-size: 12px;">Deposit</button></div>`;
	}
	html += '</div>';
	return html;
}

export function generateDoubleBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;

	// Helper to generate HTML for a single slot
	const generateSlotHTML = (slot: ActivePokemonSlot | null, slotIndex: number, side: 'player' | 'opponent') => {
		if (!slot) {
			return `<div style="flex-basis: 48%; border: 1px dashed #ccc; padding: 10px; margin: 5px; border-radius: 5px; min-height: 150px; text-align: center; color: #888;">(Empty Slot)</div>`;
		}
		if (slot.pokemon.hp <= 0) {
			return `<div style="flex-basis: 48%; opacity: 0.5; background: #f0f0f0;">${generatePokemonInfoHTML(slot, side === 'player')}</div>`;
		}

		let borderStyle = "1px solid #ccc";
		// Check if this slot is a pending target
		if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
			borderStyle = "3px dashed #007bff"; // Highlight as targetable
		}
		// Check if this slot has already acted
		if (battle.pendingActions[slotIndex]) {
			borderStyle = "3px solid #28a745"; // Green border for "Ready"
		}

		return `<div style="flex-basis: 48%; border: ${borderStyle};">${generatePokemonInfoHTML(slot, side === 'player')}</div>`;
	};

	let html = `<div class="infobox"><h2>Battle! (${battle.battleType})</h2>`;
	html += generateFieldEffectHTML(battle);

	// --- Opponent Side ---
	html += `<div><h3>${battle.opponentName}</h3><div style="display: flex; justify-content: space-around;">`;
	html += generateSlotHTML(oSlot0, 2, 'opponent');
	html += generateSlotHTML(oSlot1, 3, 'opponent');
	html += `</div></div><hr />`;

	// --- Player Side ---
	html += `<div><h3>Your Team</h3><div style="display: flex; justify-content: space-around;">`;
	html += generateSlotHTML(pSlot0, 0, 'player');
	html += generateSlotHTML(pSlot1, 1, 'player');
	html += `</div></div><hr />`;

	// --- Message Log ---
	html += `<div style="padding: 5px; margin: 10px 0; border: 1px solid #666; background: #f0f0f0; min-height: 50px;">${messageLog.join('<br>')}</div>`;

	// --- Action Area ---
	if (targetSelection) {
		// --- STATE 2: Target Selection ---
		const move = getMove(targetSelection.moveId);
		html += `<p>Select a target for <strong>${move.name}</strong>:</p>`;
		html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">`;

		// TODO: This needs to be smarter based on move.target (e.g., 'ally', 'allAdjacentFoes')
		// For now, we'll just show all valid targets.
		const targets = [
			{ slot: pSlot0, name: "Ally 1", index: 0 },
			{ slot: pSlot1, name: "Ally 2", index: 1 },
			{ slot: oSlot0, name: "Foe 1", index: 2 },
			{ slot: oSlot1, name: "Foe 2", index: 3 },
		];

		for (const target of targets) {
			if (target.slot && target.slot.pokemon.hp > 0 && target.index !== targetSelection.attackerSlotIndex) {
				html += `<button name="send" value="/rpg battleaction move ${targetSelection.attackerSlotIndex} ${targetSelection.moveId} ${target.index}" class="button">${target.name} (${target.slot.pokemon.species})</button>`;
			}
		}
		html += `</div>`;
		html += `<p style="margin-top: 10px;"><button name="send" value="/rpg battleaction back" class="button">Cancel</button></p>`;
	} else {
		// --- STATE 1: Action Selection ---
		let activeSlot: ActivePokemonSlot | null = null;
		let activeSlotIndex = -1;

		// Find the next player slot that needs to act
		if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
			activeSlot = pSlot0;
			activeSlotIndex = 0;
		} else if (pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
			activeSlot = pSlot1;
			activeSlotIndex = 1;
		}

		if (activeSlot) {
			const pokemon = activeSlot.pokemon;
			html += `<p>What will <strong>${pokemon.species}</strong> do?</p>`;
			html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">`;

			const moves = pokemon.moves;
			for (const move of moves) {
				const moveData = getMove(move.id);

				const isAssaultVestBlocked = battle.magicRoomTurns === 0 &&
					pokemon.item === 'assaultvest' &&
					moveData.category === 'Status';

				const isTauntBlocked = activeSlot.tauntTurns > 0 &&
					moveData.category === 'Status';

				const isDisabled = move.pp === 0 || isAssaultVestBlocked || isTauntBlocked ||
					(activeSlot.lockedMove && activeSlot.lockedMove !== move.id);

				html += `<button name="send" value="/rpg battleaction selecttarget ${activeSlotIndex} ${move.id}" class="button" ${isDisabled ? 'disabled style="background-color:#888;"' : ''}>${moveData.name}<br><small>PP: ${move.pp} / ${moveData.pp}</small></button>`;
			}
			html += `</div>`;
		} else {
			// All player Pokemon have actions queued
			html += `<p>Waiting for opponent...</p>`;
		}

		// --- Main Action Buttons (Catch, Switch, Run) ---
		const catchButton = (battle.battleType === 'wild' || battle.battleType === 'wild_double') ?
			`<button name="send" value="/rpg battleaction catchmenu" class="button">⚽ Catch</button>` :
			`<button class="button" disabled style="background-color:#888;">⚽ Catch</button>`;

		const runButton = (battle.battleType === 'wild' || battle.battleType === 'wild_double') ? // TODO: Add trap check
			`<button name="send" value="/rpg battleaction run" class="button">🏃 Run</button>` :
			`<button class="button" disabled style="background-color:#888;">🏃 Run</button>`;

		html += `<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction switchmenu" class="button">🔄 Switch</button>${catchButton}${runButton}</p>`;
	}

	html += `</div>`;
	return html;
}

/**
 * [NEW ROUTER]
 * Detects battle type and calls the correct UI generator.
 */
export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string }
): string {
	if (battle.battleType === 'wild' || battle.battleType === 'trainer') {
		// Use single battle UI
		return generateSingleBattleHTML(battle, messageLog, targetSelection);
	} else {
		// Use double battle UI
		return generateDoubleBattleHTML(battle, messageLog, targetSelection);
	}
}

export function generatePokemonSummaryHTML(pokemon: RPGPokemon): string {
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	const movesSummary = pokemon.moves.map(move => {
		const moveData = getMove(move.id);
		return '<div style="text-align: center; padding: 5px; background: #f0f0f0; border-radius: 5px;">' +
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
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
	html += `</div>`;
	return html;
}

export function generateShopHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Poké Mart</h2>`;
	html += `<p>Welcome! What would you like to buy?</p>`;
	html += `<p><strong>Your Money:</strong> ₽${player.money}</p>`;

	// Category Buttons
	html += `<div style="margin: 10px 0;">`;
	html += `<button name="send" value="/rpg shop" class="button">All</button> `;
	html += `<button name="send" value="/rpg shop pokeball" class="button">Poké Balls</button> `;
	html += `<button name="send" value="/rpg shop medicine" class="button">Medicines</button> `;
	html += `<button name="send" value="/rpg shop held" class="button">Held Items</button> `;
	html += `<button name="send" value="/rpg shop berry" class="button">Berries</button> `;
	html += `<button name="send" value="/rpg shop misc" class="button">Misc.</button>`;
	html += `</div>`;

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;

	let itemsFound = false;
	for (const itemId of SHOP_INVENTORY) {
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
	html += `<p style="margin-top: 15px;"><button name="send" value="/rpg party" class="button">View Party</button> <button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
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
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated the wild <strong>${defeatedOpponentNames}</strong>!</p><div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You found ₽${moneyGained}!</p><p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another Pokemon</button><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
}

// --- NEW FUNCTION ---
export function generateTrainerVictoryHTML(opponentName: string, expMessages: string[], moneyGained: number): string {
	return `<div class="infobox"><h2>Victory!</h2><p>You defeated <strong>${opponentName}</strong>!</p><div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${expMessages.join('<br>')}</div><p>You received ₽${moneyGained} for winning!</p><p><button name="send" value="/rpg explore" class="button">Continue Exploring</button><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
}

// --- MODIFIED FUNCTION ---
export function generateDefeatHTML(moneyLost: number, opponentName?: string): string {
	const opponentMessage = opponentName ? `You lost to ${opponentName}!` : "You have no more Pokemon that can fight!";
	return `<div class="infobox"><h2>Defeat!</h2><p>${opponentMessage}</p><p>You blacked out and rushed to the nearest Pokemon Center...</p><p>You lost ₽${moneyLost}!</p><p><button name="send" value="/rpg menu" class="button">Continue</button></p></div>`;
}

export function generateFaintSwitchHTML(battle: BattleState, message: string): string {
	let html = `<div class="infobox"><h2>A Pokémon fainted!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);

	// Find the first empty slot
	const slotToFill = battle.playerSlots[0] === null ? 0 : (battle.playerSlots[1] === null ? 1 : -1);

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

export function generateMoveLearnHTML(player: PlayerData): string {
	const queue = player.pendingMoveLearnQueue;
	if (!queue || queue.moveIds.length === 0) return `<h2>Error: No pending moves found.</h2>`;
	const pokemon = player.party.find(p => p.id === queue.pokemonId);
	const newMove = getMove(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		delete player.pendingMoveLearnQueue;
		return `<h2>Error: Invalid Pokemon or move data.</h2><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>`;
	}
	let html = `<div class="infobox"><h2>Move Learning</h2><p><strong>${pokemon.species}</strong> wants to learn the move <strong>${newMove.name}</strong>!</p><p>However, ${pokemon.species} already knows four moves. Should a move be forgotten to make space for ${newMove.name}?</p><hr /><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;
	for (const move of pokemon.moves) {
		html += `<button name="send" value="/rpg learnmove ${move.id}" class="button">${getMove(move.id).name}</button>`;
	}
	html += `</div><hr /><p>...or, give up on learning the move <strong>${newMove.name}</strong>?</p><button name="send" value="/rpg learnmove skip" class="button" style="background-color: #d9534f; color: white;">Forget ${newMove.name}</button></div>`;
	return html;
}

export function generateGiveItemPokemonSelectionHTML(player: PlayerData, itemId: string): string {
	const item = ITEMS_DATABASE[itemId];
	if (!item) return `<h2>Item not found.</h2>`;

	let html = `<div class="infobox"><h2>Give ${item.name}</h2><p>Select a Pokémon to give this item to:</p>`;
	for (const pokemon of player.party) {
		html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;">` +
			`<span>${pokemon.species} (Holding: ${pokemon.item ? ITEMS_DATABASE[pokemon.item].name : 'None'})</span>` +
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
	let html = '<div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 8px; margin-bottom: 10px; font-size: 12px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">';
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
	if (battle.opponentHazards.includes('stealthrock')) opponentSide.push(`💎 Stealth Rock`);
	const oppSpikes = battle.opponentHazards.filter(h => h === 'spikes').length;
	if (oppSpikes > 0) oppSpikes.push(`📌 Spikes (x${oppSpikes})`);
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

/************
* COMMANDS
************/

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
			const profileHTML = `<div class="infobox"><h2>Player Profile</h2><p><strong>Trainer:</strong> ${player.name}</p><p><strong>Level:</strong> ${player.level}</p><p><strong>Badges:</strong> ${player.badges}</p><p><strong>Pokemon in Party:</strong> ${player.party.length}</p><p><strong>Money:</strong> ₽${player.money}</p><p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
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
						// --- FIX ---
						// We must wrap the RPGPokemon in an ActivePokemonSlot
						const tempSlot = createActivePokemonSlot(player.party[i]);
						partyHTML += `<div><strong>Slot ${i + 1}:</strong><br>${generatePokemonInfoHTML(tempSlot, true, true)}</div>`;
						// --- END FIX ---
					} else {
						partyHTML += `<p><strong>Slot ${i + 1}:</strong> Empty</p>`;
					}
				}
			}
			partyHTML += `<p style="margin-top: 15px;"><button name="send" value="/rpg pc" class="button">Pokemon PC</button> <button name="send" value="/rpg menu" class="button">Back to Menu</button></p></div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${partyHTML}`);
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
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use ${item.name}</h2><p>Select a Pokemon to use this item on:</p>`;
					for (const pokemon of player.party) {
						// Only show Pokemon that can be healed
						if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
							html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;"><div><strong>${pokemon.species}</strong> (Lvl ${pokemon.level})<br><small>HP: ${pokemon.hp}/${pokemon.maxHp}</small></div><button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use</button></div>`;
						}
					}
					html += `<p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}
				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in party.");

				const result = useHealingItem(player, targetPokemon, itemId);

				if (!result.success) {
					// .errorReply escapes HTML, so we use sendReply with a styled error message
					const errorHTML = `<div class="infobox"><p style="color: red; font-weight: bold;">${result.message}</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${errorHTML}`);
				}

				// --- FIX ---
				const tempSlot = createActivePokemonSlot(targetPokemon);
				const resultHTML = `<div class="infobox"><h2>Item Used!</h2><p>${result.message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
				// --- END FIX ---
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${resultHTML}`);
			} else if (item.category === 'held' || item.category === 'berry') {
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateGiveItemPokemonSelectionHTML(player, itemId)}`);
			} else if (itemId === 'eggmovetutor') {
				if (!pokemonId) {
					let html = `<div class="infobox"><h2>Use Egg Move Tutor</h2><p>Select a Pokémon to teach an Egg Move:</p>`;
					for (const pokemon of player.party) {
						html += `<button name="send" value="/rpg useitem eggmovetutor ${pokemon.id}" class="button" style="margin: 3px;">${pokemon.species}</button>`;
					}
					html += `<hr /><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
				}
				const targetPokemon = player.party.find(p => p.id === pokemonId);
				if (!targetPokemon) return this.errorReply("Pokemon not found in your party.");
				const speciesId = toID(targetPokemon.species);
				const allEggMoves = MANUAL_LEARNSETS[speciesId]?.egg || [];
				const learnableEggMoves = allEggMoves.filter(moveId => !targetPokemon.moves.some(m => m.id === toID(moveId)));

				if (learnableEggMoves.length === 0) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|<div class="infobox"><h2>No Moves Available</h2><p><strong>${targetPokemon.species}</strong> either has no Egg Moves or already knows all of them.</p><p><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`);
				}
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateEggMoveSelectionHTML(targetPokemon, learnableEggMoves)}`);
			} else {
				return this.errorReply("This item cannot be used right now.");
			}
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
			// This logic finds all zones that match the player's current location
			const availableZones = Object.keys(ENCOUNTER_ZONES).filter(zoneId => zoneId.startsWith(toID(player.location)));

			let exploreButtons = '';
			if (availableZones.length > 0) {
				for (const zoneId of availableZones) {
					const zone = ENCOUNTER_ZONES[zoneId];
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
				`<p><button name="send" value="/rpg menu" class="button">Back to Menu</button></p>` +
				`</div>`;
			this.sendReply(`|uhtmlchange|rpg-${user.id}|${exploreHTML}`);
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
					weather: undefined,
					trickRoomTurns: 0,
					magicRoomTurns: 0,
					wonderRoomTurns: 0,
					terrain: undefined,
					playerShouldSwitch: undefined,
					pendingPivot: undefined,
					aiPendingPivot: undefined,
					forceEnd: false,

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

					// --- Delayed Move Fields ---
					playerFutureMoves: [],
					opponentFutureMoves: [],
				});

				this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id), battleMessages)}`);
			} catch (error) {
				this.errorReply(`Error generating wild Pokémon: ${error}`);
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

			activeBattles.set(user.id, {
				// --- Battle Type Fields ---
				battleType: finalBattleType,
				opponentName: trainerSpec.name,
				opponentParty: trainerParty, // The full party
				opponentMoney: trainerSpec.money,

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
				weather: undefined,
				trickRoomTurns: 0,
				magicRoomTurns: 0,
				wonderRoomTurns: 0,
				terrain: undefined,
				playerShouldSwitch: undefined,
				pendingPivot: undefined,
				aiPendingPivot: undefined,
				forceEnd: false,

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

				// --- Delayed Move Fields ---
				playerFutureMoves: [],
				opponentFutureMoves: [],
			});

			const startMessage = trainerSpec.dialogue?.start || `You are challenged by ${trainerSpec.name}!`;
			this.sendReply(`|uhtml|rpg-${user.id}|${generateBattleHTML(activeBattles.get(user.id), [startMessage])}`);
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

				// --- NEW COMMAND STRUCTURE ---
				// /rpg battleaction move [attackerSlot] [moveId] [targetSlot]
				// e.g., /rpg battleaction move 0 tackle 2
				const [attackerSlotStr, moveId, targetSlotStr] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);
				const targetSlotIndex = parseInt(targetSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId || isNaN(targetSlotIndex)) {
					// This is now a user-facing error, but we'll show it in the UI
					// to guide them, as this command will be sent by buttons.
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["Error: Invalid move command received."])}`);
				}

				// Validate attacker slot
				if (attackerSlotIndex !== 0 && attackerSlotIndex !== 1) {
					return this.errorReply("Invalid attacker slot. Must be 0 or 1.");
				}
				const attackerSlot = battle.playerSlots[attackerSlotIndex];
				if (!attackerSlot || attackerSlot.pokemon.hp <= 0) {
					return this.errorReply("This Pokémon is not in battle or has fainted.");
				}

				// Check if action is already registered
				if (battle.pendingActions[attackerSlotIndex]) {
					return this.errorReply(`${attackerSlot.pokemon.species} is already waiting to move.`);
				}

				// Validate move
				const moveData = getMove(toID(moveId));
				if (!moveData.exists) {
					return this.errorReply(`Move '${moveId}' not found.`);
				}
				const moveObject = attackerSlot.pokemon.moves.find(m => m.id === moveData.id);
				if (!moveObject && moveData.id !== 'struggle') {
					return this.errorReply(`${attackerSlot.pokemon.species} does not know ${moveData.name}.`);
				}

				// --- Pre-action validation (send feedback to UI) ---
				if (attackerSlot.tauntTurns > 0 && moveData.category === 'Status') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} is taunted! It can't use ${moveData.name}!`])}`);
				}
				if (battle.magicRoomTurns === 0 && attackerSlot.pokemon.item === 'assaultvest' && moveData.category === 'Status') {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Your Assault Vest prevents you from using ${moveData.name}!`])}`);
				}
				if (moveObject && moveObject.pp === 0) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`There is no PP left for ${moveData.name}!`])}`);
				}
				// Check Disable
				if (attackerSlot.disabledMove && attackerSlot.disabledMove.moveId === moveData.id) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${moveData.name} is disabled!`])}`);
				}
				// Check Encore
				if (attackerSlot.encoreMove && attackerSlot.encoreMove.moveId !== moveData.id) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} must use ${attackerSlot.encoreMove.moveId}!`])}`);
				}
				// Check Torment
				if (attackerSlot.tormentActive && attackerSlot.lastMoveUsed === moveData.id) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} can't use the same move twice due to Torment!`])}`);
				}
				// --- FIX: Check Choice Item Lock ---
				if (attackerSlot.lockedMove && attackerSlot.lockedMove !== moveData.id && battle.magicRoomTurns === 0) {
					const lockedMoveObject = attackerSlot.pokemon.moves.find(m => m.id === attackerSlot.lockedMove);
					if (lockedMoveObject && lockedMoveObject.pp > 0) {
						return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${attackerSlot.pokemon.species} is locked into ${lockedMoveObject.id}!`])}`);
					}
				}
				// --- END FIX ---

				// --- Queue the action ---
				battle.pendingActions[attackerSlotIndex] = {
					actionType: 'move',
					moveId: moveData.id,
					targetSlot: targetSlotIndex,
					pokemonId: attackerSlot.pokemon.id,
				};

				const messageLog = [`${attackerSlot.pokemon.species} is ready to use ${moveData.name}!`];

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

				const [attackerSlotStr, moveId] = target.split(' ');
				const attackerSlotIndex = parseInt(attackerSlotStr);

				if (isNaN(attackerSlotIndex) || !moveId) {
					return this.errorReply("Invalid command.");
				}

				// Re-render the UI in "target selection" mode
				this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`Select a target for ${getMove(moveId).name}.`], { attackerSlotIndex, moveId })}`);
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
					if (battle.pendingPivot && battle.pendingPivot.slotIndex === slotToFill) {
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
				const [nextPokemon] = player.party.splice(partyIndex, 1);
				const newSlot = createActivePokemonSlot(nextPokemon);

				const playerColor = '#007bff';
				const infoColor = '#dc3545';
				const messageLog = [`<span style="color: ${playerColor};">Go, ${nextPokemon.species}!</span>`];

				// **NEW:** Check if this is a pivot switch
				if (battle.pendingPivot && battle.pendingPivot.slotIndex === slotToFill) {
					// It's a pivot, add the pivoting pokemon back to the party
					player.party.push(battle.pendingPivot.slot.pokemon);

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

				// --- NEW TRAP CHECK ---
				if (outgoingSlot.isTrapped) {
					this.errorReply(`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`);
					// Re-render the UI with an error message
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, [`${outgoingSlot.pokemon.species} is trapped and cannot switch out!`])}`);
				}

				// --- INGRAIN CHECK ---
				if (outgoingSlot.isIngrained) {
					this.errorReply(`${outgoingSlot.pokemon.species} is rooted in place by Ingrain and cannot switch out!`);
					// Re-render the UI with an error message
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
					const slotIndex = battle.opponentSlots.indexOf(activeOpponents[0]);
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

				// --- NEW: Get target slot ---
				const targetSlot = getSlotFromIndex(battle, targetSlotIndex);
				if (!targetSlot || (targetSlotIndex !== 2 && targetSlotIndex !== 3)) {
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["That is not a valid target!"])}`);
				}

				// --- NEW: Queue AI moves for other slots ---
				battle.turn++;
				battle.pendingActions = {}; // Clear previous actions

				// Player action is "catch"
				// We need to find which player slot to "use" for turn order, just pick the first one
				const playerSlot = getActiveSlots(battle.playerSlots)[0];
				if (playerSlot) {
					const playerSlotIndex = battle.playerSlots.indexOf(playerSlot);
					battle.pendingActions[playerSlotIndex] = {
						actionType: 'move', // Use 'move' action with high priority
						moveId: 'catch', // This is a placeholder
						targetSlot: targetSlotIndex,
						pokemonId: playerSlot.pokemon.id,
					};
				}

				// Generate AI actions for all *other* opponents
				getActiveSlots(battle.opponentSlots).forEach((slot, i) => {
					const slotIndex = battle.opponentSlots.indexOf(slot);
					if (slotIndex !== targetSlotIndex) { // Don't generate move for the Pokemon being caught
						battle.pendingActions[slotIndex] = generateAiAction(slot, slotIndex, battle);
					}
				});

				// Find other player Pokemon to generate a "wait" action
				const otherPlayerSlot = getActiveSlots(battle.playerSlots)[1];
				if (otherPlayerSlot) {
					const otherSlotIndex = battle.playerSlots.indexOf(otherPlayerSlot);
					battle.pendingActions[otherSlotIndex] = {
						actionType: 'move',
						moveId: 'wait', // Placeholder
						targetSlot: 0,
						pokemonId: otherPlayerSlot.pokemon.id,
					};
				}

				// --- END NEW ---

				const player = getPlayerData(battle.playerId);
				const ballItem = player.inventory.get(ballId);

				if (!ballItem || ballItem.category !== 'pokeball' || ballItem.quantity < 1) {
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
					messageLog.push(`<span style="color: ${infoColor};"><strong>${shakeMessages[catchResult.shakes]}</strong></span>`);

					// --- NEW: Run the rest of the turn ---
					// The catch "action" is done. Now process the rest of the turn (AI moves).
					processTurn(this, battle, room, user);
				}
			},

			run(target, room, user) {
				const battle = activeBattles.get(user.id);
				if (!battle) return this.errorReply("You are not in a battle.");

				// --- NEW CHECK ---
				if (battle.battleType === 'trainer' || battle.battleType === 'trainer_double') {
					this.errorReply("You can't run from a Trainer battle!");
					return this.sendReply(`|uhtmlchange|rpg-${user.id}|${generateBattleHTML(battle, ["You can't run from a Trainer battle!"])}`);
				}

				// --- NEW: Check if any active pokemon is trapped ---
				const playerSlots = getActiveSlots(battle.playerSlots);
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
					html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id}" class="button">${pokemon.species}</button> (Currently holding: ${pokemon.item ? ITEMS_DATABASE[pokemon.item].name : 'None'})</div>`;
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
						html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg takeitem ${pokemon.id}" class="button">${pokemon.species}</button> (Holding: ${ITEMS_DATABASE[pokemon.item].name})</div>`;
					}
				}
				html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
				return this.sendReply(`|uhtmlchange|rpg-${user.id}|${html}`);
			}

			const pokemon = player.party.find(p => p.id === pokemonId);
			if (!pokemon) return this.errorReply("Pokémon not found in your party.");
			if (!pokemon.item) return this.errorReply(`${pokemon.species} is not holding an item.`);

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

		help() {
			return this.parse('/help rpg');
		},
		'': 'help',
	},
};

/**************
* HTML UI ENDS
**************/

export const helpData = [
	"/rpg start - Start your Pokemon RPG adventure",
	"/rpg menu - Access the main RPG menu",
	"/rpg profile - View your trainer profile",
	"/rpg party - View your Pokemon party",
	"/rpg summary [pokemon id] - View a detailed summary of a Pokemon in your party",
	"/rpg battle - Access battle options",
	"/rpg wildpokemon - Find and battle a wild Pokemon",
	"/rpg challenge [trainer id] - Challenge a trainer to a battle",
	"/rpg items - View your inventory",
	"/rpg pc - Access Pokemon PC storage system",
	"/rpg heal - Restore your party's HP, PP, and status conditions.",
	"/rpg learnmove [move to replace | skip] - Make a decision on learning a new move",
	"/rpg giveitem [pokemon id] [item id] - Give a held item to a Pokémon.",
	"/rpg takeitem [pokemon id] - Take a held item from a Pokémon.",
];
