/*
 * PokeRouge - Pokemon Roguelike Battle Tower Plugin
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
 *   /pokerouge removemon [user],[slot]
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
	const name = Dex.species.get(id).name || species;
	const altName = Utils.escapeHTML(name);
	// Fall back to the animated sprite set which covers all forms (Mega, regional, Gen 6+)
	// when the Gen 5 static sprite is not available.
	const fallback = `https://play.pokemonshowdown.com/sprites/ani/${id}.gif`;
	return `<img src="https://play.pokemonshowdown.com/sprites/gen5/${id}.png" onerror="this.onerror=null;this.src='${fallback}'" width="${size}" height="${size}" alt="${altName} sprite" style="image-rendering:pixelated" />`;
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

/**
 * Renders the starter / new-Pokemon selection UI as an HTML table with cards.
 * Supports dark mode via .pr-choice-card CSS class.
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

		const types = speciesData.types ?? [];
		const typeBadge = types.map(t =>
			`<span style="background:#${typeColor(t)};color:#fff;border-radius:3px;padding:1px 5px;font-size:11px">${t}</span>`
		).join(' ');

		const ab = (speciesData.abilities ?? {}) as unknown as Record<string, string>;
		const abilityList = [ab['0'], ab['1'], ab['H']].filter(Boolean);
		const abilitiesStr = abilityList.join(' / ') || '—';

		const bs = speciesData.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		const statsStr = `HP <b>${bs.hp}</b> · Atk <b>${bs.atk}</b> · Def <b>${bs.def}</b> · SpA <b>${bs.spa}</b> · SpD <b>${bs.spd}</b> · Spe <b>${bs.spe}</b> <small>(BST ${bst})</small>`;

		const moveIds = getLevelUpMoves(toID(s), 1);
		const movesStr = moveIds.map(m => Dex.moves.get(m).name || m).join(', ') || 'Tackle';

		const teraType = types[0] ?? 'Normal';
		const teraBadge = `<span style="background:#${typeColor(teraType)};color:#fff;border-radius:3px;padding:1px 5px;font-size:11px">Tera: ${teraType}</span>`;

		const legendaryBadge = isLegendary ?
			`<br><span class="pr-choice-legendary">Legendary</span>` : '';

		return `<td class="pr-choice-card${isLegendary ? ' pr-choice-card--legendary' : ''}">` +
			`${getSprite(s)}<br>` +
			`<b style="font-size:14px">${name}</b>${legendaryBadge}<br>` +
			`<span style="font-size:12px">Lv. 1 &nbsp;|&nbsp; Item: None</span><br>` +
			`${typeBadge} ${teraBadge}<br>` +
			`<div class="pr-choice-stats">` +
			`<b>Abilities:</b> ${abilitiesStr}<br>` +
			`<b>Moves:</b> ${movesStr}<br>` +
			`<b>Stats:</b> ${statsStr}` +
			`</div>` +
			`<button name="send" value="${cmdPrefix} ${i + 1}" class="button" style="margin-top:6px">` +
			`${label}</button>` +
			`</td>`;
	}).join('<td style="width:10px"></td>');
	return `<table style="border-collapse:separate;border-spacing:0"><tr>${cards}</tr></table>`;
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

/** Renders the item shop as an HTML card grid with action buttons. */
function renderShop(coins: number, inventory?: string[]): string {
	const itemIds = inventory ?? Object.keys(SHOP_ITEMS);
	const cards = itemIds.map(id => {
		const item = SHOP_ITEMS[id];
		if (!item) return '';
		const canAfford = coins >= item.cost;
		const buyBtn = canAfford ?
			`<button name="send" value="/pokerouge buy ${item.id}" class="button pr-shop-buy">Buy (${item.cost} coins)</button>` :
			`<button class="button pr-shop-buy" disabled>Buy (${item.cost} coins)</button>`;
		return `<div class="pr-shop-card">` +
			`<b class="pr-shop-item-name">${item.name}</b>` +
			`<span class="pr-shop-item-desc">${item.description}</span>` +
			(item.heldItem ? `<small class="pr-shop-held">(held item, 1 battle)</small>` : '') +
			buyBtn +
			`</div>`;
	}).filter(Boolean);

	const shopGrid = `<div class="pr-shop-grid">${cards.join('')}</div>`;

	const actionBar =
		`<div class="pr-shop-actions">` +
		`<button name="send" value="/pokerouge refreshshop" class="button">Refresh Shop (5 coins)</button>` +
		`<button name="send" value="/pokerouge start" class="button">Back to Dashboard</button>` +
		`<button name="send" value="/pokerouge battle" class="button pr-shop-next">Start Next Battle!</button>` +
		`</div>`;

	return actionBar + shopGrid;
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
// Shared page CSS (includes dark mode support)
// ---------------------------------------------------------------------------

const PAGE_CSS = `<style>
.pr-shop-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.pr-shop-card{display:flex;flex-direction:column;align-items:center;padding:10px 12px;border:1px solid #ccc;border-radius:8px;background:#fafafa;min-width:130px;flex:1 1 130px;max-width:200px;box-sizing:border-box;text-align:center;gap:4px}
.pr-shop-item-name{font-size:13px;font-weight:bold}
.pr-shop-item-desc{font-size:11px;color:#555;flex:1}
.pr-shop-held{font-size:10px;color:#888}
.pr-shop-buy{margin-top:4px;width:100%}
.pr-shop-actions{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;align-items:center}
.pr-shop-next{margin-left:auto}
.pr-stat-bar{display:flex;flex-wrap:wrap;gap:6px 16px;margin:8px 0}
.pr-stat-bar span{white-space:nowrap}
.pr-action-bar{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.pr-choice-card{text-align:center;padding:10px 14px;border:2px solid #aaa;border-radius:10px;background:#fafafa;min-width:140px;vertical-align:top}
.pr-choice-card--legendary{border-color:#e67e22;background:#fffaf0}
.pr-choice-legendary{color:#e67e22;font-size:11px;font-weight:bold}
.pr-choice-stats{font-size:11px;color:#555;margin:4px 0;text-align:left}
@media(max-width:500px){.pr-shop-card{min-width:110px;max-width:none;flex:1 1 45%}.pr-shop-next{margin-left:0}}
.dark .pr-shop-card{background:#2a2a2a;border-color:#444}
.dark .pr-shop-item-desc{color:#aaa}
.dark .pr-shop-held{color:#888}
.dark .pr-stat-bar{color:#ddd}
.dark .pr-choice-card{background:#2a2a2a;border-color:#555;color:#ddd}
.dark .pr-choice-card--legendary{background:#2d2414;border-color:#c0701a}
.dark .pr-choice-legendary{color:#f0a050}
.dark .pr-choice-stats{color:#aaa}
</style>`;

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
			const state = getState(user.id);
			if (!state || (!state.team?.length && !state.pendingChoice && !state.battleRoomId)) {
				setState(user.id, buildFreshState(state));
			}
			return this.parse('/join view-pokerouge');
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

			// Redirect to the game page to display the starter-selection UI
			return this.parse('/join view-pokerouge');
		},

		// /pokerouge choose <1|2|3>
		choose(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const n = parseInt(target.trim());
			if (!n || n < 1 || n > 3) {
				return this.errorReply('Usage: /pokerouge choose [1, 2, or 3]');
			}

			const state = getState(user.id);
			if (!state?.pendingChoice) {
				return this.errorReply('You have no pending Pokémon choice. Use /pokerouge start first.');
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

			// Persist state BEFORE attempting battle creation so the team update and choice
			// deletion are not lost if battle creation fails (e.g. server lockdown).
			setState(user.id, state);

			// Start the battle — Rooms.createBattle will navigate the user to the battle room
			const ok = startBattle(user, state);
			if (!ok) {
				// startBattle already sent a popup; redirect to page so the user can retry
				return this.parse('/join view-pokerouge');
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

			if (state.pendingChoice) {
				return this.sendReplyBox(
					`You have a pending Pokémon choice! ` +
					`<a href="/view-pokerouge">Open the PokéRogue page</a> to choose.`
				);
			}

			if (!state.team?.length) {
				return this.errorReply('No team to battle with. Use /pokerouge start to begin a new run!');
			}

			// Start the battle — Rooms.createBattle navigates the user to the battle room
			const ok = startBattle(user, state);
			if (!ok) {
				// startBattle already sent a popup with the error; open the page for retry
				return this.parse('/join view-pokerouge');
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
			if (state.pendingChoice && !state.team?.length) {
				return this.sendReplyBox(
					`You have a pending Pokémon choice! ` +
					`<a href="/view-pokerouge">Open the PokéRogue page</a> to choose.`
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
				(state.pendingChoice ? `<br><br><b>You have a pending Pokémon choice!</b> ` +
					`<a href="/view-pokerouge">Open the PokéRogue page</a> to choose.` : '') +
				`<br><br><b>Team:</b><br>${renderTeam(state.team, true)}` +
				(itemList !== 'None' ? `<br><br><b>Inventory:</b> ${itemList}` : '')
			);
		},

		// /pokerouge shop — opens the game page at the shop view
		shop(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) return this.errorReply('You have no active PokéRogue run. Use /pokerouge start first.');
			// Ensure a shop inventory exists for this player
			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}
			return this.parse('/join view-pokerouge-shop');
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
			return this.parse('/join view-pokerouge-shop');
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
				return this.errorReply('You have no active PokeRouge run. Use /pokerouge start first.');
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

			// Return to the shop page so the user can continue shopping
			return this.parse('/join view-pokerouge-shop');
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
				return this.errorReply('You have no active PokeRouge run. Use /pokerouge start first.');
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
			return this.parse('/join view-pokerouge');
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
				return this.errorReply(`${targetName} has no active PokeRouge run.`);
			}
			targetState.coins = (targetState.coins ?? 0) + amount;
			setState(targetId, targetState);
			this.sendReply(`Gave ${amount} coins to ${targetName}. They now have ${targetState.coins} coins.`);
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
				if (!rawName || !parsedId) {
					// Empty or invalid username segment: default target to self
					targetId = user.id;
					targetName = user.name;
				} else {
					targetId = parsedId;
					targetName = rawName;
				}
				amount = parseInt(parts[1]);
			} else {
				return this.errorReply('Usage: /pokerouge removecoins [user], <amount>');
			}
			if (isNaN(amount) || amount <= 0) return this.errorReply('Amount must be a positive number.');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			targetState.coins = Math.max(0, (targetState.coins ?? 0) - amount);
			setState(targetId, targetState);
			this.sendReply(`Removed ${amount} coins from ${targetName}. They now have ${targetState.coins} coins.`);
			this.modlog('POKEROUGE REMOVECOINS', targetId, `${amount} coins`);
		},

		resetcoins(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim()) || user.id;
			const targetName = target.trim() || user.name;
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			targetState.coins = 0;
			setState(targetId, targetState);
			this.sendReply(`Reset ${targetName}'s coins to 0.`);
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
				floor = parseInt(parts[1]);
			} else {
				return this.errorReply('Usage: /pokerouge setfloor [user], <floor>');
			}
			if (isNaN(floor) || floor < 1) return this.errorReply('Floor must be a positive number.');
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			targetState.floor = floor;
			setState(targetId, targetState);
			this.sendReply(`Set ${targetName}'s floor to ${floor}.`);
			this.modlog('POKEROUGE SETFLOOR', targetId, `floor ${floor}`);
		},

		resetfloor(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim()) || user.id;
			const targetName = target.trim() || user.name;
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			targetState.floor = 1;
			setState(targetId, targetState);
			this.sendReply(`Reset ${targetName}'s floor to 1.`);
			this.modlog('POKEROUGE RESETFLOOR', targetId);
		},

		viewteam(target, room, user) {
			if (!this.runBroadcast()) return;
			this.checkCan('lock');
			const targetId = toID(target.trim()) || user.id;
			const targetName = target.trim() || user.name;
			const targetState = getState(targetId);
			if (!targetState) return this.sendReplyBox(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.sendReplyBox(`${targetName} has no active PokeRouge run.`);
			const targetDisplay = targetState.displayName || targetName;
			this.sendReplyBox(
				`<b>PokeRouge Team for ${Impulse.nameColor(targetDisplay, true, true)}</b><br>` +
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
				if (isPositiveInt(parts[1])) {
					// /pokerouge addmon <pokemon>, <level>  — self, custom level
					targetId = user.id;
					targetName = user.name;
					speciesStr = parts[0];
					levelOverride = parseInt(parts[1]);
				} else {
					// /pokerouge addmon <user>, <pokemon>  — user, floor-level
					if (!parts[0]) {
						targetId = user.id;
						targetName = user.name;
					} else {
						targetId = toID(parts[0]);
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
					targetId = toID(parts[0]);
					targetName = parts[0];
				}
				speciesStr = parts[1];
				if (!parts[2] || !isPositiveInt(parts[2])) {
					return this.errorReply('Level must be a positive integer from 1 to 100.');
				}
				levelOverride = parseInt(parts[2]);
			}

			const speciesId = toID(speciesStr);
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			if (targetState.team.length >= 6) return this.errorReply(`${targetName}'s team is full (6 Pokémon).`);
			const species = Dex.species.get(speciesId);
			if (!species.exists) return this.errorReply(`Unknown Pokémon: ${speciesStr}`);
			const floorLevel = Math.max(1, targetState.floor - 2);
			const addLevel = levelOverride !== null ? Math.min(100, Math.max(1, levelOverride)) : floorLevel;
			targetState.team.push({ species: species.id, level: addLevel, exp: expForLevel(addLevel) });
			setState(targetId, targetState);
			this.sendReplyBox(
				`${getSprite(species.id, 40)} Added <b>${species.name}</b> (Lv.${addLevel}) to ${targetName}'s team.`
			);
			this.modlog('POKEROUGE ADDMON', targetId, `${species.name} Lv.${addLevel}`);
		},

		givemon: 'addmon',

		removemon(target, room, user) {
			this.checkCan('lock');
			const parts = target.split(',').map(p => p.trim());
			let targetId: string;
			let targetName: string;
			let slotStr: string;
			const isNumber = (s: string) => /^\d+$/.test(s);
			if (parts.length === 1 && isNumber(parts[0])) {
				// Single numeric arg: treat as slot and default target to self
				targetId = user.id;
				targetName = user.name;
				slotStr = parts[0];
			} else if (parts.length >= 2) {
				const maybeId = toID(parts[0]);
				if (maybeId) {
					targetId = maybeId;
					targetName = parts[0];
				} else {
					// Empty or invalid username segment: default to self
					targetId = user.id;
					targetName = user.name;
				}
				slotStr = parts[1];
			} else {
				return this.errorReply('Usage: /pokerouge removemon [user], <slot>');
			}
			const slot = parseInt(slotStr) - 1;
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			if (slot < 0 || slot >= targetState.team.length) {
				return this.errorReply(`Invalid slot. ${targetName} has ${targetState.team.length} Pokémon (1-${targetState.team.length}).`);
			}
			if (targetState.team.length === 1) return this.errorReply(`Cannot remove the last Pokémon from a team.`);
			const removed = targetState.team.splice(slot, 1)[0];
			const removedName = Dex.species.get(toID(removed.species)).name || removed.species;
			setState(targetId, targetState);
			this.sendReply(`Removed ${removedName} (slot ${slot + 1}) from ${targetName}'s team.`);
			this.modlog('POKEROUGE REMOVEMON', targetId, removedName);
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const targetId = toID(target.trim()) || user.id;
			const targetName = target.trim() || user.name;
			const targetState = getState(targetId);
			if (!targetState) return this.errorReply(`${targetName} has no PokeRouge data.`);
			if (!targetState.team) return this.errorReply(`${targetName} has no active PokeRouge run.`);
			// Reset EXP to the baseline for each Pokémon's current level so they're "fresh"
			for (const mon of targetState.team) {
				mon.exp = expForLevel(mon.level);
			}
			setState(targetId, targetState);
			this.sendReply(`Healed ${targetName}'s team (EXP reset to current level baseline).`);
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
				`<code>/pokerouge start</code> (or <code>/roguelike start</code>) — Open the interactive PokéRogue game page (auto-starts new run if needed).<br>` +
				`<code>/pokerouge battle</code> — Start the next floor battle (also available from the game page).<br>` +
				`<code>/pokerouge choose [1/2/3]</code> — Choose a starter or add a new Pokémon to your team.<br>` +
				`<code>/pokerouge shop</code> — Open the item shop on the game page.<br>` +
				`<code>/pokerouge refreshshop</code> — Reroll shop items for 5 coins.<br>` +
				`<code>/pokerouge buy &lt;item&gt;</code> — Purchase an item (costs coins).<br>` +
				`<code>/pokerouge use &lt;item&gt; [slot]</code> — Activate a consumable or equip a held item to slot 1-6.<br>` +
				`<code>/pokerouge status</code> — View your floor, coins, inventory and team with sprites.<br>` +
				`<code>/pokerouge top</code> — View the Top 100 leaderboard by highest floor.<br>` +
				`<code>/pokerouge quit</code> — Abandon your current run.<br>` +
				`<br><b>Tip:</b> Type <code>/pokerouge start</code> to open the interactive game page — all actions are available there as clickable buttons!<br>` +
				`<br><b>Shop Items:</b> 30+ PS items including Choice Band/Specs/Scarf, Life Orb, Assault Vest, Heavy-Duty Boots, and more.<br>` +
				`<br><b>Tips:</b> Win floors to earn coins. Legendary Pokémon may appear as team additions at Floor 20+!`;
			if (isStaff) {
				html +=
					`<br><br><b>Staff Commands (Global Driver+):</b><br>` +
					`<code>/pokerouge givemoney [user] [amount]</code> — Give coins (default 100). Omit user to give to yourself.<br>` +
					`<code>/pokerouge removecoins [user], &lt;amount&gt;</code> — Remove coins (omit user to target yourself).<br>` +
					`<code>/pokerouge resetcoins [user]</code> — Set coins to 0 (omit user to target yourself).<br>` +
					`<code>/pokerouge setfloor [user], &lt;floor&gt;</code> — Set current floor (omit user to target yourself).<br>` +
					`<code>/pokerouge resetfloor [user]</code> — Reset floor to 1 (omit user to target yourself).<br>` +
					`<code>/pokerouge viewteam [user]</code> — View a user's team with sprites (omit user for your own team).<br>` +
					`<code>/pokerouge addmon [user], &lt;pokemon&gt; [, &lt;level&gt;]</code> (alias: <code>givemon</code>) — Add a Pokémon to a team at an optional level (default: floor-based). Omit user to target yourself.<br>` +
					`<code>/pokerouge removemon [user], &lt;slot&gt;</code> — Remove a Pokémon by slot (omit user to target yourself).<br>` +
					`<code>/pokerouge healteam [user]</code> — Reset team EXP to current level baseline (omit user for yourself).<br>`;
			}
			this.sendReplyBox(html);
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
				`\nUse /pokerouge start to continue.`
			);
		} else {
			// Loss
			if (state.hasRevive) {
				// Second chance — retry the same floor
				state.hasRevive = false;
				delete state.battleRoomId;
				setState(match.userId, state);
				humanUser?.popup(
					`Your Revive activated! You get to retry Floor ${match.floor}.\n` +
					`Use /pokerouge start to try again.`
				);
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
				delete state.doubleExpFloors;
				delete state.shopInventory;
				setState(match.userId, state);
				humanUser?.popup(
					`Defeated on Floor ${finalFloor}!\n` +
					`Streaks Won: ${finalStreaks} | Best Floor: ${state.highestFloor ?? finalFloor}\n\n` +
					`Your PokéRogue run has ended.\n` +
					`Use /pokerouge start to begin a new run with a fresh starter.`
				);
			}
		}
	},
};

// ---------------------------------------------------------------------------
// Interactive page — view-pokerouge (main) and view-pokerouge-shop (shop)
// ---------------------------------------------------------------------------

export const pages: Chat.PageTable = {
	pokerouge(args, user) {
		this.title = 'PokéRogue';
		const sub = args[0] || '';

		// Guests have throwaway IDs — their state cannot be resumed after reconnect
		// and would accumulate indefinitely in savedData.
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;

		let state = getState(user.id);

		// Auto-start: if the player has no state (new player) or is in a post-loss
		// state (no team, no pending choice, no active battle), automatically roll
		// starter options and show the selection screen instead of a blank page.
		// This mirrors the behaviour of /pokerouge start and ensures the page always
		// shows meaningful content when navigated to directly.
		if (!state || (!state.team?.length && !state.pendingChoice && !state.battleRoomId)) {
			const fresh = buildFreshState(state);
			setState(user.id, fresh);
			state = fresh;
			// Falls through to the pendingChoice rendering block below.
		}

		let buf = `<div class="pad">`;
		buf += PAGE_CSS;
		buf += `<h2>PokéRogue</h2>`;

		// Check for stale battle room reference
		if (state.battleRoomId) {
			const battleRoom = Rooms.get(state.battleRoomId as RoomID);
			if (battleRoom) {
				buf += `<p><b>Floor:</b> ${state.floor} &nbsp;|&nbsp; <b>Coins:</b> ${state.coins ?? 0}</p>`;
				buf += `<p>You have an active battle in progress!</p>`;
				buf += `<p>` +
					`<a href="/${state.battleRoomId}" class="button" style="font-size:14px;padding:6px 16px">Go to Battle</a>` +
					` &nbsp; ` +
					`<button name="send" value="/pokerouge start" class="button">Refresh</button>` +
					`</p>`;
				buf += `</div>`;
				return buf;
			}
			// Battle room gone — clear stale reference
			delete state.battleRoomId;
			setState(user.id, state);
		}

		// Pending Pokémon choice (starter or milestone add)
		if (state.pendingChoice) {
			const isAdd = state.pendingChoiceType === 'add';
			if (state.team?.length) {
				buf += `<p><b>Floor:</b> ${state.floor} &nbsp;|&nbsp; <b>Coins:</b> ${state.coins ?? 0}</p>`;
			}
			buf += `<p><b>${isAdd ? 'Milestone! Choose a Pokemon to add to your team:' : 'Choose your starter Pokemon (all at Lv. 1):'}</b></p>`;
			buf += renderPokemonChoice(state.pendingChoice, isAdd ? 'Add to Team' : 'Choose Starter');
			buf += `</div>`;
			return buf;
		}

		if (!state.team?.length) {
			// Fallback: state exists with no team and no pending choice (unexpected path).
			buf += `<p>No active team. Start a new run!</p>`;
			buf += `<p><button name="send" value="/pokerouge newgame" class="button" style="font-size:14px;padding:6px 18px">Start Fresh Run</button></p>`;
			buf += `</div>`;
			return buf;
		}

		// Active run dashboard
		const coins = state.coins ?? 0;
		const items = state.items ?? {};
		const itemList = Object.entries(items)
			.filter(([, qty]) => qty > 0)
			.map(([id, qty]) => `${SHOP_ITEMS[id]?.name ?? id} x${qty}`)
			.join(', ') || 'None';
		const activeEffects: string[] = [];
		if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
		if (state.hasRevive) activeEffects.push('Revive (active)');

		// Status bar
		buf += `<div class="pr-stat-bar">`;
		buf += `<span><b>Floor:</b> ${state.floor}</span>`;
		buf += `<span><b>Coins:</b> ${coins}</span>`;
		buf += `<span><b>Streaks:</b> ${state.streaksWon ?? 0}</span>`;
		if (state.highestFloor) buf += `<span><b>Best Floor:</b> ${state.highestFloor}</span>`;
		buf += `</div>`;

		if (activeEffects.length) {
			buf += `<p><b>Active Effects:</b> ${activeEffects.join(', ')}</p>`;
		}

		// Team with sprites
		buf += `<h3 style="margin-bottom:6px">Your Team</h3>`;
		buf += `<div style="margin-bottom:12px">${renderTeam(state.team, true)}</div>`;

		// Inventory
		buf += `<p><b>Inventory:</b> ${itemList}</p>`;

		// Action buttons
		buf += `<div class="pr-action-bar">`;
		buf += `<button name="send" value="/pokerouge battle" class="button" style="font-size:14px;padding:6px 16px">Start Floor ${state.floor} Battle</button>`;
		buf += `<button name="send" value="/pokerouge shop" class="button">Open Shop</button>`;
		buf += `<button name="send" value="/pokerouge top" class="button">Leaderboard</button>`;
		buf += `<button name="send" value="/pokerouge quit" class="button">Quit Run</button>`;
		buf += `</div>`;

		// Shop sub-view (view-pokerouge-shop)
		if (sub === 'shop') {
			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}
			buf += `<hr />`;
			buf += `<h3 style="margin-bottom:4px">Item Shop &nbsp; <small style="font-weight:normal;font-size:13px">${coins} coins</small></h3>`;
			buf += `<p><small>Items are permanent unless marked "(held item, 1 battle)".</small></p>`;
			buf += renderShop(coins, state.shopInventory);
		}

		buf += `</div>`;
		return buf;
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
