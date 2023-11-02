'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shell Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct PP regardless if it was successful', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[
				{species: 'Turtonator', ability: 'shellarmor', moves: ['shelltrap']},
				{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			],
			[
				{species: 'Turtonator', ability: 'shellarmor', moves: ['tackle', 'irondefense']},
				{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			],
		]);

		const move = battle.p1.active[0].getMoveData(Dex.moves.get('shelltrap'));
		battle.makeChoices('move shelltrap, move splash', 'move irondefense, move splash');
		assert.equal(move.pp, move.maxpp - 1);

		const cant = '|cant|p1a: Turtonator|Shell Trap|Shell Trap';
		assert.equal(battle.log.filter(m => m === cant).length, 1);

		battle.makeChoices('move shelltrap, move splash', 'move tackle 1, move splash');
		assert.equal(move.pp, move.maxpp - 2);
	});

	it('should not Z-power if hit by a Z-move', function () {
		battle = common.createBattle({}, [
			[{species: 'Turtonator', moves: ['shelltrap']}],
			[{species: 'Magikarp', item: 'normaliumz', moves: ['flail']}],
		]);
		battle.makeChoices('move shelltrap', 'move flail zmove');
		assert(battle.log.some(line => line.includes('|Shell Trap|')));
	});

	it('should not Max if hit by a Max move', function () {
		battle = common.gen(8).createBattle({}, [
			[{species: 'Turtonator', moves: ['shelltrap']}],
			[{species: 'Magikarp', moves: ['flail']}],
		]);
		battle.makeChoices('move shelltrap', 'move flail dynamax');
		assert(battle.log.some(line => line.includes('|Shell Trap|')));
	});
});
