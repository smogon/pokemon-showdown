function getUrlVars () {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function escapeHTML (str) {
	if (!str) return '';
	return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
}

function toId (text) {
	if (text && text.id) {
		text = text.id;
	} else if (text && text.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function get (url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4) callback(xmlHttp.responseText, xmlHttp.status);
	}
	xmlHttp.open("GET", url, true); // true for asynchronous
	xmlHttp.send(null);
}

function toggleTheme () {
	var status = localStorage.getItem('theme') || 'light';
	if (status === 'dark') {
		$('html').toggleClass('dark', false);
		localStorage.setItem('theme', 'light');
		return;
	}
	if (status === 'light'){
		$('html').toggleClass('dark', true);
		localStorage.setItem('theme', 'dark');
	}
}

function onLoad () {
	var parts = getUrlVars();
	if (!parts['file']) return document.getElementById('room').innerHTML = "Invalid URL";

	if (localStorage.getItem('theme') && localStorage.getItem('theme') === 'dark') $('html').toggleClass('dark', true);
	document.getElementById('theme').innerHTML = '<button onClick="toggleTheme()">' +
	((localStorage.getItem('theme') && localStorage.getItem('theme') !== 'light') ? 'Light mode' : 'Dark mode') + '</button>';

	get('/logs/' + parts['file'], function (res, status) {
		if (status !== 200) return document.getElementById('room').innerHTML = "Logs expired";
		var lines = res.split('\n');
		// room|date|customcolors
		var headerInfo = lines[0].split('|');
		lines.splice(0, 1);

		document.getElementById('room').innerHTML = "Room: " + escapeHTML(headerInfo[0]);
		document.getElementById('date').innerHTML = "Date: " + escapeHTML(headerInfo[1]);
		customColors = JSON.parse(headerInfo[2]);

		for (var line in lines) {
			var curLine = lines[line];
			var timestamp = curLine.substr(0, 9).trim();
			curLine = curLine.substr(9).trim();
			var lineSplit = curLine.split('|');

			switch (lineSplit[1]) {
				case 'c':
				var name = lineSplit[2];
				if (name === '~') break;
				var highlight = new RegExp("\\b" + toId(headerInfo[2]) + "\\b", 'gi');
				var div = "chat";
				if (lineSplit.slice(3).join('|').match(highlight)) div = "chat highlighted";
				lines[line] = '<div class="' + div + '"><small>[' + timestamp + ']</small> ' + '<small>' + name.substr(0,1) +
				'</small><b><font color="' + hashColor(name.substr(1)) + '">' + name.substr(1, name.length) + ':</font></b><em>' +
				parseMessage(lineSplit.slice(3).join('|')) + '</em></div>'
				break;
				case 'uhtml':
				lines[line] = '<div class="notice">' + sanitizeHTML(lineSplit.slice(3).join('|').trim()) + '</div>';
				break;
				case 'raw':
				case 'html':
				lines[line] = '<div class="notice">' + sanitizeHTML(lineSplit.slice(2).join('|').trim()) + '</div>';
				break;
				case '':
				lines[line] = '<div class="notice">' + escapeHTML(lineSplit.slice(1).join('|')) + '</div>';
				case 'j':
				case 'J':
				case 'l':
				case 'L':
				case 'N':
				case 'unlink':
				case 'userstats':
				case 'tournament':
				case 'uhtmlchange':
				lines[line] = "";
				break;
				default:
				lines[line] = '<div class="notice"><code>' + curLine + '</code></div>';
				break;
			}
		}

		document.getElementById('logs').innerHTML = lines.join('\n');
	});
}

function parseMessage (message) {
	message = escapeHTML(message).replace(/&#x2f;/g, '/');
	message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // __italics__
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // **bold**
	message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // ~~strikethrough~~
	message = message.replace(/\`\`([^< ](?:[^<`]*?[^< ])??)\`\`/g, '<code>$1</code>'); // ``code``
	message = Autolinker.link(message, {stripPrefix: false, phone: false, twitter: false});
	return message;
}

var colorCache = {};
var customColors = {};

function hashColor(name) {
	name = toId(name);
	if (customColors[name]) return customColors[name];
	if (mainCustomColors[name]) name = mainCustomColors[name];
	if (colorCache[name]) return colorCache[name];
	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360; // 0 to 360
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 40; // 40 to 89
	var L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30); // 30 to 49
	var C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	var X = C * (1 - Math.abs((H / 60) % 2 - 1));
	var m = L / 100 - C / 2;
	var R1, G1, B1;
	switch (Math.floor(H / 60)) {
		case 1: R1 = X; G1 = C; B1 = 0; break;
		case 2: R1 = 0; G1 = C; B1 = X; break;
		case 3: R1 = 0; G1 = X; B1 = C; break;
		case 4: R1 = X; G1 = 0; B1 = C; break;
		case 5: R1 = C; G1 = 0; B1 = X; break;
		case 0: default: R1 = C; G1 = X; B1 = 0; break;
	}
	var lum = (R1 + m) * 0.2126 + (G1 + m) * 0.7152 + (B1 + m) * 0.0722; // 0.05 (dark blue) to 0.93 (yellow)
	var HLmod = (lum - 0.5) * -100; // -43 (yellow) to 45 (dark blue)
	if (HLmod > 12) HLmod -= 12;
	else if (HLmod < -10) HLmod = (HLmod + 10) * 2 / 3;
	else HLmod = 0;
	L += HLmod;
	var Smod = 10 - Math.abs(50 - L);
	if (HLmod > 15) Smod += (HLmod - 15) / 2;
	S -= Smod;
	var rgb = hslToRgb(H, S, L);
	colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
	return colorCache[name];
}

function hslToRgb(h, s, l) {
	var r, g, b, m, c, x;
	if (!isFinite(h)) h = 0;
	if (!isFinite(s)) s = 0;
	if (!isFinite(l)) l = 0;
	h /= 60;
	if (h < 0) h = 6 - (-h % 6);
	h %= 6;
	s = Math.max(0, Math.min(1, s / 100));
	l = Math.max(0, Math.min(1, l / 100));
	c = (1 - Math.abs((2 * l) - 1)) * s;
	x = c * (1 - Math.abs((h % 2) - 1));
	if (h < 1) {
		r = c;
		g = x;
		b = 0;
	} else if (h < 2) {
		r = x;
		g = c;
		b = 0;
	} else if (h < 3) {
		r = 0;
		g = c;
		b = x;
	} else if (h < 4) {
		r = 0;
		g = x;
		b = c;
	} else if (h < 5) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}
	m = l - c / 2;
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	return {
		r: r,
		g: g,
		b: b,
	};
}

function rgbToHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B);
}

function toHex(N) {
	if (N == null) return "00";
	N = parseInt(N);
	if (N == 0 || isNaN(N)) return "00";
	N = Math.max(0, N);
	N = Math.min(N, 255);
	N = Math.round(N);
	return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}

function MD5 (f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
	f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
		d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
		j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
		d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
		e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
		b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()}

		sanitizeHTML = (function () {
			/*if (!('html4' in window)) {
			return function () {
			throw new Error('sanitizeHTML requires caja');
		};
	}*/
	// Add <marquee> and <blink> to the whitelist.
	// See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee
	// for the list of attributes.
	$.extend(html4.ELEMENTS, {
		'marquee': 0,
		'blink': 0
	});
	$.extend(html4.ATTRIBS, {
		'marquee::behavior': 0,
		'marquee::bgcolor': 0,
		'marquee::direction': 0,
		'marquee::height': 0,
		'marquee::hspace': 0,
		'marquee::loop': 0,
		'marquee::scrollamount': 0,
		'marquee::scrolldelay': 0,
		'marquee::truespeed': 0,
		'marquee::vspace': 0,
		'marquee::width': 0
	});

	var uriRewriter = function (uri) {
		return uri;
	};
	var tagPolicy = function (tagName, attribs) {
		if (html4.ELEMENTS[tagName] & html4.eflags['UNSAFE']) {
			return;
		}
		var targetIdx, srcIdx;
		if (tagName === 'a') {
			// Special handling of <a> tags.

			for (var i = 0; i < attribs.length - 1; i += 2) {
				switch (attribs[i]) {
					case 'target':
					targetIdx = i + 1;
					break;
				}
			}
		}
		var dataUri = '';
		if (tagName === 'img') {
			for (var i = 0; i < attribs.length - 1; i += 2) {
				if (attribs[i] === 'src' && attribs[i + 1].substr(0, 11) === 'data:image/') {
					srcIdx = i;
					dataUri = attribs[i + 1];
				}
				if (attribs[i] === 'src' && attribs[i + 1].substr(0, 2) === '//') {
					if (location.protocol !== 'http:' && location.protocol !== 'https:') {
						attribs[i + 1] = 'http:' + attribs[i + 1];
					}
				}
			}
		}
		attribs = html.sanitizeAttribs(tagName, attribs, uriRewriter);
		if (dataUri && tagName === 'img') {
			attribs[srcIdx + 1] = dataUri;
		}
		if (tagName === 'a' || tagName === 'form') {
			if (targetIdx !== undefined) {
				attribs[targetIdx] = '_blank';
			} else {
				attribs.push('target');
				attribs.push('_blank');
			}
		}
		return {attribs: attribs};
	};
	return function (input) {
		return html.sanitizeWithPolicy(getString(input), tagPolicy);
	};
})()

function getString (str) {
	if (typeof str === 'string' || typeof str === 'number') return '' + str;
	return '';
}

// from http://play.pokemonshowdown.com/js/config.js
var mainCustomColors = {
	'theimmortal': 'taco',
	'bmelts': 'testmelts',
	'zarel': 'aeo',
	'zarell': 'aeo',
	'greatsage': 'test454',
	// 'snowflakes': 'snowflake',
	'jumpluff': 'zacchaeus',
	'zacchaeus': 'jumpluff',
	'kraw': 'kraw1',
	'growlithe': 'steamroll',
	'snowflakes': 'endedinariot',
	'doomvendingmachine': 'theimmortal',
	'mikel': 'mikkel',
	'arcticblast': 'rsem',
	'mjb': 'thefourthchaser',
	'thefourthchaser': 'mjb',
	'tfc': 'mjb',
	'mikedecishere': 'mikedec3boobs',
	'heartsonfire': 'haatsuonfaiyaa',
	'royalty': 'wonder9',
	// 'osiris': 'yamraiha',
	'limi': 'azure2',
	'haunter': 'cathy',
	'ginganinja': 'piratesandninjas',
	'aurora': 'c6n6fek',
	'jdarden': 'danielcross',
	'solace': 'amorlan',
	'dcae': 'galvatron',
	'queenofrandoms': 'hahaqor',
	'jelandee': 'thejelandee',
	'diatom': 'dledledlewhooop',
	// 'waterbomb': 'wb0',
	'texascloverleaf': 'aggronsmash',
	'treecko': 'treecko56',
	'treecko37': 'treecko56',
	'violatic': 'violatic92',
	'exeggutor': 'ironmanatee',
	'ironmanatee': 'exeggutor',
	// 'shamethat': 'aaa10',
	'skylight': 'aerithass',
	// 'prem': 'premisapieceofshit',
	'goddessbriyella': 'jolteonxvii', // third color change
	'nekonay': 'catbot20',
	'coronis': 'kowonis',
	'vaxter': 'anvaxter',
	'mattl': 'mattl34',
	'shaymin': 'test33',
	// 'orphic': 'dmt6922',
	'kayo': 'endedinariot',
	'tgmd': 'greatmightydoom',
	'vacate': 'vacatetest',
	'bean': 'dragonbean',
	'yunan': 'osiris13',
	'politoed': 'brosb4hoohs',
	'scotteh': 'nsyncluvr67',
	'bumbadadabum': 'styrofoamboots',
	'yuihirasawa': 'weeabookiller',
	'monohearted': 'nighthearted',
	'prem': 'erinanakiri', // second color change
	'clefairy': 'fuckes',
	'morfent': 'aaaa',
	'crobat': 'supergaycrobat4',
	'beowulf': '298789z7z',
	'flippy': 'flippo',
	'raoulsteve247': 'raoulbuildingpc',
	'thedeceiver': 'colourtest011',
	'darnell': 'ggggggg',
	'shamethat': 'qpwkfklkjpskllj', // second color change
	'aipom': 'wdsddsdadas',
	'alter': 'spakling',
	'biggie': 'aoedoedad',
	'osiris': 'osiris12', // second color change
	'azumarill': 'azumarill69',
	'redew': 'redeww',
	'sapphire': 'masquerains',
	'calyxium': 'calyxium142',
	'kiracookie': 'kracookie',
	'blitzamirin': 'hikaruhitachii',
	'skitty': 'shckieei',
	'sweep': 'jgjjfgdfg', // second color change
	'panpawn': 'crowt',
	'val': 'pleasegivemecolorr',
	'valentine': 'pleasegivemecolorr',
	'briayan': 'haxorusxi',
	'xzern': 'mintycolors',
	'shgeldz': 'cactusl00ver',
	'abra': 'lunchawaits',
	'maomiraen': 'aaaaaa',
	'trickster': 'sunako',
	'articuno': 'bluekitteh177',
	// 'antemortem': 'abc11092345678',
	'scene': 'aspire',
	'barton': 'hollywood15',
	// 'psych': 'epicwome',
	'zodiax': 'coldeann',
	'ninetynine': 'blackkkk',
	'kasumi': 'scooter4000',
	'xylen': 'bloodyrevengebr',
	'aelita': 'y34co3',
	'fx': 'cm48ubpq',
	'horyzhnz': 'superguy69',
	'quarkz': 'quarkz345',
	'fleurdyleurse': 'calvaryfishes',
	'trinitrotoluene': '4qpr7pc5mb',
	'rekeri': 'qgadlu6g',
	'austin': 'jkjkjkjkjkgdl',
	'jinofthegale': 'cainvelasquez',
	'waterbomb': 'naninan',
	'starbloom': 'taigaaisaka',
	'macle': 'flogged',
	'ashiemore': 'poncp',
	'charles': 'charlescarmichael',
	'sigilyph': 'ek6',
	'spy': 'spydreigon',
	'kinguu': 'dodmen',
	'dodmen': 'kinguu',
	'halite': 'cjilkposqknolssss',
	'magnemite': 'dsfsdffs',
	'ace': 'sigilyph143',
	'leftiez': 'xxxxnbbhiojll',
	'grim': 'grimoiregod',
	'strength': '0v0tqpnu',
	'advantage': 'nsyncluvr67',
	'quote': 'quotecs',
	'snow': 'q21yzqgh',
	'omegaxis': 'omegaxis14',
	'paradise': 'rnxvzwpwtz',
	'sailorcosmos': 'goldmedalpas',
	'dontlose': 'dhcli22h',
	'tatsumaki': 'developmentary',
	'starry': 'starryblanket',
	'imas': 'imas234',
	'vexeniv': 'vexenx',
	'ayanosredscarf': 'ezichqog',
	'cathy': '' //{color: '#ff5cb6'}
};
