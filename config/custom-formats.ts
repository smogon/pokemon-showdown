import { Dex } from '@pkmn/dex';
import { RandomTeams } from '@pkmn/random-teams';

const gen9 = Dex.forGen(9);
const randomTeams = new RandomTeams(gen9);

// Function to check if a Pokémon has red in its color(s)
function isRedPokemon(species: import('@pkmn/dex').Species) {
	return species.color === 'Red' || (Array.isArray(species.color) && species.color.includes('Red'));
}

export const Formats: FormatList = [
	{
		section: "Impulse Custom Formats",
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

			if (allRedPokemon.length === 0) {
				return "Error: No red colored Pokémon found in Gen 9.";
			}

			for (let i = 0; i < teamSize; i++) {
				if (allRedPokemon.length === usedPokemon.size) {
					break; // Stop if all red Pokémon have been used
				}

				let randomSpecies;
				let attempts = 0;
				do {
					randomSpecies = allRedPokemon[Math.floor(Math.random() * allRedPokemon.length)];
					attempts++;
					if (attempts > 100) { // Prevent infinite loops in unlikely scenarios
						// Fallback to a random Pokemon if we can't find a new red one
						const allPokemon = Array.from(gen9.species.all()).filter(s => s.exists);
						randomSpecies = allPokemon[Math.floor(Math.random() * allPokemon.length)];
						console.warn("Could not find a unique red Pokémon after multiple attempts. Using a random Pokémon instead.");
						break;
					}
				} while (usedPokemon.has(randomSpecies.name));

				const randomSet = randomTeams.randomSet(randomSpecies.name);
				team.push(randomSet.species + (randomSet.nickname ? ` (${randomSet.nickname})` : '') + (randomSet.item ? ` @ ${randomSet.item}` : ''));
				team.push(`Ability: ${randomSet.ability}`);
				if (randomSet.teraType) team.push(`Tera Type: ${randomSet.teraType}`);
				team.push(`EVs: ${randomSet.evs.hp || 0} HP / ${randomSet.evs.atk || 0} Atk / ${randomSet.evs.def || 0} Def / ${randomSet.evs.spa || 0} SpA / ${randomSet.evs.spd || 0} SpD / ${randomSet.evs.spe || 0} Spe`);
				team.push(randomSet.nature ? `${randomSet.nature} Nature` : 'Serious Nature');
				for (const move of randomSet.moves) {
					team.push(`- ${move}`);
				}
				usedPokemon.add(randomSpecies.name);
				if (i < teamSize - 1 && i < allRedPokemon.length -1) team.push(''); // Add a newline between Pokemon
			}

			return team.join('\n');
		},
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
];
