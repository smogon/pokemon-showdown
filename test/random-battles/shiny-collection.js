/**
 * Tests for applying collected shinies to random teams
 */
'use strict';

const assert = require('../assert');
const { Battle, shinyCollectionKey } = require('../../dist/sim/battle');
const { PRNG } = require('../../dist/sim/prng');

function generateTeam(formatid, seed, shinies) {
	const battle = new Battle({ formatid });
	battle.setPlayer('p1', { name: 'Player 1', seed, shinies });
	return battle.sides[0].team;
}

describe('Shiny collection', () => {
	it('should make collected species shiny without changing the rest of the team', () => {
		const seed = PRNG.generateSeed();
		const plain = generateTeam('gen4randombattle', seed);
		const target = plain.find(set => !set.shiny);
		const collected = generateTeam('gen4randombattle', seed, [Dex.species.get(target.species).name]);

		assert.equal(collected.length, plain.length);
		for (const [i, set] of collected.entries()) {
			if (set.species === target.species) {
				assert(set.shiny, `${set.species} should be shiny`);
			} else {
				assert.equal(set.shiny, plain[i].shiny);
			}
			assert.equal(set.species, plain[i].species);
			assert.deepEqual(set.moves, plain[i].moves);
			assert.equal(set.item, plain[i].item);
		}
	});

	it('should ignore the list in gen 1 and gen 2', () => {
		const seed = PRNG.generateSeed();
		const plain = generateTeam('gen2randombattle', seed);
		const collected = generateTeam('gen2randombattle', seed, plain.map(set => Dex.species.get(set.species).name));
		assert.deepEqual(collected, plain);
	});

	it('should not add shinies when the list is empty or missing', () => {
		const seed = PRNG.generateSeed();
		assert.deepEqual(generateTeam('gen9randombattle', seed, []), generateTeam('gen9randombattle', seed));
	});

	it('should share one key between formes that only change appearance', () => {
		const key = name => shinyCollectionKey(Dex.species.get(name), Dex);
		assert.equal(key('Gastrodon-East'), 'Gastrodon');
		assert.equal(key('Alcremie-Ruby-Swirl'), 'Alcremie');
		assert.equal(key('Maushold-Four'), 'Maushold');
		assert.equal(key('Polteageist-Antique'), 'Polteageist');
	});

	it('should keep separate keys for formes that change the battle', () => {
		const key = name => shinyCollectionKey(Dex.species.get(name), Dex);
		assert.equal(key('Rotom-Wash'), 'Rotom-Wash');
		assert.equal(key('Dugtrio-Alola'), 'Dugtrio-Alola');
		assert.equal(key('Toxtricity-Low-Key'), 'Toxtricity-Low-Key');
		assert.equal(key('Basculin-Blue-Striped'), 'Basculin-Blue-Striped');
	});
});
