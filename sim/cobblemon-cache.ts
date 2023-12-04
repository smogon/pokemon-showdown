import { Species } from "./dex-species";

export const MOD_ID = 'cobblemon';

const cobblemonSpecies = new Map<ID, Species>();

export function registerSpecies(speciesData: AnyObject): Species {
	const species = new Species(speciesData);
	cobblemonSpecies.set(species.id, species);
	return species;
}

export function resetSpecies() {
	cobblemonSpecies.clear();
}

export function speciesByID(id: ID): Species | undefined {
	return cobblemonSpecies.get(id);
}

export function allCache(): Species[] {
	return Array.from(cobblemonSpecies.values());
}
