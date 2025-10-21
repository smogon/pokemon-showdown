/**
 * Impulse-DB: MongoDB Integration Layer
 * Local deployment with full feature support
 * 
 * MongoDB Atlas M0 (Free) Limitations (for reference):
 * - 512 MB storage, 100 max connections (maxPoolSize: 10)
 * - Aggregation timeout: 60s, Sort memory: 100MB (no allowDiskUse)
 * - No collection rename, JavaScript operations (mapReduce, $where)
 * - Cannot access 'local'/'config' databases
 * 
 * @license MIT
 * @author PrinceSky-Git
 */

import { MongoClient, Db, Collection, Document, Filter, UpdateFilter, OptionalId, FindOptions, UpdateOptions, DeleteOptions, InsertOneOptions, BulkWriteOptions, AggregateOptions, CountDocumentsOptions, CreateIndexesOptions, IndexSpecification, MongoClientOptions, ClientSession, TransactionOptions, CollectionInfo, ListCollectionsOptions, RenameOptions } from 'mongodb';

/**
 * Configuration for ImpulseDB initialization
 */
interface ImpulseDBConfig { 
	uri: string; 
	dbName: string; 
	options?: MongoClientOptions; 
}

/**
 * Global state management for database connection
 */
interface GlobalState { 
	client: MongoClient | null; 
	db: Db | null; 
	config: ImpulseDBConfig | null; 
	isConnecting: boolean; 
	connectionPromise: Promise<void> | null; 
}

declare const global: { __impulseDBState?: GlobalState; Config?: unknown; };

if (!global.__impulseDBState) {
	global.__impulseDBState = { client: null, db: null, config: null, isConnecting: false, connectionPromise: null };
}

const state = global.__impulseDBState;

/**
 * Initializes the database connection
 * @param config - Database configuration object
 */
export const init = async (config: ImpulseDBConfig): Promise<void> => {
	if (state.client && state.db) throw new Error('ImpulseDB already initialized');

	const opts: MongoClientOptions = config.options || {
		maxPoolSize: 500,
		minPoolSize: 5,
		maxIdleTimeMS: 60000,
		serverSelectionTimeoutMS: 10000,
		connectTimeoutMS: 20000,
	};

	state.config = config;
	state.client = new MongoClient(config.uri, opts);
	await state.client.connect();
	state.db = state.client.db(config.dbName);
};

/**
 * Ensures database connection is active, reconnects if necessary
 * @returns Active database instance
 */
const ensureConnection = async (): Promise<Db> => {
	if (!state.db || !state.client) throw new Error('ImpulseDB not initialized. Call ImpulseDB.init()');

	try {
		await state.client.db('admin').command({ ping: 1 });
	} catch {
		if (state.config) {
			await init(state.config);
		} else {
			throw new Error('Connection lost and no config for reconnection');
		}
	}

	return state.db!;
};

/**
 * Closes the database connection
 */
export const close = async (): Promise<void> => {
	if (state.client) {
		await state.client.close();
		state.client = null;
		state.db = null;
		state.config = null;
	}
};

/**
 * Gets the database instance
 * @returns Database instance
 */
export const getDb = async (): Promise<Db> => ensureConnection();

/**
 * Gets the MongoDB client instance
 * @returns MongoDB client
 */
export const getClient = async (): Promise<MongoClient> => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client;
};

/**
 * Paginated query result
 */
interface PaginatedResult<T> {
	docs: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

/**
 * Batch update result
 */
interface BatchUpdateResult {
	processed: number;
	updated: number;
}

/**
 * Collection clone result
 */
interface CloneResult {
	copied: number;
}

/**
 * Wrapper class for MongoDB collection with enhanced functionality
 */
export class ImpulseCollection<T extends Document = Document> {
	collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	/**
	 * Gets the MongoDB collection instance
	 * @returns Collection instance
	 */
	private async getCollection(): Promise<Collection<T>> {
		const db = await ensureConnection();
		return db.collection<T>(this.collectionName);
	}

	/**
	 * Inserts a single document
	 * @param doc - Document to insert
	 * @param options - Insert options
	 * @returns Insert result
	 */
	async insertOne(doc: OptionalId<T>, options?: InsertOneOptions): Promise<ReturnType<Collection<T>['insertOne']>> {
		const col = await this.getCollection();
		return col.insertOne(doc, options);
	}

	/**
	 * Inserts multiple documents
	 * @param docs - Documents to insert
	 * @param options - Bulk write options
	 * @returns Insert result
	 */
	async insertMany(docs: OptionalId<T>[], options?: BulkWriteOptions): Promise<ReturnType<Collection<T>['insertMany']>> {
		const col = await this.getCollection();
		return col.insertMany(docs, options);
	}

	/**
	 * Finds a single document
	 * @param filter - Query filter
	 * @param options - Find options
	 * @returns Document or null
	 */
	async findOne(filter: Filter<T>, options?: FindOptions): Promise<T | null> {
		const col = await this.getCollection();
		return col.findOne(filter, options);
	}

	/**
	 * Finds multiple documents
	 * @param filter - Query filter
	 * @param options - Find options
	 * @returns Array of documents
	 */
	async find(filter: Filter<T>, options?: FindOptions): Promise<T[]> {
		const col = await this.getCollection();
		return col.find(filter, options).toArray();
	}

	/**
	 * Returns a cursor for find operation
	 * @param filter - Query filter
	 * @param options - Find options
	 * @returns Find cursor
	 */
	findCursor(filter: Filter<T>, options?: FindOptions): Promise<ReturnType<Collection<T>['find']>> {
		return this.getCollection().then(col => col.find(filter, options));
	}

	/**
	 * Updates a single document
	 * @param filter - Query filter
	 * @param update - Update operations
	 * @param options - Update options
	 * @returns Update result
	 */
	async updateOne(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<ReturnType<Collection<T>['updateOne']>> {
		const col = await this.getCollection();
		return col.updateOne(filter, update, options);
	}

	/**
	 * Updates multiple documents
	 * @param filter - Query filter
	 * @param update - Update operations
	 * @param options - Update options
	 * @returns Update result
	 */
	async updateMany(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<ReturnType<Collection<T>['updateMany']>> {
		const col = await this.getCollection();
		return col.updateMany(filter, update, options);
	}

	/**
	 * Replaces a single document
	 * @param filter - Query filter
	 * @param replacement - Replacement document
	 * @param options - Update options
	 * @returns Replace result
	 */
	async replaceOne(filter: Filter<T>, replacement: T, options?: UpdateOptions): Promise<ReturnType<Collection<T>['replaceOne']>> {
		const col = await this.getCollection();
		return col.replaceOne(filter, replacement, options);
	}

	/**
	 * Deletes a single document
	 * @param filter - Query filter
	 * @param options - Delete options
	 * @returns Delete result
	 */
	async deleteOne(filter: Filter<T>, options?: DeleteOptions): Promise<ReturnType<Collection<T>['deleteOne']>> {
		const col = await this.getCollection();
		return col.deleteOne(filter, options);
	}

	/**
	 * Deletes multiple documents
	 * @param filter - Query filter
	 * @param options - Delete options
	 * @returns Delete result
	 */
	async deleteMany(filter: Filter<T>, options?: DeleteOptions): Promise<ReturnType<Collection<T>['deleteMany']>> {
		const col = await this.getCollection();
		return col.deleteMany(filter, options);
	}

	/**
	 * Counts documents matching filter
	 * @param filter - Query filter
	 * @param options - Count options
	 * @returns Document count
	 */
	async countDocuments(filter: Filter<T> = {}, options?: CountDocumentsOptions): Promise<number> {
		const col = await this.getCollection();
		return col.countDocuments(filter, options);
	}

	/**
	 * Gets estimated document count (faster but less accurate)
	 * @returns Estimated document count
	 */
	async estimatedDocumentCount(): Promise<number> {
		const col = await this.getCollection();
		return col.estimatedDocumentCount();
	}

	/**
	 * Checks if documents matching filter exist
	 * @param filter - Query filter
	 * @returns True if documents exist
	 */
	async exists(filter: Filter<T>): Promise<boolean> {
		return (await this.countDocuments(filter, { limit: 1 })) > 0;
	}

	/**
	 * Runs an aggregation pipeline
	 * @param pipeline - Aggregation pipeline
	 * @param options - Aggregation options
	 * @returns Aggregation results
	 */
	async aggregate<R = unknown>(pipeline: Document[], options?: AggregateOptions): Promise<R[]> {
		const col = await this.getCollection();
		return col.aggregate<R>(pipeline, options).toArray();
	}

	/**
	 * Returns a cursor for aggregation operation
	 * @param pipeline - Aggregation pipeline
	 * @param options - Aggregation options
	 * @returns Aggregation cursor
	 */
	aggregateCursor<R = unknown>(pipeline: Document[], options?: AggregateOptions): Promise<ReturnType<Collection<T>['aggregate']>> {
		return this.getCollection().then(col => col.aggregate<R>(pipeline, options));
	}

	/**
	 * Creates a single index
	 * @param indexSpec - Index specification
	 * @param options - Index creation options
	 * @returns Index name
	 */
	async createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string> {
		const col = await this.getCollection();
		return col.createIndex(indexSpec, options);
	}

	/**
	 * Creates multiple indexes
	 * @param indexSpecs - Array of index specifications
	 * @param options - Index creation options
	 * @returns Array of index names
	 */
	async createIndexes(indexSpecs: IndexSpecification[], options?: CreateIndexesOptions): Promise<string[]> {
		const col = await this.getCollection();
		return col.createIndexes(indexSpecs, options);
	}

	/**
	 * Drops a single index
	 * @param indexName - Name of index to drop
	 * @returns Drop result
	 */
	async dropIndex(indexName: string): Promise<Document> {
		const col = await this.getCollection();
		return col.dropIndex(indexName);
	}

	/**
	 * Drops all indexes except _id
	 * @returns Drop result
	 */
	async dropIndexes(): Promise<Document> {
		const col = await this.getCollection();
		return col.dropIndexes();
	}

	/**
	 * Lists all indexes on collection
	 * @returns Array of index information
	 */
	async listIndexes(): Promise<Document[]> {
		const col = await this.getCollection();
		return col.listIndexes().toArray();
	}

	/**
	 * Finds and updates a single document
	 * @param filter - Query filter
	 * @param update - Update operations
	 * @param options - Find and update options
	 * @returns Updated document or null
	 */
	async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOptions & UpdateOptions): Promise<ReturnType<Collection<T>['findOneAndUpdate']>> {
		const col = await this.getCollection();
		return col.findOneAndUpdate(filter, update, options);
	}

	/**
	 * Finds and replaces a single document
	 * @param filter - Query filter
	 * @param replacement - Replacement document
	 * @param options - Find and replace options
	 * @returns Replaced document or null
	 */
	async findOneAndReplace(filter: Filter<T>, replacement: T, options?: FindOptions & UpdateOptions): Promise<ReturnType<Collection<T>['findOneAndReplace']>> {
		const col = await this.getCollection();
		return col.findOneAndReplace(filter, replacement, options);
	}

	/**
	 * Finds and deletes a single document
	 * @param filter - Query filter
	 * @param options - Find and delete options
	 * @returns Deleted document or null
	 */
	async findOneAndDelete(filter: Filter<T>, options?: FindOptions & DeleteOptions): Promise<ReturnType<Collection<T>['findOneAndDelete']>> {
		const col = await this.getCollection();
		return col.findOneAndDelete(filter, options);
	}

	/**
	 * Gets distinct values for a field
	 * @param key - Field key
	 * @param filter - Query filter
	 * @returns Array of distinct values
	 */
	async distinct<K extends keyof T>(key: K, filter?: Filter<T>): Promise<T[K][]> {
		const col = await this.getCollection();
		return col.distinct(key as string, filter || {}) as Promise<T[K][]>;
	}

	/**
	 * Executes bulk write operations
	 * @param operations - Array of bulk operations
	 * @param options - Bulk write options
	 * @returns Bulk write result
	 */
	async bulkWrite(operations: unknown[], options?: BulkWriteOptions): Promise<ReturnType<Collection<T>['bulkWrite']>> {
		const col = await this.getCollection();
		return col.bulkWrite(operations as Parameters<Collection<T>['bulkWrite']>[0], options);
	}

	/**
	 * Drops the collection
	 * @returns Drop result
	 */
	async drop(): Promise<boolean> {
		const col = await this.getCollection();
		return col.drop();
	}

	/**
	 * Watches collection for changes
	 * @param pipeline - Aggregation pipeline for filtering changes
	 * @param options - Watch options
	 * @returns Change stream
	 */
	async watch(pipeline: Document[] = [], options: unknown = {}): Promise<ReturnType<Collection<T>['watch']>> {
		const col = await this.getCollection();
		return col.watch(pipeline, options);
	}

	/**
	 * Creates a text index
	 * @param fields - Fields to index
	 * @param options - Index creation options
	 * @returns Index name
	 */
	async createTextIndex(fields: Document, options?: CreateIndexesOptions): Promise<string> {
		const col = await this.getCollection();
		return col.createIndex(fields, options);
	}

	/**
	 * Gets collection statistics
	 * @returns Collection stats
	 */
	async stats(): Promise<Document> {
		const db = await ensureConnection();
		return db.command({ collStats: this.collectionName });
	}

	/**
	 * Gets collection information
	 * @returns Collection info or null
	 */
	async info(): Promise<Document | null> {
		const db = await ensureConnection();
		const cols = await db.listCollections({ name: this.collectionName }).toArray();
		return cols[0] || null;
	}

	/**
	 * Checks if collection exists
	 * @returns True if collection exists
	 */
	async collectionExists(): Promise<boolean> {
		return (await this.info()) !== null;
	}

	/**
	 * Finds documents with pagination
	 * @param filter - Query filter
	 * @param options - Pagination options
	 * @returns Paginated results
	 */
	async findPaginated(filter: Filter<T>, options: { page?: number; limit?: number; sort?: unknown } = {}): Promise<PaginatedResult<T>> {
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
	 * Updates or inserts a document
	 * @param filter - Query filter
	 * @param update - Update operations or replacement document
	 * @returns Upsert result
	 */
	async upsert(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<ReturnType<Collection<T>['updateOne']> | ReturnType<Collection<T>['replaceOne']>> {
		const hasOps = Object.keys(update).some(k => k.startsWith('$'));
		return hasOps ? 
			this.updateOne(filter, update as UpdateFilter<T>, { upsert: true }) :
			this.replaceOne(filter, update as T, { upsert: true });
	}

	/**
	 * Increments a numeric field
	 * @param filter - Query filter
	 * @param field - Field to increment
	 * @param amount - Amount to increment
	 * @returns Update result
	 */
	async increment(filter: Filter<T>, field: string, amount = 1): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $inc: { [field]: amount } } as UpdateFilter<T>);
	}

	/**
	 * Pushes value to array field
	 * @param filter - Query filter
	 * @param field - Array field
	 * @param value - Value to push
	 * @returns Update result
	 */
	async push(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $push: { [field]: value } } as UpdateFilter<T>);
	}

	/**
	 * Pulls value from array field
	 * @param filter - Query filter
	 * @param field - Array field
	 * @param value - Value to pull
	 * @returns Update result
	 */
	async pull(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $pull: { [field]: value } } as UpdateFilter<T>);
	}

	/**
	 * Adds value to set (array with unique values)
	 * @param filter - Query filter
	 * @param field - Array field
	 * @param value - Value to add
	 * @returns Update result
	 */
	async addToSet(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $addToSet: { [field]: value } } as UpdateFilter<T>);
	}

	/**
	 * Removes first or last element from array
	 * @param filter - Query filter
	 * @param field - Array field
	 * @param position - 1 for last, -1 for first
	 * @returns Update result
	 */
	async pop(filter: Filter<T>, field: string, position: 1 | -1 = 1): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $pop: { [field]: position } } as UpdateFilter<T>);
	}

	/**
	 * Renames the collection
	 * @param newName - New collection name
	 * @param options - Rename options
	 * @returns Renamed collection
	 */
	async rename(newName: string, options?: RenameOptions): Promise<Collection<T>> {
		const col = await this.getCollection();
		return col.rename(newName, options);
	}

	/**
	 * Creates a geospatial index
	 * @param indexSpec - Index specification
	 * @param options - Index creation options
	 * @returns Index name
	 */
	async createGeoIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string> {
		const col = await this.getCollection();
		return col.createIndex(indexSpec, options);
	}

	/**
	 * Finds documents near a geographic point
	 * @param field - Geospatial field name
	 * @param coords - Coordinates [longitude, latitude]
	 * @param maxDistance - Maximum distance in meters
	 * @param options - Find options
	 * @returns Array of documents
	 */
	async findNear(field: string, coords: [number, number], maxDistance?: number, options?: FindOptions): Promise<T[]> {
		const query: Document = {
			[field]: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: coords
					}
				}
			}
		};
		if (maxDistance) query[field].$near.$maxDistance = maxDistance;
		return this.find(query as Filter<T>, options);
	}

	/**
	 * Executes a map-reduce operation
	 * @deprecated MapReduce is deprecated in MongoDB 5.0+. Use aggregation pipeline instead.
	 * @param map - Map function
	 * @param reduce - Reduce function
	 * @param options - MapReduce options
	 * @returns MapReduce result
	 */
	async mapReduce(map: Function | string, reduce: Function | string, options: Document): Promise<Document> {
		const db = await ensureConnection();
		return db.command({
			mapReduce: this.collectionName,
			map: map.toString(),
			reduce: reduce.toString(),
			...options
		});
	}

	/**
	 * Finds documents using JavaScript expression
	 * @deprecated $where is deprecated. Use aggregation expressions instead.
	 * @param jsFunction - JavaScript function or string
	 * @param options - Find options
	 * @returns Array of documents
	 */
	async findWhere(jsFunction: string | Function, options?: FindOptions): Promise<T[]> {
		const query: Document = { $where: typeof jsFunction === 'function' ? jsFunction.toString() : jsFunction };
		return this.find(query as Filter<T>, options);
	}

	/**
	 * Creates a capped collection
	 * @param size - Maximum size in bytes
	 * @param max - Maximum number of documents
	 * @returns Created collection
	 */
	async createCapped(size: number, max?: number): Promise<Collection> {
		const db = await ensureConnection();
		return db.createCollection(this.collectionName, { capped: true, size, max });
	}

	/**
	 * Converts collection to capped
	 * @param size - Maximum size in bytes
	 * @param max - Maximum number of documents
	 * @returns Command result
	 */
	async convertToCapped(size: number, max?: number): Promise<Document> {
		const db = await ensureConnection();
		return db.command({ convertToCapped: this.collectionName, size, max });
	}

	/**
	 * Gets capped collection size information
	 * @returns Size information
	 */
	async getCappedSize(): Promise<{ size: number; maxSize: number; count: number; max: number }> {
		const stats = await this.stats();
		return { size: stats.size, maxSize: stats.maxSize, count: stats.count, max: stats.max };
	}

	/**
	 * Validates collection structure and indexes
	 * @param full - Whether to do full validation
	 * @returns Validation result
	 */
	async validate(full = false): Promise<Document> {
		const db = await ensureConnection();
		return db.command({ validate: this.collectionName, full });
	}

	/**
	 * Compacts collection to reclaim disk space
	 * @returns Compact result
	 */
	async compact(): Promise<Document> {
		const db = await ensureConnection();
		return db.command({ compact: this.collectionName });
	}

	/**
	 * Gets sizes of all indexes
	 * @returns Object with index sizes
	 */
	async getIndexSizes(): Promise<Record<string, number>> {
		const stats = await this.stats();
		return stats.indexSizes || {};
	}

	/**
	 * Rebuilds all indexes
	 * @returns Reindex result
	 */
	async reIndex(): Promise<Document> {
		const db = await ensureConnection();
		return db.command({ reIndex: this.collectionName });
	}

	/**
	 * Gets random sample of documents
	 * @param size - Number of documents to sample
	 * @returns Array of sampled documents
	 */
	async sample(size: number): Promise<T[]> {
		return this.aggregate([{ $sample: { size } }]);
	}

	/**
	 * Counts distinct values for a field
	 * @param field - Field name
	 * @param filter - Query filter
	 * @returns Count of distinct values
	 */
	async distinctCount(field: string, filter?: Filter<T>): Promise<number> {
		const vals = await this.distinct(field as keyof T, filter);
		return vals.length;
	}

	/**
	 * Updates documents in batches using custom function
	 * @param filter - Query filter
	 * @param updateFn - Function to generate update for each document
	 * @param batchSize - Number of documents per batch
	 * @returns Batch update result
	 */
	async batchUpdate(filter: Filter<T>, updateFn: (doc: T) => UpdateFilter<T> | null, batchSize = 100): Promise<BatchUpdateResult> {
		const cursor = await this.findCursor(filter, {});
		let processed = 0, updated = 0;

		while (await cursor.hasNext()) {
			const batch: T[] = [];
			for (let i = 0; i < batchSize && await cursor.hasNext(); i++) {
				const doc = await cursor.next();
				if (doc) batch.push(doc);
			}

			const ops = batch
				.map(doc => {
					const upd = updateFn(doc);
					return !upd ? null : { updateOne: { filter: { _id: doc._id } as Filter<T>, update: upd } };
				})
				.filter((op): op is NonNullable<typeof op> => op !== null);

			if (ops.length) {
				const res = await this.bulkWrite(ops);
				updated += res.modifiedCount;
			}

			processed += batch.length;
		}

		return { processed, updated };
	}

	/**
	 * Clones collection to new name
	 * @param newName - New collection name
	 * @param copyIndexes - Whether to copy indexes
	 * @returns Clone result
	 */
	async clone(newName: string, copyIndexes = true): Promise<CloneResult> {
		const db = await ensureConnection();
		const docs = await this.find({});
		
		if (docs.length) {
			const newCol = db.collection(newName);
			await newCol.insertMany(docs);
		}

		if (copyIndexes) {
			const indexes = await this.listIndexes();
			const newCollection = new ImpulseCollection(newName);
			for (const idx of indexes) {
				if (idx.name !== '_id_') {
					const { key, name, v, ns, ...opts } = idx;
					await newCollection.createIndex(key, opts);
				}
			}
		}

		return { copied: docs.length };
	}
}

/**
 * Creates a new collection instance
 * @param name - Collection name
 * @returns Collection instance
 */
const getCollection = <T extends Document = Document>(name: string): ImpulseCollection<T> => 
	new ImpulseCollection<T>(name);

/**
 * Starts a new client session
 * @returns Client session
 */
export const startSession = async (): Promise<ClientSession> => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client.startSession();
};

/**
 * Executes a function within a transaction
 * @param callback - Function to execute in transaction
 * @param options - Transaction options
 * @returns Result of callback
 */
export const withTransaction = async <T,>(
	callback: (session: ClientSession) => Promise<T>,
	options?: TransactionOptions
): Promise<T> => {
	const session = await startSession();
	try {
		session.startTransaction(options);
		const result = await callback(session);
		await session.commitTransaction();
		return result;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
};

/**
 * Lists all collections in database
 * @param filter - Filter options
 * @returns Array of collection names
 */
export const listCollections = async (filter?: ListCollectionsOptions): Promise<string[]> => {
	const db = await ensureConnection();
	const cols = await db.listCollections(filter).toArray();
	return cols.map(c => c.name);
};

/**
 * Lists all collections with detailed information
 * @param filter - Filter options
 * @returns Array of collection info
 */
export const listCollectionsDetailed = async (filter?: ListCollectionsOptions): Promise<CollectionInfo[]> => {
	const db = await ensureConnection();
	return db.listCollections(filter).toArray();
};

/**
 * Gets database statistics
 * @returns Database stats
 */
export const stats = async (): Promise<Document> => {
	const db = await ensureConnection();
	return db.stats();
};

/**
 * Executes a database command
 * @param cmd - Command document
 * @returns Command result
 */
export const command = async (cmd: Document): Promise<Document> => {
	const db = await ensureConnection();
	return db.command(cmd);
};

/**
 * Creates a new collection
 * @param options - Collection options
 * @returns Created collection
 */
export const createCollection = async (name: string, options?: Document): Promise<Collection> => {
	const db = await ensureConnection();
	return db.createCollection(name, options);
};

/**
 * Drops a collection
 * @param name - Collection name to drop
 * @returns Drop result
 */
export const dropCollection = async (name: string): Promise<boolean> => {
	const db = await ensureConnection();
	return db.dropCollection(name);
};

/**
 * Renames a collection
 * @param oldName - Current collection name
 * @param newName - New collection name
 * @param options - Rename options
 * @returns Renamed collection
 */
export const renameCollection = async (oldName: string, newName: string, options?: RenameOptions): Promise<Collection> => {
	const db = await ensureConnection();
	return db.renameCollection(oldName, newName, options);
};

/**
 * Drops the entire database
 * @returns Drop result
 */
export const dropDatabase = async (): Promise<boolean> => {
	const db = await ensureConnection();
	return db.dropDatabase();
};

/**
 * Gets MongoDB server information
 * @returns Server info
 */
export const serverInfo = async (): Promise<Document> => {
	const db = await ensureConnection();
	return db.admin().serverInfo();
};

/**
 * Gets MongoDB server status
 * @returns Server status
 */
export const serverStatus = async (): Promise<Document> => {
	const db = await ensureConnection();
	return db.admin().serverStatus();
};

/**
 * Lists all databases
 * @returns Database list
 */
export const listDatabases = async (): Promise<{ databases: Array<{ name: string; sizeOnDisk: number; empty: boolean }>; totalSize: number }> => {
	const db = await ensureConnection();
	return db.admin().listDatabases();
};

/**
 * Pings the database
 * @returns Ping result
 */
export const ping = async (): Promise<Document> => {
	const db = await ensureConnection();
	return db.admin().ping();
};

/**
 * Exports multiple collections
 * @param names - Collection names to export
 * @returns Object with collection data
 */
export const exportCollections = async (names: string[]): Promise<Record<string, Document[]>> => {
	const res: Record<string, Document[]> = {};
	for (const name of names) {
		res[name] = await getCollection(name).find({});
	}
	return res;
};

/**
 * Imports data into multiple collections
 * @param data - Object with collection data
 * @param dropExisting - Whether to drop existing collections
 * @returns Object with import counts
 */
export const importCollections = async (data: Record<string, Document[]>, dropExisting = false): Promise<Record<string, number>> => {
	const res: Record<string, number> = {};
	for (const [name, docs] of Object.entries(data)) {
		if (dropExisting) {
			try { await dropCollection(name); } catch {}
		}
		if (docs.length) {
			const result = await getCollection(name).insertMany(docs);
			res[name] = result.insertedCount;
		} else {
			res[name] = 0;
		}
	}
	return res;
};

/**
 * Gets current operations on database
 * @param includeAll - Whether to include all operations
 * @returns Current operations
 */
export const currentOp = async (includeAll = false): Promise<Document> => {
	const db = await ensureConnection();
	return db.admin().command({ currentOp: 1, $all: includeAll });
};

/**
 * Kills a specific operation
 * @param opId - Operation ID to kill
 * @returns Kill result
 */
export const killOp = async (opId: number): Promise<Document> => {
	const db = await ensureConnection();
	return db.admin().command({ killOp: 1, op: opId });
};

/**
 * Gets current profiling level
 * @returns Profiling level
 */
export const getProfilingLevel = async (): Promise<Document> => {
	const db = await ensureConnection();
	return db.command({ profile: -1 });
};

/**
 * Sets profiling level
 * @param level - Profiling level (0=off, 1=slow, 2=all)
 * @param slowMs - Threshold for slow operations in milliseconds
 * @returns Set result
 */
export const setProfilingLevel = async (level: 0 | 1 | 2, slowMs?: number): Promise<Document> => {
	const db = await ensureConnection();
	const opts: Document = { profile: level };
	if (slowMs !== undefined) opts.slowms = slowMs;
	return db.command(opts);
};

/**
 * Gets profiling data
 * @param filter - Query filter for profiling data
 * @returns Profiling data
 */
export const getProfilingData = async (filter?: Filter<Document>): Promise<Document[]> => {
	const db = await ensureConnection();
	return db.collection('system.profile').find(filter || {}).toArray();
};

/**
 * Explains query execution plan
 * @param collectionName - Collection name
 * @param operation - Query operation
 * @returns Execution plan
 */
export const explain = async (collectionName: string, operation: unknown): Promise<Document> => {
	const col = await getCollection(collectionName)['getCollection']();
	return (col as unknown as { explain: () => { find: (op: unknown) => Promise<Document> } }).explain().find(operation);
};

export const ImpulseDB = Object.assign(getCollection, {
	init, close, getDb, getClient, startSession, withTransaction,
	listCollections, listCollectionsDetailed, stats, command, createCollection,
	dropCollection, renameCollection, dropDatabase, serverInfo, serverStatus,
	listDatabases, ping, exportCollections, importCollections, currentOp, killOp,
	getProfilingLevel, setProfilingLevel, getProfilingData, explain, ImpulseCollection,
});

export type { Filter, UpdateFilter, FindOptions, UpdateOptions, DeleteOptions, Document, ClientSession, TransactionOptions, CollectionInfo, AggregateOptions, BulkWriteOptions, CreateIndexesOptions, IndexSpecification };
