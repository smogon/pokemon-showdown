'use strict';

const assert = require('assert');
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
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Machamp", ability: 'guts', moves: ['crosschop']}]);
				battle.commitDecisions();
				assert.deepEqual(battle.p2.active[0].getTypes(), ['Fighting', moveData.type]);
			});

			it('should not add ' + moveData.type + ' type to ' + moveData.type + ' targets', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Trevenant", ability: 'harvest', moves: ['ingrain']}]);
				battle.commitDecisions();
				assert.deepEqual(battle.p2.active[0].getTypes(), ['Ghost', 'Grass']);
			});

			it('should be able to add ' + moveData.type + ' type to Arceus', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
				battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'multitype', moves: ['extremespeed']}]);
				battle.commitDecisions();
				assert.deepEqual(battle.p2.active[0].getTypes(), ['Normal', moveData.type]);
			});

			for (let moveData2 of adderMoves) {
				if (moveData.name === moveData2.name) {
					it('should fail on repeated use', function () {
						battle = BattleEngine.Battle.construct();
						battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name]}]);
						battle.join('p2', 'Guest 2', 1, [{species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes']}]);
						battle.commitDecisions();
						let cachedTypes = battle.p2.active[0].getTypes();
						battle.commitDecisions();
						assert.deepEqual(battle.p2.active[0].getTypes(), cachedTypes);
						assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
					});
				} else {
					it('should override ' + moveData2.name, function () {
						battle = BattleEngine.Battle.construct();
						battle.join('p1', 'Guest 1', 1, [{species: "Gourgeist", ability: 'frisk', moves: [moveData.name, moveData2.name]}]);
						battle.join('p2', 'Guest 2', 1, [{species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes']}]);
						battle.choose('p1', 'move 2');
						battle.commitDecisions();
						let cachedTypes = battle.p2.active[0].getTypes();
						battle.commitDecisions();
						assert.notDeepEqual(battle.p2.active[0].getTypes(), cachedTypes);
						assert.deepEqual(battle.p2.active[0].getTypes(), ['Psychic', moveData.type]);
					});
				}
			}
		});
	}
});
