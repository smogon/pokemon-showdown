'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mirror Move [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`[Gen 1] Mirror Move'd Hyper Beam should force a recharge turn after not KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'fearow', moves: ['mirrormove', 'tackle']},
		], [
			{species: 'aerodactyl', moves: ['hyperbeam']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] Mirror Move'd Hyper Beam should not force a recharge turn after KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'fearow', moves: ['mirrormove', 'tackle']},
		], [
			{species: 'kadabra', moves: ['hyperbeam']},
			{species: 'exeggutor', moves: ['splash']},
		]]);
		battle.makeChoices();
		battle.choose('p2', 'switch exeggutor');
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});
});
