import RandomGen6Teams from '../gen6/teams';

export class RandomMRTeams extends RandomGen6Teams {
	override randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');
}

export default RandomMRTeams;
