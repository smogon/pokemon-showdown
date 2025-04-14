import { Pokemon } from './safari.types';
import { FS } from '../../lib/fs';

export class SafariUtils {
    static formatUTCTime(timestamp: number): string {
        return new Date(timestamp)
            .toISOString()
            .replace('T', ' ')
            .substr(0, 19);
    }

    static generatePokemonPool(): Pokemon[] {
        const pool: Pokemon[] = [];
        const dex = Dex.mod('gen9');

        const getDetails = (species: Species) => {
            const baseStats = species.baseStats;
            const bst = Object.values(baseStats).reduce((a, b) => a + b, 0);
            
            if (bst >= 600) return { rarity: 0.05, points: 100 };
            if (bst >= 500) return { rarity: 0.1, points: 50 };
            if (bst >= 400) return { rarity: 0.15, points: 30 };
            return { rarity: 0.3, points: 10 };
        };

        const allSpecies = Array.from(dex.species.all())
            .filter(species => !species.isNonstandard && !species.forme)
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);

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
}
