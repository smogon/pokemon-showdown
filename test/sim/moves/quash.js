'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Quash', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause the target to move last if it has not moved yet', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Sableye", ability: 'prankster', moves: ['quash']},
			{species: "Aggron", ability: 'sturdy', moves: ['earthquake']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arceus", ability: 'multitype', moves: ['voltswitch']},
			{species: "Aerodactyl", ability: 'unnerve', moves: ['swift']},
			{species: "Rotom", ability: 'levitate', moves: ['thunderbolt']},
		]});
		battle.makeChoices('move quash 2, move earthquake', 'move voltswitch 2, move swift');
		battle.makeChoices('', 'switch 3, pass'); // Volt Switch
		assert.equal(battle.log[battle.lastMoveLine].split('|')[3], 'Swift');
	});

	it('should not cause the target to move again if it has already moved', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Sableye", ability: 'prankster', moves: ['quash']},
			{species: "Aggron", ability: 'sturdy', moves: ['earthquake']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Arceus", ability: 'multitype', moves: ['voltswitch']},
			{species: "Aerodactyl", ability: 'unnerve', moves: ['extremespeed']},
			{species: "Rotom", ability: 'levitate', moves: ['thunderbolt']},
		]});
		battle.makeChoices('move quash 2, move earthquake', 'move voltswitch 2, move extremespeed 1');
		battle.makeChoices('', 'switch 3, pass'); // Volt Switch
		assert.notEqual(battle.log[battle.lastMoveLine].split('|')[3], 'Extremespeed');
	});
});
