'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sleep Talk', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should run conditions for submove', () => {
		battle = common.createBattle([[
			{ species: 'snorlax', ability: 'noguard', moves: ['sleeptalk', 'highjumpkick'] },
		], [
			{ species: 'breloom', moves: ['spore', 'gravity'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move gravity');
		battle.makeChoices('move sleeptalk', 'move spore');
		assert.fullHP(battle.p2.active[0]);
		assert(battle.log[battle.lastMoveLine + 1].startsWith('|cant'), 'should log that High Jump Kick failed');
	});

	it('should fail and lose PP on subsequent turns while Choice locked, prior to Gen 5', () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Breloom', moves: ['spore', 'snore'] },
		], [
			{ species: 'Chansey', item: 'choiceband', moves: ['sleeptalk', 'pound'] },
		]]);
		const breloom = battle.p1.active[0];
		const chansey = battle.p2.active[0];
		const move = chansey.getMoveData(Dex.moves.get('sleeptalk'));
		battle.makeChoices('move spore', 'move sleeptalk');
		assert.false.fullHP(breloom);
		assert.equal(move.pp, move.maxpp - 1);

		// Ensure Chansey will not wake up
		chansey.statusState.time = 6;
		const hp = breloom.hp;
		battle.makeChoices('move snore', 'move sleeptalk');
		assert.equal(chansey.status, 'slp');
		assert.equal(breloom.hp, hp);
		assert.equal(move.pp, move.maxpp - 2);
	});
});
