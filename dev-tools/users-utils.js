'use strict';

const EventEmitter = require('events').EventEmitter;

class Worker extends EventEmitter {
	constructor(id) {
		super();
		this.id = id;
		this.process = {connected: true};
		this.sockets = new Set();
		this.channels = new Map();
		this.subchannels = new Map();
		Sockets.workers[this.id] = this;
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
			return this.sendToChannel(...params);
		case '+':
			return this.addToChannel(...params);
		case '-':
			return this.removeFromChannel(...params);
		case '.':
			return this.moveToSubchannel(...params);
		case ':':
			return this.broadcastToSubchannels(params[0]);
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
		this.channels.forEach((channel, channelid) => {
			channel.delete(socketid);
		});
	}

	sendToSocket(socketid, msg) {
		socketid = +socketid;
		if (!this.sockets.has(socketid)) {
			throw new Error(`Attempted to send ${msg} to nonexistent socket ${socketid}`);
		}
	}

	sendToChannel(channelid, msg) {
		if (!this.channels.has(channelid)) {
			throw new Error(`Attempted to send ${msg} to nonexistent channel ${channelid}`);
		}
	}

	addToChannel(channelid, socketid) {
		socketid = +socketid;
		if (!this.channels.has(channelid)) {
			this.channels.set(channelid, new Set([socketid]));
			return;
		}

		let channel = this.channels.get(channelid);
		if (channel.has(socketid)) {
			throw new Error(`Attempted to redundantly add socket ${socketid} to channel ${channelid}`);
		}
		channel.add(socketid);
	}

	removeFromChannel(channelid, socketid) {
		socketid = +socketid;
		if (!this.channels.has(channelid)) {
			throw new Error(`Attempted to remove socket ${socketid} from nonexistent channel ${channelid}`);
		}

		let channel = this.channels.get(channelid);
		if (!channel.has(socketid)) {
			throw new Error(`Attempted to remove nonexistent socket ${socketid} from channel ${channelid}`);
		}

		channel.delete(socketid);
		if (!channel.size) {
			this.channels.delete(channelid);
			this.subchannels.delete(channelid);
		}
	}

	moveToSubchannel(channelid, subchannelid, socketid) {
		socketid = +socketid;
		if (!this.channels.has(channelid)) {
			throw new Error(`Attempted to move socket ${socketid} to subchannel ${subchannelid} of nonexistent channel ${channelid}`);
		}

		if (!this.subchannels.has(channelid)) {
			if (subchannelid === '0') return;
			this.subchannels.set(channelid, new Map([[socketid, subchannelid]]));
			return;
		}

		let subchannel = this.subchannels.get(channelid);
		if (!subchannel.has(socketid)) {
			if (subchannelid !== '0') subchannel.set(socketid, subchannelid);
			return;
		}

		if (subchannelid === '0') {
			subchannel.delete(socketid);
		} else {
			subchannel.set(socketid, subchannelid);
		}
	}

	broadcastToSubchannels(channelid) {
		if (!this.channels.has(channelid)) {
			throw new Error(`Attempted to broadcast to subchannels of nonexistent channel ${channelid}`);
		}
		if (!this.subchannels.has(channelid)) {
			throw new Error(`Attempted to broadcast to nonexistent subchannels of channel ${channelid}`);
		}
	}
}

function createConnection(ip, workerid, socketid) {
	let worker;
	if (workerid) {
		workerid = +workerid;
		worker = Sockets.workers[workerid] || new Worker(workerid);
	} else {
		worker = Sockets.workers[1] || new Worker(1);
		workerid = worker.id;
	}

	if (!socketid) {
		socketid = 1;
		while (Users.connections.has('' + workerid + '-' + socketid)) {
			socketid++;
		}
	}
	worker.addSocket(socketid);

	let connectionid = '' + workerid + '-' + socketid;
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
