'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Yawn', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should put foes to sleep eventually`, function () {
		battle = common.createBattle([[
			{species: "Mew", moves: ['yawn', 'splash']},
		], [
			{species: "Ninjask", moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, '');
		battle.makeChoices('move 2', 'move 1');
		assert.equal(battle.p2.active[0].status, 'slp');
	});

	it(`should be blocked by Safeguard`, function () {
		battle = common.createBattle([[
			{species: "Mew", moves: ['yawn']},
		], [
			{species: "Ninjask", moves: ['safeguard']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, '');
	});

	it(`should be able to put foes to sleep through Safeguard if used first`, function () {
		battle = common.createBattle([[
			{species: "Ninjask", moves: ['yawn']},
		], [
			{species: "Mew", moves: ['safeguard']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'slp');
	});
});
