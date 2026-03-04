/*
 * PokéRogue - Pokemon Roguelike Battle Tower Plugin
 * A battle-tower-based roguelike game for Pokemon Showdown (Impulse server).
 *
 * Player commands:
 *   /pokerouge start           — Opens the PokéRogue game page (auto-starts new run if needed).
 *   /pokerouge battle          — Starts the next floor battle (also via page button).
 *   /pokerouge choose [1|2|3]  — Choose a starter or add a Pokémon to your team.
 *   /pokerouge shop            — Opens the shop on the game page.
 *   /pokerouge buy <item>
 *   /pokerouge use <item> [team slot]
 *   /pokerouge status          — Shows current run status with Pokémon sprites.
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
 *   /pokerouge removemon [user]       — Delete all PokéRogue data for a user
 *   /pokerouge viewteam [user]
 *   /pokerouge healteam [user]
 *   /pokerouge resetfloor [user]
 *
 * Files:
 *   pokerouge-core.ts    — types, constants, data persistence, game helpers
 *   pokerouge-battle.ts  — bot creation, AI logic, battle start
 *   pokerouge.ts         — HTML rendering, commands, handlers, pages, start hook (this file)
 */

import { Utils } from '../../../lib';
import { Table } from '../../utils';
import {
	SHOP_ITEMS, LEGENDARY_TAGS,
	PokemonEntry, PokeRougeState,
	getState, setState, deleteState, savedData,
	pickStarterOptions, pickNewPokemonOptions,
	expForLevel, floorExpReward, floorCoinReward,
	applyExpAndLevelUp, getLevelUpEvo,
	getLevelUpMoves, rollShopInventory,
} from './pokerouge-core';
import {
	activeMatches,
	startBattle, destroyBotUser,
} from './pokerouge-battle';

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	// Use dex (HOME-style) sprites for Gen 6+ Pokémon or any forme variant (Mega,
	// Alolan, Galarian, Eternamax, etc.) — these exist for all forms including
	// Eternatus-Eternamax.  Fall back to gen5 static sprites for older base formes.
	const useDex = sp.exists && (sp.gen > 5 || !!sp.forme);
	const src = useDex
		? `https://play.pokemonshowdown.com/sprites/dex/${id}.png`
		: `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
	return `<img src="${src}" width="${size}" height="${size}" alt="${altName} sprite" style="image-rendering:pixelated" />`;
}

/** Returns a 24x24 item icon img tag using PS's item icon sprites. Works for every PS item. */
function getItemSprite(itemId: string): string {
	return `<img src="https://play.pokemonshowdown.com/sprites/itemicons/${itemId}.png"` +
		` width="24" height="24" alt="" style="vertical-align:middle;image-rendering:pixelated" />`;
}

/** Renders a single coloured stat bar row (label | bar | value). */
function renderStatBar(label: string, value: number, color: string): string {
	const pct = Math.min(100, Math.round((value / 255) * 100));
	return `<div class="pr-statbar-row">` +
		`<span class="pr-statbar-label">${label}</span>` +
		`<div class="pr-statbar-track">` +
		`<div class="pr-statbar-fill" style="background:${color};width:${pct}%"></div>` +
		`</div>` +
		`<span class="pr-statbar-val">${value}</span>` +
		`</div>`;
}

/** Renders a thin EXP progress bar for a team member. */
function renderExpBar(mon: PokemonEntry): string {
	let pct = 100;
	if (mon.level < 100) {
		const expAtCurrent = expForLevel(mon.level);
		const expAtNext = expForLevel(mon.level + 1);
		const range = expAtNext - expAtCurrent;
		pct = range > 0 ? Math.max(0, Math.min(100, Math.round(((mon.exp - expAtCurrent) / range) * 100))) : 0;
	}
	return `<div class="pr-expbar"><div class="pr-expbar-fill" style="width:${pct}%"></div></div>`;
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

/** Builds type badge HTML for a list of types. `large` = choice-card size; default = team-card size. */
function renderTypeBadge(types: string[], large = false): string {
	if (large) {
		return types.map(t =>
			`<span style="background:#${typeColor(t)};color:#fff;border-radius:4px;` +
			`padding:2px 6px;font-size:10px;font-weight:bold">${t}</span>`
		).join(' ');
	}
	return types.map(t =>
		`<span style="background:#${typeColor(t)};color:#fff;border-radius:3px;` +
		`padding:1px 5px;font-size:9px;font-weight:bold">${t}</span>`
	).join(' ');
}


function renderTeam(team: PokemonEntry[], withSprites = false): string {
	return team.map((mon, idx) => {
		const speciesData = Dex.species.get(toID(mon.species));
		const name = speciesData.exists ? speciesData.name : mon.species;
		const expNeeded = mon.level < 100 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const heldLabel = mon.heldItem ? ` [${mon.heldItem}]` : '';
		const sprite = withSprites ? getSprite(mon.species, 40) + ' ' : '';
		return `${sprite}<b>${idx + 1}. ${name}${heldLabel}</b> Lv.${mon.level}${mon.level < 100 ? ` (${expNeeded} EXP to next level)` : ' (MAX)'}`;
	}).join('<br>');
}

/** Builds the Top-100 leaderboard HTML using the server's themed table CSS. */
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
		const medal = rank === 1 ? '#1' : rank === 2 ? '#2' : rank === 3 ? '#3' : `${rank}.`;
		const teamStr = (s.team ?? [])
			.map(m => {
				const spr = getSprite(m.species, 30);
				const sname = Dex.species.get(toID(m.species)).name || m.species;
				return `${spr}<small>${sname}</small>`;
			})
			.join(' ') || '—';
		return [medal, nameHtml, `Floor ${s.highestFloor ?? 0}`, teamStr];
	});

	return Table(
		'PokéRogue Top 100',
		['#', 'Player', 'Best Floor', 'Last Team'],
		rows
	);
}

// ---------------------------------------------------------------------------
// Fresh-run state factory — used by /pokerouge start, /pokerouge newgame, and the page handler.
// Centralised so every new-game path starts with the same fields.
// ---------------------------------------------------------------------------

/**
 * Builds a fresh PokéRouge state with a new starter-choice pending.
 * Leaderboard fields (highestFloor, displayName) are preserved from the
 * previous state when provided so records are never lost on reset.
 */
function buildFreshState(existing: PokeRougeState | null): PokeRougeState {
	const options = pickStarterOptions();
	const fresh: PokeRougeState = {
		floor: 1,
		team: [],
		pendingChoice: options,
		pendingChoiceType: 'starter',
		coins: 0,
		streaksWon: 0,
	};
	if (existing?.highestFloor) fresh.highestFloor = existing.highestFloor;
	if (existing?.displayName) fresh.displayName = existing.displayName;
	return fresh;
}

/**
 * Renders the full interactive game popup HTML.
 * view = 'main' (default dashboard) | 'shop' (item shop sub-view)
 */
function renderGamePopup(state: PokeRougeState, view: 'main' | 'shop' = 'main'): string {
	let buf = `<div class="pr-popup">`;

	// ── Header ──────────────────────────────────────────────────────────────
	buf += `<div class="pr-popup-header">`;
	buf += `<h2>PokéRogue</h2>`;
	if (state.team?.length) {
		buf += `<div style="display:flex;gap:6px;align-items:center">` +
			`<span class="pr-floor-badge">Floor ${state.floor}</span>` +
			`<span class="pr-coin-badge">${state.coins ?? 0} Coins</span>` +
			`</div>`;
	}
	buf += `</div>`;

	// ── Active battle ────────────────────────────────────────────────────────
	if (state.battleRoomId && Rooms.get(state.battleRoomId as RoomID)) {
		buf += `<div style="text-align:center;padding:14px 0">` +
			`<p style="color:#f5c518;font-weight:bold;font-size:14px">Battle in progress!</p>` +
			`<div class="pr-popup-actions" style="justify-content:center">` +
			`<a href="/${state.battleRoomId}" class="button" style="color:#fff;text-decoration:none">Go to Battle</a>` +
			`<button name="send" value="/pokerouge start" class="button">Refresh</button>` +
			`</div></div>`;
		buf += `</div>`;
		return buf;
	}

	// ── Pending Pokémon choice ───────────────────────────────────────────────
	if (state.pendingChoice?.length) {
		const isAdd = state.pendingChoiceType === 'add';
		buf += `<p style="color:#c4a8ff;font-weight:bold;font-size:13px;margin:8px 0">${isAdd
			? 'Milestone! Choose a Pokemon to add to your team:'
			: 'Choose your starter Pokemon — all at Lv. 1:'
		}</p>`;
		buf += `<div class="pr-choice-grid">`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const s = state.pendingChoice[i];
			const sp = Dex.species.get(toID(s));
			const name = sp.exists ? sp.name : s;
			const isLegendary = sp.tags?.some(tag => LEGENDARY_TAGS.has(tag));
			const types = sp.types ?? [];
			const typeBadge = renderTypeBadge(types, true);
			const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
			const ab = (sp.abilities ?? {}) as unknown as Record<string, string>;
			const abilityList = [ab['0'], ab['1'], ab['H']].filter(Boolean).join(' / ') || '—';
			const moveIds = getLevelUpMoves(toID(s), isAdd ? Math.max(1, state.floor - 2) : 1);
			const movesStr = moveIds.map(m => Dex.moves.get(m).name || m).join(', ') || 'Tackle';
			buf += `<div class="pr-choice-card${isLegendary ? ' legendary' : ''}">`;
			buf += getSprite(s, 72);
			buf += `<br><b style="font-size:13px;color:#e8e0ff">${Utils.escapeHTML(name)}</b>`;
			if (isLegendary) {
				buf += `<br><span style="color:#f59e0b;font-size:10px;font-weight:bold;` +
					`letter-spacing:0.5px">LEGENDARY</span>`;
			}
			buf += `<br><div style="margin:4px 0">${typeBadge}</div>`;
			buf += `<div style="font-size:10px;color:#8ab4f8;margin:2px 0">` +
				`BST <b style="color:#c4a8ff">${bst}</b></div>`;
			buf += `<div style="margin:5px 0">`;
			buf += renderStatBar('HP', bs.hp, '#ff6060');
			buf += renderStatBar('Atk', bs.atk, '#f5a623');
			buf += renderStatBar('Def', bs.def, '#f5e642');
			buf += renderStatBar('SpA', bs.spa, '#6495f5');
			buf += renderStatBar('SpD', bs.spd, '#7ecf6e');
			buf += renderStatBar('Spe', bs.spe, '#f564a9');
			buf += `</div>`;
			buf += `<div style="font-size:10px;color:#888;margin:4px 0;text-align:left">` +
				`<b style="color:#aaa">Ability:</b> ${Utils.escapeHTML(abilityList)}<br>` +
				`<b style="color:#aaa">Moves:</b> ${Utils.escapeHTML(movesStr)}` +
				`</div>`;
			buf += `<button name="send" value="/pokerouge choose ${i + 1}" class="button"` +
				` style="width:100%;margin-top:6px">${isAdd ? 'Add to Team' : 'Choose!'}</button>`;
			buf += `</div>`;
		}
		buf += `</div>`;
		if (state.team?.length) {
			buf += `<div class="pr-popup-actions">` +
				`<button name="send" value="/pokerouge start" class="button">Refresh</button>` +
				`</div>`;
		}
		buf += `</div>`;
		return buf;
	}

	// ── No team ──────────────────────────────────────────────────────────────
	if (!state.team?.length) {
		buf += `<div style="text-align:center;padding:16px 0">` +
			`<p style="color:#8ab4f8;font-size:13px;margin:0 0 12px">No active run. Start a new adventure!</p>` +
			`<button name="send" value="/pokerouge newgame" class="button">New Run</button>` +
			`</div>`;
		buf += `</div>`;
		return buf;
	}

	// ── Shop sub-view ────────────────────────────────────────────────────────
	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		buf += `<div class="pr-popup-actions">` +
			`<button name="send" value="/pokerouge start" class="button">Back</button>` +
			`<button name="send" value="/pokerouge refreshshop" class="button">Reroll Shop (5 coins)</button>` +
			`<button name="send" value="/pokerouge battle" class="button">Start Battle</button>` +
			`</div>`;
		buf += `<h3>Item Shop &nbsp;<span class="pr-coin-badge">${shopCoins} coins</span></h3>`;
		buf += `<p style="font-size:10px;color:#666;margin:2px 0 8px">` +
			`Held items are consumed after the next battle.</p>`;
		buf += `<div class="pr-shop-grid">`;
		for (const itemId of (state.shopInventory ?? [])) {
			const item = SHOP_ITEMS[itemId];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card">`;
			buf += `<div style="margin-bottom:5px">${getItemSprite(itemId)}</div>`;
			buf += `<b style="color:#c4a8ff;font-size:12px">${Utils.escapeHTML(item.name)}</b><br>`;
			buf += `<small style="color:#8ab4f8;font-size:10px">${Utils.escapeHTML(item.description)}</small>`;
			if (item.heldItem) {
				buf += `<br><small style="color:#555;font-size:9px">[held — 1 battle]</small>`;
			}
			buf += `<br>`;
			if (canAfford) {
				buf += `<button name="send" value="/pokerouge buy ${item.id}" class="button"` +
					` style="width:100%;margin-top:5px">Buy — ${item.cost}c</button>`;
			} else {
				buf += `<button class="button" style="width:100%;margin-top:5px;opacity:0.45" disabled>` +
					`${item.cost}c (need more)</button>`;
			}
			buf += `</div>`;
		}
		buf += `</div></div>`;
		return buf;
	}

	// ── Main dashboard ───────────────────────────────────────────────────────
	const coins = state.coins ?? 0;
	const items = state.items ?? {};
	const activeEffects: string[] = [];
	if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
	if (state.hasRevive) activeEffects.push('Revive (active)');

	buf += `<div class="pr-popup-stats">`;
	buf += `<span>Floor <b>${state.floor}</b></span>`;
	buf += `<span>Coins <b>${coins}</b></span>`;
	buf += `<span>Wins <b>${state.streaksWon ?? 0}</b></span>`;
	if (state.highestFloor) buf += `<span>Best <b>${state.highestFloor}</b></span>`;
	buf += `</div>`;

	if (activeEffects.length) {
		buf += `<div style="font-size:11px;color:#8ab4f8;` +
			`background:rgba(90,63,160,0.15);border:1px solid rgba(90,63,160,0.3);` +
			`border-radius:6px;padding:4px 10px;margin:6px 0">` +
			`<b>Active:</b> ${activeEffects.join(' &nbsp; ')}</div>`;
	}

	buf += `<h3>Your Team</h3>`;
	buf += `<div class="pr-popup-team">`;
	for (const mon of state.team) {
		const sp = Dex.species.get(toID(mon.species));
		const name = sp.exists ? sp.name : mon.species;
		const types = sp.types ?? [];
		const typeBadge = renderTypeBadge(types);
		const expNeeded = mon.level < 100 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const heldLabel = mon.heldItem ? SHOP_ITEMS[mon.heldItem]?.name ?? mon.heldItem : '';
		buf += `<div class="pr-popup-mon">`;
		buf += getSprite(mon.species, 52);
		buf += `<div style="flex:1;min-width:0">`;
		buf += `<b style="color:#e8e0ff;font-size:12px">${Utils.escapeHTML(name)}</b><br>`;
		buf += `<span style="font-size:10px">${typeBadge}</span><br>`;
		buf += `<span style="font-size:11px;color:#8ab4f8">Lv.${mon.level}` +
			(mon.level < 100
				? ` <span style="color:#555">(${expNeeded} EXP)</span>`
				: ` <span style="color:#f5c518">MAX</span>`) +
			`</span>`;
		buf += renderExpBar(mon);
		if (heldLabel) {
			buf += `<br><span style="font-size:10px;color:#8ab4f8">` +
				`${getItemSprite(mon.heldItem!)} ${Utils.escapeHTML(heldLabel)}</span>`;
		}
		buf += `</div></div>`;
	}
	buf += `</div>`;

	const ownedItems = Object.entries(items).filter(([, qty]) => qty > 0);
	if (ownedItems.length) {
		buf += `<h3>Inventory</h3>`;
		buf += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin:4px 0">`;
		for (const [id, qty] of ownedItems) {
			const iname = SHOP_ITEMS[id]?.name ?? id;
			buf += `<span style="background:rgba(90,63,160,0.2);` +
				`border:1px solid rgba(90,63,160,0.4);border-radius:6px;` +
				`padding:3px 8px;font-size:11px">` +
				`${getItemSprite(id)} ${Utils.escapeHTML(iname)} \u00d7${qty}</span>`;
		}
		buf += `</div>`;
	}

	buf += `<div class="pr-popup-actions" style="margin-top:12px">`;
	buf += `<button name="send" value="/pokerouge battle" class="button">` +
		`Start Battle — Floor ${state.floor}</button>`;
	buf += `<button name="send" value="/pokerouge popup shop" class="button">Shop</button>`;
	buf += `<button name="send" value="/pokerouge top" class="button">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerouge quit" class="button" style="color:#ff8080">` +
		`Quit Run</button>`;
	buf += `</div>`;

	buf += `</div>`;
	return buf;
}

/** Repairs a defined-but-empty `pendingChoice` array by re-rolling starter or add options. */
function repairEmptyPendingChoice(state: PokeRougeState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

const NO_RUN_POPUP_HTML =
	`<div class="pr-popup">` +
	`<div class="pr-popup-header"><h2>PokéRogue</h2></div>` +
	`<div style="text-align:center;padding:16px 0">` +
	`<p style="color:#8ab4f8;font-size:13px;margin:0 0 12px">No active run.</p>` +
	`<button name="send" value="/pokerouge newgame" class="button">New Run</button>` +
	`</div></div>`;

/**
 * Sends or refreshes the game popup for a user across all their active connections.
 * Uses |uhtml| so it creates the block if it doesn't exist, or replaces if it does.
 */
function sendGamePopup(user: User, state: PokeRougeState | null, view: 'main' | 'shop' = 'main'): void {
	// Repair a defined-but-empty pendingChoice before rendering.
	if (state) repairEmptyPendingChoice(state, user.id);
	const html = (!state || (!state.team?.length && !state.pendingChoice?.length && !state.battleRoomId))
		? NO_RUN_POPUP_HTML
		: renderGamePopup(state, view);
	for (const conn of user.connections) {
		conn.send(`|uhtml|pokerouge-${user.id}|${html}`);
	}
}

// ---------------------------------------------------------------------------
// Chat command handlers
// ---------------------------------------------------------------------------

export const commands: Chat.ChatCommands = {
	pokerouge: {
		// /pokerouge start — opens the PokéRogue game page.
		// Ensures a new run is initialized before opening the page so it never renders blank.
		start(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			// Auto-initialize state before navigating so the page always has content to display.
			// Treat an empty pendingChoice array the same as no pending choice — an empty array
			// means starter options couldn't be generated (e.g. Dex not yet loaded) and must be
			// regenerated now.
			const state = getState(user.id);
			let newState = state;
			let stateChanged = false;
			// Clear stale battle room reference so the auto-start condition can properly evaluate.
			if (newState?.battleRoomId && !Rooms.get(newState.battleRoomId as RoomID)) {
				delete newState.battleRoomId;
				stateChanged = true;
			}
			if (!newState || (!newState.team?.length && !newState.pendingChoice?.length && !newState.battleRoomId)) {
				newState = buildFreshState(newState);
				stateChanged = true;
			}
			if (stateChanged && newState) {
				setState(user.id, newState);
			}
			if (newState) repairEmptyPendingChoice(newState, user.id);
			const currentState = newState!;
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(currentState)}`);
		},

		// /pokerouge newgame [confirm] — triggered by the "Start Fresh Run" button.
		// If the player has an active run (team or floor > 1), show a warning and
		// require `/pokerouge newgame confirm` to permanently wipe progress.
		newgame(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const existing = getState(user.id);
			const hasProgress = existing && (existing.team?.length > 0 || (existing.floor ?? 1) > 1);

			if (hasProgress && target.trim().toLowerCase() !== 'confirm') {
				return this.sendReplyBox(
					`<b>Warning: You already have an active PokéRogue run!</b><br>` +
					`Floor: <b>${existing.floor}</b> &nbsp;|&nbsp; ` +
					`Team: <b>${existing.team?.length ?? 0} Pokémon</b> &nbsp;|&nbsp; ` +
					`Coins: <b>${existing.coins ?? 0}</b><br><br>` +
					`Starting a fresh run will permanently delete your current progress.<br>` +
					`<button name="send" value="/pokerouge newgame confirm" class="button">` +
					`Yes, start a fresh run</button> &nbsp; ` +
					`<button name="send" value="/pokerouge start" class="button">` +
					`Keep my current run</button>`
				);
			}

			const newState = buildFreshState(existing);
			setState(user.id, newState);

			// Display the starter-selection UI directly in the popup
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(newState)}`);
		},

		// /pokerouge choose <1|2|3>
		choose(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const n = parseInt(target.trim());
			if (!n || n < 1 || n > 3) {
				return this.errorReply('Usage: /pokerouge choose [1, 2, or 3]');
			}

			const state = getState(user.id);
			if (!state?.pendingChoice?.length) {
				return this.errorReply('You have no pending Pokémon choice. Use /pokerouge start first.');
			}

			// Guard against starting a second battle while one is active
			if (state.battleRoomId) {
				const activeBattleRoom = Rooms.get(state.battleRoomId);
				if (activeBattleRoom) {
					return this.sendReplyBox(
						`You already have an active PokéRogue battle! ` +
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
			// Treat any non-'add' type (including missing/undefined) as a starter choice,
			// matching the page UI which also defaults to 'Choose Starter' when type is absent.
			const isStarter = state.pendingChoiceType !== 'add';

			if (isStarter) {
				// Begin the run with this starter at level 1
				state.team = [{ species: chosen, level: 1, exp: 0 }];
				state.floor = 1;
			} else {
				// Guard: don't exceed the 6-Pokemon team size limit
				if (state.team.length >= 6) {
					delete state.pendingChoice;
					delete state.pendingChoiceType;
					setState(user.id, state);
					return this.errorReply('Your team is already full (6 Pokémon). The pending choice has been cleared.');
				}
				// Add the Pokemon to the team at floor-appropriate level
				const addLevel = Math.max(1, state.floor - 2);
				state.team.push({ species: chosen, level: addLevel, exp: expForLevel(addLevel) });
			}

			delete state.pendingChoice;
			delete state.pendingChoiceType;

			// Persist state BEFORE attempting battle creation so the team update and choice
			// deletion are not lost if battle creation fails (e.g. server lockdown).
			setState(user.id, state);

			// Start the battle — Rooms.createBattle will navigate the user to the battle room
			const ok = startBattle(user, state);
			if (!ok) {
				// startBattle already sent a popup; refresh or create the game UI
				const updatedState = getState(user.id);
				if (updatedState) {
					this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(updatedState)}`);
				}
				return;
			}

			// Battle started — the PS client will navigate to the battle room automatically.
			// Send a brief confirmation in chat so the user knows what happened.
			this.sendReplyBox(`${getSprite(chosen, 40)} You chose <b>${name}</b>! ${isStarter ? 'Your journey begins — ' : ''}Starting your battle now...`);
		},

		// /pokerouge battle — starts the next floor battle for a player mid-run.
		// Called from the game page "Start Battle" button.
		battle(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('No active PokéRogue run. Use /pokerouge start to open the game page!');
			}

			if (state.battleRoomId) {
				const battleRoom = Rooms.get(state.battleRoomId as RoomID);
				if (battleRoom) {
					return this.sendReplyBox(
						`You already have an active PokéRogue battle! ` +
						`<a href="/${state.battleRoomId}">Click here</a> to go to your battle.`
					);
				}
				// Stale reference — clear and continue
				delete state.battleRoomId;
				setState(user.id, state);
			}

			if (state.pendingChoice?.length) {
				return this.sendReplyBox(
					`You have a pending Pokemon choice! ` +
					`<button name="send" value="/pokerouge start" class="button">Open PokéRogue</button> to choose.`
				);
			}

			if (!state.team?.length) {
				return this.errorReply('No team to battle with. Use /pokerouge start to begin a new run!');
			}

			// Start the battle — Rooms.createBattle navigates the user to the battle room
			const ok = startBattle(user, state);
			if (!ok) {
				// startBattle already sent a popup with the error; refresh the game UI for retry
				const updatedState = getState(user.id);
				if (updatedState) this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(updatedState)}`);
				return;
			}
			// Battle started — PS client navigates automatically via p.joinRoom inside Rooms.createBattle
		},

		// /pokerouge status — shows current run info with sprites
		status(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.sendReplyBox(
					`You have no active PokéRogue run. ` +
					`<button name="send" value="/pokerouge start" class="button">Start a run</button>`
				);
			}
			if (state.pendingChoice?.length && !state.team?.length) {
				return this.sendReplyBox(
					`You have a pending Pokemon choice! ` +
					`<button name="send" value="/pokerouge start" class="button">Open PokéRogue</button> to choose.`
				);
			}
			if (!state.team?.length) {
				return this.sendReplyBox(
					`You have no active PokéRogue run. ` +
					`<button name="send" value="/pokerouge newgame" class="button">Start a run</button>`
				);
			}
			const coins = state.coins ?? 0;
			const items = state.items ?? {};
			const itemList = Object.entries(items)
				.filter(([, qty]) => qty > 0)
				.map(([id, qty]) => `${SHOP_ITEMS[id]?.name ?? id} x${qty}`)
				.join(', ') || 'None';
			this.sendReplyBox(
				`<b>PokéRogue Status</b><br>` +
				`<b>Floor:</b> ${state.floor} &nbsp;|&nbsp; <b>Coins:</b> ${coins} &nbsp;|&nbsp; ` +
				`<b>Streaks:</b> ${state.streaksWon ?? 0}` +
				(state.highestFloor ? ` &nbsp;|&nbsp; <b>Best Floor:</b> ${state.highestFloor}` : '') +
				(state.pendingChoice?.length ? `<br><br><b>You have a pending Pokemon choice!</b> ` +
					`<button name="send" value="/pokerouge start" class="button">Open PokéRogue</button> to choose.` : '') +
				`<br><br><b>Team:</b><br>${renderTeam(state.team, true)}` +
				(itemList !== 'None' ? `<br><br><b>Inventory:</b> ${itemList}` : '')
			);
		},

		// /pokerouge shop — opens the game popup at the shop view
		shop(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) return this.errorReply('You have no active PokéRogue run. Use /pokerouge start first.');
			// Ensure a shop inventory exists for this player
			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(state, 'shop')}`);
		},

		// /pokerouge refreshshop — reroll the shop inventory for 5 coins
		refreshshop(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) return this.errorReply('You have no active PokéRogue run. Use /pokerouge start first.');
			const coins = state.coins ?? 0;
			if (coins < 5) return this.errorReply(`Not enough coins. You need 5 but have ${coins}.`);
			state.coins = coins - 5;
			state.shopInventory = rollShopInventory();
			setState(user.id, state);
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(state, 'shop')}`);
		},

		// /pokerouge buy <item>
		buy(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const itemId = toID(target.trim());
			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${target.trim()}". Use /pokerouge shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run. Use /pokerouge start first.');
			}

			// Ensure shop inventory is rolled before validating
			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}

			// Enforce the rotation — only items currently in the shop can be purchased
			if (!state.shopInventory.includes(itemId)) {
				return this.errorReply(
					`${item.name} is not in your current shop. Use /pokerouge shop to see what's available, ` +
					`or /pokerouge refreshshop to reroll for 5 coins.`
				);
			}

			const coins = state.coins ?? 0;
			if (coins < item.cost) {
				return this.errorReply(`Not enough coins. You have ${coins} but need ${item.cost}.`);
			}

			state.coins = coins - item.cost;
			state.items = state.items ?? {};
			state.items[itemId] = (state.items[itemId] ?? 0) + 1;
			setState(user.id, state);

			// Return to the shop so the user can continue shopping
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(state, 'shop')}`);
		},

		// /pokerouge use <item> [team slot 1-6]
		use(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const parts = target.trim().split(/\s+/);
			const itemId = toID(parts[0] ?? '');
			const slotArg = parseInt(parts[1] ?? '0');

			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${parts[0]}". Use /pokerouge shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run. Use /pokerouge start first.');
			}

			const qty = state.items?.[itemId] ?? 0;
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
					`<b>${evolved ? `${oldName} evolved into ${newName}` : newName}</b> grew to <b>Lv.${mon.level}</b>!`
				);
			}
			case 'luckycharm': {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) + 3;
				setState(user.id, state);
				return this.sendReplyBox(
					`<b>Lucky Charm</b> activated! EXP and coins are doubled for the next ${state.doubleExpFloors} floors.`
				);
			}
			case 'revive': {
				state.hasRevive = true;
				setState(user.id, state);
				return this.sendReplyBox(
					`<b>Revive</b> activated! If you lose your next battle, you will retry the same floor.`
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
				return this.sendReplyBox(`Equipped <b>${item.name}</b> to <b>${monName}</b>!`);
			}
			}
		},

		// /pokerouge quit
		quit(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run.');
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
			this.sendReply(`|uhtml|pokerouge-${user.id}|${NO_RUN_POPUP_HTML}`);
			return;
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
			if (amount <= 0 || isNaN(amount)) return this.errorReply('Amount must be a positive number.');
			const targetState = getState(targetId);
			if (!targetState) {
				return this.errorReply(`${targetName} has no active PokéRogue run.`);
			}
			targetState.coins = (targetState.coins ?? 0) + amount;
			setState(targetId, targetState);
			this.sendReply(`Gave ${amount} coins to ${targetName}. They now have ${targetState.coins} coins.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member gave you ${amount} coins. You now have ${targetState.coins} coins.`);
			}
			this.modlog('POKEROUGE GIVEMONEY', targetId, `${amount} coins`);
		},

		removecoins(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			let targetId: string;
			let targetName: string;
			let amount: number;
			const isNumber = (s: string) => /^\d+$/.test(s);
			if (parts.length === 1 && isNumber(parts[0])) {
				// Single numeric arg: treat as amount and default target to self
				targetId = user.id;
				targetName = user.name;
				amount = parseInt(parts[0]);
			} else if (parts.length >= 2) {
				const rawName = parts[0];
				const parsedId = toID(rawName);
				if (!rawName) {
					// Empty username segment: default target to self
					targetId = user.id;
					targetName = user.name;
				} else if (!parsedId) {
					return this.errorReply(`Invalid username: "${rawName}".`);
				} else {
					targetId = parsedId;
					targetName = rawName;
				}
				if (!isNumber(parts[1])) {
					return this.errorReply('Amount must be a positive number.');
				}
				amount = parseInt(parts[1]);
			} else {
				return this.errorReply('Usage: /pokerouge removecoins [user], <amount>');
			}
			if (isNaN(amount) || amount <= 0) return this.errorReply('Amount must be a positive number.');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			targetState.coins = Math.max(0, (targetState.coins ?? 0) - amount);
			setState(targetId, targetState);
			this.sendReply(`Removed ${amount} coins from ${targetName}. They now have ${targetState.coins} coins.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member removed ${amount} coins from your account. You now have ${targetState.coins} coins.`);
			}
			this.modlog('POKEROUGE REMOVECOINS', targetId, `${amount} coins`);
		},

		resetcoins(target, room, user) {
			this.checkCan('lock');
			const trimmed = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmed) {
				// No target provided: default to self
				targetId = user.id;
				targetName = user.name;
			} else {
				const parsedId = toID(trimmed);
				if (!parsedId) {
					return this.errorReply('Invalid username.');
				}
				targetId = parsedId;
				targetName = trimmed;
			}
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			targetState.coins = 0;
			setState(targetId, targetState);
			this.sendReply(`Reset ${targetName}'s coins to 0.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member reset your coin balance to 0.`);
			}
			this.modlog('POKEROUGE RESETCOINS', targetId);
		},

		setfloor(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			let targetId: string;
			let targetName: string;
			let floor: number;
			const isNumber = (s: string) => /^\d+$/.test(s);
			if (parts.length === 1 && isNumber(parts[0])) {
				// Single numeric arg: treat as floor and default target to self
				targetId = user.id;
				targetName = user.name;
				floor = parseInt(parts[0]);
			} else if (parts.length >= 2) {
				const rawUser = parts[0];
				if (!rawUser) {
					// Empty username (e.g., "/pokerouge setfloor , 10"): default to self
					targetId = user.id;
					targetName = user.name;
				} else {
					targetId = toID(rawUser);
					if (!targetId) {
						return this.errorReply('Invalid username for setfloor.');
					}
					targetName = rawUser;
				}
				if (!isNumber(parts[1])) return this.errorReply('Floor must be a positive number.');
				floor = parseInt(parts[1]);
			} else {
				return this.errorReply('Usage: /pokerouge setfloor [user], <floor>');
			}
			if (isNaN(floor) || floor < 1) return this.errorReply('Floor must be a positive number.');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokéRogue data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			targetState.floor = floor;
			setState(targetId, targetState);
			this.sendReply(`Set ${targetName}'s floor to ${floor}.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member set your floor to ${floor}.`);
			}
			this.modlog('POKEROUGE SETFLOOR', targetId, `floor ${floor}`);
		},

		resetfloor(target, room, user) {
			this.checkCan('lock');
			const trimmedFloor = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmedFloor) {
				targetId = user.id;
				targetName = user.name;
			} else {
				const parsedId = toID(trimmedFloor);
				if (!parsedId) return this.errorReply(`Invalid username: "${trimmedFloor}".`);
				targetId = parsedId;
				targetName = trimmedFloor;
			}
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokéRogue data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			targetState.floor = 1;
			setState(targetId, targetState);
			this.sendReply(`Reset ${targetName}'s floor to 1.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member reset your floor to 1.`);
			}
			this.modlog('POKEROUGE RESETFLOOR', targetId);
		},

		viewteam(target, room, user) {
			if (!this.runBroadcast()) return;
			this.checkCan('lock');
			const trimmedVT = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmedVT) {
				targetId = user.id;
				targetName = user.name;
			} else {
				const parsedId = toID(trimmedVT);
				if (!parsedId) return this.errorReply(`Invalid username: "${trimmedVT}".`);
				targetId = parsedId;
				targetName = trimmedVT;
			}
			const targetState = getState(targetId);
			const targetNameHtml = Utils.escapeHTML(targetName);
			if (!targetState) return this.sendReplyBox(`${targetNameHtml} has no PokéRogue data.`);
			if (!targetState.team) return this.sendReplyBox(`${targetNameHtml} has no active PokéRogue run.`);
			const targetDisplay = targetState.displayName || targetName;
			this.sendReplyBox(
				`<b>PokéRogue Team for ${Impulse.nameColor(targetDisplay, true, true)}</b><br>` +
				`<b>Floor:</b> ${targetState.floor} &nbsp;|&nbsp; <b>Coins:</b> ${targetState.coins ?? 0}<br>` +
				`<b>Team:</b><br>${renderTeam(targetState.team, true)}`
			);
		},

		addmon(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			let targetId: string;
			let targetName: string;
			let speciesStr: string;
			let levelOverride: number | null = null;
			const isPositiveInt = (s: string) => /^\d+$/.test(s) && parseInt(s) > 0;

			if (parts.length === 1) {
				// /pokerouge addmon <pokemon>  — self, floor-level
				if (!parts[0]) return this.errorReply('Usage: /pokerouge addmon [user], <pokemon> [, <level>]');
				targetId = user.id;
				targetName = user.name;
				speciesStr = parts[0];
			} else if (parts.length === 2) {
				if (/^\d+$/.test(parts[1])) {
					// /pokerouge addmon <pokemon>, <level>  — self, custom level
					const lvl = parseInt(parts[1]);
					if (lvl < 1 || lvl > 100) return this.errorReply('Level must be between 1 and 100.');
					targetId = user.id;
					targetName = user.name;
					speciesStr = parts[0];
					levelOverride = lvl;
				} else {
					// /pokerouge addmon <user>, <pokemon>  — user, floor-level
					if (!parts[0]) {
						targetId = user.id;
						targetName = user.name;
					} else {
						const maybeId = toID(parts[0]);
						if (!maybeId) return this.errorReply(`Invalid username: "${parts[0]}".`);
						targetId = maybeId;
						targetName = parts[0];
					}
					speciesStr = parts[1];
				}
			} else {
				// /pokerouge addmon <user>, <pokemon>, <level>
				if (!parts[0]) {
					targetId = user.id;
					targetName = user.name;
				} else {
					const maybeId = toID(parts[0]);
					if (!maybeId) return this.errorReply(`Invalid username: "${parts[0]}".`);
					targetId = maybeId;
					targetName = parts[0];
				}
				speciesStr = parts[1];
				if (!parts[2] || !isPositiveInt(parts[2]) || parseInt(parts[2]) > 100) {
					return this.errorReply('Level must be between 1 and 100.');
				}
				levelOverride = parseInt(parts[2]);
			}

			const speciesId = toID(speciesStr);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokéRogue data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			if (targetState.team.length >= 6) return this.errorReply(`${targetName}'s team is full (6 Pokémon).`);
			const species = Dex.species.get(speciesId);
			if (!species.exists) return this.errorReply(`Unknown Pokémon: ${speciesStr}`);
			const floorLevel = Math.max(1, targetState.floor - 2);
			const addLevel = levelOverride ?? floorLevel;
			targetState.team.push({ species: species.id, level: addLevel, exp: expForLevel(addLevel) });
			setState(targetId, targetState);
			this.sendReplyBox(
				`${getSprite(species.id, 40)} Added <b>${species.name}</b> (Lv.${addLevel}) to ${Utils.escapeHTML(targetName)}'s team.`
			);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member added ${species.name} (Lv.${addLevel}) to your team.`);
			}
			this.modlog('POKEROUGE ADDMON', targetId, `${species.name} Lv.${addLevel}`);
		},

		givemon: 'addmon',

		removemon(target, room, user) {
			this.checkCan('lock');
			// Support "/pokerouge removemon <user> confirm" to skip the confirmation prompt.
			const parts = target.trim().split(/\s+/);
			const confirmed = parts[parts.length - 1].toLowerCase() === 'confirm';
			const rawTarget = confirmed ? parts.slice(0, -1).join(' ') : parts.join(' ');
			let targetId: string;
			let targetName: string;
			if (!rawTarget) {
				targetId = user.id;
				targetName = user.name;
			} else {
				const maybeId = toID(rawTarget);
				if (!maybeId) return this.errorReply(`Invalid username: "${rawTarget}".`);
				targetId = maybeId;
				targetName = rawTarget;
			}
			if (!getState(targetId)) return this.errorReply(`${Utils.escapeHTML(targetName)} has no PokéRogue data.`);
			if (!confirmed) {
				const s = getState(targetId)!;
				return this.sendReplyBox(
					`<b>Warning:</b> This will permanently delete all PokéRogue data for ` +
					`<b>${Utils.escapeHTML(targetName)}</b> ` +
					`(Floor ${s.floor}, ${s.team?.length ?? 0} Pokémon, ${s.coins ?? 0} coins).<br>` +
					`<button name="send" value="/pokerouge removemon ${Utils.escapeHTML(targetName)} confirm" class="button">` +
					`Confirm delete</button>`
				);
			}
			deleteState(targetId);
			this.sendReply(`Deleted all PokéRogue data for ${Utils.escapeHTML(targetName)}.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member removed your PokéRogue data.`);
			}
			this.modlog('POKEROUGE REMOVEMON', targetId);
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const trimmed = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmed) {
				// No target provided: default to self
				targetId = user.id;
				targetName = user.name;
			} else {
				const maybeId = toID(trimmed);
				if (!maybeId) {
					return this.errorReply(`Invalid username: "${trimmed}".`);
				}
				targetId = maybeId;
				targetName = trimmed;
			}
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokéRogue data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokéRogue run.`);
			// Reset EXP to the baseline for each Pokémon's current level so they're "fresh"
			for (const mon of targetState.team) {
				mon.exp = expForLevel(mon.level);
			}
			setState(targetId, targetState);
			this.sendReply(`Healed ${targetName}'s team (EXP reset to current level baseline).`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member healed your team.`);
			}
			this.modlog('POKEROUGE HEALTEAM', targetId);
		},

		// /pokerouge top — Top 100 leaderboard
		top(target, room, user) {
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				`<b style="font-size:15px">PokéRogue Top 100 Leaderboard</b><br><br>` +
				renderLeaderboard()
			);
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html =
				`<b>PokéRogue — Player Commands:</b><br>` +
				`<code>/pokerouge start</code> (or <code>/roguelike start</code>) — Open the interactive PokéRogue game popup (auto-starts new run if needed).<br>` +
				`<code>/pokerouge battle</code> — Start the next floor battle (also available from the game popup).<br>` +
				`<code>/pokerouge choose [1/2/3]</code> — Choose a starter or add a new Pokémon to your team.<br>` +
				`<code>/pokerouge shop</code> — Open the item shop in the game popup.<br>` +
				`<code>/pokerouge refreshshop</code> — Reroll shop items for 5 coins.<br>` +
				`<code>/pokerouge buy &lt;item&gt;</code> — Purchase an item (costs coins).<br>` +
				`<code>/pokerouge use &lt;item&gt; [slot]</code> — Activate a consumable or equip a held item to slot 1-6.<br>` +
				`<code>/pokerouge status</code> — View your floor, coins, inventory and team with sprites.<br>` +
				`<code>/pokerouge top</code> — View the Top 100 leaderboard by highest floor.<br>` +
				`<code>/pokerouge quit</code> — Abandon your current run.<br>` +
				`<br><b>Tip:</b> Type <code>/pokerouge start</code> to open the interactive game popup — all actions are available there as clickable buttons!<br>` +
				`<br><b>Shop Items:</b> 30+ PS items including Choice Band/Specs/Scarf, Life Orb, Assault Vest, Heavy-Duty Boots, and more.<br>` +
				`<br><b>Tips:</b> Win floors to earn coins. Legendary Pokémon may appear as team additions at Floor 20+!`;
			if (isStaff) {
				html +=
					`<br><br><b>Staff Commands (Global Driver+):</b><br>` +
					`<code>/pokerouge givemoney [user] [amount]</code> — Give coins (default 100). Omit user to give to yourself.<br>` +
					`<code>/pokerouge removecoins [user], &lt;amount&gt;</code> — Remove coins (omit user to target yourself). Short form: <code>/pokerouge removecoins &lt;amount&gt;</code> targets yourself.<br>` +
					`<code>/pokerouge resetcoins [user]</code> — Set coins to 0 (omit user to target yourself).<br>` +
					`<code>/pokerouge setfloor [user], &lt;floor&gt;</code> — Set current floor (omit user to target yourself). Short form: <code>/pokerouge setfloor &lt;floor&gt;</code> targets yourself.<br>` +
					`<code>/pokerouge resetfloor [user]</code> — Reset floor to 1 (omit user to target yourself).<br>` +
					`<code>/pokerouge viewteam [user]</code> — View a user's team with sprites (omit user for your own team).<br>` +
					`<code>/pokerouge addmon [user], &lt;pokemon&gt; [, &lt;level&gt;]</code> (alias: <code>givemon</code>) — Add a Pokémon to a team at an optional level (default: floor-based). Omit user to target yourself.<br>` +
					`<code>/pokerouge removemon [user]</code> — Delete all PokéRogue data for a user (omit user to target yourself).<br>` +
					`<code>/pokerouge healteam [user]</code> — Reset team EXP to current level baseline (omit user for yourself).<br>`;
			}
			this.sendReplyBox(html);
		},

		// /pokerouge popup [shop] — opens or refreshes the game popup; used by inline popup buttons.
		popup(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const view = target.trim() === 'shop' ? 'shop' : 'main';
			let state = getState(user.id);
			// Clear stale battle room reference (same logic as /pokerouge start)
			if (state?.battleRoomId && !Rooms.get(state.battleRoomId as RoomID)) {
				delete state.battleRoomId;
				setState(user.id, state);
			}
			// Repair empty pendingChoice
			if (state) repairEmptyPendingChoice(state, user.id);
			if (!state?.team?.length && !state?.pendingChoice?.length && !state?.battleRoomId) {
				return this.sendReply(`|uhtml|pokerouge-${user.id}|${NO_RUN_POPUP_HTML}`);
			}
			if (view === 'shop' && state?.shopInventory === undefined) {
				state!.shopInventory = rollShopInventory();
				setState(user.id, state!);
			}
			return this.sendReply(`|uhtml|pokerouge-${user.id}|${renderGamePopup(state!, view)}`);
		},

		'': 'help',
	},

	// /roguelike and /rougelike are aliases for /pokerouge
	roguelike(target, room, user) {
		return this.parse(`/pokerouge ${target}`);
	},
	rougelike(target, room, user) {
		return this.parse(`/pokerouge ${target}`);
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
			const levelUpMsgs: string[] = [];

			for (const mon of state.team) {
				// Capture the original species name before any potential evolution
				const oldSpeciesData = Dex.species.get(toID(mon.species));
				const oldName = oldSpeciesData.exists ? oldSpeciesData.name : mon.species;

				const { evolved, oldLevel } = applyExpAndLevelUp(mon, expReward);
				if (mon.level > oldLevel) {
					const newSpeciesData = Dex.species.get(toID(mon.species));
					const newName = newSpeciesData.exists ? newSpeciesData.name : mon.species;
					if (evolved) {
						levelUpMsgs.push(
							`<b>${oldName}</b> evolved into <b>${newName}</b> and is now <b>Lv.${mon.level}</b>!`
						);
					} else {
						levelUpMsgs.push(`<b>${newName}</b> grew to <b>Lv.${mon.level}</b>!`);
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
			state.streaksWon = (state.streaksWon ?? 0) + 1;

			// Reset shop inventory so the shop refreshes after each win
			delete state.shopInventory;

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
			} else {
				setState(match.userId, state);
			}

			// Build the plain-text win popup (User.popup is plain text; HTML tags show literally)
			const levelUpLines = levelUpMsgs.length ?
				levelUpMsgs.map(m => m.replace(/<[^>]+>/g, '')).join('\n') + '\n' :
				'';
			const coinBoostLine = doubleActive ? 'Lucky Charm active — coins doubled!\n' : '';
			const milestoneLine = offerNewPokemon ?
				'Milestone! Open the game page to choose a new Pokemon for your team!\n' :
				'';

			humanUser?.popup(
				`Floor ${prevFloor} cleared! Advancing to Floor ${state.floor}!\n` +
				`Streaks: ${state.streaksWon} | +${coinsEarned} coins${doubleActive ? ' (2x!)' : ''} (Total: ${state.coins})\n` +
				(levelUpLines ? '\n' + levelUpLines : '') +
				(coinBoostLine ? coinBoostLine : '') +
				(milestoneLine ? '\n' + milestoneLine : '') +
				`\nOpening PokéRogue...`
			);
			if (humanUser) {
				sendGamePopup(humanUser, getState(match.userId));
			}
		} else {
			// Loss
			if (state.hasRevive) {
				// Second chance — retry the same floor
				state.hasRevive = false;
				delete state.battleRoomId;
				setState(match.userId, state);
				humanUser?.popup(
					`Your Revive activated! You get to retry Floor ${match.floor}.\n` +
					`Opening PokéRogue...`
				);
				if (humanUser) {
					sendGamePopup(humanUser, getState(match.userId));
				}
			} else {
				// Run over — reset to initial state while preserving leaderboard data
				const finalFloor = match.floor;
				const finalStreaks = state.streaksWon ?? 0;
				state.floor = 1;
				state.team = [];
				state.coins = 0;
				state.streaksWon = 0;
				state.hasRevive = false;
				state.items = {};
				delete state.battleRoomId;
				delete state.pendingChoice;
				delete state.pendingChoiceType;
				delete state.doubleExpFloors;
				delete state.shopInventory;
				setState(match.userId, state);
				humanUser?.popup(
					`Defeated on Floor ${finalFloor}!\n` +
					`Streaks Won: ${finalStreaks} | Best Floor: ${state.highestFloor ?? finalFloor}\n\n` +
					`Your PokéRogue run has ended.\n` +
					`Opening PokéRogue to start a new run...`
				);
				if (humanUser) {
					sendGamePopup(humanUser, getState(match.userId));
				}
			}
		}
	},
};

// ---------------------------------------------------------------------------
// Plugin start hook — register the private "Roguelike Battle" format at
// startup so battles can use it without touching config/formats.ts.
// The format is hidden from all public-facing lists.
// ---------------------------------------------------------------------------

export const start = (): void => {
	// Guard BasicRoom.prototype.destroy against the null Rooms.global crash:
	//   TypeError: Cannot read properties of null (reading 'deregisterChatRoom')
	// This happens when an expire timer fires while Rooms.global is not yet
	// initialised (server startup) or has been reset (hot-reload).
	// The flag makes the patch idempotent across hot-reloads.
	if (!(Rooms.BasicRoom.prototype as any).__pokerougeDestroyPatched) {
		const _origDestroy = Rooms.BasicRoom.prototype.destroy;
		Rooms.BasicRoom.prototype.destroy = function(
			this: InstanceType<typeof Rooms.BasicRoom>
		) {
			if (!Rooms.global) {
				Monitor.warn(`[pokerouge] BasicRoom.destroy: Rooms.global is null for ${this.roomid}, using no-op stubs`);
				// Provide minimal stubs so the rest of destroy() runs fully —
				// clearing timers, logs, Rooms.rooms entry, etc. — and does not
				// leave a zombie room. Only the deregisterChatRoom / delistChatRoom
				// calls are no-ops when Rooms.global is unavailable.
				const roomsGlobalStub = {deregisterChatRoom: () => {}, delistChatRoom: () => {}};
				(Rooms as any).global = roomsGlobalStub as any;
				try {
					_origDestroy.call(this);
				} finally {
					// Restore null only if our stub is still in place.
					// Node.js is single-threaded so no concurrent write can race
					// between the assignment and this check.
					if ((Rooms as any).global === roomsGlobalStub) (Rooms as any).global = null;
				}
				return;
			}
			return _origDestroy.call(this);
		};
		(Rooms.BasicRoom.prototype as any).__pokerougeDestroyPatched = true;
	}

	const { Dex } = require('../../../sim/dex') as typeof import('../../../sim/dex');
	const { Format } = require('../../../sim/dex-formats') as typeof import('../../../sim/dex-formats');

	const FORMAT_ID = 'roguelikebattle' as ID;

	// Skip if already registered (e.g. hot-reload)
	if (Dex.formats.rulesetCache.has(FORMAT_ID)) return;

	// Ensure the base format list is loaded before we append
	Dex.formats.load();

	const formatData = {
		name: 'Roguelike Battle',
		mod: 'gen9',
		effectType: 'Format' as const,
		// Hidden from all public lists
		searchShow: false,
		challengeShow: false,
		tournamentShow: false,
		debug: false,
		battle: { trunc: Math.trunc },
		section: 'Roguelike',
		baseRuleset: ['Max Team Size = 6', 'Max Move Count = 4', 'Max Level = 100', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		ruleset: ['Max Team Size = 6', 'Max Move Count = 4', 'Max Level = 100', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [],
		restricted: [],
		unbanlist: [],
		rated: false,
	};

	const format = new Format(formatData);
	Dex.formats.rulesetCache.set(FORMAT_ID, format);
	// Append to the immutable list cache so Dex.formats.all() includes it
	(Dex.formats.formatsListCache as Format[])?.push(format);
};
