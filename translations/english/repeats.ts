import type {Translations} from '../../server/chat';

export const translations: Translations = {
	strings: {
		"Repeated phrases in ${room.title}": "",
		"No such room: \"${roomid}\".": "",
		"There are no repeated phrases in ${room.title}.": "",
		"Phrase": "",
		"Interval": "",
		"every ${minutes} minute(s)": "",
		"Remove": "",
		"Remove all repeats": "",
		"You must specify a numerical interval of at least 1 minute.": "",
		"The phrase \"${message}\" is already being repeated in this room.": "",
		"${user.name} set the phrase \"${message}\" to be repeated every ${interval} minute(s).": "",
		"The phrase \"${target}\" is not being repeated in this room.": "",
		"${user.name} removed the repeated phrase \"${target}\".": "",
		"There are no repeated phrases in this room.": "",
		"${user.name} removed all repeated phrases.": "",
		"You must specify a room when using this command in PMs.": "",
	},
};
