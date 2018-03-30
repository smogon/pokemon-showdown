'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Simple', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double all stat boosts', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Bibarel", ability: 'simple', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'moxie', moves: ['splash']}]);
		battle.makeChoices('move curse', 'move splash');
		const target = battle.p1.active[0];
		assert.statStage(target, 'atk', 2);
		assert.statStage(target, 'def', 2);
		assert.statStage(target, 'spe', -2);
	});
});

describe('Simple [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double the effect of stat boosts', function () {
		battle = common.gen(4).createBattle([
			[{species: "Bibarel", ability: 'simple', moves: ['defensecurl']}],
			[{species: "Gyarados", ability: 'moxie', moves: ['splash']}],
		]);
		const target = battle.p1.active[0];
		assert.sets(() => target.getStat('def'), 2 * target.getStat('def'), () => battle.makeChoices('move defensecurl', 'move splash'));
		assert.statStage(target, 'def', 1);
	});

	it('should double the effect of stat boosts passed by Baton Pass', function () {
		battle = common.gen(4).createBattle([
			[{species: "Sableye", ability: 'prankster', moves: ['batonpass']}, {species: "Bibarel", ability: 'simple', moves: ['protect']}],
			[{species: "Gyarados", ability: 'intimidate', moves: ['splash']}],
		]);
		battle.makeChoices('move batonpass', 'move splash');
		battle.makeChoices('switch 2', 'move splash');
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p1.active[0].getStat('atk'), Math.floor(0.5 * battle.p1.active[0].getStat('atk', true)));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.gen(4).createBattle([
			[{species: "Bibarel", ability: 'simple', moves: ['defensecurl']}],
			[{species: "Haxorus", ability: 'moldbreaker', item: 'laggingtail', moves: ['earthquake']}],
		]);
		const target = battle.p1.active[0];
		battle.makeChoices('move defensecurl', 'move earthquake');
		assert.bounded(target.maxhp - target.hp, [102, 120]);
	});
});
