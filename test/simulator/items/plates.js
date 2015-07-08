var assert = require('assert');
var battle;
var plates = ['Draco Plate', 'Dread Plate', 'Earth Plate', 'Fist Plate', 'Flame Plate', 'Icicle Plate',
				'Insect Plate', 'Iron Plate', 'Meadow Plate', 'Mind Plate', 'Pixie Plate', 'Sky Plate',
				'Splash Plate', 'Spooky Plate', 'Stone Plate', 'Toxic Plate', 'Zap Plate'];

describe('Plates', function () {
	for (var i = 0; i < plates.length; i++) {
		describe(plates[i], function () {
			var id = plates[i].replace(/\W+/g, '').toLowerCase();

			afterEach(function () {
				battle.destroy();
			});

			it('should not be stolen or removed if held by an Arceus', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'frisk', item: id, moves: ['recover']}]);
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

			it('should not be removed by Fling if held by an Arceus', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Mawile', ability: 'intimidate', moves: ['swordsdance']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Arceus', ability: 'frisk', item: id, moves: ['fling']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p2.active[0].item, id);
			});

			it('should not be given to an Arceus', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'multitype', moves: ['thief']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bestow']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p1.active[0].item, '');
			});

			it('should be removed if not held by an Arceus', function () {
				battle = BattleEngine.Battle.construct();
				battle.join('p1', 'Guest 1', 1, [{species: 'Arceus', ability: 'multitype', moves: ['knockoff']}]);
				battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', item: id, moves: ['bulkup']}]);
				battle.commitDecisions();
				assert.strictEqual(battle.p2.active[0].item, '');
			});
		});
	}
});
