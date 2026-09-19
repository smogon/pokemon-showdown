import type { TranslationCatalog } from '../../server/chat';

export const translations: TranslationCatalog = {
	"The announcement has ended.": null,
	"Battles do not support announcements.": null,
	"You are not allowed to use filtered words in announcements.": null,
	"There is already a poll or announcement in progress in this room.": null,
	"An announcement was started by {USER}.": null,
	"There is no announcement running in this room.": null, // NOT USED
	"There is no timer to clear.": null,
	"The announcement timer was turned off.": null,
	"Invalid time given.": null, // NOT USED
	"The announcement timer is off.": null,
	"The announcement was ended by {USER}.": null,
	"Accepts the following commands:": null, // DYNAMIC KEY (help.map(line => this.TL(line)))

	"That option is not selected.": null,
	"You have already voted for this poll.": null,
	"No options selected.": null,
	"you will not be able to vote after viewing results": null,
	"View results": null,
	"You can't vote after viewing results": null,
	"The poll has ended &ndash; scroll down to see the results": null,
	"Vote for {NUMBER}": null,
	"Submit your vote": null,
	"Quiz": null,
	"Poll": null,
	"Submit": null,
	"ended": null,
	"votes": null,
	"delete": null,
	"Poll too long.": null,
	"Battles do not support polls.": null,
	"You are not allowed to use filtered words in polls.": null,
	"Not enough arguments for /poll new.": null,
	"Too many options for poll (maximum is 8).": null, // NOT USED
	"There are duplicate options in the poll.": null,
	"{USER} queued a poll.": null,
	"A poll was started by {USER}.": null,
	"The queue is already empty.": null,
	"Cleared poll queue.": null,
	"Room \"{ROOMID}\" not found.": null, // NOT USED
	"Can't delete poll at slot {SLOT} - \"{SLOT2}\" is not a number.": null,
	"There is no poll in queue at slot {SLOT}.": null,
	"({USER} deleted the queued poll in slot {SLOT}.)": null,
	"There is no poll running in this room.": null, // NOT USED
	"To vote, specify the number of the option.": null,
	"Option not in poll.": null,
	"The poll timer was turned off.": null,
	"The queued poll was started.": null,
	"The poll timer was turned on: the poll will end in {TIME} minute(s).": null, // NOT USED
	"The poll timer was set to {TIME} minute(s) by {USER}.": null,
	"The poll timer is on and will end in {TIME} minute(s).": null, // NOT USED
	"The poll timer is off.": null,
	"The poll was ended by {USER}.": null,
	"Queued polls:": null,
	"No polls queued.": null,
	"#{NUMBER} in queue": null,
	"Time should be a number of minutes less than one week.": null,
	"Extra escape character. To end a poll with '\\', enter it as '\\\\'": null,
	"Too many options for poll (maximum is {MAX}).": null,
	"The poll timer was turned on: the poll will end in {TIME}.": null,
	"The poll timer is on and will end in {TIME}.": null,
	"The announcement was edited by {USER}.": null,
	"That option is already selected.": null,
};
