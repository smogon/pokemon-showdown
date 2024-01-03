'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Doodle', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should replace the Abilities of the user and its ally with the Ability of its target`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'shadowtag', moves: ['doodle']},
			{species: 'ironhands', ability: 'quarkdrive', moves: ['sleeptalk']},
		], [
			{species: 'clefable', ability: 'magicguard', moves: ['sleeptalk']},
			{species: 'mudkip', ability: 'torrent', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move doodle 1, auto', 'auto');
		assert.equal(battle.p1.active[0].ability, 'magicguard');
		assert.equal(battle.p1.active[1].ability, 'magicguard');
	});

	it(`should fail against certain Abilities`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'shadowtag', moves: ['doodle']},
			{species: 'ironhands', ability: 'quarkdrive', moves: ['sleeptalk']},
		], [
			{species: 'fluttermane', ability: 'protosynthesis', moves: ['sleeptalk']},
			{species: 'mudkip', ability: 'torrent', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move doodle 1, auto', 'auto');
		assert.equal(battle.p1.active[0].ability, 'shadowtag');
		assert.equal(battle.p1.active[1].ability, 'quarkdrive');
	});

	it(`should not fail if only the user has an unreplaceable Ability`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'komala', ability: 'comatose', moves: ['doodle']},
			{species: 'wynaut', ability: 'shadowtag', moves: ['swordsdance']},
		], [
			{species: 'clefable', ability: 'magicguard', moves: ['swordsdance']},
			{species: 'mudkip', ability: 'torrent', moves: ['swordsdance']},
		]]);
		battle.makeChoices('move doodle 1, auto', 'auto');
		assert.equal(battle.p1.active[0].ability, 'comatose');
		assert.equal(battle.p1.active[1].ability, 'magicguard');
		assert.false(battle.log.some(line => line.includes('|-fail')));
	});
});
