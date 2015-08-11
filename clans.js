const clanDataFile = DATA_DIR + 'clans.json';
const warLogDataFile = DATA_DIR + 'warlog.json';

var fs = require('fs');
var elo = require('./elo.js')();

if (!fs.existsSync(clanDataFile))
	fs.writeFileSync(clanDataFile, '{}');

if (!fs.existsSync(warLogDataFile))
	fs.writeFileSync(warLogDataFile, '{}');

var clans = JSON.parse(fs.readFileSync(clanDataFile).toString());
var warLog = JSON.parse(fs.readFileSync(warLogDataFile).toString());
var closedRooms = {};

exports.clans = clans;
exports.warLog = warLog;
exports.closedRooms = closedRooms;

function writeClanData() {
	fs.writeFileSync(clanDataFile, JSON.stringify(clans));
}

function writeWarLogData() {
	fs.writeFileSync(warLogDataFile, JSON.stringify(warLog));
}

function getAvaliableFormats() {
	var formats = {};
	formats[0] = "ou";
	return formats;
}

exports.getWarFormatName = function (format) {
	switch (toId(format)) {
		case 'ou': return 'OU';
		case 'ubers': return 'Ubers';
		case 'uu': return 'UU';
		case 'ru': return 'RU';
		case 'nu': return 'NU';
		case 'lc': return 'LC';
		case 'vgc2014': return 'VGC 2014';
		case 'smogondoubles': return 'Smogon Doubles';
		case 'gen5ou': return '[Gen 5] OU';
		case 'gen4ou': return '[Gen 4] OU';
		case 'gen3ou': return '[Gen 3] OU';
		case 'gen2ou': return '[Gen 2] OU';
		case 'gen1ou': return '[Gen 1] OU';
	}
	return false;
};

exports.getClans = function () {
	return Object.keys(clans).map(function (c) { return clans[c].name; });
};

exports.resetClansRank = function () {
	for (var i in clans) {
		clans[i].rating = 1000;
	}
	writeClanData();
};

exports.getClansList = function (order) {
	var clanIds = {};
	var returnData = {};
	var clansList =  Object.keys(clans).sort().join(",");
	clanIds = clansList.split(',');
	if (toId(order) === 'puntos' || toId(order) === 'rank') {
		var actualRank = -1;
		var actualclanId = false;
		for (var j in clanIds) {
			for (var f in clanIds) {
				if (clans[clanIds[f]].rating > actualRank && !returnData[clanIds[f]]) {
					actualRank = clans[clanIds[f]].rating;
					actualclanId = clanIds[f];
				}
			}
			if (actualclanId) {
				returnData[actualclanId] = 1;
				actualclanId = false;
				actualRank = -1;
			}
		}
		return returnData;
	} else if (toId(order) === 'members' || toId(order) === 'miembros') {
		var actualMembers = -1;
		var actualclanId = false;
		for (var j in clanIds) {
			for (var f in clanIds) {
				if (exports.getMembers(clanIds[f]).length > actualMembers && !returnData[clanIds[f]]) {
					actualMembers = exports.getMembers(clanIds[f]).length;
					actualclanId = clanIds[f];
				}
			}
			if (actualclanId) {
				returnData[actualclanId] = 1;
				actualclanId = false;
				actualMembers = -1;
			}
		}
		return returnData;
	} else {
		for (var g in clanIds) {
			returnData[clanIds[g]] = 1;
		}
		return returnData;
	}
};

exports.getClanName = function (clan) {
	var clanId = toId(clan);
	return clans[clanId] ? clans[clanId].name : "";
};

exports.getRating = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		ratingName: exports.ratingToName(clans[clanId].rating),
	};
};

exports.getProfile = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		ratingName: exports.ratingToName(clans[clanId].rating),
		compname: clans[clanId].compname,
		logo: clans[clanId].logo,
		lema: clans[clanId].lema,
		sala: clans[clanId].sala,
		medals: clans[clanId].medals,
	};
};

exports.getElementalData = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		compname: clans[clanId].compname,
		ratingName: exports.ratingToName(clans[clanId].rating),
		sala: clans[clanId].sala
	};
};

exports.ratingToName = function (rating) {
	if (rating > 1500)
		return "Gold";
	else if (rating > 1200)
		return "Silver";
	else
		return "Bronze";
};

exports.createClan = function (name) {
	var id = toId(name);
	if (clans[id])
		return false;

	clans[id] = {
		name: name,
		members: {},
		wins: 0,
		losses: 0,
		draws: 0,
		rating: 1000,
		//otros datos de clanes
		compname: name,
		leaders: {},
		oficials: {},
		invitations: {},
		logo: "",
		lema: "Lema del clan",
		sala: "none",
		medals: {},
	};
	writeClanData();

	return true;
};

exports.deleteClan = function (name) {
	var id = toId(name);
	if (!clans[id] || War.findClan(id))
		return false;

	delete clans[id];
	if (warLog[id]) delete warLog[id];
	writeClanData();

	return true;
};

exports.getMembers = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].members);
};

exports.getInvitations = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].invitations);
};

//colors
function hsl2rgb(h, s, l) {
	var m1, m2, hue;
	var r, g, b
	s /=100;
	l /= 100;
	if (s == 0)
		r = g = b = (l * 255);
	else {
		if (l <= 0.5)
			m2 = l * (s + 1);
		else
			m2 = l + s - l * s;
		m1 = l * 2 - m2;
		hue = h / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}
	return {r: r, g: g, b: b};
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

	return 255 * v;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

exports.MD5=function(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};

function hashColor(name) {
	var hash;
	hash = exports.MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;
	var rgb = hsl2rgb(H, S, L);
	return rgbToHex(Math.floor(rgb.r), Math.floor(rgb.g), Math.floor(rgb.b));
}
//end colors
exports.getUserDiv = function (user) {
	var userId = toId(user);
	var userk = Users.getExact(userId);
	if (!userk) {
		return '<font color="' + hashColor(userId) + '"><strong>' + userId + '</strong></font>';
	} else {
		return '<font color="' + hashColor(userId) + '"><strong>' + userk.name + '</strong></font>';
	}
};

exports.getAuthMembers = function (clan, authLevel) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var returnMembers = {};
	var returnCode = "";
	var totalMembers = 0;
	var auxVar = 0;
    for (var c in clans[clanId].members) {
		if (Clans.authMember(clanId, c) === authLevel || authLevel === "all") {
			returnMembers[c] = 1;
			totalMembers += 1;
		}
	}
	for (var m in returnMembers) {
		auxVar += 1;
		returnCode += exports.getUserDiv(m);
		if (auxVar < totalMembers) {
			returnCode += ", ";
		}
	}
	return returnCode;
};

exports.authMember = function (clan, member) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return 0;
	var userid = toId(member);
	if (clans[clanId].leaders[userid]) return 3;
	if (clans[clanId].oficials[userid] && clans[clanId].oficials[userid] === 2) return 2;
	if (clans[clanId].oficials[userid]) return 1;
	return 0;
};

exports.getOficials = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].oficials);
};

exports.getLeaders = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].leaders);
};

exports.findClanFromMember = function (user) {
	var userId = toId(user);
	for (var c in clans)
		if (clans[c].members[userId])
			return clans[c].name;
	return false;
};

exports.findClanFromRoom = function (room) {
	var roomId = toId(room);
	for (var c in clans)
		if (toId(clans[c].sala) === roomId)
			return clans[c].name;
	return false;
};

exports.setRanking = function (clan, dato) {
	dato = parseInt(dato);
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (dato > 0) {
		clans[clanId].rating = dato;
	} else {
		clans[clanId].rating = 0;
	}
	writeClanData();
	return true;
};

exports.setGxe = function (clan, wx, lx, tx) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (wx > 0) {
		clans[clanId].wins = parseInt(wx);
	} else {
		clans[clanId].wins = 0;
	}
	if (lx > 0) {
		clans[clanId].losses = parseInt(lx);
	} else {
		clans[clanId].losses = 0;
	}
	if (tx > 0) {
		clans[clanId].draws = parseInt(tx);
	} else {
		clans[clanId].draws = 0;
	}
	writeClanData();
	return true;
};

exports.setCompname = function (clan, clanTitle) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (clanTitle.length > 80) return false;
	clans[clanId].compname = clanTitle;
	writeClanData();
	return true;
};

exports.setLema = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 80) return false;
	clans[clanId].lema = text;
	writeClanData();
	return true;
};

exports.setLogo = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 200) return false;
	clans[clanId].logo = text;
	writeClanData();
	return true;
};

exports.setSala = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 80) return false;
	clans[clanId].sala = text;
	writeClanData();
	return true;
};

exports.clearInvitations = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	clans[clanId].invitations = {};
	writeClanData();
	return true;
};

exports.addMedal = function (clan, medalName, medalImage, desc) {
	var clanId = toId(clan);
	var medalId = toId(medalName);
	if (medalName.length > 80) return false;
	if (desc.length > 80) return false;
	if (!clans[clanId])
		return false;
	if (!clans[clanId].medals[medalId]) {
		clans[clanId].medals[medalId] = {
			name: medalName,
			logo: medalImage,
			desc: desc
		};
	} else {
		return false;
	}
	writeClanData();

	return true;
};

exports.deleteMedal = function (clan, medalName) {
	var clanId = toId(clan);
	var medalId = toId(medalName);
	if (!clans[clanId])
		return false;
	if (!clans[clanId].medals[medalId]) return false;
	delete clans[clanId].medals[medalId];
	writeClanData();

	return true;
};

exports.addMember = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;

	clans[clanId].members[userId] = 1;
	writeClanData();

	return true;
};

exports.addLeader = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (clans[clanId].leaders[userId]) return false;
	if (clans[clanId].oficials[userId]) {
		delete clans[clanId].oficials[userId];
	}
	clans[clanId].leaders[userId] = 1;
	writeClanData();

	return true;
};

exports.deleteLeader = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (!clans[clanId].leaders[userId]) return false;
	delete clans[clanId].leaders[userId];
	writeClanData();

	return true;
};

exports.addOficial = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (clans[clanId].oficials[userId]) return false;
	if (clans[clanId].leaders[userId]) {
		delete clans[clanId].leaders[userId];
	}
	clans[clanId].oficials[userId] = 1;
	writeClanData();

	return true;
};

exports.addSubLeader = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (clans[clanId].oficials[userId] && clans[clanId].oficials[userId] === 2) return false;
	if (clans[clanId].leaders[userId]) {
		delete clans[clanId].leaders[userId];
	}
	clans[clanId].oficials[userId] = 2;
	writeClanData();

	return true;
};

exports.deleteOficial = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (!clans[clanId].oficials[userId]) return false;
	delete clans[clanId].oficials[userId];
	writeClanData();

	return true;
};

exports.addInvite = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;
	if (clans[clanId].invitations[userId]) return false;

	clans[clanId].invitations[userId] = 1;
	writeClanData();

	return true;
};

exports.aceptInvite = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;
	if (!clans[clanId].invitations[userId]) return false;
	clans[clanId].members[userId] = 1;
	delete clans[clanId].invitations[userId];
	writeClanData();

	return true;
};

exports.removeMember = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || !clans[clanId].members[userId])
		return false;
	if (clans[clanId].oficials[userId]) {
		delete clans[clanId].oficials[userId];
	}
	if (clans[clanId].leaders[userId]) {
		delete clans[clanId].leaders[userId];
	}
	delete clans[clanId].members[userId];
	writeClanData();

	return true;
};
//warsystem

exports.getWarLogTable = function (clan) {
	var exportsTable = '<table border="1" cellspacing="0" cellpadding="3" target="_blank"><tbody><tr target="_blank"><th target="_blank">Fecha</th><th target="_blank">Tier</th><th target="_blank">Rival</th><th target="_blank">Tipo</th><th target="_blank">Resultado</th><th target="_blank">Matchups</th><th target="_blank">Puntos</th><th target="_blank">Rondas</th></tr>';
	var warLogId = toId(clan);
	if (!warLog[warLogId]) return '<b>A&uacute;n no se ha registrado ninguna War.</b>';
	var nWars = warLog[warLogId].nWarsRegistered;
	var resultName = '';
	var styleName = '';
	for (var t = 0; t < nWars; ++t) {
		exportsTable += '<tr>';
		resultName = '<font color="green">Victoria</font>';
		if (warLog[warLogId].warData[nWars - t - 1].scoreB > warLog[warLogId].warData[nWars - t - 1].scoreA) resultName = '<font color="red">Derrota</font>';
		if (warLog[warLogId].warData[nWars - t - 1].scoreB === warLog[warLogId].warData[nWars - t - 1].scoreA) resultName = '<font color="orange">Empate</font>';
		styleName = toId(warLog[warLogId].warData[nWars - t - 1].warStyle);
		if (styleName === "standard") styleName = "Standard";
		if (styleName === "total") styleName = "Total";
		if (styleName === "lineups") styleName = "Cl&aacute;sica";
		exportsTable += '<td align="center">' + warLog[warLogId].warData[nWars - t - 1].dateWar + '</td><td align="center">' +
		exports.getWarFormatName(warLog[warLogId].warData[nWars - t - 1].warFormat) + '</td><td align="center">' +
		exports.getClanName(warLog[warLogId].warData[nWars - t - 1].against) + '</td><td align="center">' + styleName + '</td>' +
		'<td align="center">' + resultName + '</td><td align="center">' + warLog[warLogId].warData[nWars - t - 1].scoreA + ' - ' +
		warLog[warLogId].warData[nWars - t - 1].scoreB + '</td><td align="center">' + warLog[warLogId].warData[nWars - t - 1].addPoints +
		'</td><td align="center">Ronda ' + warLog[warLogId].warData[nWars - t - 1].warRound + '</td>';
		
		exportsTable += '</tr>';
	}
	exportsTable += '</tbody></table>';
	return exportsTable;
};

exports.logWarData = function (clanA, clanB, scoreA, scoreB, warStyle, warFormat, addPoints, warRound) {
	var warId = toId(clanA);
	var f = new Date();
	var dateWar = f.getDate() + '-' + f.getMonth() + ' ' + f.getHours() + 'h';
	if (!warLog[warId]) {
		warLog[warId] = {
			nWarsRegistered: 0,
			warData: {}
		}
	}
	if (warLog[warId].nWarsRegistered < 10) {
		warLog[warId].warData[warLog[warId].nWarsRegistered] = {
			dateWar: dateWar,
			against: clanB,
			scoreA: scoreA,
			scoreB: scoreB,
			warStyle: warStyle,
			warFormat: warFormat,
			warRound: warRound,
			addPoints: addPoints
		};
		++warLog[warId].nWarsRegistered;
	} else {
		var warDataAux = {};
		for (var t = 1; t < 10; ++t) {
			warDataAux[t - 1] = warLog[warId].warData[t];
		}
		warDataAux[9] = {
			dateWar: dateWar,
			against: clanB,
			scoreA: scoreA,
			scoreB: scoreB,
			warStyle: warStyle,
			warFormat: warFormat,
			warRound: warRound,
			addPoints: addPoints
		};
		warLog[warId].warData = warDataAux;
	}
	writeWarLogData();
	return true;
};

exports.setWarResult = function (clanA, clanB, scoreA, scoreB, warStyle, warSize) {
	var clanAId = toId(clanA);
	var clanBId = toId(clanB);
	var result = 0;
	if (!clans[clanAId] || !clans[clanBId])
		return false;
	var multip = 128;
	var addPoints = {};
	if (toId(warStyle) === "total") multip = 256;
	if (toId(warStyle) === "lineups") multip = 180;
	multip = Math.abs(multip * (Math.floor(scoreB - scoreA)));
	var oldScoreA = clans[clanAId].rating;
	var oldScoreB = clans[clanBId].rating;
	clans[clanAId].rating = parseInt(clans[clanAId].rating);
	clans[clanBId].rating = parseInt(clans[clanBId].rating); // no decimal ratings
	var clanAExpectedResult;
	var clanBExpectedResult;
	elo.setKFactor(multip);
	if (scoreA > scoreB) {
		++clans[clanAId].wins;
		++clans[clanBId].losses;
		result = 1;
		clanAExpectedResult = elo.getExpected(clans[clanAId].rating, clans[clanBId].rating);
		clans[clanAId].rating = elo.updateRating(clanAExpectedResult, result, clans[clanAId].rating);
		clanBExpectedResult = elo.getExpected(clans[clanBId].rating, clans[clanAId].rating);
		clans[clanBId].rating = elo.updateRating(clanBExpectedResult, 1 - result, clans[clanBId].rating);
	} else if (scoreB > scoreA) {
		++clans[clanAId].losses;
		++clans[clanBId].wins;
		result = 0;
		clanAExpectedResult = elo.getExpected(clans[clanAId].rating, clans[clanBId].rating);
		clans[clanAId].rating = elo.updateRating(clanAExpectedResult, result, clans[clanAId].rating);
		clanBExpectedResult = elo.getExpected(clans[clanBId].rating, clans[clanAId].rating);
		clans[clanBId].rating = elo.updateRating(clanBExpectedResult, 1 - result, clans[clanBId].rating);
	} else {
		addPoints['A'] = 0;
		addPoints['B'] = 0;
		++clans[clanAId].draws;
		++clans[clanBId].draws;
		multip = 0;
	}
	if (clans[clanAId].rating < 1000)
		clans[clanAId].rating = 1000;
	if (clans[clanBId].rating < 1000)
		clans[clanBId].rating = 1000;
	writeClanData();
	addPoints['A'] = clans[clanAId].rating - oldScoreA;
	addPoints['B'] = clans[clanBId].rating - oldScoreB;
	return addPoints;
};

exports.isRoomClosed = function (room, user) {
	var roomId = toId(room);
	if (!closedRooms[roomId]) return false;
	var clan = exports.findClanFromMember(user);
	if (!clan) return true;
	var clanId = toId(clan);
	if (!clans[clanId]) return true;
	if (closedRooms[roomId] === clanId) return false;
	return true;
};

exports.closeRoom = function (room, clan) {
	var clanId = toId(clan);
	var roomId = toId(room);
	if (!clans[clanId]) return false;
	if (toId(clans[clanId].sala) !== roomId) return false;
	if (closedRooms[roomId]) return false;
	closedRooms[roomId] = clanId;
	return true;
};

exports.openRoom = function (room, clan) {
	var clanId = toId(clan);
	var roomId = toId(room);
	if (!clans[clanId]) return false;
	if (toId(clans[clanId].sala) !== roomId) return false;
	if (!closedRooms[roomId]) return false;
	delete closedRooms[roomId];
	return true;
};

exports.resetWarLog = function () {
	warLog = {};
	exports.warLog = warLog;
	writeWarLogData();
};
