'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('NC 1997 Sleep Clause', () => {
	afterEach(() => battle.destroy());

	it('should force the violating player to lose when attempting to sleep a second foe', () => {
		battle = common.createBattle({ formatid: 'gen1japaneseou@@@!Sleep Clause Mod,NC 1997 Sleep Clause,^!teampreview' }, [
			[{ species: 'Parasect', moves: ['spore', 'tackle'] }],
			[{ species: 'Magikarp', moves: ['splash'] }, { species: 'Jigglypuff', moves: ['splash'] }],
		]);
		battle.makeChoices('move spore', 'switch 2');
		assert.equal(battle.p2.active[0].status, 'slp');
		battle.makeChoices('move spore', 'switch 2');
		assert(battle.ended, 'battle should have ended on clause violation');
		assert.equal(battle.winner, 'Player 2', 'the violating player should lose');
	});

	it('should not end the battle when only one foe is put to sleep', () => {
		battle = common.createBattle({ formatid: 'gen1japaneseou@@@!Sleep Clause Mod,NC 1997 Sleep Clause,^!teampreview' }, [
			[{ species: 'Parasect', moves: ['spore', 'tackle'] }],
			[{ species: 'Magikarp', moves: ['splash'] }, { species: 'Jigglypuff', moves: ['splash'] }],
		]);
		battle.makeChoices('move spore', 'switch 2');
		assert.equal(battle.p2.active[0].status, 'slp');
		assert.false(battle.ended, 'battle should continue after first sleep');
	});

	it('should trigger when opponent uses a sleep move after any foe pokemon is already asleep (including Rest)', () => {
		battle = common.createBattle({ formatid: 'gen1japaneseou@@@!Sleep Clause Mod,NC 1997 Sleep Clause,^!teampreview' }, [
			[{ species: 'Parasect', moves: ['spore', 'tackle'] }],
			[{ species: 'Magikarp', moves: ['rest'] }, { species: 'Jigglypuff', moves: ['splash'] }],
		]);
		// damage magikarp first so Rest can succeed
		battle.makeChoices('move tackle', 'move rest');
		assert(battle.p2.active[0].hp < battle.p2.active[0].maxhp, 'magikarp should be damaged');
		// now magikarp rests successfully (below full hp)
		battle.makeChoices('move tackle', 'move rest');
		assert.equal(battle.p2.active[0].status, 'slp');
		// p1 tries to sleep a second p2 pokemon — clause violation, p1 (attacker) forfeits
		battle.makeChoices('move spore', 'switch 2');
		assert(battle.ended, 'battle should end when clause is violated even with rest-asleep pokemon');
		assert.equal(battle.winner, 'Player 2');
	});
});
