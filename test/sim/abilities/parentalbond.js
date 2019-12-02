'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let basePowers;

describe('Parental Bond', function () {
	beforeEach(function () {
		battle = common.createBattle([
			[{species: 'Kangaskhan', ability: 'parentalbond', item: 'normaliumz', moves: ['falseswipe', 'doublehit']}],
			[{species: 'Aggron', ability: 'noguard', moves: ['rest']}],
		]);

		basePowers = [];
		battle.onEvent('BasePower', battle.format, -9, function (bp, attacker, defender, move) {
			basePowers.push(this.modify(bp, this.event.modifier));
		});
	});

	afterEach(function () {
		battle.destroy();
	});

	it('should cause single-hit attacks to strike twice, with the second hit at 0.25 power', function () {
		battle.makeChoices('move falseswipe', 'move rest');
		assert.deepStrictEqual(basePowers, [40, 10]);
	});

	it('should not have any effect on moves with multiple hits', function () {
		battle.makeChoices('move doublehit', 'move rest');
		assert.deepStrictEqual(basePowers, [35, 35]);
	});

	it('should not have any effect Z-Moves', function () {
		battle.makeChoices('move falseswipe zmove', 'move rest');
		assert.deepStrictEqual(basePowers, [100]);
	});
});

describe('Parental Bond [Gen 6]', function () {
	beforeEach(function () {
		battle = common.gen(6).createBattle([
			[{species: 'Kangaskhan', ability: 'parentalbond', moves: ['falseswipe', 'doublehit']}],
			[{species: 'Aggron', ability: 'noguard', moves: ['rest']}],
		]);

		basePowers = [];
		battle.onEvent('BasePower', battle.format, -9, function (bp, attacker, defender, move) {
			basePowers.push(this.modify(bp, this.event.modifier));
		});
	});

	afterEach(function () {
		battle.destroy();
	});

	it('should cause single-hit attacks to strike twice, with the second hit at 0.5 power', function () {
		battle.makeChoices('move falseswipe', 'move rest');
		assert.deepStrictEqual(basePowers, [40, 20]);
	});

	it('should not have any effect on moves with multiple hits', function () {
		battle.makeChoices('move doublehit', 'move rest');
		assert.deepStrictEqual(basePowers, [35, 35]);
	});
});
