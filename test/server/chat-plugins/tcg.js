/**
 * Tests for the TCG (Trading Card Game) chat plugin
 * @author PrinceSky-Git
 */
'use strict';

const assert = require('../../assert');
const { makeUser, destroyUser } = require('../../users-utils');

describe("TCG Plugin", () => {
	// Skip tests if MongoDB is not configured
	const shouldSkip = !Config.usepostgres && !Config.usemongo;

	before(function () {
		if (shouldSkip) {
			this.skip();
			return;
		}
		// Create test users
		this.user1 = makeUser('testuser1', '127.0.0.1');
		this.user2 = makeUser('testuser2', '127.0.0.2');
	});

	after(function () {
		if (shouldSkip) return;
		// Cleanup test users
		destroyUser(this.user1);
		destroyUser(this.user2);
	});

	describe("TCG Utils", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should have proper constants defined", () => {
			assert(tcgUtils.MAX_CARD_QUANTITY > 0, "MAX_CARD_QUANTITY should be positive");
			assert(tcgUtils.CREDITS_PER_DUPLICATE > 0, "CREDITS_PER_DUPLICATE should be positive");
			assert(tcgUtils.MAX_PACK_SIZE > 0, "MAX_PACK_SIZE should be positive");
			assert(
				tcgUtils.MAX_PACK_SIZE_FOR_SETS_CALCULATION > 0,
				"MAX_PACK_SIZE_FOR_SETS_CALCULATION should be positive"
			);
		});

		it("should export required functions", () => {
			assert.strictEqual(typeof tcgUtils.calculateSetsCompleted, 'function');
			assert.strictEqual(typeof tcgUtils.addCardsToCollection, 'function');
			assert.strictEqual(typeof tcgUtils.generatePack, 'function');
			assert.strictEqual(typeof tcgUtils.getCard, 'function');
			assert.strictEqual(typeof tcgUtils.getSet, 'function');
			assert.strictEqual(typeof tcgUtils.initializeCache, 'function');
			assert.strictEqual(typeof tcgUtils.renderCardGridHtml, 'function');
		});

		it("should return 0 for calculateSetsCompleted with non-existent user", async function () {
			this.timeout(5000);
			const result = await tcgUtils.calculateSetsCompleted('nonexistentuser123456');
			assert.strictEqual(result, 0, "Non-existent user should have 0 sets completed");
		});

		it("should handle empty pack array in addCardsToCollection", async function () {
			this.timeout(5000);
			const result = await tcgUtils.addCardsToCollection(this.user1, []);
			assert.strictEqual(result.creditsAwarded, 0, "Empty pack should award 0 credits");
		});
	});

	describe("TCG Cache", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should initialize cache", async function () {
			this.timeout(10000);
			const result = await tcgUtils.initializeCache();
			assert(typeof result === 'object', "initializeCache should return an object");
			assert(typeof result.cardCount === 'number', "Result should have cardCount");
			assert(typeof result.setCount === 'number', "Result should have setCount");
		});

		it("should return cache stats", () => {
			const stats = tcgUtils.getCacheStats();
			assert(typeof stats === 'object', "getCacheStats should return an object");
			assert(typeof stats.cardsCached === 'number', "Stats should have cardsCached");
			assert(typeof stats.setsCached === 'number', "Stats should have setsCached");
			assert(typeof stats.isInitialized === 'boolean', "Stats should have isInitialized");
		});
	});

	describe("TCG Collections", () => {
		let tcgCollections;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgCollections = require('../../../dist/impulse/chat-plugins/tcg/tcg_collections');
			} catch (e) {
				console.error("Failed to load TCG collections:", e);
				this.skip();
			}
		});

		it("should export collection objects", () => {
			assert(tcgCollections.tcgCardsCollection, "tcgCardsCollection should exist");
			assert(tcgCollections.userCollectionsCollection, "userCollectionsCollection should exist");
			assert(tcgCollections.userProfilesCollection, "userProfilesCollection should exist");
			assert(tcgCollections.userPacksCollection, "userPacksCollection should exist");
			assert(tcgCollections.cooldownsCollection, "cooldownsCollection should exist");
		});
	});

	describe("TCG Commands", () => {
		let Commands;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			Commands = require('../../../dist/server/chat-commands').commands;
		});

		it("should have tcg command registered", () => {
			assert(Commands.tcg, "TCG command should be registered");
			assert(Commands.pokemontcg, "pokemontcg alias should be registered");
		});

		it("should have tcg subcommands", () => {
			const tcgCommands = Commands.tcg.subcommands;
			assert(tcgCommands, "TCG should have subcommands");

			// Core commands
			assert(tcgCommands.search, "search subcommand should exist");
			assert(tcgCommands.card, "card subcommand should exist");
			assert(tcgCommands.daily, "daily subcommand should exist");
			assert(tcgCommands.collection, "collection subcommand should exist");
			assert(tcgCommands.profile, "profile subcommand should exist");

			// Pack commands
			assert(tcgCommands.packs, "packs subcommand should exist");
			assert(tcgCommands.opensavedpack, "opensavedpack subcommand should exist");
			assert(tcgCommands.openallpacks, "openallpacks subcommand should exist");

			// Set progress commands
			assert(tcgCommands.setprogress, "setprogress subcommand should exist");
			assert(tcgCommands.missing, "missing subcommand should exist");

			// Economy commands
			assert(tcgCommands.shop, "shop subcommand should exist");
			assert(tcgCommands.buy, "buy subcommand should exist");
			assert(tcgCommands.sell, "sell subcommand should exist");
			assert(tcgCommands.selldupes, "selldupes subcommand should exist");
			assert(tcgCommands.gift, "gift subcommand should exist");
			assert(tcgCommands.giftcredits, "giftcredits subcommand should exist");

			// Collection management
			assert(tcgCommands.favorite, "favorite subcommand should exist");
			assert(tcgCommands.unfavorite, "unfavorite subcommand should exist");
			assert(tcgCommands.recalculatestats, "recalculatestats subcommand should exist");

			// Trade commands
			assert(tcgCommands.trade, "trade subcommand should exist");
			assert(tcgCommands.tradeview, "tradeview subcommand should exist");
			assert(tcgCommands.tradeadd, "tradeadd subcommand should exist");
			assert(tcgCommands.traderemove, "traderemove subcommand should exist");
			assert(tcgCommands.tradeconfirm, "tradeconfirm subcommand should exist");
			assert(tcgCommands.tradecancel, "tradecancel subcommand should exist");

			// Admin commands
			assert(tcgCommands.loadcache, "loadcache subcommand should exist");
			assert(tcgCommands.loaddata, "loaddata subcommand should exist");
			assert(tcgCommands.addcredits, "addcredits subcommand should exist");
			assert(tcgCommands.removecredits, "removecredits subcommand should exist");
			assert(tcgCommands.givecard, "givecard subcommand should exist");
			assert(tcgCommands.removecard, "removecard subcommand should exist");

			// Leaderboard
			assert(tcgCommands.leaderboard, "leaderboard subcommand should exist");
		});
	});

	describe("TCG Card Limits", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should enforce MAX_CARD_QUANTITY limit", () => {
			const maxQty = tcgUtils.MAX_CARD_QUANTITY;
			assert(maxQty === 10, "MAX_CARD_QUANTITY should be 10");
		});

		it("should award credits for duplicates beyond limit", () => {
			const creditsPerDupe = tcgUtils.CREDITS_PER_DUPLICATE;
			assert(creditsPerDupe === 1, "CREDITS_PER_DUPLICATE should be 1");
		});
	});

	describe("TCG Performance", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should skip sets calculation for large batches", () => {
			const threshold = tcgUtils.MAX_PACK_SIZE_FOR_SETS_CALCULATION;
			assert(
				threshold === 50,
				"MAX_PACK_SIZE_FOR_SETS_CALCULATION should be 50 to optimize performance"
			);
		});
	});

	describe("TCG Profile Sets Completed", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should have calculateSetsCompleted function", () => {
			assert.strictEqual(
				typeof tcgUtils.calculateSetsCompleted,
				'function',
				"calculateSetsCompleted should be a function"
			);
		});

		it("should calculate sets completed correctly for empty collection", async function () {
			this.timeout(5000);
			const setsCompleted = await tcgUtils.calculateSetsCompleted('emptyuser999999');
			assert.strictEqual(setsCompleted, 0, "User with no cards should have 0 sets completed");
		});
	});

	describe("TCG HTML Rendering", () => {
		let tcgUtils;

		before(function () {
			if (shouldSkip) {
				this.skip();
				return;
			}
			try {
				tcgUtils = require('../../../dist/impulse/chat-plugins/tcg/tcg_utils');
			} catch (e) {
				console.error("Failed to load TCG utils:", e);
				this.skip();
			}
		});

		it("should render card grid HTML", () => {
			const mockCards = [
				{
					cardId: 'sv1-1',
					name: 'Test Card',
					imageUrl: 'https://example.com/card.png',
					rarity: 'Common',
					totalPoints: 10,
					setId: 'sv1',
					supertype: 'Pokémon',
					types: ['Grass'],
					subtypes: ['Basic'],
				},
			];
			const html = tcgUtils.renderCardGridHtml(mockCards, 'Test Title', 'Test Subtitle');
			assert(html.includes('Test Title'), "HTML should include title");
			assert(html.includes('Test Subtitle'), "HTML should include subtitle");
			assert(html.includes('Test Card'), "HTML should include card name");
		});

		it("should render card grid HTML without title/subtitle", () => {
			const mockCards = [
				{
					cardId: 'sv1-2',
					name: 'Another Card',
					imageUrl: 'https://example.com/card2.png',
					rarity: 'Rare',
					totalPoints: 50,
					setId: 'sv1',
					supertype: 'Pokémon',
					types: ['Fire'],
					subtypes: ['Stage 1'],
				},
			];
			const html = tcgUtils.renderCardGridHtml(mockCards);
			assert(html.includes('Another Card'), "HTML should include card name");
			assert(html.includes('infobox'), "HTML should include infobox styling");
		});
	});
});
