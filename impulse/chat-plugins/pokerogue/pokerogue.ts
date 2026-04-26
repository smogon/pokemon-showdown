/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

import { SHOP_ITEMS, rollShopInventory } from './pokerogue-items';
import { type PokemonEntry, type PokeRogueState } from './pokerogue-types';
import { getState, setState, deleteState } from './pokerogue-state';
import {
	pickStarterOptions, pickNewPokemonOptions,
	expForLevel, floorCoinReward,
	applyExpAndLevelUp, getLevelUpEvo,
	getLevelUpMoves, rollGachaPokemon,
	getMovesLearnedBetween, botLevel,
} from './pokerogue-pokemon';
import { renderGamePage, refreshGamePage } from './pokerogue-render';
import {
	activeMatches,
	startBattle, destroyBotUser,
} from './pokerogue-battle';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function repairEmptyPendingChoice(state: PokeRogueState, userId: string): void {
	if (!state.pendingChoice || state.pendingChoice.length) return;
	if (state.pendingChoiceType === 'add' && state.team?.length) {
		state.pendingChoice = pickNewPokemonOptions(state.team, state.floor - 1);
	} else {
		state.pendingChoice = pickStarterOptions();
	}
	setState(userId, state);
}

/**
 * Apply level-up moves / evolution chains to a single Pokémon after it gains
 * EXP, and queue any move-learning prompts.  Returns detail messages.
 */
function processLevelUp(
	mon: PokemonEntry,
	oldLevel: number,
	oldSpecies: string,
	evolved: boolean,
	teamIdx: number,
	state: PokeRogueState,
): string[] {
	const detailMsgs: string[] = [];

	if (evolved) {
		detailMsgs.push(`<b>${oldSpecies}</b> evolved into <b>${mon.species}</b> and reached Lv. ${mon.level}!`);
	} else if (mon.level > oldLevel) {
		detailMsgs.push(`<b>${mon.species}</b> reached Lv. ${mon.level}!`);
	}

	if (!mon.moves) mon.moves = getLevelUpMoves(mon.species, oldLevel);

	const newMoves = getMovesLearnedBetween(oldSpecies, oldLevel, mon.level);
	if (evolved) {
		const evoMoves = getMovesLearnedBetween(mon.species, oldLevel, mon.level, true);
		for (const m of evoMoves) {
			if (!newMoves.includes(m)) newMoves.push(m);
		}
	}

	state.pendingMoves = state.pendingMoves ?? [];

	for (const move of newMoves) {
		if (mon.moves.includes(move)) continue;
		if (state.pendingMoves.some(p => p.pokemonIndex === teamIdx && p.move === move)) continue;

		if (mon.moves.length < 4) {
			mon.moves.push(move);
			detailMsgs.push(`<b>${mon.species}</b> learned <b>${Dex.moves.get(move).name}</b>!`);
		} else {
			state.pendingMoves.push({ pokemonIndex: teamIdx, move, speciesName: mon.species });
		}
	}

	return detailMsgs;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

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
				const highestFloor = state?.highestFloor || 0;
				const displayName = state?.displayName || user.name;
				const recordTeam = state?.recordTeam || [];

				state = { floor: 1, team: [], pendingChoice: pickStarterOptions(), pendingChoiceType: 'starter', coins: 150, streaksWon: 0, highestFloor, displayName, recordTeam } as any;
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

			const highestFloor = existing?.highestFloor || 0;
			const displayName = existing?.displayName || user.name;
			const recordTeam = existing?.recordTeam || [];

			const newState = {
				floor: 1,
				team: [],
				pendingChoice: pickStarterOptions(),
				pendingChoiceType: 'starter',
				coins: 150,
				streaksWon: 0,
				highestFloor,
				displayName,
				recordTeam,
			} as any;

			setState(user.id, newState);
			return this.parse('/pokerogue start');
		},

		view(target, room, user) {
			const state = getState(user.id);
			if (!state) return;
			const v = target.trim() as any;
			if (['main', 'shop', 'top', 'bag', 'resetconfirm'].includes(v)) {
				(state as any).view = v;
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		battle(target, room, user) {
			const state = getState(user.id);
			if (!state || state.gameOver) return this.errorReply("The run is over. Start a new run first.");

			if (state.pendingChoice?.length || state.pendingGachaOffer || state.pendingMoves?.length || state.pendingSwap) {
				return this.errorReply("Handle pending choices or team swaps first.");
			}

			if (startBattle(user, state)) {
				(state as any).view = 'main';
				setState(user.id, state);
				refreshGamePage(user);
			}
		},

		learnmove(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingMoves?.length) return;

			const pending = state.pendingMoves[0];
			const mon = state.team[pending.pokemonIndex];
			if (!mon.moves) mon.moves = getLevelUpMoves(mon.species, mon.level);

			const targetTrimmed = target.trim();

			if (targetTrimmed === 'skip') {
				state.notification = `Your Pokémon gave up on learning <b>${Dex.moves.get(pending.move).name}</b>.`;
			} else {
				const slot = parseInt(targetTrimmed) - 1;
				if (isNaN(slot) || slot < 0 || slot >= mon.moves.length) return this.errorReply("Invalid move slot.");

				const oldMoveName = Dex.moves.get(mon.moves[slot]).name;
				const newMoveName = Dex.moves.get(pending.move).name;

				mon.moves[slot] = pending.move;
				state.notification = `Forgot ${oldMoveName} and learned <b>${newMoveName}</b>!`;
			}

			state.pendingMoves.shift();
			setState(user.id, state);
			refreshGamePage(user);
		},

		swapmon(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingSwap) return;

			const targetTrimmed = target.trim();
			const newMon = state.pendingSwap;
			const spName = Dex.species.get(toID(newMon.species)).name;

			if (targetTrimmed === 'skip') {
				state.notification = `You let the new Pokémon go.`;
			} else {
				const slot = parseInt(targetTrimmed) - 1;
				if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");

				const oldMonName = Dex.species.get(toID(state.team[slot].species)).name;

				if (state.team[slot].heldItem) {
					const heldId = state.team[slot].heldItem;
					const shopEntry = Object.entries(SHOP_ITEMS).find(([, i]) => i.heldItem === heldId);
					const bagId = shopEntry ? shopEntry[0] : heldId;

					state.items = state.items || {};
					state.items[bagId] = (state.items[bagId] || 0) + 1;
				}

				state.team[slot] = newMon;

				if (state.pendingMoves) {
					state.pendingMoves = state.pendingMoves.filter(p => p.pokemonIndex !== slot);
				}

				state.notification = `You replaced ${oldMonName} with <b>${spName}</b>!`;
			}

			delete state.pendingSwap;
			setState(user.id, state);
			refreshGamePage(user);
		},

		choose(target, room, user) {
			const state = getState(user.id);
			const n = parseInt(target) - 1;
			if (!state?.pendingChoice || isNaN(n) || n < 0 || n >= state.pendingChoice.length) return;
			const choice = state.pendingChoice[n];

			let addedLevel = 1;
			if (state.pendingChoiceType !== 'starter') {
				addedLevel = Math.max(1, botLevel(state.floor) - 2);
			}

			let finalSpecies = choice;
			while (true) {
				const evo = getLevelUpEvo(finalSpecies);
				if (!evo || addedLevel < evo.evoLevel) break;
				finalSpecies = evo.evoTo;
			}

			const initialMoves = getLevelUpMoves(finalSpecies, addedLevel);
			const newMon: PokemonEntry = { species: finalSpecies, level: addedLevel, exp: expForLevel(addedLevel), moves: initialMoves };

			if (state.pendingChoiceType === 'starter') {
				state.team = [newMon];
			} else if (state.team.length < 6) {
				state.team.push(newMon);
			} else {
				state.pendingSwap = newMon;
			}

			delete state.pendingChoice; delete state.pendingChoiceType;
			setState(user.id, state); refreshGamePage(user);
		},

		buy(target, room, user) {
			const state = getState(user.id);
			if (!state) return;

			if (state.battleRoomId) {
				return this.errorReply("You cannot buy items while a battle is in progress.");
			}
			if (state.pendingChoice?.length || state.pendingGachaOffer || state.pendingMoves?.length || state.pendingSwap) {
				return this.errorReply("Please resolve your pending choices before using the shop.");
			}

			const item = SHOP_ITEMS[toID(target)];
			if (item && (state.coins ?? 0) >= item.cost && state.shopInventory?.includes(item.id)) {
				state.coins! -= item.cost;
				state.items = state.items ?? {};
				state.items[item.id] = (state.items[item.id] ?? 0) + 1;
				setState(user.id, state); refreshGamePage(user);
			}
		},

		refreshshop(target, room, user) {
			const state = getState(user.id);
			if (!state) return;

			if (state.battleRoomId) {
				return this.errorReply("You cannot reroll the shop during a battle.");
			}
			if (state.pendingChoice?.length || state.pendingGachaOffer || state.pendingMoves?.length || state.pendingSwap) {
				return this.errorReply("Please resolve your pending choices before using the shop.");
			}

			if ((state.coins ?? 0) >= 5) {
				state.coins! -= 5;
				state.shopInventory = rollShopInventory();
				setState(user.id, state);
				refreshGamePage(user);
			} else {
				return this.errorReply("You don't have enough coins to reroll the shop.");
			}
		},

		use(target, room, user) {
			const state = getState(user.id);
			if (!state) return;

			if (state.battleRoomId) {
				return this.errorReply("You cannot manage your bag or items while a battle is in progress.");
			}
			if (state.pendingChoice?.length || state.pendingGachaOffer || state.pendingMoves?.length || state.pendingSwap) {
				return this.errorReply("You cannot use items while you have pending choices or moves to learn.");
			}

			const [id, slotStr] = target.split(' ');
			const itemId = toID(id);
			const slot = parseInt(slotStr) - 1;
			if (!state.items?.[itemId]) return this.errorReply("Item not found.");
			const item = SHOP_ITEMS[itemId];

			const requiresSlot = itemId === 'rarecandy' || item?.heldItem || item?.healHp !== undefined;
			if (requiresSlot) {
				if (isNaN(slot) || slot < 0 || slot >= state.team.length) {
					return this.errorReply("Invalid team slot.");
				}
			}

			if (itemId === 'rarecandy' && state.team[slot].level >= 999) {
				return this.errorReply(`That Pokémon is already at Max Level!`);
			}

			if (itemId === 'revive' && state.hasRevive) {
				return this.errorReply("You already have an active Revive!");
			}

			state.items[itemId]--;

			if (itemId === 'rarecandy') {
				const mon = state.team[slot];
				const oldLevel = mon.level;
				const oldSpecies = mon.species;
				let evolved = false;

				mon.level = Math.min(999, mon.level + 5);
				mon.exp = expForLevel(mon.level);
				while (true) {
					const evo = getLevelUpEvo(mon.species);
					if (!evo || mon.level < evo.evoLevel) break;
					mon.species = evo.evoTo;
					evolved = true;
				}
				state.notification = `Your Pokémon grew to Lv. ${mon.level}!`;

				if (!mon.moves) mon.moves = getLevelUpMoves(oldSpecies, oldLevel);

				const newMoves = getMovesLearnedBetween(oldSpecies, oldLevel, mon.level);
				if (evolved) {
					const evoMoves = getMovesLearnedBetween(mon.species, oldLevel, mon.level, true);
					for (const m of evoMoves) {
						if (!newMoves.includes(m)) newMoves.push(m);
					}
				}

				state.pendingMoves = state.pendingMoves || [];

				for (const move of newMoves) {
					const alreadyKnown = mon.moves.includes(move);
					const alreadyQueued = state.pendingMoves.some(p => p.pokemonIndex === slot && p.move === move);

					if (!alreadyKnown && !alreadyQueued) {
						if (mon.moves.length < 4) {
							mon.moves.push(move);
						} else {
							state.pendingMoves.push({ pokemonIndex: slot, move, speciesName: mon.species });
						}
					}
				}
			} else if (itemId === 'luckycharm') {
				state.doubleExpFloors = (state.doubleExpFloors ?? 0) + 3;
			} else if (itemId === 'revive') {
				state.hasRevive = true;
			} else if (item?.healHp !== undefined) {
				const mon = state.team[slot];
				const oldHp = mon.currentHp ?? 100;
				if (oldHp >= 100) {
					state.items[itemId]++;
					setState(user.id, state);
					return this.errorReply(`${Dex.species.get(toID(mon.species)).name}'s HP is already full!`);
				}
				mon.currentHp = item.healHp >= 100 ? 100 : Math.min(100, oldHp + item.healHp);
				state.notification = `<b>${Dex.species.get(toID(mon.species)).name}</b> restored HP! (${oldHp}% -> ${mon.currentHp}%)`;
			} else if (item?.gachaType) {
				const { species, isFeatured } = rollGachaPokemon(item.gachaType, state.team.map(m => m.species));
				state.pendingGachaOffer = { species, sourceItemId: itemId, isFeatured };
			} else if (item?.heldItem) {
				if (state.team[slot].heldItem) {
					const oldItem = state.team[slot].heldItem;
					const shopEntry = Object.entries(SHOP_ITEMS).find(([, i]) => i.heldItem === oldItem);
					const bagId = shopEntry ? shopEntry[0] : oldItem;
					state.items[bagId] = (state.items[bagId] ?? 0) + 1;
				}
				state.team[slot].heldItem = item.heldItem;
			}

			setState(user.id, state);
			refreshGamePage(user);
		},

		unequip(target, room, user) {
			const state = getState(user.id);
			if (!state) return;

			if (state.battleRoomId) {
				return this.errorReply("You cannot manage items while a battle is in progress.");
			}
			if (state.pendingChoice?.length || state.pendingGachaOffer || state.pendingMoves?.length || state.pendingSwap) {
				return this.errorReply("You cannot change items while you have pending choices.");
			}

			const slot = parseInt(target.trim()) - 1;
			if (isNaN(slot) || slot < 0 || slot >= state.team.length) return this.errorReply("Invalid team slot.");

			const mon = state.team[slot];
			if (!mon.heldItem) return this.errorReply("That Pokémon isn't holding an item.");

			const heldId = mon.heldItem;
			const shopEntry = Object.entries(SHOP_ITEMS).find(([, i]) => i.heldItem === heldId);
			const bagId = shopEntry ? shopEntry[0] : heldId;

			state.items = state.items || {};
			state.items[bagId] = (state.items[bagId] || 0) + 1;
			delete mon.heldItem;

			state.notification = `You took the ${SHOP_ITEMS[bagId]?.name || bagId} from ${mon.species}.`;

			setState(user.id, state);
			refreshGamePage(user);
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

		acceptgacha(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingGachaOffer) return;

			const addedLevel = Math.max(1, botLevel(state.floor) - 2);
			let finalSpecies = toID(state.pendingGachaOffer.species);

			while (true) {
				const evo = getLevelUpEvo(finalSpecies);
				if (!evo || addedLevel < evo.evoLevel) break;
				finalSpecies = evo.evoTo;
			}

			const initialMoves = getLevelUpMoves(finalSpecies, addedLevel);
			const newMon: PokemonEntry = { species: finalSpecies, level: addedLevel, exp: expForLevel(addedLevel), moves: initialMoves };

			if (state.team.length < 6) {
				state.team.push(newMon);
			} else {
				state.pendingSwap = newMon;
			}

			delete state.pendingGachaOffer;
			setState(user.id, state); refreshGamePage(user);
		},

		declinegacha(target, room, user) {
			const state = getState(user.id);
			if (!state?.pendingGachaOffer) return;

			const sourceItem = state.pendingGachaOffer.sourceItemId;
			state.items = state.items || {};
			state.items[sourceItem] = (state.items[sourceItem] || 0) + 1;
			state.notification = `You declined the Pokémon and kept your ${SHOP_ITEMS[sourceItem]?.name}.`;

			delete state.pendingGachaOffer;
			setState(user.id, state);
			refreshGamePage(user);
		},

		addmon(target, room, user) {
			this.checkCan('lock');
			const [name, mon, lvl] = target.split(',').map(s => s.trim());
			const tId = toID(name) || user.id;
			const s = getState(tId);

			if (!s) return this.errorReply(`No active run found for ${tId}.`);

			if (s.team.length >= 6) {
				return this.errorReply(`${tId}'s team is already full! They must lose a Pokemon before you can add one.`);
			}

			const species = Dex.species.get(toID(mon));
			if (!species.exists) return this.errorReply("Invalid Pokémon.");
			const level = parseInt(lvl) || 1;

			let finalSpecies = species.id;
			while (true) {
				const evo = getLevelUpEvo(finalSpecies);
				if (!evo || level < evo.evoLevel) break;
				finalSpecies = evo.evoTo;
			}

			const initialMoves = getLevelUpMoves(finalSpecies, level);
			s.team.push({ species: finalSpecies, level, exp: expForLevel(level), moves: initialMoves });

			setState(tId, s);
			this.sendReply(`Added ${finalSpecies} to ${tId}'s team.`);
		},

		givemoney(target, room, user) {
			this.checkCan('lock');
			let [name, amt] = target.split(',').map(s => s?.trim());

			if (!amt && !isNaN(parseInt(name))) {
				amt = name;
				name = user.id;
			}

			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.coins = (s.coins ?? 0) + parseInt(amt || '100');
				setState(tId, s);
				this.sendReply(`Gave ${amt || '100'} coins to ${tId}.`);
			}
		},

		removecoins(target, room, user) {
			this.checkCan('lock');
			let [name, amt] = target.split(',').map(s => s?.trim());

			if (!amt && !isNaN(parseInt(name))) {
				amt = name;
				name = user.id;
			}

			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.coins = Math.max(0, (s.coins ?? 0) - parseInt(amt || '100'));
				setState(tId, s);
				this.sendReply(`Removed ${amt || '100'} coins from ${tId}.`);
			}
		},

		resetcoins(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (s) {
				s.coins = 0;
				setState(tId, s);
				this.sendReply(`Reset coins for ${tId}.`);
			}
		},

		setfloor(target, room, user) {
			this.checkCan('lock');
			let [name, fl] = target.split(',').map(s => s?.trim());

			if (!fl && !isNaN(parseInt(name))) {
				fl = name;
				name = user.id;
			}

			const tId = toID(name) || user.id;
			const s = getState(tId);
			if (s) {
				s.floor = parseInt(fl || '1');
				setState(tId, s);
				this.sendReply(`Set floor for ${tId} to ${s.floor}.`);
			}
		},

		healteam(target, room, user) {
			this.checkCan('lock');
			const tId = toID(target) || user.id;
			const s = getState(tId);
			if (s) {
				for (const m of s.team) m.exp = expForLevel(m.level);
				setState(tId, s);
				this.sendReply(`Healed team for ${tId}.`);
			}
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
				if (match) {
					const bot = Users.get(match.botUserId);
					if (bot) destroyBotUser(bot);
					activeMatches.delete(s.battleRoomId as RoomID);
				}
				Rooms.get(s.battleRoomId)?.battle?.forfeit(user);
			}

			if (s) {
				s.gameOver = true;
				s.lastRunFloor = s.floor;
				s.lastRunStreaks = s.streaksWon || 0;
				s.team = [];

				delete s.pendingMoves;
				delete s.pendingSwap;
				delete s.pendingChoice;
				delete s.pendingGachaOffer;

				setState(user.id, s);
			}
			refreshGamePage(user);
		},

		help(target, room, user) {
			if (!this.runBroadcast()) return;
			const isStaff = user.can('lock');
			let html = `<b>PokéRogue - Player Commands:</b><br>` +
				`<code>/pokerogue start</code> - Open the game page.<br>` +
				`<code>/pokerogue battle</code> - Start floor battle.<br>` +
				`<code>/pokerogue shop</code> - Item shop.<br>` +
				`<code>/pokerogue status</code> - View run info.<br>` +
				`<code>/pokerogue top</code> - Leaderboard.<br>` +
				`<code>/pokerogue quit</code> - Abandon run.<br>`;
			if (isStaff) {
				html += `<br><b>Staff Commands:</b> givemoney, removecoins, resetcoins, setfloor, healteam, addmon, removemon.`;
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

// ---------------------------------------------------------------------------
// Battle end handler
// ---------------------------------------------------------------------------

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner, players) {
		const match = activeMatches.get(battle.roomid);
		if (!match) return;
		activeMatches.delete(battle.roomid);
		const botUser = Users.get(match.botUserId);
		if (botUser) destroyBotUser(botUser);
		const state = getState(match.userId);
		if (!state) return;

		const isBossFloor = match.floor % 10 === 0;

		// -----------------------------------------------------------------------
		// Step 1: Consumable item tracking + HP tracking
		// -----------------------------------------------------------------------
		const room = Rooms.get(battle.roomid);
		const logLines: string[] = room?.log?.log ?? [];
		const consumedItems: string[] = [];

		const hpSlotToTeamIdx: Record<string, number> = {};
		const hpAssignedIdx = new Set<number>();
		const slotHp: Record<string, number> = {};

		for (const line of logLines) {
			const switchMatch = /^\|(?:switch|drag)\|p1([a-z]): [^|]+\|([^|,]+)[^|]*\|(\d+)(?:\/\d+)?/.exec(line);
			if (switchMatch) {
				const slot = 'p1' + switchMatch[1];
				const hp = parseInt(switchMatch[3]);
				if (!(slot in hpSlotToTeamIdx)) {
					const sid = toID(switchMatch[2].trim());
					for (let i = 0; i < state.team.length; i++) {
						if (!hpAssignedIdx.has(i) && toID(state.team[i].species) === sid) {
							hpSlotToTeamIdx[slot] = i;
							hpAssignedIdx.add(i);
							break;
						}
					}
				}
				slotHp[slot] = hp;
			}

			const hpMatch = /^\|(?:-damage|-heal)\|p1([a-z]): [^|]+\|(\d+)(?:\/\d+)?/.exec(line);
			if (hpMatch) slotHp['p1' + hpMatch[1]] = parseInt(hpMatch[2]);

			const faintP1Match = /^\|faint\|p1([a-z]):/.exec(line);
			if (faintP1Match) slotHp['p1' + faintP1Match[1]] = 0;

			const endItemMatch = /^\|-enditem\|p1([a-z]): [^|]+\|([^|]+)/.exec(line);
			if (endItemMatch) {
				if (
					line.includes('[from] move: Knock Off') ||
					line.includes('[from] move: Thief') ||
					line.includes('[from] move: Incinerate')
				) continue;

				const slot = 'p1' + endItemMatch[1];
				const itemId = toID(endItemMatch[2].trim());
				const shopItem = SHOP_ITEMS[itemId];
				if (shopItem?.isConsumable) {
					const teamIdx = hpSlotToTeamIdx[slot];
					if (teamIdx !== undefined && state.team[teamIdx].heldItem === itemId) {
						delete state.team[teamIdx].heldItem;
						consumedItems.push(shopItem.name);
					}
				}
			}
		}

		for (const [slot, hp] of Object.entries(slotHp)) {
			const teamIdx = hpSlotToTeamIdx[slot];
			if (teamIdx !== undefined) {
				state.team[teamIdx].currentHp = hp;
			}
		}

		if (consumedItems.length > 0) {
			state.notification = (state.notification ?? '') +
				`<br><b style="color:#ffb84d">Consumed items:</b> ${consumedItems.join(', ')}`;
		}

		delete state.battleRoomId;

		// -----------------------------------------------------------------------
		// Step 2: Win / Loss branching
		// -----------------------------------------------------------------------
		if (toID(winner) === match.userId) {
			// -------------------------------------------------------------------
			// Step 2a: Read kill→EXP map accumulated by onFaint during the battle
			// -------------------------------------------------------------------
			const expMap: Map<number, number> =
				(room as AnyObject)?._rogueKillExp ?? new Map<number, number>();

			const luckyCharmActive = (state.doubleExpFloors ?? 0) > 0;
			const coinMult = isBossFloor ? 1.5 : 1.0;
			const luckyMult = luckyCharmActive ? 2 : 1;
			const coinReward = Math.floor(floorCoinReward(match.floor) * coinMult * luckyMult);

			const detailMsgs: string[] = [];

			// -------------------------------------------------------------------
			// Step 2b: Apply EXP to each Pokémon that earned kills
			// -------------------------------------------------------------------
			for (let i = 0; i < state.team.length; i++) {
				const expGained = expMap.get(i) ?? 0;
				if (expGained === 0) continue;

				const mon = state.team[i];
				const oldSpecies = mon.species;
				const { evolved, oldLevel } = applyExpAndLevelUp(mon, expGained);

				const msgs = processLevelUp(mon, oldLevel, oldSpecies, evolved, i, state);
				detailMsgs.push(...msgs);
			}

			// -------------------------------------------------------------------
			// Step 2c: Post-battle bookkeeping (coins, floor, streaks, milestones)
			// -------------------------------------------------------------------
			state.coins = (state.coins ?? 0) + coinReward;
			if (state.doubleExpFloors) state.doubleExpFloors--;

			const prevFl = state.floor;
			state.floor++;
			state.streaksWon = (state.streaksWon ?? 0) + 1;

			if (state.floor > (state.highestFloor ?? 0)) {
				state.highestFloor = state.floor;
				state.recordTeam = JSON.parse(JSON.stringify(state.team));
			}

			state.displayName = Users.get(match.userId)?.name || match.userId;

			state.notification = (state.notification ?? '') +
				`<br><b>Floor ${prevFl} Cleared!</b> +${coinReward} coins.<br>` +
				detailMsgs.join('<br>');

			if ((state.floor - 1) % 5 === 0) {
				state.pendingChoice = pickNewPokemonOptions(state.team, prevFl);
				state.pendingChoiceType = 'add';
				state.notification += `<br><b style="color:#c4a8ff">Milestone! Choose a new Pokemon to add!</b>`;
			}

			delete state.shopInventory;
		} else {
			// -------------------------------------------------------------------
			// Loss handling
			// -------------------------------------------------------------------
			delete state.pendingMoves;
			delete state.pendingSwap;

			if (state.hasRevive) {
				state.hasRevive = false;
				state.notification = (state.notification ?? '') +
					'<br><b>Revive used!</b> Retrying Floor ' + String(match.floor);
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
