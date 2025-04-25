'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Levitate', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should give the user an immunity to Ground-type moves', () => {
		battle = common.createBattle([[
			{ species: 'Rotom', ability: 'levitate', moves: ['sleeptalk'] },
		], [
			{ species: 'Aggron', ability: 'sturdy', moves: ['earthquake'] },
		]]);
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move earthquake'));
	});

	it('should make the user airborne', () => {
		battle = common.createBattle([[
			{ species: 'Unown', ability: 'levitate', moves: ['spore'] },
		], [
			{ species: 'Espeon', ability: 'magicbounce', moves: ['electricterrain'] },
		]]);
		battle.makeChoices('move spore', 'move electricterrain');
		assert.equal(battle.p1.active[0].status, 'slp', "Levitate Pokémon should not be awaken by Electric Terrain");
	});

	it('should have its Ground immunity suppressed by Mold Breaker', () => {
		battle = common.createBattle([[
			{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', moves: ['earthquake'] },
		]]);
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move earthquake'));
	});

	it('should have its airborne property suppressed by Mold Breaker if it is forced out by a move', () => {
		battle = common.createBattle([[
			{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] },
			{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'spikes'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move spikes');
		assert.hurts(battle.p1.pokemon[1], () => battle.makeChoices('move sleeptalk', 'move roar'));
	});

	it('should not have its airborne property suppressed by Mold Breaker if it switches out via Eject Button', () => {
		battle = common.createBattle([[
			{ species: 'Cresselia', ability: 'levitate', item: 'ejectbutton', moves: ['sleeptalk'] },
			{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', moves: ['tackle', 'spikes'] },
		]]);
		battle.makeChoices('move sleeptalk', 'move spikes');
		battle.makeChoices('move sleeptalk', 'move tackle');
		assert.false.hurts(battle.p1.pokemon[1], () => battle.makeChoices('switch 2', 'move tackle'));
	});

	it('should not have its airborne property suppressed by Mold Breaker if that Pokemon is no longer active', () => {
		battle = common.createBattle([[
			{ species: 'Forretress', ability: 'levitate', item: 'redcard', moves: ['spikes'] },
		], [
			{ species: 'Haxorus', ability: 'moldbreaker', item: 'laggingtail', moves: ['tackle'] },
			{ species: 'Rotom', ability: 'levitate', moves: ['rest'] },
		]]);
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move spikes', 'move tackle'));
	});
});

describe('Levitate [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not have its airborne property suppressed by Mold Breaker if it is forced out by a move', () => {
		battle = common.gen(4).createBattle([
			[{ species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] }, { species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk'] }],
			[{ species: 'Rampardos', ability: 'moldbreaker', moves: ['roar', 'spikes'] }],
		]);
		battle.makeChoices('move sleeptalk', 'move spikes');
		assert.false.hurts(battle.p1.pokemon[1], () => battle.makeChoices('move sleeptalk', 'move roar'));
	});
});
