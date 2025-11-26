import { Dex, toID } from '../../../sim/dex';
import { getMove, getActiveSlots } from './utils';
import { ITEMS_DATABASE } from './items';
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, getZoneLocation } from './game-locations';
import { getPlayerData } from './core';
import { GameConfig } from './game-config';
import {
	getSpriteUrl,
	generateHPBar,
	generateExpBar,
	generateBottomNavigation,
	generatePokemonInfoHTML,
	generateSideEffectTags,
	generatePokemonStatusTagsHTML,
} from './html';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState } from './interface';

export function generateBattleActionButtonsHTML(
	battle: BattleState,
	playerSlot: ActivePokemonSlot | null
): string {
	const switchButton = '<button name="send" value="/rpg battleaction switchmenu" class="button rpg-battle-action-button">🔄 POKÉMON</button>';

	if (battle.battleType === 'battletower') {
		return `<p class="rpg-text-center rpg-margin-top">${switchButton}</p>`;
	}

	const isWild = battle.battleType === 'wild' || battle.battleType === 'wild_double';

	// Bag button (combines items and poké balls)
	const bagButton = '<button name="send" value="/rpg battleaction bagmenu" class="button rpg-battle-action-button">🎒 BAG</button>';

	// Run button (only for wild battles)
	let runButton = '';
	if (isWild) {
		const canRun = !playerSlot?.isTrapped;
		runButton = canRun ?
			'<button name="send" value="/rpg battleaction run" class="button rpg-battle-action-button">🏃 RUN</button>' :
			'<button class="button rpg-battle-action-button" disabled>🏃 RUN</button>';
	}

	// Build button row with available buttons
	const buttons = [switchButton, bagButton, runButton].filter(b => b !== '').join(' ');
	return `<p class="rpg-text-center rpg-margin-top">${buttons}</p>`;
}

export function generateBattleMoveSelectionHTML(
	battle: BattleState,
	slot: ActivePokemonSlot,
	slotIndex: number,
	isDoubleBattle: boolean,
	teraToggled?: boolean
): string {
	const pokemon = slot.pokemon;
	let moveButtonsHTML = '';

	const allMovesOutOfPP = pokemon.moves.every(m => m.pp === 0);

	const isRampagingWithNoPP = (slot.lockedMoveCounter > 0 || slot.uproarTurns > 0) &&
		slot.lockedMove &&
		pokemon.moves.find(m => m.id === slot.lockedMove)?.pp === 0;

	const isEncoredWithNoPP = slot.encoreMove &&
		pokemon.moves.find(m => m.id === slot.encoreMove!.moveId)?.pp === 0;

	const isChargingWithNoPP = slot.chargingMove &&
		pokemon.moves.find(m => m.id === slot.chargingMove)?.pp === 0;

	const isChoiceLockedWithNoPP = slot.lockedMove &&
		slot.lockedMoveCounter === 0 &&
		slot.uproarTurns === 0 &&
		battle.magicRoomTurns === 0 &&
		pokemon.moves.find(m => m.id === slot.lockedMove)?.pp === 0;

	if (allMovesOutOfPP || isRampagingWithNoPP || isEncoredWithNoPP || isChargingWithNoPP || isChoiceLockedWithNoPP) {
		const buttonContent = '<div class="rpg-move-name">Struggle</div>' +
			'<div class="rpg-move-info">' +
			'<span>Normal</span>' +
			'<span class="rpg-move-pp">-- / --</span>' +
			'</div> ';

		const struggleCommand = isDoubleBattle ?
			`/rpg battleaction selecttarget ${slotIndex} struggle` :
			`/rpg battleaction move ${slotIndex} struggle 2`;

		moveButtonsHTML = '<table class="rpg-move-grid">';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += `<td class="rpg-move-grid-cell"><button name="send" value="${struggleCommand}" class="button rpg-move-button">${buttonContent}</button></td>`;
		moveButtonsHTML += '<td class="rpg-move-grid-cell"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell"></td>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '</table>';
	} else {
		const canTerastallize = !battle.playerSide.terastallizeUsed && !slot.terastallized;
		const teraActive = teraToggled || false;

		const moveButtons = pokemon.moves.map(move => {
			const moveData = getMove(move.id);

			const isDisabled = (slot.disabledMove && slot.disabledMove.moveId === move.id) ||
				(slot.encoreMove && slot.encoreMove.moveId !== move.id) ||
				(slot.tauntTurns > 0 && moveData.category === 'Status') ||
				(slot.lockedMoveCounter > 0 && slot.lockedMove !== move.id) ||
				(slot.uproarTurns > 0 && slot.lockedMove !== move.id) ||
				(slot.lockedMove && slot.lockedMoveCounter === 0 && slot.uproarTurns === 0 && slot.lockedMove !== move.id) ||
				move.pp === 0;

			const buttonClasses = 'button rpg-move-button' + (teraActive ? ' rpg-move-button-terastallized' : '');
			const buttonContent = '<div class="rpg-move-name">' + (teraActive ? '⭐ ' : '') + moveData.name + '</div>' +
				'<div class="rpg-move-info">' +
				'<span>' + moveData.type + '</span>' +
				'<span class="rpg-move-pp">' + String(move.pp) + ' / ' + String(moveData.pp) + '</span>' +
				'</div> ';

			const teraParam = teraActive ? ' terastallize' : '';

			const moveCommand = isDoubleBattle ?
				`/rpg battleaction selecttarget ${slotIndex} ${toID(move.id)}${teraParam}` :
				`/rpg battleaction move ${slotIndex} ${toID(move.id)} 2${teraParam}`;

			return `<button name="send" value="${moveCommand}" class="${buttonClasses}" ${isDisabled ? 'disabled' : ''}> ${buttonContent}</button>`;
		});

		let teraToggleHTML = '';
		if (canTerastallize) {
			const teraToggleClasses = 'button rpg-tera-toggle' + (teraActive ? ' rpg-tera-toggle-on' : '');
			const teraToggleText = teraActive ? '⭐ Terastallize: ON' : 'Terastallize: OFF';
			const teraToggleCommand = teraActive ? '/rpg battleaction teratoggle off' : '/rpg battleaction teratoggle on';
			teraToggleHTML = `<div class="rpg-text-center"><button name="send" value="${teraToggleCommand}" class="${teraToggleClasses}">${teraToggleText}</button></div>`;
		}

		moveButtonsHTML = teraToggleHTML + '<table class="rpg-move-grid">';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell">' + (moveButtons[0] || '') + '</td>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell">' + (moveButtons[1] || '') + '</td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell">' + (moveButtons[2] || '') + '</td>';
		moveButtonsHTML += '<td class="rpg-move-grid-cell">' + (moveButtons[3] || '') + '</td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '</table>';
	}

	return moveButtonsHTML;
}

export function generateAvailablePokemonListHTML(
	battle: BattleState,
	player: PlayerData,
	commandPrefix: string,
	additionalFilter?: (pokemon: RPGPokemon) => boolean
): string {
	const partyToUse = battle.overridePlayerParty || player.party;

	let availableParty = partyToUse.filter(p =>
		p.hp > 0 &&
		!battle.playerSide.slots.some(s => s?.pokemon.id === p.id)
	);

	if (additionalFilter) {
		availableParty = availableParty.filter(additionalFilter);
	}

	if (availableParty.length === 0) {
		return `<p>You have no other Pokémon to switch to!</p>`;
	}

	const switchButtons = availableParty.map(pokemon => {
		const spriteUrl = getSpriteUrl(pokemon, 'front');

		const hpBar = generateHPBar(pokemon);
		const statusTag = pokemon.status ? `<span class="rpg-tag rpg-tag-${pokemon.status}">${pokemon.status.toUpperCase()}</span>` : '';

		const buttonContent =
			`<div class="rpg-switch-icon"><img src="${spriteUrl}" /></div>` +
			`<div class="rpg-switch-info">` +
			`<strong>${pokemon.nickname || pokemon.species}</strong> ${statusTag}<br>` +
			`<small>Lvl ${pokemon.level}</small>` +
			`${hpBar}` +
			`</div>`;

		return `<button name="send" value="${commandPrefix} ${pokemon.id}" class="button rpg-switch-button">${buttonContent}</button>`;
	});

	let html = '<table class="rpg-move-grid"><tr>';
	let count = 0;

	for (const button of switchButtons) {
		html += `<td class="rpg-move-grid-cell">${button}</td>`;
		count++;
		if (count % 2 === 0 && count < switchButtons.length) {
			html += '</tr><tr>';
		}
	}

	html += '</tr></table>';
	return html;
}

export function generateSharedBattlePokemonInfo(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	battle?: BattleState
): string {
	const pokemon = slot.pokemon;

	const allStatusTags = generatePokemonStatusTagsHTML(slot, false, battle);
	const statusDisplay = allStatusTags || '&nbsp;';

	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';

	const nameLineHTML = '<div class="rpg-battle-name-line">' +
		(pokemon.nickname || pokemon.species) + ' ' + genderSymbol + shinySymbol + ' L' + String(pokemon.level) +
		'</div>';

	const hpBarHTML = generateHPBar(pokemon);

	const isBattleTower = battle?.battleType === 'battletower';
	const expBarHTML = (isPlayerSide && !isBattleTower) ? generateExpBar(pokemon) : '';

	let html = '';
	html += nameLineHTML;
	html += hpBarHTML;
	html += expBarHTML;
	html += `<div class="rpg-battle-status-line">${statusDisplay}</div>`;
	return html;
}

export function generateGlobalBattleConditionsHTML(battle: BattleState): string {
	const weatherTags = generateWeatherTags(battle);
	const terrainTags = generateTerrainTags(battle);
	const fieldEffectTags = generateFieldEffectTags(battle);

	const allTags = [weatherTags, terrainTags, fieldEffectTags].filter(Boolean).join('');

	if (allTags) {
		return `<div class="rpg-weather-container">` +
			allTags +
			`</div>`;
	}

	return '';
}

export function generateWeatherTags(battle: BattleState): string {
	if (!battle.weather) return '';

	const weatherNames: Record<string, string> = {
		'sun': 'Sun',
		'rain': 'Rain',
		'sand': 'Sandstorm',
		'hail': 'Snow',
		'harsh-sun': 'Harsh Sun',
		'heavy-rain': 'Heavy Rain',
		'strong-winds': 'Strong Winds',
	};

	const weatherTypeKey = battle.weather.type;

	const weatherClass = weatherNames.hasOwnProperty(weatherTypeKey) ?
		`rpg-weather-${weatherTypeKey}` :
		'rpg-weather-default';

	const name = weatherNames[weatherTypeKey] || weatherTypeKey;
	const turnsText = battle.weather.turns > 0 ? ` (${battle.weather.turns})` : '';

	return `<span class="rpg-weather-tag ${weatherClass}">${name}${turnsText}</span>`;
}

export function generateTerrainTags(battle: BattleState): string {
	if (!battle.terrain) return '';

	const terrainNames: Record<string, string> = {
		'electric': 'Electric Terrain',
		'grassy': 'Grassy Terrain',
		'misty': 'Misty Terrain',
		'psychic': 'Psychic Terrain',
	};

	const terrainTypeKey = battle.terrain.type;

	const terrainClass = terrainNames.hasOwnProperty(terrainTypeKey) ?
		`rpg-terrain-${terrainTypeKey}` :
		'rpg-terrain-default';

	const name = terrainNames[terrainTypeKey] || terrainTypeKey;
	const turnsText = battle.terrain.turns > 0 ? ` (${battle.terrain.turns})` : '';

	return `<span class="rpg-terrain-tag ${terrainClass}">${name}${turnsText}</span>`;
}

export function generateFieldEffectTags(battle: BattleState): string {
	const effects: string[] = [];

	const tagClass = 'rpg-field-effect-tag';

	if (battle.trickRoomTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-trickroom">Trick Room (${battle.trickRoomTurns})</span>`);
	}
	if (battle.magicRoomTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-magicroom">Magic Room (${battle.magicRoomTurns})</span>`);
	}
	if (battle.wonderRoomTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-wonderroom">Wonder Room (${battle.wonderRoomTurns})</span>`);
	}
	if (battle.gravityTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-gravity">Gravity (${battle.gravityTurns})</span>`);
	}
	if (battle.mudSportTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-mudsport">Mud Sport (${battle.mudSportTurns})</span>`);
	}
	if (battle.waterSportTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-watersport">Water Sport (${battle.waterSportTurns})</span>`);
	}
	if (battle.fairyLockTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-fairylock">Fairy Lock (${battle.fairyLockTurns})</span>`);
	}
	if (battle.ionDelugeTurns > 0) {
		effects.push(`<span class="${tagClass} rpg-field-iondeluge">Ion Deluge (${battle.ionDelugeTurns})</span>`);
	}

	return effects.join('');
}

export function generateBattleActionPanel(battle: BattleState, teraToggled?: boolean): string {
	const isDoubleBattle = battle.battleType.includes('double');
	const [pSlot0, pSlot1] = battle.playerSide.slots;

	let activeSlot: ActivePokemonSlot | null = null;
	let activeSlotIndex = -1;

	if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
		activeSlot = pSlot0;
		activeSlotIndex = 0;
	} else if (isDoubleBattle && pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
		activeSlot = pSlot1;
		activeSlotIndex = 1;
	}

	let html = '';

	if (activeSlot) {
		const pokemon = activeSlot.pokemon;
		html += '<p>What will <strong>' + (pokemon.nickname || pokemon.species) + '</strong> do?</p>';
		html += generateBattleMoveSelectionHTML(battle, activeSlot, activeSlotIndex, isDoubleBattle, teraToggled);
	} else if (!battle.battleEnded) {
		html += '<p class="rpg-margin-top rpg-text-center rpg-text-muted">Waiting for opponent...</p>';
	}

	const anyActivePlayerSlot = (pSlot0 && pSlot0.pokemon.hp > 0) ? pSlot0 : (isDoubleBattle && pSlot1 && pSlot1.pokemon.hp > 0) ? pSlot1 : null;
	html += generateBattleActionButtonsHTML(battle, anyActivePlayerSlot);

	return html;
}

export function generateBattleTargetSelection(battle: BattleState, targetSelection: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
	const [pSlot0, pSlot1] = battle.playerSide.slots;
	const [oSlot0, oSlot1] = battle.opponentSide.slots;
	const move = getMove(targetSelection.moveId);
	const teraText = targetSelection.shouldTerastallize ? ' (with Terastallization)' : '';

	let html = '<p>Select a target for <strong>' + move.name + '</strong>' + teraText + ':</p>';

	const targets = [
		{ slot: oSlot0, name: "Opponent 1", index: 2 },
		{ slot: oSlot1, name: "Opponent 2", index: 3 },
		{ slot: pSlot0, name: "Ally 1", index: 0 },
		{ slot: pSlot1, name: "Ally 2", index: 1 },
	];

	const teraParam = targetSelection.shouldTerastallize ? ' terastallize' : '';

	const validTargets = targets.filter(target => {
		if (!target.slot || target.slot.pokemon.hp <= 0) return false;
		return target.index !== targetSelection.attackerSlotIndex;
	});

	const targetButtons = validTargets.map(target => {
		const hpPercent = Math.floor((target.slot!.pokemon.hp / target.slot!.pokemon.maxHp) * 100);

		const buttonContent =
			`<div class="rpg-move-name">${target.name}</div>` +
			`<div class="rpg-move-info" style="text-align: center;">HP: ${hpPercent}%</div>`;

		return `<button name="send" value="/rpg battleaction move ${String(targetSelection.attackerSlotIndex)} ${toID(targetSelection.moveId)} ${String(target.index)}${teraParam}" class="button rpg-move-button">${buttonContent}</button>`;
	});

	let targetButtonsHTML = '<table class="rpg-move-grid"><tr>';
	let count = 0;
	for (const button of targetButtons) {
		targetButtonsHTML += `<td class="rpg-move-grid-cell">${button}</td>`;
		count++;
		if (count % 2 === 0 && count < targetButtons.length) {
			targetButtonsHTML += '</tr><tr>';
		}
	}
	targetButtonsHTML += '</tr></table>';

	html += targetButtonsHTML;
	html += `<center><p class="rpg-margin-top"><button name="send" value="/rpg battleaction back" class="button">Cancel</button></p></center>`;
	return html;
}

export function generateBattleHeader(battle: BattleState): string {
	if (battle.battleType === 'battletower') {
		const currentFloor = battle.floor || 1;
		const formatConfig = BATTLE_TOWER_FORMATS[battle.battleTowerFormat || 'battlefactory'];
		const formatName = formatConfig ? formatConfig.name : 'Battle Factory';
		return '<div class="rpg-text-center">' +
			'<h2">🗼 ' + formatName + ' Battle Tower - Floor ' + String(currentFloor) + '</h2>' +
			'</div>';
	}
	return '';
}

export function generateBattlefield(battle: BattleState, targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
	const isDoubleBattle = battle.battleType.includes('double');

	const generateBattleSlot = (
		slot: ActivePokemonSlot | null,
		slotIndex: number,
		side: 'player' | 'opponent'
	) => {
		if (!slot || slot.pokemon.hp <= 0) {
			return '';
		}

		const pokemon = slot.pokemon;

		const infoContents = generateSharedBattlePokemonInfo(slot, side === 'player', battle);

		const spriteUrl = getSpriteUrl(pokemon, side === 'player' ? 'back' : 'front');
		const spriteClass = side === 'player' ? 'rpg-pokemon-sprite-back' : 'rpg-pokemon-sprite-front';

		const slotWrapperClass = side === 'player' ? 'rpg-player-slot' : 'rpg-opponent-slot';
		const infoClass = side === 'player' ? 'rpg-player-info' : 'rpg-opponent-info';

		let containerClasses = `${infoClass}`;
		if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
			containerClasses += " rpg-target-select";
		}
		if (battle.pendingActions[slotIndex]) {
			containerClasses += " rpg-action-pending";
		}

		let posClass = '';
		if (isDoubleBattle) {
			posClass = `rpg-double-slot-${slotIndex}`;
		} else {
			posClass = side === 'player' ? 'rpg-single-slot-player' : 'rpg-single-slot-opponent';
		}

		let html = `<div class="${slotWrapperClass} ${posClass}">`;
		html += `<div class="${containerClasses}">${infoContents}</div>`;
		html += `<img class="${spriteClass}" src="${spriteUrl}" width="60" height="60" />`;
		html += `</div>`;

		return html;
	};

	const bgUrl = GameConfig.assets.battleBackgroundUrl;

	let html = `<div class="rpg-battle-ui" style="background: url('${bgUrl}') no-repeat center bottom !important; background-size: cover !important;">`;

	html += generateGlobalBattleConditionsHTML(battle);

	html += '<div class="rpg-opponent-side">';
	html += generateBattleSlot(battle.opponentSide.slots[0], 2, 'opponent');
	if (isDoubleBattle) {
		html += generateBattleSlot(battle.opponentSide.slots[1], 3, 'opponent');
	}
	html += '</div>';

	html += '<div class="rpg-player-side">';
	html += generateBattleSlot(battle.playerSide.slots[0], 0, 'player');
	if (isDoubleBattle) {
		html += generateBattleSlot(battle.playerSide.slots[1], 1, 'player');
	}
	html += '</div>';

	html += '</div>';
	return html;
}

export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean },
	teraToggled?: boolean,
	scriptedEventId?: string
): string {
	const reversedBattleLog = [...battle.battleLog].reverse();
	const combinedLogs = [...messageLog, ...reversedBattleLog];

	const historyLogHTML = `<div class="rpg-battle-log">` +
		(combinedLogs.length > 0 ? combinedLogs.join('<br>') : 'Battle started...') +
		`</div>`;

	if (battle.battleEnded) {
		let actionHTML = '';
		if (battle.battleType !== 'battletower') {
			let continueCommand = '/rpg explore';

			if (battle.battleResult === 'victory') {
				// New Logic: Check if the battle was against a trainer inside a building
				const player = getPlayerData(battle.playerId);
				const currentLocationId = toID(player.location);

				if (battle.trainerId) {
					const location = LOCATIONS[currentLocationId];

					if (location?.buildings) {
						for (const building of location.buildings) {
							// Check Room-level trainers and leaders
							if (building.rooms) {
								for (const room of building.rooms) {
									if (room.trainers?.includes(battle.trainerId)) {
										continueCommand = `/rpg building ${toID(building.id)} ${toID(room.id)}`;
										break;
									}
									if (room.gymLeaderId === battle.trainerId) {
										continueCommand = `/rpg building ${toID(building.id)} ${toID(room.id)}`;
										break;
									}
								}
							}
						}
					}
				}

				if (battle.zoneId) {
					const locInfo = getZoneLocation(battle.zoneId, currentLocationId);
					if (locInfo?.buildingId && locInfo.roomId) {
						continueCommand = `/rpg building ${locInfo.buildingId} ${locInfo.roomId}`;
					}
				}
			}

			if (battle.battleResult === 'victory' && scriptedEventId) {
				continueCommand = `/rpg completeevent ${toID(scriptedEventId)}`;
			}

			actionHTML = `<p class="rpg-margin-top rpg-text-center">` +
				`<button name="send" value="${continueCommand}" class="button rpg-button-victory">Continue</button>` +
				'</p>';
		}

		return '<div class="rpg-infobox">' +
			generateBattleHeader(battle) +
			historyLogHTML +
			actionHTML +
			'</div>';
	}

	const headerHTML = generateBattleHeader(battle);
	const battlefieldHTML = generateBattlefield(battle, targetSelection);

	let actionPanelHTML = '';
	if (targetSelection && battle.battleType.includes('double')) {
		actionPanelHTML = generateBattleTargetSelection(battle, targetSelection);
	} else {
		actionPanelHTML = generateBattleActionPanel(battle, teraToggled);
	}

	return '<div class="rpg-infobox">' +
		headerHTML +
		battlefieldHTML +
		historyLogHTML +
		actionPanelHTML +
		'</div>';
}

export function generateSwitchMenuHTML(battle: BattleState, target?: string): string {
	let html = `<div class="rpg-infobox"><h2>Choose a Pokémon to switch</h2>`;
	const player = getPlayerData(battle.playerId);
	const [pSlot0, pSlot1] = battle.playerSide.slots;

	let slotToSwitchOut: number;

	if (target !== undefined && target !== '') {
		slotToSwitchOut = parseInt(target);
	} else {
		const isDoubleBattle = battle.battleType.includes('double') || battle.battleType === 'battletower';

		if (!isDoubleBattle && battle.battleType !== 'battletower') {
			slotToSwitchOut = 0;
		} else {
			if (pSlot0 && pSlot0.pokemon.hp > 0 && !battle.pendingActions[0]) {
				slotToSwitchOut = 0;
			} else if (pSlot1 && pSlot1.pokemon.hp > 0 && !battle.pendingActions[1]) {
				slotToSwitchOut = 1;
			} else {
				slotToSwitchOut = 0;
			}
		}
	}

	const outgoingPokemon = battle.playerSide.slots[slotToSwitchOut]?.pokemon;
	if (!outgoingPokemon) {
		return `<div class="rpg-infobox"><h2>Error: Invalid slot.</h2><p><button name="send" value="/rpg battleaction back" class="button">Back</button></p></div>`;
	}

	html += `<p>Select a Pokémon to replace <strong>${outgoingPokemon.species}</strong>:</p>`;

	const commandPrefix = `/rpg battleaction playerswitch ${slotToSwitchOut}`;
	html += generateAvailablePokemonListHTML(battle, player, commandPrefix);

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateFaintSwitchHTML(battle: BattleState, message: string): string {
	let html = `<div class="rpg-infobox"><h2>A Pokémon fainted!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);

	const isDoubleBattle = battle.battleType.includes('double');

	let slotToFill = -1;

	if (battle.playerSide.slots[0] === null || (battle.playerSide.slots[0] && battle.playerSide.slots[0].pokemon.hp <= 0)) {
		slotToFill = 0;
	} else if (isDoubleBattle && (battle.playerSide.slots[1] === null ||
		(battle.playerSide.slots[1] && battle.playerSide.slots[1].pokemon.hp <= 0))) {
		slotToFill = 1;
	}

	if (slotToFill === -1) {
		html += `<p>Error: No empty slot found.</p><button name="send" value="/rpg battleaction back" class="button">Back</button>`;
	} else {
		html += `<p>Choose a Pokémon to send to <strong>Slot ${slotToFill + 1}</strong>:</p>`;

		const commandPrefix = `/rpg battleaction forceswitch ${slotToFill}`;
		html += generateAvailablePokemonListHTML(battle, player, commandPrefix);
	}
	html += `</div>`;
	return html;
}

export function generatePivotSwitchHTML(battle: BattleState, message: string, pivotSlotIndex: number): string {
	let html = `<div class="rpg-infobox"><h2>A Pokémon is switching out!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);
	const pivotingPokemon = battle.pendingPivot?.slot.pokemon;

	html += `<p>Choose a Pokémon to replace <strong>${pivotingPokemon?.species || 'your Pokémon'}</strong> in <strong>Slot ${pivotSlotIndex + 1}</strong>:</p>`;

	const commandPrefix = `/rpg battleaction forceswitch ${pivotSlotIndex}`;
	const filter = (p: RPGPokemon) => p.id !== pivotingPokemon?.id;
	html += generateAvailablePokemonListHTML(battle, player, commandPrefix, filter);

	if (!battle.overridePlayerParty && player.party.filter(p => p.hp > 0 && p.id !== pivotingPokemon?.id && !battle.playerSide.slots.some(s => s?.pokemon.id === p.id)).length === 0) {
		html += `<p><button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} cancel" class="button">Continue</button></p>`;
	}

	html += `</div>`;
	return html;
}

function getAvailablePokeBalls(player: PlayerData): InventoryItem[] {
	return Array.from(player.inventory.values()).filter(item =>
		item.category === 'pokeball' && item.quantity > 0
	);
}

export function generateCatchMenuHTML(player: PlayerData, battle: BattleState): string {
	let html = `<div class="rpg-infobox"><h2>Select a Poke Ball</h2>`;

	const pokeBalls = getAvailablePokeBalls(player);

	const isDoubleBattle = battle.battleType.includes('double');
	const activeOpponents = getActiveSlots(battle.opponentSide.slots);

	if (pokeBalls.length === 0) {
		html += `<p>You have no Poke Balls!</p>`;
	} else {
		const ballButtons = pokeBalls.map(ball => {
			let command = '';

			const safeBallId = toID(ball.id);

			if (isDoubleBattle && activeOpponents.length > 1) {
				command = `/rpg battleaction selectcatchtarget ${safeBallId}`;
			} else if (isDoubleBattle && activeOpponents.length === 1) {
				const targetSlot = battle.opponentSide.slots.indexOf(activeOpponents[0]) + 2;
				command = `/rpg battleaction catch ${safeBallId} ${targetSlot}`;
			} else {
				command = `/rpg battleaction catch ${safeBallId} 2`;
			}

			const buttonContent =
				`<div class="rpg-switch-info">` +
				`<strong>${ball.name}</strong><br>` +
				`<small>x${ball.quantity}</small>` +
				`</div>`;

			return `<button name="send" value="${command}" class="button rpg-catch-button">${buttonContent}</button>`;
		});

		html += '<table class="rpg-move-grid"><tr>';
		let count = 0;
		for (const button of ballButtons) {
			html += `<td class="rpg-move-grid-cell">${button}</td>`;
			count++;
			if (count % 2 === 0 && count < ballButtons.length) {
				html += '</tr><tr>';
			}
		}
		html += '</tr></table>';
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateCatchTargetHTML(battle: BattleState, ballId: string): string {
	let html = `<div class="rpg-infobox"><h2>Select a Target</h2>`;
	const item = ITEMS_DATABASE[ballId];
	const ballName = item?.name || 'Poke Ball';
	html += `<p>Choose which wild Pokémon to throw the ${ballName} at:</p>`;

	let hasTargets = false;
	for (let i = 0; i < battle.opponentSide.slots.length; i++) {
		const slot = battle.opponentSide.slots[i];
		if (!slot || slot.pokemon.hp <= 0) continue;

		hasTargets = true;
		const slotIndex = i + 2;
		const hpPercent = Math.floor((slot.pokemon.hp / slot.pokemon.maxHp) * 100);
		const statusText = slot.status ? ` (${slot.status.toUpperCase()})` : '';

		html += `<div class="rpg-card">` +
			`<strong>${slot.pokemon.species}</strong> (Lvl ${slot.pokemon.level})${statusText}<br>` +
			`HP: ${slot.pokemon.hp}/${slot.pokemon.maxHp} (${hpPercent}%)<br>` +
			`<button name="send" value="/rpg battleaction catch ${toID(ballId)} ${slotIndex}" class="button">Throw ${ballName}</button>` +
			`</div>`;
	}

	if (!hasTargets) {
		html += `<p>No targets available!</p>`;
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateRunHTML(zoneId: string): string {
	return `<div class="rpg-infobox rpg-menu-box">` +
		`<h2>Got away safely!</h2>` +
		`<p>You ran away from the wild Pokemon.</p>` +
		`<p>` +

		`<button name="send" value="/rpg wildpokemon ${toID(zoneId)}" class="button">Find Another</button>` +
		`<button name="send" value="/rpg explore" class="button">Continue Exploring</button>` +
		`</p>` +
		`</div>`;
}

export function generateCatchSuccessHTML(
	caughtPokemon: RPGPokemon,
	tempSlot: ActivePokemonSlot,
	location: string,
	zoneId: string,
	wasHealed: boolean,
	returnCommand = '/rpg explore'
): string {
	let successMessage = `<h2>Gotcha!</h2><div class="rpg-memo-box" style="text-align:center; margin-bottom:10px;"><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
	if (wasHealed) successMessage += `<p class="rpg-text-success"><small>${caughtPokemon.species} was fully healed!</small></p>`;
	successMessage += `</div>`;

	return `<div class="rpg-infobox">` +
		`${successMessage}` +
		`${generatePokemonInfoHTML(tempSlot, true)}` +
		`<p style="text-align:center; margin-top:10px;">${caughtPokemon.species} has been sent to ${location}.</p>` +
		`<hr />` +
		`<p style="text-align:center"><button name="send" value="/rpg wildpokemon ${toID(zoneId)}" class="button">Find Another</button> ` +
		`<button name="send" value="${returnCommand}" class="button">Continue Exploring</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateMultipleOpponentsCatchErrorHTML(): string {
	return `<div class="rpg-infobox rpg-menu-box"><h2>Cannot Catch</h2><p>You can't throw a Poké Ball when there are multiple wild Pokémon!</p><p>Defeat one first, then you can catch the remaining one.</p><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
}

export function generateBattleBagMenuHTML(battle: BattleState, player: PlayerData): string {
	const isWild = battle.battleType === 'wild' || battle.battleType === 'wild_double';

	let html = `<div class="rpg-infobox"><h2>Bag</h2>`;
	html += `<p>What would you like to do?</p>`;

	// Items button
	if (GameConfig.allowItemUsageInBattle) {
		html += `<p class="rpg-text-center">` +
			`<button name="send" value="/rpg battleaction itemmenu" class="button rpg-button-large" ` +
			`style="margin:5px; min-width:200px;">🎒 Items</button></p>`;
	}

	// Poké Balls button (only in wild battles)
	if (isWild) {
		const pokeBalls = getAvailablePokeBalls(player);

		if (pokeBalls.length > 0) {
			html += `<p class="rpg-text-center">` +
				`<button name="send" value="/rpg battleaction catchmenu" class="button rpg-button-large" ` +
				`style="margin:5px; min-width:200px;">⚾ Poké Balls</button></p>`;
		} else {
			html += `<p class="rpg-text-center">` +
				`<button class="button rpg-button-large disabled" disabled ` +
				`style="margin:5px; min-width:200px;">⚾ Poké Balls (Empty)</button></p>`;
		}
	}

	html += `<hr /><p class="rpg-text-center">` +
		`<button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateBattleItemMenuHTML(battle: BattleState, player: PlayerData, usableItems: InventoryItem[]): string {
	let html = `<div class="rpg-infobox"><h2>Select an Item</h2>`;

	if (usableItems.length === 0) {
		html += `<p>You don't have any items to use in battle!</p>`;
	} else {
		const itemButtons = usableItems.map(item => {
			const command = `/rpg battleaction selectitemtarget ${toID(item.id)}`;

			const buttonContent =
				`<div class="rpg-switch-info">` +
				`<strong>${item.name}</strong><br>` +
				`<small>x${item.quantity}</small><br>` +
				`<small style="color: #888;">${item.description}</small>` +
				`</div>`;

			return `<button name="send" value="${command}" class="button rpg-catch-button">${buttonContent}</button>`;
		});

		html += '<table class="rpg-move-grid"><tr>';
		let count = 0;
		for (const button of itemButtons) {
			html += `<td class="rpg-move-grid-cell">${button}</td>`;
			count++;
			if (count % 2 === 0 && count < itemButtons.length) {
				html += '</tr><tr>';
			}
		}
		html += '</tr></table>';
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateBattleItemTargetHTML(battle: BattleState, player: PlayerData, itemId: string): string {
	const item = player.inventory.get(itemId);
	if (!item) return generateBattleHTML(battle, ["Invalid item!"]);

	let html = `<div class="rpg-infobox"><h2>Use ${item.name}</h2>`;
	html += `<p>Select a Pokémon to use ${item.name} on:</p>`;

	const itemData = ITEMS_DATABASE[itemId];
	const isReviveItem = itemData?.effects?.revive || false;

	// Show player's active Pokemon
	for (let i = 0; i < battle.playerSide.slots.length; i++) {
		const slot = battle.playerSide.slots[i];
		if (!slot) continue;

		const pokemon = slot.pokemon;
		const canUse = isReviveItem ? (pokemon.hp <= 0) : (pokemon.hp > 0);

		if (canUse) {
			const spriteUrl = getSpriteUrl(pokemon, 'front');
			const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;
			const hpColor = hpPercent > 50 ? '#4CAF50' : hpPercent > 25 ? '#FFC107' : '#F44336';

			const buttonContent =
				`<div class="rpg-switch-icon"><img src="${spriteUrl}" alt="${pokemon.species}" /></div>` +
				`<div class="rpg-switch-info">` +
				`<strong>${pokemon.species}</strong> Lv. ${pokemon.level}<br>` +
				`<div class="rpg-hp-bar-container">` +
				`<div class="rpg-hp-bar" style="width: ${hpPercent}%; background-color: ${hpColor};"></div>` +
				`</div>` +
				`<small>HP: ${pokemon.hp}/${pokemon.maxHp}</small>` +
				(pokemon.status ? ` <small style="color: #F44336;">[${pokemon.status.toUpperCase()}]</small>` : '') +
				`</div>`;

			const command = `/rpg battleaction useitem ${itemId} ${i}`;
			html += `<button name="send" value="${command}" class="button rpg-catch-button">${buttonContent}</button>`;
		}
	}

	html += `<hr /><p><button name="send" value="/rpg battleaction itemmenu" class="button">Back</button></p></div>`;
	return html;
}
