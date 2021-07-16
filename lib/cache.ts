/**
 * Basic implementation of a cache, mostly for use in caching database results.
 * This is explicitly made to be synchronously accessed (to pair with results from asynchronous databases.)
 * @author mia-pi-git
 */

const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

export class Cache<T> {
	readonly cache: {[k: string]: {data: T, lastCache: number}};
	expiryTime: number;
	dataFetcher: (key: string) => T | Promise<T>;
	constructor(fetcher: (key: string) => T | Promise<T>, invalidateTime = CACHE_EXPIRY_TIME) {
		this.cache = {};
		this.expiryTime = invalidateTime;
		this.dataFetcher = fetcher;
	}
	// todo make this only return T
	// <T>roubling it doesn't, since that was the original intent, but for now this will do
	get(key: string) {
		const data = this.cache[key];
		if (!data || Date.now() - data.lastCache > this.expiryTime) {
			void this.update(key);
		}
		if (!this.cache[key]) {
			return;
		}
		// return default or last state
		return this.cache[key].data;
	}
	async update(key: string) {
		const data = await this.dataFetcher(key);
		this.cache[key] = {lastCache: Date.now(), data};
		return this.cache[key];
	}
	set(key: string, data: T) {
		this.cache[key] = {data, lastCache: Date.now()};
	}
	delete(key: string) {
		const data = this.cache[key]?.data;
		delete this.cache[key];
		return data as T | undefined;
	}
}
