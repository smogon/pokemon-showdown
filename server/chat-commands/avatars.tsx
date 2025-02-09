/**
 * Avatar commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 * @author Zarel <guangcongluo@gmail.com>
 */

import {FS, Net} from "../../lib";

const AVATARS_FILE = 'config/avatars.json';

/**
 * Avatar IDs should be in one of these formats:
 * - 'cynthia' - official avatars in https://play.pokemonshowdown.com/sprites/trainers/
 * - '#splxraiders' - hosted custom avatars in https://play.pokemonshowdown.com/sprites/trainers-custom/
 * - 'example.png' - side server custom avatars in config/avatars/ in your server
 */
type AvatarID = string;
const AVATAR_FORMATS_MESSAGE = Config.serverid === 'showdown' ?
	"Custom avatars start with '#', like '#splxraiders'." :
	"Custom avatars look like 'example.png'. Custom avatars should be put in `config/avatars/`. Your server must be registered for custom avatars to work.";

interface AvatarEntry {
	timeReceived?: number;
	timeUpdated?: number;
	notNotified?: boolean;
	/**
	 * First entry is the personal avatar.
	 * Will never only contain `null` - the entry should just be deleted if it does.
	 */
	allowed: [AvatarID | null, ...AvatarID[]];
	/**
	 * undefined = personal avatar;
	 * null = no default (shouldn't occur in practice);
	 * (ignored during Christmas, where the any avatar is default if it ends in `xmas`.)
	 */
	default?: AvatarID | null;
}

const customAvatars: {[userid: string]: AvatarEntry} = Object.create(null);

try {
	const configAvatars = JSON.parse(FS(AVATARS_FILE).readSync());
	Object.assign(customAvatars, configAvatars);
} catch {
	if (Config.customavatars) {
		for (const userid in Config.customavatars) {
			customAvatars[userid] = {allowed: [Config.customavatars[userid]]};
		}
	}
	if (Config.allowedavatars) {
		for (const avatar in Config.customavatars) {
			for (const userid of Config.customavatars[avatar]) {
				if (!customAvatars[userid]) customAvatars[userid] = {allowed: [null]};
				customAvatars[userid].allowed.push(avatar);
			}
		}
	}
	FS(AVATARS_FILE).writeSync(JSON.stringify(customAvatars));
}
if ((Config.customavatars && Object.keys(Config.customavatars).length) || Config.allowedavatars) {
	Monitor.crashlog("Please remove 'customavatars' and 'allowedavatars' from Config (config/config.js). Your avatars have been migrated to the new '/addavatar' system.");
}
function saveCustomAvatars(instant?: boolean) {
	FS(AVATARS_FILE).writeUpdate(() => JSON.stringify(customAvatars), {throttle: instant ? null : 60_000});
}

export const Avatars = new class {
	avatars = customAvatars;
	userCanUse(user: User, avatar: string): AvatarID | null {
		let validatedAvatar = null;
		for (const id of [user.id, ...user.previousIDs]) {
			validatedAvatar = Avatars.canUse(id, avatar);
			if (validatedAvatar) break;
		}
		return validatedAvatar;
	}
	canUse(userid: ID, avatar: string): AvatarID | null {
		avatar = avatar.toLowerCase().replace(/[^a-z0-9-.#]+/g, '');
		if (OFFICIAL_AVATARS.has(avatar)) return avatar;

		const customs = customAvatars[userid]?.allowed;
		if (!customs) return null;

		if (customs.includes(avatar)) return avatar;
		if (customs.includes('#' + avatar)) return '#' + avatar;
		if (avatar.startsWith('#') && customs.includes(avatar.slice(1))) return avatar.slice(1);
		return null;
	}
	save(instant?: boolean) {
		saveCustomAvatars(instant);
	}
	src(avatar: AvatarID) {
		if (avatar.includes('.')) return '';
		const avatarUrl = avatar.startsWith('#') ? `trainers-custom/${avatar.slice(1)}.png` : `trainers/${avatar}.png`;
		return `https://${Config.routes.client}/sprites/${avatarUrl}`;
	}
	exists(avatar: string) {
		if (avatar.includes('.')) {
			return FS(`config/avatars/${avatar}`).isFile();
		}
		if (!avatar.startsWith('#')) {
			return OFFICIAL_AVATARS.has(avatar);
		}
		return Net(Avatars.src(avatar)).get().then(() => true).catch(() => false);
	}
	convert(avatar: string) {
		if (avatar.startsWith('#') && avatar.includes('.')) return avatar.slice(1);
		return avatar;
	}
	async validate(avatar: string, options?: {rejectOfficial?: boolean}) {
		avatar = this.convert(avatar);
		if (!/^#?[a-z0-9-]+$/.test(avatar) && !/^[a-z0-9.-]+$/.test(avatar)) {
			throw new Chat.ErrorMessage(`Avatar "${avatar}" is not in a valid format. ${AVATAR_FORMATS_MESSAGE}`);
		}
		if (!await this.exists(avatar)) {
			throw new Chat.ErrorMessage(`Avatar "${avatar}" doesn't exist. ${AVATAR_FORMATS_MESSAGE}`);
		}
		if (options?.rejectOfficial && /^[a-z0-9-]+$/.test(avatar)) {
			throw new Chat.ErrorMessage(`Avatar "${avatar}" is an official avatar that all users already have access to.`);
		}
		return avatar;
	}
	img(avatar: AvatarID, noAlt?: boolean) {
		const src = Avatars.src(avatar);
		if (!src) return <strong><code>{avatar}</code></strong>;
		return <img
			src={src} alt={noAlt ? '' : avatar} width="80" height="80" class="pixelated" style={{verticalAlign: 'middle'}}
		/>;
	}
	getDefault(userid: ID) {
		const entry = customAvatars[userid];
		if (!entry) return null;
		const DECEMBER = 11; // famous JavaScript issue
		if (new Date().getMonth() === DECEMBER && entry.allowed.some(avatar => avatar?.endsWith('xmas'))) {
			return entry.allowed.find(avatar => avatar?.endsWith('xmas'));
		}
		return entry.default === undefined ? entry.allowed[0] : entry.default;
	}
	/** does not include validation */
	setDefault(userid: ID, avatar: AvatarID | null) {
		if (avatar === this.getDefault(userid)) return;
		if (!customAvatars[userid]) customAvatars[userid] = {allowed: [null]};
		const entry = customAvatars[userid];

		if (avatar === entry.allowed[0]) {
			delete entry.default;
		} else {
			entry.default = avatar;
		}
		saveCustomAvatars();
	}
	addAllowed(userid: ID, avatar: AvatarID | null) {
		if (!customAvatars[userid]) customAvatars[userid] = {allowed: [null]};

		if (customAvatars[userid].allowed.includes(avatar)) return false;

		customAvatars[userid].allowed.push(avatar);
		customAvatars[userid].notNotified = true;
		this.tryNotify(Users.get(userid));
		return true;
	}
	removeAllowed(userid: ID, avatar: AvatarID | null) {
		const entry = customAvatars[userid];
		if (!entry?.allowed.includes(avatar)) return false;

		if (entry.allowed[0] === avatar) {
			entry.allowed[0] = null;
		} else {
			entry.allowed = entry.allowed.filter(a => a !== avatar) as any;
		}
		if (!entry.allowed.some(Boolean)) delete customAvatars[userid];
		return true;
	}
	addPersonal(userid: ID, avatar: AvatarID | null) {
		if (!customAvatars[userid]) customAvatars[userid] = {allowed: [null]};
		const entry = customAvatars[userid];

		if (entry.allowed.includes(avatar)) return false;

		entry.timeReceived ||= Date.now();
		entry.timeUpdated = Date.now();
		if (!entry.allowed[0]) {
			entry.allowed[0] = avatar;
		} else {
			entry.allowed.unshift(avatar);
		}
		delete entry.default;
		entry.notNotified = true;
		this.tryNotify(Users.get(userid));
		return true;
	}
	handleLogin(user: User) {
		const avatar = this.getDefault(user.id);
		if (avatar) user.avatar = avatar;
		this.tryNotify(user);
	}
	tryNotify(user?: User | null) {
		if (!user) return;

		const entry = customAvatars[user.id];
		if (entry?.notNotified) {
			user.send(
				`|pm|~|${user.getIdentity()}|/raw ` +
				Chat.html`${<>
					<p>
						You have a new custom avatar!
					</p>
					<p>
						{entry.allowed.map(avatar => avatar && [Avatars.img(avatar), ' '])}
					</p>
					Use <button class="button" name="send" value="/avatars"><code>/avatars</code></button> for usage instructions.
				</>}`
			);
			delete entry.notNotified;
			saveCustomAvatars();
		}
	}
};

function listUsers(users: string[]) {
	return users.flatMap((userid, i) => [i ? ', ' : null, <username class="username">{userid}</username>]);
}

const OFFICIAL_AVATARS = new Set([
	'aaron',
	'acetrainercouple-gen3', 'acetrainercouple',
	'acetrainerf-gen1', 'acetrainerf-gen1rb', 'acetrainerf-gen2', 'acetrainerf-gen3', 'acetrainerf-gen3rs', 'acetrainerf-gen4dp', 'acetrainerf-gen4', 'acetrainerf',
	'acetrainer-gen1', 'acetrainer-gen1rb', 'acetrainer-gen2', 'acetrainer-gen3jp', 'acetrainer-gen3', 'acetrainer-gen3rs', 'acetrainer-gen4dp', 'acetrainer-gen4', 'acetrainer',
	'acetrainersnowf',
	'acetrainersnow',
	'agatha-gen1', 'agatha-gen1rb', 'agatha-gen3',
	'alder',
	'anabel-gen3',
	'archer',
	'archie-gen3',
	'argenta',
	'ariana',
	'aromalady-gen3', 'aromalady-gen3rs', 'aromalady',
	'artist-gen4', 'artist',
	'ash-alola', 'ash-hoenn', 'ash-kalos', 'ash-unova', 'ash-capbackward', 'ash-johto', 'ash-sinnoh', 'ash',
	'backersf',
	'backers',
	'backpackerf',
	'backpacker',
	'baker',
	'barry',
	'battlegirl-gen3', 'battlegirl-gen4', 'battlegirl',
	'beauty-gen1', 'beauty-gen1rb', 'beauty-gen2jp', 'beauty-gen2', 'beauty-gen3', 'beauty-gen3rs', 'beauty-gen4dp', 'beauty-gen5bw2', 'beauty',
	'bellelba',
	'bellepa',
	'benga',
	'bertha',
	'bianca-pwt', 'bianca',
	'biker-gen1', 'biker-gen1rb', 'biker-gen2', 'biker-gen3', 'biker-gen4', 'biker',
	'bill-gen3',
	'birch-gen3',
	'birdkeeper-gen1', 'birdkeeper-gen1rb', 'birdkeeper-gen2', 'birdkeeper-gen3', 'birdkeeper-gen3rs', 'birdkeeper-gen4dp', 'birdkeeper',
	'blackbelt-gen1', 'blackbelt-gen1rb', 'blackbelt-gen2', 'blackbelt-gen3', 'blackbelt-gen3rs', 'blackbelt-gen4dp', 'blackbelt-gen4', 'blackbelt',
	'blaine-gen1', 'blaine-gen1rb', 'blaine-gen2', 'blaine-gen3', 'blaine',
	'blue-gen1champion', 'blue-gen1', 'blue-gen1rbchampion', 'blue-gen1rb', 'blue-gen1rbtwo', 'blue-gen1two', 'blue-gen2', 'blue-gen3champion', 'blue-gen3', 'blue-gen3two', 'blue',
	'boarder-gen2', 'boarder',
	'brandon-gen3',
	'brawly-gen3', 'brawly',
	'brendan-gen3', 'brendan-gen3rs',
	'brock-gen1', 'brock-gen1rb', 'brock-gen2', 'brock-gen3', 'brock',
	'bruno-gen1', 'bruno-gen1rb', 'bruno-gen2', 'bruno-gen3', 'bruno',
	'brycenman',
	'brycen',
	'buck',
	'bugcatcher-gen1', 'bugcatcher-gen1rb', 'bugcatcher-gen2', 'bugcatcher-gen3', 'bugcatcher-gen3rs', 'bugcatcher-gen4dp', 'bugcatcher',
	'bugmaniac-gen3',
	'bugsy-gen2', 'bugsy',
	'burgh',
	'burglar-gen1', 'burglar-gen1rb', 'burglar-gen2', 'burglar-gen3', 'burglar',
	'byron',
	'caitlin-gen4', 'caitlin',
	'cameraman',
	'camper-gen2', 'camper-gen3', 'camper-gen3rs', 'camper',
	'candice',
	'channeler-gen1', 'channeler-gen1rb', 'channeler-gen3',
	'cheren-gen5bw2', 'cheren',
	'cheryl',
	'chili',
	'chuck-gen2', 'chuck',
	'cilan',
	'clair-gen2', 'clair',
	'clay',
	'clemont',
	'clerkf',
	'clerk-boss', 'clerk',
	'clown',
	'collector-gen3', 'collector',
	'colress',
	'courtney-gen3',
	'cowgirl',
	'crasherwake',
	'cress',
	'crushgirl-gen3',
	'crushkin-gen3',
	'cueball-gen1', 'cueball-gen1rb', 'cueball-gen3',
	'cyclistf-gen4', 'cyclistf',
	'cyclist-gen4', 'cyclist',
	'cynthia-gen4', 'cynthia',
	'cyrus',
	'dahlia',
	'daisy-gen3',
	'dancer',
	'darach-caitlin', 'darach',
	'dawn-gen4pt', 'dawn',
	'depotagent',
	'doctor',
	'doubleteam',
	'dragontamer-gen3', 'dragontamer',
	'drake-gen3',
	'drayden',
	'elesa-gen5bw2', 'elesa',
	'emmet',
	'engineer-gen1', 'engineer-gen1rb', 'engineer-gen3',
	'erika-gen1', 'erika-gen1rb', 'erika-gen2', 'erika-gen3', 'erika',
	'ethan-gen2c', 'ethan-gen2', 'ethan-pokeathlon', 'ethan',
	'eusine-gen2', 'eusine',
	'expertf-gen3',
	'expert-gen3',
	'falkner-gen2',
	'falkner',
	'fantina',
	'firebreather-gen2',
	'firebreather',
	'fisherman-gen1', 'fisherman-gen1rb', 'fisherman-gen2jp', 'fisherman-gen3', 'fisherman-gen3rs', 'fisherman-gen4', 'fisherman',
	'flannery-gen3', 'flannery',
	'flint',
	'galacticgruntf',
	'galacticgrunt',
	'gambler-gen1', 'gambler-gen1rb', 'gambler',
	'gamer-gen3',
	'gardenia',
	'gentleman-gen1', 'gentleman-gen1rb', 'gentleman-gen2', 'gentleman-gen3', 'gentleman-gen3rs', 'gentleman-gen4dp', 'gentleman-gen4', 'gentleman',
	'ghetsis-gen5bw', 'ghetsis',
	'giovanni-gen1', 'giovanni-gen1rb', 'giovanni-gen3', 'giovanni',
	'glacia-gen3',
	'greta-gen3',
	'grimsley',
	'guitarist-gen2', 'guitarist-gen3', 'guitarist-gen4', 'guitarist',
	'harlequin',
	'hexmaniac-gen3jp', 'hexmaniac-gen3',
	'hiker-gen1', 'hiker-gen1rb', 'hiker-gen2', 'hiker-gen3', 'hiker-gen3rs', 'hiker-gen4', 'hiker',
	'hilbert-wonderlauncher', 'hilbert',
	'hilda-wonderlauncher', 'hilda',
	'hooligans',
	'hoopster',
	'hugh',
	'idol',
	'infielder',
	'ingo',
	'interviewers-gen3',
	'interviewers',
	'iris-gen5bw2', 'iris',
	'janine-gen2', 'janine',
	'janitor',
	'jasmine-gen2', 'jasmine',
	'jessiejames-gen1',
	'jogger',
	'jrtrainerf-gen1', 'jrtrainerf-gen1rb',
	'jrtrainer-gen1', 'jrtrainer-gen1rb',
	'juan-gen3',
	'juan',
	'juggler-gen1', 'juggler-gen1rb', 'juggler-gen2', 'juggler-gen3', 'juggler',
	'juniper',
	'jupiter',
	'karen-gen2', 'karen',
	'kimonogirl-gen2', 'kimonogirl',
	'kindler-gen3',
	'koga-gen1', 'koga-gen2', 'koga-gen1rb', 'koga-gen3', 'koga',
	'kris-gen2',
	'lady-gen3', 'lady-gen3rs', 'lady-gen4', 'lady',
	'lance-gen1', 'lance-gen1rb', 'lance-gen2', 'lance-gen3', 'lance',
	'lass-gen1', 'lass-gen1rb', 'lass-gen2', 'lass-gen3', 'lass-gen3rs', 'lass-gen4dp', 'lass-gen4', 'lass',
	'leaf-gen3',
	'lenora',
	'linebacker',
	'li',
	'liza',
	'lorelei-gen1', 'lorelei-gen1rb', 'lorelei-gen3',
	'ltsurge-gen1', 'ltsurge-gen1rb', 'ltsurge-gen2', 'ltsurge-gen3', 'ltsurge',
	'lucas-gen4pt', 'lucas',
	'lucian',
	'lucy-gen3',
	'lyra-pokeathlon', 'lyra',
	'madame-gen4dp', 'madame-gen4', 'madame',
	'maid-gen4', 'maid',
	'marley',
	'marlon',
	'marshal',
	'mars',
	'matt-gen3',
	'maxie-gen3',
	'may-gen3', 'may-gen3rs',
	'maylene',
	'medium-gen2jp', 'medium',
	'mira',
	'misty-gen1', 'misty-gen2', 'misty-gen1rb', 'misty-gen3', 'misty',
	'morty-gen2', 'morty',
	'mrfuji-gen3',
	'musician',
	'nate-wonderlauncher', 'nate',
	'ninjaboy-gen3', 'ninjaboy',
	'noland-gen3',
	'norman-gen3', 'norman',
	'n',
	'nurse',
	'nurseryaide',
	'oak-gen1', 'oak-gen1rb', 'oak-gen2', 'oak-gen3',
	'officer-gen2',
	'oldcouple-gen3',
	'painter-gen3',
	'palmer',
	'parasollady-gen3', 'parasollady-gen4', 'parasollady',
	'petrel',
	'phoebe-gen3',
	'picnicker-gen2', 'picnicker-gen3', 'picnicker-gen3rs', 'picnicker',
	'pilot',
	'plasmagruntf-gen5bw', 'plasmagruntf',
	'plasmagrunt-gen5bw', 'plasmagrunt',
	'pokefanf-gen2', 'pokefanf-gen3', 'pokefanf-gen4', 'pokefanf',
	'pokefan-gen2', 'pokefan-gen3', 'pokefan-gen4', 'pokefan',
	'pokekid',
	'pokemaniac-gen1', 'pokemaniac-gen1rb', 'pokemaniac-gen2', 'pokemaniac-gen3', 'pokemaniac-gen3rs', 'pokemaniac',
	'pokemonbreederf-gen3', 'pokemonbreederf-gen3frlg', 'pokemonbreederf-gen4', 'pokemonbreederf',
	'pokemonbreeder-gen3', 'pokemonbreeder-gen4', 'pokemonbreeder',
	'pokemonrangerf-gen3', 'pokemonrangerf-gen3rs', 'pokemonrangerf-gen4', 'pokemonrangerf',
	'pokemonranger-gen3', 'pokemonranger-gen3rs', 'pokemonranger-gen4', 'pokemonranger',
	'policeman-gen4', 'policeman',
	'preschoolerf',
	'preschooler',
	'proton',
	'pryce-gen2', 'pryce',
	'psychicf-gen3', 'psychicf-gen3rs', 'psychicf-gen4', 'psychicfjp-gen3', 'psychicf',
	'psychic-gen1', 'psychic-gen1rb', 'psychic-gen2', 'psychic-gen3', 'psychic-gen3rs', 'psychic-gen4', 'psychic',
	'rancher',
	'red-gen1main', 'red-gen1', 'red-gen1rb', 'red-gen1title', 'red-gen2', 'red-gen3', 'red',
	'reporter',
	'richboy-gen3', 'richboy-gen4', 'richboy',
	'riley',
	'roark',
	'rocker-gen1', 'rocker-gen1rb', 'rocker-gen3',
	'rocket-gen1', 'rocket-gen1rb',
	'rocketgruntf-gen2', 'rocketgruntf',
	'rocketgrunt-gen2', 'rocketgrunt',
	'rocketexecutivef-gen2',
	'rocketexecutive-gen2',
	'rood',
	'rosa-wonderlauncher', 'rosa',
	'roughneck-gen4', 'roughneck',
	'roxanne-gen3', 'roxanne',
	'roxie',
	'ruinmaniac-gen3', 'ruinmaniac-gen3rs', 'ruinmaniac',
	'sabrina-gen1', 'sabrina-gen1rb', 'sabrina-gen2', 'sabrina-gen3', 'sabrina',
	'sage-gen2', 'sage-gen2jp', 'sage',
	'sailor-gen1', 'sailor-gen1rb', 'sailor-gen2', 'sailor-gen3jp', 'sailor-gen3', 'sailor-gen3rs', 'sailor',
	'saturn',
	'schoolboy-gen2',
	'schoolkidf-gen3', 'schoolkidf-gen4', 'schoolkidf',
	'schoolkid-gen3', 'schoolkid-gen4dp', 'schoolkid-gen4', 'schoolkid',
	'scientistf',
	'scientist-gen1', 'scientist-gen1rb', 'scientist-gen2', 'scientist-gen3', 'scientist-gen4dp', 'scientist-gen4', 'scientist',
	'shadowtriad',
	'shauntal',
	'shelly-gen3',
	'sidney-gen3',
	'silver-gen2kanto', 'silver-gen2', 'silver',
	'sisandbro-gen3', 'sisandbro-gen3rs', 'sisandbro',
	'skierf-gen4dp', 'skierf',
	'skier-gen2', 'skier',
	'skyla',
	'smasher',
	'spenser-gen3',
	'srandjr-gen3',
	'steven-gen3', 'steven',
	'striker',
	'supernerd-gen1', 'supernerd-gen1rb', 'supernerd-gen2', 'supernerd-gen3', 'supernerd',
	'swimmerf-gen2', 'swimmerf-gen3', 'swimmerf-gen3rs', 'swimmerf-gen4dp', 'swimmerf-gen4', 'swimmerfjp-gen2', 'swimmerf',
	'swimmer-gen1', 'swimmer-gen1rb', 'swimmer-gen4dp', 'swimmer-gen4jp', 'swimmer-gen4', 'swimmerm-gen2', 'swimmerm-gen3', 'swimmerm-gen3rs', 'swimmer',
	'tabitha-gen3',
	'tamer-gen1', 'tamer-gen1rb', 'tamer-gen3',
	'tateandliza-gen3',
	'tate',
	'teacher-gen2', 'teacher',
	'teamaquabeta-gen3',
	'teamaquagruntf-gen3',
	'teamaquagruntm-gen3',
	'teammagmagruntf-gen3',
	'teammagmagruntm-gen3',
	'teamrocketgruntf-gen3',
	'teamrocketgruntm-gen3',
	'teamrocket',
	'thorton',
	'triathletebikerf-gen3',
	'triathletebikerm-gen3',
	'triathleterunnerf-gen3',
	'triathleterunnerm-gen3',
	'triathleteswimmerf-gen3',
	'triathleteswimmerm-gen3',
	'tuberf-gen3', 'tuberf-gen3rs', 'tuberf',
	'tuber-gen3', 'tuber',
	'tucker-gen3',
	'twins-gen2', 'twins-gen3', 'twins-gen3rs', 'twins-gen4dp', 'twins-gen4', 'twins',
	'unknownf',
	'unknown',
	'veteranf',
	'veteran-gen4', 'veteran',
	'volkner',
	'waiter-gen4dp', 'waiter-gen4', 'waiter',
	'waitress-gen4', 'waitress',
	'wallace-gen3', 'wallace-gen3rs', 'wallace',
	'wally-gen3',
	'wattson-gen3', 'wattson',
	'whitney-gen2', 'whitney',
	'will-gen2', 'will',
	'winona-gen3', 'winona',
	'worker-gen4',
	'workerice',
	'worker',
	'yellow',
	'youngcouple-gen3', 'youngcouple-gen3rs', 'youngcouple-gen4dp', 'youngcouple',
	'youngster-gen1', 'youngster-gen1rb', 'youngster-gen2', 'youngster-gen3', 'youngster-gen3rs', 'youngster-gen4', 'youngster-gen4dp', 'youngster',
	'zinzolin',
]);

const OFFICIAL_AVATARS_BELIOT419 = new Set([
	'acerola', 'aetheremployee', 'aetheremployeef', 'aetherfoundation', 'aetherfoundationf', 'anabel-gen7',
	'beauty-gen7', 'blue-gen7', 'burnet', 'colress-gen7', 'dexio', 'elio', 'faba', 'gladion-stance',
	'gladion', 'grimsley-gen7', 'hapu', 'hau-stance', 'hau', 'hiker-gen7', 'ilima', 'kahili', 'kiawe',
	'kukui-stand', 'kukui', 'lana', 'lass-gen7', 'lillie-z', 'lillie', 'lusamine-nihilego', 'lusamine',
	'mallow', 'mina', 'molayne', 'nanu', 'officeworker', 'olivia', 'plumeria', 'pokemonbreeder-gen7',
	'pokemonbreederf-gen7', 'preschoolers', 'red-gen7', 'risingstar', 'risingstarf', 'ryuki',
	'samsonoak', 'selene', 'sightseerf', 'sina', 'sophocles', 'teacher-gen7', 'theroyal', 'wally',
	'wicke', 'youngathlete', 'youngathletef', 'youngster-gen7',
]);

const OFFICIAL_AVATARS_GNOMOWLADNY = new Set([
	'az', 'brawly-gen6', 'bryony', 'drasna', 'evelyn', 'furisodegirl-black', 'furisodegirl-pink', 'guzma',
	'hala', 'korrina', 'malva', 'nita', 'olympia', 'ramos', 'shelly', 'sidney', 'siebold', 'tierno',
	'valerie', 'viola', 'wallace-gen6', 'wikstrom', 'winona-gen6', 'wulfric', 'xerosic', 'youngn', 'zinnia',
]);

const OFFICIAL_AVATARS_BRUMIRAGE = new Set([
	'adaman', 'agatha-lgpe', 'akari', 'allister', 'archie-gen6', 'arezu', 'avery', 'ballguy', 'bea', 'bede',
	'bede-leader', 'brendan-contest', 'burnet-radar', 'calaba', 'calem', 'chase', 'cogita', 'cynthia-gen7',
	'cynthia-masters', 'diantha', 'doctor-gen8', 'elaine', 'gloria', 'gordie', 'hilda-masters2', 'hop',
	'irida', 'kabu', 'klara', 'koga-lgpe', 'leon', 'leon-tower', 'lian', 'lisia', 'lorelei-lgpe', 'magnolia',
	'mai', 'marnie', 'may-contest', 'melony', 'milo', 'mina-lgpe', 'mustard', 'mustard-master', 'nessa',
	'oleana', 'opal', 'peony', 'pesselle', 'phoebe-gen6', 'piers', 'raihan', 'rei', 'rose', 'sabi', 'sada-ai',
	'sanqua', 'shielbert', 'sonia', 'sonia-professor', 'sordward', 'sordward-shielbert', 'tateandliza-gen6',
	'turo-ai', 'victor', 'victor-dojo', 'volo', 'yellgrunt', 'yellgruntf', 'zisu', 'miku-flying', 'miku-ground',
]);

const OFFICIAL_AVATARS_ZACWEAVILE = new Set([
	'alain', 'charm', 'coin', 'courtney', 'dulse', 'elio-usum', 'emma', 'essentia', 'gloria-dojo',
	'magmagrunt', 'magmagruntf', 'marnie-league', 'morgan', 'phyco', 'selene-usum', 'shauna', 'skullgrunt',
	'skullgruntf', 'soliera', 'zossie', 'arven-v', 'dexio-gen6', 'flannery-gen6', 'green', 'grusha', 'mela',
	'norman-gen6', 'penny', 'sina-gen6', 'steven-gen6', 'atticus', 'eri', 'giacomo', 'ortega',
	'ginchiyo-conquest', 'hanbei-conquest', 'hero-conquest', 'hero2-conquest', 'heroine-conquest',
	'heroine2-conquest', 'kunoichi-conquest', 'kunoichi2-conquest', 'masamune-conquest', 'nobunaga-conquest',
	'oichi-conquest', 'ranmaru-conquest', 'serena-anime',
]);

const OFFICIAL_AVATARS_KYLEDOVE = new Set([
	'acetrainerf-gen6', 'acetrainerf-gen6xy', 'acetrainer-gen6', 'acetrainer-gen6xy', 'aquagrunt', 'aquagruntf',
	'aromalady-gen6', 'artistf-gen6', 'artist-gen6', 'artist-gen8', 'backpacker-gen6', 'backpacker-gen8',
	'battlegirl-gen6', 'battlegirl-gen6xy', 'beauty-gen6', 'beauty-gen6xy', 'beauty-gen8', 'birdkeeper-gen6',
	'blackbelt-gen6', 'blackbelt-gen8', 'bugcatcher-gen6', 'bugmaniac-gen6', 'butler', 'cabbie', 'cafemaster',
	'cameraman-gen6', 'cameraman-gen8', 'camper-gen6', 'chef', 'clerkf-gen8', 'clerk-gen8', 'collector-gen6',
	'cook', 'dancer-gen8', 'delinquent', 'doctorf-gen8', 'dragontamer-gen6', 'expertf-gen6', 'expert-gen6',
	'fairytalegirl', 'fisher-gen8', 'fisherman-gen6', 'fisherman-gen6xy', 'freediver', 'furisodegirl-blue',
	'furisodegirl-white', 'garcon', 'gardener', 'gentleman-gen6', 'gentleman-gen6xy', 'gentleman-gen8',
	'guitarist-gen6', 'hexmaniac-gen6', 'hiker-gen6', 'hiker-gen8', 'interviewers-gen6', 'kindler-gen6', 'lady-gen6',
	'lady-gen6oras', 'lass-gen6', 'lass-gen6oras', 'lass-gen8', 'leaguestaff', 'leaguestafff', 'madame-gen6',
	'madame-gen8', 'maid-gen6', 'model-gen8', 'musician-gen8', 'ninjaboy-gen6', 'owner', 'parasollady-gen6',
	'picnicker-gen6', 'pokefanf-gen6', 'pokefanf-gen6xy', 'pokefan-gen6', 'pokefan-gen6xy', 'pokekidf-gen8',
	'pokekid-gen8', 'pokemaniac-gen6', 'pokemonbreederf-gen6', 'pokemonbreederf-gen6xy', 'pokemonbreederf-gen8',
	'pokemonbreeder-gen6', 'pokemonbreeder-gen6xy', 'pokemonbreeder-gen8', 'pokemonrangerf-gen6', 'pokemonrangerf-gen6xy',
	'pokemonranger-gen6', 'pokemonranger-gen6xy', 'policeman-gen8', 'postman', 'preschoolerf-gen6', 'preschooler-gen6',
	'psychic-gen6', 'punkgirl', 'punkguy', 'railstaff', 'reporter-gen6', 'reporter-gen8', 'richboy-gen6', 'richboy-gen6xy',
	'risingstarf-gen6', 'risingstar-gen6', 'rollerskater', 'rollerskaterf', 'ruinmaniac-gen6', 'sailor-gen6', 'schoolboy',
	'schoolgirl', 'schoolkidf-gen6', 'schoolkidf-gen8', 'schoolkid-gen6', 'schoolkid-gen8', 'scientistf-gen6',
	'scientist-gen6', 'scubadiver', 'skytrainer', 'skytrainerf', 'streetthug', 'swimmerf2-gen6', 'swimmerf-gen6',
	'swimmerf-gen8', 'swimmer-gen6', 'swimmer-gen8', 'teammates', 'tourist', 'touristf', 'touristf2',
	'triathletebiker-gen6', 'triathleterunner-gen6', 'triathleteswimmer-gen6', 'tuberf-gen6', 'tuber-gen6', 'twins-gen6',
	'veteranf-gen6', 'veteran-gen6', 'waitress-gen6', 'worker2-gen6', 'workerf-gen8', 'worker-gen6', 'worker-gen8',
	'youngcouple-gen6', 'youngster-gen6', 'youngster-gen6xy', 'youngster-gen8',
	'acetrainer-gen7', 'acetrainerf-gen7', 'bellhop', 'blackbelt-gen7', 'collector-gen7', 'cook-gen7', 'dancer-gen7',
	'firefighter', 'fisherman-gen7', 'gentleman-gen7', 'golfer', 'janitor-gen7', 'madame-gen7', 'officeworkerf',
	'pokemoncenterlady', 'policeman-gen7', 'preschooler-gen7', 'preschoolerf-gen7', 'punkgirl-gen7', 'punkguy-gen7',
	'scientist-gen7', 'sightseer', 'surfer', 'swimmer-gen7', 'swimmerf-gen7', 'swimmerf2-gen7', 'trialguide', 'trialguidef',
	'ultraforestkartenvoy', 'veteran-gen7', 'veteranf-gen7', 'worker-gen7',
	'anthea', 'beni', 'beni-ninja', 'birch', 'blaine-lgpe', 'blue-lgpe', 'brigette', 'brock-lgpe', 'caraliss', 'cedricjuniper',
	'celio', 'charon', 'clover', 'colza', 'concordia', 'cyllene', 'dawn-contest', 'elm', 'erika-lgpe', 'fennel', 'gaeric',
	'ginter', 'giovanni-lgpe', 'grant', 'ingo-hisui', 'iscan', 'kamado', 'kamado-armor', 'kurt', 'lance-lgpe', 'lanette',
	'laventon', 'lucas-contest', 'lucy', 'lysandre', 'melli', 'misty-lgpe', 'noland', 'palina', 'plumeria-league', 'rowan',
	'roxanne-gen6', 'rye', 'sabrina-lgpe', 'scott', 'securitycorps', 'securitycorpsf', 'serena', 'sycamore', 'taohua', 'vessa',
	'anthe', 'anvin', 'burglar-lgpe', 'channeler-lgpe', 'choy', 'cynthia-anime', 'dagero', 'gentleman-lgpe', 'grace',
	'hayley', 'jasmine-contest', 'johanna-contest', 'johanna', 'mom-alola', 'mom-hoenn', 'mom-johto', 'mom-unova2', 'oak',
	'piers-league', 'psychic-lgpe', 'rosa-pokestar', 'tuli', 'worker-lgpe',
	'acerola-masters', 'bea-masters', 'blue-masters', 'brendan-masters', 'brock-masters', 'burgh-masters', 'caitlin-masters',
	'cynthia-masters2', 'cyrus-masters', 'dawn-masters', 'dawn-masters2', 'diantha-masters', 'elesa-masters', 'emmet-masters',
	'erika-masters', 'erika-masters2', 'ethan-masters', 'giovanni-masters', 'gloria-masters', 'grimsley-masters',
	'guzma-masters', 'hilbert-masters', 'hilda-masters', 'ingo-masters', 'jasmine-masters', 'korrina-masters', 'kris-masters',
	'lance-masters', 'leaf-masters', 'leon-masters', 'leon-masters2', 'lillie-masters', 'lillie-masters2', 'lillie-masters3',
	'lusamine-masters', 'lyra-masters', 'lyra-masters2', 'marnie-masters', 'marnie-masters2', 'may-masters', 'may-masters2',
	'may-masters3', 'misty-masters', 'morty-masters', 'morty-masters2', 'n-masters', 'n-masters2', 'nessa-masters',
	'raihan-masters', 'red-masters', 'rosa-masters', 'sabrina-masters', 'serena-masters', 'serena-masters2',
	'siebold-masters', 'skyla-masters', 'sonia-masters', 'steven-masters', 'steven-masters2', 'volkner-masters', 'bellis',
	'beauty-masters', 'collector-masters', 'punkgirl-masters', 'streetthug-masters', 'swimmer-masters', 'youngster-masters',
	'akari-isekai', 'allister-masters', 'arven-s', 'brassius', 'clavell-s', 'cynthia-anime2', 'cynthia-masters3', 'florian-s',
	'geeta', 'hassel', 'hilda-masters3', 'iono', 'iris-masters', 'jacq', 'juliana-s', 'katy', 'kofu', 'larry', 'miriam',
	'nemona-v', 'poppy', 'red-masters2', 'rei-isekai', 'rika', 'rosa-masters2', 'ryme', 'sada', 'stargrunt-s', 'stargrunt-v',
	'stargruntf-s', 'stargruntf-v', 'steven-masters3', 'tulip', 'turo', 'tyme', 'wally-masters', 'amelia-shuffle',
	'beauty-gen9', 'bede-masters', 'calem-masters', 'clerk-unite', 'dawn-masters3', 'dendra', 'diantha-masters2',
	'erbie-unite', 'hilbert-masters2', 'hop-masters', 'jasmine-masters2', 'lisia-masters', 'marnie-masters3', 'matt',
	'n-masters3', 'paulo-masters', 'phorus-unite', 'pokemaniac-gen9', 'serena-masters3', 'tabitha', 'tina-masters', 'trevor',
	'whitney-masters', 'youngster-gen9', 'zirco-unite', 'alec-anime', 'bodybuilder-gen9', 'bodybuilderf-gen9',
	'carmine-festival', 'carmine', 'diamondclanmember', 'dragontamer-gen9', 'elesa-masters2', 'kieran-festival', 'kieran',
	'laventon2', 'liza-masters', 'mallow-masters', 'musician-gen9', 'nemona-s', 'officeworker-gen9', 'officeworkerf-gen9',
	'pearlclanmember', 'raifort', 'saguaro', 'salvatore', 'scientist-gen9', 'shauna-masters', 'silver-masters',
	'steven-masters4', 'tate-masters', 'waiter-gen9', 'waitress-gen9',
	'acerola-masters2', 'aetherfoundation2', 'amarys', 'artist-gen9', 'backpacker-gen9', 'blackbelt-gen9', 'blue-masters2',
	'brendan-rs', 'briar', 'cabbie-gen9', 'caretaker', 'clair-masters', 'clive-v', 'cook-gen9', 'courier', 'crispin', 'cyrano',
	'delinquent-gen9', 'delinquentf-gen9', 'delinquentf2-gen9', 'drayton', 'flaregrunt', 'flaregruntf', 'florian-festival',
	'gloria-league', 'gloria-tundra', 'hau-masters', 'hiker-gen9', 'hyde', 'janitor-gen9', 'juliana-festival',
	'kieran-champion', 'lacey', 'lana-masters', 'leaf-masters2', 'liza-gen6', 'lysandre-masters', 'may-e', 'may-rs', 'miku-fire',
	'miku-grass', 'miku-psychic', 'miku-water', 'mina-masters', 'mustard-champion', 'nate-masters', 'nate-pokestar', 'ogreclan',
	'perrin', 'piers-masters', 'red-masters3', 'rosa-pokestar2', 'roxanne-masters', 'roxie-masters', 'ruffian', 'sycamore-masters',
	'tate-gen6', 'tucker', 'victor-league', 'victor-tundra', 'viola-masters', 'wallace-masters', 'worker-gen9', 'yukito-hideko',
	'aarune', 'adaman-masters', 'allister-unmasked', 'anabel', 'aquagrunt-rse', 'aquagruntf-rse', 'aquasuit', 'archie-usum',
	'arlo', 'barry-masters', 'blanche-casual', 'blanche', 'brandon', 'candela-casual', 'candela', 'candice-masters', 'christoph',
	'cliff', 'curtis', 'dana', 'gladion-masters', 'greta', 'gurkinn', 'heath', 'irida-masters', 'jamie', 'magmagrunt-rse',
	'magmagruntf-rse', 'magmasuit', 'magnus', 'mateo', 'mirror', 'mohn-anime', 'mohn', 'mom-paldea', 'mom-unova', 'mrbriney',
	'mrstone', 'nancy', 'nate-pokestar3', 'neroli', 'peony-league', 'phil', 'player-go', 'playerf-go', 'rhi', 'rita', 'river',
	'rosa-pokestar3', 'sabrina-frlg', 'selene-masters', 'sierra', 'spark-casual', 'spark', 'spenser', 'toddsnap', 'toddsnap2',
	'victor-masters', 'vince', 'wally-rse', 'willow-casual', 'willow', 'yancy', 'zinnia-masters',
	'acerola-masters3', 'bianca-masters', 'cheren-masters', 'gardenia-masters', 'nemona-masters',
]);

const OFFICIAL_AVATARS_HYOOPPA = new Set([
	'brendan', 'brendan-e', 'maxie-gen6', 'may',
]);

const OFFICIAL_AVATARS_GRAPO = new Set([
	'glacia', 'peonia', 'phoebe-masters', 'rosa-masters3', 'scottie-masters', 'skyla-masters2', 'volo-ginkgo',
]);

const OFFICIAL_AVATARS_FIFTY = new Set([
	'rose-zerosuit',
]);

const OFFICIAL_AVATARS_HORO = new Set([
	'florian-bb', 'juliana-bb', 'red-lgpe', 'liko', 'roy',
]);

const OFFICIAL_AVATARS_SELENA = new Set([
	'kris',
]);

for (const avatar of OFFICIAL_AVATARS_BELIOT419) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_GNOMOWLADNY) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_BRUMIRAGE) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_ZACWEAVILE) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_KYLEDOVE) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_HYOOPPA) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_GRAPO) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_FIFTY) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_HORO) OFFICIAL_AVATARS.add(avatar);
for (const avatar of OFFICIAL_AVATARS_SELENA) OFFICIAL_AVATARS.add(avatar);

export const commands: Chat.ChatCommands = {
	avatar(target, room, user) {
		if (!target) return this.parse(`${this.cmdToken}avatars`);
		const [maybeAvatar, silent] = target.split(',');
		const avatar = Avatars.userCanUse(user, maybeAvatar);

		if (!avatar) {
			if (silent) return false;
			this.errorReply("Unrecognized avatar - make sure you're on the right account?");
			return false;
		}

		user.avatar = avatar;
		if (user.id in customAvatars && !avatar.endsWith('xmas')) {
			Avatars.setDefault(user.id, avatar);
		}
		if (!silent) {
			this.sendReply(
				`${this.tr`Avatar changed to:`}\n` +
				Chat.html`|raw|${Avatars.img(avatar)}`
			);
			if (OFFICIAL_AVATARS_BELIOT419.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://www.deviantart.com/beliot419">Beliot419</a>)`);
			}
			if (OFFICIAL_AVATARS_GNOMOWLADNY.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}Gnomowladny)`);
			}
			if (OFFICIAL_AVATARS_BRUMIRAGE.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://twitter.com/Brumirage">Brumirage</a>)`);
			}
			if (OFFICIAL_AVATARS_ZACWEAVILE.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}ZacWeavile)`);
			}
			if (OFFICIAL_AVATARS_KYLEDOVE.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://twitter.com/DoveKyle">kyledove</a>)`);
			}
			if (OFFICIAL_AVATARS_HYOOPPA.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://twitter.com/hyo_oppa">hyo-oppa</a>)`);
			}
			if (OFFICIAL_AVATARS_GRAPO.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://twitter.com/Grapo_Sprites">Grapo</a>)`);
			}
			if (OFFICIAL_AVATARS_FIFTY.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}Fifty Shades of Rez)`);
			}
			if (OFFICIAL_AVATARS_HORO.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}Horo)`);
			}
			if (OFFICIAL_AVATARS_SELENA.has(avatar)) {
				this.sendReply(`|raw|(${this.tr`Artist: `}<a href="https://twitter.com/SelenaStar00">Selena</a>)`);
			}
		}
	},
	avatarhelp: [`/avatar [avatar name or number] - Change your trainer sprite.`],

	avatars(target, room, user) {
		this.runBroadcast();

		if (target.startsWith('#')) return this.parse(`/avatarusers ${target}`);

		const targetUser = this.broadcasting && !target ? null : this.getUserOrSelf(target);
		const targetUserids = targetUser ? new Set([targetUser.id, ...targetUser.previousIDs]) :
			target ? new Set([toID(target)]) : null;
		if (targetUserids && targetUser !== user && !user.can('alts')) {
			throw new Chat.ErrorMessage("You don't have permission to look at another user's avatars!");
		}

		const out = [];
		if (targetUserids) {
			const hasButton = !this.broadcasting && targetUser === user;
			for (const id of targetUserids) {
				const allowed = customAvatars[id]?.allowed;
				if (allowed) {
					out.push(
						<p>Custom avatars from account <strong>{id}</strong>:</p>,
						allowed.filter(Boolean).map(avatar => (
							<p>
								{hasButton ?
									<button name="send" value={`/avatar ${avatar}`} class="button">{Avatars.img(avatar!)}</button> :
									Avatars.img(avatar!)
								} {}
								<code>/avatar {avatar!.replace('#', '')}</code>
							</p>
						))
					);
				}
			}
			if (!out.length && target) {
				out.push(<p>User <strong>{toID(target)}</strong> doesn't have any custom avatars.</p>);
			}
		}
		if (!out.length) {
			out.push(<p>Custom avatars require you to be a contributor/staff or win a tournament prize.</p>);
		}

		this.sendReplyBox(<>
			{!target && [<p>
				You can <button name="avatars" class="button">change your avatar</button> by clicking on it in the {}
				<button name="openOptions" class="button" aria-label="Options"><i class="fa fa-cog"></i></button> menu in the upper {}
				right.
			</p>, <p>
				Avatars from generations other than 4-5 are hidden. You can find them in this {}
				<a href="https://play.pokemonshowdown.com/sprites/trainers/"><strong>full list of avatars</strong></a>. {}
				You can use them by typing <code>/avatar <i>[avatar's name]</i></code> into any chat. For example, {}
				<code>/avatar erika-gen2</code>.
			</p>]}
			{out}
		</>);
	},
	avatarshelp: [
		`/avatars - Explains how to change avatars.`,
		`/avatars [username] - Shows custom avatars available to a user.`,
		`!avatars - Show everyone that information. Requires: + % @ # ~`,
	],

	addavatar() {
		this.sendReply("Is this a personal avatar or a group avatar?");
		return this.parse(`/help addavatar`);
	},
	addavatarhelp: [
		`/personalavatar [username], [avatar] - Gives a user a default (personal) avatar.`,
		`/groupavatar [username], [avatar] - Gives a user an allowed (group) avatar.`,
		`/removeavatar [username], [avatar] - Removes access to an avatar from a user.`,
		`/removeavatar [username] - Removes access to all custom avatars from a user.`,
		`/moveavatars [oldname], [newname] - Moves access to all custom avatars from oldname to newname.`,
		AVATAR_FORMATS_MESSAGE,
	],

	personalavatar: 'defaultavatar',
	async defaultavatar(target, room, user) {
		this.checkCan('bypassall');
		if (!target) return this.parse(`/help defaultavatar`);
		const [inputUsername, inputAvatar] = this.splitOne(target);
		if (!Users.isUsername(inputUsername)) {
			throw new Chat.ErrorMessage(`"${inputUsername}" is not a valid username.`);
		}
		const userid = toID(inputUsername);
		const avatar = await Avatars.validate(inputAvatar, {rejectOfficial: true});

		if (!Avatars.addPersonal(userid, avatar)) {
			throw new Chat.ErrorMessage(`User "${inputUsername}" can already use avatar "${avatar}".`);
		}
		this.globalModlog('PERSONAL AVATAR', userid, avatar);
		this.sendReplyBox(<div>
			{Avatars.img(avatar)}<br />
			Added to <username class="username">{inputUsername}</username>
		</div>);
	},
	defaultavatarhelp: 'addavatarhelp',

	allowedavatar: 'allowavatar',
	groupavatar: 'allowavatar',
	async allowavatar(target, room, user) {
		this.checkCan('bypassall');
		if (!target) return this.parse(`/help defaultavatar`);
		const [inputUsername, inputAvatar] = this.splitOne(target);
		if (!Users.isUsername(inputUsername)) {
			throw new Chat.ErrorMessage(`"${inputUsername}" is not a valid username.`);
		}
		const userid = toID(inputUsername);
		const avatar = await Avatars.validate(inputAvatar, {rejectOfficial: true});

		if (!Avatars.addAllowed(userid, avatar)) {
			throw new Chat.ErrorMessage(`User "${inputUsername}" can already use avatar "${avatar}".`);
		}
		this.globalModlog('GROUP AVATAR', userid, avatar);
		this.sendReplyBox(<div>
			{Avatars.img(avatar)}<br />
			Added to <username class="username">{inputUsername}</username>
		</div>);
	},
	allowavatarhelp: 'addavatarhelp',

	denyavatar: 'removeavatar',
	disallowavatar: 'removeavatar',
	removeavatars: 'removeavatar',
	removeavatar(target, room, user) {
		this.checkCan('bypassall');
		if (!target) return this.parse(`/help defaultavatar`);
		const [inputUsername, inputAvatar] = this.splitOne(target);
		if (!Users.isUsername(inputUsername)) {
			throw new Chat.ErrorMessage(`"${inputUsername}" is not a valid username.`);
		}
		const userid = toID(inputUsername);
		const avatar = Avatars.convert(inputAvatar);

		const allowed = customAvatars[userid]?.allowed.filter(Boolean);
		if (!allowed) {
			throw new Chat.ErrorMessage(`${inputUsername} doesn't have any custom avatars.`);
		}
		if (avatar) {
			if (!Avatars.removeAllowed(userid, avatar)) {
				throw new Chat.ErrorMessage(`${inputUsername} doesn't have access to avatar "${avatar}"`);
			}
			this.globalModlog('REMOVE AVATAR', userid, avatar);
			this.sendReplyBox(<div>
				{Avatars.img(avatar)}<br />
				Removed from <username class="username">{inputUsername}</username>
			</div>);
		} else {
			// delete all
			delete customAvatars[userid];
			Avatars.save();
			this.globalModlog('REMOVE AVATARS', userid, allowed.join(','));
			this.sendReplyBox(<div>
				{allowed.map(curAvatar => [Avatars.img(curAvatar!), ' '])}<br />
				Removed from <username class="username">{inputUsername}</username>
			</div>);
		}
	},
	removeavatarhelp: 'addavatarhelp',

	async avatarusers(target, room, user) {
		target = '#' + toID(target);
		if (!Avatars.userCanUse(user, target) && !user.can('alts')) {
			throw new Chat.ErrorMessage(`You don't have access to avatar "${target}"`);
		}

		this.runBroadcast();

		const users = [];
		for (const userid in customAvatars) {
			if (customAvatars[userid].allowed.includes(target)) {
				users.push(userid);
			}
		}
		users.sort();

		if (!users.length && !await Avatars.exists(target)) {
			throw new Chat.ErrorMessage(`Unrecognized avatar "${target}"`);
		}

		this.sendReplyBox(<>
			<p>{Avatars.img(target, true)}</p>
			<p>
				<code>{target}</code><br />
				{users ? listUsers(users) : <p>No users currently allowed to use this avatar</p>}
			</p>
		</>);
	},

	moveavatars(target, room, user) {
		this.checkCan('bypassall');
		const [from, to] = target.split(',').map(toID);
		if (!from || !to) {
			return this.parse(`/help moveavatars`);
		}
		if (!customAvatars[from]?.allowed.length) {
			return this.errorReply(`That user has no avatars.`);
		}
		const existing = customAvatars[to]?.allowed.filter(Boolean);
		customAvatars[to] = {...customAvatars[from]};
		delete customAvatars[from];
		if (existing) {
			for (const avatar of existing) {
				if (!customAvatars[to].allowed.includes(avatar)) {
					customAvatars[to].allowed.push(avatar);
				}
			}
		}
		Avatars.save(true);
		this.sendReply(`Moved ${from}'s avatars to '${to}'.`);
		this.globalModlog(`MOVEAVATARS`, to, `from ${from}`);
		Avatars.tryNotify(Users.get(to));
	},
	moveavatarshelp: [
		`/moveavatars [from user], [to user] - Move all of the custom avatars from [from user] to [to user]. Requires: ~`,
	],

	async masspavatar(target, room, user) {
		this.checkCan('bypassall');

		const usernames = target.trim().split(/\s*\n|,\s*/)
			.map(username => username.endsWith('.png') ? username.slice(0, -4) : username);
		for (const username of usernames) {
			if (!Users.isUsername(username)) {
				throw new Chat.ErrorMessage(`Invalid username "${username}"`);
			}
			await Avatars.validate('#' + toID(username));
		}

		const userids = usernames.map(toID);
		for (const userid of userids) {
			const avatar = '#' + userid;
			Avatars.addPersonal(userid, avatar);
			this.globalModlog('PERSONAL AVATAR', userid, avatar);
		}
		this.sendReplyBox(<div>
			{userids.map(userid => Avatars.img('#' + userid))}<br />
			Added {userids.length} avatars
		</div>);
	},
	async massxmasavatar(target, room, user) {
		this.checkCan('bypassall');

		const usernames = target.trim().split(/\s*\n|,\s*/)
			.map(username => username.endsWith('.png') ? username.slice(0, -4) : username)
			.map(username => username.endsWith('xmas') ? username.slice(0, -4) : username);
		for (const username of usernames) {
			if (!Users.isUsername(username)) {
				throw new Chat.ErrorMessage(`Invalid username "${username}"`);
			}
			await Avatars.validate(`#${toID(username)}xmas`);
		}

		const userids = usernames.map(toID);
		for (const userid of userids) {
			const avatar = `#${userid}xmas`;
			Avatars.addAllowed(userid, avatar);
			this.globalModlog('GROUP AVATAR', userid, avatar);
		}
		this.sendReplyBox(<div>
			{userids.map(userid => Avatars.img(`#${userid}xmas`))}<br />
			Added {userids.length} avatars
		</div>);
	},
	async massgavatar(target, room, user) {
		this.checkCan('bypassall');

		const args = target.trim().split(/\s*\n|,\s*/);
		let curAvatar = '';
		const toUpdate: Record<string, Set<ID>> = Object.create(null);
		for (const arg of args) {
			if (arg.startsWith('#')) {
				curAvatar = await Avatars.validate(arg);
			} else {
				if (!curAvatar) return this.parse(`/help massgavatar`);
				if (!/[A-Za-z0-9]/.test(arg.charAt(0)) || !/[A-Za-z]/.test(arg)) {
					throw new Chat.ErrorMessage(`Invalid username "${arg}"`);
				}
				if (!toUpdate[curAvatar]) toUpdate[curAvatar] = new Set();
				toUpdate[curAvatar].add(toID(arg));
			}
		}

		const out = [];

		for (const avatar in toUpdate) {
			const newUsers = toUpdate[avatar];
			const oldUsers = new Set<ID>();
			for (const userid in customAvatars) {
				if (customAvatars[userid].allowed.includes(avatar)) {
					oldUsers.add(userid as ID);
				}
			}

			const added: ID[] = [];
			for (const newUser of newUsers) {
				if (!oldUsers.has(newUser)) {
					Avatars.addAllowed(newUser, avatar);
					added.push(newUser);
					this.globalModlog('GROUP AVATAR', newUser, avatar);
				}
			}
			const removed: ID[] = [];
			for (const oldUser of oldUsers) {
				if (!newUsers.has(oldUser)) {
					Avatars.removeAllowed(oldUser, avatar);
					removed.push(oldUser);
					this.globalModlog('REMOVE AVATAR', oldUser, avatar);
				}
			}

			out.push(<p>{Avatars.img(avatar, true)}</p>);
			out.push(<div><code>{avatar}</code></div>);
			if (added.length) out.push(<div>{oldUsers.size ? 'Added' : 'New'}: {listUsers(added)}</div>);
			if (removed.length) out.push(<div>Removed: {listUsers(removed)}</div>);
			if (!added.length && !removed.length) out.push(<div>No change</div>);
		}

		this.sendReplyBox(<>{out}</>);
		Avatars.save(true);
	},
};

Users.Avatars = Avatars;

Chat.multiLinePattern.register(
	'/massgavatar', '/masspavatar', '/massxmasavatar',
);
