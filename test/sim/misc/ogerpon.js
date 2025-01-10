'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`[Hackmons] Ogerpon`, function () {
	// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9838633
	it(`should keep permanent abilites after Terastallizing until it switches out`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerpon', ability: 'multitype', moves: ['sleeptalk']},
			{species: 'shedinja', moves: ['splash']},
		], [
			{species: 'silicobra', moves: ['stealthrock']},
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		assert.equal(ogerpon.ability, 'multitype', `Ogerpon's ability should not have changed to Embody Aspect`);
		battle.makeChoices('switch 2', 'auto');
		assert.equal(ogerpon.ability, 'embodyaspectteal', `Ogerpon's ability should be Embody Aspect after switching out`);
	});

	it(`can't Terastallize into a type other than Fire, Grass, Rock or Water`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['sleeptalk'], teraType: 'Electric'},
		], [
			{species: 'silicobra', moves: ['stealthrock']},
		]]);
		assert.throws(() => battle.makeChoices('move sleeptalk terastallize', 'auto'), "/Can't move: Ogerpon can't Terastallize./");
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`can Terastallize to a type other than its mask type`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerponwellspring', ability: 'waterabsorb', moves: ['ivycudgel'], teraType: 'Rock'},
		], [
			{species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock']},
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Rock');
		assert.fullHP(battle.p2.active[0]);
		assert(battle.log.includes('|detailschange|p1a: Ogerpon|Ogerpon-Cornerstone-Tera, F, tera:Rock') >= 0);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Tera form can Terastallize`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['ivycudgel'], teraType: 'Water'},
		], [
			{species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock']},
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Water');
		assert.fullHP(battle.p2.active[0]);
		assert(battle.log.includes('|detailschange|p1a: Ogerpon|Ogerpon-Wellspring-Tera, F, tera:Water') >= 0);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Tera form can Terastallize to a type other than its mask type`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['ivycudgel'], teraType: 'Rock'},
		], [
			{species: 'seismitoad', ability: 'waterabsorb', moves: ['stealthrock']},
		]]);
		const ogerpon = battle.p1.active[0];
		battle.makeChoices('move ivycudgel terastallize', 'auto');
		assert.species(ogerpon, 'Ogerpon-Wellspring-Tera');
		assert.equal(ogerpon.ability, 'embodyaspectwellspring');
		assert.statStage(ogerpon, 'spd', 1);
		assert.equal(ogerpon.getTypes().join(''), 'Rock');
		assert.fullHP(battle.p2.active[0]);
		assert(battle.log.includes('|detailschange|p1a: Ogerpon|Ogerpon-Cornerstone-Tera, F, tera:Rock') >= 0);
	});

	// https://www.smogon.com/forums/threads/ogerpon-teal-tera-tera-can-exist.3742851/post-10132811
	it(`Embody Aspect should not activate unless the user is Terastallized`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'ogerponwellspringtera', ability: 'embodyaspectwellspring', moves: ['sleeptalk'], teraType: 'Water'},
		], [
			{species: 'silicobra', moves: ['stealthrock']},
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
