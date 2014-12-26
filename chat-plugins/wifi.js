function usersToNames(name) {
  return Users.get(name).name;
}

exports.commands = {

  giveawayhelp: function(target, room, user) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!this.canBroadcast()) return;
    this.sendReplyBox(
      '<strong><em><font size="2" color="red">Wi-Fi Room Giveaway help</font></strong></em><br />' +
      '<br />' +
      '<strong>Player commands:</strong><br />' +
      '- /guessanswer or /ga <em>answer</em> - Guesses the answer for a question giveaway<br />' +
      '- /viewanswer - Allows the giveaway starter or the person giving away the prize view the answer in a question giveaway.<br />' +
      '- /grm - Allows you to view the details of a giveaway.<br />' +
      '- /joinlottery - Joins a lottery giveaway.<br />' +
      '- /leavelottery - Leaves a lottery giveaway.<br />' +
      '<br />' +
      '<strong>Staff commands:</strong><br />' +
      '- /questiongiveaway or /qg <em>User, Prize, Question, Answer</em> - Start a new question giveaway (Requires: % @ # & ~).<br />' +
      '- /lg <em>User, Prize, Number of Winners (optional)</em> - Starts a lotto giveaway. The number of winners is set to 1 by default. (Requires: % @ # & ~)<br />' +
      '- /giveawayend or /endgiveaway - Forcibly ends the current giveaway (Requires: % @ # & ~)<br />' +
      '- /changequestion - Changes the question of a question giveaway. Can only be done before the giveaway starts. (Requires: % @ # & ~)<br />' +
      '- /changeanswer - Changes the answer of a question giveaway. (Requires: % @ # & ~)<br />'
    );
  },

  qg: 'questiongiveaway',
  quizgiveaway: 'questiongiveaway',
  questiongiveaway: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!this.can('mute', null, room)) return false;
    if (room.giveaway) return this.sendReply('There is already a giveaway going on!');
    if (!target) return this.sendReply('|html|/' + cmd +
      ' <i>User, Prize, Question, Answer</i> - Starts a question giveaway. The question is displayed 1 minute after announcing the prize and the user. Alternate/Multiple answers can be separated with a slash (/).'
    );
    if (target.match(/,/g) && target.match(/,/g).length > 3) return this.sendReply(
      'You can\'t add commas into any of the command\'s parameters or add extra parameters either.');
    target = target.split(',');

    var targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];
    if (!Users.get(targetUser)) return this.sendReply('User \'' + targetUser + '\' was not found. Did you misspell their name?');
    if (!targetUser) return this.sendReply('You have not mentioned the user who\'ll be giving away the prize.');
    targetUser = targetUser.trim();

    var prize = target[1];
    if (!prize) return this.sendReply('You have not mentioned the prize to be given away.');
    prize = prize.trim();

    var question = target[2];
    if (!question) return this.sendReply('Seriously, don\'t bother starting a question giveaway without a question.');
    question = question.trim();

    var answer = target[3];
    if (!answer) return this.sendReply('You need to specify an answer to the question (3 words at the max).');
    answer = answer.trim();

    if (/[^a-z0-9/ ]+/ig.test(answer.toLowerCase())) return this.sendReply(
      'The answer may only be a max of 3 words long and cannot have any special characters in it.');
    var index = answer.match(/\//g) ? answer.match(/\//g).length : 1;

    room.giveaway = {};
    room.giveaway.prize = prize;
    room.giveaway.starter = user.userid;
    room.giveaway.user = targetUser;
    room.giveaway.type = 'question';
    room.giveaway.question = question;
    room.giveaway.answered = {};

    if (answer.indexOf("/") > -1) {
      answer = answer.split("/");
      for (var i = 0; i < answer.length; i++) {
        answer[i] = answer[i].trim();
        if (!answer[i]) {
          delete room.giveaway;
          return this.sendReply("You cannot leave any of the answer options blank!");
        } else if (answer[i].match(/ /g) && answer[i].match(/ /g).length > 2) {
          delete room.giveaway;
          return this.sendReply(
            'An answer may only be a max of 3 words long and cannot have any special characters in it.'
          );
        }
      }
      room.giveaway.answer = answer;
    } else room.giveaway.answer = answer.trim();

    room.add(
      '|html|<center><div class = "broadcast-blue"><font size = 3><b>It\'s giveaway time!</b></font><br/><font size = 1>Giveaway started by ' +
      user.name + '</font><br/><br/>' +
      '<b>' + Users.get(targetUser).name + '</b> will be giving away a <b>' + prize + '</b>!<br/>' +
      'The question will be displayed in a minute!');

    var thisroom = room;
    room.giveaway.timer = setTimeout(function() {
      thisroom.add('|html|<center><div class = "broadcast-blue">Question: <b>' + question + '</b><br/>' +
        'Type in <b>/guessanswer <i>answer</i></b> into the chat to guess the answer right now!'
      );
      thisroom.update();
      thisroom.giveaway.started = true;
    }, 1000 * 60);
    room.giveaway.endtimer = setTimeout(function() {
      thisroom.add('|html|<b>The giveaway has been ended for failing to answer the question</b>');
      thisroom.update();
      delete room.giveaway;
    }, 60 * 11000);
  },

  grm: 'giveawayremind',
  giveawayremind: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type === 'question') {
      if (!room.giveaway.started && (room.giveaway.starter !== user.userid || room.giveaway.starter !== user.userid)) return;
      this.sendReply(
        'The giveaway has not started yet! You need to wait for it to start before viewing the question.'
      );
      if (room.giveaway.started)
        if (!this.canBroadcast()) return;
      return this.sendReply(
        '|html|<center><div class = "broadcast-blue"><font size = 3><b>Giveaway time!</b></font><br/><font size = 1>Giveaway started by ' +
        Users.get(room.giveaway.starter).name + '</font><br/><br/>' +
        '<b>' + room.giveaway.user + '</b> will be giving away a <b>' + room.giveaway.prize + '</b>!<br/>' +
        'Question: <b>' + room.giveaway.question);
    } else {
      if (!this.canBroadcast()) return;
      this.sendReply(
        '|html|<center><div class = "broadcast-blue"><font size = 3><b>Giveaway time!</b></font><br/><font size = 1>Giveaway started by ' +
        room.giveaway.starter + '</font><br/><br/>' +
        '<b>' + room.giveaway.user + '</b> will be giving away a <b>' + room.giveaway.prize + '</b>!<br/>' +
        'The lottery drawing will occur in 2 minutes' + ((room.giveaway.winnnumber !== 1) ? ', with ' + room.giveaway
          .winnumber + ' winners!' : '!') + '<br/>' +
        '<button name = "send" value = "/joinlottery"><font size = 1><b>Join</b></font></button> <button name = "send" value = "/leavelottery"><font size = 1><b>Leave</b></font></button><br/><br/><font size = 1><b><u>Note:</u> Please do not join if you don\'t have a 3DS and a copy of Pokémon X, Y, ΩR, or αS'
      );
    }
  },

  gquestion: 'giveawayquestion',
  giveawayquestion: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'question') return this.sendReply(
      'This is not a question giveaway. There are no questions involved.');
    if (!room.giveaway.started && (room.giveaway.starter !== user.userid || room.giveaway.starter !== user.userid)) return this.sendReply(
      'The giveaway has not started yet! You need to wait for it to start before viewing the question.');
    if (room.giveaway.started)
      if (!this.canBroadcast()) return;
    return this.sendReply(
      '|html|<center><div class = "broadcast-blue"><font size = 3><b>Giveaway time!</b></font><br/><font size = 1>Giveaway started by ' +
      Users.get(room.giveaway.starter).name + '</font><br/><br/>' +
      '<b>' + room.giveaway.user + '</b> will be giving away a <b>' + room.giveaway.prize + '</b>!<br/>' +
      'Question: <b>' + room.giveaway.question);
  },

  changequestion: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'question') return this.sendReply(
      'This is not a question giveaway. There are no questions involved.');
    if (room.giveaway.starter !== user.userid) return this.sendReply('Only the starter of the giveaway can change the question.');
    if (room.giveaway.started) return this.sendReply('The giveaway has already started. You cannot change the question now.');
    if (!toId(target)) return this.sendReply(
      "|html|/changeanswer <i>new question</i> - Allows the starter of the giveaway to change the question, but only before the giveaway starts."
    );
    room.giveaway.question = target.trim();
    this.sendReply('The question has been changed to "' + target.trim() + '"');
  },

  changeanswer: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'question') return this.sendReply(
      'This is not a question giveaway. There are no questions involved.');
    if (room.giveaway.starter !== user.userid) return this.sendReply('Only the starter of the giveaway can change the answer.');
    if (!toId(target)) return this.sendReply(
      "|html|/changeanswer <i>new answer</i> - Allows the starter of the giveaway to change the answer.  Alternate/Multiple answers can be separated with a slash (/)."
    );
    if (/[^a-z0-9/ ]+/ig.test(target.toLowerCase())) return this.sendReply(
      'The answer may only be a max of 3 words long and cannot have any special characters in it.');
    if (target.indexOf("/") > -1) {
      target = target.split("/");
      for (var i = 0; i < target.length; i++) {
        target[i] = target[i].trim();
        if (!target[i]) return this.sendReply("You cannot leave any of the answer options blank!");
      }
      room.giveaway.answer = target;
    } else room.giveaway.answer = target.trim();
    return this.sendReply('|html|The answer has been changed to <b>' + ((typeof room.giveaway.answer === 'object') ? room.giveaway.answer
      .join(', ') + '</b> (Any one of them)' : '"' + room.giveaway.answer + '"'));
  },

  viewanswer: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'question') return this.sendReply(
      'This is not a question giveaway. There are no questions involved.');
    if (room.giveaway.starter === user.userid || room.giveaway.user === user.userid) {
      var part = Array.from(room.giveaway.answer);
      part.pop();
      return this.sendReplyBox(typeof room.giveaway.answer === 'object' ? 'The possible answers are <b>' + part.join(', ') +
        "</b> and <b>" + room.giveaway.answer[room.giveaway.answer.length - 1] + '</b>.' : 'The answer is <b>' +
        room.giveaway.answer + '</b>.');
    }
    return this.sendReply(
      '/viewanswer - Only the starter of the giveaway or the person who\'s giving away the prize can view the answer.'
    );
  },

  ga: 'guessanswer',
  guessanswer: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (Users.get(room.giveaway.user) === user.userid || Users.get(room.giveaway.user).getAlts().map(toId).indexOf(user.userid) > -
      1) return this.sendReply("You cannot answer the question when you're the one who's giving away the prize!");
    if (Users.get(room.giveaway.starter) !== user.userid || Users.get(room.giveaway.starter).getAlts().map(toId).indexOf(user.userid) >
      -1) return this.sendReply("You cannot answer the question when you're the one who started the giveaway!");
    if (room.giveaway.type !== 'question') return this.sendReply(
      'This is not a question giveaway. There are no questions involved.');
    if (!room.giveaway.started) return this.sendReply(
      'The giveaway has not started yet! You need to wait for it to start before answering the question.');
    if (!target) return this.sendReply('|html|/guessanswer <i>answer</i> - Guesses the answer of a question in a question giveaway');
    target = target.trim();
    if (room.giveaway.answered[user.userid] === 3) return this.sendReply(
      'You have used up all 3 of your guesses. Better luck next time!');
    for (var i in room.giveaway.answered)
      if (Users.get(i) && (Users.get(i) === user.userid || Users.get(i).getAlts().map(toId).indexOf(user.userid) > -1 ||
          Users.get(user).getAlts().map(toId).indexOf(i) > -1) && i !== user.userid) return this.sendReply(
        'Your alt \'' + i + '\' has already attempted to answer. Use that alt to answer instead.');
    if (/[^a-z0-9 ]+/ig.test(target.toLowerCase())) return this.sendReply("Don't include any special characters in your answer!");
    if (target.match(/ /g) && target.match(/ /g).length > 2) return this.sendReply(
      'You can only enter in a maximum of 3 words in your answer.');
    if (typeof room.giveaway.answer === 'object' ? room.giveaway.answer.map(toId).indexOf(toId(target)) === -1 : toId(target) !==
      toId(room.giveaway.answer)) {
      if (room.giveaway.answered[user.userid]) room.giveaway.answered[user.userid] ++;
      else room.giveaway.answered[user.userid] = 1;
      if (room.giveaway.answered[user.userid] === 3)
        return this.sendReply("'" + target + "'" + " is not the correct answer... Better luck answering next time!");
      return this.sendReply("'" + target + "'" + " is not the correct answer... Try again!");
    } else {
      room.add('|html|<div class = "broadcast-blue"><center><b>' + user.name +
        '</b> guessed the correct answer, which was "<b>' + target + '</b>". Congratulations!<br/>' +
        '<b>PM ' + room.giveaway.user + '<b> to claim your reward!');
      clearTimeout(room.giveaway.timer);
      clearTimeout(room.giveaway.endtimer);
      delete room.giveaway;
    }
  },

  giveawayend: 'endgiveaway',
  endgiveaway: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (!this.can('mute', null, room)) return false;
    room.add('|raw|<b>The giveaway has been forcibly ended by ' + user.name + '</b>');
    clearTimeout(room.giveaway.timer);
    clearTimeout(room.giveaway.endtimer);
    delete room.giveaway;
  },

  lg: 'lotterygiveaway',
  lotterygiveaway: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!this.can('mute', null, room)) return false;
    if (room.giveaway) return this.sendReply('There is already a giveaway going on!');
    if (!target) return this.sendReply('|html|/' + cmd +
      ' <i>User, Prize, Number of Winners (optional)</i> - Starts a lottery giveaway in the room. The number of winners will be set to 1 by default.'
    );
    if (target.match(/,/g) && target.match(/,/g).length > 2) return this.sendReply(
      'You can\'t add commas into any of the command\'s parameters or add extra parameters either.');
    target = target.split(',');
    for (var i = 0; i < target.length; i++) target[i] = target[i].trim();

    var targetUser = Users.getExact(target[0]) ? Users.getExact(target[0]).name : target[0];

    var prize = target[1];

    if (!Users.get(targetUser)) return this.sendReply('User \'' + targetUser + '\' was not found. Did you misspell their name?');
    if (!targetUser) return this.sendReply('You have not mentioned the user who\'ll be giving away the prize.');
    if (!prize) return this.sendReply('You have not mentioned the prize to be given away.');
    if (target[2]) {
      if (!Number(target[2]) && target[2] !== 0) return this.sendReply(target[2] + ' isn\'t a number.');
      if (target[2] < 1 || target[2] > 5) return this.sendReply(
        'The number of winners can only be a minimum of 1 and a maximum of 5.');
      target[2] = Number(target[2]);
    }

    room.giveaway = {};
    room.giveaway.prize = prize;
    room.giveaway.starter = user.userid;
    room.giveaway.user = targetUser;
    room.giveaway.type = 'lottery';
    room.giveaway.members = [];
    room.giveaway.winnumber = target[2] || 1;

    room.add(
      '|html|<center><div class = "broadcast-blue"><font size = 3><b>It\'s giveaway time!</b></font><br/><font size = 1>Giveaway started by ' +
      user.name + '</font><br/><br/>' +
      '<b>' + targetUser + '</b> will be giving away a <b>' + prize + '</b>!<br/>' +
      'The lottery drawing will occur in 2 minutes' + ((target[2] && target[2] !== 1) ? ', with ' + room.giveaway.winnumber +
        ' winners!' : '!') + '<br/>' +
      '<button name = "send" value = "/joinlottery"><font size = 1><b>Join</b></font></button> <button name = "send" value = "/leavelottery"><font size = 1><b>Leave</b></font></button><br/><br/><font size = 1><b><u>Note:</u> Please do not join if you don\'t have a 3DS and a copy of Pokémon X, Y, ΩR, or αS'
    );
    var thisroom = room;
    room.giveaway.timer = setTimeout(function() {
      if (thisroom.giveaway.members.length < 4 + room.giveaway.winnumber) {
        thisroom.add("|html|<b>The giveaway lottery has been ended due to the lack of users.");
        thisroom.update();
      } else {
        if (room.giveaway.winnumber > 1) {
          var random = [];
          var randomuser;
          var userlist = room.giveaway.members;
          for (var i = 0; i < room.giveaway.winnumber; i++) {
            randomuser = userlist[Math.floor(Math.random() * userlist.length)];
            userlist.splice(userlist.indexOf(randomuser), 1);
            random.push(randomuser);
          }
          var random2 = Array.create(random);
          random2.pop();

          var format = random2.map(usersToNames).join(", ") + ' </b>and<b> ' + Users.get(random[
            random.length - 1]).name;
          thisroom.add(
            '|html|<center><div class = "broadcast-blue"><font size = 3><b>Drawing time!</b></font><br/><br/>' +
            'Our lucky winners are <b>' + format +
            '!</b> Congratulations!<br/>PM <b>' + Users.get(room.giveaway.user).name +
            '</b> to claim your prize!');
          thisroom.update();
        } else {
          var randomuser = room.giveaway.members[Math.floor(Math.random() * room.giveaway.members
            .length)];
          thisroom.add(
            '|html|<center><div class = "broadcast-blue"><font size = 3><b>Drawing time!</b></font><br/><br/>' +
            'Our lucky winner is <b>' + Users.get().name +
            '!</b> Congratulations!<br/>PM <b>' + Users.get(room.giveaway.user).name +
            '</b> to claim your prize!');
          thisroom.update();
        }
      }
      delete room.giveaway;
    }, 2000 * 60);
  },

  joinlottery: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'lottery') return this.sendReply('This is not a lottery giveaway.');
    if (Users.get(room.giveaway.user) !== user.userid) return this.sendReply(
      "You cannot join the lottery when you're the one who's giving away the prize!");

    if (room.giveaway.members.map(usersToNames).indexOf(user.userid) > -1) return this.sendReply(
      'Either you or one of your alts have already joined the lottery.');
    for (var i = 0; i < room.giveaway.members.length; i++)
      if (user.getAlts().map(toId).indexOf(toId(room.giveaway.members[i])) > -1) return this.sendReply(
        'Either you or one of your alts have already joined the lottery.');
    room.giveaway.members.push(user.userid);
    this.sendReply('You have successfully joined the lottery. Good luck on winning!');
  },

  leavelottery: function(target, room, user, connection, cmd) {
    if (room.id !== 'wifi') return this.sendReply('This command can only be used in the Wi-Fi room.');
    if (!room.giveaway) return this.sendReply('There is no giveaway going on at the moment.');
    if (room.giveaway.type !== 'lottery') return this.sendReply('This is not a lottery giveaway.');
    if (room.giveaway.members.indexOf(user.userid) === -1) return this.sendReply("You haven't joined the lottery yet!");
    room.giveaway.members.splice(room.giveaway.members.indexOf(user.userid), 1);
    this.sendReply('You have left the lottery.');
  }
};
