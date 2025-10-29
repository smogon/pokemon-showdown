/**
 * Headless Battle Runner
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Provides a CLI for piping commands to a BattleStream and receiving
 * either the default text protocol or a JSON-formatted stream which
 * annotates each message with useful metadata for downstream parsers.
 *
 * @license MIT
 */

import {parseArgs} from 'node:util';

import {Streams} from '../lib';
import {BattleStream} from '../sim/battle-stream';

type LogFormat = 'text' | 'json';

interface CLIOptions {
        debug: boolean;
        'no-catch': boolean;
        'keep-alive': boolean;
        replay: boolean | 'spectator' | undefined;
        'log-format': LogFormat;
}

const LOG_FORMATS: readonly LogFormat[] = ['text', 'json'];

class JsonLogFormatter {
        private currentTurn: number | null = null;
        private battleTimestamp: number | null = null;

        format(message: string) {
                const trimmed = message.trim();
                if (!trimmed || trimmed === '|') return null;

                const timestampSeconds = this.extractTimestamp(trimmed);
                if (timestampSeconds !== null) this.battleTimestamp = timestampSeconds;

                const turn = this.extractTurn(trimmed);
                if (turn !== null) this.currentTurn = turn;

                const player = this.extractPlayer(trimmed);
                const timestamp = this.battleTimestamp !== null
                        ? new Date(this.battleTimestamp * 1000).toISOString()
                        : new Date().toISOString();

                return {
                        message: trimmed,
                        timestamp,
                        turn: this.currentTurn,
                        player,
                } as const;
        }

        private extractTimestamp(message: string) {
                if (!message.startsWith('|t:|')) return null;
                const value = Number(message.slice(4));
                return Number.isFinite(value) ? value : null;
        }

        private extractTurn(message: string) {
                if (!message.startsWith('|')) return null;
                const parts = message.split('|');
                if (parts.length < 3) return null;
                if (parts[1] !== 'turn') return null;
                const value = Number(parts[2]);
                return Number.isFinite(value) ? value : null;
        }

        private extractPlayer(message: string) {
                const match = message.match(/p[1-4]/);
                return match ? match[0] : null;
        }
}

function parseLogFormat(value: unknown): LogFormat {
        if (typeof value !== 'string') return 'text';
        const normalized = value.toLowerCase();
        if (LOG_FORMATS.includes(normalized as LogFormat)) {
                return normalized as LogFormat;
        }
        console.error(`Unknown log format "${value}". Supported formats: ${LOG_FORMATS.join(', ')}.`);
        process.exit(1);
}

function parseReplayOption(value: unknown): boolean | 'spectator' | undefined {
        if (value === undefined) return undefined;
        if (typeof value === 'string') {
                if (!value) return true;
                if (value === 'spectator') return 'spectator';
                return true;
        }
        if (typeof value === 'boolean') return value;
        return undefined;
}

function main() {
        const parsed = parseArgs({
                options: {
                        debug: {type: 'boolean', default: false},
                        'no-catch': {type: 'boolean', default: false},
                        'keep-alive': {type: 'boolean', default: false},
                        replay: {type: 'string'},
                        'log-format': {type: 'string', default: 'text'},
                },
                strict: false,
                allowPositionals: true,
        });

        const values = parsed.values as unknown as Partial<CLIOptions>;
        const logFormat = parseLogFormat(values['log-format']);
        const replay = parseReplayOption(values.replay);

        const battleStream = new BattleStream({
                debug: !!values.debug,
                noCatch: !!values['no-catch'],
                keepAlive: !!values['keep-alive'],
                replay: replay ?? false,
        });

        const input = Streams.stdin();
        void input.pipeTo(battleStream).catch(err => {
                console.error('Failed to pipe input into BattleStream:', err);
                process.exitCode = 1;
        });

        if (logFormat === 'json') {
                void pipeJsonOutput(battleStream).catch(err => {
                        console.error('Failed to write BattleStream output:', err);
                        process.exitCode = 1;
                });
                return;
        }

        const output = Streams.stdout();
        void battleStream.pipeTo(output).catch(err => {
                console.error('Failed to write BattleStream output:', err);
                process.exitCode = 1;
        });
}

async function pipeJsonOutput(stream: BattleStream) {
        const formatter = new JsonLogFormatter();
        for await (const chunk of stream) {
                const lines = chunk.split('\n');
                for (const raw of lines) {
                        if (!raw) continue;
                        const entry = formatter.format(raw);
                        if (!entry) continue;
                        process.stdout.write(`${JSON.stringify(entry)}\n`);
                }
        }
}

void main();
