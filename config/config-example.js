// The server port - the port to run Pokemon Showdown under
exports.port = 8000;

// The setuid user - if you're using a port below 1024, you probably want to run
//   PS as root and set this to an unprivileged user
exports.setuid = '';

// protocol - WebSockets ("ws") or Socket.IO ("io").
//   We recommend using WebSockets unless you have a really compelling reason not to.
exports.protocol = 'ws';

// The server ID - a unique ID describing this Showdown server
exports.serverid = 'testserver';

// The server token - to access the login database and ladder on pokemonshowdown.com
//   This token must be registered for accessing the ladder, but you will
//   still be able to login with an unregistered token.
exports.servertoken = 'exampletoken-382hgraw4jr2tioq';

// Proxy IP - a list of proxy IPs with trusted X-Forwarded-For headers
//   The list can be an array, or a string with whatever delimiter you wish.
//   Leave at false to never trust any proxy. Set to true to trust all
//   proxies. DO NOT SET TO TRUE UNLESS YOU ARE SURE YOU ARE BEHIND A
//   TRUSTED PROXY.
exports.proxyip = false;

// login server data - don't forget the http:// and the trailing slash
//   This is the URL of the user database and ladder mentioned earlier.
//   Don't change this setting - there aren't any other login servers right now
exports.loginserver = 'http://play.pokemonshowdown.com/';
exports.loginserverkeyalgo = "RSA-SHA1";
exports.loginserverpublickey = "-----BEGIN PUBLIC KEY-----\n" +
	"MIIBIDANBgkqhkiG9w0BAQEFAAOCAQ0AMIIBCAKCAQEApd1so8v8acgTXNQ/uQ12\n" +
	"oAoq0Cf27iyg+hS8elJZqkTelqIwA0OWTq4NzMCdrUWkmi+pHoUKy4wLHbD2w9KI\n" +
	"+kjah5HncXmqb7FK9RVjD8z6C84qFMBvg/VXX16c5CP2h0BC/pSwJfkw0NtOdFZL\n" +
	"ZhCkLObCjAN367/JGkp7CGP/hnNEm57GX9OUThfSX3t/DhV0cHdRkECsYkrTzZOV\n" +
	"nsz3uifOjVHiW5PR0KNwQm0ed6Bmg24PK7RJ091aRkT6lvmD1MB5Zl1SIV2l+wF6\n" +
	"O/G3x63WhR1HrNEM/jr/LVz+QjWuvNv68iSHDV3U62JkG/Yc53An1n/urX4J72DS\n" +
	"twIBIw==\n" +
	"-----END PUBLIC KEY-----\n";

// Pokemon of the Day - put a pokemon's name here to make it Pokemon of the Day
//   The PotD will always be in the #2 slot (not #1 so it won't be a lead)
//   in every randomly-generated team.
exports.potd = '';

// crash guard - write errors to log file instead of crashing
//   This is normally not recommended - if Node wants to crash, the
//   server needs to be restarted
//   Unfortunately, socket.io bug 409 requires some sort of crash guard
//   https://github.com/LearnBoost/socket.io/issues/609
exports.crashguard = true;

// local sysop - automatically promote users who connect from
//   127.0.0.1 to the highest ranking group (Usually &, or sysop)
exports.localsysop = false;

// report joins and leaves - shows messages like "<USERNAME> joined"
//   Join and leave messages are small and consolidated, so there will never
//   be more than one line of messages.
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 80 or so users.
exports.reportjoins = true;

// report battles - shows messages like "OU battle started"
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 160 or so users.
exports.reportbattles = true;

// moderated chat - prevent unregistered, unvoiced users from speaking
//   This should only be enabled temporarily, when you're dealing with
//   huge influxes of spammy users.
exports.modchat = false;

// backdoor - allow Zarel to provide tech support for your server
//   This backdoor gives Zarel admin access to your server, which allows him
//   to provide tech support. This can be useful in a variety of situations:
//   if an attacker attacks your server and you are not online, if you need
//   help setting up your server, etc.
//   It is a backdoor, though, so if you do not trust Zarel you should
//   disable this feature.
exports.backdoor = true;

// permissions and groups:
//   Each entry in `groupsranking' specifies the ranking of the groups.
//   Each entry in `groups' is a seperate group. Some of the members are "special"
//     while the rest is just a normal permission.
//   The special members are as follows:
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
//   All the possible permissions are as follows:
//     - console: Developer console (>>).
//     - lockdown: /lockdown and /endlockdown commands.
//     - hotpatch: /hotpatch, /crashfixed and /savelearnsets commands.
//     - ignorelimits: Ignore limits such as chat message length.
//     - promote: Promoting and demoting. Will only work if the target user's current
//                  group and target group are both in jurisdiction.
//     - ban: Banning and unbanning.
//     - mute: Muting and unmuting.
//     - receivemutedpms: Receive PMs from muted users.
//     - forcerename: /fr command.
//     - forcerenameto: /frt command.
//     - redirect: /redir command.
//     - ip: IP checking.
//     - alts: Alt checking.
//     - broadcast: Broadcast informational commands.
//     - announce: /announce command.
//     - modchat: Set modchat.
//     - potd: Set PotD.
//     - forcewin: /forcewin command.
//     - battlemessage: /a command.
exports.groupsranking = [' ', '+', '%', '@', '&', '~'];
exports.groups = {
	'~': {
		id: "admin",
		name: "Administrator",
		root: true,
		rank: 5
	},
	'&': {
		id: "leader",
		name: "Leader",
		inherit: '@',
		jurisdiction: '@u',
		promote: 'u',
		forcewin: true,
		declare: true,
		modchatall: true,
		potd: true,
		namelock: true,
		forcerenameto: true,
		rank: 4
	},
	'@': {
		id: "mod",
		name: "Moderator",
		inherit: '%',
		jurisdiction: 'u',
		ban: true,
		modchat: true,
		redirect: true,
		forcerename: true,
		modlog: true,
		ip: true,
		alts: '@u',
		rank: 3
	},
	'%': {
		id: "driver",
		name: "Driver",
		inherit: '+',
		jurisdiction: 'u',
		announce: true,
		warn: true,
		mute: true,
		forcerename: true,
		timer: true,
		alts: '%u',
		bypassblocks: 'u%@&~',
		rank: 2
	},
	'+': {
		id: "voice",
		name: "Voice",
		inherit: ' ',
		broadcast: true,
		rank: 1
	},
	' ': {
		ip: 's',
		alts: 's',
		rank: 0
	}
};
