'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Anger Point', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should maximize Attack when hit by a critical hit', function () {
		battle = common.createBattle([[
			{species: "Cryogonal", ability: 'noguard', moves: ['frostbreath']},
		], [
			{species: "Primeape", ability: 'angerpoint', moves: ['endure']},
		]]);
		const angerMon = battle.p2.active[0];

		battle.makeChoices();
		assert.statStage(angerMon, 'atk', 6);
	});

	it('should maximize Attack when hit by a critical hit even if the foe has Mold Breaker', function () {
		battle = common.createBattle([[
			{species: "Haxorus", ability: 'moldbreaker', item: 'scopelens', moves: ['focusenergy', 'falseswipe']},
		], [
			{species: "Primeape", ability: 'angerpoint', moves: ['defensecurl']},
		]]);
		const angerMon = battle.p2.active[0];

		battle.makeChoices('move focusenergy', 'move defensecurl');
		battle.makeChoices('move falseswipe', 'move defensecurl');
		assert.statStage(angerMon, 'atk', 6);
	});

	it('should not maximize Attack when dealing a critical hit', function () {
		battle = common.createBattle([[
			{species: "Cryogonal", ability: 'noguard', moves: ['endure']},
		], [
			{species: "Primeape", ability: 'angerpoint', moves: ['stormthrow']},
		]]);
		const [defender, angerMon] = [battle.p1.active[0], battle.p2.active[0]];

		battle.makeChoices('move endure', 'move stormthrow');
		assert.statStage(defender, 'atk', 0);
		assert.statStage(angerMon, 'atk', 0);
	});

	it('should not maximize Attack when behind a substitute', function () {
		battle = common.createBattle([[
			{species: "Cryogonal", ability: 'noguard', item: 'laggingtail', moves: ['frostbreath']},
		], [
			{species: "Primeape", ability: 'angerpoint', moves: ['substitute']},
		]]);
		const angerMon = battle.p2.active[0];

		battle.makeChoices('move frostbreath', 'move substitute');
		assert.statStage(angerMon, 'atk', 0);
	});
});
