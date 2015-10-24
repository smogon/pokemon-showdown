/* Panagrams chat-plugin
 * Created by SilverTactic and panpawn
 * This is a plugin that uses the anagrams 
 * format that is dedicated to Pokemon
 * names.  Winners recieve one buck a peice.
 */

var session = 0;

exports.commands = {
	panagramhelp: 'panagramrules',
	panagramrules: function(target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id !== 'gamescorner') return this.errorReply("This command can only be used in the 'Games Corner' room.");
		return this.sendReplyBox(
		    '<center><b><font size = 2><center>Pangram rules and commands</font></b>' +
		    '<i><font color=gray>(By SilverTactic and panpawn)</font></i></center><br />' +
		    '<code>/panagram [session number]</code> - Starts a game of Panagram in the room for [session number] games (Panagrams are just anagrams with Pokemon). Illegal and CAP Pokemon won\'t be selected. Must be ranked + or higher to use.<br />' + 
		    '<code>/guessp [Pokemon]</code> - Guesses a Pokémon.<br />' + 
		    '<code>/panagramend</code> OR <code>/endpanagram</code> - Ends the current game of Panagram.<br />' + 
		    '<code>/panagramhint</code> - Shows a hint of the panagram answer.'
        );
	},
	panagrams: 'panagram',
	panagram: function(target, room, user) {
		if (!this.can('mute', null, room)) return this.errorReply('You must be ranked @ or higher to be able to start a game of Panagram in this room.');
		if (room.panagram) return this.errorReply('There is already a game of Panagram going on.');
		if (room.id !== 'gamescorner') return this.errorReply("This command can only be used in the 'Games Corner' room.");
		if (!this.canTalk()) return;
		if (isNaN(target)) return this.errorReply("Target must be a number.");
		if (target < 0) return this.errorReply("Number cannot be negitive.");
		if (String(target).indexOf('.') >= 0) return this.errorReply("Number must be an integer.");
		if (!target) return this.errorReply("Usage: /panagram [number of games]");
		var msg = "<div class=\"broadcast-gold\"><center>A session of <b>Panagrams</b> in <button name=\"joinRoom\" value=" + room.id +">" + room.title + "</button> has commenced for " + target + " games!</center></div>";
		try {
			Rooms.rooms.lobby.add('|raw|' + msg);
			room.update();
		} catch (e) {}
		room.panagram = {};
		session = Number(target);
		var pokedex = [];
		for (var i in Tools.data.Pokedex) {
			if (Tools.data.Pokedex[i].num > 0 && !Tools.data.Pokedex[i].forme) {
				pokedex.push(i);
			}
		}
		var mixer = function(word) {
			var array = [];
			for (var k = 0; k < word.length; k++) {
				array.push(word[k]);
			}
			var a;
			var b;
			var i = array.length;
			while (i) {
				a = Math.floor(Math.random() * i);
				i--;
				b = array[i];
				array[i] = array[a];
				array[a] = b;
			}
			return array.join('').toString();
		};
		var poke = pokedex[Math.floor(Math.random() * pokedex.length)];
		var panagram = mixer(poke.toString());
		while (panagram == poke) {
			panagram = mixer(poke);
		}
		this.add('|html|<b><font color=' + Gold.hashColor(toId(user.name)) + '>' + Tools.escapeHTML(user.name) + '</font> has started a session of Panagrams!</b>');
		this.add('|html|<div class = "broadcast-gold"><center><b>A game of Panagram has been started!</b> (' + session + ' remaining)<br/>' + 'The scrambled Pokémon is: <b>' + panagram + '</b><br/>' + '<font size = 1>Type in <b>/gp [Pokémon]</b> to guess the Pokémon!');
		room.panagram.guessed = [];
		room.panagram.chances = 2;
		room.panagram.answer = toId(poke);
		room.panagram.scrambled = panagram;
	},
	gp: 'guessp',
	guesspoke: 'guessp',
	guessp: function(target, room, user, cmd) {
		if (room.id !== 'gamechamber') return this.errorReply("This command can only be used in the 'Game Chamber' room.");
		if (!room.panagram) return this.errorReply('There is no game of Panagram going on in this room.');
		if (!this.canTalk()) return;
		//if (room.panagram[user.userid]) return this.errorReply("You've already guessed once!");
		if (!target) return this.errorReply("The proper syntax is /guessp [pokemon]");
		//if (!Tools.data.Pokedex[toId(target)]) return this.errorReply("'" + target + "' is not a valid Pokémon.");
		//if (Tools.data.Pokedex[toId(target)].num < 1) return this.errorReply(Tools.data.Pokedex[toId(target)].species + ' is either an illegal or a CAP Pokémon. They are not used in Panagrams.');
		//if (Tools.data.Pokedex[toId(target)].baseSpecies) target = toId(Tools.data.Pokedex[toId(target)].baseSpecies);
		if (room.panagram.guessed.indexOf(toId(target)) > -1) return this.errorReply("That has already been guessed!");
		if (room.panagram.answer == toId(target)) {
			this.add('|html|<b><font color=' + Gold.hashColor(toId(user.name)) + '>' + Tools.escapeHTML(user.name) + '</b> guessed <b>' + Tools.data.Pokedex[toId(target)].species + '</b>, which was the correct answer!  They have also won 1 buck!');
			economy.writeMoney('money', toId(user.name), +1);
			delete room.panagram;
			if (session > 1) {
			    session--;
				var pokedex = [];
				for (var i in Tools.data.Pokedex) {
					if (Tools.data.Pokedex[i].num > 0 && !Tools.data.Pokedex[i].forme) {
						pokedex.push(i);
					}
				}
				var mixer = function(word) {
					var array = [];
					for (var k = 0; k < word.length; k++) {
						array.push(word[k]);
					}
					var a;
					var b;
					var i = array.length;
					while (i) {
						a = Math.floor(Math.random() * i);
						i--;
						b = array[i];
						array[i] = array[a];
						array[a] = b;
					}
					return array.join('').toString();
				}
				var poke = pokedex[Math.floor(Math.random() * pokedex.length)];
				var panagram = mixer(poke.toString());
				while (panagram == poke) {
					panagram = mixer(poke);
				}
				this.add('|html|<div class = "broadcast-gold"><center><b>A game of Panagram has been started!</b> (' + session + ' remaining)<br/>' + 'The scrambled Pokémon is: <b>' + panagram + '</b><br/>' + '<font size = 1>Type in <b>/gp [Pokémon]</b> to guess the Pokémon!');
				room.panagram = {};
				room.panagram.guessed = [];
				room.panagram.chances = 2;
				room.panagram.answer = toId(poke);
				room.panagram.scrambled = panagram;
			}
		} else {
			this.add('|html|<b><font color=' + Gold.hashColor(user.name) + '>' + Tools.escapeHTML(user.name) + '</b> guessed <b>' + Tools.escapeHTML(target) + '</b>, but was not the correct answer...');
			room.panagram[user.userid] = toId(target);
			room.panagram.guessed.push(toId(target));
		}
	},
	panagramend: 'endpanagram',
	endpanagram: function(target, room, user) {
		if (room.id !== 'gamescorner') return this.errorReply("This command can only be used in the 'Games Corner' room.");
		if (!this.can('broadcast', null, room)) return this.errorReply('You must be ranked + or higher to be able to end a game of Panagram in this room.');
		if (!room.panagram) return this.errorReply('There is no Panagram game going on in this room.');
		if (!this.canTalk()) return;
		this.add("|html|<b>The game of Panagram has been ended by <font color=" + Gold.hashColor(toId(user.name)) + ">" + Tools.escapeHTML(user.name) + "</font>.</b>");
		delete room.panagram;
	},
	ph: 'panagramhint',
	panagramhint: function(target, room, user) {
		if (room.id !== 'gamescorner') return this.errorReply("This command can only be used in the 'Games Corner' room.");
		if (!this.canBroadcast()) return;
		if (!room.panagram) return this.errorReply('There is no Panagram game going on in this room.');
		var answer_length = room.panagram.answer.length;
		var hint = 	"Scrambled Pokemon: <b>" + room.panagram.scrambled + "</b><br />" +
					"The first letter is <b>" + room.panagram.answer.substring(0, 1).toUpperCase() + "</b>.<br />" +
					"The type of this Pokemon is: <b>" + Tools.getTemplate(room.panagram.answer).types + "</b>";
		this.sendReplyBox("Panagram hint: <br />The Pokemon is <b>" + answer_length + "</b> characters long.  <br />" + hint);
	}
};
