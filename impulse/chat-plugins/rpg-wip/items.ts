import { Dex, toID } from '../../../sim/dex';
import type { InventoryItem, PlayerData, RPGPokemon } from './interface';
import { calculateStats, levelUp, checkEvolution, handleLearningMoves, calculateTotalExpForLevel, getMove, type CheckEvolutionContext } from './utils';
import { GameConfig } from './game-config';

// Re-export static data from items-data.ts
export {
	VIABLE_HELD_ITEMS,
	BERRY_FLAVORS,
	NATURE_FLAVOR_PREFERENCES,
	TYPE_RESIST_BERRIES,
	CUSTOM_ITEMS_DATABASE,
} from './items-data';

// Import for local use
import {
	CUSTOM_ITEMS_DATABASE,
	VIABLE_HELD_ITEMS,
	BERRY_FLAVORS,
	NATURE_FLAVOR_PREFERENCES,
	TYPE_RESIST_BERRIES,
} from './items-data';

// ==========================================
// ITEM LOGIC FUNCTIONS
// ==========================================

export function getItemData(itemId: string): Omit<InventoryItem, 'quantity'> | null {
	const id = toID(itemId);
	if (CUSTOM_ITEMS_DATABASE[id]) {
		return CUSTOM_ITEMS_DATABASE[id];
	}
	const dexItem = Dex.items.get(id);
	if (dexItem.exists) {
		let category: InventoryItem['category'] = 'held';
		if (dexItem.isPokeball) category = 'pokeball';
		else if (dexItem.isBerry) category = 'berry';

		let price = 0;
		if (category === 'pokeball') price = 1000;
		if (category === 'berry') price = 200;
		if (category === 'held') price = 4000;

		return {
			id,
			name: dexItem.name,
			category,
			description: dexItem.shortDesc || dexItem.desc || 'An item.',
			price,
		};
	}
	return null;
}

export const ITEMS_DATABASE = new Proxy({} as Record<string, Omit<InventoryItem, 'quantity'>>, {
	get(target, prop: string) {
		return getItemData(prop);
	},
});

export function addItemToInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData) return false;
	if (player.inventory.has(id)) {
		player.inventory.get(id)!.quantity += quantity;
	} else {
		player.inventory.set(id, { ...itemData, quantity });
	}
	return true;
}

export function removeItemFromInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	const id = toID(itemId);
	if (!player.inventory.has(id)) return false;
	const item = player.inventory.get(id)!;
	if (item.quantity < quantity) return false;
	item.quantity -= quantity;
	if (item.quantity === 0) {
		player.inventory.delete(id);
	}
	return true;
}

export function useHealingItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp <= 0) return { success: false, message: `${pokemon.species} has fainted!` };

	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects) return { success: false, message: `This item cannot be used to heal.` };

	const eff = itemData.effects;
	let success = false;
	const messageParts: string[] = [];

	if (eff.statusCure) {
		if (pokemon.status) {
			if (eff.statusCure === 'all' || eff.statusCure === pokemon.status) {
				pokemon.status = null;
				messageParts.push(`healed status`);
				success = true;
			}
		} else if (!eff.healAmount && !eff.healPercent) {
			return { success: false, message: `${pokemon.species} is healthy.` };
		}
	}

	if (eff.healAmount || eff.healPercent) {
		if (pokemon.hp < pokemon.maxHp) {
			let heal = 0;
			if (eff.healPercent) heal += Math.floor(pokemon.maxHp * eff.healPercent);
			if (eff.healAmount) heal += eff.healAmount;

			const prevHp = pokemon.hp;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + heal);
			const actualHeal = pokemon.hp - prevHp;
			messageParts.push(`recovered ${actualHeal} HP`);
			success = true;
		} else if (!success) {
			return { success: false, message: `${pokemon.species} is already at full health.` };
		}
	}

	if (eff.ppRestore) {
		// Find a move with less than max PP
		let restoredMove = false;
		for (const move of pokemon.moves) {
			const moveData = getMove(move.id);
			const maxPP = moveData.pp || 5;
			if (move.pp < maxPP) {
				if (eff.ppRestore === -1) {
					move.pp = maxPP;
				} else {
					move.pp = Math.min(maxPP, move.pp + eff.ppRestore);
				}
				messageParts.push(`restored PP to ${moveData.name}`);
				restoredMove = true;
				success = true;
				break;
			}
		}
		if (!restoredMove && !success) {
			return { success: false, message: `All moves have full PP!` };
		}
	}

	if (eff.friendshipChange && success) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + eff.friendshipChange));
		if (eff.friendshipChange < 0) {
			messageParts.push(`friendship decreased`);
		}
	}

	if (success) {
		removeItemFromInventory(player, id, 1);
		return {
			success: true,
			message: `Used <strong>${itemData.name}</strong>! ${pokemon.species} ${messageParts.join(' and ')}.`,
		};
	}

	return { success: false, message: `It had no effect.` };
}

export function useRevivalItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp > 0) return { success: false, message: `${pokemon.species} has not fainted!` };

	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects?.revive) return { success: false, message: `This item cannot revive.` };

	const eff = itemData.effects;
	const healPercent = eff.reviveHealthPercent || 0.5;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * healPercent));
	pokemon.status = null;

	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		move.pp = moveData.pp || 5;
	}

	if (eff.friendshipChange) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + eff.friendshipChange));
	}

	removeItemFromInventory(player, id, 1);
	return { success: true, message: `Used <strong>${itemData.name}</strong>! ${pokemon.species} was revived!` };
}

export function useVitaminItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects?.evBoost) return { success: false, message: "This is not a vitamin." };
	if (pokemon.hp <= 0) return { success: false, message: "Cannot use on fainted Pokemon." };

	const { stat, amount } = itemData.effects.evBoost;
	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	const currentEV = pokemon.evs[stat];

	if (totalEVs >= 510) return { success: false, message: "Total EVs maxed (510)." };
	if (currentEV >= 252) return { success: false, message: `${stat.toUpperCase()} EVs maxed (252).` };

	const actualAmount = Math.min(amount, 252 - currentEV, 510 - totalEVs);
	if (actualAmount <= 0) return { success: false, message: "It won't have any effect." };

	pokemon.evs[stat] += actualAmount;

	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	if (stat === 'hp') {
		const diff = newStats.maxHp - pokemon.maxHp;
		if (diff > 0) pokemon.hp += diff;
	}

	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	removeItemFromInventory(player, id, 1);
	return { success: true, message: `Used <strong>${itemData.name}</strong>! ${stat.toUpperCase()} rose.` };
}

export function useRareCandyItem(player: PlayerData, pokemon: RPGPokemon, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	if (pokemon.level >= GameConfig.levelCap) {
		return { success: false, message: `Already at level cap (${GameConfig.levelCap}).` };
	}

	try {
		const msgs = levelUp(pokemon);
		pokemon.experience = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);

		const evoMsg = checkEvolution(player, pokemon, { room, user });
		if (evoMsg) {
			msgs.push(evoMsg);
		} else {
			const moveMsgs = handleLearningMoves(player, pokemon);
			msgs.push(...moveMsgs.messages);
		}

		removeItemFromInventory(player, 'rarecandy', 1);
		return { success: true, message: `Used Rare Candy! ${msgs.join(' ')}` };
	} catch (e) {
		return { success: false, message: "Error using candy." };
	}
}

export function useExpCandyItem(player: PlayerData, pokemon: RPGPokemon, itemId: string, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects?.expBoost) return { success: false, message: "Invalid Exp Candy." };
	if (pokemon.level >= GameConfig.levelCap) {
		return { success: false, message: `Already at level cap (${GameConfig.levelCap}).` };
	}

	const amount = itemData.effects.expBoost;
	pokemon.experience += amount;

	const msgs = [`Gained ${amount} Exp.`];

	while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < GameConfig.levelCap) {
		msgs.push(...levelUp(pokemon));

		const evoMsg = checkEvolution(player, pokemon, { room, user });
		if (evoMsg) {
			msgs.push(evoMsg);
			break;
		}

		const moveMsgs = handleLearningMoves(player, pokemon);
		msgs.push(...moveMsgs.messages);
	}

	removeItemFromInventory(player, id, 1);
	return { success: true, message: msgs.join('<br>') };
}

export function useSacredAsh(player: PlayerData): { success: boolean, message: string } {
	const faintedPokemon = player.party.filter(p => p.hp <= 0);
	if (faintedPokemon.length === 0) return { success: false, message: `No Pokémon need to be revived!` };

	for (const pokemon of player.party) {
		if (pokemon.hp <= 0) {
			pokemon.hp = pokemon.maxHp;
			pokemon.status = null;
			for (const move of pokemon.moves) {
				const moveData = getMove(move.id);
				move.pp = moveData.pp || 5;
			}
		}
	}
	removeItemFromInventory(player, 'sacredash', 1);
	return { success: true, message: `Used <strong>Sacred Ash</strong>! All fainted Pokémon were revived!` };
}

export function useEvolutionStone(player: PlayerData, pokemon: RPGPokemon, itemId: string, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects?.evolutionItem) return { success: false, message: "This is not an evolution item." };
	if (pokemon.hp <= 0) return { success: false, message: "Cannot use on fainted Pokemon." };

	// Check if this Pokemon can evolve with this stone
	const evoMsg = checkEvolution(player, pokemon, { room, user }, id);

	if (evoMsg) {
		removeItemFromInventory(player, id, 1);
		return { success: true, message: `Used <strong>${itemData.name}</strong>! ${evoMsg}` };
	} else {
		return { success: false, message: `${pokemon.species} cannot evolve with ${itemData.name}.` };
	}
}

// ==========================================
// BATTLE-SPECIFIC ITEM USAGE
// ==========================================

/**
 * Use a healing item on a Pokemon during battle.
 * Similar to useHealingItem but for in-battle use.
 */
export function useBattleHealingItem(pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects) return { success: false, message: `This item cannot be used in battle.` };

	const eff = itemData.effects;
	let success = false;
	const messageParts: string[] = [];

	// Can't use healing items on fainted Pokemon during battle (use revive items instead)
	if (pokemon.hp <= 0 && !eff.revive) {
		return { success: false, message: `${pokemon.species} has fainted! Use a revive item instead.` };
	}

	// Handle status healing
	if (eff.statusCure && pokemon.hp > 0) {
		if (pokemon.status) {
			if (eff.statusCure === 'all' || eff.statusCure === pokemon.status) {
				pokemon.status = null;
				messageParts.push(`was cured of its status condition`);
				success = true;
			}
		} else if (!eff.healAmount && !eff.healPercent) {
			return { success: false, message: `${pokemon.species} doesn't have a status condition.` };
		}
	}

	// Handle HP healing
	if (eff.healAmount || eff.healPercent) {
		if (pokemon.hp > 0 && pokemon.hp < pokemon.maxHp) {
			let heal = 0;
			if (eff.healPercent) heal += Math.floor(pokemon.maxHp * eff.healPercent);
			if (eff.healAmount) heal += eff.healAmount;

			const prevHp = pokemon.hp;
			pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + heal);
			const actualHeal = pokemon.hp - prevHp;
			messageParts.push(`recovered ${actualHeal} HP`);
			success = true;
		} else if (pokemon.hp > 0 && !success) {
			return { success: false, message: `${pokemon.species} is already at full health.` };
		}
	}

	// Handle friendship changes
	if (eff.friendshipChange && success) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + eff.friendshipChange));
	}

	if (success) {
		return {
			success: true,
			message: `${pokemon.species} ${messageParts.join(' and ')}.`,
		};
	}

	return { success: false, message: `It had no effect.` };
}

/**
 * Use a revival item during battle to revive a fainted Pokemon.
 */
export function useBattleRevivalItem(pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp > 0) return { success: false, message: `${pokemon.species} hasn't fainted!` };

	const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData?.effects?.revive) return { success: false, message: `This item cannot revive Pokemon.` };

	const eff = itemData.effects;
	const healPercent = eff.reviveHealthPercent || 0.5;

	pokemon.hp = Math.max(1, Math.floor(pokemon.maxHp * healPercent));
	pokemon.status = null;

	// Restore PP to all moves
	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		move.pp = moveData.pp || 5;
	}

	if (eff.friendshipChange) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + eff.friendshipChange));
	}

	return { success: true, message: `${pokemon.species} was revived!` };
}

/**
 * Check if an item can be used in battle.
 */
export function canUseItemInBattle(itemId: string): boolean {
	const id = toID(itemId);

	// Special items that can be used in battle
	if (id === 'direhit') return true;
	if (id === 'guardspec') return true;

	const itemData = ITEMS_DATABASE[id];
	if (!itemData) return false;

	const eff = itemData.effects;
	if (!eff) return false;

	// Usable in battle: healing items, status cure, revival, stat boosters, pp restore
	return !!(
		eff.healAmount ||
		eff.healPercent ||
		eff.statusCure ||
		eff.revive ||
		eff.battleStatBoost ||
		eff.ppRestore
	);
}

/**
 * Get a list of items that can be used in battle from player's inventory.
 */
export function getBattleUsableItems(player: PlayerData): InventoryItem[] {
	const items: InventoryItem[] = [];
	for (const [itemId, item] of player.inventory) {
		if (canUseItemInBattle(itemId)) {
			items.push(item);
		}
	}
	return items;
}

export const ITEM_PRICES: Record<string, number> = {};
Object.keys(CUSTOM_ITEMS_DATABASE).forEach(k => {
	if (CUSTOM_ITEMS_DATABASE[k].price) {
		ITEM_PRICES[k] = CUSTOM_ITEMS_DATABASE[k].price!;
	}
});

export const RPGItems = {
	getItemData,
	addItemToInventory,
	removeItemFromInventory,
	useVitaminItem,
	useHealingItem,
	useRevivalItem,
	useSacredAsh,
	useRareCandyItem,
	useExpCandyItem,
	useEvolutionStone,
	useBattleHealingItem,
	useBattleRevivalItem,
	canUseItemInBattle,
	getBattleUsableItems,
	CUSTOM_ITEMS_DATABASE,
	ITEMS_DATABASE,
	ITEM_PRICES,
	VIABLE_HELD_ITEMS,
	BERRY_FLAVORS,
	NATURE_FLAVOR_PREFERENCES,
	TYPE_RESIST_BERRIES,
};

export default RPGItems;
