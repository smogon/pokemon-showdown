'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Healing Wish', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal a switch-in for full before hazards at end of turn', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish', 'protect']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]);

		battle.makeChoices('move String Shot', 'move Endeavor'); // set Caterpie to 1hp

		battle.makeChoices('switch Jirachi', 'switch Tyranitar'); // set up Sand

		battle.makeChoices('move Protect', 'move Stealth Rock');

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		// sand happens after Jirachi faints and before any switch-in
		battle.makeChoices('switch Caterpie', ''); // Caterpie heals before taking SR damage
		assert.strictEqual(battle.p1.active[0].hp, 174);
		assert.strictEqual(battle.p1.active[0].moveSlots[0].pp, 63);
	});

	it('[Gen 4] should heal a switch-in for full after hazards mid-turn', function () {
		battle = common.gen(4).createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Raichu', ability: 'lightningrod', moves: ['growl']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]);

		battle.makeChoices('move String Shot', 'move Endeavor'); // set Caterpie to 1hp

		battle.makeChoices('switch Raichu', 'switch Tyranitar'); // set up Sand

		battle.makeChoices('move Growl', 'move Stealth Rock');

		battle.makeChoices('switch Jirachi', 'move Seismic Toss');

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		battle.makeChoices('switch Caterpie', ''); // Caterpie faints from hazards
		assert.strictEqual(battle.p1.active[0].hp, 0);

		battle.makeChoices('switch Raichu', ''); // Raichu fully heals and takes stoss + Sandstorm damage
		assert.strictEqual(battle.turn, 6);
		assert.strictEqual(battle.p1.active[0].hp, 145); // after stoss + Sandstorm
		assert.strictEqual(battle.p1.active[0].moveSlots[0].pp, 63);
	});
});
