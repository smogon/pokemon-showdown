/**
* TCG: Yugioh wiki plugin
* This is a command that allows users to search the yugioh wiki for cards. It will display the closest match with a given query, or a separate message if there isn't anything found.
* By bumbadadabum with help from ascriptmaster, codelegend and the PS development team.
*/

var http = require("http");

var tcgsearch = function (target, room, user, cmd, self) {
	if (room.id !== 'tcg') return self.sendReply("This command can only be used in the TCG room.");
	if (!self.canBroadcast()) return;

	var query = Tools.escapeHTML(target);
	var host = (cmd === 'yugioh' || cmd === 'ygo') ? 'yugioh.wikia.com' : 'mtg.wikia.com';

	var Search = http.get('http://' + host + '/api/v1/Search/List/?query=' + query + '&limit=1', function (a) {
		var response = '';

		a.on('data', function (data) {
			response += data;
		});
		a.on('end', function () {
			var result;

			try {
				result = JSON.parse(response);
			} catch (e) {
				return self.sendReply("ERROR: Could not parse query:" + e);
			}

			if (result.exception) {
				self.sendReply("No articles matching your query found.");
			} else {
				self.sendReplyBox("<strong>Best result for " + query + ":</strong><br/><a href= " + Tools.escapeHTML(result.items[0].url) + ">" + Tools.escapeHTML(result.items[0].title) + "</a>");
			}

			room.update();
		});
	});
};

exports.commands = {
	ygo: 'yugioh',
	yugioh: function (target, room, user, connection, cmd) {
		tcgsearch(target, room, user, cmd, this);
	},

	mtg: 'magic',
	magic: function (target, room, user, connection, cmd) {
		tcgsearch(target, room, user, cmd, this);
	}
};
