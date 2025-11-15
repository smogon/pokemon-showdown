/*
* Pokemon Showdown
* Poof Commands
*/

interface PoofConfig {
	poofOff?: boolean;
}

const messages: string[] = [
	`has vanished into nothingness!`,
	`used Explosion!`,
	`fell into the void.`,
	`went into a cave without a repel!`,
	`has left the building.`,
	`was forced to give StevoDuhHero's mom an oil massage!`,
	`was hit by Magikarp's Revenge!`,
	`ate a bomb!`,
	`is blasting off again!`,
	`(Quit: oh god how did this get here i am not good with computer)`,
	`was unfortunate and didn't get a cool message.`,
	`{{user}}'s mama accidentally kicked {{user}} from the server!`,
	`felt Insist's wrath.`,
	`got rekt by Travis CI!`,
	`exited life.exe.`,
	`found a species called "friends" (whatever that means).`,
	`tripped over a wireless cable.`,
	`ragequit due to hax.`,
	`got lost in Verdanturf Tunnel without Flash.`,
	`forgot to save and reset to Route 1.`,
	`was whisked away by a Latios.`,
	`used Teleport and couldn't find the way back.`,
	`pressed Alt+F4 to increase FPS.`,
	`fell asleep counting Mareep.`,
	`slipped on a banana peel trap set by a Shiftry.`,
	`got too comfy in the PC Box.`,
	`went AFK to catch a shiny... still looking.`,
	`encountered MissingNo. and evaporated.`,
	`was KO'd by a level 1 Endeavor + Quick Attack.`,
	`clicked the big red button.`,
	`forgot their Exp. Share at home.`,
	`got hugged by a Bewear a little too hard.`,
	`used Self-Destruct IRL (bad idea).`,
	`failed a Focus Blast and left in shame.`,
	`got tangled in Substitute dolls.`,
	`fell for the oldest Shedinja trick in the book.`,
	`met a Wobbuffet in a dead-end corridor.`,
	`ate too many RageCandyBars.`,
	`was last seen surfing on a puddle.`,
	`got distracted by a Poffin contest.`,
	`forgot their HM buddy and can't cut grass.`,
	`tried to Dynamax in a small room.`,
	`was caught by a Master Ball and relocated.`,
	`ran out of Repels in Victory Road.`,
];

const generateRandomColor = (): string => {
	return "#" + Array(3).fill(0).map(() => {
		const part = Math.floor(Math.random() * 0xaa);
		return (part < 0x10 ? "0" : "") + part.toString(16);
	}).join("");
};

const getRandomMessage = (): string => {
	return messages[Math.floor(Math.random() * messages.length)];
};

const formatMessage = (message: string, userName: string): string => {
	let formattedMessage = message;
	if (!formattedMessage.includes('{{user}}')) {
		formattedMessage = `{{user}} ${formattedMessage}`;
	}
	return formattedMessage.replace(/{{user}}/g, userName);
};

const isPoofDisabled = (): boolean => {
	return !!(Config as PoofConfig).poofOff;
};

const setPoofState = (enabled: boolean): void => {
	(Config as PoofConfig).poofOff = !enabled;
};

export const commands: Chat.ChatCommands = {
	poof: {
		''(target: string, room: Room, user: User): void {
			if (isPoofDisabled()) {
				return this.errorReply("Poof is currently disabled.");
			}
			const message = target || getRandomMessage();
			const formattedMessage = formatMessage(message, user.name);

			if (!this.canTalk(formattedMessage)) return;

			const colour = generateRandomColor();
			const msg = `<center><strong><font color="${colour}">~~ ${formattedMessage || target} ` +
				`~~</font></strong></center>`;
			room.addRaw(msg);
			user.disconnectAll();
		},

		on(target: string, room: Room, user: User): void {
			this.checkCan('roomowner');
			setPoofState(true);
			this.sendReply("Poof is now enabled.");
		},
		onhelp: ["/poof on - Enable the use /poof command. Requires: &"],

		off(target: string, room: Room, user: User): void {
			this.checkCan('roomowner');
			setPoofState(false);
			this.sendReply("Poof is now disabled.");
		},
		offhelp: ["/poof off - Disable the use of the /poof command. Requires: &"],
	},

	d: 'poof',
	cpoof: 'poof',

	poofon: 'poof on',
	poofoff: 'poof off',
	nopoof: 'poof off',

	poofhelp(): void {
		if (!this.runBroadcast()) return;
		const helpList = [
			{
				cmd: "/poof [message]",
				desc: "Disconnects the user and leaves a message in the lobby.",
			},
			{
				cmd: "/poof on",
				desc: "Enable the use of /poof command. Requires: &.",
			},
			{
				cmd: "/poof off",
				desc: "Disable the use of the /poof command. Requires: &.",
			},
		];
		const html = `<center><strong>Poof Commands:<br>Aliases: /d, /cpoof</strong></center>` +
			`<hr><ul style="list-style-type:none;padding-left:0;">` +
			helpList.map(({ cmd, desc }, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
};
