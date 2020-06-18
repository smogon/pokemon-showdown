'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Explosion', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not halve defense in current gens', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Metagross", nature: "Adamant", moves: ['explosion']}]});
		battle.setPlayer('p2', {team: [{species: "Hippowdon", nature: "Impish", evs: {hp: 252, def: 252}, moves: ['splash']}]});
		battle.makeChoices('move explosion', 'move splash');
		const hippo = battle.p2.active[0];
		const damage = hippo.maxhp - hippo.hp;
		assert.bounded(damage, [164, 193]);
	});

	it('should halve defense in old gens', function () {
		battle = common.gen(4).createBattle();
		battle.setPlayer('p1', {team: [{species: "Metagross", nature: "Adamant", moves: ['explosion']}]});
		battle.setPlayer('p2', {team: [{species: "Hippowdon", nature: "Impish", evs: {hp: 252, def: 252}, moves: ['splash']}]});
		battle.makeChoices('move explosion', 'move splash');
		const hippo = battle.p2.active[0];
		const damage = hippo.maxhp - hippo.hp;
		assert.bounded(damage, [327, 385]);
	});
});
