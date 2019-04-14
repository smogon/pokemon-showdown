'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Foresight', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate Normal and Fighting immunities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['foresight', 'vitalthrow', 'tackle']}]});
		battle.setPlayer('p2', {team: [{species: "Dusknoir", ability: 'prankster', moves: ['recover']}]});
		battle.makeChoices('move foresight', 'move recover');
		battle.makeChoices('move vitalthrow', 'move recover');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.makeChoices('move tackle', 'move recover');
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore the effect of positive evasion stat stages', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['avalanche', 'foresight']}]});
		battle.setPlayer('p2', {team: [{species: "Forretress", ability: 'sturdy', moves: ['synthesis']}]});
		battle.makeChoices('move foresight', 'move synthesis');
		battle.boost({evasion: 6}, battle.p2.active[0]);
		for (let i = 0; i < 7; i++) {
			battle.makeChoices('move avalanche', 'move synthesis');
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});

	it('should not ignore the effect of negative evasion stat stages', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Smeargle", ability: 'owntempo', moves: ['zapcannon', 'dynamicpunch', 'foresight']}]});
		battle.setPlayer('p2', {team: [{species: "Zapdos", ability: 'owntempo', moves: ['roost']}]});
		battle.makeChoices('move foresight', 'move roost');
		battle.boost({spe: 6, evasion: -6}, battle.p2.active[0]);
		for (let i = 0; i < 7; i++) {
			battle.makeChoices('move zapcannon', 'move roost');
			assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		}
	});
});
