var Users = Object.create(null);
var users = Users.users = new Map();
var getUser = Users.get = function (username) {
	var userid = toId(username);
	return users.get(userid);
};	
var addUser = Users.add = function (username, room) {
	var user = getUser(username);
	if (user) return user;
	user = new User(username, room);
	users.set(user.id, user);
	return user;
};

class User {
	constructor(username, roomid) {
		this.name = username.substr(1);
		this.id = toId(this.name);
		this.isSelf = (this.id === toId(Config.nick));
		this.isExcepted = Config.excepts.includes(this.id);
		this.isWhitelisted = Config.whitelist.includes(this.id);
		this.isRegexWhitelisted = Config.regexautobanwhitelist.includes(this.id);
		this.rooms = new Map();
		if (roomid) this.rooms.set(roomid, username.charAt(0));
	}

	hasRank(room, tarGroup) {
		if (this.isExcepted) return true;
		var group = room.users.get(this.id);
		return Config.groups.indexOf(group) >= Config.groups.indexOf(tarGroup);
	}

	destroy() {
		users.delete(this.id);
	}
}

Users.self = addUser(' ' + Config.nick);
module.exports = Users;
