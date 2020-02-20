'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Belly Drum', function () {
	afterEach(() => battle.destroy());

	it("should reduce the user's HP by half of their maximum HP, then boost their Attack to maximum", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Linoone", ability: 'limber', moves: ['bellydrum']}]});
		battle.setPlayer('p2', {team: [{species: "Terrakion", ability: 'justified', moves: ['bulkup']}]});
		const user = battle.p1.active[0];
		battle.makeChoices('move bellydrum', 'move bulkup');
		assert.equal(user.hp, Math.ceil(user.maxhp / 2));
		assert.statStage(user, 'atk', 6);
	});

	it("should fail if the user's HP is less than half of their maximum HP", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Linoone", ability: 'sturdy', moves: ['bellydrum']}]});
		battle.setPlayer('p2', {team: [{species: "Terrakion", ability: 'justified', moves: ['closecombat']}]});
		const user = battle.p1.active[0];
		battle.makeChoices('move bellydrum', 'move closecombat');
		assert.equal(user.hp, 1);
		assert.statStage(user, 'atk', 0);
	});
});

describe('Z-Belly Drum', function () {
	afterEach(() => battle.destroy());

	it("should heal the user, then reduce their HP by half their max HP and boost the user's Attack to maximum", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Linoone", ability: 'limber', item: 'normaliumz', moves: ['bellydrum']}]});
		battle.setPlayer('p2', {team: [{species: "Rattata", ability: 'guts', moves: ['quickattack']}]});
		const user = battle.p1.active[0];
		battle.makeChoices('move bellydrum zmove', 'move quickattack');
		assert.equal(user.hp, Math.ceil(user.maxhp / 2));
		assert.statStage(user, 'atk', 6);
	});

	it("should not fail even if the user's HP is less than half of their maximum HP", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Linoone", ability: 'sturdy', item: 'normaliumz', moves: ['bellydrum']}]});
		battle.setPlayer('p2', {team: [{species: "Terrakion", ability: 'justified', moves: ['closecombat']}]});
		const user = battle.p1.active[0];
		battle.makeChoices('move bellydrum zmove', 'move closecombat');
		assert.equal(user.hp, Math.ceil(user.maxhp / 2));
		assert.statStage(user, 'atk', 6);
	});
});
