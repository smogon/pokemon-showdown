import { Dex, toID } from '../../../sim/dex';
import { Utils } from '../../../lib';
import { PRNG, type PRNGSeed } from '../../../sim/prng';
import { type RuleTable } from '../../../sim/dex-formats';
import { Tags } from './../../tags';
// import { Teams } from '../../../sim/teams';

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	wantsTeraCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
/* export interface BattleFactorySpecies {
	sets: BattleFactorySet[];
	weight: number;
}
interface BattleFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string[];
	nature: string[];
	moves: string[][];
	preferredType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
	shiny?: boolean;
	level?: number;
}
interface BSSFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string;
	nature: string;
	moves: string[][];
	preferredType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs: number[];
	ivs?: number[];
} */
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;
	basePowerMoves: Set<Move>;

	constructor() {
		super();
		this.damagingMoves = new Set();
		this.basePowerMoves = new Set();
	}
}

export type MoveEnforcementChecker = (
	movePool: string[], moves: Set<string>, abilities: string[], types: Set<string>,
	counter: MoveCounter, species: Species, teamDetails: RandomTeamsTypes.TeamDetails,
	isLead: boolean, isDoubles: boolean, preferredType: string, role: RandomTeamsTypes.Role,
) => boolean;

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
	'juicedrink', 'snooze', 'cidercannon',
];
// Moves that drop stats:
const CONTRARY_MOVES = [
	'armorcannon', 'closecombat', 'leafstorm', 'makeitrain', 'overheat', 'spinout', 'superpower', 'vcreate',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'swordsdance', 'tidyup', 'victorydance',
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'takeheart', 'torchsong',
];
// Moves that boost Attack AND Special Attack:
const MIXED_SETUP = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup',
	'evoboost',
];
// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish', 'snowscape', 'trailblaze',
	'earthrush',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'autotomize', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cosmicpower', 'curse', 'dragondance',
	'flamecharge', 'growth', 'honeclaws', 'howl', 'irondefense', 'meditate', 'nastyplot', 'noretreat', 'poweruppunch', 'quiverdance',
	'rockpolish', 'shellsmash', 'shiftgear', 'swordsdance', 'tailglow', 'takeheart', 'tidyup', 'trailblaze', 'workup', 'victorydance',
	'earthrush', 'evoboost', 'fluffbuff', 'shelter',
];
const SPEED_CONTROL = [
	'electroweb', 'glare', 'icywind', 'lowsweep', 'nuzzle', 'quash', 'tailwind', 'thunderwave', 'trickroom',
	'kihop', 'mockery',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'acidspray', 'accelerock', 'aquajet', 'bounce', 'breakingswipe', 'bulletpunch', 'chatter', 'chloroblast', 'clearsmog', 'covet',
	'dragontail', 'doomdesire', 'electroweb', 'eruption', 'explosion', 'fakeout', 'feint', 'flamecharge', 'flipturn', 'futuresight',
	'grassyglide', 'iceshard', 'icywind', 'incinerate', 'infestation', 'machpunch', 'meteorbeam', 'mortalspin', 'nuzzle', 'pluck', 'pursuit',
	'quickattack', 'rapidspin', 'reversal', 'selfdestruct', 'shadowsneak', 'skydrop', 'snarl', 'strugglebug', 'suckerpunch', 'trailblaze',
	'uturn', 'vacuumwave', 'voltswitch', 'watershuriken', 'waterspout',
	'earthrush', 'kihop', 'lavajet', 'mockery', 'scavenge', 'slushball',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
	'steelbarbs',
];
// Protect and its variants
const PROTECT_MOVES = [
	'banefulbunker', 'burningbulwark', 'protect', 'silktrap', 'spikyshield',
	'frostification', 'kingsshield', 'shockshelter',
];
// Moves that switch the user out
const PIVOT_MOVES = [
	'chillyreception', 'flipturn', 'partingshot', 'shedtail', 'teleport', 'uturn', 'voltswitch',
	'escaperoot', 'heartshock', // heartshock is technically a pivot move lmao
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'protect'],
	['leechseed', 'substitute'],
	['perishsong', 'protect'],
	// swse
	['snooze', 'sleeptalk'],
	['escaperoot', 'ingrain'],
	['pricklypear', 'protect'],
	['pricklypear', 'substitute'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'breloom', 'brutebonnet', 'cacturne', 'honchkrow', 'mimikyu', 'ragingbolt', 'scizor',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Zacian', 'Zamazenta',
	'Castform', 'Leoseace',
];
const DOUBLES_NO_LEAD_POKEMON = [
	'Basculegion', 'Houndstone', 'Iron Bundle', 'Roaring Moon', 'Zacian', 'Zamazenta',
	'Castform', 'Leoseace',
];

const WEATHER_DATA: {
	name: keyof RandomTeamsTypes.TeamDetails,
	category: keyof RandomTeamsTypes.TeamDetails,
	role: string,
	type: string,
	item: string,
	setupAbility: string[],
	setupMove: string[],
	weatherDependentAbilities?: string[],
	weatherEnhancedMoves?: string[],
	weatherRequiredMoves?: string[],
	weatherDiscouragedAbilities?: string[],
	weatherDiscouragedMoves?: string[],
}[] = [
	{
		name: 'sun', category: 'climateWeather', role: 'Sun Setter', type: 'Fire', item: 'Weather Balloon',
		setupAbility: ['Drought', 'Heat Haze', 'Orichalcum Pulse'],
		setupMove: ['sunnyday', 'thermalvortex', 'wildfire'],
		weatherDependentAbilities: ['Chlorophyll', 'Droughtproof', 'Evergreen', 'Leaf Guard', 'Overcoat', 'Solar Power', 'Wet and Dry'],
		weatherEnhancedMoves: ['growth', 'hydrosteam', 'morningsun', 'solarbeam', 'solarblade', 'synthesis', 'triattack', 'weatherball'],
		weatherRequiredMoves: ['sunscreen'],
		weatherDiscouragedAbilities: ['Dry Skin'],
		weatherDiscouragedMoves: ['moonlight'],
	},
	{
		name: 'rain', category: 'climateWeather', role: 'Rain Setter', type: 'Water', item: 'Weather Balloon',
		setupAbility: ['Drizzle'],
		setupMove: ['brainstorm', 'raindance', 'shelter', 'whirlduel'],
		weatherDependentAbilities: [
			'Droughtproof', 'Dry Skin', 'Hydration', 'Hydrophobic', 'Overcoat', 'Petrichor', 'Rain Dish', 'Swift Swim', 'Wet and Dry',
		],
		weatherEnhancedMoves: [
			'bleakwindstorm', 'electroshot', 'hurricane', 'sandsearstorm', 'slushball', 'thunder', 'weatherball', 'wildboltstorm',
		],
	},
	{
		name: 'snow', category: 'climateWeather', role: 'Snow Setter', type: 'Ice', item: 'Weather Balloon',
		setupAbility: ['Ice Armor', 'Snow Warning'],
		setupMove: ['chillyreception', 'snowscape', 'whiteout'],
		weatherDependentAbilities: [
			'Absolute Zero', 'Droughtproof', 'Evergreen', 'Flame Body', 'Glacial Armor', 'Hydrophobic',
			'Ice Body', 'Magma Armor', 'Overcoat', 'Slush Rush', 'Snow Cloak', 'Wet and Dry',
		],
		weatherEnhancedMoves: ['blizzard', 'icywind', 'mist', 'slushball', 'triattack', 'weatherball'],
		weatherRequiredMoves: ['auroraveil'],
	},
	{
		name: 'bloodMoon', category: 'climateWeather', role: 'Blood Moon Setter', type: 'Dark', item: 'Weather Balloon',
		setupAbility: ['Eventide'],
		setupMove: ['bloodmoon'],
		weatherDependentAbilities: ['Droughtproof', 'Malice', 'Petrichor', 'Shadow Step'],
		weatherEnhancedMoves: ['deception', 'lunarsurge', 'moonblast', 'moonlight', 'peekaboo', 'shade', 'thief', 'weatherball'],
		weatherDiscouragedMoves: ['morningsun'],
	},
	{
		name: 'fog', category: 'climateWeather', role: 'Fog Setter', type: 'Normal', item: 'Weather Balloon',
		setupAbility: ['Condensation'],
		setupMove: ['foghorn'],
		weatherDependentAbilities: ['Droughtproof', 'Overcoat', 'Protean', 'Warp Mist', 'Wet and Dry'],
		weatherEnhancedMoves: ['mist', 'weatherball'],
		weatherDiscouragedMoves: ['defog'],
	},
	{
		name: 'sand', category: 'irritantWeather', role: 'Sandstorm Setter', type: 'Rock', item: 'Volatile Spray',
		setupAbility: ['Sand Stream'], setupMove: ['sandstorm'],
		weatherDependentAbilities: ['Bubble Helm', 'Earth Force', 'Overcoat', 'Sand Rush', 'Sand Veil', 'Wet and Dry'],
		weatherEnhancedMoves: ['sandblast', 'shoreup', 'stonestorm', 'weatherball'],
	},
	{
		name: 'dust', category: 'irritantWeather', role: 'Dust Storm Setter', type: 'Ground', item: 'Volatile Spray',
		setupAbility: ['Dust Devil'],
		setupMove: ['duststorm'],
		weatherDependentAbilities: ['Bubble Helm', 'Dust Gather', 'Earth Force', 'Overcoat', 'Wet and Dry'],
		weatherEnhancedMoves: ['sandblast', 'selfdestruct', 'shoreup', 'stonestorm', 'weatherball'],
	},
	{
		name: 'pollen', category: 'irritantWeather', role: 'Pollen Setter', type: 'Grass', item: 'Volatile Spray',
		setupAbility: ['Arena Bloom', 'Hay Fever'],
		setupMove: ['fluffbuff', 'pollinate'],
		weatherDependentAbilities: ['Arena Bloom', 'Bloomspring', 'Bubble Helm', 'Grass Pelt', 'Leaf Guard', 'Overcoat'],
		weatherEnhancedMoves: ['grassyglide', 'pollenpuff', 'weatherball'],
	},
	{
		name: 'pheromones', category: 'irritantWeather', role: 'Pheromones Setter', type: 'Bug', item: 'Volatile Spray',
		setupAbility: ['Secretion'],
		setupMove: ['swarmsignal'],
		weatherDependentAbilities: ['Bubble Helm', 'Overcoat', 'Powder Cure', 'Swarm', 'Swarming'],
		weatherEnhancedMoves: ['lovespray', 'weatherball'],
	},
	{
		name: 'smog', category: 'irritantWeather', role: 'Smog Setter', type: 'Poison', item: 'Volatile Spray',
		setupAbility: ['Pollution'],
		setupMove: ['smogspread'],
		weatherDependentAbilities: ['Bubble Helm', 'Carbon Capture', 'Corrosion', 'Guts', 'Overcoat', 'Poison Heal', 'Quick Feet', 'Toxic Boost'],
		weatherEnhancedMoves: ['emberplume', 'gastroacid', 'smog', 'weatherball'],
	},
	{
		name: 'fairyDust', category: 'irritantWeather', role: 'Fairy Dust Setter', type: 'Fairy', item: 'Volatile Spray',
		setupAbility: ['Incantation'],
		setupMove: ['efflorescence', 'sprinkle'],
		weatherDependentAbilities: ['Druidry', 'Power Above'],
		weatherEnhancedMoves: ['mistyexplosion', 'peekaboo', 'pixiepunch', 'weatherball'],
		weatherDiscouragedMoves: ['deception'],
	},
	{
		name: 'battleAura', category: 'energyWeather', role: 'Battle Aura Setter', type: 'Fighting', item: 'Energy Channelizer',
		setupAbility: ['Stand Off'],
		setupMove: ['auraprojection'],
		weatherDependentAbilities: ['Rage State', 'Trained Eye'],
		weatherEnhancedMoves: ['focuspunch', 'weatherball'],
	},
	{
		name: 'paranormalActivity', category: 'energyWeather', role: 'Paranormal Activity Setter', type: 'Ghost', item: 'Energy Channelizer',
		setupAbility: ['Arena Curse', 'Se\u0301ance'],
		setupMove: ['haunt', 'languishingaura'],
		weatherDependentAbilities: ['Arena Curse', 'Consecration', 'Shadow Step', 'Soul Drain'],
		weatherEnhancedMoves: ['technoplasm', 'weatherball'],
		weatherRequiredMoves: ['ectoplasma'],
	},
	{
		name: 'dreamscape', category: 'energyWeather', role: 'Dreamscape Setter', type: 'Psychic', item: 'Energy Channelizer',
		setupAbility: ['Dreamer'],
		setupMove: ['brainstorm', 'daydream'],
		weatherDependentAbilities: ['Bad Dreams', 'Consecration', 'Smoke and Mirrors', 'Sweet Dreams'],
		weatherEnhancedMoves: ['dreameater', 'expandingforce', 'mindmeld', 'nightmare', 'weatherball'],
	},
	{
		name: 'dragonForce', category: 'energyWeather', role: 'Dragon Force Setter', type: 'Dragon', item: 'Energy Channelizer',
		setupAbility: ['Arcanum'],
		setupMove: ['dragonforce'],
		weatherDependentAbilities: ['Indomitable', 'Power Within'],
		weatherEnhancedMoves: ['dragonrush', 'weatherball'],
	},
	{
		name: 'thunderstorm', category: 'energyWeather', role: 'Thunderstorm Setter', type: 'Electric', item: 'Energy Channelizer',
		setupAbility: ['Relic Soul', 'Stormfront'],
		setupMove: ['supercell'],
		weatherDependentAbilities: [
			'Energizer', 'Forked', 'Lightning Rod', 'Motor Drive', 'Power Plumage', 'Relic Soul', 'Surge Surfer', 'Volt Absorb',
		],
		weatherEnhancedMoves: [
			'conduction', 'electroshot', 'risingvoltage', 'supercellslam', 'thunder', 'thunderbolt', 'triattack', 'weatherball', 'zapcannon',
		],
	},
	{
		name: 'magnetosphere', category: 'energyWeather', role: 'Magnetosphere Setter', type: 'Steel', item: 'Energy Channelizer',
		setupAbility: ['Ferroflux'],
		setupMove: ['magnetize'],
		weatherDependentAbilities: ['Machine Precision', 'Magnapult', 'Nanomachines'],
		weatherEnhancedMoves: ['conduction', 'magnetrise', 'weatherball'],
		weatherRequiredMoves: ['gearup', 'magneticflux'],
	},
	{
		name: 'strongWinds', category: 'clearingWeather', role: 'Strong Winds Setter', type: 'Flying', item: 'Portable Turbine',
		setupAbility: ['Galeforce', 'Heat Haze', 'Ice Armor'],
		setupMove: ['strongwinds'],
		weatherDependentAbilities: ['Gale Wings', 'Wind Power', 'Wind Rider'],
		weatherEnhancedMoves: ['blizzard', 'fly', 'heatwave', 'hurricane', 'icywind', 'petalblizzard', 'skyattack', 'weatherball', 'windtunnel'],
		weatherRequiredMoves: ['windrage'],
	},
];

function uniqueStrings(values: string[]) {
	return [...new Set(values)];
}

const WEATHER_SETUP = uniqueStrings([
	...WEATHER_DATA.flatMap(weather => weather.setupMove),
]);
const WEATHER_BALL_TYPES: { [role: string]: string } = Object.fromEntries(
	WEATHER_DATA.map(weather => [weather.role, weather.type])
);
const WEATHER_ABILITY_CHECKS: {
	ability: string,
	id: ID,
	name: keyof RandomTeamsTypes.TeamDetails,
	category: keyof RandomTeamsTypes.TeamDetails,
	setupMove: string[],
}[] = WEATHER_DATA.flatMap(weather => weather.setupAbility.map(ability => ({
	ability,
	id: toID(ability),
	name: weather.name,
	category: weather.category,
	setupMove: weather.setupMove,
})));
const WEATHER_ABILITY_MOVE_CHECKS: { id: ID, moves: string[] }[] = WEATHER_DATA
	.filter(weather => weather.weatherEnhancedMoves?.length || weather.weatherRequiredMoves?.length)
	.flatMap(weather => weather.setupAbility.map(ability => ({
		id: toID(ability),
		moves: [...(weather.weatherEnhancedMoves || []), ...(weather.weatherRequiredMoves || [])],
	})));
const WEATHER_ENHANCING_MOVES: {
	name: keyof RandomTeamsTypes.TeamDetails,
	category: keyof RandomTeamsTypes.TeamDetails,
	abilities: string[],
	moves: string[],
}[] = WEATHER_DATA
	.filter(weather => weather.weatherDependentAbilities?.length || weather.setupMove.length ||
		weather.weatherEnhancedMoves?.length)
	.map(weather => ({
		name: weather.name,
		category: weather.category,
		abilities: weather.weatherDependentAbilities || [],
		moves: weather.weatherEnhancedMoves || [],
	}));
const WEATHER_REQUIRED_MOVES: {
	name: keyof RandomTeamsTypes.TeamDetails,
	category: keyof RandomTeamsTypes.TeamDetails,
	moves: string[],
}[] = WEATHER_DATA
	.filter(weather => weather.weatherRequiredMoves?.length)
	.map(weather => ({
		name: weather.name,
		category: weather.category,
		moves: weather.weatherRequiredMoves!,
	}));
const WEATHER_DISCOURAGED_MOVES: { name: keyof RandomTeamsTypes.TeamDetails, moves: string[] }[] =
	WEATHER_DATA
		.filter(weather => weather.weatherDiscouragedMoves?.length)
		.map(weather => ({
			name: weather.name,
			moves: weather.weatherDiscouragedMoves!,
		}));
const WEATHER_DISCOURAGED_ABILITIES: { name: keyof RandomTeamsTypes.TeamDetails, abilities: string[] }[] =
	WEATHER_DATA
		.filter(weather => weather.weatherDiscouragedAbilities?.length)
		.map(weather => ({
			name: weather.name,
			abilities: weather.weatherDiscouragedAbilities!,
		}));
const WEATHER_SETUP_ITEMS: { item: string, moves: string[], roles: string[] }[] =
	WEATHER_DATA.reduce((items, weather) => {
		let itemData = items.find(item => item.item === weather.item);
		if (!itemData) {
			itemData = { item: weather.item, moves: [], roles: [] };
			items.push(itemData);
		}
		itemData.moves = uniqueStrings([
			...itemData.moves, ...weather.setupMove,
		]);
		itemData.roles.push(weather.role);
		return items;
	}, [] as { item: string, moves: string[], roles: string[] }[]);

function getWeatherAbility(abilities: string[], abilityid: ID) {
	return abilities.find(ability => toID(ability) === abilityid);
}

function getWeatherDetails(teamDetails: RandomTeamsTypes.TeamDetails, abilities: string[]) {
	const weatherDetails: RandomTeamsTypes.TeamDetails = { ...teamDetails };
	const abilityIds = new Set(abilities.map(ability => toID(ability)));
	for (const check of WEATHER_ABILITY_CHECKS) {
		if (abilityIds.has(check.id)) {
			weatherDetails[check.name] = 1;
			weatherDetails[check.category] = 1;
		}
	}
	return weatherDetails;
}

function hasWeatherDetail(
	teamDetails: RandomTeamsTypes.TeamDetails,
	abilities: string[],
	detail: keyof RandomTeamsTypes.TeamDetails
) {
	return !!getWeatherDetails(teamDetails, abilities)[detail];
}

function hasWeatherSetter(teamDetails: RandomTeamsTypes.TeamDetails) {
	return !!teamDetails.weatherSetter;
}

function movesHaveWeatherDetail(moves: Set<string>, detail: keyof RandomTeamsTypes.TeamDetails) {
	for (const check of WEATHER_ABILITY_CHECKS) {
		if (check.name === detail && check.setupMove.some(move => moves.has(move))) return true;
	}
	return false;
}

function hasWeatherSynergy(
	teamDetails: RandomTeamsTypes.TeamDetails,
	abilities: string[],
	check: typeof WEATHER_ENHANCING_MOVES[number]
) {
	return !!getWeatherDetails(teamDetails, abilities)[check.name];
}

function getWeatherSetupItem(ability: string, moves: Set<string>, role?: RandomTeamsTypes.Role) {
	const abilityId = toID(ability);
	if (WEATHER_ABILITY_CHECKS.some(check => check.id === abilityId)) return '';
	if (role) {
		const setupItem = WEATHER_SETUP_ITEMS.find(check => check.roles.includes(role));
		if (setupItem?.moves.some(move => moves.has(move))) return setupItem.item;
	}
	for (const check of WEATHER_SETUP_ITEMS) {
		if (check.moves.some(move => moves.has(move))) return check.item;
	}
	return '';
}

function setHasWeatherSetter(set: RandomTeamsTypes.RandomSet) {
	const abilityId = toID(set.ability);
	for (const check of WEATHER_ABILITY_CHECKS) {
		if (check.category === 'clearingWeather') continue;
		if (abilityId === check.id || check.setupMove.some(move => set.moves.includes(move))) return true;
	}
	return false;
}

export class RandomTeams {
	readonly dex: ModdedDex;
	gen: number;
	factoryTier: string;
	format: Format;
	prng: PRNG;
	noStab: string[];
	priorityPokemon: string[];
	readonly maxTeamSize: number;
	readonly adjustLevel: number | null;
	readonly maxMoveCount: number;
	readonly forceMonotype: string | undefined;

	/**
	 * Checkers for move enforcement based on types or other factors
	 *
	 * returns true to try to force the move type, false otherwise.
	 */
	moveEnforcementCheckers: { [k: string]: MoveEnforcementChecker };

	/** Used by .getPools() */
	private poolsCacheKey: [string | undefined, number | undefined, RuleTable | undefined, boolean] | undefined;
	private cachedPool: number[] | undefined;
	private cachedSpeciesPool: Species[] | undefined;
	protected cachedStatusMoves: ID[];

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NO_STAB;
		this.priorityPokemon = PRIORITY_POKEMON;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;

		this.factoryTier = '';
		this.format = format;
		this.prng = PRNG.get(prng);

		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter) => (
				['megahorn', 'pinmissile', 'xscissor'].some(m => movePool.includes(m)) ||
				(!counter.get('Bug') && (types.has('Electric') || types.has('Psychic')))
			),
			Dark: (
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, preferredType, role
			) => {
				if (
					counter.get('Dark') < 2 && this.priorityPokemon.includes(species.id) && role === 'Wallbreaker'
				) return true;
				return !counter.get('Dark');
			},
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fairy: (movePool, moves, abilities, types, counter) => !counter.get('Fairy'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter, species) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter) => !counter.get('Flying'),
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') && (
					movePool.includes('leafstorm') || species.baseStats.atk >= 100 ||
					types.has('Electric') || abilities.includes('Seed Sower')
				)
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => (
				movePool.includes('freezedry') || movePool.includes('blizzard') || !counter.get('Ice')
			),
			Normal: (movePool, moves, types, counter) => (movePool.includes('boomburst') || movePool.includes('hypervoice')),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (types.has('Ground')) return false;
				return !counter.get('Poison');
			},
			Psychic: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => {
				if ((isDoubles || species.id === 'bruxish') && movePool.includes('psychicfangs')) return true;
				if (species.id === 'hoopaunbound' && movePool.includes('psychic')) return true;
				if (['Dark', 'Steel', 'Water'].some(m => types.has(m))) return false;
				return !counter.get('Psychic');
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => (
				!counter.get('Steel') &&
				(isDoubles || species.baseStats.atk >= 90 || movePool.includes('gigatonhammer') || movePool.includes('makeitrain'))
			),
			Water: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => (
				!counter.get('Water') && (!types.has('Ground') || isDoubles)
			),
		};
		this.poolsCacheKey = undefined;
		this.cachedPool = undefined;
		this.cachedSpeciesPool = undefined;
		this.cachedStatusMoves = this.dex.moves.all().filter(move => move.category === 'Status').map(move => move.id);
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	getTeam(options: PlayerOptions | null = null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		) ? this.format.team + 'Team' : '';
		// @ts-expect-error property access
		return this[generatorName || 'randomTeam'](options);
	}

	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}

	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}

	sampleIfArray<T>(item: T | T[]): T {
		if (Array.isArray(item)) {
			return this.sample(item);
		}
		return item;
	}

	random(m?: number, n?: number) {
		return this.prng.random(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 */
	fastPop(list: any[], index: number) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		const length = list.length;
		if (index < 0 || index >= list.length) {
			// sanity check
			throw new Error(`Index ${index} out of bounds for given array`);
		}

		const element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 */
	sampleNoReplace(list: any[]) {
		const length = list.length;
		if (length === 0) return null;
		const index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * Removes n random elements from an unsorted array and returns them.
	 * If n is less than the array's length, randomly removes and returns all the elements
	 * in the array (so the returned array could have length < n).
	 */
	multipleSamplesNoReplace<T>(list: T[], n: number): T[] {
		const samples = [];
		while (samples.length < n && list.length) {
			samples.push(this.sampleNoReplace(list));
		}

		return samples;
	}

	/**
	 * Check if user has directly tried to ban/unban/restrict things in a custom battle.
	 * Doesn't count bans nested inside other formats/rules.
	 */
	private hasDirectCustomBanlistChanges() {
		if (this.format.ruleTable?.has('+pokemontag:cap')) return false;
		if (this.format.banlist.length) {
			if (this.format.banlist[0] !== 'Nonexistent' || this.format.banlist.length > 1) return true;
		}
		if (this.format.restricted.length || this.format.unbanlist.length) return true;
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			for (const banlistOperator of ['-', '+', '*']) {
				if (rule.startsWith(banlistOperator)) return true;
			}
		}
		return false;
	}

	/**
	 * Inform user when custom bans are unsupported in a team generator.
	 */
	protected enforceNoDirectCustomBanlistChanges() {
		if (this.hasDirectCustomBanlistChanges()) {
			throw new Error(`Custom bans are not currently supported in ${this.format.name}.`);
		}
	}

	/**
	 * Inform user when complex bans are unsupported in a team generator.
	 */
	protected enforceNoDirectComplexBans() {
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			if (rule.includes('+') && !rule.startsWith('+')) {
				throw new Error(`Complex bans are not currently supported in ${this.format.name}.`);
			}
		}
	}

	/**
	 * Validate set element pool size is sufficient to support size requirements after simple bans.
	 */
	private enforceCustomPoolSizeNoComplexBans(
		effectTypeName: string,
		basicEffectPool: BasicEffect[],
		requiredCount: number,
		requiredCountExplanation: string
	) {
		if (basicEffectPool.length >= requiredCount) return;
		throw new Error(`Legal ${effectTypeName} count is insufficient to support ${requiredCountExplanation} (${basicEffectPool.length} / ${requiredCount}).`);
	}

	queryMoves(
		moves: Set<string> | null,
		species: Species,
		preferredType: string,
		abilities: string[],
		role?: RandomTeamsTypes.Role,
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();
		const types = new Set(species.types);
		if (!moves?.size) return counter;

		const categories = { Physical: 0, Special: 0, Status: 0 };

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			let move = this.dex.moves.get(moveid);
			// Nature Power calls Earthquake in Gen 5 and Tri Attack in Gens 6-9
			if (this.gen === 5 && moveid === 'naturepower') move = this.dex.moves.get('earthquake');
			if (this.gen > 5 && moveid === 'naturepower') move = this.dex.moves.get('triattack');

			const moveType = this.getMoveType(move, species, abilities, preferredType, role);
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter.add('damage');
				counter.damagingMoves.add(move);
			} else {
				// Are Physical/Special/Status moves:
				categories[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && !['nuzzle', 'rapidspin'].includes(moveid))) {
				counter.add('technician');
			}
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter.add('skilllink');
			if (move.recoil || move.hasCrashDamage) counter.add('recoil');
			if (move.drain) counter.add('drain');
			// Moves which have a base power:
			if (move.basePower || move.basePowerCallback) {
				counter.basePowerMoves.add(move);
				if (!this.noStab.includes(moveid) || this.priorityPokemon.includes(species.id) && move.priority > 0) {
					counter.add(moveType);
					if (types.has(moveType)) counter.add('stab');
					if (moveType === 'Rock' && abilities.includes('Ancient Body')) counter.add('stab');
					counter.damagingMoves.add(move);
				}
				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Hay Fever')) ||
					(moveid === 'windtunnel' && abilities.includes('Galeforce'))) {
					counter.add('priority');
				}
			}
			// Moves with secondary effects:
			if (move.secondary || move.hasSheerForceBoost) {
				counter.add('sheerforce');
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter.add('inaccurate');

			// Moves that change stats:
			if (RECOVERY_MOVES.includes(moveid)) counter.add('recovery');
			if (CONTRARY_MOVES.includes(moveid)) counter.add('contrary');
			if (PHYSICAL_SETUP.includes(moveid)) counter.add('physicalsetup');
			if (SPECIAL_SETUP.includes(moveid)) counter.add('specialsetup');
			if (MIXED_SETUP.includes(moveid)) counter.add('mixedsetup');
			if (SPEED_SETUP.includes(moveid)) counter.add('speedsetup');
			if (SPEED_CONTROL.includes(moveid)) counter.add('speedcontrol');
			if (SETUP.includes(moveid)) counter.add('setup');
			if (HAZARDS.includes(moveid)) counter.add('hazards');
		}

		counter.set('Physical', Math.floor(categories['Physical']));
		counter.set('Special', Math.floor(categories['Special']));
		counter.set('Status', categories['Status']);
		return counter;
	}

	cullMovePool(
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
		isDoubles: boolean,
	): void {
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Develop additional move lists
		const statusMoves = this.cachedStatusMoves;
		const weatherDetails = getWeatherDetails(teamDetails, abilities);

		// Team-based move culls
		if (teamDetails.screens) {
			if (movePool.includes('auroraveil') && !isDoubles) this.fastPop(movePool, movePool.indexOf('auroraveil'));
			if (movePool.length >= this.maxMoveCount + 2) {
				if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
				if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			}
		}
		if (teamDetails.stickyWeb) {
			if (movePool.includes('stickyweb')) this.fastPop(movePool, movePool.indexOf('stickyweb'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.steelBarbs) {
			if (movePool.includes('steelbarbs')) this.fastPop(movePool, movePool.indexOf('steelbarbs'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.defog || teamDetails.rapidSpin) {
			if (movePool.includes('defog')) this.fastPop(movePool, movePool.indexOf('defog'));
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.statusCure) {
			if (movePool.includes('healbell')) this.fastPop(movePool, movePool.indexOf('healbell'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		for (const check of WEATHER_DISCOURAGED_MOVES) {
			if (!weatherDetails[check.name]) continue;
			for (const moveid of check.moves) {
				if (movePool.includes(moveid)) this.fastPop(movePool, movePool.indexOf(moveid));
			}
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		for (const check of WEATHER_REQUIRED_MOVES) {
			if (weatherDetails[check.name]) continue;
			for (const moveid of check.moves) {
				if (movePool.includes(moveid)) this.fastPop(movePool, movePool.indexOf(moveid));
			}
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		if (isDoubles) {
			const doublesIncompatiblePairs = [
				// In order of decreasing generalizability
				[SPEED_CONTROL, SPEED_CONTROL],
				[HAZARDS, HAZARDS],
				['rockslide', 'stoneedge'],
				[SETUP, ['fakeout', 'helpinghand']],
				[PROTECT_MOVES, 'wideguard'],
				[['fierydance', 'fireblast'], 'heatwave'],
				['dazzlinggleam', ['fleurcannon', 'moonblast']],
				['poisongas', ['toxicspikes', 'willowisp']],
				[RECOVERY_MOVES, ['healpulse', 'lifedew']],
				['healpulse', 'lifedew'],
				['haze', 'icywind'],
				[['hydropump', 'muddywater'], ['muddywater', 'scald']],
				['disable', 'encore'],
				['freezedry', 'icebeam'],
				['energyball', 'leafstorm'],
				['earthpower', 'sandsearstorm'],
				['coaching', ['helpinghand', 'howl']],
				// swse
				['comradesarmor', 'protect'],
			];

			for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

			if (role !== 'Offensive Protect') this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ['flipturn', 'uturn']);
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, PIVOT_MOVES],
			[SETUP, HAZARDS],
			[SETUP, ['defog', 'nuzzle', 'toxic', 'yawn', 'haze']],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			['substitute', PIVOT_MOVES],
			[SPEED_SETUP, ['aquajet', 'rest', 'trickroom']],
			['curse', ['irondefense', 'rapidspin']],
			['dragondance', 'dracometeor'],
			['yawn', 'roar'],
			['trick', 'uturn'],

			// These attacks are redundant with each other
			[['psychic', 'psychicnoise'], ['psyshock', 'psychicnoise']],
			[['surf', 'hydropump'], 'osmosis'],
			['liquidation', 'wavecrash'],
			['aquajet', 'flipturn'],
			['gigadrain', 'leafstorm'],
			['powerwhip', 'hornleech'],
			[['airslash', 'hurricane'], 'whipup'],
			['knockoff', 'foulplay'],
			['throatchop', ['crunch', 'lashout']],
			['doubleedge', ['bodyslam', 'headbutt']],
			[['fireblast', 'magmastorm'], ['fierydance', 'flamethrower', 'lavaplume']],
			[['thunderpunch', 'voltkick'], 'wildcharge'],
			['thunderbolt', 'discharge'],
			['gunkshot', ['direclaw', 'poisonjab', 'sludgebomb']],
			['aurasphere', 'focusblast'],
			['closecombat', 'drainpunch'],
			[['dragonpulse', 'spacialrend'], 'dracometeor'],
			['dragonclaw', 'outrage'],
			['heavyslam', 'flashcannon'],
			['alluringvoice', 'dazzlinggleam'],

			// These status moves are redundant with each other
			['taunt', 'disable'],
			[['thunderwave', 'toxic'], ['thunderwave', 'willowisp', 'whitewand']],
			[['thunderwave', 'toxic', 'willowisp', 'whitewand'], 'toxicspikes'],

			// This space reserved for assorted hardcodes that otherwise make little sense out of context
			// Landorus and Thundurus
			['nastyplot', ['rockslide', 'knockoff']],
			// Persian
			['switcheroo', 'fakeout'],
			// Amoonguss, though this can work well as a general rule later
			['toxic', 'clearsmog'],
			// Chansey and Blissey
			['healbell', 'stealthrock'],
			// Araquanid and Magnezone
			['mirrorcoat', ['hydropump', 'bodypress']],

			// swse
			['frostkick', 'iciclecrash'],
			['ignition', 'blazekick'],
			['stonestorm', 'powergem'],
			['strongwinds', 'tailwind'],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.has('Ice')) this.incompatibleMoves(moves, movePool, 'icebeam', 'icywind');

		if (!isDoubles) this.incompatibleMoves(moves, movePool, 'taunt', 'encore');

		if (!types.has('Dark') && preferredType !== 'Dark') this.incompatibleMoves(moves, movePool, 'knockoff', 'suckerpunch');

		if (!abilities.includes('Prankster')) this.incompatibleMoves(moves, movePool, 'thunderwave', 'yawn');

		// This space reserved for assorted hardcodes that otherwise make little sense out of context:
		// To force Close Combat on Barraskewda without locking it to Tera Fighting
		if (species.id === 'barraskewda') {
			this.incompatibleMoves(moves, movePool, ['psychicfangs', 'throatchop'], ['poisonjab', 'throatchop']);
		}
		// To force Toxic on Quagsire
		if (species.id === 'quagsire') this.incompatibleMoves(moves, movePool, 'spikes', 'icebeam');
		// Taunt/Knock should be Cyclizar's flex moveslot
		if (species.id === 'cyclizar') this.incompatibleMoves(moves, movePool, 'taunt', 'knockoff');
		// To force Stealth Rock on Camerupt
		if (species.id === 'camerupt') this.incompatibleMoves(moves, movePool, 'roar', 'willowisp');
		// nothing else rolls these lol
		if (species.id === 'coalossal') this.incompatibleMoves(moves, movePool, 'flamethrower', 'overheat');
	}

	// Checks for and removes incompatible moves, starting with the first move in movesA.
	incompatibleMoves(
		moves: Set<string>,
		movePool: string[],
		movesA: string | string[],
		movesB: string | string[],
	): void {
		const moveArrayA = (Array.isArray(movesA)) ? movesA : [movesA];
		const moveArrayB = (Array.isArray(movesB)) ? movesB : [movesB];
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		for (const moveid1 of moves) {
			if (moveArrayB.includes(moveid1)) {
				for (const moveid2 of moveArrayA) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
			if (moveArrayA.includes(moveid1)) {
				for (const moveid2 of moveArrayB) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
		}
	}

	// Adds a move to the moveset, returns the MoveCounter
	addMove(
		move: string,
		moves: Set<string>,
		types: Set<string>,
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		movePool: string[],
		preferredType: string,
		role: RandomTeamsTypes.Role,
		isDoubles = false,
	): MoveCounter {
		moves.add(move);
		this.fastPop(movePool, movePool.indexOf(move));
		const counter = this.queryMoves(moves, species, preferredType, abilities, role);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead,
			preferredType, role, isDoubles);
		return counter;
	}

	// Returns the type of a given move for STAB/coverage enforcement purposes
	getMoveType(
		move: Move, species: Species, abilities: string[], preferredType: string, role?: RandomTeamsTypes.Role
	): string {
		if (['judgment', 'multiattack', 'revelationdance'].includes(move.id)) return species.types[0];

		if (move.id === 'weatherball' && role?.includes('Setter')) return WEATHER_BALL_TYPES[role] || 'Normal';

		if (move.name === "Raging Bull" && species.name.startsWith("Tauros-Paldea")) {
			if (species.name.endsWith("Combat")) return "Fighting";
			if (species.name.endsWith("Blaze")) return "Fire";
			if (species.name.endsWith("Aqua")) return "Water";
		}

		if (move.name === "Ivy Cudgel" && species.name.startsWith("Ogerpon")) {
			if (species.name.endsWith("Wellspring")) return "Water";
			if (species.name.endsWith("Hearthflame")) return "Fire";
			if (species.name.endsWith("Cornerstone")) return "Rock";
		}

		const moveType = move.type;
		if (moveType === 'Normal') {
			if (abilities.includes('Aerilate')) return 'Flying';
			if (abilities.includes('Galvanize')) return 'Electric';
			if (abilities.includes('Pixilate')) return 'Fairy';
			if (abilities.includes('Refrigerate')) return 'Ice';
			// swse
			if (abilities.includes('Vegetate')) return 'Grass';
			if (abilities.includes('Intoxicate')) return 'Poison';
		}
		return moveType;
	}

	// Generate random moveset for a given species, role, preferred type.
	randomMoveset(
		types: Set<string>,
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		movePool: string[],
		preferredType: string,
		role: RandomTeamsTypes.Role,
		isDoubles: boolean,
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.queryMoves(moves, species, preferredType, abilities, role);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead,
			preferredType, role, isDoubles);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			for (const moveid of movePool) {
				moves.add(moveid);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, preferredType, role
			);
		};

		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role, isDoubles);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.includes('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role, isDoubles);
		}

		// Enforce Night Shade, Revelation Dance, Revival Blessing, and Sticky Web
		for (const moveid of ['nightshade', 'revelationdance', 'revivalblessing', 'stickyweb']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Trick Room on Doubles Wallbreaker
		if (movePool.includes('trickroom') && role === 'Doubles Wallbreaker') {
			counter = this.addMove('trickroom', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role, isDoubles);
		}

		// Enforce hazard removal on Bulky Support if the team doesn't already have it
		if (role === 'Bulky Support' && !teamDetails.defog && !teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
			if (movePool.includes('defog')) {
				counter = this.addMove('defog', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Aurora Veil if the team doesn't already have screens
		if (!teamDetails.screens && movePool.includes('auroraveil')) {
			counter = this.addMove('auroraveil', moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role, isDoubles);
		}

		// Enforce Knock Off on pure Normal- and Fighting-types in singles
		if (!isDoubles && types.size === 1 && (types.has('Normal') || types.has('Fighting'))) {
			if (movePool.includes('knockoff')) {
				counter = this.addMove('knockoff', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Spore on Smeargle
		if (species.id === 'smeargle') {
			if (movePool.includes('spore')) {
				counter = this.addMove('spore', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce moves in doubles
		if (isDoubles) {
			const doublesEnforcedMoves = ['mortalspin', 'spore'];
			for (const moveid of doublesEnforcedMoves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
			// Enforce Fake Out on slow Pokemon
			if (movePool.includes('fakeout') && species.baseStats.spe <= 50) {
				counter = this.addMove('fakeout', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
			// Enforce Tailwind on Prankster and Gale Wings users
			if (movePool.includes('tailwind') && (abilities.includes('Prankster') || abilities.includes('Gale Wings'))) {
				counter = this.addMove('tailwind', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce STAB priority
		if (
			['Bulky Attacker', 'Bulky Setup', 'Wallbreaker', 'Doubles Wallbreaker'].includes(role) ||
			this.priorityPokemon.includes(species.id)
		) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType, role);
				if (
					types.has(moveType) && (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) &&
					(move.basePower || move.basePowerCallback)
				) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType, role);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Preferred Type
		if (!counter.get(preferredType)) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType, role);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && preferredType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, preferredType, role);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.has(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce pivoting moves on AV Pivot
		if (role === 'AV Pivot') {
			const pivotMoves = movePool.filter(moveid => ['flipturn', 'uturn', 'voltswitch'].includes(moveid));
			if (pivotMoves.length) {
				const moveid = this.sample(pivotMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce setup
		if (role.includes('Setup')) {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(moveid => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			} else {
				// No non-Speed setup moves, so add any (Speed) setup move
				const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
				if (setupMoves.length) {
					const moveid = this.sample(setupMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
		}

		// Enforce redirecting moves and Fake Out on Doubles Support
		if (role === 'Doubles Support') {
			for (const moveid of ['fakeout', 'followme', 'ragepowder']) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
			const speedControl = movePool.filter(moveid => SPEED_CONTROL.includes(moveid));
			if (speedControl.length) {
				const moveid = this.sample(speedControl);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Protect
		if (role.includes('Protect')) {
			const protectMoves = movePool.filter(moveid => PROTECT_MOVES.includes(moveid));
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && (move.category !== 'Status')) attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce coverage move
		if (!['AV Pivot', 'Fast Support', 'Bulky Support', 'Bulky Protect', 'Doubles Support'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttack = counter.damagingMoves.values().next().value!;
				const currentAttackType = this.getMoveType(currentAttack, species, abilities, role);
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, preferredType, role);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
		}

		// Enforce Weather setup on Setters
		if (role.includes('Setter')) {
			for (const moveid of WEATHER_SETUP) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
		}

		// Encourage weather-enhancing moves on matching weather teams
		for (const check of WEATHER_ENHANCING_MOVES) {
			if (!hasWeatherSynergy(teamDetails, abilities, check)) continue;
			for (const moveid of check.moves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
		}

		// Enforce Conduction on Magnetosphere teams
		if (hasWeatherDetail(teamDetails, abilities, 'magnetosphere')) {
			if (movePool.includes('conduction')) {
				counter = this.addMove('conduction', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Enforce Evoboost on Eevee/Skinka
		if (species.id === 'eevee' || species.id === 'skinka') {
			if (movePool.includes('evoboost')) {
				counter = this.addMove('evoboost', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Encourage Deception on Dragon types or on Blood Moon teams
		const hasBloodMoon = hasWeatherDetail(teamDetails, abilities, 'bloodMoon');
		const hasFairyDust = hasWeatherDetail(teamDetails, abilities, 'fairyDust');
		if (hasBloodMoon && types.has('Dragon')) {
			if (movePool.includes('deception')) {
				counter = this.addMove('deception', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		} else if ((hasBloodMoon || (types.has('Dragon') && !hasFairyDust)) && this.randomChance(1, 2)) {
			if (movePool.includes('deception')) {
				counter = this.addMove('deception', moves, types, abilities, teamDetails, species, isLead,
					movePool, preferredType, role, isDoubles);
			}
		}

		// Add (moves.size < this.maxMoveCount) as a condition if moves is getting larger than 4 moves.
		// If you want moves to be favored but not required, add something like && this.randomChance(1, 2) to your condition.

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			if (moves.size + movePool.length <= this.maxMoveCount) {
				for (const moveid of movePool) {
					moves.add(moveid);
				}
				break;
			}
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead,
				movePool, preferredType, role, isDoubles);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead,
						movePool, preferredType, role, isDoubles);
				}
			}
		}
		return moves;
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		role: RandomTeamsTypes.Role,
		isLead: boolean,
		isDoubles: boolean,
	): boolean {
		for (const check of WEATHER_DISCOURAGED_ABILITIES) {
			if (check.abilities.includes(ability) && teamDetails[check.name]) return true;
		}

		switch (ability) {
		// Abilities which are primarily useful for certain moves or with team support
		case 'Defiant':
			return (species.id === 'thundurus' && !!counter.get('Status'));
		case 'Iron Fist': case 'Skill Link':
			return !counter.get(toID(ability));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Swarm':
			return !counter.get('Bug');
		case 'Prankster':
			return !counter.get('Status');
		case 'Torrent':
			return (!counter.get('Water') && !moves.has('flipturn'));
		case 'Chlorophyll': case 'Solar Power':
			return !(teamDetails.sun || movesHaveWeatherDetail(moves, 'sun'));
		case 'Leaf Guard':
			return !(
				(teamDetails.sun || movesHaveWeatherDetail(moves, 'sun')) ||
				teamDetails.pollen || movesHaveWeatherDetail(moves, 'pollen')
			);
		case 'Hydration': case 'Swift Swim':
			return !(teamDetails.rain || movesHaveWeatherDetail(moves, 'rain'));
		case 'Petrichor':
			return !(
				teamDetails.rain || movesHaveWeatherDetail(moves, 'rain') ||
				teamDetails.bloodMoon || movesHaveWeatherDetail(moves, 'bloodMoon')
			);
		case 'Slush Rush': case 'Snow Cloak': case 'Absolute Zero': case 'Glacial Armor':
			return !(teamDetails.snow || movesHaveWeatherDetail(moves, 'snow'));
		case 'Malice':
			return !(teamDetails.bloodMoon || movesHaveWeatherDetail(moves, 'bloodMoon'));
		case 'Shadow Step':
			return !(
				teamDetails.bloodMoon || movesHaveWeatherDetail(moves, 'bloodMoon') ||
				teamDetails.paranormalActivity || movesHaveWeatherDetail(moves, 'paranormalActivity')
			);
		case 'Warp Mist':
			return !(teamDetails.fog || movesHaveWeatherDetail(moves, 'fog'));
		case 'Sand Rush': case 'Sand Veil':
			return !(teamDetails.sand || movesHaveWeatherDetail(moves, 'sand'));
		case 'Dust Gather':
			return !(teamDetails.dust || movesHaveWeatherDetail(moves, 'dust'));
		case 'Earth Force':
			return !(
				teamDetails.sand || movesHaveWeatherDetail(moves, 'sand') ||
				teamDetails.dust || movesHaveWeatherDetail(moves, 'dust')
			);
		case 'Bloomspring': case 'Grass Pelt':
			return !(teamDetails.pollen || movesHaveWeatherDetail(moves, 'pollen'));
		case 'Powder Cure':
			return !(teamDetails.pheromones || movesHaveWeatherDetail(moves, 'pheromones'));
		case 'Carbon Capture':
			return !(teamDetails.smog || movesHaveWeatherDetail(moves, 'smog'));
		case 'Power Above':
			return !(teamDetails.fairyDust || movesHaveWeatherDetail(moves, 'fairyDust'));
		case 'Druidry':
			return !(
				(teamDetails.fairyDust || movesHaveWeatherDetail(moves, 'fairyDust')) &&
				(teamDetails.strongWinds || movesHaveWeatherDetail(moves, 'strongWinds'))
			);
		case 'Rage State': case 'Trained Eye':
			return !(teamDetails.battleAura || movesHaveWeatherDetail(moves, 'battleAura'));
		case 'Sweet Dreams': case 'Smoke and Mirrors':
			return !(teamDetails.dreamscape || movesHaveWeatherDetail(moves, 'dreamscape'));
		case 'Power Within': case 'Indomitable':
			return !(teamDetails.dragonForce || movesHaveWeatherDetail(moves, 'dragonForce'));
		case 'Energizer': case 'Forked': case 'Surge Surfer':
			return !(teamDetails.thunderstorm || movesHaveWeatherDetail(moves, 'thunderstorm'));
		case 'Nanomachines': case 'Machine Precision': case 'Magnapult':
			return !(teamDetails.magnetosphere || movesHaveWeatherDetail(moves, 'magnetosphere'));
		}

		return false;
	}

	getAbility(
		types: Set<string>,
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (abilities.length <= 1) return abilities[0];

		// Hard-code abilities here
		if (abilities.includes('Flash Fire') && this.dex.getEffectiveness('Fire', species) >= 1) return 'Flash Fire';
		if ((species.id === 'thundurus' || species.id === 'tornadus') && !counter.get('Physical')) return 'Prankster';
		if (species.id === 'swampert' && (counter.get('Water') || moves.has('flipturn'))) return 'Torrent';
		if (species.id === 'toucannon' && counter.get('skilllink')) return 'Skill Link';
		if (abilities.includes('Slush Rush') && moves.has('snowscape')) return 'Slush Rush';
		if (species.id === 'golduck' && teamDetails.rain) return 'Swift Swim';
		// swse
		if (species.id === 'umbralu' && (teamDetails.rain || teamDetails.bloodMoon)) return 'Petrichor';
		for (const check of WEATHER_ABILITY_MOVE_CHECKS) {
			if (!check.moves.some(move => moves.has(move))) continue;
			const ability = getWeatherAbility(abilities, check.id);
			if (ability) return ability;
		}
		for (const check of WEATHER_ABILITY_CHECKS) {
			if (!check.setupMove.some(move => moves.has(move))) continue;
			const ability = getWeatherAbility(abilities, check.id);
			if (ability) return ability;
		}

		// Hard-code weather abilities
		// If you don't have a weather setter, prioritize one.
		for (const check of WEATHER_ABILITY_CHECKS) {
			if (check.category === 'clearingWeather' || hasWeatherSetter(teamDetails)) continue;
			const ability = getWeatherAbility(abilities, check.id);
			if (ability) return ability;
		}
		// If you have a weather present on your team prioritize weather abilities for that weather
		const weatherAbilitiesAllowed: string[] = [];
		for (const weather of WEATHER_ENHANCING_MOVES) {
			if (!teamDetails[weather.name]) continue;
			for (const ability of weather.abilities) {
				if (abilities.includes(ability)) weatherAbilitiesAllowed.push(ability);
			}
		}
		if (weatherAbilitiesAllowed.length) return this.sample(weatherAbilitiesAllowed);

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, teamDetails, species, role, isLead, isDoubles
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(a => WEATHER_ENHANCING_MOVES.some(weather => weather.abilities.includes(a)));
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	getPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
		isDoubles: boolean,
	) {
		if (!isDoubles) {
			if (role === 'Fast Bulky Setup' && (ability === 'Quark Drive' || ability === 'Protosynthesis')) {
				return 'Booster Energy';
			}
			if (species.id === 'lokix') {
				return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
			}
		}
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (
			role.includes('Setter') && (
				species.id === 'castform' || species.id === 'cherrim' ||
				// species.id === 'abomasnow' || species.id === 'abomasnowlowland' ||
				// species.id === 'snover' || species.id === 'snoverlowland' ||
				// species.id === 'eecroach' || species.id === 'drout' ||
				species.id === 'blurrun' || species.id === 'bearvoyance'
			)
		) return 'Weather Vane';
		if (species.id === 'pikachu' || species.id === 'pichu') return 'Light Ball';
		if (species.id === 'raichu' || species.id === 'emolga' || species.id === 'guruchi') return 'Light Ball';
		if (species.id === 'bearvoyance') return 'Thick Club';
		if (role === 'AV Pivot') return 'Assault Vest';
		if (species.id === 'regieleki') return 'Magnet';
		if (types.has('Normal') && moves.has('doubleedge') && moves.has('fakeout')) return 'Silk Scarf';
		if (
			species.id === 'froslass' || moves.has('populationbomb') ||
			(ability === 'Hustle' && counter.get('setup') && !isDoubles && this.randomChance(1, 2))
		) return 'Wide Lens';
		if (species.id === 'smeargle' && !isDoubles) return 'Focus Sash';
		if (moves.has('clangoroussoul') || (species.id === 'toxtricity' && moves.has('shiftgear'))) return 'Throat Spray';
		if (
			(species.baseSpecies === 'Magearna' && moves.has('shiftgear') && this.randomChance(1, 2)) ||
			species.id === 'necrozmaduskmane' || (species.id === 'calyrexice' && isDoubles)
		) return 'Weakness Policy';
		if (['dragonenergy', 'lastrespects', 'waterspout'].some(m => moves.has(m))) return 'Choice Scarf';
		if (
			!isDoubles && (ability === 'Imposter' || (species.id === 'magnezone' && role === 'Fast Attacker'))
		) return 'Choice Scarf';
		if (species.id === 'rampardos' && (role === 'Fast Attacker' || isDoubles)) return 'Choice Scarf';
		if (species.id === 'palkia' && counter.get('Status')) return 'Lustrous Orb';
		if (
			moves.has('courtchange') ||
			!isDoubles && (species.id === 'luvdisc' || (species.id === 'terapagos' && !moves.has('rest')))
		) return 'Heavy-Duty Boots';
		if (
			['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m) ||
			moves.has('bellydrum') || moves.has('filletaway')
		) {
			return 'Sitrus Berry';
		}
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && role !== 'Doubles Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (counter.get('Status') && (species.name === 'Latias' || species.name === 'Latios')) return 'Soul Dew';
		if (species.id === 'scyther' && !isDoubles) return (isLead && !moves.has('uturn')) ? 'Eviolite' : 'Heavy-Duty Boots';
		if (ability === 'Poison Heal' || ability === 'Quick Feet') return 'Toxic Orb';
		if (species.nfe) return 'Eviolite';
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.has('Ice') || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Frost Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (ability === 'Anger Shell') return this.sample(['Expert Belt', 'Lum Berry', 'Scope Lens', 'Sitrus Berry']);
		if (moves.has('dragondance') && isDoubles) return 'Clear Amulet';
		if (counter.get('skilllink') && ability !== 'Skill Link' && species.id !== 'breloom') return 'Loaded Dice';
		if (ability === 'Unburden') {
			return (moves.has('closecombat') || moves.has('leafstorm')) ? 'White Herb' : 'Sitrus Berry';
		}
		if (moves.has('shellsmash') && ability !== 'Weak Armor') return 'White Herb';
		if (moves.has('meteorbeam') ||
			(moves.has('electroshot') && (!teamDetails.rain && !teamDetails.thunderstorm))) return 'Power Herb';
		if (moves.has('acrobatics') && ability !== 'Protosynthesis') return '';
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		// swse
		const weatherSetupItem = getWeatherSetupItem(ability, moves, role);
		if (role.includes('Setter') && weatherSetupItem) return weatherSetupItem;
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (species.id === 'giratina' && !isDoubles && moves.has('rest') && !moves.has('sleeptalk')) return 'Leftovers';
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin'
		) {
			return 'Chesto Berry';
		}
		if (
			species.id !== 'yanmega' &&
			this.dex.getEffectiveness('Rock', species) >= 2 && (!types.has('Flying') || !isDoubles)
		) return 'Heavy-Duty Boots';
	}

	/** Item generation specific to Random Doubles */
	getDoublesItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const scarfReqs = (
			!counter.get('priority') && ability !== 'Speed Boost' && role !== 'Doubles Wallbreaker' &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			this.randomChance(1, 2)
		);
		const offensiveRole = (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Doubles Setup Sweeper', 'Offensive Protect'].some(m => role === m)
		);

		if (species.id === 'ursalunabloodmoon' && moves.has('protect')) return 'Silk Scarf';
		if (
			moves.has('flipturn') && moves.has('protect') && (moves.has('aquajet') || (moves.has('jetpunch')))
		) return 'Mystic Water';
		if (counter.get('speedsetup') && role === 'Doubles Bulky Setup') return 'Weakness Policy';
		if (moves.has('blizzard') && ability !== 'Snow Warning' && !teamDetails.snow) return 'Blunder Policy';

		if (role === 'Choice Item user') {
			if (scarfReqs || moves.has('finalgambit') || species.id === 'jirachi') return 'Choice Scarf';
			return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
		}
		if (counter.get('Physical') >= moves.size &&
			['fakeout', 'feint', 'firstimpression', 'rapidspin', 'suckerpunch'].every(m => !moves.has(m)) &&
			(moves.has('flipturn') || moves.has('uturn') || role === 'Doubles Wallbreaker')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			((counter.get('Special') >= moves.size && (moves.has('voltswitch') || role === 'Doubles Wallbreaker')) || (
				counter.get('Special') >= moves.size - 1 && (moves.has('uturn') || moves.has('flipturn'))
			)) && !moves.has('electroweb')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			species.baseStats.spe <= 70 && (moves.has('ragepowder') || moves.has('followme'))
		) return 'Rocky Helmet';
		if (
			ability === 'Intimidate' && this.dex.getEffectiveness('Rock', species) >= 1 &&
			(!types.has('Flying') || this.dex.getEffectiveness('Rock', species) >= 2)
		) return 'Heavy-Duty Boots';
		if (
			(role === 'Bulky Protect' && counter.get('setup')) ||
			['irondefense', 'coil', 'acidarmor', 'wish'].some(m => moves.has(m)) ||
			(counter.get('recovery') && !moves.has('strengthsap') && !counter.get('speedcontrol') && !offensiveRole) ||
			(PROTECT_MOVES.some(m => moves.has(m)) && (moves.has('leechseed') || moves.has('pricklypear'))) ||
			species.id === 'regigigas'
		) return 'Leftovers';
		if (moves.has('hypervoice') && !types.has('Normal')) return 'Throat Spray';
		if (
			role === 'Doubles Fast Attacker' && !counter.get('recoil') &&
			species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 230
		) return 'Focus Sash';
		if (
			offensiveRole && !moves.has('fakeout') &&
			(!moves.has('uturn') || types.has('Bug') || ability === 'Libero') &&
			((!moves.has('icywind') && !moves.has('electroweb')) || species.id === 'ironbundle')
		) {
			return (
				(ability === 'Quark Drive' || ability === 'Protosynthesis') && !isLead && species.id !== 'ironvaliant' &&
				['dracometeor', 'firstimpression', 'uturn', 'voltswitch'].every(m => !moves.has(m))
			) ? 'Booster Energy' : 'Life Orb';
		}
		if (isLead && (species.id === 'glimmora' ||
			(['Doubles Wallbreaker', 'Offensive Protect'].includes(role) &&
				species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 230))
		) return 'Focus Sash';
		if (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Offensive Protect'].includes(role) && moves.has('fakeout')
		) {
			return (this.dex.getEffectiveness('Rock', species) >= 1) ? 'Heavy-Duty Boots' : 'Clear Amulet';
		}
		if (!counter.get('Status')) return 'Assault Vest';
		return 'Sitrus Berry';
	}

	getItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		preferredType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const lifeOrbReqs = ['flamecharge', 'nuzzle', 'rapidspin',
			'earthrush'].every(m => !moves.has(m));

		if (
			species.id !== 'jirachi' && (counter.get('Physical') >= moves.size) &&
			['dragontail', 'fakeout', 'firstimpression', 'flamecharge', 'rapidspin', 'trailblaze',
				'earthrush'].every(m => !moves.has(m))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				(species.baseStats.atk >= 100 || ability === 'Huge Power' || ability === 'Pure Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			(counter.get('Special') >= moves.size) ||
			(counter.get('Special') >= moves.size - 1 && ['flipturn', 'uturn'].some(m => moves.has(m)))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && ability !== 'Tinted Lens' && !moves.has('uturn') && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('speedsetup') && !counter.get('physicalsetup') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			!counter.get('Status') &&
			!['Fast Attacker', 'Wallbreaker'].includes(role)
		) {
			return 'Assault Vest';
		}
		if (species.id === 'golem') return (counter.get('speedsetup')) ? 'Weakness Policy' : 'Custap Berry';
		if (moves.has('substitute')) return 'Leftovers';
		if (
			moves.has('stickyweb') && isLead &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) <= 235
		) return 'Focus Sash';
		if (this.dex.getEffectiveness('Rock', species) >= 1) return 'Heavy-Duty Boots';
		if (
			(moves.has('chillyreception') || (
				role === 'Fast Support' &&
				[...PIVOT_MOVES, 'defog', 'mortalspin', 'rapidspin'].some(m => moves.has(m)) &&
				!types.has('Flying') && ability !== 'Levitate'
			))
		) return 'Heavy-Duty Boots';

		// Low Priority
		if (moves.has('dragondance') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			ability === 'Rough Skin' || (
				ability === 'Regenerator' && (role === 'Bulky Support' || role === 'Bulky Attacker') &&
				(species.baseStats.hp + species.baseStats.def) >= 180 && this.randomChance(1, 2)
			) || (
				ability !== 'Regenerator' && !counter.get('setup') && counter.get('recovery') &&
				this.dex.getEffectiveness('Fighting', species) < 1 &&
				(species.baseStats.hp + species.baseStats.def) > 200 && this.randomChance(1, 2)
			)
		) return 'Rocky Helmet';
		if (moves.has('outrage') && counter.get('setup')) return 'Lum Berry';
		if (moves.has('protect') && ability !== 'Speed Boost') return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && !counter.get('recovery') && !counter.get('recoil') &&
			(counter.get('hazards') || counter.get('setup')) && species.id !== 'stackem' &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) < 258
		) return 'Focus Sash';
		if (
			!counter.get('setup') && ability !== 'Levitate' && this.dex.getEffectiveness('Ground', species) >= 2
		) return 'Air Balloon';
		if (['Bulky Attacker', 'Bulky Support', 'Bulky Setup'].some(m => role === (m))) return 'Leftovers';
		if (species.id === 'pawmot' && moves.has('nuzzle')) return 'Leppa Berry';
		if (role === 'Fast Support' || role === 'Fast Bulky Setup') {
			return (
				counter.get('Physical') + counter.get('Special') > counter.get('Status') && lifeOrbReqs
			) ? 'Life Orb' : 'Leftovers';
		}
		if (
			lifeOrbReqs && ['Fast Attacker', 'Setup Sweeper', 'Wallbreaker'].some(m => role === (m))
		) return 'Life Orb';
		return 'Leftovers';
	}

	getLevel(
		species: Species,
		isDoubles = false,
	): number {
		if (this.adjustLevel) return this.adjustLevel;
		// doubles levelling
		if (isDoubles && this.randomDoublesSets[species.id]["level"]) return this.randomDoublesSets[species.id]["level"]!;
		if (!isDoubles && this.randomSets[species.id]["level"]) return this.randomSets[species.id]["level"]!;
		// Gen 2 still uses tier-based levelling
		if (this.gen === 2) {
			const levelScale: { [k: string]: number } = {
				ZU: 81,
				ZUBL: 79,
				PU: 77,
				PUBL: 75,
				NU: 73,
				NUBL: 71,
				UU: 69,
				UUBL: 67,
				OU: 65,
				Uber: 61,
			};
			if (levelScale[species.tier]) return levelScale[species.tier];
		}
		// Default to 80
		return 80;
	}

	getForme(species: Species): string {
		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			return species.battleOnly;
		}
		if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));
		if (species.name.endsWith('-Gmax')) return species.name.slice(0, -5);

		// Consolidate mostly-cosmetic formes, at least for the purposes of Random Battles
		if (['Dudunsparce', 'Maushold', 'Polteageist', 'Sinistcha', 'Zarude'].includes(species.baseSpecies)) {
			return this.sample([species.name].concat(species.otherFormes!));
		}
		if (species.baseSpecies === 'Basculin') return 'Basculin' + this.sample(['', '-Blue-Striped']);
		if (species.baseSpecies === 'Magearna') return 'Magearna' + this.sample(['', '-Original']);
		if (species.baseSpecies === 'Keldeo' && this.gen <= 7) return 'Keldeo' + this.sample(['', '-Resolute']);
		if (species.baseSpecies === 'Pikachu' && this.gen >= 8) {
			return 'Pikachu' + this.sample(
				['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']
			);
		}
		return species.name;
	}

	randomSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		const forme = this.getForme(species);
		const sets = this[`random${isDoubles ? 'Doubles' : ''}Sets`][species.id]["sets"];
		const possibleSets: RandomTeamsTypes.RandomSetData[] = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Fast Bulky Setup on lead Paradox Pokemon, since it generates Booster Energy.
			const abilities = set.abilities!;
			if (
				isLead && (abilities.includes('Protosynthesis') || abilities.includes('Quark Drive')) &&
				set.role === 'Fast Bulky Setup'
			) continue;
			// Prevent weather setters of opposing weathers in Doubles
			if (isDoubles && set.role.includes('Setter')) {
				if (teamDetails.climateWeather) {
					if (teamDetails.sun && !set.role.includes('Sun Setter')) continue;
					if (teamDetails.rain && !set.role.includes('Rain Setter')) continue;
					if (teamDetails.snow && !set.role.includes('Snow Setter')) continue;
					if (teamDetails.bloodMoon && !set.role.includes('Blood Moon Setter')) continue;
					if (teamDetails.fog && !set.role.includes('Fog Setter')) continue;
				}
				if (teamDetails.irritantWeather) {
					if (teamDetails.sand && !set.role.includes('Sandstorm Setter')) continue;
					if (teamDetails.dust && !set.role.includes('Dust Storm Setter')) continue;
					if (teamDetails.pollen && !set.role.includes('Pollen Setter')) continue;
					if (teamDetails.fairyDust && !set.role.includes('Fairy Dust Setter')) continue;
					if (teamDetails.pheromones && !set.role.includes('Pheromones Setter')) continue;
					if (teamDetails.smog && !set.role.includes('Smog Setter')) continue;
				}
				if (teamDetails.energyWeather) {
					if (teamDetails.battleAura && !set.role.includes('Battle Aura Setter')) continue;
					if (teamDetails.paranormalActivity && !set.role.includes('Paranormal Activity Setter')) continue;
					if (teamDetails.dragonForce && !set.role.includes('Dragon Force Setter')) continue;
					if (teamDetails.dreamscape && !set.role.includes('Dreamscape Setter')) continue;
					if (teamDetails.thunderstorm && !set.role.includes('Thunderstorm Setter')) continue;
					if (teamDetails.magnetosphere && !set.role.includes('Magnetosphere Setter')) continue;
				}
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const preferredTypes = set.preferredTypes!;
		const preferredType = this.sampleIfArray(preferredTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = new Set(species.types);
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, movePool,
			preferredType, role, isDoubles);
		const counter = this.queryMoves(moves, species, preferredType, abilities, role);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles,
			preferredType, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead,
			preferredType, role, isDoubles);
		if (item === undefined) {
			if (isDoubles) {
				item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
			} else {
				item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
			}
		}

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick', 'supercellslam'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry'].includes(item)) || species.id === 'minior') {
				// Two Substitutes should activate Sitrus Berry. Two switch-ins to Stealth Rock should activate Shields Down on Minior.
				if (hp % 4 === 0) break;
			} else if (
				(moves.has('bellydrum') || moves.has('filletaway') || moves.has('shedtail')) &&
				(item === 'Sitrus Berry' || ability === 'Gluttony')
			) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('endeavor')) {
				// Luvdisc should be able to Substitute down to very low HP
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins in singles
				if (isDoubles) break;
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		if (
			noAttackStatMoves && !moves.has('transform') && this.format.mod !== 'partnersincrime' &&
			!ruleTable.has('forceofthefallenmod')
		) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		return {
			name: species.baseSpecies,
			species: forme,
			speciesId: species.id,
			gender: species.baseSpecies === 'Greninja' ? 'M' : (species.gender || (this.random(2) ? 'F' : 'M')),
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			role,
		};
	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
		pokemonList: string[]
	): [{ [k: string]: string[] }, string[]] {
		const exclude = pokemonToExclude.map(p => toID(p.species));
		const pokemonPool: { [k: string]: string[] } = {};
		const baseSpeciesPool = [];
		for (const pokemon of pokemonList) {
			let species = this.dex.species.get(pokemon);
			if (exclude.includes(species.id)) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === 'string') {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}

			if (species.baseSpecies in pokemonPool) {
				pokemonPool[species.baseSpecies].push(pokemon);
			} else {
				pokemonPool[species.baseSpecies] = [pokemon];
			}
		}
		// Include base species 1x if 1-3 formes, 2x if 4-6 formes, 3x if 7+ formes
		for (const baseSpecies of Object.keys(pokemonPool)) {
			// Squawkabilly has 4 formes, but only 2 functionally different formes, so only include it 1x
			const weight = (baseSpecies === 'Squawkabilly') ? 1 : Math.min(Math.ceil(pokemonPool[baseSpecies].length / 3), 3);
			for (let i = 0; i < weight; i++) baseSpeciesPool.push(baseSpecies);
		}
		return [pokemonPool, baseSpeciesPool];
	}

	/**
	 * Checks if the new species is compatible with the other mons currently on the team.
	 */
	getPokemonCompatibility(
		species: Species,
		pokemon: RandomTeamsTypes.RandomSet[],
		isDoubles = false
	): boolean {
		const webSetters = [
			'ariados', 'smeargle', 'masquerain', 'kricketune', 'leavanny', 'galvantula', 'vikavolt', 'ribombee', 'araquanid', 'spidops',
			'caragen', 'kaskazog',
		];
		const screenSetters = ['meowstic', 'grimmsnarl', 'ninetalesalola', 'abomasnow'];

		const doublesWebSetters = ['ariados', 'kricketune', 'leavanny', 'galvantula', 'vikavolt', 'araquanid', 'spidops',
			'caragen', 'kaskazog',
		];
		const doublesScreenSetters = ['meowstic', 'klefki', 'grimmsnarl', 'ninetalesalola', 'abomasnow'];

		// Climate
		const sunSetters = ['ninetales', 'torkoal', 'groudon', 'koraidon',
			'flareon', 'revylon',
		];
		const rainSetters = ['politoed', 'pelipper', 'kyogre',
			'masquerain', 'azumarillkaskade', 'vaporeon', 'exeggutoralola',
		];
		const snowSetters = ['ninetalesalola', 'abomasnow'];
		const bloodMoonSetters = ['umbreon', 'mandibuzz', 'umbralu', 'spiritomb', 'leaoseace'];
		const fogSetters = ['enigmeon', 'wyrdeer', 'drampa'];

		// Irritant
		const sandSetters = ['tyranitar', 'hippowdon'];
		const dustSetters = ['dredgen', 'hippowdon', 'flygon', 'camerupt'];
		const pollenSetters = ['histameanie', 'lilligant', 'lilliganthisui', 'leafeon', 'whimsicott'];
		const pheromonesSetters = ['caragen', 'vivillon', 'mothim', 'weepollenf', 'vespiquen', 'pheromosa'];
		const smogSetters = ['pathagen', 'skuntankkaskade', 'garbodor', 'pestalation'];
		const fairyDustSetters = ['sylveon', 'shiinotic', 'gardevoir'];

		// Energy
		const battleAuraSetters = ['bludgen', 'desoray', 'gallade', 'lucario'];
		const paranormalActivitySetters = ['ectogen', 'gourgeistlarge', 'gourgeistsuper', 'chandelure', 'mismagius'];
		const dreamscapeSetters = ['espeon', 'xatu', 'beheeyem', 'musharna', 'lamentu'];
		const dragonForceSetters = ['legen', 'yanmage', 'tyrantrum', 'lapraskaskade'];
		const thunderstormSetters = ['jolteon', 'zebstrika', 'pincurchin', 'eelektross'];
		const magnetosphereSetters = ['chromagen', 'klinklang', 'beadamup', 'probopass'];

		// Clearing
		// const strongWindsSetters = ['aerogen', 'aeradio', 'altaria'];

		const incompatiblePokemon = [
			// These Pokemon with support roles are considered too similar to each other.
			['blissey', 'chansey'],
			['illumise', 'volbeat'],

			// These combinations are prevented to avoid double webs or screens.
			[webSetters, webSetters],
			[screenSetters, screenSetters],

			// These Pokemon are incompatible because the presence of one actively harms the other.
			// Prevent Dry Skin + sun setting ability
			['toxicroak', sunSetters],
		];

		const doublesIncompatiblePokemon = [
			// These Pokemon with support roles are considered too similar to each other.
			['illumise', 'volbeat'],
			[['minun', 'plusle', 'pachirisu', 'raichu'], ['minun', 'plusle', 'pachirisu', 'raichu']],

			// These combinations are prevented to avoid double webs or screens.
			[doublesWebSetters, doublesWebSetters],
			[doublesScreenSetters, doublesScreenSetters],

			// These Pokemon are incompatible because the presence of one actively harms the other.
			// Prevent Dry Skin + sun setting ability
			['toxicroak', sunSetters],

			// Prevent conflicting weather abilities from generating together
			// Climate
			[sunSetters, [...rainSetters, ...snowSetters, ...bloodMoonSetters, ...fogSetters]],
			[rainSetters, [...snowSetters, ...bloodMoonSetters, ...fogSetters]],
			[snowSetters, [...bloodMoonSetters, ...fogSetters]],
			[bloodMoonSetters, fogSetters],
			// Irritant
			[sandSetters, [...dustSetters, ...pollenSetters, ...pheromonesSetters, ...smogSetters, ...fairyDustSetters]],
			[dustSetters, [...pollenSetters, ...pheromonesSetters, ...smogSetters, ...fairyDustSetters]],
			[pollenSetters, [...pheromonesSetters, ...smogSetters, ...fairyDustSetters]],
			[pheromonesSetters, [...smogSetters, ...fairyDustSetters]],
			[smogSetters, fairyDustSetters],
			// Energy
			[battleAuraSetters, [...paranormalActivitySetters, ...dreamscapeSetters, ...dragonForceSetters, ...thunderstormSetters,
				...magnetosphereSetters]],
			[paranormalActivitySetters, [...dreamscapeSetters, ...dragonForceSetters, ...thunderstormSetters,
				...magnetosphereSetters]],
			[dreamscapeSetters, [...dragonForceSetters, ...thunderstormSetters, ...magnetosphereSetters]],
			[dragonForceSetters, [...thunderstormSetters, ...magnetosphereSetters]],
			[thunderstormSetters, magnetosphereSetters],
		];

		const incompatibilityList = isDoubles ? doublesIncompatiblePokemon : incompatiblePokemon;
		for (const pair of incompatibilityList) {
			const monsArrayA = (Array.isArray(pair[0])) ? pair[0] : [pair[0]];
			const monsArrayB = (Array.isArray(pair[1])) ? pair[1] : [pair[1]];
			if (monsArrayB.includes(species.id)) {
				if (pokemon.some(m => monsArrayA.includes(m.speciesId!))) return false;
			}
			if (monsArrayA.includes(species.id)) {
				if (pokemon.some(m => monsArrayB.includes(m.speciesId!))) return false;
			}
		}

		return true;
	}

	randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');
	randomDoublesSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./doubles-sets.json');

	randomTeam(depth = 0): RandomTeamsTypes.RandomSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = isDoubles ? Object.keys(this.randomDoublesSets) : Object.keys(this.randomSets);
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		let leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			const weakToEmberPlume = (
				this.dex.getEffectiveness('Fire', species) > 0 ||
				(this.dex.getEffectiveness('Fire', species) > -2 && types.includes('Flying'))
			);
			const weakToSlushBall = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Fire'))
			);
			const weakToDeception = (
				this.dex.getEffectiveness('Dark', species) > 0 ||
				(this.dex.getEffectiveness('Dark', species) > -2 && types.includes('Fairy'))
			);
			const weakToDarkDepletion = (
				(this.dex.getEffectiveness('Dark', species) > 0 ||
					(this.dex.getEffectiveness('Dark', species) > -2 && types.includes('Grass'))) &&
					(this.dex.getEffectiveness('Dark', species) > 0 ||
						(this.dex.getEffectiveness('Dark', species) > -2 && types.includes('Water')))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			if (!isMonotype && !this.forceMonotype) {
				let skip = false;

				// Limit two of any type
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type, and one double weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
					if (this.dex.getEffectiveness(typeName, species) > 1) {
						if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
						if (typeDoubleWeaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
					if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
				}

				// Limit four weak to Freeze-Dry/Ember Plume/Slushball/Deception/Dark Depletion
				if (weakToFreezeDry) {
					if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
					if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
				}
				if (weakToEmberPlume) {
					if (!typeWeaknesses['Ember Plume']) typeWeaknesses['Ember Plume'] = 0;
					if (typeWeaknesses['Ember Plume'] >= 4 * limitFactor) continue;
				}
				if (weakToSlushBall) {
					if (!typeWeaknesses['Slushball']) typeWeaknesses['Slushball'] = 0;
					if (typeWeaknesses['Slushball'] >= 4 * limitFactor) continue;
				}
				if (weakToDeception) {
					if (!typeWeaknesses['Deception']) typeWeaknesses['Deception'] = 0;
					if (typeWeaknesses['Deception'] >= 4 * limitFactor) continue;
				}
				if (weakToDarkDepletion) {
					if (!typeWeaknesses['Dark Depletion']) typeWeaknesses['Dark Depletion'] = 0;
					if (typeWeaknesses['Dark Depletion'] >= 4 * limitFactor) continue;
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species, isDoubles) === 100) && numMaxLevelPokemon >= limitFactor) {
					continue;
				}

				// Check compatibility with team
				if (!this.getPokemonCompatibility(species, pokemon, isDoubles)) continue;
			}

			// Limit three of any type combination in Monotype
			if (!this.forceMonotype && isMonotype && (typeComboCount[typeCombo] >= 3 * limitFactor)) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			let set: RandomTeamsTypes.RandomSet;

			if (leadsRemaining) {
				if (
					isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) ||
					!isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)
				) {
					if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
					set = this.randomSet(species, teamDetails, false, isDoubles);
					pokemon.push(set);
				} else {
					set = this.randomSet(species, teamDetails, true, isDoubles);
					pokemon.unshift(set);
					leadsRemaining--;
				}
			} else {
				set = this.randomSet(species, teamDetails, false, isDoubles);
				pokemon.push(set);
			}

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;
			if (weakToEmberPlume) typeWeaknesses['Ember Plume']++;
			if (weakToSlushBall) typeWeaknesses['Slushball']++;
			if (weakToDeception) typeWeaknesses['Deception']++;
			if (weakToDarkDepletion) typeWeaknesses['Dark Depletion']++;

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Track what the team has
			if (setHasWeatherSetter(set)) teamDetails.weatherSetter = 1;
			for (const check of WEATHER_ABILITY_CHECKS) {
				if (toID(set.ability) === check.id || check.setupMove.some(move => set.moves.includes(move))) {
					teamDetails[check.name] = 1;
				}
			}
			for (const check of WEATHER_ENHANCING_MOVES) {
				if (check.abilities.includes(set.ability)) {
					teamDetails[check.name] = 1;
					teamDetails[check.category] = 1;
				}
			}
			if (teamDetails.sun || teamDetails.rain || teamDetails.snow || teamDetails.bloodMoon || teamDetails.fog ||
				(isDoubles && set.ability === 'Cloud Nine')) {
				teamDetails.climateWeather = 1;
			}
			if (teamDetails.sand || teamDetails.dust || teamDetails.pollen || teamDetails.pheromones || teamDetails.smog ||
				teamDetails.fairyDust) {
				teamDetails.irritantWeather = 1;
			}
			if (teamDetails.battleAura || teamDetails.paranormalActivity || teamDetails.dreamscape || teamDetails.dragonForce ||
				teamDetails.thunderstorm || teamDetails.magnetosphere) {
				teamDetails.energyWeather = 1;
			}
			if (set.moves.includes('healbell') || set.moves.includes('aromatherapy') ||
				set.moves.includes('efflorescence') || set.moves.includes('languishingaura')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe') ||
				set.ability === 'Rocky Body') teamDetails.stealthRock = 1;
			if (set.moves.includes('steelbarbs')) teamDetails.steelBarbs = 1;
			if (set.moves.includes('stickyweb') || set.ability === 'Nasty Webbing') teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}
		if (isDoubles && !pokemon.some(set => setHasWeatherSetter(set))) {
			if (depth >= 12) {
				throw new Error(`Could not build a random team with a weather setter for ${this.format} (seed=${seed})`);
			}
			return this.randomTeam(depth + 1);
		}

		return pokemon;
	}

	randomCCTeam(): RandomTeamsTypes.RandomSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const dex = this.dex;
		const team = [];

		const natures = this.dex.natures.all();
		const items = this.dex.items.all();

		const isMonotype = !!this.forceMonotype || this.dex.formats.getRuleTable(this.format).has('sametypeclause');
		const typePool = this.dex.types.names().filter(name => name !== "Stellar");
		const type = isMonotype ? this.forceMonotype || this.sample(typePool) : undefined;

		const randomN = this.randomNPokemon(this.maxTeamSize, type, undefined, undefined, true);

		for (let forme of randomN) {
			let species = dex.species.get(forme);
			if (species.isNonstandard) species = dex.species.get(species.baseSpecies);

			// Random legal item
			let item = '';
			let isIllegalItem;
			let isBadItem;
			if (this.gen >= 2) {
				do {
					item = this.sample(items).name;
					isIllegalItem = this.dex.items.get(item).gen > this.gen || this.dex.items.get(item).isNonstandard;
					isBadItem = item.startsWith("TR") || this.dex.items.get(item).isPokeball;
				} while (isIllegalItem || (isBadItem && this.randomChance(19, 20)));

				// We don't want to revert to different types in monotype
				if (isMonotype && species.requiredItems) {
					if (!species.changesFrom) throw new Error(`${species.name} needs a changesFrom value`);

					if (!dex.species.get(species.changesFrom).types.includes(type!)) {
						const legalRequiredItems = species.requiredItems.filter(i => (
							dex.items.get(i).gen <= this.gen && !dex.items.get(i).isNonstandard
						));
						if (!legalRequiredItems.length) throw new Error(`${species.name} has no legal required items`);
						item = this.sample(legalRequiredItems);
					}
				}
			}

			// Make sure forme is legal
			if (species.battleOnly) {
				if (typeof species.battleOnly === 'string') {
					species = dex.species.get(species.battleOnly);
				} else {
					species = dex.species.get(this.sample(species.battleOnly));
				}
				forme = species.name;
			}
			if (species.requiredItems?.every(req => toID(req) !== toID(item))) {
				if (!species.changesFrom) throw new Error(`${species.name} needs a changesFrom value`);
				species = dex.species.get(species.changesFrom);
				forme = species.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.dex.items.get(item);
			if (itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies) {
				do {
					itemData = this.sample(items);
					item = itemData.name;
				} while (
					itemData.gen > this.gen ||
					itemData.isNonstandard ||
					(itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies)
				);
			}

			// Random legal ability
			const abilities = Object.values(species.abilities).filter(a => this.dex.abilities.get(a).gen <= this.gen);
			const ability: string = this.gen <= 2 ? 'No Ability' : this.sample(abilities);

			// Four random unique moves from the movepool
			let pool = ['struggle'];
			if (forme === 'Smeargle') {
				pool = this.dex.moves.all()
					.filter(move => !(move.isNonstandard || move.isZ || move.isMax || move.realMove))
					.map(m => m.id);
			} else {
				pool = [...this.dex.species.getMovePool(species.id)];
			}

			const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);

			// Random EVs
			const evs: StatsTable = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const s: StatID[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = this.sample(s);
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			const nature = this.sample(natures).name;

			// Level balance--calculate directly from stats rather than using some silly lookup table
			const mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = species.baseStats;
			// If Wishiwashi/Eecroach, use the school/swarm-forme's much higher stats
			if (species.baseSpecies === 'Wishiwashi') stats = Dex.species.get('wishiwashischool').baseStats;
			if (species.baseSpecies === 'Eecroach') stats = Dex.species.get('eecroachswarm').baseStats;
			// If Terapagos, use Terastal-forme's stats
			if (species.baseSpecies === 'Terapagos') stats = Dex.species.get('terapagosterastal').baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

				while (level < 100) {
					mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
					// Since damage is roughly proportional to level
					mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: RandomTeamsTypes.RandomSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender || (this.random(2) ? 'F' : 'M'),
				item,
				ability,
				moves,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			team.push(set);
		}

		return team;
	}

	private getPools(requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Memoize pool and speciesPool because, at least during tests, they are constructed with the same parameters
		// hundreds of times and are expensive to compute.
		const isNotCustom = !ruleTable;
		let pool: number[] = [];
		let speciesPool: Species[] = [];
		const ck = this.poolsCacheKey;
		if (ck && this.cachedPool && this.cachedSpeciesPool &&
			ck[0] === requiredType && ck[1] === minSourceGen && ck[2] === ruleTable && ck[3] === requireMoves) {
			speciesPool = this.cachedSpeciesPool.slice();
			pool = this.cachedPool.slice();
		} else if (isNotCustom) {
			speciesPool = [...this.dex.species.all()];
			for (const species of speciesPool) {
				if (species.isNonstandard && species.isNonstandard !== 'Unobtainable') continue;
				if (requireMoves) {
					const hasMovesInCurrentGen = this.dex.species.getMovePool(species.id).size;
					if (!hasMovesInCurrentGen) continue;
				}
				if (requiredType && !species.types.includes(requiredType)) continue;
				if (minSourceGen && species.gen < minSourceGen) continue;
				const num = species.num;
				if (num <= 0 || pool.includes(num)) continue;
				pool.push(num);
			}
			this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
			this.cachedPool = pool.slice();
			this.cachedSpeciesPool = speciesPool.slice();
		} else {
			const EXISTENCE_TAG = ['past', 'future', 'lgpe', 'unobtainable', 'cap', 'custom', 'nonexistent'];
			const nonexistentBanReason = ruleTable.check('nonexistent');
			// Assume tierSpecies does not differ from species here (mega formes can be used without their stone, etc)
			for (const species of this.dex.species.all()) {
				if (requiredType && !species.types.includes(requiredType)) continue;

				let banReason = ruleTable.check('pokemon:' + species.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (species.isMega && ruleTable.check('pokemontag:mega')) continue;

					banReason = ruleTable.check('basepokemon:' + toID(species.baseSpecies));
					if (banReason) continue;
					if (banReason !== '' || this.dex.species.get(species.baseSpecies).isNonstandard !== species.isNonstandard) {
						const nonexistentCheck = Tags.nonexistent.genericFilter!(species) && nonexistentBanReason;
						let tagWhitelisted = false;
						let tagBlacklisted = false;
						for (const ruleid of ruleTable.tagRules) {
							if (ruleid.startsWith('*')) continue;
							const tagid = ruleid.slice(12) as ID;
							const tag = Tags[tagid];
							if ((tag.speciesFilter || tag.genericFilter)!(species)) {
								const existenceTag = EXISTENCE_TAG.includes(tagid);
								if (ruleid.startsWith('+')) {
									if (!existenceTag && nonexistentCheck) continue;
									tagWhitelisted = true;
									break;
								}
								tagBlacklisted = true;
								break;
							}
						}
						if (tagBlacklisted) continue;
						if (!tagWhitelisted) {
							if (ruleTable.check('pokemontag:allpokemon')) continue;
						}
					}
				}
				speciesPool.push(species);
				const num = species.num;
				if (pool.includes(num)) continue;
				pool.push(num);
			}
			this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
			this.cachedPool = pool.slice();
			this.cachedSpeciesPool = speciesPool.slice();
		}
		return { pool, speciesPool };
	}

	randomNPokemon(n: number, requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Picks `n` random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		if (requiredType && !this.dex.types.get(requiredType).exists) {
			throw new Error(`"${requiredType}" is not a valid type.`);
		}

		const { pool, speciesPool } = this.getPools(requiredType, minSourceGen, ruleTable, requireMoves);
		const isNotCustom = !ruleTable;

		const hasDexNumber: { [k: string]: number } = {};
		for (let i = 0; i < n; i++) {
			const num = this.sampleNoReplace(pool);
			hasDexNumber[num] = i;
		}

		const formes: string[][] = [];
		for (const species of speciesPool) {
			if (!(species.num in hasDexNumber)) continue;
			if (isNotCustom && (species.gen > this.gen ||
				(species.isNonstandard && species.isNonstandard !== 'Unobtainable'))) continue;
			if (requiredType && !species.types.includes(requiredType)) continue;
			if (!formes[hasDexNumber[species.num]]) formes[hasDexNumber[species.num]] = [];
			formes[hasDexNumber[species.num]].push(species.name);
		}

		if (formes.length < n) {
			throw new Error(`Legal Pokemon forme count insufficient to support Max Team Size: (${formes.length} / ${n}).`);
		}

		const nPokemon = [];
		for (let i = 0; i < n; i++) {
			if (!formes[i].length) {
				throw new Error(`Invalid pokemon gen ${this.gen}: ${JSON.stringify(formes)} numbers ${JSON.stringify(hasDexNumber)}`);
			}
			nPokemon.push(this.sample(formes[i]));
		}
		return nPokemon;
	}

	randomHCTeam(): PokemonSet[] {
		const hasCustomBans = this.hasDirectCustomBanlistChanges();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const hasNonexistentBan = hasCustomBans && ruleTable.check('nonexistent');
		const hasNonexistentWhitelist = hasCustomBans && (hasNonexistentBan === '');

		if (hasCustomBans) {
			this.enforceNoDirectComplexBans();
		}

		// Item Pool
		const doItemsExist = this.gen > 1;
		let itemPool: Item[] = [];
		if (doItemsExist) {
			if (!hasCustomBans) {
				itemPool = [...this.dex.items.all()].filter(item => (item.gen <= this.gen && !item.isNonstandard));
			} else {
				const hasAllItemsBan = ruleTable.check('pokemontag:allitems');
				for (const item of this.dex.items.all()) {
					let banReason = ruleTable.check('item:' + item.id);
					if (banReason) continue;
					if (banReason !== '' && item.id) {
						if (hasAllItemsBan) continue;
						if (item.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(item.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && item.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					itemPool.push(item);
				}
				if (ruleTable.check('item:noitem')) {
					this.enforceCustomPoolSizeNoComplexBans('item', itemPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Ability Pool
		const doAbilitiesExist = (this.gen > 2) && (this.dex.currentMod !== 'gen7letsgo');
		let abilityPool: Ability[] = [];
		if (doAbilitiesExist) {
			if (!hasCustomBans) {
				abilityPool = [...this.dex.abilities.all()].filter(ability => (ability.gen <= this.gen && !ability.isNonstandard));
			} else {
				const hasAllAbilitiesBan = ruleTable.check('pokemontag:allabilities');
				for (const ability of this.dex.abilities.all()) {
					let banReason = ruleTable.check('ability:' + ability.id);
					if (banReason) continue;
					if (banReason !== '') {
						if (hasAllAbilitiesBan) continue;
						if (ability.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(ability.isNonstandard));
							if (banReason) continue;
							if (banReason !== '') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					abilityPool.push(ability);
				}
				if (ruleTable.check('ability:noability')) {
					this.enforceCustomPoolSizeNoComplexBans('ability', abilityPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Move Pool
		const setMoveCount = ruleTable.maxMoveCount;
		let movePool: Move[] = [];
		if (!hasCustomBans) {
			movePool = [...this.dex.moves.all()].filter(move =>
				(move.gen <= this.gen && !move.isNonstandard && !move.name.startsWith('Hidden Power ')));
		} else {
			const hasAllMovesBan = ruleTable.check('pokemontag:allmoves');
			for (const move of this.dex.moves.all()) {
				// Legality of specific HP types can't be altered in built formats anyway
				if (move.name.startsWith('Hidden Power ')) continue;
				let banReason = ruleTable.check('move:' + move.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (hasAllMovesBan) continue;
					if (move.isNonstandard) {
						banReason = ruleTable.check('pokemontag:' + toID(move.isNonstandard));
						if (banReason) continue;
						if (banReason !== '' && move.isNonstandard !== 'Unobtainable') {
							if (hasNonexistentBan) continue;
							if (!hasNonexistentWhitelist) continue;
						}
					}
				}
				movePool.push(move);
			}
			this.enforceCustomPoolSizeNoComplexBans('move', movePool, this.maxTeamSize * setMoveCount, 'Max Team Size * Max Move Count');
		}

		// Nature Pool
		const doNaturesExist = this.gen > 2;
		let naturePool: Nature[] = [];
		if (doNaturesExist) {
			if (!hasCustomBans) {
				naturePool = [...this.dex.natures.all()];
			} else {
				const hasAllNaturesBan = ruleTable.check('pokemontag:allnatures');
				for (const nature of this.dex.natures.all()) {
					let banReason = ruleTable.check('nature:' + nature.id);
					if (banReason) continue;
					if (banReason !== '' && nature.id) {
						if (hasAllNaturesBan) continue;
						if (nature.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(nature.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && nature.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					naturePool.push(nature);
				}
				// There is no 'nature:nonature' rule so do not constrain pool size
			}
		}

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined,
			hasCustomBans ? ruleTable : undefined);

		const team = [];
		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);

			// Random unique item
			let item = '';
			let itemData;
			let isBadItem;
			if (doItemsExist) {
				// We discard TRs and Balls with 95% probability because of their otherwise overwhelming presence
				do {
					itemData = this.sampleNoReplace(itemPool);
					item = itemData?.name;
					isBadItem = item.startsWith("TR") || itemData.isPokeball;
				} while (isBadItem && this.randomChance(19, 20) && itemPool.length > this.maxTeamSize);
			}

			// Random unique ability
			let ability = 'No Ability';
			let abilityData;
			if (doAbilitiesExist) {
				abilityData = this.sampleNoReplace(abilityPool);
				ability = abilityData?.name;
			}

			// Random unique moves
			const m = [];
			do {
				const move = this.sampleNoReplace(movePool);
				m.push(move.id);
			} while (m.length < setMoveCount);

			// Random EVs
			const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			if (this.gen === 6) {
				let evpool = 510;
				do {
					const x = this.sample(Dex.stats.ids());
					const y = this.random(Math.min(256 - evs[x], evpool + 1));
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of Dex.stats.ids()) {
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			const ivs: StatsTable = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			let nature = '';
			if (doNaturesExist && (naturePool.length > 0)) {
				nature = this.sample(naturePool).name;
			}

			// Level balance
			const mbstmin = 1307;
			const stats = species.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst);
				while (level < 100) {
					mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
					mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: PokemonSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender || (this.random(2) ? 'F' : 'M'),
				item,
				ability,
				moves: m,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			team.push(set);
		}

		return team;
	}

	/* randomFactorySets: { [format: string]: { [species: string]: BattleFactorySpecies } } = require('./factory-sets.json');

	randomFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails, tier: string
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomFactorySets[tier][id].sets;

		const itemsLimited = ['choicespecs', 'choiceband', 'choicescarf'];
		const movesLimited: { [k: string]: string } = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};

		// Build a pool of eligible sets, given the team partners
		// Also keep track of moves and items limited to one per team
		const effectivePool: {
			set: BattleFactorySet, moves?: string[], item?: string,
		}[] = [];

		for (const set of setList) {
			let reject = false;

			// limit to 1 dedicated tera user per team
			if (set.wantsTera && teamData.wantsTeraCount) {
				continue;
			}

			// reject disallowed items, specifically a second of any given choice item
			const allowedItems: string[] = [];
			for (const itemString of set.item) {
				const itemId = toID(itemString);
				if (itemsLimited.includes(itemId) && teamData.has[itemId]) continue;
				allowedItems.push(itemString);
			}
			if (!allowedItems.length) continue;
			const item = this.sample(allowedItems);

			const abilityId = toID(this.sample(set.ability));

			if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;

			const moves: string[] = [];
			for (const move of set.moves) {
				const allowedMoves: string[] = [];
				for (const m of move) {
					const moveId = toID(m);
					if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) continue;
					allowedMoves.push(m);
				}
				if (!allowedMoves.length) {
					reject = true;
					break;
				}
				moves.push(this.sample(allowedMoves));
			}
			if (reject) continue;
			effectivePool.push({ set, moves, item });
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const set of setList) {
				effectivePool.push({ set });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moves ? setData.moves[i] : this.sample(moveSlot));
		}

		const item = setData.item || this.sample(setData.set.item);

		return {
			name: species.baseSpecies,
			species: (typeof species.battleOnly === 'string') ? species.battleOnly : species.name,
			preferredType: this.sample(setData.set.preferredType),
			gender:	setData.set.gender || species.gender || (tier === 'OU' ? 'F' : ''), // F for Cute Charm Enamorus
			item,
			ability: this.sample(setData.set.ability),
			shiny: setData.set.shiny || this.randomChance(1, 1024),
			level: this.adjustLevel || (tier === "LC" ? 5 : 100),
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: this.sample(setData.set.nature) || "Serious",
			moves,
			wantsTera: setData.set.wantsTera,
		};
	}

	randomFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 12;

		if (!this.factoryTier) {
			// this.factoryTier = this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC']);
			this.factoryTier = this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU']);
		}

		const tierValues: { [k: string]: number } = {
			Uber: 5,
			OU: 4, UUBL: 4,
			UU: 3, RUBL: 3,
			RU: 2, NUBL: 2,
			NU: 1, PUBL: 1,
			PU: 0,
		};

		const pokemon = [];
		const pokemonPool = Object.keys(this.randomFactorySets[this.factoryTier]);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const resistanceAbilities: { [k: string]: string[] } = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'], waterbubble: ['Fire'], wellbakedbody: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			eartheater: ['Ground'], levitate: ['Ground'],
		};
		const movesLimited: { [k: string]: string } = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};
		const limitFactor = Math.ceil(this.maxTeamSize / 6);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
	/* const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.randomFactorySets[this.factoryTier][speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (
				this.factoryTier in tierValues && species.tier in tierValues &&
				tierValues[species.tier] > tierValues[this.factoryTier]
			) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			if (!teamData.forceResult && !this.forceMonotype) {
				// Limit 3 of any weakness
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0 && this.dex.getImmunity(typeName, types)) {
						if (teamData.weaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
			}
			if (skip) continue;

			const set = this.randomFactorySet(species, teamData, this.factoryTier);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[toID(set.item)] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (movesLimited[moveId]) {
					teamData.has[movesLimited[moveId]] = 1;
				}
			}

			const ability = this.dex.abilities.get(set.ability);
			if (abilitiesLimited[ability.id]) {
				teamData.has[abilitiesLimited[ability.id]] = 1;
			}

			for (const typeName of this.dex.types.names()) {
				const typeMod = this.dex.getEffectiveness(typeName, types);
				// Track resistances because we will require it for triple weaknesses
				if (
					typeMod < 0 ||
					resistanceAbilities[ability.id]?.includes(typeName) ||
					!this.dex.getImmunity(typeName, types)
				) {
					// We don't care about the number of resistances, so just set to 1
					teamData.resistances[typeName] = 1;
				// Track weaknesses
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				// We reject if our team is triple weak to any type without having a resist
				if (teamData.resistances[type]) continue;
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomFactoryTeam(side, ++depth);
			}
			// Try to force Stealth Rock on non-Uber teams
			if (!teamData.has['stealthRock'] && this.factoryTier !== 'Uber') return this.randomFactoryTeam(side, ++depth);
		}
		return pokemon;
	}

	randomBSSFactorySets: AnyObject = require("./bss-factory-sets.json");

	randomBSSFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomBSSFactorySets[id].sets;

		const movesMax: { [k: string]: number } = {
			batonpass: 1,
			stealthrock: 1,
			toxicspikes: 1,
			trickroom: 1,
			auroraveil: 1,
		};
		const weatherAbilities = WEATHER_ABILITY_CHECKS.map(check => check.id);
		const terrainAbilities: { [k: string]: string } = {
			electricsurge: "electric",
			psychicsurge: "psychic",
			grassysurge: "grassy",
			seedsower: "grassy",
			mistysurge: "misty",
		};
		const terrainItemsRequire: { [k: string]: string } = {
			electricseed: "electric",
			psychicseed: "psychic",
			grassyseed: "grassy",
			mistyseed: "misty",
		};

		const maxWantsTera = 2;

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		const effectivePool: {
			set: BSSFactorySet, moveVariants?: number[], itemVariants?: number, abilityVariants?: number,
		}[] = [];

		for (const curSet of setList) {
			let reject = false;

			// limit to 2 dedicated tera users per team
			if (curSet.wantsTera && teamData.wantsTeraCount && teamData.wantsTeraCount >= maxWantsTera) {
				continue;
			}

			// reject 2+ weather setters
			if (teamData.climateWeather && weatherAbilities.includes(curSet.ability)) {
				continue;
			}

			if (terrainAbilities[curSet.ability]) {
				if (!teamData.terrain) teamData.terrain = [];
				teamData.terrain.push(terrainAbilities[curSet.ability]);
			}

			for (const item of curSet.item) {
				if (terrainItemsRequire[item] && !teamData.terrain?.includes(terrainItemsRequire[item])) {
					reject = true; // reject any sets with a seed item possible and no terrain setter to activate it
					break;
				}
			}

			const curSetMoveVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				curSetMoveVariants.push(variantIndex);
			}
			if (reject) continue;
			const set = { set: curSet, moveVariants: curSetMoveVariants };
			effectivePool.push(set);
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({ set: curSet });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.species || species.baseSpecies,
			species: setData.set.species,
			preferredType: (this.sampleIfArray(setData.set.preferredType)),
			gender:	setData.set.gender || species.gender || (this.randomChance(1, 2) ? "M" : "F"),
			item: this.sampleIfArray(setData.set.item) || "",
			ability: this.sampleIfArray(setData.set.ability),
			shiny: this.randomChance(1, 1024),
			level: 50,
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: setData.set.nature || "Serious",
			moves,
			wantsTera: setData.set.wantsTera,
		};
	}

	randomBSSFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 4;

		const pokemon = [];

		const pokemonPool = Object.keys(this.randomBSSFactorySets);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const weatherAbilitiesSet: { [k: string]: string } = {
			drought: "sunnyday",
			drizzle: "raindance",
			snowwarning: "snowscape",
			eventide: "bloodmoon",
			condensation: "foghorn",
			sandstream: "sandstorm",
			dustdevil: "duststorm",
			hayfever: "pollinate",
			secretion: "swarmsignal",
			pollution: "smogspread",
			incantation: "sprinkle",
			standoff: "auraprojection",
			seance: "haunt",
			dreamer: "daydream",
			arcanum: "dragonforce",
			stormfront: "supercell",
			ferroflux: "magnetize",
			galeforce: "strongwinds",
		};
		const resistanceAbilities: { [k: string]: string[] } = {
			waterabsorb: ["Water"],
			flashfire: ["Fire"],
			lightningrod: ["Electric"],
			voltabsorb: ["Electric"],
			thickfat: ["Ice", "Fire"],
			levitate: ["Ground"],
		};
		const limitFactor = Math.ceil(this.maxTeamSize / 6);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
	/* const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.randomBSSFactorySets[speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			const set = this.randomBSSFactorySet(species, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			const itemData = this.dex.items.get(set.item);
			if (teamData.has[itemData.id]) continue; // Item Clause

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[itemData.id] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			const abilityState = this.dex.abilities.get(set.ability);
			if (abilityState.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityState.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
			}

			for (const typeName of this.dex.types.names()) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityState.id]?.includes(typeName) ||	!this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	randomDraftFactoryMatchups: AnyObject = require("./draft-factory-matchups.json").matchups;
	rdfMatchupIndex = -1;
	rdfMatchupSide = -1;

	randomDraftFactoryTeam(side: PlayerOptions): RandomTeamsTypes.RandomDraftFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		if (this.rdfMatchupIndex === -1) this.rdfMatchupIndex = this.random(0, this.randomDraftFactoryMatchups.length);
		if (this.rdfMatchupSide === -1) this.rdfMatchupSide = this.random(0, 2);

		const matchup = this.randomDraftFactoryMatchups[this.rdfMatchupIndex];
		const team = Teams.unpack(matchup[this.rdfMatchupSide]);
		if (!team) throw new Error(`Invalid team for draft factory matchup ${this.rdfMatchupIndex}`);
		this.rdfMatchupSide = 1 - this.rdfMatchupSide;
		return team.map(set => {
			let species = this.dex.species.get(set.species);
			if (species.battleOnly) {
				if (typeof species.battleOnly !== 'string') {
					throw new Error(`Invalid species ${species.name} for draft factory matchup ${this.rdfMatchupIndex} team ${this.rdfMatchupSide}`);
				}
				species = this.dex.species.get(species.battleOnly);
			}
			return {
				name: species.baseSpecies,
				species: species.name,
				gender: set.gender,
				moves: set.moves,
				ability: set.ability,
				evs: set.evs,
				ivs: set.ivs,
				item: set.item,
				level: this.adjustLevel || set.level,
				shiny: !!set.shiny,
				nature: set.nature,
				preferredType: set.preferredType,
			};
		});
	}

	random1v1FactorySets: { [species: string]: BattleFactorySpecies } = require('./1v1-factory-sets.json');

	random1v1FactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const setList = this.random1v1FactorySets[species.name].sets;

		const movesLimited: { [k: string]: string } = {};
		const abilitiesLimited: { [k: string]: string } = {};

		// Build a pool of eligible sets, given the team partners
		// Also keep track of moves and items limited to one per team
		const effectivePool: {
			set: BattleFactorySet, moves?: string[], item?: string,
		}[] = [];

		for (const set of setList) {
			let reject = false;

			// reject disallowed items, specifically a second of any given choice item
			const allowedItems: string[] = [];
			let ogItem = set.item;
			if (!Array.isArray(ogItem)) ogItem = [ogItem];
			for (const itemString of ogItem) {
				const itemId = toID(itemString);
				if (teamData.has[itemId]) continue;
				teamData.has[itemId] = 1;
				allowedItems.push(itemString);
			}
			if (!allowedItems.length) continue;
			const item = this.sample(allowedItems);

			const abilityId = toID(this.sample(set.ability));

			if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;

			const moves: string[] = [];
			for (const move of set.moves) {
				const allowedMoves: string[] = [];
				for (const m of move) {
					const moveId = toID(m);
					if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) continue;
					allowedMoves.push(m);
				}
				if (!allowedMoves.length) {
					reject = true;
					break;
				}
				moves.push(this.sample(allowedMoves));
			}
			if (reject) continue;
			effectivePool.push({ set, moves, item });
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const set of setList) {
				effectivePool.push({ set });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moves ? setData.moves[i] : this.sample(moveSlot));
		}

		const item = setData.item || this.sampleIfArray(setData.set.item);

		return {
			name: species.baseSpecies,
			species: (typeof species.battleOnly === 'string') ? species.battleOnly : species.name,
			gender:	setData.set.gender || species.gender || this.sample(['M', 'F']),
			item,
			ability: this.sampleIfArray(setData.set.ability),
			shiny: setData.set.shiny || this.randomChance(1, 1024),
			level: this.adjustLevel || setData.set.level || 100,
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: this.sampleIfArray(setData.set.nature) || "Serious",
			moves,
		};
	}

	random1v1FactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 12;

		const pokemon = [];
		const pokemonPool = Object.keys(this.random1v1FactorySets);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const movesLimited: { [k: string]: string } = {};
		const abilitiesLimited: { [k: string]: string } = {};
		const limitFactor = Math.ceil(this.maxTeamSize / 3);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
	/* const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.random1v1FactorySets[speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 1 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			if (!teamData.forceResult && !this.forceMonotype) {
				// Limit 2 of any weakness
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0 && this.dex.getImmunity(typeName, types)) {
						if (teamData.weaknesses[typeName] >= limitFactor) {
							skip = true;
							break;
						}
					}
				}
			}
			if (skip) continue;

			const set = this.random1v1FactorySet(species, teamData);
			if (!set) continue;
			teamData.has[toID(set.item)] = 1;

			const atkEVs = set.evs['atk'];
			const spaEVs = set.evs['spa'];
			const physMoveCount = set.moves.map(x => this.dex.moves.get(x).category).filter(x => x === 'Physical').length;
			const specMoveCount = set.moves.map(x => this.dex.moves.get(x).category).filter(x => x === 'Special').length;
			const atkBoostingMoves = set.moves.map(x => this.dex.moves.get(x))
				.filter(x => (x.target === 'self' && x.boosts?.atk) || (x.id === 'curse' && !species.types.includes('Ghost'))).length;
			const spaBoostingMoves = set.moves.map(x => this.dex.moves.get(x))
				.filter(x => (x.target === 'self' && x.boosts?.spa) || x.id === 'takeheart').length;
			if (teamData.has['physical'] && (atkEVs || physMoveCount >= 2 || atkBoostingMoves)) continue;
			if (teamData.has['special'] && (spaEVs || specMoveCount >= 2 || spaBoostingMoves)) continue;
			if (!teamData.has['physical']) teamData.has['physical'] = 0;
			if (!teamData.has['special']) teamData.has['special'] = 0;
			if (atkEVs || physMoveCount >= 2 || atkBoostingMoves) teamData.has['physical']++;
			if (spaEVs || specMoveCount >= 2 || spaBoostingMoves) teamData.has['special']++;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[toID(set.item)] = 1;

			for (const move of set.moves) {
				const moveId = toID(move);
				if (movesLimited[moveId]) {
					teamData.has[movesLimited[moveId]] = 1;
				}
			}

			const ability = this.dex.abilities.get(set.ability);
			if (abilitiesLimited[ability.id]) {
				teamData.has[abilitiesLimited[ability.id]] = 1;
			}

			for (const typeName of this.dex.types.names()) {
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.random1v1FactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= limitFactor) return this.random1v1FactoryTeam(side, ++depth);
			}
		}
		return pokemon;
	} */
}

export default RandomTeams;
