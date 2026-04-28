/*
 * =======================================================================
 *
 * ___ __  __ ___ _   _ _    ___ ___
 * |_ _|  \/  | _ \ | | | |  / __| __|
 * | || |\/| |  _/ |_| | |__\__ \ _|
 * |___|_|  |_|_|  \___/|____|___/___|
 *
 * Server: Impulse
 * Plugin: PokéRogue Render
 * Made by: @TurboRx
 *
 * =======================================================================
 */

import { Utils } from '../../../lib';
import { Table } from '../../utils';
import { SHOP_ITEMS, ROTATIONAL_ITEM_POOL } from './pokerogue-items';
import { LEGENDARY_TAGS, type PokemonEntry, type PokeRogueState } from './pokerogue-types';
import { savedData } from './pokerogue-state';
import { expForLevel } from './pokerogue-pokemon';

export function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('pokerogue')) {
			Chat.parse(`/join view-pokerogue`, null, user, conn);
		}
	}
}

const PAGE_REFRESH_SECONDS = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function itemURLFormat(item: string): string {
	return item.replaceAll(/[^a-zA-Z0-9\s-]+/g, '').toLowerCase().replaceAll(' ', '-');
}

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	let src: string;
	let fallback1: string | null = null;
	let fallback2: string | null = null;
	const spriteId = sp.exists ? sp.spriteid : id;
	if (sp.exists && (sp.gen >= 6 || !!sp.forme)) {
		src = `https://play.pokemonshowdown.com/sprites/dex/${spriteId}.png`;
		fallback1 = `https://play.pokemonshowdown.com/sprites/home-centered/${spriteId}.png`;
		fallback2 = `https://play.pokemonshowdown.com/sprites/gen5/${spriteId}.png`;
	} else {
		src = `https://play.pokemonshowdown.com/sprites/gen5/${spriteId}.png`;
		fallback1 = `https://play.pokemonshowdown.com/sprites/dex/${spriteId}.png`;
	}
	let onerror = '';
	if (fallback1 && fallback2) {
		onerror = ` onerror="this.onerror=function(){this.onerror=function(){this.onerror=null;this.style.display='none'};this.src='${fallback2}'};this.src='${fallback1}'"`;
	} else if (fallback1) {
		onerror = ` onerror="this.onerror=function(){this.onerror=null;this.style.display='none'};this.src='${fallback1}'"`;
	} else {
		onerror = ` onerror="this.onerror=null;this.style.display='none'"`;
	}
	return `<img src="${src}"${onerror} width="${size}" height="${size}" alt="${altName} sprite" class="pr-mon-img" style="width:${size}px;height:${size}px" />`;
}

function getShopItemIcon(icon: string, size = 20): string {
	const url = `https://www.smogon.com/forums/media/minisprites/${itemURLFormat(icon)}.png`;
	return `<img src="${Utils.escapeHTML(url)}" width="${size}" height="${size}" class="pr-shop-icon" onerror="this.style.display='none'" />`;
}

function getPokeballInfo(speciesId: string): { src: string, alt: string } {
	const sp = Dex.species.get(toID(speciesId));
	const BASE = 'https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/';
	if (sp.tags?.some(tag => LEGENDARY_TAGS.has(tag))) return { src: `${BASE}i1.png`, alt: 'Master Ball' };
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		if (bst >= 580) return { src: `${BASE}i2.png`, alt: 'Ultra Ball' };
		if (bst >= 480) return { src: `${BASE}i3.png`, alt: 'Great Ball' };
	}
	return { src: `${BASE}i4.png`, alt: 'Poké Ball' };
}

export function getSpriteWithBall(species: string, size = 80): string {
	const ball = getPokeballInfo(species);
	return `<div class="pr-sprite-wrap" style="width:${size}px;height:${size}px;flex-shrink:0;margin:0 auto;">` +
		getSprite(species, size) +
		`<img src="${ball.src}" alt="${Utils.escapeHTML(ball.alt)}" class="pr-pokeball-overlay" />` +
		`</div>`;
}

function typeColor(type: string): string {
	const colors: Record<string, string> = {
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129', Electric: 'fac000',
		Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb', Ground: '915121', Flying: '81b9ef',
		Psychic: 'ef4179', Bug: '91a119', Rock: 'afa981', Ghost: '704170', Dragon: '5060e1',
		Dark: '624d4e', Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return colors[type] ?? '68a090';
}

export function renderTypeBadge(types: string[], large = false): string {
	return types.map(t =>
		`<span class="pr-type" style="background:#${typeColor(t)};font-size:${large ? '10px' : '9px'}">${t}</span>`
	).join(' ');
}

function renderExpBar(mon: PokemonEntry): string {
	let pct = 100;
	if (mon.level < 999) {
		const expAtCurrent = expForLevel(mon.level);
		const expAtNext = expForLevel(mon.level + 1);
		const range = expAtNext - expAtCurrent;
		pct = range > 0 ? Math.max(0, Math.min(100, Math.round(((mon.exp - expAtCurrent) / range) * 100))) : 0;
	}
	return `<div class="pr-expbar"><div class="pr-expbar-fill" style="width:${pct}%"></div></div>`;
}

function renderHpBar(mon: PokemonEntry): string {
	const hpPct = mon.currentHp ?? 100;
	const color = hpPct > 50 ? '#4caf50' : hpPct > 25 ? '#ff9800' : '#f44336';
	return `<div class="pr-bar-row">` +
		`<div class="pr-bar-track"><div class="pr-bar-fill" style="width:${hpPct}%;background:${color}"></div></div>` +
		`<span class="pr-bar-label">${hpPct}% HP</span>` +
		`</div>`;
}

// ---------------------------------------------------------------------------
// Sub-section renderers
// ---------------------------------------------------------------------------

function renderNotification(state: PokeRogueState): string {
	if (!state.notification) return '';
	return `<div class="pr-notification">` +
		`<div class="pr-notif-text">${state.notification}</div>` +
		`<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">✕</button></div>`;
}

function renderStatBar(state: PokeRogueState, cols2 = false): string {
	if (cols2) {
		return `<div class="pr-statbar cols2">` +
			`<div class="pr-stat"><div class="pr-stat-label">Battle Points</div><div class="pr-stat-val">${state.battlePoints ?? 0} BP</div></div>` +
			`<div class="pr-stat"><div class="pr-stat-label">Streak</div><div class="pr-stat-val">${state.streaksWon ?? 0}</div></div>` +
			`</div>`;
	}
	return `<div class="pr-statbar">` +
		`<div class="pr-stat"><div class="pr-stat-label">Floor</div><div class="pr-stat-val">${state.floor}</div></div>` +
		`<div class="pr-stat"><div class="pr-stat-label">Battle Points</div><div class="pr-stat-val">${state.battlePoints ?? 0} BP</div></div>` +
		`<div class="pr-stat"><div class="pr-stat-label">Streaks</div><div class="pr-stat-val">${state.streaksWon ?? 0}</div></div>` +
		`</div>`;
}

function renderTeamTableRow(mon: PokemonEntry, actionButton?: string): string {
	const spData = Dex.species.get(toID(mon.species));
	const expNeeded = mon.level < 999 ? expForLevel(mon.level + 1) - mon.exp : 0;

	let buf = `<tr>`;
	buf += `<td class="pr-td-icon">${getSpriteWithBall(mon.species, 44)}</td>`;

	// Details Column
	buf += `<td>`;
	buf += `<div class="pr-td-name">${spData.name} <span class="pr-mon-lv">Lv. ${mon.level}</span></div>`;
	buf += `<div class="pr-types">${renderTypeBadge(spData.types ?? [])}</div>`;
	if (mon.heldItem) {
		const dexHeld = Dex.items.get(mon.heldItem);
		buf += `<div class="pr-item-tag">${Utils.escapeHTML(dexHeld.name || mon.heldItem)}</div>`;
	}
	if (mon.status) {
		buf += `<div style="font-size:9px;color:#ff9800;font-weight:500;margin-top:2px">${mon.status.toUpperCase()}</div>`;
	}
	buf += `</td>`;

	// Health and EXP Bars Column
	buf += `<td class="pr-td-bars">`;
	buf += `<div class="pr-bars">`;
	buf += renderHpBar(mon);
	buf += `<div class="pr-bar-row">`;
	buf += `<div class="pr-bar-track">${renderExpBar(mon).replace('pr-expbar', 'pr-bar-track').replace('<div class="pr-expbar"><', '<').replace('</div></div>', '</div>')}</div>`;
	if (mon.level < 999) {
		buf += `<span class="pr-bar-label" style="min-width:36px;font-size:8px">${expNeeded} to Lv</span>`;
	}
	buf += `</div></div></td>`;

	// Actions Column (Optional)
	if (actionButton !== undefined) {
		buf += `<td class="pr-td-action">${actionButton}</td>`;
	}

	buf += `</tr>`;
	return buf;
}

function renderShopTable(
	items: [string, typeof SHOP_ITEMS[string] | typeof ROTATIONAL_ITEM_POOL[string]][],
	bp: number,
	keyItems: string[],
	cmd: string,
): string {
	let buf = `<div class="pr-table-container"><table class="pr-table">`;
	buf += `<thead><tr><th colspan="2">Name</th><th>Description</th><th>Cost</th><th style="text-align:right">Action</th></tr></thead>`;
	buf += `<tbody>`;

	for (const [key, item] of items) {
		const isKey = (item as any).type === 'key';
		const alreadyHas = isKey && keyItems.includes(item.name);
		const canBuy = item.cost <= bp && !alreadyHas;

		buf += `<tr>`;
		buf += `<td class="pr-td-icon">${getShopItemIcon(item.icon, 20)}</td>`;
		buf += `<td class="pr-td-name">${Utils.escapeHTML(item.name)}</td>`;
		buf += `<td class="pr-td-desc">${Utils.escapeHTML(item.desc)}</td>`;
		buf += `<td class="pr-td-cost">${item.cost} BP</td>`;
		buf += `<td class="pr-td-action">`;

		if (alreadyHas) {
			buf += `<button class="pr-shop-buy" disabled>Owned</button>`;
		} else if (!canBuy) {
			buf += `<button class="pr-shop-buy" disabled>Need BP</button>`;
		} else {
			buf += `<button name="send" value="/${cmd} ${key}" class="pr-shop-buy">Buy</button>`;
		}

		buf += `</td></tr>`;
	}

	buf += `</tbody></table></div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// View: Main
// ---------------------------------------------------------------------------
function renderMainView(state: PokeRogueState, user: User): string {
	let buf = '';

	if (state.battleRoomId) {
		return `<div style="text-align:center;padding:18px 0;color:#fac000;font-weight:500">Battle in progress!</div>`;
	}

	buf += renderStatBar(state);

	buf += `<div class="pr-section-title">Your team</div>`;

	// Create Table for Team
	buf += `<div class="pr-table-container"><table class="pr-table">`;
	buf += `<thead><tr><th colspan="2">Pokémon</th><th>Condition</th></tr></thead>`;
	buf += `<tbody>`;
	for (const mon of state.team) {
		buf += renderTeamTableRow(mon);
	}
	buf += `</tbody></table></div>`;

	buf += `<div class="pr-actions">`;
	buf += `<button name="send" value="/pokerogue battle" class="pr-btn primary">Start battle</button>`;
	buf += `<button name="send" value="/pokerogue view bag" class="pr-btn">Bag</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="pr-btn">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="pr-btn">Top 100</button>`;
	buf += `<button name="send" value="/pokerogue view resetconfirm" class="pr-btn danger">Reset</button>`;
	if (user.can('lock')) {
		buf += `<button name="send" value="/pokerogue view devtools" class="pr-btn" style="background:#552288;color:white;border-color:#441177">Developer Tools</button>`;
	}
	buf += `</div>`;

	return buf;
}

// ---------------------------------------------------------------------------
// View: Shop
// ---------------------------------------------------------------------------
function renderShopView(state: PokeRogueState): string {
	const bp = state.battlePoints ?? 0;
	const streak = state.streaksWon ?? 0;
	const timesRerolled = state.timesRerolled ?? 0;
	const rerollCost = 2 + timesRerolled;

	let buf = renderStatBar(state, true);

	// Rotational deals
	if (state.rotationalShop?.length) {
		buf += `<div class="pr-section-title" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">`;
		buf += `<span>Current deals</span>`;
		if (rerollCost > bp) {
			buf += `<button class="pr-shop-buy" disabled style="font-size:10px;padding:4px 8px">Reroll (${rerollCost} BP)</button>`;
		} else {
			buf += `<button name="send" value="/pokerogue reroll" class="pr-shop-buy" style="font-size:10px;padding:4px 8px">Reroll (${rerollCost} BP)</button>`;
		}
		buf += `</div>`;

		const rotItems = state.rotationalShop
			.map(key => [key, ROTATIONAL_ITEM_POOL[key]] as [string, typeof ROTATIONAL_ITEM_POOL[string]])
			.filter(([, item]) => item && item.minStreak <= streak);
		buf += renderShopTable(rotItems, bp, state.keyItems ?? [], 'pokerogue buy');
		buf += `<div style="margin:10px 0 5px"></div>`;
	}

	// Permanent items
	buf += `<div class="pr-section-title">Always available</div>`;
	const permItems = Object.entries(SHOP_ITEMS)
		.filter(([, item]) => item.minStreak <= streak);
	buf += renderShopTable(permItems, bp, state.keyItems ?? [], 'pokerogue buy');

	return buf;
}

// ---------------------------------------------------------------------------
// View: Bag
// ---------------------------------------------------------------------------
function renderBagView(state: PokeRogueState): string {
	let buf = `<div class="pr-section-title">Manage held items</div>`;

	buf += `<div class="pr-table-container"><table class="pr-table">`;
	buf += `<thead><tr><th colspan="2">Pokémon</th><th>Condition</th><th style="text-align:right">Action</th></tr></thead>`;
	buf += `<tbody>`;

	for (let i = 0; i < state.team.length; i++) {
		const mon = state.team[i];
		let actionBtn = '';

		if (mon.heldItem) {
			actionBtn = `<button name="send" value="/pokerogue unequip ${i + 1}" class="pr-shop-buy">Take Item</button>`;
		} else {
			actionBtn = `<div style="font-size:10px;color:#888;">No item</div>`;
		}

		buf += renderTeamTableRow(mon, actionBtn);
	}

	buf += `</tbody></table></div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// View: Leaderboard
// ---------------------------------------------------------------------------
function renderTopView(): string {
	const entries = Object.entries(savedData)
		.filter(([, s]) => (s.highestFloor ?? 0) > 0)
		.sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0))
		.slice(0, 100);

	if (!entries.length) return `<div style="text-align:center;padding:16px;color:#888;font-size:13px">No records yet!</div>`;

	let buf = `<div class="pr-section-title">Top 100 runs</div>`;
	buf += `<div class="pr-table-container"><table class="pr-table">`;
	buf += `<thead><tr><th>Rank</th><th>Player</th><th>Floor</th><th>Team</th></tr></thead>`;
	buf += `<tbody>`;

	entries.forEach(([userid, s], i) => {
		const displayTeam = s.recordTeam?.length ? s.recordTeam : s.team;
		const teamSprites = (displayTeam ?? [])
			.slice(0, 6)
			.map((m: PokemonEntry) => getSprite(m.species, 28))
			.join('');

		buf += `<tr>`;
		buf += `<td class="pr-td-desc" style="font-weight:500;">#${i + 1}</td>`;
		buf += `<td class="pr-td-name">${Impulse.nameColor(s.displayName || userid, true, true)}</td>`;
		buf += `<td class="pr-td-desc" style="white-space:nowrap;">Floor ${s.highestFloor}</td>`;
		buf += `<td><div class="pr-lb-team">${teamSprites}</div></td>`;
		buf += `</tr>`;
	});

	buf += `</tbody></table></div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// View: Reset Confirm
// ---------------------------------------------------------------------------
function renderResetConfirmView(state: PokeRogueState): string {
	let buf = `<div style="text-align:center;padding:20px 12px">`;
	buf += `<div style="font-size:17px;font-weight:500;color:#f87171;margin-bottom:8px">Reset run?</div>`;
	buf += `<div style="color:#aaa;font-size:12px;margin-bottom:18px">This will permanently end your current run on Floor <b>${state.floor}</b>.</div>`;
	buf += `<div style="display:flex;gap:10px;justify-content:center">`;
	buf += `<button name="send" value="/pokerogue quit" class="pr-btn danger" style="padding:8px 18px">Yes, reset run</button>`;
	buf += `<button name="send" value="/pokerogue view main" class="pr-btn" style="padding:8px 18px">Cancel</button>`;
	buf += `</div></div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// View: Game Over
// ---------------------------------------------------------------------------
function renderGameOverView(state: PokeRogueState): string {
	return `<div class="pr-gameover">` +
		`<div class="pr-go-title">Game over</div>` +
		`<div class="pr-go-sub">Your run ended on Floor <b>${state.lastRunFloor || 1}</b> with <b>${state.lastRunStreaks || 0}</b> streaks.</div>` +
		`<button name="send" value="/pokerogue newgame confirm" class="pr-newrun-btn">Start new run</button>` +
		`</div>`;
}

// ---------------------------------------------------------------------------
// Pending: Starter / Add Pokémon choice
// ---------------------------------------------------------------------------
function renderPendingChoice(state: PokeRogueState): string {
	const isStarter = state.pendingChoiceType === 'starter';
	let buf = `<h2 class="pr-choice-heading">${isStarter ? 'Choose your starter!' : 'Milestone! Add to team:'}</h2>`;
	buf += `<div class="pr-choice-grid">`;

	for (let i = 0; i < state.pendingChoice!.length; i++) {
		const sp = Dex.species.get(toID(state.pendingChoice![i]));
		const isLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const abilities = sp.abilities ?? {};
		const ability = (abilities as unknown as Record<string, string>)['0'] || 'Unknown';

		buf += `<div class="pr-choice-row${isLeg ? ' leg' : ''}">`;
		buf += getSpriteWithBall(sp.id, 52);
		buf += `<div style="flex:1;min-width:0">`;
		buf += `<div class="pr-ct-name">${sp.name}`;
		if (isLeg) buf += ` <span class="pr-legendary-badge">Legendary</span>`;
		buf += `</div>`;
		buf += `<div class="pr-types">${renderTypeBadge(sp.types ?? [])}</div>`;
		buf += `<div class="pr-ct-stats">`;
		for (const [stat, val] of Object.entries(bs)) {
			buf += `<span>${stat.toUpperCase()} <b>${val}</b></span>`;
		}
		buf += `</div>`;
		buf += `<div class="pr-ct-ability" style="margin-top:2px">Ability: <b>${Utils.escapeHTML(ability)}</b></div>`;
		buf += `</div>`;
		buf += `<button name="send" value="/pokerogue choose ${i + 1}" class="pr-pick-btn">Pick</button>`;
		buf += `</div>`;
	}

	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Swap Pokémon
// ---------------------------------------------------------------------------
function renderPendingSwap(state: PokeRogueState): string {
	const sp = Dex.species.get(toID(state.pendingSwap!.species));
	let buf = `<h2 class="pr-choice-heading">Team is full!</h2>`;
	buf += `<div style="text-align:center;margin-bottom:10px">`;
	buf += getSpriteWithBall(sp.id, 64);
	buf += `<div style="font-size:12px;color:#aaa;margin-top:6px"><b>Lv. ${state.pendingSwap!.level} ${sp.name}</b> wants to join. Replace a Pokémon:</div>`;
	buf += `</div>`;
	buf += `<div class="pr-choice-grid">`;
	for (let i = 0; i < state.team.length; i++) {
		const mon = state.team[i];
		const spName = Dex.species.get(toID(mon.species)).name;
		buf += `<div class="pr-choice-row" style="cursor:pointer">`;
		buf += getSpriteWithBall(mon.species, 40);
		buf += `<div style="flex:1"><span style="font-size:12px;font-weight:500">${spName}</span> <span style="font-size:10px;color:#888">Lv. ${mon.level}</span></div>`;
		buf += `<button name="send" value="/pokerogue swapmon ${i + 1}" class="pr-pick-btn">Replace</button>`;
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue swapmon skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Keep current team</button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Learn Move
// ---------------------------------------------------------------------------
function renderPendingMoves(state: PokeRogueState): string {
	const pending = state.pendingMoves![0];
	const mon = state.team[pending.pokemonIndex];
	const sp = Dex.species.get(toID(mon.species));
	const newMove = Dex.moves.get(pending.move);

	let buf = `<h2 class="pr-choice-heading">New move!</h2>`;
	buf += `<div style="text-align:center;margin-bottom:10px">`;
	buf += getSpriteWithBall(sp.id, 60);
	buf += `<div style="font-size:12px;color:#aaa;margin-top:6px"><b>${sp.name}</b> wants to learn <b style="color:#c4a8ff">${newMove.name}</b>.<br>Choose a move to forget:</div>`;
	buf += `</div>`;
	buf += `<div class="pr-choice-grid">`;
	for (let i = 0; i < mon.moves.length; i++) {
		const oldMove = Dex.moves.get(mon.moves[i]);
		buf += `<div class="pr-choice-row" style="justify-content:space-between">`;
		buf += `<div>`;
		buf += `<div style="font-size:12px;font-weight:500">${oldMove.name}</div>`;
		buf += `<div style="font-size:10px;color:#888">Type: ${oldMove.type} &nbsp;|&nbsp; BP: ${oldMove.basePower || '—'}</div>`;
		buf += `</div>`;
		buf += `<button name="send" value="/pokerogue learnmove ${i + 1}" class="pr-pick-btn">Forget</button>`;
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue learnmove skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Keep old moves</button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Teach TM (choose Pokémon)
// ---------------------------------------------------------------------------
function renderTeachTM(state: PokeRogueState): string {
	const moveName = Dex.moves.get(state.moveToLearn).name;
	let buf = `<h2 class="pr-choice-heading">Teach ${Utils.escapeHTML(moveName)}?</h2>`;
	buf += `<div style="font-size:12px;color:#aaa;margin-bottom:8px">Choose a Pokémon to learn <b style="color:#c4a8ff">${Utils.escapeHTML(moveName)}</b>:</div>`;
	buf += `<div class="pr-choice-grid">`;
	for (let i = 0; i < state.team.length; i++) {
		const mon = state.team[i];
		const spName = Dex.species.get(toID(mon.species)).name;
		const canLearn = Dex.species.getFullLearnset(toID(mon.species))
			.some(l => Object.keys(l.learnset ?? {}).includes(toID(state.moveToLearn!)));
		const alreadyKnows = mon.moves.includes(state.moveToLearn!);
		const disabled = !canLearn || alreadyKnows;
		const reason = alreadyKnows ? 'already knows' : !canLearn ? 'cannot learn' : '';

		buf += `<div class="pr-choice-row" style="${disabled ? 'opacity:.45' : ''}">`;
		buf += getSpriteWithBall(mon.species, 40);
		buf += `<div style="flex:1"><span style="font-size:12px;font-weight:500">${spName}</span> <span style="font-size:10px;color:#888">Lv. ${mon.level}${reason ? ` (${reason})` : ''}</span></div>`;
		if (!disabled) {
			buf += `<button name="send" value="/pokerogue teachtm ${i + 1}" class="pr-pick-btn">Teach</button>`;
		}
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue teachtm skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Cancel <small style="color:#888">(refund)</small></button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Item Pack choice
// ---------------------------------------------------------------------------
function renderItemOptions(state: PokeRogueState): string {
	let buf = `<h2 class="pr-choice-heading">Choose an item!</h2>`;
	buf += `<div class="pr-choice-grid">`;
	for (const itemName of state.itemOptions!) {
		const dexItem = Dex.items.get(itemName);
		buf += `<div class="pr-choice-row" style="justify-content:space-between">`;
		buf += `<div style="display:flex;align-items:center;gap:8px">`;
		buf += getShopItemIcon(itemURLFormat(itemName), 24);
		buf += `<span style="font-size:13px;font-weight:500">${Utils.escapeHTML(dexItem.name || itemName)}</span>`;
		buf += `</div>`;
		buf += `<button name="send" value="/pokerogue pickitem ${toID(itemName)}" class="pr-pick-btn">Pick</button>`;
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue pickitem skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Skip</button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Give item to Pokémon
// ---------------------------------------------------------------------------
function renderGiveItem(state: PokeRogueState): string {
	const dexItem = Dex.items.get(state.pendingItemName);
	let buf = `<h2 class="pr-choice-heading">Give ${Utils.escapeHTML(dexItem.name || state.pendingItemName!)}?</h2>`;
	buf += `<div style="font-size:12px;color:#aaa;margin-bottom:8px">Choose a Pokémon to give it to:</div>`;
	buf += `<div class="pr-choice-grid">`;
	for (let i = 0; i < state.team.length; i++) {
		const mon = state.team[i];
		const spName = Dex.species.get(toID(mon.species)).name;
		buf += `<div class="pr-choice-row">`;
		buf += getSpriteWithBall(mon.species, 40);
		buf += `<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:500">${spName}</span> <span style="font-size:10px;color:#888">Lv. ${mon.level}</span>`;
		if (mon.heldItem) {
			const held = Dex.items.get(mon.heldItem);
			buf += `<div style="font-size:9px;color:#8ab4f8">Holds: ${Utils.escapeHTML(held.name || mon.heldItem)}</div>`;
		}
		buf += `</div>`;
		buf += `<button name="send" value="/pokerogue giveitem ${i + 1}" class="pr-pick-btn">Give</button>`;
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue giveitem skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Cancel <small style="color:#888">(refund)</small></button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Pending: Consumable item (heal/revive/cure)
// ---------------------------------------------------------------------------
function renderConsumable(state: PokeRogueState): string {
	const consumableKey = state.purchasedItem!;
	const consumableItem = SHOP_ITEMS[consumableKey] ?? ROTATIONAL_ITEM_POOL[consumableKey];
	const consumableType = state.pendingConsumableType!;

	let buf = `<h2 class="pr-choice-heading">Use ${Utils.escapeHTML(consumableItem?.name ?? consumableKey)}?</h2>`;
	buf += `<div style="font-size:12px;color:#aaa;margin-bottom:8px">Choose a Pokémon:</div>`;
	buf += `<div class="pr-choice-grid">`;

	for (let i = 0; i < state.team.length; i++) {
		const mon = state.team[i];
		const hp = mon.currentHp ?? 100;
		let disabled = false;
		let reason = '';

		switch (consumableType) {
		case 'healHP':
			disabled = hp >= 100 || hp <= 0;
			reason = hp <= 0 ? 'fainted' : hp >= 100 ? 'full HP' : '';
			break;
		case 'healPP': {
			const allFull = (mon.ppLeft ?? []).every((v, idx) => {
				const max = Math.floor((Dex.moves.get(mon.moves[idx]).pp ?? 5) * (8 / 5));
				return v >= max;
			});
			disabled = allFull || hp <= 0;
			reason = hp <= 0 ? 'fainted' : allFull ? 'PP full' : '';
			break;
		}
		case 'revive':
			disabled = hp > 0;
			reason = hp > 0 ? 'not fainted' : '';
			break;
		case 'cureStatus':
			disabled = !mon.status || hp <= 0;
			reason = hp <= 0 ? 'fainted' : !mon.status ? 'no status' : '';
			break;
		}

		const spName = Dex.species.get(toID(mon.species)).name;
		buf += `<div class="pr-choice-row" style="${disabled ? 'opacity:.45' : ''}">`;
		buf += getSpriteWithBall(mon.species, 40);
		buf += `<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:500">${spName}</span> <span style="font-size:10px;color:#888">Lv. ${mon.level}${reason ? ` (${reason})` : ''}</span>`;
		if (mon.status) buf += `<div style="font-size:9px;color:#ff9800">${mon.status.toUpperCase()}</div>`;
		if (hp < 100 && hp > 0) buf += `<div style="font-size:9px;color:#aaa">${hp}% HP</div>`;
		buf += `</div>`;
		if (!disabled) {
			buf += `<button name="send" value="/pokerogue useshopitem ${i + 1}" class="pr-pick-btn">Use</button>`;
		}
		buf += `</div>`;
	}
	buf += `<button name="send" value="/pokerogue useshopitem skip" class="pr-btn" style="width:100%;padding:8px;margin-top:2px">Cancel</button>`;
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Header bar
// ---------------------------------------------------------------------------
function renderHeader(view: string, hasGameOver: boolean): string {
	const titles: Record<string, string> = {
		main: 'PokéRogue', shop: 'Shop', bag: 'Bag', top: 'Leaderboard',
		resetconfirm: 'Reset run', devtools: 'Developer Tools',
	};
	const title = titles[view] ?? 'PokéRogue';
	let buf = `<div class="pr-header"><h2>${title}</h2>`;
	if (view !== 'main' && !hasGameOver) {
		buf += `<button name="send" value="/pokerogue view main" class="pr-btn" style="font-size:11px;padding:5px 10px">← Back</button>`;
	}
	buf += `</div>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
function renderAccessDenied(): string {
	let buf = `<div style="text-align:center;padding:40px 14px">`;
	buf += `<div style="font-size:24px;font-weight:bold;color:#f87171;margin-bottom:12px">Access Denied</div>`;
	buf += `<div style="color:#aaa;font-size:14px;margin-bottom:24px">You do not have permission to view the Developer Tools.</div>`;
	buf += `<button name="send" value="/pokerogue view main" class="pr-btn primary" style="padding:10px 20px">Return to Game</button>`;
	buf += `</div>`;
	return buf;
}

function renderDevToolsView(state: PokeRogueState): string {
	let buf = `<div class="pr-section-title">Developer Tools</div>`;
	buf += `<div style="font-size:12px;color:#aaa;margin-bottom:12px">Warning: These tools modify your state directly and can break your run.</div>`;

	buf += `<div class="pr-actions" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">`;

	// Currency / Progression
	buf += `<button name="send" value="/pokerogue dev addbp 50" class="pr-btn">+50 BP</button>`;
	buf += `<button name="send" value="/pokerogue dev addbp 1000" class="pr-btn">+1000 BP</button>`;
	buf += `<button name="send" value="/pokerogue dev floor next" class="pr-btn">Next Floor</button>`;
	buf += `<button name="send" value="/pokerogue dev floor boss" class="pr-btn">Next Boss</button>`;
	buf += `<button name="send" value="/pokerogue dev streak +5" class="pr-btn">+5 Streak</button>`;

	// Team Modifiers
	buf += `<button name="send" value="/pokerogue dev team heal" class="pr-btn" style="color:#4caf50;border-color:#4caf50">Heal Team</button>`;
	buf += `<button name="send" value="/pokerogue dev team level 1" class="pr-btn">+1 Level (All)</button>`;
	buf += `<button name="send" value="/pokerogue dev team level 10" class="pr-btn">+10 Levels (All)</button>`;
	buf += `<button name="send" value="/pokerogue dev team exp 500" class="pr-btn">+500 EXP (All)</button>`;

	// Key Items
	buf += `<button name="send" value="/pokerogue dev keyitem Exp. All" class="pr-btn">Give Exp. All</button>`;
	buf += `<button name="send" value="/pokerogue dev keyitem Shiny Charm" class="pr-btn">Give Shiny Charm</button>`;

	// Custom Commands Prompts (Uses PS prompt system or text commands)
	buf += `<button name="send" value="/pokerogue dev prompt addmon" class="pr-btn" style="color:#c4a8ff;border-color:#c4a8ff">Add Specific Mon</button>`;
	buf += `<button name="send" value="/pokerogue dev prompt giveitem" class="pr-btn" style="color:#c4a8ff;border-color:#c4a8ff">Give Specific Item</button>`;

	// Dangerous
	buf += `<button name="send" value="/pokerogue dev wipe" class="pr-btn danger" style="grid-column:1 / span 2">Wipe Data</button>`;

	buf += `</div>`;

	return buf;
}

export function renderGamePage(state: PokeRogueState, user: User): string {
	const view = (state as any).view || 'main';

	// Handle access denied for devtools
	if (view === 'devtools' && !user.can('lock')) {
		let buf = `<div class="pr">`;
		buf += renderHeader('devtools', false);
		buf += renderAccessDenied();
		buf += `</div>`;
		return buf;
	}

	let buf = '';

	// Auto-refresh during battles or when a notification is pending
	if (state.battleRoomId || state.notification) {
		buf += `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">`;
	}

	buf += `<div class="pr">`;

	// ── Game Over ──────────────────────────────────────────────────────────
	if (state.gameOver) {
		buf += renderHeader('main', true);
		buf += `<div style="padding:0 14px 14px">`;
		buf += renderGameOverView(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Reset confirm ──────────────────────────────────────────────────────
	if (view === 'resetconfirm') {
		buf += renderHeader('resetconfirm', false);
		buf += `<div style="padding:0 14px 14px">`;
		buf += renderResetConfirmView(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Leaderboard ────────────────────────────────────────────────────────
	if (view === 'top') {
		buf += renderHeader('top', false);
		buf += `<div style="padding:0 14px 14px">`;
		buf += renderTopView();
		buf += `</div></div>`;
		return buf;
	}

	// ── Header + notification (all remaining views) ────────────────────────
	buf += renderHeader(view, false);
	buf += `<div style="padding:0 14px 14px">`;
	buf += renderNotification(state);

	// ── Pending: starter / add choice ─────────────────────────────────────
	if (state.pendingChoice?.length) {
		buf += renderPendingChoice(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: swap Pokémon ──────────────────────────────────────────────
	if (state.pendingSwap) {
		buf += renderPendingSwap(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: learn move ────────────────────────────────────────────────
	if (state.pendingMoves?.length) {
		buf += renderPendingMoves(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: teach TM ─────────────────────────────────────────────────
	if (state.moveToLearn && state.purchasedItem && state.pokemonForTM === undefined) {
		buf += renderTeachTM(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: item pack pick ────────────────────────────────────────────
	if (state.itemOptions?.length) {
		buf += renderItemOptions(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: give item ────────────────────────────────────────────────
	if (state.pendingItemName) {
		buf += renderGiveItem(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Pending: consumable (heal/revive/cure) ────────────────────────────
	if (state.pendingConsumableType && state.purchasedItem) {
		buf += renderConsumable(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Named views ───────────────────────────────────────────────────────
	if (view === 'shop') {
		buf += renderShopView(state);
		buf += `</div></div>`;
		return buf;
	}

	if (view === 'bag') {
		buf += renderBagView(state);
		buf += `</div></div>`;
		return buf;
	}

	if (view === 'devtools') {
		buf += renderDevToolsView(state);
		buf += `</div></div>`;
		return buf;
	}

	// ── Main ──────────────────────────────────────────────────────────────
	buf += renderMainView(state, user);
	buf += `</div></div>`;
	return buf;
}
