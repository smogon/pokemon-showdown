/**
 * Scavengers Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is a game plugin to host scavenger games specifically in the Scavengers room,
 * where the players will race answer several hints.
 *
 * @license MIT license
 */

import { FS, Utils } from '../../lib';
import { ScavMods, type TwistEvent } from './scavenger-games';
import type { ChatHandler } from '../chat';

type GameTypes = 'official' | 'regular' | 'mini' | 'unrated' | 'practice' | 'recycled';

export interface QueuedHunt {
	hosts: { id: string, name: string, noUpdate?: boolean }[];
	questions: (string | string[])[];
	isHTML: boolean;
	staffHostId: string;
	staffHostName: string;
	gameType: GameTypes;
}
export interface FakeUser {
	name: string;
	id: string;
	noUpdate?: boolean;
}
interface ModEvent {
	priority: number;
	exec: TwistEvent;
}

const RATED_TYPES = ['official', 'regular', 'mini'];
const DEFAULT_POINTS: { [k: string]: number[] } = {
	official: [20, 15, 10, 5, 1],
};
const DEFAULT_BLITZ_POINTS: { [k: string]: number } = {
	official: 10,
};
const DEFAULT_HOST_POINTS = 4;
const DEFAULT_TIMER_DURATION = 120;

const DATA_FILE = 'config/chat-plugins/ScavMods.json';
const HOST_DATA_FILE = 'config/chat-plugins/scavhostdata.json';
const PLAYER_DATA_FILE = 'config/chat-plugins/scavplayerdata.json';
const DATABASE_FILE = 'config/chat-plugins/scavhunts.json';

const ACCIDENTAL_LEAKS = /^((?:\s)?(?:\/{2,}|[^\w/]+)|\s\/)?(?:\s)?(?:s\W?cavenge|s\W?cav(?:engers)? guess|d\W?t|d\W?ata|d\W?etails|g\W?(?:uess)?|v)\b/i;

const FILTER_LENIENCY = 7;

const HISTORY_PERIOD = 6; // months

const databaseContentsJSON = FS(DATABASE_FILE).readIfExistsSync();
const scavengersData = databaseContentsJSON ? JSON.parse(databaseContentsJSON) : { recycledHunts: [] };

const SCAVENGER_ROOMID = 'scavengers';
function getScavsRoom(room?: Room) {
	if (!room) return Rooms.get(SCAVENGER_ROOMID);
	if (room.roomid === SCAVENGER_ROOMID) return room;
	if (room.parent?.roomid === SCAVENGER_ROOMID) return room.parent;
	return null;
}

// Normalize answers before checking, eg: Pokémon! -> pokemon
export function sanitizeAnswer(answer: string): string {
	return toID(answer.normalize('NFD'));
}

class Ladder {
	file: string;
	data: { [userid: string]: AnyObject };
	constructor(file: string) {
		this.file = file;
		this.data = {};

		this.load();
	}

	load() {
		const json = FS(this.file).readIfExistsSync();
		if (json) this.data = JSON.parse(json);
	}

	addPoints(name: string, aspect: string, points: number, noUpdate?: boolean) {
		const userid = toID(name);

		if (!userid || userid === 'constructor' || !points) return this;
		if (!this.data[userid]) this.data[userid] = { name };

		if (!this.data[userid][aspect]) this.data[userid][aspect] = 0;
		this.data[userid][aspect] += points;

		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	reset() {
		this.data = {};
		return this; // allow chaining
	}

	write() {
		FS(this.file).writeUpdate(() => JSON.stringify(this.data));
	}

	visualize(sortBy: string): Promise<({ rank: number } & AnyObject)[]>;
	visualize(sortBy: string, userid: ID): Promise<({ rank: number } & AnyObject) | undefined>;
	visualize(sortBy: string, userid?: ID) {
		// return a promise for async sorting - make this less exploitable
		return new Promise((resolve, reject) => {
			let lowestScore = Infinity;
			let lastPlacement = 1;

			const ladder = Utils.sortBy(
				Object.entries(this.data).filter(([u, bit]) => sortBy in bit),
				([u, bit]) => -bit[sortBy]
			).map(([u, chunk], i) => {
				if (chunk[sortBy] !== lowestScore) {
					lowestScore = chunk[sortBy];
					lastPlacement = i + 1;
				}
				return {
					rank: lastPlacement,
					...chunk,
				} as { rank: number } & AnyObject;
			}); // identify ties
			if (userid) {
				const rank = ladder.find(entry => toID(entry.name) === userid);
				resolve(rank);
			} else {
				resolve(ladder);
			}
		});
	}
}

class PlayerLadder extends Ladder {
	override addPoints(name: string, aspect: string, points: number, noUpdate?: boolean) {
		if (!aspect.startsWith('cumulative-')) {
			this.addPoints(name, `cumulative-${aspect}`, points, noUpdate);
		}
		const userid = toID(name);

		if (!userid || userid === 'constructor' || !points) return this;
		if (!this.data[userid]) this.data[userid] = { name };

		if (!this.data[userid][aspect]) this.data[userid][aspect] = 0;
		this.data[userid][aspect] += points;

		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	// add the different keys to the history - async for larger leaderboards
	// FIXME: this is not what "async" means
	softReset() {
		return new Promise<void>((resolve, reject) => {
			for (const u in this.data) {
				const userData = this.data[u];
				for (const a in userData) {
					if (/^(?:cumulative|history)-/i.test(a) || a === 'name') continue; // cumulative does not need to be soft reset
					const historyKey = 'history-' + a;

					if (!userData[historyKey]) userData[historyKey] = [];

					userData[historyKey].unshift(userData[a]);
					userData[historyKey] = userData[historyKey].slice(0, HISTORY_PERIOD);

					userData[a] = 0; // set it back to 0
					// clean up if history is all 0's
					if (!userData[historyKey].some((p: any) => !!p)) {
						delete userData[a];
						delete userData[historyKey];
					}
				}
			}
			resolve();
		});
	}

	hardReset() {
		this.data = {};
		return this; // allow chaining
	}
}

// initialize roomsettings
const LeaderboardRoom = getScavsRoom();

const Leaderboard = LeaderboardRoom?.scavLeaderboard?.scavsLeaderboard || new Ladder(DATA_FILE);
const HostLeaderboard = LeaderboardRoom?.scavLeaderboard?.scavsHostLeaderboard || new PlayerLadder(HOST_DATA_FILE);
const PlayerLeaderboard = LeaderboardRoom?.scavLeaderboard?.scavsPlayerLeaderboard ||
	new PlayerLadder(PLAYER_DATA_FILE);

if (LeaderboardRoom) {
	if (!LeaderboardRoom.scavLeaderboard) LeaderboardRoom.scavLeaderboard = {};
	// bind ladders to scavenger room to persist through restarts
	LeaderboardRoom.scavLeaderboard.scavsLeaderboard = Leaderboard;
	LeaderboardRoom.scavLeaderboard.scavsHostLeaderboard = HostLeaderboard;
	LeaderboardRoom.scavLeaderboard.scavsPlayerLeaderboard = PlayerLeaderboard;
}

function formatQueue(queue: QueuedHunt[] | undefined, viewer: User, room: Room, broadcasting?: boolean) {
	const showStaff = viewer.can('mute', null, room) && !broadcasting;
	const queueDisabled = room.settings.scavSettings?.scavQueueDisabled;
	const timerDuration = room.settings.scavSettings?.defaultScavTimer || DEFAULT_TIMER_DURATION;
	let buffer;
	if (queue?.length) {
		buffer = queue.map((item, index) => {
			const removeButton = `<button name="send" value="/scav dequeue ${index}" style="color: red; background-color: transparent; border: none; padding: 1px;">[x]</button>`;
			const startButton = `<button name="send" value="/scav next ${index}" style="color: green; background-color: transparent; border: none; padding: 1px;">[start]</button>`;
			const unratedText = item.gameType === 'unrated' ?
				'<span style="color: blue; font-style: italic">[Unrated]</span> ' :
				'';
			const hosts = Utils.escapeHTML(Chat.toListString(item.hosts.map(h => h.name)));
			const queuedBy = item.hosts.every(h => h.id !== item.staffHostId) ? ` / ${item.staffHostId}` : '';
			let questions;
			if (!broadcasting && (item.hosts.some(h => h.id === viewer.id) || viewer.id === item.staffHostId)) {
				questions = item.questions.map(
					(q, i) => {
						if (i % 2) {
							q = q as string[];
							return Utils.html`<span style="color: green"><em>[${q.join(' / ')}]</em></span><br />`;
						} else {
							q = q as string;
							return item.isHTML ? q : Utils.escapeHTML(q);
						}
					}
				).join(" ");
			} else {
				questions = `[${item.questions.length / 2} hidden questions]`;
			}
			return `<tr><td>${removeButton}${startButton}&nbsp;${unratedText}${hosts}${queuedBy}</td><td><div style="overflow:auto; max-width: 100vw; max-height: 30vh">${questions}</div></td></tr>`;
		}).join("");
	} else {
		buffer = `<tr><td colspan=3>The scavenger queue is currently empty.</td></tr>`;
	}
	let template = `<div class="ladder"><table style="width: 100%;table-layout:fixed;"><tr><th>By</th><th>Questions</th></tr>${showStaff ? buffer : buffer.replace(/<button.*?>.+?<\/button>/gi, '')}</table></div>`;
	if (showStaff) {
		template += `<table style="width: 100%"><tr><td style="text-align: left;">Auto Timer Duration: ${timerDuration} minutes</td><td>Auto Dequeue: <button class="button${!queueDisabled ?
			'" name="send" value="/scav disablequeue"' :
			' disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;"'}>OFF</button>&nbsp;<button class="button${queueDisabled ?
			'" name="send" value="/scav enablequeue"' :
			' disabled" style="font-weight:bold; color:#575757; font-weight:bold; background-color:#d3d3d3;"'}>ON</button></td><td style="text-align: right;"><button class="button" name="send" value="/scav next 0">Start the next hunt</button></td></tr></table>`;
	}
	return template;
}

class ScavengerHuntDatabase {
	static getRecycledHuntFromDatabase() {
		// Return a random hunt from the database.
		return scavengersData.recycledHunts[Math.floor(Math.random() * scavengersData.recycledHunts.length)];
	}

	static addRecycledHuntToDatabase(hosts: FakeUser[], params: (string | string[])[]) {
		const huntSchema: { hosts: FakeUser[], questions: AnyObject[] } = {
			hosts,
			questions: [],
		};

		let questionSchema: { text: string, answers: string[], hints?: string[] } = {
			text: '',
			answers: [],
			hints: [],
		};

		for (let i = 0; i < params.length; ++i) {
			if (i % 2 === 0) {
				const questionText = params[i] as string;
				questionSchema.text = questionText;
			} else {
				const answerText = params[i] as string[];
				questionSchema.answers = answerText;
				huntSchema.questions.push(questionSchema);
				questionSchema = {
					text: '',
					answers: [],
					hints: [],
				};
			}
		}

		scavengersData.recycledHunts.push(huntSchema);
		this.updateDatabaseOnDisk();
	}

	static removeRecycledHuntFromDatabase(index: number) {
		scavengersData.recycledHunts.splice(index - 1, 1);
		this.updateDatabaseOnDisk();
	}

	static addHintToRecycledHunt(huntNumber: number, questionNumber: number, hint: string) {
		scavengersData.recycledHunts[huntNumber - 1].questions[questionNumber - 1].hints.push(hint);
		this.updateDatabaseOnDisk();
	}

	static removeHintToRecycledHunt(huntNumber: number, questionNumber: number, hintNumber: number) {
		scavengersData.recycledHunts[huntNumber - 1].questions[questionNumber - 1].hints.splice(hintNumber - 1);
		this.updateDatabaseOnDisk();
	}

	static updateDatabaseOnDisk() {
		FS(DATABASE_FILE).writeUpdate(() => JSON.stringify(scavengersData));
	}

	static isEmpty() {
		return scavengersData.recycledHunts.length === 0;
	}

	static hasHunt(hunt_number: number) {
		return !isNaN(hunt_number) && hunt_number > 0 && hunt_number <= scavengersData.recycledHunts.length;
	}

	static getFullTextOfHunt(
		hunt: { hosts: FakeUser[], questions: { text: string, answers: string[], hints?: string[] }[] }
	) {
		return `${hunt.hosts.map(host => host.name).join(',')} | ${hunt.questions.map(question => `${question.text} | ${question.answers.join(';')}`).join(' | ')}`;
	}
}
export class ScavengerHunt extends Rooms.RoomGame<ScavengerHuntPlayer> {
	override readonly gameid = 'scavengerhunt' as ID;
	gameType: GameTypes;
	joinedIps: string[];
	startTime: number;
	questions: { hint: string, answer: string[], spoilers: string[] }[];
	completed: AnyObject[];
	leftHunt: { [userid: string]: 1 | undefined };
	hosts: FakeUser[];
	isHTML: boolean;
	modsList: string[];
	mods: { [k: string]: ModEvent[] };
	staffHostId: string;
	staffHostName: string;
	scavGame: true;
	timerEnd: number | null;
	override timer: NodeJS.Timeout | null;

	override readonly checkChat = true;

	[k: string]: any; // for purposes of adding new temporary properties for the purpose of twists.
	constructor({ room, staffHost, hosts, gameType, questions, isHTML, mod }:
	{
		room: Room,
		staffHost: User | FakeUser,
		hosts: FakeUser[],
		gameType: GameTypes,
		questions: (string | string[])[],
		isHTML?: boolean,
		mod?: string | string[],
	}) {
		super(room);

		this.allowRenames = true;
		this.gameType = gameType;
		this.playerCap = Infinity;

		this.joinedIps = [];

		this.startTime = Date.now();
		this.questions = [];
		this.completed = [];

		this.leftHunt = {};

		this.hosts = hosts;

		this.isHTML = !!isHTML;

		this.modsList = [];
		this.mods = {};

		this.timer = null;
		this.timerEnd = null;

		this.staffHostId = staffHost.id;
		this.staffHostName = staffHost.name;
		this.cacheUserIps(staffHost); // store it in case of host subbing

		this.title = 'Scavenger Hunt';
		this.scavGame = true;

		if (this.room.scavgame) {
			this.loadMods(this.room.scavgame.mod);
		}
		if (mod) {
			this.loadMods(mod);
		} else if (this.gameType === 'official' && this.room.settings.scavSettings?.officialtwist) {
			this.loadMod(this.room.settings.scavSettings?.officialtwist);
		}

		this.runEvent('Load');
		this.onLoad(questions);
		this.runEvent('AfterLoad');
	}

	loadMods(modInformation: any) {
		if (Array.isArray(modInformation)) {
			for (const mod of modInformation) {
				this.loadMod(mod);
			}
		} else {
			this.loadMod(modInformation);
		}
	}

	loadMod(modData: string | ID | AnyObject) {
		let twist;
		if (typeof modData === 'string') {
			const modId = toID(modData) as string;
			if (!ScavMods.twists[modId]) return this.announce(`Invalid mod. Starting the hunt without the mod ${modId}.`);

			twist = ScavMods.twists[modId];
		} else {
			twist = modData;
		}
		this.modsList.push(twist.id);
		for (const key in twist) {
			if (!key.startsWith('on')) continue;
			const priority = twist[key + 'Priority'] || 0;
			if (!this.mods[key]) this.mods[key] = [];
			this.mods[key].push({ exec: twist[key], priority });
		}
		if (twist.isGameMode) {
			this.announce(`This hunt is part of an ongoing ${twist.name}.`);
		} else {
			this.announce(`This hunt uses the twist ${twist.name}.`);
		}
	}

	// alert new users that are joining the room about the current hunt.
	override onConnect(user: User, connection: Connection) {
		// send the fact that a hunt is currently going on.
		connection.sendTo(this.room, this.getCreationMessage());
		this.runEvent('Connect', user, connection);
	}

	formatOutput(text: string): string {
		return this.isHTML ? text : Chat.formatText(text);
	}

	getCreationMessage(newHunt?: boolean): string {
		const message = this.runEvent('CreateCallback');
		if (message) return message;

		const hosts = Utils.escapeHTML(Chat.toListString(this.hosts.map(h => h.name)));
		const staffHost = this.hosts.some(h => h.id === this.staffHostId) ?
			`` :
			Utils.html` by <em>${this.staffHostName}</em>`;

		const article = ['official', 'unrated'].includes(this.gameType) && !newHunt ? 'An' : 'A';
		const huntType = `${article} ${newHunt ? 'new ' : ''}${this.gameType}`;

		return `|raw|<div class="broadcast-blue"><strong>${huntType} scavenger hunt by <em>${hosts}</em> has been started${staffHost}.</strong>` +
			`<div style="border:1px solid #CCC;padding:4px 6px;margin:4px 1px; overflow:scroll; max-height: 50vh">` +
			`<strong><em>Hint #1:</em> ${this.formatOutput(this.questions[0].hint)}</strong>` +
			`</div>` +
			`(To answer, use <kbd>/scavenge <em>ANSWER</em></kbd>)</div>`;
	}

	override joinGame(user: User) {
		if (this.hosts.some(h => h.id === user.id) || user.id === this.staffHostId) {
			return user.sendTo(
				this.room,
				"You cannot join your own hunt! If you wish to view your questions, use /viewhunt instead!"
			);
		}
		if (!Config.noipchecks && user.ips.some(ip => this.joinedIps.includes(ip))) {
			return user.sendTo(this.room, "You already have one alt in the hunt.");
		}
		if (this.runEvent('Join', user)) return false;
		if (this.addPlayer(user)) {
			this.cacheUserIps(user);
			delete this.leftHunt[user.id];
			user.sendTo(this.room, "You joined the scavenger hunt! Use the command /scavenge to answer.");
			this.onSendQuestion(user);
			return true;
		}
		user.sendTo(this.room, "You have already joined the hunt.");
		return false;
	}

	cacheUserIps(user: User | FakeUser) {
		// limit to 1 IP in every game.
		if (!('ips' in user)) return; // ghost user object cached from queue
		for (const ip of user.ips) {
			this.joinedIps.push(ip);
		}
	}

	override leaveGame(user: User) {
		const player = this.playerTable[user.id];

		if (!player) return user.sendTo(this.room, "You have not joined the scavenger hunt.");
		if (player.completed) return user.sendTo(this.room, "You have already completed this scavenger hunt.");
		this.runEvent('Leave', player);
		this.joinedIps = this.joinedIps.filter(ip => !player.joinIps.includes(ip));
		this.removePlayer(player);
		this.leftHunt[user.id] = 1;
		user.sendTo(this.room, "You have left the scavenger hunt.");
	}

	// overwrite the default makePlayer so it makes a ScavengerHuntPlayer instead.
	makePlayer(user: User) {
		return new ScavengerHuntPlayer(user, this);
	}

	onLoad(q: (string | string[])[]) {
		for (let i = 0; i < q.length; i += 2) {
			const hint = q[i] as string;
			const answer = q[i + 1] as string[];

			this.questions.push({ hint, answer, spoilers: [] });
		}

		const message = this.getCreationMessage(true);
		this.room.add(message).update();
	}

	// returns whether or not the next action should be stopped
	runEvent(event_id: string, ...args: any[]) {
		const events = this.mods['on' + event_id];
		if (!events) return;

		Utils.sortBy(events, event => -event.priority);
		let result = undefined;

		for (const event of events) {
			const subResult = event.exec.call(this, ...args) as any;
			if (subResult === true) return true;
			result = subResult;
		}

		return result === false ? true : result;
	}

	onEditQuestion(questionNumber: number, question_answer: string, value: string) {
		if (question_answer === 'question') question_answer = 'hint';
		if (!['hint', 'answer'].includes(question_answer)) return false;

		let answer: string[] = [];
		if (question_answer === 'answer') {
			answer = value.split(';').map(p => p.trim());
		}

		if (!questionNumber || questionNumber < 1 || questionNumber > this.questions.length || (!answer && !value)) {
			return false;
		}

		questionNumber--; // indexOf starts at 0

		if (question_answer === 'answer') {
			this.questions[questionNumber].answer = answer;
		} else {
			this.questions[questionNumber].hint = value;
		}

		this.announce(`The ${question_answer} for question ${questionNumber + 1} has been edited.`);
		if (question_answer === 'hint') {
			for (const p in this.playerTable) {
				this.playerTable[p].onNotifyChange(questionNumber);
			}
		}
		return true;
	}

	setTimer(minutes: number) {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			this.timerEnd = null;
		}

		if (minutes === 0) {
			return 'off';
		}
		if (minutes > 24 * 60) { // 24 hours
			throw new Chat.ErrorMessage(`Time limit must be under 24 hours (you asked for ${Chat.toDurationString(minutes * 60000)}).`);
		}
		if (minutes && minutes > 0) {
			this.timer = setTimeout(() => this.onEnd(), minutes * 60000);
			this.timerEnd = Date.now() + minutes * 60000;
		}

		return minutes;
	}

	override choose(user: User, originalValue: string) {
		if (!(user.id in this.playerTable)) {
			if (!this.joinGame(user)) return false;
		}
		const value = sanitizeAnswer(originalValue);

		const player = this.playerTable[user.id];

		if (this.runEvent('AnySubmit', player, value, originalValue)) return;
		if (player.completed) return false;

		this.validatePlayer(player);
		player.lastGuess = Date.now();

		if (this.runEvent('Submit', player, value, originalValue)) return false;

		if (player.verifyAnswer(value)) {
			if (this.runEvent('CorrectAnswer', player, value)) return;
			player.sendRoom("Congratulations! You have gotten the correct answer.");
			player.currentQuestion++;
			if (player.currentQuestion === this.questions.length) {
				this.onComplete(player);
			} else {
				this.onSendQuestion(user);
			}
		} else {
			if (this.runEvent('IncorrectAnswer', player, value)) return;
			throw new Chat.ErrorMessage("That is not the answer - try again!");
		}
	}

	getQuestion(question: number, showHints?: boolean) {
		const current = {
			question: this.questions[question - 1],
			number: question,
		};
		const finalHint = current.number === this.questions.length ? "Final " : "";

		return `|raw|<div class="ladder"><table style="width:100%;table-layout:fixed;"><tr>` +
			`<td style="width: 20%;"><strong style="white-space: nowrap">${finalHint}Hint #${current.number}:</strong></td>` +
			`<td><div style="overflow:auto; max-width: 100vw; max-height: 50vh">${
				this.formatOutput(current.question.hint) +
				(showHints && current.question.spoilers.length ?
					`<details><summary>Extra Hints:</summary>${
						current.question.spoilers.map(p => `- ${p}`).join('<br />')
					}</details>` :
					``)
			}</div></td>` +
			`</tr></table></div>`;
	}

	onSendQuestion(user: User | ScavengerHuntPlayer, showHints?: boolean) {
		if (!(user.id in this.playerTable) || this.hosts.some(h => h.id === user.id)) return false;

		const player = this.playerTable[user.id];
		if (player.completed) return false;

		if (this.runEvent('SendQuestion', player, showHints)) return;

		const questionDisplay = this.getQuestion(player.getCurrentQuestion().number, showHints);

		player.sendRoom(questionDisplay);
		return true;
	}

	onViewHunt(user: User) {
		if (this.runEvent('ViewHunt', user)) return;

		let qLimit = 1;
		if (this.hosts.some(h => h.id === user.id) || user.id === this.staffHostId)	{
			qLimit = this.questions.length + 1;
		} else if (user.id in this.playerTable) {
			const player = this.playerTable[user.id];
			qLimit = player.currentQuestion + 1;
		}

		user.sendTo(
			this.room,
			`|raw|<div class="ladder"><table style="width: 100%;table-layout:fixed;">` +
			`<tr><th style="width: 10%;">#</th><th style="width: 70%;">Hint</th><th style="width: 20%;">Answer</th></tr>` +
			this.questions.slice(0, qLimit).map((q, i) => (
				`<tr><td>${
					i + 1
				}</td><td><div style="overflow:auto; max-width: 100vw; max-height: 30vh">${
					this.formatOutput(q.hint) +
					(q.spoilers.length ?
						`<details><summary>Extra Hints:</summary>${
							q.spoilers.map(s => `- ${s}`).join('<br />')
						}</details>` :
						``)
				}</div></td><td>${
					i + 1 >= qLimit ?
						`` :
						Utils.escapeHTMLForceWrap(q.answer.join(' ; '))
				}</td></tr>`
			)).join("") +
			`</table><div>`
		);
	}

	onComplete(player: ScavengerHuntPlayer) {
		if (player.completed) return false;

		const now = Date.now();
		const time = Chat.toDurationString(now - this.startTime, { hhmmss: true });
		const canBlitz = this.completed.length < 3;

		const blitz = now - this.startTime <= 60000 && canBlitz &&
			(this.room.settings.scavSettings?.blitzPoints?.[this.gameType] || DEFAULT_BLITZ_POINTS[this.gameType]);

		player.completed = true;
		let result = this.runEvent('Complete', player, time, blitz);
		if (result === true) return;
		result = result || { name: player.name, time, blitz };
		this.completed.push(result);
		const place = Utils.formatOrder(this.completed.length);

		const completionMessage = this.runEvent('ConfirmCompletion', player, time, blitz, place, result);
		this.announce(
			completionMessage ||
			Utils.html`<em>${result.name}</em> has finished the hunt in ${place} place! (${time}${(blitz ? " - BLITZ" : "")})`
		);

		player.destroy(); // remove from user.games;
	}

	onShowEndBoard(endedBy?: User) {
		const sliceIndex = this.gameType === 'official' ? 5 : 3;
		const hosts = Chat.toListString(this.hosts.map(h => `<em>${Utils.escapeHTML(h.name)}</em>`));

		this.announce(
			`The ${this.gameType ? `${this.gameType} ` : ""}scavenger hunt by ${hosts} was ended ${(endedBy ? "by " + Utils.escapeHTML(endedBy.name) : "automatically")}.<br />` +
			`${this.completed.slice(0, sliceIndex).map((p, i) => `${Utils.formatOrder(i + 1)} place: <em>${Utils.escapeHTML(p.name)}</em> <span style="color: lightgreen;">[${p.time}]</span>.<br />`).join("")}` +
			`${this.completed.length > sliceIndex ? `Consolation Prize: ${this.completed.slice(sliceIndex).map(e => `<em>${Utils.escapeHTML(e.name)}</em> <span style="color: lightgreen;">[${e.time}]</span>`).join(', ')}<br />` : ''}<br />` +
			`<details style="cursor: pointer; overflow:scroll; max-height: 50vh"><summary>Solution: </summary><br />` +
			`${this.questions.map((q, i) => `${i + 1}) ${this.formatOutput(q.hint)} <span style="color: lightgreen">[<em>${Utils.escapeHTML(q.answer.join(' / '))}</em>]</span>`).join("<br />")}` +
			`</details>`
		);
	}

	onEnd(reset?: boolean, endedBy?: User) {
		if (!endedBy && (this.preCompleted ? this.preCompleted.length : this.completed.length) === 0) {
			reset = true;
		}

		this.runEvent('End', reset);
		if (!ScavengerHuntDatabase.isEmpty() && this.room.settings.scavSettings?.addRecycledHuntsToQueueAutomatically) {
			if (!this.room.settings.scavQueue) this.room.settings.scavQueue = [];

			const next = ScavengerHuntDatabase.getRecycledHuntFromDatabase();
			const correctlyFormattedQuestions = next.questions.flatMap((question: AnyObject) => [question.text, question.answers]);
			this.room.settings.scavQueue.push({
				hosts: next.hosts,
				questions: correctlyFormattedQuestions,
				staffHostId: 'scavengermanager',
				isHTML: next.isHTML,
				staffHostName: 'Scavenger Manager',
				gameType: 'unrated',
			});
		}
		if (!reset) {
			// Display the finishers' board
			if (!this.runEvent('ShowEndBoard', endedBy)) this.onShowEndBoard(endedBy);

			// give points for winning and blitzes in official games
			if (!this.runEvent('GivePoints')) {
				const winPoints = this.room.settings.scavSettings?.winPoints?.[this.gameType] ||
					DEFAULT_POINTS[this.gameType];
				const blitzPoints = this.room.settings.scavSettings?.blitzPoints?.[this.gameType] ||
					DEFAULT_BLITZ_POINTS[this.gameType];
				// only regular hunts give host points
				let hostPoints;
				if (this.gameType === 'regular') {
					hostPoints = this.room.settings.scavSettings?.hostPoints ?
						this.room.settings.scavSettings?.hostPoints :
						DEFAULT_HOST_POINTS;
				}

				let didSomething = false;
				if (winPoints || blitzPoints) {
					for (const [i, completed] of this.completed.entries()) {
						if (!completed.blitz && i >= winPoints.length) break; // there won't be any more need to keep going
						const name = completed.name;
						if (winPoints[i]) Leaderboard.addPoints(name, 'points', winPoints[i]);
						if (blitzPoints && completed.blitz) Leaderboard.addPoints(name, 'points', blitzPoints);
					}
					didSomething = true;
				}
				if (hostPoints) {
					if (this.hosts.length === 1) {
						Leaderboard.addPoints(this.hosts[0].name, 'points', hostPoints, this.hosts[0].noUpdate);
						didSomething = true;
					} else {
						this.room.sendMods('|notify|A scavenger hunt with multiple hosts needs points!');
						this.room.sendMods('(A scavenger hunt with multiple hosts has ended.)');
					}
				}
				if (didSomething) Leaderboard.write();
			}

			this.onTallyLeaderboard();

			this.tryRunQueue(this.room.roomid);
		} else if (endedBy) {
			this.announce(`The scavenger hunt has been reset by ${endedBy.name}.`);
		} else {
			this.announce("The hunt has been reset automatically, due to the lack of finishers.");
			this.tryRunQueue(this.room.roomid);
		}
		this.runEvent('AfterEnd', reset);
		this.destroy();
	}

	onTallyLeaderboard() {
		// update player leaderboard with the statistics
		for (const p in this.playerTable) {
			const player = this.playerTable[p];
			PlayerLeaderboard.addPoints(player.name, 'join', 1);
			if (player.completed) PlayerLeaderboard.addPoints(player.name, 'finish', 1);
		}
		for (const id in this.leftHunt) {
			if (id in this.playerTable) continue; // this should never happen, but just in case;

			PlayerLeaderboard.addPoints(id, 'join', 1, true);
		}
		if (this.gameType !== 'practice') {
			for (const host of this.hosts) {
				HostLeaderboard.addPoints(host.name, 'points', 1, host.noUpdate).write();
			}
		}
		PlayerLeaderboard.write();
	}

	tryRunQueue(roomid: RoomID) {
		if (this.room.scavgame || this.room.settings.scavSettings?.scavQueueDisabled) {
			return; // don't run the queue for child games
		}
		// prepare the next queue'd game
		if (this.room.settings.scavQueue?.length) {
			setTimeout(() => {
				const room = Rooms.get(roomid) as ChatRoom;
				if (!room || room.game || !room.settings.scavQueue?.length || room.settings.scavSettings?.scavQueueDisabled) return;

				const next = room.settings.scavQueue.shift()!;
				const duration = room.settings.scavSettings?.defaultScavTimer || DEFAULT_TIMER_DURATION;
				room.game = new ScavengerHunt(
					{
						room,
						staffHost: { id: next.staffHostId, name: next.staffHostName },
						hosts: next.hosts,
						gameType: next.gameType,
						questions: next.questions,
						isHTML: next.isHTML,
					}
				);
				const game = room.getGame(ScavengerHunt);
				if (game) {
					game.setTimer(duration); // auto timer for queue'd games.
					room.add(`|c|~|[ScavengerManager] A scavenger hunt by ${Chat.toListString(next.hosts.map(h => h.name))} has been automatically started. It will automatically end in ${duration} minutes.`).update(); // highlight the users with "hunt by"
					room.modlog({ action: 'SCAV NEW', note: `${game.gameType.toUpperCase()}: creators - ${game.hosts.map(h => h.id)}` });
				}

				// update the saved queue.
				room.saveSettings();
			}, 2 * 60000); // 2 minute cooldown
		}
	}

	// modify destroy to get rid of any timers in the current roomgame.
	override destroy() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		for (const i in this.playerTable) {
			this.playerTable[i].destroy();
		}
		// destroy this game
		this.room.game = null;
	}

	announce(msg: string) {
		this.room.add(`|raw|<div class="broadcast-blue"><strong>${msg}</strong></div>`).update();
	}

	validatePlayer(player: ScavengerHuntPlayer) {
		if (player.infracted) return false;
		if (this.hosts.some(h => h.id === player.id) || player.id === this.staffHostId) {
			// someone joining on an alt then going back to their original userid
			player.sendRoom("You have been caught for doing your own hunt; staff has been notified.");

			// notify staff
			const staffMsg = `(${player.name} has been caught trying to do their own hunt.)`;
			this.room.sendMods(staffMsg);
			this.room.roomlog(staffMsg);
			this.room.modlog({
				action: 'SCAV CHEATER',
				userid: player.id,
				note: 'caught trying to do their own hunt',
			});

			PlayerLeaderboard.addPoints(player.name, 'infraction', 1);
			player.infracted = true;
		}

		const uniqueConnections = this.getUniqueConnections(player.id);
		if (uniqueConnections > 1 && this.room.settings.scavSettings?.scavmod?.ipcheck) {
			// multiple users on one alt
			player.sendRoom("You have been caught for attempting a hunt with multiple connections on your account.  Staff has been notified.");

			// notify staff
			const staffMsg = `(${player.name} has been caught attempting a hunt with ${uniqueConnections} connections on the account. The user has also been given 1 infraction point on the player leaderboard.)`;

			this.room.sendMods(staffMsg);
			this.room.roomlog(staffMsg);
			this.room.modlog({
				action: 'SCAV CHEATER',
				userid: player.id,
				note: `caught attempting a hunt with ${uniqueConnections} connections on the account; has also been given 1 infraction point on the player leaderboard`,
			});

			PlayerLeaderboard.addPoints(player.name, 'infraction', 1);
			player.infracted = true;
		}
	}

	eliminate(userid: string) {
		if (!(userid in this.playerTable)) return false;
		const player = this.playerTable[userid];

		// do not remove players that have completed - they should still get to see the answers
		if (player.completed) return true;

		this.removePlayer(player);
		return true;
	}

	override onUpdateConnection() {}

	override onChatMessage(msg: string) {
		let msgId = toID(msg) as string;

		// identify if there is a bot/dt command that failed
		// remove it and then match the rest of the post for leaks.
		const commandMatch = ACCIDENTAL_LEAKS.exec(msg);
		if (commandMatch) msgId = msgId.slice(toID(commandMatch[0]).length);

		const filtered = this.questions.some(q => q.answer.some(a => {
			a = toID(a);
			const md = Math.ceil((a.length - 5) / FILTER_LENIENCY);
			if (Utils.levenshtein(msgId, a, md) <= md) return true;
			return false;
		}));

		if (filtered) return "Please do not leak the answer. Use /scavenge [guess] to submit your guess instead.";
	}

	hasFinished(user: User) {
		return this.playerTable[user.id]?.completed;
	}

	getUniqueConnections(userid: string) {
		const user = Users.get(userid);
		if (!user) return 1;

		const ips = user.connections.map(c => c.ip);
		return ips.filter((ip, index) => ips.indexOf(ip) === index).length;
	}

	static parseHosts(hostArray: string[], room: Room, allowOffline?: boolean) {
		const hosts = [];
		for (const u of hostArray) {
			const id = toID(u);
			const user = Users.getExact(id);
			if (!allowOffline && (!user?.connected || !(user.id in room.users))) continue;

			if (!user) {
				// simply stick the ID's in there - don't keep any benign symbols passed by the hunt maker
				hosts.push({ name: id, id, noUpdate: true });
				continue;
			}

			hosts.push({ id: `${user.id}`, name: `${user.name}` });
		}
		return hosts;
	}

	static parseQuestions(questionArray: string[], force = false): AnyObject {
		if (questionArray.length % 2 === 1 && !force) return { err: "Your final question is missing an answer" };
		if (questionArray.length < 6 && !force) return { err: "You must have at least 3 hints and answers" };

		const formattedQuestions = [];

		for (let [i, question] of questionArray.entries()) {
			if (i % 2) {
				const answers = question.split(';').map(p => p.trim());
				formattedQuestions[i] = answers;
				if (!force && (!answers.length || answers.some(a => !toID(a)))) {
					return { err: "Empty answer - only alphanumeric characters will count in answers." };
				}
			} else {
				// Skip last question if there is no answer
				if (i + 1 === questionArray.length) continue;

				question = question.trim();
				formattedQuestions[i] = question;
				if (!question && !force) return { err: "Empty question." };
			}
		}

		return { result: formattedQuestions };
	}
}

export class ScavengerHuntPlayer extends Rooms.RoomGamePlayer<ScavengerHunt> {
	lastGuess: number;
	override completed: boolean;
	joinIps: string[];
	currentQuestion: number;

	[k: string]: any; // for purposes of adding new temporary properties for the purpose of twists.
	constructor(user: User, game: ScavengerHunt) {
		super(user, game);

		this.joinIps = user.ips.slice();

		this.currentQuestion = 0;
		this.completed = false;
		this.lastGuess = 0;
	}

	getCurrentQuestion() {
		return {
			question: this.game.questions[this.currentQuestion],
			number: this.currentQuestion + 1,
		};
	}

	verifyAnswer(value: string) {
		const answer = this.getCurrentQuestion().question.answer;
		value = sanitizeAnswer(value);

		return answer.some((a: string) => sanitizeAnswer(a) === value);
	}

	onNotifyChange(num: number) {
		this.game.runEvent('NotifyChange', this, num);
		if (num === this.currentQuestion) {
			this.sendRoom(`|raw|<div style="overflow:scroll; max-height: 50vh"><strong>The hint has been changed to:</strong> ${this.game.formatOutput(this.game.questions[num].hint)}</div>`);
		}
	}

	override destroy() {
		const user = Users.getExact(this.id);
		if (user) {
			user.games.delete(this.game.roomid);
			user.updateSearch();
		}
	}
}

const ScavengerCommands: Chat.ChatCommands = {
	/**
	 * Player commands
	 */
	""() {
		return this.parse("/join scavengers");
	},

	guess(target, room, user) {
		return this.parse(`/choose ${target}`);
	},

	join(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply("There is no scavenger hunt currently running.");
		this.checkChat();

		game.joinGame(user);
	},

	leave(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply("There is no scavenger hunt currently running.");
		game.leaveGame(user);
	},

	/**
	 * Scavenger Games
	 * --------------
	 * Individual game commands for each Scavenger Game
	 */
	game: 'games',
	games: {
		/**
		 * General game commands
		 */
		create: 'start',
		new: 'start',
		start(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			if (room.scavgame) return this.errorReply('There is already a scavenger game running.');
			if (room.getGame(ScavengerHunt)) {
				return this.errorReply('You cannot start a scavenger game where there is already a scavenger hunt in the room.');
			}

			target = toID(target);
			const game = ScavMods.LoadGame(room, target);

			if (!game) return this.errorReply('Invalid game mode.');

			room.scavgame = game;

			this.privateModAction(`A ${game.name} has been created by ${user.name}.`);
			this.modlog('SCAVENGER', null, 'ended the scavenger game');

			game.announce(`A game of ${game.name} has been started!`);
		},

		end(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			if (!room.scavgame) return this.errorReply(`There is no scavenger game currently running.`);

			this.privateModAction(`The ${room.scavgame.name} has been forcibly ended by ${user.name}.`);
			this.modlog('SCAVENGER', null, 'ended the scavenger game');
			room.scavgame.announce(`The ${room.scavgame.name} has been forcibly ended.`);
			room.scavgame.destroy(true);
		},

		kick(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			if (!room.scavgame) return this.errorReply(`There is no scavenger game currently running.`);

			const targetId = toID(target);
			if (targetId === 'constructor' || !targetId) return this.errorReply("Invalid player.");

			const success = room.scavgame.eliminate(targetId);
			if (success) {
				this.addModAction(`User '${targetId}' has been kicked from the ${room.scavgame.name}.`);
				this.modlog('SCAVENGERS', target, `kicked from the ${room.scavgame.name}`);
				const game = room.getGame(ScavengerHunt);
				if (game) {
					game.eliminate(targetId); // remove player from current hunt as well.
				}
			} else {
				this.errorReply(`Unable to kick user '${targetId}'.`);
			}
		},

		points: 'leaderboard',
		score: 'leaderboard',
		scoreboard: 'leaderboard',
		async leaderboard(target, room, user) {
			room = this.requireRoom();
			if (!room.scavgame) return this.errorReply(`There is no scavenger game currently running.`);
			if (!room.scavgame.leaderboard) return this.errorReply("This scavenger game does not have a leaderboard.");
			if (!this.runBroadcast()) return false;

			const html = await room.scavgame.leaderboard.htmlLadder();
			this.sendReply(`|raw|${html}`);
		},

		async rank(target, room, user) {
			room = this.requireRoom();
			if (!room.scavgame) return this.errorReply(`There is no scavenger game currently running.`);
			if (!room.scavgame.leaderboard) return this.errorReply("This scavenger game does not have a leaderboard.");
			if (!this.runBroadcast()) return false;

			const targetId = toID(target) || user.id;

			const rank = await room.scavgame.leaderboard.visualize('points', targetId) as AnyObject;

			if (!rank) {
				this.sendReplyBox(`User '${targetId}' does not have any points on the scavenger games leaderboard.`);
			} else {
				this.sendReplyBox(Utils.html`User '${rank.name}' is #${rank.rank} on the scavenger games leaderboard with ${rank.points} points.`);
			}
		},
	},
	teamscavs: {
		addteam: 'createteam',
		createteam(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			// if (room.getGame(ScavengerHunt)) return this.errorReply('Teams cannot be modified after the hunt starts.');

			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');

			let [teamName, leader] = target.split(',');
			teamName = teamName.trim();
			if (game.teams[teamName]) return this.errorReply(`The team ${teamName} already exists.`);

			const leaderUser = Users.get(leader);
			if (!leaderUser) return this.errorReply('The user you specified is currently not online');
			if (game.getPlayerTeam(leaderUser)) return this.errorReply('The user is already a member of another team.');

			game.teams[teamName] = { name: teamName, answers: [], players: [leaderUser.id], question: 1, completed: false };
			game.announce(Utils.html`A new team "${teamName}" has been created with ${leaderUser.name} as the leader.`);
		},

		deleteteam: 'removeteam',
		removeteam(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			// if (room.getGame(ScavengerHunt)) return this.errorReply('Teams cannot be modified after the hunt starts.');

			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');

			if (!game.teams[target]) return this.errorReply(`The team ${target} does not exist.`);

			delete game.teams[target];
			game.announce(Utils.html`The team "${target}" has been removed.`);
		},

		addplayer(target, room, user) {
			room = this.requireRoom();
			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');
			// if (room.getGame(ScavengerHunt)) return this.errorReply('Teams cannot be modified after the hunt starts.');

			let userTeam;

			for (const teamID in game.teams) {
				const team = game.teams[teamID];
				if (team.players[0] === user.id) {
					userTeam = team;
					break;
				}
			}
			if (!userTeam) return this.errorReply('You must be the leader of a team to add people into the team.');

			const targetUsers = target.split(',').map(id => Users.getExact(id)).filter(u => u?.connected) as User[];
			if (!targetUsers.length) return this.errorReply('Please select a user that is currently online.');

			const errors = [];
			for (const targetUser of targetUsers) {
				if (game.getPlayerTeam(targetUser)) errors.push(`${targetUser.name} is already in a team.`);
			}
			if (errors.length) return this.sendReplyBox(errors.join('<br />'));

			const playerIDs = targetUsers.map(u => u.id);
			userTeam.players.push(...playerIDs);

			for (const targetUser of targetUsers) {
				targetUser.sendTo(room, `You have joined ${userTeam.name}.`);
			}
			game.announce(Utils.html`${Chat.toListString(targetUsers.map(u => u.name))} ${targetUsers.length > 1 ? 'have' : 'has'} been added into ${userTeam.name}.`);
		},

		editplayers(target, room, user) {
			room = this.requireRoom();
			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');
			this.checkCan('mute', null, room);
			// if (room.getGame(ScavengerHunt)) return this.errorReply('Teams cannot be modified after the hunt starts.');

			const parts = target.split(',');
			const teamName = parts[0].trim();
			const playerchanges = parts.slice(1);

			const team = game.teams[teamName];

			if (!team) return this.errorReply('Invalid team.');

			for (const entry of playerchanges) {
				const userid = toID(entry);
				if (entry.trim().startsWith('-')) {
					// remove from the team
					if (!team.players.includes(userid)) {
						this.errorReply(`User "${userid}" is not in team "${team.name}."`);
						continue;
					} else if (team.players[0] === userid) {
						this.errorReply(`You cannot remove "${userid}", who is the leader of "${team.name}".`);
						continue;
					}
					team.players = team.players.filter((u: string) => u !== userid);
					game.announce(`${userid} was removed from "${team.name}."`);
				} else {
					const targetUser = Users.getExact(userid);
					if (!targetUser?.connected) {
						this.errorReply(`User "${userid}" is not currently online.`);
						continue;
					}

					const targetUserTeam = game.getPlayerTeam(targetUser);
					if (team.players.includes(userid)) {
						this.errorReply(`User "${userid}" is already part of "${team.name}."`);
						continue;
					} else if (targetUserTeam) {
						this.errorReply(`User "${userid}" is already part of another team - "${targetUserTeam.name}".`);
						continue;
					}
					team.players.push(userid);
					game.announce(`${targetUser.name} was added to "${team.name}."`);
				}
			}
		},

		teams(target, room, user) {
			if (!this.runBroadcast()) return false;
			room = this.requireRoom();

			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');

			const display = [];
			for (const teamID in game.teams) {
				const team = game.teams[teamID];
				display.push(Utils.html`<strong>${team.name}</strong> - <strong>${team.players[0]}</strong>${team.players.length > 1 ? ', ' + team.players.slice(1).join(', ') : ''}`);
			}

			this.sendReplyBox(display.join('<br />'));
		},

		guesses(target, room, user) {
			room = this.requireRoom();
			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');

			const team = game.getPlayerTeam(user);
			if (!team) return this.errorReply('You are not currently part of this Team Scavs game.');

			this.sendReplyBox(Utils.html`<strong>Question #${team.question} guesses:</strong> ${team.answers.sort().join(', ')}`);
		},

		chat: 'note',
		note(target, room, user) {
			room = this.requireRoom();
			const game = room.scavgame;
			if (!game || game.id !== 'teamscavs') return this.errorReply('There is currently no game of Team Scavs going on.');

			const team = game.getPlayerTeam(user);
			if (!team) return this.errorReply('You are not currently part of this Team Scavs game.');

			if (!target) return this.errorReply('Please include a message as the note.');

			game.teamAnnounce(user, Utils.html`<strong> Note from ${user.name}:</strong> ${target}`);
		},
	},
	teamscavshelp: [
		'/tscav createteam [team name], [leader name] - creates a new team for the current Team Scavs game. (Requires: % @ * # ~)',
		'/tscav deleteteam [team name] - deletes an existing team for the current Team Scavs game. (Requires: % @ * # ~)',
		'/tscav addplayer [user] - allows a team leader to add a player onto their team.',
		'/tscav editplayers [team name], [added user | -removed user], [...] (use - preceding a user\'s name to remove a user) - Edits the players within an existing team. (Requires: % @ * # ~)',
		'/tscav teams - views the list of teams and the players on each team.',
		'/tscav guesses - views the list of guesses already submitted by your team for the current question.',
		'/tscav chat [message] - adds a message that can be seen by all of your teammates in the Team Scavs game.',
	],

	/**
	 * Creation / Moderation commands
	 */
	createtwist: 'create',
	createtwistofficial: 'create',
	createtwistmini: 'create',
	createtwistpractice: 'create',
	createtwistunrated: 'create',
	createpractice: 'create',
	createofficial: 'create',
	createunrated: 'create',
	createmini: 'create',
	forcecreate: 'create',
	forcecreateunrated: 'create',
	createrecycled: 'create',

	createhtmltwist: 'create',
	createhtmltwistofficial: 'create',
	createhtmltwistmini: 'create',
	createhtmltwistpractice: 'create',
	createhtmltwistunrated: 'create',
	createhtmlpractice: 'create',
	createhtmlofficial: 'create',
	createhtmlunrated: 'create',
	createhtmlmini: 'create',
	forcecreatehtml: 'create',
	forcecreatehtmlunrated: 'create',
	createhtmlrecycled: 'create',
	createhtml: 'create',
	create(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("Scavenger hunts can only be created in the scavengers room.");
		}
		this.checkCan('mute', null, room);
		if (room.game) return this.errorReply(`There is already a game in this room - ${room.game.title}.`);
		let gameType = 'regular' as GameTypes;
		if (cmd.includes('practice')) {
			gameType = 'practice';
		} else if (cmd.includes('official')) {
			gameType = 'official';
		} else if (cmd.includes('mini')) {
			gameType = 'mini';
		} else if (cmd.includes('unrated')) {
			gameType = 'unrated';
		} else if (cmd.includes('recycled')) {
			gameType = 'recycled';
		}

		const isHTML = cmd.includes('html');

		let mod;
		let questions = target;

		if (cmd.includes('twist')) {
			const twistparts = target.split('|');
			questions = twistparts.slice(1).join('|');
			mod = twistparts[0].split(',');
		}

		// mini and officials can be started anytime
		if (
			!cmd.includes('force') && ['regular', 'unrated', 'recycled'].includes(gameType) && !mod &&
			room.settings.scavQueue?.length && !room.scavgame
		) {
			return this.errorReply(`There are currently hunts in the queue! If you would like to start the hunt anyways, use /forcestart${gameType === 'regular' ? 'hunt' : gameType}.`);
		}

		if (gameType === 'recycled') {
			if (ScavengerHuntDatabase.isEmpty()) {
				return this.errorReply("There are no hunts in the database.");
			}

			let hunt;
			if (questions) {
				const huntNumber = parseInt(questions);
				if (!ScavengerHuntDatabase.hasHunt(huntNumber)) return this.errorReply("You specified an invalid hunt number.");
				hunt = scavengersData.recycledHunts[huntNumber - 1];
			} else {
				hunt = ScavengerHuntDatabase.getRecycledHuntFromDatabase();
			}

			questions = ScavengerHuntDatabase.getFullTextOfHunt(hunt);
		}

		let [hostsArray, ...params] = questions.split('|');
		// A recycled hunt should list both its original creator and the staff who started it as its host.
		if (gameType === 'recycled') {
			hostsArray += `,${user.name}`;
		}
		const hosts = ScavengerHunt.parseHosts(
			hostsArray.split(/[,;]/),
			room,
			gameType === 'official' || gameType === 'recycled'
		);
		if (!hosts.length) {
			return this.errorReply("The user(s) you specified as the host is not online, or is not in the room.");
		}

		const res = ScavengerHunt.parseQuestions(params);
		if (res.err) return this.errorReply(res.err);

		room.game = new ScavengerHunt({
			room,
			staffHost: user,
			hosts,
			gameType,
			questions: res.result,
			isHTML,
			mod,
		});

		this.privateModAction(`A new scavenger hunt was created by ${user.name}.`);
		this.modlog('SCAV NEW', null, `${gameType.toUpperCase()}: creators - ${hosts.map(h => h.id)}`);
	},

	status(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		const elapsedMsg = Chat.toDurationString(Date.now() - game.startTime, { hhmmss: true });
		const gameTypeMsg = game.gameType ? `<em>${game.gameType}</em> ` : '';
		const hostersMsg = Utils.escapeHTML(Chat.toListString(game.hosts.map(h => h.name)));
		const hostMsg = game.hosts.some(h => h.id === game.staffHostId) ?
			'' : Utils.html` (started by - ${game.staffHostName})`;
		const finishers = Utils.html`${game.completed.map(u => u.name).join(', ')}`;
		let buffer = `<div class="infobox" style="margin-top: 0px;">The current ${gameTypeMsg}scavenger hunt by <em>${hostersMsg}${hostMsg}</em> has been up for: ${elapsedMsg}<br />${!game.timerEnd ? 'The timer is currently off.' : `The hunt ends in: ${Chat.toDurationString(game.timerEnd - Date.now(), { hhmmss: true })}`}<br />Completed (${game.completed.length}): ${finishers}</div>`;
		if (game.modsList.includes('timetrial')) {
			const finisher = game.completed.find(player => player.id === user.id);
			const timeTrialMsg = finisher ?
				`You finished the hunt in: ${finisher.time}.` :
				(game.startTimes?.[user.id] ?
					`You joined the hunt ${Chat.toDurationString(Date.now() - game.startTimes[user.id], { hhmmss: true })} ago.` :
					'You have not joined the hunt.');
			buffer = `<div class="infobox" style="margin-top: 0px;">The current ${gameTypeMsg}scavenger hunt by <em>${hostersMsg}${hostMsg}</em> has been up for: ${elapsedMsg}<br />${timeTrialMsg}<br />${!game.timerEnd ? 'The timer is currently off.' : `The hunt ends in: ${Chat.toDurationString(game.timerEnd - Date.now(), { hhmmss: true })}`}<br />Completed (${game.completed.length}): ${finishers}</div>`;
		}

		if (game.hosts.some(h => h.id === user.id) || game.staffHostId === user.id) {
			let str = `<div class="ladder" style="overflow-y: scroll; max-height: 300px;"><table style="width: 100%"><th><b>Question</b></th><th><b>Users on this Question</b></th>`;
			for (let i = 0; i < game.questions.length; i++) {
				const questionNum = i + 1;
				const players = Object.values(game.playerTable).filter(player => player.currentQuestion === i && !player.completed);
				if (!players.length) {
					str += `<tr><td>${questionNum}</td><td>None</td>`;
				} else {
					str += `<tr><td>${questionNum}</td><td>`;
					str += players.map(
						pl => pl.lastGuess > Date.now() - 1000 * 300 ?
							Utils.html`<strong>${pl.name}</strong>` :
							Utils.escapeHTML(pl.name)
					).join(", ");
				}
			}
			const completed: AnyObject[] = game.preCompleted ? game.preCompleted : game.completed;
			str += Utils.html`<tr><td>Completed</td><td>${completed.length ? completed.map(pl => pl.name).join(", ") : 'None'}`;
			return this.sendReply(`|raw|${str}</table></div>${buffer}`);
		}
		this.sendReply(`|raw|${buffer}`);
	},

	hint(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);
		if (!game.onSendQuestion(user, true)) this.errorReply("You are not currently participating in the hunt.");
	},

	timer(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		const minutes = (toID(target) === 'off' ? 0 : parseFloat(target));
		if (isNaN(minutes) || minutes < 0 || (minutes * 60 * 1000) > Chat.MAX_TIMEOUT_DURATION) {
			throw new Chat.ErrorMessage(`You must specify a timer length that is a postive number.`);
		}

		const result = game.setTimer(minutes);
		const message = `The scavenger timer has been ${(result === 'off' ? "turned off" : `set to ${result} minutes`)}`;

		room.add(message + '.');
		this.privateModAction(`${message} by ${user.name}.`);
		this.modlog('SCAV TIMER', null, (result === 'off' ? 'OFF' : `${result} minutes`));
	},

	inherit(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		if (game.staffHostId === user.id) return this.errorReply('You already have staff permissions for this hunt.');

		game.staffHostId = `${user.id}`;
		game.staffHostName = `${user.name}`;

		// clear user's game progress and prevent user from ever entering again
		game.eliminate(user.id);
		game.cacheUserIps(user);

		this.privateModAction(`${user.name} has inherited staff permissions for the current hunt.`);
		this.modlog('SCAV INHERIT');
	},

	reset(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		game.onEnd(true, user);
		this.privateModAction(`${user.name} has reset the scavenger hunt.`);
		this.modlog('SCAV RESET');
	},

	resettoqueue(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		const hunt: QueuedHunt = {
			hosts: game.hosts,
			questions: [],
			isHTML: game.isHTML,
			staffHostId: game.staffHostId,
			staffHostName: game.StaffHostName,
			gameType: game.gameType,
		};
		for (const entry of game.questions) {
			hunt.questions.push(...[entry.hint, entry.answer]);
		}
		if (!room.settings.scavQueue) room.settings.scavQueue = [];
		room.settings.scavQueue.push(hunt);

		game.onEnd(true, user);
		this.privateModAction(`${user.name} has reset the scavenger hunt, and placed it in the queue.`);
		this.modlog('SCAV RESETTOQUEUE');
	},

	forceend: 'end',
	end(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		if (!room.game && room.scavgame) return this.parse('/scav games end');
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		const completed = game.preCompleted ? game.preCompleted : game.completed;

		if (!this.cmd.includes('force')) {
			if (!completed.length) {
				return this.errorReply('No one has finished the hunt yet.  Use /forceendhunt if you want to end the hunt and reveal the answers.');
			}
		} else if (completed.length) {
			return this.errorReply(`This hunt has ${Chat.count(completed, "finishers")}; use /endhunt`);
		}

		game.onEnd(false, user);
		this.privateModAction(`${user.name} has ended the scavenger hunt.`);
		this.modlog('SCAV END');
	},

	viewhunt(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		if (!('onViewHunt' in game)) return this.errorReply('There is currently no hunt to be viewed.');

		game.onViewHunt(user);
	},

	edithunt(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);
		if (
			(!game.hosts.some(h => h.id === user.id) || !user.can('show', null, room)) &&
			game.staffHostId !== user.id
		) {
			return this.errorReply("You cannot edit the hints and answers if you are not the host.");
		}

		const [question, type, ...value] = target.split(',');
		if (!game.onEditQuestion(parseInt(question), toID(type), value.join(',').trim())) {
			return this.sendReply("/scavengers edithunt [question number], [hint | answer], [value] - edits the current scavenger hunt.");
		}
	},

	addhint: 'spoiler',
	spoiler(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);
		if (
			(!game.hosts.some(h => h.id === user.id) || !user.can('show', null, room)) &&
			game.staffHostId !== user.id
		) {
			return this.errorReply("You cannot add more hints if you are not the host.");
		}
		const parts = target.split(',');
		const question = parseInt(parts[0]) - 1;
		const hint = parts.slice(1).join(',');

		if (!game.questions[question]) return this.errorReply(`Invalid question number.`);
		if (!hint) return this.errorReply('The hint cannot be left empty.');
		game.questions[question].spoilers.push(hint);

		room.addByUser(user, `Question #${question + 1} hint - spoiler: ${hint}`);
		const playersOnQ = game.players.filter(player => player.currentQuestion === question && !player.completed);
		const notif = `|notify|Scavenger hint for Q${question + 1}`;
		for (const player of playersOnQ) {
			const playerObj = Users.get(player.id);
			if (!playerObj?.connected) continue;
			room.sendUser(playerObj, notif);
		}
	},

	deletehint: 'removehint',
	removehint(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);
		if (
			(!game.hosts.some(h => h.id === user.id) || !user.can('show', null, room)) &&
			game.staffHostId !== user.id
		) {
			return this.errorReply("You cannot remove hints if you are not the host.");
		}

		const parts = target.split(',');
		const question = parseInt(parts[0]) - 1;
		const hint = parseInt(parts[1]) - 1;

		if (!game.questions[question]) return this.errorReply(`Invalid question number.`);
		if (!game.questions[question].spoilers[hint]) return this.errorReply('Invalid hint number.');
		game.questions[question].spoilers.splice(hint, 1);

		return this.sendReply("Hint has been removed.");
	},

	modifyhint: 'edithint',
	edithint(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);
		if (
			(!game.hosts.some(h => h.id === user.id) || !user.can('show', null, room)) &&
			game.staffHostId !== user.id
		) {
			return this.errorReply("You cannot edit hints if you are not the host.");
		}

		const parts = target.split(',');
		const question = parseInt(parts[0]) - 1;
		const hint = parseInt(parts[1]) - 1;
		const value = parts.slice(2).join(',');

		if (!game.questions[question]) return this.errorReply(`Invalid question number.`);
		if (!game.questions[question].spoilers[hint]) return this.errorReply('Invalid hint number.');
		if (!value) return this.errorReply('The hint cannot be left empty.');
		game.questions[question].spoilers[hint] = value;

		room.addByUser(user, `Question #${question + 1} hint - spoiler: ${value}`);
		const playersOnQ = game.players.filter(player => player.currentQuestion === question && !player.completed);
		const notif = `|notify|Scavenger hint for Q${question + 1}`;
		for (const player of playersOnQ) {
			const playerObj = Users.get(player.id);
			if (!playerObj?.connected) continue;
			room.sendUser(playerObj, notif);
		}
		return this.sendReply("Hint has been modified.");
	},

	kick(target, room, user) {
		room = this.requireRoom();
		const game = room.getGame(ScavengerHunt);
		if (!game) return this.errorReply(`There is no scavenger hunt currently running.`);

		const targetId = toID(target);
		if (targetId === 'constructor' || !targetId) return this.errorReply("Invalid player.");

		const success = game.eliminate(targetId);
		if (success) {
			this.modlog('SCAV KICK', targetId);
			return this.privateModAction(`${user.name} has kicked '${targetId}' from the scavenger hunt.`);
		}
		this.errorReply(`Unable to kick '${targetId}' from the scavenger hunt.`);
	},

	/**
	 * Hunt queuing
	 */
	queueunrated: 'queue',
	queuerated: 'queue',
	queuerecycled: 'queue',
	queuehtmlunrated: 'queue',
	queuehtmlrated: 'queue',
	queuehtmlrecycled: 'queue',
	queuehtml: 'queue',
	forcequeueunrated: 'queue',
	forcequeuerated: 'queue',
	forcequeuerecycled: 'queue',
	forcequeuehtmlunrated: 'queue',
	forcequeuehtmlrated: 'queue',
	forcequeuehtmlrecycled: 'queue',
	forcequeuehtml: 'queue',
	forcequeue: 'queue',
	queue(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (!target && this.cmd !== 'queuerecycled') {
			if (this.cmd === 'queue') {
				this.runBroadcast();
				const commandHandler = ScavengerCommands.viewqueue as ChatHandler;
				commandHandler.call(this, target, room, user, this.connection, this.cmd, this.message);
				return;
			}
			return this.parse('/scavhelp staff');
		}

		const isHTML = this.cmd.includes('html');

		this.checkCan('mute', null, room);

		if (this.cmd === 'queuerecycled') {
			if (ScavengerHuntDatabase.isEmpty()) {
				return this.errorReply(`There are no hunts in the database.`);
			}
			if (!room.settings.scavQueue) {
				room.settings.scavQueue = [];
			}

			let next;
			if (target) {
				const huntNumber = parseInt(target);
				if (!ScavengerHuntDatabase.hasHunt(huntNumber)) return this.errorReply("You specified an invalid hunt number.");
				next = scavengersData.recycledHunts[huntNumber - 1];
			} else {
				next = ScavengerHuntDatabase.getRecycledHuntFromDatabase();
			}
			const correctlyFormattedQuestions = next.questions.flatMap((question: AnyObject) => [question.text, question.answers]);
			room.settings.scavQueue.push({
				hosts: next.hosts,
				questions: correctlyFormattedQuestions,
				isHTML,
				staffHostId: 'scavengermanager',
				staffHostName: 'Scavenger Manager',
				gameType: 'unrated',
			});
		} else {
			const [hostsArray, ...params] = target.split('|');
			const hosts = ScavengerHunt.parseHosts(hostsArray.split(/[,;]/), room);
			if (!hosts.length) {
				return this.errorReply("The user(s) you specified as the host is not online, or is not in the room.");
			}

			const results = ScavengerHunt.parseQuestions(params, this.cmd.includes('force'));
			if (results.err) return this.errorReply(results.err);

			if (!room.settings.scavQueue) room.settings.scavQueue = [];

			room.settings.scavQueue.push({
				hosts,
				questions: results.result,
				isHTML,
				staffHostId: user.id,
				staffHostName: user.name,
				gameType: (this.cmd.includes('unrated') ? 'unrated' : 'regular'),
			});
		}
		this.privateModAction(`${user.name} has added a scavenger hunt to the queue.`);

		room.saveSettings();
	},

	dequeue(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room);
		const id = parseInt(target);

		// this command should be using the display to manage anyways, so no error message is needed
		if (!room.settings.scavQueue || isNaN(id) || id < 0 || id >= room.settings.scavQueue.length) return false;

		const removed = room.settings.scavQueue.splice(id, 1)[0];
		this.privateModAction(`${user.name} has removed a scavenger hunt created by [${removed.hosts.map(u => u.id).join(", ")}] from the queue.`);
		this.sendReply(`|uhtmlchange|scav-queue|${formatQueue(room.settings.scavQueue, user, room)}`);

		room.saveSettings();
	},

	viewqueue(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (!this.runBroadcast()) return false;

		this.sendReply(`|uhtml|scav-queue|${formatQueue(room.settings.scavQueue, user, room, this.broadcasting)}`);
	},

	next(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room);

		if (!room.settings.scavQueue?.length) {
			return this.errorReply("The scavenger hunt queue is currently empty.");
		}
		if (room.game) return this.errorReply(`There is already a game in this room - ${room.game.title}.`);

		const huntId = parseInt(target) || 0;

		if (!room.settings.scavQueue[huntId]) return false; // no need for an error reply - this is done via UI anyways

		const next = room.settings.scavQueue.splice(huntId, 1)[0];
		room.game = new ScavengerHunt(
			{
				room,
				staffHost: { id: next.staffHostId, name: next.staffHostName },
				hosts: next.hosts,
				gameType: next.gameType,
				questions: next.questions,
				isHTML: next.isHTML,
			}
		);

		if (huntId) this.sendReply(`|uhtmlchange|scav-queue|${formatQueue(room.settings.scavQueue, user, room)}`);
		this.modlog('SCAV NEW', null, `from queue: creators - ${next.hosts.map(h => h.id)}`);

		// update the saved queue.
		room.saveSettings();
	},

	enablequeue: 'disablequeue',
	disablequeue(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room);

		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		const state = this.cmd === 'disablequeue';
		if ((room.settings.scavSettings.scavQueueDisabled || false) === state) {
			return this.errorReply(`The queue is already ${state ? 'disabled' : 'enabled'}.`);
		}

		room.settings.scavSettings.scavQueueDisabled = state;
		room.saveSettings();

		this.sendReply(`|uhtmlchange|scav-queue|${formatQueue(room.settings.scavQueue, user, room)}`);
		this.privateModAction(`The queue has been ${state ? 'disabled' : 'enabled'} by ${user.name}.`);
		this.modlog('SCAV QUEUE', null, (state ? 'disabled' : 'enabled'));
	},

	defaulttimer(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('declare', null, room);

		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		if (!target) {
			const duration_string = room.settings.scavSettings.defaultScavTimer || DEFAULT_TIMER_DURATION;
			return this.sendReply(`The default scavenger timer is currently set at: ${duration_string} minutes.`);
		}
		const duration = parseInt(target);

		if (!duration || duration < 0) {
			return this.errorReply('The default timer must be an integer greater than zero, in minutes.');
		}

		room.settings.scavSettings.defaultScavTimer = duration;
		room.saveSettings();
		this.privateModAction(`The default scavenger timer has been set to ${duration} minutes by ${user.name}.`);
		this.modlog('SCAV DEFAULT TIMER', null, `${duration} minutes`);
	},

	/**
	 * Leaderboard Commands
	 */
	addpoints(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('mute', null, room);

		const parts = target.split(',');
		const targetId = toID(parts[0]);
		const points = parseInt(parts[1]);

		if (!targetId || targetId === 'constructor' || targetId.length > 18) return this.errorReply("Invalid username.");
		if (!points || points < 0 || points > 1000) return this.errorReply("Points must be an integer between 1 and 1000.");

		Leaderboard.addPoints(targetId, 'points', points, true).write();

		this.privateModAction(`${targetId} was given ${points} points on the current scavengers ladder by ${user.name}.`);
		this.modlog('SCAV ADDPOINTS', targetId, `${points}`);
	},

	removepoints(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('mute', null, room);

		const parts = target.split(',');
		const targetId = toID(parts[0]);
		const points = parseInt(parts[1]);

		if (!targetId || targetId === 'constructor' || targetId.length > 18) return this.errorReply("Invalid username.");
		if (!points || points < 0 || points > 1000) return this.errorReply("Points must be an integer between 1 and 1000.");

		Leaderboard.addPoints(targetId, 'points', -points, true).write();

		this.privateModAction(`${user.name} has taken ${points} points from ${targetId} on the current scavengers ladder.`);
		this.modlog('SCAV REMOVEPOINTS', targetId, `${points}`);
	},

	resetladder(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('declare', null, room);

		Leaderboard.reset().write();

		this.privateModAction(`${user.name} has reset the current scavengers ladder.`);
		this.modlog('SCAV RESETLADDER');
	},
	top: 'ladder',
	async ladder(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (!this.runBroadcast()) return false;

		const isChange = (!this.broadcasting && target);
		const hideStaff = (!this.broadcasting && this.meansNo(target));

		const ladder = await Leaderboard.visualize('points') as AnyObject[];
		this.sendReply(
			`|uhtml${isChange ? 'change' : ''}|scavladder|<div class="ladder" style="overflow-y: scroll; max-height: 300px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Points</th></tr>${ladder.map(entry => {
				const roomRank = room.auth.getDirect(toID(entry.name));
				const isStaff = Users.Auth.atLeast(roomRank, '+');
				if (isStaff && hideStaff) return '';
				return `<tr><td>${entry.rank}</td><td>${(isStaff ? `<em>${Utils.escapeHTML(entry.name)}</em>` : (entry.rank <= 5 ? `<strong>${Utils.escapeHTML(entry.name)}</strong>` : Utils.escapeHTML(entry.name)))}</td><td>${entry.points}</td></tr>`;
			}).join('')}</table></div>` +
			`<div style="text-align: center"><button class="button" name="send" value="/scav top ${hideStaff ?
				'yes' :
				'no'}">${hideStaff ?
				"Show" :
				"Hide"} Auth</button></div>`
		);
	},

	async rank(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (!this.runBroadcast()) return false;

		const targetId = toID(target) || user.id;

		const rank = await Leaderboard.visualize('points', targetId) as AnyObject;
		if (!rank) {
			this.sendReplyBox(`User '${targetId}' does not have any points on the scavengers leaderboard.`);
		} else {
			this.sendReplyBox(Utils.html`User '${rank.name}' is #${rank.rank} on the scavengers leaderboard with ${rank.points} points.`);
		}
	},

	/**
	 * Leaderboard Point Distribution Editing
	 */
	setblitz(target, room, user) {
		room = this.requireRoom();
		const scavsRoom = getScavsRoom(room);
		if (!scavsRoom) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room); // perms for viewing only

		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		if (!target) {
			const points = [];
			const source = Object.entries(Object.assign(DEFAULT_BLITZ_POINTS, room.settings.scavSettings.blitzPoints || {}));
			for (const entry of source) {
				points.push(`${entry[0]}: ${entry[1]}`);
			}
			return this.sendReplyBox(`The points rewarded for winning hunts within a minute is:<br />${points.join('<br />')}`);
		}

		this.checkCan('declare', null, room); // perms for editing

		const parts = target.split(',');
		const blitzPoints = parseInt(parts[1]);
		const gameType = toID(parts[0]) as GameTypes;
		if (!RATED_TYPES.includes(gameType)) return this.errorReply(`You cannot set blitz points for ${gameType} hunts.`);

		if (isNaN(blitzPoints) || blitzPoints < 0 || blitzPoints > 1000) {
			return this.errorReply("The points value awarded for blitz must be an integer bewteen 0 and 1000.");
		}
		if (!room.settings.scavSettings.blitzPoints) room.settings.scavSettings.blitzPoints = {};
		room.settings.scavSettings.blitzPoints[gameType] = blitzPoints;

		room.saveSettings();
		this.privateModAction(`${user.name} has set the points awarded for blitz for ${gameType} hunts to ${blitzPoints}.`);
		this.modlog('SCAV BLITZ', null, `${gameType}: ${blitzPoints}`);

		// double modnote in scavs room if it is a subroomgroupchat
		if (room.parent && !room.persist && scavsRoom) {
			scavsRoom.modlog({
				action: 'SCAV BLITZ',
				loggedBy: user.id,
				note: `${gameType}: ${blitzPoints}`,
			});
			scavsRoom.sendMods(`(${user.name} has set the points awarded for blitz for ${gameType} hunts to ${blitzPoints} in <<${room.roomid}>>.)`);
			scavsRoom.roomlog(`(${user.name} has set the points awarded for blitz for ${gameType} hunts to ${blitzPoints} in <<${room.roomid}>>.)`);
		}
	},

	sethostpoints(target, room, user) {
		room = this.requireRoom();
		const scavsRoom = getScavsRoom(room);
		if (!scavsRoom) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room); // perms for viewing only
		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		if (!target) {
			const pointSetting = Object.hasOwnProperty.call(room.settings.scavSettings, 'hostPoints') ?
				room.settings.scavSettings.hostPoints : DEFAULT_HOST_POINTS;
			return this.sendReply(`The points rewarded for hosting a regular hunt is ${pointSetting}.`);
		}

		this.checkCan('declare', null, room); // perms for editting
		const points = parseInt(target);
		if (isNaN(points)) return this.errorReply(`${target} is not a valid number of points.`);

		room.settings.scavSettings.hostPoints = points;
		room.saveSettings();
		this.privateModAction(`${user.name} has set the points awarded for hosting regular scavenger hunts to ${points}`);
		this.modlog('SCAV SETHOSTPOINTS', null, `${points}`);

		// double modnote in scavs room if it is a subroomgroupchat
		if (room.parent && !room.persist) {
			scavsRoom.modlog({
				action: 'SCAV SETHOSTPOINTS',
				loggedBy: user.id,
				note: `${points} [room: ${room.roomid}]`,
			});
			scavsRoom.sendMods(`(${user.name} has set the points awarded for hosting regular scavenger hunts to - ${points} in <<${room.roomid}>>)`);
			scavsRoom.roomlog(`(${user.name} has set the points awarded for hosting regular scavenger hunts to - ${points} in <<${room.roomid}>>)`);
		}
	},
	setpoints(target, room, user) {
		room = this.requireRoom();
		const scavsRoom = getScavsRoom(room);
		if (!scavsRoom) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room); // perms for viewing only
		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		if (!target) {
			const points = [];
			const source = Object.entries({
				...DEFAULT_POINTS,
				...(room.settings.scavSettings.winPoints as typeof DEFAULT_POINTS || {}),
			});

			for (const entry of source) {
				points.push(`${entry[0]}: ${entry[1].map((p: number, i: number) => `(${(i + 1)}) ${p}`).join(', ')}`);
			}
			return this.sendReplyBox(`The points rewarded for winning hunts is:<br />${points.join('<br />')}`);
		}

		this.checkCan('declare', null, room); // perms for editting

		let [type, ...pointsSet] = target.split(',');
		type = toID(type) as GameTypes;
		if (!RATED_TYPES.includes(type)) return this.errorReply(`You cannot set win points for ${type} hunts.`);
		const winPoints = pointsSet.map(p => parseInt(p));

		if (winPoints.some(p => isNaN(p) || p < 0 || p > 1000) || !winPoints.length) {
			return this.errorReply("The points value awarded for winning a scavenger hunt must be an integer between 0 and 1000.");
		}

		if (!room.settings.scavSettings.winPoints) room.settings.scavSettings.winPoints = {};
		room.settings.scavSettings.winPoints[type] = winPoints;

		room.saveSettings();
		const pointsDisplay = winPoints.map((p, i) => `(${(i + 1)}) ${p}`).join(', ');
		this.privateModAction(`${user.name} has set the points awarded for winning ${type} scavenger hunts to - ${pointsDisplay}`);
		this.modlog('SCAV SETPOINTS', null, `${type}: ${pointsDisplay}`);

		// double modnote in scavs room if it is a subroomgroupchat
		if (room.parent && !room.persist) {
			scavsRoom.modlog({
				action: 'SCAV SETPOINTS',
				loggedBy: user.id,
				note: `${pointsDisplay} [room: ${room.roomid}]`,
			});
			scavsRoom.sendMods(`(${user.name} has set the points awarded for winning ${type} scavenger hunts to - ${pointsDisplay} in <<${room.roomid}>>)`);
			scavsRoom.roomlog(`(${user.name} has set the points awarded for winning ${type} scavenger hunts to - ${pointsDisplay} in <<${room.roomid}>>)`);
		}
	},

	resettwist: 'settwist',
	settwist(target, room, user) {
		room = this.requireRoom();
		const scavsRoom = getScavsRoom(room);
		if (!scavsRoom) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (this.cmd.includes('reset')) target = 'RESET';

		if (!room.settings.scavSettings) room.settings.scavSettings = {};
		if (!target) {
			const twist = room.settings.scavSettings.officialtwist || 'none';
			return this.sendReplyBox(`The current official twist is: ${twist}`);
		}
		this.checkCan('declare', null, room);
		if (target === 'RESET') {
			room.settings.scavSettings.officialtwist = null;
		} else {
			const twist = toID(target);
			if (!ScavMods.twists[twist] || twist === 'constructor') return this.errorReply('Invalid twist.');

			room.settings.scavSettings.officialtwist = twist;
			room.saveSettings();
		}

		if (room.settings.scavSettings.officialtwist) {
			this.privateModAction(`${user.name} has set the official twist to ${room.settings.scavSettings.officialtwist}`);
		} else {
			this.privateModAction(`${user.name} has removed the official twist.`);
		}
		this.modlog('SCAV TWIST', null, room.settings.scavSettings.officialtwist);

		// double modnote in scavs room if it is a subroomgroupchat
		if (room.parent && !room.persist) {
			if (room.settings.scavSettings.officialtwist) {
				scavsRoom.modlog({
					action: 'SCAV TWIST',
					loggedBy: user.id,
					note: `${room.settings.scavSettings.officialtwist} [room: ${room.roomid}]`,
				});
				scavsRoom.sendMods(`(${user.name} has set the official twist to - ${room.settings.scavSettings.officialtwist} in <<${room.roomid}>>)`);
				scavsRoom.roomlog(`(${user.name} has set the official twist to  - ${room.settings.scavSettings.officialtwist} in <<${room.roomid}>>)`);
			} else {
				scavsRoom.sendMods(`(${user.name} has reset the official twist in <<${room.roomid}>>)`);
				scavsRoom.roomlog(`(${user.name} has reset the official twist in <<${room.roomid}>>)`);
			}
		}
	},

	twists(target, room, user) {
		room = this.requireRoom();
		if (!getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		this.checkCan('mute', null, room);
		if (!this.runBroadcast()) return false;

		let buffer = `<table><tr><th>Twist</th><th>Description</th></tr>`;
		buffer += Object.values(ScavMods.twists).map(twist => (
			Utils.html`<tr><td style="padding: 5px;">${twist.name}</td><td style="padding: 5px;">${twist.desc}</td></tr>`
		)).join('');
		buffer += `</table>`;

		this.sendReply(`|raw|<div class="ladder infobox-limited">${buffer}</div>`);
	},

	/**
	 * Scavenger statistic tracking
	 */
	huntcount: 'huntlogs',
	async huntlogs(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('mute', null, room);

		if (target === 'RESET') {
			this.checkCan('declare', null, room);
			await HostLeaderboard.softReset();
			HostLeaderboard.write();
			this.privateModAction(`${user.name} has reset the host log leaderboard into the next month.`);
			this.modlog('SCAV HUNTLOGS', null, 'RESET');
			return;
		} else if (target === 'HARD RESET') {
			this.checkCan('declare', null, room);
			HostLeaderboard.hardReset().write();
			this.privateModAction(`${user.name} has hard reset the host log leaderboard.`);
			this.modlog('SCAV HUNTLOGS', null, 'HARD RESET');
			return;
		}

		let [sortMethod, isUhtmlChange] = target.split(',');

		const sortingFields = ['points', 'cumulative-points'];

		if (!sortingFields.includes(sortMethod)) sortMethod = 'points'; // default sort method

		const data = await HostLeaderboard.visualize(sortMethod) as AnyObject[];
		this.sendReply(
			`|${isUhtmlChange ? 'uhtmlchange' : 'uhtml'}|scav-huntlogs|<div class="ladder" style="overflow-y: scroll; max-height: 300px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Hunts Created</th><th>Total Hunts Created</th><th>History</th></tr>${
				data.map(entry => {
					const auth = room.auth.get(toID(entry.name)).trim();
					const color = auth ? 'inherit' : 'gray';
					return `<tr><td>${entry.rank}</td><td><span style="color: ${color}">${auth || '&nbsp;'}</span>${Utils.escapeHTML(entry.name)}</td>` +
						`<td style="text-align: right;">${(entry.points || 0)}</td>` +
						`<td style="text-align: right;">${(entry['cumulative-points'] || 0)}</td>` +
						`<td style="text-align: left;">${entry['history-points'] ? `<span style="color: gray">{ ${entry['history-points'].join(', ')} }</span>` : ''}</td>` +
						`</tr>`;
				}).join('')
			}</table></div><div style="text-align: center">${
				sortingFields.map(
					f => `<button class="button${f === sortMethod ? ' disabled' : ''}" name="send" value="/scav huntlogs ${f}, 1">${f}</button>`
				).join(' ')
			}</div>`
		);
	},

	async playlogs(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('mute', null, room);

		if (target === 'RESET') {
			this.checkCan('declare', null, room);
			await PlayerLeaderboard.softReset();
			PlayerLeaderboard.write();
			this.privateModAction(`${user.name} has reset the player log leaderboard into the next month.`);
			this.modlog('SCAV PLAYLOGS', null, 'RESET');
			return;
		} else if (target === 'HARD RESET') {
			this.checkCan('declare', null, room);
			PlayerLeaderboard.hardReset().write();
			this.privateModAction(`${user.name} has hard reset the player log leaderboard.`);
			this.modlog('SCAV PLAYLOGS', null, 'HARD RESET');
			return;
		}

		let [sortMethod, isUhtmlChange] = target.split(',');

		const sortingFields = ['join', 'cumulative-join', 'finish', 'cumulative-finish', 'infraction', 'cumulative-infraction'];

		if (!sortingFields.includes(sortMethod)) sortMethod = 'finish'; // default sort method

		const data = await PlayerLeaderboard.visualize(sortMethod) as AnyObject[];
		const formattedData = data.map(d => {
			// always have at least one for join to get a value of 0 if both are 0 or non-existent
			d.ratio = (((d.finish || 0) / (d.join || 1)) * 100).toFixed(2);
			d['cumulative-ratio'] = (((d['cumulative-finish'] || 0) / (d['cumulative-join'] || 1)) * 100).toFixed(2);
			return d;
		});

		this.sendReply(
			`|${isUhtmlChange ? 'uhtmlchange' : 'uhtml'}|scav-playlogs|<div class="ladder" style="overflow-y: scroll; max-height: 300px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Finished Hunts</th><th>Joined Hunts</th><th>Ratio</th><th>Infractions</th></tr>${
				formattedData.map(entry => {
					const auth = room.auth.get(toID(entry.name)).trim();
					const color = auth ? 'inherit' : 'gray';

					return `<tr><td>${entry.rank}</td><td><span style="color: ${color}">${auth || '&nbsp;'}</span>${Utils.escapeHTML(entry.name)}</td>` +
						`<td style="text-align: right;">${(entry.finish || 0)} <span style="color: blue">(${(entry['cumulative-finish'] || 0)})</span>${(entry['history-finish'] ? `<br /><span style="color: gray">(History: ${entry['history-finish'].join(', ')})</span>` : '')}</td>` +
						`<td style="text-align: right;">${(entry.join || 0)} <span style="color: blue">(${(entry['cumulative-join'] || 0)})</span>${(entry['history-join'] ? `<br /><span style="color: gray">(History: ${entry['history-join'].join(', ')})</span>` : '')}</td>` +
						`<td style="text-align: right;">${entry.ratio}%<br /><span style="color: blue">(${(entry['cumulative-ratio'] || "0.00")}%)</span></td>` +
						`<td style="text-align: right;">${(entry.infraction || 0)} <span style="color: blue">(${(entry['cumulative-infraction'] || 0)})</span>${(entry['history-infraction'] ? `<br /><span style="color: gray">(History: ${entry['history-infraction'].join(', ')})</span>` : '')}</td>` +
						`</tr>`;
				}).join('')
			}</table></div><div style="text-align: center">${
				sortingFields.map(
					f => `<button class="button${f === sortMethod ? ' disabled' : ''}" name="send" value="/scav playlogs ${f}, 1">${f}</button>`
				).join(' ')
			}</div>`
		);
	},

	uninfract: "infract",
	infract(target, room, user) {
		room = this.requireRoom('scavengers' as RoomID);
		this.checkCan('mute', null, room);

		const targetId = toID(target);
		if (!targetId) return this.errorReply(`Please include the name of the user to ${this.cmd}.`);
		const change = this.cmd === 'infract' ? 1 : -1;

		PlayerLeaderboard.addPoints(targetId, 'infraction', change, true).write();

		this.privateModAction(`${user.name} has ${(change > 0 ? 'given' : 'taken')} one infraction point ${(change > 0 ? 'to' : 'from')} '${targetId}'.`);
		this.modlog(`SCAV ${this.cmd.toUpperCase()}`, user);
	},

	modsettings: {
		'': 'update',
		'update'(target, room, user) {
			room = this.requireRoom();
			if (!getScavsRoom(room)) return false;
			this.checkCan('declare', null, room);
			const settings = room.settings.scavSettings?.scavmod || {};

			this.sendReply(`|uhtml${this.cmd === 'update' ? 'change' : ''}|scav-modsettings|<div class=infobox><strong>Scavenger Moderation Settings:</strong><br /><br />` +
				`<button name=send value='/scav modsettings ipcheck toggle'><i class="fa fa-power-off"></i></button> Multiple connection verification: ${settings.ipcheck ? 'ON' : 'OFF'}` +
				`</div>`);
		},

		'ipcheck'(target, room, user) {
			room = this.requireRoom();
			if (!getScavsRoom(room)) return false;
			this.checkCan('declare', null, room);

			if (!room.settings.scavSettings) room.settings.scavSettings = {};
			const settings = room.settings.scavSettings.scavmod || {};
			target = toID(target);

			const setting: { [k: string]: boolean } = {
				'on': true,
				'off': false,
				'toggle': !settings.ipcheck,
			};

			if (!(target in setting)) return this.sendReply('Invalid setting - ON, OFF, TOGGLE');

			settings.ipcheck = setting[target];
			room.settings.scavSettings.scavmod = settings;

			room.saveSettings();

			this.privateModAction(`${user.name} has set multiple connections verification to ${setting[target] ? 'ON' : 'OFF'}.`);
			this.modlog('SCAV MODSETTINGS IPCHECK', null, setting[target] ? 'ON' : 'OFF');

			return this.parse('/scav modsettings update');
		},
	},

	/**
	 * Database Commands
	 */
	recycledhunts(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		if (!getScavsRoom(room)) {
			return this.errorReply("Scavenger Hunts can only be added to the database in the scavengers room.");
		}

		let cmd;
		[cmd, target] = Utils.splitFirst(target, ' ');
		cmd = toID(cmd);

		if (!['addhunt', 'list', 'removehunt', 'addhint', 'removehint', 'autostart'].includes(cmd)) {
			return this.parse(`/recycledhuntshelp`);
		}

		if (cmd === 'addhunt') {
			if (!target) return this.errorReply(`Usage: ${cmd} Hunt Text`);

			const [hostsArray, ...questions] = target.split('|');
			const hosts = ScavengerHunt.parseHosts(hostsArray.split(/[,;]/), room, true);
			if (!hosts.length) {
				return this.errorReply("You need to specify a host.");
			}

			const result = ScavengerHunt.parseQuestions(questions);
			if (result.err) return this.errorReply(result.err);

			ScavengerHuntDatabase.addRecycledHuntToDatabase(hosts, result.result);
			return this.privateModAction(`A recycled hunt has been added to the database.`);
		}

		// The rest of the commands depend on there already being hunts in the database.
		if (ScavengerHuntDatabase.isEmpty()) return this.errorReply("There are no hunts in the database.");

		if (cmd === 'list') {
			return this.parse(`/join view-recycledHunts-${room}`);
		}

		const params = target.split(',').map(param => param.trim()).filter(param => param !== '');

		const usageMessages: { [k: string]: string } = {
			'removehunt': 'Usage: removehunt hunt_number',
			'addhint': 'Usage: addhint hunt number, question number, hint text',
			'removehint': 'Usage: removehint hunt number, question number, hint text',
			'autostart': 'Usage: autostart on/off',
		};
		if (!params) return this.errorReply(usageMessages[cmd]);

		const numberOfRequiredParameters: { [k: string]: number } = {
			'removehunt': 1,
			'addhint': 3,
			'removehint': 3,
			'autostart': 1,
		};
		if (params.length < numberOfRequiredParameters[cmd]) return this.errorReply(usageMessages[cmd]);

		const [huntNumber, questionNumber, hintNumber] = params.map(param => parseInt(param));
		const cmdsNeedingHuntNumber = ['removehunt', 'removehint', 'addhint'];
		if (cmdsNeedingHuntNumber.includes(cmd)) {
			if (!ScavengerHuntDatabase.hasHunt(huntNumber)) return this.errorReply("You specified an invalid hunt number.");
		}

		const cmdsNeedingQuestionNumber = ['addhint', 'removehint'];
		if (cmdsNeedingQuestionNumber.includes(cmd)) {
			if (
				isNaN(questionNumber) ||
				questionNumber <= 0 ||
				questionNumber > scavengersData.recycledHunts[huntNumber - 1].questions.length
			) {
				return this.errorReply("You specified an invalid question number.");
			}
		}

		const cmdsNeedingHintNumber = ['removehint'];
		if (cmdsNeedingHintNumber.includes(cmd)) {
			const numQuestions = scavengersData.recycledHunts[huntNumber - 1].questions.length;
			if (isNaN(questionNumber) || questionNumber <= 0 || questionNumber > numQuestions) {
				return this.errorReply("You specified an invalid hint number.");
			}
		}

		if (cmd === 'removehunt') {
			ScavengerHuntDatabase.removeRecycledHuntFromDatabase(huntNumber);
			return this.privateModAction(`Recycled hunt #${huntNumber} was removed from the database.`);
		} else if (cmd === 'addhint') {
			const hintText = params[2];
			ScavengerHuntDatabase.addHintToRecycledHunt(huntNumber, questionNumber, hintText);
			return this.privateModAction(`Hint added to Recycled hunt #${huntNumber} question #${questionNumber}: ${hintText}.`);
		} else if (cmd === 'removehint') {
			ScavengerHuntDatabase.removeHintToRecycledHunt(huntNumber, questionNumber, hintNumber);
			return this.privateModAction(`Hint #${hintNumber} was removed from Recycled hunt #${huntNumber} question #${questionNumber}.`);
		} else if (cmd === 'autostart') {
			if (!room.settings.scavSettings) room.settings.scavSettings = {};
			if (params[0] !== 'on' && params[0] !== 'off') return this.errorReply(usageMessages[cmd]);
			if ((params[0] === 'on') === !!room.settings.scavSettings.addRecycledHuntsToQueueAutomatically) {
				return this.errorReply(`Autostarting recycled hunts is already ${room.settings.scavSettings.addRecycledHuntsToQueueAutomatically ? 'on' : 'off'}.`);
			}
			room.settings.scavSettings.addRecycledHuntsToQueueAutomatically =
				!room.settings.scavSettings.addRecycledHuntsToQueueAutomatically;
			this.privateModAction(`Automatically adding recycled hunts to the queue is now ${room.settings.scavSettings.addRecycledHuntsToQueueAutomatically ? 'on' : 'off'}`);
			if (params[0] === 'on') {
				return this.parse("/scav queuerecycled");
			}
		}
	},

	recycledhuntshelp() {
		if (!this.runBroadcast()) return;
		this.sendReplyBox([
			"<b>Help for Recycled Hunts</b>",
			"- addhunt &lt;Hunt Text>: Adds a hunt to the database of recycled hunts.",
			"- removehunt&lt;Hunt Number>: Removes a hunt form the database of recycled hunts.",
			"- list: Shows a list of hunts in the database along with their questions and hints.",
			"- addhint &lt;Hunt Number, Question Number, Hint Text>: Adds a hint to the specified question in the specified hunt.",
			"- removehint &lt;Hunt Number, Question Number, Hint Number>: Removes the specified hint from the specified question in the specified hunt.",
			"- autostart &lt;on/off>: Sets whether or not recycled hunts are automatically added to the queue when a hunt ends.",
		].join('<br/>'));
	},
};

export const pages: Chat.PageTable = {
	recycledHunts(query, user, connection) {
		this.title = 'Recycled Hunts';
		const room = this.requireRoom();

		let buf = "";
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!room.persist) return;
		this.checkCan('mute', null, room);
		buf += `<div class="pad"><h2>List of recycled Scavenger hunts</h2>`;
		buf += `<ol style="width: 90%;">`;
		for (const hunt of scavengersData.recycledHunts) {
			buf += `<li>`;
			buf += `<h4>By ${hunt.hosts.map((host: AnyObject) => host.name).join(', ')}</h4>`;
			for (const question of hunt.questions) {
				buf += `<details>`;
				buf += `<summary>${question.text}</summary>`;
				buf += `<dl>`;
				buf += `<dt>Answers:</dt>`;
				for (const answer of question.answers) {
					buf += `<dd>${answer}</dd>`;
				}
				buf += `</dl>`;

				if (question.hints.length) {
					buf += `<dl>`;
					buf += `<dt>Hints:</dt>`;
					for (const hint of question.hints) {
						buf += `<dd>${hint}</dd>`;
					}
					buf += `</dl>`;
				}
				buf += `</details>`;
			}
			buf += `</li>`;
		}
		buf += `</ol>`;
		buf += `</div>`;
		return buf;
	},
};

export const commands: Chat.ChatCommands = {
	// general
	scav: 'scavengers',
	scavengers: ScavengerCommands,
	tscav: 'teamscavs',
	teamscavs: ScavengerCommands.teamscavs,
	teamscavshelp: ScavengerCommands.teamscavshelp,

	// old game aliases
	scavenge: ScavengerCommands.guess,
	startpracticehunt: 'starthunt',
	startofficial: 'starthunt',
	startofficialhunt: 'starthunt',
	startminihunt: 'starthunt',
	startunratedhunt: 'starthunt',
	startrecycledhunt: 'starthunt',
	starttwisthunt: 'starthunt',
	starttwistofficial: 'starthunt',
	starttwistpractice: 'starthunt',
	starttwistmini: 'starthunt',
	starttwistunrated: 'starthunt',

	forcestarthunt: 'starthunt',
	forcestartunrated: 'starthunt',
	forcestartpractice: 'starthunt',

	starthtmlpracticehunt: 'starthunt',
	starthtmlofficial: 'starthunt',
	starthtmlofficialhunt: 'starthunt',
	starthtmlminihunt: 'starthunt',
	starthtmlunratedhunt: 'starthunt',
	starthtmlrecycledhunt: 'starthunt',
	starthtmltwisthunt: 'starthunt',
	starthtmltwistofficial: 'starthunt',
	starthtmltwistpractice: 'starthunt',
	starthtmltwistmini: 'starthunt',
	starthtmltwistunrated: 'starthunt',

	forcehtmlstarthunt: 'starthunt',
	forcehtmlstartunrated: 'starthunt',
	forcehtmlstartpractice: 'starthunt',

	starthtmlhunt: 'starthunt',

	starthunt: ScavengerCommands.create,
	joinhunt: ScavengerCommands.join,
	leavehunt: ScavengerCommands.leave,
	resethunt: ScavengerCommands.reset,
	resethunttoqueue: ScavengerCommands.resettoqueue,
	forceendhunt: 'endhunt',
	endhunt: ScavengerCommands.end,
	edithunt: ScavengerCommands.edithunt,
	viewhunt: ScavengerCommands.viewhunt,
	inherithunt: ScavengerCommands.inherit,
	scavengerstatus: ScavengerCommands.status,
	scavengerhint: ScavengerCommands.hint,

	nexthunt: ScavengerCommands.next,

	// point aliases
	scavaddpoints: 'scavengeraddpoints',
	scavengersaddpoints: ScavengerCommands.addpoints,

	scavrmpoints: 'scavengersremovepoints',
	scavengersrmpoints: 'scavengersremovepoints',
	scavremovepoints: 'scavengersremovepoints',
	scavengersremovepoints: ScavengerCommands.addpoints,

	scavresetlb: 'scavengersresetlb',
	scavengersresetlb: ScavengerCommands.resetladder,

	recycledhunts: ScavengerCommands.recycledhunts,
	recycledhuntshelp: ScavengerCommands.recycledhuntshelp,

	scavrank: ScavengerCommands.rank,
	scavladder: 'scavtop',
	scavtop: ScavengerCommands.ladder,
	scavengerhelp: 'scavengershelp',
	scavhelp: 'scavengershelp',
	scavengershelp(target, room, user) {
		if (!room || !getScavsRoom(room)) {
			return this.errorReply("This command can only be used in the scavengers room.");
		}
		if (!this.runBroadcast()) return false;

		const userCommands = [
			"<strong>Player commands:</strong>",
			"- /scavengers: Join the scavengers room.",
			"- /joinhunt: Join the current scavenger hunt.",
			"- /leavehunt: Leave the current scavenger hunt. Also resets your progress.",
			"- /viewhunt: Show the ongoing hunt up to where you solved it.",
			"- /scavenge <em>[guess]</em>: Submit your answer to the current hint.",
			"- /scavengerstatus  (or /scav status): Check your status in the current hunt.",
			"- /scavengers queue (or /scav queue): Showcase the hunts currently in queue, with the answers hidden for any hunt that is not yours.",
			"- /scavengerhint (or /scav hint): View your latest hint in the current game.",
			"- /scavladder (or /scav top): View the current scavengers leaderboard.",
			"- /scavrank <em>[user]</em>: View the rank of the user on the current scavenger leaderboard. Defaults to the user if no name is provided.",
			"For a more in-depth overview, use /scavhelp staff.",
		].join('<br />');
		const staffCommands = [
			"<strong>Staff and auth commands:</strong>",
			"As a <strong>room voice (+)</strong>, you can use the following Scavengers commands, on top of the regular commands (see /scavhelp):",
			"- /scav edithunt <em>[question number]</em>, <em>[hint | answer]</em>, <em>[value]</em>: Edit the ongoing scavenger hunt. Only the host(s) can edit the hunt.",
			"- /scav addhint <em>[question number]</em>, <em>[value]</em>: Add a hint to a question in the ongoing scavenger hunt. Only the host(s) can add a hint.",
			"- /scav edithint <em>[question number]</em>, <em>[hint number]</em>, <em>[value]</em>: Edit a hint to a question in the ongoing scavenger hunt. Only the host(s) can edit a hint.",
			"- /scav removehint <em>[question number]</em>, <em>[hint number]<e/m> (or /scav deletehint): Remove a hint from a question in the current scavenger hunt. Only the host(s) can remove a hint.",
			"- /teamscavshelp: Explains the team scavs plugin.",
			"<br />As a <strong>room driver (%)</strong>, you can also use the following Scavengers commands:",
			"- /scav queue (unrated) <em>[host(s)]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | ...: Queue a scavenger hunt to be started after the current hunt is finished.",
			"- /scav queuehtml (unrated) <em>[host(s)]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | ...: Queue a scavenger hunt that uses HTML to be started after the current hunt is finished.",
			"- /start(official/practice/mini/unrated)hunt <em>[host]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | </em>[answer]</em> | ...: Create a new (official/practice/mini/unrated) scavenger hunt and start it immediately.",
			"- /starthtml(official/practice/mini/unrated)hunt <em>[host]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | </em>[answer]</em> | ...: Create a new (official/practice/mini/unrated) scavenger hunt that uses HTML and start it immediately.",
			"- /scav viewqueue (or /scav queue): Look at the list of queued scavenger hunts. Now also includes the option to remove hunts from the queue.",
			"- /resethunt: Reset the current scavenger hunt without revealing the hints and answers, nor giving out points.",
			"- /resethunttoqueue: Reset the ongoing scavenger hunt without revealing the hints and answers, nor giving out points. Then, add it directly to the queue.",
			"- /scav timer <em>[minutes]</em>: Set a timer to automatically end the current hunt. Setting [minutes] to 0 turns off the timer.",
			"- /endhunt: End the current scavenger hunt immediately and announce the winners and the answers.",
			"- /nexthunt: Start the next hunt in the queue.",
			"- /viewhunt: View the ongoing scavenger hunt. As a host, you can also view the hunt in its entirety.",
			"- /inherithunt: Become the staff host, gaining staff permissions to the current hunt.",
			"- /scav games create <em>[game mode]</em>: start a game of the given mode.",
			"&nbsp;&nbsp;&nbsp;&nbsp;Game modes include: Jump Start, Point Rally, KO games, Scav games and team scavs.",
			"- /scav games end: End the game of the given type.",
			"- /starttwist(hunt / practice / official / mini /unrated) <em>[twist]</em> | <em>[host]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | <em>[hint]</em> | <em>[answer]</em> | … : Create and start a new scavenger hunt that uses a specified twist mode. This can be used inside a scavenger game mode.",
			"- /scav twists: Show a list of all the twists that are available on the server.",
			"- /scav settwist: View the current default official hunt twist that is in use.",
			"- /scav setpoints: Show the current point distribution for officials, minis and regular hunts.",
			"- /scav sethostpoints: Show the current points awarded for hosting hunts.",
			"- /scav setblitz: Show the current points awarded for Blitzing an official, mini or regular hunt.",
			"- /scav defaulttimer: Show the default timer applied to hunts started automatically from the queue.",
			"- /scav addpoints <em>[user]</em>, <em>[amount]</em>: Give the user the specified amount of points towards the current ladder.",
			"- /scav removepoints <em>[user]</em>, <em>[amount]</em>: Remove the specified amount of points from the user towards the current ladder.",
			"- /recycledhunts: Modify the database of recycled hunts and enable/disable autoqueing them.",
			"- /scav queuerecycled <em>[number]</em>: Queue a recycled hunt from the database. If <em>[number]</em> is left blank, then a random hunt is queued.",
			"- /recycledhuntshelp: give more info about the recycled hunts.",
			"<br />As a <strong>room owner (#)</strong>, you can also use the following scavengers commands:",
			"- /scav resetladder: Reset the current scavenger leaderboard.",
			"- /scav setpoints <em>[1st place]</em>, <em>[2nd place]</em>, <em>[3rd place]</em>, <em>[4th place]</em>, <em>[5th place]</em>, ...: Set the point values for wins of officials, minis and regular hunts.",
			"- /scav sethostpoints <em>[value]</em>: Set the point value for hosting regular hunts.",
			"- /scav defaulttimer <em>[value]</em>: Set the default timer applied to automatically started hunts from the queue.",
			"- /scav setblitz <em>[value]</em> ...: Set the blitz award to the given value.",
			"- /scav settwist <em>[twist name]</em>: Set the default twist mode for all official hunts.",
			"- /scav resettwist: Reset the default twist mode for all official hunts to nothing.",
			"- /scav modsettings: Allow or disallow miscellaneous room settings",
		].join('<br />');

		const gamesCommands = [
			"<strong>Game commands:</strong>",
			"- /scav game create <em>[kogames | pointrally | scavengergames | jumpstart | teamscavs]</em>: Start a new scripted scavenger game. (Requires: % @ * # ~)",
			"- /scav game end: End the current scavenger game. (Requires: % @ * # ~)",
			"- /scav game kick <em>[user]</em>: Kick the user from the current scavenger game. (Requires: % @ * # ~)",
			"- /scav game score: Show the current scoreboard for any game with a leaderboard.",
			"- /scav game rank <em>[user]</em>: Show a user's rank in the current scavenger game leaderboard.",
		].join('<br />');

		target = toID(target);

		const display = target === 'all' ?
			`${userCommands}<br /><br />${staffCommands}<br /><br />${gamesCommands}` :
			(
				target === 'staff' || target === 'auth' ? staffCommands :
				target === 'games' || target === 'game' ? gamesCommands : userCommands
			);

		this.sendReplyBox(display);
	},
};
