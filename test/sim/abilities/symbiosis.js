'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Symbiosis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should share its item with its ally', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Smeargle', ability: 'symbiosis', item: 'enigmaberry', moves: ['snarl']}, {species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['snarl']}],
			[{species: 'Smeargle', moves: ['snarl']}, {species: 'Smeargle', moves: ['snarl']}],
		]);
		battle.makeChoices('move snarl, move snarl', 'move snarl, move snarl');
		assert.strictEqual(battle.p1.active[0].item, '');
		assert.strictEqual(battle.p1.active[1].item, '');
	});

	it('should not share an item required to change forme', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Smeargle', ability: 'symbiosis', item: 'latiasite', moves: ['snarl']}, {species: 'Latias', ability: 'levitate', item: 'weaknesspolicy', moves: ['snarl']}],
			[{species: 'Smeargle', moves: ['snarl']}, {species: 'Smeargle', moves: ['snarl']}],
		]);
		battle.makeChoices('move snarl, move snarl', 'move snarl, move snarl');
		assert.strictEqual(battle.p1.active[0].item, 'latiasite');
		assert.strictEqual(battle.p1.active[1].item, '');
	});
});
