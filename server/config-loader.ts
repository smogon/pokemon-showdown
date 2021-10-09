/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as defaults from '../config/config-example';
import type {GroupInfo, EffectiveGroupSymbol} from './user-groups';
import {ProcessManager} from '../lib';

export type ConfigType = typeof defaults & {
	groups: {[symbol: string]: GroupInfo},
	groupsranking: EffectiveGroupSymbol[],
	greatergroupscache: {[combo: string]: GroupSymbol},
	[k: string]: any,
};
/** Map<process flag, config settings for it to turn on> */
const FLAG_PRESETS = new Map([
	['--no-security', ['nothrottle', 'noguestsecurity', 'noipchecks']],
]);

const CONFIG_PATH = require.resolve('../config/config');

export function load(invalidate = false) {
	if (invalidate) delete require.cache[CONFIG_PATH];
	const config = ({...defaults, ...require('../config/config')}) as ConfigType;
	// config.routes is nested - we need to ensure values are set for its keys as well.
	config.routes = {...defaults.routes, ...config.routes};

	// Automatically stop startup if better-sqlite3 isn't installed and SQLite is enabled
	if (config.usesqlite) {
		try {
			require('better-sqlite3');
		} catch {
			throw new Error(`better-sqlite3 is not installed or could not be loaded, but Config.usesqlite is enabled.`);
		}
	}

	for (const [preset, values] of FLAG_PRESETS) {
		if (process.argv.includes(preset)) {
			for (const value of values) config[value] = true;
		}
	}

	cacheGroupData(config);
	return config;
}

export function cacheGroupData(config: ConfigType) {
	if (config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		reportError(
			`You are using a deprecated version of user group specification in config.\n` +
			`Support for this will be removed soon.\n` +
			`Please ensure that you update your config.js to the new format (see config-example.js, line 457).\n`
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

	function isPermission(key: string) {
		return !['symbol', 'id', 'name', 'rank', 'globalGroupInPersonalRoom'].includes(key);
	}
	function cacheGroup(symbol: string, groupData: GroupInfo) {
		if (cachedGroups[symbol] === 'processing') {
			throw new Error(`Cyclic inheritance in group config for symbol "${symbol}"`);
		}
		if (cachedGroups[symbol] === true) return;

		for (const key in groupData) {
			if (isPermission(key)) {
				const jurisdiction = groupData[key as 'jurisdiction'];
				if (typeof jurisdiction === 'string' && jurisdiction.includes('s')) {
					reportError(`Outdated jurisdiction for permission "${key}" of group "${symbol}": 's' is no longer a supported jurisdiction; we now use 'ipself' and 'altsself'`);
					delete groupData[key as 'jurisdiction'];
				}
			}
		}

		if (groupData['inherit']) {
			cachedGroups[symbol] = 'processing';
			const inheritGroup = groups[groupData['inherit']];
			cacheGroup(groupData['inherit'], inheritGroup);
			// Add lower group permissions to higher ranked groups,
			// preserving permissions specifically declared for the higher group.
			for (const key in inheritGroup) {
				if (key in groupData) continue;
				if (!isPermission(key)) continue;
				(groupData as any)[key] = (inheritGroup as any)[key];
			}
			delete groupData['inherit'];
		}
		cachedGroups[symbol] = true;
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

export function checkRipgrepAvailability() {
	if (Config.ripgrepmodlog === undefined) {
		Config.ripgrepmodlog = (async () => {
			try {
				await ProcessManager.exec(['rg', '--version'], {cwd: `${__dirname}/../`});
				await ProcessManager.exec(['tac', '--version'], {cwd: `${__dirname}/../`});
				return true;
			} catch {
				return false;
			}
		})();
	}
	return Config.ripgrepmodlog;
}


function reportError(msg: string) {
	// This module generally loads before Monitor, so we put this in a setImmediate to wait for it to load.
	// Most child processes don't have Monitor.error, but the main process should always have them, and Config
	// errors should always be the same across processes, so this is a neat way to avoid unnecessary logging.
	// @ts-ignore typescript doesn't like us accessing Monitor like this
	setImmediate(() => global.Monitor?.error?.(msg));
}
export const Config = load();
