import { Dex, toID } from '../../../sim/dex';
import type { InventoryItem, PlayerData, RPGPokemon, Stats } from './interface';
import { calculateStats, levelUp, checkEvolution, handleLearningMoves, calculateTotalExpForLevel, getMove, type CheckEvolutionContext } from './utils';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { GameConfig } from './game-config';

// ==========================================
// ITEM CONSTANTS & CONFIGURATION
// ==========================================

export const VIABLE_HELD_ITEMS: string[] = [
	'leftovers', 'sitrusberry', 'blacksludge',
	'shellbell', 'lifeorb', 'choiceband', 'choicespecs',
	'expertbelt', 'choicescarf', 'quickclaw', 'focussash',
	'assaultvest', 'heavydutyboots', 'rockyhelmet', 'airballoon',
	'shedshell', 'clearamulet', 'lumberry', 'mentalherb', 'whiteherb',
	'powerherb', 'weaknesspolicy', 'flameorb', 'toxicorb', 'stickybarb',
	'liechiberry', 'ganlonberry', 'salacberry', 'petayaberry', 'apicotberry',
	'starfberry', 'chopleberry', 'yacheberry', 'shucaberry', 'occaberry',
	'passhoberry', 'wacanberry', 'rindoberry', 'kasibberry', 'colburberry',
	'babiriberry', 'roseliberry', 'chilanberry', 'chartiberry', 'cobaberry',
	'payapaberry', 'habanberry', 'tangaberry', 'kebiaberry',
	'lightball', 'thickclub', 'deepseatooth', 'deepseascale', 'metalpowder',
	// Added viable new items
	'widelens', 'scopelens', 'razorclaw', 'zoomlens', 'lightclay',
];

export const BERRY_FLAVORS: Record<string, { flavor: string, stat: keyof Stats }> = {
	'figyberry': { flavor: 'Spicy', stat: 'atk' },
	'wikiberry': { flavor: 'Dry', stat: 'spa' },
	'magoberry': { flavor: 'Sweet', stat: 'spe' },
	'aguavberry': { flavor: 'Bitter', stat: 'spd' },
	'iapapaberry': { flavor: 'Sour', stat: 'def' },
};

export const NATURE_FLAVOR_PREFERENCES: Record<keyof Stats, string> = {
	atk: 'Spicy', def: 'Sour', spa: 'Dry', spd: 'Bitter', spe: 'Sweet', maxHp: '',
};

export const TYPE_RESIST_BERRIES: Record<string, string> = {
	'babiriberry': 'Steel', 'chartiberry': 'Rock', 'chilanberry': 'Normal', 'chopleberry': 'Fighting',
	'cobaberry': 'Flying', 'colburberry': 'Dark', 'habanberry': 'Dragon', 'kasibberry': 'Ghost',
	'kebiaberry': 'Poison', 'occaberry': 'Fire', 'passhoberry': 'Water', 'payapaberry': 'Psychic',
	'rindoberry': 'Grass', 'roseliberry': 'Fairy', 'shucaberry': 'Ground', 'tangaberry': 'Bug',
	'wacanberry': 'Electric', 'yacheberry': 'Ice',
};

// ==========================================
// ITEM DATABASE
// ==========================================

export const CUSTOM_ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	// Medicine
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

	// Battle stat-boosting items
	'xattack': { id: 'xattack', name: 'X Attack', category: 'medicine', description: 'Sharply raises Attack in battle.', price: 500, effects: { battleStatBoost: { stat: 'atk', stages: 2 } } },
	'xdefense': { id: 'xdefense', name: 'X Defense', category: 'medicine', description: 'Sharply raises Defense in battle.', price: 550, effects: { battleStatBoost: { stat: 'def', stages: 2 } } },
	'xspatk': { id: 'xspatk', name: 'X Sp. Atk', category: 'medicine', description: 'Sharply raises Sp. Atk in battle.', price: 350, effects: { battleStatBoost: { stat: 'spa', stages: 2 } } },
	'xspdef': { id: 'xspdef', name: 'X Sp. Def', category: 'medicine', description: 'Sharply raises Sp. Def in battle.', price: 350, effects: { battleStatBoost: { stat: 'spd', stages: 2 } } },
	'xspeed': { id: 'xspeed', name: 'X Speed', category: 'medicine', description: 'Sharply raises Speed in battle.', price: 350, effects: { battleStatBoost: { stat: 'spe', stages: 2 } } },
	'xaccuracy': { id: 'xaccuracy', name: 'X Accuracy', category: 'medicine', description: 'Sharply raises Accuracy in battle.', price: 950, effects: { battleStatBoost: { stat: 'accuracy', stages: 2 } } },
	'direhit': { id: 'direhit', name: 'Dire Hit', category: 'medicine', description: 'Greatly raises critical-hit ratio.', price: 650, effects: {} },
	'guardspec': { id: 'guardspec', name: 'Guard Spec.', category: 'medicine', description: 'Prevents stat reduction in battle for 5 turns.', price: 700, effects: {} },

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

	// Pokeballs
	'pokeball': { id: 'pokeball', name: 'Poké Ball', category: 'pokeball', description: 'A device for catching wild Pokémon.', price: 200 },
	'greatball': { id: 'greatball', name: 'Great Ball', category: 'pokeball', description: 'A good, high-performance Ball.', price: 600 },
	'ultraball': { id: 'ultraball', name: 'Ultra Ball', category: 'pokeball', description: 'An ultra-high-performance Ball.', price: 1200 },
	'masterball': { id: 'masterball', name: 'Master Ball', category: 'pokeball', description: 'Catches any Pokémon without fail.', price: 0 },
	'quickball': { id: 'quickball', name: 'Quick Ball', category: 'pokeball', description: 'A Ball with a high catch rate on the first turn.', price: 1000 },
	'timerball': { id: 'timerball', name: 'Timer Ball', category: 'pokeball', description: 'A Ball that becomes better the longer the battle goes on.', price: 1000 },
	'repeatball': { id: 'repeatball', name: 'Repeat Ball', category: 'pokeball', description: 'A Ball that works well on Pokémon species already caught.', price: 1000 },
	'nestball': { id: 'nestball', name: 'Nest Ball', category: 'pokeball', description: 'A Ball that works better on lower-level Pokémon.', price: 1000 },
	'duskball': { id: 'duskball', name: 'Dusk Ball', category: 'pokeball', description: 'A Ball that works well at night or in caves.', price: 1000 },
	'netball': { id: 'netball', name: 'Net Ball', category: 'pokeball', description: 'A Ball that works well on Water- and Bug-type Pokémon.', price: 1000 },
	'diveball': { id: 'diveball', name: 'Dive Ball', category: 'pokeball', description: 'A Ball that works well on Pokémon in water.', price: 1000 },
	'healball': { id: 'healball', name: 'Heal Ball', category: 'pokeball', description: 'A Ball that fully heals the Pokémon after catching.', price: 300 },
	'fastball': { id: 'fastball', name: 'Fast Ball', category: 'pokeball', description: 'A Ball that works well on fast Pokémon.', price: 300 },
	'levelball': { id: 'levelball', name: 'Level Ball', category: 'pokeball', description: 'A Ball that works better if your Pokémon is higher level.', price: 300 },
	'heavyball': { id: 'heavyball', name: 'Heavy Ball', category: 'pokeball', description: 'A Ball that works well on heavy Pokémon.', price: 300 },
	'loveball': { id: 'loveball', name: 'Love Ball', category: 'pokeball', description: 'A Ball that works well on opposite-gender Pokémon.', price: 300 },
	'lureball': { id: 'lureball', name: 'Lure Ball', category: 'pokeball', description: 'A Ball that works well on Pokémon encountered while fishing.', price: 300 },
	'moonball': { id: 'moonball', name: 'Moon Ball', category: 'pokeball', description: 'A Ball that works well on Pokémon that evolve with Moon Stone.', price: 300 },
	'friendball': { id: 'friendball', name: 'Friend Ball', category: 'pokeball', description: 'A Ball that makes caught Pokémon friendlier.', price: 300 },
	'luxuryball': { id: 'luxuryball', name: 'Luxury Ball', category: 'pokeball', description: 'A Ball that makes caught Pokémon grow friendlier faster.', price: 1000 },
	'premierball': { id: 'premierball', name: 'Premier Ball', category: 'pokeball', description: 'A commemorative Ball with the same performance as a Poké Ball.', price: 200 },
	'dreamball': { id: 'dreamball', name: 'Dream Ball', category: 'pokeball', description: 'A Ball that works well on sleeping Pokémon.', price: 1000 },
	'safariball': { id: 'safariball', name: 'Safari Ball', category: 'pokeball', description: 'A special Ball used in Safari Zones.', price: 0 },
	'parkball': { id: 'parkball', name: 'Park Ball', category: 'pokeball', description: 'A special Ball for catching Pokémon in special areas.', price: 0 },
	'beastball': { id: 'beastball', name: 'Beast Ball', category: 'pokeball', description: 'A Ball designed to catch Ultra Beasts.', price: 1000 },
	'cherishball': { id: 'cherishball', name: 'Cherish Ball', category: 'pokeball', description: 'A rare Ball made for special events.', price: 0 },
	'sportball': { id: 'sportball', name: 'Sport Ball', category: 'pokeball', description: 'A special Ball used in the Bug-Catching Contest.', price: 0 },
	'strangeball': { id: 'strangeball', name: 'Strange Ball', category: 'pokeball', description: 'A mysterious Ball with unknown properties.', price: 0 },

	// Competitive Held Items (The "Ghost" Items)
	'leftovers': { id: 'leftovers', name: 'Leftovers', category: 'held', description: 'At the end of every turn, holder restores 1/16 of its max HP.', price: 4000 },
	'blacksludge': { id: 'blacksludge', name: 'Black Sludge', category: 'held', description: 'Each turn, if holder is a Poison type, restores 1/16 max HP; otherwise, loses 1/8.', price: 4000 },
	'choiceband': { id: 'choiceband', name: 'Choice Band', category: 'held', description: 'Holder\'s Attack is 1.5x, but it can only select the first move it uses.', price: 4000 },
	'choicespecs': { id: 'choicespecs', name: 'Choice Specs', category: 'held', description: 'Holder\'s Sp. Atk is 1.5x, but it can only select the first move it uses.', price: 4000 },
	'choicescarf': { id: 'choicescarf', name: 'Choice Scarf', category: 'held', description: 'Holder\'s Speed is 1.5x, but it can only select the first move it uses.', price: 4000 },
	'lifeorb': { id: 'lifeorb', name: 'Life Orb', category: 'held', description: 'Holder\'s attacks do 1.3x damage, but it loses 1/10 max HP after attacking.', price: 4000 },
	'toxicorb': { id: 'toxicorb', name: 'Toxic Orb', category: 'held', description: 'At the end of every turn, this item attempts to badly poison the holder.', price: 4000 },
	'flameorb': { id: 'flameorb', name: 'Flame Orb', category: 'held', description: 'At the end of every turn, this item attempts to burn the holder.', price: 4000 },
	'rockyhelmet': { id: 'rockyhelmet', name: 'Rocky Helmet', category: 'held', description: 'If holder is hit by a contact move, the attacker loses 1/6 of its max HP.', price: 4000 },
	'stickybarb': { id: 'stickybarb', name: 'Sticky Barb', category: 'held', description: 'Holder loses 1/8 max HP each turn. Transfers to contact attacker.', price: 4000 },
	'focussash': { id: 'focussash', name: 'Focus Sash', category: 'held', description: 'If holder\'s HP is full, will survive an attack that would KO it with 1 HP.', price: 4000 },
	'airballoon': { id: 'airballoon', name: 'Air Balloon', category: 'held', description: 'Holder is immune to Ground-type attacks. Pops when holder is hit.', price: 4000 },
	'redcard': { id: 'redcard', name: 'Red Card', category: 'held', description: 'If holder survives a hit, attacker is forced to switch.', price: 4000 },
	'expertbelt': { id: 'expertbelt', name: 'Expert Belt', category: 'held', description: 'Holder\'s attacks that are super effective against the target do 1.2x damage.', price: 4000 },
	'weaknesspolicy': { id: 'weaknesspolicy', name: 'Weakness Policy', category: 'held', description: 'If holder is hit super effectively, raises Attack and Sp. Atk by 2 stages.', price: 4000 },
	'assaultvest': { id: 'assaultvest', name: 'Assault Vest', category: 'held', description: 'Holder\'s Sp. Def is 1.5x, but it can only use damaging moves.', price: 4000 },
	'eviolite': { id: 'eviolite', name: 'Eviolite', category: 'held', description: 'If holder\'s species can evolve, its Defense and Sp. Def are 1.5x.', price: 4000 },
	'shedshell': { id: 'shedshell', name: 'Shed Shell', category: 'held', description: 'Holder may switch out even when trapped by another Pokémon, or by Ingrain.', price: 4000 },
	'heavydutyboots': { id: 'heavydutyboots', name: 'Heavy-Duty Boots', category: 'held', description: 'Holder is immune to the effects of Stealth Rock, Spikes, Toxic Spikes, etc.', price: 4000 },
	'clearamulet': { id: 'clearamulet', name: 'Clear Amulet', category: 'held', description: 'Prevents other Pokémon from lowering the holder\'s stats.', price: 4000 },
	'mirrorherb': { id: 'mirrorherb', name: 'Mirror Herb', category: 'held', description: 'Copies opponent\'s stat boosts once.', price: 4000 },
	'mentalherb': { id: 'mentalherb', name: 'Mental Herb', category: 'held', description: 'Cures holder of Attract, Disable, Encore, Heal Block, Taunt, Torment.', price: 4000 },
	'whiteherb': { id: 'whiteherb', name: 'White Herb', category: 'held', description: 'Restores all lowered stat stages to 0 when one is less than 0.', price: 4000 },
	'powerherb': { id: 'powerherb', name: 'Power Herb', category: 'held', description: 'Holder\'s two-turn moves complete in one turn.', price: 4000 },
	'shellbell': { id: 'shellbell', name: 'Shell Bell', category: 'held', description: 'Holder heals 1/8 of damage dealt.', price: 4000 },
	'quickclaw': { id: 'quickclaw', name: 'Quick Claw', category: 'held', description: 'Holder has a 20% chance to move first.', price: 4000 },

	// Weather Rocks
	'heatrock': { id: 'heatrock', name: 'Heat Rock', category: 'held', description: 'Extends the duration of harsh sunlight set by the holder to 8 turns.', price: 4000 },
	'damprock': { id: 'damprock', name: 'Damp Rock', category: 'held', description: 'Extends the duration of rain set by the holder to 8 turns.', price: 4000 },
	'smoothrock': { id: 'smoothrock', name: 'Smooth Rock', category: 'held', description: 'Extends the duration of sandstorm set by the holder to 8 turns.', price: 4000 },
	'icyrock': { id: 'icyrock', name: 'Icy Rock', category: 'held', description: 'Extends the duration of hailstorm set by the holder to 8 turns.', price: 4000 },

	// Utility / Duration
	'lightclay': { id: 'lightclay', name: 'Light Clay', category: 'held', description: 'Extends the duration of barrier moves like Reflect and Light Screen to 8 turns.', price: 4000 },
	'gripclaw': { id: 'gripclaw', name: 'Grip Claw', category: 'held', description: 'Extends the duration of multi-turn binding moves to 7 turns.', price: 4000 },
	'bindingband': { id: 'bindingband', name: 'Binding Band', category: 'held', description: 'Increases the damage dealt by binding moves.', price: 4000 },

	// Stats / Mechanics
	'bigroot': { id: 'bigroot', name: 'Big Root', category: 'held', description: 'Increases the amount of HP restored by draining moves.', price: 4000 },
	'ironball': { id: 'ironball', name: 'Iron Ball', category: 'held', description: 'Halves Speed and grounds the holder.', price: 4000 },
	'boosterenergy': { id: 'boosterenergy', name: 'Booster Energy', category: 'held', description: 'Activates the Protosynthesis or Quark Drive Ability.', price: 4000 },

	// Accuracy & Crits
	'widelens': { id: 'widelens', name: 'Wide Lens', category: 'held', description: 'Boosts accuracy of moves by 10%.', price: 4000 },
	'zoomlens': { id: 'zoomlens', name: 'Zoom Lens', category: 'held', description: 'Boosts accuracy by 20% if the holder moves after the target.', price: 4000 },
	'scopelens': { id: 'scopelens', name: 'Scope Lens', category: 'held', description: 'Boosts critical-hit ratio.', price: 4000 },
	'razorclaw': { id: 'razorclaw', name: 'Razor Claw', category: 'held', description: 'Boosts critical-hit ratio.', price: 4000 },

	// Species Specific
	'lightball': { id: 'lightball', name: 'Light Ball', category: 'held', description: 'If held by a Pikachu, its Attack and Sp. Atk are doubled.', price: 4000 },
	'thickclub': { id: 'thickclub', name: 'Thick Club', category: 'held', description: 'If held by a Cubone or a Marowak, its Attack is doubled.', price: 4000 },
	'deepseatooth': { id: 'deepseatooth', name: 'Deep Sea Tooth', category: 'held', description: 'If held by a Clamperl, its Sp. Atk is doubled.', price: 4000 },
	'deepseascale': { id: 'deepseascale', name: 'Deep Sea Scale', category: 'held', description: 'If held by a Clamperl, its Sp. Def is doubled.', price: 4000 },
	'metalpowder': { id: 'metalpowder', name: 'Metal Powder', category: 'held', description: 'If held by a Ditto, its Defense is doubled.', price: 4000 },

	// Type Enhancers
	'charcoal': { id: 'charcoal', name: 'Charcoal', category: 'held', description: 'Powers up Fire-type moves.', price: 3000 },
	'mysticwater': { id: 'mysticwater', name: 'Mystic Water', category: 'held', description: 'Powers up Water-type moves.', price: 3000 },
	'miracleseed': { id: 'miracleseed', name: 'Miracle Seed', category: 'held', description: 'Powers up Grass-type moves.', price: 3000 },
	'magnet': { id: 'magnet', name: 'Magnet', category: 'held', description: 'Powers up Electric-type moves.', price: 3000 },
	'nevermeltice': { id: 'nevermeltice', name: 'Never-Melt Ice', category: 'held', description: 'Powers up Ice-type moves.', price: 3000 },
	'blackbelt': { id: 'blackbelt', name: 'Black Belt', category: 'held', description: 'Powers up Fighting-type moves.', price: 3000 },
	'poisonbarb': { id: 'poisonbarb', name: 'Poison Barb', category: 'held', description: 'Powers up Poison-type moves.', price: 3000 },
	'softsand': { id: 'softsand', name: 'Soft Sand', category: 'held', description: 'Powers up Ground-type moves.', price: 3000 },
	'sharpbeak': { id: 'sharpbeak', name: 'Sharp Beak', category: 'held', description: 'Powers up Flying-type moves.', price: 3000 },
	'twistedspoon': { id: 'twistedspoon', name: 'Twisted Spoon', category: 'held', description: 'Powers up Psychic-type moves.', price: 3000 },
	'silverpowder': { id: 'silverpowder', name: 'Silver Powder', category: 'held', description: 'Powers up Bug-type moves.', price: 3000 },
	'hardstone': { id: 'hardstone', name: 'Hard Stone', category: 'held', description: 'Powers up Rock-type moves.', price: 3000 },
	'spelltag': { id: 'spelltag', name: 'Spell Tag', category: 'held', description: 'Powers up Ghost-type moves.', price: 3000 },
	'dragonfang': { id: 'dragonfang', name: 'Dragon Fang', category: 'held', description: 'Powers up Dragon-type moves.', price: 3000 },
	'blackglasses': { id: 'blackglasses', name: 'Black Glasses', category: 'held', description: 'Powers up Dark-type moves.', price: 3000 },
	'metalcoat': { id: 'metalcoat', name: 'Metal Coat', category: 'held', description: 'Powers up Steel-type moves.', price: 3000, effects: { evolutionItem: true } },
	'fairymemory': { id: 'fairymemory', name: 'Fairy Memory', category: 'held', description: 'Powers up Fairy-type moves.', price: 3000 },

	// Berries
	'cheriberry': { id: 'cheriberry', name: 'Cheri Berry', category: 'berry', description: 'Cures paralysis.', price: 200, effects: { statusCure: 'par' } },
	'chestoberry': { id: 'chestoberry', name: 'Chesto Berry', category: 'berry', description: 'Cures sleep.', price: 200, effects: { statusCure: 'slp' } },
	'pechaberry': { id: 'pechaberry', name: 'Pecha Berry', category: 'berry', description: 'Cures poison.', price: 200, effects: { statusCure: 'psn' } },
	'rawstberry': { id: 'rawstberry', name: 'Rawst Berry', category: 'berry', description: 'Cures burn.', price: 200, effects: { statusCure: 'brn' } },
	'aspearberry': { id: 'aspearberry', name: 'Aspear Berry', category: 'berry', description: 'Cures freeze.', price: 200, effects: { statusCure: 'frz' } },
	'leppaberry': { id: 'leppaberry', name: 'Leppa Berry', category: 'berry', description: 'Restores 10 PP to a move.', price: 300, effects: { ppRestore: 10 } },
	'persimberry': { id: 'persimberry', name: 'Persim Berry', category: 'berry', description: 'Cures confusion.', price: 200 },
	'oranberry': { id: 'oranberry', name: 'Oran Berry', category: 'berry', description: 'Heals 10 HP.', price: 200 },
	'sitrusberry': { id: 'sitrusberry', name: 'Sitrus Berry', category: 'berry', description: 'Restores 1/4 max HP when at 1/2 HP or less.', price: 300 },
	'lumberry': { id: 'lumberry', name: 'Lum Berry', category: 'berry', description: 'Cures any status condition.', price: 400 },
	
	// Pinch Berries
	'figyberry': { id: 'figyberry', name: 'Figy Berry', category: 'berry', description: 'Restores HP at 1/4 max HP or less. May confuse.', price: 300 },
	'wikiberry': { id: 'wikiberry', name: 'Wiki Berry', category: 'berry', description: 'Restores HP at 1/4 max HP or less. May confuse.', price: 300 },
	'magoberry': { id: 'magoberry', name: 'Mago Berry', category: 'berry', description: 'Restores HP at 1/4 max HP or less. May confuse.', price: 300 },
	'aguavberry': { id: 'aguavberry', name: 'Aguav Berry', category: 'berry', description: 'Restores HP at 1/4 max HP or less. May confuse.', price: 300 },
	'iapapaberry': { id: 'iapapaberry', name: 'Iapapa Berry', category: 'berry', description: 'Restores HP at 1/4 max HP or less. May confuse.', price: 300 },
	'liechiberry': { id: 'liechiberry', name: 'Liechi Berry', category: 'berry', description: 'Raises Attack at 1/4 max HP or less.', price: 300 },
	'ganlonberry': { id: 'ganlonberry', name: 'Ganlon Berry', category: 'berry', description: 'Raises Defense at 1/4 max HP or less.', price: 300 },
	'salacberry': { id: 'salacberry', name: 'Salac Berry', category: 'berry', description: 'Raises Speed at 1/4 max HP or less.', price: 300 },
	'petayaberry': { id: 'petayaberry', name: 'Petaya Berry', category: 'berry', description: 'Raises Sp. Atk at 1/4 max HP or less.', price: 300 },
	'apicotberry': { id: 'apicotberry', name: 'Apicot Berry', category: 'berry', description: 'Raises Sp. Def at 1/4 max HP or less.', price: 300 },
	'starfberry': { id: 'starfberry', name: 'Starf Berry', category: 'berry', description: 'Sharply raises a random stat at 1/4 max HP or less.', price: 500 },

	// Type Resist Berries
	'occaberry': { id: 'occaberry', name: 'Occa Berry', category: 'berry', description: 'Weakens a supereffective Fire-type attack.', price: 300 },
	'passhoberry': { id: 'passhoberry', name: 'Passho Berry', category: 'berry', description: 'Weakens a supereffective Water-type attack.', price: 300 },
	'wacanberry': { id: 'wacanberry', name: 'Wacan Berry', category: 'berry', description: 'Weakens a supereffective Electric-type attack.', price: 300 },
	'rindoberry': { id: 'rindoberry', name: 'Rindo Berry', category: 'berry', description: 'Weakens a supereffective Grass-type attack.', price: 300 },
	'yacheberry': { id: 'yacheberry', name: 'Yache Berry', category: 'berry', description: 'Weakens a supereffective Ice-type attack.', price: 300 },
	'chopleberry': { id: 'chopleberry', name: 'Chople Berry', category: 'berry', description: 'Weakens a supereffective Fighting-type attack.', price: 300 },
	'kebiaberry': { id: 'kebiaberry', name: 'Kebia Berry', category: 'berry', description: 'Weakens a supereffective Poison-type attack.', price: 300 },
	'shucaberry': { id: 'shucaberry', name: 'Shuca Berry', category: 'berry', description: 'Weakens a supereffective Ground-type attack.', price: 300 },
	'cobaberry': { id: 'cobaberry', name: 'Coba Berry', category: 'berry', description: 'Weakens a supereffective Flying-type attack.', price: 300 },
	'payapaberry': { id: 'payapaberry', name: 'Payapa Berry', category: 'berry', description: 'Weakens a supereffective Psychic-type attack.', price: 300 },
	'tangaberry': { id: 'tangaberry', name: 'Tanga Berry', category: 'berry', description: 'Weakens a supereffective Bug-type attack.', price: 300 },
	'chartiberry': { id: 'chartiberry', name: 'Charti Berry', category: 'berry', description: 'Weakens a supereffective Rock-type attack.', price: 300 },
	'kasibberry': { id: 'kasibberry', name: 'Kasib Berry', category: 'berry', description: 'Weakens a supereffective Ghost-type attack.', price: 300 },
	'habanberry': { id: 'habanberry', name: 'Haban Berry', category: 'berry', description: 'Weakens a supereffective Dragon-type attack.', price: 300 },
	'colburberry': { id: 'colburberry', name: 'Colbur Berry', category: 'berry', description: 'Weakens a supereffective Dark-type attack.', price: 300 },
	'babiriberry': { id: 'babiriberry', name: 'Babiri Berry', category: 'berry', description: 'Weakens a supereffective Steel-type attack.', price: 300 },
	'chilanberry': { id: 'chilanberry', name: 'Chilan Berry', category: 'berry', description: 'Weakens a Normal-type attack.', price: 300 },
	'roseliberry': { id: 'roseliberry', name: 'Roseli Berry', category: 'berry', description: 'Weakens a supereffective Fairy-type attack.', price: 300 },

	// Evolution Stones
	'firestone': { id: 'firestone', name: 'Fire Stone', category: 'stone', description: 'Evolves certain Fire-type Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'waterstone': { id: 'waterstone', name: 'Water Stone', category: 'stone', description: 'Evolves certain Water-type Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'thunderstone': { id: 'thunderstone', name: 'Thunder Stone', category: 'stone', description: 'Evolves certain Electric-type Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'leafstone': { id: 'leafstone', name: 'Leaf Stone', category: 'stone', description: 'Evolves certain Grass-type Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'moonstone': { id: 'moonstone', name: 'Moon Stone', category: 'stone', description: 'Evolves certain Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'sunstone': { id: 'sunstone', name: 'Sun Stone', category: 'stone', description: 'Evolves certain Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'shinystone': { id: 'shinystone', name: 'Shiny Stone', category: 'stone', description: 'Evolves certain Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'duskstone': { id: 'duskstone', name: 'Dusk Stone', category: 'stone', description: 'Evolves certain Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'dawnstone': { id: 'dawnstone', name: 'Dawn Stone', category: 'stone', description: 'Evolves certain Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'icestone': { id: 'icestone', name: 'Ice Stone', category: 'stone', description: 'Evolves certain Ice-type Pokémon.', price: 2100, effects: { evolutionItem: true } },
	'dragonscale': { id: 'dragonscale', name: 'Dragon Scale', category: 'stone', description: 'Evolves Seadra.', price: 2100, effects: { evolutionItem: true } },
	'upgrade': { id: 'upgrade', name: 'Up-Grade', category: 'stone', description: 'Evolves Porygon.', price: 2100, effects: { evolutionItem: true } },
};

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
