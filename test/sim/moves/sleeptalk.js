'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep Talk', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should run conditions for submove', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'snorlax', moves: ['sleeptalk', 'highjumpkick']}]});
		battle.setPlayer('p2', {team: [{species: 'breloom', moves: ['spore', 'gravity']}]});
		battle.makeChoices('move sleeptalk', 'move gravity');
		battle.makeChoices('move sleeptalk', 'move spore');
		assert.fullHP(battle.p2.active[0]);
		assert.match(battle.log[battle.lastMoveLine + 1], /^\|cant.*move: Gravity|High Jump Kick$/, 'should log that High Jump Kick failed');
	});

	it('should fail and lose PP on subsequent turns while Choice locked, prior to Gen 5', function () {
		battle = common.gen(4).createBattle({seed: [1, 1, 1, 1]}, [[
			{species: 'Breloom', moves: ['spore', 'snore']},
		], [
			{species: 'Chansey', item: 'choiceband', moves: ['sleeptalk', 'pound']},
		]]);
		const breloom = battle.p1.active[0];
		const chansey = battle.p2.active[0];
		const move = chansey.getMoveData(Dex.moves.get('sleeptalk'));
		battle.makeChoices('move spore', 'move sleeptalk');
		assert.false.fullHP(breloom);
		assert.equal(move.pp, move.maxpp - 1);
		const hp = breloom.hp;
		battle.makeChoices('move snore', 'move sleeptalk');
		assert.equal(chansey.status, 'slp');
		assert.equal(breloom.hp, hp);
		assert.equal(move.pp, move.maxpp - 2);
	});
});
