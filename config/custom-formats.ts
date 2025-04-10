import { Dex } from '@pkmn/dex';
import { TeamGenerators } from '@pkmn/randoms';

const gen9 = Dex.forGen(9);

// Function to check if a Pokémon has red in its color(s)
function isRedPokemon(species: import('@pkmn/dex').Species) {
	return species.color === 'Red' || (Array.isArray(species.color) && species.color.includes('Red'));
}

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
		desc: `Randomized teams of red colored Pok&eacute;mon with competitively viable movesets.`,
		mod: 'gen9',
		team: (options) => {
			const teamSize = 6;
			const team: string[] = [];
			const usedPokemon: Set<string> = new Set();
			const allRedPokemon = Array.from(gen9.species.all()).filter(isRedPokemon).filter(s => s.exists);
			const generator = TeamGenerators.getTeamGenerator('gen9randombattle'); // Get the Gen 9 random battle generator

			if (!generator) {
				return "Error: Could not initialize the random team generator for Gen 9.";
			}

			if (allRedPokemon.length === 0) {
				return "Error: No red colored Pokémon found in Gen 9.";
			}

			const viableRedPokemon = allRedPokemon.filter(species => generator.speciesPool.includes(species.id));

			for (let i = 0; i < teamSize; i++) {
				if (viableRedPokemon.length === usedPokemon.size) {
					break; // Stop if all viable red Pokémon have been used
				}

				let randomSpecies;
				let attempts = 0;
				do {
					randomSpecies = viableRedPokemon[Math.floor(Math.random() * viableRedPokemon.length)];
					attempts++;
					if (attempts > 100) { // Prevent infinite loops
						const allViablePokemon = Array.from(gen9.species.all()).filter(s => s.exists && generator.speciesPool.includes(s.id));
						randomSpecies = allViablePokemon[Math.floor(Math.random() * allViablePokemon.length)];
						console.warn("Could not find a unique viable red Pokémon after multiple attempts. Using a random viable Pokémon instead.");
						break;
					}
				} while (usedPokemon.has(randomSpecies.name));

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
