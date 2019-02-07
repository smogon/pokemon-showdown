(function ($) {

	function arrayToPhrase(array, finalSeparator) {
		if (array.length <= 1)
			return array.join();
		finalSeparator = finalSeparator || "and";
		return array.slice(0, -1).join(", ") + " " + finalSeparator + " " + array.slice(-1)[0];
	}

	function clampPosition(element, position) {
		var $element = $(element);

		var elementWidth = $element.width();
		var parentWidth = $element.parent().width();
		if (parentWidth >= elementWidth)
			position.right = parentWidth / 2 - elementWidth / 2;
		else if (position.right < parentWidth - elementWidth)
			position.right = parentWidth - elementWidth;
		else if (position.right > 0)
			position.right = 0;

		var elementHeight = $element.height();
		var parentHeight = $element.parent().height();
		if (parentHeight >= elementHeight)
			position.top = parentHeight / 2 - elementHeight / 2;
		else if (position.top < parentHeight - elementHeight)
			position.top = parentHeight - elementHeight;
		else if (position.top > 0)
			position.top = 0;
	}

	function makeDraggable(element, popoutCallback, position) {
		var $element = $(element);
		position = position || {};

		$element.css({
			'user-select': 'none',
			cursor: 'default',
			position: 'absolute'
		});

		if (popoutCallback)
			$element.parent().append($('<a class="tournament-popout-link ilink" href="#">Pop-out</a>').on('click', popoutCallback));

		if (!('right' in position) || position.isDefault) {
			position.right = $element.parent().width() / 2 - $element.width() / 2;
			position.top = 0;
			position.isDefault = true;
		}

		clampPosition(element, position);
		$element.css({
			right: position.right,
			top: position.top
		});

		// Note: Origin starts from the top right instead of the top left here,
		// because when a battle room is opened, the left side moves but the right doesn't,
		// so we have to use the right side to keep the element in the same location.
		var innerX = 0;
		var innerY = 0;

		$element.on('mousedown', function (e) {
			innerX = e.pageX + ($element.parent().width() - $element.width() - this.offsetLeft);
			innerY = e.pageY - this.offsetTop;

			function mouseMoveCallback(e) {
				position.right = innerX - e.pageX;
				position.top = e.pageY - innerY;
				delete position.isDefault;
				clampPosition(element, position);
				$element.css({
					right: position.right,
					top: position.top
				});
			}
			$(document).on('mousemove', mouseMoveCallback)
				.one('mouseup', function () {
					$(document).off('mousemove', mouseMoveCallback);
				});
		});
	}

	this.TournamentBox = (function () {
		function TournamentBox(room, $wrapper) {
			this.room = room;
			this.$wrapper = $wrapper;

			$wrapper.html(
				'<div class="tournament-title">' +
					'<span class="tournament-format"></span> <span class="tournament-generator"></span> Tournament' +
					'<div class="tournament-status"></div>' +
					'<div class="tournament-toggle">Toggle</div>' +
				'</div>' +
				'<div class="tournament-box">' +
					'<div class="tournament-bracket"></div>' +
					'<div class="tournament-tools">' +
						'<div class="tournament-team"></div>' +
						'<button class="button tournament-join">Join</button><button class="button tournament-validate"><i class="fa fa-check"></i> Validate</button> <button class="button tournament-leave">Leave</button>' +
						'<div class="tournament-nomatches">Waiting for battles to become available...</div>' +
						'<div class="tournament-challenge">' +
							'<div class="tournament-challenge-user"></div>' +
							'<button class="button tournament-challenge-challenge"><strong>Ready!</strong></button><span class="tournament-challenge-user-menu"></span>' +
						'</div>' +
						'<div class="tournament-challengeby"></div>' +
						'<div class="tournament-challenging">' +
							'<div class="tournament-challenging-message"></div>' +
							'<button class="button tournament-challenge-cancel">Cancel</button>' +
						'</div>' +
						'<div class="tournament-challenged">' +
							'<div class="tournament-challenged-message"></div>' +
							'<button class="button tournament-challenge-accept"><strong>Ready!</strong></button>' +
						'</div>' +
					'</div>' +
				'</div>');

			this.$title = $wrapper.find('.tournament-title');
			this.$format = $wrapper.find('.tournament-format');
			this.$generator = $wrapper.find('.tournament-generator');
			this.$status = $wrapper.find('.tournament-status');
			this.$box = $wrapper.find('.tournament-box');
			this.$bracket = $wrapper.find('.tournament-bracket');
			this.$tools = $wrapper.find('.tournament-tools');
			this.$join = $wrapper.find('.tournament-join');
			this.$leave = $wrapper.find('.tournament-leave');
			this.$noMatches = $wrapper.find('.tournament-nomatches');
			this.$teamSelect = $wrapper.find('.tournament-team');
			this.$validate = $wrapper.find('.tournament-validate');
			this.$challenge = $wrapper.find('.tournament-challenge');
			this.$challengeUser = $wrapper.find('.tournament-challenge-user');
			this.$challengeUserMenu = $wrapper.find('.tournament-challenge-user-menu');
			this.$challengeChallenge = $wrapper.find('.tournament-challenge-challenge');
			this.$challengeBy = $wrapper.find('.tournament-challengeby');
			this.$challenging = $wrapper.find('.tournament-challenging');
			this.$challengingMessage = $wrapper.find('.tournament-challenging-message');
			this.$challenged = $wrapper.find('.tournament-challenged');
			this.$challengedMessage = $wrapper.find('.tournament-challenged-message');
			this.$challengeAccept = $wrapper.find('.tournament-challenge-accept');
			this.$challengeCancel = $wrapper.find('.tournament-challenge-cancel');

			this.info = {};
			this.updates = {};
			this.savedBracketPosition = {};

			this.$lastJoinLeaveMessage = null;
			this.batchedJoins = [];
			this.batchedLeaves = [];

			this.bracketPopup = null;
			this.savedPopoutBracketPosition = {};

			var self = this;
			this.$title.on('click', function () {
				self.toggleBoxVisibility();
			});
			this.$box.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function () {
				if (self.isBoxVisible())
					self.$box.css('transition', 'none');
				if (!self.info.isActive)
					self.$wrapper.find('.active').andSelf().removeClass('active');
			});

			this.$join.on('click', function () {
				self.room.send('/tournament join');
			});
			this.$leave.on('click', function () {
				self.room.send('/tournament leave');
			});
			this.$challengeChallenge.on('click', function () {
				app.sendTeam(Storage.teams[self.$teamSelect.children().val()]);
				self.room.send('/tournament challenge ' + self.$challengeUserMenu.children().val());
			});
			this.$challengeAccept.on('click', function () {
				app.sendTeam(Storage.teams[self.$teamSelect.children().val()]);
				self.room.send('/tournament acceptchallenge');
			});
			this.$challengeCancel.on('click', function () {
				self.room.send('/tournament cancelchallenge');
			});
			this.$validate.on('click', function () {
				app.sendTeam(Storage.teams[self.$teamSelect.children().val()]);
				self.room.send('/tournament vtm');
			});

			app.user.on('saveteams', this.updateTeams, this);
		}

		TournamentBox.prototype.updateLayout = function () {
			this.$box.css('max-height', this.isBoxVisible() ? this.$box[0].scrollHeight : '');
			if (this.$bracket.hasClass('tournament-bracket-overflowing')) {
				clampPosition(this.$bracket.children().first(), this.savedBracketPosition);
				this.$bracket.children().first().css({
					right: this.savedBracketPosition.right,
					top: this.savedBracketPosition.top
				});
			} else {
				if (this.$bracket[0].offsetHeight < this.$bracket[0].scrollHeight ||
					this.$bracket[0].offsetWidth < this.$bracket[0].scrollWidth) {
					this.$bracket.addClass('tournament-bracket-overflowing');
					makeDraggable(this.$bracket.children().first(), this.showBracketPopup.bind(this, this.info.bracketData, false), this.savedBracketPosition);
				}
			}
		};
		TournamentBox.prototype.updateTeams = function () {
			var forceFormatChange = (this.info.teambuilderFormat !== this.teamSelectFormat);
			this.teamSelectFormat = this.info.teambuilderFormat;

			if (!this.info.isJoined) {
				this.$teamSelect.hide();
				if (forceFormatChange) this.$teamSelect.html('');
				return;
			}

			var teamIndex = -1;
			if (!forceFormatChange && this.$teamSelect.children().val()) {
				teamIndex = parseInt(this.$teamSelect.children().val(), 10);
				if (isNaN(teamIndex)) teamIndex = -1;
			}

			this.$teamSelect.html(app.rooms[''].renderTeams.call(this, this.info.teambuilderFormat, teamIndex));
			this.$teamSelect.children().data('type', 'teamSelect');
			this.$teamSelect.children().attr('name', 'tournamentButton');
			this.$teamSelect.show();
			var val = this.$teamSelect.children().val();
			// this.$validate.toggle(val !== 'random');
			this.$validate.attr('disabled', !val || !val.length || val === 'random' ? 'disabled' : null);
			this.$validate.toggleClass('disabled', !val || !val.length || val === 'random');
		};

		TournamentBox.prototype.isBoxVisible = function () {
			return this.$box.hasClass('active');
		};
		TournamentBox.prototype.toggleBoxVisibility = function (isVisible) {
			var isCurrentlyVisible = this.isBoxVisible();
			if (isVisible === undefined)
				isVisible = !isCurrentlyVisible;

			if ((isVisible && isCurrentlyVisible) ||
				(!isVisible && !isCurrentlyVisible))
				return;

			this.$box.toggleClass('active', !!isVisible);
			this.$box.css('transition', '');
			this.$box.css('max-height', isVisible ? this.$box[0].scrollHeight : '');
		};

		TournamentBox.prototype.parseMessage = function (data, isBroadcast) {
			var cmd = data.shift().toLowerCase();
			if (isBroadcast) {
				switch (cmd) {
				case 'info':
					var tournaments = JSON.parse(data.join('|'));
					var $infoList = "No tournaments are currently running.";
					if (tournaments.length > 0) {
						$infoList = $('<ul></ul>');
						tournaments.forEach(function (tournament) {
							var formatName = window.BattleFormats && BattleFormats[tournament.format] ? BattleFormats[tournament.format].name : tournament.format;
							var $info = $('<li></li>');
							$info.text(": " + formatName + " " + tournament.generator + (tournament.isStarted ? " (Started)" : ""));
							$info.prepend($('<a class="ilink"></a>').attr('href', app.root + toRoomid(tournament.room).toLowerCase()).text(tournament.room));
							$infoList.append($info);
						});
					}
					this.room.$chat.append($('<div class="notice">').append($('<div class="infobox tournaments-info"></div></div>').append($infoList)));
					break;

				default:
					return true;
				}
			} else {
				switch (cmd) {
				case 'create':
					var formatName = window.BattleFormats && BattleFormats[data[0]] ? BattleFormats[data[0]].name : data[0];
					var type = data[1];
					this.room.$chat.append("<div class=\"notice tournament-message-create\">" + BattleLog.escapeHTML(formatName) + " " + BattleLog.escapeHTML(type) + " Tournament created.</div>");
					this.room.notifyOnce("Tournament created", "Room: " + this.room.title + "\nFormat: " + formatName + "\nType: " + type, 'tournament-create');
					this.curTeamIndex = 0;
					this.updateTeams();
					break;

				case 'join':
				case 'leave':
					if (this.$lastJoinLeaveMessage && !this.$lastJoinLeaveMessage.is(this.room.$chat.children().last())) {
						this.$lastJoinLeaveMessage = null;
						this.batchedJoins = [];
						this.batchedLeaves = [];
					}
					if (!this.$lastJoinLeaveMessage) {
						this.$lastJoinLeaveMessage = $('<div class="notice tournament-message-joinleave"></div>');
						this.room.$chat.append(this.$lastJoinLeaveMessage);
					}

					if (cmd === 'join' && this.batchedJoins.indexOf(data[0]) < 0) {
						this.batchedJoins.push(data[0]);
					}
					if (cmd === 'leave' && this.batchedLeaves.indexOf(data[0]) < 0) {
						this.batchedLeaves.push(data[0]);
					}

					var message = [];
					var joins = this.batchedJoins.slice(0, 5);
					var leaves = this.batchedLeaves.slice(0, 5);
					if (this.batchedJoins.length > 5) joins.push((this.batchedJoins.length - 5) + " others");
					if (this.batchedLeaves.length > 5) leaves.push((this.batchedLeaves.length - 5) + " others");
					if (joins.length > 0) message.push(arrayToPhrase(joins) + " joined the tournament");
					if (leaves.length > 0) message.push(arrayToPhrase(leaves) + " left the tournament");
					this.$lastJoinLeaveMessage.text(message.join("; ") + ".");
					break;

				case 'start':
					this.room.closeNotification('tournament-create');
					if (!this.info.isJoined) {
						this.toggleBoxVisibility(false);
					} else if (this.info.teambuilderFormat.substr(0, 4) === 'gen5' && !Dex.loadedSpriteData['bw']) {
						Dex.loadSpriteData('bw');
					}
					this.room.$chat.append("<div class=\"notice tournament-message-start\">The tournament has started!</div>");
					break;

				case 'disqualify':
					this.room.$chat.append("<div class=\"notice tournament-message-disqualify\">" + BattleLog.escapeHTML(data[0]) + " has been disqualified from the tournament.</div>");
					break;

				case 'autodq':
					if (data[0] === 'off') {
						this.room.$chat.append("<div class=\"notice tournament-message-autodq-off\">The tournament's automatic disqualify timer has been turned off.</div>");
					} else if (data[0] === 'on') {
						var minutes = (data[1] / 1000 / 60);
						this.room.$chat.append("<div class=\"notice tournament-message-autodq-off\">The tournament's automatic disqualify timer has been set to " + minutes + " minute" + (minutes === 1 ? "" : "s") + ".</div>");
					} else {
						var seconds = Math.floor(data[1] / 1000);
						app.addPopupMessage("Please respond to the tournament within " + seconds + " seconds or you may be automatically disqualified.");
						this.room.notifyOnce("Tournament Automatic Disqualification Warning", "Room: " + this.room.title + "\nSeconds: " + seconds, 'tournament-autodq-warning');
					}
					break;

				case 'autostart':
					if (data[0] === 'off') {
						this.room.$chat.append("<div class=\"notice tournament-message-autostart\">The tournament's automatic start is now off.</div>");
					} else if (data[0] === 'on') {
						var minutes = (data[1] / 1000 / 60);
						this.room.$chat.append("<div class=\"notice tournament-message-autostart\">The tournament will automatically start in " + minutes + " minute" + (minutes === 1 ? "" : "s") + ".</div>");
					}
					break;

				case 'scouting':
					if (data[0] === 'allow') {
						this.room.$chat.append("<div class=\"notice tournament-message-scouting\">Scouting is now allowed (Tournament players can watch other tournament battles)</div>");
					} else if (data[0] === 'disallow') {
						this.room.$chat.append("<div class=\"notice tournament-message-scouting\">Scouting is now banned (Tournament players can't watch other tournament battles)</div>");
					}
					break;

				case 'update':
					$.extend(this.updates, JSON.parse(data.join('|')));
					break;

				case 'updateend':
					$.extend(this.info, this.updates);
					if (!this.info.isActive) {
						this.$wrapper.addClass("active");
						if (!this.info.isStarted || this.info.isJoined)
							this.toggleBoxVisibility(true);
						this.info.isActive = true;
					}

					if ('format' in this.updates || 'teambuilderFormat' in this.updates) {
						if (!this.info.teambuilderFormat) this.info.teambuilderFormat = this.info.format;
						this.$format.text(window.BattleFormats && BattleFormats[this.info.format] ? BattleFormats[this.info.format].name : this.info.format);
						this.updateTeams();
					}
					if ('isJoined' in this.updates) {
						this.updateTeams();
					}
					if ('generator' in this.updates)
						this.$generator.text(this.info.generator);
					if ('isStarted' in this.updates) {
						this.$status.text(this.info.isStarted ? "In Progress" : "Signups");
					}

					// Update the toolbox
					if ('isStarted' in this.updates || 'isJoined' in this.updates) {
						this.$join.toggleClass('active', !this.info.isStarted && !this.info.isJoined);
						this.$leave.toggleClass('active', !this.info.isStarted && this.info.isJoined);
						this.$validate.toggleClass('active', this.info.isJoined && !this.info.challenging && !this.info.challenged && !(this.info.challenges && this.info.challenges.length));
						this.$tools.toggleClass('active', !this.info.isStarted || this.info.isJoined);
					}

					// Update the bracket
					if ('bracketData' in this.updates) {
						var $bracket = this.generateBracket(this.info.bracketData);
						this.$bracket.empty();
						this.$bracket.removeClass('tournament-bracket-overflowing');
						if ($bracket) {
							this.$bracket.append($bracket);
							this.updateLayout();

							if (this.bracketPopup)
								this.bracketPopup.updateBracket(this.generateBracket(this.info.bracketData));
						}
					}

					if (this.info.isStarted && this.info.isJoined) {
						// Update the challenges
						if ('challenges' in this.updates) {
							if (this.info.challenges.length > 0) {
								this.$challengeUser.text("vs. " + this.info.challenges[0]);
								this.$challengeUserMenu.toggle(this.info.challenges.length > 1);
								this.$challengeUserMenu.html(this.renderChallengeUsers());
								this.toggleBoxVisibility(true);
								if (!this.$challenge.hasClass('active')) {
									this.room.notifyOnce("Tournament challenges available", "Room: " + this.room.title, 'tournament-challenges');
								}
							}
							this.$challenge.toggleClass('active', this.info.challenges.length > 0);
						}

						if ('challengeBys' in this.updates) {
							this.$challengeBy.toggleClass('active', this.info.challengeBys.length > 0);
							if (this.info.challengeBys.length > 0)
								this.$challengeBy.text((this.info.challenges.length > 0 ? "Or wait" : "Waiting") + " for " + arrayToPhrase(this.info.challengeBys, "or") + " to challenge you.");
						}

						if ('challenging' in this.updates) {
							this.$challenging.toggleClass('active', !!this.info.challenging);
							if (this.info.challenging) {
								this.$challengingMessage.text("Waiting for " + this.info.challenging + "...");
							}
						}

						if ('challenged' in this.updates) {
							if (this.info.challenged) {
								this.$challengedMessage.text("vs. " + this.info.challenged);
								this.toggleBoxVisibility(true);
								if (!this.$challenged.hasClass('active')) {
									this.room.notifyOnce("Tournament challenge from " + this.info.challenged, "Room: " + this.room.title, 'tournament-challenged');
								}
							}
							this.$challenged.toggleClass('active', !!this.info.challenged);
						}

						this.$noMatches.toggleClass('active',
							this.info.challenges.length === 0 && this.info.challengeBys.length === 0 && !this.info.challenging && !this.info.challenged);
					}

					this.updates = {};
					break;

				case 'battlestart':
					var roomid = toRoomid(data[2]).toLowerCase();
					this.room.$chat.append('<div class="notice tournament-message-battlestart tournament-' + roomid + '"><a href="' + app.root + roomid + '" class="ilink">' +
						"Tournament battle between " + BattleLog.escapeHTML(data[0]) + " and " + BattleLog.escapeHTML(data[1]) + " started." +
						'</a></div>');
					break;

				case 'battleend':
					var result = "drawn";
					if (data[2] === 'win')
						result = "won";
					else if (data[2] === 'loss')
						result = "lost";
					var message = BattleLog.escapeHTML(data[0]) + " has " + result + " the match " + BattleLog.escapeHTML(data[3].split(',').join(' - ')) + " against " + BattleLog.escapeHTML(data[1]) +
						(data[4] === 'fail' ? " but the tournament does not support drawing, so it did not count" : "") + ".";
					var $battleMessage = data[5] ? this.room.$chat.find('.tournament-' + toRoomid(data[5]).toLowerCase()) : '';
					if ($battleMessage && $battleMessage.length) {
						$battleMessage.removeClass('tournament-message-battlestart').addClass('tournament-message-battleend').find('a').html(message);
					} else {
						this.room.$chat.append('<div class="notice tournament-message-battleend">' + message + '</div>');
					}
					break;

				case 'end':
					var endData = JSON.parse(data[0]);

					var $bracket = this.generateBracket(endData.bracketData);
					if ($bracket) {
						var $bracketMessage = $('<div class="notice tournament-message-end-bracket"></div>').append($bracket);
						this.room.$chat.append($bracketMessage);
						if ($bracketMessage[0].offsetHeight < $bracketMessage[0].scrollHeight ||
							$bracketMessage[0].offsetWidth < $bracketMessage[0].scrollWidth) {
							$bracketMessage.addClass('tournament-message-end-bracket-overflowing');
							makeDraggable($bracket, this.showBracketPopup.bind(this, endData.bracketData, true));
						}
					}

					var type = endData.generator;
					this.room.$chat.append("<div class=\"notice tournament-message-end-winner\">Congratulations to " + BattleLog.escapeHTML(arrayToPhrase(endData.results[0])) + " for winning the " + BattleLog.escapeFormat(endData.format) + " " + BattleLog.escapeHTML(type) + " Tournament!</div>");
					if (endData.results[1])
						this.room.$chat.append("<div class=\"notice tournament-message-end-runnerup\">Runner-up" + (endData.results[1].length > 1 ? "s" : "") + ": " + BattleLog.escapeHTML(arrayToPhrase(endData.results[1])) + "</div>");

					// Fallthrough

				case 'forceend':
					this.room.closeNotification('tournament-create');
					this.info = {};
					this.updates = {};
					this.savedBracketPosition = {};

					if (this.bracketPopup)
						this.bracketPopup.close();
					this.savedPopoutBracketPosition = {};

					if (!this.isBoxVisible() || app.curSideRoom !== this.room)
						this.$wrapper.find('.active').andSelf().removeClass('active');
					else
						this.toggleBoxVisibility(false);

					if (cmd === 'forceend')
						this.room.$chat.append("<div class=\"notice tournament-message-forceend\">The tournament was forcibly ended.</div>");
					break;

				case 'error':
					var appendError = function (message) {
						this.room.$chat.append("<div class=\"notice tournament-message-forceend\">" + BattleLog.sanitizeHTML(message) + "</div>");
					}.bind(this);

					switch (data[0]) {
					case 'BracketFrozen':
					case 'AlreadyStarted':
						appendError("The tournament has already started.");
						break;

					case 'BracketNotFrozen':
					case 'NotStarted':
						appendError("The tournament hasn't started yet.");
						break;

					case 'UserAlreadyAdded':
						appendError("You are already in the tournament.");
						break;

					case 'AltUserAlreadyAdded':
						appendError("One of your alts is already in the tournament.");
						break;

					case 'UserNotAdded':
						appendError((data[1] && data[1] === app.user.get('userid') ? "You aren't" : "This user isn't") + " in the tournament.");
						break;

					case 'NotEnoughUsers':
						appendError("There aren't enough users.");
						break;

					case 'InvalidAutoDisqualifyTimeout':
					case 'InvalidAutoStartTimeout':
						appendError("That isn't a valid timeout value.");
						break;

					case 'InvalidMatch':
						appendError("That isn't a valid tournament matchup.");
						break;

					case 'UserNotNamed':
						appendError("You must have a name in order to join the tournament.");
						break;

					case 'Full':
						appendError("The tournament is already at maximum capacity for users.");
						break;

					case 'AlreadyDisqualified':
						appendError((data[1] && data[1] === app.user.get('userid') ? "You have" : "This user has") + " already been disqualified.");
						break;

					case 'Banned':
						appendError("You are banned from entering tournaments.");
						break;

					default:
						appendError("Unknown error: " + data[0]);
						break;
					}
					break;

				default:
					return true;
				}

				this.$box.css('max-height', this.isBoxVisible() ? this.$box[0].scrollHeight : '');
			}
		};

		TournamentBox.prototype.generateBracket = function (data) {
			if (data.type === 'tree') {
				var $div = $('<div class="tournament-bracket-tree"></div>');

				if (!data.rootNode) {
					if (!('users' in data)) return;
					var users = data.users.length;
					if (users) $div.html('<b>' + users + '</b> user' + (users !== 1 ? 's' : '') + ':<br />' + BattleLog.escapeHTML(data.users.join(", ")));
					return $div;
				}

				var name = app.user.get('name');
				var nodeSize = {
					width: 150, height: 20,
					radius: 5,
					separationX: 30, separationY: 15
				};

				var nodesByDepth = [];
				var stack = [{node: data.rootNode, depth: 0}];
				while (stack.length > 0) {
					var frame = stack.pop();

					if (!nodesByDepth[frame.depth])
						nodesByDepth.push(0);
					++nodesByDepth[frame.depth];

					frame.node.children.forEach(function (child) {
						stack.push({node: child, depth: frame.depth + 1});
					});
				}
				var maxDepth = nodesByDepth.length;
				var maxWidth = 0;
				nodesByDepth.forEach(function (nodes) {
					if (nodes > maxWidth)
						maxWidth = nodes;
				});

				nodeSize.realWidth = nodeSize.width + nodeSize.radius * 2;
				nodeSize.realHeight = nodeSize.height + nodeSize.radius * 2;
				nodeSize.smallRealHeight = nodeSize.height / 2 + nodeSize.radius * 2;
				var size = {
					width: nodeSize.realWidth * maxDepth + nodeSize.separationX * maxDepth,
					height: nodeSize.realHeight * (maxWidth + 0.5) + nodeSize.separationY * maxWidth
				};

				var tree = d3.layout.tree()
					.size([size.height, size.width - nodeSize.realWidth - nodeSize.separationX])
					.separation(function () { return 1; })
					.children(function (node) {
						return node.children.length === 0 ? null : node.children;
					});
				var nodes = tree.nodes(data.rootNode);
				var links = tree.links(nodes);

				var layoutRoot = d3.select($div[0])
					.append('svg:svg').attr('width', size.width).attr('height', size.height)
					.append('svg:g')
					.attr('transform', 'translate(' + (-(nodeSize.realWidth + nodeSize.separationX) / 2) + ',0)');

				var link = d3.svg.diagonal()
					.source(function (link) {
						return {x: link.source.x, y: link.source.y + nodeSize.realWidth / 2};
					})
					.target(function (link) {
						return {x: link.target.x, y: link.target.y - nodeSize.realWidth / 2};
					})
					.projection(function (link) {
						return [size.width - link.y, link.x];
					});
				layoutRoot.selectAll('path.tournament-bracket-tree-link').data(links).enter()
					.append('svg:path')
					.attr('d', link)
					.classed('tournament-bracket-tree-link', true)
					.classed('tournament-bracket-tree-link-active', function (link) {
						return link.source.state === 'finished' && link.source.team === link.target.team;
					});

				var nodeGroup = layoutRoot.selectAll('g.tournament-bracket-tree-node').data(nodes).enter()
					.append('svg:g').classed('tournament-bracket-tree-node', true).attr('transform', function (node) {
						return 'translate(' + (size.width - node.y) + ',' + node.x + ')';
					});
				nodeGroup.append('svg:rect')
					.attr('rx', nodeSize.radius)
					.attr('x', -nodeSize.realWidth / 2).attr('width', nodeSize.realWidth)
					.each(function (node) {
						var elem = d3.select(this);
						if (node.children.length === 0)
							elem.attr('y', -nodeSize.smallRealHeight / 2).attr('height', nodeSize.smallRealHeight);
						else
							elem.attr('y', -nodeSize.realHeight / 2).attr('height', nodeSize.realHeight);
						if (node.team === name) elem.attr('stroke-dasharray', '5,5');
					});
				nodeGroup.each(function (node) {
					var elem = d3.select(this);
					if (node.children.length === 0) {
						elem.classed('tournament-bracket-tree-node-team', true);
						elem.append('svg:text').text(node.team || "Unavailable");
					} else {
						elem.classed('tournament-bracket-tree-node-match', true);
						elem.classed('tournament-bracket-tree-node-match-' + node.state, true);
						if (node.state === 'unavailable')
							elem.append('svg:text').text("Unavailable");
						else {
							var teams = elem.append('svg:text').attr('y', -nodeSize.realHeight / 5).classed('tournament-bracket-tree-node-match-teams', true);
							var teamA = teams.append('svg:tspan').classed('tournament-bracket-tree-node-match-team', true).text(node.children[0].team);
							teams.append('svg:tspan').text(" vs ");
							var teamB = teams.append('svg:tspan').classed('tournament-bracket-tree-node-match-team', true).text(node.children[1].team);

							var score = elem.append('svg:text').attr('y', nodeSize.realHeight / 5);
							if (node.state === 'available')
								score.text("Waiting");
							else if (node.state === 'challenging')
								score.text("Challenging");
							else if (node.state === 'inprogress')
								score.append('svg:a').attr('xlink:href', app.root + toRoomid(node.room).toLowerCase()).classed('ilink', true).text("In-progress").on('click', function () {
									var e = d3.event;
									if (e.cmdKey || e.metaKey || e.ctrlKey) return;
									e.preventDefault();
									e.stopPropagation();
									var roomid = $(e.currentTarget).attr('href').substr(app.root.length);
									app.tryJoinRoom(roomid);
								});
							else if (node.state === 'finished') {
								if (node.result === 'win') {
									teamA.classed('tournament-bracket-tree-node-match-team-win', true);
									teamB.classed('tournament-bracket-tree-node-match-team-loss', true);
								} else if (node.result === 'loss') {
									teamA.classed('tournament-bracket-tree-node-match-team-loss', true);
									teamB.classed('tournament-bracket-tree-node-match-team-win', true);
								} else {
									teamA.classed('tournament-bracket-tree-node-match-team-draw', true);
									teamB.classed('tournament-bracket-tree-node-match-team-draw', true);
								}

								elem.classed('tournament-bracket-tree-node-match-result-' + node.result, true);
								score.text(node.score.join(" - "));
							}
						}
					}

					if (node.parent && node.parent.state === 'finished')
						if (node.parent.result === 'draw')
							elem.classed('tournament-bracket-tree-node-draw', true);
						else if (node.team === node.parent.team)
							elem.classed('tournament-bracket-tree-node-win', true);
						else
							elem.classed('tournament-bracket-tree-node-loss', true);
				});

				return $div;
			} else if (data.type === 'table') {
				if (data.tableContents.length === 0)
					return;

				var $table = $('<table class="tournament-bracket-table"></table>');

				var $colHeaders = $('<tr><td class="empty"></td></tr>');
				$table.append($colHeaders);
				data.tableHeaders.cols.forEach(function (name) {
					$colHeaders.append($('<th></th>').text(name));
				});

				data.tableHeaders.rows.forEach(function (name, r) {
					var $row = $('<tr></tr>');
					$table.append($row);
					$row.append($('<th></th>').text(name));
					data.tableContents[r].forEach(function (cell) {
						var $cell = $('<td></td>');
						$row.append($cell);
						if (!cell) {
							$cell.addClass('tournament-bracket-table-cell-null');
							return;
						}
						$cell.addClass('tournament-bracket-table-cell-' + cell.state);
						if (cell.state === 'unavailable')
							$cell.text("Unavailable");
						else if (cell.state === 'available')
							$cell.text("Waiting");
						else if (cell.state === 'challenging')
							$cell.text("Challenging");
						else if (cell.state === "inprogress")
							$cell.html('<a href="' + app.root + toRoomid(cell.room).toLowerCase() + '" class="ilink">In-progress</a>').children().on('click', function (e) {
								if (e.cmdKey || e.metaKey || e.ctrlKey) return;
								e.preventDefault();
								e.stopPropagation();
								var roomid = $(e.currentTarget).attr('href').substr(app.root.length);
								app.tryJoinRoom(roomid);
							});
						else if (cell.state === 'finished') {
							$cell.addClass('tournament-bracket-table-cell-result-' + cell.result);
							$cell.text(cell.score.join(" - "));
						}
					});
					$row.append($('<th class="tournament-bracket-row-score"></th>').text(data.scores[r]));
				});

				return $table;
			}
		};
		TournamentBox.prototype.showBracketPopup = function (data, isStandalone) {
			if (isStandalone)
				app.addPopup(BracketPopup, {$bracket: this.generateBracket(data)});
			else
				this.bracketPopup = app.addPopup(BracketPopup, {parent: this, $bracket: this.generateBracket(data)});
		};

		TournamentBox.prototype.renderChallengeUsers = function () {
			return ' <button class="button" value="' + toId(this.info.challenges[0]) + '" name="tournamentButton" data-type="challengeUser">Change opponent</button>';
		};
		TournamentBox.prototype.challengeUser = function (user, button) {
			app.addPopup(UserPopup, {user: user, users: this.info.challenges, sourceEl: button});
		};

		TournamentBox.prototype.teamSelect = function (team, button) {
			app.addPopup(TeamPopup, {team: team, format: this.info.teambuilderFormat, sourceEl: button, room: this.room.id});
		};

		return TournamentBox;
	})();

	var UserPopup = this.Popup.extend({
		initialize: function (data) {
			this.$el.html('<ul class="popupmenu">' + data.users.map(function (user) {
				var escapedUser = BattleLog.escapeHTML(user);
				return '<li><button name="selectUser" value="' + escapedUser + '"' + (user === data.user ? ' class="sel"' : '') + '>' + escapedUser + '</button></li>';
			}).join('') + '</ul>');
		},
		selectUser: function (user) {
			this.sourceEl.val(toId(user));
			this.sourceEl.parent().parent().find('.tournament-challenge-user').text('vs. ' + user);
			this.close();
		}
	});

	var BracketPopup = this.Popup.extend({
		type: 'semimodal',
		className: 'ps-popup tournament-popout-bracket',
		initialize: function (data) {
			this.parent = data.parent;
			setTimeout(this.updateBracket.bind(this, data.$bracket), 0);
		},
		updateBracket: function ($bracket) {
			this.$el.empty();
			this.$el.append($bracket);
			this.$el.append('<p class="buttonbar"><button name="close">Close</button></p>');

			// Please keep these two values in-sync with .tournament-popout-bracket in client.css
			var maxWidth = 0.8;
			var maxHeight = 0.8;

			var isWidthOverflowed = $bracket[0].scrollWidth > window.innerWidth * maxWidth;
			var isHeightOverflowed = $bracket[0].scrollHeight > window.innerHeight * maxHeight;
			this.$el.css('width', isWidthOverflowed ? window.innerWidth * maxWidth : $bracket[0].scrollWidth);
			this.$el.css('height', isHeightOverflowed ? window.innerHeight * maxHeight : $bracket[0].scrollHeight);
			if (isWidthOverflowed || isHeightOverflowed)
				makeDraggable($bracket, null, this.parent ? this.parent.savedPopoutBracketPosition : null);
		},
		close: function () {
			if (this.parent)
				this.parent.bracketPopup = null;
			Popup.prototype.close.call(this);
		}
	});

}).call(this, jQuery);
