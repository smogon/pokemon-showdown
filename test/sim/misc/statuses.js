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
		battle.setPlayer('p1', {team: [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]});
		battle.setPlayer('p2', {team: [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]});
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.5));
	});

	it('should reduce speed to 25% of its original value in Gen 6', function () {
		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]});
		battle.setPlayer('p2', {team: [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]});
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reduce speed to 25% of its original value in Gen 2', function () {
		battle = common.gen(2).createBattle();
		battle.setPlayer('p1', {team: [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]});
		battle.setPlayer('p2', {team: [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]});
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move aquaring', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reduce speed to 25% of its original value in Stadium', function () {
		battle = common.createBattle({formatid: 'gen1stadiumou@@@!teampreview'}, [
			[{species: 'Vaporeon', moves: ['growl']}],
			[{species: 'Jolteon', moves: ['thunderwave']}],
		]);
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move growl', 'move thunderwave');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should reapply its speed drop when an opponent uses a stat-altering move in Gen 1', function () {
		battle = common.gen(1).createBattle([
			[{species: 'Electrode', moves: ['rest']}],
			[{species: 'Slowpoke', moves: ['amnesia', 'thunderwave']}],
		]);
		battle.makeChoices('move rest', 'move thunderwave');
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move rest', 'move amnesia');
		assert.equal(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});

	it('should not reapply its speed drop when an opponent uses a failed stat-altering move in Gen 1', function () {
		battle = common.gen(1).createBattle([
			[{species: 'Electrode', moves: ['rest']}],
			[{species: 'Slowpoke', moves: ['amnesia', 'thunderwave']}],
		]);
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move amnesia');
		battle.makeChoices('move rest', 'move thunderwave');
		const speed = battle.p1.active[0].getStat('spe');
		battle.makeChoices('move rest', 'move amnesia');
		assert.equal(battle.p1.active[0].getStat('spe'), speed);
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
			assert.equal(target.maxhp - target.hp, Math.floor(target.maxhp / 16) * i);
		}
	});

	it('should reset the damage counter when the Pokemon switches out', function () {
		battle = common.createBattle([
			[{species: 'Chansey', ability: 'serenegrace', moves: ['counter']}, {species: 'Snorlax', ability: 'immunity', moves: ['curse']}],
			[{species: 'Crobat', ability: 'infiltrator', moves: ['toxic', 'whirlwind']}],
		]);
		for (let i = 0; i < 4; i++) {
			battle.makeChoices('move counter', 'move toxic');
		}
		const pokemon = battle.p1.active[0];
		pokemon.hp = pokemon.maxhp;
		battle.makeChoices('switch 2', 'move whirlwind');
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
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
		battle.onEvent('ModifyMove', battle.format, function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move icebeam', 'move sleeptalk');
		assert.equal(battle.p2.active[0].status, 'frz');
		assert.equal(battle.p2.active[0].species.name, 'Shaymin');
	});

	it('should not cause an afflicted Pokemon transformed into Shaymin-Sky to change to Shaymin', function () {
		battle = common.createBattle([
			[{species: 'Ditto', ability: 'imposter', moves: ['transform']}],
			[{species: 'Shaymin-Sky', ability: 'sturdy', moves: ['icebeam', 'sleeptalk']}],
		]);
		battle.onEvent('ModifyMove', battle.format, function (move) {
			if (move.secondaries) {
				this.debug('Freeze test: Guaranteeing secondary');
				for (const secondary of move.secondaries) {
					secondary.chance = 100;
				}
			}
		});
		battle.makeChoices('move sleeptalk', 'move icebeam');
		assert.equal(battle.p1.active[0].status, 'frz');
		assert.equal(battle.p1.active[0].species.name, 'Shaymin-Sky');
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
		const pokemon = battle.p2.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.makeChoices('move leechseed', 'move splash');
		// (1/16) + (2/16) + (3/16) = (6/16)
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 6);
	});
});


describe('Toxic Poison [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not affect Leech Seed damage counter', function () {
		battle = common.gen(2).createBattle([
			[{species: 'Venusaur', moves: ['toxic', 'leechseed']}],
			[{species: 'Chansey', moves: ['splash']}],
		]);
		battle.makeChoices('move toxic', 'move splash');
		const pokemon = battle.p2.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.makeChoices('move leechseed', 'move splash');
		// (1/16) + (2/16) + (1/8) = (5/16)
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 5);
	});

	it('should pass the damage counter to Pokemon with Baton Pass', function () {
		battle = common.gen(2).createBattle([
			[{species: 'Smeargle', moves: ['toxic', 'sacredfire', 'splash']}],
			[
				{species: 'Chansey', moves: ['splash']},
				{species: 'Celebi', moves: ['batonpass', 'splash']},
			],
		]);
		battle.resetRNG(); // Guarantee Sacred Fire burns
		battle.makeChoices('move sacredfire', 'move splash');
		const pokemon = battle.p2.active[0];
		battle.resetRNG(); // Guarantee Toxic hits.
		battle.makeChoices('move toxic', 'switch 2');
		battle.makeChoices('move splash', 'move splash');
		battle.makeChoices('move splash', 'move splash');
		battle.makeChoices('move splash', 'move batonpass');
		battle.makeChoices('', 'switch 2');
		let hp = pokemon.hp;
		battle.makeChoices('move splash', 'move splash');
		assert.equal(hp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 4);

		// Only hint about this once per battle, not every turn.
		assert.equal(battle.log.filter(m => m.startsWith('|-hint')).length, 1);

		// Damage counter should be removed on regular switch out
		battle.makeChoices('move splash', 'switch 2');
		hp = pokemon.hp;
		battle.makeChoices('move splash', 'switch 2');
		assert.equal(hp - pokemon.hp, Math.floor(pokemon.maxhp / 8));
	});

	it('should revert to regular poison on switch in, even for Poison types', function () {
		battle = common.gen(2).createBattle([
			[{species: 'Smeargle', moves: ['toxic', 'splash']}],
			[
				{species: 'Qwilfish', moves: ['transform', 'splash']},
				{species: 'Gengar', moves: ['nightshade']},
			],
		]);
		battle.makeChoices('move toxic', 'move transform');
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('move splash', 'switch 2');
		// We could check 'psn' at this point, but the following line caused crashes
		// before #5463 was fixed so its useful to execute for regression testing purposes.
		battle.makeChoices('move splash', 'move splash');
		assert.equal(battle.p2.active[0].status, 'psn');
	});

	it('should not have its damage counter affected by Heal Bell', function () {
		battle = common.gen(2).createBattle([
			[{species: 'Smeargle', moves: ['toxic', 'sacredfire', 'splash']}],
			[{species: 'Chansey', moves: ['splash', 'healbell']}],
		]);
		battle.makeChoices('move toxic', 'move splash');
		const pokemon = battle.p2.active[0];
		battle.makeChoices('move splash', 'move healbell');
		battle.resetRNG(); // Guarantee Sacred Fire burns
		battle.makeChoices('move sacredfire', 'move splash');
		let hp = pokemon.hp;
		battle.makeChoices('move splash', 'move splash');
		assert.equal(hp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 3);
		hp = pokemon.hp;

		battle.makeChoices('move splash', 'move healbell');
		battle.resetRNG(); // Guarantee Toxic hits
		battle.makeChoices('move toxic', 'move splash');
		// Toxic counter should be reset by a successful Toxic
		assert.equal(hp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
	});
});
