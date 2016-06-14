'use strict';

const assert = require('./../../assert');
let battle;

describe('Storm Drain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Water-type moves and boost Special Attack by 1 stage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']}]);
		battle.commitDecisions();
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
	});

	it('should redirect single-target Water-type attacks to the user if it is a valid target', function () {
		battle = BattleEngine.Battle.construct('battle-triples-stormdrain', 'triplescustomgame');
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]);
		battle.commitDecisions(); // Team Preview
		p1.chooseMove(1).chooseMove(1, 1).chooseMove(1, 1);
		p2.chooseMove(1, 3).chooseMove(1, 3).chooseMove(1, 2);
		assert.statStage(battle.p1.active[0], 'spa', 3);
		assert.false.fullHP(battle.p1.active[2]);
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should redirect to the fastest Pokemon with the ability', function () {
		battle = BattleEngine.Battle.construct('battle-doubles-stormdrain-speed', 'doublescustomgame');
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Azumarill', ability: 'thickfat', moves: ['waterfall']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['waterfall']},
		]);
		battle.commitDecisions(); // Team Preview
		p1.active[0].boostBy({spe: 6});
		p1.chooseMove(1).chooseMove(1).foe.chooseMove(1, 1).chooseMove(1, 2);
		assert.statStage(p1.active[0], 'spa', 2);
		assert.statStage(p1.active[1], 'spa', 0);
	});

	it('should not redirect if another Pokemon has used Follow Me', function () {
		battle = BattleEngine.Battle.construct('battle-stormdrain-followme', 'doublescustomgame');
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['followme']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]);
		battle.commitDecisions(); // Team Preview
		p1.active[0].boostBy({spe: 6});
		p1.chooseMove(1).chooseMove(1).foe.chooseMove(1, 2).chooseMove(1, 1);
		assert.statStage(p1.active[0], 'spa', 0);
		assert.false.fullHP(p1.active[1]);
	});

	it('should have its Water-type immunity and its ability to redirect moves suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct('battle-moldbreaker-stormdrain', 'doublescustomgame');
		const p1 = battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['endure']},
			{species: 'Manaphy', ability: 'hydration', moves: ['tailglow']},
		]);
		const p2 = battle.join('p2', 'Guest 2', 1, [
			{species: 'Haxorus', ability: 'moldbreaker', moves: ['waterfall']},
			{species: 'Reshiram', ability: 'turboblaze', moves: ['waterpulse']},
		]);
		battle.commitDecisions(); // Team Preview
		p2.chooseMove(1, 1).chooseMove(1, 2).foe.chooseDefault();
		assert.false.fullHP(p1.active[0]);
		assert.false.fullHP(p1.active[1]);
	});
});
