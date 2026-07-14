/**
 * Simple triggers are a set of reserved function names in Apps Script that run automatically
 * when a certain event occurs. They do not require any authorization to run, but have
 * some restrictions.
 */

/**
 * Runs automatically when a user opens a spreadsheet, document, presentation, or form
 * that they have permission to edit.
 *
 * @param {Object} e The event object. For onOpen, it contains authMode, source, and user.
 */
function onOpen(e) {
  // In a Spreadsheet, this could add a custom menu.
  SpreadsheetApp.getUi()
      .createMenu('Custom Menu')
      .addItem('Show Alert', 'showAlert')
      .addToUi();
  
  Logger.log('Document opened. Event object:');
  Logger.log(e);
}

/**
 * Runs automatically when a user changes a value in a spreadsheet.
 *
 * @param {Object} e The event object containing information about the edit.
 */
function onEdit(e) {
  const range = e.range; // The range that was edited.
  const oldValue = e.oldValue;
  const newValue = e.value;

  // Log the details of the edit.
  Logger.log(`Cell ${range.getA1Notation()} was edited.`);
  Logger.log(`Old value: ${oldValue}`);
  Logger.log(`New value: ${newValue}`);
  
  // Example: Set a comment on the edited cell.
  range.setNote(`Edited on ${new Date()} from "${oldValue}" to "${newValue}".`);
}

/**
 * A helper function called by the custom menu created in onOpen.
 */
function showAlert() {
  SpreadsheetApp.getUi().alert('You clicked the custom menu item!');
}