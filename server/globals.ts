type PageTable = import('./chat').PageTable
type ChatCommands = import('./chat').ChatCommands
type ChatFilter = import('./chat').ChatFilter
type NameFilter = import('./chat').NameFilter

declare let Config: {[k: string]: any};

declare let Monitor: typeof import('./monitor');

declare let LoginServer: typeof import('./loginserver');

// type RoomBattle = AnyObject;

declare let Verifier: typeof import('./verifier');
declare let Dnsbl: typeof import('./dnsbl');
declare let Sockets: typeof import('./sockets');
// let TeamValidator: typeof import('../sim/team-validator');
declare let TeamValidatorAsync: typeof import('./team-validator-async');
