import type {Translations} from '../../server/chat';

export const translations: Translations = {
	strings: {
		"Repeated phrases in ${room.title}": "Wiederholte Ausdrücke in ${room.title}",
		"There are no repeated phrases in ${room.title}.": "Es liegen keine wiederholten Ausdrücke in ${room.title} vor.",
		"Action": "",
		"Phrase": "Ausdruck",
		"Identifier": "",
		"Interval": "Zeitspanne",
		"every ${minutes} minute(s)": "jede ${minutes} Minute(n)",
		"Raw text": "",
		"Remove": "Entfernen",
		"Remove all repeats": "Entferne alle Wiederholungen",
		"You must specify an interval as a number of minutes between 1 and 1440.": "",
		"The phrase labeled with \"${id}\" is already being repeated in this room.": "",
		"${user.name} set the phrase labeled with \"${id}\" to be repeated every ${interval} minute(s).": "",
		"${user.name} set the Room FAQ \"${topic}\" to be repeated every ${interval} minute(s).": "",
		"The phrase labeled with \"${id}\" is not being repeated in this room.": "",
		"The text for the Room FAQ \"${topic}\" is already being repeated.": "",
		"${user.name} removed the repeated phrase labeled with \"${id}\".": "",
		"There are no repeated phrases in this room.": "Es gibt keine wiederholten Ausdrücke in diesem Raum.",
		"${user.name} removed all repeated phrases.": "${user.name} hat alle wiederholten Ausdrücke entfernt.",
		"You must specify a room when using this command in PMs.": "Du musst einen Raum angeben, falls du diesen Befehl in einer privaten Nachricht verwendest.",
	},
};
