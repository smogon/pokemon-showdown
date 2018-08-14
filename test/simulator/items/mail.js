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
		battle.join('p1', 'Guest 1', 1, [{species: 'Blissey', ability: 'naturalcure', item: 'mail', moves: ['softboiled']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Fennekin', ability: 'magician', moves: ['grassknot']},
			{species: 'Abra', ability: 'synchronize', moves: ['trick']},
			{species: 'Lopunny', ability: 'klutz', moves: ['switcheroo']},
		]);
		const holder = battle.p1.active[0];
		assert.constant(() => holder.item, () => battle.makeChoices('move softboiled', 'move grassknot'));
		battle.makeChoices('move softboiled', 'switch 2');
		assert.constant(() => holder.item, () => battle.makeChoices('move softboiled', 'move trick'));
		battle.makeChoices('move softboiled', 'switch 2');
		assert.constant(() => holder.item, () => battle.makeChoices('move softboild', 'move switcheroo'));
	});

	it('should not be removed by Fling', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'mail', moves: ['fling']}]);
		const holder = battle.p2.active[0];
		assert.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move fling'));
	});

	it('should be removed by Knock Off', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['knockoff']}]);
		const holder = battle.p1.active[0];
		assert.false.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move knockoff'));
	});

	it('should be stolen by Thief', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['thief']}]);
		const holder = battle.p1.active[0];
		assert.false.constant(() => holder.item, () => battle.makeChoices('move swordsdance', 'move thief'));
	});
});
