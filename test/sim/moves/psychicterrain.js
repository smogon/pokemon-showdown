'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Psychic Terrain', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent priority moves from affecting grounded Pokemon', () => {
		battle = common.createBattle([[
			{ species: 'Regieleki', moves: ['psychicterrain', 'sleeptalk'] },
		], [
			{ species: 'Terrakion', moves: ['quickattack'] },
		]]);

		const eleki = battle.p1.active[0];
		battle.makeChoices('move psychicterrain', 'move quickattack');
		// Quick Attack hits on turn 1 because it goes before terrain is set up
		const hpAfterSetup = eleki.hp;
		assert.false.fullHP(eleki, 'Quick Attack should hit on turn 1 before terrain is set up.');
		battle.makeChoices('move sleeptalk', 'move quickattack');
		// On turn 2, terrain should block the priority move
		assert.equal(eleki.hp, hpAfterSetup, 'Psychic Terrain should have prevented the priority Quick Attack from doing damage on turn 2.');
	});

	it('should not prevent priority moves from affecting airborne Pokemon and display correct hint', () => {
		battle = common.createBattle([[
			{ species: 'Skarmory', ability: 'sturdy', moves: ['psychicterrain', 'sleeptalk'] },
		], [
			{ species: 'Terrakion', moves: ['quickattack'] },
		]]);

		const skarmory = battle.p1.active[0];
		battle.makeChoices('move psychicterrain', 'move quickattack');
		const hpAfterSetup = skarmory.hp;
		battle.makeChoices('move sleeptalk', 'move quickattack');
		assert.false.fullHP(skarmory, 'Airborne Skarmory should be hit by Quick Attack.');

		// Check that the correct hint message is shown
		const hintLog = battle.log.filter(line => line.startsWith('|-hint|'));
		assert(hintLog.length > 0, 'A hint should be displayed');
		assert(hintLog.some(line => line.includes('Airborne Pokémon are not granted protection from priority in Psychic Terrain')),
			'The correct hint message should be displayed for airborne Pokemon');
	});

	it('should show correct hint for airborne Pokemon immune to Ground via ability', () => {
		battle = common.createBattle([[
			{ species: 'Orthworm', ability: 'eartheater', moves: ['psychicterrain', 'sleeptalk'] },
		], [
			{ species: 'Terrakion', moves: ['quickattack'] },
		]]);

		const orthworm = battle.p1.active[0];
		battle.makeChoices('move psychicterrain', 'move quickattack');
		const hpAfterSetup = orthworm.hp;
		battle.makeChoices('move sleeptalk', 'move quickattack');
		// Orthworm has Earth Eater ability which makes it immune to Ground-type moves but is still grounded
		// Priority protection should apply because it checks isGrounded(), not Ground immunity
		assert.equal(orthworm.hp, hpAfterSetup, 'Grounded Orthworm with Earth Eater should be protected by Psychic Terrain on turn 2.');
	});

	it('should not prevent priority moves from affecting airborne Pokemon with Air Balloon', () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Regieleki', item: 'airballoon', moves: ['psychicterrain'] },
			{ species: 'Pichu', moves: ['sleeptalk'] },
		], [
			{ species: 'Whimsicott', moves: ['sleeptalk'] },
			{ species: 'Terrakion', moves: ['quickattack', 'sleeptalk'] },
		]]);

		const eleki = battle.p1.active[0];
		// Set up terrain on turn 1 without popping the balloon
		battle.makeChoices('move psychicterrain, move sleeptalk', 'move sleeptalk, move sleeptalk');
		assert(eleki.item === 'airballoon', 'Air Balloon should still be intact');
		assert(!eleki.isGrounded(), 'Eleki should be airborne with Air Balloon');

		// On turn 2, test priority move on airborne Pokemon
		const hpBeforeAttack = eleki.hp;
		battle.makeChoices('auto', 'move sleeptalk, move quickattack 1');
		assert.notEqual(eleki.hp, hpBeforeAttack, 'Airborne Eleki with Air Balloon should be hit by Quick Attack.');

		// Check that the correct hint message is shown
		const hintLog = battle.log.filter(line => line.startsWith('|-hint|'));
		assert(hintLog.length > 0, 'A hint should be displayed');
		assert(hintLog.some(line => line.includes('Airborne Pokémon are not granted protection from priority in Psychic Terrain')),
			'The correct hint message should be displayed for Pokemon with Air Balloon');
	});

	it('should increase the base power of Psychic-type attacks used by grounded Pokemon', () => {
		battle = common.createBattle([[
			{ species: 'Alakazam', moves: ['psychicterrain'] },
		], [
			{ species: 'Machamp', moves: ['bulkup'] },
		]]);
		battle.makeChoices();
		const move = Dex.moves.get('psychic');
		const basePower = battle.runEvent('BasePower', battle.p1.active[0], battle.p2.active[0], move, move.basePower, true);
		// Psychic Terrain boosts Psychic-type moves by 1.3x (5325/4096)
		assert.equal(basePower, Math.floor(move.basePower * 5325 / 4096));
	});
});
