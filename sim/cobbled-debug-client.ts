import * as Net from "net";
import * as readline from "readline";

export function startClient(port: number) {
	const client = new Net.Socket();

	client.on('data', (data) => {
		console.log(data.toString());
	});

	client.on('close', (data) => {
		console.log('Connection closed.');
		client.destroy();
	});

	client.connect(port, 'localhost', () => {
		console.log('Connected');
	});

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('line', (line) => {
		client.write(line);
	});
}
