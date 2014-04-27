var spamroom = Rooms.get('spamroom');
if (!spamroom) {
	Rooms.global.addChatRoom('Spam Room');
	spamroom = Rooms.get('spamroom');
	spamroom.isPrivate = true;
	spamroom.staffRoom = true;
	if (spamroom.chatRoomData) {
		spamroom.chatRoomData.isPrivate = true;
		spamroom.chatRoomData.staffRoom = true;
		spamroom.addedUsers = spamroom.chatRoomData.addedUsers = {};
		Rooms.global.writeChatRoomData();
	} else {
		spamroom.addedUsers = {};
	}
}
if (Object.size(spamroom.addedUsers) > 0)
	spamroom.add("||Loaded user list: " + Object.keys(spamroom.addedUsers).sort().join(", "));
exports.room = spamroom;

function getAllAlts(user) {
	var targets = {};
	if (typeof user === 'string')
		targets[toId(user)] = 1;
	else
		user.getAlts().concat(user.name).forEach(function (alt) {
			targets[toId(alt)] = 1;
			Object.keys(Users.get(alt).prevNames).forEach(function (name) {
				targets[toId(name)] = 1;
			});
		});
	return targets;
}

exports.addUser = function (user) {
	var targets = getAllAlts(user);
	for (var u in targets)
		if (spamroom.addedUsers[u])
			delete targets[u];
		else
			spamroom.addedUsers[u] = 1;
	Rooms.global.writeChatRoomData();

	targets = Object.keys(targets).sort();
	if (targets.length > 0)
		spamroom.add("||Added users: " + targets.join(", "));
	return targets;
};

exports.removeUser = function (user) {
	var targets = getAllAlts(user);
	for (var u in targets)
		if (!spamroom.addedUsers[u])
			delete targets[u];
		else
			delete spamroom.addedUsers[u];
	Rooms.global.writeChatRoomData();

	targets = Object.keys(targets).sort();
	if (targets.length > 0)
		spamroom.add("||Removed users: " + targets.join(", "));
	return targets;
};

exports.isSpamroomed = function (user) {
	var targets = getAllAlts(user);
	if (Object.keys(targets).intersect(Object.keys(spamroom.addedUsers)).length === 0)
		return false;

	var addedUsers = {};
	Array.prototype.exclude.apply(Object.keys(targets), Object.keys(spamroom.addedUsers)).forEach(function (user) {
		if (spamroom.addedUsers[user])
			return;
		spamroom.addedUsers[user] = addedUsers[user] = 1;
	});

	if (Object.size(addedUsers) > 0) {
		Rooms.global.writeChatRoomData();
		spamroom.add("||Alts automatically added: " + Object.keys(addedUsers).sort().join(", "));
	}

	return true;
};
