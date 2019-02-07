(function ($) {

	this.MainMenuRoom = this.Room.extend({
		type: 'mainmenu',
		tinyWidth: 340,
		bestWidth: 628,
		events: {
			'keydown textarea': 'keyDown',
			'keyup textarea': 'keyUp',
			'click .username': 'clickUsername',
			'click .closebutton': 'closePM',
			'click .minimizebutton': 'minimizePM',
			'click .pm-window': 'clickPMBackground',
			'dblclick .pm-window h3': 'dblClickPMHeader',
			'focus textarea': 'onFocusPM',
			'blur textarea': 'onBlurPM',
			'click .spoiler': 'clickSpoiler',
			'click button.formatselect': 'selectFormat',
			'click button.teamselect': 'selectTeam'
		},
		initialize: function () {
			this.$el.addClass('scrollable');

			// left menu 2 (high-res: right, low-res: top)
			// (created during page load)

			// left menu 1 (high-res: left, low-res: bottom)
			var buf = '';
			if (app.down) {
				buf += '<div class="menugroup" style="background: rgba(10,10,10,.6)">';
				if (app.down === 'ddos') {
					buf += '<p class="error"><strong>Pok&eacute;mon Showdown is offline due to a DDoS attack!</strong></p>';
				} else {
					buf += '<p class="error"><strong>Pok&eacute;mon Showdown is offline due to technical difficulties!</strong></p>';
				}
				buf += '<p><div style="text-align:center"><img width="96" height="96" src="//play.pokemonshowdown.com/sprites/bw/teddiursa.png" alt="" /></div> Bear with us as we freak out.</p>';
				buf += '<p>(We\'ll be back up in a few hours.)</p>';
				buf += '</div>';
			} else {
				buf += '<div class="menugroup"><form class="battleform" data-search="1">';
				buf += '<p><label class="label">Format:</label>' + this.renderFormats() + '</p>';
				buf += '<p><label class="label">Team:</label>' + this.renderTeams() + '</p>';
				buf += '<p><button class="button mainmenu1 big" name="search"><strong>Battle!</strong><br /><small>Find a random opponent</small></button></p></form></div>';
			}

			buf += '<div class="menugroup"><p><button class="button mainmenu2" name="joinRoom" value="teambuilder">Teambuilder</button></p>';
			buf += '<p><button class="button mainmenu3" name="joinRoom" value="ladder">Ladder</button></p></div>';

			buf += '<div class="menugroup"><p><button class="button mainmenu4 onlineonly disabled" name="joinRoom" value="battles">Watch a battle</button></p>';
			buf += '<p><button class="button mainmenu5 onlineonly disabled" name="finduser">Find a user</button></p></div>';

			this.$('.mainmenu').html(buf);

			// right menu
			if (document.location.hostname === 'play.pokemonshowdown.com') {
				this.$('.rightmenu').html('<div class="menugroup"><p><button class="button mainmenu1 onlineonly disabled" name="joinRoom" value="rooms">Join chat</button></p></div>');
			} else {
				this.$('.rightmenu').html('<div class="menugroup"><p><button class="button mainmenu1 onlineonly disabled" name="joinRoom" value="lobby">Join lobby chat</button></p></div>');
			}

			// footer
			// (created during page load)

			this.$activityMenu = this.$('.activitymenu');
			this.$pmBox = this.$activityMenu.find('.pmbox');

			app.on('init:formats', this.updateFormats, this);
			this.updateFormats();

			app.user.on('saveteams', this.updateTeams, this);

			// news
			// (created during page load)

			var self = this;
			Storage.whenPrefsLoaded(function () {
				var newsid = Number(Storage.prefs('newsid'));
				var $news = this.$('.news-embed');
				if (!newsid) {
					if ($(window).width() < 628) {
						// News starts minimized in phone layout
						self.minimizePM($news);
					}
					return;
				}
				var $newsEntries = $news.find('.newsentry');
				var hasUnread = false;
				for (var i = 0; i < $newsEntries.length; i++) {
					if (Number($newsEntries.eq(i).data('newsid')) > newsid) {
						hasUnread = true;
						$newsEntries.eq(i).addClass('unread');
					}
				}
				if (!hasUnread) self.minimizePM($news);
			});
		},

		addPseudoPM: function (options) {
			if (!options) return;
			options.title = options.title || '';
			options.html = options.html || '';
			options.cssClass = options.cssClass || '';
			options.height = options.height || 'auto';
			options.maxHeight = options.maxHeight || '';
			options.attributes = options.attributes || '';
			options.append = options.append || false;
			options.noMinimize = options.noMinimize || false;

			this.$pmBox[options.append ? 'append' : 'prepend']('<div class="pm-window ' + options.cssClass + '" ' + options.attributes + '><h3><button class="closebutton" tabindex="-1" aria-label="Close"><i class="fa fa-times-circle"></i></button>' + (!options.noMinimize ? '<button class="minimizebutton" tabindex="-1" aria-label="Minimize"><i class="fa fa-minus-circle"></i></button>' : '') + options.title + '</h3><div class="pm-log" style="overflow:visible;height:' + (typeof options.height === 'number' ? options.height + 'px' : options.height) + ';' + (parseInt(options.height, 10) ? 'max-height:none' : (options.maxHeight ? 'max-height:' + (typeof options.maxHeight === 'number' ? options.maxHeight + 'px' : options.maxHeight) : '')) + '">' +
				options.html +
				'</div></div>');
		},

		// news

		addNews: function () {
			var newsId = '1990';
			if (newsId === '' + Dex.prefs('readnews')) return;
			this.addPseudoPM({
				title: 'Latest News',
				html: '<iframe src="/news-embed.php?news' + (window.nodewebkit || document.location.protocol === 'https:' ? '&amp;https' : '') + '" width="270" height="400" border="0" style="border:0;width:100%;height:100%;display:block"></iframe>',
				attributes: 'data-newsid="' + newsId + '"',
				cssClass: 'news-embed',
				height: 400
			});
		},

		/*********************************************************
		 * PMs
		 *********************************************************/

		addPM: function (name, message, target) {
			var userid = toUserid(name);
			if (app.ignore[userid] && name.substr(0, 1) in {' ': 1, '!': 1, '✖': 1, '‽': 1}) return;

			var isSelf = (toId(name) === app.user.get('userid'));
			var oName = isSelf ? target : name;
			Storage.logChat('pm-' + toId(oName), '' + name + ': ' + message);

			var $pmWindow = this.openPM(oName, true);
			var $chatFrame = $pmWindow.find('.pm-log');
			var $chat = $pmWindow.find('.inner');

			var autoscroll = ($chatFrame.scrollTop() + 60 >= $chat.height() - $chatFrame.height());

			var parsedMessage = MainMenuRoom.parseChatMessage(message, name, ChatRoom.getTimestamp('pms'), false, $chat);
			if (!$.isArray(parsedMessage)) parsedMessage = [parsedMessage];
			for (var i = 0; i < parsedMessage.length; i++) {
				if (!parsedMessage[i]) continue;
				$chat.append(parsedMessage[i]);
			}

			var $lastMessage = $chat.children().last();
			var textContent = $lastMessage.html().indexOf('<span class="spoiler">') >= 0 ? '(spoiler)' : $lastMessage.children().last().text();
			if (textContent && app.curSideRoom && app.curSideRoom.addPM && Dex.prefs('inchatpm')) {
				app.curSideRoom.addPM(name, message, target);
			}

			if (!isSelf && textContent) {
				this.notifyOnce("PM from " + name, "\"" + textContent + "\"", 'pm');
			}

			if (autoscroll) {
				$chatFrame.scrollTop($chat.height());
			}

			if (!$pmWindow.hasClass('focused') && name.substr(1) !== app.user.get('name')) {
				$pmWindow.find('h3').addClass('pm-notifying');
			}
		},
		openPM: function (name, dontFocus) {
			var userid = toId(name);
			var $pmWindow = this.$pmBox.find('.pm-window-' + userid);
			if (!$pmWindow.length) {
				var group = name.charAt(0);
				if (group === ' ') {
					group = '';
				} else {
					group = '<small>' + BattleLog.escapeHTML(group) + '</small>';
				}
				var buf = '<div class="pm-window pm-window-' + userid + '" data-userid="' + userid + '" data-name="' + name + '">';
				buf += '<h3><button class="closebutton" href="' + app.root + 'teambuilder" tabindex="-1" aria-label="Close"><i class="fa fa-times-circle"></i></button>';
				buf += '<button class="minimizebutton" href="' + app.root + 'teambuilder" tabindex="-1" aria-label="Minimize"><i class="fa fa-minus-circle"></i></button>';
				buf += group + BattleLog.escapeHTML(name.substr(1)) + '</h3>';
				buf += '<div class="pm-log"><div class="inner" role="log"></div></div>';
				buf += '<div class="pm-log-add"><form class="chatbox nolabel"><textarea class="textbox" type="text" size="70" autocomplete="off" name="message"></textarea></form></div></div>';
				$pmWindow = $(buf).prependTo(this.$pmBox);
				$pmWindow.find('textarea').autoResize({
					animate: false,
					extraSpace: 0
				});
				// create up/down history for this PM
				this.chatHistories[userid] = new ChatHistory();
			} else {
				$pmWindow.show();
				if (!dontFocus) {
					var $chatFrame = $pmWindow.find('.pm-log');
					var $chat = $pmWindow.find('.inner');
					$chatFrame.scrollTop($chat.height());
				}
			}
			if (!dontFocus) this.$el.scrollTop(0);
			return $pmWindow;
		},
		closePM: function (e) {
			var userid;
			if (e.currentTarget) {
				e.preventDefault();
				e.stopPropagation();
				userid = $(e.currentTarget).closest('.pm-window').data('userid');
				// counteract jQuery auto-casting
				if (userid !== undefined && userid !== '') userid = '' + userid;
			} else {
				userid = toId(e);
			}
			var $pmWindow;
			if (!userid) {
				// not a true PM; just close the window
				$pmWindow = $(e.currentTarget).closest('.pm-window');
				var newsId = $pmWindow.data('newsid');
				if (newsId) {
					$.cookie('showdown_readnews', '' + newsId, {expires: 365});
				}
				$pmWindow.remove();
				return;
			}
			$pmWindow = this.$pmBox.find('.pm-window-' + userid);
			$pmWindow.hide();

			var $rejectButton = $pmWindow.find('button[name=rejectChallenge]');
			if ($rejectButton.length) {
				this.rejectChallenge(userid, $rejectButton);
			}
			$rejectButton = $pmWindow.find('button[name=cancelChallenge]');
			if ($rejectButton.length) {
				this.cancelChallenge(userid, $rejectButton);
			}

			var $next = $pmWindow.next();
			while ($next.length && $next.css('display') === 'none') {
				$next = $next.next();
			}
			if ($next.length) {
				$next.find('textarea[name=message]').focus();
				return;
			}

			$next = $pmWindow.prev();
			while ($next.length && $next.css('display') === 'none') {
				$next = $next.prev();
			}
			if ($next.length) {
				$next.find('textarea[name=message]').focus();
				return;
			}

			if (app.curSideRoom) app.curSideRoom.focus();
		},
		minimizePM: function (e) {
			var $pmWindow;
			if (e.currentTarget) {
				e.preventDefault();
				e.stopPropagation();
				$pmWindow = $(e.currentTarget).closest('.pm-window');
			} else {
				$pmWindow = e;
			}
			if (!$pmWindow) {
				return;
			}

			var $pmHeader = $pmWindow.find('h3');
			var $pmContent = $pmWindow.find('.pm-log, .pm-log-add');
			if (!$pmWindow.data('minimized')) {
				$pmContent.hide();
				$pmHeader.addClass('pm-minimized');
				$pmWindow.data('minimized', true);
			} else {
				$pmContent.show();
				$pmHeader.removeClass('pm-minimized');
				$pmWindow.data('minimized', false);
			}

			$pmWindow.find('h3').removeClass('pm-notifying');
		},
		focusPM: function (name) {
			this.openPM(name).prependTo(this.$pmBox).find('textarea[name=message]').focus();
		},
		onFocusPM: function (e) {
			$(e.currentTarget).closest('.pm-window').addClass('focused').find('h3').removeClass('pm-notifying');
		},
		onBlurPM: function (e) {
			$(e.currentTarget).closest('.pm-window').removeClass('focused');
		},
		keyUp: function (e) {
			var $target = $(e.currentTarget);
			// Android Chrome compose keycode
			// Android Chrome no longer sends keyCode 13 when Enter is pressed on
			// the soft keyboard, resulting in this annoying hack.
			// https://bugs.chromium.org/p/chromium/issues/detail?id=118639#c232
			if (!e.shiftKey && e.keyCode === 229 && $target.val().slice(-1) === '\n') {
				this.submitPM(e);
			}
		},
		submitPM: function (e) {
			e.preventDefault();
			e.stopPropagation();
			var $target = $(e.currentTarget);

			var text = $.trim($target.val());
			if (!text) return;
			var $pmWindow = $target.closest('.pm-window');
			var userid = $pmWindow.attr('data-userid') || '';
			var $chat = $pmWindow.find('.inner');
			// this.tabComplete.reset();
			this.chatHistories[userid].push(text);

			var data = '';
			var cmd = '';
			var spaceIndex = text.indexOf(' ');
			if (text.substr(0, 2) !== '//' && text.charAt(0) === '/' || text.charAt(0) === '!') {
				if (spaceIndex > 0) {
					data = text.substr(spaceIndex);
					cmd = text.substr(1, spaceIndex - 1);
				} else {
					data = '';
					cmd = text.substr(1);
				}
			}
			switch (cmd.toLowerCase()) {
			case 'ignore':
				if (app.ignore[userid]) {
					$chat.append('<div class="chat">User ' + userid + ' is already on your ignore list. (Moderator messages will not be ignored.)</div>');
				} else {
					app.ignore[userid] = 1;
					$chat.append('<div class="chat">User ' + userid + ' ignored. (Moderator messages will not be ignored.)</div>');
				}
				break;
			case 'unignore':
				if (!app.ignore[userid]) {
					$chat.append('<div class="chat">User ' + userid + ' isn\'t on your ignore list.</div>');
				} else {
					delete app.ignore[userid];
					$chat.append('<div class="chat">User ' + userid + ' no longer ignored.</div>');
				}
				break;
			case 'challenge':
				this.challenge(userid, data);
				break;
			case 'clear':
				$chat.empty();
				break;
			case 'rank':
			case 'ranking':
			case 'rating':
			case 'ladder':
				$chat.append('<div class="chat">Use this command in a proper chat room.</div>');
				break;
			default:
				if (!userid) userid = '~';
				text = ('\n' + text).replace(/\n\n/g, '\n').replace(/\n/g, '\n/pm ' + userid + ', ').substr(1);
				if (text.length > 80000) {
					app.addPopupMessage("Your message is too long.");
					return;
				}
				this.send(text);
			}
			$target.val('');
			$target.trigger('keyup'); // force a resize
		},
		keyDown: function (e) {
			var cmdKey = (((e.cmdKey || e.metaKey) ? 1 : 0) + (e.ctrlKey ? 1 : 0) === 1) && !e.altKey && !e.shiftKey;
			if (e.keyCode === 13 && !e.shiftKey) { // Enter
				this.submitPM(e);
			} else if (e.keyCode === 27) { // Esc
				if (app.curSideRoom && app.curSideRoom.undoTabComplete && app.curSideRoom.undoTabComplete($(e.currentTarget))) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					this.closePM(e);
				}
			} else if (e.keyCode === 73 && cmdKey) { // Ctrl + I key
				if (ConsoleRoom.toggleFormatChar(e.currentTarget, '_')) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 66 && cmdKey) { // Ctrl + B key
				if (ConsoleRoom.toggleFormatChar(e.currentTarget, '*')) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 33) { // Pg Up key
				var $target = $(e.currentTarget);
				var $pmWindow = $target.closest('.pm-window');
				var $chat = $pmWindow.find('.pm-log');
				$chat.scrollTop($chat.scrollTop() - $chat.height() + 60);
			} else if (e.keyCode === 34) { // Pg Dn key
				var $target = $(e.currentTarget);
				var $pmWindow = $target.closest('.pm-window');
				var $chat = $pmWindow.find('.pm-log');
				$chat.scrollTop($chat.scrollTop() + $chat.height() - 60);
			} else if (e.keyCode === 9 && !e.ctrlKey) { // Tab key
				var reverse = !!e.shiftKey; // Shift+Tab reverses direction
				var handlerRoom = app.curSideRoom;
				if (!handlerRoom) {
					for (var roomid in app.rooms) {
						if (!app.rooms[roomid].handleTabComplete) continue;
						handlerRoom = app.rooms[roomid];
						break;
					}
				}
				if (handlerRoom && handlerRoom.handleTabComplete && handlerRoom.handleTabComplete($(e.currentTarget), reverse)) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 38 && !e.shiftKey && !e.altKey) { // Up key
				if (this.chatHistoryUp(e)) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if (e.keyCode === 40 && !e.shiftKey && !e.altKey) { // Down key
				if (this.chatHistoryDown(e)) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		chatHistoryUp: function (e) {
			var $textbox = $(e.currentTarget);
			var idx = +$textbox.prop('selectionStart');
			var line = $textbox.val();
			if (e && !e.ctrlKey && idx !== 0 && idx !== line.length) return false;
			var userid = $textbox.closest('.pm-window').data('userid');
			var chatHistory = this.chatHistories[userid];
			if (chatHistory.index === 0) return false;
			$textbox.val(chatHistory.up(line));
			return true;
		},
		chatHistoryDown: function (e) {
			var $textbox = $(e.currentTarget);
			var idx = +$textbox.prop('selectionStart');
			var line = $textbox.val();
			if (e && !e.ctrlKey && idx !== 0 && idx !== line.length) return false;
			var userid = $textbox.closest('.pm-window').data('userid');
			var chatHistory = this.chatHistories[userid];
			$textbox.val(chatHistory.down(line));
			return true;
		},
		chatHistories: {},
		clickUsername: function (e) {
			e.stopPropagation();
			var name = $(e.currentTarget).data('name') || $(e.currentTarget).text();
			app.addPopup(UserPopup, {name: name, sourceEl: e.currentTarget});
		},
		clickPMBackground: function (e) {
			if (!e.shiftKey && !e.cmdKey && !e.ctrlKey) {
				if (window.getSelection && !window.getSelection().isCollapsed) {
					return;
				}
				app.dismissPopups();
				var $target = $(e.currentTarget);
				var newsid = $target.data('newsid');
				if ($target.data('minimized')) {
					this.minimizePM(e);
				} else if ($(e.target).closest('h3').length) {
					// only preventDefault here, so clicking links/buttons in PMs
					// still works
					e.preventDefault();
					e.stopPropagation();
					this.minimizePM(e);
					return;
				} else if (newsid) {
					if (Storage.prefs('newsid', newsid)) {
						$target.find('.unread').removeClass('unread');
					}
					return;
				}
				$target.find('textarea[name=message]').focus();
			}
		},
		dblClickPMHeader: function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			} else if (document.selection) {
				document.selection.empty();
			}
		},
		clickSpoiler: function (e) {
			$(e.currentTarget).toggleClass('spoiler-shown');
		},

		// support for buttons that can be sent by the server:

		joinRoom: function (room) {
			app.joinRoom(room);
		},
		avatars: function () {
			app.addPopup(AvatarsPopup);
		},
		openSounds: function () {
			app.addPopup(SoundsPopup, {type: 'semimodal'});
		},
		openOptions: function () {
			app.addPopup(OptionsPopup, {type: 'semimodal'});
		},

		// challenges and searching

		challengesFrom: null,
		challengeTo: null,
		resetPending: function () {
			this.updateSearch();
			var self = this;
			this.$('form.pending').closest('.pm-window').each(function (i, el) {
				$(el).find('.challenge').remove();
				self.challenge($(el).data('userid'));
			});
			this.$('button[name=acceptChallenge]').each(function (i, el) {
				el.disabled = false;
			});
		},
		searching: false,
		updateSearch: function (data) {
			if (data) {
				this.searching = data.searching;
				this.games = data.games;
			}
			var $searchForm = $('.mainmenu button.big').closest('form');
			var $formatButton = $searchForm.find('button[name=format]');
			var $teamButton = $searchForm.find('button[name=team]');
			if (!this.searching || $.isArray(this.searching) && !this.searching.length) {
				var format = $formatButton.val();
				var teamIndex = $teamButton.val();
				$formatButton.replaceWith(this.renderFormats(format));
				$teamButton.replaceWith(this.renderTeams(format, teamIndex));

				$searchForm.find('button.big').html('<strong>Battle!</strong><br /><small>Find a random opponent</small>').removeClass('disabled');
				$searchForm.find('p.cancel').remove();
			} else {
				$formatButton.addClass('preselected')[0].disabled = true;
				$teamButton.addClass('preselected')[0].disabled = true;
				$searchForm.find('button.big').html('<strong><i class="fa fa-refresh fa-spin"></i> Searching...</strong>').addClass('disabled');
				var searchEntries = $.isArray(this.searching) ? this.searching : [this.searching];
				for (var i = 0; i < searchEntries.length; i++) {
					var format = searchEntries[i].format || searchEntries[i];
					if (format.substr(0, 4) === 'gen5' && !Dex.loadedSpriteData['bw']) {
						Dex.loadSpriteData('bw');
						break;
					}
				}
			}

			var $searchGroup = $searchForm.closest('.menugroup');
			if (this.games) {
				var newlyCreated = false;
				if (!this.$gamesGroup) {
					this.$gamesGroup = $('<div class="menugroup"></div>');
					$searchGroup.before(this.$gamesGroup);
					newlyCreated = true;
				}
				if (!this.$gamesGroup.is(':visible') || newlyCreated) {
					$searchGroup.hide();
					this.$gamesGroup.show();
				}
				var buf = '<form class="battleform"><p><label class="label">Games:</label></p>';
				buf += '<div class="roomlist">';
				for (var roomid in this.games) {
					var name = this.games[roomid];
					if (name.slice(-1) === '*') name = name.slice(0, -1);
					buf += '<div><a href="/' + toRoomid(roomid) + '" class="ilink" style="text-align: center">' + BattleLog.escapeHTML(name) + '</a></div>';
				}
				buf += '</div>';
				if (!$searchGroup.is(':visible')) buf += '<p class="buttonbar"><button name="showSearchGroup">Add game</button></p>';
				buf += '</form>';
				this.$gamesGroup.html(buf);
			} else {
				if (this.$gamesGroup) {
					this.$gamesGroup.hide();
					$searchGroup.show();
				}
			}
		},
		showSearchGroup: function (v, el) {
			var $searchGroup = $('.mainmenu button.big').closest('.menugroup');
			$searchGroup.show();
			$(el).closest('p').hide();
		},
		updateChallenges: function (data) {
			this.challengesFrom = data.challengesFrom;
			this.challengeTo = data.challengeTo;
			for (var i in data.challengesFrom) {
				if (app.ignore[i]) {
					delete data.challengesFrom[i];
					continue;
				}
				this.openPM(' ' + i, true);
			}
			var atLeastOneGen5 = false;

			var challengeToUserid = '';
			if (data.challengeTo) {
				var challenge = data.challengeTo;
				var name = challenge.to;
				var userid = toId(name);
				var $challenge = this.openChallenge(name);

				var buf = '<form class="battleform"><p>Waiting for ' + BattleLog.escapeHTML(name) + '...</p>';
				buf += '<p><label class="label">Format:</label>' + this.renderFormats(challenge.format, true) + '</p>';
				buf += '<p class="buttonbar"><button name="cancelChallenge">Cancel</button></p></form>';

				$challenge.html(buf);
				if (challenge.format.substr(0, 4) === 'gen5') atLeastOneGen5 = true;
				challengeToUserid = userid;
			}

			var self = this;
			this.$('.pm-window').each(function (i, el) {
				var $pmWindow = $(el);
				var userid = $pmWindow.data('userid');
				var name = $pmWindow.data('name');
				if (data.challengesFrom[userid]) {
					var format = data.challengesFrom[userid];
					if (!$pmWindow.find('.challenge').length) {
						self.notifyOnce("Challenge from " + name, "Format: " + BattleLog.escapeFormat(format), 'challenge:' + userid);
					}
					var $challenge = self.openChallenge(name, $pmWindow);
					var buf = '<form class="battleform"><p>' + BattleLog.escapeHTML(name) + ' wants to battle!</p>';
					buf += '<p><label class="label">Format:</label>' + self.renderFormats(format, true) + '</p>';
					buf += '<p><label class="label">Team:</label>' + self.renderTeams(format) + '</p>';
					buf += '<p class="buttonbar"><button name="acceptChallenge"><strong>Accept</strong></button> <button name="rejectChallenge">Reject</button></p></form>';
					$challenge.html(buf);
					if (format.substr(0, 4) === 'gen5') atLeastOneGen5 = true;
				} else {
					var $challenge = $pmWindow.find('.challenge');
					if ($challenge.length) {
						var $acceptButton = $challenge.find('button[name=acceptChallenge]');
						if ($acceptButton.length) {
							if ($acceptButton[0].disabled) {
								// You accepted someone's challenge and it started
								$challenge.remove();
							} else {
								// Someone was challenging you, but cancelled their challenge
								$challenge.html('<form class="battleform"><p>The challenge was cancelled.</p><p class="buttonbar"><button name="dismissChallenge">OK</button></p></form>');
							}
						} else if ($challenge.find('button[name=cancelChallenge]').length && challengeToUserid !== userid) {
							// You were challenging someone else, and they either accepted
							// or rejected it
							$challenge.remove();
						}
						self.closeNotification('challenge:' + userid);
					}
				}
			});

			if (atLeastOneGen5 && !Dex.loadedSpriteData['bw']) Dex.loadSpriteData('bw');
		},
		openChallenge: function (name, $pmWindow) {
			if (!$pmWindow) $pmWindow = this.openPM(name, true);
			var $challenge = $pmWindow.find('.challenge');
			if (!$challenge.length) {
				$challenge = $('<div class="challenge"></div>').insertAfter($pmWindow.find('h3'));
			}
			return $challenge;
		},
		updateFormats: function () {
			if (!window.BattleFormats) {
				this.$('.mainmenu button.big').html('<em>Connecting...</em>').addClass('disabled');
				return;
			} else if (app.isDisconnected) {
				var $searchForm = $('.mainmenu button.big').closest('form');
				$searchForm.find('button.big').html('<em>Disconnected</em>').addClass('disabled');
				$searchForm.find('.mainmenu p.cancel').remove();
				$searchForm.append('<p class="cancel buttonbar"><button name="reconnect">Reconnect</button></p>');
				this.$('button.onlineonly').addClass('disabled');
				return;
			}
			this.$('button.onlineonly').removeClass('disabled');

			if (!this.searching) this.$('.mainmenu button.big').html('<strong>Battle!</strong><br /><small>Find a random opponent</small>').removeClass('disabled');
			var self = this;
			this.$('button[name=format]').each(function (i, el) {
				var val = el.value;
				var $teamButton = $(el).closest('form').find('button[name=team]');
				$(el).replaceWith(self.renderFormats(val));
				$teamButton.replaceWith(self.renderTeams(val));
			});
		},
		reconnect: function () {
			document.location.reload();
		},
		updateTeams: function () {
			if (!window.BattleFormats) return;
			var self = this;

			this.$('button[name=team]').each(function (i, el) {
				if (el.value === 'random') return;
				var format = $(el).closest('form').find('button[name=format]').val();
				$(el).replaceWith(self.renderTeams(format));
			});
		},
		updateRightMenu: function () {
			if (app.curSideRoom) {
				this.$('.rightmenu').hide();
			} else {
				this.$('.rightmenu').show();
			}
		},

		// challenge buttons
		challenge: function (name, format, team) {
			var userid = toId(name);
			var $challenge = this.$('.pm-window-' + userid + ' .challenge');
			if ($challenge.length && !$challenge.find('button[name=dismissChallenge]').length) {
				return;
			}

			if (format) format = toId(format);
			var teamIndex;
			if (Storage.teams && team) {
				team = toId(team);
				for (var i = 0; i < Storage.teams.length; i++) {
					if (team === toId(Storage.teams[i].name || '')) {
						teamIndex = i;
						break;
					}
				}
			}

			$challenge = this.openChallenge(name);
			var buf = '<form class="battleform"><p>Challenge ' + BattleLog.escapeHTML(name) + '?</p>';
			buf += '<p><label class="label">Format:</label>' + this.renderFormats(format) + '</p>';
			buf += '<p><label class="label">Team:</label>' + this.renderTeams(format, teamIndex) + '</p>';
			buf += '<p class="buttonbar"><button name="makeChallenge"><strong>Challenge</strong></button> <button name="dismissChallenge">Cancel</button></p></form>';
			$challenge.html(buf);
		},
		acceptChallenge: function (i, target) {
			this.requestNotifications();
			var $pmWindow = $(target).closest('.pm-window');
			var userid = $pmWindow.data('userid');

			var format = $pmWindow.find('button[name=format]').val();
			var teamIndex = $pmWindow.find('button[name=team]').val();
			var team = null;
			if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];
			if (format.indexOf('@@@') === -1 && !window.BattleFormats[format].team && !team) {
				app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
				return;
			}

			target.disabled = true;
			app.sendTeam(team);
			app.send('/accept ' + userid);
		},
		rejectChallenge: function (i, target) {
			var userid = $(target).closest('.pm-window').data('userid');
			$(target).closest('.challenge').remove();
			app.send('/reject ' + userid);
		},
		makeChallenge: function (i, target) {
			this.requestNotifications();
			var $pmWindow = $(target).closest('.pm-window');
			var userid = $pmWindow.data('userid');
			var name = $pmWindow.data('name');

			var format = $pmWindow.find('button[name=format]').val();
			var teamIndex = $pmWindow.find('button[name=team]').val();
			var team = null;
			if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];
			if (!window.BattleFormats[format].team && !team) {
				app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
				return;
			}

			var buf = '<form class="battleform pending"><p>Challenging ' + BattleLog.escapeHTML(name) + '...</p>';
			buf += '<p><label class="label">Format:</label>' + this.renderFormats(format, true) + '</p>';
			buf += '<p class="buttonbar"><button name="cancelChallenge">Cancel</button></p></form>';

			$(target).closest('.challenge').html(buf);
			app.sendTeam(team);
			app.send('/challenge ' + userid + ', ' + format);
		},
		cancelChallenge: function (i, target) {
			var userid = $(target).closest('.pm-window').data('userid');
			$(target).closest('.challenge').remove();
			app.send('/cancelchallenge ' + userid);
		},
		dismissChallenge: function (i, target) {
			$(target).closest('.challenge').remove();
		},
		format: function (format, button) {
			if (window.BattleFormats) app.addPopup(FormatPopup, {format: format, sourceEl: button});
		},
		team: function (team, button) {
			var format = $(button).closest('form').find('button[name=format]').val();
			app.addPopup(TeamPopup, {team: team, format: format, sourceEl: button});
		},

		// format/team selection

		curFormat: '',
		renderFormats: function (formatid, noChoice) {
			if (!window.BattleFormats) {
				return '<button class="select formatselect" name="format" disabled value="' + BattleLog.escapeHTML(formatid) + '"><em>Loading...</em></button>';
			}
			if (_.isEmpty(BattleFormats)) {
				return '<button class="select formatselect" name="format" disabled><em>No formats available</em></button>';
			}
			if (!noChoice) {
				this.curFormat = formatid;
				if (!this.curFormat) {
					if (BattleFormats['gen7randombattle']) {
						this.curFormat = 'gen7randombattle';
					} else for (var i in BattleFormats) {
						if (!BattleFormats[i].searchShow || !BattleFormats[i].challengeShow) continue;
						this.curFormat = i;
						break;
					}
				}
				formatid = this.curFormat;
			}
			return '<button class="select formatselect' + (noChoice ? ' preselected' : '') + '" name="format" value="' + formatid + '"' + (noChoice ? ' disabled' : '') + '>' + BattleLog.escapeFormat(formatid) + '</button>';
		},
		curTeamFormat: '',
		curTeamIndex: 0,
		renderTeams: function (formatid, teamIndex) {
			if (!Storage.teams || !window.BattleFormats) {
				return '<button class="select teamselect" name="team" disabled><em>Loading...</em></button>';
			}
			if (!formatid) formatid = this.curFormat;
			var atIndex = formatid.indexOf('@@@');
			if (atIndex >= 0) formatid = formatid.slice(0, atIndex);
			if (!window.BattleFormats[formatid]) {
				return '<button class="select teamselect" name="team" disabled></button>';
			}
			if (window.BattleFormats[formatid].team) {
				return '<button class="select teamselect preselected" name="team" value="random" disabled>' + TeamPopup.renderTeam('random') + '</button>';
			}

			var format = window.BattleFormats[formatid];
			var teamFormat = (format.teambuilderFormat || (format.isTeambuilderFormat ? formatid : false));

			var teams = Storage.teams;
			if (!teams.length) {
				return '<button class="select teamselect" name="team" disabled>You have no teams</button>';
			}
			if (teamIndex === undefined) teamIndex = -1;
			if (teamIndex < 0) {
				if (this.curTeamIndex >= 0) {
					teamIndex = this.curTeamIndex;
				}
				if (this.curTeamFormat !== teamFormat) {
					for (var i = 0; i < teams.length; i++) {
						if (teams[i].format === teamFormat) {
							teamIndex = i;
							break;
						}
					}
				}
			} else {
				teamIndex = +teamIndex;
			}
			return '<button class="select teamselect" name="team" value="' + (teamIndex < 0 ? '' : teamIndex) + '">' + TeamPopup.renderTeam(teamIndex) + '</button>';
		},

		// buttons
		search: function (i, button) {
			if (!window.BattleFormats) return;
			this.requestNotifications();
			var $searchForm = $(button).closest('form');
			if ($searchForm.find('.cancel').length) {
				return;
			}

			if (!app.user.get('named')) {
				app.addPopup(LoginPopup);
				return;
			}

			var $formatButton = $searchForm.find('button[name=format]');
			var $teamButton = $searchForm.find('button[name=team]');

			var format = $formatButton.val();
			var teamIndex = $teamButton.val();
			var team = null;
			if (Storage.teams[teamIndex]) team = Storage.teams[teamIndex];
			if (!window.BattleFormats[format].team && (teamIndex === '' || !team)) {
				if (Storage.teams) {
					app.addPopupMessage("Please select a team.");
				} else {
					app.addPopupMessage("You need to go into the Teambuilder and build a team for this format.");
				}
				return;
			}

			$formatButton.addClass('preselected')[0].disabled = true;
			$teamButton.addClass('preselected')[0].disabled = true;
			$searchForm.find('button.big').html('<strong><i class="fa fa-refresh fa-spin"></i> Connecting...</strong>').addClass('disabled');
			$searchForm.append('<p class="cancel buttonbar"><button name="cancelSearch">Cancel</button></p>');

			app.sendTeam(team);
			this.searchDelay = setTimeout(function () {
				app.send('/search ' + format);
			}, 3000);
		},
		cancelSearch: function () {
			clearTimeout(this.searchDelay);
			app.send('/cancelsearch');
			this.searching = false;
			this.updateSearch();
		},
		finduser: function () {
			if (app.isDisconnected) {
				app.addPopupMessage("You are offline.");
				return;
			}
			app.addPopupPrompt("Username", "Open", function (target) {
				if (!target) return;
				if (toId(target) === 'zarel') {
					app.addPopup(Popup, {htmlMessage: "Zarel is very busy; please don't contact him this way. If you're looking for help, try <a href=\"/help\">joining the Help room</a>?"});
					return;
				}
				app.addPopup(UserPopup, {name: target});
			});
		}
	}, {
		parseChatMessage: function (message, name, timestamp, isHighlighted, $chatElem) {
			var showMe = !((Dex.prefs('chatformatting') || {}).hideme);
			var group = ' ';
			if (!/[A-Za-z0-9]/.test(name.charAt(0))) {
				// Backwards compatibility
				group = name.charAt(0);
				name = name.substr(1);
			}
			var color = BattleLog.hashColor(toId(name));
			var clickableName = '<small>' + BattleLog.escapeHTML(group) + '</small><span class="username" data-name="' + BattleLog.escapeHTML(name) + '">' + BattleLog.escapeHTML(name) + '</span>';
			var hlClass = isHighlighted ? ' highlighted' : '';
			var mineClass = (window.app && app.user && app.user.get('name') === name ? ' mine' : '');

			var cmd = '';
			var target = '';
			if (message.charAt(0) === '/') {
				if (message.charAt(1) === '/') {
					message = message.slice(1);
				} else {
					var spaceIndex = message.indexOf(' ');
					cmd = (spaceIndex >= 0 ? message.slice(1, spaceIndex) : message.slice(1));
					if (spaceIndex >= 0) target = message.slice(spaceIndex + 1);
				}
			}

			switch (cmd) {
			case 'me':
				if (!showMe) return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>/me' + BattleLog.parseMessage(' ' + target) + '</em></div>';
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">&bull;</strong> <em>' + clickableName + '<i>' + BattleLog.parseMessage(' ' + target) + '</i></em></div>';
			case 'mee':
				if (!showMe) return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>/me' + BattleLog.parseMessage(' ' + target).slice(1) + '</em></div>';
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">&bull;</strong> <em>' + clickableName + '<i>' + BattleLog.parseMessage(' ' + target).slice(1) + '</i></em></div>';
			case 'invite':
				var roomid = toRoomid(target);
				return [
					'<div class="chat">' + timestamp + '<em>' + clickableName + ' invited you to join the room "' + roomid + '"</em></div>',
					'<div class="notice"><button name="joinRoom" value="' + roomid + '">Join ' + roomid + '</button></div>'
				];
			case 'announce':
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <span class="message-announce">' + BattleLog.parseMessage(target) + '</span></div>';
			case 'log':
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<span class="message-log">' + BattleLog.parseMessage(target) + '</span></div>';
			case 'data-pokemon':
			case 'data-item':
			case 'data-ability':
			case 'data-move':
				return '[outdated message type not supported]';
			case 'text':
				return '<div class="chat">' + BattleLog.parseMessage(target) + '</div>';
			case 'error':
				return '<div class="chat message-error">' + BattleLog.escapeHTML(target) + '</div>';
			case 'html':
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>' + BattleLog.sanitizeHTML(target) + '</em></div>';
			case 'uhtml':
			case 'uhtmlchange':
				var parts = target.split(',');
				var $elements = $chatElem.find('div.uhtml-' + toId(parts[0]));
				var html = parts.slice(1).join(',');
				if (!html) {
					$elements.remove();
				} else if (!$elements.length) {
					$chatElem.append('<div class="chat uhtml-' + toId(parts[0]) + '">' + BattleLog.sanitizeHTML(html) + '</div>');
				} else if (cmd === 'uhtmlchange') {
					$elements.html(BattleLog.sanitizeHTML(html));
				} else {
					$elements.remove();
					$chatElem.append('<div class="chat uhtml-' + toId(parts[0]) + '">' + BattleLog.sanitizeHTML(html) + '</div>');
				}
				return '';
			case 'raw':
				return '<div class="chat">' + BattleLog.sanitizeHTML(target) + '</div>';
			default:
				// Not a command or unsupported. Parsed as a normal chat message.
				if (!name) {
					return '<div class="chat' + hlClass + '">' + timestamp + '<em>' + BattleLog.parseMessage(message) + '</em></div>';
				}
				return '<div class="chat chatmessage-' + toId(name) + hlClass + mineClass + '">' + timestamp + '<strong style="' + color + '">' + clickableName + ':</strong> <em>' + BattleLog.parseMessage(message) + '</em></div>';
			}
		}
	});

	var FormatPopup = this.FormatPopup = this.Popup.extend({
		initialize: function (data) {
			var curFormat = data.format;
			this.onselect = data.onselect;
			var selectType = data.selectType;
			if (!selectType) selectType = (this.sourceEl.closest('form').data('search') ? 'search' : 'challenge');
			var bufs = [];
			var curBuf = 0;
			if (selectType === 'watch') {
				bufs[1] = '<li><button name="selectFormat" value=""' + (curFormat === '' ? ' class="sel"' : '') + '>(All formats)</button></li>';
			}
			var curSection = '';
			for (var i in BattleFormats) {
				var format = BattleFormats[i];
				if (selectType === 'teambuilder') {
					if (!format.isTeambuilderFormat) continue;
				} else {
					if (format.effectType !== 'Format' || format.battleFormat) continue;
					if (selectType != 'watch' && !format[selectType + 'Show']) continue;
				}

				if (format.section && format.section !== curSection) {
					curSection = format.section;
					if (!app.supports['formatColumns']) {
						curBuf = (curSection === 'Doubles' || curSection === 'Past Generations') ? 2 : 1;
					} else {
						curBuf = format.column || 1;
					}
					if (!bufs[curBuf]) {
						bufs[curBuf] = '';
					}
					bufs[curBuf] += '<li><h3>' + BattleLog.escapeHTML(curSection) + '</li>';
				}
				var formatName = BattleLog.escapeFormat(format.id);
				if (formatName.charAt(0) !== '[') formatName = '[Gen 6] ' + formatName;
				formatName = formatName.replace('[Gen 7] ', '');
				formatName = formatName.replace('[Gen 7 ', '[');
				bufs[curBuf] += '<li><button name="selectFormat" value="' + i + '"' + (curFormat === i ? ' class="sel"' : '') + '>' + formatName + '</button></li>';
			}

			var html = '';
			for (var i = 1, l = bufs.length; i < l; i++) {
				html += '<ul class="popupmenu"';
				if (l > 1) {
					html += ' style="float:left';
					if (i > 0) {
						html += ';padding-left:5px';
					}
					html += '"';
				}
				html += '>' + bufs[i] + '</ul>';
			}
			html += '<div style="clear:left"></div>';
			this.$el.html(html);
		},
		selectFormat: function (format) {
			if (this.onselect) {
				this.onselect(format);
			} else if (app.rooms[''].curFormat !== format) {
				app.rooms[''].curFormat = format;
				app.rooms[''].curTeamIndex = -1;
				var $teamButton = this.sourceEl.closest('form').find('button[name=team]');
				if ($teamButton.length) $teamButton.replaceWith(app.rooms[''].renderTeams(format));
			}
			this.sourceEl.val(format).html(BattleLog.escapeFormat(format) || '(Select a format)');

			this.close();
		}
	});

	var TeamPopup = this.TeamPopup = this.Popup.extend({
		initialize: function (data) {
			var bufs = ['', '', '', '', ''];
			var curBuf = 0;
			var teams = Storage.teams;

			var bufBoundary = 128;
			if (teams.length > 128 && $(window).width() > 1080) {
				bufBoundary = Math.ceil(teams.length / 5);
			} else if (teams.length > 81) {
				bufBoundary = Math.ceil(teams.length / 4);
			} else if (teams.length > 54) {
				bufBoundary = Math.ceil(teams.length / 3);
			} else if (teams.length > 27) {
				bufBoundary = Math.ceil(teams.length / 2);
			}

			this.team = data.team;
			this.format = data.format;
			this.room = data.room;

			var format = BattleFormats[data.format];

			var teamFormat = (format.teambuilderFormat || (format.isTeambuilderFormat ? data.format : false));
			this.teamFormat = teamFormat;

			if (!teams.length) {
				bufs[curBuf] = '<li><p><em>You have no teams</em></p></li>';
				bufs[curBuf] += '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong><br />' + BattleLog.escapeFormat(teamFormat) + ' teams</button></li>';
			} else {
				var curTeam = (data.team === '' ? -1 : +data.team);
				var count = 0;
				if (teamFormat) {
					bufs[curBuf] = '<li><h3>' + BattleLog.escapeFormat(teamFormat) + ' teams</h3></li>';
					for (var i = 0; i < teams.length; i++) {
						if ((!teams[i].format && !teamFormat) || teams[i].format === teamFormat) {
							var selected = (i === curTeam);
							bufs[curBuf] += '<li><button name="selectTeam" value="' + i + '"' + (selected ? ' class="sel"' : '') + '>' + BattleLog.escapeHTML(teams[i].name) + '</button></li>';
							count++;
							if (count % bufBoundary == 0 && curBuf < 4) curBuf++;
						}
					}
					if (!count) bufs[curBuf] += '<li><p><em>You have no ' + BattleLog.escapeFormat(teamFormat) + ' teams</em></p></li>';
					bufs[curBuf] += '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong><br />' + BattleLog.escapeFormat(teamFormat) + ' teams</button></li>';
					bufs[curBuf] += '<li><h3>Other teams</h3></li>';
				} else {
					bufs[curBuf] = '<li><button name="teambuilder" class="button"><strong>Teambuilder</strong></button></li>';
					bufs[curBuf] += '<li><h3>All teams</h3></li>';
					data.moreTeams = true;
				}
				if (data.moreTeams) {
					for (var i = 0; i < teams.length; i++) {
						if (teamFormat && teams[i].format === teamFormat) continue;
						var selected = (i === curTeam);
						bufs[curBuf] += '<li><button name="selectTeam" value="' + i + '"' + (selected ? ' class="sel"' : '') + '>' + BattleLog.escapeHTML(teams[i].name) + '</button></li>';
						count++;
						if (count % bufBoundary == 0 && curBuf < 4) curBuf++;
					}
				} else {
					bufs[curBuf] += '<li><button name="moreTeams" class="button">Show all teams</button></li>';
				}
			}
			if (format.canUseRandomTeam) {
				bufs[curBuf] += '<li><button value="-1">Random Team</button></li>';
			}

			if (bufs[1]) {
				while (!bufs[bufs.length - 1]) bufs.pop();
				this.$el.html('<ul class="popupmenu" style="float:left">' + bufs.join('</ul><ul class="popupmenu" style="float:left;padding-left:5px">') + '</ul><div style="clear:left"></div>');
			} else {
				this.$el.html('<ul class="popupmenu">' + bufs[0] + '</ul>');
			}
		},
		moreTeams: function () {
			var sourceEl = this.sourceEl;
			var team = this.team;
			var format = this.format;
			var room = this.room;
			this.close();
			app.addPopup(TeamPopup, {team: team, format: format, sourceEl: sourceEl, room: room, moreTeams: true});
		},
		teambuilder: function () {
			var teamFormat = this.teamFormat;
			this.close();
			app.joinRoom('teambuilder');
			var teambuilder = app.rooms['teambuilder'];
			if (!teambuilder.exportMode && !teambuilder.curTeam && teamFormat) {
				teambuilder.selectFolder(teamFormat);
			}
		},
		selectTeam: function (i) {
			i = +i;
			this.sourceEl.val(i).html(TeamPopup.renderTeam(i));
			if (this.sourceEl[0].offsetParent.className === 'mainmenuwrapper') {
				var formatid = this.sourceEl.closest('form').find('button[name=format]').val();
				app.rooms[''].curTeamIndex = i;
				app.rooms[''].curTeamFormat = formatid;
			} else if (this.sourceEl[0].offsetParent.className === 'tournament-box active') {
				app.rooms[this.room].tournamentBox.curTeamIndex = i;
			}
			this.close();
		}
	}, {
		renderTeam: function (i) {
			if (i === 'random') {
				var buf = '<strong>Random team</strong><small>';
				for (var i = 0; i < 6; i++) {
					buf += '<span class="picon" style="float:left;' + Dex.getPokemonIcon() + '"></span>';
				}
				buf += '</small>';
				return buf;
			}
			if (i < 0) {
				return '<em>Select a team</em>';
			}
			var team = Storage.teams[i];
			if (!team) return 'Error: Corrupted team';
			var buf = '<strong>' + BattleLog.escapeHTML(team.name) + '</strong><small>';
			buf += Storage.getTeamIcons(team) + '</small>';
			return buf;
		}
	});

}).call(this, jQuery);
