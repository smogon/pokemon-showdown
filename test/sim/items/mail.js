'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mail', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not be stolen by most moves or abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Blissey', ability: 'naturalcure', item: 'mail', moves: ['softboiled']}]});
		battle.setPlayer('p2', {team: [
			{species: 'Fennekin', ability: 'magician', moves: ['grassknot']},
			{species: 'Abra', ability: 'synchronize', moves: ['trick']},
			{species: 'Lopunny', ability: 'klutz', moves: ['switcheroo']},
		]});
		const holder = battle.p1.active[0];
		assert.constant(() => holder.item, () => battle.makeChoices('move softboiled', 'move grassknot'));
		battle.makeChoices('move softboiled', 'switch 2');
		assert.constant(() => holder.item, () => battle.makeChoices('move softboiled', 'move trick'));
		battle.makeChoices('move softboiled', 'switch 3');
		assert.constant(() => holder.item, () => battle.makeChoices('move softboiled', 'move switcheroo'));
	});

	it('should not be removed by Fling', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pangoro', ability: 'ironfist', moves: ['swordsdance']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', item: 'mail', moves: ['fling']}]});
		const holder = battle.p2.active[0];
		assert.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move fling'));
	});

	it('should be removed by Knock Off', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', moves: ['knockoff']}]});
		const holder = battle.p1.active[0];
		assert.false.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move knockoff'));
	});

	it('should be stolen by Thief', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]});
		battle.setPlayer('p2', {team: [{species: 'Abra', ability: 'synchronize', moves: ['thief']}]});
		const holder = battle.p1.active[0];
		assert.false.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move thief'));
	});
});
