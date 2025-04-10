import { Dex } from '@pkmn/dex';
import { FormatList } from '@pkmn/sim';
import redPokemonData from './red_pokemon_data.json'; // Ensure the path is correct

const gen9 = Dex.forGen(9);
const redPokemonIds = Object.keys(redPokemonData);

function getRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(Math.random() * array.length)];
}

export const Formats: FormatList = [
    {
        section: "Impulse Custom Formats",
    },
    {
        name: "[Gen 9] Impulse Red Team (AG Rules)",
        desc: `Randomized teams of red colored Pok&eacute;mon (with Mega Evolutions holding their stones) under standard Anything Goes rules.`,
        mod: 'gen9',
        team: (options) => {
            const teamSize = 6;
            const team: string[] = [];
            const usedPokemon = new Set<string>();

            if (redPokemonIds.length === 0) {
                return "Error: No red Pokémon defined in red_pokemon_data.json.";
            }

            while (team.length < teamSize && usedPokemon.size < redPokemonIds.length) {
                const randomPokemonId = getRandom(redPokemonIds.filter(id => !usedPokemon.has(id)));
                if (!randomPokemonId) break;

                usedPokemon.add(randomPokemonId);
                const pokemonEntry = redPokemonData[randomPokemonId as keyof typeof redPokemonData];

                if (pokemonEntry) {
                    let baseData;
                    let itemName: string | undefined;
                    let abilityName: string | undefined;
                    let natureName: string | undefined;
                    let evsObject: { hp?: number; atk?: number; def?: number; spa?: number; spd?: number; spe?: number } | undefined;
                    let movesList: string[] | undefined;
                    let speciesName = randomPokemonId;

                    if ('base' in pokemonEntry) {
                        baseData = pokemonEntry.base;
                        itemName = baseData.item;
                        abilityName = baseData.ability;
                        natureName = baseData.nature;
                        evsObject = baseData.evs;
                        movesList = baseData.moves;
                    } else {
                        itemName = pokemonEntry.item;
                        abilityName = pokemonEntry.ability;
                        natureName = pokemonEntry.nature;
                        evsObject = pokemonEntry.evs;
                        movesList = pokemonEntry.moves;
                    }

                    if (itemName && abilityName && natureName && evsObject && movesList) {
                        team.push(`${speciesName} @ ${itemName}`);
                        team.push(`Ability: ${abilityName}`);
                        const evString = `EVs: ${evsObject.hp || 0} HP / ${evsObject.atk || 0} Atk / ${evsObject.def || 0} Def / ${evsObject.spa || 0} SpA / ${evsObject.spd || 0} SpD / ${evsObject.spe || 0} Spe`;
                        team.push(evString);
                        team.push(`${natureName} Nature`);
                        const randomMoves = [];
                        const usedMoves = new Set<string>();
                        while (randomMoves.length < 4 && movesList.length > 0) {
                            const randomIndex = Math.floor(Math.random() * movesList.length);
                            const move = movesList[randomIndex];
                            if (!usedMoves.has(move)) {
                                randomMoves.push(move);
                                usedMoves.add(move);
                            }
                        }
                        for (const move of randomMoves) {
                            team.push(`- ${move}`);
                        }
                        team.push(`Tera Type: Fire`); // Placeholder
                        if (team.length < teamSize * 8) team.push('');
                    }
                }
            }

            return team.join('\n');
        },
        ruleset: ['Species Clause', 'Sleep Clause Mod', 'Evasion Clause', 'OHKO Clause', 'Moody Clause', 'Mega Evolution'],
    },
    // You can still have your custom random battle format here if you want
    {
        name: "[Gen 9] Impulse Random Battle",
        desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
        mod: 'gen9',
        team: 'random',
        ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
    },
];
