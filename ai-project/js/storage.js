Config.origindomain = 'play.pokemonshowdown.com';
// `defaultserver` specifies the server to use when the domain name in the
// address bar is `Config.origindomain`.
Config.defaultserver = {
	id: 'showdown',
	host: 'sim2.psim.us',
	port: 443,
	httpport: 8000,
	altport: 80,
	registered: true
};

function Storage() {}

Storage.initialize = function () {
	if (window.nodewebkit) {
		window.fs = require('fs');

		this.initDirectory();
		this.startLoggingChat = this.nwStartLoggingChat;
		this.stopLoggingChat = this.nwStopLoggingChat;
		this.logChat = this.nwLogChat;
	}
	Storage.initPrefs();
};

Storage.safeJSON = function (callback) {
	return function (data) {
		if (data.length < 1) return;
		if (data[0] == ']') data = data.substr(1);
		return callback(JSON.parse(data));
	};
};

/*********************************************************
 * Background
 *********************************************************/

// Backgrounds are handled separately from other prefs because
// they're server-specific and should be loaded faster

Storage.bg = {
	id: '',
	changeCount: 0,
	set: function (bgUrl, bgid, noSave) {
		if (!this.load(bgUrl, bgid)) {
			this.extractMenuColors(bgUrl, bgid, noSave);
		} else if (bgid) {
			try {
				localStorage.setItem('showdown_bg', bgUrl + '\n' + bgid);
			} catch (e) {}
		} else {
			try {
				localStorage.removeItem('showdown_bg');
			} catch (e) {}
		}
	},
	/**
	 * Load a background. Returns true if hues were loaded, or false if
	 * they still need to be extracted using Color Thief.
	 */
	load: function (bgUrl, bgid, hues) {
		this.id = bgid;
		if (!bgid) {
			if (location.host === 'smogtours.psim.us') {
				bgid = 'shaymin';
			} else if (location.host === 'play.pokemonshowdown.com') {
				bgid = ['horizon', 'ocean', 'waterfall', 'shaymin', 'charizards'][Math.floor(Math.random() * 5)];
			} else {
				$(document.body).css({
					background: '',
					'background-size': ''
				});
				$('#mainmenubuttoncolors').remove();
				return true;
			}
			bgUrl = Dex.resourcePrefix + 'fx/client-bg-' + bgid + '.jpg';
		}

		// April Fool's 2016 - Digimon theme
		// bgid = 'digimon';
		// bgUrl = Dex.resourcePrefix + 'sprites/afd/digimonbg.jpg';

		var background;
		if (bgUrl.charAt(0) === '#') {
			background = bgUrl;
		} else if (bgid !== 'custom') {
			background = '#546bac url(' + bgUrl + ') no-repeat left center fixed';
		} else {
			background = '#546bac url(' + bgUrl + ') no-repeat center center fixed';
		}
		$(document.body).css({
			background: background,
			'background-size': 'cover'
		});
		var attrib = '';
		this.changeCount++;

		if (!hues) {
			switch (bgid) {
			case 'horizon':
				hues = ["318.87640449438203,35.177865612648226%", "216,46.2962962962963%", "221.25,32.25806451612904%", "197.8021978021978,52.60115606936417%", "232.00000000000003,19.480519480519483%", "228.38709677419354,60.7843137254902%"];
				attrib = '<a href="https://vtas.deviantart.com/art/Pokemon-Horizon-312267168" target="_blank" class="subtle">"Horizon" <small>background by Vivian Zou</small></a>';
				break;
			case 'ocean':
				hues = ["82.8169014084507,34.63414634146342%", "216.16438356164383,29.55465587044534%", "212.92682926829266,59.42028985507245%", "209.18918918918916,57.51295336787566%", "199.2857142857143,48.275862068965495%", "213.11999999999998,55.06607929515419%"];
				attrib = '<a href="https://quanyails.deviantart.com/art/Sunrise-Ocean-402667154" target="_blank" class="subtle">"Sunrise Ocean" <small>background by Yijing Chen</small></a>';
				break;
			case 'waterfall':
				hues = ["119.31034482758622,37.66233766233767%", "184.36363636363635,23.012552301255226%", "108.92307692307692,37.14285714285714%", "70.34482758620689,20.567375886524818%", "98.39999999999998,36.76470588235296%", "140,38.18181818181818%"];
				attrib = '<a href="https://yilx.deviantart.com/art/Irie-372292729" target="_blank" class="subtle">"Irie" <small>background by Samuel Teo</small></a>';
				break;
			case 'shaymin':
				hues = ["39.000000000000064,21.7391304347826%", "170.00000000000003,2.380952380952378%", "157.5,11.88118811881188%", "174.78260869565216,12.041884816753928%", "185.00000000000003,12.76595744680851%", "20,5.660377358490567%"];
				attrib = '<a href="http://cargocollective.com/bluep" target="_blank" class="subtle">"Shaymin" <small>background by Daniel Kong</small></a>';
				break;
			case 'charizards':
				hues = ["37.159090909090914,74.57627118644066%", "10.874999999999998,70.79646017699115%", "179.51612903225808,52.10084033613446%", "20.833333333333336,36.73469387755102%", "192.3076923076923,80.41237113402063%", "210,29.629629629629633%"];
				attrib = '<a href="https://seiryuuden.deviantart.com/art/The-Ultimate-Mega-Showdown-Charizards-414587079" target="_blank" class="subtle">"Charizards" <small>background by Jessica Valencia</small></a>';
				break;
			case 'digimon':
				hues = ["170.45454545454544,27.500000000000004%", "84.70588235294119,13.821138211382115%", "112.50000000000001,7.8431372549019605%", "217.82608695652175,54.761904761904766%", "0,1.6949152542372816%", ""];
			}
		}
		if (attrib) attrib = '<small style="display:block;padding-bottom:4px">' + attrib + '</small>';
		$('.bgcredit').html(attrib);
		if (!hues && bgUrl.charAt(0) === '#') {
			var r = parseInt(bgUrl.slice(1, 3), 16) / 255;
			var g = parseInt(bgUrl.slice(3, 5), 16) / 255;
			var b = parseInt(bgUrl.slice(5, 7), 16) / 255;
			var hs = this.getHueSat(r, g, b);
			hues = [hs, hs, hs, hs, hs, hs];
		}
		if (hues) {
			this.loadHues(hues);
		}
		return !!hues;
	},
	loadHues: function (hues) {
		$('#mainmenubuttoncolors').remove();
		var cssBuf = '';
		for (var i = 0; i < 5; i++) {
			var n = i + 1;
			var hs = hues[i];
			cssBuf += 'body .button.mainmenu' + n + ' { background: linear-gradient(to bottom,  hsl(' + hs + ',72%),  hsl(' + hs + ',52%)); border-color: hsl(' + hs + ',40%); }\n';
			cssBuf += 'body .button.mainmenu' + n + ':hover { background: linear-gradient(to bottom,  hsl(' + hs + ',62%),  hsl(' + hs + ',42%)); border-color: hsl(' + hs + ',21%); }\n';
			cssBuf += 'body .button.mainmenu' + n + ':active { background: linear-gradient(to bottom,  hsl(' + hs + ',42%),  hsl(' + hs + ',58%)); border-color: hsl(' + hs + ',21%); }\n';
		}
		$('head').append('<style id="mainmenubuttoncolors">' + cssBuf + '</style>');
	},
	extractMenuColors: function (bgUrl, bgid, noSave) {
		var changeCount = this.changeCount;
		// We need the image object to load it on a canvas to detect the main color.
		var img = new Image();
		img.onload = function () {
			// in case ColorThief throws from canvas,
			// or localStorage throws
			try {
				var colorThief = new ColorThief();
				var colors = colorThief.getPalette(img, 5);

				var hues = [];
				if (!colors) {
					hues = ['0, 0%', '0, 0%', '0, 0%', '0, 0%', '0, 0%'];
				} else {
					for (var i = 0; i < 5; i++) {
						var color = colors[i];
						var hs = Storage.bg.getHueSat(color[0] / 255, color[1] / 255, color[2] / 255);
						hues.unshift(hs);
					}
				}
				Storage.bg.loadHues(hues);
				if (!noSave && Storage.bg.changeCount === changeCount) {
					localStorage.setItem('showdown_bg', bgUrl + '\n' + Storage.bg.id + '\n' + hues.join('\n'));
				}
			} catch (e) {}
		};
		img.src = bgUrl;
	},
	getHueSat: function (r, g, b) {
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h;
		var s;
		var l = (max + min) / 2;
		if (max === min) {
			return '0, 0%';
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return '' + (h * 360) + ',' + (s * 100) + '%';
	}
};

try {
	var bg = localStorage.getItem('showdown_bg').split('\n');
	if (bg.length >= 2) {
		Storage.bg.load(bg[0], bg[1]);
		if (bg.length >= 7) Storage.bg.loadHues(bg.slice(2));
	}
} catch (e) {}

if (!Storage.bg.id) {
	Storage.bg.load();
}

/*********************************************************
 * Prefs
 *********************************************************/

// Prefs are canonically stored in showdown_prefs in localStorage
// in the origin https://play.pokemonshowdown.com

// We try loading things from the origin, anyway, in case third-party
// localStorage is banned, and since prefs are cached in other
// places in certain cases.

Storage.origin = 'https://play.pokemonshowdown.com';

Storage.prefs = function (prop, value, save) {
	if (value === undefined) {
		// get preference
		return this.prefs.data[prop];
	}
	// set preference
	if (value === null) {
		delete this.prefs.data[prop];
	} else if (this.prefs.data[prop] === value && typeof value !== 'object') {
		return false; // no need to save
	} else {
		this.prefs.data[prop] = value;
	}
	if (save !== false) this.prefs.save();
	return true;
};

Storage.prefs.data = {};
try {
	if (window.localStorage) {
		Storage.prefs.data = JSON.parse(localStorage.getItem('showdown_prefs')) || {};
	}
} catch (e) {}

Storage.prefs.save = function () {
	try {
		localStorage.setItem('showdown_prefs', JSON.stringify(this.data));
	} catch (e) {}
};

/**
 * Load trackers are loosely based on Promises, but very simplified.
 * Trackers are made with: let tracker = Dex.makeLoadTracker();
 * Pass callbacks like so: tracker(callback)
 * When tracker.load() is called, all callbacks are run.
 * If tracker.load() has already been called, tracker(callback) will
 * call the callback instantly.
 */
Storage.makeLoadTracker = function () {
	/** @type {(callback: (this: C, value: T) => void, context: C) => LoadTracker) & {isLoaded: boolean, value: T | undefined, load: (value: T) => void, unload: () => void, callbacks: [(value: T) => void, C][]}} */
	var tracker = function (callback, context) {
		if (tracker.isLoaded) {
			callback.call(context, tracker.value);
		} else {
			tracker.callbacks.push([callback, context]);
		}
		return tracker;
	};
	tracker.callbacks = [];
	tracker.value = undefined;
	tracker.isLoaded = false;
	tracker.load = function (value) {
		if (tracker.isLoaded) return;
		tracker.isLoaded = true;
		tracker.value = value;
		for (var i = 0; i < tracker.callbacks.length; i++) {
			var callback = tracker.callbacks[i];
			callback[0].call(callback[1], value);
		}
	};
	tracker.unload = function () {
		if (!tracker.isLoaded) return;
		tracker.isLoaded = false;
	};
	return tracker;
};

Storage.whenPrefsLoaded = Storage.makeLoadTracker();
Storage.whenTeamsLoaded = Storage.makeLoadTracker();
Storage.whenAppLoaded = Storage.makeLoadTracker();

var updatePrefs = function () {
	var oldShowjoins = Storage.prefs('showjoins');
	if (oldShowjoins !== undefined && typeof oldShowjoins !== 'object') {
		var showjoins = {};
		var serverShowjoins = {global: (oldShowjoins ? 1 : 0)};
		var showroomjoins = Storage.prefs('showroomjoins');
		for (var roomid in showroomjoins) {
			serverShowjoins[roomid] = (showroomjoins[roomid] ? 1 : 0);
		}
		Storage.prefs('showroomjoins', null);
		showjoins[Config.server.id] = serverShowjoins;
		Storage.prefs('showjoins', showjoins, true);
	}

	var isChrome64 = navigator.userAgent.includes(' Chrome/64.');
	if (Storage.prefs('nogif') !== undefined) {
		if (!isChrome64) {
			Storage.prefs('nogif', null);
		}
	} else if (isChrome64) {
		Storage.prefs('nogif', true);
		Storage.whenAppLoaded(function () {
			app.addPopupMessage('Your version of Chrome has a bug that makes animated GIFs freeze games sometimes, so certain animations have been disabled. Only some people have the problem, so you can experiment and enable them in the Options menu setting "Disable GIFs for Chrome 64 bug".');
		});
	}
};
Storage.whenPrefsLoaded(updatePrefs);

Storage.initPrefs = function () {
	Storage.loadTeams();
	if (Config.testclient) {
		return this.initTestClient();
	} else if (location.protocol + '//' + location.hostname === Storage.origin) {
		// Same origin, everything can be kept as default
		Config.server = Config.server || Config.defaultserver;
		this.whenPrefsLoaded.load();
		if (!window.nodewebkit) this.whenTeamsLoaded.load();
		return;
	}

	// Cross-origin

	if (!('postMessage' in window)) {
		// browser does not support cross-document messaging
		return Storage.whenAppLoaded(function (app) {
			app.trigger('init:unsupported');
		});
	}

	$(window).on('message', Storage.onMessage);

	if (document.location.hostname !== Config.origindomain) {
		$(
			'<iframe src="https://play.pokemonshowdown.com/crossdomain.php?host=' +
			encodeURIComponent(document.location.hostname) +
			'&path=' + encodeURIComponent(document.location.pathname.substr(1)) +
			'&protocol=' + encodeURIComponent(document.location.protocol) +
			'" style="display: none;"></iframe>'
		).appendTo('body');
	} else {
		Config.server = Config.server || Config.defaultserver;
		$(
			'<iframe src="https://play.pokemonshowdown.com/crossprotocol.html?v1.2" style="display: none;"></iframe>'
		).appendTo('body');
		setTimeout(function () {
			// HTTPS may be blocked
			// yes, this happens, blame Avast! and BitDefender and other antiviruses
			// that feel a need to MitM HTTPS poorly
			Storage.whenPrefsLoaded.load();
			if (!Storage.whenTeamsLoaded.isLoaded) {
				Storage.whenTeamsLoaded.isStalled = true;
				if (window.app && app.rooms['teambuilder']) {
					app.rooms['teambuilder'].updateTeamInterface();
				}
			}
		}, 2000);
	}
};

Storage.crossOriginFrame = null;
Storage.crossOriginRequests = {};
Storage.crossOriginRequestCount = 0;
Storage.onMessage = function ($e) {
	var e = $e.originalEvent;
	if (e.origin !== Storage.origin) return;

	Storage.crossOriginFrame = e.source;
	var data = e.data;
	switch (data.charAt(0)) {
	case 'c':
		Config.server = JSON.parse(data.substr(1));
		if (Config.server.registered && Config.server.id !== 'showdown' && Config.server.id !== 'smogtours') {
			var $link = $('<link rel="stylesheet" ' +
				'href="//play.pokemonshowdown.com/customcss.php?server=' +
				encodeURIComponent(Config.server.id) + '" />');
			$('head').append($link);
		}
		break;
	case 'p':
		var newData = JSON.parse(data.substr(1));
		if (newData) Storage.prefs.data = newData;
		Storage.prefs.save = function () {
			var prefData = JSON.stringify(this.data);
			Storage.postCrossOriginMessage('P' + prefData);

			// in Safari, cross-origin local storage is apparently treated as session
			// storage, so mirror the storage in the current origin just in case
			try {
				localStorage.setItem('showdown_prefs', prefData);
			} catch (e) {}
		};
		Storage.whenPrefsLoaded.load();
		break;
	case 't':
		if (window.nodewebkit) return;
		var oldTeams;
		if (Storage.teams && Storage.teams.length) {
			// Teams are still stored in the old location; merge them with the
			// new teams.
			oldTeams = Storage.teams;
		}
		Storage.loadPackedTeams(data.substr(1));
		Storage.saveTeams = function () {
			var packedTeams = Storage.packAllTeams(Storage.teams);
			Storage.postCrossOriginMessage('T' + packedTeams);

			// in Safari, cross-origin local storage is apparently treated as session
			// storage, so mirror the storage in the current origin just in case
			if (document.location.hostname === Config.origindomain) {
				try {
					localStorage.setItem('showdown_teams_local', packedTeams);
				} catch (e) {}
			}
		};
		if (oldTeams) {
			Storage.teams = Storage.teams.concat(oldTeams);
			Storage.saveTeams();
			localStorage.removeItem('showdown_teams');
		}
		if (data === 'tnull' && !Storage.teams.length) {
			Storage.loadPackedTeams(localStorage.getItem('showdown_teams_local'));
		}
		Storage.whenTeamsLoaded.load();
		break;
	case 'a':
		if (data === 'a0') {
			Storage.noThirdParty = true;
			Storage.whenTeamsLoaded.load();
			Storage.whenPrefsLoaded.load();
		}
		if (!window.nodewebkit) {
			// for whatever reason, Node-Webkit doesn't let us make remote
			// Ajax requests or something. Oh well, making them direct
			// isn't a problem, either.

			try {
				// I really hope this is a Chrome bug that this can fail
				Storage.crossOriginFrame.postMessage("", Storage.origin);
			} catch (e) {
				return;
			}

			$.get = function (uri, data, callback, type) {
				var idx = Storage.crossOriginRequestCount++;
				Storage.crossOriginRequests[idx] = callback;
				Storage.postCrossOriginMessage('R' + JSON.stringify([uri, data, idx, type]));
			};
			$.post = function (uri, data, callback, type) {
				var idx = Storage.crossOriginRequestCount++;
				Storage.crossOriginRequests[idx] = callback;
				Storage.postCrossOriginMessage('S' + JSON.stringify([uri, data, idx, type]));
			};
		}
		break;
	case 'r':
		var reqData = JSON.parse(data.slice(1));
		var idx = reqData[0];
		if (Storage.crossOriginRequests[idx]) {
			Storage.crossOriginRequests[idx](reqData[1]);
			delete Storage.crossOriginRequests[idx];
		}
		break;
	}
};
Storage.postCrossOriginMessage = function (data) {
	try {
		// I really hope this is a Chrome bug that this can fail
		return Storage.crossOriginFrame.postMessage(data, Storage.origin);
	} catch (e) {
		Storage.whenPrefsLoaded.load();
		if (!Storage.whenTeamsLoaded.isLoaded) {
			Storage.whenTeamsLoaded.isStalled = true;
			if (window.app && app.rooms['teambuilder']) {
				app.rooms['teambuilder'].updateTeamInterface();
			}
		}
	}
	return false;
};

// Test client

Storage.initTestClient = function () {
	Config.server = Config.server || Config.defaultserver;
	Storage.whenTeamsLoaded.load();
	Storage.whenAppLoaded(function (app) {
		$.get = function (uri, data, callback, type) {
			if (type === 'html') {
				uri += '&testclient';
			}
			if (data) {
				uri += '?testclient';
				for (var i in data) {
					uri += '&' + i + '=' + encodeURIComponent(data[i]);
				}
			}
			if (uri[0] === '/') { // relative URI
				uri = Dex.resourcePrefix + uri.substr(1);
			}
			app.addPopup(ProxyPopup, {uri: uri, callback: callback});
		};
		$.post = function (uri, data, callback, type) {
			if (type === 'html') {
				uri += '&testclient';
			}
			if (uri[0] === '/') { //relative URI
				uri = Dex.resourcePrefix + uri.substr(1);
			}
			var src = '<!DOCTYPE html><html><body><form action="' + BattleLog.escapeHTML(uri) + '" method="POST">';
			src += '<input type="hidden" name="testclient">';
			for (var i in data) {
				src += '<input type=hidden name="' + i + '" value="' + BattleLog.escapeHTML(data[i]) + '">';
			}
			src += '<input type=submit value="Please click this button first."></form></body></html>';
			app.addPopup(ProxyPopup, {uri: "data:text/html;charset=UTF-8," + encodeURIComponent(src), callback: callback});
		};
		Storage.whenPrefsLoaded.load();
	});
};

/*********************************************************
 * Teams
 *********************************************************/

/**
 * Teams are normally loaded from `localStorage`.
 * If the client isn't running on `play.pokemonshowdown.com`, though,
 * teams are received from `crossdomain.php` instead.
 */

Storage.teams = null;

Storage.loadTeams = function () {
	if (window.nodewebkit) {
		return;
	}
	this.teams = [];
	try {
		if (window.localStorage) {
			Storage.loadPackedTeams(localStorage.getItem('showdown_teams'));
		}
	} catch (e) {}
};

Storage.loadPackedTeams = function (buffer) {
	try {
		this.teams = Storage.unpackAllTeams(buffer);
	} catch (e) {
		Storage.whenAppLoaded(function (app) {
			app.addPopup(Popup, {
				type: 'modal',
				htmlMessage: "Your teams are corrupt and could not be loaded. :( We may be able to recover a team from this data:<br /><textarea rows=\"10\" cols=\"60\">" + BattleLog.escapeHTML(buffer) + "</textarea>"
			});
		});
	}
};

Storage.saveTeams = function () {
	try {
		if (window.localStorage) {
			localStorage.setItem('showdown_teams', Storage.packAllTeams(this.teams));
			Storage.cantSave = false;
		}
	} catch (e) {
		if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
			Storage.cantSave = true;
		} else {
			throw e;
		}
	}
};

Storage.getPackedTeams = function () {
	var packedTeams = '';
	try {
		packedTeams = localStorage.getItem('showdown_teams');
	} catch (e) {}
	if (packedTeams) return packedTeams;
	return Storage.packAllTeams(this.teams);
};

Storage.saveTeam = function () {
	this.saveTeams();
};

Storage.deleteTeam = function () {
	this.saveTeams();
};

Storage.saveAllTeams = function () {
	this.saveTeams();
};

Storage.deleteAllTeams = function () {};

/*********************************************************
 * Team importing and exporting
 *********************************************************/

Storage.unpackAllTeams = function (buffer) {
	if (!buffer) return [];

	if (buffer.charAt(0) === '[' && $.trim(buffer).indexOf('\n') < 0) {
		// old format
		return JSON.parse(buffer).map(function (oldTeam) {
			var format = oldTeam.format || 'gen7';
			if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
			return {
				name: oldTeam.name || '',
				format: format,
				team: Storage.packTeam(oldTeam.team),
				folder: '',
				iconCache: ''
			};
		});
	}

	return buffer.split('\n').map(Storage.unpackLine).filter(function (v) { return v; });
};

Storage.unpackLine = function (line) {
	var pipeIndex = line.indexOf('|');
	if (pipeIndex < 0) return null;
	var bracketIndex = line.indexOf(']');
	if (bracketIndex > pipeIndex) bracketIndex = -1;
	var slashIndex = line.lastIndexOf('/', pipeIndex);
	if (slashIndex < 0) slashIndex = bracketIndex; // line.slice(slashIndex + 1, pipeIndex) will be ''
	var format = bracketIndex > 0 ? line.slice(0, bracketIndex) : 'gen7';
	if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
	return {
		name: line.slice(slashIndex + 1, pipeIndex),
		format: format,
		team: line.slice(pipeIndex + 1),
		folder: line.slice(bracketIndex + 1, slashIndex > 0 ? slashIndex : bracketIndex + 1),
		iconCache: ''
	};
};

Storage.packAllTeams = function (teams) {
	return teams.map(function (team) {
		return (team.format ? '' + team.format + ']' : '') + (team.folder ? '' + team.folder + '/' : '') + team.name + '|' + Storage.getPackedTeam(team);
	}).join('\n');
};

Storage.packTeam = function (team) {
	var buf = '';
	if (!team) return '';

	var hasHP;
	for (var i = 0; i < team.length; i++) {
		var set = team[i];
		if (buf) buf += ']';

		// name
		buf += set.name || set.species;

		// species
		var id = toId(set.species);
		buf += '|' + (toId(set.name || set.species) === id ? '' : id);

		// item
		buf += '|' + toId(set.item);

		// ability
		var template = Dex.getTemplate(set.species || set.name);
		var abilities = template.abilities;
		id = toId(set.ability);
		if (abilities) {
			if (id == toId(abilities['0'])) {
				buf += '|';
			} else if (id === toId(abilities['1'])) {
				buf += '|1';
			} else if (id === toId(abilities['H'])) {
				buf += '|H';
			} else {
				buf += '|' + id;
			}
		} else {
			buf += '|' + id;
		}

		// moves
		buf += '|';
		if (set.moves) for (var j = 0; j < set.moves.length; j++) {
			var moveid = toId(set.moves[j]);
			if (j && !moveid) continue;
			buf += (j ? ',' : '') + moveid;
			if (moveid.substr(0, 11) === 'hiddenpower' && moveid.length > 11) hasHP = true;
		}

		// nature
		buf += '|' + (set.nature || '');

		// evs
		var evs = '|';
		if (set.evs) {
			evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
		}
		if (evs === '|,,,,,') {
			buf += '|';
			// doing it this way means packTeam doesn't need to be past-gen aware
			if (set.evs['hp'] === 0) buf += '0';
		} else {
			buf += evs;
		}

		// gender
		if (set.gender && set.gender !== template.gender) {
			buf += '|' + set.gender;
		} else {
			buf += '|';
		}

		// ivs
		var ivs = '|';
		if (set.ivs) {
			ivs = '|' + (set.ivs['hp'] === 31 || set.ivs['hp'] === undefined ? '' : set.ivs['hp']) + ',' + (set.ivs['atk'] === 31 || set.ivs['atk'] === undefined ? '' : set.ivs['atk']) + ',' + (set.ivs['def'] === 31 || set.ivs['def'] === undefined ? '' : set.ivs['def']) + ',' + (set.ivs['spa'] === 31 || set.ivs['spa'] === undefined ? '' : set.ivs['spa']) + ',' + (set.ivs['spd'] === 31 || set.ivs['spd'] === undefined ? '' : set.ivs['spd']) + ',' + (set.ivs['spe'] === 31 || set.ivs['spe'] === undefined ? '' : set.ivs['spe']);
		}
		if (ivs === '|,,,,,') {
			buf += '|';
		} else {
			buf += ivs;
		}

		// shiny
		if (set.shiny) {
			buf += '|S';
		} else {
			buf += '|';
		}

		// level
		if (set.level && set.level != 100) {
			buf += '|' + set.level;
		} else {
			buf += '|';
		}

		// happiness
		if (set.happiness !== undefined && set.happiness !== 255) {
			buf += '|' + set.happiness;
		} else {
			buf += '|';
		}

		if (set.pokeball || (set.hpType && !hasHP)) {
			buf += ',' + (set.hpType || '');
			buf += ',' + toId(set.pokeball);
		}
	}

	return buf;
};

Storage.fastUnpackTeam = function (buf) {
	if (!buf) return [];

	var team = [];
	var i = 0, j = 0;

	while (true) {
		var set = {};
		team.push(set);

		// name
		j = buf.indexOf('|', i);
		set.name = buf.substring(i, j);
		i = j + 1;

		// species
		j = buf.indexOf('|', i);
		set.species = buf.substring(i, j) || set.name;
		i = j + 1;

		// item
		j = buf.indexOf('|', i);
		set.item = buf.substring(i, j);
		i = j + 1;

		// ability
		j = buf.indexOf('|', i);
		var ability = buf.substring(i, j);
		var template = Dex.getTemplate(set.species);
		set.ability = (template.abilities && ability in {'':1, 0:1, 1:1, H:1} ? template.abilities[ability || '0'] : ability);
		i = j + 1;

		// moves
		j = buf.indexOf('|', i);
		set.moves = buf.substring(i, j).split(',');
		i = j + 1;

		// nature
		j = buf.indexOf('|', i);
		set.nature = buf.substring(i, j);
		if (set.nature === 'undefined') set.nature = undefined;
		i = j + 1;

		// evs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var evstring = buf.substring(i, j);
			if (evstring.length > 5) {
				var evs = evstring.split(',');
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0
				};
			} else if (evstring === '0') {
				set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			}
		}
		i = j + 1;

		// gender
		j = buf.indexOf('|', i);
		if (i !== j) set.gender = buf.substring(i, j);
		i = j + 1;

		// ivs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var ivs = buf.substring(i, j).split(',');
			set.ivs = {
				hp: ivs[0] === '' ? 31 : Number(ivs[0]),
				atk: ivs[1] === '' ? 31 : Number(ivs[1]),
				def: ivs[2] === '' ? 31 : Number(ivs[2]),
				spa: ivs[3] === '' ? 31 : Number(ivs[3]),
				spd: ivs[4] === '' ? 31 : Number(ivs[4]),
				spe: ivs[5] === '' ? 31 : Number(ivs[5])
			};
		}
		i = j + 1;

		// shiny
		j = buf.indexOf('|', i);
		if (i !== j) set.shiny = true;
		i = j + 1;

		// level
		j = buf.indexOf('|', i);
		if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
		i = j + 1;

		// happiness
		j = buf.indexOf(']', i);
		var misc = undefined;
		if (j < 0) {
			if (i < buf.length) misc = buf.substring(i).split(',', 3);
		} else {
			if (i !== j) misc = buf.substring(i, j).split(',', 3);
		}
		if (misc) {
			set.happiness = (misc[0] ? Number(misc[0]) : 255);
			set.hpType = misc[1];
			set.pokeball = misc[2];
		}
		if (j < 0) break;
		i = j + 1;
	}

	return team;
};

Storage.unpackTeam = function (buf) {
	if (!buf) return [];

	var team = [];
	var i = 0, j = 0;

	while (true) {
		var set = {};
		team.push(set);

		// name
		j = buf.indexOf('|', i);
		set.name = buf.substring(i, j);
		i = j + 1;

		// species
		j = buf.indexOf('|', i);
		set.species = Dex.getTemplate(buf.substring(i, j)).species || set.name;
		i = j + 1;

		// item
		j = buf.indexOf('|', i);
		set.item = Dex.getItem(buf.substring(i, j)).name;
		i = j + 1;

		// ability
		j = buf.indexOf('|', i);
		var ability = Dex.getAbility(buf.substring(i, j)).name;
		var template = Dex.getTemplate(set.species);
		set.ability = (template.abilities && ability in {'':1, 0:1, 1:1, H:1} ? template.abilities[ability || '0'] : ability);
		i = j + 1;

		// moves
		j = buf.indexOf('|', i);
		set.moves = buf.substring(i, j).split(',').map(function (moveid) {
			return Dex.getMove(moveid).name;
		});
		i = j + 1;

		// nature
		j = buf.indexOf('|', i);
		set.nature = buf.substring(i, j);
		if (set.nature === 'undefined') set.nature = undefined;
		i = j + 1;

		// evs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var evstring = buf.substring(i, j);
			if (evstring.length > 5) {
				var evs = evstring.split(',');
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0
				};
			} else if (evstring === '0') {
				set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			}
		}
		i = j + 1;

		// gender
		j = buf.indexOf('|', i);
		if (i !== j) set.gender = buf.substring(i, j);
		i = j + 1;

		// ivs
		j = buf.indexOf('|', i);
		if (j !== i) {
			var ivs = buf.substring(i, j).split(',');
			set.ivs = {
				hp: ivs[0] === '' ? 31 : Number(ivs[0]),
				atk: ivs[1] === '' ? 31 : Number(ivs[1]),
				def: ivs[2] === '' ? 31 : Number(ivs[2]),
				spa: ivs[3] === '' ? 31 : Number(ivs[3]),
				spd: ivs[4] === '' ? 31 : Number(ivs[4]),
				spe: ivs[5] === '' ? 31 : Number(ivs[5])
			};
		}
		i = j + 1;

		// shiny
		j = buf.indexOf('|', i);
		if (i !== j) set.shiny = true;
		i = j + 1;

		// level
		j = buf.indexOf('|', i);
		if (i !== j) set.level = parseInt(buf.substring(i, j), 10);
		i = j + 1;

		// happiness
		j = buf.indexOf(']', i);
		var misc = undefined;
		if (j < 0) {
			if (i < buf.length) misc = buf.substring(i).split(',', 3);
		} else {
			if (i !== j) misc = buf.substring(i, j).split(',', 3);
		}
		if (misc) {
			set.happiness = (misc[0] ? Number(misc[0]) : 255);
			set.hpType = misc[1];
			set.pokeball = misc[2];
		}
		if (j < 0) break;
		i = j + 1;
	}

	return team;
};

Storage.packedTeamNames = function (buf) {
	if (!buf) return '';

	var team = [];
	var i = 0;

	while (true) {
		var name = buf.substring(i, buf.indexOf('|', i));
		i = buf.indexOf('|', i) + 1;

		team.push(buf.substring(i, buf.indexOf('|', i)) || name);

		for (var k = 0; k < 9; k++) {
			i = buf.indexOf('|', i) + 1;
		}

		i = buf.indexOf(']', i) + 1;

		if (i < 1) break;
	}

	return team;
};

Storage.packedTeamIcons = function (buf) {
	if (!buf) return '<em>(empty team)</em>';

	return this.packedTeamNames(buf).map(function (species) {
		return '<span class="picon" style="' + Dex.getPokemonIcon(species) + ';float:left;overflow:visible"><span style="font-size:0px">' + toId(species) + '</span></span>';
	}).join('');
};

Storage.getTeamIcons = function (team) {
	if (team.iconCache === '!') {
		// an icon cache of '!' means that not only are the icons not cached,
		// but the packed team isn't guaranteed to be updated to the latest
		// changes from the teambuilder, either.

		// we use Storage.activeSetList instead of reading from
		// app.rooms.teambuilder.curSetList because the teambuilder
		// room may have been closed by the time we need to get
		// a packed team.
		team.team = Storage.packTeam(Storage.activeSetList);
		if ('teambuilder' in app.rooms) {
			return Storage.packedTeamIcons(team.team);
		}
		Storage.activeSetList = null;
		team.iconCache = Storage.packedTeamIcons(team.team);
	} else if (!team.iconCache) {
		team.iconCache = Storage.packedTeamIcons(team.team);
	}
	return team.iconCache;
};

Storage.getPackedTeam = function (team) {
	if (!team) return null;
	if (team.iconCache === '!') {
		// see the same case in Storage.getTeamIcons
		team.team = Storage.packTeam(Storage.activeSetList);
		if (!('teambuilder' in app.rooms)) {
			Storage.activeSetList = null;
			team.iconCache = '';
		}
	}
	if (typeof team.team !== 'string') {
		// should never happen
		team.team = Storage.packTeam(team.team);
	}
	return team.team;
};

Storage.importTeam = function (buffer, teams) {
	var text = buffer.split("\n");
	var team = teams ? null : [];
	var curSet = null;
	if (teams === true) {
		Storage.teams = [];
		teams = Storage.teams;
	} else if (text.length === 1 || (text.length === 2 && !text[1])) {
		return Storage.unpackTeam(text[0]);
	}
	for (var i = 0; i < text.length; i++) {
		var line = $.trim(text[i]);
		if (line === '' || line === '---') {
			curSet = null;
		} else if (line.substr(0, 3) === '===' && teams) {
			team = [];
			line = $.trim(line.substr(3, line.length - 6));
			var format = 'gen7';
			var bracketIndex = line.indexOf(']');
			if (bracketIndex >= 0) {
				format = line.substr(1, bracketIndex - 1);
				if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
				line = $.trim(line.substr(bracketIndex + 1));
			}
			if (teams.length && typeof teams[teams.length - 1].team !== 'string') {
				teams[teams.length - 1].team = Storage.packTeam(teams[teams.length - 1].team);
			}
			var slashIndex = line.lastIndexOf('/');
			var folder = '';
			if (slashIndex > 0) {
				folder = line.slice(0, slashIndex);
				line = line.slice(slashIndex + 1);
			}
			teams.push({
				name: line,
				format: format,
				team: team,
				folder: folder,
				iconCache: ''
			});
		} else if (line.includes('|')) {
			// packed format
			curSet = null;
			teams.push(Storage.unpackLine(line));
		} else if (!curSet) {
			curSet = {name: '', species: '', gender: ''};
			team.push(curSet);
			var atIndex = line.lastIndexOf(' @ ');
			if (atIndex !== -1) {
				curSet.item = line.substr(atIndex + 3);
				if (toId(curSet.item) === 'noitem') curSet.item = '';
				line = line.substr(0, atIndex);
			}
			if (line.substr(line.length - 4) === ' (M)') {
				curSet.gender = 'M';
				line = line.substr(0, line.length - 4);
			}
			if (line.substr(line.length - 4) === ' (F)') {
				curSet.gender = 'F';
				line = line.substr(0, line.length - 4);
			}
			var parenIndex = line.lastIndexOf(' (');
			if (line.substr(line.length - 1) === ')' && parenIndex !== -1) {
				line = line.substr(0, line.length - 1);
				curSet.species = Dex.getTemplate(line.substr(parenIndex + 2)).species;
				line = line.substr(0, parenIndex);
				curSet.name = line;
			} else {
				curSet.species = Dex.getTemplate(line).species;
				curSet.name = '';
			}
		} else if (line.substr(0, 7) === 'Trait: ') {
			line = line.substr(7);
			curSet.ability = line;
		} else if (line.substr(0, 9) === 'Ability: ') {
			line = line.substr(9);
			curSet.ability = line;
		} else if (line === 'Shiny: Yes') {
			curSet.shiny = true;
		} else if (line.substr(0, 7) === 'Level: ') {
			line = line.substr(7);
			curSet.level = +line;
		} else if (line.substr(0, 11) === 'Happiness: ') {
			line = line.substr(11);
			curSet.happiness = +line;
		} else if (line.substr(0, 5) === 'EVs: ') {
			line = line.substr(5);
			var evLines = line.split('/');
			curSet.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			for (var j = 0; j < evLines.length; j++) {
				var evLine = $.trim(evLines[j]);
				var spaceIndex = evLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				var statid = BattleStatIDs[evLine.substr(spaceIndex + 1)];
				var statval = parseInt(evLine.substr(0, spaceIndex), 10);
				if (!statid) continue;
				curSet.evs[statid] = statval;
			}
		} else if (line.substr(0, 5) === 'IVs: ') {
			line = line.substr(5);
			var ivLines = line.split(' / ');
			curSet.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			for (var j = 0; j < ivLines.length; j++) {
				var ivLine = ivLines[j];
				var spaceIndex = ivLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				var statid = BattleStatIDs[ivLine.substr(spaceIndex + 1)];
				var statval = parseInt(ivLine.substr(0, spaceIndex), 10);
				if (!statid) continue;
				if (isNaN(statval)) statval = 31;
				curSet.ivs[statid] = statval;
			}
		} else if (line.match(/^[A-Za-z]+ (N|n)ature/)) {
			var natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) continue;
			line = line.substr(0, natureIndex);
			if (line !== 'undefined') curSet.nature = line;
		} else if (line.substr(0, 1) === '-' || line.substr(0, 1) === '~') {
			line = line.substr(1);
			if (line.substr(0, 1) === ' ') line = line.substr(1);
			if (!curSet.moves) curSet.moves = [];
			if (line.substr(0, 14) === 'Hidden Power [') {
				var hptype = line.substr(14, line.length - 15);
				line = 'Hidden Power ' + hptype;
				if (!curSet.ivs && window.BattleTypeChart && window.BattleTypeChart[hptype]) {
					curSet.ivs = {};
					for (var stat in window.BattleTypeChart[hptype].HPivs) {
						curSet.ivs[stat] = window.BattleTypeChart[hptype].HPivs[stat];
					}
				}
			}
			if (line === 'Frustration') {
				curSet.happiness = 0;
			}
			curSet.moves.push(line);
		}
	}
	if (teams && teams.length && typeof teams[teams.length - 1].team !== 'string') {
		teams[teams.length - 1].team = Storage.packTeam(teams[teams.length - 1].team);
	}
	return team;
};
Storage.exportAllTeams = function () {
	var buf = '';
	for (var i = 0, len = Storage.teams.length; i < len; i++) {
		var team = Storage.teams[i];
		buf += '=== ' + (team.format ? '[' + team.format + '] ' : '') + (team.folder ? '' + team.folder + '/' : '') + team.name + ' ===\n\n';
		buf += Storage.exportTeam(team.team);
		buf += '\n';
	}
	return buf;
};
Storage.exportFolder = function (folder) {
	var buf = '';
	for (var i = 0, len = Storage.teams.length; i < len; i++) {
		var team = Storage.teams[i];
		if (team.folder + "/" === folder || team.format === folder) {
			buf += '=== ' + (team.format ? '[' + team.format + '] ' : '') + (team.folder ? '' + team.folder + '/' : '') + team.name + ' ===\n\n';
			buf += Storage.exportTeam(team.team);
			buf += '\n';
		}
	}
	return buf;
};
Storage.exportTeam = function (team) {
	if (!team) return "";
	if (typeof team === 'string') {
		if (team.indexOf('\n') >= 0) return team;
		team = Storage.unpackTeam(team);
	}
	var text = '';
	for (var i = 0; i < team.length; i++) {
		var curSet = team[i];
		if (curSet.name && curSet.name !== curSet.species) {
			text += '' + curSet.name + ' (' + curSet.species + ')';
		} else {
			text += '' + curSet.species;
		}
		if (curSet.gender === 'M') text += ' (M)';
		if (curSet.gender === 'F') text += ' (F)';
		if (curSet.item) {
			text += ' @ ' + curSet.item;
		}
		text += "  \n";
		if (curSet.ability) {
			text += 'Ability: ' + curSet.ability + "  \n";
		}
		if (curSet.level && curSet.level != 100) {
			text += 'Level: ' + curSet.level + "  \n";
		}
		if (curSet.shiny) {
			text += 'Shiny: Yes  \n';
		}
		if (typeof curSet.happiness === 'number' && curSet.happiness !== 255 && !isNaN(curSet.happiness)) {
			text += 'Happiness: ' + curSet.happiness + "  \n";
		}
		var first = true;
		if (curSet.evs) {
			for (var j in BattleStatNames) {
				if (!curSet.evs[j]) continue;
				if (first) {
					text += 'EVs: ';
					first = false;
				} else {
					text += ' / ';
				}
				text += '' + curSet.evs[j] + ' ' + BattleStatNames[j];
			}
		}
		if (!first) {
			text += "  \n";
		}
		if (curSet.nature) {
			text += '' + curSet.nature + ' Nature' + "  \n";
		}
		var first = true;
		if (curSet.ivs) {
			var defaultIvs = true;
			var hpType = false;
			for (var j = 0; j < curSet.moves.length; j++) {
				var move = curSet.moves[j];
				if (move.substr(0, 13) === 'Hidden Power ' && move.substr(0, 14) !== 'Hidden Power [') {
					hpType = move.substr(13);
					if (!exports.BattleTypeChart[hpType].HPivs) {
						alert("That is not a valid Hidden Power type.");
						continue;
					}
					for (var stat in BattleStatNames) {
						if ((curSet.ivs[stat] === undefined ? 31 : curSet.ivs[stat]) !== (exports.BattleTypeChart[hpType].HPivs[stat] || 31)) {
							defaultIvs = false;
							break;
						}
					}
				}
			}
			if (defaultIvs && !hpType) {
				for (var stat in BattleStatNames) {
					if (curSet.ivs[stat] !== 31 && curSet.ivs[stat] !== undefined) {
						defaultIvs = false;
						break;
					}
				}
			}
			if (!defaultIvs) {
				for (var stat in BattleStatNames) {
					if (typeof curSet.ivs[stat] === 'undefined' || isNaN(curSet.ivs[stat]) || curSet.ivs[stat] == 31) continue;
					if (first) {
						text += 'IVs: ';
						first = false;
					} else {
						text += ' / ';
					}
					text += '' + curSet.ivs[stat] + ' ' + BattleStatNames[stat];
				}
			}
		}
		if (!first) {
			text += "  \n";
		}
		if (curSet.moves) for (var j = 0; j < curSet.moves.length; j++) {
			var move = curSet.moves[j];
			if (move.substr(0, 13) === 'Hidden Power ') {
				move = move.substr(0, 13) + '[' + move.substr(13) + ']';
			}
			if (move) {
				text += '- ' + move + "  \n";
			}
		}
		text += "\n";
	}
	return text;
};

/*********************************************************
 * Node-webkit
 *********************************************************/

Storage.initDirectory = function () {
	var self = this;

	var dir = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH;
	if (!(dir.charAt(dir.length - 1) in {'/': 1, '\\': 1})) dir += '/';
	fs.stat(dir + 'Documents', function (err, stats) {
		if (err || !stats.isDirectory()) {
			fs.stat(dir + 'My Documents', function (err, stats) {
				if (err || !stats.isDirectory()) {
					self.documentsDir = dir;
				} else {
					self.documentsDir = dir + 'My Documents/';
				}
				self.initDirectory2();
			});
		} else {
			self.documentsDir = dir + 'Documents/';
			self.initDirectory2();
		}
	});
};

Storage.initDirectory2 = function () {
	var self = this;
	fs.mkdir(self.documentsDir + 'My Games', function () {
		fs.mkdir(self.documentsDir + 'My Games/Pokemon Showdown', function () {
			fs.stat(self.documentsDir + 'My Games/Pokemon Showdown', function (err, stats) {
				if (err) return;
				if (stats.isDirectory()) {
					self.dir = self.documentsDir + 'My Games/Pokemon Showdown/';
					fs.mkdir(self.dir + 'Logs', function () {});
					fs.mkdir(self.dir + 'Teams', function () {});

					// load teams
					self.nwLoadTeams();
					self.saveAllTeams = self.nwSaveAllTeams;
					self.deleteAllTeams = self.nwDeleteAllTeams;
					self.saveTeam = self.nwSaveTeam;
					self.saveTeams = self.nwSaveTeams;
					self.deleteTeam = self.nwDeleteTeam;

					// logging
					if (Dex.prefs('logchat')) self.startLoggingChat();
				}
			});
		});
	});
};

Storage.revealFolder = function () {
	gui.Shell.openItem(this.dir);
};

Storage.nwFindTextFilesRecursive = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function (file) {
			file = dir + '/' + file;
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					Storage.nwFindTextFilesRecursive(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					if (file.slice(-4).toLowerCase() === '.txt') results.push(file);
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

// teams

Storage.nwLoadTeams = function () {
	var self = this;
	var localApp = window.app;
	var dirOffset = this.dir.length + 6;
	Storage.nwFindTextFilesRecursive(this.dir + 'Teams', function (err, files) {
		if (err) return;
		self.teams = [];
		self.nwTeamsLeft = files.length;
		if (!self.nwTeamsLeft) {
			self.nwFinishedLoadingTeams(localApp);
		}
		for (var i = 0; i < files.length; i++) {
			if (i >= 2000) {
				setTimeout(function () {
					Storage.nwLoadNextBatch(files, 2000, dirOffset);
				}, 3000);
				break;
			}
			self.nwLoadTeamFile(files[i].slice(dirOffset), localApp);
		}
	});
};

Storage.nwLoadNextBatch = function (files, offset, dirOffset) {
	if (window.app) {
		window.app.addPopupMessage("Loading " + files.length + " teams (Teams load slowly if you have over 2000 teams)");
	}
	var i;
	for (i = offset; i < files.length; i++) {
		if (i >= offset + 2000) {
			setTimeout(function () {
				Storage.nwLoadNextBatch(files, i);
			}, 3000);
			break;
		}
		this.nwLoadTeamFile(files[i].slice(dirOffset), window.app);
	}
};

Storage.nwLoadTeamFile = function (filename, localApp) {
	var self = this;
	var line = filename;
	if (line.slice(-4).toLowerCase() === '.txt') {
		line = line.slice(0, -4);
	} else {
		// not a team file
		if (!--self.nwTeamsLeft) {
			self.nwFinishedLoadingTeams(localApp);
		}
		return;
	}

	var folder = '';
	var slashIndex = line.indexOf('/');
	if (slashIndex >= 0) {
		folder = line.slice(0, slashIndex);
		line = $.trim(line.slice(slashIndex + 1));
	}
	slashIndex = line.indexOf('/');
	if (slashIndex >= 0) {
		// very nested, not currently supported, skip
		if (!--self.nwTeamsLeft) {
			self.nwFinishedLoadingTeams(localApp);
		}
		return;
	}

	var format = '';
	var bracketIndex = line.indexOf(']');
	if (bracketIndex >= 0) {
		format = line.slice(1, bracketIndex);
		line = $.trim(line.slice(bracketIndex + 1));
	}
	if (format && format.slice(0, 3) !== 'gen') format = 'gen6' + format;
	fs.readFile(this.dir + 'Teams/' + filename, function (err, data) {
		if (!err) {
			self.teams.push({
				name: line,
				format: format,
				team: Storage.packTeam(Storage.importTeam('' + data)),
				folder: folder,
				iconCache: '',
				filename: filename
			});
		} else {
			app.popup(err);
		}
		if (!--self.nwTeamsLeft) {
			self.nwFinishedLoadingTeams(localApp);
		}
	});
};

Storage.nwFinishedLoadingTeams = function (app) {
	this.teams.sort(this.teamCompare);
	Storage.whenTeamsLoaded.load();
};

Storage.teamCompare = function (a, b) {
	if (a.name > b.name) return 1;
	if (a.name < b.name) return -1;
	return 0;
};

Storage.fsReady = Storage.makeLoadTracker();
Storage.fsReady.load();

Storage.nwDeleteAllTeams = function (callback) {
	// only delete teams we've opened
	var deleteFilenames = [];
	for (var i = 0; i < this.teams.length; i++) {
		if (this.teams[i].filename) {
			deleteFilenames.push(this.teams[i].filename);
			delete this.teams[i].filename;
		}
	}
	if (!deleteFilenames.length) {
		if (callback) callback();
		return;
	}
	Storage.fsReady.unload();
	this.nwTeamsLeft = deleteFilenames.length;
	for (var i = 0; i < deleteFilenames.length; i++) {
		this.nwDeleteTeamFile(deleteFilenames[i], callback);
	}
};

Storage.nwDeleteTeamFile = function (filename, callback) {
	if (filename.slice(-4).toLowerCase() !== '.txt') {
		// not a team file
		this.nwTeamsLeft--;
		if (!this.nwTeamsLeft) {
			if (callback) callback();
			Storage.fsReady.load();
		}
		return;
	}
	var self = this;
	fs.unlink(this.dir + 'Teams/' + filename, function (err) {
		var directory = filename.split('/').slice(0, -1).join('/');
		fs.rmdir(directory, function () {});

		self.nwTeamsLeft--;
		if (!self.nwTeamsLeft) {
			if (callback) callback();
			Storage.fsReady.load();
		}
	});
};

Storage.nwSaveTeam = function (team) {
	if (!team) return;
	var filename = team.name + '.txt';
	if (team.format) filename = '[' + team.format + '] ' + filename;
	filename = filename.trim().replace(/[\\\/]+/g, '');
	if (team.folder) filename = '' + team.folder.replace(/[\\\/]+/g, '') + '/' + filename;

	// not too hard to support saving to nested directories, but loading is a whole other issue
	var splitFilename = filename.split('/');
	var folder = splitFilename.slice(0, -1).join('');
	var filename = folder + '/' + splitFilename[splitFilename.length - 1];
	try {
		fs.mkdirSync(this.dir + 'Teams/' + folder);
	} catch (e) {}

	if (team.filename && filename !== team.filename) {
		this.nwDeleteTeam(team);
	}
	team.filename = filename;
	fs.writeFile(this.dir + 'Teams/' + filename, Storage.exportTeam(team.team).replace(/\n/g, '\r\n'));
};

Storage.nwSaveTeams = function () {
	// should never happen
	try {
		console.log("nwSaveTeams called: " + new Error().stack);
	} catch (e) {}
};

Storage.nwDeleteTeam = function (team) {
	if (team.filename) {
		var oldFilename = team.filename;
		var oldDirectory = oldFilename.split('/').slice(0, -1).join('/');
		if (oldDirectory) oldDirectory = this.dir + 'Teams/' + oldDirectory;
		fs.unlink(this.dir + 'Teams/' + oldFilename, function () {
			if (oldDirectory) fs.rmdir(oldDirectory, function () {});
		});
	}
};

Storage.nwSaveAllTeams = function () {
	var self = this;
	Storage.fsReady(function () {
		self.nwDoSaveAllTeams();
	});
};

Storage.nwDoSaveAllTeams = function () {
	for (var i = 0; i < this.teams.length; i++) {
		var team = this.teams[i];
		var filename = team.name + '.txt';
		if (team.format) filename = '[' + team.format + '] ' + filename;
		filename = $.trim(filename).replace(/[\\\/]+/g, '');

		team.filename = filename;
		fs.writeFile(this.dir + 'Teams/' + filename, Storage.exportTeam(team.team).replace(/\n/g, '\r\n'));
	}
};

// logs

Storage.getLogMonth = function () {
	var now = new Date();
	var month = '' + (now.getMonth() + 1);
	if (month.length < 2) month = '0' + month;
	return '' + now.getFullYear() + '-' + month;
};
Storage.nwStartLoggingChat = function () {
	var self = this;
	if (!self.documentsDir) return; // too early; initDirectory2 will call us when it's time
	if (self.loggingChat) return;
	// callback hell! ^_^
	fs.mkdir(self.dir + 'Logs', function () {
		self.chatLogFdMonth = self.getLogMonth();
		fs.mkdir(self.dir + 'Logs/' + self.chatLogFdMonth, function () {
			fs.stat(self.dir + 'Logs/' + self.chatLogFdMonth, function (err, stats) {
				if (err) return;
				if (stats.isDirectory()) {
					self.loggingChat = true;
					self.chatLogStreams = {};
				}
			});
		});
	});
};
Storage.nwStopLoggingChat = function () {
	if (!this.loggingChat) return;
	this.loggingChat = false;
	var streams = this.chatLogStreams;
	this.chatLogStreams = null;
	for (var i in streams) {
		streams[i].end();
	}
};
Storage.nwLogChat = function (roomid, line) {
	roomid = toRoomid(roomid);
	if (!this.loggingChat) return;
	var chatLogFdMonth = this.getLogMonth();
	if (chatLogFdMonth !== this.chatLogFdMonth) {
		this.chatLogFdMonth = chatLogFdMonth;
		var streams = this.chatLogStreams;
		this.chatLogStreams = {};
		for (var i in streams) {
			streams[i].end();
		}
	}

	var now = new Date();
	var hours = '' + now.getHours();
	if (hours.length < 2) hours = '0' + hours;
	var minutes = '' + now.getMinutes();
	if (minutes.length < 2) minutes = '0' + minutes;
	var timestamp = '[' + hours + ':' + minutes + '] ';

	if (!this.chatLogStreams[roomid]) {
		this.chatLogStreams[roomid] = fs.createWriteStream(this.dir + 'Logs/' + chatLogFdMonth + '/' + roomid + '.txt', {flags: 'a'});
		this.chatLogStreams[roomid].write('\n\n\nLog starting ' + now + '\n\n');
	}
	this.chatLogStreams[roomid].write(timestamp + line + '\n');
};

// saving

Storage.startLoggingChat = function () {};
Storage.stopLoggingChat = function () {};
Storage.logChat = function () {};

Storage.initialize();
