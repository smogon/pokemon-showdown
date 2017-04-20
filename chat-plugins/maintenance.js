'use strict';

exports.commands = {
	hourmain: 'maintenance',
	maintenance: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Config.emergency) {
			return this.errorReply("Maintenance mode has already been declared.");
		}
		Config.emergency = true;

		Rooms.rooms.forEach(room => {
			if (room.id !== 'global') room.addRaw(
				'<div class="broadcast-red"><b>The server will be under maintenance mode in a few hours.</b><br />' +
				'The development team will be busy; as such, limit PMs to upper staff members until maintenance is finished.</div>'
			).update();
		})

		this.logEntry(user.name + " used /maintenance");
	},
	maintenancehelp: ["/maintenance or /hourmain - Declares that the server will be going under maintenance mode in a few hours. Requires: ~"],

	endmain: 'endmaintenance',
	endmaintenance: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Config.emergency) {
			return this.errorReply("Maintenance mode has not been declared..");
		}
		Config.emergency = false;

		Rooms.rooms.forEach(room => {
			if (room.id !== 'global') room.addRaw(
				'<div class="broadcast-green"><b>The server is no longer under maintenance mode.</b><br />' +
				'If you see any bugs, please contact a developer immediately, or leave a message with a global staff member.</div>'
			).update();
		});

		this.logEntry(user.name + " used /endmaintenance");
	},
};
