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
import { SHOP_ITEMS, rollShopInventory } from './pokerogue-items';
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

// Item sprites served from PS item icon CDN: play.pokemonshowdown.com/sprites/itemicons/{id}.png
const PS_ITEM_SPRITE_BASE = 'https://play.pokemonshowdown.com/sprites/itemicons/';

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	// Use spriteid from Dex for reliable form/regional variant URLs (e.g. ponyta-galar, meowstic-f)
	const spriteId = (sp.exists && sp.spriteid) ? sp.spriteid : id;
	let src: string;
	let fallback1: string | null = null;
	let fallback2: string | null = null;
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

function getItemSprite(itemId: string): string {
	const id = toID(itemId);
	const initial = Utils.escapeHTML(id.substring(0, 2).toUpperCase());
	const src = `${PS_ITEM_SPRITE_BASE}${encodeURIComponent(id)}.png`;
	return `<div class="pr-shop-item-icon">` +
		`<img src="${src}" alt="${Utils.escapeHTML(id)}" ` +
		`onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex'" />` +
		`<span style="display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:11px;font-weight:bold;color:#c4a8ff">${initial}</span>` +
		`</div>`;
}

function getPokeballInfo(speciesId: string): { src: string, alt: string } {
	const sp = Dex.species.get(toID(speciesId));
	if (sp.tags?.some(tag => LEGENDARY_TAGS.has(tag))) {
		return { src: `${PS_ITEM_SPRITE_BASE}masterball.png`, alt: 'Master Ball' };
	}
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		if (bst >= 580) return { src: `${PS_ITEM_SPRITE_BASE}ultraball.png`, alt: 'Ultra Ball' };
		if (bst >= 480) return { src: `${PS_ITEM_SPRITE_BASE}greatball.png`, alt: 'Great Ball' };
	}
	return { src: `${PS_ITEM_SPRITE_BASE}pokeball.png`, alt: 'Poké Ball' };
}

export function getSpriteWithBall(species: string, size = 80): string {
	const ball = getPokeballInfo(species);
	const spriteHtml = getSprite(species, size);
	return `<div class="pr-sprite-wrap" style="width:${size}px;height:${size}px">` +
		spriteHtml +
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
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129', Electric: 'fac000', Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb',
		Ground: '915121', Flying: '81b9ef', Psychic: 'ef4179', Bug: '91a119', Rock: 'afa981', Ghost: '704170', Dragon: '5060e1', Dark: '624d4e',
		Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return colors[type] ?? '68a090';
}

export function renderTypeBadge(types: string[], large = false): string {
	return types.map(t => `<span style="background:#${typeColor(t)};color:#fff;border-radius:${large ? '4px' : '3px'};padding:${large ? '2px 6px' : '1px 5px'};font-size:${large ? '10px' : '9px'};font-weight:bold">${t}</span>`).join(' ');
}

export function renderGamePage(state: PokeRogueState): string {
	const view = (state as any).view || 'main';
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	buf += `<div class="pr-popup-header"><h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main' && !state.gameOver) buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back</button>`;
	buf += `</div>`;

	if (state.gameOver) {
		buf += `<div class="pr-gameover" style="text-align:center;padding:20px">`;
		buf += `<div class="pr-gameover-title" style="font-size:24px;color:#ff8080;font-weight:bold;margin-bottom:15px">GAME OVER</div>`;
		buf += `<div style="margin-bottom:20px;color:#8ab4f8">Your run has ended. Floor: <b>${state.lastRunFloor || 1}</b></div>`;
		buf += `<button name="send" value="/pokerogue newgame confirm" class="button pr-newrun-btn" style="padding:10px 20px;font-size:16px">Start New Run</button>`;
		buf += `</div></div>`;
		return buf;
	}

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

	if (view === 'top') {
		const entries = Object.entries(savedData).filter(([, s]) => (s.highestFloor ?? 0) > 0).sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0)).slice(0, 100);
		if (!entries.length) return buf + '<em>No records yet!</em></div>';
		const rows = entries.map(([userid, s], i) => {
			const displayTeam = s.recordTeam?.length ? s.recordTeam : s.team;
			const teamStr = (displayTeam ?? []).map((m: PokemonEntry) => `${getSprite(m.species, 30)}`).join(' ');
			return [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, teamStr];
		});
		return buf + Table('PokéRogue Top 100', ['#', 'Player', 'Best Floor', 'Last Team'], rows) + `</div>`;
	}

	if (state.notification) buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;

	if (state.pendingGachaOffer) {
		const sp = Dex.species.get(toID(state.pendingGachaOffer.species));
		const types: string[] = sp.types ?? [];
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const isLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
		const sourceItem = SHOP_ITEMS[state.pendingGachaOffer.sourceItemId];
		const tierLabel = state.pendingGachaOffer.isFeatured ? 'Featured Pull!' : 'Off-Banner Pull';
		const tierColor = isLeg ? '#f5c518' : state.pendingGachaOffer.isFeatured ? '#c4a8ff' : '#8ab4f8';
		buf += `<div class="pr-gacha-offer">`;
		buf += `<div class="pr-gacha-offer-header">`;
		buf += `<span class="pr-gacha-ball-label">${sourceItem?.name || 'Capsule'} Result!</span>`;
		buf += `<span class="pr-gacha-tier-badge" style="color:${tierColor}">${tierLabel}</span>`;
		buf += `</div>`;
		buf += `<div class="pr-gacha-offer-body">`;
		buf += getSpriteWithBall(sp.id, 80);
		buf += `<div class="pr-gacha-offer-info">`;
		buf += `<div class="pr-gacha-mon-name">${Utils.escapeHTML(sp.name)}</div>`;
		buf += `<div style="margin:4px 0">${renderTypeBadge(types, true)}</div>`;
		buf += `<div class="pr-ct-stats" style="margin-top:6px">`;
		buf += `<span>HP <b>${bs.hp}</b></span><span>Atk <b>${bs.atk}</b></span><span>Def <b>${bs.def}</b></span>`;
		buf += `<span>SpA <b>${bs.spa}</b></span><span>SpD <b>${bs.spd}</b></span><span>Spe <b>${bs.spe}</b></span>`;
		buf += `</div>`;
		buf += `<div class="pr-gacha-offer-actions">`;
		buf += `<button name="send" value="/pokerogue acceptgacha" class="button pr-gacha-accept-btn">Add to Team</button>`;
		buf += `<button name="send" value="/pokerogue declinegacha" class="button pr-gacha-decline-btn">Decline</button>`;
		buf += `</div></div></div></div>`;
		return buf + `</div>`;
	}

	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<table class="pr-choice-table" style="width:100%;"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const sp = Dex.species.get(toID(state.pendingChoice[i]));
			const isLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
			const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const abilities = sp.abilities ?? {};
			const ability = (abilities as unknown as Record<string, string>)['0'] || 'Unknown';
			const types: string[] = sp.types ?? [];
			buf += `<tr class="pr-choice-row${isLeg ? ' legendary' : ''}">`;
			buf += `<td class="pr-ct-status">${getSpriteWithBall(sp.id, 64)}`;
			if (isLeg) buf += `<div class="pr-legendary-badge">LEGENDARY</div>`;
			buf += `</td>`;
			buf += `<td class="pr-ct-info">`;
			buf += `<div class="pr-ct-name">${sp.name}</div>`;
			buf += `<div style="margin-bottom:4px">${renderTypeBadge(types)}</div>`;
			buf += `<div class="pr-ct-stats">`;
			buf += `<span>HP <b>${bs.hp}</b></span>`;
			buf += `<span>Atk <b>${bs.atk}</b></span>`;
			buf += `<span>Def <b>${bs.def}</b></span>`;
			buf += `<span>SpA <b>${bs.spa}</b></span>`;
			buf += `<span>SpD <b>${bs.spd}</b></span>`;
			buf += `<span>Spe <b>${bs.spe}</b></span>`;
			buf += `</div>`;
			buf += `<div class="pr-ct-ability">Ability: <b>${Utils.escapeHTML(ability)}</b></div>`;
			buf += `</td>`;
			buf += `<td class="pr-ct-action"><button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">Pick</button></td>`;
			buf += `</tr>`;
		}
		return buf + `</tbody></table></div>`;
	}

	// --- TEAM SWAP UI ---
	if (state.pendingSwap) {
		const newMon = state.pendingSwap;
		const sp = Dex.species.get(toID(newMon.species));

		buf += `<h2 class="pr-choice-heading">Your team is full!</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px;">${getSpriteWithBall(sp.id, 80)}<br><b>Lv. ${newMon.level}</b> wants to join your team!<br>Choose a Pokémon to replace:</div>`;

		buf += `<div style="display:flex; flex-direction:column; gap:6px;">`;

		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			buf += `<button name="send" value="/pokerogue swapmon ${i + 1}" class="button" style="text-align:left; padding:8px; display:flex; align-items:center;">`;
			buf += `${getSprite(mon.species, 40)} <span style="margin-left: 10px;"><b>Replace</b> <small>(Lv. ${mon.level})</small></span></button>`;
		}

		buf += `<button name="send" value="/pokerogue swapmon skip" class="button" style="text-align:center; padding:8px; margin-top:8px;">`;
		buf += `<b>Keep current team</b> <small>(Discard new Pokémon)</small></button>`;

		buf += `</div></div>`;
		return buf;
	}

	// --- MOVE LEARNING UI ---
	if (state.pendingMoves && state.pendingMoves.length > 0) {
		const pending = state.pendingMoves[0];
		const mon = state.team[pending.pokemonIndex];
		const sp = Dex.species.get(toID(mon.species));
		const newMove = Dex.moves.get(pending.move);

		buf += `<h2 class="pr-choice-heading">New Move!</h2>`;
		buf += `<div style="text-align:center;margin-bottom:10px;">${getSpriteWithBall(sp.id, 80)}<br>wants to learn <b>${newMove.name}</b>!<br>It already knows 4 moves. Choose a move to forget:</div>`;

		buf += `<div style="display:flex; flex-direction:column; gap:6px;">`;

		for (let i = 0; i < mon.moves.length; i++) {
			const oldMove = Dex.moves.get(mon.moves[i]);
			buf += `<button name="send" value="/pokerogue learnmove ${i + 1}" class="button" style="text-align:left; padding:8px;">`;
			buf += `<b>Forget:</b> ${oldMove.name} <small>(Type: ${oldMove.type} | BP: ${oldMove.basePower || '-'})</small></button>`;
		}

		buf += `<button name="send" value="/pokerogue learnmove skip" class="button" style="text-align:center; padding:8px; margin-top:8px;">`;
		buf += `<b>Keep old moves</b> <small>(Give up learning ${newMove.name})</small></button>`;

		buf += `</div></div>`;
		return buf;
	}

	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-stats-bar">`;
		buf += `<span>Floor <b>${state.floor}</b></span>`;
		buf += `<span class="pr-shop-stats-sep">|</span>`;
		buf += `<span>Coins <b>${shopCoins}</b></span>`;
		if ((state.doubleExpFloors ?? 0) > 0) buf += `<span class="pr-shop-stats-sep">|</span><span style="color:#c4a8ff">Lucky Charm <b>${state.doubleExpFloors}</b> floors</span>`;
		buf += `</div>`;
		buf += `<div class="pr-shop-grid">`;
		for (const id of state.shopInventory) {
			const item = SHOP_ITEMS[id];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			const cardClass = canAfford ? 'pr-shop-card' : 'pr-shop-card pr-shop-card-disabled';
			buf += `<div class="${cardClass}">`;
			buf += `<div class="pr-shop-card-top">${getItemSprite(item.icon || item.heldItem || item.id)}`;
			buf += `<div><div class="pr-shop-item-name">${Utils.escapeHTML(item.name)}</div>`;
			if (item.heldItem) buf += `<span class="pr-item-tag-held">HELD</span>`;
			if (item.isConsumable) buf += `<span class="pr-item-tag-consumable">CONSUMABLE</span>`;
			buf += `</div></div>`;
			buf += `<div class="pr-shop-item-desc">${Utils.escapeHTML(item.description)}</div>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button ${canAfford ? 'pr-shop-buy-btn' : 'pr-shop-buy-disabled'}" ${canAfford ? '' : 'disabled'}>`;
			buf += `${item.cost} coins</button></div>`;
		}
		buf += `</div>`;
		buf += `<div class="pr-shop-footer">`;
		buf += `<div class="pr-shop-reroll-row"><button name="send" value="/pokerogue refreshshop" class="button pr-shop-reroll-btn">Reroll Shop <span class="pr-shop-reroll-cost">(5 coins)</span></button></div>`;
		buf += `<div class="pr-shop-footer-nav">`;
		buf += `<button name="send" value="/pokerogue battle" class="button pr-shop-battle-btn">Battle</button>`;
		buf += `<button name="send" value="/pokerogue view main" class="button pr-shop-back-btn">Back</button>`;
		buf += `</div></div>`;
		return buf + `</div>`;
	}

	if (view === 'bag') {
		buf += `<h3>Team &amp; Items</h3>`;
		buf += `<div class="pr-popup-team" style="margin-top:6px;">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const spBag = Dex.species.get(toID(mon.species));
			const typesBag: string[] = spBag.types ?? [];
			const hpPctBag = mon.currentHp ?? 100;
			buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
			buf += `<span style="font-size:11px;font-weight:bold;color:#e0d4ff">${Utils.escapeHTML(spBag.name)}</span> `;
			buf += `<span style="font-size:9px">${renderTypeBadge(typesBag)}</span><br>`;
			buf += `<span style="font-size:10px;color:#aaa">Lv.${mon.level}</span> `;
			buf += `<span style="font-size:10px;color:${hpPctBag > 50 ? '#4caf50' : hpPctBag > 25 ? '#ff9800' : '#f44336'}">${hpPctBag}% HP</span>`;

			if (mon.heldItem) {
				const heldItemData = SHOP_ITEMS[mon.heldItem];
				buf += `<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.2);padding:2px 6px;border-radius:4px;margin-top:4px">`;
				buf += `<span style="font-size:10px;color:#8ab4f8" title="${Utils.escapeHTML(heldItemData?.description || '')}">${Utils.escapeHTML(heldItemData?.name || mon.heldItem)}</span>`;
				buf += `<button name="send" value="/pokerogue unequip ${i + 1}" class="button" style="font-size:9px;padding:2px 4px">Take</button>`;
				buf += `</div>`;
			} else {
				buf += `<div style="font-size:10px;color:#888;margin-top:4px">No Item</div>`;
			}
			buf += `</div></div>`;
		}
		buf += `</div>`;

		buf += `<h3 style="margin-top:12px;">Bag</h3>`;
		const ownedItems = Object.entries(state.items ?? {}).filter(([, qty]) => qty > 0);

		if (ownedItems.length) {
			buf += `<div class="pr-inventory-grid">`;
			for (const [id, qty] of ownedItems) {
				const item = SHOP_ITEMS[id];
				buf += `<div class="pr-inventory-item">`;
				buf += `<div class="pr-inventory-item-top">`;
				buf += getItemSprite(item?.icon || item?.heldItem || id);
				buf += `<div><b style="font-size:11px">${Utils.escapeHTML(item?.name || id)}</b> <span style="font-size:10px;color:#aaa">x${qty}</span>`;
				if (item?.heldItem) buf += `<br><span class="pr-item-tag-held">HELD</span>`;
				if (item?.isConsumable) buf += `<br><span class="pr-item-tag-consumable">CONSUMABLE</span>`;
				buf += `</div></div>`;
				buf += `<div style="font-size:10px;color:#9ab4cc;margin:4px 0 6px">${Utils.escapeHTML(item?.description || '')}</div>`;

				if (item?.heldItem || id === 'rarecandy' || item?.healHp !== undefined) {
					buf += `<div style="font-size:10px;margin-bottom:3px"><b>${item?.heldItem ? 'Equip to:' : 'Use on:'}</b></div>`;
					buf += `<div style="display:flex;gap:3px;flex-wrap:wrap">`;
					for (let i = 1; i <= state.team.length; i++) {
						const slotMon = state.team[i - 1];
						const isEquipped = item?.heldItem && slotMon.heldItem === item.heldItem;
						buf += `<button name="send" value="/pokerogue use ${id} ${i}" class="button pr-inv-slot-btn${isEquipped ? ' pr-inv-slot-equipped' : ''}">${i}</button>`;
					}
					buf += `</div>`;
				} else {
					buf += `<button name="send" value="/pokerogue use ${id}" class="button pr-inv-use-btn">Use</button>`;
				}
				buf += `</div>`;
			}
			buf += `</div>`;
		} else {
			buf += `<div style="text-align:center;color:#888;padding:14px;font-style:italic">Your bag is empty.</div>`;
		}
		return buf + `</div>`;
	}

	const activeEffects: string[] = [];
	if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
	if (state.hasRevive) activeEffects.push('Revive (active)');

	buf += `<div class="pr-popup-stats">`;
	buf += `<span class="pr-floor-badge">Floor <b>${state.floor}</b></span>`;
	buf += `<span class="pr-coin-badge"><b>${state.coins ?? 0}</b> coins</span>`;
	buf += `<span>Streaks <b>${state.streaksWon ?? 0}</b></span>`;
	buf += `</div>`;
	if (activeEffects.length) buf += `<div class="pr-active-effects" style="font-size:11px;color:#8ab4f8;background:rgba(90,63,160,0.15);padding:4px 8px;border-radius:6px;margin:6px 0"><b>Active:</b> ${Utils.escapeHTML(activeEffects.join(' · '))}</div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const expNeeded = mon.level < 999 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const spData = Dex.species.get(toID(mon.species));
		const types: string[] = spData.types ?? [];
		buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:bold;color:#e0d4ff">${Utils.escapeHTML(spData.name)}</span> `;
		buf += `<span style="font-size:9px">${renderTypeBadge(types)}</span><br>`;
		buf += `<span style="font-size:11px">Lv.${mon.level} <small style="color:#888">(${expNeeded} EXP to next)</small></span>`;
		buf += renderExpBar(mon);
		buf += renderHpBar(mon);
		if (mon.heldItem) buf += `<br><span style="font-size:10px;color:#8ab4f8">${Utils.escapeHTML(SHOP_ITEMS[mon.heldItem]?.name || mon.heldItem)}</span>`;
		buf += `</div></div>`;
	}
	buf += `</div>`;

	buf += `<div class="pr-popup-actions" style="margin-top:12px;display:flex;gap:6px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button" style="flex:1.5">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view bag" class="button" style="flex:1">Bag</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button" style="flex:1">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button" style="flex:1">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue view resetconfirm" class="button" style="color:#ff8080;flex:1">Reset Run</button></div>`;

	return buf + `</div>`;
}
