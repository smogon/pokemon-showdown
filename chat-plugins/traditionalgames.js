/**
* Traditional Games: Yugioh wiki plugin
* This is a command that allows users to search the yugioh wiki for cards. It will display the closest match with a given query, or a separate message if there isn't anything found.
* By bumbadadabum with help from ascriptmaster, codelegend and the PS development team.
*/

var http = require('http');

function wikiaSearch(subdomain, query, callback) {
	http.get('http://' + subdomain + '.wikia.com/api/v1/Search/List/?query=' + encodeURIComponent(query) + '&limit=1', function (res) {
		var buffer = '';
		res.setEncoding('utf8');
		res.on('data', function (data) {
			buffer += data;
		});
		res.on('end', function () {
			var result;
			try {
				result = JSON.parse(buffer);
			} catch (e) {
				return callback(e);
			}
			if (!result) return callback(new Error("Malformed data"));
			if (result.exception) return callback(new Error(Tools.getString(result.exception.message) || "Not found"));
			if (!Array.isArray(result.items) || !result.items[0] || typeof result.items[0] !== 'object') return callback(new Error("Malformed data"));

			return callback(null, result.items[0]);
		});
	});
}

exports.commands = {
	ygo: 'yugioh',
	mtg: 'yugioh',
	magic: 'yugioh',
	yugioh: function (target, room, user, connection, cmd) {
		if (room.id !== 'traditionalgames') return this.errorReply("This command can only be used in the Traditional Games room.");
		if (!this.canBroadcast()) return;
		var broadcasting = this.broadcasting;
		var subdomain = (cmd === 'yugioh' || cmd === 'ygo') ? 'yugioh' : 'mtg';
		var query = target.trim();

		wikiaSearch(subdomain, query, function (err, data) {
			if (err) {
				if (err instanceof SyntaxError || err.message === 'Malformed data') {
					if (!broadcasting) return connection.sendTo(room, "Error: something went wrong in the request: " + err.message);
					return room.add("Error: Something went wrong in the request: " + err.message).update();
				}
				if (!broadcasting) return connection.sendTo(room, "Error: " + err.message);
				return room.add("Error: " + err.message).update();
			}
			var entryUrl = Tools.getString(data.url);
			var entryTitle = Tools.getString(data.title);
			var htmlReply = "<strong>Best result for " + Tools.escapeHTML(query) + ":</strong><br/><a href=\"" + Tools.escapeHTML(entryUrl) + "\">" + Tools.escapeHTML(entryTitle) + "</a>";
			if (!broadcasting) return connection.sendTo(room, "|raw|<div class=\"infobox\">" + htmlReply + "</div>");
			room.addRaw("<div class=\"infobox\">" + htmlReply + "</div>").update();
		});
	}
};
