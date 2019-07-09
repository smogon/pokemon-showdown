/****************************
 * Friend List
 * Original idea from WGC
 * Coded by Volco
 * *************************/
'use strict';

function onlineFriends(user) {
	let list = Db.friends.get(user, []).filter(friend => Users(friend) && Users(friend).connected && Users(friend).userid === friend);
	if (list.length && !Db.stopFriendNotifs.get(user)) Users(user).send(`|pm| WL Friend Manager|~|You have ${list.length} friends online: ${Chat.toListString(list)}`);
}
WL.onlineFriends = onlineFriends;

function friendLogin(user) {
	if (!user.named) return;
	Users.users.forEach(people => {
		if (Db.friends.get(people.userid, []).indexOf(user.userid) !== -1 && !Db.stopFriendNotifs.get(people.userid)) people.send(`|pm| WL Friend Manager|~|${user.name} has just logged in!`);
	});
}

WL.friendLogin = friendLogin;

exports.commands = {
	friend: 'friends',
	friends: {
		add: function (target, room, user) {
			if (!target) return this.parse(`/help friends add`);
			let targetUser = toId(target);
			if (user.userid === targetUser) return this.errorReply(`You cannot add yourself!`);
			if (targetUser.length < 1 || targetUser.length > 19) return this.errorReply(`Names should be more than 1 character and less than 19 characters long.`);
			if (Db.friends.get(user.userid, []).includes(targetUser)) return this.errorReply(`You already added them!`);
			Db.friends.set(user.userid, Db.friends.get(user.userid, []).concat([targetUser]));
			return this.sendReply(`You have added ${targetUser} as a friend!`);
		},
		addhelp: [`/friends add (user) - adds a user as your friend they must be online.`],

		remove: function (target, room, user) {
			let targetFriend = toId(target);
			if (!targetFriend) return this.parse(`/help friends remove`);
			let friends = Db.friends.get(user.userid, []);
			if (!friends.length) return this.errorReply("You currently don't have any added friends.");
			let friendIndex = friends.findIndex(friend => targetFriend === friend);
			if (friendIndex <= 0) return this.errorReply("You did not add them as a friend.");
			friends.splice(friendIndex, 1);
			Db.friends.set(user.userid, friends);
			this.sendReply(`You have removed ${target} from your friends list.`);
		},
		removehelp: [`/friends remove (user) - removes a user from your friend list.`],

		list: function (target, room, user) {
			if (!this.runBroadcast()) return;
			let friends = Db.friends.get(user.userid, []);
			if (!friends.length) return this.sendReplyBox(`You have no friends.`);
			let display = `<center>Friends<br />`;
			for (const friend of friends) {
				let seen = Db.seen.get(friend);
				let offline;
				if (!seen) {
					offline = "<font color='red'>never been online</font></b> on this server.";
				} else {
					offline = "last seen <b>" + Chat.toDurationString(Date.now() - seen, {precision: true}) + "</b> ago.";
				}
				let online = Users(friend) && Users(friend).connected;
				display += `${WL.nameColor(friend, true)}: ${online ? '<font color="#00ff00">Online</font>' : '<font color="#ff0000">Offline (' + offline + ')</font>'}<br />`;
			}
			display += `Total Friends: ${friends.length}</center>`;
			return this.sendReplyBox(display);
		},

		removeall: function (target, room, user) {
			if (!Db.friends.get(user.userid, []).length) return this.errorReply(`You have no friends.`);
			Db.friends.set(user.userid, []);
			return this.sendReply(`You have removed all of your friends.`);
		},

		toggle: 'toggleNotifs',
		togglenotifs: function (target, room, user) {
			if (!Db.stopFriendNotifs.has(user.userid)) {
				Db.stopFriendNotifs.remove(user.userid);
				return this.sendReply('You have now disabled friend notifications');
			} else if (Db.stopFriendNotifs.has(user.userid)) {
				Db.stopFriendNotifs.set(user.userid, true);
				return this.sendReply('You have now disabled friend notifications');
			}
		},

		'': 'help',
		help: function (target, room, user) {
			this.parse(`/help friends`);
		},
	},
	friendshelp: [`/friends add (user) - adds a user as your friend they must be online.
    /friends remove (user) - removes a user from your friend list.
    /friends list - displays your list of friends.
    /friends removeall - removes all of your friends.
    /friends togglenotifs - enables / disables friend notifications based on current setting (alias: /friends toggle)`,
	],
};
