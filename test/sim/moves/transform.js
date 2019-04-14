'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Transform', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should copy the Pokemon\'s template', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Hoopa-Unbound", ability: 'magician', moves: ['rest']}]});
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should copy all stats except HP', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Mewtwo", ability: 'pressure', moves: ['rest']}]});
		battle.makeChoices('move transform', 'move rest');
		let p1poke = battle.p1.active[0];
		let p2poke = battle.p2.active[0];
		for (let stat in p1poke.stats) {
			assert.strictEqual(p1poke.stats[stat], p2poke.stats[stat]);
		}
		assert.notStrictEqual(p1poke.hp, p2poke.hp);
		assert.notStrictEqual(p1poke.maxhp, p2poke.maxhp);
	});

	it('should copy all stat changes', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'laggingtail', moves: ['calmmind', 'agility', 'transform']}]});
		battle.setPlayer('p2', {team: [{species: "Scolipede", ability: 'swarm', moves: ['honeclaws', 'irondefense', 'doubleteam']}]});
		for (let i = 1; i <= 3; i++) {
			battle.makeChoices('move ' + i, 'move ' + i);
		}
		let p1poke = battle.p1.active[0];
		let p2poke = battle.p2.active[0];
		for (let stat in p1poke.boosts) {
			assert.strictEqual(p1poke.boosts[stat], p2poke.boosts[stat]);
		}
	});

	it("should copy the target's focus energy status", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Sawk", ability: 'sturdy', moves: ['focusenergy']}]});
		battle.makeChoices('move transform', 'move focusenergy');
		assert.ok(battle.p1.active[0].volatiles['focusenergy']);
	});

	it('should copy the target\'s moves with 5 PP each', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Mew", ability: 'synchronize', moves: ['rest', 'psychic', 'energyball', 'hyperbeam']}]});
		let p1poke = battle.p1.active[0];
		let p2poke = battle.p2.active[0];
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(p1poke.moves.length, p2poke.moves.length);
		for (let i = 0; i < p1poke.moves.length; i++) {
			let move = p1poke.moves[i];
			assert.strictEqual(move, p2poke.moves[i]);
			move = battle.getMove(move);
			let movepp = p1poke.getMoveData(move);
			assert.strictEqual(movepp.pp, 5);
		}
	});

	it('should copy and activate the target\'s ability', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Arcanine", ability: 'intimidate', moves: ['rest']}]});
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});

	it('should not copy speed boosts from Unburden', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Hitmonlee", ability: 'unburden', item: 'normalgem', moves: ['feint']}]});
		battle.makeChoices('move transform', 'move feint');
		assert.notStrictEqual(battle.p1.active[0].getStat('spe'), battle.p2.active[0].getStat('spe'));
	});

	it('should fail against Pokemon with a Substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Mewtwo", ability: 'pressure', moves: ['substitute']}]});
		battle.makeChoices('move transform', 'move substitute');
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should fail against Pokemon with Illusion active', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [
			{species: "Zoroark", ability: 'illusion', moves: ['rest']},
			{species: "Mewtwo", ability: 'pressure', moves: ['rest']},
		]});
		battle.makeChoices('move transform', 'move rest');
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should fail against tranformed Pokemon', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [
			{species: "Magikarp", ability: 'rattled', moves: ['splash']},
			{species: "Mew", ability: 'synchronize', moves: ['transform']},
		]});
		battle.makeChoices('move transform', 'move splash');
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('move splash', 'move transform');
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it(`should copy the target's real type, even if the target is an Arceus`, function () {
		battle = common.createBattle([
			[{species: "Ditto", ability: 'limber', item: 'flameplate', moves: ['transform']}],
			[{species: "Arceus-Steel", ability: 'multitype', item: 'ironplate', moves: ['rest']}],
		]);
		battle.makeChoices('move transform', 'move rest');
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Steel"]);
	});

	it(`should ignore the effects of Roost`, function () {
		battle = common.createBattle([
			[{species: "Mew", ability: 'synchronize', moves: ['seismictoss', 'transform']}],
			[{species: "Talonflame", ability: 'flamebody', moves: ['roost']}],
		]);
		battle.makeChoices('move seismictoss', 'move roost');
		battle.makeChoices('move transform', 'move roost');
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Fire", "Flying"]);
	});
});

describe('Transform [Gen 5]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should not copy the target's focus energy status", function () {
		battle = common.gen(5).createBattle();
		battle.setPlayer('p1', {team: [{species: "Ditto", ability: 'limber', moves: ['transform']}]});
		battle.setPlayer('p2', {team: [{species: "Sawk", ability: 'sturdy', moves: ['focusenergy']}]});
		assert.constant(() => battle.p1.active[0].volatiles['focusenergy'], () => battle.makeChoices('move transform', 'move focusenergy'));
	});
});

describe('Transform [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should revert Pokemon transformed into Giratina-Origin to Giratina-Alternate if not holding a Griseous Orb', function () {
		battle = common.gen(4).createBattle([
			[{species: "Ditto", ability: 'limber', moves: ['transform']}],
			[{species: "Giratina-Origin", ability: 'levitate', item: 'griseousorb', moves: ['rest']}],
		]);
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(battle.p1.active[0].template.species, 'Giratina');
	});

	it('should cause Pokemon transformed into Giratina-Alternate to become Giratina-Origin if holding a Griseous Orb', function () {
		battle = common.gen(4).createBattle([
			[{species: "Ditto", ability: 'limber', item: 'griseousorb', moves: ['transform']}],
			[{species: "Giratina", ability: 'pressure', moves: ['rest']}],
		]);
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(battle.p1.active[0].template.species, 'Giratina-Origin');
	});

	it('should cause Pokemon transformed into Arceus to become an Arceus forme corresponding to its held Plate', function () {
		battle = common.gen(4).createBattle([
			[{species: "Ditto", ability: 'limber', item: 'flameplate', moves: ['transform']}],
			[{species: "Arceus-Steel", ability: 'multitype', item: 'ironplate', moves: ['rest']}],
		]);
		battle.makeChoices('move transform', 'move rest');
		assert.strictEqual(battle.p1.active[0].template.species, 'Arceus-Fire');
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Fire"]);
	});

	it('should succeed against a Substitute', function () {
		battle = common.gen(4).createBattle([
			[{species: "Ditto", ability: 'limber', moves: ['transform']}],
			[{species: "Mewtwo", ability: 'pressure', moves: ['substitute']}],
		]);
		battle.makeChoices('move transform', 'move substitute');
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});
});
