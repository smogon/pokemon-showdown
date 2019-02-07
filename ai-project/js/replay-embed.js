window.exports = window;

function linkStyle(url) {
	var linkEl = document.createElement('link');
	linkEl.rel = 'stylesheet';
	linkEl.href = url;
	document.head.appendChild(linkEl);
}
function requireScript(url) {
	var scriptEl = document.createElement('script');
	scriptEl.src = url;
	document.head.appendChild(scriptEl);
}

linkStyle('https://play.pokemonshowdown.com/style/font-awesome.css?');
linkStyle('https://play.pokemonshowdown.com/style/battle.css?a7');
linkStyle('https://play.pokemonshowdown.com/style/replay.css?a7');

requireScript('https://play.pokemonshowdown.com/js/lib/jquery-1.11.0.min.js');
requireScript('https://play.pokemonshowdown.com/js/lib/lodash.compat.js');
requireScript('https://play.pokemonshowdown.com/js/lib/html-sanitizer-minified.js');
requireScript('https://play.pokemonshowdown.com/js/lib/soundmanager2-nodebug-jsmin.js');
requireScript('https://play.pokemonshowdown.com/js/config.js?a7');
requireScript('https://play.pokemonshowdown.com/js/battledata.js?a7');
requireScript('https://play.pokemonshowdown.com/data/pokedex-mini.js?a7');
requireScript('https://play.pokemonshowdown.com/data/pokedex-mini-bw.js?a7');
requireScript('https://play.pokemonshowdown.com/data/graphics.js?a7');
requireScript('https://play.pokemonshowdown.com/js/battle.js?a7');

var Replays = {
	init: function (log) {
		this.$el = $('.wrapper');

		var self = this;
		this.$el.on('click', '.chooser button', function (e) {
			self.clickChangeSetting(e);
		});
		this.$el.on('click', 'button', function (e) {
			var action = $(e.currentTarget).data('action');
			if (action) self[action]();
		});

		this.battle = new Battle(this.$('.battle'), this.$('.battle-log'));
		//this.battle.preloadCallback = updateProgress;
		this.battle.errorCallback = this.errorCallback.bind(this);
		this.battle.resumeButton = this.resume.bind(this);

		this.setlog(log);
	},
	setlog: function (log) {
		this.battle.setQueue(log.split('\n'));

		this.battle.reset();
		this.battle.fastForwardTo(0);
		this.$('.battle').append('<div class="playbutton"><button data-action="start"><i class="fa fa-play"></i> Play</button><br /><br /><button data-action="startMuted" class="startsoundchooser" style="font-size:10pt;display:none">Play (music off)</button></div>');

		this.$('.replay-controls-2').html('<div class="chooser leftchooser speedchooser"> <em>Speed:</em> <div><button class="sel" value="fast">Fast</button><button value="normal">Normal</button><button value="slow">Slow</button><button value="reallyslow">Really Slow</button></div> </div> <div class="chooser colorchooser"> <em>Color&nbsp;scheme:</em> <div><button class="sel" value="light">Light</button><button value="dark">Dark</button></div> </div> <div class="chooser soundchooser" style="display:none"> <em>Music:</em> <div><button class="sel" value="on">On</button><button value="off">Off</button></div> </div>');

		// this works around a WebKit/Blink bug relating to float layout
		var rc2 = this.$('.replay-controls-2')[0];
		if (rc2) rc2.innerHTML = rc2.innerHTML;

		if (window.soundManager && soundManager.ready) this.soundReady();
		this.reset();
	},
	"$": function (sel) {
		return this.$el.find(sel);
	},
	soundReady: function () {
		if (Replays.isSoundReady) return;
		Replays.isSoundReady = true;
		$('.soundchooser, .startsoundchooser').show();
	},
	clickChangeSetting: function (e) {
		e.preventDefault();
		var $chooser = $(e.currentTarget).closest('.chooser');
		var value = e.currentTarget.value;
		this.changeSetting($chooser, value, $(e.currentTarget));
	},
	changeSetting: function (type, value, valueElem) {
		var $chooser;
		if (typeof type === 'string') {
			$chooser = this.$('.' + type + 'chooser');
		} else {
			$chooser = type;
			type = '';
			if ($chooser.hasClass('colorchooser')) {
				type = 'color';
			} else if ($chooser.hasClass('soundchooser')) {
				type = 'sound';
			} else if ($chooser.hasClass('speedchooser')) {
				type = 'speed';
			}
		}
		if (!valueElem) valueElem = $chooser.find('button[value=' + value + ']');

		$chooser.find('button').removeClass('sel');
		valueElem.addClass('sel');

		switch (type) {
		case 'color':
			if (value === 'dark') {
				$(document.body).addClass('dark');
			} else {
				$(document.body).removeClass('dark');
			}
			break;

		case 'sound':
			var muteTable = {
				on: false, // this is kind of backwards: sound[on] === muted[false]
				off: true
			};
			this.battle.setMute(muteTable[value]);
			this.$('.startsoundchooser').remove();
			break;

		case 'speed':
			var speedTable = {
				fast: 8,
				normal: 800,
				slow: 2500,
				reallyslow: 5000
			};
			this.battle.messageDelay = speedTable[value];
			break;
		}
	},
	battle: null,
	errorCallback: function () {
		var replayid = this.$('input[name=replayid]').val();
		var m = /^([a-z0-9]+)-[a-z0-9]+-[0-9]+$/.exec(replayid);
		if (m) {
			this.battle.log('<hr /><div class="chat">This replay was uploaded from a third-party server (<code>' + BattleLog.escapeHTML(m[1]) + '</code>). It contains errors and cannot be viewed.</div><div class="chat">Replays uploaded from third-party servers can contain errors if the server is running custom code, or the server operator has otherwise incorrectly configured their server.</div>', true);
			this.battle.pause();
		}
	},
	pause: function () {
		this.$('.replay-controls').html('<button data-action="play"><i class="fa fa-play"></i> Play</button><button data-action="reset"><i class="fa fa-undo"></i> Reset</button> <button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button><button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button> <button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button> <button data-action="switchSides"><i class="fa fa-random"></i> Switch sides</button>');
		this.battle.pause();
	},
	play: function () {
		this.$('.battle .playbutton').remove();
		this.$('.replay-controls').html('<button data-action="pause"><i class="fa fa-pause"></i> Pause</button><button data-action="reset"><i class="fa fa-undo"></i> Reset</button> <button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button><button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button> <button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button> <button data-action="switchSides"><i class="fa fa-random"></i> Switch sides</button>');
		this.battle.play();
	},
	resume: function () {
		this.play();
	},
	reset: function () {
		this.battle.reset();
		this.battle.fastForwardTo(0);
		this.$('.battle').append('<div class="playbutton"><button data-action="start"><i class="fa fa-play"></i> Play</button><br /><br /><button data-action="startMuted" class="startsoundchooser" style="font-size:10pt;display:none">Play (music off)</button></div>');
		// this.$('.battle-log').html('');
		this.$('.replay-controls').html('<button data-action="start"><i class="fa fa-play"></i> Play</button><button data-action="reset" disabled="disabled"><i class="fa fa-undo"></i> Reset</button>');
	},
	ff: function () {
		this.battle.skipTurn();
	},
	rewind: function () {
		if (this.battle.turn) {
			this.battle.fastForwardTo(this.battle.turn - 1);
		}
	},
	ffto: function () {
		this.battle.fastForwardTo(prompt('Turn?'));
	},
	switchSides: function () {
		this.battle.switchSides();
	},
	start: function () {
		this.battle.reset();
		this.battle.play();
		this.$('.replay-controls').html('<button data-action="pause"><i class="fa fa-pause"></i> Pause</button><button data-action="reset"><i class="fa fa-undo"></i> Reset</button> <button data-action="rewind"><i class="fa fa-step-backward"></i> Last turn</button><button data-action="ff"><i class="fa fa-step-forward"></i> Next turn</button> <button data-action="ffto"><i class="fa fa-fast-forward"></i> Go to turn...</button> <button data-action="switchSides"><i class="fa fa-random"></i> Switch sides</button>');
	},
	startMuted: function () {
		this.changeSetting('sound', 'off');
		this.start();
	}
};

window.onload = function () {
	Replays.init((this.$('script.battle-log-data').text() || '').replace(/\\\//g, '/'));
};
