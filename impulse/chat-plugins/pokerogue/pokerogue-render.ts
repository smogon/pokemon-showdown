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

// Sprite number mapping for item icons, sourced from smogon/sprites ps-items.sheet.mjs.
// Items served from: https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/i{num}.png
const SMOGON_ITEM_SPRITE_BASE = 'https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/';
const ITEM_SPRITE_NUMS: Record<string, number> = {
	absorbbulb: 2, aguavberry: 5, airballoon: 6, apicotberry: 10,
	assaultvest: 581, bigroot: 29, blackbelt: 32, blackglasses: 35,
	blacksludge: 34, blunderpolicy: 716, boosterenergy: 745, brightpowder: 51,
	cellbattery: 60, charcoal: 61, cheriberry: 63, chestoberry: 65,
	choiceband: 68, choicescarf: 69, choicespecs: 70, clearamulet: 747,
	covertcloak: 750, custapberry: 86, damprock: 88, dragonfang: 106,
	ejectbutton: 118, ejectpack: 714, eviolite: 130, expertbelt: 132,
	flameorb: 145, focussash: 151, ganlonberry: 158, greatball: 174,
	hardstone: 187, heavydutyboots: 715, heatrock: 193, icyrock: 221,
	lansatberry: 238, laxincense: 240, leftovers: 242, liechiberry: 248,
	lifeorb: 249, loadeddice: 751, lumberry: 262, luminousmoss: 595,
	magnet: 273, masterball: 276, metalcoat: 286, metronome: 289,
	miracleseed: 292, mirrorherb: 748, muscleband: 297, mysticwater: 300,
	nevermeltice: 305, pechaberry: 333, petayaberry: 335, pixieplate: 610,
	poisonbarb: 343, powerherb: 358, protectivepads: 663, quickclaw: 373,
	rawstberry: 381, redcard: 387, rockyhelmet: 417, roomservice: 717,
	safetygoggles: 604, salacberry: 426, scopelens: 429, shedshell: 437,
	sharpbeak: 436, silkscarf: 444, silverpowder: 447, sitrusberry: 448,
	smoothrock: 453, snowball: 606, softsand: 456, spelltag: 461,
	terrainextender: 662, throatspray: 713, toxicorb: 515, twistedspoon: 520,
	ultraball: 521, utilityumbrella: 718, weaknesspolicy: 609, whiteherb: 535,
	widelens: 537, wiseglasses: 539,
};

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	let src: string;
	let fallback1: string | null = null;
	let fallback2: string | null = null;
	if (sp.exists && (sp.gen >= 6 || !!sp.forme)) {
		src = `https://play.pokemonshowdown.com/sprites/dex/${id}.png`;
		fallback1 = `https://play.pokemonshowdown.com/sprites/home-centered/${id}.png`;
		fallback2 = `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
	} else {
		src = `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
		fallback1 = `https://play.pokemonshowdown.com/sprites/dex/${id}.png`;
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
	const spriteNum = ITEM_SPRITE_NUMS[id];
	const initial = Utils.escapeHTML(id.substring(0, 2).toUpperCase());
	if (spriteNum !== undefined) {
		const src = `${SMOGON_ITEM_SPRITE_BASE}i${spriteNum}.png`;
		const escapedSrc = Utils.escapeHTML(src);
		return `<div class="pr-shop-item-icon">` +
			`<img src="${escapedSrc}" alt="${Utils.escapeHTML(id)}" width="32" height="32" style="image-rendering:pixelated" ` +
			`onerror="this.onerror=null;this.style.display='none';this.nextElementSibling.style.display='flex'" />` +
			`<span style="display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:11px;font-weight:bold;color:#c4a8ff">${initial}</span>` +
			`</div>`;
	}
	return `<div class="pr-shop-item-icon">` +
		`<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:11px;font-weight:bold;color:#c4a8ff">${initial}</span>` +
		`</div>`;
}

function getPokeballInfo(speciesId: string): { src: string, alt: string } {
	const sp = Dex.species.get(toID(speciesId));
	const SMOGON_SPRITES_ITEM_BASE = 'https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/';
	if (sp.tags?.some(tag => LEGENDARY_TAGS.has(tag))) {
		return { src: `${SMOGON_SPRITES_ITEM_BASE}i1.png`, alt: 'Master Ball' };
	}
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		if (bst >= 580) return { src: `${SMOGON_SPRITES_ITEM_BASE}i2.png`, alt: 'Ultra Ball' };
		if (bst >= 480) return { src: `${SMOGON_SPRITES_ITEM_BASE}i3.png`, alt: 'Great Ball' };
	}
	return { src: `${SMOGON_SPRITES_ITEM_BASE}i4.png`, alt: 'Poké Ball' };
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
		buf += `<h2 class="pr-choice-heading">Capsule Result!</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table" style="margin: 0 auto;"><tbody>`;
		buf += `<tr class="pr-choice-row"><td style="padding-right: 15px;">${getSpriteWithBall(sp.id, 60)}</td>`;
		buf += `<td style="display:flex;flex-direction:column;gap:4px">`;
		buf += `<button name="send" value="/pokerogue acceptgacha" class="button pr-pick-btn">Add to Team</button>`;
		buf += `<button name="send" value="/pokerogue declinegacha" class="button">Decline</button></td></tr>`;
		return buf + `</tbody></table></div></div>`;
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
			if (isLeg) buf += `<div class="pr-legendary-badge">★ LEGENDARY</div>`;
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
			buf += `<b>Forget:</b> ${oldMove.name} <small>(Type: ${oldMove.type} | BP: ${oldMove.basePower || '—'})</small></button>`;
		}

		buf += `<button name="send" value="/pokerogue learnmove skip" class="button" style="text-align:center; padding:8px; margin-top:8px;">`;
		buf += `<b>Keep old moves</b> <small>(Give up learning ${newMove.name})</small></button>`;

		buf += `</div></div>`;
		return buf;
	}

	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-grid">`;
		for (const id of state.shopInventory) {
			const item = SHOP_ITEMS[id];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card"><div class="pr-shop-card-top">${getItemSprite(item.icon || item.heldItem || item.id)}<b>${item.name}</b></div>`;
			buf += `<div class="pr-shop-item-desc">${item.description}</div>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button pr-shop-buy-btn" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button></div>`;
		}
		return buf + `</div><div class="pr-shop-footer"><button name="send" value="/pokerogue refreshshop" class="button">Reroll (5c)</button><button name="send" value="/pokerogue view main" class="button">Back</button></div></div>`;
	}

	if (view === 'bag') {
		buf += `<div style="display:flex; justify-content:space-between; align-items:baseline;">`;
		buf += `<h3 style="margin:0;">Manage Team Items</h3>`;
		buf += `</div>`;

		buf += `<div class="pr-popup-team" style="margin-top:10px;">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const spBag = Dex.species.get(toID(mon.species));
			const typesBag: string[] = spBag.types ?? [];
			const hpPctBag = mon.currentHp ?? 100;
			buf += `<div class="pr-popup-mon" style="align-items:center;">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
			buf += `<span style="font-size:11px;font-weight:bold;color:#e0d4ff">${spBag.name}</span> <span style="font-size:9px">${renderTypeBadge(typesBag)}</span><br>`;
			buf += `<span style="font-size:10px;color:#aaa">Lv.${mon.level} | <span style="color:${hpPctBag > 50 ? '#4caf50' : hpPctBag > 25 ? '#ff9800' : '#f44336'}">${hpPctBag}% HP</span></span><br>`;

			if (mon.heldItem) {
				const item = SHOP_ITEMS[mon.heldItem];
				buf += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:2px 4px; border-radius:4px; margin-top:4px;">`;
				buf += `<span style="font-size:10px;color:#8ab4f8" title="${item?.description || ''}">${item?.name || mon.heldItem}</span>`;
				buf += `<button name="send" value="/pokerogue unequip ${i + 1}" class="button" style="font-size:9px; padding:2px 4px;">Take</button>`;
				buf += `</div>`;
			} else {
				buf += `<div style="font-size:10px;color:#888;margin-top:4px;">No Item</div>`;
			}
			buf += `</div></div>`;
		}
		buf += `</div>`;

		buf += `<h3 style="margin-top:15px;">Your Bag</h3>`;
		const ownedItems = Object.entries(state.items ?? {}).filter(([, qty]) => qty > 0);

		if (ownedItems.length) {
			buf += `<div class="pr-inventory-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`;
			for (const [id, qty] of ownedItems) {
				const item = SHOP_ITEMS[id];
				buf += `<div class="pr-inventory-item-card" style="background:rgba(255,255,255,0.05);padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.1)"><b>${item?.name || id}</b> (x${qty})<br>`;
				buf += `<span style="font-size:10px;color:#aaa">${item?.description || ''}</span>`;

				if (item?.heldItem || id === 'rarecandy' || item?.healHp !== undefined) {
					buf += `<div style="font-size:10px; margin: 4px 0 2px 0;"><b>${item?.heldItem ? 'Equip to:' : 'Use on:'}</b></div>`;
					buf += `<div style="display:flex;gap:2px;">`;
					for (let i = 1; i <= state.team.length; i++) {
						buf += `<button name="send" value="/pokerogue use ${id} ${i}" class="button" style="flex:1;padding:2px 0">${i}</button>`;
					}
					buf += `</div>`;
				} else {
					buf += `<button name="send" value="/pokerogue use ${id}" class="button" style="width:100%;margin-top:4px">Use</button>`;
				}
				buf += `</div>`;
			}
			buf += `</div>`;
		} else {
			buf += `<div style="text-align:center; color:#888; padding:10px; font-style:italic;">Your bag is currently empty.</div>`;
		}
		return buf + `</div>`;
	}

	const activeEffects: string[] = [];
	if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
	if (state.hasRevive) activeEffects.push('Revive (active)');

	buf += `<div class="pr-popup-stats">Floor <b>${state.floor}</b> | Coins <b>${state.coins ?? 0}</b> | Streaks <b>${state.streaksWon ?? 0}</b></div>`;
	if (activeEffects.length) buf += `<div class="pr-active-effects" style="font-size:11px;color:#8ab4f8;background:rgba(90,63,160,0.15);padding:4px;border-radius:6px;margin:6px 0"><b>Active:</b> ${activeEffects.join(' &nbsp; ')}</div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const expNeeded = mon.level < 999 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const spData = Dex.species.get(toID(mon.species));
		const types: string[] = spData.types ?? [];
		buf += `<div class="pr-popup-mon" style="align-items:center;">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:bold;color:#e0d4ff">${spData.name}</span> `;
		buf += `<span style="font-size:9px">${renderTypeBadge(types)}</span><br>`;
		buf += `<span style="font-size:11px">Lv.${mon.level} <small style="color:#888">(${expNeeded} EXP)</small></span>`;
		buf += renderExpBar(mon);
		buf += renderHpBar(mon);
		if (mon.heldItem) buf += `<br><span style="font-size:10px;color:#8ab4f8">${SHOP_ITEMS[mon.heldItem]?.name || mon.heldItem}</span>`;
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
