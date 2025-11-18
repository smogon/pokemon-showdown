/*
 * Pokemon Showdown
 * User Profile Command
 * @author TurboRx
 */

import { nameColor } from '../../colors';
import { ImpulseDB } from '../../impulse-db';
import { Net } from '../../../lib';

const getAvatarBaseUrl = () => Config.avatarUrl || 'https://impulse-server.fun/avatars/';

interface ProfileStatusDocument {
	_id: string;
	status: string;
	updatedAt: Date;
}

interface ProfileBackgroundDocument {
	_id: string;
	background: string;
	updatedAt: Date;
}

const ProfileStatusDB = ImpulseDB<ProfileStatusDocument>('profilestatus');
const ProfileBackgroundDB = ImpulseDB<ProfileBackgroundDocument>('profilebackground');

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
		// Use the server's avatar system for official avatars
		if (Chat.plugins.avatars?.Avatars?.src) {
			// Convert avatar to string format expected by src function
			const avatarStr = typeof avatar === 'string' ? avatar : (typeof avatar === 'number' ? `trainer-${avatar}` : 'unknown');
			avatarUrl = Chat.plugins.avatars.Avatars.src(avatarStr);
		} else {
			// Fallback to default sprite URL
			const avatarName = typeof avatar === 'string' ? avatar : (typeof avatar === 'number' ? `trainer-${avatar}` : 'unknown');
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
		background?: string,
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

	// Get custom profile background if available
	try {
		const backgroundDoc = await ProfileBackgroundDB.findOne({ _id: userid });
		if (backgroundDoc) {
			data.background = backgroundDoc.background;
		}
	} catch {
		// Profile background not available
	}

	// Get registration date from login server
	try {
		const rawResult = await Net(`https://${Config.routes.root}/users/${userid}.json`).get();
		const result = JSON.parse(rawResult);
		if (result.registertime) {
			const date = new Date(result.registertime * 1000);
			data.registrationDate = date.toDateString();
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
 * Get status display with color and icon, optionally with custom status
 */
function getStatusDisplay(user: User | null, customStatus?: string): string {
	let statusText = '';

	if (!user) {
		statusText = `<span style="color:red;">○ Offline</span>`;
	} else {
		const statusType = user.statusType || 'online';
		switch (statusType) {
		case 'busy':
			statusText = `<span style="color:#cc6600;">● Busy</span>`;
			break;
		case 'idle':
			statusText = `<span style="color:gray;">● Idle</span>`;
			break;
		case 'online':
		default:
			statusText = `<span style="color:green;">● Online</span>`;
		}
	}

	// Append custom status if provided
	if (customStatus) {
		statusText += ` [${Chat.escapeHTML(customStatus)}]`;
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

			// Build the profile HTML with optional background image
			const backgroundStyle = profileData.background ?
				`background-image: url('${profileData.background}'); background-size: cover; background-position: center; padding: 10px;` : '';
			let buf = `<div style="${backgroundStyle}">`;

			// Header with name and avatar
			buf += '<div style="text-align:center;margin-bottom:10px;">';
			buf += `<strong style="font-size:18px;">${nameColor(targetName, true, true)}</strong><br>`;
			if (targetUser) {
				buf += getAvatarDisplay(targetUser);
			}
			buf += '</div>';

			// Profile information
			buf += '<div style="text-align:left;padding:0 10px;">';

			// Status with custom status integrated
			buf += `<strong>Status:</strong> ${getStatusDisplay(targetUser, profileData.customStatus)}<br>`;

			// Registration date
			if (profileData.registrationDate) {
				buf += `<strong>Registration Date:</strong> ${profileData.registrationDate}<br>`;
			}

			// Level (if available)
			if (profileData.level !== undefined) {
				buf += `<strong>Level:</strong> ${profileData.level}<br>`;
			}

			// Ontime (if available)
			if (profileData.ontime !== undefined) {
				let totalOntime = profileData.ontime;
				// Add current session time if user is online
				if (targetUser?.connected && targetUser.lastConnected) {
					totalOntime += Date.now() - targetUser.lastConnected;
				}
				buf += `<strong>Total Ontime:</strong> ${formatOntime(totalOntime)}<br>`;
			}

			// Global rank (if available)
			if (targetUser && Config.groups[targetUser.tempGroup]?.name) {
				buf += `<strong>Staff Rank:</strong> ${Config.groups[targetUser.tempGroup].name} (${targetUser.tempGroup})<br>`;
			}

			buf += '</div>';
			buf += '</div>';

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

		async setbackground(target, room, user): Promise<void> {
			if (!target) {
				return this.errorReply("Please provide a background image URL (e.g., 'https://example.com/image.jpg').");
			}

			// Basic validation for URL
			if (target.length > 300) {
				return this.errorReply("Background URL is too long (max 300 characters).");
			}

			// Basic URL validation
			if (!target.startsWith('http://') && !target.startsWith('https://')) {
				return this.errorReply("Background must be a valid URL starting with http:// or https://");
			}

			await ProfileBackgroundDB.updateOne(
				{ _id: user.id },
				{ $set: { _id: user.id, background: target, updatedAt: new Date() } },
				{ upsert: true }
			);

			this.sendReply(`Your profile background has been set. Use /uprofile to see it!`);
		},

		async clearbackground(target, room, user): Promise<void> {
			await ProfileBackgroundDB.deleteOne({ _id: user.id });
			this.sendReply("Your profile background has been cleared.");
		},

		help(): void {
			if (!this.runBroadcast()) return;
			const helpList = [
				{ cmd: "/uprofile [user]", desc: "View a user's profile with avatar, stats, and information." },
				{ cmd: "/uprofile setstatus [message]", desc: "Set a custom status message on your profile (max 100 characters)." },
				{ cmd: "/uprofile clearstatus", desc: "Clear your custom profile status." },
				{ cmd: "/uprofile setbackground [url]", desc: "Set a custom background image for your profile (image URL)." },
				{ cmd: "/uprofile clearbackground", desc: "Clear your custom profile background." },
			];
			const html = `<center><strong>User Profile Commands:</strong></center><hr><ul style="list-style-type:none;padding-left:0;">` +
				helpList.map(({ cmd, desc }, i) =>
					`<li><b>${cmd}</b> - ${desc}</li>${i < helpList.length - 1 ? '<hr>' : ''}`
				).join('') +
				`</ul><small>Note: Named 'uprofile' to avoid conflicts with the existing /profile command.</small>` +
				`<br><small>Background example: 'https://example.com/image.jpg'</small>`;
			this.sendReplyBox(html);
		},
	},

	uprofilehelp(): void { this.parse('/uprofile help'); },
};
