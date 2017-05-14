'use strict';

const {Session, SockJSConnection} = require('sockjs/lib/transport');

const chars = 'abcdefghijklmnopqrstuvwxyz1234567890-';
let sessionidCount = 0;

/**
 * @return string
 */
function generateSessionid() {
	let ret = '';
	let idx = sessionidCount;
	for (let i = 0; i < 8; i++) {
		ret = chars[idx % chars.length] + ret;
		idx = idx / chars.length | 0;
	}
	sessionidCount++;
	return ret;
}

/**
 * @param {string} sessionid
 * @param {{options: {{}}} config
 * @return SockJSConnection
 */
exports.createSocket = function (sessionid = generateSessionid(), config = {options: {}}) {
	let session = new Session(sessionid, config);
	let socket = new SockJSConnection(session);
	socket.remoteAddress = '127.0.0.1';
	socket.protocol = 'websocket';
	return socket;
};

// TODO: move worker mocks here, use require('../sockets-workers').Multiplexer to stub IPC
