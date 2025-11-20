/*
 * Pokemon Showdown
 * User Profile Command
 * @author TurboRx
 */

import { nameColor } from '../../colors';
import { ImpulseDB } from '../../impulse-db';
import { Net } from '../../../lib';
import { getAvatarName } from '../../avatar-names';

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-server.fun/avatars/';

interface ProfileStatusDocument {
	_id: string;
	status: string;
	updatedAt: Date;
}

const ProfileStatusDB = ImpulseDB<ProfileStatusDocument>('profilestatus');

/**
 * Get the avatar display for a user, including custom avatars
 */
function getAvatarDisplay(user: User): string {
	const avatar = user.avatar;
	let avatarUrl = '';

	// Check if user has a custom avatar (file with extension)
	if (avatar && typeof avatar === 'string' && avatar.includes('.')) {
		// Custom avatar from config/avatars/ - serve directly
		// Don't use Avatars.src() as it returns empty string for files with extensions
		avatarUrl = `${getAvatarBaseUrl()}${avatar}`;
	} else {
		// Convert numeric avatar to name, then use the server's avatar system
		const avatarName = getAvatarName(avatar);

		// Use the server's avatar system for official avatars
		if (Users.Avatars?.src) {
			avatarUrl = Users.Avatars.src(avatarName);
		}

		// Fallback to default sprite URL if src() returns empty or doesn't exist
		if (!avatarUrl) {
			avatarUrl = `https://${Config.routes.client}/sprites/trainers/${avatarName}.png`;
		}
	}

	return `<img src='${avatarUrl}' width='80' height='80' class='pixelated' style='vertical-align:middle'>`;
}

/**
 * Get user information from various Impulse systems
 */
async function getUserProfileData(userid: string) {
	const data: {
		exp?: number,
		level?: number,
		ontime?: number,
		customStatus?: string,
		registrationDate?: string,
	} = {};

	// Get EXP data if available
	try {
		const expDoc = await ImpulseDB('expdata').findOne({ _id: userid });
		if (expDoc) {
			data.exp = expDoc.exp;
			data.level = expDoc.level;
		}
	} catch {
		// EXP system not available
	}

	// Get ontime data if available
	try {
		const ontimeDoc = await ImpulseDB('ontime').findOne({ _id: userid });
		if (ontimeDoc) {
			data.ontime = ontimeDoc.ontime;
		}
	} catch {
		// Ontime system not available
	}

	// Get custom profile status if available
	try {
		const statusDoc = await ProfileStatusDB.findOne({ _id: userid });
		if (statusDoc) {
			data.customStatus = statusDoc.status;
		}
	} catch {
		// Profile status not available
	}

	// Get registration date from login server
	try {
		const rawResult = await Net(`https://${Config.routes.root}/users/${userid}.json`).get();
		const result = JSON.parse(rawResult);
		if (result.registertime) {
			const date = new Date(result.registertime * 1000);
			// Format as day, month, year for better readability
			const day = date.getDate();
			const month = date.getMonth() + 1; // getMonth() returns 0-11
			const year = date.getFullYear();
			data.registrationDate = `${day}, ${month}, ${year}`;
		}
	} catch {
		// Registration date not available
	}

	return data;
}

/**
 * Format ontime for display
 */
function formatOntime(time: number): string {
	const s = Math.floor((time / 1000) % 60);
	const m = Math.floor((time / (1000 * 60)) % 60);
	const h = Math.floor(time / (1000 * 60 * 60));

	const parts: string[] = [];
	if (h > 0) parts.push(`${h.toLocaleString()} ${h === 1 ? 'hour' : 'hours'}`);
	if (m > 0) parts.push(`${m.toLocaleString()} ${m === 1 ? 'minute' : 'minutes'}`);
	if (parts.length === 0 && s > 0) parts.push(`${s.toLocaleString()} ${s === 1 ? 'second' : 'seconds'}`);
	return parts.length ? parts.join(', ') : '0 seconds';
}

/**
 * Get status display with color and icon
 */
function getStatusDisplay(user: User | null): string {
	let statusText = '';

	if (!user) {
		statusText = `<b style="color: red;">●&nbsp;Offline</b>`;
	} else {
		const statusType = user.statusType || 'online';
		switch (statusType) {
		case 'busy':
			statusText = `<b style="color: orange;">●&nbsp;Busy</b>`;
			break;
		case 'idle':
			statusText = `<b style="color: gray;">●&nbsp;Idle</b>`;
			break;
		case 'online':
		default:
			statusText = `<b style="color: green;">●&nbsp;Online</b>`;
		}
	}

	return statusText;
}

export const commands: Chat.ChatCommands = {
	uprofile: {
		'': 'view',
		async view(target, room, user): Promise<void> {
			if (!this.runBroadcast()) return;

			const targetId = toID(target) || user.id;
			const targetUser = Users.get(targetId);
			const targetName = target || user.name;

			// Get user profile data
			const profileData = await getUserProfileData(targetId);

			// Build the profile HTML in table format
			let buf = '<table cellspacing="0" cellpadding="3" style="min-width:100%;">';
			buf += '<tr>';

			// Avatar section (left side)
			buf += '<td style="width: 80px; text-align: center; border-right: solid 1px black; padding: 12px;">';

			// Username in avatar section
			buf += `<div style="text-align: center; padding-bottom: 6px;"><b class="username">${nameColor(targetName, true, true)}</b></div>`;

			// Avatar image
			if (targetUser) {
				buf += `<div style="text-align: center;">${getAvatarDisplay(targetUser)}</div>`;
			}

			buf += '</td>';

			// Info section (right side)
			buf += '<td>';

			// Status
			buf += `<p style="margin: 4px 0"><u>Status:</u> ${getStatusDisplay(targetUser)}</p>`;

			// Custom status message under [status message]
			if (profileData.customStatus) {
				buf += `<p style="margin: 4px 0"><u>[status message]:</u> ${Chat.escapeHTML(profileData.customStatus)}</p>`;
			}

			// Registration date
			if (profileData.registrationDate) {
				buf += `<p style="margin: 4px 0"><u>Registration Date:</u> <span>${profileData.registrationDate}</span></p>`;
			}

			// Level (if available)
			if (profileData.level !== undefined) {
				buf += `<p style="margin: 4px 0"><u>Level:</u> <span>${profileData.level}</span></p>`;
			}

			// Ontime (if available)
			if (profileData.ontime !== undefined) {
				let totalOntime = profileData.ontime;
				// Add current session time if user is online
				if (targetUser?.connected && targetUser.lastConnected) {
					totalOntime += Date.now() - targetUser.lastConnected;
				}
				buf += `<p style="margin: 4px 0"><u>Total Ontime:</u> <span>${formatOntime(totalOntime)}</span></p>`;
			}

			buf += '</td>';

			buf += '</tr>';
			buf += '</table>';

			this.sendReplyBox(buf);
		},

		async setstatus(target, room, user): Promise<void> {
			if (!target || target.length > 100) {
				return this.errorReply("Please provide a status message (max 100 characters).");
			}

			await ProfileStatusDB.updateOne(
				{ _id: user.id },
				{ $set: { _id: user.id, status: target, updatedAt: new Date() } },
				{ upsert: true }
			);

			this.sendReply(`Your profile status has been set to: "${target}"`);
		},

		async clearstatus(target, room, user): Promise<void> {
			await ProfileStatusDB.deleteOne({ _id: user.id });
			this.sendReply("Your profile status has been cleared.");
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/uprofile [user]", desc: "View a user's profile with avatar, stats, and information." },
				{ cmd: "/uprofile setstatus [message]", desc: "Set a custom status message on your profile (max 100 characters)." },
				{ cmd: "/uprofile clearstatus", desc: "Clear your custom profile status." },
			];
			const html = `<center><strong>User Profile Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Note: Named 'uprofile' to avoid conflicts with the existing /profile command.</small>`;
			this.sendReplyBox(html);
		},
	},

	uprofilehelp(): void { this.parse('/uprofile help'); },
};
