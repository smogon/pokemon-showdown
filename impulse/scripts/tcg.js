/**
 * Enhanced Pokemon TCG Card Import Script v4.0
 * Imports cards with full set metadata from https://github.com/PokemonTCG/pokemon-tcg-data
 * * Installation:
 * npm install mongodb
 *
 * Usage:
 * 1. Clone the repo: git clone https://github.com/PokemonTCG/pokemon-tcg-data.git
 * 2. Set environment variables (or edit MONGODB_URI/MONGODB_DATABASE below)
 * 3. Run: node tcg.js <cards-directory> <sets-file>
 *
 * Example:
 * node tcg.js ./pokemon-tcg-data/cards/en ./pokemon-tcg-data/sets/en.json
 */

const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');

// ==================== CONFIGURATION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'impulse';
const COLLECTION_NAME = 'tcg_cards';
const BATCH_SIZE = 10000;

// MongoDB connection
let client;
let db;
let collection;

// Set metadata lookup
let setsLookup = new Map();

// ==================== DATABASE CONNECTION ====================
async function connect() {
	console.log('🔌 Connecting to MongoDB...');
	try {
		client = new MongoClient(MONGODB_URI, {
			maxPoolSize: 20000,
			minPoolSize: 10000,
			maxIdleTimeMS: 60000,
		});
		await client.connect();
		db = client.db(MONGODB_DATABASE);
		collection = db.collection(COLLECTION_NAME);
		console.log(`✅ Connected to database: ${MONGODB_DATABASE}.${COLLECTION_NAME}`);
	} catch (error) {
		console.error('❌ Connection failed:', error.message);
		throw error;
	}
}

async function disconnect() {
	if (client) {
		await client.close();
		console.log('🔌 Disconnected from MongoDB');
	}
}

// ==================== SET DATA LOADING ====================

/**
 * Load sets metadata from sets/en.json
 */
async function loadSetsData(setsFilePath) {
	console.log(`\n📚 Loading sets metadata from: ${setsFilePath}`);
	
	try {
		const content = await fs.readFile(setsFilePath, 'utf8');
		const sets = JSON.parse(content);
		
		if (!Array.isArray(sets)) {
			throw new Error('Sets file must contain an array of set objects');
		}
		
		// Build lookup map: setId -> set metadata
		sets.forEach(set => {
			if (set.id) {
				setsLookup.set(set.id, {
					id: set.id,
					name: set.name,
					series: set.series,
					releaseDate: set.releaseDate,
					printedTotal: set.printedTotal,
					total: set.total,
					ptcgoCode: set.ptcgoCode,
					images: set.images
				});
			}
		});
		
		console.log(`✅ Loaded ${setsLookup.size} sets metadata`);
		
		// Show sample sets
		const sampleSets = Array.from(setsLookup.entries()).slice(0, 3);
		console.log('\n📋 Sample sets loaded:');
		sampleSets.forEach(([id, set]) => {
			console.log(`  ${id}: ${set.name} (${set.series}, ${set.releaseDate})`);
		});
		
	} catch (error) {
		console.error(`❌ Failed to load sets data: ${error.message}`);
		console.log('⚠️  Continuing without set metadata...');
	}
}

// ==================== DATA TRANSFORMATION HELPERS ====================

/**
 * Get points based on rarity
 */
function getRarityPoints(rarity) {
	const points = {
		'Common': 10, '1st Edition': 10, 'Shadowless': 10,
		'Uncommon': 20, 'Reverse Holo': 25,
		'Rare': 40, 'Rare Holo': 60, 'Rare Holo 1st Edition': 70, 'Classic Collection': 60,
		'Promo': 50, 'Black Star Promo': 50,
		'Rare SP': 80, 'Rare Prime': 100, 'LEGEND': 100, 'Rare BREAK': 100, 'Prism Star': 100,
		'Shining': 130, 'Rare Holo Star': 200, 'Gold Star': 400, 'Star': 200,
		'Rare Holo EX': 90, 'Rare Holo GX': 90, 'Rare Holo V': 90, 'Rare Holo VMAX': 110,
		'Rare Holo VSTAR': 110, 'Rare ex': 120, 'Rare Holo LV.X': 190,
		'Radiant Rare': 120, 'Amazing Rare': 130, 'Rare Shiny': 160, 'Shiny Rare': 160,
		'Rare Shiny GX': 170, 'Shiny Ultra Rare': 170,
		'ACE SPEC Rare': 140, 'Rare ACE': 140,
		'Full Art': 150, 'Rare Ultra': 150, 'Ultra Rare': 150,
		'Trainer Gallery': 170, 'Character Rare': 170, 'Character Super Rare': 220,
		'Double Rare': 50, 'Illustration Rare': 180, 'Special Illustration Rare': 300, 'Hyper Rare': 350,
		'Rare Secret': 240, 'Secret Rare': 240, 'Rare Rainbow': 320, 'Gold Full Art': 350, 'Rare Gold': 350,
	};
	return points[rarity] || 10;
}

/**
 * Get points for each subtype
 */
function getSubtypePoints(subtypes) {
	if (!Array.isArray(subtypes) || subtypes.length === 0) return 0;

	const pointsMap = {
		'Basic': 1, 'Stage 1': 2, 'Stage 2': 3, 'Restored': 2, 'Baby': 3,
		'ex': 10, 'EX': 10, 'GX': 10, 'V': 10, 'VMAX': 15, 'VSTAR': 15, 'V-UNION': 15,
		'Mega': 15, 'M': 15, 'Tag Team': 15, 'Ultra Beast': 8,
		'Level-Up': 5, 'BREAK': 5, 'LEGEND': 5, 'Prime': 5, 'SP': 5, 'Star': 10,
		'Radiant': 5, 'Shining': 5, 'Delta Species': 5, 'Crystal': 5,
		'Tera': 5, 'Ancient': 2, 'Future': 2,
		'Team Plasma': 3, 'Single Strike': 3, 'Rapid Strike': 3, 'Fusion Strike': 3,
		'Item': 1, 'Supporter': 1, 'Stadium': 1, 'Pokémon Tool': 2, 'Technical Machine': 2,
		'Rocket\'s Secret Machine': 3, 'ACE SPEC': 10, 'Special': 2,
	};

	return subtypes.reduce((sum, st) => sum + (pointsMap[st] || 1), 0);
}

/**
 * Calculate set points based on set size (smaller sets = more points)
 */
function getSetPoints(setPrintedTotal) {
	if (!setPrintedTotal) return 1;
	
	if (setPrintedTotal <= 20) return 50;
	if (setPrintedTotal <= 50) return 30;
	if (setPrintedTotal <= 75) return 20;
	if (setPrintedTotal <= 100) return 10;
	if (setPrintedTotal <= 150) return 5;
	if (setPrintedTotal <= 200) return 3;
	return 1;
}

/**
 * Determine stage from subtypes
 */
function determineStage(subtypes) {
	if (!subtypes || !Array.isArray(subtypes)) return undefined;
	
	if (subtypes.includes('Basic')) return 'basic';
	if (subtypes.includes('Stage 1')) return 'stage1';
	if (subtypes.includes('Stage 2')) return 'stage2';
	if (subtypes.includes('LEGEND')) return 'legend';
	if (subtypes.includes('BREAK')) return 'break';
	if (subtypes.includes('Level-Up')) return 'levelup';
	if (subtypes.includes('Restored')) return 'restored';
	
	return undefined;
}

/**
 * Main transformation function - converts source format to database format
 */
function transformCard(card) {
	const setId = card.id.split('-')[0];
	const subtypes = Array.isArray(card.subtypes) ? card.subtypes : [];
	const stage = determineStage(subtypes);
	
	const rarity = card.rarity || 'Common';
	const rarityPoints = getRarityPoints(rarity);
	const subtypePoints = getSubtypePoints(subtypes);
	
	// Get set metadata from lookup
	const setData = setsLookup.get(setId);
	const setPoints = getSetPoints(setData?.printedTotal);
	const totalPoints = rarityPoints + subtypePoints + setPoints;
	
	const transformed = {
		// ===== Core Identification =====
		cardId: card.id,
		name: card.name,
		setId: setId,
		set: setData?.name || setId,
		rarity: rarity,
		rarityPoints: rarityPoints,
		supertype: card.supertype || 'Pokémon',
		subtypes: subtypes,
		subtypePoints: subtypePoints,
		setPoints: setPoints,
		totalPoints: totalPoints,
		
		// ===== Type Information =====
		types: Array.isArray(card.types) ? card.types : [],
		
		// ===== Basic Stats =====
		hp: card.hp ? parseInt(card.hp) : undefined,
		level: card.level || undefined,
		stage: stage,
		
		// ===== Images =====
		imageUrl: card.images?.large || card.images?.small || undefined,
		
		// ===== Evolution Chain =====
		evolvesFrom: card.evolvesFrom || undefined,
		evolvesTo: Array.isArray(card.evolvesTo) && card.evolvesTo.length > 0 ? card.evolvesTo : undefined,
		
		// ===== Gameplay Data =====
		abilities: Array.isArray(card.abilities) && card.abilities.length > 0 ? card.abilities : undefined,
		attacks: Array.isArray(card.attacks) && card.attacks.length > 0 ? card.attacks : undefined,
		weaknesses: Array.isArray(card.weaknesses) && card.weaknesses.length > 0 ? card.weaknesses : undefined,
		resistances: Array.isArray(card.resistances) && card.resistances.length > 0 ? card.resistances : undefined,
		retreatCost: Array.isArray(card.retreatCost) && card.retreatCost.length > 0 ? card.retreatCost : undefined,
		convertedRetreatCost: card.convertedRetreatCost !== undefined ? card.convertedRetreatCost : undefined,
		
		// ===== Additional Metadata =====
		cardText: card.flavorText || undefined,
		ruleText: card.rules && Array.isArray(card.rules) ? card.rules.join(' ') : undefined,
		artist: card.artist || undefined,
		nationalPokedexNumbers: Array.isArray(card.nationalPokedexNumbers) && card.nationalPokedexNumbers.length > 0 
			? card.nationalPokedexNumbers 
			: undefined,
		ancientTrait: card.ancientTrait || undefined,
		
		// ===== Set Information (from sets lookup) =====
		number: card.number || undefined,
		setSeries: setData?.series || undefined,
		setReleaseDate: setData?.releaseDate || undefined,
		setPrintedTotal: setData?.printedTotal || undefined,
		setTotal: setData?.total || undefined,
		setPtcgoCode: setData?.ptcgoCode || undefined,
		setImages: setData?.images || undefined,
		
		// ===== Legalities =====
		legalities: card.legalities || undefined,
		regulationMark: card.regulationMark || undefined,
		
		// ===== Import Tracking =====
		importedAt: new Date().toISOString(),
		dataVersion: '4.0'
	};
	
	// Remove undefined values
	Object.keys(transformed).forEach(key => {
		if (transformed[key] === undefined) {
			delete transformed[key];
		}
	});
	
	return transformed;
}

/**
 * Validate transformed card
 */
function validateCard(card) {
	if (!card.cardId || !card.name || !card.setId || !card.set || !card.rarity || !card.supertype) {
		console.warn(`⚠️  Missing essential fields: ${card.name || 'Unknown'} (${card.cardId || 'No ID'})`);
		return false;
	}
	
	if (card.supertype === 'Pokémon' && !card.hp) {
		console.warn(`⚠️  Pokémon missing HP: ${card.name} (${card.cardId})`);
	}
	
	return true;
}

// ==================== FILE OPERATIONS ====================

/**
 * Read all JSON files from a directory recursively
 */
async function readCardsFromDirectory(dirPath) {
	const cards = [];
	
	try {
		const files = await fs.readdir(dirPath);
		const jsonFiles = files.filter(file => file.endsWith('.json'));
		
		console.log(`📁 Found ${jsonFiles.length} JSON files in ${path.basename(dirPath)}`);
		
		for (const file of jsonFiles) {
			const filePath = path.join(dirPath, file);
			try {
				const fileCards = await readCardsFromFile(filePath);
				cards.push(...fileCards);
				process.stdout.write(`\r📄 Processed: ${file.padEnd(30)} (${fileCards.length} cards)`);
			} catch (error) {
				console.error(`\n❌ Error reading ${file}:`, error.message);
			}
		}
		console.log('');
		
	} catch (error) {
		throw new Error(`Failed to read directory ${dirPath}: ${error.message}`);
	}
	
	return cards;
}

/**
 * Read cards from a single JSON file
 */
async function readCardsFromFile(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf8');
		const data = JSON.parse(content);
		
		if (Array.isArray(data)) {
			return data;
		} else if (data.data && Array.isArray(data.data)) {
			return data.data;
		} else {
			console.warn(`⚠️  Unexpected format in ${path.basename(filePath)}`);
			return [];
		}
	} catch (error) {
		throw new Error(`Failed to read/parse ${filePath}: ${error.message}`);
	}
}

// ==================== IMPORT OPERATIONS ====================

/**
 * Import cards to MongoDB in batches
 */
async function importCards(cards) {
	console.log(`\n📊 Processing ${cards.length} cards...`);
	
	if (cards.length > 0) {
		console.log('\n📋 Sample card (original format):');
		console.log(JSON.stringify({
			id: cards[0].id,
			name: cards[0].name,
			supertype: cards[0].supertype,
			rarity: cards[0].rarity,
			subtypes: cards[0].subtypes,
		}, null, 2));
	}

	const transformedCards = cards.map(transformCard);
	
	if (transformedCards.length > 0) {
		console.log('\n📋 Sample card (transformed format):');
		console.log(JSON.stringify({
			cardId: transformedCards[0].cardId,
			name: transformedCards[0].name,
			setId: transformedCards[0].setId,
			set: transformedCards[0].set,
			setSeries: transformedCards[0].setSeries,
			setReleaseDate: transformedCards[0].setReleaseDate,
			rarity: transformedCards[0].rarity,
			rarityPoints: transformedCards[0].rarityPoints,
			subtypePoints: transformedCards[0].subtypePoints,
			setPoints: transformedCards[0].setPoints,
			totalPoints: transformedCards[0].totalPoints,
		}, null, 2));
	}

	const validCards = transformedCards.filter(validateCard);
	const invalidCount = transformedCards.length - validCards.length;
	
	if (invalidCount > 0) {
		console.log(`\n⚠️  ${invalidCount} cards failed validation and will be skipped`);
	}

	console.log(`\n💾 Importing ${validCards.length} valid cards in batches of ${BATCH_SIZE}...`);
	
	let imported = 0;
	let updated = 0;
	let errors = 0;
	
	const stats = {
		pokemonCount: 0,
		trainerCount: 0,
		energyCount: 0,
		withAbilities: 0,
		withAttacks: 0,
		withSetMetadata: 0
	};
	
	for (let i = 0; i < validCards.length; i += BATCH_SIZE) {
		const batch = validCards.slice(i, i + BATCH_SIZE);
		
		batch.forEach(card => {
			if (card.supertype === 'Pokémon') {
				stats.pokemonCount++;
				if (card.abilities) stats.withAbilities++;
				if (card.attacks) stats.withAttacks++;
			} else if (card.supertype === 'Trainer') {
				stats.trainerCount++;
			} else if (card.supertype === 'Energy') {
				stats.energyCount++;
			}
			if (card.setSeries) stats.withSetMetadata++;
		});
		
		try {
			const operations = batch.map(card => ({
				updateOne: {
					filter: { cardId: card.cardId },
					update: { $set: card },
					upsert: true
				}
			}));
			
			const result = await collection.bulkWrite(operations, { ordered: false });
			imported += result.upsertedCount;
			updated += result.modifiedCount;
			
			const progress = Math.min(i + BATCH_SIZE, validCards.length);
			const percentage = Math.round((progress / validCards.length) * 100);
			process.stdout.write(`\r⏳ Progress: ${progress}/${validCards.length} (${percentage}%) - Imported: ${imported}, Updated: ${updated}`);
			
		} catch (error) {
			errors += batch.length;
			console.error(`\n❌ Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
		}
	}
	
	console.log('\n');
	console.log('═'.repeat(60));
	console.log('📊 IMPORT SUMMARY');
	console.log('═'.repeat(60));
	console.log(`✅ New cards imported: ${imported}`);
	console.log(`🔄 Existing cards updated: ${updated}`);
	console.log(`❌ Errors: ${errors}`);
	console.log(`📦 Total processed: ${validCards.length}`);
	console.log('');
	console.log('🎴 CARD TYPE COVERAGE');
	console.log('═'.repeat(60));
	console.log(`🎴 Total Pokémon: ${stats.pokemonCount}`);
	console.log(`   - With Abilities: ${stats.withAbilities}`);
	console.log(`   - With Attacks: ${stats.withAttacks}`);
	console.log(`👤 Trainer cards: ${stats.trainerCount}`);
	console.log(`⚡ Energy cards: ${stats.energyCount}`);
	console.log(`📚 Cards with set metadata: ${stats.withSetMetadata}`);
	console.log('═'.repeat(60));
	
	return { imported, updated, errors, stats };
}

// ==================== DATABASE OPERATIONS ====================

/**
 * Create optimized indexes
 */
async function createIndexes() {
	console.log('\n🔧 Creating database indexes...');
	
	const indexes = [
		{ key: { cardId: 1 }, options: { unique: true, name: 'cardId_unique' } },
		{ key: { setId: 1, rarity: 1 }, options: { name: 'setId_rarity' } },
		{ key: { name: 1 }, options: { name: 'name_text' } },
		{ key: { hp: -1 }, options: { name: 'hp_desc', sparse: true } },
		{ key: { stage: 1 }, options: { name: 'stage', sparse: true } },
		{ key: { rarity: 1 }, options: { name: 'rarity' } },
		{ key: { totalPoints: -1 }, options: { name: 'totalPoints_desc' } },
		{ key: { rarityPoints: -1 }, options: { name: 'rarityPoints_desc' } },
		{ key: { subtypePoints: -1 }, options: { name: 'subtypePoints_desc' } },
		{ key: { setPoints: -1 }, options: { name: 'setPoints_desc' } },
		{ key: { 'legalities.standard': 1 }, options: { name: 'legalities_standard', sparse: true } },
		{ key: { regulationMark: 1 }, options: { name: 'regulationMark', sparse: true } },
		{ key: { setSeries: 1 }, options: { name: 'setSeries', sparse: true } },
	];
	
	try {
		for (const { key, options } of indexes) {
			await collection.createIndex(key, options);
			console.log(`  ✅ Created index: ${options.name}`);
		}
		console.log('✅ All indexes created successfully\n');
	} catch (error) {
		console.error('❌ Error creating indexes:', error.message);
	}
}

/**
 * Generate comprehensive statistics report
 */
async function generateStatistics() {
	console.log('\n📈 DATABASE STATISTICS');
	console.log('═'.repeat(60));
	
	try {
		const totalCards = await collection.countDocuments();
		const uniqueSets = await collection.distinct('set');
		const uniqueRarities = await collection.distinct('rarity');
		
		console.log(`📊 Total cards: ${totalCards}`);
		console.log(`📦 Unique sets: ${uniqueSets.length}`);
		console.log(`💎 Unique rarities: ${uniqueRarities.length}`);
		console.log('');
		
		const supertypes = await collection.aggregate([
			{ $group: { _id: '$supertype', count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		]).toArray();
		
		console.log('🎴 Card Type Distribution:');
		supertypes.forEach(type => {
			const percentage = Math.round((type.count / totalCards) * 100);
			console.log(`  ${type._id}: ${type.count} (${percentage}%)`);
		});
		console.log('');
		
		const highestTotal = await collection.find()
			.sort({ totalPoints: -1 })
			.limit(10)
			.project({ name: 1, rarity: 1, totalPoints: 1, subtypes: 1 })
			.toArray();
			
		if (highestTotal.length > 0) {
			console.log('🏆 Top 10 Cards (by TOTAL points):');
			highestTotal.forEach((card, idx) => {
				console.log(`  ${idx + 1}. ${card.name} - ${card.totalPoints} pts (${card.rarity}, ${card.subtypes.join(', ')})`);
			});
			console.log('');
		}
		
		console.log('═'.repeat(60));
		
	} catch (error) {
		console.error('❌ Error generating statistics:', error.message);
	}
}

// ==================== MAIN EXECUTION ====================

async function main() {
	const args = process.argv.slice(2);
	
	if (args.length < 2) {
		console.log('╔═══════════════════════════════════════════════════════════╗');
		console.log('║   Pokemon TCG Card Import Script v4.0                    ║');
		console.log('╚═══════════════════════════════════════════════════════════╝');
		console.log('');
		console.log('Usage: node tcg.js <cards-directory> <sets-file>');
		console.log('');
		console.log('Example:');
		console.log('  node tcg.js ./pokemon-tcg-data/cards/en ./pokemon-tcg-data/sets/en.json');
		console.log('');
		console.log('Environment Variables:');
		console.log('  MONGODB_URI      - MongoDB connection string (default: mongodb://localhost:27017)');
		console.log('  MONGODB_DATABASE - Database name (default: impulse)');
		console.log('');
		process.exit(1);
	}

	const cardsPath = args[0];
	const setsPath = args[1];
	const startTime = Date.now();
	
	console.log('╔═══════════════════════════════════════════════════════════╗');
	console.log('║   Pokemon TCG Card Import Script v4.0                    ║');
	console.log('╚═══════════════════════════════════════════════════════════╝');
	console.log('');
	
	try {
		await connect();
		
		// Load sets metadata first
		await loadSetsData(setsPath);
		
		// Load cards
		const stats = await fs.stat(cardsPath);
		let cards;
		
		if (stats.isDirectory()) {
			console.log(`\n📂 Reading from directory: ${cardsPath}\n`);
			cards = await readCardsFromDirectory(cardsPath);
		} else if (stats.isFile()) {
			console.log(`\n📄 Reading from file: ${cardsPath}\n`);
			cards = await readCardsFromFile(cardsPath);
		} else {
			throw new Error(`Invalid path: ${cardsPath}`);
		}

		if (cards.length === 0) {
			console.log('⚠️  No cards found to import.');
			return;
		}

		console.log(`\n✅ Loaded ${cards.length} cards from source\n`);
		
		await importCards(cards);
		await createIndexes();
		await generateStatistics();
		
		const duration = ((Date.now() - startTime) / 1000).toFixed(2);
		console.log(`\n⏱️  Total time: ${duration} seconds`);
		console.log('✅ Import completed successfully!\n');
		
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(`\n❌ Error: Path not found`);
			console.error('\n💡 Make sure you have cloned the repository:');
			console.error('   git clone https://github.com/PokemonTCG/pokemon-tcg-data.git\n');
		} else {
			console.error('\n❌ Fatal error:', error.message);
			console.error(error.stack);
		}
		process.exit(1);
	} finally {
		await disconnect();
	}
}

process.on('unhandledRejection', (error) => {
	console.error('\n❌ Unhandled rejection:', error);
	process.exit(1);
});

process.on('SIGINT', async () => {
	console.log('\n\n⚠️  Interrupted by user. Cleaning up...');
	await disconnect();
	process.exit(0);
});

if (require.main === module) {
	main();
}
