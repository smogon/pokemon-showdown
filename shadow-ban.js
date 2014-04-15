const roomName = "Shadow Ban Room";
var room = Rooms.get(toId(roomName));
if (!room) {
	Rooms.global.addChatRoom(roomName);
	room = Rooms.get(toId(roomName));
	room.isPrivate = true;
	room.staffRoom = true;
	if (room.chatRoomData) {
		room.chatRoomData.isPrivate = true;
		room.chatRoomData.staffRoom = true;
		room.addedUsers = room.chatRoomData.addedUsers = {};
		Rooms.global.writeChatRoomData();
	} else {
		room.addedUsers = {};
	}
}
if (Object.size(room.addedUsers) > 0) {
	setImmediate(room.add.bind(room, "||Loaded user list: " + Object.keys(room.addedUsers).sort().join(", ")));
}
exports.room = room;

function getAllAlts(user) {
	var targets = {};
	if (typeof user === 'string') {
		targets[toId(user)] = 1;
	} else {
		user.getAlts().concat(user.name).forEach(function (alt) {
			targets[toId(alt)] = 1;
			Object.keys(Users.get(alt).prevNames).forEach(function (name) {
				targets[toId(name)] = 1;
			});
		});
	}
	return targets;
}

exports.addUser = function (user) {
	var targets = getAllAlts(user);
	for (var u in targets) {
		if (room.addedUsers[u]) {
			delete targets[u];
		} else {
			room.addedUsers[u] = 1;
		}
	}
	Rooms.global.writeChatRoomData();

	targets = Object.keys(targets).sort();
	if (targets.length > 0) {
		room.add("||Added users: " + targets.join(", "));
	}
	return targets;
};

exports.removeUser = function (user) {
	var targets = getAllAlts(user);
	for (var u in targets) {
		if (!room.addedUsers[u]) {
			delete targets[u];
		} else {
			delete room.addedUsers[u];
		}
	}
	Rooms.global.writeChatRoomData();

	targets = Object.keys(targets).sort();
	if (targets.length > 0) {
		room.add("||Removed users: " + targets.join(", "));
	}
	return targets;
};

exports.isShadowBanned = function (user) {
	var targets = getAllAlts(user);
	if (Object.keys(targets).intersect(Object.keys(room.addedUsers)).length === 0) return false;

	var addedUsers = {};
	Array.prototype.exclude.apply(Object.keys(targets), Object.keys(room.addedUsers)).forEach(function (user) {
		if (room.addedUsers[user]) return;
		room.addedUsers[user] = addedUsers[user] = 1;
	});

	if (Object.size(addedUsers) > 0) {
		Rooms.global.writeChatRoomData();
		room.add("||Alts automatically added: " + Object.keys(addedUsers).sort().join(", "));
	}

	return true;
};
