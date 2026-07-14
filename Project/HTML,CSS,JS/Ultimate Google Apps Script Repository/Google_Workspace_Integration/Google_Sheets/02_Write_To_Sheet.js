/**
 * This script demonstrates how to write data to a Google Sheet.
 *
 * SETUP:
 * 1. Create a new Google Sheet.
 * 2. In the script editor, go to "File" > "Project properties" and add a script property.
 *    - Property name: SPREADSHEET_ID
 *    - Property value: The ID of your spreadsheet (from its URL).
 */
function writeToSheet() {
  try {
    const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!SPREADSHEET_ID) {
      throw new Error("SPREADSHEET_ID not set in script properties.");
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName('Log');

    // If the 'Log' sheet doesn't exist, create it.
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Log');
      // Add headers to the new sheet.
      sheet.appendRow(['Timestamp', 'Message']);
      Logger.log("Created 'Log' sheet.");
    }

    // Data to be written.
    const timestamp = new Date();
    const message = 'This is a log entry from an Apps Script.';

    // Append a new row to the sheet.
    sheet.appendRow([timestamp, message]);
    
    Logger.log('Successfully wrote a new row to the sheet.');

  } catch (e) {
    Logger.log(`Error: ${e.message}`);
    SpreadsheetApp.getUi().alert(`Error: ${e.message}. Please check setup instructions.`);
  }
}