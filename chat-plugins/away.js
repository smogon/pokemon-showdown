'use strict';

if (!Users.User.prototype._getIdentity_away) Users.User.prototype._getIdentity_away = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	let name = this._getIdentity_away(roomid);
	if (this.isAway) name += " - \u0410\u051d\u0430\u0443";
	return name;
};

exports.commands = {
	back: 'away',
	idle: 'away',
	away: function (target, room, user) {
		user.isAway = !user.isAway;
		user.updateIdentity();
		this.sendReply("You are " + (user.isAway ? "now" : "no longer") + " away.");
	}
};
