'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Acupressure', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be able to target an ally in doubles`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['acupressure']},
			{species: 'Smoochum', moves: ['sleeptalk']},
		], [
			{species: 'Clamperl', moves: ['sleeptalk']},
			{species: 'Whismur', moves: ['sleeptalk']},
		]]);

		assert.false.cantMove(() => battle.choose('p1', 'move acupressure -2, move sleeptalk'));
	});

	it(`should be unable to target any opponent in free-for-alls`, function () {
		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'Wynaut', moves: ['acupressure']},
		], [
			{species: 'Cufant', moves: ['sleeptalk']},
		], [
			{species: 'Qwilfish', moves: ['sleeptalk']},
		], [
			{species: 'Marowak', moves: ['sleeptalk']},
		]]);

		assert.cantMove(() => battle.choose('p1', 'move acupressure 1'));
		assert.cantMove(() => battle.choose('p1', 'move acupressure 2'));
		assert.cantMove(() => battle.choose('p1', 'move acupressure -2'));
	});

	// https://www.smogon.com/forums/threads/acupressure-targeting.3733779/post-9920405
	it(`should redirect to the user if a targetted ally faints`, () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Pincurchin', moves: ['acupressure']},
			{species: 'Flutter Mane', moves: ['memento']},
		], [
			{species: 'Furret', moves: ['sleeptalk']},
			{species: 'Chien-Pao', moves: ['haze']},
		]]);

		battle.makeChoices('move acupressure -2, move memento 1', 'auto');
		assert(Object.values(battle.p1.active[0].boosts).some(n => n === 2));
		battle.makeChoices('move acupressure -2, pass', 'auto');
		assert(Object.values(battle.p1.active[0].boosts).some(n => n === 2));
	});

	it(`in Gen 5, should not redirect to the uesr if a targetted ally faints`, () => {
		battle = common.gen(5).createBattle({gameType: 'doubles'}, [[
			{species: 'Shuckle', moves: ['acupressure']},
			{species: 'Dugtrio', moves: ['memento']},
		], [
			{species: 'Marshtomp', moves: ['sleeptalk']},
			{species: 'Nincada', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move acupressure -2, move memento 1', 'auto');
		assert(Object.values(battle.p1.active[0].boosts).every(n => n === 0));
		battle.makeChoices('move acupressure -2, pass', 'auto');
		assert(Object.values(battle.p1.active[0].boosts).every(n => n === 0));
	});
});
