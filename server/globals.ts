declare let Config: {[k: string]: any};

declare let Monitor: typeof import('./monitor').Monitor;

declare let LoginServer: typeof import('./loginserver').LoginServer;

// type RoomBattle = AnyObject;

declare let Verifier: typeof import('./verifier');
declare let IPTools: typeof import('./ip-tools').IPTools;
declare let Sockets: typeof import('./sockets');
// let TeamValidator: typeof import('../sim/team-validator');
declare let TeamValidatorAsync: typeof import('./team-validator-async');
