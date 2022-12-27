'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Two Turn Moves [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`charges the first turn, and does damage the second turn`, function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Venusaur", moves: ['solarbeam']}]});
		battle.setPlayer('p2', {team: [{species: "Parasect", moves: ['swordsdance']}]});
		const venusaur = battle.p1.active[0];
		const parasect = battle.p2.active[0];
		battle.makeChoices();
		assert(venusaur.volatiles['twoturnmove']);
		assert.fullHP(parasect);
		battle.makeChoices();
		assert.false(venusaur.volatiles['twoturnmove']);
		assert.false.fullHP(parasect);
	});

	it(`move is paused when asleep or frozen`, function () {
		battle = common.gen(1).createBattle();
		battle.setPlayer('p1', {team: [{species: "Aerodactyl", moves: ['skyattack']}]});
		battle.setPlayer('p2', {team: [{species: "Parasect", moves: ['spore']}]});
		const aerodactyl = battle.p1.active[0];
		for (let i = 0; i < 10; i++) {
			battle.makeChoices();
			assert(aerodactyl.volatiles['twoturnmove']);
		}
		assert(true);
	});
});
