'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

const adderMoves = [
	{ name: 'Trick-or-Treat', type: 'Ghost' },
	{ name: 'Forest\'s Curse', type: 'Grass' },
];

describe('Type addition', () => {
	afterEach(() => {
		battle.destroy();
	});

	for (const moveData of adderMoves) {
		describe(moveData.name, () => {
			it('should add ' + moveData.type + ' type to its target', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [{ species: "Gourgeist", ability: 'frisk', moves: [moveData.name] }] });
				battle.setPlayer('p2', { team: [{ species: "Machamp", ability: 'guts', moves: ['crosschop'] }] });
				const target = battle.p2.active[0];
				assert.sets(() => target.getTypes().join('/'), `Fighting/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move crosschop'));
			});

			it('should not add ' + moveData.type + ' type to ' + moveData.type + ' targets', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [{ species: "Gourgeist", ability: 'frisk', moves: [moveData.name] }] });
				battle.setPlayer('p2', { team: [{ species: "Trevenant", ability: 'harvest', moves: ['ingrain'] }] });
				const target = battle.p2.active[0];
				assert.constant(() => target.getTypes().join('/'), () => battle.makeChoices('move ' + moveData.name, 'move ingrain'));
			});

			it('should be able to add ' + moveData.type + ' type to Arceus', () => {
				battle = common.createBattle();
				battle.setPlayer('p1', { team: [{ species: "Gourgeist", ability: 'frisk', moves: [moveData.name] }] });
				battle.setPlayer('p2', { team: [{ species: "Arceus", ability: 'multitype', moves: ['extremespeed'] }] });
				const target = battle.p2.active[0];
				assert.sets(() => target.getTypes().join('/'), `Normal/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move extremespeed'));
			});

			for (const moveData2 of adderMoves) {
				if (moveData.name === moveData2.name) {
					it('should fail on repeated use', () => {
						battle = common.createBattle();
						battle.setPlayer('p1', { team: [{ species: "Gourgeist", ability: 'frisk', moves: [moveData.name] }] });
						battle.setPlayer('p2', { team: [{ species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes'] }] });
						const target = battle.p2.active[0];
						battle.makeChoices('move ' + moveData.name, 'move spikes');
						assert.constant(() => target.getTypes().join('/'), () => battle.makeChoices('move ' + moveData.name, 'move spikes'));
						assert(battle.log[battle.lastMoveLine + 1].startsWith('|-fail|'));
					});
				} else {
					it('should override ' + moveData2.name, () => {
						battle = common.createBattle();
						battle.setPlayer('p1', { team: [{ species: "Gourgeist", ability: 'frisk', moves: [moveData.name, moveData2.name] }] });
						battle.setPlayer('p2', { team: [{ species: "Deoxys-Speed", ability: 'pressure', moves: ['spikes'] }] });
						const target = battle.p2.active[0];
						battle.makeChoices('move ' + moveData2.name, 'move spikes');
						assert.sets(() => target.getTypes().join('/'), `Psychic/${moveData.type}`, () => battle.makeChoices('move ' + moveData.name, 'move spikes'));
					});
				}
			}
		});
	}
});
