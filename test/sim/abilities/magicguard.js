'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent all non-attack damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', item: 'lifeorb', moves: ['doubleedge', 'mindblown', 'highjumpkick']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Crobat', ability: 'roughskin', moves: ['spikes', 'toxic', 'protect']}]});
		battle.makeChoices('move splash', 'move spikes');
		battle.makeChoices('switch 2', 'move toxic');
		assert.equal(battle.p1.active[0].status, 'tox');
		assert.fullHP(battle.p1.active[0]);
		battle.makeChoices('move mindblown', 'move toxic');
		battle.makeChoices('move doubleedge', 'move spikes');
		battle.makeChoices('move highjumpkick', 'move protect');
		assert.fullHP(battle.p1.active[0]);
	});

	it(`should prevent Leech Seed's healing effect`, function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Clefable', ability: 'magicguard', moves: ['moonblast']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Ferrothorn', ability: 'noguard', moves: ['leechseed']},
		]});
		battle.makeChoices('move moonblast', 'move leechseed');
		assert.fullHP(battle.p1.active[0]);
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', moves: ['doubleedge']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['stealthrock', 'roar']}]});
		battle.makeChoices('move splash', 'move stealthrock');
		battle.makeChoices('move splash', 'move roar');
		assert.fullHP(battle.p1.active[0]);
	});
});
