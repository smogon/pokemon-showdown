var fs = require('fs');
var request = require('request');

var urbanCache;
try {
	urbanCache = JSON.parse(fs.readFileSync('../config/udcache.json', 'utf8'));
} catch (e) {
	urbanCache = {};
}

function cacheUrbanWord (word, definition) {
	word = word.toLowerCase().replace(/ /g, '');
	urbanCache[word] = {"definition": definition, "time": Date.now()};
	fs.writeFile('config/urbancache.json', JSON.stringify(urbanCache));
}

exports.commands = {
	def: 'define',
	define: function (target, room, user) {
		if (!target) return this.parse('/help define');
		target = toId(target);
		if (target > 50) return this.sendReply("Word can not be longer than 50 characters.");
		if (!this.canBroadcast()) return;

		var options = {
			url: 'http://api.wordnik.com:80/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
			'&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
		};

		var self = this;

		function callback(error, response, body) {
			if (!error && response.statusCode === 200) {
				var page = JSON.parse(body);
				var output = "<font color=#24678d><b>Definitions for " + target + ":</b></font><br />";
				if (!page[0]) {
					self.sendReplyBox("No results for <b>\"" + target + "\"</b>.");
					return room.update();
				} else {
					var count = 1;
					for (var u in page) {
						if (count > 3) break;
						output += "(<b>" + count + "</b>) " + Tools.escapeHTML(page[u]['text']) + "<br />";
						count++;
					}
					self.sendReplyBox(output);
					return room.update();
				}
			}
		}
		request(options, callback);
	},
	definehelp: ["/define [word] - Shows the definition of a word."],

	u: 'ud',
	urbandefine: 'ud',
	ud: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ud');
		if (target.toString().length > 50) return this.sendReply("Phrase cannot be longer than 50 characters.");
		if (!this.canBroadcast()) return;

		var options = {
			url: 'http://www.urbandictionary.com/iphone/search/define',
			term: target,
			headers: {
				'Referer': 'http://m.urbandictionary.com'
			},
			qs: {
				'term': target
			}
		};

		var milliseconds = ((44640 * 60) * 1000);

		if (urbanCache[target.toLowerCase().replace(/ /g, '')] && Math.round(Math.abs((urbanCache[target.toLowerCase().replace(/ /g, '')].time - Date.now()) / (24 * 60 * 60 * 1000))) < 31) {
			return this.sendReplyBox("<b>" + Tools.escapeHTML(target) + ":</b> " + urbanCache[target.toLowerCase().replace(/ /g, '')].definition.substr(0, 400));
		}

		var self = this;

		function callback(error, response, body) {
			if (!error && response.statusCode === 200) {
				var page = JSON.parse(body);
				var definitions = page['list'];
				if (page['result_type'] === 'no_results') {
					self.sendReplyBox("No results for <b>\"" + Tools.escapeHTML(target) + "\"</b>.");
					return room.update();
				} else {
					if (!definitions[0]['word'] || !definitions[0]['definition']) {
						self.sendReplyBox("No results for <b>\"" + Tools.escapeHTML(target) + "\"</b>.");
						return room.update();
					}
					var output = "<b>" + Tools.escapeHTML(definitions[0]['word']) + ":</b> " + Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
					if (output.length > 400) output = output.slice(0, 400) + '...';
					cacheUrbanWord(target, Tools.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' '));
					self.sendReplyBox(output);
					return room.update();
				}
			}
		}
		request(options, callback);
	},
	udhelp: ["/urbandefine [phrase] - Shows the urban definition of the phrase. If you don't put in a phrase, it will show you a random phrase from urbandefine."]
};
