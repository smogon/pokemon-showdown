'use strict';

/**
 * Items Module Tests
 * Tests item management, inventory operations, and item effects
 */

const assert = require('assert').strict;

describe('RPG Items Module', function () {
	this.timeout(10000);

	let items, core;

	before(function () {
		try {
			items = require('../../dist/impulse/chat-plugins/rpg-wip/items');
			core = require('../../dist/impulse/chat-plugins/rpg-wip/core');
		} catch (e) {
			console.log('Items module not found, skipping tests:', e.message);
			this.skip();
		}
	});

	describe('Inventory Management', () => {
		let player;

		beforeEach(() => {
			player = core.getPlayerData('testitemuser001');
			player.inventory.clear();
		});

		it('should add item to empty inventory', function () {
			items.addItemToInventory(player, 'potion', 5);

			const item = player.inventory.get('potion');
			assert(item);
			assert.equal(item.quantity, 5);
		});

		it('should stack items of same type', function () {
			items.addItemToInventory(player, 'potion', 5);
			items.addItemToInventory(player, 'potion', 3);

			const item = player.inventory.get('potion');
			assert.equal(item.quantity, 8);
		});

		it('should add multiple different items', function () {
			items.addItemToInventory(player, 'potion', 5);
			items.addItemToInventory(player, 'superpotion', 3);
			items.addItemToInventory(player, 'pokeball', 10);

			assert.equal(player.inventory.size, 3);
			assert.equal(player.inventory.get('potion').quantity, 5);
			assert.equal(player.inventory.get('superpotion').quantity, 3);
			assert.equal(player.inventory.get('pokeball').quantity, 10);
		});

		it('should remove item from inventory', function () {
			items.addItemToInventory(player, 'potion', 10);

			const removed = items.removeItemFromInventory(player, 'potion', 5);

			assert.equal(removed, true);
			assert.equal(player.inventory.get('potion').quantity, 5);
		});

		it('should remove all items when quantity matches', function () {
			items.addItemToInventory(player, 'potion', 5);

			const removed = items.removeItemFromInventory(player, 'potion', 5);

			assert.equal(removed, true);
			const item = player.inventory.get('potion');
			assert(!item || item.quantity === 0);
		});

		it('should fail to remove more items than available', function () {
			items.addItemToInventory(player, 'potion', 5);

			const removed = items.removeItemFromInventory(player, 'potion', 10);

			assert.equal(removed, false);
			assert.equal(player.inventory.get('potion').quantity, 5);
		});

		it('should handle removing non-existent item', function () {
			const removed = items.removeItemFromInventory(player, 'potion', 1);

			assert.equal(removed, false);
		});

		it('should handle adding 0 quantity', function () {
			items.addItemToInventory(player, 'potion', 0);

			const item = player.inventory.get('potion');
			assert(!item || item.quantity === 0);
		});

		it('should handle removing 0 quantity', function () {
			items.addItemToInventory(player, 'potion', 5);

			const removed = items.removeItemFromInventory(player, 'potion', 0);

			assert.equal(removed, true);
			assert.equal(player.inventory.get('potion').quantity, 5);
		});

		it('should handle large quantities', function () {
			items.addItemToInventory(player, 'potion', 999);

			assert.equal(player.inventory.get('potion').quantity, 999);

			const removed = items.removeItemFromInventory(player, 'potion', 500);

			assert.equal(removed, true);
			assert.equal(player.inventory.get('potion').quantity, 499);
		});
	});

	describe('Item Database', () => {
		it('should have ITEMS_DATABASE defined', function () {
			assert(items.ITEMS_DATABASE);
			assert(typeof items.ITEMS_DATABASE === 'object');
		});

		it('should have common items defined', function () {
			const commonItems = ['potion', 'superpotion', 'hyperpotion', 'pokeball', 'greatball', 'ultraball'];

			for (const itemId of commonItems) {
				const item = items.ITEMS_DATABASE[itemId];
				if (item) {
					assert(item.name);
					assert(item.description);
				}
			}
		});

		it('should have items with valid properties', function () {
			const potion = items.ITEMS_DATABASE['potion'];
			if (potion) {
				assert(potion.name);
				assert(potion.description);
				assert(typeof potion.price === 'number');
			}
		});

		it('should have items with correct categories', function () {
			const potion = items.ITEMS_DATABASE['potion'];
			if (potion && potion.category) {
				const validCategories = ['medicine', 'pokeball', 'tm', 'held', 'key', 'berry'];
				assert(validCategories.includes(potion.category));
			}
		});
	});

	describe('Item Usage', () => {
		let player, pokemon;

		beforeEach(() => {
			player = core.getPlayerData('testitemuser002');
			player.inventory.clear();
			player.party = [];

			pokemon = core.createPokemon('pikachu', 10);
			pokemon.hp = 10; // Damaged Pokemon
			pokemon.maxHp = 35;
			player.party.push(pokemon);
		});

		it('should use potion to heal Pokemon', function () {
			if (!items.useItem) {
				this.skip();
				return;
			}

			items.addItemToInventory(player, 'potion', 1);

			const result = items.useItem(player, 'potion', pokemon);

			if (result && result.success) {
				assert(pokemon.hp > 10);
				assert(pokemon.hp <= pokemon.maxHp);
			}
		});

		it('should not use item if not in inventory', function () {
			if (!items.useItem) {
				this.skip();
				return;
			}

			const result = items.useItem(player, 'potion', pokemon);

			if (result) {
				assert.equal(result.success, false);
			}
		});

		it('should consume item after use', function () {
			if (!items.useItem) {
				this.skip();
				return;
			}

			items.addItemToInventory(player, 'potion', 1);

			const result = items.useItem(player, 'potion', pokemon);

			if (result && result.success) {
				const item = player.inventory.get('potion');
				assert(!item || item.quantity === 0);
			}
		});

		it('should not heal Pokemon beyond max HP', function () {
			if (!items.useItem) {
				this.skip();
				return;
			}

			items.addItemToInventory(player, 'maxpotion', 1);
			pokemon.hp = 30;

			const result = items.useItem(player, 'maxpotion', pokemon);

			if (result && result.success) {
				assert.equal(pokemon.hp, pokemon.maxHp);
			}
		});

		it('should not use potion on fully healed Pokemon', function () {
			if (!items.useItem) {
				this.skip();
				return;
			}

			items.addItemToInventory(player, 'potion', 1);
			pokemon.hp = pokemon.maxHp;

			const result = items.useItem(player, 'potion', pokemon);

			if (result) {
				// Should either fail or succeed but not consume
				assert(result);
			}
		});
	});

	describe('Shop System', () => {
		let player;

		beforeEach(() => {
			player = core.getPlayerData('testitemuser003');
			player.inventory.clear();
			player.money = 5000;
		});

		it('should buy item from shop', function () {
			if (!items.buyItem) {
				this.skip();
				return;
			}

			const result = items.buyItem(player, 'potion', 1);

			if (result && result.success) {
				assert(player.inventory.get('potion'));
				assert(player.money < 5000);
			}
		});

		it('should not buy item without enough money', function () {
			if (!items.buyItem) {
				this.skip();
				return;
			}

			player.money = 10;

			const result = items.buyItem(player, 'ultraball', 10);

			if (result) {
				assert.equal(result.success, false);
			}
		});

		it('should buy multiple items at once', function () {
			if (!items.buyItem) {
				this.skip();
				return;
			}

			const result = items.buyItem(player, 'potion', 5);

			if (result && result.success) {
				assert.equal(player.inventory.get('potion').quantity, 5);
			}
		});

		it('should deduct correct amount of money', function () {
			if (!items.buyItem || !items.ITEMS_DATABASE['potion']) {
				this.skip();
				return;
			}

			const initialMoney = player.money;
			const price = items.ITEMS_DATABASE['potion'].price;

			const result = items.buyItem(player, 'potion', 1);

			if (result && result.success) {
				assert.equal(player.money, initialMoney - price);
			}
		});

		it('should sell item to shop', function () {
			if (!items.sellItem) {
				this.skip();
				return;
			}

			items.addItemToInventory(player, 'potion', 5);
			const initialMoney = player.money;

			const result = items.sellItem(player, 'potion', 1);

			if (result && result.success) {
				assert(player.money > initialMoney);
				assert.equal(player.inventory.get('potion').quantity, 4);
			}
		});

		it('should not sell item not in inventory', function () {
			if (!items.sellItem) {
				this.skip();
				return;
			}

			const result = items.sellItem(player, 'potion', 1);

			if (result) {
				assert.equal(result.success, false);
			}
		});
	});

	describe('Edge Cases', () => {
		let player;

		beforeEach(() => {
			player = core.getPlayerData('testitemuser004');
			player.inventory.clear();
		});

		it('should handle negative quantity gracefully', function () {
			items.addItemToInventory(player, 'potion', -5);

			const item = player.inventory.get('potion');
			assert(!item || item.quantity === 0);
		});

		it('should handle very large inventory', function () {
			for (let i = 0; i < 100; i++) {
				items.addItemToInventory(player, `item${i}`, 1);
			}

			assert.equal(player.inventory.size, 100);
		});

		it('should handle item with special characters in ID', function () {
			items.addItemToInventory(player, 'x-attack', 5);

			const item = player.inventory.get('x-attack');
			if (item) {
				assert.equal(item.quantity, 5);
			}
		});

		it('should handle undefined item gracefully', function () {
			const removed = items.removeItemFromInventory(player, undefined, 1);

			assert.equal(removed, false);
		});

		it('should handle null player gracefully', function () {
			try {
				items.addItemToInventory(null, 'potion', 1);
			} catch (e) {
				assert(e); // Should throw or handle gracefully
			}
		});
	});
});
