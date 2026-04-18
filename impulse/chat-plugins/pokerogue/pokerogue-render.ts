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
		buf += `<div class="pr-gameover">`;
		buf += `<div class="pr-gameover-title">GAME OVER</div>`;
		buf += `<div class="pr-gameover-stats">`;
		buf += `<span>Floor Reached: <b>${state.lastRunFloor || state.floor || 1}</b></span>`;
		if ((state.lastRunStreaks ?? 0) > 0) {
			buf += `<span>Streaks Won: <b>${state.lastRunStreaks}</b></span>`;
		}
		buf += `</div>`;
		if (state.recordTeam?.length) {
			buf += `<div style="font-size:11px;color:#7090b8;text-transform:uppercase;letter-spacing:1px;margin:10px 0 6px">Best Run Team</div>`;
			buf += `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-bottom:18px">`;
			for (const mon of state.recordTeam) {
				buf += getSpriteWithBall(mon.species, 48);
			}
			buf += `</div>`;
		}
		buf += `<button name="send" value="/pokerogue newgame confirm" class="button pr-newrun-btn">Start New Run</button>`;
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
		buf += `<div class="pr-leaderboard">`;
		for (let lbIdx = 0; lbIdx < entries.length; lbIdx++) {
			const [userid, s] = entries[lbIdx];
			const rank = lbIdx + 1;
			const rankIcon = rank === 1 ? '1.' : rank === 2 ? '2.' : rank === 3 ? '3.' : `${rank}.`;
			const displayTeam = s.recordTeam?.length ? s.recordTeam : s.team;
			const teamStr = (displayTeam ?? []).map((m: PokemonEntry) => getSprite(m.species, 30)).join('');
			buf += `<div class="pr-lb-row${rank <= 3 ? ' pr-lb-top' : ''}">`;
			buf += `<span class="pr-lb-rank">${rankIcon}</span>`;
			buf += `<span class="pr-lb-name">${Impulse.nameColor(s.displayName || userid, true, true)}</span>`;
			buf += `<span class="pr-lb-floor">F${s.highestFloor}</span>`;
			buf += `<span class="pr-lb-team">${teamStr}</span>`;
			buf += `</div>`;
		}
		buf += `</div>`;
		buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-top:8px;width:100%">← Back</button>`;
		return buf + `</div>`;
	}

	if (state.notification) buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;

	if (state.pendingGachaOffer) {
		const offer = state.pendingGachaOffer;
		const sp = Dex.species.get(toID(offer.species));
		const gachaTypes: string[] = sp.types ?? [];
		const gachaBs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const tierLabel = offer.isFeatured ? 'Featured' : 'Capsule';
		const isGachaLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
		buf += `<div class="pr-gacha-offer">`;
		buf += `<div class="pr-gacha-offer-header">`;
		buf += `<span class="pr-gacha-ball-label">${tierLabel}</span>`;
		if (isGachaLeg) buf += `<span class="pr-gacha-tier-badge" style="color:#f59e0b">★ Legendary</span>`;
		buf += `</div>`;
		buf += `<div class="pr-gacha-offer-body">`;
		buf += getSpriteWithBall(sp.id, 80);
		buf += `<div class="pr-gacha-offer-info">`;
		buf += `<div class="pr-gacha-mon-name">${Utils.escapeHTML(sp.name)}</div>`;
		buf += `<div style="margin:4px 0">${renderTypeBadge(gachaTypes, true)}</div>`;
		buf += `<div class="pr-ct-stats" style="margin-top:8px">`;
		buf += `<span>HP <b>${gachaBs.hp}</b></span><span>Atk <b>${gachaBs.atk}</b></span><span>Def <b>${gachaBs.def}</b></span>`;
		buf += `<span>SpA <b>${gachaBs.spa}</b></span><span>SpD <b>${gachaBs.spd}</b></span><span>Spe <b>${gachaBs.spe}</b></span>`;
		buf += `</div>`;
		buf += `<div class="pr-gacha-offer-actions">`;
		buf += `<button name="send" value="/pokerogue acceptgacha" class="button pr-gacha-accept-btn">Add to Team</button>`;
		buf += `<button name="send" value="/pokerogue declinegacha" class="button pr-gacha-decline-btn">Decline</button>`;
		buf += `</div>`;
		buf += `</div></div></div>`;
		return buf + `</div>`;
	}

	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<div class="pr-choice-grid">`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const sp = Dex.species.get(toID(state.pendingChoice[i]));
			const isLeg = sp.tags?.some((t: string) => LEGENDARY_TAGS.has(t)) ?? false;
			const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const abilities = sp.abilities ?? {};
			const ability = (abilities as unknown as Record<string, string>)['0'] || 'Unknown';
			const types: string[] = sp.types ?? [];
			const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
			buf += `<div class="pr-choice-card${isLeg ? ' legendary' : ''}">`;
			buf += `<div style="margin-bottom:6px;display:flex;justify-content:center">${getSpriteWithBall(sp.id, 64)}</div>`;
			if (isLeg) buf += `<div class="pr-legendary-badge" style="margin-bottom:4px">★ LEGENDARY</div>`;
			buf += `<div class="pr-ct-name">${Utils.escapeHTML(sp.name)}</div>`;
			buf += `<div style="margin:4px 0">${renderTypeBadge(types, true)}</div>`;
			buf += `<div class="pr-ct-stats" style="justify-content:center;margin-bottom:4px">`;
			buf += `<span>HP <b>${bs.hp}</b></span>`;
			buf += `<span>Atk <b>${bs.atk}</b></span>`;
			buf += `<span>Def <b>${bs.def}</b></span>`;
			buf += `<span>SpA <b>${bs.spa}</b></span>`;
			buf += `<span>SpD <b>${bs.spd}</b></span>`;
			buf += `<span>Spe <b>${bs.spe}</b></span>`;
			buf += `</div>`;
			buf += `<div style="font-size:10px;color:#7090b8;margin-bottom:4px">BST: <b style="color:#c4a8ff">${bst}</b></div>`;
			buf += `<div class="pr-ct-ability" style="margin-bottom:8px">Ability: <b>${Utils.escapeHTML(ability)}</b></div>`;
			buf += `<button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn" style="width:100%">Pick</button>`;
			buf += `</div>`;
		}
		buf += `</div>`;
		return buf + `</div>`;
	}

	// --- TEAM SWAP UI ---
	if (state.pendingSwap) {
		const newMon = state.pendingSwap;
		const newSp = Dex.species.get(toID(newMon.species));
		const newTypesSwap: string[] = newSp.types ?? [];

		buf += `<h2 class="pr-choice-heading">Your team is full!</h2>`;
		buf += `<div style="text-align:center;margin-bottom:14px">`;
		buf += getSpriteWithBall(newSp.id, 80);
		buf += `<div class="pr-ct-name" style="margin:6px 0 2px">${Utils.escapeHTML(newSp.name)} <small style="color:#aaa;font-weight:normal">Lv.${newMon.level}</small></div>`;
		buf += `<div style="margin-bottom:6px">${renderTypeBadge(newTypesSwap, true)}</div>`;
		buf += `<div style="font-size:11px;color:#aaa">wants to join your team! Choose a Pokémon to replace:</div>`;
		buf += `</div>`;

		buf += `<div style="display:flex;flex-direction:column;gap:8px">`;
		for (let i = 0; i < state.team.length; i++) {
			const mon = state.team[i];
			const spSwap = Dex.species.get(toID(mon.species));
			const typesSwap: string[] = spSwap.types ?? [];
			const swapItem = mon.heldItem ? (SHOP_ITEMS[mon.heldItem]?.name || mon.heldItem) : null;
			buf += `<button name="send" value="/pokerogue swapmon ${i + 1}" class="button pr-swap-card">`;
			buf += `${getSprite(mon.species, 44)}`;
			buf += `<div style="flex:1;min-width:0;text-align:left;margin-left:10px">`;
			buf += `<div style="font-size:12px;font-weight:bold;color:#e0d4ff">${Utils.escapeHTML(spSwap.name)}</div>`;
			buf += `<div style="font-size:10px;color:#aaa;margin:2px 0">Lv.${mon.level} &nbsp;${renderTypeBadge(typesSwap)}</div>`;
			buf += renderHpBar(mon);
			if (swapItem) buf += `<div style="font-size:10px;color:#8ab4f8;margin-top:2px">Item: ${Utils.escapeHTML(swapItem)}</div>`;
			buf += `</div>`;
			buf += `<div style="font-size:11px;color:#ff8080;white-space:nowrap;align-self:center;padding-left:8px">Replace ›</div>`;
			buf += `</button>`;
		}

		buf += `<button name="send" value="/pokerogue swapmon skip" class="button" style="text-align:center;padding:8px;margin-top:4px;opacity:0.8">`;
		buf += `Keep current team <small>(Discard ${Utils.escapeHTML(newSp.name)})</small>`;
		buf += `</button>`;

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
		buf += `<div style="text-align:center;margin-bottom:14px">`;
		buf += getSpriteWithBall(sp.id, 72);
		buf += `<div class="pr-ct-name" style="margin:6px 0 2px">${Utils.escapeHTML(sp.name)} can learn a new move!</div>`;
		buf += `</div>`;

		buf += `<div style="background:linear-gradient(135deg,rgba(52,211,153,0.12),rgba(16,185,129,0.06));border:1px solid rgba(52,211,153,0.35);border-radius:10px;padding:10px 14px;margin-bottom:12px;display:flex;align-items:center;gap:12px">`;
		buf += `<div style="flex:1">`;
		buf += `<div style="font-size:13px;font-weight:bold;color:#6ee7b7;margin-bottom:4px">${Utils.escapeHTML(newMove.name)}</div>`;
		buf += `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">`;
		buf += `${renderTypeBadge([newMove.type])}`;
		buf += `<span style="font-size:11px;color:#aaa">BP: <b style="color:#dde6f0">${newMove.basePower || '—'}</b></span>`;
		buf += `<span style="font-size:11px;color:#aaa">PP: <b style="color:#dde6f0">${newMove.pp || '—'}</b></span>`;
		buf += `<span style="font-size:11px;color:#aaa">${newMove.category || ''}</span>`;
		buf += `</div></div>`;
		buf += `<div style="font-size:12px;color:#6ee7b7;font-weight:bold;white-space:nowrap">New</div>`;
		buf += `</div>`;

		buf += `<div style="font-size:11px;color:#7090b8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Choose a move to forget:</div>`;
		buf += `<div style="display:flex;flex-direction:column;gap:6px">`;
		for (let i = 0; i < mon.moves.length; i++) {
			const oldMove = Dex.moves.get(mon.moves[i]);
			buf += `<button name="send" value="/pokerogue learnmove ${i + 1}" class="button" style="text-align:left;padding:8px 12px;display:flex;align-items:center;gap:10px;width:100%">`;
			buf += `<div style="flex:1">`;
			buf += `<div style="font-size:12px;font-weight:bold;color:#fca5a5;margin-bottom:3px">${Utils.escapeHTML(oldMove.name)}</div>`;
			buf += `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">`;
			buf += `${renderTypeBadge([oldMove.type])}`;
			buf += `<span style="font-size:10px;color:#aaa">BP: <b>${oldMove.basePower || '—'}</b></span>`;
			buf += `<span style="font-size:10px;color:#aaa">PP: <b>${oldMove.pp || '—'}</b></span>`;
			buf += `<span style="font-size:10px;color:#aaa">${oldMove.category || ''}</span>`;
			buf += `</div></div>`;
			buf += `<span style="font-size:10px;color:#ff8080;white-space:nowrap">Forget ›</span>`;
			buf += `</button>`;
		}

		buf += `<button name="send" value="/pokerogue learnmove skip" class="button" style="text-align:center;padding:8px;margin-top:4px;opacity:0.8">Keep old moves <small>(Give up ${Utils.escapeHTML(newMove.name)})</small></button>`;
		buf += `</div></div>`;
		return buf;
	}

	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-stats-bar"><span>Coins: <b>${shopCoins}</b></span></div>`;
		buf += `<div class="pr-shop-grid">`;
		for (const id of state.shopInventory) {
			const item = SHOP_ITEMS[id];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card${canAfford ? '' : ' pr-shop-card-disabled'}">`;
			buf += `<div class="pr-shop-card-top">${getItemSprite(item.icon || item.heldItem || item.id)}`;
			buf += `<div><div class="pr-shop-item-name">${Utils.escapeHTML(item.name)}</div>`;
			buf += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">`;
			if (item.heldItem) buf += `<span class="pr-item-tag-held">Held</span>`;
			if (item.isConsumable) buf += `<span class="pr-item-tag-consumable">Consumable</span>`;
			buf += `</div></div></div>`;
			buf += `<div class="pr-shop-item-desc">${Utils.escapeHTML(item.description)}</div>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button pr-shop-buy-btn${canAfford ? '' : ' pr-shop-buy-disabled'}" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button>`;
			buf += `</div>`;
		}
		buf += `</div>`;
		buf += `<div class="pr-shop-footer">`;
		buf += `<div class="pr-shop-reroll-row"><button name="send" value="/pokerogue refreshshop" class="button pr-shop-reroll-btn">Reroll <span class="pr-shop-reroll-cost">(5c)</span></button></div>`;
		buf += `<div class="pr-shop-footer-nav">`;
		buf += `<button name="send" value="/pokerogue battle" class="button pr-shop-battle-btn">Battle</button>`;
		buf += `<button name="send" value="/pokerogue view main" class="button pr-shop-back-btn">← Back</button>`;
		buf += `</div></div>`;
		return buf + `</div>`;
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

	// Floor progress strip (idea 12)
	const fpMilestones = [1, 5, 10, 20, 30, 50];
	buf += `<div class="pr-floor-progress">`;
	for (let fpIdx = 0; fpIdx < fpMilestones.length; fpIdx++) {
		const fpM = fpMilestones[fpIdx];
		const fpNext = fpMilestones[fpIdx + 1] ?? Infinity;
		const fpActive = state.floor >= fpM && state.floor < fpNext;
		const fpPast = state.floor >= fpNext;
		const fpLabel = fpM === 1 ? 'Start' : `F${fpM}`;
		buf += `<div class="pr-fp-node${fpActive ? ' active' : fpPast ? ' past' : ''}">`;
		buf += `<div class="pr-fp-dot"></div>`;
		buf += `<div class="pr-fp-label">${fpLabel}</div>`;
		buf += `</div>`;
		if (fpIdx < fpMilestones.length - 1) {
			buf += `<div class="pr-fp-line${fpPast ? ' past' : ''}"></div>`;
		}
	}
	buf += `</div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const expNeeded = mon.level < 999 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const spData = Dex.species.get(toID(mon.species));
		const monTypes: string[] = spData.types ?? [];
		buf += `<div class="pr-popup-mon" style="align-items:flex-start">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">`;
		buf += `<span style="font-size:12px;font-weight:bold;color:#e0d4ff">${Utils.escapeHTML(spData.name)}</span> `;
		buf += `<span style="font-size:9px">${renderTypeBadge(monTypes)}</span><br>`;
		buf += `<span style="font-size:11px">Lv.${mon.level} <small style="color:#888">(${expNeeded} EXP)</small></span>`;
		buf += renderExpBar(mon);
		buf += renderHpBar(mon);
		if (mon.heldItem) {
			const monItemData = SHOP_ITEMS[mon.heldItem];
			const monItemName = monItemData?.name || mon.heldItem;
			const monItemNameHtml = Utils.escapeHTML(monItemName);
			const monItemSpriteNum = ITEM_SPRITE_NUMS[toID(mon.heldItem)];
			const monItemIconHtml = monItemSpriteNum !== undefined
				? `<img src="${SMOGON_ITEM_SPRITE_BASE}i${monItemSpriteNum}.png" width="16" height="16" alt="${monItemNameHtml}" style="image-rendering:pixelated;vertical-align:middle" onerror="this.style.display='none'" />`
				: '';
			buf += `<div style="display:flex;align-items:center;gap:4px;margin-top:3px">${monItemIconHtml}<span style="font-size:10px;color:#8ab4f8">${monItemNameHtml}</span></div>`;
		}
		if (mon.moves?.length) {
			buf += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:5px">`;
			for (const moveId of mon.moves) {
				const mv = Dex.moves.get(moveId);
				buf += `<div style="font-size:9px;color:#b8c8e8;display:flex;align-items:center;gap:3px;overflow:hidden">`;
				buf += `${renderTypeBadge([mv.type])}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Utils.escapeHTML(mv.name)}</span>`;
				buf += `</div>`;
			}
			buf += `</div>`;
		}
		buf += `</div></div>`;
	}
	buf += `</div>`;

	// Action bar grid (idea 2)
	buf += `<div style="margin-top:12px">`;
	buf += `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:6px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button pr-battle-btn" style="grid-column:1/-1">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view bag" class="button" style="padding:8px">Bag</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button" style="padding:8px">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button" style="padding:8px">Scores</button>`;
	buf += `</div>`;
	buf += `<button name="send" value="/pokerogue view resetconfirm" class="button" style="width:100%;color:#ff8080;opacity:0.8;padding:6px">Reset Run</button>`;
	buf += `</div>`;

	return buf + `</div>`;
}
