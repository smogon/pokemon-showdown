// made by Megas4ever
exports.commands = {
  rtour: 'etour',
  etour: function (target, undefined, undefined, undefined, cmd) {
    var type;
    if (cmd[0] == 'e') type = 'elimination';
    else if (cmd[0] == 'r') type = 'round robin';
    this.parse('/tour new ' + target + ', ' + type);
  },
  randtour: 'randomtour',
  randomtour: function(target) {
    // list of possible formats
    var formats = ['monotype', 'monotype random battle', 'OU', 'UU', 'ubers', 
                   'AG', 'RU', 'NU', 'PU', 'cc1v1', 
                   '1v1', 'randbats', 'battle spot singles', 'balanced hackmons', 'hackmons'],
        length = formats.length;
    var chosenFormat = formats[Math.floor(Math.random() * length)];
    if (target == ('e' || 'elim')) this.parse('/etour ' + chosenFormat);
    else if (target == 'r') this.parse('/rtour ' + chosenFormat);
    else this.errorReply('Possible commands are /randomtour e and /randomtour r (randomtour can be replaced with randtour');
  },
};
