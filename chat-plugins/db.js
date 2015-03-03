var fs = require('fs');

exports.commands = {
	downloadpic: function (target, room, user) {
		if (!this.can('hotpatch')) return false;

		target = ('' + target).split(',');
		if (target.length !== 2) return this.sendReply("Usage: /dowloadpic url,savedir");
		try {
			require('needle').get(target[0]).pipe(fs.createWriteStream(target[1]));
		} catch (e) {
			this.popupReply("Failed download: " + e);
		}
	},
	setavatar: function (target, room, user) {
		if (!this.can('hotpatch')) return false;

		target = ('' + target).split(',');
		if (target.length !== 3) return this.sendReply("Usage: /setavatar userid,url,extension");
		var userid = toId(target[0]),
		    url = target[1],
		    ext = toId(target[2]);
		const exts = {
			'jpg': 'jpg',
			'jpeg': 'jpg',
			'gif': 'gif',
			'png': 'png'
		};
		if (!exts[ext]) return this.sendReply("Invalid extension: valid ones are jpg, png, gif");

		var avFile = userid + '.' + ext;
		try {
			require('needle').get(target[0]).pipe(fs.createWriteStream('config/avatars/' + avFile));
			this.parse('/bash cp config/avatars/' + avFile + ' $OPENSHIFT_DATA_DIR' + avFile);
			this.sendReply('"' + userid + '": "' + userid + '.' + ext + '"');
		} catch (e) {
			this.popupReply("Failed download: " + e);
		}
	},
	reloadcustforms: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		var callback = function (status, resp) {
			this.sendReply(status);
			if (status === 'error') {
				try {
					this.sendReply('>> ' + resp);
				} catch (e) {}
			}
			room.update();
		}.bind(this);
		rhcApp.downloadfile('http://pastebin.com/raw.php?i=HDmZqYyz', './config/customformats.js', callback);
	}
};
