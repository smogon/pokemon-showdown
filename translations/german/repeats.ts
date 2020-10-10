import type {Translations} from '../../server/chat';

export const translations: Translations = {
	strings: {
		"Repeated phrases in ${room.title}": "Wiederholte Ausdrücke in ${room.title}",
		"No such room: \"${roomid}\".": "Kein derartiger Raum: \"${roomid}\".",
		"There are no repeated phrases in ${room.title}.": "Es liegen keine wiederholten Ausdrücke in ${room.title} vor.",
		"Phrase": "Ausdruck",
		"Interval": "Zeitspanne",
		"every ${minutes} minute(s)": "jede ${minutes} Minute(n)",
		"Remove": "Entfernen",
		"Remove all repeats": "Entferne alle Wiederholungen",
		"You must specify a numerical interval of at least 1 minute.": "Du musst einen Ziffernschrittwert von mindestens 1 Minute angeben.",
		"The phrase \"${message}\" is already being repeated in this room.": "Der Ausdruck \"${message}\" wird bereits in diesem Raum wiederholt.",
		"${user.name} set the phrase \"${message}\" to be repeated every ${interval} minute(s).": "${user.name} hat eingestellt, dass der Ausdruck \"${message}\" jede ${interval} Minute(n) wiederholt wird.",
		"The phrase \"${target}\" is not being repeated in this room.": "Der Ausdruck \"${target}\" wird in diesem Raum nicht wiederholt.",
		"${user.name} removed the repeated phrase \"${target}\".": "${user.name} hat den Ausdruck \"${target}\" entfernt.",
		"There are no repeated phrases in this room.": "Es gibt keine wiederholten Ausdrücke in diesem Raum.",
		"${user.name} removed all repeated phrases.": "${user.name} hat alle wiederholten Ausdrücke entfernt.",
		"You must specify a room when using this command in PMs.": "Du musst einen Raum angeben, falls du diesen Befehl in einer privaten Nachricht verwendest.",
	},
};
