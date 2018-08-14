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
		assert.hurtsBy(target, Math.floor(target.maxhp / 16), () => battle.makeChoices('move bulkup', 'move willowisp'));
	});

	it('should halve damage from most Physical attacks', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['boneclub']}],
			[{species: 'Sableye', ability: 'prankster', moves: ['splash', 'willowisp']}],
		]);
		const target = battle.p2.active[0];
		battle.makeChoices('move boneclub', 'move splash');
		// hardcoded to RNG
		assert.hurtsBy(target, 64, () => battle.makeChoices('move boneclub', 'move willowisp'));
	});

	it('should not halve damage from moves with set damage', function () {
		battle = common.createBattle([
			[{species: 'Machamp', ability: 'noguard', moves: ['seismictoss']}],
			[{species: 'Talonflame', ability: 'galewings', moves: ['willowisp']}],
		]);
		assert.hurtsBy(battle.p2.active[0], 100, () => battle.makeChoices('move seismictoss', 'move willowisp'));
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
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.5));
	});

	it('should reduce speed to 25% of its original value in Gen 6', function () {
		battle = common.gen(6).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reduce speed to 25% of its original value in Gen 2', function () {
		battle = common.gen(2).createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]);
		let speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
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
			battle.makeChoices('move softboiled', 'move toxic');
			assert.strictEqual(target.maxhp - target.hp, Math.floor(target.maxhp / 16) * i);
		}
	});

	it('should reset the damage counter when the Pokemon switches out', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['counter']}, {species: 'Snorlax', ability: 'immunity', moves: ['curse']}],
			[{species: 'Crobat', ability: 'infiltrator', moves: ['toxic', 'whirlwind']}],
		]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices('move curse', 'move toxic');
		}
		let pokemon = battle.p1.active[0];
		pokemon.hp = pokemon.maxhp;
		battle.makeChoices('switch 2', 'move whirlwind');
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
	});
});

describe('Freeze', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should cause an afflicted Shaymin-Sky to revert to its base forme', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['icebeam']}],
			[{species: 'Shaymin-Sky', ability: 'sturdy', moves: ['sleeptalk']}],
		]);
		// I didn't feel like manually testing seed after seed. Sue me.
		battle.onEvent('ModifyMove', battle.getFormat(), function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move icebeam', 'move sleeptalk');
		assert.strictEqual(battle.p2.active[0].status, 'frz');
		assert.strictEqual(battle.p2.active[0].template.species, 'Shaymin');
	});

	it('should not cause an afflicted Pokemon transformed into Shaymin-Sky to change to Shaymin', function () {
		battle = common.createBattle([
			[{species: 'Ditto', ability: 'imposter', moves: ['transform']}],
			[{species: 'Shaymin-Sky', ability: 'sturdy', moves: ['icebeam', 'sleeptalk']}],
		]);
		battle.onEvent('ModifyMove', battle.getFormat(), function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move sleeptalk', 'move icebeam');
		assert.strictEqual(battle.p1.active[0].status, 'frz');
		assert.strictEqual(battle.p1.active[0].template.species, 'Shaymin-Sky');
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
		assert.hurtsBy(target, Math.floor(target.maxhp / 8), () => battle.makeChoices('move bulkup', 'move willowisp'));
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
		battle.makeChoices('move toxic', 'move splash');
		let pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.makeChoices('move leechseed', 'move splash');
		// (1/16) + (2/16) + (3/16) = (6/16)
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 6);
	});
});
