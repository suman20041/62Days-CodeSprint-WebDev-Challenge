/**
 * Installable triggers offer more capabilities than simple triggers but must be
 * installed programmatically or manually. Time-driven triggers are one type of
 * installable trigger.
 */

/**
 * This is the function we want to run on a schedule.
 */
function scheduledFunction() {
  // This could be any task, like sending a daily report email
  // or cleaning up a sheet.
  Logger.log("This function was run by a time-driven trigger at " + new Date());
}

/**
 * This function creates a new time-driven trigger programmatically.
 * To run this, you must execute this function once. It will require authorization.
 * The trigger will then run `scheduledFunction` every day.
 */
function createTimeDrivenTrigger() {
  // First, delete any existing triggers to avoid duplicates.
  deleteAllTriggers();

  // Create a trigger that runs 'scheduledFunction' every day at a specific time.
  ScriptApp.newTrigger('scheduledFunction')
      .timeBased()
      .everyDays(1) // Run every 1 day
      .atHour(9)    // around 9 AM
      .create();
      
  Logger.log("Time-driven trigger created successfully.");
}

/**
 * A helper function to delete all triggers in the current project.
 * This is useful to prevent creating multiple identical triggers.
 */
function deleteAllTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers();
  for (const trigger of allTriggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  Logger.log("All existing triggers have been deleted.");
}