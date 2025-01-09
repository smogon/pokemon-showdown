'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Revival Blessing', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should revive allies`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
			{species: 'wynaut', ability: 'runaway', moves: ['splash']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 3);
		assert.equal(battle.p1.pokemon[1].hp, Math.floor(battle.p1.pokemon[1].maxhp / 2));
	});

	it(`should not actually switch the active Pokemon`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
			{species: 'wynaut', ability: 'runaway', moves: ['splash']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.species(battle.p1.active[0], 'Zoroark');
	});

	it(`should let you revive even with one Pokemon remaining`, function () {
		battle = common.createBattle([[
			{species: 'corviknight', ability: 'runaway', moves: ['memento']},
			{species: 'zoroark', ability: 'runaway', moves: ['revivalblessing']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move memento', 'auto');
		battle.makeChoices('switch zoroark', '');
		battle.makeChoices('move revivalblessing', 'auto');
		assert.equal(battle.requestState, 'switch');
		battle.makeChoices('switch corviknight', '');
		assert.equal(battle.p1.pokemonLeft, 2);
	});

	it(`should send the Pokemon back in immediately if in an active slot in Doubles`, () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
			{species: 'shinx', ability: 'intimidate', moves: ['sleeptalk']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
			{species: 'chienpao', ability: 'noguard', moves: ['sheercold']},
		]]);
		battle.makeChoices('auto', 'move sleeptalk, move sheercold 2');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p2.active[0].boosts.atk, -2, "Intimidate should have activated again");
	});

	it(`shouldn't allow a fainted Pokemon to make its move the same turn after being revived`, () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
			{species: 'lycanrocmidnight', ability: 'noguard', item: 'laggingtail', moves: ['doubleteam']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
			{species: 'chienpao', ability: 'swordofruin', moves: ['sheercold']},
		]]);
		battle.makeChoices('auto', 'move sleeptalk, move sheercold 2');
		battle.makeChoices('switch 2', '');
		assert.equal(battle.p1.active[1].boosts.evasion, 0, "Lycanroc should not have used Double Team");
	});

	it(`should revert Ogerpon-Tera back to Ogerpon after being revived`, () => {
		battle = common.createBattle([[
			{species: 'ogerponwellspring', ability: 'waterabsorb', moves: ['memento']},
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const ogerpon = battle.p1.pokemon[0];
		battle.makeChoices('move memento terastallize', 'auto');
		battle.makeChoices('switch pawmot', '');
		battle.makeChoices();
		battle.makeChoices('switch 2', '');
		assert.species(ogerpon, 'Ogerpon-Wellspring');
		assert.equal(ogerpon.ability, 'waterabsorb', `Expected ${ogerpon}'ability to be Water Absorb, not ${ogerpon.baseAbility}`);
	});

	it(`shouldn't revert Terapagos-Terastal back to Terapagos after being revived`, () => {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento']},
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices('switch pawmot', '');
		battle.makeChoices();
		battle.makeChoices('switch 2', '');
		assert.species(terapagos, 'Terapagos-Terastal');
		assert.equal(terapagos.ability, 'terashell', `Expected ${terapagos}'ability to be Tera Shell, not ${terapagos.ability}`);
	});

	it(`should revert Terapagos-Stellar back to Terapagos after being revived`, () => {
		battle = common.createBattle([[
			{species: 'terapagos', ability: 'terashift', moves: ['memento']},
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const terapagos = battle.p1.active[0];
		battle.makeChoices('move memento terastallize', 'auto');
		battle.makeChoices('switch pawmot', '');
		battle.makeChoices();
		battle.makeChoices('switch 2', '');
		assert.species(terapagos, 'Terapagos');
		assert.equal(terapagos.ability, 'terashift', `Expected ${terapagos}'ability to be Tera Shift, not ${terapagos.ability}`);
	});

	it(`should revert Mega Evolutions back to their original form after being revived`, () => {
		battle = common.createBattle([[
			{species: 'alakazam', ability: 'synchronize', item: 'alakazite', moves: ['memento']},
			{species: 'pawmot', ability: 'naturalcure', moves: ['revivalblessing']},
		], [
			{species: 'mareep', ability: 'static', moves: ['sleeptalk']},
		]]);
		const alakazam = battle.p1.pokemon[0];
		battle.makeChoices('move memento mega', 'auto');
		battle.makeChoices('switch pawmot', '');
		battle.makeChoices();
		battle.makeChoices('switch 2', '');
		assert.species(alakazam, 'Alakazam');
		assert.equal(alakazam.ability, 'synchronize', `Expected ${alakazam}'ability to be Synchronize, not ${alakazam.baseAbility}`);
	});
});
