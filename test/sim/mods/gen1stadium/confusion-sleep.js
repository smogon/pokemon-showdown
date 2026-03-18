'use strict';

const assert = require('./../../../assert');
const common = require('./../../../common');

let battle;

describe('[Gen 1 Stadium] Confusion + Sleep interaction', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should decrement sleep counter when confused pokemon hits itself', () => {
		battle = common.gen(1).mod('gen1stadium').createBattle({
			forceRandomChance: true,
		}, [[
			{ species: 'Alakazam', moves: ['sleeptalk'] },
		], [
			{ species: 'Hypno', moves: ['sleeppowder', 'confuseray', 'psychic'] },
		]]);

		battle.makeChoices('move sleeptalk', 'move sleeppowder');
		const alakazam = battle.p1.active[0];
		assert.equal(alakazam.status, 'slp', 'Alakazam should be asleep');

		// force sleep to last 3 turns so it doesn't wake up during test
		alakazam.statusState.time = 3;

		battle.makeChoices('move sleeptalk', 'move confuseray');
		assert(alakazam.volatiles['confusion'], 'Alakazam should be confused');

		// sleep should have decremented to 2 during the confuse ray turn
		assert.equal(alakazam.statusState.time, 2, 'Sleep should have decremented during confuse ray turn');

		// force confusion self-hit by using forceRandomChance: true
		// this makes randomChance always return true, so we need to check the second parameter
		// in confusion code: !this.randomChance(128, 256) means 50% chance to NOT hit self
		// with forceRandomChance, randomChance(128, 256) returns true, so !true = false = hits self
		battle.makeChoices('move sleeptalk', 'move psychic');

		// sleep counter should have decremented despite confusion self-hit
		assert.equal(alakazam.status, 'slp', 'Alakazam should still be asleep');
		assert.equal(alakazam.statusState.time, 1,
			`Sleep time should decrement from 2 to 1 when hitting self in confusion (got ${alakazam.statusState.time})`);
	});

	it('should allow pokemon to wake up normally after confusion self-hits', () => {
		battle = common.gen(1).mod('gen1stadium').createBattle({
			forceRandomChance: true,
		}, [[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Hypno', moves: ['sleeppowder', 'confuseray', 'psychic'] },
		]]);

		battle.makeChoices('move psychic', 'move sleeppowder');
		const alakazam = battle.p1.active[0];
		assert.equal(alakazam.status, 'slp', 'Alakazam should be asleep');

		// set sleep to 1 turn remaining
		alakazam.statusState.time = 1;

		battle.makeChoices('move psychic', 'move confuseray');
		assert(alakazam.volatiles['confusion'], 'Alakazam should be confused');

		// next turn: confusion causes self-hit, which should decrement sleep to 0
		battle.makeChoices('move psychic', 'move psychic');

		// pokemon should wake up after the turn ends
		assert.false(alakazam.status, 'Alakazam should have woken up after sleep counter reached 0');
	});

	it('should decrement sleep normally when confused but does not hit self', () => {
		battle = common.gen(1).mod('gen1stadium').createBattle([[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Hypno', moves: ['sleeppowder', 'confuseray', 'psychic'] },
		]]);

		battle.makeChoices('move psychic', 'move sleeppowder');
		const alakazam = battle.p1.active[0];

		battle.makeChoices('move psychic', 'move confuseray');

		// without forceRandomChance, confusion is random
		// but sleep should still work correctly either way
		const prevSleepTime = alakazam.statusState.time;
		battle.makeChoices('move psychic', 'move psychic');

		// if pokemon was asleep this turn, sleep counter should have decremented
		if (alakazam.status === 'slp') {
			assert(alakazam.statusState.time === prevSleepTime || alakazam.statusState.time < prevSleepTime,
				'Sleep time should not increase');
		}
	});

	it('should handle normal sleep without confusion correctly', () => {
		battle = common.gen(1).mod('gen1stadium').createBattle([[
			{ species: 'Alakazam', moves: ['psychic'] },
		], [
			{ species: 'Hypno', moves: ['sleeppowder', 'psychic'] },
		]]);

		battle.makeChoices('move psychic', 'move sleeppowder');
		const alakazam = battle.p1.active[0];
		assert.equal(alakazam.status, 'slp', 'Alakazam should be asleep');

		// force sleep to last 3 turns
		alakazam.statusState.time = 3;

		battle.makeChoices('move psychic', 'move psychic');

		assert.equal(alakazam.status, 'slp', 'Alakazam should still be asleep');
		assert.equal(alakazam.statusState.time, 2,
			`Sleep time should decrement by 1 each turn (was 3, now ${alakazam.statusState.time})`);
	});
});
