'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Assurance', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should double its base power if the target already took damage this turn`, function () {
		battle = common.createBattle([[
			{species: 'Sneasel', ability: 'sturdy', moves: ['assurance']},
		], [
			{species: 'Regieleki', ability: 'shellarmor', moves: ['wildcharge']},
		]]);
		const sneasel = battle.p1.active[0];
		const regi = battle.p2.active[0];
		regi.boostBy({atk: 6});
		battle.makeChoices();
		const recoil = Math.floor((sneasel.maxhp - 1) / 4);
		const assuRange = [214, 253];
		assert.bounded(regi.hp, [regi.maxhp - recoil - assuRange[1], regi.maxhp - recoil - assuRange[0]]);
	});

	it(`should double the power against damaged Pokemon, not damaged slots`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'bulbasaur', level: 1, moves: ['sleeptalk']},
			{species: 'landorus', moves: ['sleeptalk']},
		], [
			{species: 'alakazam', moves: ['psychic']},
			{species: 'pawniard', moves: ['assurance']},
		]]);
		battle.makeChoices('auto', 'move psychic 1, move assurance 1');
		const landorus = battle.p1.active[1];
		const damage = landorus.maxhp - landorus.hp;
		assert.bounded(damage, [63, 75]); // 60 BP; if it was 120 BP, it would be 124-147 damage
	});

	it(`should not double its base power if the target lost HP due to Pain Split`, function () {
		battle = common.createBattle([[
			{species: 'Greedent', moves: ['assurance']},
		], [
			{species: 'Wailord', moves: ['painsplit']},
		]]);
		battle.makeChoices();
		const greedent = battle.p1.active[0];
		const wailord = battle.p2.active[0];
		const painSplitHP = (greedent.maxhp + wailord.maxhp) / 2;
		const damage = painSplitHP - wailord.hp;
		assert.bounded(damage, [78, 92]);
	});
});
