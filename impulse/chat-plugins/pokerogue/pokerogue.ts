// pokerogue plugin — Final Complete Single-Page Architecture (SPA) Version.
// Corrected button routing and 100% logic parity with original source.

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

const PAGE_REFRESH_SECONDS = 20;

// --- Helper Functions (Sprites, Icons, & Repair) ---

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
	};
	const src = ITEM_SPRITE_OVERRIDES[id] ?? (SMOGON_ITEM_SIDS[id] ? `${SMOGON_SPRITES_ITEM_BASE}${SMOGON_ITEM_SIDS[id]}.png` : null);
	const letter = Utils.escapeHTML((itemId.charAt(0) || '?').toUpperCase());
	const imgHtml = src ? `<img src="${src}" width="40" height="40" alt="" style="image-rendering:pixelated;display:block;flex-shrink:0" onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex'" />` : '';
	return imgHtml + `<span class="pr-item-fallback" style="${src ? 'display:none;' : ''}">${letter}</span>`;
}

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

function repairEmptyPendingChoice(state: PokeRogueState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

// --- Internal SPA Logic ---

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

	// Header
	buf += `<div class="pr-popup-header"><h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main' && !state.gameOver) buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back</button>`;
	buf += `</div>`;

	// GAME OVER SCREEN
	if (state.gameOver) {
		buf += `<div class="pr-gameover" style="text-align:center;padding:20px">`;
		buf += `<div class="pr-gameover-title" style="font-size:24px;color:#ff8080;font-weight:bold;margin-bottom:15px">GAME OVER</div>`;
		buf += `<div style="margin-bottom:10px">Floor Reached: <b>${state.lastRunFloor || 1}</b> | Streaks: <b>${state.lastRunStreaks || 0}</b></div>`;
		// FIXED: Point to /pokerogue newgame to correctly reset state
		buf += `<button name="send" value="/pokerogue newgame confirm" class="button pr-newrun-btn" style="padding:10px 20px;font-size:16px">Start New Run</button>`;
		buf += `</div></div>`;
		return buf;
	}

	// Leaderboard Sub-view
	if (view === 'top') {
		const entries = Object.entries(savedData).filter(([, s]) => (s.highestFloor ?? 0) > 0).sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0)).slice(0, 100);
		const rows = entries.map(([userid, s], i) => {
			const teamStr = (s.team ?? []).map(m => `${getSprite(m.species, 30)}<small>${Dex.species.get(toID(m.species)).name || m.species}</small>`).join(' ');
			return [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, teamStr];
		});
		return buf + Table('PokéRogue Leaderboard', ['#', 'Player', 'Best Floor', 'Last Team'], rows) + `</div>`;
	}

	if (state.notification) buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;

	// Gacha Offer
	if (state.pendingGachaOffer) {
		const sp = Dex.species.get(toID(state.pendingGachaOffer.species));
		const isTeamFull = (state.team?.length ?? 0) >= 6;
		buf += `<div class="pr-gacha-offer" style="text-align:center;padding:15px">${getSprite(sp.id)}<div><b>${sp.name} Capsule Offer</b></div>`;
		buf += `<div class="pr-gacha-offer-actions">${!isTeamFull ? `<button name="send" value="/pokerogue gachaaccept" class="button">Accept</button>` : `<p style="color:#f87171">Team full!</p>`}`;
		buf += `<button name="send" value="/pokerogue gachadecline" class="button">Decline</button></div></div>`;
		return buf + `</div>`;
	}

	// Choice Screen
	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const sp = Dex.species.get(toID(state.pendingChoice[i]));
			buf += `<tr><td>${getSprite(sp.id, 60)}</td><td><b>${sp.name}</b></td><td><button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">Pick</button></td></tr>`;
		}
		return buf + `</tbody></table></div></div>`;
	}

	// Shop Sub-view
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
	if (activeEffects.length) buf += `<div class="pr-active-effects" style="font-size:11px;color:#8ab4f8;background:rgba(90,63,160,0.15);padding:4px;border-radius:6px"><b>Active:</b> ${activeEffects.join(' &nbsp; ')}</div>`;

	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		const sp = Dex.species.get(toID(mon.species));
		const expNeeded = mon.level < 100 ? expForLevel(mon.level + 1) - mon.exp : 0;
		buf += `<div class="pr-popup-mon">${getSprite(sp.id, 52)}<div style="flex:1"><b>${sp.name}</b><br><span style="font-size:11px">Lv.${mon.level} <small>(${expNeeded} EXP)</small></span>${renderExpBar(mon)}`;
		if (mon.heldItem) buf += `<br><span style="font-size:10px;color:#8ab4f8">${SHOP_ITEMS[mon.heldItem]?.name || mon.heldItem}</span>`;
		buf += `</div></div>`;
	}
	buf += `</div>`;

	// Inventory
	const ownedItems = Object.entries(state.items ?? {}).filter(([, qty]) => qty > 0);
	if (ownedItems.length) {
		buf += `<h3>Inventory</h3><div class="pr-inventory-grid">`;
		for (const [id, qty] of ownedItems) {
			const item = SHOP_ITEMS[id];
			buf += `<div class="pr-inventory-item-card"><b>${item?.name || id}</b> (x${qty})<br>`;
			if (item?.heldItem || id === 'rarecandy') {
				buf += `<div style="display:flex;gap:2px">`;
				for (let i = 1; i <= state.team.length; i++) buf += `<button name="send" value="/pokerogue use ${id} ${i}" class="button">${i}</button>`;
				buf += `</div>`;
			} else {
				buf += `<button name="send" value="/pokerogue use ${id}" class="button">Use</button>`;
			}
			buf += `</div>`;
		}
		buf += `</div>`;
	}

	buf += `<div class="pr-popup-actions"><button name="send" value="/pokerogue battle" class="button">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button">Shop</button><button name="send" value="/pokerogue view top" class="button">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080">Quit Run</button></div>`;

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
			// FIXED: Original logic resets state if no run is active
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
			if (['main', 'shop', 'top'].includes(v)) { (state as any).view = v; setState(user.id, state); refreshGamePage(user); }
		},

		battle(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("Start a new run first.");
			if (state.pendingChoice?.length || state.pendingGachaOffer) return this.errorReply("Handle pending choices first.");
			if (startBattle(user, state)) { (state as any).view = 'main'; setState(user.id, state); refreshGamePage(user); }
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
				state.coins! -= item.cost; state.items = state.items ?? {};
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
				const mon = state.team[slot]; mon.level = Math.min(100, mon.level + 5); mon.exp = expForLevel(mon.level);
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
			if (!s) return this.errorReply(`No PokéRogue run found for ${tId}.`);
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
			if (getState(tId)) { deleteState(tId); this.sendReply(`Wiped PokéRogue data for ${tId}.`); }
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
			let html =
				`<b>PokéRogue — Player Commands:</b><br>` +
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
			if (state.hasRevive) { state.hasRevive = false; state.notification = "<b>Revive used!</b> Retrying Floor " + match.floor; }
			else { state.gameOver = true; state.lastRunFloor = match.floor; state.lastRunStreaks = state.streaksWon || 0; state.team = []; }
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
