'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const drives = ['Burn Drive', 'Chill Drive', 'Douse Drive', 'Shock Drive'];

let battle;

describe('Drives', function () {
	for (let i = 0; i < drives.length; i++) {
		describe(drives[i], function () {
			let id = drives[i].replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by a Genesect', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', item: id, moves: ['recover']}]);
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

			it('should not be removed by Fling if held by a Genesect', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Genesect', ability: 'frisk', item: id, moves: ['fling']}]);
				battle.commitDecisions();
				assert.holdsItem(battle.p2.active[0]);
			});

			it('should not be given to a Genesect', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', moves: ['thief']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]);
				battle.commitDecisions();
				assert.false.holdsItem(battle.p1.active[0]);
			});

			it('should be removed if not held by a Genesect', function () {
				battle = common.createBattle();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', moves: ['knockoff']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]);
				battle.commitDecisions();
				assert.false.holdsItem(battle.p2.active[0]);
			});
		});
	}
});
