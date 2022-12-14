/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const {testTeam} = require('./tools');
const assert = require('../assert');
const Teams = require('./../../sim/teams').Teams;
const Dex = require('./../../sim/dex').Dex;

describe('[Gen 9] Random Battle', () => {
	const options = {format: 'gen9randombattle'};
	const setsJSON = require(`../../data/random-sets.json`);
	const dex = Dex.forFormat(options.format);

	it('all Pokemon should have 4 moves, except for Ditto (slow)', function () {
		// This test takes more than 2000ms
		testTeam(options, team => {
			for (const pokemon of team) assert(pokemon.name === 'Ditto' || pokemon.moves.length === 4);
		});
	});

	it('all moves on all sets should be obtainable (slow)', function () {
		const generator = Teams.getGenerator(options.format);
		const rounds = 100;
		for (const pokemon of Object.keys(setsJSON)) {
			const species = dex.species.get(pokemon);
			const sets = setsJSON[pokemon]["sets"];
			const types = species.types;
			const abilities = new Set(Object.values(species.abilities));
			if (species.unreleasedHidden) abilities.delete(species.abilities.H);
			for (const set of sets) {
				const role = set.role;
				const movePool = set.movepool.map(m => dex.moves.get(m).id);
				const teraTypes = set.teraTypes;
				// Every move in the movePool should be obtainable
				for (const move of movePool) {
					let moveObtained = false;
					let teamDetails = {};
					// Go through all possible teamDetails combinations, if necessary
					for (let i = 0; i < 8; i++) {
						const defog = i % 2;
						const stealthRock = Math.floor(i / 2) % 2;
						const stickyWeb = Math.floor(i / 4) % 2;
						teamDetails = {'defog': defog, 'stealthRock': stealthRock, 'stickyWeb': stickyWeb};
						for (let j = 0; j < rounds; j++) {
							// randomMoveset() deletes moves from the movePool, so create a copy
							const movePoolCopy = [...movePool];
							const teraType = teraTypes[j % teraTypes.length];
							const moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, false, movePoolCopy, teraType, role);
							if (moveSet.has(move)) {
								moveObtained = true;
								break;
							}
						}
						if (moveObtained) break;
					}
					assert(moveObtained);
				}
			}
		}
	});
});
