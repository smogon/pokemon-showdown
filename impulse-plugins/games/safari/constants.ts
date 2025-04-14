/**************************************
 * Pokemon Safari Zone Game Constants *
 * Author: @musaddiktemkar            *
 **************************************/

export class SafariConstants {
    /**
     * Time before an inactive game is automatically ended.
     * Default: 2 minutes (120000 milliseconds)
     */
    static readonly INACTIVE_TIME = 2 * 60 * 1000;

    /**
     * Cooldown period between catch attempts.
     * Default: 2 seconds (2000 milliseconds)
     */
    static readonly CATCH_COOLDOWN = 2 * 1000;

    /**
     * Minimum number of players required to start a game.
     * Default: 2 players
     */
    static readonly MIN_PLAYERS = 2;

    /**
     * Maximum number of players allowed in a game.
     * Default: 10 players
     */
    static readonly MAX_PLAYERS = 10;

    /**
     * Default number of Safari Balls given to each player.
     * Default: 20 balls
     */
    static readonly DEFAULT_BALLS = 20;

    /**
     * Minimum number of Safari Balls that can be set for a game.
     * Default: 5 balls
     */
    static readonly MIN_BALLS = 5;

    /**
     * Maximum number of Safari Balls that can be set for a game.
     * Default: 50 balls
     */
    static readonly MAX_BALLS = 50;

    /**
     * Minimum prize pool amount in coins.
     * Default: 10 coins
     */
    static readonly MIN_PRIZE_POOL = 10;

    /**
     * Maximum prize pool amount in coins.
     * Default: 1,000,000 coins
     */
    static readonly MAX_PRIZE_POOL = 1000000;

    /**
     * Time limit for each player's turn.
     * Default: 30 seconds (30000 milliseconds)
     */
    static readonly TURN_TIME = 30 * 1000;

    /**
     * Prize distribution percentages for top 3 players.
     * 1st place: 60%
     * 2nd place: 30%
     * 3rd place: 10%
     */
    static readonly PRIZE_DISTRIBUTION = {
        FIRST: 0.6,
        SECOND: 0.3,
        THIRD: 0.1
    };

    /**
     * Rarity tiers based on Base Stat Total (BST)
     * LEGENDARY: BST >= 600
     * STRONG: BST >= 500
     * MEDIUM: BST >= 400
     * COMMON: BST < 400
     */
    static readonly RARITY_TIERS = {
        LEGENDARY: {
            BST: 600,
            RARITY: 0.05,
            POINTS: 100
        },
        STRONG: {
            BST: 500,
            RARITY: 0.10,
            POINTS: 50
        },
        MEDIUM: {
            BST: 400,
            RARITY: 0.15,
            POINTS: 30
        },
        COMMON: {
            BST: 0,
            RARITY: 0.30,
            POINTS: 10
        }
    };

    /**
     * Game status types
     */
    static readonly STATUS = {
        WAITING: 'waiting',
        STARTED: 'started',
        ENDED: 'ended'
    } as const;

    /**
     * Valid movement directions
     */
    static readonly DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

    /**
     * Maximum size of the Pokemon pool for each game
     * Default: 20 Pokemon
     */
    static readonly MAX_POKEMON_POOL_SIZE = 20;

    /**
     * Sprite URL base for Pokemon animations
     */
    static readonly SPRITE_URL_BASE = 'https://play.pokemonshowdown.com/sprites/ani/';
}
