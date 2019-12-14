'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Neutralizing Gas', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent switch-in abilities from activating', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gyarados", ability: 'intimidate', moves: ['splash']}]});
		battle.setPlayer('p2', {team: [{species: "Weezing", ability: 'neutralizinggas', moves: ['toxicspikes']}]});
		assert.statStage(battle.p2.active[0], 'atk', 0);
	});

	it('should ignore damage-reducing abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Weezing", ability: 'neutralizinggas', item: 'expertbelt', moves: ['sludgebomb']}]});
		battle.setPlayer('p2', {team: [{species: "Mr. Mime", ability: 'filter', item: 'laggingtail', moves: ['substitute']}]});
		battle.makeChoices('move sludgebomb', 'move substitute');
		assert.ok(!battle.p1.active[0].volatiles['substitute']);
	});

	it('should negate self-healing abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Weezing", ability: 'neutralizinggas', moves: ['toxic']}]});
		battle.setPlayer('p2', {team: [{species: "Breloom", ability: 'poisonheal', moves: ['swordsdance']}]});
		battle.makeChoices('move toxic', 'move swordsdance');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should negate abilities that suppress item effects', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Weezing", ability: 'neutralizinggas', moves: ['reflect']}]});
		battle.setPlayer('p2', {team: [{species: "Reuniclus", ability: 'magicguard', item: 'lifeorb', moves: ['shadowball']}]});
		battle.makeChoices('move reflect', 'move shadowball');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should negate abilities that modify boosts', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Weezing", ability: 'neutralizinggas', moves: ['spore']}]});
		battle.setPlayer('p2', {team: [{species: "Shuckle", ability: 'contrary', moves: ['sleeptalk', 'superpower']}]});
		battle.makeChoices('move spore', 'move sleeptalk');
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});

	it(`should negate abilites that activate on switch-out`, function () {
		battle = common.createBattle([
			[{species: "Weezing", ability: 'neutralizinggas', moves: ['toxic']},
				{species: "Type: Null", ability: 'battlearmor', moves: ['facade']}],
			[{species: "Corsola", ability: 'naturalcure', moves: ['uturn']},
				{species: "Magikarp", ability: 'rattled', moves: ['splash']}],
		]);
		battle.makeChoices('move toxic', 'move uturn');
		battle.makeChoices('', 'switch 2');
		battle.makeChoices('switch 2', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, 'tox');
	});

	it('should negate abilities that modify move type', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gengar", ability: 'neutralizinggas', moves: ['laserfocus']}]});
		battle.setPlayer('p2', {team: [{species: "Sylveon", ability: 'pixilate', moves: ['hypervoice']}]});
		battle.makeChoices('move laserfocus', 'move hypervoice');
		assert.fullHP(battle.p1.active[0]);
	});
});
