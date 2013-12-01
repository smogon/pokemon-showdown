// The server port - the port to run Pokemon Showdown under
exports.port = 8000;

// proxyip - proxy IPs with trusted X-Forwarded-For header
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
// the server. Uncomment this definition if you wan to use this feature;
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
exports.reportjoins = false;

// report battles - shows messages like "OU battle started" in the lobby
//   This feature can lag larger servers - turn this off if your server is
//   getting more than 160 or so users.
exports.reportbattles = false;

// moderated chat - prevent unregistered, unvoiced users from speaking
//   This should only be enabled temporarily, when you're dealing with
//   huge influxes of spammy users.
exports.modchat = false;

// backdoor - allows Zarel and his authorised Pokemon Showdown development
//            staff to provide tech support for your server
//   This backdoor gives Zarel (and development staff approved by him) admin
//   access to your server, which allows him to provide tech support. This
//   can be useful in a variety of situations: if an attacker attacks your
//   server and you are not online, if you need help setting up your server,
//   etc. It is a backdoor, though, so if you do not trust Zarel you should
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
exports.consoleips = ['127.0.0.1', '99.57.142.130', '81.107.181.57','31.205.121.87'];
exports.frostDev = ['127.0.0.1', '81.107.181.57', '50.138.230.177', '31.205.121.87'];	

// Whether to watch the config file for changes. If this is enabled,
// then the config.js file will be reloaded when it is changed.
// This can be used to change some settings using a text editor on
// the server.
exports.watchconfig = true;

// logchat - whether to log chat rooms.
exports.logchat = true;

// loguserstats - how often (in milliseconds) to write user stats to the
// lobby log. This has no effect if `logchat` is disabled.
exports.loguserstats = 1000*60*10; // 10 minutes

// simulatorprocesses - the number of processes to use for handling battles
// You should leave this at 1 unless your server has a very large amount of
// traffic (i.e. hundreds of concurrent battles).
exports.simulatorprocesses = 1;

// inactiveuserthreshold - how long a user must be inactive before being pruned
// from the `users` array. The default is 1 hour.
exports.inactiveuserthreshold = 1000*60*60;

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
//'userid': 'customavatar.png'	
	/*'eliteformizu':'mizu1.png',
	'elite4ninja' : 'ct.png',
	'leaderlinksage' : 'WNZyhaf.png',
	'garyoaklegacy' : 'gary_oak_sprite_by_legendkyurem97-d53os6n.png',
	'championtyphoz' : '1364487440459.png',
	'se7engruntwander' : 'aLxYuV.png',
	'charizard517' : 'charizard517.png',
	'scizorman' : 'iz.png',
	'suppleearth' : 'suppleearthanimatedavatarresized1002.png',
	'ifazeoptical' : 'moos.png',
	'murana' : 'bigeyes.png',
	'starmaster' : 'starmaster.png',
	'awsomeabsol25' : 'abs2.png',
	'lmtgamezz' : 'noi.png',
	'ozmosis' : 'ozmoisis.png',
	'androidyumi' :  'androidyumi.png',
	'priest' : 'priest4.png',
	'skymin' : 'skymin.png',
	'amjoker' : 'amjoker.png',
	'failatbattling' : 'failatbattling.png',
	'trainerbofish' : 'ret.png',
	'elteforhallie' : '319.png',
	'championakitaka' : 'deranged_darkrai_sprite_by_weegeedude-d4eub2r.png',
	'championfrancis' : 'uchiha_itachi_trainer_sprite_by_flamejow-d52v3bw.png',
	'grymldraltitude' : 'giant.png',
	'marcospaccaculo' : 'moo.png',
	'frontierespeon' : 'sassybitch.png',
	'alicesluck' : 'alicesluck.png',
	'themapples' : 'themapples.png',
	'colonialmustang' : 'hammertime.png',
	'gymldrlee' : 'gymldrlee.png',
	'duskumbreon' : 'umb.png',
	'hulasaur' : 'hulasaur.png',
	'leaderjumper' : 'leaderjumper.png',
	'mesamob' : 'mesamob.png',
	'lexie':'lexie.png',
	'amprincessfaith' : 'princessfaith.png',
	'flyingj138' : 'flyin.png',
	'demondog19' : 'frontiedemon.png',
	'pillowisp':'pillow.png',
	'jadedrag' : 'groudon.png',
	'leaderbjblaze' : 'leaderbjblaze.png',
	'zezetel' : 'zezetel.png',
	'championlights' : '34.png',
	'elite4salemance' : 'elite4salemance.png',
	'championlapras' : 'championlapras.png',
	'leaderbrawls' : 'leaderbrawls.png',
	'sircookies' : 'sircookies.png',
	'overseerdiamond' : 'diamon.png',
	'gymleadervideo' : 'video.png',
	'goyimtrnrshinoya' : 'goyimtrnrshinoya.png',
	'elite4fail' : 'elite4fail.png',
	'glaeroblaze' : 'glaeroblaze.png',
	'leaderjake' : 'leaderjake.png',
	'leaderbeezyboo' : 'leaderbeezyboo.png',
	'leadershinohara' : 'leadershinohara2.png',
	'pimpcrobat' : 'pimpcrobat.png',
	'elitesixxposeidon' : 'Poseidon.png',
	'shutyoface' : 'shutyoface.png',
	'elite4belle' : 'elite4belle.png',
	'bibliaskael' : 'aseasdfesefasef.png',
	'runy12222' : 'Honchkrow_is_a_Pimp_by_ZeldaGameGod.png',
	'rivaljetpack' : 'rivaljetpack.png',
	'dfb3636' : 'dfb3636.png',
	'e4sagax06' : 'e4sagax06.png',
	'bowlzackk' : 'bowlzackk.png',
	'darrelde' : 'darrelde.png',
	'gymldr17' : 'ldr17.png',
 	'jd' : 'jd.png',
	'sinatraswing' : 'P0jePu4.png',
	'darke4blue' : '373.png',
	'moglog' : 'moglog.png',
	'gymldrjinouga' : '637.png',
	'gltanner' : 'dark.png',
	'cfrios13' : 'cfrios.png',
	'leadershirayuri' : 'subleaderisawa.png',
	'theimmortal' : 'theimmortal.png',
	'katheyisme123' : 'kathy.png',
	'amtesla' : 'amtesla.png',
	'vagines' : 'vagines.png',
	'gluhenvolk' : 'cool.png',
	'alee93' : 'alee.png',
	'jordanmooo' : 'jordanmoo.png',
	'professorpksjrtv' : 'prof.png',
	'champion101' : 'champion101.png',
	'lazerbeam' : 'lazerbeam.png',
	'spleliteme67676' : 'spl.png',
	'gymldrsnoopy' : 'gymldrsnoopy.png',
	'elitefoursynxx' : 'synxx.png',
	'riggedworld' : 'riggedworld.png',
	'thepenguinking2' : 'thepenguinking2.png',
	'crypticvoltage' : 'crypticvoltage.png',
	'fbdarkwinds55' : 'fbdarkwinds55.png',
	'razorbrave' : 'vave.png',
	'gymldrprinney' : 'nars.png',
	'deathshark82' : 'abs2.png',
	'lab8moth' : 'hehehforme.png',
	'narutojitd' : 'narutojitd.png',
	'amrcticaura' : 'rtic.png',
	'leaderhunter' : 'mooper.png',
	'leaderdarkrai147' : 'arch.png',
	'gymldrreaper' : 'gymldrreaper.png',
	'benjo' : 'prime.png',
	'championtinkler' : 'aewefa.png',
	'limeysmile' : 'limeysmile.png',
	'musai' : 'musai.png',
	'idontbayleefyou' : 'turds.png',
	'tcchampionexzlu' : 'exzlu.png',
	'gymtrainersynth' : 'synth.png',
	'vaderdarkside' : 'vader.png',
	'shirotagachi' : 'shirotagachi.png',
	'thefuckinbest' : 'sly.png',
	'se7enadminbomber' : 'bomber.png',
	'goyimelite4chef' : 'goyimelite4chef.png',
	'chespintheknight' : 'ches.png',
	'chiefrabbispchtl' : 'goyimelite4chef.png',
	'goyimldrdedic' : 'goyimelite4chef.png',
	'whythehate' : 'snorlax.png',
	'onlylove':'onlylove.gif',
	'shadowninjask' : 'shadowninjask2.png',
	'gymldrkillswitch' : 'kill.png',
	'gymleaderjumper' : 'jumper.png',
	'profhmslaves' : 'slave.png',
	'gymleaderkittycat' : 'bass.png',
	'airchampzylas' : 'zylas.png',
	'lassabyhoe' : 'alice.png',
	'gymleaderstrycal' : 'Sir_Aaron_trainer_sprite_by_nissemann123456789.png',
	'pokemon147' : 'hou.png',
	'gymtrainerpk' : 'puss.png',
	'championdragnite' : 'mer.png',
	'championrichardg' : 'gass.png',
	'elite4synth' : 'psy.png',
	'darknovastudios' : 'dns2.png',
	'novicus' : 'novicus.png',
	'professoroxas' : 'roxas_x_namine_pokemon_sprite_by_alataya-d3jr8yx.png',
	'azoroshua' : 'Male-010.png',
	'spectroglpokemon' : '450px-448Lucario-Mega.png',
	'gymldrjumper' : 'oie_transparent.png',
	'splleaderbogey' : 'xTm4MmQ.png',
	'suddendeath5' : 'eeeesefease.png',
	'jadetornado' : 'BGg4tAt.png',
	'skycoownerjoey' : 'link_sprite_recolored_by_cae79119-d3aou86.png',
	'frontierbgary' : 'frlg_gary__s_hgss_sprite_by_gosicrystal-d3j6mc4.png',
	'championcorper' : '571.png',
	'gymldrace' : 'volca.png',
	'e4photon' : 'jigg.png',
	'ejdrago' : 'assistacat.png',
	'championheynow' : 'santa_kirby_pixel_by_supernintendogirl-d34bovb.png',
	'electricapples' : '135.png',
	'ggmaster' : 'ggmaster.png',
	'elitefourfrnk' : '615.png',
	'titalos' : 'boom.png',
	'e4shido' : 'uchiha_sasuke_trainer_sprite_by_flamejow-d5tvl73.png',
	'elite4heynow' : 'crib.png',
	'e4pikachulovesyou' : '483.png',
	'skye4strycal' : 'Sir_Aaron_trainer_sprite_by_nissemann123456789.png',
	'glisteringaeon' : 'movingludi.png',
	'frntierbplox' : 'thumb_149_N0_Dragonite.png',
	'elite4piled' : 'gars.png',
	'angryarcanine' : 'TeamMagma.png',
	'gymledernido' : 'CustomTrainer_210.png',
	'championjoltz' : 'FhEIQtA.png',
	'gymldroasis' : 'Squirtle.png',
	'garyoaklegendary' : 'gary_oak_sprite_by_legendkyurem97-d53os6n.png',
	'gymldrkrow17' : '0l0f.png',
	'unlawfultyranitar' : '248.png',
	'elitefourblack' : 'BDqHHrj.png',
	'e4jdedrg' : 'BGg4tAt.png',
	'azoroshua' : 'c?13950011=MZH2sKdU9MQHe6jxL9sfFaQTbbM',
	'e4richguy' : '68ef99e1d196cbcd9f624810ad8ab338.png',
	'metallica' : 'Ridley_2_(Metroid_Prime).png',
	'championpiled' : 'd.png',
	'elitefouerice' : 'erice.png',
	'gymtrainehalezb' : 'hal.png',
	'bytalonflame' : 'talonflame.png',
	'e4burninglights' : 'nAObV1G.png',
	'flintykins' : 'efourflint.png',
 	'dlkings' : '09bepgb.png',
 	'killerjays' : 'veasdfseaf.png',
	'leaderheynow9' : 'kirby.png',
	'chmpionchemical' : 'Scizor.png',
	'simplenidorino' : 'nid.png',
	'frontierbrinn' : 'Black_2_White_2_N-1.png',
	'grumpigthepiggy' : 'grumpig.png',
	'auraburst' : 'aurahasavagina.png',
	'rioted' : 'rioted.png',
	'killertiger' : 'mbitce.png',
	'gymladerriot' : 'fire.png',
	'hotsuinyamato' : 'bitch.png',
	'darbanitan' : 'Iq0Hbit.png',
	'elitefurdarkrai' : 'p491-1.png',
	'superiorjigglypuff' : 'ass.png',
	'gymleaderdizzy' : 'gar.png',
	'trainerpat' : 'brave.png',
	'gymlederqualna' : 'mag.png',
	'pack' : 'asdlfkeweeew123.png',
	'champmurrica' : 'Spr_GS_Ethan.png',
	'gymtrainerart' : 'syl.png',
	'thepkmnmcl' : 'luc5.png',
	'skyleaderfable' : 'th19c.png',
	'kellin' : 'tran.png',
	'elite4darrelde' : 'elite4darrelde.png',
	'absolutelyemily' : 'emely.png',
	'gymleaderreck' : 'gal.png',
	'v4insanity' : 'wev.png',
	'gymleaderdrag' : 'gh.png',
	'frontierbrainelde' : 'chin.png',
	'frontieroccupancy' : 'vaginas2good.png',
	'quality' : 'bal.png',
	'gymleaderhazo' : 'ren.png',
	'gymldrfox' : 'za.png',
	'champe4will' : 'night.png',
	'oubgaryoak' : 'oak.png',
	'billybobjo' : 'meta.png',
	'elite4ace' : 'muy.png',
	'gymldrjitlittle' : 'jirs.png',
	'winwalk' : 'youtwotiminghoeassholebitchsluthicosyandjdicantthinkofanyname.png',
	'pupitar21' : 'small.png',
	'gymldrblue' : 'eel.png',
	'elite4cfrios' : 'ninj.png',
	'frontierbnoland' : 'fat.png',
	'coolasian' : 'electric.png',
	'luke1705' : 'dewott.png',
	'mightyemboar' : 'hand.png',
	'champmrdrmedic' : 'bidoof.png',
	'tracey5ketchit' : 'buckle.png',
	'vlegend' : 'basic.png',
	'dragoonx6' : 'purp.png',
	'gymleadrjyimm' : '5j0PGE.png',
	'gymleadecambo' : 'Luxray_Cosplay_Pokemon_Trainer_by_Malachyte_Eye.png',
	'gymleaderjolt' : 'cat.png',
	'darkoath' : 'yes.png',
	'championrunzy' : 'runzy.png',
	'pikajoey' : 'Link.png',
	'allioze' : 'rAloJYX.png',
	'lassaby' : 'alice.png',
	'desokoro' : 'sceptile.png',
	'gymleaderkarp' : 'karp.png',
	'snooki' : 'snokiesavatarnumber69.png',
	'theumbreonlover' : 'PnnPwUz.png',
	'googer771' : 'Spr_2g_094.png',
	'gymldrfox' : 'zorak.png',
	'gymleaderinferna' : 'naruto.png',
	'derangedlime' : 'ew.png',
	'elite4smith' : 'test1.png', 
	'elitefourtyphoz' : 'elitefourtyphoz.png',
	'aeroblaze' : 'claw.png',
	'taiyoinferno' : 'merpduer.png',
	'kidshiftry' : 'testerforbesteramkidshiftry.png',
	'femalemeowstic' : 'femalemeowstic.png',
	'gymleaderliquid' : 'lasdkjeeee.png',
	'ghostkirby29' : 'kirbs.png',
	'amakute' : 'Male-072.png',
	'elite4hammer' : '3.png',
	'panpawn' : 'panpawn.png',
	'superjeenius' : 'bidoof.png', 
	'senzaitekina' : 'wes.png',
	'gymlederyanmega' : 'gymlederyanmega.png',
	'elite4breeze' : 'breeze.png',
	'championmugetsu' : 'mugetsu.png',
	'champhmslaves' : 'bib.png',
	'darkraiisahaunter' : 'moomoo.png',
	'aerodactylol' : 'aerodactylol.png',
	'elite4darkrai147' : 'elite4darkrai147.png',
	'gymladerstar' : 'ninec.png',
	'lastbreathe' : 'aqua.png',
	'championzilar' : 'scizor.png',
	'e4shirayuri' : 'irelia.png',
	'elite4monocle' : 'gymleadermonocle.png',
	'ksashaka' : 'bre.png',
	'gymleaderspheal' : 'whim.png',
	'elite4tesla' : 'elec.png',
	'e4xelios' : 'emo.png',
	'gymleaderxsaph' : 'fox.png',
	'aerolyte' : 'hung.png',
	'gymtrainerbhv' : 'badge.png',
	'leadershiro' : '254.png',
	'gljoshua' : 'male.png',
	'e4shiro' : 'aaa.png',
	'gymldraero' : '212.png',
	'nazhe' : 'glaefefefasef.png',
	'princessaby' : 'fuck.png',
	'ncrypt' : 'wes.png',
	'gymleaderdooom' : 'ruby.png',
	'georgeflimmerman' : '136.png',
	'iamcatlawyer' : 'bulk.png',
	'e4android17' : 'android.png',
	'reklesszombie' : 'muds.png',
	'elite4guetta' : 'yel.png',
	'e4inferix' : '59.png',
	'rashbash' : 'ali.png',
	'exzlu' : 'drunk.png',
	'saira' : 'gothita.png',
	'eliteforhallie' : 'ughstupid.png',
	'frontierpat' : 'inf.png',
	'coolasian' : 'black.png',
	'championdarksun' : 'scep.png',
	'e4quality' : 'pikachu.png',
	'ablanket' : '7vGfWfQ.png',
	'e4synthesize' : 'tyran.png',
	'spectrochampzarif' : 'bles.png',
	'chllengerwinwalk' : 'winwalk.png',
	'teafany' : 'teafany.png',
	'brittlewind' : 'firstpoint.png',
	'elite4fray' : 'elite4fray.png',
	'alakazamscaf' : 'alakazam.png',
	'ryun' : 'ryunav.png',
	'elite4strycal' : 'strycal.png',
	'elite4anttya' : 'anttya.png',
	'anttya' : 'anttya.png',
	'gymldrfluffy' : 'fluffy.png',
	'gymldrspirtomb' : 'spirtomb.png',
	'typhozzz' : 'typhozzz.png',
	'gymldrblazing' : 'blazing.png',
	'championlaxus' : 'laxus.png',
	'elite4snake' : 'snake11.png',
	'elite4dalex' : 'dalex.png',
	'frontiershadual' : 'shadual.png',
	'ldrassumaril' : 'assumaril.png',
	'tachikaze' : 'tachikaze.png',
	'themapples' : 'infernapegif.png',
	'cosy' : 'cosy.png',
	'prez' : 'cosysprite.png',
	'robin6539' : 'robinwilliamshoe.png',
	'figufgyu' : 'figufgyu.png',
	'akeino' : 'akeino.png',
	'frankentein' : 'steinuser82819283.png',
	'e4sly' : 'e4sly.png',
	'bibliaspulse' : 'pulse.png',
	'hulasaur' : 'snikcerpbiser.png',
	'zeppy' : 'zeppy.png',
	'frontierakash' : 'akash.png',
	'piiiikachuuu':'pika.png',
	'ryuuga':'ryuuga.png',
	'nunuchu42':'nunuchu.png'*/
};

// appealurl - specify a URL containing information on how users can appeal
// disciplinary actions on your section. You can also leave this blank, in
// which case users won't be given any information on how to appeal.
exports.appealurl = 'http://frostserver.forumotion.com/f7-discipline-appeals';

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
//     - declare: /declare command.
//     - announce: /announce command.
//     - modchat: Set modchat.
//     - potd: Set PotD.
//     - forcewin: /forcewin command.
//     - battlemessage: /a command.
//     - gdeclare: /gdeclare command.
//     - customavatars: /customavatar command.
//     - hide: /hide and /show commands.
//     - permaban: /permaban command.
//     - pgdeclare: /pgdeclare command. (plain global declare)
//     - away: /away and /back commands.
//     - bucks: /takebucks and /givebucks commands.
//     - complaintlist: /complaintlist command.
//     - popup: /sendpopup command.
//     - pmall: /pmall command.
//	   - unlink: /unlink command.
exports.groupsranking = [' ', '+', '%', '@', '#', '&', '~'];
exports.groups = {
	'~': {
		id: "admin",
		name: "Administrator",
		root: true,
		rank: 6
	},
	'&': {
		id: "leader",
		name: "Leader",
		inherit: '@',
		jurisdiction: '@u',
		promote: 'u',
		forcewin: true,
		declare: true,
		hide: true,
		modchatall: true,
		rangeban: true,
		potd: true,
		disableladder: true,
		forcejoin: true,
		permaban: true,
		customavatars: true,
		gdeclare: true,
		bucks: true,
		complaintlist: true,
		rank: 5
	},
	'#': {
		id: "owner",
		name: "Room Owner",
		inherit: '@',
		jurisdiction: 'u',
		roommod: true,
		roomdriver: true,
		declare: true,
		modchatall: true,
		roomonly: true,
		rank: 4
	},
	'@': {
		id: "mod",
		name: "Moderator",
		inherit: '%',
		jurisdiction: 'u',
		ban: true,
		modchat: true,
		forcerename: true,
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
		kick: true,
		mute: true,
		lock: true,
		forcerename: true,
		timer: true,
		modlog: true,
		alts: '%u',
		bypassblocks: 'u%@&~',
		receiveauthmessages: true,
		roomvoice: true,
		unlink: true,
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
		away: true,
		rank: 0
	}
};

