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

	describe('[Gen 4]', () => {
		it('should fail and lose PP on subsequent turns while Choice locked', () => {
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

	describe('[Gen 3]', () => {
		it('should not update the persistent sleep timer', () => {
			battle = common.gen(3).createBattle({ seed: [0, 0, 0, 2] }, [[
				{ species: 'Xatu', ability: 'synchronize', moves: ['sleeptalk', 'calmmind'] },
				{ species: 'Magikarp', moves: ['splash'] },
			], [
				{ species: 'Smeargle', moves: ['spore', 'splash'] },
			]]);
			const xatu = battle.p1.active[0];
			battle.makeChoices('move calmmind', 'move spore');
			assert.equal(xatu.statusState.time, 5);

			battle.makeChoices('move calmmind', 'move splash');
			assert.equal(xatu.status, 'slp');
			assert.statStage(xatu, 'spa', 1);
			for (let i = 0; i < 3; i++) battle.makeChoices('move sleeptalk', 'move splash');
			assert.equal(xatu.status, 'slp');
			battle.makeChoices('switch 2', 'move splash');
			battle.makeChoices('switch 2', 'move splash');

			// Only the ordinary sleep turn persists, leaving three sleeping turns.
			for (let i = 0; i < 3; i++) battle.makeChoices('move calmmind', 'move splash');
			assert.equal(xatu.status, 'slp');
			assert.statStage(xatu, 'spa', 0);

			battle.makeChoices('move calmmind', 'move splash');
			assert.equal(xatu.status, '');
			assert.statStage(xatu, 'spa', 1);
		});
	});
});
