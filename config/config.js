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
//   and crashes, send an email using these settings, rather than locking down
//   the server. Uncomment this definition if you want to use this feature;
//   otherwise, all crashes will lock down the server.
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

// moderated chat - prevent unvoiced users from speaking
//   This should only be enabled in special situations, such as temporarily
//   when you're dealing with huge influxes of spammy users.
exports.chatmodchat = false;
exports.battlemodchat = false;
exports.pmmodchat = false;

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
	'powalen': 'jelli.jpg',
	'pwaln': 'jelli.jpg',
	'ctfrm': 'ctfrm.gif',
	'novae': 'twilightsky.png',
	'saeyru': 'twilightsky.png',
	'charis': 'twilightsky.png',
	'kjelle': 'doronjo.gif',
	'captainsyrup': 'doronjo.gif',
	'nabooru': 'nabooru.png',
	'altairis': 'altairis.png',
	'winry': 'altairis.png',
	'sanguine': 'sanguine.gif',
	'memro': 'sanguine.gif',
	'zeffy': 'zeffy.gif',
	'zeffyisnothere': 'zeffy.gif',
	'jinofthegale': 'jin.png',
	'squirrel': 'ozzy.png',
	'avogadro': 'ozzy.png',
	'antemortem': 'ante.png',
	'pachy': 'pachy.png',
	'eldy': 'pachy.png',
	'elod': 'pachy.png',
	'ladygunner': 'ladygunner.gif',
	'queenofshipping': 'ladygunner.gif',
	'starrywindy': 'starrywindy.gif',
	'twilightwindy': 'starrywindy.gif',
	'vtn': 'starrywindy.gif',
	'mtsuhney': 'starrywindy2.gif',
	'sri': 'srinator.gif',
	'correcty': 'rizon.png',
	'attrage': 'rizon.png',
	'aceofstars': 'rizon.png',
	'bidoofftw': 'alakapwnage.png',
	'djdoof': 'alakapwnage.png',
	'isit420yet': 'alakapwnage.png',
	'oxidation': 'yukissword.png',
	'gaspppp': 'daydreamsaway.gif',
	'travist': 'daydreamsaway2.gif',
	'slate': 'daydreamsaway3.gif',
	'sector': 'sector.gif',
	'milenakunis': 'sectorrevenge.gif',
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
	'ptchul': 'patchouliknowledge.gif',
	'patchyknwledg': 'patchouliknowledge.gif',
	'paladinbones': 'paladinbones.png',
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
	'glaceongirl': 'paigeberlitz.png',
	'paigebryan': 'paigeberlitz.png',
	'littlebrother': 'littlebrother.png',
	'battlebro': 'littlebrother.png',
	'yukinagato': 'yukinagato.gif',
	'yuihirsaw': 'yukinagato.gif',
	'ladypatchouli': 'patchouliknowledge.png',
	'elst': 'patchouliknowledge.png',
	'marisakirisam': 'patchouliknowledge.png',
	'gensokyo': 'patchouliknowledge.png',
	'nidoking76': 'nidoking76.gif',
	'wolfmasin': 'wolfmasin.gif',
	'sargentwolf': 'wolfmasin.gif',
	'jrrkein': 'jrrkein.jpg',
	'anrindas': 'anrindеоaνіs.gif',
	'anrinn': 'anrindеоaνіs.gif',
	'anrindеоaνіs': 'anrindеоaνіs.gif',
	'thefattestsnorlax': 'thefattestsnorlax.gif',
	'sri': 'warpaint.gif',
	'srinator': 'warpaint.gif',
	'srintor': 'warpaint.gif',
	'miguelruizcabal': 'miguelruizcabal.jpg',
	'indiancharizard': 'indiancharizard.gif',
	'supershape': 'supershape.gif',
	'bellpix': 'bellpix.gif',
	'bluray': 'bluray.gif',
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
	'erelenemorgan': 'erelenemorgan.jpg',
	'philmiester': 'philmiester.gif',
	'programfreeze': 'programfreeze.jpg',
	'oakaxxiii': 'oakaxxiii.gif',
	'actuallymr': 'mario.gif',
	'kimisumi': 'kimisumi.png',
	'zwlousquen': 'kimisumi2.gif',
	'wint': 'kimisumi3.jpg',
	'dos': 'kimisumi4.png',
	'yungblds': 'kimisumi5.jpg',
	'sphealkimimi': 'kimisumi6.gif',
	'amiy': 'amiy.gif',
	'madokakanamee': 'furoichi.jpg',
	'sirenttamashii': 'sairentotamashii.jpg',
	'sairenttamashii': 'sairentotamashii.jpg',
	'sirentamashii': 'sairentotamashii.jpg',
	'sairentotamashii': 'sairentotamashii.jpg',
	'ashadowssoul': 'sairentotamashii.jpg',
	'lostchristms': 'sairentotamashii.jpg',
	'kingdomoftea': 'sairentotamashii.jpg',
	'mk1091': 'mk1091.png',
	'brndncullum': 'brndncullum.jpg',
	'ejgmorgan': 'ejgmorgan.jpg',
	'omicronhuh': 'omicron.png',
	'omicrn': 'omicron.png',
	'elheroeoscuro': 'elheroeoscuro.gif',
	'imdonionrings': 'elheroeoscuro.gif',
	'lightrestore': 'lightrestore.png',
	'heracrossdude': 'heracrossdude.png',
	'darkvswhite': 'heracrossdude.png',
	'gymlederhera': 'heracrossdude.png',
	'nimo': 'nimo.png',
	'1ee7': 'nimo.png',
	'sharingiscaring': 'nimo.png',
	'hollowicrus': 'hollowicrus.jpg',
	'gymlederzolt': 'gymlederzolt.jpg',
	'galladebosszolt': 'gymlederzolt.jpg',
	'bearticsmalls': 'bearticsmalls.gif',
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
	'duzzy': 'jellicent.gif',
	'cluricaun': 'clur.png',
	'allianceclur': 'clur.png',
	'clur': 'clur.png',
	'insanelover': 'insanelover.png',
	'slrloer': 'insanelover.png',
	'alliancelver': 'insanelover.png',
	'pinkrabbit': 'pinkrabbit.gif',
	'affinitymssih': 'affinitymssih.png',
	'allianceazelea': 'allianceazelea.jpg',
	'fromazeleatown': 'allianceazelea.jpg',
	'alliancegallade': 'alliancegallade.png',
	'gyaradosislove': 'alliancegallade.png',
	'allianceghast': 'allianceghast.gif',
	'ghastslegacy': 'allianceghast.gif',
	'allianceguy': 'allianceguy.png',
	'shadowguy1': 'allianceguy.png',
	'allianceiluvppl': 'allianceiluvppl.png',
	'ih8someppl': 'allianceiluvppl.png',
	'allianceshz': 'allianceshz.png',
	'shz': 'allianceshz.png',
	'alliancesoulace': 'alliancesoulace.png',
	'acesoul': 'alliancesoulace.png',
	'emperorace': 'alliancesoulace.png',
	'alliancewalker': 'alliancewalker.gif',
	'archer99': 'archer99.gif',
	'hannumikkola': 'hannumikkola.gif',
	'lucifr': 'lucifr.gif',
	'orgen': 'lucifr.gif',
	'nayslayer': 'nayslayer.png',
	'alliancejustice': 'nayslayer.png',
	'dayummmm': 'nightcore4evah.gif',
	'nightcore4evah': 'nightcore4evah.gif',
	'lehux': 'terra.png',
	'theace22': 'theace22.png',
	'flamingarcanine75': 'theace22.png',
	'virg099': 'virg099.gif',
	'wudibou': 'wudibou.png',
	'silverhulkwolf': 'silverhulkwolf.jpg',
	'agnt': 'agnt.jpg',
	'shaymiin': 'shaymiin.gif',
	'silverpainis': 'silverpainis.gif',
	'thoughts': 'thoughts.png',
	'thjoker': 'thjoker.jpg',
	'clownjoker': 'thjoker.jpg',
	'asunaxkirito': 'asunaxkirito.PNG',
	'allianceazelea': 'allianceazelea.png',
	'pcho': 'pcho.jpg',
	'allianceghast': 'allianceghast.jpg',
	'alliancemystle': 'alliancemystle.png',
	'mystletaynn': 'alliancemystle.png',
	'alliancelemon': 'alliancelemon.gif',
	'allianclemn': 'alliancelemon.gif',
	'alliancespook': 'alliancespook.png',
	'alliancenidaime': 'alliancenidaime.gif',
	'thenidaime': 'alliancenidaime.gif',
	'alliancecarn0x': 'alliancecarn0x.png',
	'allianceaqua': 'allianceaqua.png',
	'pmtkred': 'pmtkred.png',
	'funkycrackudocat': 'funkycrackudocat.png',
	'dudugoissilva': 'funkycrackudocat.png',
	'abnegation': 'abnegation.png',
	'sranger': 'abnegation.png',
	'rabinov': 'rabinov.png',
	'darklight1999': 'darklight1999.png',
	'alliancedyla': 'alliancedyla.png',
	'hanaaa': 'hanaaa.png',
	'hanalyse': 'hanaaa.png',
	'connwaer': 'connwaer.jpg',
	'oocyst': 'oocyst.png',
	'thedressisalie': 'thedressisalie.jpg',
	'weshbien': 'weshbien.png',
	'kridaneladd': 'weshbien.png',
	'kingsyn': 'kingsyn.gif',
	'syndrome': 'kingsyn.gif',
	'lonnybreaux': 'kingsyn.gif',
	'loveonmypiano': 'kingsyn.gif',
	'fkasyndrome': 'kingsyn.gif',
	'tahliahbarnett': 'kingsyn.gif',
	'theservant35': 'kingsyn.gif',
	'clydedrexler': 'kingsyn.gif',
	'haxnyancat1': 'haxnyancat1.jpg',
	'koha': 'koha.jpg',
	'loliable': 'koha.jpg',
	'marcisaxy': 'marcisaxy.gif',
	'xanaplana': 'xanaplana.gif',
	'valkyriaanna': 'valkyriaanna.png',
	'yinyanganna': 'valkyriaanna.png',
	'froginfected': 'froginfected.gif',
	'choicespecsp2': 'froginfected.gif',
	'yungfrog420xxxog': 'froginfected.gif',
	'juudaime103': 'juudaime103.png',
	'lucy2512': 'lucy2512.gif',
	'shawott': 'shawott.gif',
	'absol98sk': 'absol98sk.jpg',
	'alelobo': 'alelobo.gif',
	'bisquaza': 'bisquaza.png',
	'roxierosalinaxl': 'roxierosalinaxl.gif',
	'spatacus': 'spatacus.png',
	'quilachy': 'quilachy.png',
	'lucasrecrear': 'lucasrecrear.gif',
	'axtheefrost': 'axtheefrost.gif',
	'andyvenus': 'axtheefrost.gif',
	'darkshadow6': 'darkshadow6.gif',
	'ejoseluiis': 'ejoseluiis.png',
	'f4n': 'f4n.gif',
	'jeandbz': 'jeandbz.gif',
	'juudaime103': 'juudaime103.gif',
	'lukey': 'lukey.gif',
	'ppgore': 'ppgore.gif',
	'prateeksingh': 'prateeksingh.gif',
	'principebaka': 'principebaka.gif',
	'punkysaur': 'punkysaur.gif',
	'quatuorgamer': 'quatuorgamer.png',
	'jungkodu07': 'quatuorgamer.png',
	'roxyjadhav': 'roxyjadhav.gif',
	'ryukiry': 'ryukiry.gif',
	'suraku75': 'suraku75.gif',
	'destinedjagold': 'destinedjagold.jpg',
	'megalucariov': 'megalucariov.gif',
	'shinmei971': 'shinmei971.png',
	'shinmeitensai': 'shinmei971.png',
	'dariiangamer': 'dariiangamer.gif',
	'gallamex': 'gallamex.jpg',
	'holiano': 'holiano.png',
	'letmeshine': 'holiano.png',
	'invincibleswampert': 'invincibleswampert.png',
	'its103': 'its103.gif',
	'mlanie': 'mlanie.png',
	'elodie': 'mlanie.png',
	'rookiedoce': 'rookiedoce.jpg',
	'situm': 'situm.png',
	'situmparletmort': 'situm.png',
	'skyrio': 'skyrio.png',
	'toto013': 'toto013.jpg',
	'yanignacio1': 'yanignacio1.jpg',
	'zincoxide': 'zincoxide.jpg',
	'ansirent': 'zincoxide.jpg',
};

// Tournament announcements
// When tournaments are created in rooms listed below, they will be announced in
// the server's main tournament room (either the specified tourroom or by default
// the room 'tournaments')
exports.tourroom = '';
exports.tourannouncements = [/* roomids */];

// appealurl - specify a URL containing information on how users can appeal
// disciplinary actions on your section. You can also leave this blank, in
// which case users won't be given any information on how to appeal.
exports.appealurl = 'http://www.pokecommunity.com/showthread.php?t=289012#seniorstaff';

// replsocketprefix - the prefix for the repl sockets to be listening on
// replsocketmode - the file mode bits to use for the repl sockets
exports.replsocketprefix = './logs/repl/';
exports.replsocketmode = 0600;

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
//     - ban: Banning and unbanning.
//     - mute: Muting and unmuting.
//     - lock: locking (ipmute) and unlocking.
//     - receivemutedpms: Receive PMs from muted users.
//     - forcerename: /fr command.
//     - redirect: /redir command.
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
//     - tournamentsmoderation: /tour dq, autodq, end etc.
//     - tournamentsmanagement: enable/disable tournaments.
exports.grouplist = [
	{
		symbol: '~',
		id: "admin",
		name: "Administrator",
		root: true,
		globalonly: true
	},
	{
		symbol: '#',
		id: "owner",
		name: "Room Owner",
		inherit: '&',
		jurisdiction: 'u',
		roomleader: true,
		roomonly: true
	},
	{
		symbol: '&',
		id: "leader",
		name: "Leader",
		inherit: '@',
		jurisdiction: 'u',
		roommod: true,
		roomdriver: true,
		roomsubdriver: true,
		roomonly: true,
		tournamentsmanagement: true,
		rmall: true
	},
	{
		symbol: '-',
		id: "battleplayer",
		name: "Battle Player",
		inherit: ' ',
		broadcast: true,
		joinbattle: true,
		roomvoice: true,
		modchat: true,
		roomonly: true,
		privateroom: true,
		modchatall: true
	},
	{
		symbol: '@',
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
		roomplayer: true
	},
	{
		symbol: '%',
		id: "driver",
		name: "Driver",
		inherit: '=',
		jurisdiction: 'u'
	},
	{
		symbol: '=',
		id: "subdriver",
		name: "Subdriver",
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
		jeopardy: true
	},
	{
		symbol: '+',
		id: "voice",
		name: "Voice",
		inherit: ' ',
		tournaments: true,
		voicetourmoderation: true,
		declare: true,
		announce: true,
		ignorelimits: true,
		poll: true,
		joinbattle: true
	},
	{
		symbol: '\u2022',
		id: "bot",
		name: "Bot",
		inherit: ' ',
		jurisdiction: 'u',
		warn: true,
		kick: true,
		mute: true,
		lock: true,
		ban: true
	},
	{
		symbol: '\u2605',
		id: "player",
		name: "Player",
		inherit: ' '
	},
	{
		symbol: ' ',
		ip: 's',
		alts: '@u',
		broadcast: true
	}
];
