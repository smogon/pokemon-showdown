'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Eject Pack', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause a switch-out after Moody activation', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Glalie', ability: 'moody', item: 'ejectpack', moves: ['protect']},
			{species: 'Mew', ability: 'noability', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Mew', ability: 'noability', moves: ['protect']},
		]});
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
	});

	it("should switch out the holder when its stats are lowered", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Machop', ability: 'noguard', moves: ['leer']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Magikarp', item: 'ejectpack', moves: ['splash']},
			{species: 'Mew', moves: ['splash']},
		]});
		battle.makeChoices();
		assert.equal(battle.p2.requestState, 'switch');
	});

	it.skip("should not trigger until after all entrance abilities have resolved during simultaneous switches", function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Hydreigon', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Morelull', ability: 'drought', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', level: 1, ability: 'electricsurge', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.makeChoices();
		assert.ok(battle.field.isWeather('sunnyday'));
		assert.ok(battle.field.isTerrain('electricterrain'));
		assert.equal(battle.p2.requestState, 'switch');
	});

	it.skip("should only trigger the fastest Eject Pack when multiple targets with Eject Pack have stats lowered", function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Hydreigon', moves: ['leer']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Morelull', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Mew', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move leer, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices();
		console.log(battle.getDebugLog());
		console.log(battle.p2.active[0].species);
		assert.equal(battle.p2.active[0].species, "Morelull");
		assert.equal(battle.p2.active[1].species, "Wynaut");
	});

	it("should cause Pokemon to switch out during the semi-invulernable state", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Charmeleon', item: 'ejectpack', moves: ['phantomforce']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Arcanine', ability: 'intimidate', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move phantomforce', 'move sleeptalk');
		battle.makeChoices('move phantomforce', 'switch 2');
		assert.equal(battle.p1.requestState, 'switch');
	});
});
