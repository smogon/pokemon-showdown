import { Dex } from '@pkmn/dex';
import { TeamGenerators } from '@pkmn/randoms';
import { FormatList } from '@pkmn/sim';

const gen9 = Dex.forGen(9);

const redPokemonList = new Set([
	// Generation 1
	'charmander', 'charmeleon', 'charizard', 'vulpix', 'ninetales', 'magmar', 'magikarp', 'gyarados', // Considering shiny
	'flareon', 'moltres',

	// Generation 2
	'typhlosion', 'scizor', 'magby', 'entei',

	// Generation 3
	'torchic', 'combusken', 'blaziken', 'slugma', 'magcargo', 'corphish', 'crawdaunt', 'groudon',

	// Generation 4
	'chimchar', 'monferno', 'infernape', 'magmortar', 'heatran',

	// Generation 5
	'darumaka', 'darmanitan', 'archen', 'archeops', 'reshiram',

	// Generation 6
	'fletchling', 'fletchinder', 'talonflame', 'volcanion',

	// Generation 7
	'litten', 'torracat', 'incineroar', 'salandit', 'salazzle',

	// Generation 8
	'scorbunny', 'raboot', 'cinderace', 'centiskorch',

	// Generation 9
	'fuecoco', 'crocalor', 'skeledirge', 'armarouge', 'annihilape',

	// Other Pokémon with significant red elements or variations
	'mew', // Pinkish-red
	'ho-oh',
	'kyogre-primal', // Red markings
	'rayquaza', // Red markings
	'deoxys-attack', 'deoxys-speed', // Red forms
	'dialga', // Red accents
	'palkia', // Red accents
	'giratina-origin', // Red accents
	'victini',
	'genesect', // Red parts
	'yveltal',
	'volcarona', // Orange-red
	'ceruledge', // Red energy
	'ursaluna-bloodmoon', // Red eyes and accents
	'walking wake', // Red fins

	// Hisuian Forms with red elements
	'growlithe-hisui', 'arcanine-hisui',

	// Galarian Forms with red elements
	'darmanitan-galar-zen', // Red aura

	// Paradox Pokémon with red elements
	'great tusk', // Red tusks and accents
	'brute bonnet', // Red cap
	'flutter mane', // Red eyes and accents
	'slither wing', // Red body
	'roaring moon', // Red wings and accents
	'iron hands', // Red accents
	'iron bundle', // Red scarf
	'iron jugulis', // Red eyes and accents
	'iron thorns', // Red spines
	'iron valiant', // Red horns and accents
	'koraidon',
	'miraidon', // Red accents
]);

export const Formats: FormatList = [
	{
		section: "Impulse Custom Formats",
	},
	{
		name: "[Gen 9] Impulse Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		mod: 'gen9',
		team: 'random',
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Impulse Red Team Random Battle",
		desc: `Randomized teams of Pok&eacute;mon considered red, with competitively viable movesets.`,
		mod: 'gen9',
		team: (options) => {
			const teamSize = 6;
			const team: string[] = [];
			const usedPokemon: Set<string> = new Set();
			const generator = TeamGenerators.getTeamGenerator('gen9randombattle');

			if (!generator) {
				return "Error: Could not initialize the random team generator for Gen 9.";
			}

			// Filter our redPokemonList to only include Pokémon that are in the generator's pool
			const viableRedPokemon = Array.from(redPokemonList).filter(pokemonId =>
				generator.speciesPool.includes(pokemonId)
			);

			if (viableRedPokemon.length === 0) {
				return "Error: No viable red Pokémon found in the Gen 9 Random Battle pool.";
			}

			for (let i = 0; i < teamSize; i++) {
				if (usedPokemon.size === viableRedPokemon.length) {
					break; // Stop if all viable red Pokémon have been used
				}

				const availableRedPokemon = viableRedPokemon.filter(id => !usedPokemon.has(id));
				if (availableRedPokemon.length === 0) break;

				const randomPokemonId = availableRedPokemon[Math.floor(Math.random() * availableRedPokemon.length)];
				const randomSpecies = gen9.species.get(randomPokemonId);

				if (!randomSpecies) continue; // Should not happen, but for safety

				const randomSet = generator.randomSet(randomSpecies.id);
				team.push(randomSet.species + (randomSet.nickname ? ` (${randomSet.nickname})` : '') + (randomSet.item ? ` @ ${randomSet.item}` : ''));
				team.push(`Ability: ${randomSet.ability}`);
				if (randomSet.teraType) team.push(`Tera Type: ${randomSet.teraType}`);
				team.push(`EVs: ${randomSet.evs.hp || 0} HP / ${randomSet.evs.atk || 0} Atk / ${randomSet.evs.def || 0} Def / ${randomSet.evs.spa || 0} SpA / ${randomSet.evs.spd || 0} SpD / ${randomSet.evs.spe || 0} Spe`);
				team.push(randomSet.nature ? `${randomSet.nature} Nature` : 'Serious Nature');
				for (const move of randomSet.moves) {
					team.push(`- ${move}`);
				}
				usedPokemon.add(randomSpecies.name);
				if (i < teamSize - 1 && i < viableRedPokemon.length - 1) team.push('');
			}

			return team.join('\n');
		},
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
];
