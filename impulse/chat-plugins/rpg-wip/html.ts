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
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, type ENCOUNTER_ZONES, getStartingLocation } from './locations';
import { getPlayerData } from './core';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState } from './interface';
import { TOTAL_BADGES } from './badges';

// ###################################
// C O N S T A N T S
// ###################################

export const TERA_BUTTON_STYLE = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; color: #FF1493; font-weight: bold; margin-top: 4px; font-size: 0.8em; border: 2px solid #FF1493;';

// ###################################
// C O R E   U T I L I T I E S
// ###################################

function calculateExpBarPercentage(expProgress: number, expNeededForLevel: number): number {
	
	if (expNeededForLevel <= 0) return 100;

	
	return Math.min(100, Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100)));
}

function getSpriteFilename(speciesId: string): string {
	let filename = speciesId;

	if (filename.endsWith('mega')) {
		filename = filename.replace(/mega$/, '-mega');
	} else if (filename.endsWith('megax')) {
		filename = filename.replace(/megax$/, '-megax');
	} else if (filename.endsWith('megay')) {
		filename = filename.replace(/megay$/, '-megay');
	}

	const regionalFormSuffixes = [
		'alola', 'galar', 'hisui', 'paldea',
		'alolan', 'galarian', 'hisuian', 'paldean',
	];

	for (const suffix of regionalFormSuffixes) {
		if (filename.endsWith(suffix) && filename.length > suffix.length && !filename.includes('-' + suffix)) {
			filename = filename.slice(0, -suffix.length) + '-' + suffix;
			break;
		}
	}

	if (filename.endsWith('gmax')) {
		filename = filename.replace(/gmax$/, '-gmax');
	}

	if (filename.endsWith('f')) {
		filename = filename.replace(/f$/, '-f');
	}

	const hyphenatedForms: Record<string, string> = {
		'taurospaldeacombat': 'tauros-paldea-combat', 'taurospaldeablaze': 'tauros-paldea-blaze', 'taurospaldeaaqua': 'tauros-paldea-aqua',
		'palafinhero': 'palafin-hero', 'gimmighoulroaming': 'gimmighoul-roaming', 'gholdengochest': 'gholdengo-chest',
		'koraidonapex': 'koraidon-apex', 'koraidonlimited': 'koraidon-limited', 'miraidonapex': 'miraidon-apex',
		'miraidonlimited': 'miraidon-limited', 'ogerponwellspring': 'ogerpon-wellspring',
		'ogerponhearthflame': 'ogerpon-hearthflame', 'ogerponcornerstone': 'ogerpon-cornerstone',
		'ursalunabloodmoon': 'ursaluna-bloodmoon',

		'cramorantgorging': 'cramorant-gorging', 'cramorantgulping': 'cramorant-gulping',
		'zaciancrowned': 'zacian-crowned', 'zamazentacrowned': 'zamazenta-crowned',
		'urshifusinglestrike': 'urshifu-singlestrike', 'urshifurapidstrike': 'urshifu-rapidstrike',
		'eternatuseternamax': 'eternatus-eternamax',

		'lycanrocdusk': 'lycanroc-dusk', 'lycanrocmidnight': 'lycanroc-midnight',
		'rockruffowtempo': 'rockruff-own-tempo',
		'miniorviolet': 'minior-violet', 'miniorindigo': 'minior-indigo',
		'typenull': 'type:null',
		'silvallybug': 'silvally-bug', 'silvallydark': 'silvally-dark', 'silvallydragon': 'silvally-dragon',
		'silvallyelectric': 'silvally-electric', 'silvallyfairy': 'silvally-fairy', 'silvallyfighting': 'silvally-fighting',
		'silvallyfire': 'silvally-fire', 'silvallyflying': 'silvally-flying', 'silvallyghost': 'silvally-ghost',
		'silvallygrass': 'silvally-grass', 'silvallyground': 'silvally-ground', 'silvallyice': 'silvally-ice',
		'silvallypoison': 'silvally-poison', 'silvallypsychic': 'silvally-psychic', 'silvallyrock': 'silvally-rock',
		'silvallysteel': 'silvally-steel', 'silvallywater': 'silvally-water',
		'wishiwashischool': 'wishiwashi-school',

		'kyuremblack': 'kyurem-black', 'kyuremwhite': 'kyurem-white',

		'necrozmaduskmane': 'necrozma-dusk-mane', 'necrozmadawnwings': 'necrozma-dawn-wings',

		'dialgaorigin': 'dialga-origin', 'palkiaorigin': 'palkia-origin', 'giratinaorigin': 'giratina-origin',
		'arceusbug': 'arceus-bug', 'arceusdark': 'arceus-dark', 'arceusdragon': 'arceus-dragon',
		'arceuselectric': 'arceus-electric', 'arceusfairy': 'arceus-fairy', 'arceusfighting': 'arceus-fighting',
		'arceusfire': 'arceus-fire', 'arceusflying': 'arceus-flying', 'arceusghost': 'arceus-ghost',
		'arceusgrass': 'arceus-grass', 'arceusground': 'arceus-ground', 'arceusice': 'arceus-ice',
		'arceuspoison': 'arceus-poison', 'arceuspsychic': 'arceus-psychic', 'arceusrock': 'arceus-rock',
		'arceussteel': 'arceus-steel', 'arceuswater': 'arceus-water',
		'basculinwhitemale': 'basculin-white-striped', 'basculegionf': 'basculegion-f',
		'basculegionmale': 'basculegion-m', 'enamorusincarnate': 'enamorus-incarnate',
		'enamorustherian': 'enamorus-therian', 'landorusincarnate': 'landorus-incarnate',
		'landorustherian': 'landorus-therian', 'thundurusincarnate': 'thundurus-incarnate',
		'thundurustherian': 'thundurustherian', 'tornadusincarnate': 'tornadus-incarnate',
		'tornadustherian': 'tornadus-therian',

		'darmanitanzigzag': 'darmanitan-zen-galar', 'darmanitanzen': 'darmanitan-zen',
		'aegislashblade': 'aegislash-blade', 'meloettapirouette': 'meloetta-pirouette',
		'basculinblu': 'basculin-blue-striped', 'basculinwhite': 'basculin-white-striped',
		'castformsunny': 'castform-sunny', 'castformrainy': 'castform-rainy',
		'castformsnowy': 'castform-snowy', 'rotomfan': 'rotom-fan',
		'rotomfrost': 'rotom-frost', 'rotomheat': 'rotom-heat',
		'rotommow': 'rotom-mow', 'rotomwash': 'rotom-wash',
		'genesectdouse': 'genesect-douse', 'genesectshock': 'genesect-shock',
		'genesectburn': 'genesect-burn', 'genesectchill': 'genesect-chill',
		'shayminsky': 'shaymin-sky', 'zygardecomplete': 'zygarde-complete',
		'zygarde10': 'zygarde-10', 'toxtricitylowkey': 'toxtricity-low-key',
		'indeedeeunbound': 'indeedee-f',
	};

	if (hyphenatedForms[filename]) {
		filename = hyphenatedForms[filename];
	}

	if (filename.endsWith('f') && filename.length > 1 && !filename.includes('-f')) {
		filename = filename.slice(0, -1) + '-f';
	}

	filename = filename.replace(/\+/g, '-');

	filename = filename.replace(/-{2,}/g, '-');

	return filename;
}


export function generateBottomNavigation(): string {
	return `<hr /><center><p><button name="send" value="/rpg modes" class="button">🎮 Modes</button> ` +
		`<button name="send" value="/rpg explore" class="button">🗺️ Explore</button> ` +
		`<button name="send" value="/rpg profile" class="button">👤 Profile</button> ` +
		`<button name="send" value="/rpg pokedex" class="button">📖 Pokédex</button> ` +
		`<button name="send" value="/rpg party" class="button">⚡ Party</button> ` +
		`<button name="send" value="/rpg items" class="button">🎒 Items</button></p></center>`;
}

// ###################################
// N E W   H E L P E R S
// ###################################

function generateItemCategoryFilters(baseCommand: string): string {
	const categories = [
		{ id: '', name: 'All' },
		{ id: 'pokeball', name: 'Poké Balls' },
		{ id: 'medicine', name: 'Medicines' },
		{ id: 'held', name: 'Held Items' },
		{ id: 'berry', name: 'Berries' },
		{ id: 'tm', name: 'TMs' },
		{ id: 'key', name: 'Key Items' },
		{ id: 'misc', name: 'Misc.' },
	];

	let html = '<div style="margin: 10px 0;">';
	for (const category of categories) {
		const command = category.id ? `${baseCommand} ${category.id}` : baseCommand;
		html += `<button name="send" value="${command}" class="button">${category.name}</button> `;
	}
	html += '</div>';
	return html;
}

function generateStarterChoiceBoxHTML(speciesId: string, command: string): string {
	const species = Dex.species.get(speciesId);
	if (!species.exists) return '';

	return `<div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">` +
		`<strong>${species.name}</strong><br>` +
		`<small>Type: ${species.types.join('/')}</small><br>` +
		`<button name="send" value="${command}" class="button" style="margin-top: 5px;">Choose ${species.name}</button>` +
		`</div>`;
}

function generatePokemonStatusTagsHTML(
	slot: ActivePokemonSlot,
	isDoubleBattle: boolean = false,
	battle?: BattleState
): string {
	const pokemon = slot.pokemon;
	const displayStatus = slot.status || pokemon.status;
	const statusClass: Record<Status, string> = { 'brn': 'rpg-tag-brn', 'par': 'rpg-tag-par', 'psn': 'rpg-tag-psn', 'tox': 'rpg-tag-tox', 'slp': 'rpg-tag-slp', 'frz': 'rpg-tag-frz' };
	const statusTag = displayStatus ? `<span class="rpg-tag ${statusClass[displayStatus]}">${displayStatus.toUpperCase()}</span>` : '';

	const volatileTags = [
		slot.isConfused ? '<span class="rpg-tag rpg-tag-confused">Confused</span>' : '',
		slot.isCursed ? '<span class="rpg-tag rpg-tag-cursed">Cursed</span>' : '',
		slot.isSeeded ? '<span class="rpg-tag rpg-tag-seeded">Seeded</span>' : '',
		slot.hasNightmare ? '<span class="rpg-tag rpg-tag-nightmare">Nightmare</span>' : '',
		slot.isTrapped ? '<span class="rpg-tag rpg-tag-trapped">Trapped</span>' : '',
		slot.tauntTurns > 0 ? '<span class="rpg-tag rpg-tag-taunted">Taunted</span>' : '',
		slot.substitute ? '<span class="rpg-tag rpg-tag-substitute">Substitute' + (isDoubleBattle ? '' : ' (' + String(slot.substitute.hp) + ' HP)') + '</span>' : '',
		slot.yawnCounter ? '<span class="rpg-tag rpg-tag-yawn">Drowsy (' + String(slot.yawnCounter) + ')</span>' : '',
		slot.disabledMove ? '<span class="rpg-tag rpg-tag-disabled">Disabled: ' + slot.disabledMove.moveId + '</span>' : '',
		slot.encoreMove ? '<span class="rpg-tag rpg-tag-encored">Encored: ' + slot.encoreMove.moveId + '</span>' : '',
		slot.tormentActive ? '<span class="rpg-tag rpg-tag-tormented">Tormented</span>' : '',
		slot.focusEnergy ? '<span class="rpg-tag rpg-tag-focus-energy">Focused</span>' : '',
		slot.isIngrained ? '<span class="rpg-tag rpg-tag-ingrained">Ingrained</span>' : '',
		slot.hasAquaRing ? '<span class="rpg-tag rpg-tag-aqua-ring">Aqua Ring</span>' : '',
		slot.magnetRiseTurns && slot.magnetRiseTurns > 0 ? '<span class="rpg-tag rpg-tag-magnet-rise">Levitating (' + String(slot.magnetRiseTurns) + ')</span>' : '',
		slot.telekinesisCounter && slot.telekinesisCounter > 0 ? '<span class="rpg-tag rpg-tag-telekinesis">Telekinesis (' + String(slot.telekinesisCounter) + ')</span>' : '',
		slot.isSmackedDown ? '<span class="rpg-tag rpg-tag-grounded">Grounded</span>' : '',
		slot.embargoTurns && slot.embargoTurns > 0 ? '<span class="rpg-tag rpg-tag-embargo">Embargo (' + String(slot.embargoTurns) + ')</span>' : '',
		slot.healBlockTurns && slot.healBlockTurns > 0 ? '<span class="rpg-tag rpg-tag-heal-block">Heal Block (' + String(slot.healBlockTurns) + ')</span>' : '',
		slot.isCharged ? '<span class="rpg-tag rpg-tag-charged">Charged</span>' : '',
		slot.stockpileCount && slot.stockpileCount > 0 ? '<span class="rpg-tag rpg-tag-stockpile">Stockpile ×' + String(slot.stockpileCount) + '</span>' : '',
		slot.lockedMoveCounter && slot.lockedMoveCounter > 0 ? '<span class="rpg-tag rpg-tag-rampage">Rampage' + (isDoubleBattle ? '' : ': ' + (slot.lockedMove || '') + ' (' + String(slot.lockedMoveCounter) + ')') + '</span>' : '',
		slot.uproarTurns && slot.uproarTurns > 0 ? '<span class="rpg-tag rpg-tag-uproar">Uproar (' + String(slot.uproarTurns) + ')</span>' : '',
		slot.lockedMove && slot.lockedMoveCounter === 0 && slot.uproarTurns === 0 ? '<span class="rpg-tag rpg-tag-locked">Locked' + (isDoubleBattle ? '' : ': ' + slot.lockedMove) + '</span>' : '',
		slot.mustRecharge ? '<span class="rpg-tag rpg-tag-must-recharge">Must Recharge</span>' : '',
		slot.isProtected ? '<span class="rpg-tag rpg-tag-protected">Protected</span>' : '',
		slot.isRedirecting ? '<span class="rpg-tag rpg-tag-attention">Center of Attention</span>' : '',
		slot.isHelped ? '<span class="rpg-tag rpg-tag-helped">Helped</span>' : '',
		slot.terastallized ? '<span class="rpg-tag rpg-tag-tera">⭐ Tera: ' + slot.terastallized + '</span>' : '',
	].filter(Boolean).join('');

	const abilityTags = [
		slot.flashFireBoost ? '<span class="rpg-tag rpg-tag-flash-fire">Fire Boost</span>' : '',
		slot.analyticBoost ? '<span class="rpg-tag rpg-tag-analytic">Analytic</span>' : '',
		slot.slowStartTurns !== undefined && slot.slowStartTurns > 0 ? '<span class="rpg-tag rpg-tag-slow-start">Slow Start (' + String(slot.slowStartTurns) + ')</span>' : '',
		slot.unburdenActive ? '<span class="rpg-tag rpg-tag-unburden">Unburden</span>' : '',
	].filter(Boolean).join('');

	let chargingTag = '';
	if (slot.chargingMove) {
		const moveName = getMove(slot.chargingMove).name || 'Attack';
		let chargeText = 'Preparing ' + moveName + '!';
		if (slot.chargingMove === 'fly') chargeText = 'Flew up high!';
		if (slot.chargingMove === 'dig') chargeText = 'Dug underground!';
		if (slot.chargingMove === 'dive') chargeText = 'Hid underwater!';
		chargingTag = '<span class="rpg-tag rpg-tag-charging">' + chargeText + '</span>';
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

	let battleConditionTags = '';
	if (battle) {
		const isPlayerSide = battle.playerSlots.some(s => s?.pokemon.id === pokemon.id);
		const sideEffectTags = generateSideEffectTags(battle, isPlayerSide ? 'player' : 'opponent');
		battleConditionTags = [sideEffectTags].filter(Boolean).join('');
	}

	return [statusTag, volatileTags, abilityTags, chargingTag, statStageTags, battleConditionTags].filter(Boolean).join('');
}

function generateBattleActionButtonsHTML(
	battle: BattleState,
	playerSlot: ActivePokemonSlot | null
): string {
	const bottomButtonStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle;';
	const bottomButtonDisabledStyle = 'width: 155px; height: 20px; padding: 2px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 4px 2px; font-size: 0.8em; vertical-align: middle; opacity: 0.6; cursor: not-allowed;';

	const switchButton = '<button name="send" value="/rpg battleaction switchmenu" class="button" style="' + bottomButtonStyle + '">🔄 Switch</button>';

	
	if (battle.battleType === 'battletower') {
		return '<p style="margin-top: 5px; text-align: center;">' + switchButton + '</p>';
	}

	
	const isWild = battle.battleType === 'wild' || battle.battleType === 'wild_double';
	let catchButton = '<button class="button" disabled style="' + bottomButtonDisabledStyle + '">⚽ Catch</button>';
	let runButton = '<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';

	if (isWild) {
		
		const canRun = !playerSlot || !playerSlot.isTrapped;
		runButton = canRun ?
			'<button name="send" value="/rpg battleaction run" class="button" style="' + bottomButtonStyle + '">🏃 Run</button>' :
			'<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';

		
		if (battle.battleType === 'wild') {
			catchButton = '<button name="send" value="/rpg battleaction catchmenu" class="button" style="' + bottomButtonStyle + '">⚽ Catch</button>';
		} else if (battle.battleType === 'wild_double') {
			const activeOpponents = getActiveSlots(battle.opponentSlots);
			const canCatch = activeOpponents.length === 1;
			catchButton = canCatch ?
				'<button name="send" value="/rpg battleaction catchmenu" class="button" style="' + bottomButtonStyle + '">⚽ Catch</button>' :
				'<button class="button" disabled style="' + bottomButtonDisabledStyle + '" title="Can only catch when one opponent remains">⚽ Catch</button>';
		}
	} else if (battle.battleType === 'trainer') {
		
		runButton = '<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';
	} else if (battle.battleType === 'trainer_double') {
		
		runButton = '<button class="button" disabled style="' + bottomButtonDisabledStyle + '">🏃 Run</button>';
	}


	return '<p style="margin-top: 5px; text-align: center;">' + switchButton + catchButton + runButton + '</p>';
}

// ###################################
// S Y S T E M   &   M A I N   M E N U
// ###################################

export function generateWelcomeHTML(): string {
	return `<div class="infobox">` +
		`<h2><center><b>Developer's Note</b></center></h2>` +
		`<p>Welcome to the <strong>Impulse RPG System</strong>!</p>` +
		`<p>This is a <strong>text-based adventure</strong>, where your journey will unfold through descriptions and commands. We're building an immersive Pokémon-style world, and your imagination is a key part of the experience.</p>` +
		`<p><strong>You are joining us during an active testing phase.</strong></p>` +
		`<p>This means you get a sneak peek, but it also means the game is still a work-in-progress. As you explore, you might encounter:</p>` +
		`<ul>` +
		`<li>Bugs, typos, or unexpected command responses.</li>` +
		`<li>Unfinished story sections, features, or placeholder text.</li>` +
		`<li>Potential server resets or updates that may clear your progress as we fix major issues.</li>` +
		`</ul>` +
		`<p>Your feedback is incredibly valuable and will help us fix, polish, and build the best game possible. Thank you for being a part of this early journey!</p>` +
		`<p style="text-align: center; margin-top: 20px;">` +
		`<button name="send" value="/rpg modes" class="button" style="width: 200px; height: 40px; font-size: 1.1em;">View Modes</button>` +
		`</p>` +
		`</div>`;
}

export function generateModeSelectionHTML(): string {
	let html = `<div class="infobox"><h2>Select a Mode</h2>`;
	html += `<p><button name="send" value="/rpg storymode" class="button" style="width: 200px;">📖 Story Mode</button></p>`;
	html += `<p><button name="send" value="/rpg battletower start" class="button" style="width: 200px;">🗼 Battle Tower</button></p>`;
	html += `</div>`;
	return html;
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
	const startingLocation = getStartingLocation();
	const location = LOCATIONS[startingLocation.id];

	let labBuildingId = '';

	
	if (location?.buildings) {
		for (const building of location.buildings) {
			if (building.type === 'lab') {
				labBuildingId = building.id;
				break;
			}
		}
	}

	let labButtonHTML = '';
	if (labBuildingId) {
		labButtonHTML = `<p><button name="send" value="/rpg building ${labBuildingId}" class="button">🔬 Enter the Lab</button></p>`;
	}

	return `<div class="infobox">` +
		`<p><em>To get your first Pokémon partner, head to the lab and talk to the Professor!</em></p>` +
		`<hr />` +
		labButtonHTML +
		`<p><button name="send" value="/rpg explore" class="button">🗺️ Explore ${startingLocation.name}</button></p>` +
		`</div>`;
}

// ###################################
// M A I N   M E N U   S C R E E N S
// ###################################

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

	
	
	exploreButtons += `<button name="send" value="/rpg challenge gym_brock" class="button">🔥 Challenge Brock</button>`;
	

	const exploreHTML = `<div class="infobox">` +
		`<h2>Explore ${player.location}</h2>` +
		`<p>Choose where to go:</p>` +
		`<p>${exploreButtons}</p>` +
		`<hr />` +
		`<p>` +
		`<button name="send" value="/rpg shop" class="button">🏪 Poké Mart</button>` +
		`</p>` +
		generateBottomNavigation() +
		`</div>`;
	return exploreHTML;
}

export function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="infobox">`;
	html += `<h2>Inventory</h2>`;
	html += `<p><strong>Money:</strong> ₽${player.money}</p>`;

	
	html += generateItemCategoryFilters('/rpg items');

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">`;

	let itemsFound = false;
	for (const [itemId, item] of player.inventory) {
		if (!category || item.category === category || category === '') {
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

// ###################################
// S H O P   U I
// ###################################

export function generateShopHTML(player: PlayerData, category?: string): string {
	const locationId = toID(player.location);
	const shopInventory = getShopInventory(locationId, player.badges);
	const nextTier = getNextShopTier(locationId, player.badges);

	let html = `<div class="infobox">`;
	html += `<h2>Poké Mart - ${player.location}</h2>`;
	html += `<p>Welcome! What would you like to do?</p>`;
	html += `<p><strong>Your Money:</strong> ₽${player.money} | <strong>Badges:</strong> ${player.badges}/${TOTAL_BADGES}</p>`;

	
	if (nextTier) {
		html += `<p style="color: #666; font-size: 12px;">🔒 ${nextTier.itemCount} more items will unlock with ${nextTier.requiredBadges} badge${nextTier.requiredBadges === 1 ? '' : 's'}</p>`;
	}

	
	html += `<p><button name="send" value="/rpg sell" class="button" style="background-color: #28a745; color: white;">Sell Items</button></p>`;

	
	html += `<h3>Buy Items</h3>`;
	html += generateItemCategoryFilters('/rpg shop');

	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;

	let itemsFound = false;
	for (const itemId of shopInventory) {
		const item = ITEMS_DATABASE[itemId];
		const price = ITEM_PRICES[itemId];
		if (!item || !price) continue;

		if (!category || item.category === category || category === '') {
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

export function generateSellMenuHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Sell Items</h2><p>Select an item to sell:</p><p><strong>Your Money:</strong> ₽${player.money}</p>`;
	html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">`;
	let sellableItems = 0;
	for (const [id, item] of player.inventory) {
		const purchasePrice = ITEM_PRICES[id];
		if (purchasePrice && item.category === 'misc') { 
			
			const sellPrice = Math.floor(purchasePrice / 2);
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

export function generatePurchaseCompleteHTML(itemName: string, quantity: number, totalCost: number, remainingMoney: number): string {
	return `<div class="infobox"><h2>Purchase Complete!</h2><p>You bought <strong>${quantity}x ${itemName}</strong> for ₽${totalCost}!</p><p><strong>Money remaining:</strong> ₽${remainingMoney}</p><p><button name="send" value="/rpg shop" class="button">Continue Shopping</button> <button name="send" value="/rpg items" class="button">View Inventory</button></p>${generateBottomNavigation()}</div>`;
}

export function generateSellCompleteHTML(itemName: string, quantity: number, totalGain: number, remainingMoney: number): string {
	return `<div class="infobox"><h2>Item Sold!</h2><p>You sold <strong>${quantity}x ${itemName}</strong> for ₽${totalGain}!</p><p><strong>Money remaining:</strong> ₽${remainingMoney}</p><p><button name="send" value="/rpg sell" class="button">Sell More</button><button name="send" value="/rpg shop" class="button">Back to Shop</button></p></div>`;
}

// ###################################
// B A T T L E   U I   -   M A I N
// ###################################

/**
 * [MODIFIED] Generates the main battle HTML, now unified.
 * This is the new implementation for Suggestion #4.
 * It also includes Suggestion #3 (Hierarchy) by separating messageLog and battleLog.
 */
export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean },
	teraToggled?: boolean
): string {

	// --- 1. Handle Battle End ---
	// Get battle log *before* checking end condition
	// [SUGGESTION #3] Separate new messages from old log
	const newEventsHTML = messageLog.length > 0 ?
		`<div style="padding: 8px; margin: 5px 0; border: 2px solid #007bff; border-radius: 5px;">${messageLog.join('<br>')}</div>` :
		'';
	
	const reversedBattleLog = [...battle.battleLog].reverse();
	const historyLogHTML = `<div style="padding: 8px; margin: 5px 0; border: 1px solid #666; min-height: 50px; max-height: 150px; overflow-y: auto; border-radius: 5px;">` +
		(reversedBattleLog.length > 0 ? reversedBattleLog.join('<br>') : 'Battle started...') +
		`</div>`;

	if (battle.battleEnded) {
		let actionHTML = '';
		// Battle Tower end screens are handled by dedicated functions (FloorComplete/Loss)
		// So we do NOT show a "Continue" button for it.
		if (battle.battleType !== 'battletower') {
			const continueCommand = (battle.battleResult === 'victory') ? '/rpg explore' : '/rpg explore';
			actionHTML = '<p style="margin-top: 15px; text-align: center;">' +
				'<button name="send" value="' + continueCommand + '" class="button" style="width: 200px; height: 40px; font-size: 1.2em; font-weight: bold;">Continue</button>' +
				'</p>';
		}

		return '<div class="infobox">' +
			generateBattleHeader(battle) + // Show header even on end screen
			newEventsHTML + // Show final messages
			historyLogHTML + // Show full log
			actionHTML +
			'</div>';
	}

	// --- 2. Render Active Battle ---
	
	// [NEW] Call the new helper components
	const headerHTML = generateBattleHeader(battle);
	const globalConditionsHTML = generateGlobalBattleConditionsHTML(battle);
	const battlefieldHTML = generateBattlefield(battle, targetSelection);

	// [NEW] Determine which action panel to show
	let actionPanelHTML = '';
	if (targetSelection && battle.battleType.includes('double')) {
		// We are in target selection mode
		actionPanelHTML = generateBattleTargetSelection(battle, targetSelection);
	} else {
		// We are in move selection mode
		actionPanelHTML = generateBattleActionPanel(battle, teraToggled);
	}

	// [NEW] Assemble the full UI
	return '<div class="infobox">' +
		headerHTML +
		globalConditionsHTML +
		battlefieldHTML +
		newEventsHTML + // Show new messages
		historyLogHTML + // Show old log
		actionPanelHTML +
		'</div>';
}

// ###################################
// B A T T L E   U I   -   S C R E E N S
// ###################################

export function generateSwitchMenuHTML(battle: BattleState, target?: string): string {
	let html = `<div class="infobox"><h2>Choose a Pokémon to switch</h2>`;
	const player = getPlayerData(battle.playerId);
	const [pSlot0, pSlot1] = battle.playerSlots;

	
	let slotToSwitchOut: number;

	if (target !== undefined && target !== '') {
		
		slotToSwitchOut = parseInt(target);
	} else {
		
		
		
		const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double' || battle.battleType === 'battletower'; 

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

	
	const outgoingPokemon = battle.playerSlots[slotToSwitchOut]?.pokemon;
	if (!outgoingPokemon) {
		return `<div class="infobox"><h2>Error: Invalid slot.</h2><p><button name="send" value="/rpg battleaction back" class="button">Back</button></p></div>`;
	}

	html += `<p>Select a Pokémon to replace <strong>${outgoingPokemon.species}</strong>:</p>`;

	
	const commandPrefix = `/rpg battleaction playerswitch ${slotToSwitchOut}`;
	html += generateAvailablePokemonListHTML(battle, player, commandPrefix);

	html += `<hr /><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
	return html;
}

export function generateFaintSwitchHTML(battle: BattleState, message: string): string {
	let html = `<div class="infobox"><h2>A Pokémon fainted!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);

	
	const isDoubleBattle = battle.battleType === 'wild_double' || battle.battleType === 'trainer_double';

	let slotToFill = -1;
	
	if (battle.playerSlots[0] === null || (battle.playerSlots[0] && battle.playerSlots[0].pokemon.hp <= 0)) {
		slotToFill = 0;
	} else if (isDoubleBattle && (battle.playerSlots[1] === null ||
		(battle.playerSlots[1] && battle.playerSlots[1].pokemon.hp <= 0))) {
		
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
	let html = `<div class="infobox"><h2>A Pokémon is switching out!</h2><p>${message}</p>`;
	const player = getPlayerData(battle.playerId);
	const pivotingPokemon = battle.pendingPivot?.slot.pokemon;

	html += `<p>Choose a Pokémon to replace <strong>${pivotingPokemon?.species || 'your Pokémon'}</strong> in <strong>Slot ${pivotSlotIndex + 1}</strong>:</p>`;

	
	
	const commandPrefix = `/rpg battleaction forceswitch ${pivotSlotIndex}`;
	const filter = (p: RPGPokemon) => p.id !== pivotingPokemon?.id;
	html += generateAvailablePokemonListHTML(battle, player, commandPrefix, filter);
	

	if (!battle.overridePlayerParty && player.party.filter(p => p.hp > 0 && p.id !== pivotingPokemon?.id && !battle.playerSlots.some(s => s?.pokemon.id === p.id)).length === 0) {
		html += `<p><button name="send" value="/rpg battleaction forceswitch ${pivotSlotIndex} cancel" class="button">Continue</button></p>`;
	}

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
	const activeOpponents = getActiveSlots(battle.opponentSlots);

	if (pokeBalls.length === 0) {
		html += `<p>You have no Poke Balls!</p>`;
	} else {
		html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
		for (const ball of pokeBalls) {
			
			let command = '';
			if (isDoubleBattle && activeOpponents.length > 1) {
				
				command = `/rpg battleaction selectcatchtarget ${ball.id}`;
			} else if (isDoubleBattle && activeOpponents.length === 1) {
				
				const targetSlot = battle.opponentSlots.indexOf(activeOpponents[0]) + 2;
				command = `/rpg battleaction catch ${ball.id} ${targetSlot}`;
			} else {
				
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

	
	let hasTargets = false;
	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (!slot || slot.pokemon.hp <= 0) continue;

		hasTargets = true;
		const slotIndex = i + 2; 
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

// ###################################
// B A T T L E   R E S U L T S
// ###################################

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

export function generateCatchSuccessHTML(
	caughtPokemon: RPGPokemon,
	tempSlot: ActivePokemonSlot,
	location: string,
	zoneId: string,
	wasHealed: boolean
): string {
	let successMessage = `<h2>Gotcha!</h2><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
	if (wasHealed) successMessage += `<p>${caughtPokemon.species} was fully healed!</p>`;

	return `<div class="infobox">` + `${successMessage}` +
		`${generatePokemonInfoHTML(tempSlot, true)}` +
		`<p>${caughtPokemon.species} has been sent to ${location}.</p>` +
		`<p><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button> ` +
		`<button name="send" value="/rpg explore" class="button">Continue Exploring</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateMultipleOpponentsCatchErrorHTML(): string {
	return `<div class="infobox"><h2>Cannot Catch</h2><p>You can't throw a Poké Ball when there are multiple wild Pokémon!</p><p>Defeat one first, then you can catch the remaining one.</p><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
}

// ###################################
// B A T T L E   U I   -   H E L P E R S
// ###################################

function getDisplayLog(battle: BattleState, messageLog: string[] = []): string {
	const reversedBattleLog = [...battle.battleLog].reverse();
	const allLogs = [...messageLog, ...reversedBattleLog];
	return allLogs.length > 0 ? allLogs.join('<br>') : 'Battle started...';
}

function generateBattleMoveSelectionHTML(
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
		const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left;';
		const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">Struggle</div>' +
			'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
			'<span>Normal</span>' +
			'<span style="float: right;">-- / --</span>' +
			'</div> ';

		
		const struggleCommand = isDoubleBattle ?
			`/rpg battleaction selecttarget ${slotIndex} struggle` :
			`/rpg battleaction move ${slotIndex} struggle 2`; 

		moveButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += `<td style="padding: 0; vertical-align: top;"><button name="send" value="${struggleCommand}" class="button" style="${buttonStyle}">${buttonContent}</button></td>`;
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '<tr>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '<td style="padding: 0; vertical-align: top;"></td>';
		moveButtonsHTML += '</tr>';
		moveButtonsHTML += '</table>';
	} else {
		
		const canTerastallize = !battle.playerTerastallizeUsed && !slot.terastallized;
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

			const buttonStyle = 'width: 155px; height: 40px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: left;' + (teraActive ? ' border: 2px solid #FF1493;' : '');
			const buttonContent = '<div style="text-align: center; font-weight: bold; font-size: 1em; margin-bottom: 2px;">' + (teraActive ? '⭐ ' : '') + moveData.name + '</div>' +
				'<div style="font-size: 0.8em; opacity: 0.9; overflow: hidden;">' +
				'<span>' + moveData.type + '</span>' +
				'<span style="float: right;">' + String(move.pp) + ' / ' + String(moveData.pp) + '</span>' +
				'</div> ';

			const teraParam = teraActive ? ' terastallize' : '';
			
			const moveCommand = isDoubleBattle ?
				`/rpg battleaction selecttarget ${slotIndex} ${move.id}${teraParam}` :
				`/rpg battleaction move ${slotIndex} ${move.id} 2${teraParam}`; 

			return `<button name="send" value="${moveCommand}" class="button" ${isDisabled ? 'disabled' : ''} style="${buttonStyle}"> ${buttonContent}</button>`;
		});

		
		let teraToggleHTML = '';
		if (canTerastallize) {
			const teraToggleStyle = 'width: 155px; height: 30px; padding: 4px; border-radius: 8px; box-sizing: border-box; text-align: center; font-weight: bold; margin: 0 auto 10px auto; font-size: 0.9em; ' + (teraActive ? 'background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%); color: white;' : 'border: 2px solid #FF1493; color: #FF1493; background: white;');
			const teraToggleText = teraActive ? '⭐ Terastallize: ON' : 'Terastallize: OFF';
			const teraToggleCommand = teraActive ? '/rpg battleaction teratoggle off' : '/rpg battleaction teratoggle on';
			teraToggleHTML = '<div style="text-align: center; margin-bottom: 10px;"><button name="send" value="' + teraToggleCommand + '" class="button" style="' + teraToggleStyle + '">' + teraToggleText + '</button></div>';
		}

		moveButtonsHTML = teraToggleHTML + '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;">';
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

	return moveButtonsHTML;
}

function generateAvailablePokemonListHTML(
	battle: BattleState,
	player: PlayerData,
	commandPrefix: string,
	additionalFilter?: (pokemon: RPGPokemon) => boolean
): string {
	let html = '';
	const partyToUse = battle.overridePlayerParty || player.party;

	let availableParty = partyToUse.filter(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (additionalFilter) {
		availableParty = availableParty.filter(additionalFilter);
	}

	if (availableParty.length === 0) {
		html += `<p>You have no other Pokémon to switch to!</p>`;
	} else {
		for (const pokemon of availableParty) {
			html += `<div style="border: 1px solid #ccc; padding: 8px; margin: 5px 0; border-radius: 5px; overflow: hidden;">` +
				`<strong>${pokemon.species}</strong> (Lvl ${pokemon.level}) | HP: ${pokemon.hp}/${pokemon.maxHp}` +
				`<button name="send" value="${commandPrefix} ${pokemon.id}" class="button" style="float: right;">Switch In</button>` +
				`</div>`;
		}
	}
	return html;
}

/**
 * [MODIFIED] Generates the HTML for a single Pokemon in battle.
 * Now includes Suggestion #3 (Hierarchy): HP/Status is moved to the top.
 */
export function generateSharedBattlePokemonInfo(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	isDoubleBattle: boolean,
	ownerName?: string,
	battle?: BattleState
): string {
	const pokemon = slot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'yellow' : 'red';

	// [SUGGESTION #3] Generate status tags first
	const allStatusTags = generatePokemonStatusTagsHTML(slot, isDoubleBattle, battle);
	const statusDisplay = allStatusTags || '&nbsp;';

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	const namePrefix = ownerName ? ownerName + "'s " : '';

	const hpBarHTML =
		'<div style="max-width: 120px; height: 12px; background: #f0f0f0; border: 1px solid #aaa; border-radius: 8px; position: relative; margin-top: 4px; margin-left: auto; margin-right: auto;">' +
		'<div style="background: ' + hpBarColor + '; width: ' + String(hpPercentage) + '%; height: 100%; border-radius: 7px;"></div>' +
		'<span style="position: absolute; right: 0; top: 0; background: #b0b0b0; color: #fff; font-size: 9px; font-weight: bold; padding: 0 5px; line-height: 12px; height: 100%; border-radius: 0 7px 7px 0;">' +
		String(hpPercentage) + '%' +
		'</span>' +
		'</div>';

	if (isDoubleBattle) {
		let html = '';
        // [SUGGESTION #3] HP bar and status moved to the top
		html += hpBarHTML;
		html += '<div style="margin-top: 5px; font-size: 10px; line-height: 1.4; min-height: 1.4em;">' + statusDisplay + '</div>'; // Added min-height
        // Name/Level below
		html += '<div style="font-weight: bold; font-size: 1.1em; margin-top: 4px;">';
		html += '<psicon pokemon="' + species.id + '" style="vertical-align: -5px;"></psicon> ';
		html += namePrefix + (pokemon.nickname || pokemon.species) + ' ' + genderSymbol + shinySymbol + ' L' + String(pokemon.level);
		html += '</div>';
		return html;
	} else {
		const spriteFilename = getSpriteFilename(species.id);

		const spriteDir = pokemon.shiny ? 'gen5-shiny' : 'gen5';
		const spriteHTML =
			'<div style="text-align: center; margin-top: 4px;">' +
			'<img src="https://play.pokemonshowdown.com/sprites/' + spriteDir + '/' + spriteFilename + '.png" width="64" height="64" />' +
			'</div>';

		let html = '<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;">';
        // [SUGGESTION #3] HP bar and status moved to the top
		html += hpBarHTML;
		html += '<div style="margin-top: 5px; font-size: 10px; line-height: 1.4; min-height: 1.4em;">' + statusDisplay + '</div>'; // Added min-height
        // Name/Level below
		html += '<div style="font-weight: bold; font-size: 1.1em; margin-top: 4px;">';
		html += namePrefix + (pokemon.nickname || pokemon.species) + ' ' + genderSymbol + shinySymbol + ' L' + String(pokemon.level);
		html += '</div>';
		html += spriteHTML;
		html += '</div>';
		return html;
	}
}

function generateGlobalBattleConditionsHTML(battle: BattleState): string {
	const weatherTags = generateWeatherTags(battle);
	const terrainTags = generateTerrainTags(battle);
	const fieldEffectTags = generateFieldEffectTags(battle);

	const allTags = [weatherTags, terrainTags, fieldEffectTags].filter(Boolean).join('');

	if (allTags) {
		
		return `<br><div style="text-align: center;">` +
			allTags +
			`</div>`;
	}

	return ''; 
}

function generateSideEffectTags(battle: BattleState, side: 'player' | 'opponent'): string {
	const effects: string[] = [];
	const reflectTurns = (side === 'player') ? battle.playerReflectTurns : battle.opponentReflectTurns;
	const lightScreenTurns = (side === 'player') ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
	const auroraVeilTurns = (side ==='player') ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
	const hazards = (side === 'player') ? battle.playerHazards : battle.opponentHazards;
	const quickGuard = (side === 'player') ? battle.playerQuickGuard : battle.opponentQuickGuard;
	const wideGuard = (side === 'player') ? battle.playerWideGuard : battle.opponentWideGuard;
	const craftyShield = (side === 'player') ? battle.playerCraftyShield : battle.opponentCraftyShield;

	
	const tagStyle = 'font-size: 10px; padding: 1px 4px; border-radius: 3px; margin-left: 5px; vertical-align: middle;';

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

	return effects.join('');
}

function generateWeatherTags(battle: BattleState): string {
	if (!battle.weather) return '';

	const weatherNames: Record<string, string> = {
		'sun': 'Sun',
		'rain': 'Rain',
		'sand': 'Sandstorm',
		'hail': 'Hail',
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


function generateTerrainTags(battle: BattleState): string {
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


function generateFieldEffectTags(battle: BattleState): string {
	const effects: string[] = [];

	const tagClass = 'rpg-field-effect-tag';

	if (battle.trickRoomTurns > 0) {
		effects.push(`<span class="${tagClass}">Trick Room (${battle.trickRoomTurns})</span>`);
	}
	if (battle.magicRoomTurns > 0) {
		effects.push(`<span class="${tagClass}">Magic Room (${battle.magicRoomTurns})</span>`);
	}
	if (battle.wonderRoomTurns > 0) {
		effects.push(`<span class="${tagClass}">Wonder Room (${battle.wonderRoomTurns})</span>`);
	}
	if (battle.gravityTurns > 0) {
		effects.push(`<span class="${tagClass}">Gravity (${battle.gravityTurns})</span>`);
	}
	if (battle.mudSportTurns > 0) {
		effects.push(`<span class="${tagClass}">Mud Sport (${battle.mudSportTurns})</span>`);
	}
	if (battle.waterSportTurns > 0) {
		effects.push(`<span class="${tagClass}">Water Sport (${battle.waterSportTurns})</span>`);
	}
	if (battle.fairyLockTurns > 0) {
		effects.push(`<span class="${tagClass}">Fairy Lock (${battle.fairyLockTurns})</span>`);
	}
	if (battle.ionDelugeTurns > 0) {
		effects.push(`<span class="${tagClass}">Ion Deluge (${battle.ionDelugeTurns})</span>`);
	}

	return effects.join('');
}

// ###################################
// B A T T L E   T O W E R   U I
// ###################################

export function generateBattleTowerWelcomeHTML(floor: number): string {
	let html = `<div class="infobox"><h2>🗼 Welcome to the Battle Tower</h2>`;
	html += `<p>Challenge the Battle Tower with different random formats!</p>`;
	html += `<p>Your goal is to climb as high as you can, floor by floor. Your team will be re-rolled on every floor.</p>`;
	html += `<hr />`;

	
	html += `<h3>Random Formats:</h3>`;
	for (const [formatId, config] of Object.entries(BATTLE_TOWER_FORMATS)) {
		html += `<p><button name="send" value="/rpg battletower selectformat ${formatId}" class="button" style="width: 200px;">🎲 ${config.name}</button></p>`;
		html += `<p style="font-size: 0.9em; margin-top: 5px;"><em>${config.description}</em></p>`;
	}

	html += `<p><button name="send" value="/rpg modes" class="button">Back to Modes</button></p>`;
	html += `</div>`;
	return html;
}

export function generateBattleTowerFormatSelectedHTML(floor: number, format: string): string {
	
	const formatConfig = BATTLE_TOWER_FORMATS[format] || BATTLE_TOWER_FORMATS['battlefactory'];
	const formatName = formatConfig.name;

	let html = `<div class="infobox"><h2>🗼 Battle Tower - ${formatName}</h2>`;
	html += `<p>You will be assigned a random team of ${formatConfig.teamSize} Pokémon, all at Level ${formatConfig.level}.</p>`;
	html += `<p>Your goal is to climb as high as you can, floor by floor. Your team will be re-rolled on every floor.</p>`;
	html += `<p>Good luck!</p><hr />`;
	if (floor > 1) {
		html += `<p>Your current streak is <strong>Floor ${floor}</strong>.</p>`;
		html += `<p><button name="send" value="/rpg battletower beginfloor ${format}" class="button">Begin Floor ${floor}</button></p>`;
	} else {
		html += `<p>You are starting on <strong>Floor 1</strong>.</p>`;
		html += `<p><button name="send" value="/rpg battletower beginfloor ${format}" class="button">Begin!</button></p>`;
	}
	html += `<p><button name="send" value="/rpg battletower start" class="button">Back to Format Selection</button></p>`;
	html += `</div>`;
	return html;
}

export function generateBattleTowerFloorCompleteHTML(floor: number): string {
	let html = `<center><div class="infobox"><h2>🗼 Floor ${floor} Cleared!</h2>`;
	html += `<p>You defeated the trainer! Your team has been healed.</p>`;
	html += `<p>Your new random team is being prepared for the next floor.</p><hr />`;
	html += `<p><button name="send" value="/rpg battletower nextfloor" class="button" style="width: 200px;">Continue to Floor ${floor + 1}</button></p>`;
	html += `</div></center>`;
	return html;
}

export function generateBattleTowerLossHTML(floor: number): string {
	let html = `<center><div class="infobox"><h2>🗼 Battle Lost on Floor ${floor}</h2>`;
	html += `<p>You were defeated. Your Battle Tower streak has ended.</p>`;
	html += `<p><strong>Final Floor: ${floor}</strong></p><hr />`;
	html += `<p><button name="send" value="/rpg battletower start" class="button" style="width: 200px;">Try Again (from Floor 1)</button></p>`;
	html += `<p><button name="send" value="/rpg modes" class="button" style="width: 200px;">Exit Battle Tower</button></p>`;
	html += `</div></center>`;
	return html;
}

// ###################################
// P O K E M O N   M A N A G E M E N T
// ###################################

export function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	showActions = false,
	slotInfo?: { index: number, partyLength: number }
): string {
	const pokemon = slot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpBarColor = hpPercentage > 50 ? 'green' : hpPercentage > 25 ? 'yellow' : 'red';

	let expBarHTML = '';
	if (isPlayerSide) {
		const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
		const expForNextLevel = pokemon.expToNextLevel;
		const expProgress = pokemon.experience - expForLastLevel;
		const expNeededForLevel = expForNextLevel - expForLastLevel;
		const expPercentage = calculateExpBarPercentage(expProgress, expNeededForLevel);
		expBarHTML = `<div style="border-radius: 10px; padding: 2px; margin: 5px 0; position: relative;"><div style="background: #6c9be8; width: ${expPercentage}%; height: 10px; border-radius: 8px;"></div><div style="position: absolute; top: 2px; left: 0; right: 0; text-align: center; font-size: 10px; line-height: 10px; color: #000;">EXP: ${expProgress}/${expNeededForLevel}</div></div>`;
	} else {
		
		expBarHTML = `<div style="height: 24px; margin: 5px 0;"></div>`;
	}

	
	const statusTagsHTML = generatePokemonStatusTagsHTML(slot, false);

	const shinySymbol = pokemon.shiny ? '<span style="color: #d4af37;">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span style="color: #007bff;">♂</span>' : pokemon.gender === 'F' ? '<span style="color: #f06292;">♀</span>' : '';

	
	let html = `<div style="border: 1px solid #666; padding: 8px; margin: 5px 0; border-radius: 5px;">`;

	
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

	
	const typeDisplay = slot.terastallized ? `Tera ${slot.terastallized}` : species.types.join('/');

	html += `<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})<br>`;
	html += `<div style="font-size: 10px; line-height: 1.4; margin-top: 4px;">${statusTagsHTML}</div>`;
	html += `<small>Type: ${typeDisplay}</small><br><div style="border-radius: 10px; padding: 2px; margin: 5px 0; position: relative;"><div style="background: ${hpBarColor}; width: ${hpPercentage}%; height: 10px; border-radius: 8px;"></div><div style="position: absolute; top: 2px; left: 0; right: 0; text-align: center; font-size: 10px; line-height: 10px; color: #000;">HP: ${pokemon.hp}/${pokemon.maxHp}</div></div>`;

	
	html += expBarHTML;

	if (isPlayerSide) {
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

export function generateSummarySelectionHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Select a Pokémon</h2><p>Choose a Pokémon to view its summary:</p>`;
	if (player.party.length === 0) {
		html += '<p>You have no Pokémon.</p>';
	} else {
		player.party.forEach(p => {
			html += `<button name="send" value="/rpg summary ${p.id}" class="button" style="margin: 3px;">${p.species}</button> `;
		});
	}
	html += `<hr /><p><button name="send" value="/rpg party" class="button">← Back to Party</button></p></div>`;
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

export function generateMoveLearnHTML(player: PlayerData, additionalMessages?: string[]): string {
	const queueArray = player.pendingMoveLearnQueue;
	if (!queueArray || queueArray.length === 0) return `<h2>Error: No pending moves found.</h2>`;
	const queue = queueArray[0]; 
	if (!queue || queue.moveIds.length === 0) {
		player.pendingMoveLearnQueue?.shift(); 
		return `<h2>Error: No pending moves found.</h2>`;
	}
	const pokemon = player.party.find(p => p.id === queue.pokemonId);
	const newMove = getMove(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		player.pendingMoveLearnQueue?.shift(); 
		return `<h2>Error: Invalid Pokemon or move data.</h2>` + generateBottomNavigation();
	}
	let html = `<div class="infobox">`;

	
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

export function generateNicknameChangedHTML(
	oldNickname: string,
	pokemon: RPGPokemon,
	tempSlot: ActivePokemonSlot
): string {
	const infoHTML = generatePokemonInfoHTML(tempSlot, true, true);
	return `<div class="infobox"><h2>Nickname Changed!</h2><p>Changed <strong>${oldNickname}</strong>'s name to <strong>${pokemon.nickname}</strong>!</p>${infoHTML}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
}

export function generateDepositPCHTML(pokemonSpecies: string): string {
	return `<div class="infobox"><h2>Pokemon Deposited</h2><p><strong>${pokemonSpecies}</strong> has been deposited into the PC!</p><p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
}

export function generateWithdrawPCHTML(pokemonSpecies: string, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Pokemon Withdrawn</h2><p><strong>${pokemonSpecies}</strong> has been withdrawn from the PC!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg pc" class="button">View PC</button><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
}

// ###################################
// I T E M   &   P O K E M O N   U I
// ###################################

export function generateMedicinePokemonSelectionHTML(player: PlayerData, itemId: string, itemName: string): string {
	let html = `<div class="infobox"><h2>Use ${itemName}</h2><p>Select a Pokemon to use this item on:</p>`;

	
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
	return html;
}

export function generateMiscItemPokemonSelectionHTML(player: PlayerData, itemId: string, itemName: string): string {
	let html = `<div class="infobox"><h2>Use ${itemName}</h2><p>Select a Pokémon to use this item on:</p>`;
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
	return html;
}

export function generateGiveItemSelectionHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Give Item</h2><p>Select a Pokémon to give an item to:</p>`;
	for (const pokemon of player.party) {
		html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg giveitem ${pokemon.id}" class="button">${pokemon.species}</button> (Currently holding: ${pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None'})</div>`;
	}
	html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
	return html;
}

export function generateGiveItemToSpecificPokemonHTML(player: PlayerData, pokemon: RPGPokemon): string {
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

export function generateTakeItemSelectionHTML(player: PlayerData): string {
	let html = `<div class="infobox"><h2>Take Item</h2><p>Select a Pokémon to take its item:</p>`;
	for (const pokemon of player.party) {
		if (pokemon.item) {
			html += `<div style="padding: 5px; margin: 5px 0; border-bottom: 1px solid #eee;"><button name="send" value="/rpg takeitem ${pokemon.id}" class="button">${pokemon.species}</button> (Holding: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item})</div>`;
		}
	}
	html += `<hr /><p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
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

	html += `<hr /><p><button name"send" value="/rpg useitem ${itemId}" class="button">Back to Pokémon</button></p></div>`;
	return html;
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

// ###################################
// I T E M   R E S U L T   U I
// ###################################

export function generateItemUseErrorHTML(message: string, itemId: string): string {
	return `<div class="infobox"><p style="color: red; font-weight: bold;">${message}</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateItemUseResultHTML(message: string, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Item Used!</h2><p>${message}</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateSacredAshResultHTML(message: string): string {
	return `<div class="infobox"><h2>Item Used!</h2><p>${message}</p><p><button name="send" value="/rpg party" class="button">View Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateTeraShardResultHTML(pokemon: RPGPokemon, oldTeraType: string, newTeraType: string, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Tera Type Changed!</h2><p>You used a <strong>Tera Shard</strong> on <strong>${pokemon.species}</strong>!</p><p>Its Tera Type changed from <strong>${oldTeraType}</strong> to <strong>${newTeraType}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateEvolutionStoneErrorHTML(pokemonSpecies: string, itemId: string): string {
	return `<div class="infobox"><p style="color: red; font-weight: bold;">It had no effect... (${pokemonSpecies} is not compatible with this item).</p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generatePPRestoreResultHTML(itemName: string, pokemonSpecies: string, moveName: string, restored: number, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Item Used!</h2><p>You used an <strong>${itemName}</strong> on <strong>${pokemonSpecies}</strong>!</p><p><strong>${moveName}</strong>'s PP was restored by ${restored}.</p>${generatePokemonInfoHTML(tempSlot, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateItemGivenHTML(pokemonSpecies: string, itemName: string, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Item Given</h2><p><strong>${pokemonSpecies}</strong> is now holding the <strong>${itemName}</strong>!</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
}

export function generateItemTakenHTML(itemName: string, pokemonSpecies: string, tempSlot: ActivePokemonSlot): string {
	return `<div class="infobox"><h2>Item Taken</h2><p>You took the <strong>${itemName}</strong> from <strong>${pokemonSpecies}</strong>.</p>${generatePokemonInfoHTML(tempSlot, true, true)}<p><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
}

// ###################################
// N P C   U I
// ###################################

export function generateNPCSelectionHTML(availableNPCs: [string, { name: string }][]): string {
	let html = `<div class="infobox"><h2>Talk to NPCs</h2><p>Who would you like to talk to?</p>`;
	for (const [id, npc] of availableNPCs) {
		html += `<button name="send" value="/rpg npc ${id}" class="button">💬 ${npc.name}</button> `;
	}
	html += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += generateBottomNavigation() + `</div>`;
	return html;
}

export function generateNPCStarterChoiceHTML(npcId: string, npcName: string, allStarters: string[]): string {
	let html = `<div class="infobox">` +
		`<h2>${npcName}</h2>` +
		`<p>"The world of Pokémon is vast and wonderful! Before you begin your journey, you'll need a Pokémon partner."</p>` +
		`<p>"I have three Pokémon here that are perfect for beginning trainers. Choose wisely!"</p>` +
		`<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;

	for (const starterId of allStarters) {
		const command = `/rpg starterchoice ${npcId} ${starterId}`;
		html += generateStarterChoiceBoxHTML(starterId, command);
	}

	html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg npc ${npcId}" class="button">← Back</button></p>` +
		generateBottomNavigation() +
		`</div>`;
	return html;
}

export function generateNPCStarterConfirmHTML(
	npcName: string,
	message: string,
	tempSlot: ActivePokemonSlot,
	speciesName: string
): string {
	return `<div class="infobox">` +
		`<h2>Congratulations!</h2>` +
		`<p><strong>${npcName}:</strong> "${message}"</p>` +
		`${generatePokemonInfoHTML(tempSlot, true)}` +
		`<p>"Your adventure begins now. Remember, the bond between a trainer and their Pokémon is special. Take good care of ${speciesName}!"</p>` +
		`<p>"Now, head out and begin your journey. Good luck!"</p>` +
		`<hr />` +
		`<p><button name="send" value="/rpg explore" class="button">Begin Your Adventure</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

// ###################################
// S T O R Y   P R O G R E S S I O N
// ###################################

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
		const command = `/rpg selectstarter ${starterId}`;
		html += generateStarterChoiceBoxHTML(starterId, command);
	}
	html += `</div><p style="margin-top: 15px;"><button name="send" value="/rpg storymode" class="button">← Back to Type Selection</button></p></div>`;
	return html;
}

export function generateStarterConfirmHTML(
	tempSlot: ActivePokemonSlot,
	speciesName: string,
	startingLocationName: string
): string {
	return `<div class="infobox">` +
		`<h2>Congratulations!</h2>` +
		`<p><strong>Professor Oak:</strong> "Excellent choice! <strong>${speciesName}</strong> will be a great partner for you."</p>` +
		`${generatePokemonInfoHTML(tempSlot, true)}` +
		`<p>"Your adventure begins now. Remember, the bond between a trainer and their Pokémon is special. Take good care of ${speciesName}!"</p>` +
		`<p>"Now, head out into ${startingLocationName} and begin your journey. Good luck!"</p>` +
		`<hr />` +
		`<p><button name="send" value="/rpg explore" class="button">Begin Your Adventure</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

// ###################################
// S Y S T E M   &   P R O F I L E
// ###################################

export function generateResetHTML(): string {
	return `<div class="infobox"><h2>RPG Progress Reset</h2><p>All of your RPG progress has been reset!</p><p>Your profile, party, PC storage, inventory, and battle state have all been cleared.</p><p>You can start fresh by typing <code>/rpg start</code>.</p></div>`;
}

export function generateUnstuckHTML(): string {
	return `<div class="infobox"><h2>Battle Exited</h2><p>You have been removed from your battle.</p><p>Your Pokémon's status has been saved, and you can now use other RPG commands again.</p>` +
		generateBottomNavigation() + `</div>`;
}

export function generateDBSaveHTML(player: PlayerData): string {
	return `<div class="infobox">` +
		`<h2>Game Saved to Database!</h2>` +
		`<p>Your game has been successfully saved to the database.</p>` +
		`<p><strong>Trainer:</strong> ${player.name}</p>` +
		`<p><strong>Location:</strong> ${player.location}</p>` +
		`<p><strong>Badges:</strong> ${player.badges}/${TOTAL_BADGES}</p>` +
		`<p><strong>Party:</strong> ${player.party.length} Pokémon</p>` +
		`<p><strong>Money:</strong> ₽${player.money}</p>` +
		`<p><small>You can load your save anytime using the Load from Database button.</small></p>` +
		`<p><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBLoadNoSaveHTML(): string {
	return `<div class="infobox">` +
		`<h2>No Save Found</h2>` +
		`<p>You don't have a saved game in the database yet.</p>` +
		`<p>Use the "Save to Database" button to save your progress first.</p>` +
		`<p><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBLoadConfirmHTML(loadedPlayer: PlayerData): string {
	return `<div class="infobox">` +
		`<h2>Game Loaded from Database!</h2>` +
		`<p>Your saved game has been loaded successfully!</p>` +
		`<p><strong>Location:</strong> ${loadedPlayer.location}</p>` +
		`<p><strong>Badges:</strong> ${loadedPlayer.badges}/${TOTAL_BADGES}</p>` +
		`<p><strong>Party:</strong> ${loadedPlayer.party.length} Pokémon</p>` +
		`<p><strong>Money:</strong> ₽${loadedPlayer.money}</p>` +
		`<p><button name="send" value="/rpg explore" class="button">Continue Adventure</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBDeleteNoSaveHTML(): string {
	return `<div class="infobox">` +
		`<h2>No Save Found</h2>` +
		`<p>You don't have a saved game in the database to delete.</p>` +
		`<p><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBDeleteConfirmHTML(): string {
	return `<div class="infobox">` +
		`<h2>⚠️ Delete Save Confirmation</h2>` +
		`<p><strong>Warning:</strong> This will permanently delete your saved game from the database!</p>` +
		`<p>Your current in-memory progress will NOT be affected, but you won't be able to load this save anymore.</p>` +
		`<p>Are you sure you want to delete your database save?</p>` +
		`<p><button name="send" value="/rpg dbdelete confirm" class="button" style="background-color: #d32f2f; color: white;">⚠️ Yes, Delete Save</button> ` +
		`<button name="send" value="/rpg profile" class="button">Cancel</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBDeleteSuccessHTML(): string {
	return `<div class="infobox">` +
		`<h2>Save Deleted</h2>` +
		`<p>Your saved game has been permanently deleted from the database.</p>` +
		`<p><small>Your current game progress is still in memory. Use "Save to Database" if you want to save your current progress.</small></p>` +
		`<p><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

// ###################################
// B A T T L E   U I   -   N E W   H E L P E R S
// ###################################

/**
 * [NEW HELPER] Generates the top header for a battle screen.
 * This is a new component for Suggestion #4.
 */
function generateBattleHeader(battle: BattleState): string {
	if (battle.battleType === 'battletower') {
		const currentFloor = battle.floor || 1;
		const formatConfig = BATTLE_TOWER_FORMATS[battle.battleTowerFormat || 'battlefactory'];
		const formatName = formatConfig ? formatConfig.name : 'Battle Factory';
		return '<div style="text-align: center;">' +
			'<h2">🗼 ' + formatName + ' Battle Tower - Floor ' + String(currentFloor) + '</h2>' +
			'</div>';
	}
	// Singles and Doubles battles do not have a special header
	return '';
}

/**
 * [NEW HELPER] Generates the battlefield (Pokémon info boxes).
 * This is a new component for Suggestion #4.
 */
function generateBattlefield(battle: BattleState, targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
	const isDoubleBattle = battle.battleType.includes('double');
	const player = getPlayerData(battle.playerId);
	const playerName = player ? player.name : "Your";
	let opponentOwnerName: string | undefined = battle.opponentName;
	if (battle.battleType === 'wild' || battle.battleType === 'wild_double') {
		opponentOwnerName = 'Wild';
	}

	if (isDoubleBattle) {
		const [pSlot0, pSlot1] = battle.playerSlots;
		const [oSlot0, oSlot1] = battle.opponentSlots;

		// This inner helper generates the slot with correct borders for targeting/pending actions
		const generateSlotHTML = (slot: ActivePokemonSlot | null, slotIndex: number, side: 'player' | 'opponent') => {
			if (!slot) {
				return '<div style="border: 1px dashed #ccc; padding: 10px; margin: 5px; border-radius: 5px; text-align: center; color: #888;">(Empty)</div>';
			}

			let ownerName: string | undefined = (side === 'player') ? playerName : opponentOwnerName;

			if (slot.pokemon.hp <= 0) {
				return '<div style="opacity: 0.5; padding: 10px; margin: 5px; border-radius: 5px;">' + generateSharedBattlePokemonInfo(slot, side === 'player', true, ownerName, battle) + '</div>';
			}

			let borderStyle = "1px solid #ccc";
			// Check if this slot is a target (and not the attacker)
			if (targetSelection && targetSelection.attackerSlotIndex !== slotIndex) {
				// This logic isn't perfect, as it highlights all slots, but it's complex to get right without client-side JS.
				// For now, we'll mimic the old logic which just checked attackerSlotIndex.
				// A better server-side approach would be to check the move's target property.
				borderStyle = "3px dashed #007bff";
			}
			if (battle.pendingActions[slotIndex]) {
				borderStyle = "3px solid #28a745";
			}

			return '<div style="border: ' + borderStyle + '; padding: 10px; margin: 5px; border-radius: 5px;">' + generateSharedBattlePokemonInfo(slot, side === 'player', true, ownerName, battle) + '</div>';
		};

		let html = '<table style="width: 100%; margin-bottom: 5px;">';
		// Opponent Row
		html += '<tr>';
		html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
		html += generateSlotHTML(oSlot0, 2, 'opponent');
		html += '</td>';
		html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
		html += generateSlotHTML(oSlot1, 3, 'opponent');
		html += '</td>';
		html += '</tr>';
		// Player Row
		html += '<tr>';
		html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
		html += generateSlotHTML(pSlot0, 0, 'player');
		html += '</td>';
		html += '<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">';
		html += generateSlotHTML(pSlot1, 1, 'player');
		html += '</td>';
		html += '</tr>';
		html += '</table>';
		return html;

	} else {
		// Single Battle or Battle Tower logic
		const playerSlot = battle.playerSlots[0];
		const opponentSlot = battle.opponentSlots[0];

		// Handle null slots, which can happen mid-turn or on faint
		if (!playerSlot || !opponentSlot) {
			console.error(`[RPG Battle Error] Unified generateBattlefield: Missing active slots`, {
				battleType: battle.battleType,
				playerSlotNull: !playerSlot,
				opponentSlotNull: !opponentSlot,
				battleEnded: battle.battleEnded,
				turn: battle.turn,
			});
            
            // Generate basic HTML to avoid crashing the UI
            let recoveryHTML = '<div class="infobox"><h2>Resolving turn...</h2>';
            if (!playerSlot) recoveryHTML += '<p>Waiting for player Pokémon...</p>';
            if (!opponentSlot) recoveryHTML += '<p>Waiting for opponent Pokémon...</p>';
            recoveryHTML += '</div>';
            return recoveryHTML;
		}

		return '<table style="width: 100%; margin-bottom: 5px;">' +
			'<tr>' +
			'<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">' +
			generateSharedBattlePokemonInfo(playerSlot, true, false, playerName, battle) +
			'</td>' +
			'<td style="width: 50%; padding: 0; vertical-align: top; text-align: center;">' +
			generateSharedBattlePokemonInfo(opponentSlot, false, false, opponentOwnerName, battle) +
			'</td>' +
			'</tr>' +
			'</table>';
	}
}

/**
 * [NEW HELPER] Generates the target selection panel for double battles.
 * This is a new component for Suggestion #4.
 */
function generateBattleTargetSelection(battle: BattleState, targetSelection: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;
	const move = getMove(targetSelection.moveId);
	const teraText = targetSelection.shouldTerastallize ? ' (with Terastallization)' : '';

	let html = '<p style="margin-top: 5px; font-weight: bold;">Select a target for <strong>' + move.name + '</strong>' + teraText + ':</p>';

	const targets = [
		{ slot: pSlot0, name: "Ally 1", index: 0 },
		{ slot: pSlot1, name: "Ally 2", index: 1 },
		{ slot: oSlot0, name: "Opponent 1", index: 2 },
		{ slot: oSlot1, name: "Opponent 2", index: 3 },
	];

	const buttonStyle = 'width: 100%; padding: 8px; border-radius: 8px; box-sizing: border-box; text-align: center; margin: 0;';
	const teraParam = targetSelection.shouldTerastallize ? ' terastallize' : '';
	
    // Filter targets based on move properties (e.g., 'normal', 'any', 'self')
    // This is a simplified version; a full implementation would check move.target
    const validTargets = targets.filter(target => {
        if (!target.slot || target.slot.pokemon.hp <= 0) return false;
        // For now, allow all valid slots except the attacker
        return target.index !== targetSelection.attackerSlotIndex;
    });
    
	const targetButtons = validTargets.map(target => {
			return '<button name="send" value="/rpg battleaction move ' + String(targetSelection.attackerSlotIndex) + ' ' + targetSelection.moveId + ' ' + String(target.index) + teraParam + '" class="button" style="' + buttonStyle + '">' + target.name + '</button>';
	});

	// A simple grid for buttons
	let targetButtonsHTML = '<table style="width: auto; border-collapse: separate; border-spacing: 8px; margin: 15px auto;"><tr>';
    let count = 0;
    for (const button of targetButtons) {
        targetButtonsHTML += `<td style="padding: 0; vertical-align: top;">${button}</td>`;
        count++;
        if (count % 2 === 0 && count < targetButtons.length) {
            targetButtonsHTML += '</tr><tr>'; // New row every 2 buttons
        }
    }
	targetButtonsHTML += '</tr></table>';

	html += targetButtonsHTML;
	html += '<p style="margin-top: 15px;"><button name="send" value="/rpg battleaction back" class="button" style="' + buttonStyle + '">Cancel</button></p>';
	return html;
}

/**
 * [NEW HELPER] Generates the main action panel (moves + switch/run/catch).
 * This is a new component for Suggestion #4.
 */
function generateBattleActionPanel(battle: BattleState, teraToggled?: boolean): string {
	const isDoubleBattle = battle.battleType.includes('double');
	const [pSlot0, pSlot1] = battle.playerSlots;

	let activeSlot: ActivePokemonSlot | null = null;
	let activeSlotIndex = -1;

	// Find the next slot that needs to move
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
		html += '<p style="margin-top: 5px; font-weight: bold;">What will <strong>' + (pokemon.nickname || pokemon.species) + '</strong> do?</p>';
		html += generateBattleMoveSelectionHTML(battle, activeSlot, activeSlotIndex, isDoubleBattle, teraToggled);
	} else if (!battle.battleEnded) {
		html += '<p style="margin-top: 10px; text-align: center; color: #666;">Waiting for opponent...</p>';
	}

	// Find *any* active slot to pass to the action buttons (for run/catch validation)
	const anyActivePlayerSlot = (pSlot0 && pSlot0.pokemon.hp > 0) ? pSlot0 : (isDoubleBattle && pSlot1 && pSlot1.pokemon.hp > 0) ? pSlot1 : null;
	html += generateBattleActionButtonsHTML(battle, anyActivePlayerSlot);
	return html;
}
