import { Dex, toID } from '../../../sim/dex';
import { getMove, calculateTotalExpForLevel } from './utils';
import { ITEMS_DATABASE } from './items';
import { getShopInventory, getNextShopTier } from './game-shops';
import { BATTLE_TOWER_FORMATS } from './battle-tower';
import { LOCATIONS, ENCOUNTER_ZONES } from './game-locations';
import { TRAINER_DATABASE, TRAINER_LOCATIONS, TOTAL_BADGES } from './game-npcs';
import { GameConfig, STARTER_POKEMON } from './game-config';
import { formatLocationWithTime } from './time-system';
import type { RPGPokemon, PlayerData } from './interface';

function calculateExpBarPercentage(expProgress: number, expNeededForLevel: number): number {
	if (expNeededForLevel <= 0) return 100;
	return Math.min(100, Math.max(0, Math.floor((expProgress / expNeededForLevel) * 100)));
}

function getSpriteFilename(speciesId: string): string {
	let filename = speciesId;
	if (filename.endsWith('mega')) filename = filename.replace(/mega$/, '-mega');
	else if (filename.endsWith('megax')) filename = filename.replace(/megax$/, '-megax');
	else if (filename.endsWith('megay')) filename = filename.replace(/megay$/, '-megay');

	const regionalFormSuffixes = ['alola', 'galar', 'hisui', 'paldea', 'alolan', 'galarian', 'hisuian', 'paldean'];
	for (const suffix of regionalFormSuffixes) {
		if (filename.endsWith(suffix) && filename.length > suffix.length && !filename.includes('-' + suffix)) {
			filename = filename.slice(0, -suffix.length) + '-' + suffix;
			break;
		}
	}
	if (filename.endsWith('gmax')) filename = filename.replace(/gmax$/, '-gmax');
	if (filename.endsWith('f')) filename = filename.replace(/f$/, '-f');

	const hyphenatedForms: Record<string, string> = {
		'taurospaldeacombat': 'tauros-paldea-combat',
		'taurospaldeablaze': 'tauros-paldea-blaze',
		'taurospaldeaaqua': 'tauros-paldea-aqua',
		'palafinhero': 'palafin-hero',
		'gimmighoulroaming': 'gimmighoul-roaming',
		'gholdengochest': 'gholdengo-chest',
		'koraidonapex': 'koraidon-apex',
		'koraidonlimited': 'koraidon-limited',
		'miraidonapex': 'miraidon-apex',
		'miraidonlimited': 'miraidon-limited',
		'ogerponwellspring': 'ogerpon-wellspring',
		'ogerponhearthflame': 'ogerpon-hearthflame',
		'ogerponcornerstone': 'ogerpon-cornerstone',
		'ogerponteal': 'ogerpon-teal',
		'ogerponwellspringtera': 'ogerpon-wellspringtera',
		'ogerponhearthflametera': 'ogerpon-hearthflametera',
		'ogerponcornerstonetera': 'ogerpon-cornerstonetera',
		'ogerpontealtera': 'ogerpon-tealtera',
		'ursalunabloodmoon': 'ursaluna-bloodmoon',
		'cramorantgorging': 'cramorant-gorging',
		'cramorantgulping': 'cramorant-gulping',
		'zaciancrowned': 'zacian-crowned',
		'zamazentacrowned': 'zamazenta-crowned',
		'urshifusinglestrike': 'urshifu-singlestrike',
		'urshifurapidstrike': 'urshifu-rapidstrike',
		'eternatuseternamax': 'eternatus-eternamax',
		'lycanrocdusk': 'lycanroc-dusk',
		'lycanrocmidnight': 'lycanroc-midnight',
		'lycanrocmidday': 'lycanroc-midday',
		'rockruffowtempo': 'rockruff-own-tempo',
		'miniorviolet': 'minior-violet',
		'miniorindigo': 'minior-indigo',
		'miniorblue': 'minior-blue',
		'miniorgreen': 'minior-green',
		'miniororange': 'minior-orange',
		'miniorred': 'minior-red',
		'minioryellow': 'minior-yellow',
		'miniormeteor': 'minior-meteor',
		'typenull': 'type:null',
		'silvallybug': 'silvally-bug',
		'silvallydark': 'silvally-dark',
		'silvallydragon': 'silvally-dragon',
		'silvallyelectric': 'silvally-electric',
		'silvallyfairy': 'silvally-fairy',
		'silvallyfighting': 'silvally-fighting',
		'silvallyfire': 'silvally-fire',
		'silvallyflying': 'silvally-flying',
		'silvallyghost': 'silvally-ghost',
		'silvallygrass': 'silvally-grass',
		'silvallyground': 'silvally-ground',
		'silvallyice': 'silvally-ice',
		'silvallypoison': 'silvally-poison',
		'silvallypsychic': 'silvally-psychic',
		'silvallyrock': 'silvally-rock',
		'silvallysteel': 'silvally-steel',
		'silvallywater': 'silvally-water',
		'wishiwashischool': 'wishiwashi-school',
		'kyuremblack': 'kyurem-black',
		'kyuremwhite': 'kyurem-white',
		'necrozmaduskmane': 'necrozma-duskmane',
		'necrozmadawnwings': 'necrozma-dawnwings',
		'necrozmaultra': 'necrozma-ultra',
		'dialgaorigin': 'dialga-origin',
		'palkiaorigin': 'palkia-origin',
		'giratinaorigin': 'giratina-origin',
		'giratinaaltered': 'giratina-altered',
		'arceusbug': 'arceus-bug',
		'arceusdark': 'arceus-dark',
		'arceusdragon': 'arceus-dragon',
		'arceuselectric': 'arceus-electric',
		'arceusfairy': 'arceus-fairy',
		'arceusfighting': 'arceus-fighting',
		'arceusfire': 'arceus-fire',
		'arceusflying': 'arceus-flying',
		'arceusghost': 'arceus-ghost',
		'arceusgrass': 'arceus-grass',
		'arceusground': 'arceus-ground',
		'arceusice': 'arceus-ice',
		'arceusnormal': 'arceus-normal',
		'arceuspoison': 'arceus-poison',
		'arceuspsychic': 'arceus-psychic',
		'arceusrock': 'arceus-rock',
		'arceussteel': 'arceus-steel',
		'arceuswater': 'arceus-water',
		'basculinwhitemale': 'basculin-whitestriped',
		'basculinwhitestriped': 'basculin-whitestriped',
		'basculinbluestriped': 'basculin-bluestriped',
		'basculegionf': 'basculegion-f',
		'basculegionmale': 'basculegion-m',
		'enamorusincarnate': 'enamorus-incarnate',
		'enamorustherian': 'enamorus-therian',
		'landorusincarnate': 'landorus-incarnate',
		'landorustherian': 'landorus-therian',
		'thundurusincarnate': 'thundurus-incarnate',
		'thundurustherian': 'thundurus-therian',
		'tornadusincarnate': 'tornadus-incarnate',
		'tornadustherian': 'tornadus-therian',
		'darmanitangalarzen': 'darmanitan-galarzen',
		'darmanitanzen': 'darmanitan-zen',
		'darmanitanstandard': 'darmanitan-standard',
		'aegislashblade': 'aegislash-blade',
		'meloettapirouette': 'meloetta-pirouette',
		'castformsunny': 'castform-sunny',
		'castformrainy': 'castform-rainy',
		'castformsnowy': 'castform-snowy',
		'rotomfan': 'rotom-fan',
		'rotomfrost': 'rotom-frost',
		'rotomheat': 'rotom-heat',
		'rotommow': 'rotom-mow',
		'rotomwash': 'rotom-wash',
		'genesectdouse': 'genesect-douse',
		'genesectshock': 'genesect-shock',
		'genesectburn': 'genesect-burn',
		'genesectchill': 'genesect-chill',
		'shayminsky': 'shaymin-sky',
		'zygardecomplete': 'zygarde-complete',
		'zygarde10': 'zygarde-10',
		'toxtricitylowkey': 'toxtricity-low-key',
		'indeedeeunbound': 'indeedee-f',
		'alcremiecaramelswirl': 'alcremie-caramelswirl',
		'alcremielemoncream': 'alcremie-lemoncream',
		'alcremiematchacream': 'alcremie-matchacream',
		'alcremiemintcream': 'alcremie-mintcream',
		'alcremierainbowswirl': 'alcremie-rainbowswirl',
		'alcremierubycream': 'alcremie-rubycream',
		'alcremierubyswirl': 'alcremie-rubyswirl',
		'alcremiesaltedcream': 'alcremie-saltedcream',
		'greninjaash': 'greninja-ash',
		'hoopaunbound': 'hoopa-unbound',
		'keldeoResolute': 'keldeo-resolute',
		'keldeoresolute': 'keldeo-resolute',
		'magearnaboth': 'magearna-original',
		'magearnaoriginal': 'magearna-original',
		'magearnaPokeball': 'magearna-pokeball',
		'maownthgalar': 'meowth-galar',
		'morpekohangry': 'morpeko-hangry',
		'pichuspiky': 'pichu-spikyeared',
		'pikachualola': 'pikachu-alola',
		'pikachubelle': 'pikachu-belle',
		'pikachucosplay': 'pikachu-cosplay',
		'pikachuhoenn': 'pikachu-hoenn',
		'pikachukalos': 'pikachu-kalos',
		'pikachulibre': 'pikachu-libre',
		'pikachuoriginal': 'pikachu-original',
		'pikachupartner': 'pikachu-partner',
		'pikachuphd': 'pikachu-phd',
		'pikachupopstar': 'pikachu-popstar',
		'pikachurockstar': 'pikachu-rockstar',
		'pikachusinnoh': 'pikachu-sinnoh',
		'pikachustarter': 'pikachu-starter',
		'pikachuunova': 'pikachu-unova',
		'pikachuworld': 'pikachu-world',
		'eeveestarter': 'eevee-starter',
		'gourgeistlarge': 'gourgeist-large',
		'gourgeistsmall': 'gourgeist-small',
		'gourgeistsuper': 'gourgeist-super',
		'pumpkaboolarge': 'pumpkaboo-large',
		'pumpkaboosmall': 'pumpkaboo-small',
		'pumpkaboosuper': 'pumpkaboo-super',
		'oricoriopau': 'oricorio-pau',
		'oricoriopompom': 'oricorio-pompom',
		'oricoriosensu': 'oricorio-sensu',
		'deerlingautumn': 'deerling-autumn',
		'deerlingspring': 'deerling-spring',
		'deerlingsummer': 'deerling-summer',
		'deerlingwinter': 'deerling-winter',
		'sawsbuckautumn': 'sawsbuck-autumn',
		'sawsbuckspring': 'sawsbuck-spring',
		'sawsbuckummer': 'sawsbuck-summer',
		'sawsbuckwinter': 'sawsbuck-winter',
		'floetteblue': 'floette-blue',
		'floetteorange': 'floette-orange',
		'floettewhite': 'floette-white',
		'floetteyellow': 'floette-yellow',
		'floetteeternal': 'floette-eternal',
		'floetteeternalflower': 'floette-eternalflower',
		'florgesblue': 'florges-blue',
		'florgesorange': 'florges-orange',
		'florgeswhite': 'florges-white',
		'florgesyellow': 'florges-yellow',
		'flabebeblue': 'flabebe-blue',
		'flabebeorange': 'flabebe-orange',
		'flabebewhite': 'flabebe-white',
		'flabebeyellow': 'flabebe-yellow',
		'vivillonarchipelago': 'vivillon-archipelago',
		'vivilloncontinental': 'vivillon-continental',
		'vivillonelegant': 'vivillon-elegant',
		'vivillongarden': 'vivillon-garden',
		'vivillonhighplains': 'vivillon-high-plains',
		'vivillonicysnow': 'vivillon-icy-snow',
		'vivillonjungle': 'vivillon-jungle',
		'vivillonmarine': 'vivillon-marine',
		'vivillonmeadow': 'vivillon-meadow',
		'vivillonmodern': 'vivillon-modern',
		'vivillonmonsoon': 'vivillon-monsoon',
		'vivillonocean': 'vivillon-ocean',
		'vivillonpokeball': 'vivillon-pokeball',
		'vivillonpolar': 'vivillon-polar',
		'vivillonriver': 'vivillon-river',
		'vivillonsandstorm': 'vivillon-sandstorm',
		'vivillonsavanna': 'vivillon-savanna',
		'vivillonsun': 'vivillon-sun',
		'vivillontundra': 'vivillon-tundra',
		'vivillonfancy': 'vivillon-fancy',
		'gastrodoneast': 'gastrodon-east',
		'gastrodonwest': 'gastrodon-west',
		'shelloseast': 'shellos-east',
		'shelloswest': 'shellos-west',
		'burmyplant': 'burmy-plant',
		'burmysandy': 'burmy-sandy',
		'burmytrash': 'burmy-trash',
		'wormadamplant': 'wormadam-plant',
		'wormadamsandy': 'wormadam-sandy',
		'wormadamtrash': 'wormadam-trash',
		'deoxysattack': 'deoxys-attack',
		'deoxysdefense': 'deoxys-defense',
		'deoxysspeed': 'deoxys-speed',
		'deoxysrs': 'deoxys-rs',
		'cherrimbsunshine': 'cherrim-sunshine',
		'cherrimmovercast': 'cherrim-overcast',
		'mimikytbusted': 'mimikyu-busted',
		'eiscuenoice': 'eiscue-noice',
		'calyrexice': 'calyrex-ice',
		'calyrexshadow': 'calyrex-shadow',
		'mudshotsthree': 'maushold-four',
		'poltchageistartisan': 'poltchageist-artisan',
		'polteageistantique': 'polteageist-antique',
		'polteageistchipped': 'polteageist-chipped',
		'dudunsparce3': 'dudunsparce-threesegment',
		'dudunsparcethreesegment': 'dudunsparce-threesegment',
		'groudonprimal': 'groudon-primal',
		'kyogreprimal': 'kyogre-primal',
	};

	if (hyphenatedForms[filename]) filename = hyphenatedForms[filename];
	if (filename.endsWith('f') && filename.length > 1 && !filename.includes('-f')) filename = filename.slice(0, -1) + '-f';
	filename = filename.replace(/\+/g, '-').replace(/-{2,}/g, '-');
	return filename;
}

export function getSpriteUrl(pokemon: RPGPokemon, facing: 'front' | 'back' = 'front'): string {
	const species = Dex.species.get(pokemon.species);
	const filename = getSpriteFilename(species.id);
	const shiny = pokemon.shiny;

	if (facing === 'front') {
		const base = shiny ? GameConfig.assets.shinySpriteBaseUrl : GameConfig.assets.spriteBaseUrl;
		return `${base}${filename}.png`;
	} else {
		const base = shiny ? GameConfig.assets.shinySpriteBackUrl : GameConfig.assets.spriteBackUrl;
		return `${base}${filename}.png`;
	}
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
		{ id: 'stone', name: 'Stones' },
		{ id: 'tm', name: 'TMs' },
		{ id: 'key', name: 'Key Items' },
		{ id: 'misc', name: 'Misc.' },
	];

	let html = '<div class="rpg-margin-top">';
	for (const category of categories) {
		const command = category.id ? `${baseCommand} ${toID(category.id)}` : baseCommand;
		html += `<button name="send" value="${command}" class="button">${category.name}</button> `;
	}
	html += '</div>';
	return html;
}

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

export function generateHPBar(pokemon: RPGPokemon): string {
	const hpPercentage = Math.max(0, Math.floor((pokemon.hp / pokemon.maxHp) * 100));
	const hpClass = hpPercentage > 50 ? 'rpg-hp-high' : hpPercentage > 25 ? 'rpg-hp-mid' : 'rpg-hp-low';

	return `<div class="rpg-hp-bar">` +
		`<div class="rpg-hp-bar-inner ${hpClass}" style="width: ${hpPercentage}%;"></div>` +
		`<div class="rpg-hp-bar-text">HP: ${pokemon.hp}/${pokemon.maxHp}</div>` +
		`</div>`;
}

export function generateExpBar(pokemon: RPGPokemon): string {
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
	if (notification) html += `<div class="rpg-notification">${notification}</div>`;

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
		`<p><strong>Location:</strong><br>${formatLocationWithTime(player.location)}</p>` +
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

export function generateModeSelectionHTML(): string {
	const html = `<div class="rpg-infobox"><h2>Select a Mode</h2>` +
		`<p>Choose a game mode to begin:</p>` +
		`<div class="rpg-grid-2col">` +
		`<button name="send" value="/rpg storymode" class="button" style="height:auto; padding:15px;">` +
		`<span style="font-size:2em">📖</span><br><strong>Story Mode</strong><br><small>The classic adventure</small>` +
		`</button>` +
		`<button name="send" value="/rpg battletower start" class="button" style="height:auto; padding:15px;">` +
		`<span style="font-size:2em">🗼</span><br><strong>Battle Tower</strong><br><small>Roguelike challenge</small>` +
		`</button>` +
		`</div>` +
		`</div>`;
	return html;
}

export function generateStoryModeStartHTML(): string {
	const startLocId = GameConfig.startLocationId;
	const location = LOCATIONS[startLocId];

	let labBuildingId = '';
	if (location?.buildings) {
		for (const building of location.buildings) {
			if (building.type === 'lab') {
				labBuildingId = building.id;
				break;
			}
		}
	}

	return `<div class="rpg-infobox">` +
		`<h2>Welcome to ${formatLocationWithTime(location.name)}!</h2>` +
		`<div class="rpg-memo-box" style="text-align:center; margin-bottom:15px;">` +
		`<p>Your adventure is about to begin.</p>` +
		`<p>To get your first Pokémon partner, head to the lab!</p>` +
		`</div>` +
		`<p style="text-align:center">` +
		(labBuildingId ? `<button name="send" value="/rpg building ${toID(labBuildingId)}" class="button">🔬 Enter the Lab</button> ` : '') +
		`<button name="send" value="/rpg explore" class="button">🗺️ Explore ${location.name}</button>` +
		`</p>` +
		`</div>`;
}

export function generateExploreHTML(player: PlayerData, location: any, notification?: string): string {
	let html = `<div class="rpg-infobox">`;

	if (notification) html += `<div class="rpg-notification">${notification}</div>`;

	html += `<div class="rpg-text-center">` +
		`<h2><b>${formatLocationWithTime(location.name)}</b></h2>` +
		`<p><em>${location.description || ''}</em></p>` +
		`</div>`;

	const btnStyle = 'margin: 3px;';
	const availableZones = location.encounterZones || [];
	if (availableZones.length > 0) {
		html += `<hr /><strong>Wild Pokémon:</strong><br><p class="rpg-text-center">`;
		for (const zoneId of availableZones) {
			const zone = ENCOUNTER_ZONES[zoneId];
			if (zone) {
				const icon = zone.battleType === 'double' ? '👥' : '🌿';

				html += `<button name="send" value="/rpg wildpokemon ${toID(zoneId)}" class="button" style="${btnStyle}">${icon} ${zone.name}</button>`;
			}
		}
		html += `</p>`;
	}

	if (location.buildings && location.buildings.length > 0) {
		html += `<hr /><strong>Buildings:</strong><br><p class="rpg-text-center">`;
		for (const building of location.buildings) {
			// Buildings explicitly marked accessible: false are still hidden/skipped
			if (building.accessible === false) continue;

			let icon = '🏠';
			if (building.type === 'pokecenter') icon = '🏥';
			else if (building.type === 'pokemart') icon = '🏪';
			else if (building.type === 'gym') icon = '⚔️';
			else if (building.type === 'lab') icon = '🔬';
			else if (building.type === 'department') icon = '🏬';
			else if (building.type === 'gameCorner') icon = '🎰';

			// Always render as a clickable button.
			// Validation happens in the /rpg building command handler.
			html += `<button name="send" value="/rpg building ${toID(building.id)}" class="button" style="${btnStyle}">${icon} ${building.name}</button>`;
		}
		html += `</p>`;
	}

	const locationId = toID(location.name);
	const locationTrainers = TRAINER_LOCATIONS[locationId];
	if (locationTrainers && locationTrainers.length > 0) {
		const availableTrainers = locationTrainers.filter(tid => {
			if (player.defeatedTrainers.has(tid)) return false;

			// Check flags for Roaming Trainers
			const trainer = TRAINER_DATABASE[tid];
			if (!trainer) return false;

			if (trainer.requiredFlag) {
				const req = Array.isArray(trainer.requiredFlag) ? trainer.requiredFlag : [trainer.requiredFlag];
				if (!req.every(f => player.storyFlags.has(f))) return false;
			}
			if (trainer.preventIfFlag) {
				const prev = Array.isArray(trainer.preventIfFlag) ? trainer.preventIfFlag : [trainer.preventIfFlag];
				if (prev.some(f => player.storyFlags.has(f))) return false;
			}
			if (trainer.requiredBadge) {
				const reqB = Array.isArray(trainer.requiredBadge) ? trainer.requiredBadge : [trainer.requiredBadge];
				if (!reqB.every(b => player.obtainedBadges.includes(b))) return false;
			}
			return true;
		});

		if (availableTrainers.length > 0) {
			html += `<hr /><strong>Trainers:</strong><br><p class="rpg-text-center">`;
			for (const trainerId of availableTrainers) {
				const trainerData = TRAINER_DATABASE[trainerId];
				if (trainerData) {
					html += `<button name="send" value="/rpg challenge ${toID(trainerId)}" class="button" style="${btnStyle}">🥊 ${trainerData.name}</button>`;
				}
			}
			html += `</p>`;
		}
	}

	if (location.connectedLocations && location.connectedLocations.length > 0) {
		html += `<hr /><strong>Travel:</strong><br><p class="rpg-text-center">`;
		for (const connection of location.connectedLocations) {
			// Always render as a clickable button.
			// Validation happens in the /rpg travel command handler.
			html += `<button name="send" value="/rpg travel ${toID(connection.id)}" class="button" style="${btnStyle}">➡️ ${connection.name}</button>`;
		}
		html += `</p>`;
	}

	html += generateBottomNavigation() + `</div>`;
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

export function generateDBLoadNoSaveHTML(): string {
	return `<div class="rpg-infobox">` +
		`<h2>No Save Found</h2>` +
		`<div class="rpg-memo-box" style="text-align:center;">` +
		`<p>You don't have a saved game in the database yet.</p>` +
		`<p>Use the <strong>Save Game</strong> button on your profile first.</p>` +
		`</div>` +
		`<p style="text-align:center"><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBDeleteNoSaveHTML(): string {
	return `<div class="rpg-infobox">` +
		`<h2>No Save Found</h2>` +
		`<div class="rpg-memo-box" style="text-align:center;">` +
		`<p>You don't have a saved game to delete.</p>` +
		`</div>` +
		`<p style="text-align:center"><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
}

export function generateDBDeleteSuccessHTML(): string {
	return `<div class="rpg-infobox">` +
		`<h2>Save Deleted</h2>` +
		`<div class="rpg-memo-box" style="text-align:center;">` +
		`<p>Your database save file has been deleted.</p>` +
		`<p><small>Your current session is still active in memory.</small></p>` +
		`</div>` +
		`<p style="text-align:center"><button name="send" value="/rpg profile" class="button">Back to Profile</button></p>` +
		generateBottomNavigation() +
		`</div>`;
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

export function generateSideEffectTags(battle: BattleState, side: 'player' | 'opponent'): string {
	const effects: string[] = [];
	const reflectTurns = (side === 'player') ? battle.playerSide.reflectTurns : battle.opponentSide.reflectTurns;
	const lightScreenTurns = (side === 'player') ? battle.playerSide.lightScreenTurns : battle.opponentSide.lightScreenTurns;
	const auroraVeilTurns = (side === 'player') ? battle.playerSide.auroraVeilTurns : battle.opponentSide.auroraVeilTurns;
	const mistTurns = (side === 'player') ? battle.playerSide.mistTurns : battle.opponentSide.mistTurns;
	const tailwindTurns = (side === 'player') ? battle.playerSide.tailwindTurns : battle.opponentSide.tailwindTurns;

	const hazards = (side === 'player') ? battle.playerSide.hazards : battle.opponentSide.hazards;
	const quickGuard = (side === 'player') ? battle.playerSide.quickGuard : battle.opponentSide.quickGuard;
	const wideGuard = (side === 'player') ? battle.playerSide.wideGuard : battle.opponentSide.wideGuard;
	const craftyShield = (side === 'player') ? battle.playerSide.craftyShield : battle.opponentSide.craftyShield;

	if (reflectTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-reflect">Reflect</span>');
	if (lightScreenTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-lightscreen">Light Screen</span>');
	if (auroraVeilTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-auroraveil">Aurora Veil</span>');
	if (mistTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-mist">Mist</span>');
	if (tailwindTurns > 0) effects.push('<span class="rpg-side-effect-tag rpg-side-tailwind">Tailwind</span>');
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

export function generatePokemonStatusTagsHTML(
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
		slot.lockedMove && slot.lockedMoveCounter === 0 && slot.uproarTurns === 0 ? '<span class="rpg-tag rpg-tag-locked">Locked' + (isDoubleBattle ? '' : ' (' + slot.lockedMove + ')') + '</span>' : '',
		slot.mustRecharge ? '<span class="rpg-tag rpg-tag-must-recharge">Must Recharge</span>' : '',
		slot.isProtected ? '<span class="rpg-tag rpg-tag-protected">Protected</span>' : '',
		slot.isRedirecting ? '<span class="rpg-tag rpg-tag-attention">Center of Attention</span>' : '',
		slot.isHelped ? '<span class="rpg-tag rpg-tag-helped">Helped</span>' : '',
		slot.terastallized ? '<span class="rpg-tag rpg-tag-tera">⭐ Tera: ' + slot.terastallized + '</span>' : '',

		// --- NEW MECHANICS TAGS ---
		// Perish Song (Visual countdown)
		slot.perishSongCounter && slot.perishSongCounter > 0 ? `<span class="rpg-tag rpg-tag-perish">Perish (${slot.perishSongCounter})</span>` : '',

		// Commander (Tatsugiri / Dondozo interaction)
		(slot as any).commanderActive ? '<span class="rpg-tag rpg-tag-commander">Commanding</span>' : '',
		(slot as any).commanderBoost ? '<span class="rpg-tag rpg-tag-commander">Commander Boost</span>' : '',

		// Disguise (Mimikyu)
		slot.isDisguised ? '<span class="rpg-tag rpg-tag-disguise">Disguised</span>' : '',

		// Gulp Missile (Cramorant forms)
		(slot as any).gulpMissileForm === 'gulping' ? '<span class="rpg-tag rpg-tag-gulping">Gulping</span>' : '',
		(slot as any).gulpMissileForm === 'gorging' ? '<span class="rpg-tag rpg-tag-gorging">Gorging</span>' : '',

		// --- TIER 1 MOVE TAGS ---
		slot.isAttracted ? '<span class="rpg-tag rpg-tag-infatuated">💕 Infatuated</span>' : '',
		slot.destinyBondActive ? '<span class="rpg-tag rpg-tag-destiny-bond">Destiny Bond</span>' : '',
		slot.grudgeActive ? '<span class="rpg-tag rpg-tag-grudge">Grudge</span>' : '',
	].filter(Boolean).join('');

	const abilityTags = [
		slot.flashFireBoost ? '<span class="rpg-tag rpg-tag-flash-fire">Fire Boost</span>' : '',
		slot.analyticBoost ? '<span class="rpg-tag rpg-tag-analytic">Analytic</span>' : '',
		slot.slowStartTurns !== undefined && slot.slowStartTurns > 0 ? '<span class="rpg-tag rpg-tag-slow-start">Slow Start (' + String(slot.slowStartTurns) + ')</span>' : '',
		slot.unburdenActive ? '<span class="rpg-tag rpg-tag-unburden">Unburden</span>' : '',

		// --- PARADOX ABILITIES ---
		// Quark Drive (Future)
		(slot as any).boosterEnergyActive && pokemon.species.includes('Iron') ? '<span class="rpg-tag rpg-tag-quark">Quark Drive</span>' : '',
		// Protosynthesis (Ancient)
		(slot as any).boosterEnergyActive && !pokemon.species.includes('Iron') ? '<span class="rpg-tag rpg-tag-proto">Protosynthesis</span>' : '',
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
		const isPlayerSide = battle.playerSide.slots.some(s => s?.pokemon.id === pokemon.id);
		const sideEffectTags = generateSideEffectTags(battle, isPlayerSide ? 'player' : 'opponent');
		battleConditionTags = [sideEffectTags].filter(Boolean).join('');
	}

	return [statusTag, volatileTags, abilityTags, chargingTag, statStageTags, battleConditionTags].filter(Boolean).join('');
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

export function generatePCHTML(player: PlayerData, notification?: string, returnCommand = '/rpg explore'): string {
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
		`<p style="text-align:center">` +
		`<button name="send" value="/rpg party" class="button">View Party</button> ` +
		`<button name="send" value="${returnCommand}" class="button">Exit PC</button>` +
		`</p>` +
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
	const spriteUrl = getSpriteUrl(pokemon, 'front');

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

	const backButton = backLocation === 'pc' ?
		`<button name="send" value="/rpg pc" class="button">← Back to PC</button>` :
		`<button name="send" value="/rpg party" class="button">← Back to Party</button>`;

	const html = `<div class="rpg-infobox">` +
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
		html += `<button name="send" value="/rpg learneggmove ${pokemon.id} ${toID(moveId)}" class="button" style="padding:8px; height:auto;">` +
			`<strong>${move.name}</strong><br>` +
			`<small>${move.type} | Power: ${move.basePower || '-'}</small>` +
			`</button> `;
	}

	html += `</div>` +
		`<hr /><p style="text-align:center"><button name="send" value="/rpg items" class="button">Cancel</button></p>` +
		`</div>`;
	return html;
}

export function generateInventoryHTML(player: PlayerData, category?: string): string {
	let html = `<div class="rpg-infobox">` +
		`<h2>Inventory</h2>` +
		`<p><strong>Money:</strong> ₽${player.money}</p>`;

	html += generateItemCategoryFilters('/rpg items');

	let itemsFound = false;
	let gridHTML = `<br><div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const [itemId, item] of player.inventory) {
		if (!category || item.category === category || category === '') {
			itemsFound = true;

			const safeId = toID(itemId);

			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
				`<div class="rpg-item-details">` +
				`<strong>${item.name}</strong><br>` +
				`<small>Qty: ${item.quantity}</small>` +
				`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
				`<button name="send" value="/rpg useitem ${safeId}" class="button">Use</button> ` +
				`<button name="send" value="/rpg giveitem" class="button">Give</button>` +
				`</div>` +
				`</div>`;
			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
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

export function generateShopHTML(player: PlayerData, category?: string, notification?: string, returnCommand = '/rpg explore'): string {
	const locationId = toID(player.location);
	const shopInventory = getShopInventory(locationId, player.badges);
	const nextTier = getNextShopTier(locationId, player.badges);

	let html = `<div class="rpg-infobox">`;

	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>Poké Mart - ${formatLocationWithTime(player.location)}</h2>` +
		`<p><strong>Money:</strong> ₽${player.money} | <strong>Badges:</strong> ${player.badges}/${TOTAL_BADGES}</p>`;

	if (nextTier) {
		html += `<p class="rpg-text-muted"><small>🔒 ${nextTier.itemCount} more items will unlock with ${nextTier.requiredBadges} badges</small></p>`;
	}

	html += `<p><button name="send" value="/rpg sell" class="button rpg-button-sell">Go to Sell Menu</button></p>`;
	html += generateItemCategoryFilters('/rpg shop');

	let itemsFound = false;
	let gridHTML = `<br><div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const itemId of shopInventory) {
		const item = ITEMS_DATABASE[itemId];
		const price = item?.price || 0;
		if (!item || !price) continue;

		if (!category || item.category === category || category === '') {
			itemsFound = true;
			const safeId = toID(itemId);

			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
				`<div class="rpg-item-details">` +
				`<strong>${item.name}</strong><br>` +
				`<span class="rpg-text-info">₽${price}</span>` +
				`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
				`<button name="send" value="/rpg buy ${safeId} 1" class="button">Buy 1</button> ` +
				`<button name="send" value="/rpg buy ${safeId} 10" class="button">Buy 10</button>` +
				`</div>` +
				`</div>`;

			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	gridHTML += '</div></div>';

	if (itemsFound) {
		html += gridHTML;
	} else {
		html += `<p>No items found in this category.</p>`;
	}

	html += `<hr><center><p class="rpg-margin-top"><button name="send" value="${returnCommand}" class="button">Leave Shop</button></p></center>`;
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
	let gridHTML = `<div class="rpg-scrollable-grid"><div class="rpg-grid-3col-items">`;
	let count = 0;

	for (const [id, item] of player.inventory) {
		const itemData = ITEMS_DATABASE[id];
		const purchasePrice = itemData?.price || 0;

		if (purchasePrice && item.category !== 'key') {
			const sellPrice = Math.floor(purchasePrice / 2);
			sellableItems++;
			const safeId = toID(id);

			const cellContent = `<div class="rpg-item-container">` +
				`<div class="rpg-item-header">` +
				`<div class="rpg-item-details">` +
				`<strong>${item.name}</strong> (x${item.quantity})<br>` +
				`<small>Sell: ₽${sellPrice}</small>` +
				`</div>` +
				`</div>` +
				`<div class="rpg-item-actions">` +
				`<button name="send" value="/rpg sell ${safeId} 1" class="button">Sell 1</button> ` +
				(item.quantity >= 10 ? `<button name="send" value="/rpg sell ${safeId} 10" class="button">Sell 10</button>` : '') +
				`</div>` +
				`</div>`;

			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
	gridHTML += '</div></div>';

	if (sellableItems > 0) {
		html += gridHTML;
	} else {
		html += `<p>You have no valuable items to sell.</p>`;
	}

	html += `<p class="rpg-margin-top"><button name="send" value="/rpg shop" class="button">Back to Shop</button></p></div>`;
	return html;
}

function generateSelectionCard(pokemon: RPGPokemon, actionButton: string, details = ''): string {
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

	const itemData = ITEMS_DATABASE[itemId];
	const eff = itemData?.effects || {};

	for (const pokemon of player.party) {
		let show = false;
		let details = '';

		if (eff.revive && pokemon.hp <= 0) {
			show = true;
			details = `<span class="rpg-text-error">Fainted</span>`;
		} else if ((eff.healAmount || eff.healPercent) && pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
			show = true;
		} else if (eff.statusCure && pokemon.hp > 0 && pokemon.status) {
			show = true;
			details = `<span class="rpg-text-error">${pokemon.status.toUpperCase()}</span>`;
		} else if ((eff.ppRestore || eff.ppRestoreAll) && pokemon.hp > 0) {
			show = true;
		} else if (eff.evBoost && pokemon.hp > 0) {
			const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
			if (totalEVs < 510) { show = true; details = `EVs: ${totalEVs}/510`; }
		}

		if (show) {
			const btn = `<button name="send" value="/rpg useitem ${toID(itemId)} ${pokemon.id}" class="button">Use Here</button>`;
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

		const itemData = ITEMS_DATABASE[itemId];
		if (itemData?.effects?.levelBoost || itemData?.effects?.expBoost) {
			if (pokemon.level >= GameConfig.levelCap) canUse = false;
			details = `${pokemon.experience} / ${pokemon.expToNextLevel} EXP`;
		}
		if (itemData?.effects?.canTerastallize) {
			details = `Tera: ${pokemon.teraType}`;
		}

		if (canUse) {
			const btn = `<button name="send" value="/rpg useitem ${toID(itemId)} ${pokemon.id}" class="button">Use Here</button>`;
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
				`<button name="send" value="/rpg giveitem ${pokemon.id} ${toID(id)}" class="button">Give</button>` +
				`</div>` +
				`</div>`;

			gridHTML += `<div>${cellContent}</div>`;
			count++;
		}
	}
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
		const btn = `<button name="send" value="/rpg giveitem ${pokemon.id} ${toID(itemId)}" class="button">Give Here</button>`;
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

		const btnAction = isFull ? '' : `name="send" value="/rpg restorepp ${pokemon.id} ${toID(move.id)} ${toID(itemId)}"`;
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

	html += `<hr /><center><p style="text-align:center"><button name="send" value="/rpg useitem ${toID(itemId)}" class="button">Back to Pokémon</button></p></center></div>`;
	return html;
}

export function generateItemUseErrorHTML(message: string, itemId: string): string {
	return `<div class="rpg-infobox rpg-menu-box"><p class="rpg-text-error"><strong>${message}</strong></p><p><button name="send" value="/rpg useitem ${toID(itemId)}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

export function generateEvolutionStoneErrorHTML(pokemonSpecies: string, itemId: string): string {
	return `<div class="rpg-infobox rpg-menu-box"><p class="rpg-text-error"><strong>It had no effect... (${pokemonSpecies} is not compatible with this item).</strong></p><p><button name="send" value="/rpg useitem ${toID(itemId)}" class="button">Try Again</button> <button name="send" value="/rpg items" class="button">Back to Items</button></p></div>`;
}

function generateStarterChoiceBoxHTML(speciesId: string, command: string): string {
	const species = Dex.species.get(speciesId);
	if (!species.exists) return '';
	const tempMon: any = { species: speciesId };
	const spriteUrl = getSpriteUrl(tempMon, 'front');

	return `<div class="rpg-starter-card">` +
		`<img src="${spriteUrl}" />` +
		`<div class="rpg-starter-info">` +
		`<strong>${species.name}</strong><br>` +
		`<small class="rpg-text-muted">${species.types.join('/')}</small>` +
		`</div>` +
		`<button name="send" value="${command}" class="button">Choose</button>` +
		`</div>`;
}

export function generateNPCSelectionHTML(availableNPCs: [string, { name: string }][]): string {
	let html = `<div class="rpg-infobox rpg-menu-box"><h2>Talk to NPCs</h2><p>Who would you like to talk to?</p>`;
	for (const [id, npc] of availableNPCs) {
		html += `<button name="send" value="/rpg npc ${toID(id)}" class="button">💬 ${npc.name}</button> `;
	}
	html += `<hr /><p><button name="send" value="/rpg explore" class="button">Back to Explore</button></p>`;
	html += generateBottomNavigation() + `</div>`;
	return html;
}

export function generateNPCStarterConfirmHTML(npcName: string, message: string, tempSlot: ActivePokemonSlot, speciesName: string): string {
	const pokemon = tempSlot.pokemon;
	const species = Dex.species.get(pokemon.species);
	const spriteUrl = getSpriteUrl(pokemon, 'front');

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

export function generateScriptedEventHTML(event: any, message: string): string {
	let html = `<div class="rpg-infobox"><h2>${event.name || 'Event'}</h2>`;

	html += `<div class="rpg-memo-box" style="margin-bottom:15px;">`;
	html += `<p>${message}</p>`;
	html += `</div>`;

	if (event.type === 'choice' && event.choices) {
		html += `<p><strong>Make a choice:</strong></p><div class="rpg-grid-2col">`;
		event.choices.forEach((choice: any, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${choice.text}</button> `;
		});
		html += `</div>`;
	} else if (event.type === 'quiz' && event.answers) {
		html += `<p><strong>Select an answer:</strong></p><div class="rpg-grid-2col">`;
		event.answers.forEach((ans: string, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${ans}</button> `;
		});
		html += `</div>`;
	} else if (event.type === 'branching' && event.pathOptions) {
		html += `<div class="rpg-grid-2col">`;
		event.pathOptions.forEach((path: any, idx: number) => {
			html += `<button name="send" value="/rpg eventchoice ${idx}" class="button">${path.name}</button> `;
		});
		html += `</div>`;
	} else if (['wildbattle', 'bossbattle'].includes(event.type)) {
		let cmd = `/rpg scriptedbattle ${toID(event.id)}`;
		let btnText = "⚔️ Battle!";

		if (event.type === 'bossbattle' && event.bossTrainerId) {
			cmd = `/rpg challenge ${toID(event.bossTrainerId)} ${toID(event.id)}`;
			btnText = "⚔️ Challenge Boss";
		}

		html += `<p class="rpg-text-center">`;
		html += `<button name="send" value="${cmd}" class="button rpg-button-large" style="margin-bottom:5px;">${btnText}</button><br>`;
		html += `<button name="send" value="/rpg explore" class="button">Run Away</button>`;
		html += `</p>`;
	} else if (['trainer', 'gymchallenge', 'elitefour'].includes(event.type)) {
		const trainerId = event.nextOpponent || event.trainerId || event.gymLeaderId;

		if (trainerId) {
			const cmd = `/rpg challenge ${toID(trainerId)} ${toID(event.id)}`;
			html += `<p class="rpg-text-center">`;
			html += `<button name="send" value="${cmd}" class="button rpg-button-large" style="margin-bottom:5px;">⚔️ Challenge!</button><br>`;
			html += `<button name="send" value="/rpg explore" class="button">Run Away</button>`;
			html += `</p>`;
		} else {
			html += `<p class="rpg-text-center"><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
		}
	} else {
		html += `<p class="rpg-text-center"><button name="send" value="/rpg explore" class="button">Continue</button></p>`;
	}

	html += `</div>`;
	return html;
}

export function generateNPCInteractionHTML(
	npc: any,
	notification?: string,
	returnCommand = '/rpg explore'
): string {
	let html = `<div class="rpg-infobox">`;
	if (notification) {
		html += `<div class="rpg-notification">${notification}</div>`;
	}

	html += `<h2>${npc.name}</h2>` +
		`<div class="rpg-memo-box"><p>"${npc.dialogue}"</p></div>`;

	const action = npc.action;

	if (action) {
		html += `<hr />`;

		if (action.type === 'choosestarter') {
			// Show starters inline directly - streamlined flow
			const allStarters = Object.values(STARTER_POKEMON).flat();
			html += `<p class="rpg-text-center" style="margin-bottom: 10px;"><strong>Choose your starter Pokémon:</strong></p>`;
			html += `<div class="rpg-grid-3col">`;
			for (const starterId of allStarters) {
				const command = `/rpg starterchoice ${toID(npc.id)} ${toID(starterId)}`;
				html += generateStarterChoiceBoxHTML(starterId, command);
			}
			html += `</div>`;
		} else {
			let btnText = "Interact";
			if (action.type === 'heal') btnText = "💊 Heal Party";
			else if (action.type === 'giveitem' || action.type === 'givepokemon') btnText = "✅ Accept Offer";
			else if (action.type === 'battlerequest') btnText = "⚔️ Challenge";
			else if (action.type === 'rivalbattle') btnText = "⚔️ Rival Battle";

			html += `<p class="rpg-text-center"><button name="send" value="/rpg npcaction ${toID(npc.id)}" class="button">${btnText}</button></p>`;
		}
	}

	// "Talk to Others" button has been removed to improve immersion.
	// "Say Goodbye" now uses the dynamic returnCommand to send the player back to the specific building or location.
	html += `<hr /><p class="rpg-text-center"><button name="send" value="${returnCommand}" class="button">Say Goodbye</button></p>`;
	html += `</div>`;

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
