/* Emoticons Plugin
 * This is a chat-plugin for an Emoticons system on PS
 * You will need a line in parser to actually  parse 
 * this so that it works.  Also, you will need need to 
 * add a few lines to the PM command.
 * Credits: panpawn
 *
 * Current Features:
 * - Emoticon Moderated chat based on rank (for chat rooms)
 * - Command based adding and removing of emoticons
 * - Saves the emote moderated chat status in each chat room on restart
 * - Checks if a user is shadowbanned and reacts accordingly
 * - Does not require server-side CSS (./config/custom.css) elements for usernames
 * - Checks the number of chat emoticons in one message and won't parse if it is more than Gold.emoticons.maxChatEmotes
 * - Administrators can toggle how many emoticons users can do in their messages with a command
 * - Now parses for PS formats such as bold, italics, and strikethrough
 * - PMs emoticons
 *
 * TODO:
 * - Links parsing in emoticon messages?
 * - Limit to number of PMs emoticons in one message...?
 */

var fs = require('fs');
var serialize = require('node-serialize');
var emotes = {};
var style = "background:none;border:0;padding:0 5px 0 0;font-family:Verdana,Helvetica,Arial,sans-serif;font-size:9pt;cursor:pointer";

if (typeof Gold === 'undefined') global.Gold = {};

Gold.emoticons = {
	maxChatEmotes: 4, //the default maximum number of emoticons in one chat message that gets parsed
	adminBypassMaxChatEmotes: true, //can administrators use as many emoticons as they wish?
	chatEmotes: {},
	processEmoticons: function(text) {
		var patterns = [],
		metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g,
		self = this;
		for (var i in this.chatEmotes) {
			if (this.chatEmotes.hasOwnProperty(i)) {
				patterns.push('(' + i.replace(metachars, "\\$&") + ')');
			}
		}
		return text.replace(new RegExp(patterns.join('|'), 'g'), function(match) {
			return typeof self.chatEmotes[match] != 'undefined' ?
				'<img src="' + self.chatEmotes[match] + '" title="' + match + '"/>' :
				match;
		});
	},
	checkEmoteModchat: function(user, room) {
		var rank = (user.group !== ' ' ? user.group : (room.auth ? room.auth[user.userid] : user.group));
		switch (room.emoteModChat) {
			case undefined:
			case false:
				return true;
				break;
			case 'ac':
			case 'autoconfirmed':
				return (user.autoconfirmed ? true : false);
				break;
			default:
				groups = Config.groupsranking;
				var i = groups.indexOf(rank); // rank # of user
				var u = groups.indexOf(room.emoteModChat); // rank # of emote modchat
				if (i >= u) return true;
		}
		return false;
	},
	processChatData: function(user, room, connection, message) {
		var match = false;
		var parsed_message = this.processEmoticons(message);
		for (var i in this.chatEmotes) {
			if (~message.indexOf(i)) {
				if ((parsed_message.match(/<img/g) || []).length <= this.maxChatEmotes || (this.adminBypassMaxChatEmotes && user.group === '~')) {
					match = true;
				} else {
					match = false;
				}
			}
		}
		switch (Users.ShadowBan.checkBanned(user) && match) {
			case true:
				origmsg = message;
				message = Tools.escapeHTML(message);
				message = this.processEmoticons(message);
				user.sendTo(room, '|html|' + 
					user.getIdentity(room).substr(0,1) + '<button style="' + style + '" name="parseCommand" value="/user ' +
					user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>'
				);
				room.update();
				Users.ShadowBan.addMessage(user, "To " + room, origmsg);
				break;
			case false:
				if (!this.checkEmoteModchat(user, room)) {
					kitty = message = this.processEmoticons(message);
					var message = Tools.escapeHTML(kitty);
					return (message);
					return;
				} else if (this.checkEmoteModchat(user, room)) {
					if (!match || message.charAt(0) === '!') return true;
					message = Tools.escapeHTML(message);
					message = this.processEmoticons(message);

					//PS formatting
					message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); //italics
					message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); //bold
					message = message.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); //strikethrough

					if (user.hiding) {
						room.addRaw(' <button style="' + style + '" name="parseCommand" value="/user ' +
						user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>');
						room.update();
					}
					room.addRaw(user.getIdentity(room).substr(0,1) + '<button style="' + style + '" name="parseCommand" value="/user ' +
					user.name + '">' + '<b><font color="' + Gold.hashColor(user.userid) + '">' + Tools.escapeHTML(user.name) + ':</font></b></button> ' + message + '</div>');
					room.update();
					room.messageCount++;
					return false;
				}
				break;
		}
	},
	processPMsParsing: function (message) {
		emoteRegex = [];
		for (var emote in this.chatEmotes) {
			emoteRegex.push(emote);
		}
		emoteRegex = new RegExp('(' + emoteRegex.join('|') + ')', 'g');
		self = this;
		if (emoteRegex.test(message)) {
			message = message.replace(emoteRegex, function (match) {
				return '<img src=' + self.chatEmotes[match] + ' title=' + match + '>';
			});
			return message;
		}
		return false;
	}
};


// commands

function loadEmotes() {
	try {
		emotes = serialize.unserialize(fs.readFileSync('config/emotes.json', 'utf8'));
		Object.merge(Gold.emoticons.chatEmotes, emotes);
	} catch (e) {}
}
setTimeout(function(){loadEmotes();},1000);

function saveEmotes() {
	try {
		fs.writeFileSync('config/emotes.json',serialize.serialize(emotes));
		Object.merge(Gold.emoticons.chatEmotes, emotes);
	} catch (e) {}
}

exports.commands = {
	emotes: 'ezemote',
	temotes: 'ezemote',
	temote: 'ezemote',
	emote: 'ezemote',
	ec: 'ezemote',
	ezemote: function (target, room, user) {
		if (!target) target = "help";
		var parts = target.split(',');
		for (var u in parts) parts[u] = parts[u].trim();

		try {
			switch (toId(parts[0])) {

				case 'add':
					if (!this.can('pban')) return this.errorReply("Access denied.");
					if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
					if (!(parts[2] || parts[3])) return this.errorReply("Usage: /emote add, [emoticon], [link]");
					var emoteName = parts[1];
					if (Gold.emoticons.chatEmotes[emoteName]) return this.errorReply("ERROR - the emoticon: " + emoteName + " already exists.");
					var link = parts.splice(2, parts.length).join(',');
					var fileTypes = [".gif",".png",".jpg"];
					if (!~fileTypes.indexOf(link.substr(-4))) return this.errorReply("ERROR: the emoticon you are trying to add must be a gif, png, or jpg.");
					emotes[emoteName] = Gold.emoticons.chatEmotes[emoteName] = link;
					saveEmotes();
					this.sendReply("The emoticon " + emoteName + " has been added.");
					this.logModCommand(user.name + " added the emoticon: " + emoteName);
					Rooms.get('staff').add("The emoticon " + emoteName + " was added by " + Tools.escapeHTML(user.name) + ".");
					Rooms.get('staff').update();
					break;

				case 'rem':
				case 'remove':
				case 'del':
				case 'delete':
					if (!this.can('pban')) return this.errorReply("Access denied.");
					if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
					if (!parts[1]) return this.errorReply("/emote remove, [emoticon]");
					emoteName = parts[1];
					if (!Gold.emoticons.chatEmotes[emoteName]) return this.errorReply("ERROR - the emoticon: " + emoteName + " does not exist.");
					delete Gold.emoticons.chatEmotes[emoteName];
					delete emotes[emoteName];
					saveEmotes();
					this.sendReply("The emoticon " + emoteName + " has been removed.");
					this.logModCommand(user.name + " removed the emoticon: " + emoteName);
					Rooms.get('staff').add("The emoticon " + emoteName + " was removed by " + Tools.escapeHTML(user.name) + ".");
					Rooms.get('staff').update();
					break;

				case 'list':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.errorReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					var output = "<b>There's a total of " + Object.size(emotes) + " emoticons added with this command:</b><br />";
					for (var e in emotes) {
						output += e + "<br />";
					}
					this.sendReplyBox("<div class=\"infobox-limited\" target=\"_blank\">" + output + "</div>");
					break;

				case 'view':
					if (!this.canBroadcast()) return;
					var name = Object.keys(Gold.emoticons.chatEmotes);
					emoticons = [];
					var len = name.length;
					while (len--) {
						emoticons.push((Gold.emoticons.processEmoticons(name[(name.length - 1) - len]) + '&nbsp;' + name[(name.length - 1) - len]));
					}
					this.sendReplyBox("<div class=\"infobox-limited\" target=\"_blank\"><b><u>List of emoticons (" + Object.size(emotes) + "):</b></u> <br/><br/>" + emoticons.join(' ').toString() + "</div>");
					break;

				case 'max':
				case 'maxemotes':
					if (!this.can('hotpatch')) return false;
					if (!parts[1]) return this.errorReply("Usage: /emote max, [max emotes per message].");
					if (Number(parts[1]) < 1) return this.errorReply("Max emotes cannot be less than 1.");
					if (isNaN(Number(parts[1]))) return this.errorReply("The max emotes must be a number.");
					if (~String(parts[1]).indexOf('.')) return this.errorReply("Cannot contain a decimal.");
					Gold.emoticons.maxChatEmotes = parts[1];
					this.privateModCommand("(" + user.name + " has set the max emoticons per message to be " + parts[1] + ".)");
					break;

				case 'object':
					if (!this.canBroadcast()) return;
					if (this.broadcasting) return this.errorReply("ERROR: this command is too spammy to broadcast.  Use / instead of ! to see it for yourself.");
					this.sendReplyBox("Gold.emoticons.chatEmotes = " + fs.readFileSync('config/emotes.json','utf8'));
					break;

				case 'modchat':
					if (!parts[1]) parts[1] = "status";
					switch (parts[1]) {
						case 'set':
							if (room.type === 'chat' && !this.can('ban', null, room) || room.type === 'battle' && !this.can('privateroom', null, room)) return this.errorReply("Access denied.");
							if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
							if (room.isPersonal) return this.errorReply("You cannot set emoticon moderated chat in personal rooms.");
							if (!parts[2]) return this.errorReply("Usage: /emote modchat, set, [rank] - Sets modchat for emoticons in the respected room.");
							if (!Config.groups[parts[2]] && toId(parts[2]) !== 'autoconfirmed' && toId(parts[2]) !== 'ac' || parts[2] === '★') return this.errorReply("ERROR: " + parts[2] + " is not a defined group in Config or is not yet optimized for moderated emoticon chat at this time.");
							if (room.emoteModChat === parts[2]) return this.errorReply("Emoticon modchat is already enabled in this room for the rank you're trying to set it to.");
							room.emoteModChat = parts[2];
							if (room.type === 'chat') room.chatRoomData.emoteModChat = room.emoteModChat;
							Rooms.global.writeChatRoomData();
							this.add("|raw|<div class=\"broadcast-red\"><b>Chat Emoticons Moderated Chat has been set!</b><br />To use emoticons in this room, you must be of rank <b>" + parts[2] + "</b> or higher.");
							room.update();
							this.privateModCommand("(" + user.name + " has set emoticon moderated chat for rank " + parts[2] + " and up.)");
							break;
						case 'off':
						case 'disable':
							if (room.type === 'chat' && !this.can('ban', null, room) || room.type === 'battle' && !this.can('privateroom', null, room)) return this.errorReply("Access denied.");
							if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
							if (room.isPersonal) return this.errorReply("Emoticon moderated chat is enabled in personal rooms by default and cannot be changed.");
							if (!room.emoteModChat) return this.errorReply("Emoticon modchat is already disabled in this room.");
							room.emoteModChat = false;
							if (room.type === 'chat') room.chatRoomData.emoteModChat = room.emoteModChat;
							Rooms.global.writeChatRoomData();
							this.add("|raw|<div class=\"broadcast-blue\"><b>Chat Emoticons Moderated Chat has been disabled!</b><br />Everyone in this room may use chat emoticons.");
							room.update();
							this.privateModCommand("(" + user.name + " has enabled chat emoticons for everyone in this room.)");
							break;
						default:
						case 'status':
							var status = (room.emoteModChat === undefined || !room.emoteModChat ? false : room.emoteModChat); 
							return this.sendReply("Emoticon moderated chat is currently set to: " + status);
							break;
					}
					break;

				case 'reload':
				case 'hotpatch':
					if (!this.can('hotpatch')) return false;
					loadEmotes();
					this.privateModCommand("(" + user.name + " has reloaded all emoticons on the server.)");
					break;

				case 'help':
				default:
					if (!this.canBroadcast()) return;
					this.sendReplyBox(
						"<table bgcolor=\"#ADD8E6\" width=\"100%\"><td>" +
							"<center><b>Emoticon Commands:</b><br />" +
							"<i><font color=\"gray\">(By: <a href=\"https://github.com/panpawn/Pokemon-Showdown/blob/master/chat-plugins/emoticons.js\">panpawn</a>)</font></i></center><br />" +
							"/emote <code>add, [emote], [link]</code> - Adds a chat emoticon. Requires ~.<br />" +
							"/emote <code>remove, [emote]</code> - Removes a chat emoticon. Requires ~.<br />" +
							"/emote <code>modchat, set, [rank symbol / disable]</code> - Sets moderated chat for chat emoticons in the respected room to the respected rank. Requires @, #, &, ~.<br />" +
							"/emote <code>modchat, disable</code> - Disables moderated chat for chat emoticons (enabled by default.) Requires @, #, &, ~.<br />" +
							"/emote <code>modchat</code> - Views the current moderated chat status of chat emoticons.<br />" +
							"/emote <code>list</code> - Shows the chat emoticons in a list form.<br />" +
							"/emote <code>view</code> - Shows all of the current chat emoticons with the respected image.<br />" +
							"/emote <code>object</code> - Shows the object of Gold.emoticons.chatEmotes. (Mostly for development usage)<br />" +
							"/emote <code>max, [max emotes / message]</code> - Sets the max emoticon messages per chat message.  Requires ~.<br />" +
							"/emote <code>help</code> - Shows this help command.<br />" +
						"</td></table>"
					);
			}
		} catch (e) {
			console.log("ERROR!  The Emoticon script has crashed!\n" + e.stack);
		}
	},
	emoticonlist: 'emotelist',
	emotelist: function(target, room, user) {
		return this.errorReply("Try /emote view instead.");
	}
};
