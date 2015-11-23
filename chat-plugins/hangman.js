/*
* Hangman chat plugin
* By bumbadadabum.
*/

'use strict';

const permission = 'announce';
const maxMistakes = 6;

let Hangman = (function () {
	function Hangman(room, word, hint) {
		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}
		this.gameType = 'hangman';
		this.room = room;
		this.word = word;
		this.hint = hint;
		this.incorrectGuesses = 0;

		this.guesses = [];
		this.wordSoFar = [];

		for (let i = 0; i < word.length; i++) {
			if (word[i] === ' ') {
				this.wordSoFar.push('&nbsp;');
			} else {
				this.wordSoFar.push('_');
			}
		}
	}

	Hangman.prototype.guessLetter = function (letter) {
		let lowercase = letter.toLowerCase();
		if (this.word.toLowerCase().indexOf(lowercase) > -1) {
			for (let i = 0; i < this.word.length; i++) {
				if (this.word[i].toLowerCase() === lowercase) {
					this.wordSoFar[i] = this.word[i];
				}
			}

			if (this.wordSoFar.indexOf('_') < 0) {
				this.finish();
				return;
			}
		} else {
			this.incorrectGuesses++;
		}

		this.guesses.push(letter);
		this.update();
	};

	Hangman.prototype.guessWord = function (word) {
		if (this.word.toLowerCase().replace(/\s/g, '') === word.toLowerCase().replace(/\s/g, '')) {
			for (let i = 0; i < this.word.length; i++) {
				if (!(this.word[i] === ' ')) {
					this.wordSoFar[i] = this.word[i];
				}
			}
			this.finish();
		} else {
			this.incorrectGuesses++;
			this.guesses.push(word);
			this.update();
		}
	};

	Hangman.prototype.hangingMan = function () {
		switch (this.incorrectGuesses) {
		case 1:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCEMNAC/8gAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACP0lEQVR42u3dy07CQBSA4Y5hYaLC+z8m8bobNzSpSZlerO2c8ft2ApoWfk+H0mjKOXewtQdPAcJCWAgLhIWwEBYIC2EhLNjQqaF9aemzqWRigbAQFsKClhfvURfBTV4QZ2IhLISFsEBYCAthgbAQFsICYSEshEU9wn8wffIaVhtO/5iQlymbWPVPoxxxgplYxwd1Gbnteuf7w0yv1NAfXhvbkVTxtp1nbOu14n0SVmXb9jKxXXMCqz4ua6z9oxqum/LMNdXF4p3SFC2FlBcs2rOw6D2vnFb9baGmlrCOn2h5wWQLM7WEtc9h8GliUo1Nq7HHnk0s1kyqbuFaS1hCmj2pugWHx2o5837c4THduS8VbgsTl4lV3xQLP62EtZ+PhSF10eMS1t9JK04xTMX0OuPnC+uf+Vy5cO+/fjOxKC3Qt1hX+RCaH75Wrqvew/1GuWzmsG17LGxnGiz6w00rYR2/fcPA0ow1mStIhbUort+8y6ySM+/HLOZzq0EJq/7AQv93CmHVdTqiGU43ICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYcHNqXBfbmD/spd4F8nEwqEQYYGwEBbCAmEhLIQFN6Uz78nTg4mFsBAWCAth0bhvenKJ6paEcPcAAAAASUVORK5CYII=" />';
		case 2:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCEXvmV2HgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAB10lEQVR42u3dzY6CQBCFUcrw/q9cbnRjDD/aQFdzzppZoF8uzEjGyMwJWnt4CRAWwkJYICyEhbBAWAgLYUFD80DnMtJnU2GxQFgIC2HByDfvVW+Ch3wgzmIhLISFsEBYCAthgbAQFsICYSEshEU/yn8wPXsPuw3nfUzJx5QtVv9rlBUXzGJdH1RsPDYrrZfFui6qWAgldgQnLFaD2nJsCovPEOKPGN28c/i6pLBotTqlVktY1lBYN7y3KrtawkJYCAthgbD8Bies24uDAw1h0WK1Sq2esOqtVvdrJaw6q1XuHk1Y56/WnidCvx0bwmIphrXAsuIl8M2jyefGlX9c5ko93SCsa5Yrf/iZSVi0CKz0t1MIq7/AYoQTc/OOsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFuzmvyb3IUY7IYuFsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBYdWPpmihzg/NJbfIqwWLgUIiwQFsJCWCAshIWw4GXpL+/h5cFiISyEBcJCWAzuCfLJKz5P/RbeAAAAAElFTkSuQmCC" />';
		case 3:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCEm77t2JAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAB9ElEQVR42u3dwZKCMBBFUdvy/3+53cjG0ghFkHQ4Z81m9NaDGTNlZOYNert7CRAWwkJYICyEhbBAWAgLYUFHj4l+lpk+mwqLBcJCWAgLZn54r/oQPOWBOIuFsBAWwgJhISyEBcJCWAgLhIWwEBbjKP/B9MN7OGw4yzUljylbrPHXKCsumMU6P6hYeW1WWi+LdV5U0QglNgQnLH4GtebaFBbvIcSOGD28c/i6pLDotTqlVktY1lBYF3y2KrtawkJYCAthgbD8Biesy4uDAw1h0WO1Sq2esOqt1vBrJaw6q1XuGU1Y/1+tLSdCP10bwqIVw6/AsuItcOFo8jG3uvgSRe64zTnd4Pmpeb59ayBxc9DP7W7lEq2JpWRQwjo/rm/xlA5KWOPENSVhiUtY4hIWF49LWOISlriExcXjEpa4hCUuYbEtLmEhLmGJS1jiEhYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbCoyRcIjGG6f1q1WAgLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhMYDWN1PkBD9feov/IiwWboUIC4SFsBAWCAthISx4af3lPbw8WCyEhbBAWAiLyT0BWfs2Q5QZn0MAAAAASUVORK5CYII=" />';
		case 4:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCE0HAIHbAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACL0lEQVR42u3dwW6DMBBF0UyV//9ld9NsqoaQAmGeOWdtqSK5GlwHiRpj3GBvXz4ChIWwEBYIC2EhLBAWwkJYsKP7RNcy029TZWKBsBAWwoKZN++pm+ApH4gzsRAWwkJYICyEhbBAWAgLYYGwEBbCoo/4H6bvvsO24TzWRD6mbGL1n0YjcYKZWOcHVSvXjqTpZWKdF1UthFJvBCcsXga1Zu0QFr9DqA0x2rxz+HQZwmKvqRM1tYRlGgrrgnur2KklLISFsBAWCMt/cMK6vDo40BIWe0ytqKknrLyp1X5aCStnasXt0YT1+an1zhOhf60tYbEUw6vARuIt8MGjycfc6upJFGPDba7+8TdNrMn2T0vPt78bQK2Iqt0+TFjH7qVuGwJ7tab13ktY58X1LJ410bXf0Avr/Li2Hj203NALKyuumKMHYeXEFXWeJayMuOIOSYXVPy4n7+weV2RUwuodV2xUwuobV3RUwuoZV3xUwuoT19Z1wmJ1NNFvshdWz7gq/cKE1S+umuGihIWwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCIvr8AKBHmq2CzKxEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcKigaU3U4wJrm/4ij+iTCzcChEWCAthISwQFsJCWPBj6eS9fDyYWAgLYYGwEBaT+wYxTkRFeM3VrwAAAABJRU5ErkJggg==" />';
		case 5:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFB8n2XldzwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACkUlEQVR42u3dyXKCUBBAUZvi/z/ZzspFJmTU7ue5ayoGOWkeSMXIzJt0dpO3QGAJLIElgSWwBJYElsASWNKJzQPty0ifTYWJJYElsASWNPLivesieMgH4kwsgSWwBJYElsASWBJYAktgSWAJLIGlOrX/YHp2DMvCeWzT8jFlE6v+NMqOE8zEej+oWLltdppeJtb7UMUClNgADiw9BbVm2wRLPyHEAYwW77p8uiRYOmvqtJpaYJmGYH3g2qrt1AJLYAksgSWB5QoOrI8vLgYaYOmMqdVq6oHVb2qVn1Zg9Zla7dZoYL1+am15IvSvbQMsLWF4Biw7ngIfeTT5mlNd/IMiD5zmYsdrmliDrZ+Wnm/fCiBWoLplsS/3joG+bLzCqWPreigPXPmVXnuZWNcv1LdOo+iOCqwauK6eimDBNQYqsHrhanU/C6weuNrdJAWrPi533nU6rpaowKqNqy0qsOriao0KrJq42qMCqw6uo9uBpdVoWn+TPVg1cUX3HQOrHq4YYafAElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAElgSWwNKfJVi6GlWAJajAggosqMASVGBBBRZUYAkqsKACCyqwBBVYUIE1RPGpOw4WVJc0O/5AmVgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJu1v63w0jfBVHjnrgMr/vWkSc9nOf/azHa9/v91tm3uZ5DhNrkCLiNEx7gUbEL+BgDQTsXa+5hBssuA695jRNm9dYJdYOVd5IbTsOk79OXXE8pqq/KEDj3m4oh2vNaXLN5bJecAwXDlZ6e7TWkatCvf1U6Hyi3ZlYAktgCSwJLDXpCxU4eG5Zegq5AAAAAElFTkSuQmCC" />';
		case 6:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCAAJK3CmAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACbUlEQVR42u3dwW6CQBSG0d7G93/l6aZuGkUsIPcfzree1CgnlykSqTHGl7R33z4CgSWwBJYElsASWBJYAktgSTt2m+i9zPTdVJlYElgCS2BJM2/eUzfBU94QZ2IJLIElsCSwBJbAksASWAJLAktgCSz1Kf6L6Ztj2BbOfU3kbcomVv9pNBInmIl1PqhauXYkTS8T6zxUtQCl3gAHll6CWrN2gKW/EGoDRpt3HT5dBljaa+pETS2wTEOwLri3ip1aYAksgSWwJLD8BwfW5auDgRZY2mNqRU09sPKmVvtpBVbO1Irbo4H1+an1zh2hj9YWWFrC8ArYSDwF3nNr8jGnunqCYmw4zdU/XtPEmmz/tHR/+7sAagWqdvswsI7dS31tAPZqTeu9F1jn4XqGZw269ht6sM7HtfXSQ8sNPVhZuGIuPYCVgyvqehZYGbjiLpKC1R+XK+/aHVckKrB644pFBVZfXNGowOqJKx4VWH1wbV0HllajiX6SPVg9cVX6GwOrH66a4U2BJbAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgaWHvfrtBrC0GdU0uMDqg6pmwgVWL1TT4AKr36SaAhdYvVBNgwusfqimwAVWT1TxuMDqiyoaF1i9UcXiAqs/qkhcYGWgisMFVg6qKFxgHVuF/V2wLowqAtfN8Y8+4J6wqmsFlsASWAJLAktgCSwJLIElsCSwBJbAksASWAJLAktgCSwJLIElsCSwBJbAksBSv5Z+u2GGR28Mh/gjlYklp0KBJYElsASWBJbAEljSb0tX3svHIxNLYAksCSyBpcn7ActBXkU9Vtx+AAAAAElFTkSuQmCC" />';
		default:
			return '<img width="150" height="150" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsNFCA64qEbKgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABSklEQVR42u3aMQ6AMAwEQYz8/y+bhjpVBOKYaakSViYCamYO2O20BQgLYSEsEBbCQlggLISFsGCjDlpL0repMrFAWAgLYUHy4f2rh+DIH+JMLISFsBAWCAthISwQFsJCWCAshMU/tS14XSUuysRCWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWLBDL65NwPrGLX5EmVh4FCIsEBbCQlggLISFsOC2evNetgcTC2EhLBAWwiLcBdXUCDSAIG3EAAAAAElFTkSuQmCC" />';
		}
	};

	Hangman.prototype.generateWindow = function () {
		let result = 0;

		if (this.incorrectGuesses === maxMistakes) {
			result = 1;
		} else if (this.wordSoFar.indexOf('_') < 0) {
			result = 2;
		}

		let output = '<div class="broadcast-' + (result === 1 ? 'red' : (result === 2 ? 'green' : 'blue')) + '">';
		output += '<p style="text-align:center;font-weight:bold;font-size:14pt;">' + (result === 1 ? 'Too bad! The man has been hanged.' : (result === 2 ? 'The word has been guessed. Congratulations!' : 'A game of hangman is in progress!')) + '</p>';
		output += '<table><tr><td style="text-align:center;">' + this.hangingMan() + '</td><td style="text-align:center;width:100%;">';

		let wordString = '';
		if (result === 1) {
			for (let i = 0; i < this.wordSoFar.length; i++) {
				if (this.wordSoFar[i] === '_') {
					wordString += '<font color="#7af87a">' + this.word[i] + '</font> ';
				} else {
					wordString += this.wordSoFar[i] + ' ';
				}
			}
		} else {
			wordString = this.wordSoFar.join(' ');
		}

		output += '<p style="font-weight:bold;">' + wordString + '</p>';
		if (this.hint) output += '<strong>Hint:</strong> ' + Tools.escapeHTML(this.hint) + '<br/>';
		if (this.guesses) output += '<strong>Guesses so far:</strong> ' + Tools.escapeHTML(this.guesses.join(', ')) + '<br/>';

		output += '</td></tr></table></div>';

		return output;
	};

	Hangman.prototype.display = function (user, broadcast) {
		this.room.add('|uhtml|hangman' + this.room.gameNumber + '|' + this.generateWindow());
	};

	Hangman.prototype.update = function () {
		this.room.add('|uhtmlchange|hangman' + this.room.gameNumber + '|' + this.generateWindow());

		if (this.incorrectGuesses === maxMistakes) {
			this.finish();
		}
	};

	Hangman.prototype.end = function () {
		this.room.add('|uhtmlchange|hangman' + this.room.gameNumber + '|<div class="infobox">(The game of hangman was ended.)</div>');
		this.room.add("The game of hangman was ended.");
		delete this.room.game;
	};

	Hangman.prototype.finish = function () {
		this.room.send('|html|' + this.generateWindow());
		delete this.room.game;
	};

	return Hangman;
})();

exports.commands = {
	hangman: {
		create: 'new',
		new: function (target, room, user) {
			let params = target.split(',');

			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.game) return this.errorReply("There is already a game in progress in this room.");

			if (!params) return this.errorReply("No word entered.");
			let word = params[0].replace(/[^A-Za-z\s]/g, '');
			if (word.length < 1) return this.errorReply("Enter a valid word");
			if (word.length > 24) return this.errorReply("Word too long.");

			let hint;
			if (params.length > 1) {
				hint = params.slice(1).join(',').trim();
				if (hint.length > 150) return this.errorReply("Hint too long.");
			}

			room.game = new Hangman(room, word, hint);
			room.game.display(user, true);

			return this.privateModCommand("(A game of hangman was started by " + user.name + ".)");
		},
		createhelp: ["/hangman create [word], [hint] - Makes a new hangman game. Requires: % @ # & ~"],

		guess: function (target, room, user) {
			if (!room.game || room.game.gameType !== 'hangman') return this.errorReply("There is no game of hangman running in this room.");

			if (!target) return this.errorReply("No guess given.");

			let parsed = target.replace(/[^A-Za-z\s]/g, '');
			if (parsed.length > 24) return this.errorReply("Guess too long.");

			if (room.game.guesses.indexOf(parsed) > -1) return this.errorReply("Your guess has already been guessed.");

			room.send(user.name + " guessed " + parsed + '!');

			if (target.length > 1) {
				room.game.guessWord(parsed);
			} else {
				room.game.guessLetter(parsed);
			}
		},
		guesshelp: ["/hangman guess [letter] - Makes a guess for the letter entered.",
					"/hangman guess [word] - Same as a letter, but guesses an entire word."],

		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.game || room.game.gameType !== 'hangman') return this.errorReply("There is no game of hangman running in this room.");

			room.game.end();
			return this.privateModCommand("(The game of hangman was ended by " + user.name + ".)");
		},
		endhelp: ["/hangman end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~"],

		'': function (target, room, user) {
			if (!room.game || room.game.gameType !== 'hangman') return this.errorReply("There is no game of hangman running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.game.display(user, this.broadcasting);
		}
	},

	hangmanhelp: ["/hangman allows users to play the popular game hangman in PS rooms.",
				"Accepts the following commands:",
				"/hangman create [word], [hint] - Makes a new hangman game. Requires: % @ # & ~",
				"/hangman guess [letter] - Makes a guess for the letter entered.",
				"/hangman guess [word] - Same as a letter, but guesses an entire word.",
				"/hangman - Displays the game.",
				"/hangman end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~"],

	guess: function (target, room, user) {
		return this.parse('/hangman guess ' + target);
	},
	guesshelp: ["/guess - Shortcut for /hangman guess."]
};
