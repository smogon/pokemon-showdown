'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Bulletproof', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should block ball and bomb moves`, () => {
		battle = common.createBattle([[
			{ species: 'Chesnaught', ability: 'bulletproof', moves: ['sleeptalk'] },
		], [
			{ species: 'Gengar', ability: 'levitate', moves: ['focusblast'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move focusblast');
		assert.fullHP(battle.p1.active[0]);
		assert(battle.log.some(line => line.includes('|-immune|') && line.includes('Bulletproof')));
	});

	it(`should block Acid Spray and prevent its stat drop`, () => {
		battle = common.createBattle([[
			{ species: 'Chesnaught', ability: 'bulletproof', moves: ['sleeptalk'] },
		], [
			{ species: 'Swalot', ability: 'liquidooze', moves: ['acidspray'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
		assert.statStage(battle.p1.active[0], 'spd', 0);
	});

	it(`should not block non-ball moves`, () => {
		battle = common.createBattle([[
			{ species: 'Chesnaught', ability: 'bulletproof', moves: ['sleeptalk'] },
		], [
			{ species: 'Gengar', ability: 'levitate', moves: ['psychic'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move psychic');
		assert.false.fullHP(battle.p1.active[0]);
	});

	it(`should block Magnet Bomb`, () => {
		battle = common.createBattle([[
			{ species: 'Chesnaught', ability: 'bulletproof', moves: ['sleeptalk'] },
		], [
			{ species: 'Magnezone', ability: 'magnetpull', moves: ['magnetbomb'] },
		]]);
		battle.makeChoices();
		assert.fullHP(battle.p1.active[0]);
	});

	it(`should be bypassed by Mold Breaker`, () => {
		battle = common.createBattle([[
			{ species: 'Chesnaught', ability: 'bulletproof', moves: ['sleeptalk'] },
		], [
			{ species: 'Rampardos', ability: 'moldbreaker', moves: ['focusblast'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move focusblast');
		assert.false.fullHP(battle.p1.active[0]);
	});
});
