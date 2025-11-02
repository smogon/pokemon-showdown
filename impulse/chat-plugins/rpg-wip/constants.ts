// Pokemon RPG Constants and Configuration Data
import type { InventoryItem, TrainerSpec, EncounterZone, Stats } from './types';

// Item database
export const ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
	// PokeBalls
	'pokeball': { id: 'pokeball', name: 'Poke Ball', category: 'pokeball', description: 'A device for catching wild Pokemon. It has a 1x catch rate.' },
	'greatball': { id: 'greatball', name: 'Great Ball', category: 'pokeball', description: 'A good, high-performance Poke Ball. It has a 1.5x catch rate.' },
	'ultraball': { id: 'ultraball', name: 'Ultra Ball', category: 'pokeball', description: 'An ultra-high performance Poke Ball. It has a 2x catch rate.' },
	'masterball': { id: 'masterball', name: 'Master Ball', category: 'pokeball', description: 'The best Poke Ball with the ultimate performance. It will catch any wild Pokemon without fail.' },
	'levelball': { id: 'levelball', name: 'Level Ball', category: 'pokeball', description: 'A Poke Ball that works well on Pokemon of a lower level than your own.' },
	'fastball': { id: 'fastball', name: 'Fast Ball', category: 'pokeball', description: 'A Poke Ball that works well on Pokemon that have a high Speed stat.' },
	'timerball': { id: 'timerball', name: 'Timer Ball', category: 'pokeball', description: 'A Poke Ball that becomes more effective the more turns that have passed in battle.' },
	'nestball': { id: 'nestball', name: 'Nest Ball', category: 'pokeball', description: 'A Poke Ball that works well on low-level Pokemon.' },
	'netball': { id: 'netball', name: 'Net Ball', category: 'pokeball', description: 'A Poke Ball that works well on Bug- or Water-type Pokemon.' },
	'quickball': { id: 'quickball', name: 'Quick Ball', category: 'pokeball', description: 'A Poke Ball that provides a high catch rate if used at the start of a wild encounter.' },
	'dreamball': { id: 'dreamball', name: 'Dream Ball', category: 'pokeball', description: 'A Poke Ball that works well on sleeping Pokemon.' },
	'premierball': { id: 'premierball', name: 'Premier Ball', category: 'pokeball', description: 'A somewhat rare Poke Ball that has been specially made to commemorate an event.' },
	'luxuryball': { id: 'luxuryball', name: 'Luxury Ball', category: 'pokeball', description: 'A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly.' },
	'healball': { id: 'healball', name: 'Heal Ball', category: 'pokeball', description: 'A remedial Poke Ball that restores the HP of a Pokemon it catches and eliminates any status conditions.' },
	// Medicine
	'potion': { id: 'potion', name: 'Potion', category: 'medicine', description: 'A spray-type medicine. It restores 20 HP to a Pokemon.' },
	'superpotion': { id: 'superpotion', name: 'Super Potion', category: 'medicine', description: 'A spray-type medicine. It restores 60 HP to a Pokemon.' },
	'hyperpotion': { id: 'hyperpotion', name: 'Hyper Potion', category: 'medicine', description: 'A spray-type medicine. It restores 120 HP to a Pokemon.' },
	'maxpotion': { id: 'maxpotion', name: 'Max Potion', category: 'medicine', description: 'A spray-type medicine. It fully restores the HP of a Pokemon.' },
	'fullrestore': { id: 'fullrestore', name: 'Full Restore', category: 'medicine', description: 'A medicine that fully restores HP and heals any status problems.' },
	'freshwater': { id: 'freshwater', name: 'Fresh Water', category: 'medicine', description: 'Water with high mineral content. It restores 50 HP to a Pokémon.' },
	'sodapop': { id: 'sodapop', name: 'Soda Pop', category: 'medicine', description: 'A fizzy soda drink. It restores 60 HP to a Pokémon.' },
	'lemonade': { id: 'lemonade', name: 'Lemonade', category: 'medicine', description: 'A very sweet drink. It restores 80 HP to a Pokémon.' },
	'moomoomilk': { id: 'moomoomilk', name: 'Moomoo Milk', category: 'medicine', description: 'Milk with a very high nutrition content. It restores 100 HP to a Pokémon.' },
	'tea': { id: 'tea', name: 'Tea', category: 'medicine', description: 'A fragrant tea with a refreshing taste. It restores 120 HP to a Pokémon.' },
	'energyroot': { id: 'energyroot', name: 'Energy Root', category: 'medicine', description: 'A bitter medicinal root. It restores 200 HP to a Pokémon.' },
	'energypowder': { id: 'energypowder', name: 'EnergyPowder', category: 'medicine', description: 'A bitter medicinal powder. It restores 50 HP to a Pokémon.' },
	'healpowder': { id: 'healpowder', name: 'Heal Powder', category: 'medicine', description: 'A bitter powder that heals all status conditions.' },
	// Misc
	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	// Berries & Held Items
	'oranberry': { id: 'oranberry', name: 'Oran Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 10 HP.' },
	'sitrusberry': { id: 'sitrusberry', name: 'Sitrus Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 1/4 of max HP.' },
	'aguavberry': { id: 'aguavberry', name: 'Aguav Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'enigmaberry': { id: 'enigmaberry', name: 'Enigma Berry', category: 'berry', description: 'If a Pokémon holding this Berry is hit with a supereffective move, it will recover 1/4 of its max HP.' },
	'figyberry': { id: 'figyberry', name: 'Figy Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'goldberry': { id: 'goldberry', name: 'Gold Berry', category: 'berry', description: 'A Berry to be consumed by Pokemon. If a Pokemon holds one, it restores 30 HP.' },
	'iapapaberry': { id: 'iapapaberry', name: 'Iapapa Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'magoberry': { id: 'magoberry', name: 'Mago Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'wikiberry': { id: 'wikiberry', name: 'Wiki Berry', category: 'berry', description: 'If a Pokémon holds one, it restores 1/3 of its max HP when it drops to 1/4 or less. May cause confusion.' },
	'berryjuice': { id: 'berryjuice', name: 'Berry Juice', category: 'held', description: 'A 100% natural juice. It restores 20 HP to a Pokémon when its HP drops to 1/2 or less.' },
	'leftovers': { id: 'leftovers', name: 'Leftovers', category: 'held', description: 'An item to be held by a Pokémon. The holder\'s HP is gradually restored during battle.' },
	'blacksludge': { id: 'blacksludge', name: 'Black Sludge', category: 'held', description: 'A held item that gradually restores the HP of Poison-type Pokémon. It damages any other type.' },
	'shellbell': { id: 'shellbell', name: 'Shell Bell', category: 'held', description: 'A held item that restores a little HP to the holder whenever it inflicts damage.' },
	'choiceband': { id: 'choiceband', name: 'Choice Band', category: 'held', description: 'Boosts Attack, but allows the use of only one move.' },
	'choicescarf': { id: 'choicescarf', name: 'Choice Scarf', category: 'held', description: 'Boosts Speed, but allows the use of only one move.' },
	'choicespecs': { id: 'choicespecs', name: 'Choice Specs', category: 'held', description: 'Boosts Special Attack, but allows the use of only one move.' },
	'lifeorb': { id: 'lifeorb', name: 'Life Orb', category: 'held', description: 'Boosts the power of moves, but the holder loses HP after attacking.' },
	'rockyhelmet': { id: 'rockyhelmet', name: 'Rocky Helmet', category: 'held', description: 'If the holder is hit by a contact move, the attacker is also damaged.' },
	'stickybarb': { id: 'stickybarb', name: 'Sticky Barb', category: 'held', description: 'Damages the holder each turn. Can be passed to others on contact.' },
	'jabocaberry': { id: 'jabocaberry', name: 'Jaboca Berry', category: 'berry', description: 'If the holder is hit by a physical move, the attacker is damaged. One-time use.' },
	'rowapberry': { id: 'rowapberry', name: 'Rowap Berry', category: 'berry', description: 'If the holder is hit by a special move, the attacker is damaged. One-time use.' },
	'flameorb': { id: 'flameorb', name: 'Flame Orb', category: 'held', description: 'A held item that will inflict a burn on the holder at the end of the turn.' },
	'toxicorb': { id: 'toxicorb', name: 'Toxic Orb', category: 'held', description: 'A held item that will badly poison the holder at the end of the turn.' },
	'liechiberry': { id: 'liechiberry', name: 'Liechi Berry', category: 'berry', description: 'A held item that raises Attack when HP is low.' },
	'ganlonberry': { id: 'ganlonberry', name: 'Ganlon Berry', category: 'berry', description: 'A held item that raises Defense when HP is low.' },
	'salacberry': { id: 'salacberry', name: 'Salac Berry', category: 'berry', description: 'A held item that raises Speed when HP is low.' },
	'petayaberry': { id: 'petayaberry', name: 'Petaya Berry', category: 'berry', description: 'A held item that raises Special Attack when HP is low.' },
	'apicotberry': { id: 'apicotberry', name: 'Apicot Berry', category: 'berry', description: 'A held item that raises Special Defense when HP is low.' },
	'starfberry': { id: 'starfberry', name: 'Starf Berry', category: 'berry', description: 'A held item that sharply raises a random stat when HP is low.' },
	'keberry': { id: 'keberry', name: 'Kee Berry', category: 'berry', description: 'If the holder is hit by a physical move, its Defense rises. One-time use.' },
	'marangaberry': { id: 'marangaberry', name: 'Maranga Berry', category: 'berry', description: 'If the holder is hit by a special move, its Special Defense rises. One-time use.' },
	'babiriberry': { id: 'babiriberry', name: 'Babiri Berry', category: 'berry', description: 'Weakens a supereffective Steel-type attack. One-time use.' },
	'chartiberry': { id: 'chartiberry', name: 'Charti Berry', category: 'berry', description: 'Weakens a supereffective Rock-type attack. One-time use.' },
	'chilanberry': { id: 'chilanberry', name: 'Chilan Berry', category: 'berry', description: 'Weakens a Normal-type attack. One-time use.' },
	'chopleberry': { id: 'chopleberry', name: 'Chople Berry', category: 'berry', description: 'Weakens a supereffective Fighting-type attack. One-time use.' },
	'cobaberry': { id: 'cobaberry', name: 'Coba Berry', category: 'berry', description: 'Weakens a supereffective Flying-type attack. One-time use.' },
	'colburberry': { id: 'colburberry', name: 'Colbur Berry', category: 'berry', description: 'Weakens a supereffective Dark-type attack. One-time use.' },
	'habanberry': { id: 'habanberry', name: 'Haban Berry', category: 'berry', description: 'Weakens a supereffective Dragon-type attack. One-time use.' },
	'kasibberry': { id: 'kasibberry', name: 'Kasib Berry', category: 'berry', description: 'Weakens a supereffective Ghost-type attack. One-time use.' },
	'kebiaberry': { id: 'kebiaberry', name: 'Kebia Berry', category: 'berry', description: 'Weakens a supereffective Poison-type attack. One-time use.' },
	'occaberry': { id: 'occaberry', name: 'Occa Berry', category: 'berry', description: 'Weakens a supereffective Fire-type attack. One-time use.' },
	'passhoberry': { id: 'passhoberry', name: 'Passho Berry', category: 'berry', description: 'Weakens a supereffective Water-type attack. One-time use.' },
	'payapaberry': { id: 'payapaberry', name: 'Payapa Berry', category: 'berry', description: 'Weakens a supereffective Psychic-type attack. One-time use.' },
	'rindoberry': { id: 'rindoberry', name: 'Rindo Berry', category: 'berry', description: 'Weakens a supereffective Grass-type attack. One-time use.' },
	'roseliberry': { id: 'roseliberry', name: 'Roseli Berry', category: 'berry', description: 'Weakens a supereffective Fairy-type attack. One-time use.' },
	'shucaberry': { id: 'shucaberry', name: 'Shuca Berry', category: 'berry', description: 'Weakens a supereffective Ground-type attack.One-time use.' },
	'tangaberry': { id: 'tangaberry', name: 'Tanga Berry', category: 'berry', description: 'Weakens a supereffective Bug-type attack. One-time use.' },
	'wacanberry': { id: 'wacanberry', name: 'Wacan Berry', category: 'berry', description: 'Weakens a supereffective Electric-type attack. One-time use.' },
	'yacheberry': { id: 'yacheberry', name: 'Yache Berry', category: 'berry', description: 'Weakens a supereffective Ice-type attack. One-time use.' },
	'heavydutyboots': { id: 'heavydutyboots', name: 'Heavy-Duty Boots', category: 'held', description: 'These boots prevent the holder from being affected by entry hazards.' },
	'focussash': { id: 'focussash', name: 'Focus Sash', category: 'held', description: 'If the holder has full HP, it survives a hit that would KO it with 1 HP. One-time use.' },
	'assaultvest': { id: 'assaultvest', name: 'Assault Vest', category: 'held', description: 'Boosts the holder\'s Sp. Def by 1.5x, but they can only select damaging moves.' },
	'eviolite': { id: 'eviolite', name: 'Eviolite', category: 'held', description: 'Boosts the Defense and Sp. Def of a Pokémon that can still evolve by 1.5x.' },
	'airballoon': { id: 'airballoon', name: 'Air Balloon', category: 'held', description: 'The holder is immune to Ground-type moves. Pops when hit.' },
	'heatrock': { id: 'heatrock', name: 'Heat Rock', category: 'held', description: 'A held item that extends the duration of Sunny Day used by the holder.' },
	'damprock': { id: 'damprock', name: 'Damp Rock', category: 'held', description: 'A held item that extends the duration of Rain Dance used by the holder.' },
	'smoothrock': { id: 'smoothrock', name: 'Smooth Rock', category: 'held', description: 'A held item that extends the duration of Sandstorm used by the holder.' },
	'icyrock': { id: 'icyrock', name: 'Icy Rock', category: 'held', description: 'A held item that extends the duration of Hail used by the holder.' },
	'expertbelt': { id: 'expertbelt', name: 'Expert Belt', category: 'held', description: 'An item to be held by a Pokémon. It boosts the power of super-effective moves.' },
	'weaknesspolicy': { id: 'weaknesspolicy', name: 'Weakness Policy', category: 'held', description: 'An item to be held by a Pokémon. Attack and Sp. Atk sharply increase if the holder is hit by a super-effective move.' },
	'lumberry': { id: 'lumberry', name: 'Lum Berry', category: 'berry', description: 'A held item that cures any status condition.' },
	'mentalherb': { id: 'mentalherb', name: 'Mental Herb', category: 'held', description: 'A held item that snaps the holder out of move-binding effects.' },
	'redcard': { id: 'redcard', name: 'Red Card', category: 'held', description: 'A held item that forces the attacker to switch out when the holder is hit by a move.' },
	'quickclaw': { id: 'quickclaw', name: 'Quick Claw', category: 'held', description: 'An item that occasionally allows the holder to move first.' },
	'mirrorherb': { id: 'mirrorherb', name: 'Mirror Herb', category: 'held', description: 'An item that copies stat boosts from the opposing Pokemon when the holder switches in.' },
	'clearamulet': { id: 'clearamulet', name: 'Clear Amulet', category: 'held', description: 'An item that prevents the holder\'s stats from being lowered by moves used by other Pokemon.' },
	'covertcloak': { id: 'covertcloak', name: 'Covert Cloak', category: 'held', description: 'An item that protects the holder from the additional effects of moves.' },
	'kingsrock': { id: 'kingsrock', name: 'King\'s Rock', category: 'held', description: 'An item that may cause the foe to flinch when the holder inflicts damage.' },
	'scopelens': { id: 'scopelens', name: 'Scope Lens', category: 'held', description: 'An item that increases the holder\'s critical hit ratio.' },
	'razorclaw': { id: 'razorclaw', name: 'Razor Claw', category: 'held', description: 'An item that increases the holder\'s critical hit ratio.' },
	'lightclay': { id: 'lightclay', name: 'Light Clay', category: 'held', description: 'An item to be held by a Pokémon. When the holder uses protective moves like Light Screen or Reflect, their effects will last longer than usual.' },
};

// Starter Pokemon data organized by type
export const STARTER_POKEMON = {
	fire: ['charmander'],
	water: ['squirtle'],
	grass: ['bulbasaur'],
};

export const ENCOUNTER_ZONES: Record<string, EncounterZone> = {
	'startertown_grass': {
		name: 'Tall Grass',
		pokemon: ['pidgey', 'rattata', 'caterpie', 'weedle'],
		levelRange: [5, 7],
		battleType: 'single',
	},
	'startertown_pond': {
		name: 'Pond',
		pokemon: ['magikarp', 'feebas'],
		levelRange: [9, 20],
		battleType: 'single',
	},
	'startertown_doubles_grass': {
		name: 'Shaking Grass',
		pokemon: ['pidgey', 'rattata', 'nidoranf', 'nidoranm'],
		levelRange: [6, 8],
		battleType: 'double',
	},
};

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

export const ITEM_PRICES: Record<string, number> = {
	'pokeball': 200, 'greatball': 600, 'ultraball': 800, 'potion': 300, 'superpotion': 700, 'hyperpotion': 1200, 'maxpotion': 2500, 'fullrestore': 3000, 'eggmovetutor': 3000,
	'levelball': 1000, 'fastball': 1000, 'timerball': 1000, 'nestball': 1000, 'netball': 1000, 'quickball': 1000, 'dreamball': 1000,
	'premierball': 200, 'luxuryball': 1000, 'healball': 300,
	'leftovers': 8000, 'blacksludge': 5000, 'shellbell': 6000, 'berryjuice': 500, 'lifeorb': 9000, 'rockyhelmet': 7000, 'stickybarb': 3000,
	'choiceband': 10000, 'choicescarf': 10000, 'choicespecs': 10000,
	'flameorb': 4000, 'toxicorb': 4000,
	'oranberry': 200, 'sitrusberry': 800, 'goldberry': 600, 'aguavberry': 800, 'figyberry': 800, 'iapapaberry': 800, 'magoberry': 800, 'wikiberry': 800,
	'enigmaberry': 1000, 'jabocaberry': 1000, 'rowapberry': 1000,
	'liechiberry': 1200, 'ganlonberry': 1200, 'salacberry': 1200, 'petayaberry': 1200, 'apicotberry': 1200, 'starfberry': 2000,
	'keberry': 1500, 'marangaberry': 1500,
	'babiriberry': 1500, 'chartiberry': 1500, 'chilanberry': 1500, 'chopleberry': 1500, 'cobaberry': 1500, 'colburberry': 1500,
	'habanberry': 1500, 'kasibberry': 1500, 'kebiaberry': 1500, 'occaberry': 1500, 'passhoberry': 1500, 'payapaberry': 1500,
	'rindoberry': 1500, 'roseliberry': 1500, 'shucaberry': 1500, 'tangaberry': 1500, 'wacanberry': 1500, 'yacheberry': 1500,
	'heavydutyboots': 7500,
	'focussash': 5000,
	'assaultvest': 9000,
	'eviolite': 8500,
	'airballoon': 4000,
	'heatrock': 4000,
	'damprock': 4000,
	'smoothrock': 4000,
	'icyrock': 4000,
	'masterball': 100000,
	'freshwater': 250,
	'sodapop': 350,
	'lemonade': 450,
	'moomoomilk': 600,
	'tea': 750,
	'energyroot': 1200,
	'energypowder': 500,
	'healpowder': 450,
	'expertbelt': 4000,
	'weaknesspolicy': 5000,
	'lumberry': 2000,
	'mentalherb': 3000,
	'redcard': 3000,
	'quickclaw': 4000,
	'mirrorherb': 6000,
	'clearamulet': 5000,
	'covertcloak': 4500,
	'kingsrock': 3500,
	'scopelens': 4000,
	'razorclaw': 4000,
	'lightclay': 4000,
};

export const SHOP_INVENTORY: string[] = [
	// Poke Balls
	'pokeball', 'greatball', 'ultraball', 'masterball', 'levelball', 'fastball', 'timerball', 'nestball', 'netball',
	'quickball', 'dreamball', 'premierball', 'luxuryball', 'healball', 'masterball',

	// Potions & Healing Items
	'potion', 'superpotion', 'hyperpotion', 'maxpotion', 'berryjuice', 'fullrestore',
	'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'healpowder',

	// Berries
	'oranberry', 'sitrusberry', 'goldberry', 'aguavberry', 'figyberry', 'iapapaberry', 'magoberry', 'wikiberry',
	'enigmaberry', 'jabocaberry', 'rowapberry', 'liechiberry', 'ganlonberry', 'salacberry', 'petayaberry',
	'apicotberry', 'starfberry', 'keberry', 'marangaberry', 'babiriberry', 'chartiberry', 'chilanberry',
	'chopleberry', 'cobaberry', 'colburberry', 'habanberry', 'kasibberry', 'kebiaberry', 'occaberry',
	'passhoberry', 'payapaberry', 'rindoberry', 'roseliberry', 'shucaberry', 'tangaberry', 'wacanberry', 'yacheberry',
	'lumberry',

	// Held Items
	'leftovers', 'blacksludge', 'shellbell', 'lifeorb', 'rockyhelmet', 'stickybarb',
	'choiceband', 'choicescarf', 'choicespecs', 'flameorb', 'toxicorb',
	'heavydutyboots', 'focussash', 'assaultvest', 'eviolite', 'airballoon',
	'heatrock', 'damprock', 'smoothrock', 'icyrock',
	'expertbelt', 'weaknesspolicy', 'mentalherb', 'redcard',
	'quickclaw', 'mirrorherb', 'clearamulet', 'covertcloak', 'kingsrock', 'scopelens', 'razorclaw',
	'lightclay',

	// Misc Items
	'eggmovetutor',
];

export const TYPE_RESIST_BERRIES: Record<string, string> = {
	'babiriberry': 'Steel', 'chartiberry': 'Rock', 'chilanberry': 'Normal', 'chopleberry': 'Fighting',
	'cobaberry': 'Flying', 'colburberry': 'Dark', 'habanberry': 'Dragon', 'kasibberry': 'Ghost',
	'kebiaberry': 'Poison', 'occaberry': 'Fire', 'passhoberry': 'Water', 'payapaberry': 'Psychic',
	'rindoberry': 'Grass', 'roseliberry': 'Fairy', 'shucaberry': 'Ground', 'tangaberry': 'Bug',
	'wacanberry': 'Electric', 'yacheberry': 'Ice',
};

// Type Chart
export const TYPE_CHART: { [type: string]: { superEffective: string[], notVeryEffective: string[], noEffect: string[] } } = {
	Normal: { superEffective: [], notVeryEffective: ['Rock', 'Steel'], noEffect: ['Ghost'] },
	Fire: { superEffective: ['Grass', 'Ice', 'Bug', 'Steel'], notVeryEffective: ['Fire', 'Water', 'Rock', 'Dragon'], noEffect: [] },
	Water: { superEffective: ['Fire', 'Ground', 'Rock'], notVeryEffective: ['Water', 'Grass', 'Dragon'], noEffect: [] },
	Grass: { superEffective: ['Water', 'Ground', 'Rock'], notVeryEffective: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], noEffect: [] },
	Electric: { superEffective: ['Water', 'Flying'], notVeryEffective: ['Grass', 'Electric', 'Dragon'], noEffect: ['Ground'] },
	Ice: { superEffective: ['Grass', 'Ground', 'Flying', 'Dragon'], notVeryEffective: ['Fire', 'Water', 'Ice', 'Steel'], noEffect: [] },
	Fighting: { superEffective: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], notVeryEffective: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], noEffect: ['Ghost'] },
	Poison: { superEffective: ['Grass', 'Fairy'], notVeryEffective: ['Poison', 'Ground', 'Rock', 'Ghost'], noEffect: ['Steel'] },
	Ground: { superEffective: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], notVeryEffective: ['Grass', 'Bug'], noEffect: ['Flying'] },
	Flying: { superEffective: ['Grass', 'Fighting', 'Bug'], notVeryEffective: ['Electric', 'Rock', 'Steel'], noEffect: [] },
	Psychic: { superEffective: ['Fighting', 'Poison'], notVeryEffective: ['Psychic', 'Steel'], noEffect: ['Dark'] },
	Bug: { superEffective: ['Grass', 'Psychic', 'Dark'], notVeryEffective: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], noEffect: [] },
	Rock: { superEffective: ['Fire', 'Ice', 'Flying', 'Bug'], notVeryEffective: ['Fighting', 'Ground', 'Steel'], noEffect: [] },
	Ghost: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Dark'], noEffect: ['Normal'] },
	Dragon: { superEffective: ['Dragon'], notVeryEffective: ['Steel'], noEffect: ['Fairy'] },
	Dark: { superEffective: ['Psychic', 'Ghost'], notVeryEffective: ['Fighting', 'Dark', 'Fairy'], noEffect: [] },
	Steel: { superEffective: ['Ice', 'Rock', 'Fairy'], notVeryEffective: ['Fire', 'Water', 'Electric', 'Steel'], noEffect: [] },
	Fairy: { superEffective: ['Fighting', 'Dragon', 'Dark'], notVeryEffective: ['Fire', 'Poison', 'Steel'], noEffect: [] },
};

export const NATURES: Record<string, { plus: keyof Stats, minus: keyof Stats } | null> = {
	'Adamant': { plus: 'atk', minus: 'spa' }, 'Bashful': null, 'Brave': { plus: 'atk', minus: 'spe' }, 'Bold': { plus: 'def', minus: 'atk' }, 'Calm': { plus: 'spd', minus: 'atk' }, 'Careful': { plus: 'spd', minus: 'spa' }, 'Docile': null, 'Gentle': { plus: 'spd', minus: 'def' }, 'Hardy': null, 'Hasty': { plus: 'spe', minus: 'def' }, 'Impish': { plus: 'def', minus: 'spa' }, 'Jolly': { plus: 'spe', minus: 'spa' }, 'Lax': { plus: 'def', minus: 'spd' }, 'Lonely': { plus: 'atk', minus: 'def' }, 'Mild': { plus: 'spa', minus: 'def' }, 'Modest': { plus: 'spa', minus: 'atk' }, 'Naive': { plus: 'spe', minus: 'spd' }, 'Naughty': { plus: 'atk', minus: 'spd' }, 'Quiet': { plus: 'spa', minus: 'spe' }, 'Quirky': null, 'Rash': { plus: 'spa', minus: 'spd' }, 'Relaxed': { plus: 'def', minus: 'spe' }, 'Sassy': { plus: 'spd', minus: 'spe' }, 'Serious': null, 'Timid': { plus: 'spe', minus: 'atk' },
};
export const NATURE_LIST = Object.keys(NATURES);

// Database for all trainers
export const TRAINER_DATABASE: Record<string, TrainerSpec> = {
	'rival_1': {
		name: 'Rival',
		money: 500,
		party: [
			{ species: 'eevee', level: 5, item: 'oranberry' },
		],
		dialogue: {
			start: "Wait up! Let's see whose Pokémon is stronger!",
			win: "What? I... I lost?!",
			lose: "Heh! I'm stronger than you!",
		},
	},
	'gym_brock': {
		name: 'Gym Leader Brock',
		money: 1000,
		party: [
			{ species: 'geodude', level: 12, moves: ['tackle', 'rockthrow'] },
			{ species: 'onix', level: 14, moves: ['tackle', 'rockthrow', 'bind', 'harden'], item: 'sitrusberry' },
		],
		dialogue: {
			start: "I'm Brock! I'm the Gym Leader of Pewter City! My rock-hard will is evident in my Pokémon!",
			win: "I... I lost? As proof of your victory, here is the Boulder Badge!",
			lose: "My Pokémon are as solid as rock!",
		},
	},
};
