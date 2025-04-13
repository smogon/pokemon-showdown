/*******************************************
* Dice Game Commands                       *
* Origin Code By: SilverTactic (Silveee)   *
* Updated To Typescript By: TurboRx        *
*******************************************/

const INACTIVE_END_TIME = 1 * 60 * 1000; // 1 minute
const TAX = 0; // No tax by default

function diceImg(num: number): string {
  const images = [
    "http://i.imgur.com/nUbpLTD.png",
    "http://i.imgur.com/BSt9nfV.png",
    "http://i.imgur.com/eTQMVhY.png",
    "http://i.imgur.com/3Y2hCAJ.png",
    "http://i.imgur.com/KP3Za7O.png",
    "http://i.imgur.com/lvi2ZZe.png",
  ];
  return images[num];
}

class Dice {
  private room: ChatRoom;
  private bet: number;
  private players: User[];
  private timer: NodeJS.Timeout;
  private startMessage: string;

  constructor(room: ChatRoom, amount: number, starter: string) {
    this.room = room;
    this.bet = amount;
    this.players = [];
    this.timer = setTimeout(() => {
      this.room.add(
        `|uhtmlchange|dice-game|<div class="infobox">(This game of dice has been ended due to inactivity.)</div>`
      ).update();
      delete this.room.dice;
    }, INACTIVE_END_TIME);

    this.startMessage = `<div class="infobox"><b style="font-size: 14pt; color: #24678d"><center>${Impulse.nameColor(starter, true, true)} has started a game of dice for <span style="color: green">${amount} coins</span>!</center></b><br>` +
      `<center><img style="margin-right: 30px;" src="http://i.imgur.com/eywnpqX.png" width="80" height="80">` +
      `<img style="transform:rotateY(180deg); margin-left: 30px;" src="http://i.imgur.com/eywnpqX.png" width="80" height="80"><br>` +
      `<button name="send" value="/joindice">Click to join!</button></center>`;
    this.room.add(`|uhtml|dice-game|${this.startMessage}</div>`).update();
  }

  join(user: User, self: Chat.CommandContext): void {
    if (this.players.length >= 2) {
      return self.errorReply("Two users have already joined this game of dice.");
    }
    if (!Economy.hasMoney(user.id, this.bet)) {
      return self.errorReply(`You don't have enough money (${this.bet} coins) to join this game of dice.`);
    }
    if (this.players.includes(user)) {
      return self.errorReply("You have already joined this game of dice.");
    }
    this.players.push(user);

    // Update the game's message to include the joined players inside the box with colors
    const joinedPlayersMessage = `<center><b>${this.players.map(p => Impulse.nameColor(p.name, true, true)).join(" and ")} have joined the game!</b></center>`;
    this.room.add(
      `|uhtmlchange|dice-game|` +
      `<div class="infobox">` +
      `${this.startMessage}<br>${joinedPlayersMessage}` +
      `</div>`
    ).update();

    // Automatically start the game when two players have joined
    if (this.players.length === 2) this.play();
  }

  leave(user: User, self: Chat.CommandContext): void {
    if (!this.players.includes(user)) {
      return self.errorReply("You haven't joined this game of dice yet.");
    }
    if (this.players.length === 2) {
      return self.errorReply("You cannot leave a game of dice once it has started.");
    }
    this.players = this.players.filter(p => p.id !== user.id);
    this.room.add(`|uhtmlchange|dice-game|${this.startMessage}</div>`).update();
  }

  play(): void {
    const [p1, p2] = this.players;

    if (!Economy.hasMoney(p1.id, this.bet) || !Economy.hasMoney(p2.id, this.bet)) {
      const removedPlayer = !Economy.hasMoney(p1.id, this.bet) ? p1 : p2;
      const remainingPlayer = removedPlayer === p1 ? p2 : p1;

      removedPlayer.sendTo(this.room, "You have been removed from the game due to insufficient balance.");
      remainingPlayer.sendTo(this.room, `${Impulse.nameColor(removedPlayer.name, true, true)} was removed from the game due to insufficient balance.`);
      this.players = this.players.filter(p => p !== removedPlayer);
      return;
    }

    const roll1 = Math.floor(Math.random() * 6);
    const roll2 = Math.floor(Math.random() * 6);

    const winner = roll1 > roll2 ? p1 : p2;
    const loser = winner === p1 ? p2 : p1;

    const taxedAmount = Math.round(this.bet * TAX);
    const winnings = this.bet - taxedAmount;

    Economy.addMoney(winner.id, winnings, "Dice game win");
    Economy.takeMoney(loser.id, this.bet, "Dice game loss");

    this.room.add(
      `|uhtmlchange|dice-game|<div class="infobox"><center>${Impulse.nameColor(p1.name, true, true)} rolled <b>${roll1 + 1}</b>!<br>` +
      `${Impulse.nameColor(p2.name, true, true)} rolled <b>${roll2 + 1}</b>!<br><br>` +
      `<b>${Impulse.nameColor(winner.name, true, true)}</b> wins <b>${winnings}</b> coins! Better luck next time, ${Impulse.nameColor(loser.name, true, true)}.</center></div>`
    ).update();

    this.end();
  }

  end(): void {
    clearTimeout(this.timer);
    delete this.room.dice;
  }
}

export const commands: Chat.ChatCommands = {
  startdice(target, room, user) {
    if (!room) return this.errorReply("This command can only be used in a room.");
    this.checkCan('show', null, room); // Permission check for Room Voice and higher
    if (room.dice) return this.errorReply("A game of dice is already ongoing.");
    const amount = parseInt(target);
    if (isNaN(amount) || amount <= 0) return this.errorReply("Please specify a valid positive number of coins to bet.");
    if (!Economy.hasMoney(user.id, amount)) return this.errorReply("You don't have enough coins to start this game.");
    room.dice = new Dice(room, amount, user.name);
  },

  joindice(target, room, user) {
    if (!room) return this.errorReply("This command can only be used in a room.");
    this.checkCan('show', null, room); // Permission check for Room Voice and higher
    if (!room.dice) return this.errorReply("There is no game of dice ongoing in this room.");
    room.dice.join(user, this);
  },

  leavedice(target, room, user) {
    if (!room) return this.errorReply("This command can only be used in a room.");
    this.checkCan('show', null, room); // Permission check for Room Voice and higher
    if (!room.dice) return this.errorReply("There is no game of dice ongoing in this room.");
    room.dice.leave(user, this);
  },

  enddice(target, room, user) {
    if (!room) return this.errorReply("This command can only be used in a room.");
    this.checkCan('show', null, room); // Permission check for Room Voice and higher
    if (!room.dice) return this.errorReply("There is no game of dice ongoing in this room.");
    room.dice.end();
  },

  dicehelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
      `<div><b><center>Dice Game Commands</center></b>` +
      `<ul>` +
      `<li><code>/startdice [amount]</code> - Starts a game of dice for the specified number of coins. Requires Room Voice (+) or higher.</li>` +
      `<li><code>/joindice</code> - Joins an ongoing game of dice in the room. Requires Room Voice (+) or higher.</li>` +
      `<li><code>/leavedice</code> - Leaves an ongoing game of dice before it starts. Requires Room Voice (+) or higher.</li>` +
      `<li><code>/enddice</code> - Ends an ongoing game of dice in the room. Requires Room Voice (+) or higher.</li>` +
      `<li><code>/dicehelp</code> - Displays this help message.</li>` +
      `</ul></div>`
    );
  },
};
