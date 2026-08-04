import * as ConfigLoader from './config-loader';
import { SQL } from '../lib';

const PLUGIN_DATABASE_PATH = './databases/chat-plugins.db';

export const pluginDatabase = SQL('chat-db', module, {
	file: global.Config?.nofswriting ? ':memory:' : PLUGIN_DATABASE_PATH,
});

if (!pluginDatabase.isParentProcess) {
	ConfigLoader.ensureLoaded();
	global.Monitor = {
		crashlog(error: Error, source = 'A chat child process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	} as any;
	process.on('uncaughtException', err => {
		Monitor.crashlog(err, 'A chat database process');
	});
	process.on('unhandledRejection', err => {
		Monitor.crashlog(err as Error, 'A chat database process');
	});
	// eslint-disable-next-line no-eval
	pluginDatabase.startRepl(cmd => eval(cmd));
}
