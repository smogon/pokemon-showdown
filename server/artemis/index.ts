/**
 * @author mia-pi-git
 */
import { LocalClassifier } from './local';
import { RemoteClassifier } from './remote';
import type { SubProcessesConfig } from './../config-loader';

export { LocalClassifier, RemoteClassifier };

export function destroy() {
	void LocalClassifier.destroy();
	void RemoteClassifier.PM.destroy();
}

export function start(processCount: SubProcessesConfig) {
	LocalClassifier.start(processCount);
	RemoteClassifier.start(processCount);
}
