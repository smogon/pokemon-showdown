'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Substitute', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 25% of max HP, rounded down', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['recover']}]});
		battle.makeChoices('move substitute', 'move recover');
		const pokemon = battle.p1.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should not block the user\'s own moves from targetting itself', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute', 'calmmind']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['recover']}]});
		battle.makeChoices('move substitute', 'move recover');
		battle.makeChoices('move calmmind', 'move recover');
		assert.equal(battle.p1.active[0].boosts['spa'], 1);
		assert.equal(battle.p1.active[0].boosts['spd'], 1);
	});

	it('should block damage from most moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', item: 'laggingtail', moves: ['psystrike']}]});
		battle.makeChoices('move substitute', 'move psystrike');
		const pokemon = battle.p1.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should not block recoil damage', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute', 'doubleedge']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['nastyplot']}]});
		battle.makeChoices('move substitute', 'move nastyplot');
		battle.makeChoices('move doubleedge', 'move nastyplot');
		const pokemon = battle.p1.active[0];
		assert.notEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should take specific recoil damage in Gen 1', function () {
		battle = common.gen(1).createBattle([[
			{species: 'Hitmonlee', moves: ['substitute', 'highjumpkick']},
		], [
			{species: 'Hitmonchan', moves: ['substitute', 'agility']},
		]]);

		const hitmonlee = battle.p1.active[0];
		const hitmonchan = battle.p2.active[0];
		battle.makeChoices('move substitute', 'move substitute');

		const subhp = hitmonlee.volatiles['substitute'].hp;
		assert.equal(subhp, hitmonchan.volatiles['substitute'].hp);

		// Modding accuracy so High Jump Kick will miss and cause recoil
		battle.onEvent('Accuracy', battle.format, false);
		battle.makeChoices('move highjumpkick', 'move agility');

		// Both Pokemon had a substitute, so the *target* Substitute takes recoil damage.
		assert.equal(hitmonlee.maxhp - hitmonlee.hp, Math.floor(hitmonlee.maxhp / 4));
		assert.equal(hitmonlee.volatiles['substitute'].hp, subhp);

		assert.equal(hitmonchan.maxhp - hitmonchan.hp, Math.floor(hitmonchan.maxhp / 4));
		assert.equal(hitmonchan.volatiles['substitute'].hp, subhp - 1);

		// Modding accuracy so High Jump Kick will hit and break Substitute
		battle.onEvent('Accuracy', battle.format, true);
		battle.makeChoices('move highjumpkick', 'move agility');

		// Modding accuracy so High Jump Kick will miss and cause recoil
		battle.onEvent('Accuracy', battle.format, true);
		battle.makeChoices('move highjumpkick', 'move agility');

		// Only P1 has a substitute, so no one takes recoil damage.
		assert.equal(hitmonlee.maxhp - hitmonlee.hp, Math.floor(hitmonlee.maxhp / 4));
		assert.equal(hitmonlee.volatiles['substitute'].hp, subhp);
		assert.equal(hitmonchan.maxhp - hitmonchan.hp, Math.floor(hitmonchan.maxhp / 4));
	});

	it('should cause recoil damage from an opponent\'s moves to be based on damage dealt to the substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'noguard', moves: ['nastyplot', 'lightofruin']}]});
		battle.makeChoices('move substitute', 'move nastyplot');
		battle.makeChoices('move substitute', 'move lightofruin');
		const pokemon = battle.p2.active[0];
		assert.equal(pokemon.maxhp - pokemon.hp, Math.ceil(Math.floor(battle.p1.active[0].maxhp / 4) / 2));
	});

	it('should cause recovery from an opponent\'s draining moves to be based on damage dealt to the substitute', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Zangoose', ability: 'pressure', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Zangoose', ability: 'noguard', moves: ['bellydrum', 'drainpunch']}]});
		battle.makeChoices('move substitute', 'move bellydrum');
		const hp = battle.p2.active[0].hp;
		battle.makeChoices('move substitute', 'move drainpunch');
		assert.equal(battle.p2.active[0].hp - hp, Math.ceil(Math.floor(battle.p1.active[0].maxhp / 4) / 2));
	});

	it('should block most status moves targetting the user', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Mewtwo', ability: 'noguard', moves: ['substitute']}]});
		battle.setPlayer('p2', {team: [{species: 'Mewtwo', ability: 'pressure', item: 'laggingtail', moves: ['hypnosis', 'toxic', 'poisongas', 'thunderwave', 'willowisp']}]});
		for (let i = 1; i <= 5; i++) {
			battle.makeChoices('move substitute', 'move ' + i);
			assert.equal(battle.p1.active[0].status, '');
		}
	});

	it('should allow multi-hit moves to continue after the substitute fades', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Dragonite', ability: 'noguard', item: 'focussash', moves: ['substitute', 'roost']}]});
		battle.setPlayer('p2', {team: [{species: 'Dragonite', ability: 'hugepower', item: 'laggingtail', moves: ['roost', 'dualchop']}]});
		battle.makeChoices('move substitute', 'move roost');
		battle.makeChoices('move roost', 'move dualchop');
		assert.notEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it(`[Gen 1] should track what the actual damage would have been without the Substitute`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'Ponyta', moves: ['substitute', 'growl'], evs: {hp: 252, spd: 252}},
		], [
			{species: 'Cloyster', moves: ['clamp'], evs: {spa: 252}},
		]]);

		const ponyta = battle.p1.active[0];
		battle.makeChoices('move substitute', 'move clamp');
		assert.equal(ponyta.maxhp - ponyta.hp, Math.floor(ponyta.maxhp / 4));

		const hp = ponyta.hp;
		battle.makeChoices('move growl', 'move clamp');
		assert.bounded(hp - ponyta.hp, [91, 108]);
	});

	it(`[Gen 1] Substitute should not block secondary effect confusion if it is unbroken`, function () {
		battle = common.gen(1).createBattle({forceRandomChance: true}, [[
			{species: 'Magikarp', moves: ['psybeam']},
		], [
			{species: 'Alakazam', moves: ['substitute']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('confusion')));
	});
});
