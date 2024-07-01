/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow */

type GroupSymbol = import('./user-groups').GroupSymbol;
type AuthLevel = import('./user-groups').AuthLevel;

/** not actually guaranteed to be one of these */
type PunishType = '#hostfilter' | '#dnsbl' | '#ipban';

// Chat
namespace Chat {
	export type CommandContext = import('./chat').CommandContext;
	export type PageContext = import('./chat').PageContext;
	export type SettingsHandler = import('./chat').SettingsHandler;
	export type PageTable = import('./chat').PageTable;
	export type PageHandler = import('./chat').PageHandler;
	export type ChatCommands = import('./chat').ChatCommands;
	export type ChatHandler = import('./chat').ChatHandler;
	export type ChatFilter = import('./chat').ChatFilter;
	export type NameFilter = import('./chat').NameFilter;
	export type NicknameFilter = import('./chat').NicknameFilter;
	export type StatusFilter = import('./chat').StatusFilter;
	export type LoginFilter = import('./chat').LoginFilter;
	export type PunishmentFilter = import('./chat').PunishmentFilter;
	export type FilterWord = import('./chat').FilterWord;
	export type CRQHandler = import('./chat').CRQHandler;
	export type AnnotatedChatCommands = import('./chat').AnnotatedChatCommands;
	export type AnnotatedChatHandler = import('./chat').AnnotatedChatHandler;
	export type Handlers = import('./chat').HandlerTable;
	export type VNode = import('preact').VNode;
}

// Rooms
type ChatRoom = Rooms.ChatRoom;
type GameRoom = Rooms.GameRoom;
type BasicRoom = Rooms.BasicRoom;
type RoomGame = Rooms.RoomGame;
type MinorActivity = Rooms.MinorActivity;
type RoomBattle = Rooms.RoomBattle;
type Room = Rooms.Room;
type RoomID = "" | "lobby" | "staff" | "upperstaff" | "development" | Lowercase<string> & {__isRoomID: true};
namespace Rooms {
	export type GlobalRoomState = import('./rooms').GlobalRoomState;
	export type ChatRoom = import('./rooms').ChatRoom;
	export type GameRoom = import('./rooms').GameRoom;
	export type BasicRoom = import('./rooms').BasicRoom;
	export type RoomGame = import('./room-game').RoomGame;
	export type SimpleRoomGame = import('./room-game').SimpleRoomGame;
	export type RoomGamePlayer = import('./room-game').RoomGamePlayer;
	export type MinorActivity = import('./room-minor-activity').MinorActivity;
	export type MinorActivityData = import('./room-minor-activity').MinorActivityData;
	export type RoomBattle = import('./room-battle').RoomBattle;
	export type BestOfGame = import('./room-battle-bestof').BestOfGame;
	export type Roomlog = import('./roomlogs').Roomlog;
	export type Room = import('./rooms').Room;
}

namespace JSX {
	export type IntrinsicElements = import('./chat-jsx').PSElements;
}

// Users
type User = Users.User;
type Connection = Users.Connection;
namespace Users {
	export type User = import('./users').User;
	export type Connection = import('./users').Connection;
}

namespace Ladders {
	export type Challenge = import('./ladders-challenges').Challenge;
	export type BattleChallenge = import('./ladders-challenges').BattleChallenge;
	export type GameChallenge = import('./ladders-challenges').GameChallenge;
}
