'use strict';

const { execFileSync } = require('child_process');
const path = require('path');
const assert = require('./../assert');
const common = require('./../common');

let battle;

describe('Battle#onEvent', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should allow the addition of one or more event handlers to the battle engine', () => {
		battle = common.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] },
		], [
			{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] },
		]]);
		let eventCount = 0;
		let eventCount2 = 0;
		battle.onEvent('Hit', battle.format, () => {
			eventCount++;
		});
		battle.onEvent('Hit', battle.format, () => {
			eventCount++;
			eventCount2++;
		});
		battle.onEvent('ModifyDamage', battle.format, () => {
			return 5;
		});
		battle.makeChoices('move bulkup', 'move peck');
		assert.equal(eventCount, 4);
		assert.equal(eventCount2, 2);
		assert.equal(battle.p1.active[0].maxhp - battle.p1.active[0].hp, 5);
	});

	it('should support and resolve priorities correctly', () => {
		battle = common.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] },
		], [
			{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] },
		]]);
		let eventCount = 0;
		const modHandler = function (count) {
			return function () {
				assert.equal(eventCount, count);
				eventCount++;
			};
		};
		for (let i = 0; i < 9; i++) {
			battle.onEvent('ModifyDamage', battle.format, -i, modHandler(i));
		}
		battle.makeChoices('move bulkup', 'move peck');
		assert.equal(eventCount, 9);
	});

	it('should throw if a callback is not given for the event handler', () => {
		battle = common.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', moves: ['bulkup'] },
		], [
			{ species: 'Talonflame', ability: 'galewings', moves: ['peck'] },
		]]);
		assert.throws(() => battle.onEvent(), TypeError);
		assert.throws(() => { battle.onEvent('Hit'); }, TypeError);
		assert.throws(() => { battle.onEvent('Hit', battle.format); }, TypeError);
	});
});

describe('Battle#findEventHandlers', () => {
	it('should know every callback in the data before the effects defining them are constructed', function () {
		this.timeout(0);
		// effects are constructed when first looked up, so this needs a process that hasn't looked any up
		const script = `
			const { Dex } = require('./dist/sim/dex');
			const { definedCallbackNames } = require('./dist/sim/dex-data');
			const dexes = Object.values(Dex.includeMods().dexes);
			for (const dex of dexes) dex.includeData();
			let constructed = 0;
			const checked = new Set();
			const missing = new Set();
			for (const dex of dexes) {
				constructed += dex.abilities.abilityCache.size + dex.items.itemCache.size;
				for (const table of ['Abilities', 'Items', 'Moves', 'Conditions', 'Pokedex', 'Rulesets']) {
					for (const entry of Object.values(dex.data[table])) {
						for (const data of [entry, entry.condition]) {
							for (const key in data) {
								if (!key.startsWith('on')) continue;
								checked.add(key);
								if (!definedCallbackNames.has(key)) missing.add(key);
							}
						}
					}
				}
			}
			console.log(JSON.stringify({ constructed, checked: [...checked], missing: [...missing] }));
		`;
		const { constructed, checked, missing } = JSON.parse(execFileSync(process.execPath, ['-e', script], {
			cwd: path.resolve(__dirname, '../..'), encoding: 'utf8',
		}));
		assert.equal(constructed, 0, `No abilities or items should have been constructed yet`);
		// only abilities define this, so it's only checked if Abilities were read
		assert(checked.includes('onModifySTAB'));
		assert.deepEqual(missing, []);
	});
});
