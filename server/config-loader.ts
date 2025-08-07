/**
 * Config loader
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import * as defaults from '../config/config-example';
import type { GroupInfo, EffectiveGroupSymbol } from './user-groups';
import { ProcessManager, FS } from '../lib';

type DefaultConfig = typeof defaults;

type InputConfig = Omit<DefaultConfig, 'subprocesses'> & {
	subprocesses: null | 0 | 1 | SubProcessesConfig,
};

type ProcessType = (
	'localartemis' | 'remoteartemis' | 'battlesearch' | 'datasearch' | 'friends' |
	'chatdb' | 'pm' | 'modlog' | 'network' | 'simulator' | 'validator' | 'verifier'
);

type SubProcessesConfig = Partial<Record<ProcessType, number>>;

export type ConfigType = InputConfig & {
	groups: { [symbol: string]: GroupInfo },
	groupsranking: EffectiveGroupSymbol[],
	greatergroupscache: { [combo: string]: GroupSymbol },
	subprocessescache: SubProcessesConfig,
	[k: string]: any,
};
/** Map<process flag, config settings for it to turn on> */
const FLAG_PRESETS = new Map([
	['--no-security', ['nothrottle', 'noguestsecurity', 'noipchecks']],
]);

const processTypes: ProcessType[] = [
	'localartemis', 'remoteartemis', 'battlesearch', 'datasearch', 'friends',
	'chatdb', 'pm', 'modlog', 'network', 'simulator', 'validator', 'verifier',
];

const CONFIG_PATH = FS('./config/config.js').path;

export function load(invalidate = false) {
	if (invalidate) delete require.cache[CONFIG_PATH];
	const config = ({ ...defaults, ...require(CONFIG_PATH) }) as ConfigType;
	// config.routes is nested - we need to ensure values are set for its keys as well.
	config.routes = { ...defaults.routes, ...config.routes };

	if (!process.send) {
		// Automatically stop startup if optional dependencies are enabled yet missing
		if (config.usesqlite) {
			try {
				require.resolve('better-sqlite3');
			} catch {
				throw new Error(`better-sqlite3 is not installed or could not be loaded, but Config.usesqlite is enabled.`);
			}
		}

		if (config.ofemain) {
			try {
				require.resolve('node-oom-heapdump');
			} catch {
				throw new Error(
					`node-oom-heapdump is not installed, but it is a required dependency if Config.ofemain is set to true! ` +
					`Run npm install node-oom-heapdump and restart the server.`
				);
			}
		}
	}

	for (const [preset, values] of FLAG_PRESETS) {
		if (process.argv.includes(preset)) {
			for (const value of values) config[value] = true;
		}
	}

	cacheSubProcesses(config);
	cacheGroupData(config);
	return config;
}

function cacheSubProcesses(config: ConfigType) {
	if (config.subprocesses !== undefined) {
		// Leniently accept all other falsy values, including `null`.
		const value = config.subprocesses || 0;
		if (value === 0 || value === 1) {
			// https://github.com/microsoft/TypeScript/issues/35745
			config.subprocessescache = (Object.fromEntries(
				processTypes.map(k => [k, value])
			) as Record<ProcessType, number>);
		} else if (typeof value === 'object') {
			config.subprocessescache = value;
		} else {
			reportError(`Invalid \`subprocesses\` specification. Use any of 0, 1, or a plain old object.`);
		}
	}
	config.subprocessescache ??= {};
	const deprecatedKeys = [];
	if ('workers' in config) {
		deprecatedKeys.push('workers');
		config.subprocessescache.network = config.workers;
	}
	for (const processType of processTypes) {
		if (processType === 'network') continue;
		const compatKey = `${processType}processes`;
		if (compatKey in config) {
			deprecatedKeys.push(compatKey);
			config.subprocessescache[processType] = config[compatKey];
		}
	}
	for (const compatKey of deprecatedKeys) {
		reportError(
			`You are using \`${compatKey}\`, which is deprecated\n` +
			`Support for this may be removed.\n` +
			`Please ensure that you update your config.js to use \`subprocesses\` (see config-example.js, line 80).\n`
		);
	}
}

export function cacheGroupData(config: ConfigType) {
	if (config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		reportError(
			`You are using a deprecated version of user group specification in config.\n` +
			`Support for this may be removed.\n` +
			`Please ensure that you update your config.js to the new format (see config-example.js, line 521).\n`
		);
	} else {
		config.punishgroups = Object.create(null);
		config.groups = Object.create(null);
		config.groupsranking = [];
		config.greatergroupscache = Object.create(null);
	}

	const groups = config.groups;
	const punishgroups = config.punishgroups;
	const cachedGroups: { [k: string]: 'processing' | true } = {};

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
		const cwd = FS.ROOT_PATH;
		Config.ripgrepmodlog = (async () => {
			try {
				await ProcessManager.exec(['rg', '--version'], { cwd });
				await ProcessManager.exec(['tac', '--version'], { cwd });
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
	setImmediate(() => global.Monitor?.error?.(`[CONFIG] ${msg}`));
}
export const Config = load();
