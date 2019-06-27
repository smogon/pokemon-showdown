/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as config from '../config/config';
import * as defaults from '../config/config-example';

export function load(conf: AnyObject) {
	conf = Object.assign({}, defaults, conf);
	// config.routes is nested - we need to ensure values are set for its keys as well.
	const routes = conf.routes;
	for (const [key, value] of Object.entries(defaults.routes)) {
		if (!(key in routes)) routes[key] = value;
	}
	return conf;
}

export const Config = load(config);
