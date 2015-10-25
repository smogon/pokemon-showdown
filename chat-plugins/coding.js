if (!Users.User.prototype._getIdentity_Coding) Users.User.prototype._getIdentity_Coding = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	var name = this._getIdentity_Coding(roomid);
	if (this.isCoding) name += " - \u24B8\u24DE\u24D3\u24D8\u24DD\u24D6";
	return name;
};

exports.commands = {
	back: 'coding',
	idle: 'coding',
	away: function (target, room, user) {
		user.isCoding = !user.isCoding;
		user.updateIdentity();
		this.sendReply("You are " + (user.isCoding ? "now" : "no longer") + " Coding.");
	}
};
