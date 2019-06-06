type PageTable = import('./chat').PageTable
type ChatCommands = import('./chat').ChatCommands
type ChatFilter = import('./chat').ChatFilter
type NameFilter = import('./chat').NameFilter

declare let Config: {[k: string]: any};

declare let Monitor: typeof import('./monitor');

declare let LoginServer: typeof import('./loginserver').LoginServer;

// type RoomBattle = AnyObject;

declare let Verifier: typeof import('./verifier');
declare let IPTools: typeof import('./ip-tools').IPTools;
declare let Sockets: typeof import('./sockets');
// let TeamValidator: typeof import('../sim/team-validator');
declare let TeamValidatorAsync: typeof import('./team-validator-async');

interface Group {
	symbol: string,
	id: string,
	name: string,

	/** Permission bypass. `true` will give the group every permission, bypassing all other settings. */
	/** Permission bypass. `true` will give the group every permission, bypassing all other settings. */
	root?: boolean,

	/** Group symbol to inherit undefined permissions from. */
	inherit?: string,
	/** List of default allowed targets for targeted permissions like `mute`, `ban`, etc. */
	jurisdiction?: string,
	/** `true` to disallow globally promoting users to this group. */
	roomonly?: boolean,
	globalonly?: boolean,

	console?: boolean,
	lockdown?: boolean,
	hotpatch?: boolean,
	ignorelimits?: boolean,
	promote?: string | boolean,
	makeroom?: boolean,
	editroom?: boolean,
	editprivacy?: boolean,
	ban?: string | boolean,
	mute?: string | boolean,
	lock?: string | boolean,
	receivemutedpms?: boolean,
	forcerename?: boolean,
	ip?: string | boolean,
	alts?: string | boolean,
	modlog?: boolean,
	broadcast?: boolean,
	declare?: boolean,
	announce?: boolean,
	modchat?: boolean,
	modchatall?: boolean,
	potd?: boolean,
	forcewin?: boolean,
	battlemessage?: boolean,
	tournaments?: boolean,
	gamemoderation?: boolean,
	gamemanagement?: boolean,
	minigame?: boolean,
	game?: boolean,

	// Needed for room<rank> settings and to allow for custom settings on other
	// servers.
	[key: string]: string | boolean | undefined
}
