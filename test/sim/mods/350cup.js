'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('350 Cup Mod', function () {
	this.afterEach(function () {
		battle.destroy();
	});

	it('Should double a Pokemon\'s base stats if it\'s BST is 350 or lower', function () {
		battle = common.createBattle({threeFiftyCupMod: true});
		battle.setPlayer('p1', {team: [{species: 'Bulbasaur', moves: ['tackle']}]});
		battle.setPlayer('p2', {team: [{species: 'Squirtle', moves: ['tackle']}]});

		const bulbasaur = battle.p1.active[0];

		const atk = bulbasaur.getStat('atk');
		const def = bulbasaur.getStat('def');
		const spa = bulbasaur.getStat('spa');
		const spd = bulbasaur.getStat('spd');
		const spe = bulbasaur.getStat('spe');

		console.log(bulbasaur.base)

		assert.equal(atk, 98);
		assert.equal(def, 124);
		assert.equal(spa, 130);
		assert.equal(spd, 130);
		assert.equal(spe, 90);
	});

	it('Should not raise any of a Pokemon\'s individual stats above 255', function () {
		battle = common.createBattle({threeFiftyCupMod: true});
		battle.setPlayer('p1', {team: [{species: 'Onix', moves: ['tackle']}]});
		battle.setPlayer('p2', {team: [{species: 'Squirtle', moves: ['tackle']}]});

		const onix = battle.p1.active[0];

		const def = onix.getStat('def');

		assert.equal(def, 255);
	});
});
