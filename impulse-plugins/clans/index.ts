import { restoreClanRooms } from './manager';

export const Init = {
    async init() {
        // Restore clan rooms when the server starts
        await restoreClanRooms();
    }
};
