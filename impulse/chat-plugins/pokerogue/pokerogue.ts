// pokerogue plugin — main file: html rendering, commands, page handlers, battle hook.
// Refactored for a true single-page application (SPA) architecture.

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
 * FIXED: Robust Page Refresh.
 * Instead of simple |refresh|, this forces a re-join of the base 'view-pokerogue' window.
 * This ensures the client receives the updated SPA HTML whenever state changes.
 */
function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('pokerogue')) {
			Chat.parse(`/join view-pokerogue`, null, user, conn);
		}
	}
}

/**
 * REWRITTEN: Single Page Renderer.
 * Unified rendering function that checks state.view and state.gameOver 
 * to provide a seamless tab-free experience.
 */
function renderGamePage(state: PokeRogueState): string {
	const view = (state as any).view || 'main';
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	// --- Header Navigation ---
	buf += `<div class="pr-popup-header">`;
	buf += `<h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (view !== 'main' && !state.gameOver) {
		buf += `<button name="send" value="/pokerogue view main" class="button" style="margin-left:auto">Back to Home</button>`;
	}
	buf += `</div>`;

	// --- GLOBAL GAME OVER OVERRIDE ---
	if (state.gameOver) {
		buf += `<div class="pr-gameover" style="text-align:center;padding:20px">`;
		buf += `<div class="pr-gameover-title" style="font-size:24px;color:#ff8080;font-weight:bold;margin-bottom:15px">GAME OVER</div>`;
		buf += `<div style="margin-bottom:20px;color:#8ab4f8">Your run has ended. All Pokémon have fainted.</div>`;
		buf += `<button name="send" value="/pokerogue newgame" class="button pr-newrun-btn" style="padding:10px 20px;font-size:16px">Start New Run</button>`;
		buf += `</div></div>`;
		return buf;
	}

	// --- View Routing ---
	if (view === 'top') {
		const entries = Object.entries(savedData).filter(([, s]) => (s.highestFloor ?? 0) > 0).sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0)).slice(0, 100);
		const rows = entries.map(([userid, s], i) => [i + 1, Impulse.nameColor(s.displayName || userid, true, true), `Floor ${s.highestFloor}`, '—']);
		return buf + Table('Leaderboard', ['#', 'Player', 'Best Floor', 'Team'], rows) + `</div>`;
	}

	if (state.notification) {
		buf += `<div class="pr-notification">${state.notification}<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button></div>`;
	}

	if (state.battleRoomId) return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#fac000;font-weight:bold">Battle in progress!</p></div></div>`;

	// Pokemon Selection Milestone
	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const s = state.pendingChoice[i];
			const sp = Dex.species.get(toID(s));
			buf += `<tr class="pr-choice-row"><td>${getSpriteWithBall(s, 60)}</td><td><b>${Utils.escapeHTML(sp.name)}</b></td>`;
			buf += `<td><button name="send" value="/pokerogue choose ${i + 1}" class="button pr-pick-btn">Pick</button></td></tr>`;
		}
		return buf + `</tbody></table></div></div>`;
	}

	// Shop Sub-view
	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		if (!state.shopInventory) state.shopInventory = rollShopInventory();
		buf += `<div class="pr-shop-grid">`;
		for (const itemId of state.shopInventory) {
			const item = SHOP_ITEMS[itemId];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card"><div class="pr-shop-card-top">${getItemSprite(item.heldItem ?? item.id)}<b>${Utils.escapeHTML(item.name)}</b></div>`;
			buf += `<div class="pr-shop-item-desc">${Utils.escapeHTML(item.description)}</div>`;
			buf += `<button name="send" value="/pokerogue buy ${item.id}" class="button pr-shop-buy-btn" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button></div>`;
		}
		buf += `</div><div class="pr-shop-footer"><button name="send" value="/pokerogue refreshshop" class="button">Reroll (5c)</button>`;
		buf += `<div class="pr-shop-footer-nav"><button name="send" value="/pokerogue view main" class="button">Back</button>`;
		buf += `<button name="send" value="/pokerogue battle" class="button">Battle!</button></div></div>`;
		return buf + `</div>`;
	}

	// --- Main Dashboard ---
	buf += `<div class="pr-popup-stats"><span>Floor <b>${state.floor}</b></span><span>Coins <b>${state.coins ?? 0}</b></span></div>`;
	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1"><b>${Utils.escapeHTML(Dex.species.get(toID(mon.species)).name)}</b><br><span style="font-size:11px;color:#8ab4f8">Lv.${mon.level}</span>${renderExpBar(mon)}</div></div>`;
	}
	buf += `</div><div class="pr-popup-actions" style="margin-top:12px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button">Start Battle</button>`;
	buf += `<button name="send" value="/pokerogue view shop" class="button">Shop</button>`;
	buf += `<button name="send" value="/pokerogue view top" class="button">Leaderboard</button>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080">Quit Run</button></div>`;

	return buf + `</div>`;
}

// --- Commands ---

export const commands: Chat.ChatCommands = {
	pokerogue: {
		start(target, room, user) {
			let state = getState(user.id);
			if (!state || state.gameOver) {
				state = { floor: 1, team: [], pendingChoice: pickStarterOptions(), pendingChoiceType: 'starter', coins: 0 } as any;
				setState(user.id, state);
			}
			return this.parse('/join view-pokerogue');
		},

		newgame(target, room, user) {
			deleteState(user.id);
			return this.parse('/pokerogue start');
		},

		view(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return;
			const targetView = target.trim() as any;
			if (['main', 'shop', 'top'].includes(targetView)) {
				(state as any).view = targetView;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		battle(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("The run is over. Start a new run first.");
			if (startBattle(user, state)) {
				(state as any).view = 'main';
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		choose(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingChoice || state.gameOver) return;
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

		const humanUser = Users.get(match.userId);
		const state = getState(match.userId);
		if (!state) return;

		delete state.battleRoomId;
		const humanWon = toID(winner) === match.userId;

		if (humanWon) {
			state.coins = (state.coins ?? 0) + floorCoinReward(state.floor);
			state.floor++;
			state.notification = `Floor Cleared!`;
		} else {
			// FIXED: Reset run stats upon loss so dashboard doesn't show stale info
			state.gameOver = true;
			state.floor = 1;
			state.team = [];
			state.coins = 0;
			state.streaksWon = 0;
			delete state.shopInventory;
			delete state.notification;
			delete (state as any).view;
		}
		setState(match.userId, state);
		if (humanUser) refreshGamePage(humanUser);
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
		ruleset: ['Max Team Size = 6', 'Max Level = 100', 'Default Level = 5', 'HP Percentage Mod', 'Cancel Mod'],
		rated: false,
	});
	Dex.formats.rulesetCache.set(FORMAT_ID, format);
};

export const testables = {
	getSprite, getPokeballInfo, getItemSprite, getSpriteWithBall,
	renderGamePage, ITEM_SPRITE_OVERRIDES, SMOGON_ITEM_SIDS,
	SMOGON_SPRITES_ITEM_BASE, POKESPRITE_ITEM_BASE,
};
