'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Magic Room', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate residual healing events', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Lopunny", ability: 'limber', item: 'leftovers', moves: ['bellydrum']}]});
		battle.setPlayer('p2', {team: [{species: "Giratina", ability: 'pressure', moves: ['magicroom']}]});
		battle.makeChoices('move bellydrum', 'move magicroom');
		assert.equal(battle.p1.active[0].hp, Math.ceil(battle.p1.active[0].maxhp / 2));
	});

	it('should prevent items from being consumed', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Lopunny", ability: 'limber', item: 'chopleberry', moves: ['magicroom']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", ability: 'noguard', moves: ['lowkick']}]});
		battle.makeChoices('move magicroom', 'move lowkick');
		assert.equal(battle.p1.active[0].item, 'chopleberry');
	});

	it('should ignore the effects of items that disable moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Lopunny", ability: 'limber', item: 'assaultvest', moves: ['protect']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", ability: 'noguard', moves: ['magicroom']}]});
		battle.makeChoices('default', 'move magicroom');
		assert.equal(battle.p1.active[0].lastMove.id, 'struggle');
		battle.makeChoices('default', 'move magicroom');
		assert.equal(battle.p1.active[0].lastMove.id, 'protect');
	});

	it('should cause Fling to fail', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Lopunny", ability: 'limber', item: 'seaincense', moves: ['fling']}]});
		battle.setPlayer('p2', {team: [{species: "Sableye", ability: 'prankster', moves: ['magicroom']}]});
		battle.makeChoices('move fling', 'move magicroom');
		assert.equal(battle.p1.active[0].item, 'seaincense');
	});

	it('should not prevent Pokemon from Mega Evolving', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Lopunny", ability: 'limber', item: 'lopunnite', moves: ['bulkup']}]});
		battle.setPlayer('p2', {team: [{species: "Golem", ability: 'noguard', moves: ['magicroom', 'rest']}]});
		battle.makeChoices('move bulkup', 'move magicroom');
		battle.makeChoices('move bulkup mega', 'move rest');
		assert.equal(battle.p1.active[0].species.id, 'lopunnymega');
	});

	it('should not prevent Primal Reversion', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: "Zapdos", ability: 'pressure', moves: ['voltswitch']},
			{species: "Groudon", ability: 'drought', item: 'redorb', moves: ['protect']},
		]});
		battle.setPlayer('p2', {team: [{species: "Meowstic", ability: 'prankster', moves: ['magicroom']}]});
		battle.makeChoices('move voltswitch', 'move magicroom');
		battle.makeChoices('switch groudon', '');
		assert.equal(battle.p1.active[0].species.id, 'groudonprimal');
	});
});
