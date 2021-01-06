'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weakness Policy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be triggered by super effective hits', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Lucario", ability: 'justified', moves: ['aurasphere']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']},
		]});
		const holder = battle.p2.active[0];
		battle.makeChoices('move aurasphere', 'move softboiled');
		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 2);
		assert.statStage(holder, 'spa', 2);
	});

	it('should respect individual type effectivenesses in doubles', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Stunfisk", ability: 'limber', moves: ['earthquake', 'surf', 'discharge']},
			{species: "Volcarona", ability: 'swarm', item: 'weaknesspolicy', moves: ['roost']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Zekrom", ability: 'teravolt', item: 'weaknesspolicy', moves: ['roost']},
			{species: "Pyukumuku", ability: 'unaware', item: 'weaknesspolicy', moves: ['recover']},
		]});
		const zekrom = battle.p2.active[0];
		const pyuk = battle.p2.active[1];
		const volc = battle.p1.active[1];

		battle.makeChoices('move earthquake, move roost', 'auto');
		assert.false.holdsItem(zekrom);
		assert.statStage(zekrom, 'atk', 2);
		assert.statStage(zekrom, 'spa', 2);
		assert.holdsItem(pyuk);
		assert.statStage(pyuk, 'atk', 0);
		assert.statStage(pyuk, 'spa', 0);
		assert.holdsItem(volc);
		assert.statStage(volc, 'atk', 0);
		assert.statStage(volc, 'spa', 0);

		zekrom.setItem('weaknesspolicy');
		zekrom.clearBoosts();

		battle.makeChoices('move discharge, move roost', 'auto');
		assert.holdsItem(zekrom);
		assert.statStage(zekrom, 'atk', 0);
		assert.statStage(zekrom, 'spa', 0);
		assert.false.holdsItem(pyuk);
		assert.statStage(pyuk, 'atk', 2);
		assert.statStage(pyuk, 'spa', 2);
		assert.holdsItem(volc);
		assert.statStage(volc, 'atk', 0);
		assert.statStage(volc, 'spa', 0);

		pyuk.setItem('weaknesspolicy');
		pyuk.clearBoosts();

		battle.makeChoices('move surf, move roost', 'auto');
		assert.holdsItem(zekrom);
		assert.statStage(zekrom, 'atk', 0);
		assert.statStage(zekrom, 'spa', 0);
		assert.holdsItem(pyuk);
		assert.statStage(pyuk, 'atk', 0);
		assert.statStage(pyuk, 'spa', 0);
		assert.false.holdsItem(volc);
		assert.statStage(volc, 'atk', 2);
		assert.statStage(volc, 'spa', 2);
	});

	it('should not be triggered by fixed damage moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Lucario", ability: 'justified', moves: ['seismictoss']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']},
		]});
		const holder = battle.p2.active[0];
		battle.makeChoices('move seismictoss', 'move softboiled');
		assert.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
		assert.statStage(holder, 'spa', 0);
	});

	it(`should trigger before forced switching moves`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'compoundeyes', moves: ['dragontail']},
		], [
			{species: 'zygarde', item: 'weaknesspolicy', moves: ['sleeptalk']},
			{species: 'aron', moves: ['sleeptalk']},
		]]);
		const zygarde = battle.p2.active[0];
		battle.makeChoices();
		assert.false.holdsItem(zygarde);
	});
});
