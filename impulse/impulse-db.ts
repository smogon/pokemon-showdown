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

interface ImpulseDBConfig { uri: string; dbName: string; options?: MongoClientOptions; }
interface GlobalState { client: MongoClient | null; db: Db | null; config: ImpulseDBConfig | null; isConnecting: boolean; connectionPromise: Promise<void> | null; }

declare const global: { __impulseDBState?: GlobalState; Config?: any; };

if (!global.__impulseDBState) {
	global.__impulseDBState = { client: null, db: null, config: null, isConnecting: false, connectionPromise: null };
}

const state = global.__impulseDBState;

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

export const close = async () => {
	if (state.client) {
		await state.client.close();
		state.client = null;
		state.db = null;
		state.config = null;
	}
};

export const getDb = async () => ensureConnection();
export const getClient = async () => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client;
};

export class ImpulseCollection<T extends Document = Document> {
	collectionName: string;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	private async getCollection(): Promise<Collection<T>> {
		const db = await ensureConnection();
		return db.collection<T>(this.collectionName);
	}

	async insertOne(doc: OptionalId<T>, options?: InsertOneOptions) {
		const col = await this.getCollection();
		return col.insertOne(doc, options);
	}

	async insertMany(docs: OptionalId<T>[], options?: BulkWriteOptions) {
		const col = await this.getCollection();
		return col.insertMany(docs, options);
	}

	async findOne(filter: Filter<T>, options?: FindOptions) {
		const col = await this.getCollection();
		return col.findOne(filter, options);
	}

	async find(filter: Filter<T>, options?: FindOptions) {
		const col = await this.getCollection();
		return col.find(filter, options).toArray();
	}

	findCursor(filter: Filter<T>, options?: FindOptions) {
		return this.getCollection().then(col => col.find(filter, options));
	}

	async updateOne(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions) {
		const col = await this.getCollection();
		return col.updateOne(filter, update, options);
	}

	async updateMany(filter: Filter<T>, update: UpdateFilter<T>, options?: UpdateOptions) {
		const col = await this.getCollection();
		return col.updateMany(filter, update, options);
	}

	async replaceOne(filter: Filter<T>, replacement: T, options?: UpdateOptions) {
		const col = await this.getCollection();
		return col.replaceOne(filter, replacement, options);
	}

	async deleteOne(filter: Filter<T>, options?: DeleteOptions) {
		const col = await this.getCollection();
		return col.deleteOne(filter, options);
	}

	async deleteMany(filter: Filter<T>, options?: DeleteOptions) {
		const col = await this.getCollection();
		return col.deleteMany(filter, options);
	}

	async countDocuments(filter: Filter<T> = {}, options?: CountDocumentsOptions) {
		const col = await this.getCollection();
		return col.countDocuments(filter, options);
	}

	async estimatedDocumentCount() {
		const col = await this.getCollection();
		return col.estimatedDocumentCount();
	}

	async exists(filter: Filter<T>): Promise<boolean> {
		return (await this.countDocuments(filter, { limit: 1 })) > 0;
	}

	async aggregate<R = any>(pipeline: Document[], options?: AggregateOptions): Promise<R[]> {
		const col = await this.getCollection();
		return col.aggregate<R>(pipeline, options).toArray();
	}

	aggregateCursor<R = any>(pipeline: Document[], options?: AggregateOptions) {
		return this.getCollection().then(col => col.aggregate<R>(pipeline, options));
	}

	async createIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions) {
		const col = await this.getCollection();
		return col.createIndex(indexSpec, options);
	}

	async createIndexes(indexSpecs: IndexSpecification[], options?: CreateIndexesOptions) {
		const col = await this.getCollection();
		return col.createIndexes(indexSpecs, options);
	}

	async dropIndex(indexName: string) {
		const col = await this.getCollection();
		return col.dropIndex(indexName);
	}

	async dropIndexes() {
		const col = await this.getCollection();
		return col.dropIndexes();
	}

	async listIndexes() {
		const col = await this.getCollection();
		return col.listIndexes().toArray();
	}

	async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>, options?: FindOptions & UpdateOptions) {
		const col = await this.getCollection();
		return col.findOneAndUpdate(filter, update, options);
	}

	async findOneAndReplace(filter: Filter<T>, replacement: T, options?: FindOptions & UpdateOptions) {
		const col = await this.getCollection();
		return col.findOneAndReplace(filter, replacement, options);
	}

	async findOneAndDelete(filter: Filter<T>, options?: FindOptions & DeleteOptions) {
		const col = await this.getCollection();
		return col.findOneAndDelete(filter, options);
	}

	async distinct<K extends keyof T>(key: K, filter?: Filter<T>): Promise<T[K][]> {
		const col = await this.getCollection();
		return col.distinct(key as string, filter || {}) as Promise<T[K][]>;
	}

	async bulkWrite(operations: any[], options?: BulkWriteOptions) {
		const col = await this.getCollection();
		return col.bulkWrite(operations, options);
	}

	async drop() {
		const col = await this.getCollection();
		return col.drop();
	}

	async watch(pipeline: Document[] = [], options: any = {}) {
		const col = await this.getCollection();
		return col.watch(pipeline, options);
	}

	async createTextIndex(fields: Document, options?: CreateIndexesOptions) {
		const col = await this.getCollection();
		return col.createIndex(fields, options);
	}

	async stats() {
		const db = await ensureConnection();
		return db.command({ collStats: this.collectionName });
	}

	async info() {
		const db = await ensureConnection();
		const cols = await db.listCollections({ name: this.collectionName }).toArray();
		return cols[0] || null;
	}

	async collectionExists(): Promise<boolean> {
		return (await this.info()) !== null;
	}

	async findPaginated(filter: Filter<T>, options: { page?: number; limit?: number; sort?: any } = {}) {
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

	async upsert(filter: Filter<T>, update: UpdateFilter<T> | T) {
		const hasOps = Object.keys(update).some(k => k.startsWith('$'));
		return hasOps ? 
			this.updateOne(filter, update as UpdateFilter<T>, { upsert: true }) :
			this.replaceOne(filter, update as T, { upsert: true });
	}

	async increment(filter: Filter<T>, field: string, amount = 1) {
		return this.updateOne(filter, { $inc: { [field]: amount } } as any);
	}

	async push(filter: Filter<T>, field: string, value: any) {
		return this.updateOne(filter, { $push: { [field]: value } } as any);
	}

	async pull(filter: Filter<T>, field: string, value: any) {
		return this.updateOne(filter, { $pull: { [field]: value } } as any);
	}

	async addToSet(filter: Filter<T>, field: string, value: any) {
		return this.updateOne(filter, { $addToSet: { [field]: value } } as any);
	}

	async pop(filter: Filter<T>, field: string, position: 1 | -1 = 1) {
		return this.updateOne(filter, { $pop: { [field]: position } } as any);
	}

	async rename(newName: string, options?: RenameOptions) {
		const col = await this.getCollection();
		return col.rename(newName, options);
	}

	async createGeoIndex(indexSpec: IndexSpecification, options?: CreateIndexesOptions) {
		const col = await this.getCollection();
		return col.createIndex(indexSpec, options);
	}

	async findNear(field: string, coords: [number, number], maxDistance?: number, options?: FindOptions) {
		const query: any = {
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

	async mapReduce(map: Function | string, reduce: Function | string, options: Document) {
		const db = await ensureConnection();
		return db.command({
			mapReduce: this.collectionName,
			map: map.toString(),
			reduce: reduce.toString(),
			...options
		});
	}

	async findWhere(jsFunction: string | Function, options?: FindOptions) {
		const query: any = { $where: typeof jsFunction === 'function' ? jsFunction.toString() : jsFunction };
		return this.find(query as Filter<T>, options);
	}

	async createCapped(size: number, max?: number) {
		const db = await ensureConnection();
		return db.createCollection(this.collectionName, { capped: true, size, max });
	}

	async convertToCapped(size: number, max?: number) {
		const db = await ensureConnection();
		return db.command({ convertToCapped: this.collectionName, size, max });
	}

	async getCappedSize() {
		const stats = await this.stats();
		return { size: stats.size, maxSize: stats.maxSize, count: stats.count, max: stats.max };
	}

	async validate(full = false) {
		const db = await ensureConnection();
		return db.command({ validate: this.collectionName, full });
	}

	async compact() {
		const db = await ensureConnection();
		return db.command({ compact: this.collectionName });
	}

	async getIndexSizes() {
		const stats = await this.stats();
		return stats.indexSizes || {};
	}

	async reIndex() {
		const db = await ensureConnection();
		return db.command({ reIndex: this.collectionName });
	}

	async sample(size: number) {
		return this.aggregate([{ $sample: { size } }]);
	}

	async distinctCount(field: string, filter?: Filter<T>): Promise<number> {
		const vals = await this.distinct(field as keyof T, filter);
		return vals.length;
	}

	async batchUpdate(filter: Filter<T>, updateFn: (doc: T) => UpdateFilter<T> | null, batchSize = 100) {
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
				.filter((op): op is any => op !== null);

			if (ops.length) {
				const res = await this.bulkWrite(ops);
				updated += res.modifiedCount;
			}

			processed += batch.length;
		}

		return { processed, updated };
	}

	async clone(newName: string, copyIndexes = true) {
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
					const { key, ...opts } = idx;
					delete opts.name;
					delete opts.v;
					delete opts.ns;
					await newCollection.createIndex(key, opts);
				}
			}
		}

		return { copied: docs.length };
	}
}

const getCollection = <T extends Document = Document>(name: string): ImpulseCollection<T> => 
	new ImpulseCollection<T>(name);

export const startSession = async () => {
	if (!state.client) throw new Error('ImpulseDB not initialized');
	return state.client.startSession();
};

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

export const listCollections = async (filter?: ListCollectionsOptions): Promise<string[]> => {
	const db = await ensureConnection();
	const cols = await db.listCollections(filter).toArray();
	return cols.map(c => c.name);
};

export const listCollectionsDetailed = async (filter?: ListCollectionsOptions): Promise<CollectionInfo[]> => {
	const db = await ensureConnection();
	return db.listCollections(filter).toArray();
};

export const stats = async () => {
	const db = await ensureConnection();
	return db.stats();
};

export const command = async (cmd: Document) => {
	const db = await ensureConnection();
	return db.command(cmd);
};

export const createCollection = async (name: string, options?: Document) => {
	const db = await ensureConnection();
	return db.createCollection(name, options);
};

export const dropCollection = async (name: string) => {
	const db = await ensureConnection();
	return db.dropCollection(name);
};

export const renameCollection = async (oldName: string, newName: string, options?: RenameOptions) => {
	const db = await ensureConnection();
	return db.renameCollection(oldName, newName, options);
};

export const dropDatabase = async () => {
	const db = await ensureConnection();
	return db.dropDatabase();
};

export const serverInfo = async () => {
	const db = await ensureConnection();
	return db.admin().serverInfo();
};

export const serverStatus = async () => {
	const db = await ensureConnection();
	return db.admin().serverStatus();
};

export const listDatabases = async () => {
	const db = await ensureConnection();
	return db.admin().listDatabases();
};

export const ping = async () => {
	const db = await ensureConnection();
	return db.admin().ping();
};

export const exportCollections = async (names: string[]): Promise<Record<string, any[]>> => {
	const res: Record<string, any[]> = {};
	for (const name of names) {
		res[name] = await getCollection(name).find({});
	}
	return res;
};

export const importCollections = async (data: Record<string, any[]>, dropExisting = false) => {
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

export const currentOp = async (includeAll = false) => {
	const db = await ensureConnection();
	return db.admin().command({ currentOp: 1, $all: includeAll });
};

export const killOp = async (opId: number) => {
	const db = await ensureConnection();
	return db.admin().command({ killOp: 1, op: opId });
};

export const getProfilingLevel = async () => {
	const db = await ensureConnection();
	return db.command({ profile: -1 });
};

export const setProfilingLevel = async (level: 0 | 1 | 2, slowMs?: number) => {
	const db = await ensureConnection();
	const opts: any = { profile: level };
	if (slowMs !== undefined) opts.slowms = slowMs;
	return db.command(opts);
};

export const getProfilingData = async (filter?: Filter<Document>) => {
	const db = await ensureConnection();
	return db.collection('system.profile').find(filter || {}).toArray();
};

export const explain = async (collectionName: string, operation: any) => {
	const col = await getCollection(collectionName)['getCollection']();
	return (col as any).explain().find(operation);
};

export const ImpulseDB = Object.assign(getCollection, {
	init, close, getDb, getClient, startSession, withTransaction,
	listCollections, listCollectionsDetailed, stats, command, createCollection,
	dropCollection, renameCollection, dropDatabase, serverInfo, serverStatus,
	listDatabases, ping, exportCollections, importCollections, currentOp, killOp,
	getProfilingLevel, setProfilingLevel, getProfilingData, explain, ImpulseCollection,
});

export type { Filter, UpdateFilter, FindOptions, UpdateOptions, DeleteOptions, Document, ClientSession, TransactionOptions, CollectionInfo, AggregateOptions, BulkWriteOptions, CreateIndexesOptions, IndexSpecification };
