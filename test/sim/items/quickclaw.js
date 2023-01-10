'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Quick Claw', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`[Gen 2] shares its activation roll with every holder on any given turn`, function () {
		battle = common.gen(2).createBattle([[
			{species: 'snorlax', item: 'quickclaw', moves: ['sleeptalk']},
		], [
			{species: 'mewtwo', item: 'quickclaw', moves: ['sleeptalk']},
		]]);

		const snorlax = battle.p1.active[0];
		const mewtwo = battle.p2.active[0];
		battle.makeChoices(); // Quick Claw activates
		assert.equal(snorlax.speed, mewtwo.speed);
		battle.makeChoices(); // Quick Claw activates
		assert.equal(snorlax.speed, mewtwo.speed);
		battle.makeChoices(); // Quick Claw does not activate
		assert.notEqual(snorlax.speed, mewtwo.speed);
	});

	it(`[Gen 3] causes Speed ties with every holder when activated`, function () {
		battle = common.gen(3).createBattle({seed: [163, 106, 112, 542]}, [[
			{species: 'snorlax', item: 'quickclaw', moves: ['spore']},
		], [
			{species: 'deoxys', item: 'quickclaw', moves: ['seismictoss']},
		]]);

		const snorlax = battle.p1.active[0];
		const deoxys = battle.p2.active[0];
		battle.quickClawRoll = true;
		battle.makeChoices();
		assert.fullHP(snorlax); // Snorlax wins the tie
		assert.equal(snorlax.speed, deoxys.speed);
		battle.quickClawRoll = true;
		battle.makeChoices();
		assert.false.fullHP(snorlax); // Deoxys wakes up and wins the tie
		assert.equal(snorlax.speed, deoxys.speed);
	});
});
