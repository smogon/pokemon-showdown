'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gulp Missile', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should retrieve a catch on the first turn of Dive`, function () {
		battle = common.createBattle([[
			{species: 'cramorant', ability: 'gulpmissile', moves: ['dive']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.species(battle.p1.active[0], 'Cramorant-Gulping');
	});

	it(`should retrieve a catch only if the move was successful`, function () {
		battle = common.createBattle([[
			{species: 'cramorant', ability: 'gulpmissile', moves: ['surf']},
		], [
			{species: 'lapras', ability: 'waterabsorb', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.false.species(battle.p1.active[0], 'Cramorant-Gulping');
	});

	it(`should not spit out its catch if the Cramorant is semi-invulnerable`, function () {
		battle = common.createBattle([[
			{species: 'cramorant', ability: 'gulpmissile', moves: ['dive']},
		], [
			{species: 'ludicolo', ability: 'noguard', moves: ['sleeptalk', 'machpunch']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move machpunch');
		assert.species(battle.p1.active[0], 'Cramorant-Gulping');
		assert.statStage(battle.p2.active[0], 'def', 0);
	});

	it(`should change forms before damage calculation`, function () {
		battle = common.createBattle([[
			{species: 'cramorant', ability: 'gulpmissile', moves: ['surf']},
		], [
			{species: 'sceptile', ability: 'shellarmor', moves: ['magicpowder']},
		]]);
		battle.makeChoices();
		const sceptile = battle.p2.active[0];
		const damage = sceptile.maxhp - sceptile.hp;
		assert.bounded(damage, [48, 57], `Cramorant should have received STAB in damage calculation`);
	});

	describe(`Hackmons Cramorant`, function () {
		it(`should be sent out as the hacked form`, function () {
			battle = common.createBattle([[
				{species: 'cramorantgulping', ability: 'gulpmissile', moves: ['sleeptalk']},
				{species: 'wynaut', moves: ['sleeptalk']},
			], [
				{species: 'togepi', moves: ['fairywind']},
			]]);
			battle.makeChoices();

			const togepi = battle.p2.active[0];
			assert.equal(togepi.hp, togepi.maxhp - Math.floor(togepi.maxhp / 4));
			assert.statStage(togepi, 'def', -1);
			battle.makeChoices('switch 2', 'auto');
			battle.makeChoices('switch 2', 'auto');
			assert.equal(togepi.hp, togepi.maxhp - (Math.floor(togepi.maxhp / 4) * 2));
			assert.statStage(togepi, 'def', -2);
		});

		it(`should not force Cramorant-Gorging or -Gulping to have Gulp Missile`, function () {
			battle = common.createBattle([[
				{species: 'cramorantgorging', ability: 'intimidate', moves: ['sleeptalk']},
			], [
				{species: 'togepi', moves: ['fairywind']},
			]]);
			battle.makeChoices();

			const togepi = battle.p2.active[0];
			assert.statStage(togepi, 'atk', -1);
		});
	});
});
