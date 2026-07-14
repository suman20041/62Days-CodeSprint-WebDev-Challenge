/**
 * This script demonstrates how to read data from a Google Sheet.
 * It assumes you have a spreadsheet with some data.
 *
 * SETUP:
 * 1. Create a new Google Sheet.
 * 2. In cell A1, type "Name". In B1, type "Score".
 * 3. Add a few rows of data below the headers (e.g., "Alice", 100; "Bob", 95).
 * 4. In the script editor, go to "File" > "Project properties" and add a script property.
 *    - Property name: SPREADSHEET_ID
 *    - Property value: The ID of your spreadsheet (from its URL).
 */
function readSheetData() {
  try {
    // Get the spreadsheet ID from script properties.
    const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!SPREADSHEET_ID) {
      throw new Error("SPREADSHEET_ID not set in script properties.");
    }

    // Open the spreadsheet by its ID and get the first sheet.
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];
    
    // Get all the data in the sheet.
    // This returns a 2D array.
    const data = sheet.getDataRange().getValues();
    
    Logger.log(`Reading data from sheet: ${sheet.getName()}`);

    // Loop through the data (skipping the header row at index 0).
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[0];
      const score = row[1];
      
      if (name) { // Only process rows that have a name.
        Logger.log(`Name: ${name}, Score: ${score}`);
      }
    }

  } catch (e) {
    Logger.log(`Error: ${e.message}`);
    SpreadsheetApp.getUi().alert(`Error: ${e.message}. Please check setup instructions.`);
  }
}