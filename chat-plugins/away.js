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
	back: 'coding',
	idle: 'coding',
	away: function (target, room, user) {
		user.isCoding = !user.isCoding;
		user.updateIdentity();
		this.sendReply("You are " + (user.isCoding ? "now" : "no longer") + " Coding.");
	}
};

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
