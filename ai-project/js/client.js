(function ($) {

	Config.sockjsprefix = '/showdown';
	Config.root = '/';

	if (window.nodewebkit) {
		window.gui = require('nw.gui');
		window.nwWindow = gui.Window.get();
	}
	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		// Android mobile-web-app-capable doesn't support it very well, but iOS
		// does it fine, so we're only going to show this to iOS for now
		$('head').append('<meta name="apple-mobile-web-app-capable" content="yes" />');
	}

	$(document).on('keydown', function (e) {
		if (e.keyCode == 27) { // Esc
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			app.closePopup();
		}
	});
	$(window).on('dragover', function (e) {
		if (/^text/.test(e.target.type)) return; // Ignore text fields

		e.preventDefault();
	});
	$(document).on('dragenter', function (e) {
		if (/^text/.test(e.target.type)) return; // Ignore text fields

		e.preventDefault();

		if (!app.dragging && app.curRoom.id === 'teambuilder') {
			var dataTransfer = e.originalEvent.dataTransfer;
			if (dataTransfer.files && dataTransfer.files[0]) {
				var file = dataTransfer.files[0];
				if (file.name.slice(-4) === '.txt') {
					// Someone dragged in a .txt file, hand it to the teambuilder
					app.curRoom.defaultDragEnterTeam(e);
				}
			} else if (dataTransfer.items && dataTransfer.items[0]) {
				// no files or no permission to access files
				var item = dataTransfer.items[0];
				if (item.kind === 'file' && item.type === 'text/plain') {
					// Someone dragged in a .txt file, hand it to the teambuilder
					app.curRoom.defaultDragEnterTeam(e);
				}
			}
		}

		// dropEffect !== 'none' prevents buggy bounce-back animation in
		// Chrome/Safari/Opera
		e.originalEvent.dataTransfer.dropEffect = 'move';
	});
	$(window).on('drop', function (e) {
		if (/^text/.test(e.target.type)) return; // Ignore text fields

		// The default team drop action for Firefox is to open the team as a
		// URL, which needs to be prevented.
		// The default file drop action for most browsers is to open the file
		// in the tab, which is generally undesirable anyway.
		e.preventDefault();
		if (app.dragging && app.draggingRoom) {
			app.rooms[app.draggingRoom].defaultDropTeam(e);
		} else if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var file = e.originalEvent.dataTransfer.files[0];
			if (file.name.slice(-4) === '.txt' && app.curRoom.id === 'teambuilder') {
				// Someone dragged in a .txt file, hand it to the teambuilder
				app.curRoom.defaultDragEnterTeam(e);
				app.curRoom.defaultDropTeam(e);
			} else if (file.type && file.type.substr(0, 6) === 'image/') {
				// It's an image file, try to set it as a background
				CustomBackgroundPopup.readFile(file);
			} else if (file.type && file.type === 'text/html') {
				BattleRoom.readReplayFile(file);
			}
		}
	});
	if (window.nodewebkit) {
		$(document).on("contextmenu", function (e) {
			e.preventDefault();
			var target = e.target;
			var isEditable = (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT');
			var menu = new gui.Menu();

			if (isEditable) menu.append(new gui.MenuItem({
				label: "Cut",
				click: function () {
					document.execCommand("cut");
				}
			}));
			var link = $(target).closest('a')[0];
			if (link) menu.append(new gui.MenuItem({
				label: "Copy Link URL",
				click: function () {
					gui.Clipboard.get().set(link.href);
				}
			}));
			if (target.tagName === 'IMG') menu.append(new gui.MenuItem({
				label: "Copy Image URL",
				click: function () {
					gui.Clipboard.get().set(target.src);
				}
			}));
			menu.append(new gui.MenuItem({
				label: "Copy",
				click: function () {
					document.execCommand("copy");
				}
			}));
			if (isEditable) menu.append(new gui.MenuItem({
				label: "Paste",
				enabled: !!gui.Clipboard.get().get(),
				click: function () {
					document.execCommand("paste");
				}
			}));

			menu.popup(e.originalEvent.x, e.originalEvent.y);
		});
	}

	// support Safari 6 notifications
	if (!window.Notification && window.webkitNotification) {
		window.Notification = window.webkitNotification;
	}

	// this is called being lazy
	window.selectTab = function (tab) {
		app.tryJoinRoom(tab);
		return false;
	};

	var User = this.User = Backbone.Model.extend({
		defaults: {
			name: '',
			userid: '',
			registered: false,
			named: false,
			avatar: 0
		},
		initialize: function () {
			app.addGlobalListeners();
			app.on('response:userdetails', function (data) {
				if (data.userid === this.get('userid')) {
					this.set('avatar', '' + data.avatar);
				}
			}, this);
			var self = this;
			this.on('change:name', function () {
				if (!self.get('named')) {
					self.nameRegExp = null;
				} else {
					var escaped = self.get('name').replace(/[^A-Za-z0-9]+$/, '');
					// we'll use `,` as a sentinel character to mean "any non-alphanumeric char"
					// unicode characters can be replaced with any non-alphanumeric char
					for (var i = escaped.length - 1; i > 0; i--) {
						if (/[^\ -\~]/.test(escaped[i])) {
							escaped = escaped.slice(0, i) + ',' + escaped.slice(i + 1);
						}
					}
					escaped = escaped.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					escaped = escaped.replace(/,/g, "[^A-Za-z0-9]?");
					self.nameRegExp = new RegExp('(?:\\b|(?!\\w))' + escaped + '(?:\\b|\\B(?!\\w))', 'i');
				}
			});

			var replaceList = {'A': 'ＡⱯȺ', 'B': 'ＢƂƁɃ', 'C': 'ＣꜾȻ', 'D': 'ＤĐƋƊƉꝹ', 'E': 'ＥƐƎ', 'F': 'ＦƑꝻ', 'G': 'ＧꞠꝽꝾ', 'H': 'ＨĦⱧⱵꞍ', 'I': 'ＩƗ', 'J': 'ＪɈ', 'K': 'ＫꞢ', 'L': 'ＬꝆꞀ', 'M': 'ＭⱮƜ', 'N': 'ＮȠƝꞐꞤ', 'O': 'ＯǪǬØǾƆƟꝊꝌ', 'P': 'ＰƤⱣꝐꝒꝔ', 'Q': 'ＱꝖꝘɊ', 'R': 'ＲɌⱤꝚꞦꞂ', 'S': 'ＳẞꞨꞄ', 'T': 'ＴŦƬƮȾꞆ', 'U': 'ＵɄ', 'V': 'ＶƲꝞɅ', 'W': 'ＷⱲ', 'X': 'Ｘ', 'Y': 'ＹɎỾ', 'Z': 'ＺƵȤⱿⱫꝢ', 'a': 'ａąⱥɐ', 'b': 'ｂƀƃɓ', 'c': 'ｃȼꜿↄ', 'd': 'ｄđƌɖɗꝺ', 'e': 'ｅɇɛǝ', 'f': 'ｆḟƒꝼ', 'g': 'ｇɠꞡᵹꝿ', 'h': 'ｈħⱨⱶɥ', 'i': 'ｉɨı', 'j': 'ｊɉ', 'k': 'ｋƙⱪꝁꝃꝅꞣ', 'l': 'ｌſłƚɫⱡꝉꞁꝇ', 'm': 'ｍɱɯ', 'n': 'ｎƞɲŉꞑꞥ', 'o': 'ｏǫǭøǿɔꝋꝍɵ', 'p': 'ｐƥᵽꝑꝓꝕ', 'q': 'ｑɋꝗꝙ', 'r': 'ｒɍɽꝛꞧꞃ', 's': 'ｓꞩꞅẛ', 't': 'ｔŧƭʈⱦꞇ', 'u': 'ｕưừứữửựųṷṵʉ', 'v': 'ｖʋꝟʌ', 'w': 'ｗⱳ', 'x': 'ｘ', 'y': 'ｙɏỿ', 'z': 'ｚƶȥɀⱬꝣ', 'AA': 'Ꜳ', 'AE': 'ÆǼǢ', 'AO': 'Ꜵ', 'AU': 'Ꜷ', 'AV': 'ꜸꜺ', 'AY': 'Ꜽ', 'DZ': 'ǱǄ', 'Dz': 'ǲǅ', 'LJ': 'Ǉ', 'Lj': 'ǈ', 'NJ': 'Ǌ', 'Nj': 'ǋ', 'OI': 'Ƣ', 'OO': 'Ꝏ', 'OU': 'Ȣ', 'TZ': 'Ꜩ', 'VY': 'Ꝡ', 'aa': 'ꜳ', 'ae': 'æǽǣ', 'ao': 'ꜵ', 'au': 'ꜷ', 'av': 'ꜹꜻ', 'ay': 'ꜽ', 'dz': 'ǳǆ', 'hv': 'ƕ', 'lj': 'ǉ', 'nj': 'ǌ', 'oi': 'ƣ', 'ou': 'ȣ', 'oo': 'ꝏ', 'ss': 'ß', 'tz': 'ꜩ', 'vy': 'ꝡ'};
			var normalizeList = {'A': 'ÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄ', 'B': 'ḂḄḆ', 'C': 'ĆĈĊČÇḈƇ', 'D': 'ḊĎḌḐḒḎ', 'E': 'ÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚ', 'F': 'Ḟ', 'G': 'ǴĜḠĞĠǦĢǤƓ', 'H': 'ĤḢḦȞḤḨḪ', 'I': 'ÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬ', 'J': 'Ĵ', 'K': 'ḰǨḲĶḴƘⱩꝀꝂꝄ', 'L': 'ĿĹĽḶḸĻḼḺŁȽⱢⱠꝈ', 'M': 'ḾṀṂ', 'N': 'ǸŃÑṄŇṆŅṊṈ', 'O': 'ÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘ', 'P': 'ṔṖ', 'Q': '', 'R': 'ŔṘŘȐȒṚṜŖṞ', 'S': 'ŚṤŜṠŠṦṢṨȘŞⱾ', 'T': 'ṪŤṬȚŢṰṮ', 'U': 'ÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴ', 'V': 'ṼṾ', 'W': 'ẀẂŴẆẄẈ', 'X': 'ẊẌ', 'Y': 'ỲÝŶỸȲẎŸỶỴƳ', 'Z': 'ŹẐŻŽẒẔ', 'a': 'ẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁ', 'b': 'ḃḅḇ', 'c': 'ćĉċčçḉƈ', 'd': 'ḋďḍḑḓḏ', 'e': 'èéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛ', 'f': '', 'g': 'ǵĝḡğġǧģǥ', 'h': 'ĥḣḧȟḥḩḫẖ', 'i': 'ìíîĩīĭïḯỉǐȉȋịįḭ', 'j': 'ĵǰ', 'k': 'ḱǩḳķḵ', 'l': 'ŀĺľḷḹļḽḻ', 'm': 'ḿṁṃ', 'n': 'ǹńñṅňṇņṋṉ', 'o': 'òóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộ', 'p': 'ṕṗ', 'q': '', 'r': 'ŕṙřȑȓṛṝŗṟ', 's': 'śṥŝṡšṧṣṩșşȿ', 't': 'ṫẗťṭțţṱṯ', 'u': 'ùúûũṹūṻŭüǜǘǖǚủůűǔȕȗụṳ', 'v': 'ṽṿ', 'w': 'ẁẃŵẇẅẘẉ', 'x': 'ẋẍ', 'y': 'ỳýŷỹȳẏÿỷẙỵƴ', 'z': 'źẑżžẓẕ'};
			for (var i in replaceList) {
				replaceList[i] = new RegExp('[' + replaceList[i] + ']', 'g');
			}
			for (var i in normalizeList) {
				normalizeList[i] = new RegExp('[' + normalizeList[i] + ']', 'g');
			}
			this.replaceList = replaceList;
			this.normalizeList = normalizeList;
		},
		/**
		 * Return the path to the login server `action.php` file. AJAX requests
		 * to this file will always be made on the `play.pokemonshowdown.com`
		 * domain in order to have access to the correct cookies.
		 */
		getActionPHP: function () {
			var ret = '/~~' + Config.server.id + '/action.php';
			if (Config.testclient) {
				ret = 'https://' + Config.origindomain + ret;
			}
			return (this.getActionPHP = function () {
				return ret;
			})();
		},
		/**
		 * Process a signed assertion returned from the login server.
		 * Emits the following events (arguments in brackets):
		 *
		 *   `login:authrequired` (name)
		 *     triggered if the user needs to authenticate with this name
		 *
		 *   `login:invalidname` (name, error)
		 *     triggered if the user's name is invalid
		 *
		 *   `login:noresponse`
		 *     triggered if the login server did not return a response
		 */
		finishRename: function (name, assertion) {
			if (assertion.slice(0, 14).toLowerCase() === '<!doctype html') {
				// some sort of MitM proxy; ignore it
				var endIndex = assertion.indexOf('>');
				if (endIndex > 0) assertion = assertion.slice(endIndex + 1);
			}
			if (assertion.charAt(0) === '\r') assertion = assertion.slice(1);
			if (assertion.charAt(0) === '\n') assertion = assertion.slice(1);
			if (assertion.indexOf('<') >= 0) {
				app.addPopupMessage("Something is interfering with our connection to the login server. Most likely, your internet provider needs you to re-log-in, or your internet provider is blocking Pokémon Showdown.");
				return;
			}
			if (assertion === ';') {
				this.trigger('login:authrequired', name);
			} else if (assertion === ';;@gmail') {
				this.trigger('login:authrequired', name, '@gmail');
			} else if (assertion.substr(0, 2) === ';;') {
				this.trigger('login:invalidname', name, assertion.substr(2));
			} else if (assertion.indexOf('\n') >= 0 || !assertion) {
				app.addPopupMessage("Something is interfering with our connection to the login server.");
			} else {
				app.send('/trn ' + name + ',0,' + assertion);
			}
		},
		/**
		 * Rename this user to an arbitrary username. If the username is
		 * registered and the user does not currently have a session
		 * associated with that userid, then the user will be required to
		 * authenticate.
		 *
		 * See `finishRename` above for a list of events this can emit.
		 */
		rename: function (name) {
			// | , ; are not valid characters in names
			name = name.replace(/[\|,;]+/g, '');
			for (var i in this.replaceList) {
				name = name.replace(this.replaceList[i], i);
			}
			for (var i in this.normalizeList) {
				name = name.replace(this.normalizeList[i], i);
			}
			var userid = toUserid(name);
			if (!userid) {
				app.addPopupMessage("Usernames must contain at least one letter.");
				return;
			}

			if (this.get('userid') !== userid) {
				var self = this;
				$.post(this.getActionPHP(), {
					act: 'getassertion',
					userid: userid,
					challstr: this.challstr
				}, function (data) {
					self.finishRename(name, data);
				});
			} else {
				app.send('/trn ' + name);
			}
		},
		passwordRename: function (name, password, special) {
			var self = this;
			$.post(this.getActionPHP(), {
				act: 'login',
				name: name,
				pass: password,
				challstr: this.challstr
			}, Storage.safeJSON(function (data) {
				if (data && data.curuser && data.curuser.loggedin) {
					// success!
					self.set('registered', data.curuser);
					self.finishRename(name, data.assertion);
				} else {
					// wrong password
					if (special === '@gmail') {
						try {
							gapi.auth2.getAuthInstance().signOut(); // eslint-disable-line no-undef
						} catch (e) {}
					}
					app.addPopup(LoginPasswordPopup, {
						username: name,
						error: data.error || 'Wrong password.',
						special: special
					});
				}
			}), 'text');
		},
		challstr: '',
		receiveChallstr: function (challstr) {
			if (challstr) {
				/**
				 * Rename the user based on the `sid` and `showdown_username` cookies.
				 * Specifically, if the user has a valid session, the user will be
				 * renamed to the username associated with that session. If the user
				 * does not have a valid session but does have a persistent username
				 * (i.e. a `showdown_username` cookie), the user will be renamed to
				 * that name; if that name is registered, the user will be required
				 * to authenticate.
				 *
				 * See `finishRename` above for a list of events this can emit.
				 */
				this.challstr = challstr;
				var self = this;
				$.post(this.getActionPHP(), {
					act: 'upkeep',
					challstr: this.challstr
				}, Storage.safeJSON(function (data) {
					self.loaded = true;
					if (!data.username) {
						app.topbar.updateUserbar();
						return;
					}

					// | , ; are not valid characters in names
					data.username = data.username.replace(/[\|,;]+/g, '');

					if (data.loggedin) {
						self.set('registered', {
							username: data.username,
							userid: toUserid(data.username)
						});
					}
					self.finishRename(data.username, data.assertion);
				}), 'text');
			}
		},
		/**
		 * Log out from the server (but remain connected as a guest).
		 */
		logout: function () {
			$.post(this.getActionPHP(), {
				act: 'logout',
				userid: this.get('userid')
			});
			app.send('/logout');
			app.trigger('init:socketclosed', "You have been logged out and disconnected.<br /><br />If you wanted to change your name while staying connected, use the 'Change Name' button or the '/nick' command.", false);
			app.socket.close();
		},
		setPersistentName: function (name) {
			if (location.host !== 'play.pokemonshowdown.com') return;
			$.cookie('showdown_username', (name !== undefined) ? name : this.get('name'), {
				expires: 14
			});
		}
	});

	this.App = Backbone.Router.extend({
		root: '/',
		routes: {
			'*path': 'dispatchFragment'
		},
		focused: true,
		initialize: function () {
			window.app = this;
			this.initializeRooms();
			this.initializePopups();

			this.user = new User();
			this.ignore = {};
			this.supports = {};

			// down
			// if (document.location.hostname === 'play.pokemonshowdown.com') this.down = 'dos';

			this.addRoom('');
			this.topbar = new Topbar({el: $('#header')});
			if (this.down) {
				this.isDisconnected = true;
			} else {
				if (document.location.hostname === 'play.pokemonshowdown.com' || Config.testclient) {
					this.addRoom('rooms', null, true);
				} else {
					this.addRoom('lobby', null, true);
				}
				Storage.whenPrefsLoaded(function () {
					if (!Config.server.registered) {
						app.send('/autojoin');
						Backbone.history.start({pushState: !Config.testclient});
						return;
					}
					var autojoin = (Dex.prefs('autojoin') || '');
					var autojoinIds = [];
					if (typeof autojoin === 'string') {
						// Use the existing autojoin string for showdown, and an empty string for other servers.
						if (Config.server.id !== 'showdown') autojoin = '';
					} else {
						// If there is not autojoin data for this server, use a empty string.
						autojoin = autojoin[Config.server.id] || '';
					}
					if (autojoin) {
						var autojoins = autojoin.split(',');
						for (var i = 0; i < autojoins.length; i++) {
							var roomid = toRoomid(autojoins[i]);
							app.addRoom(roomid, null, true, autojoins[i]);
							if (roomid === 'staff' || roomid === 'upperstaff') continue;
							if (Config.server.id !== 'showdown' && roomid === 'lobby') continue;
							autojoinIds.push(roomid);
						}
					}
					app.send('/autojoin ' + autojoinIds.join(','));

					// HTML5 history throws exceptions when running on file://
					Backbone.history.start({pushState: !Config.testclient});
				});
			}

			var self = this;

			Storage.whenPrefsLoaded(function () {
				Storage.prefs('bg', null);

				var muted = Dex.prefs('mute');
				BattleSound.setMute(muted);

				$('html').toggleClass('dark', !!Dex.prefs('dark'));

				var effectVolume = Dex.prefs('effectvolume');
				if (effectVolume !== undefined) BattleSound.setEffectVolume(effectVolume);

				var musicVolume = Dex.prefs('musicvolume');
				if (musicVolume !== undefined) BattleSound.setBgmVolume(musicVolume);

				if (Dex.prefs('logchat')) Storage.startLoggingChat();
				if (Dex.prefs('showdebug')) {
					var debugStyle = $('#debugstyle').get(0);
					var onCSS = '.debug {display: block;}';
					if (!debugStyle) {
						$('head').append('<style id="debugstyle">' + onCSS + '</style>');
					} else {
						debugStyle.innerHTML = onCSS;
					}
				}

				if (Dex.prefs('onepanel')) {
					self.singlePanelMode = true;
					self.updateLayout();
				}

				if (Dex.prefs('bwgfx') || Dex.prefs('noanim')) {
					// since xy data is loaded by default, only call
					// loadSpriteData if we want bw sprites or if we need bw
					// sprite data (if animations are disabled)
					Dex.loadSpriteData('bw');
				}
			});

			this.on('init:unsupported', function () {
				self.addPopupMessage('Your browser is unsupported.');
			});

			this.on('init:nothirdparty', function () {
				self.addPopupMessage('You have third-party cookies disabled in your browser, which is likely to cause problems. You should enable them and then refresh this page.');
			});

			this.on('init:socketclosed', function (message, showNotification) {
				// Display a desktop notification if the user won't immediately see the popup.
				if (self.isDisconnected) return;
				self.isDisconnected = true;
				if (showNotification !== false && (self.popups.length || !self.focused) && window.Notification) {
					self.rooms[''].requestNotifications();
					var disconnect = new Notification("Disconnected!", {lang: 'en', body: "You have been disconnected from Pokémon Showdown."});
					disconnect.onclick = function (e) {
						window.focus();
					};
				}
				self.rooms[''].updateFormats();
				$('.pm-log-add form').html('<small>You are disconnected and cannot chat.</small>');
				$('.chat-log-add').html('<small>You are disconnected and cannot chat.</small>');
				self.reconnectPending = (message || true);
				if (!self.popups.length) self.addPopup(ReconnectPopup, {message: message});
			});

			this.on('init:connectionerror', function () {
				self.isDisconnected = true;
				self.rooms[''].updateFormats();
				self.addPopup(ReconnectPopup, {cantconnect: true});
			});

			this.user.on('login:invalidname', function (name, reason) {
				self.addPopup(LoginPopup, {name: name, reason: reason});
			});

			this.user.on('login:authrequired', function (name, special) {
				self.addPopup(LoginPasswordPopup, {username: name, special: special});
			});

			this.on('response:savereplay', this.uploadReplay, this);

			this.on('response:rooms', this.roomsResponse, this);

			if (window.nodewebkit) {
				nwWindow.on('focus', function () {
					if (!self.focused) {
						self.focused = true;
						if (self.curRoom) self.curRoom.dismissNotification();
						if (self.curSideRoom) self.curSideRoom.dismissNotification();
					}
				});
				nwWindow.on('blur', function () {
					self.focused = false;
				});
			} else {
				$(window).on('focus click', function () {
					if (!self.focused) {
						self.focused = true;
						if (self.curRoom) self.curRoom.dismissNotification();
						if (self.curSideRoom) self.curSideRoom.dismissNotification();
					}
				});
				$(window).on('blur', function () {
					self.focused = false;
				});
			}

			$(window).on('beforeunload', function (e) {
				if (Config.server && Config.server.host === 'localhost') return;
				if (app.isDisconnected) return;
				for (var id in self.rooms) {
					var room = self.rooms[id];
					if (room && room.requestLeave && !room.requestLeave()) return "You have active battles.";
				}
			});

			$(window).on('keydown', function (e) {
				var el = e.target;
				var tagName = el.tagName.toUpperCase();

				// keypress happened in an empty textarea or a button
				var safeLocation = ((tagName === 'TEXTAREA' && !el.value.length) || tagName === 'BUTTON');
				var isMac = (navigator.userAgent.indexOf("Mac") !== -1);

				if (e.keyCode === 70 && window.nodewebkit && (isMac ? e.metaKey : e.ctrlKey)) {
					e.preventDefault();
					e.stopImmediatePropagation();
					var query = window.getSelection().toString();
					query = window.prompt("find?", query);
					if (query) window.find(query);
					return;
				}
				if (e.keyCode === 71 && window.nodewebkit && (isMac ? e.metaKey : e.ctrlKey)) {
					e.preventDefault();
					e.stopImmediatePropagation();
					var query = window.getSelection().toString();
					if (query) window.find(query);
					return;
				}
				if (app.curSideRoom && $(e.target).closest(app.curSideRoom.$el).length) {
					// keypress happened in sideroom
					if (e.shiftKey && e.keyCode === 37 && safeLocation) {
						// Shift+Left on desktop client
						if (app.moveRoomBy(app.curSideRoom, -1)) {
							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} else if (e.shiftKey && e.keyCode === 39 && safeLocation) {
						// Shift+Right on desktop client
						if (app.moveRoomBy(app.curSideRoom, 1)) {
							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} else if (e.keyCode === 37 && safeLocation || window.nodewebkit && e.ctrlKey && e.shiftKey && e.keyCode === 9) {
						// Left or Ctrl+Shift+Tab on desktop client
						if (app.focusRoomBy(app.curSideRoom, -1)) {
							e.preventDefault();
							e.stopImmediatePropagation();
						}
					} else if (e.keyCode === 39 && safeLocation || window.nodewebkit && e.ctrlKey && e.keyCode === 9) {
						// Right or Ctrl+Tab on desktop client
						if (app.focusRoomBy(app.curSideRoom, 1)) {
							e.preventDefault();
							e.stopImmediatePropagation();
						}
					}
					return;
				}
				// keypress happened outside of sideroom
				if (e.shiftKey && e.keyCode === 37 && safeLocation) {
					// Shift+Left on desktop client
					if (app.moveRoomBy(app.curRoom, -1)) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				} else if (e.shiftKey && e.keyCode === 39 && safeLocation) {
					// Shift+Right on desktop client
					if (app.moveRoomBy(app.curRoom, 1)) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				} else if (e.keyCode === 37 && safeLocation || window.nodewebkit && e.ctrlKey && e.shiftKey && e.keyCode === 9) {
					// Left or Ctrl+Shift+Tab on desktop client
					if (app.focusRoomBy(app.curRoom, -1)) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				} else if (e.keyCode === 39 && safeLocation || window.nodewebkit && e.ctrlKey && e.keyCode === 9) {
					// Right or Ctrl+Tab on desktop client
					if (app.focusRoomBy(app.curRoom, 1)) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}
				}
			});

			Storage.whenAppLoaded.load(this);

			this.initializeConnection();
		},
		/**
		 * Start up the client, including loading teams and preferences,
		 * determining which server to connect to, and actually establishing
		 * a connection to that server.
		 *
		 * Triggers the following events (arguments in brackets):
		 *   `init:unsupported`
		 * 	   triggered if the user's browser is unsupported
		 *
		 *   `init:nothirdparty`
		 *     triggered if the user has third-party cookies disabled and
		 *     third-party cookies/storage are necessary for full functioning
		 *     (i.e. stuff will probably be broken for the user, so show an
		 *     error message)
		 *
		 *   `init:socketopened`
		 *     triggered once a socket has been opened to the sim server; this
		 *     does NOT mean that the user has signed in yet, merely that the
		 *     SockJS connection has been established.
		 *
		 *   `init:connectionerror`
		 *     triggered if a connection to the sim server could not be
		 *     established
		 *
		 *   `init:socketclosed`
		 *     triggered if the SockJS socket closes
		 */
		initializeConnection: function () {
			Storage.whenPrefsLoaded(function () {
				// if (Config.server.id !== 'smogtours') Config.server.afd = true;
				app.connect();
			});
		},
		/**
		 * This function establishes the actual connection to the sim server.
		 * This is intended to be called only by `initializeConnection` above.
		 * Don't call this function directly.
		 */
		connect: function () {
			if (this.down) return;

			if (Config.server.banned || (Config.bannedHosts && Config.bannedHosts.indexOf(Config.server.host) >= 0)) {
				this.addPopupMessage("This server has been deleted for breaking US laws, impersonating PS global staff, or other major rulebreaking.");
				return;
			}

			var self = this;
			var constructSocket = function () {
				var protocol = (Config.server.port === 443) ? 'https' : 'http';
				Config.server.host = $.trim(Config.server.host);
				return new SockJS(protocol + '://' + Config.server.host + ':' +
					Config.server.port + Config.sockjsprefix);
			};
			this.socket = constructSocket();
			setInterval(function () {
				if (Config.server.host !== $.trim(Config.server.host)) {
					app.socket.close();
				}
			}, 500);

			var socketopened = false;
			var altport = (Config.server.port === Config.server.altport);
			var altprefix = false;

			this.socket.onopen = function () {
				socketopened = true;
				if (altport && window.ga) {
					ga('send', 'event', 'Alt port connection', Config.server.id);
				}
				self.trigger('init:socketopened');

				var avatar = Dex.prefs('avatar');
				if (avatar) {
					// This will be compatible even with servers that don't support
					// the second argument for /avatar yet.
					self.send('/avatar ' + avatar + ',1');
				}

				if (self.sendQueue) {
					var queue = self.sendQueue;
					delete self.sendQueue;
					for (var i = 0; i < queue.length; i++) {
						self.send(queue[i], true);
					}
				}
			};
			this.socket.onmessage = function (msg) {
				if (window.console && console.log) {
					console.log('<< ' + msg.data);
				}
				self.receive(msg.data);
			};
			var reconstructSocket = function (socket) {
				var s = constructSocket();
				s.onopen = socket.onopen;
				s.onmessage = socket.onmessage;
				s.onclose = socket.onclose;
				return s;
			};
			this.socket.onclose = function () {
				if (!socketopened) {
					if (Config.server.altport && !altport) {
						altport = true;
						Config.server.port = Config.server.altport;
						self.socket = reconstructSocket(self.socket);
						return;
					}
					if (!altprefix) {
						altprefix = true;
						Config.sockjsprefix = '';
						self.socket = reconstructSocket(self.socket);
						return;
					}
					return self.trigger('init:connectionerror');
				}
				self.trigger('init:socketclosed');
			};
		},
		dispatchFragment: function (fragment) {
			if (!Config.testclient && location.search && window.history) {
				history.replaceState(null, null, location.pathname);
			}
			this.fragment = fragment = toRoomid(fragment || '');
			if (this.initialFragment === undefined) this.initialFragment = fragment;
			this.tryJoinRoom(fragment);
			this.updateTitle(this.rooms[fragment]);
		},
		/**
		 * Send to sim server
		 */
		send: function (data, room) {
			if (room && room !== 'lobby' && room !== true) {
				data = room + '|' + data;
			} else if (room !== true) {
				data = '|' + data;
			}
			if (!this.socket || (this.socket.readyState !== SockJS.OPEN)) {
				if (!this.sendQueue) this.sendQueue = [];
				this.sendQueue.push(data);
				return;
			}
			if (window.console && console.log) {
				console.log('>> ' + data);
			}
			this.socket.send(data);
		},
		/**
		 * Send team to sim server
		 */
		sendTeam: function (team) {
			var packedTeam = '' + Storage.getPackedTeam(team);
			if (packedTeam.length > 100 * 1024 - 6) {
				alert("Your team is over 100 KB, usually caused by having over 600 Pokemon in it. Please use a smaller team.");
				return;
			}
			this.send('/utm ' + packedTeam);
		},
		/**
		 * Receive from sim server
		 */
		receive: function (data) {
			var roomid = '';
			var autojoined = false;
			if (data.charAt(0) === '>') {
				var nlIndex = data.indexOf('\n');
				if (nlIndex < 0) return;
				roomid = toRoomid(data.substr(1, nlIndex - 1));
				data = data.substr(nlIndex + 1);
			}
			if (data.substr(0, 6) === '|init|') {
				if (!roomid) roomid = 'lobby';
				var roomType = data.substr(6);
				var roomTypeLFIndex = roomType.indexOf('\n');
				if (roomTypeLFIndex >= 0) roomType = roomType.substr(0, roomTypeLFIndex);
				roomType = toId(roomType);
				if (this.rooms[roomid] || roomid === 'staff' || roomid === 'upperstaff') {
					// autojoin rooms are joined in background
					this.addRoom(roomid, roomType, true);
				} else {
					this.joinRoom(roomid, roomType, true);
				}
				if (roomType === 'chat') autojoined = true;
			} else if ((data + '|').substr(0, 8) === '|expire|') {
				var room = this.rooms[roomid];
				if (room) {
					room.expired = (data.substr(8) || true);
					if (room.updateUser) room.updateUser();
				}
				return;
			} else if ((data + '|').substr(0, 8) === '|deinit|' || (data + '|').substr(0, 8) === '|noinit|') {
				if (!roomid) roomid = 'lobby';

				if (this.rooms[roomid] && this.rooms[roomid].expired) {
					// expired rooms aren't closed when left
					return;
				}

				var isdeinit = (data.charAt(1) === 'd');
				data = data.substr(8);
				var pipeIndex = data.indexOf('|');
				var errormessage;
				if (pipeIndex >= 0) {
					errormessage = data.substr(pipeIndex + 1);
					data = data.substr(0, pipeIndex);
				}
				// handle error codes here
				// data is the error code
				if (data === 'namerequired') {
					var self = this;
					this.once('init:choosename', function () {
						self.send('/join ' + roomid);
					});
				} else if (data === 'rename') {
					this.renameRoom(roomid, errormessage);
				} else if (data === 'nonexistent' && Config.server.id && roomid.slice(0, 7) === 'battle-' && errormessage) {
					var replayid = roomid.slice(7);
					if (Config.server.id !== 'showdown') replayid = Config.server.id + '-' + replayid;
					var replayLink = 'https://replay.pokemonshowdown.com/' + replayid;
					$.ajax(replayLink + '.json', {dataType: 'json'}).done(function (replay) {
						if (replay) {
							var title = BattleLog.escapeHTML(replay.p1) + ' vs. ' + BattleLog.escapeHTML(replay.p2);
							app.receive('>battle-' + replayid + '\n|init|battle\n|title|' + title + '\n' + replay.log);
							app.receive('>battle-' + replayid + '\n|expire|<a href=' + replayLink + ' target="_blank">Open replay in new tab</a>');
						} else {
							errormessage += '\n\nResponse received, but no data.';
							app.addPopupMessage(errormessage);
						}
					}).fail(function () {
						app.removeRoom(roomid, true);
						errormessage += "\n\nThe battle you're looking for has expired. Battles expire after 15 minutes of inactivity unless they're saved.\nIn the future, remember to click \"Save replay\" to save a replay permanently.";
						app.addPopupMessage(errormessage);
					});
				} else if (data !== 'namepending') {
					if (isdeinit) { // deinit
						if (this.rooms[roomid] && this.rooms[roomid].type === 'chat') {
							this.removeRoom(roomid, true);
							this.updateAutojoin();
						} else {
							this.removeRoom(roomid, true);
						}
					} else { // noinit
						this.unjoinRoom(roomid);
						if (roomid === 'lobby') this.joinRoom('rooms');
					}
					if (errormessage) this.addPopupMessage(errormessage);
				}
				return;
			} else if (data.substr(0, 3) === '|N|') {
				var names = data.substr(1).split('|');
				if (app.ignore[toUserid(names[2])]) {
					app.ignore[toUserid(names[1])] = 1;
				}
			}
			if (roomid) {
				if (this.rooms[roomid]) {
					this.rooms[roomid].receive(data);
				}
				if (autojoined) this.updateAutojoin();
				return;
			}

			// Since roomid is blank, it could be either a global message or
			// a lobby message. (For bandwidth reasons, lobby messages can
			// have blank roomids.)

			// If it starts with a messagetype in the global messagetype
			// list, we'll assume global; otherwise, we'll assume lobby.

			var parts;
			if (data.charAt(0) === '|') {
				parts = data.substr(1).split('|');
			} else {
				parts = [];
			}

			switch (parts[0]) {
			case 'customgroups':
				var nlIndex = data.indexOf('\n');
				if (nlIndex > 0) {
					this.receive(data.substr(nlIndex + 1));
				}

				var tarRow = data.slice(14, nlIndex);
				this.parseGroups(tarRow);
				break;

			case 'challstr':
				if (parts[2]) {
					this.user.receiveChallstr(parts[1] + '|' + parts[2]);
				} else {
					this.user.receiveChallstr(parts[1]);
				}
				break;

			case 'formats':
				this.parseFormats(parts);
				break;

			case 'updateuser':
				var nlIndex = data.indexOf('\n');
				if (nlIndex > 0) {
					this.receive(data.substr(nlIndex + 1));
					nlIndex = parts[3].indexOf('\n');
					parts[3] = parts[3].substr(0, nlIndex);
				}
				var name = parts[1];
				var named = !!+parts[2];

				var userid = toUserid(name);
				if (userid === this.user.get('userid') && name !== this.user.get('name')) {
					$.post(app.user.getActionPHP(), {
						act: 'changeusername',
						username: name
					}, function () {}, 'text');
				}

				this.user.set({
					name: name,
					userid: userid,
					named: named,
					avatar: parts[3]
				});
				this.user.setPersistentName(named ? name : null);
				if (named) {
					this.trigger('init:choosename');
				}
				if (app.ignore[toUserid(name)]) {
					delete app.ignore[toUserid(name)];
				}
				break;

			case 'nametaken':
				app.addPopup(LoginPopup, {name: parts[1] || '', error: parts[2] || ''});
				break;

			case 'queryresponse':
				var responseData = JSON.parse(data.substr(16 + parts[1].length));
				app.trigger('response:' + parts[1], responseData);
				break;

			case 'updatechallenges':
				if (this.rooms['']) {
					this.rooms[''].updateChallenges(JSON.parse(data.substr(18)));
				}
				break;

			case 'updatesearch':
				if (this.rooms['']) {
					this.rooms[''].updateSearch(JSON.parse(data.substr(14)));
				}
				break;

			case 'popup':
				var maxWidth;
				var type = 'semimodal';
				data = data.substr(7);
				if (data.substr(0, 6) === '|wide|') {
					data = data.substr(6);
					maxWidth = 960;
				}
				if (data.substr(0, 7) === '|modal|') {
					data = data.substr(7);
					type = 'modal';
				}
				if (data.substr(0, 6) === '|html|') {
					data = data.substr(6);
					app.addPopup(Popup, {
						type: type,
						maxWidth: maxWidth,
						htmlMessage: BattleLog.sanitizeHTML(data)
					});
				} else {
					app.addPopup(Popup, {
						type: type,
						maxWidth: maxWidth,
						message: data.replace(/\|\|/g, '\n')
					});
				}
				if (this.rooms['']) this.rooms[''].resetPending();
				break;

			case 'disconnect':
				app.trigger('init:socketclosed', BattleLog.sanitizeHTML(data.substr(12)));
				break;

			case 'pm':
				var dataLines = data.split('\n');
				for (var i = 0; i < dataLines.length; i++) {
					parts = dataLines[i].slice(1).split('|');
					var message = parts.slice(3).join('|');
					this.rooms[''].addPM(parts[1], message, parts[2]);
					if (toUserid(parts[1]) !== app.user.get('userid')) {
						app.user.lastPM = toUserid(parts[1]);
					}
				}
				break;

			case 'roomerror':
				// deprecated; use |deinit| or |noinit|
				this.unjoinRoom(parts[1]);
				this.addPopupMessage(parts.slice(2).join('|'));
				break;

			case 'refresh':
				// refresh the page
				document.location.reload(true);
				break;

			case 'c':
			case 'chat':
				if (parts[1] === '~') {
					if (parts[2].substr(0, 6) === '/warn ') {
						app.addPopup(RulesPopup, {warning: parts[2].substr(6)});
						break;
					}
				}

			/* fall through */
			default:
				// the messagetype wasn't in our list of recognized global
				// messagetypes; so the message is presumed to be for the
				// lobby.
				if (this.rooms['lobby']) {
					this.rooms['lobby'].receive(data);
				}
				break;
			}
		},
		parseGroups: function (groupsList) {
			var data = null;
			try {
				data = JSON.parse(groupsList);
			} catch (e) {}
			if (!data) return; // broken JSON - keep default ranks

			var groups = {};
			// process the data and sort into the three auth tiers, 0, 1, and 2
			for (var i = 0; i < data.length; i++) {
				var entry = data[i];
				if (!entry) continue;

				var symbol = entry.symbol || ' ';
				var groupName = entry.name;
				var groupType = entry.type || 'user';

				if (groupType === 'normal' && !Config.defaultOrder) Config.defaultOrder = i + 0.5; // this is where any undeclared groups will be positioned in userlist
				if (!groupName) Config.defaultGroup = symbol;

				groups[symbol] = {
					name: groupName ? BattleLog.escapeHTML(groupName + ' (' + symbol + ')') : null,
					type: groupType,
					order: i + 1
				};
			}

			Config.groups = groups; // if nothing from above crashes (malicious json), then the client will use the new custom groups
		},
		parseFormats: function (formatsList) {
			var isSection = false;
			var section = '';

			var column = 0;
			var columnChanged = false;

			window.BattleFormats = {};
			for (var j = 1; j < formatsList.length; j++) {
				if (isSection) {
					section = formatsList[j];
					isSection = false;
				} else if (formatsList[j] === ',LL') {
					app.localLadder = true;
				} else if (formatsList[j] === '' || (formatsList[j].charAt(0) === ',' && !isNaN(formatsList[j].substr(1)))) {
					isSection = true;

					if (formatsList[j]) {
						var newColumn = parseInt(formatsList[j].substr(1), 10) || 0;
						if (column !== newColumn) {
							column = newColumn;
							columnChanged = true;
						}
					}
				} else {
					var name = formatsList[j];
					var searchShow = true;
					var challengeShow = true;
					var tournamentShow = true;
					var team = null;
					var teambuilderLevel = null;
					var lastCommaIndex = name.lastIndexOf(',');
					var code = lastCommaIndex >= 0 ? parseInt(name.substr(lastCommaIndex + 1), 16) : NaN;
					if (!isNaN(code)) {
						name = name.substr(0, lastCommaIndex);
						if (code & 1) team = 'preset';
						if (!(code & 2)) searchShow = false;
						if (!(code & 4)) challengeShow = false;
						if (!(code & 8)) tournamentShow = false;
						if (code & 16) teambuilderLevel = 50;
					} else {
						// Backwards compatibility: late 0.9.0 -> 0.10.0
						if (name.substr(name.length - 2) === ',#') { // preset teams
							team = 'preset';
							name = name.substr(0, name.length - 2);
						}
						if (name.substr(name.length - 2) === ',,') { // search-only
							challengeShow = false;
							name = name.substr(0, name.length - 2);
						} else if (name.substr(name.length - 1) === ',') { // challenge-only
							searchShow = false;
							name = name.substr(0, name.length - 1);
						}
					}
					var id = toId(name);
					var isTeambuilderFormat = !team && name.slice(-11) !== 'Custom Game';
					var teambuilderFormat = '';
					var teambuilderFormatName = '';
					if (isTeambuilderFormat) {
						teambuilderFormatName = name;
						if (id.slice(0, 3) !== 'gen') {
							teambuilderFormatName = '[Gen 6] ' + name;
						}
						var parenPos = teambuilderFormatName.indexOf('(');
						if (parenPos > 0 && name.slice(-1) === ')') {
							// variation of existing tier
							teambuilderFormatName = $.trim(teambuilderFormatName.slice(0, parenPos));
						}
						if (teambuilderFormatName !== name) {
							teambuilderFormat = toId(teambuilderFormatName);
							if (BattleFormats[teambuilderFormat]) {
								BattleFormats[teambuilderFormat].isTeambuilderFormat = true;
							} else {
								BattleFormats[teambuilderFormat] = {
									id: teambuilderFormat,
									name: teambuilderFormatName,
									team: team,
									section: section,
									column: column,
									rated: false,
									isTeambuilderFormat: true,
									effectType: 'Format'
								};
							}
							isTeambuilderFormat = false;
						}
					}
					if (BattleFormats[id] && BattleFormats[id].isTeambuilderFormat) {
						isTeambuilderFormat = true;
					}
					// make sure formats aren't out-of-order
					if (BattleFormats[id]) delete BattleFormats[id];
					BattleFormats[id] = {
						id: id,
						name: name,
						team: team,
						section: section,
						column: column,
						searchShow: searchShow,
						challengeShow: challengeShow,
						tournamentShow: tournamentShow,
						rated: searchShow && id.substr(4, 7) !== 'unrated',
						teambuilderLevel: teambuilderLevel,
						teambuilderFormat: teambuilderFormat,
						isTeambuilderFormat: isTeambuilderFormat,
						effectType: 'Format'
					};
				}
			}

			// Match base formats to their variants, if they are unavailable in the server.
			var multivariantFormats = {};
			for (var id in BattleFormats) {
				var teambuilderFormat = BattleFormats[BattleFormats[id].teambuilderFormat];
				if (!teambuilderFormat || multivariantFormats[teambuilderFormat.id]) continue;
				if (!teambuilderFormat.searchShow && !teambuilderFormat.challengeShow && !teambuilderFormat.tournamentShow) {
					// The base format is not available.
					if (teambuilderFormat.battleFormat) {
						multivariantFormats[teambuilderFormat.id] = 1;
						teambuilderFormat.battleFormat = '';
					} else {
						teambuilderFormat.battleFormat = id;
					}
				}
			}
			if (columnChanged) app.supports['formatColumns'] = true;
			this.trigger('init:formats');
		},
		uploadReplay: function (data) {
			var id = data.id;
			var serverid = Config.server.id && toId(Config.server.id.split(':')[0]);
			if (serverid && serverid !== 'showdown') id = serverid + '-' + id;
			$.post(app.user.getActionPHP() + '?act=uploadreplay', {
				log: data.log,
				id: id
			}, function (data) {
				if (data === 'success') {
					app.addPopup(ReplayUploadedPopup, {id: id});
				} else if (data === 'hash mismatch') {
					app.addPopupMessage("Someone else is already uploading a replay of this battle. Try again in five seconds.");
				} else if (data === 'not found') {
					app.addPopupMessage("This server isn't registered, and doesn't support uploading replays.");
				} else if (data === 'invalid id') {
					app.addPopupMessage("This server is using invalid battle IDs, so this replay can't be uploaded.");
				} else {
					app.addPopupMessage("Error while uploading replay: " + data);
				}
			});
		},
		roomsResponse: function (data) {
			if (data) {
				this.roomsData = data;
			}
			app.topbar.updateTabbar();
		},
		addGlobalListeners: function () {
			$(document).on('click', 'a', function (e) {
				if (this.className === 'closebutton') return; // handled elsewhere
				if (this.className.indexOf('minilogo') >= 0) return; // handled elsewhere
				if (!this.href) return; // should never happen
				if (this.host === 'play.pokemonshowdown.com' || this.host === 'psim.us' || this.host === location.host) {
					if (!e.cmdKey && !e.metaKey && !e.ctrlKey) {
						var target = this.pathname.substr(1);
						var shortLinks = /^(rooms?suggestions?|suggestions?|adminrequests?|bugs?|bugreports?|rules?|faq|credits?|news|privacy|contact|dex|insecure)$/;
						if (target === 'appeal' || target === 'appeals') target = 'view-help-request--appeal';
						if (target === 'report') target = 'view-help-request--report';
						if (target.indexOf('/') < 0 && target.indexOf('.') < 0 && !shortLinks.test(target)) {
							if (this.dataset && this.dataset.target === 'replace') {
								var roomEl = $(this).closest('.ps-room')[0];
								if (roomEl && roomEl.id) {
									var roomid = roomEl.id.slice(5);
									window.app.renameRoom(roomid, target);
									window.app.rooms[target].join();
									e.preventDefault();
									e.stopPropagation();
									e.stopImmediatePropagation();
								}
							}
							window.app.tryJoinRoom(target);
							e.preventDefault();
							e.stopPropagation();
							e.stopImmediatePropagation();
							return;
						}
					}
				}
				if (window.nodewebkit && this.target === '_blank') {
					gui.Shell.openExternal(this.href);
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
					return;
				}
				if (this.rel === 'noopener') {
					var formatOptions = Dex.prefs('chatformatting') || {};
					if (!formatOptions.hideinterstice && !BattleLog.interstice.isWhitelisted(this.href)) {
						this.href = BattleLog.interstice.getURI(this.href);
					}
				} else if (this.target === '_blank') {
					// for performance reasons, there's no reason to ever have an opener
					this.rel = 'noopener';
				}
			});
		},

		/*********************************************************
		 * Rooms
		 *********************************************************/

		initializeRooms: function () {
			this.rooms = Object.create(null); // {}
			this.roomList = [];
			this.sideRoomList = [];

			$(window).on('resize', _.bind(this.resize, this));
		},
		fixedWidth: true,
		resize: function () {
			if (window.screen && screen.width && screen.width >= 320) {
				if (this.fixedWidth) {
					document.getElementById('viewport').setAttribute('content', 'width=device-width');
					this.fixedWidth = false;
				}
			} else {
				if (!this.fixedWidth) {
					document.getElementById('viewport').setAttribute('content', 'width=320');
					this.fixedWidth = true;
				}
			}
			if (!app.roomsFirstOpen && !this.down && $(window).width() >= 916 && document.location.hostname === 'play.pokemonshowdown.com') {
				this.addRoom('rooms');
			}
			this.updateLayout();
		},
		// the currently active room
		curRoom: null,
		curSideRoom: null,
		sideRoom: null,
		joinRoom: function (id, type, nojoin) {
			if (this.rooms[id]) {
				this.focusRoom(id);
				if (this.rooms[id].rejoin) this.rooms[id].rejoin();
				return this.rooms[id];
			}
			if (id.substr(0, 11) === 'battle-gen5' && !Dex.loadedSpriteData['bw']) Dex.loadSpriteData('bw');

			var room = this._addRoom(id, type, nojoin);
			this.focusRoom(id);
			return room;
		},
		/**
		 * We tried to join a room but it didn't exist
		 */
		unjoinRoom: function (id, reason) {
			this.removeRoom(id, true);
			if (this.curRoom) this.navigate(this.curRoom.id, {replace: true});
			this.updateAutojoin();
		},
		tryJoinRoom: function (id) {
			this.joinRoom(id);
		},
		addRoom: function (id, type, nojoin, title) {
			this._addRoom(id, type, nojoin, title);
			this.updateSideRoom();
			this.updateLayout();
		},
		_addRoom: function (id, type, nojoin, title) {
			var oldRoom;
			if (this.rooms[id]) {
				if (type && this.rooms[id].type !== type) {
					// this room changed type
					// (or the type we guessed it would be was wrong)
					var oldRoom = this.rooms[id];
					var index = this.roomList.indexOf(oldRoom);
					if (index >= 0) this.roomList.splice(index, 1);
					index = this.sideRoomList.indexOf(oldRoom);
					if (index >= 0) this.sideRoomList.splice(index, 1);
					oldRoom.destroy();
					delete this.rooms[id];
				} else {
					return this.rooms[id];
				}
			}

			var el;
			if (!id) {
				el = $('#mainmenu');
			} else {
				el = $('<div class="ps-room" style="display:none"></div>').appendTo('body');
			}
			var typeName = '';
			if (typeof type === 'string') {
				typeName = type;
				type = null;
			}
			var roomTable = {
				'': MainMenuRoom,
				'teambuilder': TeambuilderRoom,
				'rooms': RoomsRoom,
				'battles': BattlesRoom,
				'ladder': LadderRoom,
				'lobby': ChatRoom,
				'staff': ChatRoom,
				'constructor': ChatRoom
			};
			var typeTable = {
				'html': HTMLRoom,
				'battle': BattleRoom,
				'chat': ChatRoom
			};

			// the passed type overrides everything else
			if (typeName) type = typeTable[typeName];

			// otherwise, the room table has precedence
			if (!type) type = roomTable[id];

			// otherwise, infer the room type
			if (!type) {
				if (id.slice(0, 7) === 'battle-') {
					type = BattleRoom;
				} else if (id.slice(0, 5) === 'view-') {
					type = HTMLRoom;
				} else {
					type = ChatRoom;
				}
			}

			var room = this.rooms[id] = new type({
				id: id,
				el: el,
				nojoin: nojoin,
				title: title
			});
			if (oldRoom) {
				if (this.curRoom === oldRoom) this.curRoom = room;
				if (this.curSideRoom === oldRoom) this.curSideRoom = room;
				if (this.sideRoom === oldRoom) this.sideRoom = room;
			}
			if (['', 'teambuilder', 'ladder', 'rooms'].indexOf(room.id) < 0) {
				if (room.isSideRoom) {
					this.sideRoomList.push(room);
				} else {
					this.roomList.push(room);
				}
			}
			return room;
		},
		focusRoom: function (id) {
			var room = this.rooms[id];
			if (!room) return false;
			BattleTooltips.hideTooltip();
			if (this.curRoom === room || this.curSideRoom === room) {
				room.focus();
				return true;
			}

			this.updateSideRoom(id);
			this.updateLayout();
			if (this.curSideRoom !== room) {
				if (this.curRoom) {
					this.curRoom.hide();
					this.curRoom = null;
				} else if (this.rooms['']) {
					this.rooms[''].hide();
				}
				this.curRoom = window.room = room;
				this.updateLayout();
				if (this.curRoom.id === id) {
					this.fragment = id;
					this.navigate(id);
					this.updateTitle(this.curRoom);
				}
			}

			room.focus();
			return;
		},
		focusRoomLeft: function (id) {
			var room = this.rooms[id];
			if (!room) return false;
			if (this.curRoom === room) {
				room.focus();
				return true;
			}

			if (this.curSideRoom === room) {
				this.sideRoom = this.curSideRoom = this.sideRoomList[0] || null;
			}

			room.isSideRoom = false;
			if (this.curRoom) {
				this.curRoom.hide();
				this.curRoom = null;
			} else if (this.rooms['']) {
				this.rooms[''].hide();
			}
			this.curRoom = room;
			this.updateLayout();
			if (this.curRoom.id === id) this.navigate(id);

			room.focus();
			return;
		},
		focusRoomRight: function (id) {
			var room = this.rooms[id];
			if (!room) return false;
			if (this.curSideRoom === room) {
				room.focus();
				return true;
			}

			if (this.curRoom === room) {
				this.curRoom = this.roomList[this.roomList.length - 1] || this.rooms[''];
			}

			room.isSideRoom = true;
			if (this.curSideRoom) {
				this.curSideRoom.hide();
				this.curSideRoom = null;
			}
			this.curSideRoom = this.sideRoom = room;
			this.updateLayout();
			// if (this.curRoom.id === id) this.navigate(id);

			room.focus();
			return;
		},
		/**
		 * This is the function for handling the two-panel layout
		 */
		updateLayout: function () {
			if (!this.curRoom) return; // can happen during initialization

			// If we don't have any right rooms at all, just show the left
			// room in full. Home is a left room, so we'll always have a
			// left room.
			if (!this.sideRoom || this.singlePanelMode) {
				this.curRoom.show('full');
				if (this.curSideRoom) {
					this.curSideRoom.hide();
					this.curSideRoom = null;
				}
				if (this.curRoom.id === '') {
					if ($(window).width() < this.curRoom.bestWidth) {
						this.curRoom.$el.addClass('tiny-layout');
					} else {
						this.curRoom.$el.removeClass('tiny-layout');
					}
				}
				this.topbar.updateTabbar();
				return;
			}

			// The rest of this code assumes we have a right room (sideRoom)

			var leftMin = (this.curRoom.minWidth || this.curRoom.bestWidth);
			var leftMinMain = (this.curRoom.minMainWidth || leftMin);
			var rightMin = (this.sideRoom.minWidth || this.sideRoom.bestWidth);
			var available = $(window).width();
			if (this.curRoom.isSideRoom) {
				// we're trying to focus a side room
				if (available >= this.rooms[''].tinyWidth + leftMinMain) {
					// it fits to the right of the main menu, so do that
					this.curSideRoom = this.sideRoom = this.curRoom;
					this.curRoom = this.rooms[''];
					leftMin = this.curRoom.tinyWidth;
					rightMin = (this.sideRoom.minWidth || this.sideRoom.bestWidth);
				} else if (this.sideRoom) {
					// nooo, doesn't fit
					// show the side room in full
					if (this.curSideRoom) {
						this.curSideRoom.hide();
						this.curSideRoom = null;
					}
					this.curRoom.show('full');
					this.topbar.updateTabbar();
					return;
				}
			} else if (this.curRoom.id === '') {
				leftMin = this.curRoom.tinyWidth;
				leftMinMain = leftMin;
			}

			// curRoom and sideRoom are now set so that curRoom is the left
			// room and sideRoom is the intended right room

			if (available < leftMinMain + rightMin) {
				// curRoom and sideRoom don't fit next to each other, so show
				// only curRoom
				if (this.curSideRoom) {
					this.curSideRoom.hide();
					this.curSideRoom = null;
				}
				if ($(window).width() < this.curRoom.bestWidth) {
					this.curRoom.$el.addClass('tiny-layout');
				} else {
					this.curRoom.$el.removeClass('tiny-layout');
				}
				this.curRoom.show('full');
				this.topbar.updateTabbar();
				return;
			}
			this.curSideRoom = this.sideRoom;

			if (leftMin === this.curRoom.tinyWidth) {
				if (available < this.curRoom.bestWidth + 570) {
					// there's only room for the tiny layout :(
					this.curRoom.show('left', leftMin);
					this.curRoom.$el.addClass('tiny-layout');
					this.curSideRoom.show('right', leftMin);
					this.topbar.updateTabbar();
					return;
				}
				leftMin = (this.curRoom.minWidth || this.curRoom.bestWidth);
				this.curRoom.$el.removeClass('tiny-layout');
			}

			// Formula for calculating exactly how much width the left and
			// right rooms should get. We start by giving each room their
			// minimum, and then increasing the left room's width
			// proportionally to how much they want to increase.

			// The left room's width is capped by its maxWidth, but the right
			// room's isn't. All rooms need to handle any width at all;
			// maxWidth applies only to left rooms.

			var leftMax = (this.curRoom.maxWidth || this.curRoom.bestWidth);
			var rightMax = (this.sideRoom.maxWidth || this.sideRoom.bestWidth);
			var leftWidth = leftMin;
			if (leftMax + rightMax <= available) {
				leftWidth = leftMax;
			} else {
				var bufAvailable = available - leftMin - rightMin;
				var wanted = leftMax - leftMin + rightMax - rightMin;
				if (wanted > 0) leftWidth = Math.floor(leftMin + (leftMax - leftMin) * bufAvailable / wanted);
			}
			if (leftWidth < leftMinMain) {
				leftWidth = leftMinMain;
			}
			if (this.curRoom.type === 'battle' && this.sideRoom.type !== 'battle') {
				// I give up; hardcoding
				var offset = Math.floor((available - leftMinMain - rightMin) / 2);
				if (offset > 0) leftWidth += offset;
				if (leftWidth > leftMax) leftWidth = leftMax;
			}
			this.curRoom.show('left', leftWidth);
			this.curSideRoom.show('right', leftWidth);
			this.topbar.updateTabbar();
		},
		updateSideRoom: function (id) {
			if (id && this.rooms[id].isSideRoom) {
				this.sideRoom = this.rooms[id];
				if (this.curSideRoom && this.curSideRoom !== this.sideRoom) {
					this.curSideRoom.hide();
					this.curSideRoom = this.sideRoom;
				}
				// updateLayout will null curSideRoom if there's
				// no room for this room
			} else if (!this.sideRoom) {
				for (var i in this.rooms) {
					if (this.rooms[i].isSideRoom) {
						this.sideRoom = this.rooms[i];
					}
				}
			}
		},
		leaveRoom: function (id, e) {
			var room = this.rooms[id];
			if (!room) return false;
			if (room.requestLeave && !room.requestLeave(e)) return false;
			return this.removeRoom(id);
		},
		renameRoom: function (id, newid) {
			var room = this.rooms[id];
			if (!room) return false;
			if (this.rooms[newid]) {
				this.removeRoom(id, true);
				return false;
			}
			this.rooms[newid] = room;
			room.id = newid;
			room.$el[0].id = 'room-' + newid;
			delete this.rooms[id];
			this.updateLayout();
		},
		removeRoom: function (id, alreadyLeft) {
			var room = this.rooms[id];
			if (!room) return false;
			if (room === this.curRoom) this.focusRoom('');
			delete this.rooms[id];
			var index = this.roomList.indexOf(room);
			if (index >= 0) this.roomList.splice(index, 1);
			index = this.sideRoomList.indexOf(room);
			if (index >= 0) this.sideRoomList.splice(index, 1);
			room.destroy(alreadyLeft);
			if (room === this.sideRoom) {
				this.sideRoom = null;
				this.curSideRoom = null;
				this.updateSideRoom();
			}
			this.updateLayout();
			return true;
		},
		moveRoomBy: function (room, amount) {
			var index = this.roomList.indexOf(room);
			if (index >= 0) {
				var newIndex = index + amount;
				if (newIndex < 0) return false;
				if (newIndex >= this.roomList.length) {
					this.roomList.splice(index, 1);
					this.sideRoomList.unshift(room);
					this.focusRoomRight(room.id);
				} else {
					this.roomList.splice(index, 1);
					this.roomList.splice(newIndex, 0, room);
					this.topbar.updateTabbar();
				}
				room.focusText();
				if (room.type === 'chat') this.updateAutojoin();
				return true;
			}
			index = this.sideRoomList.indexOf(room);
			if (index >= 0) {
				var newIndex = index + amount;
				if (newIndex >= this.sideRoomList.length) return false;
				if (newIndex < 0) {
					this.sideRoomList.splice(index, 1);
					this.roomList.push(room);
					this.focusRoomLeft(room.id);
				} else {
					this.sideRoomList.splice(index, 1);
					this.sideRoomList.splice(newIndex, 0, room);
					this.topbar.updateTabbar();
				}
				room.focusText();
				if (room.type === 'chat') this.updateAutojoin();
				return true;
			}
			return false;
		},
		focusRoomBy: function (room, amount) {
			this.arrowKeysUsed = true;
			var rooms = this.roomList.concat(this.sideRoomList);
			if (room && room.id === 'rooms') {
				if (!rooms.length) return false;
				this.focusRoom(rooms[amount < 0 ? rooms.length - 1 : 0].id);
				return true;
			}
			var index = rooms.indexOf(room);
			if (index >= 0) {
				var newIndex = index + amount;
				if (!rooms[newIndex]) {
					this.joinRoom('rooms');
					return true;
				}
				this.focusRoom(rooms[newIndex].id);
				return true;
			}
			return false;
		},
		openInNewWindow: function (url) {
			if (window.nodewebkit) {
				gui.Shell.openExternal(url);
			} else {
				window.open(url, '_blank');
			}
		},
		clickLink: function (e) {
			if (window.nodewebkit) {
				gui.Shell.openExternal(e.target.href);
				return false;
			}
		},
		roomTitleChanged: function (room) {
			if (room.id === this.fragment) this.updateTitle(room);
		},
		updateTitle: function (room) {
			document.title = room.title ? room.title + " - Showdown!" : "Showdown!";
		},
		updateAutojoin: function () {
			if (!Config.server.registered) return;
			var autojoins = [];
			var autojoinCount = 0;
			var rooms = this.roomList.concat(this.sideRoomList);
			for (var i = 0; i < rooms.length; i++) {
				var room = rooms[i];
				if (room.type !== 'chat') continue;
				autojoins.push(room.id.indexOf('-') >= 0 ? room.id : (room.title || room.id));
				if (room.id === 'staff' || room.id === 'upperstaff' || (Config.server.id !== 'showdown' && room.id === 'lobby')) continue;
				autojoinCount++;
				if (autojoinCount >= 10) break;
			}
			var curAutojoin = (Dex.prefs('autojoin') || '');
			if (typeof curAutojoin !== 'string') {
				if (curAutojoin[Config.server.id] === autojoins.join(',')) return;
				if (!autojoins.length) {
					delete curAutojoin[Config.server.id];
					// If the only key left is 'showdown', revert to the string method for storing autojoin.
					var hasSideServer = false;
					for (var key in curAutojoin) {
						if (key === 'showdown') continue;
						hasSideServer = true;
						break;
					}
					if (!hasSideServer) curAutojoin = curAutojoin.showdown || '';
				} else {
					curAutojoin[Config.server.id] = autojoins.join(',');
				}
			} else {
				if (Config.server.id !== 'showdown') {
					// Switch to the autojoin object to handle multiple servers
					curAutojoin = {showdown: curAutojoin};
					if (!autojoins.length) return;
					curAutojoin[Config.server.id] = autojoins.join(',');
				} else {
					if (curAutojoin === autojoins.join(',')) return;
					curAutojoin = autojoins.join(',');
				}
			}
			Dex.prefs('autojoin', curAutojoin);
		},

		/*********************************************************
		 * Popups
		 *********************************************************/

		popups: null,
		initializePopups: function () {
			this.popups = [];
		},

		addPopup: function (type, data) {
			if (!data) data = {};

			if (data.sourceEl === undefined && app.dispatchingButton) {
				data.sourceEl = app.dispatchingButton;
			}
			if (data.sourcePopup === undefined && app.dispatchingPopup) {
				data.sourcePopup = app.dispatchingPopup;
			}
			if (this.dismissingSource && $(data.sourceEl)[0] === this.dismissingSource) return;
			while (this.popups.length) {
				var prevPopup = this.popups[this.popups.length - 1];
				if (data.sourcePopup === prevPopup) {
					break;
				}
				var sourceEl = prevPopup.sourceEl ? prevPopup.sourceEl[0] : null;
				this.popups.pop().remove();
				if ($(data.sourceEl)[0] === sourceEl) return;
			}

			if (!type) type = Popup;

			var popup = new type(data);
			popup.lastFocusedEl = document.activeElement;

			var $overlay;
			if (popup.type === 'normal') {
				$('body').append(popup.el);
			} else {
				$overlay = $('<div class="ps-overlay"></div>').appendTo('body').append(popup.el);
				if (popup.type === 'semimodal') {
					$overlay.on('click', function (e) {
						if (e.currentTarget === e.target) {
							popup.close();
						}
					});
				}
			}

			if (popup.domInitialize) popup.domInitialize(data);
			popup.$('.autofocus').select().focus();
			if ($overlay) $overlay.scrollTop(0);
			this.popups.push(popup);
			return popup;
		},
		addPopupMessage: function (message) {
			// shorthand for adding a popup message
			// this is the equivalent of alert(message)
			app.addPopup(Popup, {message: message});
		},
		addPopupPrompt: function (message, buttonOrCallback, callback) {
			var button = (callback ? buttonOrCallback : 'OK');
			callback = (!callback ? buttonOrCallback : callback);
			app.addPopup(PromptPopup, {message: message, button: button, callback: callback});
		},
		closePopup: function (id) {
			if (this.popups.length) {
				var popup = this.popups.pop();
				if (popup.lastFocusedEl && popup.lastFocusedEl.focus) popup.lastFocusedEl.focus();
				popup.remove();
				if (this.reconnectPending) this.addPopup(ReconnectPopup, {message: this.reconnectPending});
				return true;
			}
			return false;
		},
		dismissPopups: function () {
			var source = false;
			while (this.popups.length) {
				var popup = this.popups[this.popups.length - 1];
				if (popup.type !== 'normal') return source;
				if (popup.sourceEl) source = popup.sourceEl[0];
				if (!source) source = true;
				this.popups.pop().remove();
			}
			return source;
		}

	});

	this.Room = Backbone.View.extend({
		className: 'ps-room',
		constructor: function (options) {
			if (!this.events) this.events = {};
			if (!this.events['click button']) this.events['click button'] = 'dispatchClickButton';
			if (!this.events['click']) this.events['click'] = 'dispatchClickBackground';

			Backbone.View.apply(this, arguments);

			if (!(options && options.nojoin)) this.join();
			if (options && options.title) this.title = options.title;
			this.el.id = 'room-' + this.id;
		},
		dispatchClickButton: function (e) {
			var target = e.currentTarget;
			if (target.name) {
				app.dismissingSource = app.dismissPopups();
				app.dispatchingButton = target;
				e.preventDefault();
				e.stopImmediatePropagation();
				this[target.name](target.value, target);
				delete app.dismissingSource;
				delete app.dispatchingButton;
			}
		},
		dispatchClickBackground: function (e) {
			app.dismissPopups();
			if (e.shiftKey || (window.getSelection && !window.getSelection().isCollapsed)) {
				return;
			}
			this.focus(e);
		},

		// communication

		/**
		 * Send to sim server
		 */
		send: function (data) {
			app.send(data, this.id);
		},
		/**
		 * Receive from sim server
		 */
		receive: function (data) {
			//
		},

		// layout

		bestWidth: 659,
		show: function (position, leftWidth) {
			this.leftWidth = 0;
			switch (position) {
			case 'left':
				this.$el.css({left: 0, width: leftWidth, right: 'auto'});
				break;
			case 'right':
				this.$el.css({left: leftWidth + 1, width: 'auto', right: 0});
				this.leftWidth = leftWidth;
				break;
			case 'full':
				this.$el.css({left: 0, width: 'auto', right: 0});
				break;
			}
			this.$el.show();
			this.dismissAllNotifications(true);
		},
		hide: function () {
			this.blur();
			this.$el.hide();
		},
		focus: function () {},
		blur: function () {},
		join: function () {},
		leave: function () {},

		// notifications

		requestNotifications: function () {
			try {
				if (window.webkitNotifications && webkitNotifications.requestPermission) {
					// Notification.requestPermission crashes Chrome 23:
					//   https://code.google.com/p/chromium/issues/detail?id=139594
					// In lieu of a way to detect Chrome 23, we'll just use the old
					// requestPermission API, which works to request permissions for
					// the new Notification spec anyway.
					webkitNotifications.requestPermission();
				} else if (window.Notification && Notification.requestPermission) {
					Notification.requestPermission(function (permission) {});
				}
			} catch (e) {}
		},
		notificationClass: '',
		notifications: null,
		subtleNotification: false,
		notify: function (title, body, tag, once) {
			if (once && app.focused && (this === app.curRoom || this == app.curSideRoom)) return;
			if (!tag) tag = 'message';
			var needsTabbarUpdate = false;
			if (!this.notifications) {
				this.notifications = {};
				needsTabbarUpdate = true;
			}
			if (app.focused && (this === app.curRoom || this == app.curSideRoom)) {
				this.notifications[tag] = {};
			} else if (window.nodewebkit && !nwWindow.setBadgeLabel) {
				// old desktop client
				// note: window.Notification exists but does nothing
				nwWindow.requestAttention(true);
			} else if (window.Notification) {
				// old one doesn't need to be closed; sending the tag should
				// automatically replace the old notification
				try {
					var notification = this.notifications[tag] = new Notification(title, {
						lang: 'en',
						body: body,
						tag: this.id + ':' + tag
					});
					var self = this;
					notification.onclose = function () {
						self.dismissNotification(tag);
					};
					notification.onclick = function () {
						window.focus();
						self.clickNotification(tag);
					};
					if (Dex.prefs('temporarynotifications')) {
						if (notification.cancel) {
							setTimeout(function () {notification.cancel();}, 5000);
						} else if (notification.close) {
							setTimeout(function () {notification.close();}, 5000);
						}
					}
					if (once) notification.psAutoclose = true;
				} catch (e) {
					// Chrome mobile will leave Notification in existence but throw if you try to use it
				}
				needsTabbarUpdate = true;
			} else if (window.macgap) {
				macgap.growl.notify({
					title: title,
					content: body
				});
				var notification = {};
				this.notifications[tag] = notification;
				if (once) notification.psAutoclose = true;
			} else {
				var notification = {};
				this.notifications[tag] = notification;
				if (once) notification.psAutoclose = true;
			}
			if (needsTabbarUpdate) {
				this.notificationClass = ' notifying';
				app.topbar.updateTabbar();
			}
		},
		subtleNotifyOnce: function () {
			if (app.focused && (this === app.curRoom || this == app.curSideRoom)) return;
			if (this.notifications || this.subtleNotification) return;
			this.subtleNotification = true;
			this.notificationClass = ' subtle-notifying';
			app.topbar.updateTabbar();
		},
		notifyOnce: function (title, body, tag) {
			return this.notify(title, body, tag, true);
		},
		closeNotification: function (tag, alreadyClosed) {
			if (!tag) return this.closeAllNotifications();
			if (window.nodewebkit) nwWindow.requestAttention(false);
			if (!this.notifications || !this.notifications[tag]) return;
			if (!alreadyClosed && this.notifications[tag].close) this.notifications[tag].close();
			delete this.notifications[tag];
			if (_.isEmpty(this.notifications)) {
				this.notifications = null;
				this.notificationClass = (this.subtleNotification ? ' subtle-notifying' : '');
				app.topbar.updateTabbar();
			}
		},
		closeAllNotifications: function (skipUpdate) {
			if (!this.notifications && !this.subtleNotification) {
				return;
			}
			if (window.nodewebkit) nwWindow.requestAttention(false);
			this.subtleNotification = false;
			if (this.notifications) {
				for (var tag in this.notifications) {
					if (this.notifications[tag].close) this.notifications[tag].close();
				}
				this.notifications = null;
			}
			this.notificationClass = '';
			if (skipUpdate) return;
			app.topbar.updateTabbar();
		},
		dismissNotification: function (tag) {
			if (!tag) return this.dismissAllNotifications();
			if (window.nodewebkit) nwWindow.requestAttention(false);
			if (!this.notifications || !this.notifications[tag]) return;
			if (this.notifications[tag].close) this.notifications[tag].close();
			if (!this.notifications || this.notifications[tag]) return; // avoid infinite recursion
			if (this.notifications[tag].psAutoclose) {
				delete this.notifications[tag];
				if (!this.notifications || _.isEmpty(this.notifications)) {
					this.notifications = null;
					this.notificationClass = (this.subtleNotification ? ' subtle-notifying' : '');
					app.topbar.updateTabbar();
				}
			} else {
				this.notifications[tag] = {};
			}

			if (this.lastMessageDate) {
				// Mark chat messages as read to avoid double-notifying on reload
				var lastMessageDates = Dex.prefs('logtimes') || (Dex.prefs('logtimes', {}), Dex.prefs('logtimes'));
				if (!lastMessageDates[Config.server.id]) lastMessageDates[Config.server.id] = {};
				lastMessageDates[Config.server.id][this.id] = this.lastMessageDate;
				Storage.prefs.save();
			}
		},
		dismissAllNotifications: function (skipUpdate) {
			if (!this.notifications && !this.subtleNotification) {
				return;
			}
			if (window.nodewebkit) nwWindow.requestAttention(false);
			this.subtleNotification = false;
			if (this.notifications) {
				for (var tag in this.notifications) {
					if (!this.notifications[tag].psAutoclose) continue;
					if (this.notifications[tag].close) this.notifications[tag].close();
					delete this.notifications[tag];
				}
				if (!this.notifications || _.isEmpty(this.notifications)) {
					this.notifications = null;
				}
			}
			if (!this.notifications) {
				this.notificationClass = '';
				if (!skipUpdate) app.topbar.updateTabbar();
			}

			if (this.lastMessageDate) {
				// Mark chat messages as read to avoid double-notifying on reload
				var lastMessageDates = Dex.prefs('logtimes') || (Dex.prefs('logtimes', {}), Dex.prefs('logtimes'));
				if (!lastMessageDates[Config.server.id]) lastMessageDates[Config.server.id] = {};
				lastMessageDates[Config.server.id][this.id] = this.lastMessageDate;
				Storage.prefs.save();
			}
		},
		clickNotification: function (tag) {
			this.dismissNotification(tag);
			app.focusRoom(this.id);
		},
		close: function () {
			app.leaveRoom(this.id);
		},

		// allocation

		destroy: function (alreadyLeft) {
			this.closeAllNotifications(true);
			if (!alreadyLeft) this.leave();
			this.remove();
			delete this.app;
		}
	});

	var Popup = this.Popup = Backbone.View.extend({

		// If type is 'modal', background will turn gray and popup won't be
		// dismissible except by interacting with it.
		// If type is 'semimodal', background will turn gray, but clicking
		// the background will dismiss it.
		// Otherwise, background won't change, and interacting with anything
		// other than the popup will still be possible (and will dismiss
		// the popup).
		type: 'normal',

		className: 'ps-popup',
		constructor: function (data) {
			if (!this.events) this.events = {};
			if (!this.events['click button']) this.events['click button'] = 'dispatchClickButton';
			if (!this.events['submit form']) this.events['submit form'] = 'dispatchSubmit';
			if (data && data.sourceEl) {
				this.sourceEl = data.sourceEl = $(data.sourceEl);
			}
			if (data.type) this.type = data.type;
			if (data.position) this.position = data.position;
			if (data.buttons) this.buttons = data.buttons;
			if (data.submit) this.submit = data.submit;

			Backbone.View.apply(this, arguments);

			// if we have no source, we can't attach to anything
			if (this.type === 'normal' && !this.sourceEl) this.type = 'semimodal';

			if ((this.type === 'normal' || this.type === 'semimodal') && this.sourceEl) {
				// nonmodal popup: should be positioned near source element
				var $el = this.$el;
				var $measurer = $('<div style="position:relative;height:0;overflow:hidden"></div>').appendTo('body').append($el);
				$el.css('position', 'absolute');
				$el.css('margin', '0');
				$el.css('width', this.width - 22);

				var offset = this.sourceEl.offset();

				var room = $(window).height();
				var height = $el.outerHeight();
				var width = $el.outerWidth();
				var sourceHeight = this.sourceEl.outerHeight();

				if (this.position === 'right') {

					if (room > offset.top + height + 5 &&
						(offset.top < room * 2 / 3 || offset.top + 200 < room)) {
						$el.css('top', offset.top);
					} else {
						$el.css('bottom', Math.max(room - offset.top - sourceHeight, 0));
					}
					var offsetLeft = offset.left + this.sourceEl.outerWidth();
					if (offsetLeft + width > $(window).width()) {
						$el.css('right', 1);
					} else {
						$el.css('left', offsetLeft);
					}

				} else {

					if (room > offset.top + sourceHeight + height + 5 &&
						(offset.top + sourceHeight < room * 2 / 3 || offset.top + sourceHeight + 200 < room)) {
						$el.css('top', offset.top + sourceHeight);
					} else if (height + 5 <= offset.top) {
						$el.css('bottom', Math.max(room - offset.top, 0));
					} else if (height + 10 < room) {
						$el.css('bottom', 5);
					} else {
						$el.css('top', 0);
					}

					room = $(window).width() - offset.left;
					if (room < width + 10) {
						$el.css('right', 10);
					} else {
						$el.css('left', offset.left);
					}

				}

				$el.detach();
				$measurer.remove();
			}
		},
		initialize: function (data) {
			if (!this.type) this.type = 'semimodal';
			this.$el.html('<form><p style="white-space:pre-wrap;word-wrap:break-word">' + (data.htmlMessage || BattleLog.parseMessage(data.message)) + '</p><p class="buttonbar">' + (data.buttons || '<button name="close" class="autofocus"><strong>OK</strong></button>') + '</p></form>').css('max-width', data.maxWidth || 480);
		},

		dispatchClickButton: function (e) {
			var target = e.currentTarget;
			if (target.name) {
				app.dispatchingButton = target;
				app.dispatchingPopup = this;
				e.preventDefault();
				e.stopImmediatePropagation();
				this[target.name](target.value, target);
				delete app.dispatchingButton;
				delete app.dispatchingPopup;
			}
		},
		dispatchSubmit: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var dataArray = $(e.currentTarget).serializeArray();
			var data = {};
			for (var i = 0, len = dataArray.length; i < len; i++) {
				var name = dataArray[i].name, value = dataArray[i].value;
				if (data[name]) {
					if (!data[name].push) data[name] = [data[name]];
					data[name].push(value || '');
				} else {
					data[name] = (value || '');
				}
			}
			this.submit(data);
		},
		send: function (data) {
			app.send(data);
		},

		remove: function () {
			var $parent = this.$el.parent();
			Backbone.View.prototype.remove.apply(this, arguments);
			if ($parent.hasClass('ps-overlay')) $parent.remove();
		},

		close: function () {
			app.closePopup();
		}
	});

	var PromptPopup = this.PromptPopup = Popup.extend({
		initialize: function (data) {
			if (!data || !data.message || typeof data.callback !== "function") return;
			this.callback = data.callback;

			var buf = '<form>';
			buf += '<p><label class="label">' + data.message;
			buf += '<input class="textbox autofocus" type="text" name="data" value="' + BattleLog.escapeHTML(data.value || '') + '" /></label></p>';
			buf += '<p class="buttonbar"><button type="submit"><strong>' + data.button + '</strong></button> <button name="close">Cancel</button></p>';
			buf += '</form>';

			this.$el.html(buf);
		},
		submit: function (data) {
			this.close();
			this.callback(data.data);
		}
	});

	Config.groups = Config.groups || {
		'~': {
			name: "Administrator (~)",
			type: 'leadership',
			order: 10001
		},
		'&': {
			name: "Leader (&amp;)",
			type: 'leadership',
			order: 10002
		},
		'#': {
			name: "Room Owner (#)",
			type: 'leadership',
			order: 10003
		},
		'\u2605': {
			name: "Host (\u2605)",
			type: 'staff',
			order: 10004
		},
		'@': {
			name: "Moderator (@)",
			type: 'staff',
			order: 10005
		},
		'%': {
			name: "Driver (%)",
			type: 'staff',
			order: 10006
		},
		'*': {
			name: "Bot (*)",
			type: 'normal',
			order: 10007
		},
		'\u2606': {
			name: "Player (\u2606)",
			type: 'normal',
			order: 10008
		},
		'+': {
			name: "Voice (+)",
			type: 'normal',
			order: 10009
		},
		' ': {
			type: 'normal',
			order: 10010
		},
		'!': {
			name: "<span style='color:#777777'>Muted (!)</span>",
			type: 'punishment',
			order: 10011
		},
		'✖': {
			name: "<span style='color:#777777'>Namelocked (✖)</span>",
			type: 'punishment',
			order: 10012
		},
		'\u203d': {
			name: "<span style='color:#777777'>Locked (\u203d)</span>",
			type: 'punishment',
			order: 10013
		}
	};

	var UserPopup = this.UserPopup = Popup.extend({
		initialize: function (data) {
			data.userid = toId(data.name);
			var name = data.name;
			if (/[a-zA-Z0-9]/.test(name.charAt(0))) name = ' ' + name;
			this.data = data = _.extend(data, UserPopup.dataCache[data.userid]);
			data.name = name;
			app.on('response:userdetails', this.update, this);
			app.send('/cmd userdetails ' + data.userid);
			this.update();
		},
		events: {
			'click .ilink': 'clickLink',
			'click .trainersprite.yours': 'avatars'
		},
		update: function (data) {
			if (data && data.userid === this.data.userid) {
				data = _.extend(this.data, data);
				UserPopup.dataCache[data.userid] = data;
			} else {
				data = this.data;
			}
			var userid = data.userid;
			var name = data.name;
			var avatar = data.avatar || '';
			var group = ((Config.groups[name.charAt(0)] || {}).name || '');
			var globalgroup = ((Config.groups[(data.group || Config.defaultGroup || ' ')] || {}).name || '');
			if (globalgroup) {
				if (!group || group === globalgroup) {
					group = "Global " + globalgroup;
					globalgroup = '';
				} else {
					globalgroup = "Global " + globalgroup;
				}
			}
			if (group || name.charAt(0) === ' ') name = name.substr(1);
			var ownUserid = app.user.get('userid');

			var buf = '<div class="userdetails">';
			if (avatar) buf += '<img class="trainersprite' + (userid === ownUserid ? ' yours' : '') + '" src="' + Dex.resolveAvatar(avatar) + '" />';
			buf += '<strong><a href="//pokemonshowdown.com/users/' + userid + '" target="_blank">' + BattleLog.escapeHTML(name) + '</a></strong><br />';
			buf += '<small>' + (group || '&nbsp;') + '</small>';
			if (globalgroup) buf += '<br /><small>' + globalgroup + '</small>';
			if (data.rooms) {
				var battlebuf = '';
				var chatbuf = '';
				var privatebuf = '';
				for (var i in data.rooms) {
					if (i === 'global') continue;
					var roomrank = '';
					if (!/[A-Za-z0-9]/.test(i.charAt(0))) {
						roomrank = '<small style="color: #888; font-size: 100%">' + i.charAt(0) + '</small>';
					}
					var roomid = toRoomid(i);
					if (roomid.substr(0, 7) === 'battle-') {
						var p1 = data.rooms[i].p1.substr(1);
						var p2 = data.rooms[i].p2.substr(1);
						var ownBattle = (ownUserid === toUserid(p1) || ownUserid === toUserid(p2));
						var room = '<span title="' + (BattleLog.escapeHTML(p1) || '?') + ' v. ' + (BattleLog.escapeHTML(p2) || '?') + '">' + '<a href="' + app.root + roomid + '" class="ilink' + ((ownBattle || app.rooms[i]) ? ' yours' : '') + '">' + roomrank + roomid.substr(7) + '</a></span>';
						if (data.rooms[i].isPrivate) {
							if (!privatebuf) privatebuf = '<br /><em>Private rooms:</em> ';
							else privatebuf += ', ';
							privatebuf += room;
						} else {
							if (!battlebuf) battlebuf = '<br /><em>Battles:</em> ';
							else battlebuf += ', ';
							battlebuf += room;
						}
					} else {
						var room = '<a href="' + app.root + roomid + '" class="ilink' + (app.rooms[i] ? ' yours' : '') + '">' + roomrank + roomid + '</a>';
						if (data.rooms[i].isPrivate) {
							if (!privatebuf) privatebuf = '<br /><em>Private rooms:</em> ';
							else privatebuf += ', ';
							privatebuf += room;
						} else {
							if (!chatbuf) chatbuf = '<br /><em>Chatrooms:</em> ';
							else chatbuf += ', ';
							chatbuf += room;
						}
					}
				}
				buf += '<small class="rooms">' + battlebuf + chatbuf + privatebuf + '</small>';
			} else if (data.rooms === false) {
				buf += '<strong class="offline">OFFLINE</strong>';
			}
			buf += '</div>';

			buf += '<p class="buttonbar">';
			if (userid === app.user.get('userid') || !app.user.get('named')) {
				buf += '<button disabled>Challenge</button> <button disabled>Chat</button>';
				if (userid === app.user.get('userid')) {
					buf += '</p><hr /><p class="buttonbar" style="text-align: right">';
					buf += '<button name="login"><i class="fa fa-pencil"></i> Change name</button> <button name="logout"><i class="fa fa-power-off"></i> Log out</button>';
				}
			} else {
				buf += '<button name="challenge">Challenge</button> <button name="pm">Chat</button> <button name="userOptions">\u2026</button>';
			}
			buf += '</p>';

			this.$el.html(buf);
		},
		clickLink: function (e) {
			if (e.cmdKey || e.metaKey || e.ctrlKey) return;
			e.preventDefault();
			e.stopPropagation();
			this.close();
			var roomid = $(e.currentTarget).attr('href').substr(app.root.length);
			app.tryJoinRoom(roomid);
		},
		avatars: function () {
			app.addPopup(AvatarsPopup);
		},
		challenge: function () {
			app.rooms[''].requestNotifications();
			this.close();
			app.focusRoom('');
			app.rooms[''].challenge(this.data.name);
		},
		pm: function () {
			app.rooms[''].requestNotifications();
			this.close();
			app.focusRoom('');
			app.rooms[''].focusPM(this.data.name);
		},
		login: function () {
			app.addPopup(LoginPopup);
		},
		logout: function () {
			app.user.logout();
			this.close();
		},
		userOptions: function () {
			app.addPopup(UserOptionsPopup, {name: this.data.name, userid: this.data.userid});
		}
	}, {
		dataCache: {}
	});

	var UserOptionsPopup = this.UserOptions = Popup.extend({
		initialize: function (data) {
			this.name = data.name.substr(1);
			this.userid = data.userid;
			this.update();
		},
		update: function () {
			this.$el.html('<p><button name="toggleIgnoreUser">' + (app.ignore[this.userid] ? 'Unignore' : 'Ignore') + '</button></p><p><button name="report">Report</button></p>');
		},
		report: function () {
			app.joinRoom('view-help-request-report');
		},
		toggleIgnoreUser: function () {
			var buf = "User '" + this.name + "'";
			if (app.ignore[this.userid]) {
				delete app.ignore[this.userid];
				buf += " no longer ignored.";
			} else {
				app.ignore[this.userid] = 1;
				buf += " ignored. (Moderator messages will not be ignored.)";
			}
			var $pm = $('.pm-window-' + this.userid);
			if ($pm.length && $pm.css('display') !== 'none') {
				$pm.find('.inner').append('<div class="chat">' + BattleLog.escapeHTML(buf) + '</div>');
			} else {
				var room = (app.curRoom && app.curRoom.add ? app.curRoom : app.curSideRoom);
				if (!room || !room.add) {
					app.addPopupMessage(buf);
					return this.update();
				}
				room.add(buf);
			}
			app.dismissPopups();
		}
	});

	var ReconnectPopup = this.ReconnectPopup = Popup.extend({
		type: 'modal',
		initialize: function (data) {
			app.reconnectPending = false;
			var buf = '<form>';

			if (data.cantconnect) {
				buf += '<p class="error">Couldn\'t connect to server!</p>';
				if (window.wiiu && document.location.protocol === 'https:') {
					buf += '<p class="error">The Wii U does not support secure connections.</p>';
					buf += '<p class="buttonbar"><button name="tryhttp" autofocus><strong>Connect insecurely</button> <button name="close">Work offline</button></p>';
				} else if (document.location.protocol === 'https:') {
					buf += '<p class="buttonbar"><button type="submit"><strong>Retry</strong></button> <button name="tryhttp">Retry with HTTP</button> <button name="close">Work offline</button></p>';
				} else {
					buf += '<p class="buttonbar"><button type="submit"><strong>Retry</strong></button> <button name="close">Work offline</button></p>';
				}
			} else if (data.message && data.message !== true) {
				buf += '<p>' + data.message + '</p>';
				buf += '<p class="buttonbar"><button type="submit" class="autofocus"><strong>Reconnect</strong></button> <button name="close">Work offline</button></p>';
			} else {
				buf += '<p>You have been disconnected &ndash; possibly because the server was restarted.</p>';
				buf += '<p class="buttonbar"><button type="submit" class="autofocus"><strong>Reconnect</strong></button> <button name="close">Work offline</button></p>';
			}

			buf += '</form>';
			this.$el.html(buf);
		},
		tryhttp: function () {
			document.location.replace('http://' +
				document.location.host + document.location.pathname + '?insecure');
		},
		submit: function (data) {
			document.location.reload();
		}
	});

	this.ProxyPopup = Popup.extend({
		type: 'modal',
		initialize: function (data) {
			this.callback = data.callback;

			var buf = '<form>';
			buf += '<p>Because of the <a href="https://en.wikipedia.org/wiki/Same-origin_policy" target="_blank">same-origin policy</a>, some manual work is required to complete the requested action when using <code>testclient.html</code>.</p>';
			buf += '<iframe id="overlay_iframe" src="' + data.uri + '" style="width: 100%; height: 50px;" class="textbox"></iframe>';
			buf += '<p>Please copy <strong>all the text</strong> from the box above and paste it in the box below.</p>';
			buf += '<p><label class="label" style="float: left;">Data from the box above:</label> <input style="width: 100%;" class="textbox autofocus" type="text" name="result" /></p>';
			buf += '<p class="buttonbar"><button type="submit"><strong>Submit</strong></button> <button name="close">Cancel</button></p>';
			buf += '</form>';
			this.$el.html(buf).css('min-width', 500);
		},
		submit: function (data) {
			this.close();
			this.callback(data.result);
		}
	});

	var ReplayUploadedPopup = this.ReplayUploadedPopup = Popup.extend({
		type: 'semimodal',
		events: {
			'click a': 'clickClose'
		},
		initialize: function (data) {
			var buf = '';
			buf = '<p>Your replay has been uploaded! It\'s available at:</p>';
			buf += '<p><a href="http://replay.pokemonshowdown.com/' + data.id + '" target="_blank">http://replay.pokemonshowdown.com/' + data.id + '</a></p>';
			buf += '<p><button class="autofocus" name="close">Close</button></p>';
			this.$el.html(buf).css('max-width', 620);
		},
		clickClose: function () {
			this.close();
		},
		submit: function (i) {
			this.close();
		}
	});

	var RulesPopup = this.RulesPopup = Popup.extend({
		type: 'modal',
		initialize: function (data) {
			var warning = ('warning' in data);
			var buf = '';
			if (warning) {
				buf += '<p><strong style="color:red">' + (BattleLog.escapeHTML(data.warning) || 'You have been warned for breaking the rules.') + '</strong></p>';
			}
			buf += '<h2>Pok&eacute;mon Showdown Rules</h2>';
			buf += '<b>Global</b><br /><br /><b>1.</b> Be nice to people. Respect people. Don\'t be rude or mean to people.<br /><br /><b>2.</b> Follow US laws (PS is based in the US). No porn (minors use PS), don\'t distribute pirated material, and don\'t slander others.<br /><br /><b>3.</b>&nbsp;No sex. Don\'t discuss anything sexually explicit, not even in private messages, not even if you\'re both adults.<br /><b></b><br /><b>4.</b>&nbsp;No cheating. Don\'t exploit bugs to gain an unfair advantage. Don\'t game the system (by intentionally losing against yourself or a friend in a ladder match, by timerstalling, etc). Don\'t impersonate staff if you\'re not.<br /><br /><b>5.</b> Moderators have discretion to punish any behaviour they deem inappropriate, whether or not it\'s on this list. If you disagree with a moderator ruling, appeal to a leader (a user with &amp; next to their name) or <a href="https://pokemonshowdown.com/appeal">Discipline Appeals</a>.<br /><br />(Note: The First Amendment does not apply to PS, since PS is not a government organization.)<br /><br />';
			buf += '<b>Chat</b><br /><br /><b>1.</b> Do not spam, flame, or troll. This includes advertising, raiding, asking questions with one-word answers in the lobby, and flooding the chat such as by copy/pasting logs in the lobby.<br /><br /><b>2.</b> Don\'t call unnecessary attention to yourself. Don\'t be obnoxious. ALL CAPS and <i>formatting</i> are acceptable to emphasize things, but should be used sparingly, not all the time.<br /><br /><b>3.</b> No minimodding: don\'t mod if it\'s not your job. Don\'t tell people they\'ll be muted, don\'t ask for people to be muted, and don\'t talk about whether or not people should be muted ("inb4 mute", etc). This applies to bans and other punishments, too.<br /><br /><b>4.</b> We reserve the right to tell you to stop discussing moderator decisions if you become unreasonable or belligerent.<br /><br /><b>5.</b> English only, unless specified otherwise.<br /><br />(Note: You can opt out of chat rules in private chat rooms and battle rooms, but only if all ROs or players agree to it.)<br /><br />';
			if (!warning) {
				buf += '<b>Usernames</b><br /><br />Your username can be chosen and changed at any time. Keep in mind:<br /><br /><b>1.</b> Usernames may not impersonate a recognized user (a user with %, @, &amp;, or ~ next to their name) or a famous person/organization that uses PS or is associated with Pokémon.<br /><br /><b>2.</b> Usernames may not be derogatory or insulting in nature, to an individual or group (insulting yourself is okay as long as it\'s not too serious).<br /><br /><b>3.</b> Usernames may not directly reference sexual activity, or be excessively disgusting.<br /><br />This policy is less restrictive than that of many places, so you might see some "borderline" nicknames that might not be accepted elsewhere. You might consider it unfair that they are allowed to keep their nickname. The fact remains that their nickname follows the above rules, and if you were asked to choose a new name, yours does not.';
			}
			if (warning) {
				buf += '<p class="buttonbar"><button name="close" disabled>Close</button><small class="overlay-warn"> You will be able to close this in 5 seconds</small></p>';
				setTimeout(_.bind(this.rulesTimeout, this), 5000);
			} else {
				this.type = 'semimodal';
				buf += '<p class="buttonbar"><button name="close" class="autofocus">Close</button></p>';
			}
			this.$el.css('max-width', 760).html(buf);
		},
		rulesTimeout: function () {
			this.$('button')[0].disabled = false;
			this.$('.overlay-warn').remove();
		}
	});

}).call(this, jQuery);
