// pokerogue plugin — main file: html rendering, commands, page handlers, battle hook.
// see pokerogue-core.ts for types/data, pokerogue-battle.ts for bot/ai logic.

import { Utils } from '../../../lib';
import { Table } from '../../utils';
import {
	SHOP_ITEMS, LEGENDARY_TAGS,
	type PokemonEntry, type PokeRogueState,
	getState, setState, deleteState, savedData,
	pickStarterOptions, pickNewPokemonOptions,
	expForLevel, floorExpReward, floorCoinReward,
	applyExpAndLevelUp, getLevelUpEvo,
	getLevelUpMoves, rollShopInventory,
} from './pokerogue-core';
import {
	activeMatches,
	startBattle, destroyBotUser,
} from './pokerogue-battle';

// page auto-refresh interval while a battle is active
const PAGE_REFRESH_SECONDS = 20;

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	// use dex sprites for gen 6+ or formes, gen5 for older base formes
	const useDex = sp.exists && (sp.gen > 5 || !!sp.forme);
	const src = useDex ?
		`https://play.pokemonshowdown.com/sprites/dex/${id}.png` :
		`https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
	return `<img src="${src}" width="${size}" height="${size}" alt="${altName} sprite" style="image-rendering:pixelated" />`;
}

// returns the pokeball image src and alt text appropriate for a species's rarity tier
function getPokeballInfo(speciesId: string): { src: string, alt: string } {
	const sp = Dex.species.get(toID(speciesId));
	// Legendary / Mythical / Ultra Beast / Paradox → Master Ball
	if (sp.tags?.some(tag => LEGENDARY_TAGS.has(tag))) {
		return { src: 'https://play.pokemonshowdown.com/sprites/itemicons/masterball.png', alt: 'Master Ball' };
	}
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		// Pseudo-legendary tier (BST ≥ 580) → Ultra Ball
		if (bst >= 580) return { src: 'https://play.pokemonshowdown.com/sprites/itemicons/ultraball.png', alt: 'Ultra Ball' };
		// Mid-tier (BST ≥ 480) → Great Ball
		if (bst >= 480) return { src: 'https://play.pokemonshowdown.com/sprites/itemicons/greatball.png', alt: 'Great Ball' };
	}
	// Common / starter → normal Poké Ball
	return { src: 'https://play.pokemonshowdown.com/sprites/itemicons/pokeball.png', alt: 'Poké Ball' };
}

// renders a pokemon sprite with a small pokeball overlay at bottom-right (like official games)
function getSpriteWithBall(species: string, size = 80): string {
	const ball = getPokeballInfo(species);
	const spriteHtml = getSprite(species, size);
	return `<div class="pr-sprite-wrap" style="width:${size}px;height:${size}px">` +
		spriteHtml +
		`<img src="${ball.src}" alt="${Utils.escapeHTML(ball.alt)}" class="pr-pokeball-overlay" />` +
		`</div>`;
}

// returns the item sprite img html for a shop item
function getItemSprite(itemId: string): string {
	const id = toID(itemId);
	return `<img src="https://play.pokemonshowdown.com/sprites/itemicons/${id}.png" ` +
		`width="24" height="24" alt="${Utils.escapeHTML(itemId)} icon" style="image-rendering:pixelated" />`;
}

// exp progress bar for a team member
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

// hex colour for a pokemon type
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

// type badge html (large = choice card size, default = team card size)
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
		const heldLabel = mon.heldItem ? ` [${Utils.escapeHTML(mon.heldItem)}]` : '';
		const sprite = withSprites ? getSprite(mon.species, 40) + ' ' : '';
		return `${sprite}<b>${idx + 1}. ${Utils.escapeHTML(name)}${heldLabel}</b> Lv.${mon.level}${mon.level < 100 ? ` (${expNeeded} EXP to next level)` : ' (MAX)'}`;
	}).join('<br>');
}

// top-100 leaderboard html
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
				return `${spr}<small>${Utils.escapeHTML(sname)}</small>`;
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

// builds a fresh state for a new run, preserving leaderboard fields from an existing state
function buildFreshState(existing: PokeRogueState | null): PokeRogueState {
	const options = pickStarterOptions();
	const fresh: PokeRogueState = {
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

// renders the full game page html. view = 'main' | 'shop'
function renderGamePopup(state: PokeRogueState, view: 'main' | 'shop' = 'main'): string {
	// auto-refresh while battle is active or a notification is pending
	let buf = (state.battleRoomId || state.notification) ?
		`<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	buf += `<div class="pr-popup-header">`;
	buf += `<h2>PokéRogue</h2>`;
	if (state.team?.length) {
		buf += `<div style="display:flex;gap:6px;align-items:center">` +
			`<span class="pr-floor-badge">Floor ${state.floor}</span>` +
			`<span class="pr-coin-badge">${state.coins ?? 0} Coins</span>` +
			`</div>`;
	}
	buf += `</div>`;

	// notification banner
	if (state.notification) {
		buf += `<div class="pr-notification">${state.notification}` +
			`<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button>` +
			`</div>`;
	}

	// active battle in progress
	if (state.battleRoomId) {
		buf += `<div style="text-align:center;padding:14px 0">` +
			`<p style="color:#f5c518;font-weight:bold;font-size:14px">Battle in progress!</p>` +
			`<div class="pr-popup-actions" style="justify-content:center">` +
			`<a href="/${state.battleRoomId}" class="button" style="color:#fff;text-decoration:none">Go to Battle</a>` +
			`</div></div>`;
		buf += `</div>`;
		return buf;
	}

	// ── Pending Pokémon choice ───────────────────────────────────────────────
	if (state.pendingChoice?.length) {
		const isAdd = state.pendingChoiceType === 'add';
		const choiceTitle = isAdd ?
			'Milestone! Choose a Pokémon to add to your team:' :
			'Choose a starter!';
		buf += `<h2 class="pr-choice-heading">${choiceTitle}</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table">`;
		buf += `<thead><tr>` +
			`<th>Status</th><th>Info</th><th>Moves</th><th></th>` +
			`</tr></thead>`;
		buf += `<tbody>`;
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
			const moveNames = moveIds.map(m => Dex.moves.get(m).name || m);
			const addLevel = isAdd ? Math.max(1, state.floor - 2) : 1;
			buf += `<tr class="pr-choice-row${isLegendary ? ' legendary' : ''}">`;
			// Status column
			buf += `<td class="pr-ct-status">`;
			buf += getSpriteWithBall(s, 60);
			buf += `<div class="pr-ct-name"><b>${Utils.escapeHTML(name)}</b>`;
			if (isLegendary) {
				buf += ` <span class="pr-legendary-badge">LEGENDARY</span>`;
			}
			buf += `</div>`;
			buf += `<div style="margin:3px 0">${typeBadge}</div>`;
			buf += `<div class="pr-ct-meta">Lv. ${addLevel} &nbsp;·&nbsp; ` +
				`BST <b style="color:#c4a8ff">${bst}</b></div>`;
			buf += `</td>`;
			// Info column
			buf += `<td class="pr-ct-info">`;
			buf += `<div class="pr-ct-stats">` +
				`<span><b>HP:</b> ${bs.hp}</span>` +
				`<span><b>Atk:</b> ${bs.atk}</span>` +
				`<span><b>Def:</b> ${bs.def}</span>` +
				`<span><b>SpA:</b> ${bs.spa}</span>` +
				`<span><b>SpD:</b> ${bs.spd}</span>` +
				`<span><b>Spe:</b> ${bs.spe}</span>` +
				`</div>`;
			buf += `<div class="pr-ct-ability"><b>Ability:</b> ${Utils.escapeHTML(abilityList)}</div>`;
			buf += `</td>`;
			// Moves column
			buf += `<td class="pr-ct-moves">`;
			buf += moveNames.map(m => Utils.escapeHTML(m)).join('<br>') || 'Tackle';
			buf += `</td>`;
			// Action column
			buf += `<td class="pr-ct-action">`;
			buf += `<button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">` +
				`${isAdd ? 'Add to Team' : 'Pick starter'}</button>`;
			buf += `</td>`;
			buf += `</tr>`;
		}
		buf += `</tbody></table></div>`;
		buf += `</div>`;
		return buf;
	}

	// game over screen
	if (state.gameOver) {
		buf += `<div class="pr-gameover">`;
		buf += `<div class="pr-gameover-title">Too bad!</div>`;
		buf += `<div class="pr-gameover-stats">`;
		buf += `<span><b>Floor Reached:</b> ${state.lastRunFloor ?? 1}</span>`;
		buf += `<span><b>Streaks Won:</b> ${state.lastRunStreaks ?? 0}</span>`;
		if (state.highestFloor) {
			buf += `<span><b>Best Floor:</b> ${state.highestFloor}</span>`;
		}
		buf += `</div>`;
		buf += `<div class="pr-popup-actions" style="justify-content:center;margin-top:20px">`;
		buf += `<button name="send" value="/pokerogue newgame" class="button pr-newrun-btn">` +
			`Start a new run</button>`;
		buf += `</div>`;
		buf += `</div>`;
		buf += `</div>`;
		return buf;
	}

	// no team — show new run button
	if (!state.team?.length) {
		buf += `<div style="text-align:center;padding:16px 0">` +
			`<p style="color:#8ab4f8;font-size:13px;margin:0 0 12px">No active run. Start a new adventure!</p>` +
			`<button name="send" value="/pokerogue newgame" class="button">New Run</button>` +
			`</div>`;
		buf += `</div>`;
		return buf;
	}

	// shop sub-view
	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		buf += `<div class="pr-shop-header">`;
		buf += `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">`;
		buf += `<h3 style="margin:0;font-size:15px;color:#c4a8ff;letter-spacing:0.5px">Item Shop</h3>`;
		buf += `<span class="pr-coin-badge" style="font-size:13px;padding:4px 14px">${shopCoins} Coins</span>`;
		buf += `</div>`;
		buf += `<div class="pr-shop-toolbar">`;
		buf += `<a href="/view-pokerogue" class="button pr-shop-back-btn">&#8592; Back</a>`;
		buf += `<button name="send" value="/pokerogue refreshshop" class="button pr-shop-reroll-btn">`;
		buf += `Reroll Shop <span style="font-size:10px;opacity:0.75">(5 coins)</span></button>`;
		buf += `<button name="send" value="/pokerogue battle" class="button pr-shop-battle-btn">`;
		buf += `Start Battle</button>`;
		buf += `</div></div>`;

		buf += `<div class="pr-shop-grid">`;
		for (const itemId of (state.shopInventory ?? [])) {
			const item = SHOP_ITEMS[itemId];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			const isHeld = !!item.heldItem;
			const categoryLabel = isHeld ? 'Held Item' : 'Consumable';
			const categoryClass = isHeld ? 'pr-item-tag-held' : 'pr-item-tag-consumable';
			buf += `<div class="pr-shop-card${canAfford ? '' : ' pr-shop-card-disabled'}">`;
			// icon + name row
			buf += `<div class="pr-shop-card-top">`;
			buf += `<div class="pr-shop-item-icon">${getItemSprite(item.heldItem ?? item.id)}</div>`;
			buf += `<div style="flex:1;min-width:0">`;
			buf += `<div class="pr-shop-item-name">${Utils.escapeHTML(item.name)}</div>`;
			buf += `<span class="${categoryClass}">${categoryLabel}</span>`;
			buf += `</div>`;
			buf += `</div>`;
			// description
			buf += `<div class="pr-shop-item-desc">${Utils.escapeHTML(item.description)}</div>`;
			// buy button
			if (canAfford) {
				buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button pr-shop-buy-btn">`;
				buf += `Buy &mdash; <b>${item.cost}</b> coins</button>`;
			} else {
				buf += `<button class="button pr-shop-buy-btn pr-shop-buy-disabled" disabled>`;
				buf += `${item.cost} coins <span style="font-size:9px">(need more)</span></button>`;
			}
			buf += `</div>`;
		}
		buf += `</div></div>`;
		return buf;
	}

	// ── Main dashboard ───────────────────────────────────────────────────────
	// main dashboard
	const coins = state.coins ?? 0;
	const items = state.items ?? {};
	const activeEffects: string[] = [];
	if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
	if (state.hasRevive) activeEffects.push('Revive (active)');

	buf += `<div class="pr-popup-stats">`;
	buf += `<span>Floor <b>${state.floor}</b></span>`;
	buf += `<span>Coins <b>${coins}</b></span>`;
	buf += `<span>Streaks <b>${state.streaksWon ?? 0}</b></span>`;
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
		// show evolution available indicator
		const evo = getLevelUpEvo(mon.species);
		const evoHint = evo && mon.level < evo.evoLevel ?
			`<span style="font-size:9px;color:#a0e0a0">Evo @ Lv.${evo.evoLevel}</span>` : '';
		buf += `<div class="pr-popup-mon">`;
		buf += getSpriteWithBall(mon.species, 52);
		buf += `<div style="flex:1;min-width:0">`;
		buf += `<b style="color:#e8e0ff;font-size:12px">${Utils.escapeHTML(name)}</b><br>`;
		buf += `<span style="font-size:10px">${typeBadge}</span>`;
		if (evoHint) buf += ` ${evoHint}`;
		buf += `<br>`;
		const levelStr = mon.level < 100 ?
			` <span style="color:#555">(${expNeeded} EXP)</span>` :
			` <span style="color:#f5c518">MAX</span>`;
		buf += `<span style="font-size:11px;color:#8ab4f8">Lv.${mon.level}${levelStr}</span>`;
		buf += renderExpBar(mon);
		if (heldLabel) {
			buf += `<br><span style="font-size:10px;color:#8ab4f8">${Utils.escapeHTML(heldLabel)}</span>`;
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
				`${Utils.escapeHTML(iname)} x${qty}</span>`;
		}
		buf += `</div>`;
	}

	buf += `<div class="pr-popup-actions" style="margin-top:12px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button">` +
		`Start Battle — Floor ${state.floor}</button>`;
	buf += `<a href="/view-pokerogue-shop" class="button">Shop</a>`;
	buf += `<a href="/view-pokerogue-top" class="button">Leaderboard</a>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080">` +
		`Quit Run</button>`;
	buf += `</div>`;

	buf += `</div>`;
	return buf;
}

// re-rolls empty pendingChoice if it was set but is empty (e.g. dex not loaded at creation time)
function repairEmptyPendingChoice(state: PokeRogueState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

// renders the "no active run" page html
const NO_RUN_PAGE_HTML =
	`<div class="pr-popup">` +
	`<div class="pr-popup-header"><h2>PokéRogue</h2></div>` +
	`<div style="text-align:center;padding:16px 0">` +
	`<p style="font-size:13px;margin:0 0 12px">No active run.</p>` +
	`<button name="send" value="/pokerogue newgame" class="button">Start New Run</button>` +
	`</div></div>`;

// refreshes the page view for a user after battle-end state changes
function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		for (const pageId of ['view-pokerogue', 'view-pokerogue-shop', 'view-pokerogue-top']) {
			conn.send(`>${pageId}\n|refresh|`);
		}
	}
}

// pushes the shop page HTML directly to a user so it opens automatically
function openShopForUser(user: User, state: PokeRogueState): void {
	if (!state.shopInventory) {
		state.shopInventory = rollShopInventory();
		setState(user.id, state);
	}
	const shopHtml = renderGamePopup(state, 'shop');
	for (const conn of user.connections) {
		conn.send(`>view-pokerogue-shop\n|init|html\n|title|PokéRogue Shop\n|pagehtml|${shopHtml}`);
	}
}

export const commands: Chat.ChatCommands = {
	pokerogue: {
		// /pokerogue start — auto-creates a new run if none exists, then opens the game page
		start(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			let newState = state;
			let stateChanged = false;
			// clear stale battle room reference so auto-start condition evaluates correctly
			if (newState?.battleRoomId) {
				const bRoom = Rooms.get(newState.battleRoomId as RoomID);
				if (!bRoom?.battle || bRoom.battle.ended) {
					delete newState.battleRoomId;
					stateChanged = true;
				}
			}
			if (!newState || (!newState.team?.length && !newState.pendingChoice?.length && !newState.battleRoomId && !newState.gameOver)) {
				newState = buildFreshState(newState);
				stateChanged = true;
			}
			if (stateChanged && newState) {
				setState(user.id, newState);
			}
			if (newState) repairEmptyPendingChoice(newState, user.id);
			return this.parse('/join view-pokerogue');
		},

		// /pokerogue newgame [confirm] — starts a fresh run; requires confirm if progress exists
		newgame(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const existing = getState(user.id);
			const hasProgress = existing && (existing.team?.length > 0 || (existing.floor ?? 1) > 1);

			if (hasProgress && target.trim().toLowerCase() !== 'confirm') {
				return this.sendReplyBox(
					`<b>Warning: You already have an active PokéRogue run!</b><br>` +
					`Floor: <b>${existing.floor}</b> &nbsp;|&nbsp; ` +
					`Team: <b>${existing.team?.length ?? 0} Pokemon</b> &nbsp;|&nbsp; ` +
					`Coins: <b>${existing.coins ?? 0}</b><br><br>` +
					`Starting a fresh run will permanently delete your current progress.<br>` +
					`<button name="send" value="/pokerogue newgame confirm" class="button">` +
					`Yes, start a fresh run</button> &nbsp; ` +
					`<button name="send" value="/pokerogue start" class="button">` +
					`Keep my current run</button>`
				);
			}

			const newState = buildFreshState(existing);
			setState(user.id, newState);
			return this.parse('/join view-pokerogue');
		},

		// /pokerogue choose <1|2|3>
		choose(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const n = parseInt(target.trim());
			if (!n || n < 1 || n > 3) {
				return this.errorReply('Usage: /pokerogue choose [1, 2, or 3]');
			}

			const state = getState(user.id);
			if (!state?.pendingChoice?.length) {
				return this.errorReply('You have no pending Pokemon choice. Use /pokerogue start first.');
			}

			// block second battle while one is active
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
			// treat any non-'add' type as a starter choice
			const isStarter = state.pendingChoiceType !== 'add';

			if (isStarter) {
				state.team = [{ species: chosen, level: 1, exp: 0 }];
				state.floor = 1;
			} else {
				if (state.team.length >= 6) {
					delete state.pendingChoice;
					delete state.pendingChoiceType;
					setState(user.id, state);
					return this.errorReply('Your team is already full (6 Pokemon). The pending choice has been cleared.');
				}
				const addLevel = Math.max(1, state.floor - 2);
				state.team.push({ species: chosen, level: addLevel, exp: expForLevel(addLevel) });
			}

			delete state.pendingChoice;
			delete state.pendingChoiceType;

			// persist state before battle creation so updates aren't lost if creation fails
			setState(user.id, state);

			const ok = startBattle(user, state);
			if (!ok) {
				this.refreshPage('pokerogue');
				return;
			}

			this.refreshPage('pokerogue');
		},

		// /pokerogue battle — starts the next floor battle
		battle(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('No active PokéRogue run. Use /pokerogue start to open the game page!');
			}

			if (state.battleRoomId) {
				const battleRoom = Rooms.get(state.battleRoomId as RoomID);
				if (battleRoom) {
					return this.sendReplyBox(
						`You already have an active PokéRogue battle! ` +
						`<a href="/${state.battleRoomId}">Click here</a> to go to your battle.`
					);
				}
				// stale reference — clear and continue
				delete state.battleRoomId;
				setState(user.id, state);
			}

			if (state.pendingChoice?.length) {
				return this.sendReplyBox(
					`You have a pending Pokemon choice! ` +
					`<button name="send" value="/pokerogue start" class="button">Open PokéRogue</button> to choose.`
				);
			}

			if (!state.team?.length) {
				return this.errorReply('No team to battle with. Use /pokerogue start to begin a new run!');
			}

			const ok = startBattle(user, state);
			if (!ok) {
				// startBattle sends an error popup; refresh the page for retry
				this.refreshPage('pokerogue');
				return;
			}
		},

		// /pokerogue status — shows current run info
		status(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.sendReplyBox(
					`You have no active PokéRogue run. ` +
					`<button name="send" value="/pokerogue start" class="button">Start a run</button>`
				);
			}
			if (state.pendingChoice?.length && !state.team?.length) {
				return this.sendReplyBox(
					`You have a pending Pokemon choice! ` +
					`<button name="send" value="/pokerogue start" class="button">Open PokéRogue</button> to choose.`
				);
			}
			if (!state.team?.length) {
				return this.sendReplyBox(
					`You have no active PokéRogue run. ` +
					`<button name="send" value="/pokerogue newgame" class="button">Start a run</button>`
				);
			}
			const coins = state.coins ?? 0;
			const items = state.items ?? {};
			const itemList = Object.entries(items)
				.filter(([, qty]) => qty > 0)
				.map(([id, qty]) => `${SHOP_ITEMS[id]?.name ?? id} x${qty}`)
				.join(', ') || 'None';
			const pendingLine = state.pendingChoice?.length ?
				`<br><br><b>You have a pending Pokemon choice!</b> ` +
				`<button name="send" value="/pokerogue start" class="button">Open PokéRogue</button> to choose.` :
				'';
			this.sendReplyBox(
				`<b>PokéRogue Status</b><br>` +
				`<b>Floor:</b> ${state.floor} &nbsp;|&nbsp; <b>Coins:</b> ${coins} &nbsp;|&nbsp; ` +
				`<b>Streaks:</b> ${state.streaksWon ?? 0}` +
				(state.highestFloor ? ` &nbsp;|&nbsp; <b>Best Floor:</b> ${state.highestFloor}` : '') +
				pendingLine +
				`<br><br><b>Team:</b><br>${renderTeam(state.team, true)}` +
				(itemList !== 'None' ? `<br><br><b>Inventory:</b> ${itemList}` : '')
			);
		},

		// /pokerogue shop — opens the shop page
		shop(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) return this.errorReply('You have no active PokéRogue run. Use /pokerogue start first.');
			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}
			return this.parse('/join view-pokerogue-shop');
		},

		// /pokerogue refreshshop — reroll the shop inventory for 5 coins
		refreshshop(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) return this.errorReply('You have no active PokéRogue run. Use /pokerogue start first.');
			const coins = state.coins ?? 0;
			if (coins < 5) return this.errorReply(`Not enough coins. You need 5 but have ${coins}.`);
			state.coins = coins - 5;
			state.shopInventory = rollShopInventory();
			setState(user.id, state);
			this.refreshPage('pokerogue-shop');
		},

		// /pokerogue buy <item>
		buy(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const itemId = toID(target.trim());
			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${target.trim()}". Use /pokerogue shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run. Use /pokerogue start first.');
			}

			if (!state.shopInventory) {
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
			}

			// only items in the current shop rotation can be purchased
			if (!state.shopInventory.includes(itemId)) {
				return this.errorReply(
					`${item.name} is not in your current shop. Use /pokerogue shop to see what's available, ` +
					`or /pokerogue refreshshop to reroll for 5 coins.`
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

			// refresh the shop page so the ui reflects changes instantly
			this.refreshPage('pokerogue-shop');
		},

		// /pokerogue use <item> [team slot 1-6]
		use(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const parts = target.trim().split(/\s+/);
			const itemId = toID(parts[0] ?? '');
			const slotArg = parseInt(parts[1] ?? '0');

			const item = SHOP_ITEMS[itemId];
			if (!item) {
				return this.errorReply(`Unknown item "${parts[0]}". Use /pokerogue shop to see available items.`);
			}

			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run. Use /pokerogue start first.');
			}

			const qty = state.items?.[itemId] ?? 0;
			if (qty < 1) {
				return this.errorReply(`You don't have any ${item.name}. Use /pokerogue buy ${itemId} to get one.`);
			}

			state.items![itemId] = qty - 1;

			switch (itemId) {
			case 'rarecandy': {
				const slot = slotArg - 1;
				if (slot < 0 || slot >= state.team.length) {
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Specify a team slot 1-${state.team.length}. Example: /pokerogue use rarecandy 1`);
				}
				const mon = state.team[slot];
				const oldSpecies = mon.species;
				mon.level = Math.min(100, mon.level + 5);
				mon.exp = expForLevel(mon.level);
				let evolved = false;
				while (true) {
					const evo = getLevelUpEvo(mon.species);
					if (!evo || mon.level < evo.evoLevel) break;
					mon.species = evo.evoTo;
					evolved = true;
				}
				const newName = Dex.species.get(toID(mon.species)).name || mon.species;
				const oldName = Dex.species.get(toID(oldSpecies)).name || oldSpecies;
				state.notification = evolved ?
					`${Utils.escapeHTML(oldName)} evolved into <b>${Utils.escapeHTML(newName)}</b> and grew to <b>Lv.${mon.level}</b>!` :
					`<b>${Utils.escapeHTML(newName)}</b> grew to <b>Lv.${mon.level}</b>!`;
				setState(user.id, state);
				this.refreshPage('pokerogue');
				return;
			}
			case 'luckycharm': {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) + 3;
				state.notification = `<b>Lucky Charm</b> activated! EXP and coins doubled for the next ${state.doubleExpFloors} floors.`;
				setState(user.id, state);
				this.refreshPage('pokerogue');
				return;
			}
			case 'revive': {
				state.hasRevive = true;
				state.notification = `<b>Revive</b> activated! If you lose your next battle, you will retry the same floor.`;
				setState(user.id, state);
				this.refreshPage('pokerogue');
				return;
			}
			default: {
				// held items — equip to a team Pokemon
				if (!item.heldItem) {
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Cannot manually use ${item.name}. It applies automatically.`);
				}
				const slot = slotArg - 1;
				if (slot < 0 || slot >= state.team.length) {
					state.items![itemId] = qty;
					setState(user.id, state);
					return this.errorReply(`Specify a team slot 1-${state.team.length}. Example: /pokerogue use ${itemId} 1`);
				}
				const mon = state.team[slot];
				if (mon.heldItem) {
					// return old held item to inventory
					state.items![mon.heldItem] = (state.items![mon.heldItem] ?? 0) + 1;
				}
				mon.heldItem = item.heldItem;
				const monName = Dex.species.get(toID(mon.species)).name || mon.species;
				state.notification = `Equipped <b>${Utils.escapeHTML(item.name)}</b> to <b>${Utils.escapeHTML(monName)}</b>!`;
				setState(user.id, state);
				this.refreshPage('pokerogue');
				return;
			}
			}
		},

		// /pokerogue quit
		quit(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			const state = getState(user.id);
			if (!state) {
				return this.errorReply('You have no active PokéRogue run.');
			}
			if (state.battleRoomId) {
				// clean up bot and active match before forfeiting
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
			this.refreshPage('pokerogue');
			return;
		},

		// staff commands (global driver+)

		givemoney(target, room, user) {
			this.checkCan('lock');
			const parts = target.trim().split(/\s+/);
			// if only a number is given, give to self
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
				targetId = user.id;
				targetName = user.name;
				amount = parseInt(parts[0]);
			} else if (parts.length >= 2) {
				const rawName = parts[0];
				const parsedId = toID(rawName);
				if (!rawName) {
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
				return this.errorReply('Usage: /pokerogue removecoins [user], <amount>');
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
				targetId = user.id;
				targetName = user.name;
				floor = parseInt(parts[0]);
			} else if (parts.length >= 2) {
				const rawUser = parts[0];
				if (!rawUser) {
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
				return this.errorReply('Usage: /pokerogue setfloor [user], <floor>');
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
				if (!parts[0]) return this.errorReply('Usage: /pokerogue addmon [user], <pokemon> [, <level>]');
				targetId = user.id;
				targetName = user.name;
				speciesStr = parts[0];
			} else if (parts.length === 2) {
				if (/^\d+$/.test(parts[1])) {
					const lvl = parseInt(parts[1]);
					if (lvl < 1 || lvl > 100) return this.errorReply('Level must be between 1 and 100.');
					targetId = user.id;
					targetName = user.name;
					speciesStr = parts[0];
					levelOverride = lvl;
				} else {
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
			const trimmedTarget = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmedTarget) {
				targetId = user.id;
				targetName = user.name;
			} else {
				const maybeId = toID(trimmedTarget);
				if (!maybeId) return this.errorReply(`Invalid username: "${trimmedTarget}".`);
				targetId = maybeId;
				targetName = trimmedTarget;
			}
			if (!getState(targetId)) return this.errorReply(`${targetName} has no PokéRogue data.`);
			deleteState(targetId);
			this.sendReply(`Deleted all PokéRogue data for ${targetName}.`);
			if (targetId !== user.id) {
				Users.get(targetId)?.popup(`[PokéRogue] A staff member removed your PokéRogue data.`);
			}
			this.modlog('POKEROUGE WIPEUSERDATA', targetId, 'wiped all PokéRogue data');
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const trimmed = target.trim();
			let targetId: string;
			let targetName: string;
			if (!trimmed) {
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

		// /pokerogue top — top 100 leaderboard (redirects to the leaderboard page)
		top(target, room, user) {
			return this.parse('/join view-pokerogue-top');
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html =
				`<b>PokéRogue — Player Commands:</b><br>` +
				`<code>/pokerogue start</code> — Open the PokéRogue game page (auto-starts new run if needed).<br>` +
				`<code>/pokerogue battle</code> — Start the next floor battle.<br>` +
				`<code>/pokerogue choose [1/2/3]</code> — Choose a starter or add a new Pokemon to your team.<br>` +
				`<code>/pokerogue shop</code> — Open the item shop page.<br>` +
				`<code>/pokerogue refreshshop</code> — Reroll shop items for 5 coins.<br>` +
				`<code>/pokerogue buy &lt;item&gt;</code> — Purchase an item (costs coins).<br>` +
				`<code>/pokerogue use &lt;item&gt; [slot]</code> — Activate a consumable or equip a held item to slot 1-6.<br>` +
				`<code>/pokerogue status</code> — View your floor, coins, inventory and team.<br>` +
				`<code>/pokerogue top</code> — View the Top 100 leaderboard by highest floor.<br>` +
				`<code>/pokerogue quit</code> — Abandon your current run.<br>` +
				`<br><b>Tip:</b> Type <code>/pokerogue start</code> to open the game page.<br>` +
				`<br><b>Shop Items:</b> 30+ PS items including Choice Band/Specs/Scarf, Life Orb, Assault Vest, Heavy-Duty Boots, and more.<br>` +
				`<br><b>Tips:</b> Win floors to earn coins. Legendary Pokemon may appear as team additions at Floor 20+!`;
			if (isStaff) {
				html +=
					`<br><br><b>Staff Commands (Global Driver+):</b><br>` +
					`<code>/pokerogue givemoney [user] [amount]</code> — Give coins (default 100). Omit user to give to yourself.<br>` +
					`<code>/pokerogue removecoins [user], &lt;amount&gt;</code> — Remove coins (omit user for self).<br>` +
					`<code>/pokerogue resetcoins [user]</code> — Set coins to 0 (omit user for self).<br>` +
					`<code>/pokerogue setfloor [user], &lt;floor&gt;</code> — Set current floor (omit user for self).<br>` +
					`<code>/pokerogue resetfloor [user]</code> — Reset floor to 1 (omit user for self).<br>` +
					`<code>/pokerogue viewteam [user]</code> — View a user's team (omit user for own team).<br>` +
					`<code>/pokerogue addmon [user], &lt;pokemon&gt; [, &lt;level&gt;]</code> (alias: <code>givemon</code>) — Add a Pokemon to a team.<br>` +
					`<code>/pokerogue removemon [user]</code> — Delete all PokéRogue data for a user.<br>` +
					`<code>/pokerogue healteam [user]</code> — Reset team EXP to current level baseline.<br>`;
			}
			this.sendReplyBox(html);
		},

		// /pokerogue popup [shop] — redirects to the game page (kept for backwards compatibility)
		popup(target, room, user) {
			if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');
			if (target.trim() === 'shop') return this.parse('/join view-pokerogue-shop');
			return this.parse('/join view-pokerogue');
		},

		// /pokerogue dismissnotif — dismiss the notification banner
		dismissnotif(target, room, user) {
			if (!user.named) return;
			const state = getState(user.id);
			if (state?.notification) {
				delete state.notification;
				setState(user.id, state);
			}
			this.refreshPage('pokerogue');
			this.refreshPage('pokerogue-shop');
		},

		'': 'help',
	},

};

// page table — /view-pokerogue renders the game ui

export const pages: Chat.PageTable = {
	pokerogue(args, user) {
		if (!user.named) return this.errorReply('You must be logged in to play PokéRogue.');

		// leaderboard sub-page
		if (args[0] === 'top') {
			return `<div class="pr-popup">` +
				`<div class="pr-popup-header">` +
				`<h2>PokéRogue Leaderboard</h2>` +
				`<a href="/view-pokerogue" class="button">Back</a>` +
				`</div>` +
				renderLeaderboard() +
				`</div>`;
		}

		const state = getState(user.id);

		// no active run — show start screen
		if (!state || (!state.team?.length && !state.pendingChoice?.length && !state.battleRoomId && !state.gameOver)) {
			return NO_RUN_PAGE_HTML;
		}

		repairEmptyPendingChoice(state, user.id);
		// clear stale battle room reference
		if (state.battleRoomId) {
			const bRoom = Rooms.get(state.battleRoomId as RoomID);
			if (!bRoom?.battle || bRoom.battle.ended) {
				delete state.battleRoomId;
				setState(user.id, state);
			}
		}
		const view = args[0] === 'shop' ? 'shop' : 'main';
		if (view === 'shop' && state.shopInventory === undefined) {
			state.shopInventory = rollShopInventory();
			setState(user.id, state);
		}
		return renderGamePopup(state, view);
	},
};

// battle end handler

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = activeMatches.get(battle.roomid);
		if (!match) return;
		activeMatches.delete(battle.roomid);

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

			const expReward = floorExpReward(match.floor) * multiplier;
			const levelUpMsgs: string[] = [];

			for (const mon of state.team) {
				const oldSpeciesData = Dex.species.get(toID(mon.species));
				const oldName = oldSpeciesData.exists ? oldSpeciesData.name : mon.species;

				const { evolved, oldLevel } = applyExpAndLevelUp(mon, expReward);
				if (mon.level > oldLevel) {
					const newSpeciesData = Dex.species.get(toID(mon.species));
					const newName = newSpeciesData.exists ? newSpeciesData.name : mon.species;
					if (evolved) {
						levelUpMsgs.push(
							`<b>${Utils.escapeHTML(oldName)}</b> evolved into <b>${Utils.escapeHTML(newName)}</b> and is now <b>Lv.${mon.level}</b>!`
						);
					} else {
						levelUpMsgs.push(`<b>${Utils.escapeHTML(newName)}</b> grew to <b>Lv.${mon.level}</b>!`);
					}
				}
			}

			// award coins
			const coinsEarned = floorCoinReward(match.floor) * multiplier;
			state.coins = (state.coins ?? 0) + coinsEarned;

			if (doubleActive) {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) - 1;
			}

			const prevFloor = state.floor;
			state.floor++;
			state.streaksWon = (state.streaksWon ?? 0) + 1;

			// reset shop inventory after each win
			delete state.shopInventory;

			if (state.floor > (state.highestFloor ?? 0)) state.highestFloor = state.floor;
			if (humanUser) state.displayName = humanUser.name;

			// offer a new pokemon every 5 floors
			const offerNewPokemon = state.floor > 1 && (state.floor - 1) % 5 === 0 && state.team.length < 6;

			const coinBoostNote = doubleActive ? ` <b style="color:#fac000">(2x Lucky Charm!)</b>` : '';
			const levelUpHtml = levelUpMsgs.length ? `<br>${levelUpMsgs.join('<br>')}` : '';
			const milestoneHtml = offerNewPokemon ?
				`<br><b style="color:#c4a8ff">Milestone! Choose a new Pokemon to add to your team!</b>` : '';
			state.notification =
				`<b style="font-size:14px">Floor ${prevFloor} Cleared! Moving to Floor ${state.floor}!</b>` +
				`<br><span style="font-size:12px">` +
				`+${coinsEarned} coins${coinBoostNote} (Total: ${state.coins}) — Streaks: ${state.streaksWon}` +
				`</span>` +
				levelUpHtml +
				milestoneHtml;

			if (offerNewPokemon) {
				const opts = pickNewPokemonOptions(state.team, prevFloor);
				state.pendingChoice = opts;
				state.pendingChoiceType = 'add';
				setState(match.userId, state);
			} else {
				setState(match.userId, state);
			}

			// refresh the game page to show win result
			if (humanUser) {
				if (offerNewPokemon) {
					// milestone: show the main page for Pokemon choice
					refreshGamePage(humanUser);
				} else {
					// normal win: open shop page directly so user can buy items
					openShopForUser(humanUser, state);
					refreshGamePage(humanUser);
				}
			}
		} else {
			// loss
			if (state.hasRevive) {
				state.hasRevive = false;
				delete state.battleRoomId;
				state.notification = `<b>Revive activated!</b> You get to retry Floor ${match.floor}!`;
				setState(match.userId, state);
				if (humanUser) {
					refreshGamePage(humanUser);
				}
			} else {
				// run over — reset state while preserving leaderboard data
				const finalFloor = match.floor;
				const finalStreaks = state.streaksWon ?? 0;
				state.floor = 1;
				state.team = [];
				state.coins = 0;
				state.streaksWon = 0;
				state.hasRevive = false;
				state.items = {};
				state.gameOver = true;
				state.lastRunFloor = finalFloor;
				state.lastRunStreaks = finalStreaks;
				delete state.battleRoomId;
				delete state.pendingChoice;
				delete state.pendingChoiceType;
				delete state.doubleExpFloors;
				delete state.shopInventory;
				delete state.notification;
				setState(match.userId, state);
				if (humanUser) {
					refreshGamePage(humanUser);
				}
			}
		}
	},
};

// plugin start hook — registers the private "Roguelike Battle" format at startup

export const start = (): void => {
	// guard BasicRoom.prototype.destroy against the null Rooms.global crash on startup/hot-reload
	if (!(Rooms.BasicRoom.prototype as any).__pokerogueDestroyPatched) {
		const _origDestroy = Rooms.BasicRoom.prototype.destroy;
		Rooms.BasicRoom.prototype.destroy = function (
			this: InstanceType<typeof Rooms.BasicRoom>
		) {
			if (!Rooms.global) {
				Monitor.warn(`[pokerogue] BasicRoom.destroy: Rooms.global is null for ${this.roomid}, using no-op stubs`);
				const roomsGlobalStub = { deregisterChatRoom: () => {}, delistChatRoom: () => {} };
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
		(Rooms.BasicRoom.prototype as any).__pokerogueDestroyPatched = true;
	}

	const { Dex } = require('../../../sim/dex') as typeof import('../../../sim/dex');
	const { Format } = require('../../../sim/dex-formats') as typeof import('../../../sim/dex-formats');

	const FORMAT_ID = 'roguelikebattle' as ID;

	// skip if already registered (hot-reload)
	if (Dex.formats.rulesetCache.has(FORMAT_ID)) return;

	Dex.formats.load();

	const formatData = {
		name: 'Roguelike Battle',
		mod: 'gen9',
		effectType: 'Format' as const,
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
	(Dex.formats.formatsListCache as Format[])?.push(format);
};
