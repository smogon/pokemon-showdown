'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Ingrain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal the user by 1/16 of its max HP at the end of each turn', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Cradily', ability: 'prankster', moves: ['ingrain', 'batonpass']},
			{species: 'Lileep', ability: 'stormdrain', moves: ['ingrain', 'uturn']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Miltank', ability: 'thickfat', moves: ['seismictoss', 'protect']},
		]});
		battle.makeChoices('move ingrain', 'move seismictoss');
		assert.equal(battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp * 17 / 16) - 100);

		// should be passed by Baton Pass
		battle.makeChoices('move batonpass', 'move seismictoss');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp * 17 / 16) - 100);

		// should not be passed by U-turn
		battle.makeChoices('move uturn', 'move seismictoss');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp * 17 / 16) - 100);

		// should be gone after switching out and back in
		battle.makeChoices('switch 2', 'move protect');
		assert.equal(battle.p1.active[0].hp, Math.floor(battle.p1.active[0].maxhp * 17 / 16) - 200);
	});

	it('should prevent the user from being forced out or switching out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Cradily', ability: 'stormdrain', moves: ['ingrain']},
			{species: 'Pikachu', ability: 'static', moves: ['thunder']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Arcanine', ability: 'flashfire', moves: ['sleeptalk', 'roar']}]});
		battle.makeChoices('move ingrain', 'move roar');
		assert.equal(battle.p1.active[0].species.id, 'cradily');
		assert.trapped(() => battle.makeChoices('switch pikachu', 'move sleeptalk'));
		assert.equal(battle.p1.active[0].species.id, 'cradily');
	});

	it('should remove the users\' Ground immunities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Tropius', ability: 'harvest', moves: ['earthquake', 'ingrain']}]});
		battle.setPlayer('p2', {team: [{species: 'Carnivine', ability: 'levitate', moves: ['earthquake', 'ingrain']}]});
		battle.makeChoices('move ingrain', 'move ingrain');
		battle.makeChoices('move earthquake', 'move earthquake');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
