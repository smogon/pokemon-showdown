(function ($) {

	this.RoomsRoom = Room.extend({
		minWidth: 320,
		maxWidth: 1024,
		type: 'rooms',
		title: 'Rooms',
		isSideRoom: true,
		initialize: function () {
			this.$el.addClass('ps-room-light').addClass('scrollable');
			var buf = '<div class="pad"><button class="button" style="float:right;font-size:10pt;margin-top:3px" name="closeHide"><i class="fa fa-caret-right"></i> Hide</button>';
			buf += '<div class="roomlisttop"></div><div class="roomlist"><p><em style="font-size:20pt">Loading...</em></p></div><div class="roomlist"></div>';
			buf += '<p><button name="joinRoomPopup" class="button">Join other room</button></p></div>';
			this.$el.html(buf);
			app.on('response:rooms', this.update, this);
			app.send('/cmd rooms');
			app.user.on('change:named', this.updateUser, this);
			this.update();
		},
		updateUser: function () {
			this.update();
		},
		focus: function () {
			if (new Date().getTime() - this.lastUpdate > 60 * 1000) {
				app.send('/cmd rooms');
				this.lastUpdate = new Date().getTime();
			}
			var prevPos = this.$el.scrollTop();
			this.$('button[name=joinRoomPopup]').focus();
			this.$el.scrollTop(prevPos);
		},
		joinRoomPopup: function () {
			app.addPopupPrompt("Room name:", "Join room", function (room) {
				if (room.substr(0, 7) === 'http://') room = room.slice(7);
				if (room.substr(0, 8) === 'https://') room = room.slice(8);
				if (room.substr(0, 25) === 'play.pokemonshowdown.com/') room = room.slice(25);
				if (room.substr(0, 8) === 'psim.us/') room = room.slice(8);
				if (room.substr(0, document.location.hostname.length + 1) === document.location.hostname + '/') room = room.slice(document.location.hostname.length + 1);
				room = toRoomid(room);
				if (!room) return;
				app.tryJoinRoom(room);
			});
		},
		update: function (rooms) {
			if (rooms) {
				this.lastUpdate = new Date().getTime();
				app.roomsData = rooms;
			} else {
				rooms = app.roomsData;
			}
			if (!rooms) return;
			this.updateRoomList();
			if (!app.roomsFirstOpen && window.location.host !== 'demo.psim.us') {
				if (Config.roomsFirstOpenScript) {
					Config.roomsFirstOpenScript();
				}
				app.roomsFirstOpen = 2;
			}
		},
		renderRoomBtn: function (roomData) {
			var id = toId(roomData.title);
			var buf = '<div><a href="' + app.root + id + '" class="ilink"><small style="float:right">(' + Number(roomData.userCount) + ' users)</small><strong><i class="fa fa-comment-o"></i> ' + BattleLog.escapeHTML(roomData.title) + '<br /></strong><small>' + BattleLog.escapeHTML(roomData.desc || '');
			if (roomData.subRooms && roomData.subRooms.length) {
				buf += '<br/><i class="fa fa-level-up fa-rotate-90"></i> Subrooms: <strong>';
				for (var i = 0; i < roomData.subRooms.length; i++) {
					if (i) buf += ', ';
					buf += '<i class="fa fa-comment-o"></i> ' + BattleLog.escapeHTML(roomData.subRooms[i]);
				}
				buf += '</strong>';
			}
			buf += '</small></a></div>';
			return buf;
		},
		compareRooms: function (roomA, roomB) {
			return roomB.userCount - roomA.userCount;
		},
		updateRoomList: function () {
			var rooms = app.roomsData;

			if (rooms.userCount) {
				var userCount = Number(rooms.userCount);
				var battleCount = Number(rooms.battleCount);
				var leftSide = '<span style="' + Dex.getPokemonIcon('meloetta', true) + ';" class="picon icon-left" title="Meloetta is PS\'s mascot! The Aria forme is about using its voice, and represents our chatrooms."></span> <button class="button" name="finduser" title="Find an online user"><strong>' + userCount + '</strong> ' + (userCount == 1 ? 'user' : 'users') + ' online</button>';
				var rightSide = '<button class="button" name="roomlist" title="Watch an active battle"><strong>' + battleCount + '</strong> active ' + (battleCount == 1 ? 'battle' : 'battles') + '</button> <span style="' + Dex.getPokemonIcon('meloetta-pirouette') + '" class="picon icon-right" title="Meloetta is PS\'s mascot! The Pirouette forme is Fighting-type, and represents our battles."></span>';
				this.$('.roomlisttop').html('<table class="roomcounters" border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td>' + leftSide + '</td><td>' + rightSide + '</td></tr></table>');
			}
			this.$('.roomlist').first().html('<h2 class="rooms-officialchatrooms">Official chat rooms</h2>' + _.map(rooms.official, this.renderRoomBtn).join("") +
				(rooms.pspl && rooms.pspl.length ? '<a href="https://www.smogon.com/forums/threads/3633257/" target="_blank"><h2 class="rooms-psplchatrooms">PSPL Winner</h2></a>' + _.map(rooms.pspl, this.renderRoomBtn).join("") : ''));
			this.$('.roomlist').last().html('<h2 class="rooms-chatrooms">Chat rooms</h2>' + _.map(rooms.chat.sort(this.compareRooms), this.renderRoomBtn).join(""));
		},
		roomlist: function () {
			app.joinRoom('battles');
		},
		closeHide: function () {
			app.sideRoom = app.curSideRoom = null;
			this.close();
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
	});

	this.BattlesRoom = Room.extend({
		minWidth: 320,
		maxWidth: 1024,
		type: 'battles',
		title: 'Battles',
		isSideRoom: true,
		events: {
			'change input[name=elofilter]': 'refresh'
		},
		initialize: function () {
			this.$el.addClass('ps-room-light').addClass('scrollable');
			var buf = '<div class="pad"><button class="button" style="float:right;font-size:10pt;margin-top:3px" name="close"><i class="fa fa-times"></i> Close</button><div class="roomlist"><p><button class="button" name="refresh"><i class="fa fa-refresh"></i> Refresh</button> <span style="' + Dex.getPokemonIcon('meloetta-pirouette') + ';display:inline-block;vertical-align:middle" class="picon" title="Meloetta is PS\'s mascot! The Pirouette forme is Fighting-type, and represents our battles."></span></p>';

			buf += '<p><label class="label">Format:</label><button class="select formatselect" name="selectFormat">(All formats)</button></p> <label><input type="checkbox" name="elofilter" value="1300" /> Elo 1300+</label>';
			buf += '<div class="list"><p>Loading...</p></div>';
			buf += '</div></div>';

			this.$el.html(buf);
			this.$list = this.$('.list');
			this.$refreshButton = this.$('button[name=refresh]');

			this.format = '';
			app.on('response:roomlist', this.update, this);
			app.send('/cmd roomlist');
			this.update();
		},
		selectFormat: function (format, button) {
			if (!window.BattleFormats) {
				return;
			}
			var self = this;
			app.addPopup(FormatPopup, {format: format, sourceEl: button, selectType: 'watch', onselect: function (newFormat) {
				self.changeFormat(newFormat);
			}});
		},
		changeFormat: function (format) {
			this.format = format;
			this.data = null;
			this.update();
			this.refresh();
		},
		focus: function (e) {
			if (e && $(e.target).closest('select, a').length) return;
			if (new Date().getTime() - this.lastUpdate > 60 * 1000) {
				this.refresh();
			}
			var prevPos = this.$el.scrollTop();
			this.$('button[name=refresh]').focus();
			this.$el.scrollTop(prevPos);
		},
		rejoin: function () {
			this.refresh();
		},
		renderRoomBtn: function (id, roomData, matches) {
			var format = (matches[1] || '');
			var formatBuf = '';
			if (roomData.minElo) formatBuf += '<small style="float:right">(' + (typeof roomData.minElo === 'number' ? 'rated: ' : '') + BattleLog.escapeHTML(roomData.minElo) + ')</small>';
			formatBuf += (format ? '<small>[' + BattleLog.escapeFormat(format) + ']</small><br />' : '');
			var roomDesc = formatBuf + '<em class="p1">' + BattleLog.escapeHTML(roomData.p1) + '</em> <small class="vs">vs.</small> <em class="p2">' + BattleLog.escapeHTML(roomData.p2) + '</em>';
			if (!roomData.p1) {
				matches = id.match(/[^0-9]([0-9]*)$/);
				roomDesc = formatBuf + 'empty room ' + matches[1];
			} else if (!roomData.p2) {
				roomDesc = formatBuf + '<em class="p1">' + BattleLog.escapeHTML(roomData.p1) + '</em>';
			}
			return '<div><a href="' + app.root + id + '" class="ilink">' + roomDesc + '</a></div>';
		},
		update: function (data) {
			if (!data && !this.data) {
				if (app.isDisconnected) {
					this.$list.html('<p>You are offline.</p>');
				} else {
					this.$list.html('<p>Loading...</p>');
				}
				return;
			}
			this.$('button[name=refresh]')[0].disabled = false;

			// Synchronize stored room data with incoming data
			if (data) this.data = data;
			var rooms = this.data.rooms;

			var buf = [];
			for (var id in rooms) {
				var roomData = rooms[id];
				var matches = ChatRoom.parseBattleID(id);
				// bogus room ID could be used to inject JavaScript
				if (!matches || this.format && matches[1] !== this.format) {
					continue;
				}
				buf.push(this.renderRoomBtn(id, roomData, matches));
			}

			if (!buf.length) return this.$list.html('<p>No ' + BattleLog.escapeFormat(this.format) + ' battles are going on right now.</p>');
			return this.$list.html('<p>' + buf.length + (buf.length === 100 ? '+' : '') + ' ' + BattleLog.escapeFormat(this.format) + ' ' + (buf.length === 1 ? 'battle' : 'battles') + '</p>' + buf.join(""));
		},
		refresh: function () {
			var elofilter = '';
			var $checkbox = this.$('input[name=elofilter]');
			if ($checkbox.is(':checked')) elofilter = ', ' + $checkbox.val();
			app.send('/cmd roomlist ' + this.format + elofilter);

			this.lastUpdate = new Date().getTime();
			// Prevent further refreshes until we get a response.
			this.$refreshButton[0].disabled = true;
		}
	});

}).call(this, jQuery);
