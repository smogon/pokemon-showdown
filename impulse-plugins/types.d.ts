/**
 * Type definitions for Server Battle Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 */

declare interface ServerBattleState {
    roomid: string;
    format: string;
    p1: string;
    p2: string;
    turn: number;
}

declare interface AIDecision {
    type: 'move' | 'switch' | 'default';
    target?: number;
    move?: string;
}
