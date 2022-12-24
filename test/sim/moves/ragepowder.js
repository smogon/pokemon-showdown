'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const Sim = require('./../../../dist/sim');

let battle;

describe('Rage Powder', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should redirect single-target moves towards it if it is a valid target', function () {
		this.timeout(5000);

		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: 'Amoonguss', ability: 'overcoat', item: 'safetygoggles', moves: ['ragepowder']},
			{species: 'Venusaur', ability: 'overcoat', moves: ['growth']},
			{species: 'Ivysaur', ability: 'overcoat', moves: ['growth']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Abra', ability: 'synchronize', moves: ['absorb']},
			{species: 'Kadabra', ability: 'synchronize', moves: ['absorb']},
			{species: 'Alakazam', ability: 'synchronize', moves: ['absorb']},
		]});
		const hitCount = [0, 0, 0];
		battle.p1.active[0].damage = function (...args) {
			hitCount[0]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.p1.active[1].damage = function (...args) {
			hitCount[1]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.p1.active[2].damage = function (...args) {
			hitCount[2]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.makeChoices('move ragepowder, move growth, move growth', 'move absorb 2, move absorb 2, move absorb 2');
		assert.equal(hitCount[0], 2);
		assert.equal(hitCount[1], 1);
		assert.equal(hitCount[2], 0);
	});

	it('should not affect Pokemon with Powder immunities', function () {
		battle = common.gen(5).createBattle({gameType: 'triples'});
		battle.setPlayer('p1', {team: [
			{species: 'Amoonguss', ability: 'overcoat', moves: ['growth']},
			{species: 'Venusaur', ability: 'overcoat', moves: ['ragepowder']},
			{species: 'Ivysaur', ability: 'overcoat', moves: ['growth']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Squirtle', ability: 'naturalcure', moves: ['absorb']},
			{species: 'Escavalier', ability: 'overcoat', moves: ['absorb']},
			{species: 'Alakazam', ability: 'synchronize', item: 'safetygoggles', moves: ['absorb']},
		]});
		const hitCount = [0, 0, 0];
		battle.p1.active[0].damage = function (...args) {
			hitCount[0]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.p1.active[1].damage = function (...args) {
			hitCount[1]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.p1.active[2].damage = function (...args) {
			hitCount[2]++;
			return Sim.Pokemon.prototype.damage.apply(this, args);
		};
		battle.makeChoices('move growth, move ragepowder, move growth', 'move absorb 3, move absorb 1, move absorb 1');
		assert.equal(hitCount[0], 2);
		assert.equal(hitCount[1], 1);
		assert.equal(hitCount[2], 0);
	});
});
