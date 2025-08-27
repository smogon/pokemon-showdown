'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lum Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should heal a non-volatile status condition', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Rapidash', moves: ['inferno'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Machamp', ability: 'noguard', item: 'lumberry', moves: ['sleeptalk'] }] });
		battle.makeChoices('move inferno', 'move sleeptalk');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should cure confusion', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Golurk', ability: 'noguard', moves: ['dynamicpunch'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Shuckle', item: 'lumberry', moves: ['sleeptalk'] }] });
		battle.makeChoices('move dynamicpunch', 'move sleeptalk');
		assert(!battle.p2.active[0].volatiles['confusion']);
	});

	it('should be eaten immediately when the holder gains a status condition', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Charizard', item: 'lumberry', moves: ['outrage'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Toxapex', moves: ['recover', 'banefulbunker'] }] });
		const attacker = battle.p1.active[0];
		battle.makeChoices('move outrage', 'move recover');
		attacker.volatiles['lockedmove'].duration = 2;
		battle.makeChoices('move outrage', 'move recover');
		battle.makeChoices('move outrage', 'move banefulbunker');
		assert.equal(attacker.status, '');
		assert(attacker.volatiles['confusion']);
	});

	it('should cure Poison and confusion after Poison Puppeteer activation', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Charizard', item: 'lumberry', moves: ['sleeptalk'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Pecharunt', ability: 'poisonpuppeteer', moves: ['toxic'] }] });
		const charizard = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(charizard.status, '');
		assert(!charizard.volatiles['confusion']);
	});
});
