'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Simple', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should double all stat boosts', () => {
		battle = common.createBattle([[
			{ species: "Bibarel", ability: 'simple', moves: ['curse'] },
		], [
			{ species: "Gyarados", ability: 'moxie', moves: ['splash'] },
		]]);
		battle.makeChoices('move curse', 'move splash');
		const defender = battle.p1.active[0];
		assert.statStage(defender, 'atk', 2);
		assert.statStage(defender, 'def', 2);
		assert.statStage(defender, 'spe', -2);
	});
});

describe('Simple [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should double the effect of stat boosts', () => {
		battle = common.gen(4).createBattle([[
			{ species: "Bibarel", ability: 'simple', moves: ['defensecurl'] },
		], [
			{ species: "Gyarados", ability: 'moxie', moves: ['splash'] },
		]]);
		const defender = battle.p1.active[0];
		assert.sets(() => defender.getStat('def'), 2 * defender.getStat('def'), () => battle.makeChoices('move defensecurl', 'move splash'));
		assert.statStage(defender, 'def', 1);
	});

	it('should double the effect of stat boosts passed by Baton Pass', () => {
		battle = common.gen(4).createBattle([[
			{ species: "Sableye", ability: 'prankster', moves: ['batonpass'] },
			{ species: "Bibarel", ability: 'simple', moves: ['protect'] },
		], [
			{ species: "Gyarados", ability: 'intimidate', moves: ['splash'] },
		]]);
		battle.makeChoices('move batonpass', 'move splash');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[0].boosts['atk'], -1);
		assert.equal(battle.p1.active[0].getStat('atk'), Math.floor(0.5 * battle.p1.active[0].getStat('atk', true)));
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.gen(4).createBattle([[
			{ species: "Bibarel", ability: 'simple', moves: ['defensecurl'] },
		], [
			{ species: "Haxorus", ability: 'moldbreaker', item: 'laggingtail', moves: ['earthquake'] },
		]]);
		const defender = battle.p1.active[0];
		battle.makeChoices('move defensecurl', 'move earthquake');
		assert.bounded(defender.maxhp - defender.hp, [102, 120]);
	});
});
