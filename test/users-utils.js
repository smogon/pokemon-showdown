'use strict';

/** @type {typeof import('../lib/streams').ObjectReadWriteStream} */
const ObjectReadWriteStream = require('../lib/streams').ObjectReadWriteStream;

/** @extends {ObjectReadWriteStream<string>} */
class WorkerStream extends ObjectReadWriteStream {
	constructor(id) {
		super();
		this.id = id;
		this.process = {connected: true};
		this.sockets = new Set();
		this.rooms = new Map();
		this.roomChannels = new Map();
	}

	_write(msg) {
		const cmd = msg.charAt(0);
		const params = msg.substr(1).split('\n');
		switch (cmd) {
		case '!':
			return this.removeSocket(...params);
		case '>':
			return this.sendToSocket(...params);
		case '#':
			return this.sendToRoom(...params);
		case '+':
			return this.addToRoom(...params);
		case '-':
			return this.removeFromRoom(...params);
		case '.':
			return this.moveToChannel(...params);
		case ':':
			return this.broadcastToChannels(params[0]);
		}
	}

	addSocket(socketid) {
		this.sockets.add(+socketid);
	}

	removeSocket(socketid) {
		socketid = +socketid;
		if (!this.sockets.has(socketid)) {
			throw new Error(`Attempted to disconnect nonexistent socket ${socketid}`);
		}
		this.sockets.delete(socketid);
		for (const room of this.rooms.values()) {
			room.delete(socketid);
		}
	}

	sendToSocket(socketid, msg) {
		socketid = +socketid;
		if (!this.sockets.has(socketid)) {
			throw new Error(`Attempted to send ${msg} to nonexistent socket ${socketid}`);
		}
	}

	sendToRoom(roomid, msg) {
		if (!this.rooms.has(roomid)) {
			throw new Error(`Attempted to send ${msg} to nonexistent room ${roomid}`);
		}
	}

	addToRoom(roomid, socketid) {
		socketid = +socketid;
		if (!this.rooms.has(roomid)) {
			this.rooms.set(roomid, new Set([socketid]));
			return;
		}

		const room = this.rooms.get(roomid);
		if (room.has(socketid)) {
			throw new Error(`Attempted to redundantly add socket ${socketid} to room ${roomid}`);
		}
		room.add(socketid);
	}

	removeFromRoom(roomid, socketid) {
		socketid = +socketid;
		if (!this.rooms.has(roomid)) {
			throw new Error(`Attempted to remove socket ${socketid} from nonexistent room ${roomid}`);
		}

		const room = this.rooms.get(roomid);
		if (!room.has(socketid)) {
			throw new Error(`Attempted to remove nonexistent socket ${socketid} from room ${roomid}`);
		}

		room.delete(socketid);
		if (!room.size) {
			this.rooms.delete(roomid);
			this.roomChannels.delete(roomid);
		}
	}

	moveToChannel(roomid, channelid, socketid) {
		socketid = +socketid;
		if (!this.rooms.has(roomid)) {
			// happens when destroying rooms
			// throw new Error(`Attempted to move socket ${socketid} to channel ${channelid} of nonexistent room ${roomid}`);
			return;
		}

		if (!this.roomChannels.has(roomid)) {
			if (channelid === '0') return;
			this.roomChannels.set(roomid, new Map([[socketid, channelid]]));
			return;
		}

		const channel = this.roomChannels.get(roomid);
		if (!channel.has(socketid)) {
			if (channelid !== '0') channel.set(socketid, channelid);
			return;
		}

		if (channelid === '0') {
			channel.delete(socketid);
		} else {
			channel.set(socketid, channelid);
		}
	}

	broadcastToChannels(roomid) {
		if (!this.rooms.has(roomid)) {
			throw new Error(`Attempted to broadcast to roomChannels of nonexistent room ${roomid}`);
		}
		if (!this.roomChannels.has(roomid)) {
			throw new Error(`Attempted to broadcast to nonexistent roomChannels of room ${roomid}`);
		}
	}
}

class Worker {
	constructor(id) {
		this.id = id;
		this.stream = new WorkerStream(id);
	}
}

const worker = new Worker(1);

function makeConnection(ip) {
	const workerid = 1;
	let socketid = 1;
	while (Users.connections.has(`${workerid}-${socketid}`)) {
		socketid++;
	}
	worker.stream.addSocket(socketid);

	const connectionid = `${workerid}-${socketid}`;
	const connection = new Users.Connection(connectionid, worker, socketid, null, ip || '127.0.0.1');
	Users.connections.set(connectionid, connection);

	return connection;
}

function makeUser(name, connectionOrIp) {
	if (!connectionOrIp) connectionOrIp = '127.0.0.1';
	const connection = typeof connectionOrIp === 'string' ? makeConnection(connectionOrIp) : connectionOrIp;

	const user = new Users.User(connection);
	connection.user = user;

	if (name) user.forceRename(name, true);
	if (!user.connected) throw new Error("User should be connected");
	if (Users.users.get(user.id) !== user) throw new Error("User should be in user table");
	return user;
}

function destroyUser(user) {
	if (!user || !user.connected) return false;
	user.resetName();
	user.disconnectAll();
	user.destroy();
}

exports.makeConnection = makeConnection;
exports.makeUser = makeUser;
exports.destroyUser = destroyUser;
