/**
 * Heath & Fitness chat-plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles health and fitness daily challenges as well as a daily quote
 *
 * @license MIT license
 */
'use strict';

const FS = require('../fs');

const HF_DATA_PATH = 'config/chat-plugins/health-fitness.json';
const MAX_DATA_LENGTH = 500;

class HealthFitness {
	constructor() {
		this.hfData = {
			cardio: '',
			gym: '',
			quote: '',
		};

		try {
			this.hfData = require(`../${HF_DATA_PATH}`);
		} catch (error) {
			if (error.code !== 'MODULE_NOT_FOUND' && error.code !== 'ENOENT') throw error;
		}
	}
	saveData() {
		FS(HF_DATA_PATH).writeUpdate(() => JSON.stringify(this.hfData));
	}
	setCardio(cardio) {
		this.hfData.cardio = cardio;
		this.saveData();
	}
	setGym(gym) {
		this.hfData.gym = gym;
		this.saveData();
	}
	setQuote(quote) {
		this.hfData.quote = quote;
		this.saveData();
	}
}
const HF = new HealthFitness();
const NOT_SET = '(not set yet)';

exports.commands = {
	hellafit: 'healthfitness',
	health: 'healthfitness',
	fitness: 'healthfitness',
	healthfitness: {
		' ': '',
		'': function (target, room, user) {
			if (room.id !== 'healthfitness') return this.errorReply("This command can only be used in Health & Fitness.");
			if (!this.runBroadcast()) return;
			const cardio = Chat.formatText(HF.hfData.cardio || NOT_SET);
			const gym = Chat.formatText(HF.hfData.gym || NOT_SET);
			const quote = Chat.formatText(HF.hfData.quote || NOT_SET);
			return this.sendReplyBox(
				`<strong>Cardio Challenge:</strong> ${cardio}<br />` +
				`<strong>Gym Challenge:</strong> ${gym}<br />` +
				`<strong>Quote of the Day:</strong> ${quote}<br />`
			);
		},
		cardio: function (target, room, user) {
			if (room.id !== 'healthfitness') return this.errorReply("This command can only be used in Health & Fitness.");
			if (!target) {
				if (!this.canBroadcast('!healthfitness cardio')) return;
				if (this.broadcastMessage && !this.can('broadcast', null, room)) return false;

				if (!this.runBroadcast('!healthfitness cardio')) return;

				const cardio = Chat.formatText(HF.hfData.cardio || NOT_SET);
				return this.sendReplyBox(`<strong>Cardio Challenge:</strong> ${cardio}`);
			} else {
				if (!this.can('broadcast', null, room)) return;
				if (target.length > MAX_DATA_LENGTH) return this.errorReply(`This challenge is too long; it cannot exceed ${MAX_DATA_LENGTH} characters.`);
				target = target.trim();

				target = this.canTalk(target);
				if (!target) return;

				HF.setCardio(target);
				this.privateModCommand(`(${user.name} has set the cardio challenge to: ${target})`);
				this.sendReply(`The daily cardio challenge has been updated to: ${target}`);
			}
		},
		gym: function (target, room, user) {
			if (room.id !== 'healthfitness') return this.errorReply("This command can only be used in Health & Fitness.");
			if (!target) {
				if (!this.canBroadcast('!healthfitness gym')) return;
				if (this.broadcastMessage && !this.can('broadcast', null, room)) return false;

				if (!this.runBroadcast('!healthfitness gym')) return;

				const gym = Chat.formatText(HF.hfData.gym || NOT_SET);
				return this.sendReplyBox(`<strong>Gym Challenge:</strong> ${gym}`);
			} else {
				if (!this.can('broadcast', null, room)) return;
				if (target.length > MAX_DATA_LENGTH) return this.errorReply(`This challenge is too long; it cannot exceed ${MAX_DATA_LENGTH} characters.`);
				target = target.trim();

				target = this.canTalk(target);
				if (!target) return;

				HF.setGym(target);
				this.privateModCommand(`(${user.name} has set the gym challenge to: ${target})`);
				this.sendReply(`The daily gym challenge has been updated to: ${target}`);
			}
		},
		quote: function (target, room, user) {
			if (room.id !== 'healthfitness') return this.errorReply("This command can only be used in Health & Fitness.");
			if (!target) {
				if (!this.canBroadcast('!healthfitness quote')) return;
				if (this.broadcastMessage && !this.can('broadcast', null, room)) return false;

				if (!this.runBroadcast('!healthfitness quote')) return;

				const quote = Chat.formatText(HF.hfData.quote || NOT_SET);
				return this.sendReplyBox(`<strong>Quote of the Day:</strong> ${quote}`);
			} else {
				if (!this.can('broadcast', null, room)) return;
				if (target.length > MAX_DATA_LENGTH) return this.errorReply(`This quote is too long; it cannot exceed ${MAX_DATA_LENGTH} characters.`);
				target = target.trim();

				target = this.canTalk(target);
				if (!target) return;

				HF.setQuote(target);
				this.privateModCommand(`(${user.name} has set the daily quote to: ${target})`);
				this.sendReply(`The daily quote has been updated to: ${target}`);
			}
		},
		help: function (target, room, user) {
			return this.parse("/help healthfitness");
		},
	},
	healthfitnesshelp: [
		"/healthfitness - Shows the daily cardio challenge, gym challenge, and quote of the day.",
		"/healthfitness cardio - Shows the cardio challenge of the day.",
		"/healthfitness cardio [challenge] - Sets the cardio challenge of the day. Requires: + or above",
		"/healthfitness gym - Shows the gym challenge of the day.",
		"/healthfitness gym [challenge] - Sets the gym challenge of the day. Requires: + or above",
		"/healthfitness quote - Shows the quote of the day.",
		"/healthfitness quote [quote] - Sets the quote of the day. Requires: + or above",
		"Note: These challenges and quotes support PS formatting (**bold**, __italics__, etc.)",
	],
};
