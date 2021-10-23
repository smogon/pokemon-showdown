'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pickpocket', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should steal a foe's item if hit by a contact move`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', ability: 'pickpocket', moves: ['agility']},
		], [
			{species: 'Sylveon', item: 'choicescarf', moves: ['quickattack']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(battle.p2.active[0]);
	});

	it(`should not steal a foe's item if the Pickpocket user switched out through Eject Button`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', ability: 'pickpocket', item: 'ejectbutton', moves: ['agility']},
			{species: 'Chansey', moves: ['softboiled']},
		], [
			{species: 'Sylveon', item: 'choicescarf', moves: ['quickattack']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p2.active[0]);
	});

	it(`should not steal a foe's item if forced to switch out`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', ability: 'pickpocket', moves: ['agility']},
			{species: 'Chansey', moves: ['softboiled']},
		], [
			{species: 'Duraludon', ability: 'compoundeyes', item: 'choicescarf', moves: ['dragontail']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p2.active[0]);
	});

	it.skip(`should steal items back and forth when hit by a Magician user`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', ability: 'pickpocket', item: 'cheriberry', moves: ['agility']},
		], [
			{species: 'Klefki', ability: 'magician', moves: ['foulplay']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
		assert.false.holdsItem(battle.p2.active[0]);
	});
});
