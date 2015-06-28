var assert = require('assert');
var battle;
var drives = ['Burn Drive', 'Chill Drive', 'Douse Drive', 'Shock Drive'];

describe('Drives', function () {
	for (var i = 0; i < drives.length; i++) {
		describe(drives[i], function () {
			var id = drives[i].replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by a Genesect', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', item: id, moves: ['recover']}]);
				battle.join('p2', 'Guest 2', 1, [
					{species: 'Fennekin', ability: 'magician', moves: ['mysticalfire']},
					{species: 'Abra', ability: 'synchronize', moves: ['thief', 'trick', 'knockoff']}
				]);
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, id);
				battle.choose('p2', 'switch 2');
				battle.commitDecisions();
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, id);
				battle.choose('p2', 'move 2');
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, id);
				battle.choose('p2', 'move 3');
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, id);
			});

			it('should not be removed by Fling if held by a Genesect', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Genesect', ability: 'frisk', item: id, moves: ['fling']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p2.active[0].item, id);
			});

			it('should not be given to a Genesect', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', moves: ['thief']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, '');
			});

			it('should be removed if not held by a Genesect', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Genesect', ability: 'frisk', moves: ['knockoff']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p2.active[0].item, '');
			});
		});
	}
});
