if (!Users.User.prototype._getIdentity_Dead) Users.User.prototype._getIdentity_Dead = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	var name = this._getIdentity_Dead(roomid);
	if (this.isDead) name += " - \u24B9\u24D4\u24D0\u24B9";
	return name;
};

exports.commands = {
	back: 'dead',
	idle: 'dead',
	away: function (target, room, user) {
		user.isDead = !user.isDead;
		user.updateIdentity();
		this.sendReply("You are " + (user.isDead ? "now" : "no longer") + " Dead.");
	}
};
