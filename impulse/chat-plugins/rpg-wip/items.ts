/*
* Pokemon Showdown
* RPG Items
*/
import { Dex } from '../../../sim/dex';
import type { InventoryItem, PlayerData, RPGPokemon, Stats } from './interface';
import { calculateStats, levelUp, checkEvolution, handleLearningMoves, calculateTotalExpForLevel, getMove, type CheckEvolutionContext } from './utils';

export const CUSTOM_ITEMS_DATABASE: Record<string, Omit<InventoryItem, 'quantity'>> = {
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
	'revive': { id: 'revive', name: 'Revive', category: 'medicine', description: 'Revives a fainted Pokémon, restoring half its HP.' },
	'maxrevive': { id: 'maxrevive', name: 'Max Revive', category: 'medicine', description: 'Revives a fainted Pokémon, fully restoring its HP.' },
	'revivalherb': { id: 'revivalherb', name: 'Revival Herb', category: 'medicine', description: 'Revives a Pokémon to max HP, but lowers Friendship.' },
	'sacredash': { id: 'sacredash', name: 'Sacred Ash', category: 'medicine', description: 'Revives all fainted Pokémon and fully restores their HP.' },

	// Specific Status Healers
	'antidote': { id: 'antidote', name: 'Antidote', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from poisoning.' },
	'paralyzeheal': { id: 'paralyzeheal', name: 'Paralyze Heal', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from paralysis.' },
	'awakening': { id: 'awakening', name: 'Awakening', category: 'medicine', description: 'A spray-type medicine. It awakens a sleeping Pokémon.' },
	'burnheal': { id: 'burnheal', name: 'Burn Heal', category: 'medicine', description: 'A spray-type medicine. It heals a Pokémon from a burn.' },
	'iceheal': { id: 'iceheal', name: 'Ice Heal', category: 'medicine', description: 'A spray-type medicine. It defrosts a frozen Pokémon.' },
	'fullheal': { id: 'fullheal', name: 'Full Heal', category: 'medicine', description: 'A spray-type medicine. It heals all status conditions of a single Pokémon.' },

	// PP Restoration Items
	'ether': { id: 'ether', name: 'Ether', category: 'medicine', description: 'Restores 10 PP for one of a Pokémon\'s moves.' },
	'maxether': { id: 'maxether', name: 'Max Ether', category: 'medicine', description: 'Fully restores PP for one of a Pokémon\'s moves.' },
	'elixir': { id: 'elixir', name: 'Elixir', category: 'medicine', description: 'Restores 10 PP for all of a Pokémon\'s moves.' },
	'maxelixir': { id: 'maxelixir', name: 'Max Elixir', category: 'medicine', description: 'Fully restores PP for all of a Pokémon\'s moves.' },

	// EV Vitamins
	'hpup': { id: 'hpup', name: 'HP Up', category: 'medicine', description: 'A nutritious drink. It raises the base HP EVs of a single Pokémon.' },
	'protein': { id: 'protein', name: 'Protein', category: 'medicine', description: 'A nutritious drink. It raises the base Attack EVs of a single Pokémon.' },
	'iron': { id: 'iron', name: 'Iron', category: 'medicine', description: 'A nutritious drink. It raises the base Defense EVs of a single Pokémon.' },
	'calcium': { id: 'calcium', name: 'Calcium', category: 'medicine', description: 'A nutritious drink. It raises the base Sp. Atk EVs of a single Pokémon.' },
	'zinc': { id: 'zinc', name: 'Zinc', category: 'medicine', description: 'A nutritious drink. It raises the base Sp. Def EVs of a single Pokémon.' },
	'carbos': { id: 'carbos', name: 'Carbos', category: 'medicine', description: 'A nutritious drink. It raises the base Speed EVs of a single Pokémon.' },

	'eggmovetutor': { id: 'eggmovetutor', name: 'Egg Move Tutor', category: 'misc', description: 'A special item that teaches a compatible Pokémon one of its Egg Moves.' },
	'rarecandy': { id: 'rarecandy', name: 'Rare Candy', category: 'misc', description: 'A candy that is packed with energy. When consumed, it will instantly raise the level of a single Pokémon by one.' },
	'expcandyxs': { id: 'expcandyxs', name: 'Exp. Candy XS', category: 'misc', description: 'A candy that is packed with energy. Gives 100 Exp. Points to a Pokémon.' },
	'expcandys': { id: 'expcandys', name: 'Exp. Candy S', category: 'misc', description: 'A candy that is packed with energy. Gives 800 Exp. Points to a Pokémon.' },
	'expcandym': { id: 'expcandym', name: 'Exp. Candy M', category: 'misc', description: 'A candy that is packed with energy. Gives 3,000 Exp. Points to a Pokémon.' },
	'expcandyl': { id: 'expcandyl', name: 'Exp. Candy L', category: 'misc', description: 'A candy that is packed with energy. Gives 10,000 Exp. Points to a Pokémon.' },
	'expcandyxl': { id: 'expcandyxl', name: 'Exp. Candy XL', category: 'misc', description: 'A candy that is packed with energy. Gives 30,000 Exp. Points to a Pokémon.' },
	'terashard': { id: 'terashard', name: 'Tera Shard', category: 'misc', description: 'A mysterious shard. When used on a Pokémon, it changes its Tera Type to a new, random type.' },

	// Evolution Stones
	'firestone': { id: 'firestone', name: 'Fire Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is orange.' },
	'waterstone': { id: 'waterstone', name: 'Water Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is blue.' },
	'thunderstone': { id: 'thunderstone', name: 'Thunder Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a lightning bolt pattern.' },
	'leafstone': { id: 'leafstone', name: 'Leaf Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It has a leaf pattern.' },
	'moonstone': { id: 'moonstone', name: 'Moon Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is as black as the night sky.' },
	'sunstone': { id: 'sunstone', name: 'Sun Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It glows like the sun.' },
	'shinystone': { id: 'shinystone', name: 'Shiny Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It shines with a dazzling light.' },
	'duskstone': { id: 'duskstone', name: 'Dusk Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It holds a darkness within.' },
	'dawnstone': { id: 'dawnstone', name: 'Dawn Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It sparkles like a glimmer of hope.' },
	'icestone': { id: 'icestone', name: 'Ice Stone', category: 'misc', description: 'A peculiar stone that makes certain species of Pokémon evolve. It is cold to the touch.' },

	// Evolution Items (Held items that trigger evolution)
	'dragonscale': { id: 'dragonscale', name: 'Dragon Scale', category: 'misc', description: 'A thick, hard scale. When held by Seadra, it triggers evolution into Kingdra.' },
	'kingsrock': { id: 'kingsrock', name: 'King\'s Rock', category: 'misc', description: 'A peculiar rock that makes certain species of Pokémon evolve. Can make foes flinch when held.' },
	'metalcoat': { id: 'metalcoat', name: 'Metal Coat', category: 'misc', description: 'A special metallic coating. When held by Onix or Scyther, it triggers evolution.' },
	'upgrade': { id: 'upgrade', name: 'Up-Grade', category: 'misc', description: 'A transparent device. When held by Porygon, it triggers evolution into Porygon2.' },
	'dubiousdisc': { id: 'dubiousdisc', name: 'Dubious Disc', category: 'misc', description: 'A transparent device. When held by Porygon2, it triggers evolution into Porygon-Z.' },
	'protector': { id: 'protector', name: 'Protector', category: 'misc', description: 'A protective item. When held by Rhydon, it triggers evolution into Rhyperior.' },
	'electirizer': { id: 'electirizer', name: 'Electirizer', category: 'misc', description: 'An electric box. When held by Electabuzz, it triggers evolution into Electivire.' },
	'magmarizer': { id: 'magmarizer', name: 'Magmarizer', category: 'misc', description: 'A magma box. When held by Magmar, it triggers evolution into Magmortar.' },
	'reapercloth': { id: 'reapercloth', name: 'Reaper Cloth', category: 'misc', description: 'A cloth imbued with horrifyingly strong spiritual energy. When held by Dusclops, it triggers evolution into Dusknoir.' },
	'razorclaw': { id: 'razorclaw', name: 'Razor Claw', category: 'misc', description: 'A sharply hooked claw. When held by Sneasel, it triggers evolution into Weavile.' },
	'ovalstone': { id: 'ovalstone', name: 'Oval Stone', category: 'misc', description: 'A peculiar stone that makes Happiny evolve. It is shaped like an egg.' },
	'sachet': { id: 'sachet', name: 'Sachet', category: 'misc', description: 'A sachet filled with perfumes. When held by Spritzee, it triggers evolution into Aromatisse.' },
	'whippeddream': { id: 'whippeddream', name: 'Whipped Dream', category: 'misc', description: 'A soft and sweet treat. When held by Swirlix, it triggers evolution into Slurpuff.' },
	'blackaugurite': { id: 'blackaugurite', name: 'Black Augurite', category: 'misc', description: 'A glassy black stone. When held by Scyther, it triggers evolution into Kleavor.' },
	'metalalloy': { id: 'metalalloy', name: 'Metal Alloy', category: 'misc', description: 'A peculiar metal that makes Duraludon evolve into Archaludon.' },

	// Special Evolution Items
	'magnet': { id: 'magnet', name: 'Magnet', category: 'misc', description: 'A powerful magnet. When held by certain Pokémon, it triggers evolution. Also boosts Electric-type moves.' },
	'chipseal': { id: 'chipseal', name: 'Chipped Pot', category: 'misc', description: 'A cracked teapot. When used on Sinistea, it triggers evolution into Polteageist.' },
	'masterpiece': { id: 'masterpiece', name: 'Unremarkable Teacup', category: 'misc', description: 'An unremarkable teacup. When used on certain Ghost-type Pokémon, it triggers evolution.' },

	// Apple Items (for Applin evolutions)
	'tartapple': { id: 'tartapple', name: 'Tart Apple', category: 'misc', description: 'A very sour apple. When held by Applin, it triggers evolution into Flapple.' },
	'sweetapple': { id: 'sweetapple', name: 'Sweet Apple', category: 'misc', description: 'A very sweet apple. When held by Applin, it triggers evolution into Appletun.' },
	'syruppyapple': { id: 'syruppyapple', name: 'Syrupy Apple', category: 'misc', description: 'A peculiar apple. When held by Applin, it triggers evolution into Dipplin.' },
	'dragonchesto': { id: 'dragonchesto', name: 'Dragon Chesto', category: 'misc', description: 'A rare dragon fruit. When held by Dipplin, it triggers evolution into Hydrapple.' },

	// Trade Evolution Items (Special cases for trade evolutions converted to item-based)
	'tradehelmet': { id: 'tradehelmet', name: 'Shelmet Shell', category: 'misc', description: 'A discarded Shelmet shell. When held by Karrablast, it triggers evolution into Escavalier.' },
	'tradekarrablast': { id: 'tradekarrablast', name: 'Karrablast Shell', category: 'misc', description: 'A discarded Karrablast shell. When held by Shelmet, it triggers evolution into Accelgor.' },

	// Legendary/Mythical Evolution Items
	'towerscrolls': { id: 'towerscrolls', name: 'Tower Scroll', category: 'misc', description: 'An ancient scroll from the Tower of Darkness. When held by Kubfu, it triggers evolution into Urshifu (Single Strike).' },
	'waterscroll': { id: 'waterscroll', name: 'Water Scroll', category: 'misc', description: 'An ancient scroll from the Tower of Waters. When held by Kubfu, it triggers evolution into Urshifu (Rapid Strike).' },

	// Valuable Items
	'nugget': { id: 'nugget', name: 'Nugget', category: 'misc', description: 'A nugget of pure gold. It can be sold at a high price to shops.' },
	'bignugget': { id: 'bignugget', name: 'Big Nugget', category: 'misc', description: 'A very large nugget of pure gold. It can be sold at a very high price to shops.' },
	'pearl': { id: 'pearl', name: 'Pearl', category: 'misc', description: 'A small, pretty pearl. It can be sold cheaply to shops.' },
	'bigpearl': { id: 'bigpearl', name: 'Big Pearl', category: 'misc', description: 'A large, lustrous pearl. It can be sold at a high price to shops.' },
	'starpiece': { id: 'starpiece', name: 'Star Piece', category: 'misc', description: 'A shard of a red gem. It can be sold at a high price to shops.' },

	// Technical Machines (TMs)
	'tm-acidspray': { id: 'tm-acidspray', name: 'TM - Acidspray', category: 'tm', description: 'A technical machine that teaches Acidspray to a compatible Pokémon.' },
	'tm-acrobatics': { id: 'tm-acrobatics', name: 'TM - Acrobatics', category: 'tm', description: 'A technical machine that teaches Acrobatics to a compatible Pokémon.' },
	'tm-aerialace': { id: 'tm-aerialace', name: 'TM - Aerialace', category: 'tm', description: 'A technical machine that teaches Aerialace to a compatible Pokémon.' },
	'tm-agility': { id: 'tm-agility', name: 'TM - Agility', category: 'tm', description: 'A technical machine that teaches Agility to a compatible Pokémon.' },
	'tm-aircutter': { id: 'tm-aircutter', name: 'TM - Aircutter', category: 'tm', description: 'A technical machine that teaches Aircutter to a compatible Pokémon.' },
	'tm-airslash': { id: 'tm-airslash', name: 'TM - Airslash', category: 'tm', description: 'A technical machine that teaches Airslash to a compatible Pokémon.' },
	'tm-alluringvoice': { id: 'tm-alluringvoice', name: 'TM - Alluringvoice', category: 'tm', description: 'A technical machine that teaches Alluringvoice to a compatible Pokémon.' },
	'tm-allyswitch': { id: 'tm-allyswitch', name: 'TM - Allyswitch', category: 'tm', description: 'A technical machine that teaches Allyswitch to a compatible Pokémon.' },
	'tm-amnesia': { id: 'tm-amnesia', name: 'TM - Amnesia', category: 'tm', description: 'A technical machine that teaches Amnesia to a compatible Pokémon.' },
	'tm-assurance': { id: 'tm-assurance', name: 'TM - Assurance', category: 'tm', description: 'A technical machine that teaches Assurance to a compatible Pokémon.' },
	'tm-attract': { id: 'tm-attract', name: 'TM - Attract', category: 'tm', description: 'A technical machine that teaches Attract to a compatible Pokémon.' },
	'tm-aurasphere': { id: 'tm-aurasphere', name: 'TM - Aurasphere', category: 'tm', description: 'A technical machine that teaches Aurasphere to a compatible Pokémon.' },
	'tm-auroraveil': { id: 'tm-auroraveil', name: 'TM - Auroraveil', category: 'tm', description: 'A technical machine that teaches Auroraveil to a compatible Pokémon.' },
	'tm-avalanche': { id: 'tm-avalanche', name: 'TM - Avalanche', category: 'tm', description: 'A technical machine that teaches Avalanche to a compatible Pokémon.' },
	'tm-batonpass': { id: 'tm-batonpass', name: 'TM - Batonpass', category: 'tm', description: 'A technical machine that teaches Batonpass to a compatible Pokémon.' },
	'tm-beatup': { id: 'tm-beatup', name: 'TM - Beatup', category: 'tm', description: 'A technical machine that teaches Beatup to a compatible Pokémon.' },
	'tm-bide': { id: 'tm-bide', name: 'TM - Bide', category: 'tm', description: 'A technical machine that teaches Bide to a compatible Pokémon.' },
	'tm-blastburn': { id: 'tm-blastburn', name: 'TM - Blastburn', category: 'tm', description: 'A technical machine that teaches Blastburn to a compatible Pokémon.' },
	'tm-blazekick': { id: 'tm-blazekick', name: 'TM - Blazekick', category: 'tm', description: 'A technical machine that teaches Blazekick to a compatible Pokémon.' },
	'tm-blizzard': { id: 'tm-blizzard', name: 'TM - Blizzard', category: 'tm', description: 'A technical machine that teaches Blizzard to a compatible Pokémon.' },
	'tm-bodypress': { id: 'tm-bodypress', name: 'TM - Bodypress', category: 'tm', description: 'A technical machine that teaches Bodypress to a compatible Pokémon.' },
	'tm-bodyslam': { id: 'tm-bodyslam', name: 'TM - Bodyslam', category: 'tm', description: 'A technical machine that teaches Bodyslam to a compatible Pokémon.' },
	'tm-bounce': { id: 'tm-bounce', name: 'TM - Bounce', category: 'tm', description: 'A technical machine that teaches Bounce to a compatible Pokémon.' },
	'tm-bravebird': { id: 'tm-bravebird', name: 'TM - Bravebird', category: 'tm', description: 'A technical machine that teaches Bravebird to a compatible Pokémon.' },
	'tm-breakingswipe': { id: 'tm-breakingswipe', name: 'TM - Breakingswipe', category: 'tm', description: 'A technical machine that teaches Breakingswipe to a compatible Pokémon.' },
	'tm-brickbreak': { id: 'tm-brickbreak', name: 'TM - Brickbreak', category: 'tm', description: 'A technical machine that teaches Brickbreak to a compatible Pokémon.' },
	'tm-brine': { id: 'tm-brine', name: 'TM - Brine', category: 'tm', description: 'A technical machine that teaches Brine to a compatible Pokémon.' },
	'tm-brutalswing': { id: 'tm-brutalswing', name: 'TM - Brutalswing', category: 'tm', description: 'A technical machine that teaches Brutalswing to a compatible Pokémon.' },
	'tm-bubblebeam': { id: 'tm-bubblebeam', name: 'TM - Bubblebeam', category: 'tm', description: 'A technical machine that teaches Bubblebeam to a compatible Pokémon.' },
	'tm-bugbite': { id: 'tm-bugbite', name: 'TM - Bugbite', category: 'tm', description: 'A technical machine that teaches Bugbite to a compatible Pokémon.' },
	'tm-bugbuzz': { id: 'tm-bugbuzz', name: 'TM - Bugbuzz', category: 'tm', description: 'A technical machine that teaches Bugbuzz to a compatible Pokémon.' },
	'tm-bulkup': { id: 'tm-bulkup', name: 'TM - Bulkup', category: 'tm', description: 'A technical machine that teaches Bulkup to a compatible Pokémon.' },
	'tm-bulldoze': { id: 'tm-bulldoze', name: 'TM - Bulldoze', category: 'tm', description: 'A technical machine that teaches Bulldoze to a compatible Pokémon.' },
	'tm-bulletseed': { id: 'tm-bulletseed', name: 'TM - Bulletseed', category: 'tm', description: 'A technical machine that teaches Bulletseed to a compatible Pokémon.' },
	'tm-burningjealousy': { id: 'tm-burningjealousy', name: 'TM - Burningjealousy', category: 'tm', description: 'A technical machine that teaches Burningjealousy to a compatible Pokémon.' },
	'tm-calmmind': { id: 'tm-calmmind', name: 'TM - Calmmind', category: 'tm', description: 'A technical machine that teaches Calmmind to a compatible Pokémon.' },
	'tm-captivate': { id: 'tm-captivate', name: 'TM - Captivate', category: 'tm', description: 'A technical machine that teaches Captivate to a compatible Pokémon.' },
	'tm-charge': { id: 'tm-charge', name: 'TM - Charge', category: 'tm', description: 'A technical machine that teaches Charge to a compatible Pokémon.' },
	'tm-chargebeam': { id: 'tm-chargebeam', name: 'TM - Chargebeam', category: 'tm', description: 'A technical machine that teaches Chargebeam to a compatible Pokémon.' },
	'tm-charm': { id: 'tm-charm', name: 'TM - Charm', category: 'tm', description: 'A technical machine that teaches Charm to a compatible Pokémon.' },
	'tm-chillingwater': { id: 'tm-chillingwater', name: 'TM - Chillingwater', category: 'tm', description: 'A technical machine that teaches Chillingwater to a compatible Pokémon.' },
	'tm-closecombat': { id: 'tm-closecombat', name: 'TM - Closecombat', category: 'tm', description: 'A technical machine that teaches Closecombat to a compatible Pokémon.' },
	'tm-coaching': { id: 'tm-coaching', name: 'TM - Coaching', category: 'tm', description: 'A technical machine that teaches Coaching to a compatible Pokémon.' },
	'tm-confide': { id: 'tm-confide', name: 'TM - Confide', category: 'tm', description: 'A technical machine that teaches Confide to a compatible Pokémon.' },
	'tm-confuseray': { id: 'tm-confuseray', name: 'TM - Confuseray', category: 'tm', description: 'A technical machine that teaches Confuseray to a compatible Pokémon.' },
	'tm-cosmicpower': { id: 'tm-cosmicpower', name: 'TM - Cosmicpower', category: 'tm', description: 'A technical machine that teaches Cosmicpower to a compatible Pokémon.' },
	'tm-counter': { id: 'tm-counter', name: 'TM - Counter', category: 'tm', description: 'A technical machine that teaches Counter to a compatible Pokémon.' },
	'tm-crosspoison': { id: 'tm-crosspoison', name: 'TM - Crosspoison', category: 'tm', description: 'A technical machine that teaches Crosspoison to a compatible Pokémon.' },
	'tm-crunch': { id: 'tm-crunch', name: 'TM - Crunch', category: 'tm', description: 'A technical machine that teaches Crunch to a compatible Pokémon.' },
	'tm-curse': { id: 'tm-curse', name: 'TM - Curse', category: 'tm', description: 'A technical machine that teaches Curse to a compatible Pokémon.' },
	'tm-cut': { id: 'tm-cut', name: 'TM - Cut', category: 'tm', description: 'A technical machine that teaches Cut to a compatible Pokémon.' },
	'tm-darkestlariat': { id: 'tm-darkestlariat', name: 'TM - Darkestlariat', category: 'tm', description: 'A technical machine that teaches Darkestlariat to a compatible Pokémon.' },
	'tm-darkpulse': { id: 'tm-darkpulse', name: 'TM - Darkpulse', category: 'tm', description: 'A technical machine that teaches Darkpulse to a compatible Pokémon.' },
	'tm-dazzlinggleam': { id: 'tm-dazzlinggleam', name: 'TM - Dazzlinggleam', category: 'tm', description: 'A technical machine that teaches Dazzlinggleam to a compatible Pokémon.' },
	'tm-defensecurl': { id: 'tm-defensecurl', name: 'TM - Defensecurl', category: 'tm', description: 'A technical machine that teaches Defensecurl to a compatible Pokémon.' },
	'tm-defog': { id: 'tm-defog', name: 'TM - Defog', category: 'tm', description: 'A technical machine that teaches Defog to a compatible Pokémon.' },
	'tm-detect': { id: 'tm-detect', name: 'TM - Detect', category: 'tm', description: 'A technical machine that teaches Detect to a compatible Pokémon.' },
	'tm-dig': { id: 'tm-dig', name: 'TM - Dig', category: 'tm', description: 'A technical machine that teaches Dig to a compatible Pokémon.' },
	'tm-disarmingvoice': { id: 'tm-disarmingvoice', name: 'TM - Disarmingvoice', category: 'tm', description: 'A technical machine that teaches Disarmingvoice to a compatible Pokémon.' },
	'tm-dive': { id: 'tm-dive', name: 'TM - Dive', category: 'tm', description: 'A technical machine that teaches Dive to a compatible Pokémon.' },
	'tm-doubleedge': { id: 'tm-doubleedge', name: 'TM - Doubleedge', category: 'tm', description: 'A technical machine that teaches Doubleedge to a compatible Pokémon.' },
	'tm-doubleteam': { id: 'tm-doubleteam', name: 'TM - Doubleteam', category: 'tm', description: 'A technical machine that teaches Doubleteam to a compatible Pokémon.' },
	'tm-dracometeor': { id: 'tm-dracometeor', name: 'TM - Dracometeor', category: 'tm', description: 'A technical machine that teaches Dracometeor to a compatible Pokémon.' },
	'tm-dragonbreath': { id: 'tm-dragonbreath', name: 'TM - Dragonbreath', category: 'tm', description: 'A technical machine that teaches Dragonbreath to a compatible Pokémon.' },
	'tm-dragoncheer': { id: 'tm-dragoncheer', name: 'TM - Dragoncheer', category: 'tm', description: 'A technical machine that teaches Dragoncheer to a compatible Pokémon.' },
	'tm-dragonclaw': { id: 'tm-dragonclaw', name: 'TM - Dragonclaw', category: 'tm', description: 'A technical machine that teaches Dragonclaw to a compatible Pokémon.' },
	'tm-dragondance': { id: 'tm-dragondance', name: 'TM - Dragondance', category: 'tm', description: 'A technical machine that teaches Dragondance to a compatible Pokémon.' },
	'tm-dragonpulse': { id: 'tm-dragonpulse', name: 'TM - Dragonpulse', category: 'tm', description: 'A technical machine that teaches Dragonpulse to a compatible Pokémon.' },
	'tm-dragonrage': { id: 'tm-dragonrage', name: 'TM - Dragonrage', category: 'tm', description: 'A technical machine that teaches Dragonrage to a compatible Pokémon.' },
	'tm-dragontail': { id: 'tm-dragontail', name: 'TM - Dragontail', category: 'tm', description: 'A technical machine that teaches Dragontail to a compatible Pokémon.' },
	'tm-drainingkiss': { id: 'tm-drainingkiss', name: 'TM - Drainingkiss', category: 'tm', description: 'A technical machine that teaches Drainingkiss to a compatible Pokémon.' },
	'tm-drainpunch': { id: 'tm-drainpunch', name: 'TM - Drainpunch', category: 'tm', description: 'A technical machine that teaches Drainpunch to a compatible Pokémon.' },
	'tm-dreameater': { id: 'tm-dreameater', name: 'TM - Dreameater', category: 'tm', description: 'A technical machine that teaches Dreameater to a compatible Pokémon.' },
	'tm-drillrun': { id: 'tm-drillrun', name: 'TM - Drillrun', category: 'tm', description: 'A technical machine that teaches Drillrun to a compatible Pokémon.' },
	'tm-dualwingbeat': { id: 'tm-dualwingbeat', name: 'TM - Dualwingbeat', category: 'tm', description: 'A technical machine that teaches Dualwingbeat to a compatible Pokémon.' },
	'tm-dynamicpunch': { id: 'tm-dynamicpunch', name: 'TM - Dynamicpunch', category: 'tm', description: 'A technical machine that teaches Dynamicpunch to a compatible Pokémon.' },
	'tm-earthpower': { id: 'tm-earthpower', name: 'TM - Earthpower', category: 'tm', description: 'A technical machine that teaches Earthpower to a compatible Pokémon.' },
	'tm-earthquake': { id: 'tm-earthquake', name: 'TM - Earthquake', category: 'tm', description: 'A technical machine that teaches Earthquake to a compatible Pokémon.' },
	'tm-echoedvoice': { id: 'tm-echoedvoice', name: 'TM - Echoedvoice', category: 'tm', description: 'A technical machine that teaches Echoedvoice to a compatible Pokémon.' },
	'tm-eerieimpulse': { id: 'tm-eerieimpulse', name: 'TM - Eerieimpulse', category: 'tm', description: 'A technical machine that teaches Eerieimpulse to a compatible Pokémon.' },
	'tm-eggbomb': { id: 'tm-eggbomb', name: 'TM - Eggbomb', category: 'tm', description: 'A technical machine that teaches Eggbomb to a compatible Pokémon.' },
	'tm-electricterrain': { id: 'tm-electricterrain', name: 'TM - Electricterrain', category: 'tm', description: 'A technical machine that teaches Electricterrain to a compatible Pokémon.' },
	'tm-electroball': { id: 'tm-electroball', name: 'TM - Electroball', category: 'tm', description: 'A technical machine that teaches Electroball to a compatible Pokémon.' },
	'tm-electroweb': { id: 'tm-electroweb', name: 'TM - Electroweb', category: 'tm', description: 'A technical machine that teaches Electroweb to a compatible Pokémon.' },
	'tm-embargo': { id: 'tm-embargo', name: 'TM - Embargo', category: 'tm', description: 'A technical machine that teaches Embargo to a compatible Pokémon.' },
	'tm-encore': { id: 'tm-encore', name: 'TM - Encore', category: 'tm', description: 'A technical machine that teaches Encore to a compatible Pokémon.' },
	'tm-endeavor': { id: 'tm-endeavor', name: 'TM - Endeavor', category: 'tm', description: 'A technical machine that teaches Endeavor to a compatible Pokémon.' },
	'tm-endure': { id: 'tm-endure', name: 'TM - Endure', category: 'tm', description: 'A technical machine that teaches Endure to a compatible Pokémon.' },
	'tm-energyball': { id: 'tm-energyball', name: 'TM - Energyball', category: 'tm', description: 'A technical machine that teaches Energyball to a compatible Pokémon.' },
	'tm-expandingforce': { id: 'tm-expandingforce', name: 'TM - Expandingforce', category: 'tm', description: 'A technical machine that teaches Expandingforce to a compatible Pokémon.' },
	'tm-explosion': { id: 'tm-explosion', name: 'TM - Explosion', category: 'tm', description: 'A technical machine that teaches Explosion to a compatible Pokémon.' },
	'tm-facade': { id: 'tm-facade', name: 'TM - Facade', category: 'tm', description: 'A technical machine that teaches Facade to a compatible Pokémon.' },
	'tm-faketears': { id: 'tm-faketears', name: 'TM - Faketears', category: 'tm', description: 'A technical machine that teaches Faketears to a compatible Pokémon.' },
	'tm-falseswipe': { id: 'tm-falseswipe', name: 'TM - Falseswipe', category: 'tm', description: 'A technical machine that teaches Falseswipe to a compatible Pokémon.' },
	'tm-featherdance': { id: 'tm-featherdance', name: 'TM - Featherdance', category: 'tm', description: 'A technical machine that teaches Featherdance to a compatible Pokémon.' },
	'tm-fireblast': { id: 'tm-fireblast', name: 'TM - Fireblast', category: 'tm', description: 'A technical machine that teaches Fireblast to a compatible Pokémon.' },
	'tm-firefang': { id: 'tm-firefang', name: 'TM - Firefang', category: 'tm', description: 'A technical machine that teaches Firefang to a compatible Pokémon.' },
	'tm-firepledge': { id: 'tm-firepledge', name: 'TM - Firepledge', category: 'tm', description: 'A technical machine that teaches Firepledge to a compatible Pokémon.' },
	'tm-firepunch': { id: 'tm-firepunch', name: 'TM - Firepunch', category: 'tm', description: 'A technical machine that teaches Firepunch to a compatible Pokémon.' },
	'tm-firespin': { id: 'tm-firespin', name: 'TM - Firespin', category: 'tm', description: 'A technical machine that teaches Firespin to a compatible Pokémon.' },
	'tm-fissure': { id: 'tm-fissure', name: 'TM - Fissure', category: 'tm', description: 'A technical machine that teaches Fissure to a compatible Pokémon.' },
	'tm-flamecharge': { id: 'tm-flamecharge', name: 'TM - Flamecharge', category: 'tm', description: 'A technical machine that teaches Flamecharge to a compatible Pokémon.' },
	'tm-flamethrower': { id: 'tm-flamethrower', name: 'TM - Flamethrower', category: 'tm', description: 'A technical machine that teaches Flamethrower to a compatible Pokémon.' },
	'tm-flareblitz': { id: 'tm-flareblitz', name: 'TM - Flareblitz', category: 'tm', description: 'A technical machine that teaches Flareblitz to a compatible Pokémon.' },
	'tm-flash': { id: 'tm-flash', name: 'TM - Flash', category: 'tm', description: 'A technical machine that teaches Flash to a compatible Pokémon.' },
	'tm-flashcannon': { id: 'tm-flashcannon', name: 'TM - Flashcannon', category: 'tm', description: 'A technical machine that teaches Flashcannon to a compatible Pokémon.' },
	'tm-fling': { id: 'tm-fling', name: 'TM - Fling', category: 'tm', description: 'A technical machine that teaches Fling to a compatible Pokémon.' },
	'tm-flipturn': { id: 'tm-flipturn', name: 'TM - Flipturn', category: 'tm', description: 'A technical machine that teaches Flipturn to a compatible Pokémon.' },
	'tm-fly': { id: 'tm-fly', name: 'TM - Fly', category: 'tm', description: 'A technical machine that teaches Fly to a compatible Pokémon.' },
	'tm-focusblast': { id: 'tm-focusblast', name: 'TM - Focusblast', category: 'tm', description: 'A technical machine that teaches Focusblast to a compatible Pokémon.' },
	'tm-focusenergy': { id: 'tm-focusenergy', name: 'TM - Focusenergy', category: 'tm', description: 'A technical machine that teaches Focusenergy to a compatible Pokémon.' },
	'tm-focuspunch': { id: 'tm-focuspunch', name: 'TM - Focuspunch', category: 'tm', description: 'A technical machine that teaches Focuspunch to a compatible Pokémon.' },
	'tm-followme': { id: 'tm-followme', name: 'TM - Followme', category: 'tm', description: 'A technical machine that teaches Followme to a compatible Pokémon.' },
	'tm-foulplay': { id: 'tm-foulplay', name: 'TM - Foulplay', category: 'tm', description: 'A technical machine that teaches Foulplay to a compatible Pokémon.' },
	'tm-frenzyplant': { id: 'tm-frenzyplant', name: 'TM - Frenzyplant', category: 'tm', description: 'A technical machine that teaches Frenzyplant to a compatible Pokémon.' },
	'tm-frostbreath': { id: 'tm-frostbreath', name: 'TM - Frostbreath', category: 'tm', description: 'A technical machine that teaches Frostbreath to a compatible Pokémon.' },
	'tm-frustration': { id: 'tm-frustration', name: 'TM - Frustration', category: 'tm', description: 'A technical machine that teaches Frustration to a compatible Pokémon.' },
	'tm-furycutter': { id: 'tm-furycutter', name: 'TM - Furycutter', category: 'tm', description: 'A technical machine that teaches Furycutter to a compatible Pokémon.' },
	'tm-futuresight': { id: 'tm-futuresight', name: 'TM - Futuresight', category: 'tm', description: 'A technical machine that teaches Futuresight to a compatible Pokémon.' },
	'tm-gigadrain': { id: 'tm-gigadrain', name: 'TM - Gigadrain', category: 'tm', description: 'A technical machine that teaches Gigadrain to a compatible Pokémon.' },
	'tm-gigaimpact': { id: 'tm-gigaimpact', name: 'TM - Gigaimpact', category: 'tm', description: 'A technical machine that teaches Gigaimpact to a compatible Pokémon.' },
	'tm-grassknot': { id: 'tm-grassknot', name: 'TM - Grassknot', category: 'tm', description: 'A technical machine that teaches Grassknot to a compatible Pokémon.' },
	'tm-grasspledge': { id: 'tm-grasspledge', name: 'TM - Grasspledge', category: 'tm', description: 'A technical machine that teaches Grasspledge to a compatible Pokémon.' },
	'tm-grassyglide': { id: 'tm-grassyglide', name: 'TM - Grassyglide', category: 'tm', description: 'A technical machine that teaches Grassyglide to a compatible Pokémon.' },
	'tm-grassyterrain': { id: 'tm-grassyterrain', name: 'TM - Grassyterrain', category: 'tm', description: 'A technical machine that teaches Grassyterrain to a compatible Pokémon.' },
	'tm-gravity': { id: 'tm-gravity', name: 'TM - Gravity', category: 'tm', description: 'A technical machine that teaches Gravity to a compatible Pokémon.' },
	'tm-guardswap': { id: 'tm-guardswap', name: 'TM - Guardswap', category: 'tm', description: 'A technical machine that teaches Guardswap to a compatible Pokémon.' },
	'tm-gunkshot': { id: 'tm-gunkshot', name: 'TM - Gunkshot', category: 'tm', description: 'A technical machine that teaches Gunkshot to a compatible Pokémon.' },
	'tm-gyroball': { id: 'tm-gyroball', name: 'TM - Gyroball', category: 'tm', description: 'A technical machine that teaches Gyroball to a compatible Pokémon.' },
	'tm-hail': { id: 'tm-hail', name: 'TM - Hail', category: 'tm', description: 'A technical machine that teaches Hail to a compatible Pokémon.' },
	'tm-hardpress': { id: 'tm-hardpress', name: 'TM - Hardpress', category: 'tm', description: 'A technical machine that teaches Hardpress to a compatible Pokémon.' },
	'tm-haze': { id: 'tm-haze', name: 'TM - Haze', category: 'tm', description: 'A technical machine that teaches Haze to a compatible Pokémon.' },
	'tm-headbutt': { id: 'tm-headbutt', name: 'TM - Headbutt', category: 'tm', description: 'A technical machine that teaches Headbutt to a compatible Pokémon.' },
	'tm-heatcrash': { id: 'tm-heatcrash', name: 'TM - Heatcrash', category: 'tm', description: 'A technical machine that teaches Heatcrash to a compatible Pokémon.' },
	'tm-heatwave': { id: 'tm-heatwave', name: 'TM - Heatwave', category: 'tm', description: 'A technical machine that teaches Heatwave to a compatible Pokémon.' },
	'tm-heavyslam': { id: 'tm-heavyslam', name: 'TM - Heavyslam', category: 'tm', description: 'A technical machine that teaches Heavyslam to a compatible Pokémon.' },
	'tm-helpinghand': { id: 'tm-helpinghand', name: 'TM - Helpinghand', category: 'tm', description: 'A technical machine that teaches Helpinghand to a compatible Pokémon.' },
	'tm-hex': { id: 'tm-hex', name: 'TM - Hex', category: 'tm', description: 'A technical machine that teaches Hex to a compatible Pokémon.' },
	'tm-hiddenpower': { id: 'tm-hiddenpower', name: 'TM - Hiddenpower', category: 'tm', description: 'A technical machine that teaches Hiddenpower to a compatible Pokémon.' },
	'tm-highhorsepower': { id: 'tm-highhorsepower', name: 'TM - Highhorsepower', category: 'tm', description: 'A technical machine that teaches Highhorsepower to a compatible Pokémon.' },
	'tm-honeclaws': { id: 'tm-honeclaws', name: 'TM - Honeclaws', category: 'tm', description: 'A technical machine that teaches Honeclaws to a compatible Pokémon.' },
	'tm-horndrill': { id: 'tm-horndrill', name: 'TM - Horndrill', category: 'tm', description: 'A technical machine that teaches Horndrill to a compatible Pokémon.' },
	'tm-hurricane': { id: 'tm-hurricane', name: 'TM - Hurricane', category: 'tm', description: 'A technical machine that teaches Hurricane to a compatible Pokémon.' },
	'tm-hydrocannon': { id: 'tm-hydrocannon', name: 'TM - Hydrocannon', category: 'tm', description: 'A technical machine that teaches Hydrocannon to a compatible Pokémon.' },
	'tm-hydropump': { id: 'tm-hydropump', name: 'TM - Hydropump', category: 'tm', description: 'A technical machine that teaches Hydropump to a compatible Pokémon.' },
	'tm-hyperbeam': { id: 'tm-hyperbeam', name: 'TM - Hyperbeam', category: 'tm', description: 'A technical machine that teaches Hyperbeam to a compatible Pokémon.' },
	'tm-hypervoice': { id: 'tm-hypervoice', name: 'TM - Hypervoice', category: 'tm', description: 'A technical machine that teaches Hypervoice to a compatible Pokémon.' },
	'tm-icebeam': { id: 'tm-icebeam', name: 'TM - Icebeam', category: 'tm', description: 'A technical machine that teaches Icebeam to a compatible Pokémon.' },
	'tm-icefang': { id: 'tm-icefang', name: 'TM - Icefang', category: 'tm', description: 'A technical machine that teaches Icefang to a compatible Pokémon.' },
	'tm-icepunch': { id: 'tm-icepunch', name: 'TM - Icepunch', category: 'tm', description: 'A technical machine that teaches Icepunch to a compatible Pokémon.' },
	'tm-icespinner': { id: 'tm-icespinner', name: 'TM - Icespinner', category: 'tm', description: 'A technical machine that teaches Icespinner to a compatible Pokémon.' },
	'tm-iciclespear': { id: 'tm-iciclespear', name: 'TM - Iciclespear', category: 'tm', description: 'A technical machine that teaches Iciclespear to a compatible Pokémon.' },
	'tm-icywind': { id: 'tm-icywind', name: 'TM - Icywind', category: 'tm', description: 'A technical machine that teaches Icywind to a compatible Pokémon.' },
	'tm-imprison': { id: 'tm-imprison', name: 'TM - Imprison', category: 'tm', description: 'A technical machine that teaches Imprison to a compatible Pokémon.' },
	'tm-incinerate': { id: 'tm-incinerate', name: 'TM - Incinerate', category: 'tm', description: 'A technical machine that teaches Incinerate to a compatible Pokémon.' },
	'tm-infestation': { id: 'tm-infestation', name: 'TM - Infestation', category: 'tm', description: 'A technical machine that teaches Infestation to a compatible Pokémon.' },
	'tm-irondefense': { id: 'tm-irondefense', name: 'TM - Irondefense', category: 'tm', description: 'A technical machine that teaches Irondefense to a compatible Pokémon.' },
	'tm-ironhead': { id: 'tm-ironhead', name: 'TM - Ironhead', category: 'tm', description: 'A technical machine that teaches Ironhead to a compatible Pokémon.' },
	'tm-irontail': { id: 'tm-irontail', name: 'TM - Irontail', category: 'tm', description: 'A technical machine that teaches Irontail to a compatible Pokémon.' },
	'tm-knockoff': { id: 'tm-knockoff', name: 'TM - Knockoff', category: 'tm', description: 'A technical machine that teaches Knockoff to a compatible Pokémon.' },
	'tm-lashout': { id: 'tm-lashout', name: 'TM - Lashout', category: 'tm', description: 'A technical machine that teaches Lashout to a compatible Pokémon.' },
	'tm-leafblade': { id: 'tm-leafblade', name: 'TM - Leafblade', category: 'tm', description: 'A technical machine that teaches Leafblade to a compatible Pokémon.' },
	'tm-leafstorm': { id: 'tm-leafstorm', name: 'TM - Leafstorm', category: 'tm', description: 'A technical machine that teaches Leafstorm to a compatible Pokémon.' },
	'tm-leechlife': { id: 'tm-leechlife', name: 'TM - Leechlife', category: 'tm', description: 'A technical machine that teaches Leechlife to a compatible Pokémon.' },
	'tm-lightscreen': { id: 'tm-lightscreen', name: 'TM - Lightscreen', category: 'tm', description: 'A technical machine that teaches Lightscreen to a compatible Pokémon.' },
	'tm-liquidation': { id: 'tm-liquidation', name: 'TM - Liquidation', category: 'tm', description: 'A technical machine that teaches Liquidation to a compatible Pokémon.' },
	'tm-lowkick': { id: 'tm-lowkick', name: 'TM - Lowkick', category: 'tm', description: 'A technical machine that teaches Lowkick to a compatible Pokémon.' },
	'tm-lowsweep': { id: 'tm-lowsweep', name: 'TM - Lowsweep', category: 'tm', description: 'A technical machine that teaches Lowsweep to a compatible Pokémon.' },
	'tm-lunge': { id: 'tm-lunge', name: 'TM - Lunge', category: 'tm', description: 'A technical machine that teaches Lunge to a compatible Pokémon.' },
	'tm-magicalleaf': { id: 'tm-magicalleaf', name: 'TM - Magicalleaf', category: 'tm', description: 'A technical machine that teaches Magicalleaf to a compatible Pokémon.' },
	'tm-magicroom': { id: 'tm-magicroom', name: 'TM - Magicroom', category: 'tm', description: 'A technical machine that teaches Magicroom to a compatible Pokémon.' },
	'tm-megadrain': { id: 'tm-megadrain', name: 'TM - Megadrain', category: 'tm', description: 'A technical machine that teaches Megadrain to a compatible Pokémon.' },
	'tm-megahorn': { id: 'tm-megahorn', name: 'TM - Megahorn', category: 'tm', description: 'A technical machine that teaches Megahorn to a compatible Pokémon.' },
	'tm-megakick': { id: 'tm-megakick', name: 'TM - Megakick', category: 'tm', description: 'A technical machine that teaches Megakick to a compatible Pokémon.' },
	'tm-megapunch': { id: 'tm-megapunch', name: 'TM - Megapunch', category: 'tm', description: 'A technical machine that teaches Megapunch to a compatible Pokémon.' },
	'tm-metalclaw': { id: 'tm-metalclaw', name: 'TM - Metalclaw', category: 'tm', description: 'A technical machine that teaches Metalclaw to a compatible Pokémon.' },
	'tm-metalsound': { id: 'tm-metalsound', name: 'TM - Metalsound', category: 'tm', description: 'A technical machine that teaches Metalsound to a compatible Pokémon.' },
	'tm-meteorbeam': { id: 'tm-meteorbeam', name: 'TM - Meteorbeam', category: 'tm', description: 'A technical machine that teaches Meteorbeam to a compatible Pokémon.' },
	'tm-metronome': { id: 'tm-metronome', name: 'TM - Metronome', category: 'tm', description: 'A technical machine that teaches Metronome to a compatible Pokémon.' },
	'tm-mimic': { id: 'tm-mimic', name: 'TM - Mimic', category: 'tm', description: 'A technical machine that teaches Mimic to a compatible Pokémon.' },
	'tm-mistyexplosion': { id: 'tm-mistyexplosion', name: 'TM - Mistyexplosion', category: 'tm', description: 'A technical machine that teaches Mistyexplosion to a compatible Pokémon.' },
	'tm-mistyterrain': { id: 'tm-mistyterrain', name: 'TM - Mistyterrain', category: 'tm', description: 'A technical machine that teaches Mistyterrain to a compatible Pokémon.' },
	'tm-muddywater': { id: 'tm-muddywater', name: 'TM - Muddywater', category: 'tm', description: 'A technical machine that teaches Muddywater to a compatible Pokémon.' },
	'tm-mudshot': { id: 'tm-mudshot', name: 'TM - Mudshot', category: 'tm', description: 'A technical machine that teaches Mudshot to a compatible Pokémon.' },
	'tm-mudslap': { id: 'tm-mudslap', name: 'TM - Mudslap', category: 'tm', description: 'A technical machine that teaches Mudslap to a compatible Pokémon.' },
	'tm-mysticalfire': { id: 'tm-mysticalfire', name: 'TM - Mysticalfire', category: 'tm', description: 'A technical machine that teaches Mysticalfire to a compatible Pokémon.' },
	'tm-nastyplot': { id: 'tm-nastyplot', name: 'TM - Nastyplot', category: 'tm', description: 'A technical machine that teaches Nastyplot to a compatible Pokémon.' },
	'tm-naturalgift': { id: 'tm-naturalgift', name: 'TM - Naturalgift', category: 'tm', description: 'A technical machine that teaches Naturalgift to a compatible Pokémon.' },
	'tm-naturepower': { id: 'tm-naturepower', name: 'TM - Naturepower', category: 'tm', description: 'A technical machine that teaches Naturepower to a compatible Pokémon.' },
	'tm-nightmare': { id: 'tm-nightmare', name: 'TM - Nightmare', category: 'tm', description: 'A technical machine that teaches Nightmare to a compatible Pokémon.' },
	'tm-nightshade': { id: 'tm-nightshade', name: 'TM - Nightshade', category: 'tm', description: 'A technical machine that teaches Nightshade to a compatible Pokémon.' },
	'tm-outrage': { id: 'tm-outrage', name: 'TM - Outrage', category: 'tm', description: 'A technical machine that teaches Outrage to a compatible Pokémon.' },
	'tm-overheat': { id: 'tm-overheat', name: 'TM - Overheat', category: 'tm', description: 'A technical machine that teaches Overheat to a compatible Pokémon.' },
	'tm-painsplit': { id: 'tm-painsplit', name: 'TM - Painsplit', category: 'tm', description: 'A technical machine that teaches Painsplit to a compatible Pokémon.' },
	'tm-payback': { id: 'tm-payback', name: 'TM - Payback', category: 'tm', description: 'A technical machine that teaches Payback to a compatible Pokémon.' },
	'tm-payday': { id: 'tm-payday', name: 'TM - Payday', category: 'tm', description: 'A technical machine that teaches Payday to a compatible Pokémon.' },
	'tm-petalblizzard': { id: 'tm-petalblizzard', name: 'TM - Petalblizzard', category: 'tm', description: 'A technical machine that teaches Petalblizzard to a compatible Pokémon.' },
	'tm-phantomforce': { id: 'tm-phantomforce', name: 'TM - Phantomforce', category: 'tm', description: 'A technical machine that teaches Phantomforce to a compatible Pokémon.' },
	'tm-pinmissile': { id: 'tm-pinmissile', name: 'TM - Pinmissile', category: 'tm', description: 'A technical machine that teaches Pinmissile to a compatible Pokémon.' },
	'tm-playrough': { id: 'tm-playrough', name: 'TM - Playrough', category: 'tm', description: 'A technical machine that teaches Playrough to a compatible Pokémon.' },
	'tm-pluck': { id: 'tm-pluck', name: 'TM - Pluck', category: 'tm', description: 'A technical machine that teaches Pluck to a compatible Pokémon.' },
	'tm-poisonjab': { id: 'tm-poisonjab', name: 'TM - Poisonjab', category: 'tm', description: 'A technical machine that teaches Poisonjab to a compatible Pokémon.' },
	'tm-poisontail': { id: 'tm-poisontail', name: 'TM - Poisontail', category: 'tm', description: 'A technical machine that teaches Poisontail to a compatible Pokémon.' },
	'tm-pollenpuff': { id: 'tm-pollenpuff', name: 'TM - Pollenpuff', category: 'tm', description: 'A technical machine that teaches Pollenpuff to a compatible Pokémon.' },
	'tm-poltergeist': { id: 'tm-poltergeist', name: 'TM - Poltergeist', category: 'tm', description: 'A technical machine that teaches Poltergeist to a compatible Pokémon.' },
	'tm-pounce': { id: 'tm-pounce', name: 'TM - Pounce', category: 'tm', description: 'A technical machine that teaches Pounce to a compatible Pokémon.' },
	'tm-powergem': { id: 'tm-powergem', name: 'TM - Powergem', category: 'tm', description: 'A technical machine that teaches Powergem to a compatible Pokémon.' },
	'tm-powerswap': { id: 'tm-powerswap', name: 'TM - Powerswap', category: 'tm', description: 'A technical machine that teaches Powerswap to a compatible Pokémon.' },
	'tm-poweruppunch': { id: 'tm-poweruppunch', name: 'TM - Poweruppunch', category: 'tm', description: 'A technical machine that teaches Poweruppunch to a compatible Pokémon.' },
	'tm-powerwhip': { id: 'tm-powerwhip', name: 'TM - Powerwhip', category: 'tm', description: 'A technical machine that teaches Powerwhip to a compatible Pokémon.' },
	'tm-protect': { id: 'tm-protect', name: 'TM - Protect', category: 'tm', description: 'A technical machine that teaches Protect to a compatible Pokémon.' },
	'tm-psybeam': { id: 'tm-psybeam', name: 'TM - Psybeam', category: 'tm', description: 'A technical machine that teaches Psybeam to a compatible Pokémon.' },
	'tm-psychic': { id: 'tm-psychic', name: 'TM - Psychic', category: 'tm', description: 'A technical machine that teaches Psychic to a compatible Pokémon.' },
	'tm-psychicfangs': { id: 'tm-psychicfangs', name: 'TM - Psychicfangs', category: 'tm', description: 'A technical machine that teaches Psychicfangs to a compatible Pokémon.' },
	'tm-psychicnoise': { id: 'tm-psychicnoise', name: 'TM - Psychicnoise', category: 'tm', description: 'A technical machine that teaches Psychicnoise to a compatible Pokémon.' },
	'tm-psychicterrain': { id: 'tm-psychicterrain', name: 'TM - Psychicterrain', category: 'tm', description: 'A technical machine that teaches Psychicterrain to a compatible Pokémon.' },
	'tm-psychocut': { id: 'tm-psychocut', name: 'TM - Psychocut', category: 'tm', description: 'A technical machine that teaches Psychocut to a compatible Pokémon.' },
	'tm-psychup': { id: 'tm-psychup', name: 'TM - Psychup', category: 'tm', description: 'A technical machine that teaches Psychup to a compatible Pokémon.' },
	'tm-psyshock': { id: 'tm-psyshock', name: 'TM - Psyshock', category: 'tm', description: 'A technical machine that teaches Psyshock to a compatible Pokémon.' },
	'tm-psywave': { id: 'tm-psywave', name: 'TM - Psywave', category: 'tm', description: 'A technical machine that teaches Psywave to a compatible Pokémon.' },
	'tm-quash': { id: 'tm-quash', name: 'TM - Quash', category: 'tm', description: 'A technical machine that teaches Quash to a compatible Pokémon.' },
	'tm-rage': { id: 'tm-rage', name: 'TM - Rage', category: 'tm', description: 'A technical machine that teaches Rage to a compatible Pokémon.' },
	'tm-raindance': { id: 'tm-raindance', name: 'TM - Raindance', category: 'tm', description: 'A technical machine that teaches Raindance to a compatible Pokémon.' },
	'tm-razorshell': { id: 'tm-razorshell', name: 'TM - Razorshell', category: 'tm', description: 'A technical machine that teaches Razorshell to a compatible Pokémon.' },
	'tm-razorwind': { id: 'tm-razorwind', name: 'TM - Razorwind', category: 'tm', description: 'A technical machine that teaches Razorwind to a compatible Pokémon.' },
	'tm-recycle': { id: 'tm-recycle', name: 'TM - Recycle', category: 'tm', description: 'A technical machine that teaches Recycle to a compatible Pokémon.' },
	'tm-reflect': { id: 'tm-reflect', name: 'TM - Reflect', category: 'tm', description: 'A technical machine that teaches Reflect to a compatible Pokémon.' },
	'tm-rest': { id: 'tm-rest', name: 'TM - Rest', category: 'tm', description: 'A technical machine that teaches Rest to a compatible Pokémon.' },
	'tm-retaliate': { id: 'tm-retaliate', name: 'TM - Retaliate', category: 'tm', description: 'A technical machine that teaches Retaliate to a compatible Pokémon.' },
	'tm-return': { id: 'tm-return', name: 'TM - Return', category: 'tm', description: 'A technical machine that teaches Return to a compatible Pokémon.' },
	'tm-revenge': { id: 'tm-revenge', name: 'TM - Revenge', category: 'tm', description: 'A technical machine that teaches Revenge to a compatible Pokémon.' },
	'tm-reversal': { id: 'tm-reversal', name: 'TM - Reversal', category: 'tm', description: 'A technical machine that teaches Reversal to a compatible Pokémon.' },
	'tm-roar': { id: 'tm-roar', name: 'TM - Roar', category: 'tm', description: 'A technical machine that teaches Roar to a compatible Pokémon.' },
	'tm-rockblast': { id: 'tm-rockblast', name: 'TM - Rockblast', category: 'tm', description: 'A technical machine that teaches Rockblast to a compatible Pokémon.' },
	'tm-rockclimb': { id: 'tm-rockclimb', name: 'TM - Rockclimb', category: 'tm', description: 'A technical machine that teaches Rockclimb to a compatible Pokémon.' },
	'tm-rockpolish': { id: 'tm-rockpolish', name: 'TM - Rockpolish', category: 'tm', description: 'A technical machine that teaches Rockpolish to a compatible Pokémon.' },
	'tm-rockslide': { id: 'tm-rockslide', name: 'TM - Rockslide', category: 'tm', description: 'A technical machine that teaches Rockslide to a compatible Pokémon.' },
	'tm-rocksmash': { id: 'tm-rocksmash', name: 'TM - Rocksmash', category: 'tm', description: 'A technical machine that teaches Rocksmash to a compatible Pokémon.' },
	'tm-rocktomb': { id: 'tm-rocktomb', name: 'TM - Rocktomb', category: 'tm', description: 'A technical machine that teaches Rocktomb to a compatible Pokémon.' },
	'tm-rollout': { id: 'tm-rollout', name: 'TM - Rollout', category: 'tm', description: 'A technical machine that teaches Rollout to a compatible Pokémon.' },
	'tm-roost': { id: 'tm-roost', name: 'TM - Roost', category: 'tm', description: 'A technical machine that teaches Roost to a compatible Pokémon.' },
	'tm-round': { id: 'tm-round', name: 'TM - Round', category: 'tm', description: 'A technical machine that teaches Round to a compatible Pokémon.' },
	'tm-safeguard': { id: 'tm-safeguard', name: 'TM - Safeguard', category: 'tm', description: 'A technical machine that teaches Safeguard to a compatible Pokémon.' },
	'tm-sandstorm': { id: 'tm-sandstorm', name: 'TM - Sandstorm', category: 'tm', description: 'A technical machine that teaches Sandstorm to a compatible Pokémon.' },
	'tm-sandtomb': { id: 'tm-sandtomb', name: 'TM - Sandtomb', category: 'tm', description: 'A technical machine that teaches Sandtomb to a compatible Pokémon.' },
	'tm-scald': { id: 'tm-scald', name: 'TM - Scald', category: 'tm', description: 'A technical machine that teaches Scald to a compatible Pokémon.' },
	'tm-scaleshot': { id: 'tm-scaleshot', name: 'TM - Scaleshot', category: 'tm', description: 'A technical machine that teaches Scaleshot to a compatible Pokémon.' },
	'tm-scaryface': { id: 'tm-scaryface', name: 'TM - Scaryface', category: 'tm', description: 'A technical machine that teaches Scaryface to a compatible Pokémon.' },
	'tm-scorchingsands': { id: 'tm-scorchingsands', name: 'TM - Scorchingsands', category: 'tm', description: 'A technical machine that teaches Scorchingsands to a compatible Pokémon.' },
	'tm-screech': { id: 'tm-screech', name: 'TM - Screech', category: 'tm', description: 'A technical machine that teaches Screech to a compatible Pokémon.' },
	'tm-secretpower': { id: 'tm-secretpower', name: 'TM - Secretpower', category: 'tm', description: 'A technical machine that teaches Secretpower to a compatible Pokémon.' },
	'tm-seedbomb': { id: 'tm-seedbomb', name: 'TM - Seedbomb', category: 'tm', description: 'A technical machine that teaches Seedbomb to a compatible Pokémon.' },
	'tm-seismictoss': { id: 'tm-seismictoss', name: 'TM - Seismictoss', category: 'tm', description: 'A technical machine that teaches Seismictoss to a compatible Pokémon.' },
	'tm-selfdestruct': { id: 'tm-selfdestruct', name: 'TM - Selfdestruct', category: 'tm', description: 'A technical machine that teaches Selfdestruct to a compatible Pokémon.' },
	'tm-shadowball': { id: 'tm-shadowball', name: 'TM - Shadowball', category: 'tm', description: 'A technical machine that teaches Shadowball to a compatible Pokémon.' },
	'tm-shadowclaw': { id: 'tm-shadowclaw', name: 'TM - Shadowclaw', category: 'tm', description: 'A technical machine that teaches Shadowclaw to a compatible Pokémon.' },
	'tm-shockwave': { id: 'tm-shockwave', name: 'TM - Shockwave', category: 'tm', description: 'A technical machine that teaches Shockwave to a compatible Pokémon.' },
	'tm-silverwind': { id: 'tm-silverwind', name: 'TM - Silverwind', category: 'tm', description: 'A technical machine that teaches Silverwind to a compatible Pokémon.' },
	'tm-skillswap': { id: 'tm-skillswap', name: 'TM - Skillswap', category: 'tm', description: 'A technical machine that teaches Skillswap to a compatible Pokémon.' },
	'tm-skittersmack': { id: 'tm-skittersmack', name: 'TM - Skittersmack', category: 'tm', description: 'A technical machine that teaches Skittersmack to a compatible Pokémon.' },
	'tm-skullbash': { id: 'tm-skullbash', name: 'TM - Skullbash', category: 'tm', description: 'A technical machine that teaches Skullbash to a compatible Pokémon.' },
	'tm-skyattack': { id: 'tm-skyattack', name: 'TM - Skyattack', category: 'tm', description: 'A technical machine that teaches Skyattack to a compatible Pokémon.' },
	'tm-skydrop': { id: 'tm-skydrop', name: 'TM - Skydrop', category: 'tm', description: 'A technical machine that teaches Skydrop to a compatible Pokémon.' },
	'tm-sleeptalk': { id: 'tm-sleeptalk', name: 'TM - Sleeptalk', category: 'tm', description: 'A technical machine that teaches Sleeptalk to a compatible Pokémon.' },
	'tm-sludgebomb': { id: 'tm-sludgebomb', name: 'TM - Sludgebomb', category: 'tm', description: 'A technical machine that teaches Sludgebomb to a compatible Pokémon.' },
	'tm-sludgewave': { id: 'tm-sludgewave', name: 'TM - Sludgewave', category: 'tm', description: 'A technical machine that teaches Sludgewave to a compatible Pokémon.' },
	'tm-smackdown': { id: 'tm-smackdown', name: 'TM - Smackdown', category: 'tm', description: 'A technical machine that teaches Smackdown to a compatible Pokémon.' },
	'tm-smartstrike': { id: 'tm-smartstrike', name: 'TM - Smartstrike', category: 'tm', description: 'A technical machine that teaches Smartstrike to a compatible Pokémon.' },
	'tm-snarl': { id: 'tm-snarl', name: 'TM - Snarl', category: 'tm', description: 'A technical machine that teaches Snarl to a compatible Pokémon.' },
	'tm-snatch': { id: 'tm-snatch', name: 'TM - Snatch', category: 'tm', description: 'A technical machine that teaches Snatch to a compatible Pokémon.' },
	'tm-snore': { id: 'tm-snore', name: 'TM - Snore', category: 'tm', description: 'A technical machine that teaches Snore to a compatible Pokémon.' },
	'tm-snowscape': { id: 'tm-snowscape', name: 'TM - Snowscape', category: 'tm', description: 'A technical machine that teaches Snowscape to a compatible Pokémon.' },
	'tm-softboiled': { id: 'tm-softboiled', name: 'TM - Softboiled', category: 'tm', description: 'A technical machine that teaches Softboiled to a compatible Pokémon.' },
	'tm-solarbeam': { id: 'tm-solarbeam', name: 'TM - Solarbeam', category: 'tm', description: 'A technical machine that teaches Solarbeam to a compatible Pokémon.' },
	'tm-solarblade': { id: 'tm-solarblade', name: 'TM - Solarblade', category: 'tm', description: 'A technical machine that teaches Solarblade to a compatible Pokémon.' },
	'tm-speedswap': { id: 'tm-speedswap', name: 'TM - Speedswap', category: 'tm', description: 'A technical machine that teaches Speedswap to a compatible Pokémon.' },
	'tm-spikes': { id: 'tm-spikes', name: 'TM - Spikes', category: 'tm', description: 'A technical machine that teaches Spikes to a compatible Pokémon.' },
	'tm-spite': { id: 'tm-spite', name: 'TM - Spite', category: 'tm', description: 'A technical machine that teaches Spite to a compatible Pokémon.' },
	'tm-stealthrock': { id: 'tm-stealthrock', name: 'TM - Stealthrock', category: 'tm', description: 'A technical machine that teaches Stealthrock to a compatible Pokémon.' },
	'tm-steelbeam': { id: 'tm-steelbeam', name: 'TM - Steelbeam', category: 'tm', description: 'A technical machine that teaches Steelbeam to a compatible Pokémon.' },
	'tm-steelwing': { id: 'tm-steelwing', name: 'TM - Steelwing', category: 'tm', description: 'A technical machine that teaches Steelwing to a compatible Pokémon.' },
	'tm-stompingtantrum': { id: 'tm-stompingtantrum', name: 'TM - Stompingtantrum', category: 'tm', description: 'A technical machine that teaches Stompingtantrum to a compatible Pokémon.' },
	'tm-stoneedge': { id: 'tm-stoneedge', name: 'TM - Stoneedge', category: 'tm', description: 'A technical machine that teaches Stoneedge to a compatible Pokémon.' },
	'tm-storedpower': { id: 'tm-storedpower', name: 'TM - Storedpower', category: 'tm', description: 'A technical machine that teaches Storedpower to a compatible Pokémon.' },
	'tm-strength': { id: 'tm-strength', name: 'TM - Strength', category: 'tm', description: 'A technical machine that teaches Strength to a compatible Pokémon.' },
	'tm-strugglebug': { id: 'tm-strugglebug', name: 'TM - Strugglebug', category: 'tm', description: 'A technical machine that teaches Strugglebug to a compatible Pokémon.' },
	'tm-submission': { id: 'tm-submission', name: 'TM - Submission', category: 'tm', description: 'A technical machine that teaches Submission to a compatible Pokémon.' },
	'tm-substitute': { id: 'tm-substitute', name: 'TM - Substitute', category: 'tm', description: 'A technical machine that teaches Substitute to a compatible Pokémon.' },
	'tm-sunnyday': { id: 'tm-sunnyday', name: 'TM - Sunnyday', category: 'tm', description: 'A technical machine that teaches Sunnyday to a compatible Pokémon.' },
	'tm-supercellslam': { id: 'tm-supercellslam', name: 'TM - Supercellslam', category: 'tm', description: 'A technical machine that teaches Supercellslam to a compatible Pokémon.' },
	'tm-superfang': { id: 'tm-superfang', name: 'TM - Superfang', category: 'tm', description: 'A technical machine that teaches Superfang to a compatible Pokémon.' },
	'tm-superpower': { id: 'tm-superpower', name: 'TM - Superpower', category: 'tm', description: 'A technical machine that teaches Superpower to a compatible Pokémon.' },
	'tm-surf': { id: 'tm-surf', name: 'TM - Surf', category: 'tm', description: 'A technical machine that teaches Surf to a compatible Pokémon.' },
	'tm-swagger': { id: 'tm-swagger', name: 'TM - Swagger', category: 'tm', description: 'A technical machine that teaches Swagger to a compatible Pokémon.' },
	'tm-sweetscent': { id: 'tm-sweetscent', name: 'TM - Sweetscent', category: 'tm', description: 'A technical machine that teaches Sweetscent to a compatible Pokémon.' },
	'tm-swift': { id: 'tm-swift', name: 'TM - Swift', category: 'tm', description: 'A technical machine that teaches Swift to a compatible Pokémon.' },
	'tm-swordsdance': { id: 'tm-swordsdance', name: 'TM - Swordsdance', category: 'tm', description: 'A technical machine that teaches Swordsdance to a compatible Pokémon.' },
	'tm-tailslap': { id: 'tm-tailslap', name: 'TM - Tailslap', category: 'tm', description: 'A technical machine that teaches Tailslap to a compatible Pokémon.' },
	'tm-tailwind': { id: 'tm-tailwind', name: 'TM - Tailwind', category: 'tm', description: 'A technical machine that teaches Tailwind to a compatible Pokémon.' },
	'tm-takedown': { id: 'tm-takedown', name: 'TM - Takedown', category: 'tm', description: 'A technical machine that teaches Takedown to a compatible Pokémon.' },
	'tm-taunt': { id: 'tm-taunt', name: 'TM - Taunt', category: 'tm', description: 'A technical machine that teaches Taunt to a compatible Pokémon.' },
	'tm-telekinesis': { id: 'tm-telekinesis', name: 'TM - Telekinesis', category: 'tm', description: 'A technical machine that teaches Telekinesis to a compatible Pokémon.' },
	'tm-teleport': { id: 'tm-teleport', name: 'TM - Teleport', category: 'tm', description: 'A technical machine that teaches Teleport to a compatible Pokémon.' },
	'tm-temperflare': { id: 'tm-temperflare', name: 'TM - Temperflare', category: 'tm', description: 'A technical machine that teaches Temperflare to a compatible Pokémon.' },
	'tm-terablast': { id: 'tm-terablast', name: 'TM - Terablast', category: 'tm', description: 'A technical machine that teaches Terablast to a compatible Pokémon.' },
	'tm-thief': { id: 'tm-thief', name: 'TM - Thief', category: 'tm', description: 'A technical machine that teaches Thief to a compatible Pokémon.' },
	'tm-throatchop': { id: 'tm-throatchop', name: 'TM - Throatchop', category: 'tm', description: 'A technical machine that teaches Throatchop to a compatible Pokémon.' },
	'tm-thunder': { id: 'tm-thunder', name: 'TM - Thunder', category: 'tm', description: 'A technical machine that teaches Thunder to a compatible Pokémon.' },
	'tm-thunderbolt': { id: 'tm-thunderbolt', name: 'TM - Thunderbolt', category: 'tm', description: 'A technical machine that teaches Thunderbolt to a compatible Pokémon.' },
	'tm-thunderfang': { id: 'tm-thunderfang', name: 'TM - Thunderfang', category: 'tm', description: 'A technical machine that teaches Thunderfang to a compatible Pokémon.' },
	'tm-thunderpunch': { id: 'tm-thunderpunch', name: 'TM - Thunderpunch', category: 'tm', description: 'A technical machine that teaches Thunderpunch to a compatible Pokémon.' },
	'tm-thunderwave': { id: 'tm-thunderwave', name: 'TM - Thunderwave', category: 'tm', description: 'A technical machine that teaches Thunderwave to a compatible Pokémon.' },
	'tm-torment': { id: 'tm-torment', name: 'TM - Torment', category: 'tm', description: 'A technical machine that teaches Torment to a compatible Pokémon.' },
	'tm-toxic': { id: 'tm-toxic', name: 'TM - Toxic', category: 'tm', description: 'A technical machine that teaches Toxic to a compatible Pokémon.' },
	'tm-toxicspikes': { id: 'tm-toxicspikes', name: 'TM - Toxicspikes', category: 'tm', description: 'A technical machine that teaches Toxicspikes to a compatible Pokémon.' },
	'tm-trailblaze': { id: 'tm-trailblaze', name: 'TM - Trailblaze', category: 'tm', description: 'A technical machine that teaches Trailblaze to a compatible Pokémon.' },
	'tm-triattack': { id: 'tm-triattack', name: 'TM - Triattack', category: 'tm', description: 'A technical machine that teaches Triattack to a compatible Pokémon.' },
	'tm-trick': { id: 'tm-trick', name: 'TM - Trick', category: 'tm', description: 'A technical machine that teaches Trick to a compatible Pokémon.' },
	'tm-trickroom': { id: 'tm-trickroom', name: 'TM - Trickroom', category: 'tm', description: 'A technical machine that teaches Trickroom to a compatible Pokémon.' },
	'tm-tripleaxel': { id: 'tm-tripleaxel', name: 'TM - Tripleaxel', category: 'tm', description: 'A technical machine that teaches Tripleaxel to a compatible Pokémon.' },
	'tm-upperhand': { id: 'tm-upperhand', name: 'TM - Upperhand', category: 'tm', description: 'A technical machine that teaches Upperhand to a compatible Pokémon.' },
	'tm-uproar': { id: 'tm-uproar', name: 'TM - Uproar', category: 'tm', description: 'A technical machine that teaches Uproar to a compatible Pokémon.' },
	'tm-uturn': { id: 'tm-uturn', name: 'TM - U-turn', category: 'tm', description: 'A technical machine that teaches U-turn to a compatible Pokémon.' },
	'tm-vacuumwave': { id: 'tm-vacuumwave', name: 'TM - Vacuumwave', category: 'tm', description: 'A technical machine that teaches Vacuumwave to a compatible Pokémon.' },
	'tm-venomdrench': { id: 'tm-venomdrench', name: 'TM - Venomdrench', category: 'tm', description: 'A technical machine that teaches Venomdrench to a compatible Pokémon.' },
	'tm-venoshock': { id: 'tm-venoshock', name: 'TM - Venoshock', category: 'tm', description: 'A technical machine that teaches Venoshock to a compatible Pokémon.' },
	'tm-voltswitch': { id: 'tm-voltswitch', name: 'TM - Voltswitch', category: 'tm', description: 'A technical machine that teaches Voltswitch to a compatible Pokémon.' },
	'tm-waterfall': { id: 'tm-waterfall', name: 'TM - Waterfall', category: 'tm', description: 'A technical machine that teaches Waterfall to a compatible Pokémon.' },
	'tm-watergun': { id: 'tm-watergun', name: 'TM - Watergun', category: 'tm', description: 'A technical machine that teaches Watergun to a compatible Pokémon.' },
	'tm-waterpledge': { id: 'tm-waterpledge', name: 'TM - Waterpledge', category: 'tm', description: 'A technical machine that teaches Waterpledge to a compatible Pokémon.' },
	'tm-waterpulse': { id: 'tm-waterpulse', name: 'TM - Waterpulse', category: 'tm', description: 'A technical machine that teaches Waterpulse to a compatible Pokémon.' },
	'tm-weatherball': { id: 'tm-weatherball', name: 'TM - Weatherball', category: 'tm', description: 'A technical machine that teaches Weatherball to a compatible Pokémon.' },
	'tm-whirlpool': { id: 'tm-whirlpool', name: 'TM - Whirlpool', category: 'tm', description: 'A technical machine that teaches Whirlpool to a compatible Pokémon.' },
	'tm-whirlwind': { id: 'tm-whirlwind', name: 'TM - Whirlwind', category: 'tm', description: 'A technical machine that teaches Whirlwind to a compatible Pokémon.' },
	'tm-wildcharge': { id: 'tm-wildcharge', name: 'TM - Wildcharge', category: 'tm', description: 'A technical machine that teaches Wildcharge to a compatible Pokémon.' },
	'tm-willowisp': { id: 'tm-willowisp', name: 'TM - Willowisp', category: 'tm', description: 'A technical machine that teaches Willowisp to a compatible Pokémon.' },
	'tm-wonderroom': { id: 'tm-wonderroom', name: 'TM - Wonderroom', category: 'tm', description: 'A technical machine that teaches Wonderroom to a compatible Pokémon.' },
	'tm-workup': { id: 'tm-workup', name: 'TM - Workup', category: 'tm', description: 'A technical machine that teaches Workup to a compatible Pokémon.' },
	'tm-xscissor': { id: 'tm-xscissor', name: 'TM - X-Scissor', category: 'tm', description: 'A technical machine that teaches X-Scissor to a compatible Pokémon.' },
	'tm-zapcannon': { id: 'tm-zapcannon', name: 'TM - Zapcannon', category: 'tm', description: 'A technical machine that teaches Zapcannon to a compatible Pokémon.' },
	'tm-zenheadbutt': { id: 'tm-zenheadbutt', name: 'TM - Zenheadbutt', category: 'tm', description: 'A technical machine that teaches Zenheadbutt to a compatible Pokémon.' },
};

export const ITEM_PRICES: Record<string, number> = {
	'pokeball': 200, 'greatball': 600, 'ultraball': 800, 'potion': 300, 'superpotion': 700, 'hyperpotion': 1200, 'maxpotion': 2500, 'fullrestore': 3000, 'eggmovetutor': 3000, 'rarecandy': 4800,
	'expcandyxs': 20, 'expcandys': 100, 'expcandym': 500, 'expcandyl': 3000, 'expcandyxl': 10000,
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
	'heatrock': 4000, 'damprock': 4000, 'smoothrock': 4000, 'icyrock': 4000,
	'boosterenergy': 8000,
	'masterball': 100000,
	'freshwater': 250, 'sodapop': 350, 'lemonade': 450, 'moomoomilk': 600, 'tea': 750,
	'energyroot': 1200, 'energypowder': 500, 'healpowder': 450,
	'revive': 2000, 'maxrevive': 4000, 'revivalherb': 2800, 'sacredash': 20000,
	'expertbelt': 4000, 'weaknesspolicy': 5000,
	'lumberry': 2000, 'mentalherb': 3000, 'redcard': 3000, 'quickclaw': 4000,
	'mirrorherb': 6000, 'clearamulet': 5000, 'covertcloak': 4500,
	'kingsrock': 3500, 'scopelens': 4000, 'razorclaw': 4000,
	'lightclay': 4000, 'everstone': 2000,
	'terashard': 5000,

	// Status Healers
	'antidote': 100, 'paralyzeheal': 200, 'awakening': 250, 'burnheal': 250, 'iceheal': 250, 'fullheal': 600,
	// PP Restore
	'ether': 1200, 'maxether': 2000, 'elixir': 3000, 'maxelixir': 4500,
	// Evo Stones
	'firestone': 3000, 'waterstone': 3000, 'thunderstone': 3000, 'leafstone': 3000,
	'moonstone': 5000, 'sunstone': 3000, 'shinystone': 5000, 'duskstone': 5000, 'dawnstone': 5000, 'icestone': 3000,
	// Evolution Items
	'dragonscale': 4000, 'metalcoat': 4000, 'upgrade': 4000, 'dubiousdisc': 4000,
	'protector': 4000, 'electirizer': 4000, 'magmarizer': 4000, 'reapercloth': 4000,
	'ovalstone': 3000, 'sachet': 4000, 'whippeddream': 4000, 'blackaugurite': 5000,
	'metalalloy': 5000, 'magnet': 3000, 'chipseal': 3500, 'masterpiece': 5000,
	// Apple Items
	'tartapple': 3500, 'sweetapple': 3500, 'syruppyapple': 4000, 'dragonchesto': 5000,
	// Trade Evolution Items
	'tradehelmet': 4500, 'tradekarrablast': 4500,
	// Legendary Items
	'towerscrolls': 10000, 'waterscroll': 10000,
	// Vitamins
	'hpup': 9800, 'protein': 9800, 'iron': 9800, 'calcium': 9800, 'zinc': 9800, 'carbos': 9800,
	// Valuable Items (Sell Price)
	'nugget': 5000, 'bignugget': 10000, 'pearl': 700, 'bigpearl': 3750, 'starpiece': 6000,
	// TM Prices
	'tm-acidspray': 3000, 'tm-acrobatics': 3000, 'tm-aerialace': 3000, 'tm-agility': 3000, 'tm-aircutter': 3000, 'tm-airslash': 3000, 'tm-alluringvoice': 3000, 'tm-allyswitch': 3000, 'tm-amnesia': 3000, 'tm-assurance': 3000, 'tm-attract': 3000, 'tm-aurasphere': 3000, 'tm-auroraveil': 3000, 'tm-avalanche': 3000, 'tm-batonpass': 3000, 'tm-beatup': 3000, 'tm-bide': 3000, 'tm-blastburn': 3000, 'tm-blazekick': 3000, 'tm-blizzard': 3000, 'tm-bodypress': 3000, 'tm-bodyslam': 3000, 'tm-bounce': 3000, 'tm-bravebird': 3000, 'tm-breakingswipe': 3000, 'tm-brickbreak': 3000, 'tm-brine': 3000, 'tm-brutalswing': 3000, 'tm-bubblebeam': 3000, 'tm-bugbite': 3000, 'tm-bugbuzz': 3000, 'tm-bulkup': 3000, 'tm-bulldoze': 3000, 'tm-bulletseed': 3000, 'tm-burningjealousy': 3000, 'tm-calmmind': 3000, 'tm-captivate': 3000, 'tm-charge': 3000, 'tm-chargebeam': 3000, 'tm-charm': 3000, 'tm-chillingwater': 3000, 'tm-closecombat': 3000, 'tm-coaching': 3000, 'tm-confide': 3000, 'tm-confuseray': 3000, 'tm-cosmicpower': 3000, 'tm-counter': 3000, 'tm-crosspoison': 3000, 'tm-crunch': 3000, 'tm-curse': 3000, 'tm-cut': 3000, 'tm-darkestlariat': 3000, 'tm-darkpulse': 3000, 'tm-dazzlinggleam': 3000, 'tm-defensecurl': 3000, 'tm-defog': 3000, 'tm-detect': 3000, 'tm-dig': 3000, 'tm-disarmingvoice': 3000, 'tm-dive': 3000, 'tm-doubleedge': 3000, 'tm-doubleteam': 3000, 'tm-dracometeor': 3000, 'tm-dragonbreath': 3000, 'tm-dragoncheer': 3000, 'tm-dragonclaw': 3000, 'tm-dragondance': 3000, 'tm-dragonpulse': 3000, 'tm-dragonrage': 3000, 'tm-dragontail': 3000, 'tm-drainingkiss': 3000, 'tm-drainpunch': 3000, 'tm-dreameater': 3000, 'tm-drillrun': 3000, 'tm-dualwingbeat': 3000, 'tm-dynamicpunch': 3000, 'tm-earthpower': 3000, 'tm-earthquake': 3000, 'tm-echoedvoice': 3000, 'tm-eerieimpulse': 3000, 'tm-eggbomb': 3000, 'tm-electricterrain': 3000, 'tm-electroball': 3000, 'tm-electroweb': 3000, 'tm-embargo': 3000, 'tm-encore': 3000, 'tm-endeavor': 3000, 'tm-endure': 3000, 'tm-energyball': 3000, 'tm-expandingforce': 3000, 'tm-explosion': 3000, 'tm-facade': 3000, 'tm-faketears': 3000, 'tm-falseswipe': 3000, 'tm-featherdance': 3000, 'tm-fireblast': 3000, 'tm-firefang': 3000, 'tm-firepledge': 3000, 'tm-firepunch': 3000, 'tm-firespin': 3000, 'tm-fissure': 3000, 'tm-flamecharge': 3000, 'tm-flamethrower': 3000, 'tm-flareblitz': 3000, 'tm-flash': 3000, 'tm-flashcannon': 3000, 'tm-fling': 3000, 'tm-flipturn': 3000, 'tm-fly': 3000, 'tm-focusblast': 3000, 'tm-focusenergy': 3000, 'tm-focuspunch': 3000, 'tm-followme': 3000, 'tm-foulplay': 3000, 'tm-frenzyplant': 3000, 'tm-frostbreath': 3000, 'tm-frustration': 3000, 'tm-furycutter': 3000, 'tm-futuresight': 3000, 'tm-gigadrain': 3000, 'tm-gigaimpact': 3000, 'tm-grassknot': 3000, 'tm-grasspledge': 3000, 'tm-grassyglide': 3000, 'tm-grassyterrain': 3000, 'tm-gravity': 3000, 'tm-guardswap': 3000, 'tm-gunkshot': 3000, 'tm-gyroball': 3000, 'tm-hail': 3000, 'tm-hardpress': 3000, 'tm-haze': 3000, 'tm-headbutt': 3000, 'tm-heatcrash': 3000, 'tm-heatwave': 3000, 'tm-heavyslam': 3000, 'tm-helpinghand': 3000, 'tm-hex': 3000, 'tm-hiddenpower': 3000, 'tm-highhorsepower': 3000, 'tm-honeclaws': 3000, 'tm-horndrill': 3000, 'tm-hurricane': 3000, 'tm-hydrocannon': 3000, 'tm-hydropump': 3000, 'tm-hyperbeam': 3000, 'tm-hypervoice': 3000, 'tm-icebeam': 3000, 'tm-icefang': 3000, 'tm-icepunch': 3000, 'tm-icespinner': 3000, 'tm-iciclespear': 3000, 'tm-icywind': 3000, 'tm-imprison': 3000, 'tm-incinerate': 3000, 'tm-infestation': 3000, 'tm-irondefense': 3000, 'tm-ironhead': 3000, 'tm-irontail': 3000, 'tm-knockoff': 3000, 'tm-lashout': 3000, 'tm-leafblade': 3000, 'tm-leafstorm': 3000, 'tm-leechlife': 3000, 'tm-lightscreen': 3000, 'tm-liquidation': 3000, 'tm-lowkick': 3000, 'tm-lowsweep': 3000, 'tm-lunge': 3000, 'tm-magicalleaf': 3000, 'tm-magicroom': 3000, 'tm-megadrain': 3000, 'tm-megahorn': 3000, 'tm-megakick': 3000, 'tm-megapunch': 3000, 'tm-metalclaw': 3000, 'tm-metalsound': 3000, 'tm-meteorbeam': 3000, 'tm-metronome': 3000, 'tm-mimic': 3000, 'tm-mistyexplosion': 3000, 'tm-mistyterrain': 3000, 'tm-muddywater': 3000, 'tm-mudshot': 3000, 'tm-mudslap': 3000, 'tm-mysticalfire': 3000, 'tm-nastyplot': 3000, 'tm-naturalgift': 3000, 'tm-naturepower': 3000, 'tm-nightmare': 3000, 'tm-nightshade': 3000, 'tm-outrage': 3000, 'tm-overheat': 3000, 'tm-painsplit': 3000, 'tm-payback': 3000, 'tm-payday': 3000, 'tm-petalblizzard': 3000, 'tm-phantomforce': 3000, 'tm-pinmissile': 3000, 'tm-playrough': 3000, 'tm-pluck': 3000, 'tm-poisonjab': 3000, 'tm-poisontail': 3000, 'tm-pollenpuff': 3000, 'tm-poltergeist': 3000, 'tm-pounce': 3000, 'tm-powergem': 3000, 'tm-powerswap': 3000, 'tm-poweruppunch': 3000, 'tm-powerwhip': 3000, 'tm-protect': 3000, 'tm-psybeam': 3000, 'tm-psychic': 3000, 'tm-psychicfangs': 3000, 'tm-psychicnoise': 3000, 'tm-psychicterrain': 3000, 'tm-psychocut': 3000, 'tm-psychup': 3000, 'tm-psyshock': 3000, 'tm-psywave': 3000, 'tm-quash': 3000, 'tm-rage': 3000, 'tm-raindance': 3000, 'tm-razorshell': 3000, 'tm-razorwind': 3000, 'tm-recycle': 3000, 'tm-reflect': 3000, 'tm-rest': 3000, 'tm-retaliate': 3000, 'tm-return': 3000, 'tm-revenge': 3000, 'tm-reversal': 3000, 'tm-roar': 3000, 'tm-rockblast': 3000, 'tm-rockclimb': 3000, 'tm-rockpolish': 3000, 'tm-rockslide': 3000, 'tm-rocksmash': 3000, 'tm-rocktomb': 3000, 'tm-rollout': 3000, 'tm-roost': 3000, 'tm-round': 3000, 'tm-safeguard': 3000, 'tm-sandstorm': 3000, 'tm-sandtomb': 3000, 'tm-scald': 3000, 'tm-scaleshot': 3000, 'tm-scaryface': 3000, 'tm-scorchingsands': 3000, 'tm-screech': 3000, 'tm-secretpower': 3000, 'tm-seedbomb': 3000, 'tm-seismictoss': 3000, 'tm-selfdestruct': 3000, 'tm-shadowball': 3000, 'tm-shadowclaw': 3000, 'tm-shockwave': 3000, 'tm-silverwind': 3000, 'tm-skillswap': 3000, 'tm-skittersmack': 3000, 'tm-skullbash': 3000, 'tm-skyattack': 3000, 'tm-skydrop': 3000, 'tm-sleeptalk': 3000, 'tm-sludgebomb': 3000, 'tm-sludgewave': 3000, 'tm-smackdown': 3000, 'tm-smartstrike': 3000, 'tm-snarl': 3000, 'tm-snatch': 3000, 'tm-snore': 3000, 'tm-snowscape': 3000, 'tm-softboiled': 3000, 'tm-solarbeam': 3000, 'tm-solarblade': 3000, 'tm-speedswap': 3000, 'tm-spikes': 3000, 'tm-spite': 3000, 'tm-stealthrock': 3000, 'tm-steelbeam': 3000, 'tm-steelwing': 3000, 'tm-stompingtantrum': 3000, 'tm-stoneedge': 3000, 'tm-storedpower': 3000, 'tm-strength': 3000, 'tm-strugglebug': 3000, 'tm-submission': 3000, 'tm-substitute': 3000, 'tm-sunnyday': 3000, 'tm-supercellslam': 3000, 'tm-superfang': 3000, 'tm-superpower': 3000, 'tm-surf': 3000, 'tm-swagger': 3000, 'tm-sweetscent': 3000, 'tm-swift': 3000, 'tm-swordsdance': 3000, 'tm-tailslap': 3000, 'tm-tailwind': 3000, 'tm-takedown': 3000, 'tm-taunt': 3000, 'tm-telekinesis': 3000, 'tm-teleport': 3000, 'tm-temperflare': 3000, 'tm-terablast': 3000, 'tm-thief': 3000, 'tm-throatchop': 3000, 'tm-thunder': 3000, 'tm-thunderbolt': 3000, 'tm-thunderfang': 3000, 'tm-thunderpunch': 3000, 'tm-thunderwave': 3000, 'tm-torment': 3000, 'tm-toxic': 3000, 'tm-toxicspikes': 3000, 'tm-trailblaze': 3000, 'tm-triattack': 3000, 'tm-trick': 3000, 'tm-trickroom': 3000, 'tm-tripleaxel': 3000, 'tm-upperhand': 3000, 'tm-uproar': 3000, 'tm-uturn': 3000, 'tm-vacuumwave': 3000, 'tm-venomdrench': 3000, 'tm-venoshock': 3000, 'tm-voltswitch': 3000, 'tm-waterfall': 3000, 'tm-watergun': 3000, 'tm-waterpledge': 3000, 'tm-waterpulse': 3000, 'tm-weatherball': 3000, 'tm-whirlpool': 3000, 'tm-whirlwind': 3000, 'tm-wildcharge': 3000, 'tm-willowisp': 3000, 'tm-wonderroom': 3000, 'tm-workup': 3000, 'tm-xscissor': 3000, 'tm-zapcannon': 3000, 'tm-zenheadbutt': 3000,
};

export const SHOP_INVENTORY: string[] = [
	'pokeball', 'greatball', 'ultraball', 'masterball', 'levelball', 'fastball', 'timerball', 'nestball', 'netball',
	'quickball', 'dreamball', 'premierball', 'luxuryball', 'healball', 'masterball',

	'potion', 'superpotion', 'hyperpotion', 'maxpotion', 'berryjuice', 'fullrestore',
	'freshwater', 'sodapop', 'lemonade', 'moomoomilk', 'tea', 'energyroot', 'energypowder', 'healpowder',
	'revive', 'maxrevive', 'revivalherb', 'sacredash',
	// Status Healers
	'antidote', 'paralyzeheal', 'awakening', 'burnheal', 'iceheal', 'fullheal',
	// PP Restore
	'ether', 'maxether', 'elixir', 'maxelixir',
	// Vitamins
	'hpup', 'protein', 'iron', 'calcium', 'zinc', 'carbos',

	'oranberry', 'sitrusberry', 'goldberry', 'aguavberry', 'figyberry', 'iapapaberry', 'magoberry', 'wikiberry',
	'enigmaberry', 'jabocaberry', 'rowapberry', 'liechiberry', 'ganlonberry', 'salacberry', 'petayaberry',
	'apicotberry', 'starfberry', 'keberry', 'marangaberry', 'babiriberry', 'chartiberry', 'chilanberry',
	'chopleberry', 'cobaberry', 'colburberry', 'habanberry', 'kasibberry', 'kebiaberry', 'occaberry',
	'passhoberry', 'payapaberry', 'rindoberry', 'roseliberry', 'shucaberry', 'tangaberry', 'wacanberry', 'yacheberry',
	'lumberry',

	'leftovers', 'blacksludge', 'shellbell', 'lifeorb', 'rockyhelmet', 'stickybarb',
	'choiceband', 'choicescarf', 'choicespecs', 'flameorb', 'toxicorb',
	'heavydutyboots', 'focussash', 'assaultvest', 'eviolite', 'airballoon',
	'heatrock', 'damprock', 'smoothrock', 'icyrock', 'boosterenergy',
	'expertbelt', 'weaknesspolicy', 'mentalherb', 'redcard',
	'quickclaw', 'mirrorherb', 'clearamulet', 'covertcloak', 'kingsrock', 'scopelens', 'razorclaw',
	'lightclay', 'everstone',

	'eggmovetutor',
	'rarecandy',
	'expcandyxs', 'expcandys', 'expcandym', 'expcandyl', 'expcandyxl',
	'terashard',
	// Evo Stones
	'firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'sunstone', 'shinystone', 'duskstone', 'dawnstone', 'icestone',
	// Evolution Items
	'dragonscale', 'metalcoat', 'upgrade', 'dubiousdisc', 'protector', 'electirizer', 'magmarizer', 'reapercloth',
	'ovalstone', 'sachet', 'whippeddream', 'blackaugurite', 'metalalloy', 'magnet', 'chipseal', 'masterpiece',
	// Apple Items
	'tartapple', 'sweetapple', 'syruppyapple', 'dragonchesto',
	// Trade Evolution Items
	'tradehelmet', 'tradekarrablast',
	// Legendary Items
	'towerscrolls', 'waterscroll',
	// TMs
	'tm-acidspray',
	'tm-acrobatics',
	'tm-aerialace',
	'tm-agility',
	'tm-aircutter',
	'tm-airslash',
	'tm-alluringvoice',
	'tm-allyswitch',
	'tm-amnesia',
	'tm-assurance',
	'tm-attract',
	'tm-aurasphere',
	'tm-auroraveil',
	'tm-avalanche',
	'tm-batonpass',
	'tm-beatup',
	'tm-bide',
	'tm-blastburn',
	'tm-blazekick',
	'tm-blizzard',
	'tm-bodypress',
	'tm-bodyslam',
	'tm-bounce',
	'tm-bravebird',
	'tm-breakingswipe',
	'tm-brickbreak',
	'tm-brine',
	'tm-brutalswing',
	'tm-bubblebeam',
	'tm-bugbite',
	'tm-bugbuzz',
	'tm-bulkup',
	'tm-bulldoze',
	'tm-bulletseed',
	'tm-burningjealousy',
	'tm-calmmind',
	'tm-captivate',
	'tm-charge',
	'tm-chargebeam',
	'tm-charm',
	'tm-chillingwater',
	'tm-closecombat',
	'tm-coaching',
	'tm-confide',
	'tm-confuseray',
	'tm-cosmicpower',
	'tm-counter',
	'tm-crosspoison',
	'tm-crunch',
	'tm-curse',
	'tm-cut',
	'tm-darkestlariat',
	'tm-darkpulse',
	'tm-dazzlinggleam',
	'tm-defensecurl',
	'tm-defog',
	'tm-detect',
	'tm-dig',
	'tm-disarmingvoice',
	'tm-dive',
	'tm-doubleedge',
	'tm-doubleteam',
	'tm-dracometeor',
	'tm-dragonbreath',
	'tm-dragoncheer',
	'tm-dragonclaw',
	'tm-dragondance',
	'tm-dragonpulse',
	'tm-dragonrage',
	'tm-dragontail',
	'tm-drainingkiss',
	'tm-drainpunch',
	'tm-dreameater',
	'tm-drillrun',
	'tm-dualwingbeat',
	'tm-dynamicpunch',
	'tm-earthpower',
	'tm-earthquake',
	'tm-echoedvoice',
	'tm-eerieimpulse',
	'tm-eggbomb',
	'tm-electricterrain',
	'tm-electroball',
	'tm-electroweb',
	'tm-embargo',
	'tm-encore',
	'tm-endeavor',
	'tm-endure',
	'tm-energyball',
	'tm-expandingforce',
	'tm-explosion',
	'tm-facade',
	'tm-faketears',
	'tm-falseswipe',
	'tm-featherdance',
	'tm-fireblast',
	'tm-firefang',
	'tm-firepledge',
	'tm-firepunch',
	'tm-firespin',
	'tm-fissure',
	'tm-flamecharge',
	'tm-flamethrower',
	'tm-flareblitz',
	'tm-flash',
	'tm-flashcannon',
	'tm-fling',
	'tm-flipturn',
	'tm-fly',
	'tm-focusblast',
	'tm-focusenergy',
	'tm-focuspunch',
	'tm-followme',
	'tm-foulplay',
	'tm-frenzyplant',
	'tm-frostbreath',
	'tm-frustration',
	'tm-furycutter',
	'tm-futuresight',
	'tm-gigadrain',
	'tm-gigaimpact',
	'tm-grassknot',
	'tm-grasspledge',
	'tm-grassyglide',
	'tm-grassyterrain',
	'tm-gravity',
	'tm-guardswap',
	'tm-gunkshot',
	'tm-gyroball',
	'tm-hail',
	'tm-hardpress',
	'tm-haze',
	'tm-headbutt',
	'tm-heatcrash',
	'tm-heatwave',
	'tm-heavyslam',
	'tm-helpinghand',
	'tm-hex',
	'tm-hiddenpower',
	'tm-highhorsepower',
	'tm-honeclaws',
	'tm-horndrill',
	'tm-hurricane',
	'tm-hydrocannon',
	'tm-hydropump',
	'tm-hyperbeam',
	'tm-hypervoice',
	'tm-icebeam',
	'tm-icefang',
	'tm-icepunch',
	'tm-icespinner',
	'tm-iciclespear',
	'tm-icywind',
	'tm-imprison',
	'tm-incinerate',
	'tm-infestation',
	'tm-irondefense',
	'tm-ironhead',
	'tm-irontail',
	'tm-knockoff',
	'tm-lashout',
	'tm-leafblade',
	'tm-leafstorm',
	'tm-leechlife',
	'tm-lightscreen',
	'tm-liquidation',
	'tm-lowkick',
	'tm-lowsweep',
	'tm-lunge',
	'tm-magicalleaf',
	'tm-magicroom',
	'tm-megadrain',
	'tm-megahorn',
	'tm-megakick',
	'tm-megapunch',
	'tm-metalclaw',
	'tm-metalsound',
	'tm-meteorbeam',
	'tm-metronome',
	'tm-mimic',
	'tm-mistyexplosion',
	'tm-mistyterrain',
	'tm-muddywater',
	'tm-mudshot',
	'tm-mudslap',
	'tm-mysticalfire',
	'tm-nastyplot',
	'tm-naturalgift',
	'tm-naturepower',
	'tm-nightmare',
	'tm-nightshade',
	'tm-outrage',
	'tm-overheat',
	'tm-painsplit',
	'tm-payback',
	'tm-payday',
	'tm-petalblizzard',
	'tm-phantomforce',
	'tm-pinmissile',
	'tm-playrough',
	'tm-pluck',
	'tm-poisonjab',
	'tm-poisontail',
	'tm-pollenpuff',
	'tm-poltergeist',
	'tm-pounce',
	'tm-powergem',
	'tm-powerswap',
	'tm-poweruppunch',
	'tm-powerwhip',
	'tm-protect',
	'tm-psybeam',
	'tm-psychic',
	'tm-psychicfangs',
	'tm-psychicnoise',
	'tm-psychicterrain',
	'tm-psychocut',
	'tm-psychup',
	'tm-psyshock',
	'tm-psywave',
	'tm-quash',
	'tm-rage',
	'tm-raindance',
	'tm-razorshell',
	'tm-razorwind',
	'tm-recycle',
	'tm-reflect',
	'tm-rest',
	'tm-retaliate',
	'tm-return',
	'tm-revenge',
	'tm-reversal',
	'tm-roar',
	'tm-rockblast',
	'tm-rockclimb',
	'tm-rockpolish',
	'tm-rockslide',
	'tm-rocksmash',
	'tm-rocktomb',
	'tm-rollout',
	'tm-roost',
	'tm-round',
	'tm-safeguard',
	'tm-sandstorm',
	'tm-sandtomb',
	'tm-scald',
	'tm-scaleshot',
	'tm-scaryface',
	'tm-scorchingsands',
	'tm-screech',
	'tm-secretpower',
	'tm-seedbomb',
	'tm-seismictoss',
	'tm-selfdestruct',
	'tm-shadowball',
	'tm-shadowclaw',
	'tm-shockwave',
	'tm-silverwind',
	'tm-skillswap',
	'tm-skittersmack',
	'tm-skullbash',
	'tm-skyattack',
	'tm-skydrop',
	'tm-sleeptalk',
	'tm-sludgebomb',
	'tm-sludgewave',
	'tm-smackdown',
	'tm-smartstrike',
	'tm-snarl',
	'tm-snatch',
	'tm-snore',
	'tm-snowscape',
	'tm-softboiled',
	'tm-solarbeam',
	'tm-solarblade',
	'tm-speedswap',
	'tm-spikes',
	'tm-spite',
	'tm-stealthrock',
	'tm-steelbeam',
	'tm-steelwing',
	'tm-stompingtantrum',
	'tm-stoneedge',
	'tm-storedpower',
	'tm-strength',
	'tm-strugglebug',
	'tm-submission',
	'tm-substitute',
	'tm-sunnyday',
	'tm-supercellslam',
	'tm-superfang',
	'tm-superpower',
	'tm-surf',
	'tm-swagger',
	'tm-sweetscent',
	'tm-swift',
	'tm-swordsdance',
	'tm-tailslap',
	'tm-tailwind',
	'tm-takedown',
	'tm-taunt',
	'tm-telekinesis',
	'tm-teleport',
	'tm-temperflare',
	'tm-terablast',
	'tm-thief',
	'tm-throatchop',
	'tm-thunder',
	'tm-thunderbolt',
	'tm-thunderfang',
	'tm-thunderpunch',
	'tm-thunderwave',
	'tm-torment',
	'tm-toxic',
	'tm-toxicspikes',
	'tm-trailblaze',
	'tm-triattack',
	'tm-trick',
	'tm-trickroom',
	'tm-tripleaxel',
	'tm-upperhand',
	'tm-uproar',
	'tm-uturn',
	'tm-vacuumwave',
	'tm-venomdrench',
	'tm-venoshock',
	'tm-voltswitch',
	'tm-waterfall',
	'tm-watergun',
	'tm-waterpledge',
	'tm-waterpulse',
	'tm-weatherball',
	'tm-whirlpool',
	'tm-whirlwind',
	'tm-wildcharge',
	'tm-willowisp',
	'tm-wonderroom',
	'tm-workup',
	'tm-xscissor',
	'tm-zapcannon',
	'tm-zenheadbutt',
];

export function getItemData(itemId: string): Omit<InventoryItem, 'quantity'> | null {
	if (CUSTOM_ITEMS_DATABASE[itemId]) {
		return CUSTOM_ITEMS_DATABASE[itemId];
	}

	const dexItem = Dex.items.get(itemId);
	if (dexItem.exists) {
		let category: InventoryItem['category'] = 'held';
		if (dexItem.isPokeball) {
			category = 'pokeball';
		} else if (dexItem.isBerry) {
			category = 'berry';
		}

		const description = dexItem.shortDesc || dexItem.desc || 'An item.';

		return {
			id: itemId,
			name: dexItem.name,
			category,
			description,
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
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return false;
	if (player.inventory.has(itemId)) {
		player.inventory.get(itemId)!.quantity += quantity;
	} else {
		player.inventory.set(itemId, { ...itemData, quantity });
	}
	return true;
}

export function removeItemFromInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	if (!player.inventory.has(itemId)) return false;
	const item = player.inventory.get(itemId)!;
	if (item.quantity < quantity) return false;
	item.quantity -= quantity;
	if (item.quantity === 0) {
		player.inventory.delete(itemId);
	}
	return true;
}

function getExpCandyAmount(itemId: string): number {
	switch (itemId) {
	case 'expcandyxs': return 100;
	case 'expcandys': return 800;
	case 'expcandym': return 3000;
	case 'expcandyl': return 10000;
	case 'expcandyxl': return 30000;
	default: return 0;
	}
}

export function useHealingItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || (itemData.category !== 'medicine' && itemId !== 'berryjuice')) {
		return { success: false, message: `This item cannot be used to heal.` };
	}

	if (itemId === 'healpowder') {
		if (!pokemon.status) {
			return { success: false, message: `${pokemon.species} is not affected by any status condition.` };
		}
		pokemon.status = null;
		removeItemFromInventory(player, itemId, 1);
		return { success: true, message: `You used <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its status condition was healed.` };
	}

	if (pokemon.hp >= pokemon.maxHp) {
		return { success: false, message: `${pokemon.species} is already at full health!` };
	}

	let healAmount = 0;
	switch (itemId) {
	case 'potion':
		healAmount = 20;
		break;
	case 'superpotion':
		healAmount = 60;
		break;
	case 'hyperpotion':
		healAmount = 120;
		break;
	case 'maxpotion':
	case 'fullrestore':
		healAmount = pokemon.maxHp;
		break;
	case 'berryjuice':
		healAmount = 20;
		break;
	case 'freshwater':
		healAmount = 50;
		break;
	case 'sodapop':
		healAmount = 60;
		break;
	case 'lemonade':
		healAmount = 80;
		break;
	case 'moomoomilk':
		healAmount = 100;
		break;
	case 'tea':
		healAmount = 120;
		break;
	case 'energyroot':
		healAmount = 200;
		break;
	case 'energypowder':
		healAmount = 50;
		break;
	default:
		return { success: false, message: `The healing effect for ${itemData.name} is not defined.` };
	}

	const previousHp = pokemon.hp;
	pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
	const hpRestored = pokemon.hp - previousHp;

	let message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It recovered ${hpRestored} HP!`;

	if (itemId === 'fullrestore' && pokemon.status) {
		pokemon.status = null;
		message += `<br>${pokemon.species}'s status condition was healed.`;
	}

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message };
}

export function useRevivalItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	// Revival items can only be used on fainted Pokemon
	if (pokemon.hp > 0) {
		return { success: false, message: `${pokemon.species} has not fainted!` };
	}

	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData || itemData.category !== 'medicine') {
		return { success: false, message: `This item cannot be used to revive.` };
	}

	let hpRestored = 0;
	let friendshipChange = 0;
	let message = '';

	switch (itemId) {
	case 'revive':
		// Revive restores 50% of max HP (minimum 1 HP)
		hpRestored = Math.max(1, Math.floor(pokemon.maxHp / 2));
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with ${hpRestored} HP!`;
		break;
	case 'maxrevive':
		// Max Revive restores full HP
		hpRestored = pokemon.maxHp;
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with full HP!`;
		break;
	case 'revivalherb':
		// Revival Herb restores full HP but lowers friendship by 10-15 points (using 10)
		hpRestored = pokemon.maxHp;
		friendshipChange = -10;
		message = `You used a <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! It was revived with full HP!`;
		break;
	default:
		return { success: false, message: `The revival effect for ${itemData.name} is not defined.` };
	}

	// Restore HP
	pokemon.hp = hpRestored;

	// Clear status condition (revival removes status)
	pokemon.status = null;

	// Apply friendship change if applicable
	if (friendshipChange !== 0) {
		pokemon.friendship = Math.max(0, Math.min(255, pokemon.friendship + friendshipChange));
		message += `<br>${pokemon.species}'s friendship decreased...`;
	}

	// Restore all move PP to their maximum
	for (const move of pokemon.moves) {
		const moveData = getMove(move.id);
		move.pp = moveData.pp || 5;
	}

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message };
}

export function useSacredAsh(player: PlayerData): { success: boolean, message: string } {
	const itemData = ITEMS_DATABASE['sacredash'];
	if (!itemData) {
		return { success: false, message: `Sacred Ash not found.` };
	}

	// Check if there are any fainted Pokemon
	const faintedPokemon = player.party.filter(p => p.hp <= 0);
	if (faintedPokemon.length === 0) {
		return { success: false, message: `No Pokémon need to be revived!` };
	}

	// Revive all fainted Pokemon
	let revivedCount = 0;
	const revivedNames: string[] = [];
	for (const pokemon of player.party) {
		if (pokemon.hp <= 0) {
			pokemon.hp = pokemon.maxHp;
			pokemon.status = null;
			// Restore all move PP
			for (const move of pokemon.moves) {
				const moveData = getMove(move.id);
				move.pp = moveData.pp || 5;
			}
			revivedCount++;
			revivedNames.push(pokemon.species);
		}
	}

	removeItemFromInventory(player, 'sacredash', 1);
	const message = `You used <strong>${itemData.name}</strong>! All fainted Pokémon were revived with full HP!<br>` +
		`<strong>Revived:</strong> ${revivedNames.join(', ')}`;
	return { success: true, message };
}

export function useRareCandyItem(player: PlayerData, pokemon: RPGPokemon, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	// Validate pokemon exists and has valid data
	if (!pokemon?.species) {
		return { success: false, message: `Invalid Pokémon data!` };
	}

	// Cannot use on fainted Pokémon
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	// Cannot use on level 100 Pokémon
	if (pokemon.level >= 100) {
		return { success: false, message: `${pokemon.species} is already at level 100!` };
	}

	// Validate level is within acceptable range
	if (pokemon.level < 1 || pokemon.level > 99) {
		return { success: false, message: `${pokemon.species} has an invalid level!` };
	}

	// Ensure HP doesn't exceed max HP (data integrity check)
	if (pokemon.hp > pokemon.maxHp) {
		pokemon.hp = pokemon.maxHp;
	}

	// Level up the Pokémon (wrapped in try-catch for safety)
	const messages: string[] = [];
	try {
		messages.push(...levelUp(pokemon));

		// Set experience to the minimum required for the new level (Rare Candy behavior)
		pokemon.experience = calculateTotalExpForLevel(pokemon.growthRate, pokemon.level);

		// Check for evolution
		const evolveMessage = checkEvolution(player, pokemon, { room, user });
		if (evolveMessage) {
			messages.push(evolveMessage);
		} else {
			// Only check for move learning if no evolution occurred
			// (checkEvolution already handles move learning after evolution)
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}

		// Increase friendship (Rare Candy gives +5/+3 friendship in official games)
		// Cap at 255 (max friendship), ensure non-negative
		if (pokemon.friendship < 0) {
			pokemon.friendship = 0;
		}
		if (pokemon.friendship < 255) {
			pokemon.friendship = Math.min(255, pokemon.friendship + 3);
		}
	} catch (error) {
		// If anything fails, don't consume the item
		return { success: false, message: `An error occurred while using Rare Candy. Please try again.` };
	}

	// Only remove item AFTER successful level up (prevents item loss on error)
	removeItemFromInventory(player, 'rarecandy', 1);

	const resultMessage = `You used a <strong>Rare Candy</strong> on <strong>${pokemon.species}</strong>!<br>${messages.join('<br>')}`;
	return { success: true, message: resultMessage };
}

export function useExpCandyItem(player: PlayerData, pokemon: RPGPokemon, itemId: string, room: CheckEvolutionContext['room'], user: CheckEvolutionContext['user']): { success: boolean, message: string } {
	// Validate pokemon exists and has valid data
	if (!pokemon?.species) {
		return { success: false, message: `Invalid Pokémon data!` };
	}

	// Cannot use on fainted Pokémon
	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	// Cannot use on level 100 Pokémon (pointless, can't gain more levels)
	if (pokemon.level >= 100) {
		return { success: false, message: `${pokemon.species} is already at level 100!` };
	}

	// Validate level is within acceptable range
	if (pokemon.level < 1 || pokemon.level > 99) {
		return { success: false, message: `${pokemon.species} has an invalid level!` };
	}

	// Get EXP amount based on candy type
	const expAmount = getExpCandyAmount(itemId);
	if (expAmount === 0) {
		return { success: false, message: `Invalid Exp. Candy type!` };
	}

	// Ensure HP doesn't exceed max HP (data integrity check)
	if (pokemon.hp > pokemon.maxHp) {
		pokemon.hp = pokemon.maxHp;
	}

	// Ensure experience is non-negative (data integrity check)
	if (pokemon.experience < 0) {
		pokemon.experience = 0;
	}

	// Add experience and handle level ups
	const messages: string[] = [];
	try {
		// Add experience
		pokemon.experience += expAmount;
		messages.push(`**${pokemon.species} gained ${expAmount} Experience Points!**`);

		let leveledUp = false;
		let evolved = false;

		// Level up loop (similar to gainExperience function)
		while (pokemon.experience >= pokemon.expToNextLevel && pokemon.level < 100) {
			messages.push(...levelUp(pokemon));
			leveledUp = true;

			// Check for evolution
			const evolveMessage = checkEvolution(player, pokemon, { room, user });
			if (evolveMessage) {
				messages.push(evolveMessage);
				evolved = true;
				break; // Stop after evolution to prevent multiple evolutions
			}

			// Check for move learning (only if no evolution)
			const { messages: newMoveMessages } = handleLearningMoves(player, pokemon);
			messages.push(...newMoveMessages);
		}

		// If no level up, show current progress
		if (!leveledUp) {
			const expNeeded = pokemon.expToNextLevel - pokemon.experience;
			messages.push(`<i>${expNeeded} EXP points needed for Level ${pokemon.level + 1}.</i>`);
		}

		// Increase friendship slightly (EXP Candies give +1 friendship in official games)
		// Cap at 255 (max friendship), ensure non-negative
		if (pokemon.friendship < 0) {
			pokemon.friendship = 0;
		}
		if (pokemon.friendship < 255) {
			pokemon.friendship = Math.min(255, pokemon.friendship + 1);
		}
	} catch (error) {
		// If anything fails, don't consume the item
		return { success: false, message: `An error occurred while using Exp. Candy. Please try again.` };
	}

	// Only remove item AFTER successful experience gain (prevents item loss on error)
	removeItemFromInventory(player, itemId, 1);

	const itemData = ITEMS_DATABASE[itemId];
	const resultMessage = `You used an <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>!<br>${messages.join('<br>')}`;
	return { success: true, message: resultMessage };
}

export function useVitaminItem(player: PlayerData, pokemon: RPGPokemon, itemId: string): { success: boolean, message: string } {
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return { success: false, message: "Invalid item." };

	if (pokemon.hp <= 0) {
		return { success: false, message: `${pokemon.species} has fainted!` };
	}

	const statMap: Record<string, keyof Stats> = {
		'hpup': 'hp',
		'protein': 'atk',
		'iron': 'def',
		'calcium': 'spa',
		'zinc': 'spd',
		'carbos': 'spe',
	};

	const statToBoost = statMap[itemId] as keyof Omit<Stats, 'maxHp'>; // 'hp' will be handled manually
	if (!statToBoost && itemId !== 'hpup') {
		return { success: false, message: "This item is not a vitamin." };
	}

	const totalEVs = Object.values(pokemon.evs).reduce((a, b) => a + b, 0);
	if (totalEVs >= 510) {
		return { success: false, message: `${pokemon.species} has already reached its maximum EV limit (510)!` };
	}

	const evStat = (itemId === 'hpup') ? 'hp' : statToBoost;
	const currentEV = pokemon.evs[evStat];

	// In modern games, vitamins can be used up to 252 EVs.
	// Let's assume they give 10 EVs, but only up to 252.
	if (currentEV >= 252) {
		return { success: false, message: `${pokemon.species}'s ${evStat.toUpperCase()} EVs are already maxed out (252)!` };
	}

	const evGain = 10;
	// Can't go over 252 in one stat, and can't go over 510 total
	const evToAdd = Math.min(evGain, 252 - currentEV, 510 - totalEVs);

	if (evToAdd <= 0) {
		// This should be caught by the earlier checks, but good to have
		return { success: false, message: `${pokemon.species}'s EVs could not be raised.` };
	}

	pokemon.evs[evStat] += evToAdd;

	// Recalculate stats immediately
	const species = Dex.species.get(pokemon.species);
	const newStats = calculateStats(species, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

	const hpDiff = newStats.maxHp - pokemon.maxHp;
	// If HP stat was boosted, add the difference to current HP
	if (hpDiff > 0 && pokemon.hp > 0) {
		pokemon.hp += hpDiff;
	}
	pokemon.maxHp = newStats.maxHp;
	pokemon.atk = newStats.atk;
	pokemon.def = newStats.def;
	pokemon.spa = newStats.spa;
	pokemon.spd = newStats.spd;
	pokemon.spe = newStats.spe;

	removeItemFromInventory(player, itemId, 1);
	return { success: true, message: `You used an <strong>${itemData.name}</strong> on <strong>${pokemon.species}</strong>! Its ${evStat.toUpperCase()} EVs rose!` };
}

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
	SHOP_INVENTORY,
};

export default RPGItems;
