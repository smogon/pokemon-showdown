/**
* TCG: Yugioh wiki plugin
* This is a command that allows users to search the yugioh wiki for cards. It will display the closest match with a given query, or a separate message if there isn't anything found.
*/

exports.commands = {
	ygo: 'yugioh',
	yugioh: function (target, room, user) {
		if (room.id !== 'tcg') return this.sendReply("This command can only be used in the TCG room.");
		if (!this.canBroadcast()) return;

		var http = require("http");
		var self = this;

		var query = Tools.escapeHTML(target);

		var Search = http.get(('http://yugioh.wikia.com/api/v1/Search/List/?query=' + query + '&limit=1'), function (a) {
			var response = '';
			a.on('data', function (data) {
				response += data;
			});
			a.on('end', function () {
				var result = JSON.parse(response);

				if (result.exception) {
					self.sendReply("No articles matching your query found.");
				} else {
					self.sendReplyBox("<strong>Best result for " + query + ":</strong><br/><a href= " + result.items[0].url + ">" + result.items[0].title + "</a>");
				}

				room.update();
			});
		});
	}
};
