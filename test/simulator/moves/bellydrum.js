'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Belly Drum', function () {
	afterEach(() => battle.destroy());

	it("should reduce the user's HP by half of their maximum HP, then boost their Attack to maximum", function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Linoone", ability: 'limber', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Terrakion", ability: 'justified', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(p1.active[0].hp, Math.ceil(p1.active[0].maxhp / 2));
		assert.statStage(p1.active[0], 'atk', 6);
	});

	it("should fail if the user's HP is less than half of their maximum HP", function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Linoone", ability: 'sturdy', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Terrakion", ability: 'justified', moves: ['closecombat']}]);
		battle.commitDecisions();
		assert.strictEqual(p1.active[0].hp, 1);
		assert.statStage(p1.active[0], 'atk', 0);
	});
});

describe('Z-Belly Drum', function () {
	afterEach(() => battle.destroy());

	it("should heal the user, then reduce their HP by half their max HP and boost the user's Attack to maximum", function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Linoone", ability: 'limber', item: 'normaliumz', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rattata", ability: 'guts', moves: ['quickattack']}]);
		p1.chooseMove('bellydrum', 0, 'zmove').foe.chooseDefault();
		assert.strictEqual(p1.active[0].hp, Math.ceil(p1.active[0].maxhp / 2));
		assert.statStage(p1.active[0], 'atk', 6);
	});

	it("should not fail even if the user's HP is less than half of their maximum HP", function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Linoone", ability: 'sturdy', item: 'normaliumz', moves: ['bellydrum']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Terrakion", ability: 'justified', moves: ['closecombat']}]);
		p1.chooseMove('bellydrum', 0, 'zmove').foe.chooseDefault();
		assert.strictEqual(p1.active[0].hp, Math.ceil(p1.active[0].maxhp / 2));
		assert.statStage(p1.active[0], 'atk', 6);
	});
});