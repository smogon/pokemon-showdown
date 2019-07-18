'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flash Fire', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Fire-type moves and increase Fire-type attacks by 50% once activated', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]});
		const [flashMon, foePokemon] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move incinerate', 'move flareblitz');
		assert.fullHP(flashMon);
		let damage = foePokemon.maxhp - foePokemon.hp;
		assert.bounded(damage, [82, 97]);
	});

	it('should grant Fire-type immunity even if the user is frozen', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]});
		const flashMon = battle.p1.active[0];
		flashMon.setStatus('frz');
		assert.false.hurts(flashMon, () => battle.makeChoices('move sleeptalk', 'move flareblitz'));
	});

	it('should have its Fire-type immunity suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['firepunch']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move incinerate', 'move firepunch'));
	});

	it('should lose the Flash Fire boost if its ability is changed', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk', 'incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Talonflame', ability: 'galewings', moves: ['incinerate', 'worryseed']}]});
		battle.makeChoices('move sleeptalk', 'move incinerate');
		battle.resetRNG();
		battle.makeChoices('move incinerate', 'move worryseed');
		let damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.bounded(damage, [54, 65]);
	});
});

describe('Flash Fire [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	// TODO: Check if this is actually a behavior in Gen 3-4
	it.skip('should grant Fire-type immunity even if the user is frozen', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Charizard', ability: 'blaze', moves: ['flamethrower']}]});
		const flashMon = battle.p1.active[0];
		flashMon.setStatus('frz');
		assert.false.hurts(flashMon, () => battle.makeChoices('move sleeptalk', 'move flamethrower'));
	});
});
