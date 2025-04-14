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
     * @param ballsPerPlayer Number of balls each player gets
     * @returns An array of Pokemon objects
     */
    static generatePokemonPool(ballsPerPlayer: number): Pokemon[] {
        const pool: Pokemon[] = [];
        // Use gen4 dex specifically to limit Pokémon to gen1-4
        const dex = Dex.mod('gen4');
        
        // Calculate pool size - 3x the number of balls per player
        const poolSize = ballsPerPlayer * 3;
        
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

        // Get available species from gen1-4 only
        const allSpecies = Array.from(dex.species.all())
            // Filter out non-standard species, formes, and ensure it's gen 1-4 only
            .filter(species => {
                // Filter out non-standard Pokémon
                if (species.isNonstandard) return false;
                // Filter out alternate formes
                if (species.forme) return false;
                // Filter by generation (1-4 only)
                const gen = parseInt(species.gen);
                return gen >= 1 && gen <= 4;
            })
            // Shuffle the array
            .sort(() => Math.random() - 0.5)
            // Limit pool size based on balls per player
            .slice(0, poolSize);

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
