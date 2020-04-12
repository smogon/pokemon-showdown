'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Volcalith', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not damage Rock-types', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Coalossal-Gmax', moves: ['rockthrow']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move rockthrow 1 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.fullHP(battle.p2.active[1]);
	});

	it('should deal damage for four turns, including the fourth turn', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Coalossal-Gmax', moves: ['rockthrow', 'sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Boldore', moves: ['sleeptalk']},
		]});
		battle.makeChoices('move rockthrow 2 dynamax, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp - (Math.floor(battle.p2.active[0].maxhp / 6) * 4));
	});

	it.skip('should deal damage alongside Sea of Fire or G-Max Wildfire in the order those field effects were set', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Coalossal-Gmax', item: 'Eject Button', moves: ['rockthrow', 'sleeptalk']},
			{species: 'Charmander', moves: ['firepledge', 'sleeptalk']},
			{species: 'Wynaut', level: 72, moves: ['grasspledge', 'nightshade', 'sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Roggenrola', ability: 'Receiver', item: 'Focus Sash', level: 1, moves: ['sleeptalk', 'tackle']},
			{species: 'Boldore', ability: 'Receiver', item: 'Sitrus Berry', evs: {hp: 28}, moves: ['sleeptalk']},
			{species: 'Torracat', ability: 'Cheek Pouch', item: 'Focus Sash', level: 1, moves: ['sleeptalk']},
		]});
		// Set up Volcalith first, then Sea of Fire
		battle.makeChoices('move rockthrow 1 dynamax, move sleeptalk', 'move tackle 1, move sleeptalk');
		battle.makeChoices('switch 3');
		battle.makeChoices('move grasspledge 1, move firepledge 1', 'move sleeptalk, move sleeptalk');
		battle.makeChoices('', 'switch 3');

		//Bring Cheek Pouch down to Sash so it will faint and set Receiver's HP to exactly 5/8 of max
		battle.makeChoices('move nightshade 2, move firepledge 1', 'move sleeptalk, move sleeptalk');
		let expectedHP = battle.p2.active[1].maxhp;

		/* TODO: this passes when it shouldn't because Sitrus Berry isn't triggering between Sea of Fire and G-Max Volcalith like it should;
		 * Sitrus Berry should be able to activate in between those damaging effects. */

		// If Sea of Fire triggered first, Sitrus Berry would activate without Cheek Pouch, missing the timing for extra health
		// Failure HP should be 216
		assert.strictEqual(battle.p2.active[1].hp, expectedHP);
	});
});
