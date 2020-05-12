'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Technician', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not apply boost on a move boosted over 60 BP by Battery in Gen 7', function () {
		battle = common.gen(7).createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Toxtricity', ability: 'technician', moves: ['shockwave']},
			{species: 'Charjabug', ability: 'battery', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Marshadow', ability: 'technician', moves: ['sleeptalk']},
			{species: 'Mew', ability: 'synchronize', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move shockwave 2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		const mew = battle.p2.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [94, 112]);
	});

	it('should apply boost on a move boosted over 60 BP by Steely Spirit', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Scizor', ability: 'technician', moves: ['metalclaw']},
			{species: 'Perrserker', ability: 'steelyspirit', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Marshadow', ability: 'technician', moves: ['sleeptalk']},
			{species: 'Mew', ability: 'synchronize', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move metalclaw 2, move sleeptalk', 'move sleeptalk, move sleeptalk');
		const mew = battle.p2.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [151, 178]);
	});

	it('should consider the BP before Aura boosts have been applied in Gen 8', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Smeargle', ability: 'technician', moves: ['drainingkiss', 'knockoff']},
			{species: 'Scizor', ability: 'technician', moves: ['thief', 'sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Xerneas', ability: 'fairyaura', moves: ['sleeptalk']},
			{species: 'Yveltal', ability: 'darkaura', moves: ['sleeptalk']},
			{species: 'Zygarde', ability: 'aurabreak', moves: ['sleeptalk']},
		]});
		// 1st turn: test Fairy Aura and Dark Aura
		// Scizor attacks Xerneas with Thief, Smeargle attacks Yveltal with Draining Kiss
		battle.makeChoices('move drainingkiss 2, move thief 1', 'move sleeptalk, move sleeptalk');
		const yveltal = battle.p2.active[1];
		const xerneas = battle.p2.active[0];
		const damage_xern = xerneas.maxhp - xerneas.hp;
		assert.bounded(damage_xern, [56, 67]);
		const damage_yvel = yveltal.maxhp - yveltal.hp;
		assert.bounded(damage_yvel, [48, 58]);
		// Smeargle attacks Zygarde on the switch with Knock Off
		battle.makeChoices('move knockoff 1, move sleeptalk', 'switch 3, move sleeptalk');
		const zygarde = battle.p2.active[0];
		const damage_zyg = zygarde.maxhp - zygarde.hp;
		assert.bounded(damage_zyg, [11, 13]);
	});
});
