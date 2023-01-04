/**
 * Tests for Gen 9 randomized formats
 */
'use strict';

const {testTeam} = require('./tools');
const assert = require('../assert');
const Teams = require('./../../dist/sim/teams').Teams;
const Dex = require('./../../dist/sim/dex').Dex;

describe('[Gen 9] Random Battle', () => {
	const options = {format: 'gen9randombattle'};
	const setsJSON = require(`../../dist/data/random-sets.json`);
	const dex = Dex.forFormat(options.format);

	it('all Pokemon should have 4 moves, except for Ditto (slow)', function () {
		// This test takes more than 2000ms
		testTeam({...options, rounds: 100}, team => {
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
				const moves = new Set(set.movepool.map(m => dex.moves.get(m).id));
				const teraTypes = set.teraTypes;
				let teamDetails = {};
				// Go through all possible teamDetails combinations, if necessary
				for (let j = 0; j < rounds; j++) {
					// Generate a moveset as the lead, teamDetails is always empty for this
					const teraType = teraTypes[j % teraTypes.length];
					const movePool = set.movepool.map(m => dex.moves.get(m).id);
					const moveSet = generator.randomMoveset(types, abilities, {}, species, true, false, movePool, teraType, role);
					for (const move of moveSet) moves.delete(move);
					if (!moves.size) break;
					// Generate a moveset for each combination of relevant teamDetails
					for (let i = 0; i < 8; i++) {
						const defog = i % 2;
						const stealthRock = Math.floor(i / 2) % 2;
						const stickyWeb = Math.floor(i / 4) % 2;
						teamDetails = {defog, stealthRock, stickyWeb};
						// randomMoveset() deletes moves from the movepool, so recreate it every time
						const movePool = set.movepool.map(m => dex.moves.get(m).id);
						const moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, false, movePool, teraType, role);
						for (const move of moveSet) moves.delete(move);
						if (!moves.size) break;
					}
					if (!moves.size) break;
				}
				assert(!moves.size);
			}
		}
	});
});

describe('[Gen 9] Monotype Random Battle', () => {
	const options = {format: 'gen9monotyperandombattle'};

	it('all Pokemon should share a common type', function () {
		testTeam({...options, rounds: 100}, team => {
			assert.legalTeam(team, 'gen9customgame@@@sametypeclause');
		});
	});
});
