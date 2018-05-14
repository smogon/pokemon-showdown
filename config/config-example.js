'use strict';

// The server port - the port to run Pokemon Showdown under
exports.port = 8000;

// The server address - the address at which Pokemon Showdown should be hosting
//   This should be kept set to 0.0.0.0 unless you know what you're doing.
exports.bindaddress = '0.0.0.0';

// workers - the number of networking child processes to spawn
//   This should be no greater than the number of threads available on your
//   server's CPU. If you're not sure how many you have, you can check from a
//   terminal by running:
//
//   $ node -e "console.log(require('os').cpus().length)"
//
//   Using more workers than there are available threads will cause performance
//   issues. Keeping a couple threads available for use for OS-related work and
//   other PS processes will likely give you the best performance, if your
//   server's CPU is capable of multithreading. If you don't know what any of
//   this means or you are unfamiliar with PS' networking code, leave this set
//   to 1.
exports.workers = 1;

// wsdeflate - compresses WebSocket messages
//	 Toggles use of the Sec-WebSocket-Extension permessage-deflate extension.
//	 This compresses messages sent and received over a WebSocket connection
//	 using the zlib compression algorithm. As a caveat, message compression
//	 may make messages take longer to procress.
exports.wsdeflate = null;
/**exports.wsdeflate = {
	level: 5,
	memLevel: 8,
	strategy: 0,
	noContextTakeover: true,
	requestNoContextTakeover: true,
	maxWindowBits: 15,
	requestMaxWindowBits: 15,
};**/

// TODO: allow SSL to actually be possible to use for third-party servers at
// some point.

// proxyip - proxy IPs with trusted X-Forwarded-For headers
//   This can be either false (meaning not to trust any proxies) or an array
//   of strings. Each string should be either an IP address or a subnet given
//   in CIDR notation. You should usually leave this as `false` unless you
//   know what you are doing.
exports.proxyip = false;

// ofe - write heapdumps if sockets.js workers run out of memory.
//   If you wish to enable this, you will need to install node-oom-heapdump,
//   as it is sometimes not installed by default:
//     $ npm install node-oom-heapdump
exports.ofe = false;

// Pokemon of the Day - put a pokemon's name here to make it Pokemon of the Day
//   The PotD will always be in the #2 slot (not #1 so it won't be a lead)
//   in every Random Battle team.
exports.potd = '';

// crash guard - write errors to log file instead of crashing
//   This is normally not recommended - if Node wants to crash, the
//   server needs to be restarted
//   However, most people want the server to stay online even if there is a
//   crash, so this option is provided
exports.crashguard = true;

// login server data - don't forget the http:// and the trailing slash
//   This is the URL of the user database and ladder mentioned earlier.
//   Don't change this setting - there aren't any other login servers right now
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

// crashguardemail - if the server has been running for more than an hour
//   and crashes, send an email using these settings, rather than locking down
//   the server. Uncomment this definition if you want to use this feature;
//   otherwise, all crashes will lock down the server. If you wish to enable
//   this setting, you will need to install nodemailer, as it is not installed
//   by default:
//     $ npm install nodemailer
/**exports.crashguardemail = {
	options: {
		host: 'mail.example.com',
		port: 465,
		secure: true,
		auth: {
			user: 'example@domain.com',
			pass: 'password'
		}
	},
	from: 'crashlogger@example.com',
	to: 'admin@example.com',
	subject: 'Pokemon Showdown has crashed!'
};**/

// basic name filter - removes characters used for impersonation
//   The basic name filter removes Unicode characters that can be used for impersonation,
//   like the upside-down exclamation mark (looks like an i), the Greek omicron (looks
//   like an o), etc. Disable only if you need one of the alphabets it disables, such as
//   Greek or Cyrillic.
exports.disablebasicnamefilter = false;

// report joins and leaves - shows messages like "<USERNAME> joined"
//   Join and leave messages are small and consolidated, so there will never
//   be more than one line of messages.
//   If this setting is set to `true`, it will override the client-side
//   /hidejoins configuration for users.
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 80 or so users.
exports.reportjoins = true;

// report joins and leaves periodically - sends silent join and leave messages in batches
//   This setting will only be effective if `reportjoins` is set to false, and users will
//   only be able to see the messages if they have the /showjoins client-side setting enabled.
//   Set this to a positive amount of milliseconds if you want to enable this feature.
exports.reportjoinsperiod = 0;

// report battles - shows messages like "OU battle started" in the lobby
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 160 or so users.
exports.reportbattles = true;

// report joins and leaves in battle - shows messages like "<USERNAME> joined" in battle
//   Set this to false on large tournament servers where battles get a lot of joins and leaves.
//   Note that the feature of turning this off is deprecated.
exports.reportbattlejoins = true;

// notify staff when users have a certain amount of room punishments.
//   Setting this to a number greater than zero will notify staff for everyone with
//   the required amount of room punishments.
//   Set this to 0 to turn the monitor off.
exports.monitorminpunishments = 3;

// allow punishmentmonitor to lock users with multiple roombans.
//	 When set to `true`, this feature will automatically lock any users with three or more
//	 active roombans, and notify the staff room.
//   Note that this requires punishmentmonitor to be enabled, and therefore requires the `monitorminpunishments`
//   option to be set to a number greater than zero. If `monitorminpunishments` is set to a value greater than 3,
//   the autolock will only apply to people who pass this threshold.
exports.punishmentautolock = false;

// restrict sending links to autoconfirmed users only.
//   If this is set to `true`, only autoconfirmed users can send links to either chatrooms or other users, except for staff members.
//   This option can be used if your server has trouble with spammers mass PMing links to users, or trolls sending malicious links.
exports.restrictLinks = false;

// whitelist - prevent users below a certain group from doing things
//   For the modchat settings, false will allow any user to participate, while a string
//   with a group symbol will restrict it to that group and above. The string
//   'autoconfirmed' is also supported for chatmodchat and battlemodchat, to restrict
//   chat to autoconfirmed users.
//   This is usually intended to be used as a whitelist feature - set these to '+' and
//   voice every user you want whitelisted on the server.

// chat modchat - default minimum group for speaking in chatrooms; changeable with /modchat
exports.chatmodchat = false;
// battle modchat - default minimum group for speaking in battles; changeable with /modchat
exports.battlemodchat = false;
// pm modchat - minimum group for PMing other users, challenging other users
exports.pmmodchat = false;
// ladder modchat - minimum group for laddering
exports.laddermodchat = false;

// forced timer - force the timer on for all battles
//   Players will be unable to turn it off.
//   This setting can also be turned on with the command /forcetimer.
exports.forcetimer = false;

// backdoor - allows Pokemon Showdown system operators to provide technical
//            support for your server
//   This backdoor gives system operators (such as Zarel) console admin
//   access to your server, which allow them to provide tech support. This
//   can be useful in a variety of situations: if an attacker attacks your
//   server and you are not online, if you need help setting up your server,
//   etc. If you do not trust Pokemon Showdown with admin access, you should
//   disable this feature.
exports.backdoor = true;

// List of IPs and user IDs with dev console (>> and >>>) access.
// The console is incredibly powerful because it allows the execution of
// arbitrary commands on the local computer (as the user running the
// server). If an account with the console permission were compromised,
// it could possibly be used to take over the server computer. As such,
// you should only specify a small range of trusted IPs and users here,
// or none at all. By default, only localhost can use the dev console.
// In addition to connecting from a valid IP, a user must *also* have
// the `console` permission in order to use the dev console.
// Setting this to an empty array ([]) will disable the dev console.
exports.consoleips = ['127.0.0.1'];

// Whether to watch the config file for changes. If this is enabled,
// then the config.js file will be reloaded when it is changed.
// This can be used to change some settings using a text editor on
// the server.
exports.watchconfig = true;

// logchat - whether to log chat rooms.
exports.logchat = false;

// logchallenges - whether to log challenge battles. Useful for tournament servers.
exports.logchallenges = false;

// loguserstats - how often (in milliseconds) to write user stats to the
// lobby log. This has no effect if `logchat` is disabled.
exports.loguserstats = 1000 * 60 * 10; // 10 minutes

// validatorprocesses - the number of processes to use for validating teams
// simulatorprocesses - the number of processes to use for handling battles
// You should leave both of these at 1 unless your server has a very large
// amount of traffic (i.e. hundreds of concurrent battles).
exports.validatorprocesses = 1;
exports.simulatorprocesses = 1;

// inactiveuserthreshold - how long a user must be inactive before being pruned
// from the `users` array. The default is 1 hour.
exports.inactiveuserthreshold = 1000 * 60 * 60;

// autolockdown - whether or not to automatically kill the server when it is
// in lockdown mode and the final battle finishes.  This is potentially useful
// to prevent forgetting to restart after a lockdown where battles are finished.
exports.autolockdown = true;

// Custom avatars.
// This allows you to specify custom avatar images for users on your server.
// Place custom avatar files under the /config/avatars/ directory.
// Users must be specified as userids -- that is, you must make the name all
// lowercase and remove non-alphanumeric characters.
//
// Your server *must* be registered in order for your custom avatars to be
// displayed in the client.
exports.customavatars = {
	//'userid': 'customavatar.png'
};

// tourroom - specify a room to receive tournament announcements (defaults to
// the room 'tournaments').
// tourannouncements - announcements are only allowed in these rooms
// tourdefaultplayercap - a set cap of how many players can be in a tournament
// ratedtours - toggles tournaments being ladder rated (true) or not (false)
exports.tourroom = '';
exports.tourannouncements = [/* roomids */];
exports.tourdefaultplayercap = 0;
exports.ratedtours = false;

// appealurl - specify a URL containing information on how users can appeal
// disciplinary actions on your section. You can also leave this blank, in
// which case users won't be given any information on how to appeal.
exports.appealurl = '';

// repl - whether repl sockets are enabled or not
// replsocketprefix - the prefix for the repl sockets to be listening on
// replsocketmode - the file mode bits to use for the repl sockets
exports.repl = true;
exports.replsocketprefix = './logs/repl/';
exports.replsocketmode = 0o600;

// disablehotpatchall - disables `/hotpatch all`. Generally speaking, there's a
// pretty big need for /hotpatch all - convenience. The only advantage any hotpatch
// forms other than all is lower RAM use (which is only a problem for Main because
// Main is huge), and to do pinpoint hotpatching (like /nohotpatch).
exports.disablehotpatchall = false;

// permissions and groups:
//   Each entry in `grouplist' is a seperate group. Some of the members are "special"
//     while the rest is just a normal permission.
//   The order of the groups determines their ranking.
//   The special members are as follows:
//     - symbol: Specifies the symbol of the group (as shown in front of the username)
//     - id: Specifies an id for the group.
//     - name: Specifies the human-readable name for the group.
//     - root: If this is true, the group can do anything.
//     - inherit: The group uses the group specified's permissions if it cannot
//                  find the permission in the current group. Never make the graph
//                  produced using this member have any cycles, or the server won't run.
//     - jurisdiction: The default jurisdiction for targeted permissions where one isn't
//                       explictly specified. "Targeted permissions" are permissions
//                       that might affect another user, such as `ban' or `promote'.
//                       's' is a special group where it means the user itself only
//                       and 'u' is another special group where it means all groups
//                       lower in rank than the current group.
//     - roomonly: forces the group to be a per-room moderation rank only.
//     - globalonly: forces the group to be a global rank only.
//   All the possible permissions are as follows:
//     - console: Developer console (>>).
//     - lockdown: /lockdown and /endlockdown commands.
//     - hotpatch: /hotpatch, /crashfixed and /savelearnsets commands.
//     - ignorelimits: Ignore limits such as chat message length.
//     - promote: Promoting and demoting. Will only work if the target user's current
//                  group and target group are both in jurisdiction.
//     - room<rank>: /roompromote to <rank> (eg. roomvoice)
//     - makeroom: Create/delete chatrooms, and set modjoin/roomdesc/privacy
//     - editroom: Set modjoin/privacy only for battles/groupchats
//     - ban: Banning and unbanning.
//     - mute: Muting and unmuting.
//     - lock: locking (ipmute) and unlocking.
//     - receivemutedpms: Receive PMs from muted users.
//     - forcerename: /fr command.
//     - ip: IP checking.
//     - alts: Alt checking.
//     - modlog: view the moderator logs.
//     - broadcast: Broadcast informational commands.
//     - declare: /declare command.
//     - announce: /announce command.
//     - modchat: Set modchat.
//     - potd: Set PotD.
//     - forcewin: /forcewin command.
//     - battlemessage: /a command.
//     - tournaments: creating tournaments (/tour new, settype etc.)
//     - gamemoderation: /tour dq, autodq, end etc.
//     - gamemanagement: enable/disable games, minigames, and tournaments.
//     - minigame: make minigames (hangman, polls, etc.).
//     - game: make games.
exports.grouplist = [
	{
		symbol: '~',
		id: "admin",
		name: "Administrator",
		root: true,
		globalonly: true,
	},
	{
		symbol: '&',
		id: "leader",
		name: "Leader",
		inherit: '@',
		jurisdiction: 'u',
		promote: 'u',
		roomowner: true,
		roombot: true,
		roommod: true,
		roomdriver: true,
		forcewin: true,
		declare: true,
		modchatall: true,
		rangeban: true,
		makeroom: true,
		editroom: true,
		potd: true,
		disableladder: true,
		globalonly: true,
		gamemanagement: true,
		exportinputlog: true,
	},
	{
		symbol: '#',
		id: "owner",
		name: "Room Owner",
		inherit: '@',
		jurisdiction: 'u',
		roombot: true,
		roommod: true,
		roomdriver: true,
		editroom: true,
		declare: true,
		modchatall: true,
		roomonly: true,
		gamemanagement: true,
	},
	{
		symbol: '\u2605',
		id: "host",
		name: "Host",
		inherit: '@',
		jurisdiction: 'u',
		declare: true,
		modchat: true,
		roomonly: true,
		gamemanagement: true,
		joinbattle: true,
	},
	{
		symbol: '\u2606',
		id: "player",
		name: "Player",
		inherit: '+',
		roomvoice: true,
		modchat: true,
		roomonly: true,
		editroom: true,
		joinbattle: true,
		nooverride: true,
	},
	{
		symbol: '*',
		id: "bot",
		name: "Bot",
		inherit: '@',
		jurisdiction: 'u',
		declare: true,
		addhtml: true,
	},
	{
		symbol: '@',
		id: "mod",
		name: "Moderator",
		inherit: '%',
		jurisdiction: 'u',
		ban: true,
		modchat: true,
		roomvoice: true,
		forcerename: true,
		ip: true,
		alts: '@u',
		tournaments: true,
		game: true,
	},
	{
		symbol: '%',
		id: "driver",
		name: "Driver",
		inherit: '+',
		jurisdiction: 'u',
		announce: true,
		warn: '\u2606u',
		kick: true,
		mute: '\u2606u',
		lock: true,
		forcerename: true,
		timer: true,
		modlog: true,
		alts: '%u',
		bypassblocks: 'u%@&~',
		receiveauthmessages: true,
		gamemoderation: true,
		jeopardy: true,
		joinbattle: true,
		minigame: true,
	},
	{
		symbol: '+',
		id: "voice",
		name: "Voice",
		inherit: ' ',
		alts: 's',
		broadcast: true,
	},
	{
		symbol: ' ',
		ip: 's',
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
