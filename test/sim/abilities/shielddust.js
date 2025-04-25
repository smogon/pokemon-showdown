'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shield Dust', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should block secondary effects against the user', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [
			[{ species: 'Latios', ability: 'noguard', moves: ['snarl'] }, { species: 'Latias', ability: 'levitate', moves: ['roost'] }],
			[{ species: 'Xerneas', ability: 'shielddust', moves: ['roost'] }, { species: 'Yveltal', ability: 'pressure', moves: ['roost'] }],
		]);
		battle.makeChoices('move snarl, move roost', 'move roost, move roost');
		assert.statStage(battle.p2.active[0], 'spa', 0);
		assert.statStage(battle.p2.active[1], 'spa', -1);
	});

	it('should not block secondary effects that affect the user of the move', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Ledian', ability: 'ironfist', moves: ['poweruppunch'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Dustox', ability: 'shielddust', moves: ['roost'] }] });
		battle.makeChoices('move poweruppunch', 'move roost');
		assert.statStage(battle.p1.active[0], 'atk', 1);
	});

	it('should block added effects from items', () => {
		battle = common.createBattle({ preview: true }, [
			[{ species: 'Talonflame', ability: 'flamebody', item: 'kingsrock', moves: ['flamecharge'] }],
			[{ species: 'Clefable', ability: 'shielddust', moves: ['cottonguard'] }],
		]);
		battle.onEvent('ModifyMove', battle.format, move => {
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('default', 'default'); // Team Preview
		battle.makeChoices('move flamecharge', 'move cottonguard');
		assert.statStage(battle.p1.active[0], 'spe', 1);
		assert.statStage(battle.p2.active[0], 'def', 3); // Clefable did not flinch
	});

	it('should block added effects from Fling', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Ledian', ability: 'ironfist', item: 'petayaberry', moves: ['fling'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Dustox', ability: 'shielddust', moves: ['roost'] }] });
		battle.makeChoices('move fling', 'move roost');
		assert.statStage(battle.p2.active[0], 'spa', 1);
	});

	it('should not block secondary effects on attacks used by the Pokemon with the ability', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Ledian', ability: 'shielddust', moves: ['poweruppunch', 'strugglebug'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Clefable', ability: 'unaware', moves: ['softboiled'] }] });
		battle.makeChoices('move poweruppunch', 'move softboiled');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		battle.makeChoices('move strugglebug', 'move softboiled');
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});

	it('should be negated by Mold Breaker', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Pinsir', ability: 'moldbreaker', moves: ['strugglebug'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Dustox', ability: 'shielddust', moves: ['roost'] }] });
		battle.makeChoices('move strugglebug', 'move roost');
		assert.statStage(battle.p2.active[0], 'spa', -1);
	});

	it(`should only prevent Sparkling Aria from curing burn if there is only one target`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', ability: 'noguard', moves: ['willowisp', 'sparklingaria'] },
			{ species: 'diglett', moves: ['sleeptalk', 'protect'] },
		], [
			{ species: 'dustox', ability: 'shielddust', moves: ['sleeptalk'] },
			{ species: 'magikarp', moves: ['sleeptalk', 'protect'] },
		]]);
		battle.makeChoices('move willowisp 1, move sleeptalk', 'auto');
		battle.makeChoices('move sparklingaria, move protect', 'move sleeptalk, move protect');
		assert.equal(battle.p2.active[0].status, 'brn', `Shield Dust should prevent cured burn if it's the only target`);

		battle.makeChoices('move sparklingaria, move sleeptalk', 'auto');
		assert.equal(battle.p2.active[0].status, '', `Shield Dust should not prevent cured burn if it's one of many targets`);
	});
});
