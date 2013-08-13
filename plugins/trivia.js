/**
 * trivia.js
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @author Ethan
 * @license MIT license
 */
 
/** Initialize trivia rooms */
var triviaroom = Rooms.get('trivia');
var reviewroom = Rooms.get('trivreview');
fs.mkdir("./plugins/triviadata", function(err) {
	if (err.code === 'EEXIST') return;
	console.log("ERROR making triviadata subfolder: "+err);
});
/** Can a user review questions **/
function canReview(user) {
	/** Only available for drivers+ for now */
	if (!user.can('redirect')) return false;
	return true;
}
/** Quick function to send a message to a user a Trivia room. */
function sendMessage(message, user, room) {
	if (!room) return; // required
	if (user == null)
		room.send(message);
	else
		room.send(message, user);
}
/** Generates a random number from min - max */
function rand(min,max) {
	if (min == max) return max;
    return Math.floor(Math.random() * (max - min) + min);
}

/*********************************************************
 * QuestionHolder(FILE) prototype:
 * freeId(): Returns a free question ID.
 * add(category, question, answer): Adds a question to the database.
 * remove(id): Removes a question from the database.
 * get(id): Returns the object for the question of that ID.
 * all(): Returns the entire questions object.
 * questionAmount(): Returns how many questions there are in the database.
 * save(): Saves all of the questions into the file.
 *********************************************************/

function QuestionHolder(f) {
	this.file = f;
	this.questions = {};
	fs.readFile(f, function(err, data) {
		if (data == undefined)
			fs.writeFile(f, "{}");
		questions['questions'] = JSON.parse(data);
	});
}
QuestionHolder.prototype.freeId = function() {
	return this.questionAmount() + 1;
}
QuestionHolder.prototype.add = function(category, question, answer) {
	var id = this.freeId();
	this.questions[id] = {'category': category, 'question': question, 'answer': answer};
	return id;
}
QuestionHolder.prototype.remove = function(id) {
	delete this.questions[id];
}
QuestionHolder.prototype.get = function(id) {
	if (!this.questions.hasOwnProperty(id)) return undefined;
	return this.questions[id];
}
QuestionHolder.prototype.all = function() {
	return this.questions;
}
QuestionHolder.prototype.questionAmount = function() {
	return Object.keys(this.questions).length;
}
QuestionHolder.prototype.save = function() {
	fs.writeFile(this.file, JSON.stringify(this.questions));
}
var questions = new QuestionHolder('./plugins/triviadata/questions.json');

/*********************************************************
 * TriviaGame() prototype:
 * htmlAll(html): Sends a raw HTML message to all users.
 * sendPM(user, message): Sends a message to that user.
 * sendAll(message): Sends a message to all users.
 * startTrivia(user, points): The first step to starting a game.
 * startGame(points, name): Starts a game (calls startNormalGame).
 * startNormalGame(points, name): Actually starts the game.
 * startTriviaRound(): Starts a round of Trivia.
 * finalizeAnswers(): Called by startTriviaRound(). It groups the answers and displays stats.
 * resetTrivia(): Resets Trivia.
 * key(name): Returns a player's key.
 * randomId(): Generates a random question ID.
 * unjoin(user): Unjoins Trivia for a specific user.
 * endTrivia(user): Ends the Trivia game.
 * player(id): Returns the player's object where id=player's id.
 * playerPlaying(id): Returns true if the player is playing. False if not.
 * addPlayer(id): Adds a player to the game.
 * removePlayer(id): Removes a player from the game.
 * addAnswer(id, answer): Adds a player's answer to the submitted answers in a round.
 *********************************************************/

function TriviaGame() {
    this.round = 0;
    this.started = false;
    this.maxPoints = 0;
    this.triviaPlayers = {};
    this.submittedAnswers = {};
    this.roundQuestion = 0;
    this.answeringQuestion = false;
    this.triviaPoints = "";
    this.startoff = false;
    this.autostart = false;
	this.alreadyUsed = {};
    if (this.lastStopped === undefined)
        this.lastStopped = Date.now();
}

TriviaGame.prototype.htmlAll = function (html) {
	sendMessage('|raw|' + "<hr><center>" + html + "</center><hr>", null, triviaroom);
};

TriviaGame.prototype.sendPM = function (user, message) {
    sendMessage(message, user, triviaroom);
};

TriviaGame.prototype.sendAll = function (message) {
    sendMessage(message, null, triviaroom);
};

TriviaGame.prototype.startGame = function (points, name) {
    if (this.started === true) return;
    if (this.startoff === true) return;
    if (questions.questionAmount() < 1) return;
    var x = Date.now() - this.lastStopped;
    if (x < 16) return;
    if (name === "" && this.autostart === false) return;
	this.maxPoints = points;
    this.startNormalGame(points, name);
};

TriviaGame.prototype.startNormalGame = function (points, name) {
    this.started = true;
    this.sendAll((name !== "" ? name + " started a Trivia game! " : "A trivia game was started! ") + " First to " + points + " points wins!");
    this.answeringQuestion = false;
	setTimeout(function(){game.startTriviaRound();}, 5000);
};

TriviaGame.prototype.startTrivia = function (user, points) {
    if (this.started === true) {
        this.sendPM(user, "A trivia game has already started!");
        return;
    }
    if (this.startoff === true) {
        this.sendPM(user, "/start is off. Most likely because Trivia is being updated.");
        return;
    }
    if (questions.questionAmount() < 1) {
        this.sendPM(user, "There are no questions.");
        return;
    }
    var x = Date.now() - this.lastStopped;
    if (x < 16) {
        this.sendPM(user, "Sorry, a game was just stopped " + parseInt(x, 10) + " seconds ago.");
        return;
    }
    points = parseInt(points, 10);
    if (points > 102 || points < 1) {
        this.sendPM(user, "Please do not start a game with more than 102 points, or lower than 1 points.");
        return;
    }
	if (isNaN(points)) points = rand(20,41);
    this.startGame(points, user.name);
};

TriviaGame.prototype.startTriviaRound = function () {
    if (this.started === false)
        return;
	if (Object.keys(this.alreadyUsed).length >= questions.questionAmount()) {
        this.htmlAll("There are no more questions to show!<br/>The game automatically ended.");
        this.resetTrivia();
        return;
    }
    this.submittedAnswers = {};
    var questionNumber = this.randomId();
	while (this.alreadyUsed.hasOwnProperty(questionNumber)) {
        questionNumber = this.randomId();
    }
    /** Get the category, question, and answer */
    var q = questions.get(questionNumber);
    var category = q.category,
        question = q.question,
        answer = q.answer;
		
    this.answeringQuestion = true;
    this.roundQuestion = questionNumber;
    this.htmlAll("<b>Category:</b> " + category.toUpperCase() + "<br>" + question);
	this.alreadyUsed[questionNumber] = true;
	setTimeout(function() {game.finalizeAnswers()}, 10000);
};

TriviaGame.prototype.finalizeAnswers = function () {
    if (this.started === false)
        return;
    var answer, id, answers = [].concat(questions.get(this.roundQuestion).answer.split(","));
    this.answeringQuestion = false;
    var wrongAnswers = [],
        answeredCorrectly = [];
    var ignoreCaseAnswers = answers.map(function (s) {
        return String(s).toLowerCase();
    });
    for (id in this.triviaPlayers) {
        if (this.triviaPlayers[id].name != Users.get(id).name && Users.users(id) !== undefined) {
            this.triviaPlayers[id].name = Users.get(id).name;
        }
    }
    for (id in this.submittedAnswers) {
        var name = this.submittedAnswers[id].name;
        if (Users.get(id).name !== undefined && this.player(name) !== null) {
            answer = this.submittedAnswers[id].answer.toLowerCase().replace(/ {2,}/g, " ");
            if (ignoreCaseAnswers.indexOf(answer) != -1) {
                answeredCorrectly.push(name);
            }
            else {
                var tanswer = this.submittedAnswers[id].answer;
                wrongAnswers.push("<span title='" + name + "'>" + tanswer + "</span>");
            }
        }
    }
    this.sendAll("");
    var incorrectAnswers = wrongAnswers.length > 0 ? " Incorrect answers: " + wrongAnswers.join(", ") : "";
    this.sendAll("|raw|Time's up!" + incorrectAnswers);
    this.sendAll("Answered correctly: " + answeredCorrectly.join(", "));
    var x = answers.length != 1 ? "answers were" : "answer was";
    this.sendAll("|raw|The correct " + x + ": <b>" + answers.join(", ") + "</b>");
    if (answeredCorrectly.length !== 0) {
        var totalPlayers = 0;
        for (var id in this.triviaPlayers) {
            if (this.triviaPlayers[id].playing === true) {
                totalPlayers++;
            }
        }
        var pointAdd = +(1.65 * Math.log(totalPlayers / answeredCorrectly.length) + 1).toFixed(0);
        this.sendAll("Points awarded for this question: " + pointAdd);
        for (var i = 0; i < answeredCorrectly.length; i++) {
            var name = answeredCorrectly[i];
            this.player(name).points += pointAdd;
        }
    }

    var leaderboard = [];
    var displayboard = [];
    var winners = [];
    for (id in this.triviaPlayers) {
        if (this.triviaPlayers[id].playing === true) {
            var regname = this.triviaPlayers[id].name;
            var numPoints = this.triviaPlayers[id].points;
            var nohtmlname = regname;
            leaderboard.push([regname, numPoints]);
            if (this.triviaPlayers[id].points >= this.maxPoints) {
                winners.push(nohtmlname + " (" + this.triviaPlayers[id].points + ")");
            }
        }
    }
    leaderboard.sort(function (a, b) {
        return b[1] - a[1];
    });
    for (var x in leaderboard) {
        displayboard.push(leaderboard[x][0] + " (" + leaderboard[x][1] + ")");
    }
    this.sendAll("Leaderboard: " + displayboard.join(", "));

    if (winners.length > 0) {
        var w = (winners.length == 1) ? "the winner!" : "our winners!";
        winners.sort(function (a, b) {
            return b[1] - a[1];
        });
        this.htmlAll("<h2>Congratulations to " + w + "</h2>" + winners.join(", ") + "");
        this.resetTrivia();
        var toStart, pointsForGame;
        if (this.autostart === true) {
            pointsForGame = rand(9, 25), toStart = rand(30, 44);
            this.sendAll("A new trivia game will be started in " + toStart + " seconds!");
			setTimeout(function(){game.startGame(pointsForGame.toString(), "");}, 1000*toStart);
            return;
        }
        return;
    }
    if (Object.keys(this.alreadyUsed).length >= questions.questionAmount()) {
        this.htmlAll("There are no more questions to show!<br/>The game automatically ended.");
        this.resetTrivia();
        return;
    }
    var r = rand(17, 30);
    this.sendAll("Please wait " + r + " seconds until the next question!");
	setTimeout(function(){game.startTriviaRound();}, 1000*r);
};

TriviaGame.prototype.resetTrivia = function () {
    this.started = false;
    this.round = 0;
    this.maxPoints = 0;
    this.triviaPlayers = {};
    this.submittedAnswers = {};
	this.alreadyUsed = {};
    this.roundQuestion = 0;
    this.answeringQuestion = false;
    this.lastStopped = Date.now();
};

TriviaGame.prototype.key = function (name) {
    var ret = name;
    if (typeof name === "string") {
        for (var id in this.triviaPlayers) {
            if (this.triviaPlayers[id]['name'].toLowerCase() === name.toLowerCase()) {
                ret = id;
            }
        }
    }
    return ret;
};

TriviaGame.prototype.randomId = function () {
	return rand(1, questions.questionAmount()+1);
};

TriviaGame.prototype.unjoin = function (user) {
    if (this.started === false) {
        this.sendPM(user.id, "A game hasn't started!");
        return;
    }
    if (this.playerPlaying(user.userid)) {
        this.removePlayer(user.userid);
        this.sendAll(user.name + " left the game!");
    } else {
        this.sendPM(user.id, "You haven't joined the game!");
    }
};

TriviaGame.prototype.endTrivia = function (user) {
    if (this.started === false) {
        this.sendPM(user.id, "A game hasn't started.");
        return;
    }
    this.resetTrivia();
    this.sendAll(user.name + " stopped the current trivia game!");
    return;
};

TriviaGame.prototype.player = function (id) {
    var key = this.key(id);
    if (!this.triviaPlayers.hasOwnProperty(key) || !this.triviaPlayers[key].playing) {
        return null;
    }
    return this.triviaPlayers[key];
};

TriviaGame.prototype.playerPlaying = function (id) {
    var key = this.key(id);
    return (this.triviaPlayers.hasOwnProperty(key) && this.triviaPlayers[key].playing);
};

TriviaGame.prototype.addPlayer = function (id) {
    var key = this.key(id);
	var playerName = Users.get(id).name;
    if (this.triviaPlayers.hasOwnProperty(key)) {
        this.triviaPlayers[key].playing = true;
    }
    else {
        for (var playerId in this.triviaPlayers) {
            if (this.triviaPlayers[playerId].name.toLowerCase() === playerName.toLowerCase()) {
                this.triviaPlayers[key] = this.triviaPlayers[playerId];
                this.triviaPlayers[key].playing = true;
                delete this.triviaPlayers[playerId];
            }
        }
    }
    if (!this.triviaPlayers.hasOwnProperty(key)) {
        this.triviaPlayers[key] = {
            name: playerName,
            points: 0,
            playing: true
        };
    }
};

TriviaGame.prototype.removePlayer = function (id) {
    var key = this.key(id);
    if (this.triviaPlayers.hasOwnProperty(key)) {
        this.triviaPlayers[key].playing = false;
    }
};

TriviaGame.prototype.addAnswer = function (id, answer) {
    var key = this.key(id);
    this.submittedAnswers[key] = {
        name: Users.get(id).name,
        answer: answer,
        time: Date.now()
    };
};

var game = new TriviaGame();

/** ************************** */

/** Returns command data (if any). */
function getData(message) {
	var ret = {};
	if (message.substr(0,1) == "/" && message.length > 1) {
		var command, commandData, p = message.indexOf(" ");
		if (p != -1) {
			command = message.substr(1,p-1).toLowerCase();
			commandData = message.substr(p+1);
		} else {
			command = message.substr(1).toLowerCase();
			commandData = "";
		}
		ret['command'] = command;
		ret['commandData'] = commandData;
	}
	return ret;
}
/** The trivia commands. */
triviaCommands = {};
/** Adds a command to the Trivia commands. */
function addCommand(commandName, callback) {
	if (typeof(commandName) !== "string")
		return;
	if (typeof(callback) !== "function")
		return;
	triviaCommands[commandName] = callback;
}
/** TRIVIA USER COMMANDS **/
addCommand('start', function(user, connection, commandData) {
	game.startTrivia(user, commandData);
});
addCommand('stop', function(user, connection, commandData) {
	game.endTrivia(user);
});
addCommand('join', function(user, connection, commandData) {
	if (game.started === false) {
        game.sendPM(user.id, "A game hasn't started!");
        return;
    }
    if (game.playerPlaying(user.id)) {
        Trivia.sendPM(user.id, "You've already joined the game!");
        return;
    }
    game.addPlayer(user.userid);
	game.sendAll(user.name+" joined the game!");
});
addCommand('unjoin', function(user, connection, commandData) {
	game.unjoin(user);
});
addCommand('say', function(user, connection, commandData) {
	if (commandData == "") return;
	game.sendAll("(" + user.name + ")"+": "+ commandData);
});
addCommand('goal', function(user, connection, commandData) {
	if (game.started == false) {
		game.sendPM(user.id, "A trivia game isn't currently running.");
		return;
	}
	game.sendPM(user.id, "The goal for the current game is: " + game.maxPoints);
});
/** The main function. It handles a user's message if they are in the Trivia channel. */
function handleMessage(user, message, connection) {
	var data = getData(message);
	if (data.hasOwnProperty('command')) {
		var command = data['command'], commandData = data['commandData'];
		if (triviaCommands.hasOwnProperty(command)) {
			triviaCommands[command].call(null, user, connection, commandData);
			return false;
		}
	}
	var joined = game.playerPlaying(user.userid);
	if (game.started === true) {
		if (joined === false && game.answeringQuestion === true) {
			game.sendPM(user.id, "You haven't joined, so you are unable to submit an answer. Type /join to join.");
			return false;
		}
	}
	if (joined === true && game.started === true && game.answeringQuestion === true) {
		if (message.length > 60) {
			game.sendPM(user.id, "Sorry! Your answer is too long.");
			return false;
		}
		game.addAnswer(user.userid, message.replace(/,/gi, ""));
		game.sendPM(user.id, "Your answer was submitted.");
		return false;
	}
	return true;
}
module.exports = {
	handle: handleMessage
}