/**
 * Tests for Gen 5 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testTeam, testSet, testHiddenPower, testAlwaysHasMove, validateLearnset} = require('./tools');

describe('[Gen 5] Random Battle (slow)', () => {
	const options = {format: 'gen5randombattle'};
	const setsJSON = require(`../../dist/data/mods/gen5/random-sets.json`);
	const dex = Dex.forFormat(options.format);

	describe("New set format", () => {
		const filename = '../../data/mods/gen5/random-sets.json';
		it(`${filename} should have valid set data`, () => {
			const setsJSON = require(filename);
			const validRoles = [
				"Fast Attacker", "Setup Sweeper", "Wallbreaker", "Bulky Attacker",
				"Bulky Setup", "Staller", "Bulky Support", "Fast Support", "Spinner",
			];
			for (const [id, sets] of Object.entries(setsJSON)) {
				const species = Dex.species.get(id);
				assert(species.exists, `Misspelled species ID: ${id}`);
				assert(Array.isArray(sets.sets));
				for (const set of sets.sets) {
					assert(validRoles.includes(set.role), `Set for ${species.name} has invalid role: ${set.role}`);
					for (const move of set.movepool) {
						const dexMove = Dex.moves.get(move);
						assert(dexMove.exists, `${species.name} has invalid move: ${move}`);
						assert(move === dexMove.id || move.startsWith('hiddenpower'), `${species.name} has misformatted move: ${move}`);
						assert(validateLearnset(dexMove, {species}, 'anythinggoes', 'gen5'), `${species.name} can't learn ${move}`);
					}
					for (let i = 0; i < set.movepool.length - 1; i++) {
						assert(set.movepool[i + 1] > set.movepool[i], `${species} movepool should be sorted alphabetically`);
					}
					if (set.preferredTypes) {
						for (const type of set.preferredTypes) {
							const dexType = Dex.types.get(type);
							assert(dexType.exists, `${species.name} has invalid Preferred Type: ${type}`);
							assert.equal(type, dexType.name, `${species.name} has misformatted Preferred Type: ${type}`);
						}
						for (let i = 0; i < set.preferredTypes.length - 1; i++) {
							assert(set.preferredTypes[i + 1] > set.preferredTypes[i], `${species} preferredTypes should be sorted alphabetically`);
						}
					}
				}
			}
		});
	});

	it('all Pokemon should have 4 moves, except for Ditto and Unown', function () {
		// This test takes more than 2000ms
		testTeam({...options, rounds: 100}, team => {
			for (const pokemon of team) assert(pokemon.name === 'Ditto' || pokemon.name === 'Unown' || pokemon.moves.length === 4);
		});
	});

	it('all moves on all sets should be obtainable', function () {
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
				const preferredTypes = set.preferredTypes;
				let teamDetails = {};
				// Go through all possible teamDetails combinations, if necessary
				for (let j = 0; j < rounds; j++) {
					// Generate a moveset as the lead, teamDetails is always empty for this
					const preferredType = preferredTypes ? preferredTypes[j % preferredTypes.length] : '';
					const movePool = set.movepool.map(m => dex.moves.get(m).id);
					const moveSet = generator.randomMoveset(types, abilities, {}, species, true, movePool, preferredType, role);
					for (const move of moveSet) moves.delete(move);
					if (!moves.size) break;
					// Generate a moveset for each combination of relevant teamDetails
					for (let i = 0; i < 4; i++) {
						const rapidSpin = i % 2;
						const stealthRock = Math.floor(i / 2) % 2;
						teamDetails = {rapidSpin, stealthRock};
						// randomMoveset() deletes moves from the movepool, so recreate it every time
						const movePool = set.movepool.map(m => dex.moves.get(m).id);
						const moveSet = generator.randomMoveset(types, abilities, teamDetails, species, false, movePool, preferredType, role);
						for (const move of moveSet) moves.delete(move);
						if (!moves.size) break;
					}
					if (!moves.size) break;
				}
				assert(!moves.size, species);
			}
		}
	});

	it('should prevent double Hidden Power', () => {
		testHiddenPower('ampharos', options);
		testHiddenPower('venusaur', options);
	});

	it('should give Venusaur four moves', () => {
		testSet(
			'venusaur',
			{format: 'gen5randombattle', rounds: 1, seed: [2201, 2201, 2201, 2201]},
			set => assert.equal(set.moves.length, 4, `got ${JSON.stringify(set.moves)}`)
		);
	});

	it('should prevent unreleased HAs from being used', () => {
		testSet('chandelure', options, set => assert.notEqual(set.ability, 'Shadow Tag'));
	});

	it('should not give Ursaring Eviolite', () => {
		testSet('ursaring', options, set => assert.notEqual(set.item, 'Eviolite'));
	});

	it('should always give Watchog Return', () => {
		testAlwaysHasMove('watchog', options, 'return');
	});
});
