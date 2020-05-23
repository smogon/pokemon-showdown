'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should overwrite normally immutable abilities', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Metagross", ability: 'comatose', item: 'metagrossite', moves: ['metalclaw']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Wishiwashi", ability: 'schooling', moves: ['uturn']},
		]});
		const megaMon = battle.p1.active[0];
		battle.makeChoices('move metalclaw mega', 'move uturn');
		assert.equal(megaMon.ability, 'toughclaws');
	});

	it('[Hackmons] should be able to override different formes but not same forme', function () {
		battle = common.createBattle([[
			{species: "Charizard-Mega-Y", item: 'charizarditex', moves: ['protect']},
		], [
			{species: "Kangaskhan-Mega", item: 'kangaskhanite', moves: ['protect']},
		]]);
		assert.equal(battle.p1.active[0].species.name, 'Charizard-Mega-Y');
		assert.throws(() => {
			battle.makeChoices('move protect mega', 'move protect mega');
		});
		battle.makeChoices('move protect mega', 'move protect');
		assert.equal(battle.p1.active[0].species.name, 'Charizard-Mega-X');
	});

	it('should modify speed/priority in gen 7+', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Metagross", ability: 'prankster', item: 'metagrossite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Wishiwashi", ability: 'prankster', moves: ['thunderwave']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		let megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, 'par');

		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Garchomp", ability: 'runaway', item: 'garchompite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Jirachi", ability: 'runaway', moves: ['glare']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, 'par');

		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Diancie", ability: 'runaway', item: 'diancite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Jirachi", ability: 'runaway', moves: ['glare']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, '');

		battle = common.gen(7).createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Metagross", ability: 'prankster', item: 'metagrossite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Wishiwashi", ability: 'prankster', moves: ['thunderwave']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, 'par');

		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Metagross", ability: 'prankster', item: 'metagrossite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Wishiwashi", ability: 'prankster', moves: ['thunderwave']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, '');

		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Garchomp", ability: 'runaway', item: 'garchompite', moves: ['taunt']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Jirachi", ability: 'runaway', moves: ['glare']},
		]});
		battle.makeChoices('move taunt mega', 'auto');
		megaMon = battle.p1.active[0];
		assert.equal(megaMon.status, '');
	});

	it('should not break priority', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Metagross", ability: 'quickfeet', item: 'metagrossite', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [
			{species: "Ninjask", ability: 'quickfeet', moves: ['thunderwave']},
		]});
		const megaMon = battle.p1.active[0];
		battle.makeChoices('move protect mega', 'auto');
		assert.equal(megaMon.status, '');
	});
});
