'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Metronome (item)', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should increase the damage of moves that have been used successfully and consecutively`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'metronome', moves: ['psystrike']},
		], [
			{species: 'cleffa', evs: {hp: 252}, ability: 'shellarmor', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const cleffa = battle.p2.active[0];
		const hpAfterOneAttack = cleffa.hp;
		battle.makeChoices();
		const damage = hpAfterOneAttack - cleffa.hp;
		assert.bounded(damage, [115, 137]);
	});

	it(`should reset the multiplier after switching moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'metronome', moves: ['psystrike', 'sleeptalk']},
		], [
			{species: 'cleffa', evs: {hp: 252}, ability: 'shellarmor', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const cleffa = battle.p2.active[0];
		const hpAfterOneAttack = cleffa.hp;
		battle.makeChoices('move sleeptalk', 'auto');
		battle.makeChoices();
		const damage = hpAfterOneAttack - cleffa.hp;
		assert.bounded(damage, [96, 114]);
	});

	it(`should reset the multiplier after hitting Protect`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'metronome', moves: ['psystrike']},
		], [
			{species: 'cleffa', evs: {hp: 252}, ability: 'shellarmor', moves: ['sleeptalk', 'protect']},
		]]);
		battle.makeChoices();
		const cleffa = battle.p2.active[0];
		const hpAfterOneAttack = cleffa.hp;
		battle.makeChoices('auto', 'move protect');
		battle.makeChoices();
		const damage = hpAfterOneAttack - cleffa.hp;
		assert.bounded(damage, [96, 114]);
	});

	it.skip(`should instantly start moves that use a charging turn at Metronome 1 boost level, then increase linearly`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'metronome', moves: ['solarbeam']},
		], [
			{species: 'cleffa', evs: {hp: 252}, ability: 'shellarmor', moves: ['softboiled']},
		]]);
		battle.makeChoices();
		battle.makeChoices();
		const cleffa = battle.p2.active[0];
		let damage = cleffa.maxhp - cleffa.hp;
		assert.bounded(damage, [59, 70], `Solar Beam should be Metronome 1 boosted`);

		battle.makeChoices();
		battle.makeChoices();
		damage = cleffa.maxhp - cleffa.hp;
		assert.bounded(damage, [69, 81], `Solar Beam should be Metronome 2 boosted`);
	});

	it.skip(`should use called moves to determine the Metronome multiplier`, function () {
		battle = common.createBattle([[
			{species: 'goomy', item: 'metronome', moves: ['copycat', 'surf']},
		], [
			{species: 'clefable', evs: {hp: 252}, ability: 'shellarmor', moves: ['softboiled', 'surf']},
		]]);
		battle.makeChoices('move copycat', 'move surf');
		const clefable = battle.p2.active[0];
		let damage = clefable.maxhp - clefable.hp;
		assert.bounded(damage, [45, 53], `Surf should not be Metronome boosted`);

		const hpAfterOneAttack = clefable.hp;
		battle.makeChoices('move copycat', 'move surf');
		damage = hpAfterOneAttack - clefable.hp;
		assert.bounded(damage, [54, 64], `Surf should be Metronome 1 boosted`);

		battle.makeChoices('move surf', 'move softboiled');
		damage = clefable.maxhp - clefable.hp;
		assert.bounded(damage, [63, 74], `Surf should be Metronome 2 boosted`);
	});
});
