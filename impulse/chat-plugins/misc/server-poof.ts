/*
* Pokemon Showdown
* Poof Commands
* Refactored from server-poof.js
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
];

class PoofManager {
	static generateRandomColor(): string {
		return "#" + Array(3).fill(0).map(() => {
			const part = Math.floor(Math.random() * 0xaa);
			return (part < 0x10 ? "0" : "") + part.toString(16);
		}).join("");
	}

	static getRandomMessage(): string {
		return messages[Math.floor(Math.random() * messages.length)];
	}

	static formatMessage(message: string, userName: string): string {
		let formattedMessage = message;
		if (formattedMessage.indexOf('{{user}}') < 0) {
			formattedMessage = `{{user}} ${formattedMessage}`;
		}
		return formattedMessage.replace(/{{user}}/g, userName);
	}

	static isPoofDisabled(): boolean {
		return !!(Config as PoofConfig).poofOff;
	}

	static enablePoof(): void {
		(Config as PoofConfig).poofOff = false;
	}

	static disablePoof(): void {
		(Config as PoofConfig).poofOff = true;
	}
}

export const commands: Chat.ChatCommands = {
	poof: {
		'': function (target: string, room: Room, user: User): void {
			if (PoofManager.isPoofDisabled()) {
				return this.errorReply("Poof is currently disabled.");
			}
			if (target && !this.can("broadcast")) return;
			if (room.roomid !== "lobby") return;

			const message = target || PoofManager.getRandomMessage();
			const formattedMessage = PoofManager.formatMessage(message, user.name);

			if (!this.canTalk(formattedMessage)) return;

			const colour = PoofManager.generateRandomColor();
			room.addRaw(`<center><strong><font color=\"${colour}\">~~ ${formattedMessage} ~~</font></strong></center>`);
			user.disconnectAll();
		},

		on: function (target: string, room: Room, user: User): void {
			this.checkCan('roomowner');
			PoofManager.enablePoof();
			this.sendReply("Poof is now enabled.");
		},
		onhelp: ["/poof on - Enable the use /poof command. Requires: #"],

		off: function (target: string, room: Room, user: User): void {
			this.checkCan('roomowner');
			PoofManager.disablePoof();
			this.sendReply("Poof is now disabled.");
		},
		offhelp: ["/poof off - Disable the use of the /poof command. Requires: #"],
	},

	// Aliases
	d: 'poof',
	cpoof: 'poof',

	// Legacy commands for backward compatibility
	poofon: 'poof on',
	poofoff: 'poof off',
	nopoof: 'poof off',

	poofhelp(): void {
		if (!this.runBroadcast()) return;
		const helpList = [
			{cmd: "/poof [message]", desc: "Disconnects the user and leaves a message in the lobby."},
			{cmd: "/poof on", desc: "Enable the use of /poof command. Requires: #."},
			{cmd: "/poof off", desc: "Disable the use of the /poof command. Requires: #."},
		];
		const html = `<center><strong>Poof Commands:<br>Aliases: /d, /cpoof</strong></center><hr><ul style=\"list-style-type:none;padding-left:0;\">` +
			helpList.map(({cmd, desc}, i) =>
				`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
			).join('') +
			`</ul>`;
		this.sendReplyBox(html);
	},
};