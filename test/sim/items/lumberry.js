'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Lum Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should heal a non-volatile status condition', () => {
		battle = common.createBattle([[
			{ species: 'Rapidash', moves: ['inferno'] },
		], [
			{ species: 'Machamp', ability: 'noguard', item: 'lumberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move inferno', 'move sleeptalk');
		assert.equal(battle.p2.active[0].status, '');
	});

	it('should cure confusion', () => {
		battle = common.createBattle([[
			{ species: 'Golurk', ability: 'noguard', moves: ['dynamicpunch'] },
		], [
			{ species: 'Shuckle', item: 'lumberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('move dynamicpunch', 'move sleeptalk');
		assert(!battle.p2.active[0].volatiles['confusion']);
	});

	it('should be eaten immediately when the holder gains a status condition', () => {
		battle = common.createBattle([[
			{ species: 'Charizard', item: 'lumberry', moves: ['outrage'] },
		], [
			{ species: 'Toxapex', moves: ['recover', 'banefulbunker'] },
		]]);
		const attacker = battle.p1.active[0];
		battle.makeChoices('move outrage', 'move recover');
		attacker.volatiles['lockedmove'].duration = 2;
		battle.makeChoices('move outrage', 'move recover');
		battle.makeChoices('move outrage', 'move banefulbunker');
		assert.equal(attacker.status, '');
		assert(attacker.volatiles['confusion']);
	});

	it('should cure Poison from Poison Touch before being knocked off', () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: 'Wynaut', ability: 'poisontouch', moves: ['knockoff'] },
		], [
			{ species: 'Shuckle', item: 'lumberry', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert(battle.getDebugLog().includes('|-status|p2a: Shuckle|psn|[from] ability: Poison Touch'));
		assert.equal(battle.p2.active[0].status, '');
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it('should cure Poison and confusion after Poison Puppeteer activation', () => {
		battle = common.createBattle([[
			{ species: 'Charizard', item: 'lumberry', moves: ['sleeptalk'] },
		], [
			{ species: 'Pecharunt', ability: 'poisonpuppeteer', moves: ['toxic'] },
		]]);
		const charizard = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(charizard.status, '');
		assert(!charizard.volatiles['confusion']);
	});
});
