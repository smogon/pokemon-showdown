/*
 * PokeRouge - Pokemon Roguelike Battle Tower Plugin
 * A battle-tower-based roguelike game for Pokemon Showdown (Impulse server).
 *
 * Commands:
 *   /pokerouge start  (alias: /pr start)
 *   /pokerouge choose [1|2|3]
 *   /pokerouge status
 *   /pokerouge quit
 *
 * Flow:
 *   1. Player types /pokerouge start and sees 3 random level-1 Pokemon to choose from.
 *   2. After clicking "Choose Starter", a battle starts on Floor 1.
 *   3. Winning a floor awards EXP; Pokemon may level up and evolve.
 *   4. Every 5 floors the player may add a new Pokemon to their team.
 *   5. Losing on any floor resets progress back to floor 1 with a fresh random starter.
 *   6. The opponent AI auto-generates a "PokeRouge Trainer" bot whose team scales with the floor.
 */

import { FS } from '../../../lib';
import { ObjectReadWriteStream } from '../../../lib/streams';
import { StreamWorker } from '../../../lib/process-manager';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DATA_FILE = 'impulse/db/pokerouge.json';

/**
 * Official starter Pokemon (gens 1-9) — kept as a reference list (currently unused in gameplay).
 * Both player and bot now pick from the full Pokedex.
 *
 * Reference list:
 *   bulbasaur, charmander, squirtle,
 *   chikorita, cyndaquil, totodile,
 *   treecko, torchic, mudkip,
 *   turtwig, chimchar, piplup,
 *   snivy, tepig, oshawott,
 *   chespin, fennekin, froakie,
 *   rowlet, litten, popplio,
 *   grookey, scorbunny, sobble,
 *   sprigatito, fuecoco, quaxly
 */

/** Cached list of all base-form, official Pokemon IDs usable as starters. */
let baseFormPokemonCache: string[] | null = null;

/**
 * Returns all base-form, official (non-CAP) Pokemon that can appear as starters.
 * Cached after first call for performance.
 */
function getAllBaseFormPokemon(): string[] {
	if (baseFormPokemonCache) return baseFormPokemonCache;
	const all = Dex.species.all();
	baseFormPokemonCache = all
		.filter(s =>
			s.exists &&
			s.num > 0 &&          // official pokedex number
			!s.isNonstandard &&   // no CAP / fakemon
			!s.prevo &&           // base-form only (no previous evolution)
			s.baseSpecies === s.name  // no alternate formes
		)
		.map(s => toID(s.name));
	return baseFormPokemonCache;
}

/**
 * Pick `n` completely random base-form Pokemon, excluding any already in `exclude`.
 */
function pickRandomPokemon(n: number, exclude: string[] = []): string[] {
	const pool = getAllBaseFormPokemon().filter(id => !exclude.includes(id));
	// Fisher-Yates shuffle of a copy
	const shuffled = pool.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

/** Evolution table: species -> { evoTo, evoLevel }. */
const EVOLUTIONS: Record<string, { evoTo: string; evoLevel: number }> = {
	// Gen 1
	bulbasaur: { evoTo: 'ivysaur', evoLevel: 16 },
	ivysaur: { evoTo: 'venusaur', evoLevel: 32 },
	charmander: { evoTo: 'charmeleon', evoLevel: 16 },
	charmeleon: { evoTo: 'charizard', evoLevel: 36 },
	squirtle: { evoTo: 'wartortle', evoLevel: 16 },
	wartortle: { evoTo: 'blastoise', evoLevel: 36 },
	// Gen 2
	chikorita: { evoTo: 'bayleef', evoLevel: 16 },
	bayleef: { evoTo: 'meganium', evoLevel: 32 },
	cyndaquil: { evoTo: 'quilava', evoLevel: 14 },
	quilava: { evoTo: 'typhlosion', evoLevel: 36 },
	totodile: { evoTo: 'croconaw', evoLevel: 18 },
	croconaw: { evoTo: 'feraligatr', evoLevel: 30 },
	// Gen 3
	treecko: { evoTo: 'grovyle', evoLevel: 16 },
	grovyle: { evoTo: 'sceptile', evoLevel: 36 },
	torchic: { evoTo: 'combusken', evoLevel: 16 },
	combusken: { evoTo: 'blaziken', evoLevel: 36 },
	mudkip: { evoTo: 'marshtomp', evoLevel: 16 },
	marshtomp: { evoTo: 'swampert', evoLevel: 36 },
	// Gen 4
	turtwig: { evoTo: 'grotle', evoLevel: 18 },
	grotle: { evoTo: 'torterra', evoLevel: 32 },
	chimchar: { evoTo: 'monferno', evoLevel: 14 },
	monferno: { evoTo: 'infernape', evoLevel: 36 },
	piplup: { evoTo: 'prinplup', evoLevel: 16 },
	prinplup: { evoTo: 'empoleon', evoLevel: 36 },
	// Gen 5
	snivy: { evoTo: 'servine', evoLevel: 17 },
	servine: { evoTo: 'serperior', evoLevel: 36 },
	tepig: { evoTo: 'pignite', evoLevel: 17 },
	pignite: { evoTo: 'emboar', evoLevel: 36 },
	oshawott: { evoTo: 'dewott', evoLevel: 17 },
	dewott: { evoTo: 'samurott', evoLevel: 36 },
	// Gen 6
	chespin: { evoTo: 'quilladin', evoLevel: 16 },
	quilladin: { evoTo: 'chesnaught', evoLevel: 36 },
	fennekin: { evoTo: 'braixen', evoLevel: 16 },
	braixen: { evoTo: 'delphox', evoLevel: 36 },
	froakie: { evoTo: 'frogadier', evoLevel: 16 },
	frogadier: { evoTo: 'greninja', evoLevel: 36 },
	// Gen 7
	rowlet: { evoTo: 'dartrix', evoLevel: 17 },
	dartrix: { evoTo: 'decidueye', evoLevel: 34 },
	litten: { evoTo: 'torracat', evoLevel: 17 },
	torracat: { evoTo: 'incineroar', evoLevel: 34 },
	popplio: { evoTo: 'brionne', evoLevel: 17 },
	brionne: { evoTo: 'primarina', evoLevel: 34 },
	// Gen 8
	grookey: { evoTo: 'thwackey', evoLevel: 16 },
	thwackey: { evoTo: 'rillaboom', evoLevel: 35 },
	scorbunny: { evoTo: 'raboot', evoLevel: 16 },
	raboot: { evoTo: 'cinderace', evoLevel: 35 },
	sobble: { evoTo: 'drizzile', evoLevel: 16 },
	drizzile: { evoTo: 'inteleon', evoLevel: 35 },
	// Gen 9
	sprigatito: { evoTo: 'floragato', evoLevel: 16 },
	floragato: { evoTo: 'meowscarada', evoLevel: 36 },
	fuecoco: { evoTo: 'crocalor', evoLevel: 16 },
	crocalor: { evoTo: 'skeledirge', evoLevel: 36 },
	quaxly: { evoTo: 'quaxwell', evoLevel: 16 },
	quaxwell: { evoTo: 'quaquaval', evoLevel: 36 },
};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
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

/** Bot Pokemon level for a given floor. */
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
	// Check evolution
	const evo = EVOLUTIONS[mon.species];
	if (evo && mon.level >= evo.evoLevel) {
		mon.species = evo.evoTo;
		return { evolved: true, oldLevel };
	}
	return { evolved: false, oldLevel };
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

function packPokemon(species: string, level: number): string {
	const speciesData = Dex.species.get(toID(species));
	const name = speciesData.exists ? speciesData.name : species;

	// Ability: first available
	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	const moves = getLevelUpMoves(toID(species), level);
	const movesStr = moves.join(',');

	// Packed team format: name|species|item|ability|moves|nature|evs|gender|ivs|shiny|level
	// Empty species = same as name; empty item = no held item
	return `${name}|||${ability}|${movesStr}|Hardy||M||||${level}`;
}

function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m.species, m.level)).join(']');
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
		let evo = EVOLUTIONS[species];
		while (evo && level >= evo.evoLevel) {
			species = evo.evoTo;
			evo = EVOLUTIONS[species];
		}
		return packPokemon(species, level);
	}).join(']');
}

/**
 * Starts a PokeRouge battle on the current floor for `user`.
 * Creates the bot, registers AI handlers and tracks the room.
 */
function startBattle(user: User, state: PokeRougeState): void {
	const playerTeam = packTeam(state.team);
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
 */
function pickStarterOptions(): string[] {
	return pickRandomPokemon(3);
}

/**
 * Returns 3 random Pokemon for the "add to team" milestone offer,
 * excluding species already on the player's team.
 */
function pickNewPokemonOptions(currentTeam: PokemonEntry[]): string[] {
	const existing = currentTeam.map(m => m.species);
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
		// Colour the type badge similarly to the PS type chart
		const typeBadge = (speciesData.types ?? []).map(t =>
			`<span style="background:#${typeColor(t)};color:#fff;border-radius:3px;padding:1px 5px;font-size:11px">${t}</span>`
		).join(' ');
		return `<td style="text-align:center;padding:10px 14px;border:2px solid #ccc;` +
			`border-radius:10px;background:#fafafa;min-width:110px">` +
			`${getSprite(s)}<br>` +
			`<b style="font-size:14px">${name}</b><br>` +
			`<span style="font-size:12px">Lv. 1</span><br>` +
			`${typeBadge}<br>` +
			`<button name="send" value="${cmdPrefix} ${i + 1}" ` +
			`style="margin-top:8px;padding:4px 10px;font-weight:bold;` +
			`border-radius:5px;background:#4caf50;color:#fff;border:none;cursor:pointer">` +
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
	return team.map(mon => {
		const speciesData = Dex.species.get(toID(mon.species));
		const name = speciesData.exists ? speciesData.name : mon.species;
		const expNeeded = expForLevel(mon.level + 1) - mon.exp;
		return `<b>${name}</b> Lv.${mon.level} (${expNeeded} EXP to next level)`;
	}).join('<br>');
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

			this.sendReplyBox(
				`<b>PokeRouge Status for ${Impulse.nameColor(user.name, true)}</b><br>` +
				`<b>Floor:</b> ${state.floor}<br>` +
				`<b>Team:</b><br>${renderTeam(state.team)}`
			);
		},

		// /pokerouge quit
		quit(target, room, user) {
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokeRouge run.');
			}
			if (state.battleRoomId) {
				const br = Rooms.get(state.battleRoomId);
				if (br?.battle) br.battle.forfeit(user);
			}
			deleteState(user.id);
			this.sendReply('Your PokeRouge run has been abandoned. Use /pokerouge start to begin a new run.');
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<b>PokeRouge Commands:</b><br>` +
				`<code>/pokerouge start</code> — Start or resume a PokeRouge run.<br>` +
				`<code>/pokerouge choose [1/2/3]</code> — Choose a starter or new team addition.<br>` +
				`<code>/pokerouge status</code> — View your current run status.<br>` +
				`<code>/pokerouge quit</code> — Abandon your current run.<br>` +
				`<br>Aliases: <code>/pr start</code>, <code>/pr choose</code>, <code>/pr status</code>`
			);
		},

		'': 'help',
	},

	/** Alias: /pr [subcommand] */
	pr(target, room, user) {
		const [sub, ...rest] = target.trim().split(/\s+/);
		this.parse(`/pokerouge ${sub} ${rest.join(' ')}`);
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
			// Award EXP and possibly level up / evolve
			const reward = floorExpReward(match.floor);
			const messages: string[] = [];

			for (const mon of state.team) {
				const { evolved, oldLevel } = applyExpAndLevelUp(mon, reward);
				if (mon.level > oldLevel) {
					const speciesData = Dex.species.get(toID(mon.species));
					const name = speciesData.exists ? speciesData.name : mon.species;
					if (evolved) {
						messages.push(`🌟 <b>${name}</b> evolved and is now <b>Lv.${mon.level}</b>!`);
					} else {
						messages.push(`⬆ <b>${name}</b> grew to <b>Lv.${mon.level}</b>!`);
					}
				}
			}

			const prevFloor = state.floor;
			state.floor++;

			// Every 5 floors, offer a new Pokemon
			const offerNewPokemon = state.floor > 1 && (state.floor - 1) % 5 === 0 && state.team.length < 6;

			if (offerNewPokemon) {
				const opts = pickNewPokemonOptions(state.team);
				state.pendingChoice = opts;
				state.pendingChoiceType = 'add';
				setState(match.userId, state);

				const msg = [
					`✅ Floor ${prevFloor} cleared! You advance to Floor ${state.floor}!`,
					...(messages.map(m => m.replace(/<[^>]+>/g, ''))),
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
					``,
					`Use /pokerouge start to battle Floor ${state.floor}.`,
				].join('\n');
				humanUser?.popup(msg);
			}
		} else {
			// Loss — reset the run
			deleteState(match.userId);
			humanUser?.popup(
				`❌ You were defeated on Floor ${match.floor}!\n` +
				`Your PokeRouge run has ended.\n` +
				`Use /pokerouge start to begin a new run with a fresh starter.`
			);
		}
	},
};
