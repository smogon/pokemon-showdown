/*Custom Avatar script. ~SilverTactic (Siiilver)*/
var fs = require('fs');
var path = require('path');

function hasAvatar (user) {
	if (Config.customavatars[toId(user)] && fs.existsSync('config/avatars/' + Config.customavatars[toId(user)])) 
		return Config.customavatars[toId(user)];
	return false;
}

function loadAvatars() {
	var formatList = ['.png', '.gif', '.jpeg', '.jpg'];
	fs.readdirSync('config/avatars')
	.filter(function (avatar) {
		return formatList.indexOf(path.extname(avatar)) > -1;
	})
	.forEach(function (avatar) {
		Config.customavatars[path.basename(avatar, path.extname(avatar))] = avatar;
	});
}
loadAvatars();

if (Config.watchconfig) {
	fs.watchFile(path.resolve(__dirname, 'config/config.js'), function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		loadAvatars();
	});
}

var cmds = {
	'': 'help',
	help: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox('<b>Custom Avatar commands</b><br>' +
			'(All commands require ~)<br><br>' +
			'<li>/ca set <small>or</small> /setavatar <em>User</em>, <em>URL</em> - Sets a user\'s custom avatar to the specified image URL.' +
			'<li>/ca delete <small>or</small> /deleteavatar <em>User</em> - Deletes a user\'s custom avatar.' +
			'<li>/ca move <small>or</small> /moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.'
		);
	},

	add: 'set',
	set: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target) return this.sendReply('|html|/ca set <em>User</em>, <em>URL</em> - Sets a user\'s custom avatar to the specified image.');
		target = target.split(',');
		if (target.length < 2)  return this.sendReply('|html|/ca set <em>User</em>, <em>URL</em> - Sets a user\'s custom avatar to the specified image.');

		var targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];
		var link = target[1].trim();
		if (!link.match(/^https?:\/\//i)) link = 'http://' + link;
		
		var allowedFormats = ['png', 'jpg', 'jpeg', 'gif'];
		new Promise (function (resolve, reject) {
			require("request").get(link)
				.on('error', function (err) {
					console.log(err);
					reject("Avatar unavailable. Try choosing a different one.");
				})
				.on('response', function (response) {
					if (response.statusCode !== 200) reject('Avatar unavailable. Try choosing a different one.');
					var type = response.headers['content-type'].split('/');
					if (type[0] !== 'image') reject('Link is not an image link.');
					if (!~allowedFormats.indexOf(type[1])) reject('Format not supported. The supported formats are ' + allowedFormats.join(', '));

					if (hasAvatar(targetUser)) fs.unlinkSync('config/avatars/' + Config.customavatars[toId(targetUser)]);
					var file = toId(targetUser) + '.' + type[1];
					response.pipe(fs.createWriteStream('config/avatars/' + file));
					resolve(file);
				});
		})
		.then(function (file) {
			Config.customavatars[toId(targetUser)] = file;
			var getUser = Users.getExact(targetUser);
			if (getUser) getUser.avatar = file;

			var desc = 'custom avatar has been set to <br><div style = "width: 80px; height: 80px; display: block"><img src = "' + link + '" style = "max-height: 100%; max-width: 100%"></div>';
			this.sendReply('|html|' + targetUser + '\'s ' + desc);
			if (getUser) {
				getUser.send('|html|' + user.name + ' set your custom avatar. Refresh your page if you don\'t see it.');
				getUser.popup('|html|<center>Your ' + desc + '<br>Refresh your page if you don\'t see it under your username.</center>');
			}
		}.bind(this))
		.catch (function (err) {
			this.errorReply('Error setting ' + targetUser + '\'s avatar: ' + err);
		}.bind(this));
	},

	remove: 'delete',
	'delete': function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/' + cmd + ' <em>User</em> - Deletes a user\'s custom avatar.');
		target = Users.getExact(target) ? Users.getExact(target).name : target;
		var avatars = Config.customavatars;
		if (!hasAvatar(target)) return this.errorReply(target + ' does not have a custom avatar.');

		fs.unlinkSync('config/avatars/' + avatars[toId(target)]);
		delete avatars[toId(target)];
		this.sendReply(target + '\'s custom avatar has been successfully removed.');
		if (Users.getExact(target)) {
			Users.getExact(target).send('Your custom avatar has been removed.');
			Users.getExact(target).avatar = 1;
		}
	},
	
	shift: 'move',
	move: function (target, room, user, connection, cmd) {
		if (!this.can('hotpatch')) return false;
		if (!target || !target.trim()) return this.sendReply('|html|/moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.');
		target = target.split(',');
		if (target.length < 2) return this.sendReply('|html|/moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.');

		var user1 = (Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0]);
		var user2 = (Users.getExact(target[1]) ? Users.getExact(target[1]).name : target[1]);
		if (!toId(user1) || !toId(user2)) return this.sendReply('|html|/moveavatar <em>User 1</em>, <em>User 2</em> - Moves User 1\'s custom avatar to User 2.');
		var user1Av = hasAvatar(user1);
		var user2Av = hasAvatar(user2);
		if (!user1Av) return this.errorReply(user1 + ' does not have a custom avatar.');

		var avatars = Config.customavatars;
		if (hasAvatar(user2)) fs.unlinkSync('config/avatars/' + user2Av);
		var newAv = toId(user2) + path.extname(user1Av);
		fs.renameSync('config/avatars/' + user1Av, 'config/avatars/' + newAv);
		delete avatars[toId(user1)];
		avatars[toId(user2)] = newAv;
		if (Users.getExact(user1)) Users.getExact(user1).avatar = 1;
		if (Users.getExact(user2)) {
			Users.getExact(user2).avatar = newAv;
			Users.getExact(user2).send(user.name + ' has moved ' + user1 + '\'s custom avatar to you. Refresh your page if you don\'t see it under your username.');
		}
		return this.sendReply('Successfully moved ' + user1 + '\'s custom avatar to ' + user2 + '.');
	}
};

exports.commands = {
	ca: 'customavatar',
	customavatar: cmds,
	moveavatar: cmds.move,
	deleteavatar: 'removeavatar',
	removeavatar: cmds.delete,
	setavatar: cmds.set
}
