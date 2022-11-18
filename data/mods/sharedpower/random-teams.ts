import {PRNG, PRNGSeed} from '../../../sim/prng';
import RandomGen8Teams from '../gen8/random-teams';

export class RandomSharedPowerTeams extends RandomGen8Teams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
	) {
		const exclude = ['golisopod', ...pokemonToExclude.map(p => toID(p.species))];
		const pokemonPool = [];
		for (let species of this.dex.species.all()) {
			if (species.gen > this.gen || exclude.includes(species.id)) continue;
			if (this.dex.currentMod === 'gen8bdsp' && species.gen > 4) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === 'string') {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}
			pokemonPool.push(species.id);
		}
		return pokemonPool;
	}
}

export default RandomSharedPowerTeams;
