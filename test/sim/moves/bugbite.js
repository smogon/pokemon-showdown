'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Bug Bite', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not steal and eat Jaboca Berry in Gen 9', () => {
		battle = common.createBattle([
			[{ species: "Scyther", moves: ['bugbite'] }],
			[{ species: "Forretress", item: 'jabocaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move bugbite', 'move sleeptalk');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
	it('should not steal and eat Enigma Berry in Gen 9', () => {
		battle = common.createBattle([
			[{ species: "combee", moves: ['bugbite'] }],
			[{ species: "umbreon", item: 'enigmaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move bugbite', 'move sleeptalk');
		assert(!battle.log.some(line => line.includes("stole")));
	});
});

describe('Bug Bite [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should steal and eat Jaboca Berry', () => {
		battle = common.gen(4).createBattle([
			[{ species: "Scyther", moves: ['bugbite'] }],
			[{ species: "Forretress", item: 'jabocaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move bugbite', 'move sleeptalk');
		assert.equal(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
	it('should steal and eat Enigma Berry', () => {
		battle = common.createBattle([
			[{ species: "combee", level: 1, moves: ['bugbite'] }],
			[{ species: "umbreon", item: 'enigmaberry', moves: ['sleeptalk'] }],
		]);
		battle.makeChoices('move bugbite', 'move sleeptalk');
		assert(!battle.log.some(line => line.includes("stole")));
	});
});
