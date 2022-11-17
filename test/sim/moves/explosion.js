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

	it(`[Gen 1] Explosion should build rage, even if it misses`, function () {
		// Explosion hits
		battle = common.gen(1).createBattle([[
			{species: 'golem', moves: ['explosion']},
		], [
			{species: 'aerodactyl', moves: ['rage']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-boost|')));

		// Explosion misses
		battle = common.gen(1).createBattle({seed: [2, 2, 2, 2]}, [[
			{species: 'golem', moves: ['splash', 'explosion']},
		], [
			{species: 'aerodactyl', moves: ['sandattack', 'rage']},
		]]);
		for (let i = 0; i < 6; i++) {
			battle.makeChoices();
		}
		battle.makeChoices('move explosion', 'move rage');
		assert(battle.log.some(line => line.startsWith('|-boost|')));

		// Explosion misses against a Ghost-type
		battle = common.gen(1).createBattle([[
			{species: 'golem', moves: ['explosion']},
		], [
			{species: 'gastly', moves: ['rage']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-boost|')));
	});
});
