'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Instruct`, () => {
	afterEach(() => battle.destroy());

	it(`should make the target reuse its last move`, () => {
		battle = common.createBattle([
			[{ species: "Cramorant", moves: ['stockpile'] }],
			[{ species: "Oranguru", moves: ['instruct'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].boosts.def, 2);
	});

	it(`should ignore moves called by Dancer`, () => {
		battle = common.createBattle([
			[{ species: "Murkrow", ability: "prankster", moves: ['aquastep', 'instruct'] }],
			[{ species: "Oricorio", ability: "dancer", moves: ['stockpile'] }],
		]);
		battle.makeChoices();
		battle.makeChoices('move instruct', 'auto');
		const oricorio = battle.p2.active[0];
		assert.equal(oricorio.boosts.def, 3);
		assert.equal(oricorio.boosts.spd, 3);
		assert.equal(oricorio.boosts.spe, 1);
	});

	it(`should not trigger AfterMove effects of the instructed move for the Instruct user`, () => {
		battle = common.createBattle([
			[{ species: "Swalot", moves: ['stockpile', 'spitup'] }],
			[{ species: "Duskull", moves: ['stockpile', 'instruct'] }],
		]);
		battle.makeChoices();
		battle.makeChoices('move spitup', 'move instruct');
		assert.equal(battle.p2.active[0].boosts.def, 1);
	});
});
