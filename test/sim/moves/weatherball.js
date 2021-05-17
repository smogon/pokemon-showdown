'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weather Ball', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change type when used as a Z-move in weather', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Castform", item: 'normaliumz', moves: ['weatherball']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash']},
		]});
		battle.makeChoices('move weatherball zmove', 'move splash');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not change type when called by a Z-move in weather', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Castform", item: 'normaliumz', moves: ['shadowball', 'assist']},
			{species: "Castform", moves: ['weatherball']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash']},
		]});
		battle.makeChoices('move shadowball', 'move splash');
		battle.makeChoices('move assist zmove', 'move splash');
		assert(!battle.p2.active[0].fainted);
	});

	it('should not trigger counter when it is special during gen 3', function () {
		battle = common.gen(3).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'drizzle', moves: ['weatherball']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['counter']}]});
		battle.makeChoices();
		assert.equal(battle.p1.active[0].maxhp, battle.p1.active[0].hp);
	});

	it('should trigger mirror coat when it is special during gen 3', function () {
		battle = common.gen(3).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'drizzle', moves: ['weatherball']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['mirrorcoat']}]});
		battle.makeChoices();
		assert.notEqual(battle.p1.active[0].maxhp, battle.p1.active[0].hp);
	});

	it('should not trigger mirror coat when it is physical during gen 3', function () {
		battle = common.gen(3).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'plus', moves: ['weatherball']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['mirrorcoat']}]});
		battle.makeChoices();
		assert.equal(battle.p1.active[0].maxhp, battle.p1.active[0].hp);
	});

	it('should trigger counter when it is physical during gen 3', function () {
		battle = common.gen(3).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Sawk', ability: 'plus', moves: ['weatherball']}]});
		battle.setPlayer('p2', {team: [{species: 'Throh', ability: 'guts', moves: ['counter']}]});
		battle.makeChoices();
		assert.notEqual(battle.p1.active[0].maxhp, battle.p1.active[0].hp);
	});
});
