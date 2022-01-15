/**
 * Tests for Gen 1 randomized formats
 */
'use strict';

const assert = require('../assert');
const {testTeam} = require('./tools');

describe('[Gen 1] Random Battle', () => {
	const options = {format: 'gen1randombattle'};

	const badPokemon = ['Magikarp', 'Weedle', 'Kakuna', 'Caterpie', 'Metapod'];
	it(`should not give bad Pokémon as leads (${badPokemon.join(', ')})`, () => {
		testTeam(options, team => assert(!badPokemon.includes(team[0].species), `${team[0].species} is a bad lead`));
	});
});
