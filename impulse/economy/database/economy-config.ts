/* Economy Initialize
* Impulse - impulse.psim.us
* @author Trainer Sky <clarkj338@gmail.com>
* @license MIT
* If you want to contribute
* Contact Prince Sy On Main Server
* Or directly create a pull request.
*/
import * as nodePersist from 'node-persist';

// Initialize node-persist storage for the economy system
export const Economy = nodePersist.create({ dir: '../../../impulse/economy/database' });

(async () => {
    await Economy.init();
    console.log("[Server] Economy storage initialized.");
})();
