(function ($) {

	var BattleRoom = this.BattleRoom = ConsoleRoom.extend({
		type: 'battle',
		title: '',
		minWidth: 320,
		minMainWidth: 956,
		maxWidth: 1180,
		initialize: function (data) {
			this.me = {};

			this.battlePaused = false;

			this.isSideRoom = Dex.prefs('rightpanelbattles');

			this.$el.addClass('ps-room-opaque').html('<div class="battle">Battle is here</div><div class="foehint"></div><div class="battle-log" aria-label="Battle Log" role="complementary"></div><div class="battle-log-add">Connecting...</div><ul class="battle-userlist userlist userlist-minimized"></ul><div class="battle-controls" role="complementary" aria-label="Battle Controls"></div><button class="battle-chat-toggle button" name="showChat"><i class="fa fa-caret-left"></i> Chat</button>');

			this.$battle = this.$el.find('.battle');
			this.$controls = this.$el.find('.battle-controls');
			this.$chatFrame = this.$el.find('.battle-log');
			this.$chatAdd = this.$el.find('.battle-log-add');
			this.$foeHint = this.$el.find('.foehint');

			BattleSound.setMute(Dex.prefs('mute'));
			this.battle = new Battle(this.$battle, this.$chatFrame, this.id);
			this.tooltips = new BattleTooltips(this.battle, this);

			this.battle.roomid = this.id;
			this.battle.joinButtons = true;
			this.users = {};
			this.userCount = {users: 0};
			this.$userList = this.$('.userlist');
			this.userList = new UserList({
				el: this.$userList,
				room: this
			});
			this.userList.construct();

			this.$chat = this.$chatFrame.find('.inner');

			this.$options = this.battle.scene.$options.html('<div style="padding-top: 3px; padding-right: 3px; text-align: right"><button class="icon button" name="openBattleOptions" title="Options">Battle Options</button></div>');

			var self = this;
			this.battle.customCallback = function () { self.updateControls(); };
			this.battle.endCallback = function () { self.updateControls(); };
			this.battle.startCallback = function () { self.updateControls(); };
			this.battle.stagnateCallback = function () { self.updateControls(); };

			this.battle.play();
		},
		events: {
			'click .replayDownloadButton': 'clickReplayDownloadButton',
			'change input[name=zmove]': 'updateZMove'
		},
		battleEnded: false,
		join: function () {
			app.send('/join ' + this.id);
		},
		showChat: function () {
			this.$('.battle-chat-toggle').attr('name', 'hideChat').html('Battle <i class="fa fa-caret-right"></i>');
			this.$el.addClass('showing-chat');
		},
		hideChat: function () {
			this.$('.battle-chat-toggle').attr('name', 'showChat').html('<i class="fa fa-caret-left"></i> Chat');
			this.$el.removeClass('showing-chat');
		},
		leave: function () {
			if (!this.expired) app.send('/leave ' + this.id);
			if (this.battle) this.battle.destroy();
		},
		requestLeave: function (e) {
			if (this.side && this.battle && !this.battleEnded && !this.expired && !this.battle.forfeitPending) {
				app.addPopup(ForfeitPopup, {room: this, sourceEl: e && e.currentTarget, gameType: 'battle'});
				return false;
			}
			return true;
		},
		updateLayout: function () {
			var width = this.$el.width();
			if (width < 950 || this.battle.hardcoreMode) {
				this.battle.messageShownTime = 500;
			} else {
				this.battle.messageShownTime = 1;
			}
			if (width && width < 640) {
				var scale = (width / 640);
				this.$battle.css('transform', 'scale(' + scale + ')');
				this.$foeHint.css('transform', 'scale(' + scale + ')');
				this.$controls.css('top', 360 * scale + 10);
			} else {
				this.$battle.css('transform', 'none');
				this.$foeHint.css('transform', 'none');
				this.$controls.css('top', 370);
			}
			this.$el.toggleClass('small-layout', width < 830);
			this.$el.toggleClass('tiny-layout', width < 640);
			if (this.$chat) this.$chatFrame.scrollTop(this.$chat.height());
		},
		show: function () {
			Room.prototype.show.apply(this, arguments);
			this.updateLayout();
		},
		receive: function (data) {
			this.add(data);
		},
		focus: function () {
			this.tooltips.hideTooltip();
			if (this.battle.playbackState === 3 && !this.battlePaused) {
				this.battle.play();
				if (Dex.prefs('noanim')) this.battle.fastForwardTo(-1);
			}
			ConsoleRoom.prototype.focus.call(this);
		},
		blur: function () {
			this.battle.pause();
		},
		init: function (data) {
			var log = data.split('\n');
			if (data.substr(0, 6) === '|init|') log.shift();
			if (log.length && log[0].substr(0, 7) === '|title|') {
				this.title = log[0].substr(7);
				log.shift();
				app.roomTitleChanged(this);
			}
			if (this.battle.activityQueue.length) return;
			this.battle.activityQueue = log;
			this.battle.fastForwardTo(-1);
			this.battle.play();
			if (this.battle.ended) this.battleEnded = true;
			this.updateLayout();
			this.updateControls();
		},
		add: function (data) {
			if (!data) return;
			if (data.substr(0, 6) === '|init|') {
				return this.init(data);
			}
			if (data.substr(0, 9) === '|request|') {
				data = data.slice(9);

				var requestData = null;
				var choiceText = null;

				var nlIndex = data.indexOf('\n');
				if (/[0-9]/.test(data.charAt(0)) && data.charAt(1) === '|') {
					// message format:
					//   |request|CHOICEINDEX|CHOICEDATA
					//   REQUEST

					// This is backwards compatibility with old code that violates the
					// expectation that server messages can be streamed line-by-line.
					// Please do NOT EVER push protocol changes without a pull request.
					// https://github.com/Zarel/Pokemon-Showdown/commit/e3c6cbe4b91740f3edc8c31a1158b506f5786d72#commitcomment-21278523
					choiceText = '?';
					data = data.slice(2, nlIndex);
				} else if (nlIndex >= 0) {
					// message format:
					//   |request|REQUEST
					//   |sentchoice|CHOICE
					if (data.slice(nlIndex + 1, nlIndex + 13) === '|sentchoice|') {
						choiceText = data.slice(nlIndex + 13);
					}
					data = data.slice(0, nlIndex);
				}

				try {
					requestData = JSON.parse(data);
				} catch (err) {}
				return this.receiveRequest(requestData, choiceText);
			}

			var log = data.split('\n');
			for (var i = 0; i < log.length; i++) {
				var logLine = log[i];

				if (logLine === '|') {
					this.callbackWaiting = false;
					this.controlsShown = false;
					this.$controls.html('');
				}

				if (logLine.substr(0, 10) === '|callback|') {
					// TODO: Maybe a more sophisticated UI for this.
					// In singles, this isn't really necessary because some elements of the UI will be
					// immediately disabled. However, in doubles/triples it might not be obvious why
					// the player is being asked to make a new decision without the following messages.
					var args = logLine.substr(10).split('|');
					var pokemon = isNaN(Number(args[1])) ? this.battle.getPokemon(args[1]) : this.battle.mySide.active[args[1]];
					var requestData = this.request.active[pokemon ? pokemon.slot : 0];
					delete this.choice;
					switch (args[0]) {
					case 'trapped':
						requestData.trapped = true;
						var pokeName = pokemon.side.n === 0 ? BattleLog.escapeHTML(pokemon.name) : "The opposing " + (this.battle.ignoreOpponent || this.battle.ignoreNicks ? pokemon.species : BattleLog.escapeHTML(pokemon.name));
						this.battle.activityQueue.push('|message|' + pokeName + ' is trapped and cannot switch!');
						break;
					case 'cant':
						for (var i = 0; i < requestData.moves.length; i++) {
							if (requestData.moves[i].id === args[3]) {
								requestData.moves[i].disabled = true;
							}
						}
						args.splice(1, 1, pokemon.getIdent());
						this.battle.activityQueue.push('|' + args.join('|'));
						break;
					}
				} else if (logLine.substr(0, 7) === '|title|') { // eslint-disable-line no-empty
				} else if (logLine.substr(0, 5) === '|win|' || logLine === '|tie') {
					this.battleEnded = true;
					this.battle.activityQueue.push(logLine);
				} else if (logLine.substr(0, 6) === '|chat|' || logLine.substr(0, 3) === '|c|' || logLine.substr(0, 4) === '|c:|' || logLine.substr(0, 9) === '|chatmsg|' || logLine.substr(0, 10) === '|inactive|') {
					this.battle.instantAdd(logLine);
				} else {
					this.battle.activityQueue.push(logLine);
				}
			}
			this.battle.add('', Dex.prefs('noanim'));
			this.updateControls();
		},
		toggleMessages: function (user) {
			var $messages = $('.chatmessage-' + user + '.revealed');
			var $button = $messages.find('button');
			if (!$messages.is(':hidden')) {
				$messages.hide();
				$button.html('<small>(' + ($messages.length) + ' line' + ($messages.length > 1 ? 's' : '') + 'from ' + user + ')</small>');
				$button.parent().show();
			} else {
				$button.html('<small>(Hide ' + ($messages.length) + ' line' + ($messages.length > 1 ? 's' : '') + ' from ' + user + ')</small>');
				$button.parent().removeClass('revealed');
				$messages.show();
			}
		},
		setHardcoreMode: function (mode) {
			this.battle.setHardcoreMode(mode);
			var id = '#' + this.el.id + ' ';
			this.$('.hcmode-style').remove();
			this.updateLayout(); // set animation delay
			if (mode) this.$el.prepend('<style class="hcmode-style">' + id + '.battle .turn,' + id + '.battle-history{display:none !important;}</style>');
			if (this.choice && this.choice.waiting) {
				this.updateControlsForPlayer();
			}
		},

		/*********************************************************
		 * Battle stuff
		 *********************************************************/

		updateControls: function (force) {
			var controlsShown = this.controlsShown;
			this.controlsShown = false;

			if (this.battle.playbackState === 5) {

				// battle is seeking
				this.$controls.html('');
				return;

			} else if (this.battle.playbackState === 2 || this.battle.playbackState === 3) {

				// battle is playing or paused
				if (!this.side || this.battleEnded) {
					// spectator
					if (this.battle.paused) {
						// paused
						this.$controls.html('<p><button class="button" name="resume"><i class="fa fa-play"></i><br />Play</button> <button class="button" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Last turn</button><button class="button" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button> <button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button></p><p><button name="switchSides"><i class="fa fa-random"></i> Switch sides</button></p>');
					} else {
						// playing
						this.$controls.html('<p><button class="button" name="pause"><i class="fa fa-pause"></i><br />Pause</button> <button class="button" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Last turn</button><button class="button" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button> <button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button></p><p><button name="switchSides"><i class="fa fa-random"></i> Switch sides</button></p>');
					}
				} else {
					// is a player
					this.$controls.html('<p>' + this.getTimerHTML() + '<button class="button" name="skipTurn"><i class="fa fa-step-forward"></i><br />Skip turn</button> <button class="button" name="goToEnd"><i class="fa fa-fast-forward"></i><br />Skip to end</button></p>');
				}
				return;

			}

			if (this.battle.ended) {

				var replayDownloadButton = '<span style="float:right;"><a href="//replay.pokemonshowdown.com/" class="button replayDownloadButton" style="padding:2px 6px"><i class="fa fa-download"></i> Download replay</a><br /><br /><button name="saveReplay"><i class="fa fa-upload"></i> Upload and share replay</button></span>';

				// battle has ended
				if (this.side) {
					// was a player
					this.closeNotification('choice');
					this.$controls.html('<div class="controls"><p>' + replayDownloadButton + '<button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />Instant replay</button></p><p><button class="button" name="closeAndMainMenu"><strong>Main menu</strong><br /><small>(closes this battle)</small></button> <button class="button" name="closeAndRematch"><strong>Rematch</strong><br /><small>(closes this battle)</small></button></p></div>');
				} else {
					this.$controls.html('<div class="controls"><p>' + replayDownloadButton + '<button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />Instant replay</button></p><p><button name="switchSides"><i class="fa fa-random"></i> Switch sides</button></p></div>');
				}

			} else if (this.side) {

				// player
				this.controlsShown = true;
				if (force || !controlsShown || this.choice === undefined || this.choice && this.choice.waiting) {
					// don't update controls (and, therefore, side) if `this.choice === null`: causes damage miscalculations
					this.updateControlsForPlayer();
				} else {
					this.updateTimer();
				}

			} else if (!this.battle.mySide.name || !this.battle.yourSide.name) {

				// empty battle
				this.$controls.html('<p><em>Waiting for players...</em></p>');

			} else {

				// full battle
				if (this.battle.paused) {
					// paused
					this.$controls.html('<p><button class="button" name="resume"><i class="fa fa-play"></i><br />Play</button> <button class="button" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Last turn</button><button class="button disabled" disabled><i class="fa fa-step-forward"></i><br />Skip turn</button> <button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button disabled" disabled><i class="fa fa-fast-forward"></i><br />Skip to end</button></p><p><button name="switchSides"><i class="fa fa-random"></i> Switch sides</button></p><p><em>Waiting for players...</em></p>');
				} else {
					// playing
					this.$controls.html('<p><button class="button" name="pause"><i class="fa fa-pause"></i><br />Pause</button> <button class="button" name="rewindTurn"><i class="fa fa-step-backward"></i><br />Last turn</button><button class="button disabled" disabled><i class="fa fa-step-forward"></i><br />Skip turn</button> <button class="button" name="instantReplay"><i class="fa fa-undo"></i><br />First turn</button><button class="button disabled" disabled><i class="fa fa-fast-forward"></i><br />Skip to end</button></p><p><button name="switchSides"><i class="fa fa-random"></i> Switch sides</button></p><p><em>Waiting for players...</em></p>');
				}

			}

			// This intentionally doesn't happen if the battle is still playing,
			// since those early-return.
			app.topbar.updateTabbar();
		},
		controlsShown: false,
		updateControlsForPlayer: function () {
			this.callbackWaiting = true;

			var act = '';
			var switchables = [];
			if (this.request) {
				// TODO: investigate when to do this
				this.updateSide(this.request.side);

				act = this.request.requestType;
				if (this.request.side) {
					switchables = this.myPokemon;
				}
				if (!this.finalDecision) this.finalDecision = !!this.request.noCancel;
			}

			if (this.choice && this.choice.waiting) {
				act = '';
			}

			var type = this.choice ? this.choice.type : '';

			// The choice object:
			// !this.choice = nothing has been chosen
			// this.choice.choices = array of choice strings
			// this.choice.switchFlags = dict of pokemon indexes that have a switch pending
			// this.choice.switchOutFlags = ???
			// this.choice.freedomDegrees = in a switch request: number of Pokemon that can't switch
			// this.choice.type = determines what the current choice screen to be displayed is
			// this.choice.waiting = true if the choice has been sent and we're just waiting for the next turn

			switch (act) {
			case 'move':
				if (!this.choice) {
					this.choice = {
						choices: [],
						switchFlags: {},
						switchOutFlags: {}
					};
				}
				this.updateMoveControls(type);
				break;

			case 'switch':
				if (!this.choice) {
					this.choice = {
						choices: [],
						switchFlags: {},
						switchOutFlags: {},
						freedomDegrees: 0,
						canSwitch: 0
					};

					if (this.request.forceSwitch !== true) {
						var faintedLength = _.filter(this.request.forceSwitch, function (fainted) {return fainted;}).length;
						var freedomDegrees = faintedLength - _.filter(switchables.slice(this.battle.mySide.active.length), function (mon) {return !mon.fainted;}).length;
						this.choice.freedomDegrees = Math.max(freedomDegrees, 0);
						this.choice.canSwitch = faintedLength - this.choice.freedomDegrees;
					}
				}
				this.updateSwitchControls(type);
				break;

			case 'team':
				if (this.battle.mySide.pokemon && !this.battle.mySide.pokemon.length) {
					// too early, we can't determine `this.choice.count` yet
					// TODO: send teamPreviewCount in the request object
					return;
				}
				if (!this.choice) {
					this.choice = {
						choices: null,
						teamPreview: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].slice(0, switchables.length),
						done: 0,
						count: 1
					};
					if (this.battle.gameType === 'doubles') {
						this.choice.count = 2;
					}
					if (this.battle.gameType === 'triples' || this.battle.gameType === 'rotation') {
						this.choice.count = 3;
					}
					// Request full team order if one of our Pokémon has Illusion
					for (var i = 0; i < switchables.length && i < 6; i++) {
						if (toId(switchables[i].baseAbility) === 'illusion') {
							this.choice.count = this.myPokemon.length;
						}
					}
					if (this.battle.teamPreviewCount) {
						var requestCount = parseInt(this.battle.teamPreviewCount, 10);
						if (requestCount > 0 && requestCount <= switchables.length) {
							this.choice.count = requestCount;
						}
					}
					this.choice.choices = new Array(this.choice.count);
				}
				this.updateTeamControls(type);
				break;

			default:
				this.updateWaitControls();
				break;
			}
		},
		timerInterval: 0,
		getTimerHTML: function (nextTick) {
			var time = 'Timer';
			var timerTicking = (this.battle.kickingInactive && this.request && !this.request.wait && !(this.choice && this.choice.waiting)) ? ' timerbutton-on' : '';

			if (!nextTick) {
				var self = this;
				if (this.timerInterval) {
					clearInterval(this.timerInterval);
					this.timerInterval = 0;
				}
				if (timerTicking) this.timerInterval = setInterval(function () {
					var $timerButton = self.$('.timerbutton');
					if ($timerButton.length) {
						$timerButton.replaceWith(self.getTimerHTML(true));
					} else {
						clearInterval(self.timerInterval);
						self.timerInterval = 0;
					}
				}, 1000);
			} else if (this.battle.kickingInactive > 1) {
				this.battle.kickingInactive--;
				if (this.battle.graceTimeLeft) this.battle.graceTimeLeft--;
				else if (this.battle.totalTimeLeft) this.battle.totalTimeLeft--;
			}

			if (this.battle.kickingInactive) {
				var secondsLeft = this.battle.kickingInactive;
				if (secondsLeft !== true) {
					if (secondsLeft <= 10 && timerTicking) {
						timerTicking = ' timerbutton-critical';
					}
					var minutesLeft = Math.floor(secondsLeft / 60);
					secondsLeft -= minutesLeft * 60;
					time = '' + minutesLeft + ':' + (secondsLeft < 10 ? '0' : '') + secondsLeft;

					secondsLeft = this.battle.totalTimeLeft;
					if (secondsLeft) {
						minutesLeft = Math.floor(secondsLeft / 60);
						secondsLeft -= minutesLeft * 60;
						time += ' | ' + minutesLeft + ':' + (secondsLeft < 10 ? '0' : '') + secondsLeft + ' total';
					}
				} else {
					time = '-:--';
				}
			}
			return '<button name="openTimer" class="button timerbutton' + timerTicking + '"><i class="fa fa-hourglass-start"></i> ' + time + '</button>';
		},
		updateZMove: function () {
			var zChecked = this.$('input[name=zmove]')[0].checked;
			if (zChecked) {
				this.$('.movebuttons-noz').hide();
				this.$('.movebuttons-z').show();
			} else {
				this.$('.movebuttons-noz').show();
				this.$('.movebuttons-z').hide();
			}
		},
		updateTimer: function () {
			this.$('.timerbutton').replaceWith(this.getTimerHTML());
		},
		openTimer: function () {
			app.addPopup(TimerPopup, {room: this});
		},
		updateMoveControls: function (type) {
			var switchables = this.request && this.request.side ? this.myPokemon : [];

			if (type !== 'movetarget') {
				while (switchables[this.choice.choices.length] && switchables[this.choice.choices.length].fainted && this.choice.choices.length + 1 < this.battle.mySide.active.length) {
					this.choice.choices.push('pass');
				}
			}

			var moveTarget = this.choice ? this.choice.moveTarget : '';
			var pos = this.choice.choices.length - (type === 'movetarget' ? 1 : 0);

			var hpRatio = switchables[pos].hp / switchables[pos].maxhp;

			var curActive = this.request && this.request.active && this.request.active[pos];
			if (!curActive) return;
			var trapped = curActive.trapped;
			var canMegaEvo = curActive.canMegaEvo || switchables[pos].canMegaEvo;
			var canZMove = curActive.canZMove || switchables[pos].canZMove;
			var canUltraBurst = curActive.canUltraBurst || switchables[pos].canUltraBurst;
			if (canZMove && typeof canZMove[0] === 'string') {
				canZMove = _.map(canZMove, function (move) {
					return {move: move, target: Dex.getMove(move).target};
				});
			}

			this.finalDecisionMove = curActive.maybeDisabled || false;
			this.finalDecisionSwitch = curActive.maybeTrapped || false;
			for (var i = pos + 1; i < this.battle.mySide.active.length; ++i) {
				var p = this.battle.mySide.active[i];
				if (p && !p.fainted) {
					this.finalDecisionMove = this.finalDecisionSwitch = false;
					break;
				}
			}

			var requestTitle = '';
			if (type === 'move2' || type === 'movetarget') {
				requestTitle += '<button name="clearChoice">Back</button> ';
			}

			// Target selector
			if (type === 'movetarget') {
				requestTitle += 'At who? ';

				var targetMenus = ['', ''];
				var myActive = this.battle.mySide.active;
				var yourActive = this.battle.yourSide.active;
				var yourSlot = yourActive.length - 1 - pos;

				for (var i = yourActive.length - 1; i >= 0; i--) {
					var pokemon = yourActive[i];

					var disabled = false;
					if (moveTarget === 'adjacentAlly' || moveTarget === 'adjacentAllyOrSelf') {
						disabled = true;
					} else if (moveTarget === 'normal' || moveTarget === 'adjacentFoe') {
						if (Math.abs(yourSlot - i) > 1) disabled = true;
					}

					if (disabled) {
						targetMenus[0] += '<button disabled="disabled"></button> ';
					} else if (!pokemon || pokemon.fainted) {
						targetMenus[0] += '<button name="chooseMoveTarget" value="' + (i + 1) + '"><span class="picon" style="' + Dex.getPokemonIcon('missingno') + '"></span></button> ';
					} else {
						targetMenus[0] += '<button name="chooseMoveTarget" value="' + (i + 1) + '"' + this.tooltips.tooltipAttrs("your" + i, 'pokemon', true) + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + (this.battle.ignoreOpponent || this.battle.ignoreNicks ? pokemon.species : BattleLog.escapeHTML(pokemon.name)) + '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> ';
					}
				}
				for (var i = 0; i < myActive.length; i++) {
					var pokemon = myActive[i];

					var disabled = false;
					if (moveTarget === 'adjacentFoe') {
						disabled = true;
					} else if (moveTarget === 'normal' || moveTarget === 'adjacentAlly' || moveTarget === 'adjacentAllyOrSelf') {
						if (Math.abs(pos - i) > 1) disabled = true;
					}
					if (moveTarget !== 'adjacentAllyOrSelf' && pos == i) disabled = true;

					if (disabled) {
						targetMenus[1] += '<button disabled="disabled" style="visibility:hidden"></button> ';
					} else if (!pokemon || pokemon.fainted) {
						targetMenus[1] += '<button name="chooseMoveTarget" value="' + (-(i + 1)) + '"><span class="picon" style="' + Dex.getPokemonIcon('missingno') + '"></span></button> ';
					} else {
						targetMenus[1] += '<button name="chooseMoveTarget" value="' + (-(i + 1)) + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> ';
					}
				}

				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + requestTitle + this.getTimerHTML() + '</div>' +
					'<div class="switchmenu" style="display:block">' + targetMenus[0] + '<div style="clear:both"></div> </div>' +
					'<div class="switchmenu" style="display:block">' + targetMenus[1] + '</div>' +
					'</div>'
				);
			} else {
				// Move chooser
				var hpBar = '<small class="' + (hpRatio < 0.2 ? 'critical' : hpRatio < 0.5 ? 'weak' : 'healthy') + '">HP ' + switchables[pos].hp + '/' + switchables[pos].maxhp + '</small>';
				requestTitle += ' What will <strong>' + BattleLog.escapeHTML(switchables[pos].name) + '</strong> do? ' + hpBar;

				var hasMoves = false;
				var moveMenu = '';
				var movebuttons = '';
				for (var i = 0; i < curActive.moves.length; i++) {
					var moveData = curActive.moves[i];
					var move = Dex.getMove(moveData.move);
					var name = move.name;
					var pp = moveData.pp + '/' + moveData.maxpp;
					if (!moveData.maxpp) pp = '&ndash;';
					if (move.id === 'Struggle' || move.id === 'Recharge') pp = '&ndash;';
					if (move.id === 'Recharge') move.type = '&ndash;';
					if (name.substr(0, 12) === 'Hidden Power') name = 'Hidden Power';
					var moveType = this.tooltips.getMoveType(move, this.battle.mySide.active[pos] || this.myPokemon[pos]);
					if (moveData.disabled) {
						movebuttons += '<button disabled="disabled"' + this.tooltips.tooltipAttrs(moveData.move, 'move') + '>';
					} else {
						movebuttons += '<button class="type-' + moveType + '" name="chooseMove" value="' + (i + 1) + '" data-move="' + BattleLog.escapeHTML(moveData.move) + '" data-target="' + BattleLog.escapeHTML(moveData.target) + '"' + this.tooltips.tooltipAttrs(moveData.move, 'move') + '>';
						hasMoves = true;
					}
					movebuttons += name + '<br /><small class="type">' + (moveType ? Dex.getType(moveType).name : "Unknown") + '</small> <small class="pp">' + pp + '</small>&nbsp;</button> ';
				}
				if (!hasMoves) {
					moveMenu += '<button class="movebutton" name="chooseMove" value="0" data-move="Struggle" data-target="randomNormal">Struggle<br /><small class="type">Normal</small> <small class="pp">&ndash;</small>&nbsp;</button> ';
				} else {
					if (canZMove) {
						movebuttons = '<div class="movebuttons-noz">' + movebuttons + '</div><div class="movebuttons-z" style="display:none">';
						for (var i = 0; i < curActive.moves.length; i++) {
							var moveData = curActive.moves[i];
							var move = Dex.getMove(moveData.move);
							var moveType = this.tooltips.getMoveType(move, this.battle.mySide.active[pos] || this.myPokemon[pos]);
							if (canZMove[i]) {
								movebuttons += '<button class="type-' + moveType + '" name="chooseMove" value="' + (i + 1) + '" data-move="' + BattleLog.escapeHTML(canZMove[i].move) + '" data-target="' + BattleLog.escapeHTML(canZMove[i].target) + '"' + this.tooltips.tooltipAttrs(moveData.move, 'zmove') + '>';
								movebuttons += canZMove[i].move + '<br /><small class="type">' + (moveType ? Dex.getType(moveType).name : "Unknown") + '</small> <small class="pp">1/1</small>&nbsp;</button> ';
							} else {
								movebuttons += '<button disabled="disabled">&nbsp;</button>';
							}
						}
						movebuttons += '</div>';
					}
					moveMenu += movebuttons;
				}
				if (canMegaEvo) {
					moveMenu += '<br /><label class="megaevo"><input type="checkbox" name="megaevo" />&nbsp;Mega&nbsp;Evolution</label>';
				} else if (canZMove) {
					moveMenu += '<br /><label class="megaevo"><input type="checkbox" name="zmove" />&nbsp;Z-Power</label>';
				} else if (canUltraBurst) {
					moveMenu += '<br /><label class="megaevo"><input type="checkbox" name="ultraburst" />&nbsp;Ultra Burst</label>';
				}
				if (this.finalDecisionMove) {
					moveMenu += '<em style="display:block;clear:both">You <strong>might</strong> have some moves disabled, so you won\'t be able to cancel an attack!</em><br/>';
				}
				moveMenu += '<div style="clear:left"></div>';

				var moveControls = (
					'<div class="movecontrols">' +
					'<div class="moveselect"><button name="selectMove">Attack</button></div>' +
					'<div class="movemenu">' + moveMenu + '</div>' +
					'</div>'
				);

				var shiftControls = '';
				if (this.battle.gameType === 'triples' && pos !== 1) {
					shiftControls += '<div class="shiftselect"><button name="chooseShift">Shift</button></div>';
				}

				var switchMenu = '';
				if (trapped) {
					switchMenu += '<em>You are trapped and cannot switch!</em>';
				} else {
					for (var i = 0; i < switchables.length; i++) {
						var pokemon = switchables[i];
						pokemon.name = pokemon.ident.substr(4);
						if (pokemon.fainted || i < this.battle.mySide.active.length || this.choice.switchFlags[i]) {
							switchMenu += '<button class="disabled" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + (pokemon.fainted ? ',fainted' : i < this.battle.mySide.active.length ? ',active' : '') + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (pokemon.hp ? '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> ';
						} else {
							switchMenu += '<button name="chooseSwitch" value="' + i + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> ';
						}
					}
					if (this.finalDecisionSwitch && this.battle.gen > 2) {
						switchMenu += '<em style="display:block;clear:both">You <strong>might</strong> be trapped, so you won\'t be able to cancel a switch!</em><br/>';
					}
				}
				var switchControls = (
					'<div class="switchcontrols">' +
					'<div class="switchselect"><button name="selectSwitch">Switch</button></div>' +
					'<div class="switchmenu">' + switchMenu + '</div>' +
					'</div>'
				);

				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + requestTitle + this.getTimerHTML() + '</div>' +
					moveControls + shiftControls + switchControls +
					'</div>'
				);
			}
		},
		updateSwitchControls: function (type) {
			var pos = this.choice.choices.length;

			if (type !== 'switchposition' && this.request.forceSwitch !== true && !this.choice.freedomDegrees) {
				while (!this.request.forceSwitch[pos] && pos < 6) {
					pos = this.choice.choices.push('pass');
				}
			}

			var switchables = this.request && this.request.side ? this.myPokemon : [];
			var myActive = this.battle.mySide.active;

			var requestTitle = '';
			if (type === 'switch2' || type === 'switchposition') {
				requestTitle += '<button name="clearChoice">Back</button> ';
			}

			// Place selector
			if (type === 'switchposition') {
				// TODO? hpbar
				requestTitle += "Which Pokémon will it switch in for?";
				var controls = '<div class="switchmenu" style="display:block">';
				for (var i = 0; i < myActive.length; i++) {
					var pokemon = this.myPokemon[i];
					if (pokemon && !pokemon.fainted || this.choice.switchOutFlags[i]) {
						controls += '<button disabled' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (!pokemon.fainted ? '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> ';
					} else if (!pokemon) {
						controls += '<button disabled></button> ';
					} else {
						controls += '<button name="chooseSwitchTarget" value="' + i + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') + '</button> ';
					}
				}
				controls += '</div>';
				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + requestTitle + this.getTimerHTML() + '</div>' +
					controls +
					'</div>'
				);
			} else {
				if (this.choice.freedomDegrees >= 1) {
					requestTitle += "Choose a Pokémon to send to battle!";
				} else {
					requestTitle += "Switch <strong>" + BattleLog.escapeHTML(switchables[pos].name) + "</strong> to:";
				}

				var switchMenu = '';
				for (var i = 0; i < switchables.length; i++) {
					var pokemon = switchables[i];
					if (pokemon.fainted || i < this.battle.mySide.active.length || this.choice.switchFlags[i]) {
						switchMenu += '<button class="disabled" name="chooseDisabled" value="' + BattleLog.escapeHTML(pokemon.name) + (pokemon.fainted ? ',fainted' : i < this.battle.mySide.active.length ? ',active' : '') + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '>';
					} else {
						switchMenu += '<button name="chooseSwitch" value="' + i + '"' + this.tooltips.tooltipAttrs(i, 'sidepokemon') + '>';
					}
					switchMenu += '<span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + (!pokemon.fainted ? '<span class="hpbar' + pokemon.getHPColorClass() + '"><span style="width:' + (Math.round(pokemon.hp * 92 / pokemon.maxhp) || 1) + 'px"></span></span>' + (pokemon.status ? '<span class="status ' + pokemon.status + '"></span>' : '') : '') + '</button> ';
				}

				var controls = (
					'<div class="switchcontrols">' +
					'<div class="switchselect"><button name="selectSwitch">Switch</button></div>' +
					'<div class="switchmenu">' + switchMenu + '</div>' +
					'</div>'
				);
				this.$controls.html(
					'<div class="controls">' +
					'<div class="whatdo">' + requestTitle + this.getTimerHTML() + '</div>' +
					controls +
					'</div>'
				);
				this.selectSwitch();
			}
		},
		updateTeamControls: function (type) {
			var switchables = this.request && this.request.side ? this.myPokemon : [];
			var maxIndex = Math.min(switchables.length, 24);

			var requestTitle = "";
			if (this.choice.done) {
				requestTitle = '<button name="clearChoice">Back</button> ' + "What about the rest of your team?";
			} else {
				requestTitle = "How will you start the battle?";
			}

			var switchMenu = '';
			for (var i = 0; i < maxIndex; i++) {
				var oIndex = this.choice.teamPreview[i] - 1;
				var pokemon = switchables[oIndex];
				if (i < this.choice.done) {
					switchMenu += '<button disabled="disabled"' + this.tooltips.tooltipAttrs(oIndex, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '</button> ';
				} else {
					switchMenu += '<button name="chooseTeamPreview" value="' + i + '"' + this.tooltips.tooltipAttrs(oIndex, 'sidepokemon') + '><span class="picon" style="' + Dex.getPokemonIcon(pokemon) + '"></span>' + BattleLog.escapeHTML(pokemon.name) + '</button> ';
				}
			}

			var controls = (
				'<div class="switchcontrols">' +
				'<div class="switchselect"><button name="selectSwitch">' + (this.choice.done ? '' + "Choose a Pokémon for slot " + (this.choice.done + 1) : "Choose Lead") + '</button></div>' +
				'<div class="switchmenu">' + switchMenu + '</div>' +
				'</div>'
			);
			this.$controls.html(
				'<div class="controls">' +
				'<div class="whatdo">' + requestTitle + this.getTimerHTML() + '</div>' +
				controls +
				'</div>'
			);
			this.selectSwitch();
		},
		updateWaitControls: function () {
			var buf = '<div class="controls">';
			buf += this.getPlayerChoicesHTML();
			if (!this.battle.mySide.name || !this.battle.yourSide.name || !this.request) {
				if (this.battle.kickingInactive) {
					buf += '<p><button class="button" name="setTimer" value="off">Stop timer</button> <small>&larr; Your opponent has disconnected. This will give them more time to reconnect.</small></p>';
				} else {
					buf += '<p><button class="button" name="setTimer" value="on">Claim victory</button> <small>&larr; Your opponent has disconnected. Click this if they don\'t reconnect.</small></p>';
				}
			}
			this.$controls.html(buf + '</div>');
		},

		getPlayerChoicesHTML: function () {
			var buf = '<p>' + this.getTimerHTML();
			if (!this.choice || !this.choice.waiting) {
				return buf + '<em>Waiting for opponent...</em></p>';
			}
			buf += '<small>';

			if (this.choice.teamPreview) {
				var myPokemon = this.battle.mySide.pokemon;
				var leads = [];
				for (var i = 0; i < this.choice.count; i++) {
					leads.push(myPokemon[this.choice.teamPreview[i] - 1].species);
				}
				buf += leads.join(', ') + ' will be sent out first.<br />';
			} else if (this.choice.choices) {
				var myActive = this.battle.mySide.active;
				for (var i = 0; i < this.choice.choices.length; i++) {
					var parts = this.choice.choices[i].split(' ');
					switch (parts[0]) {
					case 'move':
						var move = this.request.active[i].moves[parts[1] - 1].move;
						var target = '';
						buf += myActive[i].species + ' will ';
						if (parts.length > 2) {
							var targetPos = parts[2];
							if (targetPos === 'mega') {
								buf += 'mega evolve, then ';
								targetPos = parts[3];
							}
							if (targetPos === 'zmove') {
								move = this.request.active[i].canZMove[parts[1] - 1].move;
								targetPos = parts[3];
							}
							if (targetPos) {
								var targetActive = this.battle.yourSide.active;
								// Targeting your own side in doubles / triples
								if (targetPos < 0) {
									targetActive = myActive;
									targetPos = -targetPos;
									target += 'your ';
								}
								if (targetActive[targetPos - 1]) {
									target += targetActive[targetPos - 1].species;
								} else {
									target = ''; // targeting an empty slot
								}
							}
						}
						buf += 'use ' + Dex.getMove(move).name + (target ? ' against ' + target : '') + '.<br />';
						break;
					case 'switch':
						buf += '' + this.myPokemon[parts[1] - 1].species + ' will switch in';
						if (myActive[i]) {
							buf += ', replacing ' + myActive[i].species;
						}
						buf += '.<br />';
						break;
					case 'shift':
						buf += myActive[i].species + ' will shift position.<br />';
						break;
					}
				}
			}
			buf += '</small></p>';
			if (!this.finalDecision && !this.battle.hardcoreMode) {
				buf += '<p><small><em>Waiting for opponent...</em></small> <button class="button" name="undoChoice">Cancel</button></p>';
			}
			return buf;
		},

		/**
		 * Sends a decision; pass it an array of choices like ['move 1', 'switch 2']
		 * and it'll send `/choose move 1,switch 2|3`
		 * (where 3 is the rqid).
		 *
		 * (The rqid helps verify that the decision is sent in response to the
		 * correct request.)
		 */
		sendDecision: function (message) {
			if (!$.isArray(message)) return this.send('/' + message + '|' + this.request.rqid);
			var buf = '/choose ';
			for (var i = 0; i < message.length; i++) {
				if (message[i]) buf += message[i] + ',';
			}
			this.send(buf.substr(0, buf.length - 1) + '|' + this.request.rqid);
		},
		request: null,
		receiveRequest: function (request, choiceText) {
			if (!request) {
				this.side = '';
				return;
			}
			request.requestType = 'move';
			if (request.forceSwitch) {
				request.requestType = 'switch';
			} else if (request.teamPreview) {
				request.requestType = 'team';
			} else if (request.wait) {
				request.requestType = 'wait';
			}

			var choice = null;
			if (choiceText) {
				choice = {waiting: true};
			}
			this.choice = choice;
			this.finalDecision = this.finalDecisionMove = this.finalDecisionSwitch = false;
			this.request = request;
			if (request.side) {
				this.updateSideLocation(request.side);
			}
			this.notifyRequest();
			this.updateControls(true);
		},
		notifyRequest: function () {
			var oName = this.battle.yourSide.name;
			if (oName) oName = " against " + oName;
			switch (this.request.requestType) {
			case 'move':
				this.notify("Your move!", "Move in your battle" + oName, 'choice');
				break;
			case 'switch':
				this.notify("Your switch!", "Switch in your battle" + oName, 'choice');
				break;
			case 'team':
				this.notify("Team preview!", "Choose your team order in your battle" + oName, 'choice');
				break;
			}
		},
		updateSideLocation: function (sideData) {
			if (!sideData.id) return;
			this.side = sideData.id;
			if (this.battle.sidesSwitched !== !!(this.side === 'p2')) {
				this.battle.switchSides();
				this.$chat = this.$chatFrame.find('.inner');
			}
		},
		updateSide: function (sideData) {
			this.myPokemon = sideData.pokemon;
			for (var i = 0; i < sideData.pokemon.length; i++) {
				var pokemonData = sideData.pokemon[i];
				this.battle.parseDetails(pokemonData.ident.substr(4), pokemonData.ident, pokemonData.details, pokemonData);
				this.battle.parseHealth(pokemonData.condition, pokemonData);
				pokemonData.hpDisplay = Pokemon.prototype.hpDisplay;
				pokemonData.getPixelRange = Pokemon.prototype.getPixelRange;
				pokemonData.getFormattedRange = Pokemon.prototype.getFormattedRange;
				pokemonData.getHPColorClass = Pokemon.prototype.getHPColorClass;
				pokemonData.getHPColor = Pokemon.prototype.getHPColor;
			}
		},

		// buttons
		joinBattle: function () {
			this.send('/joinbattle');
		},
		setTimer: function (setting) {
			this.send('/timer ' + setting);
		},
		forfeit: function () {
			this.send('/forfeit');
		},
		saveReplay: function () {
			this.send('/savereplay');
		},
		openBattleOptions: function () {
			app.addPopup(BattleOptionsPopup, {battle: this.battle, room: this});
		},
		clickReplayDownloadButton: function (e) {
			var filename = (this.battle.tier || 'Battle').replace(/[^A-Za-z0-9]/g, '');

			// ladies and gentlemen, JavaScript dates
			var date = new Date();
			filename += '-' + date.getFullYear();
			filename += (date.getMonth() >= 9 ? '-' : '-0') + (date.getMonth() + 1);
			filename += (date.getDate() >= 10 ? '-' : '-0') + date.getDate();

			filename += '-' + toId(this.battle.p1.name);
			filename += '-' + toId(this.battle.p2.name);

			e.currentTarget.href = BattleLog.createReplayFileHref(this);
			e.currentTarget.download = filename + '.html';

			e.stopPropagation();
		},
		switchSides: function () {
			this.battle.switchSides();
		},
		pause: function () {
			this.tooltips.hideTooltip();
			this.battlePaused = true;
			this.battle.pause();
			this.updateControls();
		},
		resume: function () {
			this.tooltips.hideTooltip();
			this.battlePaused = false;
			this.battle.play();
			this.updateControls();
		},
		instantReplay: function () {
			this.tooltips.hideTooltip();
			this.request = null;
			this.battlePaused = false;
			this.battle.reset();
			this.battle.play();
		},
		skipTurn: function () {
			this.battle.skipTurn();
		},
		rewindTurn: function () {
			if (this.battle.turn) {
				this.battle.fastForwardTo(this.battle.turn - 1);
			}
		},
		goToEnd: function () {
			this.battle.fastForwardTo(-1);
		},
		register: function (userid) {
			var registered = app.user.get('registered');
			if (registered && registered.userid !== userid) registered = false;
			if (!registered && userid === app.user.get('userid')) {
				app.addPopup(RegisterPopup);
			}
		},
		closeAndMainMenu: function () {
			this.close();
			app.focusRoom('');
		},
		closeAndRematch: function () {
			app.rooms[''].requestNotifications();
			app.rooms[''].challenge(this.battle.yourSide.name, this.battle.tier);
			this.close();
			app.focusRoom('');
		},

		// choice buttons
		chooseMove: function (pos, e) {
			if (!this.choice) return;
			this.tooltips.hideTooltip();

			if (pos !== undefined) { // pos === undefined if called by chooseMoveTarget()
				var myActive = this.battle.mySide.active;
				var isMega = !!(this.$('input[name=megaevo]')[0] || '').checked;
				var isZMove = !!(this.$('input[name=zmove]')[0] || '').checked;
				var isUltraBurst = !!(this.$('input[name=ultraburst]')[0] || '').checked;

				var target = e.getAttribute('data-target');
				var choosableTargets = {normal: 1, any: 1, adjacentAlly: 1, adjacentAllyOrSelf: 1, adjacentFoe: 1};

				this.choice.choices.push('move ' + pos + (isMega ? ' mega' : '') + (isZMove ? ' zmove' : '') + (isUltraBurst ? ' ultra' : ''));
				if (myActive.length > 1 && target in choosableTargets) {
					this.choice.type = 'movetarget';
					this.choice.moveTarget = target;
					this.updateControlsForPlayer();
					return false;
				}
			}

			this.endChoice();
		},
		chooseMoveTarget: function (posString) {
			this.choice.choices[this.choice.choices.length - 1] += ' ' + posString;
			this.chooseMove();
		},
		chooseShift: function () {
			if (!this.choice) return;
			this.tooltips.hideTooltip();

			this.choice.choices.push('shift');
			this.endChoice();
		},
		chooseSwitch: function (pos) {
			if (!this.choice) return;
			this.tooltips.hideTooltip();

			if (pos !== undefined) { // pos === undefined if called by chooseSwitchTarget()
				this.choice.switchFlags[pos] = true;
				if (this.choice.freedomDegrees >= 1) {
					// Request selection of a Pokémon that will be switched out.
					this.choice.type = 'switchposition';
					this.updateControlsForPlayer();
					return false;
				}
				// Default: left to right.
				this.choice.switchOutFlags[this.choice.choices.length] = true;
				this.choice.choices.push('switch ' + (parseInt(pos, 10) + 1));
				this.endChoice();
				return;
			}

			// After choosing the position to which a pokemon will switch in (Doubles/Triples end-game).
			if (!this.request || this.request.requestType !== 'switch') return false; //??
			if (this.choice.canSwitch > _.filter(this.choice.choices, function (choice) {return choice;}).length) {
				// More switches are pending.
				this.choice.type = 'switch2';
				this.updateControlsForPlayer();
				return false;
			}

			this.endTurn();
		},
		chooseSwitchTarget: function (posString) {
			var slotSwitchIn = 0; // one-based
			for (var i in this.choice.switchFlags) {
				if (this.choice.choices.indexOf('switch ' + (+i + 1)) === -1) {
					slotSwitchIn = +i + 1;
					break;
				}
			}
			this.choice.choices[posString] = 'switch ' + slotSwitchIn;
			this.choice.switchOutFlags[posString] = true;
			this.chooseSwitch();
		},
		chooseTeamPreview: function (pos) {
			if (!this.choice) return;
			pos = parseInt(pos, 10);
			this.tooltips.hideTooltip();
			if (this.choice.count) {
				var temp = this.choice.teamPreview[pos];
				this.choice.teamPreview[pos] = this.choice.teamPreview[this.choice.done];
				this.choice.teamPreview[this.choice.done] = temp;

				this.choice.done++;

				if (this.choice.done < Math.min(this.choice.teamPreview.length, this.choice.count)) {
					this.choice.type = 'team2';
					this.updateControlsForPlayer();
					return false;
				}
			} else {
				this.choice.teamPreview = [pos + 1];
			}

			this.endTurn();
		},
		chooseDisabled: function (data) {
			this.tooltips.hideTooltip();
			data = data.split(',');
			if (data[1] === 'fainted') {
				app.addPopupMessage("" + data[0] + " has no energy left to battle!");
			} else if (data[1] === 'active') {
				app.addPopupMessage("" + data[0] + " is already in battle!");
			} else {
				app.addPopupMessage("" + data[0] + " is already selected!");
			}
		},
		endChoice: function () {
			var choiceIndex = this.choice.choices.length - 1;
			if (!this.nextChoice()) {
				this.endTurn();
			} else if (this.request.partial) {
				for (var i = choiceIndex; i < this.choice.choices.length; i++) {
					this.sendDecision(this.choice.choices[i]);
				}
			}
		},
		nextChoice: function () {
			var choices = this.choice.choices;
			var myActive = this.battle.mySide.active;

			if (this.request.requestType === 'switch' && this.request.forceSwitch !== true) {
				while (choices.length < myActive.length && !this.request.forceSwitch[choices.length]) {
					choices.push('pass');
				}
				if (choices.length < myActive.length) {
					this.choice.type = 'switch2';
					this.updateControlsForPlayer();
					return true;
				}
			} else if (this.request.requestType === 'move') {
				while (choices.length < myActive.length && !myActive[choices.length]) {
					choices.push('pass');
				}

				if (choices.length < myActive.length) {
					this.choice.type = 'move2';
					this.updateControlsForPlayer();
					return true;
				}
			}

			return false;
		},
		endTurn: function () {
			var act = this.request && this.request.requestType;
			if (act === 'team') {
				if (this.choice.teamPreview.length >= 10) {
					this.sendDecision('team ' + this.choice.teamPreview.join(','));
				} else {
					this.sendDecision('team ' + this.choice.teamPreview.join(''));
				}
			} else {
				if (act === 'switch') {
					// Assert that the remaining Pokémon won't switch, even though
					// the player could have decided otherwise.
					for (var i = 0; i < this.battle.mySide.active.length; i++) {
						if (!this.choice.choices[i]) this.choice.choices[i] = 'pass';
					}
				}

				if (this.choice.choices.length >= (this.choice.count || this.battle.mySide.active.length)) {
					this.sendDecision(this.choice.choices);
				}

				if (!this.finalDecision) {
					var lastChoice = this.choice.choices[this.choice.choices.length - 1];
					if (lastChoice.substr(0, 5) === 'move ' && this.finalDecisionMove) {
						this.finalDecisionMove = true;
					} else if (lastChoice.substr(0, 7) === 'switch' && this.finalDecisionSwitch) {
						this.finalDecisionSwitch = true;
					}
				}
			}
			this.closeNotification('choice');

			this.choice.waiting = true;
			this.updateControlsForPlayer();
		},
		undoChoice: function (pos) {
			this.send('/undo');
			this.notifyRequest();

			this.clearChoice();
		},
		clearChoice: function () {
			this.choice = null;
			this.updateControlsForPlayer();
		},
		leaveBattle: function () {
			this.tooltips.hideTooltip();
			this.send('/leavebattle');
			this.side = '';
			this.closeNotification('choice');
		},
		selectSwitch: function () {
			this.tooltips.hideTooltip();
			this.$controls.find('.controls').attr('class', 'controls switch-controls');
		},
		selectMove: function () {
			this.tooltips.hideTooltip();
			this.$controls.find('.controls').attr('class', 'controls move-controls');
		}
	}, {
		readReplayFile: function (file) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var html = e.target.result;
				var titleStart = html.indexOf('<title>');
				var titleEnd = html.indexOf('</title>');
				var title = 'Uploaded Replay';
				if (titleStart >= 0 && titleEnd > titleStart) {
					title = html.slice(titleStart + 7, titleEnd - 1);
					var colonIndex = title.indexOf(':');
					var hyphenIndex = title.lastIndexOf('-');
					if (hyphenIndex > colonIndex + 2) {
						title = title.substring(colonIndex + 2, hyphenIndex - 1);
					} else {
						title = title.substring(colonIndex + 2);
					}
				}
				var index1 = html.indexOf('<script type="text/plain" class="battle-log-data">');
				var index2 = html.indexOf('<script type="text/plain" class="log">');
				if (index1 < 0 && index2 < 0) return alert("Unrecognized HTML file: Only replay files are supported.");
				if (index1 >= 0) {
					html = html.slice(index1 + 50);
				} else if (index2 >= 0) {
					html = html.slice(index2 + 38);
				}
				var index3 = html.indexOf('</script>');
				html = html.slice(0, index3);
				html = html.replace(/\\\//g, '/');
				app.receive('>battle-uploadedreplay\n|init|battle\n|title|' + title + '\n' + html);
				app.receive('>battle-uploadedreplay\n|expire|Uploaded replay');
			};
			reader.readAsText(file);
		}
	});

	var ForfeitPopup = this.ForfeitPopup = Popup.extend({
		type: 'semimodal',
		initialize: function (data) {
			this.room = data.room;
			this.gameType = data.gameType;
			var buf = '<form><p>';
			if (this.gameType === 'battle') {
				buf += 'Forfeiting makes you lose the battle.';
			} else if (this.gameType === 'help') {
				buf += 'Leaving the room will close the ticket.';
			} else {
				// game
				buf += 'Forfeiting makes you lose the game.';
			}
			if (this.gameType === 'help') {
				buf += ' Are you sure?</p><p><label><input type="checkbox" name="closeroom" checked /> Close room</label></p>';
				buf += '<p><button type="submit"><strong>Close ticket</strong></button> ';
			} else {
				buf += ' Are you sure?</p><p><label><input type="checkbox" name="closeroom" checked /> Close after forfeiting</label></p>';
				buf += '<p><button type="submit"><strong>Forfeit</strong></button> ';
			}
			if (this.gameType === 'battle' && this.room.battle && !this.room.battle.rated) {
				buf += '<button name="replacePlayer">Replace player</button> ';
			}
			buf += '<button name="close" class="autofocus">Cancel</button></p></form>';
			this.$el.html(buf);
		},
		replacePlayer: function (data) {
			var room = this.room;
			var self = this;
			app.addPopupPrompt("Replacement player's username", "Replace player", function (target) {
				if (!target) return;
				var side = (room.battle.mySide.id === room.battle.p1.id ? 'p1' : 'p2');
				room.leaveBattle();
				room.send('/addplayer ' + target + ', ' + side);
				self.close();
			});
		},
		submit: function (data) {
			this.room.send('/forfeit');
			if (this.gameType === 'battle') this.room.battle.forfeitPending = true;
			if (this.$('input[name=closeroom]')[0].checked) {
				app.removeRoom(this.room.id);
			}
			this.close();
		}
	});

	var BattleOptionsPopup = this.BattleOptionsPopup = Popup.extend({
		initialize: function (data) {
			this.battle = data.battle;
			this.room = data.room;
			var rightPanelBattlesPossible = (MainMenuRoom.prototype.bestWidth + BattleRoom.prototype.minWidth < $(window).width());
			var buf = '<p><strong>In this battle</strong></p>';
			buf += '<p><label class="optlabel"><input type="checkbox" name="hardcoremode"' + (this.battle.hardcoreMode ? ' checked' : '') + '/> Hardcore mode (hide info not shown in-game) (beta)</label></p>';
			buf += '<p><label class="optlabel"><input type="checkbox" name="ignorespects"' + (this.battle.ignoreSpects ? ' checked' : '') + '/> Ignore Spectators</label></p>';
			buf += '<p><label class="optlabel"><input type="checkbox" name="ignoreopp"' + (this.battle.ignoreOpponent ? ' checked' : '') + '/> Ignore Opponent</label></p>';
			buf += '<p><strong>All battles</strong></p>';
			buf += '<p><label class="optlabel"><input type="checkbox" name="ignorenicks"' + (Dex.prefs('ignorenicks') ? ' checked' : '') + ' /> Ignore nicknames</label></p>';
			if (rightPanelBattlesPossible) buf += '<p><label class="optlabel"><input type="checkbox" name="rightpanelbattles"' + (Dex.prefs('rightpanelbattles') ? ' checked' : '') + ' /> Open new battles on the right side</label></p>';
			buf += '<p><button name="close">Close</button></p>';
			this.$el.html(buf);
		},
		events: {
			'change input[name=ignorespects]': 'toggleIgnoreSpects',
			'change input[name=ignorenicks]': 'toggleIgnoreNicks',
			'change input[name=ignoreopp]': 'toggleIgnoreOpponent',
			'change input[name=hardcoremode]': 'toggleHardcoreMode',
			'change input[name=rightpanelbattles]': 'toggleRightPanelBattles'
		},
		toggleHardcoreMode: function (e) {
			this.room.setHardcoreMode(!!e.currentTarget.checked);
			if (this.battle.hardcoreMode) {
				this.battle.add('Hardcore mode ON: Information not available in-game is now hidden.');
			} else {
				this.battle.add('Hardcore mode OFF: Information not available in-game is now shown.');
			}
		},
		toggleIgnoreSpects: function (e) {
			this.battle.ignoreSpects = !!e.currentTarget.checked;
			this.battle.add('Spectators ' + (this.battle.ignoreSpects ? '' : 'no longer ') + 'ignored.');
			var $messages = $('.battle-log').find('.chat').has('small').not(':contains(\u2605), :contains(\u2606)');
			if (!$messages.length) return;
			if (this.battle.ignoreSpects) {
				$messages.hide();
			} else {
				$messages.show();
			}
		},
		toggleIgnoreNicks: function (e) {
			this.battle.ignoreNicks = !!e.currentTarget.checked;
			Dex.prefs('ignorenicks', this.battle.ignoreNicks);
			this.battle.add('Nicknames ' + (this.battle.ignoreNicks ? '' : 'no longer ') + 'ignored.');
			this.battle.resetToCurrentTurn();
		},
		toggleIgnoreOpponent: function (e) {
			this.battle.ignoreOpponent = !!e.currentTarget.checked;
			this.battle.add('Opponent ' + (this.battle.ignoreOpponent ? '' : 'no longer ') + 'ignored.');
			this.battle.resetToCurrentTurn();
		},
		toggleRightPanelBattles: function (e) {
			Dex.prefs('rightpanelbattles', !!e.currentTarget.checked);
		}
	});

	var TimerPopup = this.TimerPopup = Popup.extend({
		initialize: function (data) {
			this.room = data.room;
			if (this.room.battle.kickingInactive) {
				this.$el.html('<p><button name="timerOff"><strong>Stop timer</strong></button></p>');
			} else {
				this.$el.html('<p><button name="timerOn"><strong>Start timer</strong></button></p>');
			}
		},
		timerOff: function () {
			this.room.setTimer('off');
			this.close();
		},
		timerOn: function () {
			this.room.setTimer('on');
			this.close();
		}
	});

}).call(this, jQuery);
