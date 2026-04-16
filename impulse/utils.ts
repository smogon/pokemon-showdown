/*
* Pokemon Showdown
* Utility Module
*/

/*export const Table = (title: string, headerRow: string[], dataRows: string[][]): string => {
	let output = `<div class="themed-table-container" style="max-width: 100%; max-height: 380px; overflow-y: auto;">`;
	output += `<h3 class="themed-table-title">${title}</h3>`;
	output += `<table class="themed-table" style="width: 100%; border-collapse: collapse;">`;
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
*/
export const Table = (title: string, headerRow: string[], dataRows: string[][]): string => {
    let output = `<div class="themed-table-container" style="max-width: 100%; max-height: 380px; overflow-y: auto; overflow-x: hidden;">`;
    output += `<h3 class="themed-table-title">${title}</h3>`;
    
    // table-layout: fixed forces the table to respect the container width
    output += `<table class="themed-table" style="width: 100%; border-collapse: collapse; table-layout: fixed;">`;
    
    // Style for cells to ensure text wrapping
    const cellStyle = `style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; padding: 8px; text-align: left;"`;

    // Generate Header
    output += `<tr class="themed-table-header">`;
    headerRow.forEach(header => { 
        output += `<th ${cellStyle}>${header}</th>`; 
    });
    output += `</tr>`;
    
    // Generate Body
    dataRows.forEach(row => {
        output += `<tr class="themed-table-row">`;
        row.forEach(cell => { 
            output += `<td ${cellStyle}>${cell}</td>`; 
        });
        output += `</tr>`;
    });
    
    output += `</table></div>`;
    
    return output;
};
