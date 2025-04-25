'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flash Fire', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should grant immunity to Fire-type moves and increase Fire-type attacks by 50% once activated', () => {
		battle = common.createBattle([[
			{ species: 'Heatran', ability: 'flashfire', moves: ['incinerate'] },
		], [
			{ species: 'Talonflame', ability: 'galewings', moves: ['flareblitz'] },
		]]);
		const [flashMon, foePokemon] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move incinerate', 'move flareblitz');
		assert.fullHP(flashMon);
		const damage = foePokemon.maxhp - foePokemon.hp;
		assert.bounded(damage, [82, 97]);
	});

	it('should grant Fire-type immunity even if the user is frozen', () => {
		battle = common.createBattle([[
			{ species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk'] },
		], [
			{ species: 'Talonflame', ability: 'galewings', moves: ['flareblitz'] },
		]]);
		const flashMon = battle.p1.active[0];
		flashMon.setStatus('frz');
		assert.false.hurts(flashMon, () => battle.makeChoices('move sleeptalk', 'move flareblitz'));
	});

	it('should have its Fire-type immunity suppressed by Mold Breaker', () => {
		battle = common.createBattle([[
			{ species: 'Heatran', ability: 'flashfire', moves: ['incinerate'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', moves: ['firepunch'] },
		]]);
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move incinerate', 'move firepunch'));
	});

	it(`should lose the Flash Fire boost if its ability is changed`, () => {
		battle = common.createBattle([[
			{ species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk', 'incinerate'] },
		], [
			{ species: 'Talonflame', ability: 'shellarmor', moves: ['flamethrower', 'worryseed'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move flamethrower');
		battle.makeChoices('move incinerate', 'move worryseed');
		const talonflame = battle.p2.active[0];
		const damage = talonflame.maxhp - talonflame.hp;
		assert.bounded(damage, [54, 65]);
	});
});

describe('Flash Fire [Gen 3-4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should activate and grant Fire-type immunity even if the user is frozen in Gen 3', () => {
		battle = common.gen(3).createBattle([[
			{ species: 'Arcanine', ability: 'flashfire', moves: ['sleeptalk'] },
		], [
			{ species: 'Charizard', ability: 'blaze', moves: ['flamethrower'] },
		]]);
		const flashFireMon = battle.p1.active[0];
		flashFireMon.setStatus('frz');
		battle.makeChoices();
		assert.notEqual(flashFireMon.hp, flashFireMon.maxhp);
	});

	it('should activate and grant Fire-type immunity even if the user is frozen in Gen 4', () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk'] },
		], [
			{ species: 'Charizard', ability: 'blaze', moves: ['flamethrower'] },
		]]);
		const flashFireMon = battle.p1.active[0];
		flashFireMon.setStatus('frz');
		battle.makeChoices();
		assert.false.fullHP(flashFireMon);
	});
});
