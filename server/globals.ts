type PageTable = import('./chat').PageTable
type ChatCommands = import('./chat').ChatCommands
type ChatFilter = import('./chat').ChatFilter
type NameFilter = import('./chat').NameFilter
type StatusFilter = import('./chat').StatusFilter
type LoginFilter = import('./chat').LoginFilter

declare let Config: {[k: string]: any};

declare let Monitor: typeof import('./monitor');

declare let LoginServer: typeof import('./loginserver').LoginServer;

// type RoomBattle = AnyObject;

declare let Verifier: typeof import('./verifier');
declare let IPTools: typeof import('./ip-tools').IPTools;
declare let Sockets: typeof import('./sockets');
// let TeamValidator: typeof import('../sim/team-validator');
declare let TeamValidatorAsync: typeof import('./team-validator-async');
