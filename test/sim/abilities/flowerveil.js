
'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flower Veil', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not stop an ally from falling asleep when Yawn was already affecting it', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Breloom', moves: ['sleeptalk']},
			{species: 'Heatran', moves: ['sleeptalk']},
			{species: 'Florges', ability: 'flowerveil', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Persian', moves: ['sleeptalk', 'yawn']},
			{species: 'Raticate', moves: ['sleeptalk']},
		]});

		battle.makeChoices('move sleeptalk, move sleeptalk', 'move yawn 1, move sleeptalk');
		battle.makeChoices('move sleeptalk, switch 3', 'move sleeptalk, move sleeptalk');
		const breloom = battle.p1.active[0];
		assert(breloom.status === 'slp');
	});
});
