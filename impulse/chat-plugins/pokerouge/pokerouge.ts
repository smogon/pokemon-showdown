/*
 * PokeRouge - Pokemon Roguelike Battle Tower Plugin
 * A battle-tower-based roguelike game for Pokemon Showdown (Impulse server).
 *
 * Player commands:
 *   /pokerouge start
 *   /pokerouge choose [1|2|3]
 *   /pokerouge shop
 *   /pokerouge buy <item>
 *   /pokerouge use <item> [team slot]
 *   /pokerouge status
 *   /pokerouge top
 *   /pokerouge quit
 *   /pokerouge help
 *
 * Staff commands (Global Driver+):
 *   /pokerouge givemoney [user] [amount]
 *   /pokerouge removecoins [user],[amount]
 *   /pokerouge resetcoins [user]
 *   /pokerouge setfloor [user],[floor]
 *   /pokerouge addmon [user],[pokemon]
 *   /pokerouge removemon [user],[slot]
 *   /pokerouge givemon [user],[pokemon]
 *   /pokerouge viewteam [user]
 *   /pokerouge healteam [user]
 *   /pokerouge resetfloor [user]
 *
 * Flow:
 *   1. Player types /pokerouge start and sees 3 random level-1 Pokemon to choose from.
 *      Legendary/Mythical Pokemon are excluded from the initial starter pool.
 *   2. After clicking "Choose Starter", a battle starts on Floor 1.
 *   3. Winning a floor awards EXP and coins; Pokemon may level up and evolve.
 *   4. Every 5 floors the player may add a new Pokemon to their team.
 *      At higher floors, rare Legendary/Mythical Pokemon may appear as options.
 *   5. Losing on any floor resets progress back to floor 1 with a fresh random starter
 *      (unless the player has a Revive item).
 *   6. The opponent AI auto-generates a "PokeRouge Trainer" bot whose team scales with the floor.
 *   7. ALL Pokemon evolve by gaining EXP levels — no items or trading required.
 */

import { FS } from '../../../lib';
import { ObjectReadWriteStream } from '../../../lib/streams';
import { StreamWorker } from '../../../lib/process-manager';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_FILE = 'impulse/db/pokerouge.json';

/**
 * Tags that identify Legendary / Mythical / Special Pokemon.
 * These are excluded from normal starters but can appear in milestone rewards
 * at higher floors.
 */
const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

/** Cached list of non-legendary base-form official Pokemon IDs. */
let regularPokemonCache: string[] | null = null;
/** Cached list of legendary/mythical base-form official Pokemon IDs. */
let legendaryPokemonCache: string[] | null = null;

/** Returns all regular (non-legendary) base-form official Pokemon IDs. */
function getRegularPokemon(): string[] {
	if (regularPokemonCache) return regularPokemonCache;
	const all = Dex.species.all();
	regularPokemonCache = all
		.filter(s =>
			s.exists &&
			s.num > 0 &&
			!s.isNonstandard &&
			!s.prevo &&
			s.baseSpecies === s.name &&
			!s.tags.some(tag => LEGENDARY_TAGS.has(tag))
		)
		.map(s => toID(s.name));
	return regularPokemonCache;
}

/** Returns all legendary/mythical base-form official Pokemon IDs. */
function getLegendaryPokemon(): string[] {
	if (legendaryPokemonCache) return legendaryPokemonCache;
	const all = Dex.species.all();
	legendaryPokemonCache = all
		.filter(s =>
			s.exists &&
			s.num > 0 &&
			!s.isNonstandard &&
			!s.prevo &&
			s.baseSpecies === s.name &&
			s.tags.some(tag => LEGENDARY_TAGS.has(tag))
		)
		.map(s => toID(s.name));
	return legendaryPokemonCache;
}

/** Fisher-Yates shuffle a copy of `pool` and return `n` items, excluding `exclude`. */
function pickRandom(pool: string[], n: number, exclude: string[] = []): string[] {
	const filtered = pool.filter(id => !exclude.includes(id));
	const shuffled = filtered.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

/**
 * Pick `n` completely random regular (non-legendary) base-form Pokemon,
 * excluding any already in `exclude`.
 */
function pickRandomPokemon(n: number, exclude: string[] = []): string[] {
	return pickRandom(getRegularPokemon(), n, exclude);
}

/**
 * Default level thresholds for evolution types that don't have a natural level.
 * In PokeRouge, ALL evolutions happen by gaining levels — no items or trading needed.
 */
const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
	// 'other' (e.g. Shedinja) is skipped — too special to auto-handle
};

/**
 * Returns the level-based evolution for a species, if one exists.
 * In PokeRouge all evolutions are unlocked by levelling up:
 *   - Natural level-up evolutions use their own evoLevel.
 *   - Trade / item / friendship / etc. evolutions use a fallback level from
 *     EVO_TYPE_FALLBACK_LEVEL so every Pokemon in the Dex can evolve.
 * For species with multiple evolutions (e.g. Wurmple), the first usable branch
 * is returned.
 */
function getLevelUpEvo(speciesId: string): { evoTo: string; evoLevel: number } | null {
	const species = Dex.species.get(toID(speciesId));
	if (!species.exists || !species.evos.length) return null;

	for (const evoName of species.evos) {
		const evo = Dex.species.get(toID(evoName));
		// Skip 'other' evolutions (e.g. Shedinja) — too special to auto-handle
		if (evo.evoType === 'other') continue;

		// Use the Pokemon's own evoLevel if present; otherwise use the fallback for this evo type
		const fallback = evo.evoType ? (EVO_TYPE_FALLBACK_LEVEL[evo.evoType] ?? 36) : 36;
		const evoLevel = evo.evoLevel ?? fallback;
		if (evoLevel > 0) {
			return { evoTo: toID(evoName), evoLevel };
		}
	}
	return null;
}

// ---------------------------------------------------------------------------
// Shop item definitions
// ---------------------------------------------------------------------------

interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	/** If set, this item is a held item equipped to one Pokemon for the next battle. */
	heldItem?: string;
}

/** All purchasable items in the PokeRouge shop. */
const SHOP_ITEMS: Record<string, ShopItem> = {
	rarecandy: {
		id: 'rarecandy',
		name: 'Rare Candy',
		description: 'Instantly grants +5 levels to one of your Pokemon.',
		cost: 100,
	},
	luckycharm: {
		id: 'luckycharm',
		name: 'Lucky Charm',
		description: 'Doubles EXP and coins earned for the next 3 floors.',
		cost: 150,
	},
	revive: {
		id: 'revive',
		name: 'Revive',
		description: 'Grants a second chance — if you lose your next battle you retry the same floor.',
		cost: 200,
	},
	focussash: {
		id: 'focussash',
		name: 'Focus Sash',
		description: 'Equip to a Pokemon: it will survive any one-hit KO at 1 HP.',
		cost: 120,
		heldItem: 'focussash',
	},
	leftovers: {
		id: 'leftovers',
		name: 'Leftovers',
		description: 'Equip to a Pokemon: gradually restores HP each turn in battle.',
		cost: 100,
		heldItem: 'leftovers',
	},
	choiceband: {
		id: 'choiceband',
		name: 'Choice Band',
		description: 'Equip to a Pokemon: boosts Attack by 50%, but locks it into one move.',
		cost: 80,
		heldItem: 'choiceband',
	},
	lifeorb: {
		id: 'lifeorb',
		name: 'Life Orb',
		description: 'Equip to a Pokemon: boosts all moves by 30% with some recoil.',
		cost: 120,
		heldItem: 'lifeorb',
	},
	assaultvest: {
		id: 'assaultvest',
		name: 'Assault Vest',
		description: 'Equip to a Pokemon: boosts Sp. Def by 50%, but prevents status moves.',
		cost: 100,
		heldItem: 'assaultvest',
	},
};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	/** Held item to equip in the next battle (cleared after battle ends). */
	heldItem?: string;
}

interface PokeRougeState {
	floor: number;
	team: PokemonEntry[];
	/** If set, player is being prompted to choose a starter (or a new team addition). */
	pendingChoice?: string[];
	/** 'starter' | 'add' — what the pending choice is for. */
	pendingChoiceType?: 'starter' | 'add';
	/** roomid of an ongoing battle, if any. */
	battleRoomId?: string;
	/** Coins earned from floor victories (used in the item shop). */
	coins?: number;
	/** Inventory: item ID → quantity. */
	items?: Record<string, number>;
	/** Floors remaining where EXP and coins are doubled (Lucky Charm effect). */
	doubleExpFloors?: number;
	/** If true, the next loss will retry the same floor instead of resetting the run. */
	hasRevive?: boolean;
	/** Highest floor ever reached — tracked for the leaderboard. */
	highestFloor?: number;
	/** Display name (updated each login) — used for the leaderboard. */
	displayName?: string;
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

type SavedData = Record<string, PokeRougeState>;
let savedData: SavedData = {};

function saveData(): void {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(savedData), { throttle: 3000 });
}

async function loadData(): Promise<void> {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) savedData = JSON.parse(raw);
	} catch {
		savedData = {};
	}
}

void loadData();

function getState(userid: string): PokeRougeState | null {
	return savedData[userid] ?? null;
}

function setState(userid: string, state: PokeRougeState): void {
	savedData[userid] = state;
	saveData();
}

function deleteState(userid: string): void {
	delete savedData[userid];
	saveData();
}

// ---------------------------------------------------------------------------
// EXP / levelling / evolution helpers
// ---------------------------------------------------------------------------

/** Total EXP needed to reach a given level from level 1. */
function expForLevel(level: number): number {
	// EXP to go from N to N+1 is N * 30; cumulative = sum_{k=1}^{level-1} k*30 = 15*level*(level-1)
	return 15 * level * (level - 1);
}

/** EXP awarded for winning a floor. */
function floorExpReward(floor: number): number {
	return 50 + floor * 15;
}

/** Coins awarded for winning a floor. */
function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

/** Bot Pokemon level for a given floor: starts at 5 and grows by ~1.5 per floor, capped at 100. */
function botLevel(floor: number): number {
	return Math.min(100, 5 + Math.floor((floor - 1) * 1.5));
}

/** Number of Pokemon on the bot's team for a given floor. */
function botTeamSize(floor: number): number {
	if (floor <= 5) return 1;
	if (floor <= 10) return 2;
	if (floor <= 20) return 3;
	if (floor <= 30) return 4;
	if (floor <= 40) return 5;
	return 6;
}

/**
 * Level up a Pokemon entry, applying EXP.
 * Returns true if the Pokemon evolved.
 */
function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean; oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;
	// Level up as many times as earned
	while (mon.level < 100 && mon.exp >= expForLevel(mon.level + 1)) {
		mon.level++;
	}
	// Check evolution chain: evolve as many times as allowed by current level
	let evolved = false;
	while (true) {
		const evo = getLevelUpEvo(mon.species);
		if (!evo || mon.level < evo.evoLevel) break;
		mon.species = evo.evoTo;
		evolved = true;
	}
	return { evolved, oldLevel };
}

// ---------------------------------------------------------------------------
// Learnset helpers — fetch up-to-4 gen-9 level-up moves for a species / level
// ---------------------------------------------------------------------------

function getLevelUpMoves(speciesId: string, level: number): string[] {
	const learnsetData = Dex.species.getLearnsetData(toID(speciesId));
	const learnset = learnsetData?.learnset;
	if (!learnset) return ['tackle'];

	const available: { move: string; learnLevel: number }[] = [];

	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			// Only gen-9 level-up entries: "9Lxx"
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl <= level) {
					available.push({ move: moveid, learnLevel: learnLvl });
				}
				break;
			}
		}
	}

	if (!available.length) return ['tackle'];

	// Sort by learn level descending so we pick the latest/strongest moves
	available.sort((a, b) => b.learnLevel - a.learnLevel);
	return available.slice(0, 4).map(m => m.move);
}

// ---------------------------------------------------------------------------
// Team packing helpers
// ---------------------------------------------------------------------------

function packPokemon(mon: PokemonEntry): string {
	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	// Ability: first available
	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	const moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = moves.join(',');

	const item = mon.heldItem ?? '';

	// Packed team format: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level
	// Empty species = same as name
	return `${name}||${item}|${ability}|${movesStr}|Hardy||M||||${mon.level}`;
}

function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

// ---------------------------------------------------------------------------
// Bot user creation
// ---------------------------------------------------------------------------

/** A noop stream — discards everything written to it. */
class NoopStream extends ObjectReadWriteStream<string> {
	override _write(_data: string): void { /* discard */ }
}

const noopWorker = new StreamWorker(new NoopStream());
let botCounter = 0;

/** Maps active bot user IDs to the battle callback for AI responses. */
const botBattleHandlers = new Map<string, (roomid: string, requestLine: string) => void>();

/**
 * Creates a temporary bot User with a noop connection.
 * The bot is registered in the Users table and will auto-respond to battle
 * requests by writing choices directly to the battle stream.
 */
function createBotUser(displayName: string): User {
	const uid = ++botCounter;
	const connId = `pokerouge-bot-${uid}`;

	// Create a minimal noop connection
	const conn = new Users.Connection(
		connId,
		noopWorker,
		String(uid),
		null,
		'127.0.0.1',
		null
	);

	const botUser = new Users.User(conn);
	conn.user = botUser;

	// Rename: forceRename needs unique name not already taken
	const safeName = `${displayName} ${uid}`;
	botUser.forceRename(safeName, true);

	// Override sendTo so that battle |request| messages trigger AI moves
	(botUser as any).sendTo = function(roomid: RoomID | BasicRoom | null, data: string) {
		if (typeof data === 'string') {
			// The data may have a room prefix like ">battle-xxx\n|request|..."
			const lines = data.split('\n');
			for (const line of lines) {
				if (line.startsWith('|request|')) {
					const handler = botBattleHandlers.get(botUser.id);
					if (handler) {
						const roomidStr = typeof roomid === 'string' ? roomid
							: (roomid as any)?.roomid ?? '';
						// Defer so the battle state is fully initialised
						setTimeout(() => handler(roomidStr, line), 150);
					}
					break;
				}
			}
		}
		// Do NOT forward to the noop socket — the bot has no real connection
	};

	return botUser;
}

/**
 * Destroy a bot user, removing it from the Users table.
 */
function destroyBotUser(botUser: User): void {
	botBattleHandlers.delete(botUser.id);
	// Disconnect all fake connections
	for (const c of botUser.connections.slice()) {
		c.onDisconnect();
	}
}

// ---------------------------------------------------------------------------
// AI move logic
// ---------------------------------------------------------------------------

/**
 * Parse a |request| JSON and return a valid choice string.
 * Basic AI: picks a random available move (or switch for forceSwitch).
 * Advanced AI (floors > 20): prefer higher base-power moves.
 */
function makeAIChoice(requestJson: string, floor: number): string {
	let request: any;
	try {
		request = JSON.parse(requestJson.startsWith('|request|') ? requestJson.slice(9) : requestJson);
	} catch {
		return 'move 1';
	}

	if (!request || request.wait) return 'pass';

	// Team preview
	if (request.teamPreview) {
		const count = request.side?.pokemon?.length ?? 1;
		const order = Array.from({ length: count }, (_, i) => i + 1);
		return `team ${order.join('')}`;
	}

	// Force switch
	if (request.forceSwitch) {
		const choices: string[] = [];
		const pokemon = request.side?.pokemon ?? [];
		const chosen: number[] = [];

		for (let i = 0; i < (request.forceSwitch as boolean[]).length; i++) {
			if (!(request.forceSwitch as boolean[])[i]) {
				choices.push('pass');
				continue;
			}
			// Find a benched, non-fainted Pokemon
			const available = pokemon
				.map((p: any, idx: number) => ({ p, idx: idx + 1 }))
				.filter(({ p, idx }: { p: any; idx: number }) =>
					idx > (request.forceSwitch as boolean[]).length &&
					!p.condition?.endsWith(' fnt') &&
					!chosen.includes(idx)
				);
			if (available.length) {
				const pick = available[Math.floor(Math.random() * available.length)];
				chosen.push(pick.idx);
				choices.push(`switch ${pick.idx}`);
			} else {
				choices.push('pass');
			}
		}
		return choices.join(', ');
	}

	// Move request
	if (request.active) {
		const choicesList: string[] = [];

		for (let i = 0; i < (request.active as any[]).length; i++) {
			const active = (request.active as any[])[i];
			const pokemon = request.side?.pokemon?.[i];

			if (!pokemon || pokemon.condition?.endsWith(' fnt') || pokemon.commanding) {
				choicesList.push('pass');
				continue;
			}

			const moves: any[] = active?.moves ?? [];
			const usableMoves = moves.filter((m: any) => !m.disabled && (m.pp ?? 1) > 0);

			let chosen = '';
			if (usableMoves.length > 0) {
				// Advanced AI (floor > 20): prefer higher base-power moves
				if (floor > 20) {
					usableMoves.sort((a: any, b: any) => {
						const bpA = Dex.moves.get(a.id)?.basePower ?? 0;
						const bpB = Dex.moves.get(b.id)?.basePower ?? 0;
						return bpB - bpA;
					});
					chosen = `move ${moves.indexOf(usableMoves[0]) + 1}`;
				} else {
					const pick = usableMoves[Math.floor(Math.random() * usableMoves.length)];
					chosen = `move ${moves.indexOf(pick) + 1}`;
				}
			} else {
				chosen = 'move 1'; // struggle
			}

			// Can we also mega/tera? Randomly do so on higher floors
			if (floor > 15 && active.canMegaEvo && Math.random() < 0.5) chosen += ' mega';
			else if (floor > 25 && active.canTerastallize && Math.random() < 0.4) chosen += ' terastallize';

			choicesList.push(chosen);
		}

		return choicesList.join(', ') || 'move 1';
	}

	return 'move 1';
}

// ---------------------------------------------------------------------------
// Active battle tracking
// ---------------------------------------------------------------------------

interface ActiveRougeMatch {
	userId: ID;
	botUserId: ID;
	floor: number;
}

const activeMatches = new Map<RoomID, ActiveRougeMatch>();

// ---------------------------------------------------------------------------
// Core battle creation
// ---------------------------------------------------------------------------

/**
 * Builds an AI bot team as a packed string for the given floor.
 * Picks random Pokemon scaled to floor-appropriate levels.
 */
function buildBotTeam(floor: number): string {
	const level = botLevel(floor);
	const size = botTeamSize(floor);

	// For the bot, pick randomly from the full Pokedex at the appropriate level
	const picks = pickRandomPokemon(size);

	return picks.map(starter => {
		let species = starter;
		// Walk the evolution chain to find the right form for the bot's level
		let evo = getLevelUpEvo(species);
		while (evo && level >= evo.evoLevel) {
			species = evo.evoTo;
			evo = getLevelUpEvo(species);
		}
		return packPokemon({ species, level, exp: 0 });
	}).join(']');
}

/**
 * Starts a PokeRouge battle on the current floor for `user`.
 * Creates the bot, registers AI handlers and tracks the room.
 */
function startBattle(user: User, state: PokeRougeState): void {
	const playerTeam = packTeam(state.team);
	// Clear held items — they're consumed each battle
	for (const mon of state.team) delete mon.heldItem;
	const botTeam = buildBotTeam(state.floor);

	const trainerName = 'PokeRouge Trainer';
	const botUser = createBotUser(trainerName);
	const botSlot: 'p2' = 'p2';

	// Register the AI callback BEFORE the battle begins
	botBattleHandlers.set(botUser.id, (roomid, requestLine) => {
		const room = Rooms.get(roomid as RoomID);
		if (!room?.battle) return;
		const choice = makeAIChoice(requestLine, state.floor);
		void room.battle.stream.write(`>${botSlot} ${choice}`);
	});

	const battleRoom = Rooms.createBattle({
		format: 'gen9customgame',
		players: [
			{ user, team: playerTeam },
			{ user: botUser, team: botTeam },
		],
		rated: false,
		title: `PokeRouge — Floor ${state.floor}: ${user.name} vs ${botUser.name}`,
	});

	if (!battleRoom) {
		destroyBotUser(botUser);
		user.popup('Failed to start the PokeRouge battle. Please try again.');
		return;
	}

	// Join the human player to the battle room
	user.joinRoom?.(battleRoom);
	// Join the bot user to the battle room for consistent lifecycle handling
	botUser.joinRoom?.(battleRoom);

	// Track this battle
	state.battleRoomId = battleRoom.roomid;
	setState(user.id, state);

	activeMatches.set(battleRoom.roomid, {
		userId: user.id,
		botUserId: botUser.id,
		floor: state.floor,
	});
}

// ---------------------------------------------------------------------------
// Offer random starters / new Pokemon choice
// ---------------------------------------------------------------------------

/**
 * Pick 3 completely random level-1 base-form Pokemon for the starter selection screen.
 * Legendary/Mythical Pokemon are always excluded from the starter pool.
 */
function pickStarterOptions(): string[] {
	return pickRandomPokemon(3);
}

/**
 * Returns 3 random Pokemon for the "add to team" milestone offer.
 * At floor 20+ there is a small chance that one Legendary/Mythical appears.
 * At floor 40+ that chance doubles.
 */
function pickNewPokemonOptions(currentTeam: PokemonEntry[], floor: number): string[] {
	const existing = currentTeam.map(m => m.species);
	const legendaryChance = floor >= 40 ? 0.25 : floor >= 20 ? 0.12 : 0;

	if (legendaryChance > 0 && Math.random() < legendaryChance) {
		// Replace one of the three options with a rare legendary
		const legendaries = pickRandom(getLegendaryPokemon(), 1, existing);
		if (legendaries.length) {
			const regular = pickRandomPokemon(2, [...existing, ...legendaries]);
			// Shuffle so the legendary position is random
			return [...regular, ...legendaries].sort(() => Math.random() - 0.5);
		}
	}
	return pickRandomPokemon(3, existing);
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function getSprite(species: string): string {
	const id = toID(species);
	return `<img src="https://play.pokemonshowdown.com/sprites/gen5/${id}.png" width="80" height="80" alt="${species}" style="image-rendering:pixelated" />`;
}

/**
 * Renders the starter / new-Pokemon selection UI as an HTML table with cards.
 * Each card shows the sprite, name, type, and a "Choose Starter" button.
 *
 * @param options  Array of species IDs (length 3).
 * @param label    Button label text (default: "Choose Starter").
 * @param cmdPrefix  Chat command prefix for the choose action (default: "/pokerouge choose").
 */
function renderPokemonChoice(
	options: string[],
	label = 'Choose Starter',
	cmdPrefix = '/pokerouge choose'
): string {
	const cards = options.map((s, i) => {
		const speciesData = Dex.species.get(toID(s));
		const name = speciesData.exists ? speciesData.name : s;
		const isLegendary = speciesData.tags?.some(tag => LEGENDARY_TAGS.has(tag));
		// Colour the type badge similarly to the PS type chart
		const typeBadge = (speciesData.types ?? []).map(t =>
			`<span style="background:#${typeColor(t)};color:#fff;border-radius:3px;padding:1px 5px;font-size:11px">${t}</span>`
		).join(' ');
		const legendaryBadge = isLegendary
			? `<br><span style="color:#e67e22;font-size:11px;font-weight:bold">⭐ Legendary</span>` : '';
		const borderColor = isLegendary ? '#e67e22' : '#ccc';
		const bg = isLegendary ? '#fffaf0' : '#fafafa';
		const btnColor = isLegendary ? '#e67e22' : '#4caf50';
		return `<td style="text-align:center;padding:10px 14px;border:2px solid ${borderColor};` +
			`border-radius:10px;background:${bg};min-width:110px">` +
			`${getSprite(s)}<br>` +
			`<b style="font-size:14px">${name}</b><br>` +
			`<span style="font-size:12px">Lv. 1</span><br>` +
			`${typeBadge}${legendaryBadge}<br>` +
			`<button name="send" value="${cmdPrefix} ${i + 1}" ` +
			`style="margin-top:8px;padding:4px 10px;font-weight:bold;` +
			`border-radius:5px;background:${btnColor};color:#fff;border:none;cursor:pointer">` +
			`${label}</button>` +
			`</td>`;
	}).join('<td style="width:10px"></td>');
	return `<table style="border-collapse:separate;border-spacing:0"><tr>${cards}</tr></table>`;
}

/** Returns a hex colour string for a Pokemon type (no leading #). */
function typeColor(type: string): string {
	const colors: Record<string, string> = {
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129',
		Electric: 'fac000', Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb',
		Ground: '915121', Flying: '81b9ef', Psychic: 'ef4179', Bug: '91a119',
		Rock: 'afa981', Ghost: '704170', Dragon: '5060e1', Dark: '624d4e',
		Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return colors[type] ?? '68a090';
}

function renderTeam(team: PokemonEntry[]): string {
	return team.map((mon, idx) => {
		const speciesData = Dex.species.get(toID(mon.species));
		const name = speciesData.exists ? speciesData.name : mon.species;
		const expNeeded = mon.level < 100 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const heldLabel = mon.heldItem ? ` [${mon.heldItem}]` : '';
		return `<b>${idx + 1}. ${name}${heldLabel}</b> Lv.${mon.level}${mon.level < 100 ? ` (${expNeeded} EXP to next level)` : ' (MAX)'}`;
	}).join('<br>');
}

/** Renders the item shop as an HTML card grid. */
function renderShop(coins: number): string {
	const cards = Object.values(SHOP_ITEMS).map(item => {
		const canAfford = coins >= item.cost;
		const btnStyle = canAfford
			? 'background:#e67e22;color:#fff;border:none;border-radius:5px;padding:4px 10px;font-weight:bold;cursor:pointer'
			: 'background:#bbb;color:#fff;border:none;border-radius:5px;padding:4px 10px;cursor:not-allowed';
		return `<td style="text-align:center;padding:8px 12px;border:2px solid #ccc;border-radius:8px;background:#fffaf5;min-width:120px;vertical-align:top">` +
			`<b style="font-size:13px">${item.name}</b><br>` +
			`<span style="font-size:11px;color:#555">${item.description}</span><br>` +
			`<span style="color:#e67e22;font-weight:bold">🪙 ${item.cost}</span><br>` +
			(item.heldItem ? `<small style="color:#888">(held item, 1 battle)</small><br>` : '') +
			`<button name="send" value="/pokerouge buy ${item.id}" style="${btnStyle};margin-top:6px" ${canAfford ? '' : 'disabled'}>Buy</button>` +
			`</td>`;
	});
	// Chunk into rows of 4
	const rows: string[] = [];
	for (let i = 0; i < cards.length; i += 4) {
		rows.push(`<tr>${cards.slice(i, i + 4).join('<td style="width:8px"></td>')}</tr>`);
	}
	return `<table style="border-collapse:separate;border-spacing:0 8px">${rows.join('')}</table>`;
}

/** Builds the Top-100 leaderboard HTML sorted by highestFloor descending. */
function renderLeaderboard(): string {
	const entries = Object.entries(savedData)
		.filter(([, s]) => (s.highestFloor ?? 0) > 0)
		.sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0))
		.slice(0, 100);

	if (!entries.length) {
		return '<em>No records yet — be the first to complete a floor!</em>';
	}

	const rows = entries.map(([userid, s], i) => {
		const rank = i + 1;
		const display = s.displayName || userid;
		const nameHtml = Impulse.nameColor(display, true, true);
		const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
		const teamStr = (s.team ?? [])
			.map(m => Dex.species.get(toID(m.species)).name || m.species)
			.join(', ') || '—';
		const bg = rank <= 3 ? 'background:#fffaf0' : '';
		return `<tr style="${bg}">` +
			`<td style="padding:3px 8px;font-weight:bold">${medal}</td>` +
			`<td style="padding:3px 8px">${nameHtml}</td>` +
			`<td style="padding:3px 8px;text-align:center"><b>Floor ${s.highestFloor ?? 0}</b></td>` +
			`<td style="padding:3px 8px;font-size:11px;color:#555">${teamStr}</td>` +
			`</tr>`;
	}).join('');

	return `<table style="border-collapse:collapse;width:100%">` +
		`<tr style="background:#eee">` +
		`<th style="padding:4px 8px">#</th>` +
		`<th style="padding:4px 8px">Player</th>` +
		`<th style="padding:4px 8px">Best Floor</th>` +
		`<th style="padding:4px 8px">Last Team</th>` +
		`</tr>` +
		rows +
		`</table>`;
}

// ---------------------------------------------------------------------------
// Chat command handlers
// ---------------------------------------------------------------------------

export const commands: Chat.ChatCommands = {
	pokerouge: {
		// /pokerouge start
		start(target, room, user) {
			const existing = getState(user.id);
			if (existing?.battleRoomId) {
				const battleRoom = Rooms.get(existing.battleRoomId);
				if (battleRoom) {
					return this.sendReplyBox(
						`You already have an active PokeRouge battle! ` +
						`<a href="/${existing.battleRoomId}">Click here</a> to go to your battle.`
					);
				}
				// Battle room no longer exists — clear it
				delete existing.battleRoomId;
			}

			if (existing?.pendingChoice) {
				const isAdd = existing.pendingChoiceType === 'add';
				const title = isAdd
					? `🏆 Milestone reached! Add a new Pokémon to your team:`
					: `Choose your starter Pokémon:`;
				return this.sendReplyBox(
					`<b>${title}</b><br><br>` +
					renderPokemonChoice(
						existing.pendingChoice,
						isAdd ? 'Add to Team' : 'Choose Starter'
					)
				);
			}

			if (existing) {
				// Resume existing run — start the next battle
				startBattle(user, existing);
				return this.sendReplyBox(
					`<b>PokeRouge — Floor ${existing.floor}</b><br>` +
					`Your team:<br>${renderTeam(existing.team)}<br>` +
					`<br>Battle started! Check the new battle room.`
				);
			}

			// New game — offer 3 completely random level-1 Pokemon
			const options = pickStarterOptions();
			const newState: PokeRougeState = {
				floor: 1,
				team: [],
				pendingChoice: options,
				pendingChoiceType: 'starter',
			};
			setState(user.id, newState);

			this.sendReplyBox(
				`<b style="font-size:16px">⚔️ Welcome to PokeRouge!</b><br>` +
				`<small>Battle Tower Roguelike — floors get harder as you progress. Lose and start over!</small><br><br>` +
				`<b>Choose your starter Pokémon (all at Lv. 1):</b><br><br>` +
				renderPokemonChoice(options, 'Choose Starter')
			);
		},

		// /pokerouge choose <1|2|3>
		choose(target, room, user) {
			const n = parseInt(target.trim());
			if (!n || n < 1 || n > 3) {
				return this.errorReply('Usage: /pokerouge choose [1, 2, or 3]');
			}

			const state = getState(user.id);
			if (!state?.pendingChoice) {
				return this.errorReply('You have no pending Pokemon choice. Use /pokerouge start first.');
			}

			// Guard against starting a second battle while one is active
			if (state.battleRoomId) {
				const activeBattleRoom = Rooms.get(state.battleRoomId);
				if (activeBattleRoom) {
					return this.sendReplyBox(
						`You already have an active PokeRouge battle! ` +
						`<a href="/${state.battleRoomId}">Click here</a> to go to your battle.`
					);
				}
				delete state.battleRoomId;
			}

			const options = state.pendingChoice;
			if (n > options.length) return this.errorReply('Invalid choice.');

			const chosen = options[n - 1];
			const speciesData = Dex.species.get(toID(chosen));
			const name = speciesData.exists ? speciesData.name : chosen;
			const isStarter = state.pendingChoiceType === 'starter';

			if (isStarter) {
				// Begin the run with this starter at level 1
				state.team = [{ species: chosen, level: 1, exp: 0 }];
				state.floor = 1;
			} else {
				// Add the Pokemon to the team at floor-appropriate level
				const addLevel = Math.max(1, state.floor - 2);
				state.team.push({ species: chosen, level: addLevel, exp: expForLevel(addLevel) });
			}

			delete state.pendingChoice;
			delete state.pendingChoiceType;

			this.sendReplyBox(
				`You chose <b>${name}</b>!<br>` +
				(isStarter
					? `Your journey begins on Floor 1.<br>Starting battle...`
					: `${name} joined your team!`)
			);

			startBattle(user, state);
		},

		// /pokerouge status
		status(target, room, user) {
			if (!this.runBroadcast()) return;
			const state = getState(user.id);
			if (!state) {
				return this.sendReplyBox('You have no active PokeRouge run. Use <code>/pokerouge start</code> to begin!');
			}

			// If there's a pending choice, show the card UI
			if (state.pendingChoice) {
				const isAdd = state.pendingChoiceType === 'add';
				return this.sendReplyBox(
					`<b>PokeRouge — Floor ${state.floor} — Pending Choice</b><br><br>` +
					`<b>${isAdd ? '🏆 Choose a Pokémon to add to your team:' : 'Choose your starter Pokémon:'}</b><br><br>` +
					renderPokemonChoice(
						state.pendingChoice,
						isAdd ? 'Add to Team' : 'Choose Starter'
					)
				);
			}

			const coins = state.coins ?? 0;
			const items = state.items ?? {};
			const itemList = Object.entries(items)
				.filter(([, qty]) => qty > 0)
				.map(([id, qty]) => `${SHOP_ITEMS[id]?.name ?? id} ×${qty}`)
				.join(', ') || 'None';
			const activeEffects: string[] = [];
			if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
			if (state.hasRevive) activeEffects.push('Revive (active)');

			this.sendReplyBox(
				`<b>PokeRouge Status for ${Impulse.nameColor(user.name, true)}</b><br>` +
				`<b>Floor:</b> ${state.floor} &nbsp;|&nbsp; <b>🪙 Coins:</b> ${coins}<br>` +
				(activeEffects.length ? `<b>Active Effects:</b> ${activeEffects.join(', ')}<br>` : '') +
				`<b>Items:</b> ${itemList}<br>` +
				`<b>Team:</b><br>${renderTeam(state.team)}`
			);
		},

		// /pokerouge shop
		shop(target, room, user) {
			if (!this.runBroadcast()) return;
			const state = getState(user.id);
			const coins = state?.coins ?? 0;
			this.sendReplyBox(
				`<b style="font-size:15px">🛒 PokeRouge Item Shop</b> &nbsp; <b>🪙 ${coins} coins</b><br>` +
				`<small>Items are permanent unless marked "(held item, 1 battle)".` +
				` Use <code>/pokerouge use &lt;item&gt;</code> to apply items to your team.</small><br><br>` +
				renderShop(coins)
			);
		},

		// /pokerouge buy <item>
		buy(target, room, user) {
			const itemId = toID(target.trim());
			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${target.trim()}". Use /pokerouge shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokeRouge run. Use /pokerouge start first.');
			}

			const coins = state.coins ?? 0;
			if (coins < item.cost) {
				return this.errorReply(`Not enough coins. You have 🪙 ${coins} but need 🪙 ${item.cost}.`);
			}

			state.coins = coins - item.cost;
			state.items = state.items ?? {};
			state.items[itemId] = (state.items[itemId] ?? 0) + 1;
			setState(user.id, state);

			this.sendReplyBox(
				`🛒 Purchased <b>${item.name}</b> for 🪙 ${item.cost}!<br>` +
				`Remaining coins: 🪙 ${state.coins}<br>` +
				(item.heldItem
					? `Use <code>/pokerouge use ${itemId} [team slot]</code> to equip it before the next battle.`
					: `Use <code>/pokerouge use ${itemId}${item.id !== 'rarecandy' ? '' : ' [team slot]'}</code> to activate it.`)
			);
		},

		// /pokerouge use <item> [team slot 1-6]
		use(target, room, user) {
			const parts = target.trim().split(/\s+/);
			const itemId = toID(parts[0] ?? '');
			const slotArg = parseInt(parts[1] ?? '0');

			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${parts[0]}". Use /pokerouge shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokeRouge run. Use /pokerouge start first.');
			}

			const qty = (state.items ?? {})[itemId] ?? 0;
			if (qty < 1) {
				return this.errorReply(`You don't have any ${item.name}. Use /pokerouge buy ${itemId} to get one.`);
			}

			// Consume one
			state.items![itemId] = qty - 1;

			switch (itemId) {
			case 'rarecandy': {
				// Requires a team slot
				const slot = slotArg - 1;
				if (slot < 0 || slot >= state.team.length) {
					// Refund and error
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Specify a team slot 1-${state.team.length}. Example: /pokerouge use rarecandy 1`);
				}
				const mon = state.team[slot];
				const oldSpecies = mon.species;
				mon.level = Math.min(100, mon.level + 5);
				mon.exp = expForLevel(mon.level);
				// Apply any evolutions triggered by the new level
				let evolved = false;
				while (true) {
					const evo = getLevelUpEvo(mon.species);
					if (!evo || mon.level < evo.evoLevel) break;
					mon.species = evo.evoTo;
					evolved = true;
				}
				const newName = Dex.species.get(toID(mon.species)).name || mon.species;
				setState(user.id, state);
				const oldName = Dex.species.get(toID(oldSpecies)).name || oldSpecies;
				return this.sendReplyBox(
					`🍬 <b>${evolved ? `${oldName} evolved into ${newName}` : newName}</b> grew to <b>Lv.${mon.level}</b>!`
				);
			}
			case 'luckycharm': {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) + 3;
				setState(user.id, state);
				return this.sendReplyBox(
					`🍀 <b>Lucky Charm</b> activated! EXP and coins are doubled for the next ${state.doubleExpFloors} floors.`
				);
			}
			case 'revive': {
				state.hasRevive = true;
				setState(user.id, state);
				return this.sendReplyBox(
					`💊 <b>Revive</b> activated! If you lose your next battle, you will retry the same floor.`
				);
			}
			default: {
				// Held items — equip to a team Pokemon
				if (!item.heldItem) {
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Cannot manually use ${item.name}. It applies automatically.`);
				}
				const slot = slotArg - 1;
				if (slot < 0 || slot >= state.team.length) {
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Specify a team slot 1-${state.team.length}. Example: /pokerouge use ${itemId} 1`);
				}
				const mon = state.team[slot];
				if (mon.heldItem) {
					// Return the old item to inventory
					state.items![mon.heldItem] = (state.items![mon.heldItem] ?? 0) + 1;
				}
				mon.heldItem = item.heldItem;
				setState(user.id, state);
				const monName = Dex.species.get(toID(mon.species)).name || mon.species;
				return this.sendReplyBox(`🎒 Equipped <b>${item.name}</b> to <b>${monName}</b>!`);
			}
			}
		},

		// /pokerouge quit
		quit(target, room, user) {
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokeRouge run.');
			}
			if (state.battleRoomId) {
				// Clean up activeMatches and bot user before forfeiting,
				// in case onBattleEnd fails to fire (server crash, external room destruction, etc.)
				const battleRoomId = state.battleRoomId as RoomID;
				const match = activeMatches.get(battleRoomId);
				if (match) {
					const botUser = Users.get(match.botUserId);
					if (botUser) destroyBotUser(botUser);
					activeMatches.delete(battleRoomId);
				}
				const br = Rooms.get(state.battleRoomId);
				if (br?.battle) br.battle.forfeit(user);
			}
			deleteState(user.id);
			this.sendReply('Your PokeRouge run has been abandoned. Use /pokerouge start to begin a new run.');
		},

		// -----------------------------------------------------------------------
		// Staff commands — require Global Driver+ (checkCan 'lock')
		// -----------------------------------------------------------------------

		givemoney(target, room, user) {
			this.checkCan('lock');
			const parts = target.trim().split(/\s+/);
			// If only a number is given, give to self
			const isNumber = (s: string) => /^\d+$/.test(s);
			let targetName: string;
			let amount: number;
			if (parts.length === 1 && isNumber(parts[0])) {
				targetName = user.name;
				amount = parseInt(parts[0]);
			} else if (parts.length >= 2 && isNumber(parts[parts.length - 1])) {
				amount = parseInt(parts[parts.length - 1]);
				targetName = parts.slice(0, -1).join(' ');
			} else {
				targetName = parts.join(' ') || user.name;
				amount = 100;
			}
			const targetId = toID(targetName) || user.id;
			const targetState = getState(targetId);
			if (!targetState) {
				return this.errorReply(`${targetName} has no active PokeRouge run.`);
			}
			targetState.coins = (targetState.coins ?? 0) + amount;
			setState(targetId, targetState);
			this.sendReply(`Gave 🪙 ${amount} coins to ${targetName}. They now have ${targetState.coins} coins.`);
			this.modlog('POKEROUGE GIVEMONEY', targetId, `${amount} coins`);
		},

		removecoins(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.errorReply('Usage: /pokerouge removecoins <user>, <amount>');
			const amount = parseInt(parts[1]);
			if (isNaN(amount) || amount <= 0) return this.errorReply('Amount must be a positive number.');
			const targetId = toID(parts[0]);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${parts[0]} has no active PokeRouge run.`);
			targetState.coins = Math.max(0, (targetState.coins ?? 0) - amount);
			setState(targetId, targetState);
			this.sendReply(`Removed 🪙 ${amount} coins from ${parts[0]}. They now have ${targetState.coins} coins.`);
			this.modlog('POKEROUGE REMOVECOINS', targetId, `${amount} coins`);
		},

		resetcoins(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim());
			if (!targetId) return this.errorReply('Usage: /pokerouge resetcoins <user>');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${target} has no active PokeRouge run.`);
			targetState.coins = 0;
			setState(targetId, targetState);
			this.sendReply(`Reset ${target}'s coins to 0.`);
			this.modlog('POKEROUGE RESETCOINS', targetId);
		},

		setfloor(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.errorReply('Usage: /pokerouge setfloor <user>, <floor>');
			const floor = parseInt(parts[1]);
			if (isNaN(floor) || floor < 1) return this.errorReply('Floor must be a positive number.');
			const targetId = toID(parts[0]);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${parts[0]} has no active PokeRouge run.`);
			targetState.floor = floor;
			setState(targetId, targetState);
			this.sendReply(`Set ${parts[0]}'s floor to ${floor}.`);
			this.modlog('POKEROUGE SETFLOOR', targetId, `floor ${floor}`);
		},

		resetfloor(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim());
			if (!targetId) return this.errorReply('Usage: /pokerouge resetfloor <user>');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${target} has no active PokeRouge run.`);
			targetState.floor = 1;
			setState(targetId, targetState);
			this.sendReply(`Reset ${target}'s floor to 1.`);
			this.modlog('POKEROUGE RESETFLOOR', targetId);
		},

		viewteam(target, room, user) {
			if (!this.runBroadcast()) return;
			this.checkCan('lock');
			const targetId = toID(target.trim());
			if (!targetId) return this.errorReply('Usage: /pokerouge viewteam <user>');
			const targetState = getState(targetId);
			if (!targetState) return this.sendReplyBox(`${target} has no active PokeRouge run.`);
			const targetDisplay = targetState.displayName || target;
			this.sendReplyBox(
				`<b>PokeRouge Team for ${Impulse.nameColor(targetDisplay, true, true)}</b><br>` +
				`<b>Floor:</b> ${targetState.floor} &nbsp;|&nbsp; <b>🪙 Coins:</b> ${targetState.coins ?? 0}<br>` +
				`<b>Team:</b><br>${renderTeam(targetState.team)}`
			);
		},

		addmon(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.errorReply('Usage: /pokerouge addmon <user>, <pokemon>');
			const targetId = toID(parts[0]);
			const speciesId = toID(parts[1]);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${parts[0]} has no active PokeRouge run.`);
			if (targetState.team.length >= 6) return this.errorReply(`${parts[0]}'s team is full (6 Pokémon).`);
			const species = Dex.species.get(speciesId);
			if (!species.exists) return this.errorReply(`Unknown Pokémon: ${parts[1]}`);
			const addLevel = Math.max(1, targetState.floor - 2);
			targetState.team.push({ species: species.id, level: addLevel, exp: expForLevel(addLevel) });
			setState(targetId, targetState);
			this.sendReply(`Added ${species.name} (Lv.${addLevel}) to ${parts[0]}'s team.`);
			this.modlog('POKEROUGE ADDMON', targetId, species.name);
		},

		givemon(target, room, user) {
			// Alias for addmon
			return this.parse(`/pokerouge addmon ${target}`);
		},

		removemon(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			if (parts.length < 2) return this.errorReply('Usage: /pokerouge removemon <user>, <slot>');
			const slot = parseInt(parts[1]) - 1;
			const targetId = toID(parts[0]);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${parts[0]} has no active PokeRouge run.`);
			if (slot < 0 || slot >= targetState.team.length) {
				return this.errorReply(`Invalid slot. ${parts[0]} has ${targetState.team.length} Pokémon (1-${targetState.team.length}).`);
			}
			if (targetState.team.length === 1) return this.errorReply(`Cannot remove the last Pokémon from a team.`);
			const removed = targetState.team.splice(slot, 1)[0];
			const removedName = Dex.species.get(toID(removed.species)).name || removed.species;
			setState(targetId, targetState);
			this.sendReply(`Removed ${removedName} (slot ${slot + 1}) from ${parts[0]}'s team.`);
			this.modlog('POKEROUGE REMOVEMON', targetId, removedName);
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim());
			if (!targetId) return this.errorReply('Usage: /pokerouge healteam <user>');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${target} has no active PokeRouge run.`);
			// Reset EXP to the baseline for each Pokémon's current level so they're "fresh"
			for (const mon of targetState.team) {
				mon.exp = expForLevel(mon.level);
			}
			setState(targetId, targetState);
			this.sendReply(`Healed ${target}'s team (EXP reset to current level baseline).`);
			this.modlog('POKEROUGE HEALTEAM', targetId);
		},

		// /pokerouge top — Top 100 leaderboard
		top(target, room, user) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<b style="font-size:15px">🏆 PokeRouge Top 100 Leaderboard</b><br><br>` +
				renderLeaderboard()
			);
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html =
				`<b>PokeRouge — Player Commands:</b><br>` +
				`<code>/pokerouge start</code> — Start a new run or resume your current one.<br>` +
				`<code>/pokerouge choose [1/2/3]</code> — Choose a starter or add a new Pokémon to your team.<br>` +
				`<code>/pokerouge shop</code> — View the item shop.<br>` +
				`<code>/pokerouge buy &lt;item&gt;</code> — Purchase an item (costs 🪙 coins).<br>` +
				`<code>/pokerouge use &lt;item&gt; [slot]</code> — Activate a consumable or equip a held item to slot 1-6.<br>` +
				`<code>/pokerouge status</code> — View your floor, 🪙 coins, inventory and team.<br>` +
				`<code>/pokerouge top</code> — View the Top 100 leaderboard by highest floor.<br>` +
				`<code>/pokerouge quit</code> — Abandon your current run.<br>` +
				`<br><b>Shop Items:</b> Rare Candy · Lucky Charm · Revive · Focus Sash · Leftovers · Choice Band · Life Orb · Assault Vest<br>` +
				`<br><b>Tips:</b> Win floors to earn 🪙 coins. Legendary Pokémon may appear as team additions at Floor 20+!`;
			if (isStaff) {
				html +=
					`<br><br><b>Staff Commands (Global Driver+):</b><br>` +
					`<code>/pokerouge givemoney &lt;user&gt; [amount]</code> — Give coins (default 100). Omit user to give to yourself.<br>` +
					`<code>/pokerouge removecoins &lt;user&gt;, &lt;amount&gt;</code> — Remove coins from a user.<br>` +
					`<code>/pokerouge resetcoins &lt;user&gt;</code> — Set a user's coins to 0.<br>` +
					`<code>/pokerouge setfloor &lt;user&gt;, &lt;floor&gt;</code> — Set a user's current floor.<br>` +
					`<code>/pokerouge resetfloor &lt;user&gt;</code> — Reset a user's floor to 1.<br>` +
					`<code>/pokerouge viewteam &lt;user&gt;</code> — View another user's team.<br>` +
					`<code>/pokerouge addmon &lt;user&gt;, &lt;pokemon&gt;</code> — Add a Pokémon to a user's team (max 6).<br>` +
					`<code>/pokerouge givemon &lt;user&gt;, &lt;pokemon&gt;</code> — Same as addmon.<br>` +
					`<code>/pokerouge removemon &lt;user&gt;, &lt;slot&gt;</code> — Remove the Pokémon in the given team slot.<br>` +
					`<code>/pokerouge healteam &lt;user&gt;</code> — Reset a user's team EXP to their current level baseline.<br>`;
			}
			this.sendReplyBox(html);
		},

		'': 'help',
	},
};

// ---------------------------------------------------------------------------
// Battle end handler — handle win / loss
// ---------------------------------------------------------------------------

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = activeMatches.get(battle.roomid);
		if (!match) return;
		activeMatches.delete(battle.roomid);

		// Clean up the bot
		const botUser = Users.get(match.botUserId);
		if (botUser) destroyBotUser(botUser);

		const humanUser = Users.get(match.userId);
		const state = getState(match.userId);
		if (!state) return;

		delete state.battleRoomId;

		const winnerId = toID(winner);
		const humanWon = winnerId === match.userId;

		if (humanWon) {
			const doubleActive = (state.doubleExpFloors ?? 0) > 0;
			const multiplier = doubleActive ? 2 : 1;

			// Award EXP to all team members
			const expReward = floorExpReward(match.floor) * multiplier;
			const messages: string[] = [];

			for (const mon of state.team) {
				// Capture the original species name before any potential evolution
				const oldSpeciesData = Dex.species.get(toID(mon.species));
				const oldName = oldSpeciesData.exists ? oldSpeciesData.name : mon.species;

				const { evolved, oldLevel } = applyExpAndLevelUp(mon, expReward);
				if (mon.level > oldLevel) {
					const newSpeciesData = Dex.species.get(toID(mon.species));
					const newName = newSpeciesData.exists ? newSpeciesData.name : mon.species;
					if (evolved) {
						messages.push(
							`🌟 <b>${oldName}</b> evolved into <b>${newName}</b> and is now <b>Lv.${mon.level}</b>!`
						);
					} else {
						messages.push(`⬆ <b>${newName}</b> grew to <b>Lv.${mon.level}</b>!`);
					}
				}
			}

			// Award coins
			const coinsEarned = floorCoinReward(match.floor) * multiplier;
			state.coins = (state.coins ?? 0) + coinsEarned;

			// Tick down Lucky Charm
			if (doubleActive) {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) - 1;
			}

			const prevFloor = state.floor;
			state.floor++;

			// Update highest floor for leaderboard
			if (state.floor > (state.highestFloor ?? 0)) state.highestFloor = state.floor;
			// Keep display name up-to-date
			if (humanUser) state.displayName = humanUser.name;

			// Every 5 floors, offer a new Pokemon
			const offerNewPokemon = state.floor > 1 && (state.floor - 1) % 5 === 0 && state.team.length < 6;

			if (offerNewPokemon) {
				const opts = pickNewPokemonOptions(state.team, prevFloor);
				state.pendingChoice = opts;
				state.pendingChoiceType = 'add';
				setState(match.userId, state);

				const msg = [
					`✅ Floor ${prevFloor} cleared! You advance to Floor ${state.floor}!`,
					...(messages.map(m => m.replace(/<[^>]+>/g, ''))),
					`🪙 +${coinsEarned} coins${doubleActive ? ' (2×!)' : ''}  |  Total: ${state.coins}`,
					``,
					`🏆 MILESTONE! Use /pokerouge choose [1/2/3] to add a new Pokemon to your team,`,
					`or /pokerouge start to skip and battle Floor ${state.floor}.`,
				].join('\n');
				humanUser?.popup(msg);
			} else {
				setState(match.userId, state);

				const msg = [
					`✅ Floor ${prevFloor} cleared! You advance to Floor ${state.floor}!`,
					...(messages.map(m => m.replace(/<[^>]+>/g, ''))),
					`🪙 +${coinsEarned} coins${doubleActive ? ' (2×!)' : ''}  |  Total: ${state.coins}`,
					``,
					`Use /pokerouge start to battle Floor ${state.floor}.`,
				].join('\n');
				humanUser?.popup(msg);
			}
		} else {
			// Loss
			if (state.hasRevive) {
				// Second chance — retry the same floor
				state.hasRevive = false;
				delete state.battleRoomId;
				setState(match.userId, state);
				humanUser?.popup(
					`💊 Your Revive activated! You get to retry Floor ${match.floor}.\n` +
					`Use /pokerouge start to try again.`
				);
			} else {
				// Run over — reset active run, but preserve leaderboard data
				const {highestFloor, displayName} = state;
				deleteState(match.userId);
				if (highestFloor !== undefined || displayName !== undefined) {
					setState(match.userId, {highestFloor, displayName} as any);
				}
				humanUser?.popup(
					`❌ You were defeated on Floor ${match.floor}!\n` +
					`Your PokeRouge run has ended.\n` +
					`Use /pokerouge start to begin a new run with a fresh starter.`
				);
			}
		}
	},
};
