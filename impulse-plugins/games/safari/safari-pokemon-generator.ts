/*************************************
 * Pokemon Safari Zone Generator     *
 * Author: @musaddiktemkar           *
 **************************************/

import { Pokemon } from './safari-types';

/**
 * Utility class for generating Pokemon for the Safari Zone
 */
export class PokemonGenerator {
    /**
     * Generates a pool of Pokemon with varied rarities and point values
     * @returns An array of Pokemon objects
     */
    static generatePokemonPool(): Pokemon[] {
        const pool: Pokemon[] = [];
        const dex = Dex.mod('gen9');

        // Define rarity and points based on base stats
        const getDetails = (species: Species) => {
            const baseStats = species.baseStats;
            const bst = Object.values(baseStats).reduce((a, b) => a + b, 0);
            
            // Assign rarity and points based on BST
            if (bst >= 600) return { rarity: 0.05, points: 100 };      // Legendaries/Very Strong
            if (bst >= 500) return { rarity: 0.1, points: 50 };        // Strong
            if (bst >= 400) return { rarity: 0.15, points: 30 };       // Medium
            return { rarity: 0.3, points: 10 };                        // Common
        };

        // Get available species
        const allSpecies = Array.from(dex.species.all())
            .filter(species => !species.isNonstandard && !species.forme)
            .sort(() => Math.random() - 0.5)
            .slice(0, 20); // Limit total pool size

        // Create pool with dynamic rarity/points based on stats
        for (const species of allSpecies) {
            const { rarity, points } = getDetails(species);
            pool.push({
                name: species.name,
                rarity,
                points,
                sprite: `https://play.pokemonshowdown.com/sprites/ani/${species.id}.gif`
            });
        }

        return pool;
    }

    /**
     * Selects a random Pokemon from the pool
     * @param pokemonPool The pool of available Pokemon
     * @returns A randomly selected Pokemon
     */
    static selectRandomPokemon(pokemonPool: Pokemon[]): Pokemon {
        const randomIndex = Math.floor(Math.random() * pokemonPool.length);
        return pokemonPool[randomIndex];
    }

    /**
     * Simulates the chance of catching a Pokemon
     * @param pokemon The Pokemon to attempt to catch
     * @returns True if caught, false otherwise
     */
    static calculateCatchSuccess(pokemon: Pokemon): boolean {
        // More rare Pokemon are harder to catch
        return Math.random() > pokemon.rarity * 0.8;
    }
}
