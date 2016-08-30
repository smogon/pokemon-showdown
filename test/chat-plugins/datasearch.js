'use strict';

const userUtils = require('./../../dev-tools/users-utils');
const User = userUtils.User;

describe('Learn', function () {
	describe('Past gen variants', function () {
		it('should be independent of previous commands', function (done) {
			const room = Rooms('staff');

			const user = new User();
			user.forceRename("Staff Member", false);
			user.group = '%';
			user.isStaff = true;
			user.joinRoom(room);
			room.update();

			const cmdText1 = '!learn nidoking, counter';
			const cmdText2 = '!gsclearn nidoking, counter';
			CommandParser.parse(cmdText1, room, user, user.connections[0]).then(() => {
				return CommandParser.parse(cmdText2, room, user, user.connections[0]);
			}).then(() => {
				room.update();
				const logEntry = room.log[room.log.length - 1];
				user.disconnectAll();
				user.destroy();
				if (logEntry.includes('cannotlearn')) return done(new Error("/gsclearn failed after /learn"));
				return done();
			});
		});
	});
});
