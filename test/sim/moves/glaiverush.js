'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Glaive Rush', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the user to take double damage after use`, function () {
		battle = common.createBattle([[
			{species: 'Baxcalibur', ability: 'battlearmor', moves: ['glaiverush']},
		], [
			{species: 'Skeledirge', moves: ['shadowball']},
		]]);
		battle.makeChoices();
		const baxcalibur = battle.p1.active[0];
		const damage = baxcalibur.maxhp - baxcalibur.hp;
		assert.bounded(damage, [212, 252]); // If it wasn't doubled, range would be 106-126
	});

	it(`should cause moves to never miss the user after use`, function () {
		battle = common.createBattle([[
			{species: 'Baxcalibur', ability: 'battlearmor', moves: ['glaiverush']},
		], [
			{species: 'Dondozo', moves: ['fissure']},
		]]);
		battle.makeChoices();
		assert.fainted(battle.p1.active[0]);
	});

	it(`should only apply its drawback until the user's next turn`, function () {
		battle = common.createBattle([[
			{species: 'Baxcalibur', ability: 'battlearmor', item: 'safetygoggles', moves: ['glaiverush', 'shoreup']},
		], [
			{species: 'Tyranitar', ability: 'sandstream', moves: ['icepunch']},
		]]);
		const baxcalibur = battle.p1.active[0];
		battle.makeChoices();
		let damage = baxcalibur.maxhp - baxcalibur.hp;
		assert.bounded(damage, [150, 178]); // If it wasn't doubled, range would be 75-89

		battle.makeChoices('move shoreup', 'auto');
		damage = baxcalibur.maxhp - baxcalibur.hp;
		assert.bounded(damage, [75, 89]); // If it was doubled, range would be 150-178
	});
});
