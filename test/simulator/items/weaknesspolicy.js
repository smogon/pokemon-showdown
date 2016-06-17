'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weakness Policy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be triggered by super effective hits', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lucario", ability: 'justified', moves: ['aurasphere']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']}]);
		const holder = battle.p2.active[0];
		battle.commitDecisions();
		assert.false.holdsItem(holder);
		assert.statStage(holder, 'atk', 2);
		assert.statStage(holder, 'spa', 2);
	});

	it('should not be triggered by fixed damage moves', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Lucario", ability: 'justified', moves: ['seismictoss']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']}]);
		const holder = battle.p2.active[0];
		battle.commitDecisions();
		assert.holdsItem(holder);
		assert.statStage(holder, 'atk', 0);
		assert.statStage(holder, 'spa', 0);
	});
});
