// pokerogue plugin — main file: html rendering, commands, page handlers, battle hook.
// Refactored for single-page architecture using URL arguments.

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

// page auto-refresh interval while a battle is active or notification is pending
const PAGE_REFRESH_SECONDS = 1;

// --- Rendering Helpers (Sprites & Icons) ---

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
	const onerror = fallback
		? ` onerror="if(this.src!=='${fallback}')this.src='${fallback}'"`
		: '';
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
	sitrusberry: 'i158', aguavberry: 'i162',
	flameorb: 'i273', toxicorb: 'i272',
	whiteherb: 'i214', powerherb: 'i271',
	throatspray: 'i1118', blunderpolicy: 'i1121', shedshell: 'i295',
	silkscarf: 'i251', blackbelt: 'i241', magnet: 'i242',
	mysticwater: 'i243', miracleseed: 'i239', charcoal: 'i249',
	nevermeltice: 'i246', softsand: 'i237', sharpbeak: 'i244',
	poisonbarb: 'i245', twistedspoon: 'i248', silverpowder: 'i222',
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
	const src = ITEM_SPRITE_OVERRIDES[id] ??
		(sid ? `${SMOGON_SPRITES_ITEM_BASE}${sid}.png` : null);
	const letter = Utils.escapeHTML((itemId.charAt(0) || '?').toUpperCase());
	const imgHtml = src
		? `<img src="${src}" width="40" height="40" alt="" ` +
			`style="image-rendering:pixelated;display:block;flex-shrink:0" ` +
			`onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex'" />`
		: '';
	return imgHtml +
		`<span style="${src ? 'display:none;' : ''}width:40px;height:40px;align-items:center;justify-content:center;` +
		`font-size:17px;font-weight:bold;color:#c4a8ff;background:rgba(90,63,160,0.35);` +
		`border-radius:7px;flex-shrink:0">${letter}</span>`;
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
		Normal: '9fa19f', Fire: 'e62829', Water: '2980ef', Grass: '3fa129',
		Electric: 'fac000', Ice: '3dcef3', Fighting: 'ff8000', Poison: '9141cb',
		Ground: '915121', Flying: '81b9ef', Psychic: 'ef4179', Bug: '91a119',
		Rock: 'afa981', Ghost: '704170', Dragon: '5060e1', Dark: '624d4e',
		Steel: '60a1b8', Fairy: 'ef70ef',
	};
	return colors[type] ?? '68a090';
}

function renderTypeBadge(types: string[], large = false): string {
	return types.map(t =>
		`<span style="background:#${typeColor(t)};color:#fff;border-radius:${large ? '4px' : '3px'};` +
		`padding:${large ? '2px 6px' : '1px 5px'};font-size:${large ? '10px' : '9px'};font-weight:bold">${t}</span>`
	).join(' ');
}

function renderLeaderboard(): string {
	const entries = Object.entries(savedData)
		.filter(([, s]) => (s.highestFloor ?? 0) > 0)
		.sort((a, b) => (b[1].highestFloor ?? 0) - (a[1].highestFloor ?? 0))
		.slice(0, 100);

	if (!entries.length) return '<em>No records yet!</em>';

	const rows = entries.map(([userid, s], i) => {
		const rank = i + 1;
		const display = s.displayName || userid;
		const teamStr = (s.team ?? []).map(m => `${getSprite(m.species, 30)}<small>${Utils.escapeHTML(Dex.species.get(toID(m.species)).name || m.species)}</small>`).join(' ');
		return [rank === 1 ? '#1' : rank === 2 ? '#2' : rank === 3 ? '#3' : `${rank}.`, Impulse.nameColor(display, true, true), `Floor ${s.highestFloor ?? 0}`, teamStr];
	});

	return Table('PokéRogue Top 100', ['#', 'Player', 'Best Floor', 'Last Team'], rows);
}

// --- REFACTORED PAGE LOGIC ---

/**
 * REWRITTEN: Consolidated Page Refresh.
 * Instead of multiple pageIDs, we always target the base 'view-pokerogue'.
 */
function refreshGamePage(user: User): void {
	for (const conn of user.connections) {
		conn.send(`>view-pokerogue\n|refresh|`);
	}
}

/**
 * REWRITTEN: Unified Page Renderer.
 * view = 'main' | 'shop' | 'top'
 */
function renderGamePage(state: PokeRogueState, view: 'main' | 'shop' | 'top' = 'main'): string {
	let buf = (state.battleRoomId || state.notification) ? `<meta http-equiv="refresh" content="${PAGE_REFRESH_SECONDS}">` : '';
	buf += `<div class="pr-popup">`;

	// --- Header ---
	buf += `<div class="pr-popup-header">`;
	buf += `<h2>PokéRogue${view !== 'main' ? ` - ${view.toUpperCase()}` : ''}</h2>`;
	if (state.team?.length && view !== 'top') {
		buf += `<div style="display:flex;gap:6px;align-items:center">` +
			`<span class="pr-floor-badge">Floor ${state.floor}</span>` +
			`<span class="pr-coin-badge">${state.coins ?? 0} Coins</span>` +
			`</div>`;
	}
	if (view !== 'main') {
		buf += `<a href="/view-pokerogue" class="button" style="margin-left:auto">Back to Home</a>`;
	}
	buf += `</div>`;

	// --- Leaderboard View ---
	if (view === 'top') {
		return buf + renderLeaderboard() + `</div>`;
	}

	// Notifications
	if (state.notification) {
		buf += `<div class="pr-notification">${state.notification}` +
			`<button name="send" value="/pokerogue dismissnotif" class="pr-notification-dismiss">x</button>` +
			`</div>`;
	}

	// --- Priority Screens (Gacha/Battle/Choices) ---
	if (state.pendingGachaOffer && !state.battleRoomId) {
		const { species, sourceItemId, isFeatured } = state.pendingGachaOffer;
		const sp = Dex.species.get(toID(species));
		buf += `<div class="pr-gacha-offer"><div style="text-align:center">${getSpriteWithBall(species, 80)}` +
			`<div><b>${Utils.escapeHTML(sp.name)}</b></div></div>` +
			`<div class="pr-gacha-offer-actions">` +
			`<button name="send" value="/pokerogue gachaaccept" class="button">Accept</button>` +
			`<button name="send" value="/pokerogue gachadecline" class="button">Decline</button></div></div>`;
		return buf + `</div>`;
	}

	if (state.battleRoomId) {
		return buf + `<div style="text-align:center;padding:14px 0"><p style="color:#f5c518;font-weight:bold">Battle in progress!</p></div></div>`;
	}

	if (state.pendingChoice?.length) {
		buf += `<h2 class="pr-choice-heading">${state.pendingChoiceType === 'add' ? 'Milestone! Add to Team:' : 'Choose a starter!'}</h2>`;
		buf += `<div style="overflow-x:auto"><table class="pr-choice-table"><tbody>`;
		for (let i = 0; i < state.pendingChoice.length; i++) {
			const s = state.pendingChoice[i];
			const sp = Dex.species.get(toID(s));
			buf += `<tr class="pr-choice-row"><td>${getSpriteWithBall(s, 60)}</td><td><b>${Utils.escapeHTML(sp.name)}</b></td>`;
			buf += `<td><button name="send" value="/pokerogue choose ${i + 1}" class="button">Pick</button></td></tr>`;
		}
		buf += `</tbody></table></div></div>`;
		return buf;
	}

	if (state.gameOver) {
		buf += `<div class="pr-gameover"><div class="pr-gameover-title">Game Over!</div>` +
			`<button name="send" value="/pokerogue newgame" class="button">New Run</button></div></div>`;
		return buf;
	}

	// --- Shop View ---
	if (view === 'shop') {
		const shopCoins = state.coins ?? 0;
		buf += `<div class="pr-shop-grid">`;
		for (const itemId of (state.shopInventory ?? rollShopInventory())) {
			const item = SHOP_ITEMS[itemId];
			if (!item) continue;
			const canAfford = shopCoins >= item.cost;
			buf += `<div class="pr-shop-card"><div class="pr-shop-card-top">${getItemSprite(item.heldItem ?? item.id)}` +
				`<div style="flex:1"><b>${Utils.escapeHTML(item.name)}</b></div></div>` +
				`<div class="pr-shop-item-desc">${Utils.escapeHTML(item.description)}</div>` +
				`<button name="send" value="/pokerogue buy ${item.id}" class="button" ${canAfford ? '' : 'disabled'}>Buy: ${item.cost}</button></div>`;
		}
		buf += `</div><div class="pr-shop-footer"><button name="send" value="/pokerogue refreshshop" class="button">Reroll (5c)</button>` +
			`<div class="pr-shop-footer-nav"><a href="/view-pokerogue" class="button">Back</a>` +
			`<button name="send" value="/pokerogue battle" class="button">Battle!</button></div></div>`;
		return buf + `</div>`;
	}

	// --- Main Dashboard ---
	buf += `<div class="pr-popup-stats"><span>Floor <b>${state.floor}</b></span><span>Coins <b>${state.coins ?? 0}</b></span></div>`;
	buf += `<h3>Your Team</h3><div class="pr-popup-team">`;
	for (const mon of state.team) {
		buf += `<div class="pr-popup-mon">${getSpriteWithBall(mon.species, 52)}<div style="flex:1">` +
			`<b>${Utils.escapeHTML(Dex.species.get(toID(mon.species)).name)}</b><br>` +
			`<span style="font-size:11px;color:#8ab4f8">Lv.${mon.level}</span>${renderExpBar(mon)}</div></div>`;
	}
	buf += `</div>`;

	// Inventory
	const ownedItems = Object.entries(state.items ?? {}).filter(([, qty]) => qty > 0);
	if (ownedItems.length) {
		buf += `<h3>Inventory</h3><div class="pr-inventory-grid">`;
		for (const [id, qty] of ownedItems) {
			const item = SHOP_ITEMS[id];
			buf += `<div class="pr-inventory-item"><b>${Utils.escapeHTML(item?.name ?? id)}</b> (x${qty})</div>`;
		}
		buf += `</div>`;
	}

	buf += `<div class="pr-popup-actions" style="margin-top:12px">`;
	buf += `<button name="send" value="/pokerogue battle" class="button">Start Battle</button>`;
	buf += `<a href="/view-pokerogue-shop" class="button">Shop</a>`;
	buf += `<a href="/view-pokerogue-top" class="button">Leaderboard</a>`;
	buf += `<button name="send" value="/pokerogue quit" class="button" style="color:#ff8080">Quit</button></div>`;

	buf += `</div>`;
	return buf;
}

// --- Commands & Page Handlers ---

export const commands: Chat.ChatCommands = {
	pokerogue: {
		start(target, room, user) {
			const state = getState(user.id);
			if (!state) setState(user.id, { floor: 1, team: [], pendingChoice: pickStarterOptions(), pendingChoiceType: 'starter' } as any);
			return this.parse('/join view-pokerogue');
		},
		newgame(target, room, user) {
			deleteState(user.id);
			return this.parse('/pokerogue start');
		},
		shop(target, room, user) {
			return this.parse('/join view-pokerogue-shop');
		},
		battle(target, room, user) {
			const state = getState(user.id);
			if (state && startBattle(user, state)) refreshGamePage(user);
		},
		choose(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingChoice) return;
			const n = parseInt(target) - 1;
			const choice = state.pendingChoice[n];
			if (state.pendingChoiceType === 'starter') {
				state.team = [{ species: choice, level: 1, exp: 0 }];
			} else {
				state.team.push({ species: choice, level: Math.max(1, state.floor - 2), exp: expForLevel(Math.max(1, state.floor - 2)) });
			}
			delete state.pendingChoice;
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
		gachaaccept: (target, room, user) => {
			const state = getState(user.id);
			if (state?.pendingGachaOffer) {
				state.team.push({ species: state.pendingGachaOffer.species, level: Math.max(1, state.floor - 2), exp: 0 });
				delete state.pendingGachaOffer;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},
		gachadecline: (target, room, user) => {
			const state = getState(user.id);
			if (state?.pendingGachaOffer) {
				delete state.pendingGachaOffer;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},
		quit(target, room, user) {
			deleteState(user.id);
			refreshGamePage(user);
		},
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

		// View Routing
		const view = (args[0] as 'main' | 'shop' | 'top') || 'main';
		this.title = `PokéRogue${view !== 'main' ? ` - ${view.charAt(0).toUpperCase() + view.slice(1)}` : ''}`;

		return renderGamePage(state, view);
	},
};

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
			const coins = floorCoinReward(state.floor);
			state.coins = (state.coins ?? 0) + coins;
			state.floor++;
			state.notification = `Floor Cleared! +${coins} coins.`;
			if (state.floor % 5 === 0 && state.team.length < 6) {
				state.pendingChoice = pickNewPokemonOptions(state.team, state.floor);
				state.pendingChoiceType = 'add';
			}
		} else {
			state.gameOver = true;
		}
		setState(match.userId, state);
		if (humanUser) refreshGamePage(humanUser);
	},
};

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

// exposed for unit tests only — not part of the public plugin API
export const testables = {
	getSprite,
	getPokeballInfo,
	getItemSprite,
	getSpriteWithBall,
	renderGamePopup,
	ITEM_SPRITE_OVERRIDES,
	SMOGON_ITEM_SIDS,
	SMOGON_SPRITES_ITEM_BASE,
	POKESPRITE_ITEM_BASE,
};
