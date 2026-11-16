'use strict';

/**
 * Pokémon Showdown Configuation
 *
 * PS! has many configuration settings. Most options are shown here,
 * with their default values. Note some chat plugins may have
 * additional config settings not included in this file.
 *
 * Some settings are modified directly through server processes
 * or are most likely entirely useless for your server, but
 * still referenced in code. They are:
 * - disabledssbsets
 * - disableripgrep
 * - disableroomlogdb
 * - dnsbl
 * - emergency
 * - getpmlog
 * - modloglink
 * - permathread
 * - pmlogbutton
 * - rankList
 * - smogon
 * - smogonauth
 * - standings
 */

// ================================================================================================
// #region SETUP
// ================================================================================================

/**
 * The server address - the address at which Pokemon Showdown should be hosting
 *  This should be kept set to 0.0.0.0 unless you know what you're doing.
 *
 * @type {string}
 */
exports.bindaddress = '0.0.0.0';

/**
 * List of IPs and user IDs with dev console (>> and >>>) access.
 * The console is incredibly powerful because it allows the execution of
 * arbitrary commands on the local computer (as the user running the
 * server). If an account with the console permission were compromised,
 * it could possibly be used to take over the server computer. As such,
 * you should only specify a small range of trusted IPs and users here,
 * or none at all. By default, only localhost can use the dev console.
 * In addition to connecting from a valid IP, a user must *also* have
 * the `console` permission in order to use the dev console.
 * Setting this to an empty array ([]) will disable the dev console.
 *
 * @type {string[]}
 */
exports.consoleaccess = ['127.0.0.1'];

/**
 * login server data - don't forget the http:// and the trailing slash
 *   This is the URL of the user database and ladder mentioned earlier.
 *   There aren't any other official loginservers - only change this
 * 	 if you're hosting your own (not recommended).
 */
exports.loginserver = 'http://play.pokemonshowdown.com/';
exports.loginserverkeyalgo = "RSA-SHA1";
exports.loginserverpublickeyid = 4;
exports.loginserverpublickey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzfWKQXg2k8c92aiTyN37
dl76iW0aeAighgzeesdar4xZT1A9yzLpj2DgR8F8rh4R32/EVOPmX7DCf0bYWeh3
QttP0HVKKKfsncJZ9DdNtKj1vWdUTklH8oeoIZKs54dwWgnEFKzb9gxqu+z+FJoQ
vPnvfjCRUPA84O4kqKSuZT2qiWMFMWNQPXl87v+8Atb+br/WXvZRyiLqIFSG+ySn
Nwx6V1C8CA1lYqcPcTfmQs+2b4SzUa8Qwkr9c1tZnXlWIWj8dVvdYtlo0sZZBfAm
X71Rsp2vwEleSFKV69jj+IzAfNHRRw+SADe3z6xONtrJOrp+uC/qnLNuuCfuOAgL
dnUVFLX2aGH0Wb7ZkriVvarRd+3otV33A8ilNPIoPb8XyFylImYEnoviIQuv+0VW
RMmQlQ6RMZNr6sf9pYMDhh2UjU11++8aUxBaso8zeSXC9hhp7mAa7OTxts1t3X57
72LqtHHEzxoyLj/QDJAsIfDmUNAq0hpkiRaXb96wTh3IyfI/Lqh+XmyJuo+S5GSs
RhlSYTL4lXnj/eOa23yaqxRihS2MT9EZ7jNd3WVWlWgExIS2kVyZhL48VA6rXDqr
Ko0LaPAMhcfETxlFQFutoWBRcH415A/EMXJa4FqYa9oeXWABNtKkUW0zrQ194btg
Y929lRybWEiKUr+4Yw2O1W0CAwEAAQ==
-----END PUBLIC KEY-----
`;
/**
 * REGISTERED SERVERS ONLY: You can interact
 *  with the loginserver using your serverid and
 *  servertoken. This enables actions like uploading
 *  replays.
 *
 * @type {string | number}
 */
exports.serverid = '';
/** @type {string | number} */
exports.servertoken = '';

/**
 * The server port - the port to run Pokemon Showdown under
 *
 * @type {number}
 */
exports.port = 8000;

/**
 * repl - whether repl sockets are enabled or not
 * replsocketprefix - the prefix for the repl sockets to be listening on
 * replsocketmode - the file mode bits to use for the repl sockets
 */
exports.repl = true;
exports.replsocketprefix = './logs/repl/';
exports.replsocketmode = 0o600;

/**
 * routes - where Pokemon Showdown is hosted.
 *   There aren't any other options, unless you're
 *   hosting your own routes.
 */
exports.routes = {
	root: 'pokemonshowdown.com',
	client: 'play.pokemonshowdown.com',
	dex: 'dex.pokemonshowdown.com',
	replays: 'replay.pokemonshowdown.com',
};

// subprocesses - the number of child processes to use for various tasks.
//   Can be set to `0` instead of `{...}` to stop using subprocesses, if you're running out of RAM.
exports.subprocesses = {
	/**
	 * network - the number of networking child processes to spawn
	 *   This should be no greater than the number of threads available on your
	 *   server's CPU. If you're not sure how many you have, you can check from a
	 *   terminal by running:
	 *
	 *   $ node -e "console.log(require('os').cpus().length)"
	 *
	 *   Using more workers than there are available threads will cause performance
	 *   issues. Keeping a couple threads available for use for OS-related work and
	 *   other PS processes will likely give you the best performance, if your
	 *   server's CPU is capable of multithreading. If you don't know what any of
	 *   this means or you are unfamiliar with PS' networking code, leave this set
	 *   to 1.
	 */
	network: 1,
	/**
	 * for simulating battles
	 *   You should leave this at 1 unless your server has a very large
	 *   amount of traffic (i.e. hundreds of concurrent battles).
	 */
	simulator: 1,

	// beyond this point, you likely don't need more than one of each of these

	/** for validating teams */
	validator: 1,
	/** for user authentication */
	verifier: 1,
	/** these won't affect anything without a Perspective API key */
	localartemis: 1,
	remoteartemis: 1,
	/** chat processes */
	friends: 1,
	chatdb: 1,
	modlog: 1,
	pm: 1,
	/** for the battlesearch chat plugin */
	battlesearch: 1,
	/** datasearch - for the datasearch chat plugin */
	datasearch: 1,
};

/**
 * Whether to watch the config file for changes. If this is enabled,
 * then the config.js file will be reloaded when it is changed.
 * This can be used to change some settings using a text editor on
 * the server.
 */
exports.watchconfig = true;

// #endregion
// ================================================================================================
// #region ADVANCED
// ================================================================================================

/**
 * lazysockets - disables eager initialization of network services
 *  Turn this on if you'd prefer to manually connect Showdown to the network,
 *  or you intend to run it offline.
 *
 * @type {boolean}
 */
exports.lazysockets = false;

/**
 * legalhosts - Only allow certain loginserver assertions.
 *  Only use this if you want to reject certain client hosts
 *  from user renames.
 *
 * @type {string[]}
 */
exports.legalhosts = [];

/**
 * logsdir - The directory to store log files in. Defaults to '/logs/'.
 *
 * @type {string | null}
 */
exports.logsdir = null;

/**
 * privatecodepath - A link to a GitHub repository,
 *  used when rebuilding private code in /updateserver.
 *
 * @type {string}
*/
exports.privatecodepath = '';

/**
 * proxyip - proxy IPs with trusted X-Forwarded-For headers
 *   This can be either false (meaning not to trust any proxies) or an array
 *   of strings. Each string should be either an IP address or a subnet given
 *   in CIDR notation. You should usually leave this as `false` unless you
 *   know what you are doing.
 *
 * @type {false | string[]}
 */
exports.proxyip = false;

/**
 * punishgroups - The list of groups of type punishment. Use
 *  them in grouplist, by defining a punishgroup.
 *
 * @type {{ [k: string]: { name: string, id: ID | string, symbol: GroupSymbol }}}
 */
exports.punishgroups = {
	'locked': { name: 'Locked', id: 'locked', symbol: '\u203d' },
	'muted': { name: 'Muted', id: 'muted', symbol: '!' },
};

/**
 * remoteladder - Use the loginserver to store ladder info.
 *  You must be using a custom loginserver to use this.
 *
 * @type {boolean}
 */
exports.remoteladder = false;

/**
 * ssl - support WSS, allowing you to access through HTTPS
 *  The client requires port 443, so if you use a different port here,
 *  it will need to be forwarded to 443 through iptables rules or
 *  something.
 *
// @example
//	exports.ssl = {
// 		port: 443,
// 		options: {
//			key: './config/ssl/privkey.pem',
//			cert: './config/ssl/fullchain.pem',
//		},
//	};
 *
 *	Main's SSL deploy script from Let's Encrypt looks like:
 *		cp /etc/letsencrypt/live/sim.psim.us/privkey.pem ~user/Pokemon-Showdown/config/ssl/
 *		cp /etc/letsencrypt/live/sim.psim.us/fullchain.pem ~user/Pokemon-Showdown/config/ssl/
 *		chown user:user ~user/Pokemon-Showdown/config/ssl/privkey.pem
 *		chown user:user ~user/Pokemon-Showdown/config/ssl/fullchain.pem
 *
 *
 * @type {{port: number, options: {key: string, cert: string}} | null}
 */
exports.ssl = null;

/**
 * startuphook - function to call when the server is fully initialized and ready
 * to serve requests.
 */
exports.startuphook = function () {};

/**
 * tokenexpiry - The amount of time a login
 *  assertion can hang until it becomes stale.
 *
 * @type {number}
 */
exports.tokenexpiry = 25 * 60 * 60; // 25 minutes

/**
 * wsdeflate - compresses WebSocket messages
 *  Toggles use of the Sec-WebSocket-Extension permessage-deflate extension.
 *  This compresses messages sent and received over a WebSocket connection
 *  using the zlib compression algorithm. As a caveat, message compression
 *  may make messages take longer to procress.
*
 * example:
//	exports.wsdeflate = {
//		level: 5,
//		memLevel: 8,
//		strategy: 0,
//		noContextTakeover: true,
//		requestNoContextTakeover: true,
//		maxWindowBits: 15,
//		requestMaxWindowBits: 15,
//	};
 *
 * @type {AnyObject?}
 */
exports.wsdeflate = null;

// #endregion
// ================================================================================================
// #region BATTLES
// ================================================================================================

/**
 * allowrequestingties - enables the use of `/offerdraw` and `/acceptdraw`
 *
 * @type {boolean}
 */
exports.allowrequestingties = true;

/**
 * autosavereplays - Whether to automatically upload battle
 *  replays. If set to 'private', it will upload all games
 *  as private (has a password). Useful for tournament servers.
 *
 * @type {boolean | 'private'}
 */
exports.autosavereplays = false;

/**
 * forcedpublicprefixes - user ID prefixes which will be forced to battle publicly
 * or without modchat. Battles involving user IDs which begin with one of the prefixes
 * configured here will be unaffected by various battle privacy commands such as /modjoin,
 * /hideroom, /ionext, or /modchat. expireAt will be set to 10 days when set through
 * /usernameprefix or not otherwise specified.
 *
 * @type {Array<{prefix: ID | string, type: 'modchat' | 'privacy', expireAt?: number}>}
 */
exports.forcedprefixes = [];

/**
 * forced timer - force the timer on for all battles
 *   Players will be unable to turn it off.
 *   This setting can also be turned on with the command /forcetimer.
 *
 * @type {boolean}
 */
exports.forcetimer = false;

/**
 * forceregisterelo - unregistered users cannot search for ladder battles
 *  in formats where their ELO is at or above this value.
 *
 * @type {false | number}
 */
exports.forceregisterelo = false;

/**
 * logchallenges - whether to log challenge battles. Useful for tournament servers.
 *
 * @type {boolean}
 */
exports.logchallenges = false;

/**
 * replaysdb - Upload replays through a Postgres database,
 *  instead of the webserver. This should be the database,
 *  not just `true`.
 */
exports.replaysdb = undefined;

/**
 * controls the behavior of the /battlesearch command
 *
 * valid values are:
 *   - true: disables battlesearch entirely
 *   - false: enables the node.js /battlesearch
 * 	   (uses either node fs or ripgrep for searching)
 *   - 'psbattletools': defaults to the psbattletools /battlesearch
 * 	   (uses psbattletools, which must be installed, for searching)
 *
 * @type {boolean | 'psbattletools'}
 */
exports.nobattlesearch = false;

/**
 * Pokemon of the Day - put a pokemon's name here to make it Pokemon of the Day
 *   The PotD will always be in the #2 slot (not #1 so it won't be a lead)
 *   in every Random Battle team.
 *
 * @type {ID}
 */
exports.potd = '';

/**
 * report battles - shows messages like "OU battle started" in chatrooms
 *   This feature can lag larger servers - you should turn this off if
 *   your server is getting more than 160 or so users.
 *
 *  true - Sends to roomid 'Lobby'
 *  false - Disables announcements
 *  string - Send to the one provided roomid
 *  string[] - Send to all provided roomids.
 *
 * @type {boolean | string[] | string}
 */
exports.reportbattles = true;

/**
 * report joins and leaves in battle - shows messages like "<USERNAME> joined" in battle
 *   Set this to false on large tournament servers where battles get a lot of joins and leaves.
 *   Note that the feature of turning this off is deprecated.
 *
 * @type {boolean}
 */
exports.reportbattlejoins = true;

/**
 * tourroom - specify a room to receive tournament announcements.
 * tourannouncements - announcements are only allowed in these rooms
 * tourdefaultplayercap - a set cap of how many players can be in a tournament
 * ratedtours - toggles tournaments being ladder rated (true) or not (false)
 */
exports.tourroom = 'tournaments';
// These should be IDs, but TS types them as strings
/** @type {string[]} */
exports.tourannouncements = [];
/** @type {number} */
exports.tourdefaultplayercap = 0;
/** @type {boolean} */
exports.ratedtours = false;

/**
 * whitelist - prevent users below a certain group from doing things
 *   For the modchat settings, false will allow any user to participate, while a string
 *   with a group symbol will restrict it to that group and above. The string
 *   'autoconfirmed' is also supported for chatmodchat and battlemodchat, to restrict
 *   chat to autoconfirmed users.
 *   This is usually intended to be used as a whitelist feature - set these to '+' and
 *   voice every user you want whitelisted on the server.

/**
  * chat modchat - default minimum group for speaking in chatrooms; changeable with /modchat
  * @type {false | AuthLevel}
 */
exports.chatmodchat = false;
/**
 * battle modchat - default minimum group for speaking in battles; changeable with /modchat
 * @type {false | AuthLevel}
 */
exports.battlemodchat = false;
/**
 * PM modchat - minimum group for sending private messages or challenges to other users
 * @type {false | AuthLevel}
 */
exports.pmmodchat = false;
/**
 * ladder modchat - minimum group for laddering
 * @type {false | GroupSymbol}
 */
exports.restrictedladder = false;

// #endregion
// ================================================================================================
// #region CHAT
// ================================================================================================

/**
 * appealurl - specify a URL containing information on how users can appeal
 * disciplinary actions on your section. You can also leave this blank, in
 * which case users won't be given any information on how to appeal.
 *
 * @type {string}
 */
exports.appealurl = '';
exports.banappealurl = '';

/**
 * chatlogreader - the search method used for searching chatlogs.
 * @type {'ripgrep' | 'fs'}
 */
exports.chatlogreader = 'fs';

/**
 * basic name filter - removes characters used for impersonation
 *   The basic name filter removes Unicode characters that can be used for impersonation,
 *   like the upside-down exclamation mark (looks like an i), the Greek omicron (looks
 *   like an o), etc. Disable only if you need one of the alphabets it disables, such as
 *   Greek or Cyrillic.
 *
 * @type {boolean}
 */
exports.disablebasicnamefilter = false;

/**
 * logchat - whether to log chat rooms.
 *  Setting disableroomlogdb will disable this function,
 *  regardless of logchat being true or false.
 *
 * @type {boolean}
 */
exports.logchat = false;
exports.disableroomlogdb = false;

/**
 * loguserstats - how often (in milliseconds) to write user stats to the
 * lobby log. This has no effect if `logchat` is disabled.
 *
 * @type {number}
 */
exports.loguserstats = 1000 * 60 * 10; // 10 minutes

/**
 * notify staff when users have a certain amount of room punishments.
 *   Setting this to a number greater than zero will notify staff for everyone with
 *   the required amount of room punishments.
 *   Set this to 0 to turn the monitor off.
 *
 * @type {number}
 */
exports.monitorminpunishments = 3;

/**
 * Removes all ip-based alt checking.
 *
 * @type {boolean}
 */
exports.noipchecks = false;

/**
 * Turns off all time-based throttles - rename, challenges, laddering, etc.
 *
 * @type {boolean}
 */
exports.nothrottle = false;

/**
 * allow punishmentmonitor to lock users with multiple roombans.
 *	 When set to `true`, this feature will automatically lock any users with three or more
 *	 active roombans, and notify the staff room.
 *   Note that this requires punishmentmonitor to be enabled, and therefore requires the `monitorminpunishments`
 *   option to be set to a number greater than zero. If `monitorminpunishments` is set to a value greater than 3,
 *   the autolock will only apply to people who pass this threshold.
 *
 * @type {boolean}
 */
exports.punishmentautolock = false;

/**
 * report joins and leaves - shows messages like "<USERNAME> joined"
 *   Join and leave messages are small and consolidated, so there will never
 *   be more than one line of messages.
 *   If this setting is set to `true`, it will override the client-side
 *   /hidejoins configuration for users.
 *   This feature can lag larger servers - turn this off if your server is
 *   getting more than 80 or so users.
 */
exports.reportjoins = true;

/**
 * report joins and leaves periodically - sends silent join and leave messages in batches
 *   This setting will only be effective if `reportjoins` is set to false, and users will
 *   only be able to see the messages if they have the /showjoins client-side setting enabled.
 *   Set this to a positive amount of milliseconds if you want to enable this feature.
 */
exports.reportjoinsperiod = 0;

/**
 * restrict sending links to autoconfirmed users only.
 *   If this is set to `true`, only autoconfirmed users can send links to either chatrooms or other users, except for staff members.
 *   This option can be used if your server has trouble with spammers mass PMing links to users, or trolls sending malicious links.
 *
 * @type {boolean}
 */
exports.restrictlinks = false;

/**
 * youtubekey - the API key to let users use YouTube commands from The Studio's
 * chat plugin and !show.
 */
exports.youtubekey = '';

// #endregion
// ================================================================================================
// #region CHAT PLUGINS
// ================================================================================================

/**
 * lastfmkey - [thestudio] the API key to let users use the last.fm commands from The Studio's
 * chat plugin.
 */
exports.lastfmkey = '';

/**
 * github - [github] a webhook response key for GitHub actions
 *
 * @example https://github.com/nlf/node-github-hook#readme
 * @type {any}
 */
exports.github = [];

/**
 * nonetrequests - Disables net requests and probes.
 *
 * @type {boolean}
 */
exports.nonetrequests = false;

/**
 * perspectivekey - [artemis] the API key to use Google's remote Perspective API for auto-moderation.
 */
exports.perspectivekey = '';

/**
 * ripgrepmodlog - [modlog] Whether to use ripgrep for searching battle and chat logs
 * in helptickets. If this is set to null, it will check ripgrep's installation.
 *
 * @type {any}
 */
exports.ripgrepmodlog = null;

/**
 * staffrepos - [github] The list of GitHub repositories
 * to monitor for activity in the Staff room. Does nothing
 * if there is not a room with id `staff`.
 *
 * @type {string[]}
 */
exports.staffrepos = [];

/**
 * Postgres usage options. The teams database and battle saving
 * cannot be used without Postgres enabled.
 *
 * Postgres teams supports AuthLevel to require a global auth
 * level to use the database.
 *
 * @type {AnyObject?}
 */
exports.usepostgres = null;
/** @type {any} */
exports.usepostgresteams = null;

/**
 * SQLite usage options. The modlog and friends list cannot be used
 * without SQLite enabled.
 *
 * SQLite PMs supports AuthLevel or 'friends', to restrict the level
 * required to send offlinepms.
 *
 * @type {true | null}
 */
exports.usesqlite = null;
/** @type {AuthLevel | null} */
exports.usesqlitefriends = null;
/** @type {true | null} */
exports.usesqlitemodlog = null;
/** @type {any} */
exports.usesqlitepms = null;

// #endregion
// ================================================================================================
// #region DEBUG
// ================================================================================================

/**
 * backdoor - allows Pokemon Showdown system operators to provide technical
 *            support for your server
 *   This backdoor gives system operators (such as Zarel) console admin
 *   access to your server, which allow them to provide tech support. This
 *   can be useful in a variety of situations: if an attacker attacks your
 *   server and you are not online, if you need help setting up your server,
 *   etc. If you do not trust Pokemon Showdown with admin access, you should
 *   disable this feature.
 */
exports.backdoor = true;

/**
 * crash guard - write errors to log file instead of crashing
 *   This is normally not recommended - if Node wants to crash, the
 *   server needs to be restarted
 *   However, most people want the server to stay online even if there is a
 *   crash, so this option is provided
 *
 * @type {boolean}
 */
exports.crashguard = true;

/**
 * crashguardemail - if the server has been running for more than an hour
 *   and crashes, send an email using these settings, rather than locking down
 *   the server. Uncomment this definition if you want to use this feature;
 *   otherwise, all crashes will lock down the server. If you wish to enable
 *   this setting, you will need to install nodemailer, as it is not installed
 *   by default:
 *     $ npm install nodemailer
 *
// @example
// 	exports.crashguardemail = {
//		options: {
//			host: 'mail.example.com',
//			port: 465,
//			secure: true,
//			auth: {
//				user: 'example@domain.com',
//				pass: 'password'
///			}
//		},
//		from: 'crashlogger@example.com',
//		to: 'admin@example.com',
//		subject: 'Pokemon Showdown has crashed!'
// 	};
 *
 * @type {AnyObject?}
 */
exports.crashguardemail = null;

/**
 * loglevel - Writes certain errors to stdout (Monitor).
 *
 * 0 = everything
 * 1 = debug (same as 0 for now)
 * 2 = notice (default)
 * 3 = warning
 * 4 = Same as 5 - it doesn't map to anything yet
 * 5 = Completely silent, but for now a lot of PS output doesn't respect loglevel
 *
 * @type {number}
 */
exports.loglevel = 2;

/**
 * noguestsecurity - purely for development servers: allows logging in without
 * a signed token: simply send `/trn [USERNAME]`. This allows using PS without
 * a login server.
 *
 * Logging in this way will make you considered an unregistered user and grant
 * no authority. You cannot log into a trusted (g+/r%) user account this way.
 *
 * @type {boolean}
 */
exports.noguestsecurity = false;

/**
 * disablehotpatchall - disables `/hotpatch all`. Generally speaking, there's a
 * pretty big need for /hotpatch all - convenience. The only advantage any hotpatch
 * forms other than all is lower RAM use (which is only a problem for Main because
 * Main is huge), and to do pinpoint hotpatching (like /nohotpatch).
 */
exports.disablehotpatchall = false;

/**
 * nofswriting - Disables writing system output to log files.
 *  This prevents updating chatrooms, log systems, and more.
*/
exports.nofswriting = false;

/**
 * Various debug options
 *
 * ofe[something]
 * ============================================================================
 *
 * Write heapdumps if that processs run out of memory.
 *
 * If you wish to enable this, you will need to install node-oom-heapdump:
 *
 *     $ npm install --no-save node-oom-heapdump
 *
 * We don't install it by default because it's super flaky and frequently
 * crashes the installation process.
 *
 * You might also want to signal processes to put them in debug mode, for
 * access to on-demand heapdumps.
 *
 *     kill -s SIGUSR1 [pid]
 *
 * debug[something]processes
 * ============================================================================
 *
 * Attach a `debug` property to `ProcessWrapper`, allowing you to see the last
 * message it received before it hit an infinite loop.
 *
 * For example:
 *
 *     >> ProcessManager.processManagers[4].processes[0].debug
 *     << "{"tar":"spe=60,all,!lc,!nfe","cmd":"dexsearch","canAll":true,"message":"/ds spe=60,all,!lc,!nfe"}"
 */
exports.ofemain = false;
exports.ofesockets = false;
exports.debugsimprocesses = true;
exports.debugvalidatorprocesses = true;
exports.debugdexsearchprocesses = true;

// #endregion
// ================================================================================================
// #region OTHER
// ================================================================================================

/**
 * autolockdown - whether or not to automatically kill the server when it is
 * in lockdown mode and the final battle finishes. This is potentially useful
 * to prevent forgetting to restart after a lockdown where battles are finished.
 *
 * @type {boolean}
 */
exports.autolockdown = true;

/**
 * inactiveuserthreshold - how long a user must be inactive before being pruned
 * from the `users` array. The default is 1 hour.
 */
exports.inactiveuserthreshold = 1000 * 60 * 60;

// #endregion
// #region USER GROUPS
// ================================================================================================

/**
 * permissions and groups:
 *   Each entry in `grouplist` is a separate group. Some of the members are "special"
 *     while the rest is just a normal permission.
 *   The order of the groups determines their ranking.
 *   The special members are as follows:
 *     - symbol: Specifies the symbol of the group (as shown in front of the username)
 *     - id: Specifies an id for the group.
 *     - name: Specifies the human-readable name for the group.
 *
 *     - root: If this is true, the group can do anything.
 *
 *     - inherit: The group uses the group specified's permissions if it cannot
 *			find the permission in the current group. Never make the graph
 * 			produced using this member have any cycles, or the server won't run.
 *
 *     - jurisdiction: The default jurisdiction for targeted permissions where one isn't
 * 			explictly specified. "Targeted permissions" are permissions
 * 			that might affect another user, such as `ban' or `promote'.
 * 			's' is a special group where it means the user itself only
 *			and 'u' is another special group where it means all groups
 *			lower in rank than the current group.
 *
 *     - punishgroup: A group that casts over other usergroups and suppresses
 * 						permissions rather than granting them.
 *
 *	   - battleonly: forces the group to be in battle rooms only (Player).
 *     - roomonly: forces the group to be a per-room moderation rank only.
 *     - globalonly: forces the group to be a global rank only.
 *
 *   All the possible permissions are as follows:
 *
 *    Server management:
 *     - console: Developer console (>>).
 *     - disableladder: Enable and disable the ability to use the ladder.
 *     - lockdown: /lockdown and /endlockdown commands.
 *     - gdeclare: /gdeclare commands.
 *     - hotpatch: /hotpatch, /crashfixed and /savelearnsets commands.
 *     - promote: Promoting and demoting globally. Will only work if the target
 *        user's current group and target group are both in jurisdiction.
 *     - potd: Set PotD.
 *
 *    Moderation:
 *     - alts: alt checking
 *     - ban: banning and unbanning in rooms
 *     - forcerename: /fr command
 *     - forcewin: /forcewin command
 *     - globalban: banning and unbanning from the entire server
 *     - ip: IP checking
 *     - kick: kick players from a battle
 *     - lock: locking (ipmute) and unlocking
 *     - modchat: set modchat up to the specified level
 *     - modlog: view the moderator logs
 *     - mute: muting and unmuting
 *     - rangeban: banning/unbanning IP ranges
 *     - receivemutedpms: receive PMs from muted users.
 *
 *    Room management:
 *     - editroom: Editing properties of rooms
 *     - editprivacy: Set modjoin/privacy (only for battles)
 *     - makeroom: Create/delete chatrooms, and set modjoin/roomdesc/privacy
 *     - room<rank>: /roompromote to <rank> (eg. roomvoice)
 *
 *    Misc
 *     - announce: /announce command.
 *     - broadcast: Show command output to other users.
 *     - bypassafktimer: Won't mark users Idle after inactivity.
 *     - declare: /declare command.
 *     - exportinputlog: /exportinputlog command. Requires all player's permission,
 *        unless the rank also has forcewin, or the battle uses randomized teams.
 *     - game: make games.
 *     - gamemanagement: enable/disable games, minigames, and tournaments.
 *     - gamemoderation: /tour dq, autodq, end etc.
 *     - ignorelimits: Ignore limits such as chat message length.
 *     - minigame: make minigames (hangman, polls, etc.).
 *     - showmedia: Show images and videos to other users.
 *     - tournaments: creating tournaments (/tour new, settype etc.)
 */
exports.grouplist = [
	{
		symbol: '~',
		id: "admin",
		name: "Administrator",
		globalonly: true,
		inherit: '@',
		jurisdiction: 'u',

		promote: '~u',
		roomowner: true,
		roombot: true,
		roommod: true,
		roomdriver: true,

		addhtml: true,
		bypassall: true,
		console: true,
		declare: true,
		disableladder: true,
		editroom: true,
		editprivacy: true,
		exportinputlog: true,
		forcewin: true,
		gamemanagement: true,
		gdeclare: true,
		lockdown: true,
		makeroom: true,
		potd: true,
		rangeban: true,
		tournaments: true,
	},
	{
		symbol: '#',
		id: "owner",
		name: "Room Owner",
		inherit: '@',
		jurisdiction: 'u',
		roomonly: true,

		roommod: true,
		roomdriver: true,
		roombot: true,
		roomprizewinner: true,

		addhtml: true,
		declare: true,
		editroom: true,
		gamemanagement: true,
		tournaments: true,
	},
	{
		symbol: '\u2605',
		id: "host",
		name: "Host",
		inherit: '@',
		jurisdiction: 'u',
		roomonly: true,

		modchat: 'a',
		declare: true,
		forcewin: true,
		gamemanagement: true,
		joinbattle: true,
		tournaments: true,
	},
	{
		symbol: '@',
		id: "mod",
		name: "Moderator",
		inherit: '%',
		jurisdiction: 'u',

		alts: '@u',
		modchat: 'a',
		roomvoice: true,
		roomwhitelist: true,

		ban: true,
		forcerename: true,
		ip: true,
		game: true,
		globalban: true,
	},
	{
		symbol: '%',
		id: "driver",
		name: "Driver",
		inherit: '+',
		jurisdiction: 'u',
		globalGroupInPersonalRoom: '@',

		alts: '%u',
		bypassblocks: 'u%@~',

		announce: true,
		forcerename: true,
		gamemoderation: true,
		joinbattle: true,
		kick: true,
		lock: true,
		minigame: true,
		modchat: true,
		modlog: true,
		mute: true,
		receiveauthmessages: true,
		timer: true,
		warn: true,

		hiderank: true,
	},
	{
		// Bots are ranked below all staff so that Global Bots can be kept out
		// of modjoin % rooms (namely, Staff).
		symbol: '*',
		id: "bot",
		name: "Bot",
		inherit: '%',
		jurisdiction: 'u',

		addhtml: true,
		bypassafktimer: true,
		declare: true,
		tournaments: true,
		gamemanagement: true,

		alts: false,
		forcerename: false,
		globalban: false,
		ip: false,
		lock: false,
	},
	{
		symbol: '\u2606',
		id: "player",
		name: "Player",
		inherit: '+',
		battleonly: true,

		editprivacy: true,
		gamemanagement: true,
		joinbattle: true,
		modchat: true,
		roomvoice: true,
		nooverride: true,
	},
	{
		symbol: '+',
		id: "voice",
		name: "Voice",
		inherit: ' ',

		altsself: true,
		makegroupchat: true,
		joinbattle: true,
		broadcast: true,
		showmedia: true,
		exportinputlog: true,
		importinputlog: true,
	},
	{
		symbol: '^',
		id: "prizewinner",
		name: "Prize Winner",
		roomonly: true,
	},
	{
		symbol: 'whitelist',
		id: "whitelist",
		name: "Whitelist",
		inherit: ' ',
		roomonly: true,
		
		altsself: true,
		broadcast: true,
		exportinputlog: true,
		importinputlog: true,
		showmedia: true,
	},
	{
		symbol: ' ',
		ipself: true,
	},
	{
		name: 'Locked',
		id: 'locked',
		symbol: '\u203d',
		punishgroup: 'LOCK',
	},
	{
		name: 'Muted',
		id: 'muted',
		symbol: '!',
		punishgroup: 'MUTE',
	},
];
