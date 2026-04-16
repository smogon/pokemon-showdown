// pokerogue plugin — Final Refactored SPA Version.
// Navigation uses internal state to update the current window instead of opening new tabs.
// 100% Parity with original Staff/Player commands and progression logic.

import { Utils } from '../../../lib';
import { Table } from '../../utils';
import {
	SHOP_ITEMS, LEGENDARY_TAGS,
	type PokemonEntry, type PokeRogueState,
	getState, setState, deleteState, savedData,
	pickStarterOptions, pickNewPokemonOptions,
	expForLevel, floorExpReward, floorCoinReward,
	applyExpAndLevelUp, getLevelUpEvo,
	getLevelUpMoves, rollShopInventory, rollGachaPokemon,
} from './pokerogue-core';
import {
	activeMatches,
	startBattle, destroyBotUser,
} from './pokerogue-battle';

// Page auto-refresh interval while a battle is active or notification is pending
const PAGE_REFRESH_SECONDS = 20;

// --- Asset & Sprite Helpers ---

function getSprite(species: string, size = 80): string {
	const id = toID(species);
	const sp = Dex.species.get(id);
	const name = sp.name || species;
	const altName = Utils.escapeHTML(name);
	let src: string;
	let fallback: string | null = null;
	if (sp.exists && sp.gen >= 8) {
		src = `https://play.pokemonshowdown.com/sprites/home-centered/${id}.png`;
		fallback = `https://play.pokemonshowdown.com/sprites/dex/${id}.png`;
	} else if (sp.exists && (sp.gen >= 6 || !!sp.forme)) {
		src = `https://play.pokemonshowdown.com/sprites/dex/${id}.png`;
		fallback = `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
	} else {
		src = `https://play.pokemonshowdown.com/sprites/gen5/${id}.png`;
	}
	const onerror = fallback ? ` onerror="if(this.src!=='${fallback}')this.src='${fallback}'"` : '';
	return `<img src="${src}"${onerror} width="${size}" height="${size}" alt="${altName} sprite" style="image-rendering:pixelated" />`;
}

function getItemSprite(itemId: string): string {
	const id = toID(itemId);
	const SMOGON_SPRITES_ITEM_BASE = 'https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/';
	const ITEM_SPRITE_OVERRIDES: Record<string, string> = {
		mastercapsule: `${SMOGON_SPRITES_ITEM_BASE}i1.png`,
		ultracapsule: `${SMOGON_SPRITES_ITEM_BASE}i2.png`,
		greatcapsule: `${SMOGON_SPRITES_ITEM_BASE}i3.png`,
		rarecandy: `https://raw.githubusercontent.com/msikma/pokesprite/master/items/medicine/rare-candy.png`,
		revive: `https://raw.githubusercontent.com/msikma/pokesprite/master/items/medicine/revive.png`,
		luckycharm: `https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/lucky-egg.png`,
	};
	const SMOGON_ITEM_SIDS: Record<string, string> = {
		focussash: 'i275', leftovers: 'i234', eviolite: 'i538', rockyhelmet: 'i540',
		heavydutyboots: 'i1120', airballoon: 'i541', blacksludge: 'i281',
		choiceband: 'i220', choicespecs: 'i297', choicescarf: 'i287',
		lifeorb: 'i270', expertbelt: 'i268', wiseglasses: 'i267', muscleband: 'i266',
		assaultvest: 'i640', clearamulet: 'i1882', boosterenergy: 'i1880',
		protectivepads: 'i880', safetygoggles: 'i650',
		sitrusberry: 'i158', aguavberry: 'i162', flameorb: 'i273', toxicorb: 'i272',
		whiteherb: 'i214', powerherb: 'i271', throatspray: 'i1118', blunderpolicy: 'i1121', shedshell: 'i295',
		silkscarf: 'i251', blackbelt: 'i241', magnet: 'i242', mysticwater: 'i243', miracleseed: 'i239', charcoal: 'i249',
		nevermeltice: 'i246', softsand: 'i237', sharpbeak: 'i244', poisonbarb: 'i245', twistedspoon: 'i248', silverpowder: 'i222',
		hardstone: 'i238', spelltag: 'i247',
	};
	const src = ITEM_SPRITE_OVERRIDES[id] ?? (SMOGON_ITEM_SIDS[id] ? `${SMOGON_SPRITES_ITEM_BASE}${SMOGON_ITEM_SIDS[id]}.png` : null);
	const letter = Utils.escapeHTML((itemId.charAt(0) || '?').toUpperCase());
	const imgHtml = src ? `<img src="${src}" width="40" height="40" alt="" style="image-rendering:pixelated;display:block;flex-shrink:0" onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex'" />` : '';
	return imgHtml + `<span class="pr-item-fallback" style="${src ? 'display:none;' : ''}width:40px;height:40px;align-items:center;justify-content:center;font-size:17px;font-weight:bold;color:#c4a8ff;background:rgba(90,63,160,0.35);border-radius:7px;flex-shrink:0">${letter}</span>`;
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

function getSpriteWithBall(species: string, size = 80): string {
	const ball = getPokeballInfo(species);
	const spriteHtml = getSprite(species, size);
	return `<div class="pr-sprite-wrap" style="width:${size}px;height:${size}px">` +
		spriteHtml +
		`<img src="${ball.src}" alt="${Utils.escapeHTML(ball.alt)}" class="pr-pokeball-overlay" />` +
		`</div>`;
}

// --- UI Helpers ---

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

function typeColor(type: string): string {
	const colors: Record<string, string> = {
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129', Electric: 'fac000', Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb',
		Ground: '915121', Flying: '81b9ef', Psychic: 'ef4179', Bug: '91a119', Rock: 'afa981', Ghost: '704170', Dragon: '5060e1', Dark: '624d4e',
		Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return colors[type] ?? '68a090';
}

function renderTypeBadge(types: string[], large = false): string {
	return types.map(t => `<span style="background:#${typeColor(t)};color:#fff;border-radius:${large ? '4px' : '3px'};padding:${large ? '2px 6px' : '1px 5px'};font-size:${large ? '10px' : '9px'};font-weight:bold">${t}</span>`).join(' ');
}

// --- Internal Logic ---

function repairEmptyPendingChoice(state: PokeRogueState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('pokerogue')) {
			Chat.parse(`/join view-pokerogue`, null, user, conn);
		}
	}
}

function renderGamePage(state: PokeRogueState): string {
	const view = (state as any).view || 'main';
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	// --- Header ---
	buf += `<div class="pr-popup-header"><h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main' && !state.gameOver) buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back</button>`;
	buf += `</div>`;

	// --- Global Loss State ---
	if (state.gameOver) {
		buf += `<div class="pr-gameover" style="text-align:center;padding:20px">`;
		buf += `<div class="pr-gameover-title" style="font-size:24px;color:#ff8080;font-weight:bold;margin-bottom:15px">GAME OVER</div>`;
		buf += `<div style="margin-bottom:20px;color:#8ab4f8">Your run has ended. Floor: <b>${state.lastRunFloor || 1}</b></div>`;
		buf += `<button name="send" value="/pokerogue newgame confirm" class="button pr-newrun-btn" style="padding:10px 20px;font-size:16px">Start New Run</button>`;
		buf += `</div></div>`;
		return buf;
	}

	// --- View Routing ---
	if (view === 'top') {
		const entries = Object.entries(savedData).filter(([, s]) => (s.highestFloor ?? 0) > 0).sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0)).slice(0, 100);
		if (!entries.length) return buf + '<em>No records yet!</em></div>';
		const rows = entries.map(([userid, s], i) => {
			const teamStr = (s.team ?? []).map(m => `${getSprite(m.species, 30)}<small>${Dex.species.get(toID(m.species)).name || m.species}</small>`).join(' ');
			return [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, teamStr];
		});
		return buf + Table('PokéRogue Top 100', ['#', 'Player', 'Best Floor', 'Last Team'], rows) + `</div>`;
	}

	if (state.notification) buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;

	// Choice Milestones
	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const sp = Dex.species.get(toID(state.pendingChoice[i]));
			buf += `<tr class="pr-choice-row"><td>${getSpriteWithBall(sp.id, 60)}</td><td><b>${Utils.escapeHTML(sp.name)}</b></td>`;
			buf += `<td><button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">Pick</button></td></tr>`;
		}
		return buf + `</tbody></table></div></div>`;
	}

	// Shop View
	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-grid">`;
		for (const id of state.shopInventory) {
			const item = SHOP_ITEMS[id];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card"><div class="pr-shop-card-top">${getItemSprite(item.heldItem || item.id)}<b>${item.name}</b></div>`;
			buf += `<div class="pr-shop-item-desc">${item.description}</div>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button pr-shop-buy-btn" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button></div>`;
		}
		return buf + `</div><div class="pr-shop-footer"><button name="send" value="/pokerogue refreshshop" class="button">Reroll (5c)</button><button name="send" value="/pokerogue view main" class="button">Back</button></div></div>`;
	}

	// --- MAIN DASHBOARD ---
	const activeEffects: string[] = [];
	if ((state.doubleExpFloors ?? 0) > 0) activeEffects.push(`Lucky Charm (${state.doubleExpFloors} floors left)`);
	if (state.hasRevive) activeEffects.push('Revive (active)');

	buf += `<div class="pr-popup-stats">Floor <b>${state.floor}</b> | Coins <b>${state.coins ?? 0}</b> | Streaks <b>${state.streaksWon ?? 0}</b></div>`;
	if (activeEffects.length) buf += `<div class="pr-active-effects" style="font-size:11px;color:#8ab4f8;background:rgba(90,63,160,0.15);padding:4px;border-radius:6px;margin:6px 0"><b>Active:</b> ${activeEffects.join(' &nbsp; ')}</div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const sp = Dex.species.get(toID(mon.species));
		const expNeeded = mon.level < 100 ? expForLevel(mon.level + 1) - mon.exp : 0;
		const evo = getLevelUpEvo(mon.species);
		const evoHint = evo && mon.level < evo.evoLevel ? `<span style="font-size:9px;color:#a0e0a0">Evo @ Lv.${evo.evoLevel}</span>` : '';
		buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1"><b>${Utils.escapeHTML(sp.name)}</b> ${evoHint}<br>`;
		buf += `<span style="font-size:11px">Lv.${mon.level} <small>(${expNeeded} EXP)</small></span>${renderExpBar(mon)}`;
		if (mon.heldItem) buf += `<br><span style="font-size:10px;color:#8ab4f8">${SHOP_ITEMS[mon.heldItem]?.name || mon.heldItem}</span>`;
		buf += `</div></div>`;
	}
	buf += `</div>`;

	// Inventory
	const ownedItems = Object.entries(state.items ?? {}).filter(([, qty]) => qty > 0);
	if (ownedItems.length) {
		buf += `<h3>Inventory</h3><div class="pr-inventory-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:6px">`;
		for (const [id, qty] of ownedItems) {
			const item = SHOP_ITEMS[id];
			buf += `<div class="pr-inventory-item-card" style="background:rgba(255,255,255,0.05);padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.1)"><b>${item?.name || id}</b> (x${qty})<br>`;
			if (item?.heldItem || id === 'rarecandy') {
				buf += `<div style="display:flex;gap:2px;margin-top:4px">`;
				for (let i = 1; i <= state.team.length; i++) buf += `<button name="send" value="/pokerogue use ${id} ${i}" class="button" style="flex:1;padding:2px 0">${i}</button>`;
				buf += `</div>`;
			} else {
				buf += `<button name="send" value="/pokerogue use ${id}" class="button" style="width:100%;margin-top:4px">Use</button>`;
			}
			buf += `</div>`;
		}
		buf += `</div>`;
	}

	buf += `<div class="pr-popup-actions" style="margin-top:12px;display:flex;gap:6px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button" style="flex:1.5">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button" style="flex:1">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button" style="flex:1">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080;flex:1">Quit</button></div>`;

	return buf + `</div>`;
}

// --- Commands ---

export const commands: Chat.ChatCommands = {
	pokerogue: {
		start(target, room, user) {
			if (!user.named) return this.errorReply("Login required.");
			let state = getState(user.id);
			if (state?.battleRoomId) {
				const bRoom = Rooms.get(state.battleRoomId as RoomID);
				if (!bRoom?.battle || bRoom.battle.ended) delete state.battleRoomId;
			}
			if (!state || (!state.team?.length && !state.pendingChoice?.length && !state.battleRoomId && !state.gameOver)) {
				state = { floor: 1, team: [], pendingChoice: pickStarterOptions(), pendingChoiceType: 'starter', coins: 0, streaksWon: 0 } as any;
				setState(user.id, state);
			}
			repairEmptyPendingChoice(state, user.id);
			return this.parse('/join view-pokerogue');
		},

		newgame(target, room, user) {
			const existing = getState(user.id);
			const hasProgress = existing && (existing.team?.length > 0 || (existing.floor ?? 1) > 1);
			if (hasProgress && !existing.gameOver && target !== 'confirm') {
				return this.sendReplyBox(`<b>Warning: Run in progress!</b><br><button name="send" value="/pokerogue newgame confirm" class="button">Yes, start fresh</button>`);
			}
			deleteState(user.id);
			return this.parse('/pokerogue start');
		},

		view(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			const v = target.trim() as any;
			if (['main', 'shop', 'top'].includes(v)) {
				(state as any).view = v;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		battle(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("The run is over. Start a new run first.");
			if (state.pendingChoice?.length || state.pendingGachaOffer) return this.errorReply("Handle pending choices first.");
			if (startBattle(user, state)) {
				(state as any).view = 'main';
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		choose(target, room, user) {
			const state = getState(user.id);
			const n = parseInt(target) - 1;
			if (!state?.pendingChoice || isNaN(n) || n < 0 || n >= state.pendingChoice.length) return;
			const choice = state.pendingChoice[n];
			if (state.pendingChoiceType === 'starter') state.team = [{ species: choice, level: 1, exp: 0 }];
			else if (state.team.length < 6) state.team.push({ species: choice, level: Math.max(1, state.floor - 2), exp: expForLevel(Math.max(1, state.floor - 2)) });
			delete state.pendingChoice; delete state.pendingChoiceType;
			setState(user.id, state); refreshGamePage(user);
		},

		buy(target, room, user) {
			const state = getState(user.id);
			const item = SHOP_ITEMS[toID(target)];
			if (state && item && (state.coins ?? 0) >= item.cost && state.shopInventory?.includes(item.id)) {
				state.coins! -= item.cost;
				state.items = state.items ?? {};
				state.items[item.id] = (state.items[item.id] ?? 0) + 1;
				setState(user.id, state); refreshGamePage(user);
			}
		},

		use(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			const [id, slotStr] = target.split(' ');
			const itemId = toID(id);
			const slot = parseInt(slotStr) - 1;
			if (!state.items?.[itemId]) return this.errorReply("Item not found.");
			const item = SHOP_ITEMS[itemId];
			state.items[itemId]--;
			if (itemId === 'rarecandy' && state.team[slot]) {
				const mon = state.team[slot];
				mon.level = Math.min(100, mon.level + 5); mon.exp = expForLevel(mon.level);
				while (true) { const evo = getLevelUpEvo(mon.species); if (!evo || mon.level < evo.evoLevel) break; mon.species = evo.evoTo; }
				state.notification = `<b>${mon.species}</b> grew to Lv. ${mon.level}!`;
			} else if (itemId === 'luckycharm') state.doubleExpFloors = (state.doubleExpFloors ?? 0) + 3;
			else if (itemId === 'revive') state.hasRevive = true;
			else if (item?.gachaType) {
				const { species } = rollGachaPokemon(item.gachaType, item.gachaChance || 0, state.team.map(m => m.species));
				state.pendingGachaOffer = { species, sourceItemId: itemId, isFeatured: true };
			} else if (item?.heldItem && state.team[slot]) {
				if (state.team[slot].heldItem) state.items[state.team[slot].heldItem!] = (state.items[state.team[slot].heldItem!] ?? 0) + 1;
				state.team[slot].heldItem = item.heldItem;
			}
			setState(user.id, state); refreshGamePage(user);
		},

		status(target, room, user) {
			if (!this.runBroadcast()) return;
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (!s) return this.errorReply(`No run found for ${tId}.`);
			let buf = `<b>PokéRogue Status: ${tId}</b><br>Floor ${s.floor} | Coins: ${s.coins}<br>${s.team.map(m => `Lv.${m.level} ${m.species}`).join(', ')}`;
			if (s.pendingChoice?.length) buf += `<br><b>Choice Pending!</b> <button name="send" value="/pokerogue start">Open Game</button>`;
			this.sendReplyBox(buf);
		},

		// Staff Commands
		addmon(target, room, user) {
			this.checkCan('lock');
			const [name, mon, lvl] = target.split(',');
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s && s.team.length < 6) {
				const species = Dex.species.get(toID(mon));
				if (!species.exists) return this.errorReply("Invalid Pokémon.");
				const level = parseInt(lvl) || 1;
				s.team.push({ species: species.id, level, exp: expForLevel(level) });
				setState(tId, s); this.sendReply(`Added ${species.name} to ${tId}'s team.`);
			}
		},
		givemoney(target, room, user) {
			this.checkCan('lock');
			const [name, amt] = target.split(',');
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) { s.coins = (s.coins ?? 0) + parseInt(amt || '100'); setState(tId, s); this.sendReply(`Gave coins to ${tId}.`); }
		},
		removecoins(target, room, user) {
			this.checkCan('lock');
			const [name, amt] = target.split(',');
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) { s.coins = Math.max(0, (s.coins ?? 0) - parseInt(amt || '100')); setState(tId, s); this.sendReply(`Removed coins from ${tId}.`); }
		},
		resetcoins(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (s) { s.coins = 0; setState(tId, s); this.sendReply(`Reset coins for ${tId}.`); }
		},
		setfloor(target, room, user) {
			this.checkCan('lock');
			const [name, fl] = target.split(',');
			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) { s.floor = parseInt(fl || '1'); setState(tId, s); this.sendReply(`Set floor for ${tId} to ${s.floor}.`); }
		},
		healteam(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (s) { for (const m of s.team) m.exp = expForLevel(m.level); setState(tId, s); this.sendReply(`Healed team for ${tId}.`); }
		},
		removemon(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			if (getState(tId)) { deleteState(tId); this.sendReply(`Wiped data for ${tId}.`); }
		},

		dismissnotif(target, room, user) {
			const s = getState(user.id);
			if (s?.notification) { delete s.notification; setState(user.id, s); }
			refreshGamePage(user);
		},
		quit(target, room, user) {
			const s = getState(user.id);
			if (s?.battleRoomId) {
				const match = activeMatches.get(s.battleRoomId as RoomID);
				if (match) { const bot = Users.get(match.botUserId); if (bot) destroyBotUser(bot); activeMatches.delete(s.battleRoomId as RoomID); }
				Rooms.get(s.battleRoomId)?.battle?.forfeit(user);
			}
			deleteState(user.id); refreshGamePage(user);
		},
		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html = `<b>PokéRogue — Player Commands:</b><br>` +
				`<code>/pokerogue start</code> — Open the game page.<br>` +
				`<code>/pokerogue battle</code> — Start floor battle.<br>` +
				`<code>/pokerogue shop</code> — Item shop.<br>` +
				`<code>/pokerogue status</code> — View run info.<br>` +
				`<code>/pokerogue top</code> — Leaderboard.<br>` +
				`<code>/pokerogue quit</code> — Abandon run.<br>`;
			if (isStaff) {
				html += `<br><b>Staff Tools:</b> givemoney, removecoins, resetcoins, setfloor, healteam, addmon, removemon.`;
			}
			this.sendReplyBox(html);
		},
		'': 'help',
	},
};

export const pages: Chat.PageTable = {
	pokerogue(args, user) {
		if (!user.named) return this.errorReply('Login required.');
		const state = getState(user.id);
		if (!state) return `<div class="pr-popup"><div class="pr-popup-header"><h2>PokéRogue</h2></div><div style="text-align:center;padding:16px"><button name="send" value="/pokerogue start" class="button">Start New Run</button></div></div>`;
		const v = (state as any).view || 'main';
		this.title = `PokéRogue - ${v.toUpperCase()}`;
		return renderGamePage(state);
	},
};

// --- Handlers ---

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = activeMatches.get(battle.roomid);
		if (!match) return;
		activeMatches.delete(battle.roomid);
		const botUser = Users.get(match.botUserId);
		if (botUser) destroyBotUser(botUser);
		const state = getState(match.userId);
		if (!state) return;
		delete state.battleRoomId;

		if (toID(winner) === match.userId) {
			const mult = (state.doubleExpFloors ?? 0) > 0 ? 2 : 1;
			const expReward = floorExpReward(match.floor) * mult;
			const coinReward = floorCoinReward(match.floor) * mult;
			const detailMsgs: string[] = [];

			for (const mon of state.team) {
				const oldSpecies = mon.species;
				const { evolved } = applyExpAndLevelUp(mon, expReward);
				if (evolved) {
					detailMsgs.push(`<b>${oldSpecies}</b> evolved into <b>${mon.species}</b> and reached Lv. ${mon.level}!`);
				} else {
					detailMsgs.push(`<b>${mon.species}</b> reached Lv. ${mon.level}!`);
				}
			}
			state.coins = (state.coins ?? 0) + coinReward;
			if (state.doubleExpFloors) state.doubleExpFloors--;
			const prevFl = state.floor;
			state.floor++;
			state.streaksWon = (state.streaksWon ?? 0) + 1;
			if (state.floor > (state.highestFloor ?? 0)) state.highestFloor = state.floor;
			state.displayName = Users.get(match.userId)?.name || match.userId;
			
			state.notification = `<b>Floor ${prevFl} Cleared!</b> +${coinReward} coins.<br>${detailMsgs.join('<br>')}`;
			if ((state.floor - 1) % 5 === 0 && state.team.length < 6) {
				state.pendingChoice = pickNewPokemonOptions(state.team, prevFl);
				state.pendingChoiceType = 'add';
				state.notification += `<br><b style="color:#c4a8ff">Milestone! Choose a new Pokemon to add!</b>`;
			}
			delete state.shopInventory;
		} else {
			if (state.hasRevive) {
				state.hasRevive = false;
				state.notification = "<b>Revive used!</b> Retrying Floor " + match.floor;
			} else {
				state.gameOver = true;
				state.lastRunFloor = match.floor;
				state.lastRunStreaks = state.streaksWon || 0;
				state.team = [];
			}
		}
		setState(match.userId, state);
		const hUser = Users.get(match.userId);
		if (hUser) refreshGamePage(hUser);
	},
};

export const start = (): void => {
	const { Dex } = require('../../../sim/dex');
	const { Format } = require('../../../sim/dex-formats');
	const FORMAT_ID = 'roguelikebattle' as ID;
	if (Dex.formats.rulesetCache.has(FORMAT_ID)) return;
	Dex.formats.load();
	const format = new Format({
		name: 'Roguelike Battle', mod: 'gen9', effectType: 'Format', section: 'Roguelike',
		ruleset: ['Max Team Size = 6', 'Max Move Count = 4', 'Max Level = 100', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		rated: false,
	});
	Dex.formats.rulesetCache.set(FORMAT_ID, format);
};
