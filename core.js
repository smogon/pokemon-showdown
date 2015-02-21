/**
 * Core
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * This is where essential core infrastructure of
 * Pokemon Showdown extensions for private servers.
 * Core contains standard streams, profile infrastructure,
 * elo rating calculations, and polls infrastructure.
 *
 * @license MIT license
 */

var fs = require("fs");
var path = require("path");

var core = exports.core = {

	stdin: function (file, name) {
		var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');

		var len = data.length;
		while (len--) {
			if (!data[len]) continue;
			var parts = data[len].split(',');
			if (parts[0].toLowerCase() === name) {
				return parts[1];
			}
		}
		return 0;
	},

	stdout: function (file, name, info, callback) {
		var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');
		var match = false;

		var len = data.length;
		while (len--) {
			if (!data[len]) continue;
			var parts = data[len].split(',');
			if (parts[0] === name) {
				data = data[len];
				match = true;
				break;
			}
		}

		if (match === true) {
			var re = new RegExp(data, 'g');
			fs.readFile('config/' + file + '.csv', 'utf8', function (err, data) {
				if (err) return console.log(err);

				var result = data.replace(re, name + ',' + info);
				fs.writeFile('config/' + file + '.csv', result, 'utf8', function (err) {
					if (err) return console.log(err);
					typeof callback === 'function' && callback();
				});
			});
		} else {
			var log = fs.createWriteStream('config/' + file + '.csv', {
				'flags': 'a'
			});
			log.write('\n' + name + ',' + info);
			typeof callback === 'function' && callback();
		}
	},

	profile: {

		color: '#2ECC40',

		avatarurl: 'http://cbc.pokecommunity.com/config',

		avatar: function (online, user, img) {
			if (online === true) {
				if (typeof (img) === typeof ('')) {
					return '<img src="' + this.avatarurl + '/avatars/' + img + '" width="80" height="80" align="left">';
				}
				return '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + img + '.png" width="80" height="80" align="left">';
			}
			for (var name in Config.customAvatars) {
				if (user === name) {
					return '<img src="' + this.avatarurl + '/avatars/' + Config.customAvatars[name] + '" width="80" height="80" align="left">';
				}
			}
			var trainersprites = [1, 2, 101, 102, 169, 170, 265, 266, 168];
			return '<img src="http://play.pokemonshowdown.com/sprites/trainers/' + trainersprites[Math.floor(Math.random() * trainersprites.length)] + '.png" width="80" height="80" align="left">';
		},

		name: function (online, user) {
			if (online === true) {
				return '&nbsp;<strong><font color="' + this.color + '">Name:</font></strong>&nbsp;' + user.name;
			}
			return '&nbsp;<strong><font color="' + this.color + '">Name:</font></strong>&nbsp;' + user;
		},

		group: function (online, user) {
			if (online === true) {
				if (user.group === ' ') {
					return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + 'Regular User';
				}
				return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + Config.groups[user.group].name;
			}
			var g = Core.stdin('usergroups', user);
			if (g === 0) {
				return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + 'Regular User';
			}
			return '<br>&nbsp;<strong><font color="' + this.color + '">Group:</font></strong>&nbsp;' + Config.groups[g].name;
		},

		title: function (user) {
			return Core.stdin('title', user);
		},

		bp: function (user) {
			return Core.stdin('bp', user);
		},

		tourWins: function (user) {
			return Core.stdin('tourWins', user);
		},

		display: function (args, info) {
			if (args === 'title') return '<div class="profile-title">&nbsp;' + info + '</div>';
			if (args === 'bp') return '<br>&nbsp;<strong><font color="' + this.color + '">Battle Points:</font></strong>&nbsp;' + info;
			if (args === 'tourWins') return '<br>&nbsp;<strong><font color="' + this.color + '">Tournament Wins:</font></strong>&nbsp;' + info;
		},

	},

	ladder: function (limit) {
		var data = fs.readFileSync('config/tourWins.csv', 'utf-8');
		var row = ('' + data).split("\n");

		var list = [];

		for (var i = row.length; i > -1; i--) {
			if (!row[i] || row[i].indexOf(',') < 0) continue;
			var parts = row[i].split(",");
			list.push([toId(parts[0]), Number(parts[1])]);
		}

		list.sort(function (a, b) {
			return a[1] - b[1];
		});

		if (list.length > 1) {
			var ladder = '<table border="1" cellspacing="0" cellpadding="3"><tbody><tr><th>Rank</th><th>User</th><th>Tournament Wins</th></tr>';
			var len = list.length;

			limit = len - limit;
			if (limit > len) limit = len;

			while (len--) {
				ladder = ladder + '<tr><td>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td>' + Math.floor(list[len][1]) + '</td></tr>';
				if (len === limit) break;
			}
			ladder += '</tbody></table>';
			return ladder;
		}
		return 0;
	},

	shop: function (showDisplay) {
		var shop = [
			['Star', 'Buy a \u2606 to go in front of your name and puts you at the top of the user list. (Goes away if you leave for more than one hour or the server restarts.)', 2],
			['Fix', 'Buy the ability to alter your current custom avatar. (Don\'t buy if you don\'t have a custom avatar.)', 15],
			['Title', 'Buy a user title for your profile. (Can be seen via "/profile username". Check "/profile wolf" for an example.)', 20],
			['Poof', 'Buy a poof message to be added into your pool of possible poofs. Poofs are custom leave messages.', 25],
			['Avatar', 'Buy a custom avatar to be applied to your name. (You supply. Images larger than 80x80 may not show correctly.)', 40]
		];

		if (showDisplay === false) {
			return shop;
		}

		var s = '<div class="broadcast-lobby"><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Command</th><th>Description</th><th>Cost</th></tr>';
		var start = 0;
		while (start < shop.length) {
			s = s + '<tr><td>' + shop[start][0] + '</td><td>' + shop[start][1] + '</td><td>' + shop[start][2] + '</td></tr>';
			start++;
		}
		s += '</tbody></table><center>To buy an item from the shop, use the /buy <em>command</em>.</center></div>';
		return s;
	},

	poll: function () {
		var poll = {};
		var components = {

			reset: function (roomId) {
				poll[roomId] = {
					question: undefined,
					optionList: [],
					options: {},
					display: '',
					topOption: ''
				};
			},

			splint: function (target) {
				var parts = target.split(',');
				var len = parts.length;
				while (len--) {
					parts[len] = parts[len].trim();
				}
				return parts;
			}

		};

		for (var i in components) {
			if (components.hasOwnProperty(i)) {
				poll[i] = components[i];
			}
		}

		for (var id in Rooms.rooms) {
			if (Rooms.rooms[id].type === 'chat' && !poll[id]) {
				poll[id] = {};
				poll.reset(id);
			}
		}

		return poll;
	},

	hashColor: function (name) {
		function MD5(e){function t(e,t){var n,r,i,s,o;i=e&2147483648;s=t&2147483648;n=e&1073741824;r=t&1073741824;o=(e&1073741823)+(t&1073741823);return n&r?o^2147483648^i^s:n|r?o&1073741824?o^3221225472^i^s:o^1073741824^i^s:o^i^s}function n(e,n,r,i,s,o,u){e=t(e,t(t(n&r|~n&i,s),u));return t(e<<o|e>>>32-o,n)}function r(e,n,r,i,s,o,u){e=t(e,t(t(n&i|r&~i,s),u));return t(e<<o|e>>>32-o,n)}function i(e,n,r,i,s,o,u){e=t(e,t(t(n^r^i,s),u));return t(e<<o|e>>>32-o,n)}function s(e,n,r,i,s,o,u){e=t(e,t(t(r^(n|~i),s),u));return t(e<<o|e>>>32-o,n)}function o(e){var t="",n="",r;for(r=0;r<=3;r++)n=e>>>r*8&255,n="0"+n.toString(16),t+=n.substr(n.length-2,2);return t}var u=[],a,f,l,c,h,p,d,v,e=function(e){for(var e=e.replace(/\r\n/g,"\n"),t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):(r>127&&r<2048?t+=String.fromCharCode(r>>6|192):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128)),t+=String.fromCharCode(r&63|128))}return t}(e),u=function(e){var t,n=e.length;t=n+8;for(var r=((t-t%64)/64+1)*16,i=Array(r-1),s=0,o=0;o<n;)t=(o-o%4)/4,s=o%4*8,i[t]|=e.charCodeAt(o)<<s,o++;i[(o-o%4)/4]|=128<<o%4*8;i[r-2]=n<<3;i[r-1]=n>>>29;return i}(e);h=1732584193;p=4023233417;d=2562383102;v=271733878;for(e=0;e<u.length;e+=16)a=h,f=p,l=d,c=v,h=n(h,p,d,v,u[e+0],7,3614090360),v=n(v,h,p,d,u[e+1],12,3905402710),d=n(d,v,h,p,u[e+2],17,606105819),p=n(p,d,v,h,u[e+3],22,3250441966),h=n(h,p,d,v,u[e+4],7,4118548399),v=n(v,h,p,d,u[e+5],12,1200080426),d=n(d,v,h,p,u[e+6],17,2821735955),p=n(p,d,v,h,u[e+7],22,4249261313),h=n(h,p,d,v,u[e+8],7,1770035416),v=n(v,h,p,d,u[e+9],12,2336552879),d=n(d,v,h,p,u[e+10],17,4294925233),p=n(p,d,v,h,u[e+11],22,2304563134),h=n(h,p,d,v,u[e+12],7,1804603682),v=n(v,h,p,d,u[e+13],12,4254626195),d=n(d,v,h,p,u[e+14],17,2792965006),p=n(p,d,v,h,u[e+15],22,1236535329),h=r(h,p,d,v,u[e+1],5,4129170786),v=r(v,h,p,d,u[e+6],9,3225465664),d=r(d,v,h,p,u[e+11],14,643717713),p=r(p,d,v,h,u[e+0],20,3921069994),h=r(h,p,d,v,u[e+5],5,3593408605),v=r(v,h,p,d,u[e+10],9,38016083),d=r(d,v,h,p,u[e+15],14,3634488961),p=r(p,d,v,h,u[e+4],20,3889429448),h=r(h,p,d,v,u[e+9],5,568446438),v=r(v,h,p,d,u[e+14],9,3275163606),d=r(d,v,h,p,u[e+3],14,4107603335),p=r(p,d,v,h,u[e+8],20,1163531501),h=r(h,p,d,v,u[e+13],5,2850285829),v=r(v,h,p,d,u[e+2],9,4243563512),d=r(d,v,h,p,u[e+7],14,1735328473),p=r(p,d,v,h,u[e+12],20,2368359562),h=i(h,p,d,v,u[e+5],4,4294588738),v=i(v,h,p,d,u[e+8],11,2272392833),d=i(d,v,h,p,u[e+11],16,1839030562),p=i(p,d,v,h,u[e+14],23,4259657740),h=i(h,p,d,v,u[e+1],4,2763975236),v=i(v,h,p,d,u[e+4],11,1272893353),d=i(d,v,h,p,u[e+7],16,4139469664),p=i(p,d,v,h,u[e+10],23,3200236656),h=i(h,p,d,v,u[e+13],4,681279174),v=i(v,h,p,d,u[e+0],11,3936430074),d=i(d,v,h,p,u[e+3],16,3572445317),p=i(p,d,v,h,u[e+6],23,76029189),h=i(h,p,d,v,u[e+9],4,3654602809),v=i(v,h,p,d,u[e+12],11,3873151461),d=i(d,v,h,p,u[e+15],16,530742520),p=i(p,d,v,h,u[e+2],23,3299628645),h=s(h,p,d,v,u[e+0],6,4096336452),v=s(v,h,p,d,u[e+7],10,1126891415),d=s(d,v,h,p,u[e+14],15,2878612391),p=s(p,d,v,h,u[e+5],21,4237533241),h=s(h,p,d,v,u[e+12],6,1700485571),v=s(v,h,p,d,u[e+3],10,2399980690),d=s(d,v,h,p,u[e+10],15,4293915773),p=s(p,d,v,h,u[e+1],21,2240044497),h=s(h,p,d,v,u[e+8],6,1873313359),v=s(v,h,p,d,u[e+15],10,4264355552),d=s(d,v,h,p,u[e+6],15,2734768916),p=s(p,d,v,h,u[e+13],21,1309151649),h=s(h,p,d,v,u[e+4],6,4149444226),v=s(v,h,p,d,u[e+11],10,3174756917),d=s(d,v,h,p,u[e+2],15,718787259),p=s(p,d,v,h,u[e+9],21,3951481745),h=t(h,a),p=t(p,f),d=t(d,l),v=t(v,c);return(o(h)+o(p)+o(d)+o(v)).toLowerCase()}function hslToRgb(e,t,n){var r,i,s,o,u,a;if(!isFinite(e))e=0;if(!isFinite(t))t=0;if(!isFinite(n))n=0;e/=60;if(e<0)e=6- -e%6;e%=6;t=Math.max(0,Math.min(1,t/100));n=Math.max(0,Math.min(1,n/100));u=(1-Math.abs(2*n-1))*t;a=u*(1-Math.abs(e%2-1));if(e<1){r=u;i=a;s=0}else if(e<2){r=a;i=u;s=0}else if(e<3){r=0;i=u;s=a}else if(e<4){r=0;i=a;s=u}else if(e<5){r=a;i=0;s=u}else{r=u;i=0;s=a}o=n-u/2;r=Math.round((r+o)*255);i=Math.round((i+o)*255);s=Math.round((s+o)*255);return{r:r,g:i,b:s}}function rgbToHex(e,t,n){return toHex(e)+toHex(t)+toHex(n)}function toHex(e){if(e==null)return"00";e=parseInt(e);if(e==0||isNaN(e))return"00";e=Math.max(0,e);e=Math.min(e,255);e=Math.round(e);return"0123456789ABCDEF".charAt((e-e%16)/16)+"0123456789ABCDEF".charAt(e%16)}var colorCache={};var hashColor=function(e){if(colorCache[e])return colorCache[e];var t=MD5(e);var n=parseInt(t.substr(4,4),16)%360;var r=parseInt(t.substr(0,4),16)%50+50;var i=parseInt(t.substr(8,4),16)%20+25;var s=hslToRgb(n,r,i);colorCache[e]="#"+rgbToHex(s.r,s.g,s.b);return colorCache[e]}
		return hashColor(name);
	},

	emoticons: {
		':arceus:': 'http://cbc.pokecommunity.com/config/emoticons/arceus.png',
		':azelf:': 'http://cbc.pokecommunity.com/config/emoticons/azelf.png',
		':bidoof:': 'http://cbc.pokecommunity.com/config/emoticons/bidoof.png',
		':castform:': 'http://cbc.pokecommunity.com/config/emoticons/castform.png',
		':charizard:': 'http://cbc.pokecommunity.com/config/emoticons/charizard.png',
		':cookie:': 'http://cbc.pokecommunity.com/config/emoticons/cookie.png',
		':gav:': 'http://cbc.pokecommunity.com/config/emoticons/gav.png',
		':gloom:': 'http://cbc.pokecommunity.com/config/emoticons/gloom.png',
		':growlithe:': 'http://cbc.pokecommunity.com/config/emoticons/growlithe.png',
		':hamster:': 'http://cbc.pokecommunity.com/config/emoticons/hamster.png',
		':helix:': 'http://cbc.pokecommunity.com/config/emoticons/helix.png',
		':hug:': 'http://cbc.pokecommunity.com/config/emoticons/hug.gif',
		':jigglypuff:': 'http://cbc.pokecommunity.com/config/emoticons/jigglypuff.png',
		':jynx:': 'http://cbc.pokecommunity.com/config/emoticons/jynx.png',
		':kappa:': 'http://cbc.pokecommunity.com/config/emoticons/kappa.png',
		':kermit:': 'http://cbc.pokecommunity.com/config/emoticons/kermit.png',
		':kreygasm:': 'http://cbc.pokecommunity.com/config/emoticons/kreygasm.png',
		':lapras:': 'http://cbc.pokecommunity.com/config/emoticons/lapras.png',
		':ludicolo:': 'http://cbc.pokecommunity.com/config/emoticons/ludicolo.png',
		':luvdisc:': 'http://cbc.pokecommunity.com/config/emoticons/luvdisc.png',
		':magikarp:': 'http://cbc.pokecommunity.com/config/emoticons/magikarp.png',
		':meganium:': 'http://cbc.pokecommunity.com/config/emoticons/meganium.png',
		':oddish:': 'http://cbc.pokecommunity.com/config/emoticons/oddish.png',
		':pjsalt:': 'http://cbc.pokecommunity.com/config/emoticons/pjsalt.png',
		':potato:': 'http://cbc.pokecommunity.com/config/emoticons/potato.png',
		':psyduck:': 'http://cbc.pokecommunity.com/config/emoticons/psyduck.png',
		':pyoshi:': 'http://cbc.pokecommunity.com/config/emoticons/pyoshi.png',
		':slowpoke:': 'http://cbc.pokecommunity.com/config/emoticons/slowpoke.png',
		':snorlax:': 'http://cbc.pokecommunity.com/config/emoticons/snorlax.png',
		':spheal:': 'http://cbc.pokecommunity.com/config/emoticons/spheal.png',
		':sri:': 'http://cbc.pokecommunity.com/config/emoticons/sri.png',
		':suicune:': 'http://cbc.pokecommunity.com/config/emoticons/suicune.png',
		':superman:': 'http://cbc.pokecommunity.com/config/emoticons/superman.png',
		':sweep:': 'http://cbc.pokecommunity.com/config/emoticons/sweep.gif',
		':vulpix:': 'http://cbc.pokecommunity.com/config/emoticons/vulpix.png',
		':wobbuffet:': 'http://cbc.pokecommunity.com/config/emoticons/wobbuffet.png',
		':wooper:': 'http://cbc.pokecommunity.com/config/emoticons/wooper.png',
		':wynaut:': 'http://cbc.pokecommunity.com/config/emoticons/wynaut.png',
		':y:': 'http://cbc.pokecommunity.com/config/emoticons/y.png',
		':yoshi:': 'http://cbc.pokecommunity.com/config/emoticons/yoshi.png'
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
			if (match === ':gav:' || match === ':kermit:' || match === ':superman:' || match === ':sweep:' || match === ':yoshi:') return typeof self.emoticons[match] != 'undefined' ?
				'<img src="' + self.emoticons[match] + '" title="' + match + '" width="30" height="30"/>' :
				match;
			if (match === ':hug:') return typeof self.emoticons[match] != 'undefined' ?
				'<img src="' + self.emoticons[match] + '" title="' + match + '" width="75" height="30"/>' :
				match;
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
		if (!match || message.charAt(0) === '!') return true;
		message = Tools.escapeHTML(message);
		message = this.processEmoticons(message);
		room.add('|raw|<div class="chat"><strong><font color="' + Core.hashColor(user.userid)+'"><small>' + user.group + '</small><span class="username" data-name="' + user.group + user.name + '">' + user.name + '</span>:</font></strong> <em class="mine">' + message + '</em></div>');
		return false;
	},

	tournaments: {
		tourSize: 8,
		amountEarn: 10,
		earningBP: function () {
			if (this.amountEarn === 10) return '<u>Standard (8 players = 1 Battle Point)</u> Double (4 players = 1 Battle Point) Quadruple (2 players = 1 Battle Point) PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 4) return 'Standard (8 players = 1 Battle Point) <u>Double (4 players = 1 Battle Point)</u> Quadruple (2 players = 1 Battle Point) PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 2) return 'Standard (8 players = 1 Battle Point) Double (4 players = 1 Battle Point) <u>Quadruple (2 players = 1 Battle Point)</u> PC Custom (1 player = 1 Battle Point)';
			if (this.amountEarn === 1.5) return 'Standard (8 players = 1 Battle Point) Double (4 players = 1 Battle Point) Quadruple (2 players = 1 Battle Point) <u>PC Custom (1 player = 1 Battle Point)</u>';
		}
	},

};
