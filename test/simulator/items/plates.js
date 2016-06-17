'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;
let plates = ['Draco Plate', 'Dread Plate', 'Earth Plate', 'Fist Plate', 'Flame Plate', 'Icicle Plate',
				'Insect Plate', 'Iron Plate', 'Meadow Plate', 'Mind Plate', 'Pixie Plate', 'Sky Plate',
				'Splash Plate', 'Spooky Plate', 'Stone Plate', 'Toxic Plate', 'Zap Plate'];

describe('Plates', function () {
	for (let i = 0; i < plates.length; i++) {
		describe(plates[i], function () {
			let id = plates[i].replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by an Arceus', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'frisk', item: id, moves: ['recover']}]);
				battle.join('p2', 'Guest 2', 1, [
					{species: 'Fennekin', ability: 'magician', moves: ['mysticalfire']},
					{species: 'Abra', ability: 'synchronize', moves: ['thief', 'trick', 'knockoff']},
				]);
				const holder = battle.p1.active[0];
				battle.commitDecisions(); // Fennekin's Magician
				assert.holdsItem(holder);
				battle.p2.chooseSwitch(2).foe.chooseDefault();

				for (let i = 1; i <= 3; i++) {
					battle.p2.chooseMove(i).foe.chooseDefault();
					assert.holdsItem(holder);
				}
			});

			it('should not be removed by Fling if held by an Arceus', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Arceus', ability: 'frisk', item: id, moves: ['fling']}]);
				battle.commitDecisions();
				assert.holdsItem(battle.p2.active[0]);
			});

			it('should not be given to an Arceus', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'multitype', moves: ['thief']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]);
				battle.commitDecisions();
				assert.false.holdsItem(battle.p1.active[0]);
			});

			it('should be removed if not held by an Arceus', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'multitype', moves: ['knockoff']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]);
				battle.commitDecisions();
				assert.false.holdsItem(battle.p2.active[0]);
			});
		});
	}
});
