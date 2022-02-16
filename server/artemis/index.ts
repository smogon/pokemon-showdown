/**
 * @author mia-pi-git
 */
import {LocalClassifier} from './local';
import {RemoteClassifier} from './remote';

export {LocalClassifier, RemoteClassifier};

export function destroy() {
	void LocalClassifier.destroy();
	void RemoteClassifier.PM.destroy();
}
