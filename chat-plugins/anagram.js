/**************************************
* Anagram plugin for Pokémon Showdown *
* By: jd                              *
**************************************/

var fs = require('fs');
var request = require('request');
var anagramWords = ['pokemon'];
try {
	anagramWords = fs.readFileSync('config/wordlist.txt','utf8').split('\n');
} catch (e) {
	request('http://pastebin.com/raw.php?i=5yQ8MLG2', function callback(error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	fs.writeFileSync('config/wordlist.txt', body, 'utf8');
	    }
	});
}

exports.commands = {
	anagram: function(target, room, user) {
		if (!user.can('broadcast', null, room) || !this.canTalk()) return this.sendReply('/anagram - Access denied.');
		if (!target && !room.anagram) return this.sendReply("Usage: /anagram [normal/pokemon]");
		if (!this.canBroadcast()) return;
		if (room.anagram) return this.sendReplyBox("Word: " + room.anagram.scrambledWord);
		if (!room.anagram) room.anagram = {};

		target = toId(target);
		var theme = '';

		switch (target) {
			case 'pokemon':
				theme = 'Pokemon';
				var pokemon = Tools.dataSearch(Object.keys(Tools.data.Pokedex).sample().trim())[0];
				room.anagram.word = pokemon.name;
				while (pokemon.id.indexOf('mega') > -1 || pokemon.tier === 'CAP') {
					pokemon = Tools.dataSearch(Object.keys(Tools.data.Pokedex).sample().trim())[0];
					room.anagram.word = pokemon.name;
				}
				break;
			case 'info':
			case 'credits':
				this.sendReplyBox("Anagram plugin by <a href=\"https://gist.github.com/jd4564/194c045bec24e137de92\">jd</a>");
				delete room.anagram;
				break;
			default:
			case 'normal':
				theme = 'Normal';
				room.anagram.word = anagramWords.sample().trim();
				while (room.anagram.word.length < 4 || room.anagram.word.length > 8) room.anagram.word = anagramWords.sample().trim();
				break;
		}

		room.anagram.scrambledWord = toId(room.anagram.word.split('').sort(function(){return 0.5-Math.random();}).join(''));
		while (room.anagram.scrambledWord === toId(room.anagram.word)) room.anagram.scrambledWord = toId(room.anagram.word.split('').sort(function(){return 0.5-Math.random();}).join(''));

		room.chat = function (user, message, connection) {
			message = CommandParser.parse(message, this, user, connection);
			if (message) {
				this.add('|c|' + user.getIdentity(this.id) + '|' + message, true);
				if (room.anagram && toId(message) === toId(room.anagram.word)) {
					this.add('|raw|<div class="infobox">' + Tools.escapeHTML(user.name) + ' got the word! It was <b>' + room.anagram.word + '</b></div>');
					delete room.anagram;
					delete room.chat;
				}
			}
		this.update();
		};
		return room.add('|raw|<div class="infobox">' + Tools.escapeHTML(user.name) + ' has started an anagram. Letters: <b>' + room.anagram.scrambledWord + '</b> Theme: <b>' + theme + '</b></div>');
	},

	endanagram: function(target, room, user) {
		if (!user.can('broadcast', null, room)) return this.sendReply('/endanagram - Access denied.');
		if (!room.anagram) return this.sendReply('There is no anagram running in here.');
		delete room.anagram;
		room.add('|raw|<div class="infobox">The anagram game was ended by <b>' + Tools.escapeHTML(user.name) + '</b></div>');
	},
};
