// The server port - the port to run Pokemon Showdown under
exports.port = 8000;

// The server ID - a unique ID describing this Showdown server
exports.serverid = 'testserver';

// The server token - to access the login database and ladder on pokemonshowdown.com
//   This token must be registered for accessing the ladder, but you will
//   still be able to login with an unregistered token.
exports.servertoken = 'exampletoken-382hgraw4jr2tioq';

// login server URL - don't forget the http:// and the trailing slash
//   This is the URL of the user database and ladder mentioned earlier.
//   Don't change this setting - there aren't any other login servers right now
exports.loginserver = 'http://play.pokemonshowdown.com/';

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

// protocol - WebSockets ("ws") or Socket.IO ("io").
//	We recommend using WebSockets unless you have a really compelling reason not to.
exports.protocol = 'ws';

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
exports.groupsranking = [' ', '+', '%', '@', '&'];
exports.groups = {
	'&': {
		id: "sysop",
		name: "System Operator",
		root: true
	},
	'@': {
		id: "admin",
		name: "Admin",
		inherit: '%',
		jurisdiction: '@u',
		promote: 'u',
		forcewin: true,
		ban: true,
		mute: true,
		forcerename: true,
		forcerenameto: true,
		announce: true,
		modchat: true
	},
	'%': {
		id: "mod",
		name: "Moderator",
		inherit: '+',
		jurisdiction: 'su',
		ban: 'u',
		mute: 'u',
		namelock: 'u',
		forcerename: 'u',
		redirect: true
	},
	'+': {
		id: "voice",
		name: "Voiced",
		inherit: ' ',
		broadcast: true
	},
	' ': {
		jurisdiction: 's',
		ip: true,
		alts: true
	}
};
