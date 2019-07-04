/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as defaults from '../config/config-example';

const CONFIG_PATH = require.resolve('../config/config');

export function load(invalidate: boolean = false) {
	if (invalidate) delete require.cache[CONFIG_PATH];
	const config = Object.assign({}, defaults, require('../config/config'));
	// config.routes is nested - we need to ensure values are set for its keys as well.
	const routes = config.routes;
	for (const [key, value] of Object.entries(defaults.routes)) {
		if (!(key in routes)) routes[key] = value;
	}
	return config;
}

export const Config = load();
