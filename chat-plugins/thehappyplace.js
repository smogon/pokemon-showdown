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
		if (room.id !== 'thehappyplace') return this.sendReply("This command can only be used in The Happy Place.");
		if (!this.canBroadcast() || !room.chatRoomData) return;
		if (!target) {
			if (!room.chatRoomData.quote) return this.sendReplyBox("The Quote of the Day has not been set.");
			return this.sendReplyBox("The current <strong>'Inspirational Quote of the Day'</strong> is:<br />" + room.chatRoomData.quote);
		}
		if (!this.can('declare', null, room)) return false;
		if (target === 'off' || target === 'disable' || target === 'reset') {
			if (!room.chatRoomData.quote) return this.sendReply("The Quote of the Day has already been reset.");
			delete room.chatRoomData.quote;
			this.sendReply("The Quote of the Day was reset by " + Tools.escapeHTML(user.name) + ".");
			this.logModCommand(user.name + " has reset the Quote of the Day.");
			Rooms.global.writeChatRoomData();
			return;
		}
		room.chatRoomData.quote = Tools.escapeHTML(target);
		room.addRaw(
			'<div class="broadcast-green">' +
				"<p><strong>The 'Inspirational Quote of the Day' has been updated by " + Tools.escapeHTML(user.name) + ".</strong></p>" +
				"<p>Quote: " + room.chatRoomData.quote + '</p>' +
			'</div>'
		);
		this.logModCommand(Tools.escapeHTML(user.name) + " has updated the quote of the day to: " + room.chatRoomData.quote);
		Rooms.global.writeChatRoomData();
	}
};
