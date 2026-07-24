import RandomGen3Teams from '../gen3/teams';
import type { PRNG, PRNGSeed } from '../../../sim/prng';
import { MEGA_FORMES, MEGA_RANDOM_SETS } from './mega-sets';

const GEN3_RANDOM_SETS: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('../gen3/sets.json');

export class RandomGen3MegasCAPTeams extends RandomGen3Teams {
	readonly megaFormes = MEGA_FORMES;
	override randomSets = {
		...GEN3_RANDOM_SETS,
		...MEGA_RANDOM_SETS,
	};

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);

		for (const formeid of this.megaFormes) {
			const forme = this.dex.species.get(formeid);
			if (!forme.exists || !this.randomSets[formeid] || !forme.requiredItems?.length) {
				throw new Error(`Missing Gen 3 Megas CAP Random Battle data for ${formeid}`);
			}
		}
	}

	protected override getRequiredRandomSpecies(): Species {
		return this.dex.species.get(this.sample(this.megaFormes));
	}

	protected override getRandomSpeciesList(): string[] {
		return Object.keys(GEN3_RANDOM_SETS);
	}

	override randomTeam(): RandomTeamsTypes.RandomSet[] {
		const team = super.randomTeam();
		this.prng.shuffle(team);
		return team;
	}
}

export default RandomGen3MegasCAPTeams;
