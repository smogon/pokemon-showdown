import type {Translations} from '../../server/chat';

export const translations: Translations = {
	strings: {
		"Repeated phrases in ${room.title}": "Wiederholte Ausdrücke in ${room.title}",
		"There are no repeated phrases in ${room.title}.": "Es liegen keine wiederholten Ausdrücke in ${room.title} vor.",
		"Action": "Vorgang",
		"Phrase": "Ausdruck",
		"Identifier": "Kennzeichnung",
		"Interval": "Zeitspanne",
		"every ${minutes} minute(s)": "jede ${minutes} Minute(n)",
		"Raw text": "Rohtext",
		"Remove": "Entfernen",
		"Remove all repeats": "Entferne alle Wiederholungen",
		"You must specify an interval as a number of minutes between 1 and 1440.": "Du musst eine Zeitspanne als eine Zahl zwischen 1 und 1440 angeben.",
		'The phrase labeled with "${id}" is already being repeated in this room.': 'Der Ausdruck "${id}" wird bereits im Raum wiederholt.',
		'${user.name} set the phrase labeled with "${id}" to be repeated every ${interval} minute(s).': '${user.name} hat eingestellt, dass der Ausdruck "${id}" jede ${interval} Minute(n) wiederholt wird.',
		'${user.name} set the Room FAQ "${topic}" to be repeated every ${interval} minute(s).': '${user.name} hat eingestellt, dass der Raum-FAQ "${topic}" jede ${interval} Minute(n) wiederholt wird.',
		'The phrase labeled with "${id}" is not being repeated in this room.': 'Der Ausdruck "${id}" wird gerade nicht in diesem Raum wiederholt.',
		'The text for the Room FAQ "${topic}" is already being repeated.': 'Der Text für den Raum-FAQ "${topic}" wird bereits wiederholt.',
		'${user.name} removed the repeated phrase labeled with "${id}".': '${user.name} hat den sich wiederholenden Ausdruck "${id}" entfernt.',
		"There are no repeated phrases in this room.": "Es gibt keine wiederholten Ausdrücke in diesem Raum.",
		"${user.name} removed all repeated phrases.": "${user.name} hat alle wiederholten Ausdrücke entfernt.",
		"You must specify a room when using this command in PMs.": "Du musst einen Raum angeben, falls du diesen Befehl in einer privaten Nachricht verwendest.",
	},
};
