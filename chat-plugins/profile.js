var color = require('../config/color');
var fs = require('fs');
var moment = require('moment');

var BR = '<br>';
var SPACE = '&nbsp;';
var profileColor = '#24678d';
var trainersprites = [1, 2, 101, 102, 169, 170, 265, 266, 168];

/**
 * Profile constructor.
 *
 * @param {Boolean} isOnline
 * @param {Object|String} user - if isOnline then Object else String
 * @param {String} image
 */
function Profile(isOnline, user, image) {
	this.isOnline = isOnline || false;
	this.user = user || null;
	this.image = image;

	this.username = Tools.escapeHTML(this.isOnline ? this.user.name : this.user);
	this.url = Config.avatarurl || '';
}

/**
 * Create an bold html tag element.
 *
 * Example:
 * createFont('Hello World!');
 * => '<b>Hello World!</b>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function bold(text) {
	return '<b>' + text + '</b>';
}

/**
 * Create an font html tag element.
 *
 * Example:
 * createFont('Hello World!', 'blue');
 * => '<font color="blue">Hello World!</font>'
 *
 * @param {String} color
 * @param {String} text
 * @return {String}
 */
function font(color, text) {
	return '<font color="' + color + '">' + text + '</font>';
}

/**
 * Create an img tag element.
 *
 * Example:
 * createImg('phil.png');
 * => '<img src="phil.png" height="80" width="80" align="left">'
 *
 * @param {String} link
 * @return {String}
 */
function img(link) {
	return '<img src="' + link + '" height="80" width="80" align="left">';
}

/**
 * Create a font html element wrap around by a bold html element.
 * Uses to `profileColor` as a color.
 * Adds a colon at the end of the text and a SPACE at the end of the element.
 *
 * Example:
 * label('Name');
 * => '<b><font color="#24678d">Name:</font></b> '
 *
 * @param {String} text
 * @return {String}
 */
function label(text) {
	return bold(font(profileColor, text + ':')) + SPACE;
}

function currencyName(amount) {
	var name = " buck";
	return amount === 1 ? name : name + "s";
}

Profile.prototype.avatar = function () {
	if (this.isOnline) {
		if (typeof this.image === 'string') return img(this.url + '/avatars/' + this.image);
		return img('http://play.pokemonshowdown.com/sprites/trainers/' + this.image + '.png');
	}
	for (var name in Config.customAvatars) {
		if (this.username === name) {
			return img(this.url + '/avatars/' + Config.customAvatars[name]);
		}
	}
	var selectedSprite = trainersprites[Math.floor(Math.random() * trainersprites.length)];
	return img('http://play.pokemonshowdown.com/sprites/trainers/' + selectedSprite + '.png');
};

Profile.prototype.group = function () {
	if (this.isOnline && this.user.group === ' ') return label('Group') + 'Regular User';
	if (this.isOnline) return label('Group') + Config.groups[this.user.group].name;
	for (var name in Users.usergroups) {
		if (toId(this.username) === name) {
			return label('Group') + Config.groups[Users.usergroups[name].charAt(0)].name;
		}
	}
	return label('Group') + 'Regular User';
};

Profile.prototype.money = function (amount) {
	return label('Money') + amount + currencyName(amount);
};

Profile.prototype.name = function () {
	return label('Name') + bold(font(color(toId(this.username)), this.username));
};

Profile.prototype.seen = function (timeAgo) {
	if (this.isOnline) return label('Last Seen') + font('#2ECC40', 'Currently Online');
	if (!timeAgo) return label('Last Seen') + 'Never';
	return label('Last Seen') + moment(timeAgo).fromNow();
};

Profile.prototype.show = function (callback) {
	var userid = toId(this.username);

	Database.read('money', userid, function (err, money) {
		if (err) throw err;
		if (!money) money = 0;
		return callback(this.avatar() +
										SPACE + this.name() + BR +
										SPACE + this.group() + BR +
										SPACE + this.money(money) + BR +
										SPACE + this.seen(Seen[userid]) +
										'<br clear="all">');
	}.bind(this));
};

exports.commands = {
	profile: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (target.length >= 19) return this.sendReply("Usernames are required to be less than 19 characters long.");
		var targetUser = this.targetUserOrSelf(target);
		var profile;
		if (!targetUser) {
			profile = new Profile(false, target);
		} else {
			profile = new Profile(true, targetUser, targetUser.avatar);
		}
		profile.show(function (display) {
			this.sendReplyBox(display);
			room.update();
		}.bind(this));
	},
	profilehelp: ["/profile -	Shows information regarding user's name, group, money, and when they were last seen."]
};
