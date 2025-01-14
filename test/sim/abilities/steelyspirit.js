'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Steely Spirit', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost Steel-type moves for its ally and itself', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'aron', ability: 'steelyspirit', moves: ['ironhead']},
			{species: 'aron', moves: ['ironhead']},
		], [
			{species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk']},
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move ironhead 1, move ironhead 2', 'auto');
		const wynautLeft = battle.p2.active[0];
		let damage = wynautLeft.maxhp - wynautLeft.hp;
		assert.bounded(damage, [172, 204]);

		const wynautRight = battle.p2.active[1];
		damage = wynautRight.maxhp - wynautRight.hp;
		assert.bounded(damage, [172, 204]);
	});

	it('should stack with itself', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'aron', ability: 'steelyspirit', moves: ['ironhead']},
			{species: 'aron', ability: 'steelyspirit', moves: ['ironhead']},
		], [
			{species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk']},
			{species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move ironhead 1, move ironhead 2', 'auto');
		const wynautLeft = battle.p2.active[0];
		let damage = wynautLeft.maxhp - wynautLeft.hp;
		assert.bounded(damage, [258, 304]);

		const wynautRight = battle.p2.active[1];
		damage = wynautRight.maxhp - wynautRight.hp;
		assert.bounded(damage, [258, 304]);
	});
});
