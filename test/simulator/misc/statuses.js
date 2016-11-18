'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Burn', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/16 of max HP at the end of the turn, rounded down', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['willowisp']}],
		]);
		const target = battle.p1.active[0];
		assert.hurtsBy(target, Math.floor(target.maxhp / 16), () => battle.commitDecisions());
	});

	it('should halve damage from most Physical attacks', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['boneclub']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['splash', 'willowisp']}],
		]);
		const target = battle.p2.active[0];
		battle.commitDecisions();
		const baseDamage = target.maxhp - target.hp;
		battle.seed = battle.startingSeed.slice();
		battle.p2.chooseMove('willowisp');
		assert.hurtsBy(target, battle.modify(baseDamage, 0.5), () => battle.commitDecisions());
	});

	it('should not halve damage from moves with set damage', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['seismictoss']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['willowisp']}],
		]);
		assert.hurtsBy(battle.p2.active[0], 100, () => battle.commitDecisions());
	});
});

describe('Paralysis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce speed to 50% of its original value', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.5));
	});
});

describe('Toxic Poison', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/16 of max HP rounded down, times the number of active turns with the status, at the end of the turn', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'naturalcure', moves: ['softboiled']}],
			[{species: 'Gengar', ability: 'levitate', moves: ['toxic']}],
		]);
		const target = battle.p1.active[0];
		for (let i = 1; i <= 8; i++) {
			battle.commitDecisions();
			assert.strictEqual(target.maxhp - target.hp, Math.floor(target.maxhp / 16) * i);
		}
	});

	it('should reset the damage counter when the Pokemon switches out', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['counter']}, {species: 'Snorlax', ability: 'immunity', moves: ['curse']}],
			[{species: 'Crobat', ability: 'infiltrator', moves: ['toxic', 'whirlwind']}],
		]);
		for (let i = 0; i < 4; i++) {
			battle.commitDecisions();
		}
		let pokemon = battle.p1.active[0];
		pokemon.hp = pokemon.maxhp;
		battle.p1.chooseSwitch(2).foe.chooseMove('whirlwind');
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
	});
});

describe('Burn [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/8 of max HP at the end of the turn, rounded down', function () {
		battle = common.gen(6).createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['willowisp']}],
		]);
		const target = battle.p1.active[0];
		assert.hurtsBy(target, Math.floor(target.maxhp / 8), () => battle.commitDecisions());
	});
});

describe('Paralysis [Gen 6]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce speed to 25% of its original value', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});
});

describe('Toxic Poison [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should affect Leech Seed damage counter', function () {
		battle = common.gen(1).createBattle([
			[{species: 'Venusaur', moves: ['toxic', 'leechseed']}],
			[{species: 'Chansey', moves: ['splash']}],
		]);
		battle.commitDecisions();
		let pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		// (1/16) + (2/16) + (3/16) = (6/16)
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 6);
	});
});
