exports.commands = {
	donate: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<center>Like this server and want to help keep the server running?<br /><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4PHAVXW3SHVCG"><img src="https://www.paypalobjects.com/en_AU/i/btn/btn_donate_SM.gif" /></a><br />Donations over $5 will get you a custom avatar! The money will go towards paying for the server.<br />After you\'ve donated, PM kupo, pika or kota to receive your avatar</center>');
	},

	forum: 'forums',
	forums: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('TBT\'s forums are located <a href="http://thebattletower.xiaotai.org/">here</a>.');
	},

	league: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('TBT\'s Pokemon League can be found <a href="http://thebattletower.xiaotai.org/forumdisplay.php?fid=8">here</a>.<br />'+
				  'Current Champion: None <br />'+
				  'Beat the League and get your own custom avatar!');
	},

	kupkup: function (target, room, user) {
		return this.parse("/me does THE KUPKUP CHANT: ♪kupo kupo kupochu~♫");
	},
	slap: function (target, room, user) {
		return this.parse("/me slaps " + target + " with a large trout.");
	},
	dk: 'dropkick',
	dropkick: function (target, room, user) {
		return this.parse("/me dropkicks " + target + " across the Pokémon Stadium!");
	},
	punt: function (target, room, user) {
		return this.parse("/me punts " + target + " to the moon!");
	},
	hug: function (target, room, user) {
		return this.parse("/me hugs " + target + ".");
	},
	poke: function (target, room, user) {
		return this.parse("/me pokes " + target + ".");
	},
	crai: 'cry',
	cry: function (target, room, user) {
		return this.parse("/me starts tearbending dramatically like Katara.");
	},
	pet: function (target, room, user) {
		return this.parse("/me pets " + target + ".");
	}
};
