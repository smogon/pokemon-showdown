/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as defaults from '../config/config-example';

const CONFIG_PATH = require.resolve('../config/config');

export function load(invalidate = false) {
	if (invalidate) delete require.cache[CONFIG_PATH];
	const config: Config = Object.assign({}, defaults, require('../config/config'));
	// config.routes is nested - we need to ensure values are set for its keys as well.
	config.routes = Object.assign({}, defaults.routes, config.routes);
	return config;
}

export const Config = load();
