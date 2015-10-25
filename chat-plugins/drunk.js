if (!Users.User.prototype._getIdentity_Drunk) Users.User.prototype._getIdentity_Drunk = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	var name = this._getIdentity_Drunk(roomid);
	if (this.isDrunk) name += " - \u24B9\u24E1\u24E4\u24DD\u24C0";
	return name;
};

exports.commands = {
	back: 'drunk',
	idle: 'drunk',
	away: function (target, room, user) {
		user.isDrunk = !user.isDrunk;
		user.updateIdentity();
		this.sendReply("You are " + (user.isDrunk ? "now" : "no longer") + " Drunk.");
	}
};
