'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Storm Drain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Water-type moves and boost Special Attack by 1 stage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']}]});
		battle.makeChoices('move sleeptalk', 'move aquajet');
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
	});

	it('should redirect Max Geyser', function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleep talk']},
			{species: 'Manaphy', ability: 'hydration', moves: ['scald']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Igglybuff', ability: 'cute charm', moves: ['sleep talk']},
			{species: 'Igglybuff', ability: 'cute charm', moves: ['sleep talk']},
		]});
		battle.makeChoices('move sleeptalk, move scald dynamax 1', 'move sleep talk, move sleep talk');
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spa', 1);
	});

	it('should redirect single-target Water-type attacks to the user if it is a valid target', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]});
		battle.makeChoices('move sleeptalk, move aquajet 1, move aquajet 1', 'move aquajet 3, move aquajet 3, move aquajet 2');
		assert.statStage(battle.p1.active[0], 'spa', 3);
		assert.false.fullHP(battle.p1.active[2]);
		assert.false.fullHP(battle.p2.active[0]);
	});

	it('should redirect to the fastest Pokemon with the ability', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Azumarill', ability: 'thickfat', moves: ['waterfall']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['waterfall']},
		]});
		const [fastGastrodon, slowGastrodon] = battle.p1.active;
		fastGastrodon.boostBy({spe: 6});
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move waterfall 1, move waterfall 2');
		assert.statStage(fastGastrodon, 'spa', 2);
		assert.statStage(slowGastrodon, 'spa', 0);
	});

	it('should not redirect if another Pokemon has used Follow Me', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['followme']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
		]});
		const [stormDrainMon, defender] = battle.p1.active;
		battle.makeChoices('move sleeptalk, move followme', 'move aquajet 2, move aquajet 1');
		assert.statStage(stormDrainMon, 'spa', 0);
		assert.false.fullHP(defender);
	});

	it('should have its Water-type immunity and its ability to redirect moves suppressed by Mold Breaker', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['endure']},
			{species: 'Manaphy', ability: 'hydration', moves: ['tailglow']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Haxorus', ability: 'moldbreaker', moves: ['waterfall']},
			{species: 'Reshiram', ability: 'turboblaze', moves: ['waterpulse']},
		]});
		const [stormDrainMon, ally] = battle.p1.active;
		battle.makeChoices('move endure, move tailglow', 'move waterfall 1, move waterpulse 2');
		assert.false.fullHP(stormDrainMon);
		assert.false.fullHP(ally);
	});
});
