import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	"This command can only be used in the Trivia room.": null, // NOT USED
	"There is no game in progress.": null,
	"a cap of {CAP} points": null, // NOT USED
	"no score cap": null, // NOT USED
	"The currently running game is not Trivia, it's {GAME}.": null,
	"Random ({CATEGORY})": null,
	"You have already signed up for this game.": null,
	"You were kicked from the game and thus cannot join it again.": null,
	"You were kicked from the game and cannot join until the next game.": null,
	"This game does not allow latejoins.": null,
	"Enough players have returned to continue the game!": null, // NOT USED
	"The game will continue with the next question.": null, // NOT USED
	"Not enough players are participating to continue the game!": null, // NOT USED
	"Until there are {MIN} players participating and present, the game will be paused.": null, // NOT USED
	"Signups for a new trivia game have begun!": null, // NOT USED
	"Signups for a new unranked trivia game have begun!": null, // NOT USED
	"Mode: {MODE} | Category: {CATEGORY} | Score cap: {CAP}<br />": null, // NOT USED
	"Sign up for the Trivia game!": null,
	" (You can also type <code>/trivia join</code> to sign up manually.)": null,
	"Mode: {MODE} | Category: {CATEGORY} | Score cap: {CAP}": null, // NOT USED
	"User {TARGETUSER} has already been kicked from the game.": null,
	"User {TARGETUSER} is not a player in the game.": null,
	"You are not a player in the current game.": null,
	"The game has already been started.": null,
	"The game will begin in {SECONDS} seconds...": null,
	"The trivia game is already paused.": null,
	"You cannot pause the trivia game during a question.": null,
	"The Trivia game has been paused.": null,
	"The trivia game is not paused.": null,
	"The Trivia game has been resumed.": null,
	"No questions are left!": null,
	"The game has reached a stalemate": null,
	"Question{this.game.length === 'infinite' ? ": null, // NOT USED
	"Category: {CATEGORY}": null,
	"The answering period has ended!": null,
	"You gained {POINTS} and answered ": null, // NOT USED
	"You answered": null, // NOT USED
	"{CORRECT} questions correctly.": null,
	"{WINNER} won the game with a final score of <strong>{POINTS}</strong>": null,
	", and": null, // NOT USED
	"{PREFIX}their leaderboard score has increased by <strong>{PRIZE1}</strong> points!": null,
	"{PREFIX}their leaderboard score has increased by <strong>{PRIZE1}</strong> points! ": null,
	"{SECOND} was a runner-up and their leaderboard score has increased by <strong>{PRIZE2}</strong> points!": null,
	"{SECOND} and {THIRD} were runners-up. ": null,
	"Their leaderboard score has increased by {PRIZE1}, {PRIZE2}, and {PRIZE3}, respectively!": null,
	"User {WINNER} won the game of ": null,
	"unranked ": null,
	"ranked ": null,
	"{MODE} mode trivia under the {CATEGORY} category with ": null,
	"with {POINTS} points and ": null,
	"{CORRECT} correct answers": null,
	" Second place: {PLAYER} ({POINTS} points)": null,
	", third place: {PLAYER} ({POINTS} points)": null,
	"The game was forcibly ended by {USER}.": null,
	"You are not a player in the current trivia game.": null,
	"The trivia game is paused.": null,
	"There is no question to answer.": null,
	"You have already attempted to answer the current question.": null,
	"Correct: {PLAYERS}": null,
	"Answer(s): {ANSWERS}": null,
	"They gained <strong>5</strong> points!": null,
	"The top 5 players are: {this.formatPlayerList({max: 5})}": null, // NOT USED
	"Correct: no one...": null,
	"Answers: {ANSWERS}": null,
	"Correct": null,
	"No one answered correctly...": null,
	"Each of them gained <strong>{POINTS}</strong> point(s)!": null,
	"They gained <strong>{POINTS}</strong> point(s)!": null,
	"Nobody gained any points.": null,
	"There is already a game of {GAME} in progress.": null,
	"\"{MODE}\" is an invalid mode.": null,
	"\"{CATEGORY}\" is an invalid category.": null, // NOT USED
	"\"{LENGTH}\" is an invalid game length.": null,
	"There are not enough questions in the randomly chosen category to finish a trivia game.": null,
	"There are not enough questions in the trivia database to finish a trivia game.": null,
	"There are not enough questions under the category \"{CATEGORY}\" to finish a trivia game.": null, // NOT USED
	"You are now signed up for this game!": null,
	"The user \"{TARGETUSER}\" does not exist.": null, // NOT USED
	"You have left the current game of Trivia.": null,
	"No valid answer was entered.": null,
	"You have selected \"{ANSWER}\" as your answer.": null,
	"Only Room Owners and higher can force a Trivia game to end with winners in a non-infinite length.": null,
	"{USER} ended the game of Trivia!": null,
	"User {TARGET} does not exist.": null,
	"There is a paused trivia game": null,
	"There is a trivia game in progress": null,
	"and it is in its {PHASE} phase.": null,
	"Current score: {POINTS} | Correct Answers: {CORRECT}": null,
	"User {TARGETUSER} is not a player in the current trivia game.": null,
	"Players: {game.formatPlayerList({max: null, requirePoints: false})}": null, // NOT USED
	"This command can only be used in Question Workshop.": null, // NOT USED
	"Invalid arguments specified in \"{ARGS}\". View /trivia help for more information.": null,
	"{CATEGORY}' is not a valid category. View /trivia help for more information.": null, // NOT USED
	"You cannot submit questions in the '{CATEGORY}' category": null,
	"{QUESTION}' is not a valid question.": null, // NOT USED
	"Question \"{QUESTION}\" is too long! It must remain under {MAX} characters.": null,
	"Question \"{QUESTION}\" is already in the trivia database.": null, // NOT USED
	"No valid answers were specified for question '{QUESTION}'.": null,
	"Some of the answers entered for question '{QUESTION}' were too long!": null, // NOT USED
	"They must remain under {MAX} characters.": null, // NOT USED
	"No questions await review.": null,
	"Category": null, // NOT USED
	"Question": null,
	"Answer(s)": null,
	"Submitted By": null,
	"{TARGET}' is not a valid set of submission index numbers.": null, // NOT USED
	"View /trivia review and /trivia help for more information.": null,
	"{TARGET}' is an invalid argument. View /trivia help questions for more information.": null, // NOT USED
	"{TARGET}' is not a valid argument. View /trivia help questions for more information.": null, // NOT USED
	"{USER} removed question '{TARGET}' from the question database.": null, // NOT USED
	"Question '{TARGET}' was not found in the question database.": null, // NOT USED
	"{QUESTION}' is already in the category '{CATEGORY}'.": null, // NOT USED
	"{USER} changed question category to '{CATEGORY}' for '{QUESTION}' ": null, // NOT USED
	"from the question database.": null,
	"No questions have been submitted yet.": null,
	"Question Count": null,
	"{TARGET}' is not a valid category. View /help trivia for more information.": null, // NOT USED
	"There are no questions in the {CATEGORY} category.": null,
	"There are <strong>{COUNT}</strong> questions in the {CATEGORY} category.": null,
	"No valid search arguments entered.": null,
	"No valid search category was entered. Valid categories: submissions, subs, questions, qs": null,
	"No valid search query as entered.": null, // NOT USED
	"No results found under the {TYPE} list.": null,
	"There are <strong>{COUNT}</strong> matches for your query:=": null, // NOT USED
	"This command can only be used in Trivia.": null, // NOT USED
	"User '{USER}' has not played any trivia games yet.": null, // NOT USED
	"all time:": null, // NOT USED
	"User: <strong>{USER}</strong>": null, // NOT USED
	"Leaderboard score: {SCORE}": null, // NOT USED
	"Total game points: {POINTS}": null, // NOT USED
	"Total correct answers: {CORRECT}": null, // NOT USED
	"No trivia games have been played yet.": null, // NOT USED
	"Rank": null,
	"User": null, // NOT USED
	"Leaderboard score": null,
	"Total game points": null,
	"Total correct answers": null,
	"This command can only be used in Question Workshop": null, // NOT USED
	"{USER} removed all questions of category '{CATEGORY}'.": null,
	"You cannot clear the category '{CATEGORY}'.": null,
	"{CATEGORY}' is an invalid category.": null, // NOT USED
	"There is no game history.": null, // NOT USED
	"{MODE} mode, {LENGTH} length Trivia game in the {CATEGORY} category": null,
	"hosted by {USER}": null,
	"Infinite": null, // NOT USED
	"Signups for a new Mastermind game have begun!": null,
	"The currently running game is not Mastermind, it's {GAME}.": null,
	"The top <strong>{FINALISTS}</strong> players will advance to the finals!": null,
	"Type <code>/mastermind join</code> to sign up for the game.": null,
	"There is already a round of Mastermind in progress.": null,
	"That user is not signed up for Mastermind!": null,
	"The user \"{PLAYER}\" has already played their round of Mastermind.": null,
	"You cannot start the game of Mastermind until there are more players than finals slots.": null,
	"The round of Mastermind has ended!": null,
	"{PLAYER} earned {POINTS} points!": null,
	"You cannot start finals until the user '{PLAYER}' has played a round.": null,
	"There are no questions in the Trivia database.": null,
	"No one scored any points, so it's a tie!": null,
	"{WINNER} won the game of Mastermind with {POINTS} points!": null,
	"{SECOND} and {THIRD} were runners-up with {SECONDPOINTS} and {THIRDPOINTS} points, respectively.": null,
	"{SECOND} was a runner up with {SECONDPOINTS} points.": null,
	"The game of Mastermind was forcibly ended by {USER}.": null,
	"A Mastermind round in the {CATEGORY} category for {PLAYER} is starting!": null,
	"The Mastermind finals are starting!": null,
	"You cannot pass in the finals.": null,
	"You must specify a number that is at least 2 for finalists.": null,
	"{CATEGORY} is not a valid category.": null,
	"You must specify a round length of at least 1 second.": null,
	"You must specify a length of at least 1 second.": null,
	"No round of Mastermind is currently being played.": null,
	"You are not a player in the current round of Mastermind.": null,
	"There is a Mastermind game in progress, and it is in its {PHASE} phase.": null,
	"Players": null,
	"Kicking {USER} would leave this game of Mastermind without enough players to reach {FINALISTS} finalists.": null,
	"There are not enough questions under the specified categories to finish a trivia game.": null,
	"Mode: {MODE} | Category: {CATEGORY} | Cap: {CAP}": null,
	"Players: {PLAYERS}": null,
	"'{CATEGORY}' is not a valid category. View /trivia help for more information.": null,
	"'{QUESTION}' is not a valid question.": null,
	"Some of the answers entered for question '{QUESTION}' were too long!\n": null,
	"'{TARGET}' is not a valid set of submission index numbers.\n": null,
	"'{TARGET}' is an invalid argument. View /trivia help questions for more information.": null,
	"'{TARGET}' is not a valid argument. View /trivia help questions for more information.": null,
	"{USER} changed question category from '{OLDCATEGORY}' to '{CATEGORY}' for '{QUESTION}' ": null,
	"'{TARGET}' is not a valid category. View /help trivia for more information.": null,
	"No valid search query was entered.": null,
	"There are <strong>{COUNT}</strong> matches for your query:": null,
	"<tr><td><strong>{NUMBER}</strong></td><td>{CATEGORY}</td><td>{QUESTION}</td></tr>": null,
	"User '{USER}' has not played any Trivia games yet.": null,
	"No Trivia games have been played yet.": null,
	"'{CATEGORY}' is an invalid category.": null,
	"You have left the current game of Mastermind.": null,
	"Mode: {MODE} | Category: {CATEGORY} | Cap: {CAP}<br />": null,
	"Question {NUMBER}: {QUESTION}": null,
	"You gained {POINTS} points and answered ": null,
	"You answered ": null,
	", and ": null,
	"a cap of {CAP} ": null,
	"a cap of {CAP}": null,
	"The top 5 players are: {PLAYERS}": null,
	"Answer(s): {ANSWERS}<br />": null,
	"Correct: {PLAYERS}<br />": null,
	"Answers: {ANSWERS}<br />": null,
	"{USER} removed question '{TARGET}' (category: {CATEGORY}) from the question database.": null,
	"Signups for a new Trivia game have begun!": null,
	"Signups for a new unranked Trivia game have begun!": null,

};
