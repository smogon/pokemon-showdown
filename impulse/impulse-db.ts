/**
 * Impulse-DB: MongoDB Integration Layer
 * MongoDB Atlas M0 (Free) Limitations (for reference):
 * - 512 MB storage, 100 max connections (maxPoolSize: 10)
 * - Aggregation timeout: 60s, Sort memory: 100MB (no allowDiskUse)
 * - No collection rename, JavaScript operations (mapReduce, $where)
 * - Cannot access 'local'/'config' databases
 *
 * @license MIT
 * @author PrinceSky-Git
 */

import { MongoClient, type Db, type Collection, type Document, type Filter, type UpdateFilter, type OptionalId, type FindOptions, type UpdateOptions, type DeleteOptions, type InsertOneOptions, type BulkWriteOptions, type AggregateOptions, type CountDocumentsOptions, type CreateIndexesOptions, type IndexSpecification, type MongoClientOptions, type ClientSession, type TransactionOptions, type CollectionInfo, type ListCollectionsOptions, type RenameOptions } from 'mongodb';

interface ImpulseDBConfig { uri: string; dbName: string; options?: MongoClientOptions }
interface GlobalState {
	client: MongoClient | null;
	db: Db | null;
	config: ImpulseDBConfig | null;
	isConnecting: boolean;
	connectionPromise: Promise<void> | null;
	lastConnectionCheck: number;
}

declare const global: { __impulseDBState?: GlobalState, Config?: unknown };

// Time in milliseconds between connection health checks (24 hours)
// This reduces the overhead of pinging MongoDB on every single operation
// The MongoDB driver handles connection pooling and reconnection automatically
const CONNECTION_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

if (!global.__impulseDBState) {
	global.__impulseDBState = {
		client: null,
		db: null,
		config: null,
		isConnecting: false,
		connectionPromise: null,
		lastConnectionCheck: 0,
	};
}

const state = global.__impulseDBState;

export const init = async (config: ImpulseDBConfig): Promise<void> => {
	if (state.client && state.db) throw new Error('ImpulseDB already initialized');

	const opts: MongoClientOptions = config.options || {
		maxPoolSize: 500, minPoolSize: 5, maxIdleTimeMS: 60000,
		serverSelectionTimeoutMS: 10000, connectTimeoutMS: 20000,
	};

	state.config = config;
	state.client = new MongoClient(config.uri, opts);
	await state.client.connect();
	state.db = state.client.db(config.dbName);
};

const ensureConnection = async (): Promise<Db> => {
	if (!state.db || !state.client) throw new Error('ImpulseDB not initialized. Call ImpulseDB.init()');

	const now = Date.now();
	// Only perform connection health check if enough time has passed since last check
	// This dramatically reduces overhead when performing many operations in succession
	if (now - state.lastConnectionCheck > CONNECTION_CHECK_INTERVAL_MS) {
		try {
			await state.client.db('admin').command({ ping: 1 });
			// eslint-disable-next-line require-atomic-updates
			state.lastConnectionCheck = now;
		} catch {
			// eslint-disable-next-line require-atomic-updates
			state.lastConnectionCheck = 0; // Reset to force check on next operation
			if (state.config) await init(state.config);
			else throw new Error('Connection lost and no config for reconnection');
		}
	}

	return state.db;
};

export const close = async (): Promise<void> => {
	if (state.client) {
		await state.client.close();
		state.client = null;
		state.db = null;
		state.config = null;
	}
};

export const getDb = async (): Promise<Db> => ensureConnection();
export const getClient = async (): Promise<MongoClient> => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client;
};

interface PaginatedResult<T> { docs: T[]; total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean }
interface BatchUpdateResult { processed: number; updated: number }
interface CloneResult { copied: number }

export class ImpulseCollection<T extends Document = Document> {
	collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	private async getCollection(): Promise<Collection<T>> {
		return (await ensureConnection()).collection<T>(this.collectionName);
	}

	async insertOne(doc: OptionalId<T>, options?: InsertOneOptions): Promise<ReturnType<Collection<T>['insertOne']>> {
		return (await this.getCollection()).insertOne(doc, options);
	}

	async insertMany(docs: OptionalId<T>[], options?: BulkWriteOptions): Promise<ReturnType<Collection<T>['insertMany']>> {
		return (await this.getCollection()).insertMany(docs, options);
	}

	async findOne(filter: Filter<T>, options?: FindOptions): Promise<T | null> {
		return (await this.getCollection()).findOne(filter, options);
	}

	async find(filter: Filter<T>, options?: FindOptions): Promise<T[]> {
		return (await this.getCollection()).find(filter, options).toArray();
	}

	findCursor(filter: Filter<T>, options?: FindOptions): Promise<ReturnType<Collection<T>['find']>> {
		return this.getCollection().then(col => col.find(filter, options));
	}

	async updateOne(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<ReturnType<Collection<T>['updateOne']>> {
		return (await this.getCollection()).updateOne(filter, update, options);
	}

	async updateMany(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions): Promise<ReturnType<Collection<T>['updateMany']>> {
		return (await this.getCollection()).updateMany(filter, update, options);
	}

	async replaceOne(filter: Filter<T>, replacement: T, options?: UpdateOptions): Promise<ReturnType<Collection<T>['replaceOne']>> {
		return (await this.getCollection()).replaceOne(filter, replacement, options);
	}

	async deleteOne(filter: Filter<T>, options?: DeleteOptions): Promise<ReturnType<Collection<T>['deleteOne']>> {
		return (await this.getCollection()).deleteOne(filter, options);
	}

	async deleteMany(filter: Filter<T>, options?: DeleteOptions): Promise<ReturnType<Collection<T>['deleteMany']>> {
		return (await this.getCollection()).deleteMany(filter, options);
	}

	async countDocuments(filter: Filter<T> = {}, options?: CountDocumentsOptions): Promise<number> {
		return (await this.getCollection()).countDocuments(filter, options);
	}

	async estimatedDocumentCount(): Promise<number> {
		return (await this.getCollection()).estimatedDocumentCount();
	}

	async exists(filter: Filter<T>): Promise<boolean> {
		return (await this.countDocuments(filter, { limit: 1 })) > 0;
	}

	async aggregate<R = unknown>(pipeline: Document[], options?: AggregateOptions): Promise<R[]> {
		return (await this.getCollection()).aggregate<R>(pipeline, options).toArray();
	}

	aggregateCursor<R = unknown>(pipeline: Document[], options?: AggregateOptions): Promise<ReturnType<Collection<T>['aggregate']>> {
		return this.getCollection().then(col => col.aggregate<R>(pipeline, options));
	}

	async createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string> {
		return (await this.getCollection()).createIndex(indexSpec, options);
	}

	async createIndexes(indexSpecs: IndexSpecification[], options?: CreateIndexesOptions): Promise<string[]> {
		return (await this.getCollection()).createIndexes(indexSpecs, options);
	}

	async dropIndex(indexName: string): Promise<Document> {
		return (await this.getCollection()).dropIndex(indexName);
	}

	async dropIndexes(): Promise<Document> {
		return (await this.getCollection()).dropIndexes();
	}

	async listIndexes(): Promise<Document[]> {
		return (await this.getCollection()).listIndexes().toArray();
	}

	async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOptions & UpdateOptions): Promise<ReturnType<Collection<T>['findOneAndUpdate']>> {
		return (await this.getCollection()).findOneAndUpdate(filter, update, options);
	}

	async findOneAndReplace(filter: Filter<T>, replacement: T, options?: FindOptions & UpdateOptions): Promise<ReturnType<Collection<T>['findOneAndReplace']>> {
		return (await this.getCollection()).findOneAndReplace(filter, replacement, options);
	}

	async findOneAndDelete(filter: Filter<T>, options?: FindOptions & DeleteOptions): Promise<ReturnType<Collection<T>['findOneAndDelete']>> {
		return (await this.getCollection()).findOneAndDelete(filter, options);
	}

	async distinct<K extends keyof T>(key: K, filter?: Filter<T>): Promise<T[K][]> {
		return (await this.getCollection()).distinct(key as string, filter || {}) as Promise<T[K][]>;
	}

	async bulkWrite(operations: unknown[], options?: BulkWriteOptions): Promise<ReturnType<Collection<T>['bulkWrite']>> {
		return (await this.getCollection()).bulkWrite(operations as Parameters<Collection<T>['bulkWrite']>[0], options);
	}

	async drop(): Promise<boolean> {
		return (await this.getCollection()).drop();
	}

	async watch(pipeline: Document[] = [], options: unknown = {}): Promise<ReturnType<Collection<T>['watch']>> {
		return (await this.getCollection()).watch(pipeline, options);
	}

	async createTextIndex(fields: Document, options?: CreateIndexesOptions): Promise<string> {
		return (await this.getCollection()).createIndex(fields, options);
	}

	async stats(): Promise<Document> {
		return (await ensureConnection()).command({ collStats: this.collectionName });
	}

	async info(): Promise<Document | null> {
		const cols = await (await ensureConnection()).listCollections({ name: this.collectionName }).toArray();
		return cols[0] || null;
	}

	async collectionExists(): Promise<boolean> {
		return (await this.info()) !== null;
	}

	async findPaginated(filter: Filter<T>, options: { page?: number, limit?: number, sort?: unknown } = {}): Promise<PaginatedResult<T>> {
		const page = options.page || 1;
		const limit = options.limit || 20;
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.find(filter, { ...options, skip, limit }),
			this.countDocuments(filter),
		]);

		return {
			docs, total, page, limit,
			totalPages: Math.ceil(total / limit),
			hasNext: page * limit < total,
			hasPrev: page > 1,
		};
	}

	async upsert(filter: Filter<T>, update: UpdateFilter<T> | T): Promise<ReturnType<Collection<T>['updateOne']>> {
		const hasOps = Object.keys(update).some(k => k.startsWith('$'));
		return hasOps ?
			this.updateOne(filter, update as UpdateFilter<T>, { upsert: true }) :
			this.replaceOne(filter, update as T, { upsert: true });
	}

	async increment(filter: Filter<T>, field: string, amount = 1): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $inc: { [field]: amount } } as UpdateFilter<T>);
	}

	async push(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $push: { [field]: value } } as UpdateFilter<T>);
	}

	async pull(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $pull: { [field]: value } } as UpdateFilter<T>);
	}

	async addToSet(filter: Filter<T>, field: string, value: unknown): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $addToSet: { [field]: value } } as UpdateFilter<T>);
	}

	async pop(filter: Filter<T>, field: string, position: 1 | -1 = 1): Promise<ReturnType<Collection<T>['updateOne']>> {
		return this.updateOne(filter, { $pop: { [field]: position } } as UpdateFilter<T>);
	}

	async rename(newName: string, options?: RenameOptions): Promise<Collection<T>> {
		return (await this.getCollection()).rename(newName, options);
	}

	async createGeoIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions): Promise<string> {
		return (await this.getCollection()).createIndex(indexSpec, options);
	}

	async findNear(field: string, coords: [number, number], maxDistance?: number, options?: FindOptions): Promise<T[]> {
		const query: Document = { [field]: { $near: { $geometry: { type: "Point", coordinates: coords } } } };
		if (maxDistance) query[field].$near.$maxDistance = maxDistance;
		return this.find(query as Filter<T>, options);
	}

	async mapReduce(map: Function | string, reduce: Function | string, options: Document): Promise<Document> {
		return (await ensureConnection()).command({
			mapReduce: this.collectionName,
			map: map.toString(),
			reduce: reduce.toString(),
			...options,
		});
	}

	async findWhere(jsFunction: string | Function, options?: FindOptions): Promise<T[]> {
		const query: Document = { $where: typeof jsFunction === 'function' ? jsFunction.toString() : jsFunction };
		return this.find(query as Filter<T>, options);
	}

	async createCapped(size: number, max?: number): Promise<Collection> {
		return (await ensureConnection()).createCollection(this.collectionName, { capped: true, size, max });
	}

	async convertToCapped(size: number, max?: number): Promise<Document> {
		return (await ensureConnection()).command({ convertToCapped: this.collectionName, size, max });
	}

	async getCappedSize(): Promise<{ size: number, maxSize: number, count: number, max: number }> {
		const stats = await this.stats();
		return { size: stats.size, maxSize: stats.maxSize, count: stats.count, max: stats.max };
	}

	async validate(full = false): Promise<Document> {
		return (await ensureConnection()).command({ validate: this.collectionName, full });
	}

	async compact(): Promise<Document> {
		return (await ensureConnection()).command({ compact: this.collectionName });
	}

	async getIndexSizes(): Promise<Record<string, number>> {
		return (await this.stats()).indexSizes || {};
	}

	async reIndex(): Promise<Document> {
		return (await ensureConnection()).command({ reIndex: this.collectionName });
	}

	async sample(size: number): Promise<T[]> {
		return this.aggregate([{ $sample: { size } }]);
	}

	async distinctCount(field: string, filter?: Filter<T>): Promise<number> {
		return (await this.distinct(field as keyof T, filter)).length;
	}

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

	async clone(newName: string, copyIndexes = true): Promise<CloneResult> {
		const db = await ensureConnection();
		const docs = await this.find({});

		if (docs.length) {
			await db.collection(newName).insertMany(docs);
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

const getCollection = <T extends Document = Document>(name: string): ImpulseCollection<T> =>
	new ImpulseCollection<T>(name);

export const startSession = async (): Promise<ClientSession> => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client.startSession();
};

export const withTransaction = async <T>(
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

export const listCollections = async (filter?: ListCollectionsOptions): Promise<string[]> => {
	return (await (await ensureConnection()).listCollections(filter).toArray()).map(c => c.name);
};

export const listCollectionsDetailed = async (filter?: ListCollectionsOptions): Promise<CollectionInfo[]> => {
	return (await ensureConnection()).listCollections(filter).toArray();
};

export const stats = async (): Promise<Document> => (await ensureConnection()).stats();
export const command = async (cmd: Document): Promise<Document> => (await ensureConnection()).command(cmd);
export const createCollection = async (name: string, options?: Document): Promise<Collection> =>
	(await ensureConnection()).createCollection(name, options);
export const dropCollection = async (name: string): Promise<boolean> => (await ensureConnection()).dropCollection(name);
export const renameCollection = async (oldName: string, newName: string, options?: RenameOptions): Promise<Collection> =>
	(await ensureConnection()).renameCollection(oldName, newName, options);
export const dropDatabase = async (): Promise<boolean> => (await ensureConnection()).dropDatabase();
export const serverInfo = async (): Promise<Document> => (await ensureConnection()).admin().serverInfo();
export const serverStatus = async (): Promise<Document> => (await ensureConnection()).admin().serverStatus();
export const listDatabases = async (): Promise<{ databases: { name: string, sizeOnDisk: number, empty: boolean }[], totalSize: number }> =>
	(await ensureConnection()).admin().listDatabases();
export const ping = async (): Promise<Document> => (await ensureConnection()).admin().ping();

export const exportCollections = async (names: string[]): Promise<Record<string, Document[]>> => {
	const res: Record<string, Document[]> = {};
	for (const name of names) res[name] = await getCollection(name).find({});
	return res;
};

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

export const currentOp = async (includeAll = false): Promise<Document> =>
	(await ensureConnection()).admin().command({ currentOp: 1, $all: includeAll });
export const killOp = async (opId: number): Promise<Document> =>
	(await ensureConnection()).admin().command({ killOp: 1, op: opId });
export const getProfilingLevel = async (): Promise<Document> => (await ensureConnection()).command({ profile: -1 });
export const setProfilingLevel = async (level: 0 | 1 | 2, slowMs?: number): Promise<Document> => {
	const opts: Document = { profile: level };
	if (slowMs !== undefined) opts.slowms = slowMs;
	return (await ensureConnection()).command(opts);
};
export const getProfilingData = async (filter?: Filter<Document>): Promise<Document[]> =>
	(await ensureConnection()).collection('system.profile').find(filter || {}).toArray();
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
