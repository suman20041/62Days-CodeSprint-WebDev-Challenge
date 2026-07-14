/**
 * This script demonstrates how to programmatically create a trigger that
 * runs a function whenever a Google Form is submitted.
 *
 * SETUP:
 * 1. Create a new Google Form.
 * 2. In the script editor (Tools > Script editor), get the Form's ID from the URL.
 * 3. Run the `createFormSubmitTrigger` function once to install the trigger.
 *    You will need to authorize the script.
 */

// The ID of the Google Form you want to attach the trigger to.
// REPLACE THIS WITH YOUR FORM'S ID.
const FORM_ID = 'YOUR_FORM_ID_GOES_HERE';

/**
 * This function will be executed every time the form is submitted.
 * @param {Object} e The event object containing the form response.
 */
function onFormSubmit(e) {
  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();
  
  Logger.log(`New form submission received at: ${formResponse.getTimestamp()}`);
  
  for (let i = 0; i < itemResponses.length; i++) {
    const itemResponse = itemResponses[i];
    const question = itemResponse.getItem().getTitle();
    const answer = itemResponse.getResponse();
    Logger.log(`Question: "${question}" | Answer: "${answer}"`);
  }
  
  // You could now use this data to:
  // - Send an email (GmailApp)
  // - Create a calendar event (CalendarApp)
  // - Add a row to a spreadsheet (SpreadsheetApp)
}

/**
 * Run this function ONCE to create the installable trigger for your form.
 */
function createFormSubmitTrigger() {
  if (FORM_ID === 'YOUR_FORM_ID_GOES_HERE') {
    Logger.log('Please replace FORM_ID with your actual Google Form ID.');
    return;
  }
  
  // First, delete any existing triggers for this function to avoid duplicates.
  const allTriggers = ScriptApp.getProjectTriggers();
  for (const trigger of allTriggers) {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Create the trigger for the specific form.
  const form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
    
  Logger.log('Form submit trigger created successfully.');
}