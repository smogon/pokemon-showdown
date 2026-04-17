/*
 * Pokemon Showdown - Impulse Server
 * Blackjack SPA Mini-game (Player vs AI)
 * * Pages:
 * view-blackjack — main game interface
 */

import { Utils } from '../../lib';

// ─── Constants & Types ────────────────────────────────────────────────────────

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const TURN_TIME_MS = 30 * 1000; // 30 seconds

type GameStatus = 'playing' | 'playerWon' | 'dealerWon' | 'push' | 'bust';

interface Card {
	suit: string;
	value: string;
}

interface GameState {
	deck: Card[];
	playerHand: Card[];
	dealerHand: Card[];
	status: GameStatus;
	message: string;
	timer?: NodeJS.Timeout | null; // Tracks the active countdown
}

// ─── State Management ─────────────────────────────────────────────────────────

const activeGames = new Map<string, GameState>();

function refreshBlackjack(user: User): void {
	for (const conn of user.connections) {
		if (conn.openPages?.has('blackjack')) {
			Chat.parse('/join view-blackjack', null, user, conn);
		}
	}
}

// ─── Timer Logic ──────────────────────────────────────────────────────────────

function clearGameTimer(userId: string): void {
	const state = activeGames.get(userId);
	if (state && state.timer) {
		clearTimeout(state.timer);
		state.timer = null;
	}
}

function resetGameTimer(userId: string): void {
	clearGameTimer(userId);
	const state = activeGames.get(userId);
	if (!state) return;

	state.timer = setTimeout(() => {
		const currentState = activeGames.get(userId);
		if (!currentState || currentState.status !== 'playing') return;

		// Time is up! Force a stand action.
		currentState.message = '⏳ Time is up! You automatically stood.';
		playDealerTurn(currentState);
		
		currentState.timer = null;
		activeGames.set(userId, currentState);

		// Fetch the user object and force their UI to update
		const u = Users.get(userId);
		if (u) refreshBlackjack(u);
	}, TURN_TIME_MS);
}

// ─── Game Logic ───────────────────────────────────────────────────────────────

function createDeck(): Card[] {
	const deck: Card[] = [];
	for (const suit of SUITS) {
		for (const value of VALUES) {
			deck.push({ suit, value });
		}
	}
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

function calculateHandValue(hand: Card[]): { total: number, isSoft: boolean } {
	let total = 0;
	let aces = 0;

	for (const card of hand) {
		if (card.value === 'A') {
			aces += 1;
			total += 11;
		} else if (['K', 'Q', 'J'].includes(card.value)) {
			total += 10;
		} else {
			total += parseInt(card.value);
		}
	}

	while (total > 21 && aces > 0) {
		total -= 10;
		aces -= 1;
	}

	return { total, isSoft: aces > 0 };
}

function dealInitialGame(): GameState {
	const deck = createDeck();
	return {
		deck,
		playerHand: [deck.pop()!, deck.pop()!],
		dealerHand: [deck.pop()!, deck.pop()!],
		status: 'playing',
		message: 'Your turn. Hit or Stand?',
		timer: null,
	};
}

function playDealerTurn(state: GameState): void {
	let dealerScore = calculateHandValue(state.dealerHand).total;

	while (dealerScore < 17 || (dealerScore === 17 && calculateHandValue(state.dealerHand).isSoft)) {
		state.dealerHand.push(state.deck.pop()!);
		dealerScore = calculateHandValue(state.dealerHand).total;
	}

	const playerScore = calculateHandValue(state.playerHand).total;

	if (dealerScore > 21) {
		state.status = 'playerWon';
		state.message = (state.message.includes('Time') ? state.message + '<br>' : '') + 'Dealer busts with ' + dealerScore + '! You win!';
	} else if (dealerScore > playerScore) {
		state.status = 'dealerWon';
		state.message = (state.message.includes('Time') ? state.message + '<br>' : '') + 'Dealer wins with ' + dealerScore + '.';
	} else if (dealerScore < playerScore) {
		state.status = 'playerWon';
		state.message = (state.message.includes('Time') ? state.message + '<br>' : '') + 'You win with ' + playerScore + ' over Dealer\'s ' + dealerScore + '!';
	} else {
		state.status = 'push';
		state.message = (state.message.includes('Time') ? state.message + '<br>' : '') + 'It\'s a tie at ' + playerScore + '!';
	}
}

// ─── View Renderers ───────────────────────────────────────────────────────────

function renderCard(card: Card, hidden = false): string {
	if (hidden) {
		return '<div style="display:inline-block; border:1px solid #777; border-radius:5px; padding:10px 15px; margin:2px; background:#444; color:#fff; font-weight:bold;">🂠 ?</div>';
	}
	const isRed = card.suit === '♥' || card.suit === '♦';
	const color = isRed ? '#d32f2f' : '#000000';
	const bg = '#ffffff';

	return '<div style="display:inline-block; border:1px solid #ccc; border-radius:5px; padding:10px 15px; margin:2px; background:' + bg + '; color:' + color + '; font-weight:bold; font-size:1.2em; box-shadow: 1px 1px 3px rgba(0,0,0,0.2);">' +
		card.value + card.suit +
	'</div>';
}

function renderGame(user: User, state: GameState): string {
	const playerVal = calculateHandValue(state.playerHand).total;
	let dealerCardsHtml = '';
	let dealerScoreText = '?';

	if (state.status === 'playing') {
		dealerCardsHtml = renderCard(state.dealerHand[0]) + renderCard(state.dealerHand[1], true);
		dealerScoreText = 'Showing ' + calculateHandValue([state.dealerHand[0]]).total;
	} else {
		dealerCardsHtml = state.dealerHand.map(c => renderCard(c)).join('');
		dealerScoreText = calculateHandValue(state.dealerHand).total.toString();
	}

	const playerCardsHtml = state.playerHand.map(c => renderCard(c)).join('');

	// Action UI
	let actionsHtml = '';
	if (state.status === 'playing') {
		actionsHtml =
			'<div style="margin-top: 10px;">' +
				'<button class="button" name="send" value="/blackjack hit" style="padding: 10px 20px; font-size: 1.1em; background: #4CAF50; color: white; border: none; border-radius: 4px; margin-right: 15px;">Hit</button>' +
				'<button class="button" name="send" value="/blackjack stand" style="padding: 10px 20px; font-size: 1.1em; background: #f44336; color: white; border: none; border-radius: 4px; margin-left: 15px;">Stand</button>' +
			'</div>' +
			'<div style="font-size: 0.9em; color: #ffeb3b; margin-top: 15px;">⏳ Auto-stand in 30 seconds.</div>';
	} else {
		let color = '#555';
		if (state.status === 'playerWon') color = '#4CAF50';
		if (state.status === 'dealerWon' || state.status === 'bust') color = '#f44336';
		
		actionsHtml =
			'<div style="font-size: 1.2em; font-weight: bold; color: ' + color + '; margin-bottom: 15px;">' + state.message + '</div>' +
			'<button class="button" name="send" value="/blackjack play" style="padding: 10px 20px; font-size: 1.1em; margin-top: 5px;">Play Again</button>';
	}

	const statusMessageHtml = state.status === 'playing' 
		? '<div style="color:#ddd; margin-bottom:15px; font-size: 1.1em;">' + state.message + '</div>' 
		: '';

	return '<div class="pad" style="max-width: 600px; margin: 0 auto;">' +
		'<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 14px;">' +
			'<strong style="font-size: 1.2em;">🃏 Impulse Blackjack</strong>' +
			'<button class="button" name="send" value="/blackjack quit" style="padding: 6px 12px;">Quit Game</button>' +
		'</div>' +
		'<div style="background: #2b5c33; padding: 20px; border-radius: 8px; border: 4px solid #4a3b2c; text-align: center;">' +
			'<div style="margin-bottom: 20px;">' +
				'<div style="color: #fff; font-weight: bold; margin-bottom: 8px; font-size: 1.1em;">Dealer\'s Hand (' + dealerScoreText + ')</div>' +
				'<div>' + dealerCardsHtml + '</div>' +
			'</div>' +
			'<hr style="border-color: rgba(255,255,255,0.2); margin: 20px 0;">' +
			'<div style="margin-bottom: 20px;">' +
				'<div style="color: #fff; font-weight: bold; margin-bottom: 8px; font-size: 1.1em;">Your Hand (' + playerVal + ')</div>' +
				'<div>' + playerCardsHtml + '</div>' +
			'</div>' +
			'<div style="margin-top: 15px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 6px;">' +
				statusMessageHtml +
				actionsHtml +
			'</div>' +
		'</div>' +
	'</div>';
}

// ─── Page Registrations ───────────────────────────────────────────────────────

export const pages: Chat.PageTable = {
	blackjack(query, user, connection) {
		if (!user.named) return this.errorReply("You must be logged in to play.");
		this.title = 'Blackjack';

		let state = activeGames.get(user.id);
		if (!state) {
			state = dealInitialGame();
			activeGames.set(user.id, state);
			resetGameTimer(user.id);
		}

		return renderGame(user, state);
	},
};

// ─── Commands ─────────────────────────────────────────────────────────────────

export const commands: Chat.ChatCommands = {
	blackjack: {
		''(target, room, user) {
			return this.parse('/blackjack play');
		},

		play(target, room, user) {
			if (!user.named) return this.errorReply("You must be logged in to play.");
			
			clearGameTimer(user.id);
			activeGames.set(user.id, dealInitialGame());
			resetGameTimer(user.id);
			
			return this.parse('/join view-blackjack');
		},

		hit(target, room, user) {
			const state = activeGames.get(user.id);
			if (!state || state.status !== 'playing') return;

			clearGameTimer(user.id);

			state.playerHand.push(state.deck.pop()!);
			const playerVal = calculateHandValue(state.playerHand).total;

			if (playerVal > 21) {
				state.status = 'bust';
				state.message = 'You busted with ' + playerVal + '!';
			} else {
				// Restart the timer since they made a move but are still playing
				resetGameTimer(user.id);
			}

			activeGames.set(user.id, state);
			refreshBlackjack(user);
		},

		stand(target, room, user) {
			const state = activeGames.get(user.id);
			if (!state || state.status !== 'playing') return;

			clearGameTimer(user.id);
			playDealerTurn(state);
			
			activeGames.set(user.id, state);
			refreshBlackjack(user);
		},

		quit(target, room, user) {
			clearGameTimer(user.id);
			activeGames.delete(user.id);
			user.popup("You have left the Blackjack table.");
			for (const conn of user.connections) {
				if (conn.openPages?.has('blackjack')) {
					conn.sendTo(room as Room, `|deinit|view-blackjack`);
				}
			}
		},
		
		help: [
			'<strong>Blackjack commands</strong>',
			'/blackjack play — Start a game against the AI.',
		],
	},

	bj: 'blackjack',
};
