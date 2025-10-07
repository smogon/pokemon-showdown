/**
 * Impulse-DB
 * Pokemon Showdown - MongoDB Integration
 *
 * An abstraction layer around MongoDB Native Driver for Pokemon Showdown.
 * Designed to work with MongoDB Atlas Free Tier (M0) limitations.
 *
 * Advantages:
 * - PS-style API similar to FS module
 * - Automatic connection management with pooling
 * - Promise-based interface
 * - Support for all MongoDB Atlas Free Tier operations
 * - Built-in error handling and retry logic
 *
 * MongoDB Atlas Free Tier Limitations (M0):
 * - 512 MB storage
 * - Shared RAM
 * - No backup/restore
 * - 100 max connections (recommend maxPoolSize: 10)
 * - Aggregation pipelines timeout after 60 seconds
 * - Sort operations limited to 100MB memory (no allowDiskUse)
 * - Collection rename NOT supported (use manual copy/drop instead)
 * - JavaScript operations (mapReduce, $where) NOT supported
 * - Cannot access 'local' or 'config' databases
 * - Automatic pause after 60 days of inactivity
 *
 * @license MIT
 */

import { MongoClient, Db, Collection, Document, Filter, UpdateFilter, OptionalId, FindOptions, UpdateOptions, DeleteOptions, InsertOneOptions, BulkWriteOptions, AggregateOptions, CountDocumentsOptions, CreateIndexesOptions, IndexSpecification, MongoClientOptions } from 'mongodb';

interface ImpulseDBConfig {
	uri: string;
	dbName: string;
	options?: MongoClientOptions; // Support ALL MongoDB connection options
}

interface GlobalState {
	client: MongoClient | null;
	db: Db | null;
	config: ImpulseDBConfig | null;
	isConnecting: boolean;
	connectionPromise: Promise<void> | null;
}

declare const global: {
	__impulseDBState?: GlobalState;
	Config?: any;
};

if (!global.__impulseDBState) {
	global.__impulseDBState = {
		client: null,
		db: null,
		config: null,
		isConnecting: false,
		connectionPromise: null,
	};
}

const state = global.__impulseDBState;

/**
 * Initialize the database connection
 */
export async function init(config: ImpulseDBConfig): Promise<void> {
	if (state.client && state.db) {
		throw new Error('ImpulseDB: Already initialized');
	}

	// Use provided options or defaults optimized for M0 Free Tier
	const options: MongoClientOptions = config.options || {
		maxPoolSize: 10,
		minPoolSize: 2,
		maxIdleTimeMS: 30000,
		serverSelectionTimeoutMS: 5000,
		connectTimeoutMS: 10000,
	};

	state.config = config;
	state.client = new MongoClient(config.uri, options);
	
	await state.client.connect();
	state.db = state.client.db(config.dbName);
}

/**
 * Ensure database is connected
 */
async function ensureConnection(): Promise<Db> {
	if (!state.db || !state.client) {
		throw new Error('ImpulseDB: Not initialized. Call ImpulseDB.init() first.');
	}

	// Verify connection is alive
	try {
		await state.client.db('admin').command({ ping: 1 });
	} catch (err) {
		// Try to reconnect
		if (state.config) {
			await init(state.config);
		} else {
			throw new Error('ImpulseDB: Connection lost and no config available for reconnection');
		}
	}

	return state.db!;
}

/**
 * Close the database connection
 */
export async function close(): Promise<void> {
	if (state.client) {
		await state.client.close();
		state.client = null;
		state.db = null;
		state.config = null;
	}
}

/**
 * Get database instance (for advanced operations)
 */
export async function getDb(): Promise<Db> {
	return ensureConnection();
}

/**
 * Collection wrapper with PS-style API
 */
export class ImpulseCollection<T extends Document = Document> {
	collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	private async getCollection(): Promise<Collection<T>> {
		const db = await ensureConnection();
		return db.collection<T>(this.collectionName);
	}

	/**
	 * Insert a single document
	 */
	async insertOne(doc: OptionalId<T>, options?: InsertOneOptions) {
		const collection = await this.getCollection();
		return collection.insertOne(doc, options);
	}

	/**
	 * Insert multiple documents
	 */
	async insertMany(docs: OptionalId<T>[], options?: BulkWriteOptions) {
		const collection = await this.getCollection();
		return collection.insertMany(docs, options);
	}

	/**
	 * Find a single document
	 */
	async findOne(filter: Filter<T>, options?: FindOptions) {
		const collection = await this.getCollection();
		return collection.findOne(filter, options);
	}

	/**
	 * Find multiple documents
	 */
	async find(filter: Filter<T>, options?: FindOptions) {
		const collection = await this.getCollection();
		return collection.find(filter, options).toArray();
	}

	/**
	 * Find with cursor (for large result sets)
	 */
	findCursor(filter: Filter<T>, options?: FindOptions) {
		return this.getCollection().then(col => col.find(filter, options));
	}

	/**
	 * Update a single document
	 */
	async updateOne(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions) {
		const collection = await this.getCollection();
		return collection.updateOne(filter, update, options);
	}

	/**
	 * Update multiple documents
	 */
	async updateMany(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions) {
		const collection = await this.getCollection();
		return collection.updateMany(filter, update, options);
	}

	/**
	 * Replace a single document
	 */
	async replaceOne(filter: Filter<T>, replacement: T, options?: UpdateOptions) {
		const collection = await this.getCollection();
		return collection.replaceOne(filter, replacement, options);
	}

	/**
	 * Delete a single document
	 */
	async deleteOne(filter: Filter<T>, options?: DeleteOptions) {
		const collection = await this.getCollection();
		return collection.deleteOne(filter, options);
	}

	/**
	 * Delete multiple documents
	 */
	async deleteMany(filter: Filter<T>, options?: DeleteOptions) {
		const collection = await this.getCollection();
		return collection.deleteMany(filter, options);
	}

	/**
	 * Count documents matching filter
	 */
	async countDocuments(filter: Filter<T> = {}, options?: CountDocumentsOptions) {
		const collection = await this.getCollection();
		return collection.countDocuments(filter, options);
	}

	/**
	 * Estimated document count (faster but less accurate)
	 */
	async estimatedDocumentCount() {
		const collection = await this.getCollection();
		return collection.estimatedDocumentCount();
	}

	/**
	 * Check if any documents match the filter
	 */
	async exists(filter: Filter<T>): Promise<boolean> {
		const count = await this.countDocuments(filter, { limit: 1 });
		return count > 0;
	}

	/**
	 * Aggregate data
	 * NOTE: On M0 Free Tier, aggregation pipelines timeout after 60 seconds
	 * Avoid using $lookup, $graphLookup, or complex operations on large datasets
	 */
	async aggregate<R = any>(pipeline: Document[], options?: AggregateOptions): Promise<R[]> {
		const collection = await this.getCollection();
		return collection.aggregate<R>(pipeline, options).toArray();
	}

	/**
	 * Aggregate with cursor (for large result sets)
	 * NOTE: On M0 Free Tier, aggregation pipelines timeout after 60 seconds
	 * Cannot use allowDiskUse option on free tier
	 */
	aggregateCursor<R = any>(pipeline: Document[], options?: AggregateOptions) {
		return this.getCollection().then(col => col.aggregate<R>(pipeline, options));
	}

	/**
	 * Create an index
	 */
	async createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions) {
		const collection = await this.getCollection();
		return collection.createIndex(indexSpec, options);
	}

	/**
	 * Create multiple indexes
	 */
	async createIndexes(indexSpecs: IndexSpecification[], options?: CreateIndexesOptions) {
		const collection = await this.getCollection();
		return collection.createIndexes(indexSpecs, options);
	}

	/**
	 * Drop an index
	 */
	async dropIndex(indexName: string) {
		const collection = await this.getCollection();
		return collection.dropIndex(indexName);
	}

	/**
	 * List all indexes
	 */
	async listIndexes() {
		const collection = await this.getCollection();
		return collection.listIndexes().toArray();
	}

	/**
	 * Find one and update (atomic operation)
	 */
	async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOptions & UpdateOptions) {
		const collection = await this.getCollection();
		return collection.findOneAndUpdate(filter, update, options);
	}

	/**
	 * Find one and replace (atomic operation)
	 */
	async findOneAndReplace(filter: Filter<T>, replacement: T, options?: FindOptions & UpdateOptions) {
		const collection = await this.getCollection();
		return collection.findOneAndReplace(filter, replacement, options);
	}

	/**
	 * Find one and delete (atomic operation)
	 */
	async findOneAndDelete(filter: Filter<T>, options?: FindOptions & DeleteOptions) {
		const collection = await this.getCollection();
		return collection.findOneAndDelete(filter, options);
	}

	/**
	 * Distinct values for a field
	 */
	async distinct<K extends keyof T>(key: K, filter?: Filter<T>): Promise<T[K][]> {
		const collection = await this.getCollection();
		return collection.distinct(key as string, filter || {}) as Promise<T[K][]>;
	}

	/**
	 * Bulk write operations
	 */
	async bulkWrite(operations: any[], options?: BulkWriteOptions) {
		const collection = await this.getCollection();
		return collection.bulkWrite(operations, options);
	}

	/**
	 * Drop the collection
	 */
	async drop() {
		const collection = await this.getCollection();
		return collection.drop();
	}

	/**
	 * Watch for changes (Change Streams)
	 * NOTE: On M0 Free Tier, only $match operator is supported in pipeline
	 * Change streams require the collection to exist first
	 * 
	 * Example:
	 * const changeStream = await ImpulseDB("users").watch([{ $match: { operationType: "insert" } }]);
	 * changeStream.on('change', (change) => console.log(change));
	 */
	async watch(pipeline: Document[] = [], options: any = {}) {
		const collection = await this.getCollection();
		return collection.watch(pipeline, options);
	}

	/**
	 * Create a text search index
	 * Text search is supported on M0 Free Tier
	 * 
	 * Example:
	 * await ImpulseDB("posts").createTextIndex({ title: "text", content: "text" });
	 */
	async createTextIndex(fields: Document, options?: CreateIndexesOptions) {
		const collection = await this.getCollection();
		return collection.createIndex(fields, options);
	}

	/**
	 * Get collection statistics
	 */
	async stats() {
		const db = await ensureConnection();
		return db.command({ collStats: this.collectionName });
	}

	/**
	 * Get collection info
	 */
	async info() {
		const db = await ensureConnection();
		const collections = await db.listCollections({ name: this.collectionName }).toArray();
		return collections[0] || null;
	}

	/**
	 * Check if collection exists
	 */
	async collectionExists(): Promise<boolean> {
		const info = await this.info();
		return info !== null;
	}

	/**
	 * Find with pagination helper
	 * Returns { docs, total, page, totalPages }
	 */
	async findPaginated(
		filter: Filter<T>,
		options: { page?: number; limit?: number; sort?: any } = {}
	) {
		const page = options.page || 1;
		const limit = options.limit || 20;
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.find(filter, { ...options, skip, limit }),
			this.countDocuments(filter),
		]);

		return {
			docs,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			hasNext: page * limit < total,
			hasPrev: page > 1,
		};
	}

	/**
	 * Upsert helper (update if exists, insert if not)
	 */
	async upsert(filter: Filter<T>, update: UpdateFilter<T> | T) {
		// If update doesn't have operators, treat as replacement
		const hasOperators = Object.keys(update).some(key => key.startsWith('
	 * WARNING: NOT SUPPORTED on M0 Free Tier - will throw error
	 * For free tier, manually copy data to new collection and drop old one
	 */
	async rename(newName: string, options?: { dropTarget?: boolean }) {
		const collection = await this.getCollection();
		try {
			return await collection.rename(newName, options);
		} catch (err: any) {
			if (err.message?.includes('not allowed')) {
				throw new Error(
					'ImpulseDB: Collection.rename() is not supported on MongoDB Atlas M0 Free Tier. ' +
					'Manually copy documents to a new collection and drop the old one instead.'
				);
			}
			throw err;
		}
	}
}

/**
 * Main factory function (PS-style API)
 */
function getCollection<T extends Document = Document>(collectionName: string): ImpulseCollection<T> {
	return new ImpulseCollection<T>(collectionName);
}

/**
 * Start a transaction session
 * Transactions ARE supported on M0 Free Tier (replica set)
 */
export async function startSession() {
	if (!state.client) {
		throw new Error('ImpulseDB: Not initialized. Call ImpulseDB.init() first.');
	}
	return state.client.startSession();
}

/**
 * Run operations in a transaction
 * Example: await ImpulseDB.withTransaction(async (session) => {
 *   await ImpulseDB("users").insertOne({ name: "Alice" }, { session });
 *   await ImpulseDB("logs").insertOne({ action: "user_created" }, { session });
 * });
 */
export async function withTransaction<T>(
	callback: (session: any) => Promise<T>
): Promise<T> {
	const session = await startSession();
	try {
		session.startTransaction();
		const result = await callback(session);
		await session.commitTransaction();
		return result;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

/**
 * List all collections in the database
 */
export async function listCollections(): Promise<string[]> {
	const db = await ensureConnection();
	const collections = await db.listCollections().toArray();
	return collections.map(col => col.name);
}

/**
 * Get database statistics
 */
export async function stats() {
	const db = await ensureConnection();
	return db.stats();
}

/**
 * Run a database command
 * Use with caution - some commands not supported on M0
 */
export async function command(cmd: Document) {
	const db = await ensureConnection();
	return db.command(cmd);
}

/**
 * Export main module
 */
export const ImpulseDB = Object.assign(getCollection, {
	init,
	close,
	getDb,
	startSession,
	withTransaction,
	listCollections,
	stats,
	command,
	ImpulseCollection,
});

/**
 * Type helpers for common use cases
 */
export type { Filter, UpdateFilter, FindOptions, UpdateOptions, DeleteOptions, Document };
));
		
		if (hasOperators) {
			return this.updateOne(filter, update as UpdateFilter<T>, { upsert: true });
		} else {
			return this.replaceOne(filter, update as T, { upsert: true });
		}
	}

	/**
	 * Increment a numeric field atomically
	 */
	async increment(filter: Filter<T>, field: string, amount: number = 1) {
		return this.updateOne(filter, { $inc: { [field]: amount } } as any);
	}

	/**
	 * Push to an array field atomically
	 */
	async push(filter: Filter<T>, field: string, value: any) {
		return this.updateOne(filter, { $push: { [field]: value } } as any);
	}

	/**
	 * Pull from an array field atomically
	 */
	async pull(filter: Filter<T>, field: string, value: any) {
		return this.updateOne(filter, { $pull: { [field]: value } } as any);
	}

	/**
	 * Rename the collection
	 * WARNING: NOT SUPPORTED on M0 Free Tier - will throw error
	 * For free tier, manually copy data to new collection and drop old one
	 */
	async rename(newName: string, options?: { dropTarget?: boolean }) {
		const collection = await this.getCollection();
		try {
			return await collection.rename(newName, options);
		} catch (err: any) {
			if (err.message?.includes('not allowed')) {
				throw new Error(
					'ImpulseDB: Collection.rename() is not supported on MongoDB Atlas M0 Free Tier. ' +
					'Manually copy documents to a new collection and drop the old one instead.'
				);
			}
			throw err;
		}
	}
}

/**
 * Main factory function (PS-style API)
 */
function getCollection<T extends Document = Document>(collectionName: string): ImpulseCollection<T> {
	return new ImpulseCollection<T>(collectionName);
}

/**
 * Start a transaction session
 * Transactions ARE supported on M0 Free Tier (replica set)
 */
export async function startSession() {
	if (!state.client) {
		throw new Error('ImpulseDB: Not initialized. Call ImpulseDB.init() first.');
	}
	return state.client.startSession();
}

/**
 * Run operations in a transaction
 * Example: await ImpulseDB.withTransaction(async (session) => {
 *   await ImpulseDB("users").insertOne({ name: "Alice" }, { session });
 *   await ImpulseDB("logs").insertOne({ action: "user_created" }, { session });
 * });
 */
export async function withTransaction<T>(
	callback: (session: any) => Promise<T>
): Promise<T> {
	const session = await startSession();
	try {
		session.startTransaction();
		const result = await callback(session);
		await session.commitTransaction();
		return result;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

/**
 * List all collections in the database
 */
export async function listCollections(): Promise<string[]> {
	const db = await ensureConnection();
	const collections = await db.listCollections().toArray();
	return collections.map(col => col.name);
}

/**
 * Get database statistics
 */
export async function stats() {
	const db = await ensureConnection();
	return db.stats();
}

/**
 * Run a database command
 * Use with caution - some commands not supported on M0
 */
export async function command(cmd: Document) {
	const db = await ensureConnection();
	return db.command(cmd);
}

/**
 * Export main module
 */
export const ImpulseDB = Object.assign(getCollection, {
	init,
	close,
	getDb,
	startSession,
	withTransaction,
	listCollections,
	stats,
	command,
	ImpulseCollection,
});

/**
 * Type helpers for common use cases
 */
export type { Filter, UpdateFilter, FindOptions, UpdateOptions, DeleteOptions, Document };
