'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`Ogerpon`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should reject the Terastallization choice while Transformed into Ogerpon`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ditto', ability: 'imposter', moves: ['sleeptalk'] },
		], [
			{ species: 'ogerpon', ability: 'defiant', moves: ['sleeptalk'], teraType: 'Grass' },
		]]);

		assert.throws(() => battle.makeChoices('move sleeptalk terastallize', 'auto'));
	});

	// this test passes, but there isn't a way to create a battle for a mod without a format
	it.skip(`[DLC1] should accept the Terastallization choice, but not Terastallize while Transformed into Ogerpon`, () => {
		battle = battle = common.gen(9).createBattle({ formatid: 'gen9dlc1@@@!teampreview' }, [[
			{ species: 'ditto', ability: 'imposter', moves: ['sleeptalk'] },
		], [
			{ species: 'ogerpon', ability: 'defiant', moves: ['sleeptalk'], teraType: 'Grass' },
		]]);

		battle.makeChoices('move sleeptalk terastallize', 'auto');

		const ditto = battle.p1.active[0];
		assert.false(!!ditto.terastallized);
	});
});

describe(`[Hackmons] Ogerpon`, () => {
	afterEach(() => {
		battle.destroy();
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9838633
	it(`should keep permanent abilities after Terastallizing until it switches out`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerpon', ability: 'multitype', moves: ['sleeptalk'] },
			{ species: 'shedinja', moves: ['splash'] },
		], [
			{ species: 'silicobra', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.equal(ogerpon.ability, 'multitype', `Ogerpon's ability should not have changed to Embody Aspect`);
		battle.makeChoices('switch 2', 'auto');
		assert.equal(ogerpon.ability, 'embodyaspectteal', `Ogerpon's ability should be Embody Aspect after switching out`);
	});

	it(`won't Terastallize into a type other than Fire, Grass, Rock or Water`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['sleeptalk'], teraType: 'Electric' },
		], [
			{ species: 'silicobra', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.false(!!ogerpon.terastallized);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`can Terastallize into the type of another mask`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspring', ability: 'waterabsorb', moves: ['ivycudgel'], teraType: 'Rock' },
		], [
			{ species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Rock');
		assert.fullHP(battle.p2.active[0]);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Tera form can Terastallize`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['ivycudgel'], teraType: 'Water' },
		], [
			{ species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Water');
		assert.fullHP(battle.p2.active[0]);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Tera form can Terastallize into the type of another mask`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['ivycudgel'], teraType: 'Rock' },
		], [
			{ species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Rock');
		assert.fullHP(battle.p2.active[0]);
	});

	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-10404934
	it(`can Terastallize into any type if transformed, but it won't change form`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspring', ability: 'waterabsorb', moves: ['transform', 'ivycudgel'], teraType: 'Fairy' },
			{ species: 'silicobra', moves: ['stealthrock'] },
		], [
			{ species: 'seismitoad', ability: 'waterabsorb', moves: ['sleeptalk'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move transform', 'auto');
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.equal(ogerpon.baseSpecies.name, 'Ogerpon-Wellspring');
		assert.species(ogerpon, 'Seismitoad');
		assert.equal(ogerpon.getTypes().join(''), 'Fairy');

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('move ivycudgel', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring');
		assert.equal(ogerpon.ability, 'waterabsorb');
		assert.statStage(ogerpon, 'spd', 0);
		assert.equal(ogerpon.getTypes().join(''), 'Fairy');
		assert.fullHP(battle.p2.active[0]);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Embody Aspect should not activate unless the user is Terastallized`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['sleeptalk'], teraType: 'Water' },
		], [
			{ species: 'silicobra', moves: ['stealthrock'] },
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices();
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.statStage(ogerpon, 'spd', 0);
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.statStage(ogerpon, 'spd', 1);
	});
});
