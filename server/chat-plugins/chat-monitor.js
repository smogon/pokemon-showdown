'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const MONITOR_FILE = 'config/chat-plugins/chat-monitor.tsv';
const WRITE_THROTTLE_TIME = 5 * 60 * 1000;

// Substitution dictionary adapted from https://github.com/ThreeLetters/NoSwearingPlease/blob/master/index.js, licensed under MIT.
/** @type {{[k: string]: string[]}} */
const EVASION_DETECTION_SUBSTITUTIONS = {
	"a": ["a", "4", "@", "á", "â", "ã", "à", "ᗩ", "A", "ⓐ", "Ⓐ", "α", "͏", "₳", "ä", "Ä", "Ꮧ", "λ", "Δ", "Ḁ", "Ꭺ", "ǟ", "̾", "ａ", "Ａ", "ᴀ", "ɐ", "🅐", "𝐚", "𝐀", "𝘢", "𝘈", "𝙖", "𝘼", "𝒶", "𝓪", "𝓐", "𝕒", "𝔸", "𝔞", "𝔄", "𝖆", "𝕬", "🄰", "🅰", "𝒜", "𝚊", "𝙰", "ꍏ", "а"],
	"b": ["b", "8", "ᗷ", "B", "ⓑ", "Ⓑ", "в", "฿", "ḅ", "Ḅ", "Ᏸ", "ϐ", "Ɓ", "ḃ", "Ḃ", "ɮ", "ｂ", "Ｂ", "ʙ", "🅑", "𝐛", "𝐁", "𝘣", "𝘉", "𝙗", "𝘽", "𝒷", "𝓫", "𝓑", "𝕓", "𝔹", "𝔟", "𝔅", "𝖇", "𝕭", "🄱", "🅱", "𝐵", "Ⴆ", "𝚋", "𝙱", "♭", "b"],
	"c": ["c", "ç", "ᑕ", "C", "ⓒ", "Ⓒ", "¢", "͏", "₵", "ċ", "Ċ", "ፈ", "ς", "ḉ", "Ḉ", "Ꮯ", "ƈ", "̾", "ｃ", "Ｃ", "ᴄ", "ɔ", "🅒", "𝐜", "𝐂", "𝘤", "𝘊", "𝙘", "𝘾", "𝒸", "𝓬", "𝓒", "𝕔", "ℂ", "𝔠", "ℭ", "𝖈", "𝕮", "🄲", "🅲", "𝒞", "𝚌", "𝙲", "☾", "с"],
	"d": ["d", "ᗪ", "D", "ⓓ", "Ⓓ", "∂", "Đ", "ď", "Ď", "Ꮄ", "Ḋ", "Ꭰ", "ɖ", "ｄ", "Ｄ", "ᴅ", "🅓", "𝐝", "𝐃", "𝘥", "𝘋", "𝙙", "𝘿", "𝒹", "𝓭", "𝓓", "𝕕", "​", "𝔡", "𝖉", "𝕯", "🄳", "🅳", "𝒟", "ԃ", "𝚍", "𝙳", "◗", "ⅾ"],
	"e": ["e", "3", "é", "ê", "E", "ⓔ", "Ⓔ", "є", "͏", "Ɇ", "ệ", "Ệ", "Ꮛ", "ε", "Σ", "ḕ", "Ḕ", "Ꭼ", "ɛ", "̾", "ｅ", "Ｅ", "ᴇ", "ǝ", "🅔", "𝐞", "𝐄", "𝘦", "𝘌", "𝙚", "𝙀", "ℯ", "𝓮", "𝓔", "𝕖", "𝔻", "𝔢", "𝔇", "𝖊", "𝕰", "🄴", "🅴", "𝑒", "𝐸", "ҽ", "𝚎", "𝙴", "€", "е"],
	"f": ["f", "ᖴ", "F", "ⓕ", "Ⓕ", "₣", "ḟ", "Ḟ", "Ꭶ", "ғ", "ʄ", "ｆ", "Ｆ", "ɟ", "🅕", "𝐟", "𝐅", "𝘧", "𝘍", "𝙛", "𝙁", "𝒻", "𝓯", "𝓕", "𝕗", "𝔼", "𝔣", "𝔈", "𝖋", "𝕱", "🄵", "🅵", "𝐹", "ϝ", "𝚏", "𝙵", "Ϝ", "f"],
	"g": ["g", "q", "6", "9", "G", "ⓖ", "Ⓖ", "͏", "₲", "ġ", "Ġ", "Ꮆ", "ϑ", "Ḡ", "ɢ", "̾", "ｇ", "Ｇ", "ƃ", "🅖", "𝐠", "𝐆", "𝘨", "𝘎", "𝙜", "𝙂", "ℊ", "𝓰", "𝓖", "𝕘", "𝔽", "𝔤", "𝔉", "𝖌", "𝕲", "🄶", "🅶", "𝑔", "𝒢", "ɠ", "𝚐", "𝙶", "❡", "ց"],
	"h": ["h", "ᕼ", "H", "ⓗ", "Ⓗ", "н", "Ⱨ", "ḧ", "Ḧ", "Ꮒ", "ɦ", "ｈ", "Ｈ", "ʜ", "ɥ", "🅗", "𝐡", "𝐇", "𝘩", "𝘏", "𝙝", "𝙃", "𝒽", "𝓱", "𝓗", "𝕙", "𝔾", "𝔥", "𝔊", "𝖍", "𝕳", "🄷", "🅷", "𝐻", "ԋ", "𝚑", "𝙷", "♄", "h"],
	"i": ["i", "!", "l", "1", "í", "I", "ⓘ", "Ⓘ", "ι", "͏", "ł", "ï", "Ï", "Ꭵ", "ḭ", "Ḭ", "ɨ", "̾", "ｉ", "Ｉ", "ɪ", "ı", "🅘", "𝐢", "𝐈", "𝘪", "𝘐", "𝙞", "𝙄", "𝒾", "𝓲", "𝓘", "𝕚", "ℍ", "𝔦", "ℌ", "𝖎", "𝕴", "🄸", "🅸", "𝐼", "𝚒", "𝙸", "♗", "і", "¡", "|"],
	"j": ["j", "ᒍ", "J", "ⓙ", "Ⓙ", "נ", "Ꮰ", "ϳ", "ʝ", "ｊ", "Ｊ", "ᴊ", "ɾ", "🅙", "𝐣", "𝐉", "𝘫", "𝘑", "𝙟", "𝙅", "𝒿", "𝓳", "𝓙", "𝕛", "​", "𝔧", "𝖏", "𝕵", "🄹", "🅹", "𝒥", "𝚓", "𝙹", "♪", "ј"],
	"k": ["k", "K", "ⓚ", "Ⓚ", "к", "͏", "₭", "ḳ", "Ḳ", "Ꮶ", "κ", "Ƙ", "ӄ", "̾", "ｋ", "Ｋ", "ᴋ", "ʞ", "🅚", "𝐤", "𝐊", "𝘬", "𝘒", "𝙠", "𝙆", "𝓀", "𝓴", "𝓚", "𝕜", "𝕀", "𝔨", "ℑ", "𝖐", "𝕶", "🄺", "🅺", "𝒦", "ƙ", "𝚔", "𝙺", "ϰ", "k"],
	"l": ["l", "i", "1", "/", "|", "ᒪ", "L", "ⓛ", "Ⓛ", "ℓ", "Ⱡ", "ŀ", "Ŀ", "Ꮭ", "Ḷ", "Ꮮ", "ʟ", "ｌ", "Ｌ", "🅛", "𝐥", "𝐋", "𝘭", "𝘓", "𝙡", "𝙇", "𝓁", "𝓵", "𝓛", "𝕝", "𝕁", "𝔩", "​", "𝖑", "𝕷", "🄻", "🅻", "𝐿", "ʅ", "𝚕", "𝙻", "↳", "ⅼ"],
	"m": ["m", "ᗰ", "M", "ⓜ", "Ⓜ", "м", "͏", "₥", "ṃ", "Ṃ", "Ꮇ", "ϻ", "Μ", "ṁ", "Ṁ", "ʍ", "̾", "ｍ", "Ｍ", "ᴍ", "ɯ", "🅜", "𝐦", "𝐌", "𝘮", "𝘔", "𝙢", "𝙈", "𝓂", "𝓶", "𝓜", "𝕞", "𝕂", "𝔪", "𝔍", "𝖒", "𝕸", "🄼", "🅼", "𝑀", "ɱ", "𝚖", "𝙼", "♔", "ⅿ"],
	"n": ["n", "ñ", "ᑎ", "N", "ⓝ", "Ⓝ", "и", "₦", "ń", "Ń", "Ꮑ", "π", "∏", "Ṇ", "ռ", "ｎ", "Ｎ", "ɴ", "🅝", "𝐧", "𝐍", "𝘯", "𝘕", "𝙣", "𝙉", "𝓃", "𝓷", "𝓝", "𝕟", "𝕃", "𝔫", "𝔎", "𝖓", "𝕹", "🄽", "🅽", "𝒩", "ɳ", "𝚗", "𝙽", "♫", "ո"],
	"o": ["o", "0", "ó", "ô", "õ", "ú", "O", "ⓞ", "Ⓞ", "σ", "͏", "Ø", "ö", "Ö", "Ꭷ", "Θ", "ṏ", "Ṏ", "Ꮎ", "օ", "̾", "ｏ", "Ｏ", "ᴏ", "🅞", "𝐨", "𝐎", "𝘰", "𝘖", "𝙤", "𝙊", "ℴ", "𝓸", "𝓞", "𝕠", "𝕄", "𝔬", "𝔏", "𝖔", "𝕺", "🄾", "🅾", "𝑜", "𝒪", "𝚘", "𝙾", "⊙", "ο"],
	"p": ["p", "ᑭ", "P", "ⓟ", "Ⓟ", "ρ", "₱", "ṗ", "Ṗ", "Ꭾ", "Ƥ", "Ꮲ", "ք", "ｐ", "Ｐ", "ᴘ", "🅟", "𝐩", "𝐏", "𝘱", "𝘗", "𝙥", "𝙋", "𝓅", "𝓹", "𝓟", "𝕡", "ℕ", "𝔭", "𝔐", "𝖕", "𝕻", "🄿", "🅿", "𝒫", "𝚙", "𝙿", "р"],
	"q": ["q", "ᑫ", "Q", "ⓠ", "Ⓠ", "͏", "Ꭴ", "φ", "Ⴓ", "զ", "̾", "ｑ", "Ｑ", "ϙ", "ǫ", "🅠", "𝐪", "𝐐", "𝘲", "𝘘", "𝙦", "𝙌", "𝓆", "𝓺", "𝓠", "𝕢", "​", "𝔮", "𝔑", "𝖖", "𝕼", "🅀", "🆀", "𝒬", "𝚚", "𝚀", "☭", "ԛ"],
	"r": ["r", "ᖇ", "R", "ⓡ", "Ⓡ", "я", "Ɽ", "ŕ", "Ŕ", "Ꮢ", "г", "Γ", "ṙ", "Ṙ", "ʀ", "ｒ", "Ｒ", "ɹ", "🅡", "𝐫", "𝐑", "𝘳", "𝘙", "𝙧", "𝙍", "𝓇", "𝓻", "𝓡", "𝕣", "𝕆", "𝔯", "𝔒", "𝖗", "𝕽", "🅁", "🆁", "𝑅", "ɾ", "𝚛", "𝚁", "☈", "r"],
	"s": ["s", "5", "ᔕ", "S", "ⓢ", "Ⓢ", "ѕ", "͏", "₴", "ṩ", "Ṩ", "Ꮥ", "Ѕ", "Ṡ", "ֆ", "̾", "ｓ", "Ｓ", "ꜱ", "🅢", "𝐬", "𝐒", "𝘴", "𝘚", "𝙨", "𝙎", "𝓈", "𝓼", "𝓢", "𝕤", "ℙ", "𝔰", "𝔓", "𝖘", "𝕾", "🅂", "🆂", "𝒮", "ʂ", "𝚜", "𝚂", "ѕ"],
	"t": ["t", "+", "T", "ⓣ", "Ⓣ", "т", "₮", "ẗ", "Ṯ", "Ꮦ", "τ", "Ƭ", "Ꮖ", "ȶ", "ｔ", "Ｔ", "ᴛ", "ʇ", "🅣", "𝐭", "𝐓", "𝘵", "𝘛", "𝙩", "𝙏", "𝓉", "𝓽", "𝓣", "𝕥", "​", "𝔱", "𝔔", "𝖙", "𝕿", "🅃", "🆃", "𝒯", "ƚ", "𝚝", "𝚃", "☂", "t"],
	"u": ["u", "ú", "ü", "ᑌ", "U", "ⓤ", "Ⓤ", "υ", "͏", "Ʉ", "Ü", "Ꮼ", "Ʊ", "ṳ", "Ṳ", "ʊ", "̾", "ｕ", "Ｕ", "ᴜ", "🅤", "𝐮", "𝐔", "𝘶", "𝘜", "𝙪", "𝙐", "𝓊", "𝓾", "𝓤", "𝕦", "ℚ", "𝔲", "ℜ", "𝖚", "𝖀", "🅄", "🆄", "𝒰", "𝚞", "𝚄", "☋", "ս"],
	"v": ["v", "ᐯ", "V", "ⓥ", "Ⓥ", "ν", "ṿ", "Ṿ", "Ꮙ", "Ʋ", "Ṽ", "ʋ", "ｖ", "Ｖ", "ᴠ", "ʌ", "🅥", "𝐯", "𝐕", "𝘷", "𝘝", "𝙫", "𝙑", "𝓋", "𝓿", "𝓥", "𝕧", "​", "𝔳", "𝖛", "𝖁", "🅅", "🆅", "𝒱", "𝚟", "𝚅", "✓", "ⅴ"],
	"w": ["w", "ᗯ", "W", "ⓦ", "Ⓦ", "ω", "͏", "₩", "ẅ", "Ẅ", "Ꮗ", "ш", "Ш", "ẇ", "Ẇ", "Ꮃ", "ա", "̾", "ｗ", "Ｗ", "ᴡ", "ʍ", "🅦", "𝐰", "𝐖", "𝘸", "𝘞", "𝙬", "𝙒", "𝓌", "𝔀", "𝓦", "𝕨", "ℝ", "𝔴", "𝔖", "𝖜", "𝖂", "🅆", "🆆", "𝒲", "ɯ", "𝚠", "𝚆", "ԝ"],
	"x": ["x", "᙭", "X", "ⓧ", "Ⓧ", "χ", "Ӿ", "ẍ", "Ẍ", "ጀ", "ϰ", "Ж", "х", "Ӽ", "ｘ", "Ｘ", "🅧", "𝐱", "𝐗", "𝘹", "𝘟", "𝙭", "𝙓", "𝓍", "𝔁", "𝓧", "𝕩", "​", "𝔵", "𝔗", "𝖝", "𝖃", "🅇", "🆇", "𝒳", "𝚡", "𝚇", "⌘", "х"],
	"y": ["y", "Y", "ⓨ", "Ⓨ", "у", "͏", "Ɏ", "ÿ", "Ÿ", "Ꭹ", "ψ", "Ψ", "ẏ", "Ẏ", "Ꮍ", "ч", "ʏ", "̾", "ｙ", "Ｙ", "ʎ", "🅨", "𝐲", "𝐘", "𝘺", "𝘠", "𝙮", "𝙔", "𝓎", "𝔂", "𝓨", "𝕪", "𝕊", "𝔶", "𝔘", "𝖞", "𝖄", "🅈", "🆈", "𝒴", "ყ", "𝚢", "𝚈", "☿", "у"],
	"z": ["z", "ᘔ", "Z", "ⓩ", "Ⓩ", "Ⱬ", "ẓ", "Ẓ", "ፚ", "Ꮓ", "ʐ", "ｚ", "Ｚ", "ᴢ", "🅩", "𝐳", "𝐙", "𝘻", "𝘡", "𝙯", "𝙕", "𝓏", "𝔃", "𝓩", "𝕫", "𝕋", "𝔷", "𝔙", "𝖟", "𝖅", "🅉", "🆉", "𝒵", "ȥ", "𝚣", "𝚉", "☡", "z"],
};

/** @type {{[k: string]: string}} */
const EVASION_DETECTION_SUB_STRINGS = {};

for (const letter in EVASION_DETECTION_SUBSTITUTIONS) {
	EVASION_DETECTION_SUB_STRINGS[letter] = `[${EVASION_DETECTION_SUBSTITUTIONS[letter].join('')}]`;
}

/** @type {{[k: string]: [RegExp, string, string, string?, number][]}} */
let filterWords = Chat.filterWords;

/**
 * @param {string} str
 */
function constructEvasionRegex(str) {
	const buf = "\\b" +
		str.split('').map(letter => (EVASION_DETECTION_SUB_STRINGS[letter] || letter) + '+').join('\\.?') +
		"\\b";
	return new RegExp(buf, 'i');
}

/**
 * @param {string} location
 * @param {[RegExp, string, string, string?, number]} word
 * @param {string} punishment
 */
function renderEntry(location, word, punishment) {
	return `${location}\t${word[1]}\t${punishment}\t${word[2]}\t${word[4]}${word[3] ? `\t${word[3]}` : ''}\r\n`;
}

/**
 * @param {boolean} force
 */
function saveFilters(force = false) {
	FS(MONITOR_FILE).writeUpdate(() => {
		let buf = 'Location\tWord\tPunishment\tReason\tTimes\r\n';
		for (const key in Chat.monitors) {
			buf += filterWords[key].map(word => renderEntry(Chat.monitors[key].location, word, Chat.monitors[key].punishment)).join('');
		}
		return buf;
	}, {throttle: force ? 0 : WRITE_THROTTLE_TIME});
}

// Register the chat monitors used

Chat.registerMonitor('autolock', {
	location: 'EVERYWHERE',
	punishment: 'AUTOLOCK',
	label: 'Autolock',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word, reason] = line;
		const match = lcMessage.match(regex);
		if (match) {
			if (isStaff) return `${message} __[would be locked: ${word}${reason ? ` (${reason})` : ''}]__`;
			message = message.replace(/(https?):\/\//g, '$1__:__//');
			message = message.replace(/\./g, '__.__');
			if (room) {
				Punishments.autolock(user, room, 'ChatMonitor', `Filtered phrase: ${word}`, `<${room.roomid}> ${user.name}: ${message}${reason ? ` __(${reason})__` : ''}`, true);
			} else {
				this.errorReply(`Please do not say '${match[0]}'.`);
			}
			return false;
		}
	},
});

Chat.registerMonitor('publicwarn', {
	location: 'PUBLIC',
	punishment: 'WARN',
	label: 'Filtered in public',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word, reason] = line;
		const match = lcMessage.match(regex);
		if (match) {
			if (isStaff) return `${message} __[would be filtered in public: ${word}${reason ? ` (${reason})` : ''}]__`;
			this.errorReply(`Please do not say '${match[0]}'.`);
			return false;
		}
	},
});

Chat.registerMonitor('warn', {
	location: 'EVERYWHERE',
	punishment: 'WARN',
	label: 'Filtered',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word, reason] = line;
		const match = lcMessage.match(regex);
		if (match) {
			if (isStaff) return `${message} __[would be filtered: ${word}${reason ? ` (${reason})` : ''}]__`;
			this.errorReply(`Please do not say '${match[0]}'.`);
			return false;
		}
	},
});

Chat.registerMonitor('evasion', {
	location: 'EVERYWHERE',
	punishment: 'EVASION',
	label: 'Filter Evasion Detection',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word, reason] = line;

		// Many codepoints used in filter evasion detection can be decomposed
		// into multiple codepoints that are canonically equivalent to the
		// original. Perform a canonical composition on the message to detect
		// when people attempt to evade by abusing this behaviour of Unicode.
		let normalizedMessage = lcMessage.normalize('NFKC');

		// Normalize spaces and other common evasion characters to a period
		normalizedMessage = normalizedMessage.replace(/[\s-_,.]+/g, '.');

		const match = normalizedMessage.match(regex);
		if (match) {
			// Don't lock someone iff the word itself is used, and whitespace wasn't used to evade the filter,
			// in which case message (which doesn't have whitespace stripped) should also match the regex.
			if (match[0] === word && regex.test(message)) {
				if (isStaff) return `${message} __[would be filtered: ${word}${reason ? ` (${reason})` : ''}]__`;
				this.errorReply(`Do not say '${word}'.`);
				return false;
			}
			if (isStaff) return `${message} __[would be locked for filter evading: ${match[0]} (${word})]__`;
			message = message.replace(/(https?):\/\//g, '$1__:__//');
			if (room) {
				Punishments.autolock(user, room, 'FilterEvasionMonitor', `Evading filter: ${message} (${match[0]} => ${word})`, `<${room.roomid}> ${user.name}: SPOILER: \`\`${message}\`\` __(${match[0]} => ${word})__`);
			} else {
				this.errorReply(`Please do not say '${word}'.`);
			}
			return false;
		}
	},
});

Chat.registerMonitor('wordfilter', {
	location: 'EVERYWHERE',
	punishment: 'FILTERTO',
	label: 'Filtered to a different phrase',
	condition: 'notStaff',
	monitor(line, room, user, message, lcMessage, isStaff) {
		const [regex] = line;
		let match = regex.exec(message);
		while (match) {
			let filtered = line[3] || '';
			if (match[0] === match[0].toUpperCase()) filtered = filtered.toUpperCase();
			if (match[0][0] === match[0][0].toUpperCase()) filtered = `${filtered ? filtered[0].toUpperCase() : ''}${filtered.slice(1)}`;
			message = message.replace(match[0], filtered);
			match = regex.exec(message);
		}
		return message;
	},
});

Chat.registerMonitor('namefilter', {
	location: 'NAMES',
	punishment: 'WARN',
	label: 'Filtered in names',
});

Chat.registerMonitor('battlefilter', {
	location: 'BATTLES',
	punishment: 'MUTE',
	label: 'Filtered in battles',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word, reason] = line;
		const match = lcMessage.match(regex);
		if (match) {
			if (isStaff) return `${message} __[would be filtered: ${word}${reason ? ` (${reason})` : ''}]__`;
			message = message.replace(/(https?):\/\//g, '$1__:__//');
			message = message.replace(/\./g, '__.__');
			if (room) {
				room.mute(user);
				this.errorReply(`You have been muted for using a banned phrase. Please do not say '${match[0]}'.`);
				const text = `[BattleMonitor] <${room.roomid}> MUTED: ${user.name}: ${message}${reason ? ` __(${reason})__` : ''}`;
				const adminlog = Rooms.get('adminlog');
				if (adminlog) {
					adminlog.add(`|c|~|${text}`).update();
				} else {
					Monitor.log(text);
				}
			}
			return false;
		}
	},
});

Chat.registerMonitor('shorteners', {
	location: 'EVERYWHERE',
	punishment: 'SHORTENER',
	label: 'URL Shorteners',
	condition: 'notTrusted',
	monitor(line, room, user, message, lcMessage, isStaff) {
		let [regex, word] = line;
		if (regex.test(lcMessage)) {
			if (isStaff) return `${message} __[shortener: ${word}]__`;
			this.errorReply(`Please do not use URL shorteners like '${word}'.`);
			return false;
		}
	},
});

/*
 * Columns Location and Punishment use keywords. Possible values:
 *
 * Location: EVERYWHERE, PUBLIC, NAMES, BATTLES
 * Punishment: AUTOLOCK, WARN, FILTERTO, SHORTENER, MUTE, EVASION
 */
FS(MONITOR_FILE).readIfExists().then(data => {
	const lines = data.split('\n');
	loop: for (const line of lines) {
		if (!line || line === '\r') continue;
		let [location, word, punishment, reason, times, ...rest] = line.split('\t').map(param => param.trim());
		if (location === 'Location') continue;
		if (!(location && word && punishment)) continue;

		for (const key in Chat.monitors) {
			if (Chat.monitors[key].location === location && Chat.monitors[key].punishment === punishment) {
				const filterTo = rest[0];
				let regex;
				if (punishment === 'EVASION') {
					regex = constructEvasionRegex(word);
				} else {
					regex = new RegExp(punishment === 'SHORTENER' ? `\\b${word}` : word, filterTo ? 'ig' : 'i');
				}
				filterWords[key].push([regex, word, reason, filterTo, parseInt(times) || 0]);

				continue loop;
			}
		}
		throw new Error(`Unrecognized [location, punishment] pair for filter word entry: ${[location, word, punishment, reason, times]}`);
	}
});

/** @type {ChatFilter} */
let chatfilter = function (message, user, room) {
	// eslint-disable-next-line no-misleading-character-class
	let lcMessage = message.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD\uDB40\uDC00\uDC21]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	lcMessage = lcMessage.replace(/__|\*\*|``|\[\[|\]\]/g, '');

	const isStaffRoom = room && ((room.chatRoomData && room.roomid.endsWith('staff')) || room.roomid.startsWith('help-'));
	const isStaff = isStaffRoom || user.isStaff || !!(this.pmTarget && this.pmTarget.isStaff);

	for (const list in Chat.monitors) {
		const {location, condition, monitor} = Chat.monitors[list];
		if (!monitor) continue;
		// Ignore challenge games, which are unrated and not part of roomtours.
		if (location === 'BATTLES' && !(room && room.battle && room.battle.challengeType !== 'challenge')) continue;
		if (location === 'PUBLIC' && room && room.isPrivate === true) continue;

		switch (condition) {
		case 'notTrusted':
			if (user.trusted && !isStaffRoom) continue;
			break;
		case 'notStaff':
			if (isStaffRoom) continue;
			break;
		}

		for (const line of Chat.filterWords[list]) {
			const ret = monitor.call(this, line, room, user, message, lcMessage, isStaff);
			if (ret !== undefined && ret !== message) {
				line[4]++;
				saveFilters();
			}
			if (typeof ret === 'string') {
				message = ret;
			} else if (ret === false) {
				return false;
			}
		}
	}


	return message;
};

/** @type {NameFilter} */
let namefilter = function (name, user) {
	let id = toID(name);
	if (Chat.namefilterwhitelist.has(id)) return name;
	if (id === toID(user.trackRename)) return '';
	let lcName = name.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcName = lcName.replace('herapist', '').replace('grape', '').replace('scrape', '');

	for (const list in filterWords) {
		if (Chat.monitors[list].location === 'BATTLES') continue;
		for (let line of filterWords[list]) {
			let [regex] = line;

			if (regex.test(lcName)) {
				if (Chat.monitors[list].punishment === 'AUTOLOCK') {
					Punishments.autolock(user, /** @type {RoomID} */ ('staff'), `NameMonitor`, `inappropriate name: ${name}`, `using an inappropriate name: ${name} (from ${user.name})`, false, name);
				}
				line[4]++;
				saveFilters();
				return '';
			}
		}
	}
	return name;
};
/** @type {LoginFilter} */
let loginfilter = function (user) {
	if (user.namelocked) return;

	const forceRenamed = Chat.forceRenames.get(user.id);
	if (user.trackRename) {
		Rooms.global.notifyRooms([/** @type {RoomID} */('staff')], Chat.html`|html|[NameMonitor] Username used: <span class="username">${user.name}</span> ${user.getAccountStatusString()} (${forceRenamed ? 'automatically ' : ''}forcerenamed from <span class="username">${user.trackRename}</span>)`);
		user.trackRename = '';
	}
	if (Chat.namefilterwhitelist.has(user.id)) return;
	if (typeof forceRenamed === 'number') {
		const count = forceRenamed ? ` (forcerenamed ${forceRenamed} time${Chat.plural(forceRenamed)})` : '';
		Rooms.global.notifyRooms([/** @type {RoomID} */('staff')], Chat.html`|html|[NameMonitor] Reused name${count}: <span class="username">${user.name}</span> ${user.getAccountStatusString()}`);
	}
};
/** @type {NameFilter} */
let nicknamefilter = function (name, user) {
	let lcName = name.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcName = lcName.replace('herapist', '').replace('grape', '').replace('scrape', '');

	for (const list in filterWords) {
		if (Chat.monitors[list].location === 'BATTLES') continue;
		for (let line of filterWords[list]) {
			let [regex] = line;

			if (regex.test(lcName)) {
				if (Chat.monitors[list].punishment === 'AUTOLOCK') {
					Punishments.autolock(user, /** @type {RoomID} */ ('staff'), `NameMonitor`, `inappropriate Pokémon nickname: ${name}`, `${user.name} - using an inappropriate Pokémon nickname: ${name}`, true);
				}
				line[4]++;
				saveFilters();
				return '';
			}
		}
	}

	return name;
};
/** @type {StatusFilter} */
let statusfilter = function (status, user) {
	let lcStatus = status.replace(/\u039d/g, 'N').toLowerCase().replace(/[\u200b\u007F\u00AD]/g, '').replace(/\u03bf/g, 'o').replace(/\u043e/g, 'o').replace(/\u0430/g, 'a').replace(/\u0435/g, 'e').replace(/\u039d/g, 'e');
	// Remove false positives.
	lcStatus = lcStatus.replace('herapist', '').replace('grape', '').replace('scrape', '');
	// Check for blatant staff impersonation attempts. Ideally this could be completely generated from Config.grouplist
	// for better support for side servers, but not all ranks are staff ranks or should necessarily be filted.
	if (/\b(?:global|room|upper|senior)?\s*(?:staff|admin|administrator|leader|owner|founder|mod|moderator|driver|voice|operator|sysop|creator)\b/gi.test(lcStatus)) {
		return '';
	}

	for (const list in filterWords) {
		if (Chat.monitors[list].location === 'BATTLES') continue;
		for (let line of filterWords[list]) {
			let [regex] = line;

			if (regex.test(lcStatus)) {
				if (Chat.monitors[list].punishment === 'AUTOLOCK') {
					Punishments.autolock(user, /** @type {RoomID} */ ('staff'), `NameMonitor`, `inappropriate status message: ${status}`, `${user.name} - using an inappropriate status: ${status}`, true);
				}
				line[4]++;
				saveFilters();
				return '';
			}
		}
	}

	return status;
};

/** @type {PageTable} */
const pages = {
	filters(query, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		this.title = 'Filters';
		let buf = `<div class="pad ladder"><h2>Filters</h2>`;
		if (!this.can('lock')) return;
		let content = ``;
		for (const key in Chat.monitors) {
			content += `<tr><th colspan="2"><h3>${Chat.monitors[key].label} <span style="font-size:8pt;">[${key}]</span></h3></tr></th>`;
			if (filterWords[key].length) {
				content += filterWords[key].map(([regex, word, reason, filterTo, hits]) => {
					let entry = '';
					if (filterTo) {
						entry = `<abbr title="${reason}"><code>${word}</code></abbr> &rArr; ${filterTo}`;
					} else {
						entry = `<abbr title="${reason}">${word}</abbr>`;
					}
					return `<tr><td>${entry}</td><td>${hits}</td></tr>`;
				}).join('');
			}
		}

		if (Chat.namefilterwhitelist.size) {
			content += `<tr><th colspan="2"><h3>Whitelisted names</h3></tr></th>`;
			for (const [val] of Chat.namefilterwhitelist) {
				content += `<tr><td>${val}</td></tr>`;
			}
		}
		if (!content) {
			buf += `<p>There are no filtered words.</p>`;
		} else {
			buf += `<table>${content}</table>`;
		}
		buf += `</div>`;
		return buf;
	},
};
exports.pages = pages;

/** @type {ChatCommands} */
let commands = {
	filters: 'filter',
	filter: {
		add(target, room, user) {
			if (!this.can('rangeban')) return false;

			let [list, ...rest] = target.split(target.includes('\n') ? '\n' : ',');
			list = toID(list);

			if (!list || !rest.length) return this.errorReply("Syntax: /filter add list, word, reason");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			let word, filterTo, reasonParts;
			if (Chat.monitors[list].punishment === 'FILTERTO') {
				[word, filterTo, ...reasonParts] = rest;
				if (!filterTo) return this.errorReply(`Syntax for word filters: /filter add ${list}, regex, filter to, reason`);
			} else {
				[word, ...reasonParts] = rest;
			}

			word = word.trim();
			/** @type {RegExp} */
			let regex;
			try {
				if (Chat.monitors[list].punishment === 'EVASION') {
					regex = constructEvasionRegex(word);
				} else {
					regex = new RegExp(Chat.monitors[list].punishment === 'SHORTENER' ? `\\b${word}` : word, filterTo ? 'ig' : 'i'); // eslint-disable-line no-unused-vars
				}
			} catch (e) {
				return this.errorReply(e.message.startsWith('Invalid regular expression: ') ? e.message : `Invalid regular expression: /${word}/: ${e.message}`);
			}

			let reason = reasonParts.join(',').trim();
			if (filterWords[list].some(val => String(val[0]) === String(regex))) return this.errorReply(`${word} is already added to the ${list} list.`);
			filterWords[list].push([regex, word, reason, filterTo || null, 0]);
			if (Chat.monitors[list].punishment === 'FILTERTO') {
				this.globalModlog(`ADDFILTER`, null, `'${String(regex)} => ${filterTo}' to ${list} list by ${user.name}${reason ? ` (${reason})` : ''}`);
			} else {
				this.globalModlog(`ADDFILTER`, null, `'${word}' to ${list} list by ${user.name}${reason ? ` (${reason})` : ''}`);
			}
			saveFilters(true);
			const output = `'${word}' was added to the ${list} list.`;
			const upperStaff = Rooms.get('upperstaff');
			if (upperStaff) upperStaff.add(output).update();
			if (room.roomid !== 'upperstaff') return this.sendReply(output);
		},
		remove(target, room, user) {
			if (!this.can('rangeban')) return false;

			let [list, ...words] = target.split(target.includes('\n') ? '\n' : ',').map(param => param.trim());
			list = toID(list);

			if (!list || !words.length) return this.errorReply("Syntax: /filter remove list, words");

			if (!(list in filterWords)) return this.errorReply(`Invalid list: ${list}. Possible options: ${Object.keys(filterWords).join(', ')}`);

			const notFound = words.filter(val => !filterWords[list].filter(entry => entry[1] === val).length);
			if (notFound.length) return this.errorReply(`${notFound.join(', ')} ${Chat.plural(notFound, "are", "is")} not on the ${list} list.`);
			filterWords[list] = filterWords[list].filter(entry => !words.includes(entry[1]));

			this.globalModlog(`REMOVEFILTER`, null, `'${words.join(', ')}' from ${list} list by ${user.name}`);
			saveFilters(true);
			const output = `'${words.join(', ')}' ${Chat.plural(words, "were", "was")} removed from the ${list} list.`;
			const upperStaff = Rooms.get('upperstaff');
			if (upperStaff) upperStaff.add(output).update();
			if (room.roomid !== 'upperstaff') return this.sendReply(output);
		},
		'': 'view',
		list: 'view',
		view(target, room, user) {
			this.parse(`/join view-filters`);
		},
		help(target, room, user) {
			this.parse(`/help filter`);
		},
	},
	filterhelp: [
		`- /filter add list, word, reason - Adds a word to the given filter list. Requires: & ~`,
		`- /filter remove list, words - Removes words from the given filter list. Requires: & ~`,
		`- /filter view - Opens the list of filtered words. Requires: % @ & ~`,
	],
	allowname(target, room, user) {
		if (!this.can('forcerename')) return false;
		target = toID(target);
		if (!target) return this.errorReply(`Syntax: /allowname username`);
		Chat.namefilterwhitelist.set(target, user.name);

		const msg = `${target} was allowed as a username by ${user.name}.`;
		const staffRoom = Rooms.get('staff');
		const upperStaffRoom = Rooms.get('upperstaff');
		if (staffRoom) staffRoom.add(msg).update();
		if (upperStaffRoom) upperStaffRoom.add(msg).update();
		this.globalModlog(`ALLOWNAME`, null, `${target} by ${user.name}`);
	},
};

exports.commands = commands;
exports.chatfilter = chatfilter;
exports.namefilter = namefilter;
exports.nicknamefilter = nicknamefilter;
exports.statusfilter = statusfilter;
exports.loginfilter = loginfilter;

process.nextTick(() => {
	Chat.multiLinePattern.register('/filter (add|remove) ');
});
