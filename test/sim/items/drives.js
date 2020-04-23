'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const drives = ['Burn Drive', 'Chill Drive', 'Douse Drive', 'Shock Drive'];

let battle;

describe('Drives', function () {
	for (const drive of drives) {
		describe(drive, function () {
			const id = drive.replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by a Genesect', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Genesect', ability: 'frisk', item: id, moves: ['recover']}]});
				battle.setPlayer('p2', {team: [
					{species: 'Fennekin', ability: 'magician', moves: ['thief', 'mysticalfire']},
					{species: 'Abra', ability: 'synchronize', moves: ['thief', 'trick', 'knockoff']},
				]});
				const holder = battle.p1.active[0];
				battle.makeChoices('move recover', 'move thief'); // Fennekin's Magician
				assert.holdsItem(holder);
				battle.makeChoices('move recover', 'switch 2');

				for (let i = 1; i <= 3; i++) {
					battle.makeChoices('move recover', 'move ' + i);
					assert.holdsItem(holder);
				}
			});

			it('should not be removed by Fling if held by a Genesect', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]});
				battle.setPlayer('p2', {team: [{species: 'Genesect', ability: 'frisk', item: id, moves: ['fling']}]});
				battle.makeChoices('move swordsdance', 'move fling');
				assert.holdsItem(battle.p2.active[0]);
			});

			it('should not be given to a Genesect', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Genesect', ability: 'frisk', moves: ['thief']}]});
				battle.setPlayer('p2', {team: [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]});
				battle.makeChoices('move thief', 'move bestow');
				assert.false.holdsItem(battle.p1.active[0]);
			});

			it('should be removed if not held by a Genesect', function () {
				battle = common.createBattle();
				battle.setPlayer('p1', {team: [{species: 'Genesect', ability: 'frisk', moves: ['knockoff']}]});
				battle.setPlayer('p2', {team: [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]});
				battle.makeChoices('move knockoff', 'move bulkup');
				assert.false.holdsItem(battle.p2.active[0]);
			});
		});
	}
});
