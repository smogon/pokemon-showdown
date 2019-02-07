(function ($) {

	var HTMLRoom = this.HTMLRoom = this.Room.extend({
		type: 'html',
		title: 'Page',
		initialize: function () {
			this.$el.addClass('ps-room-light').addClass('scrollable');
			this.$el.html('<div class="pad"><p>Page unavailable</p></div>');
		},
		send: function (data) {
			// HTML rooms don't actually exist server side, so send globally
			app.send(data);
		},
		receive: function (data) {
			this.add(data);
		},
		add: function (log) {
			if (typeof log === 'string') log = log.split('\n');
			for (var i = 0; i < log.length; i++) {
				this.addRow(log[i]);
			}
		},
		join: function () {
			app.send('/join ' + this.id);
		},
		leave: function () {
			app.send('/leave ' + this.id);
		},
		login: function () {
			app.addPopup(LoginPopup);
		},
		addRow: function (line) {
			if (!line || typeof line !== 'string') return;
			if (line.charAt(0) !== '|') line = '||' + line;
			var pipeIndex = line.indexOf('|', 1);
			var row;
			if (pipeIndex >= 0) {
				row = [line.slice(1, pipeIndex), line.slice(pipeIndex + 1)];
			} else {
				row = [line.slice(1), ''];
			}
			switch (row[0]) {
			case 'init':
				// ignore (handled elsewhere)
				break;

			case 'title':
				this.title = row[1];
				app.roomTitleChanged(this);
				app.topbar.updateTabbar();
				break;

			case 'pagehtml':
				this.$el.html(BattleLog.sanitizeHTML(row[1]));
				this.subtleNotifyOnce();
				break;

			case 'selectorhtml':
				var pipeIndex2 = row[1].indexOf('|');
				if (pipeIndex2 < 0) return;
				this.$(row[1].slice(0, pipeIndex2)).html(BattleLog.sanitizeHTML(row[1].slice(pipeIndex2 + 1)));
				this.subtleNotifyOnce();
				break;

			case 'notify':
				if (!Dex.prefs('mute') && Dex.prefs('notifvolume')) {
					soundManager.getSoundById('notif').setVolume(Dex.prefs('notifvolume')).play();
				}
				this.notifyOnce(row[1], row.slice(2).join('|'), 'highlight');
				break;

			case 'tempnotify':
				var notifyOnce = row[4] !== '!';
				if (!this.notifications && !Dex.prefs('mute') && Dex.prefs('notifvolume')) {
					soundManager.getSoundById('notif').setVolume(Dex.prefs('notifvolume')).play();
				}
				this.notify(row[2], row[3], row[1], notifyOnce);
				break;

			case 'tempnotifyoff':
				this.closeNotification(row[1]);
				break;

			}
		}
	});

	this.LadderRoom = HTMLRoom.extend({
		type: 'ladder',
		title: 'Ladder',
		initialize: function () {
			this.$el.addClass('ps-room-light').addClass('scrollable');
			app.on('init:formats', this.update, this);
			this.update();
			app.on('response:laddertop', function (data) {
				var buf = '<div class="ladder pad"><p><button name="selectFormat"><i class="fa fa-chevron-left"></i> Format List</button></p>';
				if (!data) {
					this.$el.html(buf + '<p>error</p></div>');
					return;
				}
				if (this.curFormat !== data[0]) return;
				buf += BattleLog.sanitizeHTML(data[1]) + '</div>';
				this.$el.html(buf);
			}, this);
		},
		curFormat: '',
		join: function () {},
		leave: function () {},
		update: function () {
			if (!this.curFormat) {
				var buf = '<div class="ladder pad"><p>See a user\'s ranking with <a class="button" href="//pokemonshowdown.com/users/" target="_blank">User lookup</a></p>' +
					//'<p><strong style="color:red">I\'m really really sorry, but as a warning: we\'re going to reset the ladder again soon to fix some more ladder bugs.</strong></p>' +
					'<p>(btw if you couldn\'t tell the ladder screens aren\'t done yet; they\'ll look nicer than this once I\'m done.)</p>' +
					'<p><button name="selectFormat" value="help" class="button"><i class="fa fa-info-circle"></i> How the ladder works</button></p><ul>';
				if (!window.BattleFormats) {
					this.$el.html('<div class="pad"><em>Loading...</em></div>');
					return;
				}
				var curSection = '';
				for (var i in BattleFormats) {
					var format = BattleFormats[i];
					if (!format.rated || !format.searchShow) continue;
					if (format.section && format.section !== curSection) {
						curSection = format.section;
						buf += '</ul><h3>' + BattleLog.escapeHTML(curSection) + '</h3><ul style="list-style:none;margin:0;padding:0">';
					}
					buf += '<li style="margin:5px"><button name="selectFormat" value="' + i + '" class="button" style="width:320px;height:30px;text-align:left;font:12pt Verdana">' + BattleLog.escapeFormat(format.id) + '</button></li>';
				}
				buf += '</ul></div>';
				this.$el.html(buf);
			} else if (this.curFormat === 'help') {
				this.showHelp();
			} else {
				var format = this.curFormat;
				var self = this;
				this.$el.html('<div class="ladder pad"><p><button name="selectFormat"><i class="fa fa-chevron-left"></i> Format List</button></p><p><em>Loading...</em></p></div>');
				if (app.localLadder) {
					app.send('/cmd laddertop ' + format);
				} else {
					$.get('/ladder.php', {
						format: format,
						server: Config.server.id.split(':')[0],
						output: 'html'
					}, function (data) {
						if (self.curFormat !== format) return;
						var buf = '<div class="ladder pad"><p><button name="selectFormat"><i class="fa fa-chevron-left"></i> Format List</button></p><p><button class="button" name="refresh"><i class="fa fa-refresh"></i> Refresh</button></p>';
						buf += '<h3>' + BattleLog.escapeFormat(format) + ' Top 500</h3>';
						buf += data + '</div>';
						self.$el.html(buf);
					}, 'html');
				}
			}
		},
		showHelp: function () {
			var buf = '<div class="ladder pad"><p><button name="selectFormat"><i class="fa fa-chevron-left"></i> Format List</button></p>';
			buf += '<h3>How the ladder works</h3>';
			buf += '<p>Our ladder displays three ratings: Elo, GXE, and Glicko-1.</p>';
			buf += '<p><strong>Elo</strong> is the main ladder rating. It\'s a pretty normal ladder rating: goes up when you win and down when you lose.</p>';
			buf += '<p><strong>GXE</strong> (Glicko X-Act Estimate) is an estimate of your win chance against an average ladder player.</p>';
			buf += '<p><strong>Glicko-1</strong> is a different rating system. It has rating and deviation values.</p>';
			buf += '<p>Note that win/loss should not be used to estimate skill, since who you play against is much more important than how many times you win or lose. Our other stats like Elo and GXE are much better for estimating skill.</p>';
			buf += '</div>';
			this.$el.html(buf);
		},
		selectFormat: function (format) {
			this.curFormat = format;
			this.update();
		},
		refresh: function () {
			this.$('button[name=refresh]').addClass('disabled').prop('disabled', true);
			this.update();
		}
	});

}).call(this, jQuery);
