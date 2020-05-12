/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as defaults from '../config/config-example';

export interface GroupInfo {
	symbol: GroupSymbol;
	id: ID;
	name: string;
	rank: number;
	inherit?: GroupSymbol;
	jurisdiction?: string;
	globalGroupInPersonalRoom?: GroupSymbol;
	[k: string]: string | true | number | undefined;
}

export type ConfigType = typeof defaults & {
	groups: {[symbol: string]: GroupInfo},
	groupsranking: GroupSymbol[],
	greatergroupscache: {[combo: string]: GroupSymbol},
	[k: string]: any,
};

const CONFIG_PATH = require.resolve('../config/config');

export function load(invalidate = false) {
	if (invalidate) delete require.cache[CONFIG_PATH];
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const config = Object.assign({}, defaults, require('../config/config')) as ConfigType;
	// config.routes is nested - we need to ensure values are set for its keys as well.
	config.routes = Object.assign({}, defaults.routes, config.routes);
	cacheGroupData(config);
	return config;
}

export function cacheGroupData(config: ConfigType) {
	if (config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		console.error(
			`You are using a deprecated version of user group specification in config.\n` +
			`Support for this will be removed soon.\n` +
			`Please ensure that you update your config.js to the new format (see config-example.js, line 220).\n`
		);
	} else {
		config.punishgroups = Object.create(null);
		config.groups = Object.create(null);
		config.groupsranking = [];
		config.greatergroupscache = Object.create(null);
	}

	const groups = config.groups;
	const punishgroups = config.punishgroups;
	const cachedGroups: {[k: string]: 'processing' | true} = {};

	function cacheGroup(sym: string, groupData: GroupInfo) {
		if (cachedGroups[sym] === 'processing') return false; // cyclic inheritance.

		if (cachedGroups[sym] !== true && groupData['inherit']) {
			cachedGroups[sym] = 'processing';
			const inheritGroup = groups[groupData['inherit']];
			if (cacheGroup(groupData['inherit'], inheritGroup)) {
				// Add lower group permissions to higher ranked groups,
				// preserving permissions specifically declared for the higher group.
				for (const key in inheritGroup) {
					if (key in groupData) continue;
					groupData[key] = inheritGroup[key];
				}
			}
			delete groupData['inherit'];
		}
		return (cachedGroups[sym] = true);
	}

	if (config.grouplist) { // Using new groups format.
		const grouplist = config.grouplist as any;
		const numGroups = grouplist.length;
		for (let i = 0; i < numGroups; i++) {
			const groupData = grouplist[i];

			// punish groups
			if (groupData.punishgroup) {
				punishgroups[groupData.id] = groupData;
				continue;
			}

			groupData.rank = numGroups - i - 1;
			groups[groupData.symbol] = groupData;
			config.groupsranking.unshift(groupData.symbol);
		}
	}

	for (const sym in groups) {
		const groupData = groups[sym];
		cacheGroup(sym, groupData);
	}

	// hardcode default punishgroups.
	if (!punishgroups.locked) {
		punishgroups.locked = {
			name: 'Locked',
			id: 'locked',
			symbol: '\u203d',
		};
	}
	if (!punishgroups.muted) {
		punishgroups.muted = {
			name: 'Muted',
			id: 'muted',
			symbol: '!',
		};
	}
}

export const Config = load();
