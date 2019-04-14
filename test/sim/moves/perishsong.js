'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Perish Song', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should KO all Pokemon that heard it in 3 turns', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: "Primarina", ability: 'torrent', moves: ['perishsong', 'moonblast']},
			{species: "Magikarp", ability: 'swiftswim', moves: ['splash']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", ability: 'swiftswim', moves: ['splash']},
			{species: "Magikarp", ability: 'swiftswim', moves: ['splash']},
		]});
		battle.makeChoices('move perishsong, move splash', 'auto');
		// We've had a crash related to fainted Pokemon and Perish Song
		battle.makeChoices('move moonblast 1, move splash', 'auto');
		battle.makeChoices('auto', 'auto');
		battle.makeChoices('auto', 'auto');
		for (const active of battle.getAllActive()) {
			assert.fainted(active);
		}
	});
});
