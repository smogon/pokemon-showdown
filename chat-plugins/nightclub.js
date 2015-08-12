urlify = function(str) {return str.replace(/(https?\:\/\/[a-z0-9-.]+(\/([^\s]*[^\s?.,])?)?|[a-z0-9]([a-z0-9-\.]*[a-z0-9])?\.(com|org|net|edu|tk)((\/([^\s]*[^\s?.,])?)?|\b))/ig, '<a href="$1" target="_blank">$1</a>').replace(/<a href="([a-z]*[^a-z:])/g, '<a href="http://$1').replace(/(\bgoogle ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&q=$2" target="_blank">$1</a>').replace(/(\bgl ?\[([^\]<]+)\])/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$2" target="_blank">$1</a>').replace(/(\bwiki ?\[([^\]<]+)\])/ig, '<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=$2" target="_blank">$1</a>').replace(/\[\[([^< ]([^<`]*?[^< ])?)\]\]/ig, '<a href="http://www.google.com/search?ie=UTF-8&btnI&q=$1" target="_blank">$1</a>');}
nightclub = new Object();
function colorify(given_text){
	//given_text = Tools.escapeHTML(given_text);
	var sofar = "";
	var splitting = given_text.split("");
	var text_length = given_text.length;
	var colorification = true;
	var beginningofend = false;
	for (var i in splitting) {
		if (splitting[i] == "<" && splitting[i + 1] != "/") {
			//open tag <>
			//colorification = false;
		}
		if (splitting[i] == "/" && splitting[i -  1] == "<") {
			//closing tag </>
			//find exact spot
			//beginningofend = i;
		}
		if (beginningofend && splitting[i - 1] == ">") {
			//colorification = true;
			//beginningofend = false;
		}
		var letters = 'ABCDE'.split('');
		var color = "";
		for (var f = 0; f < 6; f++) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		if (colorification) {
			if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
		} else sofar += splitting[i];

	}
	return sofar;
}
 
function colorify_absolute(given_text){
	var sofar = "";
	var splitting = given_text.split("");
	var text_length = given_text.length;
	for (i = 0; i < text_length; i++) {
		var color = (Math.random()*(0xFFFFFF+1)<<0).toString(16);
		if (splitting[i] == " ") sofar += " "; else sofar += "<font color='" + "#" + color + "'>" + splitting[i] + "</font>";
	}
	return sofar;
}
nightclubify = colorify;

exports.commands = {
	nightclub: function(target, room, user, connection) {
		if (!this.can('roommod', null, room)) return false;
		if (nightclub[room.id]) return this.sendReply('This room is already engulfed in nightclubness.');
		nightclub[room.id] = true;
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('LETS GET FITZY!! nightclub mode: ON!!!') + '</font><font size="2"> started by: ' + user.userid + '</font></div>');
	},
	dayclub: function(target, room, user, connection) {
		if (!this.can('roommod', null, room)) return false;
		if (!nightclub[room.id]) return this.sendReply('This room is already in broad daylight.');
		delete nightclub[room.id];
		room.addRaw('<div class="nightclub"><font size=6>' + nightclubify('sizzle down now... nightclub mode: off.') + '</font><font size="2"> ended by: ' + user.userid + '</font></font>');
	},
}
