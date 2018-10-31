'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

let adderMoves = [
	{name: 'Trick-or-Treat', type: 'Ghost'},
	{name: 'Forest\'s Curse', type: 'Grass'},
];

describe('Type addition', function () {
	afterEach(function () {
		battle.destroy();
	});

	for (let moveData of adderMoves) {
		describe(moveData.name, function () {
			it('should add ' + moveData.type + ' type to its target', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Machamp", ability: 'guts', moves: ['crosschop']}]);
				const target = battle.p2.active[0];
				assert.sets(() => target.getTypes().join('/'), `Fighting/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move crosschop'));
			});

			it('should not add ' + moveData.type + ' type to ' + moveData.type + ' targets', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Trevenant", ability: 'harvest', moves: ['ingrain']}]);
				const target = battle.p2.active[0];
				assert.constant(() => target.getTypes().join('/'), () => battle.makeChoices('move ' + moveData.name, 'move ingrain'));
			});

			it('should be able to add ' + moveData.type + ' type to Arceus', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'multitype', moves: ['extremespeed']}]);
				const target = battle.p2.active[0];
				assert.sets(() => target.getTypes().join('/'), `Normal/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move extremespeed'));
			});

			for (let moveData2 of adderMoves) {
				if (moveData.name === moveData2.name) {
					it('should fail on repeated use', function () {
						battle = common.createBattle();
						battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
						battle.join('p2', 'Guest 2', 1, [{species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes']}]);
						const target = battle.p2.active[0];
						battle.makeChoices('move ' + moveData.name, 'move spikes');
						assert.constant(() => target.getTypes().join('/'), () => battle.makeChoices('move ' + moveData.name, 'move spikes'));
						assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
					});
				} else {
					it('should override ' + moveData2.name, function () {
						battle = common.createBattle();
						battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name, moveData2.name]}]);
						battle.join('p2', 'Guest 2', 1, [{species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes']}]);
						const target = battle.p2.active[0];
						battle.makeChoices('move ' + moveData2.name, 'move spikes');
						assert.sets(() => target.getTypes().join('/'), `Psychic/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move spikes'));
					});
				}
			}
		});
	}
});
