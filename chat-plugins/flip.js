exports.commands = {
  flip: function (target, room, user) {
    var flipped = '';
    if (!this.canBroadcast()) return;
      for (var count = target.length - 1; count >= 0; count--)
        flipped += target[count];
    return this.sendReplyBox('You input: ' + target + ' The result was: ' + flipped);
  },
};
