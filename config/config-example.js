// The server ID - a unique ID describing this Showdown server
exports.serverid = 'pokecommunity';

// The server token - to access the login database and ladder on pokemonshowdown.com
//   This token must be registered for accessing the ladder, but you will
//   still be able to login with an unregistered token.
exports.servertoken = 'filler';

// The server port - the port to run Pokemon Showdown under
exports.port = 8000;

// proxyip - proxy IPs with trusted X-Forwarded-For headers
//   This can be either false (meaning not to trust any proxies) or an array
//   of strings. Each string should be either an IP address or a subnet given
//   in CIDR notation. You should usually leave this as `false` unless you
//   know what you are doing.
exports.proxyip = false;

// Pokemon of the Day - put a pokemon's name here to make it Pokemon of the Day
//   The PotD will always be in the #2 slot (not #1 so it won't be a lead)
//   in every Random Battle team.
exports.potd = '';

// crash guard - write errors to log file instead of crashing
//   This is normally not recommended - if Node wants to crash, the
//   server needs to be restarted
//   Unfortunately, socket.io bug 409 requires some sort of crash guard
//   https://github.com/LearnBoost/socket.io/issues/609
exports.crashguard = true;

// login server data - don't forget the http:// and the trailing slash
//   This is the URL of the user database and ladder mentioned earlier.
//   Don't change this setting - there aren't any other login servers right now
exports.loginserver = 'http://play.pokemonshowdown.com/';
exports.loginserverkeyalgo = "RSA-SHA1";
exports.loginserverpublickeyid = 2;
exports.loginserverpublickey = "-----BEGIN RSA PUBLIC KEY-----\n" +
	"MIICCgKCAgEAtFldA2rTCsPgqsp1odoH9vwhf5+QGIlOJO7STyY73W2+io33cV7t\n" +
	"ReNuzs75YBkZ3pWoDn2be0eb2UqO8dM3xN419FdHNORQ897K9ogoeSbLNQwyA7XB\n" +
	"N/wpAg9NpNu00wce2zi3/+4M/2H+9vlv2/POOj1epi6cD5hjVnAuKsuoGaDcByg2\n" +
	"EOullPh/00TkEkcyYtaBknZpED0lt/4ekw16mjHKcbo9uFiw+tu5vv7DXOkfciW+\n" +
	"9ApyYbNksC/TbDIvJ2RjzR9G33CPE+8J+XbS7U1jPvdFragCenz+B3AiGcPZwT66\n" +
	"dvHAOYRus/w5ELswOVX/HvHUb/GRrh4blXWUDn4KpjqtlwqY4H2oa+h9tEENCk8T\n" +
	"BWmv3gzGBM5QcehNsyEi9+1RUAmknqJW0QOC+kifbjbo/qtlzzlSvtbr4MwghCFe\n" +
	"1EfezeNAtqwvICznq8ebsGETyPSqI7fSbpmVULkKbebSDw6kqDnQso3iLjSX9K9C\n" +
	"0rwxwalCs/YzgX9Eq4jdx6yAHd7FNGEx4iu8qM78c7GKCisygZxF8kd0B7V7a5UO\n" +
	"wdlWIlTxJ2dfCnnJBFEt/wDsL54q8KmGbzOTvRq5uz/tMvs6ycgLVgA9r1xmVU+1\n" +
	"6lMr2wdSzyG7l3X3q1XyQ/CT5IP4unFs5HKpG31skxlfXv5a7KW5AfsCAwEAAQ==\n" +
	"-----END RSA PUBLIC KEY-----\n";

// crashguardemail - if the server has been running for more than an hour
// and crashes, send an email using these settings, rather than locking down
// the server. Uncomment this definition if you want to use this feature;
// otherwise, all crashes will lock down the server.
/**exports.crashguardemail = {
	transport: 'SMTP',
	options: {
		host: 'mail.example.com',
		port: 465,
		secureConnection: true,
		maxConnections: 1,
		auth: {
			user: 'example@domain.com',
			pass: 'password'
		}
	},
	from: 'crashlogger@example.com',
	to: 'admin@example.com',
	subject: 'Pokemon Showdown has crashed!'
};**/

// report joins and leaves - shows messages like "<USERNAME> joined"
//   Join and leave messages are small and consolidated, so there will never
//   be more than one line of messages.
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 80 or so users.
exports.reportjoins = true;

// report battles - shows messages like "OU battle started" in the lobby
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 160 or so users.
exports.reportbattles = true;

// report joins and leaves in battle - shows messages like "<USERNAME> joined" in battle
// Turn this off on large tournament servers where battles get a lot of joins and leaves.
exports.reportbattlejoins = true;

// moderated chat - prevent unvoiced users from speaking
//   This should only be enabled in special situations, such as temporarily
//   when you're dealing with huge influxes of spammy users.
exports.chatmodchat = false;
exports.battlemodchat = false;
exports.pmmodchat = false;

// backdoor - allows Pokemon Showdown system operators to provide technical
//            support for your server
//   This backdoor gives system operators (such as Zarel) console admin
//   access to your server, which allow them to provide tech support. This
//   can be useful in a variety of situations: if an attacker attacks your
//   server and you are not online, if you need help setting up your server,
//   etc. If you do not trust Pokemon Showdown with admin access, you should
//   disable this feature.
exports.backdoor = true;

// List of IPs from which the dev console (>> and >>>) can be used.
// The console is incredibly powerful because it allows the execution of
// arbitrary commands on the local computer (as the user running the
// server). If an account with the console permission were compromised,
// it could possibly be used to take over the server computer. As such,
// you should only specify a small range of trusted IPs here, or none
// at all. By default, only localhost can use the dev console.
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
exports.logchat = true;

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

// Set this to true if you are using Pokemon Showdown on Heroku.
exports.herokuhack = false;

// Custom avatars.
// This allows you to specify custom avatar images for users on your server.
// Place custom avatar files under the /config/avatars/ directory.
// Users must be specified as userids -- that is, you must make the name all
// lowercase and remove non-alphanumeric characters.
//
// Your server *must* be registered in order for your custom avatars to be
// displayed in the client.
exports.customavatars = {
	'ppn':'charizard_ppn.gif',
	'wolf': 'wolf.gif',
	'smusrn': 'wolf.gif',
	'peanutbutterjelli': 'jelli.jpg',
	'jelli': 'jelli.jpg',
	'michonne': 'jelli.jpg',
	'cstfrm': 'jelli.jpg',
	'sandfrm': 'jelli.jpg',
	'novae': 'twilight-sky.png',
	'saeyru': 'twilight-sky.png',
	'charis': 'twilight-sky.png',
	'kjelle': 'doronjo.gif',
	'captainsyrup': 'doronjo.gif',
	'altairis': 'altairis.png',
	'winry': 'altairis.png',
	'sanguine': 'sanguine.gif',
	'memro': 'sanguine.gif',
	'zeffy': 'zeffy.gif',
	'cheffy': 'zeffy.gif',
	'jinofthegale': 'jin.png',
	'squirrel': 'ozzy.png',
	'avogadro': 'ozzy.png',
	'antemortem': 'ante.png',
	'pachy': 'pachy.png',
	'eldy': 'pachy.png',
	'elod': 'pachy.png',
	'ladygunner': 'lady-gunner.gif',
	'queenofshipping': 'lady-gunner.gif',
	'starrywindy': 'starry-windy.gif',
	'twilightwindy': 'starry-windy.gif',
	'vtn': 'starry-windy.gif',
	'mtsuhney': 'starry-windy2.gif',
	'sri': 'srinator.gif',
	'correcty': 'rizon.png',
	'attrage': 'rizon.png',
	'aceofstars': 'rizon.png',
	'bidoofftw': 'alakapwnage.png',
	'djdoof': 'alakapwnage.png',
	'isit420yet': 'alakapwnage.png',
	'oxidation': 'yukis-sword.png',
	'gaspppp': 'daydreamsaway.gif',
	'travist': 'daydreamsaway2.gif',
	'slate': 'daydreamsaway3.gif',
	'sector': 'sector.gif',
	'milenakunis': 'sector-revenge.gif',
	'konstantinova': 'sector2.gif',
	'weighty': 'weightywillbill.png',
	'servineking': 'zach.gif',
	'terbte': 'zach.gif',
	'megaservine': 'zach.gif',
	'hiddenpowerflying': 'tide.png',
	'kingchuckles': 'chuckles.gif',
	'chucklesthegenie': 'chuckles.gif',
	'xxyveltalxx': 'xxyveltalxx.gif',
	'pleurnicheur': 'ravio.gif',
	'acemasterofturtles': 'ace_master_of_turtles.png',
	'turtlebro6': 'ace_master_of_turtles.png',
	'acertony': 'ace_master_of_turtles.png',
	'lati': 'unidentified.png',
	'clacla': 'clacla.png',
	'somniac': 'somniac.png',
	'ptchul': 'patchouli-knowledge.gif',
	'ladypatchouli': 'patchouli-knowledge.gif',
	'gensokyo': 'patchouli-knowledge.gif',
	'patchyknwledg': 'patchouli-knowledge.gif',
	'paladinbones': 'paladin-bones.png',
	'pervertedpika': 'o07_eleven.gif',
	'o07eleven': 'o07_eleven.gif',
	'detectivededenne': 'pervertedpikachu.png',
	'notspino': 'spinosaurus.gif',
	'witchie': 'witchie.png',
	'doctorsylveon': 'doctorsylveon.png',
	'maidalice': 'scandalice.gif',
	'scandalice': 'scandalice.gif',
	'pnkscandalice': 'scandalice.gif',
	'alcemargatrod': 'scandalice.gif',
	'sairentotamashii': 'sairento-tamashii.gif',
	'glaceongirl': 'paige-berlitz.png',
	'paigebryan': 'paige-berlitz.png',
	'littlebrother': 'littlebrother.png',
	'battlebro': 'littlebrother.png',
	'yukinagato': 'yukinagato.gif',
	'yuihirsaw': 'yukinagato.gif',
	'ladypatchouli': 'patchouli-knowledge.png',
	'elst': 'patchouli-knowledge.png',
	'marisakirisam': 'patchouli-knowledge.png',
	'gensokyo': 'patchouli-knowledge.png',
	'nidoking76': 'nidoking76.gif',
	'wolfmasin': 'wolf-masin.gif',
	'sargentwolf': 'wolf-masin.gif',
	'jrrkein': 'jrrkein.jpg',
	'anrindas': 'anrin-das.jpg',
	'thefattestsnorlax': 'thefattestsnorlax.gif',
	'sri': 'warpaint.gif',
	'srinator': 'warpaint.gif',
	'srintor': 'warpaint.gif',
	'miguelruizcabal': 'miguelruizcabal.jpg',
	'indiancharizard': 'indiancharizard.gif',
	'supershape': 'supershape.gif',
	'bellpix': 'bellpix.gif',
	'bluray': 'blu-ray.gif',
	'zaga': 'zaga.gif',
	'ashketchumadmn': 'ashketchumadmn.png',
	'shadowraze': 'shadowraze.png',
	'pixieforest': 'pixieforest.jpg',
	'pinkcessa': 'pixieforest.jpg',
	'cacelyn': 'pixieforest.jpg',
	'nylecac': 'pixieforest.jpg',
	'applejacknred': 'isaac.gif',
	'goldenfun': 'isaac.gif',
	'imjackinred': 'isaac.gif',
	'shadowe': 'nova.jpg',
	'libr': 'nova.jpg',
	'erelenemorgan': 'erelene-morgan.jpg',
	'philmiester': 'philmiester.gif',
	'programfreeze': 'programfreeze.jpg',
	'oakaxxiii': 'oaka-xxiii.gif',
	'actuallymr': 'mario.gif',
	'kimisumi': 'kimisumi.png',
	'zwlousquen': 'kimisumi2.gif',
	'wint': 'kimisumi3.jpg',
	'dos': 'kimisumi4.png',
	'yungblds': 'kimisumi5.jpg',
	'sphealkimimi': 'kimisumi6.gif',
	'madokakanamee': 'furoichi.jpg',
	'sirenttamashii': 'sairento-tamashii.jpg',
	'sairenttamashii': 'sairento-tamashii.jpg',
	'sirentamashii': 'sairento-tamashii.jpg',
	'sairentotamashii': 'sairento-tamashii.jpg',
	'ashadowssoul': 'sairento-tamashii.jpg',
	'lostchristms': 'sairento-tamashii.jpg',
	'mk1091': 'mk1091.png',
	'brndncullum': 'brndn-cullum.jpg',
	'ejgmorgan': 'ejg-morgan.jpg',
	'omicronhuh': 'omicron.png',
	'omicrn': 'omicron.png',
	'elheroeoscuro': 'elheroeoscuro.gif',
	'imdonionrings': 'elheroeoscuro.gif',
	'lightrestore': 'light-restore.png',
	'heracrossdude': 'heracrossdude.png',
	'darkvswhite': 'heracrossdude.png',
	'gymlederhera': 'heracrossdude.png',
	'nimo': 'nimo.png',
	'1ee7': 'nimo.png',
	'sharingiscaring': 'nimo.png',
	'hollowicrus': 'hollowicrus.jpg',
	'gymlederzolt': 'gym-leder-zolt.jpg',
	'galladebosszolt': 'gym-leder-zolt.jpg',
	'bearticsmalls': 'beartic-smalls.gif',
	'shaneo': 'shaneo.png',
	'pokecommbot': 'pokecommbot.png',
	'ilovepokehack': 'ilovepokehack.jpg',
	'achromaticlv': 'achromaticlv.png',
	'aevon': 'aevon.gif',
	'qwertypops': 'qwertypops.png',
	'kfcutman': 'kfcutman.gif',
	'infernogirl': 'kfcutman.gif',
	'kfcpupitar': 'kfcutman.gif',
	'megaman775': 'megaman775.gif',
	'jeran': 'jeran.png',
	'dracomasterpain': 'dracomasterpain.gif',
	'langur': 'langur.gif',
	'masterneyney': 'masterneyney.png',
	'chaos': 'chaos.png',
	'seif': 'seif.gif',
	'dsrlop95': 'dsrlop95.png',
	'tutur31': 'dsrlop95.png',
	'pomman': 'pomman.gif',
	'dracomasterbrit': 'pomman.gif',
	'arguso': 'arguso.png',
};

// appealurl - specify a URL containing information on how users can appeal
// disciplinary actions on your section. You can also leave this blank, in
// which case users won't be given any information on how to appeal.
exports.appealurl = 'http://www.pokecommunity.com/showthread.php?t=289012#seniorstaff';

// replsocketprefix - the prefix for the repl sockets to be listening on
// replsocketmode - the file mode bits to use for the repl sockets
exports.replsocketprefix = './logs/repl/';
exports.replsocketmode = 0600;

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
//     - redirect: /redir command.
//     - ip: IP checking.
//     - alts: Alt checking.
//     - broadcast: Broadcast informational commands.
//     - declare: /declare command.
//     - announce: /announce command.
//     - modchat: Set modchat.
//     - potd: Set PotD.
//     - forcewin: /forcewin command.
//     - battlemessage: /a command.
exports.groupsranking = [' ', '\u2606', '+', '\u2605', '%', '@', '#', '&', '~'];
exports.groups = {
	'~': {
		id: "admin",
		name: "Administrator",
		root: true,
		globalonly: true,
		rank: 8
	},
	'&': {
		id: "leader",
		name: "Leader",
		inherit: '@',
		jurisdiction: '@u',
		promote: 'u',
		forcewin: true,
		potd: true,
		disableladder: true,
		globalonly: true,
		tournamentsmanagement: true,
		rank: 7
	},
	'#': {
		id: "owner",
		name: "Room Owner",
		inherit: '@',
		jurisdiction: 'u',
		roommod: true,
		roomdriver: true,
		roomplayer: true,
		roomonly: true,
		tournamentsmanagement: true,
		rank: 6
	},
	'@': {
		id: "mod",
		name: "Moderator",
		inherit: '%',
		jurisdiction: '@u',
		ban: true,
		modchat: true,
		roomvoice: true,
		ip: true,
		modchatall: true,
		rangeban: true,
		gdeclare: true,
		clearall: true,
		roomswag: true,
		rank: 5
	},
	'%': {
		id: "driver",
		name: "Driver",
		inherit: '+',
		jurisdiction: 'u',
		warn: true,
		kick: true,
		mute: true,
		lock: true,
		forcerename: true,
		timer: true,
		modlog: true,
		bypassblocks: 'u%@&~',
		receiveauthmessages: true,
		tournamentsmoderation: true,
		jeopardy: true,
		rank: 4
	},
	'\u2605': {
		id: "player",
		name: "Player",
		inherit: ' ',
		rank: 3
	},
	'+': {
		id: "voice",
		name: "Voice",
		inherit: ' ',
		tournaments: true,
		declare: true,
		announce: true,
		ignorelimits: true,
		poll: true,
		rank: 2
	},
	'\u2606': {
		id: "swag",
		name: "Swag",
		inherit: ' ',
		roomonly: true,
		declare: true,
		announce: true,
		rank: 1
	},
	' ': {
		ip: 's',
		alts: '@u',
		broadcast: true,
		joinbattle: true,
		rank: 0
	}
};
