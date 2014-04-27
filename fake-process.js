var EventEmitter = require("events").EventEmitter;

function FakeProcessHelper(input, output) {
	this.input = input;
	this.output = output;
};
FakeProcessHelper.prototype = {
	input: null,
	output: null,
	on: function (event, callback) {
		setImmediate(this.input.on.bind(this.input, event, callback));
		return this;
	},
	send: function (message) {
		setImmediate(this.output.emit.bind(this.output, 'message', message));
		return this;
	}
};

function FakeProcess() {
	this.serverEmitter = new EventEmitter();
	this.clientEmitter = new EventEmitter();
	this.server = new FakeProcessHelper(this.clientEmitter, this.serverEmitter);
	this.client = new FakeProcessHelper(this.serverEmitter, this.clientEmitter);
}

exports.FakeProcess = FakeProcess;
