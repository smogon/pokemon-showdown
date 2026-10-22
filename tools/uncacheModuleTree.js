'use strict';

/**
 * @param {string} resolvedModuleIdOrPath
 * @param {NodeJS.Require} [req=require]
 * @returns {string[]}
 */
function uncacheModuleTree(resolvedModuleIdOrPath, req = require) {
	if (typeof resolvedModuleIdOrPath !== 'string') {
		throw new TypeError('resolvedModuleIdOrPath must be a string (path or resolved id)');
	}
	if (!req || typeof req !== 'function') {
		throw new TypeError('req must be a require-like function');
	}

	let resolvedId = resolvedModuleIdOrPath;
	try {
		const resolver = typeof req.resolve === 'function' ? req.resolve.bind(req) : require.resolve;
		resolvedId = resolver(resolvedModuleIdOrPath);
	} catch (err) {
		if (typeof console !== 'undefined' && console.debug) {
			console.debug(`uncacheModuleTree: resolution failed for ${resolvedModuleIdOrPath}: ${err && err.message}`);
		}
	}

	if (!req.cache) return [];

	const toVisit = [resolvedId];
	const collected = new Set();

	while (toVisit.length) {
		const id = toVisit.pop();
		if (!id || collected.has(id)) continue;
		collected.add(id);

		const cached = req.cache[id];
		if (!cached) continue;

		const children = Array.isArray(cached.children) ? cached.children.slice() : [];
		for (const child of children) {
			if (child && child.id) toVisit.push(child.id);
		}
	}

	if (collected.size === 0) return [];

	for (const parentId in req.cache) {
		if (!Object.hasOwn(req.cache, parentId)) continue;
		const parent = req.cache[parentId];
		if (!parent || !Array.isArray(parent.children)) continue;
		const filtered = parent.children.filter(c => !(c && collected.has(c.id)));
		if (filtered.length !== parent.children.length) {
			parent.children = filtered;
		}
	}

	const removed = [];
	for (const id of collected) {
		if (Object.hasOwn(req.cache, id)) {
			try {
				delete req.cache[id];
				removed.push(id);
			} catch (err) {
				if (typeof console !== 'undefined' && console.debug) {
					console.debug(`uncacheModuleTree: failed to delete cache for ${id}: ${err && err.message}`);
				}
			}
		}
	}

	return removed;
}

module.exports = uncacheModuleTree;
