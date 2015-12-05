'use strict';

let fs = require('fs');

function reloadCustomAvatars() {
	let path = require('path');
	let newCustomAvatars = {};
	fs.readdirSync('./config/avatars').forEach(function (file) {
		let ext = path.extname(file);
		if (ext !== '.png' && ext !== '.gif') {
			return;
		}

		let user = toId(path.basename(file, ext));
		newCustomAvatars[user] = file;
		delete Config.customAvatars[user];
	});

	// Make sure the manually entered avatars exist
	for (let a in Config.customAvatars) {
		if (typeof Config.customAvatars[a] === 'number') {
			newCustomAvatars[a] = Config.customAvatars[a];
		} else {
			fs.exists('./config/avatars/' + Config.customAvatars[a], function (user, file, isExists) {
				if (isExists) {
					Config.customAvatars[user] = file;
				}
			}.bind(null, a, Config.customAvatars[a]));
		}
	}

	Config.customAvatars = newCustomAvatars;
}
reloadCustomAvatars();

if (Config.watchConfig) {
	fs.watchFile('./config/config.js', function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		reloadCustomAvatars();
	});
}

const script = function () {/*
	FILENAME=`mktemp`
	function cleanup {
		rm -f $FILENAME
	}
	trap cleanup EXIT

	set -xe

	timeout 10 wget "$1" -nv -O $FILENAME

	FRAMES=`identify $FILENAME | wc -l`
	if [ $FRAMES -gt 1 ]; then
		EXT=".gif"
	else
		EXT=".png"
	fi

	timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
*/
}.toString().match(/[^]*\/\*([^]*)\*\//)[1];

let pendingAdds = {};

exports.commands = {
	customavatars: 'customavatar',
	customavatar: function (target) {
		let parts = target.split(',');
		let cmd = parts[0].trim().toLowerCase();

		if (cmd in {'':1, show:1, view:1, display:1}) {
			let message = "";
			for (let a in Config.customAvatars)
				message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customAvatars[a]) + "<br />";
			return this.sendReplyBox(message);
		}

		if (!this.can('customavatar')) return false;

		switch (cmd) {
		case 'set': {
			let userid = toId(parts[1]);
			let user = Users.getExact(userid);
			let avatar = parts.slice(2).join(',').trim();

			if (!userid) return this.sendReply("You didn't specify a user.");
			if (Config.customAvatars[userid]) return this.sendReply(userid + " already has a custom avatar.");

			let hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
			pendingAdds[hash] = {userid: userid, avatar: avatar};
			parts[1] = hash;

			if (!user) {
				this.sendReply("Warning: " + userid + " is not online.");
				this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
				return;
			}
		}

			/* falls through */
		case 'forceset': {
			let hash = parts[1].trim();
			if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");

			let userid = pendingAdds[hash].userid;
			let avatar = pendingAdds[hash].avatar;
			delete pendingAdds[hash];

			require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], function (e, out, err) {
				if (e) {
					this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
					(out + err).split('\n').forEach(this.sendReply.bind(this));
					return;
				}

				reloadCustomAvatars();

				let user = Users.getExact(userid);
				if (user) user.avatar = Config.customAvatars[userid];

				this.sendReply(userid + "'s custom avatar has been set.");
			}.bind(this));
			break;
		}

		case 'delete': {
			let userid = toId(parts[1]);
			if (!Config.customAvatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");

			if (Config.customAvatars[userid].toString().split('.').slice(0, -1).join('.') !== userid) {
				return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") cannot be removed with this script.");
			}

			let user = Users.getExact(userid);
			if (user) user.avatar = 1;

			fs.unlink('./config/avatars/' + Config.customAvatars[userid], function (e) {
				if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") could not be removed: " + e.toString());

				delete Config.customAvatars[userid];
				this.sendReply(userid + "'s custom avatar removed successfully");
			}.bind(this));
			break;
		}

		default:
			return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
		}
	}
};
