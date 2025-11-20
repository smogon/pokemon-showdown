/*
* Pokemon Showdown
* RPG Items
*/
import { Dex, toID } from '../../../sim/dex';
import type { InventoryItem, PlayerData, RPGPokemon, Stats } from './interface';
import { calculateStats, levelUp, checkEvolution, handleLearningMoves, calculateTotalExpForLevel, getMove, type CheckEvolutionContext } from './utils';

// [REFACTOR] Data-Driven Item Database
export const CUSTOM_ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	'potion': { id: 'potion', name: 'Potion', category: 'medicine', description: 'Restores 20 HP.', price: 300, effects: { healAmount: 20 } },
	'superpotion': { id: 'superpotion', name: 'Super Potion', category: 'medicine', description: 'Restores 60 HP.', price: 700, effects: { healAmount: 60 } },
	'hyperpotion': { id: 'hyperpotion', name: 'Hyper Potion', category: 'medicine', description: 'Restores 120 HP.', price: 1200, effects: { healAmount: 120 } },
	'maxpotion': { id: 'maxpotion', name: 'Max Potion', category: 'medicine', description: 'Fully restores HP.', price: 2500, effects: { healPercent: 1.0 } },
	'fullrestore': { id: 'fullrestore', name: 'Full Restore', category: 'medicine', description: 'Fully restores HP and heals status.', price: 3000, effects: { healPercent: 1.0, statusCure: 'all' } },
	'freshwater': { id: 'freshwater', name: 'Fresh Water', category: 'medicine', description: 'Restores 50 HP.', price: 250, effects: { healAmount: 50 } },
	'sodapop': { id: 'sodapop', name: 'Soda Pop', category: 'medicine', description: 'Restores 60 HP.', price: 350, effects: { healAmount: 60 } },
	'lemonade': { id: 'lemonade', name: 'Lemonade', category: 'medicine', description: 'Restores 80 HP.', price: 450, effects: { healAmount: 80 } },
	'moomoomilk': { id: 'moomoomilk', name: 'Moomoo Milk', category: 'medicine', description: 'Restores 100 HP.', price: 600, effects: { healAmount: 100 } },
	'tea': { id: 'tea', name: 'Tea', category: 'medicine', description: 'Restores 120 HP.', price: 750, effects: { healAmount: 120 } },
	'energyroot': { id: 'energyroot', name: 'Energy Root', category: 'medicine', description: 'Restores 200 HP (Bitter).', price: 1200, effects: { healAmount: 200, friendshipChange: -10 } },
	'energypowder': { id: 'energypowder', name: 'EnergyPowder', category: 'medicine', description: 'Restores 50 HP (Bitter).', price: 500, effects: { healAmount: 50, friendshipChange: -5 } },
	'berryjuice': { id: 'berryjuice', name: 'Berry Juice', category: 'medicine', description: 'Restores 20 HP.', price: 100, effects: { healAmount: 20 } },

	'antidote': { id: 'antidote', name: 'Antidote', category: 'medicine', description: 'Heals Poison.', price: 100, effects: { statusCure: 'psn' } },
	'paralyzeheal': { id: 'paralyzeheal', name: 'Paralyze Heal', category: 'medicine', description: 'Heals Paralysis.', price: 200, effects: { statusCure: 'par' } },
	'awakening': { id: 'awakening', name: 'Awakening', category: 'medicine', description: 'Heals Sleep.', price: 250, effects: { statusCure: 'slp' } },
	'burnheal': { id: 'burnheal', name: 'Burn Heal', category: 'medicine', description: 'Heals Burn.', price: 250, effects: { statusCure: 'brn' } },
	'iceheal': { id: 'iceheal', name: 'Ice Heal', category: 'medicine', description: 'Heals Freeze.', price: 250, effects: { statusCure: 'frz' } },
	'fullheal': { id: 'fullheal', name: 'Full Heal', category: 'medicine', description: 'Heals all status.', price: 600, effects: { statusCure: 'all' } },
	'healpowder': { id: 'healpowder', name: 'Heal Powder', category: 'medicine', description: 'Heals all status (Bitter).', price: 450, effects: { statusCure: 'all', friendshipChange: -5 } },

	'revive': { id: 'revive', name: 'Revive', category: 'medicine', description: 'Revives with half HP.', price: 1500, effects: { revive: true, reviveHealthPercent: 0.5 } },
	'maxrevive': { id: 'maxrevive', name: 'Max Revive', category: 'medicine', description: 'Revives with full HP.', price: 4000, effects: { revive: true, reviveHealthPercent: 1.0 } },
	'revivalherb': { id: 'revivalherb', name: 'Revival Herb', category: 'medicine', description: 'Revives with full HP (Bitter).', price: 2800, effects: { revive: true, reviveHealthPercent: 1.0, friendshipChange: -15 } },
	'sacredash': { id: 'sacredash', name: 'Sacred Ash', category: 'medicine', description: 'Revives all fainted Pokémon.', price: 50000, effects: { revive: true, reviveHealthPercent: 1.0 } },

	'ether': { id: 'ether', name: 'Ether', category: 'medicine', description: 'Restores 10 PP to one move.', price: 1200, effects: { ppRestore: 10 } },
	'maxether': { id: 'maxether', name: 'Max Ether', category: 'medicine', description: 'Fully restores PP to one move.', price: 2000, effects: { ppRestore: -1 } },
	'elixir': { id: 'elixir', name: 'Elixir', category: 'medicine', description: 'Restores 10 PP to all moves.', price: 3000, effects: { ppRestore: 10, ppRestoreAll: true } },
	'maxelixir': { id: 'maxelixir', name: 'Max Elixir', category: 'medicine', description: 'Fully restores PP to all moves.', price: 4500, effects: { ppRestore: -1, ppRestoreAll: true } },

	'hpup': { id: 'hpup', name: 'HP Up', category: 'medicine', description: 'Raises HP EV.', price: 9800, effects: { evBoost: { stat: 'hp', amount: 10 } } },
	'protein': { id: 'protein', name: 'Protein', category: 'medicine', description: 'Raises Attack EV.', price: 9800, effects: { evBoost: { stat: 'atk', amount: 10 } } },
	'iron': { id: 'iron', name: 'Iron', category: 'medicine', description: 'Raises Defense EV.', price: 9800, effects: { evBoost: { stat: 'def', amount: 10 } } },
	'calcium': { id: 'calcium', name: 'Calcium', category: 'medicine', description: 'Raises Sp. Atk EV.', price: 9800, effects: { evBoost: { stat: 'spa', amount: 10 } } },
	'zinc': { id: 'zinc', name: 'Zinc', category: 'medicine', description: 'Raises Sp. Def EV.', price: 9800, effects: { evBoost: { stat: 'spd', amount: 10 } } },
	'carbos': { id: 'carbos', name: 'Carbos', category: 'medicine', description: 'Raises Speed EV.', price: 9800, effects: { evBoost: { stat: 'spe', amount: 10 } } },

	'rarecandy': { id: 'rarecandy', name: 'Rare Candy', category: 'misc', description: 'Raises level by 1.', price: 4800, effects: { levelBoost: 1 } },
	'expcandyxs': { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', description: 'Gains 100 Exp.', price: 20, effects: { expBoost: 100 } },
	'expcandys': { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', description: 'Gains 800 Exp.', price: 100, effects: { expBoost: 800 } },
	'expcandym': { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', description: 'Gains 3000 Exp.', price: 500, effects: { expBoost: 3000 } },
	'expcandyl': { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', description: 'Gains 10000 Exp.', price: 3000, effects: { expBoost: 10000 } },
	'expcandyxl': { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', description: 'Gains 30000 Exp.', price: 10000, effects: { expBoost: 30000 } },
	'terashard': { id: 'terashard', name: 'Tera Shard', category: 'misc', description: 'Changes Tera Type.', price: 5000, effects: { canTerastallize: true } },
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'Teaches an Egg Move.', price: 3000 },

	'pokeball': { id: 'pokeball', name: 'Poké Ball', category: 'pokeball', description: 'A device for catching wild Pokémon.', price: 200 },
	'greatball': { id: 'greatball', name: 'Great Ball', category: 'pokeball', description: 'A good, high-performance Ball.', price: 600 },
	'ultraball': { id: 'ultraball', name: 'Ultra Ball', category: 'pokeball', description: 'An ultra-high-performance Ball.', price: 1200 },
	'masterball': { id: 'masterball', name: 'Master Ball', category: 'pokeball', description: 'Catches any Pokémon without fail.', price: 0 },
    'oranberry': { id: 'oranberry', name: 'Oran Berry', category: 'berry', description: 'Heals 10 HP.', price: 200 },
};

export function getItemData(itemId: string): Omit<InventoryItem, 'quantity'> | null {
    const id = toID(itemId); // [SAFETY] Force ID
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
			id: id,
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
    const id = toID(itemId); // [SAFETY] Force ID
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
    const id = toID(itemId); // [SAFETY] Force ID
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
	if (!itemData || !itemData.effects) return { success: false, message: `This item cannot be used to heal.` };
	
	const eff = itemData.effects;
	let success = false;
	let messageParts: string[] = [];

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
			message: `Used <strong>${itemData.name}</strong>! ${pokemon.species} ${messageParts.join(' and ')}.` 
		};
	}

	return { success: false, message: `It had no effect.` };
}

export function useRevivalItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp > 0) return { success: false, message: `${pokemon.species} has not fainted!` };

    const id = toID(itemId);
	const itemData = ITEMS_DATABASE[id];
	if (!itemData || !itemData.effects || !itemData.effects.revive) return { success: false, message: `This item cannot revive.` };

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
	if (!itemData || !itemData.effects || !itemData.effects.evBoost) return { success: false, message: "This is not a vitamin." };
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
	if (pokemon.level >= 100) return { success: false, message: "Already Level 100." };
	
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
	if (!itemData || !itemData.effects || !itemData.effects.expBoost) return { success: false, message: "Invalid Exp Candy." };
	if (pokemon.level >= 100) return { success: false, message: "Already Level 100." };

	const amount = itemData.effects.expBoost;
	pokemon.experience += amount;
	
	const msgs = [`Gained ${amount} Exp.`];
	
	while(pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
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
	CUSTOM_ITEMS_DATABASE,
	ITEMS_DATABASE,
	ITEM_PRICES,
};

export default RPGItems;
