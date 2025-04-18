/**
 * Server Battle AI
 * Pokemon Showdown - http://pokemonshowdown.com/
 * 
 * Implements the AI decision making for server-controlled battles.
 * 
 * @author musaddiktemkar
 */

import type {Battle} from '../sim/battle';
import type {Pokemon} from '../sim/pokemon';

export class ServerAI {
    makeDecision(battle: Battle, serverSide: number): string {
        const activePokemon = battle.sides[serverSide].active[0];
        if (!activePokemon) return '';

        // Check if we should switch
        if (this.shouldSwitch(battle, serverSide)) {
            const switchTarget = this.chooseSwitchTarget(battle, serverSide);
            if (switchTarget !== -1) {
                return `switch ${switchTarget + 1}`;
            }
        }

        // Choose a move if we can't or shouldn't switch
        return this.chooseMove(battle, serverSide);
    }

    private shouldSwitch(battle: Battle, serverSide: number): boolean {
        const active = battle.sides[serverSide].active[0];
        if (!active) return false;

        // Switch if HP is very low
        if (active.hp / active.maxhp < 0.2) return true;

        return false;
    }

    private chooseSwitchTarget(battle: Battle, serverSide: number): number {
        const side = battle.sides[serverSide];
        const possibleSwitches = side.pokemon.filter((pokemon, index) => {
            return index !== side.active[0].position && // Not currently active
                   !pokemon.fainted && // Not fainted
                   !pokemon.trapped; // Not trapped
        });

        if (!possibleSwitches.length) return -1;

        // Pick a random available Pokemon
        return possibleSwitches[Math.floor(Math.random() * possibleSwitches.length)].position;
    }

    private chooseMove(battle: Battle, serverSide: number): string {
        const activePokemon = battle.sides[serverSide].active[0];
        if (!activePokemon) return '';

        const possibleMoves: string[] = [];
        
        // Collect all available moves
        for (const moveSlot of activePokemon.moveSlots) {
            if (!moveSlot.disabled) {
                possibleMoves.push(moveSlot.id);
            }
        }

        if (!possibleMoves.length) return 'default'; // Use struggle if no moves available

        // Pick a random move
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return `move ${move}`;
    }

    private calculateEffectiveness(move: string, target: Pokemon, battle: Battle): number {
        const moveData = battle.dex.moves.get(move);
        let effectiveness = 1;

        // Calculate type effectiveness
        for (const type of target.types) {
            const typeEff = battle.dex.getEffectiveness(moveData.type, type);
            effectiveness *= Math.pow(2, typeEff);
        }

        return effectiveness;
    }
}
