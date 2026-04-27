/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue Render
 *   Made by: @TurboRx
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
	return `<img src="${src}"${onerror} width="${size}" height="${size}" alt="${altName} sprite" style="image-rendering:pixelated" />`;
}

function getShopItemIcon(icon: string, size = 24): string {
	const url = `https://www.smogon.com/forums/media/minisprites/${itemURLFormat(icon)}.png`;
	return `<img src="${Utils.escapeHTML(url)}" width="${size}" height="${size}" style="image-rendering:pixelated;vertical-align:middle" onerror="this.style.display='none'" />`;
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
	return `<div class="pr-sprite-wrap" style="width:${size}px;height:${size}px">` +
		getSprite(species, size) +
		`<img src="${ball.src}" alt="${Utils.escapeHTML(ball.alt)}" class="pr-pokeball-overlay" />` +
		`</div>`;
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
	return `<div class="pr-hpbar"><div class="pr-hpbar-fill" style="width:${hpPct}%;background:${color}"></div></div>` +
		`<span style="font-size:9px;color:#aaa">${hpPct}% HP</span>`;
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
		`<span style="background:#${typeColor(t)};color:#fff;border-radius:${large ? '4px' : '3px'};padding:${large ? '2px 6px' : '1px 5px'};font-size:${large ? '10px' : '9px'};font-weight:bold">${t}</span>`
	).join(' ');
}

// ---------------------------------------------------------------------------
// Shop rendering helpers
// ---------------------------------------------------------------------------

/**
 * Renders one shop table (permanent or rotational).
 * `items` is an array of [key, item] pairs already filtered to streak level.
 */
function renderShopTable(
	items: Array<[string, typeof SHOP_ITEMS[string] | typeof ROTATIONAL_ITEM_POOL[string]]>,
	bp: number,
	keyItems: string[],
	cmd: string, // e.g. "pokerogue buy"
): string {
	let buf = `<table style="width:100%;border-collapse:collapse;font-size:11px" border="1">`;
	buf += `<tr><th>Item</th><th>Description</th><th>Price</th><th></th></tr>`;
	for (const [key, item] of items) {
		buf += `<tr>`;
		buf += `<td style="padding:3px 5px;white-space:nowrap">${getShopItemIcon(item.icon)} ${Utils.escapeHTML(item.name)}</td>`;
		buf += `<td style="padding:3px 5px;color:#ccc;font-size:10px">${Utils.escapeHTML(item.desc)}</td>`;
		buf += `<td style="padding:3px 5px;text-align:center;white-space:nowrap">${item.cost} BP</td>`;

		const isKey = (item as any).type === 'key';
		const alreadyHas = isKey && keyItems.includes(item.name);
		if (alreadyHas) {
			buf += `<td style="padding:3px 5px"><button class="button" disabled>Owned</button></td>`;
		} else if (item.cost > bp) {
			buf += `<td style="padding:3px 5px"><button class="button" disabled>Need BP</button></td>`;
		} else {
			buf += `<td style="padding:3px 5px"><button name="send" value="/${cmd} ${key}" class="button pr-pick-btn">Buy</button></td>`;
		}
		buf += `</tr>`;
	}
	buf += `</table>`;
	return buf;
}

// ---------------------------------------------------------------------------
// Main page renderer
// ---------------------------------------------------------------------------

export function renderGamePage(state: PokeRogueState): string {
	const view = (state as any).view || 'main';
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	buf += `<div class="pr-popup-header"><h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main' && !state.gameOver) buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back</button>`;
	buf += `</div>`;

	// ── Game Over ──────────────────────────────────────────────────────────
	if (state.gameOver) {
		buf += `<div class="pr-gameover" style="text-align:center;padding:20px">`;
		buf += `<div style="font-size:24px;color:#ff8080;font-weight:bold;margin-bottom:15px">GAME OVER</div>`;
		buf += `<div style="margin-bottom:20px;color:#8ab4f8">Your run has ended. Floor: <b>${state.lastRunFloor || 1}</b></div>`;
		buf += `<button name="send" value="/pokerogue newgame confirm" class="button pr-newrun-btn" style="padding:10px 20px;font-size:16px">Start New Run</button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Reset confirm ──────────────────────────────────────────────────────
	if (view === 'resetconfirm') {
		buf += `<div style="text-align:center;padding:24px 16px">`;
		buf += `<div style="font-size:18px;color:#ff8080;font-weight:bold;margin-bottom:12px">Reset Run?</div>`;
		buf += `<div style="color:#aaa;margin-bottom:20px">This will permanently end your current run on Floor <b>${state.floor}</b>. Are you sure?</div>`;
		buf += `<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">`;
		buf += `<button name="send" value="/pokerogue quit" class="button" style="background:linear-gradient(135deg,#7f1d1d,#991b1b);color:#fff;border:1px solid #ef4444;padding:8px 20px">Yes, Reset Run</button>`;
		buf += `<button name="send" value="/pokerogue view main" class="button" style="padding:8px 20px">Cancel</button>`;
		buf += `</div></div></div>`;
		return buf;
	}

	// ── Leaderboard ────────────────────────────────────────────────────────
	if (view === 'top') {
		const entries = Object.entries(savedData)
			.filter(([, s]) => (s.highestFloor ?? 0) > 0)
			.sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0))
			.slice(0, 100);
		if (!entries.length) return buf + '<em>No records yet!</em></div>';
		const rows = entries.map(([userid, s], i) => {
			const displayTeam = s.recordTeam?.length ? s.recordTeam : s.team;
			const teamStr = (displayTeam ?? []).map((m: PokemonEntry) => getSprite(m.species, 30)).join(' ');
			return [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, teamStr];
		});
		return buf + Table('PokéRogue Top 100', ['#', 'Player', 'Best Floor', 'Last Team'], rows) + `</div>`;
	}

	// ── Notification banner ────────────────────────────────────────────────
	if (state.notification) {
		buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;
	}

	if (state.battleRoomId) {
		return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;
	}

	// ── Starter / Pokémon choice ───────────────────────────────────────────
	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<table class="pr-choice-table" style="width:100%"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const sp = Dex.species.get(toID(state.pendingChoice[i]));
			const isLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
			const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const abilities = sp.abilities ?? {};
			const ability = (abilities as unknown as Record<string, string>)['0'] || 'Unknown';
			buf += `<tr class="pr-choice-row${isLeg ? ' legendary' : ''}">`;
			buf += `<td class="pr-ct-status">${getSpriteWithBall(sp.id, 64)}${isLeg ? '<div class="pr-legendary-badge">LEGENDARY</div>' : ''}</td>`;
			buf += `<td class="pr-ct-info">`;
			buf += `<div class="pr-ct-name">${sp.name}</div>`;
			buf += `<div style="margin-bottom:4px">${renderTypeBadge(sp.types ?? [])}</div>`;
			buf += `<div class="pr-ct-stats">`;
			for (const [stat, val] of Object.entries(bs)) {
				buf += `<span>${stat.toUpperCase()} <b>${val}</b></span>`;
			}
			buf += `</div>`;
			buf += `<div class="pr-ct-ability">Ability: <b>${Utils.escapeHTML(ability)}</b></div>`;
			buf += `</td>`;
			buf += `<td class="pr-ct-action"><button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">Pick</button></td>`;
			buf += `</tr>`;
		}
		return buf + `</tbody></table></div>`;
	}

	// ── Team swap UI ───────────────────────────────────────────────────────
	if (state.pendingSwap) {
		const sp = Dex.species.get(toID(state.pendingSwap.species));
		buf += `<h2 class="pr-choice-heading">Your team is full!</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px">${getSpriteWithBall(sp.id, 80)}<br><b>Lv. ${state.pendingSwap.level}</b> wants to join your team!<br>Choose a Pokémon to replace:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			buf += `<button name="send" value="/pokerogue swapmon ${i + 1}" class="button" style="text-align:left;padding:8px;display:flex;align-items:center">`;
			buf += `${getSprite(mon.species, 40)} <span style="margin-left:10px"><b>Replace</b> <small>(Lv. ${mon.level})</small></span></button>`;
		}
		buf += `<button name="send" value="/pokerogue swapmon skip" class="button" style="padding:8px;margin-top:8px"><b>Keep current team</b> <small>(Discard new Pokémon)</small></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Move learning UI ───────────────────────────────────────────────────
	if (state.pendingMoves?.length) {
		const pending = state.pendingMoves[0];
		const mon = state.team[pending.pokemonIndex];
		const sp = Dex.species.get(toID(mon.species));
		const newMove = Dex.moves.get(pending.move);
		buf += `<h2 class="pr-choice-heading">New Move!</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px">${getSpriteWithBall(sp.id, 80)}<br>wants to learn <b>${newMove.name}</b>!<br>It already knows 4 moves. Choose a move to forget:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < mon.moves.length; i++) {
			const oldMove = Dex.moves.get(mon.moves[i]);
			buf += `<button name="send" value="/pokerogue learnmove ${i + 1}" class="button" style="text-align:left;padding:8px">`;
			buf += `<b>Forget:</b> ${oldMove.name} <small>(Type: ${oldMove.type} | BP: ${oldMove.basePower || '-'})</small></button>`;
		}
		buf += `<button name="send" value="/pokerogue learnmove skip" class="button" style="padding:8px;margin-top:8px"><b>Keep old moves</b> <small>(Give up learning ${newMove.name})</small></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── TM: choose which Pokémon to teach ─────────────────────────────────
	// FIX: was `!state.pokemonForTM !== undefined` which is always true.
	// Correct check: only show this screen when pokemonForTM has NOT been set yet.
	if (state.moveToLearn && state.purchasedItem && state.pokemonForTM === undefined) {
		const moveName = Dex.moves.get(state.moveToLearn).name;
		buf += `<h2 class="pr-choice-heading">Teach ${Utils.escapeHTML(moveName)}?</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px;color:#ccc">Choose a Pokémon to teach <b>${Utils.escapeHTML(moveName)}</b> to:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const canLearn = Dex.species.getFullLearnset(toID(mon.species))
				.some(l => Object.keys(l.learnset ?? {}).includes(toID(state.moveToLearn!)));
			const alreadyKnows = mon.moves.includes(state.moveToLearn);
			const disabled = !canLearn || alreadyKnows;
			if (disabled) {
				buf += `<button class="button" disabled style="padding:8px;text-align:left;opacity:0.5">${getSprite(mon.species, 36)} <span style="margin-left:8px">${Dex.species.get(toID(mon.species)).name} Lv.${mon.level} ${alreadyKnows ? '(already knows)' : '(cannot learn)'}</span></button>`;
			} else {
				buf += `<button name="send" value="/pokerogue teachtm ${i + 1}" class="button" style="padding:8px;text-align:left">${getSprite(mon.species, 36)} <span style="margin-left:8px">${Dex.species.get(toID(mon.species)).name} Lv.${mon.level}</span></button>`;
			}
		}
		buf += `<button name="send" value="/pokerogue teachtm skip" class="button" style="padding:8px;margin-top:8px"><b>Cancel</b> <small>(refund purchase)</small></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Item pack: choose which item to take ──────────────────────────────
	if (state.itemOptions?.length) {
		buf += `<h2 class="pr-choice-heading">Choose an Item!</h2>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (const itemName of state.itemOptions) {
			const dexItem = Dex.items.get(itemName);
			buf += `<button name="send" value="/pokerogue pickitem ${toID(itemName)}" class="button" style="padding:8px;text-align:left">`;
			buf += `${getShopItemIcon(itemURLFormat(itemName), 28)} <b>${Utils.escapeHTML(dexItem.name || itemName)}</b></button>`;
		}
		buf += `<button name="send" value="/pokerogue pickitem skip" class="button" style="padding:8px;margin-top:8px"><b>Skip</b></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Item: choose which Pokémon to give it to ──────────────────────────
	if (state.pendingItemName) {
		const dexItem = Dex.items.get(state.pendingItemName);
		buf += `<h2 class="pr-choice-heading">Give ${Utils.escapeHTML(dexItem.name || state.pendingItemName)}?</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px;color:#ccc">Choose a Pokémon to give it to:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			buf += `<button name="send" value="/pokerogue giveitem ${i + 1}" class="button" style="padding:8px;text-align:left">${getSprite(mon.species, 36)} <span style="margin-left:8px">${Dex.species.get(toID(mon.species)).name} Lv.${mon.level}${mon.heldItem ? ` (holds: ${mon.heldItem})` : ''}</span></button>`;
		}
		buf += `<button name="send" value="/pokerogue giveitem skip" class="button" style="padding:8px;margin-top:8px"><b>Cancel</b> <small>(refund purchase)</small></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Consumable item: choose which Pokémon to use it on ───────────────
	if (state.pendingConsumableType && state.purchasedItem) {
		const consumableKey = state.purchasedItem;
		const consumableItem = SHOP_ITEMS[consumableKey] ?? ROTATIONAL_ITEM_POOL[consumableKey];
		const consumableType = state.pendingConsumableType;
		const typeLabels: Record<string, string> = {
			healHP: 'Restore HP',
			healPP: 'Restore PP',
			revive: 'Revive',
			cureStatus: 'Cure Status',
		};
		buf += `<h2 class="pr-choice-heading">Use ${Utils.escapeHTML(consumableItem?.name ?? consumableKey)}?</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px;color:#ccc">Choose a Pokémon:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const hp = mon.currentHp ?? 100;
			let disabled = false;
			let reason = '';
			switch (consumableType) {
			case 'healHP':
				disabled = hp >= 100 || hp <= 0;
				reason = hp <= 0 ? '(fainted)' : '(full HP)';
				break;
			case 'healPP': {
				const allFull = (mon.ppLeft ?? []).every((v, idx) => {
					const max = Math.floor((Dex.moves.get(mon.moves[idx]).pp ?? 5) * (8 / 5));
					return v >= max;
				});
				disabled = allFull || hp <= 0;
				reason = hp <= 0 ? '(fainted)' : allFull ? '(PP full)' : '';
				break;
			}
			case 'revive':
				disabled = hp > 0;
				reason = hp > 0 ? '(not fainted)' : '';
				break;
			case 'cureStatus':
				disabled = !mon.status || hp <= 0;
				reason = hp <= 0 ? '(fainted)' : !mon.status ? '(no status)' : '';
				break;
			}
			const spName = Dex.species.get(toID(mon.species)).name;
			if (disabled) {
				buf += `<button class="button" disabled style="padding:8px;text-align:left;opacity:0.5">${getSprite(mon.species, 36)} <span style="margin-left:8px">${Utils.escapeHTML(spName)} Lv.${mon.level} ${reason}</span></button>`;
			} else {
				buf += `<button name="send" value="/pokerogue useshopitem ${i + 1}" class="button" style="padding:8px;text-align:left">${getSprite(mon.species, 36)} <span style="margin-left:8px">${Utils.escapeHTML(spName)} Lv.${mon.level}${mon.status ? ` [${mon.status.toUpperCase()}]` : ''}${hp < 100 ? ` (${hp}% HP)` : ''}</span></button>`;
			}
		}
		buf += `<button name="send" value="/pokerogue useshopitem skip" class="button" style="padding:8px;margin-top:8px"><b>Cancel</b></button>`;
		buf += `</div></div>`;
		return buf;
	}

	// ── Shop view ──────────────────────────────────────────────────────────
	if (view === 'shop') {
		const bp = state.battlePoints ?? 0;
		const streak = state.streaksWon ?? 0;
		const timesRerolled = state.timesRerolled ?? 0;
		const rerollCost = 2 + timesRerolled;

		buf += `<div style="margin-bottom:8px"><b>BP:</b> ${bp} &nbsp;|&nbsp; <b>Streak:</b> ${streak}</div>`;

		// --- Rotational shop ---
		if (state.rotationalShop?.length) {
			buf += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">`;
			buf += `<b style="color:#c4a8ff">Current Deals</b>`;
			if (rerollCost > bp) {
				buf += `<button class="button" disabled style="font-size:10px">Reroll (${rerollCost} BP) — not enough!</button>`;
			} else {
				buf += `<button name="send" value="/pokerogue reroll" class="button" style="font-size:10px">Reroll Shop (${rerollCost} BP)</button>`;
			}
			buf += `</div>`;

			const rotItems = state.rotationalShop
				.map(key => [key, ROTATIONAL_ITEM_POOL[key]] as [string, typeof ROTATIONAL_ITEM_POOL[string]])
				.filter(([, item]) => item && item.minStreak <= streak);

			buf += renderShopTable(rotItems, bp, state.keyItems ?? [], 'pokerogue buy');
			buf += `<br>`;
		}

		// --- Permanent shop ---
		buf += `<b style="color:#8ab4f8">Always Available</b>`;
		const permItems = Object.entries(SHOP_ITEMS)
			.filter(([, item]) => item.minStreak <= streak) as Array<[string, typeof SHOP_ITEMS[string]]>;
		buf += renderShopTable(permItems, bp, state.keyItems ?? [], 'pokerogue buy');

		return buf + `<div style="margin-top:8px"><button name="send" value="/pokerogue view main" class="button">Back</button></div></div>`;
	}

	// ── Bag view ───────────────────────────────────────────────────────────
	if (view === 'bag') {
		buf += `<h3 style="margin:0">Manage Team Items</h3>`;
		buf += `<div class="pr-popup-team" style="margin-top:10px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const spBag = Dex.species.get(toID(mon.species));
			buf += `<div class="pr-popup-mon" style="align-items:center">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
			buf += `<span style="font-size:11px;font-weight:bold;color:#e0d4ff">${spBag.name}</span> <span style="font-size:9px">${renderTypeBadge(spBag.types ?? [])}</span><br>`;
			buf += `<span style="font-size:10px;color:#aaa">Lv.${mon.level}</span><br>`;
			if (mon.heldItem) {
				const dexHeld = Dex.items.get(mon.heldItem);
				buf += `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.2);padding:2px 4px;border-radius:4px;margin-top:4px">`;
				buf += `<span style="font-size:10px;color:#8ab4f8">${Utils.escapeHTML(dexHeld.name || mon.heldItem)}</span>`;
				buf += `<button name="send" value="/pokerogue unequip ${i + 1}" class="button" style="font-size:9px;padding:2px 4px">Take</button>`;
				buf += `</div>`;
			} else {
				buf += `<div style="font-size:10px;color:#888;margin-top:4px">No Item</div>`;
			}
			buf += `</div></div>`;
		}
		buf += `</div></div>`;
		return buf;
	}

	// ── Main view ──────────────────────────────────────────────────────────
	buf += `<div class="pr-popup-stats">Floor <b>${state.floor}</b> | BP <b>${state.battlePoints ?? 0}</b> | Streaks <b>${state.streaksWon ?? 0}</b></div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const expNeeded = mon.level < 999 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const spData = Dex.species.get(toID(mon.species));
		buf += `<div class="pr-popup-mon" style="align-items:center">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:bold;color:#e0d4ff">${spData.name}</span> `;
		buf += `<span style="font-size:9px">${renderTypeBadge(spData.types ?? [])}</span><br>`;
		buf += `<span style="font-size:11px">Lv.${mon.level} <small style="color:#888">(${expNeeded} EXP)</small></span>`;
		buf += renderExpBar(mon);
		buf += renderHpBar(mon);
		if (mon.heldItem) {
			const dexHeld = Dex.items.get(mon.heldItem);
			buf += `<br><span style="font-size:10px;color:#8ab4f8">${Utils.escapeHTML(dexHeld.name || mon.heldItem)}</span>`;
		}
		buf += `</div></div>`;
	}
	buf += `</div>`;

	buf += `<div class="pr-popup-actions" style="margin-top:12px;display:flex;gap:6px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button" style="flex:1.5">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view bag" class="button" style="flex:1">Bag</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button" style="flex:1">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button" style="flex:1">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue view resetconfirm" class="button" style="color:#ff8080;flex:1">Reset Run</button>`;
	buf += `</div>`;

	return buf + `</div>`;
}
