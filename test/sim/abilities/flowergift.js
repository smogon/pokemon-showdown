'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flower Gift', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost allies' Attack and Special Defense stats`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Cherrim", ability: 'flowergift', moves: ['healbell']},
			{species: "Snorlax", ability: 'immunity', moves: ['healbell']},
		], [
			{species: "Blissey", ability: 'serenegrace', moves: ['healbell']},
			{species: "Blissey", ability: 'serenegrace', moves: ['healbell']},
		]]);

		const cherAtk = battle.p1.active[0].getStat('atk');
		const cherSpd = battle.p1.active[0].getStat('spd');
		const baseAtk = battle.p1.active[1].getStat('atk');
		const baseSpd = battle.p1.active[1].getStat('spd');

		// Set the weather to sun and re-check
		battle.field.setWeather('sunnyday', 'debug');
		assert.equal(battle.p1.active[0].getStat('atk'), battle.modify(cherAtk, 1.5));
		assert.equal(battle.p1.active[0].getStat('spd'), battle.modify(cherSpd, 1.5));
		assert.equal(battle.p1.active[1].getStat('atk'), battle.modify(baseAtk, 1.5));
		assert.equal(battle.p1.active[1].getStat('spd'), battle.modify(baseSpd, 1.5));
	});

	it(`should still work if Cherrim transforms into something with Flower Gift without originally having it`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Cherrim", ability: 'serenegrace', moves: ['transform']},
			{species: "Snorlax", ability: 'immunity', moves: ['healbell']},
		], [
			{species: "Blissey", ability: 'flowergift', moves: ['healbell']},
			{species: "Blissey", ability: 'flowergift', moves: ['healbell']},
		]]);

		battle.makeChoices('move transform 1, move healbell', 'move healbell, move healbell');
		const cherAtk = battle.p1.active[0].getStat('atk');
		const cherSpd = battle.p1.active[0].getStat('spd');
		const baseAtk = battle.p1.active[1].getStat('atk');
		const baseSpd = battle.p1.active[1].getStat('spd');

		// Set the weather to sun and re-check
		battle.field.setWeather('sunnyday', 'debug');
		assert.equal(battle.p1.active[0].getStat('atk'), battle.modify(cherAtk, 1.5));
		assert.equal(battle.p1.active[0].getStat('spd'), battle.modify(cherSpd, 1.5));
		assert.equal(battle.p1.active[1].getStat('atk'), battle.modify(baseAtk, 1.5));
		assert.equal(battle.p1.active[1].getStat('spd'), battle.modify(baseSpd, 1.5));
	});

	it(`should not trigger if the Pokemon was KOed`, function () {
		battle = common.createBattle([[
			{species: 'Cherrim', ability: 'flowergift', moves: ['sleeptalk']},
		], [
			{species: 'Heatran', moves: ['blastburn']},
		]]);
		battle.makeChoices('auto', 'move blastburn dynamax');
		assert(battle.log.every(line => !line.startsWith('|-formechange')));
	});
});
