/*
* Hangman chat plugin
* By bumbadadabum and Zarel. Art by crobat.
*/

'use strict';

const permission = 'announce';
const maxMistakes = 6;

class Hangman extends Rooms.RoomGame {
	constructor(room, user, word, hint) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.gameid = 'hangman';
		this.title = 'Hangman';
		this.creator = user.userid;
		this.word = word;
		this.hint = hint;
		this.incorrectGuesses = 0;

		this.guesses = [];
		this.letterGuesses = [];
		this.lastGuesser = '';
		this.wordSoFar = [];

		for (let i = 0; i < word.length; i++) {
			if (/[a-zA-Z]/.test(word[i])) {
				this.wordSoFar.push('_');
			} else {
				this.wordSoFar.push(word[i]);
			}
		}
	}

	guess(word, user) {
		if (user.userid === this.room.game.creator) return user.sendTo(this.room, "You can't guess in your own hangman game.");

		let sanitized = word.replace(/[^A-Za-z ]/g, '');
		let normalized = toId(sanitized);
		if (normalized.length < 1) return user.sendTo(this.room, "Guess too short.");
		if (sanitized.length > 30) return user.sendTo(this.room, "Guess too long.");

		for (let i = 0; i < this.guesses.length; i++) {
			if (normalized === toId(this.guesses[i])) return user.sendTo(this.room, "Your guess has already been guessed.");
		}

		if (sanitized.length > 1) {
			if (!this.guessWord(sanitized, user.name)) {
				user.sendTo(this.room, "Invalid guess");
			} else {
				this.room.send(user.name + " guessed \"" + sanitized + "\"!");
			}
		} else {
			if (!this.guessLetter(sanitized, user.name)) {
				user.sendTo(this.room, "Invalid guess");
			}
		}
	}

	guessLetter(letter, guesser) {
		letter = letter.toUpperCase();
		if (this.guesses.indexOf(letter) >= 0) return false;
		if (this.word.toUpperCase().indexOf(letter) > -1) {
			for (let i = 0; i < this.word.length; i++) {
				if (this.word[i].toUpperCase() === letter) {
					this.wordSoFar[i] = this.word[i];
				}
			}

			if (this.wordSoFar.indexOf('_') < 0) {
				this.incorrectGuesses = -1;
				this.guesses.push(letter);
				this.letterGuesses.push(letter + '1');
				this.lastGuesser = guesser;
				this.finish();
				return true;
			}
			this.letterGuesses.push(letter + '1');
		} else {
			this.incorrectGuesses++;
			this.letterGuesses.push(letter + '0');
		}

		this.guesses.push(letter);
		this.lastGuesser = guesser;
		this.update();
		return true;
	}

	guessWord(word, guesser) {
		let ourWord = toId(this.word);
		let guessedWord = toId(word);
		if (ourWord === guessedWord) {
			for (let i = 0; i < this.wordSoFar.length; i++) {
				if (this.wordSoFar[i] === '_') {
					this.wordSoFar[i] = this.word[i];
				}
			}
			this.incorrectGuesses = -1;
			this.guesses.push(word);
			this.lastGuesser = guesser;
			this.finish();
			return true;
		} else if (ourWord.length === guessedWord.length) {
			this.incorrectGuesses++;
			this.guesses.push(word);
			this.lastGuesser = guesser;
			this.update();
			return true;
		}
		return false;
	}

	hangingMan() {
		switch (this.incorrectGuesses) {
		case 0:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAB3RJTUUH3wsYBiYi3/L0SQAAANRJREFUeNrt1EEKwCAQBMGdkP9/efKFgAdRqu6i2K4zAAAAAAAAC7Jr47Y9+uKSnHDOxxu/m8CXe313JhiBERiBERiBEVhgBEZgBEZgBEZggREYgREYgREYgRFYYARGYARGYARGYIERGIERGIERGIEFRmAERmAERmAERmCBERiBERiBERiBBUZgBEZgBEZgBBYYgREYgREYgREYgQVGYARGYARGYAQWGIERGIERGIH5JSuL29YVziSJCUZgBEZgBBYYgREYgREYgRFYYARGYAAAAIBtPqaZCMtmU2/iAAAAAElFTkSuQmCC" />';
		case 1:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsYBxEIlYz3nAAAAZ1JREFUeNrt3T1Ow0AQgFFPlIYGyUfI/W+Xim6oaKKNif+U2c17JRYG8nnWa1JkmgAAAAAAAHaId/3gzMyuX7iI6OH3vLjGxybw4K6Wu7FvLSbYEk3PG0OBN8btJbbA/0Tt/XFO4J3LcfWLQOCD7rVVQwtsF82TZ/evHu7PAm9fmn9M8CBxW8daX6v4HzmBD3qmnef5VnGzVeLtwjOu/L/zv3LuxyAR8Z2Z95X35GicJ0xwzYm+v2MVEPi8HXGM+rcJ3A4+PWu+dKziRSPw4C4DT2GsmaJRl+nrqIHX7KIb37vpmAm2aTPBdsYm2IUlsKkffok+6nl4zWar4gUicCNSZmZELO6YH49XnX6BN05wL0u7wAtTPMI9W+AX4lV8G1Bgu2uPSZ9AYIERGIERGIERGIEFRmAERmAERmAEFhiBERiBERiBERiBBUZgBEZgBEZgBBYYgREYgREYgRFYYARGYARGYARGYAQWGIERGIERmK12fRZB9vZRnGe9iIU/08EEW6IRGIERGIERGIEFRmAERmAERmAEBgAAAD7AL2c3lRYl0mtCAAAAAElFTkSuQmCC" />';
		case 2:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsYBxUWC+8P+wAAAixJREFUeNrt3VtygzAMQFGcZgPZ/2Ldn2aGZghPA7J97meZpDQXWRLCzTAAAAAAAAAAAAAcIN31i3POueoPLqVUw3k+XONtQ3DjPC13bacWEWyJRs2FIcE75dYim+AFqbW3cwQfXI6jXwQEF8q1UUUTrIrGt969hvxMcOVtEMEF5E4dm/pZxDtyBBeK3Nfr9ROx2AoxLrz7yv8Usie/Tr0mQkSL4IJtkhwcuCLWJqHKi4bgxiG48WWaYBHcdVQP3wJ74VgiGATL5cd5UvJfzviGxdy9i1rmEgSvyMNrJUesxAmeieKU0mykjo9HbbPk4MZ76O6mSUtDgfe5rB0ejM997XsTfIPYORFzY8Ccc946XrxSdDc5eIuET2lLwvdcbFdJ7qrI2vugXMlZ79XLdHdFVvqjl7+32zZpazFVa6XdfR98tui7Vwt98ISIvQ/dRUwFBBeItnG1HS3HE1xYcjQIbiTXKrIaESaCIYLPyqk2nzUsN2qhRXBhSdEkE3yCnEiSCT5JShTJBA/njQMjSH70LnZp0/ZcZTx17MphPsEb25pS/znnLdmwIaBkObhRyXtFf3udDeAVFFtLkr5FqRzcWIX9FhrxeS/3ogtFnnGhIswSDYJBMAgmGASDYBAMgkEwCCYYBINgEAyCQTAIBsEEg2AQDIJBMAgGwQSjJQ7tu8m1fP3X2R9i4P1LItgSDYJBMAgGwSAYBBMMgkEwCAbBIBgEAwAAAACADvgFjA8sNcfL6OQAAAAASUVORK5CYII=" />';
		case 3:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsYBi02Jtz5/wAAAo9JREFUeNrt3cmOozAUQNEYlVrqZf7/WzvuTdJKI4YAJjzb526JqITrN3hAdbsBAAAAAAAAAAAcIF31h3POueoHl1Kq4XsOxnjbENw4P9Jd26VFBEvRqLkxJHin3FpkE7witfbpHMEH03H0QUBwoVobVTTBumjMzN2HGuozwZVPgwguIHfqWs75MRHVieBGI/d+v/+K2GyF2C68euSPhTzr62NjTU4T90kiOGZEP67IAgSf1xGnVn8bwY0PGoIbh+DG0zTBIrjLaL7NBfTStYjZgGARjJpr+Q8l/8tZW2msbT+C4JVavEV0xE6c4JkoTiktRuv4etRplhrc+By6uwhe2xRIT9Y+97r8LveTe3998EV40N/44Vt2e8bfZ2o78fXscs5/PhkQV4nuJoK3SHjW4H+fXxO+Z7B9S3JXKXprpJUSemWa7q7JetXYXn5vt9OkLc1RzZ12t9Ok98NxZz78qzNG9/Pgl+h3CXtq9VhilFIw9Cq1ZBp9zwTRaryVrJHYo5KjMYjeupsoXfROMa1MpaRo8+B20/NSlO5J5V4+a7xOe8O/gm65xEaCFH1hRJZOy3P38erKhbKn3uEtHXlRInnoQeTa6lLh7cDfkSQ3eaLj06XIqc+N16GX1qXnri0dFlCDT0yNY3FbZKrBlQ6Es0SowYEe6pEdoOhLnV0vdKx10muSSm87EnzCgkeJrPC6X8TzXl3vJk2dwvjGoCG40miPyNCrjF6Ozg4tRtySvJ7ORDedonsTqYsmGASDYBAMgkEwCAbBBINgEAyCQTAIBsEEg2AQDIJBMAgGwQSjVQ4dDs+1/Ruwsx5i4EP2IliKBsEgGASDYBAMggkGwSAYBINgEAyCAQAAAABAB/wFQ/WHPqgksFQAAAAASUVORK5CYII=" />';
		case 4:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsYBw8v5Md9KAAAArVJREFUeNrt3Vty4yAQQFHj0Qa8/7WmND9RleISeoIAce5n7CBZl24ejZPXCwAAAAAAAAAA4AKh1IXHcRybfnAhhBbu862PPxuCH84g3T17aBHBUjRanhgSfFJuK7IJ3pDa+nKO4IvpuPZOQHCisbZW0QSbRSO2dm9hfCa48WUQwQnkLr229LMad+QIThS5n8/nXeNkq4pyYeme/y0khPBvHMefq2NyDREtgpeF/5TIAgRnnBFbJqHJTkPwwyH44WmaYBHcfWS/YsEde62mbECwCEbLY/lAyV85C0dzou9voTZB8M5xeI/kGmfiBG9EcQhhNVKn12tdZhmDn95hS124VDVpqygw3cuR4sHe3ykR5d0IPiMs9rtL93ulfYILSZ7ev0f40XLhXZ+5q0nW2YNyKWu9d6fp7iZZ4ZdePm+3y6S55DtOY5TqVN0uk+aH43I+/CljlDrS0/06eBI9l5xi0jQfCqa2Skh+9yo1ZRqdZ4LvMb70107tZH2JvSq5lrG3W8G5IuiIyDujeBC9y2JSRp5JlnmACM7xUNei9IyAtfZKRbEIThhdR6pJd02+ui0Xxq6ZIsr2fp47NlqG3iIydVqOtZOzAxF8QnbqB78kOTYHyBnJQ08iYxJTlwPnW5NLW5ix6+YQ/cgxeO+uUuzPMHzf21p7W23suWbOdfjw5Mjd6lRHZKYYgy2TCnSEXDPYq0WGVJ3h3Uv0bqXDs6Lv2OokOFOUbUmqtYLUveDUlZ+pvT2Z4G75XVeT1pYwOTsNwY1G+971sRR9g4wiXyMpcH/vJ0bcVtmu9o5oJwtm0SCYYBAMgkEwCAbBIJhgEAyCQTAIBsEgmGAQDIJBMAgGwSAYBHfDpQPnYwv/+uuOh1jxwX0RLEWDYBAMgkEwCAbBBINgEAyCQTAIBsEAAAAAAKAD/gMf5dQqrDoVbQAAAABJRU5ErkJggg==" />';
		case 5:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3wsYBwIVl2Xa1wAAAytJREFUeNrtncFy3CAMQJHjHHPY//+0/EDvPeagHhJnGNc2xhYGxHszPSTdso4fEhJ40xAAAAAAAAAAAAAAAABuILXeWFW16xsnIj1c58Qc9w2CnTOT7nwvLUQwKRp6LgwRfFFuL7IRnJDaezuH4JvpuPVJgGCjtbZV0Qimioa93r2H9RnBnbdBCDaQu/V3W99rcUcOwUaR+3q9phaLrSaOC2vP/LUQEflQ1b931+QWIhrBBdfeFgSTokNfp1kILjMBDr9uedIgOFNujmQEN5ymReRX4nqJXr6OX4Pg/lon09chmKKtCDM6rkVnL7uaRLDzlgvBzvthUnRa+lcI4S187/rJUZrmsKGzKBaRP6r6rqqTqoqqhvhP7LPV6EfwMZ+9p/bhDhtSBwvLtZw9gIiv/ezYCK4g9kjEmWPAO+NTZBmtrTmPwsavF5H3EIL+3K+3u+e+y/gIrih5JeSr11ZsuCJLfhjl5x22D84pjnqM3OHbpPjhuJI3f8kYtR7EG74PXkSvNjiyhWycJ8u65aoheRpVqmUajTPBeo2v/bFTdrLCf9uT0sKkQfADGx6liqgno3gmerfFWEYeRRZ1ABFc4qYeRekVAUfj1YpiItgwunJOk54qvoY9Ltx7T4soO/vzPLHRMo8WkdZpeW+ckhMIwRdkW9/4Lcl7NUDJSJ5HErkn0VJuXExtST6zy2Xaonlcg8/uKu39Gob1tR2NlxrjzHuW7MNnz5GbmlQ5Mi3WYNqkChOhVAV795DBajJMo0RvKh1eFf3EVieCC0VZSlKrJ0jDC7Y++VnGO5MJeOiuouhYUK6IVh/k48NnCVlW4modNszexFj0maV+TWHOGFYTa/IYfalju9ZrAMtrdJuiW3+4/anr4zy4w8mBYEAwggHBgGBAMCAYEFyyF+65L0bwDstjN738B1gIvii55oe3EVxQLGswIBgQDAgGBD/cFyPYmcyeNzp4qtJZxBLBrMGAYEAwIBieKBbv/GNPm/JeK24imBQNCAYEA4IBwYBgQDCCAcGAYEAwIBgQDAgG8ItwC3ynaAQPIBjJjgUjeRDB4Fgwop2vwaRpp/wDpAYHVSDzEocAAAAASUVORK5CYII=" />';
		case 6:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAB3RJTUUH3wsYBxkwdVfFCgAAAwRJREFUeNrtnVFuwyAMQCHKBXr/q05jP4tEIwgEDBh472dTs6VZHsY2tJ0xAAAAAAAAAAAAAAAAFdhRT+ycc1PfOGvtDNd5MMbXBsGLczLdrZ1aiGCmaJi5MERwodxZZCM4IXX2dg7BldOx9kGAYKFcq1U0gqmiIda7z5CfETx5G4RgAbmhY6HHNK7IIVgocj+fj9VYbKnYLhw98u9CSvJr6Hc0RDQRLNgmkYMVV8S0STDloEFwXNDX17fHiWDlEeecM9ZaE0utqeMIniCCL4klx2mTFLVJ0pWwpqKNCF4cBC/eciF48X74RGteuxSrpLUPEAQHovgqtlJtkH9ca/QzRS8+tW/XJqVaoetaclsm/9pzz43gwT1uYFUruQ1Yc36m6M7T6CXLy8Vf3I+3HGwI7pAr/Vdp1Mq5BglTtJJcLB2Vvf/WbduknOJIUtqoSnvbNsmfdlve/HveRvAg0b7k0hfdxXKtVP5GcGW+rCnC7tV27Ll6S2Yl6ya2VrKW3Lut4FYRVNJnU0UP7I0lI48iizqACG5xU5+itETA0/lGRTERLBhdb1bHehVf224Xxp5TIspy/54eCy3nbhEpPS3HztNyACG4QLb0jQ9JjtUALSP53ETk+f/YT+uostYezrnfmGRr7WGMCS5dthC9ZA7OXVWKfQzD/dqezpc6R85ztuzDz5UjNzWo3siUyMG0SQMGQqsKtnaTQWowHLtEb2o6LBXdY6kTwY2iLCVJ6w7S9oKld36u8+XMBL3lbx3BT6/CeCtC67sbeG9SQtbbaH/KySOq6HM1MRJ9Zu7HFNa+bqvHjHCsGH2pbTvtNYDkNS47RQ95o9eACKXImmRwIBgQDAhGMCAYEAwIBgRr6YVz9nxX/tT4IpyH1usLff/2Z4YPVA03UOPoz9lwmOF/JzFFZ8ot+RkEA4IBwYBgBMOLvnimvhfBFTJnkE4fzBQNCAYEA4IBwdC1ip5lwb13W0UEA4IBwYBgQDCCAcGAYEAwIBgQDAhGMCAYEAwAAAAAAAAA0JU/CGM5TvdbpqQAAAAASUVORK5CYII=" />';
		default:
			return '<img width="120" height="120" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAB3RJTUUH3wsYBx0ayoDJ2AAAA4tJREFUeNrtnd1yozAMRmOS2+1M3v8ld6a93dIrZlwv/sMSWOJ8dy0BHB9LsmRDHg+EEEIIIYQQQgghhBBCCKEBhatuvK7rarrjQggW2rkwxn0LwM71wt0BGA3OK0IIYTu2Debc3+mgL51XuyYueuKBITUJxYIVQs2eJbWAy1nz9r9SKMvdE8AGXHzteGlA4aIvsHKtSeXeAACwEfilQRGfl0IGsMEY33XODPGGPFhPWDCAkWWRJjWEkdEQckYVCwsWzkk17yN5bwA3dPoZsLXyYwBHELVAxi5Wyu0DWMEdjwyCGKgE3FaLfwG3H5iGFZbaUYrTTLIm1x6g7X+lY6RJwhAk4vPROnPvOVhwv2s2W0p9eYfXu+ieiXffRyxohnr74g1sLYeVcLXv9/tZm1Xv3feKveAuVpNqHRdff6cs+Gdd18/RmJx+h542AVgglpb2O0nPhnvbhItWTks8yzTgHmvUjH9HrFe7TRQ6/of0N4TwlTn2L4TwTZo0bx7bUrj4KMxJnprfQzNsLE6tMRzsizBRe+5twVLlw8iSDh0bhacN36wF51zbaO1Wy1pzbdWeaC1W4caQe4sMZ7vevaJIDFd1hm+10NFTScpdf7RjWx4Gq7VN27u4qmT1Xic5txZrfx0/2uazFyDMp0kjcSxxk49Sf0vAzd1bE7T55ULJPDIHWRKudk3cBeCeTXK1zk49QGtKJLmgoFnscL/g39KxleXEcPT6aSih0CFU8OhxgxvkHAiJGW+ujWe46ZdHa92DJeXWpeItMVghFTtzy8zZ98vJZCWrx03GMfbqcqXU529hwUc7RdOy0jbNsHvklgv+6XNCvbPiPZCzbgW67ZMNo5bM64Qdu3lL77pmT5Zj6721i7YKDAtGWLBETGWS5RiupYnWAtzrzgfwxHCtQF6A6xvyAlyZ9GpWyMudwNYW73tfhqL9XBGAB9IaqVWl3OZ7AE8AmRjsFPLIWvKZAwfAglZXg1T6VTNisBF33eJq4+0/FsqVrAc/5tpD5S5tsfpD0VbazeuEd0CNPs2Ai0YAvmtODeCbggIwAjCAEYARgBGAEYARgDVy4ZY1XxYbGjTTYkPyGqX16GemHLwzdOqVFtGykG91sR8XTQz2HyZqx3p/JQ0XPZmLdj+B1LKAu87CcdEIwAjACMAIwABGAEYARgBGAEYARgAGMAIwAjBCCCGEEEIIIYTQ6foBqfbkL/zU5o4AAAAASUVORK5CYII=" />';
		}
	}

	generateWindow() {
		let result = 0;

		if (this.incorrectGuesses === maxMistakes) {
			result = 1;
		} else if (this.wordSoFar.indexOf('_') < 0) {
			result = 2;
		}

		let output = '<div class="broadcast-' + (result === 1 ? 'red' : (result === 2 ? 'green' : 'blue')) + '">';
		output += '<p style="text-align:left;font-weight:bold;font-size:10pt;margin:5px 0 0 15px">' + (result === 1 ? 'Too bad! The mon has been hanged.' : (result === 2 ? 'The word has been guessed. Congratulations!' : 'Hangman')) + '</p>';
		output += '<table><tr><td style="text-align:center;">' + this.hangingMan() + '</td><td style="text-align:center;width:100%;word-wrap:break-word">';

		let wordString = '';
		if (result === 1) {
			for (let i = 0; i < this.wordSoFar.length; i++) {
				if (i) wordString += '<small>&nbsp;</small>';
				if (this.wordSoFar[i] === '_') {
					wordString += '<font color="#7af87a">' + this.word[i] + '</font>';
				} else {
					wordString += this.wordSoFar[i];
				}
			}
		} else {
			wordString = this.wordSoFar.join('<small>&nbsp;</small>');
		}

		if (this.hint) output += '<div>(Hint: ' + Tools.escapeHTML(this.hint) + ')</div>';
		output += '<p style="font-weight:bold;font-size:12pt">' + wordString + '</p>';
		if (this.guesses.length) {
			if (this.letterGuesses.length) {
				output += 'Letters: ' + this.letterGuesses.map(function (g) {
					return '<strong' + (g[1] === '1' ? '' : ' style="color: #DBA"') + '>' + Tools.escapeHTML(g[0]) + '</strong>';
				}).join(', ');
			}
			if (result === 2) {
				output += '<br />Winner: ' + Tools.escapeHTML(this.lastGuesser);
			} else if (this.guesses[this.guesses.length - 1].length === 1) {
				// last guess was a letter
				output += ' <small>&ndash; ' + Tools.escapeHTML(this.lastGuesser) + '</small>';
			} else {
				output += '<br />Guessed: ' + this.guesses[this.guesses.length - 1] + ' <small>&ndash; ' + Tools.escapeHTML(this.lastGuesser) + '</small>';
			}
		}

		output += '</td></tr></table></div>';

		return output;
	}

	display(user, broadcast) {
		if (broadcast) {
			this.room.add('|uhtml|hangman' + this.room.gameNumber + '|' + this.generateWindow());
		} else {
			user.sendTo(this.room, '|uhtml|hangman' + this.room.gameNumber + '|' + this.generateWindow());
		}
	}

	update() {
		this.room.add('|uhtmlchange|hangman' + this.room.gameNumber + '|' + this.generateWindow());

		if (this.incorrectGuesses === maxMistakes) {
			this.finish();
		}
	}

	end() {
		this.room.add('|uhtmlchange|hangman' + this.room.gameNumber + '|<div class="infobox">(The game of hangman was ended.)</div>');
		this.room.add("The game of hangman was ended.");
		delete this.room.game;
	}

	finish() {
		this.room.add('|uhtmlchange|hangman' + this.room.gameNumber + '|<div class="infobox">(The game of hangman has ended &ndash; scroll down to see the results)</div>');
		this.room.add('|html|' + this.generateWindow());
		delete this.room.game;
	}
}

exports.commands = {
	hangman: {
		create: 'new',
		new: function (target, room, user) {
			let params = target.split(',');

			if (!this.can(permission, null, room)) return false;
			if (room.hangmanDisabled) return this.errorReply("Hangman is disabled for this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.game) return this.errorReply("There is already a game in progress in this room.");

			if (!params) return this.errorReply("No word entered.");
			let word = params[0].replace(/[^A-Za-z '-]/g, '');
			if (word.replace(/ /g, '').length < 1) return this.errorReply("Enter a valid word");
			if (word.length > 30) return this.errorReply("Phrase must be less than 30 characters.");
			if (word.split(' ').some(function (w) { return w.length > 20; })) return this.errorReply("Each word in the phrase must be less than 20 characters.");
			if (!/[a-zA-Z]/.test(word)) return this.errorReply("Word must contain at least one letter.");

			let hint;
			if (params.length > 1) {
				hint = params.slice(1).join(',').trim();
				if (hint.length > 150) return this.errorReply("Hint too long.");
			}

			room.game = new Hangman(room, user, word, hint);
			room.game.display(user, true);

			return this.privateModCommand("(A game of hangman was started by " + user.name + ".)");
		},
		createhelp: ["/hangman create [word], [hint] - Makes a new hangman game. Requires: % @ # & ~"],

		guess: function (target, room, user) {
			if (!target) return this.parse('/help guess');
			if (!room.game || room.game.gameid !== 'hangman') return this.errorReply("There is no game of hangman running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			room.game.guess(target, user);
		},
		guesshelp: ["/hangman guess [letter] - Makes a guess for the letter entered.",
					"/hangman guess [word] - Same as a letter, but guesses an entire word."],

		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.game || room.game.gameid !== 'hangman') return this.errorReply("There is no game of hangman running in this room.");

			room.game.end();
			return this.privateModCommand("(The game of hangman was ended by " + user.name + ".)");
		},
		endhelp: ["/hangman end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~"],

		disable: function (target, room, user) {
			if (!this.can('tournamentsmanagement', null, room)) return;
			if (room.hangmanDisabled) {
				return this.errorReply("Hangman is already disabled.");
			}
			room.hangmanDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.hangmanDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Hangman has been disabled for this room.");
		},

		enable: function (target, room, user) {
			if (!this.can('tournamentsmanagement', null, room)) return;
			if (!room.hangmanDisabled) {
				return this.errorReply("Hangman is already enabled.");
			}
			delete room.hangmanDisabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.hangmanDisabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Hangman has been enabled for this room.");
		},

		display: function (target, room, user) {
			if (!room.game || room.game.title !== 'Hangman') return this.errorReply("There is no game of hangman running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.game.display(user, this.broadcasting);
		},

		'': function (target, room, user) {
			return this.parse('/help hangman');
		}
	},

	hangmanhelp: ["/hangman allows users to play the popular game hangman in PS rooms.",
				"Accepts the following commands:",
				"/hangman create [word], [hint] - Makes a new hangman game. Requires: % @ # & ~",
				"/hangman guess [letter] - Makes a guess for the letter entered.",
				"/hangman guess [word] - Same as a letter, but guesses an entire word.",
				"/hangman display - Displays the game.",
				"/hangman end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~",
				"/hangman [enable/disable] - Enables or disables hangman from being started in a room. Requires: # & ~"],

	guess: function (target, room, user) {
		if (!room.game) return this.errorReply("There is no game running in this room.");
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!room.game.guess) return this.errorReply("You can't guess anything in this game.");

		room.game.guess(target, user);
	},
	guesshelp: ["/guess - Shortcut for /hangman guess.", "/hangman guess [letter] - Makes a guess for the letter entered.",
					"/hangman guess [word] - Same as a letter, but guesses an entire word."]
};
