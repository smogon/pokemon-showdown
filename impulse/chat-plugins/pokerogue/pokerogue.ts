// pokerogue plugin — refactored for a true single-page application (SPA).
// Navigation uses internal state to update the current window instead of opening new tabs.

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

const SMOGON_SPRITES_ITEM_BASE = 'https://raw.githubusercontent.com/smogon/sprites/master/src/minisprites/items/';
const POKESPRITE_ITEM_BASE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/items/';

const SMOGON_ITEM_SIDS: Record<string, string> = {
	pokeball: 'i4', masterball: 'i1', greatball: 'i3', ultraball: 'i2',
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

const ITEM_SPRITE_OVERRIDES: Record<string, string> = {
	mastercapsule: `${SMOGON_SPRITES_ITEM_BASE}i1.png`,
	ultracapsule: `${SMOGON_SPRITES_ITEM_BASE}i2.png`,
	greatcapsule: `${SMOGON_SPRITES_ITEM_BASE}i3.png`,
	rarecandy: `${POKESPRITE_ITEM_BASE}medicine/rare-candy.png`,
	revive: `${POKESPRITE_ITEM_BASE}medicine/revive.png`,
	luckycharm: `${POKESPRITE_ITEM_BASE}hold-item/lucky-egg.png`,
};

function getPokeballInfo(speciesId: string): { src: string, alt: string } {
	const sp = Dex.species.get(toID(speciesId));
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

function getItemSprite(itemId: string): string {
	const id = toID(itemId);
	const sid = SMOGON_ITEM_SIDS[id];
	const src = ITEM_SPRITE_OVERRIDES[id] ?? (sid ? `${SMOGON_SPRITES_ITEM_BASE}${sid}.png` : null);
	const imgHtml = src ? `<img src="${src}" width="40" height="40" alt="" style="image-rendering:pixelated" onerror="this.style.display='none'" />` : '';
	return imgHtml || `<span class="pr-item-fallback">${itemId.charAt(0).toUpperCase()}</span>`;
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

function renderTypeBadge(types: string[], large = false): string {
	const colors: Record<string, string> = {
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129', Electric: 'fac000', Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb',
		Ground: '915121', Flying: '81b9ef', Psychic: 'ef4179', Bug: '91a119', Rock: 'afa981', Ghost: '704170', Dragon: '5060e1', Dark: '624d4e',
		Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return types.map(t => `<span style="background:#${colors[t] || '68a090'};color:#fff;border-radius:${large ? '4px' : '3px'};padding:${large ? '2px 6px' : '1px 5px'};font-size:${large ? '10px' : '9px'};font-weight:bold">${t}</span>`).join(' ');
}

// --- REFACTORED CORE LOGIC ---

/**
 * FIXED: Refresh Navigation.
 * Instead of /join view-pokerogue-shop, we always rejoin base 'view-pokerogue'.
 * Showdown client updates the current tab if the room ID remains the same.
 */
function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('pokerogue')) {
			Chat.parse(`/join view-pokerogue`, null, user, conn);
		}
	}
}

/**
 * FIXED: SPA View Renderer.
 * Determines content based on internal state. All "Back" and "Shop" buttons 
 * now trigger commands instead of direct URL links to avoid new tabs.
 */
function renderGamePage(state: PokeRogueState): string {
	const view = (state as any).view || 'main'; // Use internal state property
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	// --- Header (SPA Navigation) ---
	buf += `<div class="pr-popup-header">`;
	buf += `<h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main') {
		buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back to Game</button>`;
	}
	buf += `</div>`;

	// --- View Routing ---
	if (view === 'top') {
		const entries = Object.entries(savedData).filter(([, s]) => (s.highestFloor ?? 0) > 0).sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0)).slice(0, 100);
		const rows = entries.map(([userid, s], i) => [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, '...']);
		return buf + Table('Top Players', ['#', 'Player', 'Best Floor', 'Team'], rows) + `</div>`;
	}

	if (state.notification) {
		buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;
	}

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#f5c518;font-weight:bold">Battle in progress!</p></div></div>`;

	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">Choose a Pokémon:</h2><div style="overflow-x:auto"><table class="pr-choice-table"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const s = state.pendingChoice[i];
			const sp = Dex.species.get(toID(s));
			buf += `<tr class="pr-choice-row"><td>${getSpriteWithBall(s, 60)}</td><td><b>${sp.name}</b></td><td><button name="send" value="/pokerogue choose ${i + 1}" class="button">Pick</button></td></tr>`;
		}
		return buf + `</tbody></table></div></div>`;
	}

	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-grid">`;
		for (const itemId of state.shopInventory) {
			const item = SHOP_ITEMS[itemId];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card"><b>${item.name}</b><br><small>${item.description}</small>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button></div>`;
		}
		buf += `</div><div class="pr-shop-footer">`;
		buf += `<button name="send" value="/pokerogue refreshshop" class="button">Reroll (5c)</button>`;
		buf += `<button name="send" value="/pokerogue view main" class="button">Back</button></div>`;
		return buf + `</div>`;
	}

	// --- Main Dashboard ---
	buf += `<div class="pr-popup-stats"><span>Floor <b>${state.floor}</b></span><span>Coins <b>${state.coins ?? 0}</b></span></div>`;
	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1"><b>${Dex.species.get(toID(mon.species)).name}</b><br>Lv.${mon.level}${renderExpBar(mon)}</div></div>`;
	}
	buf += `</div><div class="pr-popup-actions" style="margin-top:12px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080">Quit</button></div>`;

	return buf + `</div>`;
}

// --- Commands & Page Handlers ---

export const commands: Chat.ChatCommands = {
	pokerogue: {
		start(target, room, user) {
			let state = getState(user.id);
			if (!state) {
				state = { floor: 1, team: [], pendingChoice: pickStarterOptions(), pendingChoiceType: 'starter', coins: 0 } as any;
				setState(user.id, state);
			}
			return this.parse('/join view-pokerogue');
		},

		// FIXED: New 'view' command sets internal state and refreshes SAME tab
		view(target, room, user) {
			if (!user.named) return;
			const state = getState(user.id);
			if (!state) return;
			const targetView = target.trim() as any;
			if (['main', 'shop', 'top'].includes(targetView)) {
				(state as any).view = targetView;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		shop: 'view shop',
		top: 'view top',

		battle(target, room, user) {
			const state = getState(user.id);
			if (state && startBattle(user, state)) {
				(state as any).view = 'main'; // Ensure we return to main view on battle start
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		choose(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingChoice) return;
			const n = parseInt(target) - 1;
			if (isNaN(n) || n < 0 || n >= state.pendingChoice.length) return;
			const choice = state.pendingChoice[n];
			if (state.pendingChoiceType === 'starter') {
				state.team = [{ species: choice, level: 1, exp: 0 }];
			} else {
				state.team.push({ species: choice, level: Math.max(1, state.floor - 2), exp: expForLevel(Math.max(1, state.floor - 2)) });
			}
			delete state.pendingChoice;
			delete state.pendingChoiceType;
			setState(user.id, state);
			refreshGamePage(user);
		},

		buy(target, room, user) {
			const state = getState(user.id);
			const item = SHOP_ITEMS[toID(target)];
			if (state && item && (state.coins ?? 0) >= item.cost) {
				state.coins! -= item.cost;
				state.items = state.items ?? {};
				state.items[item.id] = (state.items[item.id] ?? 0) + 1;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		dismissnotif(target, room, user) {
			const state = getState(user.id);
			if (state?.notification) {
				delete state.notification;
				setState(user.id, state);
			}
			refreshGamePage(user);
		},
		quit: (target, room, user) => { deleteState(user.id); refreshGamePage(user); },
	},
};

export const pages: Chat.PageTable = {
	pokerogue(args, user) {
		if (!user.named) return this.errorReply('Login required.');
		const state = getState(user.id);
		
		if (!state || (!state.team?.length && !state.pendingChoice?.length && !state.battleRoomId && !state.gameOver)) {
			return `<div class="pr-popup"><div class="pr-popup-header"><h2>PokéRogue</h2></div>` +
				`<div style="text-align:center;padding:16px"><button name="send" value="/pokerogue start" class="button">Start New Run</button></div></div>`;
		}

		// FIXED: Page handler ignores URL args to prioritize internal state view
		const view = (state as any).view || 'main';
		this.title = `PokéRogue - ${view.toUpperCase()}`;
		return renderGamePage(state);
	},
};

// --- Battle Handlers ---

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
		const humanWon = toID(winner) === match.userId;

		if (humanWon) {
			state.coins = (state.coins ?? 0) + floorCoinReward(state.floor);
			state.floor++;
			state.notification = `Floor Cleared!`;
		} else {
			state.gameOver = true;
		}
		setState(match.userId, state);
		const humanUser = Users.get(match.userId);
		if (humanUser) refreshGamePage(humanUser);
	},
};

// --- Format Registration ---

export const start = (): void => {
	// Guard BasicRoom.destroy logic for hot-reloading stability
	if (!(Rooms.BasicRoom.prototype as any).__pokerogueDestroyPatched) {
		const _origDestroy = Rooms.BasicRoom.prototype.destroy;
		Rooms.BasicRoom.prototype.destroy = function (this: any) {
			if (!Rooms.global) {
				const roomsGlobalStub = { deregisterChatRoom: () => {}, delistChatRoom: () => {} };
				(Rooms as any).global = roomsGlobalStub as any;
				try { _origDestroy.call(this); } finally { if ((Rooms as any).global === roomsGlobalStub) (Rooms as any).global = null; }
				return;
			}
			return _origDestroy.call(this);
		};
		(Rooms.BasicRoom.prototype as any).__pokerogueDestroyPatched = true;
	}

	const { Dex } = require('../../../sim/dex') as typeof import('../../../sim/dex');
	const { Format } = require('../../../sim/dex-formats') as typeof import('../../../sim/dex-formats');

	const FORMAT_ID = 'roguelikebattle' as ID;
	if (Dex.formats.rulesetCache.has(FORMAT_ID)) return;

	Dex.formats.load();
	const format = new Format({
		name: 'Roguelike Battle',
		mod: 'gen9',
		effectType: 'Format',
		section: 'Roguelike',
		ruleset: ['Max Team Size = 6', 'Max Level = 100', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		rated: false,
	});
	Dex.formats.rulesetCache.set(FORMAT_ID, format);
	(Dex.formats.formatsListCache as any)?.push(format);
};

export const testables = {
	getSprite, getPokeballInfo, getItemSprite, getSpriteWithBall,
	renderGamePage, ITEM_SPRITE_OVERRIDES, SMOGON_ITEM_SIDS,
	SMOGON_SPRITES_ITEM_BASE, POKESPRITE_ITEM_BASE,
};
