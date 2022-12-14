'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weather damage calculation', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should multiply the damage (not the basePower) in favorable weather', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Ninetales', ability: 'drought', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]});
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 152, () => battle.makeChoices('move incinerate', 'move splash'));
		const move = Dex.moves.get('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should reduce the damage (not the basePower) in unfavorable weather', function () {
		battle = common.createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Ninetales', ability: 'drizzle', moves: ['incinerate']}]});
		battle.setPlayer('p2', {team: [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]});
		const attacker = battle.p1.active[0];
		const defender = battle.p2.active[0];
		assert.hurtsBy(defender, 50, () => battle.makeChoices('move incinerate', 'move splash'));
		const move = Dex.moves.get('incinerate');
		const basePower = battle.runEvent('BasePower', attacker, defender, move, move.basePower, true);
		assert.equal(basePower, move.basePower);
	});

	it('should make Hail/Sandstorm damage some pokemon but not others', function () {
		battle = common.gen(8).createBattle();
		battle.randomizer = dmg => dmg; // max damage
		battle.setPlayer('p1', {team: [{species: 'Abomasnow', ability: 'snowwarning', moves: ['protect']}]});
		battle.setPlayer('p2', {team: [{species: 'Sandslash', ability: 'sandveil', moves: ['protect']}]});
		battle.makeChoices('move protect', 'move protect');
		const p1active = battle.p1.active[0];
		const p2active = battle.p2.active[0];
		assert.equal(p1active.hp, p1active.maxhp);
		assert.notEqual(p2active.hp, p2active.maxhp);
	});

	it(`should wear off on the final turn before weather effects are applied`, function () {
		battle = common.createBattle([[
			{species: 'Tyranitar', ability: 'sandstream', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		for (let i = 0; i < 5; i++) battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.equal(wynaut.hp, wynaut.maxhp - (Math.floor(wynaut.maxhp / 16) * 4));
	});

	it(`should wear off before future attacks`, function () {
		battle = common.createBattle([[
			{species: 'Tyranitar', ability: 'sandstream', moves: ['doomdesire', 'soak']},
		], [
			{species: 'Roggenrola', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices('move soak', 'auto');
		const log = battle.getDebugLog();
		const sandDamageIndex = log.indexOf('[from] Sandstorm');
		const futureDamageIndex = log.indexOf('|-end|p2a: Roggenrola|move: Doom Desire');
		assert(sandDamageIndex < futureDamageIndex, `Sandstorm should have dealt damage before Doom Desire`);
	});

	it(`should run residual weather effects in order of Speed`, function () {
		battle = common.createBattle([[
			{species: 'Sunkern', ability: 'solarpower', moves: ['sunnyday']},
		], [
			{species: 'Charizard', ability: 'dryskin', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const log = battle.getDebugLog();
		const drySkinIndex = log.indexOf('ability: Dry Skin');
		const solarPowerIndex = log.indexOf('ability: Solar Power');
		assert(drySkinIndex < solarPowerIndex, `Charizard should be damaged before Sunkern, because it is faster`);
	});
});
