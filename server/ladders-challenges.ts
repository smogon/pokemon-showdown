import type {ChallengeType} from './room-battle';

/**
 * A bundle of:
 - a ID
 * - a battle format
 * - a valid team for that format
 * - misc other preferences for the battle
 *
 * To start a battle, you need one of these for every player.
 */
export class BattleReady {
	readonly userid: ID;
	readonly formatid: string;
	readonly settings: User['battleSettings'];
	readonly rating: number;
	readonly challengeType: ChallengeType;
	readonly time: number;
	constructor(
		userid: ID,
		formatid: string,
		settings: User['battleSettings'],
		rating: number,
		challengeType: ChallengeType
	) {
		this.userid = userid;
		this.formatid = formatid;
		this.settings = settings;
		this.rating = rating;
		this.challengeType = challengeType;
		this.time = Date.now();
	}
}

export class AbstractChallenge {
	from: ID;
	to: ID;
	ready: BattleReady | null;
	format: string;
	acceptCommand: string | null;
	constructor(from: ID, to: ID, ready: BattleReady | string, acceptCommand: string | null = null) {
		this.from = from;
		this.to = to;
		this.ready = typeof ready === 'string' ? null : ready;
		this.format = typeof ready === 'string' ? ready : ready.formatid;
		this.acceptCommand = acceptCommand;
	}
}
export class BattleChallenge extends AbstractChallenge {
	declare ready: BattleReady;
	declare acceptCommand: string | null;
}
export class GameChallenge extends AbstractChallenge {
	declare ready: null;
	declare acceptCommand: string;
}

/**
 * The defining difference between a BattleChallenge and a GameChallenge is
 * that a BattleChallenge has a Ready (and is for a RoomBattle format) and
 * a GameChallenge doesn't (and is for a RoomGame).
 *
 * But remember that both can have a custom acceptCommand.
 */
export type Challenge = BattleChallenge | GameChallenge;

/**
 * Lists outgoing and incoming challenges for each user ID.
 */
export class Challenges extends Map<ID, Challenge[]> {
	getOrCreate(userid: ID): Challenge[] {
		let challenges = this.get(userid);
		if (challenges) return challenges;
		challenges = [];
		this.set(userid, challenges);
		return challenges;
	}
	/** Returns false if a challenge between these users is already in the table */
	add(challenge: Challenge): boolean {
		const oldChallenge = this.search(challenge.to, challenge.from);
		if (oldChallenge) {
			return false;
		}
		const to = this.getOrCreate(challenge.to);
		const from = this.getOrCreate(challenge.from);
		to.push(challenge);
		from.push(challenge);
		this.update(challenge.to, challenge.from);
		return true;
	}
	/** Returns false if the challenge isn't in the table */
	remove(challenge: Challenge): boolean {
		const to = this.getOrCreate(challenge.to);
		const from = this.getOrCreate(challenge.from);

		const toIndex = to.indexOf(challenge);
		let success = false;
		if (toIndex >= 0) {
			to.splice(toIndex, 1);
			if (!to.length) this.delete(challenge.to);
			success = true;
		}

		const fromIndex = from.indexOf(challenge);
		if (fromIndex >= 0) {
			from.splice(fromIndex, 1);
			if (!from.length) this.delete(challenge.from);
		}
		if (success) this.update(challenge.to, challenge.from);
		return success;
	}
	search(userid1: ID, userid2: ID): Challenge | null {
		const challenges = this.get(userid1);
		if (!challenges) return null;
		for (const challenge of challenges) {
			if (
				(challenge.to === userid1 && challenge.from === userid2) ||
				(challenge.to === userid2 && challenge.from === userid1)
			) {
				return challenge;
			}
		}
		return null;
	}
	clearFor(userid: ID, reason?: string): number {
		const user = Users.get(userid);
		const userIdentity = user ? user.getIdentity() : ` ${userid}`;
		const challenges = this.get(userid);
		if (!challenges) return 0;
		for (const challenge of challenges) {
			const otherid = challenge.to === userid ? challenge.from : challenge.to;
			const otherUser = Users.get(otherid);
			const otherIdentity = otherUser ? otherUser.getIdentity() : ` ${otherid}`;

			const otherChallenges = this.get(otherid)!;
			const otherIndex = otherChallenges.indexOf(challenge);
			if (otherIndex >= 0) otherChallenges.splice(otherIndex, 1);
			if (otherChallenges.length === 0) this.delete(otherid);

			if (!user && !otherUser) continue;
			const header = `|pm|${userIdentity}|${otherIdentity}|`;
			let message = `${header}/challenge`;
			if (reason) message = `${header}/text Challenge cancelled because ${reason}.\n${message}`;
			user?.send(message);
			otherUser?.send(message);
		}
		this.delete(userid);
		return challenges.length;
	}
	getUpdate(challenge: Challenge | null) {
		if (!challenge) return `/challenge`;
		return `/challenge ${challenge.format}|${challenge.ready ? challenge.ready.formatid : ''}`;
	}
	update(userid1: ID, userid2: ID) {
		const challenge = this.search(userid1, userid2);
		const user1 = Users.get(challenge ? challenge.from : userid1);
		const user2 = Users.get(challenge ? challenge.to : userid2);
		const user1Identity = user1 ? user1.getIdentity() : ` ${userid1}`;
		const user2Identity = user2 ? user2.getIdentity() : ` ${userid2}`;
		const message = `|pm|${user1Identity}|${user2Identity}|${this.getUpdate(challenge)}`;
		user1?.send(message);
		user2?.send(message);
	}
	updateFor(connection: Connection | User) {
		const user = connection.user;
		const challenges = this.get(user.id);
		if (!challenges) return;

		const userIdentity = user.getIdentity();
		let messages = '';
		for (const challenge of challenges) {
			let fromIdentity, toIdentity;
			if (challenge.from === user.id) {
				fromIdentity = userIdentity;
				const toUser = Users.get(challenge.to);
				toIdentity = toUser ? toUser.getIdentity() : ` ${challenge.to}`;
			} else {
				const fromUser = Users.get(challenge.from);
				fromIdentity = fromUser ? fromUser.getIdentity() : ` ${challenge.from}`;
				toIdentity = userIdentity;
			}
			messages += `|pm|${fromIdentity}|${toIdentity}|${this.getUpdate(challenge)}\n`;
		}
		connection.send(messages);
	}
}

export const challenges = new Challenges();
