'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pickpocket', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not steal a foe\'s item if switched out through Eject Button', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {
			team: [
				{species: 'Weavile', ability: 'pickpocket', item: 'ejectbutton', moves: ['agility']},
				{species: 'Chansey', ability: 'naturalcure', moves: ['softboiled']}],
		});
		battle.setPlayer('p2', {
			team: [
				{species: 'Sylveon', ability: 'cutecharm', item: 'choicescarf', moves: ['quickattack']}],
		});

		battle.makeChoices('move agility', 'move quickattack');
		assert.holdsItem(battle.p2.active[0], "The foe should not have their item stolen when in the process of switching out (e.g. through Eject Button)");
	});

	it('should steal a foe\'s item if hit by a normal attack', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {
			team: [
				{species: 'Weavile', ability: 'pickpocket', moves: ['agility']}],
		});
		battle.setPlayer('p2', {
			team: [
				{species: 'Sylveon', ability: 'cutecharm', item: 'choicescarf', moves: ['quickattack']}],
		});

		battle.makeChoices('move agility', 'move quickattack');
		assert.holdsItem(battle.p1.active[0], "The foe should have their item stolen");
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not steal a foe\'s item if forced to switch out', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {
			team: [
				{species: 'Weavile', ability: 'pickpocket', moves: ['agility']},
				{species: 'Chansey', ability: 'naturalcure', moves: ['softboiled']}],
		});
		battle.setPlayer('p2', {
			team: [
				{species: 'Duraludon', ability: 'stalwart', item: 'choicescarf', moves: ['dragontail']}],
		});

		battle.makeChoices('move agility', 'move dragontail');
		assert.holdsItem(battle.p2.active[0], "The Pickpocket Pokemon should not steal an item while being forced out");
	});
});
