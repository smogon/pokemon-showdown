'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Thief', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should steal most items', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['thief']}]});
		battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]});
		battle.makeChoices('move thief', 'move softboiled');
		assert.equal(battle.p1.active[0].item, 'shedshell');
	});

	it('should not steal items if it is holding an item', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'focussash', moves: ['thief']}]});
		battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]});
		battle.makeChoices('move thief', 'move softboiled');
		assert.equal(battle.p2.active[0].item, 'shedshell');
	});

	it('should take Life Orb damage from a stolen Life Orb', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['thief']}]});
		battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'naturalcure', item: 'lifeorb', moves: ['softboiled']}]});
		battle.makeChoices('move thief', 'move softboiled');
		assert.equal(battle.p1.active[0].hp, Math.ceil(9 / 10 * battle.p1.active[0].maxhp));
	});
});
