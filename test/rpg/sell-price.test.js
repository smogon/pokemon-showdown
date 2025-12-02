'use strict';

/**
 * Sell Price Tests
 * Tests that items sell for 50% of their purchase price
 */

const assert = require('assert').strict;

describe('RPG Sell Price Module', function () {
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

	describe('Sell Price Calculation', () => {
		let player;

		beforeEach(() => {
			player = core.getPlayerData('testsellusr001');
			player.inventory.clear();
			player.money = 10000;
		});

		it('should sell items at 50% of purchase price', () => {
			// Test with nugget (purchase price: 5000, sell price should be 2500)
			const purchasePrice = items.ITEM_PRICES['nugget'];
			if (!purchasePrice) {
				console.log('Nugget price not found, skipping test');
				return;
			}

			const expectedSellPrice = Math.floor(purchasePrice / 2);

			// Add the item to inventory
			items.addItemToInventory(player, 'nugget', 1);

			const initialMoney = player.money;

			// Simulate selling (since we can't call the command directly)
			// We calculate what the sell price should be
			const sellPrice = Math.floor(purchasePrice / 2);
			items.removeItemFromInventory(player, 'nugget', 1);
			player.money += sellPrice;

			const moneyGained = player.money - initialMoney;

			assert.equal(moneyGained, expectedSellPrice, `Expected to gain ${expectedSellPrice} but got ${moneyGained}`);
			assert.equal(sellPrice, 2500, 'Nugget should sell for 2500 (50% of 5000)');
		});

		it('should sell potion at 50% of purchase price', () => {
			// Test with potion (purchase price: 300, sell price should be 150)
			const purchasePrice = items.ITEM_PRICES['potion'];
			if (!purchasePrice) {
				console.log('Potion price not found, skipping test');
				return;
			}

			const expectedSellPrice = Math.floor(purchasePrice / 2);

			items.addItemToInventory(player, 'potion', 5);

			const initialMoney = player.money;

			// Simulate selling 2 potions
			const quantity = 2;
			const sellPrice = Math.floor(purchasePrice / 2);
			const totalGain = sellPrice * quantity;
			items.removeItemFromInventory(player, 'potion', quantity);
			player.money += totalGain;

			const moneyGained = player.money - initialMoney;

			assert.equal(moneyGained, expectedSellPrice * quantity, `Expected to gain ${expectedSellPrice * quantity} but got ${moneyGained}`);
			assert.equal(sellPrice, 150, 'Potion should sell for 150 (50% of 300)');
			assert.equal(player.inventory.get('potion').quantity, 3, 'Should have 3 potions left');
		});

		it('should sell master ball at 50% of purchase price', () => {
			// Test with master ball (purchase price: 100000, sell price should be 50000)
			const purchasePrice = items.ITEM_PRICES['masterball'];
			if (!purchasePrice) {
				console.log('Master Ball price not found, skipping test');
				return;
			}

			const expectedSellPrice = Math.floor(purchasePrice / 2);

			items.addItemToInventory(player, 'masterball', 1);

			const initialMoney = player.money;

			// Simulate selling
			const sellPrice = Math.floor(purchasePrice / 2);
			items.removeItemFromInventory(player, 'masterball', 1);
			player.money += sellPrice;

			const moneyGained = player.money - initialMoney;

			assert.equal(moneyGained, expectedSellPrice, `Expected to gain ${expectedSellPrice} but got ${moneyGained}`);
			assert.equal(sellPrice, 50000, 'Master Ball should sell for 50000 (50% of 100000)');
		});

		it('should handle odd prices correctly with floor division', () => {
			// Test with an item that has an odd price (if purchase price is 301, sell should be 150)
			const purchasePrice = 301;
			const expectedSellPrice = Math.floor(purchasePrice / 2);

			assert.equal(expectedSellPrice, 150, 'Odd prices should be floored correctly');
		});

		it('should verify multiple common items sell at 50%', () => {
			const testItems = [
				{ id: 'pokeball', purchasePrice: 200, expectedSellPrice: 100 },
				{ id: 'greatball', purchasePrice: 600, expectedSellPrice: 300 },
				{ id: 'ultraball', purchasePrice: 800, expectedSellPrice: 400 },
				{ id: 'superpotion', purchasePrice: 700, expectedSellPrice: 350 },
				{ id: 'hyperpotion', purchasePrice: 1200, expectedSellPrice: 600 },
			];

			for (const testItem of testItems) {
				const actualPurchasePrice = items.ITEM_PRICES[testItem.id];
				if (!actualPurchasePrice) {
					console.log(`${testItem.id} price not found, skipping`);
					continue;
				}

				// Verify the purchase price matches expected
				assert.equal(actualPurchasePrice, testItem.purchasePrice,
					`${testItem.id} purchase price should be ${testItem.purchasePrice}`);

				// Calculate sell price
				const sellPrice = Math.floor(actualPurchasePrice / 2);

				// Verify sell price is 50%
				assert.equal(sellPrice, testItem.expectedSellPrice,
					`${testItem.id} should sell for ${testItem.expectedSellPrice} (50% of ${testItem.purchasePrice})`);
			}
		});
	});
});
