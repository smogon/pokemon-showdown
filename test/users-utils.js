'use strict';

const EventEmitter = require('events').EventEmitter;

class Worker extends EventEmitter {
	constructor(id) {
		super();
		this.id = id;
		this.process = {connected: true};
		this.sockets = new Set();
		this.rooms = new Map();
		this.roomChannels = new Map();
		Sockets.workers.set(this.id, this);
	}

	kill() {}

	send(msg) {
		let cmd = msg.charAt(0);
		let params = msg.substr(1).split('\n');
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

		let room = this.rooms.get(roomid);
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

		let room = this.rooms.get(roomid);
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
			throw new Error(`Attempted to move socket ${socketid} to channel ${channelid} of nonexistent room ${roomid}`);
		}

		if (!this.roomChannels.has(roomid)) {
			if (channelid === '0') return;
			this.roomChannels.set(roomid, new Map([[socketid, channelid]]));
			return;
		}

		let channel = this.roomChannels.get(roomid);
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

function createConnection(ip, workerid, socketid) {
	let worker;
	if (workerid) {
		workerid = +workerid;
		worker = Sockets.workers.get(workerid) || new Worker(workerid);
	} else {
		worker = Sockets.workers.get(1) || new Worker(1);
		workerid = worker.id;
	}

	if (!socketid) {
		socketid = 1;
		while (Users.connections.has(`${workerid}-${socketid}`)) {
			socketid++;
		}
	}
	worker.addSocket(socketid);

	let connectionid = `${workerid}-${socketid}`;
	let connection = new Users.Connection(connectionid, worker, socketid, null, ip || '127.0.0.1');
	Users.connections.set(connectionid, connection);

	return connection;
}

function createUser(connection) {
	if (!connection) connection = createConnection();

	let user = new Users.User(connection);
	user.joinRoom('global', connection);
	connection.user = user;

	return user;
}

exports.Connection = createConnection;
exports.User = createUser;
