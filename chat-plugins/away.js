if (!Users.User.prototype._getIdentity_away) Users.User.prototype._getIdentity_away = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	var name = this._getIdentity_away(roomid);
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

if (!Users.User.prototype._getIdentity_Coding) Users.User.prototype._getIdentity_Coding = Users.User.prototype.getIdentity;
Users.User.prototype.getIdentity = function (roomid) {
	var name = this._getIdentity_Coding(roomid);
	if (this.isCoding) name += " - \u24B8\u24DE\u24D3\u24D8\u24DD\u24D6";
	return name;
};

exports.commands = {
	back: 'Coding',
	idle: 'Coding',
	away: function (target, room, user) {
		user.isCoding = !user.isCoding;
		user.updateIdentity();
		this.sendReply("You are " + (user.isCoding ? "now" : "no longer") + " Coding.");
	}
};
