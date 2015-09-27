/**
* The Happy Place: Quote of the Day Plugin
* This is a command that allows a room owner to set an inspirational "quote" of the day.
* Others may braodcast this at any time to remind the room of such.
* Only works in a room with the id "thehappyplace"
* Credits: panpawn, TalkTakesTime, Morfent, and sirDonovan
*/

exports.commands = {
	quoteoftheday: 'qotd',
	qotd: function (target, room, user) {
		if (room.id !== 'thehappyplace') return this.errorReply("This command can only be used in The Happy Place.");
		if (!room.chatRoomData) return;
		if (!target) {
			if (!this.canBroadcast()) return;
			if (!room.chatRoomData.quote) return this.sendReplyBox("The Quote of the Day has not been set.");
			return this.sendReplyBox(
				"The current <strong>Inspirational Quote of the Day</strong> is:<br />" +
				"\"" + room.chatRoomData.quote + "\""
			);
		}
		if (!this.can('declare', null, room)) return false;
		if (target === 'off' || target === 'disable' || target === 'reset') {
			if (!room.chatRoomData.quote) return this.sendReply("The Quote of the Day has already been reset.");
			delete room.chatRoomData.quote;
			this.sendReply("The Quote of the Day was reset by " + Tools.escapeHTML(user.name) + ".");
			this.logModCommand(user.name + " reset the Quote of the Day.");
			Rooms.global.writeChatRoomData();
			return;
		}
		room.chatRoomData.quote = Tools.escapeHTML(target);
		Rooms.global.writeChatRoomData();
		room.addRaw(
			"<div class=\"broadcast-blue\"><strong>The Inspirational Quote of the Day has been updated by " + Tools.escapeHTML(user.name) + ".</strong><br />" +
			"Quote: " + room.chatRoomData.quote + "</div>"
		);
		this.logModCommand(Tools.escapeHTML(user.name) + " updated the quote of the day to \"" + room.chatRoomData.quote + "\".");
	},
	quoteofthedayhelp: 'qotdhelp',
	qotdhelp: [
		"/qotd - View the current Inspirational Quote of the Day.",
		"/qotd [quote] - Set the Inspirational Quote of the Day. Requires: # & ~"
	]
};
