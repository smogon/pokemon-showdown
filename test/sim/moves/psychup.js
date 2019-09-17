'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Psych Up', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should copy the opponent\'s crit ratio', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Palkia', level: 100, moves: ['sleeptalk', 'focusenergy', 'psychup', 'laserfocus']},
			{species: 'Smeargle', level: 1, moves: ['laserfocus', 'sleeptalk', 'focusenergy']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
		]});
		const palkia = battle.p1.active[0];

		battle.makeChoices('move focusenergy, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(!palkia.volatiles['focusenergy'], "A pokemon should lose a Focus Energy boost if the target of Psych Up does not have a Focus Energy boost.");

		battle.makeChoices('move sleeptalk, move focusenergy', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(palkia.volatiles['focusenergy'], "A pokemon should gain a Focus Energy boost if the target of Psych Up has a Focus Energy boost.");

		battle.makeChoices('move laserfocus, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(!palkia.volatiles['laserfocus'], "A pokemon should lose a Laser Focus boost if the target of Psych Up does not have a Laser Focus boost.");

		battle.makeChoices('move sleeptalk, move laserfocus', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(palkia.volatiles['laserfocus'], "A pokemon should gain a Laser Focus boost if the target of Psych Up has a Laser Focus boost.");
	});

	it('should copy both positive and negative stat changes', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Palkia', level: 100, moves: ['sleeptalk', 'psychup']},
			{species: 'Smeargle', level: 1, moves: ['sleeptalk', 'swordsdance', 'featherdance']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
		]});
		const palkia = battle.p1.active[0];

		battle.makeChoices('move sleeptalk, move swordsdance', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.statStage(palkia, 'atk', 2, "A pokemon should copy the target's positive stat changes when using Psych Up.");

		battle.makeChoices('move sleeptalk, move featherdance 1', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.statStage(palkia, 'atk', -2, "A pokemon should copy the target's negative stat changes when using Psych Up.");
	});
});

describe('Psych Up [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not copy the opponent\'s crit ratio', function () {
		battle = common.gen(5).createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Palkia', level: 100, moves: ['sleeptalk', 'focusenergy', 'psychup']},
			{species: 'Smeargle', level: 1, moves: ['sleeptalk', 'focusenergy']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
			{species: 'Suicune', level: 1, moves: ['sleeptalk']},
		]});
		const palkia = battle.p1.active[0];

		battle.makeChoices('move sleeptalk, move focusenergy', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup -2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(!palkia.volatiles['focusenergy'], "A pokemon should not gain a Focus Energy boost when using Psych Up.");

		battle.makeChoices('move focusenergy, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move psychup 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(palkia.volatiles['focusenergy'], "A pokemon should not lose a Focus Energy boost when using Psych Up.");
	});
});
