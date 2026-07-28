'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Red Card', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not trigger if the target should be KOed from Destiny Bond and also not crash the client`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Aggron", item: 'redcard', moves: ['rockslide'] },
			{ species: "Wynaut", ability: 'prankster', level: 1, moves: ['destinybond'] },
		], [
			{ species: "Conkeldurr", moves: ['sleeptalk'] },
			{ species: "Gardevoir", moves: ['strugglebug'] },
			{ species: "Corsola", moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0], "Red Card should not be consumed");
		assert.fainted(battle.p1.pokemon[1], "Gardevoir should faint from Aggron's Destiny Bond");
	});

	it(`should trigger if the target is still in battle`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Aggron", item: 'redcard', moves: ['rockslide'] },
			{ species: "Wynaut", ability: 'prankster', level: 1, moves: ['sleeptalk'] },
		], [
			{ species: "Conkeldurr", moves: ['sleeptalk'] },
			{ species: "Gardevoir", moves: ['strugglebug'] },
			{ species: "Corsola", moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], "Red Card should be consumed.");
		assert.species(battle.p2.active[1], "Corsola", "Corsola should be dragged in by Red Card");
	});

	describe('[Gen 6]', () => {
		it(`should not let the attacker's Life Orb damage them after Red Card switches them out`, () => {
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

		it(`should still let Life Orb damage the attacker when Red Card fails to switch them (Ingrain)`, () => {
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

		it(`should suppress the attacker's Life Orb on a doubles spread move that triggers Red Card`, () => {
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

	describe('[Gen 5]', () => {
		it(`should not let the attacker's Life Orb damage them after Red Card switches them out`, () => {
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
	});
});
