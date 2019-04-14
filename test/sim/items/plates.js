'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let plates = [
	'Draco Plate', 'Dread Plate', 'Earth Plate', 'Fist Plate', 'Flame Plate', 'Icicle Plate',
	'Insect Plate', 'Iron Plate', 'Meadow Plate', 'Mind Plate', 'Pixie Plate', 'Sky Plate',
	'Splash Plate', 'Spooky Plate', 'Stone Plate', 'Toxic Plate', 'Zap Plate',
];

describe('Plates', function () {
	for (const plate of plates) {
		describe(plate, function () {
			let id = plate.replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by an Arceus', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Arceus', ability: 'frisk', item: id, moves: ['recover']}]});
				battle.setPlayer('p2', {team: [
					{species: 'Fennekin', ability: 'magician', moves: ['mysticalfire']},
					{species: 'Abra', ability: 'synchronize', moves: ['thief', 'trick', 'knockoff']},
				]});
				const holder = battle.p1.active[0];
				battle.makeChoices('move recover', 'move mysticalfire'); // Fennekin's Magician
				assert.holdsItem(holder);
				battle.makeChoices('move recover', 'switch 2');

				for (let i = 1; i <= 3; i++) {
					battle.makeChoices('move recover', 'move ' + i);
					assert.holdsItem(holder);
				}
			});

			it('should not be removed by Fling if held by an Arceus', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]});
				battle.setPlayer('p2', {team: [{species: 'Arceus', ability: 'frisk', item: id, moves: ['fling']}]});
				battle.makeChoices('move swordsdance', 'move fling');
				assert.holdsItem(battle.p2.active[0]);
			});

			it('should not be given to an Arceus', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Arceus', ability: 'multitype', moves: ['thief']}]});
				battle.setPlayer('p2', {team: [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]});
				battle.makeChoices('move thief', 'move bestow');
				assert.false.holdsItem(battle.p1.active[0]);
			});

			it('should be removed if not held by an Arceus', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Arceus', ability: 'multitype', moves: ['knockoff']}]});
				battle.setPlayer('p2', {team: [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]});
				battle.makeChoices('move knockoff', 'move bulkup');
				assert.false.holdsItem(battle.p2.active[0]);
			});
		});
	}
});
