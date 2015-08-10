var fs = require("fs");
var path = require("path");

var core = exports.core = {
hashColor: function(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
		r = g = b = (L * 255).toString(16);
	else {
		if (L <= 0.5)
			m2 = L * (S + 1);
		else
			m2 = L + S - L * S;
		m1 = L * 2 - m2;
		hue = H / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}


	colorCache[name] = '#' + r + g + b;
	return colorCache[name];
},

settings: {
	emoteStatus: true
},

 emoticons: {
'Kappa': 'http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-2867-src-f02f9d40f66f0840-28x28.png',
'PogChamp': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-60aa1af305e32d49-23x30.png',
'BloodTrail': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f124d3a96eff228a-41x28.png',
'BibleThump': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-f6c13c7fc0a5c93d-36x30.png',
'feelsgd': 'http://i.imgur.com/9gj1oPV.png',
'feelsbd': 'http://i.imgur.com/Ehfkalz.gif',
':(': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0101-sadsmile.gif',
':)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0100-smile.gif',
';(': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0106-crying.gif',
';)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0105-wink.gif',
':$': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0111-blush.gif',
':D': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0102-bigsmile.gif',
':*': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0109-kiss.gif',
':P': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0110-tongueout.gif',
':}': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0116-evilgrin.gif',
'(swear)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0183-swear.gif',
'hbang': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0179-headbang.gif',
'(drunk)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0175-drunk.gif',
'(tmi)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0184-tmi.gif',
'(dance)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0169-dance.gif',
'rofl': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0140-rofl.gif',
':?': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0138-thinking.gif',
':@': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0121-angry.gif',
'(party)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0123-party.gif',
':S': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0124-worried.gif',
'(call)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0129-call.gif',
'(devil)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0130-devil.gif',
'(angel)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0131-angel.gif',
'(inlove)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0115-inlove.gif',
'(y)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0148-yes.gif',
'(n)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0149-no.gif',
'(heart)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0152-heart.gif',
'(bheart)': 'http://factoryjoe.s3.amazonaws.com/emoticons/emoticon-0153-brokenheart.gif',
'pjsalt': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-18be1a297459453f-36x30.png',
'(admin)': 'http://emoticoner.com/files/emoticons/smiley_faces/admin-power-smiley-face.gif?1302011301',
'(give)': 'http://emoticoner.com/files/emoticons/smiley_faces/giveup-smiley-face.gif?1302011371',
'(dog)': 'http://emoticoner.com/files/emoticons/smiley_faces/dog-smiley-face.gif?1302011344',
'dotdot': 'http://emoticoner.com/files/emoticons/smiley_faces/dots-smiley-face.gif?1302011345',
'ban?': 'http://emoticoner.com/files/emoticons/smiley_faces/ban-smiley-face.gif?1302011308',
'(banned2)': 'http://emoticoner.com/files/emoticons/smiley_faces/banned-smiley-face.gif?1302011310',
'(banned)': 'http://emoticoner.com/files/emoticons/smiley_faces/banned2-smiley-face.gif?1302011310',
'(ho)': 'http://emoticoner.com/files/emoticons/skype_smileys/makeup-skype-smiley.gif?1301953196',
'(hi)': 'http://emoticoner.com/files/emoticons/skype_smileys/hi-skype-smiley.gif?1301953195',
'B)': 'http://emoticoner.com/files/emoticons/skype_smileys/cool-skype-smiley.gif?1301953192',
'(clap)': 'http://emoticoner.com/files/emoticons/skype_smileys/clapping-skype-smiley.gif?1301953192',
'(hump)': 'http://emoticoner.com/files/emoticons/smiley_faces/boff-smiley-face.gif?1302011321',
'(banned1)': 'http://emoticoner.com/files/emoticons/smileys/banned1-smiley.gif?1292867552',
'crtNova': 'http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3227-src-77d12eca2603dde0-28x28.png',
'crtSSoH': 'http://static-cdn.jtvnw.net/jtv_user_pictures/emoticon-3228-src-d4b613767d7259c4-28x28.png',
'SSSsss': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-5d019b356bd38360-24x24.png',
'SwiftRage': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-680b6b3887ef0d17-21x28.png',
'ResidentSleeper': 'http://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-1ddcc54d77fc4a61-28x28.png'
},

    processEmoticons: function (text) {
        var patterns = [],
            metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g,
            self = this;

        for (var i in this.emoticons) {
            if (this.emoticons.hasOwnProperty(i)) {
                patterns.push('(' + i.replace(metachars, "\\$&") + ')');
            }
        }

        return text.replace(new RegExp(patterns.join('|'), 'g'), function (match) {
            return typeof self.emoticons[match] != 'undefined' ?
                '<img src="' + self.emoticons[match] + '" title="' + match + '"/>' :
                match;
        });
    },

    processChatData: function (user, room, connection, message) {
        var match = false;
        
        for (var i in this.emoticons) {
            if (message.indexOf(i) >= 0) {
                match = true;
            }
        }
        if (!Core.settings.emoteStatus) {
		kitty = message = this.processEmoticons(message);		
		var message = Tools.escapeHTML(kitty);
		return (message);
		return;
	} else if (Core.settings.emoteStatus = true) {
        	if (!match || message.charAt(0) === '!') return true;
        	message = Tools.escapeHTML(message);
        	message = this.processEmoticons(message);
        	if (user.userid === 'legitbutton') {
        		if (user.hiding) return room.add('|raw|<div class="chat"><strong><font color="#DA9D01"><small></small><span class="username" data-name="' + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
			room.add('|raw|<div class="chat"><strong><font color="#DA9D01"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        		return false;
        	} 
        	else if (user.userid === 'thekiller99') {
        		if (user.hiding) return room.add('|raw|<div class="chat"><strong><font color="#D18010"><small></small><span class="username" data-name="' + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
			room.add('|raw|<div class="chat"><strong><font color="#D18010"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        		return false;
        	} 
        	else if (user.userid === 'shida') {
        		if (user.hiding) return room.add('|raw|<div class="chat"><strong><font color="#D4980C"><small></small><span class="username" data-name="' + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
			room.add('|raw|<div class="chat"><strong><font color="#D4980C"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        		return false;
        	} else {
        		if (user.hiding) return room.add('|raw|<div class="chat"><strong><font color="' + hashColor(user.userid)+'"><small></small><span class="username" data-name="' + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        		room.add('|raw|<div class="chat"><strong><font color="' + hashColor(user.userid)+'"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
        		return false;
        	}
	}
},        

	
};
function MD5(f) {
    function i(b, c) {
        var d, e, f, g, h;
        f = b & 2147483648;
        g = c & 2147483648;
        d = b & 1073741824;
        e = c & 1073741824;
        h = (b & 1073741823) + (c & 1073741823);
        return d & e ? h ^ 2147483648 ^ f ^ g : d | e ? h & 1073741824 ? h ^ 3221225472 ^ f ^ g : h ^ 1073741824 ^ f ^ g : h ^ f ^ g
    }

    function j(b, c, d, e, f, g, h) {
        b = i(b, i(i(c & d | ~c & e, f), h));
        return i(b << g | b >>> 32 - g, c)
    }

    function k(b, c, d, e, f, g, h) {
        b = i(b, i(i(c & e | d & ~e, f), h));
        return i(b << g | b >>> 32 - g, c)
    }

    function l(b, c, e, d, f, g, h) {
        b = i(b, i(i(c ^ e ^ d, f), h));
        return i(b << g | b >>> 32 - g, c)
    }

    function m(b, c, e, d, f, g, h) {
        b = i(b, i(i(e ^ (c | ~d),
            f), h));
        return i(b << g | b >>> 32 - g, c)
    }

    function n(b) {
        var c = "",
            e = "",
            d;
        for (d = 0; d <= 3; d++) e = b >>> d * 8 & 255, e = "0" + e.toString(16), c += e.substr(e.length - 2, 2);
        return c
    }
    var g = [],
        o, p, q, r, b, c, d, e, f = function (b) {
            for (var b = b.replace(/\r\n/g, "\n"), c = "", e = 0; e < b.length; e++) {
                var d = b.charCodeAt(e);
                d < 128 ? c += String.fromCharCode(d) : (d > 127 && d < 2048 ? c += String.fromCharCode(d >> 6 | 192) : (c += String.fromCharCode(d >> 12 | 224), c += String.fromCharCode(d >> 6 & 63 | 128)), c += String.fromCharCode(d & 63 | 128))
            }
            return c
        }(f),
        g = function (b) {
            var c, d = b.length;
            c =
                d + 8;
            for (var e = ((c - c % 64) / 64 + 1) * 16, f = Array(e - 1), g = 0, h = 0; h < d;) c = (h - h % 4) / 4, g = h % 4 * 8, f[c] |= b.charCodeAt(h) << g, h++;
            f[(h - h % 4) / 4] |= 128 << h % 4 * 8;
            f[e - 2] = d << 3;
            f[e - 1] = d >>> 29;
            return f
        }(f);
    b = 1732584193;
    c = 4023233417;
    d = 2562383102;
    e = 271733878;
    for (f = 0; f < g.length; f += 16) o = b, p = c, q = d, r = e, b = j(b, c, d, e, g[f + 0], 7, 3614090360), e = j(e, b, c, d, g[f + 1], 12, 3905402710), d = j(d, e, b, c, g[f + 2], 17, 606105819), c = j(c, d, e, b, g[f + 3], 22, 3250441966), b = j(b, c, d, e, g[f + 4], 7, 4118548399), e = j(e, b, c, d, g[f + 5], 12, 1200080426), d = j(d, e, b, c, g[f + 6], 17, 2821735955), c =
        j(c, d, e, b, g[f + 7], 22, 4249261313), b = j(b, c, d, e, g[f + 8], 7, 1770035416), e = j(e, b, c, d, g[f + 9], 12, 2336552879), d = j(d, e, b, c, g[f + 10], 17, 4294925233), c = j(c, d, e, b, g[f + 11], 22, 2304563134), b = j(b, c, d, e, g[f + 12], 7, 1804603682), e = j(e, b, c, d, g[f + 13], 12, 4254626195), d = j(d, e, b, c, g[f + 14], 17, 2792965006), c = j(c, d, e, b, g[f + 15], 22, 1236535329), b = k(b, c, d, e, g[f + 1], 5, 4129170786), e = k(e, b, c, d, g[f + 6], 9, 3225465664), d = k(d, e, b, c, g[f + 11], 14, 643717713), c = k(c, d, e, b, g[f + 0], 20, 3921069994), b = k(b, c, d, e, g[f + 5], 5, 3593408605), e = k(e, b, c, d, g[f + 10], 9, 38016083),
        d = k(d, e, b, c, g[f + 15], 14, 3634488961), c = k(c, d, e, b, g[f + 4], 20, 3889429448), b = k(b, c, d, e, g[f + 9], 5, 568446438), e = k(e, b, c, d, g[f + 14], 9, 3275163606), d = k(d, e, b, c, g[f + 3], 14, 4107603335), c = k(c, d, e, b, g[f + 8], 20, 1163531501), b = k(b, c, d, e, g[f + 13], 5, 2850285829), e = k(e, b, c, d, g[f + 2], 9, 4243563512), d = k(d, e, b, c, g[f + 7], 14, 1735328473), c = k(c, d, e, b, g[f + 12], 20, 2368359562), b = l(b, c, d, e, g[f + 5], 4, 4294588738), e = l(e, b, c, d, g[f + 8], 11, 2272392833), d = l(d, e, b, c, g[f + 11], 16, 1839030562), c = l(c, d, e, b, g[f + 14], 23, 4259657740), b = l(b, c, d, e, g[f + 1], 4, 2763975236),
        e = l(e, b, c, d, g[f + 4], 11, 1272893353), d = l(d, e, b, c, g[f + 7], 16, 4139469664), c = l(c, d, e, b, g[f + 10], 23, 3200236656), b = l(b, c, d, e, g[f + 13], 4, 681279174), e = l(e, b, c, d, g[f + 0], 11, 3936430074), d = l(d, e, b, c, g[f + 3], 16, 3572445317), c = l(c, d, e, b, g[f + 6], 23, 76029189), b = l(b, c, d, e, g[f + 9], 4, 3654602809), e = l(e, b, c, d, g[f + 12], 11, 3873151461), d = l(d, e, b, c, g[f + 15], 16, 530742520), c = l(c, d, e, b, g[f + 2], 23, 3299628645), b = m(b, c, d, e, g[f + 0], 6, 4096336452), e = m(e, b, c, d, g[f + 7], 10, 1126891415), d = m(d, e, b, c, g[f + 14], 15, 2878612391), c = m(c, d, e, b, g[f + 5], 21, 4237533241),
        b = m(b, c, d, e, g[f + 12], 6, 1700485571), e = m(e, b, c, d, g[f + 3], 10, 2399980690), d = m(d, e, b, c, g[f + 10], 15, 4293915773), c = m(c, d, e, b, g[f + 1], 21, 2240044497), b = m(b, c, d, e, g[f + 8], 6, 1873313359), e = m(e, b, c, d, g[f + 15], 10, 4264355552), d = m(d, e, b, c, g[f + 6], 15, 2734768916), c = m(c, d, e, b, g[f + 13], 21, 1309151649), b = m(b, c, d, e, g[f + 4], 6, 4149444226), e = m(e, b, c, d, g[f + 11], 10, 3174756917), d = m(d, e, b, c, g[f + 2], 15, 718787259), c = m(c, d, e, b, g[f + 9], 21, 3951481745), b = i(b, o), c = i(c, p), d = i(d, q), e = i(e, r);
    return (n(b) + n(c) + n(d) + n(e)).toLowerCase()
};
var colorCache = {};
hashColor = function (name) {
    if (colorCache[name]) return colorCache[name];

    var hash = MD5(name);
    var H = parseInt(hash.substr(4, 4), 16) % 360;
    var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
    var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

    var rgb = hslToRgb(H, S, L);
    colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
    return colorCache[name];
}

function hslToRgb(h, s, l) {
    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return {
        r: r,
        g: g,
        b: b
    }
}

function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
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

var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
		r = g = b = (L * 255).toString(16);
	else {
		if (L <= 0.5)
			m2 = L * (S + 1);
		else
			m2 = L + S - L * S;
		m1 = L * 2 - m2;
		hue = H / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}


	colorCache[name] = '#' + r + g + b;
	return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}
