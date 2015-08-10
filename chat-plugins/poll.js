/* Poll commands
 * by Legit
 */
 
 //This is the line that controls what tiers are in tierpoll !_!
 var tiers = 'other, ru, tier shift, [Gen 5] OU, [Gen 5] Smogon Doubles, random doubles, random triples, custom, reg1v1, lc, nu, cap, cc, oumono, doubles, balanced hackmons, hackmons, ubers, random battle, ou, cc1v1, uu, anything goes, super staff bros,  inverse, random ubers, random haxmons, random lc, random monotype, random sky battle, challenge cup 2vs2 metronome, challenge cup metronome';
 
 function splint(target) {
 	var cmdArr = target.split(",");
 	for (var i = 0; i < cmdArr.length; i++) cmdArr[i] = cmdArr[i].trim();
 		return cmdArr;
 }
 
 exports.commands = {
	poll: function (target, room, user) {
		if (!user.can('broadcast',null,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
		if (room.question) return this.sendReply('There is currently a poll going on already.');
		if (!target) return false;
		if (target.length > 500) return this.sendReply('Polls can not be this long.');
		var separacion = "&nbsp;&nbsp;";
		var answers = splint(target);
		var formats = [];
		for (var u in Tools.data.Formats) {
			if (Tools.data.Formats[u].name && Tools.data.Formats[u].challengeShow && Tools.data.Formats[u].mod != 'gen4' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen3' && Tools.data.Formats[u].mod != 'gen2' && Tools.data.Formats[u].mod != 'gen1') formats.push(Tools.data.Formats[u].name);
		}
		formats = 'Tournament,'+formats.join(',');
		if (answers[0] == 'tournament' || answers[0] == 'tour') answers = splint(formats);
		if (answers.length < 3) return this.sendReply('Correct syntax for this command is /poll question, option, option...');
		var question = answers[0];
		question = Tools.escapeHTML(question);
		answers.splice(0, 1);
		var answers = answers.join(',').toLowerCase().split(',');
		room.question = question;
		room.answerList = answers;
		room.usergroup = Config.groupsranking.indexOf(user.group);
		var output = '';
		for (var u in room.answerList) {
			if (!room.answerList[u] || room.answerList[u].length < 1) continue;
			output += '<button name="send" value="/vote '+room.answerList[u]+'">'+Tools.escapeHTML(room.answerList[u])+'</button>&nbsp;';
		}
		room.addRaw('<div class="infobox"><h2>' + room.question + separacion + '<font size=2 color = "#939393"><small>/vote OPTION<br /><i><font size=1>Poll started by '+user.name+'</font size></i></small></font></h2><hr />' + separacion + separacion + output + '</div>');
	},

	ep: 'endpoll',
	endpoll: function (target, room, user) {
		if (!user.can('broadcast',null,room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canTalk()) return this.sendReply('You currently can not speak in this room.');
		if (!room.question) return this.sendReply('There is no poll to end in this room.');
		if (!room.answers) room.answers = new Object();
		var votes = Object.keys(room.answers).length;
		if (votes == 0) {
			room.question = undefined;
			room.answerList = new Array();
			room.answers = new Object();
			return room.addRaw("<h3>The poll was canceled because of lack of voters.</h3>");
		}
		var options = new Object();
		var obj = Rooms.get(room);
		for (var i in obj.answerList) options[obj.answerList[i]] = 0;
		for (var i in obj.answers) options[obj.answers[i]]++;
		var sortable = new Array();
		for (var i in options) sortable.push([i, options[i]]);
		sortable.sort(function(a, b) {return a[1] - b[1]});
		var html = "";
		for (var i = sortable.length - 1; i > -1; i--) {
			var option = sortable[i][0];
			var value = sortable[i][1];
			if (value > 0) html += "&bull; " + Tools.escapeHTML(option) + " - " + Math.floor(value / votes * 100) + "% (" + value + ")<br />";
		}
		room.addRaw('<div class="infobox"><h2>Results to "' + obj.question + '"<br /><i><font size=1 color = "#939393">Poll ended by '+user.name+'</font></i></h2><hr />' + html + '</div>'); room.question = undefined;
		room.answerList = new Array();
		room.answers = new Object();
	},

	votes: function (target, room, user) {
		if (!room.answers) room.answers = new Object();
		if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
		if (!this.canBroadcast()) return;
		this.sendReply('NUMBER OF VOTES: ' + Object.keys(room.answers).length);
	},

	vote: function (target, room, user) {
		var ips = JSON.stringify(user.ips);
		if (!room.question) return this.sendReply('There is no poll currently going on in this room.');
		if (!target) return this.parse('/help vote');
		if (room.answerList.indexOf(target.toLowerCase()) == -1) return this.sendReply('\'' + target + '\' is not an option for the current poll.');
		if (!room.answers) room.answers = new Object();
		room.answers[ips] = target.toLowerCase();
		return this.sendReply('You are now voting for ' + target + '.');
	},
	
	tpoll: 'tierpoll',
	tierpoll: function (room, user, cmd) {
		return this.parse('/poll Next Tournament Tier:, ' + tiers);
	}
};
