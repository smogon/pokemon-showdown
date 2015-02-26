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
	}
};
