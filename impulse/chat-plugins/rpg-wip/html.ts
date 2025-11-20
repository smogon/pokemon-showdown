import { Dex, toID } from '../../../sim/dex';
import { getMove, calculateTotalExpForLevel, getActiveSlots } from './utils';
import { ITEMS_DATABASE, ITEM_PRICES } from './items';
import { getShopInventory, getNextShopTier } from './shop';
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, ENCOUNTER_ZONES, getStartingLocation } from './locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS } from './trainers';
import { getPlayerData } from './core';
import type { RPGPokemon, InventoryItem, ActivePokemonSlot, PlayerData, Status, BattleState } from './interface';
import { TOTAL_BADGES } from './badges';

// -------------------------------------------------------------------------------------
// 1. Core Utilities & Data Helpers
// -------------------------------------------------------------------------------------

function calculateExpBarPercentage(expProgress: number, expNeededForLevel: number): number {
	if (expNeededForLevel <= 0) return 100;

	return Math.min(100, Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100)));
}

function getItemIcon(item: InventoryItem | { name: string, category: string, id: string }): string {
	const baseUrl = "https://raw.githubusercontent.com/msikma/pokesprite/master/items";
	
	let filename = item.name.toLowerCase().replace(/ /g, '-').replace(/'/g, '');

	let directory = "medicine"; 

	if (item.category === 'pokeball') {
		directory = "ball";
		filename = filename.replace(/-ball$/, '');
        if (filename === 'poke') filename = 'poke'; 
	} else if (item.category === 'berry') {
		directory = "berry";
		filename = filename.replace(/-berry$/, '');
	} else if (item.category === 'tm') {
		directory = "tms";
		if (filename.startsWith('tm')) filename = 'tm-normal'; 
        if (filename.startsWith('tr')) filename = 'tm-fire'; 
	} else if (item.category === 'evo-item' || item.id.endsWith('stone') || item.id.includes('scale') || item.id.includes('disk')) {
		directory = "evo-item";
	} else if (item.category === 'held') {
		directory = "held-item";
	} else if (item.category === 'key') {
		directory = "key-item";
	} else if (item.category === 'misc') {
        if (filename.includes('candy')) directory = "medicine"; 
        else directory = "data-item";
    }

	if (filename === 'leftovers') directory = "held-item";
    if (filename === 'rare-candy') directory = "medicine";
    if (filename === 'pp-up' || filename === 'pp-max') directory = "medicine";

	return `${baseUrl}/${directory}/${filename}.png`;
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
	return `<div class="rpg-nav-bar">` +
		`<button name="send" value="/rpg profile" class="button rpg-nav-button"><span class="rpg-nav-icon">👤</span> Profile</button>` +
		`<button name="send" value="/rpg party" class="button rpg-nav-button"><span class="rpg-nav-icon">⚡</span> Party</button>` +
		`<button name="send" value="/rpg items" class="button rpg-nav-button"><span class="rpg-nav-icon">🎒</span> Items</button>` +
		`<button name="send" value="/rpg explore" class="button rpg-nav-button"><span class="rpg-nav-icon">🗺️</span> Explore</button>` +
		`<button name="send" value="/rpg pokedex" class="button rpg-nav-button"><span class="rpg-nav-icon">📖</span> Pokédex</button>` +
		`<button name="send" value="/rpg battletower start" class="button rpg-nav-button"><span class="rpg-nav-icon">🗼</span> Tower</button>` +
		`</div>`;
}

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

	let html = '<div class="rpg-margin-top">';
	for (const category of categories) {
		const command = category.id ? `${baseCommand} ${category.id}` : baseCommand;
		html += `<button name="send" value="${command}" class="button">${category.name}</button> `;
	}
	html += '</div>';
	return html;
}

function generateHPBar(pokemon: RPGPokemon): string {
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpClass = hpPercentage > 50 ? 'rpg-hp-high' : hpPercentage > 25 ? 'rpg-hp-mid' : 'rpg-hp-low';

	return `<div class="rpg-hp-bar">` +
		`<div class="rpg-hp-bar-inner ${hpClass}" style="width: ${hpPercentage}%;"></div>` +
		`<div class="rpg-hp-bar-text">HP: ${pokemon.hp}/${pokemon.maxHp}</div>` +
		`</div>`;
}

function generateExpBar(pokemon: RPGPokemon): string {
	const expForLastLevel = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);
	const expForNextLevel = pokemon.expToNextLevel;
	const expProgress = pokemon.experience - expForLastLevel;
	const expNeededForLevel = expForNextLevel - expForLastLevel;
	const expPercentage = calculateExpBarPercentage(expProgress, expNeededForLevel);

	return `<div class="rpg-exp-bar">` +
		`<div class="rpg-exp-bar-inner" style="width: ${expPercentage}%;"></div>` +
		`<div class="rpg-exp-bar-text">EXP: ${expProgress}/${expNeededForLevel}</div>` +
		`</div>`;
}

// -------------------------------------------------------------------------------------
// 2. System & Main Menu HTML
// -------------------------------------------------------------------------------------

export function generateProfileHTML(player: PlayerData, notification?: string): string {
	let progressText = 'Just starting out';
	if (player.storyFlags.has('champion')) progressText = 'Champion!';
	else if (player.storyFlags.has('all_badges')) progressText = 'Ready for Elite Four';
	else if (player.badges >= 4) progressText = `${player.badges}/${TOTAL_BADGES} Badges - Halfway there!`;
	else if (player.badges > 0) progressText = `${player.badges}/${TOTAL_BADGES} Badges - On your journey`;

	let badgeHTML = '';
	if (player.obtainedBadges.length > 0) {
		badgeHTML = `<div class="rpg-memo-box" style="margin-top:5px; text-align:center;">`;
		for (const badge of player.obtainedBadges) {
			badgeHTML += `<span title="${badge}" style="font-size:1.2em; cursor:help;">⭐</span> `;
		}
		badgeHTML += `</div>`;
	} else {
		badgeHTML = `<span class="rpg-text-muted">None yet</span>`;
	}

	let html = `<div class="rpg-infobox">`;
    
    if (notification) {
        html += `<div class="rpg-notification">${notification}</div>`;
    }

	html += `<div class="rpg-scrollable-grid">` +

			`<div class="rpg-summary-header">` +
				`<div class="rpg-summary-info">` +
					`<h3>${player.name}</h3>` +
					`<p class="rpg-text-info"><strong>${progressText}</strong></p>` +
				`</div>` +
			`</div>` +

			`<div class="rpg-grid-2col">` +
				`<div>` +
					`<h4>Trainer Card</h4>` +
					`<table class="rpg-stats-table">` +
						`<tr><td>Money</td><td class="rpg-stat-val">₽${player.money}</td></tr>` +
						`<tr><td>Badges</td><td>${badgeHTML}</td></tr>` +
						`<tr><td>Pokedex</td><td class="rpg-stat-val">0</td></tr>` + 
						`<tr><td>Trainers Defeated</td><td class="rpg-stat-val">${player.defeatedTrainers.size}</td></tr>` +
					`</table>` +
				`</div>` +
				`<div>` +
					`<h4>Adventure</h4>` +
					`<div class="rpg-memo-box">` +
						`<p><strong>Location:</strong><br>${player.location}</p>` +
						`<hr style="border-color:rgba(0,0,0,0.1); margin:5px 0;">` +
						`<p><strong>Party:</strong> ${player.party.length} / 6</p>` +
						`<p><strong>PC Box:</strong> ${player.pc.size}</p>` +
					`</div>` +
				`</div>` +
			`</div>` +

			`<hr />` +
			`<h4>System</h4>` +
			`<p style="text-align:center">` +
				`<button name="send" value="/rpg dbsave" class="button">💾 Save Game</button> ` +
				`<button name="send" value="/rpg dbload" class="button">📁 Load Game</button> ` +
				`<button name="send" value="/rpg dbdelete" class="button rpg-text-error">🗑️ Delete Save</button>` +
			`</p>` +
		
		`</div>` +

		generateBottomNavigation() +
	`</div>`;

	return html;
}

export function generateWelcomeHTML(): string {
	return `<div class="rpg-infobox">` +
		`<h2>Developer's Note</h2>` +
		`<div class="rpg-memo-box" style="margin-bottom: 15px; line-height: 1.5;">` +
			`<p>Welcome to the <strong>Impulse RPG System</strong>!</p>` +
			`<p>This is a text-based adventure where your journey unfolds through chat commands. We are currently in an <strong>active testing phase</strong>.</p>` +
			`<p><small>You may encounter bugs, placeholder text, or progress resets as we improve the game. Your feedback is valuable!</small></p>` +
		`</div>` +
		`<div class="rpg-grid-3col-items">` +
			`<button name="send" value="/rpg storymode" class="button" style="height:auto; padding:10px;"><strong>New Game</strong><br><small>Start Fresh</small></button>` +
			`<button name="send" value="/rpg dbload" class="button" style="height:auto; padding:10px;"><strong>Load Game</strong><br><small>Continue</small></button>` +
			`<button name="send" value="/rpg battletower start" class="button" style="height:auto; padding:10px;"><strong>Battle Tower</strong><br><small>Roguelike</small></button>` +
		`</div>` +
		`</div>`;
}

export function generateExploreHTML(player: PlayerData, location: any, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<div class="rpg-text-center">` +
			`<h2><b>${location.name}</b></h2>` +
			`<p><em>${location.description || ''}</em></p>` +
		`</div>`;

	const btnStyle = 'margin: 3px;';

	// --- 1. Wild Pokemon Zones (Compact) ---
	const availableZones = location.encounterZones || [];
	if (availableZones.length > 0) {
		html += `<hr /><strong>Wild Pokémon:</strong><br>`;
		html += `<p class="rpg-text-center">`;
		for (const zoneId of availableZones) {
			const zone = ENCOUNTER_ZONES[zoneId];
			if (zone) {
				const icon = zone.battleType === 'double' ? '👥' : '🌿';
				html += `<button name="send" value="/rpg wildpokemon ${zoneId}" class="button" style="${btnStyle}">${icon} ${zone.name}</button>`;
			}
		}
		html += `</p>`;
	}

	// --- 2. Buildings (Compact) ---
	if (location.buildings && location.buildings.length > 0) {
		html += `<hr /><strong>Buildings:</strong><br>`;
		html += `<p class="rpg-text-center">`;
		for (const building of location.buildings) {
			if (building.accessible === false) continue;
			if (building.requiredFlag && !player.storyFlags.has(building.requiredFlag)) continue;

			let icon = '🏠';
			if (building.type === 'pokecenter') icon = '🏥';
			else if (building.type === 'pokemart') icon = '🏪';
			else if (building.type === 'gym') icon = '⚔️';
			else if (building.type === 'lab') icon = '🔬';
			else if (building.type === 'department') icon = '🏬';
			else if (building.type === 'gameCorner') icon = '🎰';

			html += `<button name="send" value="/rpg building ${building.id}" class="button" style="${btnStyle}">${icon} ${building.name}</button>`;
		}
		html += `</p>`;
	}

	// --- 3. Trainers (Compact) ---
	const locationId = toID(location.name);
	const locationTrainers = TRAINER_LOCATIONS[locationId];
	if (locationTrainers && locationTrainers.length > 0) {
		const availableTrainers = locationTrainers.filter(tid => !player.defeatedTrainers.has(tid));
		if (availableTrainers.length > 0) {
			html += `<hr /><strong>Trainers:</strong><br>`;
			html += `<p class="rpg-text-center">`;
			for (const trainerId of availableTrainers) {
				const trainerData = TRAINER_DATABASE[trainerId];
				if (trainerData) {
					html += `<button name="send" value="/rpg challenge ${trainerId}" class="button" style="${btnStyle}">🥊 ${trainerData.name}</button>`;
				}
			}
			html += `</p>`;
		}
	}

	// --- 4. Travel (Compact) ---
	if (location.connectedLocations && location.connectedLocations.length > 0) {
		html += `<hr /><strong>Travel:</strong><br>`;
		html += `<p class="rpg-text-center">`;
		for (const connection of location.connectedLocations) {
			let canAccess = true;
			
			if (connection.requiredBadge && !player.obtainedBadges.includes(connection.requiredBadge)) canAccess = false;
			if (connection.requiredFlag && !player.storyFlags.has(connection.requiredFlag)) canAccess = false;

			if (canAccess) {
				html += `<button name="send" value="/rpg travel ${connection.id}" class="button" style="${btnStyle}">➡️ ${connection.name}</button>`;
			} else {
				html += `<button class="button disabled" disabled style="${btnStyle}">🔒 ${connection.name}</button>`;
			}
		}
		html += `</p>`;
	}

	html += generateBottomNavigation();
	html += `</div>`;
	return html;
}

export function generateDBDeleteConfirmHTML(): string {
	return `<div class="rpg-infobox">` +
		`<h2>Delete Save?</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; border:1px solid #e57373; background:rgba(229, 115, 115, 0.1);">` +
			`<p class="rpg-text-error"><strong>⚠️ WARNING</strong></p>` +
			`<p>This will <strong>permanently delete</strong> your save file from the database.</p>` +
			`<p>This action cannot be undone.</p>` +
		`</div>` +
		`<p style="text-align:center; margin-top:15px;">` +
			`<button name="send" value="/rpg dbdelete confirm" class="button rpg-text-error">Yes, Delete Forever</button> ` +
			`<button name="send" value="/rpg profile" class="button">Cancel</button>` +
		`</p>` +
		generateBottomNavigation() +
		`</div>`;
}

// -------------------------------------------------------------------------------------
// 3. Party & Storage HTML
// -------------------------------------------------------------------------------------

function generatePartyActionButtons(pokemon: RPGPokemon): string {
	const itemButton = pokemon.item ?
		`<button name="send" value="/rpg takeitem ${pokemon.id}" class="button rpg-button-small">Take Item</button>` :
		`<button name="send" value="/rpg giveitem ${pokemon.id}" class="button rpg-button-small">Give Item</button>`;

	return `<br><div class="rpg-margin-top">` +
		`<button name="send" value="/rpg summary ${pokemon.id}" class="button rpg-button-small">Summary</button> ` +
		`${itemButton} ` +
		`<button name="send" value="/rpg depositpc ${pokemon.id}" class="button rpg-button-small">Deposit</button>` +
		`</div>`;
}

function generatePartySlotButtons(slotInfo: { index: number, partyLength: number }): string {
	let html = `<div><strong>Slot ${slotInfo.index + 1}:</strong>`;
	if (slotInfo.index > 0) {
		html += ` <button name="send" value="/rpg swapslot ${slotInfo.index} ${slotInfo.index - 1}" class="button rpg-button-small">↑</button>`;
	}
	if (slotInfo.index < slotInfo.partyLength - 1) {
		html += ` <button name="send" value="/rpg swapslot ${slotInfo.index} ${slotInfo.index + 1}" class="button rpg-button-small">↓</button>`;
	}
	html += `</div>`;
	return html;
}

function generateUnifiedStatsTable(pokemon: RPGPokemon): string {
	const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
	const statNames = { hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed' };

	let html = `<table class="rpg-stats-table">` +
		`<tr><th>Stat</th><th>Value</th><th>IV</th><th>EV</th></tr>`;

	for (const stat of stats) {
		const value = stat === 'hp' ? pokemon.maxHp : pokemon[stat];
		const iv = pokemon.ivs[stat];
		const ev = pokemon.evs[stat];
		
		const ivClass = iv === 31 ? 'rpg-text-success' : '';
		const evClass = ev > 0 ? 'rpg-stat-ev' : 'rpg-text-muted';

		html += `<tr>` +
			`<td>${statNames[stat]}</td>` +
			`<td class="rpg-stat-val">${value}</td>` +
			`<td class="${ivClass}">${iv}</td>` +
			`<td class="${evClass}">${ev}</td>` +
			`</tr>`;
	}
	
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	html += `<tr><td colspan="3" style="text-align:right"><small>Total EVs:</small></td><td><strong>${totalEVs}/510</strong></td></tr>`;
	
	html += `</table>`;
	return html;
}

export function generatePokemonInfoHTML(
	slot: ActivePokemonSlot,
	isPlayerSide: boolean,
	showActions = false,
	slotInfo?: { index: number, partyLength: number }
): string {
	const pokemon = slot.pokemon;
	const species = Dex.species.get(pokemon.species);

	let expBarHTML = '';
	if (isPlayerSide) {
		expBarHTML = generateExpBar(pokemon);
	} else {
		expBarHTML = `<div class="rpg-exp-bar"></div>`;
	}

	const statusTagsHTML = generatePokemonStatusTagsHTML(slot, false);

	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';

	let html = `<div class="rpg-pokemon-card">`;

	if (slotInfo) {
		html += generatePartySlotButtons(slotInfo);
	}

	const typeDisplay = slot.terastallized ? `Tera ${slot.terastallized}` : species.types.join('/');

	html += `<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol} ${shinySymbol} (Level ${pokemon.level})<br>`;
	html += `<div class="rpg-battle-status-line">${statusTagsHTML}</div>`;
	html += `<small>Type: ${typeDisplay}</small><br>`;

	html += generateHPBar(pokemon);
	html += expBarHTML;

	if (isPlayerSide) {
		html += `Nature: ${pokemon.nature}<br>`;
		html += `Ability: ${pokemon.ability || 'Unknown'}<br>`;
		if (pokemon.item) {
			html += `Held Item: ${ITEMS_DATABASE[pokemon.item]?.name || pokemon.item}<br>`;
		}
	}

	if (showActions) {
		html += generatePartyActionButtons(pokemon);
	}

	html += '</div>';
	return html;
}

export function generatePartyScreenHTML(player: PlayerData, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>Your Party</h2>`;

	if (player.party.length === 0) {
		html += `<p>No Pokemon in party.</p>`;
	} else {
		html += `<div class="rpg-party-grid">`;
		for (let i = 0; i < 6; i++) {
			const pokemon = player.party[i];
			if (pokemon) {
				const species = Dex.species.get(pokemon.species);
				const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
				const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';
				
				const itemText = pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None';

				const moveUpBtn = i > 0 ? `<button name="send" value="/rpg swapslot ${i} ${i - 1}" class="button rpg-party-move-btn" title="Move Up">↑</button>` : '';
				const moveDownBtn = i < player.party.length - 1 ? `<button name="send" value="/rpg swapslot ${i} ${i + 1}" class="button rpg-party-move-btn" title="Move Down">↓</button>` : '';

				html += `<div class="rpg-party-card">` +
					`<div class="rpg-party-main">` +
						`<div class="rpg-party-icon"><psicon pokemon="${species.id}" /></div>` +
						`<div class="rpg-party-stats">` +
							`<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol}${shinySymbol}<br>` +
							`<small>Lvl ${pokemon.level}</small><br>` +
							`${generateHPBar(pokemon)}` +
							`<small class="rpg-text-muted">Item: ${itemText}</small>` +
						`</div>` +
					`</div>` +
					`<div class="rpg-party-actions">` +
						`<button name="send" value="/rpg summary ${pokemon.id}" class="button">Summary</button>` +
						`<button name="send" value="/rpg depositpc ${pokemon.id}" class="button">Deposit</button>` +
						moveUpBtn +
						moveDownBtn +
					`</div>` +
				`</div>`;
			} else {
				html += `<div class="rpg-party-card rpg-party-empty">Empty Slot</div>`;
			}
		}
		html += `</div>`;
	}

	html += generateBottomNavigation();
	html += `</div>`;
	return html;
}

export function generatePCHTML(player: PlayerData, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>Pokemon Storage System</h2>` +
		`<p><strong>Stored:</strong> ${player.pc.size} / 100</p>`;

	if (player.pc.size === 0) {
		html += `<div class="rpg-memo-box" style="text-align:center; margin:20px 0; color:#888;">Box is empty.</div>`;
	} else {
		html += `<div class="rpg-scrollable-grid">` +
			`<div class="rpg-party-grid">`;

		for (const [pokemonId, pokemon] of player.pc) {
			const species = Dex.species.get(pokemon.species);
			const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
			const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';

			html += `<div class="rpg-party-card">` +
				`<div class="rpg-party-main">` +
					`<div class="rpg-party-icon"><psicon pokemon="${species.id}" /></div>` +
					`<div class="rpg-party-stats">` +
						`<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol}${shinySymbol}<br>` +
						`<small>Lvl ${pokemon.level} | HP: ${pokemon.hp}/${pokemon.maxHp}</small>` +
					`</div>` +
				`</div>` +
				`<div class="rpg-party-actions">` +
					`<button name="send" value="/rpg withdrawpc ${pokemonId}" class="button">Withdraw</button>` +
					`<button name="send" value="/rpg summary ${pokemonId}" class="button">Summary</button>` +
				`</div>` +
			`</div>`;
		}
		
		html += `</div></div>`; 
	}

	html += `<hr />` +
		`<p style="text-align:center"><button name="send" value="/rpg party" class="button">View Party</button></p>` +
		generateBottomNavigation() +
		`</div>`;
	return html;
}

export function generateSummarySelectionHTML(player: PlayerData): string {
	let html = `<div class="rpg-infobox rpg-menu-box"><h2>Select a Pokémon</h2><p>Choose a Pokémon to view its summary:</p>`;
	if (player.party.length === 0) {
		html += '<p>You have no Pokémon.</p>';
	} else {
		player.party.forEach(p => {
			html += `<button name="send" value="/rpg summary ${p.id}" class="button">${p.species}</button> `;
		});
	}
	html += `<hr /><p><button name="send" value="/rpg party" class="button">← Back to Party</button></p></div>`;
	return html;
}

export function generatePokemonSummaryHTML(pokemon: RPGPokemon, backLocation: 'party' | 'pc' = 'party'): string {
	const species = Dex.species.get(pokemon.species);
	const spriteFilename = getSpriteFilename(species.id);
	const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${spriteFilename}.png`;

	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';
	
	const typesHTML = species.types.map(t => `<span class="rpg-tag" style="background-color:#777;">${t}</span>`).join(' ');
	const teraHTML = pokemon.teraType ? `<span class="rpg-tag rpg-tag-tera">Tera ${pokemon.teraType}</span>` : '';
	const itemText = pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None';

	let movesHTML = `<div class="rpg-grid-2col">`;
	for (let i = 0; i < 4; i++) {
		const move = pokemon.moves[i];
		if (move) {
			const moveData = getMove(move.id);
			movesHTML += `<div class="rpg-summary-move">` +
				`<strong>${moveData.name}</strong><br>` +
				`<small>${moveData.type} | PP: ${move.pp}/${moveData.pp || 5}</small>` +
				`</div>`;
		} else {
			movesHTML += `<div class="rpg-summary-move rpg-text-muted">-</div>`;
		}
	}
	movesHTML += `</div>`;

	const backButton = backLocation === 'pc' 
		? `<button name="send" value="/rpg pc" class="button">← Back to PC</button>`
		: `<button name="send" value="/rpg party" class="button">← Back to Party</button>`;

	let html = `<div class="rpg-infobox">` +
		`<div class="rpg-scrollable-grid">` +
			`<div class="rpg-summary-header">` +
				`<div class="rpg-summary-sprite"><img src="${spriteUrl}" /></div>` +
				`<div class="rpg-summary-info">` +
					`<h3>${pokemon.nickname || pokemon.species} ${genderSymbol} ${shinySymbol}</h3>` +
					`<p>Level ${pokemon.level}</p>` +
					`${generateHPBar(pokemon)}` +
					`${generateExpBar(pokemon)}` +
				`</div>` +
			`</div>` +

			`<div class="rpg-grid-2col">` +
				`<div>` +
					`<h4>Battle Stats</h4>` +
					generateUnifiedStatsTable(pokemon) +
				`</div>` +
				`<div>` +
					`<h4>Trainer Memo</h4>` +
					`<div class="rpg-memo-box">` +
						`<p><strong>Nature:</strong> ${pokemon.nature}</p>` +
						`<p><strong>Ability:</strong> ${pokemon.ability || 'Unknown'}</p>` +
						`<p><strong>Item:</strong> ${itemText}</p>` +
						`<p><strong>Types:</strong> ${typesHTML} ${teraHTML}</p>` +
						`<hr style="border-color:rgba(0,0,0,0.1); margin:5px 0;">` +
						`<p><small>Caught In: ${ITEMS_DATABASE[pokemon.caughtIn]?.name || 'Poké Ball'}</small></p>` +
						`<p><small>Friendship: ${pokemon.friendship}</small></p>` +
					`</div>` +
				`</div>` +
			`</div>` +
			
			`<hr />` +
			`<h4>Known Moves</h4>` +
			movesHTML +
		
		`</div>` +

		`<hr><center><p class="rpg-margin-top">${backButton}</p></center>` +
	`</div>`;

	return html;
}

export function generateMoveLearnHTML(player: PlayerData, additionalMessages?: string[]): string {
	const queueArray = player.pendingMoveLearnQueue;
	if (!queueArray || queueArray.length === 0) return `<div class="rpg-infobox"><h2>Error</h2><p>No pending moves found.</p></div>`;
	
	const queue = queueArray[0];
	if (!queue || queue.moveIds.length === 0) {
		player.pendingMoveLearnQueue?.shift();
		return `<div class="rpg-infobox"><h2>Error</h2><p>No pending moves found.</p></div>`;
	}
	
	const pokemon = player.party.find(p => p.id === queue.pokemonId);
	const newMove = getMove(queue.moveIds[0]);
	if (!pokemon || !newMove.exists) {
		player.pendingMoveLearnQueue?.shift();
		return `<div class="rpg-infobox"><h2>Error</h2><p>Invalid Pokemon or move data.</p>${generateBottomNavigation()}</div>`;
	}

	let html = `<div class="rpg-infobox">`;

	if (additionalMessages && additionalMessages.length > 0) {
		html += `<div class="rpg-memo-box" style="margin-bottom:10px;">${additionalMessages.join('<br>')}</div>`;
	}

	html += `<h2>Move Learning</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
			`<p><strong>${pokemon.species}</strong> wants to learn <strong>${newMove.name}</strong>!</p>` +
			`<p><small>But ${pokemon.species} already knows 4 moves.</small></p>` +
		`</div>` +
		`<p>Select a move to forget:</p>`;

	html += `<div class="rpg-grid-2col">`;
	for (const move of pokemon.moves) {
		html += `<button name="send" value="/rpg learnmove ${move.id}" class="button" style="text-align:center; height:auto; padding:8px;">` +
			`<strong>${getMove(move.id).name}</strong>` +
			`</button>`;
	}
	html += `</div>`;

	html += `<hr /><p style="text-align:center;">...or give up on ${newMove.name}?</p>` +
		`<p style="text-align:center;"><button name="send" value="/rpg learnmove skip" class="button rpg-text-error">Give Up on New Move</button></p>` +
		`</div>`;
	return html;
}

export function generateEggMoveSelectionHTML(pokemon: RPGPokemon, eggMoves: string[]): string {
	let html = `<div class="rpg-infobox">` +
		`<h2>Egg Move Tutor</h2>` +
		`<p>Choose a move for <strong>${pokemon.species}</strong> to learn:</p>` +
		`<div class="rpg-grid-2col">`;

	for (const moveId of eggMoves) {
		const move = getMove(moveId);
		html += `<button name="send" value="/rpg learneggmove ${pokemon.id} ${moveId}" class="button" style="padding:8px; height:auto;">` +
			`<strong>${move.name}</strong><br>` +
			`<small>${move.type} | Power: ${move.basePower || '-'}</small>` +
			`</button> `;
	}
	
	html += `</div>` +
		`<hr /><p style="text-align:center"><button name="send" value="/rpg items" class="button">Cancel</button></p>` +
		`</div>`;
	return html;
}


// -------------------------------------------------------------------------------------
// 4. Item & Shop HTML
// -------------------------------------------------------------------------------------

export function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="rpg-infobox">` +
		`<h2>Inventory</h2>` +
		`<p><strong>Money:</strong> ₽${player.money}</p>`;

	html += generateItemCategoryFilters('/rpg items');

	let itemsFound = false;
	// Wrap the table in the new 3-column grid utility
	let gridHTML = `<br><div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const [itemId, item] of player.inventory) {
		if (!category || item.category === category || category === '') {
			itemsFound = true;
			
			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
					`<div class="rpg-item-details">` +
						`<strong>${item.name}</strong><br>` +
						`<small>Qty: ${item.quantity}</small>` +
					`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
					`<button name="send" value="/rpg useitem ${itemId}" class="button">Use</button> ` +
					`<button name="send" value="/rpg giveitem" class="button">Give</button>` +
				`</div>` +
			`</div>`;
			// NOTE: Changed from <td> to <div> to use the CSS Grid layout instead of table row/cell logic
			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	// Close grid wrapper and scroll div
	gridHTML += '</div></div>';

	if (itemsFound) {
		html += gridHTML;
	} else {
		html += `<p>You have no items in this category.</p>`;
	}

	html += generateBottomNavigation();
	html += `</div>`;
	return html;
}

export function generateShopHTML(player: PlayerData, category?: string, notification?: string): string {
	const locationId = toID(player.location);
	const shopInventory = getShopInventory(locationId, player.badges);
	const nextTier = getNextShopTier(locationId, player.badges);

	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>Poké Mart - ${player.location}</h2>` +
		`<p><strong>Money:</strong> ₽${player.money} | <strong>Badges:</strong> ${player.badges}/${TOTAL_BADGES}</p>`;

	if (nextTier) {
		html += `<p class="rpg-text-muted"><small>🔒 ${nextTier.itemCount} more items will unlock with ${nextTier.requiredBadges} badges</small></p>`;
	}

	html += `<p><button name="send" value="/rpg sell" class="button rpg-button-sell">Go to Sell Menu</button></p>`;
	html += generateItemCategoryFilters('/rpg shop');

	let itemsFound = false;
	// Wrap the table in the new 3-column grid utility
	let gridHTML = `<br><div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const itemId of shopInventory) {
		const item = ITEMS_DATABASE[itemId];
		const price = ITEM_PRICES[itemId];
		if (!item || !price) continue;

		if (!category || item.category === category || category === '') {
			itemsFound = true;

			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
					`<div class="rpg-item-details">` +
						`<strong>${item.name}</strong><br>` +
						`<span class="rpg-text-info">₽${price}</span>` +
					`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
					`<button name="send" value="/rpg buy ${itemId} 1" class="button">Buy 1</button> ` +
					`<button name="send" value="/rpg buy ${itemId} 10" class="button">Buy 10</button>` +
				`</div>` +
			`</div>`;

			// NOTE: Changed from <td> to <div>
			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	// Close grid wrapper and scroll div
	gridHTML += '</div></div>';

	if (itemsFound) {
		html += gridHTML;
	} else {
		html += `<p>No items found in this category.</p>`;
	}

	html += `<hr><center><p class="rpg-margin-top"><button name="send" value="/rpg explore" class="button">Back to Explore</button></p></center>`;
	html += `</div>`;
	return html;
}

export function generateSellMenuHTML(player: PlayerData, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>Sell Items</h2><p>Select an item to sell:</p><p><strong>Your Money:</strong> ₽${player.money}</p>`;
	
	let sellableItems = 0;
	// Wrap the table in the new 3-column grid utility
	let gridHTML = `<div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const [id, item] of player.inventory) {
		const purchasePrice = ITEM_PRICES[id];
		if (purchasePrice && item.category !== 'key') {
			const sellPrice = Math.floor(purchasePrice / 2);
			sellableItems++;

			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
					`<div class="rpg-item-details">` +
						`<strong>${item.name}</strong> (x${item.quantity})<br>` +
						`<small>Sell: ₽${sellPrice}</small>` +
					`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
					`<button name="send" value="/rpg sell ${id} 1" class="button">Sell 1</button> ` +
					(item.quantity >= 10 ? `<button name="send" value="/rpg sell ${id} 10" class="button">Sell 10</button>` : '') +
				`</div>` +
			`</div>`;

			// NOTE: Changed from <td> to <div>
			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	// Close grid wrapper and scroll div
	gridHTML += '</div></div>';

	if (sellableItems > 0) {
		html += gridHTML;
	} else {
		html += `<p>You have no valuable items to sell.</p>`;
	}
	
	html += `<p class="rpg-margin-top"><button name="send" value="/rpg shop" class="button">Back to Shop</button></p></div>`;
	return html;
}

function generateSelectionCard(pokemon: RPGPokemon, actionButton: string, details: string = ''): string {
	const species = Dex.species.get(pokemon.species);
	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';
	const itemText = pokemon.item ? (ITEMS_DATABASE[pokemon.item]?.name || pokemon.item) : 'None';

	return `<div class="rpg-party-card">` +
		`<div class="rpg-party-main">` +
			`<div class="rpg-party-icon"><psicon pokemon="${species.id}" /></div>` +
			`<div class="rpg-party-stats">` +
				`<strong>${pokemon.nickname || pokemon.species}</strong> ${genderSymbol}${shinySymbol}<br>` +
				`<small>Lvl ${pokemon.level} | HP: ${pokemon.hp}/${pokemon.maxHp}</small><br>` +
				(details ? `<small>${details}</small>` : `<small class="rpg-text-muted">Item: ${itemText}</small>`) +
			`</div>` +
		`</div>` +
		`<div class="rpg-party-actions">` +
			actionButton +
		`</div>` +
	`</div>`;
}

export function generateMedicinePokemonSelectionHTML(player: PlayerData, itemId: string, itemName: string): string {
	let html = `<div class="rpg-infobox"><h2>Use ${itemName}</h2><p>Select a Pokemon to use this item on:</p>`;
	
	html += `<div class="rpg-scrollable-grid"><div class="rpg-party-grid">`;

	const isRevival = ['revive', 'maxrevive', 'revivalherb'].includes(itemId);
	const isHealing = ['potion', 'superpotion', 'hyperpotion', 'maxpotion', 'fullrestore', 'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'berryjuice'].includes(itemId);
	const isStatusHeal = ['antidote', 'paralyzeheal', 'awakening', 'burnheal', 'iceheal', 'fullheal', 'healpowder'].includes(itemId);
	const isPPRestore = ['ether', 'maxether', 'elixir', 'maxelixir'].includes(itemId);
	const isVitamin = ['hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos'].includes(itemId);

	for (const pokemon of player.party) {
		let show = false;
		let details = '';

		if (isRevival && pokemon.hp <= 0) { show = true; details = `<span class="rpg-text-error">Fainted</span>`; }
		else if (isHealing && pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) { show = true; }
		else if (isStatusHeal && pokemon.hp > 0 && pokemon.status) { show = true; details = `<span class="rpg-text-error">${pokemon.status.toUpperCase()}</span>`; }
		else if (isPPRestore && pokemon.hp > 0) { show = true; }
		else if (isVitamin && pokemon.hp > 0) {
			const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
			if (totalEVs < 510) { show = true; details = `EVs: ${totalEVs}/510`; }
		}

		if (show) {
			const btn = `<button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use Here</button>`;
			html += generateSelectionCard(pokemon, btn, details);
		}
	}
	html += `</div></div>`;
	html += `<p style="text-align:center"><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
	return html;
}

export function generateMiscItemPokemonSelectionHTML(player: PlayerData, itemId: string, itemName: string): string {
	let html = `<div class="rpg-infobox"><h2>Use ${itemName}</h2><p>Select a Pokémon to use this item on:</p>`;
	html += `<div class="rpg-scrollable-grid"><div class="rpg-party-grid">`;
	
	for (const pokemon of player.party) {
		let canUse = true;
		let details = '';

		if (itemId === 'rarecandy' || itemId.startsWith('expcandy')) {
			if (pokemon.level >= 100) canUse = false;
			details = `${pokemon.experience} / ${pokemon.expToNextLevel} EXP`;
		}
		if (itemId === 'terashard') {
			details = `Tera: ${pokemon.teraType}`;
		}

		if (canUse) {
			const btn = `<button name="send" value="/rpg useitem ${itemId} ${pokemon.id}" class="button">Use Here</button>`;
			html += generateSelectionCard(pokemon, btn, details);
		}
	}
	html += `</div></div>`;
	html += `<p style="text-align:center"><button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
	return html;
}

export function generateGiveItemSelectionHTML(player: PlayerData): string {
	let html = `<div class="rpg-infobox"><h2>Give Item</h2><p>Select a Pokémon to give an item to:</p>`;
	html += `<div class="rpg-scrollable-grid"><div class="rpg-party-grid">`;
	for (const pokemon of player.party) {
		const btn = `<button name="send" value="/rpg giveitem ${pokemon.id}" class="button">Select</button>`;
		html += generateSelectionCard(pokemon, btn);
	}
	html += `</div></div>`;
	html += `<hr /><p style="text-align:center"><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
	return html;
}

export function generateGiveItemToSpecificPokemonHTML(player: PlayerData, pokemon: RPGPokemon): string {
	let html = `<div class="rpg-infobox"><h2>Give to ${pokemon.species}</h2><p>Select an item from your bag:</p>`;
	
	let itemsFound = false;
	// Wrap the table in the new 3-column grid utility
	let gridHTML = `<div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const [id, item] of player.inventory) {
		if (item.category === 'held' || item.category === 'berry') {
			itemsFound = true;
			
			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
					`<div class="rpg-item-details">` +
						`<strong>${item.name}</strong><br>` +
						`<small>Qty: ${item.quantity}</small>` +
					`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
					`<button name="send" value="/rpg giveitem ${pokemon.id} ${id}" class="button">Give</button>` +
				`</div>` +
			`</div>`;

			// NOTE: Changed from <td> to <div>
			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	// Close grid wrapper and scroll div
	gridHTML += '</div></div>';

	if (itemsFound) {
		html += gridHTML;
	} else {
		html += `<p>You have no holdable items in your bag.</p>`;
	}
	
	html += `<hr /><p style="text-align:center"><button name="send" value="/rpg giveitem" class="button">Back to Pokémon</button></p></div>`;
	return html;
	}

export function generateTakeItemSelectionHTML(player: PlayerData): string {
	let html = `<div class="rpg-infobox"><h2>Take Item</h2><p>Select a Pokémon to take its item:</p>`;
	html += `<div class="rpg-scrollable-grid"><div class="rpg-party-grid">`;
	for (const pokemon of player.party) {
		if (pokemon.item) {
			const btn = `<button name="send" value="/rpg takeitem ${pokemon.id}" class="button">Take Item</button>`;
			html += generateSelectionCard(pokemon, btn);
		}
	}
	html += `</div></div>`;
	html += `<hr /><p style="text-align:center"><button name="send" value="/rpg party" class="button">Back to Party</button></p></div>`;
	return html;
}

export function generateGiveItemPokemonSelectionHTML(player: PlayerData, itemId: string): string {
	const item = ITEMS_DATABASE[itemId];
	if (!item) return `<div class="rpg-infobox"><h2>Error</h2><p>Item not found.</p></div>`;

	let html = `<div class="rpg-infobox"><h2>Give ${item.name}</h2><p>Select a Pokémon to give this item to:</p>`;
	html += `<div class="rpg-scrollable-grid"><div class="rpg-party-grid">`;
	for (const pokemon of player.party) {
		const btn = `<button name="send" value="/rpg giveitem ${pokemon.id} ${itemId}" class="button">Give Here</button>`;
		html += generateSelectionCard(pokemon, btn);
	}
	html += `</div></div>`;
	html += `<hr /><p style="text-align:center"><button name="send" value="/rpg items" class="button">Back to Bag</button></p></div>`;
	return html;
}

export function generateMoveSelectionHTML(player: PlayerData, pokemonId: string, itemId: string): string {
	const pokemon = player.party.find(p => p.id === pokemonId);
	const item = ITEMS_DATABASE[itemId];
	if (!pokemon || !item) return `<div class="rpg-infobox"><h2>Error</h2><p>Data not found.</p></div>`;

	let html = `<div class="rpg-infobox"><h2>Use ${item.name}</h2>` +
		`<p>Select a move to restore PP for <strong>${pokemon.species}</strong>:</p>` +
		`<div class="rpg-grid-2col">`;

	let canRestoreAny = false;
	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		const maxPP = moveData.pp || 5;
		const isFull = move.pp >= maxPP;
		
		if (!isFull) canRestoreAny = true;

		const btnClass = isFull ? 'button disabled' : 'button';
		const btnAction = isFull ? '' : `name="send" value="/rpg restorepp ${pokemon.id} ${move.id} ${itemId}"`;
		const statusText = isFull ? `<span class="rpg-text-success">Full</span>` : `${move.pp} / ${maxPP}`;

		html += `<button ${btnAction} class="${btnClass}" style="text-align:center; height:auto; padding:8px;" ${isFull ? 'disabled' : ''}>` +
			`<strong>${moveData.name}</strong><br>` +
			`<small>${statusText}</small>` +
			`</button>`;
	}
	html += `</div>`;

	if (!canRestoreAny) {
		html += `<p style="text-align:center; margin-top:10px;">All moves are already at full PP!</p>`;
	}

	html += `<hr /><center><p style="text-align:center"><button name="send" value="/rpg useitem ${itemId}" class="button">Back to Pokémon</button></p></center></div>`;
	return html;
}

export function generateItemUseErrorHTML(message: string, itemId: string): string {
	return `<div class="rpg-infobox rpg-menu-box"><p class="rpg-text-error"><strong>${message}</strong></p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateEvolutionStoneErrorHTML(pokemonSpecies: string, itemId: string): string {
	return `<div class="rpg-infobox rpg-menu-box"><p class="rpg-text-error"><strong>It had no effect... (${pokemonSpecies} is not compatible with this item).</strong></p><p><button name="send" value="/rpg useitem ${itemId}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

// -------------------------------------------------------------------------------------
// 5. Battle UI Helpers
// -------------------------------------------------------------------------------------

function generatePokemonStatusTagsHTML(
	slot: ActivePokemonSlot,
	isDoubleBattle = false,
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
		slot.lockedMoveCounter && slot.lockedMoveCounter > 0 ? '<span class="rpg-tag rpg-tag-rampage">Rampage' + (isDoubleBattle ? '' : ' (' + String(slot.lockedMoveCounter) + ')') + '</span>' : '',
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
				statStageTags += ' <span class="rpg-stat-up">🔼' + stat.toUpperCase() + '</span>';
			} else if (stage < 0) {
				statStageTags += ' <span class="rpg-stat-down">🔽' + stat.toUpperCase() + '</span>';
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
	const switchButton = '<button name="send" value="/rpg battleaction switchmenu" class="button rpg-battle-action-button">🔄 POKÉMON</button>';

	if (battle.battleType === 'battletower') {
		return `<p class="rpg-text-center rpg-margin-top">${switchButton}</p>`;
	}

	const isWild = battle.battleType === 'wild' || battle.battleType === 'wild_double';
	let catchButton = '<button class="button rpg-battle-action-button" disabled>🎒 BAG</button>';
	let runButton = '<button class="button rpg-battle-action-button" disabled>🏃 RUN</button>';

	if (isWild) {
		const canRun = !playerSlot?.isTrapped;
		runButton = canRun ?
			'<button name="send" value="/rpg battleaction run" class="button rpg-battle-action-button">🏃 RUN</button>' :
			'<button class="button rpg-battle-action-button" disabled>🏃 RUN</button>';

		if (battle.battleType === 'wild') {
			catchButton = '<button name="send" value="/rpg battleaction catchmenu" class="button rpg-battle-action-button">🎒 BAG</button>';
		} else if (battle.battleType === 'wild_double') {
			const activeOpponents = getActiveSlots(battle.opponentSlots);
			const canCatch = activeOpponents.length === 1;
			catchButton = canCatch ?
				'<button name="send" value="/rpg battleaction catchmenu" class="button rpg-battle-action-button">🎒 BAG</button>' :
				'<button class="button rpg-battle-action-button" disabled title="Can only catch when one opponent remains">🎒 BAG</button>';
		}
	}

	return `<p class="rpg-text-center rpg-margin-top">${switchButton} ${catchButton} ${runButton}</p>`;
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

			const buttonClasses = 'button rpg-move-button' + (teraActive ? ' rpg-move-button-terastallized' : '');
			const buttonContent = '<div class="rpg-move-name">' + (teraActive ? '⭐ ' : '') + moveData.name + '</div>' +
				'<div class="rpg-move-info">' +
				'<span>' + moveData.type + '</span>' +
				'<span class="rpg-move-pp">' + String(move.pp) + ' / ' + String(moveData.pp) + '</span>' +
				'</div> ';

			const teraParam = teraActive ? ' terastallize' : '';

			const moveCommand = isDoubleBattle ?
				`/rpg battleaction selecttarget ${slotIndex} ${move.id}${teraParam}` :
				`/rpg battleaction move ${slotIndex} ${move.id} 2${teraParam}`;

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

function generateAvailablePokemonListHTML(
	battle: BattleState,
	player: PlayerData,
	commandPrefix: string,
	additionalFilter?: (pokemon: RPGPokemon) => boolean
): string {
	const partyToUse = battle.overridePlayerParty || player.party;

	let availableParty = partyToUse.filter(p =>
		p.hp > 0 &&
		!battle.playerSlots.some(s => s?.pokemon.id === p.id)
	);

	if (additionalFilter) {
		availableParty = availableParty.filter(additionalFilter);
	}

	if (availableParty.length === 0) {
		return `<p>You have no other Pokémon to switch to!</p>`;
	}

	const switchButtons = availableParty.map(pokemon => {
		const species = Dex.species.get(pokemon.species);
		const spriteFilename = getSpriteFilename(species.id);
		const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${spriteFilename}.png`;

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

function generateSharedBattlePokemonInfo(
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
	
function generateGlobalBattleConditionsHTML(battle: BattleState): string {
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

function generateSideEffectTags(battle: BattleState, side: 'player' | 'opponent'): string {
	const effects: string[] = [];
	const reflectTurns = (side === 'player') ? battle.playerReflectTurns : battle.opponentReflectTurns;
	const lightScreenTurns = (side === 'player') ? battle.playerLightScreenTurns : battle.opponentLightScreenTurns;
	const auroraVeilTurns = (side === 'player') ? battle.playerAuroraVeilTurns : battle.opponentAuroraVeilTurns;
	const hazards = (side === 'player') ? battle.playerHazards : battle.opponentHazards;
	const quickGuard = (side === 'player') ? battle.playerQuickGuard : battle.opponentQuickGuard;
	const wideGuard = (side === 'player') ? battle.playerWideGuard : battle.opponentWideGuard;
	const craftyShield = (side === 'player') ? battle.playerCraftyShield : battle.opponentCraftyShield;

	if (reflectTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-reflect">Reflect</span>');
	if (lightScreenTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-lightscreen">Light Screen</span>');
	if (auroraVeilTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-auroraveil">Aurora Veil</span>');
	if (quickGuard) effects.push('<span class="rpg-side-effect-tag rpg-side-quickguard">Quick Guard</span>');
	if (wideGuard) effects.push('<span class="rpg-side-effect-tag rpg-side-wideguard">Wide Guard</span>');
	if (craftyShield) effects.push('<span class="rpg-side-effect-tag rpg-side-craftyshield">Crafty Shield</span>');

	if (hazards.includes('stealthrock')) effects.push('<span class="rpg-side-effect-tag rpg-side-stealthrock">SR</span>');
	const spikes = hazards.filter(h => h === 'spikes').length;
	if (spikes > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-spikes">Spikes ' + String(spikes) + '</span>');
	const toxicSpikes = hazards.filter(h => h === 'toxicspikes').length;
	if (toxicSpikes > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-toxicspikes">TSP ' + String(toxicSpikes) + '</span>');
	if (hazards.includes('stickyweb')) effects.push('<span class="rpg-side-effect-tag rpg-side-stickyweb">Web</span>');

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

function generateBattleActionPanel(battle: BattleState, teraToggled?: boolean): string {
	const isDoubleBattle = battle.battleType.includes('double');
	const [pSlot0, pSlot1] = battle.playerSlots;

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

function generateBattleTargetSelection(battle: BattleState, targetSelection: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
	const [pSlot0, pSlot1] = battle.playerSlots;
	const [oSlot0, oSlot1] = battle.opponentSlots;
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

		return `<button name="send" value="/rpg battleaction move ${String(targetSelection.attackerSlotIndex)} ${targetSelection.moveId} ${String(target.index)}${teraParam}" class="button rpg-move-button">${buttonContent}</button>`;
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


// -------------------------------------------------------------------------------------
// 6. Main Battle UI
// -------------------------------------------------------------------------------------

function generateBattleHeader(battle: BattleState): string {
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

function generateBattlefield(battle: BattleState, targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean }): string {
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
		const species = Dex.species.get(pokemon.species);

		const infoContents = generateSharedBattlePokemonInfo(slot, side === 'player', battle);

		const spriteFilename = getSpriteFilename(species.id);
		let spriteUrl = '';
		let spriteClass = '';

		if (side === 'player') {
			const spriteDir = pokemon.shiny ? 'gen5-back-shiny' : 'gen5-back';
			spriteUrl = `https://play.pokemonshowdown.com/sprites/${spriteDir}/${spriteFilename}.png`;
			spriteClass = 'rpg-pokemon-sprite-back';
		} else {
			const spriteDir = pokemon.shiny ? 'gen5-shiny' : 'gen5';
			spriteUrl = `https://play.pokemonshowdown.com/sprites/${spriteDir}/${spriteFilename}.png`;
			spriteClass = 'rpg-pokemon-sprite-front';
		}

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

	let html = '<div class="rpg-battle-ui">';

	html += generateGlobalBattleConditionsHTML(battle);

	html += '<div class="rpg-opponent-side">';
	html += generateBattleSlot(battle.opponentSlots[0], 2, 'opponent');
	if (isDoubleBattle) {
		html += generateBattleSlot(battle.opponentSlots[1], 3, 'opponent');
	}
	html += '</div>';

	html += '<div class="rpg-player-side">';
	html += generateBattleSlot(battle.playerSlots[0], 0, 'player');
	if (isDoubleBattle) {
		html += generateBattleSlot(battle.playerSlots[1], 1, 'player');
	}
	html += '</div>';

	html += '</div>';
	return html;
}

export function generateBattleHTML(
	battle: BattleState,
	messageLog: string[] = [],
	targetSelection?: { attackerSlotIndex: number, moveId: string, shouldTerastallize?: boolean },
	teraToggled?: boolean
): string {
	const reversedBattleLog = [...battle.battleLog].reverse();
	const combinedLogs = [...messageLog, ...reversedBattleLog];
	
	const historyLogHTML = `<div class="rpg-battle-log">` +
		(combinedLogs.length > 0 ? combinedLogs.join('<br>') : 'Battle started...') +
		`</div>`;

	if (battle.battleEnded) {
		let actionHTML = '';
		if (battle.battleType !== 'battletower') {
			const continueCommand = (battle.battleResult === 'victory') ? '/rpg explore' : '/rpg explore';
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
	let html = `<div class="rpg-infobox"><h2>A Pokémon is switching out!</h2><p>${message}</p>`;
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
	let html = `<div class="rpg-infobox"><h2>Select a Poke Ball</h2>`;
	
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
		const ballButtons = pokeBalls.map(ball => {
			let command = '';
			
			if (isDoubleBattle && activeOpponents.length > 1) {
				command = `/rpg battleaction selectcatchtarget ${ball.id}`;
			} else if (isDoubleBattle && activeOpponents.length === 1) {
				const targetSlot = battle.opponentSlots.indexOf(activeOpponents[0]) + 2;
				command = `/rpg battleaction catch ${ball.id} ${targetSlot}`;
			} else {
				command = `/rpg battleaction catch ${ball.id} 2`;
			}

			const filename = ball.id.replace(/ball$/, '');
			const spriteUrl = `https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/${filename}.png`;

			const buttonContent = 
				`<div class="rpg-switch-icon"><img src="${spriteUrl}" alt="${ball.name}" /></div>` +
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
	html += `<p>Choose which wild Pokémon to throw the ${ITEMS_DATABASE[ballId]?.name || 'Poke Ball'} at:</p>`;

	let hasTargets = false;
	for (let i = 0; i < battle.opponentSlots.length; i++) {
		const slot = battle.opponentSlots[i];
		if (!slot || slot.pokemon.hp <= 0) continue;

		hasTargets = true;
		const slotIndex = i + 2;
		const hpPercent = Math.floor((slot.pokemon.hp / slot.pokemon.maxHp) * 100);
		const statusText = slot.status ? ` (${slot.status.toUpperCase()})` : '';

		html += `<div class="rpg-card">` +
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

export function generateCatchSuccessHTML(
	caughtPokemon: RPGPokemon,
	tempSlot: ActivePokemonSlot,
	location: string,
	zoneId: string,
	wasHealed: boolean
): string {
	let successMessage = `<h2>Gotcha!</h2><div class="rpg-memo-box" style="text-align:center; margin-bottom:10px;"><p><strong>${caughtPokemon.species}</strong> was caught!</p>`;
	if (wasHealed) successMessage += `<p class="rpg-text-success"><small>${caughtPokemon.species} was fully healed!</small></p>`;
	successMessage += `</div>`;

	return `<div class="rpg-infobox">` + 
		`${successMessage}` +
		`${generatePokemonInfoHTML(tempSlot, true)}` +
		`<p style="text-align:center; margin-top:10px;">${caughtPokemon.species} has been sent to ${location}.</p>` +
		`<hr />` +
		`<p style="text-align:center"><button name="send" value="/rpg wildpokemon ${zoneId}" class="button">Find Another</button> ` +
		`<button name="send" value="/rpg explore" class="button">Continue Exploring</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateMultipleOpponentsCatchErrorHTML(): string {
	return `<div class="rpg-infobox rpg-menu-box"><h2>Cannot Catch</h2><p>You can't throw a Poké Ball when there are multiple wild Pokémon!</p><p>Defeat one first, then you can catch the remaining one.</p><p><button name="send" value="/rpg battleaction back" class="button">Back to Battle</button></p></div>`;
}

// -------------------------------------------------------------------------------------
// 7. Battle Tower HTML
// -------------------------------------------------------------------------------------

export function generateBattleTowerWelcomeHTML(floor: number): string {
	let html = `<div class="rpg-infobox"><h2>🗼 Battle Tower</h2>` +
		`<div class="rpg-memo-box" style="margin-bottom:15px;">` +
			`<p><strong>Roguelike Challenge</strong></p>` +
			`<p>Climb as high as you can. Your team is re-rolled every floor.</p>` +
		`</div>` +
		`<h3>Select Format</h3>` +
		`<div class="rpg-scrollable-grid"><div class="rpg-grid-2col">`;

	for (const [formatId, config] of Object.entries(BATTLE_TOWER_FORMATS)) {
		html += `<button name="send" value="/rpg battletower selectformat ${formatId}" class="button" style="height:auto; padding:10px; text-align:left;">` +
			`<strong>${config.name}</strong><br>` +
			`<small class="rpg-text-muted">${config.description}</small>` +
			`</button>`;
	}

	html += `</div></div>` +
		`<p style="text-align:center"><button name="send" value="/rpg start" class="button">Back to Menu</button></p>` +
		`</div>`;
	return html;
}

export function generateBattleTowerFormatSelectedHTML(floor: number, format: string): string {
	const formatConfig = BATTLE_TOWER_FORMATS[format] || BATTLE_TOWER_FORMATS['battlefactory'];
	const btnText = floor > 1 ? `Continue Floor ${floor}` : `Start Floor 1`;

	return `<div class="rpg-infobox"><h2>🗼 ${formatConfig.name}</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
			`<p>Team Size: <strong>${formatConfig.teamSize}</strong> | Level: <strong>${formatConfig.level}</strong></p>` +
			`<p>Current Streak: <strong>${floor - 1} Wins</strong></p>` +
		`</div>` +
		`<p style="text-align:center">` +
			`<button name="send" value="/rpg battletower beginfloor ${format}" class="button rpg-button-large">${btnText}</button>` +
		`</p>` +
		`<p style="text-align:center"><button name="send" value="/rpg battletower start" class="button">Back</button></p>` +
		`</div>`;
}

export function generateBattleTowerFloorCompleteHTML(floor: number): string {
	return `<div class="rpg-infobox"><h2>🗼 Floor ${floor} Cleared!</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
			`<p class="rpg-text-success"><strong>Victory!</strong></p>` +
			`<p>Your team has been healed.</p>` +
			`<p>Preparing new team for the next floor...</p>` +
		`</div>` +
		`<p style="text-align:center">` +
			`<button name="send" value="/rpg battletower nextfloor" class="button">Next Floor (F${floor + 1}) →</button>` +
		`</p>` +
		`</div>`;
}

export function generateBattleTowerLossHTML(floor: number): string {
	return `<div class="rpg-infobox"><h2>🗼 Challenge Failed</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
			`<p class="rpg-text-error"><strong>You were defeated.</strong></p>` +
			`<p>You reached <strong>Floor ${floor}</strong>.</p>` +
		`</div>` +
		`<p style="text-align:center">` +
			`<button name="send" value="/rpg battletower start" class="button">Try Again</button> ` +
			`<button name="send" value="/rpg start" class="button">Exit</button>` +
		`</p>` +
		`</div>`;
}

// -------------------------------------------------------------------------------------
// 8. NPC & Story Progression HTML
// -------------------------------------------------------------------------------------

function generateStarterChoiceBoxHTML(speciesId: string, command: string): string {
	const species = Dex.species.get(speciesId);
	if (!species.exists) return '';
	const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${getSpriteFilename(species.id)}.png`;

	return `<div class="rpg-starter-card">` +
		`<img src="${spriteUrl}" />` +
		`<div class="rpg-starter-info">` +
			`<strong>${species.name}</strong><br>` +
			`<small class="rpg-text-muted">${species.types.join('/')}</small>` +
		`</div>` +
		`<button name="send" value="${command}" class="button">Choose</button>` +
		`</div>`;
}

export function generateStarterSelectionHTML(type: string, starters: string[]): string {
	const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
	let typeDescription = '';
	if (type === 'fire') typeDescription = "Fire-types are passionate and offensive.";
	else if (type === 'water') typeDescription = "Water-types are versatile and adaptable.";
	else if (type === 'grass') typeDescription = "Grass-types are strategic and resilient.";

	let html = `<div class="rpg-infobox">` +
		`<h2>Professor Oak's Lab</h2>` +
		`<div class="rpg-memo-box">` +
			`<p><strong>Oak:</strong> "${typeDescription}"</p>` +
			`<p>Which ${typeTitle}-type Pokémon will you choose?</p>` +
		`</div>` +
		`<div class="rpg-grid-3col" style="margin-top:10px;">`;

	for (const starterId of starters) {
		const command = `/rpg selectstarter ${starterId}`;
		html += generateStarterChoiceBoxHTML(starterId, command);
	}
	
	html += `</div>` +
		`<p style="text-align:center; margin-top:15px;"><button name="send" value="/rpg storymode" class="button">← Back to Type Selection</button></p>` +
		`</div>`;
	return html;
}

export function generateNPCSelectionHTML(availableNPCs: [string, { name: string }][]): string {
	let html = `<div class="rpg-infobox rpg-menu-box"><h2>Talk to NPCs</h2><p>Who would you like to talk to?</p>`;
	for (const [id, npc] of availableNPCs) {
		html += `<button name="send" value="/rpg npc ${id}" class="button">💬 ${npc.name}</button> `;
	}
	html += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += generateBottomNavigation() + `</div>`;
	return html;
}

export function generateNPCStarterChoiceHTML(npcId: string, npcName: string, allStarters: string[]): string {
	let html = `<div class="rpg-infobox">` +
		`<h2>${npcName}</h2>` +
		`<div class="rpg-memo-box" style="margin-bottom: 15px;">` +
			`<p>"The world of Pokémon is vast and wonderful! Before you begin your journey, you'll need a Pokémon partner."</p>` +
			`<p>"I have three Pokémon here that are perfect for beginning trainers. Choose wisely!"</p>` +
		`</div>` +
		`<div class="rpg-grid-3col">`;

	for (const starterId of allStarters) {
		const command = `/rpg starterchoice ${npcId} ${starterId}`;
		html += generateStarterChoiceBoxHTML(starterId, command);
	}

	html += `</div>` +
		`<p class="rpg-margin-top" style="text-align:center">` +
		`<button name="send" value="/rpg npc ${npcId}" class="button">← Back</button>` +
		`</p>` +
		generateBottomNavigation() +
		`</div>`;
		
	return html;
}

export function generateStarterConfirmHTML(tempSlot: ActivePokemonSlot, speciesName: string, startingLocationName: string): string {
	const pokemon = tempSlot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const spriteFilename = getSpriteFilename(species.id);
	const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${spriteFilename}.png`;
	
	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';

	return `<div class="rpg-infobox">` +
		`<h2>Congratulations!</h2>` +
		
		`<div class="rpg-memo-box" style="margin-bottom: 15px;">` +
			`<p><strong>Professor Oak:</strong> "Excellent choice! <strong>${speciesName}</strong> will be a great partner for you."</p>` +
		`</div>` +

		`<div class="rpg-summary-header" style="justify-content: center; border-bottom: none; padding-bottom: 0;">` +
			`<div class="rpg-summary-sprite" style="width: 100px; height: 100px;">` +
				`<img src="${spriteUrl}" style="width: 80px; height: 80px;" />` +
			`</div>` +
			`<div class="rpg-summary-info" style="flex-grow: 0; text-align: left;">` +
				`<h3>${pokemon.nickname || speciesName} ${genderSymbol}${shinySymbol}</h3>` +
				`<p>Level ${pokemon.level} | ${species.types.join('/')}</p>` +
				`<p><small>Nature: ${pokemon.nature} | Ability: ${pokemon.ability}</small></p>` +
			`</div>` +
		`</div>` +

		`<hr />` +

		`<div class="rpg-memo-box" style="text-align: center; font-style: italic; margin-bottom: 15px;">` +
			`<p>Your adventure begins now. Take good care of ${speciesName}!</p>` +
			`<p>Head out into ${startingLocationName} and begin your journey!</p>` +
		`</div>` +

		`<p style="text-align:center">` +
			`<button name="send" value="/rpg explore" class="button rpg-button-large">Begin Your Adventure</button>` +
		`</p>` +
		
		generateBottomNavigation() +
	`</div>`;
}

export function generateNPCStarterConfirmHTML(npcName: string, message: string, tempSlot: ActivePokemonSlot, speciesName: string): string {
	const pokemon = tempSlot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const spriteFilename = getSpriteFilename(species.id);
	const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5/${spriteFilename}.png`;
	
	const shinySymbol = pokemon.shiny ? '<span class="rpg-text-warning">★</span>' : '';
	const genderSymbol = pokemon.gender === 'M' ? '<span class="rpg-text-info">♂</span>' : pokemon.gender === 'F' ? '<span class="rpg-text-error">♀</span>' : '';

	return `<div class="rpg-infobox">` +
		`<h2>Congratulations!</h2>` +
		
		`<div class="rpg-memo-box" style="margin-bottom: 15px;">` +
			`<p><strong>${npcName}:</strong> "${message}"</p>` +
		`</div>` +

		`<div class="rpg-summary-header" style="justify-content: center; border-bottom: none; padding-bottom: 0;">` +
			`<div class="rpg-summary-sprite" style="width: 100px; height: 100px;">` +
				`<img src="${spriteUrl}" style="width: 80px; height: 80px;" />` +
			`</div>` +
			`<div class="rpg-summary-info" style="flex-grow: 0; text-align: left;">` +
				`<h3>${pokemon.nickname || speciesName} ${genderSymbol}${shinySymbol}</h3>` +
				`<p>Level ${pokemon.level} | ${species.types.join('/')}</p>` +
				`<p><small>Nature: ${pokemon.nature} | Ability: ${pokemon.ability}</small></p>` +
			`</div>` +
		`</div>` +

		`<hr />` +

		`<div class="rpg-memo-box" style="text-align: center; font-style: italic; margin-bottom: 15px;">` +
			`<p>You received <strong>${speciesName}</strong>!</p>` +
			`<p>Take good care of your new partner.</p>` +
		`</div>` +

		`<p style="text-align:center">` +
			`<button name="send" value="/rpg explore" class="button rpg-button-large">Continue Adventure</button>` +
		`</p>` +
		
		generateBottomNavigation() +
	`</div>`;
}

// -------------------------------------------------------------------------------------
// 9. New Event & Interaction UI Handlers
// -------------------------------------------------------------------------------------
export function generateScriptedEventHTML(event: any, message: string): string {
	let html = `<div class="rpg-infobox"><h2>${event.name || 'Event'}</h2>`;
	
	// Display the narrative text
	html += `<div class="rpg-memo-box" style="margin-bottom:15px;">`;
	html += `<p>${message}</p>`;
	html += `</div>`;

	// --- Interactive Elements (Choices) ---
	if (event.type === 'choice' && event.choices) {
		html += `<p><strong>Make a choice:</strong></p><div class="rpg-grid-2col">`;
		event.choices.forEach((choice: any, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${choice.text}</button> `;
		});
		html += `</div>`;
	} 
	else if (event.type === 'quiz' && event.answers) {
		html += `<p><strong>Select an answer:</strong></p><div class="rpg-grid-2col">`;
		event.answers.forEach((ans: string, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${ans}</button> `;
		});
		html += `</div>`;
	}
	else if (event.type === 'moralchoice' && event.moralChoices) {
		html += `<div class="rpg-grid-2col">`;
		event.moralChoices.forEach((choice: any, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${choice.text}</button> `;
		});
		html += `</div>`;
	}
	else if (event.type === 'branching' && event.pathOptions) {
		html += `<div class="rpg-grid-2col">`;
		event.pathOptions.forEach((path: any, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${path.name}</button> `;
		});
		html += `</div>`;
	}
	// --- Action Buttons (Battles) ---
	else if (['wildbattle', 'bossbattle', 'raidbattle'].includes(event.type)) {
		// Determine command and button text based on battle type
		let cmd = `/rpg scriptedbattle ${event.id}`;
		let btnText = "⚔️ Battle!";
		
		if (event.type === 'bossbattle' && event.bossTrainerId) {
			// Trainer Bosses use the challenge command
			cmd = `/rpg challenge ${event.bossTrainerId}`;
			btnText = "⚔️ Challenge Boss";
		} else if (event.type === 'raidbattle') {
			// Raid Battles use scriptedbattle but have special text
			btnText = "⚔️ Start Raid";
		}

		html += `<p class="rpg-text-center">`;
		html += `<button name="send" value="${cmd}" class="button rpg-button-large" style="margin-bottom:5px;">${btnText}</button><br>`;
		// Safety "Run Away" button to prevent Soft Locks if player can't/won't fight
		html += `<button name="send" value="/rpg explore" class="button">Run Away</button>`;
		html += `</p>`;
	} 
	else if (['trainer', 'gymchallenge', 'elitefour'].includes(event.type)) {
		const trainerId = event.trainerId || event.gymLeaderId;
		html += `<p class="rpg-text-center">`;
		html += `<button name="send" value="/rpg challenge ${trainerId}" class="button rpg-button-large" style="margin-bottom:5px;">⚔️ Battle!</button><br>`;
		html += `<button name="send" value="/rpg explore" class="button">Run Away</button>`;
		html += `</p>`;
	} 
	// --- Standard Event (No interaction required) ---
	else {
		html += `<p class="rpg-text-center"><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
	}

	html += `</div>`;
	return html;
}

export function generateNPCInteractionHTML(npc: any, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

    if (notification) {
        html += `<div class="rpg-notification">${notification}</div>`;
    }

	html += `<h2>${npc.name}</h2>` +
		`<div class="rpg-memo-box"><p>"${npc.dialogue}"</p></div>`;

	const action = npc.action;

	if (action) {
		html += `<hr />`;
		
		if (action.type === 'itemcraft' && action.recipes) {
			html += `<p><strong>Crafting Recipes:</strong></p><div class="rpg-scrollable-grid">`;
			action.recipes.forEach((recipe: any, index: number) => {
				const itemName = ITEMS_DATABASE[recipe.output.itemId]?.name || recipe.output.itemId;
				const inputs = recipe.inputs.map((i: any) => `${i.quantity}x ${ITEMS_DATABASE[i.itemId]?.name || i.itemId}`).join(', ');
				
				html += `<div class="rpg-party-card" style="margin-bottom:5px; display:block;">`;
				html += `<strong>${itemName}</strong> <small>(${inputs})</small>`;
				html += `<button name="send" value="/rpg npcaction ${npc.id} ${index}" class="button rpg-button-float-right">Craft</button>`;
				html += `</div>`;
			});
			html += `</div>`;
		}
		else if (action.type === 'fossilrevival' && action.fossils) {
			html += `<p><strong>Select a Fossil to Revive:</strong></p><div class="rpg-grid-2col">`;
			action.fossils.forEach((fossilId: string) => {
				const fossilName = ITEMS_DATABASE[fossilId]?.name || fossilId;
				html += `<button name="send" value="/rpg npcaction ${npc.id} ${fossilId}" class="button">🦴 ${fossilName}</button> `;
			});
			html += `</div>`;
		}
		else if (action.type === 'choosestarter') {
			html += `<p class="rpg-text-center"><button name="send" value="/rpg starterchoice ${npc.id}" class="button rpg-button-large">View Starters</button></p>`;
		}
		else {
			let btnText = "Interact";
			if (action.type === 'heal') btnText = "💊 Heal Party";
			else if (action.type === 'giveitem' || action.type === 'givepokemon') btnText = "✅ Accept Offer";
			else if (action.type === 'battlerequest') btnText = "⚔️ Challenge";
			
			html += `<p class="rpg-text-center"><button name="send" value="/rpg npcaction ${npc.id}" class="button">${btnText}</button></p>`;
		}
	}

	html += `<hr /><p class="rpg-text-center"><button name="send" value="/rpg npc" class="button">Talk to Others</button> <button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += generateBottomNavigation() + `</div>`;
	
	return html;
}

export function generatePokedexHTML(player: PlayerData): string {
	const seenCount = player.pokedex ? player.pokedex.seen.size : 0;
	const caughtCount = player.party.length + player.pc.size; 
	
	let html = `<div class="rpg-infobox">` +
		`<h2>Pokédex</h2>` +
		`<div class="rpg-grid-2col" style="text-align:center; margin-bottom:10px;">` +
			`<div class="rpg-memo-box"><strong>Seen</strong><br><span style="font-size:1.5em">${seenCount}</span></div>` +
			`<div class="rpg-memo-box"><strong>Owned</strong><br><span style="font-size:1.5em">${caughtCount}</span></div>` +
		`</div>` +
		`<div class="rpg-memo-box" style="text-align:center;">` +
			`<p><em>(Detailed Pokedex list view is coming soon!)</em></p>` +
		`</div>`;

	html += generateBottomNavigation() + `</div>`;
	return html;
}
