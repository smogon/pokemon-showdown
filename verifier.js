// Because I don't want two files, we're going to fork ourselves.

// Node.js's crypto functions are synchronous, strangely, unlike the rest of Node
// here's an asynchronous implementation.

if (!process.send) {

	// This is the parent

	var guid = 1;
	var callbacks = {};
	var callbackData = {};

	var child = require('child_process').fork('verifier.js');
	exports.verify = function(data, signature, callback) {
		var localGuid = guid++;
		callbacks[localGuid] = callback;
		callbackData[localGuid] = data;
		child.send({data: data, sig: signature, guid: localGuid});
	}
	child.on('message', function(response) {
		if (callbacks[response.guid]) {
			callbacks[response.guid](response.success, callbackData[response.guid]);
			delete callbacks[response.guid];
			delete callbackData[response.guid];
		}
	});

} else {

	// This is the child

	var config = require('./config/config.js');
	var crypto = require('crypto');

	var keyalgo = config.loginserverkeyalgo;
	var pkey = config.loginserverpublickey;

	process.on('message', function(message) {
		var verifier = crypto.createVerify(keyalgo);
		verifier.update(message.data);
		var success = false;
		try {
			success = verifier.verify(pkey, message.sig, 'hex');
		} catch (e) {}
		process.send({
			success: success,
			guid: message.guid
		});
	});

}
