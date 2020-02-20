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
		battle.setPlayer('p1', {team: [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish', 'protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});

		battle.makeChoices('move String Shot', 'move Endeavor'); // set Caterpie to 1hp

		battle.makeChoices('switch Jirachi', 'switch Tyranitar'); // set up Sand

		battle.makeChoices('move Protect', 'move Stealth Rock');

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		// sand happens after Jirachi faints and before any switch-in
		battle.makeChoices('switch Caterpie', ''); // Caterpie heals before taking SR damage
		assert.equal(battle.p1.active[0].hp, 174);
		assert.equal(battle.p1.active[0].moveSlots[0].pp, 63);
	});

	it('should not be consumed if a switch-in is fully healed already', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish', 'protect']},
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});
		battle.makeChoices('move Protect', 'move Stealth Rock'); // set up Sand and Stealth Rock

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		// sand happens after Jirachi faints and before any switch-in
		battle.makeChoices('switch Caterpie', ''); // Caterpie does not consume Healing Wish
		assert(battle.p1.slotConditions[0]['healingwish']);
	});

	it('should heal an ally fully after Ally Switch', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Rotom', ability: 'levitate', moves: ['allyswitch']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Garchomp', ability: 'sandveil', moves: ['sleeptalk']},
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor', 'protect']},
		]});
		// set up Healing Wish, Caterpie is at 1 HP
		battle.makeChoices('move Healing Wish, move String Shot', 'move Sleep Talk, move Endeavor 2');
		// Rotom does not consume Healing Wish
		battle.makeChoices('switch Rotom', '');
		assert(battle.p1.slotConditions[0]['healingwish']);
		// Caterpie gets healed by Healing Wish triggered by Ally Switch
		battle.makeChoices('move Ally Switch, move String Shot', 'move Sleep Talk, move Protect');

		assert.equal(battle.p1.active[0].hp, 231); // Caterpie start in slot 1 -> Ally Switch-ed to slot 0
		assert.false(battle.p1.slotConditions[0]['healingwish']);
	});

	it('[Gen 4] should heal a switch-in for full after hazards mid-turn', function () {
		battle = common.gen(4).createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Caterpie', ability: 'shielddust', moves: ['stringshot']},
			{species: 'Raichu', ability: 'lightningrod', moves: ['growl']},
			{species: 'Jirachi', ability: 'serenegrace', moves: ['healingwish']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['endeavor']},
			{species: 'Tyranitar', ability: 'sandstream', moves: ['seismictoss', 'stealthrock']},
		]});

		battle.makeChoices('move String Shot', 'move Endeavor'); // set Caterpie to 1hp

		battle.makeChoices('switch Raichu', 'switch Tyranitar'); // set up Sand

		battle.makeChoices('move Growl', 'move Stealth Rock');

		battle.makeChoices('switch Jirachi', 'move Seismic Toss');

		battle.makeChoices('move Healing Wish', 'move Seismic Toss');

		battle.makeChoices('switch Caterpie', ''); // Caterpie faints from hazards
		assert.equal(battle.p1.active[0].hp, 0);

		battle.makeChoices('switch Raichu', ''); // Raichu fully heals and takes stoss + Sandstorm damage
		assert.equal(battle.turn, 6);
		assert.equal(battle.p1.active[0].hp, 145); // after stoss + Sandstorm
		assert.equal(battle.p1.active[0].moveSlots[0].pp, 63);
	});
});
