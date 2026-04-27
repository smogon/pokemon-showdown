/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue Items
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

import { FS } from '../../../lib';

const ROGUELIKE_DATA_PATH = 'impulse/chat-plugins/pokerogue';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ItemType =
	| 'pokemonPack'
	| 'healHP'
	| 'healPP'
	| 'TM'
	| 'key'
	| 'revive'
	| 'cureStatus'
	| 'itemPack'
	| 'item'
	| 'evolveItem';

/** Items in the permanent shop (shopdb.json) — always visible. */
export interface ShopItem {
	name: string;
	/** Item ID for icon lookup (smogon minisprite URL key). */
	icon: string;
	type: ItemType;
	desc: string;
	cost: number;
	/** Minimum streak the player must have reached for this item to appear. */
	minStreak: number;
}

/** Items in the rotational pool (itemdb.json + tmdb.json). */
export interface RotationalItem {
	name: string;
	cost: number;
	icon: string;
	type: ItemType;
	desc: string;
	minStreak: number;
}

export interface TMItem extends RotationalItem {
	move: string;
}

// ---------------------------------------------------------------------------
// Data loaders — synchronous reads at startup (same pattern as poketest.ts)
// ---------------------------------------------------------------------------

export const TM_LIST: Record<string, TMItem> =
	JSON.parse(FS(`${ROGUELIKE_DATA_PATH}/tmdb.json`).readSync());

export const ROTATIONAL_ITEM_POOL: Record<string, RotationalItem | TMItem> =
	JSON.parse(FS(`${ROGUELIKE_DATA_PATH}/itemdb.json`).readSync());

// Merge TMs into rotational pool (identical to poketest.ts `Object.assign`)
Object.assign(ROTATIONAL_ITEM_POOL, TM_LIST);

export const SHOP_ITEMS: Record<string, ShopItem> =
	JSON.parse(FS(`${ROGUELIKE_DATA_PATH}/shopdb.json`).readSync());

// ---------------------------------------------------------------------------
// genItem — picks `quantity` functional held items, optionally filtered to
// the current team (mirrors poketest.ts genItem exactly).
// ---------------------------------------------------------------------------

export function genItem(quantity: number, extraArg?: PokemonSet[] | string): string[] {
	let all = Dex.items.all().filter(s => (s.isGem || s.itemUser || s.zMove) || !s.isNonstandard);
	all = all.filter(i => {
		if (i.itemUser) {
			if (typeof extraArg === 'string') {
				const dexSpecies = Dex.species.get(extraArg);
				let validSpecies = [dexSpecies.name];
				if (dexSpecies.otherFormes) validSpecies = validSpecies.concat(dexSpecies.otherFormes);
				return i.itemUser.some(v => validSpecies.includes(v));
			} else if (extraArg?.length) {
				return extraArg.some(poke => {
					const dexSpecies = Dex.species.get(poke.species);
					let validSpecies = [dexSpecies.name];
					if (dexSpecies.otherFormes) validSpecies = validSpecies.concat(dexSpecies.otherFormes);
					return i.itemUser?.some(v => validSpecies.includes(v));
				});
			}
		} else {
			if (i.zMove) return true;
			return Object.keys(i).some(k => typeof (i as any)[k] === 'function');
		}
		return false;
	});

	// Shuffle
	for (let i = all.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[all[i], all[j]] = [all[j], all[i]];
	}

	const items: string[] = [];
	while (items.length < quantity) {
		const plausibleItem = all.shift();
		if (plausibleItem) {
			items.push(plausibleItem.name);
		} else {
			break;
		}
	}
	return items;
}

// ---------------------------------------------------------------------------
// rollShop — builds a 5-item rotational shop for the player.
// Mirrors poketest.ts Roguelike.rollShop() exactly:
//   70% chance → item
//   20% chance → TM (falls back to item if empty)
//   10% chance → evolveItem or species-specific item (falls back to item)
// Items that require a specific team member are filtered to only appear when
// a valid team member exists.
// ---------------------------------------------------------------------------

export function rollShop(team: PokemonSet[], streak: number): string[] {
	const rotationalShop: string[] = [];

	// Check if a pokémon on the team can use an evolveItem
	function checkForEvolution(pokemon: PokemonSet, itemName: string): boolean {
		const evoList = Dex.species.get(pokemon.species).evos;
		if (!evoList) return false;
		for (const newEvo of evoList) {
			if (Dex.species.get(newEvo).evoType === 'useItem' &&
				Dex.species.get(newEvo).evoItem === itemName) {
				return true;
			}
		}
		return false;
	}

	let viableItems: string[] = [];

	for (const index of Object.keys(ROTATIONAL_ITEM_POOL)) {
		const poolItem = ROTATIONAL_ITEM_POOL[index];
		if (poolItem.minStreak > streak) continue;

		const dexItem = Dex.items.get(poolItem.name);

		if (poolItem.type === 'item') {
			if (dexItem.isNonstandard === 'CAP') continue;
			const isViable = dexItem.itemUser || dexItem.zMove || Object.keys(dexItem).some(k => {
				return typeof (dexItem as any)[k] === 'function';
			});
			if (dexItem.itemUser && !team.some(p => dexItem.itemUser?.includes(p.species))) continue;
			if (!isViable) continue;
		} else if (poolItem.type === 'evolveItem') {
			if (!team.some(p => checkForEvolution(p, dexItem.name))) continue;
		}

		viableItems.push(index);
	}

	while (rotationalShop.length < 5) {
		let potential: string[] = [];
		const randomNo = Math.floor(Math.random() * 100);

		if (randomNo > 30) {
			potential = viableItems.filter(item => ROTATIONAL_ITEM_POOL[item].type === 'item');
		} else if (randomNo > 10) {
			potential = viableItems.filter(item => ROTATIONAL_ITEM_POOL[item].type === 'TM');
			if (!potential.length) {
				potential = viableItems.filter(item => ROTATIONAL_ITEM_POOL[item].type === 'item');
			}
		} else {
			potential = viableItems.filter(item =>
				ROTATIONAL_ITEM_POOL[item].type === 'evolveItem' ||
				Dex.items.get(item)?.itemUser
			);
			if (!potential.length) {
				potential = viableItems.filter(item => ROTATIONAL_ITEM_POOL[item].type === 'item');
			}
		}

		// Shuffle and pop
		for (let i = potential.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[potential[i], potential[j]] = [potential[j], potential[i]];
		}
		const winner = potential.pop();
		if (!winner) break;

		rotationalShop.push(winner);
		viableItems = viableItems.filter(e => e !== winner);
	}

	return rotationalShop;
}
