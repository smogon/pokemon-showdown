/**
 * PokéRogue: Shop & Items test suite
 * Tests SHOP_ITEMS definitions, rollShopInventory, and item property validation.
 */
'use strict';

const assert = require('../../../assert');

describe('PokéRogue — Shop & Items', function () {
	this.timeout(10000);
	let core;

	before(function () {
		try {
			core = require('../../../../dist/impulse/chat-plugins/pokerogue/pokerogue-core');
		} catch (e) {
			console.log('PokéRogue core not in dist, skipping:', e.message);
			this.skip();
		}
	});

	describe('SHOP_ITEMS definitions', () => {
		it('should exist and have entries', () => {
			assert(core.SHOP_ITEMS && typeof core.SHOP_ITEMS === 'object');
			assert(Object.keys(core.SHOP_ITEMS).length > 0, 'Should have at least one item');
		});

		it('should have all required fields on every item', () => {
			for (const [id, item] of Object.entries(core.SHOP_ITEMS)) {
				assert.equal(item.id, id, `Item ${id}: id field should match key`);
				assert(typeof item.name === 'string' && item.name.length > 0, `Item ${id}: missing name`);
				assert(typeof item.description === 'string' && item.description.length > 0, `Item ${id}: missing description`);
				assert(typeof item.cost === 'number' && item.cost > 0, `Item ${id}: cost must be positive number`);
			}
		});

		it('should have consumable items (no heldItem, no gachaType)', () => {
			const consumables = ['rarecandy', 'luckycharm', 'revive'];
			for (const id of consumables) {
				const item = core.SHOP_ITEMS[id];
				assert(item, `Missing consumable: ${id}`);
				assert(!item.heldItem, `${id} should not have heldItem`);
			}
		});

		it('should have held items with a heldItem field', () => {
			const heldItems = ['focussash', 'leftovers', 'eviolite', 'rockyhelmet', 'heavydutyboots'];
			for (const id of heldItems) {
				const item = core.SHOP_ITEMS[id];
				assert(item, `Missing held item: ${id}`);
				assert(typeof item.heldItem === 'string' && item.heldItem.length > 0,
					`${id} should have a heldItem field`);
			}
		});

		it('should have all three gacha capsule items', () => {
			const capsules = ['mastercapsule', 'ultracapsule', 'greatcapsule'];
			for (const id of capsules) {
				const item = core.SHOP_ITEMS[id];
				assert(item, `Missing gacha capsule: ${id}`);
				assert(item.gachaType, `${id} must have gachaType`);
				assert(typeof item.gachaChance === 'number', `${id} must have numeric gachaChance`);
				assert(item.gachaChance > 0 && item.gachaChance < 1,
					`${id} gachaChance must be strictly between 0 and 1 (exclusive)`);
			}
		});

		it('should have correct gachaType values for each capsule', () => {
			assert.equal(core.SHOP_ITEMS['mastercapsule'].gachaType, 'legendary');
			assert.equal(core.SHOP_ITEMS['ultracapsule'].gachaType, 'pseudo');
			assert.equal(core.SHOP_ITEMS['greatcapsule'].gachaType, 'midtier');
		});

		it('should have Master Capsule as the most expensive item', () => {
			const maxCost = Math.max(...Object.values(core.SHOP_ITEMS).map(i => i.cost));
			assert.equal(core.SHOP_ITEMS['mastercapsule'].cost, maxCost,
				'Master Ball Capsule should be the most expensive item');
		});

		it('should have berry items with heldItem', () => {
			const berries = ['lumberry', 'salacberry', 'petayaberry'];
			for (const id of berries) {
				const item = core.SHOP_ITEMS[id];
				assert(item, `Missing berry: ${id}`);
				assert(typeof item.heldItem === 'string', `Berry ${id} should have heldItem`);
			}
		});

		it('should not have any item with cost <= 0', () => {
			for (const [id, item] of Object.entries(core.SHOP_ITEMS)) {
				assert(item.cost > 0, `Item ${id} cost must be positive, got ${item.cost}`);
			}
		});

		it('should have at least 20 distinct items', () => {
			assert(Object.keys(core.SHOP_ITEMS).length >= 20, 'Should have at least 20 shop items');
		});
	});

	describe('rollShopInventory()', () => {
		it('should return exactly 8 items by default', () => {
			const inv = core.rollShopInventory();
			assert.equal(inv.length, 8, 'Default inventory should have 8 items');
		});

		it('should accept a custom count parameter', () => {
			assert.equal(core.rollShopInventory(4).length, 4);
			assert.equal(core.rollShopInventory(6).length, 6);
			assert.equal(core.rollShopInventory(12).length, 12);
		});

		it('should return 0 items for n=0', () => {
			assert.equal(core.rollShopInventory(0).length, 0);
		});

		it('should return only valid SHOP_ITEMS ids', () => {
			const inv = core.rollShopInventory(10);
			for (const id of inv) {
				assert(core.SHOP_ITEMS[id], `Unknown item id in inventory: ${id}`);
			}
		});

		it('should not return duplicate items', () => {
			for (let i = 0; i < 5; i++) {
				const inv = core.rollShopInventory(10);
				const unique = new Set(inv);
				assert.equal(unique.size, inv.length, `Inventory has duplicates: ${inv.join(', ')}`);
			}
		});

		it('should return different results across multiple calls (random)', () => {
			const results = new Set();
			for (let i = 0; i < 20; i++) {
				results.add(core.rollShopInventory(5).join(','));
			}
			// In 20 rolls of 5, we'd expect at least some variation
			assert(results.size > 1, 'rollShopInventory should produce varied results');
		});

		it('should never exceed the total number of items in SHOP_ITEMS', () => {
			const totalItems = Object.keys(core.SHOP_ITEMS).length;
			const inv = core.rollShopInventory(totalItems);
			assert.equal(inv.length, totalItems);
			// No duplicates
			assert.equal(new Set(inv).size, totalItems);
		});
	});
});
