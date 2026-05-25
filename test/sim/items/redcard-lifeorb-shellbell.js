'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Red Card vs attacker self-effects (#8504)', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not let Life Orb damage the attacker when Red Card switches them out (Gen 9)`, () => {
		battle = common.createBattle([[
			{ species: 'Blissey', item: 'redcard', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Furret', item: 'lifeorb', level: 50, moves: ['bodyslam'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		const furret = battle.p2.active[0];
		const startHp = furret.hp;
		battle.makeChoices();
		const furretAfter = battle.p2.pokemon.find(p => p.species.name === 'Furret');
		assert.false(furretAfter.isActive, "Red Card should switch Furret out");
		assert.equal(furretAfter.hp, startHp, "Life Orb should not damage Furret after Red Card switched it out");
	});

	it(`should not let Life Orb damage the attacker when Red Card switches them out (Gen 6)`, () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Blissey', item: 'redcard', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Furret', item: 'lifeorb', level: 50, moves: ['bodyslam'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		const furret = battle.p2.active[0];
		const startHp = furret.hp;
		battle.makeChoices();
		const furretAfter = battle.p2.pokemon.find(p => p.species.name === 'Furret');
		assert.false(furretAfter.isActive, "Red Card should switch Furret out");
		assert.equal(furretAfter.hp, startHp, "Life Orb should not damage Furret after Red Card switched it out");
	});

	it(`should not let Life Orb damage the attacker when Red Card switches them out (Gen 5)`, () => {
		battle = common.gen(5).createBattle([[
			{ species: 'Blissey', item: 'redcard', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Furret', item: 'lifeorb', level: 50, moves: ['bodyslam'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		const furret = battle.p2.active[0];
		const startHp = furret.hp;
		battle.makeChoices();
		const furretAfter = battle.p2.pokemon.find(p => p.species.name === 'Furret');
		assert.false(furretAfter.isActive, "Red Card should switch Furret out");
		assert.equal(furretAfter.hp, startHp, "Life Orb should not damage Furret after Red Card switched it out");
	});

	it(`should not let Shell Bell heal the attacker when Red Card switches them out`, () => {
		battle = common.createBattle([[
			{ species: 'Blissey', item: 'redcard', evs: { hp: 252, def: 252 }, moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Furret', item: 'shellbell', level: 50, moves: ['bodyslam'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		const furret = battle.p2.active[0];
		furret.hp = Math.floor(furret.maxhp / 3);
		const startHp = furret.hp;
		battle.makeChoices();
		const furretAfter = battle.p2.pokemon.find(p => p.species.name === 'Furret');
		assert.false(furretAfter.isActive, "Red Card should switch Furret out");
		assert.equal(furretAfter.hp, startHp, "Shell Bell should not heal Furret after Red Card switched it out");
	});

	it(`should still damage with Life Orb when Red Card fails to switch (Ingrain)`, () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Blissey', item: 'redcard', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Furret', item: 'lifeorb', level: 50, moves: ['ingrain', 'bodyslam'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'move ingrain');
		const furret = battle.p2.active[0];
		const startHp = furret.hp;
		battle.makeChoices('auto', 'move bodyslam');
		assert.species(battle.p2.active[0], 'Furret', "Furret should stay in (Ingrain blocks Red Card switch)");
		assert.equal(battle.p1.active[0].item, '', "Red Card should be consumed even against Ingrain");
		assert(furret.hp < startHp, "Life Orb should still damage Furret because no switch occurred");
	});

	it(`should suppress Life Orb damage on doubles spread move when Red Card triggers (Gen 6)`, () => {
		battle = common.gen(6).createBattle({ gameType: 'doubles' }, [[
			{ species: 'Blissey', item: 'redcard', moves: ['sleeptalk'] },
			{ species: 'Chansey', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'Garchomp', item: 'lifeorb', moves: ['earthquake'] },
			{ species: 'Snorlax', moves: ['sleeptalk'] },
			{ species: 'Gardevoir', moves: ['sleeptalk'] },
		]]);
		const garchomp = battle.p2.active[0];
		const startHp = garchomp.hp;
		battle.makeChoices('auto', 'move earthquake, move sleeptalk');
		const garchompAfter = battle.p2.pokemon.find(p => p.species.name === 'Garchomp');
		assert.false(garchompAfter.isActive, "Red Card should switch Garchomp out");
		assert.equal(garchompAfter.hp, startHp, "Life Orb should not damage Garchomp after Red Card switched it out");
	});
});
