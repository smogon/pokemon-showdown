/* Miscellaneous Commands
* Credits: Unknown
* Updates & Typescript Conversion:
* Prince Sky
*/

/* Poof Messages */
const messages: string[] = [
  "went to find a MissingNo.",
  "tried to pet a wild Garbodor.",
  "challenged a Bidoof to a staring contest.",
  "got lost in the Safari Zone... again.",
  "tried to trade a Haunter without a Link Cable.",
  "used Splash. It was ineffective.",
  "tried to use Dig indoors.",
  "got OHKO'd by a Rattata.",
  "tried to teach a rock Rock Smash.",
  "went to find the Lavender Town theme.",
  "tried to surf on land.",
  "got turned into a Metapod.",
  "tried to outsmart a Wobbuffet.",
  "went to find a shiny... and failed.",
  "tried to use Cut on a steel beam.",
  "got rekt by a team of Magikarp.",
  "tried to use a Master Ball on a Caterpie.",
  "went to find a Legendary with a regular Poké Ball.",
  "tried to use Sweet Scent in a cave.",
  "got lost trying to find the 'Any' key.",
  "tried to pay rent with Poké Dollars.",
  "went to find a good nature and IVs.",
  "tried to assemble IKEA furniture for a secret base.",
  "got convinced birds aren't real by a Natu.",
  "went to explain competitive Pokémon to a casual player.",
  "tried to fold a fitted sheet at the Pokémon Center.",
  "got stuck in a loop of 'I choose you!'",
  "went to find a matching pair of socks in tall grass.",
  "tried to parallel park a blimp near the Battle Frontier.",
  "got stuck explaining their job to their grandparents via PokéGear.",
  "went to remember their password for the Pokémon Storage System.",
  "tried to cook something simple and set off the smoke alarm in the Pokémon Center.",
  "got lost trying to follow GPS directions to the next gym.",
  "went to find a rare TM and deleted their save file.",
  "tried to use a repel and found a legendary.",
  "got defeated by a self-checkout machine at the Goldenrod Department Store.",
  "went to find a hidden Mew under the truck.",
  "tried to mind control a Psychic Pokémon.",
  "got defeated by 6 Smeargles using Metronome.",
  "went to find a fishing rod in a volcano.",
  "tried to use a rare candy on a level 100 Pokemon.",
  "got trapped in a never-ending battle with a Metapod.",
  "went to find the distortion world.",
  "tried to steal a bike from a child.",
  "got haxed by a crit and ragequit.",
  "went to set up hazards against a Taunt user.",
  "tried to outspeed a Choice Scarf user with 252 Speed.",
  "got swept by a Baton Passed Swords Dance.",
  "went to use a setup move on an Unaware user.",
  "tried to outsmart a Shedinja.",
  "got rekt by a team of 6 Pikachus.",
  "went to find a shiny by soft resetting and gave up.",
  "got trapped in an endless Toxic stall.",
  "tried to trade a Kadabra without a link cable.",
  "got lost in the safari zone and ran out of safari balls.",
  "went to use a fire move on a water pokemon.",
  "tried to use attract, and it worked on a rock.",
  "got trapped in a loop of confusion and self inflicted damage.",
  "went to use roost, and it was a flying type that was already flying.",
  "tried to heal a fainted pokemon.",
  "got trapped in a never-ending 'I choose you!' loop.",
  "went to find the Indigo Disk.",
  "tried to out-sing a Jigglypuff.",
  "got stuck trying to catch a Feebas with an Old Rod.",
  "went to find the source of the Lavender Town ghost stories.",
  "tried to use Dig in a Sky Battle.",
  "got challenged to a battle by a trainer with 6 Bidoof.",
  "went to find the legendary Regigigas in Snowpoint Temple.",
  "tried to explain to a toddler why they can't have ice cream at the Pokémon Mart.",
  "got trapped in a never-ending battle with a wild Wobbuffet.",
  "went to find the secret of the Azure Flute.",
  "tried to use a full restore on a full hp pokemon.",
  "got lost trying to find the move deleter.",
  "went to challenge Cynthia's Garchomp.",
  "tried to use earthquake on a flying type.",
  "got rekt by a trainer using only magikarp.",
  "went to find the secret of the Relic Castle.",
  "tried to use attract on a rock.",
  "got stuck in a confusion loop.",
  "went to find the giant chasm.",
  "tried to use a water move on a dry skin pokemon.",
  "got trapped in a never-ending toxic stall.",
  "went to find the strange house.",
  "tried to use a grass move on a sap sipper pokemon.",
  "got lost trying to find sea mauville.",
  "went to find the kalos power plant.",
  "tried to use a sound move on a soundproof pokemon.",
  "got trapped in a never-ending baton pass chain.",
  "went to find the terminus cave.",
  "tried to use a powder move on a grass type.",
  "got rekt by a trainer using only dittos.",
  "went to find the ultra megalopolis.",
  "tried to use a bite move on a liquid ooze pokemon.",
  "got trapped in a never-ending setup chain.",
  "went to find the crown tundra.",
  "tried to use a punch move on a iron fist pokemon.",
  "got rekt by a trainer using only legendaries.",
  "went to find the galar wild area.",
  "tried to use a dance move on a dancer pokemon.",
  "got trapped in a never-ending metronome chain.",
  "went to find the great crater.",
  "tried to use a recoil move on a rock head pokemon.",
  "got rekt by a trainer using only paradox pokemon.",
  "went to find the kitakami festival.",
  "tried to use a status move on a safeguard pokemon.",
  "got trapped in a never-ending status move chain.",
  "went to find the indigo disk terrarium.",
  "tried to use a move that ignores abilities on a simple pokemon.",
  "got turned into a diglett.",
];

export const commands: Chat.ChatCommands = {
  clearall(target: string, room: ChatRoom | null, user: User): void {
	  if (room?.battle) {
		  return this.sendReply("You cannot clearall in battle rooms.");
	  }
    if (!room) {
      return this.errorReply("This command requires a room.");
	 }
	  this.checkCan('roommod', null, room);
    Impulse.clearRooms([room], user);
  },

  globalclearall(target: string, room: ChatRoom | null, user: User): void {
	  this.checkCan('globalban', null, room);

    const roomsToClear = Rooms.global.chatRooms.filter((chatRoom): chatRoom is Room => !!chatRoom && !chatRoom.battle);
    const clearedRooms = Impulse.clearRooms(roomsToClear, user);
  },

  d: 'poof',
  cpoof: 'poof',
  poof(target: string, room: ChatRoom | null, user: User): boolean | void {
    if (target && this.checkCan('makegroupchat'));
    let message: string = target || messages[Math.floor(Math.random() * messages.length)];
    if (!this.canTalk(message)) return false;

    const colour: string = '#' + [1, 1, 1].map(() => {
      const part: number = Math.floor(Math.random() * 0xaa);
      return (part < 0x10 ? '0' : '') + part.toString(16);
    }).join('');

    if (room) {
      if (user.lastPoofMessage === message) {
        return this.sendReply("**I've already used that message, let's try a different one!**");
      } else {
        room.addRaw(`<center><strong><font color="${colour}">~~ ${user.name} ${Chat.escapeHTML(message)} ~~</font></strong></center>`);
      }
    }
    user.lastPoof = Date.now();
    user.lastPoofMessage = message;
    user.disconnectAll();
  },

	/************************************
    * Add this code in server/users.ts *
	 * In onDisconnect Function         *
    * if (this.named) {                *
 	 * Db.seen.set(this.id, Date.now());*
	 * }                                *
    ***********************************/

	seen(target: string | null, room: Room | User, user: User) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		const targetUser = Users.get(target);
		if (targetUser?.connected) {
			return this.sendReplyBox(`${Impulse.nameColor(targetUser.name, true, true)} is <b><font color='limegreen'>Currently Online</b></font>.`);
		}
		const targetId = toID(target);
		const seen = Db.seen.get(targetId);
		if (!seen) {
			return this.sendReplyBox(`${Impulse.nameColor(target, true, true)} has <b><font color='red'>never been online</font></b> on this server.`);
		}
		this.sendReplyBox(`${Impulse.nameColor(target, true, true)} was last seen <b>${Chat.toDurationString(Date.now() - seen, { precision: true })}</b> ago.`);
	},

	seenhelp: [`/seen [user] - Shows when the user last connected on the server.`],

  mischelp(target, room, user) {
    if (!this.runBroadcast()) return;
    this.sendReplyBox(
		 `<div><b><center>Miscellaneous Commands</center></b>` +
		 `<ul><li><code>/clearall</code> - Clears chatroom. (Requires: #)</li>` +
		 `<li><code>/globalclearall</code> - Clears all chatrooms. (Requires: @ and higher)</li>` +
		 `<li><code>/poof</code> - Disconnect from server with random message.</li>` +
		 `<li><code>/seen [user]</code> - Shows when the user last connected on the server.</li>` +
		 `</ul></div>`);
  },

  impulsehelp(target, room, user) {
	  if (!this.runBroadcast()) return;
	  this.sendReplyBox(
		  `<div><b><center>Impulse Server Commands</center></b>` +
		  `<ul><li><code>/animemangahelp</code> - Shows Anime & Manga Commands</li>` +
		  `<li><code>/customavatarhelp</code> - Shows Custom Avatar Commands</li>` +
		  `<li><code>/customcolorhelp</code> - Shows Custom Color Commands</li>` +
		  `<li><code>/economyhelp</code> - Shows Economy Commands</li>` +
		  `<li><code>/exphelp</code> - Shows Exp Commands</li>` +
		  `<li><code>/mischelp</code> - Shows Misc Commands</li>` +
		  `<li><code>/servernewshelp</code> - Shows Server News Commands</li>` +
		  `<li><code>/shophelp</code> - Shows Shop Commands</li>` +
		  `<li><code>/iconhelp</code> - Shows User Icon Commands</li>` +
		  `</ul>`
		  );
  },
		  
};
