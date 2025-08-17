/**
 * @author mia-pi-git
 */
import { LocalClassifier } from './local';
import { RemoteClassifier } from './remote';
import * as ConfigLoader from './../config-loader';

export { LocalClassifier, RemoteClassifier };

export function destroy() {
	void LocalClassifier.destroy();
	void RemoteClassifier.PM.destroy();
}

export function start(processCount: ConfigLoader.SubProcessesConfig) {
	LocalClassifier.start(processCount);
	RemoteClassifier.start(processCount);
}
