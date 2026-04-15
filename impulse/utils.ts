/*
* Pokemon Showdown
* Utility Module
*/

export const Table = (title: string, headerRow: string[], dataRows: string[][]): string => {
	let output = `<div class="themed-table-container" style="max-width: 100%; max-height: 380px; overflow-y: auto; overflow-x: hidden;">`;
	
	output += `<h3 class="themed-table-title">${title}</h3>`;
	
	output += `<table class="themed-table" style="width: 100%; border-collapse: collapse; table-layout: fixed;">`;
	
	output += `<tr class="themed-table-header">`;
	headerRow.forEach(header => { output += `<th>${header}</th>`; });
	output += `</tr>`;
	
	dataRows.forEach(row => {
		output += `<tr class="themed-table-row">`;
		row.forEach(cell => { output += `<td>${cell}</td>`; });
		output += `</tr>`;
	});
	
	output += `</table></div>`;
	return output;
};
