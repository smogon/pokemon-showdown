/*
* Pokemon Showdown
* RPG Evolution Data
* Note: Trade Evolution are changed to be level based.
*/
export const MANUAL_EVOLUTIONS: { [key: string]: { evoTo: string, evoLevel: number, evoItem?: string } } = {
	// Starters
	'bulbasaur': { evoTo: 'ivysaur', evoLevel: 16 },
	'ivysaur': { evoTo: 'venusaur', evoLevel: 32 },
	'charmander': { evoTo: 'charmeleon', evoLevel: 16 },
	'charmeleon': { evoTo: 'charizard', evoLevel: 36 },
	'squirtle': { evoTo: 'wartortle', evoLevel: 16 },
	'wartortle': { evoTo: 'blastoise', evoLevel: 36 },
	// Bug Types
	'caterpie': { evoTo: 'metapod', evoLevel: 7 },
	'metapod': { evoTo: 'butterfree', evoLevel: 10 },
	'weedle': { evoTo: 'kakuna', evoLevel: 7 },
	'kakuna': { evoTo: 'beedrill', evoLevel: 10 },
	'paras': { evoTo: 'parasect', evoLevel: 24 },
	'venonat': { evoTo: 'venomoth', evoLevel: 31 },
	// Normal Types
	'pidgey': { evoTo: 'pidgeotto', evoLevel: 18 },
	'pidgeotto': { evoTo: 'pidgeot', evoLevel: 36 },
	'rattata': { evoTo: 'raticate', evoLevel: 20 },
	'spearow': { evoTo: 'fearow', evoLevel: 20 },
	'meowth': { evoTo: 'persian', evoLevel: 28 },
	'doduo': { evoTo: 'dodrio', evoLevel: 31 },
	// Poison Types
	'ekans': { evoTo: 'arbok', evoLevel: 22 },
	'nidoranf': { evoTo: 'nidorina', evoLevel: 16 },
	'nidorina': { evoTo: 'nidoqueen', evoLevel: 99, evoItem: 'moonstone' },
	'nidoranm': { evoTo: 'nidorino', evoLevel: 16 },
	'nidorino': { evoTo: 'nidoking', evoLevel: 99, evoItem: 'moonstone' },
	'zubat': { evoTo: 'golbat', evoLevel: 22 },
	'oddish': { evoTo: 'gloom', evoLevel: 21 },
	'gloom': { evoTo: 'vileplume', evoLevel: 99, evoItem: 'leafstone' },
	'bellsprout': { evoTo: 'weepinbell', evoLevel: 21 },
	'weepinbell': { evoTo: 'victreebel', evoLevel: 99, evoItem: 'leafstone' },
	'grimer': { evoTo: 'muk', evoLevel: 38 },
	'koffing': { evoTo: 'weezing', evoLevel: 35 },
	'gastly': { evoTo: 'haunter', evoLevel: 25 },
	'haunter': { evoTo: 'gengar', evoLevel: 40 }, // Trade Evo -> Lvl 40
	// Ground/Rock Types
	'sandshrew': { evoTo: 'sandslash', evoLevel: 22 },
	'diglett': { evoTo: 'dugtrio', evoLevel: 26 },
	'geodude': { evoTo: 'graveler', evoLevel: 25 },
	'graveler': { evoTo: 'golem', evoLevel: 40 }, // Trade Evo -> Lvl 40
	'cubone': { evoTo: 'marowak', evoLevel: 28 },
	'rhyhorn': { evoTo: 'rhydon', evoLevel: 42 },
	// Fire Types
	'vulpix': { evoTo: 'ninetales', evoLevel: 99, evoItem: 'firestone' },
	'growlithe': { evoTo: 'arcanine', evoLevel: 99, evoItem: 'firestone' },
	'ponyta': { evoTo: 'rapidash', evoLevel: 40 },
	// Water Types
	'psyduck': { evoTo: 'golduck', evoLevel: 33 },
	'poliwag': { evoTo: 'poliwhirl', evoLevel: 25 },
	'poliwhirl': { evoTo: 'poliwrath', evoLevel: 99, evoItem: 'waterstone' },
	'tentacool': { evoTo: 'tentacruel', evoLevel: 30 },
	'slowpoke': { evoTo: 'slowbro', evoLevel: 37 },
	'seel': { evoTo: 'dewgong', evoLevel: 34 },
	'shellder': { evoTo: 'cloyster', evoLevel: 99, evoItem: 'waterstone' },
	'krabby': { evoTo: 'kingler', evoLevel: 28 },
	'horsea': { evoTo: 'seadra', evoLevel: 32 },
	'goldeen': { evoTo: 'seaking', evoLevel: 33 },
	'staryu': { evoTo: 'starmie', evoLevel: 99, evoItem: 'waterstone' },
	'magikarp': { evoTo: 'gyarados', evoLevel: 20 },
	// Psychic Types
	'abra': { evoTo: 'kadabra', evoLevel: 16 },
	'kadabra': { evoTo: 'alakazam', evoLevel: 40 }, // Trade Evo -> Lvl 40
	'drowzee': { evoTo: 'hypno', evoLevel: 26 },
	'exeggcute': { evoTo: 'exeggutor', evoLevel: 99, evoItem: 'leafstone' },
	// Fighting Types
	'mankey': { evoTo: 'primeape', evoLevel: 28 },
	'machop': { evoTo: 'machoke', evoLevel: 28 },
	'machoke': { evoTo: 'machamp', evoLevel: 40 }, // Trade Evo -> Lvl 40
	// Electric Types
	'pikachu': { evoTo: 'raichu', evoLevel: 99, evoItem: 'thunderstone' },
	'magnemite': { evoTo: 'magneton', evoLevel: 30 },
	'voltorb': { evoTo: 'electrode', evoLevel: 30 },
	// Fairy Types
	'clefairy': { evoTo: 'clefable', evoLevel: 99, evoItem: 'moonstone' },
	'jigglypuff': { evoTo: 'wigglytuff', evoLevel: 99, evoItem: 'moonstone' },
	// Eeveelutions (WARNING: Only one can be active at a time with current code structure)
	'eevee': { evoTo: 'vaporeon', evoLevel: 99, evoItem: 'waterstone' },
	// 'eevee': { evoTo: 'jolteon', evoLevel: 99, evoItem: 'thunderstone' },
	// 'eevee': { evoTo: 'flareon', evoLevel: 99, evoItem: 'firestone' },
	// Fossil Types
	'omanyte': { evoTo: 'omastar', evoLevel: 40 },
	'kabuto': { evoTo: 'kabutops', evoLevel: 40 },
	// Dragon Types
	'dratini': { evoTo: 'dragonair', evoLevel: 30 },
	'dragonair': { evoTo: 'dragonite', evoLevel: 55 },
};
